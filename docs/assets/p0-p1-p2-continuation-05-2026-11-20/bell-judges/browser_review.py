"""Read existing PNG and record the local Tactics canvas commands."""

from functools import partial
from hashlib import sha256
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = Path("/tmp/mb-bell-judges-20261120")
ROOT = Path(__file__).resolve().parents[4]
ATLAS = "/sprites/generated/bosses/meridian-clockwork/the-twelve-bell-judges.png"
FIXTURE = "/docs/assets/p0-p1-p2-continuation-05-2026-11-20/bell-judges/game-canvas.html"
TRACE = """
window.bellTraces = [];
const draw = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
  if ((image.currentSrc || '').endsWith('/the-twelve-bell-judges.png')) {
    window.bellTraces.push({ args, transform: [...this.getTransform().toFloat64Array()] });
  }
  return draw.call(this, image, ...args);
};
"""
STATES = """
([state, time]) => {
  const { engine } = window.__bellJudgesAudit;
  engine.enemies[0].state = state;
  window.bellTraces = [];
  engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), time, 'fr');
  // The same image also supplies a cropped portrait in the tactical HUD.
  // Keep only the full body or one of the two measured belt-level regions.
  return window.bellTraces.filter(draw => [1024, 146, 149].includes(draw.args[3]));
}
"""


class LocalFixture(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = Path(super().translate_path(path))
        candidate = ROOT / "public" / local.relative_to(self.directory)
        return str(candidate if not local.exists() and candidate.is_file() else local)

    def log_message(self, fmt, *args):
        pass


def verify(browser, address, width, height, reduce):
    responses, errors, unrelated = [], [], set()
    context = browser.new_context(viewport={"width": width, "height": height},
                                  reduced_motion="reduce" if reduce else "no-preference")
    context.add_init_script(TRACE)
    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(address + "/") else route.abort())
    page = context.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))

    def response(res):
        path = urlparse(res.url).path
        if path == ATLAS:
            responses.append({"status": res.status, "sha256": sha256(res.body()).hexdigest() if res.ok else None})
        elif res.status >= 400:
            unrelated.add((path, res.status))

    page.on("response", response)
    label = f"{width}-reduced" if reduce else f"{width}-animated"
    try:
        page.goto(address + FIXTURE)
        page.wait_for_function("window.__bellJudgesAudit?.engine?.enemies?.length === 1 && window.bellTraces.length > 0")
        identity = page.evaluate("""() => {
          const { engine } = window.__bellJudgesAudit;
          engine.setPaused(true);
          const { id, currentHp, isBoss, weapon, gridX, gridY } = engine.enemies[0];
          return { id, currentHp, isBoss, weapon, gridX, gridY };
        }""")
        assert identity["id"] == "meridian_clockwork:the_twelve_bell_judges" and identity["isBoss"], identity
        assert identity["currentHp"] == 640 and identity["weapon"] == "command_staff", identity
        assert responses == [{"status": 200, "sha256": sha256((ROOT / "public" / ATLAS.lstrip("/")).read_bytes()).hexdigest()}], responses

        samples = {}
        for state in ("idle", "run", "attack", "hit"):
            samples[state] = []
            for time in (7, 23):
                trace = page.evaluate(STATES, [state, time])
                if reduce:
                    assert len(trace) == 1 and trace[0]["args"][:4] == [0, 0, 1024, 1024], (state, time, trace)
                else:
                    assert len(trace) == 3, (state, time, trace)
                    assert trace[1]["args"][:4] == [202, 733, 121, 146], trace
                    assert trace[2]["args"][:4] == [452, 763, 122, 149], trace
                samples[state].append(trace)
            if not reduce:
                assert samples[state][0][0] == samples[state][1][0]
                assert all(a["transform"] != b["transform"] for a, b in zip(samples[state][0][1:], samples[state][1][1:]))
            if state == "attack":
                page.screenshot(path=BASE / f"{label}.jpg", type="jpeg", quality=75)
        if not reduce:
            assert len({tuple(draw["transform"]) for rows in samples.values() for draw in rows[0][1:]}) == 8

        hit = page.evaluate("""() => {
          const { engine } = window.__bellJudgesAudit;
          const [boss] = engine.enemies;
          engine.setPaused(false);
          boss.state = 'idle';
          const previous = boss.currentHp;
          engine.applyDamage(engine.heroes[0], boss, 40, null, { ignoreCover: true });
          engine.setPaused(true);
          window.bellTraces = [];
          engine.draw(document.querySelector('canvas.combat-stage-canvas').getContext('2d'), 23, 'fr');
          const traces = window.bellTraces.filter(draw => [1024, 146, 149].includes(draw.args[3]));
          return { previous, current: boss.currentHp, state: boss.state, gridX: boss.gridX, gridY: boss.gridY, traces };
        }""")
        assert hit["current"] < hit["previous"] and hit["state"] == "hit", hit
        assert [hit["gridX"], hit["gridY"]] == [identity["gridX"], identity["gridY"]], hit
        assert hit["traces"] == samples["hit"][1], hit
        page.locator("#qa-unmount").evaluate("(button) => button.click()")
        page.wait_for_function("window.__bellJudgesAudit.engine.disposed")
        assert not errors, errors
        return {"label": label, "reducedMotion": reduce, "identity": identity, "atlasResponses": responses,
                "samples": samples, "hit": hit, "pageErrors": errors, "unrelatedHttpErrors": sorted(unrelated), "disposed": True}
    finally:
        context.close()


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(LocalFixture, directory=str(BASE / "fixture")))
    worker = Thread(target=server.serve_forever, daemon=True)
    worker.start()
    try:
        address = f"http://127.0.0.1:{server.server_port}"
        results = []
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
            for width, height, reduce in ((1280, 800, False), (390, 844, False), (1280, 800, True)):
                result = verify(browser, address, width, height, reduce)
                results.append(result)
                print(result["label"], "passed")
            browser.close()
        (BASE / "browser-results.json").write_text(json.dumps(results, separators=(",", ":")) + "\n")
    finally:
        server.shutdown()
        server.server_close()
        worker.join()


if __name__ == "__main__":
    main()
