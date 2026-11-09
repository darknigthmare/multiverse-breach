// Stargate — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'SGC-01',
    rank: { fr: 'Colonel USAF / commandant SG-1', en: 'USAF Colonel / SG-1 commander' },
    role: { fr: 'Commandement expeditionnaire par Porte', en: 'Gate expedition command' },
    callSign: 'O\'Neill',
    origin: { fr: 'Univers Stargate SG-1 - Terre / SGC / Cheyenne Mountain', en: 'Stargate SG-1 universe - Earth / SGC / Cheyenne Mountain' },
    dossier: {
      fr: 'Dans sa Trame d origine, Jack O Neill commande SG-1 depuis le SGC, sous Cheyenne Mountain, apres la decouverte que la Porte des Etoiles relie la Terre a un reseau galactique de mondes, de cultures humaines transplantees et de menaces Goa uld. Soldat marque par les operations speciales et Abydos, il oppose aux faux dieux une logique simple: humour sec, P90, retraite couverte, iris ferme quand il le faut, et priorite absolue a ramener son equipe vivante.',
      en: 'In his origin Thread, Jack O Neill commands SG-1 from the SGC under Cheyenne Mountain after the Stargate reveals a galactic network of worlds, transplanted human cultures, and Goa uld threats. A soldier shaped by special operations and Abydos, he answers false gods with a simple logic: dry humor, P90, covered fallback, iris closed when needed, and absolute priority on bringing his team home alive.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, O Neill traite chaque faille comme une adresse inconnue: on reconnait, on verifie le GDO, on protege l iris et on refuse de laisser un faux dieu transformer la Cité-Mosaïque en territoire conquis. A.R.C.A. l emploie pour decider quand ouvrir une route et quand la fermer, car son lore ne vend jamais l exploration comme une promenade: chaque Porte peut sauver une civilisation ou laisser entrer une flotte hostile.',
      en: 'In Multiverse Breach, O Neill treats every rift like an unknown address: scout, verify the GDO, protect the iris, and refuse to let a false god turn Mosaic City into conquered territory. A.R.C.A. uses him to decide when to open a route and when to close it, because his lore never frames exploration as a stroll: every Gate can save a civilization or let a hostile fleet in.'
    },
    doctrine: { fr: 'P90, Zat nik tel, GDO, iris, repli couvert, decisions de commandement SG-1.', en: 'P90, Zat nik tel, GDO, iris, covered fallback, SG-1 command decisions.' },
    tags: ['SG-1', 'SGC', 'P90', 'Iris', 'Goauld', 'Command']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'SGC-02',
    rank: { fr: 'Major USAF / astrophysicienne SGC', en: 'USAF Major / SGC astrophysicist' },
    role: { fr: 'Science de Porte et contre-mesures', en: 'Gate science and countermeasures' },
    callSign: 'Carter',
    origin: { fr: 'Univers Stargate SG-1 - Terre / SGC / USAF / naquadah', en: 'Stargate SG-1 universe - Earth / SGC / USAF / naquadah' },
    dossier: {
      fr: 'Dans sa Trame d origine, Samantha Carter est officier de l USAF et astrophysicienne, l une des rares personnes capables de comprendre a la fois la physique de la Porte, les moteurs hyperspatiaux, le naquadah, les boucliers Goa uld et les risques temporels ou dimensionnels qui suivent SG-1. Elle represente le Stargate scientifique: resoudre vite, expliquer juste assez, puis transformer une anomalie mortelle en solution tactique.',
      en: 'In her origin Thread, Samantha Carter is a USAF officer and astrophysicist, one of the few people able to understand Gate physics, hyperspace engines, naquadah, Goa uld shields, and the temporal or dimensional risks that follow SG-1. She represents scientific Stargate: solve fast, explain just enough, then turn a lethal anomaly into a tactical solution.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Carter est celle qui empeche les Portes de devenir des trous narratifs. A.R.C.A. la branche aux chevrons instables pour recalculer les adresses de Trame, isoler les surcharges de naquadah, transformer les boucliers ennemis en fenetres de tir et prouver qu une breche peut etre comprise sans perdre son mystere. Si O Neill decide quand ouvrir, Carter explique comment survivre a l ouverture.',
      en: 'In Multiverse Breach, Carter prevents Gates from becoming narrative holes. A.R.C.A. connects her to unstable chevrons to recalculate Thread addresses, isolate naquadah overloads, turn enemy shields into firing windows, and prove a breach can be understood without losing its mystery. If O Neill decides when to open, Carter explains how to survive the opening.'
    },
    doctrine: { fr: 'Calcul de chevrons, surcharge naquadah, piratage de bouclier Goa uld, science de terrain.', en: 'Chevron calculation, naquadah overload, Goa uld shield hacking, field science.' },
    tags: ['SG-1', 'Carter', 'Naquadah', 'Chevron', 'Science', 'USAF']
  });
}

export function createCharacterPlaques3() {
  return ({
    clearance: 'SGC-03',
    rank: { fr: 'Jaffa libre / ancien Prima d Apophis', en: 'Free Jaffa / former First Prime of Apophis' },
    role: { fr: 'Avant-garde anti-Goa uld', en: 'Anti-Goa uld vanguard' },
    callSign: 'Teal\'c',
    origin: { fr: 'Univers Stargate SG-1 - Chulak / Jaffa libre / Goa uld', en: 'Stargate SG-1 universe - Chulak / Free Jaffa / Goa uld' },
    dossier: {
      fr: 'Dans sa Trame d origine, Teal c nait dans la culture Jaffa, porteur d un symbiote larvaire et soldat d un empire qui sert les Goa uld comme des dieux. Ancien Prima d Apophis, il trahit son faux dieu pour rejoindre SG-1 et ouvrir la route a la rebellion Jaffa. Son lore est discipline, honneur, lance serpent, connaissance intime des tactiques ennemies et liberte conquise contre des millenaires de mensonge religieux.',
      en: 'In his origin Thread, Teal c is born into Jaffa culture, carrying a larval symbiote and serving an empire that worships Goa uld as gods. Former First Prime of Apophis, he betrays his false god to join SG-1 and open the road to the Free Jaffa rebellion. His lore is discipline, honor, serpent staff, intimate knowledge of enemy tactics, and freedom won against millennia of religious lies.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Teal c reconnait tout de suite le danger du Sans-Auteur: une force qui veut etre obei sans histoire ressemble trop aux Goa uld. A.R.C.A. l envoie contre les faux dieux de Trame, les Primes recodes et les temples qui tentent de transformer la foi en controle. Sa presence rappelle que Stargate ne parle pas seulement de technologie ancienne, mais de peuples qui apprennent a ne plus s agenouiller.',
      en: 'In Multiverse Breach, Teal c immediately recognizes the danger of the Authorless: a force demanding obedience without story resembles the Goa uld too closely. A.R.C.A. sends him against Thread false gods, recoded First Primes, and temples trying to turn faith into control. His presence reminds Stargate is not only about ancient technology, but about peoples learning not to kneel.'
    },
    doctrine: { fr: 'Lance Jaffa, duel frontal, protection SG-1, contre-doctrine Goa uld.', en: 'Jaffa staff, frontal duel, SG-1 protection, anti-Goa uld doctrine.' },
    tags: ['SG-1', 'Tealc', 'Jaffa', 'Chulak', 'Apophis', 'Freedom']
  });
}

export function createCharacterPlaques4() {
  return ({
    clearance: 'JAFFA-MASTER',
    rank: { fr: 'Ancien Prima d Apophis / maitre Jaffa libre', en: 'Former First Prime of Apophis / Free Jaffa master' },
    role: { fr: 'Mentor Jaffa et commandant de resistance', en: 'Jaffa mentor and resistance commander' },
    callSign: 'Bra\'tac',
    origin: { fr: 'Univers Stargate SG-1 - Chulak / rebellion Jaffa', en: 'Stargate SG-1 universe - Chulak / Jaffa rebellion' },
    dossier: {
      fr: 'Dans sa Trame d origine, Bra tac est un maitre Jaffa, ancien Prima d Apophis et mentor de Teal c. Il a servi assez longtemps les Goa uld pour connaitre leurs mensonges, leurs tactiques et leurs faiblesses, puis a consacre son experience a la rebellion et a la liberte des Jaffa. Son age ne diminue ni sa precision au Ma Tok ni son autorite sur un champ de bataille.',
      en: 'In his origin Thread, Bra tac is a Jaffa master, former First Prime of Apophis, and Teal c s mentor. He served the Goa uld long enough to know their lies, tactics, and weaknesses, then devoted that experience to rebellion and Jaffa freedom. His age diminishes neither his Ma Tok precision nor his battlefield authority.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. confie a Bra tac les Trames ou un faux dieu utilise une armee, une religion ou une technologie volee pour imposer son recit. Il organise les cellules Jaffa libres, reconnait les doctrines Goa uld contrefaites et transforme chaque Porte stabilisee en route d evacuation ou en point de soulevement.',
      en: 'In Multiverse Breach, A.R.C.A. assigns Bra tac to Threads where a false god uses an army, religion, or stolen technology to impose its narrative. He organizes Free Jaffa cells, recognizes counterfeit Goa uld doctrine, and turns each stabilized Gate into an evacuation route or uprising point.'
    },
    doctrine: { fr: 'Ma Tok, tir plasma rapide, commandement Jaffa, sabotage Goa uld, repli par la Porte.', en: 'Ma Tok staff, rapid plasma fire, Jaffa command, Goa uld sabotage, Gate withdrawal.' },
    tags: ['SG-1', 'Bratac', 'Jaffa', 'Chulak', 'Free Jaffa', 'Ma Tok']
  });
}

export function createCharacterPlaques5() {
  return ({
    clearance: 'SGC-04',
    rank: { fr: 'Archeologue / linguiste SG-1', en: 'Archaeologist / SG-1 linguist' },
    role: { fr: 'Langues anciennes et memoire de Porte', en: 'Ancient languages and Gate memory' },
    callSign: 'Daniel',
    origin: { fr: 'Univers Stargate SG-1 - Abydos / Anciens / mythologies Goa uld', en: 'Stargate SG-1 universe - Abydos / Ancients / Goa uld mythologies' },
    dossier: {
      fr: 'Dans sa Trame d origine, Daniel Jackson est l archeologue et linguiste qui comprend que les dieux antiques caches dans les mythes etaient souvent des Goa uld, et que la Porte des Etoiles relie la Terre a une histoire galactique oubliee. Abydos, Sha re, les Anciens, l Ascension et les langues mortes font de lui le membre de SG-1 qui lit les mondes avant de les traverser. Son arme principale n est pas seulement un pistolet: c est la traduction juste au bon moment.',
      en: 'In his origin Thread, Daniel Jackson is the archaeologist and linguist who understands that ancient gods hidden in myth were often Goa uld, and that the Stargate connects Earth to a forgotten galactic history. Abydos, Sha re, the Ancients, Ascension, and dead languages make him the SG-1 member who reads worlds before crossing them. His primary weapon is not only a pistol: it is the right translation at the right time.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Daniel protege le sens des Trames. A.R.C.A. l utilise quand une Porte ouvre sur des symboles que les armes ne peuvent pas resoudre: cartouches Goa uld, dialectes Anciens, mythes contamines par le Sans-Auteur, rituels qui sont en fait des protocoles. Il empeche la Breche de reduire Stargate a des tirs de couloir, parce qu une mauvaise traduction peut ouvrir une invasion, mais une bonne peut sauver un monde.',
      en: 'In Multiverse Breach, Daniel protects Thread meaning. A.R.C.A. uses him when a Gate opens onto symbols weapons cannot solve: Goa uld cartouches, Ancient dialects, myths contaminated by the Authorless, rituals that are actually protocols. He prevents the Breach from reducing Stargate to corridor firefights, because a bad translation can open an invasion, but a good one can save a world.'
    },
    doctrine: { fr: 'Traduction de glyphes, lecture Ancienne, diplomatie, archeologie de terrain, ascension surveillee.', en: 'Glyph translation, Ancient reading, diplomacy, field archaeology, monitored Ascension.' },
    tags: ['SG-1', 'Daniel', 'Abydos', 'Ancients', 'Glyphs', 'Ascension']
  });
}
