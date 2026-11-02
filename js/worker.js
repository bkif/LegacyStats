const API = "https://proxy.royaleapi.dev/v1";
const CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json; charset=utf-8" };

const mapCard = (c) => ({
  name: c.name,
  level: c.level,
  maxLevel: c.maxLevel,
  rarity: c.rarity,
  elixir: c.elixirCost,
  count: c.count,
  variant: c.evolutionLevel > 0 ? "evo" : "normal",
  image: c.iconUrls?.medium,
  evoImage: c.iconUrls?.evolutionMedium,
  heroImage: c.iconUrls?.heroMedium,
});

const isoTime = (t) =>
  t ? t.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6") : null;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS")
      return new Response(null, { headers: { ...CORS, "Access-Control-Allow-Methods": "GET, OPTIONS" } });

    const url = new URL(request.url);
    const raw = (url.searchParams.get("tag") || "").replace(/^#/, "").toUpperCase();

    if (!/^[0-9A-Z]{3,16}$/.test(raw))
      return new Response(JSON.stringify({ error: "tag invalide" }), { status: 400, headers: CORS });

    if (!env.CR_API_KEY)
      return new Response(JSON.stringify({ error: "CR_API_KEY manquante" }), { status: 500, headers: CORS });

    const headers = { Authorization: `Bearer ${env.CR_API_KEY}` };

    const [pr, br] = await Promise.all([
      fetch(`${API}/players/%23${raw}`, { headers }),
      fetch(`${API}/players/%23${raw}/battlelog`, { headers }),
    ]);

    if (pr.status === 404)
      return new Response(JSON.stringify({ error: "introuvable" }), { status: 404, headers: CORS });
    if (!pr.ok)
      return new Response(JSON.stringify({ error: "api" }), { status: 502, headers: CORS });

    const p = await pr.json();
    const log = br.ok ? await br.json() : [];

    const battles = log.slice(0, 20).map((b) => {
      const me = b.team?.[0] ?? {};
      const opp = b.opponent?.[0] ?? {};
      
      const crowns = me.crowns ?? 0;
      const oppCrowns = opp.crowns ?? 0;

      // 🛡️ Extraction ultra-robuste des cartes adverses
      // On fouille dans opp.cards, opp.deck, opp.team[0].cards ET on gère le cas 2v2
      let oppCardsRaw = [];
      if (b.opponent && Array.isArray(b.opponent)) {
          // Si c'est un combat 2v2, on récupère les cartes de TOUS les adversaires
          oppCardsRaw = b.opponent.flatMap(o => o.cards || o.deck || o.team?.[0]?.cards || []);
      } else if (b.opponent) {
          oppCardsRaw = b.opponent.cards || b.opponent.deck || [];
      }

      return {
        result: crowns > oppCrowns ? "win" : crowns < oppCrowns ? "loss" : "draw",
        crowns,
        oppCrowns,
        time: isoTime(b.battleTime),
        opponents: (b.opponent || []).map((o) => o.name),
        cards: (me.cards || me.deck || []).map(mapCard),
        oppCards: oppCardsRaw.map(mapCard),
      };
    });

    const player = {
      name: p.name, tag: p.tag, level: p.expLevel, trophies: p.trophies, bestTrophies: p.bestTrophies,
      wins: p.wins, losses: p.losses, battleCount: p.battleCount, threeCrownWins: p.threeCrownWins,
      totalDonations: p.totalDonations, donationsReceived: p.donationsReceived, warDayWins: p.warDayWins,
      clanWarTrophies: p.clanWarTrophies, challengeMaxWins: p.challengeMaxWins, challengeCardsWon: p.challengeCardsWon,
      tournamentBattleCount: p.tournamentBattleCount, tournamentCardsWon: p.tournamentCardsWon,
      role: p.role, arena: p.arena?.name, clan: p.clan?.name, favouriteCard: p.currentFavouriteCard?.name,
      deck: (p.currentDeck || []).map(mapCard),
      cards: (p.cards || []).map(mapCard),
    };

    return new Response(JSON.stringify({ player, battles }), {
      headers: { ...CORS, "Cache-Control": "public, max-age=60" },
    });
  },
};