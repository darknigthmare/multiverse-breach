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


def validate_mosaic_motion(proof):
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
    if moving_samples < 2 or travelled <= EPSILON:
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
    }
