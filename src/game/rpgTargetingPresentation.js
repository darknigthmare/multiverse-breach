// Canvas and accessible target buttons use the same runtime IDs. Empty space
// never confirms a command or changes the acting character.
const seconds = (value, fr) => Number.isFinite(Number(value)) && value !== null
  ? Number(value).toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 2 }) : '—';

// Present the resolved typed profile. Names alone must never imply immunity,
// target eligibility, a successful counter, or control of an arbitrary enemy.
export function getRpgSourceEffectPresentation(targeting, lang = 'fr') {
  const profile = targeting?.profile;
  if (!profile) return null;
  const fr = lang === 'fr';
  if (profile.invulnerabilityKind === 'mugman-super-art-ii') return {
    label: `${fr ? 'INVULNÉRABLE' : 'INVULNERABLE'} · ${seconds(profile.invulnerabilityDuration, fr)} s`,
    detail: targeting.summon?.kind === 'reinforcement'
      ? (fr ? 'Relais adapté vers l’appelant uniquement. Aucun dégât, soin ou bonus offensif.' : 'Adapted relay to the caller only. No damage, healing or offensive bonus.')
      : (fr ? 'Super Art II : protection personnelle après l’activation.' : 'Super Art II: personal protection after activation.'),
    hideDamageEstimate: true
  };
  if (profile.shieldKind === 'shield-pal-one-hit') return {
    label: fr ? 'SHIELD PAL · 1 coup' : 'SHIELD PAL · 1 hit',
    detail: fr ? 'Persiste jusqu’au prochain coup qui infligerait des dégâts. Ne se cumule pas.' : 'Persists until the next damaging hit. Does not stack.',
    hideDamageEstimate: true
  };
  if (profile.counterKind === 'yukikaze') return {
    label: `${fr ? 'CONTRE CONDITIONNEL' : 'CONDITIONAL COUNTER'} · ${seconds(profile.counterWindowDuration, fr)} s`,
    detail: fr ? 'Yukikaze : attend un contact adverse recevable. La riposte doit ensuite toucher ; les projections et prises ne déclenchent pas le contre.'
      : 'Yukikaze: waits for an eligible incoming contact. The retaliation must then connect; throws and grabs do not trigger it.',
    hideDamageEstimate: true
  };
  if (profile.controlKind === 'paralyzer') return {
    label: `PARALYZER · ${seconds(profile.controlDuration, fr)} s`,
    detail: fr ? 'Autorisation Sibyl spécifique à l’épisode 21. Cible explicitement éligible uniquement ; immobilisation sans dégâts.'
      : 'Episode 21 Sibyl authorization. Only an explicitly eligible target; immobilization without damage.',
    hideDamageEstimate: true
  };
  if (profile.controlKind === 'possession') return {
    label: `${fr ? 'POSSESSION' : 'POSSESSION'} · ${seconds(profile.controlDuration, fr)} s`,
    detail: fr ? `Slig éligible uniquement. Chant de ${seconds(profile.channelDuration, fr)} s, interrompu si Abe est touché. Contrôle des commandes sans changer de camp.`
      : `Eligible Slig only. ${seconds(profile.channelDuration, fr)} s chant, interrupted if Abe is hit. Input control without changing sides.`,
    hideDamageEstimate: true
  };
  return null;
}

export function getRpgSourceStatusPresentation(actor, lang = 'fr') {
  const fr = lang === 'fr', protection = actor?.sourceProtectionWave16, control = actor?.sourceControlWave16;
  if (protection?.active) {
    if (protection.kind === 'mugman-super-art-ii') return `${fr ? 'INVULNÉRABLE' : 'INVULNERABLE'} ${seconds(protection.remaining, fr)} s`;
    if (protection.kind === 'shield-pal-one-hit') return `SHIELD PAL · ${protection.charges} ${fr ? 'coup' : 'hit'}`;
    if (protection.kind === 'yukikaze') return `${fr ? 'CONTRE EN ATTENTE' : 'COUNTER READY'} ${seconds(protection.remaining, fr)} s`;
  }
  if (control?.active) {
    if (control.phase === 'channeling') return `${fr ? 'CHANT' : 'CHANT'} ${seconds(control.channelRemaining, fr)} s`;
    return `${control.kind === 'paralyzer' ? 'PARALYZER' : 'POSSESSION'} ${seconds(control.remaining, fr)} s`;
  }
  return null;
}

export function pickRpgTarget(targeting, x, y) {
  if (!targeting || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return targeting.eligibleTargets.map(target => ({ target, distance: Math.hypot((x - target.x) / (target.hitWidth || 42), (y - target.y) / (target.hitHeight || 48)) }))
    .filter(entry => entry.distance <= 1)
    .sort((a, b) => a.distance - b.distance)[0]?.target.id || null;
}

export function drawRpgTargeting(ctx, targeting, actors) {
  if (!targeting) return;
  const actor = actors.find(unit => (unit.battleId || unit.runtimeId || unit.id) === targeting.actorId);
  const affectedColor = targeting.effect === 'control' ? '#d0acff' : '#a2ffc3';
  ctx.save();
  ctx.lineWidth = 2;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  targeting.eligibleTargets.forEach(target => {
    const affected = targeting.previewTargetIds.includes(target.id);
    ctx.strokeStyle = affected ? affectedColor : '#f5d572';
    ctx.fillStyle = affected ? affectedColor : '#f5d572';
    if (affected && actor) {
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(actor.x, actor.y); ctx.lineTo(target.x, target.y); ctx.stroke();
    }
    ctx.setLineDash(affected ? [] : [4, 4]);
    ctx.beginPath(); ctx.ellipse(target.x, target.y, target.hitWidth || 42, target.hitHeight || 48, 0, 0, Math.PI * 2); ctx.stroke();
    const estimate = targeting.estimates?.find(entry => entry.id === target.id);
    const sourceEffect = getRpgSourceEffectPresentation(targeting);
    const runtimeActor = actors.find(unit => (unit.battleId || unit.runtimeId || unit.id) === target.id);
    const status = getRpgSourceStatusPresentation(runtimeActor);
    const label = `${affected ? '✓ ' : ''}${target.name}${affected && estimate?.amount > 0 && !sourceEffect?.hideDamageEstimate ? ` (${estimate.min}–${estimate.max})` : ''}${status ? ` · ${status}` : ''}`;
    const halfWidth = ctx.measureText(label).width / 2 + 4;
    const labelX = Math.max(halfWidth, Math.min(ctx.canvas.width - halfWidth, target.x));
    const labelY = Math.max(40, target.y - (target.hitHeight || 48) - 8);
    ctx.fillStyle = '#07121deb'; ctx.fillRect(labelX - halfWidth, labelY - 12, halfWidth * 2, 17);
    ctx.fillStyle = affected ? affectedColor : '#f5d572'; ctx.fillText(label, labelX, labelY);
  });
  ctx.restore();
}
