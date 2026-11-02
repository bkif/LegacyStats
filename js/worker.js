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
    const debug = url.searchParams.get("debug") === "1";

    if (!/^[0-9A-Z]{3,16}$/.test(raw))
      return new Response(JSON.stringify({ error: "tag invalide" }), { status: 400, headers: CORS });

    // ✅ Vérifie que la clé API est bien définie
    if (!env.CR_API_KEY) {
      return new Response(
        JSON.stringify({ error: "CR_API_KEY manquante dans les variables du Worker" }),
        { status: 500, headers: CORS }
      );
    }

    const headers = { Authorization: `Bearer ${env.CR_API_KEY}` };

    const [pr, br] = await Promise.all([
      fetch(`${API}/players/%23${raw}`, { headers }),
      fetch(`${API}/players/%23${raw}/battlelog`, { headers }),
    ]);

    // ✅ Debug : renvoie la réponse brute de l'API si ?debug=1
    if (debug) {
      const rawPlayer = await pr.text();
      return new Response(
        JSON.stringify({
          playerStatus: pr.status,
          playerHeaders: [...pr.headers].reduce((o, [k, v]) => ({ ...o, [k]: v }), {}),
          playerBody: rawPlayer.slice(0, 2000),
        }),
        { headers: CORS }
      );
    }

    if (pr.status === 404)
      return new Response(JSON.stringify({ error: "joueur introuvable" }), { status: 404, headers: CORS });

    if (!pr.ok)
      return new Response(
        JSON.stringify({
          error: "api a renvoyé " + pr.status,
          hint: pr.status === 403
            ? "Clé API invalide ou restreinte par IP. Va sur developer.clashroyale.com et coche 'Allow any IP'."
            : "Vérifie ta clé API dans les secrets du Worker.",
        }),
        { status: 502, headers: CORS }
      );

    const p = await pr.json();
    const log = br.ok ? await br.json() : [];

    // ✅ Vérifie que cards existe
    if (!p.cards || !Array.isArray(p.cards)) {
      return new Response(
        JSON.stringify({
          error: "player.cards absent de la réponse API",
          hint: "L'API n'a pas renvoyé la collection. Vérifie que le tag est correct et que la clé n'est pas restreinte par IP.",
          receivedKeys: Object.keys(p),
        }),
        { status: 502, headers: CORS }
      );
    }

    const battles = log.slice(0, 20).map((b) => {
      const me = b.team?.[0] ?? {};
      const opp = b.opponent?.[0] ?? {};
      const crowns = me.crowns ?? 0;
      const oppCrowns = opp.crowns ?? 0;

      return {
        result: crowns > oppCrowns ? "win" : crowns < oppCrowns ? "loss" : "draw",
        crowns,
        oppCrowns,
        time: isoTime(b.battleTime),
        opponents: (b.opponent || []).map((o) => o.name),
        cards: (me.cards || []).map(mapCard),
        oppCards: (opp.cards || []).map(mapCard),
      };
    });

    const player = {
      name: p.name,
      tag: p.tag,
      level: p.expLevel,
      trophies: p.trophies,
      bestTrophies: p.bestTrophies,
      wins: p.wins,
      losses: p.losses,
      battleCount: p.battleCount,
      threeCrownWins: p.threeCrownWins,
      totalDonations: p.totalDonations,
      donationsReceived: p.donationsReceived,
      warDayWins: p.warDayWins,
      clanWarTrophies: p.clanWarTrophies,
      challengeMaxWins: p.challengeMaxWins,
      challengeCardsWon: p.challengeCardsWon,
      tournamentBattleCount: p.tournamentBattleCount,
      tournamentCardsWon: p.tournamentCardsWon,
      role: p.role,
      arena: p.arena?.name,
      clan: p.clan?.name,
      favouriteCard: p.currentFavouriteCard?.name,
      deck: (p.currentDeck || []).map(mapCard),
      cards: p.cards.map(mapCard), // ✅ maintenant garanti non-vide
    };

    return new Response(JSON.stringify({ player, battles }), {
      headers: { ...CORS, "Cache-Control": "public, max-age=60" },
    });
  },
};