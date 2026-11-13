#!/usr/bin/env python3
"""Pack image_gen output into a wide 4x4 atlas, without repainting anatomy.

The legacy renderer supports rectangular cells and anchors sourceH-24 by
default. A wider canvas retains the complete source spear at one body scale.
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, __version__ as pillow_version


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
SOURCE = HERE / "generation/attempt-2-corrected.raw.png"
OUTPUT = ROOT / "DLC/AsterixObelix/assets/sprites/generated/bosses/asterix-1992/roman-legionary.png"
CELL_W, CELL_H = 384, 256
SCALE = 0.76
BASELINE = CELL_H - 24


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    raw = Image.open(SOURCE).convert("RGBA")
    assert raw.size == (1254, 1254), raw.size
    raw.putalpha(raw.getchannel("A").point(lambda a: 0 if a <= 8 else 255 if a >= 248 else a))
    atlas = Image.new("RGBA", (CELL_W * 4, CELL_H * 4))
    frames, previews = [], []
    for index in range(16):
        row, col = divmod(index, 4)
        x_edges = [0, 314, 627, 940, 1254]
        y_edges = [0, 314, 627, 940, 1254]
        # Row 3 pose 10 starts at x623, four pixels before the nominal split.
        # The neighboring body ends at x587. Move the cut into the empty gap.
        # No body, shaft or spear point is erased, repainted or reconstructed.
        if row == 2:
            x_edges[2] = 606
        source_rect = [x_edges[col], y_edges[row], x_edges[col + 1], y_edges[row + 1]]
        frame = raw.crop(source_rect)
        opaque = frame.getchannel("A").point(lambda a: 255 if a >= 64 else 0)
        bbox = opaque.getbbox()
        assert bbox, index
        bottom = opaque.crop((0, max(bbox[1], bbox[3] - 12), frame.width, bbox[3])).getbbox()
        assert bottom, index
        pivot_x = (bottom[0] + bottom[2]) / 2
        resized = frame.resize(tuple(round(n * SCALE) for n in frame.size), Image.Resampling.LANCZOS)
        offset = (round(CELL_W / 2 - pivot_x * SCALE), round(BASELINE - bbox[3] * SCALE))
        normalized = Image.new("RGBA", (CELL_W, CELL_H))
        normalized.alpha_composite(resized, offset)
        bounds = normalized.getchannel("A").point(lambda a: 255 if a >= 64 else 0).getbbox()
        assert bounds and bounds[0] >= 4 and bounds[1] >= 4 and bounds[2] <= CELL_W - 4 and bounds[3] <= CELL_H - 4, (index, bounds)
        atlas.alpha_composite(normalized, (col * CELL_W, row * CELL_H))
        preview = Image.new("RGBA", normalized.size, "#283038")
        preview.alpha_composite(normalized)
        previews.append(preview.convert("RGB"))
        frames.append({"index": index, "sourceRect": source_rect, "sourceAlpha64Bounds": list(bbox),
                       "sourceContactPivot": [pivot_x, bbox[3]], "sharedScale": SCALE,
                       "destinationOffset": list(offset), "alpha64Bounds": list(bounds)})
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUTPUT, optimize=True)
    qa = HERE / "validation"
    qa.mkdir(exist_ok=True)
    contact = Image.new("RGB", atlas.size, "#283038")
    for index, preview in enumerate(previews):
        row, col = divmod(index, 4)
        contact.paste(preview, (col * CELL_W, row * CELL_H))
    contact.save(qa / "roman-legionary-contact.png", optimize=True)
    contact.resize((576, 384), Image.Resampling.NEAREST).save(qa / "roman-legionary-contact-96px.png", optimize=True)
    contact.resize((408, 272), Image.Resampling.NEAREST).save(qa / "roman-legionary-contact-68px.png", optimize=True)
    for name, indices in {"idle": range(4), "run": range(4, 8), "attack": range(8, 12), "hit": range(12, 16)}.items():
        images = [previews[i].resize((204, 136), Image.Resampling.NEAREST) for i in indices]
        images[0].save(qa / f"roman-legionary-{name}.gif", save_all=True, append_images=images[1:], duration=167, loop=0)
    result = {
        "schemaVersion": 1, "date": "2026-11-13", "status": "TECHNICAL_QA_PASSED_VISUAL_REVIEW_PENDING",
        "tools": {"python": sys.version.split()[0], "pillow": pillow_version},
        "source": str(SOURCE.relative_to(ROOT)), "sourceSha256": sha(SOURCE),
        "output": str(OUTPUT.relative_to(ROOT)), "outputSha256": sha(OUTPUT), "outputBytes": OUTPUT.stat().st_size,
        "size": list(atlas.size), "mode": atlas.mode, "alphaRange": list(atlas.getchannel("A").getextrema()),
        "cellSize": [CELL_W, CELL_H], "columns": 4, "rows": 4, "frameCount": 16,
        "sharedScale": SCALE, "baseline": BASELINE,
        "alphaTreatment": "alpha<=8 becomes0; alpha>=248 becomes255; other alpha and RGB retained; no anatomy painted",
        "packingBoundaryCorrection": {"row": 2, "nominalBoundaryX": 627, "correctedBoundaryX": 606,
                                      "neighborAlpha64EndX": 587, "nextAlpha64StartX": 623},
        "rendererContract": "drawGeneratedSpriteSheet uses naturalWidth/columns, naturalHeight/rows and default baseline sourceH-24; no square-cell assumption",
        "frames": frames, "source1to1Verified": False, "inGameReviewPerformed": False,
        "runtimeBound": False, "canonicalAnimationTimingVerified": False,
    }
    (qa / "roman-legionary-technical-qa.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({k: result[k] for k in ("status", "output", "outputBytes", "outputSha256", "size")}))


if __name__ == "__main__":
    main()
