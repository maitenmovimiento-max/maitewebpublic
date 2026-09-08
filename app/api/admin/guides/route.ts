import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { guideInputSchema } from "@/lib/guide-schema";
import { createGuide, listAllGuides } from "@/lib/guides";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  return NextResponse.json(await listAllGuides());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Neon aún no está conectado." }, { status: 503 });
  const parsed = guideInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Datos inválidos." }, { status: 400 });
  try {
    const guide = await createGuide(parsed.data);
    revalidatePath("/"); revalidatePath("/guias"); revalidatePath(`/guias/${guide.slug}`);
    return NextResponse.json(guide, { status: 201 });
  } catch (error) {
    console.error("Create guide failed", error);
    return NextResponse.json({ error: "No se pudo crear la guía. Revisa que el enlace no esté repetido." }, { status: 409 });
  }
}
