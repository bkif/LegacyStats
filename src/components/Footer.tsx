export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 mt-auto py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-display text-white">
          <span className="text-amber-400">👑</span>
          <span>MH LEGACY · CLASH ROYALE SUISSE 🇨🇭</span>
        </div>
        <p className="max-w-xl text-center sm:text-right text-[11px] text-slate-400 leading-relaxed m-0">
          Ce contenu n’est pas affilié à, sponsorisé ni spécifiquement approuvé par Supercell,
          et Supercell n’est pas responsable de ce contenu. Clash Royale est une marque de Supercell.
        </p>
      </div>
    </footer>
  );
};
