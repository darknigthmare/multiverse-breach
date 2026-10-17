"""Real UI recipe with synthetic initial state, confined to a loopback server."""
import json
import os
import re
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright

base = os.environ.get('AUDIT_BASE_URL', 'http://127.0.0.1:4173')
assert urlparse(base).hostname in ('127.0.0.1', 'localhost'), 'Only a loopback test server is allowed'
out = Path(os.environ.get('AUDIT_OUTPUT_DIR', '/tmp/source-signature-browser'))
out.mkdir(parents=True, exist_ok=True)
cases = [
    ('RPG', 'cloud_ff7', 1280, 'fr'), ('RPG', 'aerith_ff7', 390, 'fr'),
    ('RPG', 'lightning_ff13', 1280, 'en'), ('Smash', 'goku_dbz', 390, 'fr'),
    ('Smash', 'naruto_uzumaki_young', 1280, 'fr'), ('Smash', 'aerith_ff7', 390, 'en'),
    ('Smash', 'rinoa_ff8', 1280, 'fr'), ('Smash', 'Doom::Cyberdemon Lord', 390, 'en'),
    ('RPG', 'hexen_parias', 390, 'fr'), ('RPG', 'quake_franchise_ranger', 1280, 'en'),
    ('RPG', 'leia', 390, 'fr'), ('RPG', 'Star Wars::Count Dooku Sith Lord', 1280, 'en'),
    ('Smash', 'ahsoka_adult', 390, 'fr'), ('Smash', 'Star Wars::Droideka Shield Droid', 1280, 'en'),
    ('Smash', 'Hexen::Traductus', 390, 'fr'), ('Smash', 'Quake::Strogg Gladiator', 1280, 'en'),
    ('Smash', 'team_fortress_2_scout', 390, 'fr'), ('Smash', 'Half-Life::Combine Gunship', 1280, 'en'),
]
results = []
with sync_playwright() as playwright:
    options = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'):
        options['executable_path'] = os.environ['AUDIT_CHROMIUM_PATH']
    browser = playwright.chromium.launch(**options)
    try:
        for mode, source, width, lang in cases:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost') else route.abort())
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            label = f'{mode}-{source.replace("::", "-").replace(" ", "-")}-{width}-{lang}'
            try:
                page.goto(base + '/scripts/fixtures/signature-source.html?' + urlencode({'mode': mode, 'source': source, 'lang': lang}))
                page.wait_for_function('window.__sourceAudit?.engine?.signatureDirector', timeout=40000)
                page.evaluate('''() => {
                  const a=window.__sourceAudit,e=a.engine;
                  e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();
                  for(const unit of [...e.heroes,...e.enemies]) Object.assign(unit,{state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:e.arena?.groundY||260});
                  e.heroes[0].x=240;e.heroes[0].facing=1;e.enemies[0].x=240+Math.max(30,(a.definition.minRange||0)+10);e.enemies[0].facing=-1;
                  const actor=a.side==='player'?e.heroes[0]:e.enemies[0];
                  Object.assign(actor,{atb:100,specialCharge:100});
                  if(a.definition.effect==='heal') actor.currentHp=Math.max(1,Math.round(actor.maxHp*0.2));
                  a.before={hero:e.heroes[0].currentHp,enemy:e.enemies[0].currentHp};
                  a.contacts=[];const damage=e.applyDamage;e.applyDamage=(...args)=>{a.contacts.push({target:args[1].name,base:args[2]});return damage(...args);};
                }''')
                page.wait_for_timeout(200)
                if mode == 'RPG':
                    name = page.evaluate('window.__sourceAudit.definition.name')
                    page.locator('button.btn-special').filter(has_text=re.compile(re.escape(name), re.IGNORECASE)).click()
                    # The source card is tied to the real prepared action, with
                    # no cost while inspecting or cancelling a target choice.
                    card = page.locator('[data-source-profile]')
                    assert card.count() == 1
                    card.locator('summary').click()
                    assert card.get_attribute('data-source-profile') == source
                    assert card.locator('a').get_attribute('href').startswith('https://')
                    assert page.evaluate("(() => {const a=window.__sourceAudit,e=a.engine;return (a.side==='player'?e.heroes[0]:e.enemies[0]).specialCharge})()") == 100
                    page.get_by_role('button', name=re.compile('Confirmer les cibles|Confirm targets')).click()
                else:
                    side = 'opponent' if '::' in source else 'player'
                    page.locator(f'[data-signature-super="{side}"]').click()
                page.wait_for_function('window.__sourceAudit.engine.signatureDirector.busy')
                page.wait_for_function('window.__sourceAudit.engine.signatureDirector.snapshot()?.tick >= 16')
                snap = page.evaluate('''() => {const a=window.__sourceAudit;a.engine.setPaused(true);return a.engine.signatureDirector.snapshot();}''')
                page.wait_for_timeout(180)
                assert page.evaluate('window.__sourceAudit.engine.signatureDirector.snapshot().tick') == snap['tick']
                page.screenshot(path=str(out / (label + '-sequence.png')), full_page=True)
                page.evaluate('window.__sourceAudit.engine.setPaused(false)')
                page.wait_for_function('!window.__sourceAudit.engine.signatureDirector.busy', timeout=15000)
                after = page.evaluate('''() => {const a=window.__sourceAudit,e=a.engine;e.setPaused(true);return {before:a.before,hero:e.heroes[0].currentHp,enemy:e.enemies[0].currentHp,contacts:a.contacts,definition:a.definition,side:a.side,charge:(a.side==='player'?e.heroes[0]:e.enemies[0]).specialCharge};}''')
                if after['definition']['effect'] == 'heal':
                    assert after['hero'] > after['before']['hero'] and after['enemy'] == after['before']['enemy']
                    assert not after['contacts']
                else:
                    target = 'enemy' if after['side'] == 'player' else 'hero'
                    assert after[target] < after['before'][target]
                    assert len(after['contacts']) == after['definition']['hits']
                assert after['charge'] < 1
                page.screenshot(path=str(out / (label + '-result.png')), full_page=True)
                page.locator('#qa-unmount').click()
                page.wait_for_timeout(100)
                assert page.evaluate('window.__sourceAudit.engine.disposed')
                assert not errors, errors
                results.append({'case': label, 'ok': True, 'contacts': len(after['contacts']), 'pausedAt': snap['tick']})
            except Exception as error:
                page.screenshot(path=str(out / (label + '-FAILED.png')), full_page=True)
                results.append({'case': label, 'ok': False, 'error': str(error), 'pageErrors': errors})
            finally:
                context.close()
                (out / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    finally:
        browser.close()
print(json.dumps(results, indent=2))
assert len(results) == len(cases) and all(result['ok'] for result in results), 'Source signature browser regressions failed'
