// Original MGS (1998) armament. Cells, salvo damage and chaff turns are adaptations.
export const REX_ATTACK_NAMES = Object.freeze({
  machine_guns: Object.freeze({ fr: 'Mitrailleuses frontales', en: 'Frontal machine guns' }),
  missiles: Object.freeze({ fr: 'Salve de missiles', en: 'Missile salvo' }),
  belly_laser: Object.freeze({ fr: 'Laser ventral', en: 'Belly laser' }),
  stomp: Object.freeze({ fr: 'Piétinement', en: 'Foot stomp' })
});
export const REX_CHAFF_SUPPLY = 3;
export const REX_CHAFF_ATTACKS = 2;
export const REX_ATTACK_ADAPTATION = 'Marked grid footprints, range, damage, a three-grenade shared supply and two REX attacks of chaff are tactical adaptations, not original PS1 measurements. The original five seconds refer to the grenade fuse, not jamming duration. Radar-phase chaff disperses two of three missile impacts; manual cockpit targeting, machine guns, laser and feet remain dangerous. Gray Fox cinematics and REX traversal remain summarized.';

const alive = unit => unit?.currentHp > 0 && Number.isInteger(unit.gridX) && Number.isInteger(unit.gridY);
const distance = (a, b) => Math.abs(a.gridX - b.gridX) + Math.abs(a.gridY - b.gridY);
const unique = cells => [...new Map(cells.map(cell => [`${cell.x},${cell.y}`, cell])).values()];
const inside = (cell, cols, rows) => cell.x >= 0 && cell.y >= 0 && cell.x < cols && cell.y < rows;

export function prepareRexAttack(encounter, heroes, cols, rows) {
  if (!encounter || encounter.complete) return null;
  const body = encounter.body;
  const target = heroes.filter(alive).sort((a, b) => distance(body, a) - distance(body, b))[0];
  if (!target) return null;
  const d = distance(body, target);
  const dx = target.gridX - body.gridX;
  const dy = target.gridY - body.gridY;
  const direction = Math.abs(dx) >= Math.abs(dy)
    ? { x: Math.sign(dx) || 1, y: 0 } : { x: 0, y: Math.sign(dy) || 1 };
  const side = { x: -direction.y, y: direction.x };
  const kind = d <= 1 ? 'stomp' : d <= 3
    ? (encounter.attackCount % 2 === 1 ? 'belly_laser' : 'machine_guns')
    : (encounter.attackCount % 2 === 0 ? 'missiles' : 'machine_guns');
  let cells = [];
  if (kind === 'stomp') {
    for (const [x, y] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) cells.push({ x: body.gridX + x, y: body.gridY + y });
  } else if (kind === 'missiles') {
    cells = [-1, 0, 1].map(offset => ({ x: target.gridX + side.x * offset, y: target.gridY + side.y * offset }));
  } else {
    for (let step = 1; step <= (kind === 'belly_laser' ? 3 : 6); step++) {
      const center = { x: body.gridX + direction.x * step, y: body.gridY + direction.y * step };
      cells.push(center);
      if (kind === 'machine_guns' && step >= 2) {
        cells.push({ x: center.x + side.x, y: center.y + side.y }, { x: center.x - side.x, y: center.y - side.y });
      }
    }
  }
  return { kind, cells: unique(cells).filter(cell => inside(cell, cols, rows)),
    lockCell: { x: target.gridX, y: target.gridY },
    direction, phasePlanned: encounter.phase };
}

export function getRexAttackIntent(encounter) {
  if (!encounter?.attackIntent || encounter.complete) return null;
  const intent = encounter.attackIntent;
  const radarDispersed = intent.kind === 'missiles' && encounter.phase === 'radome' && encounter.chaffAttacksRemaining > 0;
  return { ...intent, cells: (radarDispersed ? [intent.lockCell] : intent.cells).map(cell => ({ ...cell })),
    lockCell: { ...intent.lockCell }, direction: { ...intent.direction },
    tracking: intent.kind === 'missiles' ? (encounter.phase === 'radome' ? 'radar' : 'manual') : null,
    radarDispersed, damageMultiplier: radarDispersed ? 1 / 3 : 1 };
}

export function activateRexChaff(encounter) {
  if (!encounter || encounter.complete || encounter.phase !== 'radome' || encounter.chaffRemaining <= 0 || encounter.chaffAttacksRemaining > 0) return false;
  encounter.chaffRemaining--;
  encounter.chaffAttacksRemaining = REX_CHAFF_ATTACKS;
  encounter.chaffUsed++;
  return true;
}

export function finishRexAttack(encounter) {
  if (!encounter || encounter.complete) return;
  encounter.attackCount++;
  encounter.chaffAttacksRemaining = Math.max(0, encounter.chaffAttacksRemaining - 1);
}
