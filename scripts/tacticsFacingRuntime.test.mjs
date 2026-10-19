import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
let vite, EngineTactics;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ EngineTactics } = await vite.ssrLoadModule('/src/game/engineTactics.js'));
});
after(async () => { await vite?.close(); });
for (const [dx, dy] of [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]) {
  test(`native Tactics damage, preview and feedback: heading ${dx},${dy}`, () => {
    const particles = [], noop = () => {};
    const hero = { id: 'qa-facing', name: 'Facing', universe: 'QA', stats: { hp:1000,atk:100,def:0,spd:1 }, simple: { name:'Strike',dmg:1 } };
    const foe = { id:'qa-foe',name:'Foe',universe:'QA',hp:1000,atk:1,def:0,spd:1 };
    const engine = new EngineTactics(760,420,[hero],{customRoster:[foe],monsters:[foe],bosses:[]},
      {add:(...args)=>particles.push(args)},noop,noop,{mode:'Tactics',universe:'QA',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
    const random = Math.random;
    try {
      engine.tiles=[]; engine.obstacles=[]; engine.cols=9; engine.rows=9;
      engine.escortUnit=null; engine.protectedArtifact=null; engine.objective='rout';
      const attacker=engine.heroes[0], defender=engine.enemies[0];
      Object.assign(defender,{gridX:4,gridY:4,facingVector:{x:dx,y:dy},def:0});
      Math.random=()=>0.5; // isolate the orientation; do not substitute combat logic
      for (const [x,y,factor,label] of [[dx,dy,1,null],[-dy,dx,1.12,'FLANK'],[-dx,-dy,1.25,'BACK']]) {
        Object.assign(attacker,{gridX:4+x,gridY:4+y});
        Object.assign(defender,{currentHp:1000,state:'idle',stateTimer:0}); particles.length=0;
        const modifiers=engine.getDamageModifiers(attacker,defender,'simple');
        assert.equal(modifiers.facing.bonus, factor-1 === 0 ? 0 : label==='FLANK' ? 0.12 : 0.25);
        assert.equal(modifiers.multiplier,factor);
        const preview=engine.getDamagePreview(attacker,defender,'simple');
        assert.equal(preview.damage,Math.round(100*factor));
        const actual=engine.applyDamage(attacker,defender,100,null,{actionType:'simple'});
        assert.equal(actual,preview.damage); assert.equal(defender.currentHp,1000-actual);
        const feedback=particles.filter(p=>p[7]==='text').map(p=>p[8]);
        if(label) assert.ok(feedback.includes(label));
        else assert.ok(!feedback.includes('BACK') && !feedback.includes('FLANK'));
      }
      assert.equal(engine.getDamageModifiers(attacker,defender,'special').facing.bonus,0);
      assert.equal(engine.getDamageModifiers(attacker,defender,'simple',true).facing.bonus,0);
    } finally { Math.random=random; engine.dispose(); }
  });
}
