"""Strict quarantine/count regressions; synthetic rows, no bitmap generation."""
import csv
import unittest
from unittest.mock import patch

import auditCharacterReferenceQuality as audit


def catalog_rows():
    with audit.QUARANTINE_REVIEW_PATH.open(encoding="utf-8", newline="") as handle:
        reviews = {row["actorId"]: row for row in csv.DictReader(handle)}
    rows = []
    for stage_id, (actor_id, reason) in audit.EXPECTED_QUARANTINED_SOURCE_ARCS.items():
        review = reviews[actor_id]
        rows.append({
            "id": stage_id, "personnage": review["character"], "univers": ["Star Wars"],
            "candidatsReferencesLocalesAudit": [], "referencesLocalesOpenAI": [],
            "sourceSpriteQuarantine": {
                "heroId": actor_id, "universe": "Star Wars", "incarnation": review["incarnation"],
                "asset": review["spritePath"], "sha256": review["fileSha256"], "reason": reason,
                "artApproved": False,
            },
        })
    rows.append({"id": 100000, "personnage": "Synthetic control", "univers": ["Fixture"],
                 "candidatsReferencesLocalesAudit": ["/fixture-control.png"], "referencesLocalesOpenAI": []})
    return rows


def report_fixture():
    rows = catalog_rows()
    entries = []
    for row in rows:
        quarantined = "sourceSpriteQuarantine" in row
        entry = {"id": row["id"], "character": row["personnage"], "universes": row["univers"],
                 "localReferences": row["candidatsReferencesLocalesAudit"],
                 "classification": "needs-review" if quarantined else "approved",
                 "reasons": ["no-local-reference"] if quarantined else ["all-local-references-approved"]}
        if quarantined:
            entry["sourceSpriteQuarantine"] = row["sourceSpriteQuarantine"]
        entries.append(entry)
    return {"summary": {"characterArcEntryCount": len(rows), "uniqueReferencePathCount": 1,
                        "explicitSourceSpriteQuarantineCount": 3},
            "entries": entries, "referenceFiles": [{"path": "/fixture-control.png", "classification": "approved"}]}


class StrictQuarantineTest(unittest.TestCase):
    def assert_invariants(self, report):
        with patch.object(audit, "EXPECTED_CHARACTER_ARC_ENTRY_COUNT", 4), patch.object(audit, "KNOWN_EXPECTATIONS", {}):
            audit.assert_report_invariants(report)

    def test_exact_three_policies_allow_only_their_absent_candidates(self):
        self.assertEqual(audit.validate_quarantine_selections(catalog_rows()), 3)
        self.assert_invariants(report_fixture())  # 4 synthetic arcs - 3 explicit refusals = 1 reference.

    def test_unexpected_absence_fails_before_any_bitmap_analysis(self):
        rows = catalog_rows()
        rows[-1]["candidatsReferencesLocalesAudit"] = []
        with patch.object(audit, "load_character_entries", return_value=rows), patch.object(audit, "analyze_bitmap") as analyze:
            with self.assertRaisesRegex(ValueError, "Unexpected missing"):
                audit.build_report()
            analyze.assert_not_called()

    def test_forged_actor_edition_universe_hash_reason_and_art_approval_fail(self):
        for field, value in [("heroId", "aayla_secura"), ("incarnation", "other edition"),
                             ("universe", "Custom"), ("sha256", "0" * 64), ("reason", "needs review"),
                             ("artApproved", True), ("artApproved", 0)]:
            with self.subTest(field=field, value=value):
                rows = catalog_rows()
                rows[0]["sourceSpriteQuarantine"][field] = value
                with self.assertRaisesRegex(ValueError, "Mismatched"):
                    audit.validate_quarantine_selections(rows)

    def test_quarantine_cannot_be_moved_to_another_dossier(self):
        rows = catalog_rows()
        rows[0]["id"] = 100001
        with self.assertRaisesRegex(ValueError, "Unexpected source-sprite"):
            audit.validate_quarantine_selections(rows)

    def test_missing_or_undeclared_known_policy_fails(self):
        rows = catalog_rows()
        del rows[0]["sourceSpriteQuarantine"]
        with self.assertRaisesRegex(ValueError, "undeclared"):
            audit.validate_quarantine_selections(rows)
        with self.assertRaisesRegex(ValueError, "must all remain explicit"):
            audit.validate_quarantine_selections(catalog_rows()[1:])

    def test_quarantined_candidates_and_imagegen_attachments_remain_empty(self):
        for field in ["candidatsReferencesLocalesAudit", "referencesLocalesOpenAI"]:
            with self.subTest(field=field):
                rows = catalog_rows()
                rows[0][field] = [rows[0]["sourceSpriteQuarantine"]["asset"]]
                with self.assertRaisesRegex(ValueError, "Mismatched"):
                    audit.validate_quarantine_selections(rows)

    def test_false_summary_counts_and_fake_unique_counts_fail(self):
        for count in [0, 2, 4, 3.0, True]:
            with self.subTest(count=count):
                report = report_fixture()
                report["summary"]["explicitSourceSpriteQuarantineCount"] = count
                with self.assertRaisesRegex(ValueError, "summary count"):
                    self.assert_invariants(report)
        report = report_fixture()
        report["summary"]["uniqueReferencePathCount"] = 4
        with self.assertRaisesRegex(ValueError, "Expected 1 unique"):
            self.assert_invariants(report)

    def test_report_cannot_promote_a_quarantined_row(self):
        report = report_fixture()
        report["entries"][0]["classification"] = "approved"
        with self.assertRaisesRegex(ValueError, "Mismatched"):
            self.assert_invariants(report)


if __name__ == "__main__":
    unittest.main()
