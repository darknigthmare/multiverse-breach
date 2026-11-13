// Evil Dead — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'evil_dead',
      universe: 'Evil Dead',
      mediaType: 'movie',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Evil Dead - Trilogie',
      stage: 'Knowby Cabin Deadite Night',
      boss: 'Necronomicon Kandarian Demon',
      hero: ['ash_williams', 'Ash Williams', 'slayer'],
      allies: [['annie_knowby', 'Annie Knowby', 'hacker'], ['henry_red_ed', 'Henry the Red', 'marine']],
      monsters: ['Cabin Deadite', 'Demonic Tree', 'Skeleton Army'],
      bosses: ['Evil Ash', 'Kandarian Demon'],
      gear: [['evil_dead_boomstick', 'Ash s Boomstick', 'Boomstick d Ash', { atk: 10 }], ['evil_dead_chainsaw', 'Chainsaw Hand', 'Main tronconneuse', { atk: 9, def: 3 }], ['evil_dead_necronomicon', 'Necronomicon Ex-Mortis', 'Necronomicon Ex-Mortis', { hp: 65, atk: 5 }]],
      event: ['evt_evil_dead_army', 'Army of Darkness Charge', 'Charge de l Armee des tenebres', 'Ash leads the medieval line through the Deadites while the boomstick tears open the boss guard.', 'Ash mene la ligne medievale a travers les Deadites pendant que le boomstick brise la garde du boss.'],
      theme: 'the original cabin possession, Ash s chainsaw transformation, the Necronomicon, and the medieval Army of Darkness conflict',
      motif: 'hauntedset',
      colors: ['#1f0d0d', '#030101', '#ff3f2f']
    });
}
