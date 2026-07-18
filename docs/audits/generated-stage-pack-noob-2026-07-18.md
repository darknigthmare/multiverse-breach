# Pack de stage OpenAI - Noob

Date : 2026-07-18

## Perimetre

Ce lot couvre uniquement le stage `Noob` sous :

`public/backgrounds/lore-stages/noob/`

Aucun fichier JavaScript, JSON, manifeste, registre, configuration ou code
d'integration n'a ete modifie. Aucun commit, push ou deploiement n'a ete
effectue.

## References officielles consultees

- [Centralis - Wiki Olydri](https://wiki.olydri.com/index.php?title=Centralis)
- [Centralis-RPG - Wiki Olydri](https://wiki.olydri.com/index.php?title=Centralis-RPG)
- [L'Oeil - Wiki Olydri](https://wiki.olydri.com/index.php?title=%C5%92il)
- [La faction de l'Empire - Wiki Olydri](https://wiki.olydri.com/index.php?title=La_faction_de_l%27Empire)
- [Dossier de presse Noob - noob-tv.com](https://noob-tv.com/noob-tv-2/presse/dossier_de_presse_NOOB.pdf)
- [Dossier de presse Olydri - noob-tv.com](https://noob-tv.com/noob-tv-2/presse/dossier_de_presse_OLYDRI.pdf)

Les references ont verrouille les points visuels suivants :

- Centralis est une capitale technologique verticale construite en hauteur ;
- l'Oeil domine le coeur de la cite ;
- le Glisseport, les tours du Savoir et des Decouvertes structurent la ligne
  d'horizon ;
- l'architecture nacree est alimentee par la rosaphir ;
- les quartiers utilisent des paliers, ponts, portails et teleporteurs ;
- le parc Oxygenium introduit une vegetation entretenue au sein de la cite ;
- le bouclier de rosaphir entoure et illumine Centralis.

## Direction visuelle

Le lot represente le parvis imperial de Centralis et la route de rencontre de la
Guilde Noob vers l'Oeil. Les sept images utilisent un pixel art 32-bit detaille,
une architecture nacree, des structures graphite et cyan ainsi qu'une
luminescence rosaphir magenta contenue.

Contraintes communes respectees :

- aucun personnage, avatar, ennemi ou creature ;
- aucun logo, embleme, texte lisible, panneau narratif ou watermark ;
- aucune UI, HUD, jauge ou marque de grille exterieure au terrain Tactics ;
- aucune copie directe d'une capture officielle ;
- aucun decor medieval generique ou quartier cyberpunk sans rapport avec
  Centralis.

## Fichiers produits

| Fichier | Dimensions | Mode | Usage |
| --- | ---: | --- | --- |
| `combat.webp` | 1536 x 864 | RGB | Parvis lateral avec sol continu et zone de combat degagee |
| `melee.webp` | 1536 x 864 | RGB | Scene melee laterale sans plateformes flottantes integrees |
| `melee-backdrop.webp` | 1536 x 864 | RGB | Skyline parallax sans sol ni geometrie jouable |
| `melee-platforms.webp` | 1024 x 1024 | RGBA | 12 modules de plateformes isoles |
| `rpg.webp` | 1536 x 864 | RGB | Couloir de combat RPG lateral 2.5D |
| `tactics.webp` | 1536 x 1024 | RGB | Vue 3/4 elevee avec grille rectangulaire 8 x 6 |
| `tactics-tiles.webp` | 1024 x 1024 | RGBA | 18 tuiles, couvertures et modules isoles |

Le terrain `tactics.webp` contient exactement 8 colonnes et 6 rangees, soit
48 cases. La grille est un rectangle en perspective vu depuis une camera 3/4
elevee. Elle n'est ni top-down, ni tournee en losanges isometriques.

## Correction des atlas transparents

La premiere extraction chroma conservait des bandes horizontales dans les
canaux RGB de pixels pourtant transparents. Les deux atlas ont ete repris depuis
leurs sources chroma puis reencodes en WebP lossless avec les garanties
suivantes :

- fond RGBA reellement transparent ;
- `RGB = 0,0,0` pour chaque pixel dont `alpha = 0` ;
- aucun trait ou bande reliant deux modules ;
- aucune silhouette sur les bordures de l'image ;
- modules visuellement separes par des intervalles transparents ;
- bords pixel-art propres sans halo vert visible.

## Audit Pillow

Resultat final :

```text
exact_files=7

combat.webp
  1536x864 RGB

melee.webp
  1536x864 RGB

melee-backdrop.webp
  1536x864 RGB

melee-platforms.webp
  1024x1024 RGBA
  alpha_extrema=(0,255)
  transparent_pixels=678038
  opaque_pixels=360709
  partial_alpha_pixels=9829
  rgb_under_alpha_zero=0
  visible_border_pixels=0
  connected_components_ge_20px=12

rpg.webp
  1536x864 RGB

tactics.webp
  1536x1024 RGB
  grid=8x6

tactics-tiles.webp
  1024x1024 RGBA
  alpha_extrema=(0,255)
  transparent_pixels=690038
  opaque_pixels=346642
  partial_alpha_pixels=11896
  rgb_under_alpha_zero=0
  visible_border_pixels=0
  connected_components_ge_20px=18

AUDIT_OK
```

## Inspection visuelle finale

- `combat.webp` : sol continu, centre libre, Oeil et bouclier lisibles.
- `melee.webp` : base jouable continue et aucune plateforme flottante gravee
  dans le decor.
- `melee-backdrop.webp` : couche de fond pure, exploitable en parallax.
- `melee-platforms.webp` : 12 objets isoles, aucune bande horizontale ou
  connexion parasite.
- `rpg.webp` : espace lateral libre pour les deux camps.
- `tactics.webp` : grille complete, lisible et entierement dans le cadre.
- `tactics-tiles.webp` : 18 objets isoles, aucune bande horizontale ou connexion
  parasite.

## Methode de generation

Les images ont ete generees avec le mode integre OpenAI `imagegen`. Les prompts
ont ete separes par usage (`combat`, `melee`, `backdrop`, `rpg`, `tactics`,
`platform atlas`, `tactics atlas`) afin de conserver les cameras et contraintes
de gameplay propres a chaque mode. Les atlas ont utilise un fond chroma uniforme
avant extraction locale et validation Pillow.
