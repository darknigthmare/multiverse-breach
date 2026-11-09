// SCP Foundation — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialRoutes() {
  return (['SCP Foundation', 'switches', ['scp_foundation_scp_049', 'scp_foundation_scp_939', 'scp_foundation_scp_008', 'scp_foundation_scp_096', 'scp_foundation_scp_106', 'scp_foundation_scp_079', 'scp_foundation_scp_682']]);
}

export function createExpandedUniverseRecord() {
  return ({ key: 'scp', universe: 'SCP Foundation', mediaType: 'series', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'SCP', stage: 'Site-19 Containment Breach', boss: 'Keter Class Cascade', hero: ['mtf_commander_scp', 'MTF Commander', 'tactical'], allies: [['researcher_scp', 'Foundation Researcher', 'hacker'], ['scp_999_echo', 'SCP-999 Echo', 'horror']], theme: 'containment protocols, anomalous entities, site lockdowns, and Keter escalation procedures', motif: 'facility', colors: ['#151515', '#020202', '#e5e5e5'] });
}
