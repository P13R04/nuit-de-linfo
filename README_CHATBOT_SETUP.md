Setup du chatbot Romain via l'API Hugging Face

But
- Fournir un endpoint `/api/roman` côté serveur qui appelle l'API Inference de Hugging Face.
- Garder le token HF côté serveur (jamais exposer au client).
- Ajouter du prompt engineering pour orienter le personnage "Le Romain".

Fichiers ajoutés
- `server.js` : proxy Express vers Hugging Face

Installation (locale)
1. Depuis la racine du projet, crée un fichier `.env` contenant :

```
HF_TOKEN=hf_xxxTONTOKENICIC
# optionnel : HF_MODEL=google/flan-t5-large
```

2. Installer dépendances (Node 16+ recommandé) :

```bash
npm init -y
npm install express node-fetch express-rate-limit helmet cors node-cache dotenv
```

3. Lancer le serveur en local :

```bash
HF_TOKEN=hf_xxx node server.js
# ou
npm start
```

Client
- La page `roman/index.html` fait déjà un `fetch('/api/roman', { method: 'POST', body: JSON.stringify({ message }) })`.
- Le serveur renvoie `{ reply: '...' }`. Affiche `reply` côté client.

Bonnes pratiques
- Ne publiez jamais votre token dans le dépôt. Utilisez variables d'environnement.
- Limitez le trafic : j'ai ajouté un rate-limiter (30 req/min/ip) et un cache.
- Choisissez un modèle léger si vous voulez éviter latence/coûts (ex: `google/flan-t5-base`).

Déploiement
- Déployez sur Render / Fly / Heroku / Vercel (serverless) en configurant `HF_TOKEN` en variable d'environnement.
- Si vous préférez serverless (Vercel), adaptez le code en API function plutôt qu'Express.

Personnalisation
- Ajustez `SYSTEM_PROMPT` dans `server.js` pour modifier la personnalité du Romain.
- Envoyez un historique (optionnel) depuis le client en ajoutant `history: [...]` au POST pour garder contexte de conversation.
