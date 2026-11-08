#!/usr/bin/env python3
"""Real FPS scene: source-backed profiles, real media and four optional directives.
Prepared ownership only. Native keyboard/pointer input, fixed semantic seeds and
virtual time; no writes to player position, health, enemies, objectives or endings.
Run with the existing city-extinction fixture (SSR/static/native CI Chromium).
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check
from browserResidentViewmodels import prepare_fps_clock
from browserSceneServices import aim, state

MODES = {'extraction': ('Solo Extraction', 'Solo Extraction'),
         'last_signal': ('Dernier Signal', 'Last Signal'),
         'infestation': ('Infestation', 'Infestation'),
         'hunt': ('Chasse au Champion', 'Champion Hunt')}


def seed_for(name):
    value = 2166136261
    for byte in ('multiverse-fps-roster-directives-v1:' + name).encode():
        value = ((value ^ byte) * 16777619) & 0xffffffff
    return value


def read(page):
    current = state(page)
    extra = page.evaluate('''() => {const s=window.__sceneQA.state();
      const directive=s.fieldDirective?structuredClone(s.fieldDirective):null;
      if(directive)delete directive.runId;
      return {directive,directiveSummary:s.directiveSummary||null,
        ownerMatches:!s.fieldDirective||(s.fieldDirective.runId===s.runId&&s.fieldDirective.heroId===s.heroId),
        relay:s.relayOperation?{beacons:s.relayOperation.beacons}:null,relaySummary:s.relaySummary||null,
        personalKit:s.personalKit?{ammo:s.personalKit.weapon.ammo,reserveAmmo:s.personalKit.reserveAmmo}:null};}''')
    return {**current, **extra}


def load(page, args, lang):
    page.goto(f'{args.url}/scripts/fixtures/city-extinction.html?mode=fps&catalog=full&lang={lang}', wait_until='networkidle')
    page.wait_for_function('window.__sceneQA?.state()?.phase === "ready"')
    expect(page.locator('.extinction-panel select option')).to_have_count(1811)
    page.evaluate('document.fonts.ready')


def media_capture(context):
    context.add_init_script('''window.__fpsCatalogDraws=[];
      const draw=CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
        if(this.canvas.classList.contains('fps-royale-canvas')&&typeof image?.src==='string'){
          window.__fpsCatalogDraws.push({src:image.src,args});
          if(window.__fpsCatalogDraws.length>250)window.__fpsCatalogDraws.shift();
        } return draw.call(this,image,...args);
      };''')


def profile_case(page, identity, lang, args, out, name):
    page.locator('.extinction-panel select').select_option(identity)
    brief = page.locator(f'[data-fighter-profile="{identity}"]')
    expect(brief).to_be_visible()
    expected_src = brief.get_attribute('data-fps-view-src')
    if expected_src and args.require_art:
        page.wait_for_function('src => window.__sceneQA.media.some(item => item.src===src&&item.loaded)', arg=expected_src)
    ready = page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,
      profile:document.querySelector('[data-fighter-profile]').dataset,
      media:window.__sceneQA.media.filter(item=>item.loaded)})''')
    check(ready['scroll'] <= ready['width'] + 1, 'profile briefing overflows the viewport')
    page.screenshot(path=str(out / f'{name}-briefing.png'))
    prepare_fps_clock(page)
    page.evaluate('seed => window.__sceneQA.prepareReplay(seed)', seed_for(identity))
    page.get_by_role('button', name='DEMARRER RUN' if lang == 'fr' else 'START RUN', exact=True).click()
    page.locator('.fps-royale-canvas').focus()
    page.clock.run_for(32)
    initial = read(page)
    check(list(initial['protocols']['actions']) == ['simple', 'secondary', 'defense', 'special'], 'personal actions missing')
    expect(page.locator('.extinction-panel select')).to_be_disabled()
    target = min(initial['enemies'], key=lambda item: math.hypot(item['wx'], item['wy']))
    aim(page, initial, target['wx'], target['wy'])
    page.keyboard.press('Space'); page.keyboard.press('f'); page.keyboard.press('c'); page.clock.run_for(400)
    active = read(page)
    check(all(active['protocols']['casts'][slot] == 1 for slot in ['simple', 'secondary', 'defense']), 'native personal action did not execute once')
    page.locator('#qa-pause').click()
    frozen = read(page)
    page.keyboard.press('Space'); page.keyboard.press('f'); page.keyboard.press('c'); page.keyboard.press('v'); page.keyboard.press('t')
    page.clock.run_for(900)
    check(read(page) == frozen, 'pause accepted input or progressed the source kit')
    page.locator('#qa-pause').click(); page.clock.run_for(32)
    draws = page.evaluate('window.__fpsCatalogDraws')
    if expected_src and args.require_art:
        personal = [entry for entry in draws if entry['src'].endswith(expected_src) and len(entry['args']) == 8]
        check(personal, f'personal FPS sheet never drawn: {identity}')
        for entry in personal:
            _, _, sw, sh, _, _, dw, dh = entry['args']
            check(abs(sw / sh - dw / dh) < 1e-6, 'personal FPS sheet distorted')
    page.screenshot(path=str(out / f'{name}-active.png'))
    page.locator('#qa-exit').click()
    check(page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed").length') == 0, 'abandonment granted completion')
    return {'heroId': identity, 'briefing': ready, 'actions': active['protocols'], 'nativeInputs': True,
            'viewSource': expected_src, 'draws': draws, 'pausePreserved': True, 'abandonNoReward': True}


def walk(page, current, point):
    distance = math.hypot(point['wx'] - current['px'], point['wy'] - current['py'])
    aim(page, current, point['wx'], point['wy'])
    duration = min(180, max(17, int((distance - .8) / .25) * 17))
    page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w'); page.clock.run_for(70)
    return {'kind': 'walk', 'target': point['id'], 'milliseconds': duration + 70}


def combat(page, current, targets):
    drones = [target for target in targets if target['kind'] == 'Drone Protecteur']
    target = min(drones or targets, key=lambda item: math.hypot(item['wx'] - current['px'], item['wy'] - current['py']))
    aim(page, current, target['wx'], target['wy'])
    distance = math.hypot(target['wx'] - current['px'], target['wy'] - current['py'])
    protocol = current['protocols']; actions = protocol['actions']; cooldowns = protocol['cooldowns']
    commands = []
    if cooldowns.get('defense', 0) <= 0 and distance < 5:
        page.keyboard.press('c'); commands.append('defense')
    if cooldowns.get('secondary', 0) <= 0 and distance <= actions['secondary']['range']:
        page.keyboard.press('f'); commands.append('secondary')
    if cooldowns.get('special', 0) <= 0 and protocol['charge'] >= 100 and distance <= actions['special']['range']:
        page.keyboard.press('x'); commands.append('special')
    primary = actions['simple']
    if current['weaponType'] == 'pistol' and primary['kind'] == 'melee' and distance > primary['range'] * .9:
        duration = min(180, max(17, int((distance - primary['range'] * .85) / .25) * 17))
        page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w')
        return {'kind': 'approach-melee', 'target': target['id'], 'milliseconds': duration, 'protocols': commands}
    page.keyboard.press('Space'); duration = max(350, math.ceil(primary['cooldown'] * 1000 / 60) + 17)
    page.clock.run_for(duration)
    return {'kind': 'fire', 'target': target['id'], 'milliseconds': duration, 'protocols': commands}


def full_directive(page, mode, lang, out, name):
    page.locator('.extinction-mode-options button').filter(has=page.locator('strong', has_text=MODES[mode][0 if lang == 'fr' else 1])).click()
    page.locator('[data-relay-operation]' if mode == 'extraction' else '[data-field-directive]').check()
    prepare_fps_clock(page); page.clock.run_for(32)
    seed = seed_for(mode); page.evaluate('seed=>window.__sceneQA.prepareReplay(seed)', seed)
    trace = []; result = {'mode': mode, 'seed': seed, 'nativeInputs': True, 'injectedProgress': False}
    def observe(action):
        current = read(page); check(current['ownerMatches'], 'directive has a foreign run or hero')
        trace.append({'action': action, 'state': current, 'random': page.evaluate('window.__sceneQA.replayRandom()')})
        return current
    try:
        page.get_by_role('button', name='DEMARRER RUN' if lang == 'fr' else 'START RUN', exact=True).click()
        page.locator('.fps-royale-canvas').focus(); current = observe({'kind': 'start'})
        check(current['t'] == 0, 'run advanced before controlled input')
        page.clock.run_for(350); current = observe({'kind': 'advance', 'milliseconds': 350})
        paused = False
        for index in range(1000):
            if current['phase'] != 'running': break
            if not paused:
                page.locator('#qa-pause').click(); before = read(page)
                page.keyboard.press('e'); page.keyboard.press('t'); page.clock.run_for(1000)
                check(read(page) == before, 'directive progressed under shell pause')
                page.locator('#qa-pause').click(); page.locator('.fps-royale-canvas').focus(); page.clock.run_for(32)
                current = observe({'kind': 'pause-resume'}); paused = True
            if current['skillCooldown'] == 0: page.keyboard.press('Shift')
            if current['personalKit'] and current['weaponType'] != 'pistol':
                retained = current['personalKit']; page.keyboard.press('v')
                current = observe({'kind': 'restore-personal-kit'})
                check(current['weaponType'] == 'pistol' and current['ammo'] == retained['ammo']
                      and current['reserveAmmo'] == retained['reserveAmmo'], 'pickup return refilled or changed the personal kit')
                result['kitReturns'] = result.get('kitReturns', 0) + 1
            enemies = [enemy for enemy in current['enemies'] if enemy['hp'] > 0]
            directive = current['directive']; points = (directive or {}).get('markers', [])
            markers = [point for point in points if point['status'] != 'secured' and
                       (point['wave'] == current['wave'] if mode == 'last_signal' else current['t'] >= point['opensAt'])]
            marker = markers[0] if markers else None
            pickup = next((item for item in current['loot'] if item['type'] == 'beacon' and not item.get('used')), None) if not enemies and mode == 'extraction' else None
            if marker and (mode == 'infestation' or not enemies): pickup = marker
            if current['hp'] < 50:
                pickup = next((item for item in current['loot'] if item.get('effect') == 'heal' and not item.get('used')), pickup)
            if mode == 'hunt' and directive and directive['markTicks'] == 0:
                champion = next((enemy for enemy in enemies if enemy['kind'] == 'Champion de Trame'), None)
                if champion and math.hypot(champion['wx'] - current['px'], champion['wy'] - current['py']) <= 12:
                    aim(page, current, champion['wx'], champion['wy']); page.keyboard.press('t')
                    current = observe({'kind': 'mark'}); directive = current['directive']
            close = [enemy for enemy in enemies if math.hypot(enemy['wx'] - current['px'], enemy['wy'] - current['py']) < 3]
            if mode == 'infestation' and pickup is marker and close:
                action = combat(page, current, close)
            elif pickup:
                distance = math.hypot(pickup['wx'] - current['px'], pickup['wy'] - current['py'])
                if distance >= 1.05: action = walk(page, current, pickup)
                else:
                    page.keyboard.press('e'); page.clock.run_for(180)
                    action = {'kind': 'interact', 'target': pickup['id'], 'milliseconds': 180}
            elif enemies: action = combat(page, current, enemies)
            else:
                page.clock.run_for(180); action = {'kind': 'wait', 'milliseconds': 180}
            current = observe(action)
            if index % 75 == 0: print(f'PROGRESS {name}: {index} actions, {current["t"]} ticks, {current["hp"]} HP', flush=True)
        reports = page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed")')
        check(current['phase'] == 'ended' and current['result'] == 'victory', f'no victory: {current["phase"]}, {current["t"]} ticks, {current["hp"]} HP')
        check(len(reports) == 1, 'completion missing or duplicated')
        if mode == 'extraction': check(current['beacons'] == 3 and current['relaySummary']['secured'] == 3, 'relay objective skipped')
        else:
            check(current['directiveSummary']['completed'] == current['directiveSummary']['required'], 'directive objective skipped')
            if mode == 'infestation': check(current['t'] >= 3600, 'survival time skipped')
        rewards = reports[0]['rewards']; check(rewards['gold'] == 70 + current['wave'] * 22 + current['kills'] * 3, 'reward formula changed')
        page.screenshot(path=str(out / f'{name}-result.png'))
        page.keyboard.press('Space'); page.keyboard.press('e'); page.keyboard.press('t'); page.clock.run_for(500)
        check(page.evaluate('window.__sceneQA.reports.filter(report=>report.reason==="completed").length') == 1, 'result input granted another receipt')
        result.update(ticks=current['t'], kills=current['kills'], hp=current['hp'], result=current['result'],
                      directive=current['directiveSummary'], relays=current['relaySummary'], rewards=rewards, casts=current['protocols']['casts'])
    finally:
        result['traceFile'] = f'{name}-trace.json'
        serialized = json.dumps(trace, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
        result['traceDigest'] = hashlib.sha256(serialized.encode()).hexdigest()
        (out / result['traceFile']).write_text(json.dumps({'seed': seed, 'trace': trace}, indent=2, ensure_ascii=False))
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173'); parser.add_argument('--evidence', default='/tmp/extinction-roster-directives')
    parser.add_argument('--executable'); parser.add_argument('--require-art', action='store_true'); parser.add_argument('--case', default='')
    parser.add_argument('--replays', type=int, default=2, choices=range(1, 6)); args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True); results = []; reference = {}
    profiles = [('arca_mirelle', 1280, 900, 'fr'), ('masterchief', 1280, 900, 'en'), ('predator', 1280, 900, 'fr'),
                ('doomslayer', 1280, 900, 'en'), ('lilo_pelekai', 390, 844, 'fr'), ('long_horse', 390, 844, 'en'),
                ('serj_tankian', 390, 844, 'en'), ('arthur_kaamelott', 1280, 900, 'fr')]
    cases = [('profile', hero, width, height, lang, 0) for hero, width, height, lang in profiles]
    cases += [('directive', mode, 1280, 900, 'fr' if mode in ['extraction', 'last_signal'] else 'en', replay)
              for mode in MODES for replay in range(1, args.replays + 1)]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=['--no-sandbox'], **({'executable_path': args.executable} if args.executable else {}))
        try:
            for kind, identity, width, height, lang, replay in cases:
                name = f'{kind}-{identity}-{width}x{height}-{lang}' + (f'-{replay}' if replay else '')
                if args.case and args.case not in name: continue
                print('START ' + name, flush=True)
                context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True); media_capture(context)
                page = context.new_page(); page.set_default_timeout(15000); errors = []; page.on('pageerror', lambda error: errors.append(str(error)))
                record = {'name': name, 'passed': False, 'pageErrors': errors}
                try:
                    load(page, args, lang)
                    record.update(profile_case(page, identity, lang, args, out, name) if kind == 'profile'
                                  else full_directive(page, identity, lang, out, name))
                    if kind == 'directive':
                        if identity in reference: check(record['traceDigest'] == reference[identity], 'fresh-context deterministic replay differs')
                        reference[identity] = record['traceDigest']
                    check(not errors, str(errors)); record['passed'] = True
                except Exception as error:
                    record['error'] = str(error); page.screenshot(path=str(out / f'{name}-FAILED.png'))
                finally:
                    results.append(record); context.close()
                    (out / 'report.json').write_text(json.dumps({'results': results}, indent=2, ensure_ascii=False))
                    print(json.dumps({'name': name, 'passed': record['passed'], 'error': record.get('error')}), flush=True)
        finally: browser.close()
    check(results and all(record['passed'] for record in results), 'FPS roster/directive browser failures')


if __name__ == '__main__': main()
