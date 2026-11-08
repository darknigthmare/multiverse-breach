# Missions de Cité par personnage — catalogue de préparation

Ce lot fournit **deux propositions pour chacun des 1 912 personnages résolus**,
Ancre comprise : une mission liée à l’univers d’origine et une mission originale
de Cité/Multiverse. Parmi ces **3 824 propositions**, quatre prolongements Nexus
ont maintenant une **adaptation jouable explicitement liée** ; les 3 820 autres
ne sont pas implémentés par cet export. Le suivi manuel, la validation du lore
et les intentions plus larges de chaque proposition restent à renseigner.
Ce catalogue ne déclare aucun épisode canonique externe.

Le générateur est
[`scripts/extinction-city/missionPlanning.mjs`](../../scripts/extinction-city/missionPlanning.mjs).
Le reçu compact versionné est
[`mission-planning-coverage-2026-11-08.json`](mission-planning-coverage-2026-11-08.json).
Le JSON complet, utilisé pour le nouveau classeur de la PR, est généré hors du
dépôt : ses faits et textes développés ne sont pas dupliqués dans un fichier
JSON de plusieurs dizaines de mégaoctets versionné.

## Couverture et niveaux de conception

| Périmètre | Nombre | Interprétation |
| --- | ---: | --- |
| Personnages du roster + Ancre | 1 912 | Une identité stable par ligne ; les variantes restent distinctes. |
| Personnages non combattants | 101 | Objectifs pacifiques, aucun tir ou kill ajouté. |
| Propositions d’univers | 1 912 | Reconstitution, sortie ou activité à produire. |
| Propositions Multiverse/Cité | 1 912 | Intrigue originale, expérience et rôle reliés au quartier. |
| Personnages avec propositions individualisées | 22 | Les douze identités Nexus et dix autres dossiers prioritaires. |
| Propositions individualisées | 44 | Incident, activité, obstacle et retour propres au dossier. |
| Occurrences d’ennemis | 1 518 | Inventaire séparé, jamais transformé en personnages possédables. |
| Occurrences de boss/mondiaux/final | 1 507 | Une occurrence n’est pas nécessairement une identité unique. |
| Politiques de finale | 129 | Dont 124 `nonCombatFinal`, conservées comme contraintes. |
| Contrats Cité présents dans le runtime | 32 | 28 Nexus, 2 Halo, 2 Alien. Les 28 contrats précédents sont conservés dans leur ordre. |
| Propositions liées à une adaptation jouable | 4 | Liens explicites par ID vers les nouvelles aventures de Mirelle, Quillon, Nadir et Tessera ; aucun rapprochement automatique par personnage. |
| Autres prolongements Nexus à développer | 20 | Intentions et suivi conservés ; aucune validation automatique. |

`designKind` distingue `individual_proposal`, `source_objective_adaptation`,
`source_family_adaptation` et `research_scaffold`. Les deux derniers ne valent
pas une écriture individuelle complète. Les 1 363 profils contenant au moins
un nom de technique générique restent signalés ; un nom comme « Signature
Strike » ne prouve aucun pouvoir canonique.

Le lot prioritaire comprend l’Ancre, les onze personnages Nexus, Master Chief,
Chell, Hatsune Miku, Harry Potter (`harry`), Gina, Arthur Pendragon,
Brigid Tenenbaum, Ripley d’*Alien*, Ripley d’*Aliens* et le personnage de scène
Serj Tankian. Pour ce dernier, la proposition reste une performance originale
pacifique fondée sur le thème collectif ; les capacités individuelles restent
en recherche. Aucune voix, chanson ou déclaration personnelle n’est fabriquée
comme source.

Les lieux et outils ne sont pas repris aveuglément du gabarit d’univers :
le Harry de cinquième année ne participe pas par défaut au stage Astronomy
Tower, Ripley de 1979 ne reçoit ni M41A ni power loader, et le bouclier MJOLNIR
du Chief n’est pas confondu avec le Bubble Shield du kit multivers. Ces limites
figurent dans `characters.planningNotes`. Les variantes Gina/Dante/Kurgan
conservent le même rôle de Prisoner 849, sans nouveaux protagonistes ni
capacités exclusives.

## Sources et schéma

`sourceRevision` désigne la révision de départ des catalogues
`4ca3b2b87f4b7234612f11fc5c17ba205d36d340`. Elle ne prétend pas contenir les
nouveaux fichiers de ce lot. `sourceManifest` contient les chemins et SHA-256
des fichiers effectivement lus, avec fermeture récursive des imports statiques
locaux. Les références externes sont reprises du dépôt et portent toujours
`externalReferencesChecked: false` ; elles n’ont pas été revalidées par cet
export.

Le JSON organise les données ainsi :

- `characters` porte identité, incarnation, rôle, lore, objectifs source,
  équipement, quatre actions, contraintes de représentation, lacunes et
  provenance. `sourceLoreKind` distingue un dossier rédigé d’une plaque générée
  à partir du rôle. `runtimeMissions` ne contient que les IDs réellement présents.
- `missions` porte le design : incident, lieu, trois étapes avec action,
  obstacle et réussite, mécaniques, références ciblées dans `sourceBindings`,
  statut et suivi. `characterId` relie les faits sans les recopier intégralement.
- `encounters` inventorie les occurrences de menaces séparément. `possessable`
  reste faux ; les finales pacifiques ne reçoivent aucun objectif d’élimination.
- `finalePolicies` conserve les politiques source, leur continuité et leurs
  raisons ; `reviewQueue` conserve les recherches manquantes.
- `runtimeMissions` décrit les 32 contrats Cité. Les suites portent leur
  `requiresMissionId`, leur chapitre et les routes héritées ; chaque nouveau
  choix possède une intervention physique distincte. Les objectifs, constats
  et coordonnées de chaque branche sont exportés. Les quatre nouvelles aventures
  décrivent aussi dix prises/dépôts de cinq objets de quête, puis une clôture
  auprès du personnage concerné. Leur présence dans le code ne certifie pas
  une recette navigateur ; ce catalogue ne remplace ni les tests des contrats
  ni la CI.
- `commonPolicies` regroupe sauvegarde, pause, prérequis DLC, récompenses et
  travaux communs. Aucun gain, achat, déblocage ni téléchargement n’est déclenché
  par ce catalogue.

Les champs de suivi éditables sont `priority`, `planningStatus`, `owner`,
`targetMilestone` et `reviewNotes`. Pour garder des modifications faites dans
Excel lors d’une régénération, réimporter explicitement ces colonnes par ID.
Le générateur n’annonce aucune synchronisation bidirectionnelle automatique.
Le mode d’édition du classeur existant préserve les colonnes de suivi, les
formules et les feuilles sans changement. Pour les quatre prolongements liés,
il ajoute dans la colonne de sources l’ID du contrat et ses limites concrètes,
sans remplacer les intentions initiales ni marquer le suivi terminé.

Les nouvelles lignes de « Contrats jouables » distinguent le transport d’un
seul objet de quête de l’inventaire de combat. Elles documentent les gestes
locaux et le retour au résident ; les animations d’escorte ou la vie complète
du refuge ne sont pas annoncées comme réalisées. « Modes FPS » ajoute les
commandes V/B et leurs limites de stock, recharge, pause et session, avec
provenance dans le helper d’équipement, les profils et le raccord de l’écran.

### Provenance de la présentation

Le reçu du classeur et sa relecture utilisent le schéma 6. En complément des
19 entrées de `runtimeSources` et des 3 entrées de `fieldEquipmentSources`,
`cityPresentationSources` contrôle sept fichiers : `HubScreen.jsx`,
`mosaicMissionOperations.js`, `mosaicMissionCargo.js`, `renderer.js` et
`spriteAssets.js`, ainsi que `immersiveHubState.js` et `useSceneViewport.js`
pour le cadrage lors du montage, de la restauration et du redimensionnement.
Ces groupes peuvent partager des fichiers. Le rendu des sprites, sa géométrie
et ces dépendances de caméra ne figurent pas dans le manifeste de planification ;
ce groupe externe conserve leurs empreintes sans ajouter de cellules.

La correction d’affichage des cartouches après la révision `22eb3ec8` conserve
toutes les données logiques de planification, les contenus, le suivi et les
formules. Seule l’empreinte de `mosaicMissionOperations.js` change dans le
manifeste de planification. Le classeur est donc conservé à l’octet près.
`provenanceRefresh` relie le nouveau reçu au reçu précédent et à l’empreinte du
classeur conservé. La relecture vérifie réellement les empreintes du classeur,
de la planification et des trois groupes de sources dans le dépôt courant ;
elle rejette aussi l’absence d’une des sept dépendances de présentation.

Le correctif de cadrage après `63aae093` conserve également le JSON de
planification complet à l’octet près, manifeste et empreinte compris. Le reçu
actualise l’empreinte de `HubScreen.jsx` et ajoute les deux dépendances de
caméra au groupe de présentation ; les 19 sources des contrats restent
identiques. Cette actualisation de provenance ne réexporte pas le classeur.

## Reproduction

Depuis la racine du dépôt, avec **Node 22** et les dépendances verrouillées :

```sh
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs \
  scripts/extinction-city/missionPlanning.mjs \
  4ca3b2b87f4b7234612f11fc5c17ba205d36d340 \
  /tmp/mission-planning-2026-11-08.json \
  docs/extinction-city/mission-planning-coverage-2026-11-08.json
```

Le premier chemin reçoit le JSON développé ; le second reçoit le reçu compact.
Le reçu conserve les comptes, l’empreinte du JSON logique, l’empreinte du
manifeste de sources et l’empreinte des données de planification. Les sorties
sont déterministes à sources identiques. Une modification du contenu importé
ou du générateur demande une nouvelle génération des données et du reçu.
L’égalité des données logiques doit être établie avant de conserver le classeur
sans le réexporter ; une modification des cellules demande sa régénération.

La relecture du classeur avec contrôle des sources s’exécute ainsi :

```sh
python3 scripts/extinction-city/verifyCharacterMissionWorkbook.py \
  docs/excel/Multiverse_Breach_Missions_Cite_Par_Personnage_2026-11-08.xlsx \
  --planning /tmp/mission-planning-2026-11-08.json \
  --provenance-receipt docs/extinction-city/character-mission-workbook-receipt-2026-11-08.json \
  --repo . \
  --receipt /tmp/character-mission-workbook-readback.json
```

Le JSON de planification, le reçu de provenance et les fichiers sources doivent
provenir du même état du dépôt. Cette vérification ne remplace pas les parcours
de jeu natifs.

```sh
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs \
  --test scripts/extinctionCityMissionPlanning.test.mjs \
  scripts/extinctionCityCatalog.test.mjs

node node_modules/oxlint/bin/oxlint --max-warnings 0 \
  scripts/extinction-city/missionPlanning.mjs \
  scripts/extinctionCityMissionPlanning.test.mjs
```

Les quatorze tests spécifiques couvrent les identités et deux volets, les objectifs
pacifiques, les 129 politiques, les occurrences ennemies, les variantes, l’Ancre
qui ne se rencontre pas elle-même, la séparation des contrats runtime,
plusieurs divergences d’incarnation, les lacunes, les quatre liens explicites,
les transferts ordonnés d’objets et la reproduction des empreintes. Ce sont des
tests de données et de provenance, pas une validation
artistique, une expertise de chaque canon externe ou 3 824 parcours jouables.
