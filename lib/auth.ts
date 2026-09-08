import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "mm_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(":");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createSessionToken(now = Date.now()) {
  if (!env.ADMIN_SESSION_SECRET) throw new Error("ADMIN_SESSION_SECRET no está configurado.");
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${expiresAt}`;
  const signature = createHmac("sha256", env.ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()) {
  if (!token || !env.ADMIN_SESSION_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = createHmac("sha256", env.ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  const provided = Buffer.from(parts[2]);
  const expectedBuffer = Buffer.from(expected);
  return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}
