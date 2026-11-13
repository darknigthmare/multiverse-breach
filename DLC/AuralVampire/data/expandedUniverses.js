// Aural Vampire — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'aural_vampire',
      universe: 'Aural Vampire',
      mediaType: 'music',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Aural Vampire',
      stage: 'Vampire Ecstasy Darkwave Club',
      boss: 'Zombie Naocchatte Procession',
      hero: ['exo_chika_av', 'EXO-CHIKA', 'horror'],
      allies: [['raveman_av', 'RAVEMAN', 'hacker'], ['wu_chy_av', 'Wu-CHY', 'marine'], ['higuchuuhei_av', 'Higuchuuhei', 'slayer'], ['zen_av', 'ZEN', 'hacker'], ['izu_av', 'IZU', 'marine']],
      monsters: ['Vampire Ecstasy Mannequin', 'Razors on Backstreet Butcher', 'Darkwave Bloodline Dancer'],
      bosses: ['Freeeze Masquerade', 'Zoltank Stage Vampire'],
      gear: [['exo_chika_microphone', 'EXO-CHIKA Vampire Microphone', 'Micro vampirique d EXO-CHIKA', { atk: 9, spd: 1 }], ['raveman_led_mask', 'RAVEMAN LED Mask', 'Masque LED de RAVEMAN', { def: 7, spd: 2 }], ['aural_synth_module', 'Aural Vampire Synth Module', 'Module synthe Aural Vampire', { atk: 8, hp: 50 }]],
      event: ['evt_aural_vampire_freeze', 'Freeeze Darkwave Drop', 'Drop darkwave Freeeze', 'EXO-CHIKA locks the crowd on the beat while RAVEMAN and the live band detonate the industrial sequence.', 'EXO-CHIKA fige la foule sur le rythme pendant que RAVEMAN et le groupe live declenchent la sequence industrielle.'],
      theme: 'EXO-CHIKA vocals, RAVEMAN masked electronics, Wu-CHY bass, Higuchuuhei guitar, ZEN keyboards, IZU drums, and Japanese darkwave horror theatre',
      motif: 'hauntedset',
      colors: ['#220d18', '#040102', '#ff3d8f']
    });
}
