import { desc, eq, ne } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { ballots, integrityDecisions, integrityEvents } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin";

const decisionSchema = z.object({
  ballotId: z.string().uuid(),
  decision: z.enum(["restore", "exclude"]),
  reason: z.string().trim().min(3).max(500)
});

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const db = getDb();

  const rows = await db
    .select({
      ballotId: ballots.id,
      audience: ballots.audience,
      state: ballots.integrityState,
      createdAt: ballots.createdAt,
      eventType: integrityEvents.eventType,
      detail: integrityEvents.detail
    })
    .from(ballots)
    .leftJoin(integrityEvents, eq(integrityEvents.ballotId, ballots.id))
    .where(ne(ballots.integrityState, "NORMAL"))
    .orderBy(desc(ballots.createdAt));

  return NextResponse.json({ suspicious: rows });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = decisionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid integrity decision." }, { status: 400 });

  const db = getDb();
  const nextState = parsed.data.decision === "restore" ? "NORMAL" : "EXCLUDED_FROM_PUBLIC_RESULT";

  const updated = await db.transaction(async (tx) => {
    const [ballot] = await tx
      .update(ballots)
      .set({ integrityState: nextState })
      .where(eq(ballots.id, parsed.data.ballotId))
      .returning();

    if (!ballot) return null;

    await tx.insert(integrityDecisions).values({
      ballotId: parsed.data.ballotId,
      decision: parsed.data.decision,
      reason: parsed.data.reason
    });

    return ballot;
  });

  if (!updated) return NextResponse.json({ error: "Unknown ballot." }, { status: 404 });
  return NextResponse.json({ updated: true, state: nextState });
}
