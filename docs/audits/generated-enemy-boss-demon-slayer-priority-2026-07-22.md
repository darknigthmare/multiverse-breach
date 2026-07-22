# Lot prioritaire ennemis et boss Demon Slayer - 2026-07-22

## Perimetre livre

Ce lot installe quatre planches pixel-art originales fan-made pour l'univers
`Demon Slayer`. Les images officielles ont uniquement servi a verrouiller les
silhouettes, les couleurs, les vetements, les armes et les relations entre les
personnages. Aucun screenshot ni asset officiel n'est livre dans le jeu.

| Role | Sujet | Fichier final |
|---|---|---|
| Ennemi | Hand Demon | `public/sprites/generated/bosses/demon-slayer/hand-demon.png` |
| Ennemi | Swamp Demon | `public/sprites/generated/bosses/demon-slayer/swamp-demon.png` |
| Ennemi de groupe | Spider Demon Family | `public/sprites/generated/bosses/demon-slayer/spider-demon-family.png` |
| Boss duo | Daki and Gyutaro | `public/sprites/generated/bosses/demon-slayer/daki-and-gyutaro.png` |

Chaque fichier final respecte le contrat moteur suivant :

- PNG `RGBA` de `1024x1024` ;
- grille implicite stricte `4x4`, cellules de `256x256` ;
- ligne 1 `idle`, ligne 2 `run`, ligne 3 `attack`, ligne 4 `hit/defeat` ;
- marge visible minimale de `12 px` dans chaque cellule ;
- fond transparent, sans ligne de grille, texte, logo ni watermark.

## References officielles consultees

- [Portail officiel des personnages de l'anime](https://kimetsu.com/anime/character/risshihen/?chara=12) : liste et visuels du Hand Demon, du Swamp Demon, de Rui et des membres pere, mere, frere et soeur de la famille araignee ;
- [Fiche officielle du Hand Demon](https://kimetsu.com/anime/risshihen/character/?chara=teoni) : identite et silhouette du demon enferme au mont Fujikasane ;
- [Episode 15 officiel - Mount Natagumo](https://kimetsu.com/anime/risshihen/story/?story=15) : contexte visuel et narratif de la famille araignee ;
- [Fiche officielle Daki - Entertainment District](https://kimetsu.com/anime/yukakuhen/character/?id=13) : visage, cheveux, tenue d'oiran demon et obi ;
- [Personnages DLC officiels du jeu](https://game.kimetsu.com/hinokami/character/paid_update.html) : apparences de combat de Daki et Gyutaro, faucilles et relation de fratrie ;
- [Episodes officiels Entertainment District](https://www.aniplex.co.jp/lineup/kimetsu_yukaku/story/) : apparition commune du duo, attaques d'obi, faucilles empoisonnees et decapitation simultanee.

Les fichiers temporaires de reference `daki.jpg` et `gyutaro.jpg` ont ete
inspectes avant le nouvel appel ImageGen. Ils ne sont pas conserves apres QA.

## Prompts de production

Les trois premieres sources ImageGen existaient deja sous forme de PNG RGB de
`1254x1254`. Un PNG ne conserve pas le texte de requete de l'appel OpenAI : les
trois blocs suivants documentent donc fidelement le contrat de production
reconstruit et valide visuellement, sans le presenter comme une metadonnee
extraite du fichier.

### Hand Demon - contrat documente

```text
Create one original fan-made 4x4 pixel-art animation sheet for the canonical
Hand Demon from Demon Slayer Final Selection. Keep the same huge olive-grey,
obese demon in all 16 cells, with the body wrapped in many human arms, yellow
eyes, red nails and a toothed face. Exactly one complete subject per cell.
Rows: idle, heavy crawl/run, multi-arm attack, hit/collapse. Side battle view,
consistent scale and identity, crisp detailed pixel art, generous padding.
Flat solid magenta chroma background. No grid, text, extra character, crop,
generic armor, weapon or scenery.
```

### Swamp Demon - contrat documente

```text
Create one original fan-made 4x4 pixel-art animation sheet for one canonical
Swamp Demon body from Demon Slayer. Keep the same horned, pale-grey male demon,
long dark hair, red eyes, sleeveless dark outfit and purple sash in all cells.
Its movement and attacks emerge from a connected black-purple swamp portal.
Exactly one complete subject per cell. Rows: idle, run/submerge, swamp attacks,
hit/dissolve. Side battle view, consistent anatomy and clothes, crisp detailed
pixel art, generous padding. Flat solid green chroma background. No grid, text,
extra person, crop, unrelated magic, weapon or scenery.
```

### Spider Demon Family - contrat documente

```text
Create one original fan-made 4x4 pixel-art group animation sheet for the
canonical Spider Demon Family at Mount Natagumo. Every cell keeps the same
readable family group: large dark father, spider-bodied brother, pale mother
and sisters in white kimono, coherent faces, colors, silk threads and spider
anatomy. One consistent group entity per cell, never unrelated replacements.
Rows: idle, advance, coordinated silk/venom attacks, shared damage/defeat.
Detailed pixel art, full group inside every cell, generous padding. Flat solid
magenta chroma background. No grid, labels, humans, scenery or crop.
```

### Daki and Gyutaro - prompt exact du nouvel appel OpenAI ImageGen

```text
Use case: stylized-concept
Asset type: production-ready 2D pixel-art game sprite sheet for Multiverse Breach
Primary request: Create one complete square 4 columns x 4 rows sprite sheet of the inseparable Demon Slayer Entertainment District Upper Rank Six duo, Daki and Gyutaro. This is an original fan-made pixel-art rendition informed by the two official visual references, not a copy of any screenshot.

CANON IDENTITY LOCK:
- EVERY ONE of the 16 cells contains EXACTLY TWO distinct full-body characters: Daki AND Gyutaro together. Never one alone. Never three. No clones, substitutions, or merged bodies.
- Daki remains the same adult demon woman in all cells: tall/slender, very pale skin, long black hair with lime-green ends, floral facial markings, green eyes, ornate red/gold hair ornaments, canon black/magenta Entertainment District demon kimono/obi costume, long pink patterned obi sashes as her weapon.
- Gyutaro remains the same adult demon man in all cells: extremely gaunt and hunched, grey-green skin with irregular dark blotches, messy black hair with lime-green tips, yellow/orange eyes, sharp teeth, bare marked torso, loose dark red trousers, holding exactly two jagged blood sickles.
- Keep their faces, outfits, colors, relative scale, handedness, and equipment consistent across all 16 cells. Daki is slightly taller upright; Gyutaro is hunched and lean. Do not sexualize beyond the canon costume.

SHEET CONTRACT:
- perfectly square image, exact implicit 4x4 layout, 16 equal cells, no visible grid lines
- each cell is independent and contains both complete figures with generous safe padding; no hair, obi, sickle, limb, or effect crosses a cell boundary
- side-view action-game perspective, generally facing right
- Row 1: four progressive idle frames, Daki's obi floating gently and Gyutaro crouched with twin sickles
- Row 2: four progressive synchronized run/advance frames, both moving right
- Row 3: four progressive coordinated attack frames, Daki lashes her patterned obi while Gyutaro slashes with twin blood sickles; restrained red blood-blade effects contained inside each cell
- Row 4: four progressive shared hit/defeat frames, stagger to kneel/collapse; both remain visible, distinct, and together in every cell
- no repeated identical frames

VISUAL STYLE:
- richly detailed hand-crafted 16-bit/32-bit hybrid pixel art, crisp pixel clusters, controlled anti-aliasing, dramatic anime proportions, game-readable silhouettes
- consistent upper-left light and palette
- no photorealism, smooth vector art, painterly blur, or 3D rendering

CHROMA BACKGROUND:
- perfectly flat uniform solid #0000FF across the whole canvas
- no gradient, texture, floor, shadows, reflections, glow, smoke, scenery, text, labels, logos, watermark, borders, separators, UI, or visible grid
- no #0000FF in either character or effects

ABSOLUTE AVOID:
- fused sibling body, missing sibling, extra person, duplicate Daki, duplicate Gyutaro
- wrong clothing, modern clothing, swords, guns, generic demon armor
- cropped feet/hair/obi/sickles, touching neighboring cells
- labels, captions, Japanese text, numbers, checkerboard, panels, decorative frame
```

Cet appel OpenAI ImageGen est distinct des trois sources existantes. Le duo a
ete controle visuellement avant detourage : chacune des seize cellules contient
exactement deux personnages, Daki et Gyutaro, sans fusion ni remplacement.

## Post-traitement

1. Les quatre sources RGB de `1254x1254` ont ete inspectees avant traitement.
2. Le fond magenta de Hand et Spider, le fond vert de Swamp et le fond bleu du
   duo ont ete retires avec le helper OpenAI `remove_chroma_key.py` :
   `--auto-key border --soft-matte --transparent-threshold 12
   --opaque-threshold 220 --despill --edge-contract 1`.
3. `scripts/normalizeGeneratedSpriteSheet.py` a reconstruit les cellules,
   rattache les petits effets a leur sujet, redimensionne au pixel et recentre
   chaque contenu avec une marge minimale de `12 px`.
4. Tous les pixels totalement transparents ont ete remis a RGB noir afin
   d'eliminer le chroma cache.
5. Les sorties finales ont ete inspectees sur fond transparent sombre.

## QA technique finale

Le masque visible utilise le seuil `alpha > 12`. Le residu chroma est mesure a
une distance RGB inferieure ou egale a `40` de la cle echantillonnee.

| Fichier | Cellules | Uniques | Marge min. | Garde | Bord | Alpha `0 / partiel / 255` | Chroma | RGB cache | SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `hand-demon.png` | 16 | 16 | 12 px | 0 | 0 | 607189 / 48132 / 393255 | 0 | 0 | `597c1e18274af8dae400eeca894fcb89b1be59bdab0347ccb5b0a10ca4516827` |
| `swamp-demon.png` | 16 | 16 | 12 px | 0 | 0 | 713283 / 57811 / 277482 | 0 | 0 | `6d54c9b1fd7e91c1c93267cbbafa2787f2ad6b989c53a1b54c65dee3e751ce87` |
| `spider-demon-family.png` | 16 | 16 | 12 px | 0 | 0 | 644346 / 151906 / 252324 | 0 | 0 | `6a25379db2172016adf6a9eb8e930f05ac0c8c70d29d1c84af01962a6fad9be3` |
| `daki-and-gyutaro.png` | 16 | 16 | 12 px | 0 | 0 | 750693 / 119651 / 178232 | 0 | 0 | `111661bb34139de1da4f2bb8560449396cbf97966996432fc9d30ffb4a4d9c09` |

Controles communs reussis :

- dimensions exactes `1024x1024`, mode `RGBA`, alpha `0..255` ;
- seize cellules non vides et seize contenus binaires distincts ;
- aucun pixel visible dans les douze pixels de garde ou sur le bord externe ;
- aucun residu vert, magenta ou bleu visible ;
- aucun RGB non nul sous un alpha nul ;
- aucun membre, arme, obi, fil ou effet ne traverse une cellule ;
- Daki et Gyutaro sont tous les deux presents dans chacune des 16 cellules ;
- les pixels bleu sombre du pantalon de Gyutaro restent visibles apres le
  detourage du fond bleu (`39354` pixels de teinte sombre conserves).

## Hors perimetre

Aucun manifeste, registre, fichier de code, fichier musical ou commit n'a ete
modifie ou cree par cette reprise Demon Slayer.
