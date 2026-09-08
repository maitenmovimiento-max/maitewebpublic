import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { guideInputSchema } from "@/lib/guide-schema";
import { deleteGuide, updateGuide } from "@/lib/guides";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Neon aún no está conectado." }, { status: 503 });
  const parsed = guideInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Datos inválidos." }, { status: 400 });
  const { id } = await params;
  try {
    const guide = await updateGuide(id, parsed.data);
    if (!guide) return NextResponse.json({ error: "Guía no encontrada." }, { status: 404 });
    revalidatePath("/"); revalidatePath("/guias"); revalidatePath(`/guias/${guide.slug}`);
    return NextResponse.json(guide);
  } catch (error) {
    console.error("Update guide failed", error);
    return NextResponse.json({ error: "No se pudo actualizar. Revisa que el enlace no esté repetido." }, { status: 409 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Neon aún no está conectado." }, { status: 503 });
  const { id } = await params;
  const deleted = await deleteGuide(id);
  if (!deleted) return NextResponse.json({ error: "Guía no encontrada." }, { status: 404 });
  revalidatePath("/"); revalidatePath("/guias");
  return NextResponse.json({ ok: true });
}
