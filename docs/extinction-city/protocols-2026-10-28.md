# Protocoles FPS Nexus et vitrines de Cité — 28 octobre 2026

Base master : `fed79e8fdbcc811616bd0ec6f3a73b9656b5d8b9` (PR 11 et 10 fusionnées).
Source publiée : `849ae4eea0b761df0b518a815132a458ecfca2c7`.

## Contenu réalisé

Sept identités explicitement adaptées : Ancre, Mirelle, Bastion, Nova, Marrow, Sable, Loom. Leurs quatre actions du catalogue sont raccordées au FPS (28 adaptations), avec F secondaire, C défense, X ultime, charge gagnée par impacts, portées et temps de recharge. Les autres personnages conservent le comportement existant ; aucune conversion silencieuse des non-combattants.

Projectiles mobiles de Mirelle, mine et roquette de Sable : collision balayée, impact différé, explosion, durée bornée, identité de session et pause. Les dégâts passent par la protection du champion ; les drones protecteurs ne sont plus contournés par une tourelle ou un ultime ramassé. La fin et l’abandon nettoient les effets. Le projectile Mirelle peut réutiliser son image existante, jamais celle d’un autre propriétaire.

Soins, gardes, dash et améliorations temporaires suivent leurs fonctions sources. La barricade et le drone de soin sont des effets temporaires, pas un nouveau compagnon autonome ou un modèle 3D. Les réglages sont des adaptations du jeu, pas des affirmations de fidélité canonique.

La Cité propose les 1 587 fiches de reliques par univers : recherche, pagination (trois vitrines à la fois), indication de possession et lecture seule. Rejoindre une vitrine utilise le déplacement natif et ouvre la fiche à l’arrivée. Pas de téléportation, achat, attribution ni déblocage. Les services ont des silhouettes fonctionnelles distinctes ; les props individuels restent à dessiner.

## Validation

[Run de source exact 40719252474](https://github.com/darknigthmare/multiverse-breach/actions/runs/40719252474) : 155/155 tests ciblés, 68/68 UI, 7/7 catalogue, lint de sept fichiers sans erreur, compilation Vite source. Les suites se recoupent.

Chromium sur serveur HTTP Vite : 14/14 nouveaux parcours (dix FPS, quatre approches Nexus) et 6/6 régressions. Possession/cibles préparées, horloge virtuelle. Les nouvelles actions emploient des entrées réelles ; aucune injection de dégâts, charge, lancement, victoire ou récompense. Localement, les mêmes nouveaux parcours passent avec un bundle en mémoire et stockage simulé, sans modification de politique de navigateur.

Preuves détaillées et limites : `protocols-2026-10-28.json`. Artefact de source : 12829277921, SHA-256 `26fc66d93686462ce8b7d90a5456b636241d3802efe0e2004d3724bc607e3cde`.

## Suivi des Excel

Le classeur production conserve 21 feuilles et 20 tableaux : 17 741 lignes de catalogue, 210 557 cellules comparées, plus trois compteurs de mécanique (7, 28, 1 587) distincts de la couverture artistique. Le classeur UI conserve 40 écrans et 39 lots, avec 170 vérifications dont les 156 précédentes inchangées.

Les cellules, formules et styles sont édités avec artifact_tool. Le transport Git reproduit les membres ZIP à l’identique et vérifie les empreintes ; il ne crée pas de cellules en CI. Le workflow permanent lit le reçu du 28 octobre, contrôle les deux fichiers et les compare au catalogue courant. Aucune régénération silencieuse des classeurs.

## Reste ouvert

Les autres kits FPS ; les animations personnelles, nouveaux ennemis/boss et décors propres aux univers ; l’équilibrage humain ; la recette complète des 40 écrans ; manette et téléphone physiques ; services et cloud réels ; le diagnostic Infestation intermittent. Aucun nouveau PNG n’est déclaré produit. Les trois raccordements de mains restent partiels. Les médias secondaires non présents dans le checkout CI restent non certifiés.

Le build complet et les checks de la tête finale ne se déduisent pas de la compilation source. Pas de merge dans master ni de promotion de production.
