"""Real Tactics controls on a synthetic loopback-only fixture (not a campaign).

Chromium desktop/mobile viewports, FR/EN, production engine and UI. No accounts,
real saves, third-party requests or production debug hooks are used. Artwork
not included by the source checkout uses the game's normal fallback renderer.
"""
import argparse
import json
import os
from pathlib import Path
import re
import time
import traceback
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/tactics-browser-evidence')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    if urlparse(base).hostname not in ('localhost', '127.0.0.1', '::1'):
        raise ValueError('The Tactics QA fixture may only run on loopback')
    output = Path(args.evidence); output.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as p:
        launch = {'headless': True}
        if os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE'):
            launch['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']
        browser = p.chromium.launch(**launch)
        for width in (1280, 390):
            for lang in ('fr', 'en'):
                name = f'tactics-support-pause-revive-hazard-{width}-{lang}'
                started = time.monotonic(); errors = []; missing = []
                ctx = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
                page = ctx.new_page(); page.set_default_timeout(20000)
                page.on('pageerror', lambda err: errors.append(str(err)))
                page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' and 'Combat render loop failed' in msg.text else None)
                page.on('response', lambda res: missing.append(urlparse(res.url).path) if res.status >= 400 else None)
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1', '::1') else route.abort())
                prefix = f'tactics-{width}-{lang}'
                try:
                    page.goto(base + f'/scripts/fixtures/tactics-lifecycle.html?lang={lang}', wait_until='domcontentloaded')
                    page.wait_for_function('window.__tacticsAudit?.engine && !window.__tacticsAudit.engine.disposed')
                    before = page.evaluate("window.__tacticsAudit.prepare('heal')")
                    heal = page.get_by_role('button', name=re.compile('QA HEAL', re.I))
                    expect(heal).to_be_enabled(); heal.click()
                    panel = page.get_by_role('region', name='Soutien tactique' if lang == 'fr' else 'Tactical support')
                    target = panel.get_by_role('button', name=re.compile('QA Anchor'))
                    expect(target).to_contain_text('+10')
                    # Choosing a skill remains free; pause blocks both the target and end-turn.
                    assert page.evaluate('window.__tacticsAudit.engine.heroes[1].cooldown') == 0
                    page.locator('#qa-pause').click(); expect(target).to_be_disabled()
                    ending = page.get_by_role('button', name=re.compile('FINIR LE TOUR' if lang == 'fr' else 'END TURN'))
                    expect(ending).to_be_disabled()
                    assert page.evaluate('window.__tacticsAudit.engine.turnsElapsed') == before['turns']
                    page.locator('#qa-pause').click(); expect(target).to_be_enabled()
                    box = panel.bounding_box(); assert box and box['x'] >= -1 and box['x'] + box['width'] <= width + 1
                    page.screenshot(path=str(output / f'{prefix}-heal-targets.png'), full_page=True)
                    # Two synchronous real DOM clicks hit the actual React handler only once.
                    target.evaluate('(button) => { button.click(); button.click(); }')
                    page.wait_for_function('window.__tacticsAudit.engine.heroes[0].currentHp === 100')
                    assert page.evaluate('window.__tacticsAudit.engine.turnsElapsed') == before['turns'] + 1
                    assert page.evaluate('window.__tacticsAudit.engine.enemies.map(u=>u.currentHp)') == before['enemies']
                    assert page.evaluate('window.__tacticsAudit.engine.heroes[1].cooldown > 0')

                    page.evaluate("window.__tacticsAudit.prepare('cleanse')")
                    clean = page.get_by_role('button', name=re.compile('QA CLEANSE', re.I))
                    expect(clean).to_be_enabled(); clean.click()
                    expect(panel).to_contain_text('Retire : infection' if lang == 'fr' else 'Removes: infection')
                    panel.get_by_role('button', name=re.compile('QA Anchor')).click()
                    page.wait_for_function('window.__tacticsAudit.engine.heroes[0].statusEffects.infected === 0')
                    assert page.evaluate('window.__tacticsAudit.engine.heroes[0].statusEffects.radiated > 0')
                    assert page.evaluate('window.__tacticsAudit.engine.heroes[0].currentHp <= 100')

                    page.evaluate("window.__tacticsAudit.prepare('occupied')")
                    revive = page.get_by_role('button', name=re.compile('QA REVIVE', re.I))
                    expect(revive).to_be_enabled(); revive.click()
                    expect(panel).to_contain_text('Aucune cible admissible' if lang == 'fr' else 'No eligible target')
                    assert page.evaluate('window.__tacticsAudit.engine.heroes[1].cooldown') == 0
                    page.evaluate("window.__tacticsAudit.prepare('revive')")
                    expect(revive).to_be_enabled(); revive.click()
                    target = panel.get_by_role('button', name=re.compile('QA Anchor'))
                    expect(target).to_contain_text('+60'); target.click()
                    page.wait_for_function('window.__tacticsAudit.engine.heroes[0].currentHp === 60')
                    assert page.evaluate("window.__tacticsAudit.engine.heroes[0].state === 'idle'")
                    page.screenshot(path=str(output / f'{prefix}-revived.png'), full_page=True)

                    # Actual canvas click on a lethal tile must end, rather than strand, the turn.
                    page.evaluate("window.__tacticsAudit.prepare('hazard')")
                    page.wait_for_function("window.__tacticsAudit.engine.activeUnit?.id === 'arca_mirelle'")
                    point = page.evaluate('window.__tacticsAudit.engine.gridToScreen(2,2)')
                    canvas = page.locator('canvas').first
                    size = canvas.evaluate('(c) => ({width:c.width,height:c.height})'); box = canvas.bounding_box()
                    canvas.click(position={'x':point['x'] * box['width']/size['width'], 'y':point['y'] * box['height']/size['height']})
                    page.wait_for_function('window.__tacticsAudit.engine.heroes[1].currentHp === 0')
                    page.wait_for_function("window.__tacticsAudit.engine.activeUnit?.id !== 'arca_mirelle'")
                    page.locator('#qa-unmount').click()
                    page.wait_for_function('window.__tacticsAudit.engine.disposed')
                    assert page.evaluate('window.__tacticsAudit.engine.timers.size') == 0
                    if errors:
                        raise AssertionError('Browser exceptions: ' + repr(errors))
                    results.append({'name':name,'passed':True,'seconds':round(time.monotonic()-started,2),
                                    'missing_assets':sorted(set(missing)),'page_errors':errors})
                    print('PASS', name, flush=True)
                except Exception as exc:
                    page.screenshot(path=str(output / f'{prefix}-FAILED.png'), full_page=True)
                    results.append({'name':name,'passed':False,'error':str(exc),'traceback':traceback.format_exc(),
                                    'page_errors':errors,'missing_assets':sorted(set(missing)),
                                    'buttons':page.get_by_role('button').all_text_contents()})
                    print('FAIL',name,str(exc),flush=True)
                finally:
                    ctx.close()
        browser.close()
    report = {'scope':'synthetic setup, real Tactics controls; desktop/mobile viewports, not a campaign or physical phones',
              'passed':sum(row['passed'] for row in results),'total':len(results),'cases':results}
    (output/'results.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    print(json.dumps({'passed':report['passed'],'total':report['total']}),flush=True)
    if report['passed'] != report['total']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
