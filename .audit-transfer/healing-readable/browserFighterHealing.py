"""Real FighterMode controls, isolated starting state; no saved account or art certification."""
import argparse
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://127.0.0.1:4173')
parser.add_argument('--evidence', required=True)
args = parser.parse_args()
assert urlparse(args.base).hostname in ('127.0.0.1', 'localhost')
out = Path(args.evidence)
out.mkdir(parents=True, exist_ok=True)
cases = [(1280, 'fr', 'player'), (390, 'en', 'player'), (1280, 'en', 'cpu'), (390, 'fr', 'cpu')]
results = []
with sync_playwright() as pw:
    options = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'):
        options['executable_path'] = os.environ['AUDIT_CHROMIUM_PATH']
    browser = pw.chromium.launch(**options)
    try:
        for width, lang, side in cases:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            page = context.new_page()
            page.set_default_timeout(15000)
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and m.text.startswith('Fighter render loop failed') else None)
            page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost') else route.abort())
            name = f'healing-{width}-{lang}-{side}'
            result = {'case': name, 'passed': False, 'step': 'load'}
            try:
                page.goto(args.base + f'/scripts/fixtures/fighter-lifecycle.html?scenario=healing&lang={lang}', wait_until='domcontentloaded')
                page.wait_for_function('window.__fighterLifecycle?.engine && !window.__fighterLifecycle.engine.disposed')
                prepared = page.evaluate('(side)=>window.__fighterLifecycle.prepare(side)', side)
                assert prepared['source'] == 'aerith_ff7'
                key = 'R' if side == 'player' else 'O'
                button = page.locator('.fighter-touch-controls button').filter(has_text=re.compile('^' + key + '$'))
                result['step'] = 'full-team-refusal'
                expect(button).to_be_disabled()
                page.keyboard.press(key.lower())
                assert page.evaluate('(side)=>window.__fighterLifecycle.engine.getActive(side).meter', side) == 100
                # Only prepare injuries before the tested command. No action,
                # target, resource or timer is rewritten during its resolution.
                expected = page.evaluate('''(side)=>{
                  const e=window.__fighterLifecycle.engine, a=e.getActive(side);
                  a.currentHp-=40; e.getTeam(side).fighters[1].currentHp-=40;
                  return {enemy:e.getOpponent(side).currentHp,stats:JSON.stringify(e.stats),storage:JSON.stringify(Object.entries(localStorage))};
                }''', side)
                expect(button).to_be_enabled()
                assert 'Healing Wind' in button.get_attribute('title')
                result['step'] = 'pause-refusal'
                page.locator('#qa-pause').click()
                page.wait_for_function('window.__fighterLifecycle.engine.paused')
                expect(button).to_be_disabled()
                page.keyboard.press(key.lower())
                assert page.evaluate('(side)=>window.__fighterLifecycle.engine.getActive(side).meter', side) == 100
                page.locator('#qa-pause').click()
                expect(button).to_be_enabled()
                result['step'] = 'native-command'
                if width == 390:
                    button.click()
                else:
                    page.keyboard.press(key.lower())
                page.wait_for_function('(side)=>{const e=window.__fighterLifecycle.engine;return e.getActive(side).currentHp===e.getActive(side).maxHp;}', arg=side)
                expect(button).to_be_disabled()
                assert page.evaluate('(side)=>window.__fighterLifecycle.engine.getActive(side).meter', side) == 0
                assert page.evaluate('(side)=>window.__fighterLifecycle.engine.getOpponent(side).currentHp', side) == expected['enemy']
                assert page.evaluate('JSON.stringify(window.__fighterLifecycle.engine.stats)') == expected['stats']
                assert page.evaluate('JSON.stringify(Object.entries(localStorage))') == expected['storage']
                assert page.evaluate('(side)=>window.__fighterLifecycle.engine.getTeam(side).fighters.every(a=>a.currentHp===a.maxHp)', side)
                assert not errors, errors
                page.screenshot(path=str(out / (name + '.png')), full_page=True)
                page.locator('#qa-unmount').click()
                page.wait_for_function('window.__fighterLifecycle.engine.disposed')
                assert page.evaluate('window.__fighterLifecycle.results.length') == 0
                result['passed'] = True
            except Exception as exc:
                result.update(error=str(exc), pageErrors=errors)
                try:
                    page.screenshot(path=str(out / (name + '-FAILED.png')), full_page=True, timeout=5000)
                except Exception as capture:
                    result['captureError'] = str(capture)
            finally:
                results.append(result)
                context.close()
                (out / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
                print(json.dumps(result), flush=True)
    finally:
        browser.close()
assert len(results) == len(cases) and all(r['passed'] for r in results)
