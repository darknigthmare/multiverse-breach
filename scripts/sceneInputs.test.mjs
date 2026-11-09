import assert from 'node:assert/strict';
import test from 'node:test';
import { createSceneInputs, emptySceneAim, advanceSceneAim } from '../src/game/sceneInputs.js';
import { readFileSync } from 'node:fs';

test('two touches on one action release independently', () => {
  const input=createSceneInputs(['forward']);
  input.hold('pointer:1','forward');input.hold('pointer:2','forward');input.release('pointer:1');
  assert.deepEqual(input.snapshot(),{forward:true});input.release('pointer:2');assert.deepEqual(input.snapshot(),{});
});
test('keyboard aliases retain their own ownership',()=>{
  const input=createSceneInputs(['forward']);input.hold('keyboard:KeyW','forward');input.hold('keyboard:ArrowUp','forward');
  input.release('keyboard:KeyW');assert.deepEqual(input.snapshot(),{forward:true});
});
test('a thumb release cannot cancel a held keyboard command',()=>{
  const input=createSceneInputs(['left']);input.hold('keyboard:KeyA','left');input.hold('pointer:4','left');
  input.release('pointer:4');assert.deepEqual(input.snapshot(),{left:true});
});
test('diagonals and repeated keydown are stable',()=>{
  const input=createSceneInputs(['up','right']);input.hold('keyboard:KeyW','up');input.hold('keyboard:KeyW','up');input.hold('pointer:2','right');
  assert.deepEqual(input.snapshot(),{up:true,right:true});input.release('keyboard:KeyW');assert.deepEqual(input.snapshot(),{right:true});
});
test('pause, visibility and teardown clear all owners; late release stays empty',()=>{
  const input=createSceneInputs(['up']);input.hold('pointer:3','up');input.hold('button:1:Enter','up');input.clear();input.release('pointer:3');assert.deepEqual(input.snapshot(),{});
});
test('unknown or empty source/action is rejected',()=>{
  const input=createSceneInputs(['up']);for(const [source,action] of [['','up'],[null,'up'],['pointer:1','hack']])assert.equal(input.hold(source,action),false);assert.deepEqual(input.snapshot(),{});
});
test('snapshot mutation cannot affect ownership',()=>{
  const input=createSceneInputs(['up']);input.hold('a','up');input.snapshot().up=false;assert.equal(input.snapshot().up,true);
});
test('one owner can change action without leaving the previous one held',()=>{
  const input=createSceneInputs(['up','down']);input.hold('p','up');input.hold('p','down');assert.deepEqual(input.snapshot(),{down:true});
});
test('successive two-pixel aim movements suppress firing on release',()=>{
  const aim={...emptySceneAim(),active:true,pointerId:1,x:100};
  for(const x of [102,104,106,108])advanceSceneAim(aim,1,x);
  assert.equal(aim.moved,true);assert.equal(aim.distance,8);
});
test('returning to the start remains a drag, not a tap',()=>{
  const aim={...emptySceneAim(),active:true,pointerId:1,x:100};advanceSceneAim(aim,1,104);advanceSceneAim(aim,1,100);assert.equal(aim.moved,true);
});
test('another finger cannot rotate the active aiming gesture',()=>{
  const aim={...emptySceneAim(),active:true,pointerId:1,x:100}, before={...aim};
  assert.equal(advanceSceneAim(aim,2,250),0);assert.deepEqual(aim,before);
});
test('released and invalid aiming data are ignored',()=>{
  const aim=emptySceneAim();assert.equal(advanceSceneAim(aim,1,100),0);
  aim.active=true;aim.pointerId=1;assert.equal(advanceSceneAim(aim,1,NaN),0);assert.equal(aim.moved,false);
});
test('scenes integrate all shared controls and explicit result acknowledgement',()=>{
  const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  assert.equal((source.match(/<SceneHoldButton/g)||[]).length,7);
  assert.match(source,/if \(stateRef.current.phase !== 'ended'\) return;/);
  assert.match(source,/role="dialog" aria-modal="true" tabIndex=\{-1\}/);
  assert.match(source,/onLostPointerCapture=\{cancelCanvasAim\}/);
  assert.match(source,/npcLayoutRef.current === layoutKey/);
});
test('error recovery never calls the reward callback',()=>{
  const source=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
  const error=source.slice(source.indexOf('  const recoverRun ='),source.indexOf('  const runActive ='));
  assert.match(error,/reason: 'error'/);assert.doesNotMatch(error,/reason: 'completed'/);
});
