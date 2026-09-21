import { and, count, eq, gte, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { ensureCatalogInDb } from "@/db/catalog-sync";
import { ballots, integrityEvents, services, visitors, voteFeedback, votes } from "@/db/schema";
import { getEphemeralAbuseKey, getOrCreateAnonymousToken, setAnonymousCookie, sha256 } from "@/lib/identity";
import { votePayloadSchema } from "@/lib/vote-schema";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const parsed = votePayloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ballot.", issues: parsed.error.issues }, { status: 400 });
  }

  const db = getDb();
  await ensureCatalogInDb(db);

  const requested = await db
    .select({ id: services.id })
    .from(services)
    .where(and(inArray(services.id, parsed.data.serviceIds), eq(services.isPublic, true)));

  if (requested.length !== parsed.data.serviceIds.length) {
    return NextResponse.json({ error: "The ballot references an unavailable service." }, { status: 400 });
  }

  const identity = getOrCreateAnonymousToken(request);
  const tokenHash = sha256(identity.token);
  const abuseKey = getEphemeralAbuseKey(request);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    const result = await db.transaction(async (tx) => {
      const [visitor] = await tx
        .insert(visitors)
        .values({
          anonymousTokenHash: tokenHash,
          roleSegment: parsed.data.audience,
          locale: request.headers.get("accept-language")?.slice(0, 48) || null
        })
        .onConflictDoUpdate({
          target: visitors.anonymousTokenHash,
          set: {
            lastSeenAt: new Date(),
            roleSegment: parsed.data.audience
          }
        })
        .returning();

      const existing = await tx
        .select({ id: ballots.id })
        .from(ballots)
        .where(eq(ballots.visitorId, visitor.id))
        .limit(1);

      if (existing.length) {
        throw new Error("BALLOT_EXISTS");
      }

      const [recentAbuse] = await tx
        .select({ total: count() })
        .from(ballots)
        .where(and(eq(ballots.abuseKey, abuseKey), gte(ballots.createdAt, oneHourAgo)));

      const suspicious = Number(recentAbuse?.total || 0) >= Number(process.env.ABUSE_BALLOT_LIMIT_PER_HOUR || 10);

      const [ballot] = await tx
        .insert(ballots)
        .values({
          visitorId: visitor.id,
          audience: parsed.data.audience,
          integrityState: suspicious ? "SUSPICIOUS" : "NORMAL",
          abuseKey
        })
        .returning();

      await tx.insert(votes).values(
        parsed.data.serviceIds.map((serviceId) => ({
          ballotId: ballot.id,
          serviceId
        }))
      );

      await tx.insert(voteFeedback).values({
        ballotId: ballot.id,
        interestType: parsed.data.interestType,
        useCaseText: parsed.data.useCase.trim() || null,
        betaInterest: parsed.data.betaInterest,
        paymentInterest: parsed.data.paymentInterest
      });

      if (suspicious) {
        await tx.insert(integrityEvents).values({
          ballotId: ballot.id,
          eventType: "RATE_CLUSTER",
          detail: {
            threshold: Number(process.env.ABUSE_BALLOT_LIMIT_PER_HOUR || 10),
            windowMinutes: 60
          }
        });
      }

      await tx
        .update(visitors)
        .set({ resultsUnlockedAt: new Date(), lastSeenAt: new Date() })
        .where(eq(visitors.id, visitor.id));

      return { ballotId: ballot.id, integrityState: ballot.integrityState };
    });

    const response = NextResponse.json({
      voteAccepted: true,
      resultsUnlocked: true,
      integrityState: result.integrityState
    });

    if (identity.isNew) setAnonymousCookie(response, identity.token);
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "BALLOT_EXISTS") {
      const response = NextResponse.json(
        { error: "This anonymous visitor has already submitted a ballot." },
        { status: 409 }
      );
      if (identity.isNew) setAnonymousCookie(response, identity.token);
      return response;
    }
    throw error;
  }
}
