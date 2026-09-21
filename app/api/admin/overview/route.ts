import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { ensureCatalogInDb } from "@/db/catalog-sync";
import { ballots, services, voteFeedback, votes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin";
import { decisionScore } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const db = getDb();
  await ensureCatalogInDb(db);

  const allBallots = await db.select().from(ballots);
  const serviceRows = await db.select().from(services).where(eq(services.isPublic, true));
  const voteRows = await db
    .select({
      serviceId: votes.serviceId,
      integrityState: ballots.integrityState,
      audience: ballots.audience,
      interestType: voteFeedback.interestType,
      betaInterest: voteFeedback.betaInterest,
      paymentInterest: voteFeedback.paymentInterest,
      useCaseText: voteFeedback.useCaseText
    })
    .from(votes)
    .innerJoin(ballots, eq(votes.ballotId, ballots.id))
    .leftJoin(voteFeedback, eq(voteFeedback.ballotId, ballots.id));

  const productSignals = serviceRows.map((service) => {
    const eligible = voteRows.filter((row) => row.serviceId === service.id && row.integrityState === "NORMAL");
    const professionalIntent = eligible.filter(
      (row) => row.interestType === "team" || row.interestType === "integrate-api"
    ).length;
    const betaInterest = eligible.filter((row) => row.betaInterest).length;
    const paymentInterest = eligible.filter((row) => row.paymentInterest).length;
    const meaningfulUseCases = eligible.filter((row) => (row.useCaseText || "").trim().length >= 20).length;
    const audiences = { software: 0, engineering: 0, creator: 0, exploring: 0 } as Record<string, number>;
    for (const row of eligible) {
      if (row.audience in audiences) audiences[row.audience] += 1;
    }

    return {
      id: service.id,
      title: service.title,
      family: service.family,
      technicalMaturity: service.technicalMaturity,
      productState: service.productState,
      votes: eligible.length,
      professionalIntent,
      betaInterest,
      paymentInterest,
      meaningfulUseCases,
      audiences,
      decisionScore: decisionScore({
        votes: eligible.length,
        professionalIntent,
        betaInterest,
        paymentInterest,
        meaningfulUseCases
      })
    };
  });

  const feedbackRows = await db.select().from(voteFeedback);

  return NextResponse.json({
    totals: {
      validVoters: allBallots.filter((ballot) => ballot.integrityState === "NORMAL").length,
      ballots: allBallots.length,
      suspicious: allBallots.filter((ballot) => ballot.integrityState !== "NORMAL").length,
      betaInterest: feedbackRows.filter((row) => row.betaInterest).length,
      paymentIntent: feedbackRows.filter((row) => row.paymentInterest).length,
      writtenUseCases: feedbackRows.filter((row) => Boolean(row.useCaseText?.trim())).length
    },
    products: productSignals.sort((a, b) => b.decisionScore - a.decisionScore)
  });
}
