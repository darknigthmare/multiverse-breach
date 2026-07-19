# Production visuelle objets OpenAI - lot de six univers

Date : 2026-07-19

## Perimetre

- Univers completes : `Earthworm Jim`, `Flashback`, `Jet Set Radio`,
  `Lost Planet 2`, `Ristar` et `Seaman`.
- Objets produits : 24 icones, soit 4 objets sur 4 pour chaque univers.
- Methode : une generation OpenAI ImageGen distincte par objet, fondee sur
  les descriptions du registre et des references visuelles ou manuels.
- Rendu : pixel art original detaille, fond chroma retire localement, PNG RGBA
  final en 512 x 512.
- Integration : regeneration de `public/sprites/generated/sprite-manifest.json`.

## References et sorties

### Earthworm Jim

Reference principale :
[manuel Earthworm Jim Special Edition](https://r.mprd.se/Sega%20CD/Manuals/Earthworm%20Jim%20-%20Special%20Edition%20%28U%29.pdf)

- `public/sprites/generated/items/earthworm-jim/plasma-blaster.png`
- `public/sprites/generated/items/earthworm-jim/super-suit-collar.png`
- `public/sprites/generated/items/earthworm-jim/pocket-rocket.png`
- `public/sprites/generated/items/earthworm-jim/life-atom.png`

### Flashback

Reference principale :
[manuel Flashback](https://www.world-of-nintendo.com/manuals/super_nes/flashback.shtml)

- `public/sprites/generated/items/flashback/holocube.png`
- `public/sprites/generated/items/flashback/shield-cartridge.png`
- `public/sprites/generated/items/flashback/mechanical-mouse.png`
- `public/sprites/generated/items/flashback/teleport-receiver.png`

### Jet Set Radio

References principales :
[manuel Jet Grind Radio](https://www.digitpress.com/library/manuals/dreamcast/jet_grind_radio.pdf)
et [collection officielle Sega](https://shop.sega.com/collections/jet-set-radio).

- `public/sprites/generated/items/jet-set-radio/spray-can.png`
- `public/sprites/generated/items/jet-set-radio/magnetic-inline-skates.png`
- `public/sprites/generated/items/jet-set-radio/graffiti-soul.png`
- `public/sprites/generated/items/jet-set-radio/portable-radio.png`

### Lost Planet 2

Reference principale :
[manuel Lost Planet](https://www.videogamemanual.com/xbox360/Lost%20Planet-%20Extreme%20Condition%20Colonies%20Edition.pdf)

- `public/sprites/generated/items/lost-planet-2/t-eng-canister.png`
- `public/sprites/generated/items/lost-planet-2/harmonizer-injector.png`
- `public/sprites/generated/items/lost-planet-2/anchor-gun.png`
- `public/sprites/generated/items/lost-planet-2/vital-suit-activation-key.png`

### Ristar

Reference principale :
[manuel Ristar](https://segaretro.org/images/0/08/Ristar_Steam_manual.pdf)

- `public/sprites/generated/items/ristar/star-handle.png`
- `public/sprites/generated/items/ristar/little-star.png`
- `public/sprites/generated/items/ristar/restore-star.png`
- `public/sprites/generated/items/ristar/yellow-jewel.png`

### Seaman

Reference principale :
[manuel Seaman](https://www.digitpress.com/library/manuals/dreamcast/seaman.pdf)

- `public/sprites/generated/items/seaman/dreamcast-microphone.png`
- `public/sprites/generated/items/seaman/seaman-egg.png`
- `public/sprites/generated/items/seaman/seaman-shell.png`
- `public/sprites/generated/items/seaman/food-pellet.png`

## Contraintes de generation

Chaque prompt a impose :

- exactement un objet, ou une paire lorsque l'objet canonique est une paire ;
- la silhouette, les materiaux et la palette de l'objet de reference ;
- une vue trois-quarts lisible comme pickup et comme icone de collection ;
- un pixel art original net, sans copie directe d'un fichier officiel ;
- aucun personnage, aucune main, aucun decor et aucune duplication parasite ;
- aucun texte ajoute, logo, filigrane ou recadrage de l'objet ;
- un fond chroma uniforme retire avant export.

## Validation technique

- 24 fichiers sur 24 presents ;
- 24 fichiers sur 24 en `512 x 512`, mode `RGBA` ;
- plage alpha `0..255` sur chaque fichier ;
- 0 pixel chroma visible detecte apres nettoyage des bordures ;
- les objets sont complets, distincts, centres et non coupes ;
- controle visuel sur damier effectue pour les six packs ;
- chemins strictement conformes aux sorties du registre d'objets.

## Impact sur la couverture

| Mesure | Avant | Apres |
| --- | ---: | ---: |
| Objets disponibles dans l'audit | 40 | 64 |
| Objets manquants | 412 | 388 |
| Univers complets | 10 | 16 |
| PNG avec canal alpha | 40 | 64 |
| Entrees item disponibles dans le manifeste | 130 | 154 |
| Entrees disponibles totales dans le manifeste | 762 | 786 |
