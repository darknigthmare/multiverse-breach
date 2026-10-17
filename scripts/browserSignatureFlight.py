"""Real GameCanvas inputs with synthetic starts. Loopback only, no accounts."""
import json
import os
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright

base = os.environ.get('AUDIT_BASE_URL', 'http://127.0.0.1:4173')
assert urlparse(base).hostname in ('127.0.0.1', 'localhost')
out = Path(os.environ.get('AUDIT_OUTPUT_DIR', '/tmp/signature-flight-browser'))
out.mkdir(parents=True, exist_ok=True)
cases = [('city_hunter', 390, 'fr', False), ('city_hunter_p2', 1280, 'en', False),
         ('Predator::City Hunter Predator', 390, 'en', False), ('city_hunter', 1280, 'fr', True)]
results = []
with sync_playwright() as pw:
    options = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'):
        options['executable_path'] = os.environ['AUDIT_CHROMIUM_PATH']
    browser = pw.chromium.launch(**options)
    try:
        for key, width, lang, evade in cases:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost') else route.abort())
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            label = key.replace('::', '-').replace(' ', '-') + f'-{width}-{lang}-' + ('evade' if evade else 'hit')
            try:
                page.goto(base + '/scripts/fixtures/signature-source.html?' + urlencode({'mode': 'Smash', 'source': key, 'lang': lang}))
                page.wait_for_function('window.__sourceAudit?.engine?.signatureDirector?.getProjectileState', timeout=40000)
                page.evaluate('''() => {
                  const a=window.__sourceAudit,e=a.engine;
                  e.syncPreMatchFromServer(3000);e.completeMeleeIntros();
                  for(const u of [...e.heroes,...e.enemies])Object.assign(u,{state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:e.groundY});
                  e.heroes[0].x=200;e.heroes[0].facing=1;e.enemies[0].x=490;e.enemies[0].facing=-1;
                  a.actor=a.side==='player'?e.heroes[0]:e.enemies[0];a.target=a.side==='player'?e.enemies[0]:e.heroes[0];
                  a.actor.specialCharge=100;a.hp=a.target.currentHp;a.hits=[];
                  const apply=e.applyDamage;e.applyDamage=(...args)=>{if(args[0]===a.actor&&args[1]===a.target)a.hits.push(args[2]);return apply(...args);};
                }''')
                page.wait_for_timeout(200)
                side = 'opponent' if '::' in key else 'player'
                page.locator(f'[data-signature-super="{side}"]').click()
                page.wait_for_function('window.__sourceAudit.engine.signatureDirector.getProjectileState().length === 1')
                before = page.evaluate('''() => { const a=window.__sourceAudit;a.engine.setPaused(true);return {flights:a.engine.signatureDirector.getProjectileState(),hp:a.target.currentHp,initialHp:a.hp,charge:a.actor.specialCharge}; }''')
                assert before['hp'] == before['initialHp'] and before['charge'] == 0
                page.wait_for_timeout(200)
                assert page.evaluate('window.__sourceAudit.engine.signatureDirector.getProjectileState()') == before['flights']
                page.screenshot(path=str(out / (label + '-flight.png')), full_page=True)
                if evade:
                    page.evaluate('''() => {const a=window.__sourceAudit;a.target.y-=120;const physics=a.engine.applyPhysics;a.engine.applyPhysics=function(unit){if(unit===a.target)return;return physics.call(this,unit);};}''')
                page.evaluate('window.__sourceAudit.engine.setPaused(false)')
                page.wait_for_function('!window.__sourceAudit.engine.signatureDirector.busy && window.__sourceAudit.engine.signatureDirector.getProjectileState().length === 0', timeout=15000)
                after = page.evaluate('''() => {const a=window.__sourceAudit;a.engine.setPaused(true);return {hp:a.target.currentHp,hits:a.hits,charge:a.actor.specialCharge,pending:a.actor.actionPending};}''')
                assert len(after['hits']) == (0 if evade else 1)
                assert after['hp'] == before['hp'] if evade else after['hp'] < before['hp']
                assert not after['pending']
                page.screenshot(path=str(out / (label + '-result.png')), full_page=True)
                page.locator('#qa-unmount').click()
                assert page.evaluate('window.__sourceAudit.engine.disposed')
                assert not page.evaluate('window.__sourceAudit.engine.signatureDirector.getProjectileState().length')
                assert not errors, errors
                results.append({'case': label, 'ok': True, 'hits': len(after['hits']), 'flightAtPause': before['flights']})
            except Exception as error:
                page.screenshot(path=str(out / (label + '-FAILED.png')), full_page=True)
                results.append({'case': label, 'ok': False, 'error': str(error), 'pageErrors': errors})
            finally:
                context.close()
                (out / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    finally:
        browser.close()
print(json.dumps(results, indent=2))
assert len(results) == len(cases) and all(row['ok'] for row in results)
