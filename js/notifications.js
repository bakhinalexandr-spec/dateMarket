/* ── NOTIFICATIONS ── */

const NOTIF_QUEUE = [];
let NOTIF_ACTIVE = false;
let NOTIF_PANEL_ITEMS = [];

// Toast queue system (stacked toasts)
function showToast(msg, icon = '💬', color = 'var(--text)') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
  toast.style.borderLeftColor = color;
  container.appendChild(toast);
  // add to panel
  const ts = new Date();
  const timeStr = ts.getHours().toString().padStart(2,'0') + ':' + ts.getMinutes().toString().padStart(2,'0');
  NOTIF_PANEL_ITEMS.unshift({ msg, icon, color, time: timeStr });
  if (NOTIF_PANEL_ITEMS.length > 20) NOTIF_PANEL_ITEMS.pop();
  updateNotifBadge();
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Override existing showNotif to also use toast
const _origShowNotif = window.showNotif;
window.showNotif = function(msg) {
  showToast(msg, '✓', 'var(--teal)');
};

function updateNotifBadge() {
  const badge = document.getElementById('notif-badge');
  if (badge) {
    badge.textContent = Math.min(NOTIF_PANEL_ITEMS.length, 9);
    badge.style.display = NOTIF_PANEL_ITEMS.length > 0 ? 'flex' : 'none';
  }
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) renderNotifPanel();
}

function renderNotifPanel() {
  const list = document.getElementById('notif-panel-list');
  if (!list) return;
  if (NOTIF_PANEL_ITEMS.length === 0) {
    list.innerHTML = '<div style="color:var(--faint);font-size:11px;text-align:center;padding:20px 0">Уведомлений нет</div>';
    return;
  }
  list.innerHTML = NOTIF_PANEL_ITEMS.map(n => `
    <div class="notif-panel-item">
      <span class="notif-panel-icon">${n.icon}</span>
      <div class="notif-panel-body">
        <div class="notif-panel-msg">${n.msg}</div>
        <div class="notif-panel-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function clearNotifs() {
  NOTIF_PANEL_ITEMS = [];
  updateNotifBadge();
  renderNotifPanel();
}

// ── REAL-TIME SIMULATION ──
const NOTIF_TEMPLATES_GUEST = [
  { msg: () => `Анна из Москвы получила ${Math.floor(Math.random()*5)+3} новых сообщений`, icon: '✉', color: 'var(--pink)' },
  { msg: () => `Новая анкета: ${['Дмитрий','Алексей','Павел','Иван'][Math.floor(Math.random()*4)]}, ${Math.floor(Math.random()*8)+24} лет`, icon: '👤', color: 'var(--blue)' },
  { msg: () => `Рейтинг обновлён — Елена поднялась на #${Math.floor(Math.random()*5)+1}`, icon: '↑', color: 'var(--amber)' },
  { msg: () => `${Math.floor(Math.random()*8)+2} новых знакомств за последний час`, icon: '★', color: 'var(--teal)' },
];

const NOTIF_TEMPLATES_MALE = [
  { msg: () => `Наташа из Казани ответила на ваше сообщение`, icon: '✉', color: 'var(--pink)' },
  { msg: () => `Анна посмотрела вашу анкету`, icon: '👁', color: 'var(--blue)' },
  { msg: () => `Ваш балл привлекательности вырос`, icon: '↑', color: 'var(--amber)' },
  { msg: () => `Мария добавила вас в избранное`, icon: '♥', color: 'var(--pink)' },
  { msg: () => `Подарок доставлен в ПВЗ Ozon`, icon: '🎁', color: 'var(--teal)' },
];

const NOTIF_TEMPLATES_FEMALE = [
  { msg: () => `Вам написал ${['Дмитрий','Алексей','Павел','Сергей'][Math.floor(Math.random()*4)]}`, icon: '✉', color: 'var(--blue)' },
  { msg: () => `Новый поклонник! Вас уже ${Math.floor(Math.random()*5)+8} человек отметили как фаворита`, icon: '★', color: 'var(--amber)' },
  { msg: () => `Ваш рейтинг вырос на ${Math.floor(Math.random()*3)+1} позицию`, icon: '↑', color: 'var(--teal)' },
  { msg: () => `${['Дмитрий','Иван','Кирилл'][Math.floor(Math.random()*3)]} хочет подарить вам подарок`, icon: '🎁', color: 'var(--pink)' },
  { msg: () => `Ответьте на ${Math.floor(Math.random()*4)+2} непрочитанных сообщения — это влияет на рейтинг`, icon: '↩', color: 'var(--muted)' },
];

let notifInterval = null;

function startNotifSimulation() {
  if (notifInterval) clearInterval(notifInterval);
  const delay = 8000 + Math.random() * 7000;
  notifInterval = setInterval(() => {
    let templates;
    if (!State.auth) templates = NOTIF_TEMPLATES_GUEST;
    else if (State.auth.gender === 'female') templates = NOTIF_TEMPLATES_FEMALE;
    else templates = NOTIF_TEMPLATES_MALE;
    const t = templates[Math.floor(Math.random() * templates.length)];
    showToast(t.msg(), t.icon, t.color);
    // vary interval
    clearInterval(notifInterval);
    startNotifSimulation();
  }, delay);
}

// Start after short delay
setTimeout(startNotifSimulation, 5000);
