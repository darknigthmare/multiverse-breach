// How to Make a Monster — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'How to Make a Monster',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Clayton Software Evilution Lab',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Evilution Monster Suit',
    title: { en: 'How to Make a Monster', fr: 'How to Make a Monster' },
    desc: {
      en: 'Sol, Bug, and Hardcore are hired to rebuild the Evilution game, but their AI, sound, and combat systems awaken inside a motion-capture monster suit. In Multiverse Breach, the suit compiles traits stolen from playable heroes and tries to become the perfect adaptive boss.',
      fr: 'Sol, Bug et Hardcore sont engages pour reconstruire le jeu Evilution, mais leurs systemes d IA, de son et de combat s eveillent dans une combinaison de capture de mouvement. Dans Multiverse Breach, la tenue compile des traits voles aux heros jouables pour devenir le boss adaptatif parfait.'
    },
    hero: { id: 'sol_howmonster', name: 'Sol', cat: 'hacker', color: '#4ec9b0' },
    allies: [{ id: 'bug_howmonster', name: 'Bug', cat: 'tactical', color: '#9aa0a6' }, { id: 'hardcore_howmonster', name: 'Hardcore', cat: 'slayer', color: '#d7ba7d' }],
    monsters: ['Evilution Digital Spawn', 'Motion-Capture Armor', 'Digitized Victim Echo'],
    bosses: ['Adaptive Combat Module', 'Evilution Monster Suit'],
    worldBoss: 'Evilution Monster Suit',
    gear: [['htmam_ai_disc', 'Sol AI Disc', 'Disque IA de Sol', { atk: 8, spd: 1 }], ['htmam_sound_board', 'Bug Sound Board', 'Console sonore de Bug', { spd: 2, def: 3 }], ['htmam_weapon_rig', 'Hardcore Weapon Rig', 'Harnais d armes de Hardcore', { hp: 70, atk: 4 }]],
    event: ['evt_htmam_decompile', 'Evilution Decompile', 'Decompilation d Evilution', 'Sol isolates the learning code, Bug overloads its senses, and Hardcore destroys the exposed combat frame.', 'Sol isole le code d apprentissage, Bug sature ses sens et Hardcore detruit la structure de combat exposee.'],
    decor: { sky: ['#101826', '#020305'], floor: 'rgba(78, 201, 176, 0.16)', grid: 'rgba(215, 186, 125, 0.26)', motif: 'code', accent: '#4ec9b0' }
  });
}
