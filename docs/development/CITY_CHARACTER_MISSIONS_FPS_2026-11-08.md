# Cité, personnages FPS et portails — reprise du 8 novembre 2026

Cette reprise part de `4ca3b2b87f4b7234612f11fc5c17ba205d36d340` dans la
[PR 27](https://github.com/darknigthmare/multiverse-breach/pull/27). Les preuves
et classeurs historiques restent conservés. Les contrôles navigateur de ce lot
sont publiés par le workflow **Character City missions and FPS directives** ;
les douze workflows existants restent applicables selon leurs chemins.

## Sept contrats originaux jouables

Les contrats se prennent dans le terminal du quartier **Nexus de Convergence**.
Le personnage doit être possédé et ses habitants/vitrines nécessaires doivent
être disponibles. L’Ancre dispose de son propre contrat. L’acceptation suit un
seul dossier à la fois ; changer de dossier conserve les étapes du précédent.

| Personnage | Contrat | Action principale |
| --- | --- | --- |
| Ancre | Une signature qui reste | Comparer la Bobine d’Ancre et la Lentille de Signal sans confondre ciblage et identité. |
| Mirelle | Une suture sans effacement | Diagnostiquer un relais qui répète une voix sous deux identifiants. |
| Bastion | Les noms de la dixième route | Comparer une plaque du Rempart et un registre de fermeture pour rendre visible la dette. |
| Nova | Deux relevés, aucune prophétie | Comparer départ et arrivée en indiquant qu’aucun retour n’a encore été mesuré. |
| Sable | La carte porte ses témoins | Mesurer trois repères et conserver l’auteur et les écarts du relevé. |
| Loom | Ce qui revient avec le fil | Poser une référence, atteindre le relais distant puis revenir physiquement au point de départ. |
| Marrow | Une ressemblance ne prouve rien | Recueillir deux témoignages, refuser un jugement fondé sur le visage et retourner voir Marrow. |

Chaque contrat propose deux conclusions compatibles avec le dossier et une
option contradictoire expliquée sans perdre les preuves. Après une conclusion,
il faut encore rejoindre l’ancre locale pour transmettre le dossier. Les
constats de terrain et la conclusion restent lisibles dans le journal.

Les preuves avancent uniquement depuis `resolveMosaicInteraction` avec la
bonne identité, le bon univers et une distance valide. La consultation du
menu, la sélection du contrat et le guidage ne valident aucune étape. Les
repères utilisent les collisions et le déplacement ordinaires de la Cité.

La progression vit dans `activityProgress.mosaicCharacterMissions`. Les IDs
absents et champs futurs restent conservés ; un dossier incompatible n’est
pas réinterprété comme terminé. Un contrat achevé ne se réattribue pas et ne
déclenche aucun reçu de combat. Le résultat de ce lot est un dossier narratif,
sans ajout de monnaie ou d’équipement.

Le terminal reçoit aussi un titre relatif à la préférence de texte, des marges
gauches/droites adaptées, une commande de fermeture de 44 px et une région de
lecture accessible au clavier. Le focus revient à l’objectif après un choix.

## Profils et modes FPS

`getExtinctionFighterProfile` couvre les **1 912 identités** du catalogue :
**1 811 combattants** disposent d’une adaptation jouable de leurs quatre
actions, tandis que **101 non-combattants** restent exclus. Les **12 kits
spécifiques déjà écrits** gardent la priorité. Les autres utilisent des règles
de simulation explicites fondées sur le type de l’action source. L’inventaire
expose **7 244 actions**, leur provenance et leur état de revue.

Les effets de contrôle et de soutien ne sont pas transformés automatiquement
en tirs. Les actions sans chargeur utilisent leur récupération. Les vues
schématiques suivent le type d’action, tandis que les trois planches
personnelles restent liées à leur propriétaire exact. Le retour au kit
personnel après un ramassage conserve son état et ne le recharge pas.

La relecture a aussi corrigé le faux marqueur d’impact sur un Champion protégé
et l’annulation de recharge par changement d’arme. La recharge personnelle
reprend avec son temps actif réellement restant. Les trois kits de mobilité
Happy Wheels peuvent charger leur ultime depuis zéro : cinq esquives utiles
près d’une menace remplissent la jauge, sans gain à vide, en pause ou contre
une limite. Cette règle est expliquée dans le briefing et le classeur.
Les distances affichées distinguent aussi déplacement, contact, tir, rayon,
déploiement de piège et effet personnel, depuis les mêmes valeurs que la
simulation.

| Mode | Directive facultative | Condition ajoutée |
| --- | --- | --- |
| Solo Extraction | Relais sous pression, conservé | Trois balises synchronisées, avec maintien puis confirmation ; guidage de l’objectif. |
| Dernier Signal | Décryptage | Un terminal par vague, deux secondes actives sans menace proche et confirmation ; quatre signaux avant le Champion. |
| Infestation | Confinement | Trois évents ouverts à 10, 25 et 40 secondes ; scellement confirmé. Tenir 60 secondes et sceller les trois évents. |
| Chasse au Champion | Marquage | Viser à moins de douze unités puis marquer ; quatre secondes de vulnérabilité. Les drones protecteurs restent prioritaires. |

Les directives restent locales à une partie et conservent le reçu unique et
les formules de récompense du mode. Le temps de pause ne fait avancer ni les
maintiens, ni les fenêtres de vulnérabilité.

Ces profils ne constituent pas 1 811 créations artistiques individuelles.
Les sources génériques, vues schématiques, morphologies à référencer et
équilibrages à revoir restent indiqués dans le classeur. Aucun gain de FPS
mesuré n’est revendiqué ; le bundle principal reste volumineux.

## Portails et DLC

Le catalogue de boosters et le dossier de cartes sont décrits dans
[le compte rendu des portails](PORTAL_DENSE_CATALOGS_2026-11-08.md) : pagination,
recherche, état hors rotation lisible, taille de texte, conservation du focus
et des filtres, confirmation et reprise de transaction.

L’[audit des points DLC](DLC_REVIEW_STATUS_2026-11-08.md) n’a pas trouvé de
nouveau défaut démontré dans les contrats consultés. Les tests et profils
existants continuent à vérifier les distributions. L’inspection d’un delta
reste distincte de son application, de son build et de sa recette navigateur.
La [preuve des dépendances communes](dlc-shared-dependency-proof-2026-11-08-characters.json)
est régénérée sur les sources de ce lot, sans réécrire le reçu historique.

## Classeur de missions demandé

Le nouveau fichier
[`Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx`](../excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx)
fait partie de cette PR. Il contient six onglets :

- **Synthèse** : couverture, prochains travaux et niveau de conception, calculés depuis les tables.
- **Missions à créer** : 3 824 propositions, deux par personnage, avec actions, obstacles, critères, source et champs de suivi.
- **Contrats jouables** : les sept contrats ci-dessus, leurs étapes et conclusions.
- **Personnages** : identité, continuité, rôle, actions et lacunes de source.
- **Profils FPS** : vue, ressource, équipement, quatre actions et travail restant.
- **Modes FPS** : les quatre modes et leurs directives.

Parmi les propositions, **44 sont individualisées pour 22 personnages**.
Les autres sont identifiées comme adaptations ou canevas à documenter. Toutes
restent en planification : aucun rapprochement avec un contrat jouable ne
les marque automatiquement intégrées. Les personnages non combattants et les
variantes gardent leurs contraintes. Voir le
[schéma et les limites de planification](../extinction-city/MISSION_PLANNING_2026-11-08.md).

Les colonnes jaunes de priorité, lore, écriture, intégration, recette,
responsable, jalon et notes sont éditables. Une formule annonce la prochaine
étape ; elle ne déclare une mission terminée qu’après les quatre validations
requises. Une entrée vide ne vaut pas validation. Les titres de tables et
colonnes d’identité restent figés pendant le défilement.

## Vérifications et reproduction

Les **325 tests `test:ui-immersion`** passent localement, dont les nouveaux
contrats de Cité, profils/directives FPS et dossiers de portail. Les 19 tests
de Cité incluent les deux conclusions de chacun des sept contrats, un trajet
réel soumis aux collisions, les sauvegardes et le refus des interactions
invalides. Les tests FPS exécutent les 7 244 actions et examinent leurs effets.
Le build Vite de source est passé ; il ne remplace pas le cycle complet de
production avec ses **44 commandes prebuild**, conservées dans le même ordre.

La première CI a permis de corriger le débordement du filtre Portail en
portrait à texte 150 %, ainsi que la hauteur du champ de recherche. Deux
contrôles d’intégration ont été raccordés au nouveau code : le contexte du
test Codex inclut le suivi des contrats Cité, et le contrat de vue FPS vérifie
la chaîne réelle propriétaire → profil → vue par analyse syntaxique. Ces
contrôles font maintenant aussi partie de `test:ui-immersion`.

Les recettes de pause distinguent les commandes du jeu de l’activation native
d’un bouton focalisé, et la position du joueur de sa pose d’animation. Elles
exigent toujours une simulation figée en pause, des coordonnées identiques à
la reprise et aucune commande automatique conservée. Les captures et états
intermédiaires sont enregistrés avant les assertions ; chaque format est
exécuté indépendamment, et tout cas en échec fait échouer le workflow.

Le fichier Excel est construit avec `@oai/artifact-tool`, puis recalculé,
inspecté et relu par un vérificateur OpenXML indépendant. Les changements de
prérequis, y compris une valeur vide, ont été exercés puis restaurés. Chaque
onglet a un rendu de lecture. Cela ne constitue pas un test dans Excel natif.
Le [reçu de génération](../extinction-city/character-mission-workbook-receipt-2026-11-08.json)
et la [relecture indépendante](../extinction-city/character-mission-workbook-readback-2026-11-08.json)
identifient les octets du classeur livré.

```sh
# Les commandes du générateur de planification sont dans MISSION_PLANNING_2026-11-08.md.
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs \
  scripts/extinctionFighterCatalog.mjs \
  --out /tmp/multiverse-fps-roster-2026-11-08.json \
  --source-commit 4ca3b2b87f4b7234612f11fc5c17ba205d36d340

# Avec le runtime Artifact Tool disponible, préparer un répertoire temporaire.
MVB_PROJECT_ROOT="$PWD"
MVB_WORKBOOK_WORKDIR="$(mktemp -d)"
ln -s "$CODEX_PRIMARY_RUNTIME_NODE_MODULES" "$MVB_WORKBOOK_WORKDIR/node_modules"
ln -s "$MVB_PROJECT_ROOT/scripts/extinction-city/buildCharacterMissionWorkbook.mjs" \
  "$MVB_WORKBOOK_WORKDIR/build.mjs"
"$CODEX_PRIMARY_RUNTIME_NODE" --preserve-symlinks-main \
  "$MVB_WORKBOOK_WORKDIR/build.mjs" \
  --repo "$MVB_PROJECT_ROOT" --planning /tmp/mission-planning-2026-11-08.json \
  --fps /tmp/multiverse-fps-roster-2026-11-08.json

python3 scripts/extinction-city/verifyCharacterMissionWorkbook.py \
  docs/excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx \
  --planning /tmp/mission-planning-2026-11-08.json
```

Le builder versionné est `scripts/extinction-city/buildCharacterMissionWorkbook.mjs`.
Les colonnes éditées par un humain doivent être réimportées explicitement par
ID avant régénération ; aucune synchronisation automatique n’est annoncée.

La recette navigateur du nouveau workflow couvre les portails en FR/EN sur
trois formats, les sept contrats Cité sur bureau et Ancre/Loom sur mobile,
puis les profils et directives FPS. Les fixtures préparent la propriété et
les points d’entrée avant le jeu, sans compte utilisateur ni sauvegarde
distante. Les rapports indiquent séparément la portée de leurs préparations.
Les résultats finaux et les captures sont ceux du commit testé par GitHub
Actions, pas ceux d’un navigateur local indisponible.
