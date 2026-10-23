# Guilty Gear Xrd REV 2 — Part C

Five native32-pose presentation atlases and five native16-pose base atlases, keyed only by `may_gg`, `dizzy_gg`, `millia_gg`, `axl_gg`, `baiken_gg`. Total:240 distinct finalRGBA poses in10PNG files. All earlier assets remain separate and unchanged.

The presentation order is intro, outro, roundVictory, roundDefeat, fatality, victory, defeat, super. Bases use idle, run, attack, hit. Output cells are256square, four columns, full transparency, baseline244 and at least10px clear margins. The builders independently decode pixels, check unique cell hashes and reconstruct every finalPNG from its stated archived native source rows.

Sixteen actual image_gen calls are preserved:9 presentation sources and7 base sources. These comprise five initial32-pose atlases; two May corrective strips; one complete Baiken replacement; one Dizzy action correction; five initial16-pose bases; and two basicattack corrective strips. No anatomy was drawn, mirrored or procedurally posed by Sharp. Initial Baiken32 is rejected for an extra hand. May's original blue whale rows are superseded; the pink correction's unused super row is archived because runtime now supplies the partner independently. Dizzy action rows and Millia/Baiken basicattack rows were natively redrawn when alpha-seam checks found overlapping opaque artwork. Each accepted row identifies its exact sourcePNG/SHA/native row; unused attempts remain archived with reasons.

May's super row shows only her call gesture/water; her final presentation can show the pink whale. Dizzy includes sentient Necro/Undine bodies, not mere generic feathers. Millia uses scalp-connected hair blades/wings. Axl uses linked physical sickles and SickleStorm, no firearm or time stop. Baiken's accepted32 and16 show one functional katana arm and an empty opposite sleeve. An independent review confirmed the corrected one-arm silhouette. Exact eye laterality/tsuba-eyepatch detail cannot be established in every tiny cell and is not certified.

Stature reviews store25 explicit human-bodyROI measurements and renderer-only row scales. Weapon/guardian/VFX extents do not define human height. Original-source comparisons preserve native crouch/dive ratios. Corrective images with different pixel densities use a declared comparable recovery/guard pose bridge, rather than dividing unrelated source-pixel heights. The source and normalizedROIs are approximate visual measurements; the images themselves are unchanged by these metadata. Projected stature contacts are under `part-c-stature-contacts` and `base-part-c-stature-contacts`.

Local references were inspected before generation. Indexed secondary-source text was read with the native web search tool and archived under `part-c-source-access`; failed direct accesses are separately recorded. This evidence establishes the chosen version/move descriptions, not official animation timings or exact game-frame anatomy. All global canonical1:1/network-verification flags remainfalse, and model/generation/job IDs remainnull where the image tool did not supply them.

Checks:

- `node scripts/buildCombatCharacterAnimationsWave7PartC.mjs --check`
- `node scripts/buildCombatCharacterSpriteCorrectionsWave7PartC.mjs --check`
