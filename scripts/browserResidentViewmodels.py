#!/usr/bin/env python3
"""Real owned resident groups and drawImage cropping. Prepared ownership, not art approval."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

def check(value, message):
    if not value: raise AssertionError(message)

def residents(page, args, width, height, lang, out, name):
    fr=lang=='fr'
    page.goto(f'{args.url}/scripts/fixtures/city-extinction.html?mode=city&catalog=full&lang={lang}',wait_until='networkidle')
    page.wait_for_function('window.__sceneQA?.state()?.npcs?.length')
    page.wait_for_function('window.__sceneQA.media.some(m=>m.src.includes("chapter-01-atrium")&&m.loaded)')
    later=page.get_by_role('button',name='Plus tard' if fr else 'Later',exact=True)
    if later.is_visible():later.click()
    page.clock.install();page.clock.pause_at(datetime.now(timezone.utc))
    page.evaluate("document.documentElement.style.setProperty('--game-hud-scale','1.4');document.documentElement.style.setProperty('--game-text-scale','1.4');window.dispatchEvent(new Event('multiverse:display-preferences'))")
    visits=[]
    for identity in ['torbahead_community_remix_curator','bioshock_rapture_tenenbaum','arca_bastion']:
        page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()
        directory=page.locator('.mosaic-resident-directory')
        if not directory.evaluate('e=>e.open'):directory.locator('summary').click()
        search=page.get_by_label('Rechercher un habitant' if fr else 'Find a resident',exact=True)
        search.fill(identity)
        expect(directory.locator('[data-resident-id]')).to_have_count(1)
        target=directory.locator(f'[data-resident-id="{identity}"]')
        target.scroll_into_view_if_needed()
        resident_name=target.locator('strong').text_content().strip()
        box=target.bounding_box();check(box and box['x']>=0 and box['x']+box['width']<=width+1,'resident action clipped horizontally')
        before=page.evaluate('window.__sceneQA.snapshot().player')
        page.screenshot(path=str(out/f'{name}-{identity}-directory.png'))
        target.click();expect(page.get_by_role('dialog')).to_have_count(0)
        page.clock.run_for(100)
        snapshot=page.evaluate('window.__sceneQA.snapshot()')
        ids=[n['id'] for n in snapshot['npcs']]
        check(identity in ids and len(ids)<=18 and len(ids)==len(set(ids)),'resident omitted, duplicated or population unbounded')
        check(ids.count('arca_mirelle')==1,'Mirelle guide not retained exactly once')
        check(abs(snapshot['player']['x']-before['x'])<20 and abs(snapshot['player']['y']-before['y'])<20,'directory teleported player')
        page.clock.run_for(14000)
        page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()
        log=page.locator('.mosaic-rpg-log span').inner_text()
        expected=resident_name+(' synchronise sa Trame' if fr else ' synchronizes their Thread')
        check(log.startswith(expected),f'resident not reached through normal movement: {identity}: {log}')
        # The QA parent is intentionally outside the inert game dialog. Trigger
        # its rerender programmatically without mutating the simulation.
        before=page.evaluate('window.__sceneQA.snapshot()')
        revision=page.evaluate('window.__sceneQA.revision')
        page.locator('#qa-render').evaluate('node => node.click()')
        page.wait_for_function('v => window.__sceneQA.revision === v + 1', arg=revision)
        check(before==page.evaluate('window.__sceneQA.snapshot()'),'parent render moved residents or player in terminal')
        directory=page.locator('.mosaic-resident-directory')
        if not directory.evaluate('e=>e.open'):directory.locator('summary').click()
        search=page.get_by_label('Rechercher un habitant' if fr else 'Find a resident',exact=True)
        search.fill('no-such-owned-resident');expect(page.locator('[data-resident-id]')).to_have_count(0)
        page.keyboard.press('Escape')
        visits.append(identity)
    page.screenshot(path=str(out/f'{name}-city.png'))
    return {'residentsReached':visits,'populationLimit':18,'nonCombatResidents':2,'preparedOwnership':True,'virtualClock':True}

def viewmodel(page,args,identity,width,height,lang,out,name):
    page.add_init_script('''(()=>{window.__fpsDraws=[];const draw=CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
        if(this.canvas.classList.contains('fps-royale-canvas') && /fps/.test(image?.src||'') && args.length===8){
          window.__fpsDraws.push({src:image.src,args,width:image.naturalWidth,height:image.naturalHeight});
          if(window.__fpsDraws.length>120)window.__fpsDraws.shift();}
        return draw.call(this,image,...args);};})();''')
    page.goto(f'{args.url}/scripts/fixtures/city-extinction.html?mode=fps&catalog=full&lang={lang}',wait_until='networkidle')
    page.get_by_role('combobox').select_option(identity)
    expect(page.locator('.extinction-panel')).to_have_attribute('data-viewmodel',identity)
    page.wait_for_function('window.__fpsDraws.length>0')
    page.clock.install();page.clock.pause_at(datetime.now(timezone.utc))
    page.get_by_role('button',name='DEMARRER RUN' if lang=='fr' else 'START RUN',exact=True).click()
    # Respect the existing initial fire cooldown; never force ammunition or timers.
    page.clock.run_for(450)
    before_ammo=page.evaluate('window.__sceneQA.state().weapon.ammo')
    page.locator('.fps-royale-canvas').focus();page.keyboard.press('Space');page.clock.run_for(100)
    check(page.evaluate('window.__sceneQA.state().weapon.ammo')==before_ammo-1,'native fire did not consume one round')
    page.screenshot(path=str(out/f'{name}-fire.png'))
    firing=page.evaluate('window.__fpsDraws');page.evaluate('window.__fpsDraws=[]')
    page.clock.run_for(650)
    check(page.evaluate('window.__sceneQA.state().muzzle')==0,'fire phase still active before reload')
    page.locator('.fps-royale-canvas').focus();page.keyboard.press('r');page.clock.run_for(80)
    check(page.evaluate('window.__sceneQA.state().reloadPulse')>0,'native reload phase was not entered')
    check(page.evaluate('window.__sceneQA.state().weapon.ammo')==before_ammo,'reload did not restore the spent round')
    reload=page.evaluate('window.__fpsDraws')
    check(bool(reload),'no actual reload/idle draw observed')
    for record in firing+reload:
        sx,sy,sw,sh,dx,dy,dw,dh=record['args']
        check(sx>=0 and sy>=0 and sw>0 and sh>0 and sx+sw<=record['width']+.001 and sy+sh<=record['height']+.001,'crop outside sheet')
        check(abs(sw/sh-dw/dh)<.00001,'image stretched')
    if identity=='arca_mirelle':
        check(any('fps-hands' in d['src'] and abs(d['args'][1]-(6*d['height']/10+40))<.001 and abs(d['args'][3]-(d['height']/10-46))<.001 for d in reload),'Mirelle reload trim not used in real draw')
        check(any('fps-projectile' in d['src'] for d in firing),'Mirelle projectile overlay missing')
    page.screenshot(path=str(out/f'{name}-reload.png'))
    return {'heroId':identity,'drawCallsChecked':len(firing)+len(reload),'aspectPreserved':True,'preparedOwnership':True,'virtualClock':True}

def main():
    p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:4173');p.add_argument('--evidence',default='/tmp/resident-viewmodels');p.add_argument('--executable');p.add_argument('--case',default='');a=p.parse_args()
    out=Path(a.evidence);out.mkdir(parents=True,exist_ok=True);results=[]
    cases=[('city','residents',w,h,lang) for w,h,lang in [(390,844,'en'),(1280,900,'fr'),(844,390,'fr'),(2560,1080,'en')]]
    cases += [('fps',id,w,h,lang) for id,w,h,lang in [('arca_mirelle',1280,900,'fr'),('arca_mirelle',390,844,'en'),('arca_mirelle',844,390,'fr'),('arca_mirelle',2560,1080,'en'),('arthur_kaamelott',1280,900,'en'),('serj_tankian',1280,900,'fr')]]
    with sync_playwright() as pw:
        b=pw.chromium.launch(headless=True,args=['--no-sandbox'],**({'executable_path':a.executable} if a.executable else {}))
        for kind,id,w,h,lang in cases:
            name=f'{kind}-{id}-{w}x{h}-{lang}'
            if a.case and a.case not in name:continue
            page=b.new_page(viewport={'width':w,'height':h});page.set_default_timeout(18000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            r={'name':name,'passed':False}
            try:
                r.update(residents(page,a,w,h,lang,out,name) if kind=='city' else viewmodel(page,a,id,w,h,lang,out,name))
                check(not errors,str(errors));r['passed']=True
            except Exception as e:
                r['error']=str(e)
                try:page.screenshot(path=str(out/f'{name}-FAILED.png'),timeout=3000)
                except Exception:pass
            results.append(r);print(json.dumps(r,ensure_ascii=False),flush=True);page.close()
        b.close()
    report={'scope':'Actual React scenes and FPS drawImage calls. Prepared full ownership, virtual time; no real account or hardware. Only selected media validated.','passed':sum(r['passed'] for r in results),'total':len(results),'cases':results}
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));raise SystemExit(0 if results and report['passed']==len(results) else 1)
if __name__=='__main__':main()
