"""Native Fighter direct-fire controls, isolated initial state; no account writes."""
import argparse
import json
import os
import re
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright, expect
parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://127.0.0.1:4173')
parser.add_argument('--evidence', required=True)
args = parser.parse_args()
assert urlparse(args.base).hostname in ('127.0.0.1', 'localhost')
out = Path(args.evidence)
out.mkdir(parents=True, exist_ok=True)
cases = [(1280, 'fr', 'player', 'barret_ff7'), (390, 'en', 'cpu', 'irvine_ff8'),
         (390, 'fr', 'player', 'goku_dbz'), (1280, 'en', 'cpu', 'vortigaunt_ally'),
         (1280, 'fr', 'cpu', 'team_fortress_2_scout'), (390, 'en', 'player', 'quake_franchise_ranger')]
results = []
with sync_playwright() as pw:
    opts = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'):
        opts['executable_path'] = os.environ['AUDIT_CHROMIUM_PATH']
    browser = pw.chromium.launch(**opts)
    try:
        for width, lang, side, actor in cases:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            page = context.new_page()
            page.set_default_timeout(15000)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and m.text.startswith('Fighter render loop failed') else None)
            page.route('**/*', lambda r: r.continue_() if urlparse(r.request.url).hostname in ('127.0.0.1', 'localhost') else r.abort())
            name = f'ranged-{actor}-{width}-{lang}-{side}'
            result = {'case': name, 'passed': False, 'step': 'load'}
            try:
                page.goto(args.base + '/scripts/fixtures/fighter-ranged.html?' + urlencode({'actor': actor, 'lang': lang}))
                page.wait_for_function('window.__fighterRanged?.engine?.paused')
                initial = page.evaluate('side => window.__fighterRanged.prepare(side, "far")', side)
                assert initial['id'] == actor
                key = 'R' if side == 'player' else 'O'
                button = page.locator('.fighter-touch-controls button').filter(has_text=re.compile('^' + key + '$'))
                result['step'] = 'out-of-range-refusal'
                page.locator('#qa-pause').click()
                page.wait_for_function('!window.__fighterRanged.engine.paused')
                expect(button).to_be_disabled()
                page.keyboard.press(key.lower())
                assert page.evaluate('side => window.__fighterRanged.engine.getActive(side).meter', side) == 100
                assert page.evaluate('window.__fighterRanged.hits.length') == 0
                page.locator('#qa-pause').click()
                page.wait_for_function('window.__fighterRanged.engine.paused')
                initial = page.evaluate('side => window.__fighterRanged.prepare(side)', side)
                expect(button).to_be_disabled()
                page.locator('#qa-pause').click()
                expect(button).to_be_enabled()
                assert initial['name'] in button.get_attribute('title')
                result['step'] = 'native-direct-fire-command'
                if width == 390:
                    button.click()
                else:
                    page.keyboard.press(key.lower())
                page.wait_for_function('side => window.__fighterRanged.engine.getActive(side).action?.meleeSignature?.delivery === "ranged"', arg=side)
                page.locator('#qa-pause').click()
                page.wait_for_function('window.__fighterRanged.engine.paused')
                snapshot = 'side => {const q=window.__fighterRanged,e=q.engine;return {elapsed:e.getActive(side).action?.elapsed,hp:e.getOpponent(side).currentHp,hits:q.hits.length};}'
                frozen = page.evaluate(snapshot, side)
                page.wait_for_timeout(200)
                assert page.evaluate(snapshot, side) == frozen
                expect(button).to_be_disabled()
                page.locator('#qa-pause').click()
                page.wait_for_function('side => {const e=window.__fighterRanged.engine;return !e.getActive(side).action && e.hitStop<=0;}', arg=side)
                hits = page.evaluate('window.__fighterRanged.hits')
                assert len(hits) == initial['hits'], hits
                assert [h['index'] for h in hits] == list(range(initial['hits']))
                assert all(h['side'] == side for h in hits)
                if len(hits) > 1:
                    assert hits[-1]['elapsed'] - hits[0]['elapsed'] >= (len(hits)-1) * initial['gap'] - .04
                hp = page.evaluate('side => window.__fighterRanged.engine.getOpponent(side).currentHp', side)
                score = page.evaluate('side => window.__fighterRanged.engine.stats[side].damage', side)
                assert abs(initial['hp'] - hp - sum(h['damage'] for h in hits)) < .001
                assert abs(score - initial['score'] - sum(h['damage'] for h in hits)) < .001
                result['contacts'] = len(hits)
                page.screenshot(path=str(out / (name + '.png')), full_page=True)
                result['step'] = 'native-retreat-before-impact'
                page.locator('#qa-pause').click()
                page.wait_for_function('window.__fighterRanged.engine.paused')
                initial = page.evaluate('side => window.__fighterRanged.prepare(side, "edge")', side)
                page.locator('#qa-pause').click()
                expect(button).to_be_enabled()
                page.keyboard.press(key.lower())
                retreat = 'ArrowRight' if side == 'player' else 'd'
                page.keyboard.down(retreat)
                page.wait_for_function('([side,range]) => Math.abs(window.__fighterRanged.engine.getOpponent(side).x-window.__fighterRanged.engine.getActive(side).x)>range', arg=[side, initial['range']])
                page.keyboard.up(retreat)
                page.wait_for_function('side => !window.__fighterRanged.engine.getActive(side).action', arg=side)
                assert page.evaluate('window.__fighterRanged.hits.length') == 0
                assert page.evaluate('side => window.__fighterRanged.engine.getOpponent(side).currentHp', side) == initial['hp']
                assert page.evaluate('JSON.stringify(Object.entries(localStorage))') == initial['storage']
                assert not errors, errors
                page.locator('#qa-unmount').click()
                page.wait_for_function('window.__fighterRanged.engine.disposed')
                assert page.evaluate('window.__fighterRanged.results.length') == 0
                result['passed'] = True
            except Exception as error:
                result.update(error=str(error), pageErrors=errors)
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
