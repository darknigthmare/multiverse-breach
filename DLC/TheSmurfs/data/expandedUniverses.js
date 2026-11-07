// The Smurfs — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'smurfs',
    universe: 'The Smurfs',
    mediaType: 'series',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'Les Schtroumpfs',
    stage: 'Smurf Village Gargamel Raid',
    boss: 'Gargamel Essence Extractor',
    cast: [
      ['papa_smurf', 'Papa Smurf', 'hacker'],
      ['smurfette', 'Smurfette', 'slayer'],
      ['hefty_smurf', 'Hefty Smurf', 'marine']
    ],
    enemies: ['Gargamel Trap', 'Azrael Pounce', 'Purple Smurf'],
    bosses: ['Azrael', 'Gargamel'],
    gear: [
      ['sarsaparilla', 'Sarsaparilla Ration', 'Ration de salsepareille'],
      ['potion', 'Papa Smurf Potion', 'Potion du Grand Schtroumpf'],
      ['magic_flute', 'Magic Flute Note', 'Note de flute magique']
    ],
    event: ['village_call', 'Smurf Village Rally', 'Ralliement du village schtroumpf', 'Every available Smurf completes one tiny task, combining into a full-field rescue.', 'Chaque Schtroumpf accomplit une petite tache qui se combine en sauvetage de tout le terrain.'],
    origin: ['A hidden village of tiny blue Smurfs survives Gargamel s schemes through cooperation, craft, magic, and specialized talents.', 'Un village cache de petits Schtroumpfs bleus survit aux plans de Gargamel par la cooperation, l artisanat, la magie et des talents specialises.'],
    breach: ['Gargamel mistakes blue portal fragments for Smurf essence, while Papa Smurf realizes their communal memory can stabilize damaged rooms.', 'Gargamel confond les fragments bleus de portail avec l essence schtroumpf, tandis que le Grand Schtroumpf comprend que leur memoire commune stabilise les salles endommagees.'],
    motif: 'castle',
    colors: ['#17406b', '#03080d', '#e4483f']
  }));
}
