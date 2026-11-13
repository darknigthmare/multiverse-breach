// A Nightmare on Elm Street — definitions consumed by src/game/canonRosterWavePartM.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r }) {
  return (r('nightmare_elm_street', 'A Nightmare on Elm Street', 'https://www.warnerbros.com/movies/nightmare-elm-street',
    ['Nancy Thompson', 'Kristen Parker', { id: 'glen', name: 'Glen Lantz', nonCombat: true, objective: 'Maintain the wake timer and guide the group out of the dream maze.' }],
    ['Boiler-Room Steam Gate', 'Dream Staircase Loop', 'Sleep Timer'], ['Freddy Dream Shadow', 'Boiler Room Labyrinth', 'Freddy Krueger'],
    { id: 'dream_nexus', name: 'Elm Street Dream Nexus', nonCombat: true, objective: 'Break the nightmare anchors and wake every sleeper safely.', visualAnchor: 'Abstract red-green dream clock, boiler pipes and four collapsing nightmare doors; no injured person.' },
    ['Wake-Up Alarm', 'Dream Journal', 'Protective Talisman'], ['1428 Elm Street', 'Boiler Room Dream', 'Dream Nexus Wake Route'],
    { aliases: ['Elm Street Freddy', 'Freddy Krueger'], continuity: 'Original A Nightmare on Elm Street film-series continuity', rule: 'No actor likeness, gore, burns detail or child harm. Freddy uses the fictional hat, striped sweater and claw silhouette; encounters focus on dream puzzles and escape.', anchor: 'Surreal Elm Street suburb, red-green dream light, boiler pipes, long shadows and impossible stairs.' }));
}
