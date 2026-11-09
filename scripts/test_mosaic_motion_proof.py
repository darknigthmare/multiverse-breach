"""Regression contracts for the browser's no-teleport assertion."""
import copy
import math
import unittest
from mosaicMotionProof import validate_mosaic_motion


def sample(t, x, y=730, speed=2.35):
    return dict(t=t, x=x, y=y, speed=speed)


def walk():
    return dict(clickBefore=sample(10, 460), clickAfter=sample(10, 460),
                samples=[sample(11, 462.35), sample(12, 464.7), sample(18, 478.8)])


class MotionProofTests(unittest.TestCase):
    def test_elapsed_walk_survives_delayed_observation(self):
        p = walk()
        p['samples'].append(sample(30, 507))  # 47 units, valid even beyond the old 20-unit test limit.
        self.assertTrue(validate_mosaic_motion(p)['everySampleWithinSpeedBudget'])

    def test_synchronous_approach_teleport_fails(self):
        p = walk(); p['clickAfter']['x'] = 600
        with self.assertRaisesRegex(AssertionError, 'immediately'):
            validate_mosaic_motion(p)

    def test_delayed_teleport_fails(self):
        p = walk(); p['samples'][1]['x'] = 600
        with self.assertRaisesRegex(AssertionError, 'movement budget'):
            validate_mosaic_motion(p)

    def test_motion_while_clock_frozen_fails(self):
        p = walk(); p['samples'][1]['t'] = 11
        with self.assertRaisesRegex(AssertionError, 'movement budget'):
            validate_mosaic_motion(p)

    def test_diagonal_excess_fails(self):
        p = walk(); p['samples'][0] = sample(11, 462.35, 732.35)
        with self.assertRaisesRegex(AssertionError, 'movement budget'):
            validate_mosaic_motion(p)

    def test_still_samples_and_obstacle_detour_are_valid(self):
        p = walk(); p['samples'] = [sample(10, 460), sample(11, 461), sample(12, 460), sample(13, 460, 731)]
        self.assertEqual(validate_mosaic_motion(p)['movingSamples'], 3)

    def test_no_walk_fails(self):
        p = walk(); p['samples'] = [sample(11, 460), sample(12, 460)]
        with self.assertRaisesRegex(AssertionError, 'sampled walk'):
            validate_mosaic_motion(p)

    def test_missing_evidence_fails(self):
        for key in ('clickBefore', 'clickAfter', 'samples'):
            with self.subTest(key=key):
                p = walk(); del p[key]
                with self.assertRaises(AssertionError): validate_mosaic_motion(p)

    def test_speed_change_fails(self):
        p = walk(); p['samples'][1]['speed'] = 100
        with self.assertRaisesRegex(AssertionError, 'speed changed'):
            validate_mosaic_motion(p)

    def test_backward_clock_fails(self):
        p = walk(); p['samples'][1]['t'] = 9
        with self.assertRaisesRegex(AssertionError, 'backwards'):
            validate_mosaic_motion(p)

    def test_invalid_numeric_evidence_fails(self):
        for key in ('t', 'x', 'y', 'speed'):
            for value in (math.nan, math.inf, None, '12', True):
                with self.subTest(key=key, value=value):
                    p = copy.deepcopy(walk()); p['samples'][0][key] = value
                    with self.assertRaises(AssertionError): validate_mosaic_motion(p)

    def test_nonpositive_speed_fails(self):
        p = walk(); p['clickBefore']['speed'] = 0
        with self.assertRaisesRegex(AssertionError, 'speed'):
            validate_mosaic_motion(p)


if __name__ == '__main__': unittest.main()
