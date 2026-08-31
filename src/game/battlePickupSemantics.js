const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const textValues = value => typeof value === 'string' ? [value] : Object.values(value || {}).filter(entry => typeof entry === 'string');

const neutralNotice = {
  fr: 'Effet de combat neutre : cet usage narratif ne dispose pas encore d une conversion fiable en soin, bouclier, charge ou degats. Aucun de ces bonus n est attribue automatiquement.',
  en: 'Neutral combat effect: this narrative use does not yet have a reliable healing, shield, charge or damage conversion. None of those bonuses is assigned automatically.'
};
const inferredNotice = {
  fr: 'Adaptation de combat deduite de l usage decrit de cet objet, et non de sa position dans le catalogue.',
  en: 'Combat adaptation inferred from this item described use, not from its catalogue position.'
};

// Authored identity rules. Values are game balance, not claims about franchise canon.
// Detection, keys, stun and relocation stay neutral until their own effects exist.
const identityRules = [
  ['Resident Evil', 'Herbe verte compacte', 'Compact Green Herb', 'defense', { heal: 46 }],
  ['Resident Evil', 'Grenade flash R.P.D.', 'R.P.D. Flash Grenade', 'neutral', {}],
  ['Resident Evil', 'Munitions incendiaires Umbrella', 'Umbrella Incendiary Rounds', 'offense', { damage: 34 }],
  ['Halo', 'Bulle de bouclier deployable', 'Deployable Bubble Shield', 'defense', { shield: 42 }],
  ['Halo', 'Grenade plasma Covenant', 'Covenant Plasma Grenade', 'offense', { damage: 34 }],
  ['Halo', 'Batterie de bouclier MJOLNIR', 'MJOLNIR Shield Cell', 'defense', { shield: 34 }],
  ['Silent Hill', 'Radio parasite', 'Static Radio', 'neutral', {}],
  ['Silent Hill', 'Ampoule de soin', 'Health Drink', 'defense', { heal: 46 }],
  ['Silent Hill', 'Carte griffonnee de South Vale', 'Marked South Vale Map', 'neutral', {}],
  ['Dino Crisis', 'Patch hemostatique SORT', 'SORT Hemostatic Patch', 'defense', { heal: 46 }],
  ['Dino Crisis', 'Key plug Third Energy', 'Third Energy Key Plug', 'neutral', {}],
  ['Dino Crisis', 'Dart tranquillisant', 'Tranquilizer Dart', 'neutral', {}],
  ['Stargate', 'Cellule au naquadah', 'Naquadah Cell', 'tempo', { charge: 32 }],
  ['Stargate', 'Balise GDO SGC', 'SGC GDO Beacon', 'defense', { shield: 30 }],
  ['Stargate', 'Drone Ancien', 'Ancient Drone', 'offense', { damage: 34 }],
  ['Half-Life', 'Batterie auxiliaire HEV', 'HEV Auxiliary Battery', 'defense', { shield: 34 }],
  ['Half-Life', 'Caisse Lambda', 'Lambda Crate', 'neutral', {}],
  ['Half-Life', 'Nid de snarks Xen', 'Xen Snark Nest', 'offense', { damage: 34 }],
  ['Portal', 'Cube de voyage', 'Companion Cube', 'defense', { shield: 34 }],
  ['Portal', 'Gel repulsif', 'Repulsion Gel', 'tempo', { charge: 28 }],
  ['Portal', 'Noyau PotatOS', 'PotatOS Core', 'tempo', { charge: 32, shield: 10 }],
  ['The Matrix', 'Programme esquive', 'Dodge Program', 'defense', { shield: 24 }],
  ['The Matrix', 'Code vert compile', 'Compiled Green Code', 'offense', { damage: 26 }],
  ['The Matrix', 'Telephone de sortie', 'Exit Phone', 'defense', { heal: 18 }],
  ['Buckethead', 'Mediator Pike', 'Pike Guitar Pick', 'offense', { damage: 26 }],
  ['Buckethead', 'Masque blanc resonant', 'Resonant White Mask', 'defense', { shield: 28 }],
  ['Buckethead', 'Bucket antenna', 'Bucket Antenna', 'tempo', { charge: 32 }],
  ['System of a Down', 'Mediator rupture tempo', 'Tempo Break Pick', 'neutral', {}],
  ['System of a Down', 'Banniere anti-guerre', 'Anti-War Protest Banner', 'defense', { shield: 34 }],
  ['System of a Down', 'Ampli Toxicity', 'Toxicity Feedback Amp', 'tempo', { charge: 32 }],
  ['Kaamelott', 'Etincelle d Excalibur', 'Excalibur Spark', 'offense', { damage: 26 }],
  ['Kaamelott', 'Dossier de Table Ronde', 'Round Table Dossier', 'neutral', {}],
  ['Kaamelott', 'Ration de Karadoc', 'Karadoc Ration', 'defense', { heal: 46 }],
  ['Breaking Bad', 'Fiole bleue instable', 'Unstable Blue Flask', 'offense', { damage: 34 }],
  ['Breaking Bad', 'Masque de labo', 'Lab Mask', 'defense', { shield: 28 }],
  ['Breaking Bad', 'Batterie improvisee', 'Improvised Battery', 'tempo', { charge: 32 }],
  ['Buffy the Vampire Slayer', 'Pieu beni', 'Blessed Stake', 'offense', { damage: 34 }],
  ['Buffy the Vampire Slayer', 'Grimoire Watcher', 'Watcher Grimoire', 'tempo', { charge: 32 }],
  ['Buffy the Vampire Slayer', 'Eau benite', 'Holy Water', 'defense', { shield: 28 }],
  ['Charmed', 'Potion Halliwell', 'Halliwell Potion', 'defense', { heal: 30, shield: 14 }],
  ['Charmed', 'Page du Livre des Ombres', 'Book of Shadows Page', 'tempo', { charge: 32 }],
  ['Charmed', 'Cristal de protection', 'Warding Crystal', 'defense', { shield: 34 }]
];
const rulesByIdentity = new Map(identityRules.flatMap(([universe, fr, en, role, effect]) => [fr, en].map(name => [`${normalize(universe)}:${normalize(name)}`, { role, effect }])));
const roleDefaults = { offense: { damage: 26 }, defense: { shield: 28 }, tempo: { charge: 28 }, neutral: {} };
const roleFromEffect = effect => effect.damage ? 'offense' : (effect.heal || effect.shield) ? 'defense' : effect.charge ? 'tempo' : 'neutral';
const result = (role, effect, effectSource) => ({ role, effect: { ...effect }, effectSource, effectNotice: role === 'neutral' ? { ...neutralNotice } : effectSource === 'inferred' ? { ...inferredNotice } : null });

export const normalizeBattlePickupDefinition = definition => {
  if (!Array.isArray(definition)) return { ...definition };
  const [fr, en, effectText, metadata = {}] = definition;
  return { ...metadata, name: { fr, en }, desc: typeof effectText === 'string' ? { fr: effectText, en: effectText } : effectText };
};

export const findBattlePickupSource = (definition, loreItems = []) => {
  if (definition.sourceItemId) return loreItems.find(item => item?.id === definition.sourceItemId) || null;
  const names = new Set(textValues(definition.name).map(normalize).filter(Boolean));
  return loreItems.find(item => item && textValues(item.name).some(name => names.has(normalize(name)))) || null;
};

export const resolveBattlePickupSemantics = item => {
  const role = Object.hasOwn(roleDefaults, item?.role) ? item.role : null;
  if (item?.effect && typeof item.effect === 'object' && !Array.isArray(item.effect)) {
    return result(role || roleFromEffect(item.effect), item.effect, 'authored-effect');
  }
  if (role) return result(role, roleDefaults[role], 'authored-role');
  for (const name of textValues(item?.name)) {
    const rule = rulesByIdentity.get(`${normalize(item?.universe)}:${normalize(name)}`);
    if (rule) return result(rule.role, rule.effect, 'identity');
  }

  const names = normalize(textValues(item?.name).join(' '));
  const description = normalize(textValues(item?.desc).join(' '));
  // Do not turn narrative detection/control tools or negated effects into damage.
  if (/\b(flash|tranquillis|tranquiliz|radio|carte|map|key|cle|photograph|journal)\w*\b/.test(names)
    || /\b(ne|pas|not|without|sans)\b.{0,24}\b(soin|soigne|heal|degats|damage|recharge)\b/.test(description)) {
    return result('neutral', {}, 'unresolved');
  }
  const heal = /\b(soin|soins|herbe verte|green herb|health drink|first aid|medicomp|hemostatique|hemostatic|medkit)\b/.test(names)
    || /\b(soigne|soignent|heals|healing|restaure la sante|restores health)\b/.test(description);
  const shield = /\b(bouclier|shield|warding|armure|armor|armour|protection)\b/.test(names)
    || /\b(absorbe|absorbs)\b.{0,30}\b(degats|damage)\b/.test(description);
  const charge = /\b(batterie|battery|cadence core|tempo core|noyau de cadence|cellule au naquadah)\b/.test(names)
    || /\b(recharge speciale|charge speciale|special charge|recharges? (une |an? )?(action|special)|accelere le tempo)\b/.test(description);
  const damage = /\b(grenade|bomb|bombe|munitions|rounds|explosif|explosive|spiked ball|boule epinee|rifle|fusil|lame|epee|sword|knife|dagger|pieu|stake)\b/.test(names)
    || /\b(inflige|inflicts|deals)\b.{0,30}\b(degats|damage)\b/.test(description);
  const categories = Number(heal || shield) + Number(charge) + Number(damage);
  if (categories !== 1) return result('neutral', {}, 'unresolved');
  if (heal || shield) return result('defense', { ...(heal ? { heal: 42 } : {}), ...(shield ? { shield: 28 } : {}) }, 'inferred');
  return damage ? result('offense', { damage: 26 }, 'inferred') : result('tempo', { charge: 28 }, 'inferred');
};

export const withBattlePickupEffectNotice = (description, notice) => {
  const value = typeof description === 'string' ? { fr: description, en: description } : { ...description };
  if (!notice) return value;
  return Object.fromEntries(['fr', 'en'].map(lang => [lang, [value[lang] || value.fr || value.en, notice[lang]].filter(Boolean).join(' ')]));
};
