import { NextResponse } from "next/server";
import { createSessionToken, isSameOrigin, sessionCookieOptions, SESSION_COOKIE, verifyPassword } from "@/lib/auth";
import { env, isAdminConfigured } from "@/lib/env";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(request: Request) {
  return request.headers.get("x-nf-client-connection-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isAdminConfigured || !env.ADMIN_PASSWORD_HASH) return NextResponse.json({ error: "El panel aún no está configurado." }, { status: 503 });

  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429, headers: { "Retry-After": "900" } },
    );
  }
  if (current && current.resetAt <= now) attempts.delete(key);

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || !verifyPassword(password, env.ADMIN_PASSWORD_HASH)) {
    const active = attempts.get(key);
    attempts.set(key, {
      count: (active?.count ?? 0) + 1,
      resetAt: active?.resetAt ?? now + WINDOW_MS,
    });
    await new Promise((resolve) => setTimeout(resolve, 450));
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  attempts.delete(key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}
