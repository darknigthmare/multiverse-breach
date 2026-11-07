// Doom Sweeper — Safe Apocalypse — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'doom_sweeper_safe', universe: 'Doom Sweeper — Safe Apocalypse', aliases: ['Doom Sweeper', '末日清理专家'],
    continuity: 'Paper Dog’s Doom Sweeper zombie-survival journey, stripped of all sexual material.',
    adaptationRule: 'Yamato and Roche are explicitly adults 20+ in fully opaque practical apocalypse clothing. No nudity, sexuality, pin-up framing or suggestive upgrades; only survival, scavenging and zombie containment.',
    visualAnchor: 'Bright 2D apocalypse roads, a battered second-hand military vehicle, airdrops and dense cartoon zombie swarms.',
    referenceUrl: 'https://store.steampowered.com/app/2162680/Doom_Sweeper/', referenceUrls: ['https://store.steampowered.com/app/2162680/Doom_Sweeper/'],
    heroes: [hero('yamato', 'Yamato', 'Adult 20+ woman in a fully closed green field jacket, cargo trousers, boots and protective gloves.', 'Service Rifle', 'Sweeper Barrage', { role: 'marine', prohibitedConcepts: ['nudity', 'sexualization', 'revealing clothing'] }), hero('roche', 'Roche', 'Adult 20+ man in a fully buttoned orange mechanic jacket, work trousers, boots and goggles.', 'Repair Wrench', 'Vehicle Overdrive', { role: 'tactical', prohibitedConcepts: ['nudity', 'sexualization'] }), hero('armored_van', 'Doom Sweeper Armored Van', 'Boxy second-hand olive military vehicle with welded plates, roof gun and cargo racks.', 'Roof Turret', 'Airdrop Beacon', { role: 'marine' })],
    enemies: [threat('walker', 'Zombie Walker', 'Cartoon undead adult in torn but non-graphic city clothing with slow gait.', 'Clumsy Swipe', 'Crowd Press'), threat('runner', 'Zombie Runner', 'Lean cartoon undead adult in damaged sportswear, with no gore.', 'Sprint Lunge', 'Flanking Rush'), threat('mutant_swarm', 'Mutant Insect Swarm', 'Cloud of oversized post-apocalyptic beetles with glowing green shells.', 'Swarm Bite', 'Screen Spread')],
    bosses: [threat('siege_brute', 'Siege Brute', 'Huge armored zombie silhouette behind welded road signs, without wounds or gore.', 'Barrier Slam', 'Debris Throw'), threat('armored_mutant', 'Armored Mutant', 'Broad nonsexual mutant in scavenged military plates and sealed helmet.', 'Armor Charge', 'Shockwave'), threat('horde_commander', 'Horde Commander', 'Tall signal-bearing mutant directing zombie lanes with a warning beacon.', 'Command Strike', 'Horde Muster')],
    worldBoss: threat('apocalypse_titan', 'Apocalypse Titan', 'Colossal fully armored mutant looming behind a ruined overpass and vehicle convoy.', 'Titan Stomp', 'Apocalypse Horde'),
    gear: [gear('sample_case', 'Zombie Sample Case', 'Sealed green scientific case with biohazard shape but no text.', { atk: 1, def: 4, spd: 0 }), gear('airdrop_radio', 'Airdrop Radio', 'Rugged orange field radio with folding antenna.', { atk: 2, def: 1, spd: 3 }), gear('vehicle_plate', 'Vehicle Armor Plate', 'Welded olive steel plate with bolt holes.', { atk: 0, def: 5, spd: 0 })],
    stages: [stage('Ruined Highway Sweep', 'Broken highway, abandoned cars and clean cartoon zombie lanes.'), stage('Airdrop Defence', 'Open roadside extraction circle around a descending military crate.'), stage('Titan Overpass', 'Collapsed overpass where the armored van circles a giant silhouette.')],
    event: event('twenty_minutes', 'Twenty-Minute Sweep', 'A visible sunset arc marks a timed salvage-and-survival route without suggestive material.')
  });
}
