import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { normalizePartARecord } from '../../combat-fidelity-wave16-2026-10-28/part-a/builder.mjs';
import { locateNativeSequences } from '../../combat-fidelity-wave16-2026-10-28/part-a/source-rois.mjs';
import { locateNativeRegions } from './source-regions.mjs';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_C as ACTIVE_SOURCES } from '../../../src/game/combat/combatSourceDefinitionsWave17PartC.js';
import { segmentAtlas } from '../../../scripts/buildCombatEntityAssets.mjs';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const D = 'docs/combat-fidelity-wave17-2026-11-02/part-c';
const sha = b => createHash('sha256').update(b).digest('hex');
const read = p => fs.readFile(path.resolve(ROOT, p));
const json = async p => JSON.parse(await read(p));
const write = (p, v) => fs.writeFile(path.resolve(ROOT, p), JSON.stringify(v, null, 2) + '\n');
const exists = p => fs.access(path.resolve(ROOT, p)).then(() => true, () => false);

// The generated grid is not required to place its middle gutter on width/2.
// Find eight whole units in the original image before importing rectangles.
// This avoids cutting a complete pose merely to split a sheet into halves.
async function locateUnits(bytes, { rowCount = 6, columns = 8, excludeSequences = [] } = {}) {
  const atlas = await segmentAtlas(bytes, rowCount);
  const { data: original, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const sequences = Array.from({ length: rowCount * (columns / 4) }, () => []), units = [];
  for (const [rowIndex, row] of atlas.rows.entries()) {
    const rowHasExcludedSequence = columns === 8 && [rowIndex * 2, rowIndex * 2 + 1].some(i => excludeSequences.includes(i));
    if (!rowHasExcludedSequence) assert.equal(row.seamReview.crossedVisiblePixels, 0, 'Physical row' + rowIndex + ': visible figure crossed a four-pair seam');
    for (const [pairIndex, frame] of row.frames.entries()) {
      const sequenceIndex = columns === 8 ? rowIndex * 2 + Math.floor(pairIndex / 2) : rowIndex;
      if (excludeSequences.includes(sequenceIndex)) continue;
      const preferred = Math.round((pairIndex + 0.5) * info.width / 4), radius = Math.round(info.width / 8 * 0.28);
      const gaps = [];
      for (let x = preferred - radius; columns === 8 && x <= preferred + radius; x++) {
        let visible = 0;
        for (let y = 0; y < frame.height; y++) if (frame.data[(y * frame.width + x) * 4 + 3] > 24) visible++;
        if (!visible) gaps.push(x);
      }
      assert.ok(columns === 4 || gaps.length, 'No transparent seam between two source units row' + rowIndex + ' pair' + pairIndex + ' preferred' + preferred + ' radius' + radius);
      gaps.sort((a, b) => Math.abs(a - preferred) - Math.abs(b - preferred));
      const seam = gaps[0];
      for (let side = 0; side < columns / 4; side++) {
        const startX = columns === 4 ? 0 : side ? seam : 0;
        const endX = columns === 4 ? frame.width : side ? frame.width : seam;
        let left = info.width, right = -1, top = frame.height, bottom = -1, visible = 0;
        for (let y = 0; y < frame.height; y++) for (let x = startX; x < endX; x++) {
          if (frame.data[(y * frame.width + x) * 4 + 3] <= 24) continue;
          left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); visible++;
        }
        assert.ok(visible > 300, 'Source unit missing');
        let x0, x1, y0, y1, foreignVisiblePixels;
        for (const margin of [4, 3, 2, 1]) {
          x0 = Math.max(0, left - margin); x1 = Math.min(info.width, right + margin + 1);
          y0 = Math.max(0, row.sourceBounds.top + top - margin); y1 = Math.min(info.height, row.sourceBounds.top + bottom + margin + 1);
          foreignVisiblePixels = 0;
          for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
            const localY = y - row.sourceBounds.top, inside = localY >= 0 && localY < frame.height;
            const owned = inside && x >= startX && x < endX && frame.data[(localY * frame.width + x) * 4 + 3] > 24;
            if (original[(y * info.width + x) * 4 + 3] > 24 && !owned) foreignVisiblePixels++;
          }
          if (!foreignVisiblePixels) break;
        }
        assert.equal(foreignVisiblePixels, 0, 'A neighbouring complete body contaminates this original RGBA rectangle row' + rowIndex + ' pair' + pairIndex + ' side' + side + ' bounds ' + JSON.stringify({ left, right, top, bottom, x0, x1, y0, y1 }));
        const rect = { left: x0, top: y0, width: x1 - x0, height: y1 - y0,
          physicalRow: rowIndex, physicalColumn: columns === 8 ? pairIndex * 2 + side : pairIndex,
          sourceVisibleBounds: { left, top: row.sourceBounds.top + top, width: right - left + 1, height: bottom - top + 1 },
          foreignVisiblePixels, originalRgbaRetained: true };
        sequences[sequenceIndex].push(rect); units.push(rect);
      }
    }
  }
  for (const [index, sequence] of sequences.entries()) assert.equal(sequence.length, excludeSequences.includes(index) ? 0 : 4, 'A complete four-unit source sequence is missing');
  return { sequences, units, standingBounds: sequences[columns === 8 ? 8 : 0]?.[0]?.sourceVisibleBounds };
}

export { locateUnits as inspectSourceGeometry };

// Analyse each retained four-unit sequence on its own original RGBA region.
// An excluded, touching sequence must not force the boundary search through
// artwork that will never be imported. No intermediate production image is
// created; global regions still copy pixels from the unchanged original PNG.
async function isolatedSequenceRegions(bytes, { rows, excludedPhysical }) {
  const atlas = await segmentAtlas(bytes, rows), meta = await sharp(bytes).metadata();
  const halfWidth = Math.floor(meta.width / 2), sequences = [];
  for (const [row, physical] of atlas.rows.entries()) for (let half = 0; half < 2; half++) {
    const slot = row * 2 + half;
    if (excludedPhysical.includes(slot)) { sequences.push([]); continue; }
    const left = half * halfWidth, width = half ? meta.width - halfWidth : halfWidth;
    const top = physical.sourceBounds.top, height = physical.sourceBounds.bottom - top;
    const input = await sharp(bytes).extract({ left, top, width, height }).png().toBuffer();
    const local = await locateNativeRegions(input, { rows: 1, columns: 4, groupComponentsByGrid: true });
    assert.deepEqual(local.missingSlots, []);
    const offsetBody = body => ({ ...body, left: body.left + left, right: body.right + left, top: body.top + top, bottom: body.bottom + top, cx: body.cx + left, cy: body.cy + top,
      ...(body.componentMembers ? { componentMembers: body.componentMembers.map(offsetBody) } : {}) });
    const offsetSeam = boundary => {
      if (!boundary) return null;
      const points = Int32Array.from(boundary.path, x => x + left);
      return { ...boundary, path: [...points], sha256: sha(Buffer.from(points.buffer)) };
    };
    sequences.push(local.sequences[0].map((region, column) => ({ ...region,
      left: region.left + left, top: region.top + top,
      physicalRow: row, physicalColumn: half * 4 + column, body: offsetBody(region.body),
      leftSeam: offsetSeam(region.leftSeam), rightSeam: offsetSeam(region.rightSeam),
      originalSourceRegion: { left, top, width, height }, originalRgbaRetained: true })));
  }
  return { width: meta.width, height: meta.height, rows, columns: 8, originalRgbaRetained: true,
    sequences, missingSlots: [], retainedDrawings: sequences.flat().length,
    componentGrouping: 'four complete declared source units per retained original physical half-row; excluded phases never imported',
    method: 'original RGBA region crop for analysis only, zero-visible-crossing curved boundaries and complete native-body ownership; no source redraw or new production PNG' };
}

async function explicitlyReviewedSequenceRegions(bytes, { rows, columns, columnSeams }) {
  const atlas = await segmentAtlas(bytes, rows), { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(columnSeams.length, rows);
  const sequences = [];
  for (const [row, physical] of atlas.rows.entries()) {
    const edges = [0, ...columnSeams[row], info.width], top = physical.sourceBounds.top, bottom = physical.sourceBounds.bottom;
    assert.equal(edges.length, columns + 1);
    for (const x of columnSeams[row]) for (let y = top; y < bottom; y++) assert.ok(data[(y * info.width + x) * 4 + 3] <= 24, 'Reviewed source gutter crosses visible RGBA');
    sequences.push(Array.from({ length: columns }, (_, column) => {
      const left = edges[column], right = edges[column + 1];
      let l = right, r = -1, t = bottom, b = -1, pixels = 0;
      for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) if (data[(y * info.width + x) * 4 + 3] > 24) {
        l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y); pixels++;
      }
      assert.ok(pixels > 300 && l > left && r + 1 < right && t > top && b + 1 < bottom, 'Reviewed unit must retain its whole silhouette inside clear original margins');
      return { left, top, width: right - left, height: bottom - top, physicalRow: row, physicalColumn: column,
        body: { left: l, right: r, top: t, bottom: b, pixels, cx: (l + r) / 2, cy: (t + b) / 2 },
        upper: null, lower: null, leftSeam: null, rightSeam: null,
        originalRgbaRetained: true, reviewedWholeSourceUnit: true };
    }));
  }
  return { width: info.width, height: info.height, rows, columns, sequences, missingSlots: [], originalRgbaRetained: true,
    componentGrouping: 'explicit independently reviewed complete source-unit boundaries; physical fish group stays with the third complete duo',
    columnSeams, method: 'Original RGBA rectangular regions through measured empty gutters; no pixel repair, erasure, assembly or new drawing' };
}

async function curvedSequences(file, { rows = 6, columns = 8, groupComponentsByGrid = false, ownershipSeamStep = 1 } = {}) {
  const geometry = await locateNativeRegions(file, { rows, columns, groupComponentsByGrid, ownershipSeamStep });
  if (columns === 8) {
    // Sequence roles are the first/last four complete source drawings in each
    // physical row, as specified by the prompt. A raised arm can move a body's
    // bbox centre across width/2 without changing its source sequence.
    const regions = [...geometry.sequences.flat(), ...geometry.missingGroups.flatMap(g => g.regions)];
    const unique = [...new Map(regions.map(r => [r.physicalRow + ':' + r.physicalColumn, r])).values()];
    const physical = Array.from({ length: rows }, (_, row) => unique.filter(r => r.physicalRow === row).sort((a, b) => a.physicalColumn - b.physicalColumn));
    assert.ok(physical.every(row => row.length >= 8 && row.length <= 10), 'A curved import still requires eight complete native source units per row');
    geometry.originalCentreBasedMissingSlots = geometry.missingSlots;
    geometry.sequences = physical.flatMap(row => [row.slice(0, 4), row.slice(-4)]);
    geometry.sequenceGrouping = 'four complete ordered source units per left/right sequence; extras excluded, not counted as new production poses';
    geometry.excludedExtraPhysicalUnits = physical.flatMap(row => row.slice(4, Math.max(4, row.length - 4)).map(r => ({ row: r.physicalRow, column: r.physicalColumn })));
    geometry.slotToSequence = Object.fromEntries(geometry.sequences.map((_, i) => [i, i])); geometry.missingSlots = [];
    geometry.retainedDrawings = geometry.sequences.length * 4;
  }
  return geometry;
}

export async function collectReviewedRecords() {
  const planBytes = await read(D + '/source-plan.json'), plan = JSON.parse(planBytes);
  const before = await json(D + '/pre-generation-receipt.json');
  const amendment = await exists(D + '/pre-generation-amendment-1.json') ? await json(D + '/pre-generation-amendment-1.json') : { requests: [] };
  const secondAmendment = await exists(D + '/pre-generation-amendment-2.json') ? await json(D + '/pre-generation-amendment-2.json') : { requests: [] };
  assert.equal(sha(planBytes), before.sourcePlanSha256, 'Initial source plan changed');
  const batch = await json('docs/combat-fidelity-wave17-2026-11-02/batch-plan-before.json');
  assert.deepEqual(plan.selectedHeroIds, batch.parts.C);
  const selectedHeroIds = [...plan.selectedHeroIds], allEntries = new Map(plan.entries.map(e => [e.id, e]));
  const replacementRequests = new Map(), withheld = [];
  for (const name of ['shep', 'stella']) {
    const localFile = D + '/source-amendment-before-' + name + '.json';
    if (!(await exists(localFile))) continue;
    const local = await json(localFile), globalBytes = await read(local.globalAmendmentFile), global = JSON.parse(globalBytes);
    assert.equal(sha(globalBytes), local.globalAmendmentSha256);
    assert.ok(global.replacements.some(r => r.part === 'C' && r.withheldId === local.withheldHeroId && r.replacementId === local.replacementHeroId));
    const index = selectedHeroIds.indexOf(local.withheldHeroId); assert.ok(index >= 0);
    selectedHeroIds[index] = local.replacementHeroId; allEntries.set(local.entry.id, local.entry); replacementRequests.set(local.entry.id, local.request);
    const receiptFile = D + '/requests/' + local.withheldHeroId + '-result.json';
    const refusal = await json(receiptFile); assert.equal(refusal.imageReturned, false);
    withheld.push({ heroId: local.withheldHeroId, replacementHeroId: local.replacementHeroId, receiptFile, reason: refusal.error || refusal.output_hint, retryPerformed: false });
  }
  const records = [], remainingHeroIds = [], failures = [];
  // Count actual tool outcomes, including refused calls and fully rejected
  // corrective attempts. Selected source images are a different accounting.
  const actualCallReceipts = [];
  for (const name of await fs.readdir(path.resolve(ROOT, D, 'requests'))) {
    if (!name.endsWith('-result.json')) continue;
    const file = D + '/requests/' + name, value = await json(file);
    if (value.tool === 'image_gen' && value.startedAt) actualCallReceipts.push({ path: file, heroId: value.heroId, requestId: value.requestId || value.heroId, imageReturned: value.imageReturned, startedAt: value.startedAt });
  }
  const actualToolCalls = actualCallReceipts.length;
  for (const id of selectedHeroIds) {
    const plannedEntry = allEntries.get(id), activeEntry = ACTIVE_SOURCES[id]; assert.ok(plannedEntry && activeEntry);
    assert.equal(activeEntry.universe, plannedEntry.universe); assert.equal(activeEntry.id, plannedEntry.id);
    const entry = { ...plannedEntry, ...activeEntry };
    if (process.env.W17_PART_C_DEBUG) console.error('Part C source geometry:', entry.id);
    const receiptFile = D + '/requests/' + entry.id + '-result.json';
    if (!(await exists(receiptFile))) { remainingHeroIds.push(entry.id); continue; }
    let receipt = await json(receiptFile); const initialReceipt = receipt;
    if (!receipt.imageReturned) { failures.push({ heroId: entry.id, receiptFile, reason: receipt.output_hint || 'No image returned' }); continue; }
    const reviewFile = D + '/sources/' + entry.id + '-visual-review.json';
    if (!(await exists(reviewFile))) { remainingHeroIds.push(entry.id); continue; }
    const review = await json(reviewFile); let request = replacementRequests.get(entry.id) || secondAmendment.requests.find(r => r.heroId === entry.id) || amendment.requests.find(r => r.heroId === entry.id) || before.requests.find(r => r.heroId === entry.id);
    assert.equal(review.identityReviewed, true); assert.equal(review.allFramesReviewed, true);
    assert.equal(review.retainedCompleteUnits ?? review.observedCompleteUnits, 48);
    if (review.corrections?.length || review.replacementSource) assert.deepEqual(review.selectedUnitCountsPerRuntimeSequence, Array(12).fill(4));
    else {
      assert.equal(review.sourceUnitsPerPhysicalRow.length, 6);
      assert.ok(review.sourceUnitsPerPhysicalRow.every(count => count >= 8 && count <= 10));
      assert.equal(review.sourceUnitsPerPhysicalRow.reduce((n, count) => n + count, 0), review.observedCompleteUnits);
    }
    assert.deepEqual(receipt.arguments, request.arguments);
    assert.equal(sha(await read(initialReceipt.archivedPath)), initialReceipt.sha256);
    assert.equal(review.sourceImageSha256, initialReceipt.sha256);
    let effectiveReceiptFile = receiptFile, replacementReview = null;
    if (review.replacementSource) {
      const replacement = review.replacementSource, pre = await json(replacement.beforeFile);
      receipt = await json(replacement.receiptFile); replacementReview = await json(replacement.reviewFile);
      assert.equal(pre.beforeGeneration, true); assert.ok(pre.createdAt <= receipt.startedAt);
      assert.deepEqual(receipt.arguments, pre.arguments);
      assert.equal(replacementReview.identityReviewed, true); assert.equal(replacementReview.allFramesReviewed, true);
      assert.equal(replacementReview.retainedCompleteUnits ?? replacementReview.observedCompleteUnits, 48);
      request = { arguments: pre.arguments, promptFile: D + '/requests/' + replacement.key + '-prompt.txt' };
      effectiveReceiptFile = replacement.receiptFile;
    }
    const bytes = await read(receipt.archivedPath), meta = await sharp(bytes).metadata();
    assert.equal(sha(bytes), receipt.sha256);
    if (replacementReview) assert.equal(replacementReview.sourceImageSha256, receipt.sha256);
    const excluded = (review.corrections || []).flatMap(c => c.phaseIndices);
    const originalRows = review.replacementSource?.rows || review.originalRows || 6;
    const originalSequenceSlots = review.originalSequenceSlots || Array.from({ length: 12 }, (_, i) => i);
    const excludedPhysical = excluded.map(i => originalSequenceSlots.indexOf(i)).filter(i => i >= 0);
    let geometry;
    if (excludedPhysical.length) {
      try { geometry = await locateUnits(bytes, { rowCount: originalRows, columns: 8, excludeSequences: excludedPhysical }); }
      catch (rectangleError) {
        try {
          geometry = await curvedSequences(path.resolve(ROOT, receipt.archivedPath), { rows: originalRows, columns: 8, groupComponentsByGrid: true });
          geometry.sequences = geometry.sequences.map((sequence, index) => excludedPhysical.includes(index) ? [] : sequence);
        } catch {
          geometry = await isolatedSequenceRegions(bytes, { rows: originalRows, excludedPhysical });
        }
        geometry.rectangularImportUnavailable = rectangleError.message;
      }
    }
    else if (entry.partner || entry.id === 'gangle' && review.replacementSource) {
      try { geometry = await curvedSequences(path.resolve(ROOT, receipt.archivedPath), { rows: originalRows, columns: 8, groupComponentsByGrid: true }); }
      catch (gridGroupingError) {
        // A wide complete companion can put its centre in the adjacent math
        // bin. Whole-unit rectangles remain valid only with empty seams and
        // zero visible foreign pixels; the source RGBA is not modified.
        try { geometry = await curvedSequences(path.resolve(ROOT, receipt.archivedPath), { rows: originalRows, columns: 8, groupComponentsByGrid: true, ownershipSeamStep: 3 }); }
        catch { geometry = await locateUnits(bytes, { rowCount: originalRows, columns: 8 }); }
        geometry.componentGridGroupingUnavailable = gridGroupingError.message;
      }
    }
    else {
      try { geometry = await locateNativeSequences(path.resolve(ROOT, receipt.archivedPath), { rows: originalRows, columns: 8 }); }
      catch (rectangleError) {
        geometry = await curvedSequences(path.resolve(ROOT, receipt.archivedPath), { rows: originalRows, columns: 8 });
        geometry.rectangularImportUnavailable = rectangleError.message;
      }
    }
    // The older rectangle locator uses an exclusive right boundary at the
    // transparent seam. Include that zero-alpha seam column as an import gutter.
    if (!geometry.originalRgbaRetained && !entry.partner && !excludedPhysical.length) for (const row of geometry.sequences) for (const rect of row) if (rect.left + rect.width < meta.width) rect.width++;
    const standingSequence = originalSequenceSlots.indexOf(8);
    const firstStanding = geometry.sequences[standingSequence][0];
    const primary = firstStanding.body;
    const standing = firstStanding.sourceVisibleBounds || { left: primary.left, top: primary.top, width: primary.right - primary.left + 1, height: primary.bottom - primary.top + 1 };
    const source = {
      key: entry.id + (review.replacementSource ? '-native-corrected' : '-native-original'), heroId: entry.id, kind: review.replacementSource ? 'corrective-full-source' : 'original',
      tool: 'image_gen', provider: 'OpenAI', model: null, generationId: null, jobId: null,
      generatedPath: receipt.generatedPath, archivedPath: receipt.archivedPath,
      sha256: receipt.sha256, rows: originalRows, columns: 8,
      prompt: receipt.arguments.prompt, promptFile: request.promptFile,
      toolResultFile: effectiveReceiptFile, referenceInputs: receipt.arguments.referenced_image_paths || [],
      bodyHeight: standing.height, excludesWeaponEffects: !entry.partner,
      calibration: { measurementKind: entry.partner ? 'complete-standing-duo-unit-height-shared-source-scale' : 'complete-standing-native-body-height',
        sequence: standingSequence, logicalSlot: 8, column: 0, bodyBounds: standing,
        primaryBodyRole: entry.partner ? 'human at left; companion at right, measured together as one declared source unit' : 'solo character',
        targetHeightAppliesTo: entry.partner ? 'complete upright human-and-companion union, not separate human height' : 'solo standing body',
        companionRelativeScalePreserved: !!entry.partner,
        notes: 'One measured complete-standing-unit calibration per source, shared by all48 poses. Every source for a duo uses the same union-height definition so corrective human/partner proportions do not change through mixed human-only versus duo measurements. No body is independently stretched. Canonical relative size and individual source anatomy are not certified1:1.' },
      nativeDrawingsObserved: replacementReview?.observedCompleteUnits ?? review.originalCompleteUnits ?? 48,
      nativeDrawingsRetainedByImport: 48 - excluded.length * 4,
      nativeDrawingsExcluded: (replacementReview?.observedCompleteUnits ?? review.originalCompleteUnits ?? 48) - (48 - excluded.length * 4),
      incompleteSourceCellsExcluded: review.incompleteOriginalCells || 0,
      ...(geometry.originalRgbaRetained ? {} : { frameRects: geometry.sequences.filter(r => r.length) }),
      anchorMode: entry.partner ? 'body-center' : 'native-foot-median', acceptedForSelection: true
    };
    if (geometry.originalRgbaRetained) {
      assert.deepEqual(geometry.missingSlots, [], 'Every native/base duo source sequence must contain four complete units');
      geometry.sequences = geometry.sequences.filter(sequence => sequence.length);
      geometry.retainedDrawings = geometry.sequences.length * 4;
      const regionsFile = D + '/sources/' + entry.id + '-source-regions.json';
      const regionsBytes = Buffer.from(JSON.stringify(geometry, null, 2) + '\n'); await fs.writeFile(path.resolve(ROOT, regionsFile), regionsBytes);
      source.importRegionsFile = regionsFile; source.importRegionsSha256 = sha(regionsBytes);
      source.sourceComponentsObserved = geometry.sourceComponentsObserved; source.componentGrouping = geometry.componentGrouping;
    }
    const sources = [source], correctionMap = new Map();
    for (const correction of review.corrections || []) {
      const beforeCorrection = await json(correction.beforeFile), actual = await json(correction.receiptFile), checked = await json(correction.reviewFile);
      assert.equal(beforeCorrection.beforeGeneration, true); assert.ok(beforeCorrection.createdAt <= actual.startedAt);
      assert.deepEqual(actual.arguments, beforeCorrection.arguments);
      assert.equal(checked.identityReviewed, true); assert.equal(checked.allFramesReviewed, true);
      assert.equal(checked.retainedCompleteUnits ?? checked.observedCompleteUnits, correction.phaseIndices.length * 4);
      const correctedBytes = await read(actual.archivedPath);
      assert.equal(sha(correctedBytes), actual.sha256); assert.equal(checked.sourceImageSha256, actual.sha256);
      const correctedGeometry = checked.reviewedSourceColumnSeams
        ? await explicitlyReviewedSequenceRegions(correctedBytes, { rows: correction.rows, columns: correction.columns, columnSeams: checked.reviewedSourceColumnSeams })
        : await curvedSequences(path.resolve(ROOT, actual.archivedPath), { rows: correction.rows, columns: correction.columns, groupComponentsByGrid: true });
      assert.deepEqual(correctedGeometry.missingSlots, []);
      const calibrationSequence = correction.calibrationSequence ?? beforeCorrection.calibrationSequence ?? 0;
      const calibrationRegion = correctedGeometry.sequences[calibrationSequence][0];
      const calibrationBody = calibrationRegion.body;
      const calibrated = { left: calibrationBody.left, top: calibrationBody.top, width: calibrationBody.right - calibrationBody.left + 1, height: calibrationBody.bottom - calibrationBody.top + 1 };
      correctedGeometry.sequences = correctedGeometry.sequences.slice(0, correction.phaseIndices.length);
      correctedGeometry.retainedDrawings = correction.phaseIndices.length * 4;
      correctedGeometry.excludedSourceDrawings = checked.observedCompleteUnits - correctedGeometry.retainedDrawings;
      correctedGeometry.excludedCalibrationDrawings = checked.excludedCalibrationUnits ?? correctedGeometry.excludedSourceDrawings;
      correctedGeometry.excludedRejectedDrawings = correctedGeometry.excludedSourceDrawings - correctedGeometry.excludedCalibrationDrawings;
      assert.ok(correctedGeometry.excludedRejectedDrawings >= 0);
      const correctedRegionsFile = D + '/sources/' + correction.key + '-source-regions.json';
      const correctedRegionsBytes = Buffer.from(JSON.stringify(correctedGeometry, null, 2) + '\n'); await fs.writeFile(path.resolve(ROOT, correctedRegionsFile), correctedRegionsBytes);
      const index = sources.length;
      sources.push({ ...source, key: correction.key, kind: 'corrective', generatedPath: actual.generatedPath,
        archivedPath: actual.archivedPath, sha256: actual.sha256, rows: correction.rows, columns: correction.columns,
        prompt: actual.arguments.prompt, promptFile: D + '/requests/' + correction.key + '-prompt.txt',
        toolResultFile: correction.receiptFile, referenceInputs: actual.arguments.referenced_image_paths || [],
        frameRects: undefined, importRegionsFile: correctedRegionsFile, importRegionsSha256: sha(correctedRegionsBytes), bodyHeight: calibrated.height,
        sourceComponentsObserved: correctedGeometry.sourceComponentsObserved, componentGrouping: correctedGeometry.componentGrouping,
        calibration: { ...source.calibration, sequence: calibrationSequence, bodyBounds: calibrated, excludedCalibrationDrawings: correctedGeometry.excludedCalibrationDrawings },
        nativeDrawingsObserved: checked.observedCompleteUnits, nativeDrawingsRetainedByImport: correctedGeometry.retainedDrawings,
        nativeDrawingsExcluded: correctedGeometry.excludedSourceDrawings,
        excludedCalibrationDrawings: correctedGeometry.excludedCalibrationDrawings,
        excludedRejectedDrawings: correctedGeometry.excludedRejectedDrawings, incompleteSourceCellsExcluded: 0 });
      correction.phaseIndices.forEach((phase, row) => correctionMap.set(phase, { source: index, row }));
    }
    const retainedOriginal = Array.from({ length: 12 }, (_, i) => i).filter(i => !excluded.includes(i));
    const sequence = index => {
      const selected = { ...(correctionMap.get(index) || { source: 0, row: retainedOriginal.indexOf(index) }) };
      const permutation = review.sequencePermutations?.[index];
      if (permutation) { selected.columnOrder = permutation; selected.permutationReason = review.permutationNotes?.[index] || 'Reorder four whole independently drawn source poses so actual physical release is in runtime column2; no new drawing or body-part assembly.'; }
      return selected;
    };
    records.push({ heroId: entry.id, name: entry.displayName, universe: entry.universe,
      sourceWork: entry.sourceWork, sourceReference: entry.sourceReference, version: entry.appearance,
      referenceAsset: entry.referenceAsset, referenceAssetSha256: entry.referenceSha256,
      referenceArchive: entry.referenceArchive, referenceUse: 'Historical source is archived for comparison only. Exact selected incarnation and dated errata define the intended source; no official1:1 certification.',
      targetBodyHeight: entry.bodyHeight, simpleName: entry.simpleName, superName: entry.actionName,
      effect: entry.effect, delivery: entry.delivery, partner: entry.partner,
      reviewed: true, reviewFile, reviewNotes: review.notes,
      nativeSelections: Array.from({ length: 8 }, (_, i) => sequence(i)),
      baseSelections: Array.from({ length: 4 }, (_, i) => sequence(i + 8)),
      retainedDistinctPoses: 48, sources,
      ...((review.replacementSource || review.excludedCorrectiveSources?.length) ? { excludedSourceImages: [...(review.replacementSource ? [{ path: initialReceipt.archivedPath, sha256: initialReceipt.sha256,
        completeDrawingsObserved: review.originalCompleteUnits || 48, retainedDrawings: 0,
        excludedDrawings: review.originalCompleteUnits || 48, reason: review.replacementSource.reason }] : []), ...(review.excludedCorrectiveSources || [])] } : {}),
      ...(entry.appearance !== plannedEntry.appearance ? { initialSourceAppearance: plannedEntry.appearance, activeSourceAppearance: entry.appearance, datedErrataPreserved: true } : {}) });
  }
  const result = { schemaVersion: 1, wave: 17, part: 'C', selectedHeroIds,
    originalSelectedHeroIds: plan.selectedHeroIds, reviewedHeroIds: [...allEntries.keys()], withheld,
    sourcePlanSha256: before.sourcePlanSha256, actualToolCalls, actualCallReceipts,
    source1to1Verified: false, records, remainingHeroIds, failures };
  await write(D + '/generation-records.json', result);
  return result;
}

export async function buildPartC(kind, { check = false } = {}) {
  assert.ok(['native', 'base'].includes(kind));
  const manifest = check ? await json(D + '/generation-records.json') : await collectReviewedRecords();
  assert.equal(new Set(manifest.records.map(r => r.heroId)).size, manifest.records.length);
  assert.deepEqual([...manifest.records.map(r => r.heroId), ...manifest.remainingHeroIds, ...manifest.failures.map(r => r.heroId)].sort(), [...manifest.selectedHeroIds].sort());
  const entries = [], allHashes = [];
  const oppositeFile = 'src/game/combat/' + (kind === 'native' ? 'characterSpriteCorrections' : 'characterAnimations') + 'Wave17PartC.generated.json';
  const opposite = await exists(oppositeFile) ? (await json(oppositeFile)).entries : [];
  for (const record of manifest.records) {
    assert.equal(sha(await read(record.referenceArchive)), record.referenceAssetSha256);
    assert.equal(sha(await read('public' + record.referenceAsset)), record.referenceAssetSha256);
    const { bytes, entry } = await normalizePartARecord(record, kind);
    entry.sheet = '/sprites/generated/combat-character-' + (kind === 'base' ? 'corrections' : 'animations') + '-wave17-part-c/' + record.heroId + '.png';
    entry.sourcePartner = record.partner;
    entry.sourceUnitCount = record.partner ? 2 : 1;
    entry.sourceUnitPoseCounting = '48 whole source-unit drawings across native32 and base16; a duo drawing is counted once';
    entry.sourceEmitterRole = record.partner || 'own-body-or-held-equipment';
    const rows = entry.visualValidation[kind === 'base' ? 'stateReviews' : 'phaseReviews'];
    const peer = opposite.find(e => e.heroId === record.heroId && e.sourceImageSha256 === entry.sourceImageSha256);
    if (peer) {
      const peerRows = peer.visualValidation[kind === 'base' ? 'phaseReviews' : 'stateReviews'];
      assert.equal(new Set([...rows, ...peerRows].flatMap(r => r.frameHashes)).size, 48, record.heroId + ': a complete drawing is repeated across native32/base16');
    } else if (check) throw Error(record.heroId + ': opposite registry must exist for the final cross-native/base uniqueness check');
    allHashes.push(...rows.flatMap(r => r.frameHashes));
    entries.push(entry);
    if (check) assert.equal(sha(await read('public' + entry.sheet)), entry.sha256);
    else {
      const dest = path.resolve(ROOT, 'public' + entry.sheet); await fs.mkdir(path.dirname(dest), { recursive: true }); await fs.writeFile(dest, bytes);
      await fs.mkdir(path.resolve(ROOT, D, kind + '-contacts'), { recursive: true });
      await sharp(bytes).resize(512, entry.rows * 128, { kernel: sharp.kernel.nearest }).flatten({ background: '#243148' }).png().toFile(path.resolve(ROOT, D, kind + '-contacts', record.heroId + '.png'));
    }
  }
  assert.equal(new Set(allHashes).size, allHashes.length, 'Repeated complete drawing across identities');
  const registry = { schemaVersion: 1, source: 'OpenAI', entries };
  const registryFile = 'src/game/combat/' + (kind === 'base' ? 'characterSpriteCorrections' : 'characterAnimations') + 'Wave17PartC.generated.json';
  const provenance = { schemaVersion: 1, date: '2026-11-02', part: 'C', kind, provider: 'OpenAI', tool: 'image_gen', source1to1Verified: false,
    generationRecords: D + '/generation-records.json', selectedHeroIds: manifest.selectedHeroIds,
    remainingHeroIds: manifest.remainingHeroIds, failures: manifest.failures,
    records: manifest.records, entries,
    method: 'Real generated native RGBA only. Reused audited crop/nearest-neighbour packing; one source-wide standing scale. No redrawing, recolouring, mirroring, clone frames or invented generation IDs. Duo units count once.' };
  if (check) { assert.deepEqual(await json(registryFile), registry); assert.deepEqual(await json(D + '/' + kind + '-provenance.json'), provenance); }
  else { await write(registryFile, registry); await write(D + '/' + kind + '-provenance.json', provenance); }
  return { part: 'C', kind, selected: manifest.selectedHeroIds.length, heroes: entries.length, poses: entries.reduce((n, e) => n + e.frames, 0), remaining: manifest.remainingHeroIds.length, failures: manifest.failures.map(f => f.heroId), check, source1to1Verified: false };
}
