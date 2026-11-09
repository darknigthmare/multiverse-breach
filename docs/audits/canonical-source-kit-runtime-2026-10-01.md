# Six source kits: RPG and Tactics execution audit

The source locks are Han Solo in *A New Hope* (1977), Luke Skywalker in *Return of the Jedi* (1983), Darth Vader in *The Empire Strikes Back* (1980), and Bob, Kevin and Stuart in *Minions* (2015). Their source references, incarnations, equipment and pending artwork reviews remain documented in `canon-star-wars-minions-2026-10-01.md`.

This follow-up checks the actions executed by the engines, beyond their names and character plaques. It does not certify existing sprites or the game's numerical combat rules as a 1:1 reconstruction of their films.

## Corrections applied

- RPG previously emitted a `laser_line` and shooting sound for every distant action, including telekinesis, bananas and music. The six source kits now use a shared, explicitly scoped presentation: red DL-44 bolts for Han, thrown yellow banana shapes for Bob and Kevin, musical notes for Stuart, moving debris for telekinesis, and a small cue on the selected victim for Vader's Force choke. Luke and Vader produce no electrical beam. Physical Minion and guitar contact actions use impact sounds rather than sword sounds.
- Tactics previously gave all special actions a default range of five cells, including Luke's saber duel and Bob/Kevin's physical attacks. Their contact specials now require an adjacent cell. Luke, Vader, Bob, Kevin and Stuart's basic contact actions also explicitly use one-cell reach. The opt-in values live in `tacticsProfile`; they do not set RPG or Smash ranges.
- Han's Tactics blaster now has a ranged basic action. His volley resolves up to three distinct legal shots, rather than collapsing the RPG `multi` contract into one target or turning it into a cone. The clicked opponent has priority. Each subsequent candidate must independently satisfy range and line of sight, with the common target budget applied once.
- Both manual and automatic Tactics attacks use the shared presentation for these source kits. Their specials bypass the old generic block-shaped flash. Vader's choke remains a single-target attack and does not damage neighboring opponents.
- The shared presentation resolves the original `sourceId` for custom P2 heroes. Other identities retain their existing presentation and range inference.

Damage multipliers, cooldowns, charge costs, health, attack/defense/speed stats, saved IDs and image routes remain intact. Banana damage, musical damage, automatic volley selection and the small Force feedback remain disclosed game adaptations. Existing artwork still needs independent visual review against the cited source incarnation.

## Verification

`scripts/canonSourceKitRuntime.test.mjs` contains 15 tests. It executes actual RPG delayed impacts and Tactics manual commands, checking selected victims, untouched opponents, rejected distant contact attacks without spending charge, red blaster bolts, banana/music particles, blocked volley targets, and P2 source identity.

The targeted run also includes `canonStarWarsMinionsCorrections.test.mjs`, `rpgTargeting.test.mjs`, `tacticalFighterFacing.test.mjs` and `combatEffectRegressions.test.mjs`: **90 tests passed, zero failed**. This preserves the existing healing-cap, paralysis-duration, event-buff and directional combat regressions. The first new test run exposed two invalid fixture indices beyond the real RPG custom-roster cap of three; the tests were corrected to use the actual spawned roster, without changing engine roster behavior.
