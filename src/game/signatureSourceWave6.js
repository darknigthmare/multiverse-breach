// Exact catalog identities, not franchise-wide grants. Secondary gameplay
// references were read on 2026-10-25; no source artwork or 1:1 approval implied.
export const SIGNATURE_WAVE6_REFERENCES = Object.freeze({
  'ff8-no-mercy': 'https://guides.gamercorner.net/ffviii/limit-breaks/no-mercy',
  'ff8-desperado': 'https://guides.gamercorner.net/ffviii/limit-breaks/desperado',
  'ff8-final-heaven': 'https://guides.gamercorner.net/ffviii/limit-breaks/my-final-heaven',
  'ff8-quick-shot': 'https://guides.gamercorner.net/ffviii/limit-breaks/quick-shot',
  'ff7-beta': 'https://guides.gamercorner.net/ffvii/monsters/midgar-zolom',
  'ff7-sweeper': 'https://guides.gamercorner.net/ffvii/monsters/sweeper'
});
const hero = (actorId, legacyName, name, style, range, source, note, extra = {}) => Object.freeze({
  key: actorId, actorId, universe: 'Final Fantasy VIII', legacyName, name, style, range,
  source, note, wave: 6, sourceWork: 'Final Fantasy VIII (1999)',
  evidenceLevel: 'secondary-gameplay-reference', ...extra
});
const enemy = (enemyName, name, style, range, source, note, extra = {}) => Object.freeze({
  key: `Final Fantasy VII::${enemyName}`, enemyName, universe: 'Final Fantasy VII',
  legacyName: null, name, style, range, source, note, wave: 6,
  sourceWork: 'Final Fantasy VII (1997)', evidenceLevel: 'secondary-gameplay-reference', ...extra
});
export const SIGNATURE_WAVE6_ROWS = Object.freeze([
  hero('seifer_ff8', 'Seifer Almasy Origin Burst', 'No Mercy', 'slash', 330, 'ff8-no-mercy',
    'Fire Cross attack family; one group contact. Ranged energy presentation, not an added fire status or elemental bypass. Range, meter and timings are Nexus adaptations; no gunblade trigger or new transformation.',
    { shape: 'group', delivery: 'ranged' }),
  hero('laguna_ff8', 'Laguna Loire Origin Burst', 'Desperado', 'barrage', 380, 'ff8-desperado',
    'Group damage follows the referenced Limit Break. One damage contact, not a claim of one animated bullet. Grenade, hanging traversal and exact machine-gun choreography are not implemented.',
    { shape: 'group' }),
  hero('zell_ff8', 'My Final Heaven', 'My Final Heaven', 'radial', 120, 'ff8-final-heaven',
    'Duel finisher adapted as a short-range group impact, following the cited target description. No world traversal, teleportation, Duel input chain, Combat King acquisition or exact choreography. This is a gameplay adaptation, not a certified source-targeting reproduction.',
    { shape: 'group', delivery: 'melee' }),
  hero('irvine_ff8', 'Fast Ammo Barrage', 'Quick Shot', 'barrage', 370, 'ff8-quick-shot',
    'Fast Ammo shot family: six scheduled contacts on one confirmed enemy. Six is a bounded Nexus burst, not the source time/ammunition-dependent shot count. No inventory ammunition, Armor Shot defense bypass or replacement target is granted.',
    { hits: 6, shape: 'single' }),
  enemy('Midgar Zolom', 'Beta', 'fire', 400, 'ff7-beta',
    'Original FFVII Beta attack family against the confirmed enemy group. No Enemy Skill learning, forced ejection, remake Midgardsormr identity, MP economy, fire weakness bypass or burn status.',
    { shape: 'group' }),
  enemy('Sweeper Machine', 'W Machine Gun', 'barrage', 330, 'ff7-sweeper',
    'Original FFVII Sweeper W Machine Gun: one confirmed enemy and one damage contact. No Smoke Shot blindness, remake stagger system or automatic highest-HP retargeting.')
]);
