"""Read-only collection/booster recipes on loopback, no account or gameplay injection."""
import json
import os
from pathlib import Path
from urllib.parse import urlencode, urlparse
from playwright.sync_api import sync_playwright
base = os.environ.get('AUDIT_BASE_URL', 'http://127.0.0.1:4173')
assert urlparse(base).hostname in ('127.0.0.1', 'localhost')
out = Path(os.environ.get('AUDIT_OUTPUT_DIR', '/tmp/codex-browser'))
out.mkdir(parents=True, exist_ok=True)
cases = [('card','cloud_ff7',390,'fr'),('card','team_fortress_2_medic',1280,'en'),
         ('card','hexen_parias',390,'en'),('card','city_hunter',1280,'fr'),
         ('card','vincent_ff7',390,'fr'),('booster','cloud_ff7',390,'fr'),
         ('booster','hexen_parias',1280,'en'),('booster','city_hunter',390,'en')]
results=[]
with sync_playwright() as p:
    opts={'headless':True,'args':['--no-sandbox']}
    if os.environ.get('AUDIT_CHROMIUM_PATH'): opts['executable_path']=os.environ['AUDIT_CHROMIUM_PATH']
    browser=p.chromium.launch(**opts)
    try:
        for view,actor,width,lang in cases:
            context=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
            context.route('**/*',lambda r:r.continue_() if urlparse(r.request.url).hostname in ('127.0.0.1','localhost') else r.abort())
            page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            label=f'{view}-{actor}-{width}-{lang}'
            try:
                page.goto(base+'/scripts/fixtures/signature-codex.html?'+urlencode({'view':view,'actor':actor,'lang':lang}))
                page.locator('#qa-open').click();dialog=page.get_by_role('dialog');dialog.wait_for()
                assert page.evaluate('window.__codexAudit.requestedActor') == actor
                assert page.evaluate('window.__codexAudit.resolvedActor') == actor
                expected=page.evaluate('window.__codexAudit.expected')
                if expected:
                    source=dialog.locator('[data-signature-codex]');source.wait_for()
                    assert source.count()==1
                    source.locator('summary').click()
                    assert expected in source.inner_text()
                    assert source.locator('a').get_attribute('href').startswith('https://')
                    assert 'non certif' in source.inner_text() if lang=='fr' else 'not certified' in source.inner_text()
                    assert 'Origin Burst' not in dialog.inner_text()
                    paragraphs=source.locator('p').evaluate_all('(els)=>els.map(el=>({font:parseFloat(getComputedStyle(el).fontSize),space:getComputedStyle(el).whiteSpace,overflow:getComputedStyle(el).overflow,client:el.clientWidth,scroll:el.scrollWidth}))')
                    assert paragraphs and all(p['font'] >= 12 and p['space'] == 'normal' and p['overflow'] != 'hidden' and p['scroll'] <= p['client'] + 1 for p in paragraphs), paragraphs
                else:
                    page.wait_for_timeout(300)
                    assert dialog.locator('[data-signature-codex]').count()==0
                    assert 'Texte sans contrat' in dialog.inner_text()
                assert '[object Object]' not in dialog.inner_text()
                if view=='card':
                    assert 'QA object provenance' in dialog.inner_text()
                    favorite=dialog.locator('.tcg-favorite-button');favorite.click()
                    assert favorite.get_attribute('aria-pressed')=='true'
                    assert page.evaluate('window.__codexAudit.changes.length')==1
                else:
                    dialog.get_by_role('searchbox').fill(expected)
                    assert dialog.locator('[data-signature-codex]').count()==1
                    assert page.evaluate('window.__codexAudit.selections.length')==0
                # Tab through summaries and disclosed links without escaping the modal.
                dialog.locator('button').first.focus()
                for _ in range(18):
                    page.keyboard.press('Tab')
                    assert dialog.evaluate('(el)=>el.contains(document.activeElement)')
                dialog.locator('button').first.focus();page.keyboard.press('Shift+Tab')
                assert dialog.evaluate('(el)=>el.contains(document.activeElement)')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
                assert page.evaluate('window.__codexAudit.source === JSON.stringify(window.__codexAudit.hero)')
                assert page.evaluate('window.__codexAudit.storage === JSON.stringify(Object.entries(localStorage))')
                page.screenshot(path=str(out/(label+'.png')),full_page=True)
                page.keyboard.press('Escape');dialog.wait_for(state='detached')
                assert page.locator('#qa-open').evaluate('(el)=>document.activeElement===el')
                assert page.evaluate('window.__codexAudit.closes')==1
                assert not errors,errors
                results.append({'case':label,'ok':True})
            except Exception as exc:
                failure={'case':label,'ok':False,'error':str(exc),'pageErrors':errors}
                results.append(failure)
                try:
                    page.screenshot(path=str(out/(label+'-FAILED.png')),full_page=True,timeout=5000)
                except Exception as screenshot_error:
                    failure['screenshotError']=str(screenshot_error)
            finally:
                context.close();(out/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
    finally:browser.close()
print(json.dumps(results,indent=2))
assert len(results)==len(cases) and all(r['ok'] for r in results)
