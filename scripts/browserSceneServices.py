#!/usr/bin/env python3
"""City service navigation and full Extinction runs driven through input events.
City entry positions and ownership are prepared. Extinction uses a read-only bot,
real damage/ammo/waves and a virtual clock; no injected kills, health or endings.
"""
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check, load_scene, snapshot, in_view


REPLAY_EPOCH = datetime(2020, 1, 1, tzinfo=timezone.utc)
REPLAY_START = REPLAY_EPOCH + timedelta(hours=1)
SEED_POLICY = 'fnv1a32:multiverse-extinction-ci-v1:<mode>'


def scenario_seed(mode):
    # Stable semantic names select seeds before any outcomes are observed.
    value = 2166136261
    for byte in f'multiverse-extinction-ci-v1:{mode}'.encode('utf-8'):
        value = ((value ^ byte) * 16777619) & 0xffffffff
    return value


def city_services(page, lang, out, name):
    fr = lang == 'fr'
    later = page.get_by_role('button', name='Plus tard' if fr else 'Later', exact=True)
    if later.is_visible(): later.click()
    page.evaluate("""()=>{document.documentElement.style.setProperty('--game-hud-scale','1.4');
      document.documentElement.style.setProperty('--game-text-scale','1.4');
      window.dispatchEvent(new Event('multiverse:display-preferences'));}""")
    preview = page.get_by_role('button', name='Lire la transmission complète' if fr else 'Read full transmission', exact=True)
    if preview.is_visible():
        in_view(page, '.mosaic-world-log')
        box, pad = preview.bounding_box(), page.locator('.mosaic-world-controls').bounding_box()
        check(box['y'] + box['height'] <= pad['y'], 'journal overlaps movement controls')
        preview.click()
        journal = page.get_by_role('region',name='Journal de Trame' if fr else 'Thread Log',exact=True)
        expect(journal).to_be_focused()
        check(journal.locator('span').inner_text().endswith('proches.' if fr else 'signatures.'), 'full transmission was lost')
        page.screenshot(path=str(out/f'{name}-journal.png'))
        page.keyboard.press('Escape')
        expect(preview).to_be_focused()
    page.screenshot(path=str(out/f'{name}-city.png'))
    # Each real terminal is approached through a prepared location, not invoked directly.
    services = [
        ('atrium',1030,240,'missions',None),
        ('archives',500,215,'codex',None),
        ('archives',1130,220,'arcs',None),
        ('archives',820,555,'journal',None),
        ('forge',455,545,'party',None),
        ('forge',1185,545,'inventory',None),
        ('forge',820,260,'customBattle',None),
        ('universe-nexus-de-convergence',405,755,'codex','Nexus de Convergence'),
        ('universe-nexus-de-convergence',1460,755,'missions','Nexus de Convergence'),
    ]
    for district,x,y,service,universe in services:
        page.locator('#qa-unmount').click()
        expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
        location={'districtId':district,'zoneId':district,'player':{'x':x,'y':y,'facing':1}}
        page.evaluate('v=>window.__sceneQA.setLocation(v)', location)
        page.wait_for_function('v=>window.__sceneQA.saved?.districtId===v',arg=district)
        page.evaluate('window.__sceneQA.remount()')
        page.wait_for_function('window.__sceneQA.state()?.player')
        page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()
        action=page.locator('.mosaic-room-actions button')
        expect(action).to_be_visible()
        before=snapshot(page)['player'];count=page.evaluate('window.__sceneQA.services.length')
        action.click()
        expect(page.get_by_role('dialog')).to_have_count(0)
        expect(page.locator('.mosaic-rpg-panel')).to_have_count(0)
        records=page.evaluate('window.__sceneQA.services')
        check(len(records)==count+1 and records[-1]['service']==service, f'wrong service {service}: {records[-1:]}')
        check(records[-1].get('universe')==universe,'wrong universe forwarded')
        saved=records[-1]['savedAtNavigation']
        check(saved['districtId']==district and abs(saved['player']['x']-before['x'])<.02 and abs(saved['player']['y']-before['y'])<.02,'checkpoint not published before navigation')
        page.evaluate('window.__sceneQA.remount()')
        page.wait_for_function('window.__sceneQA.state()?.player')
        after=snapshot(page)['player']
        check(abs(after['x']-before['x'])<.02 and abs(after['y']-before['y'])<.02,'service return lost city position')
    return {'serviceTransitions':len(services),'preparedLocations':True}


def state(page):
    return page.evaluate("""()=>{const s=window.__sceneQA.state();return {phase:s.phase,t:s.t,hp:s.hp,maxHp:s.maxHp,armor:s.armor,
      px:s.px,py:s.py,angle:s.angle,vx:s.vx,vy:s.vy,turnVel:s.turnVel,keys:s.moveKeys,weapon:s.weapon,
      ammo:s.ammo,reserveAmmo:s.reserveAmmo,skillCooldown:s.skillCooldown,reloadPulse:s.reloadPulse,wave:s.wave,
      kills:s.kills,beacons:s.beaconsStabilized,enemies:s.enemies,loot:s.loot,glitchZones:s.glitchZones,result:s.result,
      weaponType:s.weapon?.type,protocols:s.protocols?{charge:s.protocols.charge,cooldowns:{...s.protocols.cooldowns},actions:s.protocols.profile?.actions,casts:{...s.protocols.casts}}:null};}""")


def aim(page, current, x, y):
    angle=math.atan2(x-current['px'],y-current['py'])
    delta=(angle-current['angle']+math.pi)%(2*math.pi)-math.pi
    if abs(delta)<.006:return
    box=page.locator('.fps-royale-canvas').bounding_box()
    start_x=box['x']+box['width']/2;start_y=box['y']+box['height']*.48
    page.mouse.move(start_x,start_y);page.mouse.down()
    page.mouse.move(start_x+delta/.008,start_y,steps=2);page.mouse.up()


def full_run(page, mode, lang, out, name, record):
    fr=lang=='fr'
    mode_names={'extraction':'Solo Extraction','last_signal':'Dernier Signal' if fr else 'Last Signal','infestation':'Infestation','hunt':'Chasse au Champion' if fr else 'Champion Hunt'}
    # Clock installation happened after navigation but before START. Jump only
    # while the scene is ready, then control every gameplay frame explicitly.
    page.clock.pause_at(REPLAY_START)
    # Playwright 1.57's virtual RAF uses a 16 ms grid. install/set_system_time
    # preserve monotonic ticks, so equal Date.now alone does not fix its phase.
    # Align only while ready, then normalize wall time for generated entity IDs.
    phase=page.evaluate('performance.now()%16')
    if phase:page.clock.run_for(16-phase)
    page.clock.set_system_time(REPLAY_START)
    check(page.evaluate('performance.now()%16')==0,'virtual RAF phase is not aligned')
    page.locator('.extinction-mode-options button').filter(has=page.locator('strong',has_text=mode_names[mode])).click()
    page.clock.run_for(32)
    seed=scenario_seed(mode)
    page.evaluate('seed=>window.__sceneQA.prepareReplay(seed)',seed)
    print(f'CLOCK READY {name}: seed {seed}, RAF phase 0',flush=True)
    trace=[];digest=hashlib.sha256()

    def observe(action):
        current=state(page)
        entry={'action':action,'state':current,'random':page.evaluate('window.__sceneQA.replayRandom()')}
        trace.append(entry)
        digest.update((json.dumps(entry,sort_keys=True,separators=(',',':'),ensure_ascii=False)+'\n').encode('utf-8'))
        return current

    # Default Anchor: the same legal hero/stats as the initial fixture.
    try:
        page.get_by_role('button',name='DEMARRER RUN' if fr else 'START RUN',exact=True).click()
        page.wait_for_function("window.__sceneQA.state().phase==='running'")
        page.locator('.fps-royale-canvas').focus()
        record['clockAtStart']=page.evaluate('({wallTime:Date.now(),rafPhase:performance.now()%16})')
        check(record['clockAtStart']['rafPhase']==0,'virtual RAF phase changed before START')
        s=observe({'kind':'start'})
        check(s['t']==0,'gameplay advanced before the controlled clock')
        page.clock.run_for(350)
        waves=set();s=observe({'kind':'advance','milliseconds':350});actions=0
        while s['phase']=='running' and actions<650:
            waves.add(s['wave']);actions+=1
            skill=s['skillCooldown']==0
            if skill:page.keyboard.press('Shift')
            enemies=[e for e in s['enemies'] if e['hp']>0]
            loot=[v for v in s['loot'] if not v.get('used')]
            pickup=None
            if not enemies and mode=='extraction': pickup=next((v for v in loot if v['type']=='beacon'),None)
            if s['reserveAmmo']<10 and s['ammo']<8: pickup=next((v for v in loot if v.get('effect')=='ammo'),pickup)
            if s['hp']<50: pickup=next((v for v in loot if v.get('effect')=='heal'),pickup)
            if pickup:
                distance=math.hypot(pickup['wx']-s['px'],pickup['wy']-s['py'])
                action={'kind':'pickup','target':pickup['id'],'skill':skill}
                if distance<1.15:
                    page.keyboard.press('e');page.clock.run_for(30)
                    action['milliseconds']=30
                else:
                    aim(page,s,pickup['wx'],pickup['wy'])
                    duration=min(250,max(17,int((distance-.8)/.25)*17))
                    page.keyboard.down('w');page.clock.run_for(duration);page.keyboard.up('w')
                    page.clock.run_for(70)
                    action.update(kind='approach',milliseconds=duration+70)
            elif enemies and s['ammo']>0 and s['reloadPulse']==0:
                drones=[e for e in enemies if e['kind']=='Drone Protecteur']
                pool=drones or enemies
                target=min(pool,key=lambda e:math.hypot(e['wx']-s['px'],e['wy']-s['py']))
                aim(page,s,target['wx'],target['wy'])
                # The original Anchor now uses a melee primary. Real key input
                # is recorded alongside the deterministic decision trace.
                protocol=s.get('protocols') or {};kit=protocol.get('actions') or {}
                cooldowns=protocol.get('cooldowns') or {}
                distance=math.hypot(target['wx']-s['px'],target['wy']-s['py'])
                commands=[]
                if kit.get('defense') and cooldowns.get('defense',0)<=0 and distance<5:
                    page.keyboard.press('c');commands.append('defense')
                if kit.get('secondary') and cooldowns.get('secondary',0)<=0 and distance<=kit['secondary']['range']:
                    page.keyboard.press('f');commands.append('secondary')
                if kit.get('special') and protocol.get('charge',0)>=100 and cooldowns.get('special',0)<=0 and distance<=kit['special']['range']:
                    page.keyboard.press('x');commands.append('special')
                primary=kit.get('simple') or {}
                melee=s.get('weaponType')=='pistol' and primary.get('kind')=='melee'
                if melee and distance>primary['range']*.9:
                    duration=min(180,max(17,int((distance-primary['range']*.85)/.25)*17))
                    page.keyboard.down('w');page.clock.run_for(duration);page.keyboard.up('w')
                    action={'kind':'approach-melee','target':target['id'],'milliseconds':duration,'skill':skill,'protocolCommands':commands}
                else:
                    duration=max(350,math.ceil(primary.get('cooldown',20)*1000/60)+17) if melee else 350
                    page.keyboard.press('Space');page.clock.run_for(duration)
                    action={'kind':'fire','target':target['id'],'milliseconds':duration,'skill':skill,'protocolCommands':commands}
            elif s['ammo']<1 and s['reserveAmmo']>0:
                page.keyboard.press('r');page.clock.run_for(620)
                action={'kind':'reload','milliseconds':620,'skill':skill}
            else:
                page.clock.run_for(350)
                action={'kind':'wait','milliseconds':350,'skill':skill}
            s=observe(action)
            if actions%50==0:print(f'PROGRESS {name}: action {actions}, frame {s["t"]}, HP {s["hp"]}',flush=True)
        record.update(mode=mode,result=s['result'],frames=s['t'],hp=s['hp'],kills=s['kills'],beacons=s['beacons'],waves=sorted(waves),inputActions=actions,injectedEnding=False,virtualClock=True,
                      protocolCasts=(s.get('protocols') or {}).get('casts',{}))
        check(s['phase']=='ended',f'run did not end: {mode} {s["t"]} frames, {actions} actions')
        reports=page.evaluate('window.__sceneQA.reports')
        check(len(reports)==1 and reports[0]['mode']==mode,'missing/duplicate completion')
        check(reports[0]['result']==s['result'],'reported result differs from runtime')
        check(s['result']=='victory',f'bot defeated: {mode}, waves {sorted(waves)}, kills {s["kills"]}, t {s["t"]}')
        if mode=='extraction':check(s['beacons']==3,'extraction without three collected beacons')
        if mode=='infestation':check(s['t']>=3600,'infestation ended before sixty simulated seconds')
        page.screenshot(path=str(out/f'{name}-result.png'))
        page.keyboard.press('Enter')
        check(len(page.evaluate('window.__sceneQA.reports'))==2,'result acknowledgement missing')
    finally:
        # Keep the complete read-only decision trace even when victory/assertions
        # fail. It contains final HP, hazards, ammo, enemies, RNG state and inputs.
        trace_file=f'{name}-replay.json'
        evidence={'seed':seed,'seedPolicy':SEED_POLICY,'clockEpoch':REPLAY_START.isoformat(),
                  'traceDigest':digest.hexdigest(),'decisionTrace':trace}
        (out/trace_file).write_text(json.dumps(evidence,indent=2,ensure_ascii=False))
        record.update(seed=seed,seedPolicy=SEED_POLICY,traceDigest=digest.hexdigest(),traceFile=trace_file)


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4173');parser.add_argument('--evidence',default='/tmp/scene-services');parser.add_argument('--offline-dir');parser.add_argument('--executable');parser.add_argument('--case',default='');parser.add_argument('--require-art',action='store_true');parser.add_argument('--replays',type=int,default=2,choices=range(1,6));args=parser.parse_args()
    out=Path(args.evidence);out.mkdir(parents=True,exist_ok=True);results=[]
    cases=[('city',390,844,'en','services'),('city',1280,900,'fr','services'),('city',844,390,'fr','services'),('city',2560,1080,'en','services')]
    cases += [('fps',1280,900,'fr' if i%2==0 else 'en',mode) for i,mode in enumerate(['extraction','last_signal','infestation','hunt'])]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'],**({'executable_path':args.executable} if args.executable else {}))
        for kind,w,h,lang,detail in cases:
            name=f'{kind}-{w}x{h}-{lang}-{detail}'
            if args.case and args.case not in name:continue
            reference=None
            for replay in range(1,(args.replays if kind=='fps' else 1)+1):
                run_name=f'{name}-replay-{replay}' if kind=='fps' else name
                print('START '+run_name,flush=True)
                context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<900,has_touch=True)
                page=context.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                record={'name':run_name,'scenario':name,'passed':False,'pageErrors':errors}
                if kind=='fps':record.update(replay=replay,seed=scenario_seed(detail),seedPolicy=SEED_POLICY)
                try:
                    load_scene(page,kind,lang,args)
                    if kind=='fps':
                        # Installing before navigation replays clock logs with a
                        # real navigation offset. Install in the final document
                        # instead, and drain the already-pending native frame
                        # while the scene is still ready, before freezing time.
                        print('INSTALL CLOCK '+run_name,flush=True)
                        page.bring_to_front()
                        page.evaluate('''()=>{window.__sceneQA.beforeClock={
                          frame:requestAnimationFrame.bind(window),cancel:cancelAnimationFrame.bind(window),
                          timeout:setTimeout.bind(window),clear:clearTimeout.bind(window)};}''')
                        page.clock.install(time=REPLAY_EPOCH)
                        page.evaluate('''()=>new Promise((resolve,reject)=>{
                          const native=window.__sceneQA.beforeClock;
                          let frame;
                          const timeout=native.timeout(()=>{native.cancel(frame);delete window.__sceneQA.beforeClock;
                            reject(new Error('Native ready frame did not drain before replay'));},5000);
                          frame=native.frame(()=>{native.clear(timeout);delete window.__sceneQA.beforeClock;resolve();});
                        })''')
                    if kind=='city':record.update(city_services(page,lang,out,run_name))
                    else:full_run(page,detail,lang,out,run_name,record)
                    check(not errors,str(errors))
                    if reference is not None:
                        record['matchesFirstReplay']=record.get('traceDigest')==reference.get('traceDigest')
                        check(record['matchesFirstReplay'],f'same-seed replay diverged; compare {reference.get("traceFile")} and {record.get("traceFile")}')
                    record['passed']=True
                except Exception as error:
                    record['error']=str(error)
                    try:page.screenshot(path=str(out/f'{run_name}-FAILED.png'),timeout=4000)
                    except Exception:pass
                if kind=='fps' and reference is None:reference=record
                results.append(record);print(json.dumps(record,ensure_ascii=False),flush=True);context.close()
        browser.close()
    report={'scope':'City: prepared service entry locations and ownership. Extinction: seeded input-driven complete runs, read-only bot and clock installed before gameplay; no terminal-state injection. Each FPS replay uses a fresh context and compares the observed state and decision trace digest. No real account or physical hardware.','fpsReplays':args.replays,'passed':sum(r['passed'] for r in results),'total':len(results),'cases':results}
    (out/'results.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    raise SystemExit(0 if results and report['passed']==report['total'] else 1)
if __name__=='__main__':main()
