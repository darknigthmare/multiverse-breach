import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const directory = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources';
const identitySource = 'docs/combat-fidelity-wave13-2026-10-24/part-a/sources/ripley-native-original.png';
await fs.mkdir(directory, { recursive: true });
const reference = `${directory}/ripley-identity-reference-original.png`;
const referenceBytes = await fs.readFile(identitySource);
await fs.writeFile(reference, referenceBytes);
const identity = `Draw BRAND-NEW detailed native PIXEL-ART game animation bodies of ADULT ELLEN RIPLEY in ALIENS (1986), before the power-loader fight. Match the supplied new identity drawing ONLY for her human likeness and exact costume: short curly dark-brown hair, blue-gray civilian utility/work jumpsuit with rolled sleeves, dark practical webbing and belt, light worn sneakers. Adult human proportions. The only weapon is the olive/dark-green M41A PULSE RIFLE with its recognizable compact conventional receiver, long shoulder stock, short black barrel and underslung grenade-launcher housing. No power loader, spacesuit, underwear outfit, bald head, later-film clone, armor or helmet. Keep two natural arms, two natural legs, bare visible human hands. On locomotion and ledge rows the M41A is securely on its physical sling along her back/hip and both hands are FREE when gripping or climbing. Never make the rifle float or appear as a wand. On the explicit gunshot rows shoulder it with TWO HANDS, one at trigger grip and one under fore-end. The movements are original adaptations for this crossover platform-fighting game, not claims of official film animation. Guard is a physical protective brace, charge is only physical preparation, aerial moves are ordinary human jumping motions: no magic, aura, shield bubble, telekinesis, flying, beam, opponent, creature, wound, blood or gore. Only a tiny conventional flash AT THE ACTUAL RIFLE BARREL is allowed in the single row that explicitly calls for a shot; recovery frames have no flash. Do NOT copy any pose from the reference sheet.\n\nLAYOUT IS CRITICAL: TRUE TRANSPARENT RGBA, no scene, platform, floor, shadow, text, labels, borders, panel lines or painted checkerboard. Exactly FOUR COLUMNS and EIGHT ROWS, 32 separate COMPLETE full-body drawings on a tall portrait canvas, preferably1024×1536 or taller. Four genuine chronological frames per numbered row, read left to right. Keep ALL8 rows including ROW8 with four complete figures. Each source has one consistent anatomical crown-to-sole scale; upright bodies about140px tall if canvas is1536px. Very wide TRANSPARENT GUTTERS and a transparent border around the whole canvas. No head, curl, hand, sneaker, rifle stock or barrel may touch an edge or another body. Raised arms and slung rifle stay INSIDE their own spacious cell. Crouched, hanging and prone silhouettes stay anatomically shorter, NOT enlarged to fill their cell. Default side/front three-quarter facing SCREEN RIGHT, except genuine turn row and physically explained rear poses. Every drawing is a newly articulated body, not a mirror, rotation, recolor, translate or effect-only copy. Exactly4 DIFFERENT poses in every row. Crisp pixel edges, restrained Aliens blue-gray/olive palette, no blurry painting.\n\n`;
const pages = [
  ['ripley-motion-a', 'Motion', ['idle', 'walk', 'run', 'turn', 'jumpStart', 'jumpRise', 'jumpApex', 'fall'], [
    'idle: four distinct subtle watchful breathing/weight shifts, rifle safely slung, hands low.',
    'walk: four alternating walking strides RIGHT, natural connected arms, complete sneakers.',
    'run: four genuinely different running strides RIGHT, opposing knee/arm articulation and contact phases.',
    'turn: REAL four-body physical turnaround: starts facing LEFT, left-rear three-quarter, right-rear three-quarter, ends facing RIGHT; no duplicate mirrored pose.',
    'jumpStart: stand preparation, bend knees, lift heels, actual takeoff, four articulated configurations.',
    'jumpRise: four distinct rising airborne configurations, hips/knees/arms change naturally.',
    'jumpApex: four distinct apex balancing/tucked body configurations, no floor or flying power.',
    'fall: four real descending configurations, knees and sneakers progressively ready for landing.'
  ]],
  ['ripley-motion-b', 'Motion', ['fastFall', 'land', 'crouchEnter', 'crouchIdle', 'crouchExit', 'crouchCharge', 'taunt1', 'hitStun'], [
    'fastFall: four different descending compact body positions, arms and knees gather, rifle slung.',
    'land: four chronological landing bodies: feet touch unseen floor, deep knee compression, push up, settle upright. No floor drawn.',
    'crouchEnter: four real changes from upright to low crouch; proportional adult legs.',
    'crouchIdle: four different low crouched watchful breathing poses, hands and head subtly change, remain low.',
    'crouchExit: four genuine rising bodies from low crouch through half stand to upright.',
    'crouchCharge: low crouched physical preparation, shift hips/shoulders/forearms over four distinct bodies; no glowing energy.',
    'taunt1: restrained skeptical look, turn head, firm practical nod, settle; no gunfire or supernatural pose.',
    'hitStun: four noninjured startled recoil/recovery bodies, balance lost and regained, no wound.'
  ]],
  ['ripley-defense', 'Motion', ['shieldEnter', 'shieldHold', 'shieldHit', 'perfectShield', 'shieldBreak', 'shieldExit', 'dead', 'defeat'], [
    'shieldEnter: physical defensive brace using forearms, progressive lowering of body; NO energy shield or object.',
    'shieldHold: four distinct physical guarded body configurations, protective forearms, stable feet.',
    'shieldHit: guarded flinch through four connected recoil poses, no impact effect or attacker.',
    'perfectShield: precise quick physical forearm parry and balanced recovery over four poses, no force field.',
    'shieldBreak: lose guard, arms separate, stumble, regain footing; no electrical break effect.',
    'shieldExit: relax physical guard and return to alert upright neutral in four poses.',
    'dead: four distinct full-body non-graphic unconscious resting/settling poses lying on her side, rifle secured; head/curls/hands/sneakers complete. Not enlarged to standing height.',
    'defeat: exhausted stagger, one knee, lower into seated crouch, tired living recovery, four different bodies, no wounds.'
  ]],
  ['ripley-combat-a', 'Combat', ['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeStart', 'chargeLoop', 'chargeRelease', 'chargeRecovery'], [
    'attackLight1: short close physical forearm/rifle-stock shove: ready, extend stock-bearing hands toward RIGHT, contact extension into EMPTY SPACE, genuine recovery. No gunshot.',
    'attackLight2: practical short rifle-butt strike RIGHT: windup, torso twist, extended butt/forearm, recover; keep trigger grip and support hand anatomically connected, no muzzle flash.',
    'attackLight3: short forward human kick: ready, lift knee, extend sneaker RIGHT, genuine relaxed recovery; rifle close on sling, no gunfire.',
    'crouchLight: low crouched close forearm shove: prepare, extend, reach, recover, proportional lower body, no gunfire.',
    'chargeStart: four distinct physical steady-aim preparations with the M41A, shoulders and feet progressively brace. No energy or flash.',
    'chargeLoop: four different breathing/aiming torso and hand shifts with rifle firmly held, no shot, no aura.',
    'chargeRelease: shoulder M41A, aim into empty space RIGHT, ONE tiny conventional muzzle flash at its real barrel in THIRD pose only, relaxed no-flash recovery in fourth.',
    'chargeRecovery: four articulated relaxed recovery bodies, lower rifle, release shoulders, settle safely; no flash or attack extension.'
  ]],
  ['ripley-combat-b', 'Combat', ['attackRecovery', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown', 'intro', 'victory', 'ledgeAttack'], [
    'attackRecovery: four genuine return-to-neutral bodies after a physical strike, hands and shoulder lower, no contact pose or flash.',
    'special: two-handed controlled M41A burst: shoulder, precise aim RIGHT, small conventional flash at actual barrel THIRD pose only, fourth no-flash recoil/relaxed recovery. No beam or target drawn.',
    'aerialNeutral: ordinary short-jump defensive body twist over four different airborne configurations; rifle safely slung, no flying power.',
    'aerialForward: airborne short human sneaker kick RIGHT: preparation tuck, knee lift, sneaker extends, relaxed knee recovery; no gunshot.',
    'aerialDown: four real airborne downward heel/stomp configurations into EMPTY SPACE, articulated hips/knees, then genuine recovery; not a dive superpower.',
    'intro: four cautious arriving bodies, rifle carried low, look ahead, settle alert; no shooting.',
    'victory: composed relieved breathing, lower rifle, small firm nod, relaxed practical stance; four different bodies, no shooting.',
    'ledgeAttack: four physical low braced forearm/rifle-stock pushes toward RIGHT from recovering low stance; body rises, real contact extension then recovery, no platform or opponent drawn.'
  ]],
  ['ripley-ledge', 'Combat', ['ledgeCatch', 'ledgeHang', 'ledgeClimb', 'ledgeDrop', 'ledgeJump', 'uprightCalibration', 'reservedGripStudy', 'reservedSlingStudy'], [
    'ledgeCatch: four chronological reaching-to-grip bodies. Bare RIGHT HAND reaches toward an upper-right implied edge: first pose approaches without contact, second/third/fourth palm and curled fingers visibly GRIP. Real wrist/elbow and complete body below, rifle securely slung BACK, both hands free; no actual ledge drawn.',
    'ledgeHang: four genuine hanging bodies. Bare RIGHT HAND visibly grips the same upper-right implied edge; wrist/forearm connect, knees flex and complete sneakers below. Free left hand can support. No rifle in either hand, no ledge drawn.',
    'ledgeClimb: REAL ASCENDING four-body climb relative to fixed right-palm edge contact: frame1 hang with head below hand, frame2 pull CHEST UP toward palm, frame3 torso ABOVE palm with knee lifted and palm pushing DOWN near waist, frame4 low crouched body now ABOVE edge with hand pressing DOWN below knee before releasing. Hand-to-crown vertical relationship MUST change from hand above head to hand below torso. Not four identical hanging bodies. Rifle slung on back. No ledge drawn.',
    'ledgeDrop: four actual release-and-drop configurations: open hand releases, arms lower, hips descend, sneakers extend; rifle slung, no platform.',
    'ledgeJump: four real release-and-jump configurations from imagined ledge: flex, release hands, hips rise, knee tuck; rifle slung, no platform.',
    'uprightCalibration: RESERVED CALIBRATION ONLY, four distinct fully upright neutral Ripley bodies with hands low and rifle slung, same anatomical scale as hanging/climbing rows. These are NOT game states.',
    'reservedGripStudy: RESERVED STUDY ONLY, four distinct upright hand/wrist checking body poses with bare palms visible, no prop, same body size. Not game states.',
    'reservedSlingStudy: RESERVED STUDY ONLY, four distinct upright safe sling-adjusting bodies, rifle physically attached, same body size. Not game states.'
  ]]
];
const plan = [];
for (const [id, batch, states, descriptions] of pages) {
  const prompt = identity + descriptions.map((text, index) => `ROW${index + 1} ${text}`).join('\n')
    + '\n\nFINAL COUNT:32 complete native full bodies,4 columns ×8 rows,4 distinct chronological poses per row. Transparent safe gutters everywhere, including top/bottom canvas borders. Keep the same adult Ripley1986 costume, sneakers, curls and M41A in every body.\n';
  const promptFile = `${directory}/${id}.prompt.txt`;
  await fs.writeFile(promptFile, prompt);
  plan.push({ id, heroId: 'ripley', batch, expectedRows: 8, states, arguments: { prompt, referenced_image_paths: [`/workspace/multiverse-breach/${reference}`], transparent_background: true }, promptFile,
    promptFileSha256: createHash('sha256').update(prompt).digest('hex'), references: [{ path: reference, sha256: createHash('sha256').update(referenceBytes).digest('hex'), role: 'new W13 appearance reference only; source atlas layout is under separate review and its pixels are not delivered as any45-state pose' }] });
}
await fs.writeFile(`${directory}/planned-tool-arguments.json`, JSON.stringify(plan, null, 2) + '\n');
console.log(JSON.stringify({ pages: plan.length, newStatePosesPlanned: 180, reservedStudyPosesNotCounted: 12 }));
