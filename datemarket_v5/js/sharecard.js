/* ── VIRAL SHARE CARD ── */

function openShareCard() {
  if (!State.auth) { showToast('Войдите, чтобы создать карточку', '⚠', 'var(--amber)'); openModal('modal-login'); return; }
  openModal('modal-share-card');
  renderShareCard();
}

function renderShareCard() {
  const a = State.auth;
  const isFemale = a.gender === 'female';
  const cityKey = a.city || 'msk';
  const city = CITIES[cityKey];

  const stats = {
    incoming24h: isFemale ? Math.floor(Math.random()*8)+6 : Math.floor(Math.random()*3)+1,
    admirers: isFemale ? Math.floor(Math.random()*8)+4 : 0,
    replyRate: Math.floor(Math.random()*30)+40,
    rank: Math.floor(Math.random()*20)+5,
    wealth: !isFemale ? (Math.random()*4+4).toFixed(1) : null,
    popScore: isFemale ? Math.floor(Math.random()*30)+50 : null,
    level: a.level || 1,
  };

  const canvas = document.getElementById('share-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 360;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 600, 360);
  if (isFemale) {
    bg.addColorStop(0, '#FFF8F5');
    bg.addColorStop(1, '#FDF0F8');
  } else {
    bg.addColorStop(0, '#F5F8FF');
    bg.addColorStop(1, '#F0F5FD');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 360);

  // Top accent bar
  ctx.fillStyle = isFemale ? '#E8A0BF' : '#7BA7D4';
  ctx.fillRect(0, 0, 600, 4);

  // Logo
  ctx.font = '500 13px "IBM Plex Mono"';
  ctx.fillStyle = '#999';
  ctx.fillText('Date', 32, 36);
  ctx.fillStyle = isFemale ? '#C25B8B' : '#3A6EA5';
  ctx.fillText('Market', 32 + ctx.measureText('Date').width, 36);

  // Avatar circle
  ctx.beginPath();
  ctx.arc(80, 120, 44, 0, Math.PI * 2);
  ctx.fillStyle = isFemale ? '#FAEAF2' : '#E8EFF8';
  ctx.fill();
  ctx.font = '600 20px "IBM Plex Mono"';
  ctx.fillStyle = isFemale ? '#C25B8B' : '#3A6EA5';
  ctx.textAlign = 'center';
  ctx.fillText((a.name||'?').substring(0,2).toUpperCase(), 80, 127);
  ctx.textAlign = 'left';

  // Name
  ctx.font = '400 26px "Playfair Display"';
  ctx.fillStyle = '#1A1A1A';
  ctx.fillText(a.name || 'Пользователь', 144, 108);

  // City & level
  ctx.font = '300 12px "IBM Plex Mono"';
  ctx.fillStyle = '#888';
  ctx.fillText(`${city ? city.name : cityKey}  ·  Уровень ${stats.level}`, 144, 128);

  // Rank badge
  ctx.font = '400 36px "Playfair Display"';
  ctx.fillStyle = '#D4A020';
  ctx.textAlign = 'right';
  ctx.fillText(`#${stats.rank}`, 568, 108);
  ctx.font = '300 10px "IBM Plex Mono"';
  ctx.fillStyle = '#aaa';
  ctx.fillText('в рейтинге города', 568, 124);
  ctx.textAlign = 'left';

  // Divider
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 162);
  ctx.lineTo(568, 162);
  ctx.stroke();

  // Stats grid
  const statsToShow = isFemale ? [
    { label: 'Входящих за 24ч', val: stats.incoming24h, color: '#3A8EC2' },
    { label: 'Поклонников', val: stats.admirers, color: '#D4A020' },
    { label: 'Reply rate', val: stats.replyRate + '%', color: '#2AA89A' },
    { label: 'Индекс популярности', val: stats.popScore, color: isFemale ? '#C25B8B' : '#3A6EA5' },
  ] : [
    { label: 'Написал сегодня', val: stats.incoming24h, color: '#3A8EC2' },
    { label: 'Балл обеспеченности', val: stats.wealth, color: '#D4A020' },
    { label: '% ответов', val: stats.replyRate + '%', color: '#2AA89A' },
    { label: 'Рейтинг', val: '#' + stats.rank, color: '#D4A020' },
  ];

  const colW = (600 - 64) / 4;
  statsToShow.forEach((s, i) => {
    const x = 32 + i * colW;
    const y = 190;

    ctx.font = '500 28px "Playfair Display"';
    ctx.fillStyle = s.color;
    ctx.fillText(String(s.val), x, y + 28);

    ctx.font = '300 10px "IBM Plex Mono"';
    ctx.fillStyle = '#aaa';
    ctx.fillText(s.label, x, y + 50);
  });

  // Tagline
  ctx.font = '300 12px "IBM Plex Mono"';
  ctx.fillStyle = '#bbb';
  ctx.textAlign = 'center';
  ctx.fillText('datemarket.ru — данные говорят правду', 300, 330);

  // Bottom line
  ctx.fillStyle = isFemale ? '#E8A0BF' : '#7BA7D4';
  ctx.fillRect(0, 356, 600, 4);

  // Update download link
  const link = document.getElementById('share-download-link');
  if (link) {
    link.href = canvas.toDataURL('image/png');
    link.download = `datemarket-${(a.name||'profile').toLowerCase()}.png`;
  }
}
