/**
 * Immutable contracts for the standalone CG gallery.
 *
 * A CG is display-only. Its unlock gate deliberately reads unlockedHeroes and
 * never inventory, equipped cosmetics or owned skins.
 */

export const CG_TYPES = Object.freeze([
  'characterSolo',
  'weaponSolo',
  'decorSolo',
  'coherentScene',
  'actionScene',
  'introPose',
  'victoryPose',
  'defeatPose',
  'beachFamily',
  'maidService',
  'affection',
  'goofy',
  'alignmentSwap',
  'genderSwap',
  'iconicOutfitSwap',
  'zombieVersion',
  'futureExperienced',
  'firstStep',
  'furryHuman'
]);

export const CG_FAMILIES = Object.freeze([
  'Canon',
  'Nexus',
  'Fan Art',
  'What If'
]);

export const CG_CANON_STATUSES = Object.freeze([
  'project-canon',
  'canon-inspired',
  'nexus-variant',
  'fan-art',
  'what-if'
]);

export const CG_CONTENT_RATINGS = Object.freeze([
  'family',
  'teen',
  'adultNonExplicit'
]);

export const CG_AGE_STATUSES = Object.freeze([
  'not-required',
  'adult-confirmed',
  'unknown-family-safe-only'
]);

export const CG_CONSENT_STATUSES = Object.freeze([
  'not-required',
  'no-romance',
  'family-safe-friendly',
  'adult-consensual-romance'
]);

export const CG_RARITIES = Object.freeze([
  'stable',
  'rare',
  'epic',
  'anomaly'
]);

export const CG_RIGHTS_CLASSES = Object.freeze([
  'project-original',
  'unofficial-fan-art'
]);

export const CG_UNLOCK_TYPES = Object.freeze(['heroOwned']);

export const CG_PRODUCTION_FILE_BASENAMES = Object.freeze({
  characterSolo: 'character-solo-openai-v1',
  weaponSolo: 'signature-weapon-openai-v1',
  decorSolo: 'decor-openai-v1',
  coherentScene: 'coherent-scene-openai-v1',
  actionScene: 'action-scene-openai-v1',
  introPose: 'intro-pose-openai-v1',
  victoryPose: 'victory-pose-openai-v1',
  defeatPose: 'defeat-pose-openai-v1',
  beachFamily: 'beach-family-openai-v1',
  maidService: 'maid-service-openai-v1',
  affection: 'affection-openai-v1',
  goofy: 'goofy-openai-v1',
  alignmentSwap: 'alignment-swap-openai-v1',
  genderSwap: 'gender-swap-openai-v1',
  iconicOutfitSwap: 'iconic-outfit-swap-openai-v1',
  zombieVersion: 'zombie-version-openai-v1',
  futureExperienced: 'future-experienced-openai-v1',
  firstStep: 'first-step-openai-v1'
});

const TYPE_SET = new Set(CG_TYPES);
const FAMILY_SET = new Set(CG_FAMILIES);
const CANON_STATUS_SET = new Set(CG_CANON_STATUSES);
const CONTENT_RATING_SET = new Set(CG_CONTENT_RATINGS);
const AGE_STATUS_SET = new Set(CG_AGE_STATUSES);
const CONSENT_STATUS_SET = new Set(CG_CONSENT_STATUSES);
const RARITY_SET = new Set(CG_RARITIES);
const RIGHTS_CLASS_SET = new Set(CG_RIGHTS_CLASSES);
const UNLOCK_TYPE_SET = new Set(CG_UNLOCK_TYPES);
const SAFE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_UNLOCK_FIELDS = new Set(['type', 'heroId']);
const FAN_SERVICE_TYPES = new Set(['beachFamily', 'maidService', 'affection', 'goofy']);
const ADULT_ONLY_FAN_SERVICE_TYPES = new Set(['beachFamily', 'maidService']);

const requireText = (value, fieldName) => {
  const text = String(value ?? '').trim();
  if (!text) throw new TypeError(`${fieldName} must be a non-empty string.`);
  return text;
};

const requireEnum = (value, allowed, fieldName) => {
  const text = requireText(value, fieldName);
  if (!allowed.has(text)) throw new TypeError(`Unsupported ${fieldName}: ${text}.`);
  return text;
};

const requireSafeKey = (value, fieldName) => {
  const key = requireText(value, fieldName);
  if (!SAFE_KEY_PATTERN.test(key)) {
    throw new TypeError(`${fieldName} must be a lowercase kebab-case key.`);
  }
  return key;
};

const freezeLocalizedText = (value, fieldName) => {
  if (typeof value === 'string') return requireText(value, fieldName);
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be a string or a localized text map.`);
  }

  const localized = {};
  for (const [locale, text] of Object.entries(value)) {
    localized[requireText(locale, `${fieldName} locale`)] = requireText(text, `${fieldName}.${locale}`);
  }
  if (!localized.fr && !localized.en) {
    throw new TypeError(`${fieldName} must provide at least fr or en.`);
  }
  return Object.freeze(localized);
};

const freezeSourceRefs = (sourceRefs) => {
  if (!Array.isArray(sourceRefs) || sourceRefs.length === 0) {
    throw new TypeError('sourceRefs must contain at least one reference.');
  }
  return Object.freeze([...new Set(sourceRefs.map((reference) => requireText(reference, 'sourceRefs entry'))) ]);
};

const createHeroOwnedUnlock = (unlock, characterId) => {
  if (!unlock || typeof unlock !== 'object' || Array.isArray(unlock)) {
    throw new TypeError('unlock must be an object.');
  }
  const unsupportedField = Object.keys(unlock).find((field) => !ALLOWED_UNLOCK_FIELDS.has(field));
  if (unsupportedField) {
    throw new TypeError(`Unsupported unlock field: ${unsupportedField}.`);
  }

  const type = requireEnum(unlock.type, UNLOCK_TYPE_SET, 'unlock.type');
  const heroId = requireText(unlock.heroId, 'unlock.heroId');
  if (heroId !== characterId) {
    throw new TypeError('unlock.heroId must match the CG characterId.');
  }
  return Object.freeze({ type, heroId });
};

export const buildCgPaths = ({ universeKey, characterKey, type }) => {
  const safeUniverseKey = requireSafeKey(universeKey, 'universeKey');
  const safeCharacterKey = requireSafeKey(characterKey, 'characterKey');
  const safeType = requireEnum(type, TYPE_SET, 'type');
  const filename = CG_PRODUCTION_FILE_BASENAMES[safeType];
  if (!filename) {
    throw new TypeError(`The current CG asset contract does not publish ${safeType} yet.`);
  }
  const base = `/cg/${safeUniverseKey}/${safeCharacterKey}`;
  return Object.freeze({
    imagePath: `${base}/${filename}.webp`,
    thumbnailPath: `${base}/${filename}-thumb.webp`
  });
};

export const buildCharacterSoloCgPaths = ({ universeKey, characterKey }) => buildCgPaths({
  universeKey,
  characterKey,
  type: 'characterSolo'
});

export const buildCgId = ({ universeKey, characterKey, type = 'characterSolo' }) => (
  `cg:${requireSafeKey(universeKey, 'universeKey')}:${requireSafeKey(characterKey, 'characterKey')}:${requireText(type, 'type')}:openai-v1`
);

export const createCgDefinition = (input = {}) => {
  const universeKey = requireSafeKey(input.universeKey, 'universeKey');
  const characterKey = requireSafeKey(input.characterKey, 'characterKey');
  const characterId = requireText(input.characterId, 'characterId');
  const type = requireEnum(input.type, TYPE_SET, 'type');
  const expectedPaths = buildCgPaths({ universeKey, characterKey, type });
  const imagePath = requireText(input.imagePath ?? expectedPaths.imagePath, 'imagePath');
  const thumbnailPath = requireText(input.thumbnailPath ?? expectedPaths.thumbnailPath, 'thumbnailPath');
  if (imagePath !== expectedPaths.imagePath || thumbnailPath !== expectedPaths.thumbnailPath) {
    throw new TypeError('CG image paths must match the immutable OpenAI production path contract.');
  }

  const source = requireText(input.source, 'source');
  if (source !== 'openai') throw new TypeError('source must be openai.');

  const definition = {
    id: requireText(input.id ?? buildCgId({ universeKey, characterKey, type }), 'id'),
    universeKey,
    universeName: freezeLocalizedText(input.universeName, 'universeName'),
    characterKey,
    characterId,
    characterName: freezeLocalizedText(input.characterName, 'characterName'),
    title: freezeLocalizedText(input.title, 'title'),
    type,
    family: requireEnum(input.family, FAMILY_SET, 'family'),
    rarity: requireEnum(input.rarity, RARITY_SET, 'rarity'),
    canonStatus: requireEnum(input.canonStatus, CANON_STATUS_SET, 'canonStatus'),
    continuityId: requireText(input.continuityId, 'continuityId'),
    contentRating: requireEnum(input.contentRating, CONTENT_RATING_SET, 'contentRating'),
    ageStatus: requireEnum(input.ageStatus ?? 'not-required', AGE_STATUS_SET, 'ageStatus'),
    consentStatus: requireEnum(input.consentStatus ?? 'not-required', CONSENT_STATUS_SET, 'consentStatus'),
    characterReferenceId: requireText(input.characterReferenceId, 'characterReferenceId'),
    promptId: requireText(input.promptId, 'promptId'),
    promptSummary: freezeLocalizedText(input.promptSummary, 'promptSummary'),
    publishedAt: requireText(input.publishedAt, 'publishedAt'),
    source,
    rightsClass: requireEnum(input.rightsClass, RIGHTS_CLASS_SET, 'rightsClass'),
    sourceRefs: freezeSourceRefs(input.sourceRefs),
    credits: freezeLocalizedText(input.credits, 'credits'),
    unlock: createHeroOwnedUnlock(input.unlock, characterId),
    imagePath,
    thumbnailPath
  };

  if (!ISO_DATE_PATTERN.test(definition.publishedAt)) {
    throw new TypeError('publishedAt must use YYYY-MM-DD.');
  }

  if (definition.family === 'Fan Art' && definition.canonStatus !== 'fan-art') {
    throw new TypeError('Fan Art CG must use canonStatus fan-art.');
  }
  if (definition.family === 'What If' && definition.canonStatus !== 'what-if') {
    throw new TypeError('What If CG must use canonStatus what-if.');
  }

  if (FAN_SERVICE_TYPES.has(definition.type)) {
    if (definition.ageStatus === 'not-required' || definition.consentStatus === 'not-required') {
      throw new TypeError('Fan-service CG requires manually validated ageStatus and consentStatus.');
    }
    if (definition.contentRating !== 'family') {
      throw new TypeError('The approved fan-service wave is family-safe only.');
    }
  }
  if (ADULT_ONLY_FAN_SERVICE_TYPES.has(definition.type) && definition.ageStatus !== 'adult-confirmed') {
    throw new TypeError(`${definition.type} requires ageStatus adult-confirmed.`);
  }
  if (
    definition.ageStatus === 'unknown-family-safe-only'
    && (definition.contentRating !== 'family' || definition.consentStatus === 'adult-consensual-romance')
  ) {
    throw new TypeError('Unknown age permits family-safe, non-romantic content only.');
  }
  if (
    definition.consentStatus === 'adult-consensual-romance'
    && definition.ageStatus !== 'adult-confirmed'
  ) {
    throw new TypeError('Adult consensual romance requires ageStatus adult-confirmed.');
  }

  return Object.freeze(definition);
};

export const validateCgDefinition = (definition) => {
  try {
    createCgDefinition(definition);
    return Object.freeze({ valid: true, errors: Object.freeze([]) });
  } catch (error) {
    return Object.freeze({ valid: false, errors: Object.freeze([error.message]) });
  }
};

/**
 * Evaluates only the hero ownership list. Deliberately ignore every other save
 * surface so an owned skin or inventory item can never unlock gallery art.
 */
export const isCgUnlocked = (definition, progression = {}) => {
  if (definition?.unlock?.type !== 'heroOwned') return false;
  const unlockedHeroes = Array.isArray(progression?.unlockedHeroes)
    ? progression.unlockedHeroes
    : [];
  return unlockedHeroes.some((heroId) => String(heroId) === definition.unlock.heroId);
};

/**
 * Applies A.R.C.A. reserve/asset regulation before the gallery builds filters
 * or unlock records. Regulation hides content without mutating its catalog.
 */
export const filterCgCatalogByRegulation = (entries, regulation = {}) => {
  const catalog = Array.isArray(entries) ? entries : [];
  const hiddenUniverses = new Set(
    (Array.isArray(regulation.hiddenUniverses) ? regulation.hiddenUniverses : []).map(String)
  );
  const disabledHeroes = new Set(
    (Array.isArray(regulation.disabledHeroes) ? regulation.disabledHeroes : []).map(String)
  );

  return catalog.filter((definition) => {
    const universeNames = [
      definition?.universeKey,
      definition?.universeName?.fr,
      definition?.universeName?.en
    ].filter(Boolean).map(String);
    if (universeNames.some((name) => hiddenUniverses.has(name))) return false;
    return !disabledHeroes.has(String(definition?.characterId));
  });
};

const LOCKED_MEDIA = Object.freeze({ imagePath: null, thumbnailPath: null });

/**
 * Returns null paths while locked. Components using this resolver therefore do
 * not put the image URL into img/src or a CSS background declaration and do not
 * request it. This is a presentation gate, not access control for public files.
 */
export const resolveCgMedia = (definition, progression = {}) => {
  if (!isCgUnlocked(definition, progression)) return LOCKED_MEDIA;
  return Object.freeze({
    imagePath: definition.imagePath,
    thumbnailPath: definition.thumbnailPath
  });
};
