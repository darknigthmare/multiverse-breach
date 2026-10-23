# Wave 8 Part C: Metal Gear Rising 2013

Five native presentation atlases supply 160 distinct poses. Five separate base atlases supply 80 distinct poses. Each selected cell was inspected in the original source and normalized contact sheet. All PNGs retain alpha, ten transparent margin pixels and a 244-pixel packing baseline.

Fourteen image generation calls are archived: five initial presentation sources, three presentation corrections, five base sources and one base correction. Armstrong’s cropped outro and victory poses were replaced by twelve full-body native poses. Monsoon’s missing-body and broad-debris final/super rows were replaced by eight complete-actor native poses. Mistral’s four base attack poses were replaced to remove a native opaque seam crossing. Superseded rows and exact prompts remain archived.

The effective kits determine the actions: Blade Wolf’s tail chainsaw, Sam’s Murasama iai, Armstrong’s ground-punch shockwave, Mistral’s physical L’Étranger spiral and Monsoon’s magnetic metal assault. No quotes are presented as powers. Blade Wolf remains a quadruped. No victim body or gore appears.

`part-c-stature-review.json` and `base-part-c-stature-review.json` record body/chassis ROIs and native posture ratios. Corrections change renderer metadata only; PNG hashes remain unchanged. Different native source densities use an explicit recovery/guard pose bridge, with no division of uncalibrated cross-source heights. Bent poses retain their actual native proportions.

`part-c-source-facts.json` distinguishes readable official documentation from indexed secondary facts and inaccessible direct pages. Old incomplete or incorrect local equipment is recorded as context or a counter-example. These generated animations are authored adaptations. No source-game frame provenance, official pixel fidelity or 1:1 certification is claimed. Missing provider model/job/generation IDs remain null.

Reproduce and verify with `node scripts/buildCombatCharacterAnimationsWave8PartC.mjs --check` and `node scripts/buildCombatCharacterSpriteCorrectionsWave8PartC.mjs --check`. The builders verify PNG/source/reference/prompt hashes, exact native row reconstruction, distinct RGBA cells, margins, alpha, lineage and measured scale formulas.
