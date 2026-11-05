import { useState, useEffect } from 'react';
import { NavTab, GameMode } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GameSelectionLanding } from './components/GameSelectionLanding';
import { HomeView } from './components/HomeView';
import { DeckBuilderView } from './components/DeckBuilderView';
import { CardsDescriptionView } from './components/CardsDescriptionView';
import { NewsView } from './components/NewsView';
import { EsportView } from './components/EsportView';
import { ClanSiteView } from './components/ClanSiteView';
import { CrlView } from './components/CrlView';
import { ContactView } from './components/ContactView';
import { RocketLeagueView } from './components/RocketLeagueView';

export function App() {
  const [activeGame, setActiveGame] = useState<GameMode>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'rocket-league') return 'rocket-league';
    if (['clash-royale', 'cards', 'description', 'news', 'esport', 'clans', 'crl', 'contact'].includes(hash)) {
      return 'clash-royale';
    }
    // Par défaut à l'arrivée : page d'accueil de sélection de jeu
    return null;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    const hash = window.location.hash.replace('#', '') as NavTab;
    const validTabs: NavTab[] = ['home', 'cards', 'description', 'news', 'esport', 'clans', 'crl', 'contact', 'rocket-league'];
    if (validTabs.includes(hash)) {
      return hash;
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavTab;
      if (hash === 'rocket-league') {
        setActiveGame('rocket-league');
        setCurrentTab('rocket-league');
      } else if (['cards', 'description', 'news', 'esport', 'clans', 'crl', 'contact'].includes(hash)) {
        setActiveGame('clash-royale');
        setCurrentTab(hash);
      } else if (hash === 'clash-royale' || hash === 'home') {
        setActiveGame('clash-royale');
        setCurrentTab('home');
      } else if (hash === 'select' || hash === '') {
        setActiveGame(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGame = (game: GameMode) => {
    setActiveGame(game);
    if (game === 'rocket-league') {
      setCurrentTab('rocket-league');
      window.location.hash = 'rocket-league';
    } else if (game === 'clash-royale') {
      setCurrentTab('home');
      window.location.hash = 'home';
    } else {
      window.location.hash = 'select';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <a className="skip" href="#contenu">Aller au contenu</a>

      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeGame={activeGame}
        onSelectGame={handleSelectGame}
      />

      {/* Main Content Router */}
      {activeGame === null ? (
        <GameSelectionLanding onSelectGame={handleSelectGame} />
      ) : activeGame === 'rocket-league' ? (
        <RocketLeagueView />
      ) : (
        <>
          {currentTab === 'home' && <HomeView onNavigate={handleSelectTab} />}
          {currentTab === 'cards' && <DeckBuilderView />}
          {currentTab === 'description' && <CardsDescriptionView />}
          {currentTab === 'news' && <NewsView />}
          {currentTab === 'esport' && <EsportView />}
          {currentTab === 'clans' && <ClanSiteView />}
          {currentTab === 'crl' && <CrlView />}
          {currentTab === 'contact' && <ContactView />}
        </>
      )}

      <Footer />
    </>
  );
}

export default App;
