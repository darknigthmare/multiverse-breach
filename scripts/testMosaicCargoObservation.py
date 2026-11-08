"""Validator regressions use synthetic matrices, not a claimed browser run."""
import copy
import unittest

from mosaicCargoObservation import LABEL_OFFSET, POSITION_TOLERANCE, verify_cargo_draws


def project(matrix, point):
    return {'x': matrix['a'] * point['x'] + matrix['c'] * point['y'] + matrix['e'],
            'y': matrix['b'] * point['x'] + matrix['d'] * point['y'] + matrix['f']}


def update_derived(sample):
    sample['screen'] = project(sample['actualMatrix'], sample['local'])
    sample['expectedScreen'] = project(sample['referenceMatrix'], LABEL_OFFSET)
    sample['delta'] = {axis: sample['screen'][axis] - sample['expectedScreen'][axis] for axis in ('x', 'y')}
    sample['legacyWorld'] = {axis: sample['screen'][axis] + sample['camera'][axis] for axis in ('x', 'y')}
    sample['legacyWorldDelta'] = {axis: sample['legacyWorld'][axis] - sample['player'][axis] - LABEL_OFFSET[axis]
                                for axis in ('x', 'y')}
    return sample


class CargoObservationTests(unittest.TestCase):
    def setUp(self):
        self.cargo = {'missionId': 'city-mirelle-night-watch-v1', 'id': 'watch-lamp', 'label': "Mirelle's lamp", 'sequence': 4}
        # Synthetic native-like matrices intentionally differ from double arithmetic.
        # They test the validator's coordinate contract, not Chromium precision.
        matrix = {'a': 1, 'b': 0, 'c': 0, 'd': 1, 'e': 356.02569580078125, 'f': 268.9154357910156}
        self.sample = update_derived({'space': 'canvas-screen-reference-v1', 't': 1086.12,
            'player': {'x': 689.5031487254411, 'y': 584.594407208184},
            'camera': {'x': 333.47747990270295, 'y': 315.67897527240376},
            'cargo': copy.deepcopy(self.cargo), 'local': dict(LABEL_OFFSET),
            'actualMatrix': dict(matrix), 'referenceMatrix': dict(matrix)})

    def test_same_native_projection_passes_without_using_legacy_double_reconstruction(self):
        before = copy.deepcopy(self.sample)
        result = verify_cargo_draws([self.sample], self.cargo)
        self.assertEqual(self.sample, before)
        self.assertEqual(result['maxScreenError'], 0)
        self.assertGreater(result['maxLegacyWorldError'], POSITION_TOLERANCE)
        self.assertEqual(result['positionTolerance'], 1e-6)
        self.assertEqual(result['worldOffset'], {'x': 0, 'y': -66})

    def test_a_one_pixel_offset_in_either_axis_is_rejected(self):
        for field in ('e', 'f'):
            for offset in (-1, 1):
                with self.subTest(field=field, offset=offset):
                    sample = copy.deepcopy(self.sample)
                    sample['actualMatrix'][field] += offset
                    update_derived(sample)
                    with self.assertRaisesRegex(AssertionError, 'detached'):
                        verify_cargo_draws([sample], self.cargo)

    def test_wrong_local_label_offset_is_rejected(self):
        for axis in ('x', 'y'):
            with self.subTest(axis=axis):
                sample = copy.deepcopy(self.sample)
                sample['local'][axis] += 1
                update_derived(sample)
                with self.assertRaisesRegex(AssertionError, 'detached'):
                    verify_cargo_draws([sample], self.cargo)

    def test_threshold_remains_one_millionth_of_a_canvas_pixel(self):
        sample = copy.deepcopy(self.sample)
        sample['actualMatrix']['e'] += 2e-6
        update_derived(sample)
        with self.assertRaisesRegex(AssertionError, 'detached'):
            verify_cargo_draws([sample], self.cargo)

    def test_recorded_points_cannot_disagree_with_their_matrices_or_deltas(self):
        for section in ('screen', 'expectedScreen', 'delta', 'legacyWorld', 'legacyWorldDelta'):
            for axis in ('x', 'y'):
                with self.subTest(section=section, axis=axis):
                    sample = copy.deepcopy(self.sample)
                    sample[section][axis] += 1
                    with self.assertRaisesRegex(AssertionError, 'inconsistent'):
                        verify_cargo_draws([sample], self.cargo)

    def test_non_finite_matrices_points_and_state_are_rejected(self):
        sections = {key: ('x', 'y') for key in ('player', 'camera', 'local', 'screen', 'expectedScreen',
                                               'delta', 'legacyWorld', 'legacyWorldDelta')}
        sections.update({key: ('a', 'b', 'c', 'd', 'e', 'f') for key in ('actualMatrix', 'referenceMatrix')})
        for section, fields in sections.items():
            for field in fields:
                for invalid in (float('nan'), float('inf'), float('-inf'), None, True):
                    with self.subTest(section=section, field=field, invalid=invalid):
                        sample = copy.deepcopy(self.sample)
                        sample[section][field] = invalid
                        with self.assertRaisesRegex(AssertionError, 'non-finite'):
                            verify_cargo_draws([sample], self.cargo)

    def test_inconsistent_reference_basis_is_rejected(self):
        sample = copy.deepcopy(self.sample)
        sample['referenceMatrix']['a'] = 2
        update_derived(sample)
        with self.assertRaisesRegex(AssertionError, 'reference basis'):
            verify_cargo_draws([sample], self.cargo)

    def test_absent_foreign_or_old_space_draws_do_not_prove_the_carried_item(self):
        with self.assertRaisesRegex(AssertionError, 'not drawn'):
            verify_cargo_draws([], self.cargo)
        wrong = copy.deepcopy(self.sample)
        wrong['cargo']['sequence'] += 1
        with self.assertRaisesRegex(AssertionError, 'not drawn'):
            verify_cargo_draws([wrong], self.cargo)
        old = copy.deepcopy(self.sample)
        old.pop('space')
        with self.assertRaisesRegex(AssertionError, 'coordinate space'):
            verify_cargo_draws([old], self.cargo)

    def test_native_movement_is_still_required_for_a_carried_walk(self):
        with self.assertRaisesRegex(AssertionError, 'no native movement'):
            verify_cargo_draws([self.sample, copy.deepcopy(self.sample)], self.cargo, require_movement=True)
        moved = copy.deepcopy(self.sample)
        moved['t'] += 1
        moved['player']['x'] += 5
        moved['actualMatrix']['e'] += 5
        moved['referenceMatrix']['e'] += 5
        update_derived(moved)
        result = verify_cargo_draws([self.sample, moved], self.cargo, require_movement=True)
        self.assertEqual(result['travelledWorldUnits'], 5)
        self.assertEqual(result['sampledDraws'], 2)

    def test_a_label_left_behind_while_the_player_moves_is_rejected(self):
        moved = copy.deepcopy(self.sample)
        moved['t'] += 1
        moved['player']['x'] += 5
        moved['referenceMatrix']['e'] += 5
        update_derived(moved)
        with self.assertRaisesRegex(AssertionError, 'detached'):
            verify_cargo_draws([self.sample, moved], self.cargo, require_movement=True)


if __name__ == '__main__':
    unittest.main()
