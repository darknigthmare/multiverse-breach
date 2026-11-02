#!/usr/bin/env python3
"""Source-bound FPS controls and actual City exhibit approach. Prepared targets/ownership.
--offline-bundle uses an inline scene build with memory storage and local Image bytes,
for containers where browser networking is administratively blocked. No policy changes.
"""
import argparse,base64,json,mimetypes
from datetime import datetime,timezone
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
from mosaicMotionProof import validate_mosaic_motion
ROOT=Path(__file__).resolve().parents[1]

def open_scene(page,args,mode,lang):
    params=f'?mode={mode}&lang={lang}'+('&catalog=full' if mode=='fps' else '')
    if not args.offline_bundle:
        page.goto(f'{args.url}/scripts/fixtures/city-extinction.html{params}',wait_until='networkidle')
        return
    bundle=Path(args.offline_bundle)
    page.set_content('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div></body></html>')
    def read_asset(value):
        if not isinstance(value,str) or not value.startswith('/'):return 'data:image/png;base64,'
        f=(ROOT/'public'/value.lstrip('/')).resolve()
        if not f.is_relative_to((ROOT/'public').resolve()) or not f.is_file() or f.suffix.lower() not in {'.png','.jpg','.webp'}:return 'data:image/png;base64,'
        return 'data:'+str(mimetypes.guess_type(f)[0])+';base64,'+base64.b64encode(f.read_bytes()).decode()
    page.expose_function('__readOfflineQaAsset',read_asset)
    page.evaluate('''params=>{window.__sceneQaParams=params;
      for(const name of ['localStorage','sessionStorage']) {const m=new Map();Object.defineProperty(window,name,{value:{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),clear:()=>m.clear()}});}
      const Native=Image;window.Image=class extends Native {set src(v){this.logical=v;window.__readOfflineQaAsset(v).then(data=>{super.src=data;});}get src(){return this.logical;}get currentSrc(){return this.logical;}};
    }''',params)
    page.add_style_tag(content=next(bundle.glob('*.css')).read_text())
    page.add_script_tag(content=(bundle/'scene.js').read_text())

def fps(page,args,identity,lang,out,name):
    open_scene(page,args,'fps',lang)
    page.get_by_role('combobox').select_option(identity)
    page.clock.install(time=datetime(2026,10,28,tzinfo=timezone.utc));page.clock.pause_at(datetime(2026,10,28,0,1,tzinfo=timezone.utc))
    page.get_by_role('button',name='DEMARRER RUN' if lang=='fr' else 'START RUN',exact=True).click()
    page.clock.run_for(100)
    # Prepare a position-controlled high-HP target. No granted charge, casts, victories or rewards.
    page.evaluate('''()=>{const s=window.__sceneQA.state();s.hp=Math.min(s.hp,30);s.enemies=[{kind:'Traqueur',wx:s.px,wy:s.py+1.8,hp:99999,maxHp:99999,dmg:0,speed:0,size:1,color:'#dd6d66'}];}''')
    run=page.evaluate('window.__sceneQA.state().runId')
    canvas=page.locator('.fps-royale-canvas');canvas.focus()
    for _ in range(13):
        page.evaluate('''()=>{const s=window.__sceneQA.state(),e=s.enemies[0];e.wx=s.px+Math.sin(s.angle)*1.8;e.wy=s.py+Math.cos(s.angle)*1.8;}''')
        page.keyboard.press('Space');page.clock.run_for(470)
    charge=page.evaluate('window.__sceneQA.state().protocols.charge')
    assert charge==100,f'charge not earned by thirteen native attacks: {charge}'
    for slot in ['secondary','defense','special']:
        button=page.locator(f'[data-protocol="{slot}"]');expect(button).to_be_enabled()
        box=button.bounding_box();vw=page.viewport_size['width'];vh=page.viewport_size['height']
        assert box and box['width']>=80 and box['x']>=0 and box['x']+box['width']<=vw+1 and box['y']+box['height']<=vh+1,('unusable protocol button',slot,box)
        button.click();page.clock.run_for(100)
        assert page.evaluate(f'window.__sceneQA.state().protocols.casts.{slot}')==1
        expect(button).to_be_disabled()
    assert page.evaluate('window.__sceneQA.state().protocols.charge')==0
    page.screenshot(path=str(out/f'{name}-protocols.png'))
    page.locator('#qa-pause').click()
    before=page.evaluate('JSON.stringify(window.__sceneQA.state().protocols)')
    page.clock.run_for(2000);canvas.focus();page.keyboard.press('f');page.keyboard.press('c');page.keyboard.press('x')
    page.locator('#qa-render').click();page.clock.run_for(100)
    assert before==page.evaluate('JSON.stringify(window.__sceneQA.state().protocols)'),'pause or parent render advanced protocol state'
    assert run==page.evaluate('window.__sceneQA.state().runId')
    page.locator('#qa-pause').click();page.clock.run_for(100)
    page.locator('#qa-exit').click();page.clock.run_for(100)
    reports=page.evaluate('window.__sceneQA.reports')
    assert len(reports)==1 and reports[0].get('reason')!='completed'
    assert page.evaluate('window.__sceneQA.state().protocols.projectiles.length')==0,'exit kept stale projectiles'
    return {'owner':identity,'sourceActions':4,'primaryCasts':13,'earnedCharge':charge,'preparedTargets':True,'endReports':len(reports)}

def city(page,args,lang,out,name):
    open_scene(page,args,'city',lang)
    later=page.get_by_role('button',name='Plus tard' if lang=='fr' else 'Later',exact=True)
    if later.is_visible():later.click()
    page.locator('#qa-unmount').click()
    page.evaluate("window.__sceneQA.setLocation({districtId:'universe-nexus-de-convergence',zoneId:'universe-nexus-de-convergence',player:{x:460,y:730}});window.__sceneQA.remount()")
    page.wait_for_function('window.__sceneQA.state()?.npcs')
    page.clock.install(time=datetime(2026,10,28,tzinfo=timezone.utc));page.clock.pause_at(datetime(2026,10,28,0,1,tzinfo=timezone.utc));page.clock.run_for(150)
    page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()
    section=page.locator('.mosaic-exhibit-section');expect(section).to_be_visible()
    expect(section.locator('[data-exhibit-id]')).to_have_count(3)
    search=section.get_by_role('searchbox');search.fill('impossible-id-nothing');expect(section.locator('[data-exhibit-id]')).to_have_count(0);search.fill('')
    first=section.locator('[data-exhibit-id]').first
    first.get_by_role('button',name='LIRE LA FICHE' if lang=='fr' else 'READ RECORD',exact=True).click()
    expect(section.locator('.mosaic-exhibit-record')).to_be_visible()
    title=first.locator('strong').inner_text()
    approach=first.get_by_role('button',name='REJOINDRE LA VITRINE' if lang=='fr' else 'APPROACH DISPLAY',exact=True)
    # Observe the native click before React and after bubbling, then each frame.
    # Playwright can advance its clock during actionability checks; compare with
    # actual simulation ticks, not an assumed 100 ms across multiple tool calls.
    approach.evaluate("""button=>{
      const read=()=>{const s=window.__sceneQA.state();return {t:s.t,x:s.player.x,y:s.player.y,speed:s.player.speed};};
      const proof={samples:[]};window.__exhibitMotionProof=proof;
      let frame=0,active=false;
      const capture=event=>{if(event.composedPath().includes(button))proof.clickBefore=read();};
      const observe=()=>{if(!active)return;proof.samples.push(read());frame=requestAnimationFrame(observe);};
      const bubble=event=>{if(event.composedPath().includes(button)){
        proof.clickAfter=read();active=true;frame=requestAnimationFrame(observe);
      }};
      document.addEventListener('click',capture,true);window.addEventListener('click',bubble);
      window.__stopExhibitMotionProof=()=>{
        active=false;cancelAnimationFrame(frame);proof.samples.push(read());
        document.removeEventListener('click',capture,true);window.removeEventListener('click',bubble);
        return proof;
      };
    }""")
    approach.click()
    expect(page.get_by_role('dialog')).to_have_count(0)
    # Explicitly exercise delayed observation in ultrawide without writing position.
    page.clock.run_for(240 if page.viewport_size['width']>=2560 else 100)
    for _ in range(80):
        page.clock.run_for(100)
        if page.get_by_role('dialog').count():break
    expect(page.get_by_role('dialog')).to_have_count(1)
    record=page.locator('.mosaic-exhibit-record');expect(record).to_contain_text(title)
    proof=page.evaluate('window.__stopExhibitMotionProof()')
    (out/f'{name}-motion.json').write_text(json.dumps(proof,indent=2))
    motion=validate_mosaic_motion(proof)
    page.screenshot(path=str(out/f'{name}-display.png'))
    frozen=page.evaluate('window.__sceneQA.snapshot()');page.clock.run_for(1000);assert frozen==page.evaluate('window.__sceneQA.snapshot()')
    assert page.evaluate('window.__sceneQA.services.length')==0
    page.keyboard.press('Escape');page.clock.run_for(50)
    return {'exhibit':title,'walked':True,'teleported':False,'grantedItems':0,'sourceLookup':True,'motion':motion}

def main():
    p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:4173');p.add_argument('--evidence',default='/tmp/ec-protocols');p.add_argument('--executable');p.add_argument('--offline-bundle');p.add_argument('--case',default='');a=p.parse_args()
    out=Path(a.evidence);out.mkdir(parents=True,exist_ok=True);results=[]
    cases=[('fps',i,1280,900,'fr') for i in ['player_anchor','arca_mirelle','arca_bastion','arca_nova','arca_marrow','arca_sable','arca_loom']]
    cases += [('fps','arca_mirelle',390,844,'en'),('fps','arca_sable',844,390,'fr'),('fps','arca_marrow',2560,1080,'en')]
    cases += [('city','nexus',w,h,lang) for w,h,lang in [(390,844,'en'),(844,390,'fr'),(1280,900,'fr'),(2560,1080,'en')]]
    with sync_playwright() as pw:
        b=pw.chromium.launch(headless=True,args=['--no-sandbox'],**({'executable_path':a.executable} if a.executable else {}))
        for mode,id,w,h,lang in cases:
            name=f'{mode}-{id}-{w}x{h}-{lang}'
            if a.case and a.case not in name:continue
            page=b.new_page(viewport={'width':w,'height':h});page.set_default_timeout(12000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));r={'name':name,'passed':False}
            try:
                r.update(fps(page,a,id,lang,out,name) if mode=='fps' else city(page,a,lang,out,name))
                assert not errors,errors;r['passed']=True
            except Exception as e:
                r['error']=str(e)
                try:page.screenshot(path=str(out/f'{name}-FAILED.png'),timeout=2000)
                except Exception:pass
            results.append(r);print(json.dumps(r,ensure_ascii=False),flush=True);page.close()
        b.close()
    report={'passed':sum(r['passed'] for r in results),'total':len(results),'offline':bool(a.offline_bundle),'scope':'Actual React scenes; prepared ownership and positioned targets, charge earned through primary controls; virtual time. Not complete runs, balance, physical hardware, cloud or exhaustive art review.','cases':results}
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));raise SystemExit(0 if results and report['passed']==len(results) else 1)
if __name__=='__main__':main()
