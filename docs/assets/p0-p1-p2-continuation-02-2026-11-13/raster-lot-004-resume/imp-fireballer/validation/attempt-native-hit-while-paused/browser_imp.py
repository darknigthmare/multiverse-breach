"""Actual GameCanvas/Smash renderer and input, with an explicit synthetic roster.

Before: only the new atlas request is returned as404, matching its absence in
the baseline Git tree. This is a media-availability reproduction on current
code, not an archived pre-change application build. After: exact canonicalPNG.
Animation-cell observations call the real paused engine draw on its own canvas;
the fire sequence itself is activated through the actual opponent UI command.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(ROOT / 'scripts'))
from browserCombatUi import open_arsenal, close_arsenal

ATLAS = '/sprites/generated/bosses/doom/imp-fireballer.png'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4198')
    parser.add_argument('--output', default=str(Path(__file__).parent/'validation/browser'))
    args = parser.parse_args()
    assert urlparse(args.base_url).hostname in ('127.0.0.1','localhost','::1')
    out = Path(args.output)
    out.mkdir(parents=True,exist_ok=True)
    result = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        for availability, width in [('before',1280),('after',1280),('after',390)]:
            errors, bad, media = [], [], []
            context = browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
            context.add_init_script('''
              window.__impDraws=[];
              const original=CanvasRenderingContext2D.prototype.drawImage;
              CanvasRenderingContext2D.prototype.drawImage=function(image,...args){
                if((image.currentSrc||image.src||'').includes('/imp-fireballer.png'))
                  window.__impDraws.push({src:image.currentSrc||image.src,args,naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight});
                if(window.__impDraws.length>2000)window.__impDraws.splice(0,1000);
                return original.call(this,image,...args);
              };
            ''')
            def route(request):
                parsed=urlparse(request.request.url)
                if parsed.hostname not in ('127.0.0.1','localhost','::1'): request.abort(); return
                if parsed.path==ATLAS and availability=='before':
                    request.fulfill(status=404,content_type='text/plain',body='Absent in baseline Git asset tree'); return
                request.continue_()
            context.route('**/*',route)
            page=context.new_page()
            page.set_default_timeout(30000)
            page.on('pageerror',lambda error:errors.append(str(error)))
            def response(r):
                path=urlparse(r.url).path
                if path==ATLAS:media.append({'status':r.status,'sha256':hashlib.sha256(r.body()).hexdigest() if r.status==200 else None})
                if r.status>=400:bad.append({'path':path,'status':r.status})
            page.on('response',response)
            label=f'{availability}-{width}'
            try:
                query=urlencode({'source':'Doom::Imp Fireballer','mode':'Smash','side':'enemy','lang':'en'})
                page.goto(args.base_url+'/scripts/fixtures/signature-support.html?'+query)
                page.wait_for_function('window.__supportAudit?.engine?.signatureDirector')
                page.evaluate('''() => {
                  const a=window.__supportAudit,e=a.engine;
                  e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();e.setPaused(true);
                  const actor=e.enemies[0],foe=e.heroes[0],ground=e.groundY||e.arena?.groundY||e.height-70;
                  for(const u of [...e.heroes,...e.enemies])Object.assign(u,{state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:ground});
                  Object.assign(actor,{x:e.width*0.58,facing:-1});Object.assign(foe,{x:actor.x-180,facing:1});
                  a.actor=actor;a.foe=foe;a.before=foe.currentHp;a.contacts=[];
                  e.selectedEnemyId=actor.battleId||actor.runtimeId||actor.id;
                  const damage=e.applyDamage;e.applyDamage=(...args)=>{a.contacts.push({defender:args[1].name,base:args[2]});return damage(...args);};
                  e.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'),0,'en');
                }''')
                if availability=='after':page.wait_for_function('window.__impDraws.length>0')
                else:page.wait_for_timeout(350)
                samples=[]
                for row,state in enumerate(['idle','run','attack','hit']):
                    for col in range(4):
                        sample=page.evaluate('''([state,col])=>{
                          const a=window.__supportAudit,e=a.engine;
                          a.actor.state=state;window.__impDraws=[];
                          e.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'),col*10,'en');
                          return {state,col,draw:window.__impDraws.at(-1)||null};
                        }''',[state,col])
                        samples.append(sample)
                        if availability=='after':
                            assert sample['draw'] and sample['draw']['args'][:4]==[col*384,row*256,384,256],sample
                            assert [sample['draw']['naturalWidth'],sample['draw']['naturalHeight']]==[1536,1024]
                    page.screenshot(path=str(out/f'{label}-{state}.png'),full_page=True)
                if availability=='before':
                    assert not any(s['draw'] for s in samples)
                    assert any(r['path']==ATLAS and r['status']==404 for r in bad)
                    sequence=None
                else:
                    page.evaluate('''()=>{const a=window.__supportAudit;a.actor.state='idle';a.actor.stateTimer=0;a.actor.specialCharge=100;a.actor.atb=100;a.engine.setPaused(false);}''')
                    open_arsenal(page)
                    page.locator('[data-signature-super="opponent"]').click()
                    page.wait_for_function('window.__supportAudit.engine.signatureDirector.busy')
                    close_arsenal(page)
                    page.wait_for_function('window.__supportAudit.engine.signatureDirector.snapshot()?.tick >= 35')
                    active=page.evaluate('''()=>{const a=window.__supportAudit;return {snapshot:a.engine.signatureDirector.snapshot(),actor:{x:a.actor.x,y:a.actor.y,facing:a.actor.facing,state:a.actor.state},foe:{x:a.foe.x,y:a.foe.y,state:a.foe.state}};}''')
                    page.screenshot(path=str(out/f'{label}-fire-sequence.png'),full_page=True)
                    page.wait_for_function('!window.__supportAudit.engine.signatureDirector.busy',timeout=15000)
                    sequence=page.evaluate('''()=>{const a=window.__supportAudit;a.engine.setPaused(true);return {engineIdentity:{actorSame:a.actor===a.engine.enemies[0],foeSame:a.foe===a.engine.heroes[0],engineDisposed:a.engine.disposed,realActor:{x:a.engine.enemies[0].x,y:a.engine.enemies[0].y,facing:a.engine.enemies[0].facing,state:a.engine.enemies[0].state},realFoe:{x:a.engine.heroes[0].x,y:a.engine.heroes[0].y,state:a.engine.heroes[0].state}},position:{actor:{x:a.actor.x,y:a.actor.y,facing:a.actor.facing,state:a.actor.state},foe:{x:a.foe.x,y:a.foe.y,state:a.foe.state},profile:a.actor.special?.smashProfile},charge:a.actor.specialCharge,contacts:a.contacts,before:a.before,after:a.foe.currentHp,definition:{name:a.definition.name,style:a.definition.style,range:a.definition.range,hits:a.definition.hits},actor:{name:a.actor.name,weapon:a.actor.weapon,incarnation:a.actor.incarnation},canvas:document.querySelector('canvas.combat-stage-canvas').getBoundingClientRect().toJSON()};}''')
                    assert sequence['after']<sequence['before'] and len(sequence['contacts'])==1,{'sequence':sequence,'active':active}
                    assert sequence['charge']<1
                    assert sequence['actor']['weapon']=='fireball'
                    assert sequence['definition']['name']=='Imp Fireball' and sequence['definition']['style']=='fire'
                    assert sequence['definition']['range']==330
                    page.screenshot(path=str(out/f'{label}-fire-result.png'),full_page=True)
                    received_hit=page.evaluate('''()=>{const a=window.__supportAudit,e=a.engine;const before=a.actor.currentHp;window.__impDraws=[];e.applyDamage(a.foe,a.actor,12,0);e.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'),0,'en');return {before,after:a.actor.currentHp,state:a.actor.state,draw:window.__impDraws.at(-1)||null};}''')
                    assert received_hit['after']<received_hit['before'] and received_hit['state']=='hit',received_hit
                    assert received_hit['draw'] and received_hit['draw']['args'][1]==768,received_hit
                    page.screenshot(path=str(out/f'{label}-received-hit.png'),full_page=True)
                    baseline_missing={(r['path'],r['status']) for r in result[0]['httpErrors'] if r['path']!=ATLAS}
                    assert all((r['path'],r['status']) in baseline_missing for r in bad),bad
                assert not errors,errors
                page.locator('#qa-unmount').click()
                page.wait_for_function('window.__supportAudit.engine.disposed')
                result.append({'case':label,'ok':True,'mediaAvailabilityReproduction':availability=='before','mediaResponses':media,'samples':samples,'sequence':sequence,'activeSignature':active if availability=='after' else None,'receivedHit':received_hit if availability=='after' else None,'pageErrors':errors,'httpErrors':bad,
                               'unrelatedMissingAssetsRetained':sorted({r['path'] for r in bad if r['path']!=ATLAS})})
            except Exception as exc:
                page.screenshot(path=str(out/f'{label}-FAILED.png'),full_page=True)
                result.append({'case':label,'ok':False,'error':str(exc),'pageErrors':errors,'httpErrors':bad})
            finally:
                context.close()
                (out/'results.json').write_text(json.dumps(result,indent=2)+'\n')
        browser.close()
    print(json.dumps([{'case':r['case'],'ok':r['ok'],'error':r.get('error')} for r in result]))
    assert len(result)==3 and all(r['ok'] for r in result)

if __name__=='__main__':main()
