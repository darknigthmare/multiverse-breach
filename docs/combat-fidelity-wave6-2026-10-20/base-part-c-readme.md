# Wave6 Part C — two coherent base sprites

Joseph aged67 and wrestler Beowulf each have16 real native idle/run/attack/hit poses, four per state. Two original4×4 generations and two new4-pose corrective attack strips are archived with exact prompts and input hashes. The wide original attack rows reduced body scale in fixed-cell packing. Only those attacks were redrawn with compact wrist vines, restrained cape and no broad impact flash. The twelve remaining cells of each base are preserved exactly. No old project PNG is overwritten.

The final sheets are1024×1024 with256-pixel cells, baseline244 and ten transparent margin pixels. Four distinct RGBA cells per state and sixteen per hero are verified, along with exact reconstruction from the declared native rows. Sharp performs only segmentation, uniform scaling, alpha padding and packing. It draws no anatomy, poses, vines, chairs or effects.

`base-part-c-stature-review.json` documents a conservative pose bridge because the new attack strips have a different native pixel density from the original4×4 sheets. Ratios between attack and guard are measured within the same corrective strip; the guard is anchored to an actual already-normalized flexed guard. Joseph's159-pixel attack is displayed at191 pixels, matching hit3 rather than232-pixel standing idle0. Beowulf's200-pixel attack already matches bent idle3 and keeps scale1, rather than being pushed to231-pixel standing idle0. Cross-resolution raw heights are never divided directly. The bridge is an explicit project visual adaptation, not a claim of official anatomical proportions.

The new version references come from the inspected Wave6 presentation art. Joseph keeps his fedora, gray beard, khaki clothes, gloves and thorny HermitPurple vines. Beowulf keeps his muscular wrestler body, wolf pelt, boots and TheHurting chair. All sources and contact sheets were inspected. Model/job/generation IDs not provided by the tool remain null; source-game and1:1 certification remain false.

Check with `node scripts/buildCombatCharacterSpriteCorrectionsWave6PartC.mjs --check`.
