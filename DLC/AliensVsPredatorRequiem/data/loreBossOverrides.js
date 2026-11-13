// Aliens vs Predator: Requiem — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Wolf Predator',
      weapon: 'dual_plasmacasters_whip_and_cleaner_fluid',
      special: 'Cleaner Protocol',
      phases: ['Uses dual shoulder cannons, mines and cleaner fluid', 'Switches to the razor whip and wrist blades for the rooftop duel'],
      lore: {
        fr: 'Wolf est le nettoyeur envoye pour effacer les preuves de l infestation.',
        en: 'Wolf is the cleaner sent to erase evidence of the infestation.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem',
      visualAnchor: 'Exact battle-scarred Wolf Predator, damaged biomask, dark armor, dual plasmacasters, whip and cleaner-fluid kit.'
    },
    {
      name: 'Predalien',
      weapon: 'tail_claws_inner_jaw_and_implantation',
      special: 'Rooftop Hybrid Assault',
      phases: ['Uses xenomorph wall movement, tail and inner jaw', 'Uses the film-specific reproductive attack before the final rooftop exchange'],
      lore: {
        fr: 'Le Predalien remplace l effondrement abstrait de la Garde nationale.',
        en: 'The Predalien replaces the abstract National Guard collapse.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem',
      visualAnchor: 'Exact AVPR Predalien, xenomorph body, Predator mandibles and dreadlock-like appendages, ridged crown and long tail.'
    }
  ]);
}
