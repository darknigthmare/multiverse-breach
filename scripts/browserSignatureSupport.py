"""Real UI, synthetic initial states, loopback only, no real accounts or email."""
import json
import os
import re
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright
from browserCombatUi import open_arsenal

base = os.environ.get('AUDIT_BASE_URL', 'http://127.0.0.1:4173')
assert urlparse(base).hostname in ('127.0.0.1', 'localhost')
out = Path(os.environ.get('AUDIT_OUTPUT_DIR', '/tmp/signature-support-browser'))
out.mkdir(parents=True, exist_ok=True)
cases = [
    ('RPG', 'team_fortress_2_medic', 'player', 390, 'fr'),
    ('Smash', 'team_fortress_2_medic', 'player', 1280, 'en'),
    ('RPG', 'team_fortress_2_medic', 'enemy', 1280, 'en'),
    ('Smash', 'team_fortress_2_medic', 'enemy', 390, 'fr'),
    ('RPG', 'dog_hl2', 'player', 1280, 'en'),
    ('Smash', 'vasquez_aliens', 'player', 390, 'fr'),
    ('RPG', 'Quake::Makron — Quake II', 'enemy', 390, 'en'),
    ('Smash', 'hicks_aliens', 'player', 1280, 'fr'),
    ('Smash', 'Doom::Leaping Pinky Demon', 'enemy', 390, 'en'),
    ('RPG', 'Hexen::Centaur', 'enemy', 1280, 'fr'),
]
results = []
with sync_playwright() as playwright:
    options = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'):
        options['executable_path'] = os.environ['AUDIT_CHROMIUM_PATH']
    browser = playwright.chromium.launch(**options)
    try:
        for mode, key, side, width, lang in cases:
            context = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            context.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1', 'localhost') else route.abort())
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            label = re.sub(r'[^\w.-]', '-', f'{mode}-{key}-{side}-{width}-{lang}')
            try:
                page.goto(base + '/scripts/fixtures/signature-support.html?' + urlencode({'source': key, 'mode': mode, 'side': side, 'lang': lang}))
                page.wait_for_function('window.__supportAudit?.engine?.signatureDirector', timeout=40000)
                page.evaluate('''() => {
                  const a=window.__supportAudit,e=a.engine;
                  e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();
                  for(const unit of [...e.heroes,...e.enemies]) Object.assign(unit,{state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:e.arena?.groundY||260});
                  e.heroes.forEach((u,i)=>{u.x=240+i*35;u.facing=1;});
                  e.enemies.forEach((u,i)=>{u.x=285+i*35;u.facing=-1;});
                  a.actor=(a.side==='player'?e.heroes:e.enemies)[0];
                  a.allies=a.side==='player'?e.heroes:e.enemies;
                  a.foe=(a.side==='player'?e.enemies:e.heroes)[0];
                  Object.assign(a.actor,{atb:100,specialCharge:100});
                  if(a.side==='enemy') e.selectedEnemyId=a.actor.battleId||a.actor.runtimeId||a.actor.id;
                  a.before=a.foe.currentHp;a.contacts=[];
                  const damage=e.applyDamage;e.applyDamage=(...args)=>{a.contacts.push({defender:args[1].name,base:args[2]});return damage(...args);};
                }''')
                page.wait_for_timeout(200)
                if mode == 'RPG':
                    name = page.evaluate('window.__supportAudit.definition.name')
                    page.locator('button.btn-special').filter(has_text=re.compile(re.escape(name), re.IGNORECASE)).click()
                    if key == 'team_fortress_2_medic':
                        page.locator('[data-support-preview="stock-uber"]').wait_for()
                        page.get_by_role('region', name=re.compile('Ciblage RPG|RPG targeting')).get_by_role('button').filter(has_text='Soldier').click()
                    page.get_by_role('button', name=re.compile('Confirmer les cibles|Confirm targets')).click()
                else:
                    target_side = 'opponent' if side == 'enemy' else 'player'
                    open_arsenal(page)
                    page.locator(f'[data-signature-super="{target_side}"]').click()
                page.wait_for_function('window.__supportAudit.engine.signatureDirector.busy')
                page.wait_for_function('window.__supportAudit.engine.signatureDirector.snapshot()?.tick >= 12')
                snap = page.evaluate('''() => {const e=window.__supportAudit.engine;e.setPaused(true);return e.signatureDirector.snapshot();}''')
                page.wait_for_timeout(160)
                assert page.evaluate('window.__supportAudit.engine.signatureDirector.snapshot().tick') == snap['tick']
                page.screenshot(path=str(out / (label + '-sequence.png')), full_page=True)
                page.evaluate('window.__supportAudit.engine.setPaused(false)')
                page.wait_for_function('!window.__supportAudit.engine.signatureDirector.busy', timeout=15000)
                data = page.evaluate('''() => {const a=window.__supportAudit,e=a.engine;e.setPaused(true);
                  return {charge:a.actor.specialCharge,contacts:a.contacts,foeHp:a.foe.currentHp,before:a.before,support:e.signatureDirector.getSupportState(),action:a.actor.special};}''')
                assert data['charge'] < 1
                if key == 'team_fortress_2_medic':
                    assert len(data['support']) == 1 and data['support'][0]['patientName'] == 'Soldier'
                    assert data['foeHp'] == data['before'] and not data['contacts']
                    page.screenshot(path=str(out / (label + '-linked.png')), full_page=True)
                    protected = page.evaluate('''() => {const a=window.__supportAudit,e=a.engine,p=a.allies[1],third=a.allies[2];
                      const hp=p.currentHp,thirdHp=third.currentHp;
                      const result=e.applyDamage(a.foe,p,12,5);e.applyDamage(a.foe,third,12,5);
                      return {result,hp,after:p.currentHp,thirdHp,thirdAfter:third.currentHp,ticks:e.signatureDirector.getSupportState()[0].ticks};}''')
                    assert protected['result'] == 0 and protected['hp'] == protected['after']
                    assert protected['thirdAfter'] < protected['thirdHp']
                    page.wait_for_timeout(160)
                    assert page.evaluate('window.__supportAudit.engine.signatureDirector.getSupportState()[0].ticks') == protected['ticks']
                    page.evaluate('''() => {const a=window.__supportAudit;a.allies[1].x=a.actor.x+321;}''')
                    assert page.evaluate('window.__supportAudit.engine.signatureDirector.getSupportState()[0].patientName') is None
                else:
                    assert data['foeHp'] < data['before']
                    hits = page.evaluate('window.__supportAudit.definition.hits')
                    assert len(data['contacts']) == hits, data
                    page.screenshot(path=str(out / (label + '-result.png')), full_page=True)
                page.locator('#qa-unmount').click()
                page.wait_for_timeout(100)
                assert page.evaluate('window.__supportAudit.engine.disposed')
                assert not page.evaluate('window.__supportAudit.engine.signatureDirector.getSupportState().length')
                assert not errors, errors
                results.append({'case': label, 'ok': True, 'contacts': len(data['contacts']), 'stockSupport': key == 'team_fortress_2_medic'})
            except Exception as error:
                page.screenshot(path=str(out / (label + '-FAILED.png')), full_page=True)
                results.append({'case': label, 'ok': False, 'error': str(error), 'pageErrors': errors})
            finally:
                context.close()
                (out / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    finally:
        browser.close()
print(json.dumps(results, indent=2))
assert len(results) == len(cases) and all(r['ok'] for r in results), 'Wave3/support browser regressions failed'
