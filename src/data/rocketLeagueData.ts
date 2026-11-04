import { RlPlayerProfile } from '../types';

export const RAPIDAPI_KEY = "dcffce928bmsh3a16fcdbd80cce3p19df42jsn5b6702c9098b";
export const RAPIDAPI_HOST = "rocket-league1.p.rapidapi.com";

export async function fetchLiveRocketLeagueProfile(username: string): Promise<Partial<RlPlayerProfile> | null> {
  try {
    const encodedUser = encodeURIComponent(username.trim());
    const res = await fetch(`https://${RAPIDAPI_HOST}/ranks/${encodedUser}`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'User-Agent': 'LEGACYSTATS/1.0'
      }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export const POPULAR_RL_PLAYERS: Record<string, RlPlayerProfile> = {
  zen: {
    name: 'Zen (Team Vitality)',
    platform: 'epic',
    avatarUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
    title: 'RLCS World Champion 🏆',
    rewardLevel: 'Supersonic Legend Season 15',
    globalRank: '#1 Europe',
    overallMmr: 2348,
    wins: 14820,
    winRate: 68.4,
    goals: 28430,
    saves: 16940,
    assists: 14210,
    mvps: 6890,
    shots: 58200,
    shotAccuracy: 48.8,
    streak: 6,
    playlists: [
      {
        id: 'ranked-2v2',
        name: 'Classé 2v2 (Doubles)',
        shortName: '2v2',
        rank: 'Supersonic Legend',
        tier: 22,
        division: 4,
        mmr: 2348,
        streak: 6,
        matchesPlayed: 450,
        winRate: 71.2
      },
      {
        id: 'ranked-3v3',
        name: 'Classé 3v3 (Standard)',
        shortName: '3v3',
        rank: 'Supersonic Legend',
        tier: 22,
        division: 4,
        mmr: 2210,
        streak: 3,
        matchesPlayed: 320,
        winRate: 67.5
      },
      {
        id: 'ranked-1v1',
        name: 'Classé 1v1 (Duel)',
        shortName: '1v1',
        rank: 'Supersonic Legend',
        tier: 22,
        division: 3,
        mmr: 1680,
        streak: -1,
        matchesPlayed: 180,
        winRate: 64.8
      },
      {
        id: 'hoops',
        name: 'Paniers (Hoops)',
        shortName: 'Hoops',
        rank: 'Grand Champion III',
        tier: 21,
        division: 2,
        mmr: 1390,
        streak: 2,
        matchesPlayed: 65,
        winRate: 61.5
      }
    ],
    recentMatches: [
      {
        id: 'm1',
        playlist: 'Classé 2v2',
        result: 'win',
        score: '5 - 2',
        goals: 3,
        assists: 2,
        saves: 4,
        shots: 7,
        mvp: true,
        date: 'Il y a 12 min',
        mmrChange: 9
      },
      {
        id: 'm2',
        playlist: 'Classé 2v2',
        result: 'win',
        score: '3 - 1',
        goals: 2,
        assists: 1,
        saves: 3,
        shots: 5,
        mvp: true,
        date: 'Il y a 28 min',
        mmrChange: 8
      },
      {
        id: 'm3',
        playlist: 'Classé 2v2',
        result: 'win',
        score: '4 - 3 (OT)',
        goals: 2,
        assists: 2,
        saves: 5,
        shots: 8,
        mvp: false,
        date: 'Il y a 45 min',
        mmrChange: 10
      },
      {
        id: 'm4',
        playlist: 'Classé 3v3',
        result: 'win',
        score: '2 - 0',
        goals: 1,
        assists: 1,
        saves: 4,
        shots: 4,
        mvp: true,
        date: 'Il y a 2h',
        mmrChange: 9
      },
      {
        id: 'm5',
        playlist: 'Classé 1v1',
        result: 'loss',
        score: '4 - 5',
        goals: 4,
        assists: 0,
        saves: 2,
        shots: 9,
        mvp: false,
        date: 'Il y a 4h',
        mmrChange: -9
      }
    ]
  },
  vatira: {
    name: 'Vatira (Karmine Corp)',
    platform: 'epic',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    title: 'RLCS Major MVP ⚡',
    rewardLevel: 'Supersonic Legend Season 15',
    globalRank: '#3 Europe',
    overallMmr: 2315,
    wins: 16200,
    winRate: 67.8,
    goals: 31200,
    saves: 24100,
    assists: 15900,
    mvps: 7420,
    shots: 64100,
    shotAccuracy: 49.2,
    streak: 4,
    playlists: [
      {
        id: 'ranked-2v2',
        name: 'Classé 2v2 (Doubles)',
        shortName: '2v2',
        rank: 'Supersonic Legend',
        tier: 22,
        division: 4,
        mmr: 2315,
        streak: 4,
        matchesPlayed: 510,
        winRate: 70.1
      },
      {
        id: 'ranked-3v3',
        name: 'Classé 3v3 (Standard)',
        shortName: '3v3',
        rank: 'Supersonic Legend',
        tier: 22,
        division: 4,
        mmr: 2190,
        streak: 2,
        matchesPlayed: 390,
        winRate: 66.8
      },
      {
        id: 'ranked-1v1',
        name: 'Classé 1v1 (Duel)',
        shortName: '1v1',
        rank: 'Grand Champion III',
        tier: 21,
        division: 4,
        mmr: 1540,
        streak: -2,
        matchesPlayed: 140,
        winRate: 60.5
      }
    ],
    recentMatches: [
      {
        id: 'v1',
        playlist: 'Classé 2v2',
        result: 'win',
        score: '4 - 1',
        goals: 2,
        assists: 2,
        saves: 5,
        shots: 6,
        mvp: true,
        date: 'Il y a 30 min',
        mmrChange: 9
      },
      {
        id: 'v2',
        playlist: 'Classé 2v2',
        result: 'win',
        score: '3 - 2',
        goals: 1,
        assists: 1,
        saves: 6,
        shots: 5,
        mvp: false,
        date: 'Il y a 1h',
        mmrChange: 9
      }
    ]
  },
  kaydop: {
    name: 'Kaydop',
    platform: 'steam',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: '3x RLCS World Champion 👑',
    rewardLevel: 'Grand Champion Season 15',
    globalRank: 'Top 500 Europe',
    overallMmr: 1980,
    wins: 22400,
    winRate: 62.1,
    goals: 45000,
    saves: 28000,
    assists: 29000,
    mvps: 10500,
    shots: 89000,
    shotAccuracy: 50.5,
    streak: -2,
    playlists: [
      {
        id: 'ranked-2v2',
        name: 'Classé 2v2 (Doubles)',
        shortName: '2v2',
        rank: 'Grand Champion III',
        tier: 21,
        division: 3,
        mmr: 1980,
        streak: -2,
        matchesPlayed: 620,
        winRate: 63.4
      },
      {
        id: 'ranked-3v3',
        name: 'Classé 3v3 (Standard)',
        shortName: '3v3',
        rank: 'Grand Champion II',
        tier: 20,
        division: 2,
        mmr: 1740,
        streak: 1,
        matchesPlayed: 410,
        winRate: 61.2
      }
    ],
    recentMatches: [
      {
        id: 'k1',
        playlist: 'Classé 2v2',
        result: 'loss',
        score: '2 - 3',
        goals: 1,
        assists: 1,
        saves: 3,
        shots: 4,
        mvp: false,
        date: 'Il y a 20 min',
        mmrChange: -9
      },
      {
        id: 'k2',
        playlist: 'Classé 2v2',
        result: 'loss',
        score: '1 - 4',
        goals: 0,
        assists: 1,
        saves: 2,
        shots: 3,
        mvp: false,
        date: 'Il y a 35 min',
        mmrChange: -10
      }
    ]
  }
};
