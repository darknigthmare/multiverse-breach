import { getMosaicMissionCargoSpec, matchesMosaicMissionOperationReceipt } from './mosaicMissionOperations.js';

/** Read only verified, ordered transfers from the current saved story. Unknown
 * DLC records and archived visits are retained by the save layer, not promoted
 * into new physical possessions. */
export function getMosaicMissionCargoTransfers(mission, saved, steps, lang = 'fr') {
  if (saved?.storyRevision !== 2 || !Array.isArray(saved.completedStepIds)) return [];
  const transfers = [];
  let previousSequence = 0;
  for (let index = 0; index < saved.completedStepIds.length; index++) {
    const step = steps[index], cargo = getMosaicMissionCargoSpec(step);
    if (step?.id !== saved.completedStepIds[index]) break;
    if (!cargo) { if (step?.cargo) break; else continue; }
    const receipt = saved.operationReceipts?.[step.id];
    if (!matchesMosaicMissionOperationReceipt(receipt, mission, step, `${mission.id}::${step.id}`, saved)
      || receipt.sequence <= previousSequence) break;
    previousSequence = receipt.sequence;
    transfers.push({ action: cargo.action, missionId: mission.id, heroId: mission.heroId,
      universe: mission.universe, districtId: mission.districtId, id: cargo.id,
      label: cargo.label[lang === 'fr' ? 'fr' : 'en'], appearance: cargo.appearance,
      stepId: step.id, sequence: receipt.sequence });
  }
  return transfers;
}

export function resolveMosaicMissionCargo(transfers) {
  let carried = null;
  for (const transfer of [...transfers].sort((a, b) => a.sequence - b.sequence || a.missionId.localeCompare(b.missionId))) {
    if (transfer.action === 'take') {
      // A second historical take cannot conjure a second carrying slot.
      if (!carried) { const { action: _action, ...item } = transfer; carried = item; }
    } else if (carried && transfer.action === 'deliver' && transfer.missionId === carried.missionId
      && transfer.id === carried.id && transfer.universe === carried.universe
      && transfer.districtId === carried.districtId && transfer.sequence > carried.sequence) carried = null;
  }
  return carried;
}

/** Code-native carried silhouettes, drawn in the same world transform as the
 * avatar. Drawing never transfers an object or changes progress. */
export function drawMosaicMissionCargo(ctx, cargo, player, tick = 0, reducedMotion = false) {
  if (!cargo || !Number.isFinite(player?.x) || !Number.isFinite(player?.y)) return;
  const bob = reducedMotion ? 0 : Math.sin(tick * 0.06) * 1.5;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.save(); ctx.translate(24, -16 + bob);
  ctx.lineWidth = 2; ctx.strokeStyle = '#ffe2a8'; ctx.fillStyle = '#243d49';
  if (cargo.appearance === 'brace') {
    ctx.fillRect(-3, -17, 6, 30); ctx.strokeRect(-3, -17, 6, 30);
    ctx.fillRect(-11, -18, 22, 5); ctx.strokeRect(-11, -18, 22, 5);
    ctx.fillRect(-10, 11, 20, 5); ctx.strokeRect(-10, 11, 20, 5);
    ctx.beginPath(); ctx.moveTo(-9, 7); ctx.lineTo(8, -8); ctx.stroke();
  } else if (cargo.appearance === 'lamp') {
    ctx.fillRect(-7, -11, 14, 18); ctx.strokeRect(-7, -11, 14, 18);
    ctx.beginPath(); ctx.arc(0, -12, 5, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#ffe2a8'; ctx.fillRect(-4, -7, 8, 9);
  } else if (cargo.appearance === 'rotor') {
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(9, 0); ctx.moveTo(0, -9); ctx.lineTo(0, 9); ctx.stroke();
  } else if (cargo.appearance === 'probe') {
    ctx.fillRect(-10, -6, 20, 12); ctx.strokeRect(-10, -6, 20, 12);
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(15, 0); ctx.lineTo(15, 6); ctx.stroke();
    ctx.fillStyle = '#8fd7ed'; ctx.fillRect(-5, -3, 4, 4);
  } else {
    ctx.beginPath(); ctx.moveTo(-10, -8); ctx.lineTo(7, -11); ctx.lineTo(12, 5); ctx.lineTo(-5, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#e1e9ff'; ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(7, 3); ctx.stroke();
  }
  ctx.restore();
  ctx.font = '10px "Share Tech Mono"'; ctx.textAlign = 'center';
  const width = ctx.measureText(cargo.label).width + 14;
  ctx.fillStyle = 'rgba(5,12,18,0.93)'; ctx.fillRect(-width / 2, -78, width, 17);
  ctx.fillStyle = '#ffe2a8'; ctx.fillText(cargo.label, 0, -66);
  ctx.restore();
}
