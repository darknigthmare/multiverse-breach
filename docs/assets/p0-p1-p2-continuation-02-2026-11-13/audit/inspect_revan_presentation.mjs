/** Bounded native engine/catalog witness, without drawing or reading media. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const [sourceRoot, output] = process.argv.slice(2);
if (!sourceRoot || !output) throw new Error('Usage: inspect_revan_presentation.mjs SOURCE_ROOT OUTPUT');
const load = name => import(pathToFileURL(path.join(sourceRoot, name)).href);
const { getHeroById } = await load('src/game/heroes.js');
const { resolvePresentationScript, samplePresentationScript } = await load('src/game/combat/presentationCatalog.js');
const { getReviewedQuarantinedHeroSprite } = await load('src/game/spriteAssets.js');
const { EngineFighter } = await load('src/game/engineFighter.js');
const actor = getHeroById('darth_revan');
const minimal = sample => sample ? { row: sample.asset.row, column: sample.asset.col, columns: sample.asset.columns,
  rows: sample.asset.rows, kind: sample.asset.kind, sheet: sample.asset.sheet, x: sample.x,
  progress: sample.progress, facing: sample.facing, opacity: sample.opacity } : null;
const samples = ['intro', 'outro', 'victory', 'defeat', 'fatality', 'roundVictory', 'roundDefeat'].map(phase => {
  const script = resolvePresentationScript(actor, phase);
  return { phase, scriptId: script?.id || null, kind: script?.provenance.kind || null,
    sample: script ? minimal(samplePresentationScript(script, script.duration * .55)) : null };
});
const composite = { ...actor, id: 'combat:revan:2', sourceHeroId: 'darth_revan' };
const aliasSamples = ['intro', 'outro', 'victory'].map(phase => {
  const script = resolvePresentationScript(composite, phase);
  return { phase, originalBindingAccepted: !!getReviewedQuarantinedHeroSprite(composite),
    scriptId: script?.id || null, kind: script?.provenance.kind || null,
    sample: script ? minimal(samplePresentationScript(script, script.duration * .55)) : null };
});
const complete = [];
const engine = new EngineFighter(960, 540, [actor], [getHeroById('han_solo')], { add() {} }, () => {},
  result => complete.push(result), { opponentControl: 'p2', roundsToWin: 1 });
let ko;
try {
  engine.countdown = 0;
  engine.getActive('cpu').currentHp = 0;
  engine.endRound('victory');
  for (let tick = 0; tick < 1200 && engine.getSnapshot().phase !== 'outro'; tick++) engine.update(1 / 60);
  if (engine.getSnapshot().phase !== 'outro') throw new Error('Outcome never entered outro.');
  const entry = () => engine.getSnapshot().presentation.entries.find(row => row.side === 'cpu');
  const first = entry();
  for (let tick = 0; tick < 40; tick++) engine.update(1 / 60);
  const later = entry();
  ko = { first: { actorPhase: first.actorPhase, sample: minimal(first.script?.sample) },
    later: { actorPhase: later.actorPhase, sample: minimal(later.script?.sample) },
    hpStillZero: engine.getActive('cpu').currentHp === 0, completedBeforeOutroEnd: complete.length };
} finally {
  engine.dispose();
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ scope: 'Actual native catalog and prepared-outcome Fighter execution. No browser rendering, media inspection or source choreography approval.',
  sourceRoot, probeScriptSha256: createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex'),
  samples, aliasSamples, koOutro: ko, mediaReadOrGenerated: 0, fullActorClosures: 0, visual1to1Verified: false }, null, 2) + '\n');
console.log(JSON.stringify({ samples: samples.length, rejectedCompositeScriptCount: aliasSamples.filter(row => !row.scriptId).length,
  koOutroPhase: ko.first.actorPhase, hpStillZero: ko.hpStillZero }));
