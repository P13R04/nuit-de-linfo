# Défi : Snake caché

Idée
-----
Un mini-jeu Snake est dissimulé dans le site et n'est pas immédiatement visible : il ne devient accessible qu'après avoir récupéré un mot de passe donné par la Machine Rube Goldberg.

En quoi ça colle avec le défi
--------------------------------
- C'est un mini-jeu interactif qui valorise la découverte et l'exploration : les participants doivent fouiller le site et lancer la machine pour débloquer le contenu.
- L'intégration combine front, logique client et stockage local (localStorage) pour vérifier que le participant a réellement déclenché la machine.

Ce qui marche
--------------
- Le jeu `snake` est présent dans `snake/hidden.html` et la logique permet d'y accéder si `localStorage` contient le bon flag (`nuit_passed` ou `nuit_secret`).
- La Machine Rube Goldberg écrit `localStorage.setItem('nuit_secret','snake')` et `nuit_passed='1'` quand elle se termine.

Limitations / Ce qu'on n'a pas fait
----------------------------------
- Nous n'avons pas implémenté d'authentification serveur pour vérifier le passage à la machine — la vérification est purement locale.
- Si l'utilisateur ne peut pas exécuter la machine (par ex. navigation bloquée), il est possible de forcer l'accès en modifiant localStorage manuellement.

Comment tester
-------------
1. Lancer le site localement : `python3 -m http.server 8000`.
2. Ouvrir la page Rube Goldberg (`/rube-goldberg/`) et laisser la machine se terminer, ou cliquer sur la Forêt depuis la carte.
3. Après la séquence, ouvrir `snake/hidden.html` ou cliquer sur le lien qui apparaît dans le chat du Romain si le mot de passe est fourni.
