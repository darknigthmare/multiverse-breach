// Expanded Enemies Database for 37 universes
// Includes 3 monsters, 2 bosses, and 1 local World Boss per universe, plus 1 Final Game Boss & obstacles

import { EXPANDED_ENEMIES_DB } from './expandedUniverses';
import { LORE_ACCURATE_ENEMY_EXPANSIONS } from './loreAccuratePacks';

export const ENEMIES_DB = {
  'Nexus de Convergence': {
    monsters: [
      { name: 'Echo Sans-Auteur', hp: 65, atk: 7, spd: 5, color: '#39c5bb', weapon: 'static_claws' },
      { name: 'Archiviste Rompu', hp: 82, atk: 8, spd: 4, color: '#d9b86b', weapon: 'index_blade' },
      { name: 'Noeud de Paradoxe', hp: 95, atk: 10, spd: 3, color: '#9b59b6', weapon: 'rift_burst' },
      { name: 'Fragment Vagabond', hp: 58, atk: 11, spd: 7, color: '#ff5b6e', weapon: 'shard_dash' },
      { name: 'Drone A.R.C.A. Corrompu', hp: 105, atk: 12, spd: 4, color: '#7df9ff', weapon: 'signal_beam' }
    ],
    bosses: [
      { name: 'Greffier du Voile', hp: 360, atk: 16, spd: 4, color: '#39c5bb', weapon: 'seal_staff', special: 'Tampon de Reecriture' },
      { name: 'Juge des Trames', hp: 420, atk: 18, spd: 3, color: '#d9b86b', weapon: 'verdict_halberd', special: 'Sentence de Continuite' },
      { name: 'Avatar du Sans-Auteur', hp: 470, atk: 19, spd: 5, color: '#ff5b6e', weapon: 'meta_claw', special: 'Rature de Destin' }
    ],
    worldBoss: { name: 'Moteur de Convergence Instable', hp: 1150, atk: 27, spd: 3, color: '#7df9ff', weapon: 'nexus_lance', special: 'Compression des Mille Portails' }
  },
  'Gears of War': {
    monsters: [
      { name: 'Locust Drone', hp: 90, atk: 9, spd: 4, color: '#6e7a68', weapon: 'gun' },
      { name: 'Locust Wretch', hp: 70, atk: 11, spd: 6, color: '#535c50', weapon: 'claws' },
      { name: 'Explosive Ticker', hp: 50, atk: 16, spd: 8, color: '#cca43b', weapon: 'suicide' }
    ],
    bosses: [
      { name: 'General RAAM', hp: 450, atk: 18, spd: 3, color: '#3c4238', weapon: 'kryll', special: 'Kryll Swarm' },
      { name: 'High Priest Skorge', hp: 420, atk: 19, spd: 4, color: '#4a3f35', weapon: 'staff', special: 'Chainsaw Staff Slice' }
    ],
    worldBoss: { name: 'Gargantuan Brumak', hp: 1200, atk: 28, spd: 2, color: '#272d24', weapon: 'rockets', special: 'Back-Mounted Rocket Barrage' }
  },
  'Halo': {
    monsters: [
      { name: 'Covenant Grunt', hp: 70, atk: 7, spd: 5, color: '#33527a', weapon: 'plasma_pistol' },
      { name: 'Jackal Sniper', hp: 80, atk: 11, spd: 6, color: '#e67e22', weapon: 'beam_rifle' },
      { name: 'Elite Minor', hp: 110, atk: 10, spd: 5, color: '#2ecc71', weapon: 'plasma_rifle' },
      { name: 'Forerunner Sentinel', hp: 90, atk: 12, spd: 7, color: '#7fd7ff', weapon: 'sentinel_beam' },
      { name: 'Flood Combat Form', hp: 120, atk: 13, spd: 5, color: '#8d7b46', weapon: 'infected_claws' }
    ],
    bosses: [
      { name: 'Brute Chieftain Tartarus', hp: 500, atk: 20, spd: 4, color: '#595045', weapon: 'gravity_hammer', special: 'Fist of Rukt Slam' },
      { name: 'Prophet of Regret', hp: 440, atk: 17, spd: 5, color: '#cca43b', weapon: 'gravity_throne', special: 'Gravity Throne Laser' },
      { name: '343 Guilty Spark Fragment', hp: 470, atk: 18, spd: 6, color: '#9fdfff', weapon: 'monitor_beam', special: 'Containment Protocol' }
    ],
    worldBoss: { name: 'Covenant Scarab Mech', hp: 1300, atk: 30, spd: 2, color: '#2c1f30', weapon: 'focus_cannon', special: 'Ultra-Focus Plasma Beam' }
  },
  'Alien': {
    monsters: [
      { name: 'Xenomorph Drone', hp: 80, atk: 12, spd: 6, color: '#1a1d24', weapon: 'tail' },
      { name: 'Skittering Facehugger', hp: 40, atk: 14, spd: 8, color: '#d2b48c', weapon: 'grab' },
      { name: 'Runner Alien', hp: 75, atk: 10, spd: 7, color: '#2c3539', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Alien Queen', hp: 600, atk: 22, spd: 5, color: '#090b0e', weapon: 'claws', special: 'Acid Spit Torrent' },
      { name: 'Xenomorph Praetorian', hp: 500, atk: 19, spd: 4, color: '#111317', weapon: 'tail', special: 'Tail Impale Sweep' }
    ],
    worldBoss: { name: 'Predalien Monstrosity', hp: 1250, atk: 29, spd: 5, color: '#302f26', weapon: 'claws', special: 'Mouth Inner-Jaw Strike' }
  },
  'Predator': {
    monsters: [
      { name: 'Jungle Predator Scout', hp: 95, atk: 11, spd: 5, color: '#5a544c', weapon: 'wristblade' },
      { name: 'Cloaked Stalker Scout', hp: 80, atk: 13, spd: 6, color: '#688e7a', weapon: 'laser' },
      { name: 'Predator Hound', hp: 70, atk: 12, spd: 7, color: '#4a4239', weapon: 'bite' }
    ],
    bosses: [
      { name: 'City Hunter Predator', hp: 480, atk: 20, spd: 5, color: '#524940', weapon: 'smart_disc', special: 'Smart Disc Throw' },
      { name: 'Berserker Predator', hp: 540, atk: 23, spd: 5, color: '#661b1b', weapon: 'wristblade', special: 'Berserk Rage Slash' }
    ],
    worldBoss: { name: 'Bad Blood Alpha Predator', hp: 1320, atk: 32, spd: 4, color: '#1c1c1c', weapon: 'spear', special: 'Plasma Gauntlet Overload' }
  },
  'Resident Evil': {
    monsters: [
      { name: 'T-Virus Zombie', hp: 70, atk: 8, spd: 3, color: '#7d6608', weapon: 'bite' },
      { name: 'Zombie Dog (Cerberus)', hp: 60, atk: 10, spd: 6, color: '#4a3f35', weapon: 'bite' },
      { name: 'Ceiling-Clinging Licker', hp: 90, atk: 12, spd: 6, color: '#900c3f', weapon: 'tongue' },
      { name: 'Hunter Beta', hp: 115, atk: 14, spd: 6, color: '#315c31', weapon: 'claws' },
      { name: 'G-Embryo Mutant', hp: 105, atk: 13, spd: 4, color: '#a04a2b', weapon: 'mutation_burst' }
    ],
    bosses: [
      { name: 'Nemesis T-Type', hp: 600, atk: 24, spd: 4, color: '#2c3539', weapon: 'rocket_launcher', special: 'Tentacle Bind Slam' },
      { name: 'Albert Wesker', hp: 520, atk: 21, spd: 8, color: '#1a1a1a', weapon: 'gun', special: 'Uroboros Dash Strike' },
      { name: 'Mr. X T-00 Tyrant', hp: 560, atk: 22, spd: 3, color: '#30333a', weapon: 'crushing_fist', special: 'Stalker Door Breach' }
    ],
    worldBoss: { name: 'William Birkin G-Stage 4', hp: 1400, atk: 33, spd: 4, color: '#5c2018', weapon: 'claws', special: 'G-Virus Mutation Cascade' }
  },
  'Silent Hill': {
    monsters: [
      { name: 'Lying Figure Spitter', hp: 75, atk: 9, spd: 4, color: '#bb8f8f', weapon: 'acid_breath' },
      { name: 'Bubble Head Nurse', hp: 90, atk: 11, spd: 5, color: '#e0d3bf', weapon: 'rust_pipe' },
      { name: 'Grey Child Memory', hp: 65, atk: 8, spd: 6, color: '#5a5d64', weapon: 'knife_swarm' },
      { name: 'Mannequin Twitcher', hp: 85, atk: 10, spd: 5, color: '#b48a78', weapon: 'leg_snap' },
      { name: 'Otherworld Crawler', hp: 105, atk: 13, spd: 4, color: '#6b2d24', weapon: 'rust_claws' }
    ],
    bosses: [
      { name: 'Pyramid Head Executioner', hp: 650, atk: 22, spd: 2, color: '#5c1e18', weapon: 'great_knife', special: 'Great Knife Sentence' },
      { name: 'Abstract Daddy Demon', hp: 520, atk: 18, spd: 3, color: '#7a6860', weapon: 'flesh_wall', special: 'Memory Room Crush' },
      { name: 'Claudia Order Prophet', hp: 500, atk: 17, spd: 4, color: '#8d7b60', weapon: 'ritual_word', special: 'God-Birth Invocation' }
    ],
    worldBoss: { name: 'God of the Otherworld Core', hp: 1400, atk: 32, spd: 3, color: '#3b0000', weapon: 'rust_fire', special: 'Siren Apocalypse Birth' }
  },
  'Dino Crisis': {
    monsters: [
      { name: 'Ibis Island Velociraptor', hp: 85, atk: 11, spd: 7, color: '#3d5c3d', weapon: 'pack_bite' },
      { name: 'Pteranodon Facility Diver', hp: 65, atk: 9, spd: 8, color: '#7d6608', weapon: 'dive' },
      { name: 'Oviraptor Poison Spitter', hp: 75, atk: 9, spd: 6, color: '#884ea0', weapon: 'poison_spit' },
      { name: 'Compsognathus Swarm', hp: 55, atk: 7, spd: 8, color: '#6f8f45', weapon: 'swarm_bite' },
      { name: 'Third Energy Raptor Alpha', hp: 120, atk: 14, spd: 7, color: '#1f5f43', weapon: 'temporal_claw' }
    ],
    bosses: [
      { name: 'Tyrannosaurus Pursuer', hp: 640, atk: 24, spd: 4, color: '#3a1a18', weapon: 'jaw_crush', special: 'Facility Wall Breach' },
      { name: 'Giganotosaurus Edward City', hp: 680, atk: 25, spd: 4, color: '#273746', weapon: 'bite', special: 'Earth-Shaking Trample' },
      { name: 'Therizinosaurus Slasher', hp: 500, atk: 19, spd: 5, color: '#7f5a58', weapon: 'claws', special: 'Frenzy Claw Shred' }
    ],
    worldBoss: { name: 'Third Energy Tyrant Rex', hp: 1450, atk: 34, spd: 4, color: '#3a1a18', weapon: 'temporal_bite', special: 'Chronal Roar and Crushing Bite' }
  },
  'The Matrix': {
    monsters: [
      { name: 'System Security SWAT', hp: 80, atk: 9, spd: 5, color: '#2b2b2b', weapon: 'gun' },
      { name: 'Rogue Exiles Cyber-Program', hp: 85, atk: 11, spd: 6, color: '#27ae60', weapon: 'blade' },
      { name: 'Sentinel Squid Drone', hp: 95, atk: 12, spd: 6, color: '#7f8c8d', weapon: 'laser' }
    ],
    bosses: [
      { name: 'Agent Smith Clone', hp: 580, atk: 21, spd: 7, color: '#1a1d24', weapon: 'gun', special: 'System Rewrite Punch' },
      { name: 'Agent Jones Squad', hp: 480, atk: 17, spd: 7, color: '#2b2c30', weapon: 'gun', special: 'Perfect Dodge Protocol' }
    ],
    worldBoss: { name: 'Deus Ex Machina Core', hp: 1420, atk: 34, spd: 3, color: '#09080d', weapon: 'laser', special: 'Omniverse Glitch Beam' }
  },
  'Stargate': {
    monsters: [
      { name: 'Jaffa Serpent Guard', hp: 95, atk: 9, spd: 4, color: '#f1c40f', weapon: 'staff' },
      { name: 'Replicator Insect Drone', hp: 60, atk: 12, spd: 7, color: '#95a5a6', weapon: 'bite' },
      { name: 'Anubis Jaffa Guard', hp: 100, atk: 10, spd: 4, color: '#2c3e50', weapon: 'staff_cannon' },
      { name: 'Kull Warrior Prototype', hp: 135, atk: 14, spd: 4, color: '#1f1f24', weapon: 'kull_blaster' },
      { name: 'Ashrak Assassin', hp: 85, atk: 15, spd: 7, color: '#6d4c41', weapon: 'stealth_blade' }
    ],
    bosses: [
      { name: 'Lord Apophis Goa\'uld', hp: 500, atk: 18, spd: 5, color: '#d4af37', weapon: 'hand_ribbon', special: 'Shield Barrier Blast' },
      { name: 'Ba\'al Clone Commander', hp: 470, atk: 17, spd: 6, color: '#a04000', weapon: 'goauld_device', special: 'Clone Command Loop' },
      { name: 'Replicator Queen Node', hp: 540, atk: 20, spd: 5, color: '#b8c0c8', weapon: 'nanite_swarm', special: 'Self-Assembly Flood' }
    ],
    worldBoss: { name: 'Anubis Flagship Nexus', hp: 1290, atk: 30, spd: 3, color: '#0b162a', weapon: 'ancient_beam', special: 'Ascended Hyperspace Weapon Array' }
  },
  'Half-Life': {
    monsters: [
      { name: 'Leaping Headcrab Zombie', hp: 70, atk: 8, spd: 4, color: '#8d6e63', weapon: 'claws' },
      { name: 'Combine Overwatch Soldier', hp: 85, atk: 10, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Acid-Spitting Bullsquid', hp: 90, atk: 11, spd: 5, color: '#d35400', weapon: 'acid' },
      { name: 'Vortigaunt Shock Trooper', hp: 105, atk: 13, spd: 5, color: '#6f8f4f', weapon: 'vortessence' },
      { name: 'Race X Shock Trooper', hp: 115, atk: 14, spd: 4, color: '#6b4b8a', weapon: 'spore_launcher' }
    ],
    bosses: [
      { name: 'Combine Gunship', hp: 560, atk: 20, spd: 5, color: '#424949', weapon: 'laser', special: 'Pulse Cannon Barrage' },
      { name: 'Alien Nihilanth Core', hp: 520, atk: 19, spd: 3, color: '#cca43b', weapon: 'portal_psionics', special: 'Portal Ring Strike' },
      { name: 'Gonarch Brood Mother', hp: 540, atk: 21, spd: 4, color: '#d6b36a', weapon: 'headcrab_brood', special: 'Headcrab Swarm Birth' }
    ],
    worldBoss: { name: 'Combine Strider Heavy', hp: 1350, atk: 33, spd: 3, color: '#2c3e50', weapon: 'warp_cannon', special: 'Dark Energy Impale' }
  },
  'Portal': {
    monsters: [
      { name: 'Aperture Security Turret', hp: 60, atk: 10, spd: 5, color: '#ececec', weapon: 'gun' },
      { name: 'Defective Red Eye Turret', hp: 50, atk: 13, spd: 5, color: '#c0392b', weapon: 'shoot' },
      { name: 'Sentry Drone Sphere', hp: 75, atk: 9, spd: 7, color: '#7f8c8d', weapon: 'tackle' }
    ],
    bosses: [
      { name: 'Wheatley Central AI', hp: 510, atk: 18, spd: 6, color: '#2980b9', weapon: 'bombs', special: 'Portal Loop Crush' },
      { name: 'Neurotoxin Vent System', hp: 440, atk: 16, spd: 4, color: '#27ae60', weapon: 'poison', special: 'Choking Gas Cascade' }
    ],
    worldBoss: { name: 'GLaDOS Central Core', hp: 1300, atk: 29, spd: 4, color: '#1a1a1a', weapon: 'rocket', special: 'Neurotoxin & Robotic Claw Smash' }
  },
  'Metal Gear': {
    monsters: [
      { name: 'Genome Soldier Patrol', hp: 80, atk: 8, spd: 5, color: '#7f8c8d', weapon: 'gun' },
      { name: 'Cyborg Ninja Drone', hp: 75, atk: 13, spd: 8, color: '#2c3e50', weapon: 'sword' },
      { name: 'Overwatch Gurlukovich Soldier', hp: 85, atk: 10, spd: 5, color: '#212f3d', weapon: 'gun' }
    ],
    bosses: [
      { name: 'Liquid Snake', hp: 550, atk: 19, spd: 6, color: '#7f5c38', weapon: 'fists', special: 'Hind D Gunship Support' },
      { name: 'Revolver Ocelot Champion', hp: 480, atk: 18, spd: 7, color: '#7b7d7d', weapon: 'gun', special: 'Six-Shot Ricochet Bullet' }
    ],
    worldBoss: { name: 'Metal Gear RAY Goliath', hp: 1400, atk: 33, spd: 3, color: '#17202a', weapon: 'missiles', special: 'Water Jet Cutter Cannon' }
  },
  'Payday': {
    monsters: [
      { name: 'Police Blue Swat Force', hp: 75, atk: 7, spd: 5, color: '#2980b9', weapon: 'gun' },
      { name: 'Shield Heavy Swat', hp: 110, atk: 8, spd: 4, color: '#7f8c8d', weapon: 'shield_bash' },
      { name: 'Cloaker Sneaker', hp: 60, atk: 14, spd: 8, color: '#111317', weapon: 'kick' }
    ],
    bosses: [
      { name: 'Heavy Bulldozer', hp: 600, atk: 22, spd: 3, color: '#27ae60', weapon: 'shotgun', special: 'Armor Charge Slam' },
      { name: 'Taser Spec-Ops Force', hp: 440, atk: 15, spd: 6, color: '#2980b9', weapon: 'taser', special: 'Stun Lock Electroshock' }
    ],
    worldBoss: { name: 'SWAT Armored Turret Van', hp: 1250, atk: 28, spd: 4, color: '#34495e', weapon: 'bullet_spray', special: 'Laser Target Gatling Storm' }
  },
  'Vocaloid': {
    monsters: [
      { name: 'Synth Hologram Spawn', hp: 70, atk: 9, spd: 7, color: '#e0007a', weapon: 'sound' },
      { name: 'Note Sprite Dancer', hp: 60, atk: 8, spd: 8, color: '#39c5bb', weapon: 'laser' },
      { name: 'Digital Music Cube', hp: 90, atk: 10, spd: 5, color: '#9b59b6', weapon: 'bash' }
    ],
    bosses: [
      { name: 'Dark Melancholy Diva', hp: 480, atk: 18, spd: 7, color: '#8e44ad', weapon: 'music', special: 'Melancholy Screaming Note' },
      { name: 'Hologram glitch core', hp: 450, atk: 16, spd: 8, color: '#2ecc71', weapon: 'glitch', special: 'Hologram Fragmentation' }
    ],
    worldBoss: { name: 'Shibuya Gigantic Stage Core', hp: 1200, atk: 27, spd: 5, color: '#240a1d', weapon: 'speaker', special: 'Deafening Mega-Concert Pulse' }
  },
  'Yu-Gi-Oh': {
    monsters: [
      { name: 'Kuriboh Shield', hp: 50, atk: 4, spd: 6, color: '#795548', weapon: 'bash' },
      { name: 'Celtic Guardian Warrior', hp: 90, atk: 11, spd: 5, color: '#27ae60', weapon: 'sword' },
      { name: 'Red-Eyes Baby Dragon', hp: 80, atk: 12, spd: 6, color: '#17202a', weapon: 'fire' }
    ],
    bosses: [
      { name: 'Blue-Eyes White Dragon', hp: 620, atk: 23, spd: 5, color: '#d9e8fb', weapon: 'beam', special: 'Burst Stream of Destruction' },
      { name: 'Dark Magician Shadow', hp: 500, atk: 19, spd: 6, color: '#2a1a5e', weapon: 'magic', special: 'Dark Magic Attack Blast' }
    ],
    worldBoss: { name: 'Obelisk The Tormentor God', hp: 1500, atk: 35, spd: 4, color: '#1b4f72', weapon: 'fists', special: 'Fist of Fate Infinite Smash' }
  },
  'Guilty Gear': {
    monsters: [
      { name: 'Holy Order Squire', hp: 85, atk: 10, spd: 5, color: '#f39c12', weapon: 'sword' },
      { name: 'Automaton Robo-Ky Drone', hp: 80, atk: 11, spd: 6, color: '#95a5a6', weapon: 'laser' },
      { name: 'Leaping Gear Beast', hp: 100, atk: 12, spd: 6, color: '#922b21', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Justice (Slayer Gear)', hp: 600, atk: 22, spd: 6, color: '#2c3e50', weapon: 'laser', special: 'Imperial Ray Blast' },
      { name: 'Testament Reaper Agent', hp: 490, atk: 18, spd: 5, color: '#17202a', weapon: 'scythe', special: 'Nightmare Circle Poison Scythe' }
    ],
    worldBoss: { name: 'Megadeath Class Gear', hp: 1400, atk: 32, spd: 3, color: '#78281f', weapon: 'laser', special: 'Giga-Laser Overdrive Sweep' }
  },
  'BlazBlue': {
    monsters: [
      { name: 'Murakumo Unit Drone', hp: 85, atk: 11, spd: 6, color: '#95a5a6', weapon: 'laser' },
      { name: 'Sector Seven Soldier', hp: 95, atk: 9, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Boundary Beast Spawn', hp: 70, atk: 13, spd: 7, color: '#4a148c', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Nu-13 Sword Unit', hp: 580, atk: 21, spd: 7, color: '#16a085', weapon: 'swords', special: 'Calamity Trigger Sword Barrage' },
      { name: 'Hazama Evil Agent', hp: 500, atk: 19, spd: 8, color: '#1e8449', weapon: 'knives', special: 'Eternal Coils Serpent Strike' }
    ],
    worldBoss: { name: 'Sword Core Mu-12', hp: 1280, atk: 30, spd: 6, color: '#1a5276', weapon: 'swords', special: 'Ouroboros Rift Destruction' }
  },
  'Slender Man': {
    monsters: [
      { name: 'Mindless Proxy Agent', hp: 75, atk: 9, spd: 6, color: '#34495e', weapon: 'melee' },
      { name: 'Flickering Shadow Ghoul', hp: 65, atk: 11, spd: 7, color: '#17202a', weapon: 'claws' },
      { name: 'Static Ghost Child', hp: 55, atk: 8, spd: 5, color: '#ececec', weapon: 'touch' }
    ],
    bosses: [
      { name: 'Slender Man Stalker', hp: 520, atk: 18, spd: 5, color: '#000000', weapon: 'tendrils', special: 'Static Blur Blindness' },
      { name: 'The Observer Phantom', hp: 440, atk: 15, spd: 6, color: '#2e4053', weapon: 'claws', special: 'Camera Static Flash' }
    ],
    worldBoss: { name: 'Slender Woods Nexus Core', hp: 1150, atk: 26, spd: 4, color: '#1c2833', weapon: 'fear', special: 'Dimensional Static Obliteration' }
  },
  'Chucky': {
    monsters: [
      { name: 'Evil Toy Soldier Patrol', hp: 65, atk: 8, spd: 5, color: '#e74c3c', weapon: 'gun' },
      { name: 'Cursed Stitched Doll', hp: 80, atk: 10, spd: 6, color: '#cca43b', weapon: 'bite' },
      { name: 'Voodoo Doll Puppet', hp: 50, atk: 12, spd: 7, color: '#7f5a38', weapon: 'zap' }
    ],
    bosses: [
      { name: 'Chucky Doll Killer', hp: 400, atk: 17, spd: 7, color: '#f1c40f', weapon: 'knife', special: 'Voodoo Damballa Curse Fire' },
      { name: 'Tiffany Doll Bride', hp: 380, atk: 15, spd: 7, color: '#ececec', weapon: 'knife', special: 'Aerosol Spray Fire Blast' }
    ],
    worldBoss: { name: 'Play Pals Assembly Core', hp: 1100, atk: 25, spd: 4, color: '#2c3e50', weapon: 'machinery', special: 'Unleash Defective Toy Swarm' }
  },
  'Hellraiser': {
    monsters: [
      { name: 'Chatterer Cenobite Guard', hp: 85, atk: 10, spd: 4, color: '#7f8c8d', weapon: 'claws' },
      { name: 'Butterball Cenobite', hp: 120, atk: 8, spd: 3, color: '#5d5d5d', weapon: 'cleaver' },
      { name: 'Female Cenobite Sister', hp: 80, atk: 11, spd: 5, color: '#8e44ad', weapon: 'needles' }
    ],
    bosses: [
      { name: 'Pinhead Cenobite Leader', hp: 580, atk: 22, spd: 3, color: '#2c3e50', weapon: 'chains', special: 'Tear Your Soul Apart Chains' },
      { name: 'The Engineer Beast', hp: 640, atk: 20, spd: 5, color: '#1a0505', weapon: 'jaws', special: 'Crushing Maw Bite Charge' }
    ],
    worldBoss: { name: 'Leviathan Diamond God', hp: 1450, atk: 34, spd: 2, color: '#000000', weapon: 'darkness', special: 'Labyrinth Labyrinth Dark Beam' }
  },
  'Mass Effect': {
    monsters: [
      { name: 'Reaper Husk Ghoul', hp: 70, atk: 9, spd: 6, color: '#8e44ad', weapon: 'melee' },
      { name: 'Collector Drone Soldier', hp: 85, atk: 11, spd: 5, color: '#e59866', weapon: 'laser' },
      { name: 'Geth Trooper Robot', hp: 95, atk: 10, spd: 5, color: '#34495e', weapon: 'plasma_rifle' }
    ],
    bosses: [
      { name: 'Sovereign Reaper Vanguard', hp: 650, atk: 23, spd: 4, color: '#2c3e50', weapon: 'beam', special: 'Red Indoctrination Ray' },
      { name: 'Saren Arterius Corrupted', hp: 520, atk: 19, spd: 6, color: '#7f8c8d', weapon: 'gun', special: 'Geth Glider Board Sweep' }
    ],
    worldBoss: { name: 'Human-Reaper Larva Node', hp: 1380, atk: 32, spd: 3, color: '#d35400', weapon: 'shockwave', special: 'Biotic Singularity Explosion' }
  },
  'Fallout': {
    monsters: [
      { name: 'Viper Gang Raider', hp: 75, atk: 8, spd: 5, color: '#d35400', weapon: 'gun' },
      { name: 'Glowing Feral Ghoul', hp: 70, atk: 10, spd: 6, color: '#2ecc71', weapon: 'rad_claws' },
      { name: 'Super Mutant Enforcer', hp: 120, atk: 11, spd: 4, color: '#52be80', weapon: 'club' }
    ],
    bosses: [
      { name: 'Alpha Deathclaw Beast', hp: 600, atk: 24, spd: 6, color: '#3e2723', weapon: 'claws', special: 'Bone-Shattering Tackle' },
      { name: 'Legate Lanius General', hp: 550, atk: 21, spd: 5, color: '#cca43b', weapon: 'greatsword', special: 'Blade of the East Slice' }
    ],
    worldBoss: { name: 'Rogue Liberty Prime Mech', hp: 1500, atk: 35, spd: 3, color: '#7f8c8d', weapon: 'laser', special: 'Tactical Nuke Throw Strike' }
  },
  'Doom': {
    monsters: [
      { name: 'Imp Fireball Thrower', hp: 70, atk: 10, spd: 5, color: '#d35400', weapon: 'fire' },
      { name: 'Possessed Combat Soldier', hp: 85, atk: 9, spd: 5, color: '#2ecc71', weapon: 'shotgun' },
      { name: 'Leaping Pinky Demon', hp: 110, atk: 12, spd: 6, color: '#e74c3c', weapon: 'charge' }
    ],
    bosses: [
      { name: 'Cyberdemon Lord', hp: 750, atk: 26, spd: 4, color: '#5d4037', weapon: 'rocket_launcher', special: 'Tyrant Rocket Storm' },
      { name: 'Spider Mastermind Mother', hp: 680, atk: 22, spd: 4, color: '#7f8c8d', weapon: 'plasma', special: 'Plasma Pulse Ring' }
    ],
    worldBoss: { name: 'Icon Of Sin Titan', hp: 1600, atk: 38, spd: 3, color: '#3e2723', weapon: 'fists', special: 'Apocalyptic Fire Breath' }
  },
  'Unreal': {
    monsters: [
      { name: 'Skaarj Scout Warrior', hp: 85, atk: 10, spd: 6, color: '#27ae60', weapon: 'claws' },
      { name: 'Krall Staff Soldier', hp: 95, atk: 11, spd: 5, color: '#cca43b', weapon: 'staff' },
      { name: 'Flying Gasbag Spitter', hp: 60, atk: 9, spd: 5, color: '#d35400', weapon: 'fire' }
    ],
    bosses: [
      { name: 'Xan Kriegor Champion', hp: 620, atk: 22, spd: 6, color: '#34495e', weapon: 'rocket', special: 'Redeemer shockwave' },
      { name: 'Malcolm Team Leader', hp: 580, atk: 20, spd: 6, color: '#2980b9', weapon: 'rifle', special: 'Flak Cannon Blast Burst' }
    ],
    worldBoss: { name: 'Skaarj Warlord Overlord', hp: 1300, atk: 30, spd: 5, color: '#1e8449', weapon: 'rocket_launcher', special: 'Seeking Missiles Salvo' }
  },

  // --- NEW 13 UNIVERSES DATABASE ---
  'Harry Potter': {
    monsters: [
      { name: 'Cornish Pixie', hp: 60, atk: 7, spd: 7, color: '#3498db', weapon: 'magic' },
      { name: 'Swarming Dementor', hp: 90, atk: 12, spd: 4, color: '#2c3e50', weapon: 'cold' },
      { name: 'Death Eater Scout', hp: 100, atk: 10, spd: 5, color: '#111317', weapon: 'wand' }
    ],
    bosses: [
      { name: 'Lucius Malfoy Lord', hp: 490, atk: 18, spd: 5, color: '#566573', weapon: 'wand', special: 'Crucio Curse Spark' },
      { name: 'Bellatrix Lestrange Witch', hp: 520, atk: 20, spd: 6, color: '#2b1a3d', weapon: 'wand', special: 'Avada Spark Burst' }
    ],
    worldBoss: { name: 'Lord Voldemort Dark Lord', hp: 1450, atk: 35, spd: 4, color: '#17202a', weapon: 'wand', special: 'Fiendfyre Dragon Storm' }
  },
  'Star Wars': {
    monsters: [
      { name: 'Stormtrooper Patrol', hp: 80, atk: 8, spd: 5, color: '#f2f4f4', weapon: 'gun' },
      { name: 'Imperial Probe Droid', hp: 70, atk: 11, spd: 6, color: '#7f8c8d', weapon: 'laser' },
      { name: 'Tusken Sand Raider', hp: 90, atk: 10, spd: 5, color: '#cca43b', weapon: 'staff' }
    ],
    bosses: [
      { name: 'Darth Maul Assassin', hp: 580, atk: 22, spd: 8, color: '#c0392b', weapon: 'saber', special: 'Double Saber Spin Sweep' },
      { name: 'Count Dooku Sith Lord', hp: 540, atk: 20, spd: 6, color: '#2b2b2b', weapon: 'saber', special: 'Force Lightning Shock' }
    ],
    worldBoss: { name: 'Darth Vader Sith Master', hp: 1550, atk: 36, spd: 4, color: '#000000', weapon: 'saber', special: 'Force Telekinesis Choke' }
  },
  'Le Cinquième Element': {
    monsters: [
      { name: 'Mangalore Commando', hp: 95, atk: 11, spd: 4, color: '#797d7f', weapon: 'gun' },
      { name: 'Zorg Mercenary Thug', hp: 80, atk: 10, spd: 5, color: '#9a7d0a', weapon: 'laser' },
      { name: 'Shadow Parasite Spawn', hp: 60, atk: 13, spd: 7, color: '#17202a', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Jean-Baptiste Zorg Leader', hp: 480, atk: 17, spd: 6, color: '#d35400', weapon: 'gun', special: 'ZF-1 Replay Rocket' },
      { name: 'Mangalore Chieftain Aknot', hp: 520, atk: 19, spd: 4, color: '#565d6d', weapon: 'rifle', special: 'Heavy Grenade Launch' }
    ],
    worldBoss: { name: 'The Ultimate Evil Sphere', hp: 1380, atk: 32, spd: 2, color: '#1a0505', weapon: 'darkness', special: 'Cosmic Incineration Flare' }
  },
  'Scary Movie': {
    monsters: [
      { name: 'Ghostface Impostor Guy', hp: 65, atk: 8, spd: 6, color: '#2c3e50', weapon: 'knife' },
      { name: 'Comedic Dummy Doll', hp: 70, atk: 9, spd: 5, color: '#cca43b', weapon: 'bite' },
      { name: 'Spoof Movie Alien', hp: 75, atk: 10, spd: 6, color: '#27ae60', weapon: 'spit' }
    ],
    bosses: [
      { name: 'Brenda Meeks Ghost Form', hp: 420, atk: 15, spd: 7, color: '#8e44ad', weapon: 'sound', special: 'Outrageous Scream Wave' },
      { name: 'Bobby Prinze Assassin', hp: 440, atk: 16, spd: 6, color: '#34495e', weapon: 'knife', special: 'Parody Movie Twist Slap' }
    ],
    worldBoss: { name: 'Ghostface Wassup Slasher', hp: 1100, atk: 25, spd: 5, color: '#1c2833', weapon: 'knife', special: 'Wassup Call Confusion Loop' }
  },
  'Dead Space': {
    monsters: [
      { name: 'Necromorph Slasher Scythe', hp: 85, atk: 12, spd: 6, color: '#a04000', weapon: 'claws' },
      { name: 'Necromorph Leaper Demon', hp: 70, atk: 11, spd: 7, color: '#566573', weapon: 'tail' },
      { name: 'Necromorph Lurker Pod', hp: 60, atk: 10, spd: 5, color: '#4d5656', weapon: 'spit' }
    ],
    bosses: [
      { name: 'Necromorph Infector Pod', hp: 450, atk: 16, spd: 6, color: '#7d6608', weapon: 'inject', special: 'T-Virus Necromorph Infection' },
      { name: 'Armored Brute Smasher', hp: 650, atk: 22, spd: 3, color: '#5c4033', weapon: 'fists', special: 'Bulldozer Charge Slam' }
    ],
    worldBoss: { name: 'Giant Hive Mind Leviathan', hp: 1500, atk: 35, spd: 3, color: '#2c1e15', weapon: 'tentacles', special: 'Planet Crushing Tentacle Slam' }
  },
  'Rick & Morty': {
    monsters: [
      { name: 'Feral Cronenberg Monster', hp: 100, atk: 12, spd: 5, color: '#d98880', weapon: 'bite' },
      { name: 'Gromflamite Galactic Soldier', hp: 80, atk: 10, spd: 5, color: '#2e4053', weapon: 'gun' },
      { name: 'Gazorpian Female Warrior', hp: 85, atk: 11, spd: 6, color: '#a569bd', weapon: 'fists' }
    ],
    bosses: [
      { name: 'Evil Morty Commander', hp: 500, atk: 19, spd: 7, color: '#1f618d', weapon: 'laser', special: 'Cybernetic Override Ray' },
      { name: 'Tammy Galactic Agent', hp: 480, atk: 18, spd: 6, color: '#7d6608', weapon: 'gun', special: 'Overwatch Droid Support' }
    ],
    worldBoss: { name: 'Federal Prison AI Core', hp: 1300, atk: 30, spd: 4, color: '#1b2631', weapon: 'laser', special: 'Portal Ring Beam Sweep' }
  },
  'Digital Circus': {
    monsters: [
      { name: 'Creeping Gloink Bug', hp: 60, atk: 7, spd: 6, color: '#e74c3c', weapon: 'bite' },
      { name: 'Circus Juggler Toy', hp: 75, atk: 9, spd: 6, color: '#3498db', weapon: 'juggling' },
      { name: 'Cardboard Stage Mannequin', hp: 80, atk: 8, spd: 5, color: '#d5dbdb', weapon: 'slam' }
    ],
    bosses: [
      { name: 'Kaufmo Abstracted Beast', hp: 550, atk: 20, spd: 6, color: '#212f3d', weapon: 'glitch_claws', special: 'Dimensional Claws Chaos' },
      { name: 'Possessed Ragatha Doll', hp: 460, atk: 16, spd: 6, color: '#a93226', weapon: 'fists', special: 'Stitched Doll Panic Rush' }
    ],
    worldBoss: { name: 'Caine Ringmaster AI', hp: 1250, atk: 29, spd: 5, color: '#d4ac0d', weapon: 'eyes', special: 'Circus Stage Glitch Reset' }
  },
  'Digimon': {
    monsters: [
      { name: 'Vicious Gazimon Scout', hp: 80, atk: 9, spd: 6, color: '#7d3c98', weapon: 'claws' },
      { name: 'Goblimon Club Swinger', hp: 85, atk: 10, spd: 5, color: '#1e8449', weapon: 'club' },
      { name: 'Bakemon Floating Ghost', hp: 70, atk: 11, spd: 6, color: '#ececec', weapon: 'touch' }
    ],
    bosses: [
      { name: 'Devimon Dark Agent', hp: 580, atk: 21, spd: 6, color: '#17202a', weapon: 'claws', special: 'Death Claw Heart Grab' },
      { name: 'Myotismon Vampire Lord', hp: 620, atk: 23, spd: 6, color: '#78281f', weapon: 'darkness', special: 'Grisly Wing Bat Swarm' }
    ],
    worldBoss: { name: 'Apocalymon Void Core', hp: 1480, atk: 36, spd: 3, color: '#03010c', weapon: 'claws', special: 'Darkness Zone Obliteration' }
  },
  'Saw': {
    monsters: [
      { name: 'Pighead Trap Patrol', hp: 85, atk: 10, spd: 5, color: '#566573', weapon: 'knife' },
      { name: 'Trap-Bound Panic Victim', hp: 70, atk: 9, spd: 6, color: '#cca43b', weapon: 'slam' },
      { name: 'Sawblade Drone Sentry', hp: 60, atk: 13, spd: 7, color: '#95a5a6', weapon: 'saw' }
    ],
    bosses: [
      { name: 'Amanda Young Accomplice', hp: 480, atk: 18, spd: 7, color: '#78281f', weapon: 'knife', special: 'Pig Mask Stabbing Rush' },
      { name: 'Hoffman Detective Trapper', hp: 520, atk: 19, spd: 5, color: '#2e4053', weapon: 'gun', special: 'Locked Room Gas Countdown' }
    ],
    worldBoss: { name: 'Jigsaw Classroom Trap Hub', hp: 1200, atk: 28, spd: 4, color: '#1b2631', weapon: 'machinery', special: 'Reverse Bear Trap Clamping' }
  },
  'Rosario + Vampire': {
    monsters: [
      { name: 'Ghoul Student Outcast', hp: 75, atk: 10, spd: 5, color: '#566573', weapon: 'bite' },
      { name: 'Lesser Werewolf Brawler', hp: 90, atk: 12, spd: 6, color: '#5d4037', weapon: 'claws' },
      { name: 'Academy Harpy Minion', hp: 65, atk: 9, spd: 7, color: '#af7ac5', weapon: 'dive' }
    ],
    bosses: [
      { name: 'Kokoa Shuzen sister', hp: 480, atk: 18, spd: 7, color: '#c0392b', weapon: 'bat', special: 'Ko-chan Giant Hammer' },
      { name: 'Kuyou Fire Fox Demon', hp: 540, atk: 20, spd: 6, color: '#d35400', weapon: 'fire', special: 'Flame Tail Fire Slash' }
    ],
    worldBoss: { name: 'Alucard Dragon Colossus', hp: 1400, atk: 33, spd: 3, color: '#1a1118', weapon: 'darkness', special: 'Cataclysmic Vampire Roar' }
  },
  'Negima': {
    monsters: [
      { name: 'Contract Shadow Imp', hp: 70, atk: 9, spd: 6, color: '#76448a', weapon: 'magic' },
      { name: 'Magic Combat Puppet', hp: 90, atk: 11, spd: 5, color: '#a04000', weapon: 'blade' },
      { name: 'Contract Beast Beetle', hp: 85, atk: 10, spd: 5, color: '#273746', weapon: 'bash' }
    ],
    bosses: [
      { name: 'Kotaro Inugami Wolf-boy', hp: 500, atk: 19, spd: 7, color: '#d35400', weapon: 'claws', special: 'Shadow Wolf Clone Strike' },
      { name: 'Fate Averruncus Earth Mage', hp: 600, atk: 22, spd: 6, color: '#2c3e50', weapon: 'stone', special: 'Petrification Spear Pillar' }
    ],
    worldBoss: { name: 'Mage of the Beginning God', hp: 1500, atk: 36, spd: 4, color: '#09010f', weapon: 'magic', special: 'Genesis Void Magic Blast' }
  },
  'Ghost in the Shell': {
    monsters: [
      { name: 'Cyborg Terrorist Commando', hp: 90, atk: 10, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Rogue Police Heavy Drone', hp: 80, atk: 11, spd: 5, color: '#7f8c8d', weapon: 'laser' },
      { name: 'Tachikoma Hatchling Droid', hp: 65, atk: 9, spd: 7, color: '#2980b9', weapon: 'zap' }
    ],
    bosses: [
      { name: 'Puppet Master Cyborg', hp: 520, atk: 18, spd: 6, color: '#d5dbdb', weapon: 'glitch', special: 'Cyberbrain Hack Stun' },
      { name: 'Section 6 Agent Squad', hp: 490, atk: 17, spd: 6, color: '#2c3e50', weapon: 'rifle', special: 'Thermoptic Camouflage Strike' }
    ],
    worldBoss: { name: 'Think Tank Tachikoma Core', hp: 1280, atk: 30, spd: 5, color: '#2980b9', weapon: 'missiles', special: 'Gatling Cannon Barrage Storm' }
  },
  'Mad Max': {
    monsters: [
      { name: 'War Boy Raider Cadet', hp: 75, atk: 9, spd: 5, color: '#e5e7e9', weapon: 'spear' },
      { name: 'Buzzard Spike Car', hp: 70, atk: 12, spd: 6, color: '#7f8c8d', weapon: 'ram' },
      { name: 'Mutant War Pup Gladiator', hp: 85, atk: 10, spd: 5, color: '#566573', weapon: 'club' }
    ],
    bosses: [
      { name: 'Rictus Erectus Colossus', hp: 620, atk: 22, spd: 4, color: '#5c221e', weapon: 'fists', special: 'Gigantic V8 Engine Smash' },
      { name: 'Immortan Joe Warlord', hp: 560, atk: 20, spd: 5, color: '#cca43b', weapon: 'gun', special: 'Valhalla Chrome Sacrifice' }
    ],
    worldBoss: { name: 'The Gigahorse Interceptor Rig', hp: 1350, atk: 32, spd: 4, color: '#2c3e50', weapon: 'harpoon', special: 'Muzzle-Flash Flame Spewer' }
  }
};

Object.assign(ENEMIES_DB, EXPANDED_ENEMIES_DB);

const CANON_ENEMY_EXPANSION = {
  'Gears of War': {
    monsters: [
      { name: 'Theron Guard', hp: 112, atk: 13, spd: 5, color: '#7b6a52', weapon: 'torque_bow' },
      { name: 'Boomer Locust', hp: 145, atk: 16, spd: 3, color: '#5d4a3b', weapon: 'boomshot' },
      { name: 'Kantus Priest', hp: 100, atk: 12, spd: 5, color: '#8d6b45', weapon: 'gorgon_pistol' },
      { name: 'Corpser Hatchling', hp: 130, atk: 14, spd: 4, color: '#3b2d28', weapon: 'burrow_claws' }
    ],
    bosses: [
      { name: 'Berserker Matriarch', hp: 620, atk: 24, spd: 4, color: '#6b2d2d', weapon: 'charge', special: 'Blind Rage Charge' },
      { name: 'Karn Locust General', hp: 570, atk: 22, spd: 5, color: '#2f3a30', weapon: 'sniper', special: 'Siege Beast Command' }
    ]
  },
  Halo: {
    monsters: [
      { name: 'Hunter Bond Pair', hp: 165, atk: 16, spd: 3, color: '#34495e', weapon: 'fuel_rod' },
      { name: 'Brute Captain', hp: 125, atk: 14, spd: 5, color: '#5c5146', weapon: 'spiker' },
      { name: 'Yanme Drone Swarm', hp: 70, atk: 10, spd: 8, color: '#8fbc8f', weapon: 'needle_swarm' },
      { name: 'Flood Carrier Form', hp: 90, atk: 17, spd: 3, color: '#9a8b55', weapon: 'infection_burst' },
      { name: 'Promethean Knight', hp: 135, atk: 15, spd: 5, color: '#f0f7ff', weapon: 'hardlight_blade' }
    ],
    bosses: [
      { name: 'Gravemind Tendril', hp: 720, atk: 24, spd: 2, color: '#6b5a38', weapon: 'flood_mind', special: 'Logic Plague Whisper' },
      { name: 'Ur-Didact Echo', hp: 640, atk: 23, spd: 5, color: '#dfefff', weapon: 'constraint_field', special: 'Composer Pulse' }
    ]
  },
  Alien: {
    monsters: [
      { name: 'Chestburster Echo', hp: 45, atk: 13, spd: 8, color: '#d0b08a', weapon: 'inner_jaw' },
      { name: 'Warrior Xenomorph', hp: 105, atk: 14, spd: 6, color: '#0b0d12', weapon: 'acid_claws' },
      { name: 'Egg Chamber Sac', hp: 95, atk: 8, spd: 2, color: '#3e342b', weapon: 'facehugger_spawn' },
      { name: 'Synthetic Ash Protocol', hp: 115, atk: 12, spd: 5, color: '#e8e8df', weapon: 'corporate_override' }
    ],
    bosses: [
      { name: 'Big Chap Stalker', hp: 560, atk: 22, spd: 7, color: '#05070a', weapon: 'tail', special: 'Vent Shaft Ambush' },
      { name: 'Weyland-Yutani Retrieval Team', hp: 510, atk: 19, spd: 5, color: '#2f3f46', weapon: 'containment_rifles', special: 'Specimen Recovery Order' }
    ]
  },
  Predator: {
    monsters: [
      { name: 'Thermal Decoy Hunter', hp: 92, atk: 12, spd: 7, color: '#6b6f59', weapon: 'cloak_blade' },
      { name: 'Tracker Predator Hound', hp: 85, atk: 13, spd: 8, color: '#4d3d33', weapon: 'jaw' },
      { name: 'Falconer Drone', hp: 75, atk: 11, spd: 8, color: '#667067', weapon: 'aerial_scan' },
      { name: 'Mercenary Trophy Guard', hp: 100, atk: 11, spd: 5, color: '#34495e', weapon: 'rifle' }
    ],
    bosses: [
      { name: 'Elder Predator Trialmaster', hp: 610, atk: 23, spd: 5, color: '#7b6a4d', weapon: 'ceremonial_spear', special: 'Blooded Honor Trial' },
      { name: 'Predalien Trophy Spawn', hp: 650, atk: 25, spd: 5, color: '#2c2a20', weapon: 'acid_wristblades', special: 'Hybrid Hunt Frenzy' }
    ]
  },
  'Resident Evil': {
    monsters: [
      { name: 'Crimson Head Prototype', hp: 95, atk: 14, spd: 7, color: '#8b1e16', weapon: 'claws' },
      { name: 'Ganado Plaga Host', hp: 85, atk: 12, spd: 5, color: '#5d4037', weapon: 'axe' },
      { name: 'Regenerator Lab Specimen', hp: 145, atk: 15, spd: 4, color: '#c9c7b8', weapon: 'stretch_claws' },
      { name: 'Ivy Plant B.O.W.', hp: 120, atk: 13, spd: 3, color: '#2e7d32', weapon: 'acid_vines' }
    ],
    bosses: [
      { name: 'Lisa Trevor Memory', hp: 620, atk: 21, spd: 4, color: '#6b4b40', weapon: 'chains', special: 'Undying Pursuit' },
      { name: 'Jack Baker Molded Patriarch', hp: 650, atk: 24, spd: 5, color: '#3d2d28', weapon: 'chainsaw_shear', special: 'Welcome to the Family' }
    ]
  },
  'Silent Hill': {
    monsters: [
      { name: 'Closer Hallway Giant', hp: 130, atk: 14, spd: 3, color: '#9c7a6a', weapon: 'arm_slam' },
      { name: 'Mandarin Undergrate', hp: 95, atk: 12, spd: 4, color: '#7d544a', weapon: 'floor_grab' },
      { name: 'Needler Street Horror', hp: 110, atk: 13, spd: 5, color: '#69423d', weapon: 'bone_lance' },
      { name: 'Schism Split-Face', hp: 120, atk: 15, spd: 4, color: '#7a5b55', weapon: 'head_blade' }
    ],
    bosses: [
      { name: 'Memory of Alessa', hp: 590, atk: 20, spd: 5, color: '#6c3483', weapon: 'psychic_fire', special: 'Incubator Trial' },
      { name: 'Mary Maria Echo', hp: 540, atk: 18, spd: 5, color: '#c27a7a', weapon: 'grief_chain', special: 'Letter From the Dead' }
    ]
  },
  'Dino Crisis': {
    monsters: [
      { name: 'Allosaurus Corridor Hunter', hp: 130, atk: 16, spd: 5, color: '#5c3d2e', weapon: 'bite' },
      { name: 'Mosasaurus Pool Shadow', hp: 145, atk: 15, spd: 4, color: '#1f4d5a', weapon: 'water_drag' },
      { name: 'Third Energy Compsognathus Pack', hp: 70, atk: 9, spd: 8, color: '#6f8f45', weapon: 'swarm' }
    ],
    bosses: [
      { name: 'Dr. Kirk Security Override', hp: 480, atk: 17, spd: 5, color: '#7f8c8d', weapon: 'lab_lockdown', special: 'Third Energy Lockout' },
      { name: 'Plesiosaur Facility Breach', hp: 600, atk: 22, spd: 4, color: '#24546a', weapon: 'water_maw', special: 'Flooded Lab Ambush' }
    ]
  },
  'The Matrix': {
    monsters: [
      { name: 'Agent Brown Program', hp: 120, atk: 14, spd: 8, color: '#1f1f1f', weapon: 'pistol' },
      { name: 'Agent Thompson Program', hp: 125, atk: 15, spd: 8, color: '#202820', weapon: 'desert_eagle' },
      { name: 'Twin Exile Ghost', hp: 100, atk: 13, spd: 7, color: '#d7d7d7', weapon: 'phase_blade' },
      { name: 'Machine Sentinel Swarm', hp: 110, atk: 14, spd: 6, color: '#7f8c8d', weapon: 'cutters' }
    ],
    bosses: [
      { name: 'Merovingian Exile Lord', hp: 540, atk: 18, spd: 6, color: '#8e6e53', weapon: 'causality_code', special: 'Cause and Effect Trap' },
      { name: 'Architect White Room', hp: 620, atk: 20, spd: 4, color: '#ecf0f1', weapon: 'choice_matrix', special: 'Reload the Equation' }
    ]
  },
  Stargate: {
    monsters: [
      { name: 'Horus Guard Phalanx', hp: 105, atk: 10, spd: 4, color: '#d4af37', weapon: 'staff_weapon' },
      { name: 'Unas Host Warrior', hp: 125, atk: 13, spd: 5, color: '#6d4c41', weapon: 'claws' },
      { name: 'Ori Prior Convert', hp: 115, atk: 14, spd: 4, color: '#f5e6a1', weapon: 'prior_staff' }
    ],
    bosses: [
      { name: 'Ra Sun-God System Lord', hp: 560, atk: 20, spd: 5, color: '#f1c40f', weapon: 'ribbon_device', special: 'Pyramid Ship Command' },
      { name: 'Replicator Carter Echo', hp: 590, atk: 21, spd: 6, color: '#b8c0c8', weapon: 'nanite_blade', special: 'Human-Form Replication' }
    ]
  },
  'Half-Life': {
    monsters: [
      { name: 'Houndeye Pack', hp: 75, atk: 11, spd: 6, color: '#7d6f3f', weapon: 'sonic_blast' },
      { name: 'Barnacle Ceiling Trap', hp: 65, atk: 10, spd: 2, color: '#a36b6b', weapon: 'tongue_grab' },
      { name: 'Antlion Guard Larva', hp: 130, atk: 15, spd: 6, color: '#8e6f2e', weapon: 'charge' }
    ],
    bosses: [
      { name: 'HECU Black Ops Squad', hp: 500, atk: 18, spd: 7, color: '#111317', weapon: 'suppressed_fire', special: 'Black Mesa Cleanup' },
      { name: 'Advisor Pod Core', hp: 650, atk: 22, spd: 4, color: '#5d4a73', weapon: 'psychic_lift', special: 'Neural Harvest' }
    ]
  },
  Portal: {
    monsters: [
      { name: 'Frankenturret Cube', hp: 90, atk: 10, spd: 4, color: '#dfe6e9', weapon: 'hop_crush' },
      { name: 'Rocket Turret Mount', hp: 100, atk: 15, spd: 3, color: '#bdc3c7', weapon: 'rocket' },
      { name: 'Excursion Funnel Hazard', hp: 80, atk: 9, spd: 5, color: '#85c1e9', weapon: 'tractor_beam' }
    ],
    bosses: [
      { name: 'Fact Core Logic Snare', hp: 420, atk: 15, spd: 5, color: '#f1c40f', weapon: 'false_fact', special: 'Contradiction Cascade' },
      { name: 'Space Core Vacuum Loop', hp: 450, atk: 16, spd: 8, color: '#2980b9', weapon: 'orbit_loop', special: 'SPAAACE Pull' }
    ]
  },
  'Metal Gear': {
    monsters: [
      { name: 'FROG Haven Trooper', hp: 100, atk: 12, spd: 7, color: '#5d6d7e', weapon: 'p90' },
      { name: 'Dwarf Gekko Swarm', hp: 70, atk: 10, spd: 8, color: '#bdc3c7', weapon: 'grapple' },
      { name: 'Gekko Walker', hp: 130, atk: 15, spd: 5, color: '#7f8c8d', weapon: 'leg_stomp' }
    ],
    bosses: [
      { name: 'Psycho Mantis Memory', hp: 520, atk: 18, spd: 7, color: '#6c3483', weapon: 'psychic_control', special: 'Controller Port Read' },
      { name: 'Metal Gear REX Shadow', hp: 720, atk: 26, spd: 3, color: '#455a64', weapon: 'railgun', special: 'Nuclear Launch Threat' }
    ]
  },
  'Mass Effect': {
    monsters: [
      { name: 'Husks Swarm', hp: 75, atk: 10, spd: 6, color: '#6c7a89', weapon: 'shock_grab' },
      { name: 'Geth Rocket Trooper', hp: 100, atk: 13, spd: 5, color: '#2e4053', weapon: 'rocket' },
      { name: 'Cerberus Phantom', hp: 110, atk: 15, spd: 7, color: '#f1c40f', weapon: 'monomolecular_sword' },
      { name: 'Collector Drone', hp: 105, atk: 14, spd: 5, color: '#b7950b', weapon: 'particle_beam' }
    ],
    bosses: [
      { name: 'Saren Arterius', hp: 620, atk: 23, spd: 7, color: '#34495e', weapon: 'sovereign_augments', special: 'Indoctrinated Charge' },
      { name: 'Harbinger Avatar', hp: 680, atk: 25, spd: 5, color: '#d35400', weapon: 'collector_beam', special: 'Assuming Direct Control' }
    ]
  },
  Doom: {
    monsters: [
      { name: 'Imp Fireballer', hp: 75, atk: 11, spd: 6, color: '#a04000', weapon: 'fireball' },
      { name: 'Cacodemon Orb', hp: 115, atk: 13, spd: 4, color: '#c0392b', weapon: 'bite' },
      { name: 'Revenant Jetpack', hp: 120, atk: 15, spd: 6, color: '#d7dbdd', weapon: 'missiles' },
      { name: 'Mancubus Flame Tank', hp: 150, atk: 17, spd: 3, color: '#8b4513', weapon: 'flame_cannons' }
    ],
    bosses: [
      { name: 'Marauder Sentinel-Fallen', hp: 620, atk: 25, spd: 7, color: '#7b241c', weapon: 'argent_axe', special: 'Wolf and Axe Counter' },
      { name: 'Spider Mastermind Core', hp: 720, atk: 27, spd: 3, color: '#2c3e50', weapon: 'plasma_brain', special: 'Hell Network Overload' }
    ]
  },
  'Dead Space': {
    monsters: [
      { name: 'Slasher Necromorph', hp: 90, atk: 13, spd: 5, color: '#9a6b44', weapon: 'bone_blades' },
      { name: 'Pregnant Necromorph', hp: 135, atk: 12, spd: 3, color: '#7a5b45', weapon: 'swarm_burst' },
      { name: 'Exploder Necromorph', hp: 70, atk: 17, spd: 5, color: '#d4ac0d', weapon: 'acid_sac' },
      { name: 'Divider Necromorph', hp: 120, atk: 14, spd: 4, color: '#6e4f39', weapon: 'split_attack' }
    ],
    bosses: [
      { name: 'Hunter Regenerator', hp: 650, atk: 21, spd: 5, color: '#4d342f', weapon: 'regrowth_claws', special: 'Impossible Regeneration' },
      { name: 'Hive Mind Aegis VII', hp: 760, atk: 28, spd: 3, color: '#5c2018', weapon: 'tentacles', special: 'Marker Hive Crush' }
    ]
  },
  'Star Wars': {
    monsters: [
      { name: 'Stormtrooper Squad', hp: 85, atk: 10, spd: 5, color: '#ecf0f1', weapon: 'blaster' },
      { name: 'Droideka Shield Droid', hp: 120, atk: 13, spd: 4, color: '#bd8d46', weapon: 'twin_blaster' },
      { name: 'Inquisitor Hunter', hp: 125, atk: 15, spd: 7, color: '#1c1c1c', weapon: 'red_lightsaber' }
    ],
    bosses: [
      { name: 'Darth Vader Sith Lord', hp: 720, atk: 28, spd: 5, color: '#0a0a0a', weapon: 'force_choke', special: 'Dark Side Corridor Advance' },
      { name: 'Emperor Palpatine', hp: 650, atk: 26, spd: 5, color: '#4a235a', weapon: 'force_lightning', special: 'Unlimited Power' }
    ]
  },
  'Harry Potter': {
    monsters: [
      { name: 'Dementor Patrol', hp: 100, atk: 13, spd: 5, color: '#1c1c1c', weapon: 'soul_chill' },
      { name: 'Acromantula Brood', hp: 90, atk: 12, spd: 7, color: '#4b352a', weapon: 'fangs' },
      { name: 'Death Eater Duelist', hp: 110, atk: 14, spd: 6, color: '#2c2c2c', weapon: 'dark_wand' }
    ],
    bosses: [
      { name: 'Basilisk of Secrets', hp: 690, atk: 25, spd: 4, color: '#1f5f3f', weapon: 'venom_fang', special: 'Petrifying Gaze' },
      { name: 'Voldemort Horcrux Echo', hp: 720, atk: 27, spd: 6, color: '#d5dbdb', weapon: 'elder_wand', special: 'Avada Kedavra Lock' }
    ]
  },
  'Yu-Gi-Oh': {
    monsters: [
      { name: 'Summoned Skull', hp: 125, atk: 15, spd: 5, color: '#d7dbdd', weapon: 'lightning' },
      { name: 'Harpie Lady Trio', hp: 95, atk: 13, spd: 8, color: '#f5b7b1', weapon: 'claws' },
      { name: 'Toon World Mimic', hp: 105, atk: 12, spd: 6, color: '#f4d03f', weapon: 'toon_trap' }
    ],
    bosses: [
      { name: 'Red-Eyes Black Dragon', hp: 600, atk: 24, spd: 6, color: '#111317', weapon: 'inferno_fire', special: 'Inferno Fire Blast' },
      { name: 'Exodia Forbidden One', hp: 800, atk: 30, spd: 3, color: '#d4af37', weapon: 'obliteration', special: 'Obliterate the Field' }
    ]
  },
  Discworld: {
    monsters: [
      { name: 'Nac Mac Feegle Raid', hp: 70, atk: 13, spd: 8, color: '#3498db', weapon: 'tiny_brawl' },
      { name: 'Unseen University Spell Leak', hp: 95, atk: 12, spd: 5, color: '#8e44ad', weapon: 'octarine_bolt' },
      { name: 'Ankh-Morpork Assassin', hp: 90, atk: 14, spd: 7, color: '#1c2833', weapon: 'licensed_blade' }
    ],
    bosses: [
      { name: 'Auditor of Reality', hp: 560, atk: 19, spd: 5, color: '#d5dbdb', weapon: 'anti_narrative', special: 'Eliminate Irregularity' },
      { name: 'Death on Binky', hp: 680, atk: 24, spd: 6, color: '#ecf0f1', weapon: 'scythe', special: 'Final Appointment' }
    ]
  },
  Kaamelott: {
    monsters: [
      { name: 'Pict Raider', hp: 85, atk: 10, spd: 6, color: '#6e4f39', weapon: 'axe' },
      { name: 'Roman Tax Patrol', hp: 95, atk: 11, spd: 5, color: '#7f8c8d', weapon: 'gladius' },
      { name: 'Quest Bureaucrat', hp: 80, atk: 8, spd: 4, color: '#d6b465', weapon: 'paperwork' }
    ],
    bosses: [
      { name: 'Roi Burgonde', hp: 580, atk: 18, spd: 3, color: '#d6b465', weapon: 'feast_command', special: 'Cuillere Diplomatique' },
      { name: 'Meleagant Shadow', hp: 540, atk: 19, spd: 5, color: '#1c1c1c', weapon: 'despair_word', special: 'Kingdom Doubt' },
      { name: 'Lancelot War Camp', hp: 600, atk: 22, spd: 5, color: '#d7dbdd', weapon: 'white_blade', special: 'Betrayal Formation' }
    ]
  },
  'Dungeon Meshi': {
    monsters: [
      { name: 'Walking Mushroom Circle', hp: 75, atk: 9, spd: 5, color: '#d6b465', weapon: 'spores' },
      { name: 'Undine Water Mass', hp: 110, atk: 13, spd: 5, color: '#5dade2', weapon: 'water_blast' },
      { name: 'Treasure Insect Swarm', hp: 70, atk: 10, spd: 7, color: '#f4d03f', weapon: 'mimic_bite' }
    ],
    bosses: [
      { name: 'Chimera Falin', hp: 660, atk: 24, spd: 5, color: '#f5d6a1', weapon: 'dragon_magic', special: 'Dragon Soul Wail' },
      { name: 'Mad Mage Thistle', hp: 610, atk: 22, spd: 6, color: '#8e44ad', weapon: 'dungeon_magic', special: 'Dungeon Master Rewrite' }
    ]
  },
  'Final Fantasy VII': {
    monsters: [
      { name: 'Shinra Guard', hp: 85, atk: 10, spd: 5, color: '#34495e', weapon: 'rifle' },
      { name: 'Sweeper Machine', hp: 120, atk: 13, spd: 4, color: '#7f8c8d', weapon: 'machine_gun' },
      { name: 'Tonberry Stalker', hp: 130, atk: 18, spd: 2, color: '#2e7d32', weapon: 'knife' }
    ],
    bosses: [
      { name: 'Sephiroth One-Winged', hp: 760, atk: 30, spd: 7, color: '#d7dbdd', weapon: 'masamune', special: 'Supernova Memory' },
      { name: 'Jenova Synthesis Core', hp: 720, atk: 26, spd: 5, color: '#7d3c98', weapon: 'alien_cells', special: 'Jenova Reunion' }
    ]
  },
  Ghostbusters: {
    monsters: [
      { name: 'Class V Full Roaming Vapor', hp: 85, atk: 10, spd: 7, color: '#2ecc71', weapon: 'slime' },
      { name: 'Terror Dog', hp: 120, atk: 14, spd: 6, color: '#5d4037', weapon: 'claws' },
      { name: 'Library Ghost', hp: 80, atk: 9, spd: 5, color: '#d5dbdb', weapon: 'fear_scream' }
    ],
    bosses: [
      { name: 'Gozer the Gozerian', hp: 650, atk: 24, spd: 6, color: '#d7bde2', weapon: 'dimension_bolt', special: 'Choose and Perish' },
      { name: 'Stay Puft Marshmallow Man', hp: 740, atk: 27, spd: 3, color: '#ecf0f1', weapon: 'marshmallow_stomp', special: 'Cross the Streams' }
    ]
  },
  'The Simpsons': {
    monsters: [
      { name: 'Itchy and Scratchy Bot', hp: 75, atk: 11, spd: 7, color: '#f4d03f', weapon: 'cartoon_saw' },
      { name: 'Springfield Power Mutant', hp: 105, atk: 12, spd: 5, color: '#2ecc71', weapon: 'radioactive_touch' },
      { name: 'Kang and Kodos Probe', hp: 95, atk: 13, spd: 6, color: '#8e44ad', weapon: 'tractor_ray' }
    ],
    bosses: [
      { name: 'Mr Burns Nuclear Scheme', hp: 520, atk: 18, spd: 4, color: '#f1c40f', weapon: 'hounds', special: 'Release the Hounds' },
      { name: 'Sideshow Bob Revenge Plot', hp: 500, atk: 19, spd: 6, color: '#e67e22', weapon: 'rake_trap', special: 'Cape Feare Ambush' }
    ]
  },
  Futurama: {
    monsters: [
      { name: 'Robot Mafia Enforcer', hp: 95, atk: 12, spd: 5, color: '#7f8c8d', weapon: 'tommy_gun' },
      { name: 'Brain Slug Host', hp: 70, atk: 8, spd: 6, color: '#2ecc71', weapon: 'mind_control' },
      { name: 'Momcorp Killbot', hp: 115, atk: 14, spd: 5, color: '#bdc3c7', weapon: 'laser' }
    ],
    bosses: [
      { name: 'Roberto Knife Bot', hp: 530, atk: 21, spd: 7, color: '#95a5a6', weapon: 'knife', special: 'Crazy Stab Routine' },
      { name: 'Hypnotoad Broadcast', hp: 560, atk: 20, spd: 4, color: '#2ecc71', weapon: 'hypnosis', special: 'All Glory Protocol' }
    ]
  },
  'Team Fortress 2': {
    monsters: [
      { name: 'RED Scout Rush', hp: 75, atk: 11, spd: 9, color: '#c0392b', weapon: 'scattergun' },
      { name: 'BLU Sentry Level 3', hp: 135, atk: 15, spd: 2, color: '#3498db', weapon: 'sentry_rockets' },
      { name: 'Pyro Ambush', hp: 105, atk: 14, spd: 6, color: '#e67e22', weapon: 'flamethrower' }
    ],
    bosses: [
      { name: 'Saxton Hale Arena Boss', hp: 720, atk: 28, spd: 7, color: '#d35400', weapon: 'fists', special: 'Mann Co. Punch' },
      { name: 'Merasmus Spellfield', hp: 600, atk: 23, spd: 5, color: '#8e44ad', weapon: 'bombinomicon', special: 'Halloween Spell Chaos' }
    ]
  },
  'Left 4 Dead': {
    monsters: [
      { name: 'Boomer Bile Host', hp: 70, atk: 9, spd: 4, color: '#7f8c8d', weapon: 'bile_explosion' },
      { name: 'Hunter Pounce', hp: 80, atk: 14, spd: 8, color: '#566573', weapon: 'pounce' },
      { name: 'Spitter Acid Pool', hp: 75, atk: 13, spd: 5, color: '#2ecc71', weapon: 'acid_spit' }
    ],
    bosses: [
      { name: 'Witch Crying Corner', hp: 560, atk: 24, spd: 5, color: '#d5b895', weapon: 'claw_frenzy', special: 'Startled Scream' },
      { name: 'Tank Horde Breaker', hp: 720, atk: 28, spd: 4, color: '#5d4037', weapon: 'concrete_throw', special: 'Safe Room Breach' }
    ]
  }
};

const mergeEnemyExpansion = (target, additions = {}) => {
  Object.entries(additions).forEach(([universe, data]) => {
    if (!target[universe]) {
      target[universe] = { monsters: [], bosses: [], worldBoss: data.worldBoss || null };
    }
    ['monsters', 'bosses'].forEach(kind => {
      const incoming = Array.isArray(data?.[kind]) ? data[kind] : [];
      if (!Array.isArray(target[universe][kind])) target[universe][kind] = [];
      const knownNames = new Set(target[universe][kind].map(item => item.name));
      incoming.forEach(item => {
        if (!item?.name || knownNames.has(item.name)) return;
        target[universe][kind].push(item);
        knownNames.add(item.name);
      });
    });
    if (!target[universe].worldBoss && data.worldBoss) target[universe].worldBoss = data.worldBoss;
  });
};

mergeEnemyExpansion(ENEMIES_DB, CANON_ENEMY_EXPANSION);
mergeEnemyExpansion(ENEMIES_DB, LORE_ACCURATE_ENEMY_EXPANSIONS);

// Final game boss (The final breach singularity core)
export const FINAL_GAME_BOSS = {
  name: 'Breach Singularity Core',
  hp: 2000,
  atk: 40,
  spd: 4,
  color: '#8e44ad',
  weapon: 'laser',
  special: 'Cosmic Shatter Glitch Wave'
};

export const getMonstersForUniverse = (univ) => ENEMIES_DB[univ]?.monsters || ENEMIES_DB['Halo'].monsters;
export const getBossesForUniverse = (univ) => ENEMIES_DB[univ]?.bosses || ENEMIES_DB['Halo'].bosses;
export const getWorldBossForUniverse = (univ) => ENEMIES_DB[univ]?.worldBoss || ENEMIES_DB['Halo'].worldBoss;
export const getFinalGameBoss = () => FINAL_GAME_BOSS;
export const getEnemiesForUniverse = (univ) => ({
  enemy: ENEMIES_DB[univ]?.monsters[0] || ENEMIES_DB['Halo'].monsters[0],
  boss: ENEMIES_DB[univ]?.bosses[0] || ENEMIES_DB['Halo'].bosses[0]
});

export const OBSTACLES_DB = [
  { name: 'COG Cover', hp: 80, color: '#4a4e52', type: 'barrier' },
  { name: 'Naquadah Barrel', hp: 30, color: '#00ff00', type: 'barrel' }
];
