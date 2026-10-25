# Lot 13 — groupe B : ressources livrées et limites

Sur les vingt personnages sélectionnés, quinze ont une nouvelle planche de présentation de 32 poses et une base de 16 poses : **30 PNG, 720 cellules RGBA distinctes**. Les versions, prompts et résultats d’image sont conservés dans [sources](sources/). Ces adaptations générées ne certifient aucune fidélité officielle 1:1.

Les contrôles reproductibles sont liés dans [delivery-check.json](delivery-check.json). Ils vérifient les empreintes de production et de source, les vingt références historiques préservées, ainsi que 64 points de canon mesurés pour les huit tireurs. Les 22 images sources contiennent 895 dessins observés ; 175 dessins exclus ne comptent pas comme poses livrées.

Les reprises techniques concernent notamment les attaques de Gray Fox, le barillet du revolver de Joel, le cadrage de Hayden et les tirs de Big Boss. Douze poses de Big Boss ont été redessinées pour placer le flash au bout du silencieux ; les points de départ sont mesurés sur les nouvelles cellules. Les sources remplacées et les raisons de correction restent archivées.

Vader, Obi-Wan, Yoda et Darth Maul ont reçu un refus initial. Les deux sources d’Ahsoka reçues ont échoué à la revue technique : des traînées fusionnaient des silhouettes. Ses corrections séparées de 32 et 16 poses ont ensuite été refusées. Les [reçus et images rejetées](request-failures.json) distinguent ces situations. Aucune nouvelle planche native ni base de ces cinq personnages n’est publiée ; leurs images historiques ne comptent pas comme nouveaux dessins.

Les deux commandes de reconstruction sans écriture sont requises par le cycle de build :

```bash
node scripts/buildCombatCharacterAnimationsWave13PartB.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave13PartB.mjs --check
```

Les résultats des parcours réels sont regroupés dans [les preuves navigateur du lot](../browser-checks.json), distinctes de ces contrôles de fichiers.
