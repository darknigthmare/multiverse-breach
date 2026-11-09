// RRRrrrr!!! — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Pierre le Guerissologue',
      weapon: 'stone_age_tools',
      special: 'Prehistoric Murderer Reveal',
      phases: ['Uses deceptive healer gestures and improvised tools', 'Reveals the murderer role and uses traps while fleeing'],
      lore: {
        fr: 'Pierre le guerissologue est lie a l enquete meurtriere de la tribu.',
        en: 'Pierre the healer is tied to the tribe s murder investigation.'
      },
      referenceUrl: 'https://tf1pro.com/programmes/produit/rrrrrrr',
      visualAnchor: 'Exact prehistoric-comedy clothing, hair and tribe accessories from the film, with no modern weapon.'
    },
    {
      name: 'Chef des Cheveux Sales',
      weapon: 'primitive_club',
      special: 'Dirty-Hair Tribe Charge',
      phases: ['Uses heavy club swings and shoves', 'Calls a short tribe charge before the final stagger'],
      lore: {
        fr: 'Le chef des Cheveux Sales fournit un combat comique fonde sur la force.',
        en: 'The Dirty Hair chief provides a comedy encounter built around strength.'
      },
      referenceUrl: 'https://tf1pro.com/programmes/produit/rrrrrrr',
      visualAnchor: 'Exact massive film silhouette, dirty hair, furs, primitive jewelry and club.'
    }
  ]);
}
