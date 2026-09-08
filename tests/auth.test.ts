import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => { process.env.ADMIN_SESSION_SECRET = "test-secret-with-at-least-thirty-two-characters"; });

describe("admin auth", () => {
  it("crea y verifica hashes de contraseña", async () => {
    vi.resetModules();
    const { hashPassword, verifyPassword } = await import("@/lib/auth");
    const hash = hashPassword("una-clave-larga-y-segura", "test-salt");
    await expect(verifyPassword("una-clave-larga-y-segura", hash)).resolves.toBe(true);
    await expect(verifyPassword("clave-incorrecta", hash)).resolves.toBe(false);
  }, 15_000);
  it("rechaza sesiones vencidas o modificadas", async () => {
    vi.resetModules();
    const { createSessionToken, verifySessionToken } = await import("@/lib/auth");
    const token = createSessionToken(1_700_000_000_000);
    expect(verifySessionToken(token, 1_700_000_001_000)).toBe(true);
    expect(verifySessionToken(`${token}x`, 1_700_000_001_000)).toBe(false);
    expect(verifySessionToken(token, 1_800_000_000_000)).toBe(false);
  });
  it("exige el mismo origen para mutaciones y configura una cookie estricta", async () => {
    vi.resetModules();
    const { isSameOrigin, sessionCookieOptions } = await import("@/lib/auth");
    expect(isSameOrigin(new Request("https://maitenmovimiento.cl/api/admin/login"))).toBe(false);
    expect(isSameOrigin(new Request("https://maitenmovimiento.cl/api/admin/login", {
      headers: { origin: "https://sitio-malicioso.test" },
    }))).toBe(false);
    expect(isSameOrigin(new Request("https://maitenmovimiento.cl/api/admin/login", {
      headers: { origin: "https://maitenmovimiento.cl" },
    }))).toBe(true);
    expect(sessionCookieOptions()).toMatchObject({ httpOnly: true, sameSite: "strict", path: "/" });
  });
});
