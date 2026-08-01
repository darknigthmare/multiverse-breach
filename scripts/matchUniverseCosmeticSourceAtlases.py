"""Match installed universe cosmetic strips to their generated 1024x1536 source PNG.

The scanner is read-only apart from an explicitly requested --out JSON report.
No image data is serialized into the report.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops, ImageStat


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_UNIVERSE_ROOT = (
    PROJECT_ROOT / "public" / "visuals" / "cosmetics" / "openai" / "universes"
)
DEFAULT_GENERATED_ROOT = Path.home() / ".codex" / "generated_images"
DEFAULT_SINCE = "2026-07-27"
ATLAS_SIZE = (1024, 1536)
STRIP_SIZE = (1024, 256)
LOW_SIZE = (256, 64)
PERCEPTUAL_SIZE = (64, 16)
ROWS = (
    ("ko", 3, "ko-effects-atlas.webp"),
    ("intro", 4, "intro-poses-atlas.webp"),
    ("victory", 5, "victory-poses-atlas.webp"),
)
REQUIRED_PACK_FILES = (
    "reference-dossier.json",
    "hud-theme.webp",
    "profile-title.webp",
    "profile-banner.webp",
    "portal-effects-atlas.webp",
    "ko-effects-atlas.webp",
    "intro-poses-atlas.webp",
    "victory-poses-atlas.webp",
)


@dataclass(frozen=True)
class RowSignature:
    color: Image.Image
    perceptual: Image.Image


@dataclass(frozen=True)
class Candidate:
    path: Path
    modified_at: float
    signatures: dict[str, RowSignature]


def _normalize_path(path: Path) -> str:
    return str(path.resolve()).replace("\\", "/")


def _green_dominant_mask(image: Image.Image) -> Image.Image:
    red, green, blue = image.split()
    green_high = green.point([0] * 80 + [255] * 176)
    green_minus_red = ImageChops.subtract(green, red).point([0] * 25 + [255] * 231)
    green_minus_blue = ImageChops.subtract(green, blue).point([0] * 21 + [255] * 235)
    return ImageChops.multiply(
        ImageChops.multiply(green_high, green_minus_red),
        green_minus_blue,
    )


def composite_raw_strip_on_black(source: Image.Image, row_index: int) -> Image.Image:
    strip = source.convert("RGB").crop((0, row_index * 256, 1024, (row_index + 1) * 256))
    strip.paste((0, 0, 0), mask=_green_dominant_mask(strip))
    return strip


def composite_final_on_black(source: Image.Image) -> Image.Image:
    rgba = source.convert("RGBA")
    black = Image.new("RGBA", rgba.size, (0, 0, 0, 255))
    return Image.alpha_composite(black, rgba).convert("RGB")


def make_signature(image: Image.Image) -> RowSignature:
    color = image.resize(LOW_SIZE, Image.Resampling.LANCZOS)
    perceptual = image.convert("L").resize(PERCEPTUAL_SIZE, Image.Resampling.LANCZOS)
    return RowSignature(color=color, perceptual=perceptual)


def normalized_mse(left: Image.Image, right: Image.Image) -> float:
    difference = ImageChops.difference(left, right)
    rms = ImageStat.Stat(difference).rms
    return sum((channel / 255.0) ** 2 for channel in rms) / len(rms)


def score_signatures(left: RowSignature, right: RowSignature) -> dict[str, float]:
    color_mse = normalized_mse(left.color, right.color)
    perceptual_mse = normalized_mse(left.perceptual, right.perceptual)
    return {
        "colorMse": color_mse,
        "perceptualMse": perceptual_mse,
        "combined": color_mse * 0.75 + perceptual_mse * 0.25,
    }


def _candidate_signatures(source: Image.Image) -> dict[str, RowSignature]:
    return {
        kind: make_signature(composite_raw_strip_on_black(source, row_index))
        for kind, row_index, _ in ROWS
    }


def scan_candidates(
    generated_root: Path,
    since_timestamp: float,
) -> tuple[list[Candidate], dict[str, int], list[dict[str, str]]]:
    candidates: list[Candidate] = []
    errors: list[dict[str, str]] = []
    scanned_pngs = 0
    skipped_before_since = 0
    skipped_dimensions = 0
    if not generated_root.exists():
        return candidates, {
            "pngFilesScanned": 0,
            "skippedBeforeSince": 0,
            "skippedDimensions": 0,
        }, [{"path": _normalize_path(generated_root), "message": "generated root is missing"}]

    for candidate_path in generated_root.rglob("*.png"):
        scanned_pngs += 1
        try:
            modified_at = candidate_path.stat().st_mtime
            if modified_at < since_timestamp:
                skipped_before_since += 1
                continue
            with Image.open(candidate_path) as source:
                if source.size != ATLAS_SIZE:
                    skipped_dimensions += 1
                    continue
                candidates.append(Candidate(
                    path=candidate_path,
                    modified_at=modified_at,
                    signatures=_candidate_signatures(source),
                ))
        except (OSError, ValueError) as error:
            errors.append({"path": _normalize_path(candidate_path), "message": str(error)})

    candidates.sort(key=lambda candidate: _normalize_path(candidate.path))
    return candidates, {
        "pngFilesScanned": scanned_pngs,
        "skippedBeforeSince": skipped_before_since,
        "skippedDimensions": skipped_dimensions,
    }, errors


def scan_complete_packs(universe_root: Path) -> tuple[list[dict[str, object]], list[str]]:
    packs: list[dict[str, object]] = []
    incomplete: list[str] = []
    if not universe_root.exists():
        return packs, incomplete
    for directory in universe_root.iterdir():
        if not directory.is_dir():
            continue
        if any(not (directory / filename).is_file() for filename in REQUIRED_PACK_FILES):
            incomplete.append(directory.name)
            continue
        try:
            dossier = json.loads((directory / "reference-dossier.json").read_text(encoding="utf-8"))
            universe = str(dossier.get("universeKey", "")).strip()
            if not universe:
                raise ValueError("dossier universeKey is required")
            packs.append({"universe": universe, "slug": directory.name, "directory": directory})
        except (OSError, ValueError, json.JSONDecodeError):
            incomplete.append(directory.name)
    packs.sort(key=lambda pack: str(pack["universe"]).casefold())
    incomplete.sort()
    return packs, incomplete


def load_final_signatures(pack_directory: Path) -> dict[str, RowSignature]:
    signatures: dict[str, RowSignature] = {}
    for kind, _, filename in ROWS:
        with Image.open(pack_directory / filename) as source:
            if source.size != STRIP_SIZE:
                raise ValueError(f"{filename}: expected 1024x256, found {source.width}x{source.height}")
            signatures[kind] = make_signature(composite_final_on_black(source))
    return signatures


def score_candidate(
    final_signatures: dict[str, RowSignature],
    candidate: Candidate,
) -> dict[str, object]:
    row_scores = {
        kind: score_signatures(final_signatures[kind], candidate.signatures[kind])
        for kind, _, _ in ROWS
    }
    combined = sum(float(row_scores[kind]["combined"]) for kind, _, _ in ROWS) / len(ROWS)
    return {
        "path": _normalize_path(candidate.path),
        "score": combined,
        "rowScores": row_scores,
    }


def classify_confidence(best_score: float, margin: float | None) -> str:
    if margin is not None and best_score <= 0.020 and margin < 0.005:
        return "ambiguous"
    if best_score <= 0.020 and (margin is None or margin >= 0.005):
        return "high"
    if best_score <= 0.045 and (margin is None or margin >= 0.002):
        return "medium"
    return "low"


def rank_candidate_matches(
    final_signatures: dict[str, RowSignature],
    candidates: Iterable[Candidate],
) -> dict[str, object]:
    scores = [score_candidate(final_signatures, candidate) for candidate in candidates]
    scores.sort(key=lambda result: (float(result["score"]), str(result["path"])))
    if not scores:
        return {
            "confidence": "low",
            "error": "no eligible 1024x1536 PNG candidate",
            "bestPath": None,
            "score": None,
            "secondBestPath": None,
            "secondBestScore": None,
            "secondBestMargin": None,
        }
    best = scores[0]
    second = scores[1] if len(scores) > 1 else None
    margin = float(second["score"]) - float(best["score"]) if second else None
    ratio = (
        float(second["score"]) / max(float(best["score"]), 1e-12)
        if second else None
    )
    return {
        "confidence": classify_confidence(float(best["score"]), margin),
        "bestPath": best["path"],
        "score": best["score"],
        "rowScores": best["rowScores"],
        "secondBestPath": second["path"] if second else None,
        "secondBestScore": second["score"] if second else None,
        "secondBestMargin": margin,
        "secondBestRatio": ratio if ratio is None or math.isfinite(ratio) else None,
    }


def match_pack(
    pack: dict[str, object],
    candidates: Iterable[Candidate],
) -> dict[str, object]:
    universe = str(pack["universe"])
    slug = str(pack["slug"])
    try:
        final_signatures = load_final_signatures(Path(pack["directory"]))
    except (OSError, ValueError) as error:
        return {
            "universe": universe,
            "slug": slug,
            "confidence": "low",
            "error": str(error),
            "bestPath": None,
            "score": None,
            "secondBestPath": None,
            "secondBestScore": None,
            "secondBestMargin": None,
        }

    return {
        "universe": universe,
        "slug": slug,
        **rank_candidate_matches(final_signatures, candidates),
    }


def build_report(
    universe_root: Path = DEFAULT_UNIVERSE_ROOT,
    generated_root: Path = DEFAULT_GENERATED_ROOT,
    universes: Iterable[str] = (),
    since_timestamp: float | None = None,
    since_label: str = DEFAULT_SINCE,
) -> dict[str, object]:
    universe_filters = tuple(universes)
    if since_timestamp is None:
        since_timestamp = datetime.fromisoformat(DEFAULT_SINCE).timestamp()
    packs, incomplete = scan_complete_packs(universe_root)
    requested = {value.strip().casefold() for value in universe_filters if value.strip()}
    selected = [
        pack for pack in packs
        if not requested
        or str(pack["universe"]).casefold() in requested
        or str(pack["slug"]).casefold() in requested
    ]
    matched_filters = {
        value for value in requested
        if any(
            str(pack["universe"]).casefold() == value
            or str(pack["slug"]).casefold() == value
            for pack in selected
        )
    }
    candidates, candidate_scan, candidate_errors = scan_candidates(
        generated_root,
        since_timestamp,
    )
    matches = [match_pack(pack, candidates) for pack in selected]
    confidence_counts = {
        confidence: sum(match["confidence"] == confidence for match in matches)
        for confidence in ("high", "medium", "low", "ambiguous")
    }
    unmatched_filters = sorted(requested - matched_filters)
    status = "ok" if not unmatched_filters and matches else "warning"
    return {
        "schemaVersion": 1,
        "id": "multiverse-breach.universe-cosmetic-source-atlas-matches",
        "status": status,
        "contract": {
            "sourceDimensions": "1024x1536",
            "matchedRows": ["ko:3", "intro:4", "victory:5"],
            "comparisonDimensions": f"{LOW_SIZE[0]}x{LOW_SIZE[1]}",
            "perceptualDimensions": f"{PERCEPTUAL_SIZE[0]}x{PERCEPTUAL_SIZE[1]}",
            "score": "mean of 75% normalized RGB MSE and 25% grayscale perceptual MSE over 3 rows",
            "greenKey": "G>=80, G-R>=25 and G-B>=21 is composited to black",
            "highConfidence": "score<=0.020 and second-best margin>=0.005",
        },
        "roots": {
            "universe": _normalize_path(universe_root),
            "generated": _normalize_path(generated_root),
        },
        "filters": {
            "universes": list(universe_filters),
            "modifiedSince": since_label,
            "unmatched": unmatched_filters,
        },
        "summary": {
            "completePacks": len(packs),
            "incompletePacks": len(incomplete),
            "selectedPacks": len(selected),
            "eligibleCandidates": len(candidates),
            **candidate_scan,
            **confidence_counts,
            "candidateErrors": len(candidate_errors),
        },
        "incompleteSlugs": incomplete,
        "candidateErrors": candidate_errors,
        "packs": matches,
    }


def parse_arguments(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--universe", action="append", default=[], help="exact universe name or slug")
    parser.add_argument("--generated-root", type=Path, default=DEFAULT_GENERATED_ROOT)
    parser.add_argument("--out", type=Path, help="write the full JSON report to this path")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    arguments = parse_arguments(sys.argv[1:] if argv is None else argv)
    report = build_report(
        generated_root=arguments.generated_root,
        universes=arguments.universe,
    )
    serialized = json.dumps(report, indent=2, ensure_ascii=False) + "\n"
    if arguments.out:
        arguments.out.parent.mkdir(parents=True, exist_ok=True)
        arguments.out.write_text(serialized, encoding="utf-8")
        print(json.dumps({
            "status": report["status"],
            "out": _normalize_path(arguments.out),
            "summary": report["summary"],
        }, indent=2, ensure_ascii=False))
    else:
        print(serialized, end="")
    return 0 if report["status"] == "ok" else 1


if __name__ == "__main__":
    raise SystemExit(main())
