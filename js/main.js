// ============================
// MAITENMOVIMIENTO – v2 JS
// ============================

// --- CUSTOM CURSOR ---
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (dot && ring) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  function bindCursorHover() {
    document.querySelectorAll('a, button, .service-card, .blog-card, .testimonio-card, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('hovered');    ring.classList.add('hovered'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
    });
  }
  bindCursorHover();
}

// --- NAVBAR ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// --- MOBILE MENU ---
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('open'); });
});

// --- FAQ ---
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) { el.target.classList.add('visible'); revealObserver.unobserve(el.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal, .stagger-children').forEach(el => revealObserver.observe(el));
}
observeReveal();

// --- NUMBER COUNTER ANIMATION ---
function animateCount(el, target, duration = 1500) {
  let start = 0;
  const isPercent = target.includes('%');
  const isPlus    = target.includes('+');
  const num       = parseInt(target.replace(/[^0-9]/g, ''));
  const step      = num / (duration / 16);
  const timer     = setInterval(() => {
    start = Math.min(start + step, num);
    el.textContent = (isPlus ? '+' : '') + Math.floor(start) + (isPercent ? '%' : '');
    if (start >= num) clearInterval(timer);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n').forEach(el => animateCount(el, el.textContent.trim()));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// --- PARALLAX hero image ---
window.addEventListener('scroll', () => {
  const frame = document.querySelector('.hero-img-frame');
  if (frame) frame.style.transform = `translateY(${window.scrollY * 0.15}px)`;
});

// --- TOAST ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

function handleNewsletter(e) {
  e.preventDefault();
  showToast('🌿 ¡Gracias! Te suscribiste al newsletter de Maitenmovimiento.');
  e.target.reset();
}

function handleContact(e) {
  e.preventDefault();
  showToast('💜 ¡Mensaje enviado! Te respondo a la brevedad.');
  e.target.reset();
}

// --- ACTIVE NAV HIGHLIGHT ---
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && active !== document.querySelector('.nav-cta')) active.style.color = 'var(--purple)';
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => activeObserver.observe(s));

// ============================================================
// --- BLOG DINÁMICO (sincronizado con Admin) ---
// ============================================================

const STORAGE_KEY = 'mm_posts';

const CAT_COLORS = {
  ejercicio: 'linear-gradient(135deg,#f0e8ff,#c8a8e8)',
  nutricion: 'linear-gradient(135deg,#fdf3d8,#e8c877)',
  postparto: 'linear-gradient(135deg,#edf7e8,#99CD85)',
  bienestar: 'linear-gradient(135deg,#f5edfb,#c0aee0)',
};

const CAT_SVG = {
  ejercicio: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="35" r="18" fill="#7A1FA1" opacity="0.3"/><ellipse cx="50" cy="70" rx="28" ry="33" fill="#7A1FA1" opacity="0.2"/></svg>',
  nutricion: '<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="35" fill="#C9A04E" opacity="0.2"/><path d="M30 55 Q50 30 70 55" stroke="#C9A04E" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  postparto: '<svg viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="60" rx="28" ry="36" fill="#7aab66" opacity="0.25"/><circle cx="50" cy="32" r="16" fill="#7aab66" opacity="0.3"/></svg>',
  bienestar: '<svg viewBox="0 0 100 100" fill="none"><path d="M50 20 Q68 38 50 55 Q32 38 50 20Z" fill="#7A1FA1" opacity="0.25"/><circle cx="50" cy="70" r="12" fill="#7A1FA1" opacity="0.15"/></svg>',
};

const CAT_LABELS = { ejercicio: 'Ejercicio', nutricion: 'Nutrición', postparto: 'Postparto', bienestar: 'Bienestar' };

const DEFAULT_POSTS = [
  { id:'post-1', title:'5 ejercicios seguros en el primer trimestre', category:'ejercicio', excerpt:'El primer trimestre puede ser desafiante: náuseas, cansancio, cambios hormonales. Aún así, el movimiento suave puede ser tu mejor aliado para sentirte mejor cada día.', content:'El primer trimestre puede ser desafiante: náuseas, cansancio, cambios hormonales. Aún así, el movimiento suave puede ser tu mejor aliado.\n\nEjercicios recomendados:\n\n1. Caminata suave (20–30 min diarios)\n2. Natación o aquagym prenatal\n3. Yoga y pilates para embarazadas\n4. Ejercicios de suelo pélvico (Kegel)\n5. Estiramientos suaves de cadera y espalda\n\nRecuerda siempre consultar con tu médico antes de comenzar cualquier rutina.', date:'2026-03-15', published:true, image:'' },
  { id:'post-2', title:'Qué comer en cada trimestre', category:'nutricion', excerpt:'Guía práctica de alimentación consciente para nutrir a tu bebé y cuidarte a ti sin restricciones ni culpa.', content:'Una alimentación equilibrada durante el embarazo es fundamental para el desarrollo del bebé y el bienestar de la mamá.\n\nPrimer trimestre:\n- Ácido fólico (espinaca, lentejas, aguacate)\n- Vitamina B6 para las náuseas\n- Hierro y proteínas\n\nSegundo trimestre:\n- Calcio (lácteos, almendras, brócoli)\n- DHA (pescado azul, nueces)\n- Aumentar ingesta calórica gradualmente\n\nTercer trimestre:\n- Fibra para el tránsito intestinal\n- Zinc y magnesio\n- Hidratación extra (mínimo 2 litros de agua)', date:'2026-03-08', published:true, image:'' },
  { id:'post-3', title:'Recuperación postparto: sin apuros', category:'postparto', excerpt:'Cuándo volver al movimiento, qué priorizar y cómo escuchar a tu cuerpo en esta nueva etapa.', content:'El postparto es un período de transformación profunda. La recuperación es un proceso gradual que requiere paciencia y cuidado.\n\nSemanas 1–6:\n- Descanso prioritario\n- Ejercicios suaves de suelo pélvico\n- Respiración diafragmática\n- Caminatas cortas al aire libre\n\nSemanas 6–12:\n- Evaluación del suelo pélvico con fisioterapeuta\n- Retomar actividad suave si hay aval médico\n- Pilates hipopresivo\n\nMás de 12 semanas:\n- Progresión gradual con supervisión profesional\n- Entrenamiento de fuerza suave\n- Escuchar señales del cuerpo siempre', date:'2026-03-01', published:true, image:'' },
  { id:'post-4', title:'Respiración consciente para embarazadas', category:'bienestar', excerpt:'Técnicas para reducir el estrés y conectar profundamente con tu bebé en cualquier momento del día.', content:'La respiración consciente es una herramienta poderosa durante el embarazo. Reduce el estrés, mejora la oxigenación y fortalece el vínculo con tu bebé.\n\nTécnicas recomendadas:\n\n1. Respiración diafragmática\nInhala 4 segundos, expande el abdomen. Exhala 6 segundos, libera tensión.\n\n2. Respiración 4-7-8\nInhala 4 seg → aguanta 7 seg → exhala 8 seg. Reduce la ansiedad al instante.\n\n3. Respiración ujjayi (yogui)\nHaz un suave sonido oceánico en la garganta al respirar. Muy utilizada en yoga prenatal.\n\nPráctica 10 minutos al día y nota la diferencia.', date:'2026-02-22', published:true, image:'' },
];

function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_POSTS;
  } catch { return DEFAULT_POSTS; }
}

function fmtDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${+d} ${months[+m - 1]} ${y}`;
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildCardHtml(post, isLarge) {
  const bg  = CAT_COLORS[post.category] || 'linear-gradient(135deg,#f5edfb,#c0aee0)';
  const svg = CAT_SVG[post.category]    || '';
  const img = post.image
    ? `<img src="${escHtml(post.image)}" alt="${escHtml(post.title)}" loading="lazy">`
    : '';
  const label = CAT_LABELS[post.category] || post.category;

  return `
    <article class="blog-card${isLarge ? ' large' : ''}" data-category="${escHtml(post.category)}" data-id="${escHtml(post.id)}">
      <div class="blog-img" style="background:${bg}">
        ${img}
        <div class="blog-img-inner">${img ? '' : svg}</div>
      </div>
      <div class="blog-card-body">
        <span class="blog-cat">${escHtml(label)}</span>
        <h3>${escHtml(post.title)}</h3>
        <p>${escHtml(post.excerpt)}</p>
        <div class="blog-meta">
          <span>${fmtDate(post.date)}</span>
          <button class="read-more" onclick="openArticle('${escHtml(post.id)}')">
            ${isLarge ? 'Leer artículo' : 'Leer'} →
          </button>
        </div>
      </div>
    </article>`;
}

function renderBlog(filter) {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;

  const posts    = getPosts().filter(p => p.published);
  const filtered = filter && filter !== 'all' ? posts.filter(p => p.category === filter) : posts;

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted);padding:3rem 0;font-size:0.9rem;">No hay artículos en esta categoría todavía.</p>';
    return;
  }

  grid.innerHTML = filtered.map((p, i) => buildCardHtml(p, i === 0)).join('');

  // Re-observar animaciones en las nuevas cards
  grid.querySelectorAll('.blog-card').forEach(el => revealObserver.observe(el));
  if (dot && ring) bindCursorHover();
}

// Filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBlog(btn.dataset.filter);
  });
});

// Escucha cambios desde el admin (otra pestaña)
window.addEventListener('storage', e => {
  if (e.key === STORAGE_KEY || e.key === 'mm_posts_ts') {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderBlog(activeFilter);
  }
});

// Render inicial
renderBlog('all');

// ============================================================
// --- MODAL ARTÍCULO ---
// ============================================================

function openArticle(id) {
  const post = getPosts().find(p => p.id === id);
  if (!post) return;

  document.getElementById('articleCat').textContent   = CAT_LABELS[post.category] || post.category;
  document.getElementById('articleCat').className     = 'article-cat cat-' + post.category;
  document.getElementById('articleModalTitle').textContent = post.title;
  document.getElementById('articleDate').textContent  = fmtDate(post.date);

  // Convierte saltos de línea en párrafos
  const paragraphs = post.content
    ? post.content.split('\n').map(l => l.trim()).filter(Boolean)
        .map(l => l.startsWith('-') || /^\d+\./.test(l)
          ? `<li>${escHtml(l.replace(/^[-\d.]\s*/, ''))}</li>`
          : `<p>${escHtml(l)}</p>`)
        .join('')
    : `<p>${escHtml(post.excerpt)}</p>`;

  document.getElementById('articleBody').innerHTML = paragraphs;

  const headerBg = document.getElementById('articleHeaderBg');
  headerBg.style.background = CAT_COLORS[post.category] || 'var(--purple-pale)';

  const overlay = document.getElementById('articleOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('articleClose').focus();
}

function closeArticleModal() {
  document.getElementById('articleOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('articleClose').addEventListener('click', closeArticleModal);
document.getElementById('articleOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('articleOverlay')) closeArticleModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeArticleModal();
});
