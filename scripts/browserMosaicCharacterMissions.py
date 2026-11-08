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
from mosaicCargoObservation import (
    CARGO_OBSERVER_SCRIPT, MISSION_LABEL_OBSERVER_SCRIPT,
    verify_cargo_draws, verify_mission_label_frames,
)

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
DELIVERIES = [
    {'id': 'city-mirelle-night-watch-v1', 'parent': FOLLOWUP_IDS[1], 'origins': ['apply', 'hold'],
     'prelude': [NEXUS_CONTRACTS[1]], 'parentEntry': FOLLOWUPS[1]},
    {'id': 'city-quillon-refuge-pump-v1', 'parent': FOLLOWUP_IDS[8], 'origins': ['apply', 'hold'],
     'prelude': [NEXUS_CONTRACTS[8]], 'parentEntry': FOLLOWUPS[8]},
    {'id': 'city-nadir-buried-probe-v1', 'parent': NEXUS_CONTRACTS[9][0], 'origins': ['bounded-return', 'repeat-probe'],
     'prelude': [], 'parentEntry': NEXUS_CONTRACTS[9]},
    {'id': 'city-tessera-chosen-window-v1', 'parent': NEXUS_CONTRACTS[7][0], 'origins': ['parallel-accounts', 'hold-display'],
     'prelude': [], 'parentEntry': NEXUS_CONTRACTS[7]},
    {'id': 'city-anchor-shared-beacon-v1', 'parent': NEXUS_CONTRACTS[0][0], 'origins': ['retain-origin', 'ask-review'],
     'prelude': [], 'parentEntry': NEXUS_CONTRACTS[0]},
    {'id': 'city-bastion-bulwark-relief-v1', 'parent': NEXUS_CONTRACTS[2][0], 'origins': ['name-debt', 'attach-unknowns'],
     'prelude': [], 'parentEntry': NEXUS_CONTRACTS[2]},
    {'id': 'city-nova-present-pulse-v1', 'parent': NEXUS_CONTRACTS[3][0], 'origins': ['mark-uncertainty', 'require-return'],
     'prelude': [], 'parentEntry': NEXUS_CONTRACTS[3]},
    {'id': 'city-sable-night-signs-v1', 'parent': NEXUS_CONTRACTS[4][0], 'origins': ['signed-correction', 'annotated-original'],
     'prelude': [], 'parentEntry': NEXUS_CONTRACTS[4]},
]
DELIVERY_IDS = {story['id'] for story in DELIVERIES}
PREREQUISITES.update({story['id']: story['parent'] for story in DELIVERIES})
NEXUS_ALL = NEXUS_CONTRACTS + FOLLOWUPS + [(story['id'], 'shortcut', 'apply') for story in DELIVERIES]
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


def mission_cargo(page):
    return page.evaluate('structuredClone(window.__sceneQA.state()?.missionCargo ?? null)')


def declared_cargo(page, mission_id, index, district):
    """Read the authored step independently from its receipt and live cargo."""
    return page.evaluate('''async ({missionId,index,districtId})=>{
      const {MOSAIC_CHARACTER_MISSIONS,getMosaicCharacterMissionStep,localizeCityMission}=await import('/src/game/mosaicCharacterMissions.js');
      const source=MOSAIC_CHARACTER_MISSIONS.find(item=>item.id===missionId);
      const mission={...source,districtId,anchorId:`${districtId}-core`};
      const step=getMosaicCharacterMissionStep(window.__sceneQA.characterMissions,mission,index);
      if(!step?.cargo)return null;
      const lang=new URLSearchParams(globalThis.__sceneQaParams||location.search).get('lang')==='en'?'en':'fr';
      return {...step.cargo,label:localizeCityMission(step.cargo.label,lang),missionId,
        heroId:source.heroId,universe:source.universe,districtId,stepId:step.id};
    }''', {'missionId': mission_id, 'index': index, 'districtId': district})


def verify_cargo_transition(definition, before, after, saved):
    if not definition:
        check(after == before, 'a step without a transfer changed the carried object')
        return None
    if definition['action'] == 'take':
        check(before is None, 'a pickup replaced another carried object')
        receipt = saved['records'][definition['missionId']]['operationReceipts'][definition['stepId']]
        expected = {key: definition[key] for key in ['missionId', 'heroId', 'universe', 'districtId', 'id', 'label', 'appearance', 'stepId']}
        expected['sequence'] = receipt['sequence']
        check(after == expected, 'the carried object differs from the physical pickup and its receipt')
    else:
        check(definition['action'] == 'deliver', 'unknown authored cargo action')
        check(before and all(before[key] == definition[key] for key in ['missionId', 'heroId', 'universe', 'districtId', 'id', 'appearance']),
              'delivery did not start with the requested carried object')
        check(after is None, 'delivery left a duplicate object attached to the player')
    return {'declaration': definition, 'before': before, 'after': after}


def install_cargo_observer(page):
    """Observe real Canvas2D label draws; never modify the scene or simulation."""
    page.add_init_script(CARGO_OBSERVER_SCRIPT)
    page.add_init_script(MISSION_LABEL_OBSERVER_SCRIPT)


def save_cargo_draws(page, out, filename):
    """Retain raw matrices and deltas before any assertion can stop the case."""
    draws = page.evaluate('window.__cityCargoDraws || []')
    (out / filename).write_text(json.dumps(draws, indent=2))
    return draws


def save_mission_label_frames(page, out, filename):
    """Write actual painted rectangles, including the last open frame, first."""
    frames = page.evaluate('window.__cityLabelFrames || []')
    (out / filename).write_text(json.dumps(frames, ensure_ascii=False, indent=2))
    return frames


def verify_walk_receipt(definition, after, proof):
    """Match every saved waypoint to a real moving frame, in authored order."""
    expected = definition['walk']['points']
    saved = after['records'][definition['missionId']]
    receipt = saved.get('walkReceipts', {}).get(definition['stepId'])
    check(receipt and receipt.get('version') == 1, 'the walked route has no local receipt')
    for field in ['missionId', 'stepId', 'districtId', 'universe', 'originChoiceId', 'originStoryRevision', 'branchChoiceId']:
        check(receipt.get(field) == definition.get(field), f'walk receipt lost its authored identity: {field}')
    points = receipt.get('points', [])
    check(len(points) == len(expected), 'a route skipped one or more authored places')
    samples = [proof['clickAfter'], *proof['samples']]
    previous_match = -1
    matches = []
    for actual, target in zip(points, expected):
        check(all(actual.get(key) == target[key] for key in ['id', 'x', 'y']), 'route points were reached in another order')
        check(0 < actual['elapsedMs'] <= 50 and 0 < actual['distance'] <= actual['speed'] * 60 * actual['elapsedMs'] / 1000 + 1e-6,
              'a checkpoint was earned without a bounded active movement')
        check(((actual['to']['x'] - target['x']) ** 2 + (actual['to']['y'] - target['y']) ** 2) ** 0.5 <= 64,
              'a checkpoint was received before approaching its place')
        found = None
        for index in range(max(1, previous_match + 1), len(samples)):
            prior, sample = samples[index - 1], samples[index]
            if (all(abs(sample[key] - actual['to'][key]) <= 1e-6 for key in ['x', 'y'])
                    and all(abs(prior[key] - actual['from'][key]) <= 1e-6 for key in ['x', 'y'])
                    and abs(sample['speed'] - actual['speed']) <= 1e-6
                    and abs((sample['t'] - prior['t']) * 1000 / 60 - actual['elapsedMs']) <= 1e-6):
                found = index
                break
        check(found is not None, f'checkpoint {target["id"]} has no matching native movement frame')
        previous_match = found
        matches.append({'pointId': target['id'], 'sampleIndex': found, 'receipt': actual})
    operation = saved.get('operationReceipts', {}).get(definition['stepId'], {})
    check(operation.get('walkPointIds') == [target['id'] for target in expected], 'final operation lost its actual walked places')
    return {'orderedPlaces': len(matches), 'matchedNativeFrames': matches, 'receipt': receipt}


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
    walking = definition.get('walk')
    if walking:
        check(observed_target and all(abs(observed_target[key] - walking['points'][0][key]) <= 1e-6 for key in ['x', 'y']),
              'the first live reconnaissance marker differs from the authored departure')
        check(all(abs(receipt[key] - walking['points'][-1][key]) <= 1e-6 for key in ['x', 'y']),
              'the final interaction did not occur at the last walked marker')
    elif ('x' in receipt or 'y' in receipt) and definition['sourceType'] != 'exhibit':
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
        expected_pending = definition['firstPointLabel'] if walking and key == 'propName' else definition[key]
        check(pending[key] == expected_pending and completed[key] == definition[key], f'operation object differs from its declaration: {key}')
    if walking:
        check(all(abs(pending[key] - walking['points'][0][key]) <= 1e-6 for key in ['x', 'y']),
              'the first presented route point differs from its actual departure')
    else:
        check(all(abs(pending[key] - completed[key]) <= 1e-6 for key in ['x', 'y']), 'operation completion moved its object')
    if definition['sourceType'] == 'marker':
        check(all(abs(completed[key] - definition[key]) <= 1e-6 for key in ['x', 'y']), 'branch operation is at the wrong marker position')
    check(completed['sequence'] == receipt['sequence'], 'object was restored from another operation receipt')
    if definition['sourceType'] == 'exhibit' and 'x' in receipt:
        check(all(abs(receipt[key] - completed[key]) <= 1e-6 for key in ['x', 'y']),
              'display operation receipt does not match its actual interaction slot')
    check(completed['statusLabel'] and completed['statusLabel'] != pending['statusLabel'], 'completed object kept its pending action label')
    return {'definition': definition, 'receipt': receipt, 'objectBefore': pending, 'objectAfter': completed}


def terminal(page, section='journal'):
    conversation = page.locator('.mosaic-resident-dialogue')
    if conversation.count():
        conversation.locator('[data-dialogue-journal]').click()
        expect(conversation).to_have_count(0)
    if not page.get_by_role('dialog').count():
        page.get_by_role('button', name='TERMINAL · JOURNAL', exact=True).click()
    tab = page.locator(f'[data-city-terminal-tab="{section}"]')
    if tab.get_attribute('aria-selected') != 'true':
        tab.click()
    expect(page.locator(f'[data-city-terminal-panel="{section}"]')).to_be_visible()
    expect(page.locator('[data-city-terminal-panel]:visible')).to_have_count(1)
    if section == 'journal':
        expect(page.locator('.mosaic-character-missions')).to_be_visible()


def inspect_terminal_navigation(page, out, name):
    """Read the actual four City sections without advancing the paused scene."""
    frozen = {'scene': page.evaluate('window.__sceneQA.snapshot()'), 'progress': progress(page),
              'cargo': mission_cargo(page), 'objects': mission_objects(page)}
    selected = page.locator('[data-city-contract-select]').input_value()
    visits = []
    page.locator('[data-city-terminal-tab="journal"]').focus()
    for section in ['district', 'transmissions', 'guide', 'journal']:
        page.keyboard.press('ArrowRight')
        tab = page.locator(f'[data-city-terminal-tab="{section}"]')
        expect(tab).to_be_focused()
        expect(tab).to_have_attribute('aria-selected', 'true')
        expect(page.locator('[data-city-terminal-panel]:visible')).to_have_count(1)
        panel = page.locator(f'[data-city-terminal-panel="{section}"]')
        expect(panel).to_be_visible()
        page.keyboard.press('Tab')
        expect(panel).to_be_focused()
        page.keyboard.press('Shift+Tab')
        expect(tab).to_be_focused()
        layout = page.locator('.mosaic-pocket-tabs').evaluate('''node => ({
          width:node.clientWidth, scrollWidth:node.scrollWidth,
          tabs:[...node.querySelectorAll('button')].map(button=>{
            const box=button.getBoundingClientRect();return {id:button.dataset.cityTerminalTab,
              left:box.left,right:box.right,width:box.width,height:box.height,
              font:parseFloat(getComputedStyle(button).fontSize),clientWidth:button.clientWidth,scrollWidth:button.scrollWidth};})
        })''')
        check(layout['scrollWidth'] <= layout['width'] + 1, 'terminal navigation overflowed horizontally')
        for control in layout['tabs']:
            check(control['width'] >= 43.99 and control['height'] >= 43.99, 'terminal tab is smaller than 44 px')
            check(control['left'] >= 31 and control['right'] <= page.viewport_size['width'] - 31,
                  'terminal tab left the configured safe area')
            check(control['font'] >= 21, 'terminal tab ignored 150% reading size')
            check(control['scrollWidth'] <= control['clientWidth'] + 1, 'terminal tab label was clipped')
        if section == 'district':
            expect(panel.locator('.mosaic-resident-directory')).to_be_visible()
        elif section == 'transmissions':
            expect(panel.locator('.mosaic-rpg-log')).to_be_visible()
        elif section == 'guide':
            expect(panel.locator('.mosaic-terminal-guide')).to_be_visible()
        page.screenshot(path=str(out / f'{name}-terminal-{section}.png'))
        visits.append({'section': section, 'layout': layout, 'keyboardFocus': True})
    check(page.locator('[data-city-contract-select]').input_value() == selected, 'changing sections replaced the read adventure')
    page.keyboard.press('End')
    expect(page.locator('[data-city-terminal-tab="guide"]')).to_be_focused()
    page.keyboard.press('Home')
    expect(page.locator('[data-city-terminal-tab="journal"]')).to_be_focused()
    actual = {'scene': page.evaluate('window.__sceneQA.snapshot()'), 'progress': progress(page),
              'cargo': mission_cargo(page), 'objects': mission_objects(page)}
    check(actual == frozen, 'terminal section navigation changed the City or its adventure')
    return {'sections': visits, 'selectedMissionPreserved': selected, 'homeEnd': True, 'statePreserved': True,
            'scope': 'Actual City menus, native keyboard, existing safe area and 150% text. No navigation click accepts or progresses an adventure.'}


def explicit_help_while_carrying(page, saved, cargo):
    """Reopen existing help controls without moving or advancing the adventure."""
    fr = page.evaluate("new URLSearchParams(globalThis.__sceneQaParams||location.search).get('lang')!=='en'")
    player_before = page.evaluate('window.__sceneQA.snapshot().player')
    objects_before = mission_objects(page)
    hud_help = page.locator('.mosaic-world-hud .mosaic-city-guide')

    def adventure_preserved(action):
        check(progress(page) == saved and mission_cargo(page) == cargo,
              f'{action} changed the mission or its carried object')
        check(mission_objects(page) == objects_before, f'{action} changed operation objects')
        check(page.evaluate('window.__sceneQA.snapshot().player') == player_before,
              f'{action} moved the player')

    expect(hud_help).to_have_count(0)
    terminal(page, 'guide')
    page.get_by_role('button', name='Revoir l accueil' if fr else 'Replay welcome', exact=True).click()
    welcome = page.locator('.mosaic-world-hud .mosaic-city-guide:not(.mosaic-city-guide--collapsible)')
    expect(welcome).to_be_visible()
    expect(welcome.locator('strong')).to_have_text('Une ville qui se souvient' if fr else 'A city that remembers')
    expect(page.get_by_role('dialog')).to_have_count(0)
    adventure_preserved('explicit welcome replay')
    welcome.get_by_role('button', name='Plus tard' if fr else 'Later', exact=True).click()
    expect(hud_help).to_have_count(0)
    adventure_preserved('deferring unread help')

    terminal(page, 'guide')
    guide_control = page.locator('.mosaic-terminal-guide > button')
    guide_resumed = False
    if guide_control.count():
        expect(guide_control).to_have_text('REPRENDRE LE GUIDE' if fr else 'RESUME GUIDE')
        guide_control.click()
        expect(page.locator('.mosaic-world-hud .mosaic-city-guide--collapsible')).to_be_visible()
        expect(welcome).to_have_count(0)
        expect(page.get_by_role('dialog')).to_have_count(0)
        adventure_preserved('explicit guide resume')
        terminal(page, 'guide')
        expect(guide_control).to_have_text('PAUSE GUIDE')
        guide_control.click()
        expect(hud_help).to_have_count(0)
        adventure_preserved('explicit guide pause')
        guide_resumed = True
    else:
        expect(page.locator('.mosaic-terminal-guide > strong')).to_have_text(
            'Premiers reperes acquis' if fr else 'First bearings acquired')
    return {'automaticHelpAbsent': True, 'welcomeReplayAvailable': True, 'laterDefersBothPanels': True,
            'guideResumedWhenAvailable': guide_resumed, 'guideExplicitlyPaused': guide_resumed,
            'missionCargoObjectsAndPositionPreserved': True, 'player': player_before, 'cargo': cargo,
            'scope': 'Existing welcome/guide buttons only; no simulation time added. '
                     'An explicit guide pause may change its tutorial status; mission progress and cargo remain unchanged.'}


def switch_while_carrying(page, mission_id, district, cargo):
    """Pause and resume via actual journal buttons; do not advance either task."""
    other_id = page.evaluate('''async ({missionId,districtId})=>{
      const {MOSAIC_CHARACTER_MISSIONS,getMosaicCharacterMissionObjective}=await import('/src/game/mosaicCharacterMissions.js');
      const source=MOSAIC_CHARACTER_MISSIONS.find(item=>item.id===missionId);
      return MOSAIC_CHARACTER_MISSIONS.filter(item=>item.universe===source.universe&&item.id!==missionId)
        .map(item=>({mission:{...item,districtId,anchorId:`${districtId}-core`},id:item.id}))
        .find(({mission})=>['available','paused'].includes(getMosaicCharacterMissionObjective(window.__sceneQA.characterMissions,mission).status))?.id||null;
    }''', {'missionId': mission_id, 'districtId': district})
    if not other_id:
        return None
    panel = page.locator('.mosaic-character-missions')
    before = progress(page)
    panel.locator('select').select_option(other_id)
    panel.locator('[data-city-contract-accept]').click()
    page.wait_for_function('id=>window.__sceneQA.characterMissions.activeId===id', arg=other_id, polling=50)
    paused = progress(page)
    check(paused['records'][mission_id] == before['records'][mission_id] and mission_cargo(page) == cargo,
          'tracking another request changed the paused delivery or its carried object')
    other_record = paused['records'][other_id]
    if other_id in before['records']:
        check(other_record == before['records'][other_id], 'tracking the other request advanced it')
    else:
        check(not other_record['completedStepIds'] and not other_record.get('operationReceipts'),
              'tracking another request fabricated a meeting or a physical intervention')
    panel.locator('select').select_option(mission_id)
    panel.locator('[data-city-contract-accept]').click()
    page.wait_for_function('id=>window.__sceneQA.characterMissions.activeId===id', arg=mission_id, polling=50)
    resumed = progress(page)
    check(resumed['records'][mission_id] == before['records'][mission_id]
          and resumed['records'][other_id] == other_record and mission_cargo(page) == cargo,
          'resuming the delivery changed an object or either request')
    return {'otherMissionId': other_id, 'cargo': cargo, 'preservedWhilePaused': True,
            'preservedOnResume': True, 'noObjectiveAdvanced': True}


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
    is_delivery = mission_id in DELIVERY_IDS
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
            'walks': [], 'operations': [], 'cargoTransfers': [], 'choice': None, 'remount': None}
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
        cargo_before = mission_cargo(page)
        cargo_definition = declared_cargo(page, mission_id, index, district) if is_delivery else None
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
            page.evaluate('window.__cityCargoDraws=[];window.__cityLabelFrames=[]')
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
            walk = {'index': index, 'motion': motion}
            walk['operationLabelFile'] = f'{case_name}-{mission_id}-step-{index}-operation-labels.json'
            walk['operationLabels'] = verify_mission_label_frames(
                save_mission_label_frames(page, out, walk['operationLabelFile']),
                require_labels=bool(operation_before), require_cargo=bool(cargo_before))
            if cargo_before:
                cargo_draws = save_cargo_draws(page, out, f'{case_name}-{mission_id}-step-{index}-carried-draws.json')
                walk['carriedObject'] = verify_cargo_draws(cargo_draws, cargo_before,
                    require_movement=not motion['startedWithinTargetRange'])
            case['walks'].append(walk)
            if operation_before:
                completed_operation = verify_operation(operation_before, before, progress(page), objects_before,
                                                       mission_objects(page), proximity_before)
                if operation_before.get('walk'):
                    completed_operation['reconnaissance'] = verify_walk_receipt(operation_before, progress(page), proof)
                    page.screenshot(path=str(out / f'{case_name}-{mission_id}-walked-route.png'))
                case['operations'].append(completed_operation)
                if capture_operation:
                    page.screenshot(path=str(out / case['operationCapture']['after']))
            else:
                check(before['records'][mission_id].get('operationReceipts', {}) ==
                      progress(page)['records'][mission_id].get('operationReceipts', {}),
                      'a conversation or plain arrival fabricated an operation receipt')
            if is_delivery and step_id == 'report':
                check(expected_target['type'] == 'npc' and expected_target['action'] == 'talk',
                      'the local story ended at a terminal instead of its resident')
                conversation = page.locator('[data-city-conversation]')
                expect(conversation).to_have_count(1)
                check(conversation.get_attribute('data-city-conversation') == expected_target['id'],
                      'a different resident answered the final meeting')
                expect(conversation.locator('[data-dialogue-quest]')).to_have_attribute('data-dialogue-quest', mission_id)
                final_words = page.evaluate('''async missionId=>{
                  const {MOSAIC_CHARACTER_MISSIONS,localizeCityMission}=await import('/src/game/mosaicCharacterMissions.js');
                  const lang=new URLSearchParams(globalThis.__sceneQaParams||location.search).get('lang')==='en'?'en':'fr';
                  return localizeCityMission(MOSAIC_CHARACTER_MISSIONS.find(item=>item.id===missionId).steps.find(step=>step.id==='report').dialogue,lang);
                }''', mission_id)
                expect(conversation.locator('[data-dialogue-quest] blockquote p')).to_have_text(final_words)
                expect(conversation.locator('[data-dialogue-next]')).to_have_count(0)
                page.screenshot(path=str(out / f'{case_name}-{mission_id}-resident-ending.png'))
                case['residentEnding'] = {'residentId': expected_target['id'], 'words': final_words, 'nativeMeeting': True}
        cargo_after = mission_cargo(page)
        transfer = verify_cargo_transition(cargo_definition, cargo_before, cargo_after, progress(page))
        if transfer:
            if cargo_after:
                page.evaluate('window.__cityLabelFrames=[]')
                page.clock.run_for(32)
                check(mission_cargo(page) == cargo_after, 'drawing the carried object changed its identity')
                transfer['drawFile'] = f'{case_name}-{mission_id}-step-{index}-pickup-draws.json'
                transfer['draw'] = verify_cargo_draws(save_cargo_draws(page, out, transfer['drawFile']), cargo_after)
                transfer['labelLayoutFile'] = f'{case_name}-{mission_id}-step-{index}-pickup-labels.json'
                transfer['labelLayout'] = verify_mission_label_frames(
                    save_mission_label_frames(page, out, transfer['labelLayoutFile']),
                    require_labels=True, require_cargo=True)
                transfer['capture'] = f'{case_name}-{mission_id}-{cargo_after["id"]}-taken.png'
                page.screenshot(path=str(out / transfer['capture']))
            case['cargoTransfers'].append(transfer)
        saved = progress(page)
        terminal(page)
        if is_delivery and cargo_after and not case.get('missionSwitch'):
            case['missionSwitch'] = switch_while_carrying(page, mission_id, district, cargo_after)
            saved = progress(page)
        frozen = page.evaluate('window.__sceneQA.snapshot()')
        page.clock.run_for(500)
        check(progress(page) == saved, 'reading the contract advanced an objective')
        check(page.evaluate('window.__sceneQA.snapshot().player') == frozen['player'], 'City moved under the terminal')
        check(mission_cargo(page) == cargo_after, 'reading the journal changed the carried object')
        if remount and completed_operation and case['remount'] is None and (not is_delivery or cargo_after):
            page.keyboard.press('Escape')
            expect(page.get_by_role('dialog')).to_have_count(0)
            before_unmount = page.evaluate('({position:window.__sceneQA.snapshot().player,objects:window.__sceneQA.snapshot().missionObjects,cargo:structuredClone(window.__sceneQA.state().missionCargo??null),saveCount:window.__sceneQA.saves.length})')
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
            check(mission_cargo(page) == before_unmount['cargo'], 'remount lost or duplicated the carried object')
            cargo_capture = None
            cargo_draw_file = None
            label_layout_file = None
            label_layout = None
            help_resume = None
            if before_unmount['cargo']:
                page.evaluate('window.__cityCargoDraws=[];window.__cityLabelFrames=[]')
                page.clock.run_for(32)
                check(progress(page) == saved and mission_cargo(page) == before_unmount['cargo'],
                      'rendering the restored cargo changed its saved transfer')
                cargo_capture = f'{case_name}-{mission_id}-{before_unmount["cargo"]["id"]}-remounted.png'
                page.screenshot(path=str(out / cargo_capture))
                expect(page.locator('.mosaic-world-hud .mosaic-city-guide')).to_have_count(0)
                cargo_draw_file = f'{case_name}-{mission_id}-step-{index}-remount-draws.json'
                verify_cargo_draws(save_cargo_draws(page, out, cargo_draw_file), before_unmount['cargo'])
                label_layout_file = f'{case_name}-{mission_id}-step-{index}-remount-labels.json'
                label_layout = verify_mission_label_frames(
                    save_mission_label_frames(page, out, label_layout_file),
                    require_labels=True, require_cargo=True, require_player_in_view=True)
                help_resume = explicit_help_while_carrying(page, saved, before_unmount['cargo'])
            terminal(page)
            panel.locator('select').select_option(mission_id)
            case['remount'] = {'completedStepIds': saved['records'][mission_id]['completedStepIds'], 'preserved': True,
                               'operationReceipt': completed_operation['receipt'], 'objects': before_unmount['objects'],
                               'operationObjectsPreserved': True, 'cargo': before_unmount['cargo'],
                               'carriedObjectPreserved': bool(before_unmount['cargo']), 'cargoCapture': cargo_capture,
                               'cargoDrawFile': cargo_draw_file, 'labelLayoutFile': label_layout_file,
                               'labelLayout': label_layout, 'help': help_resume}
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
    if is_delivery:
        check(case.get('residentEnding'), 'delivery story did not return to its resident')
        check(mission_cargo(page) is None, 'completed delivery retained an undelivered object')
        expected_transfers = 4 if mission_id in ('city-quillon-refuge-pump-v1', 'city-bastion-bulwark-relief-v1') else 2
        check(len(case['cargoTransfers']) == expected_transfers, 'delivery skipped a physical pickup or handover')
        check(any(walk.get('carriedObject', {}).get('travelledWorldUnits', 0) > 0 for walk in case['walks']),
              'delivery completed without observing a carried object during movement')
        if remount:
            check(case['remount']['cargo'] and case['remount']['cargoCapture'], 'delivery was not restored while carrying its object')
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
        record['atriumWalk'] = {'before': departure, 'waypoints': []}
        # The guide stands on the straight eastward line. Click visible ground
        # so the ordinary pathfinder walks around her body. The camera and live
        # obstacles are read only; all movement comes from native pointer input.
        for leg in range(6):
            view = canvas.evaluate('''node=>{const r=node.getBoundingClientRect(),s=window.__sceneQA.state();
              const project=p=>({x:(p.x-s.camera.x)*r.width/node.width,y:(p.y-s.camera.y)*r.height/node.height});
              const inside=p=>p.x>0&&p.x<r.width&&p.y>0&&p.y<r.height;
              const portal=project({x:1420,y:520});
              const x=Math.min(1320,s.camera.x+node.width-80);
              const ground=[520,600,440,680,360].map(y=>({x,y})).find(p=>inside(project(p))
                &&p.x>s.player.x&&(s.npcs||[]).every(n=>Math.hypot(n.x-p.x,n.y-p.y)>46)
                &&(s.obstacles||[]).every(o=>p.x<o.x-16||p.x>o.x+o.w+16||p.y<o.y-16||p.y>o.y+o.h+16));
              return {portalVisible:inside(portal),ground,screenPoint:ground&&project(ground),
                before:window.__sceneQA.snapshot()};}''')
            if view['portalVisible']:
                break
            check(view.get('ground'), 'no visible ground waypoint toward the east Atrium portal')
            waypoint = {'target': view['ground'], 'screenPoint': view['screenPoint'], 'before': view['before']}
            record['atriumWalk']['waypoints'].append(waypoint)
            begin_walk_proof(canvas)
            canvas.click(position=view['screenPoint'])
            try:
                check(page.evaluate('window.__sceneQA.state().pendingInteraction') is None,
                      'ground waypoint selected an interaction instead of ordinary movement')
                for _ in range(160):
                    page.clock.run_for(250)
                    if page.evaluate('window.__sceneQA.snapshot().destination') is None:
                        break
                waypoint['after'] = page.evaluate('window.__sceneQA.snapshot()')
                check(waypoint['after']['destination'] is None
                      and waypoint['after']['player']['x'] > waypoint['before']['player']['x']
                      and not any(waypoint['after']['keys'].values()),
                      'native ground waypoint did not finish its eastward walk')
                check(not (progress(page) or {}).get('records'), 'walking across the Atrium accepted a quest')
            finally:
                ground_proof = page.evaluate('window.__stopReconnaissanceMotion()')
                ground_proof['groundTarget'] = view['ground']
                (out / f'{name}-offer-atrium-ground-{leg}.json').write_text(json.dumps(ground_proof, indent=2))
            waypoint['motion'] = validate_mosaic_motion(ground_proof)
        record['atriumWalk']['after'] = page.evaluate('window.__sceneQA.snapshot()')
        # The east Atrium portal is authored at (1420, 520). Convert that real
        # world point with the canvas's current camera and scale; input remains
        # a native click, followed by the engine's own walk and portal transfer.
        point = canvas.evaluate('''node=>{const r=node.getBoundingClientRect(),s=window.__sceneQA.state();
          return {x:(1420-s.camera.x)*r.width/node.width,y:(520-s.camera.y)*r.height/node.height,
            width:r.width,height:r.height,before:window.__sceneQA.snapshot()};}''')
        check(0 < point['x'] < point['width'] and 0 < point['y'] < point['height'], 'east Atrium portal is outside the native canvas view')
        canvas.click(position={'x': point['x'], 'y': point['y']})
        check(page.evaluate('window.__sceneQA.state().pendingInteraction') == {'type': 'portal', 'id': 'to-threads'},
              'native portal click selected a different Atrium destination')
        for _ in range(160):
            page.clock.run_for(250)
            if page.evaluate('window.__sceneQA.saved?.districtId') == 'threads': break
        check(page.evaluate('window.__sceneQA.saved?.districtId') == 'threads', 'native Atrium portal walk did not reach the Gallery')
        record['atriumPortal'] = {'screenPoint': {key: point[key] for key in ['x', 'y']}, 'before': point['before'],
                                 'after': page.evaluate('window.__sceneQA.snapshot()')}
        terminal(page, 'district')
        destinations = page.get_by_role('region', name='Catalogue des quartiers disponibles' if lang == 'fr' else 'Available district catalog', exact=True)
        destination = destinations.get_by_role('button', name='Nexus de Convergence', exact=True)
        destination.click()
        for _ in range(160):
            page.clock.run_for(250)
            if page.evaluate('window.__sceneQA.saved?.districtId') == DISTRICT: break
        check(page.evaluate('window.__sceneQA.saved?.districtId') == DISTRICT, 'native Gallery portal walk did not enter the Nexus district')
        check(not (progress(page) or {}).get('records'), 'portal travel accepted a quest')
        terminal(page, 'district')
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
        expect(page.locator('[data-resident-conversation-modal]')).to_be_visible()
        expect(page.get_by_role('dialog')).to_have_count(1)
        expect(page.locator('.mosaic-character-missions, .mosaic-resident-directory, .mosaic-evidence-ledger')).to_have_count(0)
        expect(conversation.locator('h3')).to_be_focused()
        expect(conversation.locator('[data-dialogue-next]')).to_have_count(0)
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
        # Reading the offered adventure must not land on the unrelated last
        # transmission or select the first catalogue entry (the Anchor).
        conversation.locator('[data-dialogue-journal]').focus(); page.keyboard.press('Enter')
        expect(conversation).to_have_count(0)
        expect(page.locator('[data-city-terminal-tab="journal"]')).to_have_attribute('aria-selected', 'true')
        expect(page.locator('[data-city-contract-reader]')).to_have_attribute('data-city-contract-reader', record['missionId'])
        page.clock.run_for(32)
        expect(page.locator('.mosaic-contract-reader > h4')).to_be_focused()
        check(progress(page) == before and page.evaluate('window.__sceneQA.snapshot()') == frozen,
              'opening the offered page accepted its request or resumed the City')
        page.screenshot(path=str(out / f'{name}-offer-journal.png'))
        page.keyboard.press('Escape'); expect(canvas).to_be_focused()
        page.keyboard.press('e')
        expect(conversation).to_be_visible()
        expect(offer).to_be_visible()
        expect(conversation.locator('h3')).to_be_focused()
        check(progress(page) == before, 'returning to the resident accepted the unread request')
        record['offeredJournalPageAndFocus'] = True
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
                       'acceptanceFocus': True, 'dedicatedConversation': True, 'receipt': saved['records'][record['missionId']]})
        conversation.locator('[data-dialogue-return]').click()
        expect(page.get_by_role('dialog')).to_have_count(0)
        expect(canvas).to_be_focused()
        page.clock.run_for(250)
        resumed = page.evaluate('window.__sceneQA.snapshot()')
        check(resumed['t'] > frozen['t'] and not any(resumed['keys'].values()),
              'ending the conversation did not resume the City with cleared controls')
        check(all(resumed['player'][key] == frozen['player'][key] for key in ['x', 'y', 'speed', 'facing'])
              and progress(page) == saved, 'closing the conversation resumed an old route or interaction')
        record['canvasFocusAndClearedInput'] = True
        return record
    except Exception as error:
        record.update({'status': 'failed', 'error': str(error)})
        page.screenshot(path=str(out / f'{name}-offer-failure.png'))
        raise
    finally:
        (out / f'{name}-offer.json').write_text(json.dumps(record, ensure_ascii=False, indent=2))


def run_case(page, args, profile, lang, label, out, name, result, entries=None):
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
    if profile['catalog'] == 'nexus' and entries is None:
        result['terminalNavigation'] = inspect_terminal_navigation(page, out, name)
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
    chosen = entries if entries is not None else profile['contracts'] if label == 'desktop' else profile.get('mobile', profile['contracts'])
    for index, entry in enumerate(chosen):
        result['contracts'].append(play_contract(
            page, entry, out, name, profile['id'], profile['universe'],
            remount=index == 0 or entry[0] in NEW_NEXUS_IDS or entry[0] in FOLLOWUP_IDS or entry[0] in DELIVERY_IDS or profile['catalog'] == 'city-contracts',
            interrupt=entries is None and index == 0))
    page.locator('[data-city-contract-objective]').scroll_into_view_if_needed()
    if args.require_art:
        page.wait_for_function('''paths=>window.__sceneQA.media.length>0
          && window.__sceneQA.media.every(item=>item.loaded)
          && paths.every(src=>window.__sceneQA.media.some(item=>item.src===src&&item.loaded))''',
            arg=profile['requiredArt'], polling=50, timeout=25000)
    result['media'] = page.evaluate('window.__sceneQA.media')
    page.screenshot(path=str(out / f'{name}-completed.png'))


def run_delivery_branches(browser, args, lang, out, results):
    """Play both inherited endings and both present choices from fresh saves."""
    profile = DISTRICTS['nexus']
    viewports = [
        ('desktop', {'width': 1440, 'height': 1000}),
        ('portrait', {'width': 390, 'height': 844}),
        ('landscape', {'width': 844, 'height': 390}),
        ('desktop', {'width': 1440, 'height': 1000}),
    ]
    for story in DELIVERIES:
        if args.delivery_story and story['id'] != args.delivery_story:
            continue
        for origin_index, origin in enumerate(story['origins']):
            for choice_index, choice in enumerate(['apply', 'hold']):
                label, viewport = viewports[origin_index * 2 + choice_index]
                name = f'nexus-{lang}-{story["id"]}-{origin}-{choice}-{label}'
                parent_entry = (story['parent'], story['parentEntry'][1], origin)
                entries = [*story['prelude'], parent_entry, (story['id'], 'shortcut', choice)]
                context = browser.new_context(viewport=viewport, has_touch=True)
                page = context.new_page()
                install_cargo_observer(page)
                errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                result = {'name': name, 'districtId': profile['id'], 'universe': profile['universe'],
                          'catalog': profile['catalog'], 'viewport': viewport, 'status': 'running', 'contracts': [],
                          'deliveryBranch': {'missionId': story['id'], 'parentId': story['parent'], 'origin': origin, 'choice': choice},
                          'scope': 'Prepared ownership and initial district only. Every prerequisite, carried object and ending is played through native controls.'}
                results.append(result)
                try:
                    run_case(page, args, profile, lang, label, out, name, result, entries=entries)
                    delivery = result['contracts'][-1]
                    check(delivery['missionId'] == story['id'] and delivery['origin']['choiceId'] == origin
                          and delivery['choice']['recorded'] == choice, 'native delivery used another origin or present choice')
                    check(delivery.get('missionSwitch'), 'delivery branch did not verify cargo across a real mission switch')
                    check(not errors, f'uncaught delivery branch errors: {errors}')
                    result['status'] = 'passed'
                except Exception as error:
                    result['status'] = 'failed'; result['error'] = str(error)
                    result['cargoFailureDraws'] = f'{name}-cargo-failure-draws.json'
                    save_cargo_draws(page, out, result['cargoFailureDraws'])
                    result['operationLabelFailureFrames'] = f'{name}-operation-label-failure-frames.json'
                    save_mission_label_frames(page, out, result['operationLabelFailureFrames'])
                    result['media'] = page.evaluate('window.__sceneQA?.media || []')
                    page.screenshot(path=str(out / f'{name}-failure.png'))
                finally:
                    (out / 'summary.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
                    context.close()


def parse_args(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/mosaic-character-missions')
    parser.add_argument('--require-art', action='store_true')
    parser.add_argument('--district', choices=['nexus', 'halo', 'alien', 'all'], default='nexus')
    parser.add_argument('--lang', choices=['fr', 'en', 'all'], default='all')
    parser.add_argument('--suite', choices=['all', 'main', 'deliveries'], default='all',
                        help='Run all existing cases, the main viewport journeys, or the delivery branch matrix.')
    parser.add_argument('--delivery-story', choices=sorted(DELIVERY_IDS),
                        help='Limit delivery branches to one story; main journeys remain unchanged.')
    args = parser.parse_args(argv)
    if args.delivery_story and args.suite == 'main':
        parser.error('--delivery-story requires --suite all or deliveries')
    if (args.suite == 'deliveries' or args.delivery_story) and args.district not in ('nexus', 'all'):
        parser.error('delivery branches require --district nexus or all')
    return args


def main():
    args = parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        try:
            for district in (DISTRICTS if args.district == 'all' else [args.district]):
                profile = DISTRICTS[district]
                for lang in (['fr', 'en'] if args.lang == 'all' else [args.lang]):
                    main_viewports = [] if args.suite == 'deliveries' else [
                        ('desktop', {'width': 1440, 'height': 1000}),
                        ('portrait', {'width': 390, 'height': 844}),
                        ('landscape', {'width': 844, 'height': 390})]
                    for label, viewport in main_viewports:
                        name = f'{district}-{lang}-{label}'
                        context = browser.new_context(viewport=viewport, has_touch=True)
                        page = context.new_page()
                        install_cargo_observer(page)
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
                            result['cargoFailureDraws'] = f'{name}-cargo-failure-draws.json'
                            save_cargo_draws(page, out, result['cargoFailureDraws'])
                            result['operationLabelFailureFrames'] = f'{name}-operation-label-failure-frames.json'
                            save_mission_label_frames(page, out, result['operationLabelFailureFrames'])
                            result['media'] = page.evaluate('window.__sceneQA?.media || []')
                            page.screenshot(path=str(out / f'{name}-failure.png'))
                        finally:
                            (out / 'summary.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
                            context.close()
                    if district == 'nexus' and args.suite != 'main':
                        run_delivery_branches(browser, args, lang, out, results)
        finally:
            browser.close()
    failures = [item for item in results if item['status'] != 'passed']
    check(not failures, f"{len(failures)} City cases failed: " +
          '; '.join(f"{item['name']}: {item.get('error', item['status'])}" for item in failures))
    print(json.dumps({'cases': len(results), 'contracts': sum(len(item['contracts']) for item in results),
                      'primaryContracts': sum(len(item['contracts']) for item in results if not item.get('deliveryBranch')),
                      'deliveryCombinations': sum(bool(item.get('deliveryBranch')) for item in results), 'status': 'passed'}))


if __name__ == '__main__':
    main()
