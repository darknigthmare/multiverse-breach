import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const directory='docs/combat-fidelity-wave14-2026-10-25/aragorn-sources';
const reference=process.argv[2];
if(!reference)throw new Error('Pass original W14 art-A native48 reference path');
await fs.mkdir(directory,{recursive:true});
const referenceBytes=await fs.readFile(reference),savedImage=`${directory}/aragorn-identity-reference-original.png`;
await fs.writeFile(savedImage,referenceBytes);
const identity=`Draw BRAND-NEW detailed native PIXEL-ART game animation full bodies of ADULT ARAGORN / STRIDER in THE FELLOWSHIP OF THE RING (2001), before Amon Hen. Match supplied new W14 identity drawing ONLY for his human likeness, exact costume and palette: shoulder-length dark brown hair, short dark beard, weathered brown leather ranger coat over muted dark tunic, dark desaturated green-gray ranger cloak, dark trousers and weathered leather boots. Use exactly this costume on EVERY body and source. He has a conventional physical RANGER LONGSWORD with a modest plain crossguard, dull silver blade and dark leather grip; dark scabbard attached at belt. This is pre-Anduril Strider: NO reforged Anduril, kingly armor, crown, white tree, Army of the Dead, ghost, glow, energy, magic, beam, aura, fire, summoned beings, opponent, wounds, blood or gore. Exactly two natural arms and two natural legs. Free visible BARE HUMAN PALMS and wrists whenever reaching, hanging or climbing; sword fully SHEATHED in attached scabbard in all locomotion/ledge rows. On actual sword combat rows a real hand grips the physical sword hilt; never floats. Physical guard/parry, charge and jumping are original crossover gameplay adaptations, not official film animation. Do NOT reuse a reference pose.\n\nLAYOUT IS CRITICAL: TRUE TRANSPARENT RGBA, no scene, ledge, platform, floor, shadow, text, labels, border, grid or checkerboard. EXACTLY EIGHT COLUMNS AND SIX ROWS =48 SEPARATE COMPLETE full-body drawings on a LANDSCAPE canvas1536x1024. Allocate SIX equally spaced horizontal bands and EIGHT equal columns BEFORE drawing. Each row has TWO separate groups of FOUR chronological poses. ALL SIX ROWS, all EIGHT COLUMNS, MUST FIT. Use smaller consistent bodies if necessary. A constant upright anatomical crown-to-sole size across source (roughly120px on a1536x1024 landscape image); crouched/hanging/prone bodies retain natural anatomical projection and must NOT be enlarged to fill cells. Very wide TRANSPARENT gutters horizontally and vertically, plus a large transparent border all around. NO hair, boot, cloak, fingertip, blade, scabbard or hand may touch another body or canvas edge. Every figure includes full head, hands, cloak hem and BOTH COMPLETE BOOTS. Default side/front three-quarter facing SCREEN RIGHT except the real turn row. Every row is FOUR DIFFERENT chronological articulated poses, never mirrored, rotated, translated, recolored, reused or effect-only copies. Crisp pixel-art edges and restrained consistent brown leather / dark gray-green cloak / dark hair palette.\n\n`;
const pages=[
 ['aragorn-motion-a','Motion',['idle','walk','run','turn','jumpStart','jumpRise','jumpApex','fall'],[
 'idle: four distinct alert breathing/weight shifts, hands low, sword sheathed.',
 'walk: four alternating walking strides RIGHT with connected natural opposing arms and complete boots.',
 'run: four different running strides RIGHT, alternating knees/arms, clear contact and flight phases.',
 'turn: real physical turnaround:1 facing LEFT,2 left-rear three-quarter,3 right-rear three-quarter,4 facing RIGHT. All four newly articulated, no simple mirroring.',
 'jumpStart:1 upright preparation,2 deep knee bend,3 heels lift,4 actual takeoff with changed arms and knees.',
 'jumpRise: four different rising airborne configurations, knees/hips/arms change, cloak follows actual motion.',
 'jumpApex: four different apex balancing/tucked configurations, ordinary human jump with sheathed sword.',
 'fall: four descending configurations, knees/boots progressively prepare for landing.'
 ]],
 ['aragorn-motion-b','Motion',['fastFall','land','crouchEnter','crouchIdle','crouchExit','crouchCharge','taunt1','hitStun'],[
 'fastFall: four distinct descending compact body configurations, arms and knees gather, sword sheathed.',
 'land:1 feet touch unseen ground,2 deep knee compression,3 push upward,4 settle upright; no ground drawn.',
 'crouchEnter: four genuine progressive changes from upright through half crouch to deep low crouch.',
 'crouchIdle: four different low watchful crouched breathing poses; hands, shoulders and head change but remain low.',
 'crouchExit: four real rising configurations from low crouch through half stand to upright.',
 'crouchCharge: four distinct low physical preparations, hips/shoulders/forearms progressively brace, no energy.',
 'taunt1: restrained confident ranger gesture: looks aside, lifts bare hand slightly, firm head nod, settles; four bodies.',
 'hitStun: four noninjured startled recoil/recovery configurations; balance lost and regained, no wounds.'
 ]],
 ['aragorn-defense','Motion',['shieldEnter','shieldHold','shieldHit','perfectShield','shieldBreak','shieldExit','dead','defeat'],[
 'shieldEnter: physical defensive brace behind forearms, progressively lowering; sword sheathed, NO object or energy shield.',
 'shieldHold: four different physical guarded configurations, protective bare forearms and stable feet; sword sheathed.',
 'shieldHit: physical guarded flinch through four connected recoil configurations; no effects or attacker.',
 'perfectShield: four distinct quick physical forearm-parry and balanced recovery configurations, sword sheathed.',
 'shieldBreak: guard opens, arms separate, stumble, regain footing; no electric or magic break.',
 'shieldExit: relax guard and return to alert upright neutral over four distinct poses.',
 'dead: four distinct full-body non-graphic unconscious resting/settling configurations lying on side, sword sheathed. Full hair, hands, cloak and boots; natural short prone height.',
 'defeat: exhausted stagger, one knee, low seated crouch, tired living recovery; four different noninjured bodies.'
 ]],
 ['aragorn-combat-a','Combat',['attackLight1','attackLight2','attackLight3','crouchLight','chargeStart','chargeLoop','chargeRelease','chargeRecovery'],[
 'attackLight1: controlled horizontal ranger-longsword cut RIGHT:1 guard,2 hips wind up,3 physical blade cuts forward into empty space,4 relax and recover.',
 'attackLight2: distinct diagonal longsword cut RIGHT:1 low guard,2 lift sword,3 diagonal physical cut with torso twist,4 lower sword recovery.',
 'attackLight3: short forward human boot kick:1 ready,2 knee lifts,3 boot extends RIGHT,4 genuine relaxed knee recovery; sword kept close.',
 'crouchLight: low crouched physical sword cut:1 low guard,2 coil torso,3 low blade extension RIGHT,4 relax back into crouch.',
 'chargeStart: four distinct physical sword preparations: feet spread, hands grasp hilt, elbows lift, shoulders brace. No energy.',
 'chargeLoop: four different steady physical sword-ready body configurations, breathing shoulders/wrists change; no effect.',
 'chargeRelease: four genuine forceful physical cuts:1 braced backswing,2 hips start,3 extended longsword cut RIGHT,4 relaxed no-contact recovery. No glow or magic.',
 'chargeRecovery: four genuine articulated recovery bodies: sword lowers, elbows relax, shoulders release, return alert. No held impact extension.'
 ]],
 ['aragorn-combat-b','Combat',['attackRecovery','special','aerialNeutral','aerialForward','aerialDown','intro','victory','ledgeAttack'],[
 'attackRecovery: four different return-to-neutral bodies after a cut, sword hand/shoulder lower and relax; no contact extension.',
 'special: four genuine controlled physical ranger-longsword cuts:1 two-hand guard,2 hips coil,3 actual extended forward blade cut RIGHT,4 distinct relaxed recovery. No effects, glow, ghosts or summons.',
 'aerialNeutral: ordinary short-jump defensive body twist over four different airborne configurations, sword close; no flying power.',
 'aerialForward: airborne short boot kick RIGHT:1 tuck,2 knee lifts,3 boot extends,4 relaxed knee recovery; sword secure.',
 'aerialDown: four actual airborne downward heel/stomp configurations with articulated hips/knees and real relaxed recovery; no dive superpower.',
 'intro: four cautious arriving bodies, sword sheathed, looks ahead, adjusts cloak, settles alert.',
 'victory: four different composed relieved bodies, sword lowers, small firm nod, sheath sword, relaxed ranger stance.',
 'ledgeAttack: physical low braced attack after climbing:1 low crouched body with sword sheathed,2 rises drawing sword,3 short physical sword extension RIGHT,4 relaxed guard recovery. No ledge or opponent.'
 ]],
 ['aragorn-ledge','Combat',['ledgeCatch','ledgeHang','ledgeClimb','ledgeDrop','ledgeJump','uprightCalibration','reservedGripStudy','reservedScabbardStudy'],[
 'ledgeCatch: four chronological reaching-to-grip bodies. Leading bare hand reaches to upper RIGHT implied edge:1 open hand approaches without contact,2/3/4 visible palm and curled fingers GRIP. Real wrist/elbow connected, whole body below; both hands FREE, sword SHEATHED at hip, no ledge drawn.',
 'ledgeHang: four different genuine hanging bodies with leading BARE HAND visibly gripping upper RIGHT implied edge. Wrist/forearm connected, shoulders below hand, knees flex and complete boots below. Other free hand supports. Sword SHEATHED in attached scabbard. No ledge drawn.',
 'ledgeClimb: real ASCENDING four-body climb relative to fixed leading-palm contact:1 hanging head BELOW palm,2 chest pulls UP toward palm,3 torso ABOVE palm and knee lifts while palm pushes DOWN near waist,4 low crouched body entirely ABOVE implied edge with palm pressing DOWN BELOW KNEE. Hand-to-crown vertical relationship MUST move from above head to below torso. Four different complete bodies, sword SHEATHED, no ledge.',
 'ledgeDrop: four actual release/drop configurations:1 bare hand opens to release,2 arms lower,3 hips descend,4 boots extend and arms balance; sword SHEATHED, no ledge.',
 'ledgeJump: four real release/jump configurations:1 flex legs while hand near edge,2 hands RELEASE and shoulders rise,3 hips rise with tucked knee,4 airborne outward body extension; sword SHEATHED, no ledge.',
 'uprightCalibration: RESERVED CALIBRATION ONLY. Four different fully upright neutral ranger bodies, hands low and sword sheathed, exact same anatomical size as all other rows. NOT game states.',
 'reservedGripStudy: RESERVED STUDY ONLY. Four full upright bodies showing bare palms/wrists in different positions, sword SHEATHED. Full head/boots, same body scale. NOT game states.',
 'reservedScabbardStudy: RESERVED STUDY ONLY. Four complete upright bodies adjusting attached scabbard safely; sheathed sword, full head and boots, same body scale. NOT game states.'
 ]]
];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),plan=[];
for(const[id,batch,states,descriptions]of pages){
 const extendedStates=[...states,'reservedUprightStudyA','reservedUprightStudyB','reservedCloakStudy','reservedBeltStudy'];const extendedDescriptions=[...descriptions,...['A','B','C','D'].map(label=>`RESERVED FULL-BODY CALIBRATION STUDY ${label}: four DISTINCT completely upright relaxed bodies, hands low, sword SHEATHED, all head/hair/boots complete, same anatomical scale as other rows; NOT game states and do not replace earlier rows.`)];const prompt=identity+Array.from({length:6},(_,r)=>`PHYSICAL ROW${r+1}, COLUMNS1-4: ${extendedDescriptions[r*2]} COLUMNS5-8: ${extendedDescriptions[r*2+1]}`).join('\n')+'\n\nFINAL COUNT:48 complete native full bodies, EIGHT COLUMNS × SIX ROWS on LANDSCAPE1536x1024. Each half-row is FOUR distinct chronological articulated poses. ALL48 complete bodies fit within transparent safe border. Preserve the same pre-Anduril Strider2001 leather coat, ranger cloak, hair, beard, boots and physical ranger longsword in every body.\n';
 const promptFile=`${directory}/${id}.prompt.txt`;await fs.writeFile(promptFile,prompt);
 plan.push({id,heroId:'aragorn_lotr',batch,expectedRows:12,sourceColumns:8,physicalRows:6,states:extendedStates,promptFile,promptFileSha256:sha(prompt),arguments:{prompt,referenced_image_paths:[`/workspace/multiverse-breach/${savedImage}`],transparent_background:true},references:[{path:savedImage,sha256:sha(referenceBytes),role:'Original W14 art-A native48 appearance reference only; no reference pixels delivered as full45 poses'}]});
}
await fs.writeFile(`${directory}/planned-tool-arguments.json`,JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify({pages:6,gameStates:45,plannedGamePoses:180,reservedStudyPosesNotCounted:108,reference,savedImage}));
