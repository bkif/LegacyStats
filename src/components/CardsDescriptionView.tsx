import { useState, useEffect } from 'react';
import { Card, CardRarity } from '../types';
import { INITIAL_CARDS, fetchOfficialCards } from '../data/cardsData';
import { CardImage } from './CardImage';
import { playTapSound } from '../utils/audio';

const RARITY_META: Record<CardRarity, { label: string; color: string; bg: string }> = {
  common:    { label: "Commune",    color: "#93c5fd", bg: "bg-blue-500/10 border-blue-500/30" },
  rare:      { label: "Rare",       color: "#f59e0b", bg: "bg-amber-500/10 border-amber-500/30" },
  epic:      { label: "Épique",     color: "#c026d3", bg: "bg-fuchsia-500/10 border-fuchsia-500/30" },
  legendary: { label: "Légendaire", color: "#2dd4bf", bg: "bg-teal-500/10 border-teal-500/30" },
  champion:  { label: "Champion",   color: "#f5c438", bg: "bg-amber-400/15 border-amber-400/40" },
  hero:      { label: "Héros",      color: "#f5c438", bg: "bg-amber-400/15 border-amber-400/40" },
  tower:     { label: "Tour",       color: "#cfd8ff", bg: "bg-indigo-500/10 border-indigo-500/30" },
};

export const CardsDescriptionView = () => {
  const [allCards, setAllCards] = useState<Card[]>(INITIAL_CARDS);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [rarity, setRarity] = useState<string>('');
  const [elixirFilter, setElixirFilter] = useState<string>('all');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchOfficialCards()
      .then(cards => {
        if (cards && cards.length > 0) setAllCards(cards);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCards = allCards.filter(c => {
    const q = !query || c.name.toLowerCase().includes(query.toLowerCase().trim());
    const r = !rarity || c.rarity === rarity;
    let e = true;
    if (elixirFilter === '1-2') e = c.elixir <= 2;
    if (elixirFilter === '3-4') e = c.elixir >= 3 && c.elixir <= 4;
    if (elixirFilter === '5-6') e = c.elixir >= 5 && c.elixir <= 6;
    if (elixirFilter === '7+') e = c.elixir >= 7;
    return q && r && e;
  });

  const selectedCard = allCards.find(c => String(c.id) === String(selectedCardId) || c.name === selectedCardId) || null;

  return (
    <main id="contenu" className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          ENCYCLOPÉDIE DES CARTES
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Consulte la liste complète des cartes Clash Royale, explore leurs caractéristiques et filtre par rareté ou coût en élixir.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 p-5 rounded-3xl border border-white/10 shadow-xl mb-8 space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="search"
              id="card-search"
              placeholder="Rechercher une carte…"
              aria-label="Rechercher une carte"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Elixir Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-1">Élixir :</span>
            {[
              { id: 'all', label: 'Tous' },
              { id: '1-2', label: '1 - 2 ⚡' },
              { id: '3-4', label: '3 - 4 ⚡' },
              { id: '5-6', label: '5 - 6 ⚡' },
              { id: '7+', label: '7+ ⚡' }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => { playTapSound(); setElixirFilter(pill.id); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  elixirFilter === pill.id
                    ? 'bg-rose-500 text-white font-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5 pb-1">
          <span className="text-xs font-bold text-slate-400 mr-1">Rareté :</span>
          {[
            { id: '', label: 'Toutes' },
            { id: 'common', label: 'Commune' },
            { id: 'rare', label: 'Rare' },
            { id: 'epic', label: 'Épique' },
            { id: 'legendary', label: 'Légendaire' },
            { id: 'champion', label: 'Champion' },
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => { playTapSound(); setRarity(r.id); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                rarity === r.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-3 text-xs font-bold text-amber-400 animate-pulse mb-4">
          ⚡ Chargement des 123 cartes officielles depuis l'API Supercell…
        </div>
      )}

      {/* Cards Showcase Grid */}
      <div id="cards-list" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {filteredCards.length > 0 ? (
          filteredCards.map(c => {
            const meta = RARITY_META[c.rarity] || { label: c.rarity, color: '#fff', bg: 'bg-slate-800' };
            return (
              <article
                key={c.id}
                id={c.id}
                onClick={() => { playTapSound(); setSelectedCardId(c.id); }}
                className={`cr-card-frame r-${c.rarity || 'common'} p-2.5 sm:p-4 cursor-pointer text-center group`}
              >
                {/* Elixir Drop */}
                <div className="cr-elixir-drop">
                  <span>{c.elixir}</span>
                </div>

                {/* Card Artwork */}
                <div className="w-full h-24 sm:h-32 flex items-center justify-center my-1 sm:my-2 p-1">
                  <CardImage name={c.name} image={c.image} rarity={c.rarity} />
                </div>

                {/* Card Name */}
                <h3 className="font-display text-sm text-white truncate w-full group-hover:text-amber-300 transition-colors">
                  {c.name}
                </h3>

                {/* Stats badge */}
                <div className="flex items-center justify-between w-full mt-3 pt-2 border-t border-white/10 text-xs">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${meta.bg}`} style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="font-bold text-amber-400">
                    {c.elixir} Élixir ⚡
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-slate-900/40 rounded-3xl border border-white/5">
            Aucune carte ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>

      {/* Selected Card Modal Detail */}
      {selectedCard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in">
            <button
              type="button"
              onClick={() => setSelectedCardId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-black cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className={`cr-card-frame r-${selectedCard.rarity || 'common'} w-24 p-2`}>
                <CardImage name={selectedCard.name} image={selectedCard.image} rarity={selectedCard.rarity} />
              </div>

              <div>
                <h2 className="text-xl font-display text-white">{selectedCard.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-md"
                    style={{ color: RARITY_META[selectedCard.rarity]?.color || '#fff' }}
                  >
                    {RARITY_META[selectedCard.rarity]?.label || selectedCard.rarity}
                  </span>
                  <span className="text-xs text-rose-400 font-black">
                    {selectedCard.elixir} Élixir ⚡
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Niveau Max :</span>
                <span className="font-extrabold text-white">{selectedCard.maxLevel || 16} (Niveau Élite)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Rareté officielle :</span>
                <span className="font-extrabold text-amber-300 capitalize">{selectedCard.rarity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Catégorie :</span>
                <span className="font-extrabold text-blue-300">
                  {selectedCard.name.includes('Tower') || selectedCard.name.includes('Cannon') || selectedCard.name.includes('Tesla') || selectedCard.name.includes('Mortar') || selectedCard.name.includes('X-Bow') ? 'Bâtiment' : selectedCard.name.includes('Fireball') || selectedCard.name.includes('Zap') || selectedCard.name.includes('Arrows') || selectedCard.name.includes('Rocket') || selectedCard.name.includes('Log') ? 'Sort' : 'Troupe'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCardId(null)}
              className="cr-btn-primary w-full mt-5"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
