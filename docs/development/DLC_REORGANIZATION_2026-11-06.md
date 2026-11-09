# Réorganisation des univers en dossiers DLC

> Ce document décrit la première phase du 6 novembre 2026. La reprise a ensuite
> déplacé physiquement les ressources et adapté leur publication : voir
> [la deuxième phase](DLC_ASSETS_REORGANIZATION_2026-11-07.md), puis les
> [profils de distribution indépendants](DLC_INSTALLATION_PROFILES_2026-11-07.md).
> Le mode d’emploi courant est dans [`DLC/README.md`](../../DLC/README.md) ; les
> limites et nombres ci-dessous restent ceux de cette première phase.

## Point de reprise

La migration part du commit `3036cd021edfe544534a09df5c401eb024808b39`
de `master`, dans la branche `refactor/dlc-universe-folders-2026-11-06`.
Les fichiers joints à la conversation sont plus anciens et ne remplacent pas
les sources du dépôt. La reprise conserve les modifications préparées lors de
la première passe.

## Critères de conservation

- Les personnages, adversaires, équipements, niveaux, traductions, récompenses
  et règles déplacés conservent leurs données et leurs identifiants.
- L'ordre des univers, leur visibilité initiale et les clés des sauvegardes
  restent compatibles.
- Les imports publics des catalogues `src/game/` continuent à fonctionner.
- Chaque univers optionnel dispose d'un dossier `DLC/NomDeLUnivers/` ; le Nexus
  et les vingt univers de la campagne originale restent dans le jeu de base.
- Les audits doivent examiner les définitions déplacées et échouer sur un
  module manquant ou un manifeste périmé.

## Contenu livré

| Élément | Résultat |
| --- | ---: |
| Dossiers avec manifeste et inventaire de ressources | 505 |
| Univers déjà enregistrés dans le catalogue DLC du jeu | 504 |
| Dossier de ressources sans portail ni campagne ajoutés (`CloudMeadow`) | 1 |
| Modules déclarés | 1 879 |
| Modules de données | 1 870 |
| Modules de comportement spécifiques | 9 |
| Niveaux historiques extraits du Hub | 31 |
| Modificateurs d'univers extraits du Hub | 63 |
| Chemins publics suivis par l'inventaire | 14 163 |
| Chemins rattachés à un dossier DLC | 8 187 |
| Chemins de base, de campagne, partagés ou sans attribution certaine | 5 976 |

Les catalogues existants assemblent les définitions propres aux univers avec
leurs constructeurs communs. Les comportements spécifiques, comme les
rencontres Scarab, Nihilanth ou Metal Gear REX, disposent de modules `runtime/`
et de réexports compatibles à leur ancien emplacement.

Les points d'entrée des dossiers et le registre global sont générés et vérifiés.
Les workflows concernés incluent `DLC/**` dans leurs déclencheurs et leurs
copies partielles. Les audits de progression, de niveaux et de prompts lisent
les nouveaux modules au lieu de dépendre exclusivement d'anciens blocs inline.

La revue a également corrigé le contrôle d'inventaire pour les exports sans
Git : sans `.git` utilisable, il compare les fichiers réellement exportés aux
inventaires enregistrés. Les tests couvrent les métadonnées absentes ou vides,
le dépôt parent à ignorer et les fichiers omis ou ajoutés. Un vrai index du
projet garde la priorité dans les copies partielles.

La première exécution CI a révélé un défaut déjà présent dans la branche de
base : le workflow d'affichage omettait `.ai-tools/` de sa copie partielle,
alors que `AGENTS.md` contient des liens vers ce dossier. Le workflow récupère
désormais ces fichiers et réagit aussi à leurs modifications ; le contrôle des
liens est conservé.

## Vérification à la reprise

| Commande ou contrôle | Observation |
| --- | --- |
| `npm run test:dlc` | 25 tests réussis ; registre et inventaires à jour, y compris les trois régressions d'export sans index Git. |
| `npm run dlc:verify:migration` | 77 catalogues comparés au reçu initial, aucune différence ; les contrôles dérivés incluent les niveaux, l'ordre des DLC, les univers masqués, les niveaux historiques et les modificateurs. |
| `npm run test:audit-combat` | 48 tests réussis ; cycles de combat RPG, cibles, interruptions, ressources et consommation des événements. |
| `npm run test:audit-tactics` | 116 tests réussis ; cycles tactiques, compétences, soins, réanimations et prévisions de dégâts. |
| `npm run lint` | Réussite ; les cinq avertissements déjà présents dans les fixtures et le test Discipline subsistent. |
| `npm run check:gamedev-guides` | Réussite : 23 fichiers amont, quatre entrées de skills et routeur. |
| `git diff --cached --check` | Réussite. |
| `npx --no-install vite build` | Compilation réussie ; avertissement sur la taille de certains bundles. |
| `npm run build` | Arrêt dans `prebuild`, à `test:discipline` : 46/49 tests réussissent, trois nécessitent des PNG/manifestes non matérialisés dans cette copie partielle. Aucun contrôle n'a été désactivé. |

Le reçu de conservation est
[`dlc-migration-baseline-2026-11-06.json`](dlc-migration-baseline-2026-11-06.json).
Il compare les exports sérialisables et ne démontre pas à lui seul l'équivalence
de toutes les fonctions. La première passe avait également conservé des logs
locaux de 947 tests conversation, 87 tests après récupération de sources et
51 tests d'outillage réussis. Ces nombres décrivent les exécutions de cette
première passe, pas de nouveaux parcours joueur à la reprise.

Le build complet doit être vérifié par le workflow `Full production build`,
qui récupère les fichiers LFS. La compilation Vite isolée ne remplace pas ce
workflow. Le lancement local de Chromium a échoué avant ouverture du jeu à
cause d'une interdiction système de création de socket ; aucun nouveau parcours
navigateur ni contrôle de fidélité visuelle n'est annoncé pour cette reprise.

## Limite et suite de la séparation

Les fichiers binaires restent physiquement dans `public/` avec leurs URL
historiques. `assets.json` est un inventaire de rattachement, pas une copie ni
une preuve d'usage exclusif ou de fidélité des images. Les dépendances partagées
et les rattachements incertains sont explicites dans `DLC/shared-assets.json`.

Les données et le code par univers sont rangés ; la distribution indépendante
reste à implémenter. Le jeu importe encore les catalogues à la compilation.
Il ne faut donc pas supprimer un dossier DLC pour tenter de désinstaller son
contenu. La prochaine étape doit traiter ensemble le déplacement des binaires,
leurs audits de provenance, les outils de génération, les références partagées
et le chargement conditionnel des packs.

Le mode d'emploi pour modifier ou ajouter un univers est dans
[`DLC/README.md`](../../DLC/README.md).
