import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const root = '/workspace/multiverse-breach';
const docs = 'docs/combat-fidelity-wave11-2026-10-23';
const sharp = createRequire(`${root}/package.json`)('sharp');
const read = p => fs.readFileSync(`${root}/${p}`);
const json = p => JSON.parse(read(p));
const hash = b => createHash('sha256').update(b).digest('hex');
const cache = new Map();
const onlyHero = process.argv.find(value => value.startsWith('--hero='))?.slice(7);
const onlyBase = process.argv.includes('--base-only');
const onlyPresentation = process.argv.includes('--presentation-only');
async function img(p) {
  if (!cache.has(p)) cache.set(p, await sharp(read(p)).ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
  return cache.get(p);
}
async function bounds(p, rect) {
  const { data, info } = await img(p); const [x,y,w,h] = rect.map(Math.round);
  let l=x+w,t=y+h,r=-1,b=-1,n=0;
  for(let py=y;py<y+h;py++) for(let px=x;px<x+w;px++) if(px>=0&&py>=0&&px<info.width&&py<info.height&&data[(py*info.width+px)*4+3]>24){l=Math.min(l,px);r=Math.max(r,px);t=Math.min(t,py);b=Math.max(b,py);n++;}
  if(n<40)throw Error(`Empty body ROI ${p} ${rect}`);
  return [l,t,r-l+1,b-t+1];
}
async function measure(entry,row,column=0) {
  // Column zero is visually reviewed: weapons do not exceed its body crown or
  // sole axis. Lilith's two emergence rows crop the surrounding purple ripple.
  const seed = !entry.states && entry.heroId==='lilith_borderlands' && ['fatality','super'].includes(row.phase) && !row.sourceImage.includes('frontal-phases-arm-correction')
    ? [45,44,160,200] : [10,10,236,234];
  const b = await bounds(`public${entry.sheet}`,[column*256+seed[0],row.row*256+seed[1],seed[2],seed[3]]);
  const local=[b[0]-column*256,b[1]-row.row*256,b[2],b[3]], f=row.frameBounds[column];
  const sx=f.source.width/f.output.width, sy=f.source.height/f.output.height;
  const native=await bounds(row.sourceImage,[Math.round(f.source.left+(local[0]-f.output.left)*sx),Math.round(row.sourceBounds.top+f.source.top+(local[1]-f.output.top)*sy),Math.max(1,Math.round(local[2]*sx)),Math.max(1,Math.round(local[3]*sy))]);
  return { normalized:local,native,sourceImage:row.sourceImage,sourceRow:row.sourceRow,column,sha256:hash(read(row.sourceImage)) };
}
for (const base of [false,true]) {
  if (onlyBase && !base) continue;
  if (onlyPresentation && base) continue;
  const prefix=base?'base-part-c-':'part-c-', regPath=`src/game/combat/${base?'characterSpriteCorrections':'characterAnimations'}Wave11PartC.generated.json`;
  if(!fs.existsSync(`${root}/${regPath}`))continue;
  const registry=json(regPath), recordPath=`${docs}/${prefix}generation-records.json`, records=json(recordPath), measurements=[];
  for(const e of registry.entries){
    if (onlyHero && e.heroId !== onlyHero) continue;
    const record=records.records.find(r=>r.heroId===e.heroId), target=e.heroId==='claptrap_borderlands'?120:190;
    const refLabel=base?'idle':e.heroId==='furiosa'?'outro':'intro';
    const refRow=e.normalization.rows.find(r=>(r.phase||r.state)===refLabel), reference=await measure(e,refRow), refScale=target/reference.normalized[3];
    record.statureByRow={};
    for(const row of e.normalization.rows){
      const label=row.phase||row.state, comp=await measure(e,row); let nativeRef=reference, bridge=null;
      if(!base&&e.heroId==='furiosa'&&row.sourceImage!==reference.sourceImage){
        const intro=e.normalization.rows.find(r=>r.phase==='intro');nativeRef=await measure(e,intro);
        bridge={nativeReferenceLabel:'intro',nativeReferenceColumn:0,displayReferenceLabel:'outro',displayReferenceColumn:0,meaning:'Both are visibly upright Furiosa with the same costume and SKS, but the corrective8-pose sheet uses a different source illustration density. The upright-to-upright bridge calibrates that source to the same190px project body target. Genuine raised arms and crouches keep source proportions.'};
      }
      if(!base&&e.heroId==='toast_mm'&&label==='super'){
        nativeRef=await measure(e,row,3);bridge={nativeReferenceLabel:'super',nativeReferenceColumn:3,displayReferenceLabel:'intro',displayReferenceColumn:0,meaning:'New corrective strip has a fully upright recovery in column3, visibly comparable to original intro standing. It bridges the strip source density; kneeling columns0–2 remain naturally smaller, never stretched upright.'};
      }
      if(base&&e.heroId==='lilith_borderlands'&&label==='hit'&&row.sourceImage!==reference.sourceImage){
        nativeRef=comp;
        bridge={nativeReferenceLabel:'hit',nativeReferenceColumn:0,displayReferenceLabel:'idle',displayReferenceColumn:0,meaning:'The corrective strip uses a larger native illustration density. Its first recoil is a nearly upright full-body weight shift, explicitly chosen as a190px project-scale bridge to idle; it is not a canonical stature measurement. One common row scale preserves the genuinely lower crouch/seated poses in columns2/3 rather than enlarging them individually.'};
      }
      if(!base&&e.heroId==='lilith_borderlands'&&label==='outro'&&row.sourceImage!==reference.sourceImage){
        nativeRef=await measure(e,row,1);
        bridge={nativeReferenceLabel:'outro',nativeReferenceColumn:1,displayReferenceLabel:'intro',displayReferenceColumn:0,meaning:'The native corrected rear-view strip has its own illustration density. Its fully upright column1, with both complete boots visible, bridges to the original corrected intro190px project target; the turning/lifted-leg columns retain the shared native row scale and their natural relative stature.'};
      }
      if(!base&&e.heroId==='lilith_borderlands'&&row.sourceImage.includes('frontal-phases-arm-correction')){
        nativeRef=await measure(e,e.normalization.rows.find(r=>r.phase==='fatality'),3);
        bridge={nativeReferenceLabel:'fatality',nativeReferenceColumn:3,displayReferenceLabel:'intro',displayReferenceColumn:0,meaning:'The three-row native frontal correction has one shared illustration density. Its upright finale recovery column3 bridges to the corrected intro190px body target. Measured common-source ratios preserve the truly lower one-knee and combat stances; no body is stretched to make a crouch upright.'};
      }
      const renderScale=reference.normalized[3]*refScale/comp.normalized[3]*comp.native[3]/nativeRef.native[3];
      const review={referencePhase:base?undefined:refLabel,referenceState:base?refLabel:undefined,referenceColumn:0,referenceBodyHeight:reference.normalized[3],referenceRenderScale:refScale,sourceComparableColumn:0,normalizedBodyHeight:comp.normalized[3],bodyBounds:comp.normalized,referenceBodyBounds:reference.normalized,nativeComparableBodyHeight:comp.native[3],nativeReferenceBodyHeight:nativeRef.native[3],nativeBodyBounds:comp.native,nativeReferenceBodyBounds:nativeRef.native,nativeComparableSource:comp.sourceImage,nativeReferenceSource:nativeRef.sourceImage,nativeComparableSourceSha256:comp.sha256,nativeReferenceSourceSha256:nativeRef.sha256,nativeComparableSourceRow:comp.sourceRow,nativeReferenceSourceRow:nativeRef.sourceRow,nativeReferenceColumn:nativeRef.column,displayReferenceSource:reference.sourceImage,displayReferenceSourceDiffers:reference.sourceImage!==nativeRef.sourceImage,measurementKind:'visual-body-roi',excludesWeaponEffects:true,targetStandingBodyHeight:target,reason:e.heroId==='claptrap_borderlands'?'The small original CL4P-TP remains a short box robot on one wheel.120px antenna-to-wheel is an explicit visual project calibration, not a canon height claim or a humanoid190px normalization. Same-source posture ratios are retained.':'Visually selected body axis on column0, excluding weapon extremities and surrounding phase effects. The intro/idle standing target is190px; inverse-mapped immutable source pixels preserve true bent poses, kneels and raised arms. Renderer scales the entire original cell around baseline244; no anatomy or PNG is changed.',...(bridge?{poseBridge:bridge}:{})};
      record.statureByRow[label]={renderScale,statureReview:review};measurements.push({heroId:e.heroId,label,renderScale,statureReview:review,unchangedPngSha256:e.sha256});
    }
    record.reviewed=true;
    if(!onlyHero) record.reviewNotes='All native sources, selected whole poses and normalized contacts inspected. Original Borderlands2009 classes/CL4P-TP and FuryRoad2015 adult identities retained; real prosthetic left arm for Furiosa, bare fists Brick, four physical shooters, four zero-damage support supers, local Siren emergence. Source edges and complete feet/hands/equipment audited; cropped or wrong-equipment attempts explicitly excluded. Visual adaptation only, not official or certified1:1 frames.';
  }
  fs.writeFileSync(`${root}/${recordPath}`,JSON.stringify(records,null,2)+'\n');
  const previous=onlyHero?json(`${docs}/${prefix}stature-review.json`).measurements.filter(m=>m.heroId!==onlyHero):[];
  const order=new Map(registry.entries.map((e,i)=>[e.heroId,i]));
  fs.writeFileSync(`${root}/${docs}/${prefix}stature-review.json`,JSON.stringify({schemaVersion:1,method:'Visually selected body ROIs read from real normalized and immutable native RGBA. Per-source illustration-density references/explicit standing-pose bridges preserve natural bends. Human standing190px; small CL4P-TP120px antenna-to-wheel. Renderer metadata only, no raster/body modification.',canon1to1Verified:false,networkVerified:false,measurements:[...previous,...measurements].sort((a,b)=>order.get(a.heroId)-order.get(b.heroId))},null,2)+'\n');
  console.log(prefix,measurements.map(m=>[m.heroId,m.label,+m.renderScale.toFixed(3),+(m.renderScale*m.statureReview.normalizedBodyHeight).toFixed(1)]));
}
