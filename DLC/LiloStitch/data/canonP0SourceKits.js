// Lilo & Stitch — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee, ranged }) {
  return (lock({
    incarnation: 'Lilo & Stitch (2002 animated film) - Lilo Pelekai on Kauai',
    referenceUrls: [REF.lilo],
    equipment: ['Camera', 'Scrump Doll', 'Red White-Leaf Dress'],
    visualAnchor: 'Lilo in the 2002 animated film: Hawaiian little girl, long straight black hair, red dress with large white leaf shapes and sandals. Camera and Scrump are personal props, not alien weapons. No adult substitute, laser rifle, magic beam or live-action redesign.',
    weapon: 'camera', weaponType: 'camera', weaponColor: '#383838',
    primaryColor: '#d83c38', secondaryColor: '#f8eee3',
    canonStatus: 'Lilo s human source identity and props locked; photo distractions, dance and physical comedy are original game adaptations, not alien combat powers.',
    simple: ranged('Camera Flash Distraction', 'flash', '#fff4d8', COMIC_ADAPTATION),
    secondary: melee('Playful Sidestep Bump', COMIC_ADAPTATION),
    defense: dodge('Hula Sidestep'),
    special: melee('Ohana Rescue Scramble', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Lilo Pelekai est une enfant humaine de Kauai, elevee par sa soeur Nani dans le film anime Lilo & Stitch de 2002. Elle adopte Stitch et lui apprend le sens de ohana. Son appareil photo, sa poupee Scrump et sa danse appartiennent a sa vie ; le jeu adapte ces gestes en distraction et entraide, sans lui attribuer les pouvoirs de l Experience 626.',
      en: 'Lilo Pelekai is a human child on Kauai, raised by her sister Nani in the 2002 animated film Lilo & Stitch. She adopts Stitch and teaches him the meaning of ohana. Her camera, Scrump doll and dancing belong to her life; the game adapts those gestures into distraction and support without granting her Experiment 626 s powers.'
    }
  }));
}

export function createCanonP0SourceKits2({ REF, dodge, lock, melee }) {
  return (lock({
    incarnation: 'Lilo & Stitch (2002 animated film) - Experiment 626, Earth dog-disguise form',
    referenceUrls: [REF.lilo],
    equipment: ['Retractable Claws', 'Experiment 626 Anatomy'],
    visualAnchor: 'Stitch in the 2002 animated film, Earth dog disguise: short stocky blue alien, large lateral ears with pink interiors and characteristic notches, dark nose and eyes, pale-blue belly, two visible arms. Alien four-arm form is a separate presentation, not extra permanent Earth-form arms. No humanoid warrior costume or innate laser gun.',
    weapon: 'claws', weaponType: 'claws', weaponColor: '#a9d8ed',
    primaryColor: '#407eaf', secondaryColor: '#9ecce5',
    simple: melee('Experiment 626 Claw Swipe'),
    secondary: melee('Alien Strength Pounce'),
    defense: dodge('Agile Alien Sidestep'),
    special: melee('Experiment 626 Strength Rush'),
    loreLocalized: {
      fr: 'Stitch est l Experience 626, creation genetique de Jumba poursuivie apres sa fuite vers la Terre. Le film anime de 2002 le montre d abord destructeur, puis lie a Lilo et a ohana. Sa force, ses griffes et son agilite viennent de son corps extraterrestre ; le kit joue sa forme terrestre a deux bras et adapte les impacts au combat du jeu.',
      en: 'Stitch is Experiment 626, Jumba s genetic creation pursued after escaping to Earth. The 2002 animated film begins with his destructive behavior and follows his bond with Lilo and ohana. Strength, claws and agility come from his alien body; this kit uses his two-arm Earth disguise and adapts impacts to game combat.'
    }
  }));
}
