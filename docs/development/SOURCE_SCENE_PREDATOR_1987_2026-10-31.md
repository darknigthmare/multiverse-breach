# Mission 50104 — Predator (1987), duel final Dutch / Jungle Hunter

## Résultat ajouté

Une quatrième mission **Tactics source-locked** suit les scènes Sulaco (50101),
Narcissus (50102) et Blast Pit (50103), sans les remplacer. Elle porte l'ID
stable **50104** et requiert Dutch (`dutch`) dans l'univers **Predator**.
Les équipes d'autres univers et l'Ancre ne peuvent pas se substituer au
protagoniste. La mission passe par les moteurs de tour et de récompenses
existants; aucun montant de ressource ni schéma de sauvegarde n'est changé.

L'objectif n'est **pas** de vider la barre de vie du Jungle Hunter.
Le joueur doit obtenir de la boue froide, fabriquer des armes improvisées,
préparer une bûche à contrepoids, attirer le chasseur au feu, neutraliser
son camouflage, franchir la rivière (perte de boue), l'attirer près du piège,
libérer le contrepoids et rejoindre l'abri avant l'autodestruction au poignet.
Neuf commandes forment la séquence; les commandes hors portée, prématurées
ou rejouées sont refusées par le contrôleur de tour natif.

**Règles mesurables (adaptations de gameplay) :**
- Un seul Dutch en scène, pas de troupe ennemie générique ni de victoire par
  KO/HP ou par disparition de l'adversaire.
- La boue neutralise les zones de pression thermique jusqu'à la traversée
  de la rivière. La pression reprend ensuite, sous forme de cases annoncées.
- Le piège ne fonctionne qu'après la préparation et le face-à-face.
- La chute de bûche déclenche une fenêtre de **8 fins de tour** pour
  rejoindre l'abri. Au terme du compte à rebours : défaite irréversible
  (`self_destruct`).
- Durée maximale de 38 tours, déplacements et dégâts adaptés à la grille.
  La victoire utilise le canal standard de résultat et de récompense.
- Les commandes et bonus crossover ordinaires sont désactivés; pause,
  mort du protagoniste et perte de contrôle invalident la scène.

## Sources et distinction entre film et adaptation

1. [20th Century Studios — Predator (1987)](https://www.20thcenturystudios.com/movies/predator) :
   identité de Dutch, jungle, camouflage et chasseur.
2. [D23 — rétrospective Predator](https://d23.com/20th-century-fox-spooktacular-1980s-predator/) :
   boue froide contre vision infrarouge, préparation de pièges et duel final.
3. [Synopsis détaillé du film](https://en.wikipedia.org/wiki/Predator_(film)) :
   duel, perte de camouflage, contrepoids en rondins et autodestruction.
   Source secondaire, non une attestation de placement spatial exact.

La grille 9×7, les coordonnées, les neuf interactions, les zones de danger,
les dégâts et les huit fins de tour sont **des adaptations explicites**.
Ils ne prétendent pas reconstituer à l'image près le montage de John McTiernan.
Les éléments de *Predator 2*, *Prey* et des autres films ne sont pas introduits
dans cette scène de 1987. Le Hunter est représenté avec la signature visuelle
déjà utilisée pour son héros d'origine, sans nouvelle image approuvée.

## État des visuels et contenus encore ouverts

- **Sprite Dutch final 1987** : la fiche précise désormais la bonne incarnation,
  la tenue de jungle boueuse, les accessoires et les sources. Les PNG existants
  n'ont pas été comparés image par image : statut `pending`.
- **Jungle Hunter** : le moteur réutilise son image de personnage existante
  et n'affirme pas disposer de nouvelles animations spécialisées (camouflage,
  perte de biomask, blessures, activation du dispositif au poignet).
- **Niveau** : décor Canvas schématique (canopée, rivière, bûche, brasier),
  non scène reproduite en 1:1. Les sprites décor séparés et animations spécifiques
  sont à produire.
- **Capture de gameplay** : revue manuelle visuelle nécessaire dans le hub,
  la grille, à différentes résolutions et aux frontières du minuteur.
- **Sons/effets de source** : aucun audio extrait du film. Les effets génériques
  existants restent utilisés; une création originale est à prévoir.

Cette livraison **n'ajoute aucun PNG** et n'accorde **aucune certification 1:1**.

## Tests

`node --test scripts/reauditSourceScenes.test.mjs`

Le test existant exécute le vrai `EngineTactics`, la navigation, l'IA,
les phases de tour, le calcul de dégâts, l'annulation à la pause, les objectifs,
les contraintes de protagoniste, les résultats et la sérialisation du résumé.
Les quatre nouveaux tests vérifient les contraintes de source, la boue, la
perte de protection, l'échec par explosion et la victoire par fuite.

`npm run test:reaudit` puis `npm run build` (incluant tous les contrôles de
prébuild) sont les étapes CI attendues. Seules les suites **effectivement
exécutées et réussies** peuvent être déclarées validées.

## Compatibilité

Les trois scènes antérieures restent inchangées. Le compteur de leurs tests
de présence passe de 3 à 4; les 39 missions statiques historiques sont conservées.
Le mode Smash, le RPG, les menus, les portraits et la progression générale
n'ont pas été retirés ou remplacés.
