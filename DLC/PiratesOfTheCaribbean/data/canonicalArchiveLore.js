// Pirates of the Caribbean — definitions consumed by src/game/canonicalArchiveLore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonicalArchiveEnemyLore({ notice }) {
  return (Object.freeze({
    'Davy Jones': notice(
      'Davy Jones', "Pirates of the Caribbean: Dead Man's Chest (2006)",
      'https://d23.com/a-to-z/pirates-of-the-caribbean-dead-mans-chest-film/',
      'Davy Jones est le capitaine du Hollandais volant dans Le Secret du coffre maudit (2006). Son visage porte des tentacules et sa main gauche est une pince. Il tient Jack à son pacte de service et garde son cœur séparé de son corps dans le coffre du mort. Il commande son propre équipage marin, distinct des pirates de Barbossa maudits par le trésor aztèque.',
      'Davy Jones captains the Flying Dutchman in Dead Man’s Chest (2006). His face has tentacles and his left hand is a claw. He holds Jack to his service bargain and keeps his heart separate from his body in the Dead Man’s Chest. He commands his own sea-encrusted crew, distinct from Barbossa’s pirates cursed by the Aztec treasure.'
    ),
    'Flying Dutchman Crew': notice(
      'Flying Dutchman Crew', "Pirates of the Caribbean: Dead Man's Chest (2006)",
      'https://en.wikipedia.org/wiki/Pirates_of_the_Caribbean:_Dead_Man%27s_Chest',
      'L’équipage du Hollandais volant sert Davy Jones dans Le Secret du coffre maudit (2006), puis revient dans Jusqu’au bout du monde (2007). Ses marins ont des corps mêlés à des organismes marins ; Bootstrap Bill Turner en fait partie. Leur servitude auprès de Jones ne vient pas des pièces aztèques de Barbossa. Le libellé regroupe ces marins pour le jeu ; leur nombre et leurs actions de combat sont adaptés.',
      'The Flying Dutchman crew serves Davy Jones in Dead Man’s Chest (2006) and returns in At World’s End (2007). The sailors’ bodies incorporate marine organisms; Bootstrap Bill Turner is among them. Their service to Jones does not come from Barbossa’s Aztec coins. This label groups those sailors for the game; their number and combat actions are adaptations.'
    ),
    'East India Company Marine': notice(
      'East India Company Marine', "Pirates of the Caribbean: At World's End (2007)",
      'https://d23.com/a-to-z/pirates-of-the-caribbean-at-worlds-end-film/',
      'Dans Jusqu’au bout du monde (2007), Lord Cutler Beckett utilise les forces de la Compagnie des Indes orientales pour éliminer les pirates et contrôle Davy Jones par son cœur. East India Company Marine est le libellé de jeu d’un soldat humain de ces forces, équipé d’armes à feu et d’une tenue militaire. Il ne représente ni un marin transformé du Hollandais volant ni un pirate rendu immortel par le trésor aztèque ; son profil de combat est adapté au jeu.',
      'In At World’s End (2007), Lord Cutler Beckett uses the East India Trading Company’s forces against the pirates and controls Davy Jones through his heart. East India Company Marine is the game label for a human soldier of those forces, carrying firearms and military clothing. It represents neither a transformed Dutchman sailor nor a pirate made immortal by the Aztec treasure; its combat profile is a game adaptation.'
    ),
    'Calypso Maelstrom': notice(
      'Calypso Maelstrom — manifestation originale Multiverse', "Pirates of the Caribbean: At World's End (2007) - Calypso; original Multiverse manifestation",
      'https://en.wikipedia.org/wiki/Pirates_of_the_Caribbean:_At_World%27s_End',
      'Dans Jusqu’au bout du monde (2007), Tia Dalma est la forme humaine de Calypso, déesse de la mer emprisonnée par les seigneurs pirates. Barbossa accomplit le rite qui la libère ; elle se disperse en crabes et provoque la tempête avec son maelström. Calypso Maelstrom désigne ici une manifestation de combat originale du projet Multiverse inspirée de cette tempête. Son nom de boss et ses attaques numériques sont des adaptations ; le film ne présente pas ce duel de boss ni une arme correspondante.',
      'In At World’s End (2007), Tia Dalma is the human form of Calypso, the sea goddess bound by the pirate lords. Barbossa performs the rite that releases her; she disperses into crabs and causes the storm and its maelstrom. Calypso Maelstrom here names an original Multiverse combat manifestation inspired by that storm. Its boss name and numerical attacks are adaptations; the film depicts no corresponding boss duel or weapon.'
    )
  }));
}
