// Avatar (Na'vi) — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialRoutes() {
  return (['Avatar (Na\'vi)', 'switches', ['avatar_ardmore']]);
}

export function createLegacyNonCombatTrialRoutes2() {
  return (['Avatar (Na\'vi)', 'break-object', ['avatar_seadragon']]);
}

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'avatar_navi',
    universe: 'Avatar (Na\'vi)',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Avatar (Na vi)',
    stage: 'Pandora Tree of Souls Defense',
    boss: 'RDA Dragon Assault Ship',
    cast: [
      ['jake_sully_avatar', 'Jake Sully', 'slayer'],
      ['neytiri_avatar', 'Neytiri', 'tactical'],
      ['kiri_avatar', 'Kiri', 'hacker']
    ],
    enemies: ['RDA SecOps Marine', 'AMP Suit', 'Recombinant Hunter'],
    bosses: ['Colonel Quaritch', 'RDA Dragon Gunship'],
    gear: [
      ['na_vi_bow', 'Na vi Hunting Bow', 'Arc de chasse Na vi'],
      ['queue_link', 'Tsaheylu Link Braid', 'Tresse de lien Tsaheylu'],
      ['unobtanium', 'Unobtanium Sample', 'Echantillon d unobtanium']
    ],
    event: ['eywa', 'Eywa Planetary Response', 'Reponse planetaire d Eywa', 'Pandora s wildlife converges on the marked invaders while allied riders gain full mobility.', 'La faune de Pandora converge sur les envahisseurs marques tandis que les cavaliers allies gagnent une mobilite totale.'],
    origin: ['On Pandora, the Na vi live through Eywa s biological network while the RDA extracts resources by military force.', 'Sur Pandora, les Na vi vivent a travers le reseau biologique d Eywa tandis que la RDA extrait les ressources par la force militaire.'],
    breach: ['Eywa hears Mosaic City as a severed neural forest and sends roots through portals to reconnect its isolated memories.', 'Eywa entend la Cite-Mosaique comme une foret neurale sectionnee et envoie des racines a travers les portails pour reconnecter ses souvenirs isoles.'],
    motif: 'wasteland',
    colors: ['#0d2f34', '#020708', '#5ce0d3']
  }));
}
