/* ======================================================
   AR-RISALAH ACADEMY — SHARED JAVASCRIPT
   ====================================================== */

// ── THEME ──
function initTheme() {
  const saved = localStorage.getItem('ara_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ara_theme', next);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

// ── NAVBAR SCROLL ──
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE MENU ──
function toggleNav() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}

// ── FADE IN OBSERVER ──
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── TABS ──
function initTabs(containerSel) {
  const container = document.querySelector(containerSel || '.tabs-container');
  if (!container) return;
  container.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const target = btn.dataset.tab;
    container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === target);
    });
  });
}
function switchTab(tabId, containerId) {
  const container = containerId ? document.getElementById(containerId) : document;
  if (!container) return;
  container.querySelectorAll && container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  container.querySelectorAll && container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const btn = container.querySelector ? container.querySelector(`[data-tab="${tabId}"]`) : document.querySelector(`[data-tab="${tabId}"]`);
  const panel = document.getElementById(tabId);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

// ── MODAL ──
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  });
}

// ── TOAST NOTIFICATIONS ──
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(container);
  }
  const colors = { success: '#065f46', error: '#991b1b', warning: '#92400e', info: '#1e40af' };
  const bgs = { success: '#d1fae5', error: '#fee2e2', warning: '#fef3c7', info: '#dbeafe' };
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:${bgs[type]};color:${colors[type]};padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);animation:slideIn 0.3s ease;max-width:320px;font-family:'DM Sans',sans-serif;`;
  toast.innerHTML = `${icons[type]} ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── GRADING ENGINE ──
const GRADE_SYSTEM_30_70 = { ca: 30, exam: 70 };
const GRADE_SYSTEM_40_60 = { ca: 40, exam: 60 };

function getGrade(total) {
  if (total >= 90) return { grade: 'A+', remark: 'Excellent', cls: 'grade-a-plus' };
  if (total >= 80) return { grade: 'A', remark: 'Very Good', cls: 'grade-a' };
  if (total >= 70) return { grade: 'B', remark: 'Good', cls: 'grade-b' };
  if (total >= 60) return { grade: 'C', remark: 'Credit', cls: 'grade-c' };
  if (total >= 50) return { grade: 'D', remark: 'Fair', cls: 'grade-d' };
  if (total >= 40) return { grade: 'E', remark: 'Weak', cls: 'grade-e' };
  return { grade: 'F', remark: 'Fail', cls: 'grade-f' };
}

function getPromotionStatus(avg) {
  if (avg >= 50) return { text: 'PROMOTED', badge: 'badge-promoted', icon: '✅' };
  if (avg >= 40) return { text: 'CONDITIONAL PROMOTION', badge: 'badge-conditional', icon: '⚠️' };
  return { text: 'REPEAT CLASS', badge: 'badge-repeat', icon: '❌' };
}

function calcPosition(score, allScores) {
  const higher = allScores.filter(s => s > score).length;
  return higher + 1;
}

function ordinal(n) {
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

function calcAttendancePercent(opened, present) {
  if (!opened || opened === 0) return 0;
  return Math.round((present / opened) * 100);
}

// ── RESULT SERIAL NUMBER ──
function generateSerial(admNo, session, term, classN) {
  const t = { 'First Term': 1, 'Second Term': 2, 'Third Term': 3 }[term] || 1;
  const code = Math.random().toString(36).substring(2,7).toUpperCase();
  return `ARA-${session.replace('/','')}-T${t}-${(classN||'').replace(' ','')}-${(admNo||'').replace('/','')}-${code}`;
}

// ── DATA STORE (localStorage-based for demo) ──
const ARA_DB = {
  key: 'ara_db_v1',
  get() { try { return JSON.parse(localStorage.getItem(this.key) || '{}'); } catch { return {}; } },
  set(data) { localStorage.setItem(this.key, JSON.stringify(data)); },
  getStudents() { return this.get().students || []; },
  saveStudent(s) {
    const db = this.get(); db.students = db.students || [];
    const idx = db.students.findIndex(x => x.admNo === s.admNo);
    if (idx >= 0) db.students[idx] = s; else db.students.push(s);
    this.set(db); return s;
  },
  deleteStudent(admNo) {
    const db = this.get(); db.students = (db.students || []).filter(s => s.admNo !== admNo); this.set(db);
  },
  getResults() { return this.get().results || []; },
  saveResult(r) {
    const db = this.get(); db.results = db.results || [];
    const idx = db.results.findIndex(x => x.serial === r.serial);
    if (idx >= 0) db.results[idx] = r; else db.results.push(r);
    this.set(db); return r;
  },
  getMedia() { return this.get().media || []; },
  saveMedia(m) {
    const db = this.get(); db.media = db.media || []; db.media.unshift(m); this.set(db);
  },
  getAdmNo() {
    const db = this.get(); db.lastAdmNo = (db.lastAdmNo || 0) + 1;
    const no = 'ARA/' + new Date().getFullYear() + '/' + String(db.lastAdmNo).padStart(3,'0');
    this.set(db); return no;
  }
};

// ── SEED DEMO DATA ──
function seedDemoData() {
  const db = ARA_DB.get();
  if (db.seeded) return;
  const students = [
    { admNo: 'ARA/2025/001', name: 'Ahmad Yusuf Bello', gender: 'Male', class: 'Basic 4', dob: '2014-03-15', parent: 'Alhaji Yusuf Bello', phone: '08012345678', address: 'Saki, Oyo State', religion: 'Islam', nationality: 'Nigerian', admDate: '2023-09-01' },
    { admNo: 'ARA/2025/002', name: 'Maryam Abdullahi', gender: 'Female', class: 'Basic 4', dob: '2014-07-22', parent: 'Mrs. Abdullahi', phone: '08023456789', address: 'Saki, Oyo State', religion: 'Islam', nationality: 'Nigerian', admDate: '2023-09-01' },
    { admNo: 'ARA/2025/003', name: 'Usman Ibrahim Dada', gender: 'Male', class: 'Nursery 2', dob: '2019-11-05', parent: 'Mr. Ibrahim Dada', phone: '08034567890', address: 'Saki, Oyo State', religion: 'Islam', nationality: 'Nigerian', admDate: '2024-01-10' },
    { admNo: 'ARA/2025/004', name: 'Fatimah Olawale', gender: 'Female', class: 'Basic 1', dob: '2017-04-18', parent: 'Mrs. Olawale', phone: '08045678901', address: 'Saki, Oyo State', religion: 'Islam', nationality: 'Nigerian', admDate: '2024-01-10' },
    { admNo: 'ARA/2025/005', name: 'Khalid Musa Sanni', gender: 'Male', class: 'Basic 4', dob: '2013-09-30', parent: 'Malam Musa Sanni', phone: '08056789012', address: 'Saki, Oyo State', religion: 'Islam', nationality: 'Nigerian', admDate: '2022-09-01' },
  ];
  db.students = students;
  db.seeded = true;
  ARA_DB.set(db);
}

// ── LOGO SVG STRING ──
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3"/>
  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
  <text x="50" y="16" text-anchor="middle" font-family="serif" font-size="6.5" fill="currentColor" font-weight="700" letter-spacing="0.5">AR-RISALAH ACADEMY</text>
  <path d="M20 22 Q50 17 80 22" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="50" y="31" text-anchor="middle" font-family="serif" font-size="5.5" fill="currentColor" opacity="0.8">✦ SAKI ✦</text>
  <!-- Open Book -->
  <rect x="29" y="40" width="42" height="28" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="50" y1="40" x2="50" y2="68" stroke="currentColor" stroke-width="1.8"/>
  <path d="M31 46 Q40 42 50 46" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <path d="M50 46 Q60 42 69 46" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <path d="M31 52 Q40 48 50 52" fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.7"/>
  <path d="M50 52 Q60 48 69 52" fill="none" stroke="currentColor" stroke-width="0.9" opacity="0.7"/>
  <path d="M31 57 Q40 54 50 57" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>
  <path d="M50 57 Q60 54 69 57" fill="none" stroke="currentColor" stroke-width="0.7" opacity="0.5"/>
  <!-- Crescent -->
  <path d="M43 36 Q46 30 52 31 Q48 33 48 37 Q45 37 43 36Z" fill="currentColor"/>
  <!-- Star -->
  <polygon points="55,30 56.2,33.5 60,33.5 57,35.8 58,39 55,37 52,39 53,35.8 50,33.5 53.8,33.5" fill="currentColor" transform="scale(0.55) translate(44,26)"/>
  <!-- Pencil -->
  <rect x="66" y="34" width="5" height="12" rx="1.5" fill="currentColor" opacity="0.8" transform="rotate(35,68.5,40)"/>
  <polygon points="65.5,44 70.5,44 68,49" fill="currentColor" opacity="0.8" transform="rotate(35,68,44)"/>
  <!-- Banner -->
  <path d="M18 76 Q50 72 82 76 Q50 80 18 76Z" fill="currentColor" opacity="0.12"/>
  <rect x="18" y="73" width="64" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="50" y="80" text-anchor="middle" font-family="serif" font-size="5.5" fill="currentColor" font-weight="700">KNOWLEDGE IS INSIGHT</text>
</svg>`;

// ── RENDER LOGO ──
function renderLogos() {
  document.querySelectorAll('.logo-placeholder').forEach(el => {
    el.innerHTML = LOGO_SVG;
  });
}

// ── PRINT RESULT ──
function printResult() {
  window.print();
}

// ── EXPORT CSV ──
function exportCSV(data, filename) {
  if (!data.length) return showToast('No data to export', 'warning');
  const headers = Object.keys(data[0]);
  const rows = [headers.join(','), ...data.map(r => headers.map(h => `"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully!', 'success');
}

// ── INIT ALL ──
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initFadeIn();
  initModals();
  renderLogos();
  seedDemoData();
});
