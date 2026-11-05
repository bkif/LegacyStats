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
        // Ensure complete 8 cards in deck:
        let deckList: any[] = Array.isArray(p.deck) ? [...p.deck] : [];
        const rawBattles: any[] = Array.isArray(data.battles) ? data.battles : [];

        // If deck has less than 8 cards, pull the missing cards from the most recent battle
        if (deckList.length < 8 && rawBattles.length > 0 && Array.isArray(rawBattles[0].cards)) {
          const existingIds = new Set(deckList.map((c: any) => c.id || c.name));
          for (const bCard of rawBattles[0].cards) {
            if (deckList.length >= 8) break;
            const cid = bCard.id || bCard.name;
            if (!existingIds.has(cid)) {
              deckList.push(bCard);
              existingIds.add(cid);
            }
          }
        }

        // If still under 8, check tower support cards
        if (deckList.length < 8 && Array.isArray(p.tower) && p.tower.length > 0) {
          for (const tCard of p.tower) {
            if (deckList.length >= 8) break;
            deckList.push({ ...tCard, rarity: tCard.rarity || 'tower' });
          }
        }

        const normalizedBattles: Battle[] = rawBattles.map((b: any, idx: number) => ({
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
      <section className="relative overflow-hidden pt-12 pb-10 px-4 border-b border-white/[0.06]">
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/[0.04] blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-xs mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Clash Royale • Tracker en direct</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Statistiques & Combats
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed mb-6">
            Analyse n'importe quel profil Clash Royale : deck actif, ratios de victoire, streaks et historique détaillé des derniers matchs.
          </p>

          {/* Search Form */}
          <form onSubmit={onSubmit} className="max-w-md mx-auto bg-slate-900/90 p-1.5 rounded-2xl border border-white/[0.08] shadow-xl flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3.5 text-slate-500 font-bold text-sm">#</span>
              <input
                type="text"
                id="tag-input"
                required
                maxLength={16}
                autoComplete="off"
                placeholder="V9JJGLL0G"
                value={tagInput.replace(/^#/, '')}
                onChange={(e) => setTagInput('#' + e.target.value.toUpperCase())}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950/60 border border-transparent text-slate-100 text-sm font-semibold placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {loading ? 'Recherche…' : 'Analyser'}
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-xs text-slate-500">
            <span className="font-medium">Exemples :</span>
            <button
              type="button"
              onClick={() => { setTagInput('#V9JJGLL0G'); handleSearch('V9JJGLL0G'); }}
              className="px-2.5 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors font-mono cursor-pointer border border-white/[0.04]"
            >
              #V9JJGLL0G
            </button>
            <button
              type="button"
              onClick={() => { setTagInput('#28CG0YUU'); handleSearch('28CG0YUU'); }}
              className="px-2.5 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors font-mono cursor-pointer border border-white/[0.04]"
            >
              #28CG0YUU
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
          <div className="lg:col-span-7 bg-slate-900/60 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-400/40 p-1 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Niv</span>
                  <span className="text-xl font-extrabold text-white leading-tight">{player.level}</span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate max-w-full tracking-tight">{player.name}</h2>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    {player.tag}
                  </span>
                  {player.streak !== undefined && player.streak !== 0 && (
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        player.streak > 0
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${player.streak > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                      {player.streak > 0 ? `Série : +${player.streak}V` : `Série : ${player.streak}D`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap font-medium">
                  {player.clan && (
                    <span className="text-slate-300 bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.05] truncate max-w-[200px]">
                      Clan : <strong className="text-white font-semibold">{player.clan}</strong>
                    </span>
                  )}
                  {player.arena && (
                    <span className="text-slate-300 bg-white/[0.04] px-2.5 py-0.5 rounded-md border border-white/[0.05] truncate max-w-[200px]">
                      Arène : <strong className="text-white font-semibold">{player.arena}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Trophées
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {player.trophies?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Record
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-300 tracking-tight">
                  {player.bestTrophies?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Winrate
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
                  {winRate}%
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  3 Couronnes
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {player.threeCrownWins?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider mb-1">
                  Victoires
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-400 tracking-tight">
                  {player.wins?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-rose-400/80 uppercase tracking-wider mb-1">
                  Défaites
                </div>
                <div className="text-lg sm:text-xl font-bold text-rose-400 tracking-tight">
                  {player.losses?.toLocaleString('fr-CH') || '—'}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Matchs Totaux
                </div>
                <div className="text-lg sm:text-xl font-bold text-slate-200 tracking-tight">
                  {player.battleCount?.toLocaleString('fr-CH') || ((player.wins || 0) + (player.losses || 0)).toLocaleString('fr-CH')}
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Carte Favorite
                </div>
                <div className="text-sm font-bold text-amber-300 truncate pt-1">
                  {player.favouriteCard || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Active Deck Tray (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Deck Équipé
                </h3>
                <span className="text-xs text-slate-400 font-medium">Coût moyen : <strong className="text-fuchsia-400 font-bold">{deckAvgElixir} élixir</strong></span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('cards')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20"
              >
                Ouvrir Builder →
              </button>
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
        <div className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                20 Derniers Combats
              </h3>
              <div className="flex items-center gap-3 text-xs font-semibold mt-1">
                <span className="text-emerald-400">{winsCount} Victoires</span>
                <span className="text-slate-500">•</span>
                <span className="text-rose-400">{lossCount} Défaites</span>
                {drawCount > 0 && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-400">{drawCount} Nuls</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick jump badges */}
            <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto pb-1">
              {battles.map((b, i) => {
                const isW = b.result === 'win';
                const isL = b.result === 'loss';
                const bg = isW ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : isL ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                return (
                  <button
                    key={`bt-${i}`}
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setActiveBattleId(`match-${i}`);
                      document.getElementById(`match-${i}`)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-6 h-6 rounded-md border font-mono text-[11px] font-bold flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${bg}`}
                    title={`Match ${i + 1} (${b.crowns}-${b.oppCrowns})`}
                  >
                    {isW ? 'V' : isL ? 'D' : 'N'}
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
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 tracking-tight">Accès Rapide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('cards'); }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/40 hover:bg-slate-900/90 transition-all text-left group cursor-pointer shadow-sm"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Deck Builder Pro →
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Compose ton deck parmi toutes les cartes officielles, calcule l'élixir et teste des combos.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('description'); }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/40 hover:bg-slate-900/90 transition-all text-left group cursor-pointer shadow-sm"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Encyclopédie des Cartes →
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Recherche et filtres par rareté, caractéristiques complètes et évolutions.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('news'); }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/40 hover:bg-slate-900/90 transition-all text-left group cursor-pointer shadow-sm"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Équilibrages & Mises à Jour →
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Buffs, nerfs, nouvelles cartes et notes de patch officielles des saisons.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('esport'); }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/40 hover:bg-slate-900/90 transition-all text-left group cursor-pointer shadow-sm"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Scène E-Sport →
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Équipes professionnelles (Team Liquid, SK Gaming, Tribe) et classements.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('clans'); }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/40 hover:bg-slate-900/90 transition-all text-left group cursor-pointer shadow-sm"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Clan TagUrTilted →
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Classement des membres, guerres de clans et statistiques de dons.
              </p>
            </button>

            <button
              type="button"
              onClick={() => { playTapSound(); onNavigate('crl'); }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/40 hover:bg-slate-900/90 transition-all text-left group cursor-pointer shadow-sm"
            >
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Clash Royale League (CRL) →
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                Replays officiels et temps forts des tournois mondiaux.
              </p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
