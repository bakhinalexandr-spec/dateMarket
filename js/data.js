/* ── DATA ── */

/* ── GIFT CATALOG ── */
const GIFT_CATALOG = [
  { name: 'Отпариватель ручной вертикальный KM-02', price: 1990, url: 'https://ozon.ru/t/7WaPLqK', emoji: '👗' },
  { name: 'Пятновыводитель STIRALITI Professional 125г', price: 490,  url: 'https://ozon.ru/t/1ETRWxk', emoji: '🧴' },
  { name: 'Чемодан ABS пластик 55 см', price: 3290, url: 'https://ozon.ru/t/QipKjV6', emoji: '🧳' },
  { name: 'Крем Lancôme Rénergie', price: 4290, url: 'https://www.ozon.ru/category/uhod-za-litsom/', emoji: '💆' },
  { name: 'Аромадиффузор Zara Home', price: 1890, url: 'https://www.ozon.ru/category/aromadiffuzory/', emoji: '🕯️' },
  { name: 'Серьги в форме полумесяца', price: 1290, url: 'https://www.ozon.ru/category/sergi/', emoji: '🌙' },
  { name: 'Книга «Мастер и Маргарита»', price: 490,  url: 'https://www.ozon.ru/category/knigi/', emoji: '📖' },
  { name: 'Шоколадный сет Leonidas', price: 1650, url: 'https://www.ozon.ru/category/konfety-i-shokolad/', emoji: '🍫' },
  { name: 'Термокружка Fellow Stagg', price: 3490, url: 'https://www.ozon.ru/category/termosy-termokruzhki/', emoji: '☕' },
  { name: 'Набор сухоцветов в вазе', price: 1190, url: 'https://www.ozon.ru/category/sukhie-tsvety/', emoji: '🌾' },
  { name: 'Маска для сна из шёлка', price: 690,  url: 'https://www.ozon.ru/category/maski-dlya-sna/', emoji: '😴' },
  { name: 'Подарочный сертификат Золотое Яблоко', price: 2000, url: 'https://www.ozon.ru/', emoji: '🎁' },
];

/* назначить 3 рандомных подарка по seed из id профиля */
function profileWishlist(profileId) {
  const shuffled = GIFT_CATALOG.slice().sort((a, b) =>
    Math.sin(profileId * 9301 + GIFT_CATALOG.indexOf(a) * 49297) -
    Math.sin(profileId * 9301 + GIFT_CATALOG.indexOf(b) * 49297)
  );
  return shuffled.slice(0, 3);
}

/* ── GLOBAL PLATFORM STATS ── */
const PLATFORM_STATS = {
  msk: { total: 8470, new24: 47, reply2: 28 },
  spb: { total: 4120, new24: 22, reply2: 31 },
  kzn: { total: 1980, new24: 11, reply2: 24 },
  ekb: { total: 1540, new24: 8,  reply2: 26 },
  nsk: { total: 1210, new24: 6,  reply2: 23 },
};

const CITIES = {
  msk: { name: 'Москва', count: '847 анкет', online: '1 284', meets: '67', ratio: '3.8', reply: '41', mRatio: 79, note: 'Высокий спрос — шанс выйти в топ быстрее', f: { msg: '11.2', reply: '41%', adm: '4.7' }, m: { wealth: '6.2', reply: '34%', gifts: '2.4' } },
  spb: { name: 'Санкт-Петербург', count: '412 анкет', online: '638', meets: '31', ratio: '2.9', reply: '44', mRatio: 74, note: 'Чуть ниже конкуренция среди мужчин', f: { msg: '9.4', reply: '44%', adm: '3.9' }, m: { wealth: '5.8', reply: '38%', gifts: '1.9' } },
  kzn: { name: 'Казань', count: '198 анкет', online: '271', meets: '14', ratio: '4.1', reply: '37', mRatio: 80, note: 'Максимальный спрос — легко попасть в топ', f: { msg: '13.1', reply: '37%', adm: '5.2' }, m: { wealth: '5.4', reply: '29%', gifts: '1.4' } },
  ekb: { name: 'Екатеринбург', count: '154 анкет', online: '203', meets: '9', ratio: '3.5', reply: '39', mRatio: 77, note: 'Средний рынок — хорошая точка входа', f: { msg: '8.7', reply: '39%', adm: '4.1' }, m: { wealth: '5.1', reply: '32%', gifts: '1.1' } },
  nsk: { name: 'Новосибирск', count: '121 анкет', online: '167', meets: '7', ratio: '3.2', reply: '36', mRatio: 76, note: 'Активный рост — рынок только формируется', f: { msg: '7.9', reply: '36%', adm: '3.6' }, m: { wealth: '4.9', reply: '30%', gifts: '0.9' } },
};

const PROFILES = {
  msk: {
    women: [
      { id: 1, init: 'АК', name: 'Анна', age: 27, city: 'Москва', cityKey: 'msk', rank: 12, likes: 84, contacts: 47, resp: 64, respCount: '30 из 47', level: 8, admirers: 12, online: true, emoji: '👩‍🦱', wrote: 31, unread: 17, height: 168, weight: 57, photo: 'https://randomuser.me/api/portraits/women/11.jpg' },
      { id: 3, init: 'ЕМ', name: 'Елена', age: 25, city: 'Москва', cityKey: 'msk', rank: 10, likes: 91, contacts: 53, resp: 71, respCount: '38 из 53', level: 9, admirers: 18, online: true, emoji: '👩', wrote: 38, unread: 15, height: 178, weight: 72, photo: 'https://randomuser.me/api/portraits/women/12.jpg' },
      { id: 9, init: 'ВП', name: 'Вика', age: 23, city: 'Москва', cityKey: 'msk', rank: 17, likes: 72, contacts: 38, resp: 58, respCount: '22 из 38', level: 7, admirers: 9, online: false, emoji: '👩‍🦰', wrote: 24, unread: 16, height: 155, weight: 48, photo: 'https://randomuser.me/api/portraits/women/13.jpg' },
      { id: 10, init: 'ЮЛ', name: 'Юля', age: 29, city: 'Москва', cityKey: 'msk', rank: 21, likes: 55, contacts: 28, resp: 50, respCount: '14 из 28', level: 6, admirers: 6, online: false, emoji: '🧕', wrote: 17, unread: 14, height: 162, weight: 78, photo: 'https://randomuser.me/api/portraits/women/14.jpg' },
    ],
    men: [
      { id: 5, init: 'ДС', name: 'Дмитрий', age: 31, city: 'Москва', cityKey: 'msk', rank: 3, likes: 12, contacts: 8, resp: 88, respCount: '7 из 8', level: 9, admirers: 0, male: true, online: true, emoji: '🧔', wealth: 8.4, height: 192, weight: 95, photo: 'https://randomuser.me/api/portraits/men/21.jpg' },
      { id: 7, init: 'ИВ', name: 'Иван', age: 34, city: 'Москва', cityKey: 'msk', rank: 11, likes: 7, contacts: 4, resp: 75, respCount: '3 из 4', level: 6, admirers: 0, male: true, online: false, emoji: '👨', wealth: 6.1, height: 170, weight: 68, photo: 'https://randomuser.me/api/portraits/men/23.jpg' },
      { id: 11, init: 'КМ', name: 'Кирилл', age: 28, city: 'Москва', cityKey: 'msk', rank: 14, likes: 5, contacts: 3, resp: 67, respCount: '2 из 3', level: 5, admirers: 0, male: true, online: true, emoji: '🧑', wealth: 5.7, height: 176, weight: 110, photo: 'https://randomuser.me/api/portraits/men/24.jpg' },
      { id: 12, init: 'РА', name: 'Роман', age: 32, city: 'Москва', cityKey: 'msk', rank: 19, likes: 4, contacts: 2, resp: 50, respCount: '1 из 2', level: 4, admirers: 0, male: true, online: false, emoji: '👨‍💼', wealth: 4.9, height: 165, weight: 63, photo: 'https://randomuser.me/api/portraits/men/25.jpg' },
    ],
  },
  spb: {
    women: [
      { id: 2, init: 'МВ', name: 'Мария', age: 24, city: 'СПб', cityKey: 'spb', rank: 28, likes: 61, contacts: 31, resp: 55, respCount: '17 из 31', level: 6, admirers: 8, online: true, emoji: '👩', wrote: 19, unread: 14, height: 175, weight: 90, photo: 'https://randomuser.me/api/portraits/women/15.jpg' },
      { id: 13, init: 'ТН', name: 'Таня', age: 26, city: 'СПб', cityKey: 'spb', rank: 22, likes: 68, contacts: 35, resp: 60, respCount: '21 из 35', level: 7, admirers: 10, online: false, emoji: '👩‍🦱', wrote: 22, unread: 14, height: 152, weight: 46, photo: 'https://randomuser.me/api/portraits/women/16.jpg' },
    ],
    men: [
      { id: 6, init: 'АП', name: 'Алексей', age: 29, city: 'СПб', cityKey: 'spb', rank: 7, likes: 9, contacts: 5, resp: 80, respCount: '4 из 5', level: 7, admirers: 0, male: true, online: true, emoji: '👨', wealth: 7.2, height: 188, weight: 83, photo: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { id: 14, init: 'ПГ', name: 'Павел', age: 33, city: 'СПб', cityKey: 'spb', rank: 16, likes: 6, contacts: 3, resp: 67, respCount: '2 из 3', level: 5, admirers: 0, male: true, online: false, emoji: '🧔', wealth: 5.3, height: 162, weight: 58, photo: 'https://randomuser.me/api/portraits/men/26.jpg' },
    ],
  },
  kzn: {
    women: [
      { id: 4, init: 'НС', name: 'Наташа', age: 26, city: 'Казань', cityKey: 'kzn', rank: 13, likes: 79, contacts: 42, resp: 60, respCount: '25 из 42', level: 7, admirers: 14, online: true, emoji: '👩‍🦰', wrote: 28, unread: 17, height: 158, weight: 65, photo: 'https://randomuser.me/api/portraits/women/17.jpg' },
      { id: 15, init: 'ОК', name: 'Оля', age: 24, city: 'Казань', cityKey: 'kzn', rank: 20, likes: 63, contacts: 33, resp: 55, respCount: '18 из 33', level: 6, admirers: 9, online: false, emoji: '👩', wrote: 21, unread: 15, height: 183, weight: 68, photo: 'https://randomuser.me/api/portraits/women/18.jpg' },
    ],
    men: [
      { id: 16, init: 'ФМ', name: 'Фёдор', age: 30, city: 'Казань', cityKey: 'kzn', rank: 9, likes: 10, contacts: 6, resp: 83, respCount: '5 из 6', level: 8, admirers: 0, male: true, online: true, emoji: '🧑', wealth: 6.8, height: 158, weight: 102, photo: 'https://randomuser.me/api/portraits/men/27.jpg' },
    ],
  },
  ekb: {
    women: [{ id: 17, init: 'ДК', name: 'Даша', age: 25, city: 'Екатеринбург', cityKey: 'ekb', rank: 25, likes: 58, contacts: 28, resp: 54, respCount: '15 из 28', level: 6, admirers: 7, online: true, emoji: '👩‍🦱', wrote: 17, unread: 13, height: 171, weight: 85, photo: 'https://randomuser.me/api/portraits/women/19.jpg' }],
    men: [{ id: 8, init: 'СК', name: 'Сергей', age: 28, city: 'Екатеринбург', cityKey: 'ekb', rank: 15, likes: 5, contacts: 3, resp: 67, respCount: '2 из 3', level: 5, admirers: 0, male: true, online: false, emoji: '👨', wealth: 5.0, height: 196, weight: 93, photo: 'https://randomuser.me/api/portraits/men/28.jpg' }],
  },
  nsk: {
    women: [{ id: 18, init: 'СР', name: 'Света', age: 26, city: 'Новосибирск', cityKey: 'nsk', rank: 30, likes: 49, contacts: 22, resp: 50, respCount: '11 из 22', level: 5, admirers: 5, online: false, emoji: '🧕', wrote: 13, unread: 11, height: 148, weight: 44, photo: 'https://randomuser.me/api/portraits/women/20.jpg' }],
    men: [{ id: 19, init: 'АН', name: 'Антон', age: 29, city: 'Новосибирск', cityKey: 'nsk', rank: 24, likes: 4, contacts: 2, resp: 50, respCount: '1 из 2', level: 4, admirers: 0, male: true, online: true, emoji: '👨‍💼', wealth: 4.6, height: 173, weight: 120, photo: 'https://randomuser.me/api/portraits/men/29.jpg' }],
  },
};

/* all profiles flat */
function allProfiles() {
  return Object.values(PROFILES).flatMap(c => [...(c.women || []), ...(c.men || [])]);
}

function getProfile(id) {
  return allProfiles().find(p => p.id === id);
}

function cityProfiles(cityKey) {
  const c = PROFILES[cityKey] || {};
  return { women: c.women || [], men: c.men || [], all: [...(c.women || []), ...(c.men || [])] };
}

/* ── STATE ── */
const State = {
  activeCity: 'msk',
  activeProfile: 1,
  currentPage: 'dashboard',
  auth: null, // null = guest, object = logged in user
};

/* ── ROUTER ── */
function navigate(page, params = {}) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) {
    el.classList.add('active');
    State.currentPage = page;
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  if (typeof params.profile === 'number') State.activeProfile = params.profile;
  if (page === 'dashboard') renderDashboard();
  if (page === 'profiles') renderProfilesPage();
  if (page === 'rating') renderRatingPage();
  if (page === 'profile-detail') renderProfileDetail(typeof params.profile === 'number' ? params.profile : State.activeProfile);
  window.scrollTo(0, 0);
}

/* ── NOTIFICATION ── */
function showNotif(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

/* ── TICKER ── */
function buildTicker() {
  const items = [
    'Онлайн сейчас: 4 218',
    'Знакомств сегодня: 183',
    'Соотношение М/Ж: 3.4 к 1',
    'Новых анкет за час: 27',
    'Среднее время ответа: 38 мин',
    'Reply rate: 41%',
    'Second reply rate: 22%',
    'Поклонников в среднем: 4.7',
  ];
  const html = [...items, ...items].map(t => `<span class="ticker-item"><span>●</span> ${t}</span>`).join('');
  document.querySelector('.ticker-inner').innerHTML = html;
}

/* ── CITY PICKER ── */
function togglePicker() {
  document.getElementById('cityPicker').classList.toggle('open');
}
function selectCity(key, el) {
  State.activeCity = key;
  document.querySelectorAll('.city-option').forEach(o => o.classList.remove('active'));
  if (el) el.classList.add('active');
  document.getElementById('cityPicker').classList.remove('open');
  renderDashboard();
  if (typeof renderAllSparklines === 'function') renderAllSparklines();
}
document.addEventListener('click', e => {
  if (!e.target.closest('.city-picker-wrap')) {
    const p = document.getElementById('cityPicker');
    if (p) p.classList.remove('open');
  }
});

/* ── MODAL ── */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); });

