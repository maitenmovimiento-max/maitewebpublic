import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => { process.env.ADMIN_SESSION_SECRET = "test-secret-with-at-least-thirty-two-characters"; });

describe("admin auth", () => {
  it("crea y verifica hashes de contraseña", async () => {
    vi.resetModules();
    const { hashPassword, verifyPassword } = await import("@/lib/auth");
    const hash = hashPassword("una-clave-larga-y-segura", "test-salt");
    expect(verifyPassword("una-clave-larga-y-segura", hash)).toBe(true);
    expect(verifyPassword("clave-incorrecta", hash)).toBe(false);
  });
  it("rechaza sesiones vencidas o modificadas", async () => {
    vi.resetModules();
    const { createSessionToken, verifySessionToken } = await import("@/lib/auth");
    const token = createSessionToken(1_700_000_000_000);
    expect(verifySessionToken(token, 1_700_000_001_000)).toBe(true);
    expect(verifySessionToken(`${token}x`, 1_700_000_001_000)).toBe(false);
    expect(verifySessionToken(token, 1_800_000_000_000)).toBe(false);
  });
});
