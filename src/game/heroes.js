// Heroes Database with Crossover Gear, Event Items, and Synergies (37 Universes)

import { EXPANDED_EVENT_ITEMS, EXPANDED_EXTRA_HERO_DATA, EXPANDED_GEAR } from './expandedUniverses';

export const HEROES_DB = [
  {
    id: 'marcus',
    name: 'Marcus Fenix',
    universe: 'Gears of War',
    category: 'tactical',
    primaryColor: '#4a4e52',
    secondaryColor: '#ff4500',
    weaponType: 'chainsaw',
    weaponColor: '#8b0000',
    stats: { hp: 160, atk: 15, def: 12, spd: 4 },
    simple: { name: 'Lancer Fire', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Chainsaw Lunge', type: 'melee', cd: 8, dmg: 2.2 },
    defense: { name: 'Roadie Cover', type: 'shield', dur: 2.5, reduce: 0.8 },
    special: { name: 'Hammer of Dawn', type: 'beam_aoe', dmg: 5.0, color: '#ff4500' }
  },
  {
    id: 'masterchief',
    name: 'Master Chief',
    universe: 'Halo',
    category: 'marine',
    primaryColor: '#2e5c1e',
    secondaryColor: '#ff9900',
    weaponType: 'gun',
    weaponColor: '#1c1c1c',
    stats: { hp: 150, atk: 16, def: 10, spd: 5 },
    simple: { name: 'Assault Rifle', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Plasma Grenade', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Bubble Shield', type: 'shield', dur: 3.0, reduce: 0.9 },
    special: { name: 'Spartan Laser', type: 'beam', dmg: 4.5, color: '#ff3333' }
  },
  {
    id: 'ripley',
    name: 'Ellen Ripley',
    universe: 'Alien',
    category: 'marine',
    primaryColor: '#8b8589',
    secondaryColor: '#4682b4',
    weaponType: 'gun',
    weaponColor: '#2f4f4f',
    stats: { hp: 130, atk: 14, def: 8, spd: 6 },
    simple: { name: 'Pulse Rifle', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'M94 Flamethrower', type: 'fire', cd: 7, dmg: 1.7 },
    defense: { name: 'Loader Block', type: 'shield', dur: 2.0, reduce: 0.75 },
    special: { name: 'Power Loader Smash', type: 'melee_aoe', dmg: 4.2 }
  },
  {
    id: 'predator',
    name: 'Yautja Hunter',
    universe: 'Predator',
    category: 'marine',
    primaryColor: '#5c524d',
    secondaryColor: '#00ff00',
    weaponType: 'wristblade',
    weaponColor: '#a9a9a9',
    stats: { hp: 140, atk: 18, def: 9, spd: 6 },
    simple: { name: 'Combistick Jab', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Plasma Caster', type: 'plasma', cd: 5, dmg: 1.9 },
    defense: { name: 'Cloaking Device', type: 'dodge', dur: 2.5, reduce: 0.85 },
    special: { name: 'Smart Disc Carnage', type: 'boomerang', dmg: 4.8 }
  },
  {
    id: 'leon',
    name: 'Leon S. Kennedy',
    universe: 'Resident Evil',
    category: 'horror',
    primaryColor: '#1d2a44',
    secondaryColor: '#b0c4de',
    weaponType: 'gun',
    weaponColor: '#000000',
    stats: { hp: 130, atk: 13, def: 8, spd: 6 },
    simple: { name: 'Matilda Handgun', type: 'bullet', dmg: 0.9 },
    secondary: { name: 'Shotgun Blast', type: 'shotgun', cd: 6, dmg: 1.6 },
    defense: { name: 'Combat Roll', type: 'dodge', dur: 1.5, reduce: 0.8 },
    special: { name: 'RPG-7 Rocket', type: 'rocket', dmg: 5.2 }
  },
  {
    id: 'pyramidhead',
    name: 'Pyramid Head',
    universe: 'Silent Hill',
    category: 'slayer',
    primaryColor: '#7c0a02',
    secondaryColor: '#d3d3d3',
    weaponType: 'greatsword',
    weaponColor: '#5a5a5a',
    stats: { hp: 200, atk: 20, def: 14, spd: 2 },
    simple: { name: 'Great Knife Slash', type: 'melee', dmg: 1.5 },
    secondary: { name: 'Spear Impale', type: 'projectile', cd: 9, dmg: 2.0 },
    defense: { name: 'Rust Ward', type: 'shield', dur: 2.5, reduce: 0.7 },
    special: { name: 'Executioner Fog', type: 'darkness', dmg: 4.6 }
  },
  {
    id: 'regina',
    name: 'Regina',
    universe: 'Dino Crisis',
    category: 'horror',
    primaryColor: '#a52a2a',
    secondaryColor: '#1a1a1a',
    weaponType: 'gun',
    weaponColor: '#696969',
    stats: { hp: 125, atk: 14, def: 7, spd: 7 },
    simple: { name: 'Glock Fire', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Grenade Dart', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Evasive Backflip', type: 'dodge', dur: 1.8, reduce: 0.8 },
    special: { name: 'T-Rex Breach Bite', type: 'dino', dmg: 4.9 }
  },
  {
    id: 'neo',
    name: 'Neo',
    universe: 'The Matrix',
    category: 'hacker',
    primaryColor: '#0a0a0a',
    secondaryColor: '#00ff00',
    weaponType: 'fists',
    weaponColor: '#ffffff',
    stats: { hp: 140, atk: 17, def: 9, spd: 8 },
    simple: { name: 'Kung Fu Punch', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Dual Uzi Spray', type: 'bullet_spray', cd: 5, dmg: 1.8 },
    defense: { name: 'Bullet Time Stop', type: 'dodge', dur: 3.0, reduce: 0.95 },
    special: { name: 'Reality Rewrite', type: 'glitch', dmg: 5.5 }
  },
  {
    id: 'oneill',
    name: 'Jack O\'Neill',
    universe: 'Stargate',
    category: 'marine',
    primaryColor: '#1f382b',
    secondaryColor: '#c0c0c0',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 135, atk: 14, def: 8, spd: 6 },
    simple: { name: 'P90 Burst', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Zat Blast', type: 'zap', cd: 6, dmg: 1.6 },
    defense: { name: 'Iris Block', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Stargate Wormhole', type: 'vortex', dmg: 4.8 }
  },
  {
    id: 'freeman',
    name: 'Gordon Freeman',
    universe: 'Half-Life',
    category: 'hacker',
    primaryColor: '#e65c00',
    secondaryColor: '#4f5d73',
    weaponType: 'crowbar',
    weaponColor: '#8b0000',
    stats: { hp: 145, atk: 15, def: 11, spd: 5 },
    simple: { name: 'Crowbar Whack', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gravity Gun Blast', type: 'gravity', cd: 6, dmg: 1.7 },
    defense: { name: 'HEV Shield Charge', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Gluon Gun Overload', type: 'beam', dmg: 4.7, color: '#33ccff' }
  },
  {
    id: 'chell',
    name: 'Chell',
    universe: 'Portal',
    category: 'hacker',
    primaryColor: '#ff6600',
    secondaryColor: '#ffffff',
    weaponType: 'portalgun',
    weaponColor: '#dcdcdc',
    stats: { hp: 120, atk: 12, def: 7, spd: 8 },
    simple: { name: 'Portal Fling', type: 'projectile', dmg: 0.9 },
    secondary: { name: 'Turret Summon', type: 'summon', cd: 7, dmg: 1.8 },
    defense: { name: 'Portal Redirect', type: 'dodge', dur: 2.0, reduce: 0.9 },
    special: { name: 'Neurotoxin Vent', type: 'poison', dmg: 4.4 }
  },
  {
    id: 'snake',
    name: 'Solid Snake',
    universe: 'Metal Gear',
    category: 'tactical',
    primaryColor: '#3a4454',
    secondaryColor: '#f1c40f',
    weaponType: 'gun',
    weaponColor: '#2b2b2b',
    stats: { hp: 140, atk: 16, def: 9, spd: 6 },
    simple: { name: 'SOCOM Laser Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Nikita Missile', type: 'rocket', cd: 8, dmg: 2.0 },
    defense: { name: 'Cardboard Box', type: 'dodge', dur: 2.5, reduce: 0.9 },
    special: { name: 'Chaff & CQC Combo', type: 'melee_aoe', dmg: 5.1 }
  },
  {
    id: 'dallas',
    name: 'Dallas',
    universe: 'Payday',
    category: 'tactical',
    primaryColor: '#7a221f',
    secondaryColor: '#ffffff',
    weaponType: 'gun',
    weaponColor: '#474747',
    stats: { hp: 135, atk: 15, def: 8, spd: 6 },
    simple: { name: 'AMCAR Rifle', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Sentry Deploy', type: 'summon', cd: 8, dmg: 1.7 },
    defense: { name: 'Medic Bag heal', type: 'heal', dur: 1.5, reduce: 0.5 },
    special: { name: 'Guys, The Thermal Drill!', type: 'drill_smash', dmg: 4.6 }
  },
  {
    id: 'miku',
    name: 'Hatsune Miku',
    universe: 'Vocaloid',
    category: 'hacker',
    primaryColor: '#39c5bb',
    secondaryColor: '#e0007a',
    weaponType: 'leek',
    weaponColor: '#2ecc71',
    stats: { hp: 110, atk: 12, def: 6, spd: 9 },
    simple: { name: 'Leek Slap', type: 'melee', dmg: 0.9 },
    secondary: { name: 'Soundwave Blast', type: 'sound', cd: 5, dmg: 1.5 },
    defense: { name: 'Hologram Shield', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'World is Mine Chorus', type: 'music', dmg: 4.7 }
  },
  {
    id: 'yugi',
    name: 'Yugi Muto',
    universe: 'Yu-Gi-Oh',
    category: 'tactical',
    primaryColor: '#2a1a5e',
    secondaryColor: '#f1c40f',
    weaponType: 'cards',
    weaponColor: '#d35400',
    stats: { hp: 125, atk: 14, def: 7, spd: 7 },
    simple: { name: 'Draw! Card Throw', type: 'projectile', dmg: 1.0 },
    secondary: { name: 'Dark Magician Attack', type: 'magic', cd: 7, dmg: 1.9 },
    defense: { name: 'Spellbinding Circle', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Exodia Obliterate!', type: 'magic_aoe', dmg: 6.0 }
  },
  {
    id: 'solbadguy',
    name: 'Sol Badguy',
    universe: 'Guilty Gear',
    category: 'slayer',
    primaryColor: '#e74c3c',
    secondaryColor: '#f39c12',
    weaponType: 'greatsword',
    weaponColor: '#2c3e50',
    stats: { hp: 155, atk: 19, def: 10, spd: 5 },
    simple: { name: 'Gunflame Sweep', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Bandit Revolver', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Faultless Defense', type: 'shield', dur: 2.0, reduce: 0.85 },
    special: { name: 'Dragon Install Burst', type: 'fire_aoe', dmg: 5.3 }
  },
  {
    id: 'ragna',
    name: 'Ragna the Bloodedge',
    universe: 'BlazBlue',
    category: 'slayer',
    primaryColor: '#c0392b',
    secondaryColor: '#2c3e50',
    weaponType: 'greatsword',
    weaponColor: '#7f8c8d',
    stats: { hp: 150, atk: 18, def: 9, spd: 6 },
    simple: { name: 'Dead Spike', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gauntlet Hades', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Barrier Trigger', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Black Onslaught', type: 'dark_aoe', dmg: 5.2 }
  },
  {
    id: 'survivor',
    name: 'Slender Survivor',
    universe: 'Slender Man',
    category: 'horror',
    primaryColor: '#7f8c8d',
    secondaryColor: '#f1c40f',
    weaponType: 'flashlight',
    weaponColor: '#f39c12',
    stats: { hp: 115, atk: 11, def: 7, spd: 8 },
    simple: { name: 'Flashlight Shine', type: 'beam', dmg: 0.8 },
    secondary: { name: 'Page Trap', type: 'summon', cd: 7, dmg: 1.6 },
    defense: { name: 'Camera Static Dash', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: '8 Pages Gathering', type: 'fear', dmg: 4.5 }
  },
  {
    id: 'andy',
    name: 'Andy Barclay',
    universe: 'Chucky',
    category: 'horror',
    primaryColor: '#3498db',
    secondaryColor: '#e74c3c',
    weaponType: 'baseballbat',
    weaponColor: '#d35400',
    stats: { hp: 120, atk: 12, def: 8, spd: 7 },
    simple: { name: 'Bat Swing', type: 'melee', dmg: 1.0 },
    secondary: { name: 'Jack-in-the-box Bomb', type: 'projectile', cd: 6, dmg: 1.7 },
    defense: { name: 'Hide in Closet', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'Friendly Fire Trap', type: 'trap', dmg: 4.3 }
  },
  {
    id: 'kirsty',
    name: 'Kirsty Cotton',
    universe: 'Hellraiser',
    category: 'horror',
    primaryColor: '#ecf0f1',
    secondaryColor: '#9b59b6',
    weaponType: 'puzzlebox',
    weaponColor: '#d4af37',
    stats: { hp: 125, atk: 13, def: 8, spd: 6 },
    simple: { name: 'Puzzle Twist Spark', type: 'projectile', dmg: 1.0 },
    secondary: { name: 'Summon Chain Trap', type: 'zap', cd: 7, dmg: 1.7 },
    defense: { name: 'Cenobite Bargain', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Lament Configuration', type: 'portal_vortex', dmg: 5.0 }
  },
  {
    id: 'shepard',
    name: 'Commander Shepard',
    universe: 'Mass Effect',
    category: 'marine',
    primaryColor: '#34495e',
    secondaryColor: '#e74c3c',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 145, atk: 16, def: 10, spd: 6 },
    simple: { name: 'Omni-Blade / Rifle', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Singularity Field', type: 'gravity', cd: 7, dmg: 1.8 },
    defense: { name: 'Tech Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Mako Strike', type: 'melee_aoe', dmg: 5.1 }
  },
  {
    id: 'valtweller',
    name: 'Vault Dweller',
    universe: 'Fallout',
    category: 'tactical',
    primaryColor: '#f1c40f',
    secondaryColor: '#2980b9',
    weaponType: 'gun',
    weaponColor: '#7f8c8d',
    stats: { hp: 140, atk: 14, def: 9, spd: 6 },
    simple: { name: '10mm Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'V.A.T.S. Targeting', type: 'zap', cd: 5, dmg: 1.7 },
    defense: { name: 'Stimpak Charge', type: 'heal', dur: 1.5, reduce: 0.6 },
    special: { name: 'Mini Nuke (Fat Man)', type: 'rocket', dmg: 5.8 }
  },
  {
    id: 'doomslayer',
    name: 'Doom Slayer',
    universe: 'Doom',
    category: 'slayer',
    primaryColor: '#27ae60',
    secondaryColor: '#c0392b',
    weaponType: 'doomblade',
    weaponColor: '#bdc3c7',
    stats: { hp: 170, atk: 22, def: 11, spd: 5 },
    simple: { name: 'Super Shotgun Blast', type: 'shotgun', dmg: 1.4 },
    secondary: { name: 'Flame Belch', type: 'fire', cd: 6, dmg: 1.8 },
    defense: { name: 'Ice Bomb Cover', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'BFG 9000 Burst', type: 'beam_aoe', dmg: 6.0, color: '#39ff14' }
  },
  {
    id: 'malcolm',
    name: 'Malcolm',
    universe: 'Unreal',
    category: 'tactical',
    primaryColor: '#95a5a6',
    secondaryColor: '#3498db',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 140, atk: 16, def: 9, spd: 6 },
    simple: { name: 'Shock Rifle Beam', type: 'laser', dmg: 1.1 },
    secondary: { name: 'Flak Cannon Blast', type: 'shotgun', cd: 6, dmg: 1.9 },
    defense: { name: 'Shield Belt Shield', type: 'shield', dur: 2.5, reduce: 0.8 },
    special: { name: 'Redeemer Nuke', type: 'rocket', dmg: 5.6 }
  },
  
  // --- NEW 13 UNIVERSES HEROES ---
  {
    id: 'harry',
    name: 'Harry Potter',
    universe: 'Harry Potter',
    category: 'hacker',
    primaryColor: '#6c3483',
    secondaryColor: '#f1c40f',
    weaponType: 'wand',
    weaponColor: '#5c3a21',
    stats: { hp: 120, atk: 14, def: 7, spd: 7 },
    simple: { name: 'Expelliarmus', type: 'zap', dmg: 1.0 },
    secondary: { name: 'Stupefy Spell', type: 'projectile', cd: 6, dmg: 1.7 },
    defense: { name: 'Protego Shield', type: 'shield', dur: 2.2, reduce: 0.85 },
    special: { name: 'Expecto Patronum', type: 'magic_aoe', dmg: 4.8 }
  },
  {
    id: 'luke',
    name: 'Luke Skywalker',
    universe: 'Star Wars',
    category: 'slayer',
    primaryColor: '#2ecc71',
    secondaryColor: '#3498db',
    weaponType: 'greatsword',
    weaponColor: '#00ff00',
    stats: { hp: 140, atk: 18, def: 9, spd: 7 },
    simple: { name: 'Lightsaber Cut', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Force Push Blast', type: 'gravity', cd: 5, dmg: 1.8 },
    defense: { name: 'Saber Deflect', type: 'shield', dur: 2.0, reduce: 0.9 },
    special: { name: 'Jedi Mind Strike', type: 'beam_aoe', dmg: 5.2 }
  },
  {
    id: 'korben',
    name: 'Korben Dallas',
    universe: 'Le Cinquième Element',
    category: 'marine',
    primaryColor: '#d35400',
    secondaryColor: '#17202a',
    weaponType: 'gun',
    weaponColor: '#f39c12',
    stats: { hp: 145, atk: 16, def: 10, spd: 6 },
    simple: { name: 'ZF-1 Fire', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Mini-Rocket Mode', type: 'rocket', cd: 7, dmg: 1.9 },
    defense: { name: 'Cab Door Shield', type: 'shield', dur: 2.0, reduce: 0.75 },
    special: { name: 'Big Badaboom Blast', type: 'fire_aoe', dmg: 5.0 }
  },
  {
    id: 'cindy',
    name: 'Cindy Campbell',
    universe: 'Scary Movie',
    category: 'horror',
    primaryColor: '#ec407a',
    secondaryColor: '#ffffff',
    weaponType: 'fists',
    weaponColor: '#ffb6c1',
    stats: { hp: 125, atk: 12, def: 8, spd: 8 },
    simple: { name: 'Comedic Slap', type: 'melee', dmg: 0.9 },
    secondary: { name: 'Parody Scream', type: 'sound', cd: 5, dmg: 1.6 },
    defense: { name: 'Dumb Dodge Jump', type: 'dodge', dur: 1.8, reduce: 0.8 },
    special: { name: 'Slasher Movie Spoil', type: 'fear', dmg: 4.4 }
  },
  {
    id: 'isaac',
    name: 'Isaac Clarke',
    universe: 'Dead Space',
    category: 'marine',
    primaryColor: '#7e5109',
    secondaryColor: '#00ffff',
    weaponType: 'plasma_cutter',
    weaponColor: '#1a1104',
    stats: { hp: 150, atk: 17, def: 11, spd: 5 },
    simple: { name: 'Cutter Vertical', type: 'laser', dmg: 1.1 },
    secondary: { name: 'Stasis Slowdown', type: 'gravity', cd: 6, dmg: 1.6 },
    defense: { name: 'RIG Heavy Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Telekinetic Smash', type: 'gravity_aoe', dmg: 4.9 }
  },
  {
    id: 'rick',
    name: 'Rick Sanchez',
    universe: 'Rick & Morty',
    category: 'hacker',
    primaryColor: '#5dade2',
    secondaryColor: '#f4d03f',
    weaponType: 'portalgun',
    weaponColor: '#7d6608',
    stats: { hp: 130, atk: 16, def: 8, spd: 8 },
    simple: { name: 'Sci-Fi Raygun', type: 'laser', dmg: 1.1 },
    secondary: { name: 'Portal Fling Trap', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'Personal Bubble', type: 'shield', dur: 2.5, reduce: 0.9 },
    special: { name: 'Microverse Battery Overcharge', type: 'beam_aoe', dmg: 5.5 }
  },
  {
    id: 'pomni',
    name: 'Digital Circus',
    universe: 'Digital Circus',
    category: 'horror',
    primaryColor: '#c0392b',
    secondaryColor: '#2980b9',
    weaponType: 'juggleballs',
    weaponColor: '#f1c40f',
    stats: { hp: 115, atk: 11, def: 6, spd: 9 },
    simple: { name: 'Juggle Throw', type: 'projectile', dmg: 0.9 },
    secondary: { name: 'Glitch Flare', type: 'glitch', cd: 5, dmg: 1.7 },
    defense: { name: 'Cardboard Box Hide', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'Abstracted Panic Strike', type: 'dark_aoe', dmg: 4.6 }
  },
  {
    id: 'taichi',
    name: 'Tai & Agumon',
    universe: 'Digimon',
    category: 'tactical',
    primaryColor: '#f39c12',
    secondaryColor: '#27ae60',
    weaponType: 'fireclaw',
    weaponColor: '#d35400',
    stats: { hp: 140, atk: 17, def: 9, spd: 7 },
    simple: { name: 'Sharp Claw Scratch', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Baby Flame Spit', type: 'fire', cd: 5, dmg: 1.7 },
    defense: { name: 'Digivice Shield Shield', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'Mega Flame Breath', type: 'fire_aoe', dmg: 5.2 }
  },
  {
    id: 'jigsaw',
    name: 'Billy the Puppet',
    universe: 'Saw',
    category: 'horror',
    primaryColor: '#7b241c',
    secondaryColor: '#f2f4f4',
    weaponType: 'tricycle',
    weaponColor: '#1c2833',
    stats: { hp: 125, atk: 13, def: 8, spd: 7 },
    simple: { name: 'Tricycle Bump', type: 'melee', dmg: 1.0 },
    secondary: { name: 'Reverse Trap Clamp', type: 'projectile', cd: 7, dmg: 1.9 },
    defense: { name: 'Pig Costume Cover', type: 'dodge', dur: 2.0, reduce: 0.85 },
    special: { name: 'I Want To Play A Game', type: 'fear', dmg: 4.8 }
  },
  {
    id: 'tsukune',
    name: 'Moka Akashiya',
    universe: 'Rosario + Vampire',
    category: 'slayer',
    primaryColor: '#f5b041',
    secondaryColor: '#2c3e50',
    weaponType: 'kicking',
    weaponColor: '#cca43b',
    stats: { hp: 145, atk: 18, def: 9, spd: 8 },
    simple: { name: 'High Kick Sweep', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Vampiric Burst Burst', type: 'darkness', cd: 8, dmg: 2.0 },
    defense: { name: 'Outer Charm Charm', type: 'dodge', dur: 2.0, reduce: 0.8 },
    special: { name: 'Inner Vampire Slash', type: 'melee_aoe', dmg: 5.4 }
  },
  {
    id: 'negi',
    name: 'Negi Springfield',
    universe: 'Negima',
    category: 'hacker',
    primaryColor: '#ec7063',
    secondaryColor: '#f7dc6f',
    weaponType: 'magic_staff',
    weaponColor: '#a04000',
    stats: { hp: 130, atk: 15, def: 7, spd: 8 },
    simple: { name: 'Wind Arrow Storm', type: 'magic', dmg: 1.0 },
    secondary: { name: 'Lightning Spark Bolt', type: 'zap', cd: 6, dmg: 1.8 },
    defense: { name: 'Sagitta Magica Barrier', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'Magia Erebea Fusion', type: 'dark_aoe', dmg: 5.3 }
  },
  {
    id: 'motoko',
    name: 'Motoko Kusanagi',
    universe: 'Ghost in the Shell',
    category: 'tactical',
    primaryColor: '#5b2c6f',
    secondaryColor: '#85c1e9',
    weaponType: 'gun',
    weaponColor: '#17202a',
    stats: { hp: 135, atk: 16, def: 10, spd: 7 },
    simple: { name: 'SMG Bullet Fire', type: 'bullet', dmg: 1.1 },
    secondary: { name: 'Camouflage Strike Strike', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Cybernetic Shield Shield', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Ghost Hack Override', type: 'glitch', dmg: 5.1 }
  },
  {
    id: 'max',
    name: 'Mad Max',
    universe: 'Mad Max',
    category: 'tactical',
    primaryColor: '#78281f',
    secondaryColor: '#f5b041',
    weaponType: 'shotgun',
    weaponColor: '#1c2833',
    stats: { hp: 140, atk: 15, def: 9, spd: 6 },
    simple: { name: 'Interceptor Shells', type: 'shotgun', dmg: 1.1 },
    secondary: { name: 'Harpoon Hook Drag', type: 'projectile', cd: 5, dmg: 1.7 },
    defense: { name: 'Interceptor Door Block', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Thunderstick Volley', type: 'rocket', dmg: 5.2 }
  }
];

export const SYNERGIES_DB = [
  { id: 'marine', key: 'syn_marines', descKey: 'syn_marines_desc', category: 'marine', multiplier: { hp: 1.25 } },
  { id: 'slayer', key: 'syn_slayer', descKey: 'syn_slayer_desc', category: 'slayer', multiplier: { atk: 1.20 } },
  { id: 'horror', key: 'syn_horror', descKey: 'syn_horror_desc', category: 'horror', multiplier: { spd: 1.15 } },
  { id: 'hacker', key: 'syn_hackers', descKey: 'syn_hackers_desc', category: 'hacker', multiplier: { spd: 1.20 } }, // ATB speed boost
  { id: 'tactical', key: 'syn_tactical', descKey: 'syn_tactical_desc', category: 'tactical', multiplier: { def: 1.20 } }
];

export const EQUIP_ITEMS_DB = [
  // Gears of War
  { id: 'cog_armor', universe: 'Gears of War', name: { en: 'COG Combat Plate', fr: 'Plastron CGU' }, boost: { hp: 60, def: 6 }, cost: 100 },
  { id: 'frag_grenade', universe: 'Gears of War', name: { en: 'Frag Grenade Mod', fr: 'Grenade à Fragmentation' }, boost: { atk: 8 }, cost: 100 },
  { id: 'snub_pistol', universe: 'Gears of War', name: { en: 'Snub Pistol Holster', fr: 'Pistolet Snub' }, boost: { spd: 1 }, cost: 80 },
  // Halo
  {
    id: 'mjolnir_shield',
    universe: 'Halo',
    name: { en: 'MJOLNIR Mk VI Shield Lattice', fr: 'Maille de bouclier MJOLNIR Mk VI' },
    desc: {
      fr: 'Fragment de sous-systeme energetique inspire de l armure MJOLNIR du Spartan-II: il ne rend pas invincible, il restaure la logique Halo du bouclier rechargeable et de l avancee sous feu controle.',
      en: 'Energy subsystem fragment inspired by Spartan-II MJOLNIR armor: it does not make the wearer invincible, it restores Halo logic of rechargeable shielding and controlled advance under fire.'
    },
    boost: { hp: 50, def: 8 },
    cost: 100
  },
  {
    id: 'cortana_chip',
    universe: 'Halo',
    name: { en: 'Cortana Matrix Shard', fr: 'Eclat de matrice Cortana' },
    desc: {
      fr: 'Eclat de donnees tactiques sauve d une interface UNSC/Forerunner. A.R.C.A. l utilise comme aide de ciblage: prediction de trajectoire, lecture Covenant et verrouillage de noyau de faille.',
      en: 'Tactical data shard saved from a UNSC/Forerunner interface. A.R.C.A. uses it as targeting support: trajectory prediction, Covenant pattern reading, and rift-core lock.'
    },
    boost: { atk: 10 },
    cost: 120
  },
  {
    id: 'magnum_ammo',
    universe: 'Halo',
    name: { en: 'M6D AP Magazine', fr: 'Chargeur perforant M6D' },
    desc: {
      fr: 'Chargeur calibre 12.7mm associe au magnum M6D de l ere Installation 04. Dans une faille, chaque tir sert de repere UNSC: court, net, fiable quand la Trame brouille les armes lourdes.',
      en: '12.7mm magazine tied to the M6D magnum from the Installation 04 era. In a rift, each shot acts as a UNSC anchor: short, clean, reliable when the Thread scrambles heavy weapons.'
    },
    boost: { spd: 2 },
    cost: 90
  },
  // Alien
  { id: 'motion_tracker', universe: 'Alien', name: { en: 'M314 Motion Tracker', fr: 'Détecteur de Mouvements' }, boost: { def: 5, spd: 2 }, cost: 100 },
  { id: 'welding_torch', universe: 'Alien', name: { en: 'Industrial Welder', fr: 'Chalumeau de Soudure' }, boost: { atk: 6, hp: 30 }, cost: 90 },
  { id: 'acid_mask', universe: 'Alien', name: { en: 'Hazmat Acid Guard', fr: 'Masque Anti-Acide' }, boost: { hp: 80 }, cost: 110 },
  // Predator
  { id: 'medicomp', universe: 'Predator', name: { en: 'Yautja Medicomp', fr: 'Kit de Soin Yautja' }, boost: { hp: 90 }, cost: 120 },
  { id: 'bio_helmet', universe: 'Predator', name: { en: 'Thermal Bio-Helmet', fr: 'Bio-Casque Thermique' }, boost: { atk: 8, def: 4 }, cost: 110 },
  { id: 'gauntlet_pad', universe: 'Predator', name: { en: 'Computer Gauntlet', fr: 'Gantelet Ordinateur' }, boost: { spd: 2 }, cost: 80 },
  // Resident Evil
  {
    id: 'green_herb',
    universe: 'Resident Evil',
    name: { en: 'Green Herb First-Aid Mix', fr: 'Melange de premiers soins herbe verte' },
    desc: {
      fr: 'Plante medicale iconique des zones de survie Resident Evil. A.R.C.A. la traite comme une ancre de soin: elle rappelle la logique des ressources rares, du soin manuel et de la survie entre deux couloirs infectes.',
      en: 'Iconic medical plant from Resident Evil survival zones. A.R.C.A. treats it as a healing anchor: it restores the logic of scarce resources, manual recovery, and survival between infected corridors.'
    },
    boost: { hp: 100 },
    cost: 80
  },
  {
    id: 'stars_badge',
    universe: 'Resident Evil',
    name: { en: 'S.T.A.R.S. Field Badge', fr: 'Insigne de terrain S.T.A.R.S.' },
    desc: {
      fr: 'Insigne lie aux equipes Special Tactics And Rescue Service de Raccoon City. Dans la Breche, il renforce les protocoles de fouille, de couverture et de protection des survivants face aux B.O.W.',
      en: 'Badge tied to Raccoon City Special Tactics And Rescue Service teams. In the Breach, it reinforces search, cover, and survivor-protection protocols against B.O.W. threats.'
    },
    boost: { def: 8 },
    cost: 100
  },
  {
    id: 'laser_sight',
    universe: 'Resident Evil',
    name: { en: 'R.P.D. Custom Laser Sight', fr: 'Viseur laser custom R.P.D.' },
    desc: {
      fr: 'Module de precision adapte aux armes de poing de crise. Il transforme chaque munition en decision: viser le point faible, economiser les chargeurs et stopper une mutation avant qu elle ne franchisse la porte.',
      en: 'Precision module adapted for crisis sidearms. It turns every bullet into a decision: aim for the weak point, conserve magazines, and stop a mutation before it crosses the door.'
    },
    boost: { atk: 9 },
    cost: 110
  },
  // Silent Hill
  { id: 'steel_pipe', universe: 'Silent Hill', name: { en: 'Rusty Steel Pipe', fr: 'Tuyau de Fer Rouillé' }, boost: { atk: 12 }, cost: 90 },
  { id: 'pocket_radio', universe: 'Silent Hill', name: { en: 'Static Pocket Radio', fr: 'Radio Grésillante' }, boost: { def: 6, spd: 1 }, cost: 90 },
  { id: 'flauros', universe: 'Silent Hill', name: { en: 'The Flauros Artifact', fr: 'L\'Artefact Flauros' }, boost: { hp: 60, def: 6 }, cost: 120 },
  // Dino Crisis
  { id: 'plug_tool', universe: 'Dino Crisis', name: { en: 'Key Card Plug', fr: 'Prise de Sécurité' }, boost: { def: 6, spd: 2 }, cost: 90 },
  { id: 'hemo_pack', universe: 'Dino Crisis', name: { en: 'Hemostatic Patch', fr: 'Pansement Hémostatique' }, boost: { hp: 80 }, cost: 80 },
  { id: 'sl_carbine', universe: 'Dino Crisis', name: { en: 'Modified Carbine Stock', fr: 'Crosse de Carabine' }, boost: { atk: 10 }, cost: 110 },
  // The Matrix
  { id: 'sunglasses', universe: 'The Matrix', name: { en: 'Mirrored Sunglasses', fr: 'Lunettes Noires Miroir' }, boost: { def: 7, spd: 2 }, cost: 100 },
  { id: 'matrix_code', universe: 'The Matrix', name: { en: 'Digital Matrix Code', fr: 'Code Vert du Matrix' }, boost: { atk: 12 }, cost: 120 },
  { id: 'leather_coat', universe: 'The Matrix', name: { en: 'Reinforced Trenchcoat', fr: 'Trenchcoat en Cuir' }, boost: { hp: 70, def: 5 }, cost: 110 },
  // Stargate
  {
    id: 'gdo_key',
    universe: 'Stargate',
    name: { en: 'SGC GDO Iris Transmitter', fr: 'Transmetteur GDO iris SGC' },
    desc: {
      fr: 'Emetteur d identification SG-1 utilise avant de franchir la Porte vers la Terre. Dans une Breche, il devient une ancre defensive: ouvrir seulement aux signatures reconnues et fermer l iris aux faux dieux.',
      en: 'SG-1 identification transmitter used before crossing the Gate back to Earth. In a Breach, it becomes a defensive anchor: open only for recognized signatures and close the iris to false gods.'
    },
    boost: { def: 9 },
    cost: 100
  },
  {
    id: 'naquadah_fuel',
    universe: 'Stargate',
    name: { en: 'Naquadah Power Cell', fr: 'Cellule energetique au naquadah' },
    desc: {
      fr: 'Cellule de naquadah capable d alimenter technologies Goa uld ou dispositifs Tau ri modifies. A.R.C.A. la surveille: puissance enorme, surcharge facile, mais parfaite pour recalculer une adresse de Trame.',
      en: 'Naquadah cell able to power Goa uld technology or modified Tau ri devices. A.R.C.A. monitors it closely: huge power, easy overload, but perfect for recalculating a Thread address.'
    },
    boost: { atk: 8, hp: 40 },
    cost: 110
  },
  {
    id: 'staff_weapon',
    universe: 'Stargate',
    name: { en: 'Serpent Guard Staff Focusing Tip', fr: 'Embout focaliseur de lance serpent' },
    desc: {
      fr: 'Fragment de lance Jaffa recupere sur une garde Goa uld. Son signal rappelle la difference essentielle de Stargate: une arme concue pour terroriser peut devenir outil de liberation entre les mains d un Jaffa libre.',
      en: 'Jaffa staff fragment recovered from a Goa uld guard. Its signal recalls Stargate core difference: a weapon built to terrify can become a liberation tool in the hands of a free Jaffa.'
    },
    boost: { spd: 2 },
    cost: 80
  },
  // Half-Life
  {
    id: 'hev_battery',
    universe: 'Half-Life',
    name: { en: 'HEV Auxiliary Battery', fr: 'Batterie auxiliaire HEV' },
    desc: {
      fr: 'Module energetique de combinaison Hazardous Environment. Dans une Breche, il restaure la logique Half-Life du bouclier numerique, des alertes vocales et de la survie scientifique sous incident dimensionnel.',
      en: 'Hazardous Environment suit power module. In a Breach, it restores Half-Life logic: digital armor, suit warnings, and scientific survival during a dimensional incident.'
    },
    boost: { hp: 80, def: 5 },
    cost: 90
  },
  {
    id: 'snark_cage',
    universe: 'Half-Life',
    name: { en: 'Xen Snark Containment Cage', fr: 'Cage de confinement snark Xen' },
    desc: {
      fr: 'Cage de laboratoire contenant des snarks de Xen. A.R.C.A. l emploie comme ancre offensive instable: courte fenetre de chaos biologique, morsures rapides et pression sur les lignes Combine.',
      en: 'Laboratory cage containing Xen snarks. A.R.C.A. uses it as an unstable offensive anchor: short biological chaos window, fast bites, and pressure against Combine lines.'
    },
    boost: { atk: 9 },
    cost: 100
  },
  {
    id: 'longjump_mod',
    universe: 'Half-Life',
    name: { en: 'HEV Long Jump Module', fr: 'Module de saut long HEV' },
    desc: {
      fr: 'Module de mobilite Black Mesa concu pour traverser les espaces hostiles de Xen. Dans Multiverse Breach, il sert a franchir une rupture, quitter une case menacee ou transformer une fuite en repositionnement tactique.',
      en: 'Black Mesa mobility module designed to cross hostile Xen spaces. In Multiverse Breach, it crosses ruptures, exits threatened tiles, or turns retreat into tactical repositioning.'
    },
    boost: { spd: 3 },
    cost: 120
  },
  // Portal
  { id: 'longfall_boot', universe: 'Portal', name: { en: 'Long Fall Boots', fr: 'Bottes de Longue Chute' }, boost: { def: 8, spd: 2 }, cost: 110 },
  { id: 'potatos_battery', universe: 'Portal', name: { en: 'PotatOS AI Core', fr: 'PatatOS de Batterie' }, boost: { atk: 8 }, cost: 90 },
  { id: 'heart_cube', universe: 'Portal', name: { en: 'Companion Cube Heart', fr: 'Cœur de Cube de Voyage' }, boost: { hp: 120 }, cost: 130 },
  // Metal Gear
  { id: 'bandana_infinite', universe: 'Metal Gear', name: { en: 'Infinite Bandana', fr: 'Bandana Infini' }, boost: { atk: 12 }, cost: 150 },
  { id: 'cardboard_c', universe: 'Metal Gear', name: { en: 'Reinforced Box Cover', fr: 'Carton Renforcé' }, boost: { def: 9 }, cost: 90 },
  { id: 'ration_box', universe: 'Metal Gear', name: { en: 'Military Ration Pack', fr: 'Ration Militaire' }, boost: { hp: 90 }, cost: 80 },
  // Payday
  { id: 'armor_bag', universe: 'Payday', name: { en: 'Heavy Armor Bag', fr: 'Sac d\'Armures Lourdes' }, boost: { hp: 60, def: 8 }, cost: 100 },
  { id: 'drill_bit', universe: 'Payday', name: { en: 'Titanium Drill Bit', fr: 'Mèche de Perceuse Titanium' }, boost: { atk: 10 }, cost: 110 },
  { id: 'zipline_c', universe: 'Payday', name: { en: 'Escape Zipline Hook', fr: 'Crochet de Tyrolienne' }, boost: { spd: 2 }, cost: 80 },
  // Vocaloid
  { id: 'miku_ribbon', universe: 'Vocaloid', name: { en: 'Pink Twin Hair Ribbons', fr: 'Rubans Cheveux de Miku' }, boost: { hp: 50, spd: 4 }, cost: 110 },
  { id: 'onion_sword', universe: 'Vocaloid', name: { en: 'Sharp Spring Onion', fr: 'Poireau Tranchant' }, boost: { atk: 10 }, cost: 90 },
  { id: 'glowstick', universe: 'Vocaloid', name: { en: 'Cyber Concert Glowstick', fr: 'Bâton Lumineux de Concert' }, boost: { def: 6 }, cost: 80 },
  // Yu-Gi-Oh
  { id: 'millennium_puzzle', universe: 'Yu-Gi-Oh', name: { en: 'Millennium Puzzle Gold', fr: 'Puzzle du Millénium' }, boost: { hp: 100, atk: 10, def: 5 }, cost: 200 },
  { id: 'duel_disk', universe: 'Yu-Gi-Oh', name: { en: 'KC Duel Disk System', fr: 'Disque de Duel Kaiba' }, boost: { atk: 8, spd: 2 }, cost: 120 },
  { id: 'trap_card', universe: 'Yu-Gi-Oh', name: { en: 'Face-Down Trap Card', fr: 'Carte Piège Face Cachée' }, boost: { def: 9 }, cost: 100 },
  // Guilty Gear
  { id: 'outrage_fragment', universe: 'Guilty Gear', name: { en: 'Outrage Blade Fragment', fr: 'Fragment d\'Outrage' }, boost: { atk: 15 }, cost: 130 },
  { id: 'gear_core', universe: 'Guilty Gear', name: { en: 'Gear Cell Core', fr: 'Noyau Cellulaire Gear' }, boost: { hp: 80, def: 6 }, cost: 110 },
  { id: 'metal_belt', universe: 'Guilty Gear', name: { en: 'Heavy Metal Buckle Belt', fr: 'Ceinture à Boucle Rock' }, boost: { def: 8, spd: 1 }, cost: 95 },
  // BlazBlue
  { id: 'idea_engine', universe: 'BlazBlue', name: { en: 'Idea Engine Core', fr: 'Cœur d\'Idea Engine' }, boost: { hp: 90, atk: 8 }, cost: 120 },
  { id: 'azure_grimoire', universe: 'BlazBlue', name: { en: 'Azure Grimoire Replica', fr: 'Grimoire d\'Azur' }, boost: { atk: 12 }, cost: 140 },
  { id: 'restrict_band', universe: 'BlazBlue', name: { en: 'Gravity Limiter Band', fr: 'Anneau Limiteur de Gravité' }, boost: { def: 8, spd: 1 }, cost: 100 },
  // Slender Man
  { id: 'slender_page', universe: 'Slender Man', name: { en: 'Eerie Notebook Page', fr: 'Page de Carnet Maudite' }, boost: { def: 7, spd: 2 }, cost: 80 },
  { id: 'lens_filter', universe: 'Slender Man', name: { en: 'Glitch Camera Lens', fr: 'Lentille de Caméra Brouillée' }, boost: { atk: 8, def: 5 }, cost: 100 },
  { id: 'flashlight_b', universe: 'Slender Man', name: { en: 'High Lumen Battery', fr: 'Batterie Flashlight Torche' }, boost: { hp: 80 }, cost: 85 },
  // Chucky
  { id: 'voodoo_amulet', universe: 'Chucky', name: { en: 'Damballa Amulet', fr: 'Amulette de Damballa' }, boost: { hp: 70, atk: 8 }, cost: 120 },
  { id: 'kitchen_knife', universe: 'Chucky', name: { en: 'Polished Kitchen Knife', fr: 'Couteau de Cuisine Aiguisé' }, boost: { atk: 11 }, cost: 90 },
  { id: 'toy_battery', universe: 'Chucky', name: { en: 'Good Guy Battery', fr: 'Pile de Jouet Good Guy' }, boost: { def: 5, spd: 2 }, cost: 85 },
  // Hellraiser
  { id: 'cenobite_hook', universe: 'Hellraiser', name: { en: 'Barbed Cenobite Hook', fr: 'Crochet de Cénobite' }, boost: { atk: 13 }, cost: 120 },
  { id: 'puzzle_piece', universe: 'Hellraiser', name: { en: 'Golden Puzzle Gear', fr: 'Engrenage Lament Doré' }, boost: { hp: 70, def: 7 }, cost: 110 },
  { id: 'pillar_stone', universe: 'Hellraiser', name: { en: 'Pillar of Souls Fragment', fr: 'Fragment du Pilier des Âmes' }, boost: { def: 9 }, cost: 100 },
  // Mass Effect
  { id: 'omni_gel', universe: 'Mass Effect', name: { en: 'Omni-Gel Pack', fr: 'Pack d\'Omni-Gel' }, boost: { hp: 100 }, cost: 80 },
  { id: 'n7_chestplate', universe: 'Mass Effect', name: { en: 'N7 Heavy Carbon Armor', fr: 'Plastron Carbone N7' }, boost: { def: 10 }, cost: 130 },
  { id: 'element_zero', universe: 'Mass Effect', name: { en: 'Refined Element Zero', fr: 'Élément Zéro Purifié' }, boost: { atk: 10, spd: 1 }, cost: 120 },
  // Fallout
  { id: 'stimpak_box', universe: 'Fallout', name: { en: 'Stimpak Supply Box', fr: 'Boîte de Stimpaks Vault-Tec' }, boost: { hp: 110 }, cost: 80 },
  { id: 'bobblehead', universe: 'Fallout', name: { en: 'Vault Boy Bobblehead', fr: 'Figurine Vault Boy' }, boost: { atk: 6, def: 6, spd: 1 }, cost: 110 },
  { id: 'fusion_core', universe: 'Fallout', name: { en: 'T-60 Fusion Core', fr: 'Réacteur à Fusion' }, boost: { def: 11 }, cost: 100 },
  // Doom
  { id: 'crucible_guard', universe: 'Doom', name: { en: 'Crucible Hilt Plating', fr: 'Plaquage de Creuset' }, boost: { atk: 18 }, cost: 160 },
  { id: 'praetor_helm', universe: 'Doom', name: { en: 'Praetor Armored Helmet', fr: 'Casque d\'Armure Praetor' }, boost: { hp: 80, def: 9 }, cost: 130 },
  { id: 'argent_cell', universe: 'Doom', name: { en: 'Unstable Argent Cell', fr: 'Cellule d\'Énergie Argent' }, boost: { hp: 40, atk: 10 }, cost: 120 },
  // Unreal
  { id: 'shield_belt', universe: 'Unreal', name: { en: 'High Volt Shield Belt', fr: 'Ceinture à Bouclier UT' }, boost: { hp: 70, def: 10 }, cost: 120 },
  { id: 'jump_boots', universe: 'Unreal', name: { en: 'Anti-Gravity Jump Boots', fr: 'Bottes Anti-Gravité' }, boost: { spd: 4 }, cost: 100 },
  { id: 'udamage_power', universe: 'Unreal', name: { en: 'Double Damage U-Damage', fr: 'Amplificateur U-Damage' }, boost: { atk: 15 }, cost: 150 },

  // --- NEW 13 UNIVERSES RELICS ---
  // Harry Potter
  { id: 'gryffindor_sword', universe: 'Harry Potter', name: { en: 'Gryffindor Sword', fr: 'Épée de Gryffondor' }, boost: { atk: 10, hp: 50 }, cost: 100 },
  { id: 'invisibility_cloak', universe: 'Harry Potter', name: { en: 'Invisibility Cloak', fr: 'Cape d\'Invisibilité' }, boost: { def: 8, spd: 2 }, cost: 120 },
  { id: 'marauder_map', universe: 'Harry Potter', name: { en: 'Marauder\'s Map', fr: 'Carte du Maraudeur' }, boost: { spd: 3 }, cost: 80 },
  // Star Wars
  { id: 'blue_saber', universe: 'Star Wars', name: { en: 'Luke\'s Lightsaber', fr: 'Sabre Laser de Luke' }, boost: { atk: 15 }, cost: 150 },
  { id: 'jedi_holocron', universe: 'Star Wars', name: { en: 'Jedi Holocron', fr: 'Holocron Jedi' }, boost: { hp: 60, def: 5 }, cost: 100 },
  { id: 'jedi_robes', universe: 'Star Wars', name: { en: 'Jedi Robes', fr: 'Bures de Jedi' }, boost: { spd: 3 }, cost: 90 },
  // Le Cinquième Element
  { id: 'element_stones', universe: 'Le Cinquième Element', name: { en: 'Four Element Stones', fr: 'Pierres des Éléments' }, boost: { hp: 80 }, cost: 100 },
  { id: 'multipass', universe: 'Le Cinquième Element', name: { en: 'Leeloo Multi-Pass', fr: 'Multi-Pass de Leeloo' }, boost: { spd: 4 }, cost: 110 },
  { id: 'zf1_blaster', universe: 'Le Cinquième Element', name: { en: 'ZF-1 Blaster Weapon', fr: 'Blaster ZF-1' }, boost: { atk: 12 }, cost: 130 },
  // Scary Movie
  { id: 'cindy_diary', universe: 'Scary Movie', name: { en: 'Cindy\'s Highschool Diary', fr: 'Journal de Cindy' }, boost: { hp: 60, def: 4 }, cost: 80 },
  { id: 'ghostface_tape', universe: 'Scary Movie', name: { en: 'Scary Video Tape', fr: 'Cassette Vidéo Scary' }, boost: { atk: 8 }, cost: 90 },
  { id: 'comedy_mask', universe: 'Scary Movie', name: { en: 'Hilarious Scary Mask', fr: 'Masque d\'Effroi Comique' }, boost: { spd: 3 }, cost: 80 },
  // Dead Space
  { id: 'plasma_cutter_item', universe: 'Dead Space', name: { en: 'Industrial Plasma Cutter', fr: 'Cutter Plasma' }, boost: { atk: 14 }, cost: 140 },
  { id: 'rig_plate', universe: 'Dead Space', name: { en: 'RIG Suit Metal Plate', fr: 'Blindage de RIG' }, boost: { hp: 70, def: 6 }, cost: 100 },
  { id: 'stasis_battery', universe: 'Dead Space', name: { en: 'Stasis Charge Battery', fr: 'Pile Stase de RIG' }, boost: { spd: 2 }, cost: 80 },
  // Rick & Morty
  { id: 'portal_gun_item', universe: 'Rick & Morty', name: { en: 'Rick\'s Portal Gun', fr: 'Pistolet à Portails de Rick' }, boost: { atk: 12, spd: 2 }, cost: 150 },
  { id: 'rick_flask', universe: 'Rick & Morty', name: { en: 'Rick\'s Metallic Flask', fr: 'Flasque en Métal de Rick' }, boost: { hp: 90 }, cost: 80 },
  { id: 'plumbus', universe: 'Rick & Morty', name: { en: 'Universal Household Plumbus', fr: 'Plumbus Standard' }, boost: { def: 8 }, cost: 110 },
  // Digital Circus
  { id: 'pomni_hat', universe: 'Digital Circus', name: { en: 'Pomni\'s Jester Hat', fr: 'Chapeau de Pomni' }, boost: { hp: 60, def: 5 }, cost: 90 },
  { id: 'gloink_crown', universe: 'Digital Circus', name: { en: 'Gloink Queen Crown', fr: 'Couronne Gloink' }, boost: { atk: 9 }, cost: 100 },
  { id: 'glitch_abstract', universe: 'Digital Circus', name: { en: 'Abstracted Glitch Core', fr: 'Noyau d\'Abstraction' }, boost: { spd: 3 }, cost: 120 },
  // Digimon
  { id: 'courage_crest', universe: 'Digimon', name: { en: 'Crest of Courage', fr: 'Symbole du Courage' }, boost: { hp: 100 }, cost: 130 },
  { id: 'digivice_relic', universe: 'Digimon', name: { en: 'Classic Digivice', fr: 'Digivice Classique' }, boost: { def: 8 }, cost: 100 },
  { id: 'fire_ring', universe: 'Digimon', name: { en: 'Agumon Fire Ring', fr: 'Anneau de Feu Agumon' }, boost: { atk: 12 }, cost: 110 },
  // Saw
  { id: 'bear_trap', universe: 'Saw', name: { en: 'Reverse Bear Trap Key', fr: 'Clé de Piège à Ours' }, boost: { atk: 15 }, cost: 140 },
  { id: 'tape_recorder', universe: 'Saw', name: { en: 'Jigsaw Tape Recorder', fr: 'Dictaphone Jigsaw' }, boost: { def: 7, spd: 1 }, cost: 100 },
  { id: 'jigsaw_puzzle_piece', universe: 'Saw', name: { en: 'Puzzle Flesh Piece', fr: 'Pièce de Chair Découpée' }, boost: { hp: 80 }, cost: 90 },
  // Rosario + Vampire
  { id: 'rosario_cross', universe: 'Rosario + Vampire', name: { en: 'Moka Rosary Cross', fr: 'Croix de Moka' }, boost: { hp: 80, def: 6 }, cost: 130 },
  { id: 'vampire_bat', universe: 'Rosario + Vampire', name: { en: 'Lilith Vampire Bat', fr: 'Chauve-Souris Lilith' }, boost: { atk: 12 }, cost: 110 },
  { id: 'yokai_badge', universe: 'Rosario + Vampire', name: { en: 'Yokai Academy Uniform', fr: 'Uniforme de Yokai' }, boost: { spd: 2 }, cost: 90 },
  // Negima
  { id: 'pactio_card', universe: 'Negima', name: { en: 'Negi Pactio Card', fr: 'Carte de Pactio de Negi' }, boost: { hp: 70, atk: 7 }, cost: 110 },
  { id: 'magic_staff_item', universe: 'Negima', name: { en: 'Negi Magic Staff', fr: 'Bâton de Mage de Negi' }, boost: { atk: 11 }, cost: 100 },
  { id: 'wizard_robes', universe: 'Negima', name: { en: 'Woolsack Wizard Robes', fr: 'Robe de Magicien' }, boost: { def: 8 }, cost: 90 },
  // Ghost in the Shell
  { id: 'cyberbrain', universe: 'Ghost in the Shell', name: { en: 'Section 9 Cyberbrain', fr: 'Cyber-Cerveau Section 9' }, boost: { hp: 50, spd: 4 }, cost: 120 },
  { id: 'seburo_rifle', universe: 'Ghost in the Shell', name: { en: 'Seburo C-26A Rifle', fr: 'Fusil Seburo C-26A' }, boost: { atk: 14 }, cost: 130 },
  { id: 'thermoptic_cam', universe: 'Ghost in the Shell', name: { en: 'Thermoptic Camouflage', fr: 'Camouflage Optique' }, boost: { def: 9 }, cost: 110 },
  // Mad Max
  { id: 'db_shotgun', universe: 'Mad Max', name: { en: 'Sawed-Off Shotgun', fr: 'Fusil à Pompe Scié' }, boost: { atk: 12 }, cost: 110 },
  { id: 'v8_jacket', universe: 'Mad Max', name: { en: 'Leather Interceptor Jacket', fr: 'Blouson d\'Intercepteur' }, boost: { hp: 80, def: 6 }, cost: 100 },
  { id: 'v8_engine', universe: 'Mad Max', name: { en: 'Interceptor V8 Supercharger', fr: 'Compresseur V8 Interceptor' }, boost: { spd: 3 }, cost: 120 }
];

EQUIP_ITEMS_DB.push(...EXPANDED_GEAR);

export const EVENT_ITEMS_DB = {
  'Gears of War': {
    id: 'evt_gears_hammer',
    name: { en: 'Orbital Beacon', fr: 'Balise Orbitale CGU' },
    desc: { en: 'Targets all enemies with a secondary orbital blast from the Hammer of Dawn (150 damage).', fr: 'Cible tous les ennemis avec un tir secondaire du Rayon de l\'Aube (150 dégâts).' },
    effect: 'hammer_strike'
  },
  'Halo': {
    id: 'evt_halo_warthog',
    name: { en: 'M12 Warthog LZ Beacon', fr: 'Balise LZ Warthog M12' },
    desc: {
      en: 'Marks a temporary UNSC landing lane. A remote M12 Warthog crosses the breach, suppresses Covenant infantry, knocks back light targets, and briefly opens an extraction corridor.',
      fr: 'Marque une ligne d atterrissage UNSC temporaire. Un Warthog M12 traverse la breche, cloue l infanterie Covenant, repousse les cibles legeres et ouvre brievement un couloir d extraction.'
    },
    effect: 'warthog_run'
  },
  'Alien': {
    id: 'evt_alien_egg',
    name: { en: 'Xenomorph Egg', fr: 'Œuf de Xénomorphe' },
    desc: { en: 'Places an egg that hatches a Facehugger, paralyzing the strongest enemy for 5 seconds.', fr: 'Place un œuf qui libère un Facehugger, paralysant l\'ennemi le plus fort pendant 5 secondes.' },
    effect: 'facehugger_stun'
  },
  'Predator': {
    id: 'evt_pred_bomb',
    name: { en: 'Wrist-Gauntlet Bomb', fr: 'Bombe de Poignet Yautja' },
    desc: { en: 'Activates self-destruct countdown: deals 300 damage to all units on screen in 3 seconds.', fr: 'Déclenche le compte à rebours de bombe Yautja : inflige 300 dégâts à tous après 3 secondes.' },
    effect: 'self_destruct'
  },
  'Resident Evil': {
    id: 'evt_re_cure',
    name: { en: 'Anti-Viral Vaccine Case', fr: 'Mallette vaccin antiviral' },
    desc: {
      en: 'Deploys an emergency anti-viral kit derived from Raccoon City crisis protocols. It stabilizes the squad, slows infection logic, and denies Umbrella-style specimen conversion for a short window.',
      fr: 'Deploie un kit antiviral d urgence derive des protocoles de crise de Raccoon City. Il stabilise l escouade, ralentit la logique d infection et refuse la conversion des allies en specimens Umbrella pendant une courte fenetre.'
    },
    effect: 'heal_squad'
  },
  'Silent Hill': {
    id: 'evt_sh_fog',
    name: { en: 'Flauros Seal', fr: 'Sceau de Flauros' },
    desc: { en: 'Summons thick fog: blinds all enemies, reducing their accuracy and attack rate by 50% for 8 seconds.', fr: 'Invoque un brouillard épais : aveugle les ennemis, réduisant leur attaque de 50% pendant 8 secondes.' },
    effect: 'blind_fog'
  },
  'Dino Crisis': {
    id: 'evt_dc_lure',
    name: { en: 'Pheromone Lure', fr: 'Appât de Phéromone' },
    desc: { en: 'Attracts wild raptors who leap across the field, shredding enemies for 100 slash damage.', fr: 'Attire des raptors sauvages qui traversent le terrain, infligeant 100 dégâts de griffures aux ennemis.' },
    effect: 'raptor_stampede'
  },
  'The Matrix': {
    id: 'evt_matrix_glitch',
    name: { en: 'Operator Code Hack', fr: 'Piratage de l\'Opérateur' },
    desc: { en: 'Hacks reality: freezes all enemies in place for 4 seconds.', fr: 'Pirate le code : gèle tous les ennemis sur place pendant 4 secondes.' },
    effect: 'freeze_matrix'
  },
  'Stargate': {
    id: 'evt_sg_shield',
    name: { en: 'SGC Iris Lockdown', fr: 'Verrouillage iris SGC' },
    desc: {
      en: 'Closes an SGC iris window over the breach. For a short time, hostile signatures cannot cross cleanly, Goa uld beams scatter, and the squad gains a protected fallback route.',
      fr: 'Ferme une fenetre d iris SGC sur la breche. Pendant un court instant, les signatures hostiles ne passent plus proprement, les tirs Goa uld se dispersent et l escouade gagne une route de repli protegee.'
    },
    effect: 'iris_invuln'
  },
  'Half-Life': {
    id: 'evt_hl_snarks',
    name: { en: 'Xen Snark Release Case', fr: 'Boite de liberation snark Xen' },
    desc: {
      en: 'Opens a controlled Xen containment case. Snarks flood the breach for a short window, harassing Combine or alien targets while the HEV signal marks a safe fallback route.',
      fr: 'Ouvre une caisse de confinement Xen sous controle. Des snarks envahissent brievement la breche, harcelent les cibles Combine ou aliennes pendant que le signal HEV marque une route de repli sure.'
    },
    effect: 'spawn_snarks'
  },
  'Portal': {
    id: 'evt_portal_cube',
    name: { en: 'Companion Cube', fr: 'Cube de Voyage' },
    desc: { en: 'Drops a heavy Companion Cube that shields the squad, absorbing up to 200 incoming damage.', fr: 'Dépose un Cube de Voyage protecteur qui absorbe jusqu\'à 200 points de dégâts.' },
    effect: 'companion_shield'
  },
  'Metal Gear': {
    id: 'evt_mg_chaff',
    name: { en: 'Chaff Grenade', fr: 'Grenade Chaff' },
    desc: { en: 'Disrupts electronic sensors, preventing enemies from preparing boss special attacks for 10 seconds.', fr: 'Brouille les radars, empêchant les boss de préparer leurs super attaques pendant 10 secondes.' },
    effect: 'chaff_scrambler'
  },
  'Payday': {
    id: 'evt_pay_drill',
    name: { en: 'Thermal Drill Droppod', fr: 'Perceuse Thermique' },
    desc: { en: 'Drops a giant thermal drill on the highest health enemy, dealing 200 armor-piercing damage.', fr: 'Parachute une perceuse thermique géante sur l\'ennemi le plus fort, infligeant 200 dégâts d\'armure.' },
    effect: 'drill_drop'
  },
  'Vocaloid': {
    id: 'evt_vocal_leek',
    name: { en: 'Giant Concert Speaker', fr: 'Haut-parleur de Concert' },
    desc: { en: 'Blasts J-Pop music that heals the squad for 80 HP and increases their Speed stat by 20% for the battle.', fr: 'Diffuse de la musique de concert : soigne l\'escouade de 80 PV et augmente la vitesse de 20%.' },
    effect: 'concert_buff'
  },
  'Yu-Gi-Oh': {
    id: 'evt_yugi_card',
    name: { en: 'Swords of Revealing Light', fr: 'Épées de Révélation de la Lumière' },
    desc: { en: 'Prevents all enemies from moving or attacking for 3 turns (or 6 seconds).', fr: 'Empêche tous les ennemis de se déplacer ou d\'attaquer pendant 6 secondes.' },
    effect: 'swords_block'
  },
  'Guilty Gear': {
    id: 'evt_gg_flame',
    name: { en: 'Junkyard Dog Spark', fr: 'Étincelle de Junkyard Dog' },
    desc: { en: 'Launches a fire wave across the floor dealing 130 damage and setting enemies on fire.', fr: 'Lance une vague de feu au sol infligeant 130 dégâts et brûlant les cibles.' },
    effect: 'fire_wave'
  },
  'BlazBlue': {
    id: 'evt_bb_azure',
    name: { en: 'Azure Grimoire Core', fr: 'Cœur de Grimoire d\'Azure' },
    desc: { en: 'Drains 50% health of all enemies and transfers it as healing to the squad.', fr: 'Vole 50 PV à tous les ennemis présents pour soigner les membres de l\'escouade.' },
    effect: 'azure_drain'
  },
  'Slender Man': {
    id: 'evt_slender_static',
    name: { en: 'Static Noise Tape', fr: 'Cassette Grésillante' },
    desc: { en: 'Causes screen static that stuns all standard enemies for 5 seconds.', fr: 'Provoque des interférences qui paralysent les monstres normaux pendant 5 secondes.' },
    effect: 'static_stun'
  },
  'Chucky': {
    id: 'evt_chucky_toy',
    name: { en: 'Jack-in-the-Box Lure', fr: 'Diable en Boîte Piégé' },
    desc: { en: 'Places a laughing toy trap: explodes when enemies touch it, dealing 180 damage.', fr: 'Place un diable en boîte explosif rieur qui inflige 180 dégâts aux ennemis à proximité.' },
    effect: 'jack_box_trap'
  },
  'Hellraiser': {
    id: 'evt_hell_box',
    name: { en: 'Lament Box Trigger', fr: 'Mécanisme Lament' },
    desc: { en: 'Spawns chains from rifts that bind enemies, preventing them from moving and reducing their Defense to 0 for 8 seconds.', fr: 'Fait surgir des chaînes qui immobilisent les cibles et réduisent leur Défense à 0 pendant 8 secondes.' },
    effect: 'chain_bind'
  },
  'Mass Effect': {
    id: 'evt_me_mako',
    name: { en: 'Mako Airdrop Beacon', fr: 'Balise Airdrop du Mako' },
    desc: { en: 'Drops a heavy Mako armored vehicle onto the field, dealing 220 crash damage to all enemies.', fr: 'Largue un blindé Mako lourd écrasant tous les ennemis au sol (220 dégâts).' },
    effect: 'mako_drop'
  },
  'Fallout': {
    id: 'evt_fo_nuke',
    name: { en: 'Fat Man Mini-Nuke', fr: 'Mini-Nuke Fat Man' },
    desc: { en: 'Fires a mini nuclear warhead: causes a huge explosion dealing 250 radiation damage to all enemies.', fr: 'Tire une mini-bombe nucléaire tactique : inflige 250 dégâts de radiations à tous.' },
    effect: 'fatman_nuke'
  },
  'Doom': {
    id: 'evt_doom_quad',
    name: { en: 'Quad Damage Powerup', fr: 'Power-Up Quad Damage' },
    desc: { en: 'Increases squad Attack power by 100% (double damage) for 10 seconds.', fr: 'Double les dégâts de toutes les attaques de l\'escouade pendant 10 secondes.' },
    effect: 'quad_damage'
  },
  'Unreal': {
    id: 'evt_ut_redeemer',
    name: { en: 'Redeemer Missile', fr: 'Missile Rédempteur' },
    desc: { en: 'Launches a slow thermonuclear missile. Deals 350 damage to all enemies, cleaning the screen.', fr: 'Tire un missile thermonucléaire Rédempteur lent infligeant 350 dégâts à tout le monde.' },
    effect: 'redeemer_blast'
  },

  // --- NEW 13 UNIVERSES EVENT ITEMS ---
  'Harry Potter': {
    id: 'evt_hp_wand',
    name: { en: 'Elder Wand', fr: 'Baguette de Sureau' },
    desc: { en: 'Casts Avada Kedavra secondary blast: deals 200 damage to all enemies and stuns them for 3 seconds.', fr: 'Lance un souffle d\'Avada Kedavra : inflige 200 dégâts à tous et les étourdit pendant 3 secondes.' },
    effect: 'spell_avada'
  },
  'Star Wars': {
    id: 'evt_sw_laser',
    name: { en: 'Death Star Targeter', fr: 'Viseur de l\'Étoile de la Mort' },
    desc: { en: 'Signals orbital superlaser blast dealing 250 damage to all enemies and slows them.', fr: 'Cible un tir de superlaser orbital : inflige 250 dégâts à tous et les ralentit.' },
    effect: 'orbital_laser'
  },
  'Le Cinquième Element': {
    id: 'evt_fe_stones',
    name: { en: 'Divine Elements Align', fr: 'Lumière Divine du 5e Élément' },
    desc: { en: 'Unleashes divine cosmic light: heals squad by 200 HP and grants invulnerability for 3 seconds.', fr: 'Libère la lumière divine : soigne l\'escouade de 200 PV et octroie l\'invulnérabilité pendant 3 secondes.' },
    effect: 'divine_light'
  },
  'Scary Movie': {
    id: 'evt_sm_joint',
    name: { en: '"Wassup" Party Joint', fr: 'Joint de Fête "Wassup"' },
    desc: { en: 'Plays funny wassup lines: stuns all enemies in a laughing loop for 5 seconds.', fr: 'Déclenche un fou rire collectif : étourdit tous les ennemis pendant 5 secondes.' },
    effect: 'wassup_high'
  },
  'Dead Space': {
    id: 'evt_ds_marker',
    name: { en: 'Red Marker Shard', fr: 'Fragment de Monolithe Rouge' },
    desc: { en: 'Emits Marker signals: drives all enemies insane, dealing 120 damage and paralyzing them for 4 seconds.', fr: 'Émet des ondes de Monolithe : rend les ennemis fous, infligeant 120 dégâts et les paralysant pendant 4 secondes.' },
    effect: 'marker_insanity'
  },
  'Rick & Morty': {
    id: 'evt_rm_box',
    name: { en: 'Mr. Meeseeks Box', fr: 'Boîte à Meeseeks' },
    desc: { en: 'Summons a horde of helpful Mr. Meeseeks to deal 150 damage and restore 80 HP to the squad.', fr: 'Invoque des Mr. Meeseeks qui infligent 150 dégâts et redonnent 80 PV à l\'escouade.' },
    effect: 'meeseeks_swarm'
  },
  'Digital Circus': {
    id: 'evt_dc_eyes',
    name: { en: 'Caine\'s Eyes', fr: 'Les Yeux de Caine' },
    desc: { en: 'Glitches reality: reduces all enemies defense to 0 and freezes them for 6 seconds.', fr: 'Pirate la scène : réduit la défense ennemie à 0 et les gèle pendant 6 secondes.' },
    effect: 'circus_glitch'
  },
  'Digimon': {
    id: 'evt_dm_warp',
    name: { en: 'Warp Digivolution Signal', fr: 'Signal de Warp-Évolution' },
    desc: { en: 'Agumon digivolves to WarGreymon and drops a massive Gaia Force fireball (280 damage).', fr: 'Agumon évolue en WarGreymon et lance une sphère Gaia Force géante (280 dégâts).' },
    effect: 'digivolve_warp'
  },
  'Saw': {
    id: 'evt_saw_trap',
    name: { en: 'Jigsaw Key', fr: 'Clé de Jigsaw' },
    desc: { en: 'Locks the strongest enemy in a ticking trap, dealing 250 damage and paralyzing it for 5 seconds.', fr: 'Piège l\'ennemi le plus fort : lui inflige 250 dégâts et le paralyse pendant 5 secondes.' },
    effect: 'trap_snap'
  },
  'Rosario + Vampire': {
    id: 'evt_rv_rosary',
    name: { en: 'Rosary Cross Release', fr: 'Libération du Rosaire' },
    desc: { en: 'Outer Moka releases rosary: Inner Moka sweeps dealing 200 damage and heals the squad for 100 HP.', fr: 'Libère le rosaire : Moka Interne balaie l\'écran infligeant 200 dégâts et soigne l\'escouade de 100 PV.' },
    effect: 'vampire_fury'
  },
  'Negima': {
    id: 'evt_ng_erebea',
    name: { en: 'Magia Erebea Dark Core', fr: 'Magia Erebea Sombre' },
    desc: { en: 'Negi fuses with dark magic: boosts squad Attack by 50% and Speed by 20% for 15 seconds.', fr: 'Negi fusionne avec la magie sombre : augmente l\'attaque de 50% et la vitesse de 20% pendant 15 secondes.' },
    effect: 'magia_erebea'
  },
  'Ghost in the Shell': {
    id: 'evt_gs_tachi',
    name: { en: 'Tachikoma Air Support', fr: 'Appui Aérien Tachikoma' },
    desc: { en: 'Summons a Tachikoma spider tank that fires grenades dealing 160 damage and locking enemies for 3 seconds.', fr: 'Déploie un Tachikoma tirant des grenades de barrage : inflige 160 dégâts et paralyse pendant 3 secondes.' },
    effect: 'tachikoma_strike'
  },
  'Mad Max': {
    id: 'evt_mm_car',
    name: { en: 'Interceptor Rig Summon', fr: 'Charge de l\'Interceptor' },
    desc: { en: 'The V8 Interceptor rams through all enemies, dealing 220 crash damage and pushing them back.', fr: 'L\'Interceptor V8 fonce sur le terrain : inflige 220 dégâts d\'écrasement et repousse les cibles.' },
    effect: 'interceptor_ram'
  }
};

Object.assign(EVENT_ITEMS_DB, EXPANDED_EVENT_ITEMS);

const extraHeroData = {
  'Gears of War': [
    { id: 'dom', name: 'Dom Santiago', cat: 'marine', color: '#3498db' },
    { id: 'cole', name: 'Augustus Cole', cat: 'slayer', color: '#f1c40f' }
  ],
  'Halo': [
    { id: 'arbiter', name: 'The Arbiter', cat: 'slayer', color: '#95a5a6' },
    { id: 'johnson', name: 'Sgt. Avery Johnson', cat: 'tactical', color: '#27ae60' }
  ],
  'Alien': [
    { id: 'hicks', name: 'Corporal Hicks', cat: 'tactical', color: '#7f8c8d' },
    { id: 'bishop', name: 'Bishop', cat: 'hacker', color: '#bdc3c7' }
  ],
  'Predator': [
    { id: 'city_hunter', name: 'City Hunter', cat: 'slayer', color: '#d35400' },
    { id: 'dutch', name: 'Dutch Schaefer', cat: 'tactical', color: '#16a085' }
  ],
  'Resident Evil': [
    { id: 'jill', name: 'Jill Valentine', cat: 'tactical', color: '#2980b9' },
    { id: 'wesker', name: 'Albert Wesker', cat: 'slayer', color: '#2c3e50' }
  ],
  'Silent Hill': [
    { id: 'james_s', name: 'James Sunderland', cat: 'horror', color: '#7f8c8d' },
    { id: 'heather', name: 'Heather Mason', cat: 'horror', color: '#e67e22' }
  ],
  'Dino Crisis': [
    { id: 'dylan', name: 'Dylan Morton', cat: 'tactical', color: '#27ae60' },
    { id: 'rick_dc', name: 'Rick', cat: 'hacker', color: '#e74c3c' }
  ],
  'The Matrix': [
    { id: 'trinity', name: 'Trinity', cat: 'slayer', color: '#2c3e50' },
    { id: 'morpheus', name: 'Morpheus', cat: 'tactical', color: '#34495e' }
  ],
  'Stargate': [
    { id: 'tealc', name: 'Teal\'c', cat: 'slayer', color: '#d35400' },
    { id: 'sam_carter', name: 'Samantha Carter', cat: 'hacker', color: '#9b59b6' },
    { id: 'daniel_jackson', name: 'Daniel Jackson', cat: 'hacker', color: '#d9b36c' }
  ],
  'Half-Life': [
    { id: 'barney', name: 'Barney Calhoun', cat: 'tactical', color: '#3498db' },
    { id: 'shephard', name: 'Adrian Shephard', cat: 'marine', color: '#7f8c8d' },
    { id: 'alyx_vance', name: 'Alyx Vance', cat: 'hacker', color: '#8e6f4e' }
  ],
  'Portal': [
    { id: 'atlas', name: 'Atlas', cat: 'tactical', color: '#2980b9' },
    { id: 'pbody', name: 'P-Body', cat: 'marine', color: '#d35400' }
  ],
  'Metal Gear': [
    { id: 'raiden', name: 'Raiden', cat: 'slayer', color: '#95a5a6' },
    { id: 'otacon', name: 'Otacon', cat: 'hacker', color: '#16a085' }
  ],
  'Payday': [
    { id: 'wolf_pd', name: 'Wolf', cat: 'slayer', color: '#c0392b' },
    { id: 'hoxton', name: 'Hoxton', cat: 'hacker', color: '#2980b9' }
  ],
  'Vocaloid': [
    { id: 'rin', name: 'Kagamine Rin', cat: 'tactical', color: '#f1c40f' },
    { id: 'luka', name: 'Megurine Luka', cat: 'slayer', color: '#ff7675' }
  ],
  'Yu-Gi-Oh': [
    { id: 'kaiba', name: 'Seto Kaiba', cat: 'hacker', color: '#2980b9' },
    { id: 'joey', name: 'Joey Wheeler', cat: 'slayer', color: '#e67e22' }
  ],
  'Guilty Gear': [
    { id: 'ky', name: 'Ky Kiske', cat: 'tactical', color: '#3498db' },
    { id: 'may_gg', name: 'May', cat: 'marine', color: '#ff7675' }
  ],
  'BlazBlue': [
    { id: 'jin', name: 'Jin Kisaragi', cat: 'tactical', color: '#74b9ff' },
    { id: 'noel', name: 'Noel Vermillion', cat: 'marine', color: '#0984e3' }
  ],
  'Slender Man': [
    { id: 'masky', name: 'Masky', cat: 'tactical', color: '#6c5ce7' },
    { id: 'hoody', name: 'Hoody', cat: 'slayer', color: '#ffeaa7' }
  ],
  'Chucky': [
    { id: 'tiffany', name: 'Tiffany Valentine', cat: 'slayer', color: '#dfe6e9' },
    { id: 'glen', name: 'Glen / Glenda', cat: 'tactical', color: '#a29bfe' }
  ],
  'Hellraiser': [
    { id: 'female_cenobite', name: 'Female Cenobite', cat: 'slayer', color: '#b2bec3' },
    { id: 'butterball', name: 'Butterball', cat: 'tactical', color: '#636e72' }
  ],
  'Mass Effect': [
    { id: 'garrus', name: 'Garrus Vakarian', cat: 'tactical', color: '#0984e3' },
    { id: 'liara', name: 'Liara T\'Soni', cat: 'hacker', color: '#74b9ff' }
  ],
  'Fallout': [
    { id: 'paladin', name: 'Paladin Danse', cat: 'marine', color: '#7f8c8d' },
    { id: 'nick_v', name: 'Nick Valentine', cat: 'hacker', color: '#2d3436' }
  ],
  'Doom': [
    { id: 'hayden', name: 'Samuel Hayden', cat: 'hacker', color: '#bdc3c7' },
    { id: 'doom_marine', name: 'UAC Marine', cat: 'marine', color: '#27ae60' }
  ],
  'Unreal': [
    { id: 'malcolm', name: 'Malcolm', cat: 'marine', color: '#e67e22' },
    { id: 'brock', name: 'Brock', cat: 'slayer', color: '#c0392b' }
  ],
  'Harry Potter': [
    { id: 'hermione', name: 'Hermione Granger', cat: 'hacker', color: '#fdcb6e' },
    { id: 'ron', name: 'Ron Weasley', cat: 'tactical', color: '#e67e22' }
  ],
  'Star Wars': [
    { id: 'vader', name: 'Darth Vader', cat: 'slayer', color: '#2d3436' },
    { id: 'han_solo', name: 'Han Solo', cat: 'tactical', color: '#ffeaa7' }
  ],
  'Le Cinquième Element': [
    { id: 'leeloo', name: 'Leeloo', cat: 'slayer', color: '#ff7675' },
    { id: 'ruby_rhod', name: 'Ruby Rhod', cat: 'tactical', color: '#fdcb6e' }
  ],
  'Scary Movie': [
    { id: 'cindy', name: 'Cindy Campbell', cat: 'horror', color: '#ffeaa7' },
    { id: 'shorty', name: 'Shorty Meeks', cat: 'tactical', color: '#55efc4' }
  ],
  'Dead Space': [
    { id: 'carver', name: 'John Carver', cat: 'marine', color: '#7f8c8d' },
    { id: 'ellie', name: 'Ellie Langford', cat: 'tactical', color: '#fdcb6e' }
  ],
  'Rick & Morty': [
    { id: 'morty', name: 'Morty Smith', cat: 'tactical', color: '#ffeaa7' },
    { id: 'summer', name: 'Summer Smith', cat: 'slayer', color: '#ff7675' }
  ],
  'Digital Circus': [
    { id: 'jax', name: 'Jax', cat: 'tactical', color: '#a29bfe' },
    { id: 'caine', name: 'Caine', cat: 'hacker', color: '#ff7675' }
  ],
  'Digimon': [
    { id: 'matt', name: 'Matt & Gabumon', cat: 'slayer', color: '#74b9ff' },
    { id: 'izzy', name: 'Izzy & Tentomon', cat: 'hacker', color: '#81ecec' }
  ],
  'Saw': [
    { id: 'amanda', name: 'Amanda Young', cat: 'slayer', color: '#d63031' },
    { id: 'hoffman', name: 'Mark Hoffman', cat: 'tactical', color: '#2d3436' }
  ],
  'Rosario + Vampire': [
    { id: 'tsukune', name: 'Tsukune Aono', cat: 'tactical', color: '#ffeaa7' },
    { id: 'kurumu', name: 'Kurumu Kurono', cat: 'horror', color: '#fd79a8' }
  ],
  'Negima': [
    { id: 'asuna', name: 'Asuna Kagurazaka', cat: 'slayer', color: '#e17055' },
    { id: 'evangeline', name: 'Evangeline McDowell', cat: 'horror', color: '#6c5ce7' }
  ],
  'Ghost in the Shell': [
    { id: 'batou', name: 'Batou', cat: 'marine', color: '#b2bec3' },
    { id: 'togusa', name: 'Togusa', cat: 'tactical', color: '#ffeaa7' }
  ],
  'Mad Max': [
    { id: 'furiosa', name: 'Furiosa', cat: 'slayer', color: '#7f8c8d' },
    { id: 'nux', name: 'Nux', cat: 'marine', color: '#ffeaa7' }
  ]
};

Object.assign(extraHeroData, EXPANDED_EXTRA_HERO_DATA);

Object.keys(extraHeroData).forEach(universe => {
  extraHeroData[universe].forEach(item => {
    let weapon = 'slash';
    let stats = { hp: 110, atk: 12, def: 6, spd: 5 };
    if (item.cat === 'marine') { stats = { hp: 130, atk: 10, def: 8, spd: 4 }; weapon = 'gun'; }
    if (item.cat === 'horror') { stats = { hp: 115, atk: 11, def: 7, spd: 5 }; weapon = 'slash'; }
    if (item.cat === 'slayer') { stats = { hp: 105, atk: 14, def: 5, spd: 6 }; weapon = 'slash'; }
    if (item.cat === 'hacker') { stats = { hp: 100, atk: 12, def: 6, spd: 6 }; weapon = 'laser'; }
    if (item.cat === 'tactical') { stats = { hp: 120, atk: 11, def: 7, spd: 4 }; weapon = 'gun'; }

    HEROES_DB.push({
      id: item.id,
      name: item.name,
      universe: universe,
      category: item.cat,
      primaryColor: item.color,
      weaponType: weapon,
      stats: stats,
      simple: { name: `${item.name} Light Strike`, dmg: 1.0 },
      secondary: { name: `${item.name} Heavy Strike`, cd: 8, dmg: 2.2 },
      defense: { name: `${item.name} Dodge`, dur: 2.0 },
      special: { name: `${item.name} Singularity force`, dmg: 4.5 }
    });
  });
});

const heroOverrides = {
  oneill: {
    simple: { name: 'P90 SG-1 Burst', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Zat nik tel Shot', type: 'zap', cd: 6, dmg: 1.65 },
    defense: { name: 'Iris Command Lock', type: 'shield', dur: 2.2, reduce: 0.82 },
    special: { name: 'Stargate Tactical Withdrawal', type: 'vortex', dmg: 4.7, color: '#6ed0ff' }
  },
  sam_carter: {
    weaponType: 'laser',
    weaponColor: '#6ed0ff',
    simple: { name: 'Naquadah Field Pulse', type: 'energy', dmg: 1.0 },
    secondary: { name: 'Chevron Recalculation', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Goa uld Shield Inversion', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'Naquadah Overload Window', type: 'energy_aoe', dmg: 4.6, color: '#9b59b6' }
  },
  tealc: {
    weaponType: 'staff',
    weaponColor: '#d35400',
    simple: { name: 'Jaffa Staff Blast', type: 'plasma', dmg: 1.1 },
    secondary: { name: 'First Prime Charge', type: 'melee', cd: 6, dmg: 1.9 },
    defense: { name: 'Kree Guard Stance', type: 'shield', dur: 2.0, reduce: 0.82 },
    special: { name: 'Free Jaffa Uprising', type: 'plasma_aoe', dmg: 4.8, color: '#d35400' }
  },
  daniel_jackson: {
    weaponType: 'tablet',
    weaponColor: '#d9b36c',
    simple: { name: 'Glyph Marking Shot', type: 'bullet', dmg: 0.95 },
    secondary: { name: 'Ancient Translation Break', type: 'hack', cd: 6, dmg: 1.45 },
    defense: { name: 'Diplomatic Delay', type: 'shield', dur: 1.8, reduce: 0.74 },
    special: { name: 'Ascended Archive Flash', type: 'light_aoe', dmg: 4.3, color: '#d9b36c' }
  },
  freeman: {
    simple: { name: 'Crowbar Vector', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Gravity Gun Punt', type: 'gravity', cd: 6, dmg: 1.8 },
    defense: { name: 'HEV Aux Power', type: 'shield', dur: 2.5, reduce: 0.85 },
    special: { name: 'Gluon Gun Cascade', type: 'beam', dmg: 4.8, color: '#33ccff' }
  },
  barney: {
    weaponType: 'gun',
    weaponColor: '#1f2d36',
    simple: { name: 'Black Mesa 9mm Cover', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Resistance Crossfire', type: 'bullet', cd: 7, dmg: 1.7 },
    defense: { name: 'Security Door Hold', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'City 17 Evac Route', type: 'support_aoe', dmg: 4.1, color: '#3498db' }
  },
  shephard: {
    weaponType: 'gun',
    weaponColor: '#2f3b32',
    simple: { name: 'HECU Rifle Burst', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Pipe Wrench Breach', type: 'melee', cd: 6, dmg: 1.8 },
    defense: { name: 'Marine Cover Order', type: 'shield', dur: 2.1, reduce: 0.78 },
    special: { name: 'Race X Suppression', type: 'explosive_aoe', dmg: 4.6, color: '#7f8c8d' }
  },
  alyx_vance: {
    weaponType: 'gun',
    weaponColor: '#3a2c25',
    simple: { name: 'Resistance Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Combine Lock Hack', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Gravity Glove Pull', type: 'dodge', dur: 1.9, reduce: 0.8 },
    special: { name: 'Dog Breach Assist', type: 'summon_aoe', dmg: 4.5, color: '#8e6f4e' }
  },
  jill: {
    weaponType: 'gun',
    weaponColor: '#1b1f2a',
    simple: { name: 'S.T.A.R.S. Pistol', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Lockpick Counterroute', type: 'tactical', cd: 7, dmg: 1.5 },
    defense: { name: 'Last Escape Dodge', type: 'dodge', dur: 2.0, reduce: 0.82 },
    special: { name: 'Anti-Nemesis Mine Line', type: 'trap_aoe', dmg: 4.4, color: '#79d0ff' }
  },
  wesker: {
    weaponType: 'gun',
    weaponColor: '#050505',
    simple: { name: 'Samurai Edge Precision', type: 'bullet', dmg: 1.15 },
    secondary: { name: 'Uroboros Dash', type: 'melee', cd: 6, dmg: 2.0 },
    defense: { name: 'Viral Reflex Step', type: 'dodge', dur: 1.8, reduce: 0.88 },
    special: { name: 'Uroboros Selection Burst', type: 'dark_aoe', dmg: 4.9, color: '#d7f26b' }
  }
};

Object.entries(heroOverrides).forEach(([id, override]) => {
  const hero = HEROES_DB.find(item => item.id === id);
  if (hero) Object.assign(hero, override);
});

export const getHeroById = (id) => HEROES_DB.find(h => h.id === id);
export const getRandomHero = () => HEROES_DB[Math.floor(Math.random() * HEROES_DB.length)];
export const getItemsForUniverse = (univ) => EQUIP_ITEMS_DB.filter(it => it.universe === univ);
export const getEventItemForUniverse = (univ) => EVENT_ITEMS_DB[univ] || EVENT_ITEMS_DB['Halo'];
