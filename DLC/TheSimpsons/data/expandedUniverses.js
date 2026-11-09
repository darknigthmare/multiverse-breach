// The Simpsons — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['The Simpsons', 'evidence', ['Mr Burns Nuclear Scheme']]);
}

export function createExpandedUniverseRecord() {
  return ({
      key: 'simpsons',
      universe: 'The Simpsons',
      mediaType: 'series',
      faction: 'arcane',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Les Simpson',
      stage: 'Springfield Nuclear Gag Breach',
      boss: 'Mr Burns Reactor Scheme',
      hero: ['homer_simpson', 'Homer Simpson', 'horror'],
      allies: [['bart_simpson', 'Bart Simpson', 'slayer'], ['lisa_simpson', 'Lisa Simpson', 'hacker']],
      monsters: ['Itchy and Scratchy Bot', 'Springfield Power Mutant', 'Kang and Kodos Probe'],
      bosses: ['Mr Burns Nuclear Scheme', 'Sideshow Bob Revenge Plot'],
      gear: [['simpsons_donut', 'Homer s Emergency Donut', 'Donut d urgence de Homer', { hp: 80 }], ['simpsons_sax', 'Lisa s Baritone Sax', 'Saxophone baryton de Lisa', { atk: 7, spd: 2 }], ['simpsons_slingshot', 'Bart s Slingshot', 'Lance-pierre de Bart', { atk: 8, def: 3 }]],
      event: ['evt_simpsons_couch', 'Couch Gag Reset', 'Reinitialisation du gag du canape', 'The scene restarts with the family already in position, restoring allies while preserving mission progress.', 'La scene recommence avec la famille deja en place, restaure les allies tout en conservant la progression de mission.'],
      theme: 'Springfield satire, nuclear accidents, family chaos, and endless sitcom reality resets',
      motif: 'arcanecity',
      colors: ['#2e2b12', '#070603', '#ffd83d']
    });
}
