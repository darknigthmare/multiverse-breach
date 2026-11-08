"""Validator regressions use synthetic matrices, not a claimed browser run."""
import copy
import json
import subprocess
import unittest
from pathlib import Path

from mosaicCargoObservation import (
    LABEL_OFFSET, POSITION_TOLERANCE, CARGO_OBSERVER_SCRIPT, MISSION_LABEL_OBSERVER_SCRIPT,
    verify_cargo_draws, verify_mission_label_frames,
)


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


def rectangle(x, y, width, height):
    return {'x': x, 'y': y, 'width': width, 'height': height}


def painted_rectangle(x, y, width, height, kind='fillRect'):
    return {'kind': kind, 'matrix': {'a': 1, 'b': 0, 'c': 0, 'd': 1, 'e': 0, 'f': 0},
            'args': rectangle(x, y, width, height), 'lineWidth': 0,
            'rect': rectangle(x, y, width, height)}


def operation_label(x=16, y=16):
    label = painted_rectangle(x, y, 160, 40)
    label['lines'] = [{'text': 'The restored relay', 'rect': rectangle(x + 7, y + 7, 140, 12)},
                      {'text': 'Ready', 'rect': rectangle(x + 7, y + 23, 35, 11)}]
    return label


def location_hud_record(canvas=None, location=None):
    return {'space': 'dom-client-rects-v1', 'locationCount': 1,
            'canvas': canvas if canvas is not None else rectangle(70, 120, 300, 100),
            'location': location if location is not None else rectangle(320, 210, 30, 5),
            'style': {'display': 'grid', 'visibility': 'visible', 'opacity': 1},
            'canvasInsets': {key: 0 for key in (
                'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth',
                'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom')}}


def observe_nova_homonyms(cargo_offset=0, operation_overlap=False, location_hud=None):
    """Replay the real renderers through a Canvas command double, not Chromium."""
    game = Path(__file__).resolve().parents[1] / 'src/game'
    script = '\n'.join([
        f'import {{ MOSAIC_CITY_ROUTES }} from {json.dumps((game / "mosaicCityRoutes.js").as_uri())};',
        f'import {{ drawMosaicMissionCargo }} from {json.dumps((game / "mosaicMissionCargo.js").as_uri())};',
        f'import {{ drawMosaicMissionObjectLabel, getMosaicMissionObjectView }} from {json.dumps((game / "mosaicMissionOperations.js").as_uri())};',
    ]) + '''
    const step=MOSAIC_CITY_ROUTES.find(m=>m.id==='city-nova-present-pulse-v1').steps.find(s=>s.id==='take-low-probe');
    const cargo={id:step.cargo.id,label:step.cargo.label.en,appearance:step.cargo.appearance};
    if(cargo.label!==step.operation.propName.en||cargo.label!=='Nova’s low probe')throw Error('real homonyms changed');
    const state={t:16,player:{x:300,y:250},camera:{x:0,y:0},missionCargo:cargo};
    class Context {
      constructor(city=false){this.canvas={width:600,height:400,classList:{contains:()=>city}};
        this.fillStyle='black';this.font='10px test';this.textAlign='center';this.lineWidth=1;
        this.matrix={a:1,b:0,c:0,d:1,e:0,f:0};this.stack=[];}
      getTransform(){return {...this.matrix};}
      setTransform(a,b,c,d,e,f){this.matrix={a,b,c,d,e,f};}
      translate(x,y){const m=this.matrix;m.e+=m.a*x+m.c*y;m.f+=m.b*x+m.d*y;}
      save(){this.stack.push({matrix:{...this.matrix},fillStyle:this.fillStyle,font:this.font,
        textAlign:this.textAlign,lineWidth:this.lineWidth});}
      restore(){Object.assign(this,this.stack.pop());}
      measureText(text){const size=parseFloat(this.font),width=text.length*size*.4;
        const left=this.textAlign==='center'?width/2:0;
        return {width,actualBoundingBoxLeft:left,actualBoundingBoxRight:width-left,
          actualBoundingBoxAscent:size*.8,actualBoundingBoxDescent:size*.2};}
    }
    for(const name of ['fillRect','strokeRect','drawImage','beginPath','closePath','moveTo','lineTo',
      'quadraticCurveTo','bezierCurveTo','arc','fill','stroke','fillText'])Context.prototype[name]=function(){};
    globalThis.CanvasRenderingContext2D=Context;
    globalThis.document={createElement:()=>({getContext:()=>new Context()})};
    globalThis.window={__sceneQA:{state:()=>state}};
    ''' + CARGO_OBSERVER_SCRIPT + MISSION_LABEL_OBSERVER_SCRIPT + f'''
    const ctx=new Context(true),originalText=ctx.fillText.bind(ctx);
    const domEvidence={json.dumps(location_hud)};
    if(domEvidence){{
      const banner={{getBoundingClientRect:()=>({{...domEvidence.location}})}};
      ctx.canvas.getBoundingClientRect=()=>({{...domEvidence.canvas}});
      ctx.canvas.closest=()=>({{querySelectorAll:()=>Array(domEvidence.locationCount).fill(banner)}});
      globalThis.getComputedStyle=node=>node===banner?domEvidence.style:domEvidence.canvasInsets;
    }}
    ctx.fillText=(text,x,y,...rest)=>originalText(text,
      x+(ctx.font.startsWith('10px ')&&text===cargo.label?{cargo_offset}:0),y,...rest);
    ctx.fillRect(0,0,600,400);
    ctx.fillStyle='rgba(0,0,0,0.42)';ctx.fillRect(282,271,36,7);
    ctx.drawImage({{src:'player.png'}},261,196,78,78);
    ctx.fillText('QA',300,208);
    drawMosaicMissionCargo(ctx,cargo,state.player,0,true);
    const object={{x:{300 if operation_overlap else 110},y:{290 if operation_overlap else 140},
      ...getMosaicMissionObjectView(step.operation,{{lang:'en',completed:true}})}};
    drawMosaicMissionObjectLabel(ctx,object);
    ctx.fillStyle='black';ctx.fillRect(0,0,600,400);
    process.stdout.write(JSON.stringify({{cargo,draws:window.__cityCargoDraws,frames:window.__cityLabelFrames}}));
    '''
    result = subprocess.run(['node', '--input-type=module', '--eval', script], text=True, capture_output=True, check=True)
    return json.loads(result.stdout)


class MissionLabelObservationTests(unittest.TestCase):
    def setUp(self):
        self.frame = {'id': 1, 't': 16, 'complete': True, 'viewport': {'width': 600, 'height': 400},
            'player': {'x': 200, 'y': 160}, 'camera': {'x': 0, 'y': 0},
            'cargo': {'id': 'watch-lamp', 'label': "Mirelle's lamp"},
            'labels': [operation_label()],
            'avatarDraws': [painted_rectangle(161, 106, 78, 78, 'drawImage')],
            'playerShadow': painted_rectangle(182, 181, 36, 7),
            'playerName': {'text': 'QA', 'rect': rectangle(190, 110, 20, 10)},
            'cargoDraws': [painted_rectangle(212, 123.5, 29, 34)],
            'cargoLabel': painted_rectangle(140, 82, 120, 17),
            'cargoLabelText': {'text': "Mirelle's lamp", 'rect': rectangle(147, 85, 106, 10)}}

    def test_a_real_command_group_proves_one_readable_label_without_mutating_evidence(self):
        before = copy.deepcopy(self.frame)
        proof = verify_mission_label_frames([self.frame], require_labels=True, require_cargo=True)
        self.assertEqual(self.frame, before)
        self.assertEqual(proof['paintedFrames'], 1)
        self.assertEqual(proof['maxOperationLabelsPerFrame'], 1)
        self.assertEqual(proof['nativeRectanglesVerified'], 5)
        self.assertEqual(proof['textBoundsVerified'], 2)
        self.assertEqual(proof['positionTolerance'], 1e-6)

    def test_real_nova_homonyms_keep_both_painted_groups_without_overwriting_the_carried_label(self):
        observed = observe_nova_homonyms()
        first = observed['frames'][0]
        self.assertEqual(first['cargoLabelText']['text'], 'Nova’s low probe')
        self.assertEqual([line['text'] for line in first['labels'][0]['lines']], ['Nova’s low probe', 'Recovered'])
        self.assertNotEqual(first['cargoLabelText']['rect'], first['labels'][0]['lines'][0]['rect'])
        self.assertEqual(len(observed['draws']), 1)
        self.assertEqual(observed['draws'][0]['local'], {'x': 0, 'y': -66})
        self.assertEqual(verify_cargo_draws(observed['draws'], observed['cargo'])['maxScreenError'], 0)
        proof = verify_mission_label_frames(observed['frames'], require_labels=True, require_cargo=True)
        self.assertEqual(proof['textBoundsVerified'], 2)
        self.assertEqual(proof['positionTolerance'], 1e-6)

    def test_the_real_cargo_group_is_still_observed_and_rejected_when_its_text_moves(self):
        for offset in (-1, 1, 8):
            with self.subTest(offset=offset):
                observed = observe_nova_homonyms(cargo_offset=offset)
                self.assertEqual(len(observed['draws']), 1, 'a displaced cargo draw must not be filtered out')
                self.assertEqual(observed['draws'][0]['local']['x'], offset)
                self.assertEqual(len(observed['frames'][0]['labels'][0]['lines']), 2)
                with self.assertRaisesRegex(AssertionError, 'detached'):
                    verify_cargo_draws(observed['draws'], observed['cargo'])
                if offset == 8:
                    with self.assertRaisesRegex(AssertionError, 'carried label text escapes'):
                        verify_mission_label_frames(observed['frames'], require_labels=True, require_cargo=True)

    def test_a_homonymous_world_cartouche_is_retained_and_rejected_if_it_overlaps_the_avatar(self):
        observed = observe_nova_homonyms(operation_overlap=True)
        self.assertEqual([line['text'] for line in observed['frames'][0]['labels'][0]['lines']],
                         ['Nova’s low probe', 'Recovered'])
        self.assertEqual(verify_cargo_draws(observed['draws'], observed['cargo'])['maxScreenError'], 0)
        with self.assertRaisesRegex(AssertionError, 'overlaps the actual avatar or cargo'):
            verify_mission_label_frames(observed['frames'], require_labels=True, require_cargo=True)

    def test_two_cartouches_in_the_same_frame_are_rejected(self):
        self.frame['labels'].append(operation_label(400, 300))
        with self.assertRaisesRegex(AssertionError, 'multiple operation cartouches'):
            verify_mission_label_frames([self.frame])

    def test_one_pixel_overlap_with_each_actual_protected_part_is_rejected(self):
        parts = [self.frame['avatarDraws'][0]['rect'], self.frame['playerName']['rect'],
                 self.frame['playerShadow']['rect'], self.frame['cargoDraws'][0]['rect'],
                 self.frame['cargoLabel']['rect']]
        for part in parts:
            with self.subTest(part=part):
                frame = copy.deepcopy(self.frame)
                frame['labels'] = [operation_label(part['x'] + part['width'] - 1, part['y'])]
                with self.assertRaisesRegex(AssertionError, 'overlaps the actual avatar or cargo'):
                    verify_mission_label_frames([frame])

    def test_the_existing_tolerance_does_not_admit_a_two_millionths_overlap(self):
        avatar = self.frame['avatarDraws'][0]['rect']
        self.frame['labels'] = [operation_label(avatar['x'] + avatar['width'] - 2e-6, avatar['y'] + 40)]
        with self.assertRaisesRegex(AssertionError, 'overlaps the actual avatar or cargo'):
            verify_mission_label_frames([self.frame])

    def test_hidden_or_overflowing_operation_text_is_rejected(self):
        for failure in ('missing', 'left', 'bottom'):
            with self.subTest(failure=failure):
                frame = copy.deepcopy(self.frame)
                if failure == 'missing':
                    frame['labels'][0]['lines'] = []
                else:
                    frame['labels'][0]['lines'][0]['rect'][{'left': 'x', 'bottom': 'y'}[failure]] = 0 if failure == 'left' else 55
                with self.assertRaisesRegex(AssertionError, 'without its text|text escapes'):
                    verify_mission_label_frames([frame])

    def test_cartouches_outside_the_native_viewport_are_rejected(self):
        for x, y in ((-1, 16), (441, 16), (16, -1), (16, 361)):
            with self.subTest(x=x, y=y):
                frame = copy.deepcopy(self.frame)
                frame['labels'] = [operation_label(x, y)]
                with self.assertRaisesRegex(AssertionError, 'escapes the viewport'):
                    verify_mission_label_frames([frame])

    def test_native_matrix_or_rectangle_inconsistency_is_rejected(self):
        for section, field in (('matrix', 'e'), ('args', 'x'), ('rect', 'width')):
            with self.subTest(section=section, field=field):
                frame = copy.deepcopy(self.frame)
                frame['avatarDraws'][0][section][field] += 1
                with self.assertRaisesRegex(AssertionError, 'inconsistent native draw rectangle'):
                    verify_mission_label_frames([frame])

    def test_nonfinite_rectangles_and_matrices_are_rejected(self):
        for section, fields in (('matrix', ('a', 'b', 'c', 'd', 'e', 'f')),
                                ('args', ('x', 'y', 'width', 'height')), ('rect', ('x', 'y', 'width', 'height'))):
            for field in fields:
                for invalid in (float('nan'), float('inf'), None, True):
                    with self.subTest(section=section, field=field, invalid=invalid):
                        frame = copy.deepcopy(self.frame)
                        frame['cargoDraws'][0][section][field] = invalid
                        with self.assertRaisesRegex(AssertionError, 'non-finite'):
                            verify_mission_label_frames([frame])

    def test_actual_path_bounds_and_stroke_expansion_are_verified(self):
        self.frame['cargoDraws'] = [{'kind': 'stroke', 'points': [
            {'x': 213, 'y': 125}, {'x': 239, 'y': 125}, {'x': 239, 'y': 156}],
            'inflation': {'x': 1, 'y': 1}, 'rect': rectangle(212, 124, 28, 33)}]
        self.assertTrue(verify_mission_label_frames([self.frame])['noPlayerOrCargoIntersection'])
        self.frame['cargoDraws'][0]['inflation']['x'] = 2
        with self.assertRaisesRegex(AssertionError, 'inconsistent native draw rectangle'):
            verify_mission_label_frames([self.frame])

    def test_actual_label_and_cargo_are_required_when_the_journey_expects_them(self):
        frame = copy.deepcopy(self.frame)
        frame['labels'] = []
        with self.assertRaisesRegex(AssertionError, 'no operation cartouche'):
            verify_mission_label_frames([frame], require_labels=True)
        frame = copy.deepcopy(self.frame)
        frame['cargo'] = None
        with self.assertRaisesRegex(AssertionError, 'no carried silhouette'):
            verify_mission_label_frames([frame], require_cargo=True)
        for key in ('cargoDraws', 'cargoLabel', 'cargoLabelText'):
            with self.subTest(key=key):
                frame = copy.deepcopy(self.frame)
                frame[key] = [] if key == 'cargoDraws' else None
                with self.assertRaises(AssertionError):
                    verify_mission_label_frames([frame], require_cargo=True)

    def test_only_completed_frames_count_and_an_open_tail_remains_diagnostic(self):
        tail = copy.deepcopy(self.frame)
        tail.update({'id': 2, 'complete': False, 'labels': [operation_label(), operation_label()]})
        proof = verify_mission_label_frames([self.frame, tail], require_labels=True, require_cargo=True)
        self.assertEqual(proof['paintedFrames'], 1)
        self.assertEqual(proof['unclosedFramesRetained'], 1)
        with self.assertRaisesRegex(AssertionError, 'no completely painted'):
            verify_mission_label_frames([tail])
        tail['complete'] = True
        with self.assertRaisesRegex(AssertionError, 'multiple operation cartouches'):
            verify_mission_label_frames([self.frame, tail])

    def test_frame_identities_and_explicit_completion_boundaries_are_required(self):
        with self.assertRaisesRegex(AssertionError, 'duplicate painted frame'):
            verify_mission_label_frames([self.frame, copy.deepcopy(self.frame)])
        self.frame.pop('complete')
        with self.assertRaisesRegex(AssertionError, 'completion boundary'):
            verify_mission_label_frames([self.frame])

    def test_a_pending_image_never_hides_overlaps_and_cannot_prove_an_avatar(self):
        pending = copy.deepcopy(self.frame)
        pending['avatarDraws'] = []
        ready = copy.deepcopy(self.frame)
        ready['id'] = 2
        proof = verify_mission_label_frames([pending, ready], require_labels=True, require_cargo=True)
        self.assertEqual(proof['framesWithoutAvatarDrawing'], 1)
        self.assertEqual(proof['framesWithAvatarDrawing'], 1)
        with self.assertRaisesRegex(AssertionError, 'no real avatar drawing'):
            verify_mission_label_frames([pending], require_labels=True, require_cargo=True)
        pending['labels'] = [operation_label(259, 82)]
        with self.assertRaisesRegex(AssertionError, 'overlaps the actual avatar or cargo'):
            verify_mission_label_frames([pending, ready], require_labels=True, require_cargo=True)

    def test_remount_visibility_is_explicit_and_checks_every_completed_frame(self):
        second = copy.deepcopy(self.frame)
        second['id'] = 2
        old_scope = verify_mission_label_frames([self.frame])
        self.assertNotIn('playerAndCargoWithinViewport', old_scope)
        proof = verify_mission_label_frames([self.frame, second], require_labels=True,
                                           require_cargo=True, require_player_in_view=True)
        self.assertTrue(proof['playerAndCargoWithinViewport'])
        self.assertEqual(proof['visibilityCheckedFrames'], 2)
        self.assertEqual(proof['positionTolerance'], 1e-6)

    def test_remount_rejects_each_actual_player_or_cargo_part_one_pixel_outside_each_edge(self):
        for group in ('avatarDraws', 'playerShadow', 'playerName', 'cargoDraws', 'cargoLabel'):
            for edge in ('left', 'right', 'top', 'bottom'):
                with self.subTest(group=group, edge=edge):
                    frame = copy.deepcopy(self.frame)
                    draw = frame[group][0] if isinstance(frame[group], list) else frame[group]
                    rect = draw['rect']
                    axis = 'x' if edge in ('left', 'right') else 'y'
                    size = 'width' if axis == 'x' else 'height'
                    target = -1 if edge in ('left', 'top') else frame['viewport'][size] - rect[size] + 1
                    delta = target - rect[axis]
                    rect[axis] = target
                    if 'args' in draw:
                        draw['args'][axis] += delta
                    if group == 'cargoLabel':
                        frame['cargoLabelText']['rect'][axis] += delta
                    with self.assertRaisesRegex(AssertionError, 'escapes the viewport after remount'):
                        verify_mission_label_frames([frame], require_labels=True,
                                                    require_cargo=True, require_player_in_view=True)

    def test_remount_visibility_keeps_the_one_millionth_tolerance(self):
        self.frame['avatarDraws'] = [painted_rectangle(-2e-6, 106, 78, 78, 'drawImage')]
        with self.assertRaisesRegex(AssertionError, 'escapes the viewport after remount'):
            verify_mission_label_frames([self.frame], require_player_in_view=True)

    def test_a_later_visible_frame_does_not_hide_an_earlier_closed_offscreen_frame(self):
        first = copy.deepcopy(self.frame)
        first['avatarDraws'] = [painted_rectangle(601, 106, 78, 78, 'drawImage')]
        second = copy.deepcopy(self.frame)
        second['id'] = 2
        with self.assertRaisesRegex(AssertionError, 'escapes the viewport after remount'):
            verify_mission_label_frames([first, second], require_player_in_view=True)
        # An explicitly open tail remains diagnostic under the same boundary
        # rule as every other assertion; it cannot prove restored visibility.
        first.update({'id': 3, 'complete': False})
        proof = verify_mission_label_frames([second, first], require_player_in_view=True)
        self.assertEqual(proof['visibilityCheckedFrames'], 1)
        self.assertEqual(proof['unclosedFramesRetained'], 1)

    def test_observer_ends_the_player_group_before_later_npcs_and_reads_state_once_per_frame(self):
        # A command-routing double verifies interception and boundaries only.
        # It does not stand in for Chromium geometry or the native CI captures.
        script = '''
        let stateReads=0,matrixReads=0;
        class Context {
          constructor(city=false){this.canvas={width:600,height:400,classList:{contains:()=>city}};
            this.fillStyle='black';this.font='10px test';this.lineWidth=1;}
          getTransform(){matrixReads++;return {a:1,b:0,c:0,d:1,e:0,f:0};}
          measureText(text){return {actualBoundingBoxLeft:0,actualBoundingBoxRight:text.length*5,
            actualBoundingBoxAscent:8,actualBoundingBoxDescent:2};}
        }
        for(const name of ['fillRect','strokeRect','drawImage','beginPath','moveTo','lineTo',
          'quadraticCurveTo','bezierCurveTo','arc','fill','stroke','fillText'])Context.prototype[name]=function(){};
        globalThis.CanvasRenderingContext2D=Context;
        globalThis.document={createElement:()=>({getContext:()=>new Context()})};
        globalThis.window={__sceneQA:{state:()=>{stateReads++;return {t:16,player:{x:200,y:160},
          camera:{x:0,y:0},missionCargo:{label:"Mirelle's lamp"}};}}};
        ''' + MISSION_LABEL_OBSERVER_SCRIPT + '''
        const ctx=new Context(true);
        ctx.fillRect(0,0,600,400);
        const beforeScenery=matrixReads;
        for(let i=0;i<500;i++)ctx.fillRect(i,50,10,10);
        if(stateReads!==1||matrixReads!==beforeScenery)throw Error('scenery redundantly read scene or matrix');
        ctx.fillStyle='rgba(0,0,0,0.42)';ctx.fillRect(182,181,36,7);
        ctx.drawImage({src:'player.png'},161,106,78,78);
        ctx.fillText('QA',200,118);
        ctx.fillStyle='#ff0';ctx.fillRect(212,124,29,34);
        ctx.fillStyle='rgba(5,12,18,0.93)';ctx.fillRect(140,82,120,17);
        ctx.fillText("Mirelle's lamp",147,93);
        ctx.fillStyle='rgba(0,0,0,0.42)';ctx.fillRect(382,221,36,7);
        ctx.drawImage({src:'later-npc.png'},0,0,500,300);ctx.fillText('Resident',400,210);
        ctx.fillStyle='rgba(5,12,18,0.94)';ctx.fillRect(16,16,160,40);
        ctx.font='12px test';ctx.fillText('The relay',23,31);
        ctx.fillRect(0,0,600,400);
        const first=window.__cityLabelFrames[0],last=window.__cityLabelFrames[1];
        if(stateReads!==2||!first.complete||last.complete)throw Error('frame completion/state boundary failed');
        if(first.avatarDraws.length!==1||first.avatarDraws[0].source!=='player.png')throw Error('later NPC joined avatar');
        if(first.cargoDraws.length!==1)throw Error('later NPC joined cargo');
        if(first.labels.length!==1||first.labels[0].lines.length!==1)throw Error('label was not observed');
        process.stdout.write(JSON.stringify({avatar:first.avatarDraws.length,cargo:first.cargoDraws.length,stateReads}));
        '''
        result = subprocess.run(['node', '--input-type=module', '--eval', script], text=True, capture_output=True, check=True)
        self.assertEqual(json.loads(result.stdout), {'avatar': 1, 'cargo': 1, 'stateReads': 2})


    def test_location_hud_projection_uses_dom_offsets_and_non_unit_scales_without_mutating_frames(self):
        for canvas, safe, covering in (
            (rectangle(70, 120, 300, 100), rectangle(320, 210, 30, 5), rectangle(78, 124, 80, 10)),
            (rectangle(-80, 45, 1200, 800), rectangle(920, 745, 120, 40), rectangle(-48, 77, 320, 80)),
        ):
            with self.subTest(canvas=canvas):
                frame = copy.deepcopy(self.frame)
                frame['locationHud'] = location_hud_record(canvas, safe)
                before = copy.deepcopy(frame)
                proof = verify_mission_label_frames([frame], require_labels=True, require_location_hud=True)
                self.assertEqual(frame, before)
                self.assertTrue(proof['noLocationBannerIntersection'])
                self.assertEqual(proof['locationHudFrames'], 1)
                self.assertEqual(proof['locationHudIntersectingFrames'], 1)
                self.assertEqual(proof['locationHudLabelComparisons'], 1)
                frame['locationHud']['location'] = covering
                with self.assertRaisesRegex(AssertionError, 'overlaps the actual location HUD'):
                    verify_mission_label_frames([frame], require_location_hud=True)

    def test_location_hud_rejects_the_two_reported_landscape_cartouche_geometries(self):
        # bff8879 native cartouche geometry with a synthetic DOM rectangle based
        # on the measured PNG footprint. This is not a new native browser run.
        for x, y in ((413.097900390625, 162.06362915039062), (422.9815673828125, 171.6516737582648)):
            with self.subTest(x=x, y=y):
                frame = copy.deepcopy(self.frame)
                frame['viewport'] = {'width': 1169, 'height': 540}
                label = operation_label(x, y)
                label['args'].update({'width': 188, 'height': 42})
                label['rect'].update({'width': 188, 'height': 42})
                frame['labels'] = [label]
                frame['locationHud'] = location_hud_record(rectangle(0, 0, 844, 390), rectangle(32, 84, 320, 99))
                self.assertTrue(verify_mission_label_frames([frame], require_labels=True)['noPlayerOrCargoIntersection'])
                with self.assertRaisesRegex(AssertionError, 'overlaps the actual location HUD'):
                    verify_mission_label_frames([frame], require_labels=True, require_location_hud=True)

    def test_location_hud_keeps_one_pixel_and_two_millionths_intersections_rejected(self):
        for axis in ('x', 'y'):
            for overlap in (1, 2e-6):
                with self.subTest(axis=axis, overlap=overlap):
                    frame = copy.deepcopy(self.frame)
                    location = rectangle(16, 16, 160, 40)
                    location[axis] += location['width' if axis == 'x' else 'height'] - overlap
                    frame['locationHud'] = location_hud_record(rectangle(0, 0, 600, 400), location)
                    with self.assertRaisesRegex(AssertionError, 'overlaps the actual location HUD'):
                        verify_mission_label_frames([frame], require_location_hud=True)
                    location[axis] += overlap
                    proof = verify_mission_label_frames([frame], require_location_hud=True)
                    self.assertEqual(proof['positionTolerance'], 1e-6)

    def test_location_hud_clips_to_canvas_and_valid_outside_banners_cannot_mask_labels(self):
        for location in (rectangle(-50, 0, 50, 400), rectangle(600, 0, 50, 400),
                         rectangle(0, -50, 600, 50), rectangle(0, 400, 600, 50)):
            with self.subTest(location=location):
                frame = copy.deepcopy(self.frame)
                frame['locationHud'] = location_hud_record(rectangle(0, 0, 600, 400), location)
                proof = verify_mission_label_frames([frame], require_location_hud=True)
                self.assertTrue(proof['noLocationBannerIntersection'])
                self.assertEqual(proof['locationHudIntersectingFrames'], 0)
                self.assertEqual(proof['locationHudLabelComparisons'], 1)
        frame = copy.deepcopy(self.frame)
        frame['locationHud'] = location_hud_record(rectangle(0, 0, 600, 400), rectangle(-50, -50, 80, 80))
        with self.assertRaisesRegex(AssertionError, 'overlaps the actual location HUD'):
            verify_mission_label_frames([frame], require_location_hud=True)
        frame['locationHud']['location'] = rectangle(-50, -50, 60, 60)
        proof = verify_mission_label_frames([frame], require_location_hud=True)
        self.assertEqual(proof['locationHudIntersectingFrames'], 1)

    def test_location_hud_requires_unambiguous_visible_native_dom_measurements(self):
        candidates = [None, {}, location_hud_record()]
        candidates[-1]['locationCount'] = 0
        for count in (2, True):
            value = location_hud_record(); value['locationCount'] = count; candidates.append(value)
        for key, value in (('display', 'none'), ('visibility', 'hidden'), ('opacity', 0), ('opacity', float('nan'))):
            hud = location_hud_record(); hud['style'][key] = value; candidates.append(hud)
        for field in ('canvas', 'location'):
            for key in ('x', 'y', 'width', 'height'):
                hud = location_hud_record(); hud[field][key] = float('nan'); candidates.append(hud)
            hud = location_hud_record(); hud[field]['width'] = 0; candidates.append(hud)
        for key in ('borderLeftWidth', 'paddingTop'):
            hud = location_hud_record(); hud['canvasInsets'][key] = 1; candidates.append(hud)
        for hud in candidates:
            with self.subTest(hud=hud):
                frame = copy.deepcopy(self.frame); frame['locationHud'] = hud
                with self.assertRaisesRegex(AssertionError, 'location HUD'):
                    verify_mission_label_frames([frame], require_location_hud=True)

    def test_location_hud_checks_every_closed_frame_and_retains_the_open_tail_as_diagnostic(self):
        safe = copy.deepcopy(self.frame); safe['locationHud'] = location_hud_record()
        overlaid = copy.deepcopy(safe); overlaid['id'] = 2
        overlaid['locationHud']['location'] = rectangle(78, 124, 80, 10)
        with self.assertRaisesRegex(AssertionError, 'overlaps the actual location HUD'):
            verify_mission_label_frames([overlaid, safe], require_location_hud=True)
        overlaid['complete'] = False
        proof = verify_mission_label_frames([safe, overlaid], require_location_hud=True)
        self.assertEqual(proof['locationHudFrames'], 1)
        self.assertEqual(proof['unclosedFramesRetained'], 1)

    def test_native_observer_records_raw_dom_bounds_without_using_runtime_placement(self):
        hud = location_hud_record()
        observed = observe_nova_homonyms(location_hud=hud)
        self.assertEqual(observed['frames'][0]['locationHud'], hud)
        self.assertEqual(observed['frames'][1]['locationHud'], hud)
        proof = verify_mission_label_frames(observed['frames'], require_labels=True, require_cargo=True,
                                           require_location_hud=True)
        self.assertTrue(proof['noLocationBannerIntersection'])
        self.assertEqual(proof['locationHudLabelComparisons'], 1)


if __name__ == '__main__':
    unittest.main()
