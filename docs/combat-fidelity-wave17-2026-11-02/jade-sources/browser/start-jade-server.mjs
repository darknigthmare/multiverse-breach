import {createServer} from 'vite';
const server=await createServer({cacheDir:'/tmp/jade-wave17-browser-vite',plugins:[{name:'jade-wave17-no-watch',configResolved(config){config.server.watch=null;config.server.hmr=false;}}],server:{host:'127.0.0.1',port:5231,strictPort:true,watch:null,hmr:false}});
await server.listen();console.log('JADE_BROWSER_READY http://127.0.0.1:5231');
