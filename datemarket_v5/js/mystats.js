/* ── MY STATS PAGE ── */

function renderMyStatsPage() {
  const content = document.getElementById('mystats-content');
  if (!content) return;

  if (!State.auth) {
    content.innerHTML = `
      <div style="max-width:600px;margin:60px auto;text-align:center;padding:32px">
        <div style="font-size:40px;margin-bottom:16px">📊</div>
        <div style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:8px">Моя статистика</div>
        <div style="font-size:12px;color:var(--faint);margin-bottom:24px">Войдите, чтобы увидеть свою статистику</div>
        <button class="btn btn-primary" onclick="openModal('modal-login')">Войти</button>
      </div>`;
    return;
  }

  const a = State.auth;
  const isFemale = a.gender === 'female';
  const cityKey = a.city || 'msk';
  const city = CITIES[cityKey];
  const profiles = PROFILES[cityKey];

  // Simulate personal stats
  const myStats = {
    incoming24h: isFemale ? Math.floor(Math.random() * 8) + 6 : Math.floor(Math.random() * 3) + 1,
    incoming7d: isFemale ? Math.floor(Math.random() * 40) + 30 : Math.floor(Math.random() * 15) + 5,
    admirers: isFemale ? Math.floor(Math.random() * 8) + 4 : 0,
    replyRate: isFemale ? Math.floor(Math.random() * 30) + 40 : Math.floor(Math.random() * 20) + 60,
    unread: isFemale ? Math.floor(Math.random() * 5) + 2 : 0,
    rank: Math.floor(Math.random() * 20) + 5,
    xp: a.xp || 30,
    level: a.level || 1,
    wealth: !isFemale ? (Math.random() * 4 + 4).toFixed(1) : null,
    gifts7d: !isFemale ? Math.floor(Math.random() * 3) + 1 : null,
    popScore: isFemale ? Math.floor(Math.random() * 30) + 50 : null,
    loginDays: Math.floor(Math.random() * 5) + 2,
  };

  // 7-day chart data
  const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const chartData = days.map((d,i) => ({
    day: d,
    val: isFemale
      ? Math.floor(Math.random() * 12) + 4
      : Math.floor(Math.random() * 4) + 1
  }));
  const maxVal = Math.max(...chartData.map(d => d.val), 1);

  const lvl = getLevelInfo ? getLevelInfo(myStats.level) : { name: 'Уровень 1', color: 'var(--faint)' };

  content.innerHTML = `
    <div style="max-width:860px;margin:0 auto;padding:28px 32px">
      <div class="section-label">Моя статистика</div>

      <!-- Header card -->
      <div class="today-block" style="display:flex;align-items:center;gap:20px;margin-bottom:20px">
        <div style="width:56px;height:56px;border-radius:50%;background:${isFemale ? 'var(--pink-light)' : 'var(--blue-light)'};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:${isFemale ? 'var(--pink)' : 'var(--blue)'};flex-shrink:0">
          ${(a.name||'?').substring(0,2).toUpperCase()}
        </div>
        <div style="flex:1">
          <div style="font-family:'Playfair Display',serif;font-size:20px">${a.name || 'Пользователь'}, ${a.age || '—'}</div>
          <div style="font-size:11px;color:var(--faint)">${city ? city.name : cityKey} · <span style="color:${lvl.color}">Уровень ${myStats.level}</span></div>
        </div>
        <div style="text-align:right">
          <div style="font-family:'Playfair Display',serif;font-size:28px;color:var(--amber)">#${myStats.rank}</div>
          <div style="font-size:10px;color:var(--faint)">в рейтинге города</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">

        <!-- Left col -->
        <div>
          <div class="today-block" style="margin-bottom:16px">
            <div class="today-header">${isFemale ? 'Активность' : 'Моя активность'}</div>
            ${isFemale ? `
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon tm-icon-blue">✉</div><div class="tm-label">Входящих за 24ч</div></div>
              <div class="tm-val">${myStats.incoming24h}</div>
            </div>
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon tm-icon-blue">✉</div><div class="tm-label">Входящих за 7 дней</div></div>
              <div class="tm-val">${myStats.incoming7d}</div>
            </div>
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon tm-icon-amber">★</div><div class="tm-label">Поклонников</div></div>
              <div class="tm-val v-amber">${myStats.admirers}</div>
            </div>
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon" style="color:var(--faint)">✉</div><div class="tm-label">Неотвеченных</div></div>
              <div class="tm-val" style="color:${myStats.unread>0?'var(--pink)':'inherit'}">${myStats.unread}</div>
            </div>
            ` : `
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon tm-icon-pink">♥</div><div class="tm-label">Написал сегодня</div></div>
              <div class="tm-val">${myStats.incoming24h}</div>
            </div>
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon tm-icon-amber">💎</div><div class="tm-label">Балл обеспеченности</div></div>
              <div class="tm-val v-amber">${myStats.wealth}</div>
            </div>
            <div class="today-metric">
              <div class="tm-left"><div class="tm-icon tm-icon-teal">🎁</div><div class="tm-label">Подарков за 7 дней</div></div>
              <div class="tm-val">${myStats.gifts7d}</div>
            </div>
            `}
            <div class="today-metric resp-metric" style="margin-top:8px">
              <div class="resp-top">
                <div class="tm-left"><div class="tm-icon tm-icon-teal">↩</div><div class="tm-label">${isFemale ? 'Reply rate' : '% ответов девушек'}</div></div>
                <div class="tm-val">${myStats.replyRate}%</div>
              </div>
              <div class="resp-bar"><div class="resp-fill" style="width:${myStats.replyRate}%"></div></div>
              <div class="resp-note"><span>Влияет на рейтинг</span><span>${myStats.replyRate > 50 ? 'Выше среднего ✓' : 'Ниже среднего'}</span></div>
            </div>
          </div>

          ${isFemale ? `
          <div class="today-block">
            <div class="today-header">Популярность</div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
              <div style="flex:1">
                <div style="font-size:10px;color:var(--faint);margin-bottom:4px">Индекс популярности</div>
                <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
                  <div style="height:100%;width:${myStats.popScore}%;background:linear-gradient(90deg,var(--pink),var(--amber));border-radius:3px;transition:width 0.6s"></div>
                </div>
              </div>
              <div style="font-family:'Playfair Display',serif;font-size:22px;color:var(--pink)">${myStats.popScore}</div>
            </div>
            <div style="font-size:10px;color:var(--faint)">Входите в приложение чаще — это скрытый фактор рейтинга</div>
            <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
              ${Array.from({length:7},(_,i)=>`<div style="width:28px;height:28px;border-radius:3px;background:${i<myStats.loginDays?'var(--teal)':'var(--surface2)'};display:flex;align-items:center;justify-content:center;font-size:8px;color:${i<myStats.loginDays?'white':'var(--faint)'}">${days[i]}</div>`).join('')}
            </div>
            <div style="font-size:10px;color:var(--faint);margin-top:6px">Активных дней из 7</div>
          </div>
          ` : `
          <div class="today-block">
            <div class="today-header">Статус в рейтинге</div>
            <div style="font-size:11px;color:var(--faint);line-height:1.7">
              Рейтинг мужчин формируется по двум осям:<br>
              <span style="color:var(--pink)">Привлекательность</span> — % ответов девушек<br>
              <span style="color:var(--amber)">Обеспеченность</span> — количество и стоимость подарков
            </div>
          </div>
          `}
        </div>

        <!-- Right col: chart -->
        <div>
          <div class="today-block" style="margin-bottom:16px">
            <div class="today-header">Входящих по дням (7 дней)</div>
            <div style="display:flex;align-items:flex-end;gap:6px;height:100px;margin-top:12px;margin-bottom:6px">
              ${chartData.map(d => `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                  <div style="font-size:9px;color:var(--faint)">${d.val}</div>
                  <div style="width:100%;background:${isFemale?'var(--pink-light)':'var(--blue-light)'};border-radius:2px 2px 0 0;height:${Math.round(d.val/maxVal*80)}px;transition:height 0.4s"></div>
                  <div style="font-size:8px;color:var(--faint)">${d.day}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="today-block">
            <div class="today-header">Соседи по рейтингу</div>
            ${(() => {
              const ps = (profiles ? [...(profiles.women||[]),...(profiles.men||[])] : [])
                .filter(p => isFemale ? !p.male : p.male)
                .sort((a,b) => a.rank - b.rank)
                .slice(0, 4);
              if (ps.length === 0) return '<div style="color:var(--faint);font-size:11px">Нет данных</div>';
              return ps.map(p => `
                <div class="rank-neighbour ${p.rank === myStats.rank ? 'rank-self' : ''}">
                  <span class="rn-pos">#${p.rank}</span>
                  <span class="rn-init">${p.init}</span>
                  <span class="rn-name">${p.name}</span>
                  <span class="rn-score" style="color:var(--amber)">${p.likes || p.wealth || 0}</span>
                </div>
              `).join('');
            })()}
            <div style="margin-top:8px;padding:6px 8px;background:var(--amber-light);border-radius:3px;display:flex;align-items:center;gap:6px">
              <span style="font-size:10px;color:var(--amber)">Вы</span>
              <span style="font-size:10px;font-weight:500">#${myStats.rank} в рейтинге ${city ? city.name : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Share card button -->
      <div style="text-align:center;padding:20px;background:var(--surface);border-radius:4px;border:1px solid var(--border)">
        <div style="font-size:12px;color:var(--faint);margin-bottom:12px">Поделитесь своей статистикой</div>
        <button class="btn btn-primary" onclick="openShareCard()">📤 Создать карточку профиля</button>
      </div>
    </div>
  `;
}
