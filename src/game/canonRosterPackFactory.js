const RESEARCH_DATE = '2026-08-12';

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const lore = (fr, en) => Object.freeze({ fr, en });

const ROLE_STATS = Object.freeze({
  marine: Object.freeze({ hp: 130, atk: 10, def: 8, spd: 4 }),
  horror: Object.freeze({ hp: 115, atk: 11, def: 7, spd: 5 }),
  slayer: Object.freeze({ hp: 105, atk: 14, def: 5, spd: 6 }),
  hacker: Object.freeze({ hp: 100, atk: 12, def: 6, spd: 6 }),
  tactical: Object.freeze({ hp: 120, atk: 11, def: 7, spd: 4 }),
  trial: Object.freeze({ hp: 100, atk: 0, def: 8, spd: 5 })
});

const move = (value, defaults) => Object.freeze(
  typeof value === 'object' && value !== null
    ? { ...defaults, ...value }
    : { ...defaults, name: value }
);

const fidelity = (pack, visualAnchor, authoredLore, canonStatus, extra = {}) => Object.freeze({
  referenceUrl: pack.referenceUrl,
  visualAnchor,
  canonStatus,
  lore: authoredLore,
  ...extra
});

const normalizeDefinition = (value, index, fallbackPrefix) => (
  typeof value === 'string'
    ? { id: slugify(value).replace(/-/g, '_'), name: value }
    : { id: `${fallbackPrefix}_${index + 1}`, ...value }
);

const makeHero = (pack, rawDefinition, index) => {
  const definition = normalizeDefinition(rawDefinition, index, 'hero');
  const name = definition.name;
  const id = definition.runtimeId || `${pack.key}_${definition.id}`;
  const nonCombat = pack.allNonCombat === true || definition.nonCombat === true;
  const visualAnchor = definition.visualAnchor
    || `${name}, preserving the canonical silhouette, palette, outfit and signature prop from the locked continuity.`;
  const common = {
    output: `/sprites/generated/heroes/${slugify(pack.universe)}/${slugify(id)}.png`,
    spritePrompt: nonCombat
      ? `Original fan-made pixel-art environmental Trial sheet. ${name}. Preserve: ${visualAnchor} Four readable objective states; no combat pose, weapon, opponent, UI, text, logo, copied official artwork or actor likeness.`
      : `Original fan-made pixel-art sprite sheet, three-quarter RPG view. ${name}. Preserve: ${visualAnchor} No text, logo, UI, copied official artwork, actor likeness or cross-franchise redesign.`,
    ...(definition.prohibitedConcepts ? { prohibitedConcepts: Object.freeze([...definition.prohibitedConcepts]) } : {})
  };

  if (nonCombat) {
    return Object.freeze([id, name, 'trial', fidelity(
      pack,
      visualAnchor,
      lore(definition.fr || `${name} progresse uniquement par interaction et résolution d'objectif.`, definition.en || `${name} progresses only through interaction and objective solving.`),
      definition.canonStatus || 'canon non-combat participant',
      {
        ...common,
        nonCombat: true,
        trialType: definition.trialType || 'Trial',
        entityType: definition.entityType || 'non-combat-character-trial',
        objective: definition.objective || `Complete ${name}'s objective without attacking anyone.`,
        objectiveFr: definition.objectiveFr || `Terminer l'objectif de ${name} sans attaquer personne.`,
        victoryCondition: definition.victoryCondition || `complete-${slugify(id)}-objective`
      }
    )]);
  }

  const role = definition.role || 'tactical';
  const weapon = definition.weapon || `${name} signature action`;
  const weaponType = definition.weaponType || 'improvised';
  return Object.freeze([id, name, role, fidelity(
    pack,
    visualAnchor,
    lore(definition.fr || `${name} rejoint la brèche selon son rôle canonique.`, definition.en || `${name} enters the breach in the canonical role.`),
    definition.canonStatus || 'canon protagonist or allied avatar',
    {
      ...common,
      weapon,
      weaponType,
      stats: Object.freeze({ ...(definition.stats || ROLE_STATS[role] || ROLE_STATS.tactical) }),
      simple: move(definition.simple || weapon, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'magic' ? 'energy' : 'melee', dmg: 1.0 }),
      secondary: move(definition.secondary || `${name} signature technique`, { type: 'signature', cd: 7, dmg: 1.8 }),
      defense: move(definition.defense || `${name} defensive action`, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
      special: move(definition.special || `${name} decisive action`, { type: 'origin_aoe', dmg: 4.0 })
    }
  )]);
};

const makeThreat = (pack, rawDefinition, index, kind) => {
  const definition = normalizeDefinition(rawDefinition, index, kind);
  const name = definition.name;
  const nonCombat = pack.allNonCombat === true || definition.nonCombat === true;
  const visualAnchor = definition.visualAnchor
    || `${name}, preserving the canonical silhouette, material language, palette and encounter context from the locked continuity.`;
  const common = {
    id: `${pack.key}_${definition.id}`,
    name,
    output: `/sprites/generated/bosses/${slugify(pack.universe)}/${slugify(name)}.png`,
    spritePrompt: nonCombat
      ? `Original fan-made pixel-art environmental Trial sheet. ${name}. Preserve: ${visualAnchor} Four readable objective states; no humanoid opponent, combat pose, health bar, UI, text, logo or copied official artwork.`
      : `Original fan-made pixel-art sprite sheet, three-quarter RPG view. ${name}. Preserve: ${visualAnchor} No text, logo, UI, copied official artwork, actor likeness, gore or unrelated redesign.`,
    ...(definition.prohibitedConcepts ? { prohibitedConcepts: Object.freeze([...definition.prohibitedConcepts]) } : {})
  };

  if (nonCombat) {
    return Object.freeze({
      ...common,
      ...fidelity(pack, visualAnchor, lore(
        definition.fr || `${name} est une épreuve objective, jamais une cible vivante.`,
        definition.en || `${name} is an objective Trial, never a living target.`
      ), definition.canonStatus || 'canon objective represented as a non-combat Trial'),
      nonCombat: true,
      trialType: definition.trialType || 'Trial',
      objective: definition.objective || `Resolve ${name} through timing, navigation, investigation or interaction.`,
      objectiveFr: definition.objectiveFr || `Résoudre ${name} par le rythme, l'orientation, l'enquête ou l'interaction.`,
      victoryCondition: definition.victoryCondition || `resolve-${slugify(pack.key)}-${slugify(definition.id)}`
    });
  }

  const weapon = definition.weapon || `${name} canonical attack`;
  const special = definition.special || `${name} encounter escalation`;
  return Object.freeze({
    ...common,
    weapon,
    special,
    phases: Object.freeze(definition.phases || [`Uses ${weapon}`, `Escalates with ${special}`]),
    ...fidelity(pack, visualAnchor, lore(
      definition.fr || `${name} conserve son rôle d'adversaire dans la continuité verrouillée.`,
      definition.en || `${name} keeps the adversarial role from the locked continuity.`
    ), definition.canonStatus || `canon ${kind}`)
  });
};

const makeGear = (pack, rawDefinition, index) => {
  const definition = normalizeDefinition(rawDefinition, index, 'gear');
  const name = definition.name;
  const frName = definition.frName || name;
  const visualAnchor = definition.visualAnchor
    || `${name}, an original isolated pixel-art prop preserving its canonical shape, material and palette.`;
  return Object.freeze([
    `${pack.key}_${definition.id}`,
    name,
    frName,
    Object.freeze({ ...(definition.boost || { atk: index === 0 ? 4 : 2, def: index === 1 ? 4 : 2, spd: index === 2 ? 2 : 1 }) }),
    fidelity(pack, visualAnchor, lore(
      definition.fr || `${frName} conserve sa fonction canonique.`,
      definition.en || `${name} preserves its canonical function.`
    ), definition.canonStatus || 'canon prop', {
      output: `/sprites/generated/gear/${slugify(pack.universe)}/${pack.key}_${definition.id}.png`
    })
  ]);
};

const makeStage = (pack, rawStage, index) => {
  const definition = typeof rawStage === 'string' ? { name: rawStage } : rawStage;
  const name = definition.name;
  const nonCombat = pack.allNonCombat === true || definition.nonCombat === true;
  return Object.freeze([
    nonCombat ? 'Trial' : (definition.mode || pack.mode),
    name,
    definition.difficulty || pack.difficulty,
    definition.final || (index === 1 ? pack.bosses[2].name : pack.worldBoss.name),
    Object.freeze({
      referenceUrl: pack.referenceUrl,
      visualAnchor: definition.visualAnchor || `${name}, rebuilt as original game-ready pixel art from the locked continuity without copied key art.`,
      canonStatus: definition.canonStatus || 'canon location or canon-inspired objective route',
      lore: lore(definition.fr || `${name} structure l'épreuve de cette brèche.`, definition.en || `${name} structures this breach challenge.`),
      objective: definition.objective || (nonCombat ? `Complete ${name} without combat.` : `Reach and clear ${name}.`),
      ...(definition.stageObjectiveOverride ? {
        stageObjectiveOverride: true,
        nonCombatTrial: definition.nonCombatTrial
      } : {}),
      ...(nonCombat ? { nonCombat: true, trialType: definition.trialType || 'Trial' } : {})
    })
  ]);
};

export const defineCanonRosterPack = rawPack => {
  const pack = {
    mediaType: 'video-game',
    faction: 'multiverse',
    mode: 'RPG',
    difficulty: 'Hard',
    colors: ['#243247', '#080b11', '#61d8ff'],
    motif: 'breach',
    aliases: [],
    canonStatus: 'canon continuity with original fan-made project art',
    ...rawPack
  };

  if (!/^https:\/\//.test(pack.referenceUrl || '')) throw new Error(`${pack.universe}: HTTPS referenceUrl required.`);
  for (const field of ['key', 'universe', 'continuity', 'adaptationRule', 'visualAnchor']) {
    if (!String(pack[field] || '').trim()) throw new Error(`${pack.universe || pack.key}: ${field} required.`);
  }
  for (const [field, count] of [['heroes', 3], ['enemies', 3], ['bosses', 3], ['gear', 3], ['stages', 3]]) {
    if (!Array.isArray(pack[field]) || pack[field].length !== count) throw new Error(`${pack.universe}: exactly ${count} ${field} required.`);
  }
  if (!pack.worldBoss) throw new Error(`${pack.universe}: worldBoss required.`);

  const characters = pack.heroes.map((definition, index) => makeHero(pack, definition, index));
  const monsters = pack.enemies.map((definition, index) => makeThreat(pack, definition, index, 'enemy'));
  const bosses = pack.bosses.map((definition, index) => makeThreat(pack, definition, index, 'boss'));
  const worldBoss = makeThreat(pack, pack.worldBoss, 0, 'worldBoss');
  const gear = pack.gear.map((definition, index) => makeGear(pack, definition, index));
  const stages = pack.stages.map((definition, index) => makeStage({ ...pack, bosses, worldBoss }, definition, index));
  const eventName = pack.event?.name || `${pack.universe} Breach Event`;
  const eventFrName = pack.event?.frName || `Événement ${pack.universe}`;
  const eventId = pack.event?.id || 'breach_event';
  const eventAnchor = pack.event?.visualAnchor || `${eventName}, an original environmental event image grounded in ${pack.visualAnchor}`;
  const desc = lore(
    pack.descFr || `${pack.universe} rejoint la brèche dans sa continuité verrouillée.`,
    pack.descEn || `${pack.universe} enters the breach in its locked continuity.`
  );

  return Object.freeze({
    key: pack.key,
    universe: pack.universe,
    aliases: Object.freeze([...pack.aliases]),
    title: pack.title || pack.universe,
    titleFr: pack.titleFr || pack.universe,
    mediaType: pack.mediaType,
    faction: pack.faction,
    mode: pack.allNonCombat === true ? 'Trial' : pack.mode,
    difficulty: pack.difficulty,
    colors: Object.freeze([...pack.colors]),
    motif: pack.motif,
    theme: pack.theme || pack.continuity,
    continuity: pack.continuity,
    researchDate: RESEARCH_DATE,
    referenceUrl: pack.referenceUrl,
    referenceUrls: Object.freeze([...(pack.referenceUrls || [pack.referenceUrl])]),
    visualAnchor: pack.visualAnchor,
    canonStatus: pack.canonStatus,
    lore: desc,
    desc,
    canonProfile: Object.freeze({ continuity: pack.continuity, adaptationRule: pack.adaptationRule }),
    fidelityNotes: pack.adaptationRule,
    hero: characters[0],
    allies: Object.freeze(characters.slice(1)),
    monsters: Object.freeze(monsters),
    bosses: Object.freeze(bosses),
    boss: bosses[2].name,
    worldBoss,
    stage: pack.stages[0].name || pack.stages[0],
    stageMeta: stages[0][4],
    stageVariants: Object.freeze(stages.slice(1)),
    gear: Object.freeze(gear),
    event: Object.freeze([
      `evt_${pack.key}_${eventId}`,
      eventName,
      eventFrName,
      pack.event?.en || `A canon-grounded ${pack.universe} breach changes the active route.`,
      pack.event?.fr || `Une brèche fidèle à ${pack.universe} modifie la route active.`,
      fidelity(pack, eventAnchor, lore(
        pack.event?.fr || `Une brèche fidèle à ${pack.universe} modifie la route active.`,
        pack.event?.en || `A canon-grounded ${pack.universe} breach changes the active route.`
      ), pack.event?.canonStatus || 'canon-inspired event')
    ])
  });
};

export const freezeCanonRosterPart = packs => Object.freeze(packs.map(defineCanonRosterPack));

export const compactCanonRosterPack = (
  [key, universe, referenceUrl, heroes, enemies, bosses, worldBoss, gear, stages, options = {}]
) => ({
  key,
  universe,
  referenceUrl,
  referenceUrls: options.refs || [referenceUrl],
  aliases: options.aliases || [],
  continuity: options.continuity || `${universe} primary continuity`,
  adaptationRule: options.rule || `Preserve ${universe}'s official silhouettes, roles, palette and encounter logic. Create original fan-made project art; never copy official art, logos or UI.`,
  visualAnchor: options.anchor || `${universe}'s canonical locations, palette, costumes, creatures and props, translated into original game-ready pixel art.`,
  canonStatus: options.status || 'canon-grounded roster with original fan-made project art',
  mediaType: options.mediaType || 'video-game',
  faction: options.faction || 'multiverse',
  mode: options.mode || 'RPG',
  difficulty: options.difficulty || 'Hard',
  colors: options.colors || ['#243247', '#080b11', '#61d8ff'],
  motif: options.motif || 'breach',
  allNonCombat: options.allNonCombat === true,
  heroes,
  enemies,
  bosses,
  worldBoss,
  gear,
  stages,
  event: options.event || { id: 'breach_event', name: `${universe} Breach Event`, frName: `Événement ${universe}` }
});

export const freezeCompactCanonRosterPart = rows => freezeCanonRosterPart(rows.map(compactCanonRosterPack));
