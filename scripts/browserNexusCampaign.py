#!/usr/bin/env python3
"""Real City conversations and five FPS campaign kits with native controls.
Ownership and one high-HP enemy are prepared, never casts, charge,
damage, kills or endings. City evidence uses the existing walking playthrough.
"""
import argparse
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
from browserCityExtinction import check
from browserResidentViewmodels import CLOCK_EPOCH, CLOCK_START, prepare_fps_clock
from browserSceneServices import aim, scenario_seed
from browserCityFpsOperations import begin_walk_proof, DISTRICT
from browserFieldVariants import cross_check
from mosaicMotionProof import validate_mosaic_motion


def load(page, args, mode, lang, catalog='nexus'):
    page.goto(f'{args.url}/scripts/fixtures/city-extinction.html?mode={mode}&lang={lang}&catalog={catalog}', wait_until='networkidle')
    page.wait_for_function('window.__sceneQA?.state()')
    if args.require_art:
        page.wait_for_function('window.__sceneQA.media.length > 0 && window.__sceneQA.media.every(item=>item.loaded)', timeout=25000)
        backdrop = '/images/campaign-oc/chapter-01-atrium-v1.png' if mode == 'city' else '/backgrounds/lore-stages/nexus-de-convergence/rpg.webp'
        check(page.evaluate('src=>window.__sceneQA.media.some(item=>item.src===src&&item.loaded)', backdrop), 'real backdrop did not decode')


def read(page):
    return page.evaluate('''()=>{const s=window.__sceneQA.state();return {
      phase:s.phase,runId:s.runId,t:s.t,px:s.px,py:s.py,angle:s.angle,hp:s.hp,maxHp:s.maxHp,
      ammo:s.ammo,reserveAmmo:s.reserveAmmo,enemies:s.enemies,protocols:s.protocols};}''')


def reading_scale(page, selector, out, name):
    """Measure actual terminal copy and labels after root layout has settled.

    The City clock is paused while a terminal is open. Finish only the CSS
    transitions on the measured text, so a font-size transition cannot be
    mistaken for the final preference or require an unfrozen simulation clock.
    """
    measurements = {}
    text_selector = 'p, h3, h4, summary, strong, li, button, .mosaic-dialogue-heading > span, nav > span'
    for label, scale in [('normal', 1), ('large', 1.5)]:
        page.evaluate('scale=>document.documentElement.style.setProperty("--game-text-scale",String(scale))', scale)
        page.wait_for_function('size=>parseFloat(getComputedStyle(document.documentElement).fontSize)===size', arg=16*scale)
        measurements[label] = page.locator(selector).evaluate('''(panel, textSelector)=>{
          const nodes=Array.from(panel.querySelectorAll(textSelector));
          // Force layout before finishing the transitions started by this change.
          panel.getBoundingClientRect();
          for(const node of nodes) {
            node.getBoundingClientRect();
            for(const animation of node.getAnimations()) {
              if(animation instanceof CSSTransition) animation.finish();
            }
          }
          return {
            root:parseFloat(getComputedStyle(document.documentElement).fontSize),
            scale:document.documentElement.style.getPropertyValue('--game-text-scale'),
            text:nodes.map(node=>({tag:node.tagName.toLowerCase(),
              label:node.textContent.trim().slice(0,80),
              font:parseFloat(getComputedStyle(node).fontSize)}))
          };
        }''', text_selector)
    normal, large = measurements['normal']['text'], measurements['large']['text']
    measurements['ratios'] = [b['font']/a['font'] if a['font']>0 else 0 for a,b in zip(normal,large)]
    (out/f'{name}-reading-scale.json').write_text(json.dumps(measurements,ensure_ascii=False,indent=2))
    check(normal and len(normal)==len(large),'reading scale lost terminal text or labels')
    check(any(item['tag']=='p' for item in normal),'reading scale did not measure a paragraph')
    check(any(item['tag'] in ('button','summary') for item in normal),'reading scale did not measure a control label')
    for a,b,ratio in zip(normal,large,measurements['ratios']):
        check(a['tag']==b['tag'] and a['label']==b['label'],'reading preference changed terminal content')
        check(abs(ratio-1.5)<.01,f'{a["tag"]} {a["label"]!r} does not scale 100% to 150%: {a["font"]} -> {b["font"]}')
    return measurements


def conversation(page, args, lang, out, name):
    page.clock.install(time=CLOCK_EPOCH);page.clock.pause_at(CLOCK_START)
    load(page,args,'city',lang)
    later=page.get_by_role('button',name='Plus tard' if lang=='fr' else 'Later',exact=True)
    if later.is_visible():later.click()
    page.evaluate('''()=>{
      document.documentElement.style.setProperty('--game-hud-scale','1.4');
      document.documentElement.style.setProperty('--game-text-scale','1.5');
      document.documentElement.style.setProperty('--game-safe-area','32px');
    }''')
    terminal=page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True)
    terminal.click()
    directory=page.locator('.mosaic-resident-directory');directory.locator('summary').click()
    directory.get_by_role('searchbox').fill('arca_tessera')
    target=directory.locator('[data-resident-id="arca_tessera"]')
    expect(page.locator('[data-city-conversation]')).to_have_count(0)
    begin_walk_proof(target);target.click()
    try:
        for _ in range(240):
            page.clock.run_for(100)
            if page.locator('[data-city-conversation="arca_tessera"]').count():break
        expect(page.locator('[data-city-conversation="arca_tessera"]')).to_be_visible()
    finally:
        proof=page.evaluate('window.__stopReconnaissanceMotion()')
        (out/f'{name}-walk.json').write_text(json.dumps(proof,indent=2))
    motion=validate_mosaic_motion(proof)
    panel=page.locator('[data-city-conversation="arca_tessera"]')
    expect(panel.locator('[data-dialogue-topic]')).to_have_count(4)
    background=panel.locator('.mosaic-dialogue-background')
    if background.count() and not background.evaluate('(node)=>node.open'):
        background.locator('summary').click()
    before=page.evaluate('window.__sceneQA.snapshot()')
    sources=page.evaluate('''async()=>{
      const {CHARACTER_PLAQUES}=await import('/src/game/characterPlaques.js');return CHARACTER_PLAQUES.arca_tessera;
    }''')
    for topic,field in [('origin','dossier'),('doctrine','doctrine'),('breach','breachLore'),('risk','threat')]:
        button=panel.locator(f'[data-dialogue-topic="{topic}"]');button.click()
        record=panel.locator(f'[data-dialogue-record="{topic}"]')
        expect(record.locator('p')).to_have_text(sources[field][lang])
        box=button.bounding_box()
        check(box and box['width']>=44 and box['height']>=44 and box['x']>=0 and box['x']+box['width']<=page.viewport_size['width']+1,'conversation topic is clipped or too small')
        page.keyboard.press('d');page.keyboard.press('e');page.clock.run_for(240)
        check(page.evaluate('window.__sceneQA.snapshot()')==before,'conversation advanced the City or forwarded gameplay input')
    check(not page.evaluate('window.__sceneQA.reconnaissanceSaves.length'),'reading an unaccepted conversation granted proof')
    typography=reading_scale(page,'[data-city-conversation="arca_tessera"]',out,name)
    check(page.evaluate('window.__sceneQA.snapshot()')==before,'reading preference advanced the City')
    page.mouse.move(0,0)
    page.screenshot(path=str(out/f'{name}-conversation.png'),animations='disabled')
    panel.locator('[data-dialogue-record="risk"]').scroll_into_view_if_needed()
    page.screenshot(path=str(out/f'{name}-reading.png'),animations='disabled')
    panel.locator('[data-dialogue-return]').click();expect(page.get_by_role('dialog')).to_have_count(0)
    expect(page.locator('.mosaic-rpg-canvas')).to_be_focused()
    page.clock.run_for(32)
    check(not page.evaluate('Object.values(window.__sceneQA.snapshot().keys).some(Boolean)'),'conversation left movement held')
    check(not page.evaluate('window.__sceneQA.reports.length'),'conversation produced rewards')
    return {'resident':'arca_tessera','sourceTopics':4,'nativeWalk':motion,'sourceParagraphsVerified':True,'preparedOwnership':True,'readingScale':typography}


def ledger(page,args,lang,out,name):
    page.clock.install(time=CLOCK_EPOCH);page.clock.pause_at(CLOCK_START)
    load(page,args,'city',lang,'default')
    record=cross_check(page,lang,out,name)
    page.get_by_role('button',name='TERMINAL · JOURNAL',exact=True).click()
    section=page.locator('.mosaic-evidence-ledger');section.locator('summary').click()
    entry=section.locator(f'[data-reconnaissance-record="{DISTRICT}"]')
    expect(entry).to_contain_text('Report submitted' if lang=='en' else 'Rapport transmis')
    expect(entry.locator('li')).to_have_count(2)
    check('2/2' in entry.inner_text(),'ledger lost distinct evidence count')
    check(len(set(entry.locator('li').all_inner_texts()))==2,'ledger duplicated the same relic')
    typography=reading_scale(page,'.mosaic-evidence-ledger',out,name)
    page.screenshot(path=str(out/f'{name}-ledger.png'),animations='disabled')
    return record | {'ledgerProofs':2,'sourceSaveUnchanged':True,'readingScale':typography}


def fps(page,args,identity,lang,out,name):
    load(page,args,'fps',lang)
    page.get_by_role('combobox').select_option(identity)
    if args.require_art:page.wait_for_function('window.__sceneQA.media.every(item=>item.loaded)',timeout=25000)
    prepare_fps_clock(page)
    seed=scenario_seed('campaign-kit:'+identity)
    page.evaluate('seed=>window.__sceneQA.prepareReplay(seed)',seed)
    page.get_by_role('button',name='DEMARRER RUN' if lang=='fr' else 'START RUN',exact=True).click()
    page.clock.run_for(32)
    page.evaluate('''()=>{const s=window.__sceneQA.state();
      s.enemies=[{id:'campaign-kit-target',kind:'Traqueur',wx:s.px,wy:s.py+1.8,hp:99999,maxHp:99999,dmg:0,speed:0,size:1,color:'#de607e'}];
      if(s.heroId==='arca_nadir')s.hp=Math.min(s.hp,s.maxHp-70);
    }''')
    canvas=page.locator('.fps-royale-canvas');canvas.focus()
    for _ in range(13):
        current=read(page);target=current['enemies'][0];aim(page,current,target['wx'],target['wy'])
        page.keyboard.press('Space');page.clock.run_for(470)
    current=read(page)
    check(current['protocols']['casts']['simple']==13,'primary control did not execute thirteen casts')
    check(current['protocols']['charge']==100,'ultimate charge was not earned through actual attacks')
    secondary=page.locator('[data-protocol="secondary"]');expect(secondary).to_be_enabled()
    before=read(page);secondary.click();after=read(page)
    check(after['protocols']['casts']['secondary']==1,'secondary cast missing')
    extra={}
    if identity=='arca_tessera':
        support=after['protocols']['reflection'];check(support is not None,'reflection was not placed')
        hp=after['enemies'][0]['hp'];page.clock.run_for(1040);after=read(page)
        check(after['enemies'][0]['hp']<hp,'stationary reflection caused no delayed damage')
        extra['reflectionDamage']=hp-after['enemies'][0]['hp']
    elif identity=='arca_nadir':
        anchor=after['protocols']['returnProbe'];expect(secondary).to_be_enabled()
        canvas.focus();page.keyboard.down('w');page.clock.run_for(200);page.keyboard.up('w');page.clock.run_for(32)
        moved=read(page);check(math.hypot(moved['px']-anchor['wx'],moved['py']-anchor['wy'])>.2,'Nadir did not walk away from the probe')
        canvas.focus();page.keyboard.press('f');after=read(page)
        check(math.hypot(after['px']-anchor['wx'],after['py']-anchor['wy'])<1e-8,'probe did not return to its original coordinates')
        check(after['hp']==moved['hp'] and after['ammo']==moved['ammo'],'probe restored health or ammunition')
        check(after['protocols']['returns']==1 and after['protocols']['returnProbe'] is None,'probe was not consumed exactly once')
        expect(secondary).to_be_disabled();extra['nativeReturn']=True
    elif identity=='arca_quillon':
        check(after['protocols']['projectiles'],'warrant was not launched');page.clock.run_for(500)
        check(read(page)['enemies'][0]['hp']<before['enemies'][0]['hp'],'warrant caused no impact')
    elif identity=='arca_elyra':
        check(after['protocols']['buff']>0,'choice buff did not activate')
    else:
        check(after['enemies'][0]['hp']<before['enemies'][0]['hp'],'witness riposte caused no contact')
    page.locator('[data-protocol="defense"]').click();page.clock.run_for(32)
    check(read(page)['protocols']['guard']>0,'defense did not activate')
    current=read(page);target=current['enemies'][0];aim(page,current,target['wx'],target['wy'])
    before=read(page);page.locator('[data-protocol="special"]').click();after=read(page)
    check(after['protocols']['casts']['special']==1 and after['protocols']['charge']==0,'ultimate was not spent exactly once')
    if identity=='arca_nadir':check(after['hp']>before['hp'],'extraction ultimate did not heal')
    page.clock.run_for(400)
    if identity!='arca_nadir':check(read(page)['enemies'][0]['hp']<before['enemies'][0]['hp'],'ultimate caused no real damage')
    page.screenshot(path=str(out/f'{name}-protocols.png'))
    page.locator('#qa-pause').click();paused=read(page);page.clock.run_for(1000)
    canvas.focus();page.keyboard.press('f');page.keyboard.press('c');page.keyboard.press('x')
    check(read(page)==paused,'pause advanced support, combat or cooldowns')
    page.locator('#qa-exit').click();page.clock.run_for(32)
    end=read(page);reports=page.evaluate('window.__sceneQA.reports')
    check(end['protocols']['projectiles']==[] and end['protocols']['effects']==[],'abandonment left effects')
    check(not end['protocols'].get('reflection') and not end['protocols'].get('returnProbe'),'abandonment retained campaign supports')
    check(len(reports)==1 and reports[0]['reason']=='abandoned','kit test produced a completion or duplicate report')
    return {'identity':identity,'seed':seed,'primaryCasts':13,'earnedCharge':100,'preparedEnemy':True,'injectedDamage':False,'nativeControls':True,'endReason':reports[0]['reason']}|extra


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4173')
    parser.add_argument('--evidence',default='/tmp/nexus-campaign');parser.add_argument('--executable')
    parser.add_argument('--require-art',action='store_true');parser.add_argument('--case',default='')
    args=parser.parse_args();out=Path(args.evidence);out.mkdir(parents=True,exist_ok=True)
    cases=[('city','dialogue',w,h,lang) for w,h,lang in [(1280,900,'fr'),(390,844,'en'),(844,390,'fr')]]
    cases+=[('city','ledger',1280,900,'en')]
    cases+=[('fps',identity,1280,900,'fr') for identity in ['arca_tessera','arca_quillon','arca_nadir','arca_elyra','arca_oryn']]
    cases+=[('fps','arca_nadir',390,844,'en'),('fps','arca_tessera',844,390,'en')]
    results=[]
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(headless=True,args=['--no-sandbox'],**({'executable_path':args.executable} if args.executable else {}))
        try:
            for mode,identity,width,height,lang in cases:
                name=f'{mode}-{identity}-{width}x{height}-{lang}'
                if args.case and args.case not in name:continue
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
                if identity=='ledger':context.add_init_script("localStorage.setItem('multiverse_breach_field_options_v1',JSON.stringify({schemaVersion:1,reconnaissance:'cross-check',relays:'standard'}));")
                page=context.new_page();page.set_default_timeout(12000)
                errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
                record={'name':name,'passed':False,'pageErrors':errors};print('START '+name,flush=True)
                try:
                    record.update(fps(page,args,identity,lang,out,name) if mode=='fps' else ledger(page,args,lang,out,name) if identity=='ledger' else conversation(page,args,lang,out,name))
                    check(not errors,str(errors));record['passed']=True
                except Exception as error:
                    record['error']=str(error)
                    try:page.screenshot(path=str(out/f'{name}-FAILED.png'),timeout=2000)
                    except Exception:pass
                finally:
                    results.append(record);context.close()
                    (out/'report.json').write_text(json.dumps({'results':results,'scope':'Real React scenes with prepared ownership/enemy; no injected charge, damage, victories or rewards. Not a balance or artistic certification.'},ensure_ascii=False,indent=2))
                    print(json.dumps(record,ensure_ascii=False),flush=True)
        finally:browser.close()
    check(results and all(row['passed'] for row in results),'Nexus campaign browser failures')

if __name__=='__main__':main()
