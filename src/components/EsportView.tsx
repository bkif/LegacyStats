interface TeamItem {
  name: string;
  logo: string;
  tagline: string;
  earnings: string;
  tournaments: string;
  viewersRecord: string;
  titles: string;
  website?: string;
  color: string;
}

const TEAMS: TeamItem[] = [
  {
    name: 'Team Liquid',
    logo: 'https://cdn.royaleapi.com/static/img/teams/team-liquid.png',
    tagline: 'Légendes mondiales CRL & multiples champions',
    earnings: '$411,489',
    tournaments: '8 tournois majeurs',
    viewersRecord: '133 046',
    titles: 'Vainqueur CRL West 2019, Finaliste Mondial',
    website: 'https://teamliquid.com',
    color: 'from-blue-600/20 to-sky-500/10'
  },
  {
    name: 'SK Gaming',
    logo: 'https://cdn.royaleapi.com/static/img/teams/sk-gaming.png',
    tagline: 'Organisation dominante européenne CRL',
    earnings: '$609,129',
    tournaments: '40+ tournois officiels',
    viewersRecord: '228 608',
    titles: 'Multiples titres européens et World Finals',
    website: 'https://sk-gaming.com',
    color: 'from-blue-700/20 to-indigo-500/10'
  },
  {
    name: 'Tribe Gaming',
    logo: 'https://cdn.royaleapi.com/static/img/teams/tribe-gaming.png',
    tagline: 'Équipe nord-américaine emblématique',
    earnings: '$293,934',
    tournaments: '32 tournois officiels',
    viewersRecord: '133 046',
    titles: 'Champions d\'Amérique du Nord CRL',
    website: 'https://tribegaming.gg',
    color: 'from-red-600/20 to-orange-500/10'
  },
  {
    name: 'Team Queso',
    logo: 'https://cdn.royaleapi.com/static/img/teams/team-queso.png',
    tagline: 'Pionniers de la scène hispanique et internationale',
    earnings: '$340,000',
    tournaments: '25 tournois officiels',
    viewersRecord: '185 000',
    titles: 'Champions CRL World Finals 2020',
    website: 'https://teamqueso.com',
    color: 'from-amber-600/20 to-yellow-500/10'
  },
  {
    name: 'Nova Esports',
    logo: 'https://cdn.royaleapi.com/static/img/teams/nova-esports.png',
    tagline: 'Premiers Champions du Monde de l\'histoire de CRL',
    earnings: '$750,000+',
    tournaments: 'Championnats d\'Asie et Mondiaux',
    viewersRecord: '312 000',
    titles: 'Champions du Monde CRL 2018 (Tokyo)',
    website: 'https://novaesports.com',
    color: 'from-purple-600/20 to-pink-500/10'
  },
  {
    name: 'NRG Esports',
    logo: 'https://cdn.royaleapi.com/static/img/teams/nrg.png',
    tagline: 'Puissance nord-américaine compétitive',
    earnings: '$180,000',
    tournaments: '15 tournois officiels',
    viewersRecord: '110 000',
    titles: 'Top podium CRL Amérique',
    website: 'https://nrg.gg',
    color: 'from-rose-600/20 to-red-500/10'
  }
];

export const EsportView = () => {
  return (
    <main id="contenu" className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          SCÈNE E-SPORT
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Retrouve les structures e-sport historiques et les équipes professionnelles qui ont marqué la Clash Royale League.
        </p>
      </div>

      {/* Teams Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Équipes">
        {TEAMS.map((team) => (
          <article
            key={team.name}
            className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-amber-400/40 hover:-translate-y-1 transition-all group"
          >
            <div>
              {/* Team Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 p-2 border border-white/10 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <img
                    src={team.logo}
                    alt={`Logo ${team.name}`}
                    loading="lazy"
                    className="max-h-12 max-w-12 object-contain"
                    onError={(e) => {
                      // Fallback text if CDN blocked
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="font-display text-lg text-amber-400">{team.name.slice(0, 2)}</span>
                </div>

                <div>
                  <h2 className="text-xl font-display text-white group-hover:text-amber-300 transition-colors">
                    {team.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 leading-snug">
                    {team.tagline}
                  </p>
                </div>
              </div>

              {/* Stats Box */}
              <div className="bg-slate-950/70 rounded-2xl p-4 border border-white/5 space-y-2.5 mb-4 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Cashprize estimé :</span>
                  <span className="font-display text-amber-400 text-sm">{team.earnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tournois disputés :</span>
                  <span className="text-slate-200">{team.tournaments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Record spectateurs :</span>
                  <span className="text-sky-300">{team.viewersRecord}</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 font-semibold">
                  🏆 {team.titles}
                </div>
              </div>
            </div>

            {team.website && (
              <a
                href={team.website}
                target="_blank"
                rel="noopener noreferrer"
                className="cr-btn-secondary text-xs text-center w-full block font-extrabold"
              >
                Visiter le site officiel ↗
              </a>
            )}
          </article>
        ))}
      </section>
    </main>
  );
};
