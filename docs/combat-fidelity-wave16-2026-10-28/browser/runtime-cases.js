import { EngineFighter } from '/src/game/engineFighter.js';
import { EngineRpg } from '/src/game/engineRpg.js';
import { EngineSmash } from '/src/game/engineSmash.js';
import { HEROES_DB } from '/src/game/heroes.js';
import { ENEMIES_DB } from '/src/game/enemies.js';
import { resolveMeleeSuper } from '/src/game/combatIdentity.js';
import { getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '/src/game/combat/characterAnimationCatalog.js';
import { drawPixelSprite, preloadSpriteSheetSrcs } from '/src/game/renderer.js';
import { getCharacterSuperVisualState, preloadCharacterSuperAssets } from '/src/game/combat/characterSuperVisuals.js';
import { getHeroSpriteSheetSrc } from '/src/game/spriteAssets.js';
import { getSourceProtectionEntityFrameWave16, getSourceProtectionEntityAssetsWave16 } from '/src/game/combat/sourceProtectionEntityCatalogWave16.js';
import { drawSourceCombatStatusWave16 } from '/src/game/combat/sourceCombatRuntimeWave16.js';
import { getSourceHitSequenceWave16 } from '/src/game/combat/combatHitSequenceWave16.js';
import { WAVE_16_EFFECTIVE_IDS } from '/src/game/combat/cohortWave16.js';
const noop = () => {}, must = (value, message) => { if (!value) throw new Error(message); };
const dummy = id => ({ id, name: id, universe: 'W16 explicit runtime fixture', weaponType: 'melee',
 stats: { hp: 10000, atk: 10, def: 2, spd: 1 }, simple: { name: 'Contact fixture', type: 'melee', dmg: 1 },
 secondary: { name: 'Secondary fixture', type: 'projectile', dmg: 1 }, defense: { name: 'Guard fixture', type: 'guard', reduce: .4, dur: 1 },
 special: { name: 'Special fixture', type: 'melee', dmg: 1 } });
const runtimeId = actor => actor.battleId || actor.runtimeId || actor.id;
export async function runWave16RuntimeCases({ ids = WAVE_16_EFFECTIVE_IDS, browser = true } = {}) {
 const results = [], failures = [], sourceDraws = [];
 let grid, gc, canvas, ctx, companionGrid, companionGc;
 if (browser) {
  grid = document.createElement('canvas'); grid.width = 1440; grid.height = ids.length * 240; gc = grid.getContext('2d');
  companionGrid = document.createElement('canvas'); companionGrid.width = 3840; companionGrid.height = 1440; companionGc = companionGrid.getContext('2d');
  canvas = document.createElement('canvas'); canvas.width = 480; canvas.height = 480; ctx = canvas.getContext('2d');
  const original = ctx.drawImage.bind(ctx);
  ctx.drawImage = (image, ...args) => { const matrix = ctx.getTransform(); sourceDraws.push({ sheet: new URL(image.currentSrc || image.src, location.href).pathname,
    args, transform: { a: matrix.a, d: matrix.d, e: matrix.e, f: matrix.f } }); return original(image, ...args); };
 }
 for (const [heroIndex, id] of ids.entries()) for (const [modeIndex, mode] of ['fighter', 'rpg', 'melee'].entries()) for (const [sideIndex, side] of ['player', 'opponent'].entries()) {
  let engine;
  try {
   const hero = HEROES_DB.find(hero => hero.id === id); must(hero, id + ': missing hero');
   const slig = id === 'oddworld_abe_possession' ? ENEMIES_DB.Oddworld.monsters.find(enemy => enemy.id === 'oddworld_slig') : null;
   const target = slig ? { ...slig, stats: { hp: slig.hp, atk: slig.atk, def: slig.def || 0, spd: slig.spd } } : dummy('first-target');
   if (id === 'akane_tsunemori') target.paralyzerEligible = true; // explicit admission fixture, never inferred from a roster name.
   const own = [hero, dummy('ally')], other = [target, dummy('second-target')];
   const players = side === 'player' ? own : other, opponents = side === 'opponent' ? own : other;
   const particles = { add: noop }, stage = { universe: 'Nexus de Convergence', mode: 'Smash', disableHazards: true,
    customBattle: { singleRoster: true, opponentControl: 'p2' } };
   engine = mode === 'fighter' ? new EngineFighter(1100, 700, players, opponents, particles, noop, noop, { opponentControl: 'p2' })
    : mode === 'rpg' ? new EngineRpg(1100, 700, players, { monsters: opponents, bosses: [], customRoster: opponents }, particles, noop, noop, stage)
    : new EngineSmash(1100, 700, players, { monsters: opponents, bosses: [], customRoster: opponents }, particles, noop, noop, stage);
   if (mode === 'fighter') engine.countdown = 0;
   else if (mode === 'rpg') { engine.autoBattle = false; engine.enemyGlobalRecovery = 0; }
   else { engine.syncPreMatchFromServer(3000); engine.completeMeleeIntros(); }
   const allies = mode === 'fighter' ? engine.getTeam(side === 'player' ? 'player' : 'cpu').fighters : side === 'player' ? engine.heroes : engine.enemies;
   const targets = mode === 'fighter' ? engine.getTeam(side === 'player' ? 'cpu' : 'player').fighters : side === 'player' ? engine.enemies : engine.heroes;
   const actor = allies[0], direction = side === 'player' ? 1 : -1;
   for (const [index, unit] of [...allies, ...targets].entries()) {
    unit.currentHp = 4500; unit.maxHp = 10000; unit.state = 'idle'; unit.action = null; unit.stateTimer = 0;
    unit.atb = 0; unit.specialCharge = 100; unit.meter = 100; unit.cooldown = 0; unit.recoveryLock = 0;
    unit.x = 420 + direction * (index < allies.length ? -index * 70 : (index - allies.length + 1) * 100);
    unit.y = mode === 'fighter' ? engine.groundY : mode === 'melee' ? engine.arena.groundY : 500;
    unit.homeX = unit.x; unit.homeY = unit.y; unit.facing = index < allies.length ? direction : -direction;
   }
   if (browser) preloadCharacterSuperAssets([actor]);
   const profile = resolveMeleeSuper(actor); must(profile?.sourceHeroId === id, id + ': wrong source profile');
   if (profile.effect === 'revive') { allies[1].currentHp = 0; allies[1].state = 'dead'; }
   if (profile.effect === 'cleanse') allies.forEach(unit => { unit.statusEffects ||= {}; unit.statusEffects.infected = 120; });
   if (id === 'bt_7274_tf2' && mode === 'fighter') targets[0].x = actor.x + direction * 390;
   const physicalProjectiles = [];
   if (mode === 'fighter') {
    const spawn = engine.spawnProjectile.bind(engine);
    engine.spawnProjectile = (source, action) => {
      const value = spawn(source, action), projectile = engine.projectiles.at(-1);
      if (source === actor && projectile) {
        const visual = getCharacterSuperVisualState({ actor: source, profile: action.identity, action,
          target: targets[0], height: 142, projectileVisual: { phase: 'launch' } });
        physicalProjectiles.push({ index: action.sequenceIndex ?? 0, sourceElapsed: action.elapsed,
          nativeColumn: visual?.nativeAnchor?.col ?? null, nativeMuzzleActive: !!visual?.nativeMuzzleActive,
          physicalOrigin: { x: projectile.x, y: projectile.y }, nativeOrigin: visual?.origin || null,
          nativePoint: visual?.nativeAnchor?.nativePoint || null, velocity: { x: projectile.vx, y: projectile.vy || 0 },
          maxRange: projectile.maxRange, side: projectile.side,
          measuredError: visual?.nativeMuzzleActive ? Math.hypot(projectile.x - visual.origin.x, projectile.y - visual.origin.y) : null });
        must(visual?.nativeMuzzleActive && visual.nativeAnchor.col === 2, id + ': physical projectile released without its measured native release emitter');
        must(physicalProjectiles.at(-1).measuredError < 1e-8, id + ': physical muzzle differs from native artwork');
      }
      return value;
    };
   }
   const steps = [], events = [], method = mode === 'fighter' ? 'applyHit' : 'applyDamage', original = engine[method].bind(engine);
   engine[method] = (source, victim, ...args) => { const before = victim.currentHp, value = original(source, victim, ...args);
    if (source === actor && victim.currentHp < before) events.push({ targetId: runtimeId(victim), damage: before - victim.currentHp }); return value; };
   const meter = value => { if (mode === 'fighter') actor.meter = value; else { actor.specialCharge = value; actor.atb = 100; } };
   const commit = () => mode === 'fighter' ? engine.tryAction(actor.side, 'super') : mode === 'melee' ? engine.triggerMeleeSuper(actor)
    : side === 'player' ? engine.triggerAbility(actor, 'special', engine.chooseDefaultTargets(engine.getActionContext(actor, 'special', 'player')))
     : engine.triggerEnemyAbility(actor, 'special', engine.chooseDefaultTargets(engine.getActionContext(actor, 'special', 'enemy')));
   meter(99); must(!commit(), `${id}/${mode}/${side}: accepted99`); meter(100); must(commit(), `${id}/${mode}/${side}: rejected source cast`);
   steps.push({ tick: 0, event: 'commit', accepted: true, paid: 100 }); must(!commit(), id + ': duplicate cast');
   const beforeTargetHp = targets.map(unit => unit.currentHp), beforeAllyHp = allies.map(unit => unit.currentHp);
   const sequenceDefinition = getSourceHitSequenceWave16(profile);
   const sequenceAction = mode === 'rpg' ? actor.rpgSourceSequence : actor.action;
   const protectionCompanion = id === 'cuphead_ms_chalice' ? { sheet: getSourceProtectionEntityAssetsWave16()[0]?.sheet || null,
    actualFrameIndices: [], phases: [], actualSheetDraws: [], persistentBeforeHit: false, pauseStable: false,
    removedAfterDeparture: false, noDuplicateDuringNativeCast: true, facing: direction, consumedOnce: false } : null;
   const seenProtectionCells = new Set(); let protectionHitInjected = false;
   const sequenceDraws = [], seenSequenceFrames = new Set(), readySheets = new Set();
   const viewOf = () => mode === 'rpg' ? engine.getRpgPresentationActor(actor) : mode === 'melee' ? engine.getMeleeVisualActor(actor) : actor;
   const advance = async () => {
    if (mode === 'fighter') engine.update(1 / 60); else engine.update();
    if (browser && protectionCompanion) {
      const height = mode === 'fighter' ? 142 : mode === 'rpg' ? 72 * engine.getDepthScale(actor.y) : 72;
      const visual = actor.sourceProtectionEntityWave16, frame = getSourceProtectionEntityFrameWave16(actor, height);
      if (visual?.awaitingCasterRecovery) {
        const before = sourceDraws.length; ctx.save(); drawSourceCombatStatusWave16(ctx, actor, height); ctx.restore();
        const duplicate = sourceDraws.slice(before).some(draw => draw.sheet === protectionCompanion.sheet);
        must(!duplicate, 'Shield Pal duplicated its integrated native cast companion');
      }
      if (frame && !seenProtectionCells.has(frame.index)) {
        if (!readySheets.has(frame.asset.sheet)) { preloadSpriteSheetSrcs([frame.asset.sheet]); const image = new Image(); image.src = frame.asset.sheet; await image.decode(); readySheets.add(frame.asset.sheet); }
        const currentView = viewOf(), nativeBody = getCharacterAnimationFrame(currentView);
        const bodySheet = nativeBody?.asset.sheet || getHeroSpriteSheetSrc(currentView, mode === 'rpg' ? 'rpg' : 'melee');
        if (!readySheets.has(bodySheet)) { preloadSpriteSheetSrcs([bodySheet]); const image = new Image(); image.src = bodySheet; await image.decode(); readySheets.add(bodySheet); }
        const previous = sourceDraws.length, snapshot = JSON.stringify(actor);
        ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha=1; ctx.fillStyle='#172032';ctx.fillRect(0,0,480,480);
        ctx.save(); ctx.translate(240,430);ctx.scale(3,3);ctx.translate(-actor.x,-actor.y);
        if (mode === 'rpg') { if(side==='player')engine.drawRpgHero(ctx,actor,0);else engine.drawRpgEnemy(ctx,actor,0); }
        else { drawPixelSprite(ctx,currentView.x,currentView.y,currentView,0,currentView.facing,height,'melee');drawSourceCombatStatusWave16(ctx,actor,height); }
        ctx.restore();ctx.fillStyle='#c9e9e6';ctx.font='12px monospace';ctx.fillText(mode+' '+side+' '+frame.phase+' '+frame.col,8,20);
        must(JSON.stringify(actor) === snapshot, 'Companion drawing mutated gameplay');
        const draw = sourceDraws.slice(previous).find(draw => draw.sheet === frame.asset.sheet);
        must(draw, 'Shield Pal state did not draw its actual native PNG');
        must(sourceDraws.slice(previous).filter(draw=>draw.sheet===frame.asset.sheet).length===1,'A frame drew duplicate independent Shield Pals');
        companionGc.drawImage(canvas,frame.index*240,(modeIndex*2+sideIndex)*240,240,240);
        seenProtectionCells.add(frame.index); protectionCompanion.actualFrameIndices.push(frame.index);
        protectionCompanion.phases = [...new Set([...protectionCompanion.phases, frame.phase])];
        protectionCompanion.actualSheetDraws.push({ index: frame.index, phase: frame.phase, row: frame.row, col: frame.col,
          facing: frame.facing, sourceCell: draw.args.slice(0,4), transform: draw.transform });
      }
      if (frame?.phase === 'guard' && visual.totalElapsed > 1.6 && !protectionHitInjected) {
        must(actor.sourceProtectionWave16?.active && actor.sourceProtectionWave16.charges === 1, 'Persistent Shield Pal charge vanished without a hit');
        protectionCompanion.persistentBeforeHit = true;
        const before = JSON.stringify(actor.sourceProtectionEntityWave16);
        if (mode === 'rpg') engine.setPaused(true); else engine.paused = true;
        for (let pausedTick=0;pausedTick<20;pausedTick++) { if (mode==='fighter') engine.update(1/60); else engine.update(); }
        must(JSON.stringify(actor.sourceProtectionEntityWave16) === before, 'Paused Pal animation advanced');
        if (mode === 'rpg') engine.setPaused(false); else engine.paused = false;
        protectionCompanion.pauseStable = true; const hp = actor.currentHp;
        if (mode === 'fighter') engine.applyHit(targets[0],actor,{type:'light',base:10,guardDamage:1,knockback:0,delivery:'melee'});
        else if (mode === 'rpg') engine.applyDamage(targets[0],actor,10,null,{delivery:'melee'});
        else engine.applyDamage(targets[0],actor,10,0,null,1,{delivery:'melee'});
        must(actor.currentHp === hp && actor.sourceProtectionWave16.charges === 0, 'Accepted companion hit did not consume exactly one charge');
        protectionCompanion.consumedOnce = actor.sourceProtectionEntityWave16.absorptionCount === 1;
        protectionHitInjected = true;
      }
      if (visual && !visual.active && visual.phase === 'complete') protectionCompanion.removedAfterDeparture = true;
    }
    if (!browser || id !== 'kirito_sao') return;
    const actualView = viewOf(), actualFrame = getCharacterAnimationFrame(actualView);
    if (!actualFrame || actualFrame.phase !== 'super') return;
    const key = actualFrame.asset.sheet + ':' + actualFrame.row + ':' + actualFrame.col;
    if (seenSequenceFrames.has(key)) return;
    const sheet = actualFrame.asset.sheet;
    if (!readySheets.has(sheet)) { preloadSpriteSheetSrcs([sheet]); const image = new Image(); image.src = sheet; await image.decode(); readySheets.add(sheet); }
    const previous = sourceDraws.length;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 240 - actor.x, 430 - actor.y);
    drawPixelSprite(ctx, actualView.x, actualView.y, actualView, 0, actualView.facing, mode === 'fighter' ? 142 : 72, 'melee'); ctx.restore();
    const draw = sourceDraws.slice(previous).find(draw => draw.sheet === sheet);
    if (draw) { seenSequenceFrames.add(key); sequenceDraws.push({ sheet, row: actualFrame.row, col: actualFrame.col,
      index: actualFrame.sourceHitIndex ?? null, frames: actualFrame.asset.frames,
      sourceElapsed: mode === 'rpg' ? actualView.presentationProgress * actor.rpgSpecialDurationTicks / 60 : actor.action?.elapsed,
      sourceCell: draw.args.slice(0, 4), transform: draw.transform }); }
   };
   const state = () => JSON.stringify({ actor, targets, allies });
   if (mode === 'rpg') engine.setPaused(true); else engine.paused = true;
   const frozen = state(); for (let tick = 0; tick < 12; tick++) await advance();
   must(state() === frozen, id + '/' + mode + ': pause advanced state');
   if (mode === 'rpg') engine.setPaused(false); else engine.paused = false;
   let tick = 0;
   const releaseTicks = Math.ceil(profile.hitAt * 60) + 2;
   while (tick++ < releaseTicks) await advance();
   steps.push({ tick, event: 'release', accepted: true });
   const view = mode === 'rpg' ? engine.getRpgPresentationActor(actor) : mode === 'melee' ? engine.getMeleeVisualActor(actor) : actor;
   const frame = getCharacterAnimationFrame(view), asset = resolveCharacterAnimationAsset(view);
   let body = null, casePaintStart = sourceDraws.length;
   if (browser) {
    {
      const sheet = frame?.asset.sheet || getHeroSpriteSheetSrc(view, mode === 'rpg' ? 'rpg' : 'melee');
      preloadSpriteSheetSrcs([sheet]);
      const image = new Image(); image.src = sheet; await image.decode();
      // renderer's own cache is independently loaded from the same real URL.
      if (id === 'aki_hayakawa') { const entityImage = new Image(); entityImage.src = '/sprites/generated/summon-animations-wave16/fox-devil.png'; await entityImage.decode(); }
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#172032'; ctx.fillRect(0, 0, 480, 480);
    ctx.save(); const scale = id === 'bt_7274_tf2' ? .65 : id === 'aki_hayakawa' ? .45 : 1.4; ctx.translate(240, 430); ctx.scale(scale, scale); ctx.translate(-actor.x, -actor.y);
    const start = sourceDraws.length;
    if (mode === 'rpg') { if (side === 'player') engine.drawRpgHero(ctx, actor, 0); else engine.drawRpgEnemy(ctx, actor, 0); }
    else drawPixelSprite(ctx, view.x, view.y, view, 0, view.facing, mode === 'fighter' ? 142 : 72, 'melee');
    if (mode === 'rpg') engine.drawRpgCharacterSuperEffects(ctx);
    else if (mode === 'fighter') {
      engine.drawPersonalSuper(ctx, actor);
      engine.projectiles.forEach(projectile => engine.drawProjectile(ctx, projectile));
      engine.projectileVisualImpacts.forEach(projectile => engine.drawProjectileImpact(ctx, projectile));
    } else engine.drawMeleeSuper(ctx, actor);
    ctx.restore(); ctx.fillStyle = '#c9e9e6'; ctx.font = '12px monospace'; ctx.fillText(`${id} ${mode} ${side}`, 8, 20);
    body = sourceDraws.slice(start).find(draw => frame ? draw.sheet === frame.asset.sheet : !draw.sheet.includes('summon-animations-wave16'));
    must(body, `${id}/${mode}/${side}: actual PNG draw absent`);
    gc.drawImage(canvas, (modeIndex * 2 + sideIndex) * 240, heroIndex * 240, 240, 240);
   }
   const actualFoxDraw = browser ? sourceDraws.slice(casePaintStart).findLast(draw => draw.sheet === '/sprites/generated/summon-animations-wave16/fox-devil.png') : null;
   const contact = mode === 'rpg' ? actor.rpgSpecialVisual?.visualConfirmedContact : actor.action?.visualConfirmedContact;
   let fox = null;
   if (id === 'aki_hayakawa') {
    const action = mode === 'rpg' ? { elapsed: profile.hitAt + .01, duration: profile.duration, hitAt: profile.hitAt, facing: actor.facing } : actor.action;
    const visual = getCharacterSuperVisualState({ actor, profile, action, target: targets[0],
      height: mode === 'fighter' ? 142 : mode === 'rpg' ? 72 * engine.getDepthScale(actor.y) : 72, contactVisual: contact || { confirmed: false } });
    must(visual?.sourceEntity?.asset.id === 'fox_devil-wave16', 'Aki missing genuine separate Fox body');
    if (browser) {
      must(actualFoxDraw, 'Aki separate Fox PNG was never actually drawn');
      const entity = visual.sourceEntity, anchor = entity.asset.effectAnchors?.[entity.phase]?.[entity.column];
      must(anchor, 'Fox actual draw has no measured mouth');
      const args = actualFoxDraw.args, transform = actualFoxDraw.transform, scale = Math.abs(transform.a);
      const localX = args[4] + anchor.x / entity.asset.frameWidth * args[6];
      const localY = args[5] + anchor.y / entity.asset.frameHeight * args[7];
      const actualMouth = { x: transform.a * localX + transform.e, y: transform.d * localY + transform.f };
      const expectedMouth = { x: 240 + (entity.mouth.x - actor.x) * scale, y: 430 + (entity.mouth.y - actor.y) * scale };
      must(Math.hypot(actualMouth.x - expectedMouth.x, actualMouth.y - expectedMouth.y) < 1e-4,
        'Fox actual PNG anatomy differs from the physical mouth projector ' + JSON.stringify({actualMouth,expectedMouth,transform,args,entity:{x:entity.x,y:entity.y,size:entity.size,col:entity.column,mouth:entity.mouth},actor:{x:actor.x,y:actor.y}}));
    }
    fox = { sheet: visual.sourceEntity.asset.sheet, mouth: visual.sourceEntity.mouth, accepted: visual.sourceEntity.accepted, actualPngDraw: actualFoxDraw };
    if (contact?.confirmed && visual.sourceEntity.column === 2) must(Math.hypot(visual.sourceEntity.mouth.x - visual.sourceEntity.target.x,
      visual.sourceEntity.mouth.y - visual.sourceEntity.target.y) < 1e-7, 'Fox mouth missed accepted target');
   }
   const totalTicks = Math.ceil((profile.duration + 1.5) * 60) + 150;
   while (tick++ < totalTicks) await advance();
   if (profile.effect === 'damage') must(events.length > 0, `${id}/${mode}/${side}: no accepted damage`);
   else if (profile.effect === 'control') {
    must(events.length === 0, id + ': control dealt damage');
    // Typed controls are checked at their real release by dedicated adversarial tests;
    // this settlement may be beyond their deliberately finite source duration.
   } else {
    must(events.length === 0, id + ': support damaged an enemy');
    must(targets.every((unit, index) => unit.currentHp >= beforeTargetHp[index]), id + ': support reduced enemy HP');
   }
   let sequence = null;
   if (sequenceDefinition) {
    const observed = sequenceAction.sequenceCursor ?? sequenceAction.releases?.length ?? 0;
    must(observed === sequenceDefinition.hitCount, id + '/' + mode + ': actual release schedule incomplete');
    if (id === 'kirito_sao' && mode !== 'rpg') must((sequenceAction.sourceBladeContactsWave16 || []).filter(contact => contact.acceptedDamage).every(contact => contact.physicalOverlap), 'Kirito damaged beyond an actual blade intersection');
    const budgets = sequenceAction.sequenceDamageBudgets || {};
    for (const budget of Object.values(budgets)) must(budget.spent <= budget.limit + 1e-7, id + ': sequence exceeded total damage budget');
    sequence = { hitCount: sequenceDefinition.hitCount, observedReleases: observed, times: sequenceDefinition.times,
      damageBudgets: budgets, nativeBladeContacts: sequenceAction.sourceBladeContactsWave16 || [],
      physicalApproach: sequenceAction.sourceBladeApproachWave16 || null, nativeFrameDraws: sequenceDraws,
      native16DrawnIndices: sequenceDraws.filter(draw => draw.frames === 16).map(draw => draw.index),
      native32DrawnColumns: sequenceDraws.filter(draw => draw.frames === 32).map(draw => draw.col) };
   }
   if (browser && protectionCompanion) {
    must(protectionHitInjected && protectionCompanion.consumedOnce && protectionCompanion.persistentBeforeHit
      && protectionCompanion.pauseStable && protectionCompanion.removedAfterDeparture, 'Incomplete actual companion lifecycle');
    must(JSON.stringify([...seenProtectionCells].sort((a,b)=>a-b)) === JSON.stringify(Array.from({length:16},(_,index)=>index)), 'Shield Pal actual PNG did not expose all16cells');
   }
   steps.push(...events.map(event => ({ tick: 'simulation', event: 'damage', accepted: true, ...event })));
   results.push({ id, mode, side, passed: true, sourceName: profile.name, effect: profile.effect, delivery: profile.delivery, steps,
    duration: profile.duration, hitAt: profile.hitAt, physicalProjectiles, pauseStable: true, acceptedDamageEvents: events.length,
    bodyKind: frame ? frame.asset.frames === 16 ? 'native-action16' : 'native32' : 'fallback',
    bodySheet: body?.sheet || frame?.asset.sheet || null, bodyCell: body?.args.slice(0, 4) || null,
    bodyTransform: body?.transform || null, sequence, fox, sourceProtectionEntityProof: protectionCompanion,
    ...(protectionCompanion ? { mechanicalProof: { protectionCompanion } } : {}), nativeAssetId: asset?.heroId || null,
    allyHpDelta: allies.map((unit, index) => unit.currentHp - beforeAllyHp[index]) });
  } catch (error) { failures.push({ id, mode, side, error: error.message, stack: error.stack }); }
  finally { engine?.dispose?.(); }
 }
 return { results, failures, expectedCases: ids.length * 6, sourceDraws, contactSheet: grid?.toDataURL() || null, protectionCompanionContactSheet: companionGrid?.toDataURL() || null };
}
