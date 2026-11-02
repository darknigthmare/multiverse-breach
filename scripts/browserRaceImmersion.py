"""Real RaceMode lifecycle and controls; seeded career, no cloud/campaign writes.

--offline-dir renders an IIFE/CSS snapshot on about:blank with in-memory storage.
This mode checks behavior/layout only; --require-art on the local Vite server
additionally checks all seven committed race images, not an art-direction review.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', required=True)
    parser.add_argument('--offline-dir')
    parser.add_argument('--browser-executable')
    parser.add_argument('--require-art', action='store_true')
    args = parser.parse_args()
    assert urlparse(args.base).hostname in ('127.0.0.1', 'localhost')
    assert not (args.require_art and args.offline_dir)
    out = Path(args.evidence)
    out.mkdir(parents=True, exist_ok=True)
    cases = [(1280, 900, 'fr', False), (390, 844, 'en', False),
             (844, 390, 'fr', False), (2560, 1080, 'en', False),
             (1280, 900, 'en', True), (390, 844, 'fr', True)]
    results = []
    with sync_playwright() as pw:
        options = {'headless': True, 'args': ['--no-sandbox']}
        if args.browser_executable:
            options['executable_path'] = args.browser_executable
        browser = pw.chromium.launch(**options)
        try:
            for width, height, lang, fault in cases:
                context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
                page = context.new_page()
                page.set_default_timeout(12000)
                errors, faults = [], []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: faults.append(m.text) if m.type == 'error' and m.text.startswith('Race render loop failed') else None)
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1') else route.abort())
                name = f'race-{width}x{height}-{lang}-' + ('fault' if fault else 'lifecycle')
                record = {'name': name, 'passed': False, 'step': 'load', 'mediaRequired': args.require_art}
                try:
                    if args.offline_dir:
                        offline = Path(args.offline_dir)
                        page.set_content('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div></body></html>')
                        page.evaluate('''lang => {
                            window.__raceQaLang = lang;
                            const data = new Map();
                            Object.defineProperty(window, 'localStorage', {value: {
                                getItem: key => data.get(key) ?? null,
                                setItem: (key, value) => data.set(key, String(value)),
                                removeItem: key => data.delete(key)
                            }});
                        }''', lang)
                        page.add_style_tag(content=(offline / 'race.css').read_text())
                        page.add_script_tag(content=(offline / 'race.iife.js').read_text())
                    else:
                        page.goto(args.base + '/scripts/fixtures/race-lifecycle.html?lang=' + lang, wait_until='domcontentloaded')
                    page.locator('.race-pilot-option').click()
                    page.locator('.race-track-option').first.click()
                    page.get_by_role('button', name='VALIDER LA GRILLE' if lang == 'fr' else 'CONFIRM GRID', exact=True).click()
                    page.wait_for_function('window.__raceLifecycle?.engine')
                    if args.require_art:
                        page.wait_for_function('Object.values(window.__raceLifecycle.engine.images).every(i => i.complete && i.naturalWidth > 0)')
                        record['imagesLoaded'] = page.evaluate('Object.keys(window.__raceLifecycle.engine.images).length')
                    if fault:
                        record['step'] = 'renderer-failure'
                        page.evaluate('''() => {
                            const a=window.__raceLifecycle; a.staleFinish=a.engine.onFinish;
                            a.engine.draw=() => {throw new Error('Deliberate Race renderer failure for QA')};
                        }''')
                        expect(page.locator('[data-race-runtime-error]')).to_be_visible()
                        assert page.evaluate('window.__raceLifecycle.exits.length') == 0
                        assert page.evaluate('window.__raceLifecycle.collection.raceCareer.garageParts') == 300
                        assert page.evaluate('Object.keys(window.__raceLifecycle.engine.keys).length') == 0
                        page.screenshot(path=str(out / (name + '.png')))
                        previous = page.evaluate('window.__raceLifecycle.engines.length')
                        page.get_by_role('button', name='RECOMMENCER LA COURSE' if lang == 'fr' else 'RESTART RACE', exact=True).click()
                        page.wait_for_function('(n) => window.__raceLifecycle.engines.length > n', arg=previous)
                        expect(page.locator('[data-race-runtime-error]')).to_have_count(0)
                        assert len(faults) == 1 and 'Deliberate Race renderer failure' in faults[0]
                    else:
                        record['step'] = 'pause-and-parent-render'
                        page.locator('#qa-pause').click()
                        page.evaluate('''() => {
                            const a=window.__raceLifecycle,e=a.engine;
                            e.countdown=0; e.raceState='running'; e.time=17.25;
                            e.player.lap=1; e.player.item='shield';
                            a.staleFinish=e.onFinish;
                        }''')
                        paused = page.evaluate('window.__raceLifecycle.snapshot()')
                        page.locator('#qa-render').click()
                        page.wait_for_timeout(100)
                        assert page.evaluate('window.__raceLifecycle.snapshot()') == paused
                        page.locator('#qa-pause').click()
                        garage = page.get_by_role('button', name='GARAGE / COMMANDES' if lang == 'fr' else 'GARAGE / CONTROLS', exact=True)
                        garage.click()
                        record['step'] = 'garage-upgrade-without-reset'
                        before = page.evaluate('window.__raceLifecycle.snapshot()')
                        page.get_by_role('button', name='Noyau moteur' if lang == 'fr' else 'Engine core').click()
                        page.wait_for_function('window.__raceLifecycle.engine.garageUpgrades.engine === 1')
                        after = page.evaluate('window.__raceLifecycle.snapshot()')
                        for field in ['engine', 'resets', 'lap', 'time', 'x', 'y']:
                            assert after[field] == before[field], (field, before, after)
                        assert page.evaluate('window.__raceLifecycle.collection.raceCareer.garageParts') == 282
                        page.screenshot(path=str(out / (name + '-garage.png')))
                        page.keyboard.press('Escape')
                        expect(page.locator('.immersive-drawer')).to_have_count(0)
                        expect(garage).to_be_focused()
                        record['step'] = 'pointer-release-and-keyboard-activation'
                        left = page.get_by_role('button', name='GAUCHE' if lang == 'fr' else 'LEFT', exact=True)
                        box = left.bounding_box()
                        page.mouse.move(box['x']+box['width']/2, box['y']+box['height']/2)
                        page.mouse.down()
                        page.wait_for_function('window.__raceLifecycle.engine.keys.left === true')
                        page.mouse.move(5, 120)
                        page.mouse.up()
                        page.wait_for_function('!window.__raceLifecycle.engine.keys.left', timeout=250)
                        left.click()
                        page.wait_for_timeout(100)
                        assert not page.evaluate('Boolean(window.__raceLifecycle.engine.keys.left)')
                        left.focus()
                        page.keyboard.press('Enter')
                        page.wait_for_function('window.__raceLifecycle.engine.keys.left === true')
                        page.wait_for_function('!window.__raceLifecycle.engine.keys.left')
                        record['step'] = 'result-once-and-restart'
                        page.evaluate('window.__raceLifecycle.finish()')
                        expect(page.locator('.race-result-banner')).to_be_visible()
                        career = page.evaluate('window.__raceLifecycle.collection.raceCareer')
                        page.evaluate('window.__raceLifecycle.staleFinish(window.__raceLifecycle.engine.getRaceSummary())')
                        page.locator('#qa-render').click()
                        assert page.evaluate('window.__raceLifecycle.collection.raceCareer') == career
                        assert page.evaluate("window.__raceLifecycle.exits.filter(x=>x.reason==='completed').length") == 1
                        page.screenshot(path=str(out / (name + '-result.png')))
                        restart = page.locator('.race-result-banner').get_by_role('button', name='RELANCER' if lang == 'fr' else 'RESTART', exact=True)
                        previous = page.evaluate('window.__raceLifecycle.engines.length')
                        restart.click()
                        page.wait_for_function('(n) => window.__raceLifecycle.engines.length > n', arg=previous)
                        assert page.evaluate('window.__raceLifecycle.engine.player.lap') == 0
                        assert page.evaluate('window.__raceLifecycle.engine.garageUpgrades.engine') == 1
                        page.evaluate('window.__raceLifecycle.staleFinish(window.__raceLifecycle.engine.getRaceSummary())')
                        assert page.evaluate('window.__raceLifecycle.collection.raceCareer') == career
                        expect(page.locator('.race-result-banner')).to_have_count(0)
                        expect(page.locator('.race-hud-dock .race-cache-card > strong')).to_have_text('vide' if lang == 'fr' else 'empty')
                        if height > width:
                            telemetry = page.get_by_role('region', name='Telemetrie de course' if lang == 'fr' else 'Race telemetry')
                            assert telemetry.bounding_box()['width'] > width * 0.8
                            assert page.locator('.race-stat-grid strong').first.evaluate('(e) => parseFloat(getComputedStyle(e).fontSize)') >= 15
                            # Exercise enlarged HUD geometry without changing progress data.
                            page.locator('.hub-screen').evaluate("e => e.style.setProperty('--game-hud-scale', '1.2')")
                            assert telemetry.bounding_box()['x'] >= 0
                            assert telemetry.bounding_box()['x'] + telemetry.bounding_box()['width'] <= width
                        page.screenshot(path=str(out / (name + '-race.png')))
                    record['step'] = 'unmount-cancels-callback'
                    career = page.evaluate('window.__raceLifecycle.collection.raceCareer')
                    page.evaluate('() => { window.__raceLifecycle.staleFinish=window.__raceLifecycle.engine.onFinish; }')
                    page.locator('#qa-unmount').click()
                    expect(page.locator('.race-mode-shell')).to_have_count(0)
                    page.evaluate('window.__raceLifecycle.staleFinish(window.__raceLifecycle.engine.getRaceSummary())')
                    assert page.evaluate('window.__raceLifecycle.collection.raceCareer') == career
                    assert not errors, errors
                    record.update(passed=True, step='complete')
                    print('PASS', name, flush=True)
                except Exception as exc:
                    record.update(error=str(exc), pageErrors=errors, consoleFaults=faults)
                    page.screenshot(path=str(out / (name + '-FAILED.png')))
                    print('FAIL', name, record['step'], str(exc), flush=True)
                finally:
                    results.append(record)
                    context.close()
        finally:
            browser.close()
    report = {'scope': 'RaceMode + EngineRace; seeded career, synthetic completion/failure, no real account or physical controller. Offline mode has no artwork validation.',
              'results': results, 'passed': sum(r['passed'] for r in results), 'total': len(results)}
    (out / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    if report['passed'] != report['total']:
        raise SystemExit(1)


if __name__ == '__main__':
    run()
