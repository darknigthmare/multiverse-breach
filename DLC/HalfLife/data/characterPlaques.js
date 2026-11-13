// Half-Life — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'BM-HEV',
    rank: { fr: 'Physicien HEV Mark V / Resistance', en: 'HEV Mark V physicist / Resistance' },
    role: { fr: 'Cascade de resonance', en: 'Resonance cascade' },
    callSign: 'Freeman',
    origin: { fr: 'Half-Life 2 (2004) - City 17 / Citadelle', en: 'Half-Life 2 (2004) - City 17 / Citadel' },
    dossier: {
      fr: 'Cette incarnation est celle de Half-Life 2 (2004). Apres sa stase, Gordon Freeman rejoint la Resistance de City 17 avec la combinaison HEV Mark V fournie par Kleiner. Il utilise son pied-de-biche et le gravity gun d Alyx; dans la Citadelle, le champ de confiscation suralimente ce dernier.',
      en: 'This is the Half-Life 2 (2004) incarnation. After stasis, Gordon Freeman joins the City 17 Resistance in the HEV Mark V suit supplied by Kleiner. He uses his crowbar and Alyx s gravity gun; in the Citadel, the confiscation field supercharges the latter.'
    },
    breachLore: {
      fr: 'Quand la Breche touche Black Mesa, A.R.C.A. detecte une anomalie rare: Freeman ne ferme pas les portails par autorite, il les traverse jusqu a ce que leur logique s effondre. Dans Multiverse Breach, son role est de stabiliser les cascades avant qu elles ne deviennent des portes permanentes entre Trames, d isoler Xen du Sans-Auteur, de retourner les technologies Combine contre leurs noeuds de controle et de garder le silence comme une resistance: aucun slogan, seulement une trajectoire que le Nexus peut suivre.',
      en: 'When the Breach hits Black Mesa, A.R.C.A. detects a rare anomaly: Freeman does not close portals through authority, he crosses them until their logic collapses. In Multiverse Breach, his role is to stabilize cascades before they become permanent doors between Threads, isolate Xen from the Authorless, turn Combine technology against its control nodes, and keep silence as resistance: no slogan, only a trajectory the Nexus can follow.'
    },
    doctrine: { fr: 'Pied-de-biche, HEV Mark V, gravity gun, version suralimentee de la Citadelle.', en: 'Crowbar, HEV Mark V, gravity gun, Citadel supercharged version.' },
    tags: ['Half-Life 2', 'City 17', 'HEV Mark V', 'Combine', 'Gravity', 'G-Man']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'BM-SEC',
    rank: { fr: 'Securite Black Mesa / Resistance City 17', en: 'Black Mesa security / City 17 Resistance' },
    role: { fr: 'Extraction humaine', en: 'Human extraction' },
    callSign: 'Barney',
    origin: { fr: 'Univers Half-Life - Black Mesa Security / Resistance', en: 'Half-Life universe - Black Mesa Security / Resistance' },
    dossier: {
      fr: 'Dans sa Trame d origine, Barney Calhoun commence comme agent de securite a Black Mesa pendant la cascade de resonance. Il survit aux couloirs envahis par Xen, aux ordres militaires contradictoires et aux ruptures de confinement, puis reapparait comme membre de la Resistance contre l occupation Combine a City 17. Barney represente le Half-Life humain: escorter, ouvrir une route, donner une arme, tenir une barricade, plaisanter juste assez pour que la panique ne gagne pas.',
      en: 'In his origin Thread, Barney Calhoun starts as a Black Mesa security officer during the resonance cascade. He survives Xen-infested corridors, contradictory military orders, and containment failures, then returns as a Resistance member against the Combine occupation in City 17. Barney represents human Half-Life: escort, open a route, hand over a weapon, hold a barricade, joke just enough to keep panic from winning.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Barney sert de contrepoids a l anomalie Freeman: il rappelle que la Breche Half-Life ne concerne pas seulement des portails, mais les gens coincés derriere. A.R.C.A. l emploie pour evacuer les signatures civiles, convertir une salle de laboratoire en point de resistance, couvrir les replis et empecher le Sans-Auteur de transformer Black Mesa en simple decor de catastrophe. Sa valeur est claire: si Barney tient la porte, quelqu un rentre vivant.',
      en: 'In Multiverse Breach, Barney is the counterweight to the Freeman anomaly: he reminds A.R.C.A. that a Half-Life breach is not only about portals, but about people trapped behind them. A.R.C.A. uses him to evacuate civilian signatures, convert a lab room into a resistance point, cover retreats, and prevent the Authorless from turning Black Mesa into generic disaster scenery. His value is simple: if Barney holds the door, someone comes back alive.'
    },
    doctrine: { fr: 'Pistolet 9mm, couverture courte, radio Resistance, evacuation de survivants, barrage anti-Combine.', en: '9mm sidearm, short cover, Resistance radio, survivor evacuation, anti-Combine suppression.' },
    tags: ['Black Mesa', 'Security', 'Resistance', 'City 17', 'Combine', 'Rescue']
  });
}

export function createCharacterPlaques3() {
  return ({
    clearance: 'HECU-OP4',
    rank: { fr: 'Caporal HECU / survivant Opposing Force', en: 'HECU corporal / Opposing Force survivor' },
    role: { fr: 'Intervention militaire Black Mesa', en: 'Black Mesa military intervention' },
    callSign: 'Shephard',
    origin: { fr: 'Univers Half-Life - HECU / Black Mesa / Race X', en: 'Half-Life universe - HECU / Black Mesa / Race X' },
    dossier: {
      fr: 'Dans sa Trame d origine, Adrian Shephard est un marine HECU envoye a Black Mesa pendant l incident de resonance. Il arrive comme force de nettoyage militaire, mais se retrouve piege dans le meme cauchemar que les scientifiques: Xen, Race X, teleports instables, chaines de commandement brisees et G-Man qui observe chaque sortie possible. Shephard represente le Half-Life vu depuis l autre cote du fusil: mission officielle, survie improvisee et refus progressif d etre seulement un executant.',
      en: 'In his origin Thread, Adrian Shephard is a HECU marine sent to Black Mesa during the resonance incident. He arrives as a military cleanup force, but becomes trapped in the same nightmare as the scientists: Xen, Race X, unstable teleports, broken chains of command, and the G-Man watching every possible exit. Shephard represents Half-Life from the other side of the rifle: official mission, improvised survival, and gradual refusal to remain only an executor.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Shephard sert a lire les failles Half-Life que Freeman traverse trop vite et que Barney veut evacuer. A.R.C.A. l emploie pour securiser les zones HECU, recuperer du materiel lourd, neutraliser Race X avant qu elle ne se greffe aux autres Trames et surveiller les choix du G-Man. Son danger est politique: s il redevient simple soldat d ordre, le Sans-Auteur peut transformer Black Mesa en operation de nettoyage sans temoins.',
      en: 'In Multiverse Breach, Shephard reads the Half-Life breaches Freeman crosses too quickly and Barney wants to evacuate. A.R.C.A. uses him to secure HECU zones, recover heavy gear, neutralize Race X before it grafts onto other Threads, and monitor G-Man choices. His danger is political: if he becomes only a soldier following orders again, the Authorless can turn Black Mesa into a cleanup operation with no witnesses.'
    },
    doctrine: { fr: 'Fusil HECU, cle a pipe, spores Race X, explosifs, extraction sous observation G-Man.', en: 'HECU rifle, pipe wrench, Race X spores, explosives, extraction under G-Man observation.' },
    tags: ['HECU', 'Opposing Force', 'Race X', 'Black Mesa', 'G-Man', 'Marine']
  });
}

export function createCharacterPlaques4() {
  return ({
    clearance: 'C17-ALYX',
    rank: { fr: 'Operatrice Resistance / ingenieure de terrain', en: 'Resistance operative / field engineer' },
    role: { fr: 'Piraterie Combine et survie urbaine', en: 'Combine hacking and urban survival' },
    callSign: 'Alyx',
    origin: { fr: 'Univers Half-Life - City 17 / Resistance / Combine', en: 'Half-Life universe - City 17 / Resistance / Combine' },
    dossier: {
      fr: 'Dans sa Trame d origine, Alyx Vance grandit dans un monde deja brise par la cascade de resonance et l occupation Combine. Fille d Eli Vance, ingenieure de terrain, combattante de la Resistance et partenaire centrale de Gordon Freeman, elle traverse City 17, Ravenholm, la Citadelle et les ruines de l occupation avec une competence rare: transformer la technologie ennemie en issue. Alyx represente le Half-Life de la Resistance humaine: piratage, improvisation, confiance, Dog, gravite manipulee et refus de laisser le Combine definir l avenir.',
      en: 'In her origin Thread, Alyx Vance grows up in a world already broken by the resonance cascade and Combine occupation. Daughter of Eli Vance, field engineer, Resistance fighter, and central partner to Gordon Freeman, she crosses City 17, Ravenholm, the Citadel, and the ruins of occupation with a rare skill: turning enemy technology into an exit. Alyx represents human Resistance Half-Life: hacking, improvisation, trust, Dog, manipulated gravity, and refusal to let the Combine define the future.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Alyx est la voix humaine qui empeche les failles Half-Life de devenir seulement des experiences ou des guerres. A.R.C.A. l envoie la ou les noeuds Combine ont verrouille les civils dans des boucles de surveillance: elle pirate les serrures de Trame, retourne les scanners, ouvre les routes que Freeman traverse ensuite et maintient le lien moral de l escouade. Sa Breche personnelle n est pas de prouver sa force; c est de sauver assez de choix pour que la Resistance reste une decision vivante.',
      en: 'In Multiverse Breach, Alyx is the human voice that prevents Half-Life breaches from becoming only experiments or wars. A.R.C.A. sends her where Combine nodes have locked civilians inside surveillance loops: she hacks Thread locks, turns scanners around, opens routes Freeman can cross, and keeps the squad moral link alive. Her personal Breach is not about proving strength; it is about saving enough choices for Resistance to remain a living decision.'
    },
    doctrine: { fr: 'Pistolet Resistance, piratage Combine, gravity gloves, Dog, extraction de civils.', en: 'Resistance pistol, Combine hacking, gravity gloves, Dog, civilian extraction.' },
    tags: ['Alyx', 'Resistance', 'City 17', 'Combine', 'Dog', 'Gravity']
  });
}
