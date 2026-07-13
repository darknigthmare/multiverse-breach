// Lore-accurate roster and enemy expansion layer.
// This file keeps the big canon pass isolated while heroes.js and enemies.js inject it directly.

const catStats = {
  marine: { hp: 132, atk: 12, def: 9, spd: 5 },
  horror: { hp: 118, atk: 12, def: 7, spd: 6 },
  slayer: { hp: 118, atk: 15, def: 6, spd: 7 },
  hacker: { hp: 108, atk: 13, def: 7, spd: 7 },
  tactical: { hp: 124, atk: 12, def: 8, spd: 6 }
};

const hero = (id, name, cat, color, weaponType, simple, secondary, defense, special, specialDmg = 4.6) => ({
  id,
  name,
  cat,
  color,
  weaponType,
  weaponColor: color,
  stats: catStats[cat] || catStats.tactical,
  simple: { name: simple, type: weaponType === 'gun' ? 'bullet' : weaponType === 'laser' ? 'energy' : 'melee', dmg: 1.0 },
  secondary: { name: secondary, type: 'signature', cd: 7, dmg: 1.8 },
  defense: { name: defense, type: cat === 'hacker' ? 'hack' : cat === 'horror' ? 'dodge' : 'shield', dur: 2.0, reduce: 0.8 },
  special: { name: special, type: 'nexus_aoe', dmg: specialDmg, color }
});

const loadout = (weaponType, simple, secondary, defense, special, color = '#39c5bb', specialDmg = 4.6) => ({
  weaponType,
  weaponColor: color,
  simple: { name: simple, type: weaponType === 'gun' ? 'bullet' : weaponType === 'laser' ? 'energy' : 'melee', dmg: 1.0 },
  secondary: { name: secondary, type: 'signature', cd: 7, dmg: 1.8 },
  defense: { name: defense, type: 'shield', dur: 2.0, reduce: 0.8 },
  special: { name: special, type: 'nexus_aoe', dmg: specialDmg, color }
});

export const LORE_ACCURATE_HERO_EXPANSIONS = {
  Rammstein: [
    hero('oliver_riedel', 'Oliver Riedel', 'marine', '#3d3d3d', 'bass', 'Bassline Crush', 'Seemann Low-End Wave', 'Stage Rig Brace', 'Benzin Bass Detonation'),
    hero('christoph_schneider', 'Christoph Schneider', 'tactical', '#5c5c5c', 'drums', 'Industrial Drum Hit', 'Pounding Rhythm Break', 'Percussion Guard', 'Feuer Frei Drumline'),
    hero('flake_lorenz', 'Christian "Flake" Lorenz', 'hacker', '#8e44ad', 'keyboard', 'Synth Stab', 'Keyboard Treadmill Loop', 'Electronic Shield', 'Engel Keyboard Ascension')
  ],
  'System of a Down': [
    hero('john_dolmayan', 'John Dolmayan', 'tactical', '#566573', 'drums', 'Drumline Strike', 'Toxicity Tempo Lock', 'Rhythm Guard', 'Hypnotize Drum Break')
  ],
  'Rob Zombie': [
    hero('ginger_fish', 'Ginger Fish', 'tactical', '#8d6e63', 'drums', 'Shock Rock Drum Hit', 'Grindhouse Beat Trap', 'Stage Kit Guard', 'Living Dead Drumline')
  ],
  'Daft Punk': [
    hero('shep_interstella', 'Shep (Interstella 5555)', 'slayer', '#4aa3df', 'guitar', 'Crescendolls Guitar Shot', 'Digital Rescue Dive', 'Cosmic Fan Guard', 'Interstella Sacrifice')
  ],
  'Gears of War': [
    hero('baird', 'Damon Baird', 'hacker', '#c7c9c7', 'gun', 'Lancer Tech Burst', 'Jackbot Field Hack', 'COG Repair Cover', 'Declassified Kill Zone'),
    hero('anya_stroud', 'Anya Stroud', 'tactical', '#7b8f9b', 'gun', 'COG Command Shot', 'Intel Relay Mark', 'Tac-Com Evac Route', 'Sovereign Command Fire'),
    hero('kait_diaz', 'Kait Diaz', 'slayer', '#8c5f4a', 'knife', 'Outsider Knife Cut', 'Locust Link Break', 'Swarm Sense Guard', 'Hivemind Severance')
  ],
  Halo: [
    hero('cortana_fragment', 'Cortana Fragment', 'hacker', '#5fd7ff', 'laser', 'Data Spike', 'Forerunner Door Override', 'Hardlight Decoy', 'Rampancy Logic Storm'),
    hero('noble_six', 'Noble Six', 'marine', '#4d5f64', 'gun', 'DMR Precision Burst', 'Armor Lock Counter', 'Reach Last Stand', 'Sabre Strike Beacon'),
    hero('buck', 'Edward Buck', 'tactical', '#556b5d', 'gun', 'ODST SMG Burst', 'Drop Pod Flank', 'Helljumper Cover', 'Orbital Drop Shock')
  ],
  Alien: [
    hero('amanda_ripley', 'Amanda Ripley', 'horror', '#7e8581', 'scanner', 'Motion Tracker Ping', 'Access Rewire Trap', 'Locker Breath Hold', 'Sevastopol Overload'),
    hero('dallas_alien', 'Captain Dallas', 'tactical', '#8a7d68', 'gun', 'Nostromo Flamethrower Tap', 'Air Duct Sweep', 'MU-TH-UR Route Lock', 'Self Destruct Countdown'),
    hero('parker_alien', 'Parker', 'marine', '#6c5b4a', 'wrench', 'Maintenance Wrench Hit', 'Coolant Valve Burst', 'Engineering Hold', 'Nostromo Engine Surge')
  ],
  Predator: [
    hero('naru', 'Naru', 'tactical', '#8c6a45', 'axe', 'Rope Tomahawk', 'Mud Ambush Trap', 'Medicinal Cooling Hide', 'Predator Hunt Reversal'),
    hero('harrigan_p2_core', 'Mike Harrigan', 'tactical', '#6c5f54', 'gun', 'LAPD Pistol Burst', 'Subway Pursuit Shot', 'Concrete Jungle Cover', 'Trophy Room Stand'),
    hero('royce_predators_core', 'Royce', 'tactical', '#3f4f3f', 'gun', 'Mercenary Rifle Cut', 'Game Preserve Trap', 'Thermal Mask Feint', 'Super Predator Ambush')
  ],
  'Resident Evil': [
    hero('chris_redfield', 'Chris Redfield', 'marine', '#3f5673', 'gun', 'S.T.A.R.S. Rifle Burst', 'Boulder Punch Break', 'BSAA Cover Fire', 'Anti-B.O.W. Suppression'),
    hero('claire_redfield', 'Claire Redfield', 'tactical', '#c0392b', 'gun', 'Quickdraw Revolver', 'Rescue Route Signal', 'Medic Herb Guard', 'Code Veronica Escape'),
    hero('ada_wong', 'Ada Wong', 'slayer', '#8b0000', 'crossbow', 'Punisher Pistol Shot', 'Grapple Hook Kick', 'Spy Smoke Vanish', 'Red Dress Extraction')
  ],
  'Silent Hill': [
    hero('harry_mason', 'Harry Mason', 'horror', '#6f7d7a', 'flashlight', 'Flashlight Search', 'Radio Static Alert', 'Parent Resolve Guard', 'Alessa Trail Revelation'),
    hero('cybil_bennett', 'Cybil Bennett', 'tactical', '#355c7d', 'gun', 'Service Pistol Shot', 'Brahms Police Cover', 'Possession Resist', 'Good Ending Intervention'),
    hero('maria_sh2', 'Maria', 'horror', '#c26f8c', 'knife', 'Echo Tease Cut', 'Labyrinth Door Lure', 'Memory Double Guard', 'Born From A Wish')
  ],
  'Dino Crisis': [
    hero('gail_dc', 'Gail', 'marine', '#38453c', 'gun', 'SORT Carbine Burst', 'Hardline Extraction', 'Mission First Guard', 'Kirk Capture Protocol'),
    hero('paula_dc2', 'Paula', 'horror', '#d67c6c', 'knife', 'Jungle Ambush Cut', 'Time-Shift Signal', 'Survivor Hide', 'Edward City Rescue'),
    hero('david_folk_dc2', 'David Folk', 'marine', '#6b4f3d', 'gun', 'TRAT Shotgun Blast', 'Heavy Door Breach', 'Raptor Line Hold', 'Temporal Rescue Charge')
  ],
  'The Matrix': [
    hero('niobe', 'Niobe', 'tactical', '#202020', 'gun', 'Logos Pistol Line', 'Highway Countermove', 'Captain Evasive Drive', 'Zion Run Through Fire'),
    hero('link_matrix', 'Link', 'hacker', '#3b4a3b', 'terminal', 'Operator Weapon Drop', 'Exit Phone Trace', 'Nebuchadnezzar Uplink', 'Construct Reload Surge'),
    hero('seraph', 'Seraph', 'slayer', '#d9b86b', 'fists', 'Guardian Palm Strike', 'Oracle Door Test', 'Golden Code Guard', 'Seraphim Firewall Kick')
  ],
  Stargate: [
    hero('hammond', 'General Hammond', 'tactical', '#6d7d8b', 'command', 'SGC Command Mark', 'Iris Shutdown Order', 'Cheyenne Mountain Hold', 'Global Gate Authorization'),
    hero('cameron_mitchell', 'Cameron Mitchell', 'marine', '#2f4f3e', 'gun', 'F-302 Pilot Burst', 'Gate Team Push', 'Pilot Evasion Roll', 'Odyssey Fire Mission'),
    hero('vala_mal_doran', 'Vala Mal Doran', 'hacker', '#7d5f8c', 'zat', 'Goauld Trick Shot', 'Ancient Device Scam', 'Thief Exit Plan', 'Ark of Truth Gambit')
  ],
  'Half-Life': [
    hero('eli_vance', 'Eli Vance', 'hacker', '#5d4f42', 'terminal', 'Resistance Lab Pulse', 'Gravity Tech Insight', 'Black Mesa Mentor Guard', 'White Forest Rocket Launch'),
    hero('vortigaunt_ally', 'Vortigaunt Ally', 'hacker', '#6f8f4f', 'laser', 'Vortessence Bolt', 'Antlion Guard Tame', 'Vortigaunt Healing Chant', 'Collective Shockwave')
  ],
  Portal: [
    hero('doug_rattmann', 'Doug Rattmann', 'hacker', '#a68f66', 'terminal', 'Companion Cube Mark', 'Hidden Den Route', 'Schizoid Warning Mural', 'Lab Rat Override'),
    hero('glados_core', 'GLaDOS Potato Core', 'hacker', '#d9d4b8', 'laser', 'Passive Aggressive Zap', 'Neurotoxin Calculation', 'PotatOS Fail-Safe', 'Aperture Central Rewrite'),
    hero('cave_johnson_echo', 'Cave Johnson Echo', 'tactical', '#ff9f43', 'command', 'Combustible Lemon Throw', 'Test Subject Order', 'Moon Rock Shield', 'Science Isn t About Why')
  ],
  'Metal Gear': [
    hero('meryl_mgs', 'Meryl Silverburgh', 'tactical', '#8e6f4e', 'gun', 'Desert Eagle Shot', 'Codec Morale Call', 'Foxhound Cover Step', 'Shadow Moses Resolve'),
    hero('gray_fox', 'Gray Fox', 'slayer', '#bfc9ca', 'blade', 'High-Frequency Slash', 'Stealth Camo Lunge', 'Ninja Parry', 'Cyborg Fox Sacrifice'),
    hero('big_boss', 'Big Boss', 'tactical', '#4d5b43', 'gun', 'CQC Takedown', 'Outer Heaven Ambush', 'Legendary Soldier Guard', 'Boss Protocol')
  ],
  Payday: [
    hero('chains_pd', 'Chains', 'marine', '#2d3436', 'gun', 'Enforcer Shotgun', 'Ammo Bag Drop', 'Heavy Armor Brace', 'Assault Wave Breaker'),
    hero('clover_pd', 'Clover', 'slayer', '#2ecc71', 'gun', 'Akimbo Pistol Cut', 'Lockpick Sprint', 'Irish Luck Dodge', 'Queen of Heists'),
    hero('houston_pd', 'Houston', 'tactical', '#6c5ce7', 'gun', 'CAR-4 Burst', 'ECM Feedback', 'Hostage Trade Cover', 'Perfect Getaway Line')
  ],
  Vocaloid: [
    hero('len', 'Kagamine Len', 'tactical', '#f7d13d', 'microphone', 'Mirror Voice Note', 'Road Roller Cue', 'Twin Sync Guard', 'Kagamine Resonance'),
    hero('meiko', 'MEIKO', 'slayer', '#c0392b', 'microphone', 'Red Stage Strike', 'Sake Bottle Swing', 'Veteran Vocal Guard', 'Crimson Chorus'),
    hero('kaito', 'KAITO', 'hacker', '#3498db', 'microphone', 'Blue Voice Pulse', 'Ice Cream Loop', 'Cool Tone Barrier', 'Classic Voicebank Wave')
  ],
  'Yu-Gi-Oh': [
    hero('atem', 'Pharaoh Atem', 'tactical', '#1f1b52', 'cards', 'Duelist Command', 'Dark Magician Circle', 'Millennium Puzzle Guard', 'Mind Crush Judgment'),
    hero('tea_gardner', 'Tea Gardner', 'hacker', '#f39c12', 'cards', 'Friendship Draw', 'Support Spell Boost', 'Duel Spirit Guard', 'Heart of the Team'),
    hero('mai_valentine', 'Mai Valentine', 'slayer', '#d4af37', 'cards', 'Harpie Lady Slash', 'Perfume Tactics', 'Mirror Wall Feint', 'Harpie Sisters Storm')
  ],
  'Guilty Gear': [
    hero('dizzy_gg', 'Dizzy', 'hacker', '#9b59b6', 'magic', 'Necro Undine Shot', 'Gamma Ray Seed', 'Wings of Restraint', 'Gear Peace Overture'),
    hero('baiken', 'Baiken', 'slayer', '#e17055', 'katana', 'Tatami Gaeshi', 'Kabari Hook Pull', 'Azami Guard', 'Kenjutsu Revenge Arc'),
    hero('millia_rage', 'Millia Rage', 'slayer', '#f1c40f', 'hair', 'Tandem Top Cut', 'Haircar Rush', 'Mirazh Step', 'Iron Maiden Hair Storm')
  ],
  BlazBlue: [
    hero('rachel_alucard', 'Rachel Alucard', 'hacker', '#8e44ad', 'magic', 'Wind Drive Spark', 'George XIII Summon', 'Nago Umbrella Guard', 'Tempest Dahlia'),
    hero('hakumen', 'Hakumen', 'slayer', '#ecf0f1', 'blade', 'Zantetsu Cut', 'Magatama Counter', 'Susanoo Guard', 'Time Killer Judgment'),
    hero('hazama', 'Hazama', 'slayer', '#145a32', 'chain', 'Ouroboros Chain', 'Serpent Trap', 'Green Suit Feint', 'Terumi Possession Break')
  ],
  'Slender Man': [
    hero('kate_slender', 'Kate Milens', 'horror', '#839192', 'flashlight', 'Flashlight Panic Sweep', 'Forest Path Sprint', 'Page Route Dodge', 'Arrival Escape Signal'),
    hero('charlie_matheson', 'Charlie Matheson Echo', 'horror', '#7b7d7d', 'claws', 'Missing Child Echo', 'Mine Tunnel Lunge', 'Memory Static Hide', 'Burned Trail Manifest'),
    hero('lauren_slender', 'Lauren', 'tactical', '#aab7b8', 'camera', 'Camera Light Flash', 'Generator Restart', 'Safe House Barricade', 'Eight Pages Route')
  ],
  Chucky: [
    hero('kyle_chucky', 'Kyle', 'tactical', '#6c7a89', 'knife', 'Foster Home Strike', 'Good Guy Factory Trap', 'Protective Dodge', 'Childs Play Rescue'),
    hero('nica_pierce', 'Nica Pierce', 'horror', '#8e6f70', 'blade', 'Possession Resist Cut', 'Wheelchair Ambush', 'Mind Split Guard', 'Cult Breakout'),
    hero('jake_wheeler', 'Jake Wheeler', 'tactical', '#5dade2', 'bat', 'School Hall Swing', 'Doll Trap Reveal', 'Teen Survival Guard', 'Hackensack Stand')
  ],
  Hellraiser: [
    hero('joey_summerskill', 'Joey Summerskill', 'horror', '#bfc9ca', 'puzzlebox', 'Dream Investigate Pulse', 'Lament Seal Twist', 'Reporter Resolve Guard', 'Boone Prophecy Break')
  ],
  'Mass Effect': [
    hero('tali', 'Tali Zorah', 'hacker', '#7d5fff', 'shotgun', 'Quarian Shotgun', 'Combat Drone Deploy', 'Tech Armor Seal', 'Migrant Fleet Override'),
    hero('wrex', 'Urdnot Wrex', 'marine', '#6b8e23', 'shotgun', 'Krogan Shotgun Blast', 'Biotic Charge Roar', 'Battle Rage Guard', 'Clan Urdnot War Cry'),
    hero('mordin', 'Mordin Solus', 'hacker', '#4aa3df', 'omnitool', 'Incinerate Pulse', 'Salarian Analysis', 'Medi-Gel Protocol', 'Had To Be Me')
  ],
  Fallout: [
    hero('dogmeat', 'Dogmeat', 'horror', '#8b5a2b', 'bite', 'Faithful Bite', 'Fetch Disarm', 'Companion Guard', 'Wasteland Best Friend'),
    hero('courier_six', 'Courier Six', 'tactical', '#c2a76b', 'gun', 'Lucky Revolver Shot', 'V.A.T.S. Gamble', 'Desert Ranger Cover', 'Hoover Dam Wild Card'),
    hero('lone_wanderer', 'Lone Wanderer', 'tactical', '#f1c40f', 'gun', '10mm Vault Shot', 'Pip-Boy Scan', 'Vault 101 Grit', 'Project Purity Stand')
  ],
  Doom: [
    hero('vega', 'VEGA', 'hacker', '#b8f2ff', 'laser', 'UAC Data Spike', 'Argent Filter Hack', 'Facility Override Shield', 'VEGA Core Reboot'),
    hero('night_sentinel', 'Night Sentinel', 'slayer', '#d9b86b', 'blade', 'Sentinel Spear Jab', 'Argent Hammer Slam', 'Praetor Guard', 'Sentinel Prime Oath'),
    hero('betrayer_doom', 'The Betrayer', 'marine', '#7f5f3f', 'axe', 'Crucible Axe Cut', 'Atlan Memory Strike', 'Sentinel Shame Guard', 'Lost Son Reckoning')
  ],
  Unreal: [
    hero('xan_kriegor', 'Xan Kriegor', 'marine', '#f1c40f', 'gun', 'Shock Rifle Combo', 'Liandri Lock-On', 'Champion Armor Belt', 'Tournament Final Sweep'),
    hero('lauren_ut', 'Lauren', 'slayer', '#c0392b', 'gun', 'Dual Enforcer Burst', 'Flak Cannon Rush', 'Armor Shard Guard', 'Arena Queen Combo'),
    hero('gorge_ut', 'Gorge', 'marine', '#7f8c8d', 'gun', 'Rocket Arena Shot', 'Adrenaline Surge', 'Heavy Shield Belt', 'Liandri Tank Push')
  ],
  'Harry Potter': [
    hero('dumbledore', 'Albus Dumbledore', 'hacker', '#d9b86b', 'wand', 'Elder Wand Spark', 'Phoenix Flame Ward', 'Pensieve Foresight', 'Army of Light Duel'),
    hero('sirius_black', 'Sirius Black', 'slayer', '#2c3e50', 'wand', 'Animagus Lunge', 'Order Ambush Hex', 'Godfather Guard', 'Azkaban Breakout'),
    hero('neville', 'Neville Longbottom', 'tactical', '#27ae60', 'sword', 'Gryffindor Sword Cut', 'Herbology Snare', 'D.A. Defiance Guard', 'Nagini Final Strike')
  ],
  'Star Wars': [
    hero('leia', 'Leia Organa', 'tactical', '#f5eef8', 'gun', 'Rebel Blaster Shot', 'Command Cell Rally', 'Diplomatic Resolve Guard', 'Resistance Beacon'),
    hero('obiwan', 'Obi-Wan Kenobi', 'slayer', '#d8c3a5', 'lightsaber', 'Soresu Saber Cut', 'Jedi Mind Feint', 'High Ground Guard', 'Kenobi Final Lesson'),
    hero('ahsoka', 'Ahsoka Tano', 'slayer', '#f39c12', 'lightsaber', 'Twin Saber Flash', 'Fulcrum Ambush', 'Force Leap Guard', 'World Between Paths')
  ],
  'Le Cinquième Element': [
    hero('vito_cornelius', 'Vito Cornelius', 'hacker', '#d9b86b', 'relic', 'Element Glyph Trace', 'Priest Archive Seal', 'Sacred Wall Guard', 'Temple Alignment'),
    hero('diva_plavalaguna', 'Diva Plavalaguna', 'hacker', '#3498db', 'microphone', 'Operatic Pulse', 'Element Stone Reveal', 'Blue Lagoon Barrier', 'Lucia Cosmic Aria'),
    hero('david_fifth', 'David', 'tactical', '#7f8c8d', 'relic', 'Apprentice Signal', 'Stone Carry Route', 'Temple Door Hold', 'Acolyte Rescue Push')
  ],
  'Scary Movie': [
    hero('brenda_meeks', 'Brenda Meeks', 'horror', '#8e44ad', 'bat', 'Cinema Seat Swing', 'Reality TV Counter', 'Loud Survival Guard', 'Parody Final Girl Assist'),
    hero('ray_wilkins', 'Ray Wilkins', 'slayer', '#2980b9', 'knife', 'Absurd Knife Feint', 'Locker Room Dash', 'Comedy Dodge', 'Slasher Logic Break'),
    hero('gail_hailstorm', 'Gail Hailstorm', 'tactical', '#f1c40f', 'camera', 'News Camera Flash', 'Live Broadcast Trap', 'Media Shield', 'Breaking News Escape')
  ],
  'Dead Space': [
    hero('nicole_brennan', 'Nicole Brennan Echo', 'hacker', '#8e44ad', 'medkit', 'Medical Flash', 'Marker Hallucination Hack', 'Ishimura Memory Guard', 'Make Us Whole Reversal'),
    hero('hammond_ds', 'Zach Hammond', 'marine', '#7f8c8d', 'gun', 'Security Pulse Rifle', 'Bridge Order Mark', 'USG Command Guard', 'Escape Pod Sacrifice'),
    hero('kendra_daniels', 'Kendra Daniels', 'hacker', '#bdc3c7', 'terminal', 'CEC Terminal Hack', 'Data Cache Lock', 'Corporate Cover', 'Marker File Extraction')
  ],
  'Rick & Morty': [
    hero('beth_smith', 'Beth Smith', 'tactical', '#f5b7b1', 'gun', 'Horse Surgeon Precision', 'Space Mom Shot', 'Family Denial Guard', 'Clone Question Split'),
    hero('jerry_smith', 'Jerry Smith', 'horror', '#f7dc6f', 'melee', 'Awkward Flail', 'Beekeeping Distraction', 'Pathetic Luck Guard', 'Jerryboree Chaos'),
    hero('space_beth', 'Space Beth', 'slayer', '#e74c3c', 'laser', 'Galactic Rebel Beam', 'Federation Raid', 'Clone Armor Guard', 'Space Mom Revolution')
  ],
  'Digital Circus': [
    hero('ragatha', 'Ragatha', 'horror', '#c0392b', 'needle', 'Ragdoll Stitch', 'Comfort Patch', 'Anxiety Cushion Guard', 'Dollhouse Recovery'),
    hero('gangle', 'Gangle', 'hacker', '#ff7675', 'ribbon', 'Ribbon Snap', 'Comedy Mask Swap', 'Tragedy Mask Guard', 'Emotion Loop Snare'),
    hero('kinger', 'Kinger', 'tactical', '#f1c40f', 'chess', 'Chess Piece Bash', 'Pillow Fort Counter', 'Royal Panic Guard', 'Checkmate Delusion'),
    hero('zooble', 'Zooble', 'slayer', '#9b59b6', 'limb', 'Modular Limb Hit', 'Body Part Throw', 'Detach Dodge', 'Abstract Reassembly')
  ],
  Digimon: [
    hero('sora_biyomon', 'Sora & Biyomon', 'tactical', '#e74c3c', 'fire', 'Spiral Twister', 'Love Crest Rally', 'Birdramon Guard', 'Phoenixmon Ascension'),
    hero('mimi_palmon', 'Mimi & Palmon', 'hacker', '#2ecc71', 'plant', 'Poison Ivy Whip', 'Sincerity Heal Song', 'Togemon Guard', 'Rosemon Bloom'),
    hero('joe_gomamon', 'Joe & Gomamon', 'tactical', '#3498db', 'water', 'Marching Fishes', 'Reliability Rescue', 'Ikkakumon Guard', 'Zudomon Hammer Tide')
  ],
  Saw: [
    hero('lawrence_gordon', 'Lawrence Gordon', 'horror', '#95a5a6', 'saw', 'Surgical Saw Cut', 'Bathroom Chain Choice', 'Doctor Resolve Guard', 'Final Apprentice Reveal'),
    hero('adam_stanheight', 'Adam Stanheight', 'horror', '#7f8c8d', 'camera', 'Darkroom Camera Flash', 'Tape Clue Counter', 'Desperate Hide', 'What Do You Do Trap'),
    hero('detective_tapp', 'Detective Tapp', 'tactical', '#34495e', 'gun', 'Investigator Pistol Shot', 'Trap Map Pursuit', 'Obsessive Guard', 'Jigsaw Manhunt')
  ],
  'Rosario + Vampire': [
    hero('mizore_shirayuki', 'Mizore Shirayuki', 'horror', '#74b9ff', 'ice', 'Ice Claw Shard', 'Stalker Snow Bind', 'Frozen Mist Guard', 'Yuki-Onna Blizzard'),
    hero('yukari_sendo', 'Yukari Sendo', 'hacker', '#a29bfe', 'wand', 'Witch Glyph Shot', 'Basin Drop Spell', 'Magic Hat Guard', 'Prodigy Circle'),
    hero('gin_morioka', 'Gin Morioka', 'slayer', '#95a5a6', 'claws', 'Werewolf Dash', 'Newspaper Flash Feint', 'Beast Guard', 'Full Moon Sprint')
  ],
  Negima: [
    hero('konoka_konoe', 'Konoka Konoe', 'hacker', '#ffb6c1', 'healing', 'Healing Bell Pulse', 'Kyoto Barrier Prayer', 'Gentle Pactio Guard', 'Konoe Restoration'),
    hero('setsuna_sakurazaki', 'Setsuna Sakurazaki', 'slayer', '#ecf0f1', 'katana', 'Shinmei-Ryu Slash', 'Winged Guardian Dash', 'Oath Guard', 'Setsuna Blade Storm'),
    hero('kotaro_inugami_hero', 'Kotaro Inugami', 'slayer', '#d35400', 'claws', 'Dog God Claw', 'Shadow Clone Strike', 'Wolf Guard', 'Inugami Rival Rush')
  ],
  'Ghost in the Shell': [
    hero('aramaki', 'Daisuke Aramaki', 'tactical', '#7f8c8d', 'command', 'Section 9 Order', 'Political Pressure Trap', 'Director Cover', 'Stand Alone Directive'),
    hero('ishikawa_gits', 'Ishikawa', 'hacker', '#34495e', 'terminal', 'Cyberbrain Trace', 'Network Backdoor', 'Console Cover', 'Section 9 Data Sweep'),
    hero('tachikoma_unit', 'Tachikoma Unit', 'marine', '#2980b9', 'gun', 'Spider Tank Burst', 'Think Tank Grenade', 'AI Curiosity Guard', 'Tachikoma Sacrifice')
  ],
  'Mad Max': [
    hero('goose_mm', 'Jim Goose', 'tactical', '#7f8c8d', 'gun', 'MFP Shotgun Blast', 'Pursuit Bike Ram', 'Highway Patrol Cover', 'Bronze Badge Revenge'),
    hero('feral_kid', 'Feral Kid', 'horror', '#d2a679', 'boomerang', 'Metal Boomerang Throw', 'Scrap Ambush', 'Crawlspace Hide', 'Wasteland Heir'),
    hero('praetorian_jack', 'Praetorian Jack', 'marine', '#8d6e63', 'gun', 'War Rig Rifle', 'Road Warrior Escort', 'Convoy Armor Guard', 'Forty Day Wasteland Run')
  ]
};

export const LORE_ACCURATE_HERO_OVERRIDES = {
  dom: loadout('gun', 'Lancer Cover Fire', 'Gnasher Breach Shot', 'Brotherhood Last Stand', 'Maria Memory Charge', '#3498db'),
  cole: loadout('gun', 'Thrashball Tackle', 'Boomshot Hype Shot', 'Cole Train Brace', 'Cole Train Runs On Whole Grain', '#f1c40f'),
  arbiter: loadout('energy_sword', 'Energy Sword Cut', 'Active Camo Flank', 'Sangheili Honor Guard', 'Great Schism Strike', '#95a5a6'),
  johnson: loadout('gun', 'Marine Sergeant Burst', 'Spartan Morale Rally', 'Cigar Smoke Cover', 'Send Me Out With A Bang', '#27ae60'),
  hicks: loadout('gun', 'M41A Pulse Rifle Burst', 'Shotgun Door Breach', 'Colonial Marine Cover', 'Hudson Corridor Hold', '#7f8c8d'),
  bishop: loadout('scanner', 'Synthetic Knife Trick', 'APC Systems Bypass', 'Android Self-Seal', 'Dropship Remote Route', '#bdc3c7'),
  city_hunter: loadout('smart_disc', 'Wristblade Slice', 'Smart Disc Return', 'Cloak Reposition', 'Los Angeles Trophy Hunt', '#d35400'),
  dutch: loadout('gun', 'M16 Jungle Burst', 'Mud Trap Counter', 'Commando Tree Cover', 'Get To The Chopper', '#16a085'),
  trinity: loadout('gun', 'Dual Beretta Burst', 'Motorcycle Wall Run', 'Bullet Time Cartwheel', 'Kiss of System Reboot', '#2c3e50'),
  morpheus: loadout('katana', 'Dojo Staff Strike', 'Red Pill Choice', 'Nebuchadnezzar Captain Guard', 'There Is No Spoon Rally', '#34495e'),
  atlas: loadout('portalgun', 'Blue Portal Ping', 'Co-op Launch Plate', 'Robot Shell Brace', 'Atlas Portal Chain', '#2980b9'),
  pbody: loadout('portalgun', 'Orange Portal Snap', 'Hardlight Bridge Redirect', 'Co-op Shell Guard', 'P-Body Test Chamber Loop', '#d35400'),
  raiden: loadout('high_frequency_blade', 'HF Blade Cut', 'Ninja Run Slash', 'Parry Stance', 'Zandatsu Overdrive', '#95a5a6'),
  otacon: loadout('terminal', 'Codec Support Ping', 'Metal Gear Data Hack', 'Stealth Lab Guard', 'Philanthropy Upload', '#16a085'),
  wolf_pd: loadout('gun', 'AK Burst', 'Drill Restart Kick', 'Armor Bag Cover', 'Panic Room Assault', '#c0392b'),
  hoxton: loadout('gun', 'Akimbo Pistol Shot', 'ECM Jailbreak', 'Mask Switch Dodge', 'Hoxton Revenge Job', '#2980b9'),
  rin: loadout('microphone', 'Meltdown Note', 'Electric Angel Twin Sync', 'Mirror Voice Guard', 'Road Roller Resonance', '#f1c40f'),
  luka: loadout('microphone', 'Luka Luka Night Note', 'Tuna Swing Beat', 'Bilingual Harmony Guard', 'Megurine Ocean Chorus', '#ff7675'),
  kaiba: loadout('cards', 'Blue-Eyes Command', 'Enemy Controller Input', 'KaibaCorp Shield', 'Obelisk Tribute Crush', '#2980b9'),
  joey: loadout('cards', 'Red-Eyes Slash', 'Time Wizard Gamble', 'Brooklyn Guard', 'Flame Swordsman Rally', '#e67e22'),
  ky: loadout('blade', 'Stun Edge', 'Vapor Thrust', 'Sacred Order Guard', 'Ride The Lightning', '#3498db'),
  may_gg: loadout('anchor', 'Anchor Swing', 'Dolphin Charge', 'Pirate Guard', 'Great Yamada Attack', '#ff7675'),
  jin: loadout('blade', 'Ice Carver', 'Frost Bite Drive', 'Barrier Trigger Guard', 'Yukianesa Freeze', '#74b9ff'),
  noel: loadout('gun', 'Nox Nyctores Shot', 'Chain Revolver Rush', 'Blue Uniform Guard', 'Bolverk Bullet Ballet', '#0984e3'),
  masky: loadout('knife', 'Mask Static Slash', 'Proxy Ambush', 'Camera Jam Guard', 'Marble Hornets Pursuit', '#6c5ce7'),
  hoody: loadout('gun', 'Hooded Proxy Shot', 'Tape Distortion Trap', 'Forest Hide Guard', 'Static Proxy Rush', '#ffeaa7'),
  tiffany: loadout('knife', 'Bride Knife Cut', 'Voodoo Doll Hex', 'Glamour Dodge', 'Til Death Do Us Part', '#dfe6e9'),
  glen: loadout('axe', 'Doll Family Swing', 'Identity Split Feint', 'Good Doll Guard', 'Seed of Chucky Burst', '#a29bfe'),
  female_cenobite: loadout('chains', 'Needle Chain Lash', 'Labyrinth Hook Snare', 'Cenobite Pain Guard', 'Order of the Gash', '#b2bec3'),
  butterball: loadout('hook', 'Butcher Hook Hit', 'Cenobite Drag', 'Flesh Apron Guard', 'Labyrinth Appetite', '#636e72'),
  pinhead: loadout('chains', 'Hook Chain Lash', 'Hell Priest Sentence', 'Pain Theology Ward', 'Lament Configuration Verdict', '#17202a'),
  chatterer: loadout('claws', 'Chattering Bite', 'Chain Hook Drag', 'Cenobite Flesh Guard', 'Labyrinth Hunger', '#d0d3d4'),
  julia_cotton: loadout('knife', 'Cotton House Lure', 'Blood Resurrection Pact', 'Human Betrayal Guard', 'Labyrinth Consort Return', '#8b0000'),
  garrus: loadout('gun', 'Turian Sniper Shot', 'Concussive Mine', 'Calibrated Cover', 'Archangel Killbox', '#0984e3'),
  liara: loadout('biotic', 'Warp Field', 'Singularity Lift', 'Asari Barrier', 'Shadow Broker Data Storm', '#74b9ff'),
  paladin: loadout('laser', 'Laser Rifle Volley', 'Power Armor Charge', 'Brotherhood Bulwark', 'Liberty Prime Beacon', '#7f8c8d'),
  nick_v: loadout('gun', 'Detective Revolver Shot', 'Synth Clue Scan', 'Noir Trench Guard', 'Valentine Case File', '#2d3436'),
  hayden: loadout('laser', 'Argent Lance', 'UAC Facility Lock', 'Cybernetic Frame Guard', 'Crucible Transfer', '#bdc3c7'),
  doom_marine: loadout('gun', 'UAC Rifle Burst', 'Frag Grenade Toss', 'Praetor Bootleg Guard', 'Mars Security Push', '#27ae60'),
  brock: loadout('gun', 'Flak Cannon Pump', 'Rocket Jump Rush', 'Shield Belt Guard', 'Tournament Bruiser Combo', '#c0392b'),
  hermione: loadout('wand', 'Stupefy Precision', 'Alohomora Route Hack', 'Protego Maxima', 'Time-Turner Study Loop', '#fdcb6e'),
  ron: loadout('wand', 'Chessboard Strike', 'Deluminator Spark', 'Weasley Courage Guard', 'Knight Sacrifice Rally', '#e67e22'),
  vader: loadout('lightsaber', 'Sith Saber Cut', 'Force Choke Hold', 'Dark Side Guard', 'Imperial March Execution', '#2d3436'),
  han_solo: loadout('gun', 'DL-44 Quickdraw', 'Falcon Smuggler Run', 'Carbonite Luck Guard', 'Kessel Run Fire', '#ffeaa7'),
  leeloo: loadout('melee', 'Multipass Kick', 'Divine Language Burst', 'Elemental Guard', 'Supreme Being Light', '#ff7675'),
  ruby_rhod: loadout('microphone', 'Supergreen Shout', 'Radio Panic Burst', 'Broadcast Dodge', 'Fhloston Paradise Signal', '#fdcb6e'),
  cindy: loadout('melee', 'Final Girl Swing', 'Parody Clue Reveal', 'Awkward Dodge', 'Scary Logic Break', '#ffeaa7'),
  shorty: loadout('melee', 'Slacker Punch', 'Smoke Cloud Confusion', 'Couch Hide Guard', 'Wassup Chain Call', '#55efc4'),
  carver: loadout('gun', 'Security Rifle Burst', 'Co-op Stasis Shot', 'Soldier Trauma Guard', 'Tau Volantis Push', '#7f8c8d'),
  ellie: loadout('gun', 'Engineer Cover Shot', 'Ship Route Fix', 'Eye Trauma Grit', 'Sprawl Escape Vector', '#fdcb6e'),
  morty: loadout('laser', 'Morty Panic Shot', 'Death Crystal Warning', 'Nervous Dodge', 'Aw Geez Reality Split', '#ffeaa7'),
  summer: loadout('laser', 'Teen Rebel Blast', 'Mad Max Detour', 'Family Armor Guard', 'Post-Apocalyptic Sister Rush', '#ff7675'),
  jax: loadout('melee', 'Prank Rabbit Hit', 'Exit Door Fakeout', 'Cartoon Dodge', 'Abstract Taunt Loop', '#a29bfe'),
  caine: loadout('magic', 'Ringmaster Snap', 'Exit Door Illusion', 'Digital God Guard', 'Circus Reset Command', '#ff7675'),
  matt: loadout('digivice', 'Gabumon Blue Blaster', 'Friendship Crest Boost', 'Garurumon Guard', 'MetalGarurumon Barrage', '#74b9ff'),
  izzy: loadout('laptop', 'Tentomon Electro Shocker', 'Digi-Analysis Hack', 'Knowledge Crest Guard', 'MegaKabuterimon Beam', '#81ecec'),
  amanda: loadout('knife', 'Pig Mask Slash', 'Needle Pit Trigger', 'Apprentice Hide', 'Reverse Bear Trap Panic', '#d63031'),
  hoffman: loadout('gun', 'Detective Ambush Shot', 'Glass Coffin Setup', 'Corrupt Badge Guard', 'Trap Room Lockdown', '#2d3436'),
  tsukune: loadout('melee', 'Human Courage Strike', 'Rosary Support Pulse', 'Ghoul Restraint Guard', 'Vampire Blood Awakening', '#ffeaa7'),
  kurumu: loadout('claws', 'Succubus Claw Swipe', 'Charm Wing Rush', 'Dream Mist Guard', 'Kurumu Love Dive', '#fd79a8'),
  asuna: loadout('blade', 'Artifact Sword Hit', 'Anti-Magic Break', 'Pactio Guard', 'Ensis Exorcizans Burst', '#e17055'),
  evangeline: loadout('magic', 'Dark Ice Bolt', 'Puppeteer Shadow', 'Vampire Barrier', 'Magia Erebea Lesson', '#6c5ce7'),
  batou: loadout('gun', 'Cybernetic Pistol Burst', 'Thermoptic Raid', 'Ranger Eye Guard', 'Section 9 Heavy Entry', '#b2bec3'),
  togusa: loadout('gun', 'Mateba Revolver Shot', 'Old-School Detective Scan', 'Human Instinct Guard', 'Major Case Break', '#ffeaa7'),
  furiosa: loadout('gun', 'War Rig Rifle Burst', 'Mechanical Arm Grapple', 'Citadel Defiance Guard', 'Green Place Run', '#7f8c8d'),
  nux: loadout('melee', 'Chrome Spear Rush', 'War Boy Nitro', 'Witness Me Guard', 'Valhalla Turnaround', '#ffeaa7')
};

const monster = (name, hp, atk, spd, color, weapon) => ({ name, hp, atk, spd, color, weapon });
const boss = (name, hp, atk, spd, color, weapon, special) => ({ name, hp, atk, spd, color, weapon, special });

export const LORE_ACCURATE_ENEMY_EXPANSIONS = {
  Rammstein: {
    monsters: [
      monster('Flame Projector Rig', 95, 14, 4, '#ff692d', 'pyro_burst'),
      monster('Industrial Spark Shower', 80, 12, 6, '#d35400', 'spark_wall'),
      monster('Stage Smoke Wall', 110, 10, 2, '#566573', 'smoke_choke')
    ],
    bosses: [
      boss('Mein Teil Butcher Table', 560, 22, 3, '#7b241c', 'cleaver_rig', 'Butcher Table Shock'),
      boss('Du Hast Pyro Wall', 590, 24, 4, '#ff4500', 'flame_wall', 'Du Hast Call And Response')
    ],
    worldBoss: boss('Engel Wings Pyro Rig', 1320, 33, 3, '#ffd166', 'pyro_wings', 'Engel Stadium Inferno')
  },
  'System of a Down': {
    monsters: [
      monster('Toxicity Feedback Wave', 88, 13, 6, '#f1c40f', 'feedback'),
      monster('Prison Song Riot Line', 112, 14, 4, '#7d6608', 'riot_pressure'),
      monster('Chop Suey Tempo Break', 78, 15, 7, '#b03a2e', 'tempo_cut')
    ],
    bosses: [
      boss('B.Y.O.B. War Machine', 575, 23, 5, '#1c2833', 'war_machine', 'Blast-Off Party Break'),
      boss('Aerials Signal Tower', 540, 20, 6, '#7d6608', 'signal_wave', 'Sky Signal Collapse')
    ],
    worldBoss: boss('Toxicity Riot Core', 1260, 31, 5, '#b03a2e', 'chaotic_rhythm', 'Toxicity Breakdown')
  },
  'Rob Zombie': {
    monsters: [
      monster('Living Dead Girl Dancer', 92, 13, 6, '#5b2c1f', 'dance_slash'),
      monster('Dragula Hot Rod Fiend', 120, 16, 7, '#ffa943', 'hot_rod_ram'),
      monster('House of 1000 Corpses Ghoul', 105, 15, 5, '#922b21', 'grindhouse_claws')
    ],
    bosses: [
      boss('Superbeast Stage Brute', 610, 24, 5, '#7b241c', 'brute_charge', 'Superbeast Roar'),
      boss('Lords of Salem Ritual', 570, 22, 4, '#8e44ad', 'ritual_fire', 'Salem Witch Chorus')
    ],
    worldBoss: boss('Dragula Stage Machine', 1280, 32, 5, '#ff6f3c', 'dragula_ram', 'Dragula Hot-Rod Massacre')
  },
  'Daft Punk': {
    monsters: [
      monster('Derezzed Grid Drone', 85, 13, 7, '#00d8ff', 'grid_laser'),
      monster('Harder Better Faster Loop', 95, 14, 8, '#d4af37', 'loop_strike'),
      monster('Technologic Command Line', 90, 12, 7, '#bdc3c7', 'code_pulse')
    ],
    bosses: [
      boss('Alive Pyramid Light Wall', 540, 20, 5, '#ffc740', 'light_grid', 'Alive Pyramid Sync'),
      boss('Robot Rock Titan', 590, 23, 5, '#bdc3c7', 'robot_riff', 'Robot Rock Overdrive')
    ],
    worldBoss: boss('Derezzed Pyramid Core', 1240, 30, 6, '#00d8ff', 'derezzed_beam', 'TRON Grid Collapse')
  },
  'Oliver Tree': {
    monsters: [
      monster('Turbo Scooter Crash', 80, 13, 8, '#ff6f3c', 'scooter_ram'),
      monster('Alien Boy UFO Glitch', 90, 12, 7, '#39c5bb', 'ufo_zap'),
      monster('Miss You Viral Echo', 75, 14, 6, '#d8d43f', 'echo_loop')
    ],
    bosses: [
      boss('Bowl Cut Persona', 500, 19, 7, '#d8d43f', 'persona_glitch', 'Bowl Cut Reset'),
      boss('Cowboy Tears Rodeo Loop', 540, 20, 6, '#8d6e63', 'rodeo_lasso', 'Cowboy Tears Loop')
    ],
    worldBoss: boss('Turbo Scooter Breakdown', 1120, 28, 8, '#ff6f3c', 'turbo_crash', 'Turbo Viral Collapse')
  },
  'Gears of War': {
    monsters: [
      monster('Kantus Priest', 120, 13, 4, '#75624a', 'gorgon_pistol'),
      monster('Theron Guard', 130, 14, 5, '#6e5b45', 'torque_bow'),
      monster('Boomer Locust', 170, 18, 2, '#5a4a3a', 'boomshot')
    ],
    bosses: [
      boss('Berserker Matriarch', 620, 24, 5, '#3b2b28', 'blind_charge', 'Sonic Charge Break'),
      boss('Queen Myrrah', 610, 22, 6, '#6d5946', 'tempest', 'Tempest Beetle Storm'),
      boss('Corpser Burrower', 680, 23, 3, '#2d2b24', 'burrow_claws', 'Emergence Pit Collapse')
    ]
  },
  Halo: {
    monsters: [
      monster('Hunter Bond Brother', 180, 18, 3, '#1f7a66', 'fuel_rod'),
      monster('Brute Captain', 145, 16, 5, '#6f4e37', 'spiker'),
      monster('Flood Carrier Form', 85, 15, 4, '#8a7b3f', 'infection_burst')
    ],
    bosses: [
      boss('Gravemind Tendril Node', 640, 21, 2, '#5f6b3d', 'flood_tendrils', 'Logic Plague Whisper'),
      boss('Warden Eternal Fragment', 620, 23, 5, '#7fd7ff', 'hardlight_blade', 'Slipspace Slash')
    ]
  },
  Alien: {
    monsters: [
      monster('Chestburster Larva', 45, 16, 8, '#c7a17a', 'inner_jaw'),
      monster('Warrior Xenomorph', 120, 16, 7, '#101217', 'acid_claws'),
      monster('Acid Blood Pool', 70, 14, 2, '#9ac430', 'acid')
    ],
    bosses: [
      boss('Ash Synthetic Saboteur', 460, 17, 6, '#d9d9d9', 'rolled_magazine', 'Special Order 937'),
      boss('Weyland-Yutani Retrieval Team', 520, 19, 5, '#2f3f46', 'pulse_rifle', 'Specimen Capture Protocol')
    ]
  },
  Predator: {
    monsters: [
      monster('Tracker Predator Hound', 90, 14, 8, '#4a4239', 'bite'),
      monster('Thermal Mine Drone', 70, 16, 6, '#d35400', 'mine'),
      monster('Cloaked Young Blood', 110, 15, 6, '#5a544c', 'combistick')
    ],
    bosses: [
      boss('Jungle Hunter', 560, 23, 6, '#40513b', 'plasma_caster', 'Self-Destruct Countdown'),
      boss('Feral Predator', 590, 24, 7, '#6a5c44', 'shield_blade', 'Bone Mask Shield Slam')
    ]
  },
  'Resident Evil': {
    monsters: [
      monster('Crimson Head Prototype', 105, 15, 7, '#7b1f1f', 'claws'),
      monster('Regenerator Parasite Host', 150, 17, 4, '#c5b7a1', 'spikes'),
      monster('Ganado Plaga Villager', 95, 13, 5, '#8d6e63', 'axe')
    ],
    bosses: [
      boss('Osmund Saddler Plaga Apostle', 610, 23, 4, '#3f2f2f', 'plaga_tendrils', 'Dominant Plaga Command'),
      boss('Lady Dimitrescu Mutant', 650, 24, 5, '#d8c6a0', 'talons', 'Castle Blood Curse'),
      boss('Jack Baker Molded Patriarch', 590, 22, 5, '#5d4037', 'mold_axe', 'Welcome To The Family')
    ]
  },
  'Silent Hill': {
    monsters: [
      monster('Insane Cancer Mass', 130, 14, 3, '#7a5f55', 'body_slam'),
      monster('Schism Blade Splitter', 105, 15, 5, '#9b6f62', 'split_head'),
      monster('Siam Bound Pair', 125, 16, 4, '#7d6960', 'double_grab')
    ],
    bosses: [
      boss('Valtiel Ritual Warden', 560, 19, 5, '#7c2d22', 'ritual_blade', 'Halo of the Sun Reset'),
      boss('Scarlet Doll Memory', 540, 20, 4, '#b03a2e', 'porcelain_claws', 'Dollhouse Blood Waltz')
    ]
  },
  'Dino Crisis': {
    monsters: [
      monster('Allosaurus Ambusher', 135, 16, 6, '#6f4e37', 'jaw'),
      monster('Inostrancevia Heavy', 155, 17, 4, '#565d40', 'tusk'),
      monster('Mosasaur Tank Breach', 125, 15, 5, '#2f6f73', 'water_bite')
    ],
    bosses: [
      boss('Doctor Kirk Security Override', 500, 18, 5, '#52616b', 'third_energy', 'Third Energy Lockout'),
      boss('Gigantosaurus Final Pursuer', 720, 27, 4, '#3c2f25', 'jaw', 'Edward City Devour')
    ]
  },
  'The Matrix': {
    monsters: [
      monster('Agent Upgrade Program', 115, 15, 8, '#111111', 'desert_eagle'),
      monster('Twin Ghost Exile', 100, 14, 7, '#d7d7d7', 'phase_blade'),
      monster('Merovingian Guard', 105, 13, 6, '#2b2b2b', 'smg')
    ],
    bosses: [
      boss('Merovingian Exile Lord', 540, 19, 6, '#5d4037', 'causality_code', 'Cause And Effect Trap'),
      boss('Trainman Limbo Keeper', 520, 18, 7, '#6b5b4b', 'rail_spike', 'Mobil Avenue Lock')
    ]
  },
  Stargate: {
    monsters: [
      monster('Ori Prior Zealot', 110, 14, 5, '#d9b86b', 'staff'),
      monster('Wraith Dart Raider', 95, 13, 7, '#4d6b63', 'stunner'),
      monster('Ancient Drone Trap', 80, 16, 8, '#fff6a6', 'drone')
    ],
    bosses: [
      boss('Replicarter Nanite Avatar', 600, 22, 7, '#b8c0c8', 'nanites', 'Replicator Mind Flood'),
      boss('Adria Ori Vessel', 620, 23, 6, '#e8d087', 'ori_fire', 'Book of Origin Flame')
    ]
  },
  'Half-Life': {
    monsters: [
      monster('Antlion Guard Spawn', 150, 17, 5, '#b07d3c', 'horn_charge'),
      monster('Combine Hunter', 120, 15, 7, '#5d6d7e', 'flechette'),
      monster('Zombie Poison Headcrab Host', 135, 14, 4, '#6b4b3a', 'poison_claw')
    ],
    bosses: [
      boss('Advisor Pod Controller', 580, 20, 3, '#6c5a7d', 'telekinesis', 'Neural Suppression'),
      boss('Overwatch Nexus Relay', 560, 21, 4, '#2c3e50', 'pulse_grid', 'Combine Suppression Field')
    ]
  },
  Portal: {
    monsters: [
      monster('Rocket Turret Prototype', 85, 15, 4, '#f4f4f4', 'rocket'),
      monster('Gel Pump Hazard', 75, 12, 5, '#ff7f2a', 'gel'),
      monster('Frankenturret Cube', 95, 10, 7, '#d9d9d9', 'shuffle')
    ],
    bosses: [
      boss('Cave Johnson Recording Core', 460, 16, 4, '#ff9f43', 'combustible_lemons', 'Combustible Lemon Lecture'),
      boss('Aperture Cooperative Test Core', 520, 18, 5, '#2980b9', 'portal_loop', 'Infinite Test Chamber')
    ]
  },
  'Metal Gear': {
    monsters: [
      monster('FROG Haven Trooper', 100, 14, 7, '#5d6d7e', 'p90'),
      monster('Dwarf Gekko Swarm', 70, 13, 8, '#bdc3c7', 'tripod_kick'),
      monster('PMC Heavy Shield', 130, 12, 4, '#2f3f46', 'riot_shield')
    ],
    bosses: [
      boss('Psycho Mantis Memory', 520, 18, 7, '#8e44ad', 'psychic', 'Controller Port Blackout'),
      boss('Vamp Immortal Striker', 560, 21, 8, '#17202a', 'knife', 'Nanomachine Regeneration'),
      boss('Metal Gear REX Phantom', 720, 25, 3, '#4f5b5c', 'railgun', 'Shadow Moses Railgun')
    ]
  },
  Payday: {
    monsters: [
      monster('Medic SWAT Responder', 95, 8, 5, '#2ecc71', 'medkit'),
      monster('Sniper Laser Officer', 80, 16, 6, '#e74c3c', 'sniper'),
      monster('Captain Winters Shield Wall', 145, 10, 3, '#34495e', 'shield')
    ],
    bosses: [
      boss('Captain Winters Assault Leader', 560, 19, 4, '#34495e', 'shield_wall', 'Police Morale Lock'),
      boss('Skulldozer Elite', 680, 25, 3, '#111111', 'shotgun', 'Dozer Breach Slam')
    ]
  },
  Vocaloid: {
    monsters: [
      monster('Pitch Desync Sprite', 60, 10, 8, '#39c5bb', 'sound'),
      monster('Broken Voicebank Echo', 85, 12, 6, '#f1c40f', 'wave'),
      monster('Hologram Stage Rig', 100, 13, 4, '#e0007a', 'spotlight')
    ],
    bosses: [
      boss('Corrupted Diva Persona', 500, 18, 8, '#39c5bb', 'chorus', 'World Is Mine Glitch'),
      boss('Silence Compressor', 540, 20, 5, '#101010', 'white_noise', 'Mute The Stage')
    ]
  },
  'Yu-Gi-Oh': {
    monsters: [
      monster('Trap Card Mimic', 70, 13, 5, '#8e44ad', 'trap'),
      monster('Kuriboh Swarm', 55, 8, 8, '#8d6e63', 'swarm'),
      monster('Blue-Eyes Token Dragon', 130, 16, 5, '#dce9ff', 'white_light')
    ],
    bosses: [
      boss('Marik Shadow Game Host', 560, 20, 6, '#7d3c98', 'millennium_rod', 'Shadow Game Life Drain'),
      boss('Pegasus Toon Master', 520, 18, 5, '#e8d8b0', 'toon_cards', 'Toon World Rewrite')
    ]
  },
  'Guilty Gear': {
    monsters: [
      monster('Gear Cell Fragment', 95, 14, 6, '#c0392b', 'fire'),
      monster('Illyrian Knight', 105, 13, 5, '#3498db', 'blade'),
      monster('Backyard Data Wraith', 90, 15, 7, '#9b59b6', 'data')
    ],
    bosses: [
      boss('Justice Gear Core', 640, 24, 5, '#b03a2e', 'gamma_ray', 'Gamma Ray Annihilation'),
      boss('I-No Temporal Witch', 590, 22, 8, '#d91e59', 'guitar', 'Time Rift Note')
    ]
  },
  BlazBlue: {
    monsters: [
      monster('NOL Guard Trooper', 95, 12, 5, '#34495e', 'rifle'),
      monster('Seithr Beast', 105, 15, 6, '#8e44ad', 'claws'),
      monster('Cauldron Automaton', 120, 14, 4, '#2c3e50', 'blade')
    ],
    bosses: [
      boss('Nu-13 Murakumo Unit', 600, 23, 7, '#ecf0f1', 'sword_bits', 'Sword Summoner Spiral'),
      boss('Terumi Azure Ghost', 610, 24, 8, '#27ae60', 'chain', 'Ouroboros Possession')
    ]
  },
  'Slender Man': {
    monsters: [
      monster('Proxy Knife Runner', 75, 13, 7, '#2c3e50', 'knife'),
      monster('Burned Mine Echo', 95, 12, 5, '#5d4037', 'fire'),
      monster('Static Camera Blindspot', 65, 10, 8, '#dfe6e9', 'static')
    ],
    bosses: [
      boss('The Operator Forest Core', 560, 18, 7, '#f5f5f5', 'static_tendrils', 'Page Eight Blackout'),
      boss('Proxy Circle Ambush', 520, 19, 6, '#111111', 'knives', 'No-Eyes Surround')
    ]
  },
  Chucky: {
    monsters: [
      monster('Good Guy Doll Swarm', 65, 10, 7, '#3498db', 'knife'),
      monster('Voodoo Amulet Echo', 80, 12, 5, '#d4af37', 'hex'),
      monster('Factory Conveyor Trap', 100, 13, 3, '#7f8c8d', 'machinery')
    ],
    bosses: [
      boss('Charles Lee Ray Spirit', 540, 19, 6, '#e67e22', 'voodoo_knife', 'Damballa Soul Transfer'),
      boss('Nica Possession Split', 500, 18, 7, '#8e44ad', 'split_mind', 'Cult Identity Break')
    ]
  },
  'Mass Effect': {
    monsters: [
      monster('Husk Shock Trooper', 85, 12, 6, '#8a9a9a', 'electric_claws'),
      monster('Geth Prime Platform', 155, 17, 4, '#5dade2', 'plasma'),
      monster('Collector Seeker Swarm', 75, 13, 8, '#d2b48c', 'swarm')
    ],
    bosses: [
      boss('Saren Arterius Spectre', 610, 22, 7, '#34495e', 'biotic_rifle', 'Sovereign Indoctrination'),
      boss('Harbinger Possessed Collector', 640, 23, 5, '#f39c12', 'dark_energy', 'Assuming Direct Control')
    ]
  },
  Fallout: {
    monsters: [
      monster('Deathclaw Matriarch', 160, 20, 7, '#8d6e63', 'claws'),
      monster('Feral Ghoul Reaver', 115, 14, 8, '#6e6b47', 'radiated_claws'),
      monster('Sentry Bot Mk II', 145, 17, 4, '#7f8c8d', 'minigun')
    ],
    bosses: [
      boss('Frank Horrigan Echo', 700, 27, 5, '#2d3436', 'plasma_blade', 'Enclave Power Armor Crush'),
      boss('Liberty Prime Malfunction', 760, 29, 3, '#bdc3c7', 'laser', 'Democracy Laser Barrage')
    ]
  },
  Doom: {
    monsters: [
      monster('Imp Fireball Pack', 80, 12, 6, '#b03a2e', 'fireball'),
      monster('Mancubus Heavy Demon', 150, 18, 3, '#a04000', 'flame_cannon'),
      monster('Cacodemon Floater', 110, 15, 5, '#c0392b', 'plasma_bite')
    ],
    bosses: [
      boss('Marauder Sentinel Fallen', 640, 24, 8, '#5d4037', 'argent_axe', 'Wolf Summon Counter'),
      boss('Icon of Sin Fragment', 820, 30, 2, '#7b241c', 'hell_portal', 'Hell On Earth Collapse')
    ]
  },
  Unreal: {
    monsters: [
      monster('Skaarj Warrior', 115, 15, 7, '#27ae60', 'claws'),
      monster('Liandri Combat Bot', 100, 14, 6, '#bdc3c7', 'shock_rifle'),
      monster('Redeemer Drone', 80, 20, 4, '#f1c40f', 'missile')
    ],
    bosses: [
      boss('Xan Kriegor Champion', 650, 25, 7, '#f1c40f', 'shock_combo', 'Tournament Champion Combo'),
      boss('Skaarj Queen', 700, 26, 5, '#27ae60', 'teleport_claws', 'Unreal Hive Gate')
    ]
  },
  'Harry Potter': {
    monsters: [
      monster('Dementor Patrol', 105, 13, 5, '#111111', 'soul_drain'),
      monster('Basilisk Hatchling', 130, 17, 4, '#145a32', 'venom'),
      monster('Acromantula Swarm', 95, 14, 7, '#3d2b1f', 'web')
    ],
    bosses: [
      boss('Bellatrix Lestrange Duelist', 560, 21, 7, '#2c3e50', 'dark_wand', 'Cruciatus Spiral'),
      boss('Voldemort Horcrux Shade', 680, 25, 6, '#dfe6e9', 'elder_wand', 'Avada Kedavra Thread')
    ]
  },
  'Star Wars': {
    monsters: [
      monster('Stormtrooper Fireteam', 85, 10, 5, '#f5f5f5', 'blaster'),
      monster('Droideka Shield Unit', 125, 14, 4, '#b8860b', 'twin_blaster'),
      monster('Inquisitor Probe', 110, 15, 7, '#111111', 'red_saber')
    ],
    bosses: [
      boss('Emperor Palpatine', 620, 24, 5, '#1b1b1b', 'force_lightning', 'Unlimited Power Storm'),
      boss('Darth Maul Phantom', 600, 23, 8, '#8b0000', 'double_saber', 'Duel of the Fates Rush')
    ]
  },
  'Le Cinquième Element': {
    monsters: [
      monster('Mangalore Mercenary', 100, 13, 5, '#5d4037', 'rifle'),
      monster('Airport Police Drone', 80, 11, 6, '#34495e', 'stunner'),
      monster('Evil Planet Ember', 120, 16, 3, '#8b0000', 'fire')
    ],
    bosses: [
      boss('Jean-Baptiste Emanuel Zorg', 560, 20, 5, '#6e2c00', 'zorg_zf1', 'ZF-1 Demonstration'),
      boss('Great Evil Planet Core', 760, 28, 2, '#2b0000', 'cosmic_fire', 'Anti-Life Collision')
    ]
  },
  'Scary Movie': {
    monsters: [
      monster('Ghostface Parody Stalker', 75, 12, 7, '#f5f5f5', 'knife'),
      monster('Possessed Joke Prop', 65, 10, 8, '#e67e22', 'prop'),
      monster('Awkward Police Extra', 85, 9, 5, '#2980b9', 'baton')
    ],
    bosses: [
      boss('Doofy Reveal Killer', 520, 18, 6, '#dfe6e9', 'knife', 'Parody Mask Reveal'),
      boss('Tabloid Horror Mashup', 560, 19, 5, '#e74c3c', 'gag_trap', 'Genre Rule Collapse')
    ]
  },
  'Dead Space': {
    monsters: [
      monster('Slasher Necromorph', 95, 14, 6, '#7a4b3a', 'bone_blades'),
      monster('Leaper Necromorph', 85, 15, 7, '#7d5f50', 'tail'),
      monster('Infector Winged Corpse', 80, 13, 8, '#5d4037', 'infection')
    ],
    bosses: [
      boss('Hunter Regenerator', 620, 22, 5, '#8d6e63', 'regrowth_claws', 'Regenerator Pursuit'),
      boss('Hive Mind Core', 780, 29, 3, '#7b241c', 'tentacles', 'Aegis VII Devour')
    ]
  },
  'Rick & Morty': {
    monsters: [
      monster('Federation Bug Soldier', 90, 12, 5, '#8d6e63', 'laser'),
      monster('Cronenberg Mutation', 120, 15, 6, '#d35400', 'claws'),
      monster('Meeseeks Panic Clone', 70, 11, 8, '#5dade2', 'melee')
    ],
    bosses: [
      boss('Evil Morty President', 560, 20, 7, '#f1c40f', 'portal_pistol', 'For The Damaged Coda'),
      boss('Rick Prime Decoy', 620, 23, 8, '#00d8ff', 'omega_device', 'Central Finite Trap')
    ]
  },
  'Digital Circus': {
    monsters: [
      monster('Abstracted Avatar', 105, 14, 6, '#111111', 'glitch_claws'),
      monster('Gloink Swarm', 70, 11, 8, '#e67e22', 'swarm'),
      monster('Exit Door Illusion', 95, 12, 4, '#dfe6e9', 'trap')
    ],
    bosses: [
      boss('Kaufmo Abstracted Core', 570, 20, 6, '#2d2d2d', 'glitch_body', 'Abstraction Spiral'),
      boss('Caine Broken Ringmaster', 590, 21, 7, '#ff7675', 'admin_magic', 'Circus Admin Reset')
    ]
  },
  Digimon: {
    monsters: [
      monster('Devimon Shadow Wing', 115, 15, 6, '#111111', 'dark_claw'),
      monster('Etemon Dark Network', 105, 14, 7, '#f1c40f', 'music'),
      monster('Myotismon Bat Swarm', 120, 16, 6, '#8e44ad', 'vampire_bite')
    ],
    bosses: [
      boss('Piedmon Dark Master', 640, 24, 8, '#d35400', 'trump_sword', 'Trump Sword Finale'),
      boss('Apocalymon Data Collapse', 800, 30, 3, '#2c3e50', 'data_void', 'Darkness Zone Reboot')
    ]
  },
  Saw: {
    monsters: [
      monster('Razor Wire Victim Echo', 75, 12, 5, '#7f8c8d', 'razor'),
      monster('Pig Mask Apprentice', 90, 13, 6, '#78281f', 'knife'),
      monster('Shotgun Collar Device', 85, 15, 4, '#34495e', 'trap')
    ],
    bosses: [
      boss('John Kramer Jigsaw Voice', 560, 18, 4, '#1b2631', 'trap_room', 'I Want To Play A Game'),
      boss('Bathroom Chain Trial', 620, 20, 2, '#95a5a6', 'rust_saw', 'Make Your Choice')
    ]
  },
  'Rosario + Vampire': {
    monsters: [
      monster('Yokai Academy Bully', 85, 12, 6, '#7f8c8d', 'claws'),
      monster('Snow Woman Familiar', 80, 13, 6, '#74b9ff', 'ice'),
      monster('Witchcraft Doll Swarm', 70, 12, 7, '#a29bfe', 'magic')
    ],
    bosses: [
      boss('Inner Moka Blood Seal', 600, 24, 8, '#e74c3c', 'vampire_kick', 'Rosary Release Kick'),
      boss('Fairy Tale Commander', 580, 21, 6, '#6c5ce7', 'monster_army', 'Yokai War Order')
    ]
  },
  Negima: {
    monsters: [
      monster('Mahora Mage Student', 85, 11, 6, '#d9b86b', 'spell'),
      monster('Ala Alba Training Doll', 90, 12, 5, '#bdc3c7', 'staff'),
      monster('Demon Pact Beast', 115, 15, 6, '#8e44ad', 'claws')
    ],
    bosses: [
      boss('Chao Lingshen Future Plot', 570, 20, 7, '#3498db', 'future_tech', 'Timeline Rewrite Device'),
      boss('Lifemaker Avatar', 760, 28, 4, '#ecf0f1', 'creation_magic', 'Perfect World Invocation')
    ]
  },
  'Ghost in the Shell': {
    monsters: [
      monster('Geisha Bot Ambusher', 85, 13, 7, '#dfe6e9', 'mono_wire'),
      monster('Cyberbrain Virus Host', 80, 12, 8, '#39ffcc', 'hack'),
      monster('Armed Suit Prototype', 140, 16, 4, '#7f8c8d', 'cannon')
    ],
    bosses: [
      boss('Kuze Refugee Network Ghost', 580, 20, 6, '#34495e', 'cyberbrain_link', 'Individual Eleven Signal'),
      boss('Solid State Society Puppeteer', 620, 22, 5, '#95a5a6', 'network_ghost', 'Remote Body Cascade')
    ]
  },
  'Mad Max': {
    monsters: [
      monster('Polecat Raider', 85, 13, 7, '#d9b36c', 'spear'),
      monster('Bullet Farmer Gunner', 115, 16, 4, '#7f8c8d', 'machine_gun'),
      monster('People Eater Convoy', 130, 15, 3, '#5d4037', 'ram')
    ],
    bosses: [
      boss('Lord Humungus Warlord', 620, 24, 5, '#3d2b1f', 'magnum', 'Wasteland Ultimatum'),
      boss('Dementus Horde Chief', 650, 25, 6, '#a04000', 'chariot', 'Biker Horde Collapse')
    ]
  }
};
