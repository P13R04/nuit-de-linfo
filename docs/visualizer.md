# Défi : Visualizer audio (VLCIX)

Idée
-----
Un visualiseur audio qui affiche des barres sonores et pulse la mascotte `VLCIX` en fonction de l'analyse de fréquence (Web Audio API).

Lien avec le défi
------------------
- Met en avant le travail sur le son dans le navigateur, optimisation visuelle et animations CSS/JS.
- C'est un composant visuel intéressant à montrer lors d'une démo en direct.

Ce qui marche
--------------
- L'analyse audio fonctionne pour des sources (samples) et le micro si l'utilisateur autorise l'accès.
- Le rendu canvas dessine des barres et crée un effet de glow ; la mascotte `VLCIX` pulse correctement.

Limitations / Ce qu'on n'a pas fait
----------------------------------
- Correction importante : la constante `MIN_BAR_HEIGHT` était mal placée dans le code et pouvait générer une erreur de portée. Nous avons déplacé sa déclaration pour éviter les ReferenceError.
- Pas d'optimisation serveur ni de streaming audio distant — c'est volontaire pour garder la démo locale et légère.

Fichiers principaux
-------------------
- `visualizer/index.html`
- `visualizer/visualizer.js` (fix de `MIN_BAR_HEIGHT` inclus)
- `assets/vlcix.png` / `assets/vlcix.svg`
