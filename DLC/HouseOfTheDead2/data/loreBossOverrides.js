// House of the Dead 2 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Judgment (Kuarl & Zeal)',
      weapon: 'kuarl_axe_and_zeal_flight',
      special: 'Judgment Duo Assault',
      phases: ['Zeal circles and directs Kuarl while the armored giant swings its axe', 'After Kuarl falls, Zeal performs rapid solo diving attacks'],
      lore: {
        fr: 'Judgment est le duo inseparable forme par le petit Zeal volant et le geant Kuarl en armure.',
        en: 'Judgment is the inseparable duo formed by the small flying Zeal and the armored giant Kuarl.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Judgment',
      visualAnchor: 'Show the exact House of the Dead 2 pair together: tiny blue-purple winged Zeal beside massive headless bronze-armored Kuarl carrying his oversized axe; never merge them into one body or add a third character.'
    },
    {
      name: 'Tower',
      weapon: 'multi_headed_bites_and_water_charge',
      special: 'Canal Hydra Assault',
      phases: ['Four red serpent heads strike independently from the flooded chamber', 'The surviving blue leader head leaves the water for a direct pursuit'],
      lore: {
        fr: 'Tower est une hydre aquatique; ses tetes rouges protegent la tete bleue dominante.',
        en: 'Tower is an aquatic hydra whose red heads protect the dominant blue head.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Tower',
      visualAnchor: 'Exact House of the Dead 2 Tower Type 8000: four long red eel-dragon heads and one distinct blue leader head rising from one submerged body, glossy aquatic skin and toothy maws; no humanoid torso or fantasy armor.'
    }
  ]);
}
