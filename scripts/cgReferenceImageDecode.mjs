import sharp from 'sharp';

const MAX_INPUT_BYTES = 64 * 1024 * 1024;
const MAX_INPUT_PIXELS = 33_554_432;
const positiveInteger = value => Number.isSafeInteger(value) && value > 0;

// The parent sends image bytes, never a filename or URL. Native decoder errors
// stay inside this disposable child; its output contains no input or paths.
sharp.concurrency(1);
sharp.cache(false);

let image;
try {
  const chunks = [];
  let byteLength = 0;
  for await (const chunk of process.stdin) {
    byteLength += chunk.length;
    if (byteLength > MAX_INPUT_BYTES) throw new Error('input-limit');
    chunks.push(chunk);
  }
  if (!byteLength) throw new Error('empty-input');
  image = sharp(Buffer.concat(chunks, byteLength), {
    failOn: 'error', limitInputPixels: MAX_INPUT_PIXELS,
    animated: true, sequentialRead: true,
  });
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.pageHeight || metadata.height;
  const pages = metadata.pages || 1;
  if (!positiveInteger(width) || !positiveInteger(height) || !positiveInteger(pages)
    || typeof metadata.format !== 'string' || !metadata.format
    || width > MAX_INPUT_PIXELS / height / pages) throw new Error('pixel-limit');
  // Header parsing alone accepts truncated images. stats() consumes every
  // selected page's compressed pixel data without a JS raw-pixel output copy.
  await image.stats();
  process.stdout.write(JSON.stringify({ ok: true, format: metadata.format, width, height, pages }) + '\n');
} catch {
  process.exitCode = 1;
  process.stdout.write('{"ok":false}\n');
} finally {
  image?.destroy();
}
