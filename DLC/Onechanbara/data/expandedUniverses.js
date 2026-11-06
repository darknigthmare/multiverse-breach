// Onechanbara — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Onechanbara',
    mediaType: 'game',
    faction: 'horror',
    stageName: 'Zombie Bikini Blade Arena',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Blood Mist Zombie Queen',
    title: { en: 'Onechanbara', fr: 'Onechanbara' },
    desc: { en: 'Zombie crowds, katana dances, blood rage, and exploitation-horror arcade combat hit the Nexus.', fr: 'Foules zombies, danses au katana, rage sanglante et arcade exploitation-horror frappent le Nexus.' },
    hero: { id: 'aya_onechanbara', name: 'Aya', cat: 'slayer', color: '#c0392b' },
    allies: [{ id: 'saki_onechanbara', name: 'Saki', cat: 'slayer', color: '#6c4aa3' }, { id: 'reiko_onechanbara', name: 'Reiko', cat: 'marine', color: '#4d5f6f' }],
    monsters: ['Arena Zombie', 'Blood Mist Ghoul', 'Chainsaw Corpse'],
    bosses: ['Mutant Zombie Sister', 'Cursed Katana Duelist'],
    worldBoss: 'Blood Mist Zombie Queen',
    gear: [['one_katana', 'Blood Katana', 'Katana sanglant', { atk: 11 }], ['one_charm', 'Anti-Zombie Charm', 'Charme anti-zombie', { def: 5, hp: 45 }], ['one_scabbard', 'Quickdraw Scabbard', 'Fourreau degainage', { spd: 2, atk: 4 }]],
    event: ['evt_one_blood_rage', 'Blood Rage Combo', 'Combo rage sanglante', 'A katana rush hits all enemies and boosts slayers.', 'Une ruee de katana touche tous les ennemis et renforce les slayers.'],
    decor: { sky: ['#2c0810', '#050101'], floor: 'rgba(190, 25, 45, 0.2)', grid: 'rgba(255, 180, 100, 0.24)', motif: 'arena', accent: '#ffb464' }
  });
}
