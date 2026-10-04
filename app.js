/* Programa virtual de Mahagonny: navegação, elenco, equipe e currículos.
   Sem dependências externas. Todo texto vindo de data.js é inserido como texto, nunca como HTML. */
(function () {
  'use strict';

  var doc = document;
  /* Compatibilidade com navegadores mais antigos */
  if (!Element.prototype.replaceChildren) {
    Element.prototype.replaceChildren = DocumentFragment.prototype.replaceChildren = function () {
      while (this.firstChild) this.removeChild(this.firstChild);
      for (var i = 0; i < arguments.length; i++) this.appendChild(arguments[i]);
    };
  }
  function $(sel) { return doc.querySelector(sel); }
  function showError() { var el = $('#loadError'); if (el) el.hidden = false; }

  /* ---------- Validação dos dados ---------- */
  var P = window.PEOPLE, CAST = window.CAST, CREW = window.CREW;
  if (!P || typeof P !== 'object' || !Array.isArray(CAST) || !Array.isArray(CREW)) {
    showError();
    if (window.console) console.error('[Mahagonny] data.js ausente ou inválido.');
    P = {}; CAST = []; CREW = [];
  }
  var SAFE_ID = /^[a-z0-9-]{1,60}$/;
  function str(v) { return typeof v === 'string' ? v : ''; }
  function person(id) { return SAFE_ID.test(id) && Object.prototype.hasOwnProperty.call(P, id) ? P[id] : null; }
  function imgName(v) { return typeof v === 'string' && SAFE_ID.test(v) ? v : null; }
  function hasCV(p) { return !!(p && (str(p.resumo) || (Array.isArray(p.longo) && p.longo.length))); }
  function warn(msg) { if (window.console) console.warn('[Mahagonny] ' + msg); }

  /* ---------- Criação segura de elementos ---------- */
  function h(tag, attrs, children) {
    var el = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'className') el.className = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v === true ? '' : String(v));
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c);
    });
    return el;
  }
  function initials(n) {
    return str(n).replace(/\(.*?\)/g, '').trim().split(/\s+/).filter(Boolean)
      .map(function (w) { return w.charAt(0); }).slice(0, 2).join('');
  }
  function photo(img, nome, alt) {
    var name = imgName(img);
    if (!name) return h('span', { className: 'mono', text: initials(nome) });
    var el = h('img', { src: 'img/' + name + '.jpg', alt: alt || '', loading: 'lazy', decoding: 'async', width: 800, height: 1000 });
    el.dataset.initials = initials(nome);
    return el;
  }
  /* Foto que não carrega vira monograma, em vez de ícone quebrado */
  doc.addEventListener('error', function (ev) {
    var t = ev.target;
    if (!t || t.tagName !== 'IMG' || t.dataset.failed) return;
    t.dataset.failed = '1';
    if (t.dataset.initials !== undefined) {
      t.replaceWith(h('span', { className: 'mono', text: t.dataset.initials }));
    } else {
      t.style.visibility = 'hidden';
    }
  }, true);

  /* ---------- Montagem de Elenco e Produção ---------- */
  var entries = { elenco: [], producao: [] };
  var rolesOf = {};

  function renderCast() {
    var host = $('#castGroups'); if (!host) return;
    var frag = doc.createDocumentFragment();
    CAST.forEach(function (g) {
      var itens = (g && Array.isArray(g.itens)) ? g.itens : [];
      frag.appendChild(h('div', { className: 'section-title' }, [
        h('h2', { text: str(g.grupo) }), str(g.nota) ? h('p', { text: g.nota }) : null
      ]));
      var grid = h('div', { className: 'cast-grid' + (itens.length === 5 ? ' five' : '') });
      itens.forEach(function (c) {
        var p = person(c && c.pessoa);
        if (!p) { warn('pessoa não encontrada no elenco: ' + (c && c.pessoa)); return; }
        var key = 'cv-' + c.pessoa;
        entries.elenco.push({ key: key, kind: 'cast', pessoa: c.pessoa, img: c.img, personagem: str(c.personagem), apelido: str(c.apelido), fala: str(c.fala) });
        grid.appendChild(h('button', { className: 'card', type: 'button', 'data-key': key, 'aria-label': str(c.personagem) + ', por ' + str(p.nome) + '. Abrir currículo' }, [
          h('span', { className: 'ph' }, [photo(c.img, p.nome, ''), str(c.fala) ? h('span', { className: 'say', text: '“' + c.fala + '”' }) : null]),
          h('span', { className: 'tag paper' }, [h('b', { text: str(c.personagem) }), str(c.apelido) ? h('span', { className: 'nick', text: c.apelido }) : null]),
          h('span', { className: 'by' }, [h('em', { text: 'por' }), str(p.nome)]),
          h('span', { className: 'hint', text: 'Ver currículo' })
        ]));
      });
      frag.appendChild(grid);
    });
    host.replaceChildren(frag);
  }

  function renderCrew() {
    var host = $('#crewGroups'); if (!host) return;
    var frag = doc.createDocumentFragment();
    CREW.forEach(function (g, gi) {
      var itens = (g && Array.isArray(g.itens)) ? g.itens : [];
      frag.appendChild(h('div', { className: 'section-title' + (gi === 0 ? ' st-first' : '') }, [h('h2', { text: str(g.area) })]));
      var grid = h('div', { className: 'crew-grid' });
      itens.forEach(function (c) {
        var p = person(c && c.pessoa);
        if (!p) { warn('pessoa não encontrada na equipe: ' + (c && c.pessoa)); return; }
        var roles = rolesOf[c.pessoa] || (rolesOf[c.pessoa] = []);
        if (roles.indexOf(str(c.funcao)) < 0) roles.push(str(c.funcao));
        var key = 'cv-' + c.pessoa, ok = hasCV(p);
        if (ok && !entries.producao.some(function (e) { return e.key === key; })) {
          entries.producao.push({ key: key, kind: 'crew', pessoa: c.pessoa, img: c.img, funcao: str(c.funcao) });
        }
        var kids = [
          h('span', { className: 'ph' }, [photo(c.img, p.nome, '')]),
          h('span', { className: 'role', text: str(c.funcao) }),
          h('span', { className: 'name', text: str(p.nome) }),
          h('span', { className: 'hint', text: ok ? 'Ver currículo' : 'Currículo em breve' })
        ];
        grid.appendChild(ok
          ? h('button', { className: 'card crew', type: 'button', 'data-key': key, 'aria-label': str(p.nome) + ', ' + str(c.funcao) + '. Abrir currículo' }, kids)
          : h('div', { className: 'card crew nocv' }, kids));
      });
      frag.appendChild(grid);
    });
    host.replaceChildren(frag);
  }

  try { renderCast(); } catch (e) { showError(); warn('falha ao montar o elenco: ' + e.message); }
  try { renderCrew(); } catch (e) { showError(); warn('falha ao montar a equipe: ' + e.message); }

  /* ---------- Modal de currículo ---------- */
  var dlg = $('#cv');
  var nativeDialog = !!(dlg && typeof dlg.showModal === 'function');
  if (dlg && !nativeDialog) dlg.classList.add('fallback');
  var current = null, currentList = [], lastFocus = null;
  function isOpen() { return !!dlg && dlg.hasAttribute('open'); }
  var activePage = 'inicio';

  function allEntries() { return entries.elenco.concat(entries.producao); }
  function setText(sel, t) { var el = $(sel); if (el) el.textContent = t; }

  function openCV(key, updateHash) {
    if (!dlg) return;
    var list = entries[activePage] || allEntries();
    var e = null, i;
    for (i = 0; i < list.length; i++) if (list[i].key === key) { e = list[i]; break; }
    if (!e) { var all = allEntries(); for (i = 0; i < all.length; i++) if (all[i].key === key) { e = all[i]; break; } }
    if (!e) return false;
    var p = person(e.pessoa); if (!p) return false;
    currentList = list.indexOf(e) >= 0 ? list : [e];
    current = e;

    var ph = $('#cvPhoto');
    ph.replaceChildren(photo(e.img, p.nome, str(p.nome)));
    var img = ph.querySelector('img'); if (img) img.removeAttribute('loading');
    if (e.kind === 'cast') ph.appendChild(h('span', { className: 'tag paper' }, [h('b', { text: e.personagem })]));

    setText('#cvRole', e.kind === 'cast' ? 'Elenco · interpreta ' + (e.apelido || e.personagem) : (rolesOf[e.pessoa] || [e.funcao]).join(' · '));
    setText('#cvName', str(p.nome));
    setText('#cvMini', e.kind === 'cast' ? str(p.nome) + ' · ' + e.personagem : str(p.nome));
    var q = $('#cvQuote'); q.hidden = !(e.kind === 'cast' && e.fala); q.textContent = e.fala ? '“' + e.fala + '”, ' + e.personagem : '';
    var r = $('#cvResumo'); r.hidden = !str(p.resumo); r.textContent = str(p.resumo);
    var L = Array.isArray(p.longo) ? p.longo.filter(function (t) { return typeof t === 'string' && t; }) : [];
    $('#cvLongTitle').hidden = !L.length;
    $('#cvLong').replaceChildren.apply($('#cvLong'), L.map(function (t) { return h('p', { text: t }); }));
    $('#cvEmpty').hidden = !!(str(p.resumo) || L.length);
    var one = currentList.length < 2;
    $('#cvPrev').hidden = one; $('#cvNext').hidden = one;

    if (!isOpen()) {
      lastFocus = doc.activeElement;
      if (nativeDialog) { try { dlg.showModal(); } catch (err) { dlg.setAttribute('open', ''); } }
      else dlg.setAttribute('open', '');
      doc.body.classList.add('cv-open');
    }
    dlg.scrollTop = 0; syncBar();
    var closeBtn = $('#cvClose'); if (closeBtn) closeBtn.focus({ preventScroll: true });
    if (updateHash !== false) replaceHash(key);
    return true;
  }
  function onClosed() {
    doc.body.classList.remove('cv-open');
    if (location.hash.indexOf('#cv-') === 0) replaceHash(activePage);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }
  function closeCV() {
    if (!isOpen()) return;
    if (nativeDialog) dlg.close(); else { dlg.removeAttribute('open'); onClosed(); }
  }
  function replaceHash(token) {
    try { history.replaceState(null, '', '#' + token); } catch (e) { /* file:// ou sandbox: ignora */ }
  }

  function syncBar() {
    var max = dlg.scrollHeight - dlg.clientHeight, y = dlg.scrollTop;
    var bar = $('#cvProgress'); if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    var name = $('#cvName'), top = $('#cvBar');
    if (name && top) top.classList.toggle('stuck', y > name.offsetTop + 40);
  }
  function step(d) {
    if (!current || !currentList.length) return;
    var i = currentList.indexOf(current);
    openCV(currentList[(i + d + currentList.length) % currentList.length].key);
  }

  if (dlg) {
    dlg.addEventListener('close', onClosed);
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg) closeCV(); });
    dlg.addEventListener('scroll', syncBar, { passive: true });
    $('#cvClose').addEventListener('click', closeCV);
    $('#cvPrev').addEventListener('click', function () { step(-1); });
    $('#cvNext').addEventListener('click', function () { step(1); });
    /* Rolar o mouse sobre o fundo escurecido também rola o currículo */
    window.addEventListener('wheel', function (ev) {
      if (!isOpen()) return;
      var r = dlg.getBoundingClientRect();
      if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) return;
      ev.preventDefault();
      dlg.scrollTop += ev.deltaY;
    }, { passive: false });
  }
  doc.addEventListener('keydown', function (ev) {
    if (!isOpen()) return;
    if (ev.key === 'ArrowRight') step(1);
    else if (ev.key === 'ArrowLeft') step(-1);
    else if (ev.key === 'Escape' && !nativeDialog) closeCV();
  });
  doc.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button.card[data-key]') : null;
    if (b) openCV(b.getAttribute('data-key'));
  });

  /* ---------- Navegação por âncora ---------- */
  var PAGES = ['inicio', 'sinopse', 'elenco', 'producao', 'ficha', 'parceiros'];
  var TITLES = { inicio: 'Programa Mahagonny', sinopse: 'Sinopse · Mahagonny', elenco: 'Elenco · Mahagonny', producao: 'Produção · Mahagonny', ficha: 'Ficha Técnica · Mahagonny', parceiros: 'Parceiros · Mahagonny' };
  var nav = $('#nav'), toggle = $('#menuToggle');

  function show(page) {
    activePage = page;
    Array.prototype.forEach.call(doc.querySelectorAll('.page'), function (s) { s.classList.toggle('active', s.getAttribute('data-page') === page); });
    Array.prototype.forEach.call(doc.querySelectorAll('.nav a'), function (a) {
      if (a.getAttribute('href') === '#' + page) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    doc.title = TITLES[page];
  }
  function closeMenu() { if (nav) nav.classList.remove('open'); if (toggle) toggle.setAttribute('aria-expanded', 'false'); }
  function route() {
    var raw = (location.hash || '').slice(1).toLowerCase();
    var token = /^[a-z0-9-]{0,80}$/.test(raw) ? raw : '';
    if (token.indexOf('cv-') === 0) {
      var id = token.slice(3);
      var inCast = entries.elenco.some(function (e) { return e.pessoa === id; });
      show(inCast ? 'elenco' : 'producao');
      closeMenu();
      if (!openCV(token, false)) { replaceHash(activePage); }
      return;
    }
    closeCV();
    var page = PAGES.indexOf(token) >= 0 ? token : 'inicio';
    if (token && page !== token) replaceHash(page);
    show(page);
    window.scrollTo(0, 0);
    closeMenu();
  }
  if (toggle && nav) toggle.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(o));
  });
  window.addEventListener('hashchange', route);
  route();
})();
