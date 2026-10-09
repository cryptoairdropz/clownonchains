/**
 * app.js — INTERACTION ONLY for the static build.
 *
 * All page content is already rendered into index.html by build.js,
 * so crawlers see everything without executing JS.
 * This file only adds progressive enhancement:
 *   - airdrop status filters
 *   - academy level filters
 *   - deterministic decorative chart
 *   - localStorage discussion threads (per-browser demo)
 */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };

  /* ---------- airdrop filter ---------- */
  var airGrid = $('#air-grid');
  if (airGrid) {
    var emptyBox = document.createElement('div');
    emptyBox.className = 'state-box';
    emptyBox.id = 'air-empty';
    emptyBox.hidden = true;
    emptyBox.innerHTML = '<div class="big">Nothing matches this filter right now.</div>';
    airGrid.parentNode.insertBefore(emptyBox, airGrid.nextSibling);

    var applyAir = function (f) {
      var cards = airGrid.querySelectorAll('.air-card');
      var shown = 0;
      cards.forEach(function (c) {
        var match = f === 'All' || c.getAttribute('data-status') === f;
        c.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      emptyBox.hidden = shown !== 0;
    };

    var airChips = $('#air-chips');
    if (airChips) {
      airChips.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        airChips.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('on', c === b); });
        applyAir(b.getAttribute('data-f'));
      });
    }
  }

  /* ---------- academy level filter ---------- */
  var tutGrid = $('#tut-grid');
  if (tutGrid) {
    var tutChips = $('#tut-chips');
    if (tutChips) {
      tutChips.addEventListener('click', function (e) {
        var b = e.target.closest('.chip');
        if (!b) return;
        tutChips.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('on', c === b); });
        var f = b.getAttribute('data-f');
        tutGrid.querySelectorAll('.tut-card').forEach(function (c) {
          c.style.display = (f === 'All' || c.getAttribute('data-level') === f) ? '' : 'none';
        });
      });
    }
  }

  /* ---------- decorative chart (deterministic, no API) ---------- */
  var chartBars = $('#chart-bars');
  if (chartBars) {
    var s = 42;
    var rand = function () {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    var html = '';
    for (var i = 0; i < 26; i++) {
      var h = 22 + rand() * 62;
      var up = rand() > 0.42;
      html += '<div class="bar ' + (up ? 'up' : 'down') + '" style="height:' + h.toFixed(0) + '%"></div>';
    }
    chartBars.innerHTML = html;
  }

  /* ---------- localStorage discussion (per-browser demo) ---------- */
  var threadHost = $('#threads');
  if (!threadHost) return;

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var ago = function (ts) {
    var sec = Math.max(1, Math.floor((Date.now() - ts) / 1000));
    if (sec < 60) return sec + 's ago';
    var m = Math.floor(sec / 60); if (m < 60) return m + 'm ago';
    var h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    return Math.floor(h / 24) + 'd ago';
  };

  var SEED = [
    { id: 1, author: 'CryptoNinja', title: 'Is anyone else seeing this massive cup and handle on HYPE?', body: 'Weekly chart is painting something beautiful. Targets above $110 if it breaks out.', createdAt: Date.now() - 86400000, replies: [
      { author: 'Web3Dev', body: 'Volume confirms it. Watching the $98 level.', createdAt: Date.now() - 82800000 }] },
    { id: 2, author: 'AirdropHunter', title: 'Just claimed the new ecosystem drop! Check your wallets.', body: 'Went live about an hour ago. Revoke old approvals before claiming.', createdAt: Date.now() - 7200000, replies: [] },
  ];

  var load = function () {
    try {
      var raw = localStorage.getItem('cc-threads');
      var arr = raw ? JSON.parse(raw) : null;
      return Array.isArray(arr) && arr.length ? arr : SEED;
    } catch (e) { return SEED; }
  };
  var save = function (t) { try { localStorage.setItem('cc-threads', JSON.stringify(t)); } catch (e) {} };

  var threads = load();

  var renderThreads = function () {
    threadHost.innerHTML = threads.slice(0, 5).map(function (t) {
      return '<div class="thread-row"><div class="thread-title">' + esc(t.title) + '</div>' +
        '<div class="thread-meta"><span class="avatar"></span> ' + esc(t.author) +
        ' · 💬 ' + t.replies.length + (t.replies.length === 1 ? ' reply' : ' replies') + '</div></div>';
    }).join('') || '<div style="color:var(--text-faint);font-size:13.5px;padding:6px 0 10px">No threads yet. Start the first one.</div>';

    var stat = $('#stat-threads');
    if (stat) stat.textContent = threads.reduce(function (n, t) { return n + 1 + t.replies.length; }, 0);
  };
  renderThreads();

  $('#t-post').addEventListener('click', function () {
    var title = $('#t-title').value.trim();
    var body = $('#t-body').value.trim();
    if (!title || !body) return;
    var author = $('#t-author').value.trim() || 'Anon';
    threads.unshift({ id: Date.now(), author: author, title: title, body: body, createdAt: Date.now(), replies: [] });
    $('#t-title').value = ''; $('#t-body').value = '';
    save(threads);
    renderThreads();
  });
})();