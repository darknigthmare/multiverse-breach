"""Normalize a detached ImageGen item icon to the runtime 512x512 contract."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


TARGET_SIZE = 512
SAFE_SIZE = 440
ALPHA_BBOX_THRESHOLD = 8


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    """Return the visible subject bounds while ignoring near-transparent noise."""

    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value > ALPHA_BBOX_THRESHOLD else 0)
    bbox = mask.getbbox()
    if bbox is None:
        raise ValueError("Input icon has no visible pixels after chroma removal")
    return bbox


def normalize_icon(source_path: Path, output_path: Path) -> None:
    """Crop, scale, center, and clear hidden RGB for a game-ready icon."""

    with Image.open(source_path) as source:
        rgba = source.convert("RGBA")

    subject = rgba.crop(alpha_bbox(rgba))
    scale = min(SAFE_SIZE / subject.width, SAFE_SIZE / subject.height)
    resized_size = (
        max(1, round(subject.width * scale)),
        max(1, round(subject.height * scale)),
    )
    subject = subject.resize(resized_size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (TARGET_SIZE, TARGET_SIZE), (0, 0, 0, 0))
    offset = (
        (TARGET_SIZE - subject.width) // 2,
        (TARGET_SIZE - subject.height) // 2,
    )
    canvas.alpha_composite(subject, offset)

    # Transparent pixels must not retain chroma RGB in browser filtering/mipmaps.
    pixels = bytearray(canvas.tobytes())
    for index in range(0, len(pixels), 4):
        if pixels[index + 3] == 0:
            pixels[index:index + 3] = b"\x00\x00\x00"
    canvas = Image.frombytes("RGBA", canvas.size, bytes(pixels))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, format="PNG", optimize=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Normalize one detached ImageGen item icon to 512x512 RGBA."
    )
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    normalize_icon(args.input, args.output)


if __name__ == "__main__":
    main()
