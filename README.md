# Nuit de l'Info 2025 — Le dernier rempart

Projet réalisé par Pierre Constantin et Baptiste Giacchero dans le cadre de la Nuit de l'Info 2025.

Résumé
-------
Ce dépôt rassemble une petite expérience interactive autour de l'Open Source et des bonnes pratiques :

- Une carte interactive du village (`index.html`) où chaque zone mène à un mini-projet.
- Un `Grand Arbre` présentant nos valeurs (open source, sobriété, accessibilité).
- Une `Machine Rube Goldberg` ludique qui délivre un mot de passe pour débloquer un mini-jeu Snake caché.
- Un `Visualizer` audio avec la mascotte VLCIX qui pulse selon le son.
- Un chatbot « administratus » (le Romain) qui répond : il tente d'interroger une API locale, sinon utilise des réponses humoristiques en dur.

Comment lancer localement
------------------------
- Serveur statique simple (recommandé pour la présentation rapide) :

```bash
cd "/Users/piero/Documents/nuit de linfo v2"
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

- Si vous voulez tester l'API du chatbot (`/api/roman`) : démarrez le serveur Node (si configuré)
  ```bash
  node server.js
  ```
  Note : si `node server.js` échoue localement, le chatbot bascule automatiquement sur des réponses locales (fallback) — pas de blocage pour la démo.

Arborescence importante
----------------------
- `index.html` : page principale (carte du village)
- `grand-arbre/` : page d'information et styles dédiés
- `rube-goldberg/` : machine Rube Goldberg, lanceur et logique
- `foret/` : page intermédiaire (redirige maintenant vers la machine)
- `visualizer/` : visualiseur audio (VLCIX)
- `roman/` : chatbot (administratus)

Notes rapides
-------------
- Le chatbot essaie d'appeler `/api/roman`. Si l'appel échoue (pas de serveur Node ou erreur), il choisit au hasard une des réponses humoristiques en dur pour la démo.
- La machine Rube Goldberg redirige désormais vers la page d'accueil une fois terminée (comportement adapté pour la démo).

Fichiers explicatifs par défi
----------------------------
Voir le dossier `docs/` pour une description par défi :

- `docs/snake.md` — Snake caché et comment le débloquer
- `docs/rube-goldberg.md` — Machine Rube Goldberg
- `docs/visualizer.md` — Visualizer audio et VLCIX
- `docs/chatbot.md` — Chatbot administratus et fallback
- `docs/talents.md` — Carte des talents

Licence
-------
Ce projet de démonstration est soumis à la licence choisie par les auteurs. Contactez les auteurs pour plus d'informations.

Crédits
-------
Pierre Constantin — Développement front, assets, scénarios
Baptiste Giacchero — Intégration JS, machine Rube Goldberg, UX
# Nuit de l'Info - Village Open (Prototype)

Scaffold minimal pour la page principale du projet. Serveur Node.js + pages statiques.

Installation et démarrage

```bash
cd '/Users/piero/Documents/nuit de linfo v2'
npm install
npm start
```

Le serveur sert les fichiers statiques depuis `public/`. La page principale est `http://localhost:3000/`.

Structure utile
- `server.js` : serveur Express simple
- `public/index.html` : page d'accueil (village)
- `public/roman.html` : page du "Romain emprisonné" (chat simulé)
- `public/styles.css`, `public/app.js`
- `public/assets/` : placeholders SVG et images

Fournir des assets
- Chatbot avatar: `public/assets/avatar.svg` ou `avatar.png` (512×512, fond transparent)
- Hero: `public/assets/hero-bg.svg` ou `hero-bg.webp` (large, ~1920px)
- Visualizer decorations: `public/assets/visualizer-*.svg`

Assets PNG (conseillé)
- `public/assets/administratus.png` : avatar du chatbot (préférable). Taille recommandée: 512×512 ou 256×256. Fond transparent (PNG-24) si possible. If absent, `administratus.svg` will be used as fallback.
- `public/assets/estrade.png` : fond / estrade derrière le chat. Taille recommandée: width >= 1200px, height ~200-600px depending on the design. A `estrade.svg` fallback is included.

Remarques
- Le code tente d'abord `administratus.png` puis, en cas d'erreur de chargement, `administratus.svg`.
- Pour que la page soit lisible, le chat est affiché semi-transparent par-dessus l'estrade. Si tu ajoutes tes PNG, place-les dans `public/assets/`.

API Chatbot (Hugging Face)

API Chatbot (Hugging Face)

La route `/api/roman` peut relayer les messages vers l'API Hugging Face. Pour l'activer, définis la variable d'environnement `HF_API_KEY` avec ta clé Hugging Face. Tu peux aussi choisir le modèle via `HF_MODEL` (ex: `tiiuae/falcon-7b-instruct`).

Quota & contrôle des coûts
- Le serveur implémente un quota mensuel persistant (compte de nombres d'appels HF). Configure la limite via la variable d'environnement `MAX_HF_CALLS_PER_MONTH` (par défaut 500). Le compteur est stocké dans `usage.json` et se réinitialise automatiquement au début du mois.
- Si la limite est atteinte, le serveur renverra HTTP 429 pour `/api/roman` jusqu'au début du mois suivant.

Mode test local
- Si tu veux tester sans clé, définis `MOCK_HF=true` dans l'environnement : le serveur retournera des réponses simulées et incrémentera le compteur (utile pour valider l'UI et le suivi d'usage sans appeler l'API réelle).

Administration
- Un endpoint protégé `GET /admin/usage` permet de consulter l'usage courant (en-tête `x-admin-token` doit contenir la valeur `ADMIN_TOKEN` définie en env). Exemple :

```bash
curl -H "x-admin-token: $ADMIN_TOKEN" http://localhost:3000/admin/usage
```

Important — disponibilité & coût
- L'utilisation de l'API Hugging Face nécessite une clé et peut consommer des crédits selon ton plan. Il peut exister un petit quota gratuit, mais ce n'est pas garanti pour tous les modèles et pour une utilisation publique soutenue. Si tu héberges le site et que le serveur appelle l'API, les appels seront facturés au compte lié à la clé `HF_API_KEY`.
- La disponibilité de l'API dépend du service Hugging Face (SLA, limitations pour modèles privés, et possibilités de mise en pause par les mainteneurs du modèle). Ce n'est pas garanti indéfiniment et peut changer.

Recommandations
- Ne mets jamais ta clé dans le frontend. Garde-la côté serveur (ici `HF_API_KEY`).
- Ajoute des garde-fous : rate-limiting (déjà en place), cache des réponses fréquentes, et limites par utilisateur pour maîtriser les coûts.
- Si tu veux éviter les coûts/opérations externes, considère l'option locale (télécharger un modèle quantifié ggml et servir localement). Cela coûte en espace disque et ressources CPU mais évite la facturation d'API.

Prochaine étape
- Remplacer les placeholders par tes assets graphiques, puis j'améliore les animations, l'accessibilité et l'intégration du visualizer audio.
