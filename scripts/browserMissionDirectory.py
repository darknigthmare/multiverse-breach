"""Exercise the actual Hub mission-directory callbacks with prepared parent state.

The all-DLC fixture is code only. No complete campaign, disk-save persistence,
media distribution or art-fidelity certification is implied.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.request import urlopen
from playwright.sync_api import sync_playwright, expect
ROOT = Path(__file__).resolve().parent.parent


def visible_focus(page, locator):
    expect(locator).to_be_focused()
    point = locator.evaluate('''n=>{const r=n.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;return {top:r.top,bottom:r.bottom,visible:[[x,y],[r.left+4,y],[r.right-4,y],[x,r.top+4],[x,r.bottom-4]].every(([px,py])=>n.contains(document.elementFromPoint(px,py)))}}''')
    assert point['visible'], point
    return point


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4196')
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    with urlopen(args.base_url + '/fixture-profile.json') as response:
        profile = json.load(response)
    report = {'scope': __doc__, 'compiledFixture': profile, 'cases': []}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        for name, width, height, scale in [('desktop',1440,1000,1), ('mobile',390,844,1), ('mobile-150',390,844,1.5), ('mobile-200',390,844,2)]:
            for lang in ['fr','en']:
                context = browser.new_context(viewport={'width':width,'height':height}, reduced_motion='reduce')
                context.route('https://fonts.googleapis.com/**', lambda r:r.abort())
                context.route('https://fonts.gstatic.com/**', lambda r:r.abort())
                page = context.new_page(); errors=[]; failures=[]
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('response', lambda r: failures.append({'status':r.status,'url':r.url}) if r.status>=400 else None)
                page.goto(f'{args.base_url}/scripts/fixtures/mission-directory.html?lang={lang}', wait_until='domcontentloaded')
                page.wait_for_selector('[data-mission-id]', timeout=60000)
                page.evaluate("s=>document.documentElement.style.setProperty('--game-text-scale',s)", scale)
                directory = page.locator('.mission-directory-workspace'); cards = directory.locator('article'); search = directory.locator('input[type=search]')
                expect(cards).to_have_count(9)
                initial = page.evaluate('structuredClone(window.__missionDirectoryQA.model)')
                search.fill('CRETE AUBE')
                expect(cards).to_have_count(1); expect(cards.first).to_have_attribute('data-mission-id','47003')
                blocked = cards.first.locator('.mission-directory-launch'); expect(blocked).to_be_disabled()
                reason = cards.first.locator('.mission-directory-reason'); expect(reason).not_to_have_text('')
                assert blocked.get_attribute('aria-describedby') == reason.get_attribute('id')
                cards.first.locator('.mission-directory-actions button').first.focus(); page.keyboard.press('Enter')
                expect(page.locator('.rift-briefing-panel')).to_contain_text('47003')
                expect(page.get_by_test_id('selected-briefing-deploy')).to_be_disabled()
                assert page.evaluate('window.__missionDirectoryQA.launches') == []
                page.get_by_role('tab',name=re.compile('^MISSIONS')).click()
                directory = page.locator('.mission-directory-workspace'); cards=directory.locator('article'); search=directory.locator('input[type=search]')
                search.fill('coordinate-no-match-qa'); expect(cards).to_have_count(0)
                directory.locator('.mission-directory-empty button').click(); focus=visible_focus(page,search); expect(cards).to_have_count(9)
                directory.locator('select').select_option('locked'); expect(cards).to_have_count(6)
                assert all(b for b in cards.locator('.mission-directory-launch').evaluate_all('nodes=>nodes.map(n=>n.disabled)'))
                directory.locator('.mission-directory-controls > button').click(); visible_focus(page,search)
                assert page.evaluate('structuredClone(window.__missionDirectoryQA.model)') == initial, 'filter/briefing changed parent save/rewards'
                expect(cards).to_have_count(9)
                first=cards.first; details=first.locator('details'); details.locator('summary').focus(); page.keyboard.press('Enter')
                expect(details).to_have_attribute('open','')
                body_font=float(details.locator('p').evaluate('n=>getComputedStyle(n).fontSize').removesuffix('px'))
                assert abs(body_font-15*scale)<.01, (scale,body_font)
                page.keyboard.press('Enter'); expect(details).not_to_have_attribute('open','')
                first.locator('h5').evaluate("n=>n.scrollIntoView({block:'end'})")
                page.screenshot(path=str(out/f'{name}-{lang}-mission.png'))
                if lang=='fr' and name in ['desktop','mobile-200']:
                    directory.locator('.mission-directory-controls').evaluate("n=>n.scrollIntoView({block:'end'})")
                    page.screenshot(path=str(out/f'{name}-{lang}-controls.png'))
                geometry=directory.evaluate('''n=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,minButtonHeight:Math.min(...[...n.querySelectorAll('button')].map(b=>b.getBoundingClientRect().height)),selectFont:getComputedStyle(n.querySelector('select')).fontSize})''')
                assert geometry['scrollWidth']<=width, geometry
                assert geometry['minButtonHeight']>=44, geometry
                first.locator('.mission-directory-launch').focus();page.keyboard.press('Enter')
                assert page.evaluate('window.__missionDirectoryQA.launches') == [47001], 'ordinary Hub callback did not launch exact available mission'
                assert page.evaluate('structuredClone(window.__missionDirectoryQA.model)') == initial, 'launching from directory changed rewards/save model'
                assert not errors,errors;assert not failures,failures
                case={'size':name,'lang':lang,'scale':scale,'bodyFont':body_font,'resetFocus':focus,'launchedStage':47001,'lockedBriefing':47003,'parentStateUnchanged':True,'pageErrors':errors,'failedResponses':failures,**geometry}
                report['cases'].append(case);print(json.dumps(case,ensure_ascii=False),flush=True);context.close()
        # A real larger route verifies paging independently of the nine side-act missions.
        for lang in ['fr','en']:
            context=browser.new_context(viewport={'width':390,'height':844}, reduced_motion='reduce');context.route('https://fonts.googleapis.com/**',lambda r:r.abort());context.route('https://fonts.gstatic.com/**',lambda r:r.abort());page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(f'{args.base_url}/scripts/fixtures/mission-directory.html?lang={lang}&route=originalWorlds',wait_until='domcontentloaded');page.wait_for_selector('[data-mission-id]',timeout=60000)
            page.evaluate("document.documentElement.style.setProperty('--game-text-scale',1.5)")
            directory=page.locator('.mission-directory-workspace');cards=directory.locator('article');expect(cards).to_have_count(12)
            first_ids=cards.evaluate_all('nodes=>nodes.map(n=>n.dataset.missionId)');initial=page.evaluate('structuredClone(window.__missionDirectoryQA.model)')
            next_button=directory.get_by_role('button',name='Page suivante' if lang=='fr' else 'Next page',exact=True)
            next_button.focus();page.keyboard.press('Enter');expect(directory.locator('.mission-directory-pages > span')).to_have_text('Page 2 / 5')
            focus=visible_focus(page,directory.locator('.mission-directory-results'));next_ids=cards.evaluate_all('nodes=>nodes.map(n=>n.dataset.missionId)');assert len(set(first_ids+next_ids))==24
            directory.get_by_role('button',name='Page précédente' if lang=='fr' else 'Previous page',exact=True).click();expect(directory.locator('.mission-directory-pages > span')).to_have_text('Page 1 / 5')
            assert cards.evaluate_all('nodes=>nodes.map(n=>n.dataset.missionId)')==first_ids
            assert page.evaluate('structuredClone(window.__missionDirectoryQA.model)')==initial
            assert page.evaluate('window.__missionDirectoryQA.launches')==[]
            assert not errors,errors
            report['cases'].append({'size':'mobile-150-real-route','lang':lang,'sourceCount':60,'visibleCount':12,'firstPageIds':first_ids,'secondPageIds':next_ids,'pageFocus':focus,'parentStateUnchanged':True,'pageErrors':errors});context.close()
        browser.close()
    report['sourceSha256']={file:hashlib.sha256((ROOT/file).read_bytes()).hexdigest() for file in profile['sourceSha256']}
    assert report['sourceSha256']==profile['sourceSha256'], 'scope sources changed after build'
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')


if __name__=='__main__':main()
