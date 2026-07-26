#!/usr/bin/env python3
"""Compose deterministic booster labels over an OpenAI-generated PNG.

This is a fallback for otherwise usable image_gen backgrounds whose rendered
text cannot be accepted. It deliberately emits a PNG only; publication to the
portal remains the responsibility of the normal booster ingestion pipeline.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import uuid
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageOps, UnidentifiedImageError
except ImportError as error:  # pragma: no cover - actionable dependency error
    raise SystemExit(
        "Pillow is required. Install it in the active Python environment before "
        "running scripts/composePortalBoosterFallback.py."
    ) from error


TARGET_WIDTH = 1024
TARGET_HEIGHT = 1536
TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT
FONT_CANDIDATES = (
    Path("C:/Windows/Fonts/bahnschrift.ttf"),
    Path("C:/Windows/Fonts/segoeuib.ttf"),
    Path("C:/Windows/Fonts/arialbd.ttf"),
)
REQUIRED_LABELS = (
    "UNIVERSE",
    "BREACH PORTAL BOOSTER",
    "5 UNLOCKABLES",
    "ANOMALY SERIES",
)


def resolve_font_path() -> Path:
    for candidate in FONT_CANDIDATES:
        if candidate.is_file():
            return candidate
    searched = ", ".join(str(path) for path in FONT_CANDIDATES)
    raise ValueError(f"No readable Windows font found; searched: {searched}")


def validate_source_png(source_path: Path) -> dict[str, object]:
    if not source_path.is_file():
        raise ValueError(f"Source PNG does not exist: {source_path}")
    with Image.open(source_path) as image:
        image.verify()
    with Image.open(source_path) as image:
        image_format = (image.format or "").upper()
        width, height = image.size
    if image_format != "PNG":
        raise ValueError(f"Source must be PNG, got {image_format or 'unknown'}")
    if width < 2 or height < 2:
        raise ValueError(f"Source PNG is too small: {width}x{height}")
    return {
        "format": image_format,
        "width": width,
        "height": height,
        "ratio": width / height,
    }


def validate_output_png(output_path: Path) -> dict[str, object]:
    if not output_path.is_file():
        raise ValueError(f"Output PNG was not created: {output_path}")
    with Image.open(output_path) as image:
        image.verify()
    with Image.open(output_path) as image:
        image.load()
        image_format = (image.format or "").upper()
        width, height = image.size
    if image_format != "PNG":
        raise ValueError(f"Output must be PNG, got {image_format or 'unknown'}")
    if (width, height) != (TARGET_WIDTH, TARGET_HEIGHT):
        raise ValueError(
            f"Output must be {TARGET_WIDTH}x{TARGET_HEIGHT}, got {width}x{height}"
        )
    ratio = width / height
    if abs(ratio - TARGET_RATIO) > 1e-9:
        raise ValueError(f"Output ratio must be 2:3, got {ratio:.8f}")
    return {
        "format": image_format,
        "width": width,
        "height": height,
        "ratio": ratio,
        "bytes": output_path.stat().st_size,
    }


def title_line_candidates(title: str) -> list[list[str]]:
    """Return exact one- or two-line arrangements, best-balanced first."""

    candidates = [[title]]
    words = title.split(" ")
    if len(words) < 2:
        return candidates

    splits = []
    for index in range(1, len(words)):
        first = " ".join(words[:index])
        second = " ".join(words[index:])
        splits.append(([first, second], abs(len(first) - len(second))))
    splits.sort(key=lambda item: item[1])
    candidates.extend(lines for lines, _balance in splits)
    return candidates


def fit_text(
    draw: ImageDraw.ImageDraw,
    text_candidates: list[list[str]],
    font_path: Path,
    *,
    maximum_size: int,
    minimum_size: int,
    maximum_width: int,
    maximum_height: int,
    spacing: int,
    stroke_width: int,
) -> tuple[list[str], ImageFont.FreeTypeFont, tuple[int, int, int, int]]:
    for size in range(maximum_size, minimum_size - 1, -2):
        font = ImageFont.truetype(str(font_path), size=size)
        for lines in text_candidates:
            text = "\n".join(lines)
            bounds = draw.multiline_textbbox(
                (0, 0),
                text,
                font=font,
                spacing=spacing,
                align="center",
                stroke_width=stroke_width,
            )
            width = bounds[2] - bounds[0]
            height = bounds[3] - bounds[1]
            if width <= maximum_width and height <= maximum_height:
                return lines, font, bounds
    raise ValueError("Title is too long to remain legible on the fallback panel")


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    center_x: int,
    top_y: int,
    text: str,
    font: ImageFont.FreeTypeFont,
    *,
    fill: tuple[int, int, int, int],
    stroke_width: int,
    spacing: int = 4,
) -> int:
    bounds = draw.multiline_textbbox(
        (0, 0),
        text,
        font=font,
        spacing=spacing,
        align="center",
        stroke_width=stroke_width,
    )
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    x = center_x - width // 2 - bounds[0]
    y = top_y - bounds[1]

    shadow_offset = max(3, stroke_width + 1)
    draw.multiline_text(
        (x + shadow_offset, y + shadow_offset),
        text,
        font=font,
        fill=(0, 0, 0, 220),
        spacing=spacing,
        align="center",
        stroke_width=stroke_width + 1,
        stroke_fill=(0, 0, 0, 240),
    )
    draw.multiline_text(
        (x, y),
        text,
        font=font,
        fill=fill,
        spacing=spacing,
        align="center",
        stroke_width=stroke_width,
        stroke_fill=(0, 0, 0, 255),
    )
    return height


def compose(source_path: Path, output_path: Path, title: str, overwrite: bool) -> dict:
    source_path = source_path.resolve()
    output_path = output_path.resolve()
    source_details = validate_source_png(source_path)

    if output_path.suffix.casefold() != ".png":
        raise ValueError("--output must use a .png extension")
    if source_path == output_path:
        raise ValueError("--source and --output must be different files")
    if output_path.exists() and not overwrite:
        raise ValueError(f"Output already exists (use --overwrite): {output_path}")

    clean_title = title.strip()
    if not clean_title:
        raise ValueError("--title must contain visible text")
    if clean_title != title or any(character in title for character in "\r\n\t"):
        raise ValueError("--title cannot contain surrounding whitespace or controls")
    if len(title) > 160:
        raise ValueError("--title cannot exceed 160 characters")

    font_path = resolve_font_path()
    with Image.open(source_path) as source_image:
        background = ImageOps.fit(
            ImageOps.exif_transpose(source_image).convert("RGB"),
            (TARGET_WIDTH, TARGET_HEIGHT),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        ).convert("RGBA")

    overlay = Image.new("RGBA", background.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    panel_fill = (5, 9, 16, 218)
    panel_outline = (74, 224, 235, 220)
    title_fill = (245, 248, 250, 255)
    accent_fill = (120, 241, 246, 255)

    draw.rounded_rectangle(
        (82, 126, 942, 362),
        radius=24,
        fill=panel_fill,
        outline=panel_outline,
        width=4,
    )
    draw.rounded_rectangle(
        (82, 1072, 942, 1382),
        radius=24,
        fill=panel_fill,
        outline=panel_outline,
        width=4,
    )

    title_lines, title_font, _title_bounds = fit_text(
        draw,
        title_line_candidates(title),
        font_path,
        maximum_size=92,
        minimum_size=36,
        maximum_width=770,
        maximum_height=142,
        spacing=2,
        stroke_width=3,
    )
    title_height = draw_centered_text(
        draw,
        TARGET_WIDTH // 2,
        146,
        "\n".join(title_lines),
        title_font,
        fill=title_fill,
        stroke_width=3,
        spacing=2,
    )

    universe_font = ImageFont.truetype(str(font_path), size=38)
    universe_y = max(294, 162 + title_height)
    draw_centered_text(
        draw,
        TARGET_WIDTH // 2,
        universe_y,
        REQUIRED_LABELS[0],
        universe_font,
        fill=accent_fill,
        stroke_width=2,
    )

    breach_font = ImageFont.truetype(str(font_path), size=46)
    unlockables_font = ImageFont.truetype(str(font_path), size=43)
    series_font = ImageFont.truetype(str(font_path), size=32)
    draw_centered_text(
        draw,
        TARGET_WIDTH // 2,
        1108,
        REQUIRED_LABELS[1],
        breach_font,
        fill=title_fill,
        stroke_width=2,
    )
    draw.line((142, 1194, 882, 1194), fill=panel_outline, width=3)
    draw_centered_text(
        draw,
        TARGET_WIDTH // 2,
        1218,
        REQUIRED_LABELS[2],
        unlockables_font,
        fill=title_fill,
        stroke_width=2,
    )
    draw_centered_text(
        draw,
        TARGET_WIDTH // 2,
        1312,
        REQUIRED_LABELS[3],
        series_font,
        fill=accent_fill,
        stroke_width=2,
    )

    composed = Image.alpha_composite(background, overlay).convert("RGB")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = output_path.with_name(
        f".{output_path.stem}.tmp-{os.getpid()}-{uuid.uuid4().hex}.png"
    )
    try:
        composed.save(temporary_path, format="PNG", optimize=True)
        temporary_details = validate_output_png(temporary_path)
        os.replace(temporary_path, output_path)
    finally:
        temporary_path.unlink(missing_ok=True)

    output_details = validate_output_png(output_path)
    if output_details != temporary_details:
        raise ValueError("Output changed during atomic publication")
    return {
        "status": "success",
        "source": str(source_path),
        "sourceDetails": source_details,
        "output": str(output_path),
        "outputDetails": output_details,
        "title": title,
        "labels": [title, *REQUIRED_LABELS],
        "font": str(font_path),
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Compose exact fallback labels over one image_gen booster PNG"
    )
    parser.add_argument("--source", required=True, type=Path, help="Source PNG")
    parser.add_argument("--output", required=True, type=Path, help="Output PNG")
    parser.add_argument("--title", required=True, help="Exact universe title")
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace an existing output atomically",
    )
    return parser


def main() -> None:
    arguments = build_parser().parse_args()
    result = compose(
        arguments.source,
        arguments.output,
        arguments.title,
        arguments.overwrite,
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, UnidentifiedImageError) as error:
        print(f"portal booster fallback: {error}", file=sys.stderr)
        raise SystemExit(1) from error
