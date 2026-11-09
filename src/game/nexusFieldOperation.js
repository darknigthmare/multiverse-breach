import { normalizeMosaicReconnaissance } from './mosaicReconnaissance.js';

export const NEXUS_FIELD_OPERATION_ID = 'nexus-witness-return-v1';
export const NEXUS_FIELD_DISTRICT_ID = 'universe-nexus-de-convergence';
export const NEXUS_FIELD_UNIVERSE = 'Nexus de Convergence';
export const NEXUS_FIELD_RETURN_POINT = Object.freeze({ wx: -6, wy: 0.5 });
export const NEXUS_FIELD_RETURN_RANGE = 1.25;
const identifier = value => typeof value === 'string' && value.trim() ? value : null;
const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const own = (value, key) => Object.hasOwn(record(value), key) ? value[key] : null;
const localize = (fr, en, lang) => lang === 'fr' ? fr : en;

/** A completed City record is the prerequisite, never a directory or dialogue click. */
export function getNexusFieldBriefing(progress) {
  const dossier = own(normalizeMosaicReconnaissance(progress).dossiers, NEXUS_FIELD_DISTRICT_ID);
  if (!dossier?.completed || dossier.universe !== NEXUS_FIELD_UNIVERSE) return null;
  return {
    id: NEXUS_FIELD_OPERATION_ID,
    districtId: NEXUS_FIELD_DISTRICT_ID,
    universe: NEXUS_FIELD_UNIVERSE,
    witnessId: dossier.residentId,
    evidenceIds: dossier.exhibitGoal === 2 ? [...dossier.evidenceIds] : [dossier.exhibitId]
  };
}

export function getNexusFieldAccess(progress, roster = []) {
  const briefing = getNexusFieldBriefing(progress);
  const hasCombatant = Array.isArray(roster) && roster.some(hero => identifier(hero?.id)
    && hero.nonCombat !== true && hero.category !== 'trial' && hero.cat !== 'trial');
  return { available: Boolean(briefing && hasCombatant), briefing,
    reason: !briefing ? 'report_required' : !hasCombatant ? 'roster_required' : 'available' };
}

function validBriefing(briefing) {
  return briefing?.id === NEXUS_FIELD_OPERATION_ID && briefing.districtId === NEXUS_FIELD_DISTRICT_ID
    && briefing.universe === NEXUS_FIELD_UNIVERSE && identifier(briefing.witnessId)
    && Array.isArray(briefing.evidenceIds) && briefing.evidenceIds.length >= 1 && briefing.evidenceIds.length <= 2
    && briefing.evidenceIds.every(identifier) && new Set(briefing.evidenceIds).size === briefing.evidenceIds.length;
}

export function createNexusFieldOperation(run, { enabled = false, mode, briefing } = {}) {
  if (!enabled || mode !== 'extraction' || run?.phase !== 'running' || !identifier(run.runId)
    || !identifier(run.heroId) || !validBriefing(briefing)) return null;
  return { ...briefing, evidenceIds: [...briefing.evidenceIds], runId: run.runId,
    heroId: run.heroId, status: 'combat', markerId: `${NEXUS_FIELD_OPERATION_ID}::airlock` };
}

const validRun = (operation, run) => validBriefing(operation) && identifier(operation.runId)
  && operation.runId === run?.runId && operation.heroId === run.heroId && run.phase === 'running'
  && Number.isFinite(run.hp) && run.hp > 0;
const relaysSecured = run => run.beaconsStabilized === 3 && run.relayOperation?.runId === run.runId
  && ['beacon-1', 'beacon-2', 'beacon-3'].every(id => own(run.relayOperation.beacons, id)?.status === 'secured');
const championCleared = run => Array.isArray(run.enemies) && run.enemies.length > 0
  && run.enemies.every(enemy => Number.isFinite(enemy.hp) && enemy.hp <= 0)
  && run.enemies.some(enemy => enemy.kind === 'Champion de Trame');

/** Run-local objective. It has no reward and cannot replace an existing beacon. */
export function getNexusFieldReturnMarker(operation, lang = 'fr') {
  if (!operation || !['combat', 'return'].includes(operation.status)) return null;
  return { id: operation.markerId, type: 'field-return', runId: operation.runId,
    ...NEXUS_FIELD_RETURN_POINT, used: false,
    color: operation.status === 'return' ? '#9ff3ce' : '#7d8e9b',
    label: operation.status === 'return'
      ? localize('Sas · transmettre', 'Airlock · transmit', lang)
      : localize('Sas · fermé', 'Airlock · locked', lang) };
}

/** A drawn airlock never hides an ordinary nearby cache or dropped weapon. */
export function getExtinctionLootTarget(run) {
  if (run?.phase !== 'running' || !Array.isArray(run.loot) || ![run.px, run.py].every(Number.isFinite)) return null;
  const nearby = run.loot.filter(item => !item.used
    && Math.hypot(item.wx - run.px, item.wy - run.py) < NEXUS_FIELD_RETURN_RANGE);
  return nearby.find(item => item.type !== 'field-return') || nearby[0] || null;
}

/** Called by the existing wave resolution, only after actual enemy eliminations. */
export function openNexusFieldReturn(operation, run, { paused = false } = {}) {
  if (!validRun(operation, run) || paused || run.paused || operation.status !== 'combat'
    || !relaysSecured(run) || !championCleared(run)) return operation;
  return { ...operation, status: 'return', championCleared: true };
}

export function getNexusFieldObjective(operation, run, lang = 'fr') {
  if (!operation) return null;
  if (operation.status === 'return') {
    const distance = Number.isFinite(run?.px) && Number.isFinite(run?.py)
      ? Math.hypot(run.px - NEXUS_FIELD_RETURN_POINT.wx, run.py - NEXUS_FIELD_RETURN_POINT.wy) : null;
    return { status: 'return', distance,
      title: localize('Retour des témoins', 'Witness return', lang),
      text: localize(`SAS${distance === null ? '' : ` · ${Math.ceil(distance)} m`} · ◆ vert au radar · E / LOOT`,
        `AIRLOCK${distance === null ? '' : ` · ${Math.ceil(distance)} m`} · green ◆ on radar · E / LOOT`, lang),
      detail: localize('Le Champion est neutralisé. Ramène le relevé au sas ; la Marge et les anomalies restent actives.',
        'The Champion is down. Bring the record to the airlock; the Margin and anomalies remain active.', lang) };
  }
  return { status: operation.status, distance: null,
    title: localize('Retour des témoins', 'Witness return', lang),
    text: localize('RELEVÉ NEXUS · trois relais, Champion, puis retour au sas', 'NEXUS RECORD · three relays, Champion, then return to the airlock', lang),
    detail: localize('Les preuves de la Cité guident cette intervention. La victoire exige la transmission sur place après le combat.',
      'The City evidence guides this intervention. Victory requires an on-site transmission after combat.', lang) };
}

/** A player-relative bearing stays inside the existing radar, even beyond its range. */
export function getNexusFieldRadarMarker(operation, run, radius) {
  if (operation?.status !== 'return' || !validRun(operation, run)
    || ![run.px, run.py, run.angle, radius].every(Number.isFinite) || radius <= 7) return null;
  const dx = NEXUS_FIELD_RETURN_POINT.wx - run.px, dy = NEXUS_FIELD_RETURN_POINT.wy - run.py;
  const distance = Math.hypot(dx, dy), scale = (radius - 7) / Math.max(18, distance);
  return { x: (dx * Math.cos(run.angle) - dy * Math.sin(run.angle)) * scale,
    y: -(dx * Math.sin(run.angle) + dy * Math.cos(run.angle)) * scale,
    distance, clamped: distance > 18 };
}

export function drawNexusFieldRadarMarker(ctx, operation, run, radar) {
  const marker = getNexusFieldRadarMarker(operation, run, radar.radius);
  if (!marker) return null;
  const x = radar.x + marker.x, y = radar.y + marker.y;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y - 5); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 5); ctx.lineTo(x - 5, y);
  ctx.closePath();
  ctx.fillStyle = '#9ff3ce'; ctx.fill();
  ctx.strokeStyle = '#081c28'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  return marker;
}

const feedback = {
  disabled: ['', ''],
  wrong_run: ['Ce sas n’appartient pas à l’intervention active.', 'This airlock does not belong to the active operation.'],
  paused: ['Transmission suspendue.', 'Transmission paused.'],
  objectives_pending: ['Synchronise les trois relais et neutralise le Champion avant de revenir au sas.', 'Synchronize all three relays and defeat the Champion before returning to the airlock.'],
  out_of_range: ['Rejoins le sas vert pour transmettre le relevé.', 'Reach the green airlock to transmit the record.'],
  already_returned: ['Ce relevé a déjà été transmis.', 'This record has already been transmitted.'],
  returned: ['Relevé transmis : les témoins de la Cité sont confirmés.', 'Record transmitted: the City testimony is confirmed.']
};

/** Before loot/rewards: a failed, remote, repeated or paused interaction grants nothing. */
export function interactNexusFieldReturn(operation, run, item, { paused = false, lang = 'fr' } = {}) {
  const outcome = (reason, next = operation) => ({ operation: next, handled: reason !== 'disabled',
    completed: reason === 'returned', reason, feedback: localize(...feedback[reason], lang) });
  if (!operation || item?.type !== 'field-return') return outcome('disabled');
  if (!validRun(operation, run) || item.id !== operation.markerId || item.runId !== run.runId
    || !Array.isArray(run.loot) || !run.loot.includes(item)
    || item.wx !== NEXUS_FIELD_RETURN_POINT.wx || item.wy !== NEXUS_FIELD_RETURN_POINT.wy) return outcome('wrong_run');
  if (paused || run.paused) return outcome('paused');
  if (operation.status === 'returned' || item.used) return outcome('already_returned');
  if (operation.status !== 'return' || !operation.championCleared || !relaysSecured(run) || !championCleared(run)) return outcome('objectives_pending');
  if (![run.px, run.py].every(Number.isFinite)
    || Math.hypot(run.px - item.wx, run.py - item.wy) >= NEXUS_FIELD_RETURN_RANGE) return outcome('out_of_range');
  return outcome('returned', { ...operation, status: 'returned' });
}

export function getNexusFieldRunProof(operation) {
  if (!validBriefing(operation) || operation.status !== 'returned' || !operation.championCleared
    || !identifier(operation.runId) || !identifier(operation.heroId)) return null;
  return { id: operation.id, districtId: operation.districtId, universe: operation.universe,
    witnessId: operation.witnessId, evidenceIds: [...operation.evidenceIds],
    runId: operation.runId, heroId: operation.heroId,
    status: 'returned', relays: 3, championCleared: true };
}

export function clearNexusFieldOperation(run) {
  if (!run?.fieldOperation) return;
  run.fieldOperation = null;
  if (Array.isArray(run.loot)) run.loot = run.loot.filter(item => item.type !== 'field-return');
}

function normalizeReceipt(candidate) {
  if (!validBriefing(candidate) || candidate.status !== 'returned' || candidate.relays !== 3
    || candidate.championCleared !== true || !identifier(candidate.runId) || !identifier(candidate.heroId)) return null;
  return { ...getNexusFieldRunProof(candidate), at: identifier(candidate.at) || null };
}

export function getNexusFieldCompletion(career) {
  return normalizeReceipt(own(career?.fieldReturns, NEXUS_FIELD_OPERATION_ID));
}

/** Called only inside the existing unique run receipt. No currency or unlock is added. */
export function recordNexusFieldCompletion(career, report, reconnaissance) {
  const receipt = normalizeReceipt(report?.fieldOperation);
  const briefing = getNexusFieldBriefing(reconnaissance);
  if (!receipt || !briefing || report.reason !== 'completed' || report.result !== 'victory'
    || report.mode !== 'extraction' || receipt.runId !== report.runId
    || receipt.witnessId !== briefing.witnessId
    || receipt.evidenceIds.length !== briefing.evidenceIds.length
    || !receipt.evidenceIds.every(id => briefing.evidenceIds.includes(id)) || getNexusFieldCompletion(career)) return career;
  return { ...career, fieldReturns: { ...record(career?.fieldReturns),
    [NEXUS_FIELD_OPERATION_ID]: { ...receipt, at: identifier(report.at) || null } } };
}
