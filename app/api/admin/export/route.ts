import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { ballots, voteFeedback, votes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return '"' + text.replaceAll('"', '""') + '"';
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const db = getDb();
  const rows = await db
    .select({
      ballotId: ballots.id,
      createdAt: ballots.createdAt,
      audience: ballots.audience,
      integrityState: ballots.integrityState,
      serviceId: votes.serviceId,
      interestType: voteFeedback.interestType,
      betaInterest: voteFeedback.betaInterest,
      paymentInterest: voteFeedback.paymentInterest,
      useCaseText: voteFeedback.useCaseText
    })
    .from(votes)
    .innerJoin(ballots, eq(votes.ballotId, ballots.id))
    .leftJoin(voteFeedback, eq(voteFeedback.ballotId, ballots.id));

  const format = request.nextUrl.searchParams.get("format") || "json";
  if (format !== "csv") return NextResponse.json({ exportedAt: new Date().toISOString(), rows });

  const headers = [
    "ballotId",
    "createdAt",
    "audience",
    "integrityState",
    "serviceId",
    "interestType",
    "betaInterest",
    "paymentInterest",
    "useCaseText"
  ];
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => csvCell(row[key as keyof typeof row])).join(","))
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="resonarch-next-signal.csv"'
    }
  });
}
