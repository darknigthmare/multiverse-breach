// Noob — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Noob',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Olydri Guild Rift',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Horizon 1.0 Corrupted Raid',
    title: { en: 'Noob', fr: 'Noob' },
    desc: {
      en: 'A French MMORPG comedy universe where guild mistakes, avatars, raids, and Olydri lore become a breach event.',
      fr: 'Un univers MMORPG francais ou boulettes de guilde, avatars, raids et lore d Olydri deviennent une breche.'
    },
    hero: { id: 'sparadrap_noob', name: 'Sparadrap', cat: 'hacker', color: '#f0e6c8' },
    allies: [
      { id: 'gloglo_noob', name: 'Gaea', cat: 'tactical', color: '#75b843' },
      { id: 'omega_zell_noob', name: 'Omega Zell', cat: 'slayer', color: '#345995' }
    ],
    monsters: ['Olydri Slime', 'Bugged NPC', 'PK Ambusher'],
    bosses: ['Corrupted Guild Master', 'Raid Boss Instance'],
    worldBoss: 'Horizon 1.0 Corrupted Raid',
    gear: [
      ['noob_guild_tabard', 'Noob Guild Tabard', 'Tabard guilde Noob', { hp: 70, def: 4 }],
      ['noob_bug_report', 'Bug Report Scroll', 'Parchemin rapport de bug', { spd: 2, def: 3 }],
      ['noob_raid_token', 'Olydri Raid Token', 'Jeton de raid Olydri', { atk: 9 }]
    ],
    event: ['evt_noob_respawn', 'Chaotic Respawn', 'Respawn chaotique', 'A bugged respawn heals allies and scrambles enemy actions.', 'Un respawn bugge soigne les allies et brouille les actions ennemies.'],
    decor: { sky: ['#1d3148', '#04070c'], floor: 'rgba(71, 139, 94, 0.17)', grid: 'rgba(106, 213, 255, 0.27)', motif: 'digitalfield', accent: '#6ad5ff' }
  });
}
