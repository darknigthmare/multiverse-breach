import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
let vite, EngineTactics, support, heroes;
const engines = [];
const makeHero = (id, type = 'heal') => ({ id, name: id, universe: 'Nexus de Convergence', category: 'qa',
  stats: { hp: 200, atk: 30, def: 0, spd: 20 }, simple: { name: 'Strike', type: 'melee', dmg: 1 },
  secondary: { name: 'Support', type, dmg: 1, cd: 3 }, special: { name: 'Revive', type: 'revive', reviveRatio: 0.3 },
  defense: { type: 'shield', dur: 1, reduce: 0.4 } });
function make(type = 'heal') {
  const opponents = [makeHero('enemy', type), makeHero('e2', type)].map(h => ({ ...h, hp: 200, atk: 30, spd: 1 }));
  const e = new EngineTactics(760, 420, [makeHero('caster', type), makeHero('patient'), makeHero('patient2')],
    { monsters: opponents, bosses: [], customRoster: opponents }, { add() {} }, () => {}, () => {},
    { universe: 'Nexus de Convergence', customBattle: { singleRoster: true, opponentControl: 'p2' } });
  engines.push(e); e.tiles = []; e.obstacles = []; e.protectedArtifact = null; e.escortUnit = null;
  e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  e.heroes.forEach((u, i) => Object.assign(u, { gridX: 1 + i, gridY: 1, specialCharge: 100 }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: 4 + i, gridY: 3, specialCharge: 100 }));
  return e;
}
function start(e, unit = e.heroes[0], type = 'hero') { e.turnQueue = [{ unit, type }]; e.startTurn(); }
const ticks = (e, n) => { for (let i = 0; i < n; i++) e.update(); };
const cast = (e, u, action = 'secondary') => { assert.equal(e.selectAction(action), true); return e.handleCellClick(u.gridX, u.gridY); };
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
  support = await vite.ssrLoadModule('/src/game/tacticsSupport.js');
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
});
afterEach(() => engines.splice(0).forEach(e => e.dispose()));
after(async () => { await vite?.close(); });

for (const side of ['hero', 'enemy']) {
  test(`Tactics ${side}: healing targets the correct side, spends once and never attacks opponents`, () => {
    const e = make(), allies = side === 'hero' ? e.heroes : e.enemies, opponents = side === 'hero' ? e.enemies : e.heroes;
    const [caster, patient] = allies; patient.currentHp = 100; const opponentsHp = opponents.map(u => u.currentHp);
    start(e, caster, side); const result = cast(e, patient);
    assert.equal(result.handled, true); assert.equal(result.type, 'support'); assert.equal(patient.currentHp, 130);
    assert.equal(caster.cooldown, 180); assert.equal(e.turnsElapsed, 1); assert.deepEqual(opponents.map(u => u.currentHp), opponentsHp);
    assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, false); assert.equal(patient.currentHp, 130);
  });
  test(`Tactics ${side}: revive preserves the corpse cell and rejoins initiative only on rebuild`, () => {
    const e = make(), allies = side === 'hero' ? e.heroes : e.enemies, [caster, patient] = allies;
    patient.currentHp = 0; patient.state = 'dead'; patient.statusEffects.infected = 300;
    const position = [patient.gridX, patient.gridY]; start(e, caster, side);
    const result = cast(e, patient, 'special');
    assert.equal(result.handled, true); assert.equal(patient.currentHp, 60); assert.equal(patient.state, 'idle');
    assert.equal(caster.specialCharge, 0); assert.deepEqual([patient.gridX, patient.gridY], position);
    assert.equal(patient.statusEffects.infected, 0); assert.ok(!e.turnQueue.some(t => t.unit === patient));
    e.rebuildTurnQueue(); assert.ok(e.turnQueue.some(t => t.unit === patient));
  });
}
test('Tactics support: preview and healing obey the radiation cap', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 90; patient.statusEffects.radiated = 900; start(e);
  const preview = e.getDamagePreview(e.activeUnit, patient, 'secondary'); assert.equal(preview.healing, 10); assert.equal(preview.damage, 0);
  assert.equal(cast(e, patient).handled, true); assert.equal(patient.currentHp, 100);
});
test('Tactics support: purification treats only the requested negatives, even at the healing cap', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 100;
  patient.statusEffects = { infected: 500, radiated: 900, glitched: 200, haste: 99 };
  e.heroes[0].secondary.cleanses = ['infected']; start(e);
  const state = (e.selectAction('secondary'), e.getSupportState()); assert.deepEqual(state.choices[0].targets[0].cleanses, ['infected']);
  assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, true);
  assert.equal(patient.currentHp, 100); assert.deepEqual(patient.statusEffects, { infected: 0, radiated: 900, glitched: 200, haste: 99 });
});
test('Tactics support: pure cleanse never heals or damages', () => {
  const e = make('cleanse'), patient = e.heroes[1]; patient.statusEffects.infected = 500; patient.currentHp = 90; start(e);
  assert.equal(cast(e, patient).handled, true); assert.equal(patient.currentHp, 90); assert.equal(patient.statusEffects.infected, 0);
});
test('Tactics support: group healing remains range-limited and affects allies only', () => {
  const e = make(); e.heroes[0].secondary.type = 'heal_aoe'; e.heroes.forEach(u => { u.currentHp = 100; });
  e.heroes[2].gridX = 7; start(e);
  assert.equal(cast(e, e.heroes[1]).handled, true); assert.equal(e.heroes[0].currentHp, 130); assert.equal(e.heroes[1].currentHp, 130);
  assert.equal(e.heroes[2].currentHp, 100); assert.equal(e.enemies[0].currentHp, 200);
});
test('Tactics support: an occupied corpse is not revivable and cannot consume the special', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 0; patient.state = 'dead';
  e.obstacles = [{ type: 'barrier', gridX: patient.gridX, gridY: patient.gridY, hp: 100 }]; start(e);
  assert.equal(cast(e, patient, 'special').handled, false); assert.equal(e.heroes[0].specialCharge, 100); assert.equal(e.turnsElapsed, 0);
});
test('Tactics support: a large corpse cannot revive across an occupied footprint cell', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 0; patient.state = 'dead'; patient.tacticsFootprint = { width: 2, height: 2 };
  e.obstacles = [{ type: 'barrier', gridX: patient.gridX + 1, gridY: patient.gridY + 1, hp: 100 }]; start(e);
  assert.equal(cast(e, patient, 'special').handled, false);
});
test('Tactics support: LoS blocks healing through walls and can be explicitly disabled by the skill', () => {
  const e = make(), patient = e.heroes[2]; patient.currentHp = 100; e.obstacles = [{ type: 'barrier', gridX: 2, gridY: 1, hp: 100 }]; start(e);
  assert.equal(cast(e, patient).handled, false); assert.equal(e.activeUnit.cooldown, 0);
  e.heroes[0].secondary.tactics = { lineOfSight: false }; e.cancelSelectedAction(); assert.equal(cast(e, patient).handled, true);
});
test('Tactics support: a target healed after preview is revalidated without spending', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 100; start(e); e.selectAction('secondary'); patient.currentHp = 200;
  assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, false); assert.equal(e.activeUnit.cooldown, 0); assert.equal(e.turnsElapsed, 0);
});
test('Tactics support: removed skill and removed target fail without consuming resources', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 100; start(e); e.selectAction('secondary');
  e.heroes = e.heroes.filter(u => u !== patient); assert.equal(e.handleCellClick(patient.gridX, patient.gridY).handled, false);
  delete e.activeUnit.secondary; assert.equal(e.selectAction('secondary'), false); assert.equal(e.activeUnit.cooldown, 0);
});
test('Tactics support: cancel preserves remaining movement and all action costs', () => {
  const e = make(); start(e); e.movementSpent = 1; e.heroes[1].currentHp = 100;
  e.selectAction('secondary'); assert.equal(e.cancelSelectedAction(), true); assert.equal(e.movementSpent, 1); assert.equal(e.activeUnit.cooldown, 0); assert.equal(e.turnsElapsed, 0);
});
for (const type of ['buff', 'shield']) test(`Tactics support ${type}: modifies damage temporarily without mutating base stats`, () => {
  const e = make(type), target = e.heroes[1]; const before = { ...target.stats }; start(e);
  assert.equal(cast(e, target).handled, true);
  if (type === 'buff') assert.equal(support.getTacticsSupportDamageMultiplier(target), 1.2);
  else assert.equal(support.getTacticsSupportGuard(target), 0.4);
  e.setPaused(true); ticks(e, 200); assert.ok((target.tacticsBuffTicks || target.tacticsGuardTicks) > 0);
  e.setPaused(false); ticks(e, 200);
  assert.equal(support.getTacticsSupportDamageMultiplier(target), 1); assert.equal(support.getTacticsSupportGuard(target), 0); assert.deepEqual(target.stats, before);
});
test('Tactics support: damage preview matches the deterministic guarded, buffed, shielded hit', () => {
  const e = make(), a = e.heroes[0], b = e.enemies[0]; b.currentHp = 100; b.battleItemShield = 7;
  a.tacticsBuffTicks = 100; a.tacticsBuffMultiplier = 1.2; b.tacticsGuardTicks = 100; b.tacticsGuardReduce = 0.4;
  const preview = e.getDamagePreview(a, b, 'simple'); const random = Math.random; Math.random = () => 0.5;
  try { const damage = e.applyDamage(a, b, e.getActionBaseDamage(a, 'simple'), null, { actionType: 'simple' }); assert.equal(damage, preview.damage); }
  finally { Math.random = random; }
});
for (const side of ['hero', 'enemy']) test(`Tactics ${side} AI: prioritizes a useful heal and never converts it to damage`, () => {
  const e = make(), allies = side === 'hero' ? e.heroes : e.enemies; start(e, allies[0], side); allies[1].currentHp = 90;
  const hp = allies[1].currentHp; const targetHp = side === 'hero' ? e.enemies[0].currentHp : e.heroes[0].currentHp;
  if (side === 'hero') e.runHeroAI(); else { e.opponentControl = 'cpu'; e.runEnemyAI(); }
  ticks(e, 31); assert.ok(allies[1].currentHp > hp);
  assert.equal(side === 'hero' ? e.enemies[0].currentHp : e.heroes[0].currentHp, targetHp); assert.equal(e.turnsElapsed, 1);
});
test('Tactics AI: moves into healing range using only remaining AP', () => {
  const e = make(); e.heroes[1].gridX = 6; e.heroes[1].currentHp = 50; Object.assign(e.heroes[2], { gridX: 0, gridY: 4 }); start(e);
  e.runHeroAI(); assert.ok(e.heroes[0].gridX > 1); assert.ok(e.movementSpent <= 2); ticks(e, 31); assert.equal(e.heroes[1].currentHp, 80);
});
test('Tactics AI: support pending before a turn change is discarded', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 50; start(e); e.runHeroAI(); start(e, e.heroes[2]);
  const hp = patient.currentHp; ticks(e, 31); assert.equal(patient.currentHp, hp); assert.equal(e.turnsElapsed, 0);
});
for (const id of ['arca_mirelle', 'arca_loom', 'arca_bastion', 'arca_nova']) test(`Tactics: authored ${id} support kit has a beneficial secondary`, () => {
  const actor = heroes.find(h => h.id === id); const profile = support.getTacticsSupportProfile(actor, 'secondary');
  assert.ok(profile); assert.ok(['heal', 'guard', 'buff'].includes(profile.effect)); assert.equal(profile.targetSide, 'ally');
});
test('Tactics: support cannot be applied via the damage-only attack entry point', () => {
  const e = make(); const hp = e.enemies[0].currentHp;
  assert.deepEqual(e.applyProfiledAttack(e.heroes[0], e.enemies[0], 'secondary', 100), []); assert.equal(e.enemies[0].currentHp, hp);
});
test('Tactics AI: same-cell replacement cannot steal a prepared heal', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 50; start(e); e.runHeroAI();
  const replacement = { ...patient, id: 'replacement', currentHp: 40, statusEffects: {} };
  e.heroes = e.heroes.map(u => u === patient ? replacement : u);
  ticks(e, 31); assert.equal(replacement.currentHp, 40); assert.equal(e.heroes[0].cooldown, 0);
});
test('Tactics AI: a removed skill during windup has no effect and spends no cooldown', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 50; start(e); e.runHeroAI();
  delete e.heroes[0].secondary; ticks(e, 31); assert.equal(patient.currentHp, 50); assert.equal(e.heroes[0].cooldown, 0);
});
test('Tactics AI: paused healing retains windup and resumes exactly once', () => {
  const e = make(), patient = e.heroes[1]; patient.currentHp = 50; start(e); e.runHeroAI();
  e.setPaused(true); ticks(e, 100); assert.equal(patient.currentHp, 50); assert.equal(e.turnsElapsed, 0);
  e.setPaused(false); ticks(e, 31); assert.equal(patient.currentHp, 80); assert.equal(e.turnsElapsed, 1);
});
test('Tactics AI: KO then revival of the caster never restores its previous support', () => {
  const e = make(), patient = e.heroes[1], caster = e.heroes[0]; patient.currentHp = 50; start(e); e.runHeroAI();
  e.applyDamage(e.enemies[0], caster, 10000); caster.currentHp = 60; caster.state = 'idle';
  ticks(e, 31); assert.equal(patient.currentHp, 50); assert.equal(caster.cooldown, 0);
});
test('Tactics AI: never heals through a barrier from a projected movement cell', () => {
  const e = make(), patient = e.heroes[1]; patient.gridX = 4; patient.currentHp = 50;
  e.obstacles = Array.from({length:e.rows}, (_, y) => ({ type:'barrier', hp:100, gridX:2, gridY:y }));
  start(e); e.runHeroAI(); ticks(e, 31); assert.equal(patient.currentHp, 50);
});
test('Tactics AI: remaining movement budget limits a projected healing approach', () => {
  const e = make(), patient = e.heroes[1]; patient.gridX = 6; patient.currentHp = 50;
  Object.assign(e.heroes[2], { gridX:0, gridY:4 }); start(e); e.movementSpent = 1;
  e.runHeroAI(); ticks(e, 31); assert.equal(patient.currentHp, 50); assert.ok(e.heroes[0].gridX <= 2);
});
