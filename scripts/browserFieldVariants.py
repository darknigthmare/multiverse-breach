#!/usr/bin/env python3
"""Actual City/FPS scenes: opt-in rules, ordinary movement and real combat.
Prepared ownership and initial district only. No injected damage or victory.
"""
import argparse
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check, load_scene
from browserResidentViewmodels import CLOCK_EPOCH, CLOCK_START, prepare_fps_clock
from browserSceneServices import aim
from browserCityFpsOperations import (DISTRICT, reconnaissance, open_city_terminal,
    begin_walk_proof, remount_city_checkpoint, relay_full_run, relay_seed)
from mosaicMotionProof import validate_mosaic_motion


def cross_check(page, lang, out, name):
    later = page.get_by_role('button', name='Plus tard' if lang == 'fr' else 'Later', exact=True)
    if later.is_visible():
        later.click()
    page.locator('#qa-unmount').click()
    expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
    page.evaluate('value => window.__sceneQA.setLocation(value)', {
        'districtId': DISTRICT, 'zoneId': DISTRICT,
        'player': {'x': 820, 'y': 760, 'facing': 1}})
    page.wait_for_function('id => window.__sceneQA.saved?.districtId === id', arg=DISTRICT)
    page.evaluate('window.__sceneQA.remount()')
    page.wait_for_function('window.__sceneQA.state()?.npcs?.length')
    open_city_terminal(page)
    page.locator('[data-reconnaissance="start"]').click()
    page.wait_for_function('id => window.__sceneQA.reconnaissance?.activeDistrictId === id', arg=DISTRICT)
    check(reconnaissance(page)['dossiers'][DISTRICT]['exhibitGoal'] == 2, 'cross-check was not accepted')
    walks = []
    restoration = None
    for step, reached in [
        ('resident', lambda value: bool(value['residentId'])),
        ('first-relic', lambda value: len(value['evidenceIds']) == 1),
        ('second-relic', lambda value: bool(value['exhibitId'])),
        ('report', lambda value: bool(value['completed']))
    ]:
        open_city_terminal(page)
        check(not reached(reconnaissance(page)['dossiers'][DISTRICT]), f'{step} completed prematurely')
        button = page.locator('[data-reconnaissance="approach"]')
        begin_walk_proof(button)
        button.click()
        try:
            for _ in range(240):
                page.clock.run_for(100)
                if reached(reconnaissance(page)['dossiers'][DISTRICT]):
                    break
            check(reached(reconnaissance(page)['dossiers'][DISTRICT]), f'{step} not reached by ordinary movement')
        finally:
            proof = page.evaluate('window.__stopReconnaissanceMotion()')
            (out / f'{name}-{step}-motion.json').write_text(json.dumps(proof, indent=2))
        walks.append({'step': step, **validate_mosaic_motion(proof)})
        open_city_terminal(page)
        page.screenshot(path=str(out / f'{name}-{step}.png'))
        if step == 'first-relic':
            saved = reconnaissance(page)
            check(saved['dossiers'][DISTRICT]['exhibitId'] is None, 'one relic unlocked reporting')
            page.keyboard.press('Escape')
            restoration = remount_city_checkpoint(page, saved, out, name)
    saved = reconnaissance(page)
    dossier = saved['dossiers'][DISTRICT]
    check(dossier['completed'] and len(set(dossier['evidenceIds'])) == 2, 'distinct evidence missing')
    check(saved['activeDistrictId'] is None, 'completed dossier remained active')
    commits = page.evaluate('window.__sceneQA.reconnaissanceSaves.length')
    check(commits == 5, f'expected five unique commits, got {commits}')
    page.keyboard.press('Escape')
    page.locator('.mosaic-rpg-canvas').focus()
    page.keyboard.press('e')
    check(page.evaluate('window.__sceneQA.reconnaissanceSaves.length') == commits, 'duplicate report written')
    check(not page.evaluate('window.__sceneQA.reports.length'), 'reconnaissance granted combat rewards')
    return {'dossier': dossier, 'walks': walks, 'progressCommits': commits, 'restoration': restoration}


def contest_probe(page, out, name):
    prepare_fps_clock(page)
    page.locator('input[data-relay-operation]').check()
    page.clock.run_for(32)
    page.evaluate('seed => window.__sceneQA.prepareReplay(seed)', relay_seed())
    page.get_by_role('button', name='DEMARRER RUN', exact=True).click()
    page.wait_for_function('window.__sceneQA.state().phase === "running"')
    page.locator('.fps-royale-canvas').focus()
    def read():
        return page.evaluate("""() => { const s=window.__sceneQA.state();return {
          t:s.t,phase:s.phase,hp:s.hp,px:s.px,py:s.py,angle:s.angle,
          beacon:s.loot.find(item=>item.type==='beacon'&&!item.used),
          operation:s.relayOperation,enemies:s.enemies.filter(enemy=>enemy.hp>0).map(enemy=>({id:enemy.id,hp:enemy.hp,wx:enemy.wx,wy:enemy.wy}))
        };} """)
    current = read()
    check(current['operation']['contested'], 'contested preference not applied to actual run')
    for _ in range(80):
        target = current['beacon']
        distance = math.hypot(target['wx']-current['px'], target['wy']-current['py'])
        if distance < 1.05:
            break
        aim(page, current, target['wx'], target['wy'])
        duration = min(180, max(17, int((distance-.8)/.25)*17))
        page.keyboard.down('w'); page.clock.run_for(duration); page.keyboard.up('w')
        page.clock.run_for(70)
        current = read()
        check(current['phase'] == 'running', 'approach ended the run')
    check(distance < 1.05, 'beacon not reached by walking')
    page.keyboard.press('e')
    page.clock.run_for(32)
    for _ in range(120):
        current = read()
        entry = current['operation']['beacons'].get(current['beacon']['id'])
        if entry and entry.get('jammerCount', 0) > 0:
            break
        page.clock.run_for(100)
        check(current['phase'] == 'running', 'jam probe ended before observation')
    check(entry and entry.get('jammerCount', 0) > 0, 'no real hostile entered the perimeter')
    before = current
    page.clock.run_for(200)
    after = read()
    beacon_id = current['beacon']['id']
    check(after['t'] > before['t'], 'jam probe accidentally paused')
    check(after['operation']['beacons'][beacon_id]['ticks'] == before['operation']['beacons'][beacon_id]['ticks'], 'contested relay earned progress')
    expect(page.locator('[data-relay-status]')).to_contain_text('Périmètre contesté')
    page.screenshot(path=str(out / f'{name}-contested.png'))
    return {'before': before, 'after': after, 'nativeMovement': True, 'injectedEnemies': False}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', default='/tmp/field-variants')
    parser.add_argument('--executable')
    parser.add_argument('--require-art', action='store_true')
    parser.add_argument('--case', default='')
    args = parser.parse_args(); args.offline_dir = None
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    results = []; reference = None
    cases = [('city',1280,900,'fr','cross-check'), ('city',390,844,'en','cross-check'),
             ('fps',1280,900,'fr','contest-probe'), ('fps',1280,900,'fr','victory-1'), ('fps',1280,900,'fr','victory-2')]
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True,args=['--no-sandbox'],
            **({'executable_path':args.executable} if args.executable else {}))
        try:
            for kind,width,height,lang,suffix in cases:
                name=f'{kind}-{width}x{height}-{lang}-{suffix}'
                if args.case and args.case not in name: continue
                print('START '+name,flush=True)
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
                context.add_init_script("localStorage.setItem('multiverse_breach_field_options_v1',JSON.stringify({schemaVersion:1,reconnaissance:'cross-check',relays:'contested'}));")
                page=context.new_page();page.set_default_timeout(10000)
                errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
                record={'name':name,'passed':False,'pageErrors':errors}
                try:
                    if kind=='city':page.clock.install(time=CLOCK_EPOCH);page.clock.pause_at(CLOCK_START)
                    load_scene(page,kind,lang,args)
                    if kind=='city':record.update(cross_check(page,lang,out,name))
                    elif suffix=='contest-probe':record.update(contest_probe(page,out,name))
                    else:
                        relay_full_run(page,lang,out,name,record)
                        trace=json.loads((out/record['traceFile']).read_text())
                        if reference is not None:
                            check(trace==reference,'full contested replay documents diverged')
                            record['identicalReplayDocument']=True
                        reference=trace
                    check(not errors,str(errors));record['passed']=True
                except Exception as error:
                    record['error']=str(error)
                    page.screenshot(path=str(out/f'{name}-FAILED.png'))
                finally:
                    results.append(record);context.close()
                    (out/'report.json').write_text(json.dumps({'results':results},ensure_ascii=False,indent=2))
                    print(json.dumps({'name':name,'passed':record['passed'],'error':record.get('error')},ensure_ascii=False),flush=True)
        finally:browser.close()
    check(results and all(record['passed'] for record in results),'field variant browser failures')
if __name__=='__main__':main()
