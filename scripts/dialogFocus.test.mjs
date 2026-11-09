import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { getDialogControls, trapDialogTab } from '../src/game/dialogFocus.js';
const originalStyle = globalThis.getComputedStyle;
afterEach(()=>{ if(originalStyle) globalThis.getComputedStyle=originalStyle;else delete globalThis.getComputedStyle; });
const fixture = () => {
  globalThis.getComputedStyle = element => ({visibility:element.hiddenStyle?'hidden':'visible'});
  const doc={activeElement:null};
  const nodes=[];
  const element=extra=>({tabIndex:0,closest(){return this.inert || this.hidden?{}:null;},getClientRects(){return this.collapsed?[]:[{}];},focus(){doc.activeElement=this;},
    compareDocumentPosition(other){return nodes.indexOf(other)<nodes.indexOf(this)?2:4;},...extra});
  const first=element(),summary=element(),hiddenLink=element({collapsed:true}),last=element();
  nodes.push(first,summary,hiddenLink,last);
  const root={ownerDocument:doc,querySelectorAll:()=>nodes,contains:node=>nodes.includes(node),focus(){doc.activeElement=this;}};
  return {doc,element,nodes,first,summary,hiddenLink,last,root};
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
test('Tab continues after an internal heading and Shift+Tab before it without making it a Tab stop',()=>{
  const f=fixture(),heading=f.element({tabIndex:-1});f.nodes.splice(2,0,heading);
  assert.deepEqual(getDialogControls(f.root),[f.first,f.summary,f.last]);
  let prevented=0;
  for(const [shiftKey,expected] of [[false,f.last],[true,f.summary]]){
    heading.focus();trapDialogTab({key:'Tab',shiftKey,preventDefault(){prevented++;}},f.root);
    assert.equal(f.doc.activeElement,expected);
  }
  assert.equal(prevented,2);
});
test('internal content at either boundary wraps within the dialog',()=>{
  const f=fixture(),intro=f.element({tabIndex:-1}),outro=f.element({tabIndex:-1});
  f.nodes.unshift(intro);f.nodes.push(outro);
  for(const [active,shiftKey,expected] of [[intro,false,f.first],[intro,true,f.last],[outro,false,f.first],[outro,true,f.last]]){
    let prevented=0;active.focus();trapDialogTab({key:'Tab',shiftKey,preventDefault(){prevented++;}},f.root);
    assert.equal(f.doc.activeElement,expected);assert.equal(prevented,1);
  }
});
test('continuing from an internal objective skips collapsed, hidden, inert, disabled and negative-tab controls',()=>{
  const f=fixture(),objective=f.element({tabIndex:-1});
  const excluded=[{collapsed:true},{hidden:true},{inert:true},{disabled:true},{tabIndex:-1},{hiddenStyle:true}].map(f.element);
  f.nodes.splice(1,0,objective,...excluded);objective.focus();
  let prevented=0;trapDialogTab({key:'Tab',preventDefault(){prevented++;}},f.root);
  assert.equal(f.doc.activeElement,f.summary);assert.equal(prevented,1);
  f.doc.activeElement={};trapDialogTab({key:'Tab',preventDefault(){prevented++;}},f.root);
  assert.equal(f.doc.activeElement,f.first);assert.equal(prevented,2);
});
test('an empty dialog receives focus without an exception',()=>{
  const f=fixture();f.root.querySelectorAll=()=>[];let prevented=0;
  trapDialogTab({key:'Tab',preventDefault(){prevented++;}},f.root);assert.equal(f.doc.activeElement,f.root);assert.equal(prevented,1);
  assert.deepEqual(getDialogControls(null),[]);trapDialogTab({key:'Tab'},null);
});
