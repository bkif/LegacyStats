// js/database.js — charge data/cards.json (statique, rapide)
const CARDS_URL = "data/cards.json";
// Le dossier local cards-150/ n'existe pas : on charge les images depuis le CDN RoyaleAPI
const CARD_IMG_BASE = "https://cdn.royaleapi.com/static/img/cards-150/";
const FALLBACK_IMG = "images/logo_clash_royale.png";

function cardImageUrl(card) {
    const file = String(card.image || "").split("/").pop();
    return file ? CARD_IMG_BASE + file : FALLBACK_IMG;
}

let database = null;
let loading = null;

async function loadDatabase() {
    if (database) return database;
    if (loading) return loading;

    loading = (async () => {
        try {
            const res = await fetch(CARDS_URL, { cache: "no-cache" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = await res.json();
            const cards = (raw.cards ?? raw.items ?? []).map(c => ({ ...c, image: cardImageUrl(c) }));
            database = { cards };
            return database;
        } catch (err) {
            console.error("Erreur chargement cartes :", err);
            document.body.insertAdjacentHTML(
                "afterbegin",
                `<p role="alert" style="background:#b00020;color:#fff;padding:1rem;text-align:center;margin:0">
                    Impossible de charger les cartes. Réessaie plus tard.
                </p>`
            );
            return null;
        } finally {
            loading = null;
        }
    })();

    return loading;
}