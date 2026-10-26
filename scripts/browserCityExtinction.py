#!/usr/bin/env python3
"""Real City / Extinction React scenes, prepared ownership and injected endings.
No real account or cloud save. Offline replay uses exact local media, not stand-ins.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def load_scene(page, mode, lang, args):
    if not args.offline_dir:
        page.goto(f'{args.url}/scripts/fixtures/city-extinction.html?mode={mode}&lang={lang}', wait_until='networkidle')
    else:
        root = Path(args.offline_dir)
        page.set_content('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>')
        page.add_style_tag(content=(root / 'offline/scene.css').read_text())
        page.evaluate('''()=>{for (const key of ['localStorage','sessionStorage']) {
          const store=new Map();Object.defineProperty(window,key,{configurable:true,value:{getItem:k=>store.get(k)??null,
          setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear(),key:i=>[...store.keys()][i]??null,get length(){return store.size}}});
        }}''')
        page.evaluate('''({assets,params})=>{window.__sceneQaParams=params;window.__offlineMedia={loaded:[],missing:[]};
          const Original=window.Image;window.Image=class extends Original{set src(value){
            if(!assets[value]){window.__offlineMedia.missing.push(value);return;}
            this.addEventListener('load',()=>window.__offlineMedia.loaded.push(value),{once:true});super.src=assets[value];
          }get src(){return super.src;}};
        }''', {'assets': json.loads((root / 'assets.json').read_text()), 'params': f'?mode={mode}&lang={lang}'})
        page.add_script_tag(content=(root / 'offline/scene.iife.js').read_text())
    page.wait_for_function('window.__sceneQA?.state()')
    if args.require_art:
        page.wait_for_function('window.__sceneQA.media.length > 0 && window.__sceneQA.media.every(x=>x.loaded)', timeout=20000)
        media=page.evaluate('window.__sceneQA.media')
        backdrop='/images/campaign-oc/chapter-01-atrium-v1.png' if mode=='city' else '/backgrounds/lore-stages/nexus-de-convergence/rpg.webp'
        check(any(x['src']==backdrop and x['loaded'] for x in media),'scene backdrop not decoded')


def snapshot(page):
    return page.evaluate('window.__sceneQA.snapshot()')


def pause(page):
    page.locator('#qa-pause').click()
    page.wait_for_timeout(80)


def in_view(page, selector):
    result = page.locator(selector).evaluate_all('''elements=>elements.filter(e=>e.getBoundingClientRect().height && !e.closest('[inert]')).map(e=>{
      const r=e.getBoundingClientRect();return {name:e.textContent.trim(),ok:r.x>=-1&&r.y>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1};})''')
    check(all(e['ok'] for e in result), f'controls outside viewport: {result}')


def two_touches(page, context, button, key):
    box = button.bounding_box()
    x, y = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
    cdp = context.new_cdp_session(page)
    first = {'id': 1, 'x': x - 4, 'y': y}
    second = {'id': 2, 'x': x + 4, 'y': y}
    for kind, touches in [('touchStart',[first]),('touchStart',[first,second]),('touchEnd',[second])]:
        cdp.send('Input.dispatchTouchEvent', {'type':kind,'touchPoints':touches})
    check(snapshot(page)['keys'].get(key) is True, 'release of one pointer cancelled the other')
    cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
    check(not snapshot(page)['keys'].get(key), 'last pointer stayed held')
    cdp.detach()


def city(page, context, lang, out, name):
    fr = lang == 'fr'
    page.screenshot(path=str(out / f'{name}-welcome.png'))
    page.get_by_role('button', name='Plus tard' if fr else 'Later', exact=True).click()
    canvas = page.locator('.mosaic-rpg-canvas')
    canvas.focus()
    before=snapshot(page)
    page.keyboard.down('d');page.wait_for_timeout(120);page.keyboard.up('d')
    check(snapshot(page)['player']['x'] > before['player']['x'], 'city keyboard movement failed')
    two_touches(page, context, page.get_by_role('button',name='Deplacement ↑' if fr else 'Move ↑',exact=True), 'arrowup')
    # A prepared route is cancelled when the player chooses to read their terminal.
    page.evaluate('''()=>{const s=window.__sceneQA.state();s.destination={x:s.player.x+250,y:s.player.y};}''')
    terminal=page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True)
    terminal.click();expect(page.get_by_role('dialog')).to_be_visible()
    current=snapshot(page);page.wait_for_timeout(120)
    check(snapshot(page)['player']==current['player'], 'city moves beneath terminal')
    check(snapshot(page)['destination'] is None,'route was not cancelled')
    page.keyboard.press('Escape');expect(page.get_by_role('dialog')).to_have_count(0)
    check(terminal.evaluate('(e)=>e===document.activeElement'),'terminal focus not restored')
    # Pause and a value-equivalent parent refresh cannot teleport the NPCs.
    pause(page);before=snapshot(page);page.locator('#qa-render').click();page.wait_for_timeout(100)
    after=snapshot(page)
    check(after['player']==before['player'] and after['npcs']==before['npcs'],'parent refresh reset the city actors')
    check(after['t']==before['t'],'city advances during pause')
    pause(page)
    page.evaluate("document.documentElement.style.setProperty('--game-hud-scale','1.4')")
    in_view(page,'.mosaic-world-controls button, .mosaic-world-hud button')
    page.screenshot(path=str(out / f'{name}-city.png'))
    old=snapshot(page)['player']
    page.locator('#qa-unmount').click();page.wait_for_function('window.__sceneQA.saved')
    page.evaluate('window.__sceneQA.remount()');page.wait_for_function('window.__sceneQA.state()')
    current=snapshot(page)['player']
    check(abs(current['x']-old['x'])<0.1 and abs(current['y']-old['y'])<0.1,'city position lost on remount')
    check(not page.evaluate('window.__sceneQA.reports.length'),'city unexpectedly reported completion')


def fps(page, context, lang, out, name, run_mode):
    fr=lang=='fr'
    mode_names={'extraction':'Solo Extraction','last_signal':'Dernier Signal' if fr else 'Last Signal','infestation':'Infestation','hunt':'Chasse au Champion' if fr else 'Champion Hunt'}
    page.locator('.extinction-mode-options button').filter(has=page.locator('strong',has_text=mode_names[run_mode])).click()
    page.get_by_role('button',name='DEMARRER RUN' if fr else 'START RUN',exact=True).click()
    page.wait_for_function("window.__sceneQA.state().phase==='running'")
    page.wait_for_timeout(400)
    canvas=page.locator('.fps-royale-canvas');canvas.focus()
    run_id=snapshot(page)['runId']
    page.keyboard.down('w');page.keyboard.down('ArrowUp');page.keyboard.up('w')
    check(snapshot(page)['keys'].get('forward') is True,'keyboard aliases cancel each other')
    page.keyboard.up('ArrowUp')
    two_touches(page,context,page.get_by_role('button',name='AVANT' if fr else 'FORWARD',exact=True),'forward')
    move=page.get_by_role('button',name='AVANT' if fr else 'FORWARD',exact=True);move.focus()
    page.keyboard.down('Space');check(snapshot(page)['keys'].get('forward') is True,'focused button Space did not hold')
    page.keyboard.up('Space');check(not snapshot(page)['keys'].get('forward'),'Space release stuck')
    # A gradual drag (2px per event) must never turn into a shot on release.
    box=canvas.bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']*.48
    page.mouse.move(x,y);ammo=snapshot(page)['ammo'];page.mouse.down();page.mouse.move(x+24,y,steps=12);page.mouse.up()
    check(snapshot(page)['ammo']==ammo,'slow drag fired a shot')
    page.get_by_role('button',name='DIRECTIVE · COMMANDES' if fr else 'DIRECTIVE · CONTROLS',exact=True).click()
    expect(page.get_by_role('dialog')).to_be_visible();before=snapshot(page);page.wait_for_timeout(180)
    check(snapshot(page)==before,'Extinction advances under its command drawer')
    page.keyboard.press('Escape');expect(page.get_by_role('dialog')).to_have_count(0)
    pause(page);before=snapshot(page);page.locator('#qa-render').click();page.wait_for_timeout(80)
    check(snapshot(page)==before and before['runId']==run_id,'paused run was reset or advanced')
    pause(page)
    page.evaluate("document.documentElement.style.setProperty('--game-hud-scale','1.4')")
    in_view(page,'.extinction-hud-dock button, .extinction-intel-button')
    page.screenshot(path=str(out / f'{name}-run.png'))
    # Exercise actual terminal conditions while clearly declaring the state injection.
    page.evaluate('''mode=>{const s=window.__sceneQA.state();s.hp=1000;
      if(mode==='infestation'){s.t=3601;}else{s.beaconsStabilized=3;s.wave=5;s.enemies=[{kind:'Champion de Trame',hp:0,maxHp:1,wx:0,wy:10}];}
    }''',run_mode)
    expect(page.get_by_role('dialog',name='Bilan de la run' if fr else 'Run results',exact=True)).to_be_visible()
    page.wait_for_timeout(80)
    reports=page.evaluate('window.__sceneQA.reports')
    check(len(reports)==1 and reports[0]['result']=='victory' and reports[0]['mode']==run_mode,'completion missing, duplicated or misclassified')
    cont=page.get_by_role('button',name='CONTINUER' if fr else 'CONTINUE',exact=True)
    check(cont.evaluate('(e)=>e===document.activeElement'),'result did not receive focus')
    for _ in range(3):page.keyboard.press('Tab')
    check(cont.evaluate('(e)=>e===document.activeElement'),'Tab left the result')
    page.keyboard.press('Escape');expect(cont).to_be_visible()
    page.screenshot(path=str(out / f'{name}-result.png'));cont.click()
    check(len(page.evaluate('window.__sceneQA.reports'))==2,'acknowledgement missing or duplicated')


def fault(page, mode, lang, out, name):
    fr=lang=='fr'
    if mode=='fps':
        page.get_by_role('button',name='DEMARRER RUN' if fr else 'START RUN',exact=True).click();page.wait_for_timeout(100)
    before=snapshot(page);page.evaluate('window.__sceneQA.failRender()')
    expect(page.get_by_role('dialog')).to_be_visible()
    page.screenshot(path=str(out / f'{name}-error.png'))
    check(not page.evaluate('window.__sceneQA.reports.length'),'render error awarded a completion')
    page.get_by_role('button',name=('REPRENDRE LA CITÉ' if fr else 'RESUME CITY') if mode=='city' else ('RETOUR À LA PRÉPARATION' if fr else 'BACK TO PREPARATION'),exact=True).click()
    expect(page.get_by_role('dialog')).to_have_count(0)
    if mode=='city':check(snapshot(page)['player']==before['player'],'city recovery reset position')
    else:check(snapshot(page)['phase']=='ready','Extinction failed to return to preparation')


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4173');parser.add_argument('--evidence',default='docs/ui-immersion/city-extinction-browser');parser.add_argument('--executable');parser.add_argument('--offline-dir');parser.add_argument('--case',default='');parser.add_argument('--require-art',action='store_true');args=parser.parse_args()
    out=Path(args.evidence);out.mkdir(parents=True,exist_ok=True);results=[]
    cases=[]
    formats=[(1280,900,'fr'),(390,844,'en'),(844,390,'fr'),(2560,1080,'en')]
    for mode in ['city','fps']:
        for i,(w,h,lang) in enumerate(formats):cases.append((mode,w,h,lang,False,['extraction','last_signal','infestation','hunt'][i]))
    cases += [('city',390,844,'fr',True,None),('fps',844,390,'en',True,None)]
    with sync_playwright() as p:
        launch={'headless':True,'args':['--no-sandbox']}
        if args.executable:launch['executable_path']=args.executable
        browser=p.chromium.launch(**launch)
        for mode,w,h,lang,is_fault,run_mode in cases:
            name=f'{mode}-{w}x{h}-{lang}-'+('fault' if is_fault else 'lifecycle')
            if args.case and args.case not in name:continue
            print('START '+name,flush=True)
            context=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<900,has_touch=True)
            page=context.new_page();page.set_default_timeout(7000);page.set_default_navigation_timeout(15000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            record={'name':name,'passed':False,'preparedState':True,'injectedFault':is_fault}
            try:
                load_scene(page,mode,lang,args)
                if is_fault:fault(page,mode,lang,out,name)
                elif mode=='city':city(page,context,lang,out,name)
                else:fps(page,context,lang,out,name,run_mode)
                check(not errors,f'uncaught errors: {errors}')
                record['passed']=True
                record['media']=page.evaluate('({images:window.__sceneQA.media,offline:window.__offlineMedia||null})')
            except Exception as error:
                record['error']=str(error)
                print('FAIL '+name+': '+str(error),flush=True)
                try:page.screenshot(path=str(out/f'{name}-FAILED.png'),timeout=3000)
                except Exception:pass
            results.append(record);print(json.dumps(record,ensure_ascii=False),flush=True);context.close()
        browser.close()
    report={'scope':'Actual City/Extinction components; prepared ownership; injected terminal states and faults. Not full natural runs or physical touch.','offline':bool(args.offline_dir),'passed':sum(r['passed'] for r in results),'total':len(results),'cases':results}
    (out/'results.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    raise SystemExit(0 if report['passed']==report['total'] else 1)

if __name__=='__main__':main()
