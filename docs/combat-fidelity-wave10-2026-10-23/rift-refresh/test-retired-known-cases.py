"""Regression coverage for retired Rift calibration references; real bitmaps."""
import ast
import copy
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

ROOT = Path('/workspace/multiverse-breach')
spec = importlib.util.spec_from_file_location('reference_audit', ROOT / 'scripts/auditCharacterReferenceQuality.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
OLD = '/sprites/generated/heroes/half-life/freeman.png'
registry = json.loads((ROOT / 'src/game/combat/characterSpriteCorrectionsWave10PartB.generated.json').read_text())
NEW = next(row['sheet'] for row in registry['entries'] if row['heroId'] == 'freeman')


def constants(path):
    names = {'THRESHOLDS', 'KNOWN_EXPECTATIONS', 'MANUAL_APPROVED_REFERENCE_SHA256', 'ALPHA_OCCUPIED_THRESHOLD', 'STRONG_NEIGHBOR_DIFFERENCE', 'EXPECTED_CHARACTER_ARC_ENTRY_COUNT', 'EXPECTED_UNIQUE_REFERENCE_PATH_COUNT'}
    return {node.targets[0].id: ast.literal_eval(node.value) for node in ast.parse(path.read_text()).body if isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name) and node.targets[0].id in names}


class RetiredReferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        entry = {'id': 1, 'famille': 'arc-personnage', 'personnage': 'Gordon Freeman', 'univers': ['Half-Life'], 'referencesLocalesOpenAI': [NEW]}
        with patch.object(audit, 'load_character_entries', return_value=[entry]), patch.object(audit, 'KNOWN_EXPECTATIONS', {OLD: 'approved'}):
            cls.report = audit.build_report()

    def validate_fixture(self, report):
        with patch.multiple(audit, EXPECTED_CHARACTER_ARC_ENTRY_COUNT=1, EXPECTED_UNIQUE_REFERENCE_PATH_COUNT=1, KNOWN_EXPECTATIONS={OLD: 'approved'}):
            audit.assert_report_invariants(report)

    def test_real_new_reference_and_retired_original_are_measured_separately(self):
        self.validate_fixture(self.report)
        self.assertEqual(self.report['summary']['uniqueReferencePathCount'], 1)
        self.assertEqual(self.report['summary']['referenceClassifications']['approved'], 1)
        self.assertEqual([row['path'] for row in self.report['referenceFiles']], [NEW])
        historical = self.report['historicalKnownCaseReferences']
        self.assertEqual([row['path'] for row in historical], [OLD])
        self.assertEqual(historical[0]['classification'], 'approved')
        self.assertEqual(historical[0]['metrics']['fileSha256'], __import__('hashlib').sha256((ROOT / ('public' + OLD)).read_bytes()).hexdigest())

    def test_missing_or_degraded_retired_case_still_fails(self):
        report = copy.deepcopy(self.report)
        report['historicalKnownCaseReferences'][0]['classification'] = 'needs-review'
        with self.assertRaisesRegex(ValueError, 'Known-case classification mismatch'):
            self.validate_fixture(report)
        with patch.object(audit, 'resolve_public_path', return_value=ROOT / 'missing-retired-reference-test.png'):
            measured = audit.audit_reference_file(OLD)
        self.assertEqual(measured['classification'], 'needs-review')
        self.assertIn('missing-local-reference', measured['reasons'])
        report['historicalKnownCaseReferences'] = [measured]
        with self.assertRaisesRegex(ValueError, 'Known-case classification mismatch'):
            self.validate_fixture(report)

    def test_missing_duplicate_or_current_historical_case_is_rejected(self):
        for rows in [[], self.report['historicalKnownCaseReferences'] * 2, [*self.report['historicalKnownCaseReferences'], self.report['referenceFiles'][0]]]:
            report = copy.deepcopy(self.report)
            report['historicalKnownCaseReferences'] = rows
            with self.assertRaisesRegex(ValueError, 'exactly the retired'):
                self.validate_fixture(report)

    def test_prior_report_is_still_valid_when_known_cases_are_current(self):
        previous = json.loads((ROOT / 'docs/combat-fidelity-wave10-2026-10-23/rift-refresh/quality-before.json').read_text())
        audit.assert_report_invariants(previous)

    def test_every_threshold_expectation_and_manual_pin_is_unchanged(self):
        before = constants(ROOT / 'docs/combat-fidelity-wave10-2026-10-23/rift-refresh/auditCharacterReferenceQuality-before-retired-cases.py')
        after = constants(ROOT / 'scripts/auditCharacterReferenceQuality.py')
        self.assertEqual(len(before), 7)
        self.assertEqual(before, after)


if __name__ == '__main__':
    unittest.main(verbosity=2)
