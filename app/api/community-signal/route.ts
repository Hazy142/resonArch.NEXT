import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { ballots, visitors, voteFeedback, votes } from "@/db/schema";
import { ANON_COOKIE, sha256 } from "@/lib/identity";
import type { Audience, CommunityProductSignal } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ANON_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Community Signal is locked until you vote." }, { status: 403 });
  }

  const db = getDb();
  const [visitor] = await db
    .select({ resultsUnlockedAt: visitors.resultsUnlockedAt })
    .from(visitors)
    .where(eq(visitors.anonymousTokenHash, sha256(token)))
    .limit(1);

  if (!visitor?.resultsUnlockedAt) {
    return NextResponse.json({ error: "Community Signal is locked until you vote." }, { status: 403 });
  }

  const eligibleBallots = await db
    .select({
      id: ballots.id,
      betaInterest: voteFeedback.betaInterest,
      paymentInterest: voteFeedback.paymentInterest
    })
    .from(ballots)
    .leftJoin(voteFeedback, eq(voteFeedback.ballotId, ballots.id))
    .where(eq(ballots.integrityState, "NORMAL"));

  const rows = await db
    .select({
      serviceId: votes.serviceId,
      audience: ballots.audience,
      betaInterest: voteFeedback.betaInterest,
      paymentInterest: voteFeedback.paymentInterest
    })
    .from(votes)
    .innerJoin(ballots, eq(votes.ballotId, ballots.id))
    .leftJoin(voteFeedback, eq(voteFeedback.ballotId, ballots.id))
    .where(eq(ballots.integrityState, "NORMAL"));

  const byService = new Map<string, CommunityProductSignal>();

  for (const row of rows) {
    const current =
      byService.get(row.serviceId) ||
      {
        serviceId: row.serviceId,
        votes: 0,
        betaInterest: 0,
        paymentInterest: 0,
        audiences: { software: 0, engineering: 0, creator: 0, exploring: 0 }
      };

    current.votes += 1;
    if (row.betaInterest) current.betaInterest += 1;
    if (row.paymentInterest) current.paymentInterest += 1;
    const audience = row.audience as Audience;
    if (audience in current.audiences) current.audiences[audience] += 1;
    byService.set(row.serviceId, current);
  }

  return NextResponse.json({
    eligibleVoters: eligibleBallots.length,
    betaInterestedVoters: eligibleBallots.filter((ballot) => ballot.betaInterest).length,
    paymentInterestedVoters: eligibleBallots.filter((ballot) => ballot.paymentInterest).length,
    products: Array.from(byService.values())
  });
}
