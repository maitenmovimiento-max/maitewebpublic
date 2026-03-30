// ============================
// MAITENMOVIMIENTO – Admin JS
// ============================

const STORAGE_KEY  = 'mm_posts';
const AUTH_KEY     = 'mm_session';
const PASS_KEY     = 'mm_password';
const DEFAULT_PASS = 'maiten2026';

// Posts por defecto (mismos que el sitio)
const DEFAULT_POSTS = [
  {
    id: 'post-1',
    title: '5 ejercicios seguros en el primer trimestre',
    category: 'ejercicio',
    excerpt: 'El primer trimestre puede ser desafiante: náuseas, cansancio, cambios hormonales. Aún así, el movimiento suave puede ser tu mejor aliado para sentirte mejor cada día.',
    content: 'El primer trimestre puede ser desafiante: náuseas, cansancio, cambios hormonales. Aún así, el movimiento suave puede ser tu mejor aliado.\n\nEjercicios recomendados:\n\n1. Caminata suave (20–30 min diarios)\n2. Natación o aquagym prenatal\n3. Yoga y pilates para embarazadas\n4. Ejercicios de suelo pélvico (Kegel)\n5. Estiramientos suaves de cadera y espalda\n\nRecuerda siempre consultar con tu médico antes de comenzar cualquier rutina.',
    date: '2026-03-15',
    published: true,
    image: ''
  },
  {
    id: 'post-2',
    title: 'Qué comer en cada trimestre',
    category: 'nutricion',
    excerpt: 'Guía práctica de alimentación consciente para nutrir a tu bebé y cuidarte a ti sin restricciones ni culpa.',
    content: 'Una alimentación equilibrada durante el embarazo es fundamental para el desarrollo del bebé y el bienestar de la mamá.\n\nPrimer trimestre:\n- Ácido fólico (espinaca, lentejas, aguacate)\n- Vitamina B6 para las náuseas\n- Hierro y proteínas\n\nSegundo trimestre:\n- Calcio (lácteos, almendras, brócoli)\n- DHA (pescado azul, nueces)\n- Aumentar ingesta calórica gradualmente\n\nTercer trimestre:\n- Fibra para el tránsito intestinal\n- Zinc y magnesio\n- Hidratación extra (mínimo 2 litros de agua)',
    date: '2026-03-08',
    published: true,
    image: ''
  },
  {
    id: 'post-3',
    title: 'Recuperación postparto: sin apuros',
    category: 'postparto',
    excerpt: 'Cuándo volver al movimiento, qué priorizar y cómo escuchar a tu cuerpo en esta nueva etapa.',
    content: 'El postparto es un período de transformación profunda. La recuperación es un proceso gradual que requiere paciencia y cuidado.\n\nSemanas 1–6:\n- Descanso prioritario\n- Ejercicios suaves de suelo pélvico\n- Respiración diafragmática\n- Caminatas cortas al aire libre\n\nSemanas 6–12:\n- Evaluación del suelo pélvico con fisioterapeuta\n- Retomar actividad suave si hay aval médico\n- Pilates hipopresivo\n\nMás de 12 semanas:\n- Progresión gradual con supervisión profesional\n- Entrenamiento de fuerza suave\n- Escuchar señales del cuerpo siempre',
    date: '2026-03-01',
    published: true,
    image: ''
  },
  {
    id: 'post-4',
    title: 'Respiración consciente para embarazadas',
    category: 'bienestar',
    excerpt: 'Técnicas para reducir el estrés y conectar profundamente con tu bebé en cualquier momento del día.',
    content: 'La respiración consciente es una herramienta poderosa durante el embarazo. Reduce el estrés, mejora la oxigenación y fortalece el vínculo con tu bebé.\n\nTécnicas recomendadas:\n\n1. Respiración diafragmática\nInhala 4 segundos, expande el abdomen. Exhala 6 segundos, libera tensión.\n\n2. Respiración 4-7-8\nInhala 4 seg → aguanta 7 seg → exhala 8 seg. Reduce la ansiedad al instante.\n\n3. Respiración ujjayi (yogui)\nHaz un suave sonido oceánico en la garganta al respirar. Muy utilizada en yoga prenatal.\n\nPráctica 10 minutos al día y nota la diferencia.',
    date: '2026-02-22',
    published: true,
    image: ''
  }
];

// ── AUTH ──────────────────────────────────────────────────

function getStoredPassword() {
  return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
}

function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function login(password) {
  if (password === getStoredPassword()) {
    sessionStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  showLogin();
}

// ── DATA ──────────────────────────────────────────────────

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    savePosts(DEFAULT_POSTS);
    return [...DEFAULT_POSTS];
  }
  try { return JSON.parse(raw); }
  catch { return [...DEFAULT_POSTS]; }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  // Señal para que el sitio principal se actualice (si está abierto)
  localStorage.setItem('mm_posts_ts', Date.now().toString());
}

function getPost(id) {
  return getPosts().find(p => p.id === id) || null;
}

function createPost(data) {
  const posts = getPosts();
  const post  = { id: 'post-' + Date.now(), ...data };
  posts.unshift(post);
  savePosts(posts);
  return post;
}

function updatePost(id, data) {
  const posts = getPosts();
  const i = posts.findIndex(p => p.id === id);
  if (i === -1) return null;
  posts[i] = { ...posts[i], ...data };
  savePosts(posts);
  return posts[i];
}

function deletePost(id) {
  savePosts(getPosts().filter(p => p.id !== id));
}

function resetToDefaults() {
  savePosts([...DEFAULT_POSTS]);
}

// ── VISTA: LOGIN / APP ────────────────────────────────────

function showLogin() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminApp').classList.add('hidden');
}

function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminApp').classList.remove('hidden');
  switchView('dashboard');
}

function switchView(name) {
  // Vistas
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');

  // Nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-view="${name}"]`);
  if (navItem) navItem.classList.add('active');

  // Topbar
  const titles = { dashboard: 'Dashboard', posts: 'Blog Posts', config: 'Configuración' };
  document.getElementById('pageTitle').textContent = titles[name] || name;
  document.getElementById('newPostBtn').style.display = name === 'posts' ? 'inline-flex' : 'none';

  // Cerrar sidebar en móvil
  document.getElementById('sidebar').classList.remove('open');

  if (name === 'dashboard') renderDashboard();
  if (name === 'posts')     renderPostsTable(getPosts());
}

// ── DASHBOARD ─────────────────────────────────────────────

function renderDashboard() {
  const posts      = getPosts();
  const published  = posts.filter(p => p.published);
  const drafts     = posts.filter(p => !p.published);
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  document.getElementById('statTotal').textContent      = posts.length;
  document.getElementById('statPublished').textContent  = published.length;
  document.getElementById('statDraft').textContent      = drafts.length;
  document.getElementById('statCategories').textContent = categories.length;

  const list = document.getElementById('recentPostsList');

  if (posts.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✦</div>
        <p>No hay posts todavía.</p>
        <button class="btn-primary" onclick="switchView('posts'); openNewModal();">Crear primer post</button>
      </div>`;
    return;
  }

  list.innerHTML = posts.slice(0, 6).map(p => `
    <div class="recent-row">
      <span class="cat-badge ${esc(p.category)}">${catLabel(p.category)}</span>
      <span class="recent-title-text">${esc(p.title)}</span>
      <span class="recent-date-text">${fmtDate(p.date)}</span>
      <span class="status-pill ${p.published ? 'published' : 'draft'}">${p.published ? 'Publicado' : 'Borrador'}</span>
    </div>
  `).join('');
}

// ── POSTS TABLE ───────────────────────────────────────────

function renderPostsTable(posts) {
  const tbody = document.getElementById('postsTableBody');

  if (posts.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5">
        <div class="empty-state">
          <div class="empty-icon">✦</div>
          <p>No hay posts que coincidan.</p>
          <button class="btn-primary" onclick="openNewModal()">+ Crear nuevo post</button>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = posts.map(p => `
    <tr>
      <td class="td-title">
        <strong>${esc(p.title)}</strong>
        <span>${esc(p.excerpt ? p.excerpt.slice(0, 72) + '…' : '')}</span>
      </td>
      <td><span class="cat-badge ${esc(p.category)}">${catLabel(p.category)}</span></td>
      <td>${fmtDate(p.date)}</td>
      <td><span class="status-pill ${p.published ? 'published' : 'draft'}">${p.published ? 'Publicado' : 'Borrador'}</span></td>
      <td>
        <div class="table-actions">
          <button class="action-btn" title="Editar" onclick="openEditModal('${p.id}')">
            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
          </button>
          <button class="action-btn" title="${p.published ? 'Despublicar' : 'Publicar'}" onclick="togglePublish('${p.id}')">
            ${p.published
              ? '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>'
              : '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>'
            }
          </button>
          <button class="action-btn delete-btn" title="Eliminar" onclick="openDeleteModal('${p.id}')">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAndRender() {
  const q        = document.getElementById('searchPosts').value.toLowerCase().trim();
  const category = document.getElementById('filterCategory').value;
  const status   = document.getElementById('filterStatus').value;

  let posts = getPosts();
  if (q)                  posts = posts.filter(p => p.title.toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q));
  if (category)           posts = posts.filter(p => p.category === category);
  if (status === 'published') posts = posts.filter(p => p.published);
  if (status === 'draft')     posts = posts.filter(p => !p.published);

  renderPostsTable(posts);
}

function togglePublish(id) {
  const post = getPost(id);
  if (!post) return;
  updatePost(id, { published: !post.published });
  filterAndRender();
  renderDashboard();
  showToast(post.published ? '◉ Post despublicado' : '✓ Post ahora publicado');
}

// ── MODAL EDITOR ──────────────────────────────────────────

function openNewModal() {
  document.getElementById('postId').value        = '';
  document.getElementById('postForm').reset();
  document.getElementById('postDate').value      = today();
  document.getElementById('postPublished').checked = true;
  document.getElementById('modalTitle').textContent = 'Nuevo post';
  openModal('modalOverlay');
  document.getElementById('postTitle').focus();
}

function openEditModal(id) {
  const p = getPost(id);
  if (!p) return;
  document.getElementById('postId').value         = p.id;
  document.getElementById('postTitle').value      = p.title;
  document.getElementById('postCategory').value   = p.category;
  document.getElementById('postExcerpt').value    = p.excerpt  || '';
  document.getElementById('postContent').value    = p.content  || '';
  document.getElementById('postDate').value       = p.date     || today();
  document.getElementById('postImage').value      = p.image    || '';
  document.getElementById('postPublished').checked = !!p.published;
  document.getElementById('modalTitle').textContent = 'Editar post';
  openModal('modalOverlay');
  document.getElementById('postTitle').focus();
}

function savePost() {
  const title    = document.getElementById('postTitle').value.trim();
  const category = document.getElementById('postCategory').value;

  if (!title)    { showToast('⚠ El título es requerido');       return; }
  if (!category) { showToast('⚠ Selecciona una categoría');     return; }

  const data = {
    title,
    category,
    excerpt:   document.getElementById('postExcerpt').value.trim(),
    content:   document.getElementById('postContent').value.trim(),
    date:      document.getElementById('postDate').value || today(),
    image:     document.getElementById('postImage').value.trim(),
    published: document.getElementById('postPublished').checked,
  };

  const id = document.getElementById('postId').value;
  if (id) {
    updatePost(id, data);
    showToast('✓ Post actualizado');
  } else {
    createPost(data);
    showToast('✓ Post creado');
  }

  closeModal('modalOverlay');
  filterAndRender();
  renderDashboard();
}

// ── MODAL DELETE ──────────────────────────────────────────

let _pendingDeleteId = null;

function openDeleteModal(id) {
  const p = getPost(id);
  if (!p) return;
  _pendingDeleteId = id;
  document.getElementById('deletePostTitle').textContent = p.title;
  openModal('deleteOverlay');
}

function confirmDelete() {
  if (!_pendingDeleteId) return;
  deletePost(_pendingDeleteId);
  _pendingDeleteId = null;
  closeModal('deleteOverlay');
  filterAndRender();
  renderDashboard();
  showToast('🗑 Post eliminado');
}

// ── MODAL HELPERS ─────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
  _pendingDeleteId = null;
}

// ── CONFIG ────────────────────────────────────────────────

function changePassword(e) {
  e.preventDefault();
  const current  = document.getElementById('currentPass').value;
  const newPass  = document.getElementById('newPass').value;
  const confirm  = document.getElementById('confirmPass').value;

  if (current !== getStoredPassword())  { showToast('⚠ Contraseña actual incorrecta');          return; }
  if (newPass.length < 6)               { showToast('⚠ Mínimo 6 caracteres');                   return; }
  if (newPass !== confirm)              { showToast('⚠ Las contraseñas no coinciden');           return; }

  localStorage.setItem(PASS_KEY, newPass);
  document.getElementById('changePassForm').reset();
  showToast('✓ Contraseña actualizada');
}

function exportPosts() {
  const json = JSON.stringify(getPosts(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: `mm-posts-${today()}.json` });
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Posts exportados como JSON');
}

function importPosts(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const posts = JSON.parse(e.target.result);
      if (!Array.isArray(posts)) throw new Error();
      savePosts(posts);
      filterAndRender();
      renderDashboard();
      showToast(`✓ ${posts.length} posts importados`);
    } catch {
      showToast('⚠ Archivo inválido — debe ser JSON exportado de este panel');
    }
  };
  reader.readAsText(file);
}

// ── UTILS ─────────────────────────────────────────────────

function catLabel(cat) {
  return { ejercicio: 'Ejercicio', nutricion: 'Nutrición', postparto: 'Postparto', bienestar: 'Bienestar' }[cat] || cat;
}

function fmtDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${+d} ${months[+m - 1]} ${y}`;
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// Escapa HTML para prevenir XSS
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 3600);
}

// ── INIT ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Mostrar login o app
  isLoggedIn() ? showApp() : showLogin();

  // ── Login form
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const pass = document.getElementById('passwordInput').value;
    if (login(pass)) {
      showApp();
    } else {
      document.getElementById('loginError').textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  });

  document.getElementById('passwordInput').addEventListener('input', () => {
    document.getElementById('loginError').textContent = '';
  });

  // Toggle ver/ocultar contraseña
  const eyeBtn  = document.getElementById('eyeBtn');
  const passIn  = document.getElementById('passwordInput');
  eyeBtn.addEventListener('click', () => {
    passIn.type = passIn.type === 'password' ? 'text' : 'password';
  });

  // ── Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // ── Navegación sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => { e.preventDefault(); switchView(item.dataset.view); });
  });

  // ── "Ver todos" desde dashboard
  document.querySelectorAll('[data-view="posts"]').forEach(btn => {
    if (btn.tagName === 'BUTTON') btn.addEventListener('click', () => switchView('posts'));
  });

  // ── Hamburger (móvil)
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // ── Nuevo post
  document.getElementById('newPostBtn').addEventListener('click', openNewModal);

  // ── Modal editor: cerrar
  document.getElementById('modalClose').addEventListener('click',  () => closeModal('modalOverlay'));
  document.getElementById('cancelBtn').addEventListener('click',   () => closeModal('modalOverlay'));
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal('modalOverlay');
  });

  // ── Modal editor: guardar
  document.getElementById('savePostBtn').addEventListener('click', savePost);
  document.getElementById('postForm').addEventListener('submit',   e => { e.preventDefault(); savePost(); });

  // ── Modal delete: cancelar
  document.getElementById('deleteCancelX').addEventListener('click',   () => closeModal('deleteOverlay'));
  document.getElementById('deleteCancelBtn').addEventListener('click', () => closeModal('deleteOverlay'));
  document.getElementById('deleteOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('deleteOverlay')) closeModal('deleteOverlay');
  });

  // ── Modal delete: confirmar
  document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);

  // ── Filtros tabla
  document.getElementById('searchPosts').addEventListener('input',    filterAndRender);
  document.getElementById('filterCategory').addEventListener('change', filterAndRender);
  document.getElementById('filterStatus').addEventListener('change',   filterAndRender);

  // ── Config: contraseña
  document.getElementById('changePassForm').addEventListener('submit', changePassword);

  // ── Config: export / import
  document.getElementById('exportBtn').addEventListener('click', exportPosts);
  document.getElementById('importFile').addEventListener('change', e => {
    if (e.target.files[0]) { importPosts(e.target.files[0]); e.target.value = ''; }
  });

  // ── Config: reset
  document.getElementById('resetDataBtn').addEventListener('click', () => {
    if (confirm('¿Restablecer todos los posts a los valores por defecto? Se perderán los cambios actuales.')) {
      resetToDefaults();
      filterAndRender();
      renderDashboard();
      showToast('✓ Posts restablecidos por defecto');
    }
  });

  // ── Teclado: Escape cierra modales
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modalOverlay').classList.contains('hidden'))  closeModal('modalOverlay');
    if (!document.getElementById('deleteOverlay').classList.contains('hidden')) closeModal('deleteOverlay');
  });

});
