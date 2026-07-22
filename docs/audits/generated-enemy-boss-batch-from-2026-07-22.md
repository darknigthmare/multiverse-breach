# Audit OpenAI ImageGen - Ennemis et boss From

Date : 2026-07-22

## Portee

Lot limite aux cinq sorties demandees. Aucune donnee de jeu, aucun manifest, aucun stage et aucune musique n'ont ete modifies.

Toutes les planches ont ete generees separement avec OpenAI ImageGen, puis normalisees localement en PNG RGBA. Chaque fichier utilise une grille stricte de 4 colonnes par 4 lignes, avec des cellules de 256 x 256 px : `idle`, `run`, `attack`, `hit`.

## Fichiers livres

- `public/sprites/generated/bosses/from/smiling-townwalker.png`
- `public/sprites/generated/bosses/from/faraway-tree-echo.png`
- `public/sprites/generated/bosses/from/cicada-nightmare.png`
- `public/sprites/generated/bosses/from/smiley-creature.png`
- `public/sprites/generated/bosses/from/music-box-ballerina.png`

## References visuelles et lore

- Serie et direction visuelle generale : [MGM+ - FROM](https://www.mgmplus.com/series/from)
- Apparence et comportement des creatures nocturnes : [From Wiki - Creatures](https://from.fandom.com/wiki/Creatures)
- Smiley, facade humaine, tenue d'epoque et transformation : [From Wiki - Smiley Creature](https://from.fandom.com/wiki/Smiley_Creature) et [reference visuelle Smiley](https://static.wikia.nocookie.net/from/images/a/a8/Smiley_pro.jpeg/revision/latest?cb=20231110165802)
- Arbre creux et transport spatial imprevisible : [From Wiki - Farway Trees](https://from.fandom.com/wiki/Farway_Trees) et [reference visuelle Faraway Tree](https://static.wikia.nocookie.net/from/images/4/4e/Farway_Tree.jpeg/revision/latest?cb=20230804191135)
- Ballerine, boite a musique, visions, vers et essaim de cigales : [From Wiki - Music Box Monster](https://from.fandom.com/wiki/Music_Box_Monster)
- Apparition plein pied de la ballerine : [SensaCine - photo FROM](https://www.sensacine.com/series/serie-28959/foto-detalle/?cmediafile=22008450) et [Forbes - Pas de Deux](https://www.forbes.com/sites/erikkain/2023/05/29/from-season-2-episode-6-pas-de-deux-review-a-terrifying-return-to-form/)
- Presence des cigales sur le corps de Smiley et menace onirique : [From Wiki - Forest for the Trees](https://from.fandom.com/wiki/Forest_for_the_Trees)

## Decisions de coherence

- `Smiling Townwalker` est le libelle de gameplay du projet. La planche reprend un archetype de creature nocturne en uniforme de milkman, distinct de Smiley. La transformation reste limitee a l'attaque.
- `Faraway Tree Echo` n'est pas transforme en demon ou en arbre conscient. Les animations representent le danger spatial confirme : profondeur instable du creux, deplacement apparent et pierre reapparaissant ailleurs.
- `Cicada Nightmare` reste un petit essaim de cigales naturelles lisibles. Aucun insecte geant ou pouvoir non confirme n'a ete ajoute.
- Smiley conserve sa facade humaine sur `idle`, `run` et `hit`. La bouche a dents fines et les griffes apparaissent uniquement sur `attack`.
- La ballerine reste une apparition humaine pale en tutu ancien. La boite a musique ouverte est presente dans les 16 cellules et l'attaque reste liee aux manifestations documentees.

## QA visuelle

- Identite, tenue, proportions et echelle stables dans chaque planche.
- Seize cellules occupees par fichier, sans personnage melange, texte, HUD, logo, watermark ou grille imprimee.
- Les animations restent lisibles dans l'ordre `idle`, `run`, `attack`, `hit`.
- Aucun element d'une cellule ne deborde dans la cellule voisine apres recomposition.
- Inspection manuelle realisee sur les cinq PNG finaux avec transparence affichee.

## QA technique finale

| Fichier | Taille | Mode | Cellules | Marge minimale par cellule | hiddenRGB | Chroma residuel |
| --- | --- | --- | --- | --- | --- | --- |
| `smiling-townwalker.png` | 1024 x 1024 | RGBA | 16/16 | 12 px | 0 | 0 |
| `faraway-tree-echo.png` | 1024 x 1024 | RGBA | 16/16 | 12 px | 0 | 0 |
| `cicada-nightmare.png` | 1024 x 1024 | RGBA | 16/16 | 12 px | 0 | 0 |
| `smiley-creature.png` | 1024 x 1024 | RGBA | 16/16 | 12 px | 0 | 0 |
| `music-box-ballerina.png` | 1024 x 1024 | RGBA | 16/16 | 12 px | 0 | 0 |

La marge a ete imposee cellule par cellule dans une zone utile maximale de 232 x 232 px, centree dans chaque cellule de 256 x 256 px. Tous les pixels completement transparents ont ete normalises a `(0, 0, 0, 0)`.
