# Wave5 Part C — five native presentation atlases

The five sheets contain 160 distinct RGBA cells: Leon, Jill, Rebecca Chambers, Mirelle Suture and Bastion Korr, each with eight phases and four newly drawn poses. Row order is intro, outro, roundVictory, roundDefeat, fatality, victory, defeat, super. All outputs are1024×2048,256-pixel cells, baseline244 and ten transparent margin pixels.

Five actual `image_gen` calls drew the original32-pose sheets. A sixth call drew four replacement intro poses for Bastion because the original rifle tip was cut at the native image edge. Only that row is replaced. Every active row declares its source image, SHA256 and native row; reconstruction reproduces the final PNG byte hash. Sharp only segments alpha seams, scales each phase uniformly, pads transparency and packs the original native drawings. No anatomy, poses, mirroring or painted effects are synthesized by code.

Leon uses the RE4(2005) agent jacket and Special Rocket Launcher, Jill the RE3(2020) blue tank top and held heavy FINGeR cannon, Rebecca her RE0 medical supplies and healing First Aid. Mirelle uses the authored cyan cards and resonance threads; Bastion uses his Atrium equipment and orange Convergence Lock aperture. The latter two specials retain their actual offensive semantics, separate from their healing or guard skills. No dead or spirits become soldiers. Finales are non-graphic adapted presentations.

The local source images, identity crops, exact prompts, native outputs and hashes are archived in the Part C directories. All five native sources, the corrective strip and five normalized contacts were inspected. Model and generation/job identifiers were not supplied by the tool and remain null. The image output filename is not treated as a generation ID.

`presentation-stature-bc-baseline.json` preserves the native PNG and cell hashes before any display-scale compensation. Where a long weapon or effect forced source normalization to shrink an otherwise comparable standing body, `normalization.rows[].renderScale` and its body-only `statureReview` restore the measured height around baseline244. The full source cell is drawn, without pixel edits or cropping. Naturally kneeling medical poses retain their authored posture. These measurements are project visual decisions, not official source-game proportions.

These are generated illustrations and authored choreography, not official source-game frames or certified1:1 reproductions. Technical transparency, distinctness and lineage checks do not certify canonical animation timing, exact weapon geometry or pixel identity. `part-c-source-facts.json` records version choices, effective effects, local author references and remaining limits.

Recheck with `node scripts/buildCombatCharacterAnimationsWave5PartC.mjs --check`.
