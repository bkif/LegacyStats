import { useState, useEffect } from 'react';
import { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DeckBuilderView } from './components/DeckBuilderView';
import { CardsDescriptionView } from './components/CardsDescriptionView';
import { NewsView } from './components/NewsView';
import { EsportView } from './components/EsportView';
import { ClanSiteView } from './components/ClanSiteView';
import { CrlView } from './components/CrlView';
import { ContactView } from './components/ContactView';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>(() => {
    // Check initial hash or pathname
    const hash = window.location.hash.replace('#', '') as NavTab;
    const validTabs: NavTab[] = ['home', 'cards', 'description', 'news', 'esport', 'clans', 'crl', 'contact'];
    if (validTabs.includes(hash)) {
      return hash;
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavTab;
      const validTabs: NavTab[] = ['home', 'cards', 'description', 'news', 'esport', 'clans', 'crl', 'contact'];
      if (validTabs.includes(hash)) {
        setCurrentTab(hash);
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

  return (
    <>
      <a className="skip" href="#contenu">Aller au contenu</a>

      <Navbar currentTab={currentTab} onSelectTab={handleSelectTab} />

      {currentTab === 'home' && <HomeView onNavigate={handleSelectTab} />}
      {currentTab === 'cards' && <DeckBuilderView />}
      {currentTab === 'description' && <CardsDescriptionView />}
      {currentTab === 'news' && <NewsView />}
      {currentTab === 'esport' && <EsportView />}
      {currentTab === 'clans' && <ClanSiteView />}
      {currentTab === 'crl' && <CrlView />}
      {currentTab === 'contact' && <ContactView />}

      <Footer />
    </>
  );
}

export default App;
