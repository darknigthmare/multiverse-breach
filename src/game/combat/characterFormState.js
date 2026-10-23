// Cosmetic form selection follows the existing combat buff clocks. It creates
// no timer, damage, automatic command, or claim of original-game Berserk rules.
const actorId = actor => actor?.sourceHeroId || actor?.sourceId || actor?.id;
const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));

export function combatBuffSource(actor, profile, slot = 'special') {
  return {
    sourceHeroId: actorId(actor),
    universe: actor?.universe,
    name: profile?.name || profile?.action?.name,
    slot: profile?.sourceAbility?.slot || slot
  };
}

const isChaos = source => source?.sourceHeroId === 'vincent_ff7'
  && source.universe === 'Final Fantasy VII' && source.name === 'Chaos' && source.slot === 'special';

export function getCharacterFormFrame(actor, { elapsedSeconds = 0 } = {}) {
  if (actorId(actor) !== 'vincent_ff7' || actor?.universe !== 'Final Fantasy VII'
    || Number(actor.currentHp) <= 0 || ['dead', 'defeat'].includes(actor.state)) return null;
  const phase = actor.presentationPhase;
  // A finale is a projection after the result. Its transformation never applies
  // a combat buff and cannot inflict a second impact or extend a live buff.
  if (phase === 'fatality') {
    const progress = clamp(actor.presentationProgress);
    if (progress < 0.28 || progress >= 0.82) return null;
    const formProgress = (progress - 0.28) / 0.54;
    return { id: 'vincent-chaos', state: 'attack', row: 2, col: Math.min(3, Math.floor(formProgress * 4)),
      progress: formProgress, presentationOnly: true };
  }
  if (phase && phase !== 'super') return null;
  const active = (actor.meleeSuperSupport?.effect === 'buff' && actor.meleeSuperSupport.remaining > 0 && isChaos(actor.meleeSuperSupport.source))
    || (actor.superBuffSeconds > 0 && isChaos(actor.superBuffSource))
    || (actor.rpgBuffTicks > 0 && isChaos(actor.rpgBuffSource));
  if (!active) return null;
  const isSuper = actor.presentationPhase === 'super' || actor.action?.superProfile || actor.action?.type === 'super' || actor.rpgSpecialVisual?.profile;
  const state = /hit|stun|shieldBreak/.test(actor.state) ? 'hit'
    : actor.action && !isSuper ? 'attack'
      : /attack|aerial|chargeRelease|special/.test(actor.state) && !isSuper ? 'attack'
        : /run|walk|jump|fall|ledge/.test(actor.state) ? 'run' : 'idle';
  const row = { idle: 0, run: 1, attack: 2, hit: 3 }[state];
  const elapsed = Math.max(0, Number(actor.action?.elapsed ?? actor.stateElapsed ?? elapsedSeconds) || 0);
  const action = actor.action;
  let col;
  if (state === 'attack' && action?.duration > 0) {
    const progress = clamp(elapsed / action.duration);
    const impact = Math.max(0.05, Math.min(0.9, Number(action.hitAt / action.duration) || 0.5));
    col = progress < impact * 0.55 ? 0 : progress < impact ? 1 : progress < impact + (1 - impact) * 0.65 ? 2 : 3;
  } else col = state === 'hit' ? Math.min(3, Math.floor(elapsed * 8)) : Math.floor(elapsed * (state === 'run' ? 12 : 8)) % 4;
  return { id: 'vincent-chaos', state, row, col, presentationOnly: false };
}
