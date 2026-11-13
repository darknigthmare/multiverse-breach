/** Optional, run-local field rules. No rewards, ownership, saves or random draws. */
const local = (fr, en, lang) => lang === 'fr' ? fr : en;
const finitePosition = point => Number.isFinite(point?.wx) && Number.isFinite(point?.wy);
const live = state => state?.phase === 'running' && state.hp > 0 && !state.paused;
const valid = state => state?.fieldDirective && state.fieldDirective.runId === state.runId
  && state.fieldDirective.heroId === state.heroId && state.fieldDirective.mode === state.runMode;
const distance = (state, point) => Math.hypot(state.px - point.wx, state.py - point.wy);
export const EXTINCTION_DIRECTIVE_HOLD_TICKS = 120;
export const EXTINCTION_DIRECTIVE_RANGE = 1.25;
export const EXTINCTION_HUNT_MARK_TICKS = 240;

export const EXTINCTION_FIELD_DIRECTIVES = Object.freeze({
  extraction: { id: 'pressure-relays-v1', label: { fr: 'Relais sous pression', en: 'Relays under pressure' },
    rule: { fr: 'Active chaque balise, maintiens son périmètre trois secondes actives, puis confirme avec E.', en: 'Activate each beacon, hold its perimeter for three active seconds, then confirm with E.' },
    status: 'EXISTING_RUNTIME', required: 3, requiredTicks: 180 },
  last_signal: { id: 'signal-decryption-v1', label: { fr: 'Décryptage du Dernier Signal', en: 'Last Signal decryption' },
    rule: { fr: 'Décrypte le terminal de chaque vague : E, deux secondes dans le périmètre sans ennemi proche, puis E pour confirmer. Quatre signaux ouvrent le Champion.', en: 'Decrypt each wave terminal: E, two seconds inside its perimeter with no nearby enemy, then E to confirm. Four signals reveal the Champion.' },
    status: 'OPTIONAL_RUNTIME', required: 4, requiredTicks: 120 },
  infestation: { id: 'infestation-containment-v1', label: { fr: 'Confinement de l’Infestation', en: 'Infestation containment' },
    rule: { fr: 'À 10, 25 et 40 secondes, scelle un évent : E, deux secondes de maintien, puis E. Les évents scellés freinent les menaces proches. Tiens 60 secondes et scelle les trois évents pour extraire.', en: 'At 10, 25 and 40 seconds, seal a vent: E, hold for two seconds, then E. Sealed vents slow nearby threats. Survive 60 seconds and seal all three vents to extract.' },
    status: 'OPTIONAL_RUNTIME', required: 3, requiredTicks: 120 },
  hunt: { id: 'champion-mark-v1', label: { fr: 'Marquage du Champion', en: 'Champion marking' },
    rule: { fr: 'Une fois le Champion exposé, vise-le à moins de douze unités et utilise T / MARQUER. Le marquage ouvre quatre secondes de vulnérabilité. Ses drones restent prioritaires.', en: 'Once the Champion is exposed, aim at it within twelve units and use T / MARK. Marking opens four seconds of vulnerability. Its drones still take priority.' },
    status: 'OPTIONAL_RUNTIME', required: 1, requiredTicks: 240 }
});

export function createExtinctionFieldDirective(state, { enabled = false, mode } = {}) {
  if (!enabled || !['last_signal', 'infestation', 'hunt'].includes(mode) || !live(state)
    || typeof state.runId !== 'string' || !state.runId || !state.heroId) return null;
  const points = mode === 'last_signal' ? [[-4.6, 5.2], [4.6, 9.5], [-4.2, 15], [4.2, 20]]
    : mode === 'infestation' ? [[-4.5, 5.6], [4.6, 11.5], [-3.8, 18.5]] : [];
  return { id: EXTINCTION_FIELD_DIRECTIVES[mode].id, runId: state.runId, heroId: state.heroId, mode,
    lastTick: state.t || 0, marks: 0, markTicks: 0, markedEnemyId: null,
    markers: points.map(([wx, wy], index) => ({ id: `${mode}-${index + 1}`, wx, wy, index: index + 1,
      wave: mode === 'last_signal' ? index + 1 : null, opensAt: mode === 'infestation' ? [600, 1500, 2400][index] : 0,
      status: 'idle', ticks: 0, contested: false, inRange: false })) };
}

const activeMarker = (state, marker) => marker.status !== 'secured'
  && (state.fieldDirective.mode === 'last_signal' ? marker.wave === state.wave : state.t >= marker.opensAt);
const jamming = (state, marker) => (state.enemies || []).some(enemy => enemy.hp > 0 && finitePosition(enemy)
  && Math.hypot(enemy.wx - marker.wx, enemy.wy - marker.wy) <= 2.5);
const markerLabel = (mode, marker, lang) => local(mode === 'infestation' ? `Évent ${marker.index}` : `Terminal ${marker.index}`,
  mode === 'infestation' ? `Vent ${marker.index}` : `Terminal ${marker.index}`, lang);

export function getExtinctionDirectiveTarget(state, lang = 'fr') {
  if (!valid(state) || !live(state) || ![state.px, state.py].every(Number.isFinite)) return null;
  const marker = state.fieldDirective.markers.find(candidate => activeMarker(state, candidate)
    && distance(state, candidate) < EXTINCTION_DIRECTIVE_RANGE);
  return marker ? { ...marker, type: 'directive', label: markerLabel(state.fieldDirective.mode, marker, lang) } : null;
}

/** Physical presence is checked against the original marker, never caller coordinates. */
export function interactExtinctionFieldDirective(state, { lang = 'fr' } = {}) {
  const result = (activated, reason, feedback) => ({ activated, reason, feedback });
  if (!valid(state)) return result(false, 'unavailable', '');
  if (!live(state)) return result(false, 'inactive', local('Directive suspendue.', 'Directive paused.', lang));
  const target = getExtinctionDirectiveTarget(state, lang);
  if (!target) return result(false, 'out_of_range', local('Rejoins le repère de directive au radar.', 'Reach the directive marker on the radar.', lang));
  const marker = state.fieldDirective.markers.find(candidate => candidate.id === target.id);
  marker.contested = jamming(state, marker);
  if (marker.contested) return result(false, 'contested', local('Périmètre brouillé : éloigne ou neutralise les menaces.', 'Jammed perimeter: clear nearby threats.', lang));
  if (marker.status === 'ready') {
    marker.status = 'secured';
    return result(true, 'secured', local(`${target.label} sécurisé.`, `${target.label} secured.`, lang));
  }
  if (marker.status === 'idle') {
    marker.status = 'holding'; marker.inRange = true;
    return result(true, 'started', local(`${target.label} activé : maintiens le périmètre deux secondes.`, `${target.label} activated: hold the perimeter for two seconds.`, lang));
  }
  return result(false, 'holding', local('Maintiens la position, puis confirme avec E / LOOT.', 'Hold position, then confirm with E / LOOT.', lang));
}

export function tickExtinctionFieldDirective(state) {
  if (!valid(state) || !live(state) || !Number.isSafeInteger(state.t) || state.t <= state.fieldDirective.lastTick) return;
  const operation = state.fieldDirective;
  operation.lastTick = state.t;
  operation.markTicks = Math.max(0, operation.markTicks - 1);
  for (const marker of operation.markers) {
    if (!activeMarker(state, marker) || !['holding', 'ready'].includes(marker.status)) continue;
    marker.inRange = distance(state, marker) < EXTINCTION_DIRECTIVE_RANGE;
    marker.contested = jamming(state, marker);
    if (marker.status === 'holding' && marker.inRange && !marker.contested) {
      marker.ticks = Math.min(EXTINCTION_DIRECTIVE_HOLD_TICKS, marker.ticks + 1);
      if (marker.ticks === EXTINCTION_DIRECTIVE_HOLD_TICKS) marker.status = 'ready';
    }
  }
}

export function markExtinctionHuntTarget(state, { lang = 'fr' } = {}) {
  const outcome = (activated, reason, feedback) => ({ activated, reason, feedback });
  if (!valid(state) || state.fieldDirective.mode !== 'hunt') return outcome(false, 'unavailable', '');
  if (!live(state)) return outcome(false, 'inactive', local('Marquage suspendu.', 'Marking paused.', lang));
  const boss = state.enemies?.find(enemy => enemy.kind === 'Champion de Trame' && enemy.hp > 0);
  if (!boss) return outcome(false, 'no_target', local('Élimine les gardiens pour exposer le Champion.', 'Clear the guards to expose the Champion.', lang));
  const dx = boss.wx - state.px, dy = boss.wy - state.py;
  const forward = dx * Math.sin(state.angle) + dy * Math.cos(state.angle);
  const side = dx * Math.cos(state.angle) - dy * Math.sin(state.angle);
  if (![dx, dy, forward, side].every(Number.isFinite) || Math.hypot(dx, dy) > 12 || forward <= 0 || Math.abs(side / forward) > 0.24) {
    return outcome(false, 'aim_required', local('Vise le Champion à moins de douze unités, puis utilise T.', 'Aim at the Champion within twelve units, then use T.', lang));
  }
  const operation = state.fieldDirective;
  if (operation.markTicks > 0 && operation.markedEnemyId === boss.id) return outcome(false, 'already_marked', local('Le noyau est déjà marqué.', 'The core is already marked.', lang));
  operation.markTicks = EXTINCTION_HUNT_MARK_TICKS; operation.markedEnemyId = boss.id; operation.marks += 1;
  return outcome(true, 'marked', local('Noyau marqué : quatre secondes de vulnérabilité. Détruis d’abord ses drones.', 'Core marked: four seconds of vulnerability. Destroy its drones first.', lang));
}

/** Used by the single shared damage path, including pickups and support summons. */
export function canDamageExtinctionDirectiveEnemy(state, enemy) {
  if (!valid(state) || state.fieldDirective.mode !== 'hunt' || enemy?.kind !== 'Champion de Trame') return true;
  return live(state) && state.fieldDirective.markTicks > 0 && state.fieldDirective.markedEnemyId === enemy.id;
}
export function canAdvanceExtinctionDirectiveWave(state) {
  if (!state?.fieldDirective) return true;
  if (!valid(state)) return false;
  if (state.fieldDirective.mode !== 'last_signal' || state.wave > 4) return true;
  return state.fieldDirective.markers.some(marker => marker.wave === state.wave && marker.status === 'secured');
}
export function canCompleteExtinctionFieldDirective(state) {
  if (!state?.fieldDirective) return true;
  if (!valid(state) || !live(state)) return false;
  const clearedChampion = Array.isArray(state.enemies)
    && state.enemies.some(enemy => enemy.kind === 'Champion de Trame' && enemy.hp <= 0)
    && state.enemies.every(enemy => enemy.hp <= 0);
  if (state.fieldDirective.mode === 'hunt') return state.fieldDirective.marks > 0 && clearedChampion;
  const secured = state.fieldDirective.markers.length > 0 && state.fieldDirective.markers.every(marker => marker.status === 'secured');
  return secured && (state.fieldDirective.mode === 'infestation' ? state.t >= 3600 : clearedChampion);
}
export function getExtinctionDirectiveSpeedFactor(state, enemy) {
  return valid(state) && state.fieldDirective.mode === 'infestation'
    && state.fieldDirective.markers.some(marker => marker.status === 'secured'
      && Math.hypot(marker.wx - enemy.wx, marker.wy - enemy.wy) <= 4) ? 0.65 : 1;
}

export function getExtinctionFieldDirectiveStatus(state, lang = 'fr') {
  if (!valid(state)) return null;
  const operation = state.fieldDirective, definition = EXTINCTION_FIELD_DIRECTIVES[operation.mode];
  const completed = operation.mode === 'hunt' ? Math.min(1, operation.marks)
    : operation.markers.filter(marker => marker.status === 'secured').length;
  const marker = operation.markers.find(candidate => activeMarker(state, candidate));
  const boss = operation.mode === 'hunt' && state.enemies?.find(enemy => enemy.kind === 'Champion de Trame' && enemy.hp > 0);
  const progress = marker ? marker.ticks / EXTINCTION_DIRECTIVE_HOLD_TICKS : operation.mode === 'hunt' ? operation.markTicks / EXTINCTION_HUNT_MARK_TICKS : 0;
  const waiting = operation.markers.find(candidate => candidate.status !== 'secured');
  let text;
  if (operation.mode === 'hunt') text = boss ? operation.markTicks > 0
    ? local(`NOYAU MARQUÉ · ${Math.ceil(operation.markTicks / 60)} s · drones ${state.enemies.filter(enemy => enemy.kind === 'Drone Protecteur' && enemy.hp > 0).length}`, `CORE MARKED · ${Math.ceil(operation.markTicks / 60)}s · drones ${state.enemies.filter(enemy => enemy.kind === 'Drone Protecteur' && enemy.hp > 0).length}`, lang)
    : local('VISE LE CHAMPION · ≤ 12 unités · T / MARQUER', 'AIM AT CHAMPION · ≤ 12 units · T / MARK', lang)
    : local('Élimine les gardiens pour exposer le noyau à marquer.', 'Clear the guards to expose the core for marking.', lang);
  else if (!marker) text = completed === definition.required
    ? local('Tous les repères sécurisés. Termine l’objectif de survie ou de combat.', 'All markers secured. Finish the survival or combat objective.', lang)
    : operation.mode === 'infestation' ? local(`PROCHAIN ÉVENT · ${Math.max(0, Math.ceil((waiting.opensAt - state.t) / 60))} s`, `NEXT VENT · ${Math.max(0, Math.ceil((waiting.opensAt - state.t) / 60))}s`, lang)
      : local('Signal transmis. Nettoie la vague en cours.', 'Signal transmitted. Clear the current wave.', lang);
  else text = `${markerLabel(operation.mode, marker, lang)} · ${Math.ceil(distance(state, marker))} m · ${marker.contested
    ? local('PÉRIMÈTRE BROUILLÉ', 'PERIMETER JAMMED', lang)
    : marker.status === 'ready' ? local('CONFIRME E / LOOT', 'CONFIRM E / LOOT', lang)
      : marker.status === 'holding' ? marker.inRange ? local(`MAINTIENS ${Math.ceil((120 - marker.ticks) / 60)} s`, `HOLD ${Math.ceil((120 - marker.ticks) / 60)}s`, lang)
        : local('REVIENS DANS LE PÉRIMÈTRE', 'RETURN TO THE PERIMETER', lang) : local('ACTIVE E / LOOT', 'ACTIVATE E / LOOT', lang)}`;
  return { id: operation.id, mode: operation.mode, title: definition.label[lang === 'fr' ? 'fr' : 'en'], text,
    completed, required: definition.required, progress, markTicks: operation.markTicks,
    canMark: Boolean(boss && operation.markTicks <= 0), markerStatus: marker?.status || null,
    rule: definition.rule[lang === 'fr' ? 'fr' : 'en'] };
}

/** Same forward/up transform for hostiles and objective markers; clamped if far. */
export function getExtinctionRadarPoint(state, point, radius, range = 18) {
  if (![state?.px, state?.py, state?.angle, radius, range].every(Number.isFinite)
    || !finitePosition(point) || radius <= 7 || range <= 0) return null;
  const dx = point.wx - state.px, dy = point.wy - state.py, dist = Math.hypot(dx, dy);
  const scale = (radius - 7) / Math.max(range, dist);
  return { x: (dx * Math.cos(state.angle) - dy * Math.sin(state.angle)) * scale,
    y: -(dx * Math.sin(state.angle) + dy * Math.cos(state.angle)) * scale, distance: dist, clamped: dist > range };
}

export function drawExtinctionDirectiveMarkers(ctx, state, width, height, projectWorld, radar) {
  const operation = valid(state) && state.fieldDirective;
  const points = operation ? operation.markers.filter(marker => activeMarker(state, marker) || marker.status === 'secured') : [];
  if (state.runMode === 'extraction') {
    const beacon = state.loot?.find(item => item.type === 'beacon' && item.wave === state.wave && !item.used);
    if (beacon) points.push({ ...beacon, index: beacon.wave, status: 'beacon' });
  }
  if (operation?.mode === 'hunt') {
    const boss = state.enemies.find(enemy => enemy.kind === 'Champion de Trame' && enemy.hp > 0);
    if (boss) points.push({ ...boss, index: 'T', status: operation.markTicks ? 'secured' : 'target' });
  }
  ctx.save();
  for (const point of points) {
    const color = point.status === 'secured' ? '#91e9bd' : '#ffe49d';
    const mark = getExtinctionRadarPoint(state, point, radar.radius);
    if (mark) {
      ctx.fillStyle = color; ctx.strokeStyle = '#081c28'; ctx.lineWidth = 1.5;
      ctx.fillRect(radar.x + mark.x - 4, radar.y + mark.y - 4, 8, 8);
      ctx.strokeRect(radar.x + mark.x - 4, radar.y + mark.y - 4, 8, 8);
    }
    if (point.status === 'beacon' || point.status === 'target' || operation?.mode === 'hunt') continue;
    const p = projectWorld(point, state);
    if (p.camZ <= 0.2 || Math.abs(p.aim) > 1.4) continue;
    const x = width / 2 + p.aim * width * 0.78, y = height * 0.55 + 100 / p.camZ;
    const size = Math.max(7, Math.min(40, 70 / p.camZ));
    ctx.strokeStyle = color; ctx.fillStyle = '#102532'; ctx.lineWidth = 2;
    ctx.fillRect(x - size / 2, y - size, size, size); ctx.strokeRect(x - size / 2, y - size, size, size);
    ctx.fillStyle = color; ctx.font = '11px monospace'; ctx.fillText(String(point.index), x - 4, y - size / 2 + 4);
    if (point.ticks > 0 && point.status !== 'secured') ctx.fillRect(x - size / 2, y + 4, size * point.ticks / EXTINCTION_DIRECTIVE_HOLD_TICKS, 3);
  }
  ctx.restore();
}
