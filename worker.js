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
      
      // ✅ Extraction CORRIGÉE de l'adversaire
      // L'API met l'adversaire dans b.opponent.players[0] (et non b.opponent[0])
      let opp = {};
      if (b.opponent) {
        if (Array.isArray(b.opponent)) {
          opp = b.opponent[0] ?? {}; // Ancien format ou 2v2
        } else if (b.opponent.players && Array.isArray(b.opponent.players)) {
          opp = b.opponent.players[0] ?? {}; // Format actuel de l'API
        } else {
          opp = b.opponent; // Fallback
        }
      }

      const crowns = me.crowns ?? 0;
      const oppCrowns = opp.crowns ?? 0;

      // ✅ Le joueur a "cards", l'adversaire a "deck"
      const myCardsRaw = me.cards || me.deck || [];
      const oppCardsRaw = opp.cards || opp.deck || [];

      return {
        result: crowns > oppCrowns ? "win" : crowns < oppCrowns ? "loss" : "draw",
        crowns,
        oppCrowns,
        time: isoTime(b.battleTime),
        opponents: (b.opponent?.players || b.opponent || []).map((o) => o.name),
        cards: myCardsRaw.map(mapCard),
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