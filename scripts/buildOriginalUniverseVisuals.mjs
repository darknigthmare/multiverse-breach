import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIRECTORY, '..');
const MANIFEST_PATH = path.join(REPOSITORY_ROOT, 'src', 'game', 'originalUniversesManifest.json');
const SAFE_PATH_SEGMENT = /^[a-z0-9][a-z0-9_-]*$/i;
const VISUAL_KINDS = Object.freeze(['booster', 'backdrop', 'stage', 'hero', 'threat', 'item']);
const DIMENSIONS = Object.freeze({
  booster: Object.freeze({ width: 768, height: 1080 }),
  backdrop: Object.freeze({ width: 1600, height: 900 }),
  stage: Object.freeze({ width: 1600, height: 900 }),
  hero: Object.freeze({ width: 768, height: 1024 }),
  threat: Object.freeze({ width: 768, height: 1024 }),
  item: Object.freeze({ width: 768, height: 768 })
});

function parseArguments(argumentsList) {
  const options = { check: false, help: false };

  for (const argument of argumentsList) {
    if (argument === '--check') {
      options.check = true;
    } else if (argument === '--help' || argument === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function printHelp() {
  console.log([
    'Usage: node scripts/buildOriginalUniverseVisuals.mjs [--check]',
    '',
    'Without options, creates or refreshes deterministic original SVG visuals.',
    '--check only verifies that every expected SVG file is present.'
  ].join('\n'));
}

function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  })[character]);
}

function cleanText(value, fallback = '') {
  const resolved = typeof value === 'string'
    ? value
    : value && typeof value === 'object'
      ? value.en || value.fr || fallback
      : fallback;

  return [...String(resolved || fallback)]
    .map(character => {
      const code = character.charCodeAt(0);
      const prohibitedControl = (code < 32 && ![9, 10, 13].includes(code))
        || code === 127;
      return prohibitedControl ? ' ' : character;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function assertSafeSegment(value, label) {
  if (typeof value !== 'string' || !SAFE_PATH_SEGMENT.test(value)) {
    throw new Error(`${label} must be a non-empty filesystem-safe identifier; received ${JSON.stringify(value)}.`);
  }
  return value;
}

function slugifyPathSegment(value, label) {
  const slug = cleanText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return assertSafeSegment(slug, label);
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }
  return value;
}

function hashString(value) {
  let hash = 0x811c9dc5;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createDeterministicRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function generatedColor(seed, offset, saturation = 78, lightness = 55) {
  return `hsl(${(seed + offset) % 360}, ${saturation}%, ${lightness}%)`;
}

function safeColor(value, fallback) {
  return typeof value === 'string' && /^#[0-9a-f]{3,8}$/i.test(value)
    ? value
    : fallback;
}

function getPalette(world) {
  const seed = hashString(world.key);
  const colors = world.visual?.colors || {};
  const sky = Array.isArray(colors.sky) ? colors.sky : [];

  return Object.freeze({
    deep: safeColor(sky[1], generatedColor(seed, 188, 58, 8)),
    surface: safeColor(sky[0], generatedColor(seed, 32, 62, 18)),
    floor: safeColor(colors.floor, generatedColor(seed, 74, 54, 13)),
    grid: safeColor(colors.grid, generatedColor(seed, 132, 82, 58)),
    accent: safeColor(colors.accent, generatedColor(seed, 278, 88, 61)),
    text: '#ffffff',
    mutedText: '#dce8f5'
  });
}

function number(value) {
  return Number(value.toFixed(2));
}

function pointsForRegularPolygon(centerX, centerY, radius, sides, rotation = 0) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + (Math.PI * 2 * index) / sides;
    return `${number(centerX + Math.cos(angle) * radius)},${number(centerY + Math.sin(angle) * radius)}`;
  }).join(' ');
}

function renderParticles(width, height, palette, random, count) {
  return Array.from({ length: count }, (_, index) => {
    const x = number(random() * width);
    const y = number(random() * height);
    const radius = number(1 + random() * Math.max(2, width / 420));
    const fill = index % 3 === 0 ? palette.accent : palette.grid;
    const opacity = number(0.18 + random() * 0.55);
    return `    <circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" opacity="${opacity}"/>`;
  }).join('\n');
}

function renderMotif(world, width, height, palette, random) {
  const motifSeed = hashString(`${world.key}:${world.visual?.motif || 'original'}`);
  const variant = motifSeed % 5;
  const centerX = number(width * (0.38 + random() * 0.24));
  const centerY = number(height * (0.34 + random() * 0.2));

  if (variant === 0) {
    return Array.from({ length: 9 }, (_, index) => {
      const inset = number((index + 1) * Math.min(width, height) * 0.045);
      const rotation = number((motifSeed % 31) - 15 + index * 8);
      return `    <rect x="${inset}" y="${inset}" width="${number(width - inset * 2)}" height="${number(height - inset * 2)}" rx="${number(inset * 0.22)}" fill="none" stroke="${index % 2 ? palette.grid : palette.accent}" stroke-width="${number(2 + index * 0.6)}" opacity="${number(0.32 - index * 0.02)}" transform="rotate(${rotation} ${width / 2} ${height / 2})"/>`;
    }).join('\n');
  }

  if (variant === 1) {
    return Array.from({ length: 12 }, (_, index) => {
      const radius = number(Math.min(width, height) * (0.07 + index * 0.035));
      return `    <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="${index % 3 === 0 ? palette.accent : palette.grid}" stroke-width="${number(1.5 + (index % 4))}" stroke-dasharray="${8 + index * 2} ${12 + index}" opacity="${number(0.48 - index * 0.025)}"/>`;
    }).join('\n');
  }

  if (variant === 2) {
    return Array.from({ length: 14 }, (_, index) => {
      const y = number((height / 13) * index);
      const bend = number((random() - 0.5) * height * 0.22);
      return `    <path d="M ${number(-width * 0.08)} ${y} Q ${number(width * 0.5)} ${number(y + bend)} ${number(width * 1.08)} ${number(y - bend * 0.35)}" fill="none" stroke="${index % 2 ? palette.grid : palette.accent}" stroke-width="${number(2 + random() * 5)}" opacity="${number(0.12 + random() * 0.25)}"/>`;
    }).join('\n');
  }

  if (variant === 3) {
    return Array.from({ length: 10 }, (_, index) => {
      const radius = number(Math.min(width, height) * (0.08 + index * 0.035));
      const sides = 3 + (index % 5);
      const rotation = random() * Math.PI;
      return `    <polygon points="${pointsForRegularPolygon(centerX, centerY, radius, sides, rotation)}" fill="none" stroke="${index % 2 ? palette.grid : palette.accent}" stroke-width="${number(2 + index * 0.5)}" opacity="${number(0.38 - index * 0.025)}"/>`;
    }).join('\n');
  }

  return Array.from({ length: 13 }, (_, index) => {
    const x = number((width / 12) * index);
    const offset = number((random() - 0.5) * width * 0.18);
    return `    <path d="M ${x} ${number(-height * 0.1)} L ${number(x + offset)} ${number(height * 1.1)}" stroke="${index % 3 === 0 ? palette.accent : palette.grid}" stroke-width="${number(2 + random() * 8)}" opacity="${number(0.12 + random() * 0.28)}"/>`;
  }).join('\n');
}

function renderLandscapeSubject(width, height, palette, random, isStage) {
  const horizon = number(height * (isStage ? 0.56 : 0.62));
  const terrainPoints = [`0,${height}`, `0,${horizon}`];
  const pointCount = 9;
  for (let index = 1; index < pointCount; index += 1) {
    const x = number((width / pointCount) * index);
    const y = number(horizon - random() * height * (isStage ? 0.22 : 0.15));
    terrainPoints.push(`${x},${y}`);
  }
  terrainPoints.push(`${width},${horizon}`, `${width},${height}`);

  const beaconX = number(width * (0.25 + random() * 0.5));
  const beaconY = number(horizon * (0.38 + random() * 0.28));
  const beaconRadius = number(Math.min(width, height) * (isStage ? 0.09 : 0.13));

  return [
    `    <circle cx="${beaconX}" cy="${beaconY}" r="${beaconRadius}" fill="url(#core-gradient)" opacity="0.86"/>`,
    `    <circle cx="${beaconX}" cy="${beaconY}" r="${number(beaconRadius * 1.45)}" fill="none" stroke="${palette.grid}" stroke-width="4" opacity="0.38"/>`,
    `    <polygon points="${terrainPoints.join(' ')}" fill="${palette.floor}" opacity="0.94"/>`,
    `    <path d="M 0 ${horizon} L ${width} ${horizon}" stroke="${palette.grid}" stroke-width="${isStage ? 5 : 3}" opacity="0.48"/>`
  ].join('\n');
}

function renderHeroSubject(width, height, palette, random) {
  const centerX = number(width * (0.46 + random() * 0.08));
  const headY = number(height * (0.3 + random() * 0.04));
  const headRadius = number(width * (0.105 + random() * 0.018));
  const shoulderY = number(height * 0.48);
  const shoulderWidth = number(width * (0.27 + random() * 0.05));
  const weaponAngle = number(-24 + random() * 48);

  return [
    `    <circle cx="${centerX}" cy="${headY}" r="${number(headRadius * 1.9)}" fill="none" stroke="${palette.accent}" stroke-width="5" opacity="0.38"/>`,
    `    <circle cx="${centerX}" cy="${headY}" r="${headRadius}" fill="url(#subject-gradient)" stroke="${palette.grid}" stroke-width="5"/>`,
    `    <path d="M ${number(centerX - shoulderWidth)} ${number(height * 0.7)} Q ${number(centerX - shoulderWidth * 0.8)} ${shoulderY} ${centerX} ${number(shoulderY - headRadius * 0.28)} Q ${number(centerX + shoulderWidth * 0.8)} ${shoulderY} ${number(centerX + shoulderWidth)} ${number(height * 0.7)} Z" fill="url(#subject-gradient)" stroke="${palette.grid}" stroke-width="6"/>`,
    `    <path d="M ${number(centerX - width * 0.29)} ${number(height * 0.61)} L ${number(centerX + width * 0.31)} ${number(height * 0.36)}" stroke="${palette.accent}" stroke-width="14" stroke-linecap="round" opacity="0.82" transform="rotate(${weaponAngle} ${centerX} ${number(height * 0.5)})"/>`
  ].join('\n');
}

function renderItemSubject(width, height, palette, random) {
  const centerX = number(width * (0.47 + random() * 0.06));
  const centerY = number(height * (0.4 + random() * 0.05));
  const radius = number(width * (0.17 + random() * 0.035));
  const sides = 5 + Math.floor(random() * 4);
  const innerSides = 3 + Math.floor(random() * 4);

  return [
    `    <circle cx="${centerX}" cy="${centerY}" r="${number(radius * 1.62)}" fill="none" stroke="${palette.grid}" stroke-width="5" stroke-dasharray="16 13" opacity="0.48"/>`,
    `    <polygon points="${pointsForRegularPolygon(centerX, centerY, radius, sides, random() * Math.PI)}" fill="url(#subject-gradient)" stroke="${palette.accent}" stroke-width="8"/>`,
    `    <polygon points="${pointsForRegularPolygon(centerX, centerY, number(radius * 0.48), innerSides, random() * Math.PI)}" fill="${palette.deep}" stroke="${palette.grid}" stroke-width="5"/>`
  ].join('\n');
}

function renderBoosterSubject(width, height, palette, random) {
  const centerX = number(width * (0.46 + random() * 0.08));
  const centerY = number(height * (0.38 + random() * 0.04));
  const radius = number(width * (0.19 + random() * 0.025));
  const shards = Array.from({ length: 5 }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / 5;
    const shardX = centerX + Math.cos(angle) * radius * 1.2;
    const shardY = centerY + Math.sin(angle) * radius * 1.2;
    return `    <polygon points="${pointsForRegularPolygon(shardX, shardY, radius * 0.26, 4, angle)}" fill="${index % 2 ? palette.grid : palette.accent}" opacity="0.82"/>`;
  }).join('\n');

  return [
    `    <rect x="${number(width * 0.1)}" y="${number(height * 0.075)}" width="${number(width * 0.8)}" height="${number(height * 0.85)}" rx="${number(width * 0.075)}" fill="none" stroke="${palette.grid}" stroke-width="8" opacity="0.72"/>`,
    `    <circle cx="${centerX}" cy="${centerY}" r="${number(radius * 1.58)}" fill="none" stroke="${palette.accent}" stroke-width="8" opacity="0.36"/>`,
    `    <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="url(#core-gradient)" stroke="${palette.grid}" stroke-width="6"/>`,
    shards
  ].join('\n');
}

function wrapText(value, maximumCharacters, maximumLines = 3) {
  const words = cleanText(value).split(' ').filter(Boolean);
  const lines = [];

  for (const word of words) {
    const chunks = [];
    for (let offset = 0; offset < word.length; offset += maximumCharacters) {
      chunks.push(word.slice(offset, offset + maximumCharacters));
    }

    for (const chunk of chunks) {
      const currentLine = lines.at(-1);
      if (currentLine && `${currentLine} ${chunk}`.length <= maximumCharacters) {
        lines[lines.length - 1] = `${currentLine} ${chunk}`;
      } else {
        lines.push(chunk);
      }
    }
  }

  if (lines.length <= maximumLines) {
    return lines.length > 0 ? lines : ['UNTITLED'];
  }

  const visibleLines = lines.slice(0, maximumLines);
  visibleLines[maximumLines - 1] = `${visibleLines[maximumLines - 1].slice(0, Math.max(1, maximumCharacters - 1))}…`;
  return visibleLines;
}

function getVisualCopy(kind, world, entity) {
  const worldName = cleanText(world.title, cleanText(world.universe, world.key));
  const entityName = cleanText(entity?.name, cleanText(entity?.id, worldName));

  if (kind === 'booster') {
    return {
      eyebrow: 'ORIGINAL WORLD BOOSTER',
      title: worldName,
      subtitle: 'FIVE-CARD BREACH PACK',
      description: `Original booster artwork for the world ${worldName}.`
    };
  }
  if (kind === 'backdrop') {
    return {
      eyebrow: 'ORIGINAL WORLD',
      title: worldName,
      subtitle: 'MULTIVERSE BACKDROP',
      description: `Original environment artwork for the world ${worldName}.`
    };
  }
  if (kind === 'stage') {
    return {
      eyebrow: `ORIGINAL ${cleanText(entity.mode, 'GAMEPLAY')} STAGE`,
      title: entityName,
      subtitle: `${worldName} · ${cleanText(entity.objectiveType, 'MISSION').toUpperCase()}`,
      description: `Original stage artwork for ${entityName} in ${worldName}.`
    };
  }
  if (kind === 'hero') {
    return {
      eyebrow: 'ORIGINAL HERO',
      title: entityName,
      subtitle: worldName,
      description: `Original hero portrait for ${entityName} from ${worldName}.`
    };
  }
  if (kind === 'threat') {
    return {
      eyebrow: entity?.combatRole === 'worldBoss' ? 'ORIGINAL WORLD BOSS' : 'ORIGINAL THREAT',
      title: entityName,
      subtitle: `${worldName} · ${cleanText(entity?.combatRole, 'THREAT').toUpperCase()}`,
      description: `Original threat portrait for ${entityName} from ${worldName}.`
    };
  }
  return {
    eyebrow: 'ORIGINAL ITEM',
    title: entityName,
    subtitle: `${worldName} · ${cleanText(entity.role || entity.tier, 'EQUIPMENT').toUpperCase()}`,
    description: `Original item artwork for ${entityName} from ${worldName}.`
  };
}

function renderSvg(kind, world, entity = null) {
  const { width, height } = DIMENSIONS[kind];
  const palette = getPalette(world);
  const entityIdentifier = entity?.id || world.key;
  const random = createDeterministicRandom(hashString(`${kind}:${world.key}:${entityIdentifier}`));
  const copy = getVisualCopy(kind, world, entity);
  const landscape = kind === 'stage' || kind === 'backdrop';
  const titleLines = wrapText(copy.title, landscape ? 34 : kind === 'item' ? 20 : 22);
  const titleSize = landscape ? 72 : kind === 'item' ? 49 : 58;
  const lineHeight = number(titleSize * 1.08);
  const titleX = landscape ? number(width * 0.08) : number(width * 0.1);
  const titleY = landscape ? number(height * 0.74) : number(height * (kind === 'item' ? 0.7 : 0.73));
  const subtitleY = number(titleY + titleLines.length * lineHeight + (landscape ? 22 : 18));
  const particleCount = landscape ? 44 : 30;
  const motif = renderMotif(world, width, height, palette, random);
  const particles = renderParticles(width, height, palette, random, particleCount);
  const subject = landscape
    ? renderLandscapeSubject(width, height, palette, random, kind === 'stage')
    : kind === 'hero' || kind === 'threat'
      ? renderHeroSubject(width, height, palette, random)
      : kind === 'item'
        ? renderItemSubject(width, height, palette, random)
        : renderBoosterSubject(width, height, palette, random);
  const titleMarkup = titleLines.map((line, index) => (
    `      <tspan x="${titleX}" y="${number(titleY + index * lineHeight)}">${xmlEscape(line)}</tspan>`
  )).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="visual-title visual-description" focusable="false" data-original-visual="true" data-kind="${kind}">
  <title id="visual-title">${xmlEscape(copy.title)}</title>
  <desc id="visual-description">${xmlEscape(copy.description)}</desc>
  <defs>
    <linearGradient id="background-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.surface}"/>
      <stop offset="56%" stop-color="${palette.deep}"/>
      <stop offset="100%" stop-color="${palette.floor}"/>
    </linearGradient>
    <radialGradient id="core-gradient" cx="50%" cy="45%" r="58%">
      <stop offset="0%" stop-color="${palette.text}" stop-opacity="0.92"/>
      <stop offset="36%" stop-color="${palette.grid}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0.08"/>
    </radialGradient>
    <linearGradient id="subject-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.accent}"/>
      <stop offset="100%" stop-color="${palette.grid}"/>
    </linearGradient>
    <linearGradient id="caption-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${palette.deep}" stop-opacity="0"/>
      <stop offset="34%" stop-color="${palette.deep}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${palette.deep}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#background-gradient)"/>
  <g aria-hidden="true">
${particles}
  </g>
  <g aria-hidden="true" opacity="0.74">
${motif}
  </g>
  <g aria-hidden="true">
${subject}
  </g>
  <rect y="${number(height * 0.58)}" width="${width}" height="${number(height * 0.42)}" fill="url(#caption-gradient)"/>
  <g font-family="Inter, ui-sans-serif, system-ui, sans-serif">
    <text x="${titleX}" y="${number(titleY - 42)}" fill="${palette.grid}" font-size="${landscape ? 25 : 22}" font-weight="800" letter-spacing="${landscape ? 6 : 4}">${xmlEscape(copy.eyebrow)}</text>
    <text fill="${palette.text}" font-size="${titleSize}" font-weight="900" letter-spacing="-1">
${titleMarkup}
    </text>
    <text x="${titleX}" y="${subtitleY}" fill="${palette.mutedText}" font-size="${landscape ? 24 : 20}" font-weight="650" letter-spacing="2">${xmlEscape(copy.subtitle)}</text>
    <rect x="${titleX}" y="${number(subtitleY + 26)}" width="${number(landscape ? width * 0.24 : width * 0.34)}" height="${landscape ? 7 : 6}" rx="3" fill="${palette.accent}"/>
  </g>
</svg>
`;
}

function buildVisualPlan(manifest) {
  const universes = requireArray(manifest?.universes, 'manifest.universes');
  if (universes.length === 0) {
    throw new Error('manifest.universes must contain at least one original universe.');
  }

  const entries = [];
  const seenPaths = new Set();
  const seenUniverseKeys = new Set();

  function addEntry(kind, pathSegments, world, entity = null) {
    const outputPath = path.join(REPOSITORY_ROOT, ...pathSegments);
    const collisionKey = path.resolve(outputPath).toLowerCase();
    if (seenPaths.has(collisionKey)) {
      throw new Error(`Two manifest entries target the same output: ${relativePath(outputPath)}.`);
    }
    seenPaths.add(collisionKey);
    entries.push(Object.freeze({
      kind,
      outputPath,
      svg: renderSvg(kind, world, entity)
    }));
  }

  for (const [worldIndex, world] of universes.entries()) {
    if (!world || typeof world !== 'object') {
      throw new Error(`manifest.universes[${worldIndex}] must be an object.`);
    }
    if (world.sourceType !== 'original' || world.isOriginal !== true) {
      throw new Error(`manifest.universes[${worldIndex}] is not marked as original content.`);
    }

    const worldKey = assertSafeSegment(world.key, `manifest.universes[${worldIndex}].key`);
    if (seenUniverseKeys.has(worldKey.toLowerCase())) {
      throw new Error(`Duplicate original universe key: ${worldKey}.`);
    }
    seenUniverseKeys.add(worldKey.toLowerCase());

    addEntry('booster', ['public', 'boosters', 'original-worlds', `${worldKey}.svg`], world);
    addEntry('backdrop', ['public', 'images', 'oc-worlds', worldKey, 'backdrop.svg'], world);

    for (const [stageIndex, stage] of requireArray(world.stages, `${worldKey}.stages`).entries()) {
      const stageId = assertSafeSegment(stage?.id, `${worldKey}.stages[${stageIndex}].id`);
      addEntry('stage', ['public', 'images', 'oc-worlds', worldKey, 'stages', `${stageId}.svg`], world, stage);
    }

    for (const [heroIndex, hero] of requireArray(world.heroes, `${worldKey}.heroes`).entries()) {
      const heroId = assertSafeSegment(hero?.id, `${worldKey}.heroes[${heroIndex}].id`);
      addEntry('hero', ['public', 'images', 'oc-worlds', worldKey, 'heroes', `${heroId}.svg`], world, hero);
    }

    const threats = [
      ...requireArray(world.enemies, `${worldKey}.enemies`),
      ...requireArray(world.bosses, `${worldKey}.bosses`),
      world.worldBoss
    ];
    for (const [threatIndex, threat] of threats.entries()) {
      if (!threat || typeof threat !== 'object') {
        throw new Error(`${worldKey}.threats[${threatIndex}] must be an object.`);
      }
      const threatId = slugifyPathSegment(threat.name, `${worldKey}.threats[${threatIndex}].name`);
      addEntry('threat', ['public', 'images', 'oc-worlds', worldKey, 'threats', `${threatId}.svg`], world, threat);
    }

    const items = [
      ...requireArray(world.gear, `${worldKey}.gear`),
      ...requireArray(world.battleItems, `${worldKey}.battleItems`)
    ];
    for (const [itemIndex, item] of items.entries()) {
      const itemId = assertSafeSegment(item?.id, `${worldKey}.items[${itemIndex}].id`);
      addEntry('item', ['public', 'images', 'oc-worlds', worldKey, 'items', `${itemId}.svg`], world, item);
    }
  }

  return Object.freeze(entries);
}

function relativePath(filePath) {
  return path.relative(REPOSITORY_ROOT, filePath).split(path.sep).join('/');
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function countByKind(entries, predicate = () => true) {
  return Object.fromEntries(VISUAL_KINDS.map(kind => [
    kind,
    entries.filter(entry => entry.kind === kind && predicate(entry)).length
  ]));
}

function reportKindCounts(expectedCounts, actualCounts, actualLabel) {
  for (const kind of VISUAL_KINDS) {
    console.log(`[original-visuals] ${kind}: expected=${expectedCounts[kind]} ${actualLabel}=${actualCounts[kind]}`);
  }
}

async function checkVisuals(entries) {
  const checks = await Promise.all(entries.map(async entry => ({
    ...entry,
    present: await isFile(entry.outputPath)
  })));
  const expectedCounts = countByKind(entries);
  const presentCounts = countByKind(checks, entry => entry.present);
  const missing = checks.filter(entry => !entry.present);

  console.log(`[original-visuals] mode=check expected=${entries.length} present=${entries.length - missing.length} missing=${missing.length}`);
  reportKindCounts(expectedCounts, presentCounts, 'present');

  if (missing.length > 0) {
    const previewLimit = 20;
    for (const entry of missing.slice(0, previewLimit)) {
      console.error(`[original-visuals] missing: ${relativePath(entry.outputPath)}`);
    }
    if (missing.length > previewLimit) {
      console.error(`[original-visuals] missing: …and ${missing.length - previewLimit} more`);
    }
    process.exitCode = 1;
  }
}

async function writeVisuals(entries) {
  const results = [];

  for (const entry of entries) {
    let existing = null;
    try {
      existing = await readFile(entry.outputPath, 'utf8');
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }

    if (existing === entry.svg) {
      results.push({ ...entry, changed: false });
      continue;
    }

    await mkdir(path.dirname(entry.outputPath), { recursive: true });
    await writeFile(entry.outputPath, entry.svg, 'utf8');
    results.push({ ...entry, changed: true });
  }

  const expectedCounts = countByKind(entries);
  const writtenCounts = countByKind(results, entry => entry.changed);
  const written = results.filter(entry => entry.changed).length;

  console.log(`[original-visuals] mode=write expected=${entries.length} written=${written} unchanged=${entries.length - written}`);
  reportKindCounts(expectedCounts, writtenCounts, 'written');
}

async function readManifest() {
  let source;
  try {
    source = await readFile(MANIFEST_PATH, 'utf8');
  } catch (error) {
    throw new Error(`Unable to read ${relativePath(MANIFEST_PATH)}: ${error.message}`, { cause: error });
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`Invalid JSON in ${relativePath(MANIFEST_PATH)}: ${error.message}`, { cause: error });
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const manifest = await readManifest();
  const entries = buildVisualPlan(manifest);

  if (options.check) {
    await checkVisuals(entries);
  } else {
    await writeVisuals(entries);
  }
}

main().catch(error => {
  console.error(`[original-visuals] ${error.message}`);
  process.exitCode = 1;
});
