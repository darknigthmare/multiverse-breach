"""Real Chromium UI checks against a local build; all Auth traffic is simulated.

Install: python -m pip install playwright==1.57.0
         python -m playwright install --with-deps chromium
Run after starting Vite or vite preview on 127.0.0.1:4173.
No production accounts, outbound emails, credentials or save endpoints are used.
"""
import argparse
import json
import os
from pathlib import Path
import re
import time
import traceback
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright, expect

SAVE_KEY = "multiverse_breach_save_v2"
SESSION_KEY = "multiverse_breach_supabase_session_v1"
RAW_SAVE = json.dumps({"saveVersion": 9, "gold": 4321, "breachShards": 123,
    "playerProfile": {"name": "QA Anchor"}, "unlockedHeroes": ["player_anchor"],
    "activeTeam": ["player_anchor"], "inventory": ["nexus_anchor_coil"],
    "onboarding": {"profileCreated": True, "prologueCompleted": True, "introSeen": True, "prologueStep": 4}})
RAW_SESSION = json.dumps({"user": {"id": "existing-other-account", "email": "previous@example.test"},
    "access_token": "synthetic-existing-token", "refresh_token": "synthetic-existing-refresh", "expires_at": 9999999999})
IDENTITY = {"id": "recovery-test-account", "email": "recovery@example.test", "email_confirmed_at": "2026-10-16T00:00:00Z"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4173")
    parser.add_argument("--evidence", default="/tmp/multiverse-browser-evidence")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    # Restrict this harness to the local server: never seed or exercise real accounts.
    if urlparse(base).hostname not in ("localhost", "127.0.0.1", "::1"):
        raise ValueError("This mock-auth harness only accepts a loopback base URL")
    output = Path(args.evidence); output.mkdir(parents=True, exist_ok=True)
    results = []
    with sync_playwright() as p:
        launch = {"headless": True}
        if os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE"):
            launch["executable_path"] = os.environ["PLAYWRIGHT_CHROMIUM_EXECUTABLE"]
        browser = p.chromium.launch(**launch)

        def new_case(width=1280, expired=False, denied=False, guest=False, rate_limited=False):
            context = browser.new_context(viewport={"width": width, "height": 844 if width < 500 else 900}, reduced_motion="reduce")
            page = context.new_page(); page.set_default_timeout(15000)
            errors = []; calls = []; blocked = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            init = """(values => {
              localStorage.setItem(values.saveKey, values.save);
              if (values.session) localStorage.setItem(values.sessionKey, values.session);
              if (values.denied) {
                Storage.prototype.setItem = () => { throw new DOMException('QA storage denied', 'SecurityError'); };
                Storage.prototype.removeItem = () => { throw new DOMException('QA storage denied', 'SecurityError'); };
              }
            })(%s);""" % json.dumps({"saveKey": SAVE_KEY, "save": RAW_SAVE, "sessionKey": SESSION_KEY,
                                      "session": None if guest else RAW_SESSION, "denied": denied})
            page.add_init_script(init)

            def route(request_route):
                request = request_route.request
                url = urlparse(request.url)
                if url.path == "/api/supabase-config" and url.hostname in ("localhost", "127.0.0.1"):
                    request_route.fulfill(json={"supabaseUrl": "https://auth.example.test", "supabaseAnonKey": "public-synthetic-key"}); return
                if url.hostname == "auth.example.test":
                    # Only this explicitly intercepted fake origin can see synthetic tokens.
                    calls.append({"path": url.path, "query": parse_qs(url.query), "method": request.method,
                                  "body": request.post_data_json if request.post_data else None})
                    if "/rest/" in url.path:
                        blocked.append(request.url); request_route.fulfill(status=500, json={"message": "Save access forbidden in auth recovery"}); return
                    if url.path.endswith("/verify"):
                        request_route.fulfill(json={"access_token": "verified-synthetic-token", "refresh_token": "discard-synthetic-refresh", "user": IDENTITY}); return
                    if url.path.endswith("/user"):
                        if expired: request_route.fulfill(status=401, json={"message": "Expired token"})
                        else: request_route.fulfill(json=IDENTITY)
                        return
                    if rate_limited:
                        request_route.fulfill(status=429, headers={"Retry-After": "90", "Content-Type": "application/json"}, body='{"message":"Too many requests"}'); return
                    request_route.fulfill(json={}); return
                if url.hostname not in ("localhost", "127.0.0.1"):
                    # Fonts and unrelated resources cannot leave this isolated test.
                    request_route.abort(); return
                request_route.continue_()
            page.route("**/*", route)
            return context, page, errors, calls, blocked

        def unchanged(page, errors, calls, blocked):
            assert page.evaluate("key => localStorage.getItem(key)", SAVE_KEY) == RAW_SAVE, "Auth callback altered a game save"
            assert page.evaluate("key => localStorage.getItem(key)", SESSION_KEY) == RAW_SESSION, "Auth callback adopted another account"
            assert not errors, errors
            assert not blocked, blocked
            assert not any("/rest/" in call["path"] for call in calls)
            assert not re.search(r"access_token|refresh_token|token_hash|synthetic-token", page.url), "Credentials remained in URL"
            assert page.locator(".auth-panel-shell").count() == 0, "Game must stay unmounted during auth recovery"
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Horizontal overflow"

        def run(name, action):
            before = time.monotonic()
            try:
                action()
                results.append({"case": name, "status": "passed", "seconds": round(time.monotonic() - before, 3)})
                print("PASS", name, flush=True)
            except Exception as error:
                results.append({"case": name, "status": "failed", "error": str(error), "trace": traceback.format_exc()})
                print("FAIL", name, str(error), flush=True)
            finally:
                for context in browser.contexts: context.close()
                (output / "browser-results.json").write_text(json.dumps({"results": results, "passed": sum(r["status"] == "passed" for r in results), "failed": sum(r["status"] != "passed" for r in results), "auth": "simulated transport; no production accounts"}, indent=2))

        for width in (1280, 390):
            def recovery(width=width):
                _, page, errors, calls, blocked = new_case(width)
                page.goto(base + "/?qa=preserved#type=recovery&access_token=synthetic-recovery-token&refresh_token=synthetic-refresh", wait_until="domcontentloaded")
                expect(page.locator("#recovery-password")).to_be_visible()
                assert len([c for c in calls if c["path"].endswith("/user")]) == 1
                unchanged(page, errors, calls, blocked)
                page.locator("#recovery-password").fill("test-password-123")
                page.locator("#recovery-confirmation").fill("different-pass-123")
                page.get_by_role("button", name="Changer le mot de passe", exact=True).click()
                expect(page.get_by_role("alert")).to_contain_text("correspondent pas")
                assert not any(c["method"] == "PUT" for c in calls)
                page.locator("#recovery-confirmation").fill("test-password-123")
                page.screenshot(path=str(output / f"recovery-{width}-form.png"), full_page=True)
                page.locator('button[type="submit"]').evaluate("button => { button.click(); button.click(); }")
                expect(page.get_by_role("status")).to_contain_text("Mot de passe modifie")
                assert len([c for c in calls if c["method"] == "PUT"]) == 1
                unchanged(page, errors, calls, blocked)
                page.get_by_role("button", name="Passer en anglais").click()
                expect(page.get_by_role("status")).to_contain_text("Password changed")
                page.screenshot(path=str(output / f"recovery-{width}-complete.png"), full_page=True)
                unchanged(page, errors, calls, blocked)
            run(f"recovery-mismatch-single-submit-preserved-storage-{width}", recovery)

        def hashed():
            _, page, errors, calls, blocked = new_case()
            page.goto(base + "/?type=recovery&token_hash=synthetic-hash", wait_until="domcontentloaded")
            expect(page.locator("#recovery-password")).to_be_visible()
            assert len([c for c in calls if c["path"].endswith("/verify")]) == 1
            unchanged(page, errors, calls, blocked)
        run("hash-verification-once-under-StrictMode", hashed)

        for width in (1280, 390):
            def confirmed(width=width):
                _, page, errors, calls, blocked = new_case(width)
                page.goto(base + "/#type=signup&access_token=synthetic-signup-token", wait_until="domcontentloaded")
                expect(page.get_by_role("status")).to_contain_text("Adresse email confirmee")
                assert page.locator('input[type="password"]').count() == 0
                assert not any(c["method"] == "PUT" for c in calls)
                unchanged(page, errors, calls, blocked)
                page.screenshot(path=str(output / f"confirmation-{width}.png"), full_page=True)
            run(f"email-confirmation-without-game-adoption-{width}", confirmed)

        for mode in ("expired", "invalid", "denied"):
            def unusual(mode=mode):
                _, page, errors, calls, blocked = new_case(390, expired=mode == "expired", denied=mode == "denied")
                suffix = "#type=recovery&access_token=synthetic-recovery-token"
                if mode == "invalid": suffix += "&token_hash=mixed-invalid-proof"
                page.goto(base + "/" + suffix, wait_until="domcontentloaded")
                if mode == "denied": expect(page.locator("#recovery-password")).to_be_visible()
                else:
                    expect(page.get_by_role("alert")).to_contain_text("invalide ou expire")
                    assert page.locator('input[type="password"]').count() == 0
                    assert not any(c["method"] == "PUT" for c in calls)
                unchanged(page, errors, calls, blocked)
            run(f"recovery-{mode}", unusual)

        for operation in ("recover", "resend", "rate-limit"):
            def email_ui(operation=operation):
                _, page, errors, calls, blocked = new_case(390, guest=True, rate_limited=operation == "rate-limit")
                page.goto(base + "/", wait_until="domcontentloaded")
                page.get_by_role("button", name="CONTINUER", exact=True).click(timeout=30000)
                page.locator(".auth-panel-toggle").click(timeout=30000)
                panel = page.locator(".auth-panel-content")
                reset = panel.get_by_role("button", name="Mot de passe oublie", exact=True)
                expect(reset).to_be_disabled()
                panel.locator('input[type="email"]').fill("qa@example.test")
                expect(reset).to_be_enabled()
                button = panel.get_by_role("button", name="Renvoyer la confirmation", exact=True) if operation == "resend" else reset
                button.evaluate("button => { button.click(); button.click(); }")
                if operation == "rate-limit": expect(panel.get_by_role("alert")).to_contain_text("Trop de demandes")
                else: expect(panel.locator(".auth-email-tools [role=status]")).to_contain_text("Si cette adresse correspond")
                endpoint = "/resend" if operation == "resend" else "/recover"
                requests = [c for c in calls if c["path"].endswith(endpoint)]
                assert len(requests) == 1, requests
                assert requests[0]["query"]["redirect_to"] == [base + "/"]
                expect(reset).to_be_disabled()
                assert not blocked and not errors, (blocked, errors)
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Horizontal overflow"
                page.screenshot(path=str(output / f"account-{operation}-mobile.png"), full_page=True)
            run(f"actual-account-panel-{operation}", email_ui)
        browser.close()
    passed = sum(r["status"] == "passed" for r in results)
    print(f"Browser checks: {passed}/{len(results)} passed", flush=True)
    if passed != len(results): raise SystemExit(1)


if __name__ == "__main__":
    main()
