"""Author the original Pachakuti boss atlas on transparent, 256 px cells."""

from math import cos, pi, sin
from pathlib import Path
from random import Random
import argparse

from PIL import Image, ImageDraw, ImageFilter

CELL = 256
BASELINE = 232
SCALE = 2
ROWS = ("idle", "run", "attack", "hit")

# Displaced pieces of roofless masonry and terrain. Avoid a central building
# or a regular plan: the collapse bends the existing roads out of alignment.
TERRACES = (
    ((26, 168), (43, 151), (77, 149), (89, 160), (107, 162), (105, 180), (91, 192), (63, 191), (47, 183), (28, 183)),
    ((147, 153), (157, 143), (187, 146), (197, 153), (219, 155), (233, 174), (223, 182), (187, 185), (175, 178), (151, 177)),
    ((25, 195), (51, 188), (76, 197), (94, 194), (107, 202), (105, 219), (86, 231), (55, 227), (43, 221), (17, 214)),
    ((124, 188), (148, 184), (170, 193), (193, 190), (211, 201), (228, 207), (225, 220), (205, 232), (182, 230), (167, 222), (143, 223), (123, 211)),
)
ROADS = (
    ((38, 174), (60, 158), (76, 158), (87, 168), (101, 169)),
    ((221, 173), (196, 166), (182, 155), (169, 156), (155, 166)),
    ((24, 208), (51, 202), (67, 212), (79, 210), (91, 202)),
    ((217, 215), (195, 209), (181, 200), (169, 207), (151, 202), (135, 203)),
)


def px(points):
    return [(round(x * SCALE), round(y * SCALE)) for x, y in points]


def layer():
    return Image.new("RGBA", (CELL * SCALE, CELL * SCALE))


def ellipse(draw, x, y, rx, ry, color):
    draw.ellipse(tuple(round(v * SCALE) for v in (x - rx, y - ry, x + rx, y + ry)), fill=color)


def path(draw, points, color, width=1):
    draw.line(px(points), fill=color, width=round(width * SCALE), joint="curve")


def ring_points(x, y, radius, start, stop, time):
    points = []
    for i in range(61):
        a = start + (stop - start) * i / 60
        r = radius + 1.4 * sin(5 * a + time) + 0.65 * cos(11 * a - time)
        points.append((x + r * cos(a), y + 0.95 * r * sin(a)))
    return points


def draw_sky(frame, state, col, time):
    x = 128 + (0, 4, 0, -4)[col] * (state == "run")
    y = 83 - (0, 3, 4, 2)[col] * (state == "attack")
    radius = 40 + (0, 2, 4, 1)[col] * (state == "attack")
    light = (250, 163, 84) if state != "hit" else (212, 175, 249)
    if state == "attack":
        light = (255, 191, 104)

    haze = layer()
    d = ImageDraw.Draw(haze)
    for r, a in ((67, 15), (57, 29), (51, 49)):
        ellipse(d, x, y, r, r * 0.89, (*light, a))
    frame.alpha_composite(haze.filter(ImageFilter.GaussianBlur(8 * SCALE)))

    d = ImageDraw.Draw(frame)
    ellipse(d, x, y, radius, radius * 0.95, (14, 12, 24, 255))
    firings = ((-2.9, -2.0), (-1.86, 0.14), (0.32, 2.12), (2.36, 3.18))
    for j, (start, stop) in enumerate(firings):
        offset = 0.13 * sin(time + j) + (col * 0.18 if state == "hit" else 0)
        interruption = (0.05, 0.13, 0.31, 0.18)[col] if state == "hit" else 0
        points = ring_points(x, y, radius, start + offset, stop + offset - interruption, time)
        path(d, points, (142, 63, 176, 215), 4.0)
        path(d, points, (*light, 255), 2.0 if j % 2 == 0 else 2.8)
        path(d, points[16:38], (255, 223, 172, 238), 1.0)
    # Three separate ribbons disappear into the shadow. They are light and
    # cloud, not a designed halo, a glyph or a targeting indicator.
    for j, (a, b) in enumerate(((-2.3, -0.65), (0.14, 1.15), (1.97, 2.67))):
        r = radius + 6 + j * 4
        p = ring_points(x + 2 * cos(time + j), y + j - 1, r, a, b, -time)
        path(d, p, (191, 94, 213, 144), 2.0 + (state == "attack"))
        path(d, p[15:39], (*light, 190), 1.0)


def terrace(frame, points, road, index, dx, dy, color_shift):
    d = ImageDraw.Draw(frame)
    point = lambda p: (p[0] + dx, p[1] + dy)
    tx = [point(p) for p in points]
    road = [point(p) for p in road]
    rng = Random(2014 + index)
    front = tx[len(tx) // 2:]
    # Stone heads, broken strata and retaining wall seams fill only the
    # front edges of the silhouette. The center is an open fracture.
    for (x1, y1), (x2, y2) in zip(front, front[1:]):
        depth = 5 if index < 2 else 7
        face = [(x1, y1), (x2, y2), (x2 - 1, min(BASELINE, y2 + depth)), (x1 - 1, min(BASELINE, y1 + depth))]
        d.polygon(px(face), fill=(44, 36, 50, 255))
        for k in (0.25, 0.58, 0.83):
            x, y = x1 + (x2 - x1) * k, y1 + (y2 - y1) * k
            path(d, [(x, y + 1), (x - 1, min(BASELINE, y + depth - 1))], (103, 79, 76, 255), 1)
    top = [(92, 77, 89), (102, 83, 82), (120, 94, 79), (111, 86, 83)][index]
    d.polygon(px(tx), fill=tuple(min(255, v + color_shift) for v in top) + (255,))
    # Clipped grit and irregular fitted seams. Do not add pixels outside a face.
    mask = Image.new("L", frame.size, 0)
    ImageDraw.Draw(mask).polygon(px(tx), fill=255)
    stones = layer()
    sd = ImageDraw.Draw(stones)
    for i in range(65):
        x = rng.randint(min(p[0] for p in points), max(p[0] for p in points)) + dx
        y = rng.randint(min(p[1] for p in points), max(p[1] for p in points)) + dy
        rx = rng.randint(2, 7)
        vertices = [(x - rx, y + 1), (x - rx + 2, y - 1), (x + 1, y - 2), (x + rx, y), (x + rx - 1, y + 2)]
        sd.polygon(px(vertices), fill=(232, 183, 129, rng.randrange(13, 49)) if i % 3 else (23, 20, 35, 105))
    stones.paste((0, 0, 0, 0), (0, 0, *frame.size), mask.point(lambda value: 255 - value))
    frame.alpha_composite(stones)
    d = ImageDraw.Draw(frame)
    path(d, tx[:5], (198, 145, 107, 245), 1.5)
    path(d, road, (63, 46, 56, 255), 6)
    path(d, road, (214, 173, 111, 255), 3)
    path(d, road[1:4], (241, 205, 144, 255), 1.0)


def render(state, col):
    frame = layer()
    time = col * pi / 2
    draw_sky(frame, state, col, time)
    d = ImageDraw.Draw(frame)
    # Frayed threads running horizontally under the sky, with broken ends.
    paths = (
        [(18, 133), (46, 129), (66, 136), (86, 133), (98, 138)],
        [(151, 140), (170, 133), (189, 138), (208, 130), (235, 136)],
        [(63, 145), (78, 141), (93, 144), (110, 146)],
    )
    for i, points in enumerate(paths):
        shifted = [(x, y + 3 * sin(time + x * 0.038)) for x, y in points]
        path(d, shifted, (135, 64, 166, 172), 2)
        path(d, shifted[1:3], (218, 151, 228, 207), 1)
        for (x, y) in shifted[1::2]:
            path(d, [(x, y), (x - 3 + i, y + 4)], (207, 125, 180, 190), 1.0)

    attack = (0, 3, 7, 2)[col] if state == "attack" else 0
    spread = (0, 2, 6, 3)[col] if state == "hit" else 0
    for i, (points, road) in enumerate(zip(TERRACES, ROADS)):
        drift = round(7 * sin(time + i)) if state == "run" else 0
        dx = drift + (-1 if i % 2 == 0 else 1) * (attack + spread)
        dy = -(i < 2) * round(2 + 2 * sin(time + i) + attack + spread / 2)
        terrace(frame, points, road, i, dx, dy, (3 * attack + 4 * spread))
    d = ImageDraw.Draw(frame)

    fissure = [(121, 163), (114, 183), (121, 195), (111, 205), (113, 216), (107, 227)]
    if state == "attack":
        path(d, fissure, (110, 43, 162, 226), 5 + attack / 2)
        path(d, fissure, (232, 155, 249, 255), 1.5 + attack / 2)
        path(d, [(120, 195), (136, 187), (156, 183), (179, 185)], (221, 109, 224, 250), 2.2)
        if attack >= 3:
            left = [(114, 183), (99, 189), (82, 184), (63, 189), (34, 183)]
            path(d, left, (122, 53, 147, 210), attack)
            path(d, left, (247, 172, 221, 255), 1.5)
    else:
        path(d, fissure, (120, 65, 162, 235), 3)
        path(d, fissure[1:4], (199, 122, 229, 245), 1.0)

    rng = Random(56)
    for i in range(22):
        x, y = rng.randrange(24, 236), rng.randrange(119, 205)
        x += 5 * cos(time + i)
        y -= 4 * sin(time + i) + (attack + spread) * (1 + (i % 3) / 3)
        rx = 0.8 + rng.random() * (1.5 + attack / 6)
        d.polygon(px([(x - rx, y), (x, y - rx), (x + rx, y + 1), (x, y + rx)]),
                  fill=(174, 100 + (i % 3) * 18, 196, 187) if i % 4 else (252, 194, 132, 231))

    # Preserve a clear contact line under the front ledges when downsampling.
    return frame.resize((CELL, CELL), Image.Resampling.LANCZOS)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    atlas = Image.new("RGBA", (CELL * 4, CELL * len(ROWS)))
    for row, state in enumerate(ROWS):
        for col in range(4):
            atlas.paste(render(state, col), (col * CELL, row * CELL))
    atlas.save(args.output, optimize=True)


if __name__ == "__main__":
    main()
