import { useState } from 'react';
import { GameMode } from '../types';
import { playTapSound } from '../utils/audio';

interface GameSelectionLandingProps {
  onSelectGame: (game: GameMode) => void;
}

export const GameSelectionLanding = ({ onSelectGame }: GameSelectionLandingProps) => {
  const [hoveredGame, setHoveredGame] = useState<GameMode>(null);

  const handlePick = (game: GameMode) => {
    playTapSound();
    onSelectGame(game);
  };

  return (
    <main id="contenu" className="relative flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 overflow-hidden">
      {/* Dynamic Background ambient lighting */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] blur-[150px] pointer-events-none rounded-full transition-all duration-700 ${
          hoveredGame === 'clash-royale'
            ? 'bg-gradient-to-r from-amber-500/25 via-fuchsia-500/15 to-amber-500/10 scale-110'
            : hoveredGame === 'rocket-league'
            ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-orange-500/15 scale-110'
            : 'bg-gradient-to-r from-amber-500/12 via-fuchsia-500/10 to-cyan-500/12'
        }`}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Brand Title */}
      <div className="max-w-3xl mx-auto text-center relative z-10 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.1] text-slate-200 font-bold text-xs mb-6 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>Bienvenue sur le Hub Multi-Gaming • API Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
          LEGACY<span className="bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400 bg-clip-text text-transparent"> STATS</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Choisis ton univers compétitif pour suivre en direct tes statistiques de joueur, ton historique de matchs, tes rangs et tes performances.
        </p>
      </div>

      {/* Dual Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl w-full relative z-10">
        
        {/* Card 1: Clash Royale */}
        <button
          type="button"
          onClick={() => handlePick('clash-royale')}
          onMouseEnter={() => setHoveredGame('clash-royale')}
          onMouseLeave={() => setHoveredGame(null)}
          className="group relative flex flex-col justify-between text-left p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-amber-500/20 hover:border-amber-400/70 transition-all duration-300 shadow-2xl hover:shadow-[0_20px_50px_-12px_rgba(245,196,56,0.25)] hover:-translate-y-2 cursor-pointer overflow-hidden backdrop-blur-xl"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-fuchsia-500 opacity-75 group-hover:opacity-100 transition-opacity" />

          {/* Subtle card glow on hover */}
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/25 group-hover:scale-125 transition-all duration-500" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-300 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full uppercase">
                  Supercell
                </span>
                <span className="text-[11px] font-bold text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/25 px-2.5 py-1 rounded-full">
                  Arène & Decks
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                👑
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 group-hover:text-amber-300 transition-colors tracking-tight">
              Clash Royale
            </h2>

            <p className="text-slate-300/90 text-sm sm:text-base font-medium leading-relaxed mb-6">
              Profil de joueur en temps réel, 20 derniers combats, winrate, séries de victoires, Deck Builder interactif avec coût d'élixir et encyclopédie complète des cartes.
            </p>

            {/* Quick preview metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 p-3 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cartes</div>
                <div className="text-sm font-black text-amber-300">110+ & Évos</div>
              </div>
              <div className="border-x border-white/[0.06] px-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Historique</div>
                <div className="text-sm font-black text-white">20 Combats</div>
              </div>
              <div className="pl-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-Sport</div>
                <div className="text-sm font-black text-fuchsia-300">CRL & Clans</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-200 mb-8">
              <span className="px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-200">Deck Tracker</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">Élixir Moyen</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">Évolutions & Héros</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">Équilibrages</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-sm font-extrabold text-amber-300 group-hover:text-white transition-colors">
              Entrer dans l'Arène Clash Royale
            </span>
            <div className="px-4 py-2 rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/20 group-hover:translate-x-1 transition-all">
              Choisir →
            </div>
          </div>
        </button>

        {/* Card 2: Rocket League */}
        <button
          type="button"
          onClick={() => handlePick('rocket-league')}
          onMouseEnter={() => setHoveredGame('rocket-league')}
          onMouseLeave={() => setHoveredGame(null)}
          className="group relative flex flex-col justify-between text-left p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-cyan-500/20 hover:border-cyan-400/70 transition-all duration-300 shadow-2xl hover:shadow-[0_20px_50px_-12px_rgba(34,211,238,0.25)] hover:-translate-y-2 cursor-pointer overflow-hidden backdrop-blur-xl"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-orange-500 opacity-75 group-hover:opacity-100 transition-opacity" />

          {/* Subtle card glow on hover */}
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-400/25 group-hover:scale-125 transition-all duration-500" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 bg-cyan-400/15 border border-cyan-400/30 px-3 py-1 rounded-full uppercase">
                  Psyonix / Epic
                </span>
                <span className="text-[11px] font-bold text-orange-300 bg-orange-500/15 border border-orange-500/25 px-2.5 py-1 rounded-full">
                  MMR & Ranked
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/10 border border-cyan-400/30 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300">
                🚀
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 group-hover:text-cyan-300 transition-colors tracking-tight">
              Rocket League
            </h2>

            <p className="text-slate-300/90 text-sm sm:text-base font-medium leading-relaxed mb-6">
              Suivi du MMR en direct par playlist (1v1, 2v2, 3v3), rangs compétitifs (SSL, Grand Champion, Champion), précision de tir, arrêts et historique des matchs.
            </p>

            {/* Quick preview metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-6 p-3 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Playlists</div>
                <div className="text-sm font-black text-cyan-300">1v1 • 2v2 • 3v3</div>
              </div>
              <div className="border-x border-white/[0.06] px-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rangs</div>
                <div className="text-sm font-black text-white">Bronze → SSL</div>
              </div>
              <div className="pl-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plateformes</div>
                <div className="text-sm font-black text-orange-300">Epic • Steam • PSN</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-200 mb-8">
              <span className="px-3 py-1 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-200">MMR en direct</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">Divisions & Streaks</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">Rangs SSL / GC</span>
              <span className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">Multi-Plateformes</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <span className="text-sm font-extrabold text-cyan-300 group-hover:text-white transition-colors">
              Ouvrir le Tracker Rocket League
            </span>
            <div className="px-4 py-2 rounded-xl bg-gradient-to-b from-cyan-300 to-cyan-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shadow-cyan-500/20 group-hover:translate-x-1 transition-all">
              Choisir →
            </div>
          </div>
        </button>

      </div>

      {/* Footer subtle highlight */}
      <div className="mt-10 text-center text-xs text-slate-400 font-medium z-10 flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-white/[0.05]">
        <span>💡 Tu peux basculer entre <strong>Clash Royale</strong> et <strong>Rocket League</strong> à tout moment depuis la barre de navigation.</span>
      </div>
    </main>
  );
};
