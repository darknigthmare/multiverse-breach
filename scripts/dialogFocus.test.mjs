import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { getDialogControls, trapDialogTab } from '../src/game/dialogFocus.js';
const originalStyle = globalThis.getComputedStyle;
afterEach(()=>{ if(originalStyle) globalThis.getComputedStyle=originalStyle;else delete globalThis.getComputedStyle; });
const fixture = () => {
  globalThis.getComputedStyle = element => ({visibility:element.hiddenStyle?'hidden':'visible'});
  const doc={activeElement:null};
  const element=extra=>({tabIndex:0,closest(){return this.inert?{}:null;},getClientRects(){return this.collapsed?[]:[{}];},focus(){doc.activeElement=this;},...extra});
  const first=element(),summary=element(),hiddenLink=element({collapsed:true}),last=element();
  const root={ownerDocument:doc,querySelectorAll:()=>[first,summary,hiddenLink,last],focus(){doc.activeElement=this;}};
  return {doc,element,first,summary,hiddenLink,last,root};
};
test('focusable summaries remain while collapsed links, invisible/inert and negative tabs are excluded',()=>{
  const f=fixture();assert.deepEqual(getDialogControls(f.root),[f.first,f.summary,f.last]);
  f.first.inert=true;f.summary.tabIndex=-1;f.last.hiddenStyle=true;assert.deepEqual(getDialogControls(f.root),[]);
});
test('forward Tab wraps from the last control without activating it',()=>{
  const f=fixture();let prevented=0;f.last.focus();trapDialogTab({key:'Tab',preventDefault(){prevented++;}},f.root);
  assert.equal(f.doc.activeElement,f.first);assert.equal(prevented,1);
});
test('reverse Tab wraps from the first control and traps outside focus',()=>{
  const f=fixture();let prevented=0;f.first.focus();const event={key:'Tab',shiftKey:true,preventDefault(){prevented++;}};
  trapDialogTab(event,f.root);assert.equal(f.doc.activeElement,f.last);f.doc.activeElement={};
  trapDialogTab(event,f.root);assert.equal(f.doc.activeElement,f.last);assert.equal(prevented,2);
});
test('intermediate focus and non-Tab keys retain their native behavior',()=>{
  const f=fixture();f.summary.focus();const event={key:'Tab',preventDefault(){throw Error('intercepted');}};
  trapDialogTab(event,f.root);assert.equal(f.doc.activeElement,f.summary);trapDialogTab({...event,key:'Enter'},f.root);
});
test('an empty dialog receives focus without an exception',()=>{
  const f=fixture();f.root.querySelectorAll=()=>[];let prevented=0;
  trapDialogTab({key:'Tab',preventDefault(){prevented++;}},f.root);assert.equal(f.doc.activeElement,f.root);assert.equal(prevented,1);
  assert.deepEqual(getDialogControls(null),[]);trapDialogTab({key:'Tab'},null);
});
