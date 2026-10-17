"""RPG UI regressions in Chromium on a loopback-only Vite fixture.

Uses the production GameCanvas, real input handlers, engine and renderer. Only
initial battle states and custom test skills are seeded; this is NOT a full
campaign playthrough or an artwork validation. Missing sprites use runtime
fallbacks and are recorded. No accounts, saves or external services are touched.
"""
import argparse
import json
import os
from pathlib import Path
import re
import time
import traceback
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

PREPARE = """() => {
  const e = window.__rpgAudit.engine;
  e.enemies.forEach(u => { u.atb = 0; u.currentHp = u.maxHp; });
  e.enemyGlobalRecovery = 1000000;
  e.heroes.forEach(u => { u.currentHp = u.maxHp; u.state = 'idle'; u.stateTimer = 0; u.cooldown = 0; u.atb = u.id === 'arca_mirelle' ? 100 : 0; u.specialCharge = 100; });
  e.selectHero('arca_mirelle');
  const patient = e.heroes[0], other = e.heroes[2];
  patient.maxHp = 200; patient.currentHp = 90; patient.statusEffects.radiated = 10000;
  other.maxHp = 200; other.currentHp = 150;
  return { enemy: e.enemies[0].currentHp, costs: [e.heroes[1].atb, e.heroes[1].cooldown, e.heroes[1].specialCharge] };
}"""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/rpg-browser-evidence')
    args = parser.parse_args()
    base = args.base_url.rstrip('/')
    if urlparse(base).hostname not in ('localhost', '127.0.0.1', '::1'):
        raise ValueError('Loopback only: this test must not alter live game state')
    output = Path(args.evidence); output.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as p:
        launch = {'headless': True}
        if os.environ.get('PLAYWRIGHT_CHROMIUM_EXECUTABLE'):
            launch['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_EXECUTABLE']
        browser = p.chromium.launch(**launch)
        for width in (1280, 390):
            for lang in ('fr', 'en'):
                name = f'rpg-heal-cleanse-revive-pause-unmount-{width}-{lang}'
                started = time.monotonic(); errors = []; missing = []
                ctx = browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
                page = ctx.new_page(); page.set_default_timeout(15000)
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('response', lambda res: missing.append(urlparse(res.url).path) if res.status >= 400 else None)
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1', '::1') else route.abort())
                try:
                    page.goto(base + f'/scripts/fixtures/rpg-lifecycle.html?lang={lang}', wait_until='domcontentloaded')
                    page.wait_for_function('window.__rpgAudit?.engine && !window.__rpgAudit.engine.disposed')
                    before = page.evaluate(PREPARE)
                    heal = page.get_by_role('button', name=re.compile('Patch de Trame'))
                    expect(heal).to_be_enabled(); heal.click()
                    panel = page.get_by_role('region', name='Ciblage RPG' if lang == 'fr' else 'RPG targeting')
                    confirm = panel.get_by_role('button', name='Confirmer les cibles' if lang == 'fr' else 'Confirm targets', exact=True)
                    cancel = panel.get_by_role('button', name='Annuler sans coût' if lang == 'fr' else 'Cancel without cost', exact=True)
                    expect(confirm).to_be_enabled()
                    assert page.evaluate('window.__rpgAudit.engine.targeting.selectedTargetIds[0] === window.__rpgAudit.engine.heroes[2].battleId')
                    assert page.evaluate('() => { const e=window.__rpgAudit.engine; return [e.heroes[1].atb,e.heroes[1].cooldown,e.heroes[1].specialCharge]; }') == before['costs']
                    cancel.click(); expect(heal).to_be_enabled(); heal.click()
                    panel.get_by_role('button', name=re.compile('QA Anchor')).click()
                    page.screenshot(path=str(output / f'rpg-{width}-{lang}-healing-targets.png'), full_page=True)
                    confirm.click()
                    page.wait_for_function('window.__rpgAudit.engine.heroes[0].currentHp === 100')
                    assert page.evaluate('window.__rpgAudit.engine.enemies[0].currentHp') == before['enemy']
                    page.evaluate("window.__rpgAudit.engine.selectHero('arca_mirelle')")
                    expect(heal).to_be_disabled()

                    # Synthetic cleanse profile uses the production support UI and handlers.
                    page.evaluate("""() => {
                      const e=window.__rpgAudit.engine, h=e.heroes[1], patient=e.heroes[0];
                      e.selectHero('arca_mirelle'); h.state='idle'; h.stateTimer=0; h.atb=100; h.cooldown=0;
                      h.secondary={name:'QA Cleanse',type:'heal',dmg:3,cd:3,cleanses:['infected']};
                      patient.currentHp=100; patient.statusEffects={infected:10000,radiated:10000,glitched:0};
                    }""")
                    clean = page.get_by_role('button', name=re.compile('QA Cleanse'))
                    expect(clean).to_be_enabled(); clean.click()
                    panel.get_by_role('button', name=re.compile('QA Anchor')).click()
                    expect(panel).to_contain_text('Purification' if lang == 'fr' else 'Cleanse')
                    confirm.click()
                    page.wait_for_function('window.__rpgAudit.engine.heroes[0].statusEffects.infected === 0')
                    assert page.evaluate('window.__rpgAudit.engine.heroes[0].statusEffects.radiated > 0')

                    page.evaluate("""() => {
                      const e=window.__rpgAudit.engine, h=e.heroes[1], patient=e.heroes[0];
                      e.selectHero('arca_mirelle'); h.state='idle'; h.stateTimer=0; h.atb=100; h.cooldown=0;
                      h.secondary={name:'QA Revive',type:'revive',reviveRatio:0.3,cd:3};
                      patient.currentHp=0; patient.state='dead'; patient.stateTimer=999;
                    }""")
                    revive = page.get_by_role('button', name=re.compile('QA Revive'))
                    expect(revive).to_be_enabled(); revive.click(); expect(panel).to_contain_text('KO')
                    confirm.click(); page.wait_for_function('window.__rpgAudit.engine.heroes[0].currentHp === 60')
                    assert page.evaluate('window.__rpgAudit.engine.heroes[0].actionPending === false')

                    # Queue and pause in one input turn, avoiding wall-clock races.
                    page.evaluate("""() => {
                      const e=window.__rpgAudit.engine, h=e.heroes[1]; e.selectHero('arca_mirelle'); h.state='idle'; h.stateTimer=0; h.atb=100; h.cooldown=0;
                      h.secondary={name:'QA Shot',type:'bullet',dmg:1,cd:3};
                    }""")
                    shot = page.get_by_role('button', name=re.compile('QA Shot'))
                    expect(shot).to_be_enabled(); shot.click(); expect(confirm).to_be_enabled()
                    confirm.evaluate("button => { button.click(); document.querySelector('#qa-pause').click(); }")
                    page.wait_for_function('window.__rpgAudit.engine.paused')
                    remaining = page.evaluate('window.__rpgAudit.engine.actionQueue[0]?.ticks')
                    assert remaining is not None
                    page.wait_for_timeout(350)
                    assert page.evaluate('window.__rpgAudit.engine.actionQueue[0]?.ticks') == remaining
                    page.get_by_role('button', name='QA pause', exact=True).click()
                    page.wait_for_function('!window.__rpgAudit.engine.heroes[1].actionPending')
                    page.screenshot(path=str(output / f'rpg-{width}-{lang}-after-revive.png'), full_page=True)
                    page.get_by_role('button', name='QA unmount', exact=True).click()
                    page.wait_for_function('window.__rpgAudit.engine.disposed')
                    assert page.evaluate('window.__rpgAudit.engine.actionQueue.length') == 0
                    assert not errors, errors
                    results.append({'case': name, 'passed': True, 'seconds': round(time.monotonic()-started, 2), 'missing_assets': sorted(set(missing))})
                except Exception as error:
                    page.screenshot(path=str(output / f'FAIL-{name}.png'), full_page=True)
                    results.append({'case': name, 'passed': False, 'error': str(error), 'trace': traceback.format_exc(), 'page_errors': errors})
                finally:
                    ctx.close()
                    (output/'results.json').write_text(json.dumps(results, indent=2))
                print(('PASS ' if results[-1]['passed'] else 'FAIL ') + name, flush=True)
        for width in (1280, 390):
            name = f'equipped-crossover-artifact-once-{width}'
            ctx = browser.new_context(viewport={'width': width, 'height': 900})
            page = ctx.new_page(); errors = []; page.on('pageerror', lambda err: errors.append(str(err)))
            page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1', '::1') else route.abort())
            try:
                page.goto(base + '/scripts/fixtures/rpg-lifecycle.html?events=1')
                page.wait_for_function('window.__rpgAudit?.engine')
                page.evaluate(PREPARE)
                page.evaluate("""() => {
                  const e=window.__rpgAudit.engine; e.heroes.forEach(h=>{h.currentHp=50;h.statusEffects={};});
                  window.__rpgAudit.events=[];
                  const original=e.triggerCombatEvent.bind(e);
                  e.triggerCombatEvent=effect=>{window.__rpgAudit.events.push(effect);return original(effect);};
                }""")
                button = page.get_by_role('button', name=re.compile('MALLETTE VACCIN ANTIVIRAL'))
                expect(button).to_be_enabled()
                button.evaluate('button => {button.click();button.click();}')
                expect(page.get_by_role('button', name=re.compile('ARTEFACT DEPENSE'))).to_be_disabled()
                assert page.evaluate('window.__rpgAudit.events') == ['heal_squad']
                assert page.evaluate('window.__rpgAudit.engine.heroes.every(h=>h.currentHp===h.maxHp)')
                page.screenshot(path=str(output / f'event-{width}-spent.png'), full_page=True)
                assert not errors, errors
                results.append({'case': name, 'passed': True})
            except Exception as error:
                page.screenshot(path=str(output / f'FAIL-{name}.png'), full_page=True)
                results.append({'case': name, 'passed': False, 'error': str(error), 'trace': traceback.format_exc(), 'page_errors': errors})
            finally:
                ctx.close()
                (output/'results.json').write_text(json.dumps(results, indent=2))
            print(('PASS ' if results[-1]['passed'] else 'FAIL ') + name, flush=True)
        browser.close()
    assert all(result['passed'] for result in results), results

if __name__ == '__main__':
    main()
