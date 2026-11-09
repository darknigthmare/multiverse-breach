"""Focused image-selection checks; no workbook construction or public writes."""
from copy import deepcopy
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("cg_visual_selection", Path(__file__).with_name("buildCgFidelityWorkbook.py"))
builder = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(builder)


class VisualSelectionTests(unittest.TestCase):
    def setUp(self):
        self.record = {"characterId": "source_actor", "universe": "Source World", "incarnation": "Exact source incarnation",
                       "asset": "/sprites/old.png", "reason": "WRONG_ART"}
        self.subject = {"characterId": "source_actor", "universe": "Source World", "entryIds": [],
                        "identity": {"incarnation": "Exact source incarnation", "runtimeSpriteQuarantine": self.record,
                                     "localCandidates": [{"path": "/sprites/old.png"}]}}
        self.bible = {"incarnation": {"label": "Exact source incarnation"},
                      "localVisuals": [{"path": "/sprites/old.png", "selectedInRuntime": True}]}
        self.local = patch.object(builder, "local_path", side_effect=lambda value: Path(value) if value else None)
        self.local.start()
        self.addCleanup(self.local.stop)

    def test_null_runtime_cannot_reintroduce_stale_selected_or_manifest_bitmap(self):
        path, role = builder.subject_visual(self.subject, self.bible, {}, {})
        self.assertEqual(path, "")
        self.assertIn("OLD", role)
        self.assertFalse(builder.current_project_candidate(self.subject, self.bible, self.bible["localVisuals"][0]))

    def test_an_independent_reference_does_not_become_a_current_project_sprite(self):
        self.bible["localVisuals"].append({"path": "/reference.jpg", "role": "independent-canon-reference"})
        self.assertEqual(builder.subject_visual(self.subject, self.bible, {}, {})[0], "")

    def test_absolute_or_alternate_sprite_path_cannot_bypass_null_runtime(self):
        self.bible["localVisuals"][0]["path"] = "/workspace/project/public/sprites/alternate.png"
        self.assertEqual(builder.subject_visual(self.subject, self.bible, {}, {})[0], "")

    def test_real_delivered_cg_stays_a_project_visual_without_certifying_it(self):
        self.subject["entryIds"] = ["delivered"]
        path, role = builder.subject_visual(self.subject, self.bible, {"delivered": {"thumbnailPath": "/cg/real.webp"}},
                                            {"delivered": {"type": "characterSolo"}})
        self.assertEqual(path, "/cg/real.webp")
        self.assertIn("pas une source canon indépendante", role)

    def test_other_actor_universe_and_incarnation_are_not_blocked_by_id_alone(self):
        for field, value in [("characterId", "other_actor"), ("universe", "Other World"), ("incarnation", "Other incarnation")]:
            subject, bible = deepcopy(self.subject), deepcopy(self.bible)
            if field == "incarnation":
                subject["identity"]["incarnation"] = value
                bible["incarnation"]["label"] = value
            else:
                subject[field] = value
            self.assertEqual(builder.subject_visual(subject, bible, {}, {})[0], "/sprites/old.png")

    def test_archival_variant_is_retained_but_never_selected(self):
        self.subject["identity"].pop("runtimeSpriteQuarantine")
        self.bible["localVisuals"][0].update({"archivalOnly": True, "runtimeEligible": False})
        self.subject["identity"]["localCandidates"] = []
        self.assertEqual(builder.subject_visual(self.subject, self.bible, {}, {})[0], "")
        self.assertEqual(self.bible["localVisuals"][0]["path"], "/sprites/old.png")

    def test_missing_or_empty_scope_fields_cannot_create_a_quarantine(self):
        for key in ["characterId", "universe", "incarnation"]:
            for value in [None, "", " "]:
                subject, bible = deepcopy(self.subject), deepcopy(self.bible)
                subject["identity"]["runtimeSpriteQuarantine"][key] = value
                if key == "incarnation":
                    subject["identity"]["incarnation"] = value
                    bible["incarnation"]["label"] = value
                else:
                    subject[key] = value
                self.assertIsNone(builder.runtime_sprite_quarantine(subject, bible))
                self.assertEqual(builder.subject_visual(subject, bible, {}, {})[0], "/sprites/old.png")


if __name__ == "__main__":
    unittest.main()
