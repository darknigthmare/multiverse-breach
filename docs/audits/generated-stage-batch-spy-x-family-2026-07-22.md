# Pack de stages OpenAI - Spy x Family - 2026-07-22

## Perimetre

- Univers runtime : `Spy x Family`
- Slug : `spy-x-family`
- Reference visuelle primaire : [site officiel de l'anime SPY x FAMILY](https://spy-family.net/tvseries/)
- Direction : Eden Academy, Cecile Hall et Berlint retro-europeen, en pixel-art detaille original et sans reproduction d'une image officielle.
- Generation : outil OpenAI ImageGen integre.
- `combat.webp` existait avant cette passe et n'a pas ete modifie. SHA-256 controle : `e3a9e9c5dbb3684ac52309fb8ec46121729e31d93eaa9487c4275f57c5d56468`.

## Fichiers generes

| Fichier | Dimensions | Mode | Usage et controle visuel |
| --- | ---: | --- | --- |
| `melee.webp` | 1672x941 | RGB | Vue laterale large de l'academie, espace inferieur et air central degages, aucune plateforme de collision integree. |
| `melee-backdrop.webp` | 1672x941 | RGB | Panorama distinct d'Eden Academy et de Berlint, profondeur par couches, bas calme et sans premier plan bloquant. |
| `melee-platforms.webp` | 1254x1254 | RGBA | Huit plateformes laterales separees : pierre, bois, haies, fer forge et balcon. |
| `rpg.webp` | 1672x941 | RGB | Cour en perspective 2.5D peu plongeante, positions avant/arriere et gauche/centre/droite libres. |
| `tactics.webp` | 1448x1086 | RGB | Vraie vue frontale trois-quarts a 30-35 degres, plateau complet de 8 colonnes par 6 lignes et quatre couvertures en bordure. |
| `tactics-tiles.webp` | 1254x1254 | RGBA | Seize modules tactiques separes en atlas 4x4, avec perspective, echelle et eclairage coherents. |

## Contraintes de generation

Les six prompts ont impose les invariants suivants :

- environnement fan-made original inspire des references officielles ;
- architecture de prestige en pierre claire, toitures vert-de-gris, bois sombre, haies formelles et palette Berlint sobre ;
- pixel-art 32-bit net, sans rendu photorealiste ni flou pictural ;
- aucun personnage, silhouette, animal, vehicule, texte, blason lisible, logo, HUD, UI, watermark ou cadre ;
- cadrage specifique au gameplay pour chaque mode ;
- fond chroma `#FF00FF` strictement plat pour les deux atlas.

## Post-traitement

1. Les quatre decors RGB ont ete livres directement aux dimensions demandees ; aucun redimensionnement n'a ete necessaire.
2. Les deux atlas ont ete detoures avec `remove_chroma_key.py`, en echantillonnage automatique de bord, soft matte, seuil transparent 12, seuil opaque 220 et despill.
3. Les pixels totalement transparents ont ete normalises a RGB `0,0,0` avant encodage WebP lossless afin d'eviter tout cache chromatique magenta.
4. Tous les fichiers ont ete reouverts apres encodage pour valider leurs dimensions et leur mode couleur reels.

## QA structurelle

### `melee-platforms.webp`

- pixels transparents : `1 089 160`
- pixels partiellement transparents : `34 304`
- pixels opaques : `449 052`
- coins transparents : `4/4`
- pixels magenta visibles : `0`
- pixels RGB non nuls sous alpha 0 : `0`
- composants significatifs separes : `8`
- cellules non vides : `8/8`
- couverture minimale d'une cellule : `42 087` pixels visibles

### `tactics-tiles.webp`

- pixels transparents : `1 087 120`
- pixels partiellement transparents : `27 348`
- pixels opaques : `458 048`
- coins transparents : `4/4`
- pixels magenta visibles : `0`
- pixels RGB non nuls sous alpha 0 : `0`
- composants significatifs separes : `16`
- cellules non vides : `16/16`
- couverture minimale d'une cellule : `21 434` pixels visibles

## QA visuelle

- `melee.webp` : zone de jeu large, lisible et sans geometrie flottante parasite.
- `melee-backdrop.webp` : profondeur distincte du decor melee principal et absence de sol de collision au premier plan.
- `melee-platforms.webp` : huit silhouettes completes, horizontales, espacees et sans frange magenta visible.
- `rpg.webp` : angle lateral 2.5D coherent avec les placements du moteur, sans vue du dessus.
- `tactics.webp` : grille 8x6 effectivement comptable, quatre coins visibles, rangees proches plus grandes que les rangees lointaines.
- `tactics-tiles.webp` : seize modules complets et separes, sans chevauchement ni contamination chroma visible.

## Integrite du depot

Cette passe ne modifie aucun manifest, fichier de code, profil musical ou autre univers. Elle ajoute uniquement les six sorties demandees et ce rapport, tout en conservant le `combat.webp` existant.
