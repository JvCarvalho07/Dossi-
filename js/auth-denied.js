(function () {
  'use strict';

  const els = {
    fileCode: document.getElementById('fileCode'),
    fileTitle: document.getElementById('fileTitle'),
    fileSubtitle: document.getElementById('fileSubtitle'),
    requiredLevel: document.getElementById('requiredLevel'),
    authLog: document.getElementById('authLog'),
    authFinger: document.getElementById('authFinger'),
    authFingerFrame: document.getElementById('authFingerFrame'),
    bar: document.getElementById('bar'),
    percent: document.getElementById('percent'),
    step: document.getElementById('step'),
    confidence: document.getElementById('confidence'),
    match: document.getElementById('match'),
    authState: document.getElementById('authState'),
    mini: document.getElementById('mini'),
    startBtn: document.getElementById('startBtn'),
    stamp: document.getElementById('stamp'),
    sealRisk: document.getElementById('sealRisk'),
    sealReason: document.getElementById('sealReason'),
    sealIntegrity: document.getElementById('sealIntegrity'),
    sealAttempt: document.getElementById('sealAttempt'),
    sealFragments: document.getElementById('sealFragments')
  };

  const assets = {
    idle: 'assets/fingerprint-ordem.png',
    denied: 'assets/auth-denied-ordem.png'
  };
  Object.values(assets).forEach((src) => { const img = new Image(); img.src = src; });

  const audio = {
    click: 'arquivos/operacao-albania/audio/ui-click.mp3',
    error: 'arquivos/operacao-albania/audio/ui-error.mp3'
  };

  let busy = false;
  let activeSealProfile = null;

  function setText(element, value) {
    if (element) element.textContent = value || '';
  }

  function sfx(name, volume = 0.7) {
    try {
      const sound = new Audio(audio[name]);
      sound.volume = volume;
      sound.play().catch(() => {});
    } catch (error) {}
  }

  function tone(freq = 220, duration = 0.05, type = 'triangle', volume = 0.025) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      window.__ordoAuthContext = window.__ordoAuthContext || new AudioContext();
      const oscillator = window.__ordoAuthContext.createOscillator();
      const gain = window.__ordoAuthContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = freq;
      gain.gain.value = volume;
      oscillator.connect(gain);
      gain.connect(window.__ordoAuthContext.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, window.__ordoAuthContext.currentTime + duration);
      oscillator.stop(window.__ordoAuthContext.currentTime + duration);
    } catch (error) {}
  }

  function clearLog() {
    while (els.authLog.firstChild) els.authLog.removeChild(els.authLog.firstChild);
  }

  function appendLog(text, className = '') {
    const line = document.createElement('div');
    if (className) line.className = className;
    line.textContent = text;
    els.authLog.appendChild(line);
  }
  function clearNode(element) {
    while (element && element.firstChild) element.removeChild(element.firstChild);
  }

  function renderSealProfile(profile = {}) {
    activeSealProfile = profile;
    setText(els.sealRisk, (profile.risk || 'restrito').toUpperCase());
    setText(els.sealReason, profile.reason || 'Arquivo protegido por restrição superior.');
    setText(els.sealIntegrity, profile.integrity || '--');
    setText(els.sealAttempt, profile.lastAttempt || '--');
    clearNode(els.sealFragments);
    (profile.fragments || ['conteúdo indisponível para esta credencial']).forEach((text) => {
      const item = document.createElement('span');
      item.textContent = text;
      els.sealFragments.appendChild(item);
    });
    document.body.dataset.sealRisk = profile.risk || 'restrito';
  }


  function telemetry(percent, step, confidence, match, state) {
    els.bar.style.width = `${percent}%`;
    setText(els.percent, `${percent}%`);
    setText(els.step, step);
    setText(els.confidence, confidence);
    setText(els.match, match);
    setText(els.authState, state);
  }

  function setMode(mode) {
    els.authFingerFrame.classList.remove('ready', 'scanning', 'denied', 'result');
    if (mode === 'scan') {
      els.authFingerFrame.classList.add('scanning');
      els.authFinger.src = assets.idle;
      const scanbar = els.authFingerFrame.querySelector('.scanbar');
      if (scanbar) {
        scanbar.style.animation = 'none';
        void scanbar.offsetHeight;
        scanbar.style.animation = '';
      }
    } else if (mode === 'denied') {
      els.authFingerFrame.classList.add('denied', 'result');
      els.authFinger.src = assets.denied;
    } else {
      els.authFingerFrame.classList.add('ready');
      els.authFinger.src = assets.idle;
    }
  }

  function finishDenied() {
    setMode('denied');
    els.stamp.classList.add('show');
    els.startBtn.textContent = 'Retornar ao arquivo central';
    els.startBtn.classList.add('deny');
    els.startBtn.disabled = false;
    els.mini.textContent = 'Credencial recusada · solicitação registrada';
    busy = false;
    sfx('error', 0.42);
    tone(150, 0.11, 'sawtooth', 0.022);
  }

  function runDenied() {
    if (els.startBtn.classList.contains('deny')) {
      location.href = 'index.html';
      return;
    }
    if (busy) return;

    busy = true;
    sfx('click', 0.46);
    els.startBtn.disabled = true;
    els.startBtn.textContent = 'Verificando...';
    els.startBtn.classList.remove('deny');
    els.stamp.classList.remove('show');
    setMode('scan');
    telemetry(0, 'Preparando leitura', '--', '--', 'Leitura em preparação');
    els.mini.textContent = 'Coletando impressão digital';

    const profileLog = activeSealProfile && Array.isArray(activeSealProfile.log) ? activeSealProfile.log : [];
    const steps = [
      { text: 'inicializando canal biométrico seguro', p: 10, st: 'Canal seguro aberto', conf: '11%', mt: '--', state: 'Inicializando' },
      { text: 'coletando impressão digital do operador', p: 28, st: 'Amostra capturada', conf: '38%', mt: 'Traço parcial', state: 'Capturando amostra' },
      { text: profileLog[0] || 'comparando amostra com credencial temporária', p: 47, st: 'Comparação em andamento', conf: '62%', mt: '63.2%', state: 'Comparando padrões' },
      { text: profileLog[1] || 'restrição superior encontrada no índice central', p: 69, st: 'Permissão insuficiente', conf: '74%', mt: '48.6%', state: 'Validando autorização' },
      { text: profileLog[2] || 'credencial temporária não autoriza este arquivo', p: 86, st: 'Autorização recusada', conf: 'Falha', mt: 'Negado', state: 'Bloqueando acesso' },
      { text: 'ACESSO NEGADO', p: 100, st: 'Consulta negada', conf: 'Falha', mt: 'Negado', state: 'Acesso negado', cls: 'deny' }
    ];

    clearLog();
    steps.forEach((item, index) => {
      setTimeout(() => {
        telemetry(item.p, item.st, item.conf, item.mt, item.state);
        appendLog(item.text, item.cls || '');
        tone(210 + index * 42, 0.045, 'triangle', 0.018);
        if (index === steps.length - 1) finishDenied();
      }, 260 + index * 460);
    });
  }

  function bindEvents() {
    els.startBtn.addEventListener('click', runDenied);
    els.authFingerFrame.addEventListener('click', runDenied);
    els.authFingerFrame.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        runDenied();
      }
    });
  }

  async function initRecord() {
    const query = new URLSearchParams(location.search);
    const id = query.get('arquivo') || 'r1';
    try {
      const records = await window.OrdoRecords.loadRecords();
      const data = window.OrdoRecords.findRecord(records, id);
      setText(els.fileCode, data.code);
      setText(els.fileTitle, data.title);
      setText(els.fileSubtitle, data.deniedSubtitle || data.subtitle || 'Entrada protegida por autorização superior.');
      setText(els.requiredLevel, data.level || 'Restrito');
      renderSealProfile(data.sealedProfile || {});
    } catch (error) {
      console.error(error);
      setText(els.fileCode, 'DATA/RECORDS.JS');
      setText(els.fileTitle, 'Índice indisponível');
      setText(els.fileSubtitle, 'Não foi possível carregar o registro solicitado.');
      setText(els.requiredLevel, 'Indefinido');
      renderSealProfile({ risk: 'erro', reason: 'O índice centralizado não respondeu.', integrity: '0%', lastAttempt: 'agora', fragments: ['data/records.js ausente ou inválido'] });
    }
  }

  bindEvents();
  initRecord();
}());
