import { useState, useEffect, type FormEvent } from 'react';
import { PlayerProfile, NavTab, Battle } from '../types';
import { DEFAULT_PLAYER } from '../data/playerData';
import { CardImage } from './CardImage';
import { getLocalCardImage } from '../data/cardImages';
import { playTapSound, playCrownSound } from '../utils/audio';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

const WORKER_URL = "https://cr-stats.pm00buq.workers.dev";

export const HomeView = ({ onNavigate }: HomeViewProps) => {
  const [tagInput, setTagInput] = useState<string>('#V9JJGLL0G');
  const [player, setPlayer] = useState<PlayerProfile>(DEFAULT_PLAYER);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCollection, setShowCollection] = useState<boolean>(false);
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);

  const fetchPlayerData = async (tagToSearch: string, isInitial = false) => {
    const cleanTag = tagToSearch.trim().replace(/^#/, '').toUpperCase();
    if (!cleanTag) return;

    if (!isInitial) playTapSound();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${WORKER_URL}?tag=${encodeURIComponent(cleanTag)}`, {
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: Joueur introuvable`);
      }

      const data = await res.json();

      if (data && data.reason === 'notFound') {
        setError(`Joueur #${cleanTag} introuvable sur les serveurs Clash Royale.`);
        return;
      }

      if (data && data.player) {
        const p = data.player;

        // Ensure 8 cards in deck (merge tower or deckFromBattle if available)
        let deckList: any[] = p.deck || [];
        if (deckList.length < 8 && Array.isArray(p.deckFromBattle) && p.deckFromBattle.length >= 8) {
          deckList = p.deckFromBattle;
        } else if (deckList.length < 8 && p.tower) {
          deckList = [...deckList, { ...p.tower, name: p.tower.name || 'Tower Troop', rarity: 'tower' }];
        }

        const normalizedBattles: Battle[] = (data.battles || []).map((b: any, idx: number) => ({
          id: `battle-${idx}`,
          result: (b.result === 'win' || b.result === 'loss' || b.result === 'draw') ? b.result : 'win',
          crowns: b.crowns ?? 0,
          oppCrowns: b.oppCrowns ?? 0,
          time: b.time || null,
          opponents: b.opponents || ['Adversaire'],
          cards: (b.cards || []).map((c: any) => ({
            ...c,
            variant: c.variant || 'normal',
            evoImage: c.evoImage || null,
            heroImage: c.heroImage || null,
            image: c.image || getLocalCardImage(c.name),
            localImage: getLocalCardImage(c.name)
          })),
          oppCards: (b.oppCards || []).map((c: any) => ({
            ...c,
            variant: c.variant || 'normal',
            evoImage: c.evoImage || null,
            heroImage: c.heroImage || null,
            image: c.image || getLocalCardImage(c.name),
            localImage: getLocalCardImage(c.name)
          }))
        }));

        // Calculate actual current streak from the latest battles in battlelog
        let currentStreak = 0;
        if (normalizedBattles.length > 0) {
          const firstResult = normalizedBattles[0].result;
          if (firstResult === 'win') {
            for (const b of normalizedBattles) {
              if (b.result === 'win') currentStreak++;
              else break;
            }
          } else if (firstResult === 'loss') {
            for (const b of normalizedBattles) {
              if (b.result === 'loss') currentStreak--;
              else break;
            }
          }
        } else if (typeof p.streak === 'number') {
          currentStreak = p.streak;
        }

        setPlayer({
          name: p.name || `Joueur #${cleanTag}`,
          tag: p.tag || `#${cleanTag}`,
          level: p.level || p.expLevel || 14,
          trophies: p.trophies || 0,
          bestTrophies: p.bestTrophies || p.trophies || 0,
          wins: p.wins || 0,
          losses: p.losses || 0,
          threeCrownWins: p.threeCrownWins || 0,
          battleCount: p.battleCount || (p.wins + p.losses),
          streak: currentStreak,
          clan: p.clan || undefined,
          arena: p.arena || undefined,
          favouriteCard: p.favouriteCard || undefined,
          deck: deckList.map((c: any) => ({
            ...c,
            variant: c.variant || 'normal',
            evoImage: c.evoImage || null,
            heroImage: c.heroImage || null,
            image: c.image || getLocalCardImage(c.name),
            localImage: getLocalCardImage(c.name)
          })),
          cards: (data.cards || []).map((c: any) => ({
            ...c,
            variant: c.variant || 'normal',
            evoImage: c.evoImage || null,
            heroImage: c.heroImage || null,
            image: c.image || getLocalCardImage(c.name),
            localImage: getLocalCardImage(c.name)
          })),
          battles: normalizedBattles
        });

        if (!isInitial) playCrownSound();
      } else {
        throw new Error('Données reçues invalides');
      }
    } catch {
      // Fallback to default player if initial, or show error
      if (isInitial) {
        setPlayer(DEFAULT_PLAYER);
      } else {
        setError(`Impossible de charger le profil #${cleanTag}. Vérifiez la connexion ou le tag.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData('V9JJGLL0G', true);
  }, []);

  const handleSearch = (tagToSearch: string) => {
    fetchPlayerData(tagToSearch, false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(tagInput);
  };

  const battles = player.battles || [];
  const winsCount = battles.filter(b => b.result === 'win').length;
  const lossCount = battles.filter(b => b.result === 'loss').length;
  const drawCount = battles.filter(b => b.result === 'draw').length;

  const totalMatches = (player.wins || 0) + (player.losses || 0);
  const winRate = totalMatches > 0 ? Math.round(((player.wins || 0) / totalMatches) * 100) : 58;

  const deckCards = player.deck || [];
  const deckAvgElixir = deckCards.length > 0
    ? (deckCards.reduce((acc, c) => acc + (c.elixir || 3), 0) / deckCards.length).toFixed(1)
    : '3.1';

  const formatDate = (t: string | null) => {
    if (!t) return '';
    const d = new Date(t);
    return isNaN(d.getTime()) ? '' : d.toLocaleString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main id="contenu" className="flex-1 w-full pb-16">
      {/* Hero section */}
      <section className="relative overflow-hidden pt-14 pb-12 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs mb-4 tracking-wider uppercase">
            <span>🇨🇭</span>
            <span>Statistiques & Deck Tracker Suisse</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black cr-gold-text tracking-tight mb-4 drop-shadow-xl">
            MH LEGACY
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Entre un tag de joueur Clash Royale et découvre en temps réel le profil, le deck équipé, les niveaux et les 20 derniers combats.
          </p>

          {/* Search Form */}
          <form onSubmit={onSubmit} className="max-w-xl mx-auto bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-4 text-amber-400 font-black text-lg">#</span>
              <input
                type="text"
                id="tag-input"
                required
                maxLength={16}
                autoComplete="off"
                placeholder="V9JJGLL0G"
                value={tagInput.replace(/^#/, '')}
                onChange={(e) => setTagInput('#' + e.target.value.toUpperCase())}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/5 text-slate-100 font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cr-btn-primary whitespace-nowrap"
            >
              {loading ? 'Recherche…' : '🔍 Analyser'}
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="font-bold">Tags populaires :</span>
            <button
              type="button"
              onClick={() => { setTagInput('#V9JJGLL0G'); handleSearch('V9JJGLL0G'); }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 text-slate-300 transition-colors font-bold cursor-pointer"
            >
              #V9JJGLL0G (Tag™)
            </button>
            <button
              type="button"
              onClick={() => { setTagInput('#28CG0YUU'); handleSearch('28CG0YUU'); }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 text-slate-300 transition-colors font-bold cursor-pointer"
            >
              #28CG0YUU (SwissLegend)
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {error && (
          <div className="bg-amber-950/40 border border-amber-500/40 text-amber-200 text-sm px-4 py-3 rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {/* Player Profile & Active Deck Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* 1. Player Profile Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Profile Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5">
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-300 to-amber-600 p-0.5 shadow-lg shadow-amber-500/25">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex flex-col items-center justify-center">
                    <span className="text-[10px] sm:text-xs text-amber-400 font-bold leading-none">NIV</span>
                    <span className="text-lg sm:text-xl font-display text-white leading-tight">{player.level}</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-1 text-xs sm:text-sm">👑</div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-3xl font-display text-white truncate max-w-full">{player.name}</h2>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    {player.tag}
                  </span>
                  {player.streak !== undefined && player.streak !== 0 && (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-display px-2.5 py-0.5 rounded-full border shadow-md font-black ${
                        player.streak > 0
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20 animate-pulse'
                          : 'bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/50 shadow-rose-500/20'
                      }`}
                    >
                      {player.streak > 0 ? '🔥 WIN STREAK' : '❄️ LOSE STREAK'} : {Math.abs(player.streak)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mt-1 flex-wrap font-bold">
                  {player.clan && (
                    <span className="text-slate-300 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                      🛡️ {player.clan}
                    </span>
                  )}
                  {player.arena && (
                    <span className="text-slate-300 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                      🏟️ {player.arena}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>🏆</span> Trophées
                </div>
                <div className="text-lg sm:text-2xl font-display text-white">
                  {player.trophies?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>👑</span> Record
                </div>
                <div className="text-lg sm:text-2xl font-display text-white">
                  {player.bestTrophies?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>⚔️</span> Winrate
                </div>
                <div className="text-lg sm:text-2xl font-display text-emerald-400">
                  {winRate}%
                </div>
              </div>

              {/* Streak Stat Box */}
              <div className={`cr-stat-box p-2.5 sm:p-3.5 ${
                (player.streak ?? 0) > 0
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : (player.streak ?? 0) < 0
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : ''
              }`}>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  {(player.streak ?? 0) >= 0 ? (
                    <span className="text-emerald-400">🔥 Win Streak</span>
                  ) : (
                    <span className="text-rose-400">❄️ Lose Streak</span>
                  )}
                </div>
                <div className={`text-lg sm:text-2xl font-display ${
                  (player.streak ?? 0) > 0 ? 'text-emerald-400' : (player.streak ?? 0) < 0 ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {player.streak && player.streak > 0
                    ? `+${player.streak}`
                    : player.streak && player.streak < 0
                    ? `${player.streak}`
                    : '0'}
                </div>
              </div>

              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>✅</span> Victoires
                </div>
                <div className="text-lg sm:text-2xl font-display text-white">
                  {player.wins?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>❌</span> Défaites
                </div>
                <div className="text-lg sm:text-2xl font-display text-white">
                  {player.losses?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>🏰</span> 3 Couronnes
                </div>
                <div className="text-lg sm:text-2xl font-display text-white">
                  {player.threeCrownWins?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="cr-stat-box p-2.5 sm:p-3.5">
                <div className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
                  <span>🎮</span> Combats
                </div>
                <div className="text-lg sm:text-2xl font-display text-white">
                  {player.battleCount?.toLocaleString('fr-CH') || ((player.wins || 0) + (player.losses || 0)).toLocaleString('fr-CH')}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Active Deck Tray (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-display text-white flex items-center gap-2">
                  <span>🃏</span> Deck Équipé
                </h3>
                <span className="text-[11px] sm:text-xs text-slate-400 font-bold">Élixir moyen : <strong className="text-fuchsia-400 font-black">{deckAvgElixir} ⚡</strong></span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('cards')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Builder →
              </button>
            </div>

            {/* 8 Cards in 4x2 Grid */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {deckCards.map((card, idx) => {
                const variantClass = card.variant === 'evo' ? 'is-evo' : card.variant === 'hero' ? 'is-hero' : '';
                return (
                  <div
                    key={`${card.id || card.name}-${idx}`}
                    className={`cr-card-frame ${variantClass} relative flex flex-col items-center cursor-pointer`}
                    title={`${card.name} (Niv ${card.level ?? '?'})${card.variant === 'evo' ? ' - ÉVOLUTION' : card.variant === 'hero' ? ' - HÉROS' : ''}`}
                  >
                    <div className="cr-elixir-drop">
                      <span>{card.elixir || 3}</span>
                    </div>

                    {card.variant === 'evo' && <span className="cr-evo-badge">EVO</span>}
                    {card.variant === 'hero' && <span className="cr-hero-badge">HERO</span>}

                    <div className="w-full aspect-[1/1.22] flex items-center justify-center">
                      <CardImage
                        name={card.name}
                        image={card.image}
                        rarity={card.rarity}
                        variant={card.variant}
                        evoImage={card.evoImage}
                        heroImage={card.heroImage}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="cr-level-badge -mt-2 sm:-mt-2.5 font-black z-20">
                      Niv {card.level ?? 14}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Toggleable Cards Collection */}
        {player.cards && player.cards.length > 0 && (
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-display text-white">Collection de Cartes</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-bold mt-0.5">{player.cards.length} cartes débloquées</p>
              </div>
              <button
                type="button"
                onClick={() => { playTapSound(); setShowCollection(!showCollection); }}
                className="cr-btn-secondary text-[11px] sm:text-xs !py-1.5 !px-3"
              >
                {showCollection ? 'Masquer ▲' : 'Afficher ▼'}
              </button>
            </div>

            {showCollection && (
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 sm:gap-3.5 mt-4 max-h-[500px] overflow-y-auto pr-1">
                {player.cards.map((c, idx) => (
                  <div key={`coll-${c.id || c.name}-${idx}`} className={`cr-card-frame r-${c.rarity || 'common'} p-1.5`}>
                    <div className="w-full h-16 sm:h-22 flex items-center justify-center p-0.5">
                      <CardImage name={c.name} image={c.image} rarity={c.rarity} />
                    </div>
                    <span className="cr-level-badge mt-1">
                      Niv {c.level ?? 14}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Recent Battles Stream (20 derniers combats) */}
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-display text-white flex items-center gap-2">
                <span>⚔️</span> 20 Derniers Combats
              </h3>
              <div className="flex items-center gap-3 text-xs font-bold mt-1">
                <span className="text-emerald-400">🏆 {winsCount} Victoires</span>
                <span className="text-rose-400">❌ {lossCount} Défaites</span>
                {drawCount > 0 && <span className="text-amber-400">🤝 {drawCount} Nuls</span>}
              </div>
            </div>

            {/* Quick jump badges */}
            <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto pb-1">
              {battles.map((b, i) => {
                const isW = b.result === 'win';
                const isL = b.result === 'loss';
                const bg = isW ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : isL ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                return (
                  <button
                    key={`bt-${i}`}
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setActiveBattleId(`match-${i}`);
                      document.getElementById(`match-${i}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg border font-display text-[10px] sm:text-xs flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${bg}`}
                    title={`Match ${i + 1} (${b.crowns}-${b.oppCrowns})`}
                  >
                    {isW ? 'W' : isL ? 'L' : 'D'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Battles List */}
          <div className="space-y-3 sm:space-y-4 mt-5">
            {battles.map((b, i) => {
              const isWin = b.result === 'win';
              const isLoss = b.result === 'loss';
              const resultClass = isWin ? 'win' : isLoss ? 'loss' : 'draw';
              const badgeColor = isWin ? 'bg-emerald-500 text-slate-950' : isLoss ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-950';
              const myCards = (b.cards && b.cards.length ? b.cards : player.deck) || [];
              const oppCards = b.oppCards || [];

              return (
                <article
                  key={`match-${i}`}
                  id={`match-${i}`}
                  className={`cr-match-card ${resultClass} ${activeBattleId === `match-${i}` ? 'ring-2 ring-amber-400' : ''} p-3.5 sm:p-5 rounded-xl sm:rounded-2xl`}
                >
                  {/* Match Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-display text-[10px] sm:text-xs ${badgeColor} shrink-0`}>
                        {isWin ? 'VICTOIRE' : isLoss ? 'DÉFAITE' : 'ÉGALITÉ'}
                      </span>
                      <span className="font-display text-sm sm:text-lg text-white shrink-0">
                        {b.crowns} - {b.oppCrowns} 👑
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] sm:text-sm font-bold min-w-0 flex-1 justify-center sm:justify-start">
                      <span className="text-amber-400 truncate max-w-[90px] sm:max-w-none">{player.name}</span>
                      <span className="text-[10px] text-slate-500 font-black">VS</span>
                      <span className="text-slate-200 truncate max-w-[90px] sm:max-w-none">{b.opponents.join(' & ') || 'Adversaire'}</span>
                    </div>

                    <time className="text-[10px] sm:text-xs text-slate-400 font-bold shrink-0">{formatDate(b.time)}</time>
                  </div>

                  {/* Matchup Comparison (Mon Deck vs Deck Adverse) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Mon Deck */}
                    <div className="bg-slate-950/60 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5">
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                        Mon Deck
                      </div>
                      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                        {myCards.map((card, cIdx) => {
                          const variantClass = card.variant === 'evo' ? 'is-evo' : card.variant === 'hero' ? 'is-hero' : '';
                          return (
                            <div key={`my-${i}-${cIdx}`} className="text-center group">
                              <div className={`cr-card-frame ${variantClass} relative`}>
                                {card.variant === 'evo' && <span className="cr-evo-badge">EVO</span>}
                                {card.variant === 'hero' && <span className="cr-hero-badge">HERO</span>}
                                <div className="w-full aspect-[1/1.22] flex items-center justify-center">
                                  <CardImage
                                    name={card.name}
                                    image={card.image}
                                    rarity={card.rarity}
                                    variant={card.variant}
                                    evoImage={card.evoImage}
                                    heroImage={card.heroImage}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                              <span className="text-[9px] sm:text-[11px] font-bold text-slate-300 block mt-1 truncate leading-tight">
                                {card.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Deck Adverse */}
                    <div className="bg-slate-950/60 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/5">
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Deck Adverse
                      </div>
                      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                        {oppCards.length > 0 ? (
                          oppCards.map((card, cIdx) => {
                            const variantClass = card.variant === 'evo' ? 'is-evo' : card.variant === 'hero' ? 'is-hero' : '';
                            return (
                              <div key={`opp-${i}-${cIdx}`} className="text-center group">
                                <div className={`cr-card-frame ${variantClass} relative`}>
                                  {card.variant === 'evo' && <span className="cr-evo-badge">EVO</span>}
                                  {card.variant === 'hero' && <span className="cr-hero-badge">HERO</span>}
                                  <div className="w-full aspect-[1/1.22] flex items-center justify-center">
                                    <CardImage
                                      name={card.name}
                                      image={card.image}
                                      rarity={card.rarity}
                                      variant={card.variant}
                                      evoImage={card.evoImage}
                                      heroImage={card.heroImage}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                </div>
                                <span className="text-[9px] sm:text-[11px] font-bold text-slate-300 block mt-1 truncate leading-tight">
                                  {card.name}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-4 text-center py-5 text-xs text-slate-500 font-bold">
                            Deck adverse non enregistré
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 5. Explorer le site (Quick Navigation Cards) */}
        <div>
          <h2 className="text-xl font-display text-white mb-4">Explorer MH Legacy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('cards'); }}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all text-left group shadow-lg cursor-pointer"
            >
              <div className="text-3xl mb-2">🃏</div>
              <h3 className="font-display text-white text-base group-hover:text-amber-400 transition-colors">
                Deck Builder Pro
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Compose ton deck parmi toutes les cartes, calcule l'élixir moyen et teste des synergies.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('description'); }}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all text-left group shadow-lg cursor-pointer"
            >
              <div className="text-3xl mb-2">🔎</div>
              <h3 className="font-display text-white text-base group-hover:text-amber-400 transition-colors">
                Fiches des Cartes
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Toutes les cartes du jeu classées par rareté, coût en élixir et caractéristiques complètes.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('news'); }}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all text-left group shadow-lg cursor-pointer"
            >
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-display text-white text-base group-hover:text-amber-400 transition-colors">
                Équilibrages & Saisons
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Buffs, nerfs, refontes et nouveaux héros de la saison en cours et des saisons précédentes.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('esport'); }}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all text-left group shadow-lg cursor-pointer"
            >
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-display text-white text-base group-hover:text-amber-400 transition-colors">
                Scène E-Sport
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Les équipes légendaires (Team Liquid, SK Gaming, Tribe) et leurs palmarès en tournois.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('clans'); }}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all text-left group shadow-lg cursor-pointer"
            >
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-display text-white text-base group-hover:text-amber-400 transition-colors">
                Clan TagUrTilted
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Classement des membres, trophées de guerre et statistiques de dons hebdomadaires.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('crl'); }}
              className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all text-left group shadow-lg cursor-pointer"
            >
              <div className="text-3xl mb-2">🎬</div>
              <h3 className="font-display text-white text-base group-hover:text-amber-400 transition-colors">
                Moments Forts CRL
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Les replays et résumés vidéo des World Finals de la Clash Royale League.
              </p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
