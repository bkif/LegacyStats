import { useState, useEffect } from 'react';
import { NewsData, Season } from '../types';
import { INITIAL_NEWS } from '../data/newsData';
import { CardImage } from './CardImage';
import { playTapSound } from '../utils/audio';

export const NewsView = () => {
  const [news, setNews] = useState<NewsData>(INITIAL_NEWS);
  const [activeSeasonId, setActiveSeasonId] = useState<string>(
    INITIAL_NEWS.seasons[0]?.id || 's88'
  );
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/data/news.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.seasons && data.seasons.length) {
          setNews(data);
          if (!activeSeasonId) {
            setActiveSeasonId(data.seasons[0].id);
          }
        }
      })
      .catch(() => {});
  }, [activeSeasonId]);

  const activeSeason: Season | undefined = news.seasons.find(s => s.id === activeSeasonId) || news.seasons[0];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const filteredChanges = (activeSeason?.changes || []).filter(c => {
    if (typeFilter === 'all') return true;
    return c.type === typeFilter;
  });

  return (
    <main id="contenu" className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          ÉQUILIBRAGES & SAISONS
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Détail des mises à jour officielles de Supercell : buffs, nerfs, refontes et nouveaux héros par saison.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Seasons Menu (4 cols) */}
        <aside className="lg:col-span-4 bg-slate-900/80 border border-white/10 rounded-3xl p-5 shadow-xl backdrop-blur-md space-y-2" aria-label="Choisir une saison">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Historique des Saisons
          </div>
          {news.seasons.map((s) => {
            const isActive = activeSeason?.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { playTapSound(); setActiveSeasonId(s.id); }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 translate-x-1'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 font-bold'
                }`}
              >
                <div>
                  <div className="text-sm font-display leading-tight">{s.label}</div>
                  <div className={`text-xs ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    {s.title}
                  </div>
                </div>
                <span className="text-sm">→</span>
              </button>
            );
          })}
        </aside>

        {/* Right Patch Notes Details (8 cols) */}
        <section className="lg:col-span-8 bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md" aria-live="polite">
          {activeSeason ? (
            <div>
              {/* Season Header */}
              <div className="border-b border-white/10 pb-5 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h2 className="text-2xl font-display text-white">
                    {activeSeason.title}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    {activeSeason.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold">
                  Date d'application : {formatDate(activeSeason.date)}
                </p>

                {/* Filter by Type */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs font-bold text-slate-400">Filtrer :</span>
                  {[
                    { id: 'all', label: 'Tous les changements' },
                    { id: 'buff', label: '🟢 Buffs' },
                    { id: 'nerf', label: '🔴 Nerfs' },
                    { id: 'rework', label: '🔵 Refontes' },
                    { id: 'new', label: '🟣 Nouveautés' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { playTapSound(); setTypeFilter(f.id); }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        typeFilter === f.id
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Changes Cards List */}
              <div className="space-y-3">
                {filteredChanges.length > 0 ? (
                  filteredChanges.map((c, i) => {
                    const isBuff = c.type === 'buff';
                    const isNerf = c.type === 'nerf';
                    const isRework = c.type === 'rework';
                    const badgeBg = isBuff ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : isNerf ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' : isRework ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300';
                    const iconText = isBuff ? '▲ BUFF' : isNerf ? '▼ NERF' : isRework ? '◆ REWORK' : '★ NOUVEAU';

                    return (
                      <div
                        key={`change-${i}`}
                        className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-white/15 transition-colors"
                      >
                        {/* Card Art Thumbnail */}
                        <div className="w-14 h-16 rounded-xl bg-slate-900 border border-white/10 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <CardImage name={c.card} />
                        </div>

                        {/* Description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-display text-white text-sm">{c.card}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${badgeBg}`}>
                              {iconText}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                            {c.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-slate-400 font-bold">
                    Aucun changement pour ce filtre.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 font-bold">Sélectionne une saison.</p>
          )}

          {news.lastUpdated && (
            <p className="text-xs text-slate-500 italic mt-6 text-right">
              Mise à jour du registre : {formatDate(news.lastUpdated)}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};
