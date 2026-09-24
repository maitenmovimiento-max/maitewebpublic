"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/coaching-online", label: "Coaching online" },
  { href: "/guias", label: "Guías" },
  { href: "/#metodo", label: "Método" },
  { href: "/#sobre-maite", label: "Sobre Maite" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Brand />
        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={`site-nav${open ? " site-nav--open" : ""}`} aria-label="Navegación principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
          ))}
          <Link className="button button--small" href="/#contacto" onClick={() => setOpen(false)}>Agenda una evaluación</Link>
        </nav>
      </div>
    </header>
  );
}
