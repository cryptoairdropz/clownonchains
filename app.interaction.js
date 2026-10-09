/**
 * app.js — INTERACTION ONLY for the static build.
 *
 * All page content is already rendered into index.html by build.js,
 * so crawlers see everything without executing JS.
 * This file only adds progressive enhancement:
 *   - airdrop status filters
 *   - academy level filters
 *   - email subscribe (local confirmation)
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

  /* ---------- email subscribe (local confirmation) ---------- */
  var emailForm = $('#email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#email-input');
      var msg = $('#email-msg');
      if (!input || !input.value.trim()) return;
      if (msg) msg.style.display = 'block';
      input.value = '';
    });
  }
})();