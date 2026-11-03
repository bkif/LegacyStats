import { useState, type FormEvent } from 'react';
import { playTapSound, playCrownSound } from '../utils/audio';

export const ContactView = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    playCrownSound();
    setSubmitted(true);
    const subject = encodeURIComponent(`Message de ${name} via MH Legacy`);
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:ton.email@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <main id="contenu" className="max-w-5xl mx-auto px-4 py-10 w-full flex-1">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-5xl font-black cr-gold-text mb-3">
          CONTACT & À PROPOS
        </h1>
        <p className="text-slate-300 text-sm sm:text-base font-medium">
          Une suggestion, une question ou envie de discuter Clash Royale ? N'hésite pas à m'envoyer un message !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <section className="md:col-span-7 bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-display text-white mb-6 flex items-center gap-2">
            <span>✉️</span> Formulaire de Contact
          </h2>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 p-6 rounded-2xl text-center space-y-2">
              <div className="text-3xl">🎉</div>
              <div className="font-display text-lg">Message Préparé !</div>
              <p className="text-xs text-slate-300">
                Merci {name} ! Ton application de messagerie par défaut s'est ouverte pour transmettre ton message.
              </p>
              <button
                type="button"
                onClick={() => { playTapSound(); setSubmitted(false); }}
                className="cr-btn-secondary text-xs mt-3"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ton Nom ou Pseudo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Ex: Martin, Tag™"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ton Adresse Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="exemple@domaine.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Ton retour, une idée de deck ou un message sympa…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium resize-y"
                />
              </div>

              <button
                type="submit"
                className="cr-btn-primary w-full mt-2"
              >
                🚀 Envoyer le Message
              </button>
            </form>
          )}
        </section>

        {/* About Card (5 cols) */}
        <section className="md:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl text-center backdrop-blur-md">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-b from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 mx-auto">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-4xl">
                🇨🇭
              </div>
            </div>
            <span className="absolute bottom-0 right-0 text-xl">🎮</span>
          </div>

          <h2 className="text-xl font-display text-white mb-2">À Propos du Projet</h2>
          <p className="text-xs text-amber-300 font-extrabold uppercase tracking-wider mb-4">
            MH Legacy · Clash Royale Suisse
          </p>

          <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">
            Je suis apprenti informaticien à l’ETML (Lausanne, Suisse 🇨🇭), passionné de jeux vidéo et d'e-sport. Je partage régulièrement des vidéos et astuces Clash Royale sur YouTube.
          </p>

          <div className="pt-4 border-t border-white/10">
            <a
              href="https://www.youtube.com/@mhlgcr_off"
              target="_blank"
              rel="noopener noreferrer"
              className="cr-btn-primary w-full !bg-gradient-to-r !from-red-600 !to-rose-600 !text-white text-xs"
            >
              ▶ Découvrir la Chaîne YouTube
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};
