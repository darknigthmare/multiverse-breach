/** Deterministic CSV for Excel; node scripts/exportCanonicalEquipmentChronology.mjs [--check] */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STAR_WARS_EQUIPMENT_CHRONOLOGY } from '../src/game/starWarsEquipmentChronology.js';
export const TIMELINE_FIELDS = Object.freeze(['id','actorId','actorName','edition','item','kind','implementation','sourceUrl','evidence','constraint','visual']);
const csvCell = value => '"'+String(value ?? '').replaceAll('"','""')+'"';
export function buildTimelineCsv() {
  return [TIMELINE_FIELDS, ...STAR_WARS_EQUIPMENT_CHRONOLOGY.map(row => TIMELINE_FIELDS.map(field => row[field]))]
    .map(row => row.map(csvCell).join(',')).join('\n') + '\n';
}
const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const target = new URL('../docs/excel/equipment-incarnation-matrix-2026-11-01.csv', import.meta.url);
  const expected = buildTimelineCsv();
  if (process.argv.includes('--check')) {
    if (readFileSync(target, 'utf8') !== expected) throw new Error('Equipment chronology CSV is stale; regenerate first');
    process.stdout.write('Equipment chronology CSV matches source: '+STAR_WARS_EQUIPMENT_CHRONOLOGY.length+' records.\n');
  } else {
    writeFileSync(target, expected);
    process.stdout.write('Equipment chronology CSV generated.\n');
  }
}
