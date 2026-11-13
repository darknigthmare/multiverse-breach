// A Nightmare on Elm Street — definitions consumed by src/game/featuredUniversePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFeaturedUniversePacks({ hero, threat }) {
  return ({
    universe: 'A Nightmare on Elm Street',
    mediaType: 'movie',
    faction: 'horror',
    stageName: '1428 Elm Street Sleep Trap',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Freddy Boiler-Room Stalker',
    title: { en: 'A Nightmare on Elm Street', fr: 'Les Griffes de la nuit' },
    desc: {
      en: 'Springwood teenagers are hunted in dreams by Freddy Krueger, whose burned body, fedora, striped sweater, and bladed glove can reshape sleep into lethal theatrical traps. Nancy, Kristen, and Alice resist through preparation, shared dreams, and control of their own fear.',
      fr: 'Les adolescents de Springwood sont traques dans leurs reves par Freddy Krueger, dont le corps brule, le fedora, le pull raye et le gant a lames transforment le sommeil en pieges mortels et theatraux. Nancy, Kristen et Alice resistent par la preparation, les reves partages et la maitrise de leur peur.'
    },
    hero: hero('nancy_thompson', 'Nancy Thompson', 'tactical', '#d8c6aa', 'trapkit', 'Alarm Clock Strike', 'Booby-Trap Route', 'Wake-Up Burn', 'Turn Your Back on Freddy'),
    allies: [
      hero('kristen_parker', 'Kristen Parker', 'hacker', '#e5b7c6', 'dream', 'Dream Kick', 'Pull Ally Into Dream', 'Dream Room Shift', 'Dream Warriors Convergence'),
      hero('alice_johnson', 'Alice Johnson', 'slayer', '#c7a875', 'dream', 'Dream Master Strike', 'Borrowed Dream Skill', 'Mirror Guard', 'Dream Child Counter')
    ],
    monsters: [
      threat('Freddy Puppet Marionette', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-puppet-marionette.png', 'tendon_strings', 'Sleepwalk Control'),
      threat('Freddy Serpent Form', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-serpent-form.png', 'bite', 'Dream Swallow'),
      threat('Soul Chest Wretch', '/sprites/generated/bosses/a-nightmare-on-elm-street/soul-chest-wretch.png', 'soul_claws', 'Victim Soul Cry')
    ],
    bosses: [
      threat('Freddy Television Form', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-television-form.png', 'television_head', 'Welcome to Prime Time'),
      threat('Freddy Dream Master', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-dream-master.png', 'bladed_glove', 'Borrowed Nightmare Powers')
    ],
    worldBoss: threat('Freddy Krueger', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-krueger.png', 'bladed_glove', 'Boiler Room Dream Dominion'),
    gear: [
      ['elm_hypnocil', 'Hypnocil Vial', 'Fiole d Hypnocil', { hp: 65, def: 6 }],
      ['elm_nancy_trapkit', 'Nancys Booby-Trap Kit', 'Kit de pieges de Nancy', { atk: 8, spd: 2 }],
      ['elm_glove_shard', 'Freddys Bladed Glove', 'Gant a lames de Freddy', { atk: 12 }]
    ],
    event: ['evt_elm_dream_warriors', 'Kristens 1428 Elm Street Model', 'Maquette du 1428 Elm Street de Kristen', 'Kristens papier-mache model reproduces the boarded house she sees in her nightmares. Securing it reveals Freddys recurring dream entry before Nancy forces the wake-up route.', 'La maquette en papier mache de Kristen reproduit la maison condamnee vue dans ses cauchemars. La securiser revele l entree recurrente de Freddy avant que Nancy ne force la route du reveil.'],
    decor: { sky: ['#2c1310', '#050101'], floor: 'rgba(156, 62, 36, 0.2)', grid: 'rgba(116, 181, 74, 0.26)', motif: 'hauntedset', accent: '#b84d2f' },
    stageVariants: [
      { mode: 'Tactics', name: 'Westin Hills Dream Warriors Ward', difficulty: 'Very Hard', bossName: 'Freddy Dream Master' },
      { mode: 'Smash', name: 'Springwood Boiler Room Nightmare', difficulty: 'Expert', bossName: 'Freddy Krueger' }
    ]
  });
}

export function createFeaturedUniverseNarrativeArcs() {
  return ({
    id: 'nightmare_elm_street_wake_up',
    title: { fr: 'Arc Univers - Les Griffes de la nuit: reveil de Springwood', en: 'Universe Arc - A Nightmare on Elm Street: Springwood Wake-Up' },
    universes: ['A Nightmare on Elm Street'],
    intro: {
      fr: 'Apres la mort de Tina, Nancy comprend que le meme homme au pull rouge et vert poursuit les adolescents de Springwood dans leurs reves. Freddy transforme chaque sommeil en scene, mais il perd son avantage quand ses victimes partagent leurs preuves et preparent le reveil.',
      en: 'After Tinas death, Nancy realizes the same man in a red and green sweater hunts Springwoods teenagers in their dreams. Freddy turns every sleep into a stage, but loses his advantage when his victims share evidence and prepare to wake.'
    },
    missions: [
      { fr: 'Intro - Premier cauchemar: relier le gant a lames, la chaufferie et la comptine avant que la police ne classe la mort de Tina comme un crime ordinaire.', en: 'Intro - First Nightmare: connect the bladed glove, boiler room, and nursery rhyme before police reduce Tinas death to an ordinary crime.' },
      { fr: 'Mission - 1428 Elm Street: fabriquer les pieges de Nancy, regler les reveils et maintenir un passage materiel pour arracher Freddy au reve.', en: 'Mission - 1428 Elm Street: build Nancys traps, set the alarms, and maintain a physical route for pulling Freddy out of the dream.' },
      { fr: 'Interlude - Westin Hills: Kristen rassemble les Dream Warriors, Hypnocil retarde le sommeil paradoxal et chaque survivant choisit la forme de son pouvoir onirique.', en: 'Interlude - Westin Hills: Kristen gathers the Dream Warriors, Hypnocil delays REM sleep, and each survivor chooses the form of their dream power.' },
      { fr: 'Mission - Dream Master: Alice recueille les techniques des victimes sans les reduire a des bonus et ouvre le miroir ou leurs ames peuvent repondre.', en: 'Mission - Dream Master: Alice carries the victims techniques without reducing them to bonuses and opens the mirror where their souls can answer.' },
      { fr: 'Boss - Freddy Krueger: le rendre materiel, declencher les pieges du 1428 puis lui retirer la peur et les ames qui maintiennent son controle du reve.', en: 'Boss - Freddy Krueger: make him physical, trigger the 1428 traps, then strip away the fear and souls sustaining his control of the dream.' }
    ],
    outro: { fr: 'Springwood se reveille sans garantie de fin definitive. Nancy laisse un protocole de sommeil partage: personne ne combat seul, chaque reve possede une heure de sortie et Freddy ne decide plus qui doit etre oublie.', en: 'Springwood wakes without any promise of a permanent ending. Nancy leaves a shared-sleep protocol: nobody fights alone, every dream has an exit time, and Freddy no longer decides who is forgotten.' },
    reward: { fr: 'Reveil de Nancy + apparence Dream Warriors', en: 'Nancys Alarm Clock + Dream Warriors skin' }
  });
}

export function createFeaturedEnemyLore({ localized }) {
  return ({
    'Freddy Puppet Marionette': localized('Freddy utilise la logique de marionnette pour prendre le controle dun dormeur et faire de son propre corps un piege. Les fils sont une extension du cauchemar, pas une nouvelle espece.', 'Freddy uses puppet logic to control a sleeper and turn the victims own body into a trap. The strings are an extension of the nightmare, not a new species.'),
    'Freddy Serpent Form': localized('Dans le reve de Kristen, Freddy allonge son corps en serpent geant pour avaler sa victime. La forme conserve son visage brule, son fedora et son humour cruel.', 'Inside Kristens dream, Freddy stretches into a giant serpent to swallow his victim. The form keeps his burned face, fedora, and cruel humor.'),
    'Soul Chest Wretch': localized('Les visages emprisonnes dans la poitrine de Freddy sont les victimes dont il tire sa puissance. Leurs cris deviennent aussi la faille qui permet de les liberer.', 'The faces trapped in Freddys chest are victims from whom he draws power. Their cries also become the opening through which they can be freed.'),
    'Freddy Television Form': localized('Freddy traverse le televiseur pour tuer Jennifer et transforme la culture populaire en execution. Le poste et les bras mecaniques restent une mise en scene de son reve.', 'Freddy crosses through a television to kill Jennifer, turning popular culture into an execution. The set and mechanical arms remain part of his dream staging.'),
    'Freddy Dream Master': localized('Face a Alice, Freddy exploite les peurs et pouvoirs accumules par les derniers enfants de Springwood. Le miroir des ames retourne finalement cette collection contre lui.', 'Against Alice, Freddy exploits the fears and powers accumulated from Springwoods remaining children. The mirror of souls ultimately turns that collection against him.'),
    'Freddy Krueger': localized('Freddy est le meurtrier brule de Springwood revenu dans les reves avec fedora, pull rouge et vert et gant a quatre lames. La peur et les ames de ses victimes alimentent son controle.', 'Freddy is Springwoods burned murderer returned through dreams with fedora, red-and-green sweater, and four-bladed glove. Fear and his victims souls feed his control.')
  });
}

export function createFeaturedStageLore({ localized }) {
  return ({
    RPG: localized('Le 1428 Elm Street relie chambres, cave et chaufferie par le sommeil. Nancy prepare alarmes et pieges afin de ramener Freddy dans la maison materielle ou ses transformations peuvent enfin etre blessees.', '1428 Elm Street links bedrooms, basement, and boiler room through sleep. Nancy prepares alarms and traps to pull Freddy into the physical house where his transformations can finally be hurt.'),
    Tactics: localized('Westin Hills devient un reve partage: Kristen ouvre les chambres, les Dream Warriors choisissent leurs formes et les doses d Hypnocil retardent la prochaine intrusion de Freddy.', 'Westin Hills becomes a shared dream: Kristen opens the rooms, the Dream Warriors choose their forms, and Hypnocil doses delay Freddys next intrusion.'),
    Smash: localized('La chaufferie de Springwood fait surgir serpent, marionnette, television et poitrine d ames sur plusieurs plateformes. Alice utilise le miroir final pour rendre les victimes a elles-memes.', 'The Springwood boiler room brings serpent, puppet, television, and soul-chest forms across several platforms. Alice uses the final mirror to return the victims to themselves.')
  });
}

export function createFeaturedGearLore({ localized }) {
  return (localized('Le gant fabrique par Freddy porte quatre lames fixees aux doigts. Dans le reve, son grincement annonce sa presence avant que la chaufferie ne se referme.', 'Freddys handmade glove carries four blades fixed to its fingers. In dreams, its scrape announces him before the boiler room closes.'));
}

export function createFeaturedGearLore2({ localized }) {
  return (localized('Nancy transforme reveils, fil de piege, poudre et objets domestiques en route de reveil. Le kit blesse Freddy seulement quand il est ramene dans le monde materiel.', 'Nancy turns alarms, tripwire, powder, and household objects into a waking route. The kit hurts Freddy only after he is pulled into the physical world.'));
}

export function createFeaturedGearLore3({ localized }) {
  return (localized('Hypnocil supprime les reves et protege temporairement les patients de Westin Hills, mais son usage prolonge comporte un risque medical mortel.', 'Hypnocil suppresses dreams and temporarily protects Westin Hills patients, but prolonged use carries lethal medical risk.'));
}

export function createFeaturedBackdrops() {
  return ({
    RPG: '/backgrounds/featured/a-nightmare-on-elm-street-rpg-openai.png',
    Tactics: '/backgrounds/featured/a-nightmare-on-elm-street-tactics-openai.png',
    Smash: '/backgrounds/featured/a-nightmare-on-elm-street-smash-openai.png'
  });
}

export function createFeaturedCharacterPlaques({ plaque }) {
  return (plaque(
    'Nancy Thompson comprend que Freddy tue dans les reves mais peut etre ramene dans le monde reel. Elle organise des reveils, construit des pieges dans la maison du 1428 Elm Street et gagne en refusant de nourrir le pouvoir que sa peur lui donne.',
    'Nancy Thompson understands that Freddy kills in dreams but can be pulled into the waking world. She schedules wake-ups, builds traps inside 1428 Elm Street, and wins by refusing to feed the power her fear gives him.',
    'A.R.C.A. ne lui donne aucun super-pouvoir. Nancy etablit des protocoles de sommeil partage, des alarmes et une route de reveil, puis oblige Freddy a entrer dans une mission ou ses transformations ont enfin un cout materiel.',
    'A.R.C.A. gives her no superpower. Nancy establishes shared-sleep protocols, alarms, and a wake-up route, then forces Freddy into a mission where his transformations finally have a material cost.',
    'Alarmes, pieges domestiques, lecture du reve et extraction forcee au reveil.',
    'Alarms, household traps, dream reading, and forced waking extraction.',
    ['Nancy Thompson', '1428 Elm Street', 'wake-up']
  ));
}

export function createFeaturedCharacterPlaques2({ plaque }) {
  return (plaque(
    'Kristen Parker peut attirer dautres personnes dans ses reves. A Westin Hills, ce pouvoir permet aux Dream Warriors de se rejoindre et de confronter Freddy ensemble.',
    'Kristen Parker can pull other people into her dreams. At Westin Hills, this power allows the Dream Warriors to gather and confront Freddy together.',
    'La Breche amplifie le partage de reve mais menace de melanger toutes les identites de l escouade. Kristen ouvre une chambre commune limitee, attribue a chacun une forme coherente, puis rend le controle a Nancy pour le reveil.',
    'The Breach amplifies dream sharing but threatens to mix every squad identity. Kristen opens a limited common room, gives each member a coherent form, then returns control to Nancy for waking.',
    'Projection de reve, appel des allies, changement de chambre et lien Dream Warriors.',
    'Dream projection, ally pull, room shifting, and Dream Warriors link.',
    ['Kristen Parker', 'Dream Warriors', 'Westin Hills']
  ));
}

export function createFeaturedCharacterPlaques3({ plaque }) {
  return (plaque(
    'Alice Johnson devient le Dream Master en absorbant les capacites et la memoire de victimes de Freddy. Son miroir et sa maitrise progressive du reve lui permettent de renvoyer les ames contre lui.',
    'Alice Johnson becomes the Dream Master by absorbing the abilities and memories of Freddys victims. Her mirror and growing dream control allow her to turn the trapped souls against him.',
    'A.R.C.A. limite cette absorption a des techniques consenties et archivees. Alice construit une reponse collective sans effacer les personnes dont elle porte la trace, puis utilise le miroir comme preuve que Freddy ne possede pas leurs visages.',
    'A.R.C.A. limits this absorption to consented, archived techniques. Alice builds a collective response without erasing the people whose traces she carries, then uses the mirror as proof Freddy does not own their faces.',
    'Techniques de reve empruntees, garde miroir, attaque Dream Master et liberation des ames.',
    'Borrowed dream techniques, mirror guard, Dream Master strike, and soul release.',
    ['Alice Johnson', 'Dream Master', 'mirror']
  ));
}

export function createFeaturedBattleItemOverrides() {
  return ({
    pickups: [
      ['Reveil de Nancy', 'Nancys Alarm Clock', 'Declenche une fenetre de reveil qui retire peur et immobilisation au porteur.'],
      ['Dose d Hypnocil', 'Hypnocil Dose', 'Bloque temporairement les reves, reduit les apparitions de Freddy mais ralentit la recharge speciale.'],
      ['Piege au marteau de Nancy', 'Nancys Sledgehammer Trap', 'Le marteau domestique suspendu frappe Freddy uniquement apres son extraction dans le monde materiel.']
    ],
    summon: ['Maquette du 1428 de Kristen', 'Kristens 1428 Elm Street Model', 'La maquette en papier mache localise la maison condamnee qui sert de porte recurrente au cauchemar.'],
    ultimate: ['Fedora de Freddy', 'Freddys Fedora', 'Nancy arrache le fedora marque Fred Krueger au cauchemar: cet objet physique prouve que Freddy peut etre ramene puis piege.']
  });
}
