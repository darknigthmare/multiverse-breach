# Ragna : combat et rebords de la vague 7

Ce lot sélectionne **21 états et 84 poses natives** dans trois atlas RGBA de 1024 × 2048 pixels. Chaque état possède quatre dessins anatomiques distincts. Les douze cellules des trois dernières rangées de `ragna-ledge.png` sont transparentes et ne sont jamais comptées. Les 84 poses finales ont été inspectées après normalisation : tenue rouge de Ragna CSE, cheveux blancs, Blood-Scythe grise mécanique à poignée rouge, gants noirs et poignets argentés. L’épée est portée sur le dos dans les traversées pour libérer les mains. Ces traversées et ces poses sont des adaptations du projet, sans certification officielle de fidélité 1:1.

Le kit effectif a été résolu avant les prompts : **Taille de Blood-Scythe**, **Dead Spike** projectile pour la secondaire, puis **Carnage Scissors** au super. Les états `special` et `chargeRelease` montrent donc un geste de lancement de Dead Spike ; le projectile se déplace séparément dans le moteur. Au moment de ce contrôle, les métadonnées du kit citaient Centralfiction, tandis que la référence vestimentaire demandée était Continuum Shift Extend (2011). La trace d’origine est conservée dans `resolved-abilities-before-generation.json` ; ni le nom d’une technique ni ce nouvel art ne constitue une vérification d’animation officielle.

Une seule échelle de pixels et un seul facteur de rendu sont utilisés pour **toutes les poses issues d’une même source**, y compris lorsqu’une source corrective alimente deux atlas. La grande épée ne sert pas à mesurer le corps. Les facteurs sont exposés dans `states[state].renderScale` et `normalization.rows[row].renderScale` pour le manifeste unifié ; aucun ajustement de stature par pose ou par rangée n’est effectué.

| Source native | Calibration corporelle | Corps normalisé | Facteur de rendu | Corps effectif |
| --- | --- | --- | --- | --- |
| Combat A initial | chargeRecovery, c3 : 224 px | 190 px | 1 | 190 px |
| Combat B initial | intro, c0 : 216 px | 168,727 px | 1,1260775862 | 190 px |
| Correctif de six états | calibration exclue r6/c0 : 205 px | 160,135 px | 1,1865012616 | 190 px |
| Correctif aerialDown/intro | calibration exclue r2/c0 : 333 px | 190 px | 1 | 190 px |
| Rebord | ledgeHang, c0 : 252 px, tête y337 à semelle y588 | 190 px | 1 | 190 px |

Les ROI de calibration, les coordonnées source et les facteurs complets sont conservés dans chaque `statureCalibration`. La mesure de rebord exclut les bras levés et l’épée portée au dos. Les seize contrôles de `natural-projection-checks-combat.json` montrent que les silhouettes accroupies, chargées ou repliées gardent leur projection plus courte. Le contrôle utilise la silhouette entière, arme comprise, sans retirer une lame pour produire artificiellement une mesure plus petite.

**Trois générations initiales et deux correctifs natifs** ont été nécessaires. Le premier remplace six rangées dont des épées touchaient des bords ou des coutures ; le second remplace aerialDown/intro, après détection d’une double lame et d’une pointe attribuée à la pose voisine. Les cinq sources totalisent 124 dessins : 84 sélectionnés, 32 anciens dessins remplacés et huit dessins de calibration exclus. Tous les originaux, les prompts exacts, les images conditionnantes et leurs SHA sont archivés. `actual-tool-calls-combat.json` distingue les trois appels parallèles initiaux des deux correctifs. Les modèles et identifiants non fournis par l’outil restent `null`.

Les douze paumes et douze poignets Catch/Hang/Climb ont été mesurés dans les pixels des gants réels ; les 24 ROI de 9 × 9 ont chacune 81 pixels alpha visibles. Les paumes contiennent les gants noirs, les poignets leurs raccords noirs et argentés ; aucune pièce de l’épée ne sert de main. Catch0 est explicitement précontact. Les poses libérées de Drop/Jump portent une référence de rebord sans contact. `grip-pixel-checks-combat.json`, les 24 PNG et leurs SHA RGBA conservent les preuves. Ces ancres sont des mesures de projet, distinctes du contrôle de leur branchement physique effectué après intégration par le moteur.

```sh
node docs/combat-fidelity-wave7-2026-10-20/ragna-sources/build-ragna-combat.mjs --check
node docs/combat-fidelity-wave7-2026-10-20/ragna-sources/verify-ragna-combat.mjs
```
