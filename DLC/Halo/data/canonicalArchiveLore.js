// Halo — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Covenant Grunt': notice(
      'Covenant Grunt', 'Halo 2 (2004)',
      'https://www.halopedia.org/Unggoy',
      'L’Unggoy, surnommé Grunt, est un fantassin du Covenant équipé d’un masque respiratoire et d’un réservoir de méthane dorsal. À New Mombasa, il utilise notamment le pistolet à plasma sous le commandement des Sangheili.',
      'The Unggoy, nicknamed Grunt, is a Covenant infantryman equipped with a breathing mask and a dorsal methane tank. In New Mombasa it uses weapons including the plasma pistol under Sangheili command.'
    ),
    'Jackal Sniper': notice(
      'Jackal Sniper', 'Halo 2 (2004)',
      'https://www.halopedia.org/Kig-Yar_Sniper',
      'Le tireur d’élite Kig-Yar du Covenant utilise le Beam Rifle dans Halo 2. Les rues et positions surélevées de New Mombasa lui permettent de couvrir l’avancée des forces Covenant.',
      'The Covenant Kig-Yar sniper uses the Beam Rifle in Halo 2. New Mombasa’s streets and elevated positions allow it to cover the advance of Covenant forces.'
    ),
    'Elite Minor': notice(
      'Elite Minor', 'Halo 2 (2004)',
      'https://www.halopedia.org/Sangheili_Minor',
      'Le Sangheili Minor porte une armure de combat bleue et un bouclier énergétique personnel. Ce rang d’Elite du Covenant emploie notamment le fusil à plasma et dirige des fantassins pendant l’invasion de New Mombasa.',
      'The Sangheili Minor wears blue combat armor and a personal energy shield. This Covenant Elite rank uses weapons including the plasma rifle and leads infantry during the invasion of New Mombasa.'
    ),
    'Covenant Scarab Mech': notice(
      'Protos-pattern Scarab', 'Halo 2 (2004)',
      'https://www.halopedia.org/Protos-pattern_Scarab',
      'Le Scarab Protos de Metropolis est le grand marcheur Covenant à quatre pattes qui traverse New Mombasa. Son armement comprend un canon à concentration ultra-lourd et des répéteurs à plasma. Master Chief l’aborde depuis les passerelles et neutralise son équipage ; cette scène n’utilise pas le réacteur arrière du Scarab de Halo 3.',
      'The Protos Scarab in Metropolis is the large four-legged Covenant walker advancing through New Mombasa. Its armament includes an ultra-heavy focus cannon and plasma repeaters. Master Chief boards it from the walkways and neutralizes its crew; this encounter does not use the Halo 3 Scarab’s rear reactor.'
    )
  }));
}
