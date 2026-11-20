"""Slice the transparent original swarm candidate and keep one cell scale/anchor."""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image

CELL = 256
BASELINE = 232
SCALE = 0.83


def pack(source, destination):
    image = Image.open(source).convert("RGBA")
    if image.size != (1254, 1254):
        raise ValueError(f"unexpected candidate size {image.size}")
    atlas = Image.new("RGBA", (1024, 1024))
    cells = []
    for row in range(4):
        for col in range(4):
            cell = image.crop((
                round(col * image.width / 4), round(row * image.height / 4),
                round((col + 1) * image.width / 4), round((row + 1) * image.height / 4),
            ))
            alpha = cell.getchannel("A").point(lambda x: 0 if x < 8 else x)
            cell.putalpha(alpha)
            box = alpha.getbbox()
            if box is None or box[0] < 3 or box[1] < 3 or box[2] > cell.width - 3 or box[3] > cell.height - 3:
                raise ValueError(f"empty or clipped cell {row}/{col}: {box}")
            cell = cell.crop(box)
            cell = cell.resize(tuple(round(v * SCALE) for v in cell.size), Image.Resampling.NEAREST)
            silhouette = cell.getchannel("A").point(lambda v: 255 if v >= 48 else 0).getbbox()
            x = round((CELL - silhouette[0] - silhouette[2]) / 2)
            y = BASELINE - silhouette[3]
            if x < 0 or y < 0 or x + cell.width > CELL or y + cell.height > CELL:
                raise ValueError(f"padded cell {row}/{col} would clip at {(x, y)}")
            atlas.paste(cell, (col * CELL + x, row * CELL + y))
            cells.append({"row": row, "col": col, "sourceBounds": box,
                          "scaledSize": cell.size, "offset": (x, y), "baseline": y + silhouette[3]})
    atlas.save(destination, optimize=True)
    print(json.dumps({
        "rawSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "pngSha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
        "rawDimensions": image.size, "dimensions": atlas.size,
        "scale": SCALE, "baseline": BASELINE, "cells": cells,
    }, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    pack(args.source, args.destination)
