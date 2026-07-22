# Stage music completion - House of the Dead 1-3 - 2026-07-22

## Scope

Dedicated runtime profiles replace the generic survival-horror fallback for the three House of the Dead universes:

| Universe | Profile ID | Runtime direction |
| --- | --- | --- |
| House of the Dead | `mus-house-of-the-dead` | Curien Mansion gothic pressure, AMS pistol mechanics, DBR laboratory tension and Magician escalation |
| House of the Dead 2 | `mus-house-of-the-dead-2` | Venice rescue route, canal pursuit, Goldman tower ascent and Emperor Type Alpha escalation |
| House of the Dead 3 | `mus-house-of-the-dead-3` | Abandoned EFI facility, shotgun cadence, BioReactor descent and Wheel of Fate escalation |

## Copyright policy

All three profiles declare `sourcePolicy: original-procedural-only`. Their melodies, rhythms, stingers and victory cues are original runtime data. The instrument labels describe lore-facing sound palettes without reproducing or transcribing Sega soundtrack material.

## Gameplay coverage

Each profile supplies distinct exploration, battle, boss and victory material. The runtime still applies mode-specific pacing for RPG, Tactics, Melee, Combat, FPS and Race.

## Validation

`scripts/stageMusicAudit.mjs` asserts the three stable profile IDs. Validation passed with:

```text
cmd /c npm run music:audit
```

The audit reports 293 universe profiles, 1172 stage views and 1172 unique runtime keys.
