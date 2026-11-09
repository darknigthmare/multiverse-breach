// Shaun of the Dead — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'shaun_dead',
      universe: 'Shaun of the Dead',
      mediaType: 'movie',
      faction: 'horror',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Shaun of the Dead',
      stage: 'Winchester Last Pint',
      boss: 'Pub Zombie Siege',
      hero: ['shaun_sotd', 'Shaun', 'slayer'],
      allies: [['ed_sotd', 'Ed', 'hacker'], ['liz_sotd', 'Liz', 'tactical']],
      monsters: ['Garden Zombie', 'London Street Horde', 'Winchester Regular Dead'],
      bosses: ['Philip Zombie', 'Winchester Cellar Horde'],
      gear: [['shaun_cricket_bat', 'Shaun s Cricket Bat', 'Batte de cricket de Shaun', { atk: 9, spd: 1 }], ['shaun_record', 'Disposable Vinyl Record', 'Disque vinyle jetable', { atk: 6, def: 4 }], ['shaun_cornetto', 'Emergency Cornetto', 'Cornetto d urgence', { hp: 75 }]],
      event: ['evt_shaun_dont_stop_me', 'Winchester Jukebox Stand', 'Resistance du jukebox Winchester', 'The squad fights in rhythm around the bar while Shaun clears a route with the cricket bat.', 'L escouade combat en rythme autour du bar pendant que Shaun ouvre une route avec la batte de cricket.'],
      theme: 'British zombie comedy, pub defense, cricket bats, and deadpan survival plans',
      motif: 'hauntedset',
      colors: ['#251111', '#040202', '#d64242']
    });
}
