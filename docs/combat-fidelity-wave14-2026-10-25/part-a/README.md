# W14 — Partie A

Les vingt identités et versions du [plan immuable](../batch-plan-before.json) disposent de **32 poses de présentation et 16 poses de base chacune : 40 PNG et 960 dessins natifs retenus**. Les huit phases ont quatre positions distinctes ; la présentation finale reste une démonstration sans adversaire ni blessure. Gandalf le Gris et Solaire gardent une défense de soutien ; Jonah emploie sa radio, sans tir ni attaque inventée.

Les [35 appels image_gen](generation-inventory.json) conservent leurs arguments exacts, prompts, reçus, références et images originales. Les vingt sources initiales contiennent chacune 48 dessins en 8×6. Douze corrections de 48 dessins réparent les croisements d’armes, les marges et les effets locaux. Quatre poses supplémentaires corrigent le super d’Ardyn en véritable coupe d’épée ; deux sources supplémentaires de huit poses conservent l’arc physique de Legolas et d’Aloy pendant le relâchement. Sur **1 556 dessins générés, 960 sont retenus et 596 sont [explicitement exclus](source-exclusions.json)**. Aucun refus ni personnage manquant n’est déclaré. Aucun dessin exclu ne compte comme livraison.

Les [sélections effectives](generation-records.json) et leurs fichiers `sources/*-region-review.json` désignent chaque dessin utilisé une seule fois. Les frontières passent entre les silhouettes dans les espaces dont alpha est inférieur ou égal à 24. Ce seuil mesure les régions ; il ne remplace aucune valeur alpha. Chaque RGBA conservé est copié exactement avant un unique redimensionnement au plus proche voisin, avec ancre de pied et marges transparentes de dix pixels. Aucun corps, équipement ou effet n’est peint par code.

La [calibration de stature](stature-review.json) conserve les valeurs du plan : Gimli 150 ; les trois Space Marines 220 ; Kain, Vorador, Erend et Jonah 205 ; les douze autres 190. Une même échelle s’applique aux poses d’une source et une stature commune relie les sources d’un personnage. Le `renderScale` restaure la stature en jeu lorsque l’arme entière impose une réduction du pack ; les postures basses restent naturellement plus courtes. Les [faits de version](source-facts.json) reprennent sans réécriture les travaux, apparences, armes, effets et références du plan. Les vingt références historiques conservent exactement leur SHA initial ; le [contact](references-contact.png) permet la comparaison, notamment avec les anciennes incarnations incompatibles de Cor et Lara.

Les [40 points d’émission](native-muzzle-review.json) sont mesurés sur les véritables cellules finales de 256 pixels : cinq personnages, super et présentation finale, quatre colonnes. Chaque point conserve le PNG de cellule, son SHA, ses pixels RGBA, la source et le `rowRenderScale`. Les arcs sont mesurés au passage de la flèche au-dessus de la poignée ; les bolters à leur bouche physique, en excluant la pointe du flash. Le flash masque partiellement la bouche de Leandros sur super c2 : sa jonction canon/flash et son contour métallique inférieur visible sont documentés. Les grilles et croix de `anchor-review/` sont des preuves de mesure, jamais des sprites publiés.

Le [contrôle technique](verification.json) valide les 960 cellules RGBA distinctes, également distinctes après exclusion des pixels de faible alpha, les 960 dessins source sélectionnés sans réutilisation, les marges, les 40 points et la préservation exacte des **638 PNG et 111 registres historiques**. Les deux reconstructions sans écriture passent également. Le [gel des bases](base-freeze.json) conserve les 21 empreintes des vingt PNG et de leur registre.

```bash
node scripts/buildCombatCharacterAnimationsWave14PartA.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave14PartA.mjs --check
node docs/combat-fidelity-wave14-2026-10-25/part-a/verify-artwork.mjs --check
```

Les dessins sont des adaptations générées de versions documentées, pas des frames officielles ni une reproduction 1:1 certifiée. Les preuves navigateur finales et les tests de déplacement des projectiles sont produits séparément sur le gel commun W14.

Le [reçu technique final](final-technical-receipt.json) documente aussi le helper de contrôle sans import runtime `verify-artwork.mjs`, ajouté à **09:01:08.395463Z**, après le gel runtime de **09:01:06.683Z** du 25 octobre 2026. Son SHA-256 est `513e6c63f0c3806cdd7c222b7e4f2fb5231951eceae428285d82661dccba3ecc`. Le helper et ses contrôles en exécution puis `--check` sont immuables ; l’audit et le build finaux lient son empreinte comme preuve technique ajoutée après gel. Aucun fichier déjà gelé n’a changé.
