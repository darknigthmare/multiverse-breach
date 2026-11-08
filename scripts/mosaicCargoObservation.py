"""Read-only Canvas evidence for a carried City's object.

The game and the reference use native Canvas transforms. Adding the simulation's
double-precision camera to a browser matrix is retained as a diagnostic only;
it is not a comparison between two values in the same representation.
"""
import math

POSITION_TOLERANCE = 1e-6
LABEL_OFFSET = {'x': 0, 'y': -66}
MATRIX_FIELDS = ('a', 'b', 'c', 'd', 'e', 'f')

CARGO_OBSERVER_SCRIPT = '''(()=>{
  window.__cityCargoDraws=[];
  // Detached, reusable and never drawn: this context cannot change the game.
  const reference=document.createElement('canvas').getContext('2d');
  const original=CanvasRenderingContext2D.prototype.fillText;
  const matrixRecord=m=>({a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f});
  const project=(m,x,y)=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});
  CanvasRenderingContext2D.prototype.fillText=function(text,x,y,...rest){
    const state=window.__sceneQA?.state?.(),cargo=state?.missionCargo;
    if(this.canvas.classList.contains('mosaic-rpg-canvas')&&cargo&&text===cargo.label){
      const player={x:state.player.x,y:state.player.y};
      const camera={x:state.camera.x,y:state.camera.y};
      const actualMatrix=matrixRecord(this.getTransform());
      reference.setTransform(1,0,0,1,0,0);
      reference.translate(-camera.x,-camera.y);
      reference.translate(player.x,player.y);
      const referenceMatrix=matrixRecord(reference.getTransform());
      const screen=project(actualMatrix,x,y);
      const expectedScreen=project(referenceMatrix,0,-66);
      const legacyWorld={x:screen.x+camera.x,y:screen.y+camera.y};
      window.__cityCargoDraws.push({space:'canvas-screen-reference-v1',t:state.t,
        player,camera,cargo:structuredClone(cargo),local:{x,y},actualMatrix,referenceMatrix,
        screen,expectedScreen,delta:{x:screen.x-expectedScreen.x,y:screen.y-expectedScreen.y},
        legacyWorld,legacyWorldDelta:{x:legacyWorld.x-player.x,y:legacyWorld.y-player.y+66}});
      if(window.__cityCargoDraws.length>6000)window.__cityCargoDraws.shift();
    }
    return original.call(this,text,x,y,...rest);
  };
})();'''


def _check(value, message):
    if not value:
        raise AssertionError(message)


def _finite(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _point(record, label):
    _check(isinstance(record, dict) and all(_finite(record.get(key)) for key in ('x', 'y')),
           f'non-finite or missing carried-object {label}')
    return record


def _matrix(record, label):
    _check(isinstance(record, dict) and all(_finite(record.get(key)) for key in MATRIX_FIELDS),
           f'non-finite or missing carried-object {label}')
    return record


def _project(matrix, point):
    return {'x': matrix['a'] * point['x'] + matrix['c'] * point['y'] + matrix['e'],
            'y': matrix['b'] * point['x'] + matrix['d'] * point['y'] + matrix['f']}


def _same_point(actual, expected, label):
    _check(all(_finite(expected[axis]) and abs(actual[axis] - expected[axis]) <= POSITION_TOLERANCE
               for axis in ('x', 'y')), f'inconsistent carried-object {label}')


def verify_cargo_draws(samples, cargo, require_movement=False):
    matching = [sample for sample in samples if sample.get('cargo') == cargo]
    _check(matching, 'the carried object label was not drawn on the real City canvas')
    max_screen_error = 0
    max_legacy_world_error = 0
    for sample in matching:
        _check(sample.get('space') == 'canvas-screen-reference-v1', 'unknown carried-object coordinate space')
        _check(_finite(sample.get('t')), 'non-finite carried-object frame time')
        player = _point(sample.get('player'), 'player')
        camera = _point(sample.get('camera'), 'camera')
        local = _point(sample.get('local'), 'local draw arguments')
        actual_matrix = _matrix(sample.get('actualMatrix'), 'actual matrix')
        reference_matrix = _matrix(sample.get('referenceMatrix'), 'reference matrix')
        _check(all(abs(reference_matrix[key] - value) <= POSITION_TOLERANCE
                   for key, value in {'a': 1, 'b': 0, 'c': 0, 'd': 1}.items()),
               'inconsistent carried-object reference basis')
        screen = _point(sample.get('screen'), 'screen point')
        expected = _point(sample.get('expectedScreen'), 'reference screen point')
        delta = _point(sample.get('delta'), 'screen delta')
        legacy = _point(sample.get('legacyWorld'), 'legacy world point')
        legacy_delta = _point(sample.get('legacyWorldDelta'), 'legacy world delta')
        _same_point(screen, _project(actual_matrix, local), 'actual matrix and screen point')
        _same_point(expected, _project(reference_matrix, LABEL_OFFSET), 'reference matrix and screen point')
        _same_point(delta, {axis: screen[axis] - expected[axis] for axis in ('x', 'y')}, 'screen delta')
        _same_point(legacy, {axis: screen[axis] + camera[axis] for axis in ('x', 'y')}, 'legacy reconstruction')
        _same_point(legacy_delta, {axis: legacy[axis] - player[axis] - LABEL_OFFSET[axis]
                                  for axis in ('x', 'y')}, 'legacy reconstruction delta')
        error = max(abs(screen[axis] - expected[axis]) for axis in ('x', 'y'))
        _check(error <= POSITION_TOLERANCE,
               f'carried-object label detached from the avatar canvas transform: '
               f'actual={screen}, expected={expected}, delta={delta}')
        max_screen_error = max(max_screen_error, error)
        # Report this mixed-representation error without using it to accept a draw.
        max_legacy_world_error = max(max_legacy_world_error, *(abs(legacy_delta[axis]) for axis in ('x', 'y')))
    distance = sum(math.hypot(current['player']['x'] - previous['player']['x'],
                              current['player']['y'] - previous['player']['y'])
                   for previous, current in zip(matching, matching[1:]))
    _check(math.isfinite(distance), 'non-finite carried-object travelled distance')
    if require_movement:
        _check(len(matching) >= 2 and distance > POSITION_TOLERANCE,
               'no native movement was sampled while the object was carried')
    return {'sampledDraws': len(matching), 'travelledWorldUnits': distance,
            'labelTracksAvatar': True, 'worldOffset': dict(LABEL_OFFSET),
            'coordinateSpace': 'canvas-screen-reference-v1', 'positionTolerance': POSITION_TOLERANCE,
            'maxScreenError': max_screen_error, 'maxLegacyWorldError': max_legacy_world_error,
            'scope': 'Real label draws compared with an independent native Canvas reference; '
                     'legacy world reconstruction is diagnostic only. Screenshots retain the carried silhouette.'}
