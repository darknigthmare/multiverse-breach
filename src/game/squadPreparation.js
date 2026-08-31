import { deriveRequiredTeam, evaluateMissionAccess } from './missions/missionAccessRules.js';

// This is the pre-existing A.R.C.A. display formula, shared verbatim by the
// display, proposal preview and optimizer. It is not a win-probability model.
export function calculateSquadReadiness(entries, { synergies = [], factionRules = [], missionFactionIds = [] } = {}) {
  const team = entries.filter(Boolean);
  const categories = new Map();
  team.forEach(hero => categories.set(hero.category, (categories.get(hero.category) || 0) + 1));
  const archetypes = synergies.filter(rule => (categories.get(rule.category) || 0) >= 2).length;
  const missionFactions = new Set(missionFactionIds);
  const factionTeam = team.filter(hero => hero.factionEligible !== false);
  const factions = factionRules.filter(rule => {
    const count = rule.base ? factionTeam.filter(hero => (hero.factionIds || []).includes(rule.id)).length
      : missionFactions.has(rule.id) ? factionTeam.length : 0;
    return count >= rule.minMembers;
  }).length;
  const averageLevel = team.length ? team.reduce((sum, hero) => sum + (hero.level || 1), 0) / team.length : 0;
  const relicCount = team.filter(hero => hero.hasRelic).length;
  const eventCount = team.filter(hero => hero.hasEvent).length;
  const breakdown = {
    members: (team.length / 3) * 38,
    levels: Math.min(22, averageLevel * 4),
    archetypes: archetypes * 12,
    factions: factions * 8,
    relics: relicCount * 5,
    events: eventCount * 3
  };
  const score = Math.min(100, Math.round(Object.values(breakdown).reduce((sum, value) => sum + value, 0)));
  return { score, grade: score >= 85 ? 'S' : score >= 70 ? 'A' : score >= 50 ? 'B' : 'C', breakdown, averageLevel, archetypes, factions, relicCount, eventCount };
}

// Preserve the existing auto-equip priority, including upgraded boosts supplied
// by getGearDisplay. No sale, consumption, or reserve reassignment is proposed.
export const scoreRelicPriority = item => (item?.boost?.atk || 0) * 1.5
  + (item?.boost?.spd || 0) * 1.2 + (item?.boost?.def || 0) + (item?.boost?.hp || 0) * 0.1;

export function proposeRelicAssignment({ team, equippedGear, inventoryIds, items, lockedHeroIds = [] }) {
  const activeIds = [...new Set(team)];
  const activeSet = new Set(activeIds);
  const inventory = new Set(inventoryIds);
  const itemById = new Map(items.filter(Boolean).map(item => [item.id, item]));
  const locked = new Set(lockedHeroIds);
  // Unknown or missing inventory references are kept rather than silently lost.
  activeIds.forEach(heroId => {
    const current = equippedGear[heroId];
    if (current && (!inventory.has(current) || !itemById.has(current))) locked.add(heroId);
  });
  const protectedGear = new Set(Object.entries(equippedGear)
    .filter(([heroId]) => !activeSet.has(heroId) || locked.has(heroId)).map(([, gearId]) => gearId).filter(Boolean));
  const slots = activeIds.filter(heroId => !locked.has(heroId));
  const currentActiveGear = new Set(slots.map(heroId => equippedGear[heroId]).filter(Boolean));
  const available = [...itemById.values()].filter(item => inventory.has(item.id) && !protectedGear.has(item.id));
  available.sort((a, b) => scoreRelicPriority(b) - scoreRelicPriority(a)
    || Number(currentActiveGear.has(b.id)) - Number(currentActiveGear.has(a.id)) || a.id.localeCompare(b.id, 'en'));
  const chosen = new Set(available.slice(0, slots.length).map(item => item.id));
  const after = { ...equippedGear };
  // Keep equal/better currently equipped items in place; only changed slots are
  // filled, so a partial inventory never strips a well-equipped team member.
  slots.forEach(heroId => {
    if (chosen.has(equippedGear[heroId])) chosen.delete(equippedGear[heroId]);
    else after[heroId] = null;
  });
  const replacements = available.filter(item => chosen.has(item.id));
  slots.filter(heroId => !after[heroId]).forEach((heroId, index) => {
    if (replacements[index]) after[heroId] = replacements[index].id;
  });
  const changes = activeIds.filter(heroId => (equippedGear[heroId] || null) !== (after[heroId] || null)).map(heroId => ({
    heroId,
    beforeId: equippedGear[heroId] || null,
    afterId: after[heroId] || null,
    beforePriority: scoreRelicPriority(itemById.get(equippedGear[heroId])),
    afterPriority: scoreRelicPriority(itemById.get(after[heroId]))
  }));
  return { kind: 'gear', team: activeIds, before: { ...equippedGear }, after, changes };
}

const shuffle = (entries, random) => {
  const result = [...entries];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.max(0, Math.min(i, Math.floor(random() * (i + 1))));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const universeKey = universe => String(universe || '').trim().toLocaleLowerCase('en');
const sameUniverse = (left, right) => universeKey(left) === universeKey(right);

export async function proposeSquad({
  heroes, ownedHeroIds, eligibleHeroIds = ownedHeroIds, currentTeam = [], lockedHeroIds = [],
  stage = null, completedArcIds = [], arcReplayUnlockedIds = [], universe = null,
  mode = 'random', preparationById, preparationContext, random = Math.random,
  yieldControl = () => Promise.resolve(), onProgress = () => {}, isCancelled = () => false, anchorId = 'player_anchor'
}) {
  const owned = new Set(ownedHeroIds);
  const eligible = new Set(eligibleHeroIds);
  const byId = new Map(heroes.filter(hero => hero.playable !== false && owned.has(hero.id) && eligible.has(hero.id)).map(hero => [hero.id, hero]));
  const deployment = evaluateMissionAccess(stage, { heroDb: heroes, activeTeam: currentTeam, ownedHeroIds, eligibleHeroIds, completedArcIds, arcReplayUnlockedIds });
  const rule = deployment.replayFree ? null : deriveRequiredTeam(stage, { heroDb: heroes });
  const requestsAnchor = currentTeam.includes(anchorId) || lockedHeroIds.includes(anchorId);
  let pool = [...byId.values()].filter(hero => !universe || sameUniverse(hero.universe, universe) || (requestsAnchor && hero.id === anchorId));
  const must = new Set(lockedHeroIds.filter(heroId => heroId !== anchorId));
  if (rule?.type === 'character') must.add(rule.heroId);
  if (rule?.type === 'exact') rule.heroIds.forEach(heroId => must.add(heroId));
  if (rule?.type === 'universe') pool = pool.filter(hero => sameUniverse(hero.universe, rule.universe) || (rule.allowAnchor && hero.id === anchorId));
  if (rule?.type === 'exact') pool = pool.filter(hero => rule.heroIds.includes(hero.id));
  const poolIds = new Set(pool.map(hero => hero.id));
  if ([...must].some(heroId => !poolIds.has(heroId)) || must.size > 3) return { valid: false, reason: 'required-hero-unavailable' };
  const size = Math.min(3, pool.length);
  const withAnchor = [...new Set([...must, anchorId])];
  const uncoveredSources = rule?.type === 'sources' ? rule.sourceUniverses.filter(source => !withAnchor.some(heroId => sameUniverse(byId.get(heroId)?.universe, source))).length : 0;
  const universeMinimum = rule?.type === 'universe' ? (rule.minCount || Math.min(3, heroes.filter(hero => hero.id !== anchorId && hero.playable !== false && sameUniverse(hero.universe, rule.universe)).length)) : 0;
  const anchorCompatible = requestsAnchor && poolIds.has(anchorId)
    && uncoveredSources <= size - withAnchor.length
    && (rule?.type !== 'universe' || sameUniverse(rule.universe, byId.get(anchorId)?.universe) || (rule.allowAnchor && universeMinimum < 3));
  if (anchorCompatible && must.size < size) must.add(anchorId);
  // Universe preparation remains an Anchor-led team whenever mission rules
  // permit it: two owned partners are enough, not three plus an invisible slot.
  if (universe) {
    const required = 3 - Number(must.has(anchorId) && !sameUniverse(byId.get(anchorId)?.universe, universe));
    const count = pool.filter(hero => sameUniverse(hero.universe, universe)).length;
    if (count < required) return { valid: false, reason: 'universe-incomplete', count, required, universe };
  }
  if (!pool.length) return { valid: false, reason: 'no-owned-heroes' };
  const fixed = [...must];
  if (fixed.length > size) return { valid: false, reason: 'required-hero-unavailable' };
  const baseRules = new Map(heroes.map(hero => [hero.id, hero]));
  const teamLegal = ids => {
    if (rule?.type === 'universe') {
      const count = ids.filter(heroId => sameUniverse(baseRules.get(heroId)?.universe, rule.universe)).length;
      return universeMinimum > 0 && count >= universeMinimum;
    }
    if (rule?.type === 'sources') return rule.sourceUniverses.length <= 3 && rule.sourceUniverses.every(source => ids.some(heroId => sameUniverse(baseRules.get(heroId)?.universe, source)));
    return true;
  };
  const evaluate = ids => calculateSquadReadiness(ids.map(heroId => preparationById.get(heroId)), preparationContext);
  let choices = pool.filter(hero => !must.has(hero.id));
  if (rule?.type === 'sources') {
    const missing = rule.sourceUniverses.filter(source => !fixed.some(heroId => sameUniverse(baseRules.get(heroId)?.universe, source)));
    if (missing.length === size - fixed.length) choices = choices.filter(hero => missing.some(source => sameUniverse(source, hero.universe)));
  }
  if (mode === 'optimize') {
    // Exact equivalence reduction, not a heuristic top-N: only three members
    // can be picked, so retaining three interchangeable representatives loses
    // no score or legal team. Mission universe identity remains in the key.
    const groups = new Map();
    choices.sort((a, b) => Number(currentTeam.includes(b.id)) - Number(currentTeam.includes(a.id)) || a.id.localeCompare(b.id, 'en'));
    choices = choices.filter(hero => {
      const entry = preparationById.get(hero.id);
      const signature = JSON.stringify([entry.category, entry.level, entry.hasRelic, entry.hasEvent, entry.factionEligible !== false, [...(entry.factionIds || [])].sort(), rule?.type === 'universe' || rule?.type === 'sources' ? universeKey(hero.universe) : null]);
      const count = groups.get(signature) || 0;
      groups.set(signature, count + 1);
      return count < 3;
    });
    choices.sort((a, b) => evaluate([b.id]).score - evaluate([a.id]).score || a.id.localeCompare(b.id, 'en'));
  } else choices = shuffle(choices, random);
  let best = null;
  let checked = 0;
  let finished = false;
  const walk = async (chosen, index) => {
    if (isCancelled()) { finished = true; return; }
    if (finished) return;
    if (chosen.length === size) {
      checked++;
      if (teamLegal(chosen)) {
        const readiness = evaluate(chosen);
        if (!best || readiness.score > best.readiness.score) best = { team: [...chosen], readiness };
        if (mode !== 'optimize' || readiness.score === 100) finished = true;
      }
      if (checked % 5000 === 0) { onProgress(checked); await yieldControl(); }
      return;
    }
    for (let next = index; next <= choices.length - (size - chosen.length) && !finished; next++) await walk([...chosen, choices[next].id], next + 1);
  };
  // Keep a legal existing team as tie preference and as an immediate optimum
  // when already at the proven 100-point upper bound.
  const current = [...new Set(currentTeam)];
  if (mode === 'optimize' && current.length === size && current.every(heroId => poolIds.has(heroId)) && fixed.every(heroId => current.includes(heroId)) && teamLegal(current)) {
    best = { team: current, readiness: evaluate(current) };
    if (best.readiness.score === 100) finished = true;
  }
  await walk(fixed, 0);
  if (isCancelled()) return { valid: false, reason: 'cancelled', checked };
  if (!best) return { valid: false, reason: 'no-legal-team', checked };
  const verification = evaluateMissionAccess(stage, { heroDb: heroes, activeTeam: best.team, ownedHeroIds, eligibleHeroIds, completedArcIds, arcReplayUnlockedIds });
  if (!verification.allowed) return { valid: false, reason: 'no-legal-team', message: verification.message, checked };
  return { valid: true, kind: 'team', mode, ...best, checked, exact: mode === 'optimize', partial: size < 3, anchorPreserved: !currentTeam.includes(anchorId) || best.team.includes(anchorId), universe };
}
