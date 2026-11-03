// src/data/cardImages.ts - High-resolution RoyaleAPI CDN mapping and SVG fallback

export const CARD_SLUG_MAP: Record<string, string> = {
  "skeletons": "skeletons",
  "ice spirit": "ice-spirit",
  "fire spirit": "fire-spirit",
  "electro spirit": "electro-spirit",
  "heal spirit": "heal-spirit",
  "goblins": "goblins",
  "spear goblins": "spear-goblins",
  "bats": "bats",
  "zap": "zap",
  "giant snowball": "giant-snowball",
  "archers": "archers",
  "arrows": "arrows",
  "knight": "knight",
  "minions": "minions",
  "cannon": "cannon",
  "bomber": "bomber",
  "skeleton barrel": "skeleton-barrel",
  "firecracker": "firecracker",
  "royal delivery": "royal-delivery",
  "mortar": "mortar",
  "tesla": "tesla",
  "barbarians": "barbarians",
  "minion horde": "minion-horde",
  "rascals": "rascals",
  "royal giant": "royal-giant",
  "elite barbarians": "elite-barbarians",
  "royal recruits": "royal-recruits",
  "ice golem": "ice-golem",
  "tombstone": "tombstone",
  "mega minion": "mega-minion",
  "dart goblin": "dart-goblin",
  "earthquake": "earthquake",
  "elixir golem": "elixir-golem",
  "valkyrie": "valkyrie",
  "musketeer": "musketeer",
  "mini pekka": "mini-pekka",
  "mini p.e.k.k.a": "mini-pekka",
  "hog rider": "hog-rider",
  "battle ram": "battle-ram",
  "bomb tower": "bomb-tower",
  "flying machine": "flying-machine",
  "battle healer": "battle-healer",
  "furnace": "furnace",
  "goblin cage": "goblin-cage",
  "fireball": "fireball",
  "zappies": "zappies",
  "giant": "giant",
  "goblin hut": "goblin-hut",
  "inferno tower": "inferno-tower",
  "royal hogs": "royal-hogs",
  "rocket": "rocket",
  "barbarian hut": "barbarian-hut",
  "elixir collector": "elixir-collector",
  "three musketeers": "three-musketeers",
  "mirror": "mirror",
  "barbarian barrel": "barbarian-barrel",
  "wall breakers": "wall-breakers",
  "rage": "rage",
  "skeleton army": "skeleton-army",
  "guards": "guards",
  "goblin barrel": "goblin-barrel",
  "tornado": "tornado",
  "clone": "clone",
  "baby dragon": "baby-dragon",
  "dark prince": "dark-prince",
  "hunter": "hunter",
  "freeze": "freeze",
  "poison": "poison",
  "witch": "witch",
  "balloon": "balloon",
  "prince": "prince",
  "bowler": "bowler",
  "executioner": "executioner",
  "cannon cart": "cannon-cart",
  "electro dragon": "electro-dragon",
  "giant skeleton": "giant-skeleton",
  "lightning": "lightning",
  "x-bow": "x-bow",
  "pekka": "pekka",
  "p.e.k.k.a": "pekka",
  "electro giant": "electro-giant",
  "golem": "golem",
  "the log": "the-log",
  "log": "the-log",
  "miner": "miner",
  "princess": "princess",
  "ice wizard": "ice-wizard",
  "royal ghost": "royal-ghost",
  "bandit": "bandit",
  "fisherman": "fisherman",
  "electro wizard": "electro-wizard",
  "inferno dragon": "inferno-dragon",
  "phoenix": "phoenix",
  "magic archer": "magic-archer",
  "lumberjack": "lumberjack",
  "night witch": "night-witch",
  "mother witch": "mother-witch",
  "ram rider": "ram-rider",
  "graveyard": "graveyard",
  "sparky": "sparky",
  "mega knight": "mega-knight",
  "lava hound": "lava-hound",
  "golden knight": "golden-knight",
  "skeleton king": "skeleton-king",
  "mighty miner": "mighty-miner",
  "archer queen": "archer-queen",
  "monk": "monk",
  "little prince": "little-prince",
  "goblinstein": "goblinstein",
  "boss bandit": "bandit",
  "spirit empress": "royal-ghost",
  "goblin gang": "goblin-gang",
  "goblin drill": "goblin-drill",
  "goblin giant": "goblin-giant"
};

export const FALLBACK_LOGO = "https://cdn.royaleapi.com/static/img/branding/cr-logo/cr-logo-150.png";

export function getCardSlug(name: string): string {
  if (!name) return "knight";
  const clean = String(name).toLowerCase().trim().replace(/[-_.]+/g, " ").replace(/\s+/g, " ");
  if (CARD_SLUG_MAP[clean]) {
    return CARD_SLUG_MAP[clean];
  }
  for (const [key, slug] of Object.entries(CARD_SLUG_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return slug;
    }
  }
  return clean.replace(/[^a-z0-9]+/g, "-");
}

export function getFallbackCardImage(name: string): string {
  const slug = getCardSlug(name);
  return `https://cdn.royaleapi.com/static/img/cards-150/${slug}.png`;
}

// Alias historique pour rétrocompatibilité (utilise le CDN en ligne, aucune image locale nécessaire)
export const getLocalCardImage = getFallbackCardImage;

export function createCardSvgFallback(cardName: string = "Carte", color: string = "#f7c75a"): string {
  const label = String(cardName).slice(0, 14) || "Carte";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 210"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#090d16"/></linearGradient><linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${color}"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="${color}"/></linearGradient></defs><rect width="160" height="210" rx="18" fill="url(#bg)" stroke="url(#rim)" stroke-width="4"/><circle cx="80" cy="85" r="42" fill="${color}" opacity="0.12"/><polygon points="80,50 115,85 80,120 45,85" fill="${color}" opacity="0.35"/><text x="50%" y="160" dominant-baseline="middle" text-anchor="middle" font-size="14" font-family="'Nunito', sans-serif" fill="#ffffff" font-weight="800">${label}</text><circle cx="24" cy="24" r="14" fill="#ec4899" stroke="#fff" stroke-width="1.5"/><text x="24" y="28" dominant-baseline="middle" text-anchor="middle" font-size="13" font-family="'Bungee', sans-serif" fill="#fff" font-weight="900">⚡</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
