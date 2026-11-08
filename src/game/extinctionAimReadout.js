/** Read-only aiming feedback for the held kit. This does not lock a target,
 * predict a moving enemy, fire, spend a resource or change the simulation.
 */
import {
  EXTINCTION_PICKUP_BALLISTICS, extinctionSegmentHit, getExtinctionActionReach,
  getExtinctionProtocolStatus, getExtinctionAimCandidates,
  getExtinctionActionAimCone, getExtinctionPickupSpreadHits
} from './extinctionSignatures.js';
import { canDamageExtinctionDirectiveEnemy } from './extinctionFieldDirectives.js';

const local = (fr, en, lang) => lang === 'fr' ? fr : en;
const text = (value, lang) => typeof value === 'string' ? value : value?.[lang] || value?.fr || value?.en || '';
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const contact = kind => ['melee', 'sweep', 'counter'].includes(kind);
const control = kind => ['control', 'control_pulse'].includes(kind);
const wide = kind => ['beam', 'sweep', 'scatter', 'volley', 'cone'].includes(kind);
const distance = (state, enemy) => Math.hypot(enemy.wx - state.px, enemy.wy - state.py);
const finiteEnemy = enemy => enemy?.hp > 0 && [enemy.wx, enemy.wy].every(Number.isFinite);

/** The current renderer's body rectangle, clipped against the real canvas.
 * Being eligible for a broad contact cone is not evidence of being on screen.
 * No direction or identity is revealed for a target behind/outside the view.
 */
function visibleEnemy(state, enemy, viewport) {
  const width = viewport?.width, height = viewport?.height;
  if (![width, height].every(value => Number.isFinite(value) && value > 0) || !finiteEnemy(enemy)) return false;
  const dx = enemy.wx - state.px, dy = enemy.wy - state.py;
  const z = dx * Math.sin(state.angle) + dy * Math.cos(state.angle);
  const aim = (dx * Math.cos(state.angle) - dy * Math.sin(state.angle)) / z;
  if (z <= 0.24 || Math.abs(aim) >= 1.45) return false;
  const scale = Math.min(1.8, 1 / z), x = width / 2 + aim * width * 0.78;
  const y = height * 0.58 - 28 * scale, half = 46 * scale * 0.35;
  return x + half > 0 && x - half < width && y + 76 * scale > 0 && y < height;
}

/** Only an instantaneous line, not an interception prediction. The travelling
 * attack still resolves collision against the enemy's position on each tick.
 */
function firstRayContact(state, action, pickup) {
  const tuning = pickup ? EXTINCTION_PICKUP_BALLISTICS[state.weapon.type] : null;
  const offset = pickup ? 0 : 0.18;
  const x = pickup ? state.px : clamp(state.px + Math.sin(state.angle) * offset, -7.5, 7.5);
  const y = pickup ? state.py : clamp(state.py + Math.cos(state.angle) * offset, -1.4, 28);
  const range = tuning?.range ?? Math.ceil(action.range / 0.3) * 0.3;
  const bx = x + Math.sin(state.angle) * range, by = y + Math.cos(state.angle) * range;
  let nearest = null, first = Infinity;
  for (const enemy of state.enemies) {
    if (!finiteEnemy(enemy)) continue;
    const hit = extinctionSegmentHit(x, y, bx, by, enemy.wx, enemy.wy,
      (tuning?.radius ?? 0.22) + 0.28 * (enemy.size || 1));
    if (hit !== null && hit < first) { nearest = enemy; first = hit; }
  }
  return nearest;
}

function targetCondition(state, target, kind) {
  if (!target) return 'none';
  // Control applies without damage even against a protected Champion.
  if (!control(kind)) {
    if (!canDamageExtinctionDirectiveEnemy(state, target)) return 'mark';
    if (target.shieldActive && state.enemies.some(enemy => enemy.kind === 'Drone Protecteur' && enemy.hp > 0)) return 'shield';
  }
  return 'target';
}

function command(kind, lang) {
  if (contact(kind)) return local('FRAPPER', 'STRIKE', lang);
  if (['dash', 'teleport'].includes(kind)) return local('BOUGER', 'MOVE', lang);
  if (['projectile', 'cone'].includes(kind)) return local('LANCER', 'CAST', lang);
  if (['hitscan', 'beam', 'scatter', 'volley', 'shotgun', 'plasma', 'rocket'].includes(kind)) return local('TIRER', 'FIRE', lang);
  return 'ACTION';
}

function shape(kind) {
  if (contact(kind)) return 'contact';
  if (control(kind)) return 'control';
  if (['dash', 'teleport'].includes(kind)) return 'movement';
  if (['projectile', 'plasma', 'rocket'].includes(kind)) return 'projectile';
  if (['shotgun', 'scatter', 'volley', 'cone'].includes(kind)) return 'spread';
  if (['hitscan', 'beam'].includes(kind)) return 'ranged';
  return 'focus';
}

function wording(condition, kind, range, lang) {
  const reach = lang === 'fr' ? String(range).replace('.', ',') : String(range);
  const values = {
    unavailable: ['INACTIF', 'INACTIVE', 'Aucune action principale disponible.', 'No primary action is available.'],
    paused: ['PAUSE', 'PAUSED', 'Action principale suspendue.', 'Primary action paused.'],
    cooldown: ['ATTENDS', 'WAIT', 'Attends la fin de la récupération.', 'Wait for recovery to finish.'],
    reload: ['RECHARGE', 'RELOADING', 'La recharge est encore en cours.', 'Reloading is still in progress.'],
    ammo: ['RECHARGE R', 'RELOAD R', 'Chargeur vide. Recharge avec R ou cherche des munitions.', 'Empty magazine. Reload with R or look for ammunition.'],
    mark: ['MARQUER T', 'MARK T', 'Ce noyau est masqué. Vise et marque le Champion avec T ; ses drones restent prioritaires.', 'This core is masked. Aim and mark the Champion with T; its drones still take priority.'],
    shield: ['DRONES', 'DRONES', 'Le bouclier de cette menace est entretenu par ses drones. Détruis-les d’abord.', 'This threat is shielded by its drones. Destroy them first.'],
    movement: ['REGARD', 'FACING', `Déplacement dans la direction du regard, jusqu’à ${reach} unités selon les limites de l’arène.`, `Move in your viewing direction, up to ${reach} units within the arena boundaries.`],
    boundary: ['LIMITE', 'BOUNDARY', 'Tu es contre la limite de l’arène. Change la direction du regard.', 'You are at the arena boundary. Change your viewing direction.'],
    self: ['SUR SOI', 'SELF', 'Cette action agit sur toi ; aucune menace à viser.', 'This action affects you; no threat to aim at.'],
    out_of_range: [contact(kind) ? 'APPROCHE' : 'TROP LOIN', contact(kind) ? 'CLOSER' : 'TOO FAR',
      `La menace visible dans cette direction est au-delà de la portée de ${reach} unités.`, `The visible threat in this direction is beyond the ${reach}-unit range.`],
    flight: ['ANTICIPE', 'LEAD AIM', 'Une menace croise la trajectoire actuelle. Anticipe son mouvement ; seul le contact réel produit un impact.', 'A threat crosses the current path. Lead its movement; only actual contact produces an impact.'],
    target: [contact(kind) ? 'À PORTÉE' : control(kind) ? 'CONTRÔLE' : 'EN VUE',
      contact(kind) ? 'IN REACH' : control(kind) ? 'CONTROL' : 'IN VIEW',
      contact(kind) ? 'Une menace visible est dans ton angle et ta portée de contact.' : control(kind) ? 'Une menace visible est dans ton angle et ta portée de contrôle.' : 'Une menace visible est dans la portée et la zone de cette action.',
      contact(kind) ? 'A visible threat is inside your contact angle and reach.' : control(kind) ? 'A visible threat is inside your control angle and reach.' : 'A visible threat is inside the range and area of this action.'],
    none: ['VISE', 'AIM', 'Aucune cible visible dans la zone indiquée par ce réticule.', 'No visible target in the area indicated by this reticle.']
  };
  const value = values[condition] || values.none;
  return { label: local(value[0], value[1], lang), detail: local(value[2], value[3], lang) };
}

export function getExtinctionAimReadout(state, lang = 'fr', viewport = null) {
  const p = state?.protocols, weapon = state?.weapon;
  const current = state?.phase === 'running' && state.hp > 0 && state.heroId && state.runId
    && p?.ownerId === state.heroId && p.runId === state.runId && p.profile?.heroId === state.heroId
    && [state.px, state.py, state.angle].every(Number.isFinite) && Array.isArray(state.enemies);
  const pickup = Boolean(EXTINCTION_PICKUP_BALLISTICS[weapon?.type]);
  const action = weapon?.type === 'pistol' ? p?.profile?.actions?.simple : null;
  if (!current || (!action && !pickup)) return {
    source: 'unavailable', kind: 'none', shape: 'focus', readiness: 'unavailable', condition: 'unavailable',
    targetId: null, targetCondition: 'none', range: 0, readyFraction: 0, command: 'ACTION',
    name: '', ...wording('unavailable', '', 0, lang)
  };
  const kind = pickup ? weapon.type : action.kind;
  const reach = pickup ? { kind: 'aim', value: EXTINCTION_PICKUP_BALLISTICS[kind].range } : getExtinctionActionReach(action);
  const ticks = pickup ? Math.max(0, Math.max(1, (Number.isFinite(weapon.fireRate) ? weapon.fireRate : 1) * 18)
    - (Number.isFinite(state.lastFireTime) ? state.t - state.lastFireTime : Infinity)) : Math.max(0, p.cooldowns?.simple || 0);
  const duration = pickup ? Math.max(1, (Number.isFinite(weapon.fireRate) ? weapon.fireRate : 1) * 18) : Math.max(1, action.cooldown);
  const readiness = state.paused ? 'paused' : pickup
    ? state.reloadPulse > 0 ? 'reload' : ticks > 0 ? 'cooldown' : !Number.isFinite(weapon.ammo) || weapon.ammo < 1 ? 'ammo' : 'ready'
    : getExtinctionProtocolStatus(state, 'simple');
  let target = null, condition = 'none';
  if (reach.kind === 'movement') {
    const x = clamp(state.px + Math.sin(state.angle) * reach.value, -7.5, 7.5);
    const y = clamp(state.py + Math.cos(state.angle) * reach.value, -1.4, 28);
    condition = Math.hypot(x - state.px, y - state.py) < 0.01 ? 'boundary' : 'movement';
  } else if (['self', 'anchor', 'placement', 'support-radius'].includes(reach.kind)) condition = 'self';
  else if (kind === 'shotgun') {
    // First hit on every real pellet, not a wider, approximate cone.
    target = getExtinctionPickupSpreadHits(state).map(entry => entry.enemy)
      .filter(enemy => visibleEnemy(state, enemy, viewport)).sort((a, b) => distance(state, a) - distance(state, b))[0] || null;
  } else if (kind === 'projectile' || ['plasma', 'rocket'].includes(kind)) {
    const candidate = firstRayContact(state, action, pickup);
    if (candidate && visibleEnemy(state, candidate, viewport)) target = candidate;
  } else if (reach.kind === 'radius') {
    target = state.enemies.filter(enemy => finiteEnemy(enemy) && distance(state, enemy) <= reach.value
      && visibleEnemy(state, enemy, viewport)).sort((a, b) => distance(state, a) - distance(state, b))[0] || null;
  } else {
    const candidates = getExtinctionAimCandidates(state, reach.value, getExtinctionActionAimCone(action));
    const actual = wide(kind) ? candidates : candidates.slice(0, 1);
    target = actual.find(entry => visibleEnemy(state, entry.enemy, viewport))?.enemy || null;
    if (!target && !candidates.length) {
      const further = getExtinctionAimCandidates(state, Infinity, getExtinctionActionAimCone(action))
        .find(entry => visibleEnemy(state, entry.enemy, viewport));
      if (further) condition = 'out_of_range';
    }
  }
  const protection = targetCondition(state, target, kind);
  if (target) condition = protection === 'target' && ['projectile', 'plasma', 'rocket'].includes(kind) ? 'flight' : protection;
  const displayed = readiness === 'ready' ? condition : readiness;
  const words = wording(displayed, kind, reach.value, lang);
  return {
    source: pickup ? 'pickup' : 'personal', kind, shape: shape(kind), readiness, condition: displayed,
    targetId: target?.id ?? null, targetCondition: protection, range: reach.value,
    readyFraction: readiness === 'reload' ? clamp(1 - state.reloadPulse / 36, 0, 1) : clamp(1 - ticks / duration, 0, 1),
    command: command(kind, lang), name: pickup ? text(weapon.name, lang) : text(action.name, lang), ...words
  };
}

/** Fit all marks inside the existing 36×36 reserved reticle area. Camera shake
 * moves the world; it must not move these aiming controls under a HUD button.
 * The existing damage-confirmed hit marker remains separate and unchanged.
 */
export function drawExtinctionAimReticle(ctx, state, width, height, lang = 'fr') {
  if (!ctx || ![width, height].every(value => Number.isFinite(value) && value > 0)) return null;
  const readout = getExtinctionAimReadout(state, lang, { width, height });
  if (readout.source === 'unavailable') return null;
  const blocked = ['mark', 'shield', 'boundary', 'out_of_range'].includes(readout.condition);
  const ready = readout.readiness === 'ready';
  const color = !ready ? '#91a8b5' : blocked ? '#ffe49d' : ['target', 'flight'].includes(readout.condition) ? '#91e9bd' : '#e1f6ff';
  const stroke = () => {
    ctx.strokeStyle = 'rgba(225,246,255,0.66)'; ctx.lineWidth = 2.8; ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.stroke();
  };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(width / 2, height / 2);
  ctx.globalAlpha = ready ? 0.95 : 0.65; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (readout.shape === 'contact') {
    for (const direction of [-1, 1]) {
      ctx.moveTo(direction * 6, -10); ctx.lineTo(direction * 12, -10);
      ctx.lineTo(direction * 12, 10); ctx.lineTo(direction * 6, 10);
    }
  } else if (readout.shape === 'movement') {
    for (const y of [-5, 5]) { ctx.moveTo(-9, y + 4); ctx.lineTo(0, y - 4); ctx.lineTo(9, y + 4); }
  } else if (readout.shape === 'projectile') ctx.arc(0, 0, 10, 0, Math.PI * 2);
  else if (readout.shape === 'control') {
    for (const [x, y] of [[-11, -11], [11, -11], [-11, 11], [11, 11]]) {
      ctx.moveTo(x - Math.sign(x) * 5, y); ctx.lineTo(x, y); ctx.lineTo(x, y - Math.sign(y) * 5);
    }
  } else if (readout.shape === 'spread') {
    for (const direction of [-1, 1]) {
      ctx.moveTo(direction * 12, -9); ctx.lineTo(direction * 6, 0); ctx.lineTo(direction * 12, 9);
    }
  } else if (readout.shape === 'ranged') {
    ctx.moveTo(-12, 0); ctx.lineTo(-5, 0); ctx.moveTo(5, 0); ctx.lineTo(12, 0);
    ctx.moveTo(0, -12); ctx.lineTo(0, -5); ctx.moveTo(0, 5); ctx.lineTo(0, 12);
  } else {
    ctx.moveTo(0, -11); ctx.lineTo(11, 0); ctx.lineTo(0, 11); ctx.lineTo(-11, 0); ctx.closePath();
  }
  stroke();
  if (blocked) { ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); stroke(); }
  else if (ready && readout.targetId !== null) { ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI * 2); stroke(); }
  if (['cooldown', 'reload'].includes(readout.readiness) && readout.readyFraction > 0) {
    ctx.beginPath(); ctx.arc(0, 0, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * readout.readyFraction); stroke();
  }
  ctx.restore();
  return readout;
}
