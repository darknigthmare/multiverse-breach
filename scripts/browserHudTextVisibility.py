#!/usr/bin/env python3
"""Native browser regression for the shared HUD text measurement.

This small fixture uses the product's full/compact CSS and the same text probe
as the real relay playthroughs. It verifies measurement, not gameplay or art.
The full game checks still measure every button, clip, hit target and aim area.
"""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

from hudTextProof import BUTTON_TEXT_PROOF_JS


FIXTURE = """<!doctype html><meta charset="utf-8"><main>
  <button id="responsive" class="extinction-primary-action" aria-label="V · KIT PERSONNEL">
    <span class="extinction-action-label-full" aria-hidden="true">V · KIT PERSONNEL</span>
    <span class="extinction-action-label-compact" aria-hidden="true">V · KIT</span>
  </button>
  <button id="nested"><span hidden><b>Unpainted alternative</b></span><span>Visible label</span></button>
  <button id="all-hidden"><span hidden>Missing label</span></button>
  <button id="ellipsis"><strong class="clipped">A genuinely clipped control label</strong></button>
  <button id="overflow"><span>A very long control label that extends far beyond the button bounds</span></button>
  <button id="opacity"><span>Key </span><span style="opacity:0">Invisible action</span></button>
  <button id="visibility"><span>Key </span><span style="visibility:hidden">Invisible action</span></button>
  <button id="contents"><span style="display:contents">Visible through contents</span></button>
</main>"""

FIXTURE_CSS = """
  body { margin: 16px; }
  main { display: grid; grid-template-columns: repeat(2, 310px); gap: 8px; }
  button { box-sizing: border-box; width: 300px; height: 54px; padding: 8px;
    border: 1px solid #345; font: 16px/20px sans-serif; text-align: left; }
  .clipped { display: block; width: 60px; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; }
  #overflow { width: 100px; white-space: nowrap; }
"""


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def inspect(page, selector):
    return page.locator(selector).evaluate(BUTTON_TEXT_PROOF_JS)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--evidence', default='/tmp/hud-text-proof')
    parser.add_argument('--executable')
    args = parser.parse_args()
    out = Path(args.evidence)
    out.mkdir(parents=True, exist_ok=True)
    stylesheet = (Path(__file__).resolve().parents[1] / 'src/components/HubImmersion.css').read_text()
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, args=['--no-sandbox'],
            **({'executable_path': args.executable} if args.executable else {}))
        try:
            for width, height, painted, excluded in [
                (1280, 900, 'V · KIT PERSONNEL', 'V · KIT'),
                (844, 390, 'V · KIT', 'V · KIT PERSONNEL'),
            ]:
                page = browser.new_page(viewport={'width': width, 'height': height})
                try:
                    page.set_content(FIXTURE)
                    page.add_style_tag(content=stylesheet)
                    page.add_style_tag(content=FIXTURE_CSS)
                    for selector, expected in [
                        ('#responsive', True), ('#nested', True), ('#all-hidden', False),
                        ('#ellipsis', False), ('#overflow', False), ('#opacity', False),
                        ('#visibility', False), ('#contents', True),
                    ]:
                        record = {'name': f'{width}x{height}-{selector[1:]}', 'expectedFullyVisible': expected, 'passed': False}
                        try:
                            proof = inspect(page, selector)
                            record['proof'] = proof
                            check(proof['fullyVisible'] is expected, f'{selector}: wrong visibility classification')
                            if selector == '#responsive':
                                check([entry['text'] for entry in proof['fragments']] == [painted], 'wrong responsive label measured')
                                check([entry['text'] for entry in proof['excludedFragments']] == [excluded], 'hidden alternative not recorded')
                                check(all(entry['reason'] == 'display-none' for entry in proof['excludedFragments']), 'unexpected excluded text')
                                check(page.get_by_role('button', name='V · KIT PERSONNEL', exact=True).count() == 1, 'full accessible name changed')
                            if selector == '#nested':
                                check([entry['text'] for entry in proof['fragments']] == ['Visible label'], 'hidden ancestor was ignored incorrectly')
                            if selector == '#all-hidden':
                                check(not proof['fragments'], 'unpainted text counted as a visible fragment')
                            if selector == '#ellipsis':
                                check(any(entry['ellipsized'] for entry in proof['fragments']), 'nested ellipsis was no longer detected')
                            if selector in ['#opacity', '#visibility']:
                                check(any(entry['text'] == 'Invisible action' and not entry['fullyVisible'] for entry in proof['fragments']), 'invisible action silently excluded')
                            record['passed'] = True
                        except Exception as error:
                            record['error'] = str(error)
                        results.append(record)
                        print(json.dumps({key: value for key, value in record.items() if key != 'proof'}), flush=True)
                    page.screenshot(path=str(out / f'{width}x{height}.png'))
                finally:
                    page.close()
        finally:
            browser.close()
            (out / 'report.json').write_text(json.dumps({'results': results}, ensure_ascii=False, indent=2))
    check(len(results) == 16 and all(record['passed'] for record in results), 'HUD text probe regression failed')


if __name__ == '__main__':
    main()
