import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 as TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
import { assertWave16SectorExtension } from './tacticsHistoricalBaselineWave16.mjs';
let vite, catalog, custom;
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null}});
  [catalog,custom]=await Promise.all([vite.ssrLoadModule('/src/game/tacticsBattlefields.js'),vite.ssrLoadModule('/src/game/customBattle.js')]);
});
after(async()=>vite?.close());
const fields=Object.values(TACTICS_UNIVERSE_BATTLEFIELDS);
test('each source location selects its own playable Tactics topology and materials without recent-stage substitution',()=>{
  assert.equal(fields.length,4);
  for(const field of fields){
    const explicit=catalog.getTacticsBattlefield({universe:'Nexus de Convergence',tacticsBattlefieldId:field.id});
    assert.equal(explicit.id,field.id);assert.equal(explicit.layoutId,field.layoutId);
    assert.equal(explicit.tileTexture,field.tileTexture);assert.equal(explicit.tileTheme,field.tileTheme);
    assert.equal(explicit.modeExclusive,'Tactics');assert.equal(explicit.source.source1to1Verified,false);
    const located=catalog.getTacticsBattlefield({universe:field.source.universe,name:field.source.location});
    assert.equal(located.id,field.id,field.source.location);
  }
});
test('W15 sectors route through real custom preset auto and explicit selection while other engines retain their own image',()=>{
  assertWave16SectorExtension(catalog.TACTICS_SOURCE_BATTLEFIELDS, TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16);
  for(const field of fields){
    for(const requested of ['auto',field.id]){
      const preset=custom.normalizeCustomBattlePreset({mode:'Tactics',tacticsBattlefieldId:requested});
      const stage=custom.buildCustomRuntimeStage({preset,archive:{universe:field.source.universe,name:'Source region',image:'/shared-other-engine.png'},enemyData:{monsters:[]}});
      assert.equal(stage.tacticsBattlefieldId,field.id);assert.equal(stage.universe,field.source.universe);assert.equal(stage.image,null);
      assert.deepEqual(stage.tacticsSource,field.source);
      for(const mode of ['RPG','Smash','Fighter']){
        const other=custom.buildCustomRuntimeStage({preset:{...preset,mode},archive:{universe:'Halo',image:'/shared-other-engine.png'},enemyData:{}});
        assert.equal(other.universe,'Halo');assert.equal(other.image,'/shared-other-engine.png');assert.equal(other.tacticsBattlefieldId,null);
      }
    }
  }
});
test('W15 location matching and explicit goals keep universe/base-arena boundaries',()=>{
  assert.equal(catalog.getUniverseTacticsBattlefield({universe:'Halo',name:'Dollet'}),null);
  assert.equal(catalog.getUniverseTacticsBattlefield({universe:'Resident Evil',name:'White Forest'}),null);
  for(const field of fields){
    assert.equal(catalog.getTacticsBattlefield({forceBaseArena:true,tacticsBattlefieldId:field.id}).id,'training_grid');
    assert.equal(catalog.getTacticsBattlefield({universe:field.source.universe,name:field.source.location+' escort convoy'}).id,'nexus_escort_route');
  }
});
