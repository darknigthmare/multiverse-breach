#!/usr/bin/env node
/**
 * Build the kart production tracker with the Codex primary runtime.
 * Copy this file into a temporary directory whose node_modules points at
 * CODEX_PRIMARY_RUNTIME_NODE_MODULES, then run with CODEX_PRIMARY_RUNTIME_NODE.
 * Inputs are the versioned kart manifests. Human review fields start unreviewed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index < 0 ? fallback : args[index + 1];
};
const repo = path.resolve(option('--repo', process.cwd()));
const outputDir = path.resolve(option('--output-dir', path.join(repo, 'outputs/kart-workbook-2026-11-08')));
const outputName = 'Multiverse_Breach_Kart_3D_2026-11-08.xlsx';
const finalPath = path.join(repo, 'docs/excel', outputName);
const [pilotManifest, trackManifest] = await Promise.all([
  fs.readFile(path.join(repo, 'docs/kart/kart-assets.json'), 'utf8').then(JSON.parse),
  fs.readFile(path.join(repo, 'docs/kart/kart-tracks.json'), 'utf8').then(JSON.parse)
]);
assert.equal(pilotManifest.assets.length, pilotManifest.counts.characters);
assert.equal(trackManifest.tracks.length, trackManifest.coverage.tracks);
assert.equal(new Set(pilotManifest.assets.map(row => row.id)).size, pilotManifest.assets.length);
assert.equal(new Set(trackManifest.tracks.map(row => row.id)).size, trackManifest.tracks.length);

const workbook = Workbook.create();
const pilots = workbook.worksheets.add('Pilotes');
const circuits = workbook.worksheets.add('Circuits');
const colors = {
  ink: '#24324A', muted: '#647085', navy: '#273756', line: '#D6DFEB',
  input: '#FFF8DF', formula: '#F2F3FA', red: '#FBEAEA', green: '#EAF4EF'
};
const headerRow = 11;
const firstRow = headerRow + 1;
const pilotEnd = headerRow + pilotManifest.assets.length;
const trackEnd = headerRow + trackManifest.tracks.length;
const designLabels = {
  'authored-character-adaptation': 'Adaptation personnage',
  'universe-family-adaptation': 'Famille d’univers',
  'character-palette-and-role': 'Rôle et palette'
};
const trackDesignLabels = {
  'authored-universe-adaptation': 'Décor conçu individuellement',
  'original-manifest-parametric': 'Composition OC paramétrique',
  prototype: 'Prototype'
};
const unique = values => [...new Set(values.filter(Boolean))];
const pilotRows = pilotManifest.assets.map(asset => [
  asset.id, asset.name, asset.universe, designLabels[asset.designSource] || asset.designSource,
  'À faire', 'À faire', 'Non vérifiée', null,
  asset.model.sourcePath, asset.sprite.sourcePath,
  unique(asset.driverSprites.map(sprite => sprite.sourcePath)).join('\n'),
  asset.sprite.frames.length,
  asset.driverAvailable ? 'Oui' : 'Non',
  unique(asset.driverSprites.map(sprite => sprite.sourceContext)).join(', '),
  asset.bodyStyle, asset.signature,
  unique([asset.referenceAsset, ...asset.sourceReferences]).join('\n') || 'Références artistiques à documenter',
  asset.fidelityStatus, null
]);
const trackRows = trackManifest.tracks.map(track => [
  track.id, track.name, track.universe, trackDesignLabels[track.designStatus] || track.designStatus,
  track.sourceLocation || 'Lieu précis à définir', 'À faire', 'Non vérifiée', null,
  track.AIverified ? '3 tours observés' : 'À tester', track.landmarkCount,
  track.theme, track.layoutKey, track.sourceNonCombat ? 'Oui' : 'Non',
  track.references.join('\n'), track.fidelityStatus, null
]);

function initializeSheet(sheet, lastColumn, end, title, source, note, widths, headers, rows, tableName) {
  sheet.showGridLines = false;
  sheet.tabColor = colors.navy;
  const used = sheet.getRange(`A1:${lastColumn}${end}`);
  used.format.font = { name: 'Arial', size: 10, color: colors.ink };
  used.format.verticalAlignment = 'center';
  used.format.rowHeight = 19;
  used.format.wrapText = false;
  sheet.getRange('A1:H1').format.rowHeight = 9;
  sheet.getRange('A2').values = [[title]];
  sheet.getRange('A2').format.font = { name: 'Arial', size: 16, bold: true, color: colors.navy };
  sheet.getRange('A2:H2').format.rowHeight = 26;
  sheet.getRange('G2').values = [['État au']];
  sheet.getRange('H2').values = [[new Date('2026-11-08T12:00:00Z')]];
  sheet.getRange('H2').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('H2').format.horizontalAlignment = 'left';
  sheet.getRange('A3:H3').format.borders = { bottom: { style: 'thin', color: colors.line } };
  sheet.getRange('A3:H3').format.rowHeight = 7;
  sheet.getRange('A4:H4').format.rowHeight = 7;
  sheet.getRange('A5:H6').format.rowHeight = 24;
  for (const column of ['B', 'D', 'F', 'H']) {
    sheet.getRange(`${column}5:${column}6`).format.font = { name: 'Arial', size: 10, bold: true, color: colors.ink };
    sheet.getRange(`${column}5:${column}6`).setNumberFormat('#,##0');
    sheet.getRange(`${column}5:${column}6`).format.horizontalAlignment = 'left';
  }
  sheet.getRange('A7:H7').format.rowHeight = 7;
  sheet.getRange('A8').values = [[source]];
  sheet.getRange('A9').values = [[note]];
  sheet.getRange('A8:H9').format.font = { name: 'Arial', size: 10, italic: true, color: colors.muted };
  sheet.getRange('A10:H10').format.rowHeight = 8;
  sheet.getRange(`A${headerRow}:${lastColumn}${headerRow}`).values = [headers];
  sheet.getRange(`A${firstRow}:${lastColumn}${end}`).values = rows;
  const table = sheet.tables.add(`A${headerRow}:${lastColumn}${end}`, true, tableName);
  table.style = 'TableStyleMedium2';
  table.showFilterButton = true;
  table.showTotals = false;
  table.showBandedColumns = false;
  const tableHead = sheet.getRange(`A${headerRow}:${lastColumn}${headerRow}`);
  tableHead.format = {
    fill: colors.navy, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' },
    horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true, rowHeight: 31,
    borders: { insideVertical: { style: 'thin', color: '#FFFFFF' } }
  };
  const body = sheet.getRange(`A${firstRow}:${lastColumn}${end}`);
  body.format.rowHeight = 48;
  body.format.wrapText = true;
  body.format.verticalAlignment = 'top';
  for (const [column, width] of Object.entries(widths)) {
    sheet.getRange(`${column}1:${column}${end}`).format.columnWidth = width;
  }
  // References are the longest field. Only rows requiring more lines grow.
  rows.forEach((row, index) => {
    const maxLines = row.reduce((count, value, column) => {
      if (value === null || typeof value === 'number') return count;
      const letters = String.fromCharCode(65 + column);
      const usableWidth = Math.max(12, (widths[letters] || 20) - 2);
      const lines = String(value).split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / usableWidth)), 0);
      return Math.max(count, lines);
    }, 1);
    if (maxLines > 3) sheet.getRange(`A${firstRow + index}:${lastColumn}${firstRow + index}`).format.rowHeight = maxLines * 12.5 + 6;
  });
  sheet.freezePanes.freezeRows(headerRow);
  sheet.freezePanes.freezeColumns(3);
}

initializeSheet(pilots, 'S', pilotEnd, 'Multiverse Breach — Pilotes kart',
  'Sources : docs/kart/kart-assets.json. Les chemins correspondent aux fichiers du projet.',
  'Revues en jaune : saisie manuelle. Les fichiers générés ne valident ni le conducteur assis ni une fidélité 1:1.',
  { A: 34, B: 27, C: 29, D: 25, E: 18, F: 20, G: 18, H: 64, I: 90, J: 90, K: 105, L: 15, M: 18, N: 18, O: 26, P: 28, Q: 110, R: 48, S: 65 },
  ['ID stable', 'Personnage', 'Univers', 'Conception source', 'Revue design', 'Revue pilote / 2D', 'Fidélité 1:1', 'Travail restant',
    'Modèle GLB', 'Atlas kart 2D', 'Sprite conducteur', 'Vues kart 2D', 'Sprite disponible', 'Contexte sprite', 'Carrosserie', 'Signature', 'Références artistiques', 'Statut de fidélité source', 'Notes de revue'],
  pilotRows, 'PilotesKart');

initializeSheet(circuits, 'P', trackEnd, 'Multiverse Breach — Circuits kart',
  'Sources : docs/kart/kart-tracks.json et références de chaque univers.',
  'Test IA : au moins un des quatre pilotes finit trois tours. La revue visuelle et la comparaison 1:1 restent manuelles.',
  { A: 37, B: 38, C: 29, D: 30, E: 44, F: 19, G: 18, H: 64, I: 23, J: 15, K: 20, L: 20, M: 17, N: 110, O: 34, P: 65 },
  ['ID stable', 'Circuit', 'Univers', 'Conception source', 'Lieu de référence', 'Revue visuelle', 'Fidélité 1:1', 'Travail restant',
    'Simulation IA', 'Repères 3D', 'Thème', 'Tracé', 'Sans combat', 'Références', 'Statut de fidélité source', 'Notes de revue'],
  trackRows, 'CircuitsKart');

function manualReview(sheet, column, end, values) {
  const range = sheet.getRange(`${column}${firstRow}:${column}${end}`);
  range.format.fill = colors.input;
  range.dataValidation = { rule: { type: 'list', values } };
  range.conditionalFormats.add('containsText', { text: 'À corriger', format: { fill: colors.red, font: { color: '#923A32', bold: true } } });
  range.conditionalFormats.add('cellIs', { operator: 'equal', formula: '"Validée"', format: { fill: colors.green } });
}
for (const column of ['E', 'F']) manualReview(pilots, column, pilotEnd, ['À faire', 'À corriger', 'Validée']);
manualReview(pilots, 'G', pilotEnd, ['Non vérifiée', 'À corriger', 'Validée']);
manualReview(circuits, 'F', trackEnd, ['À faire', 'À corriger', 'Validée']);
manualReview(circuits, 'G', trackEnd, ['Non vérifiée', 'À corriger', 'Validée']);
pilots.getRange(`S${firstRow}:S${pilotEnd}`).format.fill = colors.input;
circuits.getRange(`P${firstRow}:P${trackEnd}`).format.fill = colors.input;
pilots.getRange(`L${firstRow}:L${pilotEnd}`).setNumberFormat('#,##0');
circuits.getRange(`J${firstRow}:J${trackEnd}`).setNumberFormat('#,##0');

pilots.getRange(`H${firstRow}`).formulas = [[`=IF(AND(E${firstRow}="Validée",F${firstRow}="Validée",G${firstRow}="Validée"),"Revue terminée.",IF(E${firstRow}<>"Validée",IF(D${firstRow}="Rôle et palette","Créer le design spécifique. ","Affiner le design et les matériaux. "),"")&IF(F${firstRow}<>"Validée","Vérifier le pilote au volant et les huit vues. ","")&IF(G${firstRow}<>"Validée","Comparer les références et noter les écarts 1:1.",""))`]];
pilots.getRange(`H${firstRow}:H${pilotEnd}`).fillDown();
circuits.getRange(`H${firstRow}`).formulas = [[`=IF(AND(F${firstRow}="Validée",G${firstRow}="Validée"),"Revue terminée.",IF(F${firstRow}<>"Validée",IF(D${firstRow}="Prototype","Définir le lieu et produire le décor spécifique. ","Affiner volumes, textures et matériaux. "),"")&IF(G${firstRow}<>"Validée","Comparer les références au même cadrage et noter les écarts 1:1.",""))`]];
circuits.getRange(`H${firstRow}:H${trackEnd}`).fillDown();
pilots.getRange(`H${firstRow}:H${pilotEnd}`).format.fill = colors.formula;
circuits.getRange(`H${firstRow}:H${trackEnd}`).format.fill = colors.formula;

pilots.getRange('A5:H6').values = [
  ['Pilotes', null, 'Modèles GLB', null, 'Atlas 2D', null, 'Vues kart 2D', null],
  ['Designs spécifiques', null, 'Revues terminées', null, 'Fidélité 1:1 validée', null, 'Sprite disponible', null]
];
pilots.getRange('B5').formulas = [[`=COUNTA(A${firstRow}:A${pilotEnd})`]];
pilots.getRange('D5').formulas = [[`=COUNTA(I${firstRow}:I${pilotEnd})`]];
pilots.getRange('F5').formulas = [[`=COUNTA(J${firstRow}:J${pilotEnd})`]];
pilots.getRange('H5').formulas = [[`=SUM(L${firstRow}:L${pilotEnd})`]];
pilots.getRange('B6').formulas = [[`=COUNTIFS(D${firstRow}:D${pilotEnd},"Adaptation personnage")`]];
pilots.getRange('D6').formulas = [[`=COUNTIFS(E${firstRow}:E${pilotEnd},"Validée",F${firstRow}:F${pilotEnd},"Validée",G${firstRow}:G${pilotEnd},"Validée")`]];
pilots.getRange('F6').formulas = [[`=COUNTIFS(G${firstRow}:G${pilotEnd},"Validée")`]];
pilots.getRange('H6').formulas = [[`=COUNTIFS(M${firstRow}:M${pilotEnd},"Oui")`]];

circuits.getRange('A5:H6').values = [
  ['Circuits', null, 'Décors individuels', null, 'Compositions OC', null, 'Prototypes', null],
  ['IA : trois tours', null, 'Sans combat', null, 'Fidélité 1:1 validée', null, 'Revues terminées', null]
];
circuits.getRange('B5').formulas = [[`=COUNTA(A${firstRow}:A${trackEnd})`]];
circuits.getRange('D5').formulas = [[`=COUNTIFS(D${firstRow}:D${trackEnd},"Décor conçu individuellement")`]];
circuits.getRange('F5').formulas = [[`=COUNTIFS(D${firstRow}:D${trackEnd},"Composition OC paramétrique")`]];
circuits.getRange('H5').formulas = [[`=COUNTIFS(D${firstRow}:D${trackEnd},"Prototype")`]];
circuits.getRange('B6').formulas = [[`=COUNTIFS(I${firstRow}:I${trackEnd},"3 tours observés")`]];
circuits.getRange('D6').formulas = [[`=COUNTIFS(M${firstRow}:M${trackEnd},"Oui")`]];
circuits.getRange('F6').formulas = [[`=COUNTIFS(G${firstRow}:G${trackEnd},"Validée")`]];
circuits.getRange('H6').formulas = [[`=COUNTIFS(F${firstRow}:F${trackEnd},"Validée",G${firstRow}:G${trackEnd},"Validée")`]];

// Exercise the actual edit workflow, then restore unreviewed source state.
pilots.getRange('E12').values = [['Validée']];
workbook.recalculate();
assert.match(pilots.getRange('H12').values[0][0], /Vérifier le pilote/);
assert.match(pilots.getRange('H12').values[0][0], /Comparer les références/);
assert.equal(pilots.getRange('D6').values[0][0], 0);
pilots.getRange('F12:G12').values = [['Validée', 'Validée']];
workbook.recalculate();
assert.equal(pilots.getRange('H12').values[0][0], 'Revue terminée.');
assert.equal(pilots.getRange('D6').values[0][0], 1);
assert.equal(pilots.getRange('F6').values[0][0], 1);
pilots.getRange('E12:G12').values = [['À faire', 'À faire', 'Non vérifiée']];
circuits.getRange('F12').values = [['Validée']];
workbook.recalculate();
assert.match(circuits.getRange('H12').values[0][0], /Comparer les références/);
assert.equal(circuits.getRange('H6').values[0][0], 0);
circuits.getRange('G12').values = [['Validée']];
workbook.recalculate();
assert.equal(circuits.getRange('H6').values[0][0], 1);
circuits.getRange('F12:G12').values = [['À faire', 'Non vérifiée']];

workbook.recalculate();
assert.equal(pilots.getRange('B5').values[0][0], pilotManifest.counts.characters);
assert.equal(pilots.getRange('D5').values[0][0], pilotManifest.counts.models);
assert.equal(pilots.getRange('F5').values[0][0], pilotManifest.counts.spriteAtlases);
assert.equal(pilots.getRange('H5').values[0][0], pilotManifest.counts.directionalFrames);
assert.equal(pilots.getRange('B6').values[0][0], pilotManifest.counts.identityAuthored);
assert.equal(pilots.getRange('F6').values[0][0], 0);
assert.equal(circuits.getRange('B5').values[0][0], trackManifest.coverage.tracks);
assert.equal(circuits.getRange('D5').values[0][0], trackManifest.coverage.authored);
assert.equal(circuits.getRange('H5').values[0][0], trackManifest.coverage.prototypes);
assert.equal(circuits.getRange('D6').values[0][0], trackManifest.coverage.peaceful);
assert.equal(circuits.getRange('F6').values[0][0], 0);
assert.match(pilots.getRange(`H${pilotEnd}`).formulas[0][0], new RegExp(`E${pilotEnd}`));
assert.match(circuits.getRange(`H${trackEnd}`).formulas[0][0], new RegExp(`F${trackEnd}`));

await fs.mkdir(outputDir, { recursive: true });
const errors = await workbook.inspect({
  kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',
  options: { useRegex: true, maxResults: 30 }, summary: 'Final formula error scan', maxChars: 4000
});
const inspected = [];
for (const sheetName of ['Pilotes', 'Circuits']) {
  const view = await workbook.inspect({ kind: 'table', range: `${sheetName}!A5:H6`, include: 'values,formulas', tableMaxRows: 2, tableMaxCols: 8, maxChars: 4000 });
  inspected.push({ sheetName, summary: view.ndjson });
  const preview = await workbook.render({ sheetName, range: 'A1:H18', scale: 1, format: 'png' });
  await fs.writeFile(path.join(outputDir, `${sheetName.toLowerCase()}-preview.png`), new Uint8Array(await preview.arrayBuffer()));
}
await fs.writeFile(path.join(outputDir, 'workbook-verification.json'), JSON.stringify({
  date: '2026-11-08', counts: { pilots: pilotRows.length, circuits: trackRows.length },
  formulaEditsVerified: true, humanReviewsCompleted: 0, errorScan: errors.ndjson, summaries: inspected
}, null, 2));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(outputDir, outputName));
await fs.mkdir(path.dirname(finalPath), { recursive: true });
await fs.copyFile(path.join(outputDir, outputName), finalPath);
console.log(JSON.stringify({ output: finalPath, pilots: pilotRows.length, circuits: trackRows.length, bytes: (await fs.stat(finalPath)).size, errorScan: errors.ndjson, summaries: inspected }));
