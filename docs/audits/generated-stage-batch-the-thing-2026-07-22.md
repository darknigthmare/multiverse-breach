# Pack de stages OpenAI - The Thing (1982) - 2026-07-22

## Perimetre

- Univers runtime : `The Thing`
- Film de reference : `The Thing` (1982), realise par John Carpenter
- Lieu : station antarctique americaine Outpost 31
- Slug : `the-thing`
- Dossier final : `public/backgrounds/lore-stages/the-thing/`
- Generation : outil OpenAI ImageGen integre, avec un prompt distinct pour
  chaque asset. Deux essais tactiques non conformes ont ete rejetes ; aucune
  sortie rejetee n'a ete conservee.
- Direction : decors pixel-art originaux et fan-made, fideles aux marqueurs
  visuels du film sans copier un plan, un photogramme, un decor officiel ou un
  asset commercial.

## References visuelles et lore

Les sources ont ete consultees avant la generation. Elles ont servi uniquement
a identifier le lieu, les materiaux, l'eclairage et les espaces iconiques. Les
images officielles n'ont pas ete integrees aux fichiers finaux.

- [Universal Pictures At Home - The Thing (1982)](https://www.universalpicturesathome.com/movies/the-thing-1982)
  : confirme l'hiver 1982, l'equipe de douze hommes et la station de recherche
  antarctique.
- [American Society of Cinematographers - Photographing The Thing](https://theasc.com/article/flashback-the-thing/)
  : entretien avec Dean Cundey sur le decor construit sur une crete enneigee,
  le cadre large, les exterieurs bleus, les interieurs plus chauds, les lampes
  coniques, les zones d'ombre et l'emploi de l'espace negatif.
- [Outpost 31 - Storyboards](https://www.outpost31.com/storyboards)
  : archive secondaire des storyboards de production, dont les ensembles du
  chenil, du camp norvegien et de la sequence finale.
- [Outpost 31 - Maps](https://www.outpost31.com/maps)
  : recoupement secondaire de l'organisation du batiment principal, du sous-sol
  et du chenil. Les cartes n'ont pas ete reproduites.
- [Stan Winston School - Dog-Thing behind the scenes](https://www.stanwinstonschool.com/blog/dog-thing-the-thing-creating-iconic-alien-effects-behind-the-scenes-stan-winston-studio)
  : contexte de production de la sequence du chenil. Le pack ne contient ni
  animal ni creature.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 450360 | `97db8199ccb9523d3e6d28b2807faeaa158f456c2426f5a461a92a988bfff93d` |
| `melee.webp` | 1672x941 | RGB | 460242 | `3a5c5e0fcf2de8677aaf519c0cf7ca074c5bee460fa67f9cd8caa3c749115e94` |
| `melee-backdrop.webp` | 1672x941 | RGB | 313630 | `5e4cdb3e261ee11b99a9649af1aaace6d501dbccc99d4887dd71a28538e4cc7c` |
| `rpg.webp` | 1672x941 | RGB | 491528 | `945462731efba4123e454d4cbf657ef5e7c27c32f8dff0e7f0ccf59b7dccdbd9` |
| `tactics.webp` | 1448x1086 | RGB | 569974 | `d5fc2012f5e2353c6d50cda45088e594fd11480a4d246e2ba9c2c4c1c4514370` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 910506 | `a4a80f546fb09fdcb0c5ae1449628e5c702bcadd3dbea4bd60af658c3c2fca32` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 912858 | `4395b1537c4e4a58d29bec1ffe5898638f76947f3b4af67a5812ea13d8faad6e` |

## Prompts finaux

Tous les prompts imposaient un pixel-art 32-bit detaille, une composition
originale, la coherence Outpost 31, et l'absence de personnage, animal,
creature, silhouette, texte lisible, logo, HUD, UI, watermark ou signature.

1. `combat.webp` : salle de recreation et de test sanguin vide, mur en bois et
   tole, appareils analogiques, petit laboratoire en retrait, fenetre givree et
   generateur visible par une porte de service ; vue laterale et sol continu
   libre sur tout le tiers inferieur.
2. `melee.webp` : coupe laterale de la station pendant un whiteout, avec annexe
   du generateur, corridor central et chenil grillage ; sol bas continu, centre
   degage et aucune plateforme de gameplay incrustee.
3. `melee-backdrop.webp` : exterieur nocturne de la station sur une crete
   glaciaire, batiments bas, antenne, reservoirs, cheminee et montagnes en six
   plans de parallaxe ; quart inferieur calme pour le compositing.
4. `rpg.webp` : chenil vide en vue trois-quarts laterale, cages grillagees,
   gamelles, paille, tuyaux, petit chauffage et porte ouverte sur la neige ; deux
   axes de profondeur lisibles sur un sol largement degage.
5. `tactics.webp` : annexe du generateur ouverte sur le whiteout, machinerie en
   peripherie et grand quadrilatere central sans aucune couture. Une grille
   mathematique 8x6 a ensuite ete posee sur ce sol genere.
6. `melee-platforms.webp` : exactement huit plateformes isolees sur chroma
   `#FF00FF`, en matrice 2x4 : passerelle bois/neige, catwalk du generateur,
   pont du chenil, toiture givree, caisse renforcee, plancher casse, gantry de
   tuyaux et fragment de piste d'helicoptere.
7. `tactics-tiles.webp` : exactement seize tuiles et obstacles sur chroma
   `#FF00FF`, en matrice 4x4 : neige, acier gele, bois casse, grille, caisse,
   valises, futs, chauffage, generateur, console, grillage, tuyaux, table de
   test, canape, projecteur et cartouche de flare dans un bac.

## Essais tactiques rejetes

- Premier essai : le generateur a dessine neuf colonnes et sept rangees au lieu
  de 8x6 ; la sortie a ete rejetee.
- Deuxieme essai : le plateau vierge etait conforme visuellement, mais le fichier
  source n'a pas ete persiste a cause d'un manque temporaire d'espace disque ;
  la sortie a ete rejetee.
- Troisieme essai : plateau vierge persiste et conserve. Aucune image rejetee
  n'a servi au fichier final.

## Post-traitement

1. Les cinq decors opaques ont ete produits directement dans leurs dimensions
   finales et encodes en WebP RGB, qualite 96.
2. Les deux atlas ont ete produits directement en 1254x1254 sur chroma magenta.
3. Le helper installe `remove_chroma_key.py` a ete utilise avec echantillonnage
   automatique du bord, soft matte, despill, seuil transparent 12, seuil opaque
   220 et contraction d'un pixel.
4. Les RGB sous alpha nul ont ete forces a `0,0,0`, puis les atlas ont ete
   encodes en WebP lossless avec conservation exacte de l'alpha.
5. La grille tactique a ete ajoutee sur le plateau vierge avec neuf limites de
   colonnes et sept limites de rangees. Les coins sont `(520,352)`,
   `(1192,435)`, `(902,1027)` et `(38,604)`. Les separations de rangees suivent
   `0, 0.095, 0.215, 0.365, 0.545, 0.755, 1`, ce qui agrandit les cases vers la
   camera et preserve la perspective trois-quarts.
6. Tous les fichiers ont ete rouverts apres encodage pour verifier leur taille,
   leur mode et leur integrite.

## QA structurelle

| Controle | `melee-platforms.webp` | `tactics-tiles.webp` |
| --- | ---: | ---: |
| Pixels transparents | 1093556 | 1106610 |
| Pixels partiellement transparents | 59974 | 34476 |
| Pixels opaques | 418986 | 431430 |
| Coins transparents | 4/4 | 4/4 |
| Pixels magenta visibles | 0 | 0 |
| RGB non nul sous alpha 0 | 0 | 0 |
| Emplacements occupes | 8/8 | 16/16 |
| Couverture minimale par emplacement | 46489 px | 13623 px |

- `tactics.webp` contient exactement 9 limites longitudinales et 7 limites
  transversales, bordures incluses : 8 x 6, soit 48 cases.
- Les quatre coins du plateau sont visibles et les intervalles s'agrandissent
  vers le premier plan, confirmant une vraie vue trois-quarts non top-down.
- Les 48 cases sont libres ; le generateur, les tuyaux, les futs et les consoles
  restent hors du quadrilatere jouable.
- Les huit plateformes et les seize tuiles sont completes, separees, non coupees
  par les bords de l'image et sans frange chroma visible.

## QA visuelle

- `combat.webp` : sol continu, centre libre et contraste chaud/froid lisible.
- `melee.webp` : generateur, corridor et chenil clairement differencies ; zone
  de jeu basse stable et espace suffisant pour les plateformes runtime.
- `melee-backdrop.webp` : station identifiable, whiteout, profondeur en couches
  et aucune geometrie de jeu au premier plan.
- `rpg.webp` : chenil vide, angle lateral trois-quarts et deux axes de placement
  immediatement lisibles.
- `tactics.webp` : grille 8x6 complete, quatre coins visibles, pas d'obstacle
  dans une case et perspective coherente avec les tuiles.
- `melee-platforms.webp` : huit tops horizontaux lisibles et silhouettes
  suffisamment variees pour les layouts du mode Melee.
- `tactics-tiles.webp` : seize pieces distinctes, coherentes en echelle, angle,
  materiaux et lumiere.
- Aucun personnage, animal, creature, silhouette, texte lisible, logo, HUD, UI,
  watermark, signature, gore ou photogramme copie n'est present.

## Integrite du depot

Cette passe ajoute uniquement les sept fichiers du dossier `the-thing` et ce
rapport. Aucun manifest, registre, fichier de code, profil musical ou fichier
d'un autre lot n'a ete modifie. Aucun commit n'a ete cree.
