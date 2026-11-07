# Cité et FPS — campagne Nexus, 7 novembre 2026

Ce lot prolonge les variantes de terrain de la PR #27, depuis
`da102bdc1dea30dce8b98f44931be8b35cf16c28`. Il couvre la jouabilité des cinq
kits de campagne Nexus encore absents du FPS, les dossiers narratifs de dix
habitants de la Cellule ZERO et la consultation des preuves de reconnaissance.
Il ne change pas les règles des variantes standard, le déverrouillage de la
campagne ni le format des sauvegardes.

## Critères joueur

- Un personnage de campagne déjà possédé possède ses quatre actions source en
  FPS ; un personnage non possédé reste absent de la sélection.
- Tessera peut placer un reflet immobile qui frappe les ennemis proches après
  un délai. Nadir peut poser une sonde puis revenir une seule fois à son point
  de départ, pendant sa durée active.
- Les actions personnelles gardent les règles de bouclier du champion, de
  dégâts, d'élimination et de charge. La fin, l'abandon et la récupération après
  erreur ne conservent aucun reflet, sonde, projectile ou effet actif.
- La pause et le terminal arrêtent les durées actives ; les commandes de jeu ne
  traversent pas les menus et exigent de nouveaux appuis après leur fermeture.
- En Cité, la marche et l'interaction à proximité d'un habitant de la Cellule
  ZERO ouvrent ses sujets dans le terminal existant. Choisir son nom dans
  l'annuaire commence seulement l'approche.
- Les sujets reprennent les paragraphes déjà écrits dans les fiches source,
  en français et en anglais. Les lire ne crée ni preuve, ni récompense.
- Le dossier de reconnaissance affiche le témoin et les reliques réellement
  enregistrés. L'enquête croisée distingue ses deux preuves et ses quatre
  étapes. Un pack indisponible ne fait pas disparaître les identifiants des
  preuves conservées.

## FPS : cinq kits de campagne ajoutés

Le registre courant passe de 7 à **12 kits**, soit **48 actions**. Les 20
actions ajoutées gardent le nom et le type de leurs entrées dans
`src/game/heroes.js`. Les sept adaptations antérieures conservent leurs règles.

| Propriétaire | Action secondaire | Action défensive | Action spéciale |
| --- | --- | --- | --- |
| `arca_tessera` — Tessera Vale | Reflet Non Remplace : support fixé au point de lancement, actif 300 ticks ; première attaque au tick 60, puis toutes les 60 unités actives, portée locale 8 | Cicatrice de Possibilite : pas défensif borné et garde | Choeur des Vies Refusees : onde locale |
| `arca_quillon` — Quillon Rusk | Mandat de Restitution : projectile réellement simulé jusqu'à son impact | Clause de Dette : garde | Audit de la Premiere Breche : roquette avec dégâts de zone à l'impact |
| `arca_nadir` — Nadir Kest | Sonde de Retour : ancre au lancement, rappel unique disponible pendant 360 ticks actifs | Harnais Causal : garde | Extraction des Marges : soin plafonné à la santé maximale |
| `arca_elyra` — Elyra Null | Memoire de Choix : renforcement temporaire qui augmente réellement les dégâts | Pas Hors du Blanc : pas défensif borné et garde | Droit de Dire Non : onde locale |
| `arca_oryn` — Oryn Xile | Riposte du Temoin : frappe au contact | Pas de la Route Effacee : pas défensif borné et garde | Manifeste des Survivants : rayon traversant les cibles devant le joueur |

Les tirs principaux utilisent les projectiles, impacts directs ou frappes
indiqués par la source. Les frappes d'Oryn ne consomment pas de munitions.
Le rappel de Nadir ne restaure ni santé, ni munitions, ni recharge d'action.
Il constitue la seconde partie d'un seul lancement, pas un lancement gratuit
supplémentaire. Le bouton F montre le rappel disponible et sa durée restante.
Le reflet de Tessera vise depuis sa position de lancement et ne suit pas le
joueur ; un seul reflet peut exister à la fois.

Les deux nouveaux supports appartiennent à l'identifiant du personnage et au
run courant. Un support d'un autre propriétaire, d'un ancien run ou avec des
coordonnées invalides ne peut ni infliger des dégâts ni rappeler le joueur.
Ils utilisent le chemin central `damageExtinctionEnemy` et son contrôle des
drones protecteurs du champion, des éliminations uniques et des drops.

La présentation est procédurale et réutilise les vues personnelles existantes.
Ce lot n'ajoute aucune illustration de personnage et ne certifie pas la
fidélité artistique des planches existantes.

## Cité : dossiers de la Cellule ZERO et carnet des preuves

Les habitants concernés sont Bastion, Nova, Marrow, Sable, Loom, Tessera,
Quillon, Nadir, Elyra et Oryn. Leurs fiches donnent **39 sujets par langue**,
issus des champs existants `dossier`, `doctrine`, `breachLore` et `threat`.
Ce sont des paragraphes narratifs restitués par le terminal, pas de nouvelles
répliques attribuées aux personnages. Mirelle garde son accueil spécifique :
sa fiche générique de secours n'est pas présentée comme un dossier écrit.

L'ouverture passe par `resolveMosaicInteraction`, la portée réelle du PNJ et
la vérification de possession. Le même terminal gère la pause, le focus,
Échap et la reprise ; aucune deuxième modale n'est ajoutée. Fermer la
conversation rend le focus au bouton de terminal permanent. Le journal
historique de synchronisation reste renseigné.

Le carnet est une projection en lecture seule de
`activityProgress.mosaicReconnaissance`. Il affiche le témoin, les preuves
distinctes, l'état du rapport et la disponibilité du quartier, avec quatre
dossiers par page. Aucun nouveau champ de sauvegarde, verrou économique ou
récompense n'est introduit. En cas d'absence d'une définition de personnage,
relique ou pack, l'identifiant enregistré reste visible.

Pour une enquête croisée acceptée, les étapes sont désormais : habitant,
première relique, seconde relique, transmission à l'ancre. Le texte du
terminal et le compte de preuves indiquent explicitement `0/2`, `1/2`, `2/2`.
La variante standard garde son total de trois étapes.

## Vérifications effectuées localement

| Vérification | Résultat observé |
| --- | --- |
| `node --test scripts/extinctionSignatures.test.mjs scripts/extinctionCampaignKits.test.mjs scripts/extinctionTiming.test.mjs scripts/extinctionPauseTiming.test.mjs scripts/extinctionRelayOperation.test.mjs` | **62/62** : actions historiques, nouvelles actions, dégâts, pause, durées, relais et nettoyage |
| `node --test scripts/mosaicResidentDialogue.test.mjs scripts/mosaicReconnaissance.test.mjs scripts/fieldOperationVariants.test.mjs` | **32/32** : sources FR/EN, propriété, vraie marche simulée, événements d'interaction, preuves distinctes, sauvegarde et conservation des identifiants |
| `node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs --test scripts/extinctionCityCatalog.test.mjs` | **7/7**, cardinalité courante 12 kits / 48 actions |
| `oxlint --deny-warnings` ciblé sur les dix modules, composants, tests et fixture modifiés | Réussi |
| `python3 -m py_compile scripts/browserNexusCampaign.py scripts/browserResidentViewmodels.py` | Réussi ; contrôle de syntaxe uniquement |

Les tests nouveaux vérifient des résultats de simulation et les données
persistées, pas seulement la présence de noms d'actions. Les commandes
ci-dessus se recoupent avec les suites de CI ; leurs totaux ne sont pas un
compte de scénarios indépendants du reste du dépôt.

## Parcours navigateur livré pour la CI

```sh
python scripts/browserNexusCampaign.py \
  --url http://127.0.0.1:4173 \
  --require-art \
  --evidence /tmp/nexus-campaign
```

Le runner contient 11 cas, avec un nouveau contexte par cas :

- Dialogue Tessera, marche ordinaire, égalité avec les quatre paragraphes
  source, gel des entrées et retour du focus en 1280 × 900 FR, 390 × 844 EN
  et 844 × 390 FR. Texte 150 %, HUD 140 %, zone sûre 32 px.
- Enquête croisée réelle, reprise après la première relique, cinq écritures
  de progression uniques, puis carnet de deux preuves archivées.
- Les cinq kits en 1280 × 900 FR, ainsi que Nadir en 390 × 844 EN et Tessera
  en 844 × 390 EN. Treize attaques natives gagnent la charge, les commandes
  F/C/X déclenchent les effets, puis pause et abandon vérifient leur arrêt.

La fixture prépare explicitement la possession des personnages. Pour les
cas FPS de ce runner uniquement, elle prépare une cible à santé élevée et
dégâts nuls, et une santé initiale réduite pour observer le soin de Nadir.
Elle n'injecte ni charge, ni dégâts du joueur, ni éliminations, ni victoire,
ni récompense. La cible suit toujours la simulation de la scène. Ce runner
ne remplace pas les runs complets déjà présents dans la CI et n'est pas une
validation d'équilibrage. Le choix `catalog=nexus` limite les assets de la
fixture à cette famille ; les choix historiques restent disponibles.

Le runner historique `browserResidentViewmodels.py` conserve ses contrôles
de marche, positions, journal et points de reprise. Ses deux ouvertures de
terminal deviennent conditionnelles parce que la conversation de Bastion
ouvre désormais ce même terminal à proximité. Une assertion supplémentaire
exige explicitement cette conversation de Bastion.

**État navigateur local : non exécuté.** Le lancement Chromium est refusé
par l'environnement (`socket() Operation not permitted`), et la demande
d'escalade a été rejetée automatiquement avant ce lot. Aucun contournement
n'a été tenté. Les screenshots et résultats d'exécution attendus doivent
venir de la CI ; la compilation Python n'en constitue pas une preuve.

Les catalogues et classeurs datés restent des historiques associés à leurs
révisions source. Ils ne sont pas régénérés pour faire correspondre leurs
anciens nombres aux nouveaux kits. Le catalogue de la révision courante est
produit séparément par l'intégration.
