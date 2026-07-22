# Lore enemy overrides - 2026-07-22

## Scope

This pass replaces fifteen generated enemy labels with source-specific threats
for five universes. It changes runtime data only; image availability remains
tracked independently by the generated sprite manifest.

| Universe | Replacements |
| --- | --- |
| Heavy Metal 2000 | Tyler's Space Pirate; Uroboris Reptilian Gladiator; Tyler's Citadel Assault Squad |
| Sharknado | Flying Bull Shark; Tornado Tiger Shark; Airborne Shark Swarm |
| Godzilla The Animated Series | Cyber Fly; Giant Mutant Rat; Giant Mutant Termite Swarm |
| Pee-wee | Satan's Helpers Biker; Warner Bros. Studio Guard; Movie-Set Godzilla Performer |
| The Thing | Dog-Thing; Bennings-Thing; Palmer-Thing |

## Lore locks

- Heavy Metal 2000 enemies use Tyler's pirate crew, Uroboris combatants and
  the assault on the fountain citadel. Nexus armor and generic rift creatures
  are excluded.
- Sharknado enemies remain natural shark species displaced by the storm. They
  do not become humanoid or fantasy hybrids.
- Godzilla The Animated Series enemies use threats from the 1998 animated
  continuity, not monsters from unrelated Godzilla films.
- Pee-wee enemies are grounded in the biker-bar and studio chase sequences.
  The movie-set Godzilla remains visibly a human-scale practical costume.
- The Thing enemies are locked to the 1982 practical-effect forms. Dog-Thing,
  Bennings-Thing and Palmer-Thing must not borrow anatomy from Blair-Thing or
  the 2011 prequel.

## Sources

- Heavy Metal 2000: https://www.sonypictures.com/movies/heavymetal2000
- Sharknado: https://en.wikipedia.org/wiki/Sharknado
- Godzilla The Series overview: https://en.wikipedia.org/wiki/Godzilla:_The_Series
- Pee-wee's Big Adventure catalogue entry:
  https://catalog.afi.com/Film/67303-PEE-WEES-BIGADVENTURE
- The Thing official synopsis:
  https://www.universalpicturesathome.com/movies/the-thing-1982
- The Thing plot and blood-test sequence:
  https://www.imdb.com/title/tt0084787/plotsummary/

## Validation

- Each universe key appears once in `LORE_ENEMY_OVERRIDES`.
- Each replacement defines a distinct weapon, special, bilingual description,
  source URL and visual lock.
- `node --check src/game/loreEnemyOverrides.js` passes.
- The sprite prompt pack must be rebuilt after all image agents finish so the
  new names and output paths replace the stale generic manifest entries.

