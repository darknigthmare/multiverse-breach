import {
  getTerrainSurface, getSurfacesAt, terrainSurfaceRef, reachableTerrainSurfaces,
  findTerrainPath, canOccupyTerrainSurface, getTerrainNeighbors,
  getTerrainHeightAt, terrainLineOfSight, terrainHeightAdvantage, terrainCoverReduction
} from './tacticsTerrain.js';
import {
  getSurfacePolygon, hitTestTacticsSurface, drawTacticsTerrain
} from './tacticsTerrainRenderer.js';
import { faceGridUnitToward } from './tacticalFacing.js';
import { resolveCombatAbility, resolveCombatHeroSpriteActor } from './combatIdentity.js';
import { getCharacterAnimationFrame } from './combat/characterAnimationCatalog.js';
import { getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteFrameForLayout } from './spriteAssets.js';
import { drawTacticsScenery, getTacticsSceneryBounds } from './tacticsEnvironmentRenderer.js';

const rays = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const living = unit => (unit?.currentHp ?? unit?.hp ?? 0) > 0;
const cell = surface => ({ ...terrainSurfaceRef(surface), gridX: surface.x, gridY: surface.y });

// The vertical board is a capability of the real combat engine. All logical
// operations address surfaces; camera cuts are purely a viewing preference.
export class TacticsVerticalRuntime {
  constructor(engine) {
    this.engine = engine;
    this.terrain = engine.terrain;
    this.visibleLevel = null;
    this.selectedSurfaceId = null;
    this.lastMove = null;
    this.revision = 0;
  }

  surface(ref) { return getTerrainSurface(this.terrain, ref); }
  ability(unit, action) {
    return resolveCombatAbility(unit, action === 'enemy' ? 'simple' : action);
  }
  definition(unit, action) {
    return this.ability(unit, action)?.sourceAbility || unit?.[action === 'enemy' ? 'simple' : action] || null;
  }
  attackProfile(unit, action) {
    const profile = this.ability(unit, action);
    const raw = this.definition(unit, action) || {};
    const explicit = Object.assign({}, unit?.tacticsAttacks?.[action], raw.tactics, raw.attackProfile, raw.tacticsProfile);
    const effect = explicit.effect || profile?.effect || raw.targeting?.effect || 'damage';
    const delivery = explicit.delivery || profile?.delivery || raw.targeting?.delivery || 'melee';
    const shape = explicit.shape || (delivery === 'radial' ? 'radial' : profile?.shape || raw.targeting?.shape || 'single');
    const pixelRange = profile?.range || raw.targeting?.range || raw.range;
    const convertedRange = delivery === 'melee' ? Math.max(1, Math.min(3, Math.ceil((pixelRange || 85) / 100)))
      : Math.max(1, Math.min(8, Math.ceil((pixelRange || 480) / 140)));
    const declaredSide = explicit.targetSide || raw.targeting?.targetSide || raw.targetSide;
    const targetSide = action === 'defense' && effect === 'guard' && !declaredSide ? 'self'
      : declaredSide || profile?.targetSide || (effect === 'damage' ? 'enemy' : 'ally');
    const range = targetSide === 'self' ? 0
      : explicit.range ?? raw.tacticsRange ?? convertedRange;
    return {
      ...profile, ...explicit, effect, delivery, shape, actionType: action, range,
      effectDuration: profile?.effectDuration ?? raw.targeting?.duration ?? raw.dur ?? 2,
      healRatio: profile?.healRatio ?? raw.targeting?.healRatio ?? 0,
      guardReduce: profile?.guardReduce ?? raw.targeting?.reduce ?? raw.reduce ?? 0.4,
      buffMultiplier: profile?.buffMultiplier ?? raw.targeting?.buffMultiplier ?? 1.12,
      reviveRatio: profile?.reviveRatio ?? raw.targeting?.reviveRatio ?? 0.3,
      cleanses: profile?.cleanses ?? raw.targeting?.cleanses ?? false,
      excludeSelf: profile?.excludeSelf ?? raw.targeting?.excludeSelf ?? false,
      minRange: explicit.minRange ?? (effect === 'damage' && delivery !== 'radial' ? 1 : 0),
      areaRadius: explicit.areaRadius ?? explicit.radius ?? (delivery === 'radial'
        ? Math.min(range, Math.max(1, Math.ceil((profile?.areaRadius || raw.targeting?.areaRadius || pixelRange || 140) / 140)))
        : ['area', 'radial'].includes(shape) ? 1 : 0),
      axes: Math.min(8, Math.max(1, explicit.axes || 3)), directions: explicit.directions === 4 ? 4 : 8,
      pierceUnits: !!explicit.pierceUnits, pierceObstacles: !!explicit.pierceObstacles,
      blocksOnUnits: explicit.blocksOnUnits ?? (delivery === 'melee' && effect === 'damage'),
      requiresLineOfSight: explicit.requiresLineOfSight ?? true,
      maxTargets: explicit.maxTargets ?? (shape === 'single' ? 1 : profile?.maxTargets || 8),
      targetSide,
      multiplier: profile?.multiplier ?? raw.dmg ?? 1
    };
  }
  baseDamage(unit, action) {
    const profile = this.attackProfile(unit, action);
    if (profile.effect !== 'damage') return 0;
    const buff = unit.tacticsBuffTicks > 0 ? unit.tacticsBuffMultiplier || 1 : 1;
    return (unit.stats?.atk ?? unit.atk ?? 0) * profile.multiplier * buff;
  }
  drawActor(unit) {
    if (unit.state !== 'special' || !(unit.stateTimer > 0)) return unit;
    const duration = unit.tacticsPresentationTicks || 35;
    const profile = this.ability(unit, 'special');
    const actor = { ...unit, presentationPhase: 'super',
      presentationProgress: Math.max(0, Math.min(1, 1 - unit.stateTimer / duration)),
      presentationImpactProgress: profile?.duration ? profile.hitAt / profile.duration : 0.4 };
    if (!getCharacterAnimationFrame(actor) && resolveCombatHeroSpriteActor(actor)) {
      const layout = getSpriteSheetLayout(getHeroSpriteSheetSrc(actor, 'tactics'));
      actor.presentationFrame = getSpriteFrameForLayout(unit.state, duration - unit.stateTimer, layout);
    }
    return actor;
  }
  project = (x, y, z = 0) => {
    const e = this.engine;
    const point = e.getPerspectivePoint(x, y);
    return { x: point.x, y: point.y - z * e.baseCellH * 0.74 * e.cameraZoom };
  };
  isVisible(id) {
    const surface = this.surface(id);
    return !!surface && (this.visibleLevel === null || surface.minZ <= this.visibleLevel + 0.001);
  }
  bindActor(actor, spawn = null) {
    if (!actor) return;
    let surface = this.surface(actor.surfaceId || spawn?.surfaceId || { x: actor.gridX, y: actor.gridY, z: spawn?.z });
    // Migration of old XY-only entities is explicitly to the lowest walkable
    // floor. Runtime clicks never use this import-only fallback.
    if (!surface) surface = getSurfacesAt(this.terrain, actor.gridX, actor.gridY).find(entry => entry.walkable);
    if (!surface) throw new Error('No Tactics support surface for ' + (actor.id || actor.name));
    actor.surfaceId = surface.id;
    actor.gridZ = surface.z;
    actor.gridX = surface.x;
    actor.gridY = surface.y;
  }
  bindActors() {
    const e = this.engine;
    e.heroes.forEach((unit, index) => this.bindActor(unit, e.battlefield.heroSpawns?.[index]));
    e.enemies.forEach(unit => this.bindActor(unit));
    e.obstacles.forEach(unit => this.bindActor(unit));
    this.bindActor(e.escortUnit, e.battlefield.escortSpawn);
    this.bindActor(e.protectedArtifact, e.tiles.find(tile => tile.type === 'artifact'));
    // The character keeps its real footprint and body height. A custom boss
    // cannot inherit a narrow bridge spawn intended for a small infantry unit.
    for (const unit of [...e.heroes, ...e.enemies, ...(e.escortUnit ? [e.escortUnit] : [])]) {
      const options = this.pathOptions(unit);
      if (canOccupyTerrainSurface(this.terrain, unit.surfaceId, options)) continue;
      const origin = this.surface(unit);
      const candidates = [...this.terrain.surfaces].sort((a, b) =>
        (Math.abs(a.x - origin.x) + Math.abs(a.y - origin.y) + Math.abs(a.z - origin.z) * 2)
        - (Math.abs(b.x - origin.x) + Math.abs(b.y - origin.y) + Math.abs(b.z - origin.z) * 2)
        || a.id.localeCompare(b.id));
      const available = candidates.find(surface => canOccupyTerrainSurface(this.terrain, surface.id, options));
      if (!available) throw new Error('No free Tactics footprint for ' + (unit.name || unit.id));
      // This initial placement updates only the address, never the character
      // or its shape.
      Object.assign(unit, { surfaceId: available.id, gridX: available.x, gridY: available.y, gridZ: available.z });
    }
    this.selectedSurfaceId = e.heroes[0]?.surfaceId || this.terrain.surfaces[0]?.id || null;
  }
  position(x, y, surfaceId, centered = true) {
    const support = this.surface(surfaceId || { x, y });
    const worldX = x + (centered ? 0.5 : 0);
    const worldY = y + (centered ? 0.5 : 0);
    return this.project(worldX, worldY, support ? getTerrainHeightAt(support, worldX, worldY) : 0);
  }
  polygon(x, y, inset = 0, surfaceId = null) {
    const support = this.surface(surfaceId || { x, y });
    return support ? getSurfacePolygon(support, this.project, inset) : [];
  }
  pick(x, y) {
    const surface = hitTestTacticsSurface(this.terrain, x, y, { project: this.project, cutLevel: this.visibleLevel });
    if (!surface) return { x: -1, y: -1, col: -1, row: -1, surfaceId: null };
    return { x: surface.x, y: surface.y, col: surface.x, row: surface.y, z: surface.z, surfaceId: surface.id };
  }
  select(id) {
    const surface = this.surface(id);
    if (!surface || !this.isVisible(id)) return false;
    this.selectedSurfaceId = surface.id;
    this.revision++;
    return true;
  }
  setLevel(level) {
    if (level !== null && !this.levels().includes(Number(level))) return false;
    this.visibleLevel = level === null ? null : Number(level);
    if (!this.isVisible(this.selectedSurfaceId)) {
      const old = this.surface(this.selectedSurfaceId);
      const next = old && getSurfacesAt(this.terrain, old.x, old.y).filter(surface => this.isVisible(surface.id)).at(-1);
      this.selectedSurfaceId = next?.id || this.terrain.surfaces.find(surface => this.isVisible(surface.id))?.id || null;
    }
    this.revision++;
    return true;
  }
  levels() { return [...new Set(this.terrain.surfaces.map(surface => surface.z))].sort((a, b) => a - b); }
  cycleLevel(direction = 1) {
    const levels = [null, ...this.levels()];
    const index = levels.indexOf(this.visibleLevel);
    return this.setLevel(levels[(index + Math.sign(direction) + levels.length) % levels.length]);
  }
  cycleSurface(direction = 1) {
    const selected = this.surface(this.selectedSurfaceId);
    if (!selected) return false;
    const stack = getSurfacesAt(this.terrain, selected.x, selected.y).filter(surface => this.isVisible(surface.id));
    const index = stack.findIndex(surface => surface.id === selected.id);
    return this.select(stack[(index + Math.sign(direction) + stack.length) % stack.length]?.id);
  }
  viewState() {
    const e = this.engine, selected = this.surface(this.selectedSurfaceId);
    const move = e.movementRange?.find(entry => entry.surfaceId === selected?.id);
    const attack = e.attackRange?.some(entry => entry.surfaceId === selected?.id);
    const occupied = selected && this.occupied(selected.x, selected.y, e.activeUnit, selected.id);
    const human = e.activeUnitType === 'hero' || (e.opponentControl === 'p2' && e.activeUnitType === 'enemy');
    const reachable = human && (e.actionPhase === 'move' ? !!move : e.actionPhase === 'action' ? !!attack : false);
    let reason = '';
    if (e.gameOver || e.disposed) reason = 'Combat terminé';
    else if (!human) reason = 'Tour de l’adversaire';
    else if (e.paused) reason = 'Combat en pause';
    else if (e.actionPhase === 'moving') reason = 'Déplacement en cours';
    else if (!selected?.walkable) reason = 'Surface impraticable';
    else if (e.actionPhase === 'move' && occupied) reason = 'Surface occupée';
    else if (!reachable) reason = e.actionPhase === 'move' ? 'Hors budget ou aucun passage praticable' : 'Hors portée ou ligne de vue obstruée';
    return {
      vertical: true, levels: this.levels(), visibleLevel: this.visibleLevel,
      battlefieldInfo: {
        id: e.battlefield.id, label: e.battlefield.label,
        universe: e.battlefield.source?.universe || e.stage.universe,
        work: e.battlefield.source?.work || '', location: e.battlefield.source?.location || '',
        objectiveText: { fr: e.getObjectiveText('fr'), en: e.getObjectiveText('en') }
      },
      selectedSurfaceId: this.selectedSurfaceId, revision: this.revision,
      selectedSurface: selected ? { ...cell(selected), id: selected.id, materialId: selected.materialId,
        type: selected.type, moveCost: move?.cost ?? selected.moveCost, reachable, reason,
        path: move?.path || [], transitions: move?.transitions || [] } : null,
      stackedSurfaces: selected ? getSurfacesAt(this.terrain, selected.x, selected.y).filter(s => this.isVisible(s.id)).map(s => ({
        id: s.id, surfaceId: s.id, x: s.x, y: s.y, z: s.z, materialId: s.materialId, type: s.type
      })) : []
    };
  }
  unitOccupies(unit, x, y, surfaceId) {
    if (!living(unit)) return false;
    const at = this.surface(unit), target = this.surface(surfaceId || { x, y });
    if (!at || !target || Math.abs(at.z - target.z) > 0.51) return false;
    const width = Math.max(1, Math.round(unit.tacticsFootprint?.width || 1));
    const height = Math.max(1, Math.round(unit.tacticsFootprint?.height || 1));
    const startX = Math.max(0, Math.min(this.terrain.cols - width, unit.gridX - Math.floor((width - 1) / 2)));
    const startY = Math.max(0, Math.min(this.terrain.rows - height, unit.gridY - Math.floor((height - 1) / 2)));
    return x >= startX && x < startX + width && y >= startY && y < startY + height;
  }
  entries(includeDead = false) {
    const e = this.engine;
    return [
      ...e.heroes.map(unit => ({ unit, type: 'hero' })),
      ...e.enemies.map(unit => ({ unit, type: 'enemy' })),
      ...(e.obstacles || []).map(unit => ({ unit, type: 'obstacle' })),
      ...(e.escortUnit ? [{ unit: e.escortUnit, type: 'escort' }] : []),
      ...(e.objective === 'protect' && e.protectedArtifact ? [{ unit: e.protectedArtifact, type: 'artifact' }] : [])
    ].filter(entry => living(entry.unit) || (includeDead && ['hero', 'enemy'].includes(entry.type)));
  }
  unitAt(x, y, surfaceId) {
    return this.entries().find(entry => this.unitOccupies(entry.unit, x, y, surfaceId)) || null;
  }
  occupied(x, y, ignoreUnit, surfaceId) {
    const surface = this.surface(surfaceId || { x, y });
    if (!surface?.walkable) return true;
    return this.entries().some(entry => entry.unit !== ignoreUnit && this.unitOccupies(entry.unit, x, y, surface.id));
  }
  moveCost(surface, unit) {
    const e = this.engine;
    if (surface.type === 'hazard' && (e.hazardsDisabled || e.enemies.includes(unit))) return 1;
    if (surface.type === 'portalSpawn' && e.enemies.includes(unit)) return 1;
    return surface.moveCost;
  }
  pathOptions(unit, destination = null) {
    return { unit,
      isOccupied: surface => surface.id !== destination && this.occupied(surface.x, surface.y, unit, surface.id),
      getMoveCost: surface => this.moveCost(surface, unit) };
  }
  reachable(unit, range) {
    return reachableTerrainSurfaces(this.terrain, unit, range, this.pathOptions(unit));
  }
  move(unit, destination, onComplete = null) {
    const start = this.surface(unit), target = this.surface(destination);
    if (!start || !target) return false;
    const route = findTerrainPath(this.terrain, start.id, target.id, this.pathOptions(unit));
    if (!route) return false;
    faceGridUnitToward(unit, target);
    unit.gridX = target.x; unit.gridY = target.y; unit.gridZ = target.z; unit.surfaceId = target.id;
    this.lastMove = { unitId: unit.runtimeId || unit.id, path: route.path, transitions: route.transitions, cost: route.cost };
    const points = route.path.map(id => this.surface(id));
    if (points.length <= 1) { onComplete?.(); return true; }
    unit.terrainRenderPosition = { x: start.x, y: start.y, z: getTerrainHeightAt(start), surfaceId: start.id };
    Object.assign(unit, this.project(start.x + 0.5, start.y + 0.5, getTerrainHeightAt(start)));
    unit.terrainMotion = { points, segment: 0, elapsed: 0, onComplete };
    unit.state = 'run'; unit.stateTimer = 0;
    return true;
  }
  updateMotions() {
    const e = this.engine;
    for (const unit of [...e.heroes, ...e.enemies, ...(e.escortUnit ? [e.escortUnit] : [])]) {
      if (unit.tacticsGuardTicks > 0) unit.tacticsGuardTicks--;
      if (unit.tacticsBuffTicks > 0) unit.tacticsBuffTicks--;
      const motion = unit.terrainMotion;
      if (!motion) continue;
      if (e.disposed || !living(unit)) {
        const support = this.surface(unit.terrainRenderPosition?.surfaceId);
        if (support) Object.assign(unit, { surfaceId: support.id, gridX: support.x, gridY: support.y, gridZ: support.z });
        delete unit.terrainMotion; delete unit.terrainRenderPosition;
        if (!living(unit)) { unit.state = 'dead'; unit.stateTimer = 999; }
        if (!e.disposed && !e.gameOver && unit === e.activeUnit) e.endActiveTurn();
        continue;
      }
      const from = motion.points[motion.segment], to = motion.points[motion.segment + 1];
      const duration = 10 + Math.ceil(Math.abs(from.z - to.z) * 5);
      const t = Math.min(1, ++motion.elapsed / duration);
      const x = from.x + (to.x - from.x) * t + 0.5, y = from.y + (to.y - from.y) * t + 0.5;
      const z = getTerrainHeightAt(t < 0.5 ? from : to, x, y);
      unit.terrainRenderPosition = { x: x - 0.5, y: y - 0.5, z, surfaceId: (t < 0.5 ? from : to).id };
      Object.assign(unit, this.project(x, y, z));
      if (t < 1) continue;
      motion.segment++; motion.elapsed = 0;
      if (motion.segment < motion.points.length - 1) continue;
      delete unit.terrainMotion;
      delete unit.terrainRenderPosition;
      Object.assign(unit, this.position(unit.gridX, unit.gridY, unit.surfaceId, true, true));
      unit.state = 'idle';
      motion.onComplete?.();
    }
  }
  attackDistance(from, to, profile) {
    const a = this.surface(from), b = this.surface(to);
    if (!a || !b) return Infinity;
    const dz = Math.abs(a.z - b.z);
    if (dz > (profile.maxVerticalRange ?? (profile.delivery === 'melee' ? 0.75 : Infinity))) return Infinity;
    const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
    if (profile.delivery === 'radial') return Math.hypot(dx, dy, dz);
    const planar = ['line', 'directional', 'cone', 'multiAxis'].includes(profile.shape) ? Math.max(dx, dy) : dx + dy;
    return Math.hypot(planar, dz);
  }
  lineOfSight(from, to, action = 'simple') {
    const e = this.engine;
    const profile = typeof action === 'object' ? action : e.getAttackProfile(from, action);
    return terrainLineOfSight(this.terrain, from, to, {
      eyeHeight: profile.eyeHeight ?? 1.1, targetHeight: profile.targetHeight ?? 0.9,
      obstacles: e.obstacles, units: [...e.heroes, ...e.enemies, ...(e.escortUnit ? [e.escortUnit] : [])],
      blocksOnUnits: profile.blocksOnUnits, pierceUnits: profile.pierceUnits,
      pierceObstacles: profile.pierceObstacles,
      pierceTerrain: profile.pierceTerrain === true
    });
  }
  attackRange() {
    const e = this.engine, unit = e.activeUnit;
    e.attackRange = [];
    if (!e.selectedAction || !unit) return;
    const profile = e.getAttackProfile(unit, e.selectedAction);
    if (e.selectedAction === 'defense' && profile.effect === 'guard' && profile.targetSide === 'self') {
      const surface = this.surface(unit);
      if (surface) e.attackRange = [cell(surface)];
      return;
    }
    e.attackRange = this.terrain.surfaces.filter(surface => {
      if (!e.canAttackCell(unit, cell(surface), profile)) return false;
      if (profile.effect === 'damage') return true;
      return this.supportEntries(unit, profile, e.activeUnitType).some(entry => entry.unit.surfaceId === surface.id);
    })
      .map(surface => ({ ...cell(surface), profile }));
  }
  supportEntries(attacker, profile, side) {
    const types = side === 'enemy' ? ['enemy'] : ['hero', 'escort'];
    return this.entries(profile.effect === 'revive').filter(entry => types.includes(entry.type)
      && (profile.effect === 'revive' ? !living(entry.unit) : living(entry.unit))
      && (profile.effect !== 'revive' || canOccupyTerrainSurface(this.terrain, entry.unit, this.pathOptions(entry.unit)))
      && (profile.targetSide !== 'self' || entry.unit === attacker)
      && (!profile.excludeSelf || entry.unit !== attacker));
  }
  impactCells(attacker, target, actionType) {
    const e = this.engine, profile = e.getAttackProfile(attacker, actionType);
    const origin = this.surface(attacker), anchor = this.surface(target);
    if (!origin || !anchor) return [];
    const clearFrom = (from, to) => terrainLineOfSight(this.terrain, from, to, {
      obstacles: e.obstacles, eyeHeight: 0.7, targetHeight: 0.7, pierceTerrain: profile.pierceTerrain === true
    });
    if (profile.shape === 'single') return [cell(anchor)];
    if (['multi', 'group'].includes(profile.shape)) {
      return this.terrain.surfaces.filter(surface => e.canAttackCell(attacker, cell(surface), profile)).map(cell);
    }
    if (['area', 'radial'].includes(profile.shape)) {
      const center = profile.shape === 'radial' ? origin : anchor;
      return this.terrain.surfaces.filter(surface => {
        const offsets = [surface.x - center.x, surface.y - center.y, surface.z - center.z];
        const distance = profile.delivery === 'radial' ? Math.hypot(...offsets) : Math.max(...offsets.map(Math.abs));
        const radius = profile.delivery === 'radial' ? Math.min(profile.areaRadius, profile.range) : profile.areaRadius;
        return distance <= radius && (profile.shape !== 'radial' || surface.id !== origin.id)
          && clearFrom(center.id, surface.id);
      }).map(cell);
    }
    const aim = Math.round(Math.atan2(anchor.y - origin.y, anchor.x - origin.x) / (Math.PI / 4) + 8) % 8;
    const offsets = [0], count = ['cone', 'multiAxis'].includes(profile.shape) ? profile.axes : 1;
    for (let i = 1; offsets.length < count; i++) {
      offsets.push(-i);
      if (offsets.length < count) offsets.push(i);
    }
    const result = new Map();
    for (const offset of offsets) {
      const [dx, dy] = rays[(aim + offset + 8) % 8];
      const planarAim = Math.max(1, Math.abs(anchor.x - origin.x), Math.abs(anchor.y - origin.y));
      for (let n = 1; n <= profile.range; n++) {
        const x = origin.x + dx * n, y = origin.y + dy * n;
        const expectedZ = origin.z + (anchor.z - origin.z) * n / planarAim;
        const surface = getSurfacesAt(this.terrain, x, y).find(s => Math.abs(s.z - expectedZ) <= 0.5);
        if (!surface || !this.lineOfSight(attacker, cell(surface), profile)) continue;
        const distance = this.attackDistance(attacker, cell(surface), profile);
        if (distance < profile.minRange || distance > profile.range) continue;
        result.set(surface.id, cell(surface));
        const occupant = this.unitAt(x, y, surface.id);
        if (occupant && profile.blocksOnUnits && !profile.pierceUnits) break;
      }
    }
    return [...result.values()];
  }
  resolution(attacker, target, actionType, attackerType) {
    const e = this.engine, profile = e.getAttackProfile(attacker, actionType);
    if (profile.effect !== 'damage') {
      const eligible = this.supportEntries(attacker, profile, attackerType)
        .filter(entry => e.canAttackCell(attacker, entry.unit, profile));
      const chosen = profile.shape === 'group' ? eligible
        : eligible.filter(entry => entry.unit.surfaceId === target.surfaceId);
      const candidates = chosen.map((entry, order) => ({ ...entry, cell: cell(this.surface(entry.unit)), order }));
      return { profile, validTypes: attackerType === 'enemy' ? ['enemy'] : ['hero', 'escort'],
        impactCells: candidates.map(entry => entry.cell),
        clickedUnit: candidates.find(entry => entry.unit.surfaceId === target.surfaceId)?.unit || null, candidates };
    }
    const validTypes = e.getValidAttackTargetTypes(attackerType);
    const impactCells = this.impactCells(attacker, target, actionType);
    const clickedEntry = this.unitAt(target.gridX ?? target.x, target.gridY ?? target.y, target.surfaceId);
    const clickedUnit = clickedEntry && validTypes.includes(clickedEntry.type) ? clickedEntry.unit : null;
    const seen = new Set(), candidates = [];
    impactCells.forEach((entry, order) => {
      const found = this.unitAt(entry.x, entry.y, entry.surfaceId);
      if (!found || !validTypes.includes(found.type) || seen.has(found.unit)) return;
      seen.add(found.unit);
      candidates.push({ ...found, cell: entry, order });
    });
    return { profile, validTypes, impactCells, clickedUnit,
      candidates: e.orderAttackTargetCandidates(attacker, target, profile, candidates, clickedUnit) };
  }
  anchorFor(attacker, target, action = 'simple', side = 'hero') {
    const e = this.engine, support = this.surface(target);
    if (!support) return null;
    const profile = e.getAttackProfile(attacker, action);
    const candidates = [...this.terrain.surfaces].sort((a, b) => Math.hypot(a.x - support.x, a.y - support.y, a.z - support.z)
      - Math.hypot(b.x - support.x, b.y - support.y, b.z - support.z));
    return candidates.map(cell).find(anchor => e.canAttackCell(attacker, anchor, profile)
      && e.getAttackTargets(attacker, anchor, action, side).some(entry => entry.unit === target)) || null;
  }
  applyAttack(attacker, target, action, damage, status, side) {
    const e = this.engine, profile = e.getAttackProfile(attacker, action);
    const targets = e.getAttackTargets(attacker, target, action, side);
    if (!e.canAttackCell(attacker, target, profile)) return [];
    const applied = [];
    for (const { unit } of targets) {
      if (profile.effect === 'revive' && (!canOccupyTerrainSurface(this.terrain, unit, this.pathOptions(unit)) || living(unit))) continue;
      applied.push({ unit, type: targets.find(entry => entry.unit === unit)?.type, cell: cell(this.surface(unit)) });
      if (profile.effect === 'damage') {
        e.applyDamage(attacker, unit, damage, status || profile.statusEffect, { actionType: action });
        continue;
      }
      const ticks = Math.max(1, Math.round((profile.effectDuration || profile.duration || 2) * 60));
      if (profile.effect === 'heal') unit.currentHp = Math.min(unit.maxHp, unit.currentHp + Math.round(unit.maxHp * (profile.healRatio || 0.15)));
      if (profile.effect === 'revive') { unit.currentHp = Math.max(1, Math.round(unit.maxHp * (profile.reviveRatio || 0.3))); unit.state = 'idle'; }
      if (profile.effect === 'guard') { unit.tacticsGuardTicks = ticks; unit.tacticsGuardReduce = profile.guardReduce ?? 0.3; }
      if (profile.effect === 'buff') { unit.tacticsBuffTicks = ticks; unit.tacticsBuffMultiplier = profile.buffMultiplier || 1.12; }
      if (profile.effect === 'cleanse' || profile.cleanses) {
        for (const key of Object.keys(unit.statusEffects || {})) unit.statusEffects[key] = 0;
      }
      e.particles.add(unit.x, unit.y - 25, 0, -1, '#83e6cc', 10, 36, 'text',
        profile.effect === 'heal' ? '+HP' : profile.effect === 'guard' ? 'GARDE' : 'SOUTIEN');
    }
    return applied;
  }
  threats() {
    const e = this.engine, result = new Map();
    const profileSignature = e.enemies.map(unit => {
      const p = e.getAttackProfile(unit, 'enemy');
      return [p.effect, p.delivery, p.shape, p.range, p.minRange, p.areaRadius, p.axes,
        p.directions, p.maxTargets, p.pierceUnits, p.pierceObstacles, p.pierceTerrain, p.blocksOnUnits].join(':');
    }).join('|');
    const signature = profileSignature + this.entries().map(entry => [entry.type, entry.unit.id, entry.unit.surfaceId,
      entry.unit.tacticsHeight, entry.unit.tacticsFootprint?.width, entry.unit.tacticsFootprint?.height,
      entry.unit.currentHp > 0 || entry.unit.hp > 0].join(':')).join('|');
    if (signature === this.threatSignature && this.threatCache) return this.threatCache;
    e.enemyThreatCells = new Map();
    for (const enemy of e.enemies.filter(living)) {
      const affected = new Map(), profile = e.getAttackProfile(enemy, 'enemy');
      if (profile.effect !== 'damage') { e.enemyThreatCells.set(enemy, affected); continue; }
      for (const support of this.terrain.surfaces) {
        const anchor = cell(support);
        if (!e.canAttackCell(enemy, anchor, profile)) continue;
        for (const impacted of this.threatCells(enemy, anchor, 'enemy', 'enemy')) affected.set(impacted.surfaceId, impacted);
      }
      for (const [id, impacted] of affected) result.set(id, { ...impacted, count: (result.get(id)?.count || 0) + 1 });
      e.enemyThreatCells.set(enemy, affected);
    }
    this.threatSignature = signature; this.threatCache = result;
    return result;
  }
  threatCells(attacker, target, action, side) {
    const e = this.engine, context = this.resolution(attacker, target, action, side);
    if (!Number.isFinite(context.profile.maxTargets)) return context.impactCells;
    const selected = new Set(context.candidates.slice(0, context.profile.maxTargets).map(entry => entry.unit));
    return context.impactCells.filter((impact, order) => {
      const found = this.unitAt(impact.x, impact.y, impact.surfaceId);
      if (found) return context.validTypes.includes(found.type) && selected.has(found.unit);
      const probe = { unit: {}, type: side === 'enemy' ? 'hero' : 'enemy', cell: impact, order };
      const clicked = impact.surfaceId === target.surfaceId ? probe.unit : context.clickedUnit;
      const ordered = e.orderAttackTargetCandidates(attacker, target, context.profile, [...context.candidates, probe], clicked);
      return ordered.indexOf(probe) < context.profile.maxTargets;
    });
  }
  heightModifier(attacker, defender) {
    const result = terrainHeightAdvantage(this.terrain, attacker, defender);
    if (this.surface(attacker)?.type === 'hazard' && !this.engine.hazardsDisabled) {
      return { ...result, multiplier: result.multiplier - 0.12, labels: [...result.labels, 'RISK'] };
    }
    return result;
  }
  coverReduction(attacker, defender, action) {
    if (action === 'special') return 0.15;
    if (this.attackDistance(attacker, defender, { delivery: 'ranged' }) <= 1) return 0;
    return terrainCoverReduction(this.terrain, attacker, defender);
  }
  focusCells(side = 'hero') {
    const e = this.engine;
    if (['extract', 'escort'].includes(e.objective)) {
      if (side === 'enemy' && e.objective === 'escort' && living(e.escortUnit)) return [cell(this.surface(e.escortUnit))];
      return (e.battlefield.extractionZone || []).map(ref => this.surface(ref)).filter(Boolean).map(cell);
    }
    if (e.objective === 'protect') return e.protectedArtifact ? [cell(this.surface(e.protectedArtifact))] : [];
    if (['commander', 'overload', 'disable'].includes(e.objective)) {
      const list = e.objective === 'disable' ? e.obstacles.filter(unit => unit.type === 'objective') : e.enemies.filter(unit => unit.isBoss);
      return list.filter(living).map(unit => cell(this.surface(unit)));
    }
    const type = { control: 'objective', portals: 'portalSpawn', artifact: 'artifact' }[e.objective];
    return this.terrain.surfaces.filter(surface => type ? surface.type === type
      : e.objective === 'survive' && ['heal', 'heavyCover', 'lightCover'].includes(surface.type))
      .filter(surface => !e.sealedPortalKeys.has(surface.id) && !e.collectedArtifactKeys.has(surface.id)).map(cell);
  }
  closestObjective(unit, side) {
    return this.focusCells(side).map(goal => {
      const route = findTerrainPath(this.terrain, unit, goal, this.pathOptions(unit, goal.surfaceId));
      return route ? { ...goal, dist: route.cost } : null;
    }).filter(Boolean).sort((a, b) => a.dist - b.dist)[0] || null;
  }
  openSpawn(spawns) {
    const candidates = [...this.terrain.surfaces.filter(surface => surface.type === 'portalSpawn' && !this.engine.sealedPortalKeys.has(surface.id)),
      ...spawns.map(spawn => this.surface(spawn)).filter(Boolean)];
    const available = candidates.find(surface => canOccupyTerrainSurface(this.terrain, surface.id, this.pathOptions({})));
    return available ? cell(available) : null;
  }
  hazardPulse() {
    const e = this.engine;
    if (e.hazardsDisabled) return;
    const hazards = this.terrain.surfaces.filter(surface => surface.type === 'hazard');
    for (const surface of hazards) {
      for (const unit of [...e.heroes, ...e.enemies].filter(living)) {
        const target = this.surface(unit);
        if (!target || Math.hypot(target.x - surface.x, target.y - surface.y, target.z - surface.z) > (e.missionProfile.hazardRadius || 0)) continue;
        if (!terrainLineOfSight(this.terrain, surface.id, target.id, { eyeHeight: 0.1, targetHeight: 0.1 })) continue;
        unit.currentHp = Math.max(unit.isBoss ? 1 : 0, unit.currentHp - (8 + e.missionProfile.pressure * 2));
      }
    }
    if (hazards.length) e.hazardPulses++;
  }
  barrelExplosion(x, y, surfaceId) {
    const e = this.engine, origin = this.surface(surfaceId || { x, y });
    if (!origin) return;
    const point = this.position(x, y, origin.id);
    e.particles.add(point.x, point.y, 0, 0, '#ff4500', 80, 30, 'glitch');
    const attacker = { gridX: x, gridY: y, surfaceId: origin.id, stats: { atk: 1 } };
    for (const entry of this.entries()) {
      const target = this.surface(entry.unit);
      if (!target || (entry.type === 'obstacle' && target.id === origin.id)) continue;
      if (Math.hypot(target.x - x, target.y - y, target.z - origin.z) > 1.5) continue;
      if (!terrainLineOfSight(this.terrain, origin.id, target.id, { eyeHeight: 0.6, targetHeight: 0.6 })) continue;
      e.applyDamage(attacker, entry.unit, 100, null, { ignoreCover: true });
    }
  }
  itemDistance(origin, unit) {
    const a = this.surface(origin), b = this.surface(unit);
    if (!a || !b || !terrainLineOfSight(this.terrain, a.id, b.id, { eyeHeight: 0.8, targetHeight: 0.8 })) return Infinity;
    return Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
  }
  zoomAt(factor, x, y) {
    const e = this.engine;
    if (!Number.isFinite(factor) || factor <= 0) return e.getCameraState();
    const oldZoom = e.cameraZoom, next = Math.max(e.minCameraZoom, Math.min(e.maxCameraZoom, oldZoom * factor));
    if (next === oldZoom) return e.getCameraState();
    const relativeX = (x - e.gridStartX) / oldZoom, relativeY = (y - e.gridStartY) / oldZoom;
    e.cameraZoom = next; e.cellW = e.baseCellW * next; e.cellH = e.baseCellH * next;
    e.gridStartX = x - relativeX * next; e.gridStartY = y - relativeY * next;
    e.clampCamera(); e.syncActorsToCamera();
    return e.getCameraState();
  }
  handleClick(x, y, surfaceId) {
    const e = this.engine, surface = this.surface(surfaceId || { x, y });
    const human = e.activeUnitType === 'hero' || (e.activeUnitType === 'enemy' && e.opponentControl === 'p2');
    if (e.gameOver || e.disposed || e.paused || !human || !living(e.activeUnit)) return { handled: false, reason: 'inactive' };
    if (!surface || !this.isVisible(surface.id)) return { handled: false, reason: 'ambiguous-or-hidden-surface' };
    this.select(surface.id);
    const unit = e.activeUnit;
    if (e.actionPhase === 'move') {
      const entry = this.reachable(unit, Math.max(0, e.movementBudget - e.movementSpent)).find(candidate => candidate.surfaceId === surface.id);
      if (!entry) return { handled: false, reason: 'blocked' };
      e.actionPhase = 'moving';
      e.movementSpent += entry.cost;
      const onComplete = () => {
        if (e.disposed || e.gameOver || !living(unit)) return;
        e.applyStartTileEffect(unit);
        if (e.gameOver) return;
        if (!living(unit)) { e.endActiveTurn(); return; }
        e.actionPhase = 'action'; e.selectedAction = 'simple'; e.selectedActionExplicit = false;
        e.calculateAttackRange();
      };
      this.move(unit, surface.id, onComplete);
      e.playSfx('jump');
      return { handled: true, type: 'move', unit, ...cell(surface), cost: entry.cost, path: entry.path };
    }
    if (e.actionPhase !== 'action') return { handled: false, reason: 'moving' };
    const action = e.selectedAction;
    const profile = e.getAttackProfile(unit, action);
    e.calculateAttackRange();
    if (!e.attackRange.some(entry => entry.surfaceId === surface.id)) return { handled: false, reason: 'out-of-range' };
    if (action === 'defense' && profile.effect === 'guard' && profile.targetSide === 'self') {
      if (e.activeUnitType === 'enemy') e.normalizeEnemyActions(unit);
      const guard = this.ability(unit, 'defense');
      unit.defense = { ...unit.defense, reduce: guard?.guardReduce ?? unit.defense?.reduce ?? 0.4 };
      unit.state = 'defense'; unit.stateTimer = (guard?.effectDuration || unit.defense?.dur || 1.2) * 60;
      unit.specialCharge = Math.min(100, (unit.specialCharge || 0) + 10);
      e.playSfx('shield'); e.endActiveTurn();
      return { handled: true, type: 'defense', unit };
    }
    const targets = e.getAttackTargets(unit, cell(surface), action, e.activeUnitType);
    if (!targets.length) return { handled: false, reason: 'no-valid-target' };
    if (action === 'secondary' && unit.cooldown > 0) return { handled: false, reason: 'cooldown' };
    if (action === 'special' && (unit.specialCharge || 0) < 100) return { handled: false, reason: 'charge' };
    if (action === 'special') unit.specialCharge = 0;
    else unit.specialCharge = Math.min(100, (unit.specialCharge || 0) + (action === 'defense' ? 10 : action === 'secondary' ? 25 : 15));
    if (action === 'secondary') unit.cooldown = (unit.secondary?.cd || 3) * 60;
    faceGridUnitToward(unit, surface);
    unit.state = action === 'special' ? 'special' : profile.effect === 'damage' ? 'attack' : 'idle';
    unit.stateTimer = action === 'special' ? 35 : 25;
    if (action === 'special') unit.tacticsPresentationTicks = 35;
    e.playSfx(profile.effect === 'damage' ? action === 'special' ? 'special' : 'shoot' : 'shield');
    e.applyProfiledAttack(unit, cell(surface), action, e.getActionBaseDamage(unit, action), null, e.activeUnitType);
    e.endActiveTurn();
    return { handled: true, type: 'action', action, target: targets[0], targets };
  }
  push(unit, distance) {
    const direction = Math.sign(distance);
    for (let step = 0; step < Math.abs(distance); step++) {
      const candidates = getTerrainNeighbors(this.terrain, unit, this.pathOptions(unit))
        .filter(entry => entry.x === unit.gridX + direction && entry.y === unit.gridY && entry.kind === 'walk');
      if (!candidates.length) break;
      const next = candidates.sort((a, b) => Math.abs(a.z - unit.gridZ) - Math.abs(b.z - unit.gridZ))[0];
      unit.gridX = next.x; unit.gridY = next.y; unit.gridZ = next.z; unit.surfaceId = next.surfaceId;
    }
  }
  runAI(side) {
    const e = this.engine, unit = e.activeUnit;
    if (e.disposed || e.gameOver || !unit || !living(unit)) return;
    const opponents = side === 'hero' ? e.enemies : [...e.heroes, ...(e.objective === 'protect' && e.protectedArtifact ? [e.protectedArtifact] : []), ...(e.escortUnit ? [e.escortUnit] : [])];
    const action = side === 'enemy' ? 'enemy' : unit.specialCharge >= 100 ? 'special' : unit.cooldown <= 0 ? 'secondary' : 'simple';
    const profile = e.getAttackProfile(unit, action);
    const targets = profile.effect === 'damage' ? opponents.filter(living)
      : this.supportEntries(unit, profile, side).map(entry => entry.unit);
    const remaining = Math.max(0, e.movementBudget - e.movementSpent);
    const reachable = this.reachable(unit, remaining);
    const goals = e.getObjectiveFocusCells(side).map(ref => this.surface(ref)).filter(Boolean);
    let best = reachable[0], bestScore = -Infinity;
    for (const candidate of reachable) {
      const simulated = { ...unit, gridX: candidate.x, gridY: candidate.y, gridZ: candidate.z, surfaceId: candidate.surfaceId, _tacticsSourceUnit: unit };
      let score = -candidate.cost * 0.15;
      let distance = Infinity;
      for (const target of targets) {
        if (this.anchorFor(simulated, target, action, side)) score += 40;
        const path = findTerrainPath(this.terrain, candidate.surfaceId, target.surfaceId, this.pathOptions(unit, target.surfaceId));
        if (path) distance = Math.min(distance, path.cost);
      }
      if (Number.isFinite(distance)) score -= distance * 2;
      for (const goal of goals) {
        const path = findTerrainPath(this.terrain, candidate.surfaceId, goal.id, this.pathOptions(unit, goal.id));
        if (path) score += candidate.surfaceId === goal.id ? 30 : Math.max(-20, 12 - path.cost * 3);
      }
      const support = this.surface(candidate);
      if (support?.type === 'hazard' && !e.hazardsDisabled) score -= 8;
      if (score > bestScore) { best = candidate; bestScore = score; }
    }
    const attack = () => {
      if (e.disposed || e.gameOver || !living(unit)) return;
      e.applyStartTileEffect(unit);
      if (e.gameOver) return;
      if (!living(unit)) { e.endActiveTurn(); return; }
      const shot = targets.filter(target => profile.effect === 'revive' ? !living(target) : living(target))
        .map(target => ({ target, anchor: this.anchorFor(unit, target, action, side) })).find(entry => entry.anchor);
      if (shot) {
        if (side === 'hero' && action === 'special') unit.specialCharge = 0;
        if (side === 'hero' && action === 'secondary') unit.cooldown = (unit.secondary?.cd || 3) * 60;
        faceGridUnitToward(unit, shot.anchor);
        unit.state = action === 'special' ? 'special' : profile.effect === 'damage' ? 'attack' : 'idle';
        unit.stateTimer = action === 'special' ? 35 : 25;
        if (action === 'special') unit.tacticsPresentationTicks = 35;
        e.applyProfiledAttack(unit, shot.anchor, action, e.getActionBaseDamage(unit, action), null, side);
        if (action !== 'special') unit.specialCharge = Math.min(100, (unit.specialCharge || 0) + 15);
      }
      e.endActiveTurn();
    };
    e.actionPhase = 'moving';
    if (!best) { attack(); return; }
    e.movementSpent += best.cost;
    this.move(unit, best.surfaceId, attack);
  }
  objectiveContains(zone, unit) {
    const target = this.surface(zone);
    return !!target && this.unitOccupies(unit, target.x, target.y, target.id);
  }
  advanceEscort() {
    const e = this.engine, escort = e.escortUnit;
    if (e.objective !== 'escort' || !living(escort) || escort.terrainMotion) return;
    const nearby = e.heroes.some(hero => living(hero) && getTerrainNeighbors(this.terrain, escort, { unit: escort })
      .some(neighbor => neighbor.surfaceId === hero.surfaceId));
    if (!nearby) return;
    const routes = (e.battlefield.extractionZone || []).map(goal => findTerrainPath(this.terrain, escort, goal, this.pathOptions(escort)))
      .filter(Boolean).sort((a, b) => a.cost - b.cost);
    const route = routes[0];
    if (!route) return;
    if (route.path.length <= 1) { e.updateTacticsObjective(); return; }
    this.move(escort, route.path[1], () => { escort.state = 'idle'; e.updateTacticsObjective(); });
  }
  draw(ctx, time) {
    const e = this.engine;
    const threatMap = e.getEnemyThreatMap();
    const movement = new Map((e.actionPhase === 'move' ? e.movementRange : []).map(entry => [entry.surfaceId, entry]));
    const attacks = new Set((e.actionPhase === 'action' ? e.attackRange : []).map(entry => entry.surfaceId));
    const objectiveIds = new Set(e.getObjectiveFocusCells('hero').map(ref => this.surface(ref)?.id).filter(Boolean));
    const selected = this.viewState().selectedSurface;
    const previewPath = new Set(selected?.path || []);
    const actors = e.getTacticsDrawOrder()
      .filter(entry => this.isVisible(entry.unit.terrainRenderPosition?.surfaceId || entry.unit.surfaceId))
      .map(entry => {
        const unit = entry.unit, render = unit.terrainRenderPosition;
        const scale = e.getUnitRenderScale(unit.gridY), radius = (unit.isBoss ? 90 : 44) * scale;
        return {
          surfaceId: render?.surfaceId || unit.surfaceId, x: render?.x ?? unit.gridX,
          y: render?.y ?? unit.gridY, z: render?.z ?? unit.gridZ, height: unit.tacticsHeight || 1.6,
          bounds: { left: unit.x - radius, right: unit.x + radius, top: unit.y - radius * 1.6, bottom: unit.y + 12 * scale },
          draw: () => e.drawTacticsUnit(ctx, entry, time)
        };
      });
    for (const obstacle of e.obstacles.filter(living)) {
      const support = this.surface(obstacle);
      if (!support || !this.isVisible(support.id)) continue;
      const point = this.position(support.x, support.y, support.id);
      const sceneryWidth = e.cellW * 0.75;
      const sceneryHeight = Math.max(12, (obstacle.tacticsHeight || 1.2) * e.cellH * 0.74);
      actors.push({ surfaceId: support.id, x: support.x, y: support.y, z: support.z, height: obstacle.tacticsHeight || 1.2,
        ...(obstacle.sceneryKind ? { bounds: getTacticsSceneryBounds(obstacle, point, sceneryWidth, sceneryHeight) } : {}), draw: () => {
        const point = this.position(support.x, support.y, support.id);
        const size = e.cellW * 0.42, height = e.cellH * 0.65;
        const sceneryDrawn = drawTacticsScenery(ctx, { obstacle, point, width: sceneryWidth, height: sceneryHeight });
        if (!sceneryDrawn) {
          ctx.fillStyle = obstacle.color || '#667788'; ctx.fillRect(point.x - size / 2, point.y - height, size, height);
          ctx.strokeStyle = '#a7c3ce'; ctx.strokeRect(point.x - size / 2, point.y - height, size, height);
        }
        const barY = point.y - (sceneryDrawn ? sceneryHeight : height) - 5;
        ctx.fillStyle = '#121d26'; ctx.fillRect(point.x - size / 2, barY, size, 3);
        ctx.fillStyle = '#8bc9dd'; ctx.fillRect(point.x - size / 2, barY, size * obstacle.hp / obstacle.maxHp, 3);
      } });
    }
    drawTacticsTerrain(ctx, this.terrain, {
      project: this.project, cutLevel: this.visibleLevel, actors,
      drawSurfaceOverlay: (context, surface) => {
        const polygon = getSurfacePolygon(surface, this.project, 2);
        if (!polygon.length) return;
        const paint = color => { e.tracePolygonPath(context, polygon); context.fillStyle = color; context.fill(); };
        if (objectiveIds.has(surface.id)) paint('rgba(255,216,86,0.18)');
        if (threatMap.has(surface.id)) paint('rgba(242,96,64,0.19)');
        if (movement.has(surface.id)) paint('rgba(74,216,156,0.22)');
        if (attacks.has(surface.id)) paint('rgba(255,112,115,0.23)');
        const point = this.position(surface.x, surface.y, surface.id);
        if (surface.id === this.selectedSurfaceId) {
          e.tracePolygonPath(context, polygon); context.strokeStyle = '#fff3b5'; context.lineWidth = 2.5; context.stroke();
        }
        context.fillStyle = 'rgba(235,247,255,0.62)'; context.font = Math.max(8, Math.round(9 * e.cameraZoom)) + 'px monospace';
        context.fillText(String.fromCharCode(65 + surface.x) + (surface.y + 1), polygon[0].x + 4, polygon[0].y + 11);
        const route = movement.get(surface.id);
        if (route?.cost) { context.fillStyle = '#c1ffe0'; context.fillText(route.cost + ' PA', point.x - 12, point.y + 7); }
        if (previewPath.has(surface.id) && selected?.path.length > 1 && e.actionPhase === 'move') {
          context.save();
          e.tracePolygonPath(context, getSurfacePolygon(surface, this.project));
          context.clip(); context.lineWidth = 2; context.strokeStyle = '#b8ffe2';
          context.setLineDash?.([4, 4]); context.beginPath();
          selected.path.forEach((id, index) => {
            const support = this.surface(id), step = this.position(support.x, support.y, id);
            if (index === 0) context.moveTo(step.x, step.y); else context.lineTo(step.x, step.y);
          });
          context.stroke(); context.restore();
        }
      }
    });
    e.drawTurnTimeline(ctx);
    e.drawTacticsObjectiveHud(ctx);
    ctx.fillStyle = e.getBattlefieldAccent(); ctx.font = '10px monospace';
    ctx.fillText(e.battlefield.label?.fr || e.battlefield.id, 16, 20);
  }
}
