"""Read-only browser evidence: motion must respect the scene's elapsed clock.

No wall-clock assumption, game-state mutation, or relaxed movement threshold.
The browser supplies native-click snapshots and samples of the actual scene.
"""
import math

EPSILON = 1e-6


def _sample(value):
    if not isinstance(value, dict):
        raise AssertionError('Missing motion sample')
    for key in ('t', 'x', 'y', 'speed'):
        number = value.get(key)
        if isinstance(number, bool) or not isinstance(number, (int, float)) or not math.isfinite(number):
            raise AssertionError(f'Invalid motion sample: {key}')
    if value['speed'] <= 0:
        raise AssertionError('Invalid movement speed')
    return value


def validate_mosaic_motion(proof, *, nearby_target=None):
    before = _sample(proof.get('clickBefore'))
    after = _sample(proof.get('clickAfter'))
    for key in ('t', 'x', 'y', 'speed'):
        if abs(before[key] - after[key]) > EPSILON:
            raise AssertionError(f'Approach click changed player or simulation immediately: {key}')
    samples = proof.get('samples')
    if not isinstance(samples, list) or len(samples) < 2:
        raise AssertionError('Missing per-frame motion evidence')
    previous = after
    speed = before['speed']
    travelled = 0.0
    maximum_step = 0.0
    moving_samples = 0
    for index, current in enumerate(samples):
        current = _sample(current)
        if abs(current['speed'] - speed) > EPSILON:
            raise AssertionError(f'Movement speed changed during approach: sample {index}')
        elapsed = current['t'] - previous['t']
        if elapsed < -EPSILON:
            raise AssertionError(f'Simulation clock moved backwards: sample {index}')
        distance = math.hypot(current['x'] - previous['x'], current['y'] - previous['y'])
        # Scene t is expressed in 60 Hz ticks, speed in world units per tick.
        budget = speed * max(0.0, elapsed)
        if distance > budget + EPSILON:
            raise AssertionError(f'Approach exceeded movement budget: sample {index}, distance={distance}, budget={budget}')
        travelled += distance
        maximum_step = max(maximum_step, distance)
        moving_samples += int(distance > EPSILON)
        previous = current
    # A resident, display or report can already be within interaction range. That
    # exception needs an independently observed matching target and geometry;
    # it never skips the clock, speed, click or per-frame displacement checks.
    proximity = proof.get('proximityBefore')
    already_in_range = False
    if isinstance(nearby_target, dict) and isinstance(proximity, dict):
        identity_fields = ('type', 'id', 'action', 'universe')
        complete_identity = all(isinstance(value.get(key), str) and value[key].strip()
                                for value in (nearby_target, proximity) for key in identity_fields)
        expected_range_valid = (type(nearby_target.get('range')) in (int, float)
                                and math.isfinite(nearby_target['range']) and nearby_target['range'] > 0)
        identity_matches = complete_identity and expected_range_valid and all(
            proximity.get(key) == nearby_target.get(key) for key in (*identity_fields, 'range'))
        geometry_valid = all(type(proximity.get(key)) in (int, float) and math.isfinite(proximity[key])
                             for key in ('x', 'y', 'distance', 'range'))
        if identity_matches and geometry_valid and proximity['range'] > 0:
            actual_distance = math.hypot(before['x'] - proximity['x'], before['y'] - proximity['y'])
            already_in_range = (abs(actual_distance - proximity['distance']) <= EPSILON
                                and actual_distance <= proximity['range'])
    if (moving_samples < 2 or travelled <= EPSILON) and not already_in_range:
        raise AssertionError('Approach did not produce a sampled walk')
    return {
        'clickPositionUnchanged': True,
        'sampledFrames': len(samples),
        'movingSamples': moving_samples,
        'elapsedSimulationTicks': round(previous['t'] - before['t'], 6),
        'travelledWorldUnits': round(travelled, 6),
        'maximumSampleDisplacement': round(maximum_step, 6),
        'speedWorldUnitsPerTick': speed,
        'everySampleWithinSpeedBudget': True,
        'startedWithinTargetRange': already_in_range,
    }
