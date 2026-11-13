# Audit indépendant des constats d’acteurs

Le point de départ réel est le commit `5952da01c54a0dc8235ab4d0cea9463ba531443c`. L’export a été exécuté dans une copie de **3 854 sources Git**, vérifiées par leurs OID puis SHA-256. Il charge le graphe complet du catalogue ; les images sont recherchées dans les **59 585 entrées de l’arbre Git complet**, sans déduire leur absence de ce checkout partiel. Aucun média n’a été copié. Les empreintes et la nouvelle lecture des fichiers figés sont consignées dans [before-source-inputs.json](before-source-inputs.json) et [before-source-validation.json](before-source-validation.json).

Le [bilan final du checkpoint b9e616b](checkpoint-b9e616b/README.md) confirme **16 981 constats P1, 13 506 P2 et 1 473 acteurs avec raster manquant**, sans changement des 4 937 identités. Les 277 retraits P1, 39 retraits P2 et 79 nouvelles revues P2 sont comparés par clé et code. Le commit CG final `2a6911bdc` conserve tous les fichiers d’entrée de cet audit ; le [reçu de continuité](checkpoint-b9e616b/final-cg-continuity.json) distingue ses changements de métadonnées et d’outillage du runtime figé. Le [nouveau suivi de cinq lots de 40](checkpoint-b9e616b/work-batches-40.json) permet de reprendre les travaux encore ouverts.

La base compte **4 937 acteurs**, **17 258 constats P1** et **13 466 constats P2**. Ses compteurs sont identiques à l’export précédent ; l’exécution nouvelle les rattache aux véritables sources `5952`. [before-summary.json](before-summary.json) conserve les compteurs et [before-actor-tasks.json](before-actor-tasks.json) les clés et codes nécessaires à une comparaison exacte. Les P0 historiques et refus de génération ont leur suivi distinct : leur absence du classement courant ne constitue pas une clôture.

## Catalogue brut et comportement effectif

Les **1 363 acteurs portant des noms de techniques génériques dans le catalogue brut**, soit **4 229 slots**, possèdent déjà des noms résolus dans les vrais adaptateurs de combat et de commande RPG. La sonde a importé les véritables `resolveCombatAbility`, `getRpgCombatantAbility` et `prepareSourceSignature` depuis le snapshot ; elle prépare seulement des clones. Les 1 363 acteurs ont des noms effectifs non génériques, avant et après préparation. [before-runtime-techniques.json](before-runtime-techniques.json) conserve les résultats détaillés.

Ce constat ne supprime **aucun** signal `GENERIC_TECHNIQUE_NAMES` : celui-ci décrit encore correctement les données brutes, notamment lorsqu’une interface les affiche directement. Un nom effectif distinct ne prouve ni une mécanique exacte, ni une animation fidèle, ni un personnage entièrement terminé. Le classificateur et l’exporteur globaux restent inchangés.

## Précision d’incarnation et limites P2

Une déclaration individuelle réellement transmise au catalogue peut retirer `PACK_CONTINUITY_PRECISION` ou `ACTOR_CONTINUITY_PRECISION`. Cette amélioration concerne la sélection de l’édition, du modèle ou de la rencontre. Elle ne ferme pas automatiquement `REFERENCE_SCENE_REVIEW`, `ORIGINAL_COSTUME_ARTWORK`, `ANIMATION_AND_VISUAL_REVIEW` ou les constats de raster et de visage. Le classificateur courant garde ces revues ouvertes, y compris quand une référence HTTPS existe.

Le helper [actor_task_delta.py](actor_task_delta.py) compare uniquement les mêmes clés d’acteurs et codes de constats, refuse les identités divergentes et rapporte séparément ajouts, suppressions et changements de priorité. Un constat retiré reste nommé **source finding removed, scoped review required**, avec zéro approbation d’acteur ou d’art. Son contrôle d’identité sur les 4 937 acteurs retrouve zéro différence.

## Contrôle isolé du lot arènes

Une copie privée superpose exactement les huit sources finales du lot arènes au snapshot Git : [arena-targeting-source-overlay-final.json](arena-targeting-source-overlay-final.json). Les octets modifiés sont explicitement étiquetés fichiers de travail figés ; ils ne sont pas présentés comme appartenant au commit de base. Les [sondes avant](arena-runtime-before.json) et [finale](arena-runtime-targeting-final.json) couvrent les 40 identités exactes, les quatre commandes résolues et leurs profils RPG, ainsi que la préparation des signatures.

- **39/40** incarnations atteignent effectivement le catalogue avec `ACTOR_DECLARED`. Necris conserve `EXACT_PACK_BINDING` et son constat de précision ouvert.
- La propagation du factory ne change aucune incarnation en dehors de ces 40 acteurs : [contrôle du graphe complet](arena-factory-propagation.json).
- La première proposition décrivait `Redeemer Missile`, alors que Gorge exécutait toujours la décharge Flak et Sapphire l’orbe Shock du kit existant : [diagnostic initial](arena-runtime-after.json). La correction finale projette les douze actions réelles dans le catalogue. Les douze noms, types et dégâts concordent ; les 48 profils RPG préparés des douze héros restent strictement identiques. Ces corrections de catalogue ne sont pas comptées comme de nouvelles mécaniques exécutées.
- Les extraits de références ont une portée précise. Le mot « Gina » dans les crédits du manuel (`Gina Hedges`) n’atteste pas le modèle de l’avatar. Les déclarations structurées sont vérifiées ; toutes les scènes et tous les modèles ne sont pas pour autant certifiés par ce manifeste. Les revues de référence et d’art restent ouvertes.

Un second défaut réel concernait les armes nommées `Link Gun`, `Shock Rifle`, `Flak Cannon`, `Rocket Launcher` et `Lightning Gun` : le fallback sensible à la casse classait leurs tirs en contact. Après ajout de ces noms exacts, **six profils simples de PNJ passent de melee à ranged** ; les sept PNJ sont maintenant à distance, Xan et son Minigun l’étant déjà. Les 48 profils préparés des héros restent identiques. [Comparaison isolée du ciblage](arena-targeting-fix-isolated.json).

Le même fichier de cinq tests finaux, avec la même empreinte, échoue **5/5 sur les vraies sources Git 5952** et passe **5/5 sur l’overlay final**. Le nouveau helper d’UT2004 n’a pas été copié dans la base avant test. [Avant](arena-five-tests-before.json) · [Après](arena-five-tests-after.json) · [Comparaison finale](arena-targeting-final-independent-review.json). Les résultats intermédiaires des quatre tests, avant ajout du contrôle de ciblage, restent archivés séparément.

## Contrôles finaux FF et science-fiction

Les comparaisons utilisent les 40 clés réservées de chaque lot et les véritables résolveurs, après préparation des signatures. Elles conservent les premières sondes ayant révélé des régressions, puis examinent de nouvelles copies figées après correction. Les diagnostics initiaux ne constituent pas le résultat final.

| Lot | Constats P1 retirés | Précision P2 retirée | Revues de scène P2 ajoutées | Contrôle runtime final |
| --- | ---: | ---: | ---: | --- |
| Arènes, 40 acteurs | 3 noms bruts | 39 | 0 | 48 profils préparés de héros identiques ; six tirs PNJ corrigés en ranged ; Gladiator garde son kit, avec continuité Quake II précisée. |
| Final Fantasy, 40 acteurs | 141 : 120 métadonnées et 21 noms bruts | 0 | 40 | 112 profils préparés des 28 héros et 21 kits sélectionnés strictement identiques. |
| Halo / Half-Life / Mass Effect, 40 acteurs | 128 : 115 métadonnées et 13 noms bruts | 0 | 38 | 92 profils préparés des 23 héros conservés et sept kits identiques. Cortana Fragment et l’ancien Buck changent intentionnellement. |

Les six pertes de signatures observées initialement — Arbiter, Seifer, Laguna, Irvine, Zolom et Sweeper — sont corrigées. Zell conserve aussi son ancien objet de spécial. Les comparaisons finales ne trouvent aucun kit perdu ni aucun écart de libellé brut/effectif sur les héros des deux lots. Cortana Fragment utilise des effets de soutien sans dégâts ; l’ancien Buck reprend l’action ciblée du kit ODST au lieu d’une attaque orbitale de zone. Collector Drone reçoit son type d’arme à feu corrigé.

[Résultat FF](ff-final-independent-review.json) · [Overlay FF](ff-source-overlay-final.json) · [Résultat science-fiction](scifi-final-independent-review.json) · [Overlay science-fiction](scifi-source-overlay-final.json). Le helper [review_actor_lot.py](review_actor_lot.py) utilise les constats de la base complète pour compter les ajouts de revues de scène : renseigner une référence retire `REFERENCE_MISSING` et ajoute `REFERENCE_SCENE_REVIEW`. Ces ajouts doivent être comptés dans le bilan net P2.

Ces trois lots totalisent 272 constats P1 retirés, 39 précisions P2 retirées et 78 revues de scène P2 ajoutées. Il s’agit de leur périmètre isolé, avant intégration des autres chantiers et export global. Aucun de ces constats ne prouve un nouvel artwork ou un acteur entièrement terminé.

## Raccord visuel Revan limité

L’atlas existant de Revan et les captures réelles avant/après ont été ouverts et inspectés indépendamment. Le rendu passe du substitut de quarantaine à une silhouette à capuche, armure sombre, drapé rouge et lame rouge unique, visible aux tailles de corps 72/108 et dans le HUD 64. La portée acceptée est le raccord de cette correction précise, avec ses gardes d’identité et d’empreinte ; les détails du masque, du costume et la chorégraphie officielle restent à revoir. Aucune nouvelle image n’est générée et la famille rejetée à deux sabres reste bloquée. [Revue indépendante limitée](revan-bounded-independent-review.json).

## Livraison raster Pinky limitée

Les crops frontaux et latéraux de la source classique et le contact final à 96 pixels ont été ouverts. La candidate corrigée conserve les petites cornes grises, les yeux jaune/or, la masse rose et la mâchoire du Pinky classique dans une adaptation de palette et de poses. L’empreinte du PNG final est revalidée. Cette lecture ne certifie pas les timings ni une copie des images officielles et ne ferme pas les 39 autres absences du lot.

La comparaison des logs historiques a été contrôlée indépendamment : **62 labels/statuts exactement identiques**, 27 succès et 35 échecs sur Git 5952 comme sur la version corrigée ; les quatre cas Pinky passent, RPG et Smash dans les deux camps. Le SHA-256 du test correspond au véritable blob Git 5952. Les anciens 24/38 étaient le diagnostic d’une régression intermédiaire de nom canonique, corrigée avant cette comparaison ; ils ne sont pas présentés comme l’état antérieur du dépôt. [Revue et contrôle des preuves](pinky-bounded-independent-review.json).

## Outils et reproduction

`prepare_source_snapshot.py` extrait uniquement les sources d’un commit explicite et produit l’arbre Git complet. `prepare_working_overlay.py` fige une liste explicite de fichiers par-dessus cette base, avec une provenance distincte. `inspect_runtime_techniques.mjs` sonde les noms génériques bruts ; `inspect_actor_lot.mjs` sonde une liste de clés exactes ; `inspect_metadata_graph.mjs` contrôle la propagation des métadonnées dans tout le graphe, sans reclasser les images.

`refresh_checkpoint.py` prépare l’exécution finale depuis un SHA Git réel : export complet, comparaison des constats et nouvelles sondes des trois cohortes de 40. Il refuse les répertoires de sortie préexistants et vérifie de nouveau les sources et les helpers à la fin. Les nouvelles baselines `*-runtime-before-lossless.json` conservent explicitement `Infinity`, `-Infinity` et `NaN`, qui ne sont pas convertis en `null` JSON. Les premières sondes restent archivées ; le nouveau format sert aux comparaisons du checkpoint final.

Les imports directs utilisent Node 22 avec le loader de compatibilité existant `scripts/sourceSceneTestLoader.mjs` du snapshot. Les copies de travail privées et les JSON complets de l’export sont sous `/tmp`, sans payload d’image. Un export final doit utiliser un nouveau checkpoint Git, ou conserver explicitement la provenance des fichiers de travail chargés. Étiqueter simplement les données modifiées avec l’ancien HEAD fournirait une provenance incorrecte.

Aucune de ces sondes ne constitue une revue artistique 1:1, une signature cryptographique d’auteur, une compilation de distribution ou une campagne jouée de bout en bout.
