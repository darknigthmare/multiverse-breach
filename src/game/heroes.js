// Heroes Database with Crossover Gear, Event Items, and Synergies (37 Universes)

import { EXPANDED_EVENT_ITEMS, EXPANDED_EXTRA_HERO_DATA, EXPANDED_GEAR } from './expandedUniverses';
import { LORE_ACCURATE_HERO_EXPANSIONS, LORE_ACCURATE_HERO_OVERRIDES } from './loreAccuratePacks';
import {
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS,
  SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES
} from './solarOppositesSirenStarWarsPack.js';

export const HEROES_DB = [
  {
    id: 'arca_mirelle',
    name: 'Mirelle Suture',
    universe: 'Nexus de Convergence',
    category: 'hacker',
    primaryColor: '#39c5bb',
    secondaryColor: '#ffeb3b',
    weaponType: 'cards',
    weaponColor: '#d8f7ff',
    stats: { hp: 118, atk: 11, def: 7, spd: 8 },
    simple: { name: 'Fil de Resonance', type: 'bullet', dmg: 0.85 },
    secondary: { name: 'Patch de Trame', type: 'heal', cd: 6, dmg: 1.2 },
    defense: { name: 'Boucle de Sauvegarde', type: 'shield', dur: 2.0, reduce: 0.72 },
    special: { name: 'Suture du Voile', type: 'nexus_aoe', dmg: 3.4, color: '#39c5bb' }
  },
  {
    id: 'arca_bastion',
    name: 'Bastion Korr',
    universe: 'Nexus de Convergence',
    category: 'tactical',
    primaryColor: '#2f3f46',
    secondaryColor: '#ff8c00',
    weaponType: 'gun',
    weaponColor: '#1a1a1a',
    stats: { hp: 150, atk: 13, def: 11, spd: 4 },
    simple: { name: 'Rafale Atrium', type: 'bullet', dmg: 0.95 },
    secondary: { name: 'Balise Barricade', type: 'summon', cd: 7, dmg: 1.4 },
    defense: { name: 'Rempart d Ancre', type: 'shield', dur: 2.6, reduce: 0.82 },
    special: { name: 'Verrou de Convergence', type: 'beam_aoe', dmg: 3.8, color: '#ff8c00' }
  },
  {
    id: 'arca_nova',
    name: 'Nova Vey',
    universe: 'Nexus de Convergence',
    category: 'hacker',
    primaryColor: '#153b55',
    secondaryColor: '#7df9ff',
    weaponType: 'staff',
    weaponColor: '#7df9ff',
    stats: { hp: 110, atk: 12, def: 6, spd: 9 },
    simple: { name: 'Ping de Trame', type: 'bullet', dmg: 0.9 },
    secondary: { name: 'Surcadence A.R.C.A.', type: 'buff', cd: 7, dmg: 1.0 },
    defense: { name: 'Reflexe d Ancre', type: 'dash', dur: 1.4, reduce: 0.65 },
    special: { name: 'Reboot de Faille', type: 'nexus_aoe', dmg: 3.6, color: '#7df9ff' }
  },
  {
    id: 'arca_marrow',
    name: 'Marrow Kade',
    universe: 'Nexus de Convergence',
    category: 'slayer',
    primaryColor: '#2b1c32',
    secondaryColor: '#ff5b6e',
    weaponType: 'blade',
    weaponColor: '#ff5b6e',
    stats: { hp: 132, atk: 15, def: 7, spd: 6 },
    simple: { name: 'Coupe-Sceau', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Entaille de Breche', type: 'melee', cd: 6, dmg: 2.0 },
    defense: { name: 'Pas Entre Deux', type: 'dash', dur: 1.6, reduce: 0.7 },
    special: { name: 'Execution de Paradoxe', type: 'beam', dmg: 4.3, color: '#ff5b6e' }
  },
  {
    id: 'arca_sable',
    name: 'Sable Orison',
    universe: 'Nexus de Convergence',
    category: 'tactical',
    primaryColor: '#3d3430',
    secondaryColor: '#d9b86b',
    weaponType: 'gun',
    weaponColor: '#d9b86b',
    stats: { hp: 124, atk: 13, def: 9, spd: 5 },
    simple: { name: 'Tir de Balise', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Mine de Lecture', type: 'projectile', cd: 7, dmg: 1.8 },
    defense: { name: 'Couverture Archivee', type: 'shield', dur: 2.2, reduce: 0.76 },
    special: { name: 'Barrage du Cartographe', type: 'rocket', dmg: 4.0, color: '#d9b86b' }
  },
  {
    id: 'arca_loom',
    name: 'Loom Ivara',
    universe: 'Nexus de Convergence',
    category: 'marine',
    primaryColor: '#24364a',
    secondaryColor: '#39c5bb',
    weaponType: 'gun',
    weaponColor: '#d8f7ff',
    stats: { hp: 142, atk: 12, def: 10, spd: 5 },
    simple: { name: 'Rafale d Origine', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Drone de Suture', type: 'summon', cd: 8, dmg: 1.5 },
    defense: { name: 'Plaque Resonante', type: 'shield', dur: 2.4, reduce: 0.8 },
    special: { name: 'Ligne de Vie Nexus', type: 'heal', dmg: 3.2, color: '#39c5bb' }
  },
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
  // Nexus de Convergence - base game original content
  {
    id: 'nexus_anchor_coil',
    universe: 'Nexus de Convergence',
    name: { en: 'Anchor Coil', fr: 'Bobine d Ancre' },
    desc: {
      en: 'A.R.C.A. stabilizer issued to new Anchored Ones. It keeps a hero readable when a breach tries to rewrite their origin.',
      fr: 'Stabilisateur A.R.C.A. remis aux nouvelles Ancres. Il garde le heros lisible quand une breche tente de reecrire son origine.'
    },
    boost: { hp: 45, def: 4 },
    cost: 60
  },
  {
    id: 'arca_signal_lens',
    universe: 'Nexus de Convergence',
    name: { en: 'Signal Lens', fr: 'Lentille de Signal' },
    desc: {
      en: 'Focuses a damaged Thread into a targetable line instead of letting it scatter through the Atrium.',
      fr: 'Concentre une Trame abimee en ligne ciblable au lieu de la laisser se disperser dans l Atrium.'
    },
    boost: { atk: 7, spd: 1 },
    cost: 85
  },
  {
    id: 'origin_shard_guard',
    universe: 'Nexus de Convergence',
    name: { en: 'Origin Shard Guard', fr: 'Garde-Eclat d Origine' },
    desc: {
      en: 'A dull shard casing that absorbs failed rewrites before they reach the squad core.',
      fr: 'Gaine d eclat terne qui absorbe les reecritures ratees avant qu elles touchent le noyau d escouade.'
    },
    boost: { hp: 70, def: 5 },
    cost: 100
  },
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
  {
    id: 'steel_pipe',
    universe: 'Silent Hill',
    name: { en: 'South Vale Steel Pipe', fr: 'Tuyau de fer South Vale' },
    desc: {
      fr: 'Arme improvisee typique de Silent Hill: lourde, simple, presque honteuse. Elle rappelle que survivre dans le brouillard commence souvent par tenir a distance une peur trop proche.',
      en: 'Typical Silent Hill improvised weapon: heavy, simple, almost shameful. It recalls that surviving the fog often starts by keeping a too-close fear at distance.'
    },
    boost: { atk: 12 },
    cost: 90
  },
  {
    id: 'pocket_radio',
    universe: 'Silent Hill',
    name: { en: 'Static Pocket Radio', fr: 'Radio parasite de poche' },
    desc: {
      fr: 'Radio qui gronde quand un monstre approche. Dans le Nexus, son bruit blanc sert d alarme de Trame: elle ne dit pas quoi fuir, seulement que quelque chose a deja entendu le joueur.',
      en: 'Radio that growls when a monster nears. In the Nexus, its white noise acts as a Thread alarm: it does not say what to flee, only that something has already heard the player.'
    },
    boost: { def: 6, spd: 1 },
    cost: 90
  },
  {
    id: 'flauros',
    universe: 'Silent Hill',
    name: { en: 'Flauros Seal Fragment', fr: 'Fragment du sceau de Flauros' },
    desc: {
      fr: 'Artefact lie a l Ordre et aux forces enfermees de Silent Hill. A.R.C.A. l utilise comme verrou rituel: pas pour purifier la ville, mais pour empecher son dieu de traverser la Breche.',
      en: 'Artifact tied to the Order and Silent Hill bound forces. A.R.C.A. uses it as a ritual lock: not to purify the town, but to prevent its god from crossing the Breach.'
    },
    boost: { hp: 60, def: 6 },
    cost: 120
  },
  // Dino Crisis
  {
    id: 'plug_tool',
    universe: 'Dino Crisis',
    name: { en: 'Ibis Island Key Plug', fr: 'Prise de cle Ibis Island' },
    desc: {
      fr: 'Module de securite des laboratoires Third Energy. En gameplay, il represente les routes verrouillees de Dino Crisis: ouvrir la bonne porte au bon moment vaut parfois plus qu un tir.',
      en: 'Security module from Third Energy laboratories. In gameplay, it represents Dino Crisis locked routes: opening the right door at the right time can matter more than a shot.'
    },
    boost: { def: 6, spd: 2 },
    cost: 90
  },
  {
    id: 'hemo_pack',
    universe: 'Dino Crisis',
    name: { en: 'Hemostatic Field Patch', fr: 'Patch hemostatique de terrain' },
    desc: {
      fr: 'Soin d urgence pour morsures et griffures profondes. A.R.C.A. le classe comme ressource de survie rapide, coherente avec les poursuites de raptors et les replis sous alarme.',
      en: 'Emergency treatment for deep bites and claw wounds. A.R.C.A. classifies it as a fast survival resource, coherent with raptor chases and alarmed retreats.'
    },
    boost: { hp: 80 },
    cost: 80
  },
  {
    id: 'sl_carbine',
    universe: 'Dino Crisis',
    name: { en: 'SORT Carbine Stabilizer', fr: 'Stabilisateur carabine SORT' },
    desc: {
      fr: 'Piece d arme adaptee aux engagements courts contre specimens rapides. Elle transforme le tir mobile de Regina et Dylan en controle de couloir anti-raptor.',
      en: 'Weapon part adapted for short engagements against fast specimens. It turns Regina and Dylan mobile fire into anti-raptor corridor control.'
    },
    boost: { atk: 10 },
    cost: 110
  },
  // The Matrix
  {
    id: 'sunglasses',
    universe: 'The Matrix',
    name: { en: 'Operator Mirrored Sunglasses', fr: 'Lunettes miroir operateur' },
    desc: {
      fr: 'Signature visuelle des esprits libres et des Agents. A.R.C.A. l utilise comme filtre de lecture: voir le code sans oublier la personne derriere l avatar.',
      en: 'Visual signature of free minds and Agents. A.R.C.A. uses it as a reading filter: see the code without forgetting the person behind the avatar.'
    },
    boost: { def: 7, spd: 2 },
    cost: 100
  },
  {
    id: 'matrix_code',
    universe: 'The Matrix',
    name: { en: 'Falling Green Code Thread', fr: 'Fil de code vert tombant' },
    desc: {
      fr: 'Fragment lisible de la simulation. Il ne donne pas seulement des degats: il permet de comprendre quand une regle locale ment pour maintenir une prison.',
      en: 'Readable fragment of the simulation. It does not only grant damage: it helps understand when a local rule lies to maintain a prison.'
    },
    boost: { atk: 12 },
    cost: 120
  },
  {
    id: 'leather_coat',
    universe: 'The Matrix',
    name: { en: 'Nebuchadnezzar Reinforced Coat', fr: 'Manteau renforce Nebuchadnezzar' },
    desc: {
      fr: 'Manteau de combat charge dans la Matrice par un operateur de Zion. Il protege l avatar assez longtemps pour atteindre un telephone de sortie.',
      en: 'Combat coat loaded into the Matrix by a Zion operator. It protects the avatar long enough to reach an exit phone.'
    },
    boost: { hp: 70, def: 5 },
    cost: 110
  },
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

EXPANDED_GEAR.forEach(item => {
  const existing = EQUIP_ITEMS_DB.find(entry => entry.id === item.id);
  if (existing) Object.assign(existing, item);
  else EQUIP_ITEMS_DB.push(item);
});

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
    name: { en: 'Flauros Otherworld Seal', fr: 'Sceau Otherworld de Flauros' },
    desc: {
      en: 'Forces a Silent Hill siren cycle over the breach. Fog blinds hostile signatures, rust slows their attacks, and the Flauros mark prevents a false god from fully manifesting for a short window.',
      fr: 'Force un cycle de sirene Silent Hill sur la breche. Le brouillard aveugle les signatures hostiles, la rouille ralentit leurs attaques et la marque de Flauros empeche un faux dieu de se manifester completement pendant une courte fenetre.'
    },
    effect: 'blind_fog'
  },
  'Dino Crisis': {
    id: 'evt_dc_lure',
    name: { en: 'Third Energy Pheromone Lure', fr: 'Leurre pheromone Third Energy' },
    desc: {
      en: 'Projects a controlled prehistoric scent through a Third Energy pulse. Raptors rush the enemy line, tear open exposed targets, then the SORT beacon cuts the signal before the pack turns on the squad.',
      fr: 'Projette une piste prehistorique controlee via une impulsion Third Energy. Des raptors chargent la ligne ennemie, ouvrent les cibles exposees, puis la balise SORT coupe le signal avant que la meute ne se retourne contre l escouade.'
    },
    effect: 'raptor_stampede'
  },
  'The Matrix': {
    id: 'evt_matrix_glitch',
    name: { en: 'Zion Operator Code Hack', fr: 'Piratage operateur Zion' },
    desc: {
      en: 'A Zion operator injects a clean override into the simulation. Agents lose timing, exile programs desync, and the squad receives a short exit-phone window instead of a non-lore stun.',
      fr: 'Un operateur de Zion injecte une surcharge propre dans la simulation. Les Agents perdent leur timing, les programmes exiles se desynchronisent et l escouade recoit une courte fenetre de telephone de sortie.'
    },
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

EVENT_ITEMS_DB.ASMRZ.effect = 'concert_buff';
EVENT_ITEMS_DB['Spoof Movie'].effect = 'parody_rule_shift';

EVENT_ITEMS_DB['Nexus de Convergence'] = {
  id: 'evt_nexus_anchor_pulse',
  name: {
    en: 'A.R.C.A. Anchor Pulse',
    fr: 'Impulsion d Ancrage A.R.C.A.'
  },
  desc: {
    en: 'The Atrium emits a stabilizing pulse: hostile rewrites are interrupted and the squad gains a brief invulnerability window.',
    fr: 'L Atrium emet une impulsion stabilisatrice : les reecritures hostiles sont interrompues et l escouade gagne une breve fenetre d invulnerabilite.'
  },
  effect: 'iris_invuln',
  provenance: 'project-original'
};

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


const CANON_ROSTER_EXPANSION = {
  'Gears of War': [
    { id: 'baird', name: 'Damon Baird', cat: 'hacker', color: '#95a5a6' },
    { id: 'anya_stroud', name: 'Anya Stroud', cat: 'tactical', color: '#d8d3c0' },
    { id: 'hoffman_cog', name: 'Colonel Hoffman', cat: 'marine', color: '#4d5656' },
    { id: 'carmine_cog', name: 'Carmine', cat: 'marine', color: '#6c7a89' },
    { id: 'kait_diaz', name: 'Kait Diaz', cat: 'slayer', color: '#7b241c' }
  ],
  Halo: [
    { id: 'cortana', name: 'Cortana', cat: 'hacker', color: '#4dd2ff' },
    { id: 'noble_six', name: 'Noble Six', cat: 'marine', color: '#566573' },
    { id: 'buck_odst', name: 'Edward Buck', cat: 'tactical', color: '#34495e' },
    { id: 'kelly_087', name: 'Kelly-087', cat: 'slayer', color: '#1f7a3f' },
    { id: 'linda_058', name: 'Linda-058', cat: 'tactical', color: '#255f3f' }
  ],
  Alien: [
    { id: 'dallas_alien', name: 'Captain Dallas', cat: 'tactical', color: '#8e8c7f' },
    { id: 'parker_alien', name: 'Parker', cat: 'marine', color: '#7d6d5f' },
    { id: 'lambert_alien', name: 'Lambert', cat: 'horror', color: '#c6b6a3' },
    { id: 'newt_aliens', name: 'Newt', cat: 'hacker', color: '#e0c18c' },
    { id: 'ash_alien', name: 'Ash', cat: 'hacker', color: '#d8d8d8' }
  ],
  Predator: [
    { id: 'anna_predator', name: 'Anna Gonsalves', cat: 'tactical', color: '#8f6f45' },
    { id: 'billy_predator', name: 'Billy Sole', cat: 'slayer', color: '#3d5c3d' },
    { id: 'mac_predator', name: 'Mac Eliot', cat: 'marine', color: '#4b6043' },
    { id: 'harrigan_predator', name: 'Mike Harrigan', cat: 'tactical', color: '#6c5f54' },
    { id: 'greyback_yautja', name: 'Greyback Elder', cat: 'marine', color: '#6b604c' }
  ],
  'Resident Evil': [
    { id: 'chris_redfield', name: 'Chris Redfield', cat: 'marine', color: '#2e4053' },
    { id: 'claire_redfield', name: 'Claire Redfield', cat: 'tactical', color: '#b03a2e' },
    { id: 'ada_wong', name: 'Ada Wong', cat: 'hacker', color: '#c0392b' },
    { id: 'rebecca_chambers', name: 'Rebecca Chambers', cat: 'hacker', color: '#27ae60' },
    { id: 'barry_burton', name: 'Barry Burton', cat: 'marine', color: '#7f8c8d' },
    { id: 'carlos_oliveira', name: 'Carlos Oliveira', cat: 'marine', color: '#34495e' }
  ],
  'Silent Hill': [
    { id: 'harry_mason', name: 'Harry Mason', cat: 'horror', color: '#59656f' },
    { id: 'alessa_gillespie', name: 'Alessa Gillespie', cat: 'hacker', color: '#6c3483' },
    { id: 'maria_sh2', name: 'Maria', cat: 'horror', color: '#c27a7a' },
    { id: 'cybil_bennett', name: 'Cybil Bennett', cat: 'tactical', color: '#2e5f8a' },
    { id: 'claudia_wolf', name: 'Claudia Wolf', cat: 'hacker', color: '#8d7b60' }
  ],
  'Dino Crisis': [
    { id: 'gail_dc', name: 'Gail', cat: 'marine', color: '#34495e' },
    { id: 'paula_dc2', name: 'Paula', cat: 'slayer', color: '#d35400' },
    { id: 'dr_kirk', name: 'Dr. Kirk', cat: 'hacker', color: '#7f8c8d' },
    { id: 'david_dc2', name: 'David Fork', cat: 'tactical', color: '#3d7a4b' }
  ],
  'The Matrix': [
    { id: 'agent_smith', name: 'Agent Smith', cat: 'hacker', color: '#1a1d24' },
    { id: 'niobe_matrix', name: 'Niobe', cat: 'tactical', color: '#2c3e50' },
    { id: 'tank_matrix', name: 'Tank', cat: 'hacker', color: '#27ae60' },
    { id: 'oracle_matrix', name: 'The Oracle', cat: 'hacker', color: '#d9b36c' }
  ],
  Stargate: [
    { id: 'hammond_sgc', name: 'General Hammond', cat: 'tactical', color: '#7f8c8d' },
    { id: 'vala_mal_doran', name: 'Vala Mal Doran', cat: 'slayer', color: '#9b59b6' },
    { id: 'cam_mitchell', name: 'Cameron Mitchell', cat: 'marine', color: '#34495e' }
  ],
  'Half-Life': [
    { id: 'eli_vance', name: 'Eli Vance', cat: 'hacker', color: '#6e4f39' },
    { id: 'kleiner', name: 'Dr. Kleiner', cat: 'hacker', color: '#bdc3c7' },
    { id: 'vortigaunt_ally', name: 'Vortigaunt Ally', cat: 'hacker', color: '#6f8f4f' },
    { id: 'dog_hl2', name: 'Dog', cat: 'marine', color: '#95a5a6' }
  ],
  Portal: [
    { id: 'glados', name: 'GLaDOS', cat: 'hacker', color: '#dfe6e9' },
    { id: 'wheatley', name: 'Wheatley', cat: 'hacker', color: '#2980b9' },
    { id: 'cave_johnson', name: 'Cave Johnson', cat: 'tactical', color: '#f39c12' },
    { id: 'caroline_portal', name: 'Caroline', cat: 'hacker', color: '#e8d2a6' }
  ],
  'Metal Gear': [
    { id: 'meryl_mgs', name: 'Meryl Silverburgh', cat: 'tactical', color: '#a93226' },
    { id: 'liquid_snake', name: 'Liquid Snake', cat: 'slayer', color: '#7f5c38' },
    { id: 'the_boss_mgs', name: 'The Boss', cat: 'marine', color: '#d7d7c5' },
    { id: 'ocelot_mgs', name: 'Revolver Ocelot', cat: 'tactical', color: '#8e6e53' }
  ],
  Payday: [
    { id: 'chains_pd', name: 'Chains', cat: 'marine', color: '#2c3e50' },
    { id: 'houston_pd', name: 'Houston', cat: 'tactical', color: '#34495e' },
    { id: 'clover_pd', name: 'Clover', cat: 'slayer', color: '#27ae60' },
    { id: 'bain_pd', name: 'Bain', cat: 'hacker', color: '#95a5a6' }
  ],
  Vocaloid: [
    { id: 'len', name: 'Kagamine Len', cat: 'slayer', color: '#f5d742' },
    { id: 'meiko', name: 'MEIKO', cat: 'marine', color: '#c0392b' },
    { id: 'kaito', name: 'KAITO', cat: 'tactical', color: '#2980b9' },
    { id: 'gumi', name: 'GUMI', cat: 'hacker', color: '#2ecc71' }
  ],
  'Yu-Gi-Oh': [
    { id: 'tea_ygo', name: 'Tea Gardner', cat: 'hacker', color: '#f8c471' },
    { id: 'bakura_ygo', name: 'Ryo Bakura', cat: 'horror', color: '#d5dbdb' },
    { id: 'mai_ygo', name: 'Mai Valentine', cat: 'tactical', color: '#f4d03f' },
    { id: 'pegasus_ygo', name: 'Maximillion Pegasus', cat: 'hacker', color: '#d7bde2' }
  ],
  'Guilty Gear': [
    { id: 'dizzy_gg', name: 'Dizzy', cat: 'hacker', color: '#76d7c4' },
    { id: 'millia_gg', name: 'Millia Rage', cat: 'slayer', color: '#f7dc6f' },
    { id: 'axl_gg', name: 'Axl Low', cat: 'tactical', color: '#f4d03f' },
    { id: 'baiken_gg', name: 'Baiken', cat: 'slayer', color: '#e74c3c' }
  ],
  BlazBlue: [
    { id: 'rachel_bb', name: 'Rachel Alucard', cat: 'hacker', color: '#d7bde2' },
    { id: 'hazama_bb', name: 'Hazama', cat: 'horror', color: '#27ae60' },
    { id: 'tsubaki_bb', name: 'Tsubaki Yayoi', cat: 'tactical', color: '#f8c471' },
    { id: 'hakumen_bb', name: 'Hakumen', cat: 'slayer', color: '#ecf0f1' }
  ],
  'Slender Man': [
    { id: 'kate_slender', name: 'Kate', cat: 'horror', color: '#bdc3c7' },
    { id: 'lauren_slender', name: 'Lauren', cat: 'tactical', color: '#7f8c8d' },
    { id: 'charlie_slender', name: 'Charlie Matheson', cat: 'horror', color: '#2c3e50' }
  ],
  Chucky: [
    { id: 'kyle_chucky', name: 'Kyle', cat: 'tactical', color: '#5dade2' },
    { id: 'nica_chucky', name: 'Nica Pierce', cat: 'horror', color: '#6c3483' },
    { id: 'jake_chucky', name: 'Jake Wheeler', cat: 'hacker', color: '#3498db' }
  ],
  Hellraiser: [
    { id: 'pinhead', name: 'Pinhead', cat: 'horror', color: '#d5dbdb' },
    { id: 'chatterer', name: 'Chatterer', cat: 'slayer', color: '#c0b6a0' },
    { id: 'julia_cotton', name: 'Julia Cotton', cat: 'horror', color: '#8b0000' }
  ],
  'Mass Effect': [
    { id: 'tali', name: 'Tali Zorah', cat: 'hacker', color: '#8e44ad' },
    { id: 'wrex', name: 'Urdnot Wrex', cat: 'marine', color: '#7b241c' },
    { id: 'ashley_williams', name: 'Ashley Williams', cat: 'marine', color: '#34495e' },
    { id: 'mordin', name: 'Mordin Solus', cat: 'hacker', color: '#95a5a6' }
  ],
  Fallout: [
    { id: 'dogmeat', name: 'Dogmeat', cat: 'slayer', color: '#8b6f47' },
    { id: 'piper_wright', name: 'Piper Wright', cat: 'tactical', color: '#c0392b' },
    { id: 'preston_garvey', name: 'Preston Garvey', cat: 'marine', color: '#2c3e50' },
    { id: 'boone_fnv', name: 'Craig Boone', cat: 'tactical', color: '#566573' }
  ],
  Doom: [
    { id: 'vega_doom', name: 'VEGA', cat: 'hacker', color: '#85c1e9' },
    { id: 'night_sentinel', name: 'Night Sentinel', cat: 'slayer', color: '#d4ac0d' },
    { id: 'doom_marine_classic', name: 'Classic Doom Marine', cat: 'marine', color: '#27ae60' }
  ],
  Unreal: [
    { id: 'lauren_unreal', name: 'Lauren', cat: 'slayer', color: '#e74c3c' },
    { id: 'xan_krigor', name: 'Xan Kriegor', cat: 'hacker', color: '#f1c40f' },
    { id: 'prism_unreal', name: 'Prism', cat: 'tactical', color: '#9b59b6' }
  ],
  'Harry Potter': [
    { id: 'dumbledore', name: 'Albus Dumbledore', cat: 'hacker', color: '#9b59b6' },
    { id: 'sirius_black', name: 'Sirius Black', cat: 'slayer', color: '#2c3e50' },
    { id: 'snape', name: 'Severus Snape', cat: 'hacker', color: '#1c1c1c' },
    { id: 'voldemort', name: 'Lord Voldemort', cat: 'horror', color: '#d5dbdb' }
  ],
  'Star Wars': [
    { id: 'leia_organa', name: 'Leia Organa', cat: 'tactical', color: '#ecf0f1' },
    { id: 'obi_wan', name: 'Obi-Wan Kenobi', cat: 'slayer', color: '#5dade2' },
    { id: 'yoda', name: 'Yoda', cat: 'hacker', color: '#58d68d' },
    { id: 'darth_maul', name: 'Darth Maul', cat: 'slayer', color: '#a93226' }
  ],
  'Le Cinquième Element': [
    { id: 'zorg', name: 'Jean-Baptiste Emanuel Zorg', cat: 'hacker', color: '#6e2c00' },
    { id: 'cornelius', name: 'Vito Cornelius', cat: 'hacker', color: '#d5b895' },
    { id: 'munro_fifth', name: 'General Munro', cat: 'marine', color: '#34495e' }
  ],
  'Scary Movie': [
    { id: 'brenda_meeks', name: 'Brenda Meeks', cat: 'tactical', color: '#f4d03f' },
    { id: 'ray_wilkins', name: 'Ray Wilkins', cat: 'hacker', color: '#5dade2' },
    { id: 'doofy', name: 'Doofy Gilmore', cat: 'horror', color: '#ecf0f1' }
  ],
  'Dead Space': [
    { id: 'nicole_brennan', name: 'Nicole Brennan', cat: 'hacker', color: '#85c1e9' },
    { id: 'zach_hammond', name: 'Zach Hammond', cat: 'marine', color: '#566573' },
    { id: 'kendra_daniels', name: 'Kendra Daniels', cat: 'tactical', color: '#c0c0c0' }
  ],
  'Rick & Morty': [
    { id: 'birdperson', name: 'Birdperson', cat: 'marine', color: '#34495e' },
    { id: 'beth_smith', name: 'Beth Smith', cat: 'tactical', color: '#f5cba7' },
    { id: 'mr_meeseeks', name: 'Mr. Meeseeks', cat: 'slayer', color: '#5dade2' }
  ],
  'Digital Circus': [
    { id: 'ragatha', name: 'Ragatha', cat: 'tactical', color: '#c0392b' },
    { id: 'kinger', name: 'Kinger', cat: 'hacker', color: '#f7dc6f' },
    { id: 'gangle', name: 'Gangle', cat: 'horror', color: '#e74c3c' },
    { id: 'zooble', name: 'Zooble', cat: 'slayer', color: '#9b59b6' }
  ],
  Digimon: [
    { id: 'sora_biyomon', name: 'Sora & Biyomon', cat: 'tactical', color: '#e74c3c' },
    { id: 'mimi_palmon', name: 'Mimi & Palmon', cat: 'hacker', color: '#2ecc71' },
    { id: 'joe_gomamon', name: 'Joe & Gomamon', cat: 'marine', color: '#5dade2' },
    { id: 'kari_gatomon', name: 'Kari & Gatomon', cat: 'hacker', color: '#f8c471' },
    { id: 'tk_patamon', name: 'T.K. & Patamon', cat: 'tactical', color: '#f4d03f' }
  ],
  Saw: [
    { id: 'lawrence_gordon', name: 'Lawrence Gordon', cat: 'tactical', color: '#d5dbdb' },
    { id: 'lynn_denlon', name: 'Lynn Denlon', cat: 'hacker', color: '#c0392b' },
    { id: 'adam_saw', name: 'Adam Stanheight', cat: 'horror', color: '#7f8c8d' }
  ],
  'Rosario + Vampire': [
    { id: 'tsukune_aono', name: 'Tsukune Aono', cat: 'tactical', color: '#ffeaa7' },
    { id: 'yukari_rv', name: 'Yukari Sendo', cat: 'hacker', color: '#9b59b6' },
    { id: 'mizore_rv', name: 'Mizore Shirayuki', cat: 'horror', color: '#85c1e9' },
    { id: 'gin_rv', name: 'Gin Morioka', cat: 'slayer', color: '#95a5a6' }
  ],
  Negima: [
    { id: 'konoka_negima', name: 'Konoka Konoe', cat: 'hacker', color: '#f5b7b1' },
    { id: 'setsuna_negima', name: 'Setsuna Sakurazaki', cat: 'slayer', color: '#34495e' },
    { id: 'nodoka_negima', name: 'Nodoka Miyazaki', cat: 'hacker', color: '#d7bde2' }
  ],
  'Ghost in the Shell': [
    { id: 'aramaki', name: 'Daisuke Aramaki', cat: 'tactical', color: '#bdc3c7' },
    { id: 'saito_gits', name: 'Saito', cat: 'tactical', color: '#566573' },
    { id: 'ishikawa_gits', name: 'Ishikawa', cat: 'hacker', color: '#7f8c8d' },
    { id: 'tachikoma', name: 'Tachikoma', cat: 'hacker', color: '#3498db' }
  ],
  'Mad Max': [
    { id: 'toast_mm', name: 'Toast the Knowing', cat: 'tactical', color: '#d7b98e' },
    { id: 'capable_mm', name: 'Capable', cat: 'hacker', color: '#d98880' },
    { id: 'chumbucket_mm', name: 'Chumbucket', cat: 'hacker', color: '#b7950b' }
  ],
  Discworld: [
    { id: 'twoflower_dw', name: 'Twoflower', cat: 'hacker', color: '#f4d03f' },
    { id: 'death_dw', name: 'Death', cat: 'horror', color: '#d5dbdb' },
    { id: 'vetinari_dw', name: 'Lord Vetinari', cat: 'tactical', color: '#1c2833' },
    { id: 'nanny_ogg_dw', name: 'Nanny Ogg', cat: 'hacker', color: '#9b59b6' }
  ],
  Kaamelott: [
    { id: 'leodagan_kaamelott', name: 'Leodagan', cat: 'marine', color: '#5d4037' },
    { id: 'guenievre_kaamelott', name: 'Guenièvre', cat: 'hacker', color: '#f5cba7' },
    { id: 'lancelot_kaamelott', name: 'Lancelot', cat: 'slayer', color: '#d7dbdd' },
    { id: 'merlin_kaamelott', name: 'Merlin', cat: 'hacker', color: '#7d3c98' },
    { id: 'bohort_kaamelott', name: 'Bohort', cat: 'tactical', color: '#f9e79f' }
  ],
  Aliens: [
    { id: 'ripley_aliens', name: 'Ellen Ripley Aliens', cat: 'marine', color: '#8b8589' },
    { id: 'newt_hadley', name: 'Newt', cat: 'hacker', color: '#e0c18c' },
    { id: 'hudson_aliens', name: 'Hudson', cat: 'marine', color: '#6b7767' },
    { id: 'apone_aliens', name: 'Apone', cat: 'tactical', color: '#566573' }
  ],
  'Dungeon Meshi': [
    { id: 'chilchuck_meshi', name: 'Chilchuck', cat: 'tactical', color: '#a67c52' },
    { id: 'falin_meshi', name: 'Falin', cat: 'hacker', color: '#f5d6a1' },
    { id: 'izutsumi_meshi', name: 'Izutsumi', cat: 'slayer', color: '#5d6d7e' }
  ],
  'Hazbin Hotel': [
    { id: 'angel_dust_hazbin', name: 'Angel Dust', cat: 'slayer', color: '#f5b7b1' },
    { id: 'husk_hazbin', name: 'Husk', cat: 'tactical', color: '#7b241c' },
    { id: 'niffty_hazbin', name: 'Niffty', cat: 'horror', color: '#c0392b' },
    { id: 'sir_pentious_hazbin', name: 'Sir Pentious', cat: 'hacker', color: '#2e4053' }
  ],
  'Breaking Bad': [
    { id: 'jesse_pinkman', name: 'Jesse Pinkman', cat: 'slayer', color: '#f1c40f' },
    { id: 'saul_goodman', name: 'Saul Goodman', cat: 'hacker', color: '#f4d03f' },
    { id: 'mike_ehrmantraut', name: 'Mike Ehrmantraut', cat: 'tactical', color: '#566573' }
  ],
  Ghostbusters: [
    { id: 'venkman_gb', name: 'Peter Venkman', cat: 'hacker', color: '#7f8c8d' },
    { id: 'stantz_gb', name: 'Ray Stantz', cat: 'tactical', color: '#f4d03f' },
    { id: 'spengler_gb', name: 'Egon Spengler', cat: 'hacker', color: '#85c1e9' },
    { id: 'zeddemore_gb', name: 'Winston Zeddemore', cat: 'marine', color: '#34495e' }
  ],
  'Final Fantasy VII': [
    { id: 'barret_ff7', name: 'Barret Wallace', cat: 'marine', color: '#566573' },
    { id: 'redxiii_ff7', name: 'Red XIII', cat: 'slayer', color: '#c0392b' },
    { id: 'yuffie_ff7', name: 'Yuffie Kisaragi', cat: 'tactical', color: '#27ae60' },
    { id: 'vincent_ff7', name: 'Vincent Valentine', cat: 'horror', color: '#7b241c' }
  ],
  'Final Fantasy VIII': [
    { id: 'quistis_ff8', name: 'Quistis Trepe', cat: 'hacker', color: '#f4d03f' },
    { id: 'seifer_ff8', name: 'Seifer Almasy', cat: 'slayer', color: '#d7dbdd' },
    { id: 'laguna_ff8', name: 'Laguna Loire', cat: 'tactical', color: '#5dade2' }
  ],
  'Final Fantasy XIII': [
    { id: 'snow_ff13', name: 'Snow Villiers', cat: 'marine', color: '#d7dbdd' },
    { id: 'sazh_ff13', name: 'Sazh Katzroy', cat: 'tactical', color: '#34495e' },
    { id: 'fang_ff13', name: 'Fang', cat: 'slayer', color: '#7d3c98' }
  ],
  'Final Fantasy XV': [
    { id: 'ignis_ff15', name: 'Ignis Scientia', cat: 'tactical', color: '#566573' },
    { id: 'gladiolus_ff15', name: 'Gladiolus Amicitia', cat: 'marine', color: '#7b241c' },
    { id: 'lunafreya_ff15', name: 'Lunafreya', cat: 'hacker', color: '#f8c471' }
  ],
  'The Simpsons': [
    { id: 'marge_simpsons', name: 'Marge Simpson', cat: 'hacker', color: '#3498db' },
    { id: 'lisa_simpsons', name: 'Lisa Simpson', cat: 'hacker', color: '#f4d03f' },
    { id: 'maggie_simpsons', name: 'Maggie Simpson', cat: 'horror', color: '#5dade2' },
    { id: 'ned_flanders', name: 'Ned Flanders', cat: 'tactical', color: '#27ae60' }
  ],
  Futurama: [
    { id: 'amy_futurama', name: 'Amy Wong', cat: 'tactical', color: '#f5b7b1' },
    { id: 'hermes_futurama', name: 'Hermes Conrad', cat: 'hacker', color: '#27ae60' },
    { id: 'zoidberg_futurama', name: 'Zoidberg', cat: 'horror', color: '#e74c3c' }
  ],
  'Attack on Titan': [
    { id: 'levi_aot', name: 'Levi Ackerman', cat: 'slayer', color: '#566573' },
    { id: 'hange_aot', name: 'Hange Zoe', cat: 'hacker', color: '#8e6e53' },
    { id: 'erwin_aot', name: 'Erwin Smith', cat: 'tactical', color: '#d6b465' }
  ],
  'Death Note': [
    { id: 'misa_dn', name: 'Misa Amane', cat: 'hacker', color: '#f5b7b1' },
    { id: 'ryuk_dn', name: 'Ryuk', cat: 'horror', color: '#1c1c1c' },
    { id: 'near_dn', name: 'Near', cat: 'hacker', color: '#d5dbdb' }
  ],
  'Spy x Family': [
    { id: 'bond_spy', name: 'Bond Forger', cat: 'hacker', color: '#d7d3c8' },
    { id: 'fiona_spy', name: 'Fiona Frost', cat: 'tactical', color: '#d7dbdd' },
    { id: 'yuri_spy', name: 'Yuri Briar', cat: 'slayer', color: '#34495e' }
  ],
  Charmed: [
    { id: 'prue_charmed', name: 'Prue Halliwell', cat: 'hacker', color: '#8e44ad' },
    { id: 'paige_charmed', name: 'Paige Matthews', cat: 'hacker', color: '#d7bde2' },
    { id: 'leo_charmed', name: 'Leo Wyatt', cat: 'marine', color: '#85c1e9' }
  ],
  'Buffy the Vampire Slayer': [
    { id: 'xander_buffy', name: 'Xander Harris', cat: 'tactical', color: '#f8c471' },
    { id: 'giles_buffy', name: 'Rupert Giles', cat: 'hacker', color: '#7f8c8d' },
    { id: 'angel_buffy', name: 'Angel', cat: 'horror', color: '#1c2833' }
  ],
  'Team Fortress 2': [
    { id: 'demoman_tf2', name: 'Demoman', cat: 'slayer', color: '#7d3c98' },
    { id: 'heavy_tf2', name: 'Heavy', cat: 'marine', color: '#c0392b' },
    { id: 'engineer_tf2', name: 'Engineer', cat: 'hacker', color: '#f4d03f' },
    { id: 'medic_tf2', name: 'Medic', cat: 'hacker', color: '#ecf0f1' },
    { id: 'spy_tf2', name: 'Spy', cat: 'tactical', color: '#34495e' }
  ],
  'Left 4 Dead': [
    { id: 'coach_l4d', name: 'Coach', cat: 'marine', color: '#34495e' },
    { id: 'ellis_l4d', name: 'Ellis', cat: 'tactical', color: '#f8c471' },
    { id: 'rochelle_l4d', name: 'Rochelle', cat: 'hacker', color: '#d7dbdd' },
    { id: 'nick_l4d', name: 'Nick', cat: 'tactical', color: '#d6d6d6' }
  ],
  Yakuza: [
    { id: 'ichiban_yakuza', name: 'Ichiban Kasuga', cat: 'slayer', color: '#c0392b' },
    { id: 'saejima_yakuza', name: 'Taiga Saejima', cat: 'marine', color: '#7f8c8d' },
    { id: 'akiyama_yakuza', name: 'Shun Akiyama', cat: 'tactical', color: '#f4d03f' }
  ]
};

const mergeExtraHeroData = (target, additions = {}) => {
  Object.entries(additions).forEach(([universe, entries]) => {
    if (!Array.isArray(entries) || entries.length === 0) return;
    if (!target[universe]) target[universe] = [];
    const knownIds = new Set(target[universe].map(item => item.id));
    entries.forEach(item => {
      if (!item?.id || knownIds.has(item.id)) return;
      target[universe].push(item);
      knownIds.add(item.id);
    });
  });
};



const CANON_ROSTER_EXTRA_PATCH = {
  'Scary Movie': [
    { id: 'gail_hailstorm', name: 'Gail Hailstorm', cat: 'tactical', color: '#d7dbdd', simpleName: 'News Van Microphone Hit', secondaryName: 'Live Broadcast Distraction', defenseName: 'Camera Crew Cover', specialName: 'Parody News Meltdown' }
  ],
  Unreal: [
    { id: 'krieg_unreal', name: 'Kragoth', cat: 'slayer', color: '#7f8c8d', simpleName: 'Shock Rifle Combo', secondaryName: 'Ripper Disc Return', defenseName: 'Dodge Jump Guard', specialName: 'Godlike Streak' }
  ],
  Ghostbusters: [
    { id: 'janine_gb', name: 'Janine Melnitz', cat: 'hacker', color: '#e67e22', simpleName: 'Phone Desk Dispatch', secondaryName: 'Containment Unit Call', defenseName: 'Reception Glass Cover', specialName: 'Firehouse Coordination' },
    { id: 'dana_barrett_gb', name: 'Dana Barrett', cat: 'horror', color: '#c0392b', simpleName: 'Zuul Warning', secondaryName: 'Gatekeeper Possession Pulse', defenseName: 'Apartment Door Brace', specialName: 'Rooftop Temple Seal' },
    { id: 'louis_tully_gb', name: 'Louis Tully', cat: 'tactical', color: '#a67c52', simpleName: 'Accountant Panic Swing', secondaryName: 'Keymaster Charge', defenseName: 'Party Guest Evasion', specialName: 'Tax Season Gozer Audit' }
  ],
  'Buffy the Vampire Slayer': [
    { id: 'willow_buffy', name: 'Willow Rosenberg', cat: 'hacker', color: '#c0392b', weapon: 'magic', simpleName: 'Wicca Spark', secondaryName: 'Barrier Spell', defenseName: 'Resolve Face Ward', specialName: 'Dark Willow Surge' },
    { id: 'spike_buffy', name: 'Spike', cat: 'horror', color: '#d7dbdd', simpleName: 'Vampire Hook', secondaryName: 'Cigarette-Lit Dash', defenseName: 'Leather Coat Guard', specialName: 'Champion Amulet Blaze' }
  ],
  'Final Fantasy VIII': [
    { id: 'zell_ff8', name: 'Zell Dincht', cat: 'slayer', color: '#f4d03f', simpleName: 'Duel Punch Rush', secondaryName: 'Burning Rave', defenseName: 'SeeD Guard', specialName: 'My Final Heaven' },
    { id: 'selphie_ff8', name: 'Selphie Tilmitt', cat: 'hacker', color: '#f8c471', simpleName: 'Nunchaku Tap', secondaryName: 'Slot Magic Roll', defenseName: 'Festival Cheer', specialName: 'The End Limit' },
    { id: 'irvine_ff8', name: 'Irvine Kinneas', cat: 'tactical', color: '#7f5c38', simpleName: 'Galbadian Rifle Shot', secondaryName: 'Shot Limit Break', defenseName: 'Sharpshooter Cover', specialName: 'Fast Ammo Barrage' }
  ],
  'Final Fantasy XIII': [
    { id: 'snow_ff13', name: 'Snow Villiers', cat: 'marine', color: '#d7dbdd', simpleName: 'NORA Fist', secondaryName: 'Sentinel Taunt', defenseName: 'Guardian Corps Block', specialName: 'Sovereign Fist' },
    { id: 'sazh_ff13', name: 'Sazh Katzroy', cat: 'tactical', color: '#34495e', simpleName: 'Dual Pistol Burst', secondaryName: 'Chocobo Chick Feint', defenseName: 'Pilot Cover', specialName: 'Cold Blood Barrage' },
    { id: 'hope_ff13', name: 'Hope Estheim', cat: 'hacker', color: '#d5dbdb', weapon: 'boomerang', simpleName: 'Boomerang Throw', secondaryName: 'Synergist Boost', defenseName: 'Protect Shell', specialName: 'Alexander Summon Trace' }
  ],
  'Final Fantasy XV': [
    { id: 'prompto_ff15', name: 'Prompto Argentum', cat: 'tactical', color: '#f4d03f', simpleName: 'Pistol Snapshot', secondaryName: 'Piercer Shot', defenseName: 'Photo Roll Dodge', specialName: 'Trigger Happy Barrage' },
    { id: 'ardyn_ff15', name: 'Ardyn Izunia', cat: 'horror', color: '#7b241c', simpleName: 'Starscourge Cut', secondaryName: 'Royal Parry Theft', defenseName: 'Immortal Feint', specialName: 'Usurper Throne Collapse' },
    { id: 'cor_ff15', name: 'Cor Leonis', cat: 'slayer', color: '#566573', simpleName: 'Katana Draw', secondaryName: 'Immortal Counter', defenseName: 'Crownsguard Stance', specialName: 'Lucian Veteran Rush' }
  ],
  BioShock: [
    { id: 'jack_bioshock', name: 'Jack', cat: 'hacker', color: '#d9b36c', weapon: 'plasmid', simpleName: 'Electro Bolt', secondaryName: 'Plasmid Chain Shock', defenseName: 'Vita-Chamber Reboot', specialName: 'Would You Kindly Override' },
    { id: 'little_sister_bioshock', name: 'Little Sister', cat: 'horror', color: '#f5cba7', simpleName: 'ADAM Needle Tap', secondaryName: 'Gatherer Call', defenseName: 'Big Daddy Hide', specialName: 'Rapture Harvest Echo' },
    { id: 'andrew_ryan', name: 'Andrew Ryan', cat: 'tactical', color: '#7f5c38', simpleName: 'Golf Club Strike', secondaryName: 'Rapture Speech Command', defenseName: 'Private Office Lock', specialName: 'No Gods or Kings Edict' },
    { id: 'booker_dewitt_bioshock', name: 'Booker DeWitt', cat: 'tactical', color: '#5d6d7e', simpleName: 'Sky-Hook Strike', secondaryName: 'Vigor Shock Jockey', defenseName: 'Tear Cover', specialName: 'Columbia Skyline Rush' }
  ],
  Borderlands: [
    { id: 'roland_bl', name: 'Roland', cat: 'marine', color: '#34495e', simpleName: 'Crimson Lance Rifle', secondaryName: 'Scorpio Turret', defenseName: 'Soldier Shield', specialName: 'Crimson Raiders Rally' },
    { id: 'mordecai_bl', name: 'Mordecai', cat: 'tactical', color: '#8e6e53', simpleName: 'Sniper Shot', secondaryName: 'Bloodwing Dive', defenseName: 'Hunter Roll', specialName: 'Bird of Prey Barrage' },
    { id: 'brick_bl', name: 'Brick', cat: 'slayer', color: '#c0392b', simpleName: 'Berserk Punch', secondaryName: 'Explosive Uppercut', defenseName: 'Bandit Hide Guard', specialName: 'Slab King Rampage' },
    { id: 'tiny_tina_bl', name: 'Tiny Tina', cat: 'hacker', color: '#9b59b6', simpleName: 'Tea Party Toss', secondaryName: 'Bunny Bomb', defenseName: 'Bunker Blanket', specialName: 'Badonkadonk Chain' }
  ],
  'Evil Dead': [
    { id: 'pablo_evil_dead', name: 'Pablo Bolivar', cat: 'hacker', color: '#8e6e53', simpleName: 'Brujo Talisman Hit', secondaryName: 'Necronomicon Patch', defenseName: 'Trailer Door Brace', specialName: 'El Brujo Ritual Seal' },
    { id: 'kelly_evil_dead', name: 'Kelly Maxwell', cat: 'slayer', color: '#5d6d7e', simpleName: 'Meat Hammer Swing', secondaryName: 'Deadite Shotgun Blast', defenseName: 'Cabin Counter', specialName: 'Possession Breakout' },
    { id: 'ruby_evil_dead', name: 'Ruby Knowby', cat: 'horror', color: '#7b241c', weapon: 'dagger', simpleName: 'Kandarian Dagger', secondaryName: 'Book Page Curse', defenseName: 'Immortal Bargain', specialName: 'Dark One Contract' }
  ],
  'The Last of Us': [
    { id: 'tess_tlou', name: 'Tess', cat: 'tactical', color: '#6d5f4f', simpleName: 'Smuggler Pistol', secondaryName: 'Capitol Last Stand', defenseName: 'Quarantine Cover', specialName: 'Infected Delay Sacrifice' },
    { id: 'tommy_tlou', name: 'Tommy Miller', cat: 'marine', color: '#566573', simpleName: 'Rifle Patrol Shot', secondaryName: 'Jackson Ambush', defenseName: 'Settlement Guard', specialName: 'Sniper Overwatch' },
    { id: 'dina_tlou2', name: 'Dina', cat: 'tactical', color: '#8d6e63', simpleName: 'Switchblade Feint', secondaryName: 'Horseback Escape', defenseName: 'Theater Hideout', specialName: 'Seattle Support Route' },
    { id: 'abby_tlou2', name: 'Abby Anderson', cat: 'marine', color: '#5d6d7e', simpleName: 'WLF Rifle Burst', secondaryName: 'Hammer Counter', defenseName: 'Aquarium Route Guard', specialName: 'Seraphite Island Breakout' }
  ],
  'Metal Gear Rising': [
    { id: 'armstrong_mgr', name: 'Senator Armstrong', cat: 'marine', color: '#c0392b', simpleName: 'Nanomachine Punch', secondaryName: 'Football Charge', defenseName: 'Hardened Skin', specialName: 'Making the Mother of All Omelettes' },
    { id: 'blade_wolf_mgr', name: 'Blade Wolf', cat: 'slayer', color: '#95a5a6', simpleName: 'HF Chainsaw Bite', secondaryName: 'Stealth Pounce', defenseName: 'AI Evasion', specialName: 'LQ-84i Freedom Run' },
    { id: 'mistral_mgr', name: 'Mistral', cat: 'horror', color: '#8e44ad', simpleName: 'Dwarf Gekko Polearm', secondaryName: 'Tripod Arm Sweep', defenseName: 'Magnetic Guard', specialName: 'Winds of Destruction Spiral' },
    { id: 'monsoon_mgr', name: 'Monsoon', cat: 'hacker', color: '#9b59b6', simpleName: 'Magnetic Sai Cut', secondaryName: 'Dystopia Pincer Sweep', defenseName: 'Segmented Body Dodge', specialName: 'Memes of Destruction' }
  ],
  'Stargate Atlantis': [
    { id: 'ronon_dex', name: 'Ronon Dex', cat: 'slayer', color: '#5d4037', simpleName: 'Particle Magnum Shot', secondaryName: 'Satedan Rush', defenseName: 'Runner Instinct', specialName: 'Wraith Hunter Rampage' },
    { id: 'elizabeth_weir', name: 'Elizabeth Weir', cat: 'tactical', color: '#d7dbdd', simpleName: 'Atlantis Command Call', secondaryName: 'Diplomatic Lock', defenseName: 'Control Room Guard', specialName: 'Expedition Mandate' },
    { id: 'carson_beckett', name: 'Carson Beckett', cat: 'hacker', color: '#85c1e9', simpleName: 'Ancient Gene Scan', secondaryName: 'Medical Nanite Purge', defenseName: 'Infirmary Shield', specialName: 'Retrovirus Stabilizer' }
  ],
  'Stargate Universe': [
    { id: 'chloe_sgu', name: 'Chloe Armstrong', cat: 'hacker', color: '#d7bde2', simpleName: 'Ancient Interface Touch', secondaryName: 'Alien Signal Echo', defenseName: 'Destiny Corridor Hide', specialName: 'Transformation Data Burst' },
    { id: 'greer_sgu', name: 'Ronald Greer', cat: 'marine', color: '#34495e', simpleName: 'Destiny Rifle Burst', secondaryName: 'Military Breach Clear', defenseName: 'Hold the Line', specialName: 'Stargate Room Lockdown' },
    { id: 'matt_scott_sgu', name: 'Matthew Scott', cat: 'tactical', color: '#566573', simpleName: 'Lt. Sidearm Shot', secondaryName: 'Kino Recon Route', defenseName: 'Away Team Cover', specialName: 'Destiny Jump Gate Plan' },
    { id: 'eli_wallace_sgu', name: 'Eli Wallace', cat: 'hacker', color: '#85c1e9', simpleName: 'Kino Tablet Ping', secondaryName: 'Ancient Math Shortcut', defenseName: 'Destiny Console Cover', specialName: 'Gate Address Simulation' }
  ]
};

mergeExtraHeroData(extraHeroData, SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_EXPANSIONS);
mergeExtraHeroData(extraHeroData, EXPANDED_EXTRA_HERO_DATA);
mergeExtraHeroData(extraHeroData, CANON_ROSTER_EXPANSION);
mergeExtraHeroData(extraHeroData, CANON_ROSTER_EXTRA_PATCH);
mergeExtraHeroData(extraHeroData, LORE_ACCURATE_HERO_EXPANSIONS);

const knownHeroIds = new Set(HEROES_DB.map(hero => hero.id));

Object.keys(extraHeroData).forEach(universe => {
  extraHeroData[universe].forEach(item => {
    if (!item?.id || knownHeroIds.has(item.id)) return;
    knownHeroIds.add(item.id);

    let weapon = 'slash';
    let stats = { hp: 110, atk: 12, def: 6, spd: 5 };
    if (item.cat === 'marine') { stats = { hp: 130, atk: 10, def: 8, spd: 4 }; weapon = 'gun'; }
    if (item.cat === 'horror') { stats = { hp: 115, atk: 11, def: 7, spd: 5 }; weapon = 'slash'; }
    if (item.cat === 'slayer') { stats = { hp: 105, atk: 14, def: 5, spd: 6 }; weapon = 'slash'; }
    if (item.cat === 'hacker') { stats = { hp: 100, atk: 12, def: 6, spd: 6 }; weapon = 'laser'; }
    if (item.cat === 'tactical') { stats = { hp: 120, atk: 11, def: 7, spd: 4 }; weapon = 'gun'; }

    const resolvedWeapon = item.weaponType || item.weapon || weapon;
    const resolvedStats = item.stats || stats;
    const defaultSimpleType = resolvedWeapon === 'gun' ? 'bullet' : resolvedWeapon === 'laser' ? 'energy' : resolvedWeapon === 'wand' ? 'magic' : 'melee';

    HEROES_DB.push({
      ...item,
      id: item.id,
      name: item.name,
      universe: universe,
      category: item.cat,
      primaryColor: item.color,
      secondaryColor: item.secondaryColor || item.accent || item.color,
      weaponType: resolvedWeapon,
      weaponColor: item.weaponColor || item.color,
      stats: resolvedStats,
      simple: item.simple || { name: item.simpleName || `${item.name} Signature Strike`, type: defaultSimpleType, dmg: 1.0 },
      secondary: item.secondary || { name: item.secondaryName || `${item.name} Breach Technique`, type: resolvedWeapon === 'gun' ? 'projectile' : 'signature', cd: item.cd || 8, dmg: item.secondaryDmg || 2.2 },
      defense: item.defense || { name: item.defenseName || `${item.name} Guard`, type: 'shield', dur: item.dur || 2.0, reduce: item.reduce || 0.75 },
      special: item.special || { name: item.specialName || `${item.name} Origin Burst`, type: 'origin_aoe', dmg: item.specialDmg || 4.5, color: item.specialColor || item.color },
      ...(item.equipment ? { equipment: item.equipment } : {}),
      ...(item.incarnation ? { incarnation: item.incarnation } : {}),
      ...(item.canonStatus ? { canonStatus: item.canonStatus } : {})
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
  pyramidhead: {
    simple: { name: 'Great Knife Sentence', type: 'melee', dmg: 1.55 },
    secondary: { name: 'Spear of Judgment', type: 'projectile', cd: 9, dmg: 2.05 },
    defense: { name: 'Rust Otherworld Ward', type: 'shield', dur: 2.5, reduce: 0.72 },
    special: { name: 'Execution Fog Trial', type: 'darkness', dmg: 4.7, color: '#7c0a02' }
  },
  james_s: {
    weaponType: 'pipe',
    weaponColor: '#7f8c8d',
    simple: { name: 'Steel Pipe Swing', type: 'melee', dmg: 0.95 },
    secondary: { name: 'Static Radio Warning', type: 'fear', cd: 6, dmg: 1.35 },
    defense: { name: 'Health Drink Breath', type: 'heal', dur: 1.6, reduce: 0.58 },
    special: { name: 'Lakeview Truth Break', type: 'dark_aoe', dmg: 4.1, color: '#cbd8c8' }
  },
  heather: {
    weaponType: 'gun',
    weaponColor: '#2b1d16',
    simple: { name: 'Handgun in the Fog', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Aglaophotis Rejection', type: 'magic', cd: 7, dmg: 1.55 },
    defense: { name: 'Pendant Refusal', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'No God Birth', type: 'ritual_aoe', dmg: 4.5, color: '#e67e22' }
  },
  regina: {
    weaponType: 'gun',
    weaponColor: '#2a2a2a',
    simple: { name: 'SORT Glock Burst', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Tranquilizer Dart', type: 'projectile', cd: 6, dmg: 1.55 },
    defense: { name: 'Key Card Reposition', type: 'dodge', dur: 1.9, reduce: 0.8 },
    special: { name: 'Third Energy Extraction', type: 'temporal_aoe', dmg: 4.6, color: '#ff6b56' }
  },
  dylan: {
    weaponType: 'gun',
    weaponColor: '#24412f',
    simple: { name: 'TRAT Rifle Cover', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Shotgun Raptor Stop', type: 'shotgun', cd: 6, dmg: 1.8 },
    defense: { name: 'Survivor Escort Guard', type: 'shield', dur: 2.0, reduce: 0.78 },
    special: { name: 'Edward City Heavy Line', type: 'explosive_aoe', dmg: 4.7, color: '#27ae60' }
  },
  rick_dc: {
    weaponType: 'terminal',
    weaponColor: '#e74c3c',
    simple: { name: 'Security Terminal Zap', type: 'hack', dmg: 0.95 },
    secondary: { name: 'Door Lockout Trap', type: 'trap', cd: 6, dmg: 1.45 },
    defense: { name: 'SORT System Bypass', type: 'shield', dur: 1.8, reduce: 0.76 },
    special: { name: 'Third Energy Shutdown', type: 'hack_aoe', dmg: 4.25, color: '#e74c3c' }
  },
  neo: {
    simple: { name: 'Loaded Kung Fu Strike', type: 'melee', dmg: 1.15 },
    secondary: { name: 'Bullet Time Counter', type: 'dodge_strike', cd: 6, dmg: 1.8 },
    defense: { name: 'Stop Bullets', type: 'shield', dur: 2.2, reduce: 0.9 },
    special: { name: 'Source Code Rewrite', type: 'glitch_aoe', dmg: 5.2, color: '#39ff6e' }
  },
  trinity: {
    weaponType: 'gun',
    weaponColor: '#050505',
    simple: { name: 'Dual Pistol Entry', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Lobby Wall Run', type: 'melee', cd: 6, dmg: 1.7 },
    defense: { name: 'Exit Phone Route', type: 'dodge', dur: 2.0, reduce: 0.82 },
    special: { name: 'Motorcycle Extraction', type: 'support_aoe', dmg: 4.4, color: '#2c3e50' }
  },
  morpheus: {
    weaponType: 'katana',
    weaponColor: '#34495e',
    simple: { name: 'Dojo Loaded Strike', type: 'melee', dmg: 1.05 },
    secondary: { name: 'Red Pill Break', type: 'hack', cd: 6, dmg: 1.55 },
    defense: { name: 'Nebuchadnezzar Command', type: 'shield', dur: 2.1, reduce: 0.78 },
    special: { name: 'There Is No Spoon', type: 'mind_aoe', dmg: 4.5, color: '#39ff6e' }
  },
  buckethead_avatar: {
    weaponType: 'guitar',
    weaponColor: '#f5f5f5',
    simple: { name: 'Silent Shred Line', type: 'sound', dmg: 1.05 },
    secondary: { name: 'Bucketheadland Maze Riff', type: 'hack', cd: 6, dmg: 1.6 },
    defense: { name: 'White Mask Stillness', type: 'dodge', dur: 2.0, reduce: 0.82 },
    special: { name: 'Soothsayer Resonance Gate', type: 'music_aoe', dmg: 4.8, color: '#f5f5f5' }
  },
  death_cube_k_echo: {
    weaponType: 'drone',
    weaponColor: '#1a1a1a',
    simple: { name: 'Dark Ambient Pulse', type: 'darkness', dmg: 0.95 },
    secondary: { name: 'Death Cube Slow Room', type: 'fear', cd: 7, dmg: 1.45 },
    defense: { name: 'Drone Corridor Veil', type: 'shield', dur: 2.2, reduce: 0.8 },
    special: { name: 'Inverted Mask Lament', type: 'dark_aoe', dmg: 4.3, color: '#9d9d9d' }
  },
  pike_riff_signal: {
    weaponType: 'guitar',
    weaponColor: '#d9d9d9',
    simple: { name: 'Pike Pick Slash', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Motif Shift Solo', type: 'sound', cd: 6, dmg: 1.75 },
    defense: { name: 'Riff Route Step', type: 'dodge', dur: 1.8, reduce: 0.76 },
    special: { name: 'Pike Archive Cascade', type: 'music_aoe', dmg: 4.55, color: '#f5f5f5' }
  },
  soad_vocal: {
    weaponType: 'voice',
    weaponColor: '#b03a2e',
    simple: { name: 'Frontline Protest Cry', type: 'sound', dmg: 1.0 },
    secondary: { name: 'Chop Suey Tempo Cut', type: 'fear', cd: 6, dmg: 1.65 },
    defense: { name: 'Aerials Breath Shift', type: 'shield', dur: 2.0, reduce: 0.78 },
    special: { name: 'Toxicity Broadcast Break', type: 'music_aoe', dmg: 4.7, color: '#f1c40f' }
  },
  soad_guitar: {
    weaponType: 'guitar',
    weaponColor: '#1c2833',
    simple: { name: 'Staccato Riff Strike', type: 'melee', dmg: 1.1 },
    secondary: { name: 'Prison Song Siren Cut', type: 'sound', cd: 6, dmg: 1.8 },
    defense: { name: 'Measure Skip Dodge', type: 'dodge', dur: 1.8, reduce: 0.78 },
    special: { name: 'Syncopated Riot Wall', type: 'music_aoe', dmg: 4.55, color: '#1c2833' }
  },
  soad_bass: {
    weaponType: 'bass',
    weaponColor: '#7d6608',
    simple: { name: 'Groove Anchor Hit', type: 'melee', dmg: 1.0 },
    secondary: { name: 'Low Pulse Snare', type: 'trap', cd: 7, dmg: 1.5 },
    defense: { name: 'Protest Line Guard', type: 'shield', dur: 2.2, reduce: 0.82 },
    special: { name: 'Bassline Crowd Stabilizer', type: 'support_aoe', dmg: 4.25, color: '#7d6608' }
  },
  arthur_kaamelott: {
    weaponType: 'sword',
    weaponColor: '#d6b465',
    simple: { name: 'Excalibur Order Cut', type: 'melee', dmg: 1.08 },
    secondary: { name: 'Round Table Command', type: 'tactical', cd: 6, dmg: 1.55 },
    defense: { name: 'Royal Weariness Guard', type: 'shield', dur: 2.2, reduce: 0.82 },
    special: { name: 'Grail Quest Rally', type: 'support_aoe', dmg: 4.35, color: '#d6b465' }
  },
  perceval_kaamelott: {
    weaponType: 'sword',
    weaponColor: '#8ecae6',
    simple: { name: 'Oblique Logic Strike', type: 'melee', dmg: 0.98 },
    secondary: { name: 'Welsh Rule Misread', type: 'confuse', cd: 6, dmg: 1.45 },
    defense: { name: 'Lucky Misunderstanding', type: 'dodge', dur: 2.0, reduce: 0.84 },
    special: { name: 'C est Pas Faux Loop', type: 'mind_aoe', dmg: 4.2, color: '#8ecae6' }
  },
  karadoc_kaamelott: {
    weaponType: 'ration',
    weaponColor: '#b88746',
    simple: { name: 'Vannes Table Hit', type: 'melee', dmg: 1.02 },
    secondary: { name: 'Snack Break Hold', type: 'heal', cd: 7, dmg: 1.25 },
    defense: { name: 'Karadoc Ration Guard', type: 'shield', dur: 2.4, reduce: 0.84 },
    special: { name: 'Clan Survival Feast', type: 'support_aoe', dmg: 4.15, color: '#b88746' }
  },
  thomas_rogan_hotd: {
    weaponType: 'gun',
    weaponColor: '#25282b',
    simple: { name: 'AMS Handgun Double Tap', type: 'bullet', dmg: 1.05 },
    secondary: { name: 'Curien Mansion Rescue Shot', type: 'projectile', cd: 6, dmg: 1.8 },
    defense: { name: 'AMS Agent Sidestep', type: 'dodge', dur: 1.9, reduce: 0.84 },
    special: { name: 'Magician Weak-Point Volley', type: 'bullet_aoe', dmg: 4.6, color: '#ff4b3e' }
  },
  g_hotd: {
    weaponType: 'gun',
    weaponColor: '#303338',
    simple: { name: 'AMS Precision Shot', type: 'bullet', dmg: 1.02 },
    secondary: { name: 'G File Weak-Point Read', type: 'tactical', cd: 6, dmg: 1.65 },
    defense: { name: 'Cold Agent Cover', type: 'dodge', dur: 2.0, reduce: 0.84 },
    special: { name: 'DBR Laboratory Crossfire', type: 'bullet_aoe', dmg: 4.45, color: '#ff6e61' }
  },
  sophie_hotd: {
    weaponType: 'gun',
    weaponColor: '#85898f',
    simple: { name: 'Emergency Sidearm Shot', type: 'bullet', dmg: 0.86 },
    secondary: { name: 'Curien Research Warning', type: 'debuff', cd: 7, dmg: 1.35 },
    defense: { name: 'Laboratory First Aid', type: 'heal', dur: 2.4, reduce: 0.8 },
    special: { name: 'Mansion Survivor Protocol', type: 'support_aoe', dmg: 3.9, color: '#dc281b' }
  },
  james_taylor_hotd2: {
    weaponType: 'gun',
    weaponColor: '#282c31',
    simple: { name: 'AMS Critical Shot', type: 'bullet', dmg: 1.08 },
    secondary: { name: 'Venice Rescue Route', type: 'tactical', cd: 6, dmg: 1.72 },
    defense: { name: 'Civilian Cover Step', type: 'dodge', dur: 1.9, reduce: 0.84 },
    special: { name: 'Emperor Core Volley', type: 'bullet_aoe', dmg: 4.7, color: '#ff9d4a' }
  },
  gary_stewart_hotd2: {
    weaponType: 'gun',
    weaponColor: '#30363c',
    simple: { name: 'AMS Handgun Burst', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Canal Rescue Cover', type: 'projectile', cd: 6, dmg: 1.7 },
    defense: { name: 'Partner Guard', type: 'shield', dur: 2.1, reduce: 0.82 },
    special: { name: 'Goldman Tower Sweep', type: 'bullet_aoe', dmg: 4.45, color: '#ffc06d' }
  },
  amy_crystal_hotd2: {
    weaponType: 'gun',
    weaponColor: '#33383d',
    simple: { name: 'AMS Support Shot', type: 'bullet', dmg: 0.96 },
    secondary: { name: 'Civilian Evacuation Mark', type: 'tactical', cd: 7, dmg: 1.42 },
    defense: { name: 'AMS Rescue Medkit', type: 'heal', dur: 2.4, reduce: 0.82 },
    special: { name: 'Venice Agent Crossfire', type: 'bullet_aoe', dmg: 4.2, color: '#dc7a27' }
  },
  lisa_rogan_hotd3: {
    weaponType: 'shotgun',
    weaponColor: '#25282a',
    simple: { name: 'AMS Pump Shotgun Blast', type: 'shotgun', dmg: 1.16 },
    secondary: { name: 'Partner Rescue Shot', type: 'projectile', cd: 6, dmg: 1.9 },
    defense: { name: 'Facility Combat Roll', type: 'dodge', dur: 1.9, reduce: 0.85 },
    special: { name: 'Wheel of Fate Chamber Salvo', type: 'shotgun_aoe', dmg: 4.75, color: '#5dff88' }
  },
  g_hotd3: {
    weaponType: 'shotgun',
    weaponColor: '#313438',
    simple: { name: 'Veteran Shotgun Blast', type: 'shotgun', dmg: 1.12 },
    secondary: { name: 'G File Creature Read', type: 'tactical', cd: 6, dmg: 1.7 },
    defense: { name: 'Veteran Cover Step', type: 'dodge', dur: 2.0, reduce: 0.85 },
    special: { name: 'BioReactor Suppression', type: 'shotgun_aoe', dmg: 4.6, color: '#80ffab' }
  },
  dan_taylor_hotd3: {
    weaponType: 'shotgun',
    weaponColor: '#292d31',
    simple: { name: 'Commando Shotgun Blast', type: 'shotgun', dmg: 1.14 },
    secondary: { name: 'EFI Breach Advance', type: 'projectile', cd: 6, dmg: 1.86 },
    defense: { name: 'Rogan Team Cover', type: 'shield', dur: 2.2, reduce: 0.83 },
    special: { name: 'Death Corridor Last Stand', type: 'shotgun_aoe', dmg: 4.68, color: '#38ca66' }
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

Object.assign(heroOverrides, LORE_ACCURATE_HERO_OVERRIDES);
Object.assign(heroOverrides, SOLAR_OPPOSITES_SIREN_STAR_WARS_HERO_OVERRIDES);

Object.entries(heroOverrides).forEach(([id, override]) => {
  const hero = HEROES_DB.find(item => item.id === id);
  if (hero) Object.assign(hero, override);
});

export const getHeroById = (id) => HEROES_DB.find(h => h.id === id);
export const getRandomHero = () => HEROES_DB[Math.floor(Math.random() * HEROES_DB.length)];
export const getItemsForUniverse = (univ) => EQUIP_ITEMS_DB.filter(it => it.universe === univ);
export const getEventItemForUniverse = (univ) => EVENT_ITEMS_DB[univ] || EVENT_ITEMS_DB['Halo'];
