"""Prepared combat state, real tactical UI and renderer; loopback only, no accounts."""
import argparse
import json
import os
import re
import traceback
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright, expect
from browserCombatUi import open_arsenal, close_arsenal


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/tactics-healing')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    allowed = ('localhost', '127.0.0.1', '::1')
    if urlparse(base).hostname not in allowed:
        raise ValueError('QA requires a loopback server')
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as p:
        options = {'headless': True}
        if os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE'):
            options['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']
        browser = p.chromium.launch(**options)
        try:
            for width, lang, side in [(1280, 'fr', 'hero'), (390, 'en', 'hero'), (1280, 'en', 'enemy'), (390, 'fr', 'enemy')]:
                name = f'tactics-healing-{width}-{lang}-{side}'; step = 'boot'; errors = []
                context = browser.new_context(viewport={'width': width, 'height': 920}, reduced_motion='reduce')
                page = context.new_page(); page.set_default_timeout(20000)
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in allowed else route.abort())
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Combat render loop failed' in m.text else None)
                try:
                    page.goto(base + '/scripts/fixtures/tactics-healing.html?' + urlencode({'lang': lang, 'side': side}), wait_until='domcontentloaded')
                    page.wait_for_function('window.__tacticsHealingAudit?.engine && !window.__tacticsHealingAudit.engine.disposed')
                    ability = page.locator('button.btn-special').filter(has_text=re.compile('HEALING WIND', re.I))
                    panel = page.get_by_role('region', name='Soutien tactique' if lang == 'fr' else 'Tactical support', include_hidden=True)
                    for kind in ('full', 'wall'):
                        step = kind; before = page.evaluate(f"window.__tacticsHealingAudit.prepare('{kind}')")
                        close_arsenal(page)
                        expect(ability).to_be_enabled(); ability.click()
                        open_arsenal(page)
                        expect(panel).to_contain_text('Aucune cible admissible' if lang == 'fr' else 'No eligible target')
                        assert panel.get_by_role('button').count() == 0
                        after = page.evaluate('window.__tacticsHealingAudit.snapshot()')
                        assert after['charge'] == 100 and after['turns'] == before['turns'] and after['hp'] == before['hp']
                    step = 'group and pause'; before = page.evaluate("window.__tacticsHealingAudit.prepare('wounded')")
                    close_arsenal(page)
                    expect(ability).to_be_enabled(); ability.click()
                    open_arsenal(page)
                    expect(panel).to_contain_text('50'); expect(panel).to_contain_text('5')
                    target = panel.get_by_role('button', include_hidden=True).first
                    expect(target).to_contain_text('3 ')
                    expect(target).to_contain_text('+220')
                    page.locator('#qa-pause').click(); expect(target).to_be_disabled()
                    paused = page.evaluate('window.__tacticsHealingAudit.snapshot()')
                    assert paused['hp'] == before['hp'] and paused['charge'] == 100
                    page.locator('#qa-pause').click(); open_arsenal(page); expect(target).to_be_enabled()
                    bounds = panel.bounding_box()
                    assert bounds and bounds['x'] >= -1 and bounds['x'] + bounds['width'] <= width + 1
                    page.screenshot(path=str(out / f'{name}-targets.png'), full_page=True)
                    target.evaluate('(button) => { button.click(); button.click(); }')
                    page.wait_for_function('JSON.stringify(window.__tacticsHealingAudit.snapshot().hp) === "[200,140,110]"')
                    healed = page.evaluate('window.__tacticsHealingAudit.snapshot()')
                    assert healed['charge'] == 0 and healed['enemyHP'] == before['enemyHP'] and healed['turns'] == before['turns'] + 1
                    step = 'radiation and dead ally'; before = page.evaluate("window.__tacticsHealingAudit.prepare('radiation')")
                    close_arsenal(page)
                    expect(ability).to_be_enabled(); ability.click()
                    open_arsenal(page)
                    target = panel.get_by_role('button').first; expect(target).to_contain_text('+10'); target.click()
                    page.wait_for_function('JSON.stringify(window.__tacticsHealingAudit.snapshot().hp) === "[200,100,0]"')
                    page.screenshot(path=str(out / f'{name}-resolved.png'), full_page=True)
                    step = 'dispose'; page.locator('#qa-unmount').click()
                    page.wait_for_function('window.__tacticsHealingAudit.engine.disposed')
                    final = page.evaluate('window.__tacticsHealingAudit.snapshot()')
                    assert final['storageIntact'] and final['sourceIntact'] and final['resultCount'] == 0
                    assert final['identity'] == 'aerith_ff7' and final['name'] == 'Healing Wind'
                    assert page.evaluate('window.__tacticsHealingAudit.engine.timers.size') == 0
                    assert not errors, errors
                    results.append({'name': name, 'passed': True, 'state': final})
                except Exception as exc:
                    record = {'name': name, 'passed': False, 'step': step, 'error': str(exc), 'traceback': traceback.format_exc(), 'errors': errors}
                    results.append(record)
                    try:
                        page.screenshot(path=str(out / f'{name}-FAILED.png'), full_page=True, timeout=5000)
                    except Exception as capture_error:
                        record['captureError'] = str(capture_error)
                finally:
                    context.close()
                    (out / 'results.json').write_text(json.dumps({'cases': results, 'passed': sum(r['passed'] for r in results), 'total': len(results)}, indent=2, ensure_ascii=False), encoding='utf8')
        finally:
            browser.close()
    print(json.dumps(results, indent=2, ensure_ascii=False))
    if len(results) != 4 or not all(r['passed'] for r in results):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
