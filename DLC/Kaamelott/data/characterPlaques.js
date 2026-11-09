// Kaamelott — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'KAA-AR01',
    rank: { fr: 'Roi de Bretagne', en: 'King of Brittany' },
    role: { fr: 'Commandement fatigue, strategie et quete du Graal', en: 'Tired command, strategy, and Grail quest' },
    callSign: 'Arthur',
    origin: { fr: 'Univers Kaamelott - Royaume de Logres / Table Ronde / quete du Graal', en: 'Kaamelott universe - Kingdom of Logres / Round Table / Grail quest' },
    dossier: {
      fr: 'Dans sa Trame d origine, Arthur Pendragon tente de tenir un royaume, une Table Ronde et une quete du Graal avec des chevaliers rarement au niveau de la mission. Kaamelott n est pas une legende arthurienne lisse: c est une serie francaise ou le pouvoir fatigue, les reunions derapent, la politique familiale use le roi, Lancelot glisse vers la rupture et le Graal reste un objectif sacre noye dans l incompetence ordinaire. Arthur represente le coeur grave de la serie: humour sec, solitude du commandement, lucidite strategique et fatigue de porter une mission trop grande pour son equipe.',
      en: 'In his origin Thread, Arthur Pendragon tries to hold a kingdom, a Round Table, and a Grail quest together with knights rarely equal to the mission. Kaamelott is not a polished Arthurian legend: it is a French series where power grows tired, meetings derail, family politics wear down the king, Lancelot slides toward rupture, and the Grail remains a sacred objective drowned in ordinary incompetence. Arthur carries the serious heart of the series: dry humor, command loneliness, strategic lucidity, and exhaustion from carrying a mission too large for his team.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Arthur devient une ancre de commandement fragile mais essentielle. A.R.C.A. l emploie dans les failles ou l ordre heroique s effondre sous l administration, les malentendus et les mauvaises decisions de conseil. Le Sans-Auteur veut transformer Kaamelott en farce pure ou en fantasy generique; Arthur force la Trame a rester entre les deux: drole parce que les gens ratent, grave parce que le royaume risque vraiment de tomber. Son objectif Breach est simple: garder la quete lisible quand tout le monde parle en meme temps.',
      en: 'In Multiverse Breach, Arthur becomes a fragile but essential command anchor. A.R.C.A. uses him in rifts where heroic order collapses under administration, misunderstandings, and bad council decisions. The Authorless wants to turn Kaamelott into pure farce or generic fantasy; Arthur forces the Thread to remain between both: funny because people fail, serious because the kingdom can truly fall. His Breach objective is simple: keep the quest readable while everyone speaks at once.'
    },
    doctrine: { fr: 'Excalibur, ordre de Table Ronde, strategie lasse, sarcasme royal, repli du royaume.', en: 'Excalibur, Round Table order, tired strategy, royal sarcasm, kingdom fallback.' },
    tags: ['Kaamelott', 'Arthur', 'Graal', 'Table Ronde', 'Bretagne']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'KAA-PE02',
    rank: { fr: 'Chevalier du Pays de Galles', en: 'Knight of Wales' },
    role: { fr: 'Logique oblique, intuition et chaos utile', en: 'Oblique logic, intuition, and useful chaos' },
    callSign: 'Perceval',
    origin: { fr: 'Univers Kaamelott - Pays de Galles / Table Ronde / incomprehension fertile', en: 'Kaamelott universe - Wales / Round Table / fertile misunderstanding' },
    dossier: {
      fr: 'Dans sa Trame d origine, Perceval est l un des chevaliers les plus improbables de la Table Ronde: souvent perdu dans les mots, les plans, les chiffres et les consignes, mais capable d intuitions que les chevaliers plus brillants ratent. Sa logique n est pas celle d un idiot generique; c est une maniere oblique de traverser le monde, faite de malentendus, de jeux incomprehensibles, de fidelite a Arthur et de moments ou l absurde touche presque au mystique.',
      en: 'In his origin Thread, Perceval is one of the Round Table most unlikely knights: often lost in words, plans, numbers, and instructions, yet capable of intuitions brighter knights miss. His logic is not generic stupidity; it is an oblique way of crossing the world, made of misunderstandings, incomprehensible games, loyalty to Arthur, and moments where absurdity almost touches the mystical.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Perceval sert a lire les failles que la logique classique ne comprend pas. A.R.C.A. l envoie quand une mission devient trop tordue, quand les objectifs se contredisent ou quand le Sans-Auteur cache une sortie dans une phrase absurde. Perceval ne resout pas les problemes comme un stratege: il tombe parfois sur la bonne porte parce qu il n a jamais accepte la mauvaise definition du couloir. Son arc Breach protege l esprit Kaamelott: l incompetence peut devenir intuition, mais seulement si elle reste humaine.',
      en: 'In Multiverse Breach, Perceval reads rifts classical logic cannot understand. A.R.C.A. sends him when a mission becomes too twisted, objectives contradict one another, or the Authorless hides an exit inside an absurd sentence. Perceval does not solve problems like a strategist: he sometimes finds the right door because he never accepted the wrong definition of the corridor. His Breach arc protects Kaamelott spirit: incompetence can become intuition, but only if it remains human.'
    },
    doctrine: { fr: 'Confusion fertile, phrase de travers, intuition mystique, mini-jeu absurde, fidelite a Arthur.', en: 'Fertile confusion, crooked sentence, mystical intuition, absurd minigame, loyalty to Arthur.' },
    tags: ['Kaamelott', 'Perceval', 'Pays de Galles', 'Absurd Logic', 'Graal']
  });
}

export function createCharacterPlaques3() {
  return ({
    clearance: 'KAA-KA03',
    rank: { fr: 'Chevalier de Vannes', en: 'Knight of Vannes' },
    role: { fr: 'Survie, ration, bon sens de travers', en: 'Survival, ration, crooked common sense' },
    callSign: 'Karadoc',
    origin: { fr: 'Univers Kaamelott - Vannes / clan de la bouffe / Table Ronde', en: 'Kaamelott universe - Vannes / food clan / Round Table' },
    dossier: {
      fr: 'Dans sa Trame d origine, Karadoc est moins un heros de geste qu un survivant pragmatique: manger, dormir, eviter les plans trop compliques et rester pres de Perceval quand la Table Ronde pretend comprendre ce qu elle fait. Son rapport a la nourriture est comique, mais aussi structurel: il ramene la quete du Graal au corps, a la fatigue, aux besoins simples et a une forme de bon sens souvent mal place mais rarement completement inutile.',
      en: 'In his origin Thread, Karadoc is less a heroic champion than a pragmatic survivor: eat, sleep, avoid overcomplicated plans, and stay close to Perceval when the Round Table pretends to understand what it is doing. His relationship to food is comic, but also structural: he brings the Grail quest back to the body, fatigue, simple needs, and a form of common sense often misplaced but rarely entirely useless.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Karadoc devient l ancre de survie de Kaamelott. A.R.C.A. l utilise quand les failles transforment la noblesse, les titres et les grandes phrases en bruit inutile: Karadoc demande ce qu on mange, ou on dort, combien de temps on tient, et pourquoi on suivrait un plan qui n a meme pas prevu le casse-croute. Sa presence empeche la Trame Kaamelott de devenir une legende abstraite: un royaume tombe aussi quand ses chevaliers n ont plus de forces.',
      en: 'In Multiverse Breach, Karadoc becomes Kaamelott survival anchor. A.R.C.A. uses him when rifts turn nobility, titles, and grand speeches into useless noise: Karadoc asks what people eat, where they sleep, how long they can hold, and why anyone would follow a plan that did not even account for food. His presence prevents Kaamelott from becoming abstract legend: a kingdom also falls when its knights have no strength left.'
    },
    doctrine: { fr: 'Ration de Vannes, garde du clan, endurance absurde, repli casse-croute.', en: 'Vannes ration, clan guard, absurd endurance, snack fallback.' },
    tags: ['Kaamelott', 'Karadoc', 'Vannes', 'Ration', 'Survival']
  });
}
