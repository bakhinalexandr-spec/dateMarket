/* ── DASHBOARD ── */
function renderDashboard() {
  const d = CITIES[State.activeCity];
  const ps = PLATFORM_STATS[State.activeCity] || { total: 14230, new24: 47, reply2: 28 };
  const cp = cityProfiles(State.activeCity);

  // Existing updates
  document.getElementById('homeCityName').textContent = d.name;
  document.getElementById('homeCitySub').textContent = d.count + ' · ' + d.note;
  document.getElementById('homeOnline').textContent = d.online;
  document.getElementById('homeNew24').textContent = ps.new24;
  document.getElementById('homeReply').textContent = d.reply + '%';

  // New dashboard elements
  const totalUsers = ps.total || 14230;
  const menCount = Math.round(totalUsers * 0.76);
  const womenCount = totalUsers - menCount;
  const ratioMenPercent = Math.round((menCount / totalUsers) * 100);
  const ratioWomenPercent = 100 - ratioMenPercent;

  document.getElementById('statTotal').textContent = totalUsers.toLocaleString();
  document.getElementById('statMen').textContent = menCount.toLocaleString();
  document.getElementById('statWomen').textContent = womenCount.toLocaleString();
  document.getElementById('statReply').textContent = d.reply + '%';
  document.getElementById('statSecondReply').textContent = ps.reply2 + '%';
  document.getElementById('statAvgAdmirers').textContent = '12'; // Placeholder
  document.getElementById('statNew24').textContent = ps.new24;

  document.getElementById('ratioMen').textContent = ratioMenPercent + '%';
  document.getElementById('ratioWomen').textContent = ratioWomenPercent + '%';
  document.getElementById('ratioBarMen').style.width = ratioMenPercent + '%';
  document.getElementById('ratioBarWomen').style.width = ratioWomenPercent + '%';

  // Top metrics placeholders - in real app, calculate from data
  document.getElementById('topFemaleMsgs').textContent = '23';
  document.getElementById('topFemaleAdmirers').textContent = '45';
  document.getElementById('topFemaleReply').textContent = '67%';
  document.getElementById('topMaleRating').textContent = '8.2';
  document.getElementById('topMaleWealth').textContent = '7.5';
  document.getElementById('topMaleMsgs').textContent = '156';

  document.querySelectorAll('.city-option').forEach(o => {
    o.classList.toggle('active', o.dataset.city === State.activeCity);
  });

  renderHomeProfiles(cp.all);
  renderCityCards();
}

function renderHomeProfiles(list) {
  const top = [...list].sort((a, b) => b.likes - a.likes).slice(0, 4);
  const grid = document.getElementById('homeProfileGrid');
  if (!grid) return;
  grid.innerHTML = top.map(p => profileCardHTML(p)).join('');
}

function renderCityCards() {
  const grid = document.getElementById('homeCityGrid');
  if (!grid) return;
  grid.innerHTML = Object.values(CITIES).map(city => `
    <div class="city-card">
      <div class="city-photo" style="background-image: url('https://source.unsplash.com/400x200/?${city.name === 'Москва' ? 'moscow' : city.name === 'Санкт-Петербург' ? 'saint-petersburg' : city.name === 'Казань' ? 'kazan' : city.name === 'Екатеринбург' ? 'yekaterinburg' : 'novosibirsk'},city,night')"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <h4>${city.name}</h4>
        <span class="city-badge">${city.count}</span>
      </div>
      <div class="city-card-row"><span>${city.online} онлайн</span><span>${city.meets} встреч</span></div>
      <div class="city-card-row"><span>Reply ${city.reply}%</span><span>${city.ratio}:1 М/Ж</span></div>
    </div>`).join('');
}

function renderTop(cp) {
  const top = cp.all.sort((a, b) => b.likes - a.likes).slice(0, 5);
  document.getElementById('topList').innerHTML = top.map((p, i) => `
    <div class="top-row" onclick="navigate('profile-detail', {profile: ${p.id}})">
      <div class="tr-pos">${i + 1}</div>
      <div class="tr-ava ${p.male ? 'tr-ava-m' : 'tr-ava-f'}">${p.init}</div>
      <div class="tr-name">${p.name}, ${p.age}</div>
      <div class="tr-metric">${p.likes} ♥</div>
      <div class="tr-badge ${p.male ? 'badge-m' : 'badge-f'}">${p.male ? '♂' : '♀'}</div>
    </div>`).join('');
}

let dashTab = 'women';
function switchDashTab(el, tab) {
  document.querySelectorAll('#page-dashboard .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  dashTab = tab;
  renderDashProfiles(tab);
}

function renderDashProfiles(tab) {
  const cp = cityProfiles(State.activeCity);
  let list = tab === 'top'
    ? cp.all.sort((a, b) => b.likes - a.likes)
    : (tab === 'women' ? cp.women : cp.men);

  document.getElementById('dashProfilesGrid').innerHTML = list.length
    ? list.map(p => profileCardHTML(p)).join('')
    : '<div class="empty-state">Нет анкет в этом городе</div>';
}

function profileCardHTML(p, active = false) {
  // For female cards: show wrote count as extra badge
  const wroteTag = (!p.male && p.wrote)
    ? `<div style="margin-top:6px;font-size:10px;color:var(--blue)">👥 ${p.wrote} написало сегодня</div>`
    : '';
  const photoHTML = p.photo
    ? `<img class="profile-photo" src="${p.photo}" alt="${p.name}" loading="lazy">`
    : `<div class="profile-avatar${p.male ? ' m' : ''}">${p.init}</div>`;
  return `
    <div class="profile-card${active ? ' active' : ''}" onclick="navigate('profile-detail', {profile: ${p.id}})">
      <div class="profile-photo-area">
        ${photoHTML}
        <div class="rank-tag">#${p.rank}</div>
      </div>
      <div class="profile-name">${p.name}, ${p.age}</div>
      <div class="profile-city-tag">${p.city} · ур. ${p.level}${p.online ? ' · <span style="color:var(--teal)">онлайн</span>' : ''}</div>
      <div class="profile-metrics">
        <div><div class="pm-val">${p.likes}</div><div class="pm-label">лайков</div></div>
        <div><div class="pm-val">${p.contacts}</div><div class="pm-label">новых</div></div>
        <div><div class="pm-val">${p.resp}%</div><div class="pm-label">ответов</div></div>
      </div>
      ${wroteTag}
    </div>`;
}

/* ── DETAIL PANEL (right side on dashboard) ── */
function renderDetailPanel(id) {
  const p = getProfile(id);
  if (!p) return;
  State.activeProfile = id;

  const av = document.getElementById('detailAvatar');
  av.textContent = p.init;
  av.className = 'detail-avatar' + (p.male ? ' m' : '');

  document.getElementById('detailRank').textContent = '#' + p.rank + ' рейтинг';
  document.getElementById('detailName').textContent = p.name + ', ' + p.age;
  document.getElementById('detailSub').textContent = p.city + ' · уровень ' + p.level + (p.online ? ' · онлайн' : '');
  document.getElementById('dLikes').textContent = p.likes;
  document.getElementById('dContacts').textContent = p.contacts;
  document.getElementById('dAdmirers').textContent = p.admirers || 0;
  document.getElementById('dResp').textContent = p.resp + '%';
  document.getElementById('dRespFill').style.width = p.resp + '%';
  document.getElementById('dRespCount').textContent = p.respCount;

  // Wrote today + unread — visible only for female profiles
  const wroteRow = document.getElementById('dWroteRow');
  const unreadRow = document.getElementById('dUnreadRow');
  if (!p.male && p.wrote != null) {
    wroteRow.style.display = '';
    unreadRow.style.display = '';
    document.getElementById('dWrote').textContent = p.wrote;
    const unreadVal = document.getElementById('dUnread');
    unreadVal.textContent = p.unread || 0;
    unreadVal.style.color = (p.unread > 10) ? 'var(--pink)' : 'var(--muted)';
  } else {
    wroteRow.style.display = 'none';
    unreadRow.style.display = 'none';
  }

  // rank neighbours
  const sorted = allProfiles().sort((a, b) => a.rank - b.rank);
  const idx = sorted.findIndex(x => x.rank === p.rank);
  const nb = sorted.slice(Math.max(0, idx - 2), Math.max(0, idx - 2) + 5);
  document.getElementById('rankBlock').innerHTML = '<div class="today-header">Соседи по рейтингу</div>' +
    nb.map(n => `<div class="rank-row">
      <div class="rr-pos${n.id === id ? ' cur' : ''}">#${n.rank}</div>
      <div class="rr-ava" style="background:${n.male ? 'var(--blue-light)' : 'var(--pink-light)'};color:${n.male ? 'var(--blue)' : 'var(--pink)'}">${n.init}</div>
      <div class="rr-name${n.id === id ? ' cur' : ''}">${n.name}${n.id === id ? ' — вы' : ''}</div>
      <div class="rr-likes">${n.likes} ♥</div>
    </div>`).join('');
}
