"""Real Chromium UI; isolated synthetic fixtures, no accounts or external writes."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE = os.environ.get('AUDIT_BASE_URL', 'http://127.0.0.1:4173')
OUT = Path(os.environ.get('AUDIT_OUTPUT_DIR', 'audit/signature-browser')); OUT.mkdir(parents=True, exist_ok=True)
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_PATH') or None, args=['--no-sandbox'])
    try:
        for mode in ['RPG', 'Smash']:
            for width, lang in [(1280, 'en'), (390, 'fr')]:
                page = browser.new_page(viewport={'width': width, 'height': 920}, reduced_motion='reduce')
                page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(BASE + '/') else route.abort())
                errors = []; page.on('pageerror', lambda err: errors.append(str(err)))
                name = f'{mode}-{width}-{lang}'
                try:
                    page.goto(f'{BASE}/scripts/fixtures/signature-combat.html?mode={mode}&lang={lang}')
                    page.wait_for_function('window.__signatureAudit?.engine?.signatureDirector')
                    page.evaluate('''() => { const e=window.__signatureAudit.engine; const a=e.heroes[0];
                      e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();a.state='idle';a.action=null;a.atb=100;a.specialCharge=100;
                      if(e.stage.mode==='Smash'){a.x=200;e.enemies[0].x=240;a.y=e.enemies[0].y;a.facing=1;}
                      window.__beforeHp=e.enemies[0].currentHp;
                    }''')
                    # Substring matching uses explicit regex rather than an exact localization.
                    button = page.locator('[data-signature-invocation]' if mode == 'RPG' else '[data-signature-super=player]').first
                    button.scroll_into_view_if_needed(); button.click()
                    page.wait_for_function('window.__signatureAudit.engine.signatureDirector.busy')
                    page.evaluate('window.__signatureAudit.engine.paused=true')
                    snapshot = page.evaluate('window.__signatureAudit.engine.signatureDirector.snapshot()')
                    page.wait_for_timeout(120)
                    assert page.evaluate('window.__signatureAudit.engine.signatureDirector.snapshot().tick') == snapshot['tick']
                    page.screenshot(path=str(OUT / f'{name}-sequence.png'), full_page=True)
                    page.evaluate('window.__signatureAudit.engine.paused=false')
                    page.wait_for_function('!window.__signatureAudit.engine.signatureDirector.busy', timeout=10000)
                    assert page.evaluate('window.__signatureAudit.engine.enemies[0].currentHp < window.__beforeHp')
                    if mode == 'RPG':
                        assert button.is_disabled(), 'Invocation usage was not latched'
                    page.locator('#qa-unmount').click()
                    assert page.evaluate('!window.__signatureAudit.engine.signatureDirector.busy')
                    assert not errors, errors
                    results.append({'scenario': name, 'passed': True, 'errors': errors})
                except Exception as error:
                    page.screenshot(path=str(OUT / f'{name}-FAILED.png'), full_page=True)
                    results.append({'scenario': name, 'passed': False, 'error': str(error), 'pageErrors': errors})
                finally: page.close()
    finally: browser.close()
(OUT / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print(json.dumps(results, indent=2))
raise SystemExit(0 if results and all(r['passed'] for r in results) else 1)
