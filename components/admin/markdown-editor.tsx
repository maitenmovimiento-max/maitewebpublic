"use client";

import { useRef, useState } from "react";
import { FileUp } from "lucide-react";

export function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function loadFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!file.name.toLowerCase().endsWith(".md") && file.type !== "text/markdown" && file.type !== "text/plain") {
      setError("Selecciona un archivo .md o texto plano.");
      return;
    }
    if (file.size > 150_000) {
      setError("El archivo no puede superar 150 KB.");
      return;
    }
    const text = typeof file.text === "function"
      ? await file.text()
      : await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      });
    onChange(text);
    setFileName(file.name);
  }

  return (
    <div className="markdown-editor">
      <div className="markdown-editor__toolbar">
        <button type="button" className="button button--ghost" onClick={() => inputRef.current?.click()}>
          <FileUp size={16} /> Cargar archivo .md
        </button>
        <input ref={inputRef} type="file" accept=".md,text/markdown,text/plain" aria-label="Cargar archivo Markdown" hidden onChange={(event) => void loadFile(event.target.files?.[0])} />
        <span>{fileName || "También puedes escribir o pegar Markdown aquí"}</span>
      </div>
      <textarea
        className="markdown-editor__input"
        value={value}
        onChange={(event) => { setFileName(""); onChange(event.target.value); }}
        aria-label="Contenido Markdown de la guía"
        spellCheck
      />
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <p className="markdown-editor__hint">Admite títulos con #, listas con -, citas con &gt; y enlaces Markdown.</p>
    </div>
  );
}
