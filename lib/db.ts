import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está configurada.");
  }

  if (!cached) {
    cached = drizzle(neon(env.DATABASE_URL), { schema });
  }

  return cached;
}
