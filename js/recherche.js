document.addEventListener("DOMContentLoaded", function () {
  // 👇 TON URL DE WORKER CLOUDFLARE EST ICI 👇
  const WORKER_URL = "https://cr-stats.pm00buq.workers.dev";
  const DEFAULT_TAG = "V9JJGLL0G";

  const form = document.getElementById("search-form");
  const input = document.getElementById("tag-input");
  const out = document.getElementById("search-result");
  if (!form || !input || !out) return;

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
    const fallback = cardFallback(card.name, card.rarity === "legendary" ? "#71f0d0" : card.rarity === "epic" ? "#d28dfd" : "#f7c75a");
    const img = card.image ? `<img src="${esc(card.image)}" alt="${esc(card.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">` : `<div class="cr-art-empty">?</div>`;
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
    const stats = [
      ["Trophées", player.trophies, true], ["Record", player.bestTrophies, false],
      ["Victoires", player.wins, false], ["Défaites", player.losses, false],
      ["Parties", player.battleCount, false], ["3 Couronnes", player.threeCrownWins, false]
    ];
    const statsHtml = stats.map(([l, v, hl]) => `
      <div class="cr-stat${hl ? " hl" : ""}">
        <span class="cr-stat-value">${esc(v ?? "—")}</span>
        <span class="cr-stat-label">${l}</span>
      </div>`).join("");

    const profileHtml = `
      <section class="cr-card">
        <div class="cr-head">
          <div class="cr-lvl">${esc(player.level)}</div>
          <div>
            <h2 class="cr-name">${esc(player.name)}</h2>
            <p class="cr-sub">${esc(player.tag)} · ${esc(player.clan || "Sans clan")} · ${esc(player.arena || "")}</p>
          </div>
        </div>
        <div class="cr-stats">${statsHtml}</div>
      </section>`;

    // 2. Deck actuel
    const deckHtml = player.deck && player.deck.length ? `
      <section class="cr-card">
        <div class="cr-sectionhead">
          <h2 class="cr-title">Deck actuel</h2>
          <span class="cr-chip">🃏 8 cartes</span>
        </div>
        <div class="cr-deckgrid">${player.deck.map(cardTile).join("")}</div>
      </section>` : `<section class="cr-card"><p class="cr-message">Deck indisponible.</p></section>`;

    // 3. Combats
    const battlesHtml = `
      <section class="cr-card">
        <div class="cr-sectionhead">
          <h2 class="cr-title">20 derniers combats</h2>
          <span class="cr-chip">${battles.length} parties</span>
        </div>
        <div class="cr-form20">
          ${battles.map((b, i) => {
            const perfect = b.result === "win" && b.crowns === 3 && b.oppCrowns === 0;
            const letter = b.result === "win" ? "V" : b.result === "loss" ? "D" : "N";
            return `<button type="button" class="cr-bt cr-bt-${b.result}${perfect ? " cr-bt-perfect" : ""}" data-idx="${i}" aria-pressed="false">
              <b>${letter}</b><small>${b.crowns}-${b.oppCrowns}</small>
            </button>`;
          }).join("")}
        </div>
        <div class="cr-detail" id="battle-detail" hidden></div>
      </section>`;

    out.innerHTML = profileHtml + deckHtml + battlesHtml;

    // Gestion du clic sur les combats
    const detailBox = document.getElementById("battle-detail");
    const buttons = out.querySelectorAll(".cr-bt");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");

        const b = battles[parseInt(btn.dataset.idx)];
        const oppCards = (b.oppCards || []).map(c => {
          const fallback = cardFallback(c.name, c.rarity === "legendary" ? "#71f0d0" : c.rarity === "epic" ? "#d28dfd" : "#f7c75a");
          return `
            <div class="bd-card">
              <img src="${esc(c.image || fallback)}" alt="${esc(c.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">
              <span class="bd-card-name">${esc(c.name)}</span>
              <span class="bd-card-meta">Niv ${esc(c.level || '?')}</span>
            </div>
          `;
        }).join("");

        detailBox.innerHTML = `
          <div class="bd-head">
            <span class="bd-result ${b.result}">${b.result === "win" ? "V" : b.result === "loss" ? "D" : "N"}</span>
            <div class="bd-info">
              <h4>${b.result === "win" ? "Victoire" : b.result === "loss" ? "Défaite" : "Égalité"} ${b.crowns} - ${b.oppCrowns} 👑</h4>
              <p>Contre ${esc(b.opponents.join(' & ') || 'Inconnu')} ${fmtDate(b.time) ? " · " + fmtDate(b.time) : ""}</p>
            </div>
          </div>
          <div class="bd-deck">
            <h5>Deck adverse</h5>
            <div class="bd-cards">${oppCards || '<div class="cr-empty">Données adverses indisponibles.</div>'}</div>
          </div>
        `;
        detailBox.hidden = false;
      });
    });
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