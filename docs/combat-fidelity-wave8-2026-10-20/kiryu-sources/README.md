# Kiryu — Kiwami2016 native45

Six independent image_gen calls drew180 native poses: three8-state motion/defense atlases, two8-state combat atlases and one5-state ledge atlas. Each state has four distinct drawings. The ledge atlas reserves three transparent rows; those cells are not counted as poses. No source needed correction or replacement.

The references, exact tool arguments/prompts and originals are retained. Unknown provider model/job/generation IDs are null. This is generated adapted choreography, not official extracted frames or certified1:1 source-game animation.

Every native source receives one body calibration, one pixel scale and one render factor. The common effective standing body is190px. Ledge raised arms require a small source-wide safety adjustment:188.76px packed body ×1.0065691883873702 at render. Crouches, tucked jumps and KOs preserve their actual source projections. RGBA cells are256×256, baseline244, transparent margins at least10px.

Full45 `special` and `chargeRelease` show the ordinary secondary **Combinaison rapprochée de Kiryu**. The dedicated32 presentation of **Coup du Dragon de Dojima** remains distinct. Attacks, parries and ledge traversal use physical bare hands/feet; no weapon, magical dragon/tiger or ranged body substitute is drawn.

`hand-measurements.json` records20 primary ledge anchors and visible supporting/free hands. Catch0 is explicitly precontact; the remaining Catch/Hang/Climb primary contacts number11. Drop/Jump preserve attachment for frames0–1 and mark frames2–3 released. Twelve actual palms and twelve adjoining wrists are reviewed in the annotated crops: all24 9×9 RGBA neighborhoods contain81/81 visible pixels, and palms contain69–81 skin-colored pixels. Annotations exist only in documentation crops, never in the served PNGs.

Reproduce from repository root:

```sh
node docs/combat-fidelity-wave8-2026-10-20/kiryu-sources/normalize-kiryu-atlases.mjs --check
node docs/combat-fidelity-wave8-2026-10-20/kiryu-sources/verify-kiryu-atlases.mjs
```

`native-evidence.json` hashes inputs, served outputs, registries, checks and contact proofs. Runtime/index/wrapper files were not edited by this art lot. Browser harnesses are prepared separately and require integration before execution.
