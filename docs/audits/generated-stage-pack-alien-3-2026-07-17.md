# Pack de stage OpenAI - Alien 3 / Fiorina 161

Date: 2026-07-17
Universe: Alien 3
Slug: alien-3
Location: Fiorina 161 leadworks furnace and mold catwalk

## Profil local utilise

Source: `src/game/stageLoreProfiles.js`

- Combat: `strict-side-view-16-9`
- Melee: `strict-side-view-platform-arena`
- RPG: `side-view-2.5d`
- Tactics: `elevated-three-quarter-rectangular-grid`
- Tactics grid: 8x6 rectangular cells, never top-down or diamond-isometric

Le rendu suit le profil visuel local: fonderie de plomb, fourneaux, passerelles de moule,
prison industrielle et architecture corrodee de Fiorina 161. Aucun decor du Nostromo n'a
ete reutilise.

## Fichiers generes

Tous les fichiers sont sous `public/backgrounds/lore-stages/alien-3/`.

| Fichier | Format | Taille | Usage |
|---|---|---:|---|
| `combat.webp` | WebP RGB | 1536x864 | Combat lateral, sol continu |
| `melee.webp` | WebP RGB | 1536x864 | Composition complete de l'arene Melee |
| `melee-backdrop.webp` | WebP RGB | 1536x864 | Fond Melee sans plateformes de collision |
| `melee-platforms.webp` | WebP RGBA | 1024x1024 | Atlas de 6 plateformes reutilisables |
| `rpg.webp` | WebP RGB | 1536x864 | Combat RPG side-view 2.5D, lane libre |
| `tactics.webp` | WebP RGB | 1536x1024 | Terrain Tactics trois-quarts 8x6 |
| `tactics-tiles.webp` | WebP RGBA | 1024x1024 | Atlas de 8 tiles rectangulaires |

## Contenu visuel

- Combat: hall de leadworks avec sol continu, fours et machinerie en profondeur.
- Melee: composition complete avec trois hauteurs de passerelles lisibles; les sprites de
  collision restent fournis a part dans `melee-platforms.webp`.
- Melee backdrop: fonderie et mold-room sans plateformes cuites dans le fond.
- RPG: voie de combat horizontale ouverte, profondeur 2.5D et aucune grille.
- Tactics: salle de moulage en perspective trois-quarts avec cases rectangulaires visibles,
  plateformes de service, obstacles et zones de chaleur.
- Atlas Melee: catwalk grille, ledge de four, passerelle suspendue, pont de tuyau, poutre de
  gantry et plateforme de service.
- Atlas Tactics: sol grille, plaque rouillee, case de chaleur, deck sureleve, couvert lourd,
  pont etroit, bord de cuve et tranchee de maintenance.

## Contraintes controlees

- Pixel art 32-bit original, palette rouille, noir de suie, gris plomb et orange de four.
- Aucun personnage, xenomorphe, oeuf, facehugger ou arme dans les sept fichiers.
- Aucun texte, logo, watermark, interface ou element de vaisseau spatial.
- Pas de Nostromo.
- Les atlas ont un fond chroma retire localement puis converti en WebP RGBA.
- Les atlas n'ont plus de residu vert visible apres nettoyage.
- Les coins des deux atlas sont transparents.
- Aucun JavaScript, JSON ou manifeste n'a ete modifie.

## References visuelles consultees

- Profil officiel des films 20th Century Studios: https://www.20thcenturystudios.com/horror
- Fiorina 161 et la leadworks/fonderie: https://avp.fandom.com/wiki/Fiorina_%22Fury%22_161
- Set de la Class C Work Correctional Unit et leadworks: https://avp.fandom.com/wiki/Fiorina_161_Class_C_Work_Correctional_Unit
- Notes de production sur les miniatures des fourneaux et les tours industrielles:
  https://alienseries.wordpress.com/tag/fiorina-161/

## Verification finale

Controle local Pillow effectue le 2026-07-17:

- 7 fichiers attendus presents.
- 5 scenes en 1536x864.
- 2 atlas en 1024x1024.
- `tactics.webp` en 1536x1024.
- alpha detecte sur les deux atlas.
- coins transparents sur les deux atlas.
- aucun residu chroma vert visible apres nettoyage.
- inspection visuelle des sept sorties effectuee avant integration.

Generation realisee avec OpenAI ImageGen, puis traitement local de chroma-key pour les
atlas. Aucun commit, push ou deploiement n'a ete effectue dans le cadre de cette generation.
