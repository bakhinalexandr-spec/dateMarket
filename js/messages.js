/* ── MESSAGES SYSTEM ── */

const MESSAGES_DB = {
  // conversationId -> array of messages
  '1-5': [
    { from: 5, text: 'Привет! Увидел твою анкету, очень интересная)', ts: '18:32' },
    { from: 1, text: 'Привет! Спасибо :)', ts: '18:45' },
    { from: 5, text: 'Можем как-нибудь встретиться?', ts: '18:46' },
  ],
  '1-7': [
    { from: 7, text: 'Добрый вечер! Как дела?', ts: '20:10' },
    { from: 1, text: 'Хорошо, спасибо!', ts: '20:22' },
  ],
  '3-5': [
    { from: 5, text: 'Привет, ты из Москвы?', ts: '15:00' },
  ],
};

let activeConvId = null;

function getConversations(userId) {
  return Object.keys(MESSAGES_DB)
    .filter(k => k.split('-').map(Number).includes(userId))
    .map(k => {
      const ids = k.split('-').map(Number);
      const otherId = ids.find(id => id !== userId);
      const other = getProfile(otherId);
      const msgs = MESSAGES_DB[k];
      return { convId: k, other, lastMsg: msgs[msgs.length - 1], unread: msgs.filter(m => m.from !== userId).length };
    })
    .filter(c => c.other);
}

function renderMessagesPage() {
  if (!State.auth) {
    document.getElementById('msgs-content').innerHTML = `
      <div class="empty-state" style="padding:80px 0">
        <div style="font-size:32px;margin-bottom:16px">✉</div>
        <div style="margin-bottom:16px;color:var(--muted)">Войдите, чтобы видеть сообщения</div>
        <button class="btn btn-primary" onclick="openModal('modal-login')">Войти</button>
      </div>`;
    return;
  }

  const userId = State.auth.profileId || 1;
  const convs = getConversations(userId);

  document.getElementById('msgs-content').innerHTML = `
    <div style="display:grid;grid-template-columns:280px 1fr;height:calc(100vh - 120px)">
      <div style="border-right:1px solid var(--border);overflow-y:auto">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--faint)">Диалоги</div>
        ${convs.length ? convs.map(c => convItemHTML(c, userId)).join('') : '<div class="empty-state">Диалогов пока нет</div>'}
      </div>
      <div id="chat-area" style="display:flex;flex-direction:column">
        <div class="empty-state" style="flex:1;display:flex;align-items:center;justify-content:center">
          <div style="text-align:center;color:var(--faint)">
            <div style="font-size:28px;margin-bottom:12px">💬</div>
            <div>Выберите диалог</div>
          </div>
        </div>
      </div>
    </div>`;
}

function convItemHTML(c, userId) {
  return `
    <div onclick="openConversation('${c.convId}', ${userId})" style="padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;display:flex;gap:12px;align-items:center;transition:background 0.15s" onmouseover="this.style.background='var(--surface)'" onmouseout="this.style.background=''">
      <div style="width:36px;height:36px;border-radius:50%;background:${c.other.male ? 'var(--blue-light)' : 'var(--pink-light)'};color:${c.other.male ? 'var(--blue)' : 'var(--pink)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;flex-shrink:0">${c.other.init}</div>
      <div style="flex:1;overflow:hidden">
        <div style="font-size:12px;font-weight:500;margin-bottom:2px">${c.other.name}, ${c.other.age}</div>
        <div style="font-size:11px;color:var(--faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.lastMsg.text}</div>
      </div>
      <div style="font-size:10px;color:var(--faint);flex-shrink:0">${c.lastMsg.ts}</div>
    </div>`;
}

function openConversation(convId, userId) {
  activeConvId = convId;
  const ids = convId.split('-').map(Number);
  const otherId = ids.find(id => id !== userId);
  const other = getProfile(otherId);
  const msgs = MESSAGES_DB[convId] || [];

  document.getElementById('chat-area').innerHTML = `
    <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px">
      <div style="width:32px;height:32px;border-radius:50%;background:${other.male ? 'var(--blue-light)' : 'var(--pink-light)'};color:${other.male ? 'var(--blue)' : 'var(--pink)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500">${other.init}</div>
      <div>
        <div style="font-size:13px;font-weight:500">${other.name}, ${other.age}</div>
        <div style="font-size:10px;color:var(--faint)">${other.city} · #${other.rank} рейтинг</div>
      </div>
      <button class="btn btn-ghost" style="margin-left:auto;font-size:10px" onclick="navigate('profile-detail',{profile:${other.id}})">Анкета →</button>
    </div>
    <div id="chat-messages" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:10px">
      ${msgs.map(m => msgBubbleHTML(m, userId)).join('')}
    </div>
    <div style="padding:16px 20px;border-top:1px solid var(--border);display:flex;gap:10px">
      <input class="form-input" id="msg-input" placeholder="Написать сообщение..." style="flex:1" onkeydown="if(event.key==='Enter')sendMessage(${userId})">
      <button class="btn btn-primary" onclick="sendMessage(${userId})">Отправить</button>
    </div>`;

  const chatMsgs = document.getElementById('chat-messages');
  if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function msgBubbleHTML(m, userId) {
  const isMe = m.from === userId;
  return `
    <div style="display:flex;justify-content:${isMe ? 'flex-end' : 'flex-start'}">
      <div style="max-width:70%;padding:9px 14px;border-radius:${isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px'};background:${isMe ? 'var(--text)' : 'var(--surface)'};color:${isMe ? 'var(--bg)' : 'var(--text)'};font-size:12px;line-height:1.5">
        ${m.text}
        <div style="font-size:9px;opacity:0.5;margin-top:4px;text-align:right">${m.ts}</div>
      </div>
    </div>`;
}

function sendMessage(userId) {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text || !activeConvId) return;

  const now = new Date();
  const ts = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  const msg = { from: userId, text, ts };

  if (!MESSAGES_DB[activeConvId]) MESSAGES_DB[activeConvId] = [];
  MESSAGES_DB[activeConvId].push(msg);

  const chatMsgs = document.getElementById('chat-messages');
  chatMsgs.insertAdjacentHTML('beforeend', msgBubbleHTML(msg, userId));
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  input.value = '';

  // simulate reply after delay (30% chance)
  if (Math.random() < 0.3) {
    const replies = ['Интересно!', 'Согласна :)', 'Расскажи подробнее', 'Хорошая идея!', 'Почему бы нет'];
    setTimeout(() => {
      const ids = activeConvId.split('-').map(Number);
      const otherId = ids.find(id => id !== userId);
      const replyTs = new Date();
      const rTs = replyTs.getHours() + ':' + String(replyTs.getMinutes()).padStart(2, '0');
      const replyMsg = { from: otherId, text: replies[Math.floor(Math.random() * replies.length)], ts: rTs };
      MESSAGES_DB[activeConvId].push(replyMsg);
      const cm = document.getElementById('chat-messages');
      if (cm) { cm.insertAdjacentHTML('beforeend', msgBubbleHTML(replyMsg, userId)); cm.scrollTop = cm.scrollHeight; }
    }, 1200 + Math.random() * 1500);
  }
}

function startConversationWith(profileId) {
  if (!State.auth) { openModal('modal-login'); return; }
  const userId = State.auth.profileId || 1;
  const convId = [Math.min(userId, profileId), Math.max(userId, profileId)].join('-');
  if (!MESSAGES_DB[convId]) MESSAGES_DB[convId] = [];
  State.auth.profileId = userId;
  navigate('messages');
  setTimeout(() => openConversation(convId, userId), 50);
}
