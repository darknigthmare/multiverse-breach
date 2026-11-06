// La Casa de Papel — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Cesar Gandia',
      weapon: 'assault_rifle_and_grenades',
      special: 'Bank Security Hunt',
      phases: ['Uses armor, cover and controlled rifle fire', 'Switches to grenades and close pursuit after his armor breaks'],
      lore: {
        fr: 'Gandia est le chef de securite qui traque le groupe dans la Banque d Espagne.',
        en: 'Gandia is the security chief who hunts the group inside the Bank of Spain.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/money-heist-cast',
      visualAnchor: 'Exact Jose Manuel Poga likeness, black security tactical gear, body armor and series firearms.'
    },
    {
      name: 'Colonel Tamayo',
      weapon: 'police_command_and_sidearm',
      special: 'State Assault Order',
      phases: ['Directs police pressure and timed sniper zones', 'Enters the bank with a sidearm only if the command phase collapses'],
      lore: {
        fr: 'Tamayo commande la reponse de l Etat contre les braqueurs.',
        en: 'Tamayo commands the state response against the robbers.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/money-heist-cast',
      visualAnchor: 'Exact Fernando Cayo likeness, Spanish police command uniform and service sidearm; no invented heavy combat suit.'
    }
  ]);
}
