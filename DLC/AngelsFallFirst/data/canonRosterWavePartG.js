// Angels Fall First — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'angels_fall_first', universe: 'Angels Fall First', aliases: ['AFF', 'Angel Fall First'],
    continuity: 'Strangely Interactive’s ULA-versus-AIA combined-arms war in Angels Fall First.',
    adaptationRule: 'Because the game uses player soldiers rather than named leads, the roster represents canonical ULA roles and AIA military platforms, never invented celebrities.',
    visualAnchor: 'Ground infantry, tracked armor, angular mechs, dropships and boardable capital ships across blue-gray future battlefields.',
    referenceUrl: 'https://store.steampowered.com/app/367270/Angels_Fall_First/', referenceUrls: ['https://store.steampowered.com/app/367270/Angels_Fall_First/'],
    heroes: [hero('ula_rifleman', 'ULA Rifleman', 'Fully helmeted United League infantry in blue-gray armor carrying a modular rifle.', 'ULA Rifle', 'Squad Grenade', { role: 'marine' }), hero('ula_pilot', 'ULA Pilot', 'Fully suited United League pilot with sealed visor and compact flight harness.', 'Pilot Sidearm', 'Sturm Gunship Run', { role: 'tactical' }), hero('ula_commander', 'ULA Fleet Commander', 'Adult commander in full navy field uniform and enclosed combat vest, carrying a command tablet.', 'Command Sidearm', 'Fleet Targeting', { role: 'tactical' })],
    enemies: [threat('aia_trooper', 'AIA Shock Trooper', 'Fully helmeted Antarean infantry in angular tan-black armor with battle rifle.', 'AIA Battle Rifle', 'Shock Advance'), threat('gheist', 'AIA Gheist Mech', 'Tall angular Antarean combat walker with paired arm weapons and dark cockpit.', 'Twin Cannons', 'Jump Jet Strike'), threat('interceptor', 'AIA Interceptor', 'Sharp-winged Antarean fighter with swept engines and paired nose guns.', 'Nose Cannons', 'High-Speed Pass')],
    bosses: [threat('dhaka', 'AIA Dhaka Tank', 'Broad Antarean main battle tank with low turret and heavy frontal armor.', 'Tank Cannon', 'Smoke Advance'), threat('destroyer', 'AIA Destroyer', 'Long angular capital escort covered in turrets and bright engine banks.', 'Turret Broadside', 'Fighter Screen'), threat('battleship', 'AIA Battleship', 'Enormous boardable warship with hangars, subsystems and armored command bridge.', 'Heavy Broadside', 'Boarding Counterattack')],
    worldBoss: threat('flagship', 'AIA Flagship Siege', 'Fleet-scale Antarean flagship surrounded by escorts, breach points and subsystem targets.', 'Flagship Batteries', 'Full Fleet Muster'),
    gear: [gear('ula_rifle', 'ULA Modular Rifle', 'Blue-gray future rifle with modular barrel and optic.', { atk: 4, def: 0, spd: 1 }), gear('breach_pod', 'Boarding Breach Pod', 'Compact armored pod with drilling nose and ULA-blue lights.', { atk: 2, def: 4, spd: 0 }), gear('vehicle_repair_tool', 'Vehicle Repair Tool', 'Handheld industrial welder with blue casing and orange sparks.', { atk: 0, def: 5, spd: 1 })],
    stages: [stage('Ground Incursion', 'Fortified valley objectives crossed by infantry, tanks and gunships.'), stage('Space Territories', 'Capital ships and fighter lanes around a fractured moon.'), stage('Flagship Boarding', 'Dropship breach leading through corridors to bridge and reactor subsystems.')],
    event: event('combined_arms', 'Combined-Arms Offensive', 'Ground objectives and orbital fleets align into one continuous operation.')
  });
}
