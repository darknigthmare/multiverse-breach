// Meet the Feebles — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Bletch',
      weapon: 'revolver_and_stage_enforcers',
      special: 'Feeble Theatre Crackdown',
      phases: ['Uses a revolver and orders theatre enforcers forward', 'Loses control and fires wildly across the stage'],
      lore: {
        fr: 'Bletch dirige le theatre et exploite les Feebles.',
        en: 'Bletch runs the theatre and exploits the Feebles.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Meet_the_Feebles',
      visualAnchor: 'Exact walrus puppet design from the film, formal theatre-owner clothing, tusks and revolver; retain practical-puppet texture.'
    },
    {
      name: 'Trevor the Rat',
      weapon: 'knife_and_drug_props',
      special: 'Backstage Ambush',
      phases: ['Uses quick knife feints and backstage cover', 'Becomes erratic and rushes at close range when cornered'],
      lore: {
        fr: 'Trevor est le rat trafiquant et pornographe du theatre.',
        en: 'Trevor is the theatre s drug-dealing pornographer rat.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Meet_the_Feebles',
      visualAnchor: 'Exact scruffy rat puppet, greasy clothing and practical-puppet materials from the film; no realistic rodent redesign.'
    }
  ]);
}
