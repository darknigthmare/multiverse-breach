import { createServer } from 'vite';
// Vite's merge with the repository config drops a null inline watch option.
// Set the resolved value before Vite creates its watcher, rather than raising
// the system watcher limit or watching the entire generated-asset tree.
const server = await createServer({ cacheDir: '/tmp/wave17-capture-npc-vite',
  plugins: [{ name: 'capture-npc-no-watch', configResolved(config) { config.server.watch = null; } }],
  server: { host: '127.0.0.1', port: 5244, strictPort: true, hmr: false } });
await server.listen();
console.log('W17_CAPTURE_NPC_SERVER_READY http://127.0.0.1:5244');
