import path from 'node:path';

function parseArguments(argv) {
  const options = {
    source: null,
    output: null,
    width: null,
    height: null,
    fit: 'cover',
    background: '#000000',
    quality: 86,
    metadata: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === '--source') {
      options.source = value;
      index += 1;
    } else if (argument === '--output') {
      options.output = value;
      index += 1;
    } else if (argument === '--width') {
      options.width = Number(value);
      index += 1;
    } else if (argument === '--height') {
      options.height = Number(value);
      index += 1;
    } else if (argument === '--fit') {
      options.fit = value;
      index += 1;
    } else if (argument === '--background') {
      options.background = value;
      index += 1;
    } else if (argument === '--quality') {
      options.quality = Number(value);
      index += 1;
    } else if (argument === '--metadata') {
      options.metadata = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!options.source) {
    throw new Error('--source is required.');
  }
  if (!options.metadata) {
    if (!options.output) {
      throw new Error('--output is required.');
    }
    if (!Number.isInteger(options.width) || options.width < 2) {
      throw new Error('--width must be an integer greater than one.');
    }
    if (!Number.isInteger(options.height) || options.height < 2) {
      throw new Error('--height must be an integer greater than one.');
    }
    if (!['cover', 'contain'].includes(options.fit)) {
      throw new Error('--fit must be cover or contain.');
    }
    if (!Number.isInteger(options.quality) || options.quality < 1 || options.quality > 100) {
      throw new Error('--quality must be an integer between 1 and 100.');
    }
  }
  return options;
}

async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch (error) {
    throw new Error(
      `The optional sharp backend is unavailable (${error?.code || error?.message || 'load failure'}).`
    );
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const sharp = await loadSharp();

  if (options.metadata) {
    const metadata = await sharp(options.source).metadata();
    console.log(JSON.stringify({
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    }));
    return;
  }

  const extension = path.extname(options.output).toLowerCase();
  let pipeline = sharp(options.source)
    .rotate()
    .resize({
      width: options.width,
      height: options.height,
      fit: options.fit,
      position: 'centre',
      background: options.background,
      withoutEnlargement: false
    });

  if (extension === '.png') {
    pipeline = pipeline.png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: false
    });
  } else if (extension === '.webp') {
    pipeline = pipeline.webp({
      quality: options.quality,
      effort: 6,
      smartSubsample: true
    });
  } else {
    throw new Error('Output must end in .png or .webp.');
  }

  const result = await pipeline.toFile(options.output);
  console.log(JSON.stringify({
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.size
  }));
}

main().catch(error => {
  console.error(`[rift-dossier-sharp] ${error.message}`);
  process.exitCode = 1;
});
