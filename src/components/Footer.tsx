export const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/80 mt-auto py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-display text-white">
          <span className="text-amber-400 font-bold">LEGACY<span className="text-cyan-400">STATS</span></span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 text-xs">Analytics Multi-Gaming</span>
        </div>
        <p className="max-w-xl text-center sm:text-right text-[11px] text-slate-500 leading-relaxed m-0">
          Ce site n'est pas affilié à Supercell ni à Psyonix/Epic Games. Clash Royale et Rocket League sont des marques déposées de leurs éditeurs respectifs.
        </p>
      </div>
    </footer>
  );
};
