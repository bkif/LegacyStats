// stats.js - Affichage de mes statistiques avec fallback local et anti-blocage

async function showPlayerStats() {
  const box = document.getElementById("player-stats");
  if (!box) return;

  try {
    const res = await fetch("data/player.json");
    if (!res.ok) throw new Error("Fichier introuvable");
    const rawData = await res.json();
    const p = rawData.player ?? rawData;
    const battles = rawData.battles ?? p.battles ?? [];

    if (typeof renderPlayer === "function") {
      renderPlayer(p, battles, box);
    } else {
      const deckList = p.deck ?? [];
      const clanName = typeof p.clan === "object" ? (p.clan?.name ?? "aucun") : (p.clan ?? "aucun");
      const trophies = p.trophies?.toLocaleString("fr-CH") ?? "0";
      const bestTrophies = p.bestTrophies?.toLocaleString("fr-CH") ?? trophies;
      const wins = p.wins?.toLocaleString("fr-CH") ?? "0";
      const losses = p.losses?.toLocaleString("fr-CH") ?? "0";
      const threeCrownWins = p.threeCrownWins?.toLocaleString("fr-CH") ?? "0";
      const updated = p.updated ? new Date(p.updated).toLocaleDateString("fr-CH") : "";

      box.innerHTML = `
        <div class="cr-card">
          <div class="cr-header-profile">
            <div class="cr-header-info">
              <h2 class="cr-name">${p.name} <span class="cr-tag">${p.tag}</span></h2>
              <p class="cr-sub">⭐ Niveau ${p.level} · 🛡️ Clan : <strong>${clanName}</strong> · 🏟️ ${p.arena || 'Arène légendaire'}</p>
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
            <h3 class="cr-title">Mon deck actuel</h3>
            <div class="cr-deckgrid" id="my-stats-deck-grid"></div>
          </div>

          ${updated ? `<p class="cr-meta" style="margin-top: 15px; font-size: 0.85rem; opacity: 0.7;">Mis à jour le ${updated}</p>` : ''}
        </div>
      `;

      const deckGrid = document.getElementById("my-stats-deck-grid");
      deckList.forEach(card => {
        if (typeof createCardTile === "function") {
          deckGrid.appendChild(createCardTile(card));
        } else {
          const rawImg = card.image || card.iconUrls?.medium || "";
          const proxiedImg = (rawImg.startsWith("http://") || rawImg.startsWith("https://"))
            ? `https://cr-stats.pm00buq.workers.dev/?image=${encodeURIComponent(rawImg)}`
            : rawImg;

          const img = document.createElement("img");
          img.src = proxiedImg;
          img.alt = `${card.name} niveau ${card.level}`;
          img.width = 65;
          img.onerror = () => {
            img.onerror = null;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="16" fill="#1b2438"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="13" font-family="Arial, sans-serif" fill="#ffd34d" font-weight="700">${card.name || "Carte"}</text></svg>`;
            img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
          };
          deckGrid.appendChild(img);
        }
      });
    }

  } catch (err) {
    console.error("Erreur chargement player-stats :", err);
    box.innerHTML = `<p class="cr-message">Stats indisponibles pour le moment.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", showPlayerStats);
