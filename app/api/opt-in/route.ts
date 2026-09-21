import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { emailOptIns, emailVoteLinks, visitors } from "@/db/schema";
import { ANON_COOKIE, sha256 } from "@/lib/identity";

const schema = z.object({
  email: z.string().email().max(320),
  consent: z.literal(true)
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A valid email and explicit consent are required." }, { status: 400 });

  const db = getDb();
  const [optIn] = await db
    .insert(emailOptIns)
    .values({
      email: parsed.data.email.toLowerCase(),
      consentTextVersion: "next-beta-v1"
    })
    .onConflictDoUpdate({
      target: emailOptIns.email,
      set: { consentTextVersion: "next-beta-v1" }
    })
    .returning();

  const token = request.cookies.get(ANON_COOKIE)?.value;
  if (token) {
    const [visitor] = await db
      .select({ id: visitors.id })
      .from(visitors)
      .where(eq(visitors.anonymousTokenHash, sha256(token)))
      .limit(1);
    if (visitor) {
      await db.insert(emailVoteLinks).values({ emailOptInId: optIn.id, visitorId: visitor.id });
    }
  }

  return NextResponse.json({
    accepted: true,
    verificationRequired: true,
    note: "Delivery/double-opt-in transport is intentionally not configured in v1 yet."
  });
}
