# Masque osseux de Feral — icône de face extérieure

Une génération et deux éditions réelles ont produit une petite icône transparente du panneau extérieur du masque de Feral dans *Prey* (2022). Les deux essais précédents restent conservés hors sélection : le premier était trop large et symétrique ; le deuxième gardait un long bec ornemental et des chevrons non étayés par les photographies. La dernière édition supprime ce défaut.

Le [reçu des trois appels](generation-attempts.json) conserve leurs prompts exacts, les entrées, natifs, empreintes et décisions. Les photogrammes officiels 04 et 12 ont été ouverts individuellement. La [contrelecture](independent-visual-review.json), consignée à partir des messages du relecteur, autorise seulement l’usage comme petite icône extérieure après les contrôles techniques. Les fissures et le bord inférieur exacts restent approximatifs ; aucune vue arrière, profondeur, attache, visée laser ou géométrie de lanceur n’est qualifiée.

Le [PNG canonique du DLC](../../../../DLC/Prey/assets/sprites/source-scenes/prey-2022/feral-bone-mask-front-20261113.png) est une image RGBA 256×256 à un seul état. Le chemin public est publié par le DLC ; dans ce checkout, il s’agit d’un lien physique régulier de mêmes octets. Le [manifeste](prop-manifest.json), le [contrôle technique](technical-qa.json) et l’[aperçu à 24, 32, 64 et 128 pixels](game-scale-preview.png) précisent cette livraison.

Le helper `src/game/sourceScenePreyPropAssets.js` restreint l’icône à Naru dans la scène Tactics 50106. Les rôles sont exclusifs : badge transporté après `take_mask`, puis masque monté après `set_mask`. Il ne dessine aucun masque physique séparé au sol pendant que Feral le porte encore. Le badge transporté ne simule pas une prise en main ou une animation absente. Le ciblage et les projectiles restent des systèmes séparés.

Pour reproduire le conditionnement mécanique depuis le dernier natif :

```sh
python3 docs/assets/p0-p1-continuation-2026-11-13/sarii/normalize_portrait.py --source docs/assets/p0-p1-continuation-2026-11-13/bone-mask/edit2-native.png --output DLC/Prey/assets/sprites/source-scenes/prey-2022/feral-bone-mask-front-20261113.png
```

Le P0 `prey-2022-05` reste ouvert pour l’équipement complet : détails de visée, lanceur indépendant, projectile et impact. Cette icône ne fournit aucune de ces animations et ne certifie pas une fidélité absolue 1:1. La recette navigateur du branchement doit être conservée séparément.
