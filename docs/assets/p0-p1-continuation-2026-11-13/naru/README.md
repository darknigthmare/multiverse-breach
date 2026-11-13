# Naru — portrait du personnage de Prey (2022)

Une demande réelle de génération a produit un portrait transparent de Naru, dans son apparence à longue chevelure noire et bande de peinture noire autour des yeux. Les deux photographies officielles ont été ouvertes individuellement avant la demande : le photogramme 01 établit le visage, les cheveux et la peinture ; le 06 complète les seules épaules visibles de la tunique.

Le [manifeste](portrait-manifest.json) conserve les références, le prompt exact, le natif, les empreintes et les limites de revue. Le [PNG canonique du DLC](../../../../DLC/Prey/assets/sprites/source-scenes/prey-2022/naru-portrait-20261113.png) est une image RGBA 256×256 à un seul état. Son chemin public est publié par le DLC ; dans ce checkout, il s’agit d’un lien physique régulier contenant les mêmes octets. Les [aperçus](game-scale-preview.png) ont été inspectés à 40, 80 et 112 pixels. Le contrôle technique de taille et d’alpha est conservé dans [technical-qa.json](technical-qa.json).

Le helper `src/game/sourceScenePreyPortraitAssets.js` sélectionne le portrait uniquement pour `naru_prey` dans la scène Tactics `50106`, avec son univers et son incarnation exacts. Il dessine un rectangle HUD explicite ; il ne remplace pas le corps du personnage, une animation de combat ou l’autre identité `naru` du catalogue Predator.

Pour reproduire le conditionnement, le script partagé avec le portrait de Sarii retire le bruit d’alpha inférieur ou égal à 12, recadre les limites visibles, réduit uniformément en nearest et centre dans 256×256 :

```sh
python3 docs/assets/p0-p1-continuation-2026-11-13/sarii/normalize_portrait.py --source docs/assets/p0-p1-continuation-2026-11-13/naru/native.png --output DLC/Prey/assets/sprites/source-scenes/prey-2022/naru-portrait-20261113.png
```

La partie corps entier et animations du P0 `prey-2022-01` reste ouverte. Aucun nouveau pas de marche, lancer, rappel de hache, tir ou tenue complète n’est livré par ce portrait. La fidélité absolue 1:1 n’est pas certifiée. La recette navigateur du branchement HUD doit être conservée séparément des contrôles de fichiers.
