/* ── GIFT CATALOG (used by wishlist rendering) ── */
const PAGE_GIFTS = [
  { name: 'Отпариватель ручной вертикальный KM-02', price: 1990, url: 'https://ozon.ru/t/7WaPLqK', emoji: '👗' },
  { name: 'Пятновыводитель STIRALITI Professional 125г', price: 490, url: 'https://ozon.ru/t/1ETRWxk', emoji: '🧴' },
  { name: 'Чемодан ABS пластик 55 см', price: 3290, url: 'https://ozon.ru/t/QipKjV6', emoji: '🧳' },
  { name: 'Крем Lancôme Rénergie', price: 4290, url: 'https://www.ozon.ru/category/uhod-za-litsom/', emoji: '💆' },
  { name: 'Аромадиффузор Zara Home', price: 1890, url: 'https://www.ozon.ru/category/aromadiffuzory/', emoji: '🕯️' },
  { name: 'Серьги в форме полумесяца', price: 1290, url: 'https://www.ozon.ru/category/sergi/', emoji: '🌙' },
  { name: 'Книга «Мастер и Маргарита»', price: 490, url: 'https://www.ozon.ru/category/knigi/', emoji: '📖' },
  { name: 'Шоколадный сет Leonidas', price: 1650, url: 'https://www.ozon.ru/category/konfety-i-shokolad/', emoji: '🍫' },
  { name: 'Термокружка Fellow Stagg', price: 3490, url: 'https://www.ozon.ru/category/termosy-termokruzhki/', emoji: '☕' },
  { name: 'Набор сухоцветов в вазе', price: 1190, url: 'https://www.ozon.ru/category/sukhie-tsvety/', emoji: '🌾' },
  { name: 'Маска для сна из шёлка', price: 690, url: 'https://www.ozon.ru/category/maski-dlya-sna/', emoji: '😴' },
  { name: 'Подарочный сертификат Золотое Яблоко', price: 2000, url: 'https://www.ozon.ru/', emoji: '🎁' },
];
function getWishlist(profileId) {
  const result = [], used = new Set();
  let s = (profileId * 1000003 + 7) >>> 0;
  while (result.length < 3) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const i = s % PAGE_GIFTS.length;
    if (!used.has(i)) { used.add(i); result.push(PAGE_GIFTS[i]); }
  }
  return result;
}

/* ── PROFILES PAGE ── */
let profilesFilter = { gender: 'all', city: 'all', sort: 'likes', heightMin: 0, heightMax: 999, weightMin: 0, weightMax: 999 };

function renderProfilesPage() {
  applyProfilesFilter();
}

function setProfilesFilter(key, val) {
  profilesFilter[key] = (key === 'gender' || key === 'city' || key === 'sort') ? val : (val === '' ? (key.endsWith('Min') ? 0 : 999) : parseInt(val));
  applyProfilesFilter();
}

function applyProfilesFilter() {
  let list = allProfiles();
  if (profilesFilter.gender === 'women') list = list.filter(p => !p.male);
  if (profilesFilter.gender === 'men') list = list.filter(p => p.male);
  if (profilesFilter.city !== 'all') list = list.filter(p => p.cityKey === profilesFilter.city);
  if (profilesFilter.heightMin > 0) list = list.filter(p => (p.height || 0) >= profilesFilter.heightMin);
  if (profilesFilter.heightMax < 999) list = list.filter(p => (p.height || 999) <= profilesFilter.heightMax);
  if (profilesFilter.weightMin > 0) list = list.filter(p => (p.weight || 0) >= profilesFilter.weightMin);
  if (profilesFilter.weightMax < 999) list = list.filter(p => (p.weight || 999) <= profilesFilter.weightMax);
  if (profilesFilter.sort === 'likes') list.sort((a, b) => b.likes - a.likes);
  if (profilesFilter.sort === 'rank') list.sort((a, b) => a.rank - b.rank);
  if (profilesFilter.sort === 'resp') list.sort((a, b) => b.resp - a.resp);

  document.getElementById('profilesCount').textContent = list.length + ' анкет';
  document.getElementById('profilesBigGrid').innerHTML = list.map(p => bigProfileCardHTML(p)).join('');
}

function bigProfileCardHTML(p) {
  const physique = (p.height || p.weight) ? `<div class="pbc-physique">${p.height ? p.height + ' см' : ''}${p.height && p.weight ? ' · ' : ''}${p.weight ? p.weight + ' кг' : ''}</div>` : '';
  const photoHTML = p.photo
    ? `<img src="${p.photo}" alt="${p.name}" loading="lazy">`
    : `<span>${p.emoji}</span>`;
  return `
    <div class="profile-big-card" onclick="navigate('profile-detail', {profile: '${p.id}'})">
      <div class="pbc-photo ${p.male ? 'pbc-photo-m' : 'pbc-photo-f'}">
        ${photoHTML}
        ${p.online ? '<div class="pbc-online"><span class="online-dot"></span>онлайн</div>' : ''}
      </div>
      <div class="pbc-body">
        <div class="pbc-name">${p.name}, ${p.age}</div>
        <div class="pbc-meta">${p.city} · #${p.rank} · ур. ${p.level}</div>
        ${physique}
        <div class="pbc-stats">
          <div class="pbc-stat"><strong>${p.likes}</strong>лайков</div>
          <div class="pbc-stat"><strong>${p.contacts}</strong>новых</div>
          <div class="pbc-stat"><strong>${p.resp}%</strong>ответов</div>
        </div>
      </div>
    </div>`;
}

/* ── PROFILE DETAIL PAGE ── */
function renderProfileDetail(id) {
  const p = getProfile(id);
  if (!p) return;

  const pdAvatar = document.getElementById('pd-avatar');
  pdAvatar.className = 'pd-avatar' + (p.male ? ' m' : '');
  if (p.photo) {
    pdAvatar.textContent = '';
    pdAvatar.style.backgroundImage = `url(${p.photo})`;
    pdAvatar.style.backgroundSize = 'cover';
    pdAvatar.style.backgroundPosition = 'center';
    pdAvatar.style.color = 'transparent';
  } else {
    pdAvatar.textContent = p.init;
    pdAvatar.style.backgroundImage = '';
    pdAvatar.style.color = '';
  }
  document.getElementById('pd-rank').textContent = '#' + p.rank + ' в рейтинге';
  document.getElementById('pd-name').textContent = p.name + ', ' + p.age;
  document.getElementById('pd-city').textContent = p.city + ' · уровень ' + p.level;
  document.getElementById('pd-online').textContent = p.online ? '● онлайн' : '○ была недавно';
  document.getElementById('pd-online').style.color = p.online ? 'var(--teal)' : 'var(--faint)';

  document.getElementById('pd-likes').textContent = p.likes;
  document.getElementById('pd-contacts').textContent = p.contacts;
  document.getElementById('pd-admirers').textContent = p.admirers || 0;
  document.getElementById('pd-resp').textContent = p.resp + '%';
  document.getElementById('pd-resp-fill').style.width = p.resp + '%';
  document.getElementById('pd-resp-count').textContent = p.respCount;

  // height & weight — shown for all genders
  const heightEl = document.getElementById('pd-height');
  const weightEl = document.getElementById('pd-weight');
  if (heightEl) heightEl.textContent = p.height ? p.height + ' см' : '—';
  if (weightEl) weightEl.textContent = p.weight ? p.weight + ' кг' : '—';

  if (p.male) {
    document.getElementById('pd-wealth-row').style.display = 'flex';
    document.getElementById('pd-wealth').textContent = (p.wealth || 0).toFixed(1);
    document.getElementById('pd-admirers-row').style.display = 'none';
    document.getElementById('pd-wrote-row').style.display = 'none';
    document.getElementById('pd-unread-row').style.display = 'none';
  } else {
    document.getElementById('pd-wealth-row').style.display = 'none';
    document.getElementById('pd-admirers-row').style.display = 'flex';
    // Wrote today + unread — public, visible to everyone
    if (p.wrote != null) {
      document.getElementById('pd-wrote-row').style.display = 'flex';
      document.getElementById('pd-wrote').textContent = p.wrote;
      document.getElementById('pd-unread-row').style.display = 'flex';
      const unreadEl = document.getElementById('pd-unread');
      unreadEl.textContent = p.unread || 0;
      unreadEl.style.color = (p.unread > 10) ? 'var(--pink)' : 'var(--muted)';
    }
  }

  // wishlist (only for women)
  const wlBlock = document.getElementById('pd-wishlist-block');
  if (!p.male) {
    const wishes = getWishlist(p.id);
    wlBlock.style.display = 'block';
    document.getElementById('pd-wishlist').innerHTML = wishes.map(w => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px;min-width:0">
          <span style="font-size:16px;flex-shrink:0">${w.emoji}</span>
          <div style="min-width:0">
            <a href="${w.url}" target="_blank" rel="noopener"
               style="font-size:12px;color:var(--text);text-decoration:none;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
               onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='var(--text)'">${w.name}</a>
            <span style="font-size:10px;color:var(--faint)">${w.price.toLocaleString('ru-RU')} ₽ · Ozon</span>
          </div>
        </div>
        <button class="btn btn-ghost" style="font-size:9px;padding:4px 10px;flex-shrink:0;margin-left:10px"
          onclick="showNotif('🎁 Подарок оформляется...')">Подарить</button>
      </div>`).join('');
  } else {
    wlBlock.style.display = 'none';
  }

  // rank neighbours
  const sorted = allProfiles().sort((a, b) => a.rank - b.rank);
  const idx = sorted.findIndex(x => x.rank === p.rank);
  const nb = sorted.slice(Math.max(0, idx - 2), Math.max(0, idx - 2) + 5);
  document.getElementById('pd-neighbours').innerHTML = nb.map(n => `
    <div style="display:grid;grid-template-columns:30px 28px 1fr auto;gap:6px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="navigate('profile-detail',{profile:'${n.id}'})">
      <div style="font-size:10px;color:${n.id===id?'var(--text)':'var(--faint)'};font-weight:${n.id===id?500:400}">#${n.rank}</div>
      <div style="width:22px;height:22px;border-radius:50%;background:${n.male?'var(--blue-light)':'var(--pink-light)'};color:${n.male?'var(--blue)':'var(--pink)'};display:flex;align-items:center;justify-content:center;font-size:9px">${n.init}</div>
      <div style="font-size:11px;color:${n.id===id?'var(--text)':'var(--muted)'};font-weight:${n.id===id?500:400}">${n.name}${n.id===id?' — вы':''}</div>
      <div style="font-size:10px;color:var(--faint)">${n.likes} ♥</div>
    </div>`).join('');

  // write button logic
  const writeBtn = document.getElementById('pd-write-btn');
  const writeNote = document.getElementById('pd-write-note');
  if (State.auth) {
    writeBtn.onclick = () => showNotif('Сообщение отправлено!');
    writeNote.textContent = '';
  } else {
    writeBtn.onclick = () => openModal('modal-login');
    writeNote.textContent = 'Войдите, чтобы написать';
  }

  // like button
  renderLikeBtn(id);
}

async function renderLikeBtn(profileId) {
  const btn = document.getElementById('pd-like-btn');
  if (!btn) return;

  const { count } = await sb.from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('to_user', profileId);

  let liked = false;
  if (State.auth) {
    const { data } = await sb.from('likes')
      .select('id').eq('from_user', State.auth.id).eq('to_user', profileId)
      .maybeSingle();
    liked = !!data;
  }

  btn.textContent = liked ? `♥ Лайкнуто (${count || 0})` : `♡ Лайк (${count || 0})`;
  btn.style.background = liked ? 'var(--pink)' : '';
  btn.style.color = liked ? 'white' : '';
  btn.style.borderColor = liked ? 'var(--pink)' : '';
  btn.onclick = () => toggleLike(profileId);
}

async function toggleLike(profileId) {
  if (!State.auth) { openModal('modal-login'); return; }
  if (State.auth.id === profileId) { showNotif('Нельзя лайкнуть себя'); return; }

  const { data: existing, error: selErr } = await sb.from('likes')
    .select('id').eq('from_user', State.auth.id).eq('to_user', profileId)
    .maybeSingle();

  if (selErr) { showNotif('Ошибка: ' + selErr.message); console.error('like select:', selErr); return; }

  if (existing) {
    const { error: delErr } = await sb.from('likes').delete().eq('id', existing.id);
    if (delErr) { showNotif('Ошибка: ' + delErr.message); console.error('like delete:', delErr); return; }
  } else {
    const { error: insErr } = await sb.from('likes').insert({ from_user: State.auth.id, to_user: profileId });
    if (insErr) { showNotif('Ошибка: ' + insErr.message); console.error('like insert:', insErr); return; }
  }

  renderLikeBtn(profileId);
}

/* ── RATING PAGE ── */
let ratingTab = 'women';

function renderRatingPage() {
  renderRatingTable(ratingTab);
}

function switchRatingTab(el, tab) {
  document.querySelectorAll('#page-rating .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ratingTab = tab;
  renderRatingTable(tab);
}

function renderRatingTable(tab) {
  let list = allProfiles();
  if (tab === 'women') list = list.filter(p => !p.male).sort((a, b) => b.likes - a.likes);
  if (tab === 'men') list = list.filter(p => p.male).sort((a, b) => b.likes - a.likes);

  const colsWomen = `<th></th><th></th><th>Имя</th><th>Город</th><th>Поклонники</th><th>Reply rate</th><th>Лайков</th>`;
  const colsMen = `<th></th><th></th><th>Имя</th><th>Город</th><th>Обеспеченность</th><th>Reply от девушек</th><th>Лайков</th>`;

  document.getElementById('ratingTableHead').innerHTML = tab === 'men' ? colsMen : colsWomen;
  document.getElementById('ratingTableBody').innerHTML = list.map((p, i) => `
    <tr onclick="navigate('profile-detail', {profile: '${p.id}'})" style="cursor:pointer">
      <td><div class="rt-pos${i < 3 ? ' top' : ''}">${i + 1}</div></td>
      <td><div class="rt-ava" style="background:${p.male ? 'var(--blue-light)' : 'var(--pink-light)'};color:${p.male ? 'var(--blue)' : 'var(--pink)'}">${p.init}</div></td>
      <td><div class="rt-name">${p.name}, ${p.age}</div></td>
      <td><div class="rt-city">${p.city}</div></td>
      <td>${tab === 'men' ? (p.wealth || 0).toFixed(1) + ' / 10' : p.admirers}</td>
      <td>${tab === 'men' ? Math.round(p.resp * 0.8) + '%' : p.resp + '%'}</td>
      <td><div class="rt-score">${p.likes}</div></td>
    </tr>`).join('');
}
