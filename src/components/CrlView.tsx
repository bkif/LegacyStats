export const CrlView = () => {
  return (
    <main id="contenu" className="max-w-5xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          CLASH ROYALE LEAGUE
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Les derniers matchs d'anthologie et moments forts des World Finals de la ligue professionnelle officielle.
        </p>
      </div>

      <div className="space-y-10">
        {/* World Finals Featured Match */}
        <section className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              🔴 MATCH HISTORIQUE
            </span>
            <span className="text-xs text-slate-400 font-bold">World Finals CRL</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display text-white mb-4">
            Mohamed Light vs Cal Sub — Finale Mondiale (Round Décisif)
          </h2>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10 shadow-2xl">
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              <source src="/videos/videoplayback.mp4" type="video/mp4" />
              <source src="/videos/New%20Champion%20Arrives!%20Little%20Prince!%20(Unlock%20for%20Free!).mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo directe.
            </video>
          </div>
        </section>

        {/* Official Broadcast Embed */}
        <section className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-display text-white mb-4 flex items-center gap-2">
            <span>📺</span> Résumé Officiel & Temps Forts
          </h2>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-white/10 shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/kQ6JXJwzcGQ"
              title="Résumé CRL World Finals"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </section>
      </div>
    </main>
  );
};
