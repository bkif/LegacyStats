import { useState } from 'react';
import { NavTab, GameMode } from '../types';
import { playTapSound, toggleMute, getMuted } from '../utils/audio';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeGame: GameMode;
  onSelectGame: (game: GameMode) => void;
}

const CR_NAV_ITEMS: { tab: NavTab; label: string }[] = [
  { tab: 'home', label: 'Stats' },
  { tab: 'cards', label: 'Deck Builder' },
  { tab: 'description', label: 'Cartes' },
  { tab: 'news', label: 'Équilibrages' },
  { tab: 'esport', label: 'E-Sport' },
  { tab: 'clans', label: 'Clans' },
  { tab: 'crl', label: 'CRL' },
  { tab: 'contact', label: 'Contact' },
];

export const Navbar = ({ currentTab, onSelectTab, activeGame, onSelectGame }: NavbarProps) => {
  const [muted, setMuted] = useState(getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSoundToggle = () => {
    const isM = toggleMute();
    setMuted(isM);
    if (!isM) playTapSound();
  };

  const handleTabClick = (tab: NavTab) => {
    playTapSound();
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            type="button"
            className="flex items-center gap-2.5 bg-transparent border-0 p-0 text-left cursor-pointer group"
            onClick={() => onSelectGame(null)}
            aria-label="LEGACYSTATS, accueil jeux"
            title="Retour à la sélection des jeux"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 p-[1px] shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center font-black text-amber-300 text-sm tracking-wider font-display">
                LS
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base tracking-wide text-white group-hover:text-amber-300 transition-colors">
                LEGACY<span className="text-amber-400 font-black">STATS</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 -mt-0.5 tracking-wider uppercase">
                {activeGame ? 'Changer de jeu ↩' : 'Multi-Gaming'}
              </span>
            </div>
          </button>

          {/* Game Switcher (Segmented Control) */}
          <div className="hidden sm:flex items-center bg-slate-900/90 rounded-lg p-1 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => { playTapSound(); onSelectGame(null); }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeGame === null
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => { playTapSound(); onSelectGame('clash-royale'); }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeGame === 'clash-royale'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Clash Royale
            </button>
            <button
              type="button"
              onClick={() => { playTapSound(); onSelectGame('rocket-league'); }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeGame === 'rocket-league'
                  ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Rocket League
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {activeGame === 'clash-royale' && (
            <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/[0.04]">
              {CR_NAV_ITEMS.map(({ tab, label }) => {
                const isActive = currentTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => handleTabClick(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              <a
                href="https://www.youtube.com/@mhlgcr_off"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors ml-1"
              >
                YouTube
              </a>
            </div>
          )}
          {activeGame === 'rocket-league' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/40 px-3.5 py-1.5 rounded-lg border border-cyan-500/20">
                Rocket League Tracker
              </span>
              <button
                type="button"
                onClick={() => onSelectGame(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                Changer de jeu ↩
              </button>
            </div>
          )}
          {activeGame === null && (
            <div className="text-xs font-medium text-slate-400">
              Choisis un jeu ci-dessous pour commencer
            </div>
          )}
        </nav>

        {/* Right tools (Sound toggle & Mobile menu) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSoundToggle}
            className="w-9 h-9 rounded-lg bg-slate-900/80 border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 transition-all flex items-center justify-center text-xs font-bold cursor-pointer"
            title={muted ? "Activer les sons" : "Couper les sons"}
            aria-label={muted ? "Activer les sons" : "Couper les sons"}
          >
            {muted ? 'MUTED' : 'FX ON'}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg bg-slate-900/80 border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Menu de navigation"
          >
            <span className="text-lg leading-none">≡</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1.5 shadow-2xl">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.06] mb-1">
            <span className="text-xs font-semibold text-slate-400">Jeu :</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectGame(null); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${activeGame === null ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-300'}`}
              >
                Accueil
              </button>
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectGame('clash-royale'); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${activeGame === 'clash-royale' ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}
              >
                Clash Royale
              </button>
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectGame('rocket-league'); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${activeGame === 'rocket-league' ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}
              >
                Rocket League
              </button>
            </div>
          </div>
          {activeGame === 'clash-royale' && CR_NAV_ITEMS.map(({ tab, label }) => (
            <button
              key={tab}
              type="button"
              className={`flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-sm text-left transition-colors ${
                currentTab === tab
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/25'
                  : 'text-slate-300 hover:bg-white/[0.04]'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <span>{label}</span>
              {currentTab === tab && <span className="text-amber-400 text-xs">●</span>}
            </button>
          ))}
          <a
            href="https://www.youtube.com/@mhlgcr_off"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-red-400 font-semibold text-sm hover:bg-white/[0.04] rounded-lg"
          >
            <span>Chaîne YouTube officielle</span>
            <span className="text-xs">↗</span>
          </a>
        </div>
      )}
    </header>
  );
};
