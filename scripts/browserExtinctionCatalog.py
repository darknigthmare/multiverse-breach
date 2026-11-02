#!/usr/bin/env python3
"""Real selector, owned identities and FPS asset loads; no balance certification."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect

def main():
 p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:4173');p.add_argument('--evidence',default='/tmp/ec-browser');p.add_argument('--executable');p.add_argument('--require-art',action='store_true');a=p.parse_args()
 out=Path(a.evidence);out.mkdir(parents=True,exist_ok=True);results=[]
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=a.executable,args=['--no-sandbox'])
  for hero,width,height,lang in [('arca_mirelle',1280,900,'fr'),('arthur_kaamelott',1280,900,'en'),('serj_tankian',1280,900,'fr'),('player_anchor',390,844,'en'),('tail',844,390,'fr'),('none',390,844,'fr')]:
   name=f'{hero}-{width}x{height}';rec={'name':name,'passed':False};page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_default_timeout(12000)
   try:
    page.goto(f'{a.url}/scripts/fixtures/city-extinction.html?mode=fps&catalog=full&lang={lang}'+('&owned=none' if hero=='none' else ''),wait_until='networkidle')
    sel=page.get_by_role('combobox');start=page.get_by_role('button',name='DEMARRER RUN' if lang=='fr' else 'START RUN',exact=True)
    if hero=='none':
     expect(start).to_be_disabled();assert sel.locator('option').count()==0
    else:
     assert sel.locator('option').count()==1811
     values=sel.locator('option').evaluate_all('(es)=>es.map(e=>e.value)')
     assert 'bioshock_rapture_tenenbaum' not in values
     target=values[-1] if hero=='tail' else hero
     sel.select_option(target)
     expected=target if target in ['arca_mirelle','arthur_kaamelott','serj_tankian'] else 'schematic'
     expect(page.locator('.extinction-panel')).to_have_attribute('data-viewmodel',expected)
     if a.require_art and expected!='schematic':
      page.wait_for_function('id=>window.__sceneQA.media.some(m=>m.src.includes(id)&&m.src.includes("fps")&&m.loaded)',arg={'arca_mirelle':'arca-mirelle','arthur_kaamelott':'arthur-kaamelott','serj_tankian':'serj-tankian'}[target])
     start.click();page.wait_for_function('window.__sceneQA.state()?.phase==="running"')
     run_id=page.evaluate('window.__sceneQA.state().runId')
     page.locator('.fps-royale-canvas').focus();page.keyboard.press('Space');page.keyboard.press('r')
     page.locator('#qa-pause').click();before=page.evaluate('window.__sceneQA.snapshot()');page.locator('#qa-render').click();page.wait_for_timeout(60)
     assert before==page.evaluate('window.__sceneQA.snapshot()');assert run_id==page.evaluate('window.__sceneQA.state().runId')
     rec['heroId']=target;rec['viewmodel']=expected
    page.screenshot(path=str(out/f'{name}.png'))
    assert not errors,errors
    rec['passed']=True;rec['images']=page.evaluate('window.__sceneQA.media')
   except Exception as e:
    rec['error']=str(e)
    try:page.screenshot(path=str(out/f'{name}-FAILED.png'))
    except Exception:pass
   results.append(rec);print(json.dumps(rec,ensure_ascii=False),flush=True);page.close()
  browser.close()
 report={'passed':sum(r['passed'] for r in results),'total':len(results),'requireArt':a.require_art,'scope':'Prepared ownership; real UI and simulation; not complete runs or art certification.','cases':results}
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));raise SystemExit(0 if report['passed']==len(results) else 1)
if __name__=='__main__':main()
