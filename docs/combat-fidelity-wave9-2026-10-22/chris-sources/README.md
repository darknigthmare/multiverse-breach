# Chris Redfield full melee set — Wave 9

Chris uses the standard BSAA appearance from **Resident Evil 5 (2009)**: olive tactical vest, light short-sleeved shirt, dark cargo trousers, boots, fingerless gloves and a thigh M92F holster. The inspected local reference is archived unchanged as `chris-reference-original.png`.

The delivery contains **45 separate state rows, 180 retained native drawings and six RGBA PNGs**. Eight actual image generation calls produced 200 observed drawings. All original PNGs, exact prompts and tool arguments are archived; unknown model, job and generation identifiers remain null. These are generated adapted animations, not official game frames or certified 1:1 reproductions.

Four initial sources each contained seven rows. The first corrective source supplies jumpApex, perfectShield, crouchLight and a readable grounded-to-airborne jumpStart. Its downward kick was subsequently replaced. A second corrective source supplies aerialNeutral, aerialForward, aerialDown and ledgeAttack with an actual M92F, matching the existing simple-slot profile. The original three airborne physical attacks, physical ledge attack, initial jumpStart and first corrective downward kick are explicitly listed as **20 discarded drawings**. No rejected drawing is counted in the retained 180, and no pose was duplicated, mirrored or procedurally drawn.

Each source has one documented crown-to-sole body calibration targeting 190 effective rendered pixels. The hanging source excludes raised arms from its body measurement. The two corrective sources have their own upright calibration, preserving their independent native resolution. Each source uses one nearest-neighbor pixel scale and one render factor; short crouches and airborne projections retain their native ratios. Every output uses 256-pixel cells, a bottom-exclusive baseline of 244 and at least ten pixels of transparent margin. The ledge output has five real rows and three empty rows that are not counted as poses.

M92F light, crouched and airborne shots use one physical compact pistol. Aerial shooting and ledge traversal are explicitly crossover adaptations; canonical RE5 jumping is not claimed. The get-up shot draws the pistol after the supporting hand has released the edge. Straight remains the close physical secondary in special/chargeRelease. Guard and movement keep the pistol holstered. Catch/Hang/Climb have free fingerless-gloved hands with connected visible wrists. Satellite Laser belongs to the separate 32-pose presentation and its external designator, rather than these 45 states.

The 12 palm pads and 12 adjoining wrists were located anatomically in native artwork and normalized review grids. Native source coordinates are preserved in `hand-measurements.json`. All 24 normalized and all 24 native 9×9 neighborhoods contain 81/81 visible pixels; glove pads are correctly dark, with exposed fingers visible nearby. The first catch is precontact. Drop releases after frame 1; jump releases at frame 1, matching the real drawings. Green/yellow documentation boxes mark palm/wrist centers without changing served images. These are project contact measurements, not official game anchors.

The wrapper is a strict additive registration. `manifest-validation.json` proves the seven older full manifests remain deeply equal to their saved values. Visuals add no collisions, projectiles or damage. The existing M92F simple-slot runtime uses impact-time range resolution rather than a physically tracked bullet; that gameplay implementation was left intact.

Reproduction and verification, from the repository root:

```sh
node docs/combat-fidelity-wave9-2026-10-22/chris-sources/normalize-chris-atlases.mjs --check
node docs/combat-fidelity-wave9-2026-10-22/chris-sources/verify-chris-atlases.mjs
```

`actual-tool-calls.json` records the eight real requests and returned original file paths; these path names are not misrepresented as generation IDs. `normalization-result.json`, `check-all-result.json`, `validation-all.json`, `grip-pixel-checks.json`, `native-hand-pixel-checks.json` and `native-evidence.json` preserve the measured counts, frame lineage, hashes and contact proof. Browser evidence is stored in the adjacent `browser/` directory.

Small costume/anatomy variations and source-game timing differences remain possible. No official pixel, anatomy, continuity or frame-by-frame 1:1 certification is claimed.
