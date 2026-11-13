# Inventaire courant des priorités — 13 novembre 2026

L’export réel recense **4 937 acteurs dans 525 univers**, avec **17 318 tâches P1**
et **13 406 tâches P2**. **4 935 acteurs** possèdent au moins un P1. Les
**22 P0 visuels historiques restent suivis séparément** ; cet inventaire ne
clôture aucun P0/P1 et ne certifie aucun dessin à 1:1.

## Version et méthode

Les données et l’arbre complet des assets proviennent du snapshot immuable
`daca0f002eaa94cf16b06d5ad366b0423ea294d2`, arbre
`56ff8f6cdb1578e266797571e59fe2db25ed58bc`. Ses parents sont la reprise
`66f8691` et le master GitHub vérifié `2333c2c0`. Ce snapshot sert à l’audit ;
il n’est pas présenté comme le commit final de livraison.

`exportActorFidelityBacklog.mjs` a réellement chargé les modules du jeu sous
Node 22, avec le loader JSON existant, un tas limité à 1 024 Mio et deux CPU.
La commande a terminé avec le code **0**, du **08:04:01.084 au
08:04:12.063 UTC**, sous Node **22.23.5**. Les **1 778 fichiers du graphe et le loader**, soit
1 779 fichiers, correspondaient exactement aux blobs du snapshot avant
l’exécution ; leurs empreintes sont identiques après celle-ci.

La présence des images est contrôlée dans l’arbre Git et projetée depuis
`DLC/<Univers>/assets/` vers les URL publiques. Les fichiers exclus du checkout
sparse et les pointeurs Git LFS restent des assets présents dans cet arbre.
Ce relevé n’inspecte pas chaque bitmap et n’exécute pas un combat ou un build.

## Constats P1

| Code / travail | Tâches et acteurs concernés |
| --- | ---: |
| Recherche de variantes officielles non documentées | 4 570 |
| Incarnation non précisée | 3 436 |
| Contrat visuel absent | 3 215 |
| Référence individuelle absente | 2 900 |
| Raster résolu absent de l’arbre Git | 1 474 |
| Au moins un nom de technique générique détecté | 1 363 |
| Contrat visuel encore générique | 213 |
| Graphismes dédiés de costumes officiels à produire | 55 |
| Consigne de visage original à revoir pour une identité externe | 47 |
| Pistes de recherche ciblées | 31 |
| Planche de gameplay déclarée 1×1 à examiner | 11 |
| Périmètre raster non résolu | 3 |
| **Total P1** | **17 318** |

Ces groupes se recouvrent au niveau des acteurs. Ils ne sont pas autant de
défauts graphiques observés manuellement. Un nom générique ne prouve pas
l’absence de logique de combat ; une recherche de costume ouverte ne prouve
pas une panne du personnage de base.

Les trois périmètres raster non résolus sont **Ahsoka Padawan**, **Ahsoka du
Siège de Mandalore** et **Revan KOTOR I**. Le résolveur écarte les octets précis
de leurs anciens sprites mis en quarantaine. Une URL vide représente ici une
source visuelle non qualifiée ; elle n’est pas comptée comme un PNG supprimé.

Les onze planches 1×1 comprennent Feral Predator comme boss du roster Predator,
Crustaceous Rex et les neuf dossiers originaux déjà signalés. Ce sont des
contrôles d’animation à effectuer, pas onze régressions nouvellement prouvées.
Le boss Feral du roster Predator et le héros `feral_predator` du roster Prey
gardent leurs identités distinctes.

## Différence vérifiée avec le premier export

La [baseline numérique](baseline-72bea3d3/baseline-manifest.json) conserve le
premier snapshot `72bea3d3`, ses reçus et ses empreintes. Les gros fichiers
acteurs/CSV ne sont pas dupliqués ; leurs SHA et la commande de reproduction
depuis la référence immuable restent disponibles.

Le [delta par acteur et code](source-findings-delta.json) établit exactement
**quatre constats P1 résolus**, sans nouvelle tâche ajoutée :

| Acteur exact — univers Alien | Constat avant | Donnée après |
| --- | --- | --- |
| Synthetic Ash Protocol | Raster `/bosses/alien/…` absent | Raccord au PNG `/bosses/alien-1979/…` existant |
| Synthetic Ash Protocol | Incarnation non renseignée | `Alien (1979)` explicitement sélectionné |
| Chestburster Larva | Raster `/bosses/alien/…` absent | Raccord au PNG `/bosses/alien-1979/…` existant |
| Chestburster Larva | Incarnation non renseignée | `Alien (1979)` explicitement sélectionné |

Les images existaient déjà dans l’arbre audité. Leurs octets n’ont pas changé :
ces corrections sont deux raccords de fichiers existants, pas deux générations.
Les deux acteurs gardent chacun trois P1 : contrat visuel individuel, référence
individuelle déclarée et recherche de variantes officielles. Aucun dossier
acteur n’est donc déclaré terminé à 1:1.

Le [suivi du premier lot de 40](first-batch-progress.json) distingue ces
**deux raccords traités et les 38 autres cibles initiales restantes**.
Les 40 acteurs initiaux ont encore au moins un P1 ; le sous-ensemble de leurs
rasters absents passe de 15 à 13. La file courante est ensuite retriée sur les
constats effectivement ouverts.

## P0 et refus de génération

[L’audit détaillé](audit.json) rapproche chaque P0 historique de son identité
exacte et des chemins réellement résolus dans cette version. Les deux personas
originales reclassifiées en R3 ne sont pas réintroduites dans les P0 externes.
Les nouvelles planches déjà livrées de Luke et Han Solo exigent une revue
actuelle avant de décider une éventuelle nouvelle production.

Cinq tentatives de cette reprise ont été refusées sans image livrée :
**Stitch**, **Harley Quinn New 52**, **Joker New 52**, **Lilo** et **Roger Rabbit**.
Leurs reçus originaux restent liés depuis l’audit. Ces cinq dossiers restent
ouverts, sans nouvelle image comptée ni nouvelle tentative programmée. Les
autres refus historiques doivent également être vérifiés avant production.

## Lots de 40

[La file machine](actor-batches-40.json) contient **124 lots** : 123 lots de
40 acteurs et un dernier lot de 15. Chaque entrée utilise la clé exacte
univers/ID, ou univers/nom lorsque l’acteur n’a pas d’ID propre.

L’ordre de travail commence par les P0 visuels historiques, puis les trois
quarantaines, les rasters absents, les conflits de visage et les autres
constats de source. Ce tri ne crée pas de nouveaux labels P0. Chaque lot
commence par vérifier les sources et l’incarnation ; les refus conservés
restent limités au travail de référence et de revue, sans relance automatique.
Les dossiers ne sont ni attribués à des agents ni déclarés terminés.

## Fichiers et limites

- [Dossiers complets des acteurs](actors.json) : données, techniques, chemins,
  constats et priorités du snapshot.
- [Tâches individuelles](tasks.csv) : 30 724 lignes de travail, identités
  stables, motifs et preuves ; les états exportés restent `OPEN`.
- [Synthèse brute de l’exporteur](summary.json) : le libellé de schéma `R14`
  provient de l’exporteur existant ; le SHA d’entrée identifie la version réelle.
- [Reçu de commande](export-receipt.json),
  [sortie standard](export.stdout.txt),
  [empreintes avant](inputs-before.json) et [après](inputs-after.json).
- [Manifeste des livrables](delivery-manifest.json).

Les anciens totaux d’octobre restent des instantanés distincts. Leur différence
avec les chiffres ci-dessus n’est pas présentée comme autant de tâches
manuellement achevées. L’audit des acteurs ne clôture pas les plans de stages,
les dossiers Rift, la production CG, les costumes ou les animations natives.
