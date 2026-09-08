import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated, isSameOrigin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { guideInputSchema } from "@/lib/guide-schema";
import { archiveGuide, updateGuide } from "@/lib/guides";
import { isUniqueViolation } from "@/lib/db-errors";
import { z } from "zod";

type Context = { params: Promise<{ id: string }> };
const idSchema = z.string().uuid();

export async function PUT(request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Neon aún no está conectado." }, { status: 503 });
  if (Number(request.headers.get("content-length") || 0) > 150_000) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
  const parsed = guideInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Datos inválidos." }, { status: 400 });
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  try {
    const guide = await updateGuide(id, parsed.data);
    if (!guide) return NextResponse.json({ error: "Guía no encontrada." }, { status: 404 });
    revalidatePath("/"); revalidatePath("/guias"); revalidatePath(`/guias/${guide.slug}`);
    return NextResponse.json(guide);
  } catch (error) {
    console.error("Update guide failed", error);
    if (isUniqueViolation(error)) return NextResponse.json({ error: "Ya existe una guía con ese enlace." }, { status: 409 });
    return NextResponse.json({ error: "No se pudo actualizar en este momento." }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  if (!isDatabaseConfigured) return NextResponse.json({ error: "Neon aún no está conectado." }, { status: 503 });
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return NextResponse.json({ error: "Identificador inválido." }, { status: 400 });
  try {
    const archived = await archiveGuide(id);
    if (!archived) return NextResponse.json({ error: "Guía no encontrada." }, { status: 404 });
    revalidatePath("/"); revalidatePath("/guias");
    return NextResponse.json({ ok: true, archived: true });
  } catch (error) {
    console.error("Archive guide failed", error);
    return NextResponse.json({ error: "No se pudo archivar en este momento." }, { status: 503 });
  }
}
