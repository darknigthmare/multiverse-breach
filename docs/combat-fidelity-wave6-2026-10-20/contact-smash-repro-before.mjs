import { createServer } from '/workspace/multiverse-breach/node_modules/vite/dist/node/index.js';
import fs from 'node:fs/promises';
const vite=await createServer({root:'/workspace/multiverse-breach',appType:'custom',logLevel:'silent',server:{middlewareMode:true}}), engines=[];
const {EngineSmash}=await vite.ssrLoadModule('/src/game/engineSmash.js?independent-contact6');
const {HEROES_DB}=await vite.ssrLoadModule('/src/game/heroes.js');
const {tickMeleeCombatActor,beginMeleeShield}=await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js');
const noop=()=>{},d={id:'contact-dummy',name:'Contact target',universe:'Audit',stats:{hp:5000,atk:20,def:8,spd:5},simple:{name:'Contact',type:'melee',dmg:1},secondary:{name:'Contact',type:'melee',dmg:1},defense:{name:'Guard',type:'shield',reduce:.4},special:{name:'Contact',type:'melee',dmg:2}},results=[];
try{
for(const id of ['snake','raiden'])for(const side of ['player','cpu'])for(const scenario of ['perfect-shield','miss-then-move']){
 const h=HEROES_DB.find(h=>h.id===id),players=side==='player'?[h]:[d],opponents=side==='player'?[d]:[h];
 const e=new EngineSmash(1000,500,players,{monsters:opponents,bosses:[],customRoster:opponents},{add:noop},noop,noop,{universe:'Nexus de Convergence',disableHazards:true,mode:'Smash',customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(e);e.syncPreMatchFromServer(3000);
 const a=(side==='player'?e.heroes:e.enemies)[0],t=(side==='player'?e.enemies:e.heroes)[0],f=side==='player'?1:-1;
 a.x=f>0?300:700;a.y=e.groundY;a.facing=f;a.specialCharge=100;a.state='idle';t.x=a.x+f*100;t.y=a.y;t.currentHp=t.maxHp=5000;
 const ok=e.triggerMeleeSuper(a), hp=t.currentHp,action=a.action;
 const step=dt=>{for(let remaining=dt;remaining>1e-9;){const delta=Math.min(1/120,remaining);tickMeleeCombatActor(a,delta,{resolveActionHit:(source,act)=>e.resolveMeleeActionHit(source,act)});remaining-=delta;}};
 step(.44);
 if(scenario==='perfect-shield')beginMeleeShield(t);else t.x=a.x+f*(action.superProfile.range+100);
 step(.03);
 const impactPosition=t.x;
 if(scenario==='miss-then-move')t.x=a.x+f*100;
 const marks=[],ctx=new Proxy({globalAlpha:1},{get(o,k){if(k in o)return o[k];return(...args)=>marks.push([k,...args]);},set(o,k,v){o[k]=v;return true;}});
 e.drawMeleeSuper(ctx,a);
 results.push({id,side,scenario,ok,elapsed:action.elapsed,damage:hp-t.currentHp,defenderState:t.state,impactResolved:action.impactResolved,impactPoint:action.impactPoint??null,targetXAtResolution:impactPosition,targetXAtDraw:t.x,contactMarks:marks.filter(c=>['ellipse','lineTo'].includes(c[0]))});
}
console.log(JSON.stringify(results,null,2));await fs.writeFile('/tmp/wave6-smash-contact-audit-result.json',JSON.stringify(results,null,2));
}finally{engines.forEach(e=>e.dispose?.());await vite.close();}
