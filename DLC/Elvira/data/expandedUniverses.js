// Elvira — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Elvira',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Macabre Mansion Stage',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Macabre Spellbook Coven',
    title: { en: 'Elvira', fr: 'Elvira' },
    desc: { en: 'Camp horror glamour, haunted mansions, witchcraft, and late-night host charisma become a gothic breach.', fr: 'Glamour camp horror, manoir hante, sorcellerie et charisme de presentatrice nocturne deviennent une breche gothique.' },
    hero: { id: 'elvira_mistress', name: 'Elvira', cat: 'horror', color: '#0f0f12' },
    allies: [{ id: 'gonk_elvira', name: 'Gonk Familiar', cat: 'hacker', color: '#7d3c98' }, { id: 'mansion_handyman', name: 'Macabre Handyman', cat: 'tactical', color: '#8b6f5a' }],
    monsters: ['Haunted Mansion Bat', 'Campy Ghoul', 'Spellbook Spark'],
    bosses: ['Uncle Vincent Curse', 'Town Morality Mob'],
    worldBoss: 'Macabre Spellbook Coven',
    gear: [['elvira_dagger', 'Macabre Dagger', 'Dague macabre', { atk: 9 }], ['elvira_spellbook', 'Spellbook Page', 'Page grimoire', { spd: 2, def: 4 }], ['elvira_necklace', 'Gothic Necklace', 'Collier gothique', { hp: 75 }]],
    event: ['evt_elvira_midnight', 'Midnight Horror Host', 'Hotesse horreur minuit', 'Elvira charms the lane and weakens undead enemies.', 'Elvira charme la ligne et affaiblit les morts-vivants.'],
    decor: { sky: ['#201126', '#050207'], floor: 'rgba(150, 65, 180, 0.16)', grid: 'rgba(230, 180, 255, 0.26)', motif: 'hauntedset', accent: '#e6b4ff' }
  });
}
