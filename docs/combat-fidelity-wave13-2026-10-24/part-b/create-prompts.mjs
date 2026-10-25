import fs from 'node:fs';
import path from 'node:path';
const directory = import.meta.dirname;
const plan = JSON.parse(fs.readFileSync(path.join(directory, '../batch-plan-before.json')));
const actions = {
  liquid_snake: 'a measured unarmed close-quarters combination: guard, step in, controlled fist strike, withdraw; no gun, REX, magic or energy',
  the_boss_mgs: 'a solo close-quarters hand-to-hand drill: guarded stance, step, controlled palm/elbow technique, return; no electricity, gun or invisible victim',
  gray_fox: 'one physical straight katana cut with the blade kept complete: ready, step, controlled slash, recover; no energy wave',
  hayden: 'a calm technical evacuation instruction with open mechanical hands: inspect route, indicate safe direction, hold clear signal, lower hand; entirely zero-damage support, no weapon or beam',
};
const gunAction = 'one disciplined physical shot from the specified firearm: brace, align sights, tiny ordinary muzzle flash attached to the real muzzle in the THIRD frame only, recoil and return; no floating projectile or tracer';
const saberAction = 'a controlled close-range cut with the specified lightsaber or lightsabers: ready, step, clear physical blade sweep, recover; consistent blade count and source blade colours, no detached energy wave, ranged beam or lightning';
const prompts = [];
for (const entry of plan.heroes.filter(entry => entry.part === 'B')) {
  const id = entry.hero.id, source = entry.source;
  const action = actions[id] || (source.delivery === 'projectile' ? gunAction : saberAction);
  if (id === 'meryl_mgs') { prompts.push({ id, promptFile: path.join(directory, 'sources', id + '-prompt.txt'), existing: true }); continue; }
  const quiet = source.delivery === 'support' ? 'calm technical hands' : 'equipment held safely without attacking';
  const run = id === 'hayden' ? 'four real measured mechanical walking poses, preserving the heavy robot body; no jet, flight or invented thruster' : id === 'yoda' ? 'four agile short-stride locomotion poses preserving his native small stature' : 'four natural full locomotion-cycle poses with equipment retained safely';
  const prompt = [
    'Create a professional native pixel-art combat animation SOURCE ATLAS of ' + entry.hero.name + ', EXACT selected incarnation: ' + source.sourceWork + '.',
    'APPEARANCE AND EQUIPMENT: ' + source.appearance,
    'Adult character, nonsexual practical game presentation. Recognizable clean detailed 16-bit sprites. All figures face screen-right in a coherent three-quarter side view. Same character design, body proportions and anatomical scale in all cells; crouching is naturally shorter. All full bodies and all equipment completely inside their cells, with generous empty transparent margins.',
    'STRICT LAYOUT: exactly FORTY-EIGHT separate complete figures, EIGHT COLUMNS by SIX ROWS (8 x 6 regular grid). TRANSPARENT background. No labels, numbers, text, grid lines, panels, floor, cast shadow, scenery or other people. Every successive group of four pictures is a genuine FOUR-FRAME sequence with four independently drawn DIFFERENT poses; never duplicate complete figures.',
    'ROW 1, columns 1-4 INTRO: calmly enter readiness with ' + quiet + '; columns 5-8 OUTRO: lower equipment/hands, slight turn, step or shift to leave, settle. No firing in either sequence.',
    'ROW 2, columns 1-4 ROUND VICTORY: a restrained individual acknowledgment with ' + quiet + '; columns 5-8 ROUND DEFEAT: catch breath or settle mechanical balance, stoop slightly, steady, recover. No firing.',
    'ROW 3, columns 1-4 FINISHING PRESENTATION: ' + action + '; columns 5-8 MATCH VICTORY: a distinctive calm personal recognition gesture and settle, visibly different from round victory. No firing in victory.',
    'ROW 4, columns 1-4 MATCH DEFEAT: slowly crouch or lower posture, bow head or settle shoulders, regain balance, settle; no injury; columns 5-8 SUPER: a separate newly drawn sequence of ' + action + ', different drawings from the finishing presentation.',
    'ROW 5, columns 1-4 IDLE: four subtle breathing or mechanism/weight-transfer poses with ' + quiet + '; columns 5-8 RUN: ' + run + '.',
    'ROW 6, columns 1-4 ORDINARY ACTION: ' + action + ', separate new drawings from super; columns 5-8 HIT REACTION: non-graphic recoil, protective posture, recover balance, settle.',
    'Solo non-graphic animation acting only. No victim, opponent, blood, wounds, severing, corpse or death spectacle. Quiet intro/outro/victory/defeat/idle/run/hit rows never attack, fire, emit offensive effects or invent abilities. Preserve source anatomy, costume, weapon, blade colour/count and exact 48-figure 8-by-6 layout. No generalized aura, body glow, unrelated tool or borrowed power.'
  ].join('\n\n') + '\n';
  fs.mkdirSync(path.join(directory, 'sources'), { recursive: true });
  const promptFile = path.join(directory, 'sources', id + '-prompt.txt');
  fs.writeFileSync(promptFile, prompt);
  prompts.push({ id, promptFile });
}
fs.writeFileSync(path.join(directory, 'prompt-index.json'), JSON.stringify(prompts, null, 2) + '\n');
console.log(JSON.stringify({ part: 'B', prompts: prompts.length }));
