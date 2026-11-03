const ALLOWED_ORIGIN = "*";
const API_PLAYERS = "https://proxy.royaleapi.dev/v1/players/";
const API_CARDS = "https://proxy.royaleapi.dev/v1/cards";

function reply(body, status, cors, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}

// niveau affiché dans le jeu (max 16)
const lvl = (c) => (c.level ?? 0) + (16 - (c.maxLevel ?? 16));
const toIso = (t) =>
  t && t.length >= 15
    ? `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}T${t.slice(9, 11)}:${t.slice(11, 13)}:${t.slice(13, 15)}Z`
    : null;

// carte "de base" (collection : evo / hero = débloqués)
const card = (c) => {
  const lv = c.evolutionLevel ?? 0;
  const evoImage = c.iconUrls?.evolutionMedium ?? null;
  const heroImage = c.iconUrls?.heroMedium ?? null;
  return {
    id: c.id,
    name: c.name,
    level: lvl(c),
    rarity: c.rarity,
    elixir: c.elixirCost ?? null,
    count: c.count ?? 0,
    evo: (lv & 1) === 1 && !!evoImage,
    hero: (lv & 2) === 2 && !!heroImage,
    image: c.iconUrls?.medium,
    evoImage,
    heroImage,
  };
};

// variante réellement jouée (valeur evolutionLevel d'un combat)
const variantOf = (c, lv) => {
  if ((lv & 1) === 1 && c.iconUrls?.evolutionMedium) return "evo";
  if ((lv & 2) === 2 && c.iconUrls?.heroMedium) return "hero";
  return "normal";
};

// si aucun combat ne permet de savoir : on devine d'après les emplacements du jeu
function guessVariant(c, i) {
  const lv = c.evolutionLevel ?? 0;
  const canEvo = (lv & 1) === 1 && !!c.iconUrls?.evolutionMedium;
  const canHero = (lv & 2) === 2 && !!c.iconUrls?.heroMedium;
  if (i === 0) return canEvo ? "evo" : canHero ? "hero" : "normal";
  if (i === 1) return canHero ? "hero" : canEvo ? "evo" : "normal";
  if (i === 2) return canEvo ? "evo" : canHero ? "hero" : "normal";
  return "normal";
}

const league = (r) =>
  r ? { league: r.leagueNumber, trophies: r.trophies, rank: r.rank ?? null } : null;

const safeJson = async (res) => {
  try {
    return res && res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const idsKey = (arr) => arr.map((c) => c.id).sort((a, b) => a - b).join(",");

// ===== NORMALISATION DES CARTES API =====
function normalizeCards(apiItems) {
  return apiItems.map((c) => ({
    id: c.id,
    name: c.name,
    elixir: c.elixirCost ?? 0,
    rarity: (c.rarity ?? "common").toLowerCase(),
    maxLevel: c.maxLevel ?? 16,
    image: c.iconUrls?.medium ?? "",
    evoImage: c.iconUrls?.evolutionMedium ?? null,
    heroImage: c.iconUrls?.heroMedium ?? null,
    type: null,
    description: null,
  }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const url = new URL(request.url);

    // ============================================================
    // ROUTE IMAGE PROXY — /?image=URL
    // ============================================================
    const imageUrl = url.searchParams.get("image");
    if (imageUrl) {
      try {
        const remote = await fetch(imageUrl, { cf: { image: { quality: 80, fit: "scale-down" } } });
        if (!remote.ok) {
          return new Response("Image introuvable", { status: 404, headers: { ...cors, "Content-Type": "text/plain" } });
        }
        const body = await remote.arrayBuffer();
        return new Response(body, {
          headers: {
            ...cors,
            "Content-Type": remote.headers.get("Content-Type") || "image/png",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      } catch {
        return new Response("Image indisponible", { status: 502, headers: { ...cors, "Content-Type": "text/plain" } });
      }
    }

    // ============================================================
    // ROUTE /cards — proxy vers l'API officielle /v1/cards
    // ============================================================
    if (url.pathname === "/cards") {
      try {
        const res = await fetch(API_CARDS, {
          headers: { Authorization: `Bearer ${env.CR_API_KEY}` },
        });
        if (!res.ok) {
          return reply({ error: `API ${res.status}` }, res.status, cors);
        }
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        return reply(
          { cards: normalizeCards(items) },
          200,
          cors,
          { "Cache-Control": "public, max-age=86400" }
        );
      } catch (err) {
        return reply({ error: "Serveur injoignable" }, 502, cors);
      }
    }

    // ============================================================
    // ROUTE JOUEUR — /?tag=XXXX
    // ============================================================
    const raw = url.searchParams.get("tag") ?? "";
    const tag = raw.replace("#", "").trim().toUpperCase();
    if (!/^[0289PYLQGRJCUV]{3,15}$/.test(tag)) {
      return reply({ error: "Tag invalide" }, 400, cors);
    }

    const headers = { Authorization: `Bearer ${env.CR_API_KEY}` };
    const get = (suffix) =>
      fetch(`${API_PLAYERS}%23${tag}${suffix}`, { headers }).catch(() => null);

    const [pRes, bRes, cRes] = await Promise.all([
      get(""),
      get("/battlelog"),
      get("/upcomingchests"),
    ]);

    if (!pRes) return reply({ error: "Serveur injoignable" }, 502, cors);
    const p = await pRes.json();
    if (!pRes.ok) return reply(p, pRes.status, cors);

    const log = (await safeJson(bRes)) ?? [];
    const rawLog = Array.isArray(log) ? log : [];
    const chests = ((await safeJson(cRes))?.items ?? []).map((i) => i.name);
    const meOf = (b) => b.team?.find((t) => t.tag === p.tag) ?? b.team?.[0] ?? {};

    const battles = rawLog.slice(0, 20).map((b) => {
      const me = meOf(b);
      const opp = b.opponent ?? [];
      const oppCrowns = opp[0]?.crowns ?? 0;
      const meCrowns = me.crowns ?? 0;
      const oppCardsRaw = opp[0]?.cards || opp[0]?.deck || [];

      return {
        time: toIso(b.battleTime),
        mode: b.gameMode?.name ?? b.type,
        result: meCrowns > oppCrowns ? "win" : meCrowns < oppCrowns ? "loss" : "draw",
        crowns: meCrowns,
        oppCrowns,
        trophyChange: me.trophyChange ?? null,
        opponents: opp.map((o) => o.name),
        cards: (me.cards ?? []).map((c) => ({
          ...card(c),
          variant: variantOf(c, c.evolutionLevel ?? 0),
        })),
        oppCards: oppCardsRaw.map((c) => ({
          ...card(c),
          variant: variantOf(c, c.evolutionLevel ?? 0),
        })),
      };
    });

    // deck actuel : on repère le dernier combat joué avec exactement ce deck
    const rawDeck = p.currentDeck ?? [];
    const deckKey = idsKey(rawDeck);
    let equipped = null;
    for (const b of rawLog) {
      const cards = meOf(b)?.cards ?? [];
      if (idsKey(cards) === deckKey) {
        equipped = cards;
        break;
      }
    }
    const deck = rawDeck.map((c, i) => {
      const variant = equipped
        ? variantOf(c, equipped.find((x) => x.id === c.id)?.evolutionLevel ?? 0)
        : guessVariant(c, i);
      return { ...card(c), variant };
    });

    return reply(
      {
        player: {
          name: p.name,
          tag: p.tag,
          level: p.expLevel,
          trophies: p.trophies,
          bestTrophies: p.bestTrophies,
          wins: p.wins,
          losses: p.losses,
          threeCrownWins: p.threeCrownWins,
          battleCount: p.battleCount,
          kingTowerLevel: p.kingTowerLevel,
          collectionLevel: p.collectionLevel,
          totalDonations: p.totalDonations,
          warDayWins: p.warDayWins,
          challengeMaxWins: p.challengeMaxWins,
          streak: p.currentWinLoseStreak ?? 0,
          role: p.role ?? null,
          clan: p.clan?.name ?? null,
          arena: p.arena?.name ?? null,
          favouriteCard: p.currentFavouriteCard?.name ?? null,
          deck,
          deckFromBattle: !!equipped,
          tower: (p.currentDeckSupportCards ?? []).map(card),
        },
        ranked: {
          current: league(p.currentPathOfLegendSeasonResult),
          last: league(p.lastPathOfLegendSeasonResult),
          best: league(p.bestPathOfLegendSeasonResult),
        },
        cards: (p.cards ?? []).map(card),
        badges: (p.badges ?? []).map((b) => ({
          name: b.name,
          level: b.level ?? null,
          maxLevel: b.maxLevel ?? null,
          progress: b.progress ?? 0,
          target: b.target ?? null,
          image: b.iconUrls?.large ?? "",
        })),
        chests,
        battles,
      },
      200,
      cors,
      { "Cache-Control": "public, max-age=60" }
    );
  },
};
