// recherche.js - Recherche résiliente de joueur Clash Royale
// Fonctionne avec l'API Cloudflare Worker ET supporte le secours local si l'école bloque le réseau

const WORKER_URL = "https://cr-stats.pm00buq.workers.dev";
const DEFAULT_TAG = "GG829JGY";

// Transforme n'importe quelle URL d'image externe en URL proxyée par le Worker Cloudflare
function proxyImageUrl(rawUrl) {
  if (!rawUrl) return "";
  // Si c'est déjà une URL relative, un SVG inline ou du data:, on ne touche pas
  if (rawUrl.startsWith("data:") || rawUrl.startsWith("./") || rawUrl.startsWith("/")) {
    return rawUrl;
  }
  // Si l'URL passe par les serveurs officiels bloqués (api-assets.clashroyale.com, royaleapi, etc.)
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return `${WORKER_URL}/?image=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

const form = document.getElementById("search-form");
const input = document.getElementById("tag-input");
const out = document.getElementById("search-result");

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function cleanTag(raw) {
  return (raw || "").trim().toUpperCase().replace(/[^0-9A-Z]/g, "");
}

function createCardTile(card) {
  const name = card.name || "Carte";
  const level = card.level ?? card.expLevel ?? "?";
  const isEvo = card.variant === "evolution" || card.evolutionLevel > 0;
  
  // URL de l'image : on sélectionne l'image et on la fait passer par le proxy Worker
  const rawImg = card.iconUrls?.medium || card.iconUrls?.evolutionMedium || card.image || "";
  const proxiedImg = proxyImageUrl(rawImg);

  // Création du slot
  const slot = document.createElement("div");
  slot.className = "cr-slot cr-slot-big";
  slot.title = `${name} (Niveau ${level})`;

  const tile = document.createElement("div");
  tile.className = `cr-tile cr-r-${card.rarity || 'common'}${isEvo ? " cr-v-evo" : ""}`;

  const art = document.createElement("div");
  art.className = "cr-art";

  const img = document.createElement("img");
  img.alt = `${name} niveau ${level}`;
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";
  img.src = proxiedImg;

  // Fallback si jamais le proxy ou l'image rencontre un souci : affichage dynamique SVG
  img.onerror = () => {
    img.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="16" fill="#1b2438"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" fill="#ffd34d" font-weight="700">${esc(name.slice(0, 15))}</text>
    </svg>`;
    img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  art.appendChild(img);

  const lv = document.createElement("span");
  lv.className = "cr-lv";
  lv.textContent = `Niv ${level}`;

  tile.appendChild(art);
  tile.appendChild(lv);
  slot.appendChild(tile);

  return slot;
}

function renderBattlesSection(battles) {
  if (!battles || !battles.length) {
    return `<div class="cr-battles-section">
      <h3 class="cr-title">20 derniers combats</h3>
      <p class="cr-sub">Aucun combat récent enregistré.</p>
    </div>`;
  }

  const list = battles.slice(0, 20);

  // Petits carrés W / D d'affilée
  const squaresHtml = list.map((b, idx) => {
    const isWin = b.result === "win";
    const isLoss = b.result === "loss";
    const char = isWin ? "W" : (isLoss ? "D" : "-");
    const label = isWin ? "Victoire" : (isLoss ? "Défaite" : "Égalité");
    const opp = (b.opponents && b.opponents.length) ? b.opponents.join(", ") : "Adversaire";
    const title = `#${idx + 1} - ${label} (${b.crowns ?? 0} - ${b.oppCrowns ?? 0}) contre ${opp}`;
    const cls = isWin ? "cr-history-square-w" : (isLoss ? "cr-history-square-d" : "cr-history-square-draw");
    return `<span class="cr-history-square ${cls}" title="${esc(title)}">${char}</span>`;
  }).join("");

  // Liste détaillée des combats
  const battlesListHtml = battles.map((b) => {
    const isWin = b.result === "win";
    const isLoss = b.result === "loss";
    const resultLabel = isWin ? "Victoire" : (isLoss ? "Défaite" : "Égalité");
    const rowClass = isWin ? "cr-battle cr-win" : (isLoss ? "cr-battle cr-loss" : "cr-battle");
    const crowns = b.crowns ?? 0;
    const oppCrowns = b.oppCrowns ?? 0;
    const oppName = (b.opponents && b.opponents.length) ? b.opponents.join(" & ") : "Adversaire inconnu";
    const mode = b.mode ? b.mode.replace(/_/g, " ") : "";
    const trophyChange = (b.trophyChange !== null && b.trophyChange !== undefined)
      ? `<span class="cr-trophy">${b.trophyChange > 0 ? `+${b.trophyChange}` : b.trophyChange} 🏆</span>`
      : "";

    // Cartes du combat
    const cardsList = b.cards || [];
    const cardsHtml = cardsList.map(c => {
      const cName = c.name || "Carte";
      const cLvl = c.level ?? "?";
      const rawImg = c.image || c.iconUrls?.medium || "";
      const proxied = proxyImageUrl(rawImg);
      const isEvo = c.evo || c.variant === "evo" || c.variant === "evolution";
      return `
        <div class="cr-slot cr-slot-small" title="${esc(cName)} (Niv ${cLvl})">
          <div class="cr-tile cr-r-${c.rarity || 'common'}${isEvo ? " cr-v-evo" : ""}">
            <div class="cr-art">
              <img src="${proxied}" alt="${esc(cName)}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 80 80\\'><rect width=\\'80\\' height=\\'80\\' rx=\\'8\\' fill=\\'%231b2438\\'/></svg>';">
            </div>
            <span class="cr-lv">Niv ${cLvl}</span>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="${rowClass}">
        <div class="cr-battle-head">
          <span class="cr-result">${resultLabel}</span>
          <span class="cr-score">${crowns} - ${oppCrowns}</span>
          ${trophyChange}
        </div>
        <p class="cr-meta">⚔️ Contre <strong>${esc(oppName)}</strong> ${mode ? `· <em>${esc(mode)}</em>` : ""}</p>
        ${cardsHtml ? `<div class="cr-deck-small">${cardsHtml}</div>` : ""}
      </div>
    `;
  }).join("");

  return `
    <div class="cr-battles-section">
      <div class="cr-battles-header">
        <h3 class="cr-title">20 derniers combats</h3>
        <div class="cr-recent-streak" aria-label="Historique récent des 20 combats">
          <span class="cr-streak-label">Série :</span>
          <div class="cr-streak-squares">${squaresHtml}</div>
        </div>
      </div>
      <div class="cr-battles cr-battlepanel">
        ${battlesListHtml}
      </div>
    </div>
  `;
}

function renderPlayer(p, battles = [], targetElement = null) {
  const container = targetElement || out;
  const deckList = p.deck ?? p.currentDeck ?? [];
  const clanName = typeof p.clan === "object" ? (p.clan?.name ?? "aucun") : (p.clan ?? "aucun");
  const level = p.level ?? p.expLevel ?? "?";
  const trophies = p.trophies?.toLocaleString("fr-CH") ?? "0";
  const bestTrophies = p.bestTrophies?.toLocaleString("fr-CH") ?? trophies;
  const wins = p.wins?.toLocaleString("fr-CH") ?? "0";
  const losses = p.losses?.toLocaleString("fr-CH") ?? "0";
  const threeCrownWins = p.threeCrownWins?.toLocaleString("fr-CH") ?? "0";
  const arena = p.arena?.name ?? p.arena ?? "Arène légendaire";
  const gridId = `deck-grid-${Math.random().toString(36).substring(2, 9)}`;

  // Liste des combats si présents dans p ou dans l'argument battles
  const battleList = (battles && battles.length) ? battles : (p.battles ?? []);
  const battlesHtml = renderBattlesSection(battleList);

  container.innerHTML = `
    <div class="cr-search-result-box cr-card">
      <div class="cr-header-profile">
        <div class="cr-header-info">
          <h2 class="cr-name">${esc(p.name)} <span class="cr-tag">#${esc(cleanTag(p.tag))}</span></h2>
          <p class="cr-sub">⭐ Niveau ${esc(level)} · 🛡️ Clan : <strong>${esc(clanName)}</strong> · 🏟️ ${esc(arena)}</p>
        </div>
      </div>

      <div class="cr-stats">
        <div class="cr-stat">
          <span class="cr-stat-value">🏆 ${trophies}</span>
          <span class="cr-stat-label">Trophées (Record: ${bestTrophies})</span>
        </div>
        <div class="cr-stat">
          <span class="cr-stat-value">⚔️ ${wins}</span>
          <span class="cr-stat-label">Victoires</span>
        </div>
        <div class="cr-stat">
          <span class="cr-stat-value">💀 ${losses}</span>
          <span class="cr-stat-label">Défaites</span>
        </div>
        <div class="cr-stat">
          <span class="cr-stat-value">👑 ${threeCrownWins}</span>
          <span class="cr-stat-label">3 Couronnes</span>
        </div>
      </div>

      <div class="cr-deck-section">
        <h3 class="cr-title">Deck de combat (${deckList.length} cartes)</h3>
        <div class="cr-deckgrid" id="${gridId}"></div>
      </div>

      ${battlesHtml}
    </div>
  `;

  const deckGrid = document.getElementById(gridId);
  if (deckGrid) {
    deckList.forEach(card => {
      deckGrid.appendChild(createCardTile(card));
    });
  }
}

async function loadLocalFallback(tag) {
  try {
    const res = await fetch("data/player.json");
    if (!res.ok) throw new Error("Fichier local indisponible");
    const data = await res.json();
    return data;
  } catch (err) {
    return null;
  }
}

async function searchTag(rawTag) {
  const tag = cleanTag(rawTag);
  if (!tag) {
    out.innerHTML = `<p class="cr-message">Veuillez entrer un tag valide (ex: #GG829JGY).</p>`;
    return;
  }

  out.innerHTML = `<p class="cr-message">Recherche du joueur #${esc(tag)} en cours...</p>`;

  try {
    // Tentative via le Cloudflare Worker
    const res = await fetch(`${WORKER_URL}?tag=${encodeURIComponent(tag)}`, { mode: "cors" });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Joueur introuvable avec ce tag.");
      }
      if (data && data.reason === "inMaintenance") {
        throw new Error("L'API officielle de Supercell est actuellement en maintenance.");
      }
      throw new Error((data && data.message) ? data.message : `Erreur serveur (${res.status})`);
    }

    if (!data) throw new Error("Réponse vide du serveur.");
    const p = data.player ?? data;
    const battles = data.battles ?? p.battles ?? [];
    renderPlayer(p, battles);
  } catch (err) {
    console.warn("Échec requête directe :", err);
    const local = await loadLocalFallback(tag);
    if (local) {
      const p = local.player ?? local;
      const battles = local.battles ?? p.battles ?? [];
      out.innerHTML = `
        <div class="cr-notice-offline">⚠️ ${esc(err.message)}<br>Affichage des statistiques sauvegardées pour <strong>#${esc(cleanTag(p.tag || local.tag))}</strong> (${esc(p.name || local.name)}).</div>
        <div id="search-player-target"></div>
      `;
      renderPlayer(p, battles, document.getElementById("search-player-target"));
    } else {
      out.innerHTML = `<p class="cr-message">❌ ${esc(err.message)}</p>`;
    }
  }
}

if (form && input) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchTag(input.value);
  });
}
