import fs from 'node:fs/promises';
export async function load(url,context,nextLoad){if(url==='file:///workspace/multiverse-breach/src/game/actorFidelityBacklog.js')return {format:'module',shortCircuit:true,source:await fs.readFile(new URL('./baseline-actorFidelityBacklog.js',import.meta.url),'utf8')};return nextLoad(url,context);}
