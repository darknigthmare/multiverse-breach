// Finding Frankie — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'finding_frankie', universe: 'Finding Frankie', aliases: [], allNonCombat: true,
    continuity: 'Finding Frankie (2024) parkour-horror game',
    adaptationRule: 'Every encounter is a chase, timing gate or parkour Trial. No mascot or contestant is attacked, and blades/crushers are shown as readable course hazards without injury.',
    visualAnchor: 'Bright but abandoned mascot game-show arenas, padded parkour blocks, blue-red signage shapes without readable logos, analog security lights.',
    referenceUrl: 'https://store.steampowered.com/app/2597970/Finding_Frankie/', colors: ['#315f86', '#0a1018', '#f05b59'], motif: 'parkour', mode: 'Trial', difficulty: 'Hard',
    heroes: [
      { id: 'lucky_contestant', name: 'Lucky Contestant', visualAnchor: 'Anonymous adult contestant in blue athletic jumpsuit, knee pads, gloves and blank face visor.' },
      { id: 'deputy_duck', name: 'Deputy Duck', visualAnchor: 'Friendly yellow duck mascot with small blue deputy hat, rounded beak and padded cartoon proportions.' },
      { id: 'noob_noob', name: 'Noob Noob', visualAnchor: 'Small friendly game-show mascot with blue body, simple round eyes and padded gloves.' }
    ],
    enemies: ['Saw Track', 'Crushing Wall', 'Security Obstacle'],
    bosses: [
      { id: 'henry_hotline_chase', name: 'Henry Hotline Chase', visualAnchor: 'Red telephone mascot silhouette pursuing across elevated foam platforms; route states, no attack.' },
      { id: 'frankie_chase', name: 'Frankie Chase', visualAnchor: 'Large blue rabbit mascot silhouette advancing through a neon parkour corridor; escape states only.' },
      { id: 'final_parkour_protocol', name: 'Final Parkour Protocol', visualAnchor: 'Four-stage timed obstacle assembly of conveyors, vault blocks and closing gates.' }
    ],
    worldBoss: { id: 'game_show_core', name: 'Frankie’s Game Show Core', visualAnchor: 'Central broadcast machinery and course-control lights progressing from locked to safely shut down.' },
    gear: ['Double-Jump Trainers', 'Wall-Run Gloves', 'Contestant Wristband'],
    stages: ['Frankie’s Parkour Palace', 'Henry Hotline Course', 'Final Broadcast Escape'],
    event: { id: 'showtime', name: 'Showtime Escape', frName: 'Évasion en direct' }
  });
}
