import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("la portada presenta la propuesta y las guías", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tu cuerpo cambia");
  await expect(page.getByRole("link", { name: /explorar guías/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /información que te ayuda/i })).toBeVisible();
});

test("el catálogo abre una guía dinámica", async ({ page }) => {
  await page.goto("/guias");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Guías");
  await page.getByRole("link", { name: /leer movimiento seguro/i }).first().click();
  await expect(page).toHaveURL(/\/guias\/movimiento-seguro-primer-trimestre/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Movimiento seguro");
});

test("las páginas públicas no tienen violaciones críticas de accesibilidad", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical")).toEqual([]);
});
