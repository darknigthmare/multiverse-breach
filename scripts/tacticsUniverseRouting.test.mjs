import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
import { TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefields.js';
let vite, catalog, custom;
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null}});
  [catalog,custom]=await Promise.all([vite.ssrLoadModule('/src/game/tacticsBattlefields.js'),vite.ssrLoadModule('/src/game/customBattle.js')]);
});
after(async()=>vite?.close());
const fields=Object.values(TACTICS_UNIVERSE_BATTLEFIELDS);
test('each source location selects its own playable Tactics topology and materials without recent-stage substitution',()=>{
  assert.equal(fields.length,8);
  for(const field of fields){
    const explicit=catalog.getTacticsBattlefield({universe:'Nexus de Convergence',tacticsBattlefieldId:field.id});
    assert.equal(explicit.id,field.id);assert.equal(explicit.layoutId,field.layoutId);
    assert.equal(explicit.tileTexture,field.tileTexture);assert.equal(explicit.tileTheme,field.tileTheme);
    assert.equal(explicit.modeExclusive,'Tactics');assert.equal(explicit.source.source1to1Verified,false);
    const located=catalog.getTacticsBattlefield({universe:field.source.universe,name:field.source.location});
    assert.equal(located.id,field.id,field.source.location);
  }
});
test('a named source location in another universe cannot silently select a foreign terrain',()=>{
  assert.equal(catalog.getUniverseTacticsBattlefield({universe:'Halo',name:'Mount Nibel'}),null);
  assert.equal(catalog.getUniverseTacticsBattlefield({universe:'Final Fantasy VII',name:'Midgar Sector Seven'}),null);
  assert.equal(catalog.getUniverseTacticsBattlefield({universe:'The Lord of the Rings',name:'Nexus'}),null);
  assert.equal(catalog.getUniverseTacticsBattlefield({universe:'The Lord of the Rings'},{allowDefault:true}).id,'lotr_ithilien_tactics');
});
test('custom Tactics uses its actual terrain universe and location instead of an unrelated selected backdrop',()=>{
  for(const field of fields){
    const preset=custom.normalizeCustomBattlePreset({mode:'Tactics',tacticsBattlefieldId:field.id});
    const stage=custom.buildCustomRuntimeStage({preset,archive:{id:'unrelated',universe:'Halo',name:'Unrelated arena',image:'/other-mode.png'},enemyData:{monsters:[]}});
    assert.equal(stage.universe,field.source.universe);assert.equal(stage.name,field.label.fr);
    assert.equal(stage.tacticsBattlefieldId,field.id);assert.equal(stage.image,null);
    assert.deepEqual(stage.tacticsSource,field.source);
    for(const mode of ['RPG','Smash','Fighter']){
      const other=custom.buildCustomRuntimeStage({preset:{...preset,mode},archive:{universe:'Halo',image:'/other-mode.png'},enemyData:{}});
      assert.equal(other.universe,'Halo');assert.equal(other.image,'/other-mode.png');assert.equal(other.tacticsBattlefieldId,null);assert.equal(other.tacticsSource,null);
    }
  }
});
test('custom automatic choice uses a dedicated source layout and survives preset normalization',()=>{
  const preset=custom.normalizeCustomBattlePreset({mode:'Tactics'});
  const stage=custom.buildCustomRuntimeStage({preset,archive:{universe:'Halo',name:'Valhalla',image:'/shared.png'},enemyData:{monsters:[]}});
  assert.equal(preset.tacticsBattlefieldId,'auto');assert.equal(stage.tacticsBattlefieldId,'halo_valhalla_tactics');
  assert.equal(stage.image,null);assert.equal(stage.customBattle.tacticsBattlefieldId,'auto');
});
test('forced base arenas and authored mission objectives keep their explicit contracts',()=>{
  assert.equal(catalog.getTacticsBattlefield({forceBaseArena:true,tacticsBattlefieldId:fields[0].id}).id,'training_grid');
  assert.equal(catalog.getTacticsBattlefield({universe:'Halo',name:'Valhalla escort convoy'}).id,'nexus_escort_route');
  assert.equal(catalog.getTacticsBattlefield({universe:'Mass Effect',name:'Therum artifact extraction'}).id,'artifact_bastion');
  assert.equal(catalog.getTacticsBattlefield({universe:'The Lord of the Rings',worldBoss:true,name:'Ithilien'}).id,'boss_command_zone');
});
