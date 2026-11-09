// Attack on Titan — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Attack on Titan',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Shiganshina Wall Breach',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Colossal Titan',
    title: { en: 'Attack on Titan', fr: 'L Attaque des Titans' },
    desc: {
      en: 'Humanity fights towering Titans with ODM gear, wall warfare, political secrets, and brutal sacrifice.',
      fr: 'L humanite affronte les Titans avec equipement tridimensionnel, murs, secrets politiques et sacrifices.'
    },
    hero: { id: 'eren_yeager', name: 'Eren Yeager', cat: 'slayer', color: '#2f7d55' },
    allies: [
      { id: 'mikasa_ackerman', name: 'Mikasa Ackerman', cat: 'slayer', color: '#8b1e2d' },
      { id: 'armin_arlert', name: 'Armin Arlert', cat: 'tactical', color: '#f1c40f' }
    ],
    monsters: ['Pure Titan', 'Crawler Titan', 'Wall Cult Fanatic'],
    bosses: ['Armored Titan', 'Female Titan'],
    worldBoss: 'Colossal Titan',
    gear: [
      ['aot_odm_gear', 'ODM Gear', 'Equipement tridimensionnel', { spd: 3, atk: 6 }],
      ['aot_blade_pair', 'Titan Blade Pair', 'Lames anti-Titan', { atk: 10 }],
      ['aot_survey_cloak', 'Survey Corps Cloak', 'Cape du bataillon', { def: 6, hp: 45 }]
    ],
    event: ['evt_aot_wall_breach', 'Wall Breach Counterattack', 'Contre-attaque du mur', 'ODM strikes slash every huge enemy and grant speed.', 'Les frappes tridimensionnelles taillent les grands ennemis et donnent vitesse.'],
    decor: { sky: ['#3a3324', '#080604'], floor: 'rgba(117, 91, 48, 0.2)', grid: 'rgba(205, 166, 82, 0.26)', motif: 'castle', accent: '#cda652' }
  });
}
