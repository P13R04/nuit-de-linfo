# CONTEXTE DU PROJET : NUIT DE L'INFO 2025
# ÉQUIPE : 2 Développeurs
# THÈME GLOBAL : Le Village Numérique Résistant (NIRD) vs L'Empire GAFAMUS
# DATE LIMITE : Déploiement "One-Shot" sur AlwaysData avant 08h00 demain.

---

## 1. VISION & UNIVERS (LORE)
Le but est de créer une application web éducative, ludique et satirique[cite: 22].
* **L'Empire (Les Romains) :** Représente les Big Tech, l'obsolescence programmée, le cloud propriétaire et les licences coûteuses[cite: 10].
    * *Noms de personnages :* Windowsus, Obsolescenceprogrammus, Cloudus, Abonnemantus.
    * *Ton :* Bureaucratique, hautain, cherche à vendre des mises à jour inutiles.
* **Le Village (Les Gaulois) :** Représente les écoles, le logiciel libre, le réemploi et Linux[cite: 12, 66].
    * *Noms de personnages :* Tux (le chef), Recyclix, Linux, OpenSourcix.
    * *La Potion Magique :* La connaissance, le code source ouvert, le tournevis pour réparer.
    * *Ton :* Joyeux, débrouillard, résistant, un peu chaotique mais solidaire.

## 2. OBJECTIFS ÉDUCATIFS (DÉMARCHE NIRD)
L'application doit sensibiliser à :
* L'Inclusion, la Responsabilité et la Durabilité numérique[cite: 12, 56].
* Lutter contre la fin de support (ex: Windows 10) par l'installation de Linux[cite: 10, 52].
* Le réemploi du matériel plutôt que l'achat neuf[cite: 51].

## 3. STACK TECHNIQUE & CONTRAINTES
* **Hébergement :** AlwaysData (déploiement continu ou FTP).
* **Technologies :** Web Standard (HTML5 / CSS3 / JS Vanilla ou Framework léger).
    * *Note :* Pas de lourdeur inutile (éco-conception).
* **Assets :** Utilisation de ressources libres de droit uniquement[cite: 16].

---

## 4. DÉTAILS DES 5 DÉFIS (INTEGRATION NARRATIVE)

### DÉFI 1 : CHAT'BRUTI (Le Chatbot Inutile)
* **Concept :** Un "Assistant Romain" (type Clippy mais en légionnaire) nommé **"Administratus"**.
* **Comportement :** Il est censé aider l'utilisateur à passer au libre, mais il essaie constamment de vendre des licences ou demande des formulaires cerfa A-38.
* **Mécanique :** * Si on demande "Comment installer Linux ?", il répond : "Avez-vous rempli le formulaire de demande de changement de système en trois exemplaires sur papyrus ?"
    * Il répond toujours à côté de la plaque ou avec une mauvaise foi bureaucratique.

### DÉFI 2 : LA CARTE DES TALENTS (Compétences NIRD)
* **Concept :** "Les Tablettes de Marbre des Irréductibles".
* **Visuel :** Style RPG / Fiche de personnage gravée dans la pierre.
* **Fonctionnalités :**
    * Création de profil (Avatar style Gaulois).
    * Ajout de compétences (ex: "Chasseur de Bugs", "Druide du Réseau", "Forgeron de PC").
    * Certification : Un "Chef du Village" (admin) peut apposer un sceau de cire pour valider un talent.
    * Recherche de compagnons pour une quête (projet).

### DÉFI 3 : HIDDEN SNAKE (Jeu Caché)
* **Concept :** "Le Serpent de Câbles".
* **Lore :** Dans la salle des serveurs du village, les câbles sont en désordre.
* **Gameplay :** Un Snake classique où le serpent est un câble RJ45 qui grandit en mangeant des connecteurs. Il ne doit pas se mordre (court-circuit).
* **Activation Secrète :** Konami Code ou cliquer 3 fois sur le casque d'un romain caché dans le footer.
* **Graphismes :** Pixel art rétro, fond vert "terminal".

### DÉFI 4 : VISUALISATION AUDIO
* **Concept :** "La Lyre d'Assurancetourix".
* **Contexte :** Une page "Médiathèque du Village" ou un easter egg sonore.
* **Visuel :** Style lecteur Windows Media Player 90s mais "gauloisé" (pierres qui bougent, notes de musique qui s'envolent).
* **Effet :** Quand le son joue (une musique libre un peu kitch ou la voix du chatbot), une visualisation spectrale (barres ou ondes) s'anime.
* **Humour :** Si la musique est trop forte, un personnage crie "Ils sont fous ces auditeurs !".

### DÉFI 5 : RUBE GOLDBERG (Animation Complexe)
* **Concept :** "Le Système d'Authentification Sécurisé de l'Empire".
* **Usage :** Pour valider un formulaire simple (ex: inscription newsletter ou login) ou pour "Télécharger la doc".
* **Animation :** 1.  L'utilisateur clique sur "Valider".
    2.  Une boule de pierre roule.
    3.  Elle tape un casque romain.
    4.  Le casque tombe sur une catapulte.
    5.  La catapulte lance un menhir.
    6.  Le menhir tombe sur un interrupteur "ON".
* **Résultat :** Tout ça pour afficher un simple "C'est bon".
* **Technique :** CSS Keyframes ou Canvas JS. Doit être absurdement long et compliqué.

---

## 5. DESIGN SYSTEM & AMBIANCE
* **Font :** Une police style BD ou manuscrite (type Comic Neue ou une Google Font "Handwritten").
* **Couleurs :** * Dominante : Bleu Nuit (Nuit de l'Info) + Rouge et Or (Romains) vs Vert et Marron (Nature/Gaulois).
* **Copywriting :** Jeux de mots obligatoires. (ex: "Erreur 404 : Ce village n'a pas encore été envahi").