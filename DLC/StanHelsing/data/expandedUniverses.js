// Stan Helsing — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'stan_helsing',
    universe: 'Stan Helsing',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Medium',
    stage: 'Stormy Night Monster Karaoke',
    boss: 'Horror Parody Monster Lineup',
    cast: [
      ['stan_helsing', 'Stan Helsing', 'hacker'],
      ['nadine_helsing', 'Nadine', 'tactical'],
      ['teddy_helsing', 'Teddy', 'slayer']
    ],
    enemies: ['Needleface Parody', 'Lucky Doll Parody', 'Fweddy Parody'],
    bosses: ['Mason Parody', 'Monster Karaoke Host'],
    gear: [
      ['karaoke_mic', 'Monster Karaoke Microphone', 'Micro de karaoke monstrueux'],
      ['video_scanner', 'Video Store Horror Scanner', 'Scanner horreur du video-club'],
      ['helsing_badge', 'Helsing Family Badge', 'Insigne de la famille Helsing']
    ],
    event: ['karaoke', 'Monster Karaoke Counter', 'Contre du karaoke monstrueux', 'Stan survives the chorus long enough to expose every parody monster s obvious weakness.', 'Stan survit au refrain assez longtemps pour reveler la faiblesse evidente de chaque monstre parodique.'],
    origin: ['Video-store clerk Stan discovers a dubious Helsing legacy while trapped in a town populated by parody versions of horror icons.', 'Le vendeur de video-club Stan decouvre un heritage Helsing douteux dans une ville peuplee de versions parodiques d icones horrifiques.'],
    breach: ['the copies arrive without their original rules, so A.R.C.A. must treat parody timing as a real combat system.', 'les copies arrivent sans les regles originales, et A.R.C.A. doit traiter le rythme parodique comme un vrai systeme de combat.'],
    motif: 'hauntedset',
    colors: ['#24122b', '#050205', '#c75bc9']
  }));
}
