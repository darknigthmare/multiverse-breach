#!/usr/bin/env python3
"""Native Canvas proof for real source action diagrams. This is a rendering
fixture, not a completed FPS run or canonical character-art approval.
The existing roster/directive browser recipe covers the integrated FPS scene.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def inspect(record):
    pixels, placement = record['pixels'], record['placement']
    check(record['unchanged'], f"Rendering mutated gameplay: {record['id']}")
    check(pixels['count'] > 20, f"Empty diagram: {record['id']}")
    check(pixels['bright'] > 4, f"Source colour has no readable contrast edge: {record['id']}")
    check(pixels['topHalf'] == 0, f"Diagram covered central aiming space: {record['id']}")
    bounds = pixels['bounds']
    check(bounds['left'] >= placement['x'] - 2 and bounds['right'] <= placement['x'] + placement['w'] + 2,
          f"Raster escaped horizontal envelope: {record['id']}")
    check(bounds['top'] >= placement['y'] - 2 and bounds['bottom'] <= placement['y'] + placement['h'] + 2,
          f"Raster escaped vertical envelope: {record['id']}")
    check(record['view']['artwork'] is False and record['view']['morphologyInferred'] is False,
          'A schematic must not claim character artwork')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4182')
    parser.add_argument('--evidence', default='.tmp/extinction-schematic-evidence')
    args = parser.parse_args()
    out = Path(args.evidence); out.mkdir(parents=True, exist_ok=True)
    report = {'scope': 'native Canvas rendering; real source profiles and activation timers; no gameplay completion claim',
              'viewports': [], 'errors': [], 'result': 'running'}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        report['browser'] = browser.version
        page = None
        try:
            for name, width, height in [('desktop', 1440, 1000), ('portrait', 390, 844), ('landscape', 844, 390)]:
                page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
                page.on('pageerror', lambda error: report['errors'].append(str(error)))
                page.goto(args.url.rstrip('/') + '/scripts/fixtures/extinction-schematic.html', wait_until='networkidle')
                page.wait_for_function('window.__schematicQA?.read().records.length === 12')
                result = {'name': name, 'width': width, 'height': height, 'states': {}}
                report['viewports'].append(result)
                check(page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Fixture overflow')
                for phase in ['idle', 'attack', 'recovery', 'reload', 'empty']:
                    page.locator(f'[data-phase="{phase}"]').click()
                    observed = page.evaluate('window.__schematicQA.read()')
                    result['states'][phase] = observed
                    check(observed['phase'] == phase, f'Native phase selection failed: {phase}')
                    for record in observed['records']:
                        inspect(record)
                        expected_phase = 'idle' if phase in ('reload', 'empty') and record['view']['resource'] != 'ammo' else phase
                        check(record['view']['phase'] == expected_phase, f"Wrong resource phase for {record['id']}: {record['view']['phase']}")
                    inspect(observed['stage'])
                    check(len({r['view']['style'] for r in observed['records'][:9]}) == 9, 'Primary delivery families collapsed')
                    check([r['view']['style'] for r in observed['records'][9:]] == ['scatter', 'launcher', 'plasma'], 'Pickup shapes changed')
                    if phase in ('idle', 'attack'):
                        page.screenshot(path=str(out / f'{name}-{phase}-matrix.png'), full_page=True)
                before = page.evaluate('window.__schematicQA.read()')
                page.evaluate('window.__schematicQA.render()')
                check(page.evaluate('window.__schematicQA.read()') == before, 'Same simulation state produced a different rendering')
                idle = result['states']['idle']['records']; active = result['states']['attack']['records']
                check(all(a['pixels']['hash'] != b['pixels']['hash'] for a, b in zip(idle, active)), 'An actual primary activation lacks visible feedback')
                page.locator('[data-phase="attack"]').click()
                for identity in ['doomslayer', 'siren_head', 'hw_wheelchair_guy', 'pickup-rocket', 'pickup-plasma']:
                    page.locator('#sample').select_option(identity)
                    expect(page.locator('#stage-caption')).to_contain_text('attack')
                    current = page.evaluate('window.__schematicQA.read().stage')
                    inspect(current)
                    check(current['id'] == identity, 'Selected stage kept another owner')
                    page.locator('.stage').screenshot(path=str(out / f'{name}-{identity}-stage.png'))
                page.close(); page = None
            check(not report['errors'], 'JavaScript errors: ' + '; '.join(report['errors']))
            report['result'] = 'passed'
        except Exception as error:
            report['result'] = 'failed'; report['failure'] = str(error)
            if page:
                page.screenshot(path=str(out / 'failure.png'), full_page=True)
            raise
        finally:
            (out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
            browser.close()
    print(json.dumps({'result': report['result'], 'viewports': len(report['viewports']),
                      'renderedCases': 12, 'states': 5, 'errors': report['errors'], 'report': str(out / 'report.json')}))


if __name__ == '__main__':
    main()
