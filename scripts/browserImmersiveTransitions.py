"""Exercise real React scenes/native dialogs with synthetic data, not real artwork QA."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', required=True)
    parser.add_argument('--executable', default=None, help='Optional locally installed Chromium')
    parser.add_argument('--only', choices=['all', 'fighter', 'drawer'], default='all')
    args = parser.parse_args()
    assert urlparse(args.base).hostname in ('127.0.0.1', 'localhost'), 'Local fixtures only'
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    sizes = [(1280, 900, 'fr'), (390, 844, 'en'), (844, 390, 'fr'), (2560, 1080, 'en')]
    cases = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=args.executable, args=['--no-sandbox'])
        try:
            for kind in ['fighter', 'drawer']:
                if args.only not in ['all', kind]:
                    continue
                for width, height, lang in sizes:
                    record = {'name': f'{kind}-{width}x{height}-{lang}', 'passed': False, 'step': 'load'}
                    context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
                    page = context.new_page(); page.set_default_timeout(15000)
                    errors = []
                    page.on('pageerror', lambda e: errors.append(str(e)))
                    page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1') else route.abort())
                    try:
                        if kind == 'fighter':
                            page.goto(args.base + f'/scripts/fixtures/fighter-lifecycle.html?lang={lang}&rerender=1', wait_until='domcontentloaded')
                            page.wait_for_function('window.__fighterLifecycle?.engine && !window.__fighterLifecycle.engine.disposed')
                            page.evaluate('''() => {
                              const a=window.__fighterLifecycle; a.prepare();
                              a.originalEngine=a.engine; a.originalCount=a.engines.length;
                              a.engine.getActive('player').currentHp=73;
                              a.engine.getActive('player').meter=45;
                              a.engine.timer=71; a.engine.elapsed=28;
                            }''')
                            record['step'] = 'parent-render-preserves-match'
                            page.locator('#qa-rerender').click()
                            page.wait_for_timeout(160)
                            assert page.evaluate('window.__fighterLifecycle.engine === window.__fighterLifecycle.originalEngine'), 'Parent render restarted the match'
                            assert page.evaluate("window.__fighterLifecycle.engine.getActive('player').currentHp") == 73
                            assert page.evaluate('window.__fighterLifecycle.engine.timer') <= 71
                            record['step'] = 'pause-preserves-state-and-engine'
                            page.locator('#qa-pause').click()
                            page.wait_for_function('window.__fighterLifecycle.engine.paused')
                            frozen = page.evaluate('window.__fighterLifecycle.snapshot()')
                            page.locator('#qa-rerender').click()
                            page.wait_for_timeout(250)
                            assert page.evaluate('window.__fighterLifecycle.snapshot()') == frozen
                            assert page.evaluate('window.__fighterLifecycle.engine === window.__fighterLifecycle.originalEngine')
                            page.locator('#qa-pause').click()
                            page.wait_for_function('!window.__fighterLifecycle.engine.paused')
                            assert page.evaluate('window.__fighterLifecycle.engine === window.__fighterLifecycle.originalEngine')
                            record['step'] = 'paused-display-panel'
                            page.get_by_role('button', name='COMMANDES' if lang == 'fr' else 'CONTROLS', exact=True).click()
                            expect(page.locator('dialog[open].is-paused')).to_be_visible()
                            assert page.locator('dialog:modal').count() == 1
                            page.wait_for_function('window.__fighterLifecycle.engine.paused')
                            panel_state = page.evaluate('window.__fighterLifecycle.snapshot()')
                            hud = page.get_by_label('Taille du HUD' if lang == 'fr' else 'HUD size', exact=False)
                            text = page.get_by_label('Taille du texte' if lang == 'fr' else 'Text size', exact=False)
                            hud.press('Home')
                            for _ in range(6):
                                hud.press('ArrowRight')
                            text.press('Home')
                            for _ in range(5):
                                text.press('ArrowRight')
                            expect(hud).to_have_value('1.2')
                            expect(text).to_have_value('1.25')
                            page.wait_for_timeout(160)
                            assert page.evaluate('window.__fighterLifecycle.snapshot()') == panel_state
                            page.keyboard.press('Escape')
                            expect(page.locator('dialog[open]')).to_have_count(0)
                            page.wait_for_function('!window.__fighterLifecycle.engine.paused')
                            assert page.evaluate('window.__fighterLifecycle.engine === window.__fighterLifecycle.originalEngine')
                            record['step'] = 'staged-config-and-result-parent-update'
                            page.locator('#qa-expert').click()
                            assert page.evaluate('window.__fighterLifecycle.engine.difficultyId') == 'training'
                            page.evaluate('window.__fighterLifecycle.engine.finish("victory")')
                            expect(page.locator('.combat-result-dialog[open]')).to_be_visible()
                            assert page.evaluate('window.__fighterLifecycle.results.length') == 1
                            assert page.evaluate('window.__fighterLifecycle.engine === window.__fighterLifecycle.originalEngine')
                            page.wait_for_timeout(250)
                            page.keyboard.press('Escape')
                            expect(page.locator('.combat-result-dialog[open]')).to_be_visible()
                            assert page.evaluate('window.__fighterLifecycle.results.length') == 1
                            page.screenshot(path=str(out / (record['name'] + '-result.png')))
                            record['step'] = 'explicit-rematch-uses-latest-config'
                            page.get_by_role('button', name='REVANCHE' if lang == 'fr' else 'REMATCH', exact=True).click()
                            page.wait_for_function('window.__fighterLifecycle.engine !== window.__fighterLifecycle.originalEngine')
                            assert page.evaluate('window.__fighterLifecycle.engine.difficultyId') == 'expert'
                            assert page.evaluate('window.__fighterLifecycle.engines.length === window.__fighterLifecycle.originalCount + 1')
                            expect(page.locator('.combat-result-dialog[open]')).to_have_count(0)
                            assert page.evaluate('window.__fighterLifecycle.results.length') == 1
                            page.locator('#qa-unmount').click()
                            page.wait_for_function('window.__fighterLifecycle.engine.disposed')
                        else:
                            page.goto(args.base + '/scripts/fixtures/combat-drawer.html', wait_until='domcontentloaded')
                            page.locator('#drawer-launcher').click()
                            expect(page.locator('dialog[open]')).to_be_visible()
                            assert page.locator('dialog:modal').count() == 0
                            record['step'] = 'live-to-native-modal'
                            page.locator('#switch-mode').click()
                            assert page.locator('dialog:modal').count() == 1, 'Settings is visually paused but not a native modal'
                            expect(page.locator('[data-drawer-close]')).to_be_focused()
                            page.locator('#drawer-input').fill('retained')
                            record['step'] = 'modal-back-to-live'
                            page.locator('#switch-mode').click()
                            assert page.locator('dialog:modal').count() == 0
                            expect(page.locator('#drawer-input')).to_have_value('retained')
                            page.keyboard.press('Escape')
                            expect(page.locator('dialog[open]')).to_have_count(0)
                            expect(page.locator('#drawer-launcher')).to_be_focused()
                            assert page.evaluate('window.__drawerTransitions.closes') == 1
                            assert page.evaluate('window.__drawerTransitions.escapedToParent') == 0
                            record['step'] = 'unmount-restores-focus'
                            page.locator('#drawer-launcher').click(); page.locator('#switch-mode').click()
                            page.screenshot(path=str(out / (record['name'] + '-modal.png')))
                            page.locator('#drawer-unmount').click()
                            expect(page.locator('dialog')).to_have_count(0)
                            expect(page.locator('#drawer-launcher')).to_be_focused()
                            page.locator('#drawer-launcher').click()
                            expect(page.locator('dialog[open]')).to_be_visible()
                            page.keyboard.press('Escape')
                            expect(page.locator('#drawer-launcher')).to_be_focused()
                            assert page.evaluate('window.__drawerTransitions.closes') == 2
                        assert not errors, errors
                        record.update({'passed': True, 'step': 'complete'})
                        print('PASS', record['name'], flush=True)
                    except Exception as exc:
                        record.update({'error': str(exc), 'pageErrors': errors})
                        try:
                            page.screenshot(path=str(out / (record['name'] + '-FAILED.png')), timeout=5000)
                        except Exception as capture:
                            record['captureError'] = str(capture)
                        print('FAIL', record['name'], record['step'], str(exc), flush=True)
                    finally:
                        cases.append(record); context.close()
                        (out / 'results.json').write_text(json.dumps({'cases': cases}, indent=2), encoding='utf-8')
        finally:
            browser.close()
    report = {'scope': 'Real React FighterMode/CombatDrawer; cloned parent props and synthetic combat states. No cloud, campaign rewards, physical input or artwork validation.',
              'passed': sum(case['passed'] for case in cases), 'total': len(cases), 'cases': cases}
    (out / 'results.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    assert report['passed'] == report['total'], report


if __name__ == '__main__':
    run()
