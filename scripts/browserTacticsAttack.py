"""Native tactical AI windups in real GameCanvas. Synthetic state; loopback only."""
import argparse
import json
import os
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/tactics-attack')
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
                name = f'tactics-attack-{width}-{lang}-{side}'
                context = browser.new_context(viewport={'width': width, 'height': 920}, reduced_motion='reduce')
                page = context.new_page(); page.set_default_timeout(15000)
                errors = []; step = 'boot'; checks = []
                page.route('**/*', lambda r: r.continue_() if urlparse(r.request.url).hostname in allowed else r.abort())
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'Combat render loop failed' in m.text else None)
                try:
                    page.goto(base + '/scripts/fixtures/tactics-attack.html?' + urlencode({'side': side, 'lang': lang}))
                    # Let the real component render once before entering pause.
                    # A session born paused never calls update(), our observation point.
                    page.wait_for_function('window.__tacticsAttackAudit?.engine && !window.__tacticsAttackAudit.engine.disposed')
                    page.locator('#qa-pause').click()
                    page.wait_for_function('window.__tacticsAttackAudit.engine.paused')
                    for kind in ['valid', 'revived', 'skill', 'blocked']:
                        step = kind
                        before = page.evaluate('(kind) => window.__tacticsAttackAudit.prepare(kind)', kind)
                        assert before['paused'] and before['pending']
                        page.wait_for_timeout(120)
                        assert page.evaluate('window.__tacticsAttackAudit.snapshot()') == before
                        page.locator('#qa-pause').click()
                        page.wait_for_function('(turns) => window.__tacticsAttackAudit.snapshot().turns === turns + 1', arg=before['turns'])
                        page.locator('#qa-pause').click()
                        after = page.evaluate('window.__tacticsAttackAudit.snapshot()')
                        assert after['paused'] and after['turns'] == before['turns'] + 1
                        if kind == 'valid':
                            assert after['hp'] < before['hp']
                        else:
                            assert after['hp'] == before['hp'] and after['meter'] == before['meter']
                        assert after['storageIntact'] and after['resultCount'] == 0
                        checks.append({'kind': kind, 'beforeHP': before['hp'], 'afterHP': after['hp']})
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
                    page.screenshot(path=str(out / f'{name}.png'), full_page=True)
                    step = 'dispose'; page.locator('#qa-unmount').click()
                    page.wait_for_function('window.__tacticsAttackAudit.engine.disposed')
                    assert page.evaluate('window.__tacticsAttackAudit.engine.timers.size') == 0
                    assert not errors, errors
                    results.append({'name': name, 'passed': True, 'checks': checks})
                except Exception as error:
                    failure = {'name': name, 'passed': False, 'step': step, 'error': str(error), 'errors': errors, 'checks': checks}
                    results.append(failure)
                    try:
                        failure['state'] = page.evaluate('window.__tacticsAttackAudit?.snapshot()')
                    except Exception as state_error:
                        failure['stateError'] = str(state_error)
                    try:
                        page.screenshot(path=str(out / f'{name}-FAILED.png'), full_page=True, timeout=5000)
                    except Exception as capture_error:
                        failure['captureError'] = str(capture_error)
                finally:
                    context.close()
                    (out / 'results.json').write_text(json.dumps({'cases': results, 'passed': sum(r['passed'] for r in results), 'total': len(results)}, indent=2), encoding='utf8')
        finally:
            browser.close()
    print(json.dumps(results, indent=2))
    if len(results) != 4 or not all(r['passed'] for r in results):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
