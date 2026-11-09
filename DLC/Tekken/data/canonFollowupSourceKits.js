// Tekken — definitions consumed by src/game/canonFollowupSourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonFollowupSourceKits({ guard, lock, melee }) {
  return (lock({
    sourceUniverse: 'Tekken',
    incarnation: 'Tekken 3 (1997 arcade / 1998 PlayStation) - True Ogre, transformed beast form',
    referenceUrls: ['https://tekken.fandom.com/wiki/True_Ogre'],
    equipment: ['Bestial Claw', 'Serpent Arm', 'Horned Winged Beast Anatomy'],
    sourceAbilities: ['Claw Strikes', 'Serpent-Arm Strikes', 'Physical Beast Attacks'],
    visualAnchor: 'True Ogre in Tekken 3 is the transformed large horned and winged beast, with an asymmetric clawed limb and a distinct serpent arm. Preserve the bestial body and serpent anatomy instead of two ordinary humanoid fists. This is the transformed form, not green humanoid Ogre; there is no handheld weapon or newly invented divine equipment.',
    weapon: 'claws', weaponType: 'claws', weaponColor: '#b49c75',
    primaryColor: '#866849', secondaryColor: '#59624a',
    simple: melee('True Ogre Claw Strike'),
    secondary: melee('Serpent-Arm Strike'),
    defense: guard('Bestial Contact Guard'),
    special: melee('True Ogre Physical Rush'),
    loreLocalized: {
      fr: 'True Ogre est la forme bestiale transformée d’Ogre dans Tekken 3, sorti en arcade en 1997 puis sur PlayStation en 1998. Sa silhouette cornue et ailée et son bras serpent le distinguent de la forme humanoïde. Ce kit représente la griffe, le bras serpent et les contacts du corps, sans arme ajoutée ni origine divine inventée. Il ne prétend pas reproduire la liste complète des coups du jeu original ; les descriptions doivent encore être comparées à la source et les valeurs de combat restent adaptées.',
      en: 'True Ogre is Ogre’s transformed beast form in Tekken 3, released in arcades in 1997 and on PlayStation in 1998. The horned, winged silhouette and serpent arm distinguish it from humanoid Ogre. This kit represents the claw, serpent arm and bodily contact without adding a weapon or inventing a divine origin. It does not reproduce the complete original move list; descriptions still require source comparison and combat values remain adaptations.'
    }
  }));
}
