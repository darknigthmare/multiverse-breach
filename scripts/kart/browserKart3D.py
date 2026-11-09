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
                    expected_model = {'arca_mirelle': 'suture-disc', 'masterchief': 'warthog', 'ripley': 'narcissus'}[hero]
                    expect(page.locator('.kart-identity-brief')).to_have_attribute('data-vehicle-model', expected_model)
                    kart_preview = page.locator('.race-preflight-karts .race-kart-option.active').first
                    expect(kart_preview.locator('.kart-sprite-preview')).to_have_attribute('data-sprite-status', 'ready')
                    kart_preview.screenshot(path=str(out / f'{name}-vehicle-card.png'))
                    page.get_by_role('combobox', name='Univers des circuits').select_option(universe)
                    # Pick the curated universe circuit, not a legacy Nexus loop.
                    page.locator('.race-track-option[data-track-id^="kart-"]').first.click()
                    page.screenshot(path=str(out / f'{name}-grid.png'))
                    page.get_by_role('button', name='VALIDER LA GRILLE', exact=True).click()
                    page.wait_for_function('window.__raceLifecycle?.engine?.renderer3D?.getTelemetry().frames > 3')
                    page.wait_for_function('window.__raceLifecycle.engine.renderer3D.getTelemetry().drivers.length === 4 && window.__raceLifecycle.engine.renderer3D.getTelemetry().drivers.every(d => d.status === "ready")')
                    page.wait_for_function('window.__raceLifecycle.engine.time > 1.5')
                    assert page.evaluate('window.__raceLifecycle.engine.player.kartSpec.heroId') == hero
                    report['vehicleIdentity'] = page.evaluate('window.__raceLifecycle.engine.player.kartSpec.vehicleIdentity')
                    assert report['vehicleIdentity']['model'] == expected_model
                    report['uploadedKartParts'] = page.evaluate('''() => {
                        const e=window.__raceLifecycle.engine;
                        return [...e.renderer3D.kartMeshes.entries()]
                            .find(([key])=>key.startsWith(e.player.kartSpec.id+':'))[1].parts.map(p=>({id:p.id,count:p.count}));
                    }''')
                    assert all(part['count'] > 0 for part in report['uploadedKartParts'])
                    required_parts = {
                        'warthog': {'identity-warthog-warthog-sloped-armored-bonnet', 'identity-warthog-warthog-open-cage-and-cargo-bed'},
                        'narcissus': {'identity-narcissus-narcissus-chamfered-shuttle-wedge', 'identity-narcissus-narcissus-paired-rounded-aft-thrusters-and-docking-hatch'},
                        'suture-disc': {'hover-disc'},
                    }[expected_model]
                    assert required_parts.issubset({part['id'] for part in report['uploadedKartParts']}), report['uploadedKartParts']
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
                    report['overlay'] = page.evaluate('''() => {
                        const e=window.__raceLifecycle.engine, canvas=document.querySelector('canvas.race-mode-canvas');
                        const viewport=canvas.getBoundingClientRect();
                        const absolute=r=>({left:viewport.left+r.x,top:viewport.top+r.y,right:viewport.left+r.x+r.width,bottom:viewport.top+r.y+r.height});
                        const map=absolute(e.overlayLayout.minimap), boost=absolute(e.overlayLayout.boost);
                        const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
                        const obstacles=['.race-world-hud','.race-touch-controls','.race-cache-card'].map(s=>document.querySelector(s).getBoundingClientRect());
                        return {layout:e.overlayLayout,objectFit:getComputedStyle(canvas).objectFit,
                            mapClear:obstacles.every(r=>!overlaps(map,r)),boostClear:obstacles.every(r=>!overlaps(boost,r)),
                            inViewport:[map,boost].every(r=>r.left>=viewport.left&&r.right<=viewport.right&&r.top>=viewport.top&&r.bottom<=viewport.bottom)};
                    }''')
                    assert report['overlay']['objectFit'] == 'fill', report['overlay']
                    assert report['overlay']['mapClear'] and report['overlay']['boostClear'], report['overlay']
                    assert report['overlay']['inViewport'], report['overlay']
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
                        # A fresh renderer must work on the SAME native context
                        # after a draw/dispose cycle (React remount lifecycle).
                        report['sameCanvasReuse'] = page.evaluate('''async () => {
                            const {KartRenderer3D}=await import('/src/game/kart/kartRenderer3D.js');
                            const canvas=document.createElement('canvas');
                            canvas.style.cssText='position:fixed;left:-10000px;width:320px;height:180px';
                            document.body.appendChild(canvas);
                            let first,second;
                            try {
                                const engine=window.__raceLifecycle.engine;
                                first=new KartRenderer3D(canvas,{cameraMode:'overview'});
                                first.draw(engine,0);
                                const gl=first.gl, firstError=gl.getError();
                                first.dispose();
                                second=new KartRenderer3D(canvas,{cameraMode:'overview'});
                                second.draw(engine,0);
                                return {sameContext:gl===second.gl,firstError,secondError:second.gl.getError(),frames:second.getTelemetry().frames};
                            } finally {
                                second?.dispose(); first?.dispose(); canvas.remove();
                            }
                        }''')
                        assert report['sameCanvasReuse'] == dict(sameContext=True, firstError=0, secondError=0, frames=1), report['sameCanvasReuse']
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
                    if name == 'alien-portrait':
                        # Start a fresh real UI session to inspect the same
                        # Narcissus in 2D; no race outcome is forced.
                        page.goto(args.base + '/scripts/fixtures/race-lifecycle.html?lang=fr', wait_until='domcontentloaded')
                        page.get_by_role('searchbox', name='Rechercher un pilote').fill(query)
                        page.locator(f'[data-pilot-id="{hero}"]').click()
                        page.get_by_role('combobox', name='Univers des circuits').select_option(universe)
                        page.locator('.race-track-option[data-track-id^="kart-"]').first.click()
                    if name in ('halo-desktop', 'alien-portrait'):
                        page.get_by_role('radio', name='2D · sprites', exact=True).check()
                        page.get_by_role('button', name='VALIDER LA GRILLE', exact=True).click()
                        page.wait_for_function('window.__raceLifecycle.engine.time>0.3')
                        assert page.evaluate('window.__raceLifecycle.engine.renderer3D') is None
                        assert page.evaluate('window.__raceLifecycle.engine.player.kartSpec.heroId') == hero
                        assert page.evaluate('window.__raceLifecycle.engine.player.kartSpec.vehicleIdentity.model') == expected_model
                        page.wait_for_function('window.__raceLifecycle.engine.kartImages.size>0 && [...window.__raceLifecycle.engine.kartImages.values()].every(i=>i.complete&&i.naturalWidth>0)')
                        page.wait_for_function('(hero)=>[...window.__raceLifecycle.engine.driverBusts.values()].some(b=>b?.heroId===hero)', arg=hero)
                        report['drivers2D'] = page.evaluate('''() => [...window.__raceLifecycle.engine.driverBusts.values()]
                            .filter(Boolean).map(b=>({heroId:b.heroId,source:b.source,width:b.width,height:b.height}))''')
                        time_2d = page.evaluate('window.__raceLifecycle.engine.time')
                        page.wait_for_function('(time)=>window.__raceLifecycle.engine.time>time+0.2', arg=time_2d)
                        expect(page.locator('[data-race-runtime-error]')).to_have_count(0)
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
