#!/usr/bin/env python3
"""Verify native Hub actions with prepared, in-memory parent state.

This fixture does not exercise a real account, save-file persistence or a
complete campaign. Rendering, catalogues and action handlers are production.
"""
import argparse
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4179')
    parser.add_argument('--out', default='/tmp/qa-hub-workspaces-after/flows')
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        context.route('https://fonts.googleapis.com/**', lambda route: route.abort())
        context.route('https://fonts.gstatic.com/**', lambda route: route.abort())

        def model(page):
            return page.evaluate('structuredClone(window.__hubQA.model)')

        def run(name, tab, callback, query='', lang='fr'):
            page = context.new_page()
            page.set_default_timeout(10000)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            try:
                page.goto(f'{args.base_url}/scripts/fixtures/hub-workspaces.html?tab={tab}&lang={lang}{query}', wait_until='domcontentloaded')
                page.wait_for_selector('.hub-workspace')
                detail = callback(page) or {}
                assert not errors, errors
                results.append({'name': name, 'passed': True, **detail})
            except Exception as error:
                page.screenshot(path=str(out / f'{name}-failure.png'))
                results.append({'name': name, 'passed': False, 'error': str(error), 'pageErrors': errors})
            finally:
                print(json.dumps(results[-1], ensure_ascii=False), flush=True)
                page.close()

        def inventory(page):
            before = model(page)
            page.get_by_role('button', name=re.compile(r'^Équiper :')).first.click()
            page.wait_for_function('Boolean(window.__hubQA.model.equippedGear.player_anchor)')
            equipped = model(page)
            assert list(equipped['equippedGear']) == ['player_anchor']
            assert equipped['inventory'] == before['inventory']
            assert equipped['gold'] == before['gold'] and equipped['eventTokens'] == before['eventTokens']
            page.locator('.hub-logistics-slot[data-kind="gear"]').get_by_role('button').click()
            page.wait_for_function('!window.__hubQA.model.equippedGear.player_anchor')
            assert model(page)['inventory'] == before['inventory']
            event_actions = page.locator('.hub-logistics-item[data-kind="event"] button')
            assert event_actions.count() > 0
            assert any(event_actions.nth(index).is_disabled() for index in range(event_actions.count()))
            page.locator('[data-catalog="inventory"] input').fill('aucun-objet-qa-87193')
            expect(page.locator('.hub-logistics-items')).to_have_count(0)
            page.get_by_role('button', name='Afficher tout l’inventaire', exact=True).click()
            expect(page.locator('.hub-logistics-item').first).to_be_visible()
            return {'equipUnequipRetainsInventory': True, 'foreignEventDisabled': True, 'emptyReset': True}

        def shop(page):
            before = model(page)
            card = page.locator('.hub-logistics-shop-card').first
            price = int(card.locator('.hub-logistics-price strong').inner_text())
            card.get_by_role('button').click()
            page.wait_for_function('count => window.__hubQA.model.inventory.length === count+1', arg=len(before['inventory']))
            after = model(page)
            assert after['eventTokens'] == before['eventTokens'] - price
            assert after['inventory'][:len(before['inventory'])] == before['inventory']
            expect(card.get_by_role('button')).to_be_disabled()
            assert after['gold'] == before['gold'] and after['equippedGear'] == before['equippedGear']
            page.locator('[data-catalog="shop"] input').fill('aucun-prototype-qa-87193')
            expect(page.locator('.hub-logistics-shop-card')).to_have_count(0)
            page.get_by_role('button', name='Réinitialiser les filtres', exact=True).click()
            expect(page.locator('.hub-logistics-shop-card').first).to_be_visible()
            return {'purchaseAddsOnce': True, 'tokenCost': price, 'ownedButtonDisabled': True, 'emptyReset': True}

        def poor_shop(page):
            before = model(page)
            card = page.locator('.hub-logistics-shop-card').first
            price = int(card.locator('.hub-logistics-price strong').inner_text())
            expect(card.get_by_role('button')).to_be_disabled()
            expect(card.locator('.hub-logistics-shop-status')).to_have_text(f'Il manque {price} jetons événement.')
            assert model(page) == before
            return {'insufficientDisabled': True, 'exactShortfall': price}

        def hero_navigation(page):
            page.locator('.hub-command-roster-entry').filter(has_text='Cloud Strife').click()
            page.get_by_role('button', name='GERER EQUIPEMENT', exact=True).click()
            expect(page.locator('.hub-logistics-equipment-panel .hub-logistics-heading')).to_have_text('Cloud Strife · Équipement')
            expect(page.locator('.hub-logistics-hero[aria-pressed="true"]')).to_contain_text('Cloud Strife')
            page.get_by_role('button', name='Retour à la cellule', exact=True).click()
            page.get_by_role('button', name='Résonance de Cloud Strife', exact=True).click()
            expect(page.locator('.hub-command-roster-entry[aria-pressed="true"]')).to_contain_text('Cloud Strife')
            return {'selectedHeroRetainedAcrossRosterGearSquad': True}

        def squad(page):
            cloud = page.get_by_role('button', name='Déployer Cloud Strife', exact=True)
            expect(cloud).to_be_disabled()
            page.locator('.hub-command-bench').first.click()
            page.wait_for_function('window.__hubQA.model.activeTeam.length === 2')
            cloud.focus()
            cloud.press('Enter')
            page.wait_for_function('window.__hubQA.model.activeTeam.includes("cloud_ff7")')
            assert len(model(page)['activeTeam']) == 3
            expect(page.get_by_role('button', name='Retirer Cloud Strife', exact=True)).to_have_attribute('aria-pressed', 'true')
            for _ in range(2):
                page.locator('.hub-command-bench').first.click()
            page.wait_for_function('window.__hubQA.model.activeTeam.length === 1')
            expect(page.locator('.hub-command-bench')).to_be_disabled()
            expect(page.locator('.hub-command-deploy[aria-pressed="true"]')).to_be_disabled()
            return {'keyboardDeploy': True, 'fullSquadBlocked': True, 'lastMemberProtected': True}

        def proposal(page):
            before = model(page)
            page.get_by_role('button', name='PROPOSER LES RELIQUES', exact=True).click()
            expect(page.locator('.squad-proposal')).to_be_visible(timeout=20000)
            assert model(page) == before
            page.get_by_role('button', name='ANNULER SANS MODIFIER', exact=True).click()
            expect(page.locator('.squad-proposal')).to_have_count(0)
            assert model(page) == before
            return {'previewAndCancelDoNotMutateParent': True}

        def anchor(page):
            before = model(page)
            title = page.get_by_label('Titre', exact=True)
            choices = title.locator('option').evaluate_all('nodes => nodes.map(node=>node.value).filter(Boolean)')
            assert len(choices) == 2
            title.select_option(choices[0])
            page.wait_for_function('id => window.__hubQA.model.portalCollection.customLoadout.profileTitle === id', arg=choices[0])
            search = page.get_by_label('Rechercher un nom ou un univers', exact=True)
            search.fill('aucun-univers-qa-87193')
            expect(title).to_have_value(choices[0])
            assert title.locator('option').count() == 2
            expect(page.get_by_text('Aucun autre résultat. Le choix équipé reste visible.', exact=True)).to_be_visible()
            assert model(page)['portalCollection']['profileTitles'] == before['portalCollection']['profileTitles']
            page.screenshot(path=str(out / 'anchor-owned-equipped.png'))
            return {'ownedOnly': True, 'equippedChoiceRetainedThroughSearch': True}

        def codex(page):
            before = model(page)
            summary = page.locator('.codex-record summary').first
            summary.focus()
            summary.press('Enter')
            expect(page.locator('.codex-record').first).to_have_attribute('open', '')
            page.locator('.hub-codex-navigation').get_by_role('button', name='Personnages', exact=True).click()
            expect(page.locator('.hub-codex-navigation').get_by_role('button', name='Personnages', exact=True)).to_have_attribute('aria-pressed', 'true')
            catalog = page.locator('[data-catalog="codex-characters"]')
            assert page.locator('.hub-codex-records-grid > *').count() <= 12
            catalog.locator('input').fill('aucune-archive-qa-87193')
            expect(page.locator('.hub-codex-records-grid > *')).to_have_count(0)
            expect(catalog.locator('.catalog-empty')).to_be_visible()
            assert model(page) == before
            return {'keyboardCanonDisclosure': True, 'personalArcPaginationAndEmptySearch': True, 'readOnlyParent': True}

        def regulation(page):
            before = model(page)
            summary = page.locator('.hub-regulation-diagnostics > summary')
            summary.focus()
            summary.press('Enter')
            expect(page.locator('.hub-regulation-diagnostics')).to_have_attribute('open', '')
            summary.press('Enter')
            page.locator('.hub-regulation-body input').first.fill('28 jours plus tard')
            expect(page.locator('.arca-regulation-universe')).to_have_count(1)
            page.get_by_role('button', name='METTRE EN RESERVE', exact=True).click()
            page.wait_for_function('window.__hubQA.model.hiddenUniverses.length === 1')
            hidden = model(page)
            assert hidden['inventory'] == before['inventory']
            assert hidden['unlockedHeroes'] == before['unlockedHeroes']
            assert hidden['activeTeam'] == before['activeTeam']
            page.get_by_role('button', name='OUVRIR TRAME', exact=True).click()
            page.wait_for_function('window.__hubQA.model.hiddenUniverses.length === 0')
            assert model(page) == before
            return {'keyboardDiagnostics': True, 'reserveRestorePreservesProgressAndPossessions': True}

        def english_scaled_navigation(page):
            page.set_viewport_size({'width': 390, 'height': 844})
            before = model(page)
            baseline = page.locator('.hub-command-roster-identity strong').first.evaluate('node=>parseFloat(getComputedStyle(node).fontSize)')
            page.evaluate("document.documentElement.style.setProperty('--game-text-scale','1.5')")
            scaled = page.locator('.hub-command-roster-identity strong').first.evaluate('node=>parseFloat(getComputedStyle(node).fontSize)')
            assert abs(scaled - baseline * 1.5) < .1, (baseline, scaled)
            page.get_by_role('button', name='ARCHIVES', exact=True).focus()
            page.keyboard.press('Enter')
            page.locator('.hub-navigation-secondary').get_by_role('button', name='CODEX & LORE', exact=True).focus()
            page.keyboard.press('Enter')
            page.wait_for_function("document.querySelector('.hub-screen').dataset.hubTab === 'codex'")
            universes = page.locator('.hub-codex-navigation').get_by_role('button', name='Universes', exact=True)
            universes.focus()
            universes.press('Space')
            expect(universes).to_have_attribute('aria-pressed', 'true')
            catalog = page.locator('[data-catalog="codex-universes"]')
            catalog.locator('input').fill('Metal Gear')
            dossier = page.locator('[data-universe-open]').first
            dossier.focus()
            dossier.press('Enter')
            expect(page.get_by_role('dialog')).to_be_visible()
            page.keyboard.press('Escape')
            expect(page.get_by_role('dialog')).to_have_count(0)
            expect(dossier).to_be_focused()
            assert model(page) == before
            geometry = page.evaluate('''() => ({viewport:innerWidth,body:document.documentElement.scrollWidth,
              workspace:document.querySelector('.hub-tab-workspace').clientWidth,
              workspaceScroll:document.querySelector('.hub-tab-workspace').scrollWidth})''')
            assert geometry['body'] <= geometry['viewport'], geometry
            assert geometry['workspaceScroll'] <= geometry['workspace'] + 1, geometry
            page.screenshot(path=str(out / 'en-mobile-150-keyboard-dossier-return.png'))
            return {'englishKeyboardNavigation': True, 'textScale': {'baseline': baseline, 'scaled': scaled}, 'dossierEscapeRestoresFocus': True, 'geometry': geometry}

        run('inventory', 'inventory', inventory)
        run('shop-purchase', 'shop', shop)
        run('shop-insufficient', 'shop', poor_shop, '&funds=empty')
        run('hero-navigation', 'roster', hero_navigation)
        run('squad-keyboard', 'party', squad)
        run('squad-preview-cancel', 'party', proposal)
        run('anchor-owned-search', 'anchorProfile', anchor, '&rewards=owned')
        run('codex-reading', 'codex', codex)
        run('regulation-reserve-restore', 'admin', regulation)
        run('en-mobile-150-keyboard', 'roster', english_scaled_navigation, lang='en')
        context.close()
        browser.close()
    report = {'scope': 'Production Hub handlers and catalogue data, prepared in-memory parent state; no real account/save-file/full campaign validation.', 'results': results}
    (out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    if any(not result['passed'] for result in results):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
