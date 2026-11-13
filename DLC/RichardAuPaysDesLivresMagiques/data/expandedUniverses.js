// Richard au pays des livres magiques — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Richard au pays des livres magiques',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Pagemaster Library Breach',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Library Storm Dragon',
    title: { en: 'The Pagemaster', fr: 'Richard au pays des livres magiques' },
    desc: { en: 'Books become worlds: adventure, fantasy, horror, and library storms fold into a readable Nexus breach.', fr: 'Les livres deviennent des mondes: aventure, fantasy, horreur et tempetes de bibliotheque se plient dans le Nexus.' },
    hero: { id: 'richard_pagemaster', name: 'Richard Tyler', cat: 'tactical', color: '#496da8' },
    allies: [{ id: 'adventure_book', name: 'Adventure', cat: 'slayer', color: '#c47b35' }, { id: 'fantasy_book', name: 'Fantasy', cat: 'hacker', color: '#b44cc4' }],
    monsters: ['Ink Pirate', 'Library Bat Swarm', 'Book Golem'],
    bosses: ['Horror Book Phantom', 'Pagemaster Trial'],
    worldBoss: 'Library Storm Dragon',
    gear: [['page_card', 'Library Card Relic', 'Carte de bibliotheque', { spd: 2, def: 4 }], ['page_bookmark', 'Magic Bookmark', 'Marque-page magique', { atk: 6, hp: 45 }], ['page_ink', 'Living Ink Bottle', 'Encre vivante', { atk: 8 }]],
    event: ['evt_page_story_shift', 'Story Shift', 'Changement de recit', 'The battlefield flips genre and weakens enemy resistances.', 'Le champ change de genre et affaiblit les resistances ennemies.'],
    decor: { sky: ['#2a1f3a', '#06030a'], floor: 'rgba(150, 98, 58, 0.18)', grid: 'rgba(216, 186, 110, 0.28)', motif: 'library', accent: '#d8ba6e' }
  });
}
