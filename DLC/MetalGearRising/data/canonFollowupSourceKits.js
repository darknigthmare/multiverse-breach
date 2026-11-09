// Metal Gear Rising — definitions consumed by src/game/canonFollowupSourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonFollowupSourceKits({ guard, lock, melee }) {
  return (lock({
    sourceUniverse: 'Metal Gear Rising',
    incarnation: 'Metal Gear Rising: Revengeance (2013) - Mistral with Dwarf Gekko arms and L’Étranger',
    referenceUrls: ['https://metalgear.fandom.com/wiki/Mistral'],
    equipment: ['L’Étranger Dwarf Gekko Polearm', 'Attached Articulated Dwarf Gekko Arms'],
    sourceAbilities: ['L’Étranger Polearm Strikes', 'Articulated Dwarf Gekko Arm Attacks'],
    visualAnchor: 'Mistral in Metal Gear Rising: Revengeance (2013): red hair, fitted cyborg body and articulated Dwarf Gekko arms attached around her upper body. L’Étranger is assembled from Dwarf Gekko parts; keep the polearm and multiple attached arms visible and distinct. A two-arm fist fighter or Monsoon-style magnetic body is not this selected presentation.',
    weapon: 'polearm', weaponType: 'polearm', weaponColor: '#a9adb3',
    primaryColor: '#a54c43', secondaryColor: '#535960',
    simple: melee('L’Étranger Polearm Thrust'),
    secondary: melee('Articulated Dwarf Gekko Arm Strike'),
    defense: guard('L’Étranger Polearm Guard'),
    special: melee('L’Étranger Close-Quarters Sweep'),
    loreLocalized: {
      fr: 'Mistral est une cyborg des Winds of Destruction dans Metal Gear Rising: Revengeance de 2013. Les bras articulés issus des Dwarf Gekko et la lance L’Étranger définissent cette présentation de son combat contre Raiden. Le kit utilise des frappes physiques de lance et de bras ; il ne lui attribue ni la segmentation magnétique de Monsoon, ni une possession, ni un rayon Nexus. La portée, la garde et les dégâts restent des adaptations, et la comparaison avec la source originale est en attente.',
      en: 'Mistral is a Winds of Destruction cyborg in Metal Gear Rising: Revengeance (2013). Articulated Dwarf Gekko arms and the assembled L’Étranger polearm define this presentation of her fight with Raiden. The kit uses physical polearm and arm strikes without granting Monsoon’s magnetic segmentation, possession or a Nexus beam. Reach, guarding and damage remain adaptations, and comparison with the original source is pending.'
    }
  }));
}
