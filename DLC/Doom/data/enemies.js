// Doom — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Imp Fireball Thrower', hp: 70, atk: 10, spd: 5, color: '#d35400', weapon: 'fire' },
      { name: 'Possessed Combat Soldier', hp: 85, atk: 9, spd: 5, color: '#2ecc71', weapon: 'shotgun' },
      {
        name: 'Leaping Pinky Demon', hp: 110, atk: 12, spd: 6, color: '#e74c3c', weapon: 'bite',
        sourceSpeciesName: 'Demon (Pinky)',
        incarnation: 'Doom (1993) - classic Demon/Pinky (SARG)',
        referenceUrl: 'https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c',
        visualAnchor: 'Classic Doom pink fleshy Demon: massive hunched torso and low broad jaw, ivory teeth, golden-yellow eyes, short gray temporal horns, short forearms and thick bowed legs with flat dark feet. No armor, mechanical parts, oversized later-game horns or long Doom 2016/Eternal tail. The inherited word Leaping does not grant a jump attack; A_SargAttack is a close-range bite.',
        visualReviewStatus: 'pending'
      }
    ],
    bosses: [
      { name: 'Cyberdemon Lord', hp: 750, atk: 26, spd: 4, color: '#5d4037', weapon: 'rocket_launcher', special: 'Tyrant Rocket Storm' },
      { name: 'Spider Mastermind Mother', hp: 680, atk: 22, spd: 4, color: '#7f8c8d', weapon: 'plasma', special: 'Plasma Pulse Ring' }
    ],
    worldBoss: { name: 'Icon Of Sin Titan', hp: 1600, atk: 38, spd: 3, color: '#3e2723', weapon: 'fists', special: 'Apocalyptic Fire Breath' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      {
        name: 'Imp Fireballer', hp: 75, atk: 11, spd: 6, color: '#a04000', weapon: 'fireball',
        sourceSpeciesName: 'Imp',
        incarnation: 'Doom (1993) - classic Imp (TROO)',
        referenceUrl: 'https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c',
        referenceUrls: ['https://www.spriters-resource.com/ms_dos/doomdoomii/asset/27875/'],
        visualAnchor: 'Classic Doom brown leathery Imp: lean hunched humanoid, two clawed arms and two legs, small red eyes, open dark mouth with ivory teeth, short pale shoulder, elbow and knee spikes. No large head horns, tail, clothing, armor or Doom 2016/Eternal redesign. A_TroopAttack uses claws in melee range and a TROOPSHOT fireball at distance.',
        visualReviewStatus: 'pending'
      },
      { name: 'Cacodemon Orb', hp: 115, atk: 13, spd: 4, color: '#c0392b', weapon: 'bite' },
      { name: 'Revenant Jetpack', hp: 120, atk: 15, spd: 6, color: '#d7dbdd', weapon: 'missiles' },
      {
        name: 'Mancubus Flame Tank', hp: 150, atk: 17, spd: 3, color: '#8b4513', weapon: 'flame_cannons',
        sourceSpeciesName: 'Mancubus',
        incarnation: 'Doom II (1994) - classic Mancubus (FATT)',
        referenceUrl: 'https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c',
        referenceUrls: ['https://www.spriters-resource.com/ms_dos/doomdoomii/asset/27879/'],
        visualAnchor: 'Classic Doom II Mancubus: very wide squat brown/tan folded body, short thick legs and small clawed feet, small bald head and green eyes. Two heavy gray forearm cannons replace the hands, with dark shoulder/back hoses and red connectors. No chest armor, held rifle, jetpack, shoulder rocket launchers or Doom 2016/Eternal redesign. A_FatAttack1/2/3 fire three two-projectile volleys; the existing six-contact signature keeps adapted Nexus timing and balance.',
        visualReviewStatus: 'pending'
      }
    ],
    bosses: [
      { name: 'Marauder Sentinel-Fallen', hp: 620, atk: 25, spd: 7, color: '#7b241c', weapon: 'argent_axe', special: 'Wolf and Axe Counter' },
      { name: 'Spider Mastermind Core', hp: 720, atk: 27, spd: 3, color: '#2c3e50', weapon: 'plasma_brain', special: 'Hell Network Overload' }
    ]
  });
}
