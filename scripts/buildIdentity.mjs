import { execFileSync } from 'node:child_process';
const validSha = value => typeof value === 'string' && /^[0-9a-f]{40}$/i.test(value) ? value.toLowerCase() : null;
/** Publish only non-secret provenance, never the environment as a whole. */
export function getBuildIdentity(env = process.env, readGit = () => execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8',stdio:['ignore','pipe','ignore'],timeout:2000}).trim()) {
  let commit = validSha(env.VERCEL_GIT_COMMIT_SHA) || validSha(env.GITHUB_SHA);
  if (!commit) { try { commit = validSha(readGit()); } catch { /* Source exports have no .git directory. */ } }
  const environment = ['production','preview','development'].includes(env.VERCEL_ENV) ? env.VERCEL_ENV : env.CI ? 'ci' : 'local';
  return Object.freeze({ schemaVersion:1, commit:commit || null, shortCommit:commit?.slice(0,8) || 'unknown', environment });
}
export function buildIdentityPlugin(identity) {
  return { name:'multiverse-build-identity', apply:'build',
    generateBundle() { this.emitFile({type:'asset',fileName:'build-info.json',source:JSON.stringify(identity,null,2)+'\n'}); }
  };
}
