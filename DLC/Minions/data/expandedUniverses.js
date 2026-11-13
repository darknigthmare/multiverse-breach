// Minions — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'minions',
    universe: 'Minions',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Medium',
    stage: 'Villain-Con Crown Heist',
    boss: 'Scarlet Overkill Coronation',
    cast: [
      ['kevin_minions', 'Kevin', 'tactical'],
      ['stuart_minions', 'Stuart', 'slayer'],
      ['bob_minions', 'Bob', 'hacker']
    ],
    enemies: ['Villain-Con Guard', 'Crown Vault Bot', 'Overkill Henchman'],
    bosses: ['Herb Overkill', 'Scarlet Overkill'],
    gear: [
      // The historical ID/path remain a save alias; the target is the Freeze
      // Ray used by young Gru in this film, not Nefario s separate Fart Gun.
      ['fart_gun', 'Gru s Freeze Ray', 'Rayon gelant de Gru', {
        canonicalName: 'Freeze Ray',
        canonicalItemId: 'gru_freeze_ray_minions_2015',
        incarnation: 'Minions (2015) - young Gru / London finale',
        sourceOwner: 'Young Gru',
        legacyIdReason: 'minions_fart_gun preserves saved equipment references and the existing sprite path; it does not identify a Fart Gun.',
        referenceUrl: 'https://en.wikipedia.org/wiki/Minions_(film)',
        referenceUrls: ['https://www.illumination.com/movie/minions/', 'https://en.wikipedia.org/wiki/Minions_(film)'],
        referenceStatus: 'source identity documented; physical prop reference pending',
        visualAnchor: 'Freeze Ray used by young Gru in the final London scene of Minions (2015), freezing Scarlet and Herb Overkill. This is the ice-ray gadget, distinct from Dr. Nefario s Fart Gun. Verify the physical silhouette, colors and materials against that exact film scene before rendering; do not combine gas clouds, designs from other films or invented hidden geometry.',
        canonStatus: 'source identity locked; passive stat boosts are a game adaptation',
        visualReviewStatus: 'pending',
        icon: '/sprites/generated/items/minions/minions-fart-gun.png',
        desc: {
          en: 'Young Gru uses the Freeze Ray to freeze Scarlet and Herb at the end of Minions (2015). In this game, equipping the item grants passive attack and speed bonuses; it does not trigger freezing.',
          fr: 'Le jeune Gru utilise ce rayon pour geler Scarlet et Herb dans la finale de Minions (2015). Dans le jeu, cet equipement donne des bonus passifs d attaque et de vitesse, sans declencher de gel.'
        },
        gameplayPolicy: {
          kind: 'passive-equipment',
          canonicalEffect: 'freezing ray',
          runtimeEffect: 'stat-boost-only',
          hasRuntimeFreeze: false
        }
      }],
      ['crown', 'Stolen Royal Crown', 'Couronne royale volee'],
      ['banana', 'Emergency Banana', 'Banane d urgence']
    ],
    event: ['king_bob', 'King Bob Decree', 'Decret du roi Bob', 'Bob accidentally pardons the squad and redirects every royal guard toward the boss.', 'Bob gracie accidentellement l escouade et redirige toute la garde royale vers le boss.'],
    origin: ['Kevin, Stuart, and Bob search through history for a villain worthy of their chaotic loyalty and find Scarlet Overkill.', 'Kevin, Stuart et Bob parcourent l histoire a la recherche d un mechant digne de leur loyaut chaotique et trouvent Scarlet Overkill.'],
    breach: ['the trio adopts the strongest portal as a new boss, causing unstable allegiance changes that A.R.C.A. can exploit but never fully predict.', 'le trio adopte le portail le plus puissant comme nouveau chef, provoquant des changements d allegeance qu A.R.C.A. peut exploiter sans les predire.'],
    motif: 'arcanecity',
    colors: ['#2f2b12', '#070603', '#f4d74d']
  }));
}
