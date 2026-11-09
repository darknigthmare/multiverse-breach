# W17 — lot C, 40 unités de personnages

Le lot conserve 42 identités examinées dans les définitions et les kits, avec 40 identités effectives pour les dessins. Les refus réels de Mai et Judy restent archivés sans nouvelle tentative ; les annexes globales 2 et 3 fixent leurs remplaçants indépendants Shep et Stella avant génération.

La sélection livre 1 920 dessins entiers distincts : 32 poses natives et 16 poses de base pour chacune des 40 unités (12 duos et 28 solos), réparties dans 80 PNG de production. Un dessin humain/partenaire compte une fois. Les 64 appels réels comprennent 62 sources PNG retournées et deux refus. Les 2 210 unités source complètes observées se répartissent en 1 920 unités retenues et 290 exclues. Les sources de correction retenues comprennent 44 dessins de calibration exclus ; les quatre sources entièrement rejetées restent traçables séparément. Les cellules incomplètes ne sont jamais comptées comme des dessins complets.

Les humains Digimon et les duellistes concernés commandent leur partenaire visible. Les émissions offensives viennent du partenaire, du bâton du Magicien Sombre ou du dispositif tenu par Korvo. Les chanteurs, le chat scellé et les autres profils de soutien restent sans dégâts inventés. Okarun utilise son propre corps transformé, avec la limite de deux efforts « All Out ». Gatomon reste au niveau Champion. Les costumes de Jiji et d’Aira ont été corrigés après consultation des visuels officiels archivés ; tous les anciens dessins concernés sont exclus.

Le packing importe les pixels RGBA des sources archivées, avec une échelle commune par source et une calibration debout cohérente entre les sources d’une même unité. Pour un duo, la hauteur mesurée est l’union humain/partenaire complète ; ses proportions internes sont conservées. Les régions courbes ou rectangulaires passent par des intervalles contrôlés et conservent les corps entiers. Aucun ancien fichier W16 n’est modifié. Les poses ne sont ni miroitées, ni clonées, ni complétées avec des calibrations.

Le groupe des trois poissons de Joe appartient intégralement à sa troisième pose SUPER. Sa frontière source mesurée est après x1446 et avant le quatrième humain ; le gutter x1454 conserve les trois poissons ensemble. La quatrième pose reste une récupération sans poisson. Le projectile réutilise une région stricte du PNG natif final : aucune image de production supplémentaire et aucun dessin supplémentaire ne sont comptés. L’annotation source documente la vraie marge de quatre colonnes transparentes, inférieure à la marge demandée. La région du PNG final et ses ancres sont contrôlées indépendamment dans `native-muzzle-review*` et `nativeSuperAnchorsWave17PartC.generated.json`.

La fidélité intégrale 1:1 n’est pas certifiée : les champs `source1to1Verified` et `canonicalVerified` restent faux. Il s’agit de dessins générés adaptés, avec des timings et des valeurs de jeu adaptés. Les références historiques ne constituent pas des preuves officielles. Le portrait officiel de Stella et le visuel secondaire de Shep ne prouvent pas tous les détails de leurs costumes complets ; ces limites sont conservées dans les plans et les reçus.

Reproduction et contrôles :

```sh
node scripts/buildCombatCharacterAnimationsWave17PartC.mjs
node scripts/buildCombatCharacterSpriteCorrectionsWave17PartC.mjs
node scripts/buildCombatCharacterAnimationsWave17PartC.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave17PartC.mjs --check
```

Les contrôles vérifient les empreintes des sources et références, les arguments réels des appels, les plans antérieurs à la génération, les frontières d’import, les silhouettes entières, les marges transparentes finales et les 48 empreintes de poses distinctes par unité à travers les deux registres. Les preuves détaillées sont dans `generation-records.json`, `native-provenance.json`, `base-provenance.json`, `requests/` et `sources/*-visual-review.json`.
