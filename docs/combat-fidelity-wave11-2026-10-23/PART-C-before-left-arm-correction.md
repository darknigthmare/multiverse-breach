Part C delivers ten original Borderlands2009/FuryRoad2015 presentation sheets and ten new ordinary movement/action sheets:320+160 retained native poses in20 public PNGs. No previous PNG, historical baseline, shared renderer, engine or package was changed by this part.

All bodies and pose changes came from real `image_gen` calls. The23 source files contain524 drawings;480 are retained and44 excluded. The first Furiosa32 uses the wrong all-black rifle and is rejected. A full native SKS correction supplies six rows; its two edge-touching intro/roundVictory rows are replaced by a further native8-pose strip. Toast's first standing super recovery had cut toes and its whole four-pose row is replaced natively. Sources, exact arguments/prompts, actual reference inputs, receipts, rejected rows and SHA lineage remain archived. No provider model/job/generation IDs were supplied; those fields remain null. The remaining source-edge scan has zero clipped pixels on every retained native row. Background RGB under zero-alpha pixels is not an opaque background; decoding and border checks use real alpha.

The four physical supers are Mordecai's sniper rifle, Roland's equipped assault rifle, Max's sawed-off double barrel and Furiosa's scoped wood-stock SKS. The24 manually located real gun-barrel origins have center alpha223–249 and at least41/81 visible pixels in their actual9×9 neighborhoods. Recovery column3 is null. Brick's fists and Lilith's local Phasewalk require no gun origin. Claptrap, Nux, Toast and Capable have only service, maintenance, ammunition readiness or safe-passage support supers: no damage, healing laser, magical shield body or invented vehicle.

Human standing reference bodies use the project190px calibration. The small CL4P-TP remains a box on one wheel and uses an explicit120px antenna-to-wheel project reference, not a claimed canon height. Per-source density and genuine bends/knelt postures are preserved. Two corrective-source density changes use documented standing-pose bridges. `renderScale` scales the entire original cell around baseline244; it never redraws anatomy or clips weapons. The raw normalized contact sheets precede this renderer-only scale and must not be mistaken for final stature screenshots.

Source facts and access limits are in `part-c-source-facts.json`. The old blue-beret Roland, axe-bearing Brick and male-explorer Toast remain historical counterexamples, not costume authority. Official full-resolution concept images were inaccessible; no claim is made that they were inspected. These are authored visual/gameplay adaptations. Source1:1 fidelity and complete official animation reconstruction remain unverified.

Reproduce technical checks with:

```sh
node scripts/buildCombatCharacterAnimationsWave11PartC.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave11PartC.mjs --check
node docs/combat-fidelity-wave11-2026-10-23/part-c-source-edge-audit.mjs
```

The new global `scripts/combatFidelityWave11.test.mjs` independently checks frozen W10 hashes, actual new RGBA cells, live renderer selections on both sides, timelines/pause, genuine hand anchors and retained refusal/fallback limits. Root owns final browser/build integration.
