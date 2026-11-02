import { createServer } from 'vite';
const server = await createServer({ server: { host: '127.0.0.1', port: 5196, strictPort: true, watch: { ignored: ['**/*'] } } });
await server.listen();
console.log('Tactics proof server http://127.0.0.1:5196 ; new public inventory read at startup, no file watchers');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => { await server.close(); process.exit(0); });
