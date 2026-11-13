"""Deterministic packing only: preserve generated artwork; no painted pixels."""

from pathlib import Path
import argparse
import hashlib
import json

from PIL import Image


def normalize(source: Path, destination: Path) -> dict:
    with Image.open(source) as original:
        if original.format != 'PNG' or original.mode != 'RGBA':
            raise ValueError('Expected the original static RGBA PNG.')
        image = original.copy()
    pixels = bytearray(image.tobytes())
    cleared = 0
    for index in range(0, len(pixels), 4):
        if pixels[index + 3] <= 12:
            if pixels[index + 3]:
                cleared += 1
            pixels[index:index + 4] = bytes(4)
    cleaned = Image.frombytes('RGBA', image.size, bytes(pixels))
    bounds = cleaned.getchannel('A').getbbox()
    if bounds is None:
        raise ValueError('Empty portrait.')
    subject = cleaned.crop(bounds)
    scale = min(240 / subject.width, 240 / subject.height)
    dimensions = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(dimensions, Image.Resampling.NEAREST)
    result = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
    offset = ((256 - dimensions[0]) // 2, (256 - dimensions[1]) // 2)
    result.alpha_composite(subject, offset)
    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination, format='PNG', optimize=True)
    return {
        'operation': 'alpha-noise-threshold-12+visible-bounds-crop+uniform-nearest-fit+transparent-center',
        'sourceDimensions': list(image.size),
        'alphaNoisePixelsCleared': cleared,
        'sourceVisibleBounds': list(bounds),
        'uniformScale': scale,
        'resizedDimensions': list(dimensions),
        'offset': list(offset),
        'outputDimensions': [256, 256],
        'outputVisibleBounds': list(result.getchannel('A').getbbox()),
        'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'outputSha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
        'semanticPaintingPerformed': False,
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    options = parser.parse_args()
    print(json.dumps(normalize(options.source, options.output), indent=2))
