# Défi : Machine Rube Goldberg

Idée
-----
Une machine Rube Goldberg interactive qui simule une séquence (chargement, mini-jeu clicker, révélation finale) et délivre un mot de passe pour débloquer la suite du parcours.

Lien avec le défi
------------------
- Montre des compétences d'intégration d'animations, de DOM et d'interactions UI/UX.
- Permet de lier plusieurs parties du site via un scénario ludique (générer un mot de passe et déclencher le mini-jeu Snake).

Ce qui marche
--------------
- La séquence de pseudo-chargement, le mini-jeu clicker et l'écran final fonctionnent (`rube_full.js`).
- La fin de la séquence marque localement la réussite dans `localStorage` et redirige vers la page d'accueil pour la démo.

Limitations / Ce qu'on n'a pas fait
----------------------------------
- Le mécanisme initial renvoyait vers `/foret/password.html`, mais pour la présentation nous avons choisi de rediriger vers la racine `/` afin de simplifier la navigation.
- Le système de génération de mot de passe n'est pas sécurisé ni vérifié côté serveur (démarche volontaire pour ce défi rapide).

Notes techniques
----------------
- Page : `rube-goldberg/index.html`
- Script principal : `rube-goldberg/rube_full.js`
- Assets : `rube-goldberg/images/`
