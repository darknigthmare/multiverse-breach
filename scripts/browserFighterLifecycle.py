"""Real Fighter UI lifecycle. Synthetic setup; no campaign, account or art approval."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', required=True)
    args = parser.parse_args()
    assert urlparse(args.base).hostname in ('127.0.0.1', 'localhost')
    out = Path(args.evidence)
    out.mkdir(parents=True, exist_ok=True)
    cases = [(1280, 'fr', 'player', False), (390, 'en', 'player', False),
             (1280, 'en', 'cpu', False), (390, 'fr', 'cpu', False),
             (1280, 'fr', 'player', True), (390, 'en', 'cpu', True)]
    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
        try:
            for width, lang, side, fault in cases:
                context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
                page = context.new_page()
                page.set_default_timeout(20000)
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: errors.append(m.text) if m.type == 'error' and m.text.startswith('Fighter render loop failed') else None)
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1') else route.abort())
                name = f'fighter-{width}-{lang}-{side}-' + ('injected-error' if fault else 'lifecycle')
                record = {'name': name, 'passed': False, 'step': 'load'}
                try:
                    page.goto(args.base + f'/scripts/fixtures/fighter-lifecycle.html?lang={lang}', wait_until='domcontentloaded')
                    page.wait_for_function('window.__fighterLifecycle?.engine && !window.__fighterLifecycle.engine.disposed')
                    page.evaluate('window.__fighterLifecycle.prepare()')
                    if fault:
                        old_count = page.evaluate('window.__fighterLifecycle.engines.length')
                        page.evaluate('window.__fighterLifecycle.injectDrawFailure()')
                        expect(page.locator('[data-fighter-runtime-error]')).to_be_visible()
                        assert page.evaluate('window.__fighterLifecycle.engine.disposed')
                        assert page.evaluate('window.__fighterLifecycle.results.length') == 0
                        assert page.evaluate("window.__fighterLifecycle.exits.filter(x => x.reason === 'error').length") == 1
                        assert len(errors) == 1 and 'Deliberate Fighter renderer failure for QA' in errors[0], errors
                        page.screenshot(path=str(out / (name + '.png')), full_page=True)
                        page.get_by_role('button', name='RECOMMENCER LE COMBAT' if lang == 'fr' else 'RESTART FIGHT', exact=True).click()
                        page.wait_for_function('(n)=>window.__fighterLifecycle.engines.length > n && !window.__fighterLifecycle.engine.disposed', arg=old_count)
                        expect(page.locator('[data-fighter-runtime-error]')).to_have_count(0)
                        assert page.evaluate('window.__fighterLifecycle.results.length') == 0
                        page.locator('#qa-unmount').click()
                        page.wait_for_function('window.__fighterLifecycle.engine.disposed')
                    else:
                        record['step'] = 'manifestation'
                        prepared = page.evaluate('(side)=>window.__fighterLifecycle.prepare(side)', side)
                        assert prepared['source'] == 'team_fortress_2_medic'
                        page.keyboard.press('r' if side == 'player' else 'o')
                        page.wait_for_function('(side)=>{const e=window.__fighterLifecycle.engine;return e.medicSupport.protects(e.getActive(side));}', arg=side)
                        assert page.evaluate('(side)=>window.__fighterLifecycle.engine.getOpponent(side).currentHp', side) == prepared['targetHp']
                        record['step'] = 'pause-and-visibility'
                        page.locator('#qa-pause').click()
                        page.wait_for_function('window.__fighterLifecycle.engine.paused')
                        paused = page.evaluate('window.__fighterLifecycle.snapshot()')
                        for button in page.locator('.fighter-lineup button').all():
                            expect(button).to_be_disabled()
                        page.keyboard.press('g' if side == 'player' else 'm')
                        page.wait_for_timeout(250)
                        assert page.evaluate('window.__fighterLifecycle.snapshot()') == paused
                        # Hiding and restoring visibility must not override an explicit pause.
                        page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))")
                        page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
                        assert page.evaluate('window.__fighterLifecycle.engine.paused')
                        page.locator('#qa-pause').click()
                        page.wait_for_function('!window.__fighterLifecycle.engine.paused')
                        record['step'] = 'wait-for-legal-tag'
                        # Manifestation is not the end of the super's recovery.
                        # Wait for the real command gate; never reset its action.
                        page.wait_for_function('(side)=>{const e=window.__fighterLifecycle.engine;return e.canAct(e.getActive(side));}', arg=side)
                        guard_key = 'e' if side == 'player' else 'u'
                        page.keyboard.down(guard_key)
                        page.wait_for_function('(side)=>window.__fighterLifecycle.engine.getActive(side).guarding', arg=side)
                        record['step'] = 'tag-clears-held-controls'
                        expect(page.locator('.fighter-lineup-' + side + ' button').nth(1)).to_be_enabled()
                        page.keyboard.press('2' if side == 'player' else '8')
                        page.wait_for_function('(side)=>window.__fighterLifecycle.engine.getTeam(side).activeIndex === 1', arg=side)
                        assert page.evaluate('window.__fighterLifecycle.engine.medicSupport.snapshot().length') == 0
                        page.wait_for_function('(side)=>{const e=window.__fighterLifecycle.engine,a=e.getActive(side);return !e.inputs[side].guard && !a.guarding && !a.crouching;}', arg=side)
                        page.keyboard.up(guard_key)
                        record['step'] = 'effective-damage'
                        prepared = page.evaluate('(side)=>window.__fighterLifecycle.prepare(side,true)', side)
                        page.keyboard.press('g' if side == 'player' else 'm')
                        page.wait_for_function('(side)=>window.__fighterLifecycle.engine.getOpponent(side).currentHp === 0', arg=side)
                        actual = page.evaluate('(side)=>{const e=window.__fighterLifecycle.engine;return {damage:e.stats[side].damage,meter:e.getActive(side).meter};}', side)
                        assert abs(actual['damage'] - prepared['damage'] - 1) < 1e-8
                        assert actual['meter'] < 2
                        assert not errors, errors
                        page.screenshot(path=str(out / (name + '.png')), full_page=True)
                        # Finish prepares a report, but abandonment must cancel its delayed delivery.
                        page.evaluate('window.__fighterLifecycle.engine.finish("victory")')
                        page.locator('#qa-unmount').click()
                        page.wait_for_function('window.__fighterLifecycle.engine.disposed')
                        page.wait_for_timeout(1200)
                        assert page.evaluate('window.__fighterLifecycle.results.length') == 0
                        assert page.evaluate('window.__fighterLifecycle.engine.projectiles.length') == 0
                        assert page.evaluate('window.__fighterLifecycle.engine.medicSupport.snapshot().length') == 0
                    record['passed'] = True
                    record['intentionalFault'] = fault
                    print('PASS', name, flush=True)
                except Exception as exc:
                    record.update({'error': str(exc), 'pageErrors': errors})
                    try:
                        record['engineState'] = page.evaluate('(()=>{const e=window.__fighterLifecycle?.engine;return e?{paused:e.paused,disposed:e.disposed,hitStop:e.hitStop,countdown:e.countdown,active:[e.teams.player.activeIndex,e.teams.cpu.activeIndex],actions:[e.getActive("player").action,e.getActive("cpu").action],inputs:e.inputs}:null;})()')
                    except Exception as diagnostic:
                        record['diagnosticError'] = str(diagnostic)
                    try:
                        page.screenshot(path=str(out / (name + '-FAILED.png')), full_page=True, timeout=5000)
                    except Exception as capture:
                        record['captureError'] = str(capture)
                    print('FAIL', name, str(exc), flush=True)
                finally:
                    results.append(record)
                    context.close()
                    (out / 'results.json').write_text(json.dumps({'cases': results}, indent=2), encoding='utf-8')
        finally:
            browser.close()
    report = {'scope': 'Real FighterMode and EngineFighter with synthetic initial states; two cases deliberately throw in the renderer.',
              'passed': sum(case['passed'] for case in results), 'total': len(cases), 'cases': results}
    (out / 'results.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    assert report['passed'] == report['total'], report


if __name__ == '__main__':
    run()
