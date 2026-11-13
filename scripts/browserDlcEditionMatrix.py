#!/usr/bin/env python3
"""Exercise the actual system/DLC menu in four compiled distribution profiles.

Parent draft and local storage sentinels are prepared. This is menu integration,
not a real account, installer, campaign or save migration test.
"""
import argparse
import json
import mimetypes
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixtures', default='/tmp/dlc-edition-fixture-matrix')
    parser.add_argument('--out', default='docs/assets/dlc-completion-2026-11-13/ui/AFTER')
    args = parser.parse_args()
    fixtures = Path(args.fixtures).resolve()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        try:
            for profile in ['all', 'base', 'halo', 'pirates']:
                fixture = fixtures / profile
                metadata = json.loads((fixture / 'fixture-profile.json').read_text())
                (out / f'{profile}-fixture-profile.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
                for size, width, height, lang, scale, safe in [('desktop-fr', 1440, 1000, 'fr', 1, 12), ('mobile-en-150', 390, 844, 'en', 1.5, 32)]:
                    name = f'{profile}-{size}'
                    context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
                    def route_fixture(route):
                        path = (fixture / urlsplit(route.request.url).path.lstrip('/')).resolve()
                        if fixture not in path.parents or not path.is_file():
                            route.fulfill(status=404, body='No fixture file')
                            return
                        route.fulfill(body=path.read_bytes(), content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
                    context.route('http://dlc.test/**', route_fixture)
                    context.route('https://fonts.googleapis.com/**', lambda route: route.abort())
                    context.route('https://fonts.gstatic.com/**', lambda route: route.abort())
                    context.add_init_script('''(({scale,safe}) => {
                      localStorage.setItem('multiverse_breach_display_v1',JSON.stringify({version:1,textScale:scale,hudScale:1,safeArea:safe,contrast:'standard',motion:'reduced'}));
                      localStorage.setItem('multiverse_breach_field_options_v1',JSON.stringify({schemaVersion:1,reconnaissance:'cross-check',relays:'contested'}));
                      localStorage.setItem('multiverse_breach_save_v2',JSON.stringify({qaSentinel:true,hiddenUniverses:['Halo'],unlockedHeroes:['jack_sparrow'],activeTeam:['jack_sparrow'],inventory:['qa-preserved-possession']}));
                    })(''' + json.dumps({'scale': scale, 'safe': safe}) + ')')
                    page = context.new_page()
                    page.set_default_timeout(8000)
                    errors, missing = [], []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.on('response', lambda response: missing.append({'url': response.url, 'status': response.status}) if response.status >= 400 else None)
                    record = {'name': name, 'profile': profile, 'lang': lang, 'textScale': scale, 'safeArea': safe, 'screenshots': [], 'passed': False}
                    results.append(record)
                    def shot(state):
                        file = out / f'{name}-{state}.png'
                        page.evaluate('document.fonts.ready')
                        expect(page.get_by_role('tab', selected=True)).to_have_css('background-color', 'rgb(138, 246, 233)')
                        page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
                        page.screenshot(path=str(file))
                        record['screenshots'].append(file.name)
                    try:
                        page.goto(f'http://dlc.test/scripts/fixtures/system-sections.html?lang={lang}', wait_until='domcontentloaded')
                        before_storage = page.evaluate('Object.fromEntries(Object.entries(localStorage))')
                        installation = page.evaluate('window.__installation')
                        assert installation['installedPackIds'] == metadata['expectedIncludedPackIds']
                        assert installation['mode'] == metadata['profile']['mode']
                        record['installation'] = installation
                        trigger = page.locator('.game-system-trigger')
                        assert 'DLC' in trigger.get_attribute('aria-label')
                        trigger.click()
                        expect(page.get_by_role('dialog')).to_be_visible()
                        assert page.locator('#root').evaluate('node=>node.inert')
                        page.get_by_test_id('retained-field').fill('preserved account draft')
                        tabs = page.get_by_role('tab')
                        tabs.nth(0).focus()
                        tabs.nth(0).press('ArrowRight')
                        expect(tabs.nth(1)).to_have_attribute('aria-selected', 'true')
                        panel = page.locator('.system-pack-panel')
                        expect(panel).to_have_attribute('data-edition-mode', installation['mode'])
                        display = panel.evaluate('node=>({rootFont:parseFloat(getComputedStyle(document.documentElement).fontSize),panelFont:parseFloat(getComputedStyle(node).fontSize),scale:getComputedStyle(document.documentElement).getPropertyValue("--game-text-scale").trim()})')
                        assert abs(display['rootFont'] - 16 * scale) < .1, display
                        assert abs(display['panelFont'] - 15 * scale) < .1, display
                        record['display'] = display
                        expect(panel.locator('.system-edition-count strong')).to_have_text(f"{installation['installedCount']} / {installation['availableCount']}")
                        search = page.get_by_role('searchbox')
                        filters = panel.locator('select')
                        rows = panel.locator('.system-pack-list > li')
                        expect(rows).to_have_count(12)
                        query_bounds = search.evaluate('node=>{const r=node.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height};}')
                        assert query_bounds['top'] >= 0 and query_bounds['bottom'] <= height, query_bounds
                        record['initialQueryBounds'] = query_bounds
                        shot('edition')
                        guidance = panel.locator('.dlc-installation-guidance')
                        guidance.locator('summary').focus()
                        guidance.locator('summary').press('Enter')
                        expect(guidance).to_have_attribute('open', '')
                        expect(guidance).to_contain_text('Les possessions et préférences des packs absents restent sauvegardées' if lang == 'fr' else 'Possessions and preferences for absent packs remain saved')
                        shot('preservation-guidance')
                        guidance.locator('summary').press('Space')
                        assert not guidance.evaluate('node=>node.open')
                        first = rows.first.get_attribute('data-pack-id')
                        next_page = panel.locator('.system-pack-pagination').get_by_role('button', name='Suivant' if lang == 'fr' else 'Next', exact=True)
                        next_page.click()
                        expect(next_page).to_be_focused()
                        assert rows.first.get_attribute('data-pack-id') != first
                        expect(panel.locator('.dlc-installation-results')).to_contain_text('Page 2')
                        panel.get_by_role('button', name='Réinitialiser les filtres' if lang == 'fr' else 'Reset filters', exact=True).click()
                        expect(search).to_be_focused()
                        search.fill('meridien creux')
                        expect(rows).to_have_count(1)
                        expect(rows.first).to_have_attribute('data-pack-id', 'meridien-creux')
                        for query, pack_id, label in [('Halo', 'halo', 'halo'), ('Pirates of the Caribbean', 'pirates-of-the-caribbean', 'pirates')]:
                            search.fill(query)
                            expect(rows).to_have_count(1)
                            included = pack_id in installation['installedPackIds']
                            expect(rows.first).to_have_attribute('data-included', str(included).lower())
                            detail = rows.first.locator('details')
                            summary = detail.locator('summary')
                            summary.focus()
                            summary.press('Enter')
                            expect(detail).to_have_attribute('open', '')
                            assert detail.locator('.dlc-installation-content-kinds > li').count() > 0
                            detail.evaluate("node=>node.scrollIntoView({block:'start'})")
                            shot(label + '-detail')
                            summary.press('Space')
                            assert not detail.evaluate('node=>node.open')
                        search.fill('')
                        filters.select_option('artwork')
                        expect(rows).to_have_count(1)
                        expect(rows.first).to_contain_text('Cloud Meadow')
                        rows.first.locator('summary').click()
                        expect(rows.first).to_contain_text('ne déclare pas d’univers jouable' if lang == 'fr' else 'does not declare a playable universe')
                        assert rows.first.locator('.dlc-installation-content-kinds').count() == 0
                        rows.first.evaluate("node=>node.scrollIntoView({block:'start'})")
                        shot('artwork-only')
                        filters.select_option('all')
                        search.fill('aucun-univers-qa-78219')
                        expect(rows).to_have_count(0)
                        expect(panel.locator('.dlc-installation-empty')).to_be_visible()
                        panel.get_by_role('button', name='Voir tous les packs' if lang == 'fr' else 'Show all packs', exact=True).click()
                        expect(search).to_be_focused()
                        expect(rows).to_have_count(12)
                        filters.select_option('installed')
                        expect(filters.locator('option:checked')).to_have_text('Inclus' if lang == 'fr' else 'Included')
                        assert rows.count() == min(12, installation['installedCount'])
                        if profile == 'base':
                            expect(panel.locator('.dlc-installation-empty h4')).to_have_text('Aucun pack DLC inclus' if lang == 'fr' else 'No DLC packs included')
                        if profile == 'all':
                            filters.select_option('missing')
                            expect(panel.locator('.dlc-installation-empty h4')).to_have_text('Tous les packs sont inclus' if lang == 'fr' else 'Every pack is included')
                        shot('inclusion-filter')
                        boxes = panel.evaluate('''node=>({panel:{width:node.clientWidth,scroll:node.scrollWidth},doc:{width:innerWidth,scroll:document.documentElement.scrollWidth},dialog:(()=>{const n=node.closest('[role=dialog]');return {width:n.clientWidth,scroll:n.scrollWidth};})()})''')
                        assert all(box['scroll'] <= box['width'] + 1 for box in boxes.values()), boxes
                        record['bounds'] = boxes
                        record['installControls'] = panel.locator('button').all_text_contents()
                        assert not any(label.strip().lower() in {'install', 'installer', 'download', 'télécharger'} for label in record['installControls'])
                        tabs.nth(1).focus()
                        tabs.nth(1).press('Home')
                        expect(page.get_by_test_id('retained-field')).to_have_value('preserved account draft')
                        for _ in range(12):
                            page.keyboard.press('Tab')
                            assert page.get_by_role('dialog').evaluate('node=>node.contains(document.activeElement)')
                        page.keyboard.press('Escape')
                        expect(page.get_by_role('dialog')).to_have_count(0)
                        expect(trigger).to_be_focused()
                        assert not page.locator('#root').evaluate('node=>node.inert')
                        assert page.evaluate('Object.fromEntries(Object.entries(localStorage))') == before_storage
                        assert not errors and not missing, (errors, missing)
                        record.update(passed=True, storageSentinelsUnchanged=True, draftPreserved=True, focusRestored=True)
                    except Exception as error:
                        record['error'] = str(error)
                        shot('failure')
                    finally:
                        record['pageErrors'], record['failedResponses'] = errors, missing
                        print(json.dumps({'name': name, 'passed': record['passed'], 'error': record.get('error')}, ensure_ascii=False), flush=True)
                        context.close()
        finally:
            browser.close()
    report = {'scope': 'Actual System/DLC menu, native interactions and production profile transformer in four builds. Prepared parent draft and local-storage sentinels; no real account, distribution install, full campaign or save migration validation.', 'results': results}
    (out / 'matrix-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    if not all(row['passed'] for row in results):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
