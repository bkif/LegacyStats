// src/data/playerData.ts - Clash Royale Player Profile & Battles
import { PlayerProfile } from '../types';
import { getLocalCardImage } from './cardImages';

export const DEFAULT_PLAYER: PlayerProfile = {
  name: "Tag™",
  tag: "#v9jjgll0g",
  level: 89,
  trophies: 14000,
  bestTrophies: 14000,
  wins: 58413,
  losses: 41077,
  battleCount: 99490,
  threeCrownWins: 10297,
  arena: "Spirit Square",
  clan: "TagUrTilted",
  favouriteCard: "Electro Giant",
  deck: [
    {
      id: "goblin-barrel",
      name: "Goblin Barrel",
      level: 11,
      image: "https://api-assets.clashroyale.com/cards/300/CoZdp5PpsTH858l212lAMeJxVJ0zxv9V-f5xC8Bvj5g.png",
      rarity: "epic",
      elixir: 3,
      variant: "normal",
      maxed: false
    },
    {
      id: "valkyrie",
      name: "Valkyrie",
      level: 14,
      image: "https://api-assets.clashroyale.com/cards/300/0lIoYf3Y_plFTzo95zZL93JVxpfb3MMgFDDhgSDGU9A.png",
      rarity: "rare",
      elixir: 4,
      variant: "normal",
      maxed: false
    },
    {
      id: "skeleton-army",
      name: "Skeleton Army",
      level: 11,
      image: "https://api-assets.clashroyale.com/cards/300/fAOToOi1pRy7svN2xQS6mDkhQw2pj9m_17FauaNqyl4.png",
      rarity: "epic",
      elixir: 3,
      variant: "normal",
      maxed: false
    },
    {
      id: "wall-breakers",
      name: "Wall Breakers",
      level: 11,
      image: "https://api-assets.clashroyale.com/cards/300/_xPphEfC8eEwFNrfU3cMQG9-f5JaLQ31ARCA7l3XtW4.png",
      rarity: "epic",
      elixir: 2,
      variant: "normal",
      maxed: false
    },
    {
      id: "princess",
      name: "Princess",
      level: 8,
      image: "https://api-assets.clashroyale.com/cards/300/bAwMcqp9EKVIKH3ZLm_m0MqZFSG72zG-vKxpx8aKoVs.png",
      rarity: "legendary",
      elixir: 3,
      variant: "normal",
      maxed: false
    },
    {
      id: "dart-goblin",
      name: "Dart Goblin",
      level: 14,
      image: "https://api-assets.clashroyale.com/cards/300/BmpK3bqEAviflqHCdxxnfm-_l3pRPJw3qxHkwS55nCY.png",
      rarity: "rare",
      elixir: 3,
      variant: "normal",
      maxed: false
    },
    {
      id: "ice-spirit",
      name: "Ice Spirit",
      level: 16,
      image: "https://api-assets.clashroyale.com/cards/300/lv1budiafU9XmSdrDkk0NYyqASAFYyZ06CPysXKZXlA.png",
      rarity: "common",
      elixir: 1,
      variant: "normal",
      maxed: true
    },
    {
      id: "cannon",
      name: "Cannon",
      level: 16,
      image: "https://api-assets.clashroyale.com/cards/300/nZK1y-beLxO5vnlyUhK6-2zH2NzXJwqykcosqQ1cmZ8.png",
      rarity: "common",
      elixir: 3,
      variant: "normal",
      maxed: true
    }
  ],
  cards: [
    { id: "goblin-barrel", name: "Goblin Barrel", level: 11, rarity: "epic", elixir: 3, image: getLocalCardImage("Goblin Barrel") },
    { id: "valkyrie", name: "Valkyrie", level: 14, rarity: "rare", elixir: 4, image: getLocalCardImage("Valkyrie") },
    { id: "skeleton-army", name: "Skeleton Army", level: 11, rarity: "epic", elixir: 3, image: getLocalCardImage("Skeleton Army") },
    { id: "wall-breakers", name: "Wall Breakers", level: 11, rarity: "epic", elixir: 2, image: getLocalCardImage("Wall Breakers") },
    { id: "princess", name: "Princess", level: 14, rarity: "legendary", elixir: 3, image: getLocalCardImage("Princess") },
    { id: "dart-goblin", name: "Dart Goblin", level: 14, rarity: "rare", elixir: 3, image: getLocalCardImage("Dart Goblin") },
    { id: "ice-spirit", name: "Ice Spirit", level: 16, rarity: "common", elixir: 1, image: getLocalCardImage("Ice Spirit"), maxed: true },
    { id: "cannon", name: "Cannon", level: 16, rarity: "common", elixir: 3, image: getLocalCardImage("Cannon"), maxed: true },
    { id: "the-log", name: "The Log", level: 15, rarity: "legendary", elixir: 2, image: getLocalCardImage("The Log") },
    { id: "hog-rider", name: "Hog Rider", level: 15, rarity: "rare", elixir: 4, image: getLocalCardImage("Hog Rider") },
    { id: "fireball", name: "Fireball", level: 15, rarity: "rare", elixir: 4, image: getLocalCardImage("Fireball") },
    { id: "musketeer", name: "Musketeer", elixir: 4, rarity: "rare", level: 15, image: getLocalCardImage("Musketeer") },
    { id: "skeletons", name: "Skeletons", elixir: 1, rarity: "common", level: 15, image: getLocalCardImage("Skeletons") },
    { id: "ice-golem", name: "Ice Golem", elixir: 2, rarity: "rare", level: 14, image: getLocalCardImage("Ice Golem") },
    { id: "knight", name: "Knight", elixir: 3, rarity: "common", level: 15, image: getLocalCardImage("Knight") },
    { id: "archers", name: "Archers", elixir: 3, rarity: "common", level: 14, image: getLocalCardImage("Archers") },
    { id: "electro-giant", name: "Electro Giant", elixir: 7, rarity: "epic", level: 15, image: getLocalCardImage("Electro Giant") },
    { id: "mega-knight", name: "Mega Knight", elixir: 7, rarity: "legendary", level: 15, image: getLocalCardImage("Mega Knight") },
    { id: "pekka", name: "P.E.K.K.A", elixir: 7, rarity: "epic", level: 15, image: getLocalCardImage("P.E.K.K.A") },
    { id: "balloon", name: "Balloon", elixir: 5, rarity: "epic", level: 15, image: getLocalCardImage("Balloon") },
    { id: "miner", name: "Miner", elixir: 3, rarity: "legendary", level: 15, image: getLocalCardImage("Miner") },
    { id: "little-prince", name: "Little Prince", elixir: 3, rarity: "champion", level: 14, image: getLocalCardImage("Little Prince") }
  ],
  battles: [
    {
      id: "b1",
      result: "win",
      crowns: 2,
      oppCrowns: 1,
      time: "2026-11-02T19:42:00.000Z",
      opponents: ["Lucas_CR 🇨🇭"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "Hog Rider", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Hog Rider") },
        { id: "oc2", name: "Fireball", level: 15, elixir: 4, rarity: "rare", image: getLocalCardImage("Fireball") },
        { id: "oc3", name: "The Log", level: 14, elixir: 2, rarity: "legendary", image: getLocalCardImage("The Log") },
        { id: "oc4", name: "Musketeer", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Musketeer") },
        { id: "oc5", name: "Ice Golem", level: 14, elixir: 2, rarity: "rare", image: getLocalCardImage("Ice Golem") },
        { id: "oc6", name: "Skeletons", level: 14, elixir: 1, rarity: "common", image: getLocalCardImage("Skeletons") },
        { id: "oc7", name: "Cannon", level: 14, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") },
        { id: "oc8", name: "Ice Spirit", level: 14, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") }
      ]
    },
    {
      id: "b2",
      result: "win",
      crowns: 3,
      oppCrowns: 0,
      time: "2026-11-02T19:28:00.000Z",
      opponents: ["SwissKing99"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "Mega Knight", level: 15, elixir: 7, rarity: "legendary", image: getLocalCardImage("Mega Knight") },
        { id: "oc2", name: "Bats", level: 14, elixir: 2, rarity: "common", image: getLocalCardImage("Bats") },
        { id: "oc3", name: "Miner", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Miner") },
        { id: "oc4", name: "Inferno Dragon", level: 14, elixir: 4, rarity: "legendary", image: getLocalCardImage("Inferno Dragon") },
        { id: "oc5", name: "Zap", level: 14, elixir: 2, rarity: "common", image: getLocalCardImage("Zap") },
        { id: "oc6", name: "Skeleton Barrel", level: 14, elixir: 3, rarity: "common", image: getLocalCardImage("Skeleton Barrel") },
        { id: "oc7", name: "Goblin Gang", level: 14, elixir: 3, rarity: "common", image: getLocalCardImage("Goblin Gang") },
        { id: "oc8", name: "Spear Goblins", level: 14, elixir: 2, rarity: "common", image: getLocalCardImage("Spear Goblins") }
      ]
    },
    {
      id: "b3",
      result: "loss",
      crowns: 1,
      oppCrowns: 2,
      time: "2026-11-02T18:50:00.000Z",
      opponents: ["Vortex_Master"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "Golem", level: 15, elixir: 8, rarity: "epic", image: getLocalCardImage("Golem") },
        { id: "oc2", name: "Night Witch", level: 14, elixir: 4, rarity: "legendary", image: getLocalCardImage("Night Witch") },
        { id: "oc3", name: "Lightning", level: 15, elixir: 6, rarity: "epic", image: getLocalCardImage("Lightning") },
        { id: "oc4", name: "Baby Dragon", level: 14, elixir: 4, rarity: "epic", image: getLocalCardImage("Baby Dragon") },
        { id: "oc5", name: "Tornado", level: 14, elixir: 3, rarity: "epic", image: getLocalCardImage("Tornado") },
        { id: "oc6", name: "Lumberjack", level: 14, elixir: 4, rarity: "legendary", image: getLocalCardImage("Lumberjack") },
        { id: "oc7", name: "Electro Dragon", level: 14, elixir: 5, rarity: "epic", image: getLocalCardImage("Electro Dragon") },
        { id: "oc8", name: "Barbarian Barrel", level: 14, elixir: 2, rarity: "epic", image: getLocalCardImage("Barbarian Barrel") }
      ]
    },
    {
      id: "b4",
      result: "win",
      crowns: 1,
      oppCrowns: 0,
      time: "2026-11-02T18:15:00.000Z",
      opponents: ["AlpinePro"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "X-Bow", level: 15, elixir: 6, rarity: "epic", image: getLocalCardImage("X-Bow") },
        { id: "oc2", name: "Tesla", level: 15, elixir: 4, rarity: "common", image: getLocalCardImage("Tesla") },
        { id: "oc3", name: "Archers", level: 14, elixir: 3, rarity: "common", image: getLocalCardImage("Archers") },
        { id: "oc4", name: "Knight", level: 15, elixir: 3, rarity: "common", image: getLocalCardImage("Knight") },
        { id: "oc5", name: "Fireball", level: 15, elixir: 4, rarity: "rare", image: getLocalCardImage("Fireball") },
        { id: "oc6", name: "The Log", level: 14, elixir: 2, rarity: "legendary", image: getLocalCardImage("The Log") },
        { id: "oc7", name: "Skeletons", level: 14, elixir: 1, rarity: "common", image: getLocalCardImage("Skeletons") },
        { id: "oc8", name: "Ice Spirit", level: 14, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") }
      ]
    },
    {
      id: "b5",
      result: "win",
      crowns: 2,
      oppCrowns: 0,
      time: "2026-11-02T17:40:00.000Z",
      opponents: ["GenevaStriker"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "P.E.K.K.A", level: 15, elixir: 7, rarity: "epic", image: getLocalCardImage("P.E.K.K.A") },
        { id: "oc2", name: "Battle Ram", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Battle Ram") },
        { id: "oc3", name: "Bandit", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Bandit") },
        { id: "oc4", name: "Royal Ghost", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Royal Ghost") },
        { id: "oc5", name: "Electro Wizard", level: 14, elixir: 4, rarity: "legendary", image: getLocalCardImage("Electro Wizard") },
        { id: "oc6", name: "Magic Archer", level: 14, elixir: 4, rarity: "legendary", image: getLocalCardImage("Magic Archer") },
        { id: "oc7", name: "Poison", level: 15, elixir: 4, rarity: "epic", image: getLocalCardImage("Poison") },
        { id: "oc8", name: "Zap", level: 14, elixir: 2, rarity: "common", image: getLocalCardImage("Zap") }
      ]
    },
    {
      id: "b6",
      result: "loss",
      crowns: 0,
      oppCrowns: 1,
      time: "2026-11-02T16:55:00.000Z",
      opponents: ["ElectroChamp"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "Electro Giant", level: 15, elixir: 7, rarity: "epic", image: getLocalCardImage("Electro Giant") },
        { id: "oc2", name: "Lightning", level: 15, elixir: 6, rarity: "epic", image: getLocalCardImage("Lightning") },
        { id: "oc3", name: "Tornado", level: 14, elixir: 3, rarity: "epic", image: getLocalCardImage("Tornado") },
        { id: "oc4", name: "Cannon Cage", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Goblin Cage") },
        { id: "oc5", name: "Baby Dragon", level: 14, elixir: 4, rarity: "epic", image: getLocalCardImage("Baby Dragon") },
        { id: "oc6", name: "Dark Prince", level: 14, elixir: 4, rarity: "epic", image: getLocalCardImage("Dark Prince") },
        { id: "oc7", name: "Bomber", level: 14, elixir: 2, rarity: "common", image: getLocalCardImage("Bomber") },
        { id: "oc8", name: "Golden Knight", level: 14, elixir: 4, rarity: "champion", image: getLocalCardImage("Golden Knight") }
      ]
    },
    {
      id: "b7",
      result: "win",
      crowns: 3,
      oppCrowns: 1,
      time: "2026-11-02T16:20:00.000Z",
      opponents: ["ZurichClasher"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "Royal Giant", level: 15, elixir: 6, rarity: "common", image: getLocalCardImage("Royal Giant") },
        { id: "oc2", name: "Fisherman", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Fisherman") },
        { id: "oc3", name: "Hunter", level: 14, elixir: 4, rarity: "epic", image: getLocalCardImage("Hunter") },
        { id: "oc4", name: "Lightning", level: 15, elixir: 6, rarity: "epic", image: getLocalCardImage("Lightning") },
        { id: "oc5", name: "The Log", level: 14, elixir: 2, rarity: "legendary", image: getLocalCardImage("The Log") },
        { id: "oc6", name: "Electro Spirit", level: 14, elixir: 1, rarity: "common", image: getLocalCardImage("Electro Spirit") },
        { id: "oc7", name: "Skeletons", level: 14, elixir: 1, rarity: "common", image: getLocalCardImage("Skeletons") },
        { id: "oc8", name: "Monk", level: 14, elixir: 5, rarity: "champion", image: getLocalCardImage("Monk") }
      ]
    },
    {
      id: "b8",
      result: "draw",
      crowns: 1,
      oppCrowns: 1,
      time: "2026-11-02T15:45:00.000Z",
      opponents: ["BernTitan"],
      cards: [
        { id: "c1", name: "Goblin Barrel", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Goblin Barrel") },
        { id: "c2", name: "Valkyrie", level: 14, elixir: 4, rarity: "rare", image: getLocalCardImage("Valkyrie") },
        { id: "c3", name: "Skeleton Army", level: 11, elixir: 3, rarity: "epic", image: getLocalCardImage("Skeleton Army") },
        { id: "c4", name: "Wall Breakers", level: 11, elixir: 2, rarity: "epic", image: getLocalCardImage("Wall Breakers") },
        { id: "c5", name: "Princess", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Princess") },
        { id: "c6", name: "Dart Goblin", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Dart Goblin") },
        { id: "c7", name: "Ice Spirit", level: 16, elixir: 1, rarity: "common", image: getLocalCardImage("Ice Spirit") },
        { id: "c8", name: "Cannon", level: 16, elixir: 3, rarity: "common", image: getLocalCardImage("Cannon") }
      ],
      oppCards: [
        { id: "oc1", name: "Graveyard", level: 15, elixir: 5, rarity: "legendary", image: getLocalCardImage("Graveyard") },
        { id: "oc2", name: "Poison", level: 15, elixir: 4, rarity: "epic", image: getLocalCardImage("Poison") },
        { id: "oc3", name: "Baby Dragon", level: 14, elixir: 4, rarity: "epic", image: getLocalCardImage("Baby Dragon") },
        { id: "oc4", name: "Knight", level: 15, elixir: 3, rarity: "common", image: getLocalCardImage("Knight") },
        { id: "oc5", name: "Tombstone", level: 14, elixir: 3, rarity: "rare", image: getLocalCardImage("Tombstone") },
        { id: "oc6", name: "Tornado", level: 14, elixir: 3, rarity: "epic", image: getLocalCardImage("Tornado") },
        { id: "oc7", name: "Barbarian Barrel", level: 14, elixir: 2, rarity: "epic", image: getLocalCardImage("Barbarian Barrel") },
        { id: "oc8", name: "Ice Wizard", level: 14, elixir: 3, rarity: "legendary", image: getLocalCardImage("Ice Wizard") }
      ]
    }
  ],
  updated: "2026-10-27T09:04:04.139Z"
};
