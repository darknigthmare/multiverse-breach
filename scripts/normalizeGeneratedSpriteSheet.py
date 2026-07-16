#!/usr/bin/env python3
"""Rebuild a generated 4x4 sprite sheet so no frame leaks into a neighbour cell."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image


@dataclass
class Component:
    root: int
    area: int
    bbox: tuple[int, int, int, int]
    centroid: tuple[float, float]
    runs: list[tuple[int, int, int]]


class UnionFind:
    def __init__(self) -> None:
        self.parent: list[int] = []

    def add(self) -> int:
        value = len(self.parent)
        self.parent.append(value)
        return value

    def find(self, value: int) -> int:
        while self.parent[value] != value:
            self.parent[value] = self.parent[self.parent[value]]
            value = self.parent[value]
        return value

    def union(self, left: int, right: int) -> None:
        left_root = self.find(left)
        right_root = self.find(right)
        if left_root != right_root:
            self.parent[right_root] = left_root


def row_runs(mask: np.ndarray, y: int) -> list[tuple[int, int]]:
    row = mask[y]
    padded = np.pad(row.astype(np.int8), (1, 1))
    edges = np.diff(padded)
    starts = np.flatnonzero(edges == 1)
    ends = np.flatnonzero(edges == -1) - 1
    return list(zip(starts.tolist(), ends.tolist()))


def components_from_alpha(alpha: np.ndarray) -> list[Component]:
    mask = alpha > 12
    uf = UnionFind()
    labelled_runs: list[tuple[int, int, int, int]] = []
    previous: list[tuple[int, int, int]] = []

    for y in range(mask.shape[0]):
        current: list[tuple[int, int, int]] = []
        for start, end in row_runs(mask, y):
            label = uf.add()
            current.append((start, end, label))
            labelled_runs.append((y, start, end, label))
            for prev_start, prev_end, prev_label in previous:
                if prev_start > end + 1:
                    break
                if prev_end >= start - 1:
                    uf.union(label, prev_label)
        previous = current

    grouped: dict[int, list[tuple[int, int, int]]] = {}
    for y, start, end, label in labelled_runs:
        grouped.setdefault(uf.find(label), []).append((y, start, end))

    output: list[Component] = []
    for root, runs in grouped.items():
        area = sum(end - start + 1 for _, start, end in runs)
        min_x = min(start for _, start, _ in runs)
        max_x = max(end for _, _, end in runs)
        min_y = min(y for y, _, _ in runs)
        max_y = max(y for y, _, _ in runs)
        sum_x = sum(((start + end) * (end - start + 1)) / 2 for _, start, end in runs)
        sum_y = sum(y * (end - start + 1) for y, start, end in runs)
        output.append(Component(
            root=root,
            area=area,
            bbox=(min_x, min_y, max_x + 1, max_y + 1),
            centroid=(sum_x / area, sum_y / area),
            runs=runs,
        ))
    return output


def bbox_distance(point: tuple[float, float], bbox: tuple[int, int, int, int]) -> float:
    x, y = point
    left, top, right, bottom = bbox
    dx = max(left - x, 0, x - right)
    dy = max(top - y, 0, y - bottom)
    return (dx * dx + dy * dy) ** 0.5


def build_component_layer(source: Image.Image, component: Component) -> Image.Image:
    layer = Image.new('RGBA', source.size, (0, 0, 0, 0))
    source_pixels = source.load()
    layer_pixels = layer.load()
    for y, start, end in component.runs:
        for x in range(start, end + 1):
            layer_pixels[x, y] = source_pixels[x, y]
    return layer


def normalize(input_path: Path, output_path: Path) -> dict[str, object]:
    source = Image.open(input_path).convert('RGBA')
    if source.size != (1024, 1024):
        source = source.resize((1024, 1024), Image.Resampling.LANCZOS)

    alpha = np.asarray(source.getchannel('A'))
    components = [component for component in components_from_alpha(alpha) if component.area >= 12]
    body_candidates = [component for component in components if component.area >= 3200]

    bodies_by_cell: dict[int, Component] = {}
    for component in sorted(body_candidates, key=lambda value: value.area, reverse=True):
        x, y = component.centroid
        col = max(0, min(3, int(x // 256)))
        row = max(0, min(3, int(y // 256)))
        cell = row * 4 + col
        center_x = col * 256 + 128
        center_y = row * 256 + 128
        current = bodies_by_cell.get(cell)
        distance = (x - center_x) ** 2 + (y - center_y) ** 2
        current_distance = float('inf') if current is None else (
            (current.centroid[0] - center_x) ** 2 + (current.centroid[1] - center_y) ** 2
        )
        if current is None or (component.area > current.area * 1.25 and distance < current_distance * 2):
            bodies_by_cell[cell] = component

    assignments: dict[int, list[Component]] = {cell: [] for cell in range(16)}
    body_roots = {component.root for component in bodies_by_cell.values()}
    for cell, body in bodies_by_cell.items():
        assignments[cell].append(body)

    for component in components:
        if component.root in body_roots:
            continue
        preferred_cell = min(
            bodies_by_cell,
            key=lambda cell: bbox_distance(component.centroid, bodies_by_cell[cell].bbox),
            default=None,
        )
        if preferred_cell is not None:
            distance = bbox_distance(component.centroid, bodies_by_cell[preferred_cell].bbox)
            component_row = max(0, min(3, int(component.centroid[1] // 256)))
            body_row = preferred_cell // 4
            if distance <= 88 and abs(component_row - body_row) <= 1:
                assignments[preferred_cell].append(component)

    body_heights = [body.bbox[3] - body.bbox[1] for body in bodies_by_cell.values()]
    median_height = float(np.median(body_heights)) if body_heights else 210.0
    base_scale = min(1.35, 220.0 / max(1.0, median_height))
    sheet = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    nonempty = 0
    margins: list[int] = []

    for cell in range(16):
        row, col = divmod(cell, 4)
        frame_components = assignments[cell]
        if frame_components:
            left = min(component.bbox[0] for component in frame_components)
            top = min(component.bbox[1] for component in frame_components)
            right = max(component.bbox[2] for component in frame_components)
            bottom = max(component.bbox[3] for component in frame_components)
            combined = Image.new('RGBA', source.size, (0, 0, 0, 0))
            for component in frame_components:
                combined.alpha_composite(build_component_layer(source, component))
            sprite = combined.crop((left, top, right, bottom))
        else:
            sprite = source.crop((col * 256, row * 256, (col + 1) * 256, (row + 1) * 256))
            sprite_bbox = sprite.getbbox()
            if sprite_bbox:
                sprite = sprite.crop(sprite_bbox)

        if not sprite.getbbox():
            continue

        width, height = sprite.size
        scale = min(base_scale, 232 / max(1, width), 232 / max(1, height))
        target = (max(1, round(width * scale)), max(1, round(height * scale)))
        sprite = sprite.resize(target, Image.Resampling.NEAREST)
        x = col * 256 + (256 - target[0]) // 2
        y = row * 256 + 244 - target[1]
        y = max(row * 256 + 12, y)
        sheet.alpha_composite(sprite, (x, y))
        nonempty += 1
        margins.append(min(x - col * 256, y - row * 256, (col + 1) * 256 - (x + target[0]), (row + 1) * 256 - (y + target[1])))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path)
    return {
        'input': str(input_path),
        'output': str(output_path),
        'components': len(components),
        'bodyCandidates': len(body_candidates),
        'bodyCells': len(bodies_by_cell),
        'nonemptyCells': nonempty,
        'minimumMargin': min(margins) if margins else None,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    print(json.dumps(normalize(args.input, args.output), indent=2))


if __name__ == '__main__':
    main()
