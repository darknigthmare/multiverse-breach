#!/usr/bin/env python3
"""Play the original City contracts through real movement, menus and choices.

The fixture prepares ownership and a starting district before acceptance. No
position, quest progress, evidence, reward or ending is injected during play.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check
from browserResidentViewmodels import CLOCK_EPOCH, CLOCK_START
from browserCityFpsOperations import begin_walk_proof, DISTRICT
from browserNexusCampaign import load, reading_scale
from mosaicMotionProof import validate_mosaic_motion

NEXUS_CONTRACTS = [
    ('city-anchor-signature-v1', 'replace-origin', 'retain-origin'),
    ('city-mirelle-suture-v1', 'erase-copy', 'separate-traces'),
    ('city-bastion-tenth-route-v1', 'perfect-report', 'name-debt'),
    ('city-nova-measured-exit-v1', 'guarantee-future', 'mark-uncertainty'),
    ('city-sable-signed-map-v1', 'anonymous-perfect', 'signed-correction'),
    ('city-loom-return-thread-v1', 'send-unverified', 'verify-thread'),
    ('city-marrow-distinct-choices-v1', 'erase-double', 'separate-testimony'),
    ('city-tessera-two-accounts-v1', 'replace-memory', 'parallel-accounts'),
    ('city-quillon-single-receipt-v1', 'charge-absent', 'link-copy'),
    ('city-nadir-return-probe-v1', 'guarantee-all-routes', 'bounded-return'),
    ('city-elyra-consented-door-v1', 'reuse-consent', 'honour-both'),
    ('city-oryn-separate-voices-v1', 'one-spokesperson', 'separate-voices'),
]
NEW_NEXUS_IDS = {entry[0] for entry in NEXUS_CONTRACTS[7:]}
FOLLOWUP_IDS = [
    'city-anchor-trace-return-v1', 'city-mirelle-relay-followup-v1', 'city-bastion-tenth-witness-v1',
    'city-nova-return-measurement-v1', 'city-sable-map-detour-v1', 'city-loom-receiving-end-v1',
    'city-marrow-independent-answers-v1', 'city-tessera-caption-review-v1', 'city-quillon-delivery-check-v1',
    'city-nadir-second-threshold-v1', 'city-elyra-renewed-passage-v1', 'city-oryn-manifest-delivery-v1',
]
FOLLOWUPS = [(mission_id, 'shortcut', 'apply' if index % 2 == 0 else 'hold')
             for index, mission_id in enumerate(FOLLOWUP_IDS)]
PREREQUISITES = dict(zip(FOLLOWUP_IDS, [entry[0] for entry in NEXUS_CONTRACTS]))
NEXUS_ALL = NEXUS_CONTRACTS + FOLLOWUPS
DISTRICTS = {
    'nexus': {'id': DISTRICT, 'universe': 'Nexus de Convergence', 'catalog': 'nexus',
              'contracts': NEXUS_ALL, 'mobile': [
                  (NEXUS_CONTRACTS[9][0], NEXUS_CONTRACTS[9][1], 'repeat-probe'),
                  (NEXUS_CONTRACTS[10][0], NEXUS_CONTRACTS[10][1], 'close-terminal'),
                  (FOLLOWUP_IDS[9], 'shortcut', 'apply'), (FOLLOWUP_IDS[10], 'shortcut', 'hold')],
              'requiredArt': []},
    'halo': {'id': 'universe-halo', 'universe': 'Halo', 'catalog': 'city-contracts',
             'contracts': [
                 ('city-chief-unsc-route-v1', 'shield-guarantee', 'mark-unverified'),
                 ('city-chief-return-corridor-v1', 'discard-fallback', 'keep-fallback')],
             'requiredArt': ['/sprites/generated/heroes/halo/master-chief-complete/master-chief-universal.png']},
    'alien': {'id': 'universe-alien', 'universe': 'Alien', 'catalog': 'city-contracts',
              'contracts': [
                  ('city-ripley-narcissus-route-v1', 'follow-alarm', 'preserve-escape'),
                  ('city-ripley-alarm-exit-v1', 'silence-warning', 'separate-signals')],
              'requiredArt': ['/sprites/generated/heroes/alien/ripley-v2-fidelity-wave12-2026-11-01.png']}
}


def progress(page):
    return page.evaluate('window.__sceneQA.characterMissions')


def mission_objects(page):
    return page.evaluate('window.__sceneQA.snapshot().missionObjects')


def verify_operation(definition, before, after, objects_before, objects_after, observed_target):
    """Compare independently captured declaration, save receipt and live scene."""
    mission_id, step_id = definition['missionId'], definition['stepId']
    previous_receipts = before['records'][mission_id].get('operationReceipts', {})
    receipts = after['records'][mission_id].get('operationReceipts', {})
    check(step_id not in previous_receipts, 'operation was already received before reaching its object')
    check(all(receipts.get(key) == value for key, value in previous_receipts.items()),
          'a new operation changed an earlier receipt')
    check(set(receipts) == set(previous_receipts) | {step_id}, 'one operation created unrelated receipts')
    receipt = receipts[step_id]
    expected = {key: definition[key] for key in ['missionId', 'stepId', 'districtId', 'universe', 'targetId', 'kind']}
    check(receipt.get('version') == 1 and all(receipt.get(key) == value for key, value in expected.items()),
          'operation receipt does not match the pre-click definition')
    prior_sequences = [item.get('sequence', 0) for record in before['records'].values()
                       for item in record.get('operationReceipts', {}).values()]
    check(type(receipt.get('sequence')) is int and receipt['sequence'] > max(prior_sequences, default=0),
          'operation sequence did not advance after the actual intervention')
    if ('x' in receipt or 'y' in receipt) and definition['sourceType'] != 'exhibit':
        check(observed_target and all(abs(receipt[key] - observed_target[key]) <= 1e-6 for key in ['x', 'y']),
              'receipt position does not match the physical target observed before approach')
    if 'originChoiceId' in receipt:
        check(receipt['originChoiceId'] == definition['originChoiceId'], 'receipt lost the preceding story choice')
    if 'originStoryRevision' in receipt:
        check(receipt['originStoryRevision'] == definition['originStoryRevision'], 'receipt mixed old and new preceding stories')
    if 'branchChoiceId' in receipt:
        check(receipt['branchChoiceId'] == definition['branchChoiceId'], 'receipt used the wrong current-choice branch')
    current_id = f'{mission_id}::{step_id}'
    pending = next((item for item in objects_before if item['id'] == current_id), None)
    completed = next((item for item in objects_after if item['id'] == current_id), None)
    check(pending and pending['active'] and not pending['completed'], 'the actual operation object was not pending before approach')
    check(completed and completed['completed'] and not completed['active'], 'the actual operation object did not finish after interaction')
    for key in ['missionId', 'stepId', 'universe', 'targetId', 'sourceType', 'kind', 'label', 'propName', 'completedText']:
        check(pending[key] == completed[key] == definition[key], f'operation object differs from its declaration: {key}')
    check(all(abs(pending[key] - completed[key]) <= 1e-6 for key in ['x', 'y']), 'operation completion moved its object')
    if definition['sourceType'] == 'marker':
        check(all(abs(completed[key] - definition[key]) <= 1e-6 for key in ['x', 'y']), 'branch operation is at the wrong marker position')
    check(completed['sequence'] == receipt['sequence'], 'object was restored from another operation receipt')
    if definition['sourceType'] == 'exhibit' and 'x' in receipt:
        check(all(abs(receipt[key] - completed[key]) <= 1e-6 for key in ['x', 'y']),
              'display operation receipt does not match its actual interaction slot')
    check(completed['statusLabel'] and completed['statusLabel'] != pending['statusLabel'], 'completed object kept its pending action label')
    return {'definition': definition, 'receipt': receipt, 'objectBefore': pending, 'objectAfter': completed}


def terminal(page):
    conversation = page.locator('.mosaic-resident-dialogue')
    if conversation.count():
        conversation.locator('[data-dialogue-return]').click()
        expect(conversation).to_have_count(0)
    if not page.get_by_role('dialog').count():
        page.get_by_role('button', name='TERMINAL · JOURNAL', exact=True).click()
    expect(page.locator('.mosaic-character-missions')).to_be_visible()


def reach_and_measure(button, page):
    button.scroll_into_view_if_needed()
    box = button.bounding_box()
    view = page.viewport_size
    check(box and box['width'] >= 44 and box['height'] >= 44, 'contract control smaller than 44 px')
    check(box['x'] >= -1 and box['x'] + box['width'] <= view['width'] + 1, 'contract control clips horizontally')
    check(button.evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'), 'contract control text overflows')


def interrupt_route(page, panel, out, name):
    evidence = []
    for interruption in ['pause', 'terminal']:
        terminal(page)
        button = panel.locator('[data-city-contract-approach]')
        before_progress = progress(page)
        begin_walk_proof(button)
        button.click()
        entry = {'interruption': interruption}
        evidence.append(entry)
        try:
            page.clock.run_for(80)
            check(progress(page) == before_progress, 'interruption scenario reached the target before interruption')
            entry['moving'] = page.evaluate('window.__sceneQA.snapshot()')
            check(entry['moving']['destination'] is not None, 'no active route to interrupt')
            if interruption == 'pause':
                page.locator('#qa-pause').click()
            else:
                terminal(page)
            page.wait_for_function('window.__sceneQA.snapshot().destination===null', polling=50)
            stopped = page.evaluate('window.__sceneQA.snapshot()')
            entry['stopped'] = stopped
            check(not any(stopped['keys'].values()), 'interruption retained a held movement command')
            check(page.evaluate('window.__sceneQA.state().pendingInteraction') is None,
                  'interruption retained an automatic interaction')
            page.clock.run_for(500)
            entry['whileStopped'] = page.evaluate('window.__sceneQA.snapshot()')
            check(entry['whileStopped'] == stopped, 'interrupted simulation advanced')
            if interruption == 'pause':
                page.locator('#qa-pause').click()
            else:
                page.keyboard.press('Escape')
                expect(page.get_by_role('dialog')).to_have_count(0)
            page.clock.run_for(250)
            resumed = page.evaluate('window.__sceneQA.snapshot()')
            entry['afterResume'] = resumed
            check(resumed['t'] > stopped['t'], 'simulation did not resume after the explicit close/resume command')
            # The frozen running pose becomes idle on the first resumed tick.
            # Position, facing and speed must stay exact; no route or command
            # may survive the interruption or restart without another request.
            check(all(resumed['player'][key] == stopped['player'][key]
                      for key in ['x', 'y', 'facing', 'speed']),
                  'player moved or changed facing/speed without an explicit new request')
            check(resumed['player']['state'] == 'idle' and resumed['destination'] is None
                  and not any(resumed['keys'].values())
                  and page.evaluate('window.__sceneQA.state().pendingInteraction') is None,
                  'route or interaction resumed without an explicit new request')
            check(progress(page) == before_progress, 'pause or menu recorded evidence')
        finally:
            proof = page.evaluate('window.__stopReconnaissanceMotion()')
            entry['motionProof'] = proof
            (out / f'{name}-interrupted-routes.json').write_text(json.dumps(evidence, indent=2))
        entry['motion'] = validate_mosaic_motion(proof)
        (out / f'{name}-interrupted-routes.json').write_text(json.dumps(evidence, indent=2))
    terminal(page)
    return evidence


def play_contract(page, entry, out, case_name, district, universe, remount=False, interrupt=False):
    mission_id, invalid_choice, valid_choice = entry
    terminal(page)
    panel = page.locator('.mosaic-character-missions')
    panel.locator('select').select_option(mission_id)
    accept = panel.locator('[data-city-contract-accept]')
    reach_and_measure(accept, page)
    expect(panel.locator('[data-city-contract-choice]')).to_have_count(0)
    accept.focus()
    page.keyboard.press('Enter')
    page.wait_for_function('id=>window.__sceneQA.characterMissions?.activeId===id', arg=mission_id, polling=50)
    case = {'missionId': mission_id, 'districtId': district, 'universe': universe,
            'walks': [], 'operations': [], 'choice': None, 'remount': None}
    if mission_id in PREREQUISITES:
        saved = progress(page)['records']
        source = saved[PREREQUISITES[mission_id]]
        check(source['completed'], 'follow-up started before its preceding report')
        check(saved[mission_id]['originChoiceId'] == source['choiceId'], 'follow-up lost its preceding choice')
        case['origin'] = {'missionId': PREREQUISITES[mission_id], 'choiceId': source['choiceId']}
    check(progress(page)['records'][mission_id]['districtId'] == district and
          progress(page)['records'][mission_id]['universe'] == universe,
          'contract acceptance used a different district or source universe')
    if interrupt:
        case['interruptions'] = interrupt_route(page, panel, out, f'{case_name}-{mission_id}')
    while not progress(page)['records'][mission_id]['completed']:
        terminal(page)
        objective = panel.locator('[data-city-contract-objective]')
        before = progress(page)
        index = len(before['records'][mission_id]['completedStepIds'])
        completed_operation = None
        if objective.get_attribute('data-step') == 'resolution':
            wrong = panel.locator(f'[data-city-contract-choice="{invalid_choice}"]')
            reach_and_measure(wrong, page)
            wrong.click()
            check(progress(page) == before, 'contradictory choice advanced the contract')
            expect(panel.locator('[data-city-contract-feedback]')).to_be_visible()
            correct = panel.locator(f'[data-city-contract-choice="{valid_choice}"]')
            reach_and_measure(correct, page)
            page.screenshot(path=str(out / f'{case_name}-{mission_id}-choice.png'))
            correct.focus()
            page.keyboard.press('Enter')
            page.clock.run_for(20)
            check(progress(page)['records'][mission_id]['choiceId'] == valid_choice, 'choice was not recorded')
            check(objective.evaluate('(node)=>node===document.activeElement'), 'focus was lost when choice buttons disappeared')
            case['choice'] = {'rejected': invalid_choice, 'recorded': valid_choice}
        else:
            button = panel.locator('[data-city-contract-approach]')
            reach_and_measure(button, page)
            step_id = objective.get_attribute('data-step')
            expected_target = page.evaluate('input=>window.__sceneQA.cityContractTarget(input)', arg={
                'missionId': mission_id, 'stepId': step_id, 'districtId': district})
            check(expected_target and expected_target['universe'] == universe,
                  'contract approach is missing its declared target or source universe')
            proximity_before = page.evaluate('''target=>target.type==='npc'
              ? window.__sceneQA.cityNpc(target.id) : window.__sceneQA.cityZone(target.id)''', arg=expected_target) if expected_target else None
            operation_before = page.evaluate('input=>window.__sceneQA.cityContractOperation(input)', arg={
                'missionId': mission_id, 'stepId': step_id, 'districtId': district})
            objects_before = mission_objects(page)
            check(progress(page) == before, 'observing the operation declaration changed quest progress')
            capture_operation = bool(operation_before and interrupt and not case['operations'] and case_name.endswith('-fr-desktop'))
            if capture_operation:
                page.keyboard.press('Escape')
                expect(page.get_by_role('dialog')).to_have_count(0)
                position_before = page.evaluate('window.__sceneQA.snapshot().player')
                page.clock.run_for(32)
                after_frame = page.evaluate('window.__sceneQA.snapshot().player')
                check(all(after_frame[key] == position_before[key] for key in ['x', 'y', 'speed', 'facing']) and progress(page) == before,
                      'opening the operation view moved the player or performed the intervention')
                image_name = f'{case_name}-{mission_id}-step-{index}-operation'
                page.screenshot(path=str(out / f'{image_name}-before.png'))
                case['operationCapture'] = {'before': f'{image_name}-before.png', 'after': f'{image_name}-after.png'}
                terminal(page)
            begin_walk_proof(button)
            button.click()
            try:
                for _ in range(160):
                    page.clock.run_for(250)
                    if len(progress(page)['records'][mission_id]['completedStepIds']) > index:
                        break
                check(len(progress(page)['records'][mission_id]['completedStepIds']) == index + 1,
                      f'{mission_id} could not reach step {index} by normal movement')
            finally:
                proof = page.evaluate('window.__stopReconnaissanceMotion()')
                proof['expectedTarget'] = expected_target
                proof['proximityBefore'] = proximity_before
                proof['operationBefore'] = operation_before
                proof['objectsBefore'] = objects_before
                proof['receiptsBefore'] = before['records'][mission_id].get('operationReceipts', {})
                proof['receiptsAfter'] = progress(page)['records'][mission_id].get('operationReceipts', {})
                proof['sceneAfter'] = page.evaluate('''()=>{const s=window.__sceneQA.state();return {
                  snapshot:window.__sceneQA.snapshot(),pendingInteraction:s.pendingInteraction,
                  destinationRoute:s.destinationRoute,obstacles:s.obstacles};}''')
                (out / f'{case_name}-{mission_id}-step-{index}.json').write_text(json.dumps(proof, indent=2))
            if proof.get('clickBefore') and proof.get('clickAfter'):
                check(proof['clickBefore']['x'] == proof['clickAfter']['x'] and
                      proof['clickBefore']['y'] == proof['clickAfter']['y'], 'approach teleported on click')
            motion = validate_mosaic_motion(proof, nearby_target=expected_target)
            case['walks'].append({'index': index, 'motion': motion})
            if operation_before:
                completed_operation = verify_operation(operation_before, before, progress(page), objects_before,
                                                       mission_objects(page), proximity_before)
                case['operations'].append(completed_operation)
                if capture_operation:
                    page.screenshot(path=str(out / case['operationCapture']['after']))
            else:
                check(before['records'][mission_id].get('operationReceipts', {}) ==
                      progress(page)['records'][mission_id].get('operationReceipts', {}),
                      'a conversation or plain arrival fabricated an operation receipt')
        saved = progress(page)
        terminal(page)
        frozen = page.evaluate('window.__sceneQA.snapshot()')
        page.clock.run_for(500)
        check(progress(page) == saved, 'reading the contract advanced an objective')
        check(page.evaluate('window.__sceneQA.snapshot().player') == frozen['player'], 'City moved under the terminal')
        if remount and completed_operation and case['remount'] is None:
            page.keyboard.press('Escape')
            expect(page.get_by_role('dialog')).to_have_count(0)
            before_unmount = page.evaluate('({position:window.__sceneQA.snapshot().player,objects:window.__sceneQA.snapshot().missionObjects,saveCount:window.__sceneQA.saves.length})')
            page.locator('#qa-unmount').click()
            expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
            page.wait_for_function('count=>window.__sceneQA.saves.length>count', arg=before_unmount['saveCount'], polling=50)
            checkpoint = page.evaluate('window.__sceneQA.saves.at(-1)')
            check(checkpoint['districtId'] == district, 'remount checkpoint changed the contract district')
            page.wait_for_function('value=>JSON.stringify(window.__sceneQA.saved)===JSON.stringify(value)', arg=checkpoint, polling=50)
            page.evaluate('window.__sceneQA.remount()')
            page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
            check(progress(page) == saved, 'remount discarded a contract checkpoint')
            restored = page.evaluate('window.__sceneQA.snapshot().player')
            check(abs(restored['x'] - before_unmount['position']['x']) < .02 and
                  abs(restored['y'] - before_unmount['position']['y']) < .02, 'remount lost the player checkpoint')
            check(mission_objects(page) == before_unmount['objects'], 'remount changed the real operation object states')
            check(progress(page)['records'][mission_id].get('operationReceipts') == saved['records'][mission_id].get('operationReceipts'),
                  'remount lost or changed an operation receipt')
            terminal(page)
            panel.locator('select').select_option(mission_id)
            case['remount'] = {'completedStepIds': saved['records'][mission_id]['completedStepIds'], 'preserved': True,
                               'operationReceipt': completed_operation['receipt'], 'objects': before_unmount['objects'],
                               'operationObjectsPreserved': True}
    terminal(page)
    expect(panel.locator('[data-city-contract-objective]')).to_have_attribute('data-contract-id', mission_id)
    expect(panel.locator('[data-city-contract-accept]')).to_have_count(0)
    expect(panel.locator('[data-city-contract-approach]')).to_have_count(0)
    expect(panel.locator('[data-city-contract-choice]')).to_have_count(0)
    check(progress(page)['activeId'] is None, 'completed contract remains active')
    check(not page.evaluate('window.__sceneQA.reports.length'), 'City contract emitted a combat reward receipt')
    check(case['operations'], 'authored City adventure completed without any real operation')
    if remount:
        check(case['remount'] and case['remount']['operationObjectsPreserved'], 'contract did not verify its operation checkpoint')
    case['receipt'] = progress(page)['records'][mission_id]
    check(case['receipt']['districtId'] == district and case['receipt']['universe'] == universe,
          'completed contract lost its source district or universe')
    return case


def resident_offer_journey(page, args, lang, out, name):
    """Enter the district and meet Mirelle using only normal player controls."""
    record = {'status': 'running', 'missionId': 'city-mirelle-suture-v1', 'resident': 'arca_mirelle',
              'scope': 'Fresh Atrium spawn, native portal travel and resident approach; no position or progress injection.'}
    try:
        page.clock.install(time=CLOCK_EPOCH); page.clock.pause_at(CLOCK_START)
        load(page, args, 'city', lang, 'nexus')
        check(not (progress(page) or {}).get('records'), 'offer journey began with quest progress')
        later = page.get_by_role('button', name='Plus tard' if lang == 'fr' else 'Later', exact=True)
        if later.is_visible(): later.click()
        page.clock.run_for(32)
        canvas = page.locator('.mosaic-rpg-canvas')
        departure = page.evaluate('window.__sceneQA.snapshot()')
        # Walk east until the portal enters the camera, as a player would from
        # the Atrium spawn. This is native keyboard input, never a position edit.
        canvas.focus()
        page.keyboard.down('ArrowRight')
        try:
            page.clock.run_for(2000)
        finally:
            page.keyboard.up('ArrowRight')
        page.clock.run_for(32)
        approached = page.evaluate('window.__sceneQA.snapshot()')
        check(approached['player']['x'] > departure['player']['x'] and not any(approached['keys'].values()),
              'native eastward input did not move and release the player')
        check(not (progress(page) or {}).get('records'), 'walking across the Atrium accepted a quest')
        record['atriumWalk'] = {'before': departure, 'after': approached}
        # The east Atrium portal is authored at (1420, 520). Convert that real
        # world point with the canvas's current camera and scale; input remains
        # a native click, followed by the engine's own walk and portal transfer.
        point = canvas.evaluate('''node=>{const r=node.getBoundingClientRect(),s=window.__sceneQA.state();
          return {x:(1420-s.camera.x)*r.width/node.width,y:(520-s.camera.y)*r.height/node.height,
            width:r.width,height:r.height,before:window.__sceneQA.snapshot()};}''')
        check(0 < point['x'] < point['width'] and 0 < point['y'] < point['height'], 'east Atrium portal is outside the native canvas view')
        canvas.click(position={'x': point['x'], 'y': point['y']})
        for _ in range(160):
            page.clock.run_for(250)
            if page.evaluate('window.__sceneQA.saved?.districtId') == 'threads': break
        check(page.evaluate('window.__sceneQA.saved?.districtId') == 'threads', 'native Atrium portal walk did not reach the Gallery')
        record['atriumPortal'] = {'screenPoint': {key: point[key] for key in ['x', 'y']}, 'before': point['before'],
                                 'after': page.evaluate('window.__sceneQA.snapshot()')}
        terminal(page)
        destinations = page.get_by_role('region', name='Catalogue des quartiers disponibles' if lang == 'fr' else 'Available district catalog', exact=True)
        destination = destinations.get_by_role('button', name='Nexus de Convergence', exact=True)
        destination.click()
        for _ in range(160):
            page.clock.run_for(250)
            if page.evaluate('window.__sceneQA.saved?.districtId') == DISTRICT: break
        check(page.evaluate('window.__sceneQA.saved?.districtId') == DISTRICT, 'native Gallery portal walk did not enter the Nexus district')
        check(not (progress(page) or {}).get('records'), 'portal travel accepted a quest')
        terminal(page)
        directory = page.locator('.mosaic-resident-directory')
        directory.locator('summary').click()
        directory.get_by_role('searchbox').fill('Mirelle')
        target = directory.locator('[data-resident-id="arca_mirelle"]')
        before = progress(page)
        expected_target = page.evaluate('input=>window.__sceneQA.cityContractTarget(input)', arg={
            'missionId': record['missionId'], 'stepId': 'meet-arca_mirelle', 'districtId': DISTRICT})
        proximity_before = page.evaluate('window.__sceneQA.cityNpc("arca_mirelle")')
        begin_walk_proof(target)
        target.click()
        try:
            for _ in range(160):
                page.clock.run_for(250)
                if page.locator('[data-city-quest-offer="city-mirelle-suture-v1"]').count(): break
            conversation = page.locator('[data-city-conversation="arca_mirelle"]')
            offer = conversation.locator('[data-city-quest-offer="city-mirelle-suture-v1"]')
            expect(offer).to_be_visible()
        finally:
            proof = page.evaluate('window.__stopReconnaissanceMotion()')
            proof['expectedTarget'] = expected_target
            proof['proximityBefore'] = proximity_before
            proof['sceneAfter'] = page.evaluate('window.__sceneQA.snapshot()')
            (out / f'{name}-offer-walk.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2))
        record['nativeWalk'] = validate_mosaic_motion(proof, nearby_target=expected_target)
        record['expectedTarget'] = expected_target
        record['proximityBefore'] = proximity_before
        check(progress(page) == before, 'receiving or reading an offer accepted it automatically')
        words = page.evaluate('''async lang=>{const {MOSAIC_CHARACTER_MISSIONS}=await import('/src/game/mosaicCharacterMissions.js');
          const m=MOSAIC_CHARACTER_MISSIONS.find(item=>item.id==='city-mirelle-suture-v1');
          return {request:m.request[lang],reply:m.steps.find(step=>step.id==='meet-arca_mirelle').dialogue[lang]};}''', lang)
        speech = conversation.locator('[data-dialogue-quest] blockquote p')
        expect(speech).to_have_text(words['request'])
        check(not conversation.locator('[data-dialogue-topic]').count(), 'Mirelle received invented archive topics')
        frozen = page.evaluate('window.__sceneQA.snapshot()')
        page.clock.run_for(500)
        check(page.evaluate('window.__sceneQA.snapshot()') == frozen and progress(page) == before,
              'reading the real offer advanced the scene or quest')
        page.screenshot(path=str(out / f'{name}-offer-received.png'))
        offer.focus(); page.keyboard.press('Enter')
        expect(offer).to_have_count(0)
        expect(conversation.locator('[data-dialogue-return]')).to_be_focused()
        expect(speech).to_have_text(words['reply'])
        saved = progress(page)
        check(saved['activeId'] == record['missionId'], 'keyboard acceptance did not track the offered mission')
        check(saved['records'][record['missionId']]['completedStepIds'] == ['meet-arca_mirelle'],
              'real resident acceptance did not preserve exactly the actual first meeting')
        check(saved['records'][record['missionId']].get('operationReceipts') == {}, 'accepting a request fabricated a physical intervention')
        check(page.evaluate('window.__sceneQA.snapshot().player') == frozen['player'], 'accepting a resident request moved the player')
        page.clock.run_for(500)
        check(progress(page) == saved, 'accepted conversation advanced another step while being read')
        check(not page.evaluate('window.__sceneQA.reports.length'), 'a request created a combat reward')
        page.screenshot(path=str(out / f'{name}-offer-accepted.png'))
        record.update({'status': 'passed', 'request': words['request'], 'reply': words['reply'],
                       'acceptanceFocus': True, 'receipt': saved['records'][record['missionId']]})
        conversation.locator('[data-dialogue-return]').click()
        expect(page.get_by_role('dialog')).to_have_count(0)
        return record
    except Exception as error:
        record.update({'status': 'failed', 'error': str(error)})
        page.screenshot(path=str(out / f'{name}-offer-failure.png'))
        raise
    finally:
        (out / f'{name}-offer.json').write_text(json.dumps(record, ensure_ascii=False, indent=2))


def run_case(page, args, profile, lang, label, out, name, result):
    page.clock.install(time=CLOCK_EPOCH); page.clock.pause_at(CLOCK_START)
    load(page, args, 'city', lang, profile['catalog'])
    result['preparedHeroIds'] = page.evaluate('window.__sceneQA.preparedHeroIds')
    check(not (progress(page) or {}).get('records'), 'fixture started with recorded contract evidence')
    later = page.get_by_role('button', name='Plus tard' if lang == 'fr' else 'Later', exact=True)
    if later.is_visible(): later.click()
    # Initial district preparation is completed before accepting any contract.
    # Every subsequent position and checkpoint comes from ordinary movement.
    page.locator('#qa-unmount').click()
    expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
    page.evaluate('location=>window.__sceneQA.setLocation(location)', {
        'districtId': profile['id'], 'zoneId': profile['id'],
        'player': {'x': 820, 'y': 760, 'facing': 1}})
    page.wait_for_function('id=>window.__sceneQA.saved?.districtId===id', arg=profile['id'], polling=50)
    page.evaluate('window.__sceneQA.remount()')
    page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
    page.evaluate('''()=>{
      document.documentElement.style.setProperty('--game-hud-scale','1.4');
      document.documentElement.style.setProperty('--game-safe-area','32px');
    }''')
    terminal(page)
    result['textScale'] = reading_scale(page, '.mosaic-character-missions', out, name)
    result['terminalLayout'] = page.locator('.mosaic-terminal-drawer').evaluate('''root=>{
      const heading=root.querySelector('h2'), header=root.querySelector('header'), body=root.querySelector('[role="region"]');
      return {titleSize:parseFloat(getComputedStyle(heading).fontSize),
        headerLeft:parseFloat(getComputedStyle(header).paddingLeft),
        bodyLeft:parseFloat(getComputedStyle(body).paddingLeft), scrollFocusable:body.tabIndex===0};
    }''')
    check(result['terminalLayout']['titleSize'] >= 27, 'terminal heading ignored text scale')
    check(result['terminalLayout']['headerLeft'] >= 32 and result['terminalLayout']['bodyLeft'] >= 32,
          'terminal ignored left safe area')
    check(result['terminalLayout']['scrollFocusable'], 'terminal scroll region is not keyboard focusable')
    options = page.locator('[data-city-contract-select] option')
    check(options.evaluate_all('nodes=>nodes.map(node=>node.value)') == [entry[0] for entry in profile['contracts']],
          'district contracts are missing, reordered or mixed with another source universe')
    if profile['catalog'] == 'nexus':
        panel = page.locator('.mosaic-character-missions')
        saved = progress(page)
        panel.locator('[data-city-contract-select]').select_option(FOLLOWUP_IDS[0])
        expect(panel.locator('[data-city-contract-accept]')).to_have_count(0)
        expect(panel.locator('[data-city-contract-approach]')).to_have_count(0)
        page.clock.run_for(400)
        check(progress(page) == saved, 'reading a locked follow-up changed the save')
        result['lockedFollowup'] = {'missionId': FOLLOWUP_IDS[0], 'preserved': True}
    chosen = profile['contracts'] if label == 'desktop' else profile.get('mobile', profile['contracts'])
    for index, entry in enumerate(chosen):
        result['contracts'].append(play_contract(
            page, entry, out, name, profile['id'], profile['universe'],
            remount=index == 0 or entry[0] in NEW_NEXUS_IDS or entry[0] in FOLLOWUP_IDS or profile['catalog'] == 'city-contracts',
            interrupt=index == 0))
    page.locator('[data-city-contract-objective]').scroll_into_view_if_needed()
    if args.require_art:
        page.wait_for_function('''paths=>window.__sceneQA.media.length>0
          && window.__sceneQA.media.every(item=>item.loaded)
          && paths.every(src=>window.__sceneQA.media.some(item=>item.src===src&&item.loaded))''',
            arg=profile['requiredArt'], polling=50, timeout=25000)
    result['media'] = page.evaluate('window.__sceneQA.media')
    page.screenshot(path=str(out / f'{name}-completed.png'))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/mosaic-character-missions')
    parser.add_argument('--require-art', action='store_true')
    parser.add_argument('--district', choices=['nexus', 'halo', 'alien', 'all'], default='nexus')
    parser.add_argument('--lang', choices=['fr', 'en', 'all'], default='all')
    args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        try:
            for district in (DISTRICTS if args.district == 'all' else [args.district]):
                profile = DISTRICTS[district]
                for lang in (['fr', 'en'] if args.lang == 'all' else [args.lang]):
                    for label, viewport in [('desktop', {'width': 1440, 'height': 1000}),
                                            ('portrait', {'width': 390, 'height': 844}),
                                            ('landscape', {'width': 844, 'height': 390})]:
                        name = f'{district}-{lang}-{label}'
                        context = browser.new_context(viewport=viewport, has_touch=True)
                        page = context.new_page()
                        errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                        result = {'name': name, 'districtId': profile['id'], 'universe': profile['universe'],
                                  'catalog': profile['catalog'], 'viewport': viewport, 'status': 'running', 'contracts': []}
                        results.append(result)
                        try:
                            run_case(page, args, profile, lang, label, out, name, result)
                            if district == 'nexus' and label == 'desktop':
                                offer_context = browser.new_context(viewport=viewport, has_touch=True)
                                try:
                                    offer_page = offer_context.new_page()
                                    offer_errors = []
                                    offer_page.on('pageerror', lambda error: offer_errors.append(str(error)))
                                    result['offer'] = resident_offer_journey(offer_page, args, lang, out, name)
                                    check(not offer_errors, f'uncaught offer journey errors: {offer_errors}')
                                finally:
                                    offer_context.close()
                            check(not errors, f'uncaught browser errors: {errors}')
                            result['status'] = 'passed'
                        except Exception as error:
                            result['status'] = 'failed'; result['error'] = str(error)
                            result['media'] = page.evaluate('window.__sceneQA?.media || []')
                            page.screenshot(path=str(out / f'{name}-failure.png'))
                        finally:
                            (out / 'summary.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
                            context.close()
        finally:
            browser.close()
    failures = [item for item in results if item['status'] != 'passed']
    check(not failures, f"{len(failures)} City cases failed: " +
          '; '.join(f"{item['name']}: {item.get('error', item['status'])}" for item in failures))
    print(json.dumps({'cases': len(results), 'contracts': sum(len(item['contracts']) for item in results), 'status': 'passed'}))


if __name__ == '__main__':
    main()
