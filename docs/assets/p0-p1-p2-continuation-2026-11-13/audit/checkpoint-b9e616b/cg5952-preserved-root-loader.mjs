import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root='/workspace/multiverse-breach/';
const before='/tmp/p0-p1-p2-before-5952-source/';
export async function resolve(specifier,context,nextResolve){
 try{return await nextResolve(specifier,context);}catch(error){
  if(error.code!=='ERR_MODULE_NOT_FOUND'||!/^\.{1,2}\//.test(specifier)||/\.[a-z]+$/i.test(specifier))throw error;
  return nextResolve(`${specifier}.js`,context);
 }
}
export async function load(url,context,nextLoad){
 if(url.startsWith('file:')){
  const file=fileURLToPath(new URL(url));
  if(file.startsWith(root)&&!file.includes('/node_modules/')){
   const prior=path.join(before,file.slice(root.length));
   if(existsSync(prior)){
    const source=await readFile(prior,'utf8');
    if(file.endsWith('.json'))return {format:'module',shortCircuit:true,source:`export default ${JSON.stringify(JSON.parse(source))};`};
    if(/\.(?:mjs|js)$/.test(file))return {format:'module',shortCircuit:true,source};
   }
   if(/\.(?:mjs|js|json)$/.test(file)){
    const relative=file.slice(root.length);
    const source=execFileSync('git',['cat-file','blob','5952da01c54a0dc8235ab4d0cea9463ba531443c:'+relative],{cwd:root,encoding:'utf8',env:{...process.env,GIT_NO_LAZY_FETCH:'1'},maxBuffer:64*1024*1024});
    return {format:'module',shortCircuit:true,source:file.endsWith('.json')?`export default ${JSON.stringify(JSON.parse(source))};`:source};
   }
  }
 }
 return nextLoad(url,context);
}
