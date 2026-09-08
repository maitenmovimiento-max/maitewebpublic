import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_DATABASE_URL
      ?? process.env.DATABASE_URL
      ?? process.env.NETLIFY_DATABASE_URL
      ?? "",
  },
  strict: true,
});
