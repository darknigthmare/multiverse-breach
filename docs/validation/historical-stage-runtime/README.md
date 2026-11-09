# Historical stage traces across Node runtimes

This records a controlled comparison of the same stage renderer under Node
22.23.4 (V8 12.4.254.21-node.57) and Node 24.19.0
(V8 13.6.233.17-node.51). The required validation runtime is Node 22.

The original W16/W17 tests passed 9/11 under Node 22 and 11/11 under Node 24.
All historical stage definitions remained identical. Across the W17 snapshot's
1,740 stage/mode rows and two simulation times (3,480 draws), eight hashes
changed: the Springfield cooling-tower scene in four modes, at time 0 and
5.75 seconds. Each changed draw has exactly one different numeric property.
The W16 snapshot contains 425 Tactics rows, sampled at the same two times.

The difference is a cubic Bezier calculation, not a changed stage definition or
animation. For `(1 - 11 / 20) ** 3`, the runtimes produce
`0.09112499999999998` and `0.09112499999999997`. Canvas command 24 is consequently
`['lineTo', 482.41648200000003, Y]`, with `Y` equal to `177.8660725` under
Node 22 and `177.86607249999997` under Node 24. The difference is one ULP,
`2.842170943040401e-14` pixels. No other command, property or sample changed.

The test helper in `scripts/historicalStageRuntimeCompatibility.mjs` retains
both original expected hashes. An alternate trace is accepted only when its
complete raw hash matches one of the two observed Node 22 hashes, with the
exact Springfield identity, source scene, four allowed modes, sample key and
simulation time. It checks command 24 exactly, copies only that known Y value
to the historical representation, and then requires the original historical
hash. It performs no general numeric rounding or epsilon comparison.
An inline negative test rejects changed identities, modes, times, hashes,
methods, coordinates, larger or additional ULP differences, and other commands.

The original baseline files remain unchanged:

| Snapshot | SHA-256 |
| --- | --- |
| `docs/tactics-universes-2026-10-28/baseline-tactics-stages-before.json` | `6063699c4e2e8424d7f9eb1574aabe6a433801442c2ec8cc1239020a6725503f` |
| `docs/combat-fidelity-wave17-2026-11-02/stages/baseline-before.json` | `13339ae20d54be5f35031af959dd6d3226c5904ed3bd2dab38cde07492fee044` |

`diagnosis-20261109.json` and `runtime-deltas-20261109.json` are unchanged copies
of the actual diagnostic output. `original-node22-20261109.log` and
`original-node24-20261109.log` record the original two-file comparison.
`validation-20261109.json` records the subsequent complete stage-suite commands,
actual exits, counts and hashes; the corresponding final logs are retained here.
The runs use a 2 GB Node heap limit, CPUs 0 and 1, one test worker, standard
process isolation and no preload.

This evidence covers stage definitions, selection, simulation geometry and
runtime compatibility. It is not a source-frame or visual-fidelity
certification. Existing unverified fidelity flags remain unchanged. No game
renderer, historical baseline, asset registry or PNG was changed for this fix.
