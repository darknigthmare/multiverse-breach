"""Capture the production Hub side-act library; --verify exercises its callbacks.

Parent ownership/progress are prepared before mount. This does not simulate a
battle, a campaign completion or real save-file persistence.
"""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4186')
    parser.add_argument('--out', required=True)
    parser.add_argument('--verify', action='store_true')
    parser.add_argument('--edition', choices=['all', 'base', 'thalassa'], default='all')
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'scope': __doc__, 'edition': args.edition, 'cases': []}
    if args.verify:
        with urlopen(f'{args.base_url}/fixture-profile.json') as response:
            report['compiledFixture'] = json.load(response)
        assert report['compiledFixture']['name'] == args.edition
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        try:
            for size, width, height, scale in [('desktop', 1440, 1000, 1), ('mobile', 390, 844, 1), ('mobile-150', 390, 844, 1.5)]:
                for lang in ['fr', 'en']:
                    context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
                    context.route('https://fonts.googleapis.com/**', lambda route: route.abort())
                    context.route('https://fonts.gstatic.com/**', lambda route: route.abort())
                    page = context.new_page()
                    errors, failed = [], []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.on('response', lambda response: failed.append({'status': response.status, 'url': response.url}) if response.status >= 400 else None)
                    preparation = '&progress=partial&reserve=all' if args.edition == 'base' else ''
                    page.goto(f'{args.base_url}/scripts/fixtures/oc-dlc-library.html?lang={lang}{preparation}', wait_until='domcontentloaded')
                    page.wait_for_selector('[data-oc-dlc-pack]', timeout=60000)
                    page.evaluate("scale => document.documentElement.style.setProperty('--game-text-scale', scale)", scale)
                    page.evaluate('document.fonts.ready')
                    page.locator('[data-oc-dlc-pack]').first.scroll_into_view_if_needed()
                    page.screenshot(path=str(out / f'{size}-{lang}-library.png'))
                    geometry = page.evaluate('''() => ({ width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
                      cards:[...document.querySelectorAll('[data-oc-dlc-pack]')].map(card => ({id:card.dataset.ocDlcPack, active:card.dataset.packActive, included:card.dataset.packInstalled,
                        heading:card.querySelector('h4')?.textContent, bodyFont:getComputedStyle(card.querySelector('p')).fontSize,
                        missionFonts:[...card.querySelectorAll('small')].map(node=>getComputedStyle(node).fontSize)})),
                      state:structuredClone(window.__ocLibraryQA.model), completed:window.__ocLibraryQA.completedStages
                    })''')
                    result = {'size': size, 'lang': lang, 'scale': scale, **geometry, 'pageErrors': errors, 'failedMedia': failed}
                    if args.verify:
                        if args.edition == 'base':
                            verify_absent(page, result)
                        else:
                            verify(page, out, f'{size}-{lang}', lang, result)
                            expected_included = 1 if args.edition == 'thalassa' else 3
                            assert sum(card['included'] == 'true' for card in geometry['cards']) == expected_included
                        assert geometry['scrollWidth'] <= width, 'horizontal page overflow'
                        assert not errors, errors
                        assert not failed, failed
                    report['cases'].append(result)
                    print(json.dumps({'size': size, 'lang': lang, 'verified': args.verify, 'overflow': geometry['scrollWidth'] > width, 'errors': errors}, ensure_ascii=False), flush=True)
                    context.close()
        finally:
            browser.close()
    sources = ['src/components/HubScreen.jsx', 'src/components/OcDlcLibrary.jsx', 'src/components/OcDlcLibrary.css', 'src/game/ocDlcLibraryView.js', 'scripts/fixtures/ocDlcLibraryHarness.jsx']
    report['sourceSha256'] = {source: hashlib.sha256((ROOT / source).read_bytes()).hexdigest() for source in sources if (ROOT / source).is_file()}
    if args.verify:
        report['sourceFilesChangedAfterBuild'] = [source for source, expected in report['compiledFixture']['sourceSha256'].items()
                                                if report['sourceSha256'].get(source) != expected]
        assert not report['sourceFilesChangedAfterBuild'], report['sourceFilesChangedAfterBuild']
        for language in ['fr', 'en']:
            normal = next(case for case in report['cases'] if case['size'] == 'mobile' and case['lang'] == language)
            scaled = next(case for case in report['cases'] if case['size'] == 'mobile-150' and case['lang'] == language)
            normal_font = float(normal['cards'][0]['bodyFont'].removesuffix('px'))
            scaled_font = float(scaled['cards'][0]['bodyFont'].removesuffix('px'))
            assert abs(scaled_font / normal_font - 1.5) < .001, 'text scaling did not change computed font size'
    (out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')


def verify(page, out, name, lang, result):
    library = page.locator('.oc-act-library')
    cards = library.locator('[data-oc-dlc-pack]')
    expect(cards).to_have_count(3)
    initial = page.evaluate('structuredClone(window.__ocLibraryQA.model)')
    search = library.locator('input[type="search"]')
    search.fill('MERIDIEN')
    expect(cards).to_have_count(1)
    assert cards.first.get_attribute('data-oc-dlc-pack') == 'oc-dlc-borrowed-hours'
    search.fill('aucun-acte-correspondant-qa')
    expect(cards).to_have_count(0)
    library.locator('.oc-act-empty button').click()
    expect(search).to_be_focused()
    focus_geometry = search.evaluate('''node => {
      const rect=node.getBoundingClientRect(), x=rect.left+rect.width/2, y=rect.top+rect.height/2;
      return {top:rect.top,bottom:rect.bottom,visibleCenter:document.elementFromPoint(x,y) === node};
    }''')
    assert focus_geometry['visibleCenter'], 'reset focused a search field hidden by the Hub header'
    expect(cards).to_have_count(3)
    library.locator('select').select_option('reserve')
    expect(cards).to_have_count(0)
    library.locator('.oc-act-controls > button').click()
    expect(search).to_be_focused()
    assert page.evaluate('structuredClone(window.__ocLibraryQA.model)') == initial, 'search/filter changed parent state'
    first = cards.first
    missions = first.locator('[data-oc-act-missions]')
    missions.locator('summary').focus()
    page.keyboard.press('Enter')
    expect(missions).to_have_attribute('open', '')
    mission_buttons = missions.locator('[data-oc-act-mission]')
    expect(mission_buttons).to_have_count(3)
    assert mission_buttons.nth(0).get_attribute('aria-disabled') == 'false'
    assert mission_buttons.nth(1).get_attribute('aria-disabled') == 'true'
    mission_buttons.nth(1).focus()
    page.keyboard.press('Enter')
    expect(library).to_have_count(1)
    assert page.evaluate('window.__ocLibraryQA.navigationRef.current.briefingStageId') is None, 'locked mission opened briefing'
    first.locator('[data-oc-act-reserve]').click()
    expect(first).to_have_attribute('data-pack-active', 'false')
    expect(first.locator('[data-oc-act-state]')).to_have_text('EN RÉSERVE' if lang == 'fr' else 'IN RESERVE')
    expect(first.locator('.oc-act-next')).to_be_disabled()
    assert page.evaluate('window.__ocLibraryQA.model.hiddenUniverses') == ['Thalassa Mnémique']
    assert mission_buttons.nth(0).get_attribute('aria-disabled') == 'true'
    mission_buttons.nth(0).focus()
    page.keyboard.press('Enter')
    expect(library).to_have_count(1)
    assert page.evaluate('window.__ocLibraryQA.navigationRef.current.briefingStageId') is None
    first.locator('[data-oc-act-reserve]').click()
    expect(first).to_have_attribute('data-pack-active', 'true')
    assert page.evaluate('structuredClone(window.__ocLibraryQA.model)') == initial, 'reserve/restore changed more than its preference'
    mission_buttons.nth(0).scroll_into_view_if_needed()
    page.screenshot(path=str(out / f'{name}-missions-expanded.png'))
    metrics = mission_buttons.evaluate_all('''nodes => nodes.map(node => {
      const title=node.querySelector('.oc-act-mission-title'), small=node.querySelector('small');
      return {id:node.dataset.ocActMission, ariaDisabled:node.getAttribute('aria-disabled'),
        title:title.textContent.trim(), titleClientWidth:title.clientWidth, titleScrollWidth:title.scrollWidth,
        titleWhiteSpace:getComputedStyle(title).whiteSpace, metadataFont:getComputedStyle(small).fontSize,
        height:node.getBoundingClientRect().height};
    })''')
    assert all(item['titleScrollWidth'] <= item['titleClientWidth'] + 1 and item['titleWhiteSpace'] == 'normal' for item in metrics), 'mission title clipped'
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'expanded missions overflowed the page'
    first.locator('.oc-act-next').click()
    page.wait_for_function('window.__ocLibraryQA.navigationRef.current.briefingStageId === 47001 && window.__ocLibraryQA.navigationRef.current.missionWorkspaceView === "map"')
    assert page.evaluate('window.__ocLibraryQA.launches') == [], 'a briefing launched combat'
    assert page.evaluate('structuredClone(window.__ocLibraryQA.model)') == initial
    result['verification'] = {'searchAndEmptyReset': True, 'searchFilterPreservesState': True,
      'keyboardDetails': True, 'lockedMissionBlocked': True, 'reserveBlocksBriefings': True,
      'reserveRoundtripPreservesState': True, 'nextBriefingId': 47001, 'combatNotLaunched': True,
      'resetFocusGeometry': focus_geometry, 'missions': metrics}


def verify_absent(page, result):
    library = page.locator('.oc-act-library')
    cards = library.locator('[data-oc-dlc-pack]')
    expect(cards).to_have_count(3)
    for card in cards.all():
        expect(card).to_have_attribute('data-pack-installed', 'false')
        expect(card).to_have_attribute('data-pack-active', 'false')
        expect(card.locator('[data-oc-act-state]')).to_have_attribute('data-oc-act-state', 'absent')
    expect(library.locator('[data-oc-act-reserve], [data-oc-act-mission], .oc-act-next')).to_have_count(0)
    assert cards.first.locator('progress').get_attribute('value') == '1'
    initial = page.evaluate('structuredClone(window.__ocLibraryQA.model)')
    assert initial['hiddenUniverses'] == ['Thalassa Mnémique', 'Méridien Creux', 'Viridienne Ultime']
    library.locator('select').select_option('reserve')
    expect(cards).to_have_count(0)
    library.locator('select').select_option('absent')
    expect(cards).to_have_count(3)
    library.locator('input[type="search"]').fill('meridien')
    expect(cards).to_have_count(1)
    assert page.evaluate('structuredClone(window.__ocLibraryQA.model)') == initial
    assert page.evaluate('window.__ocLibraryQA.completedStages') == [47001]
    assert page.evaluate('window.__ocLibraryQA.navigationRef.current.briefingStageId') is None
    result['verification'] = {'absentDistinctFromReserve': True, 'noInstallationOrMissionActions': True,
      'savedProgressAndReservePreserved': True, 'searchAndFiltersPreserveState': True}


if __name__ == '__main__':
    main()
