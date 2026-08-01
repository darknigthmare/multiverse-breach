#!/usr/bin/env python3
"""Raster backend for the rift-dossier thumbnail installer."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

from PIL import Image, ImageColor, ImageOps


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--width", type=int)
    parser.add_argument("--height", type=int)
    parser.add_argument("--fit", choices=("cover", "contain"), default="cover")
    parser.add_argument("--background", default="#000000")
    parser.add_argument("--quality", type=int, default=86)
    parser.add_argument("--metadata", action="store_true")
    options = parser.parse_args()

    if not options.metadata:
        if options.output is None:
            parser.error("--output is required unless --metadata is used")
        if options.width is None or options.width < 2:
            parser.error("--width must be greater than one")
        if options.height is None or options.height < 2:
            parser.error("--height must be greater than one")
        if not 1 <= options.quality <= 100:
            parser.error("--quality must be between 1 and 100")
    return options


def image_metadata(source: Path) -> dict[str, object]:
    with Image.open(source) as image:
        image.verify()
    with Image.open(source) as image:
        return {
            "width": image.width,
            "height": image.height,
            "format": (image.format or source.suffix.removeprefix(".")).lower(),
        }


def flatten_to_rgb(image: Image.Image, background: str) -> Image.Image:
    if image.mode not in ("RGBA", "LA") and "transparency" not in image.info:
        return image.convert("RGB")

    rgba = image.convert("RGBA")
    red, green, blue = ImageColor.getrgb(background)
    canvas = Image.new("RGBA", rgba.size, (red, green, blue, 255))
    canvas.alpha_composite(rgba)
    return canvas.convert("RGB")


def transform(options: argparse.Namespace) -> dict[str, object]:
    assert options.output is not None
    if options.source.resolve() == options.output.resolve():
        raise ValueError("source and output must be different files")

    extension = options.output.suffix.lower()
    if extension not in (".png", ".webp"):
        raise ValueError("output must end in .png or .webp")

    with Image.open(options.source) as opened:
        source = ImageOps.exif_transpose(opened).convert("RGBA")

    target_size = (options.width, options.height)
    if options.fit == "cover":
        processed = ImageOps.fit(
            source,
            target_size,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    else:
        contained = ImageOps.contain(
            source,
            target_size,
            method=Image.Resampling.LANCZOS,
        )
        background = ImageColor.getrgb(options.background)
        processed = Image.new("RGBA", target_size, (*background, 255))
        offset = (
            (options.width - contained.width) // 2,
            (options.height - contained.height) // 2,
        )
        processed.alpha_composite(contained, offset)

    options.output.parent.mkdir(parents=True, exist_ok=True)
    if extension == ".webp":
        flatten_to_rgb(processed, options.background).save(
            options.output,
            format="WEBP",
            quality=options.quality,
            method=6,
            optimize=True,
        )
        output_format = "webp"
    else:
        processed.save(
            options.output,
            format="PNG",
            optimize=True,
            compress_level=9,
        )
        output_format = "png"

    return {
        "width": processed.width,
        "height": processed.height,
        "format": output_format,
        "bytes": options.output.stat().st_size,
    }


def main() -> None:
    options = parse_arguments()
    result = image_metadata(options.source) if options.metadata else transform(options)
    print(json.dumps(result, separators=(",", ":")))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # noqa: BLE001 - CLI boundary
        print(f"[rift-dossier-pillow] {error}", file=sys.stderr)
        raise SystemExit(1) from error
