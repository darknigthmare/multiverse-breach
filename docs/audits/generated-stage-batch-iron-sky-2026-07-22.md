# Pack de stages OpenAI - Iron Sky - 2026-07-22

## Perimetre

- Univers runtime : `Iron Sky`
- Inspiration : film `Iron Sky` (2012)
- Slug : `iron-sky`
- Dossier final : `public/backgrounds/lore-stages/iron-sky/`
- Generation : outil OpenAI ImageGen integre, avec un prompt propre a chaque
  type d'asset. La vue Tactics a recu deux corrections ImageGen ciblees afin
  d'obtenir strictement une grille 8 x 6.
- Direction : decors pixel-art originaux et fan-made, informes par la direction
  artistique du film sans copier un plan, une texture ou un asset officiel.

## References visuelles et lore

Les references ont ete consultees avant la generation. Elles ont uniquement
servi a identifier les marqueurs visuels du film.

- [FXGuide - Space Nazis: the making of Iron Sky](https://www.fxguide.com/fxfeatured/space-nazis-the-making-of-iron-sky/)
  : pont du Gotterdammerung, previs, decors virtuels et fabrication des grands
  espaces industriels.
- [Wired - Iron Sky's Moon Nazis: Shock Troops in Nordic Genre-Film Invasion](https://www.wired.com/2012/03/iron-sky-nordic-genre-films/)
  : technologie derivee des annees 1940, ordinateurs mecaniques demesures,
  chaudieres, engrenages, zeppelins spatiaux et echelle du Gotterdammerung.
- [Wired - galerie de production Iron Sky](https://www.wired.com/gallery/iron-sky/)
  : silhouettes generales de la base lunaire, des vehicules et des volumes de
  production.
- [BFI Sight and Sound - Iron Sky](https://www.bfi.org.uk/sight-and-sound/news/berlinale-2012-starship-stormtroopers-iron-sky)
  : patine de la base lunaire et confrontation spatiale du Gotterdammerung.

La reinterpretation finale conserve les formes industrielles, analogiques et
lunaires, mais retire toute iconographie politique reelle ou extremiste.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 658976 | `175386596db149e5daddc9fbb60800c71427c612a026e49e4bac05233137db21` |
| `melee.webp` | 1672x941 | RGB | 439676 | `0ec97917a5aecf9d55f9bdb0b950bcc629c25d167048313b9609bcb694fa5884` |
| `melee-backdrop.webp` | 1672x941 | RGB | 440830 | `7a369fd3a527f1a965ee251bfd5053d06c57f7f10957c0fd3fabed57a57f80ba` |
| `rpg.webp` | 1672x941 | RGB | 639374 | `e02894fbbb2868ad4a746748c2f420950090b6f801133b11c2a6c721bac3b5ae` |
| `tactics.webp` | 1448x1086 | RGB | 641588 | `93b8140a5cc251b07325aa660fb52a6e1dcf53015b4d2e92531890bba90fcb50` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 635814 | `5f4337d4dbac354d971c76d22a466af52bd5a928d13f453c941af6302ebca38c` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 709208 | `94a6d1d5c8d818439fc98649a6f89d962fdb75251a0e34a463964f788b76de01` |

## Set final de prompts

Tous les prompts imposaient un pixel-art 16-bit/32-bit detaille, des pixels
volontairement nets, une palette acier sombre / gris lunaire / ambre, des
machines analogiques, l'absence de personnage et l'interdiction de texte,
logo, HUD, watermark, drapeau, propagande ou symbole politique reel.

1. `combat.webp` : immense hangar lateral, sol de duel continu, soucoupe
   blindee, section de cuirasse du Gotterdammerung, Terre visible et machines
   repoussees derriere le plan des combattants.
2. `melee.webp` : baie de lancement laterale ouverte sur la surface lunaire,
   plancher bas continu et centre volontairement libre pour les plateformes
   ajoutees par le moteur.
3. `melee-backdrop.webp` : panorama en profondeur d'un chantier lunaire, grand
   cuirasse analogique, zeppelins spatiaux, petites soucoupes, crateres et Terre,
   sans geometrie jouable au premier plan.
4. `rpg.webp` : pont de commandement mecanique en vue trois-quarts laterale,
   large aire centrale et bandes de profondeur lisibles pour le tri avant/arriere.
5. `tactics.webp` : pont de maintenance en vraie vue tactique trois-quarts,
   exactement 8 colonnes par 6 rangees, 48 cases vides et quatre coins visibles.
6. `melee-platforms.webp` : exactement huit plateformes laterales distinctes
   sur chroma uniforme `#FF00FF`, reparties en matrice invisible 2 x 4.
7. `tactics-tiles.webp` : exactement seize sols, couvertures, dangers et objets
   tactiques en angle trois-quarts coherent, repartis en matrice invisible 4 x 4
   sur chroma uniforme `#FF00FF`.

## Post-traitement

1. Les cinq decors opaques ont ete encodes en WebP RGB qualite 96.
2. La sortie Tactics corrigee mesurait 1449x1086 ; un pixel vide de composition
   a droite a ete retire pour atteindre exactement 1448x1086 sans redimensionner
   la grille ni modifier sa perspective.
3. Les deux atlas chroma ont ete detoures avec le helper ImageGen installe,
   echantillonnage automatique du bord, soft matte, despill et contraction d'un
   pixel.
4. Les atlas ont ensuite ete encodes en WebP RGBA lossless avec `exact`.
5. Tous les pixels RGB places sous un alpha nul ont ete forces a `0,0,0`.

## QA structurelle

| Controle | `melee-platforms.webp` | `tactics-tiles.webp` |
| --- | ---: | ---: |
| Pixels transparents | 1095379 | 1089094 |
| Pixels partiellement transparents | 30780 | 27848 |
| Pixels opaques | 446357 | 455574 |
| Coins transparents | 4/4 | 4/4 |
| Pixels non transparents sur le bord externe | 0 | 0 |
| Pixels magenta visibles | 0 | 0 |
| RGB non nul sous alpha 0 | 0 | 0 |
| Cellules occupees | 8/8 | 16/16 |
| Couverture visible minimale par cellule | 39934 px | 20626 px |

- Le dossier contient exactement les sept WebP demandes et aucun intermediaire.
- Les dimensions et modes ont ete verifies apres reouverture de chaque WebP.
- `tactics.webp` montre neuf limites de colonnes et sept limites de rangees,
  bordures comprises : exactement 8 x 6, soit 48 cases.
- Les quatre coins de la grille sont visibles, les cases arriere sont plus
  petites que les cases avant et la paroi reste visible : la vue est bien
  trois-quarts, jamais top-down.
- Les huit plateformes et les seize elements tactiques restent complets,
  visuellement separes et sans chevauchement entre assets.

## QA visuelle

- `combat.webp` : plan de duel horizontal continu et centre sans obstacle.
- `melee.webp` : sol bas stable, espace central libre et profondeur compatible
  avec l'atlas de plateformes independant.
- `melee-backdrop.webp` : au moins six plans de profondeur lisibles et aucune
  geometrie de collision au premier plan.
- `rpg.webp` : axe gauche-droite clair et profondeur suffisante pour placer les
  sprites avant/arriere sans incoherence visuelle.
- `tactics.webp` : grille 8 x 6 non coupee, cases libres et perspective adaptee
  au gameplay Tactics de l'application.
- Les deux atlas ont une echelle, un angle, une lumiere et une palette coherents
  avec leurs decors respectifs.
- Aucun personnage, creature, texte lisible, logo, HUD, UI, watermark, drapeau,
  propagande ou symbole politique reel n'est visible dans les sept fichiers.

## Integrite du depot

Cette tranche ajoute uniquement les sept fichiers du dossier `iron-sky` et ce
rapport. Aucun manifest, registre, fichier de code, profil musical ou commit
n'a ete cree par cette tranche.

## Resultat

PASS. Le pack Iron Sky est complet, jouable et coherent visuellement entre les
modes Combat, Melee, RPG et Tactics, avec ses couches de plateformes et de
tuiles separees.
