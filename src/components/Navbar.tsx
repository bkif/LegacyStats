import { useState } from 'react';
import { NavTab } from '../types';
import { playTapSound, toggleMute, getMuted } from '../utils/audio';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const NAV_ITEMS: { tab: NavTab; label: string; icon: string }[] = [
  { tab: 'home', label: 'Accueil', icon: '🏰' },
  { tab: 'cards', label: 'Deck Builder', icon: '🃏' },
  { tab: 'description', label: 'Fiches', icon: '🔎' },
  { tab: 'news', label: 'Équilibrages', icon: '⚡' },
  { tab: 'esport', label: 'E-Sport', icon: '🏆' },
  { tab: 'clans', label: 'Clans', icon: '🛡️' },
  { tab: 'crl', label: 'CRL', icon: '🎬' },
  { tab: 'contact', label: 'Contact', icon: '✉️' },
];

export const Navbar = ({ currentTab, onSelectTab }: NavbarProps) => {
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
        {/* Brand */}
        <button
          type="button"
          className="flex items-center gap-3 bg-transparent border-0 p-0 text-left cursor-pointer group"
          onClick={() => handleTabClick('home')}
          aria-label="MH Legacy, accueil"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-amber-300 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
          </div>
          <div>
            <div className="font-display text-base tracking-wide cr-gold-text leading-none">
              MH LEGACY
            </div>
            <div className="text-[11px] font-bold text-slate-400 tracking-wider flex items-center gap-1 mt-0.5">
              <span>CLASH ROYALE</span>
              <span>🇨🇭</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 nav-links" aria-label="Navigation principale">
          {NAV_ITEMS.map(({ tab, label, icon }) => (
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
          {NAV_ITEMS.map(({ tab, label, icon }) => (
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
