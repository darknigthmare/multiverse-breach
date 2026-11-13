import { listTrackedRuntimePaths } from './dlcAssetPaths.mjs';

const paths = listTrackedRuntimePaths(process.cwd());
if (paths.length) process.stdout.write(`${paths.join('\n')}\n`);
