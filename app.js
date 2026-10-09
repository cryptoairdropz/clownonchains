// ============================================================
//  RENDER LOGIC — do not edit data here, edit data.js
// ============================================================

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const usd = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function inlineMd(t) {
  return esc(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function mdBlocks(text) {
  return text.split("\n\n").map((p) => {
    const lines = p.split("\n").filter(Boolean);
    const isList = lines.length > 1 && lines.every((l) => /^\s*[-*\d]/.test(l));
    if (isList) {
      return "<ul>" + lines.map((l) => "<li>" + inlineMd(l.replace(/^\s*[-*]\s*/, "").replace(/^\s*\d+\.\s*/, "")) + "</li>").join("") + "</ul>";
    }
    return "<p>" + lines.map(inlineMd).join("<br/>") + "</p>";
  }).join("");
}

/* ============================================================
   TICKER
   ============================================================ */
$("#ticker").innerHTML = PRICES.map((p) =>
  `<span class="sym">${p.sym}</span> <span class="px">${usd(p.px)}</span> <span class="chg ${p.chg >= 0 ? "up" : "down"}">${p.chg >= 0 ? "+" : ""}${p.chg.toFixed(1)}%</span>`
).join("") + `<span class="ago">snapshot</span>`;

/* ============================================================
   REFERRALS
   ============================================================ */
$("#referrals").innerHTML = REFERRALS.map((r, i) =>
  `<div class="card hover"><div class="ref-name">${esc(r.name)}</div><div class="ref-desc">${esc(r.desc)}</div>
   <div class="ref-meta"><div><div class="ref-bonus">${esc(r.bonus)}</div><div class="ref-clicks" id="rc-${i}">0 clicks tracked</div></div>
   <a class="btn primary" href="${esc(r.url)}" target="_blank" rel="noopener">Claim</a></div></div>`
).join("");

/* ============================================================
   AIRDROP RADAR
   ============================================================ */
function airMatches(a, f) {
  if (f === "All") return true;
  if (f === "Farming") return /farm/i.test(a.status);
  if (f === "Claiming") return /claim/i.test(a.status);
  if (f === "Snapshot") return /snapshot/i.test(a.status);
  return true;
}
function renderAirdrops(f) {
  const rows = AIRDROPS.filter((a) => airMatches(a, f));
  $("#air-grid").innerHTML = rows.length === 0
    ? `<div class="state-box"><div class="big">Nothing in the "${esc(f)}" pot right now.</div></div>`
    : rows.map((a) => {
        const live = /farm/i.test(a.status), soon = /claim/i.test(a.status);
        return `<div class="card hover air-card">
          <div class="air-top"><div style="display:flex;align-items:center;gap:11px">
            <div class="air-logo">${esc(a.name.slice(0,1))}</div>
            <div><div class="air-name">${esc(a.name)}</div><div class="air-status">${esc(a.status)}</div></div>
          </div><span class="air-tag">${esc(a.tag)}</span></div>
          <div class="air-foot"><span class="air-time ${live ? "badge-live" : soon ? "badge-soon" : ""}">${esc(a.tf)}</span>
          ${a.url ? '<span class="tut-meta" style="margin:0">Open →</span>' : ""}</div></div>`;
      }).join("");
}
renderAirdrops("All");
$("#air-chips").addEventListener("click", (e) => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll("#air-chips .chip").forEach((c) => c.classList.toggle("on", c === b));
  renderAirdrops(b.dataset.f);
});

/* ============================================================
   NEWS
   ============================================================ */
$("#news-list").innerHTML = NEWS.map((n) =>
  `<div class="news-item"><div class="news-title">${n.u ? `<a href="${esc(n.u)}" target="_blank" rel="noreferrer">${esc(n.t)}</a>` : esc(n.t)}</div>
   <div class="news-meta">${esc(n.s)} · ${esc(n.d)}</div></div>`
).join("");

/* ============================================================
   ACADEMY / MODAL
   ============================================================ */
function renderTuts(f) {
  const rows = TUTORIALS.filter((t) => f === "All" || t.level === f);
  $("#tut-grid").innerHTML = rows.map((t) =>
    `<div class="card hover tut-card" onclick="openTut(${t.id})">
     <span class="tut-level lvl-${t.level}">${t.level}</span><div class="tut-title">${esc(t.title)}</div>
     <div class="tut-meta">🕐 ${t.min} min read <span style="margin-left:auto">→</span></div></div>`
  ).join("");
}
renderTuts("All");
$("#tut-chips").addEventListener("click", (e) => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll("#tut-chips .chip").forEach((c) => c.classList.toggle("on", c === b));
  renderTuts(b.dataset.f);
});

function openTut(id) {
  const t = TUTORIALS.find((x) => x.id === id); if (!t) return;
  $("#m-level").textContent = t.level; $("#m-level").className = "tut-level lvl-" + t.level;
  $("#m-title").textContent = t.title;
  $("#m-meta").textContent = "🕐 " + t.min + " min read";
  $("#m-body").innerHTML = mdBlocks(t.body);
  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() { $("#overlay").classList.remove("open"); document.body.style.overflow = ""; }
$("#overlay").addEventListener("click", (e) => e.target === e.currentTarget && closeModal());
window.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

/* ============================================================
   CHART (deterministic, no API needed)
   ============================================================ */
(function bars() {
  let s = 42; const rand = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  $("#chart-bars").innerHTML = Array.from({ length: 26 }, () => {
    const h = 22 + rand() * 62, up = rand() > 0.42;
    return `<div class="bar ${up ? "up" : "down"}" style="height:${h.toFixed(0)}%"></div>`;
  }).join("");
})();

/* ============================================================
   BOT CONTROLS (display-only)
   ============================================================ */
let hypeOn = true, rayOn = true;
$("#hype-btn").onclick = () => { hypeOn = !hypeOn; $("#hype-btn").textContent = hypeOn ? "⏸ Pause Bot" : "▶ Start Bot"; $("#hype-tag").textContent = hypeOn ? "Active" : "Paused"; $("#hype-tag").className = hypeOn ? "tag-active" : "tag-off"; };
$("#ray-btn").onclick = () => { rayOn = !rayOn; $("#ray-btn").textContent = rayOn ? "⏸ Stop Engine" : "▶ Start Engine"; $("#ray-btn").className = rayOn ? "btn primary" : "btn ghost"; };

/* ============================================================
   REFERRAL CLICK COUNTER (localStorage)
   ============================================================ */
function bump(i) {
  const n = (Number(localStorage.getItem("cc-click-" + i)) || 0) + 1;
  localStorage.setItem("cc-click-" + i, String(n));
  const el = $("#rc-" + i); if (el) el.textContent = n + (n === 1 ? " click tracked" : " clicks tracked");
}
REFERRALS.forEach((_, i) => { const n = Number(localStorage.getItem("cc-click-" + i)) || 0; const el = $("#rc-" + i); if (el && n) el.textContent = n + (n === 1 ? " click tracked" : " clicks tracked"); });

/* ============================================================
   DISCUSSION THREADS (localStorage — standalone demo persistence)
   ============================================================ */
const SEED_THREADS = [
  { id: 1, author: "CryptoNinja", title: "Is anyone else seeing this massive cup and handle on HYPE?", body: "Weekly chart is painting something beautiful. Targets above $110 if it breaks out.", createdAt: Date.now() - 86400000, replies: [
    { author: "Web3Dev", body: "Volume confirms it. Watching the $98 level.", createdAt: Date.now() - 82800000 }] },
  { id: 2, author: "AirdropHunter", title: "Just claimed the new ecosystem drop! Check your wallets.", body: "Went live about an hour ago. Don't forget to revoke old approvals before claiming.", createdAt: Date.now() - 7200000, replies: [] },
];

function loadThreads() {
  try { const raw = localStorage.getItem("cc-threads"); const arr = raw ? JSON.parse(raw) : null; return Array.isArray(arr) && arr.length ? arr : SEED_THREADS; }
  catch (e) { return SEED_THREADS; }
}
function saveThreads(t) { try { localStorage.setItem("cc-threads", JSON.stringify(t)); } catch (e) {} }
function ago(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

let threads = loadThreads();

function renderThreads() {
  $("#threads").innerHTML = threads.slice(0, 5).map((t) =>
    `<div class="thread-row" onclick="openThread(${t.id})"><div class="thread-title">${esc(t.title)}</div>
     <div class="thread-meta"><span class="avatar"></span> ${esc(t.author)} · 💬 ${t.replies.length} ${t.replies.length === 1 ? "reply" : "replies"}</div></div>`
  ).join("") || '<div style="color:var(--text-faint);font-size:13.5px;padding:6px 0 10px">No threads yet. Start the first one.</div>';
  $("#stat-threads").textContent = threads.reduce((n, t) => n + 1 + t.replies.length, 0);
}
renderThreads();

function openThread(id) {
  const t = threads.find((x) => x.id === id); if (!t) return;
  $("#m-level").textContent = "Discussion";
  $("#m-level").className = "tut-level";
  $("#m-title").textContent = t.title;
  $("#m-meta").textContent = t.author + " · " + ago(t.createdAt);
  $("#m-body").innerHTML =
    `<div class="card" style="margin-bottom:16px;white-space:pre-wrap">${inlineMd(t.body)}</div>` +
    t.replies.map((r) =>
      `<div class="card hover" style="margin-bottom:10px;padding:14px"><div class="thread-meta" style="margin-bottom:6px"><span class="avatar"></span> ${esc(r.author)} · ${ago(r.createdAt)}</div><div style="white-space:pre-wrap">${inlineMd(r.body)}</div></div>`
    ).join("") +
    `<div class="form-grid"><input class="field" id="r-author" placeholder="Your name (optional)" maxlength="40"/>
     <textarea class="field" id="r-body" placeholder="Write a reply…"></textarea>
     <button class="btn primary" style="justify-content:center" onclick="replyTo(${t.id})">Reply</button></div>`;
  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function replyTo(id) {
  const t = threads.find((x) => x.id === id); if (!t) return;
  const body = ($("#r-body").value || "").trim();
  if (!body) return;
  const author = ($("#r-author").value || "").trim() || "Anon";
  t.replies.push({ author, body, createdAt: Date.now() });
  saveThreads(threads);
  renderThreads();
  openThread(id);
}

$("#t-post").onclick = () => {
  const title = $("#t-title").value.trim();
  const body = $("#t-body").value.trim();
  if (!title || !body) return;
  const author = $("#t-author").value.trim() || "Anon";
  threads.unshift({ id: Date.now(), author, title, body, createdAt: Date.now(), replies: [] });
  $("#t-title").value = "";
  $("#t-body").value = "";
  saveThreads(threads);
  renderThreads();
};
