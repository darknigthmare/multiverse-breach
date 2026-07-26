#!/usr/bin/env python3
"""Isolated smoke tests for the resume-safe booster pipeline."""

from __future__ import annotations

import importlib.util
import json
import random
import tempfile
import unittest
from pathlib import Path

from PIL import Image


MODULE_PATH = Path(__file__).with_name("portal_booster_pipeline.py")
SPEC = importlib.util.spec_from_file_location("portal_booster_pipeline", MODULE_PATH)
assert SPEC and SPEC.loader
PIPELINE_MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PIPELINE_MODULE)


class PortalBoosterPipelineTest(unittest.TestCase):
    def test_claim_failure_retry_ingest_resume_and_export(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            project_root = Path(temporary_directory)
            (project_root / "public").mkdir()
            work_dir = project_root / "tmp" / "booster-generation"
            plan_path = work_dir / "plan.json"
            work_dir.mkdir(parents=True)
            plan_path.write_text(
                json.dumps(
                    {
                        "schemaVersion": 1,
                        "jobs": [
                            {
                                "slug": "test-universe",
                                "universe": "Test Universe",
                                "output": "/boosters/test-universe.webp",
                                "prompt": (
                                    "Use case: product-mockup\n"
                                    "Asset type: portal booster\n"
                                    "Primary request: one complete vertical packet.\n"
                                    "Composition: exact 2:3 portrait, wrapper fully visible.\n"
                                    "Constraints: one packet, no collage, no watermark."
                                ),
                            }
                        ],
                    }
                ),
                encoding="utf-8",
            )

            pipeline = PIPELINE_MODULE.Pipeline(project_root, work_dir)
            self.assertEqual(
                pipeline.initialize(plan_path, update_jobs=False)["created"], 1
            )
            first_claim = pipeline.claim("agent-a", 1)
            self.assertEqual([job["slug"] for job in first_claim], ["test-universe"])
            self.assertEqual(pipeline.claim("agent-b", 1), [])

            pipeline.fail("test-universe", "agent-a", "visual review rejected")
            second_claim = pipeline.claim("agent-b", 1)
            self.assertEqual([job["slug"] for job in second_claim], ["test-universe"])

            random_bytes = random.Random(42).randbytes(800 * 1200 * 3)
            source_path = project_root / "generated.png"
            Image.frombytes("RGB", (800, 1200), random_bytes).save(
                source_path, format="PNG"
            )
            result = pipeline.ingest(
                slug="test-universe",
                agent="agent-b",
                source_path=source_path,
                keep_source=False,
                adopt_existing=False,
            )
            self.assertEqual(result["status"], "success")
            self.assertEqual((result["width"], result["height"]), (640, 960))
            self.assertEqual(result["quality"], 88)
            self.assertEqual(pipeline.claim("agent-c", 1), [])

            status = pipeline.status()
            self.assertEqual(
                status["counts"],
                {"complete": 1, "claimed": 0, "pending": 0, "invalid": 0},
            )
            export = pipeline.export_catalog(allow_partial=False)
            self.assertTrue(export["complete"])
            self.assertEqual(
                export["entries"][0]["output"],
                "/boosters/test-universe.webp",
            )


if __name__ == "__main__":
    unittest.main()
