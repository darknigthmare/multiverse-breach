// The Matrix — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'The Matrix', fr: 'The Matrix' },
    desc: {
      en: 'A cyberpunk universe where humanity is imprisoned inside a machine-made simulation while Zion resists underground, operators jack free minds into the Matrix, Agents enforce control, rogue programs exploit causality, and the Source turns prophecy, choice, and rebellion into system-level conflict.',
      fr: 'Un univers cyberpunk ou l humanite est enfermee dans une simulation creee par les Machines pendant que Zion resiste sous terre, les operateurs connectent les esprits libres, les Agents maintiennent le controle, les programmes exiles manipulent la causalite et la Source transforme prophetie, choix et rebellion en conflit systeme.'
    }
  });
}
