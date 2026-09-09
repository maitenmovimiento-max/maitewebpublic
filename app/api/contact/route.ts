import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  stage: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(10).max(2_000),
  website: z.string().max(0).optional().default(""),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(request: Request) {
  const key = request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12_000) return NextResponse.json({ error: "El mensaje es demasiado largo." }, { status: 413 });
  if (isRateLimited(request)) return NextResponse.json({ error: "Has enviado varios mensajes. Espera unos minutos." }, { status: 429 });

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Revisa los datos del formulario." }, { status: 400 });
  if (!env.RESEND_API_KEY) return NextResponse.json({ error: "El formulario está temporalmente fuera de servicio." }, { status: 503 });

  const { name, email, stage, message } = parsed.data;
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "MaitenMovimiento <consultas@maitenmovimiento.cl>",
      to: env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Nueva consulta de ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><h1 style="color:#351443">Nueva consulta desde MaitenMovimiento</h1><p><strong>Nombre:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Etapa:</strong> ${escapeHtml(stage || "No especificada")}</p><p><strong>Mensaje:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p></div>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed", error);
    return NextResponse.json({ error: "No pudimos enviar el mensaje. Intenta nuevamente." }, { status: 502 });
  }
}
