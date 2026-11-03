<div align="center">

# ⚔️ MH Legacy — Clash Royale Stats & Deck Builder 🇨🇭

<p align="center">
  <strong>Plateforme web interactive et moderne pour les joueurs Clash Royale, propulsée par React 19, Tailwind CSS v4 et l'API officielle Supercell.</strong>
</p>

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-Serverless-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Supercell API](https://img.shields.io/badge/Supercell_API-Official-FF004F?style=for-the-badge&logo=game-and-watch&logoColor=white)](https://developer.clashroyale.com/)

[Fonctionnalités](#-fonctionnalités-clés) • [Architecture](#-architecture-technique) • [Installation](#-installation--démarrage) • [API & Endpoints](#-api--cloudflare-worker) • [Captures & Démo](#-aperçu)

---

</div>

## 🌟 Présentation

**MH Legacy** est une application web ultra-fluide conçue pour offrir aux joueurs et passionnés d'e-sport Clash Royale une expérience digne du jeu original. 

L'application élimine tout stockage local d'images : **100% des visuels de cartes, évolutions et héros sont récupérés dynamiquement en haute résolution depuis l'API officielle de Clash Royale** via un proxy haute performance Cloudflare Worker.

---

## ⚡ Fonctionnalités Clés

### 🔍 1. Recherche de Joueur en Temps Réel
- Recherche instantanée par Tag de joueur (ex: `#V9JJGLL0G`).
- Statistiques complètes : trophées actuels, record de trophées, victoires, victoires à 3 couronnes, ratio V/D calculé automatiquement, niveau de tour et ligue classée.
- Visualisation interactive du **deck actif** et de la troupe de tour.
- **Historique des combats récents** avec score des couronnes, cartes jouées et composition complète de l'adversaire.
- Explorateur de collection avec niveaux de cartes actuels et cartes débloquées.

### 🃏 2. Deck Builder Interactif
- **Glisser-déposer (Drag & Drop)** et sélection au clic pour composer votre deck de 8 cartes.
- **Calcul en temps réel de l'élixir moyen**.
- Système de filtres par rareté (*Commune, Rare, Épique, Légendaire, Champion, Héros, Tour*) et recherche par nom.
- **Lien profond Clash Royale** (`clashroyale://copyDeck?deck=...`) pour exporter et importer directement votre deck dans le jeu mobile en un clic !
- Effets sonores intégrés synthétisés en Web Audio API (placement de carte, sons de victoire).

### 📖 3. Encyclopédie & Description des Cartes
- Catalogue complet de toutes les cartes du jeu synchronisé en direct avec l'API Supercell.
- Vue détaillée de chaque carte avec coût d'élixir, description officielle, rareté, statistiques de niveau et badge de rôle.
- Support natif des **Évolutions de cartes** et des **Héros**.

### 🏆 4. E-Sport, CRL & Clans
- **E-Sport Hub** : classement et profils des grandes écuries mondiales (*Team Liquid, SK Gaming, Tribe Gaming, Team Queso, etc.*).
- **Clash Royale League (CRL)** : calendrier des championnats, événements en direct et streams officiels.
- **Système de Clan** : gestion et classement du clan suisse *TagUrTilted*, suivi des trophées de guerre, des rôles et des dons hebdomadaires.

### 📰 5. Actualités & Équilibrages
- Suivi des dernières saisons Clash Royale, buffs, nerfs, refontes de cartes et notes de patch officielles.

---

## 🏗️ Architecture Technique

```
┌────────────────────────────────────────────────────────┐
│                   Navigateur Client                    │
│      React 19 + TypeScript + Vite + Tailwind CSS 4     │
│       Audio FX (Web Audio API) + Drag-and-Drop         │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            │ Requêtes API                   │ Images officielles
            ▼                                ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│  Cloudflare Worker Proxy     │ │   Supercell Assets CDN       │
│  (Cache, CORS, Rate Limit)   │ │  api-assets.clashroyale.com  │
│  cr-stats.pm00buq.workers.dev│ └──────────────────────────────┘
└───────────┬──────────────────┘
            │
            ▼
┌──────────────────────────────┐
│  Supercell Clash Royale API  │
│   api.clashroyale.com/v1     │
└──────────────────────────────┘
```

### 🖼️ Gestion des Images Zéro Local
- **Source primaire** : Les URLs officielles fournies par Supercell (`https://api-assets.clashroyale.com/cards/300/...`).
- **Proxy de secours** : En cas de blocage CORS ou de restriction de referrer par le navigateur, le worker relaie l'image de manière transparente via `?image=<url>`.
- **CDN Fallback** : Fallback CDN haute résolution RoyaleAPI.
- **SVG procédural** : En cas de coupure réseau totale, un badge vectoriel SVG autonome est généré côté client.

---

## 🚀 Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- Un gestionnaire de paquets (`npm`, `pnpm` ou `bun`)

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-compte/P_Prod-Martin-Clash-Royale-Stats.git
cd P_Prod-Martin-Clash-Royale-Stats
```

### 2. Installer les dépendances
```bash
npm install
# ou
pnpm install
# ou
bun install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
L'application démarre immédiatement sur `http://localhost:3000`.

### 4. Compiler pour la production
```bash
npm run build
```
Les fichiers statiques optimisés seront générés dans le dossier `dist/`.

---

## 📡 API & Cloudflare Worker

Le projet s'appuie sur un worker Cloudflare serverless assurant la sécurité de la clé API Supercell et les en-têtes CORS :

| Endpoint | Méthode | Paramètres | Description |
| :--- | :--- | :--- | :--- |
| `/?tag={TAG}` | `GET` | `tag` : Tag joueur sans `#` | Retourne le profil, les statistiques et les 25 derniers combats |
| `/cards` | `GET` | Aucun | Retourne la liste complète des cartes avec visuels, évolutions et héros |
| `/?image={URL}` | `GET` | `image` : URL encodée | Proxy d'image transparent pour contourner les restrictions CORS |

---

## 📁 Structure du Projet

```text
├── src/
│   ├── components/          # Composants React de l'interface
│   │   ├── CardImage.tsx             # Gestionnaire d'image résilient avec fallbacks
│   │   ├── CardsDescriptionView.tsx  # Encyclopédie interactive des cartes
│   │   ├── ClanSiteView.tsx          # Gestion et vue détaillée du clan
│   │   ├── ContactView.tsx           # Page de contact
│   │   ├── CrlView.tsx               # Hub Clash Royale League
│   │   ├── DeckBuilderView.tsx       # Constructeur de deck drag-and-drop
│   │   ├── EsportView.tsx            # Équipes et classements e-sport
│   │   ├── Footer.tsx                # Pied de page
│   │   ├── HomeView.tsx              # Tableau de bord principal du joueur
│   │   ├── Navbar.tsx                # Barre de navigation responsive
│   │   └── NewsView.tsx              # Actualités et notes de patch
│   ├── data/                # Données initiales & connecteurs API
│   │   ├── cardImages.ts             # Résolution des slugs et mappings CDN
│   │   ├── cardsData.ts              # Fetcher de cartes officielles Supercell
│   │   ├── clansData.ts              # Données des clans
│   │   ├── newsData.ts               # Actualités & équilibrages
│   │   └── playerData.ts             # Profils et données de combat
│   ├── utils/
│   │   └── audio.ts                  # Synthétiseur sonore Web Audio API
│   ├── App.tsx              # Routeur par onglets avec conservation d'historique
│   ├── main.tsx             # Point d'entrée React 19
│   ├── index.css            # Styles Tailwind CSS v4 & animations arcade
│   └── types.ts             # Définitions TypeScript strictes
├── index.html               # Document HTML principal
├── package.json             # Scripts et dépendances
├── tsconfig.json            # Configuration TypeScript
└── vite.config.ts           # Configuration du bundler Vite
```

---

## 🎨 Design & Immersion

- **Thème Royal Arcade** : Palette sombre (`slate-950`) rehaussée de dorures légendaires et de reflets d'élixir magenta.
- **Typographie Officielle** : Polices Google Fonts *Bungee* et *Nunito* pour un rendu fidèle à l'interface originale de Clash Royale.
- **Audio Feedback** : Sons de drop, de clic et de couronnes joués nativement sans fichiers audio lourds grâce à l'API Web Audio.
- **Accessibilité** : Liens d'évitement, balises sémantiques, attributs ARIA complets et compatibilité navigation clavier.

---

## 📄 Licence & Crédits

Ce projet est un projet communautaire non officiel. Tous les contenus, images, cartes et éléments de propriété intellectuelle Clash Royale sont la propriété exclusive de **© Supercell Oy**.

Développé avec passion pour la communauté Clash Royale Suisse 🇨🇭 et internationale.
