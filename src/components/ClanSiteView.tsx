import { useState } from 'react';
import { DEFAULT_CLAN } from '../data/clansData';
import { playTapSound } from '../utils/audio';

export const ClanSiteView = () => {
  const [clan] = useState(DEFAULT_CLAN);
  const [memberFilter, setMemberFilter] = useState('');

  const filteredMembers = clan.members.filter(m =>
    m.name.toLowerCase().includes(memberFilter.toLowerCase().trim()) ||
    m.roleLabel.toLowerCase().includes(memberFilter.toLowerCase().trim())
  );

  return (
    <main id="contenu" className="max-w-6xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          CLANS SUISSES
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Tableau de bord officiel du clan suisse TagUrTilted : trophées de guerre, dons et hiérarchie des membres.
        </p>
      </div>

      {/* Clan Hero Card */}
      <section className="bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Clan Crest */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 p-2 border-2 border-amber-400/40 flex items-center justify-center shrink-0 shadow-2xl shadow-amber-500/10">
            <span className="text-5xl">🛡️</span>
          </div>

          {/* Clan Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-display text-white">{clan.name}</h2>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                {clan.tag}
              </span>
              <span className="text-xs font-bold text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                {clan.location}
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl font-medium leading-relaxed mt-2">
              {clan.description}
            </p>
          </div>
        </div>

        {/* 5 Clan Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">Score Clan</div>
            <div className="text-lg sm:text-xl font-display text-white">{clan.clanScore.toLocaleString('fr-CH')} 🏆</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">Trophées Guerre</div>
            <div className="text-lg sm:text-xl font-display text-amber-300">{clan.clanWarTrophies.toLocaleString('fr-CH')} ⚔️</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Membres</div>
            <div className="text-lg sm:text-xl font-display text-white">{clan.membersCount} / 50</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-0.5">Dons / semaine</div>
            <div className="text-lg sm:text-xl font-display text-sky-300">{clan.donationsPerWeek.toLocaleString('fr-CH')}</div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Requis</div>
            <div className="text-lg sm:text-xl font-display text-white">{clan.requiredTrophies.toLocaleString('fr-CH')} 🏆</div>
          </div>
        </div>
      </section>

      {/* Clan Members Table Card */}
      <section className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-display text-white flex items-center gap-2">
              <span>👥</span> Effectif du Clan ({filteredMembers.length})
            </h3>
            <p className="text-xs text-slate-400 font-bold">Classé selon le ladder actuel</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="search"
              placeholder="Filtrer un membre ou rôle…"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-display text-amber-400 tracking-wider">
                <th className="py-2.5 sm:py-3 px-2 sm:px-3">#</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-3">Joueur</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-3">Rôle</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-right">Trophées</th>
                <th className="hidden md:table-cell py-2.5 sm:py-3 px-2 sm:px-3 text-right">Dons donnés</th>
                <th className="hidden md:table-cell py-2.5 sm:py-3 px-2 sm:px-3 text-right">Dons reçus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((m) => {
                const isLeader = m.role === 'leader';
                const isCoLeader = m.role === 'coLeader';
                const roleBadge = isLeader ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' : isCoLeader ? 'bg-sky-400/20 text-sky-300 border-sky-400/30' : 'bg-white/5 text-slate-400 border-white/10';

                return (
                  <tr
                    key={m.tag}
                    onClick={() => playTapSound()}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-3 font-display text-xs sm:text-sm text-slate-500 group-hover:text-amber-400">
                      {m.rank}
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-3">
                      <div className="font-extrabold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate max-w-[120px] sm:max-w-none">
                        {m.name}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-mono text-slate-500">
                        {m.tag} · Niv {m.expLevel}
                      </div>
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-3">
                      <span className={`inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold border ${roleBadge}`}>
                        {m.roleLabel}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-3 text-right font-display text-xs sm:text-sm text-amber-400 whitespace-nowrap">
                      {m.trophies.toLocaleString('fr-CH')} 🏆
                    </td>
                    <td className="hidden md:table-cell py-2.5 sm:py-3.5 px-2 sm:px-3 text-right font-bold text-slate-200">
                      {m.donations.toLocaleString('fr-CH')}
                    </td>
                    <td className="hidden md:table-cell py-2.5 sm:py-3.5 px-2 sm:px-3 text-right font-bold text-slate-400">
                      {m.donationsReceived.toLocaleString('fr-CH')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};
