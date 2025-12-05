# Défi : Carte des talents

Idée
-----
Une carte interactive des talents du village où chaque lieu présente une compétence ou une mini-application (forge, taverne, temple, etc.).

Lien au défi
-----------
- Permet de rassembler plusieurs mini-projets sur une seule page et de montrer la diversité des réalisations (front, son, jeu, automatisation).

Ce qui marche
--------------
- La carte principale (`index.html`) utilise une image de fond (`assets/main_village.png`) et des zones cliquables positionnées par CSS variables (`--x`, `--y`).
- Chaque zone redirige vers la page correspondante :
  - `Administratus` → `/roman/`
  - `L'Arbre` → `/grand-arbre/`
  - `VLCIX` → `/visualizer/`
  - `La Forge` → `/talents/`
  - `La Forêt` → `/rube-goldberg/` (lance la machine directement)

Limitations / Ce qu'on n'a pas fait
----------------------------------
- Les hotspots sont gérés par boutons positionnés en absolu ; pour une version plus avancée nous aurions pu utiliser un SVG interactif pour zones scalables et plus précises.
- Certains ajustements de position peuvent rester à faire selon la taille d'écran ; une version responsive dédiée améliorerait l'expérience mobile.
