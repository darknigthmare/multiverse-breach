// Land of the Dead — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'land_of_the_dead',
    universe: 'Land of the Dead',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Fiddlers Green Dead Reckoning Siege',
    boss: 'Kaufman Tower Evacuation',
    cast: [
      ['riley_denbo_lotd', 'Riley Denbo', 'tactical'],
      ['slack_lotd', 'Slack', 'slayer'],
      ['charlie_lotd', 'Charlie', 'marine']
    ],
    enemies: ['Fiddlers Green Raider', 'Adaptive Dead', 'River Horde'],
    bosses: ['Cholo Armored Raid', 'Big Daddy Horde Leader'],
    gear: [
      ['dead_reckoning', 'Dead Reckoning Targeter', 'Ciblage de Dead Reckoning'],
      ['skyflower', 'Skyflower Launcher', 'Lanceur de fleurs du ciel'],
      ['tower_pass', 'Fiddlers Green Pass', 'Laissez-passer de Fiddlers Green']
    ],
    event: ['dead_reckoning', 'Dead Reckoning Barrage', 'Barrage de Dead Reckoning', 'The armored vehicle marks a corridor and clears it with rockets before extraction.', 'Le vehicule blinde marque un couloir et le nettoie aux roquettes avant extraction.'],
    origin: ['The living hide behind class walls while Big Daddy leads increasingly aware dead toward Fiddlers Green.', 'Les vivants se cachent derriere des murs de classe tandis que Big Daddy mene des morts de plus en plus conscients vers Fiddlers Green.'],
    breach: ['the dead recognize portals as roads to freedom, forcing A.R.C.A. to negotiate movement rather than treating every corpse as an object.', 'les morts reconnaissent les portails comme des routes vers la liberte, obligeant A.R.C.A. a negocier leur passage plutot qu a traiter chaque corps comme un objet.'],
    motif: 'arcanecity',
    colors: ['#17201b', '#030403', '#8ea765']
  }));
}
