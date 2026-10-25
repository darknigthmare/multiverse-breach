import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const directory = 'docs/combat-fidelity-wave13-2026-10-24/ripley-sources';
const initial = JSON.parse(await fs.readFile(`${directory}/planned-tool-arguments.json`, 'utf8'));
const identity = initial[0].arguments.prompt.split('LAYOUT IS CRITICAL:')[0];
const layout = `LAYOUT: draw EXACTLY FOUR COLUMNS × FOUR ROWS = SIXTEEN COMPLETE separate native pixel-art bodies on a tall portrait canvas. Only4rows, NOT8rows. Use truly transparent RGBA, no scene, ground, platform, shadow, text or frame. Keep the character about200px crown-to-sole if canvas1024×1536; every cell has huge transparent gutters on all sides. Every curl, bare fingertip, sneaker and slung M41A must remain COMPLETE inside the cell, no canvas edge touching. One anatomical body scale throughout all16; crouches and hangs must stay proportionally smaller than upright. No missing row, duplicate body or truncated leg. For climbed/crouched poses draw BOTH lower legs and BOTH sneakers: no invisible platform may crop any anatomy. Four different chronological poses across every row, facing RIGHT.\n\n`;
const pages = [
  ['ripley-corrective-movement', ['jumpStart', 'crouchCharge', 'perfectShield', 'uprightCalibration'], [
    'jumpStart: four physically chronological START-OF-JUMP bodies: frame1 fully standing preparation, frame2 feet planted with knees deeply bent, frame3 heels lift and knees extend, frame4 actual takeoff with both sneakers visible. Do not make all4 airborne.',
    'crouchCharge: four distinct LOW crouched physical preparation/breathing bodies, hands and shoulders gather; rifle SLUNG on back, no magic charge, remain genuinely crouched in all4.',
    'perfectShield: precise human physical forearm parry, stance dip, one forearm blocks RIGHT, balanced recovery; four different bodies, no bubble shield or glowing VFX.',
    'uprightCalibration: four distinct completely UPRIGHT relaxed anatomical calibration bodies, hands lowered and rifle slung back; same body scale as all other rows. These four are reserved, not game states.'
  ]],
  ['ripley-corrective-combat', ['chargeRecovery', 'crouchLight', 'aerialDown', 'ledgeAttack'], [
    'chargeRecovery: four full-body relaxed physical return-to-neutral poses after a shot. Lower rifle, shoulders relax, feet settle, final frame fully upright alert with M41A carried low. No muzzle flash or attack extension.',
    'crouchLight: four chronological LOW crouched physical forearm shove RIGHT: low ready, forearm extends, open palm/forearm reaches empty space, relaxed low recovery. Rifle SLUNG back, no shooting.',
    'aerialDown: four real airborne downward heel/kick body configurations: knees tuck, one heel extends DOWN, moment of downward leg extension into empty space, knee recovers; complete other leg and both sneakers remain visible. Ordinary human jump adaptation, no flight or beam.',
    'ledgeAttack: four physical low-to-upright braced forearm shoves RIGHT: rise from crouch, brace left leg, extend leading forearm and open palm into empty space, relax back; rifle SLUNG back, no aiming or firing. No ledge or opponent drawn.'
  ]],
  ['ripley-corrective-ledge', ['ledgeClimb', 'ledgeJump', 'uprightCalibration', 'reservedGripStudy'], [
    'ledgeClimb: four genuinely ASCENDING complete bodies about a fixed bare right-hand contact. Frame1 hangs with RIGHT PALM above head, whole body and both sneakers below. Frame2 pulls CHEST UP near palm, both bent legs visible. Frame3 raises TORSO ABOVE right hand, palm presses DOWN near waist while one knee lifts over imaginary edge; both lower legs and sneakers must still be drawn, no invisible occluder. Frame4 crouches with complete body above low pressing right hand near shin level, palm pushes DOWN at edge; both sneakers complete. The hand moves from ABOVE HEAD to BELOW TORSO relative to the body; NOT four same-height hangs. NO actual ledge, floor or platform and NO cropped lower body. M41A secured on sling BACK, hands bare and free.',
    'ledgeJump: four distinct RELEASE-AND-JUMP bodies: bent hanging preparation, hand releases, body rises, knees tuck in airborne recovery. Bare hands open, rifle securely SLUNG back. Complete knees/calves/sneakers, no ledge drawn.',
    'uprightCalibration: four distinct fully UPRIGHT neutral Ripley bodies, hands lowered, rifle slung back. Same crown-to-sole scale as every other body here, reserved calibration only.',
    'reservedGripStudy: four distinct fully UPRIGHT neutral bodies with bare palm and wrist naturally visible and hands below shoulder, same anatomy scale, rifle SLUNG back. Reserved study only, NOT cropped torso portraits.'
  ]]
];
const plan = [];
for (const [id, states, rows] of pages) {
  const prompt = identity + layout + rows.map((row, i) => `ROW${i + 1} ${row}`).join('\n')
    + '\n\nFINAL CHECK: EXACTLY16 full-body figures,4 columns ×4 rows, no incomplete row or cropped body. Completely transparent empty gutters on EVERY side. All4poses in a row genuinely articulated and different.\n';
  const promptFile = `${directory}/${id}.prompt.txt`;
  await fs.writeFile(promptFile, prompt);
  plan.push({ id, heroId: 'ripley', expectedRows: 4, states, corrective: true,
    arguments: { prompt, referenced_image_paths: initial[0].arguments.referenced_image_paths, transparent_background: true },
    promptFile, promptFileSha256: createHash('sha256').update(prompt).digest('hex'), references: initial[0].references });
}
await fs.writeFile(`${directory}/planned-corrective-tool-arguments.json`, JSON.stringify(plan, null, 2) + '\n');
console.log(JSON.stringify({ calls: plan.length, candidateDrawings: 48, neededStateDrawings: 36 }));
