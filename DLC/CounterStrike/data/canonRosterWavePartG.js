// Counter-Strike — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat, trial }) {
  return ({
    key: 'counter_strike', universe: 'Counter-Strike', aliases: ['Counter Strike', 'Counter-Strike 2', 'CS2'],
    continuity: 'Valve Counter-Strike competitive defusal identity, using Counter-Strike 2 presentation and classic faction archetypes.',
    adaptationRule: 'No supervillains are invented: enemies and bosses are opposing training teams or objective scenarios; civilians and hostages are never targets.',
    visualAnchor: 'Realistic but original tactical operators, bombsites, utility smoke and clean Source 2 material language without logos or esports branding.',
    referenceUrl: 'https://www.counter-strike.net/home?l=english', referenceUrls: ['https://www.counter-strike.net/home?l=english', 'https://www.valvesoftware.com/en/about/'],
    heroes: [hero('sas', 'SAS Operator', 'Adult counter-terrorist in full navy tactical uniform, gas mask, helmet and body armor; original face concealed.', 'M4A1-S', 'Flashbang Entry', { role: 'tactical' }), hero('gign', 'GIGN Operator', 'Adult counter-terrorist in full blue armor, helmet, balaclava and compact rifle.', 'FAMAS', 'Defuse Cover', { role: 'marine' }), hero('fbi', 'FBI HRT Operator', 'Adult tactical agent in green-gray full-body gear, helmet and protective glasses.', 'M4A4', 'Smoke Retake', { role: 'tactical' })],
    enemies: [threat('phoenix', 'Phoenix Connexion Operator', 'Adult fictional opposing operator in full beige jacket, balaclava and protective gear.', 'AK-47', 'Bombsite Execute'), threat('elite_crew', 'Elite Crew Operator', 'Adult fictional opposing operator in dark jacket, scarf-mask and full trousers.', 'Galil AR', 'Molotov Denial'), threat('separatist', 'Separatist Operator', 'Adult fictional opposing operator in olive full clothing and covered face.', 'SG 553', 'Crossfire Hold')],
    bosses: [threat('awp_bot', 'Expert AWP Bot', 'Training automaton silhouette in neutral armor carrying a long sniper rifle.', 'AWP Hold', 'Angle Reposition'), threat('heavy_assault', 'Heavy Assault Training Unit', 'Armored training opponent with full helmet and reinforced vest.', 'Heavy Rifle', 'Armor Push'), threat('retake_squad', 'Bombsite Retake Squad', 'Three clearly robotic tactical training dummies advancing with smoke and flash utility.', 'Coordinated Rifles', 'Utility Retake')],
    worldBoss: trial('global_elite_final', 'Global Elite Defusal Final', 'Empty tournament bombsite with planted device, smoke lanes and a visible defuse route.', 'Defuse the planted device after clearing a timed tactical route.'),
    gear: [gear('defuse_kit', 'Defuse Kit', 'Small blue tactical tool pouch and wire cutters without labels.', { atk: 0, def: 3, spd: 3 }), gear('flashbang', 'Flashbang', 'Compact gray cylindrical diversion grenade.', { atk: 1, def: 1, spd: 4 }), gear('kevlar', 'Kevlar Vest', 'Plain dark tactical vest with no insignia.', { atk: 0, def: 5, spd: 0 })],
    stages: [stage('Dust II Bombsite A', 'Sunlit stone bombsite with crates, ramp and long approach, rebuilt without map signage.'), stage('Inferno Retake', 'Mediterranean courtyard and narrow lanes filled with tactical smoke.'), stage('Global Elite Defusal', 'Neutral competitive training arena with device timer and three approach lanes.', { nonCombat: true, objective: 'Reach and defuse the training device before its timer expires.' })],
    event: event('match_point', 'Match Point', 'A final-round defusal route reshuffles utility, cover and approach timing.')
  });
}
