import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/identity";

export async function POST() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
