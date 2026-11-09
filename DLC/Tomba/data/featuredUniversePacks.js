// Tomba — definitions consumed by src/game/featuredUniversePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFeaturedUniversePacks({ hero, threat }) {
  return ({
    universe: 'Tomba',
    mediaType: 'game',
    faction: 'arcane',
    stageName: 'Mushroom Forest Evil Pig Hunt',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Fire Evil Pig',
    title: { en: 'Tomba!', fr: 'Tomba!' },
    desc: {
      en: 'Tomba crosses a bright island whose villages, forests, mountains, and inhabitants have been warped by seven Evil Pig curses. Events, odd favors, pig bags, the stolen golden bracelet, and physical platforming remain the laws of this Thread.',
      fr: 'Tomba traverse une ile coloree dont les villages, forets, montagnes et habitants ont ete deformes par les maledictions de sept Evil Pigs. Les evenements, services absurdes, sacs a cochons, le bracelet vole et le platforming physique restent les lois de cette Trame.'
    },
    hero: hero('tomba_hero', 'Tomba', 'slayer', '#ff5c9a', 'spiked_ball', 'Pig Grab Throw', 'Spiked Ball Swing', 'Animal Dash', 'Evil Pig Bag Seal'),
    allies: [
      hero('charles_tomba', 'Charles', 'hacker', '#a66b32', 'claws', 'Monkey Pounce', 'Animal Technique Lesson', 'Tree Branch Dodge', 'Charles Training Rush'),
      hero('tabby_tomba', 'Tabby', 'tactical', '#e8c28d', 'staff', 'Travel Staff Jab', 'Friendship Necklace Signal', 'Village Route Guard', 'Evil Swine Rescue Call')
    ],
    monsters: [
      threat('Koma Pig Patrol', '/sprites/generated/bosses/tomba/koma-pig-patrol.png', 'pitchfork', 'Gold Snatch Charge'),
      threat('Biting Plant Cluster', '/sprites/generated/bosses/tomba/biting-plant-cluster.png', 'bite', 'Root Snare'),
      threat('Needlegator Ravine Pack', '/sprites/generated/bosses/tomba/needlegator-ravine-pack.png', 'spines', 'Phoenix Mountain Ambush')
    ],
    bosses: [
      threat('Fire Evil Pig', '/sprites/generated/bosses/tomba/fire-evil-pig.png', 'fire_magic', 'Village of All Beginnings Inferno'),
      threat('Stormy Evil Pig', '/sprites/generated/bosses/tomba/stormy-evil-pig.png', 'storm_magic', 'Phoenix Mountain Gale')
    ],
    worldBoss: threat('Real Evil Pig', '/sprites/generated/bosses/tomba/real-evil-pig.png', 'curse_magic', 'Seven Curses Recast'),
    gear: [
      ['tomba_grandfather_bracelet', 'Grandfathers Golden Bracelet', 'Bracelet dore du grand-pere', { atk: 8, def: 4 }],
      ['tomba_evil_pig_bag', 'Blue Evil Pig Bag', 'Sac bleu a Evil Pig', { atk: 10, spd: 2 }],
      ['tomba_charity_wings', 'Charity Wings', 'Ailes de charite', { hp: 65, spd: 2 }]
    ],
    event: ['evt_tomba_pig_bag_seal', 'Black Evil Pig Bag', 'Sac noir du Real Evil Pig', 'The eighth black bag appears after the seven Evil Pigs are sealed. It reveals the Real Evil Pigs lair and provides the only physical vessel able to contain him.', 'Le huitieme sac noir apparait apres le scellement des sept Evil Pigs. Il revele le repaire du Real Evil Pig et constitue le seul receptacle physique capable de l enfermer.'],
    decor: { sky: ['#2b1640', '#07040c'], floor: 'rgba(93, 190, 92, 0.18)', grid: 'rgba(255, 102, 170, 0.3)', motif: 'wasteland', accent: '#ff66aa' },
    stageVariants: [
      { mode: 'Tactics', name: 'Phoenix Mountain Wind Routes', difficulty: 'Hard', bossName: 'Stormy Evil Pig' },
      { mode: 'Smash', name: 'Seven Evil Pig Bag Sanctuary', difficulty: 'Very Hard', bossName: 'Real Evil Pig' }
    ]
  });
}

export function createFeaturedUniverseNarrativeArcs() {
  return ({
    id: 'tomba_seven_evil_pig_curses',
    title: { fr: 'Arc Univers - Tomba!: les sept maledictions', en: 'Universe Arc - Tomba!: The Seven Curses' },
    universes: ['Tomba'],
    intro: {
      fr: 'Les Koma Pigs volent le bracelet dore du grand-pere de Tomba au moment ou les sept Evil Pigs divisent son ile en domaines maudits. La Breche superpose leurs maledictions, mais chaque zone conserve ses evenements, ses habitants et son sac de scellement.',
      en: 'Koma Pigs steal Tombas grandfathers golden bracelet as the seven Evil Pigs divide his island into cursed domains. The Breach overlaps their curses, but every region keeps its events, inhabitants, and sealing bag.'
    },
    missions: [
      { fr: 'Intro - Village de tous les commencements: poursuivre les Koma Pigs, retrouver la piste du bracelet et obtenir le premier indice du 100 Year Old Wise Man.', en: 'Intro - Village of All Beginnings: chase the Koma Pigs, recover the bracelets trail, and obtain the first clue from the 100 Year Old Wise Man.' },
      { fr: 'Mission - Mushroom Forest: resoudre les etats rieur et pleureur de la foret, aider ses habitants et recuperer un Evil Pig Bag sans bruler les evenements secondaires.', en: 'Mission - Mushroom Forest: resolve the forests laughing and crying states, help its inhabitants, and recover an Evil Pig Bag without erasing its side events.' },
      { fr: 'Interlude - Lecons de Charles: apprendre Animal Dash et la nage afin que les nouvelles routes deviennent des capacites de Tomba, pas des clefs generiques A.R.C.A.', en: 'Interlude - Charles Lessons: learn Animal Dash and swimming so new routes become Tombas abilities rather than generic A.R.C.A. keys.' },
      { fr: 'Mission - Phoenix Mountain: traverser les vents, les Needlegators et les chemins verticaux pour ouvrir le sac du Stormy Evil Pig dans son propre domaine.', en: 'Mission - Phoenix Mountain: cross wind, Needlegators, and vertical routes to open the Stormy Evil Pigs bag inside its own domain.' },
      { fr: 'Boss - Real Evil Pig: reunir les sept sacs dans le sanctuaire, retourner chaque malediction contre son auteur et reprendre le bracelet dore.', en: 'Boss - Real Evil Pig: gather all seven bags in the sanctuary, turn every curse against its author, and recover the golden bracelet.' }
    ],
    outro: { fr: 'Les villages retrouvent leurs formes et leurs habitants conservent le souvenir des services rendus. Tomba recupere le bracelet sans laisser A.R.C.A. remplacer son ile par une simple arene.', en: 'The villages regain their forms and their inhabitants keep the memory of every favor completed. Tomba recovers the bracelet without allowing A.R.C.A. to replace his island with a simple arena.' },
    reward: { fr: 'Apparence Bracelet du grand-pere + Evil Pig Bag utilisable', en: 'Grandfathers Bracelet skin + usable Evil Pig Bag' }
  });
}

export function createFeaturedEnemyLore({ localized }) {
  return ({
    'Koma Pig Patrol': localized('Les Koma Pigs sont les voleurs recurrents de l ile: ils derobent le bracelet du grand-pere de Tomba, transportent des objets et deviennent des projectiles quand il les agrippe.', 'Koma Pigs are the islands recurring thieves: they steal Tombas grandfathers bracelet, carry objects, and become projectiles when he grapples them.'),
    'Biting Plant Cluster': localized('Ces plantes carnivores appartiennent aux obstacles vivants de la foret. Elles ferment un chemin par leur morsure et doivent etre contournees ou frappees comme dans une sequence de plateforme.', 'These carnivorous plants belong to the forests living obstacles. Their bite seals a route and they must be bypassed or struck like a platforming hazard.'),
    'Needlegator Ravine Pack': localized('Les Needlegators de Phoenix Mountain utilisent leur dos epineux pour punir une chute mal preparee et obligent Tomba a lire le vent avant de sauter.', 'Phoenix Mountain Needlegators use their spined backs to punish a bad landing and force Tomba to read the wind before jumping.'),
    'Fire Evil Pig': localized('Le Fire Evil Pig impose une malediction de chaleur a son domaine. Seul le sac qui lui correspond permet de le faire apparaitre puis de retourner sa magie contre lui.', 'The Fire Evil Pig places a heat curse on its domain. Only its matching bag can reveal it and turn its own magic back against it.'),
    'Stormy Evil Pig': localized('Le Stormy Evil Pig controle les rafales de Phoenix Mountain et transforme les routes verticales en pieges. Son scellement restaure les vents normaux de la zone.', 'The Stormy Evil Pig controls Phoenix Mountains gusts and turns vertical routes into traps. Sealing it restores the regions natural winds.'),
    'Real Evil Pig': localized('Le Real Evil Pig est la source qui rassemble les sept maledictions et le dernier obstacle entre Tomba et le bracelet vole. Il doit etre enferme avec la logique complete des sept sacs.', 'The Real Evil Pig is the source gathering all seven curses and the last obstacle between Tomba and the stolen bracelet. It must be sealed through the complete logic of all seven bags.')
  });
}

export function createFeaturedStageLore({ localized }) {
  return ({
    RPG: localized('Mushroom Forest alterne ses etats rieur et pleureur sous la malediction. Le parcours garde ses embranchements, habitants, services et objets evenementiels; le Fire Evil Pig ne peut apparaitre quavec le bon sac.', 'Mushroom Forest alternates between laughing and crying states under the curse. The route keeps its branches, inhabitants, favors, and event objects; the Fire Evil Pig only appears through the matching bag.'),
    Tactics: localized('Phoenix Mountain devient une grille verticale de courants dair, points de grappin et cretes a Needlegators. Le placement sert a proteger les routes stables avant de sceller le Stormy Evil Pig.', 'Phoenix Mountain becomes a vertical grid of wind currents, grapple points, and Needlegator ridges. Positioning protects stable routes before the Stormy Evil Pig is sealed.'),
    Smash: localized('Le sanctuaire des sept sacs transforme chaque malediction en hazard de plateforme distinct. Quand les sept ouvertures sont controlees, le Real Evil Pig peut enfin etre projete dans le dernier sceau.', 'The seven-bag sanctuary turns every curse into a distinct platform hazard. Once all seven openings are controlled, the Real Evil Pig can be thrown into the final seal.')
  });
}

export function createFeaturedGearLore({ localized }) {
  return (localized('Le bracelet dore appartenait au grand-pere de Tomba avant le vol des Koma Pigs. Sa recuperation donne a toute la chasse aux Evil Pigs son objectif personnel.', 'The golden bracelet belonged to Tombas grandfather before the Koma Pigs stole it. Recovering it gives the entire Evil Pig hunt its personal objective.'));
}

export function createFeaturedGearLore2({ localized }) {
  return (localized('Le sac bleu est remis par le Dwarf Elder et correspond a son Evil Pig. Chaque sac colore ne revele que la porte de la zone maudite qui lui est associee.', 'The blue bag is given by the Dwarf Elder and matches its Evil Pig. Each colored bag only reveals the doorway to its matching cursed region.'));
}

export function createFeaturedGearLore3({ localized }) {
  return (localized('Les Charity Wings ramenent Tomba vers une zone deja visitee. Dans la Breche, elles conservent ce role de retour rapide plutot que de devenir des ailes de vol.', 'Charity Wings return Tomba to a previously visited area. In the Breach they keep that fast-return role rather than becoming flight wings.'));
}

export function createFeaturedBackdrops() {
  return ({
    RPG: '/backgrounds/featured/tomba-rpg-openai.png',
    Tactics: '/backgrounds/featured/tomba-tactics-openai.png',
    Smash: '/backgrounds/featured/tomba-smash-openai.png'
  });
}

export function createFeaturedCharacterPlaques({ plaque }) {
  return (plaque(
    'Tomba vit sur une ile que sept Evil Pigs ont divisee en zones maudites. Sauvage, direct et presque toujours pieds nus, il bondit sur les cochons, les mord, les saisit et les projette tout en poursuivant le bracelet dore vole a son grand-pere.',
    'Tomba lives on an island split into cursed regions by seven Evil Pigs. Wild, direct, and usually barefoot, he jumps on pigs, bites, grabs, and throws them while pursuing the golden bracelet stolen from his grandfather.',
    'La Breche accroche simultanement plusieurs maledictions de l ile. Tomba refuse de frapper un noyau generique: il retrouve le sac correspondant, force chaque Evil Pig a reapparaitre dans son propre domaine et restaure les villages evenement par evenement.',
    'The Breach hooks several island curses at once. Tomba refuses to hit a generic core: he recovers the matching bag, forces each Evil Pig to reappear inside its own domain, and restores villages one event at a time.',
    'Saut agrippe, projection de Koma Pig, grappin, Animal Dash et scellement par sac.',
    'Grapple jump, Koma Pig throw, grappling hook, Animal Dash, and bag sealing.',
    ['Evil Pigs', 'golden bracelet', 'pig bag']
  ));
}

export function createFeaturedCharacterPlaques2({ plaque }) {
  return (plaque(
    'Charles est le singe espiegle qui enseigne a Tomba des techniques animales, notamment l Animal Dash et la nage, en echange de nourriture et de services rendus.',
    'Charles is the mischievous monkey who teaches Tomba animal techniques, including Animal Dash and swimming, in exchange for food and favors.',
    'A.R.C.A. classe Charles comme instructeur mobile: il lit les routes verticales, ouvre des raccourcis et transforme les mouvements propres a Tomba en options de repositionnement pour toute la cellule.',
    'A.R.C.A. classifies Charles as a mobile instructor: he reads vertical routes, opens shortcuts, and turns Tombas movement techniques into repositioning options for the whole cell.',
    'Bond, lecon animale, esquive de branche et acceleration collective.',
    'Pounce, animal lesson, branch dodge, and squad acceleration.',
    ['Charles', 'Animal Dash', 'teacher']
  ));
}

export function createFeaturedCharacterPlaques3({ plaque }) {
  return (plaque(
    'Tabby est l amie d enfance de Tomba et la personne que les Evil Pigs enlevent dans Tomba 2, donnant a sa seconde aventure un objectif personnel au-dela du bracelet.',
    'Tabby is Tombas childhood friend and the person kidnapped by the Evil Pigs in Tomba 2, giving his second adventure a personal goal beyond the bracelet.',
    'Dans la Trame fracturee, Tabby conserve les itineraires civils et les souvenirs que les nouvelles maledictions tentent de remplacer. Elle ne devient pas une guerriere arbitraire: elle guide, protege et maintient le lien qui empeche Tomba de se perdre dans la chasse.',
    'Inside the fractured Thread, Tabby preserves civilian routes and memories that new curses try to replace. She does not become an arbitrary warrior: she guides, protects, and maintains the bond that keeps Tomba from disappearing into the hunt.',
    'Signal du collier, garde de route, soutien villageois et appel de sauvetage.',
    'Necklace signal, route guard, village support, and rescue call.',
    ['Tabby', 'Tomba 2', 'rescue']
  ));
}

export function createFeaturedBattleItemOverrides() {
  return ({
    pickups: [
      ['Boule epinee de Tomba', 'Tombas Spiked Ball', 'La boule epinee au bout dune chaine frappe un obstacle, assomme un Koma Pig ou prepare sa projection.'],
      ['Charity Wings', 'Charity Wings', 'Les ailes renvoient le porteur vers une zone deja visitee et servent de repli rapide sur une case stabilisee.'],
      ['Cle du Sage de cent ans', '100-Year-Old Mans Key', 'La grande cle doree ouvre les coffres et passages lies aux enigmes du Sage de cent ans.']
    ],
    summon: ['Sac bleu a Evil Pig', 'Blue Evil Pig Bag', 'Le sac remis par le Dwarf Elder revele la porte du domaine bleu et fournit le receptacle physique du scellement.'],
    ultimate: ['Sac noir du Real Evil Pig', 'Black Evil Pig Bag', 'Le huitieme sac apparait apres les sept scellements, revele le repaire final et enferme le Real Evil Pig.']
  });
}
