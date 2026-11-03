---
name: token-saver
description: >-
  Active ce skill pour optimiser la consommation de tokens lors des réponses et des opérations de code.
  À utiliser pour des réponses ultra-concises, des lectures de fichiers ciblées, des diffs minimaux et la réduction d'entropie dans le contexte.
---

# Token Saver & Context Optimization Protocol

Ce protocole fournit les directives pour minimiser strictement l'utilisation des tokens d'entrée (input context) et de sortie (generation).

## 1. Principes de Réponse (Output Tokens)
- **Concise & Directe** : Pas d'introduction polie, d'amabilités ou de conclusions superflues ("En espérant que cela vous aide...").
- **Explications minimales** : Donner directement le résultat, la commande ou le bloc de code modifié sans paraphraser ce que fait le code.
- **Diffs & Éditions ciblées** : Utiliser `edit_file` pour des modifications précises au lieu de réécrire des fichiers complets avec `write_file`.
- **Éviter les répétitions** : Ne jamais réécrire un fichier ou une commande déjà présente dans le contexte sans raison stricte.

## 2. Optimisation des Outils & Fichiers (Input / Context Tokens)
- **Lectures ciblées (`read_file`)** : Toujours utiliser `StartLine` et `EndLine` pour ne lire que la portion nécessaire du fichier (max 50-100 lignes) au lieu de charger des fichiers entiers de 800 lignes.
- **Commandes silencieuses (`run_command`)** :
  - Filtrer la sortie des commandes (ex. `git status -s`, `Select-Object -First 10`, `head`, `tail`).
  - Éviter d'exécuter des commandes qui dumpent des milliers de lignes de logs ou de dépendances dans le contexte.
- **Délégation ponctuelle** :
  - Si une recherche massive est nécessaire dans la base de code, privilégier le subagent `research` pour éviter d'inonder le contexte principal.

## 3. Gestion des Conversations & Long Term
- Suggérer à l'utilisateur d'utiliser `/compact` lorsque la conversation devient longue et dépasse l'historique nécessaire.
