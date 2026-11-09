"""Replay the Python recipe's gestures through real FPS callbacks and ballistics.

This checks the recipe without importing Playwright or claiming a browser run.
"""
import ast
import json
import math
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
RECIPE = ROOT / 'scripts/browserExtinctionRosterDirectives.py'


def function_from(path, name):
    tree = ast.parse(path.read_text())
    node = next(item for item in tree.body if isinstance(item, ast.FunctionDef) and item.name == name)
    namespace = {'math': math}
    exec(compile(ast.Module(body=[node], type_ignores=[]), str(path), 'exec'), namespace)
    return namespace[name]


class GesturePage:
    def __init__(self):
        self.events = []
        self.mouse = self

    def evaluate(self, _probe):
        return {'t': 0, 'ammo': 60, 'weaponAmmo': 60, 'casts': {}, 'projectiles': []}

    def locator(self, selector):
        assert selector == '.fps-royale-canvas'
        return self

    def bounding_box(self):
        return {'x': 0, 'y': 0, 'width': 1280, 'height': 900}

    def move(self, x, y, steps=1):
        self.events.append({'kind': 'move', 'x': x, 'y': y, 'steps': steps})

    def down(self):
        self.events.append({'kind': 'down'})

    def up(self):
        self.events.append({'kind': 'up'})


class PickupAimProof(unittest.TestCase):
    def test_fine_corrections_use_real_drag_without_firing(self):
        rows = []
        for label, path, name in [
            ('legacy', ROOT / 'scripts/browserSceneServices.py', 'aim'),
            ('fixed', RECIPE, 'aim_pickup_without_fire')
        ]:
            aim = function_from(path, name)
            for angle in [-1, -.033, -.032, -.016, -.008, 0, .005, .008, .016, .032, .033, 1]:
                page = GesturePage()
                aim(page, {'px': 0, 'py': 0, 'angle': 0}, math.sin(angle) * 3, math.cos(angle) * 3)
                rows.append({'helper': label, 'angle': angle, 'events': page.events})
        # Execute the production drag/tap handlers, including lost capture after
        # pointerup, and the actual pickup firing function. Only DOM bookkeeping
        # is replaced. A gesture interpreted as a tap really spends plasma ammo.
        program = r'''
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptySceneAim,advanceSceneAim} from './src/game/sceneInputs.js';
import {createPlayerHero} from './src/game/playerHero.js';
import {getExtinctionSignature,createExtinctionProtocolState,fireExtinctionPickupWeapon} from './src/game/extinctionSignatures.js';
const source=readFileSync('src/components/HubScreen.jsx','utf8');
const start=source.indexOf('  const beginCanvasAim = ',source.indexOf('function ExtinctionRoyale('));
const end=source.indexOf('  useEffect(() => {',start);
assert(start>=0&&end>start);
let legacyShots=0,fixedGestures=0;
for(const row of ROWS){
 const state={phase:'running',heroId:'player_anchor',heroCategory:'tactical',runId:7,t:0,hp:137,
  px:0,py:0,angle:0,ammo:60,reloadPulse:0,enemies:[],
  weapon:{type:'plasma',ammo:60,maxAmmo:60,fireRate:.45,dmgMult:.65},
  protocols:createExtinctionProtocolState(getExtinctionSignature(createPlayerHero()),7)};
 const env={sessionPausedRef:{current:false},intelRef:{current:false},stateRef:{current:state},
  aimPointerRef:{current:emptySceneAim()},emptySceneAim,advanceSceneAim,fire:()=>fireExtinctionPickupWeapon(state)};
 const callbacks=new Function(...Object.keys(env),source.slice(start,end)
  +'return {down:beginCanvasAim,move:moveCanvasAim,up:endCanvasAim,cancel:cancelCanvasAim,click:handleCanvasFire}')( ...Object.values(env));
 let x=0;
 const event={pointerId:7,pointerType:'mouse',button:0,currentTarget:{focus(){},setPointerCapture(){},hasPointerCapture(){return true},releasePointerCapture(){}}};
 for(const entry of row.events){
  if(entry.kind==='move'){x=entry.x;callbacks.move({...event,clientX:x});}
  if(entry.kind==='down')callbacks.down({...event,clientX:x});
  if(entry.kind==='up'){callbacks.up({...event,clientX:x});callbacks.cancel({...event,type:'lostpointercapture'});callbacks.click();}
 }
 if(row.helper==='fixed'){
  assert.equal(state.ammo,60,`unintended ammo spend at ${row.angle}`);
  assert.equal(state.protocols.projectiles.length,0,`unintended projectile at ${row.angle}`);
  assert(Math.abs(state.angle-row.angle)<.006,'aim lost the intended direction');
  fixedGestures++;
 }else if(state.ammo===59&&state.protocols.projectiles.length===1)legacyShots++;
}
assert(legacyShots>0,'the old fine-drag defect must reproduce');
console.log(JSON.stringify({fixedGestures,legacyShots}));
'''.replace('ROWS', json.dumps(rows))
        result = subprocess.run(['node', '--input-type=module', '-'], input=program,
                                text=True, capture_output=True, cwd=ROOT, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        proof = json.loads(result.stdout)
        self.assertEqual(proof['fixedGestures'], 12)
        self.assertGreater(proof['legacyShots'], 0)

    def test_recipe_records_and_rejects_any_attack_during_aim(self):
        tree = ast.parse(RECIPE.read_text())
        outer = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'held_pickup_fire_case')
        guard = next(node for node in outer.body if isinstance(node, ast.FunctionDef) and node.name == 'aim_pickup')
        base = {'t': 0, 'ammo': 60, 'weaponAmmo': 60, 'casts': {'simple': 0}, 'projectiles': []}
        def check(value, message):
            if not value:
                raise AssertionError(message)
        for field, value in [('t', 1), ('ammo', 59), ('weaponAmmo', 59),
                             ('casts', {'simple': 1}), ('projectiles', [{'id': 1}])]:
            with self.subTest(field=field):
                proof = {'before': base, 'after': {**base, field: value}}
                saved = []
                namespace = {'aim_pickup_without_fire': lambda *args: proof,
                             'record_preparation': saved.append, 'check': check}
                exec(compile(ast.Module(body=[guard], type_ignores=[]), '<recipe-guard>', 'exec'), namespace)
                with self.assertRaises(AssertionError):
                    namespace['aim_pickup'](None, {}, 0, 0)
                self.assertEqual(saved, [proof], 'keep diagnostic observations before rejecting the gesture')


if __name__ == '__main__':
    unittest.main()
