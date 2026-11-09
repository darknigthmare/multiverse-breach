// Repo! The Genetic Opera — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Repo! The Genetic Opera', 'rescue', ['Zydrate Addict Echo']]);
}

export function createLegacyNonCombatTrialNameRoutes2() {
  return (['Repo! The Genetic Opera', 'switches', ['Surgical Drone']]);
}

export function createLegacyNonCombatTrialNameRoutes3() {
  return (['Repo! The Genetic Opera', 'evidence', ['Luigi Pavi Rotti Cell', 'Amber Sweet Stage']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Repo! The Genetic Opera',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'GeneCo Opera Breach',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'GeneCo Repo Opera',
    title: { en: 'Repo! The Genetic Opera', fr: 'Repo! The Genetic Opera' },
    desc: { en: 'Gothic biotech, organ debt, opera melodrama, and GeneCo repossession become a surgical breach.', fr: 'Biotech gothique, dette d organes, melodrame opera et saisie GeneCo deviennent une breche chirurgicale.' },
    hero: { id: 'shilo_repo', name: 'Shilo Wallace', cat: 'hacker', color: '#7f6ba8' },
    allies: [{ id: 'repo_man', name: 'Repo Man', cat: 'slayer', color: '#2b2b2b' }, { id: 'blind_mag', name: 'Blind Mag', cat: 'tactical', color: '#d4b1c8' }],
    monsters: ['GeneCo Guard', 'Zydrate Addict Echo', 'Surgical Drone'],
    bosses: ['Luigi Pavi Rotti Cell', 'Amber Sweet Stage'],
    worldBoss: 'GeneCo Repo Opera',
    gear: [['repo_zydrate', 'Zydrate Vial', 'Fiole Zydrate', { spd: 2, atk: 5 }], ['repo_scalpel', 'Repo Scalpel', 'Scalpel Repo', { atk: 10 }], ['repo_contract', 'Organ Contract', 'Contrat organe', { hp: 80, def: 3 }]],
    event: ['evt_repo_opera', 'Genetic Opera Crescendo', 'Crescendo Genetic Opera', 'A biotech aria damages enemies and heals surgical allies.', 'Une aria biotech blesse les ennemis et soigne les allies chirurgicaux.'],
    decor: { sky: ['#2b0f1d', '#060106'], floor: 'rgba(160, 32, 80, 0.18)', grid: 'rgba(220, 170, 210, 0.26)', motif: 'speaker', accent: '#dcaad2' }
  });
}
