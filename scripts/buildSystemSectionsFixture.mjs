import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { DLC_PACK_MANIFESTS } from '../DLC/index.js';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,'');
const name=process.env.SYSTEM_PROFILE || 'all';
if(!['all','base','halo'].includes(name)) throw new Error('Unknown system fixture profile');
const profile={schemaVersion:1,mode:name==='halo'?'selected':name,packIds:name==='halo'?['halo']:[],sharedPolicy:'preserve-all'};
const installed=new Set(name==='all'?DLC_PACK_MANIFESTS.map(pack=>pack.id):profile.packIds);
const transformer=createDlcProfileTransformer({root,manifests:DLC_PACK_MANIFESTS,installedPackIds:installed});
await build({root,configFile:false,publicDir:false,plugins:[{
  name:'system-fixture-profile',enforce:'pre',transform(source,id){
    if(id.split('?')[0]===root+'/DLC/distribution.json') return {code:JSON.stringify(profile),map:null};
    if(!id.startsWith(root+'/src/')&&!id.startsWith(root+'/DLC/'))return null;
    const result=transformer.transform(source,id);return result?{code:result.code,map:null}:null;
  }
},react()],build:{outDir:resolve(root,'.tmp/system-sections-'+name),emptyOutDir:true,
  rollupOptions:{input:resolve(root,'scripts/fixtures/system-sections.html')}
}});
