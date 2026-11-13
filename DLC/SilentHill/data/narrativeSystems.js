// Silent Hill — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'silent_hill_otherworld_trial',
    title: { fr: 'Arc Univers - Silent Hill: proces de l Otherworld', en: 'Universe Arc - Silent Hill: Otherworld Trial' },
    universes: ['Silent Hill'],
    intro: { fr: 'Le brouillard entre dans la Cite-Mosaique sans ouvrir de porte. Il apporte une regle simple et terrible: chaque peur non dite peut devenir une rue.', en: 'Fog enters Mosaic City without opening a door. It brings a simple and terrible rule: every unspoken fear can become a street.' },
    missions: [
      { fr: 'Intro - Radio parasite: suivre le bruit blanc jusqu a South Vale sans tirer sur les ombres qui ne sont que souvenirs.', en: 'Intro - Static Radio: follow the white noise into South Vale without shooting shadows that are only memories.' },
      { fr: 'Mission - Brookhaven: distinguer malade, symbole et monstre avant que l hopital ne change de version.', en: 'Mission - Brookhaven: distinguish patient, symbol, and monster before the hospital changes version.' },
      { fr: 'Interlude - Sirene: la rouille recouvre la carte et A.R.C.A. perd le nom des pieces.', en: 'Interlude - Siren: rust covers the map and A.R.C.A. loses the room names.' },
      { fr: 'Mission - Lakeview efface: recuperer une verite personnelle avant que le Sans-Auteur la transforme en punition commune.', en: 'Mission - Erased Lakeview: recover a personal truth before the Authorless turns it into common punishment.' },
      { fr: 'Boss - Dieu sans culte: empecher l Otherworld de donner naissance a un juge universel.', en: 'Boss - God Without Cult: prevent the Otherworld from birthing a universal judge.' }
    ],
    outro: { fr: 'Le brouillard recule sans etre vaincu. A.R.C.A. apprend que Silent Hill ne se nettoie pas: on y survit en refusant de mentir a la Trame.', en: 'The fog retreats without being defeated. A.R.C.A. learns Silent Hill is not cleaned: one survives it by refusing to lie to the Thread.' },
    reward: { fr: 'Radio parasite scellee + relique Lakeview', en: 'Sealed Static Radio + Lakeview relic' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'pyramidhead_red_limit',
    stageId: 9221,
    heroId: 'pyramidhead',
    title: { fr: 'Arc Personnage - Pyramid Head: limite rouge', en: 'Character Arc - Pyramid Head: Red Limit' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Juge Sans-Auteur',
    unlock: { type: 'clears', value: 8 },
    intro: { fr: 'Le Sans-Auteur tente de voler Pyramid Head a Silent Hill pour en faire un bourreau universel. A.R.C.A. doit prouver qu une punition hors contexte devient un mensonge.', en: 'The Authorless tries to steal Pyramid Head from Silent Hill and turn him into a universal executioner. A.R.C.A. must prove punishment without context becomes a lie.' },
    missions: [
      { fr: 'Mission 1 - Casque rouge: isoler la signature de jugement sans la laisser condamner une escouade innocente.', en: 'Mission 1 - Red Helmet: isolate the judgment signature without letting it condemn an innocent squad.' },
      { fr: 'Mission 2 - Couloir de rouille: traverser un Otherworld qui veut appliquer la culpabilite de James a tous les heros.', en: 'Mission 2 - Rust Corridor: cross an Otherworld trying to apply James guilt to every hero.' },
      { fr: 'Mission 3 - Faux tribunal: abattre le Juge Sans-Auteur avant qu il ne transforme Pyramid Head en outil de suppression.', en: 'Mission 3 - False Tribunal: defeat the Authorless Judge before it turns Pyramid Head into a deletion tool.' }
    ],
    outro: { fr: 'Pyramid Head reste une limite, pas une excuse. A.R.C.A. archive la regle: Silent Hill juge une verite intime, pas le multivers entier.', en: 'Pyramid Head remains a boundary, not an excuse. A.R.C.A. archives the rule: Silent Hill judges an intimate truth, not the entire multiverse.' },
    reward: { fr: 'Apparence Pyramid Head Rouille Rouge + marque de limite', en: 'Red Rust Pyramid Head Skin + boundary mark' },
    rewardItemId: 'char_pyramidhead_red_rust'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'james_lakeview_letter',
    stageId: 9222,
    heroId: 'james_s',
    title: { fr: 'Arc Personnage - James: lettre de Lakeview', en: 'Character Arc - James: Lakeview Letter' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Memoire Mary effacee',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Une lettre arrive dans les Archives A.R.C.A. avec une ecriture qui ne devrait plus exister. James comprend que Silent Hill ne l appelle pas pour gagner: elle l appelle pour dire vrai.', en: 'A letter arrives in the A.R.C.A. Archives with handwriting that should no longer exist. James understands Silent Hill is not calling him to win: it is calling him to tell the truth.' },
    missions: [
      { fr: 'Mission 1 - South Vale: suivre la radio parasite jusqu a une carte qui retire les mensonges au lieu d ajouter des routes.', en: 'Mission 1 - South Vale: follow the static radio to a map that removes lies instead of adding routes.' },
      { fr: 'Mission 2 - Brookhaven: survivre aux Nurses et Lying Figures sans confondre symbole et ennemi ordinaire.', en: 'Mission 2 - Brookhaven: survive Nurses and Lying Figures without mistaking symbol for ordinary enemy.' },
      { fr: 'Mission 3 - Lakeview: affronter la memoire de Mary avant que le Sans-Auteur ne transforme la lettre en piege commun.', en: 'Mission 3 - Lakeview: face Mary memory before the Authorless turns the letter into a common trap.' }
    ],
    outro: { fr: 'James ne sort pas indemne, mais il sort avec la lettre entiere. A.R.C.A. classe son arc comme preuve qu une verite douloureuse stabilise mieux qu un mensonge confortable.', en: 'James does not leave unharmed, but he leaves with the whole letter. A.R.C.A. classifies his arc as proof that painful truth stabilizes better than comfortable lies.' },
    reward: { fr: 'Apparence James Lakeview + lettre scellee', en: 'Lakeview James Skin + sealed letter' },
    rewardItemId: 'char_james_lakeview'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'heather_no_god_birth',
    stageId: 9223,
    heroId: 'heather',
    title: { fr: 'Arc Personnage - Heather: pas de naissance divine', en: 'Character Arc - Heather: No God Birth' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Claudia Prophetesse de Trame',
    unlock: { type: 'clears', value: 6 },
    intro: { fr: 'L Ordre trouve dans la Breche une prophetie neuve: faire naitre un dieu capable de juger toutes les Trames. Heather refuse que son origine devienne une cage.', en: 'The Order finds a new prophecy inside the Breach: birth a god able to judge every Thread. Heather refuses to let her origin become a cage.' },
    missions: [
      { fr: 'Mission 1 - Centre commercial: briser les premiers signes du rituel avant que l Otherworld ne verrouille les sorties.', en: 'Mission 1 - Mall: break the first ritual signs before the Otherworld locks the exits.' },
      { fr: 'Mission 2 - Brookhaven rouge: recuperer l Aglaophotis et separer Alessa, Heather et la Breche.', en: 'Mission 2 - Red Brookhaven: recover Aglaophotis and separate Alessa, Heather, and the Breach.' },
      { fr: 'Mission 3 - Parc d attractions: vaincre Claudia de Trame avant la naissance d un dieu sans monde.', en: 'Mission 3 - Amusement Park: defeat Thread Claudia before the birth of a god without a world.' }
    ],
    outro: { fr: 'Heather quitte le rituel en gardant son nom. A.R.C.A. archive son protocole comme refus de destin impose.', en: 'Heather leaves the ritual while keeping her name. A.R.C.A. archives her protocol as refusal of imposed destiny.' },
    reward: { fr: 'Apparence Heather Aglaophotis + pendentif scelle', en: 'Aglaophotis Heather Skin + sealed pendant' },
    rewardItemId: 'char_heather_aglaophotis'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_pyramidhead_red_rust',
    heroId: 'pyramidhead',
    name: { fr: 'Pyramid Head Rouille Rouge', en: 'Red Rust Pyramid Head' },
    colors: { primaryColor: '#7c0a02', secondaryColor: '#3b0000' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_james_lakeview',
    heroId: 'james_s',
    name: { fr: 'James Lakeview', en: 'Lakeview James' },
    colors: { primaryColor: '#7f8c8d', secondaryColor: '#cbd8c8' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_heather_aglaophotis',
    heroId: 'heather',
    name: { fr: 'Heather Aglaophotis', en: 'Aglaophotis Heather' },
    colors: { primaryColor: '#e67e22', secondaryColor: '#f1c27d' }
  });
}
