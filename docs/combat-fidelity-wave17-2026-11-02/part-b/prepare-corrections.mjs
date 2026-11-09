import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {nativePrompt} from './prompts.mjs';
const D='docs/combat-fidelity-wave17-2026-11-02/part-b';
const entries=[...JSON.parse(fs.readFileSync(D+'/source-plan.json')).entries,...JSON.parse(fs.readFileSync(D+'/source-plan-replacements.json')).entries];
const corrections=[
 ['sophie_hotd',6,'Invented tablet in the first source; replace all48 with empty-handed human gestures.',null],
 ['bioshock_rapture_jack',2,'Electric discharge was visible in anticipation/recovery. Replace two special demonstration rows.',[
 'Controlled Electro Bolt demonstration: keep the pipe wrench in the right hand and left palm entirely unlit in poses1,2,4. Left-palm blue bolt ONLY in pose3.',
 'Second distinct Electro Bolt sequence: balanced anticipation, aim left palm, emit one compact blue bolt ONLY in pose3, recover with an entirely unlit palm. Wrench remains complete in right hand.']],
 ['bioshock_rapture_bouncer',4,'Spinning trails occurred in recovery and quiet victory; replace four specific rows.',[
 'Four different compact right-arm drill strike poses: prepare, anticipate, extend actual drill to contact THIRD, retract. Local motion trace only on pose3, never a beam.',
 'Four different quiet in-character final victory poses, complete round diving suit and drill. Absolutely no sparks, swirl, attack or discharge in this row.',
 'Four different heavy Bouncer drill-charge poses, complete suit and right-arm drill. Contact on pose3 only, then clear stationary recovery with no lingering motion effect.',
 'Four different ordinary right-arm drill contact poses, small movement, body and actual drill visible; contact third, no effect before or after.']],
 ['counter_strike_sas',4,'Initial source has only40 figures, missing final defeat and super; suppressor flashes also oversized.',[
 'Four different exhausted but uninjured final-defeat postures, complete SAS outfit and suppressed M4A1-S visible, lowered weapon, no shooting or effect.',
 'Four different compact M4A1-S control poses. Prepare, aim, quiet suppressed shot THIRD, recover. Tiny gray puff at the real suppressor tip in pose3 only; no orange muzzle fireball.',
 'Another distinct four-pose M4A1-S controlled sequence. Quiet shot THIRD; keep long complete silencer, no orange fire or beam in any pose.',
 'Four different ordinary M4A1-S shooting poses. Quiet recoil THIRD, tiny gray suppressor-tip trace only then, no flash before or after.']],
 ['hotline_miami_richter',3,'Suppressor source flashes were oversized; replace only the three actual action rows.',[
 'Four controlled suppressed submachine-gun poses: prepare, aim, quiet shot THIRD, recover. Tiny gray puff only at the real suppressor tip in pose3. No orange muzzle fireball.',
 'Another distinct four-pose controlled suppressed submachine-gun sequence. Quiet shot THIRD only, retain complete gray rat mask and orange-brown jacket.',
 'Four distinct ordinary suppressed submachine-gun shooting poses, quiet recoil THIRD. No orange fire, ray or discharge before or after pose3.']],
 ['team_fortress_2_soldier',1,'Basic action was incorrectly rendered with Shotgun while the selected simple uses Rocket Launcher.',[
 'Four different ordinary stock ROCKET LAUNCHER poses, no Shotgun. Prepare, shoulder launcher, release one compact rocket from the actual barrel THIRD, recover with launcher complete. RED coat and low olive helmet.']],
 ['team_fortress_2_medic',1,'Initial source has47 figures, only three complete super bodies.',[
 'Four different stock Medi Gun treatment poses with complete Medic body, real nozzle, hose and backpack in EVERY cell. Prepare, aim, emit a short red healing beam from actual Medi Gun nozzle THIRD, recover without beam. No Syringe Gun, no Kritzkrieg, no free Ubercharge.']],
 ['sanctum_sweet_autumn',2,'Initial source has46 figures: super and ordinary action each have only three complete bodies.',[
 'Four different complete Sweet Autumn bodies with the actual REX rocket launcher in EVERY cell. Prepare, aim, release one compact orange rocket at real barrel THIRD, recover without discharge.',
 'Another distinct ordinary four-pose REX sequence with four complete bodies and weapons. Fire THIRD only, no effects in poses1,2,4. Do not replace a complete character with an isolated rocket drawing.']],
 ['crypt_necrodancer_cadence',1,'The super was drawn with a secondary inventory bomb instead of the selected ordinary dagger loadout.',[
 'Four distinct Cadence dagger poses on one musical beat: prepare compact dagger, anticipate, extend attached physical dagger in pose3, recover. NO bomb, NO Golden Lute, NO sword-wave projectile. Keep blue tunic, red-orange hair and brown boots.']],
 ['nemesis_awaken_realms_soldier',1,'Initial source has47 figures, only three complete super bodies.',[
 'Four different complete core-box Soldier bodies with the complete ordinary Assault Rifle in EVERY cell. Prepare, aim, small real-barrel muzzle flash THIRD, clear recovery. No missing body or isolated flash cell.']],
 ['atomic_heart_p3',3,'Special energy was emitted during quiet victory and persisted before/after release.',[
 'Four different complete P-3 bodies: left CHAR-les glove unlit in prepare and anticipation, compact blue SHOK from actual LEFT palm only THIRD, recover with unlit glove. Keep complete Zvezdochka in RIGHT hand.',
 'Four different quiet final-victory acknowledgements, actual P-3 body and complete right-hand Zvezdochka. Glove stays unlit; NO electrical discharge, flare or attack in this row.',
 'Another distinct four-pose SHOK sequence from LEFT palm only THIRD. Prepare and anticipate unlit, discharge third, recover unlit; Zvezdochka remains attached to RIGHT hand.']]
];
const sha=b=>createHash('sha256').update(b).digest('hex');
const records=corrections.map(([id,rows,reason,instructions])=>{
 const s=entries.find(e=>e.heroId===id),basename=id+'-correction1';
 const prompt=id==='sophie_hotd'?nativePrompt(id)+'\nCORRECTION: Remove the invented tablet, laptop, phone, scanner and every other carried device from ALL48 drawings. Both hands are empty in every cell. Sophie only warns and points to a safe exit with ordinary human gestures. Keep the same source costume and complete body, four distinct native poses per sequence.':
 `Using the supplied native sprite sheet ONLY as a visual reference for this SAME selected character, draw a NEW small supplementary production sprite sheet. Selected character: ${s.displayName}, ${s.sourceWork}. Exactly ${rows*4} DISTINCT COMPLETE native full-body drawings in exactly FOUR columns and ${rows} separate horizontal row${rows===1?'':'s'}. Crisp detailed pixel art; true transparent RGBA background. Every body, hand, foot and the WHOLE equipment remains inside its own cell with generous empty transparent gutters. No labels, scenery, floor, UI or second character. Never use a detached weapon/effect instead of a complete body. Keep appearance: ${s.appearance}. Selected equipment: ${s.weapon}.\nEach row has exactly FOUR different poses, ordered PREPARE / ANTICIPATE / RELEASE / RECOVER. Release is always THIRD; never copy or mirror a drawing.\n${instructions.map((x,i)=>'ROW'+(i+1)+': '+x).join('\n')}\nPreserve the stated source character and equipment. This is a newly drawn adapted four-pose game animation, not an official source frame. No people being hit or harmed. All selected equipment and the complete body must appear in each of the ${rows*4} separate drawings.`;
 const promptFile=D+'/sources/'+basename+'-prompt.txt';fs.writeFileSync(promptFile,prompt+'\n');
 return{heroId:id,basename,rowCount:rows,columns:id==='sophie_hotd'?8:4,reason,beforeGeneration:true,referenceImage:D+'/sources/'+id+'.png',referenceSha256:sha(fs.readFileSync(D+'/sources/'+id+'.png')),promptFile,promptSha256:sha(fs.readFileSync(promptFile)),observedWith:'view_image',source1to1Verified:false};
});
const plan={schemaVersion:1,wave:17,part:'B',createdAt:new Date().toISOString(),beforeCorrectiveGeneration:true,method:'Genuine newly generated complete drawings. Existing source pixels are never painted, mirrored or erased. Only reviewed native component selections and nearest-neighbor packing are allowed.',records};
fs.writeFileSync(D+'/source-plan-corrections1.json',JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify(records.map(r=>({id:r.heroId,drawings:r.rowCount*r.columns}))));
