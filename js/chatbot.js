(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────
  var WA_NUMBER = '971567442244';
  var IG_URL    = 'https://www.instagram.com/westernautoandmarine/';
  var BOT_DELAY = 700; // ms between bot messages

  // ── STRINGS ─────────────────────────────────────────────
  var T = {
    greeting:       'Hi there! 👋 Welcome to Western Auto and Marine.',
    howHelp:        'How can we help you today?',
    services:       ['Car Servicing', 'Bike & Quad Servicing', 'Jet Ski Servicing', 'Boat Engine Servicing', 'Painting', 'Diagnostics & Repairs', 'Other'],
    greatChoice:    'Great choice! 👌 May I ask your name?',
    namePlaceholder:'Your name…',
    niceMeet:       'Nice to meet you, ',
    askPhone:       'What\'s the best phone number to reach you on?',
    phonePlaceholder:'e.g. 0501234567',
    gotDetails:     'Perfect! ✅ We\'ve got your details.',
    callBack:       'One of our advisors will call you back shortly, ',
    igAsk:          'One last thing — follow us on Instagram for tips, offers & behind-the-scenes! 📸',
    igFollow:       'Follow @westernautoandmarine 📷',
    igLater:        'Maybe later',
    igThanks:       'Awesome, thanks for the follow! 🤙',
    igBye:          'Have a great day — speak soon!',
    bye:            'No problem! Have a great day — speak soon! 🤙',
    headerSub:      'Typically replies in minutes',
    inputPlaceholder: 'Type your answer…',
    waLead:         '🔔 New website lead\nName: ',
    waPhone:        '\nPhone: ',
    waService:      '\nService: ',
  };

  // ── STATE ───────────────────────────────────────────────
  var state = { step: 'service', service: '', name: '', phone: '' };

  // ── BUILD DOM ───────────────────────────────────────────
  var launcher = document.createElement('div');
  launcher.id = 'wam-chat-launcher';
  launcher.innerHTML =
    '<span class="wam-launcher-icon wam-launcher-icon-open"><svg viewBox="0 0 24 24" width="28" height="28" fill="#25D366" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>' +
    '<span class="wam-launcher-icon wam-launcher-icon-close">✕</span>';

  var win = document.createElement('div');
  win.id = 'wam-chat-window';
  win.innerHTML =
    '<div id="wam-chat-header">' +
      '<div class="wam-avatar">🔧</div>' +
      '<div class="wam-header-info">' +
        '<h4>Western Auto and Marine</h4>' +
        '<p><span class="wam-online-dot"></span>' + T.headerSub + '</p>' +
      '</div>' +
    '</div>' +
    '<div id="wam-chat-messages"></div>' +
    '<div id="wam-chat-input-area">' +
      '<input id="wam-chat-input" type="text" placeholder="' + T.inputPlaceholder + '" autocomplete="off" />' +
      '<button id="wam-chat-send">➤</button>' +
    '</div>';

  document.body.appendChild(launcher);
  document.body.appendChild(win);

  var msgs  = document.getElementById('wam-chat-messages');
  var input = document.getElementById('wam-chat-input');
  var send  = document.getElementById('wam-chat-send');

  // hide input initially (choices used first)
  setInputVisible(false);

  // ── AUTO-OPEN (home page only) ──────────────────────────
  var started = false;
  var isHome = /(^|\/)(index\.html)?$/.test(window.location.pathname);

  function openWidget() {
    win.classList.add('visible');
    launcher.classList.add('open');
    if (!started) {
      started = true;
      startConversation();
    }
  }

  if (isHome) {
    setTimeout(openWidget, 800);
  }

  // ── TOGGLE (click to minimise/reopen) ───────────────────
  launcher.addEventListener('click', function () {
    var isOpen = win.classList.toggle('visible');
    launcher.classList.toggle('open', isOpen);
    if (isOpen) {
      if (!started) {
        started = true;
        startConversation();
      }
      setTimeout(scrollBottom, 50);
    }
  });

  // ── CONVERSATION ────────────────────────────────────────
  function startConversation() {
    botSay(T.greeting, 0);
    botSay(T.howHelp, BOT_DELAY, function () {
      showChoices(T.services, onServiceChosen);
    });
  }

  function onServiceChosen(val) {
    state.service = val;
    userSay(val);
    removeChoices();
    botSay(T.greatChoice, BOT_DELAY, function () {
      state.step = 'name';
      setInputVisible(true);
      input.placeholder = T.namePlaceholder;
      input.focus();
    });
  }

  function onNameSubmitted(val) {
    state.name = val;
    userSay(val);
    setInputVisible(false);
    botSay(T.niceMeet + val + '! 😊', BOT_DELAY);
    botSay(T.askPhone, BOT_DELAY * 2, function () {
      state.step = 'phone';
      setInputVisible(true);
      input.placeholder = T.phonePlaceholder;
      input.focus();
    });
  }

  function onPhoneSubmitted(val) {
    state.phone = val;
    userSay(val);
    setInputVisible(false);
    state.step = 'done';

    // Fire WhatsApp immediately (always)
    fireWhatsApp();

    botSay(T.gotDetails, BOT_DELAY);
    botSay(T.callBack + state.name + '.', BOT_DELAY * 2);

    // Instagram ask
    botSay(T.igAsk, BOT_DELAY * 3.5, function () {
      showChoices([
        { label: T.igFollow, cls: 'amber', action: function () {
            window.open(IG_URL, '_blank');
            removeChoices();
            botSay(T.igThanks, BOT_DELAY);
            botSay(T.igBye, BOT_DELAY * 2);
          }
        },
        { label: T.igLater, cls: '', action: function () {
            removeChoices();
            botSay(T.bye, BOT_DELAY);
          }
        }
      ]);
    });
  }

  // ── WHATSAPP ────────────────────────────────────────────
  function fireWhatsApp() {
    var msg = encodeURIComponent(
      T.waLead + state.name +
      T.waPhone + state.phone +
      T.waService + state.service
    );
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank');
  }

  // ── INPUT HANDLING ──────────────────────────────────────
  send.addEventListener('click', submitInput);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitInput();
  });

  function submitInput() {
    var val = input.value.trim();
    if (!val) return;
    input.value = '';
    if (state.step === 'name') { onNameSubmitted(val); return; }
    if (state.step === 'phone') { onPhoneSubmitted(val); return; }
  }

  // ── HELPERS ─────────────────────────────────────────────
  function botSay(text, delay, cb) {
    delay = delay || 0;
    setTimeout(function () {
      var typing = document.createElement('div');
      typing.className = 'wam-msg bot wam-typing';
      typing.innerHTML = '<div class="wam-bubble"><span></span><span></span><span></span></div>';
      msgs.appendChild(typing);
      scrollBottom();

      setTimeout(function () {
        msgs.removeChild(typing);
        var row = document.createElement('div');
        row.className = 'wam-msg bot';
        row.innerHTML = '<div class="wam-bubble">' + text + '</div>';
        msgs.appendChild(row);
        scrollBottom();
        if (cb) cb();
      }, 600);
    }, delay);
  }

  function userSay(text) {
    var row = document.createElement('div');
    row.className = 'wam-msg user';
    row.innerHTML = '<div class="wam-bubble">' + escHtml(text) + '</div>';
    msgs.appendChild(row);
    scrollBottom();
  }

  function showChoices(items, cb) {
    var wrap = document.createElement('div');
    wrap.className = 'wam-choices';
    wrap.id = 'wam-choices';
    items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'wam-choice' + (item.cls ? ' ' + item.cls : '');
      btn.textContent = typeof item === 'string' ? item : item.label;
      btn.addEventListener('click', function () {
        if (typeof item === 'string') { cb(item); }
        else { item.action(); }
      });
      wrap.appendChild(btn);
    });
    msgs.appendChild(wrap);
    msgs.scrollTop = wrap.offsetTop;
  }

  function removeChoices() {
    var el = document.getElementById('wam-choices');
    if (el) el.remove();
  }

  function setInputVisible(v) {
    var area = document.getElementById('wam-chat-input-area');
    area.style.display = v ? 'flex' : 'none';
  }

  function scrollBottom() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
