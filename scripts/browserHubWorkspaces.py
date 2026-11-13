#!/usr/bin/env python3
"""Capture actual Hub workspaces with prepared parent state and native media.

Requires buildHubWorkspacesFixture.mjs and serveSourceSceneArtFixture.py pointed
at that build. This covers presentation, not campaign/save-file persistence.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:4178')
    parser.add_argument('--out', default='/tmp/hub-workspaces-before')
    parser.add_argument('--tabs', nargs='+', default=['inventory', 'shop', 'party', 'roster', 'codex'])
    parser.add_argument('--lang', choices=['fr', 'en'], default='fr')
    parser.add_argument('--text-scale', type=float, default=1)
    parser.add_argument('--sizes', nargs='+', choices=['desktop', 'mobile'], default=['desktop', 'mobile'])
    args = parser.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'scope': 'Real production Hub and catalogues; prepared parent save state; native media served from checkout/Git index.', 'lang': args.lang, 'textScale': args.text_scale, 'captures': []}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        try:
            for name, width, height in [('desktop', 1440, 1000), ('mobile', 390, 844)]:
                if name not in args.sizes:
                    continue
                context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=1, reduced_motion='reduce')
                context.route('https://fonts.googleapis.com/**', lambda route: route.abort())
                context.route('https://fonts.gstatic.com/**', lambda route: route.abort())
                for tab in args.tabs:
                    page = context.new_page()
                    errors = []
                    failed_media = []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.on('response', lambda response: failed_media.append({'status': response.status, 'url': response.url}) if response.status >= 400 else None)
                    page.goto(f'{args.base_url}/scripts/fixtures/hub-workspaces.html?tab={tab}&lang={args.lang}', wait_until='domcontentloaded')
                    page.wait_for_selector('.hub-tab-workspace', timeout=60000)
                    page.evaluate("scale => document.documentElement.style.setProperty('--game-text-scale', scale)", args.text_scale)
                    page.evaluate('document.fonts.ready')
                    page.wait_for_timeout(400)
                    screenshot = out / f'{name}-{tab}.png'
                    page.screenshot(path=str(screenshot), full_page=False)
                    geometry = page.evaluate('''() => ({
                      viewport:innerWidth, scrollWidth:document.documentElement.scrollWidth,
                      headings:[...document.querySelectorAll('.hub-tab-workspace h2,.hub-tab-workspace h3,.hub-tab-workspace h4')].map(node=>node.textContent.trim()),
                      navigation:[...document.querySelectorAll('.hub-navigation [aria-current="page"]')].map(node=>node.textContent.trim()),
                      containers:[...document.querySelectorAll('.hub-tab-workspace,.hub-workspace,.hub-catalog-layout,.hub-resource-strip')].map(node=>({
                        className:node.className,width:node.clientWidth,scrollWidth:node.scrollWidth,overflow:getComputedStyle(node).overflowX
                      })),
                      fonts:Object.fromEntries(['.hub-workspace-title h2','.hub-command-roster-identity strong','.anchor-customization-header h4','.hub-logistics-effect','.hub-navigation-primary button'].map(selector=>{
                        const node=document.querySelector(selector);return [selector,node?getComputedStyle(node).fontSize:null];
                      })),
                      sample:document.querySelector('.hub-tab-workspace')?.innerText.slice(0,650)
                    })''')
                    report['captures'].append({'size': name, 'tab': tab, 'screenshot': str(screenshot), **geometry, 'pageErrors': errors, 'failedMedia': failed_media})
                    print(json.dumps({'size': name, 'tab': tab, 'overflow': geometry['scrollWidth'] > width, 'pageErrors': errors}, ensure_ascii=False), flush=True)
                    page.close()
                context.close()
        finally:
            browser.close()
    (out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
