/* ── AUTH ── */
function submitLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  if (!email || !pass) { showNotif('Заполните все поля'); return; }

  // simulate auth
  State.auth = { email, name: email.split('@')[0], gender: 'male', city: 'msk' };
  closeModal('modal-login');
  updateAuthUI();
  showNotif('Добро пожаловать!');
}

function submitRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const age = document.getElementById('reg-age').value.trim();
  const gender = document.getElementById('reg-gender').value;
  const city = document.getElementById('reg-city').value;
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  const height = parseInt(document.getElementById('reg-height').value) || null;
  const weight = parseInt(document.getElementById('reg-weight').value) || null;

  if (!name || !age || !email || !pass) { showNotif('Заполните все поля'); return; }

  State.auth = { name, age, gender, city, email, height, weight };
  State.activeCity = city;
  closeModal('modal-register');
  updateAuthUI();

  if (gender === 'female') {
    showNotif('Добро пожаловать! Выберите приветственный подарок');
    setTimeout(() => openModal('modal-gift'), 1000);
  } else {
    showNotif('Анкета создана! Добро пожаловать на DateMarket');
  }
  renderDashboard();
}

function logout() {
  State.auth = null;
  updateAuthUI();
  showNotif('Вы вышли из аккаунта');
}

function updateAuthUI() {
  const navActions = document.getElementById('navActions');
  if (State.auth) {
    navActions.innerHTML = `
      <span style="font-size:11px;color:var(--muted);letter-spacing:0.04em">${State.auth.name}</span>
      <button class="btn btn-ghost" onclick="logout()">Выйти</button>
    `;
  } else {
    navActions.innerHTML = `
      <button class="btn btn-ghost" onclick="openModal('modal-login')">Войти</button>
      <button class="btn btn-primary" onclick="openModal('modal-register')">Создать анкету</button>
    `;
  }
}

/* ── GIFT WHEEL ── */
const GIFTS = ['Духи Chanel 50мл', 'Книга на выбор', 'Уходовый крем', 'Чайный набор', 'Шоколадный набор', 'Подарочный сертификат'];

function spinGift() {
  const btn = document.getElementById('giftSpinBtn');
  const result = document.getElementById('giftResult');
  btn.disabled = true;
  btn.textContent = 'Розыгрыш...';
  result.textContent = '';

  let ticks = 0;
  const interval = setInterval(() => {
    const rand = GIFTS[Math.floor(Math.random() * GIFTS.length)];
    document.getElementById('giftDisplay').textContent = rand;
    ticks++;
    if (ticks > 20) {
      clearInterval(interval);
      const final = GIFTS[Math.floor(Math.random() * GIFTS.length)];
      const price = 300 + Math.floor(Math.random() * 201);
      document.getElementById('giftDisplay').textContent = final;
      result.innerHTML = `<span style="color:var(--teal)">🎁 ${final} (~${price} руб.) — укажите пункт выдачи Ozon для получения</span>`;
      btn.textContent = 'Готово!';
    }
  }, 80);
}
