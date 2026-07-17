# Production visuelle world boss P0 - 2026-07-17

## Scope

Lot strictement limite a deux world bosses de combat absents :

- `Ecco the Dolphin` - `Vortex Queen`
- `The Matrix` - `Agent Smith / Super Smith`

Aucun fichier JavaScript, registre, manifeste, moteur, renderer ou fichier de deploiement n'a ete modifie pendant cette production. Aucun commit, push ou deploiement n'a ete effectue.

## Sources visuelles

### Vortex Queen

- [Ecco Online - sprites extraits du jeu Mega Drive](https://eccoonline.net/ecco-the-dolphin/sprites/)
- [Ecco the Dolphin Wiki - Vortex Queen](https://eccothedolphin.fandom.com/wiki/Vortex_Queen)
- [Sega-16 - Ecco the Dolphin](https://www.sega-16.com/2018/11/ecco-the-dolphin-md/)

Le verrou visuel reprend la continuite du premier `Ecco the Dolphin` : immense tete biomecanique vert sombre, dome cranien allonge et translucide, cavites laterales, organes oculaires, machoire inferieure detachee et projectiles Vortex. Les sprites originaux extraits du jeu ont servi de references directes a la generation.

Le design exclut explicitement un corps humanoide, un corps de poisson, une anatomie de Xenomorphe complete, un signal personnifie et tout faux noyau Nexus.

### Agent Smith / Super Smith

- [Jasin Boland - The Matrix Revolutions, photographies de plateau](https://jasinboland.com/work/the-matrix-revolutions/)
- [Matrix Wiki - Agent Smith](https://matrix.fandom.com/wiki/Agent_Smith)
- [McFarlane Toys - Agent Smith, Super Burly Brawl](https://mcfarlane.com/toys/agent-smith/)

Le verrou visuel reprend la continuite `The Matrix Revolutions (2003) - Super Burly Brawl` : apparence de Hugo Weaving, cheveux sombres mouilles et rejetes en arriere, lunettes rectangulaires noires, costume noir trempe, chemise blanche, cravate noire fine et chaussures noires.

Le design exclut explicitement toute arme a feu, trench-coat, armure, cable de Machine, noyau Nexus, Neo ou second personnage complet dans une cellule.

## Generation OpenAI

Mode utilise : outil OpenAI ImageGen integre, une generation distincte par world boss.

Les deux sources ont ete generees sur fond chroma uni `#FF00FF`, puis detourees localement avec le helper officiel `remove_chroma_key.py`. Les sheets RGBA ont ensuite ete normalisees avec `scripts/normalizeGeneratedSpriteSheet.py` afin d'obtenir une grille stricte sans fuite entre cellules.

### Vortex Queen

- Sortie : `/sprites/generated/bosses/ecco-the-dolphin/vortex-queen.png`
- Fichier : `public/sprites/generated/bosses/ecco-the-dolphin/vortex-queen.png`
- Layout : `large`, sheet standard 4 x 4
- Animation :
  - ligne 1 : flottement et respiration
  - ligne 2 : aspiration et ouverture de la machoire
  - ligne 3 : activation des yeux et projectiles Vortex
  - ligne 4 : machoire detachee, yeux endommages et recul final
- SHA-256 : `C32358B535A3D246F6DF15DE6F3FB91F2D9B330B7400900372E397B268C8B880`

### Agent Smith / Super Smith

- Sortie d'override : `/sprites/generated/bosses/the-matrix/agent-smith-super-smith.png`
- Fichier : `public/sprites/generated/bosses/the-matrix/agent-smith-super-smith.png`
- Layout : `duelist`, sheet standard 4 x 4
- Animation :
  - ligne 1 : garde de combat sous la pluie
  - ligne 2 : lancement et charge aerienne
  - ligne 3 : coup lourd et onde d'impact
  - ligne 4 : pression des clones en surimpression, assimilation et recul final
- SHA-256 : `9D6BBF1BE59C2990456E977731ACA57AB7F0E81D614883DC7A981A5D0896A691`

## Validation

| Controle | Vortex Queen | Agent Smith / Super Smith |
| --- | ---: | ---: |
| Dimensions | 1024 x 1024 | 1024 x 1024 |
| Mode | RGBA | RGBA |
| Grille | 4 x 4 | 4 x 4 |
| Cellules non vides | 16 / 16 | 16 / 16 |
| Taille de cellule | 256 x 256 | 256 x 256 |
| Marge minimale | 12 px | 12 px |
| Coins transparents | 4 / 4 | 4 / 4 |
| Anatomie ou equipement coupe | non | non |
| Fuite vers une cellule voisine | non | non |
| Faux noyau Nexus | absent | absent |

Inspection visuelle finale :

- La Vortex Queen conserve la meme anatomie et le meme angle sur les 16 frames. Sa machoire detachee reste dans sa cellule et ses projectiles ne traversent aucune limite.
- Smith conserve la meme identite, la meme tenue et les memes proportions sur les 16 frames. Les effets de pluie, onde de choc et code restent attaches a leur cellule.

## Etat d'integration

Les PNG finaux sont presents aux chemins de production demandes. L'enregistrement de la Vortex Queen dans `src/game/loreWorldBossOverrides.js` et la regeneration des manifestes restent volontairement hors de ce lot.
