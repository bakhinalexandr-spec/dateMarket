/* ── LEVELS SYSTEM ── */

const LEVELS = [
  { level: 1, name: 'Новичок',     xpRequired: 0,    color: 'var(--faint)',  perks: ['Просмотр анкет', 'До 3 сообщений в день'] },
  { level: 2, name: 'Знакомый',    xpRequired: 50,   color: 'var(--muted)',  perks: ['10 сообщений в день', 'Просмотр рейтинга'] },
  { level: 3, name: 'Активный',    xpRequired: 150,  color: 'var(--blue)',   perks: ['50 сообщений в день', 'Расширенные фильтры'] },
  { level: 4, name: 'Постоянный',  xpRequired: 350,  color: 'var(--teal)',   perks: ['Без лимита сообщений', 'Приоритет в поиске'] },
  { level: 5, name: 'Популярный',  xpRequired: 700,  color: 'var(--amber)',  perks: ['Бейдж в анкете', 'Статистика просмотров'] },
  { level: 6, name: 'Элита',       xpRequired: 1200, color: 'var(--pink)',   perks: ['Анкета в топе', 'Подарки без комиссии'] },
  { level: 7, name: 'Звезда',      xpRequired: 2000, color: '#9B59B6',       perks: ['Верификация', 'Рекомендации'] },
  { level: 8, name: 'Легенда',     xpRequired: 3500, color: '#E67E22',       perks: ['Всё включено', 'Личный менеджер'] },
  { level: 9, name: 'Чемпион',     xpRequired: 5000, color: '#E74C3C',       perks: ['Статус навсегда', 'Особый значок'] },
];

function getLevelInfo(level) {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)];
}

function getXpForLevel(level) {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)]?.xpRequired || 0;
}

function renderLevelsPage() {
  const userLevel = State.auth ? (State.auth.level || 1) : 1;
  const userXp = State.auth ? (State.auth.xp || 0) : 0;

  document.getElementById('levels-content').innerHTML = `
    ${State.auth ? userProgressHTML(userLevel, userXp) : guestLevelsBannerHTML()}
    <div style="padding:28px 32px">
      <div class="section-label">Все уровни</div>
      <div style="display:grid;gap:10px">
        ${LEVELS.map(l => levelCardHTML(l, userLevel, userXp)).join('')}
      </div>
    </div>`;
}

function userProgressHTML(userLevel, userXp) {
  const curr = getLevelInfo(userLevel);
  const next = LEVELS[userLevel] || null;
  const xpToNext = next ? next.xpRequired - userXp : 0;
  const progress = next ? Math.round(((userXp - curr.xpRequired) / (next.xpRequired - curr.xpRequired)) * 100) : 100;

  return `
    <div style="padding:28px 32px;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:24px;color:${curr.color}">${userLevel}</div>
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:22px">${curr.name}</div>
          <div style="font-size:11px;color:var(--faint)">${userXp} XP · ${next ? xpToNext + ' XP до следующего уровня' : 'Максимальный уровень'}</div>
        </div>
      </div>
      ${next ? `
        <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;margin-bottom:6px">
          <div style="height:100%;width:${progress}%;background:${curr.color};transition:width 0.5s;border-radius:3px"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--faint)">
          <span>Уровень ${userLevel}</span><span>Уровень ${userLevel + 1} — ${next.name}</span>
        </div>` : ''}
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
        ${curr.perks.map(p => `<span style="font-size:10px;padding:3px 10px;background:var(--surface);border-radius:2px;color:var(--muted)">${p}</span>`).join('')}
      </div>
    </div>`;
}

function guestLevelsBannerHTML() {
  return `
    <div style="padding:28px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:6px">Система уровней</div>
        <div style="font-size:12px;color:var(--muted)">Создайте анкету — зарабатывайте XP и открывайте привилегии</div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="openModal('modal-register')">Создать анкету</button>
    </div>`;
}

function levelCardHTML(l, userLevel, userXp) {
  const isUnlocked = userLevel >= l.level;
  const isCurrent = userLevel === l.level;
  return `
    <div style="padding:16px 20px;background:${isCurrent ? 'var(--surface)' : 'var(--bg)'};border:1px solid ${isCurrent ? 'var(--border-strong)' : 'var(--border)'};border-radius:3px;display:flex;align-items:center;gap:16px;opacity:${isUnlocked ? 1 : 0.5}">
      <div style="width:36px;height:36px;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:16px;color:${l.color};flex-shrink:0">${l.level}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="font-size:13px;font-weight:500">${l.name}</span>
          ${isCurrent ? '<span style="font-size:9px;padding:2px 8px;background:var(--teal-light);color:var(--teal);border-radius:2px">Текущий</span>' : ''}
          ${isUnlocked && !isCurrent ? '<span style="font-size:9px;color:var(--teal)">✓</span>' : ''}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${l.perks.map(p => `<span style="font-size:10px;color:var(--muted)">${p}</span>`).join('<span style="color:var(--faint)">·</span>')}
        </div>
      </div>
      <div style="font-size:11px;color:var(--faint);flex-shrink:0">${l.xpRequired} XP</div>
    </div>`;
}

/* ── PROFILE EDIT PAGE ── */
function renderEditPage() {
  if (!State.auth) {
    document.getElementById('edit-content').innerHTML = `
      <div class="empty-state" style="padding:80px 0">
        <div style="margin-bottom:16px;color:var(--muted)">Войдите, чтобы редактировать профиль</div>
        <button class="btn btn-primary" onclick="openModal('modal-login')">Войти</button>
      </div>`;
    return;
  }

  const a = State.auth;
  const isFemale = a.gender === 'female';

  document.getElementById('edit-content').innerHTML = `
    <div style="max-width:640px;margin:0 auto;padding:28px 32px">
      <div class="section-label">Мой профиль</div>

      <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;padding:20px;background:var(--surface);border-radius:3px">
        <div style="width:56px;height:56px;border-radius:50%;background:${isFemale ? 'var(--pink-light)' : 'var(--blue-light)'};color:${isFemale ? 'var(--pink)' : 'var(--blue)'};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:500">${(a.name||'?')[0].toUpperCase()}</div>
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:20px">${a.name || 'Без имени'}, ${a.age || '—'}</div>
          <div style="font-size:11px;color:var(--faint)">${CITIES[a.city || 'msk']?.name || ''} · ${isFemale ? 'Девушка' : 'Мужчина'} · Уровень ${a.level || 1}</div>
        </div>
        <div style="margin-left:auto;text-align:center">
          <div style="font-family:'Playfair Display',serif;font-size:28px;color:var(--amber)">${a.xp || 0}</div>
          <div style="font-size:10px;color:var(--faint)">XP</div>
        </div>
      </div>

      <div class="form-block">
        <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-bottom:16px">Основное</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-row">
            <label class="form-label">Имя</label>
            <input class="form-input" id="edit-name" value="${a.name || ''}" placeholder="Ваше имя">
          </div>
          <div class="form-row">
            <label class="form-label">Возраст</label>
            <input class="form-input" id="edit-age" type="number" value="${a.age || ''}" placeholder="25">
          </div>
        </div>
        <div class="form-row">
          <label class="form-label">Город</label>
          <select class="form-select" id="edit-city">
            ${Object.entries(CITIES).map(([k, v]) => `<option value="${k}" ${(a.city || 'msk') === k ? 'selected' : ''}>${v.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-row">
          <label class="form-label">О себе</label>
          <textarea class="form-input" id="edit-bio" rows="3" placeholder="Расскажите о себе...">${a.bio || ''}</textarea>
        </div>
      </div>

      ${isFemale ? wishlistEditHTML(a) : wealthEditHTML(a)}

      <div style="display:flex;gap:10px">
        <button class="btn btn-primary btn-lg" style="flex:1" onclick="saveProfile()">Сохранить</button>
        <button class="btn btn-ghost btn-lg" onclick="navigate('dashboard')">Отмена</button>
      </div>
    </div>`;
}

function wishlistEditHTML(a) {
  const wishes = a.wishlist || ['', '', ''];
  return `
    <div class="form-block">
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-bottom:4px">Wishlist</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:16px">До 3 позиций · товары с Ozon</div>
      ${[0,1,2].map(i => `
        <div class="form-row">
          <label class="form-label">Позиция ${i+1}</label>
          <input class="form-input" id="wish-${i}" value="${wishes[i] || ''}" placeholder="Например: Духи Chanel">
        </div>`).join('')}
    </div>`;
}

function wealthEditHTML(a) {
  return `
    <div class="form-block">
      <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-bottom:16px">Финансы</div>
      <div class="form-row">
        <label class="form-label">Уровень обеспеченности (1–10)</label>
        <input class="form-input" id="edit-wealth" type="range" min="1" max="10" step="0.1" value="${a.wealth || 5}" oninput="document.getElementById('wealth-val').textContent=parseFloat(this.value).toFixed(1)" style="padding:8px 0">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--faint);margin-top:4px">
          <span>Скромный</span>
          <span style="font-family:'Playfair Display',serif;font-size:16px;color:var(--amber)" id="wealth-val">${(a.wealth || 5).toFixed(1)}</span>
          <span>Состоятельный</span>
        </div>
        <div class="form-hint">Влияет на рейтинг и видимость анкеты</div>
      </div>
    </div>`;
}

function saveProfile() {
  const a = State.auth;
  a.name = document.getElementById('edit-name').value.trim() || a.name;
  a.age = document.getElementById('edit-age').value || a.age;
  a.city = document.getElementById('edit-city').value;
  a.bio = document.getElementById('edit-bio')?.value || '';

  if (a.gender === 'female') {
    a.wishlist = [0,1,2].map(i => document.getElementById('wish-'+i)?.value || '').filter(Boolean);
  } else {
    a.wealth = parseFloat(document.getElementById('edit-wealth')?.value || 5);
  }

  // XP reward for editing profile
  if (!a.profileEdited) {
    a.xp = (a.xp || 0) + 30;
    a.level = calcLevel(a.xp);
    a.profileEdited = true;
    showNotif('+30 XP за заполнение профиля!');
  } else {
    showNotif('Профиль сохранён');
  }

  State.activeCity = a.city;
  updateAuthUI();
  navigate('dashboard');
}

function calcLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) level = LEVELS[i].level;
  }
  return level;
}

/* XP actions */
function awardXP(action) {
  if (!State.auth) return;
  const xpMap = { send_message: 5, receive_reply: 15, gift_sent: 25, daily_login: 10 };
  const earned = xpMap[action] || 0;
  State.auth.xp = (State.auth.xp || 0) + earned;
  State.auth.level = calcLevel(State.auth.xp);
  if (earned > 0) showNotif('+' + earned + ' XP');
}
