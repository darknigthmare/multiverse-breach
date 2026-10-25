# Lot 14 — groupe B

Les vingt identités ont chacune une nouvelle planche native de 32 poses et une base de 16 poses : **40 PNG, 960 cellules RGBA distinctes**. Les 23 sources `image_gen`, prompts, requêtes et reçus sont archivés dans `sources/`. Les 20 références historiques conservent exactement leur SHA-256 du plan immuable. Aucune adaptation n’est certifiée 1:1.

Les sources initiales de Kassandra, Jensen et Mordin ont été exclues : lance entière au lieu du court fragment de Léonidas, appendices augmentés inventés au lieu d’un effet Typhoon radial, effets thermiques trop larges. Des corrections `image_gen` fournissent les 48 dessins retenus de chaque identité. Sur 1104 dessins observés, 144 sont exclus et ne comptent jamais comme livraison. Aucun refus ni identité manquante n’est déclaré.

La segmentation conserve les pixels RGBA natifs et leurs fragments, sans peinture, miroir, seuil d’effacement ou duplication. Une calibration commune par source garde les proportions des postures et les 120 pixels de stature du Gek adulte Polo. Les cellules finales mesurent 256×256 avec dix pixels transparents sur les quatre bords. Les tirs natifs de Kelly, Kait, du Voyageur et l’attaque ordinaire de Boone sont réordonnés pour placer le dessin d’émission au troisième temps, sans nouvelle pose synthétique.

Les 96 points de `native-muzzle-review.json` sont mesurés sur les cellules finales de deux phases et quatre colonnes : dix armes physiques (80 points), l’omni-outil au poignet de Mordin et l’émetteur du multi-outil du Voyageur (16 points distincts). Chaque mesure conserve la source, sa ligne et sa colonne, son échelle, le cadrage de cellule et le `rowRenderScale`. Les croix jaunes sont des surimpressions de revue, jamais des sprites publiés.

Les deux reconstructions sans écriture et le contrôle de livraison passent :

```bash
node scripts/buildCombatCharacterAnimationsWave14PartB.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave14PartB.mjs --check
node docs/combat-fidelity-wave14-2026-10-25/part-b/verify-delivery.mjs
```

`delivery-check.json` contient les résultats reproductibles. Les preuves navigateur de rendu et de déplacement des projectiles restent distinctes de ces contrôles de fichiers.
