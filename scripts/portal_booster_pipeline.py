#!/usr/bin/env python3
"""Concurrency-safe staging pipeline for OpenAI-generated portal boosters.

The image generation itself deliberately remains one built-in image_gen call per
job. This helper coordinates agents, validates generated PNGs, publishes WebP
assets atomically, journals outcomes, and emits one deterministic catalogue
manifest for the final single-writer merge.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import time
import uuid
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

try:
    from PIL import Image, ImageOps
except ImportError as error:  # pragma: no cover - dependency error is actionable
    raise SystemExit(
        "Pillow is required. Install it in the active Python environment before "
        "running scripts/portal_booster_pipeline.py."
    ) from error


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_WORK_DIR = PROJECT_ROOT / "tmp" / "booster-generation"
TARGET_WIDTH = 640
TARGET_HEIGHT = 960
TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT
RATIO_TOLERANCE = 0.02
MINIMUM_BYTES = 50_000
MAXIMUM_BYTES = 800_000
AGENT_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$")
SLUG_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]{0,95}$")


def utc_now() -> str:
    return datetime.now(UTC).isoformat().replace("+00:00", "Z")


def sha256_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def atomic_json_write(file_path: Path, value: Any) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = file_path.with_name(
        f".{file_path.name}.tmp-{os.getpid()}-{uuid.uuid4().hex}"
    )
    temporary_path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    os.replace(temporary_path, file_path)


def atomic_text_write(file_path: Path, value: str) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = file_path.with_name(
        f".{file_path.name}.tmp-{os.getpid()}-{uuid.uuid4().hex}"
    )
    temporary_path.write_text(value, encoding="utf-8")
    os.replace(temporary_path, file_path)


def read_json(file_path: Path) -> Any:
    return json.loads(file_path.read_text(encoding="utf-8"))


class Pipeline:
    def __init__(self, project_root: Path, work_dir: Path) -> None:
        self.project_root = project_root.resolve()
        self.work_dir = work_dir.resolve()
        self.public_dir = (self.project_root / "public").resolve()
        self.jobs_dir = self.work_dir / "jobs"
        self.claims_dir = self.work_dir / "claims"
        self.results_dir = self.work_dir / "results"
        self.events_dir = self.work_dir / "events"
        self.ready_dir = self.work_dir / "ready"
        self.sources_dir = self.work_dir / "sources"

    def make_directories(self) -> None:
        for directory in (
            self.jobs_dir,
            self.claims_dir,
            self.results_dir,
            self.events_dir,
            self.ready_dir,
            self.sources_dir,
        ):
            directory.mkdir(parents=True, exist_ok=True)

    def job_path(self, slug: str) -> Path:
        validate_slug(slug)
        return self.jobs_dir / f"{slug}.json"

    def claim_path(self, slug: str) -> Path:
        validate_slug(slug)
        return self.claims_dir / f"{slug}.json"

    def result_path(self, slug: str) -> Path:
        validate_slug(slug)
        return self.results_dir / f"{slug}.json"

    def asset_path(self, job: dict[str, Any]) -> Path:
        public_path = job.get("output")
        if not isinstance(public_path, str) or not public_path.startswith("/boosters/"):
            raise ValueError(f"{job.get('slug')}: output must start with /boosters/")
        if not public_path.endswith(".webp") or ".." in public_path:
            raise ValueError(f"{job.get('slug')}: output must be one safe WebP path")
        local_path = (self.public_dir / public_path.lstrip("/")).resolve()
        if os.path.commonpath((str(self.public_dir), str(local_path))) != str(
            self.public_dir
        ):
            raise ValueError(f"{job.get('slug')}: output escapes public/")
        return local_path

    def load_jobs(self) -> list[dict[str, Any]]:
        if not self.jobs_dir.exists():
            return []
        jobs = [read_json(path) for path in sorted(self.jobs_dir.glob("*.json"))]
        return sorted(jobs, key=lambda job: (job["universe"].casefold(), job["slug"]))

    def load_job(self, slug: str) -> dict[str, Any]:
        job_path = self.job_path(slug)
        if not job_path.is_file():
            raise ValueError(f"Unknown job slug: {slug}")
        return read_json(job_path)

    def write_event(
        self,
        kind: str,
        *,
        slug: str,
        agent: str | None,
        detail: dict[str, Any] | None = None,
    ) -> Path:
        event = {
            "schemaVersion": 1,
            "at": utc_now(),
            "kind": kind,
            "slug": slug,
            "agent": agent,
            "detail": detail or {},
        }
        event_path = self.events_dir / (
            f"{time.time_ns()}-{slug}-{kind}-{uuid.uuid4().hex[:8]}.json"
        )
        atomic_json_write(event_path, event)
        return event_path

    def validate_claim_owner(self, slug: str, agent: str) -> dict[str, Any]:
        claim_path = self.claim_path(slug)
        if not claim_path.is_file():
            raise ValueError(f"{slug}: no active claim")
        claim = read_json(claim_path)
        if claim.get("agent") != agent:
            raise ValueError(
                f"{slug}: claimed by {claim.get('agent')!r}, not {agent!r}"
            )
        return claim

    def result_is_complete(self, job: dict[str, Any]) -> tuple[bool, str | None]:
        result_path = self.result_path(job["slug"])
        if not result_path.is_file():
            return False, None
        result = read_json(result_path)
        if result.get("status") != "success":
            return False, "result status is not success"
        try:
            details = validate_webp(self.asset_path(job))
        except (OSError, ValueError) as error:
            return False, str(error)
        expected_hash = result.get("outputSha256")
        if expected_hash and details["sha256"] != expected_hash:
            return False, "published asset hash differs from successful result"
        return True, None

    def initialize(self, plan_path: Path, update_jobs: bool) -> dict[str, int]:
        self.make_directories()
        plan = read_json(plan_path)
        if plan.get("schemaVersion") != 1 or not isinstance(plan.get("jobs"), list):
            raise ValueError("Plan must use schemaVersion 1 and contain a jobs array")

        created = 0
        unchanged = 0
        updated = 0
        seen_slugs: set[str] = set()
        seen_universes: set[str] = set()
        seen_outputs: set[str] = set()

        for raw_job in plan["jobs"]:
            job = normalize_job(raw_job)
            slug = job["slug"]
            if slug in seen_slugs:
                raise ValueError(f"Duplicate plan slug: {slug}")
            if job["universe"] in seen_universes:
                raise ValueError(f"Duplicate plan universe: {job['universe']}")
            if job["output"] in seen_outputs:
                raise ValueError(f"Duplicate plan output: {job['output']}")
            seen_slugs.add(slug)
            seen_universes.add(job["universe"])
            seen_outputs.add(job["output"])
            self.asset_path(job)

            job_path = self.job_path(slug)
            if not job_path.exists():
                atomic_json_write(job_path, job)
                created += 1
                continue

            current_job = read_json(job_path)
            if current_job == job:
                unchanged += 1
                continue
            complete, _ = self.result_is_complete(current_job)
            if complete:
                raise ValueError(
                    f"{slug}: refusing to mutate a job with a successful result"
                )
            if not update_jobs:
                raise ValueError(
                    f"{slug}: job changed; rerun init with --update-jobs after review"
                )
            atomic_json_write(job_path, job)
            updated += 1

        snapshot = {
            **plan,
            "initializedAt": utc_now(),
            "sourcePlan": str(plan_path.resolve()),
        }
        atomic_json_write(self.work_dir / "initialized-plan.json", snapshot)
        return {"created": created, "unchanged": unchanged, "updated": updated}

    def claim(self, agent: str, limit: int) -> list[dict[str, Any]]:
        validate_agent(agent)
        self.make_directories()
        claimed: list[dict[str, Any]] = []
        for job in self.load_jobs():
            if len(claimed) >= limit:
                break
            complete, _ = self.result_is_complete(job)
            if complete or self.claim_path(job["slug"]).exists():
                continue

            claim = {
                "schemaVersion": 1,
                "slug": job["slug"],
                "universe": job["universe"],
                "agent": agent,
                "claimedAt": utc_now(),
                "claimedAtEpoch": time.time(),
                "pid": os.getpid(),
            }
            claim_path = self.claim_path(job["slug"])
            try:
                with claim_path.open("x", encoding="utf-8") as claim_file:
                    json.dump(claim, claim_file, ensure_ascii=False, indent=2)
                    claim_file.write("\n")
                    claim_file.flush()
                    os.fsync(claim_file.fileno())
            except FileExistsError:
                continue

            self.write_event("claimed", slug=job["slug"], agent=agent)
            claimed.append(job)
        return claimed

    def fail(self, slug: str, agent: str, message: str) -> None:
        validate_agent(agent)
        self.validate_claim_owner(slug, agent)
        self.write_event(
            "failed",
            slug=slug,
            agent=agent,
            detail={"message": message[:2000]},
        )
        self.claim_path(slug).unlink()

    def reclaim_stale(self, older_than_hours: float) -> list[dict[str, Any]]:
        cutoff_seconds = older_than_hours * 60 * 60
        reclaimed = []
        for claim_path in sorted(self.claims_dir.glob("*.json")):
            claim = read_json(claim_path)
            age_seconds = max(0.0, time.time() - float(claim["claimedAtEpoch"]))
            if age_seconds < cutoff_seconds:
                continue
            archive_path = self.events_dir / (
                f"{time.time_ns()}-{claim['slug']}-stale-claim-{uuid.uuid4().hex[:8]}.json"
            )
            stale_event = {
                "schemaVersion": 1,
                "at": utc_now(),
                "kind": "stale-claim-reclaimed",
                "slug": claim["slug"],
                "agent": claim.get("agent"),
                "detail": {"ageSeconds": round(age_seconds, 3), "claim": claim},
            }
            atomic_json_write(archive_path, stale_event)
            try:
                claim_path.unlink()
            except FileNotFoundError:
                continue
            reclaimed.append(stale_event)
        return reclaimed

    def ingest(
        self,
        *,
        slug: str,
        agent: str,
        source_path: Path,
        keep_source: bool,
        adopt_existing: bool,
    ) -> dict[str, Any]:
        validate_agent(agent)
        self.make_directories()
        job = self.load_job(slug)
        self.validate_claim_owner(slug, agent)

        complete, result_error = self.result_is_complete(job)
        if complete:
            return read_json(self.result_path(slug))
        if result_error:
            raise ValueError(f"{slug}: invalid prior result: {result_error}")

        output_path = self.asset_path(job)
        if output_path.exists():
            if not adopt_existing:
                raise ValueError(
                    f"{slug}: output already exists without a valid result; inspect it "
                    "then rerun with --adopt-existing or move it aside"
                )
            output_details = validate_webp(output_path)
            result = self._publish_result(
                job=job,
                agent=agent,
                source_path=None,
                source_details=None,
                output_details=output_details,
                adopted=True,
            )
            return result

        source_path = source_path.resolve()
        if not source_path.is_file():
            raise ValueError(f"{slug}: source image does not exist: {source_path}")

        source_details = validate_source_png(source_path)
        if keep_source:
            archived_source = self.sources_dir / f"{slug}.png"
            temporary_source = archived_source.with_name(
                f".{archived_source.name}.tmp-{uuid.uuid4().hex}"
            )
            shutil.copyfile(source_path, temporary_source)
            os.replace(temporary_source, archived_source)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        staged_path = self.ready_dir / f"{slug}-{uuid.uuid4().hex}.webp"
        with Image.open(source_path) as source_image:
            image = ImageOps.exif_transpose(source_image).convert("RGB")
            resized = image.resize(
                (TARGET_WIDTH, TARGET_HEIGHT),
                resample=Image.Resampling.LANCZOS,
            )
            resized.save(
                staged_path,
                format="WEBP",
                quality=88,
                method=6,
                optimize=True,
            )

        output_details = validate_webp(staged_path)
        os.replace(staged_path, output_path)
        published_details = validate_webp(output_path)
        if published_details != output_details:
            raise ValueError(f"{slug}: asset changed during atomic publication")

        return self._publish_result(
            job=job,
            agent=agent,
            source_path=source_path,
            source_details=source_details,
            output_details=published_details,
            adopted=False,
        )

    def _publish_result(
        self,
        *,
        job: dict[str, Any],
        agent: str,
        source_path: Path | None,
        source_details: dict[str, Any] | None,
        output_details: dict[str, Any],
        adopted: bool,
    ) -> dict[str, Any]:
        result = {
            "schemaVersion": 1,
            "status": "success",
            "completedAt": utc_now(),
            "slug": job["slug"],
            "universe": job["universe"],
            "agent": agent,
            "output": job["output"],
            "outputSha256": output_details["sha256"],
            "outputBytes": output_details["bytes"],
            "width": output_details["width"],
            "height": output_details["height"],
            "format": output_details["format"],
            "quality": 88,
            "adopted": adopted,
            "source": str(source_path) if source_path else None,
            "sourceDetails": source_details,
        }
        atomic_json_write(self.result_path(job["slug"]), result)
        self.write_event(
            "adopted" if adopted else "succeeded",
            slug=job["slug"],
            agent=agent,
            detail={
                "output": job["output"],
                "sha256": output_details["sha256"],
                "bytes": output_details["bytes"],
            },
        )
        self.claim_path(job["slug"]).unlink(missing_ok=True)
        return result

    def status(self) -> dict[str, Any]:
        jobs = self.load_jobs()
        event_counts: dict[str, int] = {}
        for event_path in self.events_dir.glob("*.json"):
            kind = read_json(event_path).get("kind", "unknown")
            event_counts[kind] = event_counts.get(kind, 0) + 1

        complete = []
        claimed = []
        pending = []
        invalid = []
        for job in jobs:
            is_complete, result_error = self.result_is_complete(job)
            if is_complete:
                complete.append(job["slug"])
            elif result_error:
                invalid.append({"slug": job["slug"], "error": result_error})
            elif self.claim_path(job["slug"]).exists():
                claim = read_json(self.claim_path(job["slug"]))
                claimed.append(
                    {
                        "slug": job["slug"],
                        "agent": claim.get("agent"),
                        "claimedAt": claim.get("claimedAt"),
                    }
                )
            else:
                pending.append(job["slug"])

        report = {
            "schemaVersion": 1,
            "generatedAt": utc_now(),
            "total": len(jobs),
            "counts": {
                "complete": len(complete),
                "claimed": len(claimed),
                "pending": len(pending),
                "invalid": len(invalid),
            },
            "complete": complete,
            "claimed": claimed,
            "pending": pending,
            "invalid": invalid,
            "events": dict(sorted(event_counts.items())),
        }
        atomic_json_write(self.work_dir / "status.json", report)
        return report

    def export_catalog(self, allow_partial: bool) -> dict[str, Any]:
        report = self.status()
        incomplete = (
            report["counts"]["pending"]
            + report["counts"]["claimed"]
            + report["counts"]["invalid"]
        )
        if incomplete and not allow_partial:
            raise ValueError(
                f"Refusing partial catalogue export: {incomplete} jobs incomplete"
            )

        entries = []
        for job in self.load_jobs():
            complete, _ = self.result_is_complete(job)
            if not complete:
                continue
            result = read_json(self.result_path(job["slug"]))
            entries.append(
                {
                    "universe": job["universe"],
                    "output": job["output"],
                    "sha256": result["outputSha256"],
                    "bytes": result["outputBytes"],
                    "width": result["width"],
                    "height": result["height"],
                    "agent": result["agent"],
                }
            )
        entries.sort(key=lambda entry: (entry["universe"].casefold(), entry["universe"]))

        manifest = {
            "schemaVersion": 1,
            "generatedAt": utc_now(),
            "complete": incomplete == 0,
            "totalJobs": report["total"],
            "entries": entries,
        }
        manifest_path = self.work_dir / "catalog.generated.entries.json"
        atomic_json_write(manifest_path, manifest)
        fragment = "".join(
            f"  {json.dumps(entry['universe'], ensure_ascii=False)}: "
            f"{json.dumps(entry['output'], ensure_ascii=False)},\n"
            for entry in entries
        )
        atomic_text_write(
            self.work_dir / "catalog.generated.entries.txt",
            fragment,
        )
        return manifest


def validate_agent(agent: str) -> None:
    if not AGENT_PATTERN.fullmatch(agent):
        raise ValueError(
            "Agent must be 1-64 characters using letters, digits, dot, dash or underscore"
        )


def validate_slug(slug: str) -> None:
    if not SLUG_PATTERN.fullmatch(slug):
        raise ValueError(f"Unsafe job slug: {slug!r}")


def normalize_job(raw_job: Any) -> dict[str, Any]:
    if not isinstance(raw_job, dict):
        raise ValueError("Every plan job must be an object")
    slug = raw_job.get("slug") or raw_job.get("id")
    validate_slug(slug)
    universe = raw_job.get("universe")
    prompt = raw_job.get("prompt")
    output = raw_job.get("output")
    if not isinstance(universe, str) or not universe.strip():
        raise ValueError(f"{slug}: universe is required")
    if not isinstance(prompt, str) or len(prompt.strip()) < 100:
        raise ValueError(f"{slug}: a detailed generation prompt is required")
    if not isinstance(output, str):
        raise ValueError(f"{slug}: output is required")
    return {
        "schemaVersion": 1,
        "id": slug,
        "slug": slug,
        "universe": universe.strip(),
        "output": output,
        "ratio": "2:3",
        "target": {
            "width": TARGET_WIDTH,
            "height": TARGET_HEIGHT,
            "format": "webp",
            "quality": 88,
        },
        "prompt": prompt.strip(),
        "source": raw_job.get("source") or {},
    }


def validate_source_png(file_path: Path) -> dict[str, Any]:
    with Image.open(file_path) as image:
        image.verify()
    with Image.open(file_path) as image:
        width, height = image.size
        image_format = (image.format or "").upper()
    if image_format != "PNG":
        raise ValueError(f"source must be PNG, got {image_format or 'unknown'}")
    if width < TARGET_WIDTH or height < TARGET_HEIGHT:
        raise ValueError(
            f"source is too small ({width}x{height}); require at least "
            f"{TARGET_WIDTH}x{TARGET_HEIGHT}"
        )
    ratio = width / height
    if abs(ratio - TARGET_RATIO) > RATIO_TOLERANCE:
        raise ValueError(
            f"source ratio is {ratio:.4f}; require 2:3 within {RATIO_TOLERANCE}"
        )
    return {
        "format": image_format,
        "width": width,
        "height": height,
        "ratio": ratio,
        "bytes": file_path.stat().st_size,
        "sha256": sha256_file(file_path),
    }


def validate_webp(file_path: Path) -> dict[str, Any]:
    if not file_path.is_file():
        raise ValueError(f"missing WebP: {file_path}")
    file_size = file_path.stat().st_size
    if not MINIMUM_BYTES <= file_size <= MAXIMUM_BYTES:
        raise ValueError(
            f"WebP size {file_size} outside {MINIMUM_BYTES}..{MAXIMUM_BYTES} bytes"
        )
    with Image.open(file_path) as image:
        image.load()
        width, height = image.size
        image_format = (image.format or "").upper()
    if image_format != "WEBP":
        raise ValueError(f"expected WEBP, got {image_format or 'unknown'}")
    if (width, height) != (TARGET_WIDTH, TARGET_HEIGHT):
        raise ValueError(
            f"expected {TARGET_WIDTH}x{TARGET_HEIGHT}, got {width}x{height}"
        )
    return {
        "format": image_format,
        "width": width,
        "height": height,
        "bytes": file_size,
        "sha256": sha256_file(file_path),
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Resume-safe multi-agent portal booster pipeline"
    )
    parser.add_argument(
        "--project-root",
        type=Path,
        default=PROJECT_ROOT,
        help="Project root (defaults to the repository root)",
    )
    parser.add_argument(
        "--work-dir",
        type=Path,
        default=DEFAULT_WORK_DIR,
        help="Pipeline state directory",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init", help="Initialize immutable jobs")
    init_parser.add_argument(
        "--plan", type=Path, default=DEFAULT_WORK_DIR / "plan.json"
    )
    init_parser.add_argument("--update-jobs", action="store_true")

    claim_parser = subparsers.add_parser("claim", help="Atomically claim pending jobs")
    claim_parser.add_argument("--agent", required=True)
    claim_parser.add_argument("--limit", type=int, default=1)

    ingest_parser = subparsers.add_parser(
        "ingest", help="Validate one generated PNG and publish its WebP"
    )
    ingest_parser.add_argument("--agent", required=True)
    ingest_parser.add_argument("--slug", required=True)
    ingest_parser.add_argument("--source", type=Path, required=True)
    ingest_parser.add_argument("--keep-source", action="store_true")
    ingest_parser.add_argument("--adopt-existing", action="store_true")

    fail_parser = subparsers.add_parser(
        "fail", help="Journal an image_gen failure and release the claim"
    )
    fail_parser.add_argument("--agent", required=True)
    fail_parser.add_argument("--slug", required=True)
    fail_parser.add_argument("--message", required=True)

    stale_parser = subparsers.add_parser(
        "reclaim-stale", help="Explicitly release abandoned claims"
    )
    stale_parser.add_argument("--older-than-hours", type=float, default=4.0)

    subparsers.add_parser("status", help="Validate all results and print status")

    export_parser = subparsers.add_parser(
        "export-catalog", help="Emit one deterministic single-writer merge manifest"
    )
    export_parser.add_argument("--allow-partial", action="store_true")
    return parser


def main() -> None:
    parser = build_parser()
    arguments = parser.parse_args()
    pipeline = Pipeline(arguments.project_root, arguments.work_dir)

    if arguments.command == "init":
        result = pipeline.initialize(arguments.plan.resolve(), arguments.update_jobs)
    elif arguments.command == "claim":
        if arguments.limit < 1 or arguments.limit > 100:
            parser.error("--limit must be between 1 and 100")
        result = {
            "agent": arguments.agent,
            "jobs": pipeline.claim(arguments.agent, arguments.limit),
        }
    elif arguments.command == "ingest":
        result = pipeline.ingest(
            slug=arguments.slug,
            agent=arguments.agent,
            source_path=arguments.source,
            keep_source=arguments.keep_source,
            adopt_existing=arguments.adopt_existing,
        )
    elif arguments.command == "fail":
        pipeline.fail(arguments.slug, arguments.agent, arguments.message)
        result = {"released": arguments.slug, "status": "failed"}
    elif arguments.command == "reclaim-stale":
        if arguments.older_than_hours <= 0:
            parser.error("--older-than-hours must be positive")
        reclaimed = pipeline.reclaim_stale(arguments.older_than_hours)
        result = {"reclaimed": len(reclaimed), "events": reclaimed}
    elif arguments.command == "status":
        result = pipeline.status()
    elif arguments.command == "export-catalog":
        result = pipeline.export_catalog(arguments.allow_partial)
    else:  # pragma: no cover
        parser.error(f"Unhandled command: {arguments.command}")
        return

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        print(f"portal booster pipeline: {error}", file=sys.stderr)
        raise SystemExit(1) from error
