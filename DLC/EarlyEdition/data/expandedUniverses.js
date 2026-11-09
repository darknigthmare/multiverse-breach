// Early Edition — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Early Edition',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Tomorrow Newspaper Loop',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Deadline Paradox',
    title: { en: 'Early Edition', fr: 'Demain a la une' },
    desc: {
      en: 'A mysterious newspaper delivers tomorrow s disasters today, turning small choices into time-loop missions.',
      fr: 'Un journal mysterieux livre les catastrophes de demain et transforme les choix en missions temporelles.'
    },
    hero: { id: 'gary_hobson', name: 'Gary Hobson', cat: 'tactical', color: '#c49a5a' },
    allies: [
      { id: 'marissa_clark', name: 'Marissa Clark', cat: 'hacker', color: '#8e7cc3' },
      { id: 'chuck_fishman', name: 'Chuck Fishman', cat: 'slayer', color: '#e67e22' }
    ],
    monsters: ['Deadline Echo', 'Tomorrow Accident', 'Time Misprint'],
    bosses: ['Paradox Courier', 'Front Page Disaster'],
    worldBoss: 'Deadline Paradox',
    gear: [
      ['ee_tomorrow_paper', 'Tomorrow Paper', 'Journal de demain', { spd: 2, def: 5 }],
      ['ee_cat_bell', 'Orange Cat Bell', 'Clochette du chat', { hp: 60, spd: 1 }],
      ['ee_press_pass', 'Press Pass', 'Badge presse', { atk: 6, def: 5 }]
    ],
    event: ['evt_ee_front_page', 'Front Page Rewrite', 'Reecriture de une', 'Tomorrow s headline rewinds damage and reveals enemy intent.', 'La une de demain annule des degats et revele les intentions ennemies.'],
    decor: { sky: ['#2d2a20', '#070604'], floor: 'rgba(196, 154, 90, 0.18)', grid: 'rgba(245, 218, 135, 0.26)', motif: 'arcanecity', accent: '#f5da87' }
  });
}
