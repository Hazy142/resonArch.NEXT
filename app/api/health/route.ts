import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "resonArch.NEXT",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    adminConfigured: Boolean(process.env.ADMIN_PASSWORD)
  });
}
