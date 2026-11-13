// Spy x Family — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Keith Kepler',
      weapon: 'bomb_dogs_and_handgun',
      special: 'Minister Assassination Plan',
      phases: ['Uses a handgun and directs trained bomb dogs', 'Attempts to trigger the documented explosive plan after losing his escort'],
      lore: {
        fr: 'Keith dirige le groupe terroriste de l arc du chien.',
        en: 'Keith leads the terrorist group in the dog arc.'
      },
      referenceUrl: 'https://spy-family.net/tvseries/episodes/episode25.php',
      visualAnchor: 'Exact anime Keith Kepler, blond hair, long coat, terrorist clothing, handgun and source bomb-dog equipment.'
    },
    {
      name: 'Edgar',
      weapon: 'handgun_and_smuggling_guards',
      special: 'Counterfeit Ring Ambush',
      phases: ['Uses guards and a handgun from cover', 'Panics into inaccurate close-range fire after Twilight exposes him'],
      lore: {
        fr: 'Edgar est le criminel affronte par Twilight dans le premier episode.',
        en: 'Edgar is the criminal confronted by Twilight in the first episode.'
      },
      referenceUrl: 'https://spy-family.net/tvseries/episodes/episode1.php',
      visualAnchor: 'Exact anime Edgar design, slick dark hair, facial features, suit and pistol from episode 1; no military armor.'
    }
  ]);
}
