document.addEventListener("DOMContentLoaded", function () {
  // 👇 TON URL DE WORKER CLOUDFLARE EST ICI 👇
  const WORKER_URL = "https://cr-stats.pm00buq.workers.dev";
  const DEFAULT_TAG = "V9JJGLL0G";

  const form = document.getElementById("search-form");
  const input = document.getElementById("tag-input");
  const out = document.getElementById("search-result");
  if (!form || !input || !out) return;

  function imageProxyUrl(src) {
    if (!src) return '';
    return `${WORKER_URL}?image=${encodeURIComponent(src)}`;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const tag = input.value.trim();
    if (tag) search(tag);
  });

  function esc(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function fmtDate(t) {
    if (!t) return "";
    const d = new Date(t);
    return isNaN(d) ? "" : d.toLocaleString("fr-CH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function cardFallback(cardName = "Carte", color = "#f7c75a") {
    const label = String(cardName).slice(0, 12) || "Carte";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#1b2438"/></linearGradient></defs><rect width="160" height="160" rx="24" fill="#0f172a"/><rect x="10" y="10" width="140" height="140" rx="18" fill="url(#g)" opacity="0.95"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" fill="#edf4ff" font-weight="700">${label}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function cardTile(card) {
    const isMax = card.maxed;
    const isEvo = card.variant === "evo";
    const fallbackSvg = cardFallback(card.name, card.rarity === "legendary" ? "#71f0d0" : card.rarity === "epic" ? "#d28dfd" : "#f7c75a");
    const localImg = typeof getLocalCardImage === "function" ? getLocalCardImage(card.name) : fallbackSvg;
    const imageSrc = card.image ? imageProxyUrl(card.image) : localImg;
    const img = `<img src="${esc(imageSrc)}" alt="${esc(card.name)}" loading="lazy" onerror="if (this.src !== '${localImg}') { this.src = '${localImg}'; } else { this.onerror = null; this.src = '${fallbackSvg}'; }">`;
    const classes = ["cr-tile", `cr-r-${card.rarity || 'common'}`];
    if (isMax) classes.push("max");
    if (isEvo) classes.push("cr-v-evo");

    return `<div class="cr-slot">
      <div class="${classes.join(" ")}" title="${esc(card.name)}">
        <div class="cr-art">${img}</div>
        <span class="cr-lv">Niv ${esc(card.level ?? "?")}</span>
      </div>
    </div>`;
  }

  function render(player, battles) {
    // 1. Profil
    const profileHtml = `
      <section class="cr-card">
        <div class="cr-header">
          <div class="cr-lvl">${player.level ?? "?"}</div>
          <div class="cr-headline">
            <h1 class="cr-name">${esc(player.name)}</h1>
            <p class="cr-sub">${esc(player.tag)} ${player.clan ? "· 🛡️ " + esc(player.clan) : ""} ${player.arena ? "· 🏟️ " + esc(player.arena) : ""}</p>
          </div>
        </div>
        <div class="cr-stats">
          <div class="cr-stat hl"><span class="cr-stat-value">${player.trophies?.toLocaleString("fr-CH") ?? "—"}</span><span class="cr-stat-label">Trophées</span></div>
          <div class="cr-stat"><span class="cr-stat-value">${player.bestTrophies?.toLocaleString("fr-CH") ?? "—"}</span><span class="cr-stat-label">Record</span></div>
          <div class="cr-stat"><span class="cr-stat-value">${player.wins?.toLocaleString("fr-CH") ?? "—"}</span><span class="cr-stat-label">Victoires</span></div>
          <div class="cr-stat"><span class="cr-stat-value">${player.threeCrownWins?.toLocaleString("fr-CH") ?? "—"}</span><span class="cr-stat-label">3 Couronnes</span></div>
          <div class="cr-stat"><span class="cr-stat-value">${player.losses?.toLocaleString("fr-CH") ?? "—"}</span><span class="cr-stat-label">Défaites</span></div>
        </div>
      </section>`;

    // 2. Deck actuel
    const deckHtml = player.deck && player.deck.length ? `
      <section class="cr-card">
        <div class="cr-sectionhead">
          <h2 class="cr-title">Deck actuel</h2>
          <span class="cr-chip">${player.deck.length} cartes</span>
        </div>
        <div class="cr-deckgrid">${player.deck.map(cardTile).join("")}</div>
      </section>` : '';

    // 3. Collection complète du joueur (toggleable)
    const allPlayerCards = player.cards || [];
    const collectionHtml = allPlayerCards.length ? `
      <section class="cr-card">
        <div class="cr-sectionhead">
          <div>
            <h2 class="cr-title">Collection de cartes</h2>
            <small style="color:var(--muted)">${allPlayerCards.length} cartes débloquées</small>
          </div>
          <button type="button" class="cr-toggle-btn" id="btn-toggle-collection">Afficher la collection</button>
        </div>
        <div class="cr-deckgrid" id="player-collection" style="display:none; max-height:480px; overflow-y:auto; padding-right:6px;">
          ${allPlayerCards.map(cardTile).join("")}
        </div>
      </section>` : '';

    // Calcul victoires / défaites
    const winsCount = battles.filter(b => b.result === "win").length;
    const lossCount = battles.filter(b => b.result === "loss").length;
    const drawCount = battles.filter(b => b.result === "draw").length;

    function renderMiniDeck(cardsList) {
      if (!cardsList || !cardsList.length) return '<div class="cr-empty">Deck indisponible</div>';
      return cardsList.map(c => {
        const fallbackSvg = cardFallback(c.name, c.rarity === "legendary" ? "#71f0d0" : c.rarity === "epic" ? "#d28dfd" : "#f7c75a");
        const localImg = typeof getLocalCardImage === "function" ? getLocalCardImage(c.name) : fallbackSvg;
        const imageSrc = c.image ? imageProxyUrl(c.image) : localImg;
        return `
          <div class="bd-card" title="${esc(c.name)} (Niv ${esc(c.level || '?')})">
            <img src="${esc(imageSrc)}" alt="${esc(c.name)}" loading="lazy" onerror="if (this.src !== '${localImg}') { this.src = '${localImg}'; } else { this.onerror = null; this.src = '${fallbackSvg}'; }">
            <span class="bd-card-meta">Niv ${esc(c.level || '?')}</span>
          </div>`;
      }).join("");
    }

    const badgesHtml = `
      <div class="cr-form20">
        ${battles.map((b, i) => {
          const letter = b.result === "win" ? "W" : b.result === "loss" ? "L" : "D";
          return `<a href="#battle-${i}" class="cr-bt cr-bt-${b.result}" title="Combat ${i+1} : ${letter} (${b.crowns}-${b.oppCrowns})">
            <b>${letter}</b>
          </a>`;
        }).join("")}
      </div>`;

    const battlesListHtml = battles.length ? battles.map((b, i) => {
      const isWin = b.result === "win";
      const isLoss = b.result === "loss";
      const resLabel = isWin ? "Victoire" : isLoss ? "Défaite" : "Égalité";
      const resBadge = isWin ? "W" : isLoss ? "L" : "D";
      const myCards = renderMiniDeck(b.cards && b.cards.length ? b.cards : player.deck);
      const oppCards = renderMiniDeck(b.oppCards);

      return `
        <article class="cr-battle-row cr-battle-${b.result}" id="battle-${i}">
          <div class="b-row-header">
            <div class="b-score-badge">
              <span class="bd-badge ${b.result}">${resBadge}</span>
              <span class="b-crowns">${b.crowns} - ${b.oppCrowns} 👑</span>
            </div>
            <div class="b-versus">
              <span class="b-me">${esc(player.name)}</span>
              <span class="b-vs">VS</span>
              <span class="b-opp">${esc(b.opponents.join(' & ') || 'Adversaire')}</span>
            </div>
            <time class="b-time">${fmtDate(b.time)}</time>
          </div>

          <div class="b-matchup">
            <div class="b-deck-col">
              <div class="b-col-title">Mon deck</div>
              <div class="b-card-strip">${myCards}</div>
            </div>
            <div class="b-deck-col">
              <div class="b-col-title">Deck adverse</div>
              <div class="b-card-strip">${oppCards}</div>
            </div>
          </div>
        </article>`;
    }).join("") : '<p class="cr-message">Aucun combat récent trouvé.</p>';

    const battlesHtml = `
      <section class="cr-card">
        <div class="cr-sectionhead">
          <div>
            <h2 class="cr-title">20 derniers combats</h2>
            <div class="cr-battle-score">
              <span class="score-w">🏆 ${winsCount} Victoires</span>
              <span class="score-l">❌ ${lossCount} Défaites</span>
              ${drawCount ? `<span class="score-d">🤝 ${drawCount} Nuls</span>` : ""}
            </div>
          </div>
          <span class="cr-chip">${battles.length} combats</span>
        </div>
        ${badgesHtml}
        <div class="cr-battles-stream">
          ${battlesListHtml}
        </div>
      </section>`;

    out.innerHTML = `<div class="cr-top-row">${profileHtml}${deckHtml}</div>${collectionHtml}${battlesHtml}`;

    // Listener toggle collection
    const toggleBtn = document.getElementById("btn-toggle-collection");
    const collBox = document.getElementById("player-collection");
    if (toggleBtn && collBox) {
      toggleBtn.addEventListener("click", () => {
        const isHidden = collBox.style.display === "none";
        collBox.style.display = isHidden ? "grid" : "none";
        toggleBtn.textContent = isHidden ? "Masquer la collection" : "Afficher la collection";
      });
    }
  }

  async function loadFallbackData(tag) {
    const response = await fetch("./data/player.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Données locales indisponibles.");

    const data = await response.json();
    const wanted = (tag || "").replace(/^#/, "").toUpperCase();
    const defaultTag = (data.tag || "").replace(/^#/, "").toUpperCase();

    if (wanted && wanted !== defaultTag && wanted !== DEFAULT_TAG) {
      throw new Error("Aucune donnée locale pour ce tag.");
    }

    return {
      player: data,
      battles: Array.isArray(data.battles) ? data.battles : []
    };
  }

  async function search(tag) {
    out.innerHTML = `<p class="cr-message">Recherche en cours...</p>`;

    const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
    if (isLocal) {
      try {
        const fallback = await loadFallbackData(tag);
        render(fallback.player, fallback.battles);
        return;
      } catch (fallbackErr) {
        const reason = fallbackErr?.message || "Erreur inconnue.";
        out.innerHTML = `<p class="cr-message">
          Impossible de charger les données.<br>
          <small>${esc(reason)}</small>
        </p>`;
        return;
      }
    }

    try {
      const res = await fetch(`${WORKER_URL}?tag=${encodeURIComponent(tag)}`, { mode: "cors" });
      if (!res.ok) {
        const text = await res.text();
        let msg = res.status === 404 ? "Joueur introuvable." : "Erreur serveur.";
        try {
          const json = JSON.parse(text);
          if (json?.error) msg = json.error === "api" ? "Le proxy API est indisponible pour le moment." : json.error;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      if (!data.battles) data.battles = [];
      render(data.player, data.battles);
      return;
    } catch (workerErr) {
      try {
        const fallback = await loadFallbackData(tag);
        render(fallback.player, fallback.battles);
        return;
      } catch (fallbackErr) {
        const reason = fallbackErr?.message || workerErr?.message || "Erreur inconnue.";
        out.innerHTML = `<p class="cr-message">
          Impossible de charger les données.<br>
          <small>${esc(reason)}<br>Vérifie que le worker accepte localhost et GitHub Pages (CORS).</small>
        </p>`;
      }
    }
  }

  // Lancer la recherche par défaut
  input.value = "#" + DEFAULT_TAG;
  search(DEFAULT_TAG);
});

