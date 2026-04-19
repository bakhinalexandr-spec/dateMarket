/* ── AUTH ── */
async function submitLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value.trim();
  if (!email || !pass) { showNotif('Заполните все поля'); return; }

  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) { showNotif('Ошибка: ' + error.message); return; }

  await loadAndSetProfile(data.user);
  closeModal('modal-login');
  renderDashboard();
  showNotif('Добро пожаловать!');
}

async function submitRegister() {
  const name   = document.getElementById('reg-name').value.trim();
  const age    = parseInt(document.getElementById('reg-age').value) || null;
  const gender = document.getElementById('reg-gender').value;
  const city   = document.getElementById('reg-city').value;
  const email  = document.getElementById('reg-email').value.trim();
  const pass   = document.getElementById('reg-password').value.trim();
  const height = parseInt(document.getElementById('reg-height').value) || null;
  const weight = parseInt(document.getElementById('reg-weight').value) || null;

  if (!name || !age || !email || !pass) { showNotif('Заполните все поля'); return; }

  const { data, error } = await sb.auth.signUp({ email, password: pass });
  if (error) { showNotif('Ошибка: ' + error.message); return; }

  const { error: pErr } = await sb.from('profiles').insert({
    id: data.user.id, name, age, gender, city, height, weight
  });
  if (pErr) { showNotif('Ошибка профиля: ' + pErr.message); return; }

  State.auth = { id: data.user.id, name, age, gender, city, height, weight, email, level: 1, xp: 0 };
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

async function logout() {
  await sb.auth.signOut();
  State.auth = null;
  updateAuthUI();
  showNotif('Вы вышли из аккаунта');
}

async function loadAndSetProfile(user) {
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  State.auth = profile
    ? { ...profile, email: user.email }
    : { email: user.email, name: user.email.split('@')[0], level: 1, xp: 0 };
  State.activeCity = State.auth.city || 'msk';
  updateAuthUI();
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
