# Sarii — portrait du compagnon, Prey (2022)

Une demande réelle de génération a produit un portrait transparent de Sarii : tête, oreilles, cou et haut du poitrail. La référence officielle du film a été ouverte avant la demande. Les pieds sont coupés dans cette référence et la queue reste cachée ; ces parties ne sont pas inventées dans ce portrait.

Le [manifeste](portrait-manifest.json) conserve le prompt exact, la source, le PNG natif, leurs empreintes, le conditionnement déterministe et les limites de revue. Le [portrait de jeu](../../../../DLC/Prey/assets/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png) est une image RGBA 256×256, avec un seul état. Les [aperçus à l’échelle du jeu](portrait-game-scale-preview.png) ont été inspectés à 40, 80 et 112 pixels. Le portrait doit servir à identifier le compagnon sur sa case existante ; il n’ajoute aucun combattant.

La normalisation retire le bruit d’alpha inférieur ou égal à 12, recadre les limites visibles, applique une réduction uniforme en nearest puis centre l’image dans 256×256. Aucun corps, détail de pelage ou accessoire n’est peint par le script. Pour reproduire le fichier depuis la racine du dépôt :

```sh
python3 docs/assets/p0-p1-continuation-2026-11-13/sarii/normalize_portrait.py --source docs/assets/p0-p1-continuation-2026-11-13/sarii/portrait-native.png --output DLC/Prey/assets/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png
```

Le P1 `prey-2022-09` reste ouvert pour le corps entier et ses six états attendus, dont la récupération de la hache reliée. Ce portrait ne vaut pas une planche de seize poses, une validation de ces mouvements ni une certification 1:1. Le producteur a inspecté les fichiers et les aperçus ; la recette navigateur du branchement doit être consignée séparément.

Le fichier source appartient au DLC Prey. Sa publication fournit la même URL de jeu, sans changer les octets du portrait.
