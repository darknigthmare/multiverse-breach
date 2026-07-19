# Gunnm OpenAI Item Batch - 2026-07-19

## Scope

Four missing Gunnm collectible-item icons were generated with OpenAI ImageGen
as original pixel art:

- `public/sprites/generated/items/gunnm/damascus-blade.png`
- `public/sprites/generated/items/gunnm/motorball.png`
- `public/sprites/generated/items/gunnm/hunter-warrior-badge.png`
- `public/sprites/generated/items/gunnm/gally-s-cyborg-heart.png`

No character, enemy, stage, code, manifest, package, or Git metadata was changed
for this batch.

## Reference Sources

- Kodansha, *Battle Angel Alita, Volume 3*: official publisher description of
  the Motorball arc.
  <https://archive.kodansha.us/volume/battle-angel-alita-3/index.html>
- Kodansha, *Battle Angel Alita* spotlight: official manga editions and
  Yukito Kishiro artwork context.
  <https://kodansha.us/2019/02/05/10-years-of-kodansha-comicsfebruary-spotlight-battle-angel-alita-rightstuf-exclusive-pins-sweepstakes-more/>
- Prime 1 Studio, licensed *Alita "Gally"* statue: manga Gally and the long
  Damascus Blade silhouette and surface treatment.
  <https://www.prime1studio.com/baa-alita-gally-pmaba-03.html>
- Hot Toys Japan, licensed MMS520 Alita figure: cybernetic body materials,
  blade accessory, and removable heart component.
  <https://www.hottoys.jp/item/view/100007801.php>
- 20th Century Studios, *Alita: Battle Angel*: adaptation reference for the
  industrial Factory and Hunter-Warrior visual language.
  <https://www.20thcenturystudios.com/movies/alita-battle-angel>

Secondary cross-checks were limited to identifying details that are not
described by the publisher pages: the Damascus Blade's circular
weight-reduction holes, the Motorball's finger holes and moving protrusions,
and the Factory registration function. The generated graphics do not trace or
reproduce manga panels, screenshots, product photography, logos, or readable
credential text.

## Canon Design Decisions

### Damascus Blade

- Reforged single-blade configuration rather than the early paired forearm
  blades or the later giant balisong.
- Long, lightly curved profile with flowing Damascus-steel pattern.
- Circular weight-reduction holes retained as the main identifying feature.
- Compact mechanical base with no decorative fantasy guard.

### Motorball

- One dense mechanical competition sphere, not a vehicle or ordinary sports
  ball.
- Recessed finger holes and a small internal control switch are visible.
- Short articulated protrusions communicate the canonical random movement
  system without turning the silhouette into an explosive mine.

### Hunter-Warrior Badge

- Rugged Factory-issued industrial credential with clipped corners.
- Abstract registration bars and micro-marks remain intentionally unreadable.
- The Factory-like geometric authority mark is original and does not reproduce
  a licensed logo or printed prop graphic.

### Gally's Cyborg Heart

- Fully mechanical, self-contained artificial heart with titanium shells,
  copper conduits, and a protected warm power core.
- No flesh, blood, exposed organic tissue, or gore.
- Material language follows the licensed Alita cybernetic-body accessory while
  remaining an original pixel-art interpretation.

## Generation And Processing

- Generator: OpenAI ImageGen, one isolated generation per object.
- Source backdrop: flat green chroma key.
- Chroma removal:
  `remove_chroma_key.py --auto-key border --soft-matte --despill --edge-contract 1`
- Final resize: Pillow LANCZOS to `512x512`.
- Transparent pixels were normalized to `(0, 0, 0, 0)`.
- Residual pixels with alpha `<= 4` were cleared to remove invisible key-color
  fringe.

## QA Results

| File | Format | Alpha | Margins L/T/R/B | Hidden RGB | Green fringe | SHA-256 |
| --- | --- | --- | --- | ---: | ---: | --- |
| `damascus-blade.png` | 512x512 RGBA | 0-255 | 20/21/21/23 | 0 | 0 | `606994ab353a1de62a9751b514dc4b6e11464f041ddae3a18dd8ed2f176e22b1` |
| `motorball.png` | 512x512 RGBA | 0-255 | 24/33/22/37 | 0 | 0 | `1d6804b1eadf6c0a71fcd22d4a99f9f710a2a10b2bb60c8ed0f26932e7da7feb` |
| `hunter-warrior-badge.png` | 512x512 RGBA | 0-255 | 75/20/76/19 | 0 | 0 | `fd5abd6466b69407d071eb8d97a6dbe60171af5b49f48890e6d90fa801fb024c` |
| `gally-s-cyborg-heart.png` | 512x512 RGBA | 0-255 | 68/33/66/37 | 0 | 0 | `6d8c16a982f10784cb7c31429482e19860a9a06b40bb8806ca692a6f0818e71f` |

Visual inspection confirmed one complete object per icon, no cropping, no
character or hand, no readable text, no logo, no frame, no shadow, and no
visible chroma contamination.
