"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setState("sending");
    setMessage("");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    const data = await response.json().catch(() => ({}));
    setState(response.ok ? "success" : "error");
    setMessage(response.ok ? "Gracias. Recibí tu mensaje y te responderé muy pronto." : data.error || "No pude enviar el mensaje. Intenta nuevamente.");
  }

  return (
    <form className="contact-form" action={submit}>
      <label className="honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="field-row">
        <label>Nombre<input name="name" autoComplete="name" required minLength={2} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <label>¿En qué etapa estás?
        <select name="stage" defaultValue="">
          <option value="">Selecciona una opción</option>
          <option>Embarazo · primer trimestre</option>
          <option>Embarazo · segundo trimestre</option>
          <option>Embarazo · tercer trimestre</option>
          <option>Postparto</option>
          <option>Planificando un embarazo</option>
        </select>
      </label>
      <label>Cuéntame qué necesitas<textarea name="message" rows={5} required minLength={10} /></label>
      <button className="button" disabled={state === "sending"} type="submit">
        {state === "sending" ? <LoaderCircle className="spin" size={18} /> : <>Enviar mensaje <ArrowRight size={18} /></>}
      </button>
      {message && <p className={`form-status form-status--${state}`} role="status">{message}</p>}
    </form>
  );
}
