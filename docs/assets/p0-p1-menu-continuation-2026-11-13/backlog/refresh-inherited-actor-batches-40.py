"""Refresh source fields in the inherited queue; never rank or close dossiers."""
import copy
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
BASE = ROOT / "docs/assets/p0-p1-continuation-2026-11-13/backlog"
RASTER = ROOT / "docs/assets/p0-p1-continuation-2026-11-13/raster-lot-002"
INPUTS = {
    "inheritedQueue": BASE / "actor-batches-40.json",
    "inheritedAudit": BASE / "audit.json",
    "currentActors": OUT / "actors.json",
    "currentSummary": OUT / "summary.json",
    "metadataCohort": ROOT / "scripts/fixtures/actorLockedContinuity20261113.json",
    "rasterCohort": RASTER / "baseline-audit.json",
    "rasterDelivery": RASTER / "delivery.json",
    "jackHistoricalRefusal": ROOT / "docs/cg/reviews/wave3-2026-10-20/jack-sparrow-generation-attempts.json",
    "jackHistoricalPrompt": ROOT / "docs/cg/prompts/wave3-2026-10-20/jack-sparrow/01-characterSolo.txt",
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dump(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def flatten(queue):
    return [actor for batch in queue["batches"] for actor in batch["actors"]]


def make_reports():
    hashes = {name: sha(path) for name, path in INPUTS.items()}
    data = {name: json.loads(path.read_text()) for name, path in INPUTS.items() if path.suffix == ".json"}
    inherited = data["inheritedQueue"]
    old_rows = flatten(inherited)
    old_keys = [row["actorKey"] for row in old_rows]
    current = data["currentActors"]
    by_key = {row["actorKey"]: row for row in current}
    p1_keys = {row["actorKey"] for row in current
               if any(task["priority"] == "P1" for task in row["tasks"])}
    source_commit = data["currentSummary"]["sourceBaseCommit"]
    assert len(by_key) == len(current) == 4937, "Current identities changed"
    assert len(old_keys) == len(set(old_keys)) == 4935, "Inherited identities collided"
    assert set(old_keys) == p1_keys, "P1 membership changed; manual queue review required"
    assert all(row["sourceCommit"] == source_commit for row in current)

    queue = copy.deepcopy(inherited)
    changed_fields = Counter()
    changed_keys = []
    batch_for = {}
    for batch in queue["batches"]:
        assert batch["batchSize"] == len(batch["actors"])
        for actor in batch["actors"]:
            key = actor["actorKey"]
            row = by_key[key]
            assert (actor["actorId"], actor["name"], actor["universe"], actor["kind"], actor["sourceScope"]) == (
                row["actorId"], row["actorName"], row["universe"], row["kind"], row["sourceScope"]), key
            assert actor["missingRasterPaths"] == row["missingRasterPaths"], key
            assert actor["staticGameplayPaths"] == row["staticGameplayPaths"], key
            updates = {
                "openP1Codes": [task["code"] for task in row["tasks"] if task["priority"] == "P1"],
                "incarnation": row["incarnation"],
                "reference": row["declaredReference"],
            }
            if any(actor[field] != value for field, value in updates.items()):
                changed_keys.append(key)
            for field, value in updates.items():
                if actor[field] != value:
                    changed_fields[field] += 1
                actor[field] = value
            batch_for[key] = batch["batchId"]

    # A historical receipt discovered after the inherited queue was written.
    # Bind this documentary overlay to the exact first-film identity and prompt.
    jack_key = '["Pirates of the Caribbean","id:jack_sparrow_potc"]'
    jack_incarnation = "Pirates of the Caribbean: The Curse of the Black Pearl (2003) - Captain Jack Sparrow"
    jack_receipt = data["jackHistoricalRefusal"]
    assert jack_receipt["characterId"] == "jack_sparrow_potc"
    jack_attempts = [attempt for attempt in jack_receipt["attempts"]
                     if attempt["requestId"] == "73e8ffbe-83c1-42e8-bead-73905e33f31c"]
    assert len(jack_attempts) == 1
    jack_attempt = jack_attempts[0]
    assert jack_attempt["status"] == "blocked-input-moderation" and jack_attempt["outputProduced"] is False
    assert jack_attempt["retries"] == 0
    assert jack_attempt["promptFile"] == str(INPUTS["jackHistoricalPrompt"].relative_to(ROOT))
    assert "Captain Jack Sparrow from Pirates of the Caribbean: The Curse of the Black Pearl (2003)" in INPUTS["jackHistoricalPrompt"].read_text()
    assert by_key[jack_key]["incarnation"] == jack_incarnation
    jack_actor = next(actor for actor in flatten(queue) if actor["actorKey"] == jack_key)
    assert jack_actor["actorId"] == "jack_sparrow_potc" and jack_actor["priority"] == "P0"
    assert jack_actor["providerRefusalEvidence"] is None
    source_field_changed_keys = list(changed_keys)
    jack_actor.update({"providerRefusalEvidence": str(INPUTS["jackHistoricalRefusal"].relative_to(ROOT)),
                       "automaticGenerationRetryAllowed": False, "workMode": "SOURCE_REVIEW_ONLY"})
    for field in ["providerRefusalEvidence", "automaticGenerationRetryAllowed", "workMode"]:
        changed_fields[field] += 1
    changed_keys = [key for key in old_keys if key in set(source_field_changed_keys) | {jack_key}]
    refusal_overlay = {"actorKey": jack_key, "actorId": "jack_sparrow_potc", "incarnation": jack_incarnation,
                       "evidence": str(INPUTS["jackHistoricalRefusal"].relative_to(ROOT)),
                       "evidenceSha256": hashes["jackHistoricalRefusal"],
                       "prompt": jack_attempt["promptFile"], "promptSha256": hashes["jackHistoricalPrompt"],
                       "requestId": jack_attempt["requestId"], "status": jack_attempt["status"],
                       "historicalDate": jack_receipt["date"], "newGenerationAttempt": False,
                       "automaticGenerationRetryAllowed": False, "workMode": "SOURCE_REVIEW_ONLY",
                       "scope": "Exact Jack Sparrow first-film 2003 actor only; no identity aliases or later-film versions inferred."}

    queue.update({
        "sourceCommit": source_commit,
        "orderingPolicy": "Exact actor and batch order inherited from the prior queue; no reranking performed. Current P1 codes, incarnation and reference are refreshed from the immutable-source export.",
        "inheritedOrderingPolicy": inherited["orderingPolicy"],
        "orderingSourceCommit": inherited["sourceCommit"],
        "orderingSourceQueue": str(INPUTS["inheritedQueue"].relative_to(ROOT)),
        "orderingSourceSha256": hashes["inheritedQueue"],
        "orderingRecomputed": False,
        "riskFieldsAreInherited": True,
        "riskFieldMeaning": "riskOrder and riskReason describe the inherited prioritization, not a recomputed current diagnosis; use openP1Codes for current source findings.",
        "updatedActorFields": ["openP1Codes", "incarnation", "reference"],
        "inheritedRefusalPolicy": inherited["refusalPolicy"],
        "refusalPolicy": "The five inherited refusal identities retain their exact controls. The historical CG01 refusal for the exact Jack Sparrow first-film 2003 identity is added as a documentary overlay: SOURCE_REVIEW_ONLY, no automatic retry. This does not authorize generation or infer controls for later-film identities. Other historical refusal records must still be checked before generation.",
        "historicalRefusalOverlays": [refusal_overlay],
        "activityProgress": "actor-activities-40-progress.json",
        "fullActorClosuresClaimed": 0,
        "source1to1Verified": False,
    })
    new_rows = flatten(queue)
    assert [row["actorKey"] for row in new_rows] == old_keys
    allowed = {"openP1Codes", "incarnation", "reference"}
    overlay_fields = {"providerRefusalEvidence", "automaticGenerationRetryAllowed", "workMode"}
    for old, new in zip(old_rows, new_rows):
        excluded = allowed | (overlay_fields if old["actorKey"] == jack_key else set())
        assert {key: value for key, value in old.items() if key not in excluded} == {
            key: value for key, value in new.items() if key not in excluded}
    assert all({key: value for key, value in old.items() if key != "actors"}
               == {key: value for key, value in new.items() if key != "actors"}
               for old, new in zip(inherited["batches"], queue["batches"]))
    assert Counter(len(batch["actors"]) for batch in queue["batches"]) == {40: 123, 15: 1}
    assert len(queue["batches"]) == queue["batchCount"] == 124

    historical_p0 = {row["actorKey"] for row in data["inheritedAudit"]["historicalP0"]}
    queue_p0 = {row["actorKey"] for row in new_rows if row["priority"] == "P0"}
    assert queue_p0 == historical_p0 and len(queue_p0) == 22
    quarantines = data["inheritedAudit"]["unresolvedRasterScope"]
    assert len(quarantines) == 3
    queue_by_key = {row["actorKey"]: row for row in new_rows}
    for record in quarantines:
        actor = queue_by_key[record["actorKey"]]
        assert "RASTER_SCOPE_UNRESOLVED" in actor["openP1Codes"]
        assert actor["riskOrder"] == 1 and not actor["missingRasterPaths"]
    refused = [row for row in new_rows if row["providerRefusalEvidence"]]
    inherited_refused = [row for row in refused if row["actorKey"] != jack_key]
    assert len(refused) == 6 and len(inherited_refused) == 5
    assert all(row["automaticGenerationRetryAllowed"] is False
               and row["workMode"] == "SOURCE_REVIEW_WITH_PROVIDER_REFUSAL_NO_RETRY"
               for row in inherited_refused)
    assert jack_actor["automaticGenerationRetryAllowed"] is False and jack_actor["workMode"] == "SOURCE_REVIEW_ONLY"
    assert queue["inheritedRefusalPolicy"] == inherited["refusalPolicy"]
    assert all(row["source1to1Verified"] is False and row["openP1Codes"] for row in new_rows)

    metadata = data["metadataCohort"]["selected"]
    raster = data["rasterCohort"]["actors"]
    metadata_keys = {row["actorKey"] for row in metadata}
    raster_keys = {row["actorKey"] for row in raster}
    actors_002 = {row["actorKey"] for row in queue["batches"][1]["actors"]}
    assert len(metadata) == len(metadata_keys) == len(raster) == len(raster_keys) == 40
    assert metadata_keys | raster_keys <= p1_keys
    assert raster_keys != actors_002
    assert all(by_key[key]["incarnationEvidence"] == "ACTOR_LOCKED_CONTINUITY" for key in metadata_keys)
    assert all(any(task["code"] == "RASTER_MISSING" for task in by_key[key]["tasks"]) for key in raster_keys)
    delivery = data["rasterDelivery"]
    assert delivery["summary"]["actorRasterFindingsClosed"] == 0
    assert delivery["summary"]["runtimeBindingsChanged"] == 0
    assert delivery["source1to1Verified"] is False

    def activity_rows(records):
        return [{"actorKey": record["actorKey"], "inheritedGlobalBatchId": batch_for[record["actorKey"]],
                 "currentOpenP1Codes": queue_by_key[record["actorKey"]]["openP1Codes"],
                 "currentIncarnation": by_key[record["actorKey"]]["incarnation"],
                 "incarnationEvidence": by_key[record["actorKey"]]["incarnationEvidence"],
                 "actorDossierClosed": False, "source1to1Verified": False} for record in records]

    progress = {
        "schemaVersion": 1, "date": queue["date"], "sourceCommit": source_commit,
        "scope": "Two activity cohorts of 40; these are not consecutive assignments or completion of the inherited global batches.",
        "globalQueue": {"file": "actor-batches-40.json", "actors": len(new_rows), "batches": 124,
                        "fullBatchesOf40": 123, "lastBatchSize": 15, "actorsStillWithP1": len(p1_keys),
                        "orderPreservedExactly": True, "orderingRecomputed": False},
        "metadataActivity": {
            "activityId": "locked-continuity-review-40-20261113", "actorsAudited": 40,
            "source": "../locked-continuity/runtime-source-before.json",
            "selectionSource": str(INPUTS["metadataCohort"].relative_to(ROOT)),
            "meaning": "40 source contracts reviewed; the bounded reader fix additionally recovers 20 exact active contracts and keeps two manga/anime targets ambiguous.",
            "sourceDeclarationsRecoveredInThisCohort": 40,
            "wholeReaderCorrection": {"structuredContinuitiesRecovered": 60, "actorContinuityAmbiguitiesStillP1": 2},
            "globalBatchDistribution": dict(sorted(Counter(batch_for[key] for key in metadata_keys).items())),
            "fullActorClosuresClaimed": 0, "artApprovals": 0, "actors": activity_rows(metadata)},
        "rasterActivity": {
            "activityId": "raster-lot-002", "actorsAudited": 40,
            "source": str(INPUTS["rasterCohort"].relative_to(ROOT)),
            "delivery": str(INPUTS["rasterDelivery"].relative_to(ROOT)),
            "selectionPolicy": data["rasterCohort"]["scope"],
            "equalsGlobalActors002": False, "overlapWithGlobalActors002": len(raster_keys & actors_002),
            "globalBatchDistribution": dict(sorted(Counter(batch_for[key] for key in raster_keys).items())),
            "newGeneratedSubformAtlases": delivery["summary"]["newGeneratedSubformAtlases"],
            "newGeneratedCells": delivery["summary"]["newGeneratedCells"],
            "runtimeBindingsChanged": 0, "actorRasterFindingsClosed": 0, "actorsStillOpen": 40,
            "assetStatus": delivery["assetStatus"], "asset": delivery["newRuntimeAsset"],
            "source1to1Verified": False, "actors": activity_rows(raster)},
        "overlapActorKeys": sorted(metadata_keys & raster_keys),
        "overlapCount": len(metadata_keys & raster_keys),
        "distinctActorsAcrossBothActivities": len(metadata_keys | raster_keys),
        "historicalP0Preserved": 22, "quarantinedRasterScopesPreserved": quarantines,
        "providerRefusalsPreserved": [{"actorKey": row["actorKey"], "evidence": row["providerRefusalEvidence"],
                                      "automaticGenerationRetryAllowed": False} for row in refused],
        "inheritedProviderRefusalCount": 5, "effectiveProviderRefusalCount": 6,
        "historicalRefusalOverlays": [refusal_overlay],
        "fullActorClosuresClaimed": 0, "p0ClosuresClaimed": 0, "source1to1Verified": False,
    }
    after_hashes = {name: sha(path) for name, path in INPUTS.items()}
    assert hashes == after_hashes, "Source evidence changed during refresh"
    validation = {
        "schemaVersion": 1, "date": queue["date"], "sourceCommit": source_commit,
        "inputs": {name: {"path": str(path.relative_to(ROOT)), "sha256": hashes[name]}
                   for name, path in INPUTS.items()},
        "actorCount": 4935, "batchCount": 124, "fullBatchesOf40": 123, "lastBatchSize": 15,
        "historicalP0Count": 22, "quarantinedRasterScopes": 3, "inheritedProviderRefusalCount": 5,
        "effectiveProviderRefusalCount": 6, "historicalRefusalOverlayCount": 1,
        "overlayActorKey": jack_key, "overlayUpdatedFields": sorted(overlay_fields),
        "changedActorCount": len(changed_keys), "changedFields": dict(changed_fields),
        "changedActorKeys": changed_keys,
        "sourceFieldChangedActorCount": len(source_field_changed_keys),
        "sourceFieldChangedActorKeys": source_field_changed_keys,
        "checks": {"noDuplicateKeys": True, "allExactIdentitiesMatchCurrentExport": True,
                   "membershipEqualsAllCurrentP1Actors": True, "batchAndActorOrderPreserved": True,
                   "batchStatusAndMetadataPreserved": True, "nonUpdatedActorFieldsPreserved": True,
                   "historicalP0Preserved": True, "quarantinesPreserved": True, "refusalPoliciesPreserved": True,
                   "jackOverlayBoundToExact2003IdentityAndReceipt": True,
                   "noDossierClosed": True, "inputBytesUnchanged": True},
        "source1to1Verified": False,
    }
    outputs = {"actor-batches-40.json": dump(queue), "actor-activities-40-progress.json": dump(progress)}
    validation["outputsSha256"] = {name: hashlib.sha256(value.encode()).hexdigest() for name, value in outputs.items()}
    outputs["actor-batches-40-validation.json"] = dump(validation)
    return outputs, validation, progress


if __name__ == "__main__":
    outputs, validation, progress = make_reports()
    if sys.argv[1:] == ["--check"]:
        for name, value in outputs.items():
            assert (OUT / name).read_text() == value, f"Stale generated report: {name}"
    else:
        assert not sys.argv[1:], "Usage: refresh-inherited-actor-batches-40.py [--check]"
        for name, value in outputs.items():
            (OUT / name).write_text(value)
    print(json.dumps({"actorCount": validation["actorCount"], "batchCount": validation["batchCount"],
                      "changedActorCount": validation["changedActorCount"], "changedFields": validation["changedFields"],
                      "activitiesOverlap": progress["overlapCount"],
                      "distinctActorsAcrossActivities": progress["distinctActorsAcrossBothActivities"],
                      "checks": validation["checks"]}))
