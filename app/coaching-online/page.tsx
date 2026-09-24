import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Clock3, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Coaching online",
  description: "Entrenamiento y hábitos personalizados para mujeres adultas que quieren avanzar con un plan claro, seguro y sostenible.",
  alternates: { canonical: "/coaching-online" },
};

const whatsappLink = "https://wa.me/56987572067?text=Hola%20Maite%2C%20quiero%20consultar%20por%20el%20Coaching%20online.";

const includes = [
  "Validación inicial para confirmar que este servicio es adecuado para ti.",
  "Rutina personalizada para entrenar en casa, gimnasio o ambos.",
  "Semana 1 entregada con ejercicios, videos, series, repeticiones, carga y descanso.",
  "Ajustes semanales según tu escala de esfuerzo, notas y cómo te sentiste.",
  "Guía práctica de hábitos: alimentación, agua, descanso, movimiento cotidiano y bienestar.",
  "Revisión manual de Maite antes de entregar o cambiar cualquier plan.",
];

const steps = [
  ["Escríbeme", "Consulta disponibilidad por WhatsApp. Primero confirmamos que este servicio aplica para ti."],
  ["Confirma tu cupo", "Si eres apta y hay cupo, realizas la transferencia y envías el comprobante."],
  ["Completa tu formulario", "Conozco tu objetivo, experiencia, días disponibles, lugar de entrenamiento y hábitos."],
  ["Recibe tu plan", "Después de revisar tu información, recibes tu primera semana dentro de 24 horas."],
  ["Avanzamos semana a semana", "Registras tu esfuerzo y notas en la plantilla; reviso tu retroalimentación antes de ajustar."],
];

export default function CoachingOnlinePage() {
  return (
    <>
      <SiteHeader />
      <main className="coaching-page">
        <section className="coaching-hero">
          <div className="coaching-hero__orb coaching-hero__orb--one" aria-hidden="true" />
          <div className="coaching-hero__orb coaching-hero__orb--two" aria-hidden="true" />
          <div className="shell coaching-hero__grid">
            <div>
              <p className="eyebrow">Coaching online</p>
              <h1>Entrena con un plan que se adapte a <em>tu vida real.</em></h1>
              <p className="coaching-hero__lead">Un acompañamiento de 4 semanas para mujeres adultas que quieren ganar fuerza, sentirse mejor y construir hábitos sostenibles, sin planes rígidos ni entrenar a ciegas.</p>
              <div className="button-row">
                <a className="button" href={whatsappLink} target="_blank" rel="noreferrer">Consultar disponibilidad <ArrowRight size={18} /></a>
                <a className="button button--ghost" href="#como-funciona">Ver cómo funciona</a>
              </div>
              <div className="coaching-hero__trust">
                <span><ShieldCheck size={18} /> Plan revisado personalmente</span>
                <span><Clock3 size={18} /> Primera semana en 24 h</span>
              </div>
            </div>
            <aside className="coaching-price-card" aria-label="Información principal del coaching">
              <p>COACHING ONLINE · 4 SEMANAS</p>
              <strong>$50.000 <small>CLP</small></strong>
              <span>Cupos activos: 10</span>
              <hr />
              <div><Check size={18} /> 1 a 4 días de entrenamiento por semana</div>
              <div><Check size={18} /> Casa, gimnasio o ambos</div>
              <div><Check size={18} /> Principiantes e intermedias</div>
              <a href={whatsappLink} target="_blank" rel="noreferrer">Quiero consultar mi cupo <ArrowRight size={16} /></a>
            </aside>
          </div>
        </section>

        <section className="section coaching-intro">
          <div className="shell coaching-intro__grid">
            <div><p className="eyebrow">Para ti si...</p><h2>Quieres avanzar con <em>estructura</em>, sin dejar de escucharte.</h2></div>
            <div className="coaching-intro__copy">
              <p>Este coaching está pensado para mujeres mayores de 18 años, principiantes o intermedias, que quieren entrenar en casa, gimnasio o ambos.</p>
              <p>No necesitas partir “en forma” ni entrenar muchos días: el plan se organiza según tus días reales, tu experiencia, tu objetivo y el material que tengas disponible.</p>
            </div>
          </div>
        </section>

        <section className="section section--lavender">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">Qué incluye</p><h2>Lo necesario para entrenar con <em>claridad.</em></h2></div>
              <p>Cada rutina y cada cambio pasan por mi revisión personal antes de llegar a ti.</p>
            </div>
            <div className="coaching-includes">
              {includes.map((item) => <div key={item}><Check size={20} /><p>{item}</p></div>)}
            </div>
          </div>
        </section>

        <section className="section" id="como-funciona">
          <div className="shell">
            <div className="section-heading section-heading--center"><p className="eyebrow">Cómo funciona</p><h2>Simple, ordenado y <em>personalizado.</em></h2></div>
            <ol className="coaching-steps">
              {steps.map(([title, description], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}
            </ol>
            <p className="coaching-note"><Sparkles size={18} /> No recibes una rutina genérica para cuatro semanas. Comenzamos con tu semana 1 y las siguientes se adaptan de acuerdo con tu respuesta, esfuerzo y notas.</p>
          </div>
        </section>

        <section className="section coaching-faq-section">
          <div className="shell coaching-faq-section__grid">
            <div><p className="eyebrow">Antes de comenzar</p><h2>Preguntas que ayudan a <em>decidir.</em></h2></div>
            <div className="coaching-faqs">
              <details open><summary>¿Cuántos días a la semana entrenaré?</summary><p>Los días los eliges tú: puede ser 1, 2, 3 o 4. El plan se organiza para que sea posible de sostener.</p></details>
              <details><summary>¿Necesito ir al gimnasio?</summary><p>No. Podemos trabajar con lo que tengas en casa, con gimnasio o combinando ambos contextos.</p></details>
              <details><summary>¿Cómo se ajusta el entrenamiento?</summary><p>En la misma plantilla registras cómo sentiste cada ejercicio con una escala de esfuerzo y dejas tus notas. Con eso reviso y preparo el ajuste de la semana siguiente.</p></details>
              <details><summary>¿Incluye una dieta?</summary><p>No incluye dietas clínicas ni conteo obligatorio de calorías. Incluye una guía de hábitos alimentarios y bienestar para acompañar tu entrenamiento.</p></details>
            </div>
          </div>
        </section>

        <section className="section coaching-boundaries">
          <div className="shell coaching-boundaries__box">
            <CircleAlert size={25} />
            <div><h2>Este servicio no es para embarazo ni posparto.</h2><p>En esos casos necesitas un acompañamiento específico. Tampoco reemplaza evaluación médica, kinesiológica, psicológica o nutricional clínica. Si aparece dolor importante, mareos, una lesión o una condición que requiera evaluación, lo revisamos antes de continuar.</p></div>
          </div>
        </section>

        <section className="coaching-cta">
          <div className="shell coaching-cta__inner">
            <div><p className="eyebrow eyebrow--light">¿Te hace sentido?</p><h2>Partamos con una conversación <em>simple.</em></h2><p>Escríbeme para consultar disponibilidad. Primero confirmamos que este coaching sea adecuado para ti.</p></div>
            <a className="button button--gold" href={whatsappLink} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Consultar por WhatsApp</a>
          </div>
        </section>
      </main>
      <SiteFooter
        description="Entrenamiento y hábitos personalizados para mujeres adultas que quieren avanzar con estructura y sostenibilidad."
        ctaTitle="¿Quieres saber si es para ti?"
        ctaCopy="Escríbeme por WhatsApp y primero revisamos si este coaching aplica para tu contexto."
        ctaHref="https://wa.me/56987572067?text=Hola%20Maite%2C%20quiero%20consultar%20por%20el%20Coaching%20online."
        bottomLabel="Coaching online de entrenamiento y hábitos"
      />
      <a className="whatsapp-fab" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><MessageCircle /></a>
    </>
  );
}
