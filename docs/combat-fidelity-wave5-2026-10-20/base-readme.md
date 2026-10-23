# Wave5 base continuity corrections

Three new native4×4 atlases provide idle, run, attack and hit for Leon, Sol Badguy and Ky Kiske:48 actual distinct RGBA poses,1024×1024 sheets and256-pixel cells. They align basic actions with the separately delivered32-pose presentation versions. Leon wears the RE4(2005) agent jacket and uses Silver Ghost; Sol and Ky use their approved Strive clothes and physical OutrageMkII and Thunderseal.

The three exact `image_gen` input crops came from the new presentation sources, inspected before generation. Full presentation references and the unchanged old base PNGs are archived separately. The former provide version and equipment context; the latter document the continuity debt. No old image is overwritten. The three new native outputs and all normalized contact sheets were inspected before review flags became true.

Each state declares its actual native row. The builder checks output/source/reference SHA256, sixteen distinct RGBA cells per hero, all four cells per state, transparent ten-pixel margins, zero opaque pixels crossing source seams and deterministic reconstruction of the complete final PNG from the declared native rows. Sharp only performs segmentation, uniform scaling, alpha padding and packing. It creates no poses and mirrors no artwork.

The artwork and basic choreography are authored adaptations, not official source-game frames or certified1:1 reproductions. Model, generation and job IDs were not supplied and remain null. No external source quotation or new network verification is claimed.

Recheck with `node scripts/buildCombatCharacterSpriteCorrectionsWave5.mjs --check`.
