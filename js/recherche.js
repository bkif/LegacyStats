document.addEventListener("DOMContentLoaded", function () {
  const WORKER_URL = "https://cr-stats.pm00buq.workers.dev";
  const MON_TAG = "v9jjgll0g";
  const FALLBACK = "./images/logo_clash_royale.png";
  const MAX_LEVEL = 16;

  const form = document.getElementById("search-form");
  const input = document.getElementById("tag-input");
  const out = document.getElementById("search-result");
  if (!form || !input || !out) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const tag = input.value.trim();
    if (tag) search(tag);
  });

  /* ---------- outils ---------- */
  const num = (n) => Number(n).toLocaleString("fr-CH");
  const has = (v) => v !== undefined && v !== null && v !== "";

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function message(text) {
    out.replaceChildren(el("p", "cr-message", text));
  }

  function picture(src, alt) {
    const img = document.createElement("img");
    img.src = src || FALLBACK;
    img.alt = alt || "";
    img.loading = "lazy";
    img.onerror = function () { this.onerror = null; this.src = FALLBACK; };
    return img;
  }

  function normCard(c) {
    const icons = c.iconUrls || {};
    const maxLevel = c.maxLevel;
    const level = c.displayLevel ?? (maxLevel && has(c.level) ? c.level + (MAX_LEVEL - maxLevel) : c.level);
    const variant = c.variant || (c.evolutionLevel > 0 ? "evo" : "normal");
    return {
      name: c.name || "?",
      rarity: c.rarity || "common",
      elixir: c.elixir ?? c.elixirCost,
      level,
      maxed: has(maxLevel) ? c.level >= maxLevel : false,
      variant,
      image: variant === "evo" && (c.evoImage || icons.evolutionMedium) ? (c.evoImage || icons.evolutionMedium)
           : variant === "hero" && (c.heroImage || icons.heroMedium) ? (c.heroImage || icons.heroMedium)
           : (c.image || icons.medium),
    };
  }

  function cardTile(raw) { return tileFromNorm(normCard(raw)); }

  function tileFromNorm(c) {
    const slot = el("div", "cr-slot");
    slot.title = c.name;
    const tile = el("div", `cr-tile cr-r-${c.rarity} cr-v-${c.variant}${c.maxed ? " max" : ""}`);
    if (typeof c.elixir === "number") tile.append(el("span", "cr-el", String(c.elixir)));
    const art = el("div", "cr-art");
    art.append(picture(c.image, c.name));
    tile.append(art);
    if (has(c.level)) tile.append(el("div", "cr-lv", c.maxed ? "MAX" : `Niv. ${c.level}`));
    slot.append(tile);
    return slot;
  }

  /* ---------- profil ---------- */
  function renderHeader(p) {
    const box = el("div", "cr-card");
    const head = el("div", "cr-head");
    const text = el("div");
    text.append(el("h3", "cr-name", p.name), el("p", "cr-sub", [p.tag, p.clan, p.arena].filter(has).join(" · ")));
    head.append(el("div", "cr-lvl", String(p.level ?? "?")), text);
    box.append(head);

    const total = (p.wins ?? 0) + (p.losses ?? 0);
    const rate = total > 0 ? ((p.wins / total) * 100).toFixed(1) + " %" : null;
    const defs = [
      ["Trophées", p.trophies, true], ["Record", p.bestTrophies, true],
      ["Victoires", p.wins], ["Défaites", p.losses], ["Taux de victoire", rate],
      ["3 couronnes", p.threeCrownWins], ["Combats", p.battleCount],
      ["Dons", p.totalDonations ?? p.donations], ["Dons reçus", p.donationsReceived],
      ["Victoires de guerre", p.warDayWins], ["Trophées de guerre", p.clanWarTrophies],
      ["Max victoires défi", p.challengeMaxWins], ["Cartes gagnées en défi", p.challengeCardsWon],
      ["Rôle dans le clan", p.role], ["Carte favorite", p.favouriteCard],
    ];
    const grid = el("div", "cr-stats");
    defs.forEach(([label, value, hl]) => {
      if (!has(value)) return;
      const s = el("div", "cr-stat" + (hl ? " hl" : ""));
      s.append(
        el("span", "cr-stat-value", typeof value === "number" ? num(value) : String(value)),
        el("span", "cr-stat-label", label)
      );
      grid.append(s);
    });
    box.append(grid);
    return box;
  }

  /* ---------- deck actuel ---------- */
  function renderDeck(p) {
    const box = el("div", "cr-card");
    const head = el("div", "cr-sectionhead");
    head.append(el("h3", "cr-title", "Deck actuel"));

    const deck = (p.deck || []).map(normCard);
    const elixirs = deck.map((c) => c.elixir).filter((x) => typeof x === "number");
    if (elixirs.length) {
      const avg = (elixirs.reduce((a, b) => a + b, 0) / elixirs.length).toFixed(1);
      head.append(el("span", "cr-chip", `💧 Élixir moyen : ${avg}`));
    }
    box.append(head);

    const order = { evo: 0, hero: 1, normal: 2 };
    const sorted = [...(p.deck || [])].sort((a, b) => (order[normCard(a).variant] ?? 2) - (order[normCard(b).variant] ?? 2));
    const grid = el("div", "cr-deckgrid");
    sorted.forEach((c) => grid.append(cardTile(c)));
    box.append(grid);
    return box;
  }

  /* ---------- combats ---------- */
  function resultOf(b) {
    if (b.result === "win") return "win";
    if (b.result === "loss") return "loss";
    if (b.crowns > b.oppCrowns) return "win";
    if (b.crowns < b.oppCrowns) return "loss";
    return "draw";
  }

  function fmtDate(t) {
    if (!t) return "";
    const d = new Date(t);
    if (isNaN(d)) return "";
    return d.toLocaleString("fr-CH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  function miniCardEl(raw) {
    const c = normCard(raw);
    const wrap = el("div", "bd-card");
    wrap.title = c.name;
    wrap.append(picture(c.image, c.name));

    const name = el("span", "bd-card-name", c.name);
    wrap.append(name);

    const metaParts = [];
    if (has(c.level)) metaParts.push(`Niv. ${c.level}`);
    if (typeof c.elixir === "number") metaParts.push(`💧${c.elixir}`);
    if (metaParts.length) wrap.append(el("span", "bd-card-meta", metaParts.join(" · ")));

    return wrap;
  }

  function renderBattles(battles) {
    const box = el("div", "cr-card");
    const head = el("div", "cr-sectionhead");
    head.append(el("h3", "cr-title", "20 derniers combats"));
    box.append(head);

    if (!battles || !battles.length) {
      box.append(el("p", "cr-message", "Combats indisponibles pour le moment."));
      return box;
    }

    const list = battles.slice(0, 20);
    const results = list.map(resultOf);
    const w = results.filter((r) => r === "win").length;
    const l = results.filter((r) => r === "loss").length;
    let streak = 0;
    for (const r of results) { if (r === results[0] && r !== "draw") streak++; else break; }

    head.append(el("span", "cr-chip", `${w} V · ${l} D`));
    if (streak > 1) {
      head.append(el("span", "cr-chip",
        `${results[0] === "win" ? "🔥 Série de" : "💀 Série de"} ${streak} ${results[0] === "win" ? "victoires" : "défaites"}`));
    }

    // Grille 20 carrés W/L
    const strip = el("div", "cr-form20");
    list.forEach((b, i) => {
      const r = results[i];
      const tile = el("div", `cr-bt cr-bt-${r}`);
      tile.append(
        el("b", "", r === "win" ? "V" : r === "loss" ? "D" : "="),
        el("small", "", `${b.crowns ?? 0}-${b.oppCrowns ?? 0}`)
      );
      strip.append(tile);
    });
    box.append(strip);

    // Détails de tous les combats
    list.forEach((b, i) => {
      const r = results[i];
      const label = r === "win" ? "Victoire" : r === "loss" ? "Défaite" : "Égalité";
      const opp = (b.opponents || []).join(" & ") || "Inconnu";

      const detail = el("div", "cr-battle-detail");

      // En-tête du combat
      const bdHead = el("div", "bd-head");
      const resultBadge = el("span", `bd-result ${r}`, r === "win" ? "V" : r === "loss" ? "D" : "=");
      const bdInfo = el("div", "bd-info");
      bdInfo.append(
        el("h4", "", `${label} ${b.crowns ?? 0} - ${b.oppCrowns ?? 0} 👑`),
        el("p", "", `Contre ${opp}${fmtDate(b.time) ? " · " + fmtDate(b.time) : ""}`)
      );
      bdHead.append(resultBadge, bdInfo);
      detail.append(bdHead);

      // Deux decks côte à côte
      const decksWrap = el("div", "bd-decks");

      // Mon deck
      const myDeck = el("div", "bd-deck");
      myDeck.append(el("h5", "", `Ton deck (${(b.cards || []).length} cartes)`));
      const myCards = el("div", "bd-cards");
      (b.cards || []).forEach((c) => myCards.append(miniCardEl(c)));
      if (!myCards.children.length) myCards.append(el("p", "cr-message", "Deck indisponible."));
      myDeck.append(myCards);
      decksWrap.append(myDeck);

      // Deck adverse
      if (b.oppCards && b.oppCards.length) {
        const oppDeck = el("div", "bd-deck");
        oppDeck.append(el("h5", "", `Deck adverse (${b.oppCards.length} cartes)`));
        const oppCards = el("div", "bd-cards");
        b.oppCards.forEach((c) => oppCards.append(miniCardEl(c)));
        oppDeck.append(oppCards);
        decksWrap.append(oppDeck);
      }

      detail.append(decksWrap);
      box.append(detail);
    });

    return box;
  }

  /* ---------- collection (derrière un bouton) ---------- */
  const RARITY_ORDER = { champion: 0, legendary: 1, epic: 2, rare: 3, common: 4 };

  function renderCollection(p) {
    const box = el("div", "cr-card");
    const head = el("div", "cr-sectionhead");
    head.append(el("h3", "cr-title", "Toutes mes cartes"));
    box.append(head);

    if (!p.cards || !p.cards.length) {
      box.append(el("p", "cr-message", "La collection complète n'est pas disponible."));
      return box;
    }

    const all = p.cards.map(normCard);
    const maxed = all.filter((c) => c.maxed).length;
    const leveled = all.filter((c) => has(c.level));
    const avg = leveled.reduce((a, c) => a + c.level, 0) / (leveled.length || 1);

    // Chips info
    const chips = el("div", "cr-chips");
    chips.append(
      el("span", "cr-chip", `${all.length} cartes`),
      el("span", "cr-chip", `${maxed} au niveau max`),
      el("span", "cr-chip", `Niveau moyen ${avg.toFixed(1)}`)
    );
    head.append(chips);

    // Bouton toggle
    const toggle = el("button", "btn", `Voir les ${all.length} cartes`);
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "collection-panel");
    box.append(toggle);

    // Panneau caché
    const panel = el("div");
    panel.id = "collection-panel";
    panel.hidden = true;

    const bar = el("div", "cr-toolbar");

    const search = el("input");
    search.type = "search";
    search.placeholder = "Rechercher une carte…";
    search.setAttribute("aria-label", "Rechercher une carte");

    const rarity = el("select");
    rarity.setAttribute("aria-label", "Filtrer par rareté");
    [["", "Toutes raretés"], ["common", "Commune"], ["rare", "Rare"], ["epic", "Épique"],
     ["legendary", "Légendaire"], ["champion", "Champion"], ["hero", "Héros"]]
      .forEach(([v, t]) => { const o = el("option", "", t); o.value = v; rarity.append(o); });

    const sort = el("select");
    sort.setAttribute("aria-label", "Trier");
    [["level", "Niveau (haut → bas)"],
     ["levelAsc", "Niveau (bas → haut)"],
     ["elixir", "Élixir (croissant)"],
     ["elixirDesc", "Élixir (décroissant)"],
     ["rarity", "Rareté"],
     ["name", "Nom (A → Z)"],
     ["nameDesc", "Nom (Z → A)"]]
      .forEach(([v, t]) => { const o = el("option", "", t); o.value = v; sort.append(o); });

    bar.append(search, rarity, sort);

    const grid = el("div", "cr-collgrid");

    function draw() {
      const q = search.value.toLowerCase().trim();
      const list = all.filter((c) =>
        (!q || c.name.toLowerCase().includes(q)) &&
        (!rarity.value || c.rarity === rarity.value)
      );

      const by = {
        level:      (a, b) => (b.level ?? 0) - (a.level ?? 0) || a.name.localeCompare(b.name),
        levelAsc:   (a, b) => (a.level ?? 0) - (b.level ?? 0) || a.name.localeCompare(b.name),
        elixir:     (a, b) => (a.elixir ?? 0) - (b.elixir ?? 0) || a.name.localeCompare(b.name),
        elixirDesc: (a, b) => (b.elixir ?? 0) - (a.elixir ?? 0) || a.name.localeCompare(b.name),
        rarity:     (a, b) => (RARITY_ORDER[a.rarity] ?? 9) - (RARITY_ORDER[b.rarity] ?? 9) || (b.level ?? 0) - (a.level ?? 0),
        name:       (a, b) => a.name.localeCompare(b.name),
        nameDesc:   (a, b) => b.name.localeCompare(a.name),
      }[sort.value] || ((a, b) => 0);

      list.sort(by);

      if (!list.length) {
        grid.replaceChildren(el("p", "cr-empty", "Aucune carte ne correspond."));
        return;
      }
      grid.replaceChildren(...list.map(tileFromNorm));
    }

    search.addEventListener("input", draw);
    rarity.addEventListener("change", draw);
    sort.addEventListener("change", draw);

    let drawn = false;
    toggle.addEventListener("click", () => {
      const wasHidden = panel.hidden;
      panel.hidden = !wasHidden;
      toggle.setAttribute("aria-expanded", String(wasHidden));
      toggle.textContent = wasHidden ? "Masquer les cartes" : `Voir les ${all.length} cartes`;
      if (wasHidden && !drawn) { draw(); drawn = true; }
    });

    panel.append(bar, grid);
    box.append(panel);
    return box;
  }

  /* ---------- assemblage ---------- */
  function renderAll(data) {
    const wrap = el("div");
    const p = data.player;
    wrap.append(
      renderHeader(p),
      renderDeck(p),
      renderBattles(data.battles ?? p.battles),
      renderCollection(p)
    );
    return wrap;
  }

  async function fetchLive(rawTag) {
    const res = await fetch(`${WORKER_URL}?tag=${encodeURIComponent(rawTag)}`);
    if (res.status === 404) throw { user: "Aucun joueur avec ce tag." };
    if (res.status === 400) throw { user: "Tag invalide." };
    if (!res.ok) throw new Error(`Worker HTTP ${res.status}`);
    return res.json();
  }

  async function fetchStatic() {
    const res = await fetch("./data/player.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`player.json HTTP ${res.status}`);
    const player = await res.json();
    return { player, battles: player.battles || [], _static: true };
  }

  async function search(rawTag) {
    message("Recherche en cours...");
    let data;
    try {
      data = await fetchLive(rawTag);
    } catch (err) {
      if (err && err.user) return message(err.user);
      console.error("Worker injoignable :", err);
      if (rawTag.replace("#", "").toLowerCase() !== MON_TAG)
        return message("Impossible de contacter le serveur.");
      try { data = await fetchStatic(); }
      catch (err2) { console.error("player.json illisible :", err2); return message("Impossible de contacter le serveur."); }
    }
    try {
      const view = renderAll(data);
      out.replaceChildren(view);
      if (data._static) out.prepend(el("p", "cr-message", "Serveur en direct indisponible : données enregistrées affichées."));
    } catch (err) {
      console.error("Erreur d'affichage :", err, data);
      message("Les données reçues ne sont pas dans le bon format.");
    }
  }

  input.value = "#" + MON_TAG;
  search(MON_TAG);
});