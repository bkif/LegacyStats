export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'champion' | 'hero' | 'tower';
export type CardVariant = 'normal' | 'evo' | 'hero';

export interface Card {
  id: string;
  name: string;
  elixir: number;
  rarity: CardRarity;
  level?: number;
  maxLevel?: number;
  count?: number;
  variant?: CardVariant;
  image?: string;
  localImage?: string;
  evoImage?: string | null;
  heroImage?: string | null;
  description?: string;
  maxed?: boolean;
}

export interface Battle {
  id?: string;
  result: 'win' | 'loss' | 'draw';
  crowns: number;
  oppCrowns: number;
  time: string | null;
  opponents: string[];
  cards: Card[];
  oppCards?: Card[];
  mode?: string;
  trophyChange?: number | null;
}

export interface PlayerProfile {
  name: string;
  tag: string;
  level: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount?: number;
  threeCrownWins: number;
  arena?: string;
  clan?: string;
  favouriteCard?: string;
  deck: Card[];
  cards?: Card[];
  battles: Battle[];
  updated?: string;
  totalDonations?: number;
  donationsReceived?: number;
  warDayWins?: number;
  clanWarTrophies?: number;
  challengeMaxWins?: number;
  role?: string;
}

export interface SeasonChange {
  card: string;
  type: 'buff' | 'nerf' | 'rework' | 'new';
  detail: string;
}

export interface Season {
  id: string;
  label: string;
  title: string;
  date: string;
  changes: SeasonChange[];
}

export interface NewsData {
  lastUpdated: string;
  seasons: Season[];
}

export interface ClanMember {
  tag: string;
  name: string;
  role: 'leader' | 'coLeader' | 'elder' | 'member';
  roleLabel: string;
  expLevel: number;
  trophies: number;
  arena: string;
  donations: number;
  donationsReceived: number;
  rank: number;
  previousRank: number;
}

export interface ClanData {
  tag: string;
  name: string;
  description: string;
  badgeId: number;
  badgeUrl: string;
  clanScore: number;
  clanWarTrophies: number;
  location: string;
  requiredTrophies: number;
  membersCount: number;
  donationsPerWeek: number;
  members: ClanMember[];
}

export type NavTab = 'home' | 'cards' | 'description' | 'news' | 'esport' | 'clans' | 'crl' | 'contact';
