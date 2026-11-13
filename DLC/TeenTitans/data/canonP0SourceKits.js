// Teen Titans — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ REF, guard, ranged, titans }) {
  return (titans({
    referenceUrls: [REF.raven],
    equipment: ['Mystical Powers', 'Hooded Purple Cloak'],
    visualAnchor: 'Raven in the original 2003 Teen Titans animated series: gray skin, short violet hair, red forehead gem, dark outfit beneath a hooded blue-violet cloak with red clasp, blue-violet boots. Mystical dark-energy and telekinetic presentation, no mechanical laser rifle, Teen Titans Go proportions or live-action Titans wardrobe.',
    weapon: 'magic', weaponType: 'magic', weaponColor: '#3c3259',
    primaryColor: '#54528c', secondaryColor: '#312a44',
    simple: ranged('Mystical Telekinetic Strike', 'gravity', '#383044'),
    secondary: ranged('Telekinetic Debris', 'gravity', '#383044'),
    defense: guard('Mystical Barrier'),
    special: ranged('Raven Telekinetic Restraint', 'gravity', '#383044'),
    loreLocalized: {
      fr: 'Cette Raven est celle de la serie animee Teen Titans commencee en 2003, pas de Teen Titans Go ni de la serie live-action Titans. Fille de Trigon, elle discipline ses emotions et pratique les arts mystiques. Son kit emploie telekinesie et protection magique sans lui donner un fusil laser ; les degats et la retenue de cible restent des abstractions du jeu.',
      en: 'This Raven belongs to the Teen Titans animated series that began in 2003, not Teen Titans Go or the live-action Titans series. Trigon s daughter disciplines her emotions and practices mystical arts. Her kit uses telekinesis and magical protection without a laser rifle; damage and target restraint remain game abstractions.'
    }
  }));
}

export function createCanonP0SourceKits2({ REF, guard, melee, ranged, titans }) {
  return (titans({
    referenceUrls: [REF.starfire],
    equipment: ['Tamaranean Starbolts', 'Purple Animated-Series Costume'],
    visualAnchor: 'Starfire in the original 2003 Teen Titans animated series: orange skin, long red hair, large green eyes, purple top and skirt, purple boots, silver neck piece and bracers with green gems. Green starbolts from her hands, not orange weapon fire, a rifle, New 52 comic costume or live-action Titans wardrobe.',
    weapon: 'starbolts', weaponType: 'starbolts', weaponColor: '#63ef72',
    primaryColor: '#ee874a', secondaryColor: '#845ca4',
    simple: ranged('Green Starbolt', 'energy', '#63ef72'),
    secondary: melee('Tamaranean Flight Kick'),
    defense: guard('Tamaranean Resilience'),
    special: ranged('Green Starbolt Volley', 'energy', '#63ef72'),
    loreLocalized: {
      fr: 'Cette Starfire est Koriand r de Tamaran dans la serie animee Teen Titans de 2003. Elle rejoint l equipe de Jump City et garde sa force, son vol et ses starbolts verts. Un starbolt est une attaque d energie a distance ; son coup de pied reste une action de contact distincte. La trajectoire et les chiffres adaptes du jeu ne certifient pas une choregraphie d episode.',
      en: 'This Starfire is Koriand r of Tamaran in the 2003 Teen Titans animated series. She joins the Jump City team and retains strength, flight and green starbolts. A starbolt is a ranged energy attack; her kick remains a separate contact action. Adapted game trajectories and numbers do not certify an episode s choreography.'
    }
  }));
}
