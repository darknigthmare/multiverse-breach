import { MELEE_STATES, MELEE_TRANSITION_DATA } from './meleeStateMachine.js';

const loops = new Set(['idle', 'walk', 'run', 'crouchIdle', 'crouchCharge', 'jumpRise', 'jumpApex', 'fall', 'fastFall', 'chargeLoop', 'shieldHold', 'ledgeHang']);
const impacts = new Set(['attackLight1', 'attackLight2', 'attackLight3', 'crouchLight', 'chargeRelease', 'special', 'aerialNeutral', 'aerialForward', 'aerialDown', 'ledgeAttack']);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export function buildNativeMeleeManifest({ entries, heroId, universe, characterReferenceId, atlasVersion }) {
  // Art is delivered in two independent batches. Register only the completed
  // set; an unfinished batch must not be counted as a full animation manifest.
  if (entries.length !== 6) return null;
  const animations = {}, anchors = {}, frameAnchors = {}, sheets = {};
  const boundRows = new Set();
  for (const entry of entries) {
    if (entry.heroId !== heroId || entry.universe !== universe) throw new Error(`${heroId} animation crossed a character or universe boundary`);
    if (entry.columns !== 4 || entry.rows !== 8 || !entry.sheet) throw new Error(`${heroId} requires a four-column, eight-row atlas`);
    const states = entry.stateOrder || (Array.isArray(entry.states) ? entry.states : Object.keys(entry.states));
    sheets[entry.sheet] = { columns: 4, rows: 8, cellWidth: 256, cellHeight: 256 };
    for (const [index, state] of states.entries()) {
      if (!MELEE_STATES.includes(state) || animations[state]) throw new Error(`Invalid or repeated native animation state: ${state}`);
      const spec = Array.isArray(entry.states) ? {} : entry.states[state];
      const row = Number(spec?.row ?? index);
      const rowKey = `${entry.sheet}:${row}`;
      if (!Number.isInteger(row) || row < 0 || row >= 8 || boundRows.has(rowKey)) throw new Error(`${heroId} has an invalid or repeated native atlas row`);
      boundRows.add(rowKey);
      const stateDuration = MELEE_TRANSITION_DATA[state]?.duration || (state === 'ledgeClimb' ? 0.34 : state === 'jumpStart' ? 0.06 : null);
      const frameOrder = spec?.frameOrder || entry.frameOrderByState?.[state];
      const renderScale = Number(spec?.renderScale ?? entry.renderScaleByState?.[state] ?? entry.normalization?.rows?.[row]?.renderScale);
      animations[state] = {
        sheet: entry.sheet, row, startColumn: 0, frameCount: 4,
        fps: stateDuration ? 4 / stateDuration : state === 'run' ? 12 : 8,
        loop: loops.has(state), rootMotion: [], hurtboxes: [], hitboxes: [], events: [],
        ...(frameOrder ? { frameOrder: [...frameOrder] } : {}),
        ...(impacts.has(state) ? { timeline: 'action-impact', impactFrame: 2 } : {}),
        visualOnly: true, sourceAtlasId: entry.id,
        ...(Number.isFinite(renderScale) && renderScale > 0 && renderScale !== 1 ? { renderScale: Math.max(0.5, Math.min(3, renderScale)) } : {}),
        sourceAnimationVerified: false
      };
      const perStateAnchor = spec?.anchor || entry.anchorByState?.[state];
      anchors[state] = { x: 0.5, y: 244 / 256, ...perStateAnchor, baseline: ['ledgeCatch', 'ledgeHang', 'ledgeClimb'].includes(state) ? 'ledgeGrip' : 'feet' };
      const contacts = entry.normalization?.contactAnchorMeasurements?.[state];
      const perFrameAnchors = spec?.anchors || entry.anchorByFrame?.[state]
        || (['ledgeCatch', 'ledgeHang', 'ledgeClimb'].includes(state) ? contacts?.map(contact => ({
          x: contact.normalizedX, y: contact.normalizedY, attachToLedge: contact.contact,
          measuredContact: true
        })) : null);
      if (perFrameAnchors) frameAnchors[state] = perFrameAnchors.map(anchor => ({ ...anchor, baseline: anchors[state].baseline }));
    }
  }
  if (Object.keys(animations).length !== MELEE_STATES.length) throw new Error(`${heroId} animation set does not contain all 45 states`);
  return freeze({
    characterId: heroId, universe, characterReferenceId,
    context: 'melee', atlasVersion, cellWidth: 256, cellHeight: 256,
    imageWidth: 1024, imageHeight: 2048, columns: 4, rows: 8, facingMode: 'flip',
    animations, anchorByState: anchors, anchorByFrame: frameAnchors, trimByState: {}, weaponAnchorByFrame: {}, sheetLayouts: sheets,
    dedicatedStateRows: true, visualOnly: true, gameplayAuthority: 'meleeCombatRuntime',
    canonicalAnimationVerified: false, source1to1Verified: false
  });
}

