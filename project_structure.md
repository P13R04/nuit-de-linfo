# Structure du projet

Arborescence recommandée :

- `project/`
  - `server.js` (serveur Node)
  - `package.json`
  - `public/`
    - `index.html`
    - `css/style.css`
    - `js/app.js`
    - `js/defis/` (modules optionnels pour défis)
  - `src/utils/` (modules utilitaires réutilisables)
  - `docs/`
    - `methode_generale.md`
    - `charte_direction_artistique.md`
    - `defis/` (markdown pour chaque défi)

Consignes pour évoluer sans casser :
- Toujours ajouter de nouvelles routes API plutôt que changer les existantes.
- Documenter chaque défi dans `docs/defis/`.
- Préférer petites fonctions pures et tests manuels.
