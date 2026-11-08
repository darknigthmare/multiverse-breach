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


def terminal(page):
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
            'walks': [], 'choice': None, 'remount': None}
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
            expected_target = ({'type': 'zone', 'id': f'{district}-core', 'action': 'anchor',
                                'universe': universe, 'range': 72} if step_id == 'report'
                               else {'type': 'zone', 'id': f'{mission_id}::{step_id}', 'action': 'character-mission',
                                     'universe': universe, 'range': 72}
                               if step_id and not step_id.startswith(('meet-', 'inspect-')) else None)
            proximity_before = page.evaluate('(id)=>window.__sceneQA.cityZone(id)', arg=expected_target['id']) if expected_target else None
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
                proof['sceneAfter'] = page.evaluate('''()=>{const s=window.__sceneQA.state();return {
                  snapshot:window.__sceneQA.snapshot(),pendingInteraction:s.pendingInteraction,
                  destinationRoute:s.destinationRoute,obstacles:s.obstacles};}''')
                (out / f'{case_name}-{mission_id}-step-{index}.json').write_text(json.dumps(proof, indent=2))
            if proof.get('clickBefore') and proof.get('clickAfter'):
                check(proof['clickBefore']['x'] == proof['clickAfter']['x'] and
                      proof['clickBefore']['y'] == proof['clickAfter']['y'], 'approach teleported on click')
            motion = validate_mosaic_motion(proof, nearby_target=expected_target)
            case['walks'].append({'index': index, 'motion': motion})
        saved = progress(page)
        terminal(page)
        frozen = page.evaluate('window.__sceneQA.snapshot()')
        page.clock.run_for(500)
        check(progress(page) == saved, 'reading the contract advanced an objective')
        check(page.evaluate('window.__sceneQA.snapshot().player') == frozen['player'], 'City moved under the terminal')
        if remount and index == 0:
            page.keyboard.press('Escape')
            expect(page.get_by_role('dialog')).to_have_count(0)
            before_unmount = page.evaluate('({position:window.__sceneQA.snapshot().player,saveCount:window.__sceneQA.saves.length})')
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
            terminal(page)
            panel.locator('select').select_option(mission_id)
            case['remount'] = {'completedStepIds': saved['records'][mission_id]['completedStepIds'], 'preserved': True}
    terminal(page)
    expect(panel.locator('[data-city-contract-objective]')).to_have_attribute('data-contract-id', mission_id)
    expect(panel.locator('[data-city-contract-accept]')).to_have_count(0)
    expect(panel.locator('[data-city-contract-approach]')).to_have_count(0)
    expect(panel.locator('[data-city-contract-choice]')).to_have_count(0)
    check(progress(page)['activeId'] is None, 'completed contract remains active')
    check(not page.evaluate('window.__sceneQA.reports.length'), 'City contract emitted a combat reward receipt')
    case['receipt'] = progress(page)['records'][mission_id]
    check(case['receipt']['districtId'] == district and case['receipt']['universe'] == universe,
          'completed contract lost its source district or universe')
    return case


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
