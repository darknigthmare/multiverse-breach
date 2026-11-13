// Hazbin Hotel — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Hazbin Hotel',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Happy Hotel Redemption Rift',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Extermination Overlord',
    title: { en: 'Hazbin Hotel', fr: 'Hazbin Hotel' },
    desc: {
      en: 'A musical Hell hotel caught between redemption, overlords, angelic extermination, and theatrical chaos.',
      fr: 'Un hotel infernal musical entre redemption, overlords, extermination angelique et chaos de cabaret.'
    },
    hero: { id: 'charlie_hazbin', name: 'Charlie Morningstar', cat: 'hacker', color: '#ff5b6e' },
    allies: [
      { id: 'vaggie_hazbin', name: 'Vaggie', cat: 'tactical', color: '#d7c8ff' },
      { id: 'alastor_hazbin', name: 'Alastor', cat: 'horror', color: '#8b0000' }
    ],
    monsters: ['Exorcist Scout', 'Cannibal Town Imp', 'Radio Static Demon'],
    bosses: ['Radio Demon Contract', 'Angel Spear Captain'],
    worldBoss: 'Extermination Overlord',
    gear: [
      ['hazbin_hotel_key', 'Happy Hotel Key', 'Cle du Happy Hotel', { hp: 75, def: 4 }],
      ['hazbin_radio_mic', 'Radio Demon Mic', 'Micro du demon radio', { atk: 10 }],
      ['hazbin_angel_spear', 'Exorcist Spear Shard', 'Eclat de lance exorciste', { atk: 8, spd: 1 }]
    ],
    event: ['evt_hazbin_redemption', 'Redemption Refrain', 'Refrain de redemption', 'A cabaret burst heals allies and fears demonic enemies.', 'Un numero de cabaret soigne les allies et effraie les demons.'],
    decor: { sky: ['#34111b', '#070204'], floor: 'rgba(206, 45, 83, 0.18)', grid: 'rgba(255, 211, 92, 0.28)', motif: 'circus', accent: '#ffd35c' }
  });
}
