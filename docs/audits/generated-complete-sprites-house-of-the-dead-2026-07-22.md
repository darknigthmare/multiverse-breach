# Sprites House of the Dead complets generes par OpenAI ImageGen - 2026-07-22

## Perimetre livre

Ce lot ajoute exactement neuf planches pixel art originales fan-made pour le
premier `The House of the Dead`. Elles ont ete produites avec neuf appels
distincts au `built-in image_gen`. Aucun sprite, modele, photogramme, scan ou
asset Sega n'a ete copie dans les PNG.

| Role | Sujet | Fichier final | Octets |
|---|---|---|---:|
| Heros | Thomas Rogan | `public/sprites/generated/heroes/house-of-the-dead/thomas-rogan-hotd.png` | 671860 |
| Heros | Agent G | `public/sprites/generated/heroes/house-of-the-dead/g-hotd.png` | 524147 |
| Support | Sophie Richards | `public/sprites/generated/heroes/house-of-the-dead/sophie-hotd.png` | 525681 |
| Ennemi | Sam Type A-1 | `public/sprites/generated/bosses/house-of-the-dead/sam-type-a-1.png` | 592339 |
| Ennemi | Name Type G-2 | `public/sprites/generated/bosses/house-of-the-dead/name-type-g-2.png` | 746488 |
| Ennemi | Kenfis Type F-1 | `public/sprites/generated/bosses/house-of-the-dead/kenfis-type-f-1.png` | 702928 |
| Boss | Chariot | `public/sprites/generated/bosses/house-of-the-dead/chariot.png` | 982896 |
| Boss | Hangedman | `public/sprites/generated/bosses/house-of-the-dead/hangedman.png` | 891864 |
| Boss | Magician Type-0 | `public/sprites/generated/bosses/house-of-the-dead/magician-type-0.png` | 615251 |

Chaque sortie est un PNG `RGBA` de `1024x1024`, organise en grille logique
stricte `4x4` de cellules `256x256` : ligne 1 `idle`, ligne 2 `run` ou
locomotion, ligne 3 `attack`, ligne 4 `hit/recovery`.

## References visuelles consultees

Les recherches ont privilegie les publications Sega, le manuel, le flyer
d'epoque, le guide officiel Saturn et la galerie du remake sous licence Sega :

- [historique arcade officiel Sega](https://www.sega.jp/history/arcade/product/9038/) ;
- [site officiel The House of the Dead: Remake](https://www.hotdremake.com/) ;
- [manuel operateur Sega 1997](https://www.gamesdatabase.org/Media/SYSTEM/Arcade/Manual/formated/House_of_the_Dead_-_1997_-_Sega.pdf) ;
- [flyer Sega 1997, recto/verso et pages interieures](https://flyers.arcade-museum.com/videogames/show/1546) ;
- [The House of the Dead Official Guide, Sega Official Books](https://segaretro.org/The_House_of_the_Dead_Official_Guide) ;
- [index des pages et scans du guide officiel](https://thehouseofthedead.fandom.com/wiki/The_House_of_the_Dead_Official_Guide).

Les fiches documentaires ciblees ont servi a recouper les silhouettes, tenues,
types, armes, modes d'attaque et points faibles avec les scans du guide et les
galeries d'art officiel : [Thomas Rogan](https://thehouseofthedead.fandom.com/wiki/Thomas_Rogan),
[G](https://thehouseofthedead.fandom.com/wiki/G),
[Sophie Richards](https://thehouseofthedead.fandom.com/wiki/Sophie_Richards),
[Sam](https://thehouseofthedead.fandom.com/wiki/Sam),
[Name](https://thehouseofthedead.fandom.com/wiki/Name),
[Kenfis](https://thehouseofthedead.fandom.com/wiki/Kenfis),
[Chariot](https://thehouseofthedead.fandom.com/wiki/Chariot),
[Hangedman](https://thehouseofthedead.fandom.com/wiki/Hangedman) et
[Magician](https://thehouseofthedead.fandom.com/wiki/Magician).

## Verrous canon appliques

| Sujet | Identite visuelle | Animation canonique retenue |
|---|---|---|
| Thomas Rogan | manteau et costume brun clair, chemise blanche, cravate noire, cheveux fauves | course et pistolet AMS six coups ; aucune tenue de HOTD III |
| Agent G | long costume bleu nuit, chemise bleue, cravate noire, cheveux sombres | posture AMS froide et pistolet ; aucune lunette ni variante vieillie |
| Sophie Richards | chercheuse DBR blonde en tailleur rouge 1998 | fuite, secours et defense non letale au petit extincteur ; aucune tenue militaire |
| Sam Type A-1 | humanoide chauve gris-bleu, torse nu, pantalon bleu dechire | demarche, course, saisie et morsure sans gore |
| Name Type G-2 | creature basse rose, corps nervure, dessous beige, antennes et appendices | reptation murale suggeree, morsure et petit projectile ; jamais le mot `Name` |
| Kenfis Type F-1 | quadrupede canin-gargouille gris/brun, tete aveugle, petites ailes vestigiales | course en zigzag et bond mordant ; aucun vol |
| Chariot | masque industriel, armure patchwork sanglee, bardiche, point faible rouge de cuirasse | charge lourde, coups de bardiche et recul sur le point faible |
| Hangedman | tete aviaire, longues oreilles, lunettes rouges, griffes et ailes de chauve-souris | vol, plongeon et attaque aux griffes ; aucune forme velue de Scarlet Dawn |
| Magician Type-0 | corps biomecanique noir, plaques hexagonales, fibres synthetiques rouges exposees | dash aerien, pyrokinese et boules de feu contenues |

Les lesions de Sam et Kenfis ont ete traduites en textures sombres non
graphiques. Les fibres rouges de Magician restent clairement synthetiques.
Aucun sang, organe, os expose, membre tranche ou autre gore n'est present.

## Generation et post-traitement

1. ImageGen a produit neuf sources RGB `1254x1254` sur fond chroma vert plat.
2. Le fond a ete retire avec le helper installe
   `remove_chroma_key.py --auto-key border --soft-matte
   --transparent-threshold 12 --opaque-threshold 220 --despill
   --edge-contract 1`.
3. `scripts/normalizeGeneratedSpriteSheet.py` a identifie `16/16` corps par
   source et reconstruit chaque grille finale en `1024x1024`, avec une garde
   minimale de `12 px` dans chaque cellule.
4. Le controle final a retire un unique pixel source vert pur a alpha `13` sur
   Magician. La verification complete a ensuite ete relancee avec succes.
5. Tous les RGB sous `alpha=0` ont ete remis a zero. Aucun intermediaire n'est
   conserve dans le depot.

## QA technique finale

Seuil d'occupation, de marge et de frontiere : `alpha > 12`. La recherche de
chroma visible utilise une distance RGB maximale de `48` autour de `#00ff00`.

Resultats communs aux neuf fichiers :

- mode `RGBA`, dimensions `1024x1024`, plage alpha `0..255` ;
- quatre coins transparents par fichier ;
- `144/144` cellules occupees et `144/144` hashes de frames uniques ;
- marge minimale de `12 px` ;
- `0` pixel visible sur les doubles bandes des frontieres internes ;
- `0` pixel chroma vert visible ;
- `0` pixel RGB non nul sous `alpha=0`.

| Fichier | Cellules | Frames uniques | Marge | Frontieres | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---|
| `thomas-rogan-hotd.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `e9bf884849e11e65b9bd4e1eca46ad61fab445825929714597c6f9aed21a6763` |
| `g-hotd.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `087785ad0d7e0befa53af3a2620252b179cee29018f4c68b45c143b392be425e` |
| `sophie-hotd.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `1aefc55ec268686dbde3be2b70e18cb023ec9be9eadca9e40f8585b9150951a0` |
| `sam-type-a-1.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `8cc76dc8ed47049cb12ed723eee0281ba172bdc11778ec4ecf28d3de5ee34331` |
| `name-type-g-2.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `fa6dfae6d99c603f6aea824cb5ea34f5714f2ce2a10ad8554e376fb794a17a2c` |
| `kenfis-type-f-1.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `1465af2f1e3b0f22e7985ba92fbb0c6bc9f6316bc0c91a59d4f3929083c4cbb9` |
| `chariot.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `57f0cd0ec093eeb19bf7288cb224f2856c027ddd08c27bca5ef9fffeabfd7183` |
| `hangedman.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `f4ad21da81f0a4b4f4459ac4f7e5f025e2298e41e458448f9ed9afefcfce5e12` |
| `magician-type-0.png` | 16/16 | 16/16 | 12 px | 0 | 0 | 0 | `331d7b53949cf28a736e994446ecf52689612b418e9e3ccb287de8d9ebf9b105` |

## Inspection visuelle finale

Les neuf PNG ont ete inspectes individuellement a leur resolution originale.
Les 16 poses de chaque planche sont completes et distinctes, l'identite reste
coherente entre les frames, et les armes, ailes, antennes, bardiche, point
faible et effets de feu restent dans leur cellule. Aucun texte, logo, UI,
watermark, decor, ombre de sol, personnage supplementaire ou gore n'a ete
observe.

## Hors perimetre confirme

Les manifestes, `openai-sprite-prompts`, `generatedStageAssets`, le code source,
les dependances et les metadonnees Git n'ont pas ete modifies par ce lot. Aucun
commit, push ou deploiement n'a ete execute.
