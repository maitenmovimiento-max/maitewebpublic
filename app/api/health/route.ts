import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured) {
    return Response.json(
      { ok: false, database: "not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await getDb().execute(sql`select 1`);
    return Response.json(
      { ok: true, database: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { ok: false, database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
