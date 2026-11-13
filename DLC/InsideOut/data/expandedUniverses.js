// Inside Out — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'inside_out',
    universe: 'Inside Out',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Vice-Versa',
    stage: 'Headquarters Memory Core Collapse',
    boss: 'Belief System Anxiety Storm',
    cast: [
      ['joy_insideout', 'Joy', 'hacker'],
      ['sadness_insideout', 'Sadness', 'tactical'],
      ['anger_insideout', 'Anger', 'slayer']
    ],
    enemies: ['Memory Vacuum', 'Subconscious Fear', 'Sarcasm Chasm Echo'],
    bosses: ['Jangle Nightmare', 'Anxiety Belief Storm'],
    gear: [
      ['core_memory', 'Core Memory Orb', 'Orbe de souvenir essentiel'],
      ['train_ticket', 'Train of Thought Ticket', 'Billet du train de la pensee'],
      ['console_key', 'Headquarters Console Key', 'Cle de console du quartier general']
    ],
    event: ['mixed_memory', 'Mixed Core Memory', 'Souvenir essentiel melange', 'Joy and Sadness stabilize a collapsing memory together, healing allies and preventing forced emotion states.', 'Joie et Tristesse stabilisent ensemble un souvenir qui s effondre, soignent les allies et empechent les emotions imposees.'],
    origin: ['Riley s emotions guide her through memory, personality islands, change, and the discovery that feelings work together rather than alone.', 'Les emotions de Riley la guident a travers souvenirs, iles de personnalite, changement et decouverte que les sentiments fonctionnent ensemble.'],
    breach: ['portal shocks become false core memories in every hero, and the emotions must separate authentic pain from Authorless edits.', 'les chocs de portail deviennent de faux souvenirs essentiels chez chaque heros, et les emotions doivent separer la douleur authentique des retouches du Sans-Auteur.'],
    motif: 'facility',
    colors: ['#293041', '#050609', '#f2d84e']
  }));
}
