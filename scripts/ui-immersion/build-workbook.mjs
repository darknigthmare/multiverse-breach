#!/usr/bin/env node
/**
 * Rebuild the single UI audit workbook with @oai/artifact-tool.
 * Run through build-workbook.sh so ESM resolves the runtime-owned dependency.
 * Inputs are versioned JSON; validation.json is optional and can be refreshed
 * after CI, a preview review or PR creation. No game source is changed here.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : args[i + 1];
};
const repo = path.resolve(flag('--repo', process.cwd()));
const output = path.resolve(flag('--output', path.join(repo, 'docs/excel/Multiverse_Breach_UI_Immersion.xlsx')));
const qaDir = path.resolve(flag('--qa-dir', path.join(path.dirname(output), 'qa')));
const dataDir = path.join(repo, 'docs/ui-immersion');
const readJson = async (file, fallback) => {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT' && fallback !== undefined) return fallback; throw error; }
};
const inputPaths = [
  'docs/ui-immersion/audit-baseline.json',
  'docs/ui-immersion/workbook-content.fr.json',
  ...['shell', 'hub', 'combat', 'app'].map((group) => `docs/ui-immersion/${group}-implementation.json`),
];
const [audit, content, validation] = await Promise.all([
  readJson(path.join(dataDir, 'audit-baseline.json')),
  readJson(path.join(dataDir, 'workbook-content.fr.json')),
  readJson(path.join(dataDir, 'validation.json'), {}),
]);
const manifestMetadata = validation.metadata ?? {};
const metadata = {
  ...content.metadata,
  ...manifestMetadata,
  prUrl: flag('--pr-url', manifestMetadata.prUrl ?? validation.prUrl ?? content.metadata.prUrl),
  previewUrl: flag('--preview-url', manifestMetadata.previewUrl ?? validation.previewUrl ?? content.metadata.previewUrl),
  commit: flag('--commit', manifestMetadata.commit ?? validation.commit ?? ''),
};
const asArray = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const text = (value) => typeof value === 'string' ? value : value == null ? '' : JSON.stringify(value);
const unique = (values) => [...new Set(values.filter(Boolean))];
const joined = (values) => unique(asArray(values).map(text)).join('\n');
const numericId = (id) => /^\d{2}$/.test(String(id));
const sourceChecks = Array.isArray(validation) ? validation : validation.checks ?? validation.results ?? [];
const checks = sourceChecks.map((check, i) => typeof check === 'string'
  ? { id: `VALIDATION-${i + 1}`, detail: check, type: 'documented' }
  : { ...check, id: check.id ?? `VALIDATION-${i + 1}` });
const checksFor = (action) => checks.filter((check) => asArray(check.actionIds).includes(action.id));
const screenChecks = (id) => checks.filter((check) => asArray(check.auditIds).map(String).includes(id));
const isSynthetic = (check) => check.synthetic === true || check.fixture === true
  || /synthetic|synthétique|fixture|mock/i.test(text(check.type ?? check.kind));
const isBrowser = (check) => !isSynthetic(check)
  && /browser|navigateur|visuel|visual|playwright/i.test(text(check.type ?? check.kind));
const isAutomatedCheck = (check) => !isBrowser(check)
  && (isSynthetic(check) || /test|automated|automatique|régression|regression|SSR|suite/i.test(`${text(check.type ?? check.kind)} ${text(check.command)}`));
const checkEvidence = (check) => joined(check.evidence ?? check.proof ?? check.captures ?? check.url);
const positive = (value) => /réussi|passed|succès|\bpassent\b|\bok\b|vérifié|\bverts\b/i.test(text(value));
const failed = (value) => /échec|failed|failure|not passed/i.test(text(value));
const blocked = (value) => /bloqué|blocked|non exécut|not run|pending|en attente|à réaliser|à vérifier|encore nécessaire/i.test(text(value));
const knownStatus = (check) => {
  const status = text(check.status ?? check.result ?? check.outcome);
  if (failed(status)) return 'Échec';
  if (blocked(status)) return 'Non réalisé';
  if (positive(status) || /^(pass|success|complete|completed)$/i.test(status)) return 'Réussi';
  return 'Déclaré';
};
const isCodeOnly = (value) => /oxlint|lint ciblé|git diff|JSX|compilation|py_compile|AST|transformWithOxc/i.test(value)
  && !/test|suite|régress|checks/i.test(value);
const normalizeCodeStatus = (value) => {
  if (/preserved|conservé/i.test(value)) return 'Conservé';
  if (/partial|partiel|en vérification/i.test(value)) return 'Partiel';
  if (/implemented|implémenté/i.test(value)) return 'Implémenté';
  if (/pending|not.started|à traiter/i.test(value)) return 'À traiter';
  return 'À préciser';
};
const autoStatus = (action) => {
  const targeted = checksFor(action).filter(isAutomatedCheck);
  if (targeted.some((check) => knownStatus(check) === 'Échec')) return 'Échec';
  if (targeted.some((check) => knownStatus(check) === 'Réussi')) {
    return targeted.some((check) => knownStatus(check) === 'Non réalisé') ? 'Partiels' : 'Réussis';
  }
  const lines = action.validation.filter((line) => !isCodeOnly(line));
  if (lines.some(failed)) return 'Échec';
  const passed = lines.some(positive) || /automated checks passed/i.test(action.originalStatus);
  if (lines.some(blocked)) return passed ? 'Partiels' : 'Bloqués';
  if (passed) return 'Réussis';
  return lines.length ? 'Déclarés' : 'Non réalisés';
};
const browserForScreen = (id) => {
  const relevant = screenChecks(id).filter(isBrowser);
  if (relevant.some((check) => knownStatus(check) === 'Échec')) return 'Échec';
  if (relevant.some((check) => knownStatus(check) === 'Réussi' && checkEvidence(check))) return 'Observé sur branche';
  return 'Non réalisé';
};
const browserForAction = (action) => {
  const targeted = checksFor(action).filter(isBrowser);
  if (targeted.some((check) => knownStatus(check) === 'Échec')) return 'Échec';
  if (targeted.some((check) => knownStatus(check) === 'Réussi' && checkEvidence(check))) return 'Observé sur branche';
  const ids = action.coverageIds;
  if (ids.length && ids.every((id) => browserForScreen(id) === 'Observé sur branche')) return 'Observé sur branche';
  if (ids.some((id) => browserForScreen(id) === 'Échec')) return 'Échec';
  if (ids.some((id) => browserForScreen(id) === 'Observé sur branche')) return 'Partiel';
  return 'Non réalisé';
};
const ledgerGroups = await Promise.all(['shell', 'hub', 'combat', 'app'].map(async (group) => {
  const ledgerPath = `docs/ui-immersion/${group}-implementation.json`;
  const entries = await readJson(path.join(repo, ledgerPath));
  assert.ok(Array.isArray(entries), `${ledgerPath} must be an array`);
  return entries.map((entry) => {
    const localized = content.actionTranslations?.[entry.id] ?? {};
    const numericIds = asArray(entry.auditIds).map(String).filter(numericId);
    const coverageIds = entry.id === 'APP-08' ? [] : numericIds;
    return {
      ...entry,
      ...localized,
      auditIds: asArray(entry.auditIds).map(String),
      changes: asArray(localized.changes ?? entry.changes).map(text),
      validation: asArray(localized.validation ?? entry.validation).map(text),
      limitations: asArray(localized.limitations ?? entry.limitations).map(text),
      files: asArray(entry.files).map(text),
      group,
      ledgerPath,
      coverageIds,
      originalStatus: entry.status,
      codeStatus: normalizeCodeStatus(entry.status),
    };
  });
}));
const actions = ledgerGroups.flat();
for (const action of actions) {
  action.autoStatus = autoStatus(action);
  action.browserStatus = browserForAction(action);
  action.browserEvidence = joined([
    ...checksFor(action).filter(isBrowser).map(checkEvidence),
    ...action.coverageIds.flatMap((id) => screenChecks(id).filter(isBrowser).map(checkEvidence)),
  ]);
}
assert.equal(audit.screens.length, 40, 'The baseline must retain all 40 screens');
assert.equal(new Set(audit.screens.map((screen) => screen.id)).size, 40, 'Duplicate screen ID');
assert.equal(new Set(actions.map((action) => action.id)).size, actions.length, 'Duplicate action ID');
const screens = audit.screens.map((screen) => ({
  ...screen,
  actions: actions.filter((action) => action.coverageIds.includes(screen.id)),
}));
const priorities = new Map(screens.map((screen) => [screen.id, screen.priority]));
const priorityFor = (action) => action.id === 'APP-08' ? 'Transversal'
  : action.coverageIds.map((id) => priorities.get(id)).sort()[0] ?? 'Transversal';
const gitUrl = (file, ref = metadata.commit || metadata.branch) =>
  `${metadata.repository}/blob/${ref}/${file.split('/').map(encodeURIComponent).join('/')}`;
const auditUrl = (source) => {
  const match = /^(.*?):(\d+)(?:[–-](\d+))?$/.exec(source ?? '');
  return match ? `${gitUrl(match[1], audit.scope.commit)}#L${match[2]}${match[3] ? `-L${match[3]}` : ''}`
    : gitUrl(source || 'src/App.jsx', audit.scope.commit);
};
const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
// HYPERLINK is supported by Excel but the artifact calculation engine does not
// evaluate it. IFERROR preserves a readable cached label without error cells.
const hyperlink = (url, label) => `=IFERROR(HYPERLINK(${quote(url)},${quote(label)}),${quote(label)})`;
const column = (index) => {
  let result = '';
  for (let value = index + 1; value > 0; value = Math.floor((value - 1) / 26)) result = String.fromCharCode(65 + (value - 1) % 26) + result;
  return result;
};

const workbook = Workbook.create();
const sheets = Object.fromEntries(['Synthèse', '40 écrans', 'Actions', 'Conservation', 'Vérifications'].map((name) => [name, workbook.worksheets.add(name)]));
const C = {
  ink: '#17243A', muted: '#5D6878', navy: '#243B5A', blue: '#345A87',
  line: '#CBD5E1', pale: '#F4F7FA', input: '#FFF7DA', warning: '#FFF0CE',
  warningText: '#7B5100', error: '#FCE7E7', errorText: '#A31F2F', link: '#245C9E',
};
function initSheet(sheet, title, context, widths, lastRow) {
  const lastCol = column(widths.length - 1);
  const all = sheet.getRange(`A1:${lastCol}${lastRow}`);
  all.format = { font: { name: 'Arial', size: 10, color: C.ink }, verticalAlignment: 'center' };
  sheet.showGridLines = false;
  sheet.getRange(`A1:${lastCol}1`).format.rowHeight = 10;
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format = { font: { name: 'Arial', size: 16, bold: true, color: C.ink }, wrapText: false };
  sheet.getRange(`A2:${lastCol}2`).format.rowHeight = 28;
  sheet.getRange(`A3:${lastCol}3`).format = { rowHeight: 8, borders: { bottom: { style: 'thin', color: C.line } } };
  sheet.getRange('A4').values = [[context]];
  sheet.getRange('A4').format = { font: { italic: true, color: C.muted, size: 10, name: 'Arial' }, wrapText: false };
  sheet.getRange(`A4:${lastCol}4`).format.rowHeight = 22;
  sheet.getRange(`A5:${lastCol}5`).format.rowHeight = 8;
  widths.forEach((width, i) => { sheet.getRange(`${column(i)}1:${column(i)}${lastRow}`).format.columnWidth = width; });
}
function tableSheet(sheet, headers, rows, widths, name, title, context) {
  const lastRow = 6 + rows.length;
  const lastCol = column(headers.length - 1);
  initSheet(sheet, title, context, widths, lastRow);
  sheet.getRange(`A6:${lastCol}${lastRow}`).values = [headers, ...rows];
  const table = sheet.tables.add(`A6:${lastCol}${lastRow}`, true, name);
  table.showFilterButton = true;
  table.style = 'TableStyleLight1';
  sheet.getRange(`A6:${lastCol}6`).format = {
    fill: C.navy,
    font: { name: 'Arial', size: 10, color: '#FFFFFF', bold: true },
    horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true,
    rowHeight: 34,
    borders: { insideVertical: { style: 'thin', color: '#FFFFFF' } },
  };
  sheet.getRange(`A7:${lastCol}${lastRow}`).format = { fill: '#FFFFFF', wrapText: true, verticalAlignment: 'top' };
  // Estimate only to establish padding; full contents remain in each cell.
  // A row is enlarged for the longest actual description, never the whole sheet.
  rows.forEach((row, index) => {
    let lines = 1;
    row.forEach((value, col) => {
      if (typeof value !== 'string' || value.startsWith('=')) return;
      const capacity = Math.max(5, Math.floor(widths[col] * 1.05));
      const count = value.split('\n').reduce((n, part) => n + Math.max(1, Math.ceil(part.length / capacity)), 0);
      lines = Math.max(lines, count);
    });
    sheet.getRange(`A${index + 7}:${lastCol}${index + 7}`).format.rowHeight = Math.min(408, Math.max(38, lines * 13 + 12));
    if (index % 2 === 0) sheet.getRange(`A${index + 7}:${lastCol}${index + 7}`).format.fill = C.pale;
  });
  sheet.freezePanes.freezeRows(6);
  sheet.freezePanes.freezeColumns(2);
  return lastRow;
}
function statusColors(sheet, range) {
  const target = sheet.getRange(range);
  for (const value of ['Partiel', 'Partiels', 'À traiter', 'À préciser', 'Bloqués']) {
    target.conditionalFormats.add('cellIs', { operator: 'equal', formula: quote(value), format: { fill: C.warning, font: { color: C.warningText, bold: true } } });
  }
  target.conditionalFormats.add('cellIs', { operator: 'equal', formula: quote('Échec'), format: { fill: C.error, font: { color: C.errorText, bold: true } } });
}

const actionRows = actions.map((action) => [
  action.id, action.auditIds.join(', '), priorityFor(action), action.codeStatus,
  action.autoStatus, action.browserStatus, joined(action.changes), joined(action.files),
  joined(action.validation), joined(action.limitations), action.browserEvidence || 'Aucune preuve navigateur de la branche enregistrée.',
  '', '', action.coverageIds.map((id) => `S${id};`).join(''),
  action.coverageIds.length ? 'Écrans' : 'Transversal — exclu de la couverture écran',
]);
const actionsEnd = tableSheet(sheets.Actions,
  ['Lot', 'Écrans liés', 'Priorité', 'Code', 'Tests auto', 'Navigateur', 'Modifications réalisées', 'Fichiers', 'Validation déclarée / résultats', 'Limites restantes', 'Preuve navigateur', 'Source code', 'Ledger source', 'Clés de couverture', 'Portée'],
  actionRows, [24, 22, 14, 18, 18, 22, 90, 55, 85, 80, 55, 24, 22, 26, 30], 'ImmersionActions',
  'Actions — modifications et preuves par lot',
  'Statuts de code indépendants de la recette. APP-08 suit CI et Excel ; ses 40 associations ne valent aucune couverture d’écran.');
sheets.Actions.tabColor = C.blue;
actions.forEach((action, index) => {
  const row = index + 7;
  sheets.Actions.getRange(`L${row}`).formulas = [[hyperlink(gitUrl(action.files[0] || action.ledgerPath), 'Code de la branche')]];
  sheets.Actions.getRange(`M${row}`).formulas = [[hyperlink(gitUrl(action.ledgerPath), action.id)]];
});
sheets.Actions.getRange(`D7:F${actionsEnd}`).format.fill = C.input;
sheets.Actions.getRange(`D7:D${actionsEnd}`).dataValidation = { rule: { type: 'list', values: ['Implémenté', 'Conservé', 'Partiel', 'À traiter', 'À préciser'] } };
sheets.Actions.getRange(`E7:E${actionsEnd}`).dataValidation = { rule: { type: 'list', values: ['Réussis', 'Partiels', 'Déclarés', 'Non réalisés', 'Bloqués', 'Échec'] } };
sheets.Actions.getRange(`F7:F${actionsEnd}`).dataValidation = { rule: { type: 'list', values: ['Observé sur branche', 'Partiel', 'Non réalisé', 'Échec'] } };
sheets.Actions.getRange(`B7:B${actionsEnd}`).setNumberFormat('00');
sheets.Actions.getRange(`L7:M${actionsEnd}`).format.font = { name: 'Arial', size: 10, color: C.link };
statusColors(sheets.Actions, `D7:F${actionsEnd}`);

const screenRows = screens.map((screen) => [
  Number(screen.id), screen.title, screen.priority, null, null, null, null,
  screen.observation, joined(screen.actions.map((action) => `${action.id} — ${action.changes[0] ?? ''}`)),
  screen.preserve, screen.acceptance, joined(screen.actions.flatMap((action) => action.limitations)),
  joined(screen.actions.flatMap((action) => action.files)), screen.actions.map((action) => action.id).join(', '),
  joined(screen.sources), '', '', screen.recommendation,
  joined(screenChecks(screen.id).filter(isBrowser).map(checkEvidence)) || 'Aucune observation de la nouvelle branche enregistrée.',
  browserForScreen(screen.id),
]);
const screensEnd = tableSheet(sheets['40 écrans'],
  ['ID', 'Écran / états proches', 'Priorité', 'Code — synthèse', 'Lots liés', 'Tests auto', 'Navigateur', 'Constat de l’audit initial', 'Modifications — résumé', 'Fonctions à conserver', 'Critères d’acceptation', 'Limites / recette restante', 'Fichiers modifiés', 'Lots', 'Sources audit 5f44cf34', 'Audit — lien code', 'Branche — lien code', 'Recommandation initiale', 'Preuve navigateur de branche', 'État navigateur documenté'],
  screenRows, [8, 43, 11, 20, 11, 17, 23, 78, 90, 72, 72, 85, 55, 32, 58, 24, 24, 78, 60, 25], 'ImmersionScreens',
  'Les 40 écrans — audit, réalisation et recette',
  'L’audit initial porte sur 5f44cf34. Les colonnes Code et Tests ne certifient pas la recette visuelle de la nouvelle branche.');
sheets['40 écrans'].tabColor = C.navy;
const actionIdRange = `Actions!$A$7:$A$${actionsEnd}`;
const actionCodeRange = `Actions!$D$7:$D$${actionsEnd}`;
const actionTestRange = `Actions!$E$7:$E$${actionsEnd}`;
const actionBrowserRange = `Actions!$F$7:$F$${actionsEnd}`;
// Exact ID criteria avoid the runtime's unsupported wildcard COUNTIFS path.
// Each formula is generated from the versioned mapping, then reacts to edits
// of the source action statuses. The readable coverage keys remain in Actions.
const relatedCount = (row, range, status) => screens[row - 7].actions
  .map((action) => `COUNTIFS(${actionIdRange},${quote(action.id)}${range ? `,${range},${quote(status)}` : ''})`)
  .join('+') || '0';
const screenStatusFormulas = screens.map((screen, index) => {
  const row = index + 7;
  return [
    `=IF(E${row}=0,"À traiter",IF(${relatedCount(row, actionCodeRange, 'À préciser')}>0,"À préciser",IF(${relatedCount(row, actionCodeRange, 'Partiel')}+${relatedCount(row, actionCodeRange, 'À traiter')}>0,"Partiel",IF(${relatedCount(row, actionCodeRange, 'Implémenté')}>0,"Implémenté","Conservé"))))`,
    `=${relatedCount(row)}`,
    `=IF(E${row}=0,"Non réalisés",IF(${relatedCount(row, actionTestRange, 'Échec')}>0,"Échec",IF(${relatedCount(row, actionTestRange, 'Bloqués')}+${relatedCount(row, actionTestRange, 'Partiels')}>0,"Partiels",IF(${relatedCount(row, actionTestRange, 'Réussis')}=E${row},"Réussis",IF(${relatedCount(row, actionTestRange, 'Réussis')}>0,"Partiels",IF(${relatedCount(row, actionTestRange, 'Déclarés')}>0,"Déclarés","Non réalisés"))))))`,
    `=IF(T${row}<>"Non réalisé",T${row},IF(E${row}=0,"Non réalisé",IF(${relatedCount(row, actionBrowserRange, 'Échec')}>0,"Échec",IF(${relatedCount(row, actionBrowserRange, 'Observé sur branche')}=E${row},"Observé sur branche",IF(${relatedCount(row, actionBrowserRange, 'Observé sur branche')}+${relatedCount(row, actionBrowserRange, 'Partiel')}>0,"Partiel","Non réalisé")))))`,
  ];
});
sheets['40 écrans'].getRange(`D7:G${screensEnd}`).formulas = screenStatusFormulas;
screens.forEach((screen, index) => {
  const row = index + 7;
  sheets['40 écrans'].getRange(`P${row}`).formulas = [[hyperlink(auditUrl(screen.sources[0]), 'Source de l’audit')]];
  sheets['40 écrans'].getRange(`Q${row}`).formulas = [[hyperlink(gitUrl(screen.actions[0]?.files[0] || 'docs/ui-immersion/audit-baseline.json'), 'Réalisation actuelle')]];
});
sheets['40 écrans'].getRange(`A7:A${screensEnd}`).setNumberFormat('00');
sheets['40 écrans'].getRange(`E7:E${screensEnd}`).setNumberFormat('0');
sheets['40 écrans'].getRange(`E7:E${screensEnd}`).format.horizontalAlignment = 'right';
sheets['40 écrans'].getRange(`P7:Q${screensEnd}`).format.font = { name: 'Arial', size: 10, color: C.link };
statusColors(sheets['40 écrans'], `D7:G${screensEnd}`);
sheets['40 écrans'].getRange(`C7:C${screensEnd}`).conditionalFormats.add('cellIs', { operator: 'equal', formula: '"P0"', format: { fill: C.warning, font: { bold: true, color: C.warningText } } });

const conservationRows = screens.map((screen) => [
  Number(screen.id), screen.title, screen.preserve, content.destinations[screen.id] || `Voir ${screen.actions.map((action) => action.id).join(', ')}.`,
  null, null, screen.acceptance, '',
]);
const conservationEnd = tableSheet(sheets.Conservation,
  ['ID', 'Écran', 'Fonctions et contenus à préserver', 'Destination dans la nouvelle interface', 'Tests liés', 'Navigateur', 'Contrôle d’acceptation', 'Fiche liée'],
  conservationRows, [8, 43, 84, 84, 18, 24, 84, 22], 'ImmersionConservation',
  'Conservation — retrouver chaque fonction',
  'Aucune suppression fonctionnelle demandée. Dialogues, illustration et colonnes de lecture peuvent rester centrés lorsque cela sert leur usage.');
screens.forEach((screen, index) => {
  const row = index + 7;
  sheets.Conservation.getRange(`E${row}:F${row}`).formulas = [[`='40 écrans'!F${row}`, `='40 écrans'!G${row}`]];
  sheets.Conservation.getRange(`H${row}`).formulas = [[hyperlink(`#'40 écrans'!A${row}`, `Fiche ${screen.id}`)]];
});
statusColors(sheets.Conservation, `E7:F${conservationEnd}`);
sheets.Conservation.getRange(`A7:A${conservationEnd}`).setNumberFormat('00');
sheets.Conservation.getRange(`H7:H${conservationEnd}`).format.font = { name: 'Arial', size: 10, color: C.link };

// Verification is a terminal evidence log, never an input into completion formulas.
const verificationMap = new Map();
for (const action of actions) {
  for (const line of action.validation) {
    if (!verificationMap.has(line)) verificationMap.set(line, { detail: line, actionIds: [], sources: [], type: isCodeOnly(line) ? 'Code / compilation' : /SSR|Presentation/i.test(line) ? 'Test auto / SSR' : 'Test automatique' });
    const entry = verificationMap.get(line);
    entry.actionIds.push(action.id);
    entry.sources.push(action.ledgerPath);
  }
}
const verificationRows = [...verificationMap.values()].map((entry, index) => [
  `L-${String(index + 1).padStart(3, '0')}`, entry.type,
  failed(entry.detail) ? 'Échec' : blocked(entry.detail) ? 'Bloqué / à exécuter' : positive(entry.detail) ? 'Réussi' : 'Déclaré',
  entry.actionIds.join(', '), entry.detail,
  'Déclaration de résultat du ledger versionné ; consulter la commande et sa portée. Ne certifie pas une recette visuelle.',
  '', joined(entry.sources),
]);
checks.forEach((check) => {
  const status = knownStatus(check);
  verificationRows.push([
    check.id, isSynthetic(check) ? 'Test UI — médias synthétiques' : isBrowser(check) ? 'Navigateur — branche' : text(check.type ?? check.kind ?? 'Vérification globale'),
    isBrowser(check) && status === 'Réussi' && !checkEvidence(check) ? 'Déclaré — preuve manquante' : status,
    joined([asArray(check.actionIds).join(', '), asArray(check.auditIds).length ? `Écrans : ${asArray(check.auditIds).join(', ')}` : '']),
    joined([check.command, check.detail ?? check.description, check.output ?? check.summary]),
    joined([check.limitations, isSynthetic(check) ? 'Environnement synthétique : ne constitue pas une recette du jeu avec ses médias réels.' : isBrowser(check) ? 'Observation limitée aux écrans, états, dimensions et entrées décrits.' : 'Résultat automatique : ne remplace pas la recette en appareil.']),
    checkEvidence(check), 'docs/ui-immersion/validation.json',
  ]);
});
const pendingChecks = [
  ['R-01', 'Recette appareil', 'Mobile réel, orientation et multitouch', 'Les calculs de géométrie ne prouvent pas le confort réel du tactile.'],
  ['R-02', 'Recette appareil', 'Manette physique et P2 local', 'Les tests de fusion des entrées ne remplacent pas un périphérique réel.'],
  ['R-03', 'Parcours complet', 'Victoire complète, attribution unique et rechargement de sauvegarde', 'Les P0 disposent de tests de callbacks / gardes ; le parcours joué doit être vérifié séparément.'],
  ['R-04', 'Service externe', 'Synchronisation cloud et compte sur réseau réel', 'Les courses asynchrones sont testées automatiquement ; aucune connexion cloud réelle n’est déduite.'],
  ['R-05', 'Économie / parcours', 'Achat de booster, cinq révélations et fermeture / reprise', 'Moteur économique couvert par tests ; opération de bout en bout en preview à documenter.'],
];
for (const [id, type, detail, limitation] of pendingChecks) {
  const documented = checks.find((check) => check.id === id);
  if (!documented) verificationRows.push([id, type, 'Non réalisé', 'Recette finale', detail, limitation, '', 'Plan de recette — audit initial et limites des ledgers']);
}
const verificationEnd = tableSheet(sheets.Vérifications,
  ['Réf.', 'Nature de preuve', 'Résultat', 'Portée / lots', 'Commande ou vérification', 'Limites de la preuve', 'Trace / capture / URL', 'Source'],
  verificationRows, [13, 28, 25, 43, 92, 84, 68, 65], 'ImmersionVerification',
  'Vérifications — preuves et limites',
  'Les tests, le code, le rendu SSR et l’observation navigateur sont distincts. Les captures de l’audit initial ne valident pas la branche.');
statusColors(sheets.Vérifications, `C7:C${verificationEnd}`);

const summary = sheets.Synthèse;
initSheet(summary, 'Multiverse Breach — suivi de la refonte immersive',
  `Audit ${audit.scope.build} · Base ${metadata.baseline.slice(0, 8)} · ${metadata.date}`,
  [15, 13, 18, 17, 16, 15, 18, 23], 43);
summary.tabColor = C.navy;
summary.getRange('A6').values = [['40 écrans • conservation des fonctions • plein viewport et panneaux contextuels']];
summary.getRange('A6').format = { font: { name: 'Arial', size: 12, bold: true, color: C.ink }, wrapText: false };
summary.getRange('A6:H6').format.rowHeight = 24;
summary.getRange('A8:H12').values = [
  ['Priorité', 'Écrans', 'Code implémenté', 'Base conservée', 'Partiels', 'À traiter / préciser', 'Tests réussis', 'Observés sur branche'],
  ['P0', null, null, null, null, null, null, null],
  ['P1', null, null, null, null, null, null, null],
  ['P2', null, null, null, null, null, null, null],
  ['TOTAL', null, null, null, null, null, null, null],
];
summary.getRange('A8:H8').format = {
  fill: C.navy, font: { name: 'Arial', size: 10, color: '#FFFFFF', bold: true },
  horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true, rowHeight: 36,
  borders: { insideVertical: { style: 'thin', color: '#FFFFFF' } },
};
summary.getRange('A9:H12').format.rowHeight = 28;
summary.getRange('B9:H12').setNumberFormat('0');
summary.getRange('B9:H12').format.horizontalAlignment = 'right';
for (let row = 9; row <= 11; row++) {
  const screenPriority = `'40 écrans'!$C$7:$C$${screensEnd}`;
  const screenCode = `'40 écrans'!$D$7:$D$${screensEnd}`;
  const screenTests = `'40 écrans'!$F$7:$F$${screensEnd}`;
  const screenBrowser = `'40 écrans'!$G$7:$G$${screensEnd}`;
  const count = (range, value) => `COUNTIFS(${screenPriority},A${row}${range ? `,${range},${quote(value)}` : ''})`;
  summary.getRange(`B${row}:H${row}`).formulas = [[
    `=${count()}`, `=${count(screenCode, 'Implémenté')}`, `=${count(screenCode, 'Conservé')}`,
    `=${count(screenCode, 'Partiel')}`, `=${count(screenCode, 'À traiter')}+${count(screenCode, 'À préciser')}`,
    `=${count(screenTests, 'Réussis')}`, `=${count(screenBrowser, 'Observé sur branche')}`,
  ]];
}
summary.getRange('B12:H12').formulas = [['=SUM(B9:B11)', '=SUM(C9:C11)', '=SUM(D9:D11)', '=SUM(E9:E11)', '=SUM(F9:F11)', '=SUM(G9:G11)', '=SUM(H9:H11)']];
summary.getRange('A12:H12').format = { fill: C.pale, font: { name: 'Arial', size: 10, color: C.ink, bold: true }, borders: { top: { style: 'thin', color: C.line } } };
summary.getRange('A14').values = [['Couverture code']];
summary.getRange('B14').formulas = [['=IFERROR(SUM(C12:D12)/B12,0)']];
summary.getRange('C14').values = [['Écrans modifiés ou conservés ; cette mesure ne vaut pas recette complète.']];
summary.getRange('A15').values = [['Recette visuelle']];
summary.getRange('B15').formulas = [['=IFERROR(H12/B12,0)']];
summary.getRange('C15').values = [['Observations documentées sur la branche ; les captures initiales sont exclues.']];
summary.getRange('A14:H15').format.rowHeight = 25;
summary.getRange('B14:B15').setNumberFormat('0%');
summary.getRange('B14:B15').format = { font: { name: 'Arial', size: 12, bold: true, color: C.ink }, horizontalAlignment: 'right' };
summary.getRange('C14:C15').format = { wrapText: false, font: { name: 'Arial', size: 10, color: C.muted } };
if (checks.some((check) => check.id === 'PREVIEW1-BUILD')) {
  summary.getRange('A16').values = [['Revue : perte de jauge PV Extinction détectée au prébuild ; jauge et PV max rétablis, tests noncombat réussis.']];
  summary.getRange('A16').format = { wrapText: false, font: { name: 'Arial', size: 10, color: C.muted } };
  summary.getRange('A16:H16').format.rowHeight = 22;
}
summary.getRange('A17').values = [['Interpréter les résultats']];
summary.getRange('A17').format = { font: { name: 'Arial', size: 12, bold: true, color: C.ink }, wrapText: false };
const notes = [
  'P0 : intégrité des récompenses. P1 : immersion et usage. P2 : finition et harmonisation.',
  'Code implémenté : changement présent dans les sources. Base conservée : écran déjà adapté, maintenu et harmonisé.',
  'Tests réussis : les lots liés déclarent des résultats automatiques explicites. Les critères d’acceptation restent distincts.',
  'Les cellules ambrées dans Actions sont éditables. Les autres tableaux et les compteurs se recalculent à partir des lots.',
  'APP-08 suit CI et Excel. Ses associations aux 40 écrans sont exclues du calcul de couverture.',
  'Les contenus, commandes, prix, probabilités, garanties et sources restent accessibles ; leur destination est tracée.',
  'Les dialogues, les images et les colonnes de lecture peuvent conserver un centrage utile.',
];
summary.getRange('A18:A24').values = notes.map((note) => [note]);
summary.getRange('A18:H24').format.rowHeight = 22;
summary.getRange('A18:A24').format.wrapText = false;
if (checks.some((check) => check.id === 'CI1-NAVIGATION')) {
  summary.getRange('A25').values = [['Parcours CI adaptés aux nouveaux menus : 195 contrôles et attentes conservés ; résultat courant dans Vérifications.']];
  summary.getRange('A25').format = { wrapText: false, font: { name: 'Arial', size: 10, color: C.muted } };
  summary.getRange('A25:H25').format.rowHeight = 22;
}
summary.getRange('A26').values = [['Méthode et limites']];
summary.getRange('A26').format = { font: { name: 'Arial', size: 12, bold: true, color: C.ink }, wrapText: false };
summary.getRange('A27:A30').values = [
  ['Audit initial : parcours invité desktop 1363 × 936, sources du build 5f44cf34 ; 40 fiches regroupent leurs états proches.'],
  ['Inspection de toutes les surfaces identifiées, sans visite de chaque contenu déverrouillable ni de chaque variante.'],
  ['Les tests de géométrie, d’horloge, de focus et de récompense ne remplacent pas un parcours joué sur appareil.'],
  ['Mobile réel, manette, cloud et progression complète restent limités aux preuves explicitement inscrites dans Vérifications.'],
];
summary.getRange('A27:H30').format.rowHeight = 22;
summary.getRange('A27:A30').format.wrapText = false;
summary.getRange('A32').values = [['Références et actualisation']];
summary.getRange('A32').format = { font: { name: 'Arial', size: 12, bold: true, color: C.ink }, wrapText: false };
summary.getRange('A33:A38').values = [['Branche'], ['Base master'], ['Commit de preuve'], ['Pull request'], ['Preview'], ['Régénération']];
summary.getRange('C33:C38').values = [
  [metadata.branch], [metadata.baseline], [metadata.commit || 'Non renseigné — consulter le manifeste de validation'],
  [metadata.prUrl ? null : 'Non publiée / URL non enregistrée'],
  [metadata.previewUrl ? null : 'URL non enregistrée ; aucune recette navigateur déduite'],
  ['scripts/ui-immersion/build-workbook.sh — lit les ledgers et validation.json versionnés'],
];
if (metadata.prUrl) summary.getRange('C36').formulas = [[hyperlink(metadata.prUrl, 'Ouvrir la pull request')]];
if (metadata.previewUrl) summary.getRange('C37').formulas = [[hyperlink(metadata.previewUrl, 'Ouvrir la preview')]];
summary.getRange('A33:H38').format.rowHeight = 22;
summary.getRange('C33:C38').format.wrapText = false;
summary.getRange('A40').values = [['Sources : audit-baseline.json + quatre ledgers d’implémentation + validation.json (si disponible).']];
summary.getRange('A40').format = { font: { name: 'Arial', size: 10, italic: true, color: C.muted }, wrapText: false };
summary.getRange('A41').values = [[`Actualisation : ${metadata.date}. Les liens de code suivent ${metadata.commit ? 'le commit enregistré' : 'la branche, jusqu’à enregistrement du commit'}.`]];
summary.getRange('A41').format = { font: { name: 'Arial', size: 10, italic: true, color: C.muted }, wrapText: false };

workbook.recalculate();
assert.equal(summary.getRange('B12').values[0][0], 40, 'Summary must count 40 unique audit screens');
const screenValues = sheets['40 écrans'].getRange(`A7:G${screensEnd}`).values;
screenValues.forEach((row, index) => assert.equal(row[4], screens[index].actions.length, `Wrong action coverage for ${row[0]}`));
const app08index = actions.findIndex((action) => action.id === 'APP-08');
assert.equal(sheets.Actions.getRange(`N${app08index + 7}`).values[0][0] || '', '', 'APP-08 must not drive screen coverage');

// Meaningful dependency check: changing an editable action status must affect
// the corresponding screen and summary; restoring it must restore the workbook.
const mutableIndex = actions.findIndex((action) => action.coverageIds.length === 1 && action.codeStatus === 'Implémenté');
const mutableAction = actions[mutableIndex];
const mutableRow = mutableIndex + 7;
const screenIndex = screens.findIndex((screen) => screen.id === mutableAction.coverageIds[0]);
const previous = sheets.Actions.getRange(`D${mutableRow}`).values[0][0];
const totalBefore = summary.getRange('C12:F12').values[0];
sheets.Actions.getRange(`D${mutableRow}`).values = [['Partiel']];
workbook.recalculate();
assert.equal(sheets['40 écrans'].getRange(`D${screenIndex + 7}`).values[0][0], 'Partiel', 'Screen must respond to action edits');
assert.ok(summary.getRange('E12').values[0][0] > totalBefore[2], 'Summary must respond to action edits');
sheets.Actions.getRange(`D${mutableRow}`).values = [[previous]];
workbook.recalculate();
assert.deepEqual(summary.getRange('C12:F12').values[0], totalBefore, 'Dependency test must restore original values');

await fs.mkdir(qaDir, { recursive: true });
const inspections = {};
inspections.summary = await workbook.inspect({ kind: 'region', sheetId: 'Synthèse', range: 'A8:H15', include: 'values,formulas', tableMaxRows: 8, tableMaxCols: 8, maxChars: 12000 });
inspections.screens = await workbook.inspect({ kind: 'region', sheetId: '40 écrans', range: 'A7:G12', include: 'values,formulas', tableMaxRows: 6, tableMaxCols: 7, maxChars: 8000 });
inspections.errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 300 }, summary: 'Final formula error scan', maxChars: 12000 });
const errorCells = [];
for (const [name, sheet] of Object.entries(sheets)) {
  const values = sheet.getUsedRange().values;
  values.forEach((row, rowIndex) => row.forEach((value, colIndex) => {
    if (typeof value === 'string' && /^#(?:REF!|DIV\/0!|VALUE!|NAME\?|N\/A|NUM!|NULL!|SPILL!|CALC!)/.test(value)) errorCells.push(`${name}!${column(colIndex)}${rowIndex + 1}: ${value}`);
  }));
}
assert.equal(errorCells.length, 0, `Formula errors: ${errorCells.join('; ')}`);
const renderRanges = [
  ['Synthèse', 'A1:H41', '01-synthese.png'],
  ['40 écrans', 'A1:G10', '02-ecrans.png'],
  ['40 écrans', 'H6:L8', '02-ecrans-details.png'],
  ['Actions', 'A1:F9', '03-actions.png'],
  ['Actions', 'G6:J8', '03-actions-details.png'],
  ['Conservation', 'A1:D9', '04-conservation.png'],
  ['Vérifications', 'A1:F10', '05-verifications.png'],
];
for (const [sheetName, range, filename] of renderRanges) {
  const blob = await workbook.render({ sheetName, range, scale: 1.25, format: 'png' });
  await fs.writeFile(path.join(qaDir, filename), new Uint8Array(await blob.arrayBuffer()));
}
await fs.mkdir(path.dirname(output), { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(output);
try {
  await fs.copyFile(`${output}.inspect.ndjson`, path.join(qaDir, 'export-inspection.ndjson'));
  await fs.unlink(`${output}.inspect.ndjson`);
}
catch (error) { if (error.code !== 'ENOENT') throw error; }
try { await fs.access(path.join(dataDir, 'validation.json')); inputPaths.push('docs/ui-immersion/validation.json'); } catch {}
const inputHashes = {};
for (const file of inputPaths) inputHashes[file] = createHash('sha256').update(await fs.readFile(path.join(repo, file))).digest('hex');
const report = {
  output: path.relative(repo, output),
  date: metadata.date,
  baseline: metadata.baseline,
  branch: metadata.branch,
  proofCommit: metadata.commit || null,
  screenCount: screens.length,
  actionCount: actions.length,
  verificationRows: verificationRows.length,
  formulaErrors: errorCells,
  assertions: ['40 unique screens', 'APP-08 excluded from coverage', 'per-screen action counts match source mapping', 'edited action updates screen and summary, then restores', 'no formula error values'],
  summary: summary.getRange('A8:H12').values,
  inputHashes,
  renderFiles: renderRanges.map(([, , file]) => file),
  inspections,
};
await fs.writeFile(path.join(qaDir, 'workbook-qa.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, qaDir, screens: screens.length, actions: actions.length, checks: verificationRows.length, summary: report.summary, formulaErrors: errorCells }, null, 2));
