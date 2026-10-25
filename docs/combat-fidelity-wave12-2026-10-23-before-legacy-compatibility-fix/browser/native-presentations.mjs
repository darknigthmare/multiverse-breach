import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
import {snapshotPresentationInputs,finishPresentationIntegrity,hashPresentationArtifacts} from './presentation-input-integrity.mjs';
assert.ok(process.argv.includes('--final-inputs-ready'),'Wait for the integration owner final signal');
const startedAt=new Date().toISOString();
const harnessSha256=crypto.createHash('sha256').update(await fs.readFile(new URL(import.meta.url))).digest('hex');
const output='docs/combat-fidelity-wave12-2026-10-23/browser';
await fs.mkdir(output,{recursive:true});
const runtimeBaseline=JSON.parse(await fs.readFile('docs/combat-fidelity-wave12-2026-10-23/runtime-baseline.json','utf8'));
const frozenAssets=runtimeBaseline.characterAssets;
assert.equal(frozenAssets.length,194);
for(const record of runtimeBaseline.historicalRegistryFiles)assert.equal(crypto.createHash('sha256').update(await fs.readFile(record.path)).digest('hex'),record.sha256,record.path+': historical registry changed');
for(const asset of frozenAssets)assert.equal(crypto.createHash('sha256').update(await fs.readFile('public'+asset.sheet)).digest('hex'),asset.sha256,asset.heroId+': historical PNG changed');
const oldTrace=JSON.parse(await fs.readFile('docs/combat-fidelity-wave11-2026-10-23/browser/native-presentations-trace.json','utf8'));
const beforeInputs=await snapshotPresentationInputs();
await fs.writeFile(output+'/native-presentations-inputs-before.json',JSON.stringify(beforeInputs,null,2)+'\n');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [], consoleErrors = [], failedRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:5188/', { waitUntil: 'networkidle' });
  const result = await page.evaluate(async ({ frozenAssets }) => {
    const compiled = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const rendererUrl = compiled.match(/from "(\/src\/game\/renderer\.js[^"]*)"/)[1];
    const rendererSource = await (await fetch(rendererUrl)).text();
    const catalogUrl = rendererSource.match(/from "(\/src\/game\/combat\/characterAnimationCatalog\.js[^"]*)"/)[1];
    const { drawPixelSprite, preloadSpriteSheetSrcs } = await import(rendererUrl);
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } = await import(catalogUrl);
    const registry = { entries: getCharacterAnimationAssets() };
    if (registry.entries.length !== 233) throw new Error('Expected231 complete plus two historical partial character atlases; got '+registry.entries.length);
    const historicalIds = new Set(frozenAssets.map(asset => asset.heroId));
    if (JSON.stringify(registry.entries.filter(asset => historicalIds.has(asset.heroId))) !== JSON.stringify(frozenAssets)) throw new Error('Historical194 asset records changed');
    const partsById = {};
    for (const part of ['A','B','C','D']) for (const asset of (await (await fetch('/src/game/combat/characterAnimationsWave12Part'+part+'.generated.json')).json()).entries) partsById[asset.heroId] = part.toLowerCase();
    const assetSnapshot = JSON.stringify(registry.entries);
    preloadSpriteSheetSrcs(registry.entries.map(asset => asset.sheet));
    await Promise.all(registry.entries.map(asset => new Promise((resolve, reject) => {
      const image = new Image(); image.onload = () => image.naturalWidth === asset.width && image.naturalHeight === asset.height ? resolve() : reject(new Error(asset.heroId + ': dimensions'));
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
    const allPhases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
    const equal = (actual, expected, reason) => { if (Math.abs(actual - expected) > 1e-8) throw new Error(reason + ': ' + actual + ' versus ' + expected); };
    let geometryChecks = 0, rejectedCrossedIdentities = 0, fixedProgressFrames = 0;
    for (const asset of registry.entries) {
      const phases = Object.keys(asset.phases);
      const expectedPartialPhases={beast_boy_tt:['fatality','super'],janine_gb:['intro','outro','roundVictory','roundDefeat','victory','defeat']};
      if(JSON.stringify(phases)!==JSON.stringify(expectedPartialPhases[asset.heroId]||allPhases))throw new Error(asset.heroId+': wrong exposed phases');
      canvas.height = phases.length * 210;
      ctx.fillStyle='#10141c'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#d9f2ed'; ctx.font='10px monospace'; ctx.fillText(asset.heroId,3,12);
      const source = HEROES_DB.find(hero => hero.id === asset.heroId);
      if (!source || source.universe !== asset.universe) throw new Error(asset.heroId + ': roster identity');
      if (resolveCharacterAnimationAsset({ ...source, universe: '__wrong-universe__' }) !== null
          || resolveCharacterAnimationAsset({ ...source, sourceHeroId: '__unknown-source__' }) !== null) throw new Error(asset.heroId + ': crossed identity accepted');
      rejectedCrossedIdentities += 2;
      for (const [phaseIndex, phase] of phases.entries()) for (const [side, facing] of [1,-1].entries()) for (let col=0;col<4;col++) {
        activeCase={heroId:asset.heroId,phase,col,facing,player:side===0?'P1':'P2'};
        ctx.fillStyle='#bce6d8'; ctx.fillText(phase,3,phaseIndex*210+28);
        const actor = { ...source, id: side===0?source.id:'presentation-p2-'+source.id, sourceHeroId: source.id, currentHp:105, x:140, y:180, vx:0, vy:0, facing, presentationPhase: phase, presentationProgress: (asset.heroId === 'vincent_ff7' && phase === 'fatality' ? [0.01,0.075,0.15,0.225] : [0.01, 0.3, 0.6, 0.99])[col], presentationImpactProgress: 0.5, state: phase === 'super' ? 'special' : 'idle' };
        const before = JSON.stringify(actor), count = calls.length;
        drawPixelSprite(ctx,140+(side*4+col)*128,phaseIndex*210+196,actor,1000,facing,72,'melee');
        const actual = calls.at(-1);
        if (calls.length !== count + 1 || actual.sheet !== asset.sheet || actual.sx !== col * 256 || actual.sy !== asset.phases[phase].row * 256 || actual.sw !== 256 || actual.sh !== 256 || actual.facing !== facing) throw new Error(asset.heroId + ': native phase ' + phase + '/' + col + '/' + facing + ' actual=' + JSON.stringify(actual) + ' count=' + (calls.length-count));
        const rowScale = Math.max(0.5, Math.min(3, Number(asset.normalization?.rows?.[asset.phases[phase].row]?.renderScale) || 1));
        const baseline = Number(asset.normalization?.baseline) || 244, scale = 72 / 256 * rowScale;
        equal(baseline, 244, asset.heroId + ': dedicated feet baseline');
        equal(actual.destination[0], -128 * scale, 'complete cell horizontal anchor');
        equal(actual.destination[1], -baseline * scale, 'native baseline244');
        equal(actual.destination[2], 256 * scale, 'native rowScale width');
        equal(actual.destination[3], 256 * scale, 'native rowScale height');
        equal(actual.transform.d, 1, 'native vertical axis');
        const projectedBaseline = actual.transform.f + actual.destination[1] + baseline / 256 * actual.destination[3];
        equal(projectedBaseline, actual.transform.f, 'feet stay at the cosmetic motion pivot');
        actual.rowScale = rowScale; actual.baseline = baseline; actual.projectedBaseline = projectedBaseline;
        geometryChecks++;
        const pausedFrame = getCharacterAnimationFrame(actor, { elapsedSeconds: 0 });
        const laterCosmeticTime = getCharacterAnimationFrame(actor, { elapsedSeconds: 1000 });
        if (pausedFrame.col !== col || laterCosmeticTime.col !== col || pausedFrame.row !== laterCosmeticTime.row) throw new Error(asset.heroId + ': fixed authoritative progress drifted with render time');
        fixedProgressFrames++;
        if (before !== JSON.stringify(actor)) throw new Error(asset.heroId + ': render changed combat state');
        trace.push(actual);
      }
      if (!historicalIds.has(asset.heroId)) captures.push({heroId:asset.heroId,part:partsById[asset.heroId],partial:phases.length!==8,image:canvas.toDataURL('image/png')});
    }
    if (JSON.stringify(registry.entries) !== assetSnapshot) throw new Error('Renderer mutated the native asset registry');
    const partial = registry.entries.find(asset => asset.heroId === 'beast_boy_tt');
    const gorilla = (await (await fetch('/src/game/combat/characterSpriteCorrectionsWave8PartA.generated.json')).json()).entries.find(asset => asset.heroId === 'beast_boy_tt');
    preloadSpriteSheetSrcs([gorilla.sheet]);
    await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(new Error('Gorilla fallback failed to load'));image.src=gorilla.sheet;});
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const beastBoy = HEROES_DB.find(hero => hero.id === 'beast_boy_tt');
    const humanFallbackTrace = [];
    for (const phase of allPhases.filter(phase => !partial.phases[phase])) for (const facing of [1,-1]) for (let col=0;col<4;col++) {
      const actor = {...beastBoy,id:facing===1?beastBoy.id:'bb-missing-phase-p2',sourceHeroId:beastBoy.id,currentHp:100,x:140,y:180,vx:0,vy:0,facing,presentationPhase:phase,presentationProgress:[.01,.3,.6,.99][col],state:'idle'};
      if (getCharacterAnimationFrame(actor) !== null) throw new Error('Unretained Beast Boy human phase exposed: '+phase);
      const before=JSON.stringify(actor), count=calls.length;
      activeCase={heroId:beastBoy.id,phase,col,facing,player:facing===1?'P1':'P2',fallback:true};
      drawPixelSprite(ctx,140,196,actor,1000,facing,72,'melee');
      const actual=calls.at(-1);
      if (calls.length!==count+1 || actual.sheet!==gorilla.sheet || actual.sheet===partial.sheet) throw new Error('Missing Beast Boy phase did not use genuine gorilla fallback: '+phase+' '+JSON.stringify(actual));
      if (before!==JSON.stringify(actor)) throw new Error('Fallback mutated actor');
      humanFallbackTrace.push(actual);
    }
    const {getHeroSpriteSheetSrc,getSpriteSheetLayout}=await import(rendererSource.match(/from "(\/src\/game\/spriteAssets\.js[^"]*)"/)[1]);
    const janineAsset=registry.entries.find(asset=>asset.heroId==='janine_gb'),janine=HEROES_DB.find(hero=>hero.id==='janine_gb');
    const janineLayout=getSpriteSheetLayout(janineAsset.sheet);
    if(janineLayout.adaptedPresentationFallback!==true||janineLayout.countedAsDedicatedBase16!==false||janineLayout.countedAsDedicatedSuperOrFinale!==false)throw new Error('Janine fallback metadata does not expose its reuse limitation');
    const janineFallbackTrace=[];
    for(const phase of ['fatality','super'])for(const facing of[1,-1])for(let col=0;col<4;col++){
      const actor={...janine,id:facing===1?janine.id:'janine-missing-phase-p2',sourceHeroId:janine.id,currentHp:100,x:140,y:180,vx:0,vy:0,facing,presentationPhase:phase,presentationProgress:[.01,.3,.6,.99][col],state:'support',stateElapsed:(col*10+.1)/60};
      if(getCharacterAnimationFrame(actor)!==null)throw new Error('Janine refused super/finale exposed as native: '+phase);
      if(getHeroSpriteSheetSrc(actor,'rpg')!==janineAsset.sheet)throw new Error('Janine fallback does not reuse its accepted source');
      const before=JSON.stringify(actor),count=calls.length;activeCase={heroId:janine.id,phase,col,facing,player:facing===1?'P1':'P2',fallback:true,adaptedPresentationFallback:true};
      drawPixelSprite(ctx,140,196,actor,1000,facing,72,'melee');const actual=calls.at(-1),expectedRow=janineAsset.phases.intro.row;
      if(calls.length!==count+1||actual.sheet!==janineAsset.sheet||actual.sx!==col*256||actual.sy!==expectedRow*256||actual.sw!==256||actual.sh!==256||actual.facing!==facing)throw new Error('Janine missing phase not drawn from declared accepted intro cell: '+JSON.stringify(actual));
      if(before!==JSON.stringify(actor))throw new Error('Janine fallback mutated actor');janineFallbackTrace.push(actual);
    }
    const morty=HEROES_DB.find(hero=>hero.id==='morty'),mortySheet=getHeroSpriteSheetSrc(morty,'rpg'),mortyLayout=getSpriteSheetLayout(mortySheet),mortyFallbackTrace=[];
    if(resolveCharacterAnimationAsset(morty)!==null||mortyLayout.adaptedLegacyFallback!==true||mortyLayout.fixedColumn!==0||mortyLayout.countedAsDedicatedBase16!==false||mortyLayout.countedAsDedicatedSuperOrFinale!==false)throw new Error('Morty refusal/reuse metadata was lost');
    preloadSpriteSheetSrcs([mortySheet]);await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(new Error('Morty calm fallback load'));image.src=mortySheet;});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    canvas.height=allPhases.length*210;ctx.fillStyle='#10141c';ctx.fillRect(0,0,canvas.width,canvas.height);
    for(const[phaseIndex,phase]of allPhases.entries())for(const[side,facing]of[1,-1].entries())for(let col=0;col<4;col++){
      const actor={...morty,id:'morty-refused-presentation-'+side,sourceHeroId:morty.id,currentHp:100,x:140,y:180,vx:0,vy:0,facing,presentationPhase:phase,presentationProgress:[.01,.3,.6,.99][col],state:'support',stateElapsed:(col*10+.1)/60};
      const before=JSON.stringify(actor),count=calls.length;activeCase={heroId:morty.id,phase,col,facing,player:side===0?'P1':'P2',fallback:true,countedAsNewPose:false};
      drawPixelSprite(ctx,140+(side*4+col)*128,phaseIndex*210+196,actor,1000,facing,72,'melee');const draw=calls.at(-1);
      if(calls.length!==count+1||draw.sheet!==mortySheet||draw.sx!==0||draw.sy!==0||draw.sw!==256||draw.sh!==256||draw.facing!==facing)throw new Error('Morty refused phase did not remain on its declared calm legacy cell: '+phase+' '+JSON.stringify(draw));
      if(before!==JSON.stringify(actor))throw new Error('Morty fallback mutated actor');mortyFallbackTrace.push(draw);
    }
    const mortyFallbackCapture=canvas.toDataURL('image/png');
    const missingNativeHeroIds=['luke','vader','obi_wan','robin_tt','raven_tt','starfire_tt','harry_potter','hermione_granger','snape','morty'];
    for(const id of missingNativeHeroIds) if(resolveCharacterAnimationAsset(HEROES_DB.find(hero=>hero.id===id))!==null) throw new Error('Refused identity was counted as a native asset: '+id);
    return { characters: registry.entries.length, full32Count:registry.entries.filter(asset=>Object.keys(asset.phases).length===8).length, partialCount:registry.entries.filter(asset=>Object.keys(asset.phases).length<8).length, partialPoses:registry.entries.filter(asset=>Object.keys(asset.phases).length<8).reduce((sum,asset)=>sum+asset.frames,0),partialDetails:registry.entries.filter(asset=>Object.keys(asset.phases).length<8).map(asset=>({heroId:asset.heroId,poses:asset.frames,phases:Object.keys(asset.phases)})), phases:registry.entries.reduce((sum,asset)=>sum+Object.keys(asset.phases).length,0), actualFrameDraws: trace.length, realDrawImageCalls:calls.length, immutableActors:trace.length, immutableAssetRegistry: true, geometryChecks, rejectedCrossedIdentities, fixedProgressFrames, historicalAssetRecordsUnchanged:194,historicalPngHashesUnchanged:194,rejectedHumanPresentationPoses:24,humanFallbackFrameDraws:humanFallbackTrace.length,janineReusedPresentationDraws:janineFallbackTrace.length,missingNativeHeroIds,rendererUrl,catalogUrl,trace,captures,humanFallbackTrace,janineFallbackTrace,mortyFallbackTrace,mortyFallbackCapture,mortyReusedPresentationDraws:mortyFallbackTrace.length };
  }, { frozenAssets });
  assert.equal(result.characters,233);assert.equal(result.full32Count,231);assert.equal(result.partialCount,2);assert.equal(result.partialPoses,32);assert.equal(result.phases,1856);assert.equal(result.actualFrameDraws,14848);assert.equal(result.immutableActors,14848);
  assert.equal(result.humanFallbackFrameDraws,48);assert.equal(result.janineReusedPresentationDraws,16);assert.equal(result.realDrawImageCalls,14976);assert.equal(result.mortyReusedPresentationDraws,64);
  const key = draw => [draw.case.heroId,draw.case.phase,draw.case.col,draw.case.facing].join('::');
  const historicalMap = new Map(oldTrace.map(draw=>[key(draw),draw]));
  let unchangedHistoricalDraws=0;
  for(const draw of result.trace){const old=historicalMap.get(key(draw));if(!old)continue;for(const field of ['sheet','sx','sy','sw','sh','facing','destination','transform','rowScale','baseline','projectedBaseline'])assert.deepEqual(draw[field],old[field],key(draw)+' historical '+field);unchangedHistoricalDraws++;}
  assert.equal(unchangedHistoricalDraws,12352);result.historicalDrawGeometryUnchanged=unchangedHistoricalDraws;
  assert.equal(result.geometryChecks,14848);assert.equal(result.fixedProgressFrames,14848);assert.equal(result.rejectedCrossedIdentities,466);assert.equal(result.immutableAssetRegistry,true);
  assert.deepEqual(errors, []);
  assert.ok(failedRequests.every(request=>request.url.startsWith('https://fonts.googleapis.com/')&&request.error==='net::ERR_TUNNEL_CONNECTION_FAILED'));
  assert.equal(consoleErrors.length,failedRequests.length);
  const integrity=await finishPresentationIntegrity(beforeInputs);
  await fs.writeFile(output+'/native-presentations-inputs-after.json',JSON.stringify(await snapshotPresentationInputs(),null,2)+'\n');
  await fs.writeFile(output+'/morty-presentation-fallback-trace.json',JSON.stringify(result.mortyFallbackTrace,null,2)+'\n');
  await fs.writeFile(output+'/morty-presentation-fallback.png',Buffer.from(result.mortyFallbackCapture.split(',')[1],'base64')); 
  await fs.writeFile(output+'/janine-presentation-fallback-trace.json',JSON.stringify(result.janineFallbackTrace,null,2)+'\n');
  await fs.writeFile(output+'/beast-boy-fallback-trace.json',JSON.stringify(result.humanFallbackTrace,null,2)+'\n');
  await fs.writeFile(output+'/native-presentations-trace.json',JSON.stringify(result.trace,null,2)+'\n');
  const captures=[];
  for(const capture of result.captures){const file=output+'/native-presentations-'+capture.heroId+'.png';await fs.writeFile(file,Buffer.from(capture.image.split(',')[1],'base64'));captures.push({heroId:capture.heroId,part:capture.part,partial:capture.partial,path:file});}
  const artifacts=await hashPresentationArtifacts([...captures.map(capture=>capture.path),...['native-presentations-inputs-before.json','native-presentations-inputs-after.json','morty-presentation-fallback-trace.json','morty-presentation-fallback.png','janine-presentation-fallback-trace.json','beast-boy-fallback-trace.json','native-presentations-trace.json'].map(file=>output+'/'+file)]);
  const {trace:_trace,captures:_captures,humanFallbackTrace:_fallback,janineFallbackTrace:_janineFallback,mortyFallbackTrace:_mortyTrace,mortyFallbackCapture:_mortyCapture,...summary}=result;
  const report={passed:true,startedAt,finishedAt:new Date().toISOString(),harnessSha256,source1to1Verified:false,...summary,...integrity,newCharacters:captures.length,newFrameDraws:result.actualFrameDraws-unchangedHistoricalDraws,errors,consoleErrors,failedRequests,captures,artifacts};
  await fs.writeFile(output+'/native-presentations.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
} catch(error) { await fs.writeFile(output+'/native-presentations-failure.json',JSON.stringify({passed:false,error:error.message,stack:error.stack},null,2)+'\n'); throw error; } finally { await browser.close(); }
