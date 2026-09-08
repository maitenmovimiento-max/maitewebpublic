"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, FilePenLine, LayoutDashboard, LogOut, Plus, Search, Trash2, X } from "lucide-react";
import { RichEditor } from "@/components/admin/rich-editor";
import { slugify, type GuideInput } from "@/lib/guide-schema";

export type GuideDTO = GuideInput & { id: string; createdAt: string; updatedAt: string; publishedAt: string | null };

const emptyGuide: GuideInput = {
  title: "", slug: "", excerpt: "", contentHtml: "<p>Comienza a escribir tu guía…</p>",
  coverImageUrl: "", coverImageAlt: "", category: "Embarazo", status: "draft",
  featured: false, readTime: 5, seoTitle: "", seoDescription: "",
};

export function AdminDashboard({ initialGuides, databaseConfigured }: { initialGuides: GuideDTO[]; databaseConfigured: boolean }) {
  const [guides, setGuides] = useState(initialGuides);
  const [editing, setEditing] = useState<(GuideInput & { id?: string }) | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => guides.filter((guide) => {
    const matchesQuery = !query || `${guide.title} ${guide.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!status || guide.status === status);
  }), [guides, query, status]);

  const published = guides.filter((guide) => guide.status === "published").length;
  const drafts = guides.filter((guide) => guide.status === "draft").length;

  async function refresh() {
    const response = await fetch("/api/admin/guides", { cache: "no-store" });
    if (response.ok) setGuides(await response.json());
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setNotice("");
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/admin/guides/${editing.id}` : "/api/admin/guides";
    const response = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(editing) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      await refresh();
      setEditing(null);
      setNotice(editing.id ? "Guía actualizada correctamente." : "Guía creada correctamente.");
    } else setNotice(data.error || "No pudimos guardar la guía.");
    setSaving(false);
  }

  async function remove(guide: GuideDTO) {
    if (!window.confirm(`¿Archivar “${guide.title}”? Dejará de verse en la web, pero podrás recuperarla.`)) return;
    const response = await fetch(`/api/admin/guides/${guide.id}`, { method: "DELETE" });
    if (response.ok) {
      await refresh();
      setNotice("Guía archivada.");
    } else setNotice("No pudimos archivar la guía.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/"><span>M</span><strong>Maiten</strong>Movimiento</Link>
        <nav><a className="active" href="#dashboard"><LayoutDashboard /> Resumen</a><a href="#guides"><BookOpen /> Guías</a></nav>
        <button type="button" onClick={logout}><LogOut /> Cerrar sesión</button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar"><div><p>Biblioteca editorial</p><h1>Panel de guías</h1></div><div><a href="/guias" target="_blank">Ver sitio <ExternalLink /></a><button className="button" type="button" onClick={() => setEditing({ ...emptyGuide })}><Plus /> Nueva guía</button></div></header>
        {!databaseConfigured && <div className="admin-alert admin-alert--warning" role="alert">La interfaz está lista, pero falta conectar Neon para guardar cambios reales.</div>}
        {notice && <div className="admin-alert" role="status">{notice}</div>}
        <section className="admin-stats" id="dashboard">
          <article><span>Guías totales</span><strong>{guides.length}</strong></article>
          <article><span>Publicadas</span><strong>{published}</strong></article>
          <article><span>Borradores</span><strong>{drafts}</strong></article>
        </section>
        <section className="admin-panel" id="guides">
          <div className="admin-panel__header"><div><h2>Todas las guías</h2><p>Crea, revisa y publica contenido sin tocar código.</p></div><div className="admin-filters"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar guía…" /></label><select aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos los estados</option><option value="published">Publicadas</option><option value="draft">Borradores</option><option value="archived">Archivadas</option></select></div></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Guía</th><th>Categoría</th><th>Estado</th><th>Actualizada</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{filtered.map((guide) => <tr key={guide.id}><td><strong>{guide.title}</strong><span>/{guide.slug}</span></td><td>{guide.category}</td><td><span className={`status status--${guide.status}`}>{guide.status === "published" ? "Publicada" : guide.status === "draft" ? "Borrador" : "Archivada"}</span></td><td>{new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(guide.updatedAt))}</td><td><div className="row-actions"><button type="button" aria-label={`Editar ${guide.title}`} onClick={() => setEditing({ ...guide })}><FilePenLine /></button><button type="button" className="danger" aria-label={`Archivar ${guide.title}`} onClick={() => remove(guide)}><Trash2 /></button></div></td></tr>)}</tbody></table>{!filtered.length && <p className="admin-empty">No hay guías que coincidan con estos filtros.</p>}</div>
        </section>
      </div>

      {editing && <div className="editor-overlay" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div className="editor-panel"><header><div><p>{editing.id ? "Editar contenido" : "Nueva guía"}</p><h2 id="editor-title">{editing.title || "Guía sin título"}</h2></div><button type="button" aria-label="Cerrar editor" onClick={() => setEditing(null)}><X /></button></header><div className="editor-layout"><section className="editor-content"><label>Título<input value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value, slug: editing.id ? editing.slug : slugify(event.target.value) })} /></label><label>Resumen<textarea rows={3} maxLength={280} value={editing.excerpt} onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })} /></label><label>Contenido<RichEditor value={editing.contentHtml} onChange={(contentHtml) => setEditing((current) => current ? { ...current, contentHtml } : current)} /></label></section><aside className="editor-meta"><label>Estado<select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as GuideInput["status"] })}><option value="draft">Borrador</option><option value="published">Publicada</option><option value="archived">Archivada</option></select></label><label>Categoría<input value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} /></label><label>Enlace<input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })} /><small>maitenmovimiento.cl/guias/{editing.slug}</small></label><label>Minutos de lectura<input type="number" min={1} max={90} value={editing.readTime} onChange={(event) => setEditing({ ...editing, readTime: Number(event.target.value) })} /></label><label>URL de portada<input type="url" value={editing.coverImageUrl} onChange={(event) => setEditing({ ...editing, coverImageUrl: event.target.value })} /></label><label>Descripción de portada<input value={editing.coverImageAlt} onChange={(event) => setEditing({ ...editing, coverImageAlt: event.target.value })} /></label><label className="check"><input type="checkbox" checked={editing.featured} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} /> Destacar en el inicio</label><details><summary>SEO y redes sociales</summary><label>Título SEO<input maxLength={70} value={editing.seoTitle} onChange={(event) => setEditing({ ...editing, seoTitle: event.target.value })} /></label><label>Descripción SEO<textarea rows={3} maxLength={170} value={editing.seoDescription} onChange={(event) => setEditing({ ...editing, seoDescription: event.target.value })} /></label></details></aside></div><footer><button className="button button--ghost" type="button" onClick={() => setEditing(null)}>Cancelar</button><button className="button" type="button" disabled={saving || !databaseConfigured} onClick={save}>{saving ? "Guardando…" : "Guardar guía"}</button></footer></div></div>}
    </main>
  );
}
