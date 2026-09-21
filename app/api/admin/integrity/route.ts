import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { ballots, integrityEvents } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin";

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
    .where(eq(ballots.integrityState, "SUSPICIOUS"))
    .orderBy(desc(ballots.createdAt));

  return NextResponse.json({ suspicious: rows });
}
