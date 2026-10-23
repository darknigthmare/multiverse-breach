import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { segmentAtlas } from '../../scripts/buildCombatEntityAssets.mjs';
import { segmentWithRowCutHints } from './part-d-segmentation.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DOCS = 'docs/combat-fidelity-wave11-2026-10-23';
const EXPECTED = ['korben','leeloo','ruby_rhod','zorg','cornelius','arthur_kaamelott','perceval_kaamelott','karadoc_kaamelott','leodagan_kaamelott','lancelot_kaamelott'];
const PHASES = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const STATES = ['idle', 'run', 'attack', 'hit'];
const file = relative => path.resolve(ROOT, relative);
const read = relative => fs.readFile(file(relative));
const json = async relative => JSON.parse(await read(relative));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const writeJson = (relative, value) => fs.writeFile(file(relative), `${JSON.stringify(value, null, 2)}\n`);

async function sourcePixels(record, source, sourceIndex) {
  const bytes = await read(source.archivedPath), guessed = source.rowCutHints ? null : await segmentAtlas(file(source.archivedPath),source.rows);
  const atlas = await segmentWithRowCutHints(file(source.archivedPath),source.rows,source.rowCutHints||guessed.rowValleys,{allowEmptyRows:source.allowEmptyRows||[]});
  assert.equal(hash(bytes),source.sha256,`${record.heroId}: archived native source changed`);
  assert.equal(hash(await read(record.referenceArchive)),record.referenceAssetSha256,`${record.heroId}: pinned old reference changed`);
  assert.ok(source.calibration?.bodyHeight > 0, `${record.heroId}: measured body calibration required`);
  assert.equal(await fs.readFile(file(source.promptFile), 'utf8'), source.prompt, `${record.heroId}: prompt changed`);
  const references = await Promise.all((source.referenceInputs || []).map(async reference => ({path:reference,sha256:hash(await read(reference))})));
  let fitScale = Infinity;
  const selectedRows = new Set(record.rowSelections.filter(selection=>selection.source===sourceIndex).map(selection=>selection.row));
  for (const unusedRow of source.allowEmptyRows||[]) assert.ok(!selectedRows.has(unusedRow), 'Empty source rows must never be selected or counted');
  for (const [rowIndex,row] of atlas.rows.entries()) {
    if(!selectedRows.has(rowIndex))continue;
    if(row.rowBoundaryReview){assert.equal(row.rowBoundaryReview.aboveCrossedVisiblePixels,0,`${record.heroId}: upper cut crosses retained native artwork`);assert.equal(row.rowBoundaryReview.belowCrossedVisiblePixels,0,`${record.heroId}: lower cut crosses retained native artwork`);}
    assert.equal(row.seamReview.crossedVisiblePixels, 0, `${record.heroId}: a seam crosses visible native artwork`);
    for (const frame of row.frames) {
      const b = frame.bounds;
      const halfWidth = Math.max(frame.centerX - b.left, b.left + b.width - frame.centerX);
      fitScale = Math.min(fitScale, 232 / (2 * halfWidth), 232 / b.height);
    }
  }
  // One calibration for the entire native source: never expand a crouch or a
  // kneeling character independently to match a standing body.
  const scale = Math.min(record.targetBodyHeight / source.calibration.bodyHeight, fitScale);
  return { atlas, bytes, scale, metadata: { archivedPath:source.archivedPath,sha256:hash(bytes),sourceDimensions:[atlas.width,atlas.height],
    originalGeneratedPath:source.generatedPath,prompt:source.prompt,promptFile:source.promptFile,
    provider:'OpenAI',tool:'image_gen',model:null,generationId:null,jobId:null,transparentBackgroundRequested:true,
    nativeRowCount:source.rows,rowCutHints:source.rowCutHints||null,allowEmptyUnusedSourceRows:source.allowEmptyRows||[],nativeDrawingsObserved:source.nativeDrawingsObserved??source.rows*4,missingSourceCells:source.missingSourceCells||[],allRetainedRowBoundariesReviewed:true,imagegenReferenceInputs:references,operation:source.operation || 'native-imagegen',toolCallRecord:source.callRecordFile||null,recovery:source.recovery||null,returnFormat:source.returnFormat||null,
    accepted:source.accepted !== false,reason:source.reason || null,selectedSourceRows:[...selectedRows].sort((a,b)=>a-b),
    unusedSourceRows:Array.from({length:source.rows},(_,row)=>row).filter(row=>!selectedRows.has(row)),calibration:source.calibration,
    sharedPixelScale:scale,targetBodyHeight:record.targetBodyHeight,source1to1Verified:false,networkVerified:false } };
}

async function packRow(row, scale) {
  const composites=[], frameBounds=[];
  for (const [column,frame] of row.frames.entries()) {
    const b=frame.bounds, width=Math.max(1,Math.round(b.width*scale)),height=Math.max(1,Math.round(b.height*scale));
    const left=Math.round(128+(b.left-frame.centerX)*scale),top=244-height;
    assert.ok(left>=10 && top>=10 && left+width<=246 && top+height<=246,'Native pose exceeds safe padding');
    const input=await sharp(frame.data,{raw:{width:frame.width,height:frame.height,channels:4}})
      .extract({left:b.left,top:b.top,width:b.width,height:b.height}).resize(width,height,{kernel:sharp.kernel.nearest}).png().toBuffer();
    composites.push({input,left:column*256+left,top});
    frameBounds.push({source:{...b,top:b.top+row.sourceBounds.top},output:{left,top,width,height}});
  }
  return { bytes:await sharp({create:{width:1024,height:256,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(composites).png({compressionLevel:9}).toBuffer(),frameBounds };
}

async function inspectPixels(bytes,names) {
  const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(info.width,1024);assert.equal(info.height,names.length*256);
  const reviews=[],all=[];
  for (const [row,name] of names.entries()) {
    const frameHashes=[];
    for (let col=0;col<4;col++) {
      const rgba=Buffer.alloc(256*256*4);let visible=0;
      for(let y=0;y<256;y++)for(let x=0;x<256;x++) {
        const offset=((row*256+y)*1024+col*256+x)*4,alpha=data[offset+3];
        if(alpha>0)data.copy(rgba,(y*256+x)*4,offset,offset+4);
        if(alpha>4)visible++;
        if(x<10||y<10||x>=246||y>=246)assert.equal(alpha,0,`${name}/${col}: nontransparent safety margin`);
      }
      assert.ok(visible>300,`${name}/${col}: empty native body`);frameHashes.push(hash(rgba));
    }
    assert.equal(new Set(frameHashes).size,4,`${name}: repeated pose`);all.push(...frameHashes);reviews.push({name,distinctFrames:4,frameHashes});
  }
  assert.equal(new Set(all).size,names.length*4,'A pose was copied between rows');
  return {distinctCells:all.length,reviews};
}

function paths(kind) {
  const base=kind==='base';
  return { base, names:base?STATES:PHASES, prefix:base?'base-part-d':'part-d',
    registry:`src/game/combat/${base?'characterSpriteCorrections':'characterAnimations'}Wave11PartD.generated.json`,
    output:base?'combat-character-corrections-wave11':'combat-character-animations-wave11' };
}

async function createEntry(record,inputConfig) {
  const config = !inputConfig.base && record.retainedPhases ? {...inputConfig,names:record.retainedPhases} : inputConfig;
  assert.equal(record.reviewed,true,`${record.heroId}: visual review remains pending`);
  const sourceRecords=await Promise.all(record.sources.map((source,index)=>sourcePixels(record,source,index)));
  const composites=[],rows=[];
  for(const [row,name] of config.names.entries()) {
    const selection=record.rowSelections[row],source=sourceRecords[selection.source],selected=source.atlas.rows[selection.row];
    const normalized=await packRow(selected,source.scale);
    composites.push({input:normalized.bytes,left:0,top:row*256});
    rows.push({[config.base?'state':'phase']:name,row,sourceImage:source.metadata.archivedPath,sourceImageSha256:source.metadata.sha256,
      sourceRow:selection.row,sourceBounds:selected.sourceBounds,scale:source.scale,baseline:244,frameBounds:normalized.frameBounds,
      ...selected.seamReview,rowBoundaryReview:selected.rowBoundaryReview||null,renderScale:record.targetBodyHeight/(source.metadata.calibration.bodyHeight*source.scale),statureReview:{measurementKind:'source-body-calibration',targetBodyHeight:record.targetBodyHeight,
        sourceBodyHeight:source.metadata.calibration.bodyHeight,normalizedBodyHeight:source.metadata.calibration.bodyHeight*source.scale,
        sharedAcrossSource:true,excludesWeaponEffects:true,bodyBounds:source.metadata.calibration.bodyBounds,
        notes:'Single pixel scale for this whole source. Naturally crouched, kneeling, seated and lunging bodies retain native projection ratios.'}});
  }
  const bytes=await sharp({create:{width:1024,height:config.names.length*256,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
    .composite(composites).png({compressionLevel:9}).toBuffer();
  const pixelReview=await inspectPixels(bytes,config.names),first=sourceRecords[0].metadata;
  const sheet=`/sprites/generated/${config.output}/${record.heroId}.png`;
  const ability=record.profiles[config.base?'simple':'special'];
  const phases=Object.fromEntries(config.names.map((name,row)=>[name,{row,frames:4,columns:4,
    fps:config.base&&name==='run'?10:['super','fatality'].includes(name)?12:8,loop:config.base&&['idle','run'].includes(name)}]));
  return {bytes,sources:sourceRecords.map(source=>source.metadata),entry:{id:record.heroId,heroId:record.heroId,universe:record.universe,name:record.name,sheet,
    width:1024,height:config.names.length*256,columns:4,rows:config.names.length,frameWidth:256,frameHeight:256,frames:config.names.length*4,
    [config.base?'states':'phases']:phases,sha256:hash(bytes),alpha:true,sourceImage:first.archivedPath,sourceImageSha256:first.sha256,
    sourceDimensions:first.sourceDimensions,referenceAsset:record.referenceAsset,referenceAssetSha256:record.referenceAssetSha256,referenceImage:record.referenceArchive,
    referenceUse:record.useOldReference?'Pinned older appearance cue supplied; prompt explicitly corrects source-version equipment and role':'Old defective identity/role inspected and excluded from initial image_gen inputs; exact version specified in text',
    nativeReferences:sourceRecords.flatMap(source=>source.metadata.imagegenReferenceInputs),
    sourceWork:record.sourceWork,sourceReference:record.sourceReference[config.base?'simple':'special'],abilityName:ability.name,abilityEffect:ability.effect,
    characterVersion:record.version,provider:'OpenAI',model:null,generationId:null,jobId:null,nativeCorrection:record.sources.length>1,
    originalSourceImage:record.sources.length>1?first.archivedPath:null,originalSourceImageSha256:record.sources.length>1?first.sha256:null,
    normalization:{method:'alpha-segmentation-one-body-calibration-per-native-source',sharedScalePerSource:true,baseline:244,rows},
    visualValidation:{partialNative:!config.base&&config.names.length<8,missingPhases:!config.base?PHASES.filter(phase=>!config.names.includes(phase)):[],identityReviewed:true,allFramesReviewed:true,technicalAlphaReviewed:true,fourNativePosesPerRowReviewed:true,fourPhasesDistinct:!config.base,fourStatesDistinct:config.base,
      distinctCells:pixelReview.distinctCells,[config.base?'stateReviews':'phaseReviews']:pixelReview.reviews.map(review=>({[config.base?'state':'phase']:review.name,distinctFrames:4,frameHashes:review.frameHashes})),
      canon1to1Verified:false,canonicalVerified:false,networkVerified:false,source1to1Verified:false,sourceGameAsset:false,adaptedChoreography:true,
      fatalityIsExecution:false,notes:'Purpose-drawn The Fifth Element1997/Kaamelott LivreIII2005 adaptation. Ruby/Cornelius/Perceval/Karadoc remain zero-damage support gestures with actual microphone/notes/guard/provisions. Words do not wound, rations do not heal magically, and no missing elemental ritual is invented. Korben has an ordinary pistol and Zorg alone the physical ZF-1. Human swords and Leeloo kung-fu stay physical. No official animation-frame, exact source timing or1:1 certification.'}}};
}

export async function buildPartD(kind,{check=false}={}) {
  const config=paths(kind),records=(await json(`${DOCS}/${config.prefix}-generation-records.json`)).records;
  assert.deepEqual(records.map(record=>record.heroId),EXPECTED);
  const entries=[],allSources=[];
  for(const record of records) {
    const result=await createEntry(record,config);entries.push(result.entry);
    allSources.push(...result.sources.map(source=>({heroId:record.heroId,...source})));
    if(check) {
      const existing=await read(`public${result.entry.sheet}`);assert.equal(hash(existing),result.entry.sha256,`${record.heroId}: final PNG differs from native reconstruction`);
    } else {
      await fs.mkdir(path.dirname(file(`public${result.entry.sheet}`)),{recursive:true});await fs.writeFile(file(`public${result.entry.sheet}`),result.bytes);
      await sharp(result.bytes).resize(512,result.entry.rows*128,{kernel:sharp.kernel.nearest}).flatten({background:'#172032'}).png().toFile(file(`${DOCS}/${config.prefix}-contacts/${record.heroId}.png`));
    }
  }
  const registry={schemaVersion:1,source:'OpenAI',entries};
  const provenance={schemaVersion:1,date:'2026-10-23',part:'D',provider:'OpenAI',tool:'image_gen',model:null,generationId:null,jobId:null,
    source1to1Verified:false,canon1to1Verified:false,networkVerified:false,method:'Genuine native image_gen drawings only. Sharp segments alpha seams, applies a single measured body-density scale per source, pads and packs. No drawing, duplicated pose, procedural anatomy or mirrored replacement is synthesized. Weapon actions retain their resolved role and source version.',
    sourceAccess:`${DOCS}/part-d-source-access.json`,nativeToolArgumentsFile:`${DOCS}/${config.prefix}-native-tool-calls.json`,generationRecords:records,sources:allSources,entries};
  if(check) {
    assert.deepEqual(await json(config.registry),registry,'Registry differs from exact native reconstruction');
    assert.deepEqual(await json(`${DOCS}/${config.prefix}-provenance.json`),provenance,'Provenance changed');
  } else {await writeJson(config.registry,registry);await writeJson(`${DOCS}/${config.prefix}-provenance.json`,provenance);}
  return {part:'D',kind,heroes:entries.length,images:entries.length,poses:entries.reduce((sum,entry)=>sum+entry.frames,0),nativeSources:allSources.length,check,source1to1Verified:false};
}
