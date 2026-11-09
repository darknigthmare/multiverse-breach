// Last Action Hero — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'last_action_hero',
    universe: 'Last Action Hero',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Jack Slater Movie Premiere',
    boss: 'Benedict Fourth-Wall Escape',
    cast: [
      ['jack_slater_lah', 'Jack Slater', 'marine'],
      ['danny_madigan_lah', 'Danny Madigan', 'hacker'],
      ['whiskers_lah', 'Whiskers', 'slayer']
    ],
    enemies: ['Movie Henchman', 'Dynamite Gangster', 'Premiere Assassin'],
    bosses: ['Mr. Benedict', 'The Ripper'],
    gear: [
      ['ticket', 'Houdini Golden Ticket', 'Ticket dore de Houdini'],
      ['desert_eagle', 'Jack Slater Desert Eagle', 'Desert Eagle de Jack Slater'],
      ['script_page', 'Action Script Page', 'Page de scenario d action']
    ],
    event: ['big_gun', 'Action-Movie Ammunition Rule', 'Regle des munitions de film d action', 'Jack fires an impossible barrage until Danny identifies the real-world limit that ends the scene.', 'Jack tire une salve impossible jusqu a ce que Danny trouve la limite du monde reel qui termine la scene.'],
    origin: ['A magical ticket pulls Danny into the action films of Jack Slater, then lets villains escape into a world where consequences are real.', 'Un ticket magique attire Danny dans les films d action de Jack Slater, puis laisse les mechants gagner un monde ou les consequences sont reelles.'],
    breach: ['the golden ticket can cross any portal without clearance, making genre rules contagious across the Nexus.', 'le ticket dore traverse tout portail sans autorisation, rendant les regles de genre contagieuses dans le Nexus.'],
    motif: 'arcanecity',
    colors: ['#15293a', '#030609', '#f1b83e']
  }));
}
