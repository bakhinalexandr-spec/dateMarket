/* ══════════════════════════════════════
   GIFTS SYSTEM
   комиссия берётся из ADMIN_STATE.commission
   ══════════════════════════════════════ */

const GIFTS_LOG = {};
const GIFT_COOLDOWN_DAYS = 3;

function canSendGift(senderId, receiverId) {
  const key = senderId + '_' + receiverId;
  const log = GIFTS_LOG[key] || [];
  if (!log.length) return { ok: true };
  const diffDays = (Date.now() - log[log.length - 1]) / (1000 * 60 * 60 * 24);
  if (diffDays < GIFT_COOLDOWN_DAYS) {
    const remaining = Math.ceil(GIFT_COOLDOWN_DAYS - diffDays);
    return { ok: false, msg: `Следующий подарок через ${remaining} д.` };
  }
  return { ok: true };
}

function recordGift(senderId, receiverId, item, price) {
  const key = senderId + '_' + receiverId;
  if (!GIFTS_LOG[key]) GIFTS_LOG[key] = [];
  GIFTS_LOG[key].push(Date.now());

  // пишем транзакцию в журнал
  const sender = State.auth ? (State.auth.name + ', ' + State.auth.age) : 'Гость';
  const receiver = getProfile(receiverId);
  const commission = Math.round(price * ADMIN_STATE.commission / 100);
  const now = new Date();
  const ts = now.getDate().toString().padStart(2,'0') + '.' +
    (now.getMonth()+1).toString().padStart(2,'0') + '.' + now.getFullYear() + ' ' +
    now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  GIFT_TRANSACTIONS.unshift({
    id: GIFT_TRANSACTIONS.length + 1,
    ts, sender,
    receiver: receiver ? receiver.name + ', ' + receiver.age : '—',
    item, price, commission,
    status: 'pending',
  });
}

const OZON_POINTS = [
  'ПВЗ Ozon — ул. Тверская, 14',
  'ПВЗ Ozon — ул. Арбат, 6',
  'ПВЗ Ozon — Садовое кольцо, 32',
  'ПВЗ Ozon — пр. Мира, 55',
  'ПВЗ Ozon — ул. Ленина, 12',
];

function openGiftModal(receiverId) {
  const p = getProfile(receiverId);
  if (!p || p.male) return;
  if (!State.auth) { openModal('modal-login'); return; }

  const senderId = State.auth.profileId || 1;
  const check = canSendGift(senderId, receiverId);
  const comm = ADMIN_STATE.commission; // актуальная комиссия от админа
  const wishlist = p.wishlist || ['Духи Chanel 50мл', 'Книга на выбор', 'Уходовый крем'];

  document.getElementById('gift-modal-title').textContent = 'Подарок для ' + p.name;
  document.getElementById('gift-receiver-id').value = receiverId;

  document.getElementById('gift-items-list').innerHTML = wishlist.map((w, i) => {
    const price = 350 + i * 80;
    const withComm = Math.round(price * (1 + comm / 100));
    return `
      <label style="display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:3px;cursor:pointer;margin-bottom:8px" onmouseover="this.style.borderColor='var(--border-strong)'" onmouseout="this.style.borderColor='var(--border)'">
        <input type="radio" name="gift-item" value="${i}" data-price="${price}" style="accent-color:var(--pink)">
        <div style="flex:1">
          <div style="font-size:12px;font-weight:500;margin-bottom:2px">${w}</div>
          <div style="font-size:10px;color:var(--faint)">${price} ₽ + комиссия ${comm}%</div>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:18px">${withComm} ₽</div>
      </label>`;
  }).join('');

  document.getElementById('gift-point-select').innerHTML =
    OZON_POINTS.map(pt => `<option value="${pt}">${pt}</option>`).join('');

  const submitBtn = document.getElementById('gift-submit-btn');
  if (!check.ok) {
    submitBtn.disabled = true;
    submitBtn.textContent = check.msg;
    document.getElementById('gift-antifrod-note').textContent = 'Антифрод: ' + check.msg;
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Оформить подарок';
    document.getElementById('gift-antifrod-note').textContent =
      'Антифрод: 1 подарок раз в 3 дня · комиссия платформы ' + comm + '%';
  }

  openModal('modal-gift-send');
}

function submitGift() {
  const receiverId = parseInt(document.getElementById('gift-receiver-id').value);
  const selected = document.querySelector('input[name="gift-item"]:checked');
  const point = document.getElementById('gift-point-select').value;
  if (!selected) { showNotif('Выберите подарок из списка'); return; }

  const senderId = State.auth.profileId || 1;
  const price = parseInt(selected.dataset.price);
  const p = getProfile(receiverId);
  const wishlist = p?.wishlist || ['Духи Chanel 50мл', 'Книга на выбор', 'Уходовый крем'];
  const item = wishlist[parseInt(selected.value)];

  recordGift(senderId, receiverId, item, price);
  awardXP('gift_sent');
  closeModal('modal-gift-send');

  document.getElementById('gift-success-item').textContent = item;
  document.getElementById('gift-success-point').textContent = point;
  document.getElementById('gift-success-comm').textContent =
    'Комиссия платформы: ' + ADMIN_STATE.commission + '% (' + Math.round(price * ADMIN_STATE.commission / 100) + ' ₽)';
  openModal('modal-gift-success');
}
