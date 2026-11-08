"""Validator regressions use synthetic matrices, not a claimed browser run."""
import copy
import json
import subprocess
import unittest

from mosaicCargoObservation import (
    LABEL_OFFSET, POSITION_TOLERANCE, MISSION_LABEL_OBSERVER_SCRIPT,
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


if __name__ == '__main__':
    unittest.main()
