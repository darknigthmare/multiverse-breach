from pathlib import Path
import re
import unicodedata
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
HEROES_JS = ROOT / "src" / "game" / "heroes.js"
EXPANDED_JS = ROOT / "src" / "game" / "expandedUniverses.js"
OUT_ROOT = ROOT / "public" / "sprites" / "generated" / "heroes"

FRAME = 256
LOW = 64
COLS = 4
ROWS = 4


def slugify(value):
    value = unicodedata.normalize("NFD", str(value or "unknown"))
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return value or "unknown"


def js_unescape(value):
    return value.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")


def parse_base_heroes(text):
    pattern = re.compile(
        r"\{\s*id:\s*'((?:\\'|[^'])+)'\s*,\s*name:\s*'((?:\\'|[^'])+)'\s*,\s*universe:\s*'((?:\\'|[^'])+)'\s*,\s*category:\s*'((?:\\'|[^'])+)'\s*,\s*primaryColor:\s*'((?:\\'|[^'])+)'",
        re.S,
    )
    for match in pattern.finditer(text):
        yield {
            "id": js_unescape(match.group(1)),
            "name": js_unescape(match.group(2)),
            "universe": js_unescape(match.group(3)),
            "category": js_unescape(match.group(4)),
            "color": js_unescape(match.group(5)),
        }


def parse_extra_heroes(text):
    current_universe = None
    universe_pattern = re.compile(r"^\s*'((?:\\'|[^'])+)':\s*\[")
    item_pattern = re.compile(
        r"\{\s*id:\s*'((?:\\'|[^'])+)'\s*,\s*name:\s*'((?:\\'|[^'])+)'\s*,\s*cat:\s*'((?:\\'|[^'])+)'\s*,\s*color:\s*'((?:\\'|[^'])+)'\s*\}"
    )
    for line in text.splitlines():
        universe_match = universe_pattern.match(line)
        if universe_match:
            current_universe = js_unescape(universe_match.group(1))
            continue
        if current_universe and line.strip().startswith("]"):
            current_universe = None
            continue
        if not current_universe:
            continue
        for match in item_pattern.finditer(line):
            yield {
                "id": js_unescape(match.group(1)),
                "name": js_unescape(match.group(2)),
                "universe": current_universe,
                "category": js_unescape(match.group(3)),
                "color": js_unescape(match.group(4)),
            }


def parse_expanded_heroes(text):
    current_universe = None
    universe_pattern = re.compile(r"^\s*universe:\s*'((?:\\'|[^'])+)'\s*,")
    item_pattern = re.compile(
        r"\{\s*id:\s*'((?:\\'|[^'])+)'\s*,\s*name:\s*'((?:\\'|[^'])+)'\s*,\s*cat:\s*'((?:\\'|[^'])+)'\s*,\s*color:\s*'((?:\\'|[^'])+)'\s*\}"
    )
    for line in text.splitlines():
        universe_match = universe_pattern.match(line)
        if universe_match:
            current_universe = js_unescape(universe_match.group(1))
            continue
        if not current_universe:
            continue
        for match in item_pattern.finditer(line):
            yield {
                "id": js_unescape(match.group(1)),
                "name": js_unescape(match.group(2)),
                "universe": current_universe,
                "category": js_unescape(match.group(3)),
                "color": js_unescape(match.group(4)),
            }


def hex_to_rgb(value):
    value = str(value or "#888888").strip().lstrip("#")
    if len(value) == 3:
        value = "".join(ch * 2 for ch in value)
    if len(value) != 6:
        value = "888888"
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def adjust(color, amount):
    return tuple(max(0, min(255, int(c + amount))) for c in color)


def rect(draw, box, fill, outline=(8, 8, 10, 255)):
    draw.rectangle(box, fill=outline)
    x1, y1, x2, y2 = box
    if x2 - x1 > 2 and y2 - y1 > 2:
        draw.rectangle((x1 + 1, y1 + 1, x2 - 1, y2 - 1), fill=fill)


def line(draw, points, fill, width=2):
    draw.line(points, fill=(8, 8, 10, 255), width=width + 2)
    draw.line(points, fill=fill, width=width)


def draw_frame(hero, row, col):
    image = Image.new("RGBA", (LOW, LOW), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    color = hex_to_rgb(hero["color"])
    light = adjust(color, 42)
    dark = adjust(color, -48)
    accent = adjust(color, 82)
    cat = hero["category"]

    bob = [0, 1, 0, -1][col]
    step = [-3, -1, 1, 3][col]
    attack = row == 2
    hit = row == 3
    run = row == 1
    cx = 32 + (step if run else 0)
    base_y = 53 + bob

    # Shadow.
    draw.ellipse((cx - 12, base_y - 3, cx + 12, base_y + 3), fill=(0, 0, 0, 62))

    # Legs.
    leg_shift = step if run else (2 if attack else 0)
    rect(draw, (cx - 6 - leg_shift, base_y - 16, cx - 2 - leg_shift, base_y), dark)
    rect(draw, (cx + 2 + leg_shift, base_y - 16, cx + 6 + leg_shift, base_y), dark)

    # Body and head.
    body_w = 15 if cat in ("marine", "tactical") else 13
    body_h = 20 if cat == "marine" else 18
    rect(draw, (cx - body_w // 2, base_y - 36, cx + body_w // 2, base_y - 17), color)
    rect(draw, (cx - 6, base_y - 48, cx + 6, base_y - 37), light)
    draw.rectangle((cx - 4, base_y - 44, cx + 4, base_y - 42), fill=dark + (255,))

    # Shoulders/arms.
    arm_y = base_y - 32
    if attack:
        line(draw, [(cx + 7, arm_y), (cx + 21, arm_y - 8)], light + (255,), 2)
        line(draw, [(cx - 7, arm_y), (cx - 15, arm_y + 5)], dark + (255,), 2)
    else:
        swing = step if run else 0
        line(draw, [(cx + 7, arm_y), (cx + 13 + swing, arm_y + 10)], light + (255,), 2)
        line(draw, [(cx - 7, arm_y), (cx - 13 - swing, arm_y + 10)], dark + (255,), 2)

    # Role silhouette.
    if cat == "hacker":
        line(draw, [(cx + 13, arm_y + 4), (cx + 24, arm_y - 2)], (80, 245, 245, 255), 1)
        draw.rectangle((cx + 23, arm_y - 4, cx + 27, arm_y), fill=(80, 245, 245, 200))
    elif cat in ("marine", "tactical"):
        line(draw, [(cx + 13, arm_y + 1), (cx + 25, arm_y + (0 if attack else 4))], (35, 35, 38, 255), 3)
        draw.rectangle((cx + 23, arm_y - 2, cx + 30, arm_y + 2), fill=accent + (255,))
    elif cat == "slayer":
        line(draw, [(cx + 14, arm_y), (cx + 29, arm_y - (12 if attack else 4))], accent + (255,), 2)
    else:
        draw.polygon([(cx + 15, arm_y - 1), (cx + 25, arm_y + 4), (cx + 16, arm_y + 9)], fill=accent + (210,))

    # Hit/recoil overlay.
    if hit:
        draw.polygon([(cx - 18, base_y - 46), (cx - 12, base_y - 39), (cx - 22, base_y - 36)], fill=(255, 255, 255, 170))
        image = image.rotate(-5, resample=Image.Resampling.NEAREST, center=(cx, base_y - 26))

    return image.resize((FRAME, FRAME), Image.Resampling.NEAREST)


def collect_heroes():
    heroes = {}
    heroes_text = HEROES_JS.read_text(encoding="utf-8")
    expanded_text = EXPANDED_JS.read_text(encoding="utf-8")
    for source in (parse_base_heroes(heroes_text), parse_extra_heroes(heroes_text), parse_expanded_heroes(expanded_text)):
        for hero in source:
            heroes[hero["id"]] = hero
    return list(heroes.values())


def main():
    generated = []
    skipped = []
    for hero in collect_heroes():
        out_dir = OUT_ROOT / slugify(hero["universe"])
        out_path = out_dir / f"{slugify(hero['id'])}.png"
        if out_path.exists():
            skipped.append(out_path)
            continue
        sheet = Image.new("RGBA", (FRAME * COLS, FRAME * ROWS), (0, 0, 0, 0))
        for row in range(ROWS):
            for col in range(COLS):
                sheet.alpha_composite(draw_frame(hero, row, col), (col * FRAME, row * FRAME))
        out_dir.mkdir(parents=True, exist_ok=True)
        sheet.save(out_path, "PNG", optimize=True)
        generated.append(out_path)

    print(f"Generated {len(generated)} missing hero sprite sheets.")
    print(f"Skipped {len(skipped)} existing hero sprite sheets.")
    for path in generated[:80]:
        print(path.relative_to(ROOT))
    if len(generated) > 80:
        print(f"... and {len(generated) - 80} more")


if __name__ == "__main__":
    main()
