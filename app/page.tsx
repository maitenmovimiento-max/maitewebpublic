import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Heart, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GuideCard } from "@/components/guide-card";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { listFeaturedGuides } from "@/lib/guides";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredGuides = await listFeaturedGuides();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" id="inicio">
          <div className="hero__wash" aria-hidden="true" />
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">Movimiento prenatal &amp; postparto</p>
              <h1>Tu cuerpo cambia.<br /><em>Tu fuerza también.</em></h1>
              <p className="hero__lead">Acompañamiento profesional y humano para que vuelvas a confiar en tu cuerpo, te muevas con seguridad y vivas cada etapa con más calma.</p>
              <div className="button-row">
                <Link className="button" href="#contacto">Agenda una evaluación <ArrowRight size={18} /></Link>
                <Link className="button button--ghost" href="/guias">Explorar guías</Link>
              </div>
              <div className="trust-row" aria-label="Características del servicio">
                <span><ShieldCheck size={18} /> Movimiento adaptado</span>
                <span><Heart size={18} /> Acompañamiento cercano</span>
              </div>
            </div>
            <div className="hero__visual">
              <div className="hero__image">
                <Image src="/images/maite-embarazo-perfil.jpeg" alt="Maite embarazada junto a una pesa kettlebell" fill priority sizes="(max-width: 800px) 92vw, 44vw" />
              </div>
              <div className="hero__note">
                <Sparkles size={20} />
                <p><strong>Tu proceso es único</strong><span>El plan también debería serlo.</span></p>
              </div>
              <span className="hero__seal" aria-hidden="true">MOVER · RESPIRAR · CONFIAR ·</span>
            </div>
          </div>
        </section>

        <section className="trust-band" aria-label="Modalidades">
          <div className="shell trust-band__grid">
            <div><strong>Embarazo</strong><span>Movimiento seguro por trimestre</span></div>
            <div><strong>Postparto</strong><span>Recuperación progresiva y realista</span></div>
            <div><strong>Online o presencial</strong><span>Acompañamiento estés donde estés</span></div>
          </div>
        </section>

        <section className="section" id="servicios">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">Servicios</p><h2>Un espacio para volver<br />a sentirte <em>tú.</em></h2></div>
              <p>Cada acompañamiento parte desde tu historia, tu momento y tus objetivos. Sin fórmulas rígidas ni comparaciones.</p>
            </div>
            <div className="services-grid">
              <article className="service-card service-card--featured">
                <span className="service-card__number">01</span>
                <p className="service-card__tag">Acompañamiento continuo</p>
                <h3>Entrenamiento personalizado</h3>
                <p>Sesiones individuales diseñadas para tu trimestre o etapa de recuperación, con ajustes en tiempo real y seguimiento.</p>
                <ul>
                  <li><Check size={17} /> Evaluación inicial</li>
                  <li><Check size={17} /> Plan adaptado semana a semana</li>
                  <li><Check size={17} /> Modalidad online o presencial</li>
                </ul>
                <Link className="text-link text-link--light" href="#contacto">Quiero comenzar <ArrowRight size={17} /></Link>
              </article>
              <article className="service-card">
                <span className="service-card__number">02</span>
                <p className="service-card__tag">Programa prenatal · por trimestres</p>
                <h3>Maternidad en Movimiento</h3>
                <p>Un curso online de entrenamiento prenatal para acompañarte durante el embarazo con rutinas cortas desde casa, adaptadas a cada trimestre.</p>
                <ul>
                  <li><Check size={17} /> 4 módulos, con bienvenida y evaluación inicial</li>
                  <li><Check size={17} /> Rutinas para el primer, segundo y tercer trimestre</li>
                  <li><Check size={17} /> Sesiones de 15 a 25 minutos, sin gimnasio</li>
                  <li><Check size={17} /> Acceso online para entrenar a tu ritmo</li>
                </ul>
                <a className="text-link" href="https://curso.maitenmovimiento.cl" target="_blank" rel="noreferrer">Ver el curso <ArrowRight size={17} /></a>
              </article>
              <article className="service-card service-card--coaching">
                <span className="service-card__number">03</span>
                <p className="service-card__tag">4 semanas · $50.000 CLP</p>
                <h3>Coaching personalizado online</h3>
                <p>Un acompañamiento online para mujeres adultas que quieren entrenar con un plan claro, flexible y diseñado según sus objetivos, experiencia, días disponibles y equipamiento.</p>
                <ul>
                  <li><Check size={17} /> Rutina personalizada para casa, gimnasio o ambos</li>
                  <li><Check size={17} /> De 1 a 4 días de entrenamiento por semana</li>
                  <li><Check size={17} /> Ajustes semanales según tu esfuerzo y tus notas</li>
                  <li><Check size={17} /> Guía de hábitos y revisión personal de Maite</li>
                </ul>
                <p className="service-card__note">Este coaching no es para embarazo ni postparto: para esas etapas, el acompañamiento es específico.</p>
                <a className="text-link" href="https://wa.me/56987572067?text=Hola%20Maite%2C%20quiero%20consultar%20por%20el%20Coaching%20online." target="_blank" rel="noreferrer">Consultar disponibilidad <ArrowRight size={17} /></a>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--lavender" id="guias">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow">Biblioteca Maiten</p><h2>Información que te ayuda<br />a moverte con <em>confianza.</em></h2></div>
              <div><p>Guías claras, revisables y pensadas para acompañarte desde el teléfono, sin descargar archivos pesados.</p><Link className="text-link" href="/guias">Ver todas las guías <ArrowRight size={17} /></Link></div>
            </div>
            {featuredGuides.length ? (
              <div className="guides-grid">{featuredGuides.map((guide, index) => <GuideCard key={guide.id} guide={guide} priority={index === 0} />)}</div>
            ) : (
              <div className="empty-state"><Sparkles /><h3>Las primeras guías están en preparación</h3><p>Muy pronto encontrarás aquí recursos prácticos para cada etapa.</p></div>
            )}
          </div>
        </section>

        <section className="section method" id="metodo">
          <div className="shell method__grid">
            <div className="method__intro"><p className="eyebrow">Método Maiten</p><h2>Más que una rutina:<br /><em>un proceso contigo.</em></h2><p>No buscamos que vuelvas a ser quien eras. Te acompañamos a conocer y fortalecer la versión de ti que está naciendo.</p></div>
            <ol className="method__steps">
              <li><span>01</span><div><h3>Te escucho</h3><p>Conocemos tu historia, tus sensaciones y lo que necesitas hoy.</p></div></li>
              <li><span>02</span><div><h3>Diseñamos</h3><p>Creamos un plan seguro, flexible y realista para tu momento.</p></div></li>
              <li><span>03</span><div><h3>Avanzamos juntas</h3><p>Ajustamos, celebramos y construimos confianza paso a paso.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="section about" id="sobre-maite">
          <div className="shell about__grid">
            <div className="about__image"><Image src="/images/maite-embarazo-sentada.jpeg" alt="Maite embarazada sentada sobre una colchoneta junto a una pesa kettlebell" fill sizes="(max-width: 800px) 92vw, 40vw" /></div>
            <div className="about__copy">
              <p className="eyebrow">Sobre Maite</p>
              <h2>Ciencia, empatía y una profunda confianza en <em>tu cuerpo.</em></h2>
              <p>Creé MaitenMovimiento para ofrecer el tipo de acompañamiento que toda mujer merece en una etapa de tantos cambios: informado, cercano y libre de exigencias imposibles.</p>
              <p>Mi trabajo une movimiento consciente, escucha y progresión para ayudarte a sentirte fuerte sin dejar de ser amable contigo.</p>
              <blockquote>“No se trata de volver atrás. Se trata de avanzar sintiéndote sostenida.”</blockquote>
              <Link className="button button--ghost" href="#contacto">Conversemos</Link>
            </div>
          </div>
        </section>

        <section className="section section--ink testimonials">
          <div className="shell">
            <div className="section-heading section-heading--center"><p className="eyebrow eyebrow--light">Historias reales</p><h2>Ellas volvieron a confiar<br /><em>en su fuerza.</em></h2></div>
            <div className="testimonials-grid">
              <blockquote><p>“Llegué con miedo a moverme. Maite me enseñó que el movimiento podía ser un regalo y terminé mi embarazo sintiéndome más fuerte.”</p><footer><strong>Valentina</strong><span>Segundo trimestre · Santiago</span></footer></blockquote>
              <blockquote><p>“En el postparto necesitaba paciencia, no presión. Tener una guía adaptada a mí cambió por completo cómo viví mi recuperación.”</p><footer><strong>Andrea</strong><span>Postparto · 4 meses</span></footer></blockquote>
              <blockquote><p>“Las sesiones online se sienten muy cercanas. Cada ejercicio se ajusta y nunca me siento sola durante el proceso.”</p><footer><strong>Sofía</strong><span>Primer trimestre · Online</span></footer></blockquote>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="shell faq-section__grid">
            <div><p className="eyebrow">Preguntas frecuentes</p><h2>Lo que necesitas saber antes de <em>comenzar.</em></h2><p>Si tu duda no está aquí, escríbeme. La primera conversación es gratuita y sin compromiso.</p></div>
            <Faq />
          </div>
        </section>

        <section className="section contact" id="contacto">
          <div className="shell contact__grid">
            <div className="contact__copy">
              <p className="eyebrow eyebrow--light">Hablemos</p>
              <h2>Tu próxima etapa puede sentirse más <em>acompañada.</em></h2>
              <p>Cuéntame dónde estás y qué necesitas. Te responderé con una propuesta clara para dar el primer paso.</p>
              <a className="contact-direct" href="https://wa.me/56987572067" target="_blank" rel="noreferrer"><MessageCircle /> <span><strong>¿Prefieres WhatsApp?</strong><small>Escríbeme directamente</small></span></a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
      <a className="whatsapp-fab" href="https://wa.me/56987572067" target="_blank" rel="noreferrer" aria-label="Conversar por WhatsApp"><MessageCircle /></a>
    </>
  );
}
