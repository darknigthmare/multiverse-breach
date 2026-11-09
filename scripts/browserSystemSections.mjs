import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
import { FIELD_OPERATION_PREFERENCES_KEY } from '../src/game/fieldOperationPreferences.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const profile=process.env.SYSTEM_PROFILE || 'all';
const fixture=resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/system-sections-'+profile);
const evidence=resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/system-sections-evidence/'+profile);
await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined});
const results=[];
const cases=[...[{width:390,height:844},{width:844,height:390},{width:1365,height:900}].flatMap(viewport=>['fr','en'].map(lang=>({viewport,lang,denied:false}))),{viewport:{width:390,height:844},lang:'fr',denied:true}];
try {
  for(const {viewport,lang,denied} of cases) {
    const name=`${viewport.width}x${viewport.height}-${lang}${denied?'-storage-denied':''}`;
    const context=await browser.newContext({viewport,reducedMotion:'reduce'});
    const page=await context.newPage(),errors=[],missing=[];page.setDefaultTimeout(10000);
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)missing.push(response.url());});
    await context.route('http://multiverse.test/**',async route=>{
      const file=resolve(fixture,'.'+new URL(route.request().url()).pathname),rel=relative(fixture,file);
      if(rel==='..'||rel.startsWith('..'+sep))return route.fulfill({status:403,body:'Outside fixture'});
      try {await route.fulfill({body:await readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(file)] || 'application/octet-stream'});}
      catch {await route.fulfill({status:404,body:'Missing fixture resource'});}
    });
    await page.addInitScript(({key,denied})=>{
      localStorage.setItem(key,JSON.stringify({version:1,textScale:1.5,hudScale:1.4,safeArea:32,contrast:'high',motion:'reduced'}));
      if(denied) Object.defineProperty(Storage.prototype,'setItem',{value(){throw new DOMException('Quota denied for test','QuotaExceededError');}});
    },{key:DISPLAY_PREFERENCES_KEY,denied});
    const record={name,viewport,lang,profile,denied,status:'running'};results.push(record);
    try {
      await page.goto(`http://multiverse.test/scripts/fixtures/system-sections.html?lang=${lang}`);
      const installation=await page.evaluate(()=>window.__installation);record.installation=installation;
      if(profile==='base')assert.equal(installation.installedCount,0);
      if(profile==='halo')assert.deepEqual(installation.installedPackIds,['halo']);
      const trigger=page.locator('.game-system-trigger');await trigger.click();
      const dialog=page.getByRole('dialog');await dialog.waitFor();
      assert.equal(await page.locator('#root').evaluate(node=>node.inert),true);
      await page.getByTestId('retained-field').fill('unsent account draft');
      const tabs=page.getByRole('tab');assert.equal(await tabs.count(),3);
      await tabs.nth(0).focus();await page.keyboard.press('ArrowRight');
      assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
      assert.equal(await tabs.nth(1).evaluate(node=>node===document.activeElement),true);
      await page.getByRole('searchbox').fill('Halo');
      assert.deepEqual(await page.locator('.system-pack-list strong').allTextContents(),['Halo']);
      assert.equal(await page.locator('.system-pack-state').getAttribute('data-included'),String(profile!=='base'));
      record.packBounds=await page.locator('.system-pack-panel').evaluate(node=>({scroll:node.scrollWidth,width:node.clientWidth}));
      assert.ok(record.packBounds.scroll<=record.packBounds.width+1);
      await page.screenshot({path:resolve(evidence,`${name}-packs.png`)});
      await page.getByRole('searchbox').fill('not-a-real-universe');assert.equal(await page.locator('.system-pack-list li').count(),0);
      await tabs.nth(1).focus();await page.keyboard.press('End');
      assert.equal(await tabs.nth(2).getAttribute('aria-selected'),'true');
      const selections=page.locator('.system-field-settings select');
      await selections.nth(0).selectOption('cross-check');await selections.nth(1).selectOption('contested');
      const contracts=await page.evaluate(()=>window.__newFieldContracts());
      assert.equal(contracts.relay.contested,true);assert.equal(contracts.recon.dossiers.browser.exhibitGoal,2);
      record.contracts=contracts;
      const notice=await page.locator('.system-field-settings [role="status"]').textContent();
      if(denied)assert.match(notice,/session uniquement/);
      await tabs.nth(2).scrollIntoViewIfNeeded();
      record.tabs=await tabs.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height,x:r.x,right:r.right};}));
      assert.ok(record.tabs.every(box=>box.width>=44&&box.height>=44&&box.x>=32-1&&box.right<=viewport.width-32+1));
      assert.equal(await dialog.evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);
      await page.screenshot({path:resolve(evidence,`${name}-field.png`)});
      await selections.nth(1).scrollIntoViewIfNeeded();
      await page.screenshot({path:resolve(evidence,`${name}-relay.png`)});
      await tabs.nth(2).focus();await page.keyboard.press('Home');
      assert.equal(await page.getByTestId('retained-field').inputValue(),'unsent account draft');
      await page.keyboard.press('ArrowLeft');assert.equal(await tabs.nth(2).getAttribute('aria-selected'),'true');
      await page.keyboard.press('ArrowRight');assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');
      for(let i=0;i<18;i++){await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(node=>node.contains(document.activeElement)),true);}
      await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);
      assert.equal(await trigger.evaluate(node=>node===document.activeElement),true);
      assert.equal(await page.locator('#root').evaluate(node=>node.inert),false);
      if(!denied){
        const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),FIELD_OPERATION_PREFERENCES_KEY);
        assert.equal(saved.relays,'contested');assert.equal(saved.reconnaissance,'cross-check');
        await page.reload();assert.equal((await page.evaluate(()=>window.__newFieldContracts())).relay.contested,true);
      } else {await trigger.click();await tabs.nth(2).click();assert.equal(await selections.nth(1).inputValue(),'contested');}
      assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
      record.status='passed';record.errors=errors;record.missing=missing;
    } catch(error){record.status='failed';record.error=error.message;await page.screenshot({path:resolve(evidence,`${name}-failed.png`)});throw error;}
    finally {await context.close();}
  }
} finally {
  await writeFile(resolve(evidence,'report.json'),JSON.stringify({browser:browser.version(),profile,scope:'Real system menu and field module integration; not a complete City/FPS playthrough',results},null,2));
  await browser.close();
}
console.log(JSON.stringify({passed:results.filter(result=>result.status==='passed').length,total:results.length,profile}));
