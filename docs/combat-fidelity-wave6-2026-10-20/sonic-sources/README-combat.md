# Sonic Adventure : combat et rebords

Ce lot contient 21 états de combat et de traversée, soit 84 poses natives sélectionnées dans trois atlas RGBA de 1024 × 2048 pixels. Chaque état utilise quatre dessins anatomiques distincts ; les trois dernières rangées de `sonic-ledge.png` sont transparentes et ne sont pas comptées. Les rangées finales ont été inspectées visuellement après normalisation. La tenue reprend la référence locale Adventure : Sonic bleu, yeux verts, gants blancs, chaussures rouges à bande blanche et boucle dorée. Ce sont des adaptations graphiques du projet, sans certification officielle de fidélité 1:1.

Les capacités effectives ont été résolues avant les prompts : Spin Attack pour les coups simples et Homing Attack pour la secondaire. Les boules montrent le corps réellement replié de Sonic. Le Light Speed Attack à 100 % appartient à la planche de présentation séparée. Les trois sources sélectionnées utilisent chacune une seule échelle technique, calibrée sur une stature debout comparable de 190 pixels. Aucun ajustement par rangée ne gonfle les boules ou les accroupissements ; `compact-body-proportions.json` conserve les mesures natives et finales.

Trois générations initiales et un correctif natif ont été réalisés. Le correctif remplace les vingt poses de rebord initiales, qui comportaient des fragments gris ressemblant à des supports peints ; cette première source est archivée et exclue des 84 poses. La source de combat B a été fournie par l’outil comme URL de données PNG, sans chemin local : ses octets ont été copiés sans transformation et son SHA est conservé. Les prompts, les quatre sources, la référence inspectée et la résolution des capacités sont archivés dans `source-archive-manifest.json`. Les identifiants de génération et le modèle restent `null`, car l’outil ne les a pas fournis.

Les douze paumes et les douze poignets de Catch/Hang/Climb ont été mesurés dans les pixels normalisés. Les 24 ROI de 9 × 9 pixels vérifient une présence alpha de 81/81 pixels ; leurs PNG et SHA RGBA sont conservés dans `grip-pixel-checks.json`. Catch0 est explicitement précontact. Les poses libérées de Drop/Jump portent une référence de rebord sans contact. Ces coordonnées sont des ancres de rendu du projet, pas des mesures issues du jeu officiel. Sharp sert uniquement à segmenter, extraire, redimensionner à échelle commune et assembler les dessins natifs.

Vérifications reproductibles depuis la racine du dépôt :

```sh
node docs/combat-fidelity-wave6-2026-10-20/sonic-sources/build-sonic-combat.mjs --check
node docs/combat-fidelity-wave6-2026-10-20/sonic-sources/verify-sonic-combat.mjs
```
