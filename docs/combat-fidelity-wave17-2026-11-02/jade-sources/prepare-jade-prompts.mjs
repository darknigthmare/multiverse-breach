import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='docs/combat-fidelity-wave17-2026-11-02/jade-sources';
if((await fs.readdir(dir)).some(name=>name.endsWith('.tool-receipt.json')))throw new Error('These pre-generation plans already have actual receipts; append a separately dated amendment instead of rewriting them');
const plan=JSON.parse(await fs.readFile(dir+'/source-plan.json','utf8'));
const descriptions={
 idle:'Quiet grounded readiness; four different subtle breathing/weight/arm poses, staff collapsed and secured.',
 walk:'Four successive rightward walking footfalls with alternating knees, feet and arms; staff collapsed and secured.',
 run:'Four successive rightward running strides with different leg phases and swinging arms; staff collapsed and secured.',
 turn:'Genuine four-pose body turn from left facing through rear-three-quarter to right facing; not mirrored copies.',
 jumpStart:'Four progressive anticipation poses: bend knees, dip hips, compress ankles, then lift from takeoff; staff collapsed.',
 jumpRise:'Four rising airborne body poses with changing knees and arm balance, complete shoes; staff collapsed.',
 jumpApex:'Four physically different apex poses: one knee tuck, both knees tuck, opening one leg, extending both legs; staff collapsed.',
 fall:'Four descending poses with gradually extended knees and changing arm balance; staff collapsed.',
 fastFall:'Four steep fast descending poses with a compact torso and successively lowered legs; staff collapsed.',
 land:'Four foot contact and landing recovery poses: toes touch, knees compress, lowered hips, stand from crouch.',
 crouchEnter:'Four descending into stealth crouch poses, different knee angles and hand positions; staff collapsed.',
 crouchIdle:'Four naturally low stealth crouch balance poses; do not enlarge crouching body to standing height.',
 crouchExit:'Four rising out of crouch poses, gradual knee extension and torso lift; staff collapsed.',
 crouchCharge:'Four low braced Daï-Jo staff windup poses, complete staff in both hands, no energy beam or invisible weapon.',
 taunt1:'Four informational photo-reporting gestures: lift compact camera, aim, press shutter without a damage ray, lower camera. Staff secured.',
 hitStun:'Four distinct off-balance physical recoil poses, one hand to shoulder/torso, no injury or blood; staff secured.',
 shieldEnter:'Four raising the real Daï-Jo across the torso into a braced guarded stance; this depicts adapted physical bracing, no forcefield or shield.',
 shieldHold:'Four distinct staff-bracing shifts and foot placements with both hands gripping the complete Daï-Jo; no magical shield.',
 shieldHit:'Four physical staff-brace recoil poses, successive bent knees and weight shifts, no attacker, no detached weapon.',
 perfectShield:'Four distinct quick evasive sidestep/parry stances with the Daï-Jo; no barrier, disc or invented shield.',
 shieldBreak:'Four losing balance after a brace: staff lowers, stagger, knee dip, recovery; complete equipment, no injury.',
 shieldExit:'Four lowering the Daï-Jo and returning from physical brace to readiness.',
 dead:'Four distinct safe unconscious knockout settled body poses, lying on side then still; closed eyes, no injury, blood or corpse detail. Staff secured.',
 defeat:'Four distinct defeated but alive poses: stagger, kneel, head lowered, one hand supporting body; no injury. Staff secured.',
 attackLight1:'Four phases of a physical Daï-Jo horizontal first strike: windup, staff pulled back, clear forward contact extension in COLUMN THREE, recovery. Staff is a long blunt staff, never a sword.',
 attackLight2:'Four phases of second Daï-Jo upward diagonal strike: anticipation, chamber, complete staff extended at contact in COLUMN THREE, recovery.',
 attackLight3:'Four phases of Daï-Jo whirlwind finisher: low windup, turned torso, broad physical staff sweep in COLUMN THREE, settled recovery; no duplicated body or painted motion copies.',
 crouchLight:'Four phases of a low crouching Daï-Jo sweep: crouch, load staff to rear, complete blunt staff extended low in COLUMN THREE, crouched recovery.',
 chargeStart:'Four phases of taking stationary Daï-Jo charge stance: bring staff forward, widen feet, draw staff close, settle deep concentration. No attack yet.',
 chargeLoop:'Four genuinely different small changes of held stationary Daï-Jo concentration: different hands/shoulders/knees, complete staff; no copy offsets.',
 chargeRelease:'Four phases of release: loaded physical staff, late windup, full Daï-Jo release in COLUMN THREE with small native pale-green source-authored energy near staff only, grounded recovery. No huge aura masking body.',
 chargeRecovery:'Four distinct post-charge recovery poses with progressively lowered staff and knees re-extending.',
 attackRecovery:'Four distinct physical post-combo recovery steps, Daï-Jo complete in both hands and returning to ready.',
 special:'Four phases of stationary charged Daï-Jo super: prepare, concentrate, staff release in COLUMN THREE with small native pale-green energy from the actual staff, recover. No camera damage and no detached attacker.',
 aerialNeutral:'Four adapted platform-fighter aerial staff motions: tuck, chamber, clear blunt-staff contact in COLUMN THREE, untuck. Complete hands and shoes.',
 aerialForward:'Four adapted forward airborne Daï-Jo thrust poses: preparation, reach, physical staff extends forward in COLUMN THREE, recover before landing.',
 aerialDown:'Four adapted downward airborne Daï-Jo strike poses: knees tuck, staff angles down, complete staff contacts below in COLUMN THREE, recover. No sword or spear blade.',
 intro:'Four entrance poses: take a step, look right, unfold Daï-Jo, settle reporter-combat readiness.',
 victory:'Four understated relieved victory poses: relax staff, smile, raise free hand slightly, settle; no trophy, text or other actor.',
 ledgeAttack:'Four physical adapted ledge getup Daï-Jo strikes: low prepared body, rise, clear staff contact in COLUMN THREE, balanced recovery; complete hands/shoes.',
 ledgeCatch:'Four progressive hand-to-ledge catch body poses with staff collapsed and secured. BOTH EMPTY HANDS visible over head, wrists connected, fingertips point upward; no ledge/scenery drawn.',
 ledgeHang:'Four distinct suspended hanging poses with staff collapsed and secured, both EMPTY hands held high above head, complete elbows/knees/shoes. Hand level is highest body point, no ledge drawn.',
 ledgeClimb:'Four successive full-body pull-up states, BOTH EMPTY hands on one imaginary horizontal ledge line: hands above head, hands at face, hands at lower chest, hands beside hips as torso clears ledge. Hands progressively lower relative to body; staff collapsed/secured. No ledge drawn.',
 ledgeDrop:'Four letting-go and falling-away body poses: hand release, arms open, knees bend, body descends. Staff collapsed; no ledge/scenery.',
 ledgeJump:'Four jumping up from imaginary ledge poses: hand push, knee rise, arm swing, open airborne recovery. Staff collapsed; no ledge/scenery.',
 reservedGripStudy:'Four different upright Daï-Jo grip studies for calibration only, complete body and staff. These extra studies will not be used as game-state rows.',
 reservedStandingStudy:'Four different upright standing body studies for calibration only; staff collapsed. These extra studies will not be counted as game-state rows.',
 reservedCameraStudy:'Four different relaxed camera handling studies, informational only, no flash beam. These extra studies will not be counted as game-state rows.'
};
const appearance='JADE from original BEYOND GOOD & EVIL (2003), adult Hillyan action-reporter. Exact primary-reference appearance: very short black swept/pixie-bob hair fully visible above a GREEN CLOTH HEADBAND across the forehead; no hat, cap or bonnet. Olive/tan skin, green eyes and green lipstick. Dark GREEN cropped jacket with rolled cuffs over a white cropped tank top, loose TEAL/GREEN trousers with darker swirl-pattern details, dark waist belt with reddish trim, brown practical sneakers, dark blue-black fingerless wrist gloves. Compact grey-blue camera with round lens and small red buttons, retractable blunt metallic Daï-Jo staff, Gyrodisk glove. No beige trousers, no boots or knee armour, no sword, no shield, no cape, no gun, no headwear over the black hair. Match the actual official2003 Steam screenshots supplied for appearance. Do not copy any screenshot pose or scenery. Draw new pixel-art motion.';
const layout='Transparent RGBA pixel-art animation sheet, exactly FOUR COLUMNS by EIGHT ROWS, 32 separate complete adult bodies. PORTRAIT canvas with generous transparent outer margins and wide transparent gutters. Each physical ROW shows one named state and FOUR successive genuinely different articulated full-body drawings, left to right; all32 complete silhouettes and entire equipment fit inside the canvas and never touch another drawing. Same orthographic right-facing three-quarter side view and native pixel-art cluster style throughout; keep crouches/hangs/prone poses naturally lower, not stretched to standing height. No background, floor, ledge, shadow, caption, text, grid, labels, opponent or recycled/mirrored/rotated/translated duplicate. Complete heads, fingers, wrists, feet, camera and staff; extra-wide horizontal room for staff reach. Columns1and2 prepare, COLUMN3 is the contact/release pose for physical attacks, COLUMN4 recovers. Every row must be present, especially ROW8.';
const records=[];
for(const a of plan.atlases){const prompt=appearance+'\n\n'+layout+'\n\n'+a.requestedStates.map((state,i)=>`ROW ${i+1}, ${state}: ${descriptions[state]}`).join('\n')+'\n\nThese are newly drawn source-coherent adaptations for a platform fighter, not extracted official source frames. No damaging camera ray. Preserve this selected2003 outfit for every drawing.';const p=dir+'/'+a.id+'.planned.prompt.txt';await fs.writeFile(p,prompt+'\n');records.push({id:a.id,batch:a.batch,states:a.requestedStates,promptFile:p,arguments:{prompt,referenced_image_paths:[process.cwd()+'/'+dir+'/research/steam-official-screen-0.jpg',process.cwd()+'/'+dir+'/research/steam-official-screen-2.jpg'],transparent_background:true}});}
const erratum={schemaVersion:1,createdAt:new Date().toISOString(),beforeFirstGeneration:true,sourcePlanSha256:createHash('sha256').update(await fs.readFile(dir+'/source-plan.json')).digest('hex'),reason:'Primary official screenshots were actually opened after initial inherited appearance plan; green headband and teal/green trousers supersede the mistaken bonnet/beige wording. Original source-plan remains unchanged for chronology.',correctedAppearance:appearance,primaryScreenshots:await Promise.all([0,1,2,3].map(async i=>{const p=dir+'/research/steam-official-screen-'+i+'.jpg';return{path:p,sha256:createHash('sha256').update(await fs.readFile(p)).digest('hex'),actuallyViewed:true}})),source1to1Verified:false};
await fs.writeFile(dir+'/appearance-erratum-before-first-generation.json',JSON.stringify(erratum,null,2)+'\n');
await fs.writeFile(dir+'/planned-tool-arguments.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({sheets:records.length,states:45,retainedTarget:180,appearanceErratum:erratum.createdAt}));
