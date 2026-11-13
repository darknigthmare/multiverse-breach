// Pirates of the Caribbean — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalRequestedUniverseWave({ CANON_BLACK_PEARL_SOURCE_KITS, defineCanonicalUniverse }) {
  return (defineCanonicalUniverse({
    key: 'pirates_caribbean',
    universe: 'Pirates of the Caribbean',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Pirates des Caraibes',
    stage: 'Isla de Muerta / Barbossa Duel',
    boss: 'Hector Barbossa',
    worldBoss: 'Calypso Maelstrom',
    stageMeta: {
      sourceLock: {
        incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003) - Isla de Muerta',
        canonicalBossName: 'Hector Barbossa',
        referenceUrl: 'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
        referenceUrls: ['https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/', 'https://en.wikipedia.org/wiki/Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl'],
        enemyRoster: ['Cursed Aztec Pirate', 'Hector Barbossa'],
        enemyRosterExclusive: true,
        visualAnchor: 'Isla de Muerta treasure cavern from The Curse of the Black Pearl (2003): rock walls, shallow water, scattered gold and the stone chest of stolen Aztec medallions. Jack duels Hector Barbossa with pirate swords and a flintlock pistol; moonlight reveals cursed skeletal bodies. No Flying Dutchman, Davy Jones tentacles, Calypso or maelstrom from the later films.',
        visualReviewStatus: 'pending',
        gameplayAdaptation: 'One ATB encounter combines Barbossa and two cursed pirates. Three squad commands recover the final two medallions, coordinate the established offerings from Will Turner (Bootstrap Bill lineage) and Jack Sparrow, and let Will restore all 882 pieces. The curse blocks lethal damage until restoration; Jack’s scripted pistol shot then ends the duel. Source Will and Jack coordinate established offerings without squad HP costs. Living playable 2003 Jack becomes curse-protected after taking his coin and becomes mortal at restitution; Will and other heroes remain mortal. Other pirates remain alive and mortal; their later surrender aboard the Dauntless is outside this scene. Commands and shot timing are game adaptations.',
        sourceSceneLore: {
          fr: 'Dans la caverne au trésor d’Isla de Muerta, Jack Sparrow affronte Hector Barbossa. Le trésor aztèque volé rend Barbossa et ses pirates immortels ; la lumière de la lune révèle leurs corps squelettiques. Will Turner restitue les pièces et le sang nécessaire pour lever la malédiction au moment où Jack tire sur Barbossa.',
          en: 'In Isla de Muerta’s treasure cavern, Jack Sparrow confronts Hector Barbossa. The stolen Aztec treasure makes Barbossa and his pirates immortal; moonlight reveals their skeletal bodies. Will Turner returns the coins and the blood needed to lift the curse as Jack shoots Barbossa.'
        },
        sourceSceneAdaptation: {
          fr: 'Un combat ATB réunit Barbossa et deux pirates maudits. Récupérez les deux dernières pièces, coordonnez les offrandes de Will Turner, fils de Bootstrap Bill, et de Jack, puis faites restituer les 882 pièces par Will. La malédiction empêche leur mort avant la restitution ; le tir de Jack termine ensuite le duel. Les offrandes de Will et Jack ne coûtent pas de PV à l’équipe. Jack jouable de 2003, vivant lors de la prise de sa pièce, est protégé par la malédiction jusqu’à la restitution ; les autres héros restent mortels. Les autres pirates restent vivants et mortels ; leur reddition ultérieure sur le Dauntless reste hors scène. Les commandes et leur durée sont adaptées au jeu.',
          en: 'One ATB encounter combines Barbossa and two cursed pirates. Recover the final two coins, coordinate the offerings from Will Turner, Bootstrap Bill’s son, and Jack, then have Will restore all 882 pieces. The curse prevents their death before restoration; Jack’s shot then ends the duel. The established Will and Jack offerings cost no squad HP. Living playable 2003 Jack becomes curse-protected after taking his coin and becomes mortal at restitution; other heroes remain mortal. Other pirates remain alive and mortal; their later surrender aboard the Dauntless is outside this scene. Commands and timings adapt the film.'
        }
      }
    },
    cast: [
      ['jack_sparrow_potc', 'Jack Sparrow', 'hacker', CANON_BLACK_PEARL_SOURCE_KITS.jack_sparrow_potc],
      ['elizabeth_swann_potc', 'Elizabeth Swann', 'tactical', CANON_BLACK_PEARL_SOURCE_KITS.elizabeth_swann_potc],
      ['will_turner_potc', 'Will Turner', 'slayer', CANON_BLACK_PEARL_SOURCE_KITS.will_turner_potc]
    ],
    enemies: [{
      name: 'Cursed Aztec Pirate', weapon: 'sword',
      simple: { name: 'Pirate Sword Slash', type: 'melee', dmg: 1, rpgProfile: { shape: 'single', delivery: 'melee' } },
      secondary: { name: 'Pirate Sword Thrust', type: 'melee', dmg: 1.45, cd: 3, rpgProfile: { shape: 'single', delivery: 'melee' } },
      special: { name: 'Pirate Sword Duel', type: 'melee', dmg: 1.15, rpgProfile: { shape: 'single', delivery: 'melee' } },
      incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003)',
      equipment: ['Pirate sword'],
      referenceUrl: 'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
      sourceLore: {
        fr: 'Pirate de l’équipage maudit de Barbossa dans La Malédiction du Black Pearl, en 2003. Le trésor aztèque volé le rend immortel et la lumière de la lune révèle son corps squelettique. Il manie une épée de pirate ; cet ennemi ne vient pas de l’équipage du Hollandais volant.',
        en: 'A pirate from Barbossa’s cursed crew in The Curse of the Black Pearl (2003). The stolen Aztec treasure makes him immortal and moonlight reveals his skeletal body. He carries a pirate sword; this enemy is not a Flying Dutchman crew member.'
      },
      visualReviewStatus: 'pending'
    }, 'Flying Dutchman Crew', 'East India Company Marine'],
    bosses: [{
      name: 'Hector Barbossa', canonicalName: 'Hector Barbossa', weapon: 'sword',
      simple: { name: 'Barbossa Sword Slash', type: 'melee', dmg: 1, rpgProfile: { shape: 'single', delivery: 'melee' } },
      secondary: { name: 'Barbossa Sword Thrust', type: 'melee', dmg: 1.45, cd: 3, rpgProfile: { shape: 'single', delivery: 'melee' } },
      special: { name: 'Pirate Sword Duel', type: 'melee', dmg: 1, rpgProfile: { shape: 'single', delivery: 'melee' } },
      incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003)',
      equipment: ['Pirate sword', 'Flintlock pistol'],
      referenceUrl: 'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
      visualAnchor: 'Hector Barbossa from The Curse of the Black Pearl (2003), long dark pirate coat, broad black hat, beard, pirate sword and flintlock pistol; cursed skeletal form only under moonlight. No Davy Jones tentacles or crab anatomy.',
      sourceLore: {
        fr: 'Hector Barbossa a pris le Black Pearl à Jack Sparrow et dirige l’équipage maudit par le trésor aztèque. Dans la caverne d’Isla de Muerta, il affronte Jack à l’épée. Will restitue les dernières pièces avec les offrandes nécessaires de sa lignée et de Jack ; la malédiction levée permet au tir de Jack de tuer Barbossa.',
        en: 'Hector Barbossa took the Black Pearl from Jack Sparrow and commands the crew cursed by the Aztec treasure. In Isla de Muerta’s cavern he duels Jack with a sword. Will restores the final coins with the necessary offerings from his lineage and Jack; lifting the curse lets Jack’s shot kill Barbossa.'
      },
      canonStatus: 'Source identity locked; the RPG encounter requires the final coins and source Will/Jack offerings before Jack’s scripted fatal shot. ATB commands and timing are adaptations.',
      visualReviewStatus: 'pending'
    }, 'Davy Jones'],
    gear: [
      ['compass', 'Jack s Compass', 'Boussole de Jack'],
      ['aztec_coin', 'Cursed Aztec Coin', 'Piece azteque maudite'],
      ['dead_mans_chest', 'Dead Man s Chest Key', 'Cle du coffre du mort']
    ],
    event: ['kraken', 'Kraken Broadside', 'Bordee du Kraken', 'The Kraken drags the strongest enemy beneath a maelstrom while the Black Pearl opens fire.', 'Le Kraken entraine l ennemi le plus fort sous le maelstrom pendant que le Black Pearl ouvre le feu.'],
    origin: ['The Caribbean seas bind pirates, imperial fleets, Aztec curses, Davy Jones, and bargains whose price always returns.', 'Les mers des Caraibes lient pirates, flottes imperiales, maledictions azteques, Davy Jones et pactes dont le prix revient toujours.'],
    breach: ['an original Multiverse plot has the Nexus interfere with Jack s compass and borrows the image of Calypso s 2007 storm to carry islands between universes. This crossover premise is invented for the project, not a scene or source compass ability from the films.', 'une intrigue originale du projet Multiverse fait interferer le Nexus avec la boussole de Jack et reprend l image de la tempete de Calypso en 2007 pour transporter des iles entre les univers. Ce scenario crossover est invente pour le projet : ce n est ni une scene des films ni une capacite source de la boussole.'],
    motif: 'shipdeck',
    colors: ['#12303a', '#020607', '#d6a654']
  }));
}
