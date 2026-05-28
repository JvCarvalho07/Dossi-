(function () {
  'use strict';

  let records = [];
  let selected = null;
  let filter = 'active';
  let term = '';

  const els = {
    list: document.getElementById('fileList'),
    search: document.getElementById('search'),
    entryCount: document.getElementById('entryCount'),
    selectedType: document.getElementById('selectedType'),
    selectedCode: document.getElementById('selectedCode'),
    selectedTitle: document.getElementById('selectedTitle'),
    selectedSubtitle: document.getElementById('selectedSubtitle'),
    briefLines: document.getElementById('briefLines'),
    visualStrip: document.getElementById('visualStrip'),
    previewBox: document.getElementById('previewBox'),
    previewImg: document.getElementById('previewImg'),
    actions: document.getElementById('actions'),
    boot: document.getElementById('bootScreen'),
    bootBar: document.getElementById('bootBar')
  };

  function visibleRecords() {
    const query = term.toLowerCase();
    return records.filter((record) => {
      const matchesFilter = filter === 'all' || record.state === filter;
      const searchable = `${record.code} ${record.title} ${record.kind} ${record.level}`.toLowerCase();
      return matchesFilter && searchable.includes(query);
    });
  }

  function setText(element, value) {
    if (element) element.textContent = value || '';
  }

  function clear(element) {
    while (element && element.firstChild) element.removeChild(element.firstChild);
  }

  function buildNoteLine(text) {
    const div = document.createElement('div');
    div.className = 'note-line';
    div.textContent = text;
    return div;
  }

  function buildStripCell(item) {
    const cell = document.createElement('div');
    cell.className = 'strip-cell' + (item.tone ? ` ${item.tone}` : '');

    const small = document.createElement('small');
    small.textContent = item.label;
    const value = document.createElement('b');
    value.textContent = item.value;

    cell.append(small, value);
    return cell;
  }

  function buildFileItem(record) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'file-item' + (record.id === selected.id ? ' active' : '');
    button.setAttribute('aria-pressed', record.id === selected.id ? 'true' : 'false');

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('aria-hidden', 'true');

    const main = document.createElement('div');
    main.className = 'file-main';

    const top = document.createElement('div');
    top.className = 'file-top';

    const code = document.createElement('div');
    code.className = 'file-code';
    code.textContent = record.code;
    top.appendChild(code);

    if (record.id === selected.id) {
      const badge = document.createElement('span');
      badge.className = 'file-badge principal';
      badge.textContent = 'Selecionado';
      top.appendChild(badge);
    }

    const name = document.createElement('div');
    name.className = 'file-name';
    name.textContent = record.title;

    main.append(top, name);
    button.append(dot, main);
    button.addEventListener('click', () => {
      selected = record;
      render();
    });
    return button;
  }

  function renderList() {
    const items = visibleRecords();
    if (!items.some((record) => record.id === selected.id)) {
      selected = items[0] || records[0];
    }

    clear(els.list);
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Nenhum registro corresponde ao filtro atual.';
      els.list.appendChild(empty);
    } else {
      items.forEach((record) => els.list.appendChild(buildFileItem(record)));
    }
    setText(els.entryCount, `${items.length} ${items.length === 1 ? 'entrada' : 'entradas'}`);
  }

  function renderActions() {
    clear(els.actions);
    const link = document.createElement('a');
    if (selected.state === 'active') {
      link.className = 'btn';
      link.href = selected.url;
      link.textContent = selected.actionLabel || 'Entrar no arquivo ›';
    } else {
      link.className = 'btn dark';
      link.href = `verificacao-biometrica.html?arquivo=${encodeURIComponent(selected.id)}`;
      link.textContent = 'Registro indisponível';
      link.dataset.deniedLink = '1';
    }
    els.actions.appendChild(link);
  }

  function render() {
    if (!selected) return;
    renderList();
    setText(els.selectedType, selected.kind);
    setText(els.selectedCode, selected.code);
    setText(els.selectedTitle, selected.title);
    setText(els.selectedSubtitle, selected.subtitle);

    clear(els.briefLines);
    (selected.lines || []).forEach((line) => els.briefLines.appendChild(buildNoteLine(line)));

    const fallbackStrip = [
      { label: 'Estado', value: selected.status, tone: selected.state === 'active' ? '' : 'alert' },
      { label: 'Nível', value: selected.level, tone: selected.level === 'Restrito' ? 'alert' : '' },
      { label: 'Consulta', value: 'Indisponível', tone: 'alert' }
    ];
    clear(els.visualStrip);
    (selected.strip || fallbackStrip).forEach((item) => els.visualStrip.appendChild(buildStripCell(item)));

    els.previewBox.classList.toggle('locked', selected.state !== 'active');
    els.previewImg.src = selected.previewImage || 'assets/ordo-mark-blood.png';
    renderActions();
  }

  function renderLoadError(error) {
    console.error(error);
    setText(els.entryCount, 'erro');
    setText(els.selectedType, 'Falha de índice');
    setText(els.selectedCode, 'DATA/RECORDS.JS');
    setText(els.selectedTitle, 'Registros não carregados');
    setText(els.selectedSubtitle, 'Não foi possível ler o índice centralizado de arquivos.');
    clear(els.briefLines);
    els.briefLines.appendChild(buildNoteLine('confira se data/records.js existe no projeto'));
    els.briefLines.appendChild(buildNoteLine('este pacote deve funcionar abrindo index.html direto ou pelo GitHub Pages'));
    clear(els.visualStrip);
    clear(els.actions);
  }

  function bindEvents() {
    document.querySelectorAll('.filter').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        document.querySelectorAll('.filter').forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
        filter = button.dataset.filter;
        render();
      });
    });

    els.search.addEventListener('input', (event) => {
      term = event.target.value.trim();
      render();
    });
  }

  function initBoot(afterBoot) {
    if (!els.boot || !els.bootBar) {
      afterBoot();
      return;
    }

    const seen = sessionStorage.getItem('ordo_boot_home_seen');
    if (seen === '1') {
      els.boot.classList.add('hidden');
      afterBoot();
      return;
    }

    requestAnimationFrame(() => { els.bootBar.style.width = '100%'; });
    setTimeout(() => {
      els.boot.classList.add('hidden');
      sessionStorage.setItem('ordo_boot_home_seen', '1');
      afterBoot();
    }, 1250);
  }

  async function init() {
    document.querySelectorAll('.filter').forEach((item) => item.setAttribute('aria-pressed', item.classList.contains('active') ? 'true' : 'false'));
    bindEvents();
    try {
      records = await window.OrdoRecords.loadRecords();
      selected = records.find((record) => record.state === 'active') || records[0];
      initBoot(render);
    } catch (error) {
      if (els.boot) els.boot.classList.add('hidden');
      renderLoadError(error);
    }
  }

  init();
}());
