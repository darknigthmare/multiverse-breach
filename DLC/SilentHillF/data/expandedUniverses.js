// Silent Hill f — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'silent_hill_f',
    universe: 'Silent Hill f',
    mediaType: 'game',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'Ebisugaoka Red Spider Lily Fog',
    boss: 'Fox Mask Wedding Rite',
    worldBoss: 'White Kimono Manifestation',
    cast: [
      ['hinako_shf', 'Hinako Shimizu', 'slayer'],
      ['shu_iwai_shf', 'Shu Iwai', 'tactical'],
      ['rinko_nishida_shf', 'Rinko Nishida', 'hacker'],
      ['sakuko_igarashi_shf', 'Sakuko Igarashi', 'horror']
    ],
    enemies: ['Kashimashi', 'Ayakakashi', 'Ebisugaoka Bloom Husk'],
    bosses: ['Fox Mask', 'White Kimono Manifestation'],
    gear: [
      ['naginata', 'Hinako Naginata', 'Naginata de Hinako'],
      ['omamori', 'Ebisugaoka Omamori', 'Omamori d Ebisugaoka'],
      ['red_capsule', 'Shu Red Capsule', 'Capsule rouge de Shu']
    ],
    event: ['fox_wedding', 'Fox Wedding Procession', 'Procession du mariage du renard', 'A ritual procession roots enemies in red spider lilies while Hinako breaks the imposed path.', 'Une procession rituelle immobilise les ennemis dans les lycoris rouges pendant que Hinako brise le destin impose.'],
    origin: ['In 1960s Ebisugaoka, Hinako and her friends face fog, flowers, social pressure, and a shrine rite that turns intimacy into body horror.', 'Dans l Ebisugaoka des annees 1960, Hinako et ses amis affrontent le brouillard, les fleurs, la pression sociale et un rite qui transforme l intimite en horreur corporelle.'],
    breach: ['the Fox Mask mistakes the Nexus Anchor for a new wedding witness and spreads the Dark Shrine through Mosaic City memories.', 'le Masque de Renard prend l Ancre du Nexus pour un nouveau temoin et propage le Sanctuaire sombre dans les souvenirs de la Cite-Mosaique.'],
    motif: 'hauntedset',
    colors: ['#241318', '#050203', '#d94b68'],
    stageVariants: [['Tactics', 'Dark Shrine Wedding Hall', 'Expert', 'Fox Mask']]
  }));
}
