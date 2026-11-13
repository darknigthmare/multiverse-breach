// Exit 8 — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Exit 8', 'evidence', ['Wrong Poster Copy', 'Blinking Light Fault', 'Passing Man Echo', 'Impossible Signage']]);
}

export function createLegacyNonCombatTrialNameRoutes2() {
  return (['Exit 8', 'escape', ['Flooded Corridor']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Exit 8',
    mediaType: 'game',
    faction: 'horror',
    stageName: 'Endless Passage Anomaly',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Exit 8 Anomaly Loop',
    title: { en: 'Exit 8', fr: 'Exit 8' },
    desc: { en: 'A sterile underground corridor repeats until the smallest anomaly becomes a lethal rule.', fr: 'Un couloir souterrain sterile se repete jusqu a ce que la moindre anomalie devienne une regle mortelle.' },
    hero: { id: 'commuter_exit8', name: 'Lost Commuter', cat: 'tactical', color: '#d6d6c8' },
    allies: [{ id: 'sign_watcher_exit8', name: 'Sign Watcher', cat: 'hacker', color: '#f1c40f' }, { id: 'corridor_runner_exit8', name: 'Corridor Runner', cat: 'horror', color: '#9aa0a6' }],
    monsters: ['Wrong Poster Copy', 'Blinking Light Fault', 'Passing Man Echo'],
    bosses: ['Flooded Corridor', 'Impossible Signage'],
    worldBoss: 'Exit 8 Anomaly Loop',
    gear: [['exit8_sign', 'Exit Sign Shard', 'Eclat panneau sortie', { spd: 2, def: 4 }], ['exit8_tile', 'White Tile Sample', 'Carreau blanc', { def: 6, hp: 45 }], ['exit8_map', 'Loop Route Note', 'Note de boucle', { atk: 5, spd: 1 }]],
    event: ['evt_exit8_anomaly_check', 'Anomaly Check', 'Verification anomalie', 'The squad detects the wrong frame and resets enemy buffs.', 'L escouade detecte la mauvaise frame et reinitialise les buffs ennemis.'],
    decor: { sky: ['#202426', '#080909'], floor: 'rgba(220, 220, 210, 0.12)', grid: 'rgba(250, 230, 120, 0.24)', motif: 'facility', accent: '#fae678' }
  });
}
