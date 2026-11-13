// System of a Down — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('john_dolmayan', 'John Dolmayan', 'tactical', '#566573', 'drums', 'Drumline Strike', 'Toxicity Tempo Lock', 'Rhythm Guard', 'Hypnotize Drum Break')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Toxicity Feedback Wave', 88, 13, 6, '#f1c40f', 'feedback'),
      monster('Prison Song Riot Line', 112, 14, 4, '#7d6608', 'riot_pressure'),
      monster('Chop Suey Tempo Break', 78, 15, 7, '#b03a2e', 'tempo_cut')
    ],
    bosses: [
      boss('B.Y.O.B. War Machine', 575, 23, 5, '#1c2833', 'war_machine', 'Blast-Off Party Break'),
      boss('Aerials Signal Tower', 540, 20, 6, '#7d6608', 'signal_wave', 'Sky Signal Collapse')
    ],
    worldBoss: boss('Toxicity Riot Core', 1260, 31, 5, '#b03a2e', 'chaotic_rhythm', 'Toxicity Breakdown')
  });
}
