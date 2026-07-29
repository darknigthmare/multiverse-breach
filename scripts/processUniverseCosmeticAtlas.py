#!/usr/bin/env python3
"""Split one keyed 4x6 universe cosmetic sheet into the seven runtime assets."""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path

from PIL import Image


EXPECTED_SIZE = (1024, 1536)
CELL_SIZE = 256


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", ascii_value).strip("-") or "unknown"


def visible_ratio(image: Image.Image) -> float:
    alpha = image.getchannel("A")
    histogram = alpha.histogram()
    visible = sum(histogram[17:])
    return visible / (image.width * image.height)


def validate_hud_safe_area(image: Image.Image) -> None:
    if image.height == CELL_SIZE:
        safe_area = image.crop((256, 72, 768, 200))
    else:
        safe_area = image.crop((320, 160, 704, 352))
    ratio = visible_ratio(safe_area)
    if ratio > 0.02:
        raise ValueError(
            f"HUD safe area is {ratio:.4%} opaque; expected <= 2%"
        )


def validate_atlas_frames(kind: str, image: Image.Image) -> None:
    for frame in range(4):
        cell = image.crop(
            (frame * CELL_SIZE, 0, (frame + 1) * CELL_SIZE, CELL_SIZE)
        )
        ratio = visible_ratio(cell)
        if ratio <= 0.01:
            raise ValueError(f"{kind}: frame {frame} is effectively empty")
        if ratio >= 0.94:
            raise ValueError(f"{kind}: frame {frame} retained its background")


def inset_wide_asset(image: Image.Image, width: int, height: int) -> Image.Image:
    resized = image.resize((width, height), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", image.size, (0, 0, 0, 0))
    canvas.alpha_composite(
        resized,
        ((image.width - width) // 2, (image.height - height) // 2),
    )
    return canvas


def save_webp(image: Image.Image, destination: Path) -> dict[str, object]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(
        destination,
        "WEBP",
        quality=86,
        method=6,
        lossless=False,
        exact=True,
    )
    ratio = visible_ratio(image)
    if ratio <= 0.002:
        raise ValueError(f"{destination.name}: output is effectively empty")
    return {
        "file": destination.name,
        "width": image.width,
        "height": image.height,
        "bytes": destination.stat().st_size,
        "visibleRatio": round(ratio, 6),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--universe", required=True)
    parser.add_argument(
        "--out-root",
        type=Path,
        default=Path("public/visuals/cosmetics/openai/universes"),
    )
    parser.add_argument(
        "--hud-source",
        choices=("both", "top", "bottom"),
        default="both",
        help="Select which keyed UI row forms the in-game HUD frame.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    with Image.open(args.input) as source:
        image = source.convert("RGBA")

    if image.size != EXPECTED_SIZE:
        raise ValueError(
            f"expected {EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]}, got "
            f"{image.width}x{image.height}"
        )

    slug = slugify(args.universe)
    destination = args.out_root / slug
    hud_bounds = {
        "both": (0, 0, 4 * CELL_SIZE, 2 * CELL_SIZE),
        "top": (0, 0, 4 * CELL_SIZE, CELL_SIZE),
        "bottom": (
            0,
            CELL_SIZE,
            4 * CELL_SIZE,
            2 * CELL_SIZE,
        ),
    }[args.hud_source]
    title_row = image.crop((0, 0, 4 * CELL_SIZE, CELL_SIZE))
    banner_row = image.crop(
        (0, CELL_SIZE, 4 * CELL_SIZE, 2 * CELL_SIZE)
    )
    assets = {
        "hudTheme": image.crop(hud_bounds),
        "profileTitle": inset_wide_asset(title_row, 896, 224),
        "profileBanner": inset_wide_asset(banner_row, 960, 240),
        "portalEffect": image.crop(
            (0, 2 * CELL_SIZE, 4 * CELL_SIZE, 3 * CELL_SIZE)
        ),
        "koEffect": image.crop(
            (0, 3 * CELL_SIZE, 4 * CELL_SIZE, 4 * CELL_SIZE)
        ),
        "introPose": image.crop(
            (0, 4 * CELL_SIZE, 4 * CELL_SIZE, 5 * CELL_SIZE)
        ),
        "victoryPose": image.crop(
            (0, 5 * CELL_SIZE, 4 * CELL_SIZE, 6 * CELL_SIZE)
        ),
    }
    filenames = {
        "hudTheme": "hud-theme.webp",
        "profileTitle": "profile-title.webp",
        "profileBanner": "profile-banner.webp",
        "portalEffect": "portal-effects-atlas.webp",
        "koEffect": "ko-effects-atlas.webp",
        "introPose": "intro-poses-atlas.webp",
        "victoryPose": "victory-poses-atlas.webp",
    }

    validate_hud_safe_area(assets["hudTheme"])
    for kind in ("portalEffect", "koEffect", "introPose", "victoryPose"):
        validate_atlas_frames(kind, assets[kind])

    reports = {
        kind: save_webp(asset, destination / filenames[kind])
        for kind, asset in assets.items()
    }
    print(
        json.dumps(
            {
                "status": "ok",
                "universe": args.universe,
                "slug": slug,
                "assets": reports,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
