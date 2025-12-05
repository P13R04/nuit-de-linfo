# Défi : Chatbot — "administratus" le Romain

Idée
-----
Un chatbot personnage (le Romain) qui joue avec le thème des licences payantes et des mises à jour forcées. Il sert aussi de point d'entrée pour activer le mini-jeu (via le mot de passe).

Lien avec le défi
------------------
- Expose l'intégration d'un backend/API (proxy local) et la gestion d'un fallback côté client.
- Montre comment concevoir une expérience conversationnelle simple, immersive et humoristique.

Ce qui marche
--------------
- L'UI du chatbot est opérationnelle (`roman/index.html`). Le formulaire envoie les messages et affiche les réponses.
- Comportement robuste : le client tente d'appeler `/api/roman`. Si le serveur n'est pas disponible ou renvoie une erreur, le client choisit au hasard une réponse en dur (liste humoristique) pour la démo.

Limitations / Ce qu'on n'a pas fait
----------------------------------
- L'intégration complète à une API disponible et authentifiée (ex: un modèle externe) n'a pas été possible pendant la démo : le serveur Node peut être démarré si configuré, mais dans beaucoup d'environnements locaux il peut échouer (voir `server.log`).
- Par conséquent, plusieurs réponses sont codées en dur dans `roman/index.html` pour garantir une expérience complète sans dépendance réseau.

Fichiers utiles
----------------
- `roman/index.html` — interface et logique client
- `server.js` — proxy/API (optionnel)

Astuce
-----
Pour forcer le mode démo local, démarrez le site en statique et utilisez le chatbot : il utilisera automatiquement les réponses codées en dur si l'API est absente.
