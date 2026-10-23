import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DOCS = 'docs/combat-fidelity-wave8-2026-10-20';
const read = file => fs.readFile(path.join(ROOT, file));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const plan = JSON.parse(await read(`${DOCS}/batch-plan-before.json`));
const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
const characters = [
  {
    heroId: 'laios_meshi', version: 'Laios Touden, Dungeon Meshi anime2024, ordinary human adventurer: short pale blond hair, amber eyes, silver steel breastplate/shoulder/forearm armor over pale tan long sleeves, brown belt and leather boots. One real Kensuke longsword, steel blade/gold crossguard; compact practical equipment, no energy cannon.',
    useOldReference: true,
    rows: [
      'INTRO: arriving adventurer. 1 standing with sheathed sword and hand raised to shade eyes, 2 leaning forward to examine a tiny harmless dungeon specimen held in open palm, 3 straightening and gripping sword hilt, 4 drawing Kensuke into a low ready guard.',
      'OUTRO: thoughtful departure. 1 lowering Kensuke, 2 wiping/checking blade carefully, 3 sheathing sword with both hands, 4 turning shoulders away while giving a final curious glance.',
      'ROUND VICTORY: earned confidence. 1 breathing out with sword lowered, 2 straightening chest and resting sword against shoulder, 3 small pleased fist held near chest with sword safely down, 4 returning to an alert low sword guard.',
      'ROUND DEFEAT: regrouping alive. 1 recoiling with knees bent and arms guarding, 2 dropping to one knee with Kensuke tip down, 3 supporting torso with sword hand low, 4 rising into a careful crouched guard.',
      'FINALE ADAPTATION: decisive non-gory Kensuke sword finish; no victim drawn. 1 planting rear foot with blade drawn back, 2 deep step forward beginning diagonal cut, 3 complete low-to-high follow-through with real sword held in hands, 4 grounded recovery blade lowered. Entire sword must stay inside its cell.',
      'MATCH VICTORY: monster enthusiast at ease. 1 exhaling relieved, 2 kneeling beside a tiny harmless specimen in his palm, 3 upright showing it with delighted expression, 4 offering the viewer a sincere modest raised-hand farewell with sword sheathed.',
      'MATCH DEFEAT: exhausted but living. 1 shoulders drooping while sword lowered, 2 kneeling with hand to chest, 3 sitting on heel head bowed, 4 lifting head and starting to get up. No death, blood or dismemberment.',
      'SUPER Coupe de Kensuke: one physical committed sword sequence. 1 two-handed guard with sword back, 2 forward driving step and horizontal steel blade cut, 3 deeper follow-through shoulders rotated and front knee bent, 4 withdrawing blade to safe ready guard. No monster beam or magic transformation.'
    ]
  },
  {
    heroId: 'marcille_meshi', version: 'Marcille Donato, Dungeon Meshi anime2024: adult blond elf mage, long pointed ears, green eyes, long blond hair with twin front braids and small red hair ties, dark blue ankle-length robe with pale beige trim, blue shoulder capelet, red neck ribbon, brown belt pouch, brown sandals over pale leg wraps. Her real Ambrosia wooden staff has a looped natural branch head with small green leaves; no gun, no human Falin likeness.',
    useOldReference: true,
    rows: [
      'INTRO: mage preparing. 1 holding wooden loop staff upright, 2 brushing hair back with free hand while shifting weight, 3 opening free palm near chest in quiet incantation, 4 bracing feet with staff in forward ready position.',
      'OUTRO: dismissing spell. 1 lowering staff after action, 2 checking its leafy loop with free hand, 3 hugging staff upright close to shoulder, 4 turning away with a small restrained wave.',
      'ROUND VICTORY: relief. 1 staff lowered with chest heaving, 2 free hand wiping brow, 3 small proud raised fist with staff grounded, 4 recovering calm upright mage stance.',
      'ROUND DEFEAT: stagger and regroup. 1 flinching with free arm up, 2 dropping into bent-knee crouch leaning on staff, 3 kneeling head lowered and staff vertical, 4 rising halfway with determined face.',
      'FINALE ADAPTATION of Explosion magique: no execution or victim. 1 staff held forward with free hand forming a precise casting gesture, 2 torso leaning into incantation and hands closer to loop, 3 planted feet and staff fully extended with a compact gold-orange magical bloom at loop, 4 recoil into bent elbows and settling sparks. Bloom is local, entire anatomy and staff visible.',
      'MATCH VICTORY: composed mage. 1 releasing a long relieved breath, 2 putting free hand on hip and tilting staff, 3 looking upward with a tiny satisfied smile, 4 modest wave with staff vertical.',
      'MATCH DEFEAT: living exhaustion. 1 shoulders falling and staff slack, 2 sinking onto both knees, 3 sitting back and clasping staff to chest, 4 looking up tired but alert. No corpse.',
      'SUPER Explosion magique de Marcille: 1 both hands braced on staff with knees flexed, 2 sweeping staff forward while opening stance, 3 full extension and compact orange-gold explosive magical flare around staff loop, 4 arms recoil and robe settles. Four different anatomical poses; not only four glow variations.'
    ]
  },
  {
    heroId: 'senshi_meshi', version: 'Senshi, Dungeon Meshi anime2024 dwarf cook: very stocky muscular adult dwarf, huge dense black beard and moustache, round nose, steel helmet with two short brown horns and cheek guards, bare muscular upper arms, dark sleeveless tunic/leather apron, brown fur-trimmed lower clothes, leather wrist guards, sturdy brown/steel boots. Practical single-headed steel axe carried for ordinary attacks; iron pot and ladle only when actually cooking. No gun, magic wand or elemental attack.',
    useOldReference: true,
    rows: [
      'INTRO: cook adventurer. 1 standing axe held down safely, 2 setting compact cooking pot beside boot while kneeling, 3 inspecting a vegetable in free hand, 4 upright ready stance axe low. No stage or floor painted.',
      'OUTRO: packing up. 1 putting ladle back in pot, 2 lifting pot with both hands, 3 slinging pot securely behind torso, 4 turning to leave with free hand raised.',
      'ROUND VICTORY: practical satisfaction. 1 resting lowered axe beside body, 2 one hand on hip and deep breath, 3 approving nod and thumb up, 4 returning to balanced ready stance.',
      'ROUND DEFEAT: living regroup. 1 bracing forearms in recoil, 2 crouching low on bent legs, 3 one knee down hand steadying helmet, 4 straightening with axe held low. No blood.',
      'FINALE SUPPORT ADAPTATION: restorative cooking, NEVER an execution. 1 kneeling stirring small iron pot with ladle, 2 leaning to inspect a steaming spoonful, 3 standing and extending a bowl of cooked stew to an offscreen ally, 4 contentedly lowering ladle with empty hand inviting ally to eat. Warm steam only, no magic beam, no offensive axe swing.',
      'MATCH VICTORY: proud nourishing cook. 1 lifting a bowl from pot, 2 inspecting its aroma close to nose, 3 holding out serving with warm proud expression, 4 satisfied arms folded with pot beside feet.',
      'MATCH DEFEAT: tired but living. 1 shoulders dropping with pot held low, 2 sitting heavily on bent knees, 3 resting one elbow on knee and cheek in fist, 4 looking up prepared to recover. No corpse.',
      'SUPER Repas équilibré du donjon = HEAL SUPPORT: 1 bending knees and stirring an actual iron pot, 2 leaning forward to scoop stew with ladle, 3 upright extending a full bowl outward to a teammate, 4 lowering bowl and offering a second open-palm serving gesture. Every cell has one whole Senshi body; food/steam do not replace anatomy. No axe attack in this row.'
    ]
  },
  {
    heroId: 'chilchuck_meshi', version: 'Chilchuck Tims, Dungeon Meshi anime2024, a 29-year-old ADULT male half-foot locksmith, short adult with a slim wiry body and mature narrow face, short reddish auburn hair, brown eyes, rounded protruding half-foot ears, brown quilted sleeveless tunic/vest over cream long-sleeve shirt, brown belt with many small tool pouches, dark brown trousers and brown lace boots. Tiny lock picks and probe tools only, compact brass lock mechanism as work prop. No pistol, rifle, crossbow, dagger attack, child styling or assassin fantasy.',
    useOldReference: false, rejectedReference: 'Old local atlas contains a fabricated firearm and offensive shooting poses; inspected but deliberately excluded from generation inputs.',
    rows: [
      'INTRO: careful professional. 1 upright checking belt pouch, 2 drawing a tiny lock pick while looking down, 3 leaning forward to listen intently with raised palm, 4 alert ready stance palms open and tool held safely close.',
      'OUTRO: secure passage. 1 closing tiny lock mechanism held in hands, 2 returning pick to pouch, 3 brushing hands off and straightening, 4 turning shoulders away while gesturing others to follow.',
      'ROUND VICTORY: understated approval. 1 dropping tense shoulders, 2 looking sideways with one raised eyebrow, 3 crossing arms with small satisfied smirk, 4 uncrossing into alert stance.',
      'ROUND DEFEAT: regroup alive. 1 startled backward lean with empty palms up, 2 ducking into low crouch, 3 one knee down checking tool pouch, 4 rising carefully behind raised forearm. No weapon attack.',
      'FINALE GUARD SUPPORT ADAPTATION: securing a trap, never assassination. 1 kneeling and inspecting a compact brass trap mechanism near knee, 2 leaning close using two tiny picks to disengage spring, 3 turning mechanism outward to show released harmless latch, 4 standing and giving clear stop/then-safe open-palm signal to offscreen allies. No blood, blade or trap firing.',
      'MATCH VICTORY: passage safe. 1 wiping brow with sleeve, 2 holding repaired tiny lock up proudly, 3 putting it away with a restrained smile, 4 hands on hips professional relaxed stance.',
      'MATCH DEFEAT: living exhaustion. 1 sighing with shoulders slumped, 2 sitting on one heel with hand at brow, 3 inspecting a bent tiny lock pick with annoyed expression, 4 looking up and putting it back in pouch. No dead body.',
      'SUPER Désamorçage des pièges de Chilchuck = GUARD SUPPORT: 1 kneeling with two tiny locksmith picks and compact exposed brass spring latch, 2 torso leaning forward and both hands adjusting separate pins, 3 shifting one knee and pulling harmless released pin out, 4 upright open palm indicating safe passage while latch remains inactive. Physical specialist gestures; no magic force field, no firearm or stabbing.'
    ]
  },
  {
    heroId: 'falin_meshi', version: 'Falin Touden in her ordinary HUMAN form from Dungeon Meshi anime2024: young adult human woman with short chin-length tousled pale ash-blond bob, soft round face, small HUMAN rounded ears, gentle usually closed/slightly opened eyes, white high-collared long-sleeved ankle-length tunic/robe, simple medium green shoulder cloak/cape secured at neck, brown leather belt and brown boots. No long blond elf braids, pointed elf ears, red ribbon, blue Marcille robe, feathers, dragon body, chimera, tail, wings or transformation. Healer with empty caring hands, no beam cannon or offensive spell weapon.',
    useOldReference: false, rejectedReference: 'Old Falin atlas is a long-haired pointed-ear Marcille clone with offensive staff beam; inspected but excluded from generation inputs.',
    rows: [
      'INTRO: gentle human healer. 1 hands folded loosely near waist and eyes softly closed, 2 opening eyes slightly and tilting head attentively, 3 opening one palm toward companion, 4 poised standing with both palms held near chest.',
      'OUTRO: tending group. 1 letting healing hands settle, 2 looking at a companion offscreen with slight concerned tilt, 3 closing hands together gratefully near collar, 4 turning away with a small gentle wave.',
      'ROUND VICTORY: grateful relief. 1 exhaling with hands at waist, 2 one palm on chest and smile, 3 bowing head with folded hands, 4 straightening into calm supportive stance.',
      'ROUND DEFEAT: alive and recovering. 1 flinching and shielding face with forearm, 2 lowering onto one knee with free palm braced near knee, 3 breathing with hand over chest, 4 rising halfway with reassuring open palm. No transformation.',
      'FINALE HEAL SUPPORT ADAPTATION: caring recovery, never execution. 1 kneeling with both empty palms cupped low as if assessing a companion offscreen, 2 leaning forward with one palm extended and other near chest, 3 widening both arms in a soft pale-green healing shimmer, 4 relaxing palms downward with relieved smile. Small local light only; no beam, enemy or suffering victim.',
      'MATCH VICTORY: peaceful healer. 1 putting hand to heart, 2 gentle forward bow with eyes closed, 3 lifting chin and opening arms in welcome, 4 warm quiet wave. All four poses anatomically different.',
      'MATCH DEFEAT: living fatigue. 1 shoulders sagging with eyes half closed, 2 kneeling with hands on thighs, 3 sitting back on heels and head bowed, 4 lifting eyes with determined gentle smile. No death, blood or monster form.',
      'SUPER Magie de soin de Falin = HEAL SUPPORT: 1 both hands gathered near chest while knees soften, 2 shifting weight forward and extending right open palm, 3 opening both arms with soft white/pale-green recovery glow around hands and cloak, 4 drawing hands down to relaxed waist with relieved expression. Four real body gestures; no staff beam, chimera or offensive attack.'
    ]
  }
];
for (const dir of ['part-d-sources', 'part-d-references', 'part-d-prompts', 'part-d-contacts', 'base-part-d-sources', 'base-part-d-references', 'base-part-d-prompts', 'base-part-d-contacts']) await fs.mkdir(path.join(ROOT, DOCS, dir), { recursive: true });
const records = [];
for (const character of characters) {
  const original = `public/sprites/generated/heroes/dungeon-meshi/${character.heroId.replaceAll('_', '-')}.png`;
  const referenceArchive = `${DOCS}/part-d-references/${character.heroId}-old-base.png`;
  const bytes = await read(original); await fs.writeFile(path.join(ROOT, referenceArchive), bytes);
  const resolved = plan.heroes.find(record => record.hero.id === character.heroId);
  const prompt = `Draw a production game SPRITE ATLAS with EXACTLY 32 separate complete native drawings of ONE named character. Transparent RGBA background, four equal columns by EIGHT equal rows, a tall portrait sheet about1024x2048. Crisp detailed Japanese anime pixel-art sprites. No title, labels, numbers, borders, grid lines, scenery, floor or shadow disks. Every cell contains exactly ONE ENTIRE character plus their held props, with large transparent gaps around all sides: 12% safe margin inside every cell. All 32 figures must be visible, all eight rows must contain four genuine anatomically DIFFERENT drawings. Keep consistent bodily scale across whole sheet; poses crouching/kneeling are naturally shorter and NOT enlarged. Side/three-quarter view facing RIGHT. Never cut hands, feet, sword/staff, helmet horns, hair or clothes at seams.\n\nIDENTITY/VERSION: ${character.version}\n${character.useOldReference ? 'Attached image is the older local appearance reference only: redraw all poses, correct missing canonical equipment and follow the identity text above.' : 'No appearance image is attached: the old local reference was rejected for explicit identity/equipment defects. Draw the described anime2024 identity faithfully rather than reproducing the rejected sprite.'}\n\nTOP-TO-BOTTOM ROW STORYBOARD, left-to-right four anatomical poses each:\n${character.rows.map((row, i) => `ROW ${i + 1} ${row}`).join('\n')}\n\nFinal check before output: EIGHT full rows, FOUR distinct full-body drawings in EACH row, total32; no blank or repeated cell. One consistent character/costume. Support actions have NO offensive strikes. A changed light or face alone does not count as a different pose. Keep every effect compact and inside its own cell.`;
  const promptFile = `${DOCS}/part-d-prompts/${character.heroId}-original.txt`;
  await fs.writeFile(path.join(ROOT, promptFile), prompt);
  records.push({ ...character, universe: resolved.hero.universe, name: resolved.hero.name, sourceWork: 'Dungeon Meshi / Delicious in Dungeon, TV anime2024',
    sourceReference: Object.fromEntries(Object.entries(resolved.profiles).map(([slot, profile]) => [slot, profile.provenance.sourceReference])),
    profiles: Object.fromEntries(Object.entries(resolved.profiles).map(([slot, profile]) => [slot, {name: profile.name, effect: profile.effect, delivery: profile.delivery, targetSide: profile.targetSide, range: profile.range}])),
    referenceAsset: original.slice(6), referenceArchive, referenceAssetSha256: sha(bytes), referenceImage: character.useOldReference ? path.join(ROOT, referenceArchive) : null,
    prompt, promptFile, phases, sourceRows: 8, sourceRowByTarget: [0, 1, 2, 3, 4, 5, 6, 7], reviewed: false, provider: 'OpenAI', model: null, generationId: null, jobId: null,
    canonicalVerified: false, source1to1Verified: false, networkVerified: false });
}
await fs.writeFile(path.join(ROOT, DOCS, 'part-d-generation-records.json'), `${JSON.stringify({schemaVersion: 1, date: '2026-10-20', part: 'D', records}, null, 2)}\n`);
await fs.writeFile(path.join(ROOT, DOCS, 'part-d-source-access.json'), `${JSON.stringify({date:'2026-10-20', localSpritesInspectedBeforeGeneration:true, resolvedProfileSource:`${DOCS}/batch-plan-before.json`, source1to1Verified:false, networkVerified:false, requests:[{url:'https://delicious-in-dungeon.com/character.html',result:'URLError: Tunnel connection failed: 403 Forbidden', contentRead:false}], rejectedReferences:records.filter(record=>record.rejectedReference).map(record=>({heroId:record.heroId,path:record.referenceArchive,sha256:record.referenceAssetSha256,reason:record.rejectedReference}))}, null, 2)}\n`);
console.log(JSON.stringify({part:'D', plannedNativeCalls:records.length, records:records.map(record=>({heroId:record.heroId,referenceImage:record.referenceImage,profiles:record.profiles}))}));
