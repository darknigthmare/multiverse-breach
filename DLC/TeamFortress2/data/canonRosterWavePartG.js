// Team Fortress 2 — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'team_fortress_2', universe: 'Team Fortress 2', aliases: ['TF2', 'Mann vs. Machine'],
    continuity: 'Valve Team Fortress 2, specifically the RED mercenaries defending Mann Co. in Mann vs. Machine.',
    adaptationRule: 'Use the stylized 1960s mercenary shapes and blue-eyed robots; preserve class readability without Valve logos or copied promotional poses.',
    visualAnchor: 'Warm RED industrial bases opposed by cold blue-gray Mann vs. Machine robots and bomb tracks.',
    referenceUrl: 'https://wiki.teamfortress.com/wiki/Mann_vs._Machine',
    referenceUrls: ['https://wiki.teamfortress.com/wiki/Classes', 'https://wiki.teamfortress.com/wiki/Mann_vs._Machine', 'https://wiki.teamfortress.com/wiki/Robots'],
    heroes: [hero('scout', 'Scout', 'Lean young adult mercenary in red T-shirt, headset, dog tags and baseball cap, carrying a scattergun.', 'Scattergun', 'Bonk Flank', { role: 'slayer' }), hero('soldier', 'Soldier', 'Broad helmeted mercenary in red military coat with rocket launcher and grenades.', 'Rocket Launcher', 'Banner Charge', { role: 'marine' }), hero('medic', 'Medic', 'Tall doctor in white coat, red gloves and mechanical healing backpack, carrying Medi Gun.', 'Syringe Gun', 'ÜberCharge', { role: 'tactical' })],
    enemies: [threat('robot_scout', 'Robot Scout', 'Slim blue-eyed steel Scout replica with cap and scattergun.', 'Robot Scattergun', 'Bomb Sprint'), threat('robot_soldier', 'Robot Soldier', 'Blue-eyed steel Soldier replica with helmet and rocket launcher.', 'Robot Rockets', 'Bomb Advance'), threat('robot_heavy', 'Robot Heavy', 'Massive blue-eyed steel Heavy replica with rotary minigun.', 'Robot Minigun', 'Sustained Fire')],
    bosses: [threat('sentry_buster', 'Sentry Buster', 'Round bomb-bodied blue robot with long legs and spinning warning light.', 'Detonation', 'Engineer Pursuit'), threat('giant_demoman', 'Giant Demoman Robot', 'Oversized blue-eyed Demoman machine with grenade launcher and heavy armor.', 'Grenade Barrage', 'Giant Bomb Carry'), threat('tank_robot', 'Tank Robot', 'Huge tracked gray bomb carrier with glowing blue hatch and no crew.', 'Crushing Treads', 'Hatch Bomb')],
    worldBoss: threat('sergeant_crits', 'Sergeant Crits', 'Colossal steel Soldier robot with Tyrant helmet, yellow eyes and oversized rocket launcher.', 'Critical Rocket Storm', 'Regenerating Barrage'),
    gear: [gear('scattergun', 'Scattergun', 'Short lever-action scattergun with wooden grip.', { atk: 4, def: 0, spd: 2 }), gear('medi_gun', 'Medi Gun', 'White-red healing projector linked to a compact hose.', { atk: 0, def: 5, spd: 1 }), gear('canteen', 'Power Up Canteen', 'Small metal field canteen with blue energy cap.', { atk: 2, def: 3, spd: 1 })],
    stages: [stage('Mannworks Bomb Route', 'Desert factory yard with painted blue bomb arrows and RED hatch.'), stage('Rottenburg Gate', 'Old European village defenses, timber buildings and robot path.'), stage('Bigrock Final Wave', 'Rocky industrial canyon containing the final robot drop zone.')],
    event: event('machine_wave', 'Mann vs. Machine Final Wave', 'A blue robot carrier opens over a RED Mann Co. bomb route.')
  });
}
