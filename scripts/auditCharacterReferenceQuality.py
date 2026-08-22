#!/usr/bin/env python3
"""Audit local bitmap references used by rift-dossier character arcs.

The audit is intentionally conservative:

* ``rejected-placeholder`` is reserved for large, almost uncompressed-looking
  canvases made from very few flat colors and hard alpha edges.
* ``approved`` requires a healthy transparent sprite sheet with substantial
  palette, entropy, and local pixel variation.
* everything else is ``needs-review``.

The generated JSON is deterministic so ``--check`` can detect a stale report.
No source bitmap or catalog file is modified.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
from collections import Counter
from pathlib import Path
from typing import Any, Iterable

try:
    from PIL import Image, ImageChops
except ImportError as error:  # pragma: no cover - environment failure
    raise SystemExit(
        "Pillow is required. Install it in the active Python environment "
        "(for example: py -m pip install Pillow)."
    ) from error


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = REPOSITORY_ROOT / "docs" / "rift-dossiers" / "catalog.json"
DEFAULT_OUTPUT_PATH = (
    REPOSITORY_ROOT
    / "docs"
    / "rift-dossiers"
    / "character-reference-quality.json"
)
PUBLIC_ROOT = (REPOSITORY_ROOT / "public").resolve()
EXPECTED_CHARACTER_ARC_ENTRY_COUNT = 1_912
EXPECTED_UNIQUE_REFERENCE_PATH_COUNT = 975

ALPHA_OCCUPIED_THRESHOLD = 8
STRONG_NEIGHBOR_DIFFERENCE = 12

# These thresholds deliberately leave a wide needs-review band.
THRESHOLDS = {
    "rejectedPlaceholder": {
        "minimumCanvasEdge": 512,
        "maximumOpaqueColorCount": 16,
        "maximumQuantizedColorCount16": 16,
        # The known block templates contain a handful of accidental alpha
        # levels at diagonal weapon edges, so allow up to eight while still
        # excluding normally anti-aliased detailed sheets.
        "maximumAlphaLevelCount": 8,
        "maximumColorEntropyBits": 3.25,
        "maximumColorTransitionRate": 0.14,
        "maximumBytesPerPixel": 0.065,
        "maximumAlphaOccupancy": 0.24,
        "minimumDominantOpaqueColorShare": 0.24,
    },
    "approved": {
        "minimumCanvasEdge": 256,
        "minimumOpaqueColorCount": 96,
        "minimumQuantizedColorCount16": 48,
        "minimumColorEntropyBits": 4.25,
        "minimumLuminanceEntropyBits": 3.0,
        "minimumColorTransitionRate": 0.17,
        "minimumStrongDetailRate": 0.11,
        "minimumAlphaOccupancy": 0.015,
        "maximumAlphaOccupancy": 0.72,
        "minimumFileBytes": 20_000,
    },
}

KNOWN_EXPECTATIONS = {
    "/sprites/generated/heroes/buffy-the-vampire-slayer/buffy-summers.png": (
        "rejected-placeholder"
    ),
    "/sprites/generated/heroes/breaking-bad/walter-white.png": (
        "rejected-placeholder"
    ),
    "/sprites/generated/heroes/police-squad/frank-drebin.png": (
        "rejected-placeholder"
    ),
    "/sprites/generated/heroes/half-life/freeman.png": "approved",
    (
        "/sprites/generated/heroes/halo/master-chief-complete/"
        "master-chief-universal.png"
    ): "approved",
    "/sprites/generated/heroes/resident-evil/leon.png": "approved",
}


def round_metric(value: float) -> float:
    return round(value, 6)


def shannon_entropy(counts: Iterable[int]) -> float:
    values = [count for count in counts if count > 0]
    total = sum(values)
    if total <= 0:
        return 0.0
    return -sum(
        (count / total) * math.log2(count / total) for count in values
    )


def normalized_catalog_path(value: str) -> str:
    return "/" + value.strip().replace("\\", "/").lstrip("/")


def resolve_public_path(catalog_path: str) -> Path:
    resolved = (PUBLIC_ROOT / catalog_path.lstrip("/")).resolve()
    try:
        resolved.relative_to(PUBLIC_ROOT)
    except ValueError as error:
        raise ValueError(
            f"Reference escapes public root: {catalog_path}"
        ) from error
    return resolved


def binary_alpha_mask(alpha: Image.Image) -> Image.Image:
    return alpha.point(
        lambda value: 255 if value > ALPHA_OCCUPIED_THRESHOLD else 0,
        mode="L",
    )


def opaque_color_counts(
    rgb: Image.Image,
    occupied_mask: Image.Image,
    opaque_pixels: int,
) -> list[tuple[int, tuple[int, int, int]]]:
    """Get exact opaque RGB counts without iterating over every source pixel."""

    pixel_count = rgb.width * rgb.height
    transparent_pixels = pixel_count - opaque_pixels
    sentinel = (0, 0, 0)
    masked_rgb = Image.new("RGB", rgb.size, sentinel)
    masked_rgb.paste(rgb, mask=occupied_mask)
    raw_counts = masked_rgb.getcolors(maxcolors=pixel_count)
    if raw_counts is None:  # Defensive; maxcolors equals the pixel count.
        return []

    result: list[tuple[int, tuple[int, int, int]]] = []
    for count, color in raw_counts:
        adjusted_count = count
        if color == sentinel:
            adjusted_count -= transparent_pixels
        if adjusted_count > 0:
            result.append((adjusted_count, color))
    return result


def neighbor_detail(
    rgb: Image.Image,
    occupied_mask: Image.Image,
) -> dict[str, float]:
    """Measure color changes between adjacent jointly occupied pixels."""

    def axis_histogram(axis: str) -> tuple[list[int], int]:
        width, height = rgb.size
        if axis == "x":
            first_rgb = rgb.crop((0, 0, width - 1, height))
            second_rgb = rgb.crop((1, 0, width, height))
            first_mask = occupied_mask.crop((0, 0, width - 1, height))
            second_mask = occupied_mask.crop((1, 0, width, height))
        else:
            first_rgb = rgb.crop((0, 0, width, height - 1))
            second_rgb = rgb.crop((0, 1, width, height))
            first_mask = occupied_mask.crop((0, 0, width, height - 1))
            second_mask = occupied_mask.crop((0, 1, width, height))

        difference = ImageChops.difference(first_rgb, second_rgb)
        red, green, blue = difference.split()
        maximum_channel_difference = ImageChops.lighter(
            ImageChops.lighter(red, green),
            blue,
        )
        pair_mask = ImageChops.multiply(first_mask, second_mask)
        histogram = maximum_channel_difference.histogram(mask=pair_mask)
        return histogram, sum(histogram)

    combined = [0] * 256
    valid_pairs = 0
    for axis in ("x", "y"):
        histogram, pair_count = axis_histogram(axis)
        valid_pairs += pair_count
        combined = [left + right for left, right in zip(combined, histogram)]

    if valid_pairs <= 0:
        return {
            "validOpaqueNeighborPairs": 0,
            "colorTransitionRate": 0.0,
            "strongDetailRate": 0.0,
            "meanNeighborDifference": 0.0,
        }

    transitions = sum(combined[1:])
    strong_transitions = sum(combined[STRONG_NEIGHBOR_DIFFERENCE:])
    mean_difference = sum(
        difference * count for difference, count in enumerate(combined)
    ) / valid_pairs
    return {
        "validOpaqueNeighborPairs": valid_pairs,
        "colorTransitionRate": round_metric(transitions / valid_pairs),
        "strongDetailRate": round_metric(strong_transitions / valid_pairs),
        "meanNeighborDifference": round_metric(mean_difference),
    }


def tile_diversity_4x4(rgba: Image.Image) -> dict[str, Any]:
    """Coarse diversity signal for the common 4x4 sprite-sheet layout."""

    fingerprints: list[str] = []
    width, height = rgba.size
    for row in range(4):
        for column in range(4):
            left = round(column * width / 4)
            top = round(row * height / 4)
            right = round((column + 1) * width / 4)
            bottom = round((row + 1) * height / 4)
            tile = rgba.crop((left, top, right, bottom)).resize(
                (16, 16),
                Image.Resampling.BOX,
            )
            fingerprints.append(hashlib.sha256(tile.tobytes()).hexdigest())
    unique_count = len(set(fingerprints))
    return {
        "tileCount": 16,
        "uniqueCoarseTileCount": unique_count,
        "uniqueCoarseTileShare": round_metric(unique_count / 16),
    }


def analyze_bitmap(path: Path) -> dict[str, Any]:
    file_bytes = path.stat().st_size
    file_sha256 = hashlib.sha256(path.read_bytes()).hexdigest()

    with Image.open(path) as source:
        source.load()
        source_mode = source.mode
        source_format = source.format or path.suffix.lstrip(".").upper()
        has_alpha = (
            "A" in source.getbands()
            or (
                source_mode == "P"
                and "transparency" in source.info
            )
        )
        rgba = source.convert("RGBA")

    width, height = rgba.size
    pixel_count = width * height
    rgb = rgba.convert("RGB")
    alpha = rgba.getchannel("A")
    occupied_mask = binary_alpha_mask(alpha)
    alpha_histogram = alpha.histogram()
    opaque_pixels = sum(alpha_histogram[ALPHA_OCCUPIED_THRESHOLD + 1 :])
    semi_transparent_pixels = sum(alpha_histogram[9:247])
    alpha_levels = sum(1 for count in alpha_histogram if count > 0)
    bounding_box = occupied_mask.getbbox()
    if bounding_box:
        bounding_box_area = (
            (bounding_box[2] - bounding_box[0])
            * (bounding_box[3] - bounding_box[1])
        )
    else:
        bounding_box_area = 0

    color_counts = opaque_color_counts(rgb, occupied_mask, opaque_pixels)
    exact_color_count = len(color_counts)
    dominant_color_count = max(
        (count for count, _color in color_counts),
        default=0,
    )
    quantized_counts: Counter[tuple[int, int, int]] = Counter()
    for count, (red, green, blue) in color_counts:
        quantized_counts[(red >> 4, green >> 4, blue >> 4)] += count

    luminance_histogram = rgba.convert("L").histogram(mask=occupied_mask)
    detail = neighbor_detail(rgb, occupied_mask)
    tile_diversity = tile_diversity_4x4(rgba)

    return {
        "fileBytes": file_bytes,
        "fileSha256": file_sha256,
        "format": source_format,
        "sourceMode": source_mode,
        "width": width,
        "height": height,
        "pixelCount": pixel_count,
        "hasAlpha": has_alpha,
        "alphaLevelCount": alpha_levels,
        "opaquePixels": opaque_pixels,
        "alphaOccupancy": round_metric(
            opaque_pixels / pixel_count if pixel_count else 0.0
        ),
        "semiTransparentPixelShare": round_metric(
            semi_transparent_pixels / pixel_count if pixel_count else 0.0
        ),
        "occupiedBoundingBox": list(bounding_box) if bounding_box else None,
        "occupiedBoundingBoxFill": round_metric(
            opaque_pixels / bounding_box_area if bounding_box_area else 0.0
        ),
        "opaqueColorCount": exact_color_count,
        "quantizedColorCount16": len(quantized_counts),
        "dominantOpaqueColorShare": round_metric(
            dominant_color_count / opaque_pixels if opaque_pixels else 0.0
        ),
        "colorEntropyBits": round_metric(
            shannon_entropy(count for count, _color in color_counts)
        ),
        "luminanceEntropyBits": round_metric(
            shannon_entropy(luminance_histogram)
        ),
        "bytesPerPixel": round_metric(
            file_bytes / pixel_count if pixel_count else 0.0
        ),
        **detail,
        "tileDiversity4x4": tile_diversity,
    }


def classify_metrics(
    metrics: dict[str, Any] | None,
    error: str | None,
) -> tuple[str, list[str]]:
    if error or not metrics:
        return "needs-review", [error or "bitmap-analysis-unavailable"]

    width = metrics["width"]
    height = metrics["height"]
    rejected = THRESHOLDS["rejectedPlaceholder"]
    rejected_checks = {
        "large-canvas": min(width, height)
        >= rejected["minimumCanvasEdge"],
        "very-low-color-count": metrics["opaqueColorCount"]
        <= rejected["maximumOpaqueColorCount"],
        "very-low-quantized-color-count": metrics["quantizedColorCount16"]
        <= rejected["maximumQuantizedColorCount16"],
        "binary-or-near-binary-alpha": metrics["alphaLevelCount"]
        <= rejected["maximumAlphaLevelCount"],
        "low-color-entropy": metrics["colorEntropyBits"]
        <= rejected["maximumColorEntropyBits"],
        "low-local-color-variation": metrics["colorTransitionRate"]
        <= rejected["maximumColorTransitionRate"],
        "extreme-png-compressibility": metrics["bytesPerPixel"]
        <= rejected["maximumBytesPerPixel"],
        "sparse-sheet-occupation": metrics["alphaOccupancy"]
        <= rejected["maximumAlphaOccupancy"],
        "single-flat-color-dominates": metrics["dominantOpaqueColorShare"]
        >= rejected["minimumDominantOpaqueColorShare"],
    }
    if all(rejected_checks.values()):
        return (
            "rejected-placeholder",
            [
                "high-confidence-flat-block-placeholder",
                *[
                    label
                    for label, matched in rejected_checks.items()
                    if matched
                ],
            ],
        )

    approved = THRESHOLDS["approved"]
    approved_checks = {
        "adequate-canvas": min(width, height)
        >= approved["minimumCanvasEdge"],
        "useful-alpha": bool(metrics["hasAlpha"]),
        "healthy-alpha-occupation": (
            approved["minimumAlphaOccupancy"]
            <= metrics["alphaOccupancy"]
            <= approved["maximumAlphaOccupancy"]
        ),
        "rich-color-count": metrics["opaqueColorCount"]
        >= approved["minimumOpaqueColorCount"],
        "rich-quantized-palette": metrics["quantizedColorCount16"]
        >= approved["minimumQuantizedColorCount16"],
        "healthy-color-entropy": metrics["colorEntropyBits"]
        >= approved["minimumColorEntropyBits"],
        "healthy-luminance-entropy": metrics["luminanceEntropyBits"]
        >= approved["minimumLuminanceEntropyBits"],
        "healthy-local-color-variation": metrics["colorTransitionRate"]
        >= approved["minimumColorTransitionRate"],
        "healthy-strong-detail": metrics["strongDetailRate"]
        >= approved["minimumStrongDetailRate"],
        "adequate-file-size": metrics["fileBytes"]
        >= approved["minimumFileBytes"],
    }
    if all(approved_checks.values()):
        return "approved", ["meets-detailed-sprite-reference-thresholds"]

    review_reasons = [
        f"below-approved:{label}"
        for label, matched in approved_checks.items()
        if not matched
    ]
    return "needs-review", review_reasons or ["manual-review-required"]


def load_character_entries() -> list[dict[str, Any]]:
    with CATALOG_PATH.open("r", encoding="utf-8") as handle:
        catalog = json.load(handle)
    entries = [
        entry
        for entry in catalog.get("entrees", [])
        if entry.get("famille") == "arc-personnage"
    ]
    return sorted(entries, key=lambda entry: int(entry["id"]))


def build_report() -> dict[str, Any]:
    entries = load_character_entries()
    path_usage: dict[str, list[dict[str, Any]]] = {}
    for entry in entries:
        # The catalogue keeps every discovered bitmap in this audit-only field,
        # while referencesLocalesOpenAI exposes only references already
        # classified as approved. Falling back preserves compatibility with a
        # catalogue generated before the two surfaces were separated.
        raw_candidates = entry.get("candidatsReferencesLocalesAudit")
        if raw_candidates is None:
            raw_candidates = entry.get("referencesLocalesOpenAI")
        for raw_path in raw_candidates or []:
            catalog_path = normalized_catalog_path(raw_path)
            path_usage.setdefault(catalog_path, []).append(entry)

    reference_files: list[dict[str, Any]] = []
    classification_by_path: dict[str, str] = {}
    for catalog_path in sorted(path_usage):
        absolute_path = resolve_public_path(catalog_path)
        metrics = None
        error = None
        if not absolute_path.is_file():
            error = "missing-local-reference"
        else:
            try:
                metrics = analyze_bitmap(absolute_path)
            except Exception as analysis_error:  # Keep audit comprehensive.
                error = (
                    "bitmap-analysis-error:"
                    f"{analysis_error.__class__.__name__}:"
                    f"{analysis_error}"
                )

        classification, reasons = classify_metrics(metrics, error)
        classification_by_path[catalog_path] = classification
        used_by = path_usage[catalog_path]
        reference_files.append(
            {
                "path": catalog_path,
                "classification": classification,
                "reasons": reasons,
                "usedByEntryCount": len(used_by),
                "entryIds": sorted(int(entry["id"]) for entry in used_by),
                "characters": sorted(
                    {
                        str(entry.get("personnage") or "")
                        for entry in used_by
                        if entry.get("personnage")
                    }
                ),
                "universes": sorted(
                    {
                        str(universe)
                        for entry in used_by
                        for universe in entry.get("univers") or []
                    }
                ),
                "metrics": metrics,
            }
        )

    entry_rows: list[dict[str, Any]] = []
    for entry in entries:
        raw_candidates = entry.get("candidatsReferencesLocalesAudit")
        if raw_candidates is None:
            raw_candidates = entry.get("referencesLocalesOpenAI")
        local_paths = [
            normalized_catalog_path(path)
            for path in raw_candidates or []
        ]
        path_classifications = [
            classification_by_path[path] for path in local_paths
        ]
        if not local_paths:
            classification = "needs-review"
            reasons = ["no-local-reference"]
        elif "rejected-placeholder" in path_classifications:
            classification = "rejected-placeholder"
            reasons = ["contains-rejected-placeholder-reference"]
        elif all(
            value == "approved" for value in path_classifications
        ):
            classification = "approved"
            reasons = ["all-local-references-approved"]
        else:
            classification = "needs-review"
            reasons = ["contains-reference-needing-review"]

        entry_rows.append(
            {
                "id": int(entry["id"]),
                "character": entry.get("personnage"),
                "universes": entry.get("univers") or [],
                "localReferences": local_paths,
                "classification": classification,
                "reasons": reasons,
            }
        )

    reference_counts = Counter(
        row["classification"] for row in reference_files
    )
    entry_counts = Counter(row["classification"] for row in entry_rows)
    missing_count = sum(
        1
        for row in reference_files
        if "missing-local-reference" in row["reasons"]
    )

    return {
        "schemaVersion": 1,
        "kind": "rift-dossier-character-reference-quality-audit",
        "source": {
            "catalog": "docs/rift-dossiers/catalog.json",
            "family": "arc-personnage",
            "bitmapRoot": "public",
        },
        "methodology": {
            "policy": (
                "Conservative three-way classification: reject only when every "
                "high-confidence flat-block signal matches; approve only when "
                "every detailed transparent-sprite signal matches; route the "
                "wide middle band to manual review."
            ),
            "alphaOccupiedThreshold": ALPHA_OCCUPIED_THRESHOLD,
            "strongNeighborDifferenceThreshold": (
                STRONG_NEIGHBOR_DIFFERENCE
            ),
            "thresholds": THRESHOLDS,
            "metrics": [
                "dimensions and encoded byte size",
                "alpha levels, occupied-pixel share and occupied bounding box",
                "exact and 4-bit-per-channel quantized opaque color diversity",
                "dominant opaque color share",
                "opaque color and luminance Shannon entropy",
                "adjacent opaque-pixel color transitions and strong detail",
                "coarse 4x4 tile fingerprint diversity",
                "file SHA-256",
            ],
            "knownLimitations": [
                (
                    "A deliberately minimalist, low-color retro sprite on a "
                    "large transparent sheet can resemble a placeholder and "
                    "should be manually restored if its rejection is wrong."
                ),
                (
                    "A richly textured but lore-inaccurate or composited image "
                    "can pass bitmap-quality thresholds; this report does not "
                    "replace character-fidelity review."
                ),
                (
                    "White frame guides, duplicated animation poses, anatomy "
                    "errors and copied/licensed art are not reliably detected "
                    "by these numeric metrics."
                ),
                (
                    "needs-review is intentionally broad and is not permission "
                    "to provide the bitmap to ImageGen."
                ),
            ],
        },
        "summary": {
            "characterArcEntryCount": len(entry_rows),
            "entriesWithLocalReferences": sum(
                1 for row in entry_rows if row["localReferences"]
            ),
            "entriesWithoutLocalReferences": sum(
                1 for row in entry_rows if not row["localReferences"]
            ),
            "uniqueReferencePathCount": len(reference_files),
            "missingReferenceFileCount": missing_count,
            "referenceClassifications": {
                category: reference_counts.get(category, 0)
                for category in (
                    "approved",
                    "rejected-placeholder",
                    "needs-review",
                )
            },
            "entryClassifications": {
                category: entry_counts.get(category, 0)
                for category in (
                    "approved",
                    "rejected-placeholder",
                    "needs-review",
                )
            },
        },
        "knownCaseExpectations": KNOWN_EXPECTATIONS,
        "referenceFiles": reference_files,
        "entries": entry_rows,
    }


def canonical_json(report: dict[str, Any]) -> str:
    return json.dumps(
        report,
        ensure_ascii=False,
        indent=2,
        sort_keys=False,
    ) + "\n"


def assert_report_invariants(report: dict[str, Any]) -> None:
    summary = report["summary"]
    if (
        summary["characterArcEntryCount"]
        != EXPECTED_CHARACTER_ARC_ENTRY_COUNT
    ):
        raise ValueError(
            f"Expected {EXPECTED_CHARACTER_ARC_ENTRY_COUNT:,} "
            "arc-personnage entries, found "
            f"{summary['characterArcEntryCount']}."
        )
    if (
        summary["uniqueReferencePathCount"]
        != EXPECTED_UNIQUE_REFERENCE_PATH_COUNT
    ):
        raise ValueError(
            f"Expected {EXPECTED_UNIQUE_REFERENCE_PATH_COUNT} unique current "
            "local references, found "
            f"{summary['uniqueReferencePathCount']}."
        )

    actual = {
        row["path"]: row["classification"]
        for row in report["referenceFiles"]
    }
    mismatches = {
        path: {
            "expected": expected,
            "actual": actual.get(path),
        }
        for path, expected in KNOWN_EXPECTATIONS.items()
        if actual.get(path) != expected
    }
    if mismatches:
        raise ValueError(
            "Known-case classification mismatch: "
            + json.dumps(mismatches, ensure_ascii=False, sort_keys=True)
        )


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_PATH,
        help="Report destination (default: %(default)s).",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Recompute and fail if the existing report is stale.",
    )
    return parser.parse_args()


def main() -> int:
    arguments = parse_arguments()
    output_path = arguments.output
    if not output_path.is_absolute():
        output_path = (REPOSITORY_ROOT / output_path).resolve()

    report = build_report()
    assert_report_invariants(report)
    rendered = canonical_json(report)

    if arguments.check:
        if not output_path.is_file():
            print(f"Missing report: {output_path}", file=sys.stderr)
            return 1
        existing = output_path.read_text(encoding="utf-8")
        if existing != rendered:
            print(
                f"Stale character-reference report: {output_path}",
                file=sys.stderr,
            )
            return 1
        print(
            json.dumps(
                {
                    "checked": True,
                    "output": str(output_path.relative_to(REPOSITORY_ROOT)),
                    "summary": report["summary"],
                },
                ensure_ascii=False,
            )
        )
        return 0

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(rendered, encoding="utf-8", newline="\n")
    print(
        json.dumps(
            {
                "written": True,
                "output": str(output_path.relative_to(REPOSITORY_ROOT)),
                "summary": report["summary"],
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
