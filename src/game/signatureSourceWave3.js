// Explicit identities, not a franchise-wide grant. See each adaptation note.
export const SIGNATURE_WAVE3_REFERENCES = Object.freeze({
  'tf-stock-medigun': 'https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/shared/tf/tf_weapon_medigun.cpp',
  'hl2-dog': 'https://github.com/ValveSoftware/source-sdk-2013/blob/master/src/game/server/hl2/npc_dog.cpp',
  'q2-makron': 'https://github.com/id-Software/Quake-2/blob/master/game/m_boss32.c',
  'doom-pinky': 'https://github.com/id-Software/DOOM/blob/master/linuxdoom-1.10/p_enemy.c',
  'hexen-centaur': 'https://github.com/chocolate-doom/chocolate-doom/blob/master/src/hexen/p_enemy.c',
  'aliens-film-equipment': 'https://super7.com/blogs/news/super7-x-aliens-reaction-figures'
});
const hero = (universe, actorId, legacyName, name, style, range, source, extra = {}) => Object.freeze({
  key: actorId, universe, actorId, legacyName, name, style, range, source, wave: 3, ...extra
});
const enemy = (universe, enemyName, legacyName, name, style, range, source, extra = {}) => Object.freeze({
  key: `${universe}::${enemyName}`, universe, enemyName, legacyName, name, style, range, source, wave: 3, ...extra
});
export const SIGNATURE_WAVE3_ROWS = Object.freeze([
  hero('Team Fortress 2', 'team_fortress_2_medic', 'ÜberCharge', 'ÜberCharge — Stock Medi Gun', 'healing', 320, 'tf-stock-medigun', {
    effect: 'guard', kind: 'support', protection: 'stock-uber', durationTicks: 480, shape: 'single', directional: false,
    note: 'Stock Medi Gun: caster and at most one patient, eight gameplay seconds of protection against dispatched combat hits. No group damage, resurrection, critical boost, overheal, patient flashing, flag rules or immunity to world/direct status damage. Existing special-meter economy is an adaptation.'
  }),
  hero('Half-Life', 'dog_hl2', 'Dog Origin Burst', 'Dog — Mechanical Strike', 'slash', 95, 'hl2-dog', {
    note: 'Mechanical close-range strike, not a rifle, energy blast or summoned robot army. Object-grabbing, throwing and scripted Strider wrestling remain separate work.',
    basicCorrection: { legacyName: 'Dog Signature Strike', name: 'Dog Mechanical Strike', type: 'melee', delivery: 'melee', range: 80, weaponType: 'fists' }
  }),
  hero('Aliens', 'hicks_aliens', 'Corporal Hicks Origin Burst', 'Hicks — Close Encounter Shotgun', 'barrage', 150, 'aliens-film-equipment', {
    note: 'Personal shotgun from the Aliens film loadout. One effective blast, not an orbital strike. Pellet spread and ammunition remain adapted.'
  }),
  hero('Aliens', 'hudson_aliens', 'Hudson Origin Burst', 'Hudson — Pulse Rifle Burst', 'barrage', 330, 'aliens-film-equipment', {
    hits: 4, note: 'Personal pulse-rifle fire; four contacts are a Nexus budget, not a film firing-rate measurement. Motion-tracker hacking and sentries are not supplied by this action.'
  }),
  hero('Aliens', 'vasquez_aliens', 'Vasquez Origin Burst', 'Vasquez — Smartgun Sweep', 'barrage', 330, 'aliens-film-equipment', {
    hits: 6, shape: 'multi', distribution: 'cycle', note: 'Smartgun-loadout adaptation, not the later BDU/pulse-rifle incarnation. Six shared-budget contacts; no invented automatic target detection through walls.'
  }),
  enemy('Quake', 'Makron — Quake II', 'Jorg exoskeleton assault', 'Makron — Hyperblaster Sweep', 'barrage', 390, 'q2-makron', {
    enemyId: 'quake_franchise_makron_q2', requiredContinuity: 'Quake II (1997)', hits: 5, shape: 'multi', distribution: 'cycle',
    note: 'MakronHyperblaster attack family. Five contacts are condensed, not the original frame table. No Jorg spawn, phase transition, BFG scanning or telefrag bypass is added.'
  }),
  enemy('Doom', 'Leaping Pinky Demon', null, 'Pinky — Bite', 'slash', 75, 'doom-pinky', {
    note: 'Classic demon bite (A_SargAttack). The catalog word Leaping does not grant a projectile, a jump super or Doom Eternal armor. Short-range damage remains a Nexus adaptation.'
  }),
  enemy('Hexen', 'Centaur', 'Missile-reflecting shield', 'Centaur — Sword Strike', 'slash', 80, 'hexen-centaur', {
    enemyId: 'hexen_centaur', note: 'A_CentaurAttack close-range sword attack. This adds an offensive signature only: shield reflection is not re-created, converted to an energy attack or marked complete.'
  })
]);
