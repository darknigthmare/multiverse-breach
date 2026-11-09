# Cloud Meadow — personnages et références séparées

La PR rassemble les modèles des quatre planches fournies : **les quatre visuels initiaux** (Eve, Evan et les deux dragons), puis **33 nouveaux visuels** répartis entre une planche de 10 compagnons, une de 15 PNJ et une de 8 monstres. Chaque entrée possède son fichier individuel et la zone précise de sa propre référence. Les deux cobras restent deux modèles distincts : la femelle avec cristaux de la planche PNJ et le mâle sans cristaux de la planche monstres.

## Résultat et fidélité

Les images sont des **PNG transparents, avec une seule pose entière par modèle**. Les quatre premiers PNG de 1 254 × 1 254 pixels sont conservés sans modification. Les dimensions, empreintes SHA-256 et bornes visibles de tous les fichiers sont consignées dans `manifest.json` ; les tailles des nouvelles générations ne sont pas supposées identiques à celles du premier lot.

**La fidélité 1:1 est un objectif, pas un résultat certifié.** Les illustrations utilisent deux méthodes distinguées dans les données : une planche en entrée du générateur ou uniquement une description textuelle. Elles ne sont pas des exports du jeu. Les visages, contours, vêtements et proportions fines peuvent différer. Les désignations descriptives permettent de retrouver une figure de la planche sans lui attribuer un nom individuel non vérifié.

Les modèles guidés par image nécessitant une tenue plus couvrante sont marqués `adapted-coverage`. Leur note FR/EN précise la modification, et les deux galeries affichent un badge **« Tenue adaptée »**. Ces ajouts ne sont pas présentés comme des costumes officiels. Le dragon femelle du premier lot conserve son plastron d’écailles anthracite ajouté ; les réserves et prompts de cette adaptation restent documentés.

La troisième nouvelle planche a été refusée comme entrée par l’outil d’image. Ses **huit monstres sont donc de nouvelles illustrations d’après des descriptions neutres uniquement**, sans fournir cette image au générateur. Ils portent le statut séparé `description-based-adaptation`, la provenance `generated-from-reference-description`, le mode `text-description` et le badge **« D’après description »**. Des vêtements opaques sont ajoutés aux modèles qui en nécessitent. La planche d’origine reste accessible pour comparaison humaine ; elle n’est pas présentée comme une entrée de ces générations. Ces huit visuels ne doivent pas être décrits comme des extractions fidèles ou des reproductions 1:1.

Les PNG générés sont copiés tels quels : aucune recompression, recoloration, animation ou retouche de pixels n’est déclarée. Le recadrage des marges transparentes dans la vue d’échelle est une opération d’affichage ; il ne modifie pas les fichiers.

## Accès aux modèles

- **Dans le jeu : Hub → Collection → Références Cloud Meadow.** Recherche par nom, filtre par planche, sélection individuelle, description FR/EN, note de fidélité et source du personnage affiché.
- **Revue détaillée : `/reviews/cloud-meadow/index.html`.** Comparaison côte à côte entre la zone source et le PNG, fonds sombre, clair ou damier, lien direct vers chaque image et ouverture de la planche complète.
- Les liens détaillés incluent l’identifiant du personnage dans le fragment d’URL, par exemple `#cloud_meadow_eve`.

La vue **« Échelle mesurée »** ne porte que sur la première planche : Eve 1, Evan 1,04, dragon femelle 1,8 et dragon mâle 1,9. Ce sont des rapports approximatifs mesurés dans cette image, pas des tailles officielles. **Aucune taille relative n’est extrapolée entre des planches différentes.** Les nouveaux modèles n’y sont donc pas mélangés aux anciens.

## Références conservées

| Planche | Chemin public | Dimensions d’origine | Modèles |
|---|---|---|---:|
| Eve, Evan et les dragons | `reviews/cloud-meadow/reference.png` | 889 × 1 204 | 4 |
| Compagnons | `reviews/cloud-meadow/sources/companions-2026-10-29.png` | 1 280 × 1 291 | 10 |
| PNJ | `reviews/cloud-meadow/sources/npcs-2026-10-29.png` | 1 280 × 707 | 15 |
| Monstres | `reviews/cloud-meadow/sources/monsters-2026-10-29.png` | 1 280 × 362 | 8 |

La capture initiale possède l’empreinte SHA-256 `0bc345c8c5499e59b14adb965184d9211e264feaba24f15288be7182210ca595`. Les empreintes de toutes les sources sont calculées directement depuis les fichiers dans le catalogue de revue et le manifeste. Les fichiers joints remplacent les trois liens temporaires qui renvoyaient HTTP 403.

La [présentation officielle de Team Nimbus](https://www.patreon.com/CloudMeadow/about), consultée le 28 octobre 2026, confirme les noms des protagonistes **Evan et Eve**. Les autres étiquettes et réserves d’identification suivent les modèles visibles dans les images fournies.

La [réponse sélectionnée par la modération du forum Steam](https://steamcommunity.com/app/1223750/discussions/0/4361250264578954844/), consultée via son extrait indexé le 29 octobre 2026 lors de l’identification, liste les dix noms des compagnons : Fio, Yonten, Camellia, Kiram, Kaleida, Garst, Jaero, Kreyton, Goldra et Brontide. Cette liste étaye les noms du roster ; l’association avec les silhouettes est une identification visuelle distincte, pas une certification officielle des images recréées.

## Intégration et périmètre

`src/game/cloudMeadowCharacters.js` conserve les quatre entrées originales et assemble les ajouts de `src/game/cloudMeadowAdditionalCharacters.js`. Les références, recadrages, descriptions, signatures visuelles, noms des fichiers et statuts de fidélité sont associés à chaque entrée.

La résolution des sprites exige l’identifiant exact et l’univers `Cloud Meadow`. La disposition explicite est **1 × 1** ; tous les états utilisent la pose unique. Les portraits affichent l’image entière en conservant son rapport largeur/hauteur, y compris les queues et cornes.

Ce lot reste un **catalogue de modèles visuels consultables**. Aucune entrée de combat n’est ajoutée à `HEROES_DB`, et aucune nouvelle statistique, technique, récompense, condition de déblocage ou campagne n’est inventée. Aucune animation de déplacement ou de combat du jeu source n’est revendiquée.

## Provenance et contrôle

`prompts.json` conserve les consignes de production et les écarts déclarés. `manifest.json` et `public/reviews/cloud-meadow/catalog.json` contiennent les données reproduites depuis le registre : sources, recadrages, statuts, dimensions, empreintes et bornes des silhouettes.

```sh
npm run cloud-meadow:review  # Reconstruit catalogue et manifeste depuis les données et fichiers
npm run cloud-meadow:check   # Vérifie les images, associations, recadrages et synchronisation
npm run test:cloud-meadow   # Tests du registre, routage, rendu, galerie et audit des fichiers
```

Le contrôle vérifie l’unicité des identifiants et chemins, le lien entre chaque personnage et sa source, la validité du recadrage, l’absence de comparaison de taille entre sources, ainsi que la transparence réelle de chaque PNG. Un seuil alpha > 16 ignore les pixels presque transparents isolés ; aucun pixel visible ne doit toucher le bord du canevas. Ce contrôle détecte un risque de rognage, sans certifier à lui seul la ressemblance artistique.

Les tests de rendu utilisent volontairement une image très large pour détecter les étirements et recadrages involontaires. Le contrôle des sources emploie les dimensions réelles des pièces jointes. La recherche, les sélections FR/EN et la conservation du rendu des anciens portraits sont également vérifiées.

`test:cloud-meadow` reste intégré au début du `prebuild` existant. Aucun contrôle global n’est retiré ou affaibli. Le lot initial a passé les sept workflows GitHub, y compris le build de production complet ; les ajouts doivent passer les mêmes contrôles sur leur propre commit.
