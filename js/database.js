// js/database.js — charge les cartes depuis data/player.json ou Worker
const CARDS_URL = "data/player.json";
const CARD_IMG_BASE = "https://cdn.royaleapi.com/static/img/cards-150/";
const FALLBACK_IMG = "images/logo_clash_royale.png";

function cardImageUrl(card) {
    if (card.image && card.image.startsWith("http")) {
        return card.image;
    }
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
            
            // Récupère les cartes depuis cards, items ou deck
            const list = raw.cards ?? raw.items ?? raw.deck ?? [];
            const cards = list.map((c, idx) => ({
                id: c.id || c.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `card-${idx}`,
                name: c.name,
                elixir: c.elixir ?? c.elixirCost ?? 0,
                rarity: (c.rarity ?? "common").toLowerCase(),
                image: cardImageUrl(c),
                level: c.level,
                maxLevel: c.maxLevel,
            }));

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
