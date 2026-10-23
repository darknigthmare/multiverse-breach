# Wave6 Part B native art review —2026-10-20

Five presentation atlases supply160 distinct accepted cells; three basic corrections supply48 distinct accepted cells. All eight final PNGs are RGBA with256×256 cells, baseline244 and at least10 transparent pixels at every cell edge. The two dedicated builders reconstruct the final pixels from archived native source rows and check their SHA256, row lineage, distinct cell hashes and alpha margins.

Eleven actual image_gen calls produced these files: five initial presentation atlases, two presentation corrections, three initial basic atlases and one basic attack-row correction. Model, generation ID and job ID are null because the tool did not provide them. Sharp performs only extraction, nearest-neighbour normalization, alpha padding, packing and review contacts. No limb, anatomy, pose or machine body is drawn procedurally.

- Dante: human late-game DMC5 presentation, with genuinely drawn Sin Devil Trigger bodies for Judgement in the finale/super sequences. The local older silver sword is only an approximate identity reference; newly drawn Devil Sword Dante/form details remain an adaptation.
- Nero: late/postgame DMC5 version, regenerated flesh right forearm in the human phases, Red Queen and holstered Blue Rose; Showdown uses Nero's own drawn Devil Trigger body and blue spectral wing-arms. A first native correction replaces six human rows and super, preserving the original four finale cells. Its unused finale row has six opaque pixels at the external right edge and is explicitly excluded from final lineage. A second correction, for the basic atlas only, replaces the four overlapping attack cells.
- Lady: DMC3 white blouse, short plaid skirt, tall boots and original Kalina Ann. The presentation depicts a mechanical rocket launch; basic attack depicts her pistols with the launcher carried. No demon transformation or medical effect.
- Parasoul: black turtleneck/short-skirt silhouette, no crown, living umbrella Krieg. Physical Black Egrets are actually drawn in the Inferno Brigade showcase; basic attack uses Krieg. The old crown/rifle bitmap is retained unchanged and archived as the discrepancy reference.
- Big Band: actual large instrumental cyborg body and brass mechanisms, maintaining the project's inspected navy/brass palette. No official default-palette number is asserted. Four new compact Super-Sonic Jazz poses replace the original row whose instruments/effects overlapped adjacent cells.

Fifty-two explicit body-only ROI reviews accompany renderer-scale metadata. Measurements exclude weapons, wings, soldiers, rear instruments and effects. Scale correction accounts for source pixel density, especially Big Band's2172-wide native correction versus the887-wide initial source. It preserves native body-height ratios, leaning, crouching and the244 baseline; PNG hashes do not change when stature metadata is applied.

The local references were opened with view_image before each initial generation and every accepted correction was visually inspected. External character pages attempted in this environment returned403 and were unreadable; part-b-source-access.json records that limitation without invented quotations. Canonical frame timing, complete visual1:1 fidelity and external verification remain false. These images are authored generated illustrations, not extracted official game assets.

Validation executed:

- node scripts/buildCombatCharacterAnimationsWave6PartB.mjs --check:5atlases/40phases/160distinct cells, native reconstruction matches.
- node scripts/buildCombatCharacterSpriteCorrectionsWave6PartB.mjs --check:3atlases/12states/48distinct cells,4native sources,1corrected row, native reconstruction matches.
- npm run lint -- scripts/nativeSuperRuntimeWave6.test.mjs scripts/buildCombatCharacterAnimationsWave6PartB.mjs scripts/buildCombatCharacterSpriteCorrectionsWave6PartB.mjs:passed with oxlint.

No old PNG, global registry/index, engine or runtime module was edited by Part B. The new runtime regression script is owned separately in the same task; root performs final integrated validation after engine fixes.
