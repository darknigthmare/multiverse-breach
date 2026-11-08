import copy
import unittest

from mosaicMotionProof import validate_mosaic_motion


class MotionProofTests(unittest.TestCase):
    def setUp(self):
        self.target = {'type': 'zone', 'id': 'nexus-core', 'action': 'anchor', 'universe': 'Nexus', 'range': 72}
        start = {'t': 0, 'x': 100, 'y': 100, 'speed': 2.35}
        self.proof = {'clickBefore': start, 'clickAfter': copy.copy(start),
                      'samples': [dict(start, t=1), dict(start, t=2)],
                      'proximityBefore': dict(self.target, x=150, y=100, distance=50)}

    def test_stationary_interaction_still_requires_a_walk_by_default(self):
        with self.assertRaisesRegex(AssertionError, 'sampled walk'):
            validate_mosaic_motion(self.proof)

    def test_actual_anchor_already_in_range_allows_a_stationary_report(self):
        result = validate_mosaic_motion(self.proof, nearby_target=self.target)
        self.assertTrue(result['startedWithinTargetRange'])
        self.assertEqual(result['travelledWorldUnits'], 0)
        self.assertTrue(result['everySampleWithinSpeedBudget'])

    def test_actual_contract_marker_in_range_requires_its_full_identity(self):
        target = {'type': 'zone', 'id': 'city-nova-return-measurement-v1::inherited-route',
                  'action': 'character-mission', 'universe': 'Nexus de Convergence', 'range': 72}
        start = {'t': 0, 'x': 1305.14, 'y': 813.92, 'speed': 2.35}
        distance = ((start['x'] - 1280) ** 2 + (start['y'] - 780) ** 2) ** .5
        proof = {'clickBefore': start, 'clickAfter': copy.copy(start),
                 'samples': [dict(start, t=1), dict(start, t=2)],
                 'proximityBefore': dict(target, x=1280, y=780, distance=distance)}
        result = validate_mosaic_motion(proof, nearby_target=target)
        self.assertTrue(result['startedWithinTargetRange'])
        self.assertEqual(result['movingSamples'], 0)
        for mutation in [{'id': 'city-nova-return-measurement-v1::crosscheck'},
                         {'id': 'other-contract::inherited-route'}, {'action': 'anchor'},
                         {'universe': 'Other'}, {'range': 999}, {'distance': 0},
                         {'x': 1100, 'distance': ((start['x'] - 1100) ** 2 + (start['y'] - 780) ** 2) ** .5}]:
            with self.subTest(mutation=mutation):
                wrong = copy.deepcopy(proof)
                wrong['proximityBefore'].update(mutation)
                with self.assertRaisesRegex(AssertionError, 'sampled walk'):
                    validate_mosaic_motion(wrong, nearby_target=target)

    def test_actual_resident_in_range_requires_its_identity_and_npc_range(self):
        target = {'type': 'npc', 'id': 'arca_marrow', 'action': 'talk',
                  'universe': 'Nexus de Convergence', 'range': 58}
        start = {'t': 714.78, 'x': 891.0711610626, 'y': 932.9589320104402, 'speed': 2.35}
        proof = {'clickBefore': start, 'clickAfter': copy.copy(start),
                 'samples': [dict(start, t=715), dict(start, t=716)],
                 'proximityBefore': dict(target, x=900.3892541725363, y=976.1949496042841,
                                         distance=44.22872456425377)}
        result = validate_mosaic_motion(proof, nearby_target=target)
        self.assertTrue(result['startedWithinTargetRange'])
        self.assertEqual(result['movingSamples'], 0)
        for mutation in [{'type': 'zone'}, {'id': 'arca_nova'}, {'action': 'anchor'},
                         {'universe': 'Other'}, {'range': 72}, {'distance': 0}]:
            with self.subTest(mutation=mutation):
                wrong = copy.deepcopy(proof)
                wrong['proximityBefore'].update(mutation)
                with self.assertRaisesRegex(AssertionError, 'sampled walk'):
                    validate_mosaic_motion(wrong, nearby_target=target)
        proof['clickAfter']['x'] += 1
        with self.assertRaisesRegex(AssertionError, 'immediately'):
            validate_mosaic_motion(proof, nearby_target=target)

    def test_far_wrong_or_invalid_proximity_cannot_replace_walking(self):
        for mutation in [{'id': 'other'}, {'universe': 'Other'}, {'action': 'codex'},
                         {'range': 999}, {'x': 200, 'distance': 100}, {'distance': 0}, {'x': float('nan')}]:
            with self.subTest(mutation=mutation):
                proof = copy.deepcopy(self.proof)
                proof['proximityBefore'].update(mutation)
                with self.assertRaisesRegex(AssertionError, 'sampled walk'):
                    validate_mosaic_motion(proof, nearby_target=self.target)

    def test_partial_identity_cannot_match_missing_fields_on_both_sides(self):
        for key in ['type', 'id', 'action', 'universe']:
            with self.subTest(key=key):
                proof = copy.deepcopy(self.proof)
                target = copy.copy(self.target)
                del target[key]
                del proof['proximityBefore'][key]
                with self.assertRaisesRegex(AssertionError, 'sampled walk'):
                    validate_mosaic_motion(proof, nearby_target=target)

    def test_nearby_anchor_does_not_bypass_teleport_or_speed_checks(self):
        for key in ['clickAfter', 'samples']:
            with self.subTest(key=key):
                proof = copy.deepcopy(self.proof)
                if key == 'clickAfter':
                    proof[key]['x'] += 10
                else:
                    proof[key][0]['x'] += 10
                with self.assertRaises(AssertionError):
                    validate_mosaic_motion(proof, nearby_target=self.target)


if __name__ == '__main__':
    unittest.main()
