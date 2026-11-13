// Metal Gear — definitions consumed by src/game/canonFollowupSourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonFollowupSourceKits({ guard, lock, melee }) {
  return (lock({
    sourceUniverse: 'Metal Gear',
    incarnation: 'Metal Gear Solid (1998) - Liquid Snake, final bare-handed duel on REX',
    referenceUrls: ['https://metalgear.fandom.com/wiki/Liquid_Snake'],
    equipment: ['Bare Fists', 'Bare-Chested Final-Duel Outfit'],
    sourceAbilities: ['Bare-Handed Strikes', 'Close-Quarters Kicks'],
    visualAnchor: 'Liquid Snake in the final Metal Gear Solid (1998) duel on the wrecked REX: long blond hair, bare muscular torso, trousers and boots, bare fists. The final-duel silhouette has no coat, sunglasses or handheld firearm. Hind D belongs to a separate earlier encounter and is not support for this bare-handed kit.',
    weapon: 'fists', weaponType: 'fists', weaponColor: '#c1a380',
    primaryColor: '#c1a380', secondaryColor: '#6f6755',
    simple: melee('Final-Duel Punch'),
    secondary: melee('Close-Quarters Kick'),
    defense: guard('Bare-Handed Duel Guard'),
    special: melee('REX-Top Bare-Handed Rush'),
    loreLocalized: {
      fr: 'Cette incarnation de Liquid Snake vise le duel final à mains nues sur REX détruit dans Metal Gear Solid de 1998. Il affronte Solid Snake avec ses poings et ses coups de pied, torse nu. Son manteau, un fusil et un soutien du Hind D ne font pas partie de ce kit. Les gestes physiques, leurs dégâts et leurs enchaînements sont adaptés au jeu ; les descriptions et les URL candidates ne remplacent pas une comparaison indépendante avec le combat original.',
      en: 'This incarnation of Liquid Snake selects the final bare-handed duel atop the wrecked REX in Metal Gear Solid (1998). He faces Solid Snake with punches and kicks, bare-chested. A coat, firearm and Hind D support are not part of this kit. Physical actions, damage and sequences adapt the source to the game; descriptions and candidate URLs do not replace independent comparison with the original fight.'
    }
  }));
}
