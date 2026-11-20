"""Render the original boss PNGs in one Tactics and one RPG GameCanvas."""

from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = Path('/tmp/mvb-pass07-media')
ROOT = Path(__file__).resolve().parents[4]
FIXTURE = '/docs/assets/p0-p1-p2-continuation-07-2026-11-20/media/game-canvas.html'
ART = '/sprites/generated/bosses/'
CASES = {
    'pneuma': (ART + 'the-aether-crown/lord-pneuma.png', 'aether_crown:lord_pneuma', 'Tactics', [[193, 40, 277, 207]]),
    'vaelgor': (ART + 'valedor-the-shattered-crown/vaelgor-premier-wyrm.png', 'valedor_shattered_crown:vaelgor_premier_wyrm', 'RPG',
                [[494, 46, 79, 109], [261, 406, 92, 121], [757, 546, 100, 130]]),
}
TRACE = r"""
window.bossDraws = [];
const draw = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
  const source = image.currentSrc || '';
  if (this.canvas.classList?.contains('combat-stage-canvas')
    && /\/(?:lord-pneuma|vaelgor-premier-wyrm)\.png$/.test(source)
    && (args.length === 4 || [1024, 207, 109, 121, 130].includes(args[3]))) {
    const matrix = this.getTransform();
    window.bossDraws.push({ args, matrix: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f] });
  }
  return draw.call(this, image, ...args);
};
"""
SAMPLE = """
([state, time]) => {
  const { engine } = window.__staticBossAudit;
  if (state) engine.enemies[0].state = state;
  window.bossDraws = [];
  engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), time, 'fr');
  return window.bossDraws;
}
"""


class LocalFixture(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = Path(super().translate_path(path))
        asset = ROOT / 'public' / local.relative_to(self.directory)
        return str(asset if not local.exists() and asset.is_file() else local)

    def log_message(self, fmt, *args):
        pass


def verify(browser, address, boss, reduce, width, height):
    path, actor_id, mode, crops = CASES[boss]
    context = browser.new_context(
        viewport={'width': width, 'height': height},
        reduced_motion='reduce' if reduce else 'no-preference',
    )
    context.add_init_script(TRACE)
    context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(address + '/') else route.abort())
    label = f'{boss}-{width}-' + ('reduced' if reduce else 'animated')
    responses, errors, unrelated = [], [], set()
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))

    def record(response):
        address_path = urlparse(response.url).path
        if address_path == path:
            responses.append([response.status, sha256(response.body()).hexdigest() if response.ok else None])
        elif response.status >= 400:
            unrelated.add((address_path, response.status))

    page.on('response', record)
    try:
        page.goto(address + FIXTURE + '?boss=' + boss)
        try:
            page.wait_for_function('window.__staticBossAudit?.engine?.enemies?.length === 1 && window.bossDraws.length > 0')
        except Exception:
            print('mount errors', errors, responses, sorted(unrelated))
            raise
        identity = page.evaluate("""() => {
          const { engine, mode, stageKey } = window.__staticBossAudit;
          engine.setPaused(true);
          const { id, name, isBoss, currentHp, x, y, gridX, gridY } = engine.enemies[0];
          return { id, name, isBoss, currentHp, x, y, gridX, gridY, mode, stageKey };
        }""")
        assert identity['id'] == actor_id and identity['mode'] == mode and identity['isBoss'], identity
        expected = [200, sha256((ROOT / 'public' / path.lstrip('/')).read_bytes()).hexdigest()]
        assert expected in responses, responses

        def assert_trace(draws):
            if reduce:
                assert len(draws) == 1 and draws[0]['args'][:4] == [0, 0, 1024, 1024], draws
            else:
                assert len(draws) == len(crops) + 1, draws
                assert draws[0]['args'] == [0, 0, 1024, 1024], draws
                assert [draw['args'][:4] for draw in draws[1:]] == crops, draws

        states = {}
        for state in ['idle', 'run', 'attack', 'hit']:
            samples = [page.evaluate(SAMPLE, [state, time]) for time in [13, 29]]
            for draws in samples:
                assert_trace(draws)
            assert samples[0][0] == samples[1][0], samples
            if not reduce:
                assert all(first['matrix'] != second['matrix'] for first, second in zip(samples[0][1:], samples[1][1:])), samples
            states[state] = samples
        assert len({json.dumps(samples[0][0]) for samples in states.values()}) == 1, states
        assert len({json.dumps(samples[0][1:]) for samples in states.values()}) == (1 if reduce else 4)
        if not reduce:
            page.evaluate("document.documentElement.dataset.gameMotion = 'reduced'")
            still = page.evaluate(SAMPLE, ['attack', 13])
            assert len(still) == 1 and still[0]['args'][:4] == [0, 0, 1024, 1024], still
            page.evaluate('delete document.documentElement.dataset.gameMotion')
            assert_trace(page.evaluate(SAMPLE, ['attack', 13]))

        enemy_action = None
        if mode == 'RPG':
            enemy_action = page.evaluate("""() => {
              const { engine } = window.__staticBossAudit;
              const [boss] = engine.enemies;
              const [hero] = engine.heroes;
              boss.state = 'idle';
              boss.atb = boss.specialCharge = 100;
              const previous = hero.currentHp;
              engine.setPaused(false);
              const accepted = engine.triggerEnemyAbility(boss, 'special');
              const state = boss.state;
              for (let tick = 0; tick < 32 && hero.currentHp > 0; tick++) engine.update();
              engine.setPaused(true);
              return { accepted, state, previous, after: hero.currentHp };
            }""")
            assert enemy_action['accepted'] and enemy_action['state'] == 'special' and enemy_action['after'] < enemy_action['previous'], enemy_action
        impact = page.evaluate("""() => {
          const { engine } = window.__staticBossAudit;
          const [boss] = engine.enemies;
          const previous = boss.currentHp;
          engine.setPaused(false);
          boss.state = 'idle';
          engine.applyDamage(engine.heroes[0], boss, 40, null, { ignoreCover: true });
          engine.setPaused(true);
          return { previous, current: boss.currentHp, state: boss.state, x: boss.x, y: boss.y, gridX: boss.gridX, gridY: boss.gridY };
        }""")
        assert impact['current'] < impact['previous'] and impact['state'] == 'hit', impact
        if mode == 'Tactics':
            assert [impact['gridX'], impact['gridY']] == [identity['gridX'], identity['gridY']], impact
        assert_trace(page.evaluate(SAMPLE, [None, 29]))
        if not reduce:
            page.evaluate(SAMPLE, ['attack', 13])
            page.locator('canvas.combat-stage-canvas').screenshot(path=BASE / f'{label}.jpg', type='jpeg', quality=79)
        page.locator('#qa-unmount').evaluate('(button) => button.click()')
        page.wait_for_function('window.__staticBossAudit.engine.disposed')
        assert not errors, errors
        return dict(case=label, identity=identity, mediaResponses=responses, states=states, impact=impact,
                    localReducedMotionToggleTested=not reduce,
                    enemyAction=enemy_action, disposed=True, unrelatedHttpErrors=sorted(unrelated), pageErrors=errors)
    finally:
        context.close()


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(LocalFixture, directory=str(BASE / 'fixture')))
    worker = Thread(target=server.serve_forever, daemon=True)
    worker.start()
    results = []
    try:
        address = f'http://127.0.0.1:{server.server_port}'
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
            for boss in CASES:
                for reduce, width, height in [(False, 1280, 800), (True, 390, 844)]:
                    result = verify(browser, address, boss, reduce, width, height)
                    results.append(result)
                    (BASE / 'browser-results.json').write_text(json.dumps(results, separators=(',', ':')) + '\n')
                    print(result['case'], 'passed', flush=True)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
        worker.join()


if __name__ == '__main__':
    main()
