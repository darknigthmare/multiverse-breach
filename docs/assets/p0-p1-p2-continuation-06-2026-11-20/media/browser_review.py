"""Check the maritime bosses in the native GameCanvas with local repository media."""

from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = Path('/tmp/mvb-media-pass06')
ROOT = Path(__file__).resolve().parents[4]
FIXTURE = '/docs/assets/p0-p1-p2-continuation-06-2026-11-20/media/game-canvas.html'
BOSSES = {
    'phare': ('the-drowned-testament/le-phare-qui-regarde', 'lovecraft_abyssal_basilica', 'magic'),
    'kraken': ('the-crownless-sea/kraken-sans-couronne', 'pirate_kraken_maelstrom', 'world_power'),
}
TRACE = r"""
window.bossDraws = [];
const draw = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
  const source = image.currentSrc || '';
  if (this.canvas.classList.contains('combat-stage-canvas') && args.length === 8
    && /(?:\/kraken-sans-couronne|\/le-phare-qui-regarde)(?:-animated)?\.png$/.test(source)
    && args[2] === args[3] && [192, 1024].includes(args[2])) {
    window.bossDraws.push({ path: new URL(source).pathname, args, matrix: [...this.getTransform().toFloat64Array()] });
  }
  return draw.call(this, image, ...args);
};
"""
SAMPLE = """
([state, tick]) => {
  const { engine } = window.__bossAtlasAudit;
  if (state) engine.enemies[0].state = state;
  window.bossDraws = [];
  engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), tick, 'fr');
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


def verify(browser, address, boss, width, height, fallback):
    slug, stage, weapon = BOSSES[boss]
    art = '/sprites/generated/bosses/' + slug
    atlas, still = art + '-animated.png', art + '.png'
    context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
    context.add_init_script(TRACE)
    label = f'{boss}-{width}-' + ('fallback' if fallback else 'atlas')
    responses, page_errors, unrelated_http = [], [], set()

    def route_handler(route):
        url = urlparse(route.request.url)
        if url.netloc != urlparse(address).netloc:
            route.abort()
        elif fallback and url.path == atlas:
            route.fulfill(status=404, body='Deliberately unavailable atlas')
        else:
            route.continue_()

    def response_handler(response):
        path = urlparse(response.url).path
        if path in (atlas, still):
            digest = sha256(response.body()).hexdigest() if response.ok else None
            responses.append(dict(path=path, status=response.status, sha256=digest))
        elif response.status >= 400:
            unrelated_http.add((path, response.status))

    context.route('**/*', route_handler)
    page = context.new_page()
    page.on('pageerror', lambda error: page_errors.append(str(error)))
    page.on('response', response_handler)
    try:
        page.goto(address + FIXTURE + '?boss=' + boss)
        page.wait_for_function('window.__bossAtlasAudit?.engine?.enemies?.length === 1 && window.bossDraws.length > 0')
        identity = page.evaluate("""() => {
          const { engine, boss, stageKey } = window.__bossAtlasAudit;
          engine.setPaused(true);
          const { id, name, weapon, currentHp, isBoss, isWorldBoss } = engine.enemies[0];
          return { id, name, weapon, currentHp, isBoss, isWorldBoss: !!isWorldBoss, sourceId: boss.id, sourceHp: boss.hp, stageKey, wave: engine.wave };
        }""")
        assert identity['stageKey'] == stage and identity['weapon'] == weapon, identity
        assert identity['id'] == identity['sourceId'] and identity['isBoss'] and identity['currentHp'] == identity['sourceHp'], identity
        assert identity['isWorldBoss'] == (boss == 'kraken') and identity['wave'] == 1, identity

        def assert_draw(state, col, draws):
            row = ['idle', 'run', 'attack', 'hit'].index(state)
            source_rect = [0, 0, 1024, 1024] if fallback else [col * 192, row * 192, 192, 192]
            assert len(draws) == 1 and draws[0]['args'][:4] == source_rect, (state, col, draws)
            assert draws[0]['path'] == (still if fallback else atlas), draws
            assert draws[0]['args'][6] == draws[0]['args'][7] > 0
            return draws[0]

        samples = []
        for state in ('idle', 'run', 'attack', 'hit'):
            for col in range(4):
                draw = assert_draw(state, col, page.evaluate(SAMPLE, [state, col * 10]))
                samples.append({'state': state, 'col': col, 'draw': draw})

        action = page.evaluate("""() => {
          const { engine } = window.__bossAtlasAudit;
          const [enemy] = engine.enemies;
          const [hero] = engine.heroes;
          enemy.state = 'idle';
          enemy.atb = enemy.specialCharge = 100;
          const previous = hero.currentHp;
          engine.setPaused(false);
          const accepted = engine.triggerEnemyAbility(enemy, 'special');
          engine.setPaused(true);
          return { accepted, previous, state: enemy.state, facing: enemy.facing };
        }""")
        assert action['accepted'] and action['state'] == 'special', action
        assert_draw('attack', 2, page.evaluate(SAMPLE, [None, 20]))
        canvas = page.locator('canvas.combat-stage-canvas')
        bounds = canvas.bounding_box()
        canvas.screenshot(path=BASE / f'{label}.jpg', type='jpeg', quality=80)

        impact = page.evaluate("""() => {
          const { engine } = window.__bossAtlasAudit;
          const [enemy] = engine.enemies;
          const [hero] = engine.heroes;
          engine.setPaused(false);
          for (let tick = 0; tick < 36 && hero.currentHp > 0; tick++) engine.update();
          const afterAction = hero.currentHp;
          const previous = enemy.currentHp;
          engine.applyDamage(hero, enemy, 40);
          engine.setPaused(true);
          return { afterAction, previous, current: enemy.currentHp, state: enemy.state };
        }""")
        assert impact['afterAction'] < action['previous'] and impact['current'] < impact['previous'] and impact['state'] == 'hit', impact
        assert_draw('hit', 0, page.evaluate(SAMPLE, [None, 0]))
        page.locator('#qa-unmount').evaluate('(button) => button.click()')
        page.wait_for_function('window.__bossAtlasAudit.engine.disposed')
        assert not page_errors, page_errors
        for path, status in ([(atlas, 404), (still, 200)] if fallback else [(atlas, 200)]):
            expected = sha256((ROOT / 'public' / path.lstrip('/')).read_bytes()).hexdigest() if status == 200 else None
            assert dict(path=path, status=status, sha256=expected) in responses, responses
        return dict(case=label, identity=identity, canvas=bounds, samples=samples,
                    special=action, impact=impact, mediaResponses=responses, disposed=True,
                    unrelatedHttpErrors=sorted(unrelated_http), pageErrors=page_errors)
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
            for boss, width, height in (('phare', 1280, 800), ('kraken', 390, 844)):
                for fallback in (False, True):
                    result = verify(browser, address, boss, width, height, fallback)
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
