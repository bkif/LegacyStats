// Récupère le profil, toutes les cartes et les 20 derniers combats, puis écrit data/player.json
const fs = require("fs");

const TAG = "v9jjgll0g";
const API = "https://proxy.royaleapi.dev/v1";
const headers = { Authorization: `Bearer ${process.env.CR_API_KEY}` };

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

// "20260101T120000.000Z" -> "2026-01-01T12:00:00.000Z"
const isoTime = (t) => (t ? t.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6") : null);

(async () => {
  const [pr, br] = await Promise.all([
    fetch(`${API}/players/%23${TAG}`, { headers }),
    fetch(`${API}/players/%23${TAG}/battlelog`, { headers }),
  ]);
  if (!pr.ok) throw new Error(`Erreur API joueur : ${pr.status}`);
  const p = await pr.json();
  const log = br.ok ? await br.json() : [];

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
    cards: (p.cards || []).map(mapCard),
    battles,
    updated: new Date().toISOString(),
  };

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/player.json", JSON.stringify(player, null, 2));
})();
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