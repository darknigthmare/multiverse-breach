import copy
import ast
from pathlib import Path
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


class ResidentOfferBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (Path(__file__).parent / 'browserMosaicCharacterMissions.py').read_text()
        journey = next(node for node in ast.parse(source).body
                       if isinstance(node, ast.FunctionDef) and node.name == 'resident_offer_journey')
        functions = [node for node in journey.body if isinstance(node, ast.FunctionDef)
                     and node.name in ('capture_offer_boundary', 'verify_offer_boundary')]
        assert len(functions) == 2

        def check(condition, message):
            if not condition:
                raise AssertionError(message)

        cls.namespace = {'check': check}
        exec(compile(ast.Module(body=functions, type_ignores=[]), '<resident-offer-boundaries>', 'exec'), cls.namespace)

    def setUp(self):
        self.verify = self.namespace['verify_offer_boundary']
        self.frozen = {'t': 795.3000000000059,
            'player': {'x': 628.3438529991091, 'y': 344.23440738627676,
                       'speed': 2.35, 'facing': -1, 'state': 'run'},
            'keys': {}, 'destination': None, 'pendingInteraction': None, 'destinationRoute': None}

    def test_only_the_normal_running_to_idle_pose_can_change_during_reopening(self):
        current = copy.deepcopy(self.frozen)
        current['player']['state'] = 'idle'
        before = copy.deepcopy((self.frozen, current))
        self.verify(self.frozen, current, 'reopen', resuming=True)
        self.assertEqual((self.frozen, current), before)
        with self.assertRaisesRegex(AssertionError, 'changed the player'):
            self.verify(self.frozen, current, 'accept')
        for state in ('jump', 'attack', None):
            with self.subTest(state=state):
                current['player']['state'] = state
                with self.assertRaisesRegex(AssertionError, 'changed the player'):
                    self.verify(self.frozen, current, 'reopen', resuming=True)
        idle = copy.deepcopy(self.frozen)
        idle['player']['state'] = 'idle'
        with self.assertRaisesRegex(AssertionError, 'changed the player'):
            self.verify(idle, self.frozen, 'reopen', resuming=True)

    def test_subpixel_motion_speed_and_orientation_changes_are_always_rejected(self):
        for key in ('x', 'y', 'speed', 'facing'):
            for resuming in (False, True):
                with self.subTest(key=key, resuming=resuming):
                    current = copy.deepcopy(self.frozen)
                    current['player'][key] += 1e-9
                    if resuming:
                        current['player']['state'] = 'idle'
                    with self.assertRaisesRegex(AssertionError, 'changed the player'):
                        self.verify(self.frozen, current, 'boundary', resuming=resuming)

    def test_acceptance_requires_the_entire_player_clock_and_commands_to_stay_unchanged(self):
        self.verify(self.frozen, copy.deepcopy(self.frozen), 'accept')
        mutations = [('t', self.frozen['t'] + 1e-9), ('keys', {'arrowup': True}),
                     ('destination', {'x': 800, 'y': 700}),
                     ('pendingInteraction', {'type': 'npc', 'id': 'arca_mirelle'}),
                     ('destinationRoute', {'points': [{'x': 800, 'y': 700}]})]
        for key, value in mutations:
            with self.subTest(key=key):
                current = copy.deepcopy(self.frozen)
                current[key] = value
                with self.assertRaisesRegex(AssertionError, 'changed ' + key):
                    self.verify(self.frozen, current, 'accept')
        current = copy.deepcopy(self.frozen)
        current['player']['unexpected'] = True
        with self.assertRaisesRegex(AssertionError, 'changed the player'):
            self.verify(self.frozen, current, 'accept')

    def test_missing_position_evidence_cannot_match_an_equally_incomplete_baseline(self):
        for key in ('x', 'y', 'speed', 'facing'):
            with self.subTest(key=key):
                reference = copy.deepcopy(self.frozen)
                del reference['player'][key]
                with self.assertRaisesRegex(AssertionError, 'incomplete player evidence'):
                    self.verify(reference, copy.deepcopy(reference), 'boundary', resuming=True)

    def test_the_native_boundary_is_recorded_before_a_failed_comparison(self):
        actual = copy.deepcopy(self.frozen)
        actual['player']['x'] += 1

        class ReadOnlyPage:
            def evaluate(self, _expression):
                return copy.deepcopy(actual)

        self.namespace['page'] = ReadOnlyPage()
        self.namespace['record'] = {}
        captured = self.namespace['capture_offer_boundary']('afterAcceptance')
        with self.assertRaisesRegex(AssertionError, 'changed the player'):
            self.verify(self.frozen, captured, 'accept')
        self.assertEqual(self.namespace['record']['offerBoundaries']['afterAcceptance'], actual)


class WalkReceiptProofTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Execute the exact browser verifier without importing Playwright or
        # starting a browser. These tests challenge evidence, not game state.
        source = Path(__file__).with_name('browserMosaicCharacterMissions.py').read_text()
        function = next(node for node in ast.parse(source).body
                        if isinstance(node, ast.FunctionDef) and node.name == 'verify_walk_receipt')
        def check(condition, message):
            if not condition:
                raise AssertionError(message)
        namespace = {'check': check}
        exec(compile(ast.Module(body=[function], type_ignores=[]), '<native-walk-verifier>', 'exec'), namespace)
        cls.verify = staticmethod(namespace['verify_walk_receipt'])

    def setUp(self):
        points = [{'id': 'departure', 'x': 100, 'y': 100}, {'id': 'return', 'x': 300, 'y': 100}]
        self.definition = {'missionId': 'walk-mission', 'stepId': 'walk', 'districtId': 'nexus', 'universe': 'Nexus',
                           'originChoiceId': 'origin', 'originStoryRevision': 2, 'branchChoiceId': 'apply', 'walk': {'points': points}}
        start = {'t': 0, 'x': 98, 'y': 100, 'speed': 2.35}
        samples = [{'t': index, 'x': 98 + index * 2, 'y': 100, 'speed': 2.35} for index in range(1, 102)]
        self.proof = {'clickBefore': start, 'clickAfter': dict(start), 'samples': samples}
        earned = [{**point, 'from': {'x': point['x'] - 2, 'y': point['y']},
                   'to': {'x': point['x'], 'y': point['y']}, 'elapsedMs': 1000 / 60, 'speed': 2.35, 'distance': 2}
                  for point in points]
        receipt = {key: value for key, value in self.definition.items() if key != 'walk'}
        receipt.update(version=1, points=earned)
        self.after = {'records': {'walk-mission': {'walkReceipts': {'walk': receipt},
                      'operationReceipts': {'walk': {'walkPointIds': ['departure', 'return']}}}}}

    def test_native_frames_confirm_each_ordered_checkpoint_and_its_final_operation(self):
        self.assertTrue(validate_mosaic_motion(self.proof)['everySampleWithinSpeedBudget'])
        result = self.verify(self.definition, self.after, self.proof)
        self.assertEqual(result['orderedPlaces'], 2)
        self.assertEqual([item['sampleIndex'] for item in result['matchedNativeFrames']], [1, 101])

    def test_saved_coordinates_cannot_replace_missing_movement_frames(self):
        for mutate in ['missing', 'same-time', 'wrong-from', 'wrong-speed']:
            with self.subTest(mutate=mutate):
                proof = copy.deepcopy(self.proof)
                if mutate == 'missing':
                    proof['samples'].pop(0)
                elif mutate == 'same-time':
                    proof['samples'][0]['t'] = 0
                elif mutate == 'wrong-from':
                    proof['clickAfter']['x'] = 95
                else:
                    proof['samples'][0]['speed'] = 8
                with self.assertRaisesRegex(AssertionError, 'matching native movement'):
                    self.verify(self.definition, self.after, proof)

    def test_foreign_skipped_or_reordered_waypoints_cannot_certify_a_route(self):
        for mutate in ['identity', 'skip', 'order', 'teleport', 'end']:
            with self.subTest(mutate=mutate):
                after = copy.deepcopy(self.after)
                saved = after['records']['walk-mission']
                receipt = saved['walkReceipts']['walk']
                if mutate == 'identity':
                    receipt['branchChoiceId'] = 'hold'
                elif mutate == 'skip':
                    receipt['points'].pop()
                elif mutate == 'order':
                    receipt['points'].reverse()
                elif mutate == 'teleport':
                    receipt['points'][0]['distance'] = 200
                else:
                    saved['operationReceipts']['walk']['walkPointIds'] = ['return', 'departure']
                with self.assertRaises(AssertionError):
                    self.verify(self.definition, after, self.proof)


if __name__ == '__main__':
    unittest.main()
