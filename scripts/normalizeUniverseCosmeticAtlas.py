#!/usr/bin/env python3
"""Normalize one keyed 4x6 universe cosmetic atlas into exact runtime rows.

The normalizer is deliberately geometric. It does not inspect or rewrite text,
identity, style, or lore; it only detects the six ordered semantic y-bands and
places their existing alpha content inside the production-safe cells.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from itertools import combinations
from pathlib import Path

from PIL import Image


WIDTH = 1024
HEIGHT = 1536
CELL = 256
ROW_COUNT = 6
DEFAULT_ALPHA_THRESHOLD = 16
DEFAULT_UI_GUARD = 16
DEFAULT_CELL_GUARD = 24
MIN_SEMANTIC_GAP_ROWS = 4
MIN_SEMANTIC_BAND_SPAN = CELL // 2
MAX_SEMANTIC_BAND_SPAN = CELL + CELL // 2
MAX_VERTICAL_CLUSTER_BRIDGE = 12
MIN_SIGNIFICANT_CLUSTER_ROWS = 8
MIN_SIGNIFICANT_CLUSTER_PIXELS = 64
MIN_SIGNIFICANT_CLUSTER_SHARE = 0.15
MIN_COMBINED_UI_SPAN = CELL + CELL // 2
MAX_COMBINED_UI_SPAN = CELL * 2 + CELL // 2
QUIET_WINDOW_MIN_ROWS = 4
QUIET_WINDOW_MAX_ROWS = 8
QUIET_CONTEXT_RADIUS = 96
QUIET_CONTEXT_SAMPLE_ROWS = 12
MIN_ADJACENT_CONTENT_ROW_MASS = 64
MAX_QUIET_MEAN_ROW_MASS = 12
MAX_QUIET_SINGLE_ROW_MASS = 24
MAX_QUIET_QUARTER_MASS_PER_ROW = 3
MAX_QUIET_RELATIVE_SHARE = 0.04


@dataclass(frozen=True)
class SemanticBand:
    row: int
    interval_start: int
    interval_end: int
    content_start: int
    content_end: int


@dataclass(frozen=True)
class QuietWindow:
    cut: int
    start: int
    end: int
    active_pixel_mass: int
    max_row_mass: int
    relative_share: float
    opacity_cost: int


@dataclass(frozen=True)
class QuietPartition:
    windows: tuple[QuietWindow, ...]
    geometry_cost: int
    opacity_cost: int

    @property
    def cuts(self) -> list[int]:
        return [window.cut for window in self.windows]

    @property
    def total_cost(self) -> int:
        return self.geometry_cost + self.opacity_cost


class NormalizationError(ValueError):
    """Raised when atlas geometry cannot be normalized without guessing."""


def clear_low_alpha(image: Image.Image, threshold: int) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = bytearray(rgba.tobytes())
    for offset in range(0, len(pixels), 4):
        if pixels[offset + 3] <= threshold:
            pixels[offset : offset + 4] = b"\x00\x00\x00\x00"
    return Image.frombytes("RGBA", rgba.size, bytes(pixels))


def alpha_histogram_y(image: Image.Image) -> list[int]:
    alpha = image.getchannel("A")
    return [sum(alpha.crop((0, y, WIDTH, y + 1)).histogram()[1:]) for y in range(HEIGHT)]


def find_quiet_gap_candidates(histogram: list[int]) -> list[int]:
    """Return midpoints of meaningful full-width transparent runs.

    A single transparent row or a local alpha valley is not a semantic cut.
    The generated atlas contract requires a real transparent gutter, so a run
    shorter than MIN_SEMANTIC_GAP_ROWS is deliberately ignored.
    """

    candidates: list[int] = []
    start: int | None = None
    for row, active_pixels in enumerate([*histogram, 1]):
        if active_pixels == 0 and start is None:
            start = row
        elif active_pixels != 0 and start is not None:
            end = row
            if start > 0 and end < HEIGHT and end - start >= MIN_SEMANTIC_GAP_ROWS:
                candidates.append((start + end - 1) // 2)
            start = None
    return candidates


def _quarter_alpha_histograms(image: Image.Image) -> list[list[int]]:
    alpha = image.getchannel("A")
    quarters: list[list[int]] = []
    for column in range(4):
        quarter = alpha.crop((column * CELL, 0, (column + 1) * CELL, HEIGHT))
        quarters.append(
            [
                sum(quarter.crop((0, y, CELL, y + 1)).histogram()[1:])
                for y in range(HEIGHT)
            ]
        )
    return quarters


def _context_peak_row_mass(histogram: list[int], start: int, end: int) -> float:
    """Return the densest nearby content sample, never a one-row spike."""

    if end - start < QUIET_CONTEXT_SAMPLE_ROWS:
        return 0.0
    prefix = [0]
    for value in histogram[start:end]:
        prefix.append(prefix[-1] + value)
    return max(
        (prefix[index + QUIET_CONTEXT_SAMPLE_ROWS] - prefix[index])
        / QUIET_CONTEXT_SAMPLE_ROWS
        for index in range(len(prefix) - QUIET_CONTEXT_SAMPLE_ROWS)
    )


def find_calm_window_candidates(image: Image.Image, histogram: list[int]) -> list[QuietWindow]:
    """Find low-mass separator windows after strict zero gutters failed.

    These are not arbitrary alpha valleys. Every accepted window is nearly
    empty in absolute terms, nearly empty in every 256px quarter, and at most
    four percent as dense as substantial content found on *both* sides. This
    prevents a thin visual tier, horizontal rule, or missing semantic band from
    being reinterpreted as a separator.
    """

    quarters = _quarter_alpha_histograms(image)
    best_by_cut: dict[int, QuietWindow] = {}
    for height in range(QUIET_WINDOW_MAX_ROWS, QUIET_WINDOW_MIN_ROWS - 1, -1):
        for start in range(1, HEIGHT - height):
            end = start + height
            row_values = histogram[start:end]
            total_mass = sum(row_values)
            max_row_mass = max(row_values)
            if total_mass > MAX_QUIET_MEAN_ROW_MASS * height:
                continue
            if max_row_mass > MAX_QUIET_SINGLE_ROW_MASS:
                continue
            if any(
                sum(quarter[start:end]) > MAX_QUIET_QUARTER_MASS_PER_ROW * height
                for quarter in quarters
            ):
                continue

            left_peak = _context_peak_row_mass(
                histogram, max(0, start - QUIET_CONTEXT_RADIUS), start
            )
            right_peak = _context_peak_row_mass(
                histogram, end, min(HEIGHT, end + QUIET_CONTEXT_RADIUS)
            )
            adjacent_peak = min(left_peak, right_peak)
            if adjacent_peak < MIN_ADJACENT_CONTENT_ROW_MASS:
                continue
            mean_mass = total_mass / height
            relative_share = mean_mass / adjacent_peak
            if relative_share > MAX_QUIET_RELATIVE_SHARE:
                continue

            cut = start + height // 2
            # Geometry remains the primary contract; alpha mass and relative
            # density break close grid choices in favour of cleaner windows.
            opacity_cost = (
                total_mass * 32
                + max_row_mass * 8
                + round(relative_share * 10_000)
            )
            candidate = QuietWindow(
                cut=cut,
                start=start,
                end=end,
                active_pixel_mass=total_mass,
                max_row_mass=max_row_mass,
                relative_share=relative_share,
                opacity_cost=opacity_cost,
            )
            previous = best_by_cut.get(cut)
            if previous is None or (
                candidate.opacity_cost,
                -height,
                start,
            ) < (
                previous.opacity_cost,
                -(previous.end - previous.start),
                previous.start,
            ):
                best_by_cut[cut] = candidate
    return sorted(best_by_cut.values(), key=lambda candidate: candidate.cut)


def _select_calm_partition(
    candidates: list[QuietWindow],
    target_spans: list[int],
    minimum_spans: list[int],
    maximum_spans: list[int],
) -> QuietPartition:
    cut_count = len(target_spans) - 1
    if len(candidates) < cut_count:
        raise NormalizationError(
            f"found only {len(candidates)} strict calm-window candidates for {cut_count} cuts"
        )

    # State is (geometry cost, opacity cost, tuple of candidate indexes).
    levels: dict[int, tuple[int, int, tuple[int, ...]]] = {}
    for index, candidate in enumerate(candidates):
        span = candidate.cut
        if minimum_spans[0] <= span <= maximum_spans[0]:
            levels[index] = (
                (span - target_spans[0]) ** 2,
                candidate.opacity_cost,
                (index,),
            )

    for selected in range(1, cut_count):
        next_levels: dict[int, tuple[int, int, tuple[int, ...]]] = {}
        for index, candidate in enumerate(candidates):
            choices: list[tuple[int, int, tuple[int, ...]]] = []
            for previous_index, (geometry_cost, opacity_cost, path) in levels.items():
                if previous_index >= index:
                    continue
                span = candidate.cut - candidates[previous_index].cut
                if minimum_spans[selected] <= span <= maximum_spans[selected]:
                    choices.append(
                        (
                            geometry_cost + (span - target_spans[selected]) ** 2,
                            opacity_cost + candidate.opacity_cost,
                            (*path, index),
                        )
                    )
            if choices:
                next_levels[index] = min(
                    choices,
                    key=lambda item: (item[0] + item[1], item[0], item[2]),
                )
        levels = next_levels

    finalists: list[tuple[int, int, tuple[int, ...]]] = []
    for final_index, (geometry_cost, opacity_cost, path) in levels.items():
        final_span = HEIGHT - candidates[final_index].cut
        if minimum_spans[-1] <= final_span <= maximum_spans[-1]:
            finalists.append(
                (
                    geometry_cost + (final_span - target_spans[-1]) ** 2,
                    opacity_cost,
                    path,
                )
            )
    if not finalists:
        raise NormalizationError("no safe global calm-window partition exists")
    geometry_cost, opacity_cost, path = min(
        finalists,
        key=lambda item: (item[0] + item[1], item[0], item[2]),
    )
    return QuietPartition(
        windows=tuple(candidates[index] for index in path),
        geometry_cost=geometry_cost,
        opacity_cost=opacity_cost,
    )


def select_calm_six_band_partition(candidates: list[QuietWindow]) -> QuietPartition:
    return _select_calm_partition(
        candidates,
        [CELL] * ROW_COUNT,
        [MIN_SEMANTIC_BAND_SPAN] * ROW_COUNT,
        [MAX_SEMANTIC_BAND_SPAN] * ROW_COUNT,
    )


def select_calm_combined_ui_partition(candidates: list[QuietWindow]) -> QuietPartition:
    return _select_calm_partition(
        candidates,
        [CELL * 2, *([CELL] * (ROW_COUNT - 2))],
        [MIN_COMBINED_UI_SPAN, *([MIN_SEMANTIC_BAND_SPAN] * (ROW_COUNT - 2))],
        [MAX_COMBINED_UI_SPAN, *([MAX_SEMANTIC_BAND_SPAN] * (ROW_COUNT - 2))],
    )


def select_semantic_cuts(candidates: list[int]) -> list[int]:
    """Choose five global gaps whose six spans best preserve the 256px grid.

    This dynamic program groups internal transparent UI tiers into their
    surrounding semantic strip instead of greedily assigning the nearest
    local zero/valley to each nominal 256px boundary.
    """

    if len(candidates) < ROW_COUNT - 1:
        raise NormalizationError(
            "expected exactly six semantic bands; "
            f"found only {len(candidates)} full-width semantic gap candidates"
        )

    levels: dict[int, tuple[int, list[int]]] = {}
    for index, cut in enumerate(candidates):
        span = cut
        if MIN_SEMANTIC_BAND_SPAN <= span <= MAX_SEMANTIC_BAND_SPAN:
            levels[index] = ((span - CELL) ** 2, [cut])

    for _selected in range(2, ROW_COUNT):
        next_levels: dict[int, tuple[int, list[int]]] = {}
        for index, cut in enumerate(candidates):
            choices: list[tuple[int, list[int]]] = []
            for previous_index, (cost, path) in levels.items():
                if previous_index >= index:
                    continue
                span = cut - candidates[previous_index]
                if MIN_SEMANTIC_BAND_SPAN <= span <= MAX_SEMANTIC_BAND_SPAN:
                    choices.append((cost + (span - CELL) ** 2, [*path, cut]))
            if choices:
                next_levels[index] = min(choices, key=lambda item: (item[0], item[1]))
        levels = next_levels

    finalists: list[tuple[int, list[int]]] = []
    for index, (cost, path) in levels.items():
        final_span = HEIGHT - candidates[index]
        if MIN_SEMANTIC_BAND_SPAN <= final_span <= MAX_SEMANTIC_BAND_SPAN:
            finalists.append((cost + (final_span - CELL) ** 2, path))
    if not finalists:
        raise NormalizationError(
            "expected exactly six semantic bands; no safe global gap partition exists"
        )
    return min(finalists, key=lambda item: (item[0], item[1]))[1]


def select_combined_ui_cuts(candidates: list[int]) -> list[int]:
    """Choose four gaps for one combined 2-row UI band plus four atlas rows."""

    finalists: list[tuple[int, list[int]]] = []
    for path_tuple in combinations(candidates, ROW_COUNT - 2):
        path = list(path_tuple)
        spans = [path[0], *[right - left for left, right in zip(path, path[1:])], HEIGHT - path[-1]]
        if not MIN_COMBINED_UI_SPAN <= spans[0] <= MAX_COMBINED_UI_SPAN:
            continue
        if any(
            not MIN_SEMANTIC_BAND_SPAN <= span <= MAX_SEMANTIC_BAND_SPAN
            for span in spans[1:]
        ):
            continue
        cost = (spans[0] - CELL * 2) ** 2 + sum((span - CELL) ** 2 for span in spans[1:])
        finalists.append((cost, path))
    if not finalists:
        raise NormalizationError(
            "expected six semantic rows or one combined two-row UI band; "
            "no safe five-band partition exists"
        )
    return min(finalists, key=lambda item: (item[0], item[1]))[1]


def vertical_alpha_clusters(
    histogram: list[int],
    offset: int,
) -> list[tuple[int, int, int]]:
    raw_clusters: list[tuple[int, int, int]] = []
    start: int | None = None
    mass = 0
    for relative_row, active_pixels in enumerate([*histogram, 0]):
        if active_pixels > 0:
            if start is None:
                start = relative_row
            mass += active_pixels
        elif start is not None:
            raw_clusters.append((offset + start, offset + relative_row, mass))
            start = None
            mass = 0

    merged: list[tuple[int, int, int]] = []
    for start, end, cluster_mass in raw_clusters:
        if merged and start - merged[-1][1] <= MAX_VERTICAL_CLUSTER_BRIDGE:
            previous_start, _previous_end, previous_mass = merged[-1]
            merged[-1] = (previous_start, end, previous_mass + cluster_mass)
        else:
            merged.append((start, end, cluster_mass))
    return merged


def validate_animation_vertical_clusters(
    image: Image.Image,
    bands: list[SemanticBand],
) -> None:
    """Reject an animation cell containing two substantial object tiers."""

    alpha = image.getchannel("A")
    for band in bands:
        for column in range(4):
            quarter = alpha.crop(
                (
                    column * CELL,
                    band.interval_start,
                    (column + 1) * CELL,
                    band.interval_end,
                )
            )
            histogram = [
                sum(quarter.crop((0, y, CELL, y + 1)).histogram()[1:])
                for y in range(quarter.height)
            ]
            total_mass = sum(histogram)
            if total_mass == 0:
                continue
            clusters = vertical_alpha_clusters(histogram, band.interval_start)
            significant = [
                (start, end, mass)
                for start, end, mass in clusters
                if end - start >= MIN_SIGNIFICANT_CLUSTER_ROWS
                and mass >= MIN_SIGNIFICANT_CLUSTER_PIXELS
                and mass / total_mass >= MIN_SIGNIFICANT_CLUSTER_SHARE
            ]
            if len(significant) > 1:
                tiers = ", ".join(f"{start}..{end - 1}" for start, end, _mass in significant)
                raise NormalizationError(
                    f"ambiguous semantic row {band.row}, cell {column}: "
                    f"multiple vertical object tiers ({tiers})"
                )


def _content_bounds(histogram: list[int], start: int, end: int, label: str) -> tuple[int, int]:
    active_rows = [y for y in range(start, end) if histogram[y] > 0]
    if not active_rows:
        raise NormalizationError(f"{label} is empty")
    return active_rows[0], active_rows[-1] + 1


def _build_six_bands(histogram: list[int], cuts: list[int]) -> list[SemanticBand]:
    edges = [0, *cuts, HEIGHT]
    bands: list[SemanticBand] = []
    for row, (start, end) in enumerate(zip(edges, edges[1:])):
        content_start, content_end = _content_bounds(
            histogram, start, end, f"semantic row {row}"
        )
        expected_center = row * CELL + CELL // 2
        content_center = (content_start + content_end) / 2
        if abs(content_center - expected_center) > 150:
            raise NormalizationError(
                f"ambiguous semantic row {row}: content center {content_center:.1f} is too far from {expected_center}"
            )
        bands.append(SemanticBand(row, start, end, content_start, content_end))
    return bands


def _build_combined_ui_bands(histogram: list[int], cuts: list[int]) -> list[SemanticBand]:
    source_edges = [0, *cuts, HEIGHT]
    first_start, first_end = _content_bounds(
        histogram, source_edges[0], source_edges[1], "combined semantic UI band"
    )
    split = first_start + (first_end - first_start) // 2
    if split - first_start < MIN_SEMANTIC_BAND_SPAN or first_end - split < MIN_SEMANTIC_BAND_SPAN:
        raise NormalizationError("combined semantic UI band cannot be split into two substantial rows")
    bands = [
        SemanticBand(0, source_edges[0], split, first_start, split),
        SemanticBand(1, split, source_edges[1], split, first_end),
    ]
    for target_row, (start, end) in enumerate(zip(source_edges[1:], source_edges[2:]), start=2):
        content_start, content_end = _content_bounds(
            histogram, start, end, f"semantic row {target_row}"
        )
        bands.append(
            SemanticBand(target_row, start, end, content_start, content_end)
        )
    if len(bands) != ROW_COUNT:
        raise NormalizationError(f"expected exactly six semantic rows, got {len(bands)}")
    return bands


def _partition_geometry_cost(cuts: list[int], targets: list[int]) -> int:
    edges = [0, *cuts, HEIGHT]
    spans = [right - left for left, right in zip(edges, edges[1:])]
    return sum((span - target) ** 2 for span, target in zip(spans, targets))


def _clear_quiet_windows(
    image: Image.Image, windows: tuple[QuietWindow, ...]
) -> tuple[Image.Image, list[list[int]]]:
    """Clear only the validated window and contiguous dust-like edge rows.

    The expansion avoids leaving one halo pixel to distort a subsequent alpha
    bounding box. It stops as soon as either the full row or any 256px quarter
    exceeds the same tiny per-row limits used by calm-window qualification.
    """

    sanitized = image.copy()
    alpha = sanitized.getchannel("A")
    histogram = alpha_histogram_y(image)
    quarters = _quarter_alpha_histograms(image)
    cleared_rows: list[list[int]] = []

    def is_dust_row(row: int) -> bool:
        return (
            histogram[row] <= MAX_QUIET_MEAN_ROW_MASS
            and all(
                quarter[row] <= MAX_QUIET_QUARTER_MASS_PER_ROW
                for quarter in quarters
            )
        )

    for window in windows:
        start = window.start
        end = window.end
        while start > 0 and is_dust_row(start - 1):
            start -= 1
        while end < HEIGHT and is_dust_row(end):
            end += 1
        alpha.paste(0, (0, start, WIDTH, end))
        cleared_rows.append([start, end])
    sanitized.putalpha(alpha)
    return sanitized, cleared_rows


def detect_semantic_bands(
    image: Image.Image,
) -> tuple[list[SemanticBand], list[int], str, Image.Image, dict[str, object]]:
    histogram = alpha_histogram_y(image)
    candidates = find_quiet_gap_candidates(histogram)
    mode = "six-bands"
    semantic_source = image
    detection: dict[str, object] | None = None
    try:
        cuts = select_semantic_cuts(candidates)
        bands = _build_six_bands(histogram, cuts)
        geometry_cost = _partition_geometry_cost(cuts, [CELL] * ROW_COUNT)
    except NormalizationError as six_band_error:
        try:
            source_cuts = select_combined_ui_cuts(candidates)
            bands = _build_combined_ui_bands(histogram, source_cuts)
            cuts = [bands[0].interval_end, *source_cuts]
            mode = "combined-ui-five-bands"
            geometry_cost = _partition_geometry_cost(
                source_cuts, [CELL * 2, *([CELL] * (ROW_COUNT - 2))]
            )
        except NormalizationError as combined_error:
            calm_candidates = find_calm_window_candidates(image, histogram)
            try:
                partition = select_calm_six_band_partition(calm_candidates)
                semantic_source, cleared_rows = _clear_quiet_windows(
                    image, partition.windows
                )
                semantic_histogram = alpha_histogram_y(semantic_source)
                cuts = partition.cuts
                bands = _build_six_bands(semantic_histogram, cuts)
                mode = "six-bands"
            except NormalizationError as calm_six_error:
                try:
                    partition = select_calm_combined_ui_partition(calm_candidates)
                    semantic_source, cleared_rows = _clear_quiet_windows(
                        image, partition.windows
                    )
                    semantic_histogram = alpha_histogram_y(semantic_source)
                    source_cuts = partition.cuts
                    bands = _build_combined_ui_bands(semantic_histogram, source_cuts)
                    cuts = [bands[0].interval_end, *source_cuts]
                    mode = "combined-ui-five-bands"
                except NormalizationError as calm_combined_error:
                    raise NormalizationError(
                        f"{six_band_error}; {combined_error}; "
                        f"strict calm-window fallback failed: {calm_six_error}; "
                        f"{calm_combined_error}"
                    ) from calm_combined_error
            detection = {
                "mode": "strict-calm-window-dp",
                "fallbackUsed": True,
                "candidateCount": len(calm_candidates),
                "cuts": partition.cuts,
                "geometryCost": partition.geometry_cost,
                "opacityCost": partition.opacity_cost,
                "totalCost": partition.total_cost,
                "quietWindows": [
                    {
                        "cut": window.cut,
                        "rows": [window.start, window.end],
                        "activePixelMass": window.active_pixel_mass,
                        "maxRowMass": window.max_row_mass,
                        "relativeShare": round(window.relative_share, 6),
                        "opacityCost": window.opacity_cost,
                        "clearedRows": cleared,
                    }
                    for window, cleared in zip(partition.windows, cleared_rows)
                ],
            }
    if detection is None:
        detection = {
            "mode": "full-width-transparent-gutters",
            "fallbackUsed": False,
            "candidateCount": len(candidates),
            "cuts": cuts[1:] if mode == "combined-ui-five-bands" else cuts,
            "geometryCost": geometry_cost,
            "opacityCost": 0,
            "totalCost": geometry_cost,
            "quietWindows": [],
        }
    validate_animation_vertical_clusters(semantic_source, bands[2:])
    return bands, cuts, mode, semantic_source, detection


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def aspect_fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    if image.width < 1 or image.height < 1:
        raise NormalizationError("cannot scale an empty semantic asset")
    scale = min(max_width / image.width, max_height / image.height)
    width = max(1, min(max_width, round(image.width * scale)))
    height = max(1, min(max_height, round(image.height * scale)))
    return image.resize((width, height), Image.Resampling.NEAREST)


def paste_ui_strip(
    source: Image.Image,
    output: Image.Image,
    band: SemanticBand,
    ui_guard: int,
) -> dict[str, object]:
    strip = source.crop((0, band.content_start, WIDTH, band.content_end))
    bbox = alpha_bbox(strip)
    if bbox is None:
        raise NormalizationError(f"semantic UI row {band.row} is empty")
    target_height = CELL - 2 * ui_guard
    # UI rows are full-width strips. Only normalize their y geometry; changing
    # x scale would shrink the authored HUD/profile frame before processor insets.
    fitted = strip.resize((WIDTH, target_height), Image.Resampling.NEAREST)
    x = 0
    y = band.row * CELL + ui_guard
    output.alpha_composite(fitted, (x, y))
    return {
        "row": band.row,
        "kind": "ui-strip",
        "sourceBbox": [0, band.content_start, WIDTH, band.content_end],
        "destination": [x, y, x + fitted.width, y + fitted.height],
    }


def paste_animation_cells(
    source: Image.Image,
    output: Image.Image,
    band: SemanticBand,
    cell_guard: int,
) -> list[dict[str, object]]:
    reports: list[dict[str, object]] = []
    available = CELL - 2 * cell_guard
    for column in range(4):
        quarter = source.crop(
            (column * CELL, band.content_start, (column + 1) * CELL, band.content_end)
        )
        bbox = alpha_bbox(quarter)
        if bbox is None:
            raise NormalizationError(
                f"semantic row {band.row}, cell {column} is empty or ambiguous"
            )
        content = quarter.crop(bbox)
        fitted = aspect_fit(content, available, available)
        x = column * CELL + cell_guard + (available - fitted.width) // 2
        y = band.row * CELL + cell_guard + (available - fitted.height) // 2
        output.alpha_composite(fitted, (x, y))
        reports.append(
            {
                "row": band.row,
                "column": column,
                "kind": "animation-cell",
                "sourceBbox": [
                    column * CELL + bbox[0],
                    band.content_start + bbox[1],
                    column * CELL + bbox[2],
                    band.content_start + bbox[3],
                ],
                "destination": [x, y, x + fitted.width, y + fitted.height],
            }
        )
    return reports


def normalize_atlas(
    source: Image.Image,
    alpha_threshold: int = DEFAULT_ALPHA_THRESHOLD,
    ui_guard: int = DEFAULT_UI_GUARD,
    cell_guard: int = DEFAULT_CELL_GUARD,
) -> tuple[Image.Image, dict[str, object]]:
    if source.size != (WIDTH, HEIGHT):
        raise NormalizationError(
            f"expected exactly {WIDTH}x{HEIGHT}, got {source.width}x{source.height}"
        )
    if not 0 <= alpha_threshold <= 16:
        raise NormalizationError("alpha threshold must be between 0 and 16")
    if not 12 <= ui_guard <= 64:
        raise NormalizationError("UI guard must be between 12 and 64")
    if not 12 <= cell_guard <= 64 or cell_guard * 2 >= CELL:
        raise NormalizationError("cell guard must be between 12 and 64")

    cleaned = clear_low_alpha(source, alpha_threshold)
    bands, cuts, mode, semantic_source, cut_detection = detect_semantic_bands(cleaned)
    output = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    assets: list[dict[str, object]] = []
    for band in bands[:2]:
        assets.append(paste_ui_strip(semantic_source, output, band, ui_guard))
    for band in bands[2:]:
        assets.extend(paste_animation_cells(semantic_source, output, band, cell_guard))

    return output, {
        "status": "ok",
        "dimensions": [WIDTH, HEIGHT],
        "alphaThreshold": alpha_threshold,
        "uiGuard": ui_guard,
        "cellGuard": cell_guard,
        "sourceBandMode": mode,
        "cuts": cuts,
        "cutDetection": cut_detection,
        "bands": [
            {
                "row": band.row,
                "interval": [band.interval_start, band.interval_end],
                "content": [band.content_start, band.content_end],
            }
            for band in bands
        ],
        "assets": assets,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--alpha-threshold", type=int, default=DEFAULT_ALPHA_THRESHOLD)
    parser.add_argument("--ui-guard", type=int, default=DEFAULT_UI_GUARD)
    parser.add_argument("--cell-guard", type=int, default=DEFAULT_CELL_GUARD)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    with Image.open(args.input) as image:
        normalized, report = normalize_atlas(
            image.convert("RGBA"),
            alpha_threshold=args.alpha_threshold,
            ui_guard=args.ui_guard,
            cell_guard=args.cell_guard,
        )
    args.out.parent.mkdir(parents=True, exist_ok=True)
    normalized.save(args.out, "PNG", optimize=True)
    print(json.dumps({**report, "output": str(args.out.resolve())}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
