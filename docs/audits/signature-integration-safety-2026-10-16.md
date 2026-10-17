# Signature integration and interruption safety — 2026-10-16

## Scope and provenance

This delivery resumes PR #2 from `e97c5966836747fc979cd8065684a91a2921c328`. The preceding signature validation run (`38945589448`) checked the twelve proposed files against `2f2db5d1c193e0408881d5af99d94da405b7b24e`, but had not attached them to the PR branch. The integration commit now includes those files and removes the two completed temporary workbench workflows. The permanent signature workflow has read-only repository permissions and retains the existing reliability workflow.

No merge, production release, real account change, save schema change, email delivery, or subscription change is part of this delivery.

## Playable additions

- Six explicit equipped-invocation contracts: FFVII Knights of Round, Gears Hammer of Dawn, Halo Warthog, Aliens sentries, Half-Life snarks, and Portal companion-cube protection. There are 31 actor-to-event bindings. Exact actor ID, source universe, event ID and effect must agree; similar names never grant an ability.
- RPG invocations reserve a full ATB bar once. Cinematic phases use simulation ticks and pause with combat. Contacts are separated (13 for the existing Knights event) without multiplying the full attack value by the contact count. Damage and protection pass through native dispatchers.
- Existing native RPG actions with type `summon` use the sequence while preserving their native effect and cooldown. This includes protective deployments; it does not reclassify them as magical creatures.
- Existing source-profiled Smash specials gain a 100%-meter personal-super command for P1 and eligible local P2. Their native spatial profile and executor remain authoritative. Unprofiled legacy specials are not silently promoted to full-screen attacks.
- The real GameCanvas installs the director per combat instance and renders the sequence, readiness and equipped-item controls. Nothing is injected into production through the isolated QA fixture.

## Additional bugs reproduced and corrected during resumption

1. A nonlethal hit could leave `actionPending` stuck after cancellation. The director now owns an explicit cast lock, releases only its own pending flag, and preserves incoming hit/death states.
2. After the first invocation contact, later interruptions could continue striking. Lock ownership and interruption checks now apply throughout the sequence.
3. A melee super could acquire a different target when its original target died or moved out of range. The exact target object list and source range are revalidated before native execution.
4. Local P2 could switch the active actor between reservation and impact. Normal switching is blocked during staging; a direct external replacement cancels the original preparation without spending the replacement actor's meter.
5. Snark self-risk disappeared when the struck prey died before the final contact. The final blast now uses actual prior impact locations, hits each nearby ally at most once, and preserves its hit reaction. It does not create blast locations where no attack landed.
6. Invocation filtering excluded external encounter targets such as Nihilanth crystals. Target membership now follows the native encounter target list. A real-engine regression destroys the crystals without awarding extra enemy kills or bypassing the closed-head rule.
7. Cancelling the director after a native summon was handed to the RPG callback queue could erase the native executor's lock. Ownership transfers explicitly at commitment.
8. The QA Harness export was fixed so the strict signature lint gate can reject all warnings.

## Validation before branch publication

- Recovered exact-head integration run `38945589448`: 283/283 regression tests; 116/116 tactical tests; four successful Chromium scenarios; Vite source build successful. Its one lint warning was the fixture export addressed here.
- The first new interruption regression run reproduced 11 failures out of 12 tests before the safety fixes.
- After fixes, the new safety file passes 76 individual tests, including 62 actor/mode subtests (31 bindings x RPG/Smash).
- The local combined safety + existing RPG lifecycle + event usage + Smash profile command passes 137/137, with no failures, skips or cancellations. These groups overlap and are not additive totals.
- Local lint of the revised director, catalog and safety tests: zero warnings and zero errors.
- Local testing used the archived source checkout for unchanged RPG/Smash dependencies. It is not a claim that the entire current repository or all bitmap assets were reproduced locally. The permanent GitHub workflows are the exact-published-head verification gate.

The permanent `Signature combat` workflow executes the original signature suite plus the safety suite, full coverage inventory, strict changed-file lint, Vite source compilation and four Chromium desktop/mobile scenarios. The existing reliability workflow still covers the other RPG, tactical, save and account regressions. Final run IDs and results belong in the PR delivery summary after those runs complete.

## Coverage, not a fidelity certificate

The recovered full inventory contains 4,936 entries across 525 universes: 1,912 heroes and 3,024 enemies/bosses. It reports 10 native RPG summoners, 31 equipped-invocation bindings, 30 profiled melee supers, 101 non-combat entries and 4,765 entries still missing a signature contract. Categories can overlap. No entry is certified as 1:1 source fidelity by this feature.

Rendering uses existing caster artwork with abstract staging, impact markers and a phase panel. No new summon-creature sprite sheet, vehicle animation, source film choreography or canonical timing pack is delivered here. Prices, timing, damage, friendly-blast radius and most staging remain explicitly marked Nexus adaptations.

The request for every character and universe is therefore NOT declared complete. Remaining work includes source-by-source actor/variant verification, summon/super artwork, enemy AI usage where unsupported, faithfully authored choreography, full gameplay routes, physical-phone testing and final asset prebuild. A green fixture test cannot certify those unfinished areas.

## Primary references for scope

- Square Enix, FFVII Rebirth summon overview: https://www.square-enix-games.com/en_US/news/final-fantasy-vii-rebirth-preview-remake-recap-video . This explains the summon presentation reference; it does not certify this project's mechanics as identical to FFVII (1997).
- Valve, Half-Life SDK `CSqueakGrenade`: https://github.com/ValveSoftware/halflife/blob/master/dlls/squeakgrenade.cpp . Consulted for the creature's final area explosion and lack of owner immunity; no SDK source was copied into this implementation.
