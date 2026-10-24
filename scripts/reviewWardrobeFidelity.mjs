/** Read-only review assistant: hashes local PNG evidence; no network, save write or equip. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {HEROES_DB} from '../src/game/heroes.js';
import {getOfficialCostumes,getOriginalCostumes,wardrobeActorKey} from '../src/game/wardrobe.js';
import {SPRITE_SHEET_META,getHeroSpriteSheetSrc,getSpriteSheetLayout} from '../src/game/spriteAssets.js';
import {getMeleeAnimationManifest} from '../src/game/melee/meleeAnimationManifest.js';
import {COSTUME_FIDELITY_CRITERIA as criteria,COSTUME_REFERENCE_VIEWS as views,assessCostumeFidelity,isLocalEvidencePath} from '../src/game/wardrobeFidelity.js';
const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i+=2){if(!args[i]?.startsWith('--')||!args[i+1])throw new Error('Expected --key value pairs');options[args[i].slice(2)]=args[i+1];}
const actor=HEROES_DB.find(a=>a.id===options.actor&&a.universe===options.universe);
if(!actor)throw new Error('Exact --actor and --universe required; no fuzzy matches.');
const item=[...getOfficialCostumes(actor),...getOriginalCostumes(actor)].find(e=>e.key===options.entry);
if(!item)throw new Error('Unknown --entry for this actor.');
const states=[];
for(const context of ['auto','tactics','collection','hud','melee']){
 const layout=getSpriteSheetLayout(getHeroSpriteSheetSrc(actor,context));
 const manifest=context==='melee'?getMeleeAnimationManifest(actor.id):null;
 const names=manifest?.animations?Object.keys(manifest.animations):layout.rowByState?Object.keys(layout.rowByState):layout.rows===1?['idle']:SPRITE_SHEET_META.rows;
 states.push(...names.map(name=>`${context}:${name}`));
}
const requirements={actorKey:wardrobeActorKey(actor),states:[...new Set(states)],asOf:new Date().toISOString().slice(0,10)};
if(options.template){
 const review={schemaVersion:1,entryId:item.id,actorKey:item.actorKey,incarnation:actor.incarnation||'',sourceWork:item.sourceWork||'',reviewer:'',reviewedOn:'',scores:Object.fromEntries(criteria.map(c=>[c.key,null])),notes:Object.fromEntries(criteria.map(c=>[c.key,''])),references:views.map(view=>({view,sourceUrl:item.sourceUrl||'',path:'',sha256:''})),sheet:{path:'',sha256:''},inGame:{path:'',sha256:''},checkedStates:requirements.states.map(state=>({state,passed:false,notes:'',path:'',sha256:''}))};
 fs.writeFileSync(options.template,JSON.stringify(review,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({template:options.template,requirements,scope:'Declared core sprite contexts. FPS hands and kart assets need separate review.'},null,2));
}else{
 if(!options.review||!options.root)throw new Error('Use --template NEW_FILE, or --review FILE --root EVIDENCE_DIRECTORY.');
 const review=JSON.parse(fs.readFileSync(options.review,'utf8'));
 const root=fs.realpathSync(options.root),inventory=new Map(),fileErrors=[];
 const proofs=[...(Array.isArray(review.references)?review.references:[]),review.sheet,review.inGame,...(Array.isArray(review.checkedStates)?review.checkedStates:[])];
 for(const file of new Set(proofs.map(p=>p?.path).filter(Boolean))){
  try{
   if(!isLocalEvidencePath(file))throw new Error('Unsafe relative path');
   const resolved=fs.realpathSync(path.resolve(root,file));
   const relative=path.relative(root,resolved);
   if(!relative||relative.startsWith('..'+path.sep)||relative==='..'||path.isAbsolute(relative))throw new Error('Evidence escaped root');
   const stat=fs.statSync(resolved);if(!stat.isFile()||stat.size>25*1024*1024)throw new Error('Evidence must be a file <= 25 MiB');
   const bytes=fs.readFileSync(resolved);
   if(bytes.length<45||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.subarray(12,16).toString()!=='IHDR'||!bytes.includes(Buffer.from('IEND')))throw new Error('PNG evidence header required');
   inventory.set(file,{sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)});
  }catch(error){fileErrors.push({path:file,error:error.message});}
 }
 const result=assessCostumeFidelity(item,review,inventory,requirements);
 console.log(JSON.stringify({...result,requirements,fileErrors,verifiedFiles:inventory.size,
  scope:'PNG header/dimensions/hash and record consistency only. Not full PNG decoding or artistic verification; FPS/kart require a separate review.'},null,2));
 process.exitCode=result.blockers.length||fileErrors.length?2:0;
}
