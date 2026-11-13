// Resident Evil — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Resident Evil', fr: 'Resident Evil' },
    desc: {
      en: 'A survival-horror universe shaped by Umbrella Corporation experiments, Raccoon City outbreak, T-Virus and G-Virus contamination, scarce resources, locked routes, and bio-organic weapons such as Lickers, Tyrants, Nemesis, and William Birkin mutations.',
      fr: 'Un univers survival-horror faconne par les experiences d Umbrella Corporation, l epidemie de Raccoon City, les contaminations T-Virus et G-Virus, les ressources rares, les routes verrouillees et les armes bio-organiques comme les Lickers, les Tyrants, Nemesis et les mutations de William Birkin.'
    }
  });
}
