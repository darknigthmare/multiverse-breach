"""Actual GameCanvas/EngineTactics art checks on desktop/mobile loopback.

Read-only QA hooks capture native state/draws. Movement and mission commands
use browser clicks on the production canvas and controls, never state edits.
The scenario stops after Sarii's retrieval; this is not full-film certification.
"""
import argparse
import json
import os
from pathlib import Path
import re
import traceback
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect
from browserCombatUi import open_arsenal, close_arsenal, click_combat_point


AUDIT = 'window.__sourceSceneArtAudit'


def snapshot(page):
    return page.evaluate(f'{AUDIT}.snapshot()')


def settle(page):
    page.wait_for_function(f'{AUDIT}?.engine && {AUDIT}.engine.canCommandActiveUnit()')


def end_turn(page):
    # End turn belongs to the persistent action panel, outside the modal.
    # A real modal correctly prevents that click until the drawer is closed.
    close_arsenal(page)
    page.get_by_role('button', name=re.compile(r'END TURN|FINIR LE TOUR', re.I)).click()
    close_arsenal(page)
    settle(page)


def walk_to(page, target):
    for _ in range(35):
        settle(page)
        current = snapshot(page)
        if current['actor']['gridX'] == target['x'] and current['actor']['gridY'] == target['y']:
            return
        if current['turnPhase'] != 'move':
            end_turn(page)
            continue
        step = page.evaluate(f'''target => {{
          const a={AUDIT}, e=a.engine;
          return a.routeTo(target).filter(p=>p.cost <= e.movementBudget-e.movementSpent).at(-1) || null;
        }}''', target)
        if not step or step['cost'] == 0:
            end_turn(page)
            continue
        close_arsenal(page)
        point = page.evaluate(f'p => {AUDIT}.engine.gridToScreen(p.x,p.y)', step)
        click_combat_point(page.locator('canvas.combat-stage-canvas'), point)
        page.wait_for_function(f'p => {AUDIT}.engine.sourceScene.actor.gridX===p.x && {AUDIT}.engine.sourceScene.actor.gridY===p.y', arg=step)
    raise AssertionError(f'Native route did not reach {target}')


def command(page, command_id):
    settle(page)
    source = snapshot(page)['source']
    item = next(c for c in source['commands'] if c['id'] == command_id)
    if not item.get('anywhere'):
        walk_to(page, item['cell'])
    open_arsenal(page)
    button = page.locator('.source-scene-panel').get_by_role('button', name=re.compile(re.escape(item['label']['en'])))
    expect(button).to_be_enabled()
    button.click()
    close_arsenal(page)
    page.wait_for_function(f'id => {AUDIT}.snapshot().source.commands.some(c=>c.id===id && c.done)', arg=command_id)
    settle(page)


def sarii_route(page, output, prefix):
    for command_id in ['herb', 'bait', 'flintlock']:
        command(page, command_id)
    before_theft = snapshot(page)
    mask_path = before_theft['additionalArt']['boneMask']
    assert before_theft['maskedThreat'], 'Feral still wears the mask before the authored theft'
    assert before_theft['additionalArt']['boneMaskRole'] is None
    assert mask_path not in before_theft['draws'], 'no detached mask copy may appear on the ground while Feral wears it'
    page.screenshot(path=str(output / f'{prefix}-before-theft-no-ground-mask.png'), full_page=True)
    command(page, 'take_mask')
    page.wait_for_function(f'''path => {{const s={AUDIT}.snapshot();return s.additionalArt.boneMaskRole==='carried'
      && s.draws[path]?.lastArgs[2]===24 && s.draws[path]?.lastArgs[3]===24;}}''', arg=mask_path)
    carried = snapshot(page)
    assert carried['maskedThreat'] == ''
    assert carried['draws'][mask_path]['maxCallsInFrame'] == 1
    page.screenshot(path=str(output / f'{prefix}-mask-carried.png'), full_page=True)
    command(page, 'set_mask')
    page.wait_for_function(f'''path => {{const s={AUDIT}.snapshot();return s.additionalArt.boneMaskRole==='mounted'
      && s.draws[path]?.lastArgs[2]===32 && s.draws[path]?.lastArgs[3]===32;}}''', arg=mask_path)
    mounted = snapshot(page)
    assert mounted['draws'][mask_path]['maxCallsInFrame'] == 1
    page.screenshot(path=str(output / f'{prefix}-mask-mounted-before-aim.png'), full_page=True)
    # Aiming is a real native command and consumes its normal turn.
    open_arsenal(page)
    aiming = page.get_by_role('group', name='Bone mask targeting')
    aiming.get_by_role('button', name='G5', exact=True).click()
    close_arsenal(page)
    settle(page)
    command(page, 'sarii_hatchet')
    before = snapshot(page)
    assert before['maskedThreat'] == '', 'removed bone mask must not retain masked Feral art'
    masked_path = next(path for path in before['draws'] if 'feral-predator-v2-fidelity-wave13' in path)
    assert before['source']['complete'] is False
    target = page.evaluate(f'''() => {{
      const e={AUDIT}.engine, a=e.sourceScene.actor;
      return e.getReachableCells(a,1).find(p=>p.cost===1 && (p.x!==a.gridX || p.y!==a.gridY));
    }}''')
    assert target, 'One real adjacent movement cell required'
    walk_to(page, target)
    portrait = '/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png'
    page.wait_for_function(f'''path => {{
      const a={AUDIT}, s=a.snapshot(), at=a.engine.gridToScreen(s.companion.x,s.companion.y), d=s.draws[path];
      return d && Math.abs(d.lastArgs[0]-(at.x-16))<0.01 && Math.abs(d.lastArgs[1]-(at.y-44))<0.01;
    }}''', arg=portrait)
    after = snapshot(page)
    assert after['draws'][masked_path]['calls'] == before['draws'][masked_path]['calls'], 'masked bitmap must stop drawing after mask removal'
    assert after['draws'][mask_path]['maxCallsInFrame'] == 1, 'one physical icon per native frame; no carried/mounted double'
    assert before['companion'] != after['companion'], 'Sarii portrait must follow the authored companion-cell rule'
    assert after['source']['progress'] == before['source']['progress'], 'movement must not complete another objective'
    page.screenshot(path=str(output / f'{prefix}-sarii-follow-mask-off.png'), full_page=True)
    return {'beforeTheft': before_theft, 'carried': carried, 'mounted': mounted, 'before': before, 'after': after}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4177')
    parser.add_argument('--evidence', default='/tmp/source-scene-art-browser-20261113')
    parser.add_argument('--stage', action='append', type=int, choices=(50104, 50105, 50106),
                        help='Limit follow-up runs to stages whose source/art changed; repeat for multiple IDs')
    parser.add_argument('--observe-idle-ms', type=int, default=0,
                        help='Observe the actual native scheduler after the route; 26000 spans two normal anomaly intervals')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    if urlparse(base).hostname not in ('127.0.0.1', 'localhost', '::1'):
        raise ValueError('QA fixture must use loopback')
    output = Path(args.evidence)
    output.mkdir(parents=True, exist_ok=True)
    cases = []
    stages = tuple(dict.fromkeys(args.stage or (50104, 50105, 50106)))
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE', '/usr/bin/chromium'))
        for width in (1280, 390):
            for stage in stages:
                errors, missing = [], []
                name = f'source-art-{stage}-{width}'
                context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
                page = context.new_page()
                page.set_default_timeout(25000)
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('response', lambda r: missing.append({'path': urlparse(r.url).path, 'status': r.status}) if r.status >= 400 else None)
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost', '::1') else route.abort())
                try:
                    page.goto(base + f'/scripts/fixtures/source-scene-art.html?stage={stage}&lang=en', wait_until='domcontentloaded')
                    settle(page)
                    page.wait_for_function(f'''() => {{ const s={AUDIT}.snapshot(); return s.backdrop && s.draws[s.backdrop.path]?.calls>1; }}''')
                    initial = snapshot(page)
                    assert initial['stageId'] == stage
                    shell_backdrop = page.locator('.combat-immersive-surface').evaluate('(el)=>getComputedStyle(el).getPropertyValue("--combat-backdrop")')
                    assert initial['backdrop']['path'] in shell_backdrop, 'UI surroundings must use the exact source-scene atmosphere'
                    assert initial['storageIntact'] and initial['resultCount'] == 0
                    canvas = page.locator('canvas.combat-stage-canvas')
                    box = canvas.bounding_box()
                    assert box and box['x'] >= -1 and box['x'] + box['width'] <= width + 1
                    if stage == 50106:
                        assert initial['maskedThreat'], 'native masked Feral must use the Nov9 sheet before mask removal'
                        for asset in [initial['maskedThreat'], '/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png',
                                      initial['additionalArt']['naruPortrait']]:
                            page.wait_for_function(f'path => {AUDIT}.snapshot().draws[path]?.calls>0', arg=asset)
                        naru = snapshot(page)['draws'][initial['additionalArt']['naruPortrait']]
                        assert naru['lastArgs'][2:] == [24, 24], 'Naru portrait stays inside the actual 28×24 initiative badge'
                    page.screenshot(path=str(output / f'{name}-initial.png'), full_page=True)
                    route = sarii_route(page, output, name) if stage == 50106 else None
                    idle = None
                    if args.observe_idle_ms:
                        before_idle = snapshot(page)
                        page.wait_for_timeout(args.observe_idle_ms)
                        after_idle = snapshot(page)
                        assert after_idle['source']['turns'] == before_idle['source']['turns']
                        assert after_idle['source']['progress'] == before_idle['source']['progress']
                        assert after_idle['actor']['currentHp'] == before_idle['actor']['currentHp'], 'idle source actor HP must remain unchanged'
                        assert after_idle['updates'] > before_idle['updates'] + 720, 'the real scene must advance beyond an anomaly period'
                        assert after_idle['anomalyMessages'] == [], 'crossover anomaly banners must never enter a source-locked scene'
                        page.screenshot(path=str(output / f'{name}-after-native-scheduler-observation.png'), full_page=True)
                        idle = {'milliseconds': args.observe_idle_ms, 'before': before_idle, 'after': after_idle}
                    critical = [initial['backdrop']['path']]
                    if stage == 50106:
                        critical += [initial['maskedThreat'], '/sprites/source-scenes/prey-2022/sarii-portrait-20261113.png',
                                     initial['additionalArt']['naruPortrait'], initial['additionalArt']['boneMask']]
                    assert not [m for m in missing if m['path'] in critical], 'Critical generated/native scene artwork failed to load'
                    assert not errors, f'Browser exceptions: {errors}'
                    page.locator('#qa-unmount').click()
                    page.wait_for_function(f'{AUDIT}.engine.disposed')
                    assert snapshot(page)['storageIntact']
                    cases.append({'name': name, 'passed': True, 'initial': initial, 'route': route, 'idleObservation': idle,
                                  'pageErrors': errors, 'missingRequests': missing})
                    print('PASS', name, flush=True)
                except Exception as exc:
                    page.screenshot(path=str(output / f'{name}-FAILED.png'), full_page=True)
                    cases.append({'name': name, 'passed': False, 'error': str(exc), 'traceback': traceback.format_exc(),
                                  'pageErrors': errors, 'missingRequests': missing,
                                  'buttons': page.get_by_role('button').all_text_contents()})
                    print('FAIL', name, str(exc), flush=True)
                finally:
                    context.close()
        browser.close()
    report = {'scope': 'Native GameCanvas/EngineTactics, real browser canvas and UI clicks; selected authored source scenes, desktop/mobile viewports. Not a full campaign, physical mobile device or film-fidelity certification.',
              'stageIds': stages,
              'passed': sum(c['passed'] for c in cases), 'total': len(cases), 'cases': cases}
    (output / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({'passed': report['passed'], 'total': report['total']}), flush=True)
    if report['passed'] != report['total']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
