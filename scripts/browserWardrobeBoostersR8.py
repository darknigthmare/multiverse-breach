"""Real PortalScreen + wardrobe in isolation; mock bitmaps, no real account/save/network gameplay."""
import base64,json,os,pathlib,re
from playwright.sync_api import sync_playwright
out=pathlib.Path(os.environ.get('AUDIT_OUTPUT_DIR','/tmp/wardrobe-r8-browser'));out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('BASE_URL','http://127.0.0.1:4173')
png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=')
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for width,lang,scenario in [(390,'fr','paid'),(1280,'en','paid'),(390,'en','free'),(1280,'fr','complete'),(390,'fr','insufficient')]:
  page=browser.new_page(viewport={'width':width,'height':950},reduced_motion='reduce');errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.route(re.compile(r'.*\.(png|webp|jpg|jpeg)(\?.*)?$'),lambda route:route.fulfill(status=200,content_type='image/png',body=png))
  page.add_init_script('Math.random = () => 0.2;')
  page.goto(f'{base}/scripts/fixtures/wardrobe-boosters-r8.html?lang={lang}&scenario={scenario}',wait_until='networkidle')
  page.wait_for_function('!!window.__r8Probe');page.wait_for_timeout(200)
  open_button=page.get_by_role('button',name=re.compile('OUVRIR LE BOOSTER|OPEN BOOSTER'))
  if scenario=='insufficient':
   assert open_button.is_disabled();assert page.evaluate('window.__r8Probe.stats.packsOpened')==0
  else:
   before=page.evaluate('window.__r8Probe');initial_rights=len(before['rights'])
   # Native double click in one JS task: openingGuardRef must permit only one debit/grant.
   open_button.evaluate('(button)=>{button.click();button.click();}')
   page.wait_for_function('window.__r8Probe.stats.packsOpened === 1')
   assert page.evaluate('window.__r8Probe.stats.pulls')==5
   expected=initial_rights+(0 if scenario=='complete' else 1)
   assert page.evaluate('window.__r8Probe.rights.length')==expected
   assert page.evaluate('window.__r8Probe.rights.every(id=>window.__r8Probe.pool.includes(id))')
   if scenario=='free':
    assert page.evaluate('window.__r8Probe.shards')==10000
    assert all(v==0 for v in page.evaluate('window.__r8Probe.collection.freeBoosterCredits').values())
   else:assert page.evaluate('window.__r8Probe.shards')<10000
   reveal=page.get_by_role('button',name=re.compile('TOUT REVELER|REVEAL ALL'));reveal.wait_for();reveal.click()
   receipt=page.locator('aside.wardrobe-booster');receipt.wait_for()
   assert page.locator('.booster-reward-grid > *').count()==5
   if scenario!='complete':assert 'graphismes' in receipt.inner_text().lower() or 'artwork' in receipt.inner_text().lower()
   first=page.evaluate('window.__r8Probe.rights')
   # Simulated component reload retains parent inventory; separate unit tests cover save normalization.
   page.evaluate('window.__r8Remount()');open_button.wait_for();open_button.click()
   page.wait_for_function('window.__r8Probe.stats.packsOpened === 2')
   second=page.evaluate('window.__r8Probe.rights')
   assert len(second)==len(first)+(0 if scenario=='complete' else 1)
   assert len(second)==len(set(second));assert all(x in second for x in first)
   assert page.evaluate('window.__r8Probe.stats.pulls')==10
  assert page.evaluate('Object.keys(localStorage).length')==0
  assert not errors,errors
  page.screenshot(path=str(out/f'boosters-{width}-{lang}-{scenario}.png'),full_page=True)
  results.append({'width':width,'lang':lang,'scenario':scenario,'status':'PASS','jsErrors':errors,
   'scope':'real PortalScreen and wardrobe fixture; bitmap placeholders, no full App or production'})
  page.close()
 browser.close()
(out/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
