#!/usr/bin/env python3
"""Independent, read-only batch-receipt audit. No producer JS is executed.

Only audit reports and an optional compressed SHA index are written. Native Git
payloads are streamed through a 1 MiB buffer only when --hash-raw-git is passed.
No images are decoded again, and LFS payloads are never downloaded here.
"""
import argparse
import collections
import datetime
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

BUFFER = 1024 * 1024
HERE = Path(__file__).resolve().parent
HASH = re.compile(r"^[a-f0-9]{64}$")
RASTER = {"png": {"png"}, "webp": {"webp"}, "jpg": {"jpeg"}, "jpeg": {"jpeg"},
          "gif": {"gif"}, "tif": {"tiff"}, "tiff": {"tiff"}, "avif": {"heif", "avif"},
          "heif": {"heif"}, "heic": {"heif"}, "jp2": {"jp2"}, "jxl": {"jxl"},
          "bmp": {"bmp", "magick"}, "ico": {"ico", "magick"}}
RUNNER_FILES = ["dlcAssetBatches.mjs", "dlcBatchAssetSource.mjs", "dlcAssetBatchDecode.mjs",
                "dlcDistribution.mjs", "dlcDistributionFilesystem.mjs", "dlcAssetPaths.mjs",
                "dlcCommonUiAssets.mjs", "dlcSharedAssetDependencies.mjs"]


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def utf16_key(value):
    return value.encode("utf-16-be", "surrogatepass")


def canonical(value):
    def ordered(item):
        if isinstance(item, dict):
            indices = [key for key in item if re.fullmatch(r"0|[1-9][0-9]*", key) and int(key) < 4294967295]
            keys = sorted(indices, key=int) + sorted(set(item) - set(indices), key=utf16_key)
            return {key: ordered(item[key]) for key in keys}
        if isinstance(item, list):
            return [ordered(child) for child in item]
        return item
    return json.dumps(ordered(value), ensure_ascii=False, separators=(",", ":"), allow_nan=False).encode("utf-8")


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key: " + key)
        result[key] = value
    return result


def load_bytes(data):
    return json.loads(data, object_pairs_hook=unique_object,
                      parse_constant=lambda value: (_ for _ in ()).throw(ValueError("non-finite JSON number")))


def regular_bytes(file):
    if file.is_symlink() or not file.is_file():
        raise ValueError("expected a regular non-symlink input: " + str(file))
    return file.read_bytes()


def check(condition, message):
    if not condition:
        raise ValueError(message)


def closed_fields(value, allowed, name):
    check(isinstance(value, dict) and set(value) <= set(allowed), name + ": unsupported fields or scope claims")


def check_seal(value, name):
    check(isinstance(value, dict), name + ": object required")
    body = {key: item for key, item in value.items() if key != "sha256"}
    check(HASH.fullmatch(value.get("sha256", "")) and sha256(canonical(body)) == value["sha256"],
          name + ": canonical JSON SHA-256 differs")


def git_env():
    return {**os.environ, "GIT_OPTIONAL_LOCKS": "0", "GIT_NO_LAZY_FETCH": "1", "GIT_LFS_SKIP_SMUDGE": "1"}


def git(repo, args):
    return subprocess.run(["git", "-C", str(repo), *args], check=True, stdout=subprocess.PIPE,
                          stderr=subprocess.PIPE, env=git_env()).stdout


class GitBlobs:
    def __init__(self, repo):
        self.process = subprocess.Popen(["git", "-C", str(repo), "cat-file", "--batch"],
                                        stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                        stderr=subprocess.DEVNULL, env=git_env())

    def read(self, oid, keep=False):
        check(re.fullmatch(r"[a-f0-9]{40}|[a-f0-9]{64}", oid), "invalid Git OID")
        self.process.stdin.write((oid + "\n").encode("ascii"))
        self.process.stdin.flush()
        header = self.process.stdout.readline().decode("ascii").strip().split()
        check(len(header) == 3 and header[0] == oid and header[1] == "blob", "Git blob unavailable: " + oid)
        size = int(header[2])
        check(not keep or size <= 25 * BUFFER, "metadata blob exceeds 25 MiB boundary")
        native = hashlib.new("sha1" if len(oid) == 40 else "sha256")
        native.update(("blob " + str(size) + "\0").encode("ascii"))
        payload = hashlib.sha256()
        chunks = [] if keep else None
        remaining = size
        while remaining:
            chunk = self.process.stdout.read(min(BUFFER, remaining))
            check(bool(chunk), "truncated Git object stream")
            remaining -= len(chunk)
            native.update(chunk)
            payload.update(chunk)
            if keep:
                chunks.append(chunk)
        check(self.process.stdout.read(1) == b"\n", "invalid Git batch stream separator")
        check(native.hexdigest() == oid, "Git object content does not match its OID")
        return {"gitBlobOid": oid, "bytes": size, "sha256": payload.hexdigest()}, b"".join(chunks) if keep else None

    def close(self):
        self.process.stdin.close()
        self.process.stdout.close()
        self.process.wait(timeout=30)


def pointer(data):
    text = data.decode("utf-8-sig", errors="replace").replace("\r\n", "\n")
    if not re.match(r"^version https://git-lfs.github.com/spec/v1(?:\n|$)", text):
        return None
    lines = text.rstrip().split("\n")
    check(len(lines) == 3 and len(set(lines)) == 3, "unsupported LFS pointer")
    oid = next((line[11:] for line in lines if re.fullmatch(r"oid sha256:[a-f0-9]{64}", line)), None)
    size = next((int(line[5:]) for line in lines if re.fullmatch(r"size [0-9]+", line)), None)
    check(oid is not None and size is not None and size < 2**53, "invalid LFS pointer")
    return {"sha256": oid, "bytes": size}


def safe_relative(value):
    check(isinstance(value, str) and value and not value.startswith("/") and not re.search(r"[\\:%?#\x00-\x1f\x7f]", value)
          and all(part not in ("", ".", "..") for part in value.split("/")), "unsafe asset path")


def main_audit(args):
    repo = args.repo.resolve()
    run = args.run_dir.resolve()
    plan = load_bytes(regular_bytes(run / "all-plan.json"))
    check_seal(plan, "plan")
    closed_fields(plan, ["schemaVersion", "kind", "sourceRevision", "runner", "profile", "layout", "limits", "inventory", "assetCount", "payloadBytes", "unknownPayloadAssets", "batches", "sha256"], "plan")
    check(plan["kind"] == "dlc-asset-batch-plan" and plan["schemaVersion"] == 1 and plan["layout"] == "sources", "unsupported plan schema/layout")
    revision = plan["sourceRevision"]
    check(re.fullmatch(r"[a-f0-9]{40}", revision), "sourceRevision must be a full commit")
    check(git(repo, ["rev-parse", "--verify", revision + "^{commit}"]).decode().strip() == revision, "sourceRevision is not the exact Git commit")
    tree = {}
    for entry in git(repo, ["ls-tree", "-rlz", revision]).split(b"\0"):
        if entry:
            info, name = entry.split(b"\t", 1)
            mode, kind, oid, size = info.decode().split()
            tree[name.decode("utf-8")] = {"mode": mode, "kind": kind, "oid": oid, "bytes": int(size) if size != "-" else None}
    blobs = GitBlobs(repo)
    small = {}
    native_hashes = {}
    try:
        inventory = {}
        for item in plan["inventory"]:
            safe_relative(item["path"])
            check(item["path"] not in inventory, "duplicate inventory input")
            row = tree.get(item["path"])
            check(row and row["kind"] == "blob" and row["mode"] in ("100644", "100755") and row["oid"] == item["gitBlobOid"], "metadata Git OID differs: " + item["path"])
            got, data = blobs.read(row["oid"], keep=True)
            check(got["bytes"] == item["bytes"] and got["sha256"] == item["sha256"], "metadata SHA/length differs: " + item["path"])
            inventory[item["path"]] = data
            small[row["oid"]] = data
        required_snapshot = {name for name in tree if re.fullmatch(r"(?:DLC/(?:index\.js|shared-assets\.json|shared-asset-dependencies\.json)|DLC/[^/]+/(?:manifest|assets)\.json|index\.html)", name)
                             or re.fullmatch(r"(?:src/components/.*\.(?:[cm]?js|jsx|tsx?|css)|src/App\.(?:[cm]?js|jsx|tsx?)|src/[^/]+\.css)", name)}
        check(set(inventory) == required_snapshot, "plan omits/adds frozen metadata or common UI inputs")
        runner = plan["runner"]
        check([item["path"] for item in runner["files"]] == ["scripts/" + name for name in RUNNER_FILES], "runner dependency list differs")
        head = runner["gitHeadAtPlanCreation"]
        check(re.fullmatch(r"[a-f0-9]{40}", head), "runner Git head is not a full commit")
        runner_matches = []
        for item in runner["files"]:
            frozen = git(repo, ["show", head + ":" + item["path"]])
            matched = sha256(frozen) == item["sha256"]
            check(item["matchesGitHead"] == matched, "runner Git-match claim differs")
            check(sha256(regular_bytes(repo / item["path"])) == item["sha256"], "current runner code changed: " + item["path"])
            runner_matches.append(matched)
        check(runner["actualRunnerFileSha256"] == runner["files"][0]["sha256"], "runner file SHA differs")
        check(runner["implementationSha256"] == sha256(canonical(runner["files"])), "runner implementation digest differs")
        expected_version = "matches-recorded-git-head" if all(runner_matches) else "actual-files-differ-from-recorded-git-head"
        check(runner["workingTreeVersion"] == expected_version, "runner working-tree claim differs")
        profile = plan["profile"]
        check(profile["schemaVersion"] == 1 and profile["mode"] in ("all", "base", "selected") and profile["sharedPolicy"] == "preserve-all", "unsupported independent selection profile/policy")
        manifests = []
        for name, data in inventory.items():
            if re.fullmatch(r"DLC/[^/]+/manifest.json", name):
                manifest = load_bytes(data)
                check(manifest["directory"] + "/manifest.json" == name, "manifest directory differs")
                manifests.append(manifest)
        check(len({item["id"] for item in manifests}) == len(manifests), "duplicate manifest identity")
        known = {item["id"] for item in manifests}
        requested = profile["packIds"]
        check(len(set(requested)) == len(requested) and set(requested) <= known, "invalid requested pack IDs")
        check((profile["mode"] == "selected") == bool(requested), "profile mode/packIds mismatch")
        selected = known if profile["mode"] == "all" else set(requested)
        declared = []
        inventories = [("DLC/shared-assets.json", None)] + [(item["directory"] + "/assets.json", item) for item in manifests]
        for file, manifest in inventories:
            check(file in inventory, "missing frozen inventory: " + file)
            content = load_bytes(inventory[file])
            for asset in content["assets"]:
                source, public = asset["sourcePath"], asset["publicPath"]
                safe_relative(source)
                check(public.startswith("/") and source == ("public" + public if source.startswith("public/") else manifest["directory"] + "/assets" + public), "asset source/public projection differs")
                owner = None if source.startswith("public/") else manifest["id"]
                if owner is None or owner in selected:
                    declared.append({"sourcePath": source, "publicPath": public, "destinationPath": "public" + public, "ownerPackId": owner, "declaredBy": file})
        declared.sort(key=lambda item: utf16_key(item["destinationPath"]))
        expected_by_source = {item["sourcePath"]: item for item in declared}
        check(len(expected_by_source) == len(declared) and len({item["publicPath"] for item in declared}) == len(declared), "duplicate canonical asset projection")
        assets = [asset for batch in plan["batches"] for asset in batch["assets"]]
        check(len(assets) == plan["assetCount"] == len(declared), "plan asset count differs from frozen profile inventories")
        check([item["sourcePath"] for item in assets] == [item["sourcePath"] for item in declared], "plan asset order/inclusion differs from frozen inventories")
        limits = plan["limits"]
        check(1 <= limits["maxAssets"] <= 40 and 0 < limits["maxBatchBytes"] <= 256 * BUFFER and 0 < limits["maxAssetBytes"] <= 256 * BUFFER
              and 0 < limits["maxTempBytes"] <= 512 * BUFFER and limits["decode"] in ("raster", "none"), "plan limits are outside bounded contract")
        pointer_count = 0
        raw_unique = {}
        for asset in assets:
            check(all(asset[key] == value for key, value in expected_by_source[asset["sourcePath"]].items()), "plan asset provenance differs")
            row = tree.get(asset["sourcePath"])
            check(row and row["kind"] == "blob" and row["mode"] in ("100644", "100755"), "canonical asset is absent or not a regular Git blob")
            check(row["oid"] == asset["gitBlobOid"] and row["bytes"] == asset["gitBlobBytes"], "asset Git OID/blob length differs")
            lfs = None
            if row["bytes"] <= 1024:
                if row["oid"] not in small:
                    got, data = blobs.read(row["oid"], keep=True)
                    small[row["oid"]] = data
                    native_hashes[row["oid"]] = got
                lfs = pointer(small[row["oid"]])
            if lfs:
                check(asset["contentKind"] == "lfs-payload" and asset["expectedSha256"] == asset["lfsPayloadOid"] == lfs["sha256"]
                      and asset["payloadBytes"] == lfs["bytes"], "plan differs from canonical LFS pointer SHA/length")
                pointer_count += 1
            else:
                check(asset["contentKind"] == "git-blob" and asset["expectedSha256"] is None and asset["lfsPayloadOid"] is None
                      and asset["payloadBytes"] == row["bytes"], "native Git payload metadata differs")
                raw_unique[row["oid"]] = row["bytes"]
        check(sum(item["payloadBytes"] for item in assets) == plan["payloadBytes"] and plan["unknownPayloadAssets"] == 0, "plan byte/unknown totals differ")
        batches = {}
        for index, batch in enumerate(plan["batches"]):
            check_seal(batch, "batch " + str(index))
            check(batch["id"] == f"{index:05d}" and 1 <= len(batch["assets"]) <= limits["maxAssets"], "batch ID/count differs")
            size = sum(item["payloadBytes"] for item in batch["assets"])
            check(batch["payloadBytes"] == size and batch["oversized"] == (size > limits["maxBatchBytes"])
                  and batch["exceedsAssetLimit"] == any(item["payloadBytes"] > limits["maxAssetBytes"] for item in batch["assets"]), "batch size flags differ")
            check(size <= limits["maxBatchBytes"] or len(batch["assets"]) == 1, "oversized batch is not an isolated asset")
            check(batch["stagedByteUpperBound"] == sum(item["payloadBytes"] for item in batch["assets"] if item["payloadBytes"] <= limits["maxAssetBytes"]), "staged byte bound differs")
            batches[batch["id"]] = batch
        receipt_files = sorted((run / "all").glob("batch-*.json"))
        if args.hash_raw_git:
            check(len(receipt_files) == len(batches), "full native Git stream audit is reserved for the completed receipt corpus")
            for index, (oid, size) in enumerate(sorted(raw_unique.items())):
                if oid not in native_hashes:
                    got, _data = blobs.read(oid)
                    check(got["bytes"] == size, "streamed native blob length differs")
                    native_hashes[oid] = got
                if index % 1000 == 0:
                    print(json.dumps({"stage": "native-git-sha256", "done": index, "uniqueBlobs": len(raw_unique)}), flush=True)
            index_body = {"schemaVersion": 1, "kind": "independent-native-git-sha256-index", "sourceRevision": revision,
                          "auditScriptSha256": sha256(Path(__file__).read_bytes()), "objects": [native_hashes[oid] for oid in sorted(raw_unique)]}
            index_body["sha256"] = sha256(canonical(index_body))
            with gzip.open(HERE / "native-git-sha256-index.json.gz", "wt", encoding="utf-8") as output:
                json.dump(index_body, output, ensure_ascii=False, separators=(",", ":"))
        counts = collections.Counter({key: 0 for key in ("assetsObserved", "passedAssets", "unavailableAssets", "passedBatches", "unavailableBatches",
                                     "verifiedPayloadBytes", "rasterDecoded", "integrityOnly", "passedLfsSha256BoundToPointer", "passedNativeSha256IndependentlyCompared")})
        source_kinds = collections.Counter()
        codes = collections.Counter()
        extension_scopes = collections.defaultdict(collections.Counter)
        seen = set()
        receipts_manifest = []
        unavailable = []
        receipt_data = {}
        native_passed_unchecked = 0
        for file in receipt_files:
            raw = regular_bytes(file)
            receipt = load_bytes(raw)
            check_seal(receipt, file.name)
            closed_fields(receipt, ["schemaVersion", "kind", "scope", "planSha256", "batchSha256", "sourceRevision", "runnerSha256", "profile", "layout", "batchId", "status", "assets", "sha256"], "receipt")
            batch_id = receipt.get("batchId")
            check(file.name == "batch-" + str(batch_id) + ".json" and batch_id in batches and batch_id not in seen, "receipt filename/ID differs")
            seen.add(batch_id)
            receipt_data[batch_id] = receipt
            batch = batches[batch_id]
            check(receipt["kind"] == "dlc-asset-batch-receipt" and receipt["schemaVersion"] == 1 and receipt["status"] in ("PASSED", "UNAVAILABLE"), "receipt schema/status differs")
            check(receipt["planSha256"] == plan["sha256"] and receipt["batchSha256"] == batch["sha256"] and receipt["sourceRevision"] == revision
                  and receipt["runnerSha256"] == runner["implementationSha256"] and receipt["profile"] == profile and receipt["layout"] == plan["layout"], "receipt commit/code/profile/layout binding differs")
            check(receipt.get("scope") == "Canonical payload integrity and optional raster decoding; no production deployment or artwork fidelity approval.", "receipt scope overclaims/differs")
            check(len(receipt["assets"]) == len(batch["assets"]), "receipt asset count differs")
            batch_passed = True
            for actual, expected in zip(receipt["assets"], batch["assets"]):
                common_fields = ["sourcePath", "publicPath", "gitBlobOid", "expectedBytes", "status"]
                closed_fields(actual, common_fields + (["code"] if actual.get("status") == "UNAVAILABLE" else ["bytes", "sha256", "sourceKind", "decode"]), "asset receipt")
                check(all(actual.get(key) == expected[key] for key in ("sourcePath", "publicPath", "gitBlobOid")) and actual["expectedBytes"] == expected["payloadBytes"], "receipt asset identity/expected length differs")
                check(actual["status"] in ("PASSED", "UNAVAILABLE"), "untyped asset status")
                extension = Path(actual["sourcePath"]).suffix.lower().lstrip(".")
                counts["assetsObserved"] += 1
                if actual["status"] == "UNAVAILABLE":
                    check(re.fullmatch(r"[A-Z0-9_]+", actual.get("code", "")), "unsafe/missing unavailable code")
                    counts["unavailableAssets"] += 1
                    codes[actual["code"]] += 1
                    unavailable.append({"batchId": batch_id, "sourcePath": actual["sourcePath"], "code": actual["code"]})
                    batch_passed = False
                    continue
                check(HASH.fullmatch(actual.get("sha256", "")) and actual["bytes"] == expected["payloadBytes"], "passed asset SHA/length malformed")
                if expected["contentKind"] == "lfs-payload":
                    check(actual["sha256"] == expected["expectedSha256"] and actual["sourceKind"] in ("core-lfs-cache", "fetched-lfs", "historical-git-lfs"), "LFS receipt SHA/source kind differs")
                    counts["passedLfsSha256BoundToPointer"] += 1
                else:
                    check(actual["sourceKind"] == "git-blob", "native source kind differs")
                    known = native_hashes.get(expected["gitBlobOid"])
                    if known:
                        check(actual["sha256"] == known["sha256"], "native receipt SHA-256 differs from independent Git stream")
                        counts["passedNativeSha256IndependentlyCompared"] += 1
                    else:
                        native_passed_unchecked += 1
                decode = actual.get("decode", {})
                if limits["decode"] == "raster" and extension in RASTER:
                    closed_fields(decode, ["status", "format", "width", "height", "pages", "decodedPixels", "scope"], "raster decode")
                    check(decode.get("status") == "PASSED" and decode.get("format") in RASTER[extension]
                          and decode.get("scope") == "sharp-raster-decode-supported-pages", "raster decode status/format/scope differs")
                    dims = [decode.get(key) for key in ("width", "height", "pages")]
                    check(all(isinstance(value, int) and not isinstance(value, bool) and value > 0 for value in dims), "invalid raster dimensions/pages")
                    pixels = dims[0] * dims[1] * dims[2]
                    check(decode.get("decodedPixels") == pixels and pixels <= limits["maxDecodePixels"], "raster pixel bound differs")
                    counts["rasterDecoded"] += 1
                    extension_scopes[extension]["rasterDecoded"] += 1
                else:
                    closed_fields(decode, ["status", "format", "scope"], "integrity-only decode")
                    expected_scope = "integrity-only-no-raster-decode" if limits["decode"] == "raster" else "integrity-only; decoding disabled explicitly"
                    check(decode.get("status") == "NOT_APPLICABLE" and decode.get("scope") == expected_scope, "integrity-only decode scope differs")
                    counts["integrityOnly"] += 1
                    extension_scopes[extension]["integrityOnly"] += 1
                counts["passedAssets"] += 1
                counts["verifiedPayloadBytes"] += actual["bytes"]
                source_kinds[actual["sourceKind"]] += 1
            check((receipt["status"] == "PASSED") == batch_passed, "batch status differs from its per-asset statuses")
            counts["passedBatches" if batch_passed else "unavailableBatches"] += 1
            receipts_manifest.append({"file": file.name, "rawFileSha256": sha256(raw), "canonicalBodySha256": receipt["sha256"], "batchId": batch_id})
        pending = sorted(set(batches) - seen)
        complete = not pending
        summary_file = run / ("final-summary.json" if (run / "final-summary.json").exists() else "run-summary.json")
        summary = load_bytes(regular_bytes(summary_file)) if summary_file.exists() else None
        comparisons = {}
        if summary:
            check(summary.get("sourceRevision") == revision and summary.get("planSha256") == plan["sha256"]
                  and summary.get("runnerSha256") == runner["implementationSha256"] and summary.get("batches") == len(batches), "run summary identity differs")
            check(not any(summary.get(key) is True for key in ("ready", "productionReady", "source1to1Verified", "authenticSignatureVerified")), "run summary makes an unsupported approval claim")
            for key in ("passedBatches", "unavailableBatches", "passedAssets", "unavailableAssets", "rasterDecoded", "integrityOnly", "verifiedPayloadBytes"):
                comparisons[key] = {"receiptSnapshot": counts[key], "runSummary": summary.get(key), "equal": counts[key] == summary.get(key)}
            comparisons["pendingBatches"] = {"receiptSnapshot": len(pending), "runSummary": summary.get("pendingBatches"), "equal": len(pending) == summary.get("pendingBatches")}
            if complete:
                check(all(item["equal"] for item in comparisons.values()), "completed run summary differs from receipts")
                check(summary.get("finishedBatches", summary.get("batches")) == len(receipt_files) and summary.get("sourceKinds") == dict(source_kinds)
                      and summary.get("unavailableCodes") == dict(codes), "completed summary source-kind/code totals differ")
        retry = {"summaryFile": summary_file.name, "archivedFailureBatches": 0, "preservedSuccessfulAssets": 0, "recoveredAssets": 0}
        if summary_file.name == "final-summary.json":
            old_receipts = dict(receipt_data)
            for file in sorted((run / "first-pass-failures").glob("batch-*.json")):
                old = load_bytes(regular_bytes(file))
                check_seal(old, "archived " + file.name)
                batch_id = old.get("batchId")
                check(batch_id in receipt_data and file.name == "batch-" + batch_id + ".json" and old["status"] == "UNAVAILABLE", "invalid retry archive identity/status")
                current = receipt_data[batch_id]
                for key in ("schemaVersion", "kind", "scope", "planSha256", "batchSha256", "sourceRevision", "runnerSha256", "profile", "layout"):
                    check(old.get(key) == current.get(key), "archived/current receipt identity differs")
                check(len(old["assets"]) == len(current["assets"]), "retry archive asset count differs")
                for previous, actual in zip(old["assets"], current["assets"]):
                    check(all(previous.get(key) == actual.get(key) for key in ("sourcePath", "publicPath", "gitBlobOid", "expectedBytes")), "retry changed canonical asset identity")
                    if previous["status"] == "PASSED":
                        check(canonical(previous) == canonical(actual), "retry changed an already passed asset")
                        retry["preservedSuccessfulAssets"] += 1
                    else:
                        check(previous["status"] == "UNAVAILABLE" and re.fullmatch(r"[A-Z0-9_]+", previous.get("code", "")), "invalid archived unavailable status")
                        retry["recoveredAssets"] += actual["status"] == "PASSED"
                old_receipts[batch_id] = old
                retry["archivedFailureBatches"] += 1
            check(retry["archivedFailureBatches"] > 0, "retry summary has no preserved failure archive")
            first = load_bytes(regular_bytes(run / "run-summary.json"))
            check(first["sourceRevision"] == revision and first["planSha256"] == plan["sha256"] and first["runnerSha256"] == runner["implementationSha256"], "first-pass identity differs")
            first_assets = [asset for receipt in old_receipts.values() for asset in receipt["assets"]]
            passed = [asset for asset in first_assets if asset["status"] == "PASSED"]
            old_kinds = collections.Counter(asset["sourceKind"] for asset in passed)
            old_codes = collections.Counter(asset["code"] for asset in first_assets if asset["status"] == "UNAVAILABLE")
            first_counts = {"finishedBatches": len(old_receipts), "passedBatches": sum(receipt["status"] == "PASSED" for receipt in old_receipts.values()),
                            "unavailableBatches": sum(receipt["status"] == "UNAVAILABLE" for receipt in old_receipts.values()), "pendingBatches": len(batches) - len(old_receipts),
                            "passedAssets": len(passed), "unavailableAssets": len(first_assets) - len(passed),
                            "verifiedPayloadBytes": sum(asset["bytes"] for asset in passed),
                            "rasterDecoded": sum(asset["decode"]["status"] == "PASSED" for asset in passed),
                            "integrityOnly": sum(asset["decode"]["status"] == "NOT_APPLICABLE" for asset in passed)}
            check(all(first.get(key) == value for key, value in first_counts.items()), "preserved first-pass summary differs from archived/current receipts")
            check(first.get("sourceKinds") == dict(old_kinds) and first.get("unavailableCodes") == dict(old_codes), "preserved first-pass source-kind/code counts differ")
            retry["firstPassReconstructionMatches"] = True
            retry["firstPassCounts"] = first_counts
        check(not args.require_complete or complete, "receipt corpus is still incomplete")
        status = "PARTIAL_STRUCTURAL_CHECKS_PASSED"
        if complete:
            status = "COMPLETE_WITH_UNAVAILABLE" if counts["unavailableAssets"] else "COMPLETE_RECEIPT_BINDINGS_VERIFIED"
        return {"schemaVersion": 1, "dateUtc": datetime.datetime.now(datetime.timezone.utc).isoformat(), "status": status,
                "scope": "Independent frozen-Git metadata and receipt coherence audit; no second image decode, production build/deployment or artwork/source-1:1 certification.",
                "authentication": "Unsigned SHA-256 integrity/coherence checks. No signing key or authenticity signature was used.",
                "auditScriptSha256": sha256(Path(__file__).read_bytes()), "sourceRevision": revision, "planSha256": plan["sha256"],
                "runnerImplementationSha256": runner["implementationSha256"], "runnerGitHead": head,
                "frozenInventoryFilesVerified": len(inventory), "frozenManifestPacks": len(manifests),
                "plannedBatches": len(batches), "plannedAssets": len(assets), "plannedPayloadBytes": plan["payloadBytes"],
                "canonicalLfsPointersVerified": pointer_count, "canonicalNativeUniqueBlobs": len(raw_unique),
                "nativeGitPayloadStreamPerformed": args.hash_raw_git,
                "nativeGitPayloadBytesStreamed": sum(raw_unique.values()) if args.hash_raw_git else 0,
                "passedNativeSha256NotIndependentlyReread": native_passed_unchecked,
                "counts": dict(counts), "pendingBatches": len(pending), "pendingBatchIds": pending,
                "sourceKinds": dict(source_kinds), "extensionScopes": {key: dict(value) for key, value in sorted(extension_scopes.items())},
                "unavailableCodes": dict(codes), "unavailableAssets": unavailable,
                "runSummaryComparison": comparisons, "summarySamplingNote": "Exact equality required only after all receipt files are present; a running producer can advance between partial samples.",
                "retryEvidence": retry,
                "receiptSnapshotSha256": sha256(canonical(receipts_manifest)), "receiptFiles": receipts_manifest,
                "limits": {"mediaPersistedByAudit": False, "lfsDownloadedByAudit": False, "imagesDecodedAgain": False, "nativeStreamBufferBytes": BUFFER}}
    finally:
        blobs.close()


def self_test():
    sample = {"b": [1, {"é": "value", "a": True}], "a": "Nexus"}
    sealed = {**sample, "sha256": sha256(canonical(sample))}
    check_seal(sealed, "fixture")
    sealed["a"] = "changed"
    try:
        check_seal(sealed, "fixture")
        raise AssertionError("tampered fixture accepted")
    except ValueError:
        pass
    try:
        closed_fields({"status": "PASSED", "source1to1Verified": True}, ["status"], "fixture")
        raise AssertionError("unsupported artistic approval accepted")
    except ValueError:
        pass
    parsed = pointer(b"version https://git-lfs.github.com/spec/v1\noid sha256:" + b"a" * 64 + b"\nsize 42\n")
    check(parsed == {"sha256": "a" * 64, "bytes": 42}, "pointer fixture differs")
    with tempfile.TemporaryDirectory(prefix="dlc-audit-selftest-") as directory:
        repo = Path(directory)
        git(repo, ["init", "-q"])
        payload = b"canonical fixture, not a product fallback\n" * 1024
        created = subprocess.run(["git", "-C", str(repo), "hash-object", "-w", "--stdin"], input=payload,
                                 check=True, stdout=subprocess.PIPE, env=git_env()).stdout.decode().strip()
        reader = GitBlobs(repo)
        try:
            result, _body = reader.read(created)
            check(result["sha256"] == sha256(payload) and result["bytes"] == len(payload), "independent native stream fixture failed")
        finally:
            reader.close()
    print("Self-test passed: canonical seal/tamper, LFS pointer and independent native Git stream.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--run-dir", type=Path)
    parser.add_argument("--out", type=Path, default=HERE / "partial-audit.json")
    parser.add_argument("--require-complete", action="store_true")
    parser.add_argument("--hash-raw-git", action="store_true")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    parser.error("--run-dir is required") if args.run_dir is None else None
    check(args.out.resolve().parent == HERE, "audit output must stay in its owned receipt-audit directory")
    try:
        result = main_audit(args)
    except Exception as error:
        result = {"schemaVersion": 1, "status": "AUDIT_FAILED", "errorType": type(error).__name__, "error": str(error),
                  "scope": "No receipt, plan, runner or media was modified."}
        args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
        print(json.dumps(result, ensure_ascii=False))
        raise SystemExit(1)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({key: result[key] for key in ("status", "plannedAssets", "pendingBatches", "counts", "nativeGitPayloadStreamPerformed")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
