import { useState } from 'react';
import { NavTab } from '../types';
import { playTapSound, toggleMute, getMuted } from '../utils/audio';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeGame: 'clash-royale' | 'rocket-league';
  onSelectGame: (game: 'clash-royale' | 'rocket-league') => void;
}

const CR_NAV_ITEMS: { tab: NavTab; label: string; icon: string }[] = [
  { tab: 'home', label: 'Stats CR', icon: '🏰' },
  { tab: 'cards', label: 'Deck Builder', icon: '🃏' },
  { tab: 'description', label: 'Fiches', icon: '🔎' },
  { tab: 'news', label: 'Équilibrages', icon: '⚡' },
  { tab: 'esport', label: 'E-Sport', icon: '🏆' },
  { tab: 'clans', label: 'Clans', icon: '🛡️' },
  { tab: 'crl', label: 'CRL', icon: '🎬' },
  { tab: 'contact', label: 'Contact', icon: '✉️' },
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
    <header className="top">
      <div className="bar">
        {/* Brand LEGACYSTATS */}
        <button
          type="button"
          className="flex items-center gap-2.5 sm:gap-3 bg-transparent border-0 p-0 text-left cursor-pointer group shrink-0"
          onClick={() => handleTabClick('home')}
          aria-label="LEGACYSTATS, accueil"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-fuchsia-500 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-white text-base">
              LS
            </div>
          </div>
          <div>
            <div className="font-display text-base sm:text-lg tracking-wider cr-gold-text leading-none flex items-center gap-1.5">
              <span>LEGACYSTATS</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-wider flex items-center gap-1.5 mt-0.5">
              <span className="text-amber-400">CLASH ROYALE</span>
              <span>•</span>
              <span className="text-cyan-400">ROCKET LEAGUE</span>
            </div>
          </div>
        </button>

        {/* Global Game Selector */}
        <div className="flex items-center rounded-xl bg-slate-950/80 p-1 border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => { playTapSound(); onSelectGame('clash-royale'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeGame === 'clash-royale'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👑</span>
            <span className="hidden sm:inline">Clash Royale</span>
          </button>
          <button
            type="button"
            onClick={() => { playTapSound(); onSelectGame('rocket-league'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeGame === 'rocket-league'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚀</span>
            <span className="hidden sm:inline">Rocket League</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 nav-links" aria-label="Navigation principale">
          {activeGame === 'clash-royale' && (
            <>
              {CR_NAV_ITEMS.map(({ tab, label, icon }) => (
                <button
                  key={tab}
                  type="button"
                  className={currentTab === tab ? 'active' : ''}
                  aria-current={currentTab === tab ? 'page' : undefined}
                  onClick={() => handleTabClick(tab)}
                >
                  <span className="mr-1.5 opacity-80">{icon}</span>
                  {label}
                </button>
              ))}
              <a
                href="https://www.youtube.com/@mhlgcr_off"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-full text-xs font-black bg-red-500/10 border border-red-500/20 ml-2"
              >
                <span>▶</span>
                <span>YouTube</span>
                <span className="sr"> (nouvel onglet)</span>
              </a>
            </>
          )}
          {activeGame === 'rocket-league' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-full border border-cyan-500/30">
                🚀 Tracker Rocket League Actif
              </span>
            </div>
          )}
        </nav>

        {/* Actions (Sound toggle & Mobile menu) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSoundToggle}
            className="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors text-sm cursor-pointer"
            title={muted ? "Activer les sons" : "Couper les sons"}
            aria-label={muted ? "Activer les sons" : "Couper les sons"}
          >
            {muted ? '🔇' : '🔊'}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-amber-400 text-sm cursor-pointer"
            aria-label="Menu de navigation"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1 shadow-2xl">
          <div className="flex items-center justify-between py-2 border-b border-white/10 mb-2">
            <span className="text-xs font-bold text-slate-400">Jeu sélectionné :</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectGame('clash-royale'); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded text-xs font-black ${activeGame === 'clash-royale' ? 'bg-amber-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}
              >
                👑 CR
              </button>
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectGame('rocket-league'); setMobileMenuOpen(false); }}
                className={`px-2.5 py-1 rounded text-xs font-black ${activeGame === 'rocket-league' ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}
              >
                🚀 RL
              </button>
            </div>
          </div>
          {activeGame === 'clash-royale' && CR_NAV_ITEMS.map(({ tab, label, icon }) => (
            <button
              key={tab}
              type="button"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-left transition-colors ${
                currentTab === tab
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
          <a
            href="https://www.youtube.com/@mhlgcr_off"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 text-red-400 font-bold text-sm"
          >
            <span>▶</span>
            <span>Chaîne YouTube officielle</span>
          </a>
        </div>
      )}
    </header>
  );
};
