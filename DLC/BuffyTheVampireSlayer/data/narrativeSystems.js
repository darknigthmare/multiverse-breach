// Buffy the Vampire Slayer — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'buffy_hellmouth_nexus',
    stageId: 9210,
    heroId: 'buffy_summers',
    title: { fr: 'Arc Personnage - Tueuse du Nexus', en: 'Character Arc - Nexus Slayer' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Bouche d Enfer Sans-Auteur',
    unlock: { type: 'clears', value: 7 },
    intro: { fr: 'Buffy reconnait le piege: une adolescente choisie, puis une guerre qui pretend etre son destin. Le Nexus lui donne une autre option.', en: 'Buffy recognizes the trap: a chosen girl, then a war pretending to be destiny. The Nexus gives her another option.' },
    missions: [
      { fr: 'Proteger une patrouille de lycee projetee dans la Cite-Mosaique.', en: 'Protect a school patrol thrown into Mosaic City.' },
      { fr: 'Briser un rituel qui transforme les noms de heros en prophecies.', en: 'Break a ritual turning hero names into prophecies.' },
      { fr: 'Sceller une Bouche d Enfer qui veut avaler les traces memoire.', en: 'Seal a Hellmouth trying to swallow memory traces.' }
    ],
    outro: { fr: 'La Tueuse ne porte plus seule la fin du monde: l escouade porte la ligne avec elle.', en: 'The Slayer no longer carries the end of the world alone: the squad holds the line with her.' },
    reward: { fr: 'Apparence Tueuse Nexus + pieu d Origine', en: 'Nexus Slayer Appearance + Origin Stake' },
    rewardItemId: 'char_buffy_nexus_slayer'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_buffy_nexus_slayer',
    heroId: 'buffy_summers',
    name: { fr: 'Tueuse Nexus', en: 'Nexus Slayer' },
    colors: { primaryColor: '#f6c15b', secondaryColor: '#7d3c98' }
  });
}
