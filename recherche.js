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

function renderPlayer(p, targetElement = null) {
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
    renderPlayer(p);
  } catch (err) {
    console.warn("Échec requête directe :", err);
    const local = await loadLocalFallback(tag);
    if (local) {
      out.innerHTML = `
        <div class="cr-notice-offline">⚠️ ${esc(err.message)}<br>Affichage des statistiques sauvegardées pour <strong>#${esc(cleanTag(local.tag))}</strong> (${esc(local.name)}).</div>
        <div id="search-player-target"></div>
      `;
      renderPlayer(local, document.getElementById("search-player-target"));
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
