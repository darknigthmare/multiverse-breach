// Kaamelott — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'kaamelott_grail_council',
    title: { fr: 'Arc Univers - Kaamelott: conseil du Graal', en: 'Universe Arc - Kaamelott: Grail Council' },
    universes: ['Kaamelott'],
    intro: { fr: 'Le Royaume de Logres reapparait dans le Nexus sous forme de Table Ronde instable: chaque ordre devient debat, chaque debat devient mission et la quete du Graal menace de se dissoudre dans la mauvaise organisation.', en: 'The Kingdom of Logres reappears in the Nexus as an unstable Round Table: every order becomes debate, every debate becomes mission, and the Grail quest risks dissolving into bad organization.' },
    missions: [
      { fr: 'Intro - Table Ronde ouverte: reunir Arthur, Perceval et Karadoc avant que le Sans-Auteur ne reduise Kaamelott a une farce vide.', en: 'Intro - Round Table Opened: gather Arthur, Perceval, and Karadoc before the Authorless reduces Kaamelott to empty farce.' },
      { fr: 'Mission - Conseil impossible: trier les ordres de Leodagan, les excuses de chevaliers et les pistes de Graal encore utiles.', en: 'Mission - Impossible Council: sort Leodagan orders, knight excuses, and Grail leads that are still useful.' },
      { fr: 'Interlude - Lancelot Noir: la rupture de Lancelot attire Meleagant dans une marge que la Trame refuse de nommer.', en: 'Interlude - Black Lancelot: Lancelot rupture draws Meleagant into a margin the Thread refuses to name.' },
      { fr: 'Mission - Foret des Burgondes: traverser une embuscade ou les ennemis comprennent parfois moins le plan que les allies.', en: 'Mission - Burgundian Forest: cross an ambush where enemies sometimes understand the plan even less than allies do.' },
      { fr: 'Boss - Faille du Graal: empecher le Sans-Auteur de transformer la quete sacree en objectif generique sans consequence.', en: 'Boss - Grail Rift: prevent the Authorless from turning the sacred quest into a generic objective without consequence.' }
    ],
    outro: { fr: 'Logres reste bancal, humain et dangereux. A.R.C.A. classe Kaamelott comme Trame de commandement fatigue: le rire protege la verite, mais ne remplace jamais la quete.', en: 'Logres remains shaky, human, and dangerous. A.R.C.A. classifies Kaamelott as a weary command Thread: laughter protects truth, but never replaces the quest.' },
    reward: { fr: 'Relique Etincelle Excalibur + dossier Table Ronde', en: 'Excalibur Spark Relic + Round Table dossier' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'arthur_kaamelott_grail_burden',
    stageId: 9235,
    heroId: 'arthur_kaamelott',
    title: { fr: 'Arc Personnage - Roi fatigue', en: 'Character Arc - Weary King' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Meleagant Murmure',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Arthur n arrive pas dans le Nexus pour jouer au roi. Il arrive avec le poids d une quete sacree que personne ne sait vraiment organiser.', en: 'Arthur does not enter the Nexus to play king. He arrives with the weight of a sacred quest no one truly knows how to organize.' },
    missions: [
      { fr: 'Mission 1 - Ordre de Logres: reprendre la Table Ronde sans laisser les disputes masquer le Graal.', en: 'Mission 1 - Order of Logres: retake the Round Table without letting arguments hide the Grail.' },
      { fr: 'Mission 2 - Frontiere de Carmelite: tenir Leodagan, les bandits et les mauvaises decisions loin du meme couloir.', en: 'Mission 2 - Carmelite Border: keep Leodagan, bandits, and bad decisions away from the same corridor.' },
      { fr: 'Mission 3 - Lancelot Noir: affronter la rupture de Lancelot sans transformer Kaamelott en simple guerre de chevaliers.', en: 'Mission 3 - Black Lancelot: face Lancelot rupture without turning Kaamelott into a simple knight war.' },
      { fr: 'Boss - Meleagant Murmure: refuser la voix qui veut faire croire qu abandonner la quete serait enfin du repos.', en: 'Boss - Meleagant Whisper: refuse the voice claiming that abandoning the quest would finally mean rest.' }
    ],
    outro: { fr: 'Arthur ne repart pas gueri, mais il repart debout. A.R.C.A. comprend que son heroisme tient dans la decision de commander encore quand tout l use.', en: 'Arthur does not leave healed, but he leaves standing. A.R.C.A. understands his heroism lies in choosing to command again when everything wears him down.' },
    reward: { fr: 'Apparence Roi de Logres + etincelle Excalibur', en: 'King of Logres Skin + Excalibur spark' },
    rewardItemId: 'char_arthur_kaamelott_king'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'perceval_kaamelott_oblique_rule',
    stageId: 9236,
    heroId: 'perceval_kaamelott',
    title: { fr: 'Arc Personnage - C est pas faux', en: 'Character Arc - Not Wrong Exactly' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Regle Sans Definition',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Perceval comprend rarement la consigne comme A.R.C.A. l ecrit. C est precisement pour ca qu il repere parfois la sortie cachee.', en: 'Perceval rarely understands the instruction as A.R.C.A. writes it. That is exactly why he sometimes spots the hidden exit.' },
    missions: [
      { fr: 'Mission 1 - Mauvaise definition: suivre une piste de Graal qui n existe que si on accepte de mal poser la question.', en: 'Mission 1 - Wrong Definition: follow a Grail clue that exists only if the question is phrased badly.' },
      { fr: 'Mission 2 - Jeu gallois: survivre a des regles qui changent chaque fois que quelqu un tente de les expliquer.', en: 'Mission 2 - Welsh Game: survive rules that change whenever someone tries to explain them.' },
      { fr: 'Mission 3 - Bonne porte par erreur: ouvrir le passage que le Sans-Auteur croyait protege par une logique trop parfaite.', en: 'Mission 3 - Right Door by Mistake: open the passage the Authorless thought protected by logic too perfect.' },
      { fr: 'Boss - Regle Sans Definition: vaincre une anomalie qui devient invincible des qu on pretend tout comprendre.', en: 'Boss - Rule Without Definition: defeat an anomaly that becomes invincible whenever everyone pretends to understand it.' }
    ],
    outro: { fr: 'Perceval ne donne pas une explication claire. Il donne mieux: une route praticable et une loyaute intacte envers Arthur.', en: 'Perceval does not give a clear explanation. He gives something better: a usable route and loyalty to Arthur left intact.' },
    reward: { fr: 'Apparence Pays de Galles + boucle C est pas faux', en: 'Wales Skin + Not Wrong Loop' },
    rewardItemId: 'char_perceval_c_est_pas_faux'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'karadoc_kaamelott_survival_ration',
    stageId: 9237,
    heroId: 'karadoc_kaamelott',
    title: { fr: 'Arc Personnage - Casse-croute de survie', en: 'Character Arc - Survival Snack' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Famine de Trame',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Karadoc regarde une faille cosmique et pose la seule question que personne n a prevue: combien de temps tient une quete sans manger?', en: 'Karadoc looks at a cosmic breach and asks the one question no one planned for: how long does a quest last without food?' },
    missions: [
      { fr: 'Mission 1 - Reserve de Vannes: recuperer les rations avant que le Sans-Auteur ne classe la faim comme detail comique.', en: 'Mission 1 - Vannes Reserve: recover rations before the Authorless classifies hunger as a comic detail.' },
      { fr: 'Mission 2 - Route trop longue: proteger les chevaliers fatigues pendant qu Arthur cherche encore un plan presentable.', en: 'Mission 2 - Too Long Road: protect exhausted knights while Arthur still looks for a presentable plan.' },
      { fr: 'Mission 3 - Table de repli: transformer un repas improvise en point de ralliement tactique.', en: 'Mission 3 - Fallback Table: turn an improvised meal into a tactical rally point.' },
      { fr: 'Boss - Famine de Trame: vaincre l anomalie qui veut couper les corps de la legende pour rendre Logres abstrait.', en: 'Boss - Thread Famine: defeat the anomaly trying to cut bodies out of legend and make Logres abstract.' }
    ],
    outro: { fr: 'Karadoc prouve que survivre n est pas moins noble que chercher le Graal. Sans corps debout, aucune legende ne traverse la nuit.', en: 'Karadoc proves survival is not less noble than searching for the Grail. Without bodies still standing, no legend crosses the night.' },
    reward: { fr: 'Apparence Clan de Vannes + ration Karadoc', en: 'Vannes Clan Skin + Karadoc ration' },
    rewardItemId: 'char_karadoc_vannes_ration'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_arthur_kaamelott_king',
    heroId: 'arthur_kaamelott',
    name: { fr: 'Roi de Logres', en: 'King of Logres' },
    colors: { primaryColor: '#2f3d52', secondaryColor: '#d6b465' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_perceval_c_est_pas_faux',
    heroId: 'perceval_kaamelott',
    name: { fr: 'Pays de Galles', en: 'Wales Knight' },
    colors: { primaryColor: '#5b7f95', secondaryColor: '#8ecae6' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_karadoc_vannes_ration',
    heroId: 'karadoc_kaamelott',
    name: { fr: 'Clan de Vannes', en: 'Vannes Clan' },
    colors: { primaryColor: '#6a4a2c', secondaryColor: '#b88746' }
  });
}
