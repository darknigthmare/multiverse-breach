#!/usr/bin/env python3
"""Deterministic packing only: alpha floor, bounds crop, uniform NN fit and centering."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib
import json

ROOT = Path(__file__).resolve().parents[5]
BASE = Path(__file__).resolve().parent
SOURCE = BASE / "native.png"
TARGET = ROOT / "DLC/PiratesOfTheCaribbean/assets/sprites/source-scenes/curse-of-the-black-pearl-2003/aztec-medallion-front-20261113.png"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


image = Image.open(SOURCE).convert("RGBA")
alpha = image.getchannel("A")
cleared = sum(alpha.histogram()[1:13])
image.putalpha(alpha.point(lambda value: 0 if value <= 12 else value))
bounds = image.getbbox()
assert bounds, "Source must contain visible pixels."
crop = image.crop(bounds)
scale = min(240 / crop.width, 240 / crop.height)
dimensions = (max(1, round(crop.width * scale)), max(1, round(crop.height * scale)))
resized = crop.resize(dimensions, Image.Resampling.NEAREST)
offset = ((256 - dimensions[0]) // 2, (256 - dimensions[1]) // 2)
output = Image.new("RGBA", (256, 256))
output.paste(resized, offset)
TARGET.parent.mkdir(parents=True, exist_ok=True)
output.save(TARGET)
visible = output.getbbox()
guards = [visible[0], visible[1], 256 - visible[2], 256 - visible[3]]
assert min(guards) >= 8

preview = Image.new("RGB", (700, 230), "#111a22")
draw = ImageDraw.Draw(preview)
for x, size in zip((8, 115, 225, 350, 500), (24, 32, 48, 64, 96)):
    draw.text((x, 8), f"{size} px / nearest", fill="#e6d7b0")
    scaled = output.resize((size, size), Image.Resampling.NEAREST)
    preview.paste(scaled, (x, 33), scaled)
    if size <= 48:
        zoom = scaled.resize((size * 2, size * 2), Image.Resampling.NEAREST)
        preview.paste(zoom, (x, 130), zoom)
preview.save(BASE / "game-scale-preview.png")

report = {
    "operation": "alpha-floor-12+visible-bounds-crop+uniform-nearest-fit+transparent-center",
    "sourceDimensions": list(image.size),
    "alphaNoisePixelsCleared": cleared,
    "sourceVisibleBounds": list(bounds),
    "uniformScale": scale,
    "resizedDimensions": list(dimensions),
    "offset": list(offset),
    "outputDimensions": [256, 256],
    "outputVisibleBounds": list(visible),
    "guardPixels": guards,
    "sourceSha256": digest(SOURCE),
    "outputSha256": digest(TARGET),
    "outputBytes": TARGET.stat().st_size,
    "alphaExtrema": list(output.getchannel("A").getextrema()),
    "semanticPaintingPerformed": False,
    "previewSizes": [24, 32, 48, 64, 96],
    "previewSha256": digest(BASE / "game-scale-preview.png"),
}
(BASE / "technical-qa.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"target": str(TARGET), "sha256": report["outputSha256"], "guards": guards}))
