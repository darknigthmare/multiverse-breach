import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseAst } from 'rolldown/parseAst';
import { getExtinctionViewmodel, getExtinctionHandFrame, getExtinctionHandSourceRect, getExtinctionHandPlacement } from '../src/game/extinctionContent.js';

/** Executable contract shared by progression audit and unit regression tests. */
export function verifyExtinctionViewmodelContract(resolve = getExtinctionViewmodel, frameFor = getExtinctionHandFrame, cropFor = getExtinctionHandSourceRect) {
  const profile = resolve({ id: 'arca_mirelle' });
  assert.equal(profile.heroId, 'arca_mirelle');
  assert.match(profile.src, /arca-mirelle-fps-hands\.png$/);
  assert.match(profile.projectile, /arca-mirelle-fps-projectile\.png$/);
  assert.equal(profile.layout.columns, 4); assert.equal(profile.layout.rows, 10);
  for (const state of [{t:0}, {t:36,muzzle:36}, {t:24,reloadPulse:4}, {t:12,vx:0.25}]) {
    const frame = frameFor(profile, state);
    const rect = cropFor(frame, 1024, 2560);
    assert.ok(rect && rect.x >= 0 && rect.y >= 0);
    assert.ok(rect.x + rect.w <= (frame.col + 1) * 256);
    assert.ok(rect.y + rect.h <= (frame.row + 1) * 256);
    const placement = getExtinctionHandPlacement(rect, 840, 430, state);
    assert.ok(Math.abs(placement.w / placement.h - rect.w / rect.h) < 1e-9);
    if (state.reloadPulse) {
      assert.equal(frame.row, 6); assert.equal(rect.y, 6 * 256 + 40);
      assert.equal(rect.h, 256 - 40 - 6);
    }
  }
  for (const type of ['rocket','plasma','shotgun']) assert.equal(frameFor(profile,{weapon:{type}}),null);
  for (const id of ['player_anchor','arca_bastion','buckethead_avatar']) assert.equal(resolve({id}).src,'');
  assert.equal(resolve({id:'arca_mirelle',activeSkin:{id:'unbound'}}).src,'');
  return true;
}

/** Source hookup guard; runtime draw calls are covered by browserResidentViewmodels. */
export function verifyExtinctionRendererBinding(source, profileSource = readFileSync(new URL('../src/game/extinctionFighterProfiles.js', import.meta.url), 'utf8')) {
  assert.equal(typeof source, 'string');
  assert.equal(typeof profileSource, 'string');
  const check = (condition, required) => assert.ok(condition, `FPS owner-resolved rendering hookup missing: ${required}`);
  const identifier = (node, name) => node?.type === 'Identifier' && node.name === name;
  const member = (node, object, property) => node?.type === 'MemberExpression' && !node.computed
    && identifier(node.object, object) && identifier(node.property, property);
  const call = (node, name, argument) => node?.type === 'CallExpression' && identifier(node.callee, name)
    && node.arguments.length === 1 && identifier(node.arguments[0], argument);
  const declaration = (body, name) => body.flatMap(node => node.type === 'VariableDeclaration' ? node.declarations : [])
    .find(node => identifier(node.id, name))?.init;
  const imported = (ast, name, path) => ast.body.some(node => node.type === 'ImportDeclaration' && node.source.value === path
    && node.specifiers.some(specifier => specifier.type === 'ImportSpecifier' && identifier(specifier.imported, name) && identifier(specifier.local, name)));
  const hub = parseAst(source, { lang: 'jsx' });
  check(imported(hub, 'getExtinctionFighterProfile', '../game/extinctionFighterProfiles.js'), 'fighter profile import');
  const fps = hub.body.find(node => node.type === 'FunctionDeclaration' && identifier(node.id, 'ExtinctionRoyale'));
  check(fps, 'ExtinctionRoyale');
  const profile = declaration(fps.body.body, 'fighterProfile');
  check(profile?.type === 'CallExpression' && identifier(profile.callee, 'useMemo')
    && profile.arguments[0]?.type === 'ArrowFunctionExpression'
    && call(profile.arguments[0].body, 'getExtinctionFighterProfile', 'selectedHero')
    && profile.arguments[1]?.type === 'ArrayExpression' && profile.arguments[1].elements.length === 1
    && identifier(profile.arguments[1].elements[0], 'selectedHero'), 'selectedHero -> getExtinctionFighterProfile, with owner memo dependency');
  check(member(declaration(fps.body.body, 'viewmodel'), 'fighterProfile', 'view'), 'fighterProfile.view -> viewmodel');

  const adapter = parseAst(profileSource);
  check(imported(adapter, 'getExtinctionViewmodel', './extinctionContent.js'), 'viewmodel resolver import');
  const resolver = adapter.body.find(node => node.type === 'ExportNamedDeclaration'
    && node.declaration?.type === 'FunctionDeclaration' && identifier(node.declaration.id, 'getExtinctionFighterProfile'))?.declaration;
  check(resolver && resolver.params.length === 1 && identifier(resolver.params[0], 'hero'), 'fighter profile hero parameter');
  check(call(declaration(resolver.body.body, 'view'), 'getExtinctionViewmodel', 'hero'), 'hero -> getExtinctionViewmodel');
  const result = resolver.body.body.find(node => node.type === 'ReturnStatement')?.argument;
  const outputView = result?.type === 'ObjectExpression' && result.properties.find(node => node.type === 'Property'
    && !node.computed && identifier(node.key, 'view'))?.value;
  check(outputView?.type === 'ObjectExpression' && outputView.properties.filter(node => node.type === 'SpreadElement').length === 1
    && outputView.properties.some(node => node.type === 'SpreadElement' && identifier(node.argument, 'view'))
    && outputView.properties.every(node => node.type === 'SpreadElement'
      || (node.type === 'Property' && !node.computed && node.key.type === 'Identifier'
        && !['id', 'src', 'projectile', 'layout', 'heroId'].includes(node.key.name))), 'resolved view -> profile.view without borrowed media overrides');

  const assignments = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'AssignmentExpression' && node.operator === '=') assignments.push(node);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  visit(fps.body);
  for (const [object, property, valueObject, valueProperty] of [
    ['hands', 'src', 'viewmodel', 'src'],
    ['fpsHandsRef', 'current', 'hands'],
    ['projectile', 'src', 'viewmodel', 'projectile'],
    ['fpsProjectileRef', 'current', 'projectile']
  ]) check(assignments.some(node => member(node.left, object, property)
    && (valueProperty ? member(node.right, valueObject, valueProperty) : identifier(node.right, valueObject))),
  `${object}.${property} = ${valueObject}${valueProperty ? `.${valueProperty}` : ''}`);
  return true;
}
