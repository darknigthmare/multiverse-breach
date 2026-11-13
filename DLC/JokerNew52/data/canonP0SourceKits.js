// Joker New 52 — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ REF, guard, lock, melee, ranged }) {
  return (lock({
    incarnation: 'Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - Bruce Wayne',
    referenceUrls: [REF.endgame, REF.batman],
    equipment: ['New 52 Batsuit', 'Batarangs', 'Utility Belt'],
    visualAnchor: 'Bruce Wayne in the New 52 Endgame arc, Batman #35-40: gray armored suit, black cowl with white comic eye lenses, black bat emblem, black cape, gauntlets and boots, yellow-gold utility belt. Ordinary Batsuit form; Justice Buster is a separate armor form. No Grim Knight firearms or movie-specific Nolan costume.',
    weapon: 'fists', weaponType: 'fists', weaponColor: '#34373c',
    primaryColor: '#555a63', secondaryColor: '#24262b',
    simple: melee('New 52 Martial Strike'),
    secondary: ranged('Utility-Belt Batarang', 'projectile', '#656973'),
    defense: guard('Batsuit Gauntlet Guard'),
    special: melee('Endgame Close-Quarters Counter'),
    loreLocalized: {
      fr: 'Ce Bruce Wayne est verrouille sur Batman #35-40, l arc Endgame des New 52 recueilli par DC. Le Joker revient pour le tuer et retourne ses allies contre lui. Le kit conserve le Batsuit ordinaire et les batarangs ; Justice Buster, armure distincte de cet arc, n est pas fusionne avec sa silhouette. Aucun arsenal du Grim Knight n est attribue a ce Batman.',
      en: 'This Bruce Wayne is locked to Batman #35-40, the New 52 Endgame arc collected by DC. The Joker returns to kill him and turns his allies against him. The kit keeps the ordinary Batsuit and Batarangs; Justice Buster, a distinct armor from that arc, is not merged into his silhouette. The Grim Knight s arsenal is not assigned to this Batman.'
    }
  }));
}

export function createCanonP0SourceKits2({ REF, dodge, lock, melee, ranged }) {
  return (lock({
    incarnation: 'Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - the Joker',
    referenceUrls: [REF.endgame, REF.joker],
    equipment: ['Joker Toxin', 'Knife'],
    visualAnchor: 'The Joker in New 52 Endgame, Batman #35-40: chalk-white face, green hair and wide red grin, sinister purple-associated civilian clothing. His restored face is not the detached strapped-on face of Death of the Family. Exact issue panels must drive the final costume review; no movie Joker tattoos, Glasgow smile or Batman Who Laughs visor.',
    weapon: 'knife', weaponType: 'knife', weaponColor: '#b5b6b7',
    primaryColor: '#72448d', secondaryColor: '#75a34a',
    simple: melee('Joker Knife Slash'),
    secondary: ranged('Joker Toxin Spray', 'spray', '#8ab155'),
    defense: dodge('Unpredictable Sidestep'),
    special: ranged('Endgame Toxin Spray', 'spray', '#8ab155'),
    mechanicsReviewStatus: 'Toxin is represented by game damage; Endgame infection and source antidote rules are not simulated.',
    loreLocalized: {
      fr: 'Ce Joker vient de l arc Endgame, Batman #35-40 des New 52. DC decrit son retour pour tuer Batman en retournant ses allies contre lui. Ses armes et sa toxine remplacent les attaques Nexus anonymes ; leurs degats sont une adaptation et non une simulation de l infection. Le visage rattache de Death of the Family appartient a un autre arc et n equipe pas cette incarnation.',
      en: 'This Joker comes from the New 52 Endgame arc, Batman #35-40. DC describes his return to kill Batman by turning his allies against him. Weapons and toxin replace anonymous Nexus attacks; damage is an adaptation rather than an infection simulation. The reattached face from Death of the Family belongs to another arc and does not equip this incarnation.'
    }
  }));
}

export function createCanonP0SourceKits3({ REF, dodge, lock, melee }) {
  return (lock({
    incarnation: 'Suicide Squad (The New 52, volume 4 #1, 2011) - Harley Quinn',
    referenceUrls: [REF.harley],
    equipment: ['Oversized Mallet', 'New 52 Squad Costume'],
    visualAnchor: 'Harley Quinn s early New 52 Suicide Squad design, volume 4 #1 (2011): pale skin, hair divided blue and red, red-and-blue corset and shorts with matching boots and gloves, oversized mallet. Fully clothed source costume. Not the animated jester suit, Rebirth pink-and-blue hair tips, or Margot Robbie s 2016 film wardrobe. Source-panel visual review remains pending.',
    weapon: 'hammer', weaponType: 'hammer', weaponColor: '#8a5941',
    primaryColor: '#b63845', secondaryColor: '#3c5e9b',
    canonStatus: 'Early New 52 Suicide Squad identity locked; presence in the Endgame universe roster is a crossover adaptation, not a claim she fights that comic finale.',
    simple: melee('Oversized Mallet Swing'),
    secondary: melee('Mallet Feint'),
    defense: dodge('Acrobatic Sidestep'),
    special: melee('Squad Mallet Takedown'),
    loreLocalized: {
      fr: 'Cette Harley Quinn vient du debut de Suicide Squad volume 4 des New 52, en 2011, avec son redesign bleu et rouge. Elle ne porte pas automatiquement les habits des films ni de Rebirth. Son maillet et son agilite deviennent un kit de combat adapte. Sa presence dans le roster Joker New 52 est un crossover du projet ; elle ne prouve pas une participation a la finale Endgame de Batman #35-40.',
      en: 'This Harley Quinn comes from the beginning of New 52 Suicide Squad volume 4 in 2011, with its blue-and-red redesign. She does not automatically wear the film or Rebirth costumes. Her mallet and agility become an adapted combat kit. Her place in the Joker New 52 roster is a project crossover, not evidence she participates in Batman #35-40 s Endgame finale.'
    }
  }));
}
