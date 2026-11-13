// Cyberpunk — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'cyberpunk_2077',
    universe: 'Cyberpunk',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'Night City Mikoshi Breach',
    boss: 'Adam Smasher Blackwall Chassis',
    worldBoss: 'Blackwall Rogue AI',
    cast: [
      ['v_cyberpunk', 'V', 'hacker'],
      ['johnny_silverhand_cp', 'Johnny Silverhand', 'slayer'],
      ['panam_palmer_cp', 'Panam Palmer', 'tactical']
    ],
    enemies: ['Arasaka Elite', 'Maelstrom Cyberpsycho', 'NetWatch Agent', 'Blackwall Daemon'],
    bosses: ['Adam Smasher', 'Mikoshi Construct Swarm'],
    gear: [
      ['mantis_blades', 'Mantis Blades', 'Lames Mantis'],
      ['sandevistan', 'Sandevistan Implant', 'Implant Sandevistan'],
      ['relic_chip', 'Relic Biochip', 'Bio-puce Relic']
    ],
    event: ['blackwall', 'Blackwall Overclock', 'Surcharge du Blackwall', 'V breaches the local subnet and turns hostile cyberware against its owners.', 'V perce le sous-reseau local et retourne les cyberwares hostiles contre leurs porteurs.'],
    origin: ['Night City runs on corporations, mercenary contracts, invasive cyberware, braindances, and the lethal promise of becoming a legend.', 'Night City fonctionne par corporations, contrats de mercenaires, cyberwares invasifs, braindances et promesse mortelle de devenir une legende.'],
    breach: ['Mikoshi identifies Trame memories as engrams, while rogue AIs probe A.R.C.A. for a route around the Blackwall.', 'Mikoshi identifie les souvenirs de Trame comme des engrammes, tandis que des IA rebelles sondent A.R.C.A. pour contourner le Blackwall.'],
    motif: 'arcanecity',
    colors: ['#1f1530', '#030205', '#f5e642'],
    stageVariants: [['Tactics', 'Arasaka Tower Extraction', 'Very Hard', 'Adam Smasher']]
  }));
}
