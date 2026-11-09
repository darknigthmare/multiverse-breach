# Multiverse Breach — fiabilité et compétences de soutien Tactics

Base de la passe : `2b66d67770d46a8c43cd5be3658a6b0908d6ad4c`, PR #2.
Branche : `codex/audit-corrections-2026-10-16`. Aucun merge / changement de production.

## Défauts reproduits avant correction

Six tests ont été exécutés sur la base intacte avant modification, avec six échecs :
soin impossible sur un allié ; commandes tactiques acceptées pendant une pause ;
KO à l'entrée d'une case dangereuse bloquant le tour / laissant une action disponible ;
soin de terrain répétable en cliquant sa propre case ; dégâts négatifs modifiant les
cibles ; application d'un statut raccourcissant sa durée précédente.

## Corrections

### Tours, KO, terrain et interruption

Les callbacks de commandes appartiennent à un acteur, une génération de vie et un tour.
Ils ne peuvent plus s'exécuter pour le personnage suivant, après suppression du lanceur,
ou après KO puis résurrection. Le prochain tour ne dépend pas de la survie du précédent.
Le bouton de fin de tour est protégé pendant résolution, stun, pause et fin de combat.
Les doubles clics ne créent pas deux transitions. Les callbacks environnementaux des
barils restent indépendants du stun du personnage actif, mais respectent la pause.

Un déplacement réellement effectué applique son effet d'entrée une seule fois.
Rester sur sa case ou annuler une visée n'octroie pas de nouveau soin de terrain.
Un KO provoqué par un danger ferme le tour au lieu de laisser le joueur bloqué.
La validation de déplacement et de résurrection vérifie l'empreinte entière d'une
grande unité. Les coordonnées non entières / non finies sont rejetées avant les
boucles de géométrie et avant toute dépense. Les objets ramassables ne sont pas
attribués à un personnage mort à l'arrivée sur une case.

### Compétences de soutien

Les définitions de soin, purification, résurrection, renforcement et protection sont
résolues sur les alliés, et non traitées comme des attaques ennemies. Les invocations
médicales de Loom et la barricade de Bastion reprennent la sémantique déjà présente en
RPG ; aucune liste de pouvoirs historique n'est remplacée. Les défenses médicales
ciblent leur porteur. Les compétences de défense classiques restent inchangées.

Portée et visibilité demeurent des règles de grille ; les formes single / group /
multi / area / line / cone sont résolues dans la grille. Les soins, la purification
sélective et la résurrection partagent les calculs éprouvés du RPG : plafond sous
irradiation, minimum d'un PV après résurrection, ordre soin puis purification.
Une case de résurrection occupée est refusée sans coût. Les buffs temporaires
modifient les dégâts / la protection sans réécrire les statistiques d'origine, et
expirent en temps de simulation. Un soutien inutile n'est pas consommé par l'IA.

Le panneau FR/EN de soutien affiche les cibles admissibles, les PV réellement
récupérables et les statuts retirés. Les mêmes commandes sont disponibles sur le
terrain et par des boutons clavier/tactile. Le second joueur peut soutenir sa
propre équipe sans soigner les adversaires.

L'IA alliée privilégie un soutien utile déjà à portée, sans acquisition silencieuse
d'une autre unité après remplacement de sa cible. Cette passe ne crée pas une
nouvelle stratégie globale de déplacement des soigneurs ni un moveset exhaustif
pour chaque adversaire CPU.

### Dégâts et aperçu

Aperçu et impact partagent les modificateurs de terrain, couverture, orientation,
buff, garde, bouclier d'objet et DEF, y compris la DEF stockée directement sur
l'ennemi. L'aperçu expose la variation min/max et plafonne les dégâts aux PV restants.
Un coefficient de dégâts nul reste nul. Les dégâts négatifs / non finis sont refusés
avant leurs effets secondaires et une réapplication ne raccourcit pas un statut.
Les rencontres REX et Scarab conservent leurs protections et leurs tests existants.

## Validation reproductible

```sh
npm ci
npm run test:audit-tactics
npm run test:audit-reliability
npm run test:audit-followup
npm run test:audit-combat
npm run test:polish
node node_modules/vite/bin/vite.js build
```

Local : **54/54 nouveaux tests**, **346/346 contrats existants** de la commande CI,
compilation Vite réussie. La nouvelle suite est ajoutée à `prebuild` ainsi qu'à la
CI permanente ; aucun ancien contrôle de publication n'a été supprimé. Deux tests
existants de direction d'IA réinitialisent explicitement leur second tour synthétique,
au lieu de réutiliser un tour déjà en résolution ; leurs assertions sont conservées.

Les résultats distants et captures sont produits par la CI sur le commit testé.
La recette navigateur `scripts/browserTacticsReliability.py` exécute quatre parcours
Chromium (1280 / 390 pixels, français / anglais), sur une page de test séparée qui
monte le vrai GameCanvas : soin ciblé, pause, double clic, purification, résurrection
refusée puis permise, clic terrain dangereux, passage de tour et démontage.

Le navigateur de l'environnement local refuse la navigation (`ERR_BLOCKED_BY_ADMINISTRATOR`).
Les parcours navigateur doivent donc être exécutés sur GitHub ; la présence d'un script
ou d'une capture seule n'est pas revendiquée comme réussite avant le résultat du run.
L'artefact `results.json` indique explicitement les réussites et les éventuels échecs.

## Limites et compatibilité

Les tests partent de situations préparées, utilisent quelques compétences synthétiques
et les vraies commandes. Ils ne remplacent pas une campagne parcourue de bout en bout,
un test sur téléphone physique ni une certification des visuels. La copie de sources
ne contient pas tous les bitmaps : le test existant de réutilisation d'images d'escorte
est dépendant de ces fichiers et n'est pas supprimé. La CI compile les sources, pas le
prébuild de publication de tous les assets. Le poids de GameCanvas augmente avec les
protections et le panneau : 382,07 ko minifiés / 114,57 ko gzip au build local.
HubScreen reste à 1 441,26 / 323,33 ko ; aucun gain FPS n'est revendiqué.

Les sauvegardes v9, identifiants de missions, récompenses, héros et fichiers d'assets
historiques sont conservés. SMTP/cloud réels, contenu manquant, tutoriel complet et
aperçu Vercel restent des chantiers distincts. Aucun secret ni compte réel dans les
fixtures ou artefacts de tests.
