// Halo — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Gravemind',
      weapon: 'flood_tendrils_and_biomass',
      special: 'Flood Consciousness',
      phases: ['Sweeps with massive Flood tendrils around one coherent biomass', 'Exposes the flower-like speaking core and calls a limited infection wave'],
      lore: {
        fr: 'Les tendrils et le node appartiennent au meme Gravemind et ne forment pas deux boss.',
        en: 'The tendrils and node belong to one Gravemind and are not two separate bosses.'
      },
      referenceUrl: 'https://www.halowaypoint.com/news/canon-fodder-infection-imminent',
      visualAnchor: 'Exact Halo 2 and Halo 3 Flood biomass, huge layered tendrils and flower-like speaking mouth; one organism, no plant foliage.'
    },
    {
      name: 'The Didact',
      weapon: 'constraint_field_and_forerunner_armor',
      special: 'Composer Pulse',
      phases: ['Uses a constraint field, telekinetic throws and armor strikes', 'Damaged armor exposes the face before a focused Composer pulse'],
      lore: {
        fr: 'L Ur-Didact est represente directement, pas comme un echo spectral.',
        en: 'The Ur-Didact is represented directly, not as a spectral echo.'
      },
      referenceUrl: 'https://www.halowaypoint.com/news/canon-fodder-didacts-domain',
      visualAnchor: 'Exact Halo 4 black-orange Forerunner Warrior-Servant armor, helmet, tall build and documented face.'
    }
  ]);
}
