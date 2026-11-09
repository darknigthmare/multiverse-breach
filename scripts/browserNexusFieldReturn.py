#!/usr/bin/env python3
"""Earn a City dossier, fight the optional operation and physically return to its airlock.

The real Hub owns transitions, pause, its reward callback and progression. Only
ownership and the initial City entry are prepared. All report steps, damage,
relays, Champion, return movement and reward delivery come from ordinary inputs.
"""
import argparse
import json
import math
import traceback
from pathlib import Path

from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check
from browserCityFpsOperations import (DISTRICT, SEED_NAME, reconnaissance,
    operation_state, relay_full_run, relay_seed)
from browserFieldVariants import cross_check
from browserResidentViewmodels import CLOCK_EPOCH, CLOCK_START, clock_reading
from browserSceneServices import aim

OPERATION = 'nexus-witness-return-v1'
OWNED = ['player_anchor', 'arca_mirelle', 'arca_bastion', 'arca_nova']


def open_field_terminal(page):
    # The operation briefing is global, including after ownership loss sends
    # the City back to the Atrium. Only cross_check requires a district objective.
    if not page.get_by_role('dialog').count():
        page.get_by_role('button', name='TERMINAL · JOURNAL', exact=True).click()
    page.locator('[data-city-terminal-tab="transmissions"]').click()
    expect(page.locator('[data-field-access]')).to_be_visible()


def persistent_state(page):
    return page.evaluate("""() => ({progress:window.__sceneQA.activityProgress,
      balances:window.__sceneQA.balances,reports:window.__sceneQA.reports})""")


def no_reward(page):
    saved = persistent_state(page)
    career = saved['progress'].get('extinctionCareer', {})
    check(saved['balances'] == {'gold': 0, 'shards': 0}, 'currency awarded before physical return')
    check(not career.get('receipts') and not career.get('fieldReturns') and not saved['reports'],
          'completion receipt issued before physical return')


def remount_hub_checkpoint(page, saved_progress, out, name):
    # Production deliberately deduplicates identical location publications. A
    # changed write count is not required: compare the actual saved checkpoint.
    proof = {'before': page.evaluate('window.__sceneQA.snapshot()'), 'clock': clock_reading(page)}
    try:
        page.locator('#qa-unmount').click()
        expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
        before = proof['before']['player']
        page.wait_for_function("""before => {
          const saved=window.__sceneQA.saved;
          return saved?.districtId==='universe-nexus-de-convergence'
            &&Math.abs(saved.player.x-before.x)<.02&&Math.abs(saved.player.y-before.y)<.02
            &&saved.player.facing===before.facing;
        }""", arg=before, polling=50)
        proof['checkpoint'] = page.evaluate('window.__sceneQA.saved')
        page.evaluate('window.__sceneQA.remount()')
        page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
        proof['restored'] = page.evaluate('window.__sceneQA.snapshot()')
        restored = proof['restored']['player']
        check(abs(restored['x'] - before['x']) < .02 and abs(restored['y'] - before['y']) < .02
              and restored['facing'] == before['facing'], 'real Hub remount changed the City checkpoint')
        check(reconnaissance(page) == saved_progress, 'real Hub remount lost earned report progress')
        check(proof['clock'] == clock_reading(page), 'clock advanced during remount observation')
        proof.update(passed=True, parentStateRetained=True, diskReload=False)
        return proof
    finally:
        (out / f'{name}-hub-remount.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2))


def display_preferences(page):
    page.evaluate("""() => {
      const root=document.documentElement;
      root.style.setProperty('--game-text-scale','1.5');
      root.style.setProperty('--game-hud-scale','1.4');
      root.style.setProperty('--game-safe-area','32px');
      window.dispatchEvent(new Event('multiverse:display-preferences'));
    }""")
    page.evaluate('document.fonts.ready.then(() => true)')
    page.clock.run_for(32)


def pause_in_hub(page, paused, lang='fr'):
    if paused:
        page.locator('.dedicated-game-pause-button').click()
        expect(page.locator('.dedicated-game-pause-dialog')).to_be_visible()
    else:
        page.locator('.dedicated-game-pause-dialog').get_by_role('button',
            name='REPRENDRE' if lang == 'fr' else 'RESUME', exact=True).click()
        expect(page.locator('.dedicated-game-pause-dialog')).to_have_count(0)


def rerender_hub(page):
    previous = page.evaluate('window.__sceneQA.revision')
    page.evaluate('window.__sceneQA.rerender()')
    page.wait_for_function('previous => window.__sceneQA.revision > previous', arg=previous, polling=50)


def deploy_from_city(page, source, out, name):
    open_field_terminal(page)
    expect(page.locator('[data-field-access="available"]')).to_be_visible()
    button = page.locator('[data-field-deploy]')
    expect(button).to_be_enabled()
    button.scroll_into_view_if_needed()
    # Retain a read-only reference to verify cleanup after its component leaves.
    before = page.evaluate("""() => {
      window.__departingCity=window.__sceneQA.state();
      return window.__sceneQA.snapshot();
    }""")
    page.screenshot(path=str(out / f'{name}-city-briefing.png'))
    button.click()
    page.wait_for_function('window.__sceneQA.state()?.phase === "ready"', polling=50)
    page.clock.run_for(32)
    toggle = page.locator('input[data-field-operation]')
    expect(toggle).to_be_checked()
    expect(toggle).to_be_focused()
    expect(page.locator('input[data-relay-operation]')).to_be_checked()
    expect(page.locator('input[data-relay-operation]')).to_be_disabled()
    cleanup = page.evaluate("""() => ({keys:window.__departingCity.keys,
      destination:window.__departingCity.destination,pending:window.__departingCity.pendingInteraction,
      saved:window.__sceneQA.saved,paused:!!document.querySelector('.dedicated-game-pause-dialog')})""")
    check(not any(cleanup['keys'].values()) and cleanup['destination'] is None
          and cleanup['pending'] is None and not cleanup['paused'], 'City transition retained input or pause')
    check(abs(cleanup['saved']['player']['x'] - before['player']['x']) < .02
          and abs(cleanup['saved']['player']['y'] - before['player']['y']) < .02,
          'City deployment did not save the departure position')
    check(reconnaissance(page) == source, 'deployment changed the earned dossier')
    page.screenshot(path=str(out / f'{name}-fps-briefing.png'))
    return cleanup


def eligibility_and_abandon(page, lang, source, out, name):
    # Test the roster lock by changing only prepared ownership, outside combat.
    open_field_terminal(page)
    page.evaluate('window.__sceneQA.setOwned([])')
    expect(page.locator('[data-field-access="roster_required"]')).to_be_visible()
    expect(page.locator('[data-field-deploy]')).to_be_disabled()
    check(reconnaissance(page) == source, 'absent roster discarded the dossier')
    page.evaluate('ids => window.__sceneQA.setOwned(ids)', OWNED)
    transition = deploy_from_city(page, source, out, name)
    page.locator('input[data-field-operation]').uncheck()
    page.locator('.hub-return-city').click()
    page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
    page.clock.run_for(32)
    pause_in_hub(page, True, lang)
    page.locator('.dedicated-game-abandon-button').click()
    expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
    page.locator('.hub-navigation-secondary').get_by_role('button',
        name='ZONE D EXTINCTION' if lang == 'fr' else 'EXTINCTION ZONE', exact=True).click()
    page.wait_for_function('window.__sceneQA.state()?.phase === "ready"', polling=50)
    expect(page.locator('input[data-field-operation]')).not_to_be_checked()
    expect(page.locator('input[data-relay-operation]')).not_to_be_checked()
    page.screenshot(path=str(out / f'{name}-normal-entry.png'))
    page.locator('.hub-return-city').click()
    page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
    deploy_from_city(page, source, out, f'{name}-before-abandon')
    page.get_by_role('button', name='DEMARRER RUN' if lang == 'fr' else 'START RUN', exact=True).click()
    page.wait_for_function('window.__sceneQA.state()?.phase === "running"', polling=50)
    page.clock.run_for(32)
    check(page.evaluate('window.__sceneQA.state().fieldOperation?.id') == OPERATION, 'optional operation was not started')
    pause_in_hub(page, True, lang)
    page.locator('.dedicated-game-abandon-button').click()
    page.wait_for_function('window.__sceneQA.state()?.phase === "ready"', polling=50)
    check(page.evaluate('window.__sceneQA.state().fieldOperation') is None, 'abandon retained the active operation')
    no_reward(page)
    check(reconnaissance(page) == source, 'abandon consumed the source report')
    page.locator('.hub-return-city').click()
    page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
    deploy_from_city(page, source, out, f'{name}-retry')
    return {'transition': transition, 'missingRosterLocked': True,
            'normalNavigationUnselected': True, 'abandonUnrewarded': True, 'sourceRetained': True}


def require_scene_art(page, require_art):
    if require_art:
        page.wait_for_function("""() => {
          const media=window.__sceneQA.media;
          return media.length>0&&media.every(item=>item.loaded);
        }""", polling=50, timeout=20000)
        media = page.evaluate('window.__sceneQA.media')
        for path in ['/images/campaign-oc/chapter-01-atrium-v1.png',
                     '/backgrounds/lore-stages/nexus-de-convergence/rpg.webp']:
            check(any(item['src'] == path and item['loaded'] for item in media), f'undecoded scene artwork: {path}')
    return page.evaluate('window.__sceneQA.media')


def field_hooks(page, lang, source, out, name, record):
    return_probe = {'steps': []}
    completed = {}

    def prepare(current_page):
        display_preferences(current_page)
        check(current_page.evaluate('window.__sceneQA.state().phase === "ready" && window.__sceneQA.state().t === 0'),
              'fresh FPS preparation contains a previous run')
        phase = current_page.evaluate('performance.now()%16')
        if phase:
            current_page.clock.run_for(16 - phase)
        current_page.clock.set_system_time(CLOCK_START)
        reading = clock_reading(current_page)
        check(reading['rafPhase'] == 0, 'replay clock is not on the fixed RAF grid')
        return reading

    def observe(current_page, current):
        projection = current_page.evaluate("""() => {
          const s=window.__sceneQA.state(),op=s.fieldOperation;
          return {field:op?{id:op.id,status:op.status,witnessId:op.witnessId,evidenceIds:op.evidenceIds,
            ownerMatches:op.runId===s.runId&&op.heroId===s.heroId,championCleared:!!op.championCleared}:null};
        }""")
        check(not projection['field'] or projection['field']['ownerMatches'], 'field operation owner changed')
        # Random run UUIDs are identifiers, not simulation outcomes. Keep their
        # ownership equality in the trace and omit only the marker's raw UUID.
        projection['loot'] = [{key: value for key, value in item.items() if key != 'runId'}
                              if item.get('type') == 'field-return' else item for item in current['loot']]
        return projection

    def advance(current_page, current):
        if (current.get('field') or {}).get('status') != 'return':
            return None
        marker = next(item for item in current['loot'] if item['type'] == 'field-return')
        distance = math.hypot(marker['wx'] - current['px'], marker['wy'] - current['py'])
        if 'opened' not in return_probe:
            no_reward(current_page)
            check(current['phase'] == 'running' and current['beacons'] == 3
                  and all(enemy['hp'] <= 0 for enemy in current['enemies'])
                  and any(enemy['kind'] == 'Champion de Trame' for enemy in current['enemies']),
                  'return phase opened without actual relay and Champion completion')
            expect(current_page.locator('.extinction-objective-strip')).to_contain_text('radar')
            expect(current_page.locator('.extinction-objective-strip')).to_contain_text(' m')
            current_page.screenshot(path=str(out / f'{name}-return-open.png'))
            return_probe['opened'] = {'t': current['t'], 'hp': current['hp'], 'distance': distance,
                                      'px': current['px'], 'py': current['py'], 'beforeRewards': persistent_state(current_page)}
            if distance >= 1.25:
                current_page.keyboard.press('e')
                check(current_page.evaluate('window.__sceneQA.state().phase') == 'running', 'remote E completed the return')
                no_reward(current_page)
                return_probe['remoteInteractionIgnored'] = True
            pause_in_hub(current_page, True, lang)
            frozen = operation_state(current_page)
            for key in ['w', 'd', 'e', 'c', 'x', 'Space']:
                current_page.keyboard.press(key)
            current_page.clock.run_for(1000)
            check(operation_state(current_page) == frozen, 'return simulation or actions advanced under pause')
            no_reward(current_page)
            current_page.screenshot(path=str(out / f'{name}-return-paused.png'))
            pause_in_hub(current_page, False, lang)
            current_page.locator('.fps-royale-canvas').focus()
            check(not any(operation_state(current_page)['keys'].values()), 'pause left held return inputs')
            return_probe['pauseFrozen'] = True
        if distance < 1.15:
            current_page.keyboard.press('e')
            current_page.clock.run_for(32)
            action = {'kind': 'transmit-at-airlock', 'milliseconds': 32, 'distance': distance}
        else:
            aim(current_page, current, marker['wx'], marker['wy'])
            duration = min(250, max(17, int((distance - .8) / .25) * 17))
            current_page.keyboard.down('w'); current_page.clock.run_for(duration); current_page.keyboard.up('w')
            current_page.clock.run_for(70)
            action = {'kind': 'walk-to-airlock', 'milliseconds': duration + 70, 'distance': distance}
        after = operation_state(current_page)
        return_probe['steps'].append({'before': {'x': current['px'], 'y': current['py'], 't': current['t']},
            'after': {'x': after['px'], 'y': after['py'], 't': after['t'], 'phase': after['phase']}, **action})
        return action

    def result(current_page, current):
        current_page.wait_for_function('window.__sceneQA.activityProgress.extinctionCareer?.lastReport', polling=50)
        saved = persistent_state(current_page)
        career = saved['progress']['extinctionCareer']; report = career['lastReport']
        proof = report.get('fieldOperation', {})
        check(report['reason'] == 'completed' and report['result'] == 'victory' and report['mode'] == 'extraction',
              'real Hub did not retain the completed extraction report')
        check(proof.get('id') == OPERATION and proof.get('status') == 'returned' and proof.get('relays') == 3
              and proof.get('championCleared') is True and proof.get('runId') == report['runId'], 'return proof incomplete')
        dossier = source['dossiers'][DISTRICT]
        check(proof['witnessId'] == dossier['residentId'] and proof['evidenceIds'] == dossier['evidenceIds'], 'return source changed')
        receipt = career.get('fieldReturns', {}).get(OPERATION)
        check(receipt and receipt['runId'] == report['runId'], 'first return not persisted by the real callback')
        check(career['receipts'] == [report['runId']] and career['runs'] == career['wins'] == 1
              and len(saved['reports']) == 1, 'real Hub duplicated completion')
        rewards = report['rewards']
        check(rewards['gold'] == 70 + report['waves'] * 22 + report['kills'] * 3
              and rewards['shards'] == 24 + report['waves'] * 7
              and rewards['modeXp'] == 120 + report['waves'] * 30, 'intervention changed ordinary extraction rewards')
        check(saved['balances'] == {'gold': rewards['gold'], 'shards': rewards['shards']}
              and career['xp'] == rewards['modeXp'], 'real wallet and career differ from the one normal reward')
        check(reconnaissance(current_page) == source, 'completion consumed or replaced the City report')
        check(current_page.evaluate('window.__sceneQA.state().fieldOperation') is None
              and not any(item['type'] == 'field-return' for item in current['loot']), 'return state leaked into results')
        expect(current_page.locator('[data-field-result="returned"]')).to_be_visible()
        check(return_probe['steps'] and any(step['kind'] == 'walk-to-airlock' for step in return_probe['steps']),
              'victory never exercised physical return movement')
        completed.update(saved)
        record['fieldReturn'] = return_probe
        record['persistedReceipt'] = receipt
        return report

    def acknowledged(current_page, report):
        check(current_page.evaluate('window.__sceneQA.state().phase') == 'ready', 'acknowledgement did not leave results')
        after = persistent_state(current_page)
        check(after == completed, 'acknowledgement or parent render changed the unique reward')
        expect(current_page.locator('.extinction-result')).to_have_count(0)
        record['walletAfterAcknowledgement'] = after['balances']

    return {'prepare': prepare, 'state': observe, 'advance': advance,
            'pause': lambda current_page, paused: pause_in_hub(current_page, paused, lang),
            'rerender': rerender_hub, 'result': result, 'acknowledged': acknowledged,
            'seed': relay_seed(), 'seedPolicy': f'fnv1a32:{SEED_NAME}', 'expectedTextScale': '1.5'}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/nexus-field-return')
    parser.add_argument('--executable')
    parser.add_argument('--require-art', action='store_true')
    parser.add_argument('--case', default='')
    parser.add_argument('--replays', type=int, default=2, choices=range(1, 6))
    args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []; reference = None
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=['--no-sandbox'],
            **({'executable_path': args.executable} if args.executable else {}))
        try:
            for replay in range(1, args.replays + 1):
                name = f'nexus-return-1280x900-fr-replay-{replay}'
                if args.case and args.case not in name:
                    continue
                print('START ' + name, flush=True)
                context = browser.new_context(viewport={'width': 1280, 'height': 900}, has_touch=True)
                context.add_init_script("localStorage.setItem('multiverse_breach_field_options_v1',JSON.stringify({schemaVersion:1,reconnaissance:'cross-check',relays:'standard'}));")
                page = context.new_page(); page.set_default_timeout(10000)
                errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                record = {'name': name, 'replay': replay, 'passed': False, 'pageErrors': errors,
                          'preparedOwnership': True, 'preparedInitialDistrict': True,
                          'preparedDossier': False, 'realHubWallet': True}
                try:
                    page.clock.install(time=CLOCK_EPOCH); page.clock.pause_at(CLOCK_START)
                    page.goto(f'{args.url}/scripts/fixtures/nexus-field-return.html?lang=fr', wait_until='networkidle')
                    page.wait_for_function('window.__sceneQA?.state()?.npcs?.length', polling=50)
                    display_preferences(page)
                    later = page.get_by_role('button', name='Plus tard', exact=True)
                    if later.is_visible():
                        later.click()
                    open_field_terminal(page)
                    expect(page.locator('[data-field-access="report_required"]')).to_be_visible()
                    expect(page.locator('[data-field-deploy]')).to_be_disabled()
                    page.keyboard.press('Escape')
                    record['city'] = cross_check(page, 'fr', out, name, remount=remount_hub_checkpoint)
                    source = reconnaissance(page)
                    record['accessAndAbandon'] = eligibility_and_abandon(page, 'fr', source, out, name)
                    record['media'] = require_scene_art(page, args.require_art)
                    hooks = field_hooks(page, 'fr', source, out, name, record)
                    relay_full_run(page, 'fr', out, name, record, hooks=hooks)
                    page.locator('.hub-return-city').click()
                    page.wait_for_function('window.__sceneQA.state()?.npcs?.length', polling=50)
                    open_field_terminal(page)
                    expect(page.locator('[data-field-completed]')).to_be_visible()
                    expect(page.locator('[data-field-deploy]')).to_be_enabled()
                    check(reconnaissance(page) == source, 'return to City lost the report')
                    page.locator('[data-field-completed]').scroll_into_view_if_needed()
                    page.screenshot(path=str(out / f'{name}-city-confirmed.png'))
                    record['firstReceiptVisibleInCity'] = True
                    if reference is not None:
                        record['matchesFirstReplay'] = record['traceDigest'] == reference['traceDigest']
                        check(record['matchesFirstReplay'], f'same-seed operation diverged: {reference["traceFile"]} / {record["traceFile"]}')
                    else:
                        reference = record
                    check(not errors, str(errors))
                    record['passed'] = True
                except Exception as error:
                    record['error'] = str(error)
                    record['traceback'] = traceback.format_exc()
                    try:
                        record['failureSnapshot'] = page.evaluate('window.__sceneQA?.snapshot()')
                        record['media'] = page.evaluate('window.__sceneQA?.media')
                        page.screenshot(path=str(out / f'{name}-FAILED.png'), timeout=4000)
                    except Exception:
                        pass
                finally:
                    results.append(record)
                    (out / 'report.json').write_text(json.dumps({'scope':
                        'Actual Hub, earned cross-check dossier, input-driven FPS relays/Champion/physical return and unique wallet receipt. '
                        'Prepared ownership and entry only. Hub remount retains parent state; save serialization is a separate contract test. '
                        'Desktop 1280x900, text 150%, HUD 140%, safe area 32px; no physical-device or art-fidelity claim.',
                        'passed': sum(entry['passed'] for entry in results), 'total': len(results), 'results': results},
                        ensure_ascii=False, indent=2))
                    print(json.dumps({'name': name, 'passed': record['passed'], 'error': record.get('error')}, ensure_ascii=False), flush=True)
                    context.close()
        finally:
            browser.close()
    check(results and all(record['passed'] for record in results), 'Nexus field return browser failures')


if __name__ == '__main__':
    main()
