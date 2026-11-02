<div align="center">

<img src="images/logo_clash_royale.png" alt="Logo MH Legacy" width="120">

# MH Legacy

### Clash Royale Stats — le site Clash Royale suisse 🇨🇭

Cherche n'importe quel joueur, compose ton deck, explore toutes les cartes et suis l'actualité du jeu.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)

**[Fonctionnalités](#-fonctionnalités) · [Pages](#-pages) · [Design](#-design) · [Installation](#-installation) · [Structure](#-structure) · [Données](#-données-et-automatisation) · [Auteur](#-auteur)**

</div>

---

## ✨ Fonctionnalités

<table>
<tr>
<td width="50%" valign="top">

### 🔎 Recherche de joueur
Entre un tag et obtiens le profil, les trophées, le taux de victoire, le **deck actuel** (évolutions et héros mis en évidence) et les **20 derniers combats**.

</td>
<td width="50%" valign="top">

### 🧱 Deck builder
Glisse-dépose (ou clique) les cartes dans les **8 emplacements**, clic droit pour vider, et l'**élixir moyen** se calcule en direct.

</td>
</tr>
<tr>
<td valign="top">

### 🃏 Fiches des cartes
Plus de **160 cartes** (normales, évolutions, héros, champions, tours) avec recherche par nom et filtre par rareté.

</td>
<td valign="top">

### 📰 Nouveautés
Les équilibrages (nerfs 🔴, buffs 🟢, refontes 🔵) classés par saison.

</td>
</tr>
<tr>
<td valign="top">

### 🏆 E-sport & CRL
Palmarès de Team Liquid, SK Gaming et Tribe Gaming, plus les moments forts de la Clash Royale League.

</td>
<td valign="top">

### ♿ Accessible et responsive
Navigation au clavier, lien d'évitement, `aria-label`, `aria-live`, focus visible, mouvements réduits respectés, mise en page mobile.

</td>
</tr>
</table>

## 🗺️ Pages

| Page | Fichier | Contenu |
|---|---|---|
| 🏠 Accueil | `index.html` | Recherche de joueur et accès rapide |
| 🃏 Cartes | `cartes.html` | Deck builder |
| 🔎 Fiches | `description_cartes.html` | Descriptions, recherche, filtres |
| 📰 Nouveautés | `news.html` | Équilibrages par saison |
| 🏆 E-sport | `e-sport.html` | Équipes et tournois |
| 🛡️ Clans | `clan_site.html` | Page clan |
| 🎬 CRL | `crl.html` | Vidéos de la Clash Royale League |
| ✉️ Contact | `contact.html` | Formulaire et présentation de l'auteur |

## 🎨 Design

Le style s'inspire de l'arène du jeu : un fond **bleu nuit**, de l'**or royal** pour les actions et la page active, et du **rose élixir** pour les détails.

| Rôle | Couleur |
|---|---|
| Fond | `#070f2b` |
| Panneaux | `#12245f` |
| Accent principal (or) | `#ffc933` |
| Accent secondaire (élixir) | `#e03bd6` |
| Texte | `#eef3ff` |

- **Typographie :** [Bungee](https://fonts.google.com/specimen/Bungee) pour les titres (clin d'œil au jeu), [Nunito](https://fonts.google.com/specimen/Nunito) pour le texte.
- **Système de variables CSS** dans `css/style.css`, un fichier CSS par page.
- **Rareté en couleur :** bleu (commune), orange (rare), violet (épique), cyan (légendaire), or (champion et héros).
- Évolutions entourées d'une lueur rose, héros d'une lueur dorée.

## 🚀 Installation

Aucune dépendance : c'est un site statique.

```bash
git clone https://github.com/<ton-utilisateur>/<nom-du-depot>.git
cd <nom-du-depot>

# Lancer un serveur local (au choix)
npx serve .
python -m http.server 8000
```

Ouvre ensuite `http://localhost:8000`.

> ⚠️ N'ouvre pas `index.html` en double-cliquant dessus (`file://`) : le navigateur bloque le chargement des JSON. Utilise un serveur local, l'extension **Live Server** de VS Code ou **GitHub Pages**.

### Publier avec GitHub Pages

1. **Settings → Pages**
2. **Deploy from a branch**, branche `main`, dossier `/ (root)`
3. Le site est en ligne sur `https://<ton-utilisateur>.github.io/<nom-du-depot>/`

## 🧩 Structure

```text
.
├── index.html                  # Accueil + recherche de joueur
├── cartes.html                 # Deck builder
├── description_cartes.html     # Fiches des cartes
├── news.html                   # Nouveautés
├── e-sport.html                # E-sport
├── clan_site.html              # Clans
├── crl.html                    # Clash Royale League
├── contact.html                # Contact
│
├── css/
│   ├── style.css               # Design system (variables, en-tête, titres, boutons)
│   ├── home.css                # Accueil
│   ├── recherche.css           # Résultats de la recherche de joueur
│   ├── cards.css               # Deck builder
│   ├── description.css         # Fiches
│   ├── news.css                # Nouveautés
│   ├── esports.css             # E-sport et clans
│   ├── crl.css                 # Vidéos
│   ├── contact.css             # Contact
│   └── clans.css               # Tableau de clans
│
├── js/
│   ├── nav.js                  # Menu partagé entre toutes les pages
│   ├── database.js             # Chargement de data/cards.json
│   ├── cards.js                # Deck builder
│   ├── description.js          # Fiches, recherche et filtres
│   ├── recherche.js            # Stats d'un joueur (Worker + secours JSON)
│   └── stats.js                # Affichage de data/player.json
│
├── data/
│   ├── cards.json              # Base de données des cartes
│   └── player.json             # Profil du joueur (généré automatiquement)
│
├── scripts/fetch-player.js     # Récupère le profil via l'API
├── images/                     # Logos, bannières, illustrations
├── videos/                     # Vidéos du site
└── .github/workflows/
    └── update-cards.yml        # Mise à jour quotidienne de player.json
```

## 🔄 Données et automatisation

### Cartes
`data/cards.json` décrit chaque carte : `id`, nom, variante (`normal`, `evolution`, `hero`, `champion`, `tower`, `temporary`), élixir, rareté, catégorie, image et description en français.

Les images sont chargées depuis le CDN de RoyaleAPI (`cdn.royaleapi.com/static/img/cards-150/`). Pour les héberger toi-même, télécharge le dossier `cards-150` du dépôt [RoyaleAPI/cr-api-assets](https://github.com/RoyaleAPI/cr-api-assets) et change `CARD_IMG_BASE` dans `js/database.js`.

### Stats du joueur

```text
Navigateur ──► Worker Cloudflare ──► API Clash Royale
     │
     └─ si le Worker ne répond pas ──► data/player.json (profil enregistré)
```

- **En direct :** `js/recherche.js` interroge un Worker Cloudflare qui renvoie le profil et les 20 derniers combats.
- **Secours :** si le Worker est injoignable, le profil enregistré dans `data/player.json` s'affiche, sans les combats.

### Mise à jour automatique
Le workflow `.github/workflows/update-cards.yml` tourne **chaque jour à 06:00 UTC** (ou à la demande) : il lance `scripts/fetch-player.js`, met à jour `data/player.json`, puis commit et push.

Ajoute ta clé d'API dans **Settings → Secrets and variables → Actions** sous le nom `CR_API_KEY` ([RoyaleAPI](https://docs.royaleapi.com/) ou [developer.clashroyale.com](https://developer.clashroyale.com/)).

## 🛠️ Technologies

HTML5 sémantique · CSS3 (variables, grid, flexbox, `clamp()`, `backdrop-filter`) · JavaScript natif (`fetch`, glisser-déposer) · Cloudflare Workers · GitHub Actions · GitHub Pages

## 🧭 Pistes d'amélioration

- [ ] Page Clans avec les vraies données du clan
- [ ] Héberger les images des cartes en local
- [ ] Changement de saison interactif dans les Nouveautés
- [ ] Copier un deck directement vers le jeu
- [ ] Comparer deux joueurs

## 👤 Auteur

**Martin** — apprenti informaticien à l'**ETML**, passionné de jeux vidéo, créateur de vidéos Clash Royale.

[![YouTube](https://img.shields.io/badge/YouTube-@mhlgcr__off-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@mhlgcr_off)

## ⚖️ Mentions légales

Ce contenu n'est pas affilié à, sponsorisé ni spécifiquement approuvé par Supercell, et Supercell n'est pas responsable de ce contenu. Voir la [politique relative au contenu des fans](https://supercell.com/en/fan-content-policy/). Clash Royale est une marque de Supercell.

---

<div align="center">

Fait avec ❤️ en Suisse 🇨🇭

</div>