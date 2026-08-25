import { createHash, randomUUID } from 'node:crypto';
import {
  closeSync,
  copyFileSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PROMPT_RELATIVE_PATH = path.join(
  'public', 'sprites', 'generated', 'openai-sprite-prompts.jsonl'
);
const LEDGER_RELATIVE_PATH = path.join(
  'public', 'sprites', 'generated', 'openai-asset-ledger.jsonl'
);
const GENERATION_ID_PATTERN = /^(?:exec-[a-z0-9-]+|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu;

const HELP = [
  'Usage:',
  '  node scripts/installGeneratedBitmapBatch.mjs --source <image> --kind <kind> --id <id> --generation-id <id> [options]',
  '  node scripts/installGeneratedBitmapBatch.mjs --batch <install-batch.json> [--results <results.json>]',
  '',
  'Single-asset options:',
  '  --generation-prompt-file <file>  Exact prompt passed to built-in image_gen',
  '  --replace true                   Deliberately replace an existing destination',
  '  --repair-enclosed-neutral-background true',
  '                                   Remove large enclosed checkerboard remnants',
  '  --recompose-nine-radial-tiles true',
  '                                   Recompose one validated 1+8 emblem as 1+9',
  '',
  'Batch schemaVersion 1 fields:',
  '  batchId?, promptCatalogSha256?, jobs[]',
  '  jobs: { kind, id, source, generationId, generationPromptFile,',
  '          generationPromptSha256?, catalogPromptSha256?, replace?,',
  '          repairEnclosedNeutralBackground?, recomposeNineRadialTiles? }',
  '',
  'Batch sources and prompts may be absolute or relative to the batch file.',
  'A job may also be a result JSON path or { resultFile: <path> }.'
].join('\n');

export const sha256Buffer = value => createHash('sha256').update(value).digest('hex');
const sha256File = file => sha256Buffer(readFileSync(file));

export const parseArguments = values => {
  const args = {};
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (key === '--help' || key === '-h') {
      args.help = true;
      continue;
    }
    if (!key.startsWith('--')) throw new Error('Unknown argument: ' + key);
    const value = values[index + 1];
    if (!value || value.startsWith('--')) throw new Error('Missing value for ' + key);
    args[key.slice(2)] = value;
    index += 1;
  }
  return args;
};

const installerPaths = root => ({
  promptPath: path.join(root, PROMPT_RELATIVE_PATH),
  ledgerPath: path.join(root, LEDGER_RELATIVE_PATH)
});

const resolvePublicFile = (root, publicPath) => {
  const publicRoot = path.resolve(root, 'public');
  const destination = path.resolve(publicRoot, String(publicPath || '').replace(/^\/+/, ''));
  const relative = path.relative(publicRoot, destination);
  if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
    throw new Error('Public output escapes public/: ' + publicPath);
  }
  return destination;
};

const readJsonLines = file => readFileSync(file, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line));

const loadPromptCatalog = root => {
  const raw = readFileSync(installerPaths(root).promptPath);
  const entries = raw.toString('utf8')
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(line => JSON.parse(line));
  return {
    sha256: sha256Buffer(raw),
    byIdentity: new Map(entries.map(entry => [
      entry.kind + ':' + String(entry.id),
      entry
    ]))
  };
};

const pixelDistance = (red, green, blue, key) => Math.sqrt(
  ((red - key[0]) ** 2) + ((green - key[1]) ** 2) + ((blue - key[2]) ** 2)
);

const isNeutralBackground = (red, green, blue) => (
  Math.min(red, green, blue) >= 190
  && Math.max(red, green, blue) - Math.min(red, green, blue) <= 24
);

const isChromaGreen = (red, green, blue) => (
  green >= 120
  && green - red >= 45
  && green - blue >= 35
  && green >= red * 1.3
  && green >= blue * 1.2
);

const collectBorderKeys = (data, width, height) => {
  const histogram = new Map();
  const add = offset => {
    if (data[offset + 3] < 16) return;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (!isNeutralBackground(red, green, blue) && !isChromaGreen(red, green, blue)) return;
    const key = [red, green, blue]
      .map(value => Math.min(255, Math.round(value / 4) * 4))
      .join(',');
    histogram.set(key, (histogram.get(key) || 0) + 1);
  };
  const stride = Math.max(1, Math.floor(Math.min(width, height) / 256));
  for (let x = 0; x < width; x += stride) {
    add(x * 4);
    add(((height - 1) * width + x) * 4);
  }
  for (let y = 0; y < height; y += stride) {
    add((y * width) * 4);
    add((y * width + width - 1) * 4);
  }
  return [...histogram.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([key]) => key.split(',').map(Number));
};

export const removeConnectedEdgeBackground = (data, width, height) => {
  const keys = collectBorderKeys(data, width, height);
  if (keys.length === 0) return { data, keys, modes: [], removedPixels: 0 };
  const hasGreenKey = keys.some(key => isChromaGreen(key[0], key[1], key[2]));
  const modes = [
    keys.some(key => isNeutralBackground(key[0], key[1], key[2]))
      ? 'neutral-checkerboard'
      : null,
    hasGreenKey ? 'chroma-green' : null
  ].filter(Boolean);
  const pixelCount = width * height;
  const marked = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;
  const isCandidate = pixel => {
    const offset = pixel * 4;
    if (data[offset + 3] <= 12) return false;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    if (hasGreenKey && isChromaGreen(red, green, blue)) return true;
    return keys.some(key => pixelDistance(red, green, blue, key) <= (
      isChromaGreen(key[0], key[1], key[2]) ? 52 : 28
    ));
  };
  const enqueue = pixel => {
    if (pixel < 0 || pixel >= pixelCount || marked[pixel] || !isCandidate(pixel)) return;
    marked[pixel] = 1;
    queue[tail] = pixel;
    tail += 1;
  };
  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }
  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0) enqueue(pixel - 1);
    if (x + 1 < width) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y + 1 < height) enqueue(pixel + width);
  }
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (!marked[pixel]) continue;
    const offset = pixel * 4;
    data[offset] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
    data[offset + 3] = 0;
  }
  return { data, keys, modes, removedPixels: tail };
};

const ENCLOSED_NEUTRAL_MAX_KEY_DISTANCE = 12;
const ENCLOSED_NEUTRAL_MIN_COMPONENT_PIXELS = 256;
const ENCLOSED_NEUTRAL_MIN_TONE_PIXELS = 24;
const ENCLOSED_NEUTRAL_MIN_TONE_DISTANCE = 8;
const ENCLOSED_NEUTRAL_MIN_REPEATED_SCANLINES = 4;
const ENCLOSED_NEUTRAL_MIN_GRID_LINES_PER_AXIS = 2;
const ENCLOSED_NEUTRAL_MIN_GRID_LINE_SUPPORT = 4;

const checkerGridEvidence = ({ component, componentSize, data, width, height, tones }) => {
  const toneClasses = new Int8Array(width * height);
  toneClasses.fill(-1);
  for (let index = 0; index < componentSize; index += 1) {
    const pixel = component[index];
    const offset = pixel * 4;
    const firstDistance = pixelDistance(
      data[offset], data[offset + 1], data[offset + 2], tones[0]
    );
    const secondDistance = pixelDistance(
      data[offset], data[offset + 1], data[offset + 2], tones[1]
    );
    toneClasses[pixel] = firstDistance <= secondDistance ? 0 : 1;
  }
  const rowTransitions = new Uint16Array(height);
  const columnTransitions = new Uint16Array(width);
  const xLineSupport = new Uint32Array(Math.max(0, width - 1));
  const yLineSupport = new Uint32Array(Math.max(0, height - 1));
  let horizontalTransitions = 0;
  let verticalTransitions = 0;
  for (let index = 0; index < componentSize; index += 1) {
    const pixel = component[index];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (
      x + 1 < width
      && toneClasses[pixel + 1] >= 0
      && toneClasses[pixel + 1] !== toneClasses[pixel]
    ) {
      horizontalTransitions += 1;
      rowTransitions[y] += 1;
      xLineSupport[x] += 1;
    }
    if (
      y + 1 < height
      && toneClasses[pixel + width] >= 0
      && toneClasses[pixel + width] !== toneClasses[pixel]
    ) {
      verticalTransitions += 1;
      columnTransitions[x] += 1;
      yLineSupport[y] += 1;
    }
  }
  return {
    horizontalTransitions,
    verticalTransitions,
    rowsWithRepeatedTransitions: [...rowTransitions].filter(count => count >= 2).length,
    columnsWithRepeatedTransitions: [...columnTransitions].filter(count => count >= 2).length,
    supportedVerticalGridLines: [...xLineSupport]
      .filter(count => count >= ENCLOSED_NEUTRAL_MIN_GRID_LINE_SUPPORT).length,
    supportedHorizontalGridLines: [...yLineSupport]
      .filter(count => count >= ENCLOSED_NEUTRAL_MIN_GRID_LINE_SUPPORT).length
  };
};

export const removeEnclosedNeutralBackground = (
  data,
  width,
  height,
  backgroundKeys,
  options = {}
) => {
  const neutralKeys = backgroundKeys.filter(key => (
    isNeutralBackground(key[0], key[1], key[2])
  ));
  const maximumKeyDistance = options.maximumKeyDistance
    ?? ENCLOSED_NEUTRAL_MAX_KEY_DISTANCE;
  const minimumComponentPixels = options.minimumComponentPixels
    ?? ENCLOSED_NEUTRAL_MIN_COMPONENT_PIXELS;
  const minimumTonePixels = options.minimumTonePixels
    ?? ENCLOSED_NEUTRAL_MIN_TONE_PIXELS;
  const minimumToneDistance = options.minimumToneDistance
    ?? ENCLOSED_NEUTRAL_MIN_TONE_DISTANCE;
  if (neutralKeys.length < 2) {
    return {
      data,
      removedPixels: 0,
      removedComponents: 0,
      candidateComponents: 0,
      maximumKeyDistance,
      minimumComponentPixels,
      minimumTonePixels,
      minimumToneDistance,
      removedComponentEvidence: []
    };
  }

  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const component = new Int32Array(pixelCount);
  const matchedKey = pixel => {
    const offset = pixel * 4;
    if (data[offset + 3] <= 12) return -1;
    let closestIndex = -1;
    let closestDistance = maximumKeyDistance + 1;
    for (let index = 0; index < neutralKeys.length; index += 1) {
      const distance = pixelDistance(
        data[offset], data[offset + 1], data[offset + 2], neutralKeys[index]
      );
      if (distance <= maximumKeyDistance && distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    }
    return closestIndex;
  };
  let removedPixels = 0;
  let removedComponents = 0;
  let candidateComponents = 0;
  const removedComponentEvidence = [];

  for (let start = 0; start < pixelCount; start += 1) {
    if (visited[start]) continue;
    const firstKey = matchedKey(start);
    if (firstKey < 0) {
      visited[start] = 1;
      continue;
    }
    candidateComponents += 1;
    let head = 0;
    let tail = 0;
    let componentSize = 0;
    let touchesEdge = false;
    const toneCounts = new Uint32Array(neutralKeys.length);
    const enqueue = pixel => {
      if (pixel < 0 || pixel >= pixelCount || visited[pixel]) return;
      const keyIndex = matchedKey(pixel);
      if (keyIndex < 0) return;
      visited[pixel] = 1;
      queue[tail] = pixel;
      tail += 1;
      toneCounts[keyIndex] += 1;
    };
    enqueue(start);
    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      component[componentSize] = pixel;
      componentSize += 1;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      touchesEdge ||= x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (x > 0) enqueue(pixel - 1);
      if (x + 1 < width) enqueue(pixel + 1);
      if (y > 0) enqueue(pixel - width);
      if (y + 1 < height) enqueue(pixel + width);
    }

    const substantialTones = [...toneCounts.entries()]
      .filter(([, count]) => count >= minimumTonePixels)
      .map(([index]) => index);
    let separatedTonePair = null;
    let separatedToneDistance = 0;
    for (let leftIndex = 0; leftIndex < substantialTones.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < substantialTones.length; rightIndex += 1) {
        const left = substantialTones[leftIndex];
        const right = substantialTones[rightIndex];
        const distance = pixelDistance(...neutralKeys[left], neutralKeys[right]);
        if (distance >= minimumToneDistance && distance > separatedToneDistance) {
          separatedToneDistance = distance;
          separatedTonePair = [neutralKeys[left], neutralKeys[right]];
        }
      }
    }
    const grid = separatedTonePair
      ? checkerGridEvidence({
        component,
        componentSize,
        data,
        width,
        height,
        tones: separatedTonePair
      })
      : null;
    const hasSpatialCheckerGrid = grid && (
      grid.rowsWithRepeatedTransitions >= ENCLOSED_NEUTRAL_MIN_REPEATED_SCANLINES
      && grid.columnsWithRepeatedTransitions >= ENCLOSED_NEUTRAL_MIN_REPEATED_SCANLINES
      && grid.supportedVerticalGridLines >= ENCLOSED_NEUTRAL_MIN_GRID_LINES_PER_AXIS
      && grid.supportedHorizontalGridLines >= ENCLOSED_NEUTRAL_MIN_GRID_LINES_PER_AXIS
    );
    if (
      touchesEdge
      || componentSize < minimumComponentPixels
      || !hasSpatialCheckerGrid
    ) continue;

    removedComponents += 1;
    removedPixels += componentSize;
    removedComponentEvidence.push({
      pixels: componentSize,
      toneDistance: separatedToneDistance,
      ...grid
    });
    for (let index = 0; index < componentSize; index += 1) {
      const offset = component[index] * 4;
      data[offset] = 0;
      data[offset + 1] = 0;
      data[offset + 2] = 0;
      data[offset + 3] = 0;
    }
  }

  return {
    data,
    removedPixels,
    removedComponents,
    candidateComponents,
    maximumKeyDistance,
    minimumComponentPixels,
    minimumTonePixels,
    minimumToneDistance,
    removedComponentEvidence
  };
};

const alphaBounds = (data, width, height) => {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= 12) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  return right < left
    ? null
    : { left, top, width: right - left + 1, height: bottom - top + 1 };
};

const cropRaw = (data, sourceWidth, bounds) => {
  const output = Buffer.alloc(bounds.width * bounds.height * 4);
  for (let y = 0; y < bounds.height; y += 1) {
    const start = (((bounds.top + y) * sourceWidth) + bounds.left) * 4;
    data.copy(output, y * bounds.width * 4, start, start + bounds.width * 4);
  }
  return output;
};

const RADIAL_RECOMPOSITION_REASON = 'exact-nine-pillar-canon-lock';
const RADIAL_RECOMPOSITION_SCALE = 0.85;
const RADIAL_RECOMPOSITION_ROTATION_DEGREES = 40;
const RADIAL_RECOMPOSITION_NEUTRAL_DISTANCE = 12;
const RADIAL_RECOMPOSITION_SAMPLE_RADII = [120, 140, 160, 180, 200, 205];
const RADIAL_RECOMPOSITION_ANGULAR_SAMPLES = 1440;

const materialComponents = (
  data,
  width,
  height,
  backgroundKeys,
  neutralDistance = RADIAL_RECOMPOSITION_NEUTRAL_DISTANCE
) => {
  const neutralKeys = backgroundKeys.filter(key => (
    isNeutralBackground(key[0], key[1], key[2])
  ));
  const pixelCount = width * height;
  const material = new Uint8Array(pixelCount);
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    if (data[offset + 3] <= 12) continue;
    const neutral = neutralKeys.some(key => pixelDistance(
      data[offset], data[offset + 1], data[offset + 2], key
    ) <= neutralDistance);
    if (!neutral) material[pixel] = 1;
  }
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const components = [];
  for (let start = 0; start < pixelCount; start += 1) {
    if (!material[start] || visited[start]) continue;
    let head = 0;
    let tail = 0;
    let sumX = 0;
    let sumY = 0;
    let left = width;
    let top = height;
    let right = -1;
    let bottom = -1;
    const pixels = [];
    visited[start] = 1;
    queue[tail] = start;
    tail += 1;
    while (head < tail) {
      const pixel = queue[head];
      head += 1;
      pixels.push(pixel);
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      sumX += x;
      sumY += y;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
          if (xOffset === 0 && yOffset === 0) continue;
          const neighborX = x + xOffset;
          const neighborY = y + yOffset;
          if (
            neighborX < 0
            || neighborX >= width
            || neighborY < 0
            || neighborY >= height
          ) continue;
          const neighbor = neighborY * width + neighborX;
          if (!material[neighbor] || visited[neighbor]) continue;
          visited[neighbor] = 1;
          queue[tail] = neighbor;
          tail += 1;
        }
      }
    }
    components.push({
      pixels,
      size: pixels.length,
      bounds: {
        left,
        top,
        width: right - left + 1,
        height: bottom - top + 1
      },
      center: {
        x: sumX / pixels.length,
        y: sumY / pixels.length
      }
    });
  }
  return components;
};

const countCircularRuns = values => {
  let runs = 0;
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] && !values[(index + values.length - 1) % values.length]) {
      runs += 1;
    }
  }
  return runs;
};

const closeShortCircularGaps = (values, maximumGapSamples) => {
  const closed = [...values];
  const firstMaterial = closed.findIndex(Boolean);
  if (firstMaterial < 0) return closed;
  let gapIndexes = [];
  for (let step = 1; step <= values.length; step += 1) {
    const index = (firstMaterial + step) % closed.length;
    if (!closed[index]) {
      gapIndexes.push(index);
    } else {
      if (gapIndexes.length > 0 && gapIndexes.length <= maximumGapSamples) {
        for (const gapIndex of gapIndexes) closed[gapIndex] = true;
      }
      gapIndexes = [];
    }
  }
  return closed;
};

const circularRunsWithGapEvidence = (values, maximumNoiseGapSamples = 2) => {
  const rawRuns = countCircularRuns(values);
  const stabilized = closeShortCircularGaps(values, maximumNoiseGapSamples);
  const runs = countCircularRuns(stabilized);
  const gapLengths = [];
  let currentGap = 0;
  if (stabilized.every(Boolean)) {
    return {
      rawRuns,
      runs,
      minimumGapSamples: 0,
      gapLengths: [],
      noiseGapClosureSamples: maximumNoiseGapSamples
    };
  }
  const firstMaterial = stabilized.findIndex(Boolean);
  for (let step = 1; step <= stabilized.length; step += 1) {
    const value = stabilized[(firstMaterial + step) % stabilized.length];
    if (!value) currentGap += 1;
    else if (currentGap > 0) {
      gapLengths.push(currentGap);
      currentGap = 0;
    }
  }
  return {
    rawRuns,
    runs,
    minimumGapSamples: gapLengths.length > 0 ? Math.min(...gapLengths) : 0,
    gapLengths,
    noiseGapClosureSamples: maximumNoiseGapSamples
  };
};

const rotateTileIntoCanvas = ({
  tile,
  tileWidth,
  tileHeight,
  tileLeft,
  tileTop,
  angle,
  centerX,
  centerY,
  output,
  ownership,
  width,
  height,
  owner
}) => {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const corners = [
    [tileLeft, tileTop],
    [tileLeft + tileWidth - 1, tileTop],
    [tileLeft, tileTop + tileHeight - 1],
    [tileLeft + tileWidth - 1, tileTop + tileHeight - 1]
  ].map(([x, y]) => {
    const relativeX = x - centerX;
    const relativeY = y - centerY;
    return [
      centerX + cosine * relativeX - sine * relativeY,
      centerY + sine * relativeX + cosine * relativeY
    ];
  });
  const left = Math.max(0, Math.floor(Math.min(...corners.map(point => point[0]))) - 1);
  const right = Math.min(width - 1, Math.ceil(Math.max(...corners.map(point => point[0]))) + 1);
  const top = Math.max(0, Math.floor(Math.min(...corners.map(point => point[1]))) - 1);
  const bottom = Math.min(height - 1, Math.ceil(Math.max(...corners.map(point => point[1]))) + 1);
  let pixels = 0;
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const relativeX = x - centerX;
      const relativeY = y - centerY;
      const sourceX = Math.round(
        centerX + cosine * relativeX + sine * relativeY - tileLeft
      );
      const sourceY = Math.round(
        centerY - sine * relativeX + cosine * relativeY - tileTop
      );
      if (
        sourceX < 0
        || sourceX >= tileWidth
        || sourceY < 0
        || sourceY >= tileHeight
      ) continue;
      const sourceOffset = (sourceY * tileWidth + sourceX) * 4;
      if (tile[sourceOffset + 3] <= 12) continue;
      const pixel = y * width + x;
      if (ownership[pixel] !== 0) {
        throw new Error('Nine-tile radial recomposition refused: tile overlap detected');
      }
      const destinationOffset = pixel * 4;
      output[destinationOffset] = tile[sourceOffset];
      output[destinationOffset + 1] = tile[sourceOffset + 1];
      output[destinationOffset + 2] = tile[sourceOffset + 2];
      output[destinationOffset + 3] = tile[sourceOffset + 3];
      ownership[pixel] = owner;
      pixels += 1;
    }
  }
  return pixels;
};

export const recomposeNineRadialTiles = async (
  source,
  backgroundKeys,
  options = {}
) => {
  const decoded = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const data = Buffer.from(decoded.data);
  const { width, height } = decoded.info;
  if (width !== 512 || height !== 512) {
    throw new Error('Nine-tile radial recomposition refused: expected normalized 512x512 item');
  }
  const bounds = alphaBounds(data, width, height);
  if (!bounds || bounds.width / bounds.height < 0.85 || bounds.width / bounds.height > 1.15) {
    throw new Error('Nine-tile radial recomposition refused: expected a near-circular emblem');
  }
  const centerX = bounds.left + (bounds.width - 1) / 2;
  const centerY = bounds.top + (bounds.height - 1) / 2;
  if (Math.abs(centerX - 255.5) > 8 || Math.abs(centerY - 255.5) > 8) {
    throw new Error('Nine-tile radial recomposition refused: emblem is not centered');
  }
  const components = materialComponents(data, width, height, backgroundKeys)
    .filter(component => component.size >= 1000);
  if (components.length !== 9) {
    throw new Error(
      'Nine-tile radial recomposition refused: expected one central ring and eight outer tiles'
    );
  }
  const classified = components.map(component => ({
    ...component,
    radius: Math.hypot(component.center.x - centerX, component.center.y - centerY),
    angle: Math.atan2(component.center.y - centerY, component.center.x - centerX)
  }));
  const centralCandidates = classified.filter(component => component.radius <= 12);
  const outerTiles = classified.filter(component => component.radius >= 120);
  if (centralCandidates.length !== 1 || outerTiles.length !== 8) {
    throw new Error(
      'Nine-tile radial recomposition refused: component topology differs from 1+8'
    );
  }
  const central = centralCandidates[0];
  const medianOuterSize = [...outerTiles]
    .map(component => component.size)
    .sort((left, right) => left - right)[Math.floor(outerTiles.length / 2)];
  if (outerTiles.some(component => (
    component.size < medianOuterSize * 0.65
    || component.size > medianOuterSize * 1.35
  ))) {
    throw new Error('Nine-tile radial recomposition refused: outer tile sizes are inconsistent');
  }
  const topTile = [...outerTiles].sort((left, right) => left.center.y - right.center.y)[0];
  const topAngleDelta = Math.abs(topTile.angle + Math.PI / 2);
  if (topAngleDelta > Math.PI / 12) {
    throw new Error('Nine-tile radial recomposition refused: a unique top tile was not found');
  }

  const tileCrop = Buffer.alloc(topTile.bounds.width * topTile.bounds.height * 4);
  for (const pixel of topTile.pixels) {
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const sourceOffset = pixel * 4;
    const destinationOffset = (
      (y - topTile.bounds.top) * topTile.bounds.width
      + (x - topTile.bounds.left)
    ) * 4;
    data.copy(tileCrop, destinationOffset, sourceOffset, sourceOffset + 4);
  }
  const tangentialScale = options.tangentialScale ?? RADIAL_RECOMPOSITION_SCALE;
  if (tangentialScale < 0.84 || tangentialScale > 0.86) {
    throw new Error(
      'Nine-tile radial recomposition refused: tangential scale must stay from 0.84 to 0.86'
    );
  }
  const scaledTileWidth = Math.max(
    1,
    Math.round(topTile.bounds.width * tangentialScale)
  );
  const scaledTile = await sharp(tileCrop, {
    raw: {
      width: topTile.bounds.width,
      height: topTile.bounds.height,
      channels: 4
    }
  }).resize(scaledTileWidth, topTile.bounds.height, {
    fit: 'fill',
    kernel: 'nearest'
  }).raw().toBuffer();
  const tileLeft = Math.round(centerX - (scaledTileWidth - 1) / 2);
  const tileTop = topTile.bounds.top;

  const output = Buffer.alloc(width * height * 4);
  const ownership = new Uint8Array(width * height);
  for (const pixel of central.pixels) {
    const offset = pixel * 4;
    data.copy(output, offset, offset, offset + 4);
    ownership[pixel] = 1;
  }
  const copyPixelCounts = [];
  for (let tileIndex = 0; tileIndex < 9; tileIndex += 1) {
    copyPixelCounts.push(rotateTileIntoCanvas({
      tile: scaledTile,
      tileWidth: scaledTileWidth,
      tileHeight: topTile.bounds.height,
      tileLeft,
      tileTop,
      angle: tileIndex * RADIAL_RECOMPOSITION_ROTATION_DEGREES * Math.PI / 180,
      centerX,
      centerY,
      output,
      ownership,
      width,
      height,
      owner: tileIndex + 2
    }));
  }

  for (const pixel of central.pixels) {
    const offset = pixel * 4;
    if (!output.subarray(offset, offset + 4).equals(data.subarray(offset, offset + 4))) {
      throw new Error('Nine-tile radial recomposition refused: central ring changed');
    }
  }
  const outputComponents = materialComponents(output, width, height, [])
    .filter(component => component.size >= 1000);
  const outputCentral = outputComponents.filter(component => (
    Math.hypot(component.center.x - centerX, component.center.y - centerY) <= 12
  ));
  const outputTiles = outputComponents.filter(component => (
    Math.hypot(component.center.x - centerX, component.center.y - centerY) >= 120
  ));
  if (outputCentral.length !== 1 || outputTiles.length !== 9) {
    throw new Error(
      'Nine-tile radial recomposition refused: output is not one ring plus nine separate tiles'
    );
  }
  const angularEvidence = RADIAL_RECOMPOSITION_SAMPLE_RADII.map(radius => {
    const samples = Array.from(
      { length: RADIAL_RECOMPOSITION_ANGULAR_SAMPLES },
      (_, index) => {
        const angle = index * Math.PI * 2 / RADIAL_RECOMPOSITION_ANGULAR_SAMPLES;
        const x = Math.round(centerX + Math.cos(angle) * radius);
        const y = Math.round(centerY + Math.sin(angle) * radius);
        return output[(y * width + x) * 4 + 3] > 12;
      }
    );
    return {
      radius,
      ...circularRunsWithGapEvidence(samples)
    };
  });
  if (angularEvidence.some(sample => (
    sample.runs !== 9 || sample.minimumGapSamples < 4
  ))) {
    throw new Error(
      `Nine-tile radial recomposition refused: nine clear exterior gaps were not preserved ${JSON.stringify(angularEvidence)}`
    );
  }

  return {
    buffer: await sharp(output, {
      raw: { width, height, channels: 4 }
    }).png({ compressionLevel: 9 }).toBuffer(),
    processing: {
      operation: 'openai-tile-radial-recomposition',
      reason: RADIAL_RECOMPOSITION_REASON,
      inputTopology: {
        centralRings: 1,
        outerTiles: 8
      },
      outputTopology: {
        centralRings: 1,
        outerTiles: 9
      },
      sourceTile: {
        position: 'top',
        bounds: topTile.bounds,
        pixels: topTile.size
      },
      count: 9,
      rotationDegrees: RADIAL_RECOMPOSITION_ROTATION_DEGREES,
      tangentialScale,
      copyPixelCounts,
      overlapPixels: 0,
      centralRingPixelsPreserved: central.size,
      angularEvidence
    }
  };
};

const normalizeItem = async (source, options = {}) => {
  const decoded = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cleaned = removeConnectedEdgeBackground(
    Buffer.from(decoded.data), decoded.info.width, decoded.info.height
  );
  const enclosed = options.repairEnclosedNeutralBackground
    ? removeEnclosedNeutralBackground(
      cleaned.data,
      decoded.info.width,
      decoded.info.height,
      cleaned.keys
    )
    : null;
  const bounds = alphaBounds(cleaned.data, decoded.info.width, decoded.info.height);
  if (!bounds) throw new Error('Generated item icon is empty after background removal');
  const subject = cropRaw(cleaned.data, decoded.info.width, bounds);
  const scale = Math.min(440 / bounds.width, 440 / bounds.height);
  const width = Math.max(1, Math.round(bounds.width * scale));
  const height = Math.max(1, Math.round(bounds.height * scale));
  const resized = await sharp(subject, {
    raw: { width: bounds.width, height: bounds.height, channels: 4 }
  }).resize(width, height, { kernel: 'nearest' }).png().toBuffer();
  let buffer = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([{
    input: resized,
    left: Math.floor((512 - width) / 2),
    top: Math.floor((512 - height) / 2)
  }]).png({ compressionLevel: 9 }).toBuffer();
  const radialRecomposition = options.recomposeNineRadialTiles
    ? await recomposeNineRadialTiles(buffer, cleaned.keys)
    : null;
  if (radialRecomposition) buffer = radialRecomposition.buffer;
  const operation = (
    enclosed
      ? 'connected-edge-background-removal+enclosed-neutral-background-repair+item-normalization'
      : 'connected-edge-background-removal+item-normalization'
  ) + (radialRecomposition ? '+openai-tile-radial-recomposition' : '');
  return {
    buffer,
    processing: {
      operation,
      backgroundKeys: cleaned.keys,
      backgroundModes: cleaned.modes,
      removedBackgroundPixels: cleaned.removedPixels,
      ...(enclosed ? {
        enclosedNeutralBackgroundRepair: {
          enabled: true,
          removedPixels: enclosed.removedPixels,
          removedComponents: enclosed.removedComponents,
          candidateComponents: enclosed.candidateComponents,
          maximumKeyDistance: enclosed.maximumKeyDistance,
          minimumComponentPixels: enclosed.minimumComponentPixels,
          minimumTonePixels: enclosed.minimumTonePixels,
          minimumToneDistance: enclosed.minimumToneDistance,
          componentEvidence: enclosed.removedComponentEvidence
        }
      } : {}),
      ...(radialRecomposition ? {
        openAiTileRadialRecomposition: radialRecomposition.processing
      } : {}),
      padding: 36
    }
  };
};

const normalizeSheet = async source => {
  const decoded = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cleaned = removeConnectedEdgeBackground(
    Buffer.from(decoded.data), decoded.info.width, decoded.info.height
  );
  const xEdges = Array.from({ length: 5 }, (_, index) => (
    Math.round(index * decoded.info.width / 4)
  ));
  const yEdges = Array.from({ length: 5 }, (_, index) => (
    Math.round(index * decoded.info.height / 4)
  ));
  const frames = [];
  for (let cell = 0; cell < 16; cell += 1) {
    const row = Math.floor(cell / 4);
    const column = cell % 4;
    const cellBounds = {
      left: xEdges[column],
      top: yEdges[row],
      width: xEdges[column + 1] - xEdges[column],
      height: yEdges[row + 1] - yEdges[row]
    };
    const cellData = cropRaw(cleaned.data, decoded.info.width, cellBounds);
    const bounds = alphaBounds(cellData, cellBounds.width, cellBounds.height);
    if (!bounds) throw new Error('Generated sheet has an empty cell at index ' + cell);
    frames.push({
      data: cropRaw(cellData, cellBounds.width, bounds),
      width: bounds.width,
      height: bounds.height
    });
  }
  const output = Buffer.alloc(1024 * 1024 * 4);
  let minimumGuard = 256;
  for (let cell = 0; cell < frames.length; cell += 1) {
    const frame = frames[cell];
    const scale = Math.min(232 / frame.width, 232 / frame.height);
    const width = Math.max(1, Math.round(frame.width * scale));
    const height = Math.max(1, Math.round(frame.height * scale));
    const resized = await sharp(frame.data, {
      raw: { width: frame.width, height: frame.height, channels: 4 }
    }).resize(width, height, { kernel: 'nearest' }).raw().toBuffer();
    const row = Math.floor(cell / 4);
    const column = cell % 4;
    const x = column * 256 + Math.floor((256 - width) / 2);
    const y = row * 256 + Math.max(12, 244 - height);
    minimumGuard = Math.min(
      minimumGuard,
      x - column * 256,
      y - row * 256,
      256 - ((x - column * 256) + width),
      256 - ((y - row * 256) + height)
    );
    for (let frameY = 0; frameY < height; frameY += 1) {
      const sourceStart = frameY * width * 4;
      const destinationStart = ((y + frameY) * 1024 + x) * 4;
      resized.copy(
        output,
        destinationStart,
        sourceStart,
        sourceStart + width * 4
      );
    }
  }
  return {
    buffer: await sharp(output, {
      raw: { width: 1024, height: 1024, channels: 4 }
    }).png({ compressionLevel: 9 }).toBuffer(),
    processing: {
      operation: 'connected-edge-background-removal+strict-4x4-normalization',
      backgroundKeys: cleaned.keys,
      backgroundModes: cleaned.modes,
      removedBackgroundPixels: cleaned.removedPixels,
      nonemptyCells: 16,
      minimumGuard
    }
  };
};

const normalizeStage = async source => ({
  buffer: await sharp(source)
    .resize(1536, 864, { fit: 'cover', position: 'centre' })
    .removeAlpha()
    .webp({ quality: 88, effort: 5 })
    .toBuffer(),
  processing: {
    operation: 'stage-cover-normalization',
    dimensions: '1536x864',
    format: 'webp',
    quality: 88
  }
});

export const normalizeGeneratedSource = (source, kind, options = {}) => (
  kind === 'stage'
    ? normalizeStage(source)
    : kind === 'item'
      ? normalizeItem(source, options)
      : normalizeSheet(source)
);

export const atomicWriteTextFile = (target, value, options = {}) => {
  mkdirSync(path.dirname(target), { recursive: true });
  const temporary = path.join(
    path.dirname(target),
    '.' + path.basename(target) + '.tmp-' + process.pid + '-' + randomUUID()
  );
  let descriptor = null;
  try {
    descriptor = openSync(temporary, 'wx');
    writeFileSync(descriptor, value, 'utf8');
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = null;
    if (options.beforeRename) options.beforeRename(temporary, target);
    renameSync(temporary, target);
  } catch (error) {
    if (descriptor !== null) closeSync(descriptor);
    rmSync(temporary, { force: true });
    throw error;
  }
};

const acquireLock = root => {
  const ledgerPath = installerPaths(root).ledgerPath;
  mkdirSync(path.dirname(ledgerPath), { recursive: true });
  const lockPath = ledgerPath + '.install.lock';
  let descriptor;
  try {
    descriptor = openSync(lockPath, 'wx');
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      throw new Error(
        'Another sprite installer owns ' + lockPath
        + '. Confirm that process stopped before removing the lock.'
      );
    }
    throw error;
  }
  writeFileSync(descriptor, JSON.stringify({
    pid: process.pid,
    startedAt: new Date().toISOString()
  }), 'utf8');
  fsyncSync(descriptor);
  closeSync(descriptor);
  return () => rmSync(lockPath, { force: true });
};

const resolveInputPath = (value, baseDirectory) => (
  path.isAbsolute(value) ? path.normalize(value) : path.resolve(baseDirectory, value)
);

const normalizeBatchJob = (input, baseDirectory) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Every batch job must be an object');
  }
  if (input.status && input.status !== 'complete') {
    throw new Error(
      (input.kind || 'unknown') + '/' + (input.id || 'unknown')
      + ': result status must be complete'
    );
  }
  const merged = {
    ...input,
    ...(input.result && typeof input.result === 'object' ? input.result : {})
  };
  const sourceValue = typeof merged.source === 'string'
    ? merged.source
    : merged.source && (merged.source.rawPath || merged.source.originalPath);
  const promptValue = merged.generationPromptFile || merged['generation-prompt-file'];
  return {
    kind: merged.kind,
    id: merged.id,
    source: sourceValue ? resolveInputPath(sourceValue, baseDirectory) : null,
    generationId: merged.generationId || merged['generation-id'],
    generationPromptFile: promptValue
      ? resolveInputPath(promptValue, baseDirectory)
      : null,
    generationPromptSha256: merged.generationPromptSha256 || null,
    catalogPromptSha256: merged.catalogPromptSha256 || null,
    replace: merged.replace === true || merged.replace === 'true',
    repairEnclosedNeutralBackground: (
      merged.repairEnclosedNeutralBackground === true
      || merged.repairEnclosedNeutralBackground === 'true'
      || merged['repair-enclosed-neutral-background'] === 'true'
    ),
    recomposeNineRadialTiles: (
      merged.recomposeNineRadialTiles === true
      || merged.recomposeNineRadialTiles === 'true'
      || merged['recompose-nine-radial-tiles'] === 'true'
    )
  };
};

const loadBatchDocument = batchPath => {
  const document = JSON.parse(readFileSync(batchPath, 'utf8'));
  if (document.schemaVersion !== 1) throw new Error('Batch schemaVersion must be 1');
  const entries = Array.isArray(document.jobs)
    ? document.jobs
    : Array.isArray(document.results)
      ? document.results
      : document.status
        ? [document]
        : null;
  if (!entries || entries.length === 0) throw new Error('Batch document contains no jobs');
  const batchDirectory = path.dirname(batchPath);
  const jobs = entries.map(entry => {
    if (typeof entry === 'string' || (entry && entry.resultFile)) {
      const resultPath = resolveInputPath(
        typeof entry === 'string' ? entry : entry.resultFile,
        batchDirectory
      );
      return normalizeBatchJob(
        JSON.parse(readFileSync(resultPath, 'utf8')),
        path.dirname(resultPath)
      );
    }
    return normalizeBatchJob(entry, batchDirectory);
  });
  return { document, jobs };
};

const prepareJob = async ({
  root,
  job,
  promptCatalog,
  stagingRoot,
  requireGenerationPrompt
}) => {
  const label = (job.kind || 'unknown') + '/' + (job.id || 'unknown');
  for (const key of ['source', 'kind', 'id', 'generationId']) {
    if (!job[key]) throw new Error(label + ': missing ' + key);
  }
  if (!GENERATION_ID_PATTERN.test(String(job.generationId))) {
    throw new Error(label + ': invalid built-in image_gen generation id');
  }
  if (!existsSync(job.source)) throw new Error(label + ': source does not exist');
  if (requireGenerationPrompt && !job.generationPromptFile) {
    throw new Error(label + ': batch installs require generationPromptFile');
  }
  if (job.generationPromptFile && !existsSync(job.generationPromptFile)) {
    throw new Error(label + ': generation prompt file does not exist');
  }
  const promptEntry = promptCatalog.byIdentity.get(job.kind + ':' + String(job.id));
  if (!promptEntry) throw new Error('Unknown prompt entry: ' + label);
  const catalogPromptSha256 = sha256Buffer(Buffer.from(promptEntry.prompt, 'utf8'));
  if (job.catalogPromptSha256 && job.catalogPromptSha256 !== catalogPromptSha256) {
    throw new Error(label + ': catalog prompt hash changed after planning');
  }
  const generationPrompt = job.generationPromptFile
    ? readFileSync(job.generationPromptFile, 'utf8').trim()
    : null;
  const generationPromptSha256 = generationPrompt
    ? sha256Buffer(Buffer.from(generationPrompt, 'utf8'))
    : null;
  if (
    job.generationPromptSha256
    && job.generationPromptSha256 !== generationPromptSha256
  ) {
    throw new Error(label + ': generation prompt hash differs from result');
  }
  const destination = resolvePublicFile(root, promptEntry.output);
  if (existsSync(destination) && !job.replace) {
    throw new Error('Destination already exists; set replace=true: ' + destination);
  }
  const sourceMetadata = await sharp(job.source).metadata();
  const normalized = await normalizeGeneratedSource(job.source, job.kind, {
    repairEnclosedNeutralBackground: job.repairEnclosedNeutralBackground,
    recomposeNineRadialTiles: job.recomposeNineRadialTiles
  });
  const outputMetadata = await sharp(normalized.buffer).metadata();
  const stagedPath = path.join(stagingRoot, randomUUID() + '.asset');
  writeFileSync(stagedPath, normalized.buffer);
  const record = {
    schemaVersion: 2,
    kind: job.kind,
    id: job.id,
    universe: promptEntry.universe,
    name: promptEntry.name,
    output: promptEntry.output,
    prompt: promptEntry.prompt,
    promptSha256: catalogPromptSha256,
    catalogPrompt: promptEntry.prompt,
    catalogPromptSha256,
    generationPrompt,
    generationPromptSha256,
    generationPromptStatus: generationPrompt
      ? 'recorded-verbatim'
      : 'catalog-prompt-with-tool-augmentation-not-recorded',
    generation: {
      provider: 'OpenAI',
      interface: 'built-in image_gen',
      generationId: job.generationId
    },
    sourceImage: {
      fileName: path.basename(job.source),
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      format: sourceMetadata.format,
      sha256: sha256File(job.source)
    },
    processing: normalized.processing,
    image: {
      width: outputMetadata.width,
      height: outputMetadata.height,
      format: outputMetadata.format,
      channels: outputMetadata.channels,
      bytes: normalized.buffer.length,
      sha256: sha256Buffer(normalized.buffer)
    },
    installedAt: new Date().toISOString()
  };
  return { destination, job, record, stagedPath };
};

const assertUniqueJobs = prepared => {
  const identities = new Set();
  const destinations = new Set();
  for (const asset of prepared) {
    const identity = asset.record.kind + ':' + asset.record.id;
    if (identities.has(identity)) throw new Error('Duplicate batch identity: ' + identity);
    identities.add(identity);
    const destination = path.normalize(asset.destination).toLocaleLowerCase('en');
    if (destinations.has(destination)) {
      throw new Error('Duplicate batch output: ' + asset.record.output);
    }
    destinations.add(destination);
  }
};

const rollbackPromotions = promotions => {
  for (const promotion of [...promotions].reverse()) {
    rmSync(promotion.temporaryPath, { force: true });
    if (promotion.published) rmSync(promotion.destination, { force: true });
    if (promotion.backupPath && existsSync(promotion.backupPath)) {
      renameSync(promotion.backupPath, promotion.destination);
    }
  }
};

const commitPrepared = ({
  ledgerPath,
  previousLedger,
  prepared,
  hooks
}) => {
  const promotions = [];
  try {
    for (const asset of prepared) {
      mkdirSync(path.dirname(asset.destination), { recursive: true });
      if (existsSync(asset.destination) && !asset.job.replace) {
        throw new Error('Destination appeared during commit: ' + asset.destination);
      }
      const token = process.pid + '-' + randomUUID();
      const promotion = {
        destination: asset.destination,
        temporaryPath: path.join(
          path.dirname(asset.destination),
          '.' + path.basename(asset.destination) + '.incoming-' + token
        ),
        backupPath: null,
        published: false
      };
      promotions.push(promotion);
      copyFileSync(asset.stagedPath, promotion.temporaryPath);
      if (existsSync(asset.destination)) {
        promotion.backupPath = path.join(
          path.dirname(asset.destination),
          '.' + path.basename(asset.destination) + '.backup-' + token
        );
        renameSync(asset.destination, promotion.backupPath);
      }
      renameSync(promotion.temporaryPath, asset.destination);
      promotion.published = true;
    }
    if (hooks.beforeLedgerCommit) hooks.beforeLedgerCommit(prepared);
    const replaced = new Set(prepared.map(asset => (
      asset.record.kind + ':' + asset.record.id
    )));
    const nextLedger = [
      ...previousLedger.filter(entry => !replaced.has(entry.kind + ':' + entry.id)),
      ...prepared.map(asset => asset.record)
    ];
    atomicWriteTextFile(
      ledgerPath,
      nextLedger.map(entry => JSON.stringify(entry)).join('\n') + '\n',
      { beforeRename: hooks.beforeLedgerRename }
    );
  } catch (error) {
    rollbackPromotions(promotions);
    throw error;
  }
  for (const promotion of promotions) {
    if (promotion.backupPath) rmSync(promotion.backupPath, { force: true });
  }
};

export const installJobs = async ({
  root = process.cwd(),
  jobs,
  promptCatalogSha256 = null,
  requireGenerationPrompt = false,
  hooks = {}
}) => {
  if (!Array.isArray(jobs) || jobs.length === 0) throw new Error('No install jobs supplied');
  const releaseLock = acquireLock(root);
  let stagingRoot = null;
  try {
    stagingRoot = hooks.createStagingRoot
      ? hooks.createStagingRoot()
      : mkdtempSync(path.join(os.tmpdir(), 'multiverse-sprite-install-'));
    const promptCatalog = loadPromptCatalog(root);
    if (promptCatalogSha256 && promptCatalogSha256 !== promptCatalog.sha256) {
      throw new Error('Prompt catalog hash changed after batch planning');
    }
    const ledgerPath = installerPaths(root).ledgerPath;
    const previousLedger = existsSync(ledgerPath) ? readJsonLines(ledgerPath) : [];
    const prepared = [];
    for (const job of jobs) {
      prepared.push(await prepareJob({
        root,
        job,
        promptCatalog,
        stagingRoot,
        requireGenerationPrompt
      }));
    }
    assertUniqueJobs(prepared);
    commitPrepared({
      ledgerPath,
      previousLedger,
      prepared,
      hooks
    });
    return {
      promptCatalogSha256: promptCatalog.sha256,
      records: prepared.map(asset => asset.record)
    };
  } finally {
    try {
      if (stagingRoot) {
        rmSync(stagingRoot, { recursive: true, force: true });
      }
    } finally {
      releaseLock();
    }
  }
};

const defaultResultsPath = batchPath => (
  batchPath.toLowerCase().endsWith('.json')
    ? batchPath.slice(0, -5) + '.results.json'
    : batchPath + '.results.json'
);

const resultRecords = records => records.map(record => ({
  kind: record.kind,
  id: record.id,
  output: record.output,
  generationId: record.generation.generationId,
  generationPromptSha256: record.generationPromptSha256,
  outputSha256: record.image.sha256,
  bytes: record.image.bytes
}));

export const installBatchFile = async ({
  root = process.cwd(),
  batchPath,
  resultsPath = null,
  hooks = {}
}) => {
  const absoluteBatchPath = path.resolve(batchPath);
  const absoluteResultsPath = path.resolve(
    resultsPath || defaultResultsPath(absoluteBatchPath)
  );
  if (absoluteBatchPath === absoluteResultsPath) {
    throw new Error('Batch and results paths must differ');
  }
  let document = null;
  let jobs = [];
  try {
    ({ document, jobs } = loadBatchDocument(absoluteBatchPath));
    const installed = await installJobs({
      root,
      jobs,
      promptCatalogSha256: document.promptCatalogSha256 || null,
      requireGenerationPrompt: true,
      hooks
    });
    const result = {
      schemaVersion: 1,
      batchId: document.batchId || null,
      status: 'complete',
      promptCatalogSha256: installed.promptCatalogSha256,
      counts: {
        requested: jobs.length,
        installed: installed.records.length,
        failed: 0
      },
      records: resultRecords(installed.records),
      completedAt: new Date().toISOString()
    };
    atomicWriteTextFile(
      absoluteResultsPath,
      JSON.stringify(result, null, 2) + '\n'
    );
    return result;
  } catch (error) {
    const result = {
      schemaVersion: 1,
      batchId: document && document.batchId ? document.batchId : null,
      status: 'failed',
      counts: {
        requested: jobs.length,
        installed: 0,
        failed: jobs.length || 1
      },
      error: error instanceof Error ? error.message : String(error),
      failedAt: new Date().toISOString()
    };
    atomicWriteTextFile(
      absoluteResultsPath,
      JSON.stringify(result, null, 2) + '\n'
    );
    throw error;
  }
};

export const installSingleAsset = async ({
  root = process.cwd(),
  args,
  hooks = {}
}) => {
  for (const required of ['source', 'kind', 'id', 'generation-id']) {
    if (!args[required]) throw new Error('Missing --' + required);
  }
  const installed = await installJobs({
    root,
    jobs: [{
      source: path.resolve(args.source),
      kind: args.kind,
      id: args.id,
      generationId: args['generation-id'],
      generationPromptFile: args['generation-prompt-file']
        ? path.resolve(args['generation-prompt-file'])
        : null,
      replace: args.replace === 'true',
      repairEnclosedNeutralBackground: (
        args['repair-enclosed-neutral-background'] === 'true'
      ),
      recomposeNineRadialTiles: (
        args['recompose-nine-radial-tiles'] === 'true'
      )
    }],
    hooks
  });
  return installed.records[0];
};

export const runCli = async (
  argv = process.argv.slice(2),
  options = {}
) => {
  const args = parseArguments(argv);
  const root = options.root || process.cwd();
  if (args.help) {
    console.log(HELP);
    return null;
  }
  if (args.batch) {
    const result = await installBatchFile({
      root,
      batchPath: args.batch,
      resultsPath: args.results || null
    });
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  const record = await installSingleAsset({ root, args });
  console.log(JSON.stringify(record, null, 2));
  return record;
};

if (
  process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  runCli().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
