# Médaillon aztèque — face visible, film de 2003

Une icône d’objet a été générée réellement avec `image_gen`, à partir de la photographie du médaillon conservé par les Walt Disney Archives et publiée par D23. La photo, son reçu HTTP 200, le prompt exact, le PNG natif, le normaliseur, les empreintes et la revue indépendante sont conservés dans ce dossier. La source identifie explicitement les **882 pièces** du coffre maudit de *The Curse of the Black Pearl* (2003).

Le fichier de jeu est `DLC/PiratesOfTheCaribbean/assets/sprites/source-scenes/curse-of-the-black-pearl-2003/aztec-medallion-front-20261113.png` : RGBA 256 × 256, une seule image, 88 779 octets, marges visibles de 30/8/31/8 pixels. URL de publication prévue : `/sprites/source-scenes/curse-of-the-black-pearl-2003/aztec-medallion-front-20261113.png`.

La silhouette, le crâne central, la bélière et les reliefs concentriques suivent la référence. La revue recommande **64 pixels CSS** pour lire le crâne ; à 48 pixels, conserver un nom ou une description en texte natif. Les petits motifs, les proportions fines et quelques bords rouge-orangé restent approximatifs. Il s’agit d’une adaptation d’icône de face ; aucune fidélité 1:1 complète, animation, face arrière ou clôture du P0 de Jack Sparrow n’est déclarée.

## Raccord du panneau

L’icône accompagne le statut du rituel existant dans `PiratesCursePanel`, seulement pour la rencontre RPG canonique gardée par `isCanonPiratesCurseStage` : scène 269, Isla de Muerta, film de 2003. `GameCanvas` transmet la scène au panneau ; une identité absente, une autre édition ou un combat personnalisé exclut cette illustration. Le nombre total doit être exactement 882. Le nom de l’objet, le nombre de pièces et les annonces restent du texte natif. L’image décorative porte `alt=""` et `aria-hidden="true"` pour éviter une annonce répétée.

Le raccord ne change ni les 882 pièces, ni les 880 déjà rendues, ni les deux dernières pièces, ni les obligations de Will et Jack, ni les disponibilités des commandes, ni la chronologie du tir. La pièce reste illustrée pendant le rituel et après sa résolution ; l’image ne représente aucune transformation ou attaque. Une erreur de chargement masque l’image et libère sa colonne, tout en préservant le compteur et les commandes.

La publication locale est un fichier régulier lié au PNG canonique du DLC. L’entrée de production figure dans `DLC/PiratesOfTheCaribbean/assets.json`, calculée avec le générateur d’inventaire existant et limitée à ce manifeste. La constante d’URL est exportée par le module runtime du DLC déjà déclaré ; le panneau l’importe sans créer une fausse attribution d’asset commun au Nexus. Après staging des deux nouveaux PNG, l’agent principal a régénéré les ignores de publication et les inventaires globaux avec le pipeline existant. Les **85 tests purs** de manifestes, publication, chemins et exports passent ; `buildDlcAssetManifests --check` confirme les inventaires stables. Les 508 fichiers d’entrée contrôlés sont identiques avant et après cette vérification ; les preuves sont dans `../../validation/dlc-publication-final.json`.

## Vérification

Reproduction du conditionnement :

```sh
python docs/assets/p0-p1-menu-continuation-2026-11-13/art/aztec-medallion/normalize_icon.py
```

L’opération est déterministe : seuil de bruit alpha, recadrage sur les bornes visibles, redimensionnement uniforme par plus proche voisin, centrage transparent et création de l’aperçu. Elle ne repeint aucun détail. Les tailles 24/32/48/64/96 ont été inspectées dans `game-scale-preview.png`. La revue de `/root/menu_scout_next` est consignée dans `independent-visual-review.json`.

Le raccord réel du composant et du publisher est vérifié par **25 tests réussis** : les 21 tests des panneaux de sauvetage/rituel existants et les 4 contrats ciblés de `scripts/piratesCurseMedallion.test.mjs`. Le CSS dédié est parsé sans avertissement. La seconde revue visuelle de `/root` confirme la lecture à 64 pixels avec libellé et maintient les limites de fidélité. `runtime-validation.json` détaille ces résultats. Cette validation SSR et de publication ne prétend pas être une exécution du duel complet dans le navigateur.

La disponibilité publique de la photographie n’est pas une autorisation indépendante de redistribution. L’attribution D23/Walt Disney Archives et les limites de droits sont enregistrées dans `prop-manifest.json`.

Le refus historique concernant la génération du personnage Jack Sparrow reste respecté. Cette tentative ne contient aucun personnage et ne régénère pas les CG de boussole ou de décor déjà livrées.
