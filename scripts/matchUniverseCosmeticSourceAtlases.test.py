import unittest
from pathlib import Path

from PIL import Image, ImageDraw

from matchUniverseCosmeticSourceAtlases import (
    Candidate,
    ROWS,
    composite_raw_strip_on_black,
    make_signature,
    rank_candidate_matches,
)


def synthetic_atlas(colors):
    atlas = Image.new("RGB", (1024, 1536), (0, 255, 0))
    draw = ImageDraw.Draw(atlas)
    for offset, (_, row_index, _) in enumerate(ROWS):
        top = row_index * 256
        color = colors[offset]
        draw.rounded_rectangle(
            (48 + offset * 30, top + 24, 974 - offset * 35, top + 230),
            radius=35 + offset * 5,
            fill=color,
            outline=(255 - color[0], 255 - color[1], 255 - color[2]),
            width=12,
        )
        draw.ellipse((350, top + 55, 670, top + 215), fill=colors[(offset + 1) % 3])
    return atlas


def signatures(atlas):
    return {
        kind: make_signature(composite_raw_strip_on_black(atlas, row_index))
        for kind, row_index, _ in ROWS
    }


def candidate(path, atlas):
    return Candidate(path=Path(path), modified_at=0, signatures=signatures(atlas))


class SourceAtlasMatcherTests(unittest.TestCase):
    def setUp(self):
        self.matching = synthetic_atlas([
            (220, 35, 40),
            (30, 130, 235),
            (245, 180, 30),
        ])
        self.nonmatching = synthetic_atlas([
            (35, 220, 210),
            (230, 35, 210),
            (50, 45, 235),
        ])
        self.final_signatures = signatures(self.matching)

    def test_unique_synthetic_match_is_high_confidence(self):
        result = rank_candidate_matches(self.final_signatures, [
            candidate("matching.png", self.matching),
            candidate("nonmatching.png", self.nonmatching),
        ])
        self.assertEqual(result["bestPath"].replace("\\", "/").split("/")[-1], "matching.png")
        self.assertEqual(result["score"], 0)
        self.assertGreater(result["secondBestMargin"], 0.005)
        self.assertEqual(result["confidence"], "high")

    def test_synthetic_nonmatch_is_low_confidence(self):
        result = rank_candidate_matches(
            self.final_signatures,
            [candidate("nonmatching.png", self.nonmatching)],
        )
        self.assertGreater(result["score"], 0.045)
        self.assertEqual(result["confidence"], "low")

    def test_duplicate_synthetic_matches_are_ambiguous(self):
        result = rank_candidate_matches(self.final_signatures, [
            candidate("duplicate-a.png", self.matching),
            candidate("duplicate-b.png", self.matching),
        ])
        self.assertEqual(result["score"], 0)
        self.assertEqual(result["secondBestMargin"], 0)
        self.assertEqual(result["confidence"], "ambiguous")


if __name__ == "__main__":
    unittest.main()
