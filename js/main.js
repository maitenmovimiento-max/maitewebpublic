// ============================
// MAITENMOVIMIENTO – v2 JS
// ============================

// --- CUSTOM CURSOR ---
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

// Ring follows with lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .service-card, .blog-card, .testimonio-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
});

// --- NAVBAR ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// --- MOBILE MENU ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('open'); });
});

// --- BLOG FILTERS ---
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.blog-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.4s, transform 0.4s';
      if (show) {
        card.style.display = ''; 
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
      } else {
        card.style.opacity = '0'; card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 350);
      }
    });
  });
});

// --- FAQ ---
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// --- SCROLL REVEAL ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      revealObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .stagger-children').forEach(el => revealObserver.observe(el));

// --- NUMBER COUNTER ANIMATION ---
function animateCount(el, target, duration = 1500) {
  let start = 0;
  const isPercent = target.includes('%');
  const isPlus = target.includes('+');
  const num = parseInt(target.replace(/[^0-9]/g, ''));
  const step = num / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, num);
    const display = Math.floor(start);
    el.textContent = (isPlus ? '+' : '') + display + (isPercent ? '%' : '');
    if (start >= num) clearInterval(timer);
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n').forEach(el => {
        animateCount(el, el.textContent.trim());
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// --- PARALLAX on hero image ---
window.addEventListener('scroll', () => {
  const frame = document.querySelector('.hero-img-frame');
  if (frame) {
    const y = window.scrollY * 0.15;
    frame.style.transform = `translateY(${y}px)`;
  }
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
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active && active !== document.querySelector('.nav-cta')) {
        active.style.color = 'var(--purple)';
      }
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => activeObserver.observe(s));
