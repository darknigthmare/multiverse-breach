// Godzilla The Animated Series — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Cyber-Godzilla',
      weapon: 'missiles_and_atomic_breath',
      special: 'Cybernetic Atomic Barrage',
      phases: ['Uses missiles and cybernetic charges with intact plating', 'Exposes damaged mechanical sections and uses atomic breath below 50 percent health'],
      lore: {
        fr: 'Le Godzilla 1998 ressuscite et cybernetise est un antagoniste propre a la serie animee.',
        en: 'The resurrected cybernetic 1998 Godzilla is a specific antagonist from the animated series.'
      },
      referenceUrl: 'https://godzilla.fandom.com/wiki/Cyber_Godzilla',
      visualAnchor: 'The exact 1998 Godzilla silhouette rebuilt with the series cybernetic torso, metallic plates, red optics and mounted missile systems.'
    },
    {
      name: 'Crustaceous Rex',
      weapon: 'clawed_forelimbs',
      special: 'Forelimb and Tentacle Sweep',
      phases: ['Alternates long forelimb sweeps with flexible head-tentacle motions', 'Shortens recovery after heavy strikes while preserving its intact shell and original anatomy'],
      combatMechanicsStatus: 'game-adaptation',
      visualReviewStatus: 'pending',
      lore: {
        fr: 'Crustaceous Rex est un mutant crustace geant affronte par H.E.A.T. et Godzilla.',
        en: 'Crustaceous Rex is a giant crustacean mutation fought by H.E.A.T. and Godzilla.'
      },
      referenceUrl: 'https://www.scifijapan.com/anime-animation/godzilla-the-series',
      visualAnchor: 'Crustaceous Rex from Godzilla: The Series (1998), following the Sony Pictures/Adelaide Productions model sheet: dark olive-brown ridged carapace with small cream spikes, ochre segmented underside, extremely elongated segmented forelimbs ending in broad claw-fingered walking hands, small hind limbs, a narrow beak-shaped head opening into a red flower-like mouth, and numerous flexible head tentacles. Preserve this hunched long-armed silhouette rather than ordinary crab pincers or a lobster tail; no invented shell-breaking transformation.'
    }
  ]);
}
