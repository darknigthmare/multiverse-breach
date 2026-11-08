/** Small, local City interventions. Their receipts are produced by the same
 * range-checked interaction as the quest step, never by opening the journal. */
export const MOSAIC_MISSION_OPERATION_KINDS = Object.freeze(['repair', 'scan', 'recover', 'secure', 'beacon', 'route']);
const bilingual = value => typeof value?.fr === 'string' && value.fr.trim() && typeof value?.en === 'string' && value.en.trim();
const localize = (value, lang) => value?.[lang === 'fr' ? 'fr' : 'en'] || '';

export function getMosaicMissionOperation(step) {
  const operation = step?.operation;
  return ['marker', 'exhibit', 'anchor'].includes(step?.type)
    && MOSAIC_MISSION_OPERATION_KINDS.includes(operation?.kind)
    && bilingual(operation.label) && bilingual(operation.propName) && bilingual(operation.completedText)
    ? operation : null;
}

export function createMosaicMissionOperationReceipt(mission, step, interaction, sequence, saved = {}) {
  const operation = getMosaicMissionOperation(step);
  if (!operation || !interaction?.id) return null;
  const target = interaction.target;
  const x = target?.x + target?.w / 2, y = target?.y + target?.h / 2;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { version: 1, missionId: mission.id, stepId: step.id, universe: mission.universe,
    districtId: mission.districtId, targetId: interaction.id, kind: operation.kind, sequence, x, y,
    originChoiceId: mission.requiresMissionId ? saved.originChoiceId : null,
    originStoryRevision: mission.requiresMissionId ? saved.originStoryRevision || 1 : null,
    branchChoiceId: step.byChoice ? saved.choiceId : null };
}

export function matchesMosaicMissionOperationReceipt(receipt, mission, step, targetId, saved = {}) {
  const operation = getMosaicMissionOperation(step);
  return Boolean(operation && receipt?.version === 1 && receipt.missionId === mission.id
    && receipt.stepId === step.id && receipt.universe === mission.universe
    && receipt.districtId === mission.districtId && receipt.targetId === targetId
    && receipt.kind === operation.kind && Number.isSafeInteger(receipt.sequence) && receipt.sequence > 0
    && Number.isFinite(receipt.x) && Number.isFinite(receipt.y)
    && receipt.originChoiceId === (mission.requiresMissionId ? saved.originChoiceId : null)
    && receipt.originStoryRevision === (mission.requiresMissionId ? saved.originStoryRevision || 1 : null)
    && receipt.branchChoiceId === (step.byChoice ? saved.choiceId : null)
    // A catalogue search can move a display to another slot. Its stable item
    // identity still owns the intervention; authored field markers cannot move.
    && (step.type !== 'marker' || (receipt.x === step.x && receipt.y === step.y)));
}

const STATE_LABELS = Object.freeze({
  repair: { fr: 'Réparé', en: 'Repaired' },
  scan: { fr: 'Examiné', en: 'Examined' },
  recover: { fr: 'Récupéré', en: 'Recovered' },
  secure: { fr: 'Sécurisé', en: 'Secured' },
  beacon: { fr: 'En service', en: 'Online' },
  route: { fr: 'Balisé', en: 'Marked' }
});

export function getMosaicMissionObjectView(operation, { lang = 'fr', completed = false } = {}) {
  return { kind: operation.kind, label: localize(operation.label, lang), propName: localize(operation.propName, lang),
    statusLabel: completed ? localize(STATE_LABELS[operation.kind], lang) : localize(operation.label, lang),
    completedText: localize(operation.completedText, lang), completed };
}

function linesWithin(ctx, text, width) {
  const words = String(text).split(/\s+/), lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Existing Canvas art direction: six distinguishable pieces of field equipment.
 * The working/finished states come from saved operation receipts. No animation
 * or draw call can complete a quest or change a collision footprint. */
export function drawMosaicMissionObject(ctx, object, tick, nearby = false, reducedMotion = false) {
  const done = object.completed;
  const light = done ? '#86efac' : nearby ? '#ffe194' : '#d7ad63';
  const pulse = reducedMotion ? 0.5 : (Math.sin(tick * 0.055) + 1) * 0.5;
  ctx.save();
  ctx.translate(object.x, object.y);
  if (object.sourceType === 'marker') {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(-23, 13, 46, 9);
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = light;
  ctx.fillStyle = '#182c35';

  if (object.sourceType && object.sourceType !== 'marker') {
    // Keep the actual relic/display or anchor art. The added work light belongs
    // to its local controls; it does not replace or award the displayed item.
    ctx.fillStyle = '#0a1721'; ctx.fillRect(-24, 15, 48, 9);
    ctx.fillStyle = light;
    for (let i = 0; i < (done ? 4 : 1); i++) ctx.fillRect(-19 + i * 11, 18, 7, 3);
  } else if (object.kind === 'repair') {
    ctx.fillRect(-20, -25, 40, 40); ctx.strokeRect(-20, -25, 40, 40);
    ctx.fillStyle = light;
    ctx.fillRect(-14, -19, 10, 6); ctx.fillRect(6, -19, 8, 6);
    ctx.beginPath(); ctx.moveTo(-12, -3); ctx.lineTo(-4, -3);
    if (done) { ctx.lineTo(4, 6); ctx.lineTo(13, 6); }
    else { ctx.moveTo(4, 7); ctx.lineTo(13, 7); }
    ctx.stroke();
    if (!done && pulse > 0.65) { ctx.fillRect(-2, -6, 3, 4); ctx.fillRect(3, 0, 3, 3); }
  } else if (object.kind === 'scan') {
    ctx.fillRect(-16, -18, 32, 34); ctx.strokeRect(-16, -18, 32, 34);
    ctx.beginPath(); ctx.arc(0, -9, 11, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(done ? 9 : -8 + pulse * 16, -21); ctx.stroke();
    ctx.fillStyle = light; ctx.fillRect(done ? 7 : -9, -3, 4, 4);
    ctx.fillRect(-10, 7, done ? 20 : 7, 3);
  } else if (object.kind === 'recover') {
    ctx.fillRect(-21, -6, 42, 23); ctx.strokeRect(-21, -6, 42, 23);
    ctx.fillStyle = done ? '#263d45' : light;
    ctx.fillRect(-18, done ? -22 : -11, 36, 6);
    if (!done) { ctx.fillRect(-5, -7, 10, 16); ctx.fillStyle = '#22303a'; ctx.fillRect(-2, -3, 4, 5); }
    else { ctx.strokeStyle = '#455f68'; ctx.strokeRect(-14, 1, 28, 10); }
  } else if (object.kind === 'secure') {
    ctx.fillRect(-22, -28, 44, 45); ctx.strokeRect(-22, -28, 44, 45);
    ctx.fillStyle = '#0b151d'; ctx.fillRect(-15, -22, 30, 32);
    ctx.strokeStyle = light;
    ctx.strokeRect(-10, -12, 20, 18);
    ctx.beginPath(); ctx.arc(0, -12, 7, Math.PI, done ? Math.PI * 2 : Math.PI * 1.7); ctx.stroke();
    ctx.fillStyle = light; ctx.fillRect(-2, -5, 4, 6);
    if (done) ctx.fillRect(-20, 13, 40, 4);
  } else if (object.kind === 'beacon') {
    ctx.fillRect(-18, 9, 36, 9); ctx.strokeRect(-18, 9, 36, 9);
    ctx.fillRect(-5, -30, 10, 40); ctx.strokeRect(-5, -30, 10, 40);
    ctx.fillStyle = done ? '#86efac' : '#704f34'; ctx.fillRect(-10, -34, 20, 10);
    if (done) {
      ctx.globalAlpha = 0.4 + pulse * 0.35;
      ctx.beginPath(); ctx.arc(0, -29, 18 + pulse * 3, Math.PI * 1.13, Math.PI * 1.87); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  } else if (object.kind === 'route') {
    ctx.fillRect(-4, -27, 8, 44); ctx.strokeRect(-4, -27, 8, 44);
    ctx.beginPath(); ctx.moveTo(-20, -25); ctx.lineTo(12, -25); ctx.lineTo(23, -16);
    ctx.lineTo(12, -7); ctx.lineTo(-20, -7); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = light; ctx.fillRect(-14, -18, done ? 26 : 10, 4);
    if (done) { ctx.fillRect(27, 5, 7, 3); ctx.fillRect(40, 5, 7, 3); }
  }

  if (nearby || object.highlight) {
    ctx.font = '12px "Share Tech Mono"';
    ctx.textAlign = 'center';
    const titleLines = linesWithin(ctx, object.propName, 174);
    const detailLines = nearby ? linesWithin(ctx, object.statusLabel, 174) : [];
    const all = [...titleLines, ...detailLines];
    const y = -44 - all.length * 15;
    ctx.fillStyle = 'rgba(5,12,18,0.94)'; ctx.fillRect(-94, y - 12, 188, all.length * 15 + 12);
    all.forEach((line, i) => { ctx.fillStyle = i < titleLines.length ? '#f4f8e9' : light; ctx.fillText(line, 0, y + i * 15); });
  }
  ctx.restore();
}
