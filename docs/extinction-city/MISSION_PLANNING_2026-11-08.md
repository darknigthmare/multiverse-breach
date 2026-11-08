# Missions de Cité par personnage — catalogue de préparation

Ce lot fournit **deux propositions pour chacun des 1 912 personnages résolus**,
Ancre comprise : une mission liée à l’univers d’origine et une mission originale
de Cité/Multiverse. Les **3 824 propositions restent à concevoir et implémenter**.
Elles ne sont ni des épisodes canoniques déclarés ni des missions déjà jouables.

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
| Contrats Cité présents dans le runtime | 28 | 24 Nexus, 2 Halo, 2 Alien. Onglet distinct ; aucune proposition n’est marquée implémentée par rapprochement de personnage. |

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
- `runtimeMissions` décrit les 28 contrats Cité ajoutés séparément. Les douze
  suites Nexus portent leur `requiresMissionId`, leur chapitre, les deux routes
  héritées du premier choix et les deux vérifications physiques du nouveau choix.
  Les objectifs, constats et coordonnées de chaque branche sont exportés. Leur
  présence dans le code ne certifie pas une recette navigateur ; ce catalogue
  ne remplace ni les tests des contrats ni la CI.
- `commonPolicies` regroupe sauvegarde, pause, prérequis DLC, récompenses et
  travaux communs. Aucun gain, achat, déblocage ni téléchargement n’est déclenché
  par ce catalogue.

Les champs de suivi éditables sont `priority`, `planningStatus`, `owner`,
`targetMilestone` et `reviewNotes`. Pour garder des modifications faites dans
Excel lors d’une régénération, réimporter explicitement ces colonnes par ID.
Le générateur n’annonce aucune synchronisation bidirectionnelle automatique.

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
ou du générateur demande une nouvelle génération du reçu et du classeur.

```sh
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs \
  --test scripts/extinctionCityMissionPlanning.test.mjs \
  scripts/extinctionCityCatalog.test.mjs

node node_modules/oxlint/bin/oxlint --max-warnings 0 \
  scripts/extinction-city/missionPlanning.mjs \
  scripts/extinctionCityMissionPlanning.test.mjs
```

Les douze tests spécifiques couvrent les identités et deux volets, les objectifs
pacifiques, les 129 politiques, les occurrences ennemies, les variantes, l’Ancre
qui ne se rencontre pas elle-même, la séparation des contrats runtime,
plusieurs divergences d’incarnation, les lacunes et la reproduction des
empreintes. Ce sont des tests de données et de provenance, pas une validation
artistique, une expertise de chaque canon externe ou 3 824 parcours jouables.
