// Unreal Tournament 2004 — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'unreal_tournament_2004', universe: 'Unreal Tournament 2004', aliases: ['UT2004', 'UT2K4', 'Unreal Tournament 2k4'],
    continuity: 'Epic Games Unreal Tournament 2004 Liandri Grand Tournament, distinct from Unreal Tournament 1999.',
    adaptationRule: 'Use UT2004 team biographies, armor families, weapons and arenas; do not merge UT99 models or the unfinished 2014 game.',
    visualAnchor: 'Bright 2004 sci-fi tournament arenas, chunky team armor, Liandri robots, Skaarj competitors and energy weapons.',
    referenceUrl: 'https://www.epicgames.com/unrealtournament/?lang=en-US', referenceUrls: ['https://www.epicgames.com/unrealtournament/?lang=en-US', 'https://unrealarchive.org/wikis/the-liandri-archives/Unreal_Tournament_2004.html'],
    heroes: [hero('gorge', 'Gorge', 'Massive bald Juggernaut champion in bulky red-and-silver tournament armor.', 'Flak Cannon', 'Juggernaut Charge', { role: 'marine' }), hero('sapphire', 'Sapphire', 'Adult woman Juggernaut in full blue-silver heavy armor with covered torso and limbs.', 'Shock Rifle', 'Shock Combo', { role: 'tactical' }), hero('frostbite', 'Frostbite', 'Masked Juggernaut in complete white-blue tournament armor with broad shoulder plates.', 'Rocket Launcher', 'Adrenaline Burst', { role: 'marine' })],
    enemies: [threat('skaarj_warrior', 'Skaarj Warrior', 'Muscular reptilian alien tournament fighter with plated limbs and twin wrist blades.', 'Razik Blades', 'Predator Leap'), threat('gen_mokai', 'Gen Mo’Kai Fighter', 'Lean horned alien athlete in orange-black segmented arena armor.', 'Link Gun', 'Wall Dodge'), threat('necris', 'Necris Combatant', 'Pale adult arena warrior in fully closed black nanoblack armor with blue markings.', 'Lightning Gun', 'Adrenaline Invisibility')],
    bosses: [threat('damarus', 'Damarus', 'Tall Gen Mo’Kai team leader with crown-like horns and gold-black armor.', 'Shock Rifle', 'Team Assault'), threat('clanlord', 'ClanLord', 'Huge Skaarj champion in red-black armor with imposing horns and wrist blades.', 'Blade Rush', 'Skaarj Roar'), threat('xan', 'Xan Kriegor', 'Tall gold-and-black Liandri combat android with narrow glowing faceplate.', 'Minigun', 'Liandri Overcharge')],
    worldBoss: threat('malcolm', 'Malcolm — Tournament Champion', 'Veteran Black adult champion in complete blue-white Thunder Crash armor, with original face not based on an actor.', 'Rocket Launcher', 'Champion Adrenaline', { prohibitedConcepts: ['actor likeness'] }),
    gear: [gear('shock_rifle', 'Shock Rifle', 'Long blue-gray energy rifle with glowing cyan emitter.', { atk: 4, def: 0, spd: 1 }), gear('redeemer', 'Redeemer', 'Large dark missile launcher with yellow hazard accents and no logo.', { atk: 6, def: 0, spd: 0 }), gear('double_damage', 'Double Damage Core', 'Floating purple energy amp in a compact mechanical frame.', { atk: 5, def: 0, spd: 1 })],
    stages: [stage('DM-Rankin', 'Rust-red industrial arena with ramps, brick halls and glowing pickups.'), stage('ONS-Torlan', 'Open green battlefield with linked power nodes and distant towers.'), stage('AS-Mothership', 'Skaarj mothership assault route from space approach to reactor core.')],
    event: event('grand_tournament', 'Liandri Grand Tournament', 'Arena brackets converge across Deathmatch, Onslaught and Assault battlegrounds without logos or UI.')
  });
}
