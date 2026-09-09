import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DIRECT_DATABASE_URL: z.string().url().optional(),
  ADMIN_PASSWORD_HASH: z.string().min(20).optional(),
  ADMIN_SESSION_SECRET: z.string().min(32).optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().default("maitenmovimiento@gmail.com"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://maitenmovimiento.cl"),
});

export const env = serverSchema.parse({
  DATABASE_URL:
    process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || undefined,
  DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL || undefined,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || undefined,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET || undefined,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const isDatabaseConfigured = Boolean(env.DATABASE_URL);
export const isAdminConfigured = Boolean(env.ADMIN_PASSWORD_HASH && env.ADMIN_SESSION_SECRET);
