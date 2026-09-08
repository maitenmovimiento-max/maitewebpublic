import { createHmac } from "node:crypto";
import { eq } from "drizzle-orm";
import { adminLoginAttempts } from "@/db/schema";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function requestKey(request: Request) {
  const address = request.headers.get("x-nf-client-connection-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  return createHmac("sha256", env.ADMIN_SESSION_SECRET || "unconfigured")
    .update(address)
    .digest("hex");
}

export async function getLoginThrottle(request: Request) {
  const key = requestKey(request);
  const [attempt] = await getDb().select().from(adminLoginAttempts)
    .where(eq(adminLoginAttempts.key, key)).limit(1);
  const now = new Date();

  if (!attempt) return { key, allowed: true, retryAfter: 0 };
  if (attempt.blockedUntil && attempt.blockedUntil > now) {
    return {
      key,
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((attempt.blockedUntil.getTime() - now.getTime()) / 1000)),
    };
  }
  if (now.getTime() - attempt.windowStartedAt.getTime() >= WINDOW_MS) {
    await getDb().delete(adminLoginAttempts).where(eq(adminLoginAttempts.key, key));
    return { key, allowed: true, retryAfter: 0 };
  }
  return { key, allowed: attempt.count < MAX_ATTEMPTS, retryAfter: 0 };
}

export async function recordLoginFailure(key: string) {
  const [attempt] = await getDb().select().from(adminLoginAttempts)
    .where(eq(adminLoginAttempts.key, key)).limit(1);
  const now = new Date();
  const expired = !attempt || now.getTime() - attempt.windowStartedAt.getTime() >= WINDOW_MS;
  const count = expired ? 1 : attempt.count + 1;
  const values = {
    key,
    count,
    windowStartedAt: expired ? now : attempt.windowStartedAt,
    blockedUntil: count >= MAX_ATTEMPTS ? new Date(now.getTime() + WINDOW_MS) : null,
    updatedAt: now,
  };

  await getDb().insert(adminLoginAttempts).values(values).onConflictDoUpdate({
    target: adminLoginAttempts.key,
    set: values,
  });
}

export async function clearLoginFailures(key: string) {
  await getDb().delete(adminLoginAttempts).where(eq(adminLoginAttempts.key, key));
}
