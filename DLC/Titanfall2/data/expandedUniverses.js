// Titanfall 2 — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'titanfall_2',
    universe: 'Titanfall 2',
    mediaType: 'game',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Typhon Fold Weapon Rupture',
    boss: 'Ark-Powered Reaper Command',
    worldBoss: 'Fold Weapon Core',
    cast: [
      ['jack_cooper_tf2', 'Jack Cooper', 'marine'],
      ['bt_7274_tf2', 'BT-7274', 'tactical'],
      ['sarah_briggs_tf2', 'Sarah Briggs', 'hacker']
    ],
    enemies: ['IMC Rifleman', 'Spectre Squad', 'Reaper', 'Northstar Mercenary Titan'],
    bosses: ['Kane Scorch Titan', 'Viper Northstar Titan'],
    gear: [
      ['smart_pistol', 'Smart Pistol MK6', 'Pistolet intelligent MK6'],
      ['data_knife', 'Pilot Data Knife', 'Couteau de donnees de pilote'],
      ['sere_kit', 'SERE Kit', 'Kit SERE']
    ],
    event: ['protocol_three', 'Protocol 3: Protect the Pilot', 'Protocole 3 : proteger le pilote', 'BT intercepts lethal fire and launches the Pilot into a wall-run counterattack.', 'BT intercepte les tirs mortels et lance le pilote dans une contre-attaque murale.'],
    origin: ['Militia Rifleman Jack Cooper and Vanguard Titan BT-7274 fight the IMC around the Ark and the planet-killing Fold Weapon.', 'Le fusilier de la Milice Jack Cooper et le Titan Vanguard BT-7274 combattent l IMC autour de l Arche et de l arme Fold.'],
    breach: ['the Ark locks onto Mosaic City as a replacement coordinate, forcing Pilot and Titan to preserve Protocol 3 across unstable timelines.', 'l Arche verrouille la Cite-Mosaique comme coordonnee de remplacement, obligeant pilote et Titan a maintenir le Protocole 3 entre des chronologies instables.'],
    motif: 'facility',
    colors: ['#152631', '#030608', '#55d8ff'],
    stageVariants: [['Smash', 'Angel City Titanfall', 'Hard', 'Viper Northstar Titan']]
  }));
}
