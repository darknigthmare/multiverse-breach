import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const text = value => typeof value === 'string' ? value.trim() : value?.label || value?.fr || value?.en || '';
const unique = values => [...new Set(values.filter(Boolean))];
const lines = value => list(value).flatMap(item => typeof item === 'object' && item ? Object.values(item).flatMap(lines) : text(item) ? [text(item)] : []);
const key = value => text(value).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const nonIdentityScope = value => /(?:costume|equipment|environment|weapon|style)[-_ ]only|iconic[-_ ]outfit[-_ ]only/i.test(text(value));
const identityDocument = document => document.usedForIdentity !== false && ![document.referenceScope, document.referencePurpose, document.scope, document.purpose].some(nonIdentityScope);
const localPath = (root, value) => {
  if (typeof value !== 'string' || /^https?:|^data:/i.test(value)) return null;
  if (/^\/(?:sprites|cg|visuals|images)\//.test(value)) return path.resolve(root, 'public', value.slice(1));
  if (path.isAbsolute(value) && existsSync(value)) return value;
  return path.resolve(root, value.replace(/^\//, ''));
};
const isVisualFile = file => file && /\.(?:png|jpe?g|webp|gif|avif|svg|pdf)$/i.test(file) && existsSync(file) && statSync(file).isFile();
const locksFrom = document => {
  const result = {};
  for (const supplied of [document.visualLocks, document.identityLocks, document.visualLockAxes]) {
    const axes = Array.isArray(supplied) ? { details: supplied } : supplied || {};
    for (const [axis, value] of Object.entries(axes)) result[axis] = unique([...(result[axis] || []), ...lines(value)]);
  }
  return result;
};
const specificLocks = locks => Object.values(locks).flat().some(line => line.length > 10 && !/détail non établi|not[- ]established|needs[- ]reference|à fixer|to resolve|preserving the canonical silhouette|^(?:unknown|none|keep identity)$/i.test(line));
const compatibleIncarnation = (reference, target) => {
  const a = key(reference), b = key(target);
  return !a || a === b || a.length > 8 && (a.includes(b) || b.includes(a));
};
const normalizeReference = (reference, document) => ({
  ...reference,
  path: reference.path || reference.localPath,
  url: reference.finalUrl || reference.url || reference.imageUrl || null,
  viewed: reference.viewed === true || reference.visuallyInspected === true,
  referenceScope: reference.referenceScope || reference.scope || document.referenceScope || document.scope || null,
  referencePurpose: reference.referencePurpose || reference.purpose || document.referencePurpose || document.purpose || null,
  slot: reference.slot || document.slot || null,
  sourceFile: document.file,
  sourceIncarnation: text(reference.incarnation) || text(document.incarnation) || null,
  canonicalFidelityApproved: false,
  visualFidelityApproved: false
});
const identityReference = (root, reference, document, incarnation = document.incarnation) => {
  if (!identityDocument(document) || !reference.viewed || reference.usedForIdentity === false || reference.excluded === true || reference.excludedFromGeneration === true) return false;
  if ([reference.referenceScope, reference.referencePurpose].some(nonIdentityScope)) return false;
  const role = reference.role || '';
  if (/style[- ]only|not[- ](?:independent[- ]source|body[- ]reference|.{0,35}identity)|iconic.*outfit|outfit.*reference|(?:environment|location)[-_ ](?:art|reference)|historical.*not[-_ ]selected|world[- ]and[- ]architecture|weapon[- ]reference|pistol[- ]render|weapon[- ]only/i.test(role)) return false;
  if (/equipment[- ]reference/i.test(role) && !/armor|body|identity|character/i.test(role)) return false;
  // Generated target artwork is never evidence of its own identity. Explicit
  // original-project sprite references can qualify; style-only sprites cannot.
  const resolved = localPath(root, reference.path);
  const generatedCgDirectory = path.resolve(root, 'public', 'cg') + path.sep;
  if (/(?:^|\/)generated_images\/|^\/?(?:public\/)?cg\//.test(reference.path || '') || resolved?.startsWith(generatedCgDirectory)
    || /generated[- ]project[- ]reference[- ]not[- ]independent/i.test(role)) return false;
  if (!compatibleIncarnation(reference.sourceIncarnation, incarnation)) return false;
  if (reference.referenceCharacter) {
    const ref = key(reference.referenceCharacter);
    const owners = [document.characterId, document.heroId, document.characterName, document.name].map(key).filter(Boolean);
    if (!owners.some(owner => owner === ref || ref.length > 2 && owner.endsWith(ref))) return false;
  }
  return isVisualFile(resolved);
};

/** Return repository-relative receipt names, recursively and deterministically. */
export function discoverCgSourceEvidenceFiles(root, relative = 'docs/cg') {
  const directory = path.resolve(root, relative);
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = path.posix.join(relative.replaceAll('\\', '/'), entry.name);
    return entry.isDirectory() ? discoverCgSourceEvidenceFiles(root, name)
      : /(?:reference|source).*(?:evidence|receipt|review).*\.json$/i.test(entry.name) ? [name] : [];
  }).sort();
}

const rank = document => [
  document.incarnationDecision && /explicit|selected|target[- ]change/.test(JSON.stringify(document.incarnationDecision)) ? 1 : 0,
  text(document.publishedAt || document.date || document.retrievedAt) || document.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '',
  document.file
];
const compareRank = (a, b) => {
  const x = rank(a), y = rank(b);
  return x[0] - y[0] || x[1].localeCompare(y[1]) || x[2].localeCompare(y[2]);
};

/** Merge source receipts, retaining purpose/scope and incompatible histories. */
export function loadCgSourceEvidence(root) {
  const groups = new Map();
  for (const file of discoverCgSourceEvidenceFiles(root)) {
    const raw = JSON.parse(readFileSync(path.resolve(root, file), 'utf8'));
    const id = raw.characterId || raw.heroId;
    if (!id || Array.isArray(raw)) continue;
    const document = { ...raw, file, visualLocks: locksFrom(raw) };
    const refs = [...list(raw.references), ...(raw.path || raw.localPath ? [raw] : [])];
    document.references = refs.map(ref => normalizeReference(ref, document));
    groups.set(id, [...(groups.get(id) || []), document]);
  }
  const result = new Map();
  for (const [id, documents] of groups) {
    const candidates = documents.filter(doc => identityDocument(doc) && text(doc.incarnation) && specificLocks(doc.visualLocks)
      && doc.references.some(ref => identityReference(root, ref, doc))).sort(compareRank);
    const selected = candidates.at(-1) || documents.filter(doc => identityDocument(doc) && text(doc.incarnation)
      && specificLocks(doc.visualLocks)).sort(compareRank).at(-1)
      || documents.filter(doc => identityDocument(doc) && text(doc.incarnation)).sort(compareRank).at(-1);
    // Never blend distinct editions into a qualified model. A bare receipt
    // without an incarnation may add provenance, but cannot select a target.
    const cohort = documents.filter(doc => identityDocument(doc) && (!text(doc.incarnation) || compatibleIncarnation(doc.incarnation, selected?.incarnation)))
      .sort(compareRank);
    const visualLocks = {};
    for (const doc of cohort) for (const [axis, values] of Object.entries(doc.visualLocks)) visualLocks[axis] = unique([...(visualLocks[axis] || []), ...values]);
    const universeCoherence = {};
    for (const doc of cohort) for (const [field, value] of Object.entries(doc.universeCoherence || {})) {
      universeCoherence[field] = Array.isArray(value) || Array.isArray(universeCoherence[field])
        ? unique([...list(universeCoherence[field]), ...list(value)]) : value;
    }
    const references = documents.flatMap(doc => doc.references);
    const identityVisualReferences = selected ? cohort.flatMap(doc => doc.references.filter(ref => identityReference(root, ref, doc, selected.incarnation))) : [];
    const dedupeRefs = refs => [...new Map(refs.map(ref => [`${ref.path}|${ref.url}|${ref.referenceScope}|${ref.referencePurpose}|${ref.slot}`, ref])).values()];
    const evidence = {
      ...(selected || {}), characterId: id,
      incarnation: text(selected?.incarnation) || null,
      files: unique(documents.map(doc => doc.file)),
      sourceEvidenceFiles: unique(cohort.map(doc => doc.file)),
      visualLocks,
      equipment: unique(cohort.flatMap(doc => lines(doc.equipment))),
      universeCoherence: Object.keys(universeCoherence).length ? universeCoherence : null,
      ageStatus: selected?.ageStatus || cohort.findLast(doc => doc.ageStatus)?.ageStatus || 'not-established',
      sourceRefs: unique(documents.flatMap(doc => lines(doc.sourceRefs))),
      limitations: unique(documents.flatMap(doc => [...lines(doc.limitations), ...lines(doc.scopeLimitations), ...lines(doc.limits)])),
      references: dedupeRefs(references), identityVisualReferences: dedupeRefs(identityVisualReferences),
      documents,
      canonicalFidelityApproved: false, visualFidelityApproved: false
    };
    result.set(id, evidence);
  }
  return result;
}

/** Qualified source targets, never approval of any generated target image. */
export function loadQualifiedCgIdentityLocks(root) {
  const qualified = new Map();
  for (const [id, evidence] of loadCgSourceEvidence(root)) {
    if (!evidence.incarnation || !specificLocks(evidence.visualLocks) || !evidence.identityVisualReferences.length) continue;
    const visualAnchor = unique(Object.values(evidence.visualLocks).flat()).join(' ');
    const explicit = ['equipment', 'signatureWeapon', 'leftForearm', 'leftShoulder'].flatMap(axis => lines(evidence.visualLocks[axis]));
    const equipment = unique([...lines(evidence.equipment), ...explicit]);
    if (!equipment.length) equipment.push(...unique(Object.values(evidence.visualLocks).flat().filter(line => /\barc\b|\bbow\b|\bspear\b|\bFocus\b|arme|weapon|rifle|fusil|sword|épée|shield|bouclier|gauntlet|gantelet/i.test(line))));
    qualified.set(id, {
      incarnation: evidence.incarnation, visualAnchor, equipment,
      referenceUrls: unique(evidence.identityVisualReferences.map(ref => ref.url)),
      sourceEvidenceFiles: evidence.sourceEvidenceFiles,
      identityVisualReferences: evidence.identityVisualReferences,
      visualLocks: evidence.visualLocks, universeCoherence: evidence.universeCoherence || null,
      ageStatus: evidence.ageStatus || 'not-established',
      evidenceStatus: 'source-inspected-target-not-fidelity-approval', visualFidelityApproved: false
    });
  }
  return qualified;
}
