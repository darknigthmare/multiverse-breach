"""Native WebGL, real RaceMode controls, real sprites and real assisted completion.

No cloud/account writes. Only the dedicated existing fixture seeds a local career.
The GL-loss scenario deliberately invokes the browser's testing extension.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:4173')
    parser.add_argument('--evidence', required=True)
    parser.add_argument('--browser-executable')
    args = parser.parse_args()
    assert urlparse(args.base).hostname in ('127.0.0.1', 'localhost')
    out = Path(args.evidence)
    out.mkdir(parents=True, exist_ok=True)
    cases = [
        ('nexus-desktop', 1440, 900, 'arca_mirelle', 'Mirelle', 'Nexus de Convergence'),
        ('halo-desktop', 1440, 900, 'masterchief', 'Master Chief', 'Halo'),
        ('alien-portrait', 390, 844, 'ripley', 'Ellen Ripley', 'Alien'),
        ('nexus-landscape', 844, 390, 'arca_mirelle', 'Mirelle', 'Nexus de Convergence'),
    ]
    reports = []
    with sync_playwright() as p:
        launch = dict(headless=True, args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        if args.browser_executable:
            launch['executable_path'] = args.browser_executable
        browser = p.chromium.launch(**launch)
        try:
            for name, width, height, hero, query, universe in cases:
                context = browser.new_context(viewport=dict(width=width, height=height), reduced_motion='reduce')
                page = context.new_page()
                page.set_default_timeout(20000)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.route('**/*', lambda route: route.continue_() if urlparse(route.request.url).hostname in ('localhost', '127.0.0.1') else route.abort())
                report = dict(name=name, passed=False, hero=hero, universe=universe, viewport=[width, height])
                reports.append(report)
                try:
                    page.goto(args.base + '/scripts/fixtures/race-lifecycle.html?lang=fr', wait_until='domcontentloaded')
                    page.get_by_role('searchbox', name='Rechercher un pilote').fill(query)
                    page.locator(f'[data-pilot-id="{hero}"]').click()
                    page.get_by_role('combobox', name='Univers des circuits').select_option(universe)
                    # Pick the curated universe circuit, not a legacy Nexus loop.
                    page.locator('.race-track-option[data-track-id^="kart-"]').first.click()
                    page.screenshot(path=str(out / f'{name}-grid.png'))
                    page.get_by_role('button', name='VALIDER LA GRILLE', exact=True).click()
                    page.wait_for_function('window.__raceLifecycle?.engine?.renderer3D?.getTelemetry().frames > 3')
                    page.wait_for_function('window.__raceLifecycle.engine.renderer3D.getTelemetry().drivers.length === 4 && window.__raceLifecycle.engine.renderer3D.getTelemetry().drivers.every(d => d.status === "ready")')
                    page.wait_for_function('window.__raceLifecycle.engine.time > 1.5')
                    assert page.evaluate('window.__raceLifecycle.engine.player.kartSpec.heroId') == hero
                    expect(page.locator('[data-race-runtime-error]')).to_have_count(0)
                    expect(page.locator('.race-stat-grid')).to_be_visible()
                    assert page.locator('.race-telemetry').bounding_box()['width'] > 100
                    before = page.evaluate('window.__raceLifecycle.snapshot()')
                    page.locator('canvas.race-mode-canvas').focus()
                    page.keyboard.down('ArrowLeft')
                    page.wait_for_function('window.__raceLifecycle.engine.keys.left === true')
                    page.wait_for_timeout(160)
                    page.keyboard.up('ArrowLeft')
                    page.wait_for_function('!window.__raceLifecycle.engine.keys.left')
                    after = page.evaluate('window.__raceLifecycle.snapshot()')
                    assert (after['x'], after['y']) != (before['x'], before['y'])
                    page.screenshot(path=str(out / f'{name}-chase.png'))
                    report['chase'] = page.evaluate('window.__raceLifecycle.engine.renderer3D.getTelemetry()')
                    assert report['chase']['triangles'] > 5000
                    assert report['chase']['landmarks'] > 0
                    assert not report['chase']['unhandledLandmarks'], report['chase']['unhandledLandmarks']
                    report['pixels'] = page.evaluate('''() => {
                        const e=window.__raceLifecycle.engine,r=e.renderer3D,g=r.gl;
                        r.draw(e,0); const data=new Uint8Array(64*64*4);
                        g.readPixels(Math.max(0,Math.floor(g.drawingBufferWidth/2)-32),Math.max(0,Math.floor(g.drawingBufferHeight/2)-32),64,64,g.RGBA,g.UNSIGNED_BYTE,data);
                        const colors=new Set(); for(let i=0;i<data.length;i+=4)colors.add(`${data[i]},${data[i+1]},${data[i+2]}`);
                        return {colors:colors.size,error:g.getError()};
                    }''')
                    assert report['pixels']['colors'] > 10, report['pixels']
                    assert report['pixels']['error'] == 0, report['pixels']
                    garage = page.get_by_role('button', name='GARAGE / COMMANDES', exact=True)
                    garage.click()
                    paused = page.evaluate('window.__raceLifecycle.snapshot()')
                    page.wait_for_timeout(150)
                    assert page.evaluate('window.__raceLifecycle.snapshot()') == paused
                    page.get_by_role('combobox', name='Caméra', exact=True).select_option('overview')
                    page.keyboard.press('Escape')
                    expect(garage).to_be_focused()
                    page.wait_for_function('window.__raceLifecycle.engine.renderer3D.getTelemetry().cameraMode === "overview"')
                    page.wait_for_timeout(100)
                    page.screenshot(path=str(out / f'{name}-overview.png'))
                    report['overview'] = page.evaluate('window.__raceLifecycle.engine.renderer3D.getTelemetry()')
                    assert report['overview']['camera']['eye'] != report['chase']['camera']['eye']
                    report['horizontalOverflow'] = page.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
                    assert not report['horizontalOverflow']
                    if name == 'nexus-desktop':
                        # Completion is earned by real engine movement in RAF,
                        # never by setting finished/lap/position from the test.
                        page.wait_for_function('window.__raceLifecycle.engine.finished', timeout=90000)
                        assert page.evaluate('window.__raceLifecycle.engine.player.lap') == 3
                        assert page.evaluate('window.__raceLifecycle.exits.filter(x=>x.reason==="completed").length') == 1
                        report['completion'] = page.evaluate('window.__raceLifecycle.engine.getRaceSummary()')
                        page.screenshot(path=str(out / f'{name}-finish.png'))
                        old = page.evaluate('window.__raceLifecycle.engines.length')
                        page.locator('.race-result-banner').get_by_role('button', name='RELANCER', exact=True).click()
                        page.wait_for_function('(n)=>window.__raceLifecycle.engines.length>n', arg=old)
                        page.wait_for_function('window.__raceLifecycle.engine.renderer3D.getTelemetry().frames>2')
                        report['restart'] = page.evaluate('window.__raceLifecycle.engine.renderer3D.getTelemetry()')
                    if name == 'halo-desktop':
                        report['contextLossSupported'] = page.evaluate('''() => {
                            const e=window.__raceLifecycle.engine;
                            const x=e.renderer3D.gl.getExtension('WEBGL_lose_context');
                            if(!x)return false; x.loseContext(); return true;
                        }''')
                        assert report['contextLossSupported']
                        expect(page.locator('[data-race-runtime-error]')).to_be_visible()
                        assert page.evaluate('window.__raceLifecycle.collection.raceCareer.races || 0') == 0
                        assert page.evaluate('Object.keys(window.__raceLifecycle.engine.keys).length') == 0
                        page.screenshot(path=str(out / f'{name}-context-loss.png'))
                        page.get_by_role('button', name='RETOUR À LA GRILLE', exact=True).click()
                        page.get_by_role('radio', name='2D · sprites', exact=True).check()
                        page.get_by_role('button', name='VALIDER LA GRILLE', exact=True).click()
                        page.wait_for_function('window.__raceLifecycle.engine.time>0.3')
                        assert page.evaluate('window.__raceLifecycle.engine.renderer3D') is None
                        assert page.evaluate('window.__raceLifecycle.engine.player.kartSpec.heroId') == hero
                        page.wait_for_function('window.__raceLifecycle.engine.kartImages.size>0 && [...window.__raceLifecycle.engine.kartImages.values()].every(i=>i.complete&&i.naturalWidth>0)')
                        page.screenshot(path=str(out / f'{name}-2d.png'))
                    assert not errors, errors
                    report['passed'] = True
                except Exception as error:
                    report['error'] = str(error)
                    report['pageErrors'] = errors
                    page.screenshot(path=str(out / f'{name}-failure.png'))
                finally:
                    context.close()
                    (out / 'report.json').write_text(json.dumps({'scope':'Native WebGL in Chromium/SwiftShader; desktop/mobile layouts; actual sprites; actual assisted finish; no physical device benchmark.', 'cases': reports}, ensure_ascii=False, indent=2))
        finally:
            browser.close()
    print(json.dumps({'passed': sum(r['passed'] for r in reports), 'cases': len(reports), 'report':str(out / 'report.json')}))
    if not all(r['passed'] for r in reports):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
