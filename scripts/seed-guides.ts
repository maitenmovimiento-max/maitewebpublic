import { guides } from "../db/schema";
import { getDb } from "../lib/db";
import { sampleGuides } from "../lib/sample-guides";

async function main() {
  const inserted = await getDb().insert(guides).values(sampleGuides)
    .onConflictDoNothing({ target: guides.slug })
    .returning({ id: guides.id });

  console.log(`Guías iniciales creadas: ${inserted.length}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
