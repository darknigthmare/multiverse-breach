import { OPENAI_BACKDROPS, getOpenAiBackdropSrc, drawUniverseBackground } from '../../src/game/renderer.js';
import { getDlcInstallationSummary } from '../../src/game/dlcInstallation.js';
import dependencies from '../../DLC/shared-asset-dependencies.json' with { type: 'json' };

const optional = new Set(dependencies.assets.map(asset => asset.publicPath));
const installation = getDlcInstallationSummary();
const installed = new Set(installation.installedPackIds);
const cases = Object.entries(OPENAI_BACKDROPS).flatMap(([mode, values]) => Object.entries(values)
  .filter(([universe, src]) => optional.has(src) || universe === 'Halo')
  .map(([universe, registrySrc]) => ({ universe, mode, registrySrc, src: getOpenAiBackdropSrc(universe, mode) })));
cases.unshift({ universe: 'Nexus de Convergence', mode: 'RPG', registrySrc: null,
  src: getOpenAiBackdropSrc('Nexus de Convergence', 'RPG') });

window.__sharedDlcBackdrops = {
  installation,
  cases,
  optional: dependencies.assets.filter(asset => asset.packIds.some(id => installed.has(id))).map(asset => asset.publicPath),
  async decode(src) {
    const image = new Image(); image.src = src; await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('Backdrop did not decode: ' + src);
    return { src, width: image.naturalWidth, height: image.naturalHeight };
  },
  async render(entry) {
    const canvas = document.querySelector('#scene'), ctx = canvas.getContext('2d');
    document.querySelector('#status').textContent = entry.universe + ' / ' + entry.mode + ' · ' + (entry.src || 'Procedural base backdrop');
    const draws = [], originalDraw = ctx.drawImage.bind(ctx);
    ctx.drawImage = (image, ...args) => {
      draws.push({ src: image.currentSrc || image.src || null, width: image.naturalWidth ?? image.width,
        height: image.naturalHeight ?? image.height });
      return originalDraw(image, ...args);
    };
    let renderedImage = false;
    try {
      for (let frame = 0; frame < 90; frame++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderedImage = drawUniverseBackground(ctx, entry.universe, canvas.width, canvas.height, entry.mode);
        if (renderedImage || !entry.src) break;
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    } finally { ctx.drawImage = originalDraw; }
    const pixel = Array.from(ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data);
    return { ...entry, renderedImage, draws, pixel };
  },
};
