// Noelle Perna — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Noelle Perna',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Mado Nice Comedy Rift',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Mado Monologue Storm',
    title: { en: 'Noelle Perna', fr: 'Noelle Perna' },
    desc: { en: 'Southern French stage comedy and Mado s verbal tornado become a resonance persona breach.', fr: 'La scene comique du Sud et la tornade verbale de Mado deviennent une breche de persona de resonance.' },
    hero: { id: 'mado_perna', name: 'Mado la Nicoise', cat: 'hacker', color: '#e36b8f' },
    allies: [{ id: 'cafe_nice_regular', name: 'Cafe de Nice Regular', cat: 'tactical', color: '#c89b5a' }, { id: 'theater_stagehand', name: 'Theater Stagehand', cat: 'marine', color: '#5c6470' }],
    monsters: ['Heckler Echo', 'Stage Light Gremlin', 'Gossip Cyclone'],
    bosses: ['One-Woman-Show Spotlight', 'Nice Cafe Rumor'],
    worldBoss: 'Mado Monologue Storm',
    gear: [['perna_scarf', 'Mado Scarf', 'Foulard de Mado', { spd: 2, hp: 45 }], ['perna_mic', 'Stage Mic', 'Micro de scene', { atk: 8 }], ['perna_ticket', 'Comedy Ticket', 'Billet de spectacle', { def: 4, hp: 45 }]],
    event: ['evt_perna_tirade', 'Nicoise Tirade', 'Tirade nicoise', 'A relentless monologue interrupts enemy casts.', 'Une tirade intarissable interrompt les incantations ennemies.'],
    decor: { sky: ['#2c1d2b', '#070407'], floor: 'rgba(227, 107, 143, 0.15)', grid: 'rgba(255, 206, 118, 0.26)', motif: 'speaker', accent: '#ffce76' }
  });
}
