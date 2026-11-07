import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { exportDlcDistribution } from '../exportDlcDistribution.mjs';
export function createDeltaFixture(t) {
  const parent = mkdtempSync(path.join(tmpdir(), 'mb-dlc-delta-'));
  t.after(() => rmSync(parent, { recursive:true, force:true }));
  const source = path.join(parent, 'source'); mkdirSync(source);
  const write = (file, bytes) => { mkdirSync(path.dirname(path.join(source,file)),{recursive:true}); writeFileSync(path.join(source,file),bytes); };
  const json = (file, value) => write(file,JSON.stringify(value,null,2)+'\n');
  const manifests=['Halo','Drop'].map((universe,index)=>({schemaVersion:1,id:universe.toLowerCase(),universe,
    directory:'DLC/'+universe,registration:'runtime',catalogOrder:index,assetManifest:'assets.json',
    modules:[{path:'data/heroes.js',runtimeAdapter:'src/game/catalog.js'}]}));
  for(const manifest of manifests) {
    json(manifest.directory+'/manifest.json',manifest);
    write(manifest.directory+'/index.js', "export { default as manifest } from './manifest.json' with { type: 'json' };\nexport * as heroes from './data/heroes.js';\n");
    write(manifest.directory+'/data/heroes.js',`export const ${manifest.universe.toUpperCase()}_HEROES = [{id:'${manifest.id}'}];\n`);
    const asset={sourcePath:manifest.directory+'/assets/images/'+manifest.id+'.bin',publicPath:'/images/'+manifest.id+'.bin'};
    json(manifest.directory+'/assets.json',{schemaVersion:1,universe:manifest.universe,assets:[asset],sharedDependencies:['/common.bin']});
    write(asset.sourcePath,Buffer.from([0,255,manifest.catalogOrder,42]));
  }
  write('DLC/index.js','export const DLC_PACK_MANIFESTS = '+JSON.stringify(manifests)+';\n');
  json('DLC/content-identities.json',{schemaVersion:1,indexes:{universes:{Halo:0,Drop:1}}});
  json('DLC/shared-assets.json',{schemaVersion:1,assets:[{sourcePath:'public/common.bin',publicPath:'/common.bin'}]});
  json('DLC/distribution.json',{schemaVersion:1,mode:'all',packIds:[],sharedPolicy:'preserve-all'});
  write('public/common.bin',Buffer.alloc(128*1024,17));
  write('src/game/catalog.js',"import { HALO_HEROES } from '../../DLC/Halo/data/heroes.js';\nimport { DROP_HEROES } from '../../DLC/Drop/data/heroes.js';\nexport const HEROES = [{id:'base'},...HALO_HEROES,...DROP_HEROES];\n");
  write('src/App.jsx',"import { HEROES } from './game/catalog.js';\nexport default function App(){return <main>{HEROES.length}</main>;}\n");
  json('package.json',{name:'delta-fixture',type:'module',private:true});
  write('index.html','<main id="root"></main>');
  const exported=(name,packIds,sourceRevision='1'.repeat(40))=>{
    const out=path.join(parent,name);
    exportDlcDistribution({root:source,profile:{schemaVersion:1,mode:packIds.length?'selected':'base',packIds,sharedPolicy:'preserve-all'},out,sourceRevision});
    return out;
  };
  return {parent,source,base:exported('base',[]),halo:exported('halo',['halo']),exported};
}
