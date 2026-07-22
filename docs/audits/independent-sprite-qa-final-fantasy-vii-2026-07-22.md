# Independent Final Fantasy VII sprite QA - 2026-07-22

## Verdict

**PASS with one non-blocking continuity caveat - 17/17 files technically
valid, 272/272 cells occupied.**

- Blocking visual or canonical error: none.
- PNG regenerated or edited: none.
- JavaScript, JSON, manifest, and prompt files edited: none.
- This report is the only file created by this QA pass.

## Independent method

All 17 final PNG sheets were opened individually with `view_image` at original
detail. The 16 cells of each sheet were checked for identity, equipment,
anatomy, pose continuity, clipping, cross-cell leakage, visible chroma, and
unrelated subjects. A separate pixel scan then measured the final files; it did
not reuse the production report's verdict.

The character and equipment checks used Square Enix's
[official FFVII portal](https://na.finalfantasy.com/titles/finalfantasy7), the
[official legacy PC character page](https://finalfantasyviipc.square-enix-games.com/en),
and Square Enix's
[original-versus-Remake comparison](https://na.finalfantasy.com/topics/158).
The supplied local 1997 character art and PS1 battle-model renders in
`.codex-ff7-refs/` were used for enemy and transformed-boss silhouettes.

## Pixel results

Every file independently passed all common checks:

- PNG, exactly `1024x1024`, source mode `RGBA`, alpha range `0..255`;
- strict `4x4` layout of `256x256` cells and `16/16` occupied cells;
- minimum internal margin `12 px` in every one of the 272 cells at `alpha > 12`;
- zero visible pixels in any cell's 12 px guard bands;
- transparent outer border (`border alpha max = 0`) and transparent corners;
- zero non-zero hidden RGB pixels where `alpha = 0`;
- zero visible pixels within RGB distance 48 of either standard chroma key
  `#00ff00` or `#ff00ff`;
- no clipping, cross-cell bleed, printed grid, text, watermark, mixed identity,
  or unrelated subject observed with `view_image`.

## Per-sheet visual QA

| File | Independent visual and canon check | Verdict |
|---|---|---|
| `heroes/final-fantasy-vii/cloud-ff7.png` | Stable 1997 Cloud: blond spikes, purple SOLDIER-style clothing, single pauldron and Buster Sword. Full sword and attack arcs remain inside their cells. | **PASS** |
| `heroes/final-fantasy-vii/tifa-ff7.png` | Stable 1997 Tifa: white top, black skirt, red gloves/boots and hand-to-hand attacks; no later outfit or identity drift. | **PASS** |
| `heroes/final-fantasy-vii/aerith-ff7.png` | Pink dress, red jacket, braid/ribbon and staff remain coherent through locomotion, strikes and hit poses. | **PASS** |
| `heroes/final-fantasy-vii/barret-ff7.png` | Barret's build, brown vest, green trousers and right-arm gun prosthesis remain readable and correctly distinct from a generic gunner. | **PASS** |
| `heroes/final-fantasy-vii/redxiii-ff7.png` | Stable quadruped anatomy, orange coat, mane, markings, bands and flaming tail; no extra creature or missing tail flame. | **PASS** |
| `heroes/final-fantasy-vii/yuffie-ff7.png` | Stable 1997 ninja outfit and oversized four-point shuriken in all 16 cells; no weapon or identity substitution. | **PASS** |
| `heroes/final-fantasy-vii/vincent-ff7.png` | Red cape/headband, black clothing, gold claw and handgun remain coherent; hit poses do not change identity. | **PASS** |
| `bosses/final-fantasy-vii/shinra-soldier.png` | Matches the supplied blue-armored SOLDIER:3rd-style PS1 model with helmet, pauldrons and broad sword. | **PASS** |
| `bosses/final-fantasy-vii/guard-scorpion-drone.png` | Preserves the original Guard Scorpion's red/orange chassis, six-legged stance, claws, cannon arms and raised tail. | **PASS** |
| `bosses/final-fantasy-vii/midgar-zolom.png` | Stable giant cobra silhouette, hood, green segmented body and red side stripe; coils, bite and hit poses remain one creature. | **PASS** |
| `bosses/final-fantasy-vii/shinra-guard.png` | Matches the supplied original blue Grunt model: single red eye, silver helmet and two clawed forearms, not a Remake infantry trooper. | **PASS** |
| `bosses/final-fantasy-vii/sweeper-machine.png` | Stable original Sweeper chassis, brown armor, top gun and four pointed mechanical legs; no limb-count drift. | **PASS** |
| `bosses/final-fantasy-vii/tonberry-stalker.png` | Canonical Tonberry silhouette with green hood, tan robe, one lantern and one knife; no duplicate props or extra subject. | **PASS** |
| `bosses/final-fantasy-vii/safer-sephiroth.png` | Distinct transformed final form with halo, dark upper wing and pale lower wings, closely matching the supplied 1997 battle model. | **PASS** |
| `bosses/final-fantasy-vii/jenova-birth.png` | Stable Jenova BIRTH form with pale shell, crescent shoulder masses, dark tendrils and purple lower body. | **PASS** |
| `bosses/final-fantasy-vii/sephiroth-one-winged.png` | Stable human Sephiroth identity, 1997 black coat/silver pauldrons, long silver hair and Masamune. The added black wing is deliberate in the named asset but is not the strict human form shown in the 1997 original. | **PASS - continuity caveat** |
| `bosses/final-fantasy-vii/jenova-synthesis-core.png` | Closely tracks the supplied PS1 central Synthesis model: shell-like core, purple crest, face and paired curved appendages. | **PASS** |

## Continuity caveat

`sephiroth-one-winged.png` mixes the 1997 human costume with later visible
one-wing imagery. Square Enix's official 1997 character material presents human
Sephiroth with Masamune and no anatomical wing, while
[Square Enix separately uses the one-wing motif in later franchise and Advent Children material](https://na.finalfantasy.com/topics/204).
The
runtime target itself is explicitly named `Sephiroth One-Winged`, and the
canonical 1997 winged final form already has its own `safer-sephiroth.png`
sheet. Regenerating only this PNG would therefore either preserve the same
caveat or contradict the declared target. It is recorded as a non-blocking
data-level continuity exception, not as a sprite-generation defect.

No file met the threshold for regeneration.
