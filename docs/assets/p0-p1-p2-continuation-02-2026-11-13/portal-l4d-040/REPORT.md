# Portal / Left 4 Dead — lot réservé de 40 acteurs

Le lot conserve les 40 identités réservées à partir de `98991b161` : 25 Portal et 15 Left 4 Dead, dont 16 héros. Les contrats individuels précisent édition, forme, équipement, rôle et limites de l’adaptation. Ils distinguent notamment le noyau Wheatley de son châssis central, PotatOS du corps de GLaDOS, le corps d’un infecté d’une flaque d’acide et un enregistrement d’un personnage incarné.

Les profils de combat natifs et RPG complets restent identiques pour 38 acteurs ; les 40 préparations conservent leur absence de signature spécialisée. Les IDs, noms, univers, statistiques et clés de sauvegarde des 40 acteurs restent inchangés. Aucune image ni animation n’est déclarée fidèle ou livrée par ce lot.

## Corrections exécutables

PotatOS (`glados_core`) et l’alias audio `cave_johnson_echo` infligeaient encore des dégâts énergétiques, de mêlée ou de zone. Leurs quatre actions deviennent des consignes de soutien `buff`/`guard`, avec dégâts nuls, ciblage allié ou soi et aucun équipement offensif. Les dix héros Portal disposent ainsi de profils non offensifs. Les durées et effets de soutien sont des abstractions du jeu, pas des pouvoirs certifiés de Portal.

Les présentations de Cave Johnson et Caroline ne reçoivent plus l’arme générique de leur catégorie. Zoey utilise une arme à feu ordinaire au lieu du type `slash` générique. Ses pistolet et fusil de chasse désignent un choix d’équipement de survivant, pas un pouvoir exclusif.

L’alignement du catalogue brut de Chell sur son appui déjà résolu corrige aussi quatre véritables invocations : celles de Cave Johnson, Caroline, PotatOS et l’alias Echo. Leur porteur et leur slot restent **Chell / secondary**. L’ancienne entité `Turret Summon`, son ID synthétique et sa planche de tourelle sont remplacés par l’appui de Chell, `guard`, dégâts nuls, avec la présentation du héros existant. Le delta exact figure dans `invocation-binding-delta.json`.

Chaque appel possède un contexte explicite : archives du fondateur, archives de Caroline, PotatOS accompagnant Chell, ou canal des enregistrements tardifs de Cave. Ces renforts du Nexus ne prétendent ni réunir canoniquement des humains de deux époques dans un combat, ni conférer à Chell un déploiement de tourelle ou créer un fantôme de Cave.

Le slot secondaire brut historique de Bill est conservé. Le modifier en soutien aurait déplacé l’invocation de Zoey de `Bill / special` à `Bill / secondary`, avec un autre ID et un autre effet. Son avertissement `GENERIC_TECHNIQUE_NAMES` reste donc ouvert. Neuf autres avertissements génériques bruts disparaissent par alignement sur des actions déjà résolues avant ce lot ; ce ne sont pas neuf nouveaux pouvoirs.

## Décompte et limites de source

| Variation du sous-ensemble de tâches de source | Nombre |
| --- | ---: |
| P1 retirés, répartis sur 37 acteurs | 118 |
| `INCARNATION_UNSPECIFIED` | 37 |
| `VISUAL_CONTRACT_MISSING` | 36 |
| `REFERENCE_MISSING` | 36 |
| `GENERIC_TECHNIQUE_NAMES` | 9 |
| Nouveaux P1 | 0 |
| Nouveaux P2 `REFERENCE_SCENE_REVIEW` | 36 |
| P2 clôturés / approbations artistiques | 0 / 0 |

`source-task-delta.json` énumère les paires acteur/tâche exactes. Les 36 références ajoutées restent soumises à leur revue de scène et d’image : une URL et une cible individuelle ne prouvent pas leur ressemblance graphique.

L’alias audio Cave Johnson Echo conserve ses P1 de corps visuel et de référence d’acteur. `Sentry Drone Sphere`, `Cave Johnson Recording Core` et `Aperture Cooperative Test Core` conservent chacun leurs trois P1 de cible, contrat visuel et référence : leurs rôles connexes sont documentés sans leur fabriquer un corps canonique. Bill conserve le P1 générique mentionné plus haut.

Les appareils, cores parlants et dangers portent des limites explicites. Les HP, vitesses et attaques historiques de certains slots d’environnement restent des adaptations à revoir ; ce lot ne prétend pas avoir converti leur exécution en effets de scène. `Spitter Acid Pool` désigne la flaque, pas un corps de Spitter mobile. Les recherches de tenues officielles, rasters manquants, animations et comparaisons artistiques restent ouvertes.

## Vérification

La suite standard `scripts/portalLeft4DeadSourceContracts20261113.test.mjs` passe **58/58**, sans échec ni skip, en **3,699 s**, avec Node 22, heap 2048 MiB et concurrence 1 sur CPU 0–1. `validation-final.{json,tap}` contient commande, résultats et empreintes suivies, inchangées pendant le passage.

Elle compare les profils préparés, les profils RPG complets et la photographie figée des 40 acteurs, les équipements, les portes de revue, les contraintes de corps et les quatre changements de binding. Douze cas exécutent le vrai `EngineRpg` : chaque appel corrigé est joué côté joueur et côté ennemi, plus une interruption par destruction de moteur pour chaque appel. Ils vérifient un seul engagement ATB/charge, un seul impact de garde, aucun dégât dans les deux camps, le refus d’un second usage même après recharge des compteurs et le nettoyage des actions, scènes et timers. Une interruption avant contact ne produit aucun impact différé.

Le premier passage est conservé dans `validation-first.{json,tap}` : 57/58, les douze exécutions EngineRpg étant déjà vertes. L’unique échec venait d’une propriété propre `undefined` omise par le JSON de photographie. La comparaison finale conserve le profil live complet ancien/actuel et la photographie sérialisée, avec encodage explicite des nombres non finis ; aucun champ de profil n’est supprimé pour masquer une différence.

Les photographies compactes sont `runtime-before.json.gz` et `runtime-after.json.gz`. `probe-runtime.mjs` conserve la méthode ; `cg-hero-field-delta.json` transmet les 16 changements de fiches héros au propriétaire du validateur CG. Les helpers privés sont déclarés dans les deux manifestes, sans faux adaptateur. La suite vérifie qu’un profil de base les exclut et que seul le pack choisi conserve son helper.

Les sources textuelles effectivement accessibles sont archivées sous `source-pages/` : sites Valve Portal 2 et Lab Rat, les quatre éditions Steam et les articles de contexte. L’accès à Portal Wiki et au wiki communautaire Left 4 Dead était refusé ; Valve Developer Community renvoyait un contrôle anti-robot. Ces réponses ne sont pas comptées comme sources inspectées. L’article Portal 2 est une capture textuelle bornée, explicitement signalée tronquée dans son reçu. Aucune référence graphique de scène n’est déclarée revue.

Le périmètre produit est de sept constructeurs locaux, deux nouveaux helpers privés et deux manifestes. Aucun moteur, fichier de signature partagé, index régénéré, fichier CG, package, asset, build Vite, export global ou commit n’est modifié par cette sous-tâche. La régénération des index et la revue indépendante appartiennent à l’agent principal.
