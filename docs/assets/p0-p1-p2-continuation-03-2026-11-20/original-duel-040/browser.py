import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

args = argparse.ArgumentParser()
args.add_argument('--port', type=int, default=4293)
args.add_argument('--output', type=Path, default=Path('/tmp/animation-next'))
args = args.parse_args()
out = args.output
out.mkdir(parents=True, exist_ok=True)
base = f'http://127.0.0.1:{args.port}/docs/assets/p0-p1-p2-continuation-03-2026-11-20/original-duel-040/fixture.html'
report = []


def trace_bodies(page, snapshot):
    trace = page.evaluate('window.duelTrace')
    for entry in snapshot['presentation']['entries']:
        asset = entry['script']['sample']['asset']
        crop = [asset['col'] * 256, asset['row'] * 256, 256, 256]
        assert any(draw['path'] == asset['sheet'] and draw['crop'] == crop for draw in trace['draws']), (entry, trace)
        assert entry['script']['name'] in trace['labels']
    return trace


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for pair, width, height, loser in [('a', 1280, 800, 'player'), ('a', 1280, 800, 'cpu'),
                                       ('b', 390, 844, 'cpu'), ('b', 1280, 800, 'player')]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors, http = [], {}
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: http.update({urlsplit(response.url).path: response.status}))
        page.goto(f'{base}?pair={pair}')
        page.wait_for_function('window.duelFixture && (window.duelFixture.draw(), window.duelTrace.draws.length >= 2)')
        page.evaluate('window.duelFixture.advance(1.3)')
        snapshot = page.evaluate('window.duelFixture.draw()')
        assert snapshot['phase'] == 'intro'
        trace = trace_bodies(page, snapshot)
        assert trace['strokes'], trace
        if pair == 'a' and loser == 'player':
            page.locator('canvas').screenshot(path=str(out/'duel-intro-a.jpg'), type='jpeg', quality=85)
        reduced_snapshot = page.evaluate('window.duelFixture.draw(true)')
        assert reduced_snapshot == snapshot
        assert not trace_bodies(page, snapshot)['strokes']
        page.evaluate('(loser) => { window.duelFixture.advance(4); window.duelFixture.knockOut(loser); }', loser)
        seen = []
        for phase in ['roundResult', 'fatality', 'victory', 'outro']:
            if phase == 'fatality':
                page.evaluate('(loser) => { window.duelFixture.advance(3.3); window.duelFixture.knockOut(loser); }', loser)
            if phase in ['roundResult', 'victory', 'outro']:
                page.evaluate('window.duelFixture.advance(.5)')
            if phase == 'fatality':
                page.evaluate('window.duelFixture.advance(1.0)')
            snapshot = page.evaluate('window.duelFixture.draw()')
            assert snapshot['phase'] == phase, snapshot['phase']
            trace = trace_bodies(page, snapshot)
            if phase == 'fatality':
                assert trace['strokes'], trace
                winner = snapshot['presentation']['entries'][0]
                assert winner['script']['name'] == winner['identity']['name']
                assert winner['universe'] == winner['identity']['description']
                name = winner['fighterId'].replace('_', '-')
                page.locator('canvas').screenshot(path=str(out/f'duel-finale-{name}.jpg'), type='jpeg', quality=85)
            if phase == 'outro':
                ko = next(e for e in snapshot['presentation']['entries'] if e['side'] == loser)
                assert ko['actorPhase'] == 'defeat'
                assert ko['script']['sample']['progress'] == 1
                assert ko['script']['sample']['asset']['col'] == 2
            seen.append({'phase': phase, 'actors': [e['fighterId'] for e in snapshot['presentation']['entries']], 'trace': trace})
            page.evaluate('window.duelFixture.nextScene()')
        page.evaluate('window.duelFixture.advance(1)')
        assert page.evaluate('window.duelFixture.stop()') == {'completed': 1, 'presentation': None}
        assert not errors, errors
        assert not {path: status for path, status in http.items() if status >= 400}, http
        report.append({'kind': 'engine-canvas', 'pair': pair, 'viewport': [width, height], 'loser': loser, 'introAndReducedMotion': True,
                       'phases': seen, 'httpErrors': {}, 'pageErrors': [], 'completionCallbacks': 1, 'disposed': True})
        page.close()
    for pair, width, height, reduced, strokes in [('a', 1280, 800, 'no-preference', True), ('b', 390, 844, 'reduce', False)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, reduced_motion=reduced)
        errors, http = [], {}
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: http.update({urlsplit(response.url).path: response.status}))
        page.goto(f'{base}?ui=1&pair={pair}')
        page.get_by_role('button', name='OUVRIR L ARENE').click()
        page.wait_for_function('window.duelTrace.draws.length >= 4')
        captions = ['Relevé de la carte abyssale', 'Kael arrive entre deux secondes'] if pair == 'a' else ['Eira veille sur la photosphère', 'Nyra ouvre une liaison Ghostline']
        page.wait_for_function('(labels) => labels.every(label => window.duelTrace.labels.includes(label))', arg=captions)
        page.wait_for_timeout(1200)
        assert page.locator('canvas').is_visible()
        trace = page.evaluate('window.duelTrace')
        assert bool(trace['strokes']) == strokes, trace['strokes']
        assert not errors, errors
        if pair == 'b':
            page.locator('canvas').screenshot(path=str(out/'duel-ui-mobile.jpg'), type='jpeg', quality=85)
        report.append({'kind':'FighterMode-launch', 'pair':pair, 'viewport':[width,height], 'reducedMotion':reduced,
                       'captions':captions, 'bodyPaths':sorted({d['path'] for d in trace['draws']}), 'overlayVisible':strokes,
                       'httpErrors':{path:status for path,status in http.items() if status >= 400}, 'pageErrors':[]})
        page.close()
    browser.close()

(out/'browser.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(f'{len(report)} Chromium cases passed')
