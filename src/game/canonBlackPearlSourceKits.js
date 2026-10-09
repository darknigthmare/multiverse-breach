// Playable incarnations from the 2003 film. These profiles replace generated
// class powers; damage, cooldowns and distances remain combat adaptations.
export const BLACK_PEARL_FILM_INCARNATION = 'Pirates of the Caribbean: The Curse of the Black Pearl (2003)';
export const BLACK_PEARL_JACK_INCARNATION = `${BLACK_PEARL_FILM_INCARNATION} - Captain Jack Sparrow`;
export const BLACK_PEARL_SOURCE_UNIVERSE = 'Pirates of the Caribbean';
export const BLACK_PEARL_SOURCE_REFERENCES = Object.freeze([
  'https://movies.disney.com/pirates-of-the-caribbean-the-curse-of-the-black-pearl',
  'https://d23.com/a-to-z/pirates-of-the-caribbean-the-curse-of-the-black-pearl-film/',
  'https://en.wikipedia.org/wiki/Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl'
]);

const ACTION_KEYS = ['simple', 'secondary', 'defense', 'special'];
const ADAPTATION = 'Physical source action translated into numerical game damage. Targeting distance, cooldown and choreography are combat adaptations.';
const contact = (name, dmg = 1, extra = {}) => ({
  name, type: 'melee', dmg,
  attackProfile: { shape: 'single', delivery: 'melee' },
  tacticsProfile: { range: 1, shape: 'single', maxTargets: 1 },
  smashProfile: { range: 70, verticalRange: 35, shape: 'single', maxTargets: 1, delivery: 'melee' },
  canonPresentation: { kind: 'melee' }, canonStatus: ADAPTATION, ...extra
});
const sidestep = name => ({ name, type: 'dodge', dur: 2, reduce: 0.75,
  canonStatus: 'Physical evasion translated into timed game damage reduction; no magical barrier.' });
const lock = details => ({
  ...details,
  canonCombatPresentation: true,
  referenceUrl: BLACK_PEARL_SOURCE_REFERENCES[0],
  referenceUrls: [...BLACK_PEARL_SOURCE_REFERENCES, ...(details.additionalReferences || [])],
  canonStatus: '2003 source identity and equipment locked; numerical combat and choreography are game adaptations, not visual fidelity approval.',
  sourceReviewStatus: 'reference-supported; exact scene choreography review pending',
  visualReviewStatus: 'pending',
  mechanicsReviewStatus: 'Source weapons replace class powers; numerical damage and reusable combat sequences remain adaptations.'
});

export const CANON_BLACK_PEARL_SOURCE_KITS = Object.freeze({
  jack_sparrow_potc: lock({
    incarnation: BLACK_PEARL_JACK_INCARNATION,
    additionalReferences: ['https://en.wikipedia.org/wiki/Jack_Sparrow',
      'https://en.wikiquote.org/wiki/Pirates_of_the_Caribbean:_The_Curse_of_the_Black_Pearl'],
    sourceAmmunition: {
      id: 'jack-2003-reserved-flintlock-shot', maxShots: 1, actionIds: ['secondary'],
      resetPolicy: 'new-battle',
      adaptation: 'One shot per new game battle. The film reserves this pistol shot for Barbossa; resetting the reserve in a new crossover battle is a game adaptation.'
    },
    equipment: ['Pirate Sword', 'Flintlock Pistol', 'Jack s Compass'],
    sourceAbilities: ['Swordplay', 'Roguish Feints', 'Reserved Flintlock Shot'],
    weapon: 'sword', weaponType: 'sword', weaponColor: '#b8b4a8',
    primaryColor: '#655044', secondaryColor: '#a43128',
    visualAnchor: 'Captain Jack Sparrow in The Curse of the Black Pearl (2003): red bandanna, worn brown tricorn, dark beaded hair and braided beard, loose cream shirt, dark waistcoat and worn coat, sash and belts. Pirate sword and flintlock pistol. His compass is a non-offensive prop; no automatic enemy locator or compass attack. Costume and existing sprite review remain pending.',
    simple: contact('Pirate Sword Cut'),
    secondary: {
      name: 'Reserved Flintlock Pistol Shot', type: 'bullet', cd: 8, dmg: 2.2, color: '#edc48b',
      attackProfile: { shape: 'single', delivery: 'ranged' },
      tacticsProfile: { range: 4, shape: 'single', maxTargets: 1 },
      smashProfile: { range: 300, verticalRange: 35, shape: 'single', maxTargets: 1, delivery: 'ranged' },
      canonPresentation: { kind: 'flintlock', color: '#edc48b' },
      canonStatus: 'The film pistol holds the shot reserved for Barbossa. Numerical damage, four-cell/300-pixel reach and cooldown are combat adaptations.'
    },
    defense: sidestep('Roguish Swordfight Sidestep'),
    special: contact('Black Pearl Swordfight Feint', 4.5),
    loreLocalized: {
      fr: 'Ce Jack Sparrow vient de La Malédiction du Black Pearl (2003). Barbossa lui a pris son navire ; Jack aide Will à retrouver Elizabeth. Son épée, ses feintes et son pistolet à silex remplacent les pouvoirs de classe. Il réserve une balle à Barbossa, tandis que sa boussole reste un accessoire sans attaque ni repérage automatique. Dans la scène source finale, Will restitue les dernières pièces avec les offrandes de sa lignée et de Jack au moment du tir ; ces assistants sont distincts des versions jouables. Le kit garde un seul tir par bataille ; son rétablissement dans une nouvelle bataille, les dégâts et les enchaînements sont adaptés au jeu.',
      en: 'This Jack Sparrow comes from The Curse of the Black Pearl (2003). Barbossa stole his ship; Jack helps Will find Elizabeth. His sword, feints and flintlock pistol replace generated class powers. He reserves one shot for Barbossa, while his compass remains a prop without an attack or automatic enemy tracking. In the source finale, Will returns the final coins with offerings from his lineage and Jack as the shot lands; those assistants are separate from playable versions. The kit keeps one shot per battle; restoring it in a new battle, damage and sequences are game adaptations.'
    }
  }),
  will_turner_potc: lock({
    incarnation: `${BLACK_PEARL_FILM_INCARNATION} - Will Turner, Port Royal blacksmith`,
    additionalReferences: ['https://en.wikipedia.org/wiki/Will_Turner'],
    equipment: ['Forged Sword', 'Blacksmith Work Clothes'],
    sourceAbilities: ['Swordsmanship', 'Sword Forging', 'Physical Parry'],
    weapon: 'sword', weaponType: 'sword', weaponColor: '#b8b6ae',
    primaryColor: '#67554b', secondaryColor: '#e8dec4',
    visualAnchor: 'Will Turner in The Curse of the Black Pearl (2003), the human Port Royal blacksmith: dark shoulder-length hair tied back, cream shirt, brown waistcoat, dark breeches and boots. A forged sword and ordinary human anatomy. No Flying Dutchman captain costume, barnacles, later-film resurrection scars or supernatural blade. Exact selected-scene costume review remains pending.',
    simple: contact('Forged Sword Cut'),
    secondary: contact('Blacksmith Swordfight Riposte', 2.2, { cd: 8 }),
    defense: { name: 'Sword Parry', type: 'shield', dur: 2, reduce: 0.75,
      canonStatus: 'An ordinary physical sword parry translated into game damage reduction; no magical shield.' },
    special: contact('Port Royal Swordfight Counter', 4.5),
    loreLocalized: {
      fr: 'Will Turner est le jeune forgeron de Port Royal dans le film de 2003. Il fabrique des épées, pratique l’escrime et s’allie à Jack pour sauver Elizabeth. Il est le fils de Bootstrap Bill Turner, dont la lignée compte pour la levée de la malédiction. Son kit emploie uniquement l’épée, la parade et la riposte physiques ; il n’est pas le capitaine surnaturel du Hollandais volant des suites. Les valeurs de dégâts, la réduction de la parade et les enchaînements sont des adaptations de combat.',
      en: 'Will Turner is the young Port Royal blacksmith in the 2003 film. He makes swords, practices swordsmanship and joins Jack to rescue Elizabeth. He is Bootstrap Bill Turner’s son, whose lineage matters when lifting the curse. His kit uses physical sword cuts, parries and ripostes; this is not the supernatural Flying Dutchman captain from later films. Damage values, parry reduction and combat sequences are game adaptations.'
    }
  }),
  elizabeth_swann_potc: lock({
    incarnation: `${BLACK_PEARL_FILM_INCARNATION} - Elizabeth Swann, Black Pearl captive`,
    additionalReferences: ['https://en.wikipedia.org/wiki/Elizabeth_Swann', 'https://imsdb.com/scripts/Pirates-of-the-Caribbean.html'],
    equipment: ['Borrowed Table Knife', '2003 Captive Dress'],
    sourceProps: ['Aztec Medallion, story prop initially taken from Will; not a weapon'],
    sourceAbilities: ['Improvised Self-Defense', 'Parley', 'Physical Escape'],
    weapon: 'knife', weaponType: 'knife', weaponColor: '#b8b6ae',
    primaryColor: '#842b35', secondaryColor: '#e8dcc5',
    visualAnchor: 'Elizabeth Swann in The Curse of the Black Pearl (2003), the captive dinner scene aboard the Black Pearl: long brown hair, burgundy period dress with cream trim and ordinary human anatomy. A borrowed table knife is an improvised escape prop, not a swordfighter arsenal. The Aztec medallion belongs to her earlier story and is not an offensive power or a claim it remains around her neck in this scene. No Pirate King costume from At World s End. Existing costume artwork remains unapproved.',
    simple: contact('Borrowed Table Knife Thrust'),
    secondary: contact('Improvised Escape Strike', 2.2, { cd: 8 }),
    defense: sidestep('Captive Escape Sidestep'),
    special: contact('Black Pearl Escape Feint', 4.5),
    loreLocalized: {
      fr: 'Elizabeth Swann est la fille du gouverneur de Port Royal dans La Malédiction du Black Pearl (2003). Enfant, elle a pris le médaillon à Will pour dissimuler son lien apparent avec les pirates ; Barbossa le confisque après sa capture. Son recours au droit de pourparlers et son sauvetage structurent le récit. À bord du Black Pearl, elle tente de se défendre avec un couteau de table ; elle n’a ni pouvoirs du médaillon ni arsenal de roi des pirates des suites. Le couteau et les esquives deviennent des actions de jeu : les frappes répétées, les dégâts et la feinte spéciale sont des adaptations, pas une chorégraphie certifiée du film. Son sang ne remplace pas la lignée de Bootstrap Bill pour lever la malédiction.',
      en: 'Elizabeth Swann is the Port Royal governor’s daughter in The Curse of the Black Pearl (2003). As a child she took Will’s medallion to hide his apparent pirate connection; Barbossa confiscates it after her capture. Her invocation of parley and rescue structure the story. Aboard the Black Pearl she attempts self-defense with a table knife; she has neither medallion powers nor the later films’ Pirate King arsenal. The knife and evasions become game actions: repeated strikes, damage and the special feint are adaptations rather than certified film choreography. Her blood does not replace Bootstrap Bill’s lineage when lifting the curse.'
    }
  })
});

export const CANON_BLACK_PEARL_SOURCE_KIT_IDS = Object.freeze(Object.keys(CANON_BLACK_PEARL_SOURCE_KITS));

export function applyCanonBlackPearlSourceKit(hero) {
  const source = Object.hasOwn(CANON_BLACK_PEARL_SOURCE_KITS, hero?.id)
    && (!hero.universe || hero.universe === BLACK_PEARL_SOURCE_UNIVERSE)
    ? CANON_BLACK_PEARL_SOURCE_KITS[hero.id] : null;
  if (!source) return hero;
  const result = {
    ...hero, ...source,
    referenceUrls: [...source.referenceUrls], equipment: [...source.equipment],
    sourceAbilities: [...source.sourceAbilities], loreLocalized: { ...source.loreLocalized },
    ...(source.sourceProps ? { sourceProps: [...source.sourceProps] } : {}),
    ...(source.sourceAmmunition ? { sourceAmmunition: {
      ...source.sourceAmmunition, actionIds: [...source.sourceAmmunition.actionIds]
    } } : {})
  };
  for (const key of ACTION_KEYS) {
    const action = { ...hero[key], ...source[key] };
    // Existing saves and authored balance retain every numerical resource.
    for (const [number, value] of Object.entries(hero[key] || {})) {
      if (typeof value === 'number') action[number] = value;
    }
    for (const profile of ['attackProfile', 'tacticsProfile', 'smashProfile', 'canonPresentation']) {
      if (action[profile]) action[profile] = { ...action[profile] };
    }
    result[key] = action;
  }
  return result;
}

export function getBlackPearlSourceAmmunition(actor, actionType) {
  const sourceId = String(actor?.sourceId || actor?.id || '')
    .replace(/^(?:p2|cpu-custom):/, '').replace(/:\d+$/, '');
  if (sourceId !== 'jack_sparrow_potc'
    || actor?.incarnation !== BLACK_PEARL_JACK_INCARNATION
    || actor?.canonCombatPresentation !== true
    || actor.universe !== BLACK_PEARL_SOURCE_UNIVERSE) return null;
  const policy = CANON_BLACK_PEARL_SOURCE_KITS.jack_sparrow_potc.sourceAmmunition;
  if (actionType && !policy.actionIds.includes(actionType)) return null;
  return { ...policy, actionIds: [...policy.actionIds] };
}

export function getCanonBlackPearlSourcePlaque(hero) {
  const source = Object.hasOwn(CANON_BLACK_PEARL_SOURCE_KITS, hero?.id)
    && (!hero.universe || hero.universe === BLACK_PEARL_SOURCE_UNIVERSE)
    ? CANON_BLACK_PEARL_SOURCE_KITS[hero.id] : null;
  if (!source) return null;
  return {
    origin: { fr: source.incarnation, en: source.incarnation },
    dossier: { ...source.loreLocalized },
    doctrine: {
      fr: `${source.equipment.join(', ')}. Les valeurs et enchaînements sont adaptés au jeu ; revue visuelle en attente.${source.sourceAmmunition ? ' Un seul tir par bataille ; la réserve est rétablie uniquement à la création d’une nouvelle bataille, adaptation du jeu.' : ''}`,
      en: `${source.equipment.join(', ')}. Values and sequences adapt the source to combat; visual review remains pending.${source.sourceAmmunition ? ' One shot per battle; the reserve resets only when creating a new battle, a game adaptation.' : ''}`
    }
  };
}
