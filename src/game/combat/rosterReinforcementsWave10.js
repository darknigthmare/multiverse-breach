// Selected source versions and real partners for this forty-character batch.
// A partner never calls itself. The alternate is a real roster actor, whose
// existing native character art remains available without claiming a new16 atlas.
const groups = [
  ['The Matrix', ['neo', 'trinity', 'morpheus', 'agent_smith', 'seraph'], 'trinity', 'special', 'morpheus', 'special'],
  ['Stargate', ['oneill', 'tealc', 'sam_carter', 'daniel_jackson', 'hammond_sgc'], 'tealc', 'special', 'oneill', 'special'],
  ['Half-Life', ['freeman', 'barney', 'alyx_vance', 'eli_vance', 'kleiner'], 'alyx_vance', 'simple', 'barney', 'special'],
  ['Fallout', ['paladin', 'nick_v', 'dogmeat', 'piper_wright', 'preston_garvey'], 'nick_v', 'simple', 'preston_garvey', 'special'],
  ['Aliens', ['hicks_aliens', 'vasquez_aliens', 'bishop_aliens', 'ripley_aliens', 'hudson_aliens'], 'hicks_aliens', 'special', 'vasquez_aliens', 'special'],
  ['Payday', ['dallas', 'wolf_pd', 'hoxton', 'chains_pd', 'clover_pd'], 'chains_pd', 'special', 'dallas', 'special'],
  ['Ghostbusters', ['venkman_gb', 'stantz_gb', 'zeddemore_gb', 'spengler_gb', 'janine_gb'], 'spengler_gb', 'special', 'stantz_gb', 'special'],
  ['Left 4 Dead', ['bill_l4d', 'ellis_l4d', 'coach_l4d', 'rochelle_l4d', 'nick_l4d'], 'coach_l4d', 'special', 'bill_l4d', 'special']
];
export const ROSTER_REINFORCEMENTS_WAVE10 = Object.freeze(Object.fromEntries(groups.flatMap(
  ([universe, callers, primary, slot, alternate, alternateSlot]) => callers.map(caller => [caller, Object.freeze({
    universe, performerHeroId: caller === primary ? alternate : primary,
    slot: caller === primary ? alternateSlot : slot,
    source1to1Verified: false
  })])
)));
