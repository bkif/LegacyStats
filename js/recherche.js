/* ============================================================
   recherche.js — Recherche de joueur Clash Royale (MH Legacy)
   - Récupère le profil /players/%23TAG
   - Récupère les combats /players/%23TAG/battles
   - Affiche le deck actuel + les 20 derniers combats
     avec le deck de l'adversaire au clic.

   ⚙️  POINT IMPORTANT : l'API officielle refuse les appels
   directs depuis un navigateur (CORS + token). Il faut un proxy.
   Adapte PROXY_URL à ton proxy (Cloudflare Worker, Vercel,
   Netlify, RoyaleAPI, etc.). Les endpoints appelés seront :
       PROXY_URL + "/players/%23TAG"
       PROXY_URL + "/players/%23TAG/battles"
   ============================================================ */

const PROXY_URL = (window.MH_LEGACY_PROXY_URL || "/api").replace(/\/+$/, "");

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);

function readText(value, fallback = "—") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeTag(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/^#/, "")
    .replace(/[^0-9A-Z]/g, "");
}

async function fetchJSON(path, { timeoutMs = 12000 } = {}) {
  const base = PROXY_URL || "";
  if (!base) {
    throw new Error("Aucune URL de proxy définie. Configure MH_LEGACY_PROXY_URL ou PROXY_URL.");
  }

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}${path}`, {
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;",
  }[c]));
}

function parseBattleTime(s) {
  if (!s) return null;
  const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
}

function fmtDate(d) {
  if (!d) return "";
  return d.toLocaleString("fr-CH", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function rarityClass(r) {
  return `cr-r-${String(r || "common").toLowerCase()}`;
}

/* ---------- Rendu des cartes ---------- */
function cardTile(card, { showMax = false } = {}) {
  const img  = card.iconUrls?.medium || card.iconUrls?.large || "";
  const name = readText(card.name, "Carte");
  const lvl  = card.level ?? card.maxLevel ?? "?";
  const isMax = showMax && card.maxLevel && card.level >= card.maxLevel;
  const isEvo = Number(card.evolutionLevel || 0) > 0;

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
  const clan    = p.clan ? `${p.clan.name} (${p.clan.tag})` : "Sans clan";
  const arena   = p.arena?.name || "";
  const league  = p.currentPathOfLegendSeasonResult?.leagueNumber;

  const stats = [
    ["Niveau",        p.expLevel,       false],
    ["Trophées",      p.trophies,       true ],
    ["Record",        p.bestTrophies,   false],
    ["Victoires 3 ⭐", p.threeCrownWins, false],
    ["Parties",       p.totalGames,     false],
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
      <div class="cr-lvl">${esc(p.expLevel ?? "?")}</div>
      <div>
        <h2 class="cr-name">${esc(p.name)}</h2>
        <p class="cr-sub">
          ${esc(p.tag)} · ${esc(clan)}
          ${arena  ? " · " + esc(arena)  : ""}
          ${league ? " · Ligue " + esc(league) : ""}
        </p>
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
function outcomeOf(b) {
  const my  = b.team?.[0];
  const opp = b.opponent?.[0];
  if (!my || !opp) return null;
  if (my.crowns > opp.crowns) return "win";
  if (my.crowns < opp.crowns) return "loss";
  return "draw";
}

function battleHistorySection(battles) {
  const list = (battles || [])
    .filter(b => b.team?.[0] && b.opponent?.[0])
    .slice(0, 20);

  if (list.length === 0) {
    return `<section class="cr-card">
      <h2 class="cr-title">20 derniers combats</h2>
      <p class="cr-message" style="margin:0">Aucun combat récent trouvé.</p>
    </section>`;
  }

  const buttons = list.map((b, i) => {
    const out = outcomeOf(b);
    const my  = b.team[0];
    const opp = b.opponent[0];
    const letter = out === "win" ? "V" : out === "loss" ? "D" : "N";
    const perfect = out === "win" && Number(my.crowns || 0) === 3 && Number(opp.crowns || 0) === 0;
    const extraClass = perfect ? " cr-bt-perfect" : "";

    return `<button type="button" class="cr-bt cr-bt-${out}${extraClass}"
              data-battle="${i}" aria-pressed="false"
              aria-label="Combat ${i + 1} : ${letter}">
      <b>${letter}</b>
      <small>${my.crowns}–${opp.crowns}</small>
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
  const my  = b.team[0];
  const opp = b.opponent[0];
  const out = outcomeOf(b);
  const verb = out === "win" ? "Victoire" : out === "loss" ? "Défaite" : "Match nul";
  const date = fmtDate(parseBattleTime(b.battleTime));
  const mode = b.gameMode?.name || "";
  const arena = b.arena?.name || "";

  const oppCards = (opp.cards || []).map(c => `
    <div class="bd-card">
      <img src="${esc(c.iconUrls?.medium || c.iconUrls?.large || "")}" alt="${esc(c.name || "Carte")}" title="${esc(c.name || "Carte")}" loading="lazy">
      <span class="bd-card-name">${esc(c.name || "Carte")}</span>
      <span class="bd-card-meta">${esc(c.level ?? c.maxLevel ?? "")}</span>
    </div>
  `).join("");

  return `<div class="cr-battle-detail">
    <div class="bd-head">
      <span class="bd-result ${out === "win" ? "win" : out === "loss" ? "loss" : "draw"}">${out === "win" ? "V" : out === "loss" ? "D" : "N"}</span>
      <div class="bd-info">
        <h4>${verb} contre ${esc(opp.name || "adversaire")}</h4>
        <p>${esc(opp.tag || "—")} · ${my.crowns}–${opp.crowns}${mode ? " · " + esc(mode) : ""}${arena ? " · " + esc(arena) : ""}${date ? " · " + esc(date) : ""}</p>
      </div>
    </div>
    <div class="bd-deck">
      <h5>Deck adverse</h5>
      <div class="bd-cards">${oppCards || '<div class="cr-empty">Aucune carte disponible pour ce combat.</div>'}</div>
    </div>
  </div>`;
}

/* ---------- Rendu global ---------- */
function render(player, battles) {
  const result = document.getElementById("search-result");
  if (!result) return;

  result.innerHTML = `
    ${playerCard(player)}
    ${currentDeckSection(player.currentDeck || [])}
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
async function doSearch(tag, { fromUrl = false } = {}) {
  const result = document.getElementById("search-result");
  if (!result) return;

  result.innerHTML = `<p class="cr-message">Recherche de <strong>#${esc(tag)}</strong>…</p>`;

  try {
    const [player, battles] = await Promise.all([
      fetchJSON(`/players/%23${encodeURIComponent(tag)}`),
      fetchJSON(`/players/%23${encodeURIComponent(tag)}/battles`).catch(() => []),
    ]);
    render(player, battles);

    if (!fromUrl) {
      const url = new URL(location.href);
      url.searchParams.set("tag", tag);
      history.replaceState(null, "", url);
    }
  } catch (err) {
    console.error("[recherche]", err);
    result.innerHTML = `<p class="cr-message">
      Impossible de charger <strong>#${esc(tag)}</strong>.<br>
      Vérifie le tag, le proxy API (<code>${esc(PROXY_URL)}</code>)
      et la console pour plus de détails.
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

  // Support ?tag=XXXX dans l'URL (utile pour partager un profil)
  const tagFromUrl = normalizeTag(new URLSearchParams(location.search).get("tag"));
  if (tagFromUrl) {
    input.value = "#" + tagFromUrl;
    doSearch(tagFromUrl, { fromUrl: true });
  }
})();