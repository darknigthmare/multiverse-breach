// Fallout — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Viper Gang Raider', hp: 75, atk: 8, spd: 5, color: '#d35400', weapon: 'gun' },
      { name: 'Glowing Feral Ghoul', hp: 70, atk: 10, spd: 6, color: '#2ecc71', weapon: 'rad_claws' },
      { name: 'Super Mutant Enforcer', hp: 120, atk: 11, spd: 4, color: '#52be80', weapon: 'club' }
    ],
    bosses: [
      { name: 'Alpha Deathclaw Beast', hp: 600, atk: 24, spd: 6, color: '#3e2723', weapon: 'claws', special: 'Bone-Shattering Tackle' },
      {
        name: 'Legate Lanius General', canonicalName: 'Legate Lanius',
        hp: 550, atk: 21, spd: 5, color: '#cca43b', weapon: 'greatsword', special: 'Blade of the East Slice',
        incarnation: 'Fallout: New Vegas (2010) - Second Battle of Hoover Dam',
        referenceUrl: 'https://fallout.fandom.com/wiki/Legate_Lanius',
        visualAnchor: 'Legate Lanius in the steel face mask, helmet, red cloth and heavy Legion armor from Fallout: New Vegas, wielding the Blade of the East at the Legate camp. No Enclave power armor or Liberty Prime parts.',
        visualReviewStatus: 'pending'
      }
    ],
    worldBoss: { name: 'Rogue Liberty Prime Mech', hp: 1500, atk: 35, spd: 3, color: '#7f8c8d', weapon: 'laser', special: 'Tactical Nuke Throw Strike' }
  });
}
