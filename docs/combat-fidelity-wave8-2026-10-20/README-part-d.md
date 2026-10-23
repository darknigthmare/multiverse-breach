# Vague 8 — Dungeon Meshi, lot D

Ce lot adapte les cinq personnages dans leur apparence habituelle de l'anime de 2024. Les capacités ont été lues dans `batch-plan-before.json` avant les générations. Les bases utilisent les rangées `idle`, `run`, `attack`, `hit` ; leur action de base suit réellement l'effet résolu, y compris lorsqu'il s'agit d'un soutien. Les huit présentations sont `intro`, `outro`, `roundVictory`, `roundDefeat`, `fatality`, `victory`, `defeat`, `super`. La phase interne `fatality` désigne ici une finale adaptée sans exécution.

Livraison artistique figée : **10 PNG et 240 poses utilisées**, soit cinq planches de présentation de 32 poses et cinq bases de 16 poses. Onze appels natifs ont produit 244 dessins : quatre poses d'une ancienne finale de Falin sont conservées dans l'archive mais remplacées dans le jeu. Son halo traversait la couture sur 49 pixels visibles ; un vrai correctif natif de quatre poses remplace cette seule rangée avec une lumière locale aux paumes. Aucun pixel d'anatomie n'a été synthétisé pour cette correction.

| Personnage | Action de base | Secondaire / super | Taille corporelle de calibration |
| --- | --- | --- | --- |
| Laios | Taille physique de Kensuke | Analyse du monstre en soutien / Coupe de Kensuke | 190 px |
| Marcille | Préparation d'incantation, buff allié | Explosion magique | 165 px |
| Senshi | Coup de hache | Repas servi au groupe, soin adapté de la cuisine | 145 px |
| Chilchuck | Inspection de serrure, buff allié | Désamorçage et passage sécurisé, garde alliée | 115 px |
| Falin humaine | Évaluation attentive d'un compagnon, buff allié | Magie de soin | 175 px |

Ces tailles sont des proportions de jeu documentées, validées pour ce lot ; elles ne certifient aucune mesure physique canonique. Une seule échelle corporelle mesurée s'applique à toute une source native. Les poses accroupies, assises ou agenouillées conservent donc leur projection plus courte. Les objets et effets peuvent imposer une taille de packing inférieure ; un facteur de rendu uniforme restitue alors la cible corporelle sans modifier le PNG ni gonfler une posture isolée. Les cellules finales mesurent 256 × 256, avec une ligne de sol technique à 244 et une marge transparente d'au moins 10 px.

Les anciennes références ont été inspectées et copiées avant travail. Deux ont été explicitement rejetées comme entrées de génération : Chilchuck y portait un pistolet inventé, et Falin ressemblait à une Marcille aux cheveux longs et oreilles d'elfe avec un tir au bâton. Les nouveaux dessins remplacent ces défauts par un serrurier half-foot adulte de 29 ans et une soigneuse humaine aux cheveux courts, robe blanche et cape verte. Les bases nouvelles prennent les nouvelles planches de présentation comme références d'apparence. Les anciens PNG restent intacts.

Les corps, gestes et corrections sont dessinés par `image_gen`. Sharp réalise seulement la segmentation alpha, la calibration uniforme, les marges et le packing. Les prompts exacts, véritables arguments d'appel, chemins natifs, références, sources retenues ou remplacées et SHA sont archivés dans les fichiers `part-d-*` et `base-part-d-*`. Les identifiants de modèle/job/génération non fournis restent `null`. L'accès tenté au site anime a été refusé par le proxy et est consigné dans `part-d-source-access.json` ; aucune page refusée n'est présentée comme consultée. Les chorégraphies, lumières et durées restent des adaptations : `source1to1Verified`, `canonicalVerified` et `networkVerified` sont faux.

Les builders propres au lot sont `scripts/buildCombatCharacterAnimationsWave8PartD.mjs` et `scripts/buildCombatCharacterSpriteCorrectionsWave8PartD.mjs`. Leur option `--check` resegmente les sources archivées, reconstruit les PNG et compare les octets, métadonnées, marges et empreintes de chaque cellule avec les registres déclarés.

Les deux options `--check` passent, ainsi que le lint des builders. Les 240 dessins finaux ont été revus sur leurs planches de contact après la revue des sources natives. Les dix PNG sont RGBA, les 240 cellules ont leurs quatre dessins distincts par rangée et une marge finale entièrement transparente de dix pixels ; aucune couture de rangée retenue ne traverse de pixel visible au seuil alpha24. Quelques franges source très faibles (alpha5–24) touchent les bords de quatre sources ; aucun corps, équipement ou effet visible au seuil alpha24 n'est coupé au bord. La vérification de distribution en production et les parcours runtime sont des contrôles séparés, pas une conséquence implicite de cette validation artistique.
