"""Focused orphan-review regression; uses real private XLSX files, no images."""
from pathlib import Path
from datetime import datetime
import hashlib
import importlib.util
import tempfile
import unittest
from unittest.mock import patch

from openpyxl import Workbook


BUILDER = Path(__file__).with_name("buildCgFidelityWorkbook.py")
SPEC = importlib.util.spec_from_file_location("cg_workbook_under_test", BUILDER)
builder = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(builder)


class ManualReviewOrphanTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix="cg-manual-orphan-test-")
        self.addCleanup(self.directory.cleanup)
        self.workbook = Path(self.directory.name) / "review.xlsx"
        self.plan = {"subjects": [{"characterId": "player_anchor", "matrix": {"CG01": {}}}],
                     "slots": [{"slot": "CG01"}]}

    def write_reviews(self, control_id="player_anchor", matrix_id="player_anchor", slot="CG01"):
        workbook = Workbook()
        workbook.remove(workbook.active)
        controls = {axis: "Conforme" for axis in builder.AXES}
        controls.update({
            "Décision manuelle": "UNIT_TEST_ONLY_NOT_A_HUMAN_APPROVAL",
            "Commentaire QA": "UNIT_TEST_CONTROL",
            "Nom du relecteur": "UNIT_TEST_REVIEWER",
            "Date de revue": datetime(2026, 11, 9, 12),
            "Cible d'incarnation manuelle": "UNIT_TEST_INCARNATION",
            "Référence visuelle validée (URL / fichier)": "UNIT_TEST_REFERENCE",
        })
        for name, headers, values in [
            ("Contrôles", builder.CONTROL_HEADERS, {"ID personnage": control_id, **controls}),
            ("Matrice CG", builder.MATRIX_HEADERS, {"ID personnage": matrix_id, "CG": slot,
             "Revue manuelle": "UNIT_TEST_REVIEW", "Commentaire QA": "UNIT_TEST_MATRIX"}),
        ]:
            sheet = workbook.create_sheet(name)
            sheet.append([name])
            sheet.append(["Synthetic unit-test values only"])
            sheet.append(headers)
            sheet.append([values.get(header) for header in headers])
        workbook.save(self.workbook)
        workbook.close()
        manual = builder.read_manual(self.workbook)
        self.assertEqual(len(manual["Contrôles"][(control_id,)]), 14)
        self.assertEqual(len(manual["Matrice CG"][(matrix_id, slot)]), 2)

    def run_build_until_collection(self):
        def read_document(name, default=None):
            return self.plan if Path(name) == builder.PLAN else {}
        with patch.object(builder, "read_json", side_effect=read_document), patch.object(
            builder, "collect_versions", side_effect=RuntimeError("REACHED_COLLECTION_AFTER_GUARD")
        ) as collect:
            try:
                builder.build(self.workbook, no_images=True)
            finally:
                self.collection_calls = collect.call_count

    def assert_rejected_without_write(self, control_id, matrix_id, slot):
        self.write_reviews(control_id, matrix_id, slot)
        before = hashlib.sha256(self.workbook.read_bytes()).hexdigest()
        with self.assertRaisesRegex(ValueError, "reconcile or export them by ID"):
            self.run_build_until_collection()
        self.assertEqual(self.collection_calls, 0)
        self.assertEqual(hashlib.sha256(self.workbook.read_bytes()).hexdigest(), before)
        self.assertFalse(self.workbook.with_suffix(".summary.json").exists())
        self.assertFalse(self.workbook.with_name("review.building.xlsx").exists())

    def test_unknown_control_identity_keeps_existing_workbook(self):
        self.assert_rejected_without_write("UNIT_TEST_ORPHAN_CONTROL", "player_anchor", "CG01")

    def test_unknown_matrix_identity_keeps_existing_workbook(self):
        self.assert_rejected_without_write("player_anchor", "UNIT_TEST_ORPHAN_MATRIX", "CG01")

    def test_unknown_matrix_slot_keeps_existing_workbook(self):
        self.assert_rejected_without_write("player_anchor", "player_anchor", "CG99")

    def test_local_matrix_slot_not_emitted_globally_keeps_existing_workbook(self):
        self.plan["subjects"][0]["matrix"]["CG99"] = {}
        self.assert_rejected_without_write("player_anchor", "player_anchor", "CG99")

    def test_known_nonempty_reviews_continue_past_guard(self):
        self.write_reviews()
        before = hashlib.sha256(self.workbook.read_bytes()).hexdigest()
        with self.assertRaisesRegex(RuntimeError, "REACHED_COLLECTION_AFTER_GUARD"):
            self.run_build_until_collection()
        self.assertEqual(self.collection_calls, 1)
        self.assertEqual(hashlib.sha256(self.workbook.read_bytes()).hexdigest(), before)


if __name__ == "__main__":
    unittest.main()
