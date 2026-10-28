#!/usr/bin/env python3
"""City service navigation and full Extinction runs driven through input events.
City entry positions and ownership are prepared. Extinction uses a read-only bot,
real damage/ammo/waves and a virtual clock; no injected kills, health or endings.
"""
import argparse
from datetime import datetime, timezone
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check, load_scene, snapshot, in_view


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
    return page.evaluate("""()=>{const s=window.__sceneQA.state();return {phase:s.phase,t:s.t,hp:s.hp,px:s.px,py:s.py,angle:s.angle,
      ammo:s.ammo,reserveAmmo:s.reserveAmmo,skillCooldown:s.skillCooldown,reloadPulse:s.reloadPulse,wave:s.wave,
      kills:s.kills,beacons:s.beaconsStabilized,enemies:s.enemies,loot:s.loot,result:s.result,weaponType:s.weapon?.type,
      protocols:s.protocols?{charge:s.protocols.charge,cooldowns:{...s.protocols.cooldowns},actions:s.protocols.profile?.actions,casts:{...s.protocols.casts}}:null};}""")


def aim(page, current, x, y):
    angle=math.atan2(x-current['px'],y-current['py'])
    delta=(angle-current['angle']+math.pi)%(2*math.pi)-math.pi
    if abs(delta)<.006:return
    box=page.locator('.fps-royale-canvas').bounding_box()
    start_x=box['x']+box['width']/2;start_y=box['y']+box['height']*.48
    page.mouse.move(start_x,start_y);page.mouse.down()
    page.mouse.move(start_x+delta/.008,start_y,steps=2);page.mouse.up()


def full_run(page, mode, lang, out, name):
    fr=lang=='fr'
    mode_names={'extraction':'Solo Extraction','last_signal':'Dernier Signal' if fr else 'Last Signal','infestation':'Infestation','hunt':'Chasse au Champion' if fr else 'Champion Hunt'}
    page.locator('.extinction-mode-options button').filter(has=page.locator('strong',has_text=mode_names[mode])).click()
    # Default Anchor: the same legal hero/stats as the initial fixture.
    page.get_by_role('button',name='DEMARRER RUN' if fr else 'START RUN',exact=True).click()
    page.wait_for_function("window.__sceneQA.state().phase==='running'")
    page.locator('.fps-royale-canvas').focus()
    page.clock.install()
    page.clock.pause_at(datetime.now(timezone.utc))
    page.clock.run_for(350)
    waves=set();s=state(page);actions=0
    while s['phase']=='running' and actions<650:
        waves.add(s['wave']);actions+=1
        if s['skillCooldown']==0:page.keyboard.press('Shift')
        enemies=[e for e in s['enemies'] if e['hp']>0]
        loot=[v for v in s['loot'] if not v.get('used')]
        pickup=None
        if not enemies and mode=='extraction': pickup=next((v for v in loot if v['type']=='beacon'),None)
        if s['reserveAmmo']<10 and s['ammo']<8: pickup=next((v for v in loot if v.get('effect')=='ammo'),pickup)
        if s['hp']<50: pickup=next((v for v in loot if v.get('effect')=='heal'),pickup)
        if pickup:
            distance=math.hypot(pickup['wx']-s['px'],pickup['wy']-s['py'])
            if distance<1.15:
                page.keyboard.press('e');page.clock.run_for(30)
            else:
                aim(page,s,pickup['wx'],pickup['wy'])
                page.keyboard.down('w');page.clock.run_for(min(250,max(17,int((distance-.8)/.25)*17)));page.keyboard.up('w')
                page.clock.run_for(70)
        elif enemies and s['ammo']>0 and s['reloadPulse']==0:
            drones=[e for e in enemies if e['kind']=='Drone Protecteur']
            pool=drones or enemies
            target=min(pool,key=lambda e:math.hypot(e['wx']-s['px'],e['wy']-s['py']))
            aim(page,s,target['wx'],target['wy'])
            # The Anchor now has a melee primary: do not fire an obsolete ranged
            # pistol loop while standing outside its reach. Only native controls
            # are issued; stats, charge, cooldowns and outcomes remain untouched.
            protocols=s.get('protocols') or {};kit=protocols.get('actions') or {}
            cooldowns=protocols.get('cooldowns') or {}
            distance=math.hypot(target['wx']-s['px'],target['wy']-s['py'])
            if kit.get('defense') and cooldowns.get('defense',0)<=0 and distance<5:
                page.keyboard.press('c')
            if kit.get('secondary') and cooldowns.get('secondary',0)<=0 and distance<=kit['secondary']['range']:
                page.keyboard.press('f')
            if kit.get('special') and protocols.get('charge',0)>=100 and cooldowns.get('special',0)<=0 and distance<=kit['special']['range']:
                page.keyboard.press('x')
            primary=kit.get('simple') or {}
            melee=s.get('weaponType')=='pistol' and primary.get('kind')=='melee'
            if melee and distance>primary['range']*.9:
                page.keyboard.down('w')
                page.clock.run_for(min(180,max(17,int((distance-primary['range']*.85)/.25)*17)))
                page.keyboard.up('w')
            else:
                page.keyboard.press('Space')
                page.clock.run_for(max(350,math.ceil(primary.get('cooldown',20)*1000/60)+17) if melee else 350)
        elif s['ammo']<1 and s['reserveAmmo']>0:
            page.keyboard.press('r');page.clock.run_for(620)
        else: page.clock.run_for(350)
        s=state(page)
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
    return {'mode':mode,'result':s['result'],'frames':s['t'],'kills':s['kills'],'beacons':s['beacons'],'waves':sorted(waves),'inputActions':actions,'injectedEnding':False,'virtualClock':True,'protocolCasts':(s.get('protocols') or {}).get('casts',{})}


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4173');parser.add_argument('--evidence',default='/tmp/scene-services');parser.add_argument('--offline-dir');parser.add_argument('--executable');parser.add_argument('--case',default='');parser.add_argument('--require-art',action='store_true');args=parser.parse_args()
    out=Path(args.evidence);out.mkdir(parents=True,exist_ok=True);results=[]
    cases=[('city',390,844,'en','services'),('city',1280,900,'fr','services'),('city',844,390,'fr','services'),('city',2560,1080,'en','services')]
    cases += [('fps',1280,900,'fr' if i%2==0 else 'en',mode) for i,mode in enumerate(['extraction','last_signal','infestation','hunt'])]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'],**({'executable_path':args.executable} if args.executable else {}))
        for kind,w,h,lang,detail in cases:
            name=f'{kind}-{w}x{h}-{lang}-{detail}'
            if args.case and args.case not in name:continue
            print('START '+name,flush=True)
            context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<900,has_touch=True)
            page=context.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            record={'name':name,'passed':False}
            try:
                load_scene(page,kind,lang,args)
                record.update(city_services(page,lang,out,name) if kind=='city' else full_run(page,detail,lang,out,name))
                check(not errors,str(errors));record['passed']=True
            except Exception as error:
                record['error']=str(error)
                try:page.screenshot(path=str(out/f'{name}-FAILED.png'),timeout=4000)
                except Exception:pass
            results.append(record);print(json.dumps(record,ensure_ascii=False),flush=True);context.close()
        browser.close()
    report={'scope':'City: prepared service entry locations and ownership. Extinction: input-driven complete runs, read-only bot and virtual clock; no terminal-state injection. No real account or physical hardware.','passed':sum(r['passed'] for r in results),'total':len(results),'cases':results}
    (out/'results.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    raise SystemExit(0 if results and report['passed']==report['total'] else 1)
if __name__=='__main__':main()
