import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';
import { mergeEquipmentProgress } from './equipment_progress.mjs';

const [dataPath, canonicalPath, comparisonPath, outputPath, previewDir, explicitPreviousPath] = process.argv.slice(2);
if (!previewDir || process.argv.length > 8) throw new Error('Usage: build_equipment_workbook.mjs DATA.json CANON.json COMPARISON.json OUTPUT.xlsx PREVIEW_DIR [PREVIOUS.xlsx]');
const fileHash = async filename => createHash('sha256').update(await fs.readFile(filename)).digest('hex');
const outputExists = await fs.stat(outputPath).then(() => true, error => { if (error.code === 'ENOENT') return false; throw error; });
if (outputExists && explicitPreviousPath && path.resolve(explicitPreviousPath) !== path.resolve(outputPath)) {
  throw new Error('OUTPUT.xlsx already exists and differs from PREVIOUS.xlsx. Choose a new output path to preserve its progress.');
}
const previousPath = explicitPreviousPath || (outputExists ? outputPath : undefined);
let previousProgress = null;
if (previousPath) {
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'multiverse-equipment-progress-'));
  try {
    const snapshotPath = path.join(staging, 'previous-progress.json');
    const readerPath = fileURLToPath(new URL('./read_equipment_progress.mjs', import.meta.url));
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['--max-old-space-size=2048', readerPath, previousPath, snapshotPath], { stdio: 'inherit' });
      child.once('error', reject);
      child.once('exit', (code, signal) => code === 0 ? resolve() : reject(new Error('Previous workbook reader failed: ' + (signal || code))));
    });
    previousProgress = JSON.parse(await fs.readFile(snapshotPath, 'utf8'));
  } finally {
    await fs.rm(staging, { recursive: true, force: true });
  }
}
const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
const canon = JSON.parse(await fs.readFile(canonicalPath, 'utf8'));
const comparison = JSON.parse(await fs.readFile(comparisonPath, 'utf8'));
const sourceCommit = data.metadata.sourceCommit;
assert.match(sourceCommit, /^[a-f0-9]{40}$/);
for (const field of ['actors', 'items', 'associations', 'gaps']) assert(Array.isArray(data[field]), field);
assert(Array.isArray(canon.rows));
assert(Array.isArray(canon.sources));
const text = value => value == null ? '' : typeof value === 'string' ? value
  : Array.isArray(value) ? value.map(text).filter(Boolean).join('\n')
    : typeof value === 'object' ? Object.entries(value).map(([k, v]) => k + ': ' + text(v)).join('\n') : String(value);
const literal = value => {
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  const str = text(value);
  assert(str.length <= 32760, 'Excel cell limit exceeded');
  return /^[\s\uFEFF]*[=+@-]/u.test(str) ? "'" + str : str;
};
// The managed engine infers formulas from strings beginning with '='. Refuse
// those rare manual inputs instead of silently adding a character or executing
// them. Other text, including leading +, - and @, is preserved exactly.
const manualText = value => {
  assert.equal(typeof value, 'string', 'Manual progress must be text');
  assert(!/^[\s\uFEFF]*=/u.test(value), 'Manual progress starts with =. Use ordinary text before regenerating; no workbook has been replaced.');
  assert(value.length <= 32760, 'Excel cell limit exceeded');
  return value;
};
const unique = (rows, key) => {
  assert(rows.every(row => typeof row[key] === 'string' && row[key]), 'Missing key ' + key);
  assert.equal(new Set(rows.map(row => row[key])).size, rows.length, 'Duplicate key ' + key);
};
unique(data.actors, 'actorKey');
unique(data.items, 'itemKey');
unique(data.associations, 'associationKey');
unique(data.gaps, 'gapKey');
unique(canon.rows, 'id');
unique(canon.sources, 'sourceId');
const actorKeys = new Set(data.actors.map(row => row.actorKey));
const actorByKey = new Map(data.actors.map(row => [row.actorKey, row]));
const itemKeys = new Set(data.items.map(row => row.itemKey));
const sourceById = new Map(canon.sources.map(row => [row.sourceId, row]));
const referencesByActor = new Map();
for (const row of data.associations) {
  assert(actorKeys.has(row.actorKey), 'Unknown actor in association');
  if (row.itemKey) assert(itemKeys.has(row.itemKey), 'Unknown item in association');
}
for (const row of canon.rows) {
  assert(actorKeys.has(row.actorKey), 'Unknown actor in canonical references: ' + row.actorName);
  const actor = actorByKey.get(row.actorKey);
  for (const field of ['actorId', 'actorName', 'universe', 'incarnation']) {
    assert.equal(row[field] || '', actor[field] || '', 'Canonical actor mismatch: ' + row.id + ' / ' + field);
  }
  assert(sourceById.has(row.sourceId), 'Unknown canonical source: ' + row.sourceId);
  assert.notEqual(row.canonicalFidelityApproved, true);
  if (!referencesByActor.has(row.actorKey)) referencesByActor.set(row.actorKey, []);
  referencesByActor.get(row.actorKey).push(row);
}
const researchDate = canon.meta?.updatedOn || canon.meta?.checkedOn || data.metadata.asOfDate;
const researchDateLabel = new Date(researchDate + 'T00:00:00Z').toLocaleDateString('fr-FR', { timeZone: 'UTC' });
const inventoryDateLabel = new Date(data.metadata.asOfDate + 'T00:00:00Z').toLocaleDateString('fr-FR', { timeZone: 'UTC' });
const documentedEquipment = actorKey => {
  const editions = new Map();
  for (const reference of referencesByActor.get(actorKey) || []) {
    if (!editions.has(reference.sourceEdition)) editions.set(reference.sourceEdition, []);
    editions.get(reference.sourceEdition).push(reference.canonicalItemName);
  }
  return [...editions].map(([edition, items]) => edition + ' : ' + [...new Set(items)].join(' ; ')).join('\n');
};

const labels = {
  hero: 'Héros', enemy: 'Adversaire', boss: 'Boss', worldBoss: 'Boss de monde',
  actor: 'Personnage', item: 'Objet', canonical: 'Référence ciblée',
  ORIGINAL: 'Création originale', EXTERNAL: 'Œuvre externe',
  ALIAS_ARME_NON_MODELE: 'Correspondance du modèle à vérifier',
  DOTATION_ET_RENDU_A_VERIFIER: 'Dotation et rendu à vérifier',
  EXCLUSION_DOTATION_A_CONSERVER: 'Exclusion de dotation à conserver',
  ICONE_RESOLUE_ABSENTE: 'Icône absente de Git',
  INCARNATION_NON_FIXEE: 'Incarnation à fixer',
  INVENTAIRE_INDIVIDUEL_ABSENT: 'Liste individuelle absente',
  NATURE_PHYSIQUE_A_VERIFIER: 'Nature physique à vérifier',
  PORTEUR_TEXTE_NON_LIE: 'Porteur textuel sans lien explicite',
  REVUE_VISUELLE_1A1_OUVERTE: 'Revue visuelle 1:1 à réaliser',
  SOURCE_INDIVIDUELLE_ABSENTE: 'Source individuelle absente',
  SOURCE_OBJET_ABSENTE: 'Source d’objet absente',
  KIT_DECLARE: 'Entrée de la liste equipment',
  CHAMP_ARME_DECLARE: 'Champ d’arme descriptif',
  OBJET_DE_SCENE_DECLARE: 'Accessoire de scène',
  TECHNIQUE_SIGNEE_NON_EQUIPEMENT: 'Technique ou signature',
  ARME_OU_OUTIL_NOMME: 'Arme ou outil nommé',
  OBJET_OU_CONSOMMABLE_NOMME: 'Objet ou consommable nommé',
  PROTECTION_OU_EQUIPEMENT: 'Protection ou équipement',
  TENUE_OU_ACCESSOIRE: 'Tenue ou accessoire',
  POUVOIR_OU_INFORMATION: 'Pouvoir ou information',
  NATURE_A_DETERMINER: 'Nature à déterminer',
  EVENEMENT_OU_ATTAQUE: 'Événement ou attaque',
  INVOCATION_OU_RENFORT: 'Invocation ou renfort',
  ABSTRACTION_OU_RELIQUE_A_REVOIR: 'Relique ou abstraction à revoir',
  DESIGN_ORIGINAL_A_PRECISER: 'Création originale à préciser',
  PRESENT_DANS_GIT: 'Présent dans Git', ABSENT_DANS_GIT: 'Absent de Git',
  TECHNIQUE_DE_COMBAT: 'Technique de combat',
  ORIGINAL_DESIGN: 'Création originale',
  EXTERNAL_OR_UNRESOLVED: 'Œuvre externe ou origine à résoudre',
  ORIGINAL_DESIGN_OR_ADAPTATION: 'Création originale ou adaptation',
  LISTE_DECLAREE_NON_CERTIFIEE: 'Liste déclarée, revue ouverte',
  INVENTAIRE_INDIVIDUEL_A_COMPLETER: 'Liste individuelle à compléter',
  AUCUNE_CERTIFICATION_1A1: 'Fidélité 1:1 non certifiée',
  DECLARATION_DU_CODE_A_VERIFIER: 'Déclaration du code à vérifier',
  OUVERT: 'Ouvert',
  'edition-exclusive': 'Propre à cette édition',
  'incarnation-variant': 'Variante d’incarnation',
  'licensed-representation': 'Représentation sous licence',
  'obtainable-in-source': 'Accessible dans l’œuvre',
  'personal-model': 'Modèle personnel', scene: 'Accessoire de scène', signature: 'Objet emblématique'
};
const label = value => labels[value] || text(value);
const union = (...arrays) => [...new Set(arrays.flat().filter(Boolean))];
const columns = n => { let s = ''; for (let i = n + 1; i; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s; return s; };
const colors = { ink: '#172B3D', navy: '#203E59', pale: '#EEF3F7', muted: '#5D7182', input: '#FFF6DA', red: '#FCE4E0' };
const wb = Workbook.create();
const sheetNames = ['Synthèse', 'Évolutions', 'Personnages', 'Armes et objets', 'Affectations', 'Références 1a1', 'Actions'];
const sheets = Object.fromEntries(sheetNames.map(name => [name, wb.worksheets.add(name)]));
const last = {};
const previewJobs = [];
function makeTable(name, title, subtitle, headers, rows, widths, tableName, freezeColumns = 3, manualColumns = []) {
  const sheet = sheets[name], right = columns(headers.length - 1), end = rows.length + 6;
  assert(rows.length > 0);
  assert(rows.every(row => row.length === headers.length));
  last[name] = end;
  sheet.showGridLines = false;
  sheet.getRange('A1:' + right + end).format.font = { name: 'Arial', size: 10, color: colors.ink };
  sheet.getRange('A1:' + right + end).format.verticalAlignment = 'center';
  widths.forEach((width, i) => { sheet.getRange(columns(i) + '1:' + columns(i) + end).format.columnWidth = width; });
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format.font = { name: 'Arial', size: 15, bold: true, color: colors.navy };
  sheet.getRange('A2:' + right + '2').format.rowHeight = 27;
  sheet.getRange('A3').values = [[subtitle]];
  sheet.getRange('A3').format.font = { name: 'Arial', size: 10, italic: true, color: colors.muted };
  sheet.getRange('A4:' + right + '4').format.borders = { bottom: { style: 'thin', color: '#C5D3DF' } };
  sheet.getRange('A6:' + right + '6').values = [headers];
  for (let at = 0; at < rows.length; at += 600) {
    const part = rows.slice(at, at + 600).map(row => row.map((value, column) => manualColumns.includes(column) ? manualText(value) : literal(value)));
    sheet.getRange('A' + (at + 7) + ':' + right + (at + part.length + 6)).values = part;
  }
  const table = sheet.tables.add('A6:' + right + end, true, tableName);
  table.style = 'TableStyleMedium2';
  table.showFilterButton = true;
  sheet.getRange('A6:' + right + '6').format = {
    fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' },
    wrapText: true, horizontalAlignment: 'center', verticalAlignment: 'center', rowHeight: 35,
    borders: { insideVertical: { style: 'thin', color: '#FFFFFF' } }
  };
  sheet.getRange('A7:' + right + end).format.wrapText = true;
  sheet.getRange('A7:' + right + end).format.verticalAlignment = 'top';
  sheet.getRange('A7:' + right + end).format.rowHeight = 39;
  // Fit wrapped evidence and identifiers without reducing text size.
  let from = 0, height = 0;
  const heights = rows.map(row => Math.min(409, Math.max(39, Math.ceil(Math.max(...row.map((value, i) =>
    text(value).split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / Math.max(8, widths[i] * 0.91))), 0))) * 12.5 + 9))));
  for (let i = 0; i <= heights.length; i++) {
    if (i && (i === heights.length || heights[i] !== height)) {
      if (height !== 39) sheet.getRange('A' + (from + 7) + ':' + right + (i + 6)).format.rowHeight = height;
      from = i;
    }
    height = heights[i];
  }
  sheet.freezePanes.freezeRows(6);
  if (freezeColumns) sheet.freezePanes.freezeColumns(freezeColumns);
  previewJobs.push({ sheetName: name, range: 'A1:' + columns(Math.min(headers.length, 6) - 1) + Math.min(10, end) });
  console.log('Prepared ' + name + ': ' + rows.length + ' rows');
  global.gc?.();
  return sheet;
}

const actorRows = data.actors.map(a => [
  a.actorName, a.universe, label(a.kind), a.incarnation || 'À préciser',
  a.weaponField, a.declaredEquipment, a.sourceProps, a.signatureName,
  a.weaponTypeAlias, a.visualAnchor, a.referenceUrls, label(a.equipmentStatus),
  a.associationCount, a.gapCount, label(a.sourceScope), a.sourcePath, a.sourceUrl, a.actorId, a.actorKey,
  a.nonCombat ? 'Non-combattant déclaré' : 'Pas d’exclusion déclarée',
  '', documentedEquipment(a.actorKey)
]);
makeTable('Personnages', 'Équipements déclarés par personnage',
  'Données du jeu conservées. Les colonnes U et V regroupent les références documentaires et leurs éditions ; conditions dans Références 1a1.',
  ['Personnage', 'Univers', 'Type', 'Incarnation', 'Arme décrite', 'Liste equipment', 'Accessoire de scène', 'Signature résolue', 'Famille technique', 'Contraintes visuelles', 'Références', 'État de la liste', 'Associations', 'Points à compléter', 'Origine', 'Fichier source', 'Source GitHub', 'ID du jeu', 'Clé personnage', 'Exclusion du combat', 'Références documentées', 'Équipements documentés par édition'],
  actorRows, [31, 28, 18, 48, 43, 58, 42, 35, 25, 80, 65, 36, 14, 17, 28, 48, 75, 32, 58, 31, 21, 100], 'EquipmentActors');

const itemRows = data.items.map(a => [
  a.itemName, a.universe, label(a.nature), a.catalog, a.itemId, a.slot || a.role,
  a.sourceOwner, a.incarnation || 'À préciser', a.canonicalName, a.description,
  a.visualAnchor, a.referenceUrls, a.iconPath, label(a.iconStatus), a.natureBasis,
  a.sourceItemId, union(a.linkedItemKeys || [], a.catalogPeerKeys || []), a.boost,
  a.gameplayPolicy, a.defaultKitPolicy, label(a.fidelityStatus), a.sourcePath, a.sourceUrl, a.itemKey
]);
makeTable('Armes et objets', 'Armes, équipements et objets du dépôt',
  'Chaque ligne représente une occurrence de catalogue. Les projections et invocations ne sont pas des armes distinctes.',
  ['Nom dans le jeu', 'Univers', 'Nature', 'Registre', 'ID objet', 'Emplacement / rôle', 'Porteur déclaré', 'Incarnation', 'Nom de référence', 'Description', 'Contraintes visuelles', 'Références', 'Icône résolue', 'État du fichier', 'Raison du classement', 'ID source', 'Autres entrées liées', 'Bonus', 'Règle de gameplay', 'Règle de dotation', 'État fidélité', 'Fichier source', 'Source GitHub', 'Clé catalogue'],
  itemRows, [37, 28, 29, 19, 35, 24, 30, 48, 38, 90, 90, 65, 70, 23, 65, 34, 75, 28, 65, 65, 45, 48, 75, 65], 'EquipmentItems');

makeTable('Affectations', 'Affectations explicites relevées dans le code',
  'La compatibilité dans le crossover et la possession dans l’œuvre source sont deux informations différentes.',
  ['Personnage', 'Univers', 'Arme, objet ou déclaration', 'Nature', 'Relation', 'Champ de preuve', 'Preuve du code', 'Références', 'État fidélité', 'Fichier source', 'Source GitHub', 'Clé personnage', 'Clé catalogue liée', 'ID association'],
  data.associations.map(a => [a.actorName, a.universe, a.label, label(a.nature), label(a.relationship), a.evidenceField, a.evidence, a.referenceUrls, label(a.fidelityStatus), a.sourcePath, a.sourceUrl, a.actorKey, a.itemKey, a.associationKey]),
  [31, 28, 46, 30, 34, 37, 90, 65, 45, 48, 75, 58, 65, 85], 'EquipmentAssociations');

makeTable('Références 1a1', 'Références d’armes et équipements par incarnation',
  'Corpus enrichi le ' + researchDateLabel + '. Chaque source garde sa date de vérification ; les attributions conditionnelles restent à confirmer.',
  ['Personnage', 'Univers', 'Arme ou équipement', 'Catégorie', 'Œuvre et édition', 'Incarnation dans le jeu', 'Relation dans la source', 'Détails confirmés', 'Traits visuels', 'Compatibilité / exclusions', 'Application au jeu', 'À compléter', 'État fidélité', 'Source', 'Type de source', 'URL', 'Accès et vérification', 'Limites de la source', 'ID référence', 'Clé personnage', 'Repère dans la source', 'Page de contexte'],
  canon.rows.map(a => { const s = sourceById.get(a.sourceId); return [a.actorName, a.universe, a.canonicalItemName, a.category, a.sourceEdition, a.incarnation || 'À sélectionner', label(a.relationship), a.sourceEvidence, a.visualTraits, a.continuityConstraint, a.applicationStatus, a.implementationGap, a.fidelityStatus, s.title, a.sourceType || s.type, a.sourceUrl || s.url, s.retrieval, s.limitations, a.id, a.actorKey, a.evidenceLocator || s.evidenceLocator || '', s.parentUrl || '']; }),
  [31, 28, 43, 25, 63, 60, 65, 90, 85, 90, 52, 90, 50, 63, 35, 78, 66, 90, 22, 58, 75, 78], 'EquipmentCanonical');
// Literal comparison avoids COUNTIFS treating * and ? as wildcard patterns.
// Every result is checked against the case-sensitive source keys before export.
const actorSheet = sheets.Personnages;
actorSheet.getRange('U7').formulas = [["=SUMPRODUCT(--('Références 1a1'!$T$7:$T$" + last['Références 1a1'] + '=S7))']];
actorSheet.getRange('U7:U' + last.Personnages).fillDown();
actorSheet.getRange('U7:U' + last.Personnages).setNumberFormat('#,##0');
actorSheet.getRange('U7:U' + last.Personnages).format.horizontalAlignment = 'right';

// One dossier per actor or catalogue occurrence avoids repeating its identity
// and source for every finding. Every original finding and stable ID is kept.
const groupedFindings = new Map();
for (const finding of data.gaps) {
  const key = finding.entityType + ':' + finding.entityKey;
  if (!groupedFindings.has(key)) groupedFindings.set(key, []);
  groupedFindings.get(key).push(finding);
}
const numbered = values => values.map((value, index) => (index + 1) + '. ' + text(value)).join('\n');
let actionRecords = [
  ...[...groupedFindings.values()].map(findings => {
    const a = findings[0];
    assert.equal(new Set(findings.map(f => f.kind)).size, findings.length, 'Duplicate kind within dossier');
    return {
      id: 'dossier:' + a.entityType + ':' + a.entityKey,
      name: a.actorName || a.itemName, universe: a.universe, type: label(a.entityType),
      issue: numbered(findings.map(f => label(f.kind))),
      priority: findings.some(f => f.priority === 'P1') ? 'P1' : 'P2',
      action: numbered(findings.map(f => f.action)), evidence: numbered(findings.map(f => f.evidence)),
      observed: union(findings.map(f => label(f.status))).join('\n'), key: a.entityKey,
      source: union(findings.map(f => f.sourceUrl)).join('\n'),
      findingCount: findings.length, findingIds: findings.map(f => f.gapKey).join('\n')
    };
  }),
  ...canon.rows.map(a => ({ id: 'canonical:' + a.id, name: a.actorName + ' — ' + a.canonicalItemName, universe: a.universe, type: 'Référence ciblée', issue: 'Référence à confronter à la dotation', priority: 'P1', action: a.implementationGap, evidence: a.sourceEvidence, observed: a.applicationStatus, key: a.actorKey, source: a.sourceUrl, findingCount: 1, findingIds: 'canonical:' + a.id }))
];
unique(actionRecords, 'id');
const allFindingIds = actionRecords.flatMap(a => a.findingIds.split('\n'));
assert.equal(allFindingIds.length, data.gaps.length + canon.rows.length);
assert.equal(new Set(allFindingIds).size, allFindingIds.length, 'Finding lost or duplicated in dossiers');
const progress = mergeEquipmentProgress(actionRecords, previousProgress);
actionRecords = progress.records;
const actions = makeTable('Actions', 'Manquants et suivi de réalisation',
  'Un dossier regroupe tous les points du personnage ou de l’objet. Terminer après traitement de chaque point, avec preuve.',
  ['Priorité', 'Personnage ou objet', 'Univers', 'Type de dossier', 'Manques / vérifications', 'Travaux à réaliser', 'Constats et preuves source', 'État au relevé', 'Clé concernée', 'Source', 'Avancement', 'Preuve de réalisation', 'Responsable', 'Résultat du suivi', 'ID dossier', 'Points regroupés', 'IDs des constats'],
  actionRecords.map(a => [a.priority, a.name, a.universe, a.type, a.issue, a.action, a.evidence, a.observed, a.key, a.source, a.status, a.proof, a.owner, '', a.id, a.findingCount, a.findingIds]),
  [13, 40, 28, 23, 48, 100, 95, 43, 65, 80, 23, 80, 26, 28, 85, 18, 100], 'EquipmentActions', 3, [10, 11, 12]);
actions.getRange('K7:M' + last.Actions).format.fill = colors.input;
actions.getRange('K7:K' + last.Actions).dataValidation = { rule: { type: 'list', values: ['À faire', 'En cours', 'À vérifier', 'Terminé'] } };
actions.getRange('N7').formulas = [['=IF(K7="Terminé",IF(LEN(TRIM(CLEAN(SUBSTITUTE(L7,CHAR(160)," "))))=0,"Preuve manquante","Terminée avec preuve"),K7)']];
actions.getRange('N7:N' + last.Actions).fillDown();
actions.getRange('N7:N' + last.Actions).conditionalFormats.add('containsText', { text: 'Preuve manquante', format: { fill: colors.red, font: { color: '#8C2820', bold: true } } });
actions.getRange('A7:A' + last.Actions).conditionalFormats.add('containsText', { text: 'P1', format: { fill: colors.input, font: { color: '#775118', bold: true } } });

const changes = makeTable('Évolutions', 'Évolution depuis le relevé du 24 octobre',
  comparison.methodLabel,
  ['Indicateur', '24 octobre', '26 octobre', 'Écart', 'Interprétation', 'Source initiale', 'Source actuelle'],
  comparison.metrics.map(a => [a.label, a.before, a.after, '', a.interpretation, comparison.previousUrl, comparison.currentUrl]),
  [43, 16, 16, 13, 86, 78, 78], 'EquipmentChanges', 1);
changes.getRange('D7').formulas = [['=C7-B7']];
changes.getRange('D7:D' + last['Évolutions']).fillDown();
changes.getRange('B7:D' + last['Évolutions']).setNumberFormat('#,##0');
const statusStart = last['Évolutions'] + 4;
changes.getRange('A' + statusStart + ':G' + (statusStart + comparison.githubStatus.length)).format.font = { name: 'Arial', size: 10, color: colors.ink };
changes.getRange('A' + statusStart + ':G' + (statusStart + comparison.githubStatus.length)).format.verticalAlignment = 'top';
changes.getRange('A' + statusStart + ':E' + statusStart).values = [['Travaux GitHub', 'État', 'Date du contrôle', '', 'Conséquence pour cet inventaire']];
changes.getRange('A' + statusStart + ':E' + statusStart).format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, wrapText: true, rowHeight: 32 };
comparison.githubStatus.forEach((a, i) => {
  const r = statusStart + 1 + i;
  changes.getRange('A' + r + ':E' + r).values = [[a.subject, a.state, new Date('2026-10-26T00:00:00Z'), '', a.consequence]];
  changes.getRange('A' + r + ':E' + r).format.wrapText = true;
  changes.getRange('A' + r + ':E' + r).format.rowHeight = 56;
  changes.getRange('C' + r).setNumberFormat('dd/mm/yyyy');
  changes.getRange('F' + r).values = [[a.url]];
  changes.getRange('F' + r).format.wrapText = true;
});

const summary = sheets['Synthèse'];
summary.showGridLines = false;
summary.tabColor = colors.navy;
summary.getRange('A1:D54').format.font = { name: 'Arial', size: 10, color: colors.ink };
summary.getRange('A1:D54').format.verticalAlignment = 'center';
summary.getRange('A1:A54').format.columnWidth = 47;
summary.getRange('B1:B54').format.columnWidth = 15;
summary.getRange('C1:C54').format.columnWidth = 4;
summary.getRange('D1:D54').format.columnWidth = 102;
summary.getRange('A2').values = [['Multiverse Breach — armes et équipements']];
summary.getRange('A2').format.font = { name: 'Arial', size: 16, bold: true, color: colors.navy };
summary.getRange('A2:D2').format.rowHeight = 29;
summary.getRange('A3').values = [['Inventaire du dépôt au ' + inventoryDateLabel + ' ; références documentaires enrichies le ' + researchDateLabel]];
summary.getRange('A3').format.font = { name: 'Arial', size: 10, italic: true, color: colors.muted };
summary.getRange('A4:D4').format.borders = { bottom: { style: 'thin', color: '#C5D3DF' } };
summary.getRange('A6:B6').values = [['Indicateur', 'Total']];
summary.getRange('A6:B6').format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', rowHeight: 29 };
summary.getRange('D6').values = [['Périmètre']];
summary.getRange('D6').format.font.bold = true;
const summaryMetrics = [
  ['Personnages et adversaires', "=COUNTA('Personnages'!A7:A" + last.Personnages + ')', 'Tous les acteurs actifs, Ancre du joueur comprise.'],
  ['Héros, Ancre comprise', "=COUNTIFS('Personnages'!C7:C" + last.Personnages + ',"Héros")', 'Les adversaires, boss et boss de monde ont aussi leurs fiches.'],
  ['Listes individuelles equipment renseignées', data.actors.filter(a => a.declaredEquipment?.length).length, 'Une liste peut contenir objets, vêtements, pouvoirs ou anatomie.'],
  ['Occurrences de catalogue', "=COUNTA('Armes et objets'!A7:A" + last['Armes et objets'] + ')', 'Équipements, événements, combat, boutique et récompenses.'],
  ['Affectations explicites', "=COUNTA('Affectations'!A7:A" + last.Affectations + ')', 'Déclarations d’armes, listes, accessoires et signatures conservés séparément.'],
  ['Références documentaires ciblées', "=COUNTA('Références 1a1'!A7:A" + last['Références 1a1'] + ')', 'Chaque référence précise le personnage, l’œuvre et les conditions d’application.'],
  ['Sources de la recherche ciblée', canon.sources.length, 'Le type de source et les limites sont indiqués dans chaque fiche.'],
  ['Dossiers ouverts', "=COUNTA('Actions'!O7:O" + last.Actions + ")-COUNTIFS('Actions'!N7:N" + last.Actions + ',"Terminée avec preuve")', 'Un dossier regroupe tous les constats d’un personnage ou d’une occurrence ; les ' + canon.rows.length + ' références ont leurs propres lignes.'],
  ['Dossiers terminés avec preuve', "=COUNTIFS('Actions'!N7:N" + last.Actions + ',"Terminée avec preuve")', 'Traiter tous les points du dossier. La présence d’une preuve ne certifie pas sa qualité.'],
  ['Nouvelles validations visuelles 1:1', 0, 'Aucune validation de sprite, animation ou comportement n’est déclarée par cet audit.'],
  ['Points regroupés dans les dossiers', "=SUM('Actions'!P7:P" + last.Actions + ')', 'Tous les constats et leurs identifiants sont conservés ; plusieurs peuvent concerner le même personnage ou objet.']
];
summaryMetrics.forEach((a, i) => {
  const r = i + 7;
  summary.getRange('A' + r).values = [[a[0]]];
  if (typeof a[1] === 'string' && a[1].startsWith('=')) summary.getRange('B' + r).formulas = [[a[1]]];
  else summary.getRange('B' + r).values = [[a[1]]];
  summary.getRange('D' + r).values = [[a[2]]];
});
summary.getRange('A7:A17').format.wrapText = true;
summary.getRange('D7:D17').format.wrapText = true;
summary.getRange('A7:D17').format.rowHeight = 38;
summary.getRange('B7:B17').setNumberFormat('#,##0');
summary.getRange('B7:B17').format.font = { name: 'Arial', size: 12, bold: true, color: colors.navy };
summary.getRange('B7:B17').format.horizontalAlignment = 'right';
summary.getRange('A19:B19').values = [['Constats prioritaires au commit', 'Lignes']];
summary.getRange('A19:B19').format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', rowHeight: 29 };
summary.getRange('D19').values = [['Critère de réalisation']];
summary.getRange('D19').format.font.bold = true;
const focus = [
  ['INVENTAIRE_INDIVIDUEL_ABSENT', 'Renseigner la dotation, ou justifier explicitement l’absence d’équipement.'],
  ['INCARNATION_NON_FIXEE', 'Fixer l’œuvre, l’édition et la période avant de choisir les objets.'],
  ['ALIAS_ARME_NON_MODELE', 'Relier la famille technique au modèle exact ; elle ne prouve pas un bug de combat.'],
  ['SOURCE_OBJET_ABSENTE', 'Ajouter une source précise de l’objet et de son usage.'],
  ['ICONE_RESOLUE_ABSENTE', 'Produire ou relier le fichier, puis contrôler son affichage et son identité.'],
  ['REVUE_VISUELLE_1A1_OUVERTE', 'Comparer proportions, couleurs, détails, port et animations à l’œuvre source.']
];
focus.forEach(([kind, criterion], i) => {
  const r = i + 20;
  summary.getRange('A' + r).values = [[label(kind)]];
  // These are immutable observations from the source revision. Manual dossier
  // progress changes B14/B15, while the original findings remain preserved.
  summary.getRange('B' + r).values = [[data.gaps.filter(a => a.kind === kind).length]];
  summary.getRange('D' + r).values = [[criterion]];
});
summary.getRange('A20:D25').format.rowHeight = 33;
summary.getRange('B20:B25').setNumberFormat('#,##0');
summary.getRange('A28').values = [['Version source']];
summary.getRange('D28').values = [[sourceCommit]];
summary.getRange('A29').values = [['Dépôt']];
summary.getRange('D29').values = [['https://github.com/darknigthmare/multiverse-breach/tree/' + sourceCommit]];
summary.getRange('A31').values = [['Lecture des comptes']];
summary.getRange('D31').values = [['Les occurrences et leurs projections ne sont pas des objets physiques uniques. Les tâches peuvent se recouper.']];
summary.getRange('A32').values = [['Compatibilité des incarnations']];
summary.getRange('D32').values = [['Conserver les variantes séparées : Ripley 1979/1986, Luke ANH–ESB/ROTJ, armures de Chief et éditions des jeux.']];
summary.getRange('A33').values = [['Mettre le suivi à jour']];
summary.getRange('D33').values = [['Filtrer Actions ; traiter tous les points numérotés du dossier avant de renseigner Terminé et sa preuve. Les IDs restent conservés.']];
summary.getRange('A34').values = [['Portée de la recherche']];
summary.getRange('D34').values = [['Le relevé du dépôt est exhaustif ; le recensement de tous les équipements des œuvres sources reste à poursuivre.']];
summary.getRange('A35').values = [['Actualisation des constats']];
summary.getRange('D35').values = [['Les constats prioritaires sont figés au commit source. Le suivi des dossiers est calculé à partir des statuts et preuves.']];
summary.getRange('A28:D35').format.rowHeight = 34;
summary.getRange('D28:D35').format.wrapText = true;
summary.getRange('A36').values = [['Reprendre le suivi existant']];
summary.getRange('D36').values = [['Fournir ce classeur lors de la régénération conserve les statuts, preuves et responsables par ID dossier. Un dossier modifié revient à À vérifier. Les dossiers retirés restent dans le rapport de reprise.']];
summary.getRange('D36').format.wrapText = true;
summary.getRange('A36:D36').format.rowHeight = 49;
summary.getRange('A38:B38').values = [['Recherche documentaire', 'Acteurs']];
summary.getRange('A38:B38').format = { fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', rowHeight: 29 };
summary.getRange('D38').values = [['Portée de la couverture']];
summary.getRange('D38').format.font.bold = true;
summary.getRange('A39:A40').values = [['Avec au moins une référence documentée'], ['Sans référence documentaire ciblée']];
summary.getRange('B39').formulas = [["=COUNTIFS('Personnages'!U7:U" + last.Personnages + ',">0")']];
summary.getRange('B40').formulas = [["=COUNTIFS('Personnages'!U7:U" + last.Personnages + ',0)']];
summary.getRange('D39:D40').values = [['Une référence ne constitue ni une dotation exhaustive ni une validation visuelle 1:1.'], ['Filtrer Personnages, colonne U, sur zéro pour retrouver les fiches à documenter.']];
summary.getRange('A39:D40').format.rowHeight = 38;
summary.getRange('A39:A40').format.wrapText = true;
summary.getRange('D39:D40').format.wrapText = true;
summary.getRange('B39:B40').setNumberFormat('#,##0');
summary.getRange('B39:B40').format.font = { name: 'Arial', size: 12, bold: true, color: colors.navy };
summary.getRange('B39:B40').format.horizontalAlignment = 'right';

console.log('Checking workflow and summary');
const firstProgress = [actionRecords[0].status, actionRecords[0].proof];
const firstWasComplete = firstProgress[0] === 'Terminé' && firstProgress[1].trim() !== '';
const completed = progress.summary.completedWithProof;
actions.getRange('L7').values = [['']];
actions.getRange('K7').values = [['Terminé']];
assert.equal(actions.getRange('N7').values[0][0], 'Preuve manquante');
actions.getRange('L7').values = [[' \t\n\u00a0 ']];
assert.equal(actions.getRange('N7').values[0][0], 'Preuve manquante');
actions.getRange('L7').values = [['https://example.invalid/temporary-test']];
assert.equal(actions.getRange('N7').values[0][0], 'Terminée avec preuve');
assert.equal(summary.getRange('B15').values[0][0], completed - Number(firstWasComplete) + 1);
actions.getRange('K7:L7').values = [firstProgress.map(manualText)];
wb.recalculate();
assert.equal(summary.getRange('B15').values[0][0], completed);
for (const [cell, count] of [['B7', data.actors.length], ['B10', data.items.length], ['B11', data.associations.length], ['B12', canon.rows.length], ['B14', actionRecords.length - completed]]) assert.equal(summary.getRange(cell).values[0][0], count, cell);
assert.equal(summary.getRange('B17').values[0][0], allFindingIds.length);
assert.equal(summary.getRange('B39').values[0][0], referencesByActor.size);
assert.equal(summary.getRange('B40').values[0][0], data.actors.length - referencesByActor.size);
const actorReferenceCounts = actorSheet.getRange('U7:U' + last.Personnages).values;
data.actors.forEach((actor, index) => assert.equal(actorReferenceCounts[index][0], (referencesByActor.get(actor.actorKey) || []).length, 'Reference count for ' + actor.actorKey));
for (let i = 0; i < focus.length; i++) assert.equal(summary.getRange('B' + (20 + i)).values[0][0], data.gaps.filter(a => a.kind === focus[i][0]).length);
await fs.mkdir(previewDir, { recursive: true });
// Persist recovery data before replacing a workbook. The immutable report also
// survives a failure when publishing the convenient progress-carryforward name.
async function prepareProgressReport(outputHash, outputBytes) {
  const progressReportPath = path.join(previewDir, 'progress-carryforward.json');
  const archive = async bytes => {
    const reportHash = createHash('sha256').update(bytes).digest('hex');
    const archivePath = path.join(previewDir, 'progress-carryforward-' + reportHash + '.json');
    await fs.writeFile(archivePath, bytes, { flag: 'wx' }).catch(async error => {
      if (error.code !== 'EEXIST') throw error;
      assert.deepEqual(await fs.readFile(archivePath), bytes, 'Existing progress archive differs from its content hash');
    });
    return archivePath;
  };
  const previousReport = await fs.readFile(progressReportPath).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  if (previousReport) await archive(previousReport);
  const reportBytes = Buffer.from(JSON.stringify({
    schema: 'equipment-progress-carryforward-v1', sourceCommit,
    previousWorkbook: previousProgress?.source || null, summary: progress.summary,
    outputWorkbook: { filename: path.basename(outputPath), sha256: outputHash, bytes: outputBytes },
    reopened: progress.reopened, retiredRecords: progress.retiredRecords,
    retiredRecordsAreCompleted: false
  }, null, 2) + '\n');
  const immutablePath = await archive(reportBytes);
  const temporaryPath = progressReportPath + '.writing-' + randomUUID();
  try {
    await fs.writeFile(temporaryPath, reportBytes, { flag: 'wx' });
  } catch (error) {
    await fs.rm(temporaryPath, { force: true });
    throw error;
  }
  return { progressReportPath, temporaryPath, immutablePath };
}
const inspection = await wb.inspect({ kind: 'table', range: "'Synthèse'!A6:D17", include: 'values,formulas', tableMaxRows: 12, tableMaxCols: 4, maxChars: 7500 });
await fs.writeFile(path.join(previewDir, 'summary-inspection.ndjson'), inspection.ndjson);
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 50 }, summary: 'Final formula error scan', maxChars: 4000 });
await fs.writeFile(path.join(previewDir, 'formula-scan.ndjson'), errors.ndjson);
console.log('Formula scan: ' + errors.ndjson);
const validation = {
  sourceCommit, worksheets: sheetNames, actors: data.actors.length, catalogRecords: data.items.length,
  associations: data.associations.length, canonicalRows: canon.rows.length, sources: canon.sources.length,
  documentedActors: referencesByActor.size, actorsWithoutDocumentaryReference: data.actors.length - referencesByActor.size,
  actions: actionRecords.length, comparisonRows: comparison.metrics.length,
  groupedDossiers: groupedFindings.size, automaticFindings: data.gaps.length,
  documentaryFollowups: canon.rows.length, totalFindings: allFindingIds.length,
  allFindingIdsPreserved: true,
  priorityFindingCountsAreSourceSnapshot: true,
  progressCarryforward: progress.summary,
  summaryCountsChecked: true, workflowWithAndWithoutProofChecked: true,
  testedEngine: '@oai/artifact-tool', excelDesktopTested: false, canonicalFidelityApproved: false
};
// The workbook owns literal cell values now. Release input projections before
// serializing the large XLSX; --expose-gc makes this effective on limited hosts.
actorRows.length = 0;
itemRows.length = 0;
actionRecords.length = 0;
allFindingIds.length = 0;
groupedFindings.clear();
actorByKey.clear();
referencesByActor.clear();
for (const key of ['actors', 'items', 'associations', 'gaps']) data[key].length = 0;
global.gc?.();
await fs.mkdir(path.dirname(outputPath), { recursive: true });
console.log('Exporting validated workbook');
const output = await SpreadsheetFile.exportXlsx(wb);
const temporaryOutput = outputPath + '.writing-' + randomUUID() + '.xlsx';
let preparedReport;
try {
  await output.save(temporaryOutput);
  preparedReport = await prepareProgressReport(await fileHash(temporaryOutput), (await fs.stat(temporaryOutput)).size);
  if (outputExists) {
    if (await fileHash(outputPath) !== previousProgress.source.sha256) {
      throw new Error('OUTPUT.xlsx changed after progress was read. Re-run with the current workbook.');
    }
    await fs.rename(temporaryOutput, outputPath);
  } else {
    // link is exclusive: a new file created at the target during the build is
    // never silently replaced. The temporary file is on the same filesystem.
    await fs.link(temporaryOutput, outputPath);
  }
  await fs.rename(preparedReport.temporaryPath, preparedReport.progressReportPath);
} finally {
  await fs.rm(temporaryOutput, { force: true });
  if (preparedReport) await fs.rm(preparedReport.temporaryPath, { force: true });
}
validation.bytes = (await fs.stat(outputPath)).size;
await fs.writeFile(path.join(previewDir, 'workbook-validation.json'), JSON.stringify(validation, null, 2) + '\n');
console.log(JSON.stringify(validation, null, 2));
// Export before rendering so image-layout caches do not overlap serialization.
const documentedActorIndex = actorReferenceCounts.findIndex(row => row[0] > 0);
const extraPreviews = [{ sheetName: 'Synthèse', range: 'A38:D40', filename: 'Synthese_couverture.png' }];
if (documentedActorIndex >= 0) extraPreviews.push({ sheetName: 'Personnages', range: 'U' + (documentedActorIndex + 7) + ':V' + (documentedActorIndex + 7), filename: 'Personnages_references.png' });
const recentReferenceRow = Math.max(7, last['Références 1a1'] - 1);
extraPreviews.push({ sheetName: 'Références 1a1', range: 'G' + recentReferenceRow + ':J' + last['Références 1a1'], filename: 'References_ajouts_conditions.png' });
extraPreviews.push({ sheetName: 'Références 1a1', range: 'U' + recentReferenceRow + ':V' + last['Références 1a1'], filename: 'References_ajouts_reperes.png' });
for (const { filename, ...job } of [{ sheetName: 'Synthèse', range: 'A1:D17' }, ...previewJobs, ...extraPreviews]) {
  const preview = await wb.render({ ...job, scale: 1, format: 'png' });
  const file = filename || job.sheetName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '_') + '.png';
  await fs.writeFile(path.join(previewDir, file), new Uint8Array(await preview.arrayBuffer()));
  console.log('Rendered ' + job.sheetName);
  global.gc?.();
}
