// Star Wars — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'SW-ANH-1977',
    rank: { fr: 'Contrebandier du Faucon', en: 'Falcon smuggler' },
    role: { fr: 'Tir de couverture et extraction', en: 'Covering fire and extraction' },
    callSign: 'Solo',
    origin: { fr: 'Un nouvel espoir (1977) - Mos Eisley / Etoile de la Mort', en: 'A New Hope (1977) - Mos Eisley / Death Star' },
    dossier: {
      fr: 'Han est ici le contrebandier d Un nouvel espoir: pilote du Faucon Millenium aux cotes de Chewbacca, il quitte Mos Eisley et aide a sauver Leia. Son arme personnelle est le pistolet blaster DL-44 modifie. La carbonite est une captivite subie dans le film suivant, jamais une armure ou un pouvoir defensif.',
      en: 'This Han is the A New Hope smuggler: Millennium Falcon pilot alongside Chewbacca, leaving Mos Eisley and helping rescue Leia. His personal weapon is a modified DL-44 blaster pistol. Carbonite is imprisonment suffered in the next film, never armor or a defensive power.'
    },
    doctrine: { fr: 'DL-44, tirs de couverture et esquive. Les salves et valeurs de combat adaptent ces gestes aux regles du jeu.', en: 'DL-44, covering shots and evasion. Volleys and combat values adapt these actions to the game rules.' },
    tags: ['Star Wars 1977', 'DL-44', 'Chewbacca', 'Falcon']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'SW-ROTJ-1983',
    rank: { fr: 'Chevalier Jedi', en: 'Jedi Knight' },
    role: { fr: 'Duel au sabre et telekinesie', en: 'Lightsaber duel and telekinesis' },
    callSign: 'Skywalker',
    origin: { fr: 'Le Retour du Jedi (1983) - duel de l Etoile de la Mort II', en: 'Return of the Jedi (1983) - Death Star II duel' },
    dossier: {
      fr: 'Luke porte la tenue noire et le sabre a lame verte qu il a construit apres la perte du sabre de son pere sur Bespin. Cette incarnation du Retour du Jedi sauve Han puis affronte Vader sans devenir Sith. Son duel, sa parade et la telekinesie de la Force remplacent le rayon mental invente du precedent kit.',
      en: 'Luke wears the black outfit and green-bladed lightsaber he built after losing his father s saber on Bespin. This Return of the Jedi incarnation rescues Han and faces Vader without becoming a Sith. His duel, parry and Force telekinesis replace the invented mind beam from the previous kit.'
    },
    doctrine: { fr: 'Sabre vert unique, main droite mecanique, parade et telekinesie. Les degats et delais sont des regles du jeu.', en: 'Single green saber, mechanical right hand, parry and telekinesis. Damage and cooldowns are game rules.' },
    tags: ['Star Wars 1983', 'Jedi', 'Green Lightsaber', 'Death Star II']
  });
}

export function createCharacterPlaques3() {
  return ({
    clearance: 'SW-ESB-1980',
    rank: { fr: 'Seigneur Sith', en: 'Sith Lord' },
    role: { fr: 'Duel, telekinesie et etranglement de Force', en: 'Duel, telekinesis and Force choke' },
    callSign: 'Vader',
    origin: { fr: 'L Empire contre-attaque (1980) - Bespin', en: 'The Empire Strikes Back (1980) - Bespin' },
    dossier: {
      fr: 'Vader conserve son casque ferme, son armure cybernetique de survie et son sabre a lame rouge. A Bespin, il utilise la Force pour projeter des debris sur Luke. L etranglement de Force est une action dirigee sur une cible; la Marche imperiale est un theme musical du film, pas un pouvoir explosif du personnage.',
      en: 'Vader retains his closed helmet, cybernetic life-support armor and red-bladed lightsaber. On Bespin he uses the Force to hurl debris at Luke. Force choke is directed at a target; the Imperial March is a film musical theme, not an explosive character power.'
    },
    doctrine: { fr: 'Sabre rouge, parade, debris de Bespin et etranglement de Force. Les valeurs de combat restent une adaptation du jeu.', en: 'Red saber, parry, Bespin debris and Force choke. Combat values remain a game adaptation.' },
    tags: ['Star Wars 1980', 'Sith', 'Red Lightsaber', 'Life Support']
  });
}
