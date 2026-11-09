// Puppet Master — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Sutekh',
      weapon: 'occult_energy',
      special: 'Totem Command',
      phases: ['Uses occult bolts and commands Totem reinforcements', 'Withdraws behind a ritual shield when the Totems are destroyed'],
      lore: {
        fr: 'Sutekh dirige les Totems dans Puppet Master 4 et 5.',
        en: 'Sutekh commands the Totems in Puppet Master 4 and 5.'
      },
      referenceUrl: 'https://www.fullmoonfeatures.com/puppet-master-series',
      visualAnchor: 'The franchise Egyptian demon design with the exact ornate headdress, mask-like face and ritual armor.'
    },
    {
      name: 'Totem Guardian',
      weapon: 'claws_and_teeth',
      special: 'Demonic Puppet Pounce',
      phases: ['Skitters across the floor and performs leap attacks', 'Reassembles damaged puppet parts once before the final phase'],
      lore: {
        fr: 'Un Totem sert de boss local mobile sous le controle de Sutekh.',
        en: 'A Totem serves as the mobile local boss under Sutekh s control.'
      },
      referenceUrl: 'https://puppet-master.fandom.com/wiki/Totem/Puppet',
      visualAnchor: 'Exact small red-brown demonic puppet anatomy, knotted limbs, claws and teeth from Puppet Master 4 and 5.'
    }
  ]);
}
