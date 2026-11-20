"""Serve one code-only fixture and verify the actual RPG boss rendering."""

import argparse
from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = Path("/tmp/mb-pachakuti-20261120")
ROOT = Path(__file__).resolve().parents[4]
ATLAS = "/sprites/generated/bosses/tawantinsuyu-the-split-sun/pachakuti-du-soleil-noir.png"
FIXTURE = "/docs/assets/p0-p1-p2-continuation-03-2026-11-20/pachakuti/game-canvas.html"
BOSS = "tawantinsuyu_split_sun:pachakuti_du_soleil_noir"
TRACE = """
window.pachakutiTraces = { sprites: [], arcs: [] };
const draw = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
  if ((image.currentSrc || '').endsWith('/pachakuti-du-soleil-noir.png')) {
    window.pachakutiTraces.sprites.push(args);
  }
  return draw.call(this, image, ...args);
};
const arc = CanvasRenderingContext2D.prototype.arc;
CanvasRenderingContext2D.prototype.arc = function(x, y, r, ...args) {
  if (x === 0 && y === -73 && this.fillStyle === '#140f22') {
    window.pachakutiTraces.arcs.push({ r, transform: this.getTransform().toJSON() });
  }
  return arc.call(this, x, y, r, ...args);
};
"""
DRAW_FRAME = """
([state, col]) => {
  const { engine } = window.__pachakutiAudit;
  const actor = engine.enemies[0];
  actor.state = state;
  window.pachakutiTraces = { sprites: [], arcs: [] };
  engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), col * 10, 'fr');
  return { state, col, ...window.pachakutiTraces };
}
"""


class LocalFixture(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = Path(super().translate_path(path))
        relative = local.relative_to(self.directory)
        if not local.exists():
            asset = ROOT / "public" / relative
            if asset.is_file():
                return str(asset)
        return str(local)

    def log_message(self, fmt, *args):
        pass


def run_case(browser, address, label, width, height, available, output):
    responses, unexpected, errors = [], set(), []
    context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce")
    context.add_init_script(TRACE)

    def route_handler(route):
        url = urlparse(route.request.url)
        if url.netloc != urlparse(address).netloc:
            route.abort()
        elif not available and url.path == ATLAS:
            route.fulfill(status=404, content_type="text/plain", body="Simulated missing atlas")
        else:
            route.continue_()

    context.route("**/*", route_handler)
    page = context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))

    def on_response(response):
        path = urlparse(response.url).path
        if path == ATLAS:
            responses.append({"status": response.status,
                              "sha256": sha256(response.body()).hexdigest() if response.ok else None})
        elif response.status >= 400:
            unexpected.add((path, response.status))

    page.on("response", on_response)
    try:
        page.goto(address + FIXTURE)
        page.wait_for_function("window.__pachakutiAudit?.engine?.enemies?.length > 0")
        actor = page.evaluate("""() => {
          const { engine } = window.__pachakutiAudit;
          engine.setPaused(true);
          const previousWave = engine.wave;
          engine.wave = 3;
          engine.spawnWave();
          const { id, name, hp, currentHp, isBoss, isWorldBoss, weapon } = engine.enemies[0];
          engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), 0, 'fr');
          return { id, name, hp, currentHp, isBoss, isWorldBoss, weapon, previousWave };
        }""")
        assert actor["id"] == BOSS and actor["isWorldBoss"] and actor["isBoss"], actor
        # The Very Hard stage scales the 1550 catalogue template by 1.18.
        assert actor["hp"] == actor["currentHp"] == 1829 and actor["weapon"] == "world_power", actor
        page.wait_for_function("window.pachakutiTraces." + ("sprites" if available else "arcs") + ".length > 0")
        canvas = page.locator("canvas.combat-stage-canvas")
        samples = []
        for row, state in enumerate(("idle", "run", "attack", "hit")):
            for col in range(4):
                sample = page.evaluate(DRAW_FRAME, [state, col])
                if available:
                    assert len(sample["sprites"]) == 1 and not sample["arcs"], sample
                    assert sample["sprites"][0][:4] == [col * 256, row * 256, 256, 256], sample
                    assert sample["sprites"][0][6] == sample["sprites"][0][7] == 126, sample
                else:
                    assert not sample["sprites"] and len(sample["arcs"]) == 1, sample
                samples.append(sample)
                if col == 2 and state in ("idle", "attack"):
                    canvas.screenshot(path=output / f"{label}-{state}.png")
        expected_sha = sha256((ROOT / "public" / ATLAS.lstrip("/")).read_bytes()).hexdigest()
        expected = {"status": 200, "sha256": expected_sha} if available else {"status": 404, "sha256": None}
        assert expected in responses, responses

        hit = page.evaluate("""() => {
          const { engine } = window.__pachakutiAudit;
          const [boss] = engine.enemies;
          const hpBefore = boss.currentHp;
          engine.setPaused(false);
          engine.applyDamage(engine.heroes[0], boss, 40);
          engine.setPaused(true);
          window.pachakutiTraces = { sprites: [], arcs: [] };
          engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), 0, 'fr');
          return { hpBefore, hpAfter: boss.currentHp, state: boss.state, ...window.pachakutiTraces };
        }""")
        assert hit["hpAfter"] < hit["hpBefore"] and hit["state"] == "hit", hit
        if available:
            assert hit["sprites"][0][:4] == [0, 768, 256, 256], hit
        canvas_bounds = canvas.bounding_box()
        # The game occupies the viewport. Trigger the fixture's own cleanup
        # control directly, outside the game's input layer.
        page.locator("#qa-unmount").evaluate("(button) => button.click()")
        page.wait_for_function("window.__pachakutiAudit.engine.disposed")
        assert not errors, errors
        return {"case": label, "actor": actor, "canvasBounds": canvas_bounds,
                "atlasResponses": responses, "samples": samples, "receivedHit": hit,
                "unrelatedHttpErrors": sorted(unexpected), "pageErrors": errors, "disposed": True}
    finally:
        context.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=BASE / "browser")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(LocalFixture, directory=str(BASE / "fixture")))
    worker = Thread(target=server.serve_forever, daemon=True)
    worker.start()
    try:
        address = f"http://127.0.0.1:{server.server_port}"
        results = []
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
            for label, width, height, available in (
                ("desktop", 1280, 800, True), ("mobile", 390, 844, True), ("fallback", 1280, 800, False),
            ):
                results.append(run_case(browser, address, label, width, height, available, args.output))
                (args.output / "results.json").write_text(json.dumps(results, indent=2) + "\n")
                print(label, "passed")
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
        worker.join()


if __name__ == "__main__":
    main()
