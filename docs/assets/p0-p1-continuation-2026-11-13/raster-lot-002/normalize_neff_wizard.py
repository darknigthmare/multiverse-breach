#!/usr/bin/env python3
"""Deterministic atlas packing only; character pixels are authored by image_gen.

Run from the repository root. No reference pixels are copied into the output.
The raw output, source rectangles, shared scale and alpha treatment are retained.
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, __version__ as pillow_version


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
SOURCE = HERE / "generation/neff-wizard.raw.png"
OUTPUT = ROOT / "DLC/AlteredBeast/assets/sprites/generated/forms/altered-beast-1988/neff-wizard.png"
SCALE = 0.76
BASELINE = 240
CELL = 256


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    raw = Image.open(SOURCE).convert("RGBA")
    assert raw.size == (1254, 1254), raw.size
    # Generated hidden RGB is undefined at alpha 0/1. Trim near-invisible alpha
    # without repainting RGB, then use the same scale for all sixteen cells.
    alpha = raw.getchannel("A").point(lambda a: 0 if a <= 8 else 255 if a >= 248 else a)
    raw.putalpha(alpha)
    atlas = Image.new("RGBA", (1024, 1024))
    frames = []
    previews = []
    for index in range(16):
        row, col = divmod(index, 4)
        source_rect = tuple(round(n * 1254 / 4) for n in (col, row, col + 1, row + 1))
        frame = raw.crop(source_rect)
        opaque = frame.getchannel("A").point(lambda a: 255 if a >= 64 else 0)
        bbox = opaque.getbbox()
        assert bbox, index
        bottom_band = opaque.crop((0, max(bbox[1], bbox[3] - 12), frame.width, bbox[3])).getbbox()
        assert bottom_band, index
        # Pivot is the center of the lowest visible contact, not the casting hand.
        pivot_x = (bottom_band[0] + bottom_band[2]) / 2
        new_size = tuple(round(n * SCALE) for n in frame.size)
        resized = frame.resize(new_size, Image.Resampling.LANCZOS)
        offset = (round(CELL / 2 - pivot_x * SCALE), round(BASELINE - bbox[3] * SCALE))
        normalized = Image.new("RGBA", (CELL, CELL))
        normalized.alpha_composite(resized, offset)
        solid_bbox = normalized.getchannel("A").point(lambda a: 255 if a >= 64 else 0).getbbox()
        assert solid_bbox and min(solid_bbox[:2]) >= 4 and max(solid_bbox[2:]) <= 250, (index, solid_bbox)
        atlas.alpha_composite(normalized, (col * CELL, row * CELL))
        frame_info = {
            "index": index, "sourceRect": list(source_rect), "sourceAlpha64Bounds": list(bbox),
            "sourceContactPivot": [pivot_x, bbox[3]], "sharedScale": SCALE,
            "destinationOffset": list(offset), "alpha64Bounds": list(solid_bbox),
        }
        frames.append(frame_info)
        background = Image.new("RGBA", (CELL, CELL), "#283038")
        background.alpha_composite(normalized)
        previews.append(background.convert("RGB"))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUTPUT, optimize=True)
    qa_dir = HERE / "validation"
    qa_dir.mkdir(exist_ok=True)
    contact = Image.new("RGB", (1024, 1024), "#283038")
    for index, preview in enumerate(previews):
        row, col = divmod(index, 4)
        contact.paste(preview, (col * CELL, row * CELL))
    contact.save(qa_dir / "neff-wizard-contact.png", optimize=True)
    previews[0].save(qa_dir / "neff-wizard-motion.gif", save_all=True, append_images=previews[1:], duration=200, loop=0)
    result = {
        "schemaVersion": 1, "date": "2026-11-13", "status": "TECHNICAL_QA_PASSED_VISUAL_CANDIDATE",
        "tools": {"python": sys.version.split()[0], "pillow": pillow_version},
        "source": str(SOURCE.relative_to(ROOT)), "sourceSha256": sha(SOURCE),
        "output": str(OUTPUT.relative_to(ROOT)), "outputSha256": sha(OUTPUT),
        "outputBytes": OUTPUT.stat().st_size, "size": list(atlas.size), "mode": atlas.mode,
        "alphaRange": list(atlas.getchannel("A").getextrema()), "cellSize": [CELL, CELL],
        "frameCount": 16, "sharedScale": SCALE, "baseline": BASELINE,
        "alphaTreatment": "alpha<=8 becomes 0; alpha>=248 becomes 255; middle alpha retained; no RGB repaint",
        "frames": frames,
        "runtimeBound": False, "source1to1Verified": False, "inGameReviewPerformed": False,
        "animationCaveat": "Generated pose transitions; not a frame-for-frame reconstruction of arcade timings. Row 2 is robe/stance motion rather than a certified walk cycle.",
    }
    (qa_dir / "neff-wizard-technical-qa.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({k: result[k] for k in ("status", "output", "outputBytes", "outputSha256", "frameCount")}))


if __name__ == "__main__":
    main()
