/**
 * app.js — INTERACTION ONLY for the static build.
 *
 * All page content is already rendered into index.html by build.js,
 * so crawlers see everything without executing JS.
 * This file only adds progressive enhancement:
 *   - mobile hamburger menu (below 1024px)
 *   - scroll-to-top button
 *   - airdrop status filters
 *   - academy level filters
 *   - email subscribe (local confirmation)
 *   - 404 search filtering
 */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };

  /* ---------- mobile menu ---------- */
  var navToggle = $('.nav-toggle');
  var navLinks = $('#nav-links');
  // Panel fixed hanya di bawah 1024px; di atas itu nav-links normal, jadi
  // tombol disembunyikan dan state .open tidak boleh menggantung.
  var mobileQuery = window.matchMedia('(max-width:1024px)');
  var isOpen = false;
  var scrollY = 0;

  // overflow:hidden saja tidak cukup di iOS Safari — halaman tetap bisa
  // ter-scroll di belakang panel. Kunci dengan position:fixed, simpan
  // posisi scroll, lalu pulihkan saat menutup.
  function lockScroll() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = -scrollY + 'px';
    document.body.classList.add('nav-open');
  }

  function unlockScroll() {
    if (!document.body.classList.contains('nav-open')) return;
    document.body.classList.remove('nav-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function setNav(open) {
    if (!navToggle || !navLinks) return;
    isOpen = open;
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) lockScroll(); else unlockScroll();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setNav(!isOpen);
    });

    // Klik link di dalam panel → tutup (navigasi tetap jalan).
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    // Escape → tutup dan kembalikan fokus ke tombol.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        setNav(false);
        navToggle.focus();
      }
    });

    // Klik di luar panel (panel itu full-screen, jadi ini area di atas nav).
    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      if (!e.target.closest('.nav-links') && !e.target.closest('.nav-toggle')) {
        setNav(false);
      }
    });

    // Resize ke desktop: bersihkan state supaya .open tidak menggantung.
    var onResize = function (e) { if (!e.matches) setNav(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onResize);
    else if (mobileQuery.addListener) mobileQuery.addListener(onResize);
  }

  /* ---------- scroll-to-top ---------- */
  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.textContent = '↑';
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Kembalikan fokus ke konten supaya keyboard user tidak lost di bawah.
    var brand = $('.brand');
    if (brand) brand.focus({ preventScroll: true });
  });
  document.body.appendChild(toTop);

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      toTop.classList.toggle('show', window.scrollY > 600);
      ticking = false;
    });
  }, { passive: true });

  /* ---------- academy level filter ---------- */
  // Catatan: #tut-chips / #tut-grid tidak ada di markup build.js, jadi blok
  // ini inert. Dibiarkan apa adanya — bukan bagian dari perubahan ini.
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

  /* ---------- 404 search: filter the section list locally ---------- */
  // app.js ini juga ditulis untuk halaman 404, yang tabelnya tidak punya
  // daftar section — hanya 3 suggestion. Filter hanya terhadap yang ada.
  var nfSearch = $('.nf-search');
  if (nfSearch) {
    var nfInput = $('#nf-q');
    var nfTargets = Array.prototype.slice.call(document.querySelectorAll('.nf-sug, .nf-link'));
    var nfEmpty = document.createElement('p');
    nfEmpty.className = 'nf-empty';
    nfEmpty.textContent = 'Nothing here matches that — try “airdrop”, “academy” or “code”.';
    nfEmpty.style.display = 'none';

    var nfLinksWrap = $('.nf-links');
    if (nfLinksWrap) nfLinksWrap.parentNode.insertBefore(nfEmpty, nfLinksWrap);

    nfSearch.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = (nfInput.value || '').trim().toLowerCase();
      if (!q) return;
      // Judul + deskripsi, supaya "code" tetap menemukan Referral Codes.
      var hits = 0;
      nfTargets.forEach(function (el) {
        var match = el.textContent.toLowerCase().indexOf(q) !== -1;
        el.classList.toggle('hidden', !match);
        if (match) hits++;
      });
      nfEmpty.style.display = hits ? 'none' : 'block';
    });
  }
})();