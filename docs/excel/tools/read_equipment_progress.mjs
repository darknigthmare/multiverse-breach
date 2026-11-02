/** Read manual progress from a previous workbook in a separate process.
 * This keeps its spreadsheet model out of the next workbook's memory budget.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { SpreadsheetFile } from '@oai/artifact-tool';
import { parsePreviousActions } from './equipment_progress.mjs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error('Usage: read_equipment_progress.mjs PREVIOUS.xlsx PROGRESS.json');
const bytes = await fs.readFile(inputPath);
const sha256 = createHash('sha256').update(bytes).digest('hex');
const workbook = await SpreadsheetFile.importXlsx(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const sheet = workbook.worksheets.getItem('Actions');
if (!sheet) throw new Error('Previous workbook has no Actions sheet.');
const used = sheet.getUsedRange(true);
const values = used.values;
const formulas = used.formulas;
const headerIndex = values.findIndex(row => row.includes('ID dossier') && row.includes('IDs des constats') && row.includes('Avancement'));
if (headerIndex < 0) throw new Error('Previous Actions headers were not found.');
const headers = values[headerIndex];
const computedColumn = headers.indexOf('Résultat du suivi');
for (let row = headerIndex + 1; row < values.length; row++) {
  for (let column = 0; column < headers.length; column++) {
    if (column !== computedColumn && formulas[row]?.[column]) {
      throw new Error('Formula in previous Actions input: data row ' + (row - headerIndex) + ', column ' + headers[column] + '. Replace it with its intended text before carrying progress forward.');
    }
  }
}
const progress = parsePreviousActions(headers, values.slice(headerIndex + 1));
progress.source = { filename: path.basename(inputPath), sha256, bytes: bytes.length };
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(progress, null, 2) + '\n');
console.log('Read previous equipment progress: ' + progress.records.length + ' dossiers');
