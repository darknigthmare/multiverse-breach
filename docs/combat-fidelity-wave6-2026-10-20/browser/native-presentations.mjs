import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [], consoleErrors = [], failedRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(async () => {
    const compiled = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rendererUrl = compiled.match(/from "(\/src\/game\/renderer\.js[^"]*)"/)[1];
    const rendererSource = await (await fetch(rendererUrl)).text();
    const catalogUrl = rendererSource.match(/from "(\/src\/game\/combat\/characterAnimationCatalog\.js[^"]*)"/)[1];
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import(rendererUrl);
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const { getCharacterAnimationAssets } = await import(catalogUrl);
    const registry = { entries: getCharacterAnimationAssets() };
    if (registry.entries.length !== 65) throw new Error('Expected all65 frozen character atlases; got '+registry.entries.length);
    preloadSpriteSheetSrcs(registry.entries.map(asset => asset.sheet));
    await Promise.all(registry.entries.map(asset => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => image.naturalWidth === 1024 && image.naturalHeight === 2048 ? resolve() : reject(new Error(asset.heroId + ': dimensions'));
      image.onerror = () => reject(new Error(asset.heroId + ': HTTP failure')); image.src = asset.sheet;
    })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = document.createElement('canvas'); canvas.width = 1120; canvas.height = 1680;
    const ctx = canvas.getContext('2d'), original = ctx.drawImage.bind(ctx), calls = [], trace = [], captures = [];
    let activeCase = null;
    ctx.drawImage = function (image, ...args) {
      calls.push({ case: activeCase, sheet: new URL(image.src).pathname, sx: args[0], sy: args[1], sw: args[2], sh: args[3], facing: Math.sign(ctx.getTransform().a), destination: args.slice(4), transform: {a:ctx.getTransform().a,d:ctx.getTransform().d,e:ctx.getTransform().e,f:ctx.getTransform().f} });
      return original(image, ...args);
    };
    const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
    for (const [assetIndex, asset] of registry.entries.entries()) {
      ctx.fillStyle='#10141c'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#d9f2ed'; ctx.font='10px monospace'; ctx.fillText(asset.heroId,3,12);
      const source = HEROES_DB.find(hero => hero.id === asset.heroId);
      if (!source || source.universe !== asset.universe) throw new Error(asset.heroId + ': roster identity');
      for (const [phaseIndex, phase] of phases.entries()) for (const [side, facing] of [1,-1].entries()) for (let col=0;col<4;col++) {
        activeCase={heroId:asset.heroId,phase,col,facing,player:side===0?'P1':'P2'};
        ctx.fillStyle='#bce6d8'; ctx.fillText(phase,3,phaseIndex*210+28);
        const actor = { ...source, id: side===0?source.id:'presentation-p2-'+source.id, sourceHeroId: source.id, currentHp:105, x:140, y:180, vx:0, vy:0, facing, presentationPhase: phase, presentationProgress: (asset.heroId === 'vincent_ff7' && phase === 'fatality' ? [0.01,0.075,0.15,0.225] : [0.01, 0.3, 0.6, 0.99])[col], presentationImpactProgress: 0.5, state: phase === 'super' ? 'special' : 'idle' };
        const before = JSON.stringify(actor), count = calls.length;
        drawPixelSprite(ctx,140+(side*4+col)*128,phaseIndex*210+196,actor,1000,facing,72,'melee');
        const actual = calls.at(-1);
        if (calls.length !== count + 1 || actual.sheet !== asset.sheet || actual.sx !== col * 256 || actual.sy !== asset.phases[phase].row * 256 || actual.sw !== 256 || actual.sh !== 256 || actual.facing !== facing) throw new Error(asset.heroId + ': native phase ' + phase + '/' + col + '/' + facing + ' actual=' + JSON.stringify(actual) + ' count=' + (calls.length-count));
        if (before !== JSON.stringify(actor)) throw new Error(asset.heroId + ': render changed combat state');
        trace.push(actual);
      }
      if ([54,59,64].includes(assetIndex)) captures.push({heroId:asset.heroId,part:['a','b','c'][[54,59,64].indexOf(assetIndex)],image:canvas.toDataURL('image/png')});
    }
    return { characters: registry.entries.length, phases: registry.entries.length * phases.length, actualFrameDraws: calls.length, immutableActors:trace.length, rendererUrl,catalogUrl,trace,captures };
  });
  assert.equal(result.characters,65);assert.equal(result.phases,520);assert.equal(result.actualFrameDraws,4160);assert.equal(result.immutableActors,4160);
  assert.deepEqual(errors, []);
  assert.ok(failedRequests.every(request=>request.url.startsWith('https://fonts.googleapis.com/')&&request.error==='net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length,failedRequests.length);
  const output='docs/combat-fidelity-wave6-2026-10-20/browser';
  await fs.writeFile(output+'/native-presentations-trace.json',JSON.stringify(result.trace,null,2)+'\n');
  const captures=[];
  for(const capture of result.captures){const file=output+'/native-presentations-part-'+capture.part+'.png';await fs.writeFile(file,Buffer.from(capture.image.split(',')[1],'base64'));captures.push({heroId:capture.heroId,part:capture.part,path:file});}
  const {trace:_trace,captures:_captures,...summary}=result;
  const report={passed:true,...summary,errors,consoleErrors,failedRequests,captures};
  await fs.writeFile(output+'/native-presentations.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
