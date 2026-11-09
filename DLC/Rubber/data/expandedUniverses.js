// Rubber — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Rubber',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Desert Tire Psychokinesis',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Robert the Killer Tire',
    title: { en: 'Rubber', fr: 'Rubber le pneu killer' },
    desc: { en: 'A sentient tire rolls through desert absurdity, exploding heads by pure psychokinetic nonsense.', fr: 'Un pneu conscient traverse le desert absurde et fait exploser les cibles par psychokinese.' },
    hero: { id: 'robert_rubber', name: 'Robert Tire', cat: 'hacker', color: '#1b1b1b' },
    allies: [{ id: 'sheriff_rubber', name: 'Rubber Sheriff', cat: 'tactical', color: '#8c6f45' }, { id: 'spectator_rubber', name: 'Desert Spectator', cat: 'horror', color: '#c9b27a' }],
    monsters: ['Desert Bottle Target', 'Spectator Drone', 'Motel Patrol'],
    bosses: ['Psychic Tire Swarm', 'Fourth Wall Sheriff'],
    worldBoss: 'Robert the Killer Tire',
    gear: [['rubber_tread', 'Psychic Tire Tread', 'Bande de pneu psychique', { atk: 9 }], ['rubber_binoculars', 'Spectator Binoculars', 'Jumelles de spectateur', { spd: 2, def: 3 }], ['rubber_desert_dust', 'Desert Dust Loop', 'Boucle de poussiere', { hp: 60, def: 4 }]],
    event: ['evt_rubber_no_reason', 'No Reason Detonation', 'Explosion sans raison', 'A no-reason psychic pulse hits the strongest enemy.', 'Une onde psychique sans raison frappe l ennemi le plus fort.'],
    decor: { sky: ['#3b2a18', '#090503'], floor: 'rgba(194, 141, 70, 0.2)', grid: 'rgba(255, 216, 130, 0.26)', motif: 'wasteland', accent: '#ffd882' }
  });
}
