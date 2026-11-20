"""Serve one code-only fixture and verify the actual RPG enemy rendering."""

import argparse
from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = Path("/tmp/mb-aether-mite-20261120")
ROOT = Path(__file__).resolve().parents[4]
ATLAS = "/sprites/generated/bosses/the-aether-crown/aether-mite-swarm-animated.png"
FIXTURE = "/docs/assets/p0-p1-p2-continuation-04-2026-11-20/aether-mite-swarm/game-canvas.html"
ACTOR = "aether_crown:aether_mite_swarm"
STILL = ATLAS.replace("-animated.png", ".png")
TRACE = """
window.aetherMiteTraces = { sprites: [], stills: [] };
const draw = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
  const src = image.currentSrc || '';
  if (src.endsWith('/aether-mite-swarm-animated.png')) window.aetherMiteTraces.sprites.push(args);
  if (src.endsWith('/aether-mite-swarm.png')) window.aetherMiteTraces.stills.push(args);
  return draw.call(this, image, ...args);
};
"""
DRAW_FRAME = """
([state, col, actorId]) => {
  const { engine } = window.__aetherMiteAudit;
  const actor = engine.enemies.find(enemy => enemy.id === actorId);
  actor.state = state;
  window.aetherMiteTraces = { sprites: [], stills: [] };
  engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), col * 10, 'fr');
  return { state, col, ...window.aetherMiteTraces };
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
        if path in (ATLAS, STILL):
            responses.append({"path": path, "status": response.status,
                              "sha256": sha256(response.body()).hexdigest() if response.ok else None})
        elif response.status >= 400:
            unexpected.add((path, response.status))

    page.on("response", on_response)
    try:
        page.goto(address + FIXTURE)
        page.wait_for_function("window.__aetherMiteAudit?.engine?.enemies?.length > 0")
        actor = page.evaluate("""(actorId) => {
          const { engine } = window.__aetherMiteAudit;
          engine.setPaused(true);
          const { id, name, hp, currentHp, isBoss, weapon } = engine.enemies.find(enemy => enemy.id === actorId);
          engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), 0, 'fr');
          return { id, name, hp, currentHp, isBoss, weapon, wave: engine.wave };
        }""", ACTOR)
        assert actor["id"] == ACTOR and not actor["isBoss"] and actor["wave"] == 1, actor
        assert actor["hp"] == actor["currentHp"] and actor["weapon"] == "staff", actor
        page.wait_for_function("window.aetherMiteTraces." + ("sprites" if available else "stills") + ".length > 0")
        canvas = page.locator("canvas.combat-stage-canvas")
        samples = []
        for row, state in enumerate(("idle", "run", "attack", "hit")):
            for col in range(4):
                sample = page.evaluate(DRAW_FRAME, [state, col, ACTOR])
                if available:
                    assert len(sample["sprites"]) == 1 and not sample["stills"], sample
                    assert sample["sprites"][0][:4] == [col * 256, row * 256, 256, 256], sample
                    assert sample["sprites"][0][6] == sample["sprites"][0][7] > 0, sample
                else:
                    assert not sample["sprites"] and len(sample["stills"]) == 1, sample
                    assert sample["stills"][0][:4] == [0, 0, 1024, 1024], sample
                samples.append(sample)
                if col == 2 and state == "attack":
                    canvas.screenshot(path=output / f"{label}-{state}.png")
        def expected(path, status):
            digest = sha256((ROOT / "public" / path.lstrip("/")).read_bytes()).hexdigest() if status == 200 else None
            return {"path": path, "status": status, "sha256": digest}

        assert expected(ATLAS, 200 if available else 404) in responses, responses
        if not available:
            assert expected(STILL, 200) in responses, responses

        hit = page.evaluate("""(actorId) => {
          const { engine } = window.__aetherMiteAudit;
          const mite = engine.enemies.find(enemy => enemy.id === actorId);
          const hpBefore = mite.currentHp;
          engine.setPaused(false);
          engine.applyDamage(engine.heroes[0], mite, 40);
          engine.setPaused(true);
          window.aetherMiteTraces = { sprites: [], stills: [] };
          engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), 0, 'fr');
          return { hpBefore, hpAfter: mite.currentHp, state: mite.state, ...window.aetherMiteTraces };
        }""", ACTOR)
        assert hit["hpAfter"] < hit["hpBefore"] and hit["state"] == "hit", hit
        if available:
            assert hit["sprites"][0][:4] == [0, 768, 256, 256], hit
        canvas_bounds = canvas.bounding_box()
        # The game occupies the viewport. Trigger the fixture's own cleanup
        # control directly, outside the game's input layer.
        page.locator("#qa-unmount").evaluate("(button) => button.click()")
        page.wait_for_function("window.__aetherMiteAudit.engine.disposed")
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
