"""Real GameCanvas recipes; synthetic starts, loopback only and no accounts."""
import json
import os
import re
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright

base = os.environ.get('AUDIT_BASE_URL', 'http://127.0.0.1:4173')
assert urlparse(base).hostname in ('127.0.0.1', 'localhost')
out = Path(os.environ.get('AUDIT_OUTPUT_DIR', '/tmp/signature-spirit-browser'))
out.mkdir(parents=True, exist_ok=True)
cases = [('RPG', 'hexen_parias', 390, 'fr'), ('RPG', 'Hexen::Traductus', 1280, 'en'),
         ('Smash', 'hexen_parias', 390, 'en'), ('Smash', 'Hexen::Traductus', 1280, 'fr'),
         ('RPG', 'Resident Evil::Nemesis T-Type', 390, 'fr'),
         ('Smash', 'Resident Evil::Ceiling-Clinging Licker', 1280, 'en'),
         ('Smash', 'Resident Evil::Mr. X T-00 Tyrant', 390, 'en'),
         ('RPG', 'Resident Evil::Hunter Beta', 1280, 'fr')]
results = []
with sync_playwright() as pw:
    options = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'):
        options['executable_path'] = os.environ['AUDIT_CHROMIUM_PATH']
    browser = pw.chromium.launch(**options)
    try:
        for mode, key, width, lang in cases:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost') else route.abort())
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            label = re.sub(r'[^a-zA-Z0-9_-]+', '-', f'{mode}-{key}-{width}-{lang}')
            try:
                page.goto(base + '/scripts/fixtures/signature-source.html?' + urlencode({'mode': mode, 'source': key, 'lang': lang}))
                page.wait_for_function('window.__sourceAudit?.engine?.signatureDirector?.getSummonState', timeout=40000)
                info = page.evaluate('''() => {
                  const a=window.__sourceAudit,e=a.engine;
                  e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();
                  for(const u of [...e.heroes,...e.enemies])Object.assign(u,{currentHp:30000,maxHp:30000,state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:e.groundY||260});
                  const spirit=!!a.definition.summonAgent;
                  e.heroes[0].x=160;e.heroes[0].facing=1;e.enemies[0].x=spirit?460:215;e.enemies[0].facing=-1;
                  a.actor=a.side==='player'?e.heroes[0]:e.enemies[0];a.target=a.side==='player'?e.enemies[0]:e.heroes[0];
                  a.actor.atb=100;a.actor.specialCharge=100;a.hp=a.target.currentHp;a.hits=[];
                  const apply=e.applyDamage;e.applyDamage=(...args)=>{if(args[0]===a.actor&&args[1]===a.target)a.hits.push(args[2]);return apply(...args);};
                  return {name:a.actor.special.name,side:a.side,spirit};
                }''')
                page.wait_for_timeout(150)
                if mode == 'Smash':
                    side = 'opponent' if info['side'] == 'enemy' else 'player'
                    page.locator(f'[data-signature-super="{side}"]').click()
                else:
                    page.get_by_role('button', name=re.compile(re.escape(info['name']), re.I)).click()
                    page.get_by_role('button', name='Confirmer les cibles' if lang == 'fr' else 'Confirm targets', exact=True).click()
                if info['spirit']:
                    page.wait_for_function('window.__sourceAudit.engine.signatureDirector.getSummonState().length === 4')
                    before = page.evaluate('''() => {const a=window.__sourceAudit;a.engine.setPaused(true);return {entities:a.engine.signatureDirector.getSummonState(),hp:a.target.currentHp,initialHp:a.hp,charge:a.actor.specialCharge};}''')
                    assert before['hp'] == before['initialHp'] and before['charge'] == 0
                    page.wait_for_timeout(200)
                    assert page.evaluate('window.__sourceAudit.engine.signatureDirector.getSummonState()') == before['entities']
                    page.screenshot(path=str(out / (label + '-spirits.png')), full_page=True)
                    page.evaluate('window.__sourceAudit.engine.setPaused(false)')
                    page.wait_for_function('!window.__sourceAudit.engine.signatureDirector.busy && !window.__sourceAudit.engine.signatureDirector.getSummonState().length', timeout=15000)
                else:
                    page.wait_for_function('window.__sourceAudit.engine.signatureDirector.busy')
                    page.screenshot(path=str(out / (label + '-preparation.png')), full_page=True)
                    page.wait_for_function('!window.__sourceAudit.engine.signatureDirector.busy', timeout=15000)
                after = page.evaluate('''() => {const a=window.__sourceAudit;a.engine.setPaused(true);return {hp:a.target.currentHp,initialHp:a.hp,hits:a.hits,pending:a.actor.actionPending};}''')
                assert len(after['hits']) == (4 if info['spirit'] else 1), after
                assert after['hp'] < after['initialHp'] and not after['pending'], after
                page.screenshot(path=str(out / (label + '-result.png')), full_page=True)
                page.locator('#qa-unmount').click()
                assert page.evaluate('window.__sourceAudit.engine.disposed')
                assert not page.evaluate('window.__sourceAudit.engine.signatureDirector.getSummonState().length')
                assert not errors, errors
                results.append({'case': label, 'ok': True, 'hits': len(after['hits'])})
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
