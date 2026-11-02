let newsData = null;
let activeSeason = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const list = document.getElementById("seasons-list");
  const content = document.getElementById("news-content");
  if (!list || !content) return;

  try {
    const res = await fetch("data/news.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    newsData = await res.json();
  } catch (err) {
    console.error("Erreur news.json :", err);
    content.innerHTML = `<p class="cr-message">Impossible de charger les équilibrages. Vérifie data/news.json.</p>`;
    return;
  }

  if (!newsData.seasons || !newsData.seasons.length) {
    content.innerHTML = `<p class="cr-message">Aucune saison disponible.</p>`;
    return;
  }

  // Boutons de saison
  newsData.seasons.forEach((s, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = s.label;
    btn.addEventListener("click", () => selectSeason(s.id));
    if (i === 0) btn.classList.add("active");
    list.appendChild(btn);
  });

  // Première saison par défaut
  selectSeason(newsData.seasons[0].id);
}

function selectSeason(id) {
  activeSeason = id;

  // Boutons actifs
  document.querySelectorAll("#seasons-list button").forEach((b) => {
    const label = newsData.seasons.find((s) => s.id === id)?.label;
    b.classList.toggle("active", b.textContent === label);
  });

  const season = newsData.seasons.find((s) => s.id === id);
  const content = document.getElementById("news-content");
  if (!season) return;

  const dateStr = season.date
    ? new Date(season.date).toLocaleDateString("fr-CH", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  const article = document.createElement("article");
  article.innerHTML = `
    <h2>${season.title} — ${season.label}</h2>
    <p class="news-date">${dateStr}</p>
    <ul class="news-changes">
      ${season.changes.map((c) => {
        const icon = c.type === "buff" ? "🟢" : c.type === "nerf" ? "🔴" : c.type === "rework" ? "🔵" : "🟣";
        return `<li><span class="news-icon">${icon}</span><strong>${escapeHtml(c.card)}</strong> — ${escapeHtml(c.detail)}</li>`;
      }).join("")}
    </ul>
  `;

  content.replaceChildren(article);

  // Ajout de la date de mise à jour
  if (newsData.lastUpdated) {
    const p = document.createElement("p");
    p.className = "news-updated";
    p.textContent = `Dernière mise à jour du fichier : ${new Date(newsData.lastUpdated).toLocaleDateString("fr-CH")}`;
    content.appendChild(p);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}