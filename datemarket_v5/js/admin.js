/* ══════════════════════════════════════
   ADMIN PANEL
   ══════════════════════════════════════ */

const ADMIN_PASSWORD = 'admin123'; // в проде — нормальная авторизация

const ADMIN_STATE = {
  loggedIn: false,
  commission: 10, // % комиссии платформы (по умолчанию)
  commissionHistory: [
    { date: '10.04.2025', value: 8, by: 'admin' },
    { date: '01.04.2025', value: 10, by: 'admin' },
  ],
};

// Симулированные транзакции подарков
const GIFT_TRANSACTIONS = [
  { id: 1, ts: '14.04.2025 20:11', sender: 'Дмитрий, 31', receiver: 'Анна, 27', item: 'Духи Chanel 50мл', price: 350, commission: 35, status: 'delivered' },
  { id: 2, ts: '14.04.2025 18:44', sender: 'Алексей, 29', receiver: 'Елена, 25', item: 'Книга на выбор', price: 430, commission: 43, status: 'pending' },
  { id: 3, ts: '13.04.2025 15:22', sender: 'Иван, 34', receiver: 'Наташа, 26', item: 'Уходовый крем', price: 510, commission: 51, status: 'delivered' },
  { id: 4, ts: '13.04.2025 12:05', sender: 'Кирилл, 28', receiver: 'Мария, 24', item: 'Чайный набор', price: 290, commission: 29, status: 'delivered' },
  { id: 5, ts: '12.04.2025 22:30', sender: 'Дмитрий, 31', receiver: 'Вика, 23', item: 'Шоколадный набор', price: 380, commission: 38, status: 'cancelled' },
  { id: 6, ts: '12.04.2025 19:17', sender: 'Фёдор, 30', receiver: 'Оля, 24', item: 'Духи Chanel 50мл', price: 350, commission: 35, status: 'delivered' },
  { id: 7, ts: '11.04.2025 14:00', sender: 'Роман, 32', receiver: 'Таня, 26', item: 'Книга на выбор', price: 430, commission: 43, status: 'delivered' },
  { id: 8, ts: '11.04.2025 11:33', sender: 'Алексей, 29', receiver: 'Даша, 25', item: 'Уходовый крем', price: 510, commission: 51, status: 'pending' },
];

function renderAdminPage() {
  const el = document.getElementById('admin-content');

  if (!ADMIN_STATE.loggedIn) {
    el.innerHTML = adminLoginHTML();
    return;
  }

  const delivered = GIFT_TRANSACTIONS.filter(t => t.status === 'delivered');
  const totalRevenue = delivered.reduce((s, t) => s + t.commission, 0);
  const totalGifts = delivered.reduce((s, t) => s + t.price, 0);
  const pending = GIFT_TRANSACTIONS.filter(t => t.status === 'pending').length;

  el.innerHTML = `
    <div style="padding:28px 32px">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <div class="section-label" style="margin-bottom:0">Панель администратора</div>
        <button class="btn btn-ghost" style="font-size:10px" onclick="ADMIN_STATE.loggedIn=false;renderAdminPage()">Выйти</button>
      </div>

      <!-- STATS -->
      <div class="stats-row" style="margin-bottom:28px">
        <div class="stat-box">
          <div class="stat-box-label">Доход платформы</div>
          <div class="stat-box-val">${totalRevenue} <span style="font-size:14px;color:var(--faint)">₽</span></div>
          <div class="stat-box-delta delta-up">↑ всего</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-label">Подарков оборот</div>
          <div class="stat-box-val">${totalGifts} <span style="font-size:14px;color:var(--faint)">₽</span></div>
          <div class="stat-box-delta">${delivered.length} доставлено</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-label">Текущая комиссия</div>
          <div class="stat-box-val" id="admin-comm-display">${ADMIN_STATE.commission}<span style="font-size:14px;color:var(--faint)">%</span></div>
          <div class="stat-box-delta">от суммы подарка</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-label">В обработке</div>
          <div class="stat-box-val">${pending}</div>
          <div class="stat-box-delta">ожидают доставки</div>
        </div>
      </div>

      <!-- COMMISSION CONTROL -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px">
        <div style="padding:20px;background:var(--surface);border-radius:3px">
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-bottom:16px">Управление комиссией</div>

          <div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <label class="form-label" style="margin-bottom:0">Комиссия платформы</label>
              <span style="font-family:'Playfair Display',serif;font-size:24px;color:var(--amber)" id="admin-comm-val">${ADMIN_STATE.commission}%</span>
            </div>
            <input type="range" min="1" max="30" step="1" value="${ADMIN_STATE.commission}" id="admin-comm-slider"
              oninput="document.getElementById('admin-comm-val').textContent=this.value+'%'"
              style="width:100%">
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--faint);margin-top:4px">
              <span>1%</span><span>30%</span>
            </div>
          </div>

          <div class="form-row">
            <label class="form-label">Причина изменения</label>
            <input class="form-input" type="text" id="admin-comm-reason" placeholder="Например: акция на апрель">
          </div>
          <button class="btn btn-primary btn-full" onclick="applyCommission()">Применить</button>

          <div style="margin-top:16px">
            <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--faint);margin-bottom:10px">История изменений</div>
            ${ADMIN_STATE.commissionHistory.map(h => `
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:11px">
                <span style="color:var(--muted)">${h.date}</span>
                <span style="font-weight:500">${h.value}%</span>
                <span style="color:var(--faint)">${h.reason || '—'}</span>
              </div>`).join('')}
          </div>
        </div>

        <!-- PREVIEW -->
        <div style="padding:20px;background:var(--surface);border-radius:3px">
          <div style="font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint);margin-bottom:16px">Превью для пользователя</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:16px">Так видит расчёт мужчина при выборе подарка:</div>
          ${[350, 500, 1200].map(price => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:12px;color:var(--muted)">Подарок на ${price} ₽</span>
              <div style="text-align:right">
                <div style="font-size:13px;font-weight:500" class="preview-total" data-base="${price}">${Math.round(price*(1+ADMIN_STATE.commission/100))} ₽</div>
                <div style="font-size:10px;color:var(--faint)">+<span class="preview-comm">${Math.round(price*ADMIN_STATE.commission/100)}</span> ₽ комиссия</div>
              </div>
            </div>`).join('')}
          <div style="margin-top:12px;font-size:11px;color:var(--faint)">Комиссия: <span id="preview-pct">${ADMIN_STATE.commission}</span>% от суммы подарка</div>
        </div>
      </div>

      <!-- TRANSACTIONS -->
      <div class="section-label">Транзакции подарков</div>
      <div style="margin-bottom:12px;display:flex;gap:8px">
        <button class="tab active" onclick="filterTx('all',this)" style="border:none">Все</button>
        <button class="tab" onclick="filterTx('delivered',this)" style="border:none">Доставлены</button>
        <button class="tab" onclick="filterTx('pending',this)" style="border:none">В обработке</button>
        <button class="tab" onclick="filterTx('cancelled',this)" style="border:none">Отменены</button>
      </div>
      <div id="tx-table-wrap">${txTableHTML('all')}</div>
    </div>`;

  // live preview update on slider
  document.getElementById('admin-comm-slider').addEventListener('input', function() {
    const c = parseInt(this.value);
    document.getElementById('preview-pct').textContent = c;
    document.querySelectorAll('.preview-total').forEach(el => {
      const base = parseInt(el.dataset.base);
      el.textContent = Math.round(base * (1 + c / 100)) + ' ₽';
    });
    document.querySelectorAll('.preview-comm').forEach(el => {
      const base = parseInt(el.closest('[style]')?.querySelector('.preview-total')?.dataset.base || 0);
    });
    // recalc comm values
    [350, 500, 1200].forEach((price, i) => {
      const comms = document.querySelectorAll('.preview-comm');
      if (comms[i]) comms[i].textContent = Math.round(price * c / 100);
    });
  });
}

function adminLoginHTML() {
  return `
    <div style="max-width:340px;margin:80px auto;padding:0 32px">
      <div style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:24px">Вход в админку</div>
      <div class="form-row">
        <label class="form-label">Логин</label>
        <input class="form-input" type="text" id="admin-login" placeholder="admin" value="admin">
      </div>
      <div class="form-row">
        <label class="form-label">Пароль</label>
        <input class="form-input" type="password" id="admin-pass" placeholder="••••••••" onkeydown="if(event.key==='Enter')adminLogin()">
      </div>
      <div style="font-size:10px;color:var(--faint);margin-bottom:16px">Демо-пароль: admin123</div>
      <button class="btn btn-primary btn-full btn-lg" onclick="adminLogin()">Войти</button>
    </div>`;
}

function adminLogin() {
  const pass = document.getElementById('admin-pass').value;
  if (pass === ADMIN_PASSWORD) {
    ADMIN_STATE.loggedIn = true;
    renderAdminPage();
  } else {
    showNotif('Неверный пароль');
  }
}

function applyCommission() {
  const newVal = parseInt(document.getElementById('admin-comm-slider').value);
  const reason = document.getElementById('admin-comm-reason').value.trim();
  ADMIN_STATE.commission = newVal;

  const now = new Date();
  const date = now.getDate().toString().padStart(2,'0') + '.' +
    (now.getMonth()+1).toString().padStart(2,'0') + '.' + now.getFullYear();
  ADMIN_STATE.commissionHistory.unshift({ date, value: newVal, reason: reason || '—' });

  // update gifts.js runtime
  document.getElementById('admin-comm-display').textContent = newVal;

  showNotif('Комиссия обновлена: ' + newVal + '%');
  renderAdminPage();
}

function txTableHTML(filter) {
  const STATUS_LABEL = { delivered: 'Доставлен', pending: 'В обработке', cancelled: 'Отменён' };
  const STATUS_COLOR = { delivered: 'var(--teal)', pending: 'var(--amber)', cancelled: 'var(--faint)' };

  const list = filter === 'all' ? GIFT_TRANSACTIONS : GIFT_TRANSACTIONS.filter(t => t.status === filter);
  const totalComm = list.filter(t=>t.status==='delivered').reduce((s,t)=>s+t.commission,0);

  return `
    <table class="rating-table" style="margin-bottom:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Дата</th>
          <th>Отправитель</th>
          <th>Получатель</th>
          <th>Подарок</th>
          <th style="text-align:right">Сумма</th>
          <th style="text-align:right">Комиссия</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(t => `
          <tr>
            <td style="color:var(--faint)">${t.id}</td>
            <td style="color:var(--faint);white-space:nowrap">${t.ts}</td>
            <td>${t.sender}</td>
            <td>${t.receiver}</td>
            <td style="color:var(--muted)">${t.item}</td>
            <td style="text-align:right;font-family:'Playfair Display',serif">${t.price} ₽</td>
            <td style="text-align:right;color:var(--teal);font-weight:500">${t.commission} ₽</td>
            <td><span style="font-size:10px;color:${STATUS_COLOR[t.status]}">${STATUS_LABEL[t.status]}</span></td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--muted);text-align:right">
      Итого комиссий по доставленным: <strong style="color:var(--teal)">${totalComm} ₽</strong>
    </div>`;
}

function filterTx(filter, btn) {
  document.querySelectorAll('#page-admin .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tx-table-wrap').innerHTML = txTableHTML(filter);
}
