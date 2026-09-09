"use client";

import { useState } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";

export function LoginForm({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: formData.get("password") }),
    });
    if (response.ok) window.location.reload();
    else {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "No pudimos iniciar la sesión.");
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <span className="admin-login__icon"><LockKeyhole /></span>
        <p className="eyebrow">Biblioteca editorial</p>
        <h1>Panel Maiten</h1>
        <p>Administra tus guías y el contenido que compartes con tu comunidad.</p>
        {!configured ? (
          <div className="admin-alert admin-alert--warning" role="alert">Falta configurar el acceso seguro del panel en Netlify. Revisa la guía de instalación.</div>
        ) : (
          <form action={submit}>
            <label>Contraseña<input name="password" type="password" autoComplete="current-password" required minLength={12} /></label>
            <button className="button" type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" /> : <>Entrar al panel</>}</button>
            {error && <p className="admin-alert" role="alert">{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
