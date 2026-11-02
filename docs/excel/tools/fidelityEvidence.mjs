/** Read-only audit helpers. Presence and metadata are NEVER art approval. */
export const keyFor = (universe, name) => JSON.stringify([
  String(universe ?? '').normalize('NFC').trim(),
  String(name ?? '').normalize('NFC').trim()
]);
export const httpsReference = value => {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; }
  catch { return ''; }
};

export function stageReferenceIndex(packs) {
  const index = new Map();
  for (const pack of packs) {
    const definitions = [{ name: pack.stage, meta: pack.stageMeta, locator: 'stageMeta' },
      ...(pack.stageVariants || []).map((v, i) => Array.isArray(v)
        ? { name: v[1], meta: v[4], locator: `stageVariants[${i}][4]` }
        : { name: v.name, meta: v, locator: `stageVariants[${i}]` })];
    for (const { name, meta, locator } of definitions) {
      if (!pack.universe || !name || !meta) continue;
      const row = {
        universe: pack.universe, name,
        referenceUrl: httpsReference(meta.referenceUrl),
        visualAnchor: String(meta.visualAnchor || ''),
        continuity: String(pack.continuity || pack.canonProfile?.continuity || ''),
        canonStatus: String(meta.canonStatus || ''),
        packKey: String(pack.key || ''), locator,
        referenceScope: 'PACK_DECLARED_NOT_SCENE_VERIFIED', artApproved: false
      };
      if (!row.referenceUrl && !row.visualAnchor) continue;
      const key = keyFor(row.universe, row.name);
      const candidates = index.get(key) || [];
      const fingerprint = x => JSON.stringify([x.referenceUrl, x.visualAnchor, x.continuity, x.canonStatus]);
      if (!candidates.some(c => fingerprint(c) === fingerprint(row))) candidates.push(row);
      index.set(key, candidates);
    }
  }
  return index;
}

export function resolveStageReference(stage, index) {
  const candidates = index.get(keyFor(stage.universe, stage.name)) || [];
  if (!candidates.length) return { status: 'NOT_FOUND', artApproved: false };
  if (candidates.length !== 1) return { status: 'AMBIGUOUS', candidates: candidates.length, artApproved: false };
  const match = candidates[0];
  const existing = httpsReference(stage.referenceUrl);
  if (existing && existing !== match.referenceUrl) {
    return { ...match, status: 'CONFLICT_PRESERVE_EXISTING', existingReference: existing, artApproved: false };
  }
  return { ...match, status: match.referenceUrl ? 'PACK_REFERENCE_FOUND' : 'ANCHOR_ONLY', artApproved: false };
}

export function isDeclaredOriginalIdentity(actor) {
  // Do not match "original fan-made artwork": that does NOT make a licensed identity an OC.
  return /^Multiverse Breach original (?:companion|tribute persona)\b/i.test(String(actor.incarnation || ''))
    || /^Original (?:project companion|tribute persona from the project)[,.;: ]/i.test(String(actor.canonStatus || ''));
}

export function reviewSubstitution(actor, previousPriority) {
  if (previousPriority === 'P0' && isDeclaredOriginalIdentity(actor)) {
    return { priority: 'P1', externalCanonRequired: false, artApproved: false,
      reason: 'Original identity explicitly declared in current source. Review project design; no external-canon P0. Art remains unapproved.' };
  }
  return { priority: previousPriority, externalCanonRequired: !isDeclaredOriginalIdentity(actor), artApproved: false,
    reason: 'No automatic fidelity approval or priority change from metadata or file presence.' };
}

export function rasterEvidence(src, treeIndex) {
  if (typeof src !== 'string' || !src) return { status: 'UNRESOLVED', path: '', present: false };
  if (!src.startsWith('/') || src.startsWith('//')) return { status: 'EXTERNAL_OR_UNSUPPORTED', path: src, present: null };
  const local = src.split(/[?#]/, 1)[0];
  if (local.includes('\\') || local.split('/').some(x => x === '..' || x === '.')) {
    return { status: 'INVALID_PATH', path: src, present: null };
  }
  const entry = treeIndex.get(`public${local}`);
  return { path: local, present: Boolean(entry), status: entry ? 'PRESENT_IN_GIT' : 'MISSING_IN_GIT',
    gitBlob: entry?.sha || null, bytes: entry?.size ?? null, artApproved: false };
}

export function summarizeResolutions(probes) {
  const distinct = [...new Map(probes.map(p => [p.path, p])).values()];
  return { probes: probes.length, distinctAssets: distinct.length,
    missingAssets: distinct.filter(p => p.status === 'MISSING_IN_GIT').length,
    staticAssets: distinct.filter(p => p.present && p.columns === 1 && p.rows === 1).length,
    staticGameplayAssets: distinct.filter(p => p.present && p.columns === 1 && p.rows === 1 && !['hud','collection'].includes(p.context)).length,
    unknownAssets: distinct.filter(p => p.present === null || p.status === 'UNRESOLVED').length,
    artApproved: false };
}

export const csvCell = value => {
  let text = value == null ? '' : String(value);
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export const toCsv = (rows, columns) => '\uFEFF' + [columns, ...rows.map(row => columns.map(k => row[k]))]
  .map(row => row.map(csvCell).join(';')).join('\r\n') + '\r\n';

export function gitTreeIndex(tree) {
  if (tree.truncated !== false || !Array.isArray(tree.tree)) throw new Error('Complete Git tree required; refuse partial evidence.');
  return new Map(tree.tree.filter(e => e.type === 'blob').map(e => [e.path, e]));
}
