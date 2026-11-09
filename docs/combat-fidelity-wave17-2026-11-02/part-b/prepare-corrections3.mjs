import fs from 'node:fs';
import {createHash} from 'node:crypto';
const D='docs/combat-fidelity-wave17-2026-11-02/part-b';
const entries=JSON.parse(fs.readFileSync(D+'/source-plan.json')).entries;
const instructions={
 team_fortress_2_soldier:'Stock RED Soldier, stock Rocket Launcher only. Prepare, shoulder launcher, release a compact rocket from the actual complete barrel THIRD, recover with the launcher lowered. No Shotgun. The fourth recovery weapon must end well inside its cell.',
 team_fortress_2_medic:'Stock RED Medic with stock Medi Gun, complete backpack and hose in EVERY cell. Prepare, aim, short red healing beam from the actual nozzle THIRD only, recover without beam. No Syringe Gun or Kritzkrieg, no free Ubercharge. In particular the complete metal nozzle must end well inside the fourth cell.',
 nemesis_awaken_realms_soldier:'Core-box Nemesis Soldier with complete ordinary Assault Rifle in EVERY cell. Prepare, aim, small real-barrel muzzle flash THIRD only, recover with rifle lowered. The whole rifle must end well inside the fourth cell.'
};
const sha=b=>createHash('sha256').update(b).digest('hex');
const records=Object.entries(instructions).map(([id,action])=>{
 const s=entries.find(e=>e.heroId===id),basename=id+'-correction2';
 const prompt=`Create a NEW supplementary production pixel-art sprite sheet for ${s.displayName}, ${s.sourceWork}. Reference the supplied image only for the SAME selected character's costume and equipment. Exactly EIGHT DIFFERENT COMPLETE full-body drawings arranged in FOUR COLUMNS and TWO ROWS. True transparent RGBA background, no floor, labels, UI or scenery. IMPORTANT: canvas aspect ratio 3:2, not a single long horizontal strip. Reserve at least 10 percent EMPTY transparent margin on ALL FOUR outer edges, and generous transparent gutters. Every body, hand, foot, barrel, nozzle, hose, projectile and complete weapon must fit comfortably inside its cell. No cropping at any canvas or cell edge.\nAppearance: ${s.appearance}. Equipment: ${s.weapon}.\nROW1: Four different poses in prepare / anticipate / release THIRD / recover order. ${action}\nROW2: A SECOND distinct four-pose sequence of the SAME action, with different genuine body positions. Prepare / anticipate / release THIRD / recover. ${action}\nNo copied, mirrored or repeated drawings. No detached effect in place of a person. Draw all EIGHT complete people and complete weapons, including the two rightmost recovery cells. This is an adapted game animation, not an official source frame. No target or person being harmed.`;
 const promptFile=D+'/sources/'+basename+'-prompt.txt';fs.writeFileSync(promptFile,prompt+'\n');
 return {heroId:id,basename,rowCount:2,columns:4,reason:'First four-pose corrective has its last weapon cut by the canvas right edge; all four drawings of that source are excluded. Generate two rows with margins and retain only a fully complete reviewed four-pose row.',referenceImage:D+'/sources/'+id+'.png',referenceSha256:sha(fs.readFileSync(D+'/sources/'+id+'.png')),supersededCorrective:D+'/sources/'+id+'-correction1.png',supersededCorrectiveSha256:sha(fs.readFileSync(D+'/sources/'+id+'-correction1.png')),promptFile,promptSha256:sha(fs.readFileSync(promptFile)),source1to1Verified:false};
});
const path=D+'/source-plan-corrections3.json';
fs.writeFileSync(path,JSON.stringify({schemaVersion:1,wave:17,part:'B',createdAt:new Date().toISOString(),beforeCorrectiveGeneration:true,records},null,2)+'\n');
fs.writeFileSync(D+'/source-plan-corrections3-receipt.json',JSON.stringify({path,sha256:sha(fs.readFileSync(path)),frozenAt:new Date().toISOString(),beforeGeneration:true},null,2)+'\n');
console.log(JSON.stringify(records.map(r=>({id:r.heroId,drawings:8}))));
