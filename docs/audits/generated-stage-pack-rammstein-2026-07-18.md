# Pack de stages Rammstein - 18 juillet 2026

## Perimetre

Pack complet genere avec le mode integre OpenAI ImageGen pour le profil
`Rammstein`.

Direction retenue :

> Feuerzone devant la scene monumentale du World Stadium Tour 2019-2024.

Les sept assets sont des compositions originales en pixel art 32-bit. Les
references servent uniquement a verrouiller la silhouette de la production,
ses materiaux, son echelle et son langage pyrotechnique. Aucun fichier officiel
n'est reutilise dans les assets finaux.

## References officielles et primaires

- [Portail presse officiel Rammstein](https://presse.rammstein.de/en) :
  source officielle du materiel recent des concerts. Son contenu haute
  definition requiert un compte presse et n'a pas ete copie dans le projet.
- [Behind The Scenes of the World Stadium Tour 2019-2024](https://www.rammstein.de/en/news/behind-the-scenes-of-the-world-stadium-tour-2019-2024/) :
  page officielle publiee le 22 decembre 2024, confirmant la tournee de
  135 concerts, la construction complexe, le design lumiere, la pyrotechnie et
  la logistique de 2019 a 2024.
- [Documentaire officiel World Stadium Tour 2019-2024](https://www.youtube.com/watch?v=yK5sg2rRXXg) :
  reference visuelle recente pour l'echelle de la scene et l'organisation de
  la production.
- [Historique officiel Rammstein](https://www.rammstein.de/en/history/) :
  premiere tournee des stades lancee en 2019, production de 1 350 tonnes,
  90 camions et 265 membres d'equipe.
- [Profil de production TPi / ShowTex](https://www.showtex.com/files/media/TPI-nov-19-Rammstein-ShowTex.pdf) :
  source primaire des fournisseurs et designers. Elle decrit notamment la tour
  dystopique centrale de 36 m, l'acier noir, l'ecran portrait mobile de 5 x 9 m,
  les deux tours PA de 23 m, les quatre structures circulaires de projecteurs
  de 3,5 m, les passerelles, l'eclairage architectural et les dispositifs pyro.

## Verrous lore et visuels

- Scene industrielle monumentale en acier noir, sans decor fantasy.
- Tour centrale verticale avec ecran portrait eteint.
- Tours PA, echafaudages, grilles, tuyaux, rivets et passerelles visibles.
- Grandes structures circulaires de projecteurs reprises comme motif.
- Palette charbon, acier, rouge sombre et orange de fournaise.
- Pyrotechnie traitee uniquement comme decor ou hazard de terrain.
- Aucun membre du groupe, personnage, ennemi, monstre ou instrument.
- Aucun logo, texte lisible, UI, HUD ou filigrane.

## Fichiers produits

| Fichier | Dimensions | Canal | Usage |
|---|---:|---|---|
| `combat.webp` | 1536 x 864 | RGB | Combat lateral, sol continu et centre libre |
| `melee.webp` | 1536 x 864 | RGB | Fond Melee sans plateforme integree |
| `melee-backdrop.webp` | 1536 x 864 | RGB | Fond de parallaxe Melee |
| `melee-platforms.webp` | 1024 x 1024 | RGBA | Douze plateformes et modules separes |
| `rpg.webp` | 1536 x 864 | RGB | Vue laterale 2.5D et voie de combat degagee |
| `tactics.webp` | 1536 x 1024 | RGB | Vue 3/4 elevee, grille rectangulaire 8 x 6 |
| `tactics-tiles.webp` | 1024 x 1024 | RGBA | Douze cases, couvertures et hazards separes |

Chemin :

`public/backgrounds/lore-stages/rammstein/`

`melee.webp` et `melee-backdrop.webp` utilisent volontairement le meme fond
OpenAI propre. La geometrie jouable reste separee dans
`melee-platforms.webp`.

## Briefs ImageGen finaux

### Combat

- Vue strictement laterale 16:9 a hauteur de combattant.
- Scene complete centree, avec marge autour de la tour et des tours PA.
- Sol d'acier continu ; 60 % du bas et du centre sans obstacle.
- Flammes verticales limitees aux cotes et a l'arriere-plan.

### Melee et backdrop

- Meme architecture et meme identite que la vue Combat.
- Camera legerement plus eloignee.
- 45 % du bas et 70 % du centre reserves aux plateformes runtime.
- Aucun rebord, escalier, plateau ou element de collision peint.

### Atlas Melee

- Douze modules lateraux orthographiques sur chroma vert uniforme :
  plateformes longues, moyennes et courtes, passerelles en treillis, rebord de
  tour PA, module pyro eteint et deux embouts.
- Toutes les aretes jouables sont droites et horizontales.
- Aucune flamme active, ombre portee ou piece recadree.

### RPG

- Camera laterale 2.5D avec une faible fuite du plancher.
- Large voie centrale ininterrompue et zones de spawn libres a gauche et a
  droite.
- Scene monumentale complete en arriere-plan, sans obstacle au premier plan.

### Tactics

- Camera elevee trois-quarts a environ 30-35 degres.
- Une grille physique rectangulaire de huit colonnes par six rangees.
- Les rangees proches sont devant les rangees lointaines ; aucune vue
  verticale ni grille en losanges.
- Couvertures basses placees en bordure, deux hazards pyro eteints et une case
  objectif centrale sans symbole.

### Atlas Tactics

- Douze elements coherents avec la perspective du terrain :
  quatre cases normales, une case fissuree, une grille, deux cases surelevees,
  deux couvertures, une case pyro et une case objectif circulaire.
- Chroma vert uniforme, aucune ombre portee et aucun element superpose.

## Correction chroma

La premiere extraction a laisse des pixels bleus, magenta et rouges visibles
hors des objets. Une contraction de matte a aggrave le defaut et a donc ete
rejetee.

Les deux atlas finaux ont ete reconstruits depuis les sources chroma OpenAI
propres avec :

1. un masque binaire adapte au pixel art ;
2. une suppression de la dominante verte sur les bords ;
3. un redimensionnement en couleur premultipliee ;
4. la suppression des seuls residus bleu/magenta tres satures ;
5. un export WebP lossless avec `exact=True`.

Ce dernier parametre preserve explicitement `RGB=0` sous les pixels dont
`alpha=0`.

## Controles finaux

- Exactement sept fichiers presents dans le dossier.
- Inspection visuelle des sept fichiers effectuee.
- Inspection supplementaire des deux atlas sur damier gris effectuee.
- Aucun bloc, trait ou halo vert, bleu, magenta ou rouge hors des objets.
- Tous les objets des atlas sont complets, distincts et separes.
- `melee-platforms.webp` :
  - mode `RGBA`, alpha `0..255` ;
  - 668 303 pixels transparents et 380 273 pixels opaques ;
  - zero pixel partiellement transparent ;
  - zero pixel avec RGB non nul sous alpha nul ;
  - quatre coins transparents ;
  - zero residu vert, magenta ou bleu detecte.
- `tactics-tiles.webp` :
  - mode `RGBA`, alpha `0..255` ;
  - 730 647 pixels transparents et 317 929 pixels opaques ;
  - zero pixel partiellement transparent ;
  - zero pixel avec RGB non nul sous alpha nul ;
  - quatre coins transparents ;
  - zero residu vert, magenta ou bleu detecte.
- `combat.webp`, `melee.webp`, `melee-backdrop.webp` et `rpg.webp` :
  `1536 x 864`, mode `RGB`.
- `tactics.webp` : `1536 x 1024`, mode `RGB`, grille 8 x 6 lisible en
  perspective trois-quarts.
- Aucun personnage, ennemi, monstre, logo, texte lisible, UI ou HUD visible.

## Hors perimetre

Aucun fichier JavaScript, JSON ou manifeste n'a ete modifie. Aucun commit,
push ou deploiement n'a ete effectue.
