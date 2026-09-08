import { NextResponse } from "next/server";
import { createSessionToken, isSameOrigin, sessionCookieOptions, SESSION_COOKIE, verifyPassword } from "@/lib/auth";
import { env, isAdminConfigured, isDatabaseConfigured } from "@/lib/env";
import { clearLoginFailures, getLoginThrottle, recordLoginFailure } from "@/lib/login-throttle";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isAdminConfigured || !env.ADMIN_PASSWORD_HASH) return NextResponse.json({ error: "El panel aún no está configurado." }, { status: 503 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "La base de datos aún no está conectada." }, { status: 503 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });

  let throttle;
  try {
    throttle = await getLoginThrottle(request);
  } catch {
    return NextResponse.json({ error: "No pudimos validar el acceso en este momento." }, { status: 503 });
  }
  if (!throttle.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera 15 minutos." },
      { status: 429, headers: { "Retry-After": String(throttle.retryAfter || 900) } },
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || password.length > 256 || !(await verifyPassword(password, env.ADMIN_PASSWORD_HASH))) {
    await recordLoginFailure(throttle.key);
    await new Promise((resolve) => setTimeout(resolve, 450));
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  await clearLoginFailures(throttle.key);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}
