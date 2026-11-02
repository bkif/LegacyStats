/* ============================================================
   recherche.js — Connecté à ton Worker Cloudflare
   ============================================================ */

const WORKER_URL = "https://cr-stats.pm00buq.workers.dev";

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);

function readText(value, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeTag(raw) {
  return String(raw || "").trim().toUpperCase().replace(/^#/, "").replace(/[^0-9A-Z]/g, "");
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function fmtDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleString("fr-CH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function rarityClass(r) {
  return `cr-r-${String(r || "common").toLowerCase()}`;
}

/* ---------- Rendu des cartes ---------- */
function cardTile(card, { showMax = false } = {}) {
  const img  = card.image || "";
  const name = readText(card.name, "Carte");
  const lvl  = card.level ?? "?";
  const isMax = showMax && card.maxed;
  const isEvo = card.variant === "evo";

  const classes = ["cr-tile", rarityClass(card.rarity)];
  if (isMax) classes.push("max");
  if (isEvo) classes.push("cr-v-evo");

  const imageMarkup = img
    ? `<img src="${esc(img)}" alt="${esc(name)}" loading="lazy">`
    : `<div class="cr-art-empty" aria-hidden="true">?</div>`;

  return `<div class="${classes.join(" ")}" title="${esc(name)}">
    <div class="cr-art">${imageMarkup}</div>
    <span class="cr-lv">Niv ${esc(lvl)}</span>
  </div>`;
}

function cardSlot(card) {
  return `<div class="cr-slot">${cardTile(card, { showMax: true })}</div>`;
}

function deckGrid(cards) {
  return `<div class="cr-deckgrid">${cards.map(cardSlot).join("")}</div>`;
}

/* ---------- Profil ---------- */
function playerCard(p) {
  const clan = p.clan || "Sans clan";
  const arena = p.arena || "";

  const stats = [
    ["Niveau",        p.level,          false],
    ["Trophées",      p.trophies,       true ],
    ["Record",        p.bestTrophies,   false],
    ["Victoires 3 ⭐", p.threeCrownWins, false],
    ["Parties",       p.battleCount,    false],
    ["Victoires",     p.wins,           false],
    ["Défaites",      p.losses,         false],
  ];

  const statHtml = stats.map(([label, val, hl]) => `
    <div class="cr-stat${hl ? " hl" : ""}">
      <span class="cr-stat-value">${esc(val ?? "—")}</span>
      <span class="cr-stat-label">${label}</span>
    </div>`).join("");

  return `<section class="cr-card">
    <div class="cr-head">
      <div class="cr-lvl">${esc(p.level ?? "?")}</div>
      <div>
        <h2 class="cr-name">${esc(p.name)}</h2>
        <p class="cr-sub">${esc(p.tag)} · ${esc(clan)} ${arena ? " · " + esc(arena) : ""}</p>
      </div>
    </div>
    <div class="cr-stats">${statHtml}</div>
  </section>`;
}

/* ---------- Deck actuel ---------- */
function currentDeckSection(deck) {
  if (!Array.isArray(deck) || deck.length === 0) {
    return `<section class="cr-card">
      <h2 class="cr-title">Deck actuel</h2>
      <p class="cr-message" style="margin:0">Deck indisponible.</p>
    </section>`;
  }
  return `<section class="cr-card">
    <div class="cr-sectionhead">
      <h2 class="cr-title">Deck actuel</h2>
      <span class="cr-chip">🃏 ${deck.length} cartes</span>
    </div>
    ${deckGrid(deck)}
  </section>`;
}

/* ---------- Combats ---------- */
function battleHistorySection(battles) {
  const list = (battles || []).slice(0, 20);

  if (list.length === 0) {
    return `<section class="cr-card">
      <h2 class="cr-title">20 derniers combats</h2>
      <p class="cr-message" style="margin:0">Aucun combat récent trouvé.</p>
    </section>`;
  }

  const buttons = list.map((b, i) => {
    const out = b.result; // 'win', 'loss', 'draw'
    const letter = out === "win" ? "V" : out === "loss" ? "D" : "N";
    const perfect = out === "win" && b.crowns === 3 && b.oppCrowns === 0;
    const extraClass = perfect ? " cr-bt-perfect" : "";

    return `<button type="button" class="cr-bt cr-bt-${out}${extraClass}"
              data-battle="${i}" aria-pressed="false" aria-label="Combat ${i + 1} : ${letter}">
      <b>${letter}</b>
      <small>${b.crowns}–${b.oppCrowns}</small>
    </button>`;
  }).join("");

  return `<section class="cr-card">
    <div class="cr-sectionhead">
      <h2 class="cr-title">20 derniers combats</h2>
      <span class="cr-chip">${list.length} parties</span>
    </div>
    <div class="cr-form20">${buttons}</div>
    <div class="cr-detail" id="battle-detail" hidden></div>
  </section>`;
}

function renderBattleDetail(b) {
  const out = b.result;
  const verb = out === "win" ? "Victoire" : out === "loss" ? "Défaite" : "Match nul";
  const oppName = b.opponents?.[0] || "adversaire";
  const date = fmtDate(b.time);

  const oppCards = (b.oppCards || []).map(c => `
    <div class="bd-card">
      <img src="${esc(c.image || "")}" alt="${esc(c.name)}" title="${esc(c.name)}" loading="lazy">
      <span class="bd-card-name">${esc(c.name)}</span>
      <span class="bd-card-meta">Niv ${esc(c.level || "?")}</span>
    </div>
  `).join("");

  return `<div class="cr-battle-detail">
    <div class="bd-head">
      <span class="bd-result ${out}">${out === "win" ? "V" : out === "loss" ? "D" : "N"}</span>
      <div class="bd-info">
        <h4>${verb} contre ${esc(oppName)}</h4>
        <p>${b.crowns}–${b.oppCrowns} couronnes ${date ? " · " + esc(date) : ""}</p>
      </div>
    </div>
    <div class="bd-deck">
      <h5>Deck adverse</h5>
      <div class="bd-cards">${oppCards || '<div class="cr-empty">Aucune carte disponible.</div>'}</div>
    </div>
  </div>`;
}

/* ---------- Rendu global ---------- */
function render(player, battles) {
  const result = document.getElementById("search-result");
  if (!result) return;

  result.innerHTML = `
    ${playerCard(player)}
    ${currentDeckSection(player.deck || [])}
    ${battleHistorySection(battles)}
  `;

  const detail  = document.getElementById("battle-detail");
  const buttons = result.querySelectorAll(".cr-bt");

  if (detail) {
    detail.innerHTML = "";
    detail.hidden = true;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const b = battles[+btn.dataset.battle];
      if (!b || !detail) return;

      buttons.forEach(x => x.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      detail.innerHTML = renderBattleDetail(b);
      detail.hidden = false;
    });
  });
}

/* ---------- Recherche ---------- */
async function doSearch(tag) {
  const result = document.getElementById("search-result");
  if (!result) return;

  result.innerHTML = `<p class="cr-message">Recherche de <strong>#${esc(tag)}</strong>…</p>`;

  try {
    const res = await fetch(`${WORKER_URL}?tag=${encodeURIComponent(tag)}`);
    
    if (res.status === 404) throw new Error("Joueur introuvable.");
    if (!res.ok) throw new Error("Erreur serveur (" + res.status + ").");
    
    const data = await res.json();
    render(data.player, data.battles);
    
    // Met à jour l'URL
    const url = new URL(location.href);
    url.searchParams.set("tag", tag);
    history.replaceState(null, "", url);

  } catch (err) {
    console.error("[recherche]", err);
    result.innerHTML = `<p class="cr-message">
      Impossible de charger <strong>#${esc(tag)}</strong>.<br>
      ${esc(err.message)}
    </p>`;
  }
}

/* ---------- Init ---------- */
(function init() {
  const form  = document.getElementById("search-form");
  const input = document.getElementById("tag-input");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tag = normalizeTag(input.value);
    if (!tag) return;
    input.value = "#" + tag;
    doSearch(tag);
  });

  // Support ?tag=XXXX dans l'URL
  const tagFromUrl = normalizeTag(new URLSearchParams(location.search).get("tag"));
  if (tagFromUrl) {
    input.value = "#" + tagFromUrl;
    doSearch(tagFromUrl);
  } else {
    input.value = "#V9JJGLL0G";
    doSearch("V9JJGLL0G");
  }
})();