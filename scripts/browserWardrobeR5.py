"""Actual React wardrobe fixture, isolated from accounts and player saves."""
import json,os,pathlib
from playwright.sync_api import sync_playwright
out=pathlib.Path(os.environ.get('AUDIT_OUTPUT_DIR','/tmp/wardrobe-r5-browser'));out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('BASE_URL','http://127.0.0.1:4173');results=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for width,lang in [(390,'fr'),(1280,'fr'),(390,'en'),(1280,'en')]:
  page=browser.new_page(viewport={'width':width,'height':900});errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(f'{base}/scripts/fixtures/wardrobe-r5.html?lang={lang}',wait_until='networkidle')
  page.wait_for_function('window.__wardrobeProbe?.id === "leon"')
  assert page.evaluate('Object.keys(localStorage).length')==0
  root=page.locator('.character-wardrobe').first
  root.locator(':scope > summary').click()
  page.get_by_role('button',name='Officiels' if lang=='fr' else 'Official',exact=False).click()
  assert root.locator('article').count()==7
  assert root.get_by_role('button',name='Équiper l’effet' if lang=='fr' else 'Equip effect').count()==0
  refs=root.locator('article a');assert refs.count()==7
  assert all('https://store.steampowered.com/' in refs.nth(i).get_attribute('href') for i in range(7))
  root.get_by_role('button',name='Créations Nexus' if lang=='fr' else 'Nexus concepts').click()
  assert root.locator('article').count()==4
  root.get_by_role('button',name='Effets disponibles' if lang=='fr' else 'Available effects').click()
  root.get_by_role('button',name='Équiper l’effet' if lang=='fr' else 'Equip effect',exact=True).first.click()
  page.wait_for_function('window.__wardrobeProbe?.effect?.endsWith("effect-cyan")')
  assert page.evaluate('window.__wardrobeProbe.unchanged && window.__wardrobeProbe.sourceLocked')
  assert page.evaluate('Array.from(document.querySelector("canvas").getContext("2d").getImageData(0,0,280,100).data).some((x,i)=>i%4===3&&x>0)')
  page.get_by_label('Actor',exact=True).select_option('snake')
  page.wait_for_function('window.__wardrobeProbe.id === "snake" && !window.__wardrobeProbe.effect')
  root.get_by_role('button',name='Officiels' if lang=='fr' else 'Official',exact=False).click()
  assert root.locator('article').count()==0
  assert root.locator('[role=status]').count()==1
  page.get_by_label('Actor',exact=True).select_option('big_boss')
  page.wait_for_function('window.__wardrobeProbe.id === "big_boss"')
  assert root.locator('article').count()==3
  page.get_by_label('Actor',exact=True).select_option('leon')
  page.wait_for_function('window.__wardrobeProbe.effect?.endsWith("effect-cyan")')
  root.get_by_role('button',name='Revenir à l’apparence d’origine' if lang=='fr' else 'Restore origin appearance').click()
  page.wait_for_function('!window.__wardrobeProbe.effect')
  # keyboard reaches and toggles the native details; no hidden focus trap.
  summary=root.locator(':scope > summary');summary.focus();page.keyboard.press('Enter');assert not root.evaluate('e=>e.open')
  page.keyboard.press('Enter');assert root.evaluate('e=>e.open')
  enemy=page.get_by_test_id('enemy').locator('.character-wardrobe');enemy.locator(':scope > summary').click()
  enemy.get_by_role('button',name='Effets disponibles' if lang=='fr' else 'Available effects').click()
  assert enemy.get_by_role('button',name='Équiper l’effet' if lang=='fr' else 'Equip effect',exact=True).count()==0
  assert page.evaluate('Object.keys(localStorage).length')==0
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Horizontal overflow'
  assert not errors,errors
  page.screenshot(path=str(out/f'wardrobe-{width}-{lang}.png'),full_page=True)
  results.append({'width':width,'lang':lang,'status':'PASS','jsErrors':errors,'scope':'actual React component fixture, not full App / production / final costume art'})
  page.close()
 browser.close()
(out/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
