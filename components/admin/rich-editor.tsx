"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";

export function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, autolink: true })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  if (!editor) return <div className="editor-loading">Preparando editor…</div>;

  const link = () => {
    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("Dirección del enlace (https://…)", previous);
    if (url === null) return;
    if (!url) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar" aria-label="Formato del contenido">
        <button type="button" aria-label="Deshacer" onClick={() => editor.chain().focus().undo().run()}><Undo2 /></button>
        <button type="button" aria-label="Rehacer" onClick={() => editor.chain().focus().redo().run()}><Redo2 /></button>
        <span />
        <button type="button" className={editor.isActive("bold") ? "active" : ""} aria-label="Negrita" onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></button>
        <button type="button" className={editor.isActive("italic") ? "active" : ""} aria-label="Cursiva" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></button>
        <button type="button" className={editor.isActive("heading", { level: 2 }) ? "active" : ""} aria-label="Título grande" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 /></button>
        <button type="button" className={editor.isActive("heading", { level: 3 }) ? "active" : ""} aria-label="Subtítulo" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 /></button>
        <button type="button" className={editor.isActive("bulletList") ? "active" : ""} aria-label="Lista" onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></button>
        <button type="button" className={editor.isActive("orderedList") ? "active" : ""} aria-label="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></button>
        <button type="button" className={editor.isActive("blockquote") ? "active" : ""} aria-label="Cita" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></button>
        <button type="button" className={editor.isActive("link") ? "active" : ""} aria-label="Enlace" onClick={link}><Link2 /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
