from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

from PIL import Image, ImageDraw


SCRIPT_PATH = Path(__file__).with_name("normalizeUniverseCosmeticAtlas.py")
SPEC = importlib.util.spec_from_file_location("normalize_cosmetics", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


def synthetic_atlas(*, missing_band: int | None = None, empty_cell: tuple[int, int] | None = None) -> Image.Image:
    image = Image.new("RGBA", (1024, 1536), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    bands = [(18, 270), (278, 520), (530, 790), (800, 1042), (1050, 1302), (1310, 1528)]
    for row, (top, bottom) in enumerate(bands):
        if row == missing_band:
            continue
        if row < 2:
            # Glyph-like geometry verifies the normalizer remains geometric and does no OCR.
            for x in range(20, 1000, 80):
                draw.rectangle((x, top, x + 38, bottom), fill=(80, 160, 240, 255))
        else:
            for column in range(4):
                if empty_cell == (row, column):
                    continue
                left = column * 256 - (10 if column else 0)
                right = column * 256 + 245
                draw.rectangle((left, top, right, bottom), fill=(120, 70 + row * 20, 220, 255))
            if empty_cell is not None and empty_cell[0] == row:
                column = empty_cell[1]
                draw.rectangle(
                    (column * 256, top, (column + 1) * 256 - 1, bottom),
                    fill=(0, 0, 0, 0),
                )
    return image


def shifted_atlas_with_internal_ui_gap() -> Image.Image:
    """Model the Digimon geometry without using any production artwork."""

    image = Image.new("RGBA", (1024, 1536), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 21, 1023, 324), fill=(30, 120, 220, 255))
    # One semantic banner with a full-width internal transparent tier. A local
    # nearest-gap search around y=512 must not mistake it for the row-1 cut.
    draw.rectangle((0, 353, 1023, 479), fill=(40, 180, 220, 255))
    draw.rectangle((0, 501, 1023, 615), fill=(40, 180, 220, 255))
    animation_bands = [(642, 847), (858, 1059), (1071, 1268), (1289, 1496)]
    for row, (top, bottom) in enumerate(animation_bands, start=2):
        for column in range(4):
            left = column * 256 + 40
            right = column * 256 + 215
            draw.rectangle((left, top, right, bottom), fill=(90, 60 + row * 25, 230, 255))
    return image


def combined_ui_five_band_atlas() -> Image.Image:
    """Model a generated atlas that merged title and banner into one HUD frame."""

    image = Image.new("RGBA", (1024, 1536), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 8, 1023, 455), fill=(70, 90, 110, 255))
    animation_bands = [(480, 705), (730, 940), (970, 1190), (1230, 1480)]
    for row, (top, bottom) in enumerate(animation_bands, start=2):
        for column in range(4):
            left = column * 256 + 30
            right = column * 256 + 225
            draw.rectangle((left, top, right, bottom), fill=(80 + row * 20, 70, 180, 255))
    return image


def add_gutter_dust(image: Image.Image, bands: list[tuple[int, int]]) -> Image.Image:
    """Remove every 4-row zero run while keeping separators truly negligible."""

    dusty = image.copy()
    draw = ImageDraw.Draw(dusty)
    for (_left_top, left_bottom), (right_top, _right_bottom) in zip(bands, bands[1:]):
        for y in range(left_bottom + 1, right_top):
            # Two opaque halo/dust pixels exercise the fallback after alpha cleanup.
            draw.point((8 + y % 3, y), fill=(180, 220, 255, 255))
            draw.point((18 + y % 5, y), fill=(180, 220, 255, 32))
    return dusty


class NormalizeUniverseCosmeticAtlasTests(unittest.TestCase):
    def test_shifted_six_bands_and_spills_are_recomposed_with_guards(self) -> None:
        normalized, report = MODULE.normalize_atlas(synthetic_atlas())
        self.assertEqual(len(report["bands"]), 6)
        self.assertFalse(report["cutDetection"]["fallbackUsed"])
        self.assertEqual(
            report["cutDetection"]["mode"], "full-width-transparent-gutters"
        )
        self.assertEqual(report["assets"][0]["destination"], [0, 16, 1024, 240])
        self.assertEqual(report["assets"][1]["destination"], [0, 272, 1024, 496])
        self.assertEqual(normalized.size, (1024, 1536))
        alpha = normalized.getchannel("A")
        for row in (0, 1):
            self.assertIsNone(alpha.crop((0, row * 256, 1024, row * 256 + 16)).getbbox())
            self.assertIsNone(alpha.crop((0, row * 256 + 240, 1024, (row + 1) * 256)).getbbox())
        for row in range(2, 6):
            for column in range(4):
                cell = alpha.crop((column * 256, row * 256, (column + 1) * 256, (row + 1) * 256))
                self.assertIsNone(cell.crop((0, 0, 256, 24)).getbbox())
                self.assertIsNone(cell.crop((0, 232, 256, 256)).getbbox())
                self.assertIsNone(cell.crop((0, 0, 24, 256)).getbbox())
                self.assertIsNone(cell.crop((232, 0, 256, 256)).getbbox())
                self.assertIsNotNone(cell.crop((24, 24, 232, 232)).getbbox())

    def test_glyph_like_ui_content_is_preserved_without_text_logic(self) -> None:
        normalized, _ = MODULE.normalize_atlas(synthetic_atlas())
        self.assertIsNotNone(normalized.getchannel("A").crop((0, 0, 1024, 512)).getbbox())

    def test_missing_semantic_band_is_rejected(self) -> None:
        with self.assertRaisesRegex(MODULE.NormalizationError, "exactly six semantic bands"):
            MODULE.normalize_atlas(synthetic_atlas(missing_band=3))

    def test_empty_animation_cell_is_rejected(self) -> None:
        with self.assertRaisesRegex(MODULE.NormalizationError, "cell 2 is empty or ambiguous"):
            MODULE.normalize_atlas(synthetic_atlas(empty_cell=(4, 2)))

    def test_internal_ui_gap_is_not_selected_as_shifted_portal_boundary(self) -> None:
        _normalized, report = MODULE.normalize_atlas(shifted_atlas_with_internal_ui_gap())
        self.assertGreater(report["cuts"][1], 600)
        self.assertLess(report["cuts"][1], 650)
        for portal_asset in report["assets"][2:6]:
            self.assertGreaterEqual(portal_asset["sourceBbox"][1], 642)

    def test_two_substantial_vertical_tiers_in_animation_cell_are_rejected(self) -> None:
        source = shifted_atlas_with_internal_ui_gap()
        contaminated_portal_band = MODULE.SemanticBand(2, 501, 848, 501, 848)
        with self.assertRaisesRegex(MODULE.NormalizationError, "multiple vertical object tiers"):
            MODULE.validate_animation_vertical_clusters(source, [contaminated_portal_band])

    def test_combined_ui_five_band_atlas_is_split_into_six_safe_rows(self) -> None:
        normalized, report = MODULE.normalize_atlas(combined_ui_five_band_atlas())
        self.assertEqual(report["sourceBandMode"], "combined-ui-five-bands")
        self.assertEqual(len(report["bands"]), 6)
        self.assertEqual(len(report["cuts"]), 5)
        self.assertEqual(report["assets"][0]["destination"], [0, 16, 1024, 240])
        self.assertEqual(report["assets"][1]["destination"], [0, 272, 1024, 496])
        alpha = normalized.getchannel("A")
        self.assertIsNone(alpha.crop((0, 240, 1024, 272)).getbbox())
        for row in range(2, 6):
            for column in range(4):
                cell = alpha.crop((column * 256, row * 256, (column + 1) * 256, (row + 1) * 256))
                self.assertIsNone(cell.crop((0, 0, 256, 24)).getbbox())
                self.assertIsNone(cell.crop((0, 232, 256, 256)).getbbox())

    def test_strict_calm_windows_recover_dusty_six_band_gutters(self) -> None:
        bands = [(18, 270), (278, 520), (530, 790), (800, 1042), (1050, 1302), (1310, 1528)]
        normalized, report = MODULE.normalize_atlas(
            add_gutter_dust(synthetic_atlas(), bands)
        )
        detection = report["cutDetection"]
        self.assertTrue(detection["fallbackUsed"])
        self.assertEqual(detection["mode"], "strict-calm-window-dp")
        self.assertEqual(len(detection["cuts"]), 5)
        self.assertGreater(detection["opacityCost"], 0)
        self.assertEqual(
            detection["totalCost"],
            detection["geometryCost"] + detection["opacityCost"],
        )
        self.assertTrue(all(window["relativeShare"] <= 0.04 for window in detection["quietWindows"]))
        self.assertEqual(normalized.size, (1024, 1536))

    def test_strict_calm_windows_recover_dusty_combined_ui_gutters(self) -> None:
        bands = [(8, 455), (480, 705), (730, 940), (970, 1190), (1230, 1480)]
        _normalized, report = MODULE.normalize_atlas(
            add_gutter_dust(combined_ui_five_band_atlas(), bands)
        )
        self.assertEqual(report["sourceBandMode"], "combined-ui-five-bands")
        self.assertTrue(report["cutDetection"]["fallbackUsed"])
        self.assertEqual(len(report["cutDetection"]["cuts"]), 4)

    def test_calm_window_crossed_by_significant_object_is_rejected(self) -> None:
        bands = [(18, 270), (278, 520), (530, 790), (800, 1042), (1050, 1302), (1310, 1528)]
        contaminated = add_gutter_dust(synthetic_atlas(), bands)
        # This bridge joins two animation tiers across the entire separator;
        # it is far above both absolute and per-quarter calm-window limits.
        ImageDraw.Draw(contaminated).rectangle(
            (540, 1038, 620, 1054), fill=(240, 120, 80, 255)
        )
        with self.assertRaisesRegex(MODULE.NormalizationError, "calm-window fallback failed"):
            MODULE.normalize_atlas(contaminated)

    def test_missing_band_with_dust_is_still_rejected(self) -> None:
        bands = [(18, 270), (278, 520), (530, 790), (800, 1042), (1050, 1302), (1310, 1528)]
        missing = add_gutter_dust(synthetic_atlas(missing_band=3), bands)
        with self.assertRaisesRegex(MODULE.NormalizationError, "exactly six semantic bands"):
            MODULE.normalize_atlas(missing)


if __name__ == "__main__":
    unittest.main()
