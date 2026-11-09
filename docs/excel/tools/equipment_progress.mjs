/**
 * Carry manual Actions progress between exports without depending on row order.
 *
 * Excel access belongs to the caller: pass the header row and data-row values,
 * and reject actual Excel formulas outside the calculated « Résultat du suivi »
 * column before calling parsePreviousActions. A string value alone cannot reveal
 * whether Excel evaluated a formula. This pure module preserves literal strings
 * exactly. The writer must preserve +, - and @ as text and reject a leading =
 * if its spreadsheet engine would infer a formula from that input.
 */
export const EQUIPMENT_PROGRESS_SCHEMA = 'equipment-progress-v1';
export const EQUIPMENT_PROGRESS_STATUSES = Object.freeze(['À faire', 'En cours', 'À vérifier', 'Terminé']);

/** Exact worksheet headings, also defining the A:J comparison-field mapping. */
export const EQUIPMENT_ACTION_HEADERS = Object.freeze([
  'Priorité', 'Personnage ou objet', 'Univers', 'Type de dossier',
  'Manques / vérifications', 'Travaux à réaliser', 'Constats et preuves source',
  'État au relevé', 'Clé concernée', 'Source', 'Avancement',
  'Preuve de réalisation', 'Responsable', 'Résultat du suivi', 'ID dossier',
  'Points regroupés', 'IDs des constats',
]);
const REVIEW_FIELDS = Object.freeze([
  'priority', 'name', 'universe', 'type', 'issue', 'action', 'evidence',
  'observed', 'key', 'source',
]);
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

/** Fail before merging if an identity or cell would make the import ambiguous. */
function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

/** Require an explicit, single-line identity; never guess or repair its value. */
function identity(value, context) {
  requireCondition(typeof value === 'string' && value.trim() !== '', `${context}: missing or non-text ID`);
  requireCondition(!/[\r\n]/u.test(value), `${context}: ID must occupy one line`);
  return value;
}

/** Keep manual inputs exactly, including intentional spacing and line breaks. */
function inputText(value, context, allowBlankCell = false) {
  if (allowBlankCell && value == null) return '';
  requireCondition(typeof value === 'string', `${context}: expected text, not a formula object or other value`);
  return value;
}

/** Accept only the four published dropdown values, without silently fixing them. */
function statusValue(value, context) {
  requireCondition(EQUIPMENT_PROGRESS_STATUSES.includes(value), `${context}: invalid progress status`);
  return value;
}

/**
 * Normalize review data only: LF line endings and surrounding whitespace.
 * Worksheet values may retain the apostrophe added by literal(); remove only
 * that protection, never apostrophes from the manual progress fields.
 * Source links to this repository may be repinned to a new commit without a
 * content change. Only their 40-hex blob ref is ignored; paths and other URLs
 * remain significant, and the delivered action keeps its original source.
 */
function reviewText(value, context, fromWorksheet = false, field = '') {
  if (value == null) return '';
  requireCondition(['string', 'number', 'boolean'].includes(typeof value), `${context}: invalid review cell`);
  requireCondition(typeof value !== 'number' || Number.isFinite(value), `${context}: invalid numeric review cell`);
  let result = String(value).replace(/\r\n?/gu, '\n');
  if (fromWorksheet && /^'[\s\uFEFF]*[=+@-]/u.test(result)) result = result.slice(1);
  result = result.trim();
  if (field === 'source') result = result.replace(
    /(^|\n)(https:\/\/github\.com\/darknigthmare\/multiverse-breach\/blob\/)[a-fA-F0-9]{40}\//gu,
    '$1$2{commit}/',
  );
  return result;
}

/** Preserve finding order while rejecting blank or repeated identities. */
function findingIds(value, context) {
  const values = typeof value === 'string' ? value.replace(/\r\n?/gu, '\n').split('\n') : value;
  requireCondition(Array.isArray(values) && values.length > 0, `${context}: missing finding IDs`);
  const result = values.map((id, index) => identity(id, `${context} finding ${index + 1}`));
  requireCondition(new Set(result).size === result.length, `${context}: duplicate finding ID`);
  return result;
}

/** A finding must belong to exactly one dossier within each snapshot. */
function validateUniqueRecords(records, context) {
  const dossiers = new Set(), owners = new Map();
  for (const record of records) {
    requireCondition(!dossiers.has(record.id), `${context}: duplicate dossier ID ${record.id}`);
    dossiers.add(record.id);
    for (const id of record.findingIds) {
      requireCondition(!owners.has(id), `${context}: ambiguous finding ID ${id}`);
      owners.set(id, record.id);
    }
  }
  return owners;
}

/** Require the complete comparison content instead of accepting a partial proof. */
function comparisonContent(value, context) {
  requireCondition(value && typeof value === 'object' && !Array.isArray(value), `${context}: missing reviewContent`);
  return Object.fromEntries(REVIEW_FIELDS.map(field => {
    requireCondition(own(value, field), `${context}: missing reviewContent.${field}`);
    return [field, reviewText(value[field], `${context}.${field}`, false, field)];
  }));
}

/** Validate a previously parsed snapshot, including callers supplying JSON. */
function previousRecords(snapshot) {
  if (snapshot == null) return [];
  requireCondition(snapshot.schema === EQUIPMENT_PROGRESS_SCHEMA, 'Unsupported equipment progress schema');
  requireCondition(Array.isArray(snapshot.records), 'Progress snapshot records must be an array');
  const records = snapshot.records.map((record, index) => {
    const context = `Previous dossier ${index + 1}`;
    requireCondition(record && typeof record === 'object' && !Array.isArray(record), `${context}: invalid record`);
    return {
      id: identity(record.id, context),
      status: statusValue(record.status, context),
      proof: inputText(record.proof, `${context} proof`),
      owner: inputText(record.owner, `${context} owner`),
      findingIds: findingIds(record.findingIds, context),
      reviewContent: comparisonContent(record.reviewContent, context),
    };
  });
  validateUniqueRecords(records, 'Previous snapshot');
  return records;
}

/**
 * Parse Actions values using exact header names, regardless of column order.
 * headers is a flat array (the first row of range.values); rows contains data
 * rows only. All published headers except the calculated result are required.
 * Empty Excel proof/owner cells (null or undefined) become empty strings;
 * populated inputs must already be strings. The calculated result is ignored.
 * reviewContent uses {priority,name,universe,type,issue,action,evidence,
 * observed,key,source}; findingIds is an ordered array of nonempty strings.
 */
export function parsePreviousActions(headers, rows) {
  requireCondition(Array.isArray(headers) && headers.length > 0, 'Actions headers must be a flat array');
  requireCondition(Array.isArray(rows), 'Actions rows must be an array');
  const positions = new Map();
  headers.forEach((header, index) => {
    requireCondition(typeof header === 'string' && header !== '', 'Actions header must be nonempty text');
    requireCondition(!positions.has(header), `Duplicate Actions header: ${header}`);
    positions.set(header, index);
  });
  for (const header of EQUIPMENT_ACTION_HEADERS) {
    if (header !== 'Résultat du suivi') requireCondition(positions.has(header), `Missing Actions header: ${header}`);
  }
  const records = rows.map((row, index) => {
    const context = `Actions row ${index + 7}`;
    requireCondition(Array.isArray(row) && row.length === headers.length, `${context}: incomplete row`);
    const cell = header => row[positions.get(header)];
    const ids = findingIds(cell('IDs des constats'), context);
    const count = cell('Points regroupés');
    requireCondition((typeof count === 'number' || (typeof count === 'string' && /^\d+$/u.test(count)))
      && Number.isSafeInteger(Number(count)) && Number(count) === ids.length,
    `${context}: finding count does not match IDs`);
    return {
      id: identity(cell('ID dossier'), context),
      status: statusValue(cell('Avancement'), context),
      proof: inputText(cell('Preuve de réalisation'), `${context} proof`, true),
      owner: inputText(cell('Responsable'), `${context} owner`, true),
      findingIds: ids,
      reviewContent: Object.fromEntries(REVIEW_FIELDS.map((field, i) =>
        [field, reviewText(cell(EQUIPMENT_ACTION_HEADERS[i]), `${context}.${field}`, true, field)])),
    };
  });
  validateUniqueRecords(records, 'Actions worksheet');
  return { schema: EQUIPMENT_PROGRESS_SCHEMA, records };
}

/**
 * Merge by immutable dossier ID, retaining K:M without modifying either input.
 * New finding IDs or changed A:J review content reopen a dossier as À vérifier.
 * Removed findings alone never complete a dossier; removed dossiers are retained
 * separately with their previous status and proof. Moving one finding ID to a
 * different dossier is rejected as an ambiguous identity change.
 *
 * Returned records retain the current action fields and add status/proof/owner,
 * normalized reviewContent and separate progressChange metadata. summary counts
 * active records only; completedWithProof requires non-whitespace proof text.
 * reopened contains the full reasons also exposed in each affected record.
 */
export function mergeEquipmentProgress(actionRecords, previousSnapshot = null) {
  requireCondition(Array.isArray(actionRecords), 'Current actions must be an array');
  const previous = previousRecords(previousSnapshot);
  const current = actionRecords.map((record, index) => {
    const context = `Current dossier ${index + 1}`;
    requireCondition(record && typeof record === 'object' && !Array.isArray(record), `${context}: invalid record`);
    const ids = findingIds(record.findingIds, context);
    requireCondition(Number.isSafeInteger(record.findingCount) && record.findingCount === ids.length,
      `${context}: finding count does not match IDs`);
    return { id: identity(record.id, context), findingIds: ids, reviewContent: comparisonContent(record, context), action: record };
  });
  const currentOwners = validateUniqueRecords(current, 'Current actions');
  const previousOwners = validateUniqueRecords(previous, 'Previous snapshot');
  for (const [id, owner] of currentOwners) {
    requireCondition(!previousOwners.has(id) || previousOwners.get(id) === owner,
      `Ambiguous finding ID ${id}: changed dossier from ${previousOwners.get(id)} to ${owner}`);
  }
  const previousById = new Map(previous.map(record => [record.id, record]));
  const currentIds = new Set(current.map(record => record.id));
  const summary = { total: current.length, previous: previous.length, new: 0, matched: 0, reopened: 0, retired: 0, completedWithProof: 0 };
  const reopened = [];
  const records = current.map(record => {
    const old = previousById.get(record.id);
    if (!old) {
      summary.new++;
      return { ...record.action, status: 'À faire', proof: '', owner: '', reviewContent: record.reviewContent,
        progressChange: { kind: 'new', reason: 'Nouveau dossier : suivi initialisé à À faire.' } };
    }
    summary.matched++;
    const oldIds = new Set(old.findingIds), newIds = new Set(record.findingIds);
    const addedFindingIds = record.findingIds.filter(id => !oldIds.has(id));
    const removedFindingIds = old.findingIds.filter(id => !newIds.has(id));
    const changedFields = REVIEW_FIELDS.filter(field => old.reviewContent[field] !== record.reviewContent[field]);
    const reasonCodes = [];
    if (addedFindingIds.length) reasonCodes.push('NEW_FINDINGS');
    if (changedFields.length) reasonCodes.push('REVIEW_CONTENT_CHANGED');
    const changed = reasonCodes.length > 0;
    const reason = changed
      ? [addedFindingIds.length ? 'De nouveaux constats doivent être examinés.' : '',
        changedFields.length ? 'Le contenu à examiner a changé.' : ''].filter(Boolean).join(' ')
      : removedFindingIds.length ? 'Suivi conservé ; des constats ont disparu du relevé, sans clôture automatique.'
        : 'Suivi conservé : constats et contenu à examiner inchangés.';
    const progressChange = { kind: changed ? 'reopened' : 'preserved', previousStatus: old.status,
      reason, reasonCodes, addedFindingIds, removedFindingIds, changedFields };
    if (changed) {
      summary.reopened++;
      reopened.push({ id: record.id, ...progressChange });
    }
    return { ...record.action, status: changed ? 'À vérifier' : old.status, proof: old.proof, owner: old.owner,
      reviewContent: record.reviewContent, progressChange };
  });
  const retiredRecords = previous.filter(record => !currentIds.has(record.id)).map(record => ({ ...record,
    progressChange: { kind: 'retired', reason: 'Dossier absent du nouveau relevé ; ancien suivi conservé, sans clôture automatique.' } }));
  summary.retired = retiredRecords.length;
  summary.completedWithProof = records.filter(record => record.status === 'Terminé' && record.proof.trim() !== '').length;
  return { records, summary, retiredRecords, reopened };
}
