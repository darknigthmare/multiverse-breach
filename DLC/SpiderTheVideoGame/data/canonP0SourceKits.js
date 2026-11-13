// Spider: The Video Game — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ dodge, melee, spiderLoadout }) {
  return (spiderLoadout({
    equipment: ['Cybernetic Spider Body', 'Default Slasher Attachment'],
    visualAnchor: 'The small cybernetic spider carrying Dr. Michael Kelly s mind in Spider: The Video Game (1997), insect-scale laboratory setting and interchangeable weapon legs. This base slot uses the default slasher attachment. No humanoid exosuit, Spider-Man costume or claim that an original substitute sprite already matches the source model.',
    weapon: 'blade', weaponType: 'blade', weaponColor: '#a6b7b3',
    simple: melee('Slasher Cyber-Leg Cut'),
    secondary: melee('Cybernetic Slasher Feint'),
    defense: dodge('Spider Leg Sidestep'),
    special: melee('Slasher Attachment Rush'),
    loreLocalized: {
      fr: 'L esprit du docteur Michael Kelly est transfere dans une araignee cybernetique dans Spider: The Video Game de 1997. Elle traverse des environnements de laboratoire a petite echelle et equipe des armes-pattes interchangeables ; le slasher est l attachment de base. Cette entree jouable represente un loadout du meme protagoniste, pas une nouvelle personne canonique. Son ancien sprite original reste a revoir.',
      en: 'Dr. Michael Kelly s mind is transferred into a cybernetic spider in 1997 s Spider: The Video Game. It crosses insect-scale laboratory environments and equips interchangeable weapon legs; the slasher is its base attachment. This playable entry represents a loadout of the same protagonist, not a new official character. Its historical original substitute sprite remains under review.'
    }
  }));
}

export function createCanonP0SourceKits2({ dodge, ranged, spiderLoadout }) {
  return (spiderLoadout({
    equipment: ['Cybernetic Spider Body', 'Flamethrower Cyber-Leg'],
    visualAnchor: 'Same Kelly cybernetic-spider protagonist, with the source pack s Flamethrower Cyber-Leg loadout. Small multi-legged spider, flame emission associated with a mechanical leg, not a humanoid blade warrior. Exact 1997 weapon attachment appearance awaits original gameplay review; the existing substitute sprite is not approved.',
    weapon: 'flamethrower', weaponType: 'flamethrower', weaponColor: '#f69a44',
    simple: ranged('Flamethrower Cyber-Leg', 'fire', '#f69a44'),
    secondary: ranged('Flamethrower Attachment Sweep', 'fire', '#f69a44'),
    defense: dodge('Spider Leg Sidestep'),
    special: ranged('Flamethrower Cyber-Leg Burst', 'fire', '#f69a44'),
    loreLocalized: {
      fr: 'Cette entree conserve l identite de Kelly dans l araignee cybernetique de Spider: The Video Game, avec le loadout lance-flammes nomme par le pack source du projet. Il ne s agit pas d un autre personnage officiel : le slot et les enchainements sont une adaptation jouable. Le lance-flammes remplace le slash generique ; modele exact de la patte, carburant et comportement du jeu original restent a revoir.',
      en: 'This entry keeps Kelly s cybernetic-spider identity from Spider: The Video Game with the flamethrower loadout named by the project source pack. It is not another official character: the slot and sequences are a playable adaptation. Flame replaces the generic slash; the exact leg model, fuel and original-game behavior remain to be reviewed.'
    }
  }));
}

export function createCanonP0SourceKits3({ dodge, ranged, spiderLoadout }) {
  return (spiderLoadout({
    equipment: ['Cybernetic Spider Body', 'Electro-Beam Cyber-Leg'],
    visualAnchor: 'Same Kelly cybernetic-spider protagonist, with the source pack s Electro-Beam attachment loadout. Small multi-legged cybernetic spider; the electrical beam belongs to a weapon leg, not a human gun. Exact 1997 weapon model and beam presentation await original gameplay review; the existing original substitute sprite is not approved.',
    weapon: 'electro_beam', weaponType: 'electro_beam', weaponColor: '#a6ddf0',
    simple: ranged('Electro-Beam Cyber-Leg', 'beam', '#a6ddf0'),
    secondary: ranged('Electro-Beam Attachment Sweep', 'beam', '#a6ddf0'),
    defense: dodge('Spider Leg Sidestep'),
    special: ranged('Electro-Beam Cyber-Leg Burst', 'beam', '#a6ddf0'),
    loreLocalized: {
      fr: 'Cette variante represente le loadout Electro-Beam du meme Kelly/araignee de Spider: The Video Game de 1997. Le rayon de la patte remplace les balles derivees de la classe tactical. Le slot jouable est une adaptation du projet, pas un second protagoniste canonique ; le modele de l attachment et ses contraintes exactes demandent encore une reference de manuel ou de gameplay.',
      en: 'This variant represents the Electro-Beam loadout of the same Kelly/spider from 1997 s Spider: The Video Game. A leg-mounted beam replaces the class-derived tactical bullets. The playable slot is a project adaptation, not a second official protagonist; the attachment model and exact constraints still require a manual or gameplay reference.'
    }
  }));
}
