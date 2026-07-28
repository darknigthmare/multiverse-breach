#!/usr/bin/env python3
"""Validate the Multiverse Breach original-universe manifest without dependencies."""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

EXPECTED = {
    "universes": 20,
    "heroes": 3,
    "enemies": 5,
    "bosses": 3,
    "gear": 3,
    "battleItems": 5,
    "stages": 3,
}
ALLOWED_CATEGORIES = {"marine", "slayer", "horror", "hacker", "tactical"}
ALLOWED_MODES = {"RPG", "Tactics", "Smash"}


def duplicates(values):
    return sorted(value for value, count in Counter(values).items() if count > 1)


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "multiverse_breach_original_universes_manifest.json")
    with path.open("r", encoding="utf-8") as stream:
        data = json.load(stream)

    errors = []
    universes = data.get("universes", [])
    if len(universes) != EXPECTED["universes"]:
        errors.append(f"universes={len(universes)} expected={EXPECTED['universes']}")

    ids = {
        "universe keys": [],
        "universe names": [],
        "hero ids": [],
        "gear ids": [],
        "battle item ids": [],
        "stage ids": [],
        "booster ids": [],
    }

    for universe in universes:
        key = universe.get("key", "<missing>")
        if universe.get("sourceType") != "original" or universe.get("isOriginal") is not True:
            errors.append(f"{key}: sourceType/isOriginal mismatch")
        if universe.get("mediaType") != "game":
            errors.append(f"{key}: mediaType must be game")
        if universe.get("mode") not in ALLOWED_MODES:
            errors.append(f"{key}: invalid mode {universe.get('mode')!r}")

        for field in ("heroes", "enemies", "bosses", "gear", "battleItems", "stages"):
            actual = len(universe.get(field, []))
            if actual != EXPECTED[field]:
                errors.append(f"{key}: {field}={actual} expected={EXPECTED[field]}")

        for hero in universe.get("heroes", []):
            if hero.get("category") not in ALLOWED_CATEGORIES:
                errors.append(f"{key}: invalid hero category for {hero.get('id')}")
            if hero.get("universe") != universe.get("universe"):
                errors.append(f"{key}: hero universe mismatch for {hero.get('id')}")

        booster = universe.get("booster", {})
        expected_heroes = [hero.get("id") for hero in universe.get("heroes", [])]
        if booster.get("heroIds") != expected_heroes:
            errors.append(f"{key}: booster heroIds mismatch")

        unlockable_ids = {entry.get("id") for entry in universe.get("customUnlockables", [])}
        chase_id = booster.get("chaseRewardId")
        if chase_id not in unlockable_ids:
            errors.append(f"{key}: chase reward {chase_id!r} is absent from customUnlockables")

        plan = universe.get("boosterPoolPlan", {})
        if plan.get("cardsPerOpenedBooster") != 5:
            errors.append(f"{key}: booster must open exactly five cards")
        if plan.get("minimumUniqueCandidates", 0) < 24:
            errors.append(f"{key}: booster pool smaller than 24 candidates")

        ids["universe keys"].append(key)
        ids["universe names"].append(universe.get("universe"))
        ids["hero ids"].extend(hero.get("id") for hero in universe.get("heroes", []))
        ids["gear ids"].extend(item.get("id") for item in universe.get("gear", []))
        ids["battle item ids"].extend(item.get("id") for item in universe.get("battleItems", []))
        ids["stage ids"].extend(item.get("id") for item in universe.get("stages", []))
        ids["booster ids"].append(booster.get("id"))

    for label, values in ids.items():
        dup = duplicates(values)
        if dup:
            errors.append(f"duplicate {label}: {dup}")

    if errors:
        print("VALIDATION FAILED", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    totals = data.get("totals", {})
    print("VALIDATION OK")
    print(json.dumps(totals, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
