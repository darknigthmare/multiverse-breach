# Excel de suivi — actualisation du 24 octobre 2026

## Fichiers actifs

- [Audit fidélité 1:1 et priorités](Multiverse_Breach_Audit_Fidelite_1a1_Priorites.xlsx)
- [Suivi des signatures / combats **RECONSTITUÉ**](Multiverse_Breach_Suivi_Combats_RECONSTITUE.xlsx)
- [Export filtrable des P0/P1](exports/priorites-P0-P1-2026-10-24.csv)

L'ancien fichier de la conversation est conservé, **sans modification**, dans [archives](archives/Audit_Fidelite_ancien_6fd4fd24_OBSOLETE.xlsx).
Ses chiffres et priorités sont obsolètes et ne doivent pas être fusionnés avec les lignes actuelles.

Le fichier original `multiverse_breach_catalog_lore_UPDATED.xlsx` n'a pas été récupéré.
L'arbre Git complet actuel ne contient aucun ancien `.xlsx`, `.xls` ou `.ods`.
Le suivi des combats est donc explicitement **reconstruit** à partir de l'export JSON/CSV de CI, et non présenté comme une restauration de cet original.

## Versions vérifiées

- GitHub master audité : [`5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6`](https://github.com/darknigthmare/multiverse-breach/commit/5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6).
- Arbre : `69e7bfd3635d022942ad01277d0b1088a73472c2`.
- Vercel public : https://multiverse-breach.vercel.app — `build-info.json` renvoie le même commit.
- Déploiement production READY : `dpl_DBNFTwS2UNzb1X3QmNJ5DfFPcBF4`.
- CI signatures : [run 39393362478](https://github.com/darknigthmare/multiverse-breach/actions/runs/39393362478), commit de fusion `2825479789c99499a39bef22ca37586a63bdf720` ; arbre strictement identique au master audité.
- Nouvelle vérification de production : [run 40091057307](https://github.com/darknigthmare/multiverse-breach/actions/runs/40091057307).
- [Versions et périmètres détaillés](evidence/versions-2026-10-24.json).

## Inventaire réellement projeté

| Famille | Nombre | Unité / précision |
|---|---:|---|
| Héros / alliés | 1 912 | Acteurs, Ancre incluse |
| Ennemis | 1 518 | Acteurs |
| Boss | 1 110 | Acteurs |
| World bosses | 396 | Acteurs |
| Stages | 3 203 | ID runtime uniques |
| PNJ / renforts | 1 076 | 525 contrats + 525 invocations + 26 liaisons natives, pas des individus distincts |
| Épreuves non combattantes | 334 | Rencontres |
| Objets / équipements | 4 215 | Définitions, hors objets d'invocation déjà suivis |
| Costumes / variantes | 1 979 | Définitions ; une palette n'est pas un costume canon complet |

Les familles se recoupent. Il n'existe **pas** de total de 15 743 sprites uniques : ce sont des définitions, contrats et occurrences.
Les modules de données ont été exécutés avec leurs overrides, au lieu d'additionner des listes historiques par expression régulière.

## Priorités : acteurs + stages (8 139 lignes)

| Priorité | Nombre | Sens |
|---|---:|---|
| P0 | 24 | Provenance de substitution non ressemblante et PNG historique inchangé, également servi sur Vercel |
| P1 | 3 559 | Contrôle prioritaire : référence à compléter, raster calculé absent, ou nouvelle planche à valider |
| P2 | 4 072 | Comparaison artistique / level design restant à réaliser |
| P3 | 484 | Contrat original / interne, sans refonte canon externe automatique |

Un P1 n'ordonne pas aveuglément une refonte. Un chemin PNG absent peut déclencher un fallback ; cela ne prouve pas un plantage.
Une adaptation déclarée ou une épreuve n'est plus automatiquement classée en P0.
Les 24 P0 sont accessibles dans `01_P0_confirmes`. Pour les P1, filtrer la colonne Priorité des catalogues ou utiliser le CSV.

## Changements importants par rapport au premier fichier

Les définitions de Ripley (Alien 1979), Jungle Hunter (1987) et Gordon Freeman (Half-Life 2) ont été corrigées.
Les scènes prioritaires comprennent maintenant Shadow Moses/REX, Xen/Nihilanth, Hadley's Hope/Queen, le train Lightmass/RAAM, Metropolis/Scarab et le camp du Légat/New Vegas.
Cela corrige les mélanges de source constatés précédemment, **sans certifier leur rendu artistique**.

Sur les 25 substitutions historiques Wave4 :
- 25/25 PNG actuels sont identiques entre GitHub et la production ;
- 24/25 sont toujours identiques aux anciens PNG d'août ;
- Saturnin utilise une nouvelle planche : retrait du P0 automatique, revue visuelle P1.

[Hashes et chemins des 25 PNG](evidence/sprite-production-checks.json).

## Vérification du jeu Vercel

L'accueil public a été chargé et capturé dans Chromium en 1280×800 et 390×844.
Les deux vues ont répondu HTTP 200, sans erreur JavaScript ni requête HTTP en échec observée.
Cette vérification est **limitée à l'écran initial**, plus les 25 PNG ; elle n'est pas un parcours intégral des niveaux.
Aucun compte réel, achat ni sauvegarde utilisateur n'a été utilisé.

- [Rapport navigateur](evidence/browser-production-results.json)
- [Capture ordinateur](evidence/production-1280.png)
- [Capture mobile](evidence/production-390.png)

## Fidélité artistique et signatures

**Aucune certification visuelle 1:1 globale et aucune note artistique inventée.**
La grille pondérée personnage / stage / PNJ figure dans `06_Methode`. Le total exige des critères complets et dans leurs bornes.
Les scores non saisis de l'ancien audit n'ont pas été transformés en validations.

Le deuxième classeur conserve les 4 936 lignes de couverture des signatures :
4 650 signatures spécifiques non couvertes, 185 contrats partiels et 101 non-combattants.
148 supers mêlée sont renseignés.
« A_INTEGRER » ne signifie ni personnage absent, ni sprite absent, ni jeu injouable.

Cette PR ne modifie aucun code de gameplay ni la production. Les workflows temporaires de collecte sont retirés du diff final.
