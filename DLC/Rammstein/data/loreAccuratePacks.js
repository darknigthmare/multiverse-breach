// Rammstein — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('oliver_riedel', 'Oliver Riedel', 'marine', '#3d3d3d', 'bass', 'Bassline Crush', 'Seemann Low-End Wave', 'Stage Rig Brace', 'Benzin Bass Detonation'),
    hero('christoph_schneider', 'Christoph Schneider', 'tactical', '#5c5c5c', 'drums', 'Industrial Drum Hit', 'Pounding Rhythm Break', 'Percussion Guard', 'Feuer Frei Drumline'),
    hero('flake_lorenz', 'Christian "Flake" Lorenz', 'hacker', '#8e44ad', 'keyboard', 'Synth Stab', 'Keyboard Treadmill Loop', 'Electronic Shield', 'Engel Keyboard Ascension')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Flame Projector Rig', 95, 14, 4, '#ff692d', 'pyro_burst'),
      monster('Industrial Spark Shower', 80, 12, 6, '#d35400', 'spark_wall'),
      monster('Stage Smoke Wall', 110, 10, 2, '#566573', 'smoke_choke')
    ],
    bosses: [
      boss('Mein Teil Butcher Table', 560, 22, 3, '#7b241c', 'cleaver_rig', 'Butcher Table Shock'),
      boss('Du Hast Pyro Wall', 590, 24, 4, '#ff4500', 'flame_wall', 'Du Hast Call And Response')
    ],
    worldBoss: boss('Engel Wings Pyro Rig', 1320, 33, 3, '#ffd166', 'pyro_wings', 'Engel Stadium Inferno')
  });
}
