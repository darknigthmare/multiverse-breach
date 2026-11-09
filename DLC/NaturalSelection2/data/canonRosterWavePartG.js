// Natural Selection 2 — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'natural_selection_2', universe: 'Natural Selection 2', aliases: ['NS2', 'Natural Selection II'],
    continuity: 'Unknown Worlds’ Frontiersmen versus Kharaa strategic multiplayer conflict.',
    adaptationRule: 'Maintain asymmetric FPS/RTS roles: named slots are battlefield classes rather than invented individuals.',
    visualAnchor: 'Dark industrial space facilities split between blue marine technology and orange organic infestation.',
    referenceUrl: 'https://www.krafton.com/en/games/natural-selection-2/', referenceUrls: ['https://www.krafton.com/en/games/natural-selection-2/', 'https://store.steampowered.com/app/4920/Natural_Selection_2/'],
    heroes: [hero('marine', 'Frontiersman Marine', 'Helmeted blue-gray space marine with rifle, shoulder lamp and compact armor.', 'Assault Rifle', 'Cluster Grenade', { role: 'marine' }), hero('jetpack_marine', 'Jetpack Marine', 'Light-armored marine suspended by a twin-thruster jetpack and carrying a shotgun.', 'Shotgun', 'Jetpack Strafe', { role: 'slayer' }), hero('exosuit', 'Exosuit Marine', 'Bulky bipedal blue-gray exoskeleton with enclosed cockpit and twin heavy guns.', 'Exosuit Miniguns', 'Armor Lock', { role: 'marine' })],
    enemies: [threat('skulk', 'Skulk', 'Low black-orange Kharaa quadruped with wide jaws and wall-clinging feet.', 'Bite', 'Wall Leap'), threat('gorge', 'Gorge', 'Stocky orange-brown builder lifeform with broad mouth and short legs.', 'Acid Spit', 'Hydra Construction'), threat('lerk', 'Lerk', 'Small pterosaur-like Kharaa with leathery wings and pointed head.', 'Spike Volley', 'Umbra Cloud')],
    bosses: [threat('fade', 'Fade', 'Tall black-and-orange Kharaa with long scythe forearms and narrow torso.', 'Scythe Slash', 'Blink Ambush'), threat('onos', 'Onos', 'Huge armored rhinoceros-like Kharaa with tusks and massive forelimbs.', 'Gore', 'Stomp'), threat('alien_commander', 'Kharaa Commander Assault', 'Organic hive command nexus projecting infestation tendrils and ability spores.', 'Hive Abilities', 'Lifeform Evolution')],
    worldBoss: threat('mature_hive', 'Mature Hive', 'Enormous pulsing orange hive rooted into walls by infestation and egg clusters.', 'Defensive Spawn', 'Infestation Overrun'),
    gear: [gear('pulse_grenade', 'Pulse Grenade', 'Blue cylindrical marine grenade with orange arming strip.', { atk: 3, def: 0, spd: 2 }), gear('welder', 'Marine Welder', 'Compact industrial repair torch with blue handle.', { atk: 1, def: 5, spd: 0 }), gear('onos_bone_shield', 'Onos Bone Plate', 'Heavy curved orange-black armor plate shed by an Onos.', { atk: 1, def: 5, spd: 0 })],
    stages: [stage('Tram Marine Start', 'Blue-lit command station, resource nozzle and branching metal corridors.'), stage('Ventilation Infestation', 'Narrow vents overtaken by glowing orange Kharaa tissue.'), stage('Hive Room', 'Vast organic chamber with eggs, cyst chains and central hive.')],
    event: event('resource_war', 'Resource Tower War', 'Marine extractors and Kharaa harvesters contest the same glowing resource nodes.')
  });
}
