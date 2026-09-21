import crypto from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

export const ANON_COOKIE = "next_anon";
export const ADMIN_COOKIE = "next_admin";

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function getOrCreateAnonymousToken(request: NextRequest) {
  const existing = request.cookies.get(ANON_COOKIE)?.value;
  if (existing) return { token: existing, isNew: false };
  return { token: crypto.randomBytes(32).toString("base64url"), isNew: true };
}

export function setAnonymousCookie(response: NextResponse, token: string) {
  response.cookies.set(ANON_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });
}

export function getClientNetworkAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function getEphemeralAbuseKey(request: NextRequest, now = new Date()) {
  const secret = process.env.ABUSE_SECRET || process.env.ADMIN_SESSION_SECRET || "dev-only-change-me";
  const day = now.toISOString().slice(0, 10);
  const source = getClientNetworkAddress(request);
  return crypto.createHmac("sha256", secret + ":" + day).update(source).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionValue(now = Date.now()) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be configured.");
  const expires = String(now + 1000 * 60 * 60 * 12);
  const signature = crypto.createHmac("sha256", secret).update(expires).digest("hex");
  return expires + "." + signature;
}

export function verifyAdminSession(value: string | undefined, now = Date.now()) {
  if (!value) return false;
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  const expires = Number(parts[0]);
  if (!Number.isFinite(expires) || expires < now) return false;
  const expected = crypto.createHmac("sha256", secret).update(parts[0]).digest("hex");
  return safeEqual(parts[1], expected);
}

export function verifyAdminPassword(candidate: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return false;
  return safeEqual(candidate, configured);
}
