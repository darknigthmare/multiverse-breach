import { createServer } from 'vite';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../../..');
const port = Number(process.env.WAVE17_REVIEW_PORT || 5188);
const server = await createServer({
  root, logLevel: 'warn',
  plugins: [{ name: 'wave17-static-review-inputs', configResolved(config) {
    config.server.watch = null; config.server.hmr = false;
  } }],
  server: { host: '127.0.0.1', port, strictPort: true, hmr: false, watch: null }
});
await server.listen();
console.log(`W17 frozen-source review: http://127.0.0.1:${port}/`);
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await server.close(); process.exit(0); });
