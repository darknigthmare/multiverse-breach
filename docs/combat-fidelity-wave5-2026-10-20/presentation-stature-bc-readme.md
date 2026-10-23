# Body stature compensation — Parts B and C

Eighteen super/finale rows on nine characters have a renderer-only scale correction. Rebecca's genuinely kneeling medical support has none. The original PNG hashes and320 distinct RGBA cell hashes for the ten B/C heroes remain identical to `presentation-stature-bc-baseline.json`; no new art, cropped cell, redrawn limb or weapon is introduced.

Each correction is reproduced from `statureByPhase` in its Part B/C generation record into `normalization.rows[].renderScale` and `statureReview`. The formula is:

`renderScale = (referenceBodyHeight / normalizedBodyHeight) × (nativeComparableBodyHeight / nativeReferenceBodyHeight)`

The first term compares measured body-only projections in the normalized cells. The second preserves the native pose's relative height, including actual crouching, lunging and leaning. For example, Ky's compact finale projection grows from83 to approximately127 pixels, rather than being forced to his213-pixel standing height. Leon's super body grows from150 to approximately229 pixels. The renderer draws the entire source cell around baseline244, leaving feet anchored and keeping all weapon/effect pixels.

Native reference and comparison use the same source PNG. Bastion uses outro column0 instead of his separately generated high-resolution intro strip. Boruto's finale uses roundDefeat column3 from the same corrective source. This avoids treating differences in native output resolution as anatomical proportions.

`part-b-stature-review.json` and `part-c-stature-review.json` archive the independent visual measurements, source and normalized body ROIs, columns, phase references, reasons and limitations. Their comparison images were inspected before applying the records. ROIs are visual approximations, sometimes overlapping an arm or prop in width; vertical measurements exclude weapon and effect overhang. They are not official source-game measurements or certified1:1 proportions.

Both builders check the reproduced records, formula, native and output hashes, and actual distinct RGBA pose cells. The separate renderer regression verifies destination stature, whole-cell source rectangles, P1/P2 mirroring, baseline stability and unchanged drawing scale for the35 historical native sheets.
