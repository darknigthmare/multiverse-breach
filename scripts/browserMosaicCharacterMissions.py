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

CONTRACTS = [
    ('city-anchor-signature-v1', 'replace-origin', 'retain-origin'),
    ('city-mirelle-suture-v1', 'erase-copy', 'separate-traces'),
    ('city-bastion-tenth-route-v1', 'perfect-report', 'name-debt'),
    ('city-nova-measured-exit-v1', 'guarantee-future', 'mark-uncertainty'),
    ('city-sable-signed-map-v1', 'anonymous-perfect', 'signed-correction'),
    ('city-loom-return-thread-v1', 'send-unverified', 'verify-thread'),
    ('city-marrow-distinct-choices-v1', 'erase-double', 'separate-testimony'),
]


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


def play_contract(page, entry, out, case_name, remount=False):
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
    case = {'missionId': mission_id, 'walks': [], 'choice': None, 'remount': None}
    if remount:
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
                (out / f'{case_name}-{mission_id}-step-{index}.json').write_text(json.dumps(proof, indent=2))
            if proof.get('clickBefore') and proof.get('clickAfter'):
                check(proof['clickBefore']['x'] == proof['clickAfter']['x'] and
                      proof['clickBefore']['y'] == proof['clickAfter']['y'], 'approach teleported on click')
            motion = validate_mosaic_motion(proof)
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
    return case


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/mosaic-character-missions')
    parser.add_argument('--require-art', action='store_true')
    args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        try:
            for lang in ['fr', 'en']:
                for label, viewport in [('desktop', {'width': 1440, 'height': 1000}),
                                        ('portrait', {'width': 390, 'height': 844}),
                                        ('landscape', {'width': 844, 'height': 390})]:
                    name = f'{lang}-{label}'
                    context = browser.new_context(viewport=viewport, has_touch=True)
                    page = context.new_page()
                    errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                    result = {'name': name, 'viewport': viewport, 'status': 'running', 'contracts': []}
                    results.append(result)
                    try:
                        page.clock.install(time=CLOCK_EPOCH); page.clock.pause_at(CLOCK_START)
                        load(page, args, 'city', lang)
                        later = page.get_by_role('button', name='Plus tard' if lang == 'fr' else 'Later', exact=True)
                        if later.is_visible(): later.click()
                        page.locator('#qa-unmount').click()
                        expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
                        page.evaluate('location=>window.__sceneQA.setLocation(location)', {
                            'districtId': DISTRICT, 'zoneId': DISTRICT,
                            'player': {'x': 820, 'y': 760, 'facing': 1}})
                        page.wait_for_function('id=>window.__sceneQA.saved?.districtId===id', arg=DISTRICT, polling=50)
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
                        check(page.locator('[data-city-contract-select] option').count() == 7, 'owned original contracts missing')
                        chosen = CONTRACTS if label == 'desktop' else [CONTRACTS[0], CONTRACTS[5]]
                        for index, entry in enumerate(chosen):
                            result['contracts'].append(play_contract(page, entry, out, name, remount=index == 0))
                        page.locator('[data-city-contract-objective]').scroll_into_view_if_needed()
                        page.screenshot(path=str(out / f'{name}-completed.png'))
                        check(not errors, f'uncaught browser errors: {errors}')
                        result['status'] = 'passed'
                    except Exception as error:
                        result['status'] = 'failed'; result['error'] = str(error)
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
