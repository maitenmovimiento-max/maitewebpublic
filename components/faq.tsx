"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const questions = [
  ["¿Es seguro hacer ejercicio durante el embarazo?", "En la mayoría de los embarazos, el movimiento adaptado ofrece beneficios importantes. Antes de comenzar revisamos tu historia y trabajamos respetando las indicaciones de tu equipo de salud."],
  ["¿Puedo comenzar en cualquier trimestre?", "Sí. El acompañamiento se ajusta a tu momento, experiencia, energía y necesidades. No necesitas haber entrenado antes."],
  ["¿Cómo funcionan las sesiones online?", "Nos conectamos por videollamada. Solo necesitas un espacio cómodo y conexión a internet; te observo, corrijo y adapto cada movimiento en tiempo real."],
  ["¿Cuándo puedo volver a moverme en el postparto?", "Depende de tu tipo de parto y recuperación. Comenzamos con una evaluación y progresamos desde respiración, suelo pélvico y movilidad antes de aumentar cargas."],
];

export function Faq() {
  const [active, setActive] = useState(0);
  return (
    <div className="faq-list">
      {questions.map(([question, answer], index) => {
        const open = active === index;
        return (
          <div className={`faq-item${open ? " faq-item--open" : ""}`} key={question}>
            <button type="button" aria-expanded={open} aria-controls={`faq-${index}`} onClick={() => setActive(open ? -1 : index)}>
              <span>{question}</span><ChevronDown aria-hidden="true" />
            </button>
            <div id={`faq-${index}`} hidden={!open}><p>{answer}</p></div>
          </div>
        );
      })}
    </div>
  );
}
