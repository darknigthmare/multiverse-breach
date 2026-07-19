# Lot d'icones Streets of Rage - 2026-07-19

## Perimetre

Ce lot ajoute exactement quatre icones originales generees avec OpenAI
ImageGen :

- `public/sprites/generated/items/streets-of-rage/apple.png`
- `public/sprites/generated/items/streets-of-rage/roast-chicken.png`
- `public/sprites/generated/items/streets-of-rage/steel-pipe.png`
- `public/sprites/generated/items/streets-of-rage/police-badge.png`

Chaque sortie finale est un PNG RGBA de `512 x 512`. Aucun manifeste,
registre de prompts, fichier source, package ou etat Git n'a ete modifie.

## References officielles

- Manuel officiel SEGA Mega Drive Classics de Streets of Rage 2 :
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71165/manuals/04%20SOR2_PC_MG_EFIGS_US_v6.pdf?t=1733765070
- Index officiel des manuels SEGA Genesis Mini, qui reference Streets of
  Rage 2 :
  https://manuals.sega.com/genesismini/
- Page officielle SEGA Social de Streets of Rage 2 :
  https://social.sega.com/games/streetsofrage2/
- Manuel officiel SEGA Mega Drive Classics du premier Streets of Rage,
  utilise uniquement pour le renfort policier :
  https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71164/manuals/08%20SOR1_PC_MG_EFIGS_US_v6.pdf?t=1733765070

Le manuel de Streets of Rage 2 confirme que la pomme restaure une petite
partie de la jauge de vie et que le poulet roti la restaure entierement. Sa
planche d'objets montre le poulet entier sur une petite assiette bleu-blanc ;
cette incarnation visuelle a donc priorite sur la description locale
historique "sans assiette", sans modifier le code demande comme hors
perimetre.

Le meme manuel decrit les armes trouvees dans les objets cassables ou
abandonnees par les ennemis. Une capture officielle montre aussi des armes
tubulaires droites posees au sol. Le tuyau final reste donc un tube d'acier
simple, sans accessoire moderne.

Le badge n'est pas presente comme un pickup canonique de Streets of Rage 2.
Le manuel du premier jeu documente en revanche l'appui d'un policier et
l'objet `Special`, qui accorde une utilisation supplementaire du renfort.
Le badge est explicitement une interpretation originale de cette fonction :
aucun sceau, texte, logo ou insigne officiel n'est reproduit.

## Generation OpenAI

- Outil : OpenAI ImageGen integre.
- Nombre de generations : exactement quatre, une par objet.
- Sources : RGB `1254 x 1254`, sur fond chroma vert.
- Couleurs de fond echantillonnees automatiquement :
  `#14ed16`, `#05f715`, `#0df712` et `#0ff311`.
- Detourage : helper local
  `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`.
- Parametres : `--auto-key border --soft-matte
  --transparent-threshold 12 --opaque-threshold 96 --despill
  --edge-contract 1`.
- Normalisation : toile complete redimensionnee en `512 x 512` avec
  nearest-neighbor, puis RGB force a zero sous alpha nul.
- Aucune generation corrective ou variante supplementaire n'a ete lancee.

## Prompts envoyes

### Apple

> Use case: stylized-concept
>
> Asset type: square 16/32-bit pixel-art game HUD pickup icon
>
> Primary request: Create exactly one original fan-art red apple pickup
> inspired by the object identity and compact arcade readability shown in the
> official Streets of Rage 2 SEGA manual, without copying any official sprite
> pixels.
>
> Subject: one simple plump bright-red apple, complete and centered, short
> brown stem, warm yellow-white blocky pixel highlight, dark crimson lower
> shading; no leaf and no other object.
>
> Style/medium: highly polished late-16-bit / early-32-bit pixel art, crisp
> deliberate square pixel clusters, limited arcade palette, strong silhouette,
> readable at small HUD size; not vector, not 3D, not painterly, not smooth
> anti-aliased illustration.
>
> Composition: square canvas, one object only, centered, fully visible with
> generous empty padding, object occupies about 62% of the canvas.
>
> Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later
> removal. The background is one uniform color with no gradient, texture,
> floor, lighting variation, or reflections. Do not use green anywhere in the
> apple.
>
> Constraints: original fan art; no copied SEGA pixels; no character, person,
> hand, bite, plate, container, duplicate, text, letters, numbers, logo,
> trademark, watermark, border, frame, cast shadow, contact shadow, glow,
> scenery, decoration, or cropping.

### Roast Chicken

> Use case: stylized-concept
>
> Asset type: square 16/32-bit pixel-art game HUD pickup icon
>
> Primary request: Create exactly one original fan-art roast-chicken health
> pickup inspired by the object identity and compact arcade readability shown
> in the official Streets of Rage 2 SEGA manual, without copying any official
> sprite pixels.
>
> Subject: one whole intact roast chicken with golden-brown crisp skin, compact
> breast and two tucked legs, presented as one pickup on a shallow pale
> blue-white oval ceramic plate because the official manual incarnation
> visibly uses a plate. No garnish, cutlery, sauce cup, fries, packaging,
> bucket, sandwich, or modern fast-food styling.
>
> Style/medium: highly polished late-16-bit / early-32-bit pixel art, crisp
> deliberate square pixel clusters, limited warm arcade palette, strong
> silhouette, readable at small HUD size; not vector, not 3D, not painterly,
> not smooth anti-aliased illustration.
>
> Composition: square canvas, exactly one complete chicken-on-plate pickup,
> centered, fully visible with generous empty padding, pickup occupies about
> 68% of the canvas.
>
> Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later
> removal. The background is one uniform color with no gradient, texture,
> floor, lighting variation, or reflections. Do not use green anywhere in the
> chicken or plate.
>
> Constraints: original fan art; no copied SEGA pixels; no character, person,
> hand, extra food, duplicate, text, letters, numbers, logo, trademark,
> watermark, border, frame, cast shadow, contact shadow, steam, glow, scenery,
> decoration, or cropping.

### Steel Pipe

> Use case: stylized-concept
>
> Asset type: square 16/32-bit pixel-art game HUD weapon pickup icon
>
> Primary request: Create exactly one original fan-art steel pipe pickup
> suitable for a classic Streets of Rage-style urban beat'em-up, using the
> simple straight floor weapon silhouette visible in official SEGA Streets of
> Rage 2 material without copying any official sprite pixels.
>
> Subject: one plain straight unbent grey-blue steel pipe, complete from end to
> end, slightly scuffed with restrained street grime, one dark hollow circular
> opening visible at the nearer end, simple heavy beat'em-up weapon; no
> fittings, valve, wrench head, tape, spikes, blood, chain, or attached parts.
>
> Style/medium: highly polished late-16-bit / early-32-bit pixel art, crisp
> deliberate square pixel clusters, limited cool steel palette, strong
> silhouette, readable at small HUD size; not vector, not 3D, not painterly,
> not smooth anti-aliased illustration.
>
> Composition: square canvas, one object only, centered diagonally from
> lower-left to upper-right, fully visible with generous empty padding, pipe
> occupies about 72% of the canvas without touching any edge.
>
> Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later
> removal. The background is one uniform color with no gradient, texture,
> floor, lighting variation, or reflections. Do not use green anywhere in the
> pipe.
>
> Constraints: original fan art; no copied SEGA pixels; no character, person,
> hand, duplicate weapon, text, letters, numbers, logo, trademark, watermark,
> border, frame, cast shadow, contact shadow, glow, scenery, decoration, or
> cropping.

### Police Badge

> Use case: stylized-concept
>
> Asset type: square 16/32-bit pixel-art game HUD support pickup icon
>
> Primary request: Create exactly one original fan-art police reinforcement
> badge interpreted as a game pickup for Streets of Rage. It is an original
> visual metaphor for the police backup / Special Attack described in the
> official SEGA Streets of Rage manual, not a canonical Streets of Rage 2
> pickup and not a copy of any official sprite.
>
> Subject: one compact generic shield-shaped gold police badge with a blank
> deep-blue enamel inset and restrained silver-white pixel highlights,
> early-1990s arcade pickup readability. The center must be abstract and
> unmarked: no seal, star, eagle, crest, city name, department name, letters,
> numbers, or readable symbols.
>
> Style/medium: highly polished late-16-bit / early-32-bit pixel art, crisp
> deliberate square pixel clusters, limited gold/blue arcade palette, strong
> silhouette, readable at small HUD size; not vector, not 3D, not painterly,
> not smooth anti-aliased illustration.
>
> Composition: square canvas, one badge only, front three-quarter view,
> centered, complete and fully visible with generous empty padding, badge
> occupies about 64% of the canvas.
>
> Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later
> removal. The background is one uniform color with no gradient, texture,
> floor, lighting variation, or reflections. Do not use green anywhere in the
> badge.
>
> Constraints: original fan art; no copied SEGA pixels; no real-world or
> official police insignia; no character, person, hand, chain, holder,
> duplicate, text, letters, numbers, logo, trademark, watermark, border,
> frame, cast shadow, contact shadow, glow, scenery, decoration, or cropping.

## Validation automatisee

Le test de frange compte comme chroma visible tout pixel avec alpha non nul et
une dominance verte `G - max(R, B) >= 16`. Le test de composante utilise un
seuil d'alpha superieur a `8`.

| Fichier | Mode / taille | Boite alpha | Marges G/H/D/B | Alpha partiel | Chroma visible | RGB sous alpha 0 | Composantes |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| `apple.png` | RGBA 512x512 | 86,74 - 429,437 | 86 / 74 / 83 / 75 | 429 | 0 | 0 | 1 |
| `roast-chicken.png` | RGBA 512x512 | 32,86 - 485,410 | 32 / 86 / 27 / 102 | 631 | 0 | 0 | 1 |
| `steel-pipe.png` | RGBA 512x512 | 65,51 - 470,460 | 65 / 51 / 42 / 52 | 759 | 0 | 0 | 1 |
| `police-badge.png` | RGBA 512x512 | 82,38 - 430,467 | 82 / 38 / 82 / 45 | 847 | 0 | 0 | 1 |

Pour chaque fichier :

- plage alpha `0..255` ;
- alpha nul dans les quatre coins ;
- zero pixel opaque ou partiel sur le bord de la toile ;
- zero frange chroma detectee ;
- zero couleur cachee sous alpha nul.

## Controle visuel

Les quatre fichiers ont ete inspectes individuellement, puis ensemble sur un
damier de transparence et dans des emplacements HUD de `96 x 96`.

- un seul objet entier, centre et non coupe par image ;
- silhouettes distinctes et lisibles en taille HUD ;
- aucun personnage, main, texte, logo, bordure, ombre ou decor ;
- pomme rouge simple avec reflet arcade ;
- poulet entier dore sur l'assiette bleu-blanc de l'incarnation source ;
- tuyau d'acier droit, creux et sans accessoire ;
- badge or/bleu abstrait, sans sceau ni inscription ;
- aucune frange verte visible sur fond sombre ou clair.

## Integrite

| Fichier | Octets | SHA-256 |
| --- | ---: | --- |
| `apple.png` | 89564 | `65FB5F1573A3A9AB8ED059998E8F24C97C6DC07F4BEC5EC1AE3B00EB64C52320` |
| `roast-chicken.png` | 148574 | `C0C892A1B1D125349E16AC31AA7C4FBFE57E776445BACEA594CD84C612B425C9` |
| `steel-pipe.png` | 64332 | `32B41355E2CCF1781CAF71F69604BEA286A1B91B2F28F24C36A08D78F8848D2B` |
| `police-badge.png` | 148945 | `4F27D2407C88AF34F0332C282AC516FC83F0D3F870C7856E862F8AA2E51FA0A6` |
