import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const defaultOutputPath = path.join(
  projectRoot,
  'tmp',
  'universe-cosmetic-generation-manifest.json'
);
const referenceDirectory = path.join(projectRoot, 'docs', 'rift-dossiers', 'references');
const characterReferenceQualityPath = path.join(
  projectRoot,
  'docs',
  'rift-dossiers',
  'character-reference-quality.json'
);
const ASSET_EXTENSION_PATTERN = /\.(?:avif|gif|jpe?g|png|webp)$/i;
const HTTP_URL_PATTERN = /^https?:\/\//i;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const OFFICIAL_WEB_LEAD_CATEGORIES = Object.freeze({
  silhouette: 'silhouette',
  costume: 'costume',
  equipment: 'equipment',
  equipement: 'equipment',
  color: 'colors',
  colors: 'colors',
  colour: 'colors',
  colours: 'colors',
  palette: 'colors'
});

const UNIVERSE_ALIASES = Object.freeze({
  'Cells at Work': 'Cells at Work!',
  Matrix: 'The Matrix',
  'Joker New52': 'Joker New 52',
  Alien3: 'Alien 3'
});

const uniqueStrings = values => (
  [...new Set(
    values
      .filter(value => value !== null && value !== undefined)
      .map(value => String(value).replace(/\s+/g, ' ').trim())
      .filter(Boolean)
  )]
);

const discardNonAscii = value => (
  Array.from(String(value || ''))
    .filter(character => character.codePointAt(0) <= 0x7f)
    .join('')
);

export const normalizeCharacterIdentity = value => (
  discardNonAscii(String(value || '').normalize('NFKD'))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
);

export const isThreadEchoLeadName = value => /(?:^|\s)Thread Echo$/i.test(
  String(value || '').replace(/\s+/g, ' ').trim()
);

export const resolveCosmeticLeadHeroName = ({
  universe,
  leadReferencePath,
  leadHero,
  leadReference,
  officialWebLeadName
}) => (
  (isThreadEchoLeadName(officialWebLeadName) ? officialWebLeadName : null)
  || (leadReferencePath ? leadHero?.name : officialWebLeadName)
  || leadHero?.name
  || leadReference?.basenameName
  || leadReference?.characterNames?.[0]
  || `${universe} Thread Echo`
);

const referenceBasenameName = referencePath => (
  path.basename(referencePath, path.extname(referencePath))
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, character => character.toUpperCase())
);

const identitiesOverlap = (left, right) => {
  const normalizedLeft = normalizeCharacterIdentity(left);
  const normalizedRight = normalizeCharacterIdentity(right);
  if (!normalizedLeft || !normalizedRight) return false;
  if (normalizedLeft === normalizedRight) return true;
  return (
    Math.min(normalizedLeft.length, normalizedRight.length) >= 4
    && (normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft))
  );
};

const referencePathMatchesHero = (candidate, hero) => (
  normalizeCharacterIdentity(candidate.basenameName) === normalizeCharacterIdentity(hero?.name)
  || normalizeCharacterIdentity(candidate.basenameName).startsWith(normalizeCharacterIdentity(hero?.name))
  || (
    normalizeCharacterIdentity(candidate.basenameName).length >= 4
    && normalizeCharacterIdentity(hero?.name).startsWith(
      normalizeCharacterIdentity(candidate.basenameName)
    )
  )
);

const referenceMetadataMatchesHero = (candidate, hero) => (
  candidate.characterNames.some(characterName => (
    normalizeCharacterIdentity(characterName) === normalizeCharacterIdentity(hero?.name)
  ))
);

const referenceMetadataAgreesWithBasename = candidate => (
  candidate.characterNames.some(characterName => (
    identitiesOverlap(candidate.basenameName, characterName)
  ))
);

export const normalizeUniverseAlias = value => {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  return UNIVERSE_ALIASES[normalized] || normalized;
};

// This intentionally mirrors scripts/processUniverseCosmeticAtlas.py:
// NFKD, discard non-ASCII code points, lowercase, collapse non-alphanumerics.
export const slugifyForCosmeticProcessor = value => {
  const asciiValue = discardNonAscii(String(value || '').normalize('NFKD')).toLowerCase();
  return asciiValue.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
};

export const flattenVisualAnchor = (value, label = null) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap(item => flattenVisualAnchor(item, label));
  }
  if (typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => flattenVisualAnchor(item, key));
  }
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text ? [`${label ? `${label}: ` : ''}${text}`] : [];
};

const readJson = async filePath => JSON.parse(await readFile(filePath, 'utf8'));

const isVerifiedDate = value => {
  const date = String(value || '').trim();
  if (!ISO_DATE_PATTERN.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date;
};

const isConcreteAnchor = (value, minimumLength = 16) => {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  return normalized.length >= minimumLength && normalized.split(' ').length >= 3;
};

const normalizeLeadVisualCategory = value => {
  const key = discardNonAscii(String(value || '').normalize('NFKD'))
    .toLowerCase()
    .replace(/[^a-z]+/g, '');
  return OFFICIAL_WEB_LEAD_CATEGORIES[key] || null;
};

export const normalizeOfficialWebResearch = (
  value,
  webResearchVerified = value?.webResearchVerified === true
) => {
  const officialSources = [];
  const officialSourceUrls = new Set();
  let allDeclaredSourcesAreDirectOfficial = true;
  const declaredSources = Array.isArray(value?.officialSources) ? value.officialSources : [];
  for (const source of declaredSources) {
    const url = String(source?.url || '').trim();
    const title = String(source?.title || '').replace(/\s+/g, ' ').trim();
    const publisher = String(source?.publisher || '').replace(/\s+/g, ' ').trim();
    const isDirectOfficial = (
      String(source?.sourceType || '').trim().toLowerCase() === 'official'
      && HTTP_URL_PATTERN.test(url)
      && title
      && publisher
    );
    if (!isDirectOfficial) {
      allDeclaredSourcesAreDirectOfficial = false;
      continue;
    }
    if (officialSourceUrls.has(url)) continue;
    officialSourceUrls.add(url);
    officialSources.push({ url, title, publisher, sourceType: 'official' });
  }

  const environmentAnchors = uniqueStrings(value?.environmentAnchors || [])
    .filter(anchor => isConcreteAnchor(anchor));
  const leadVisualAnchors = [];
  const leadAnchorKeys = new Set();
  for (const anchor of Array.isArray(value?.leadVisualAnchors) ? value.leadVisualAnchors : []) {
    const category = normalizeLeadVisualCategory(anchor?.category);
    const detail = String(anchor?.detail || '').replace(/\s+/g, ' ').trim();
    const key = `${category}:${detail.toLowerCase()}`;
    if (!category || !isConcreteAnchor(detail) || leadAnchorKeys.has(key)) continue;
    leadAnchorKeys.add(key);
    leadVisualAnchors.push({ category, detail });
  }
  const distinctLeadCategories = new Set(leadVisualAnchors.map(anchor => anchor.category));
  const verifiedAt = String(value?.verifiedAt || '').trim();
  const passesFidelityGate = (
    webResearchVerified === true
    && value?.verified === true
    && isVerifiedDate(verifiedAt)
    && officialSources.length >= 1
    && allDeclaredSourcesAreDirectOfficial
    && environmentAnchors.length >= 2
    && leadVisualAnchors.length >= 3
    && distinctLeadCategories.size >= 3
  );

  return {
    webResearchVerified: webResearchVerified === true,
    verified: value?.verified === true,
    verifiedAt: isVerifiedDate(verifiedAt) ? verifiedAt : null,
    officialSources,
    environmentAnchors,
    leadVisualAnchors,
    passesFidelityGate
  };
};

export const doesOfficialWebResearchMeetFidelityGate = (
  value,
  webResearchVerified = value?.webResearchVerified === true
) => (
  normalizeOfficialWebResearch(value, webResearchVerified).passesFidelityGate
);

export const shouldRequireWebResearch = ({
  leadReferencePath,
  visualAnchors = [],
  referenceConfidence,
  webResearch,
  webResearchVerified = webResearch?.webResearchVerified === true
}) => (
  (
    leadReferencePath === null
    && !doesOfficialWebResearchMeetFidelityGate(webResearch, webResearchVerified)
  )
  || visualAnchors.length < 2
  || referenceConfidence !== 'high'
);

export const extractReferenceEntries = document => {
  if (Array.isArray(document)) return document;
  return Array.isArray(document?.entries) ? document.entries : [];
};

const loadRuntimeSources = async () => {
  const vite = await createServer({
    appType: 'custom',
    cacheDir: path.join(projectRoot, 'tmp', 'vite-cosmetic-manifest-cache'),
    configFile: false,
    logLevel: 'error',
    optimizeDeps: { include: [], noDiscovery: true },
    root: projectRoot,
    server: { hmr: false, middlewareMode: true }
  });

  try {
    const [loreModule, stageModule, heroModule] = await Promise.all([
      vite.ssrLoadModule('/src/game/lore.js'),
      vite.ssrLoadModule('/src/game/stageLoreProfiles.js'),
      vite.ssrLoadModule('/src/game/heroes.js')
    ]);
    return {
      HEROES_DB: heroModule.HEROES_DB,
      LORE_DB: loreModule.LORE_DB,
      STAGE_LORE_PROFILES: stageModule.STAGE_LORE_PROFILES
    };
  } finally {
    await vite.close();
  }
};

const loadUniverseReferences = async () => {
  const files = (await readdir(referenceDirectory, { withFileTypes: true }))
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right, 'en'));
  const byUniverse = new Map();

  for (const file of files) {
    const filePath = path.join(referenceDirectory, file);
    const entries = extractReferenceEntries(await readJson(filePath));
    for (const entry of entries) {
      if (!entry?.universe) continue;
      const rawUniverse = String(entry.universe).replace(/\s+/g, ' ').trim();
      const universe = normalizeUniverseAlias(rawUniverse);
      const references = byUniverse.get(universe) || [];
      references.push({
        alias: rawUniverse !== universe,
        entry,
        source: `docs/rift-dossiers/references/${file}`
      });
      byUniverse.set(universe, references);
    }
  }

  for (const references of byUniverse.values()) {
    references.sort((left, right) => (
      Number(left.alias) - Number(right.alias)
      || left.source.localeCompare(right.source, 'en')
    ));
  }
  return { byUniverse, files };
};

const toPublicUrlPath = value => {
  const normalized = String(value || '').trim().replaceAll('\\', '/');
  if (!normalized) return '';
  return `/${normalized.replace(/^public\//, '').replace(/^\/+/, '')}`;
};

const toRepositoryPublicPath = value => {
  const publicUrl = toPublicUrlPath(value);
  return publicUrl ? `public${publicUrl}` : '';
};

const isExistingPublicAsset = async value => {
  const publicUrl = toPublicUrlPath(value);
  if (!publicUrl || publicUrl.includes('..') || !ASSET_EXTENSION_PATTERN.test(publicUrl)) {
    return false;
  }
  const resolved = path.resolve(projectRoot, 'public', publicUrl.slice(1));
  const publicRoot = `${path.resolve(projectRoot, 'public')}${path.sep}`;
  if (!resolved.startsWith(publicRoot)) return false;
  return access(resolved).then(() => true, () => false);
};

const collectAssetStrings = value => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(collectAssetStrings);
  if (typeof value === 'object') return Object.values(value).flatMap(collectAssetStrings);
  if (typeof value !== 'string') return [];
  const normalized = value.trim().replaceAll('\\', '/');
  return (
    (normalized.startsWith('/') || normalized.startsWith('public/'))
    && ASSET_EXTENSION_PATTERN.test(normalized)
  ) ? [normalized] : [];
};

const buildCharacterReferenceIndex = async heroes => {
  const quality = await readJson(characterReferenceQualityPath);
  const heroesByUniverse = new Map();
  for (const hero of heroes) {
    const universe = normalizeUniverseAlias(hero?.universe);
    if (!universe) continue;
    const universeHeroes = heroesByUniverse.get(universe) || [];
    universeHeroes.push(hero);
    heroesByUniverse.set(universe, universeHeroes);
  }

  const candidatesByUniverse = new Map();
  for (const reference of quality.referenceFiles || []) {
    const publicUrl = toPublicUrlPath(reference?.path);
    if (
      reference?.classification !== 'approved'
      || !publicUrl.startsWith('/sprites/generated/heroes/')
      || !(await isExistingPublicAsset(publicUrl))
    ) {
      continue;
    }
    for (const rawUniverse of reference.universes || []) {
      const universe = normalizeUniverseAlias(rawUniverse);
      const candidates = candidatesByUniverse.get(universe) || [];
      candidates.push({
        basenameName: referenceBasenameName(publicUrl),
        characterNames: uniqueStrings(reference.characters || []),
        path: toRepositoryPublicPath(publicUrl)
      });
      candidatesByUniverse.set(universe, candidates);
    }
  }

  const leadReferenceByUniverse = new Map();
  for (const [universe, candidates] of candidatesByUniverse) {
    const universeHeroes = heroesByUniverse.get(universe) || [];
    candidates.sort((left, right) => {
      const rank = candidate => {
        const pathRank = universeHeroes.findIndex(hero => referencePathMatchesHero(candidate, hero));
        if (pathRank >= 0) return pathRank;
        const metadataRank = referenceMetadataAgreesWithBasename(candidate)
          ? universeHeroes.findIndex(hero => referenceMetadataMatchesHero(candidate, hero))
          : -1;
        return metadataRank >= 0 ? metadataRank : Number.MAX_SAFE_INTEGER;
      };
      return rank(left) - rank(right) || left.path.localeCompare(right.path, 'en');
    });
    leadReferenceByUniverse.set(universe, candidates[0]);
  }
  return leadReferenceByUniverse;
};

const isOriginalUniverse = (universe, lore, references) => (
  lore?.isOriginal === true
  || lore?.originalContent === true
  || ['original', 'project-original'].includes(String(lore?.sourceType || '').toLowerCase())
  || references.some(reference => reference.source.endsWith('/original-universes.json'))
  || universe === 'Nexus de Convergence'
);

const mergeQualifiedOfficialWebResearch = references => {
  const qualified = references
    .map(reference => ({
      leadCharacterName: String(reference.entry?.leadCharacterName || '').replace(/\s+/g, ' ').trim(),
      research: normalizeOfficialWebResearch(
        reference.entry?.webResearch,
        reference.entry?.webResearchVerified === true
      )
    }))
    .filter(candidate => candidate.research.passesFidelityGate);
  if (qualified.length === 0) return null;

  const officialSources = [];
  const sourceUrls = new Set();
  for (const source of qualified.flatMap(candidate => candidate.research.officialSources)) {
    if (sourceUrls.has(source.url)) continue;
    sourceUrls.add(source.url);
    officialSources.push(source);
  }
  const leadVisualAnchors = [];
  const leadAnchorKeys = new Set();
  for (const anchor of qualified.flatMap(candidate => candidate.research.leadVisualAnchors)) {
    const key = `${anchor.category}:${anchor.detail.toLowerCase()}`;
    if (leadAnchorKeys.has(key)) continue;
    leadAnchorKeys.add(key);
    leadVisualAnchors.push(anchor);
  }

  return {
    webResearchVerified: true,
    verified: true,
    leadCharacterName: uniqueStrings(
      qualified.map(candidate => candidate.leadCharacterName)
    )[0] || null,
    verifiedAt: qualified
      .map(candidate => candidate.research.verifiedAt)
      .sort((left, right) => right.localeCompare(left, 'en'))[0],
    officialSources,
    environmentAnchors: uniqueStrings(
      qualified.flatMap(candidate => candidate.research.environmentAnchors)
    ),
    leadVisualAnchors,
    passesFidelityGate: true
  };
};

const localizedText = value => {
  if (typeof value === 'string') return value;
  return value?.fr || value?.en || '';
};

const buildHeroAnchors = ({
  leadHero,
  leadHeroName,
  leadReferencePath,
  webResearch
}) => uniqueStrings([
  `Lead character: ${leadHeroName}`,
  leadHero?.category ? `Gameplay archetype: ${leadHero.category}` : null,
  leadHero?.weaponType ? `Signature weapon type: ${leadHero.weaponType}` : null,
  leadHero?.primaryColor ? `Primary costume or energy color: ${leadHero.primaryColor}` : null,
  leadHero?.secondaryColor ? `Secondary costume or energy color: ${leadHero.secondaryColor}` : null,
  leadReferencePath ? `Approved local character reference metadata: ${leadReferencePath}` : null,
  ...(webResearch?.leadVisualAnchors || []).map(anchor => (
    `Verified official Web lead ${anchor.category}: ${anchor.detail}`
  ))
]);

export const buildUniverseCosmeticGenerationPrompt = ({
  universe,
  rightsClass,
  canonicalMotif,
  visualAnchors = [],
  leadHeroName,
  heroAnchors = [],
  leadReferencePath,
  webResearch = null,
  officialReferenceUrls = [],
  needsWebResearch = false
}) => {
  const leadReferenceClause = leadReferencePath
    ? isThreadEchoLeadName(leadHeroName)
      ? `Approved local lead-reference metadata path: ${leadReferencePath}. Because the researched lead is explicitly an anonymous Thread Echo, the supplied bitmap is strictly a non-biometric reference for source-grounded costume, equipment, palette and broad silhouette only. Never use its face, facial geometry, biometric identity, performer likeness or exact pose; create an entirely original anonymous face and body details, and never copy its pixel placement or sheet layout.`
      : `Approved local lead-reference metadata path: ${leadReferencePath}. Treat this path as provenance metadata; use the bitmap for identity and costume cues only when it is actually supplied as an input image, and never copy its pixel placement, sheet layout or pose.`
    : 'No approved local lead-character bitmap is available. Do not imply that a character image was supplied; ground the design only in the named lead and concrete semantic anchors below.';
  const rightsClause = rightsClass === 'original'
    ? 'Rights treatment: wholly original project artwork that extends this project-owned universe without imitating an outside franchise.'
    : 'Rights treatment: wholly original fan-made fan-art interpretation; preserve recognizable canonical visual logic without copying official artwork, key art, frames, sprites, logos or exact proprietary composition.';

  return [
    'Use case: stylized-concept',
    `Asset type: production-ready keyed 2D game cosmetic atlas for "${universe}".`,
    'Primary request: create exactly one 1024x1536 portrait raster sprite sheet, conceptually divided into 4 equal columns by 6 equal rows; every cell is exactly 256x256 and the row order below is mandatory.',
    `Canonical stage or motif: ${canonicalMotif}.`,
    `Concrete verified visual anchors: ${visualAnchors.join(' | ')}.`,
    `Official source provenance URLs researched before prompt encoding: ${officialReferenceUrls.join(' | ') || 'none recorded'}.`,
    'The canonical motif, visual anchors and hero facts above are concrete facts already encoded from the researched official-source provenance. Do not browse, fetch, open or infer unseen content from any URL; reproduce only these explicit encoded details.',
    needsWebResearch
      ? 'Fidelity gate: this entry is marked needsWebResearch=true. Before production approval, a research worker must strengthen missing identity or visual facts from official sources and encode those concrete findings into this manifest; the image model itself must never navigate URLs.'
      : 'Fidelity gate: the encoded official-source facts and approved local references meet the current production threshold; do not add unsupported visual lore.',
    `Lead identity for both character-animation rows: ${leadHeroName}.`,
    `Concrete hero anchors: ${heroAnchors.join(' | ')}.`,
    webResearch?.passesFidelityGate
      ? `Verified official Web environment anchors: ${webResearch.environmentAnchors.join(' | ')}.\nVerified official Web lead visual anchors: ${webResearch.leadVisualAnchors.map(anchor => `${anchor.category}: ${anchor.detail}`).join(' | ')}.\nDirect official Web provenance: ${webResearch.officialSources.map(source => `${source.publisher} - ${source.title}: ${source.url}`).join(' | ')}. Research verification date: ${webResearch.verifiedAt}.`
      : 'No structured official Web dossier currently meets the strict environment, lead-detail and direct-provenance fidelity gate.',
    leadReferenceClause,
    rightsClause,
    'Identity safety: if this source is live action, depicts a real person, or the named lead is associated with a real performer, use an anonymous identity-safe Thread Echo. Preserve only source-grounded role, costume, equipment, palette and broad silhouette cues; do not reproduce a performer face, biometric identity, celebrity likeness or photoreal portrait.',
    'Style/medium: crisp highly detailed 16-bit/32-bit-inspired pixel art, deliberate readable pixel clusters, sharp silhouettes, controlled selective anti-aliasing, rich material texture and modern game-production lighting; never painterly, photorealistic, smooth vector art or a placeholder.',
    'Technical chroma background: every unused pixel, every gap and all open centers must be perfectly flat uniform solid #00ff00. Never use #00ff00 or near chroma green in artwork, highlights or effects. No gradient, texture, vignette, floor, cast shadow, reflection, atmospheric backdrop, green spill, grid line, gutter label or guide mark.',
    'ROW 0, y=0..255: one coherent full-width PROFILE TITLE / HUD TOP frame. Build universe-specific corners, materials and a restrained central crest from the verified anchors, but keep the broad center empty/open for runtime title and HUD information. Every painted pixel of this top frame must stay vertically inside atlas y=16..231; atlas y=0..15 and y=232..255 must remain pure #00ff00 across the full width. Render no text, letters, numbers or pseudo-glyphs.',
    'ROW 1, y=256..511: one coherent full-width PROFILE BANNER / HUD LOWER frame. It must pair visually with row 0 as a unified 1024x512 gameplay HUD theme, while leaving a broad clean center empty/open for runtime profile art and interface content. Every painted pixel of this lower frame must stay vertically inside atlas y=272..487; atlas y=256..271 and y=488..511 must remain pure #00ff00 across the full width. Render no baked controls, meters or text.',
    'ROW 2, y=512..767: FOUR isolated 256x256 PORTAL EFFECT frames from left to right: dormant universe-specific aperture, opening phase, fully open energy rift, then clean collapse/dissipation. Keep one consistent portal design, scale and center with pure-green separation around every frame.',
    'ROW 3, y=768..1023: FOUR isolated 256x256 KO EFFECT frames from left to right: intact universe-specific emblem or energy focus, impact/rupture, readable peak burst, then sparse fading fragments. This row is effect-only: absolutely no character, body, face, limb, corpse, gore, letters or numbers.',
    `ROW 4, y=1024..1279: FOUR isolated 256x256 INTRO POSE animation frames of the SAME ${leadHeroName} identity from left to right: composed arrival, recognition/turn, signature readying action, stable battle-ready pose. Keep full body and equipment inside every cell, with identical proportions, costume, palette, scale, baseline and identity across all four frames; no ground shadow. Every character and equipment pixel must remain inside atlas y=1048..1255. The exact same source-grounded weapon model, carried equipment, accessories and dominant hand must persist in every frame: only pose and orientation may change; never swap, add, remove, duplicate or transform gear. Keep every carried item at or below shoulder height; never raise, swing or summon a weapon above the head. Scale the complete figure down rather than approaching a cell edge.`,
    `ROW 5, y=1280..1535: FOUR isolated 256x256 VICTORY POSE animation frames of that SAME ${leadHeroName} identity from left to right: post-battle recovery, rising transition, signature celebratory action, stable final victory pose. Keep full body and equipment inside every cell, with identical proportions, costume, palette, scale, baseline and identity across all four frames; no ground shadow. Every character and equipment pixel must remain inside atlas y=1304..1511. Continue with exactly the same weapon model, carried equipment, accessories and dominant hand used throughout row 4; never holster one item and invent another, change weapon class, add a second copy or discard gear between cells. Keep the weapon at or below shoulder height during celebration; use free-hand gesture and body posture for victory. Scale the complete figure down rather than approaching a cell edge.`,
    'Composition and separation: rows 0 and 1 are each a single full-width strip; rows 2 through 5 each contain exactly four isolated frames. The 4x6 layout is conceptual only: never draw cell borders, separator strokes, grid lines, gutters or registration marks. Keep every independent sprite, effect, particle, hair tip and equipment piece at least 24 pixels inside all four edges of its own 256x256 cell, keep all content inside its assigned row and cell, and fill every inter-cell boundary entirely with pure #00ff00 so no pixel can bleed into an adjacent row or frame.',
    'Final constraints: one atlas only, exact 1024x1536 size and exact 4x6 order; original project art or original fan-art only; no copied official image or sprite; no poster recreation; no readable text; no logo; no watermark; no signature; no decorative sheet title; no extra character; no cropped body, limb or equipment; no character, costume, weapon or accessory continuity change across the eight pose frames.'
  ].join('\n');
};

const resolveCanonicalMotif = ({ universe, lore, stage, references }) => uniqueStrings([
  ...references.map(reference => reference.entry.canonicalLocationOrMotif),
  stage?.canonicalName,
  lore?.canonicalStage,
  lore?.stageName,
  lore?.theme,
  localizedText(lore?.desc),
  universe
])[0];

const buildVisualAnchors = ({
  lore,
  stage,
  references,
  canonicalMotif,
  webResearch
}) => uniqueStrings([
  ...references.flatMap(reference => flattenVisualAnchor(reference.entry.visualAnchor)),
  ...references.flatMap(reference => flattenVisualAnchor(reference.entry.visualAnchors)),
  ...(webResearch?.environmentAnchors || []).map(anchor => (
    `Verified official Web environment: ${anchor}`
  )),
  ...flattenVisualAnchor(stage?.visualAnchor),
  ...flattenVisualAnchor(lore?.worldBossPolicy?.visualAnchor),
  canonicalMotif
]);

const buildOfficialReferenceUrls = ({ lore, stage, references, webResearch }) => uniqueStrings([
  ...references.flatMap(reference => reference.entry.referenceUrls || []),
  ...(webResearch?.officialSources || []).map(source => source.url),
  ...(stage?.referenceUrls || []),
  ...(lore?.worldBossPolicy?.referenceUrls || [])
]).filter(url => HTTP_URL_PATTERN.test(url));

const buildLocalReferencePaths = async ({ lore, stage, leadReferencePath }) => {
  const candidates = uniqueStrings([
    ...collectAssetStrings(lore?.audiovisual),
    ...collectAssetStrings(stage?.modes),
    leadReferencePath
  ]);
  const existing = [];
  for (const candidate of candidates) {
    if (await isExistingPublicAsset(candidate)) {
      existing.push(toRepositoryPublicPath(candidate));
    }
  }
  return uniqueStrings(existing);
};

const validateManifest = manifest => {
  if (manifest.universes.length !== 394) {
    throw new Error(`Expected 394 runtime universes, found ${manifest.universes.length}.`);
  }
  const universeKeys = new Set();
  const slugs = new Set();
  for (const entry of manifest.universes) {
    if (universeKeys.has(entry.universe)) throw new Error(`Duplicate universe: ${entry.universe}`);
    if (slugs.has(entry.slug)) throw new Error(`Duplicate cosmetic slug: ${entry.slug}`);
    universeKeys.add(entry.universe);
    slugs.add(entry.slug);
    if (!['original', 'third-party'].includes(entry.rightsClass)) {
      throw new Error(`${entry.universe}: invalid rightsClass ${entry.rightsClass}.`);
    }
    if (!entry.canonicalMotif || entry.visualAnchors.length === 0) {
      throw new Error(`${entry.universe}: canonical motif or visual anchors are missing.`);
    }
    if (
      entry.canonicalStage !== entry.canonicalMotif
      || !entry.leadHeroName
      || !Array.isArray(entry.heroAnchors)
      || entry.heroAnchors.length === 0
    ) {
      throw new Error(`${entry.universe}: canonical stage alias or hero anchors are missing.`);
    }
    if (entry.officialReferenceUrls.length === 0) {
      throw new Error(`${entry.universe}: official reference URLs are missing.`);
    }
    if (
      entry.generationAllowed !== true
      || !['medium', 'high'].includes(entry.referenceConfidence)
      || typeof entry.needsWebResearch !== 'boolean'
      || typeof entry.generationPrompt !== 'string'
      || entry.generationPrompt.length < 1_000
    ) {
      throw new Error(`${entry.universe}: generation approval, confidence or prompt is invalid.`);
    }
    const hasQualifiedOfficialWebResearch = doesOfficialWebResearchMeetFidelityGate(
      entry.webResearch,
      entry.webResearchVerified
    );
    const expectedWebResearch = shouldRequireWebResearch(entry);
    if (entry.needsWebResearch !== expectedWebResearch) {
      throw new Error(`${entry.universe}: needsWebResearch does not match the fidelity gate.`);
    }
    if (
      entry.leadReferencePath !== null
      && !entry.leadReferencePath.startsWith('public/sprites/generated/heroes/')
    ) {
      throw new Error(`${entry.universe}: invalid approved lead-reference path.`);
    }
    if (
      entry.webResearch !== null
      && !hasQualifiedOfficialWebResearch
    ) {
      throw new Error(`${entry.universe}: an emitted official Web dossier failed its fidelity gate.`);
    }
    if (
      typeof entry.webResearchVerified !== 'boolean'
      || entry.webResearchVerified !== (entry.webResearch !== null)
    ) {
      throw new Error(`${entry.universe}: explicit Web-research verification marker is invalid.`);
    }
  }
};

export const buildUniverseCosmeticGenerationManifest = async () => {
  const [{ HEROES_DB, LORE_DB, STAGE_LORE_PROFILES }, dossierReferences] = await Promise.all([
    loadRuntimeSources(),
    loadUniverseReferences()
  ]);
  const leadReferenceByUniverse = await buildCharacterReferenceIndex(HEROES_DB);
  const heroesByUniverse = new Map();
  for (const hero of HEROES_DB) {
    const universe = normalizeUniverseAlias(hero?.universe);
    if (!universe) continue;
    const universeHeroes = heroesByUniverse.get(universe) || [];
    universeHeroes.push(hero);
    heroesByUniverse.set(universe, universeHeroes);
  }
  const universes = [];

  for (const universe of Object.keys(LORE_DB)) {
    const lore = LORE_DB[universe] || {};
    const stage = STAGE_LORE_PROFILES[universe] || null;
    const references = dossierReferences.byUniverse.get(universe) || [];
    const webResearch = mergeQualifiedOfficialWebResearch(references);
    const canonicalMotif = resolveCanonicalMotif({ universe, lore, stage, references });
    const leadReference = leadReferenceByUniverse.get(universe) || null;
    const leadReferencePath = leadReference?.path || null;
    const visualAnchors = buildVisualAnchors({
      lore,
      stage,
      references,
      canonicalMotif,
      webResearch
    });
    const officialReferenceUrls = buildOfficialReferenceUrls({
      lore,
      stage,
      references,
      webResearch
    });
    const universeHeroes = heroesByUniverse.get(universe) || [];
    const pathMatchedHero = leadReference
      ? universeHeroes.find(hero => referencePathMatchesHero(leadReference, hero))
      : null;
    const metadataMatchedHero = leadReference && referenceMetadataAgreesWithBasename(leadReference)
      ? universeHeroes.find(hero => referenceMetadataMatchesHero(leadReference, hero))
      : null;
    const webMatchedHero = webResearch?.leadCharacterName
      ? universeHeroes.find(hero => identitiesOverlap(webResearch.leadCharacterName, hero?.name))
      : null;
    const leadHero = (
      pathMatchedHero
      || metadataMatchedHero
      || webMatchedHero
      || (leadReference ? null : universeHeroes[0])
    );
    const leadHeroName = resolveCosmeticLeadHeroName({
      universe,
      leadReferencePath,
      leadHero,
      leadReference,
      officialWebLeadName: webResearch?.leadCharacterName || null
    });
    const heroAnchors = buildHeroAnchors({
      leadHero,
      leadHeroName,
      leadReferencePath,
      webResearch
    });
    const rightsClass = isOriginalUniverse(universe, lore, references) ? 'original' : 'third-party';
    const referenceConfidence = (
      references.length > 0 && visualAnchors.length >= 2 && officialReferenceUrls.length > 0
    ) ? 'high' : 'medium';
    const needsWebResearch = shouldRequireWebResearch({
      leadReferencePath,
      visualAnchors,
      referenceConfidence,
      webResearch
    });
    const entry = {
      universe,
      slug: slugifyForCosmeticProcessor(universe),
      rightsClass,
      medium: lore?.mediaType || null,
      canonicalMotif,
      canonicalStage: canonicalMotif,
      visualAnchors,
      heroAnchors,
      leadHeroName,
      officialReferenceUrls,
      localReferencePaths: await buildLocalReferencePaths({ lore, stage, leadReferencePath }),
      leadReferencePath,
      leadReferenceCharacterNames: leadReference?.characterNames || [],
      webResearchVerified: webResearch?.webResearchVerified === true,
      webResearch,
      sourceReferenceFiles: uniqueStrings(references.map(reference => reference.source)),
      referenceConfidence,
      needsWebResearch,
      generationAllowed: true
    };
    entry.generationPrompt = buildUniverseCosmeticGenerationPrompt(entry);
    universes.push(entry);
  }

  const manifest = {
    schemaVersion: 2,
    id: 'multiverse-breach.universe-cosmetic-generation-manifest',
    source: {
      runtimeUniverseKeys: 'Object.keys(LORE_DB)',
      stageProfiles: 'src/game/stageLoreProfiles.js',
      dossierReferenceDirectory: 'docs/rift-dossiers/references',
      characterReferenceQuality: 'docs/rift-dossiers/character-reference-quality.json',
      slugContract: 'scripts/processUniverseCosmeticAtlas.py'
    },
    summary: {
      universeCount: universes.length,
      originalCount: universes.filter(entry => entry.rightsClass === 'original').length,
      thirdPartyCount: universes.filter(entry => entry.rightsClass === 'third-party').length,
      entriesWithApprovedLeadReference: universes.filter(entry => entry.leadReferencePath).length,
      entriesWithQualifiedOfficialWebResearch: universes.filter(
        entry => entry.webResearch?.passesFidelityGate
      ).length,
      entriesWithLocalReferences: universes.filter(entry => entry.localReferencePaths.length).length,
      dossierFilesRead: dossierReferences.files.length
    },
    universes
  };
  validateManifest(manifest);
  return manifest;
};

export const serializeUniverseCosmeticGenerationManifest = manifest => (
  `${JSON.stringify(manifest, null, 2)}\n`
);

const parseOutputPath = argv => {
  const equalsArgument = argv.find(argument => argument.startsWith('--out='));
  if (equalsArgument) return equalsArgument.slice('--out='.length);
  const outputIndex = argv.indexOf('--out');
  if (outputIndex >= 0) {
    if (!argv[outputIndex + 1]) throw new Error('--out requires a path.');
    return argv[outputIndex + 1];
  }
  return defaultOutputPath;
};

const run = async () => {
  if (process.argv.includes('--help')) {
    console.log('Usage: node scripts/buildUniverseCosmeticGenerationManifest.mjs [--out <path>]');
    return;
  }
  const requestedPath = parseOutputPath(process.argv.slice(2));
  const outputPath = path.isAbsolute(requestedPath)
    ? requestedPath
    : path.resolve(projectRoot, requestedPath);
  const manifest = await buildUniverseCosmeticGenerationManifest();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serializeUniverseCosmeticGenerationManifest(manifest), 'utf8');
  console.log(
    `Wrote ${manifest.summary.universeCount} universe cosmetic entries to ${path.relative(projectRoot, outputPath)}`
  );
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
