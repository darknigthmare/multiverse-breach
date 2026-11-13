// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcTomba from '../../DLC/Tomba/data/featuredUniversePacks.js';
import * as dlcWoodruff from '../../DLC/Woodruff/data/featuredUniversePacks.js';
import * as dlcHellraiser from '../../DLC/Hellraiser/data/featuredUniversePacks.js';
import * as dlcANightmareOnElmStreet from '../../DLC/ANightmareOnElmStreet/data/featuredUniversePacks.js';
import * as dlcTheRing from '../../DLC/TheRing/data/featuredUniversePacks.js';
import * as dlcTheGrudge from '../../DLC/TheGrudge/data/featuredUniversePacks.js';

const hero = (id, name, cat, color, weapon, simpleName, secondaryName, defenseName, specialName) => ({
  id,
  name,
  cat,
  color,
  weapon,
  simpleName,
  secondaryName,
  defenseName,
  specialName
});

const threat = (name, spriteSource, weapon, special, extra = {}) => ({
  name,
  spriteSource,
  weapon,
  special,
  ...extra
});

const localized = (fr, en) => ({ fr, en });

export const FEATURED_UNIVERSE_KEYS = [
  'Tomba',
  'Woodruff',
  'Hellraiser',
  'A Nightmare on Elm Street',
  'The Ring',
  'The Grudge'
];

export const FEATURED_UNIVERSE_PACKS = [
  dlcTomba.createFeaturedUniversePacks({ hero, threat }),
  dlcWoodruff.createFeaturedUniversePacks({ hero, threat }),
  dlcHellraiser.createFeaturedUniversePacks({ hero, threat }),
  dlcANightmareOnElmStreet.createFeaturedUniversePacks({ hero, threat }),
  dlcTheRing.createFeaturedUniversePacks({ hero, threat }),
  dlcTheGrudge.createFeaturedUniversePacks({ hero, threat })
];

export const FEATURED_UNIVERSE_NARRATIVE_ARCS = [
  dlcTomba.createFeaturedUniverseNarrativeArcs(),
  dlcWoodruff.createFeaturedUniverseNarrativeArcs(),
  dlcHellraiser.createFeaturedUniverseNarrativeArcs(),
  dlcHellraiser.createFeaturedUniverseNarrativeArcs2(),
  dlcANightmareOnElmStreet.createFeaturedUniverseNarrativeArcs(),
  dlcTheRing.createFeaturedUniverseNarrativeArcs(),
  dlcTheGrudge.createFeaturedUniverseNarrativeArcs()
];

export const FEATURED_ENEMY_LORE = {
  Tomba: dlcTomba.createFeaturedEnemyLore({ localized }),
  Woodruff: dlcWoodruff.createFeaturedEnemyLore({ localized }),
  Hellraiser: dlcHellraiser.createFeaturedEnemyLore({ localized }),
  'A Nightmare on Elm Street': dlcANightmareOnElmStreet.createFeaturedEnemyLore({ localized }),
  'The Ring': dlcTheRing.createFeaturedEnemyLore({ localized }),
  'The Grudge': dlcTheGrudge.createFeaturedEnemyLore({ localized })
};

export const FEATURED_STAGE_LORE = {
  Tomba: dlcTomba.createFeaturedStageLore({ localized }),
  Woodruff: dlcWoodruff.createFeaturedStageLore({ localized }),
  Hellraiser: dlcHellraiser.createFeaturedStageLore({ localized }),
  'A Nightmare on Elm Street': dlcANightmareOnElmStreet.createFeaturedStageLore({ localized }),
  'The Ring': dlcTheRing.createFeaturedStageLore({ localized }),
  'The Grudge': dlcTheGrudge.createFeaturedStageLore({ localized })
};

export const FEATURED_GEAR_LORE = {
  tomba_grandfather_bracelet: dlcTomba.createFeaturedGearLore({ localized }),
  tomba_evil_pig_bag: dlcTomba.createFeaturedGearLore2({ localized }),
  tomba_charity_wings: dlcTomba.createFeaturedGearLore3({ localized }),
  woodruff_tobozon: dlcWoodruff.createFeaturedGearLore({ localized }),
  woodruff_viblefrotzer: dlcWoodruff.createFeaturedGearLore2({ localized }),
  woodruff_syllable_stone: dlcWoodruff.createFeaturedGearLore3({ localized }),
  cenobite_hook: dlcHellraiser.createFeaturedGearLore({ localized }),
  puzzle_piece: dlcHellraiser.createFeaturedGearLore2({ localized }),
  pillar_stone: dlcHellraiser.createFeaturedGearLore3({ localized }),
  hellraiser_2022_configuration: dlcHellraiser.createFeaturedGearLore4({ localized }),
  hellraiser_voight_nerve_mechanism: dlcHellraiser.createFeaturedGearLore5({ localized }),
  hellraiser_priest_pearl_pin: dlcHellraiser.createFeaturedGearLore6({ localized }),
  elm_glove_shard: dlcANightmareOnElmStreet.createFeaturedGearLore({ localized }),
  elm_nancy_trapkit: dlcANightmareOnElmStreet.createFeaturedGearLore2({ localized }),
  elm_hypnocil: dlcANightmareOnElmStreet.createFeaturedGearLore3({ localized }),
  ring_cursed_vhs: dlcTheRing.createFeaturedGearLore({ localized }),
  ring_distorted_photo: dlcTheRing.createFeaturedGearLore2({ localized }),
  ring_shelter_well_stone: dlcTheRing.createFeaturedGearLore3({ localized }),
  grudge_saeki_photo: dlcTheGrudge.createFeaturedGearLore({ localized }),
  grudge_case_recorder: dlcTheGrudge.createFeaturedGearLore2({ localized }),
  grudge_house_key: dlcTheGrudge.createFeaturedGearLore3({ localized })
};

export const FEATURED_UNIVERSE_ICONS = {
  Tomba: '/universe-icons/tomba-openai.png',
  Woodruff: '/universe-icons/woodruff-openai.png',
  Hellraiser: '/universe-icons/hellraiser-openai.png',
  'A Nightmare on Elm Street': '/universe-icons/a-nightmare-on-elm-street-openai.png',
  'The Ring': '/universe-icons/the-ring-openai.png',
  'The Grudge': '/universe-icons/the-grudge-openai.png'
};

export const FEATURED_BACKDROPS = {
  Tomba: dlcTomba.createFeaturedBackdrops(),
  Woodruff: dlcWoodruff.createFeaturedBackdrops(),
  Hellraiser: dlcHellraiser.createFeaturedBackdrops(),
  'A Nightmare on Elm Street': dlcANightmareOnElmStreet.createFeaturedBackdrops(),
  'The Ring': dlcTheRing.createFeaturedBackdrops(),
  'The Grudge': dlcTheGrudge.createFeaturedBackdrops()
};

const plaque = (originFr, originEn, breachFr, breachEn, doctrineFr, doctrineEn, tags = []) => ({
  origin: { fr: originFr, en: originEn },
  dossier: { fr: breachFr, en: breachEn },
  breachLore: { fr: breachFr, en: breachEn },
  doctrine: { fr: doctrineFr, en: doctrineEn },
  tags
});

export const FEATURED_CHARACTER_PLAQUES = {
  tomba_hero: dlcTomba.createFeaturedCharacterPlaques({ plaque }),
  charles_tomba: dlcTomba.createFeaturedCharacterPlaques2({ plaque }),
  tabby_tomba: dlcTomba.createFeaturedCharacterPlaques3({ plaque }),
  woodruff_hero: dlcWoodruff.createFeaturedCharacterPlaques({ plaque }),
  professor_azimuth: dlcWoodruff.createFeaturedCharacterPlaques2({ plaque }),
  master_boozook: dlcWoodruff.createFeaturedCharacterPlaques3({ plaque }),
  nancy_thompson: dlcANightmareOnElmStreet.createFeaturedCharacterPlaques({ plaque }),
  kristen_parker: dlcANightmareOnElmStreet.createFeaturedCharacterPlaques2({ plaque }),
  alice_johnson: dlcANightmareOnElmStreet.createFeaturedCharacterPlaques3({ plaque }),
  rachel_ring: dlcTheRing.createFeaturedCharacterPlaques({ plaque }),
  aiden_ring: dlcTheRing.createFeaturedCharacterPlaques2({ plaque }),
  noah_ring: dlcTheRing.createFeaturedCharacterPlaques3({ plaque }),
  karen_grudge: dlcTheGrudge.createFeaturedCharacterPlaques({ plaque }),
  detective_nakagawa: dlcTheGrudge.createFeaturedCharacterPlaques2({ plaque }),
  aubrey_grudge: dlcTheGrudge.createFeaturedCharacterPlaques3({ plaque })
};

const hellraiserShared = plaque(
  'Signature de l Ordre de l Entaille, liee au Labyrinthe de Leviathan et aux configurations de Lemarchand.',
  'Signature of the Order of the Gash, tied to Leviathans Labyrinth and Lemarchands configurations.',
  'La Breche ne transforme pas les Cenobites en monstres generiques: leurs chaines, rites et sentences restent soumis au pacte ouvert par la boite.',
  'The Breach does not turn Cenobites into generic monsters: their chains, rites, and sentences remain bound to the bargain opened by the box.',
  'Chaine de Labyrinthe, presence rituelle, lecture du desir et sentence cenobite.',
  'Labyrinth chain, ritual presence, desire reading, and Cenobite sentence.',
  ['Cenobite', 'Labyrinth', 'Leviathan']
);

Object.assign(FEATURED_CHARACTER_PLAQUES, {
  kirsty: plaque(
    'Kirsty Cotton ouvre puis manipule la Configuration des Lamentations pour survivre aux Cenobites, negocier la capture de Frank et comprendre que la boite est un seuil avec des regles.',
    'Kirsty Cotton opens and then manipulates the Lament Configuration to survive the Cenobites, bargain over Franks capture, and understand the box is a threshold with rules.',
    'A.R.C.A. lui confie la fermeture des seuils Hellraiser. Kirsty ne domine pas le Labyrinthe: elle observe le pacte, identifie la signature qui a echappe a sa sentence et retourne la configuration au moment precis.',
    'A.R.C.A. assigns her the closure of Hellraiser thresholds. Kirsty does not dominate the Labyrinth: she reads the bargain, identifies the signature escaping its sentence, and reverses the configuration at the exact moment.',
    'Manipulation de la boite, negociation, detournement des chaines et fermeture du seuil.',
    'Box manipulation, bargaining, chain redirection, and threshold closure.',
    ['Kirsty Cotton', 'Lament Configuration', 'bargain']
  ),
  female_cenobite: hellraiserShared,
  butterball: hellraiserShared,
  pinhead: hellraiserShared,
  pinhead_cenobite: hellraiserShared,
  chatterer: hellraiserShared,
  chatterer_cenobite: hellraiserShared,
  julia_cotton: plaque(
    'Julia Cotton nourrit la resurrection de Frank avec le sang de victimes attirees dans la maison. Son desir et sa trahison font delle un agent humain du Labyrinthe avant sa propre transformation.',
    'Julia Cotton feeds Franks resurrection with the blood of victims lured into the house. Her desire and betrayal make her a human agent of the Labyrinth before her own transformation.',
    'Dans la Breche, Julia exploite les seuils domestiques et les promesses personnelles. A.R.C.A. ne la classe pas comme Cenobite: elle reste une manipulatrice humaine dont chaque avantage exige un prix visible.',
    'Inside the Breach, Julia exploits domestic thresholds and personal promises. A.R.C.A. does not classify her as a Cenobite: she remains a human manipulator whose every advantage demands a visible price.',
    'Leurre, couteau, pacte de sang et trahison de seuil.',
    'Lure, knife, blood bargain, and threshold betrayal.',
    ['Julia Cotton', 'Frank Cotton', 'blood bargain']
  ),
  joey_summerskill: plaque(
    'Joey Summerskill est la journaliste de Hellraiser III qui enquete sur le pilier, les victimes et le retour de Pinhead avant de reunir ses moities humaine et cenobite.',
    'Joey Summerskill is the Hellraiser III reporter who investigates the pillar, its victims, and Pinheads return before reuniting his human and Cenobite halves.',
    'A.R.C.A. utilise ses enquetes pour distinguer Elliot Spencer du Hell Priest quand la Breche superpose leurs signatures. Joey collecte des preuves oniriques, protege la boite et empeche le Sans-Auteur de ne conserver que le monstre.',
    'A.R.C.A. uses her investigation to distinguish Elliot Spencer from the Hell Priest when the Breach overlaps their signatures. Joey collects dream evidence, protects the box, and stops the Authorless from preserving only the monster.',
    'Enquete, reve de guerre, protection de la boite et reunification de signature.',
    'Investigation, war dream, box protection, and signature reunification.',
    ['Joey Summerskill', 'Elliot Spencer', 'Hellraiser III']
  ),
  riley_mckendry: plaque(
    'Riley McKendry trouve la boite de Voight pendant quelle lutte contre une dependance et la perte de son frere Matt. Elle apprend que chaque nouvelle forme marque une victime et que la derniere configuration offre un choix dont le langage cache toujours un prix.',
    'Riley McKendry finds Voights box while struggling with addiction and the loss of her brother Matt. She learns that every new form marks a victim and that the final configuration offers a choice whose wording always hides a price.',
    'A.R.C.A. protege la distinction entre memoire, resurrection et reecriture. Riley conduit les porteurs marques a travers le manoir, retourne la lame contre Voight puis choisit Lament afin que le Sans-Auteur ne remplace pas son deuil par une copie docile.',
    'A.R.C.A. protects the distinction between memory, resurrection, and rewriting. Riley guides marked carriers through the mansion, turns the blade against Voight, then chooses Lament so the Authorless cannot replace her grief with a compliant copy.',
    'Lecture des six configurations, esquive des seuils, sauvetage des marques et choix de Lament.',
    'Six-configuration reading, threshold evasion, marked-target rescue, and the choice of Lament.',
    ['Riley McKendry', 'Hellraiser 2022', 'Lament']
  ),
  the_priest_2022: plaque(
    'La Pretresse de Hellraiser 2022 dirige un ordre distinct de celui du Hell Priest Elliot Spencer. Son quadrillage de fines incisions, ses epingles perlees et ses vetements anatomiques accompagnent les six configurations de la nouvelle boite.',
    'The Priest of Hellraiser 2022 leads an order distinct from Elliot Spencers Hell Priest. Her grid of fine incisions, pearl-headed pins, and anatomical vestments accompanies the new boxs six configurations.',
    'La Breche conserve les deux continuites sans fusionner leurs visages ni leurs sentences. La Pretresse suit la marque de la lame, expose le desir exact du porteur et ouvre une audience de Leviathan seulement quand la progression de la boite est complete.',
    'The Breach preserves both continuities without merging their faces or sentences. The Priest follows the blades mark, exposes the holders exact desire, and opens a Leviathan audience only when the boxs progression is complete.',
    'Chaines perlees, procession silencieuse, lecture du desir et audience de Leviathan.',
    'Pearled chains, silent procession, desire reading, and Leviathan audience.',
    ['The Priest', 'Hellraiser 2022', 'six configurations']
  )
});

export const FEATURED_BATTLE_ITEM_OVERRIDES = {
  Tomba: dlcTomba.createFeaturedBattleItemOverrides(),
  Woodruff: dlcWoodruff.createFeaturedBattleItemOverrides(),
  Hellraiser: dlcHellraiser.createFeaturedBattleItemOverrides(),
  'A Nightmare on Elm Street': dlcANightmareOnElmStreet.createFeaturedBattleItemOverrides(),
  'The Ring': dlcTheRing.createFeaturedBattleItemOverrides(),
  'The Grudge': dlcTheGrudge.createFeaturedBattleItemOverrides()
};
