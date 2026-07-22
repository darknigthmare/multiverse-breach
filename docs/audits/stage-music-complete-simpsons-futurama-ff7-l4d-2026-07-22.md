# Stage music completion - 2026-07-22

## Scope

Dedicated runtime profiles were added for four previously fallback-only universes:

| Universe | Profile ID | Runtime direction |
| --- | --- | --- |
| The Simpsons | `mus-the-simpsons` | Springfield comedy orchestration, Sector 7-G machinery and reactor escalation |
| Futurama | `mus-futurama` | Retro-future delivery pulse, robot percussion and Hypnotoad escalation |
| Final Fantasy VII | `mus-final-fantasy-vii` | Mako-industrial tension, synthetic ensemble and Jenova escalation |
| Left 4 Dead | `mus-left-4-dead` | Sparse safe-room tension, infected crescendo and rooftop evacuation pressure |

## Copyright policy

All four profiles declare `sourcePolicy: original-procedural-only`. Their note patterns, forms, stingers and victory cues are original runtime data. Instrument names describe the universe's sound palette without reproducing, transcribing or approximating an existing score.

## Gameplay states

Every profile supplies:

- an exploration or briefing section;
- a denser mission section;
- a pressure or encounter transition;
- a dedicated boss/finale section;
- an original victory cadence.

## Validation

`scripts/stageMusicAudit.mjs` includes stable ID assertions for all four profiles. Run:

```text
cmd /c npm run music:audit
```

