import { GameMode } from '../types';
import { playTapSound } from '../utils/audio';

interface GameSelectionLandingProps {
  onSelectGame: (game: GameMode) => void;
}

export const GameSelectionLanding = ({ onSelectGame }: GameSelectionLandingProps) => {
  const handlePick = (game: GameMode) => {
    playTapSound();
    onSelectGame(game);
  };

  return (
    <main id="contenu" className="relative flex-1 w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-amber-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Brand Title */}
      <div className="max-w-3xl mx-auto text-center relative z-10 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-xs mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Plateforme Multi-Gaming Officielle</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
          LEGACY<span className="bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400 bg-clip-text text-transparent"> STATS</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Sélectionne un jeu pour analyser en direct tes statistiques, ton historique de matchs, tes rangs et tes performances compétitives.
        </p>
      </div>

      {/* Dual Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl w-full relative z-10">
        
        {/* Card 1: Clash Royale */}
        <button
          type="button"
          onClick={() => handlePick('clash-royale')}
          className="group relative flex flex-col justify-between text-left p-7 sm:p-9 rounded-3xl bg-slate-900/60 border border-white/[0.08] hover:border-amber-400/50 hover:bg-slate-900/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
          {/* Subtle card glow on hover */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase">
                Supercell
              </span>
              <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                👑
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-amber-300 transition-colors tracking-tight">
              Clash Royale
            </h2>

            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
              Profil de joueur en temps réel, 20 derniers combats, winrate, streaks, deck builder interactif avec calcul d'élixir et encyclopédie complète.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300 mb-8">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">Deck Tracker</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">Élixir Moyen</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">Évolutions</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">E-Sport CRL</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
              Explorer les stats
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm group-hover:bg-amber-400 group-hover:text-slate-950 transition-all group-hover:translate-x-1">
              →
            </div>
          </div>
        </button>

        {/* Card 2: Rocket League */}
        <button
          type="button"
          onClick={() => handlePick('rocket-league')}
          className="group relative flex flex-col justify-between text-left p-7 sm:p-9 rounded-3xl bg-slate-900/60 border border-white/[0.08] hover:border-cyan-400/50 hover:bg-slate-900/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
          {/* Subtle card glow on hover */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full uppercase">
                Psyonix / Epic
              </span>
              <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300">
                🚀
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 group-hover:text-cyan-300 transition-colors tracking-tight">
              Rocket League
            </h2>

            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
              Suivi du MMR en direct par playlist (1v1, 2v2, 3v3), rangs compétitifs (SSL, GC, Champion), ratio de victoires, buts et historiques de matchs.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300 mb-8">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">MMR en direct</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">Playlists 1v1 / 2v2 / 3v3</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">Rangs SSL / GC</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">Multi-Plateformes</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
              Explorer les stats
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold text-sm group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all group-hover:translate-x-1">
              →
            </div>
          </div>
        </button>

      </div>

      {/* Footer subtle highlight */}
      <div className="mt-12 text-center text-xs text-slate-500 font-medium z-10 flex items-center gap-2">
        <span>Tu pourras toujours changer de jeu à tout moment depuis le menu du haut.</span>
      </div>
    </main>
  );
};
