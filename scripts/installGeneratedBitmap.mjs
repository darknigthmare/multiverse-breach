import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const promptPath = path.join(root, 'public', 'sprites', 'generated', 'openai-sprite-prompts.jsonl');
const ledgerPath = path.join(root, 'public', 'sprites', 'generated', 'openai-asset-ledger.jsonl');

const parseArguments = values => {
  const args = {};
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith('--')) throw new Error(`Unknown argument: ${key}`);
    const value = values[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`);
    args[key.slice(2)] = value;
    index += 1;
  }
  return args;
};

const sha256Buffer = value => createHash('sha256').update(value).digest('hex');
const sha256File = file => sha256Buffer(readFileSync(file));
const publicFile = publicPath => path.join(root, 'public', publicPath.replace(/^\/+/, ''));
const loadPrompts = () => readFileSync(promptPath, 'utf8')
  .split(/\r?\n/u)
  .filter(Boolean)
  .map(line => JSON.parse(line));

const pixelDistance = (red, green, blue, key) => Math.sqrt(
  ((red - key[0]) ** 2) + ((green - key[1]) ** 2) + ((blue - key[2]) ** 2)
);

const collectBorderKeys = (data, width, height) => {
  const histogram = new Map();
  const add = offset => {
    if (data[offset + 3] < 16) return;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
    if (Math.min(red, green, blue) < 190 || spread > 24) return;
    const key = [red, green, blue].map(value => Math.min(255, Math.round(value / 4) * 4)).join(',');
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
    .slice(0, 4)
    .map(([key]) => key.split(',').map(Number));
};

const removeGeneratedCheckerboard = (data, width, height) => {
  const keys = collectBorderKeys(data, width, height);
  if (keys.length === 0) return { data, keys, removedPixels: 0 };
  const pixelCount = width * height;
  const background = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;
  const isCandidate = pixel => {
    const offset = pixel * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    return data[offset + 3] > 12 && keys.some(key => pixelDistance(red, green, blue, key) <= 28);
  };
  const enqueue = pixel => {
    if (pixel < 0 || pixel >= pixelCount || background[pixel] || !isCandidate(pixel)) return;
    background[pixel] = 1;
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
    if (!background[pixel]) continue;
    const offset = pixel * 4;
    data[offset] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
    data[offset + 3] = 0;
  }
  return { data, keys, removedPixels: tail };
};

const findAlphaBounds = (data, width, height, threshold = 12) => {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= threshold) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  return right < left ? null : { left, top, width: right - left + 1, height: bottom - top + 1 };
};

const cropRaw = (data, sourceWidth, bounds) => {
  const output = Buffer.alloc(bounds.width * bounds.height * 4);
  for (let y = 0; y < bounds.height; y += 1) {
    const sourceStart = (((bounds.top + y) * sourceWidth) + bounds.left) * 4;
    const sourceEnd = sourceStart + bounds.width * 4;
    data.copy(output, y * bounds.width * 4, sourceStart, sourceEnd);
  }
  return output;
};

const normalizeSheet = async source => {
  const { data: decoded, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cleaned = removeGeneratedCheckerboard(Buffer.from(decoded), info.width, info.height);
  const xEdges = Array.from({ length: 5 }, (_, index) => Math.round(index * info.width / 4));
  const yEdges = Array.from({ length: 5 }, (_, index) => Math.round(index * info.height / 4));
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
    const cellData = cropRaw(cleaned.data, info.width, cellBounds);
    const bounds = findAlphaBounds(cellData, cellBounds.width, cellBounds.height);
    if (!bounds) throw new Error(`Generated sheet has an empty cell at index ${cell}`);
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
      const sourceEnd = sourceStart + width * 4;
      const destinationStart = ((y + frameY) * 1024 + x) * 4;
      resized.copy(output, destinationStart, sourceStart, sourceEnd);
    }
  }
  return {
    buffer: await sharp(output, { raw: { width: 1024, height: 1024, channels: 4 } })
      .png({ compressionLevel: 9 }).toBuffer(),
    processing: {
      operation: 'checkerboard-removal+strict-4x4-normalization',
      backgroundKeys: cleaned.keys,
      removedBackgroundPixels: cleaned.removedPixels,
      nonemptyCells: 16,
      minimumGuard
    }
  };
};

const normalizeItem = async source => {
  const { data: decoded, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const cleaned = removeGeneratedCheckerboard(Buffer.from(decoded), info.width, info.height);
  const bounds = findAlphaBounds(cleaned.data, info.width, info.height);
  if (!bounds) throw new Error('Generated item icon is empty after background removal');
  const item = cropRaw(cleaned.data, info.width, bounds);
  const scale = Math.min(440 / bounds.width, 440 / bounds.height);
  const width = Math.max(1, Math.round(bounds.width * scale));
  const height = Math.max(1, Math.round(bounds.height * scale));
  const resized = await sharp(item, { raw: { width: bounds.width, height: bounds.height, channels: 4 } })
    .resize(width, height, { kernel: 'nearest' }).png().toBuffer();
  return {
    buffer: await sharp({
      create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    }).composite([{ input: resized, left: Math.floor((512 - width) / 2), top: Math.floor((512 - height) / 2) }])
      .png({ compressionLevel: 9 }).toBuffer(),
    processing: {
      operation: 'checkerboard-removal+item-normalization',
      backgroundKeys: cleaned.keys,
      removedBackgroundPixels: cleaned.removedPixels,
      padding: 36
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

const main = async () => {
  const args = parseArguments(process.argv.slice(2));
  for (const required of ['source', 'kind', 'id', 'generation-id']) {
    if (!args[required]) throw new Error(`Missing --${required}`);
  }
  const source = path.resolve(args.source);
  if (!existsSync(source)) throw new Error(`Source does not exist: ${source}`);
  const generationPromptFile = args['generation-prompt-file'] ? path.resolve(args['generation-prompt-file']) : null;
  if (generationPromptFile && !existsSync(generationPromptFile)) {
    throw new Error(`Generation prompt file does not exist: ${generationPromptFile}`);
  }
  const generationPrompt = generationPromptFile ? readFileSync(generationPromptFile, 'utf8').trim() : null;
  const promptEntry = loadPrompts().find(entry => entry.kind === args.kind && String(entry.id) === args.id);
  if (!promptEntry) throw new Error(`Unknown prompt entry: ${args.kind}/${args.id}`);
  const destination = publicFile(promptEntry.output);
  if (existsSync(destination) && args.replace !== 'true') {
    throw new Error(`Destination already exists; pass --replace true to replace deliberately: ${destination}`);
  }
  const sourceMetadata = await sharp(source).metadata();
  const normalized = args.kind === 'stage'
    ? await normalizeStage(source)
    : args.kind === 'item'
      ? await normalizeItem(source)
      : await normalizeSheet(source);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, normalized.buffer);
  const outputMetadata = await sharp(destination).metadata();
  const catalogPromptSha256 = sha256Buffer(Buffer.from(promptEntry.prompt, 'utf8'));
  const record = {
    schemaVersion: 2,
    kind: args.kind,
    id: args.id,
    universe: promptEntry.universe,
    name: promptEntry.name,
    output: promptEntry.output,
    prompt: promptEntry.prompt,
    promptSha256: catalogPromptSha256,
    catalogPrompt: promptEntry.prompt,
    catalogPromptSha256,
    generationPrompt,
    generationPromptSha256: generationPrompt ? sha256Buffer(Buffer.from(generationPrompt, 'utf8')) : null,
    generationPromptStatus: generationPrompt
      ? 'recorded-verbatim'
      : 'catalog-prompt-with-tool-augmentation-not-recorded',
    generation: {
      provider: 'OpenAI',
      interface: 'built-in image_gen',
      generationId: args['generation-id']
    },
    sourceImage: {
      fileName: path.basename(source),
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      format: sourceMetadata.format,
      sha256: sha256File(source)
    },
    processing: normalized.processing,
    image: {
      width: outputMetadata.width,
      height: outputMetadata.height,
      format: outputMetadata.format,
      channels: outputMetadata.channels,
      bytes: normalized.buffer.length,
      sha256: sha256File(destination)
    },
    installedAt: new Date().toISOString()
  };
  const previous = existsSync(ledgerPath)
    ? readFileSync(ledgerPath, 'utf8').split(/\r?\n/u).filter(Boolean).map(line => JSON.parse(line))
    : [];
  const next = previous.filter(entry => !(entry.kind === record.kind && entry.id === record.id));
  next.push(record);
  writeFileSync(ledgerPath, `${next.map(entry => JSON.stringify(entry)).join('\n')}\n`, 'utf8');
  console.log(JSON.stringify(record, null, 2));
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
