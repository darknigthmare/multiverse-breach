"""Slice one candidate on the regular 4x4 grid, with one crop scale per boss."""

import argparse
from hashlib import sha256
import json
from pathlib import Path

from PIL import Image

CELL = 192
MAPPING = {'phare': (0.60, 177, 182), 'kraken': (0.55, 151, 183)}


def make_atlas(name, source, destination):
    scale, visible_bottom, ground = MAPPING[name]
    sheet = Image.open(source).convert('RGBA')
    atlas = Image.new('RGBA', (CELL * 4, CELL * 4))
    output = []
    for row in range(4):
        for col in range(4):
            cell = sheet.crop((
                round(col * sheet.width / 4), round(row * sheet.height / 4),
                round((col + 1) * sheet.width / 4), round((row + 1) * sheet.height / 4),
            ))
            alpha = cell.getchannel('A')
            bounds = alpha.point(lambda value: 255 if value >= 48 else 0).getbbox()
            if not bounds or min(bounds[0], bounds[1], cell.width - bounds[2], cell.height - bounds[3]) < 5:
                raise ValueError(f'{name} cell {row}/{col} lacks gutters: {bounds}')
            cell.putalpha(alpha.point(lambda value: value if value >= 8 else 0))
            cell = cell.crop((bounds[0] - 2, bounds[1] - 2, bounds[2] + 2, bounds[3] + 2))
            cell = cell.resize(tuple(round(value * scale) for value in cell.size), Image.Resampling.NEAREST)
            # Use the opaque body rather than the low-opacity edge for the anchor.
            body = cell.getchannel('A').point(lambda value: 255 if value >= 48 else 0).getbbox()
            x = round((CELL - body[0] - body[2]) / 2)
            y = visible_bottom - body[3]
            if min(x, y, CELL - x - cell.width, CELL - y - cell.height) < 2:
                raise ValueError(f'{name} cell {row}/{col} outside padded atlas.')
            atlas.paste(cell, (col * CELL + x, row * CELL + y))
            output.append(dict(row=row, col=col, sourceBounds=bounds, offset=[x, y],
                               visibleBounds=[x + body[0], y + body[1], x + body[2], y + body[3]]))
    atlas.save(destination, optimize=True)
    print(json.dumps(dict(rawDimensions=sheet.size, atlasDimensions=atlas.size, scale=scale,
                          visibleBottom=visible_bottom, baseline=ground, frames=output,
                          rawSha256=sha256(source.read_bytes()).hexdigest(),
                          intermediateSha256=sha256(destination.read_bytes()).hexdigest()), indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('name', choices=MAPPING)
    parser.add_argument('source', type=Path)
    parser.add_argument('destination', type=Path)
    args = parser.parse_args()
    make_atlas(args.name, args.source, args.destination)
