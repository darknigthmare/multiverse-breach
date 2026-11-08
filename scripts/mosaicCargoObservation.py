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

# Observe painted frames and actual drawing commands, not a scene-side counter
# or the rectangles produced by the placement helper being tested.
MISSION_LABEL_OBSERVER_SCRIPT = '''(()=>{
  window.__cityLabelFrames=[];
  const native=CanvasRenderingContext2D.prototype;
  const reference=document.createElement('canvas').getContext('2d');
  const color=value=>{reference.fillStyle=value;return reference.fillStyle;};
  const operationColor=color('rgba(5,12,18,0.94)');
  const cargoColor=color('rgba(5,12,18,0.93)');
  const shadowColor=color('rgba(0,0,0,0.42)');
  const records=new WeakMap(),paths=new WeakMap();
  let sequence=0;
  const matrixRecord=m=>({a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f});
  const project=(m,x,y)=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f});
  const bounds=points=>{const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
    const x=Math.min(...xs),y=Math.min(...ys);return{x,y,width:Math.max(...xs)-x,height:Math.max(...ys)-y};};
  const rectangle=(ctx,x,y,width,height,stroke=false)=>{
    const matrix=matrixRecord(ctx.getTransform());
    const rect=bounds([[x,y],[x+width,y],[x,y+height],[x+width,y+height]].map(p=>project(matrix,...p)));
    const lineWidth=stroke?ctx.lineWidth:0;
    const ex=lineWidth*(Math.abs(matrix.a)+Math.abs(matrix.c))/2;
    const ey=lineWidth*(Math.abs(matrix.b)+Math.abs(matrix.d))/2;
    return {matrix,args:{x,y,width,height},lineWidth,
      rect:{x:rect.x-ex,y:rect.y-ey,width:rect.width+ex*2,height:rect.height+ey*2}};
  };
  const city=ctx=>ctx.canvas.classList.contains('mosaic-rpg-canvas');
  const recordDraw=(ctx,draw)=>{const entry=records.get(ctx);if(!entry?.stage)return;
    entry.frame[entry.stage==='avatar'?'avatarDraws':'cargoDraws'].push(draw);};
  const originalFillRect=native.fillRect;
  native.fillRect=function(x,y,width,height){
    if(city(this)){
      if(x===0&&y===0&&width===this.canvas.width&&height===this.canvas.height){
        const m=this.getTransform();
        if(m.a===1&&m.b===0&&m.c===0&&m.d===1&&m.e===0&&m.f===0){
          const state=window.__sceneQA?.state?.();
          if(state){
            // A new background proves the previous frame finished painting.
            // Keep the last, still-open frame in the raw evidence only.
            const previous=records.get(this);if(previous)previous.frame.complete=true;
            const frame={id:++sequence,t:state.t,complete:false,viewport:{width,height},
              player:{x:state.player.x,y:state.player.y},camera:{x:state.camera.x,y:state.camera.y},
              cargo:structuredClone(state.missionCargo??null),labels:[],avatarDraws:[],cargoDraws:[],
              playerName:null,playerShadow:null,cargoLabel:null,cargoLabelText:null};
            records.set(this,{frame,stage:null,activeLabel:null});window.__cityLabelFrames.push(frame);
            if(window.__cityLabelFrames.length>6000)window.__cityLabelFrames.shift();
          }
        }
      }
      const entry=records.get(this);
      if(entry){
        const style=this.fillStyle,player=entry.frame.player;
        if(style===shadowColor&&width===36&&height===7
          &&Math.abs(x-player.x+18)<=1e-6&&Math.abs(y-player.y-21)<=1e-6){
          entry.stage='avatar';entry.frame.avatarDraws=[];
          entry.frame.playerShadow=rectangle(this,x,y,width,height);
        }else if(style===operationColor){
          const label={...rectangle(this,x,y,width,height),lines:[]};
          entry.frame.labels.push(label);entry.activeLabel=label;
        }else if(style===cargoColor&&entry.frame.cargo){
          entry.frame.cargoLabel=rectangle(this,x,y,width,height);
        }else if(entry.stage)recordDraw(this,{kind:'fillRect',...rectangle(this,x,y,width,height)});
      }
    }
    return originalFillRect.call(this,x,y,width,height);
  };
  const originalStrokeRect=native.strokeRect;
  native.strokeRect=function(x,y,width,height){
    if(city(this)&&records.get(this)?.stage)recordDraw(this,{kind:'strokeRect',...rectangle(this,x,y,width,height,true)});
    return originalStrokeRect.call(this,x,y,width,height);
  };
  const originalDrawImage=native.drawImage;
  native.drawImage=function(image,...args){
    if(city(this)&&records.get(this)?.stage){
      const target=args.length===8?args.slice(4):args.length===4?args:
        [args[0],args[1],image.naturalWidth||image.width,image.naturalHeight||image.height];
      recordDraw(this,{kind:'drawImage',source:image.currentSrc||image.src||'',...rectangle(this,...target)});
    }
    return originalDrawImage.call(this,image,...args);
  };
  const originalBegin=native.beginPath;
  native.beginPath=function(){paths.set(this,[]);return originalBegin.call(this);};
  for(const name of ['moveTo','lineTo','quadraticCurveTo','bezierCurveTo']){
    const original=native[name];
    native[name]=function(...args){
      if(city(this)&&records.get(this)?.stage){const path=paths.get(this)||[],m=this.getTransform();
        for(let i=0;i<args.length;i+=2)path.push(project(m,args[i],args[i+1]));paths.set(this,path);}
      return original.call(this,...args);
    };
  }
  const originalArc=native.arc;
  native.arc=function(x,y,radius,...args){
    if(city(this)&&records.get(this)?.stage){const path=paths.get(this)||[],m=this.getTransform();
      for(const [px,py]of [[x-radius,y-radius],[x+radius,y-radius],[x-radius,y+radius],[x+radius,y+radius]])path.push(project(m,px,py));
      paths.set(this,path);}
    return originalArc.call(this,x,y,radius,...args);
  };
  for(const name of ['fill','stroke']){
    const original=native[name];
    native[name]=function(...args){
      const path=paths.get(this);
      if(city(this)&&records.get(this)?.stage&&path?.length){
        const rect=bounds(path),m=this.getTransform(),lw=name==='stroke'?this.lineWidth:0;
        const ex=lw*(Math.abs(m.a)+Math.abs(m.c))/2,ey=lw*(Math.abs(m.b)+Math.abs(m.d))/2;
        recordDraw(this,{kind:name,points:path.map(point=>({...point})),inflation:{x:ex,y:ey},
          rect:{x:rect.x-ex,y:rect.y-ey,width:rect.width+ex*2,height:rect.height+ey*2}});
      }
      return original.call(this,...args);
    };
  }
  const originalFillText=native.fillText;
  native.fillText=function(text,x,y,...rest){
    const entry=city(this)&&records.get(this);
    const playerName=entry?.stage==='avatar'&&text==='QA';
    const cargoLabel=entry?.frame.cargo&&text===entry.frame.cargo.label;
    const operationLine=entry?.activeLabel&&this.font.startsWith('12px ');
    if(playerName||cargoLabel||operationLine){
      const metrics=this.measureText(text),m=this.getTransform();
      const rect=bounds([[x-metrics.actualBoundingBoxLeft,y-metrics.actualBoundingBoxAscent],
        [x+metrics.actualBoundingBoxRight,y-metrics.actualBoundingBoxAscent],
        [x-metrics.actualBoundingBoxLeft,y+metrics.actualBoundingBoxDescent],
        [x+metrics.actualBoundingBoxRight,y+metrics.actualBoundingBoxDescent]].map(p=>project(m,...p)));
      // The prepared profile's real name draw ends its avatar drawing group.
      if(playerName){
        entry.frame.playerName={text,rect};entry.stage=entry.frame.cargo?'cargo':null;
      }else if(cargoLabel){
        entry.frame.cargoLabelText={text,rect};entry.stage=null;
      }
      if(operationLine)entry.activeLabel.lines.push({text,rect});
    }
    return originalFillText.call(this,text,x,y,...rest);
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


def _rect(record, label):
    _check(isinstance(record, dict) and all(_finite(record.get(key)) for key in ('x', 'y', 'width', 'height'))
           and record['width'] >= 0 and record['height'] >= 0, f'non-finite or missing {label}')
    return record


def _bounds(points):
    return {'x': min(point['x'] for point in points), 'y': min(point['y'] for point in points),
            'width': max(point['x'] for point in points) - min(point['x'] for point in points),
            'height': max(point['y'] for point in points) - min(point['y'] for point in points)}


def _painted_rect(draw):
    _check(isinstance(draw, dict), 'missing native drawing evidence')
    rect = _rect(draw.get('rect'), 'painted rectangle')
    if 'matrix' in draw:
        matrix = _matrix(draw.get('matrix'), 'painted matrix')
        args = _rect(draw.get('args'), 'rectangle draw arguments')
        line_width = draw.get('lineWidth', 0)
        _check(_finite(line_width) and line_width >= 0, 'non-finite painted stroke width')
        points = [_project(matrix, {'x': args['x'] + dx, 'y': args['y'] + dy})
                  for dx, dy in ((0, 0), (args['width'], 0), (0, args['height']), (args['width'], args['height']))]
        base = _bounds(points)
        inflation = {'x': line_width * (abs(matrix['a']) + abs(matrix['c'])) / 2,
                     'y': line_width * (abs(matrix['b']) + abs(matrix['d'])) / 2}
    elif draw.get('points'):
        points = [_point(point, 'painted path point') for point in draw['points']]
        base = _bounds(points)
        inflation = _point(draw.get('inflation'), 'painted path inflation')
        _check(inflation['x'] >= 0 and inflation['y'] >= 0, 'negative painted path inflation')
    else:
        raise AssertionError('painted rectangle has no native draw evidence')
    expected = {'x': base['x'] - inflation['x'], 'y': base['y'] - inflation['y'],
                'width': base['width'] + 2 * inflation['x'], 'height': base['height'] + 2 * inflation['y']}
    _check(all(_finite(expected[key]) and abs(rect[key] - expected[key]) <= POSITION_TOLERANCE
               for key in expected), 'inconsistent native draw rectangle')
    return rect


def _contains(outer, inner):
    return inner['x'] >= outer['x'] - POSITION_TOLERANCE and inner['y'] >= outer['y'] - POSITION_TOLERANCE \
        and inner['x'] + inner['width'] <= outer['x'] + outer['width'] + POSITION_TOLERANCE \
        and inner['y'] + inner['height'] <= outer['y'] + outer['height'] + POSITION_TOLERANCE


def _intersects(a, b):
    return min(a['x'] + a['width'], b['x'] + b['width']) - max(a['x'], b['x']) > POSITION_TOLERANCE \
        and min(a['y'] + a['height'], b['y'] + b['height']) - max(a['y'], b['y']) > POSITION_TOLERANCE


def verify_mission_label_frames(frames, require_labels=False, require_cargo=False, require_player_in_view=False):
    """Reject overlaid cartouches using the commands that actually painted them."""
    _check(frames, 'no painted City frames were observed')
    labelled = carrying = text_bounds = native_rectangles = 0
    ready_avatar = ready_labelled = ready_carrying = without_avatar = 0
    seen_ids = set()
    for frame in frames:
        _check(isinstance(frame, dict) and type(frame.get('id')) is int and frame['id'] > 0 and frame['id'] not in seen_ids,
               'missing or duplicate painted frame identity')
        seen_ids.add(frame['id'])
        _check(type(frame.get('complete')) is bool, 'missing painted frame completion boundary')
    completed = [frame for frame in frames if frame['complete']]
    _check(completed, 'no completely painted City frame was observed')
    for frame in completed:
        _check(_finite(frame.get('t')), 'non-finite painted frame time')
        viewport = _rect({'x': 0, 'y': 0, **frame.get('viewport', {})}, 'painted viewport')
        _check(viewport['width'] > 0 and viewport['height'] > 0, 'empty painted viewport')
        labels = frame.get('labels')
        _check(isinstance(labels, list) and len(labels) <= 1, 'multiple operation cartouches painted in one frame')
        labelled += bool(labels)
        protected = []
        if labels or frame.get('cargo') or require_player_in_view:
            avatar_draws = frame.get('avatarDraws')
            _check(isinstance(avatar_draws, list), 'missing native avatar drawing group')
            # Loading can briefly leave only the real shadow/name. Still check
            # every painted part and every label in those complete frames; do
            # not discard them or count them as proof of the avatar silhouette.
            ready_avatar += bool(avatar_draws)
            ready_labelled += bool(avatar_draws and labels)
            ready_carrying += bool(avatar_draws and frame.get('cargo'))
            without_avatar += not bool(avatar_draws)
            for draw in avatar_draws:
                protected.append(_painted_rect(draw)); native_rectangles += 1
            protected.append(_painted_rect(frame.get('playerShadow'))); native_rectangles += 1
            player_name = frame.get('playerName') or {}
            protected.append(_rect(player_name.get('rect'), 'player name bounds'))
            _check(player_name.get('text') == 'QA', 'wrong prepared player name draw')
        if frame.get('cargo'):
            carrying += 1
            _check(frame.get('cargoDraws'), 'no carried silhouette drawing was observed')
            for draw in frame['cargoDraws']:
                protected.append(_painted_rect(draw)); native_rectangles += 1
            cargo_label = _painted_rect(frame.get('cargoLabel')); protected.append(cargo_label); native_rectangles += 1
            cargo_text = frame.get('cargoLabelText') or {}
            _check(cargo_text.get('text') == frame['cargo'].get('label'), 'carried label text was not actually drawn')
            _check(_contains(cargo_label, _rect(cargo_text.get('rect'), 'carried label text bounds')),
                   'carried label text escapes its background')
        if require_player_in_view:
            _check(protected and all(_contains(viewport, part) for part in protected),
                   'the actual avatar or carried object escapes the viewport after remount')
        for label in labels:
            rect = _painted_rect(label); native_rectangles += 1
            _check(rect['width'] > 0 and rect['height'] > 0 and _contains(viewport, rect), 'operation cartouche escapes the viewport')
            _check(not any(_intersects(rect, part) for part in protected),
                   f'operation cartouche overlaps the actual avatar or cargo: {rect}')
            _check(label.get('lines'), 'operation cartouche was drawn without its text')
            for line in label['lines']:
                _check(isinstance(line.get('text'), str) and line['text'], 'missing operation text draw')
                _check(_contains(rect, _rect(line.get('rect'), 'operation text bounds')), 'operation text escapes its cartouche')
                text_bounds += 1
    if require_labels:
        _check(labelled > 0, 'no operation cartouche was actually painted during the approach')
        _check(ready_labelled > 0, 'no real avatar drawing was observed beside an operation label')
    if require_cargo:
        _check(carrying > 0, 'no carried silhouette was actually painted during the observation')
        _check(ready_carrying > 0, 'no real avatar drawing was observed beside the carried object')
    if labelled or carrying or require_player_in_view:
        _check(ready_avatar > 0, 'no real avatar drawing was observed during the observation')
    result = {'paintedFrames': len(completed), 'unclosedFramesRetained': len(frames) - len(completed),
            'framesWithOperationLabel': labelled, 'framesCarrying': carrying,
            'framesWithAvatarDrawing': ready_avatar, 'framesWithoutAvatarDrawing': without_avatar,
            'maxOperationLabelsPerFrame': max(len(frame['labels']) for frame in completed),
            'nativeRectanglesVerified': native_rectangles, 'textBoundsVerified': text_bounds,
            'noPlayerOrCargoIntersection': True, 'positionTolerance': POSITION_TOLERANCE,
            'scope': 'Native Canvas fillRect frame boundaries, operation backgrounds, text bounds and avatar/cargo draws; '
                     'no runtime placement rectangles or QA label count are trusted.'}
    if require_player_in_view:
        result.update({'playerAndCargoWithinViewport': True, 'visibilityCheckedFrames': len(completed)})
    return result
