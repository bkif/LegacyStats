import { useState, useEffect, type DragEvent } from 'react';
import { Card, CardRarity } from '../types';
import { INITIAL_CARDS, fetchOfficialCards } from '../data/cardsData';
import { CardImage } from './CardImage';
import { playDropSound, playTapSound, playCrownSound } from '../utils/audio';

export const DeckBuilderView = () => {
  const [allCards, setAllCards] = useState<Card[]>(INITIAL_CARDS);
  const [loadingCards, setLoadingCards] = useState<boolean>(false);
  const [deckSlots, setDeckSlots] = useState<(Card | null)[]>([
    INITIAL_CARDS.find(c => c.name === 'Goblin Barrel') || null,
    INITIAL_CARDS.find(c => c.name === 'Valkyrie') || null,
    INITIAL_CARDS.find(c => c.name === 'Skeleton Army') || null,
    INITIAL_CARDS.find(c => c.name === 'Wall Breakers') || null,
    INITIAL_CARDS.find(c => c.name === 'Princess') || null,
    INITIAL_CARDS.find(c => c.name === 'Dart Goblin') || null,
    INITIAL_CARDS.find(c => c.name === 'Ice Spirit') || null,
    INITIAL_CARDS.find(c => c.name === 'Cannon') || null,
  ]);

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<string>('');
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCards(true);
    fetchOfficialCards()
      .then(cards => {
        if (cards && cards.length > 0) {
          setAllCards(cards);
          // Sync default slots with real API images if matching
          setDeckSlots(prev => prev.map(slot => {
            if (!slot) return null;
            const match = cards.find(c => c.name.toLowerCase() === slot.name.toLowerCase());
            return match || slot;
          }));
        }
      })
      .finally(() => setLoadingCards(false));
  }, []);

  const handleCardClick = (card: Card) => {
    const existingIndex = deckSlots.findIndex(s => s && s.name === card.name);
    if (existingIndex !== -1) {
      clearSlot(existingIndex);
      return;
    }

    const firstEmpty = deckSlots.findIndex(s => s === null);
    if (firstEmpty !== -1) {
      const next = [...deckSlots];
      next[firstEmpty] = card;
      setDeckSlots(next);
      playDropSound();
    } else {
      const next = [...deckSlots];
      next[7] = card;
      setDeckSlots(next);
      playDropSound();
    }
  };

  const clearSlot = (index: number) => {
    playTapSound();
    const next = [...deckSlots];
    next[index] = null;
    setDeckSlots(next);
  };

  const handleDragStart = (e: DragEvent, card: Card) => {
    playTapSound();
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const cardId = e.dataTransfer.getData('text/plain');
    if (!cardId) return;

    const found = allCards.find(c => String(c.id) === String(cardId));
    if (!found) return;

    const next = [...deckSlots];
    next[index] = found;
    setDeckSlots(next);
    playDropSound();
  };

  const activeCards = deckSlots.filter((s): s is Card => s !== null);
  const avgElixirNum = activeCards.length
    ? activeCards.reduce((acc, c) => acc + (c.elixir || 0), 0) / activeCards.length
    : 0;
  const avgElixir = activeCards.length ? avgElixirNum.toFixed(1) : null;

  const getDeckPace = (avg: number) => {
    if (!avg) return { label: 'Deck incomplet', color: 'text-slate-400' };
    if (avg < 3.0) return { label: 'Cycle Rapide (Pression)', color: 'text-emerald-400' };
    if (avg <= 3.8) return { label: 'Équilibré (Polyvalent)', color: 'text-amber-400' };
    return { label: 'Deck Lourd (Beatdown)', color: 'text-rose-400' };
  };

  const deckPace = getDeckPace(avgElixirNum);

  const filteredCards = allCards.filter(c => {
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesRarity = !selectedRarity || c.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const clearAll = () => {
    playTapSound();
    setDeckSlots(Array(8).fill(null));
  };

  const generateRandomDeck = () => {
    playCrownSound();
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    setDeckSlots(shuffled.slice(0, 8));
  };

  const copyDeck = () => {
    playCrownSound();
    const names = activeCards.map(c => c.name).join(', ');
    navigator.clipboard.writeText(`Deck Clash Royale (${avgElixir || 0} élixir): ${names}`);
    setCopyNotice('Deck copié dans le presse-papier !');
    setTimeout(() => setCopyNotice(null), 2500);
  };

  const rarities: { id: string; label: string }[] = [
    { id: '', label: 'Toutes' },
    { id: 'common', label: 'Communes' },
    { id: 'rare', label: 'Rares' },
    { id: 'epic', label: 'Épiques' },
    { id: 'legendary', label: 'Légendaires' },
    { id: 'champion', label: 'Champions' },
  ];

  return (
    <main id="contenu" className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          DECK BUILDER
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Compose ton deck de 8 cartes, teste différentes compositions et analyse le coût moyen en élixir.
        </p>
      </div>

      {/* Royal Battle Deck Tray */}
      <section aria-label="Deck" className="cr-deck-tray max-w-3xl mx-auto mb-8 p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <span className="font-display text-white text-sm sm:text-base tracking-wide">
              BATTLE DECK ({activeCards.length} / 8)
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={generateRandomDeck}
              className="cr-btn-secondary text-[11px] sm:text-xs !py-1.5 !px-2.5"
              title="Générer une composition aléatoire"
            >
              🎲 Aléatoire
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="cr-btn-secondary text-[11px] sm:text-xs !py-1.5 !px-2.5 text-rose-300 hover:text-rose-200"
            >
              🗑️ Vider
            </button>
            <button
              type="button"
              onClick={copyDeck}
              disabled={activeCards.length === 0}
              className="cr-btn-primary text-[11px] sm:text-xs !py-1.5 !px-3"
            >
              📋 Copier
            </button>
          </div>
        </div>

        {copyNotice && (
          <div className="text-xs text-center font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2 mb-3 animate-fade-in">
            {copyNotice}
          </div>
        )}

        {/* 8 Slots in 2 rows of 4 */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 mb-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const card = deckSlots[i];
            const isDragOver = dragOverIndex === i;
            return (
              <div
                key={`slot-${i}`}
                className={`cr-deck-slot ${card ? 'active-card' : ''} ${isDragOver ? 'drag-over' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={card ? `${card.name} dans le deck` : `Case ${i + 1} du deck, vide`}
                onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i); }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, i)}
                onClick={() => card && clearSlot(i)}
                onContextMenu={(e) => { e.preventDefault(); clearSlot(i); }}
                onKeyDown={(e) => {
                  if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    clearSlot(i);
                  }
                }}
              >
                {card ? (
                  <div className="w-full h-full p-1 flex flex-col items-center justify-center relative group">
                    <div className="cr-elixir-drop">
                      <span>{card.elixir}</span>
                    </div>
                    <div className="w-full h-16 sm:h-24 flex items-center justify-center p-0.5">
                      <CardImage name={card.name} image={card.image} rarity={card.rarity} />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-200 truncate w-full text-center mt-1">
                      {card.name}
                    </span>
                    <span className="absolute inset-0 bg-red-950/80 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] sm:text-xs font-black text-rose-300 transition-opacity">
                      ✕ Retirer
                    </span>
                  </div>
                ) : (
                  <div className="text-center p-1 sm:p-2 text-slate-600 select-none">
                    <div className="text-base sm:text-xl opacity-30">+</div>
                    <span className="text-[9px] sm:text-[11px] font-bold block mt-0.5 opacity-40">Slot {i + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Elixir Analytics Indicator */}
        <div className="bg-slate-950/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-600 to-fuchsia-700 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
              <span className="text-lg sm:text-xl">⚡</span>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                Coût Moyen en Élixir
              </div>
              <div className="text-lg sm:text-xl font-display text-white">
                {avgElixir ? `${avgElixir} Élixir` : '—'}
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className={`text-xs font-bold ${deckPace.color}`}>
              {deckPace.label}
            </span>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">
              💡 Touche ou clique sur une carte pour l'ajouter / retirer
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Filter Controls */}
      <div className="bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-white/5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Rarity selector buttons */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {rarities.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => { playTapSound(); setSelectedRarity(r.id); }}
              className={`px-2.5 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedRarity === r.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="search"
            placeholder="Chercher une carte…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Cards Catalog */}
      <section aria-label="Collection">
        {loadingCards && (
          <div className="text-center py-4 text-xs font-bold text-amber-400 animate-pulse">
            ⚡ Synchronisation du catalogue officiel depuis l'API Supercell ({allCards.length} cartes)…
          </div>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {filteredCards.map(card => {
            const isInDeck = deckSlots.some(s => s && s.name === card.name);
            return (
              <button
                key={card.id}
                type="button"
                draggable
                onDragStart={(e) => handleDragStart(e, card)}
                onClick={() => handleCardClick(card)}
                className={`cr-card-frame r-${card.rarity || 'common'} p-1.5 cursor-pointer relative group ${
                  isInDeck ? 'opacity-40 grayscale-[40%] ring-2 ring-amber-400/50' : ''
                }`}
                title={`${card.name} (${card.elixir} élixir)`}
              >
                <div className="cr-elixir-drop">
                  <span>{card.elixir}</span>
                </div>
                <div className="w-full h-14 sm:h-20 flex items-center justify-center p-0.5">
                  <CardImage name={card.name} image={card.image} rarity={card.rarity as CardRarity} />
                </div>
                <span className="text-[10px] font-bold text-slate-300 block truncate w-full text-center mt-1">
                  {card.name}
                </span>
                {isInDeck && (
                  <span className="absolute bottom-1 bg-amber-400/90 text-slate-950 text-[9px] font-black px-1.5 rounded-md">
                    DANS LE DECK
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
