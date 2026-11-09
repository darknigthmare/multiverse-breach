// System of a Down — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'System of a Down',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Toxicity Protest Stage',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Toxicity Riot Core',
    title: { en: 'System of a Down', fr: 'System of a Down' },
    desc: {
      en: 'A politically charged alternative-metal Thread where Armenian-American memory, anti-war protest, absurdist satire, sudden tempo breaks, vocal contrasts, and heavy syncopated riffs collide into unstable resonance traps.',
      fr: 'Une Trame alternative-metal chargee politiquement ou memoire armenienne-americaine, protestation anti-guerre, satire absurde, ruptures de tempo, contrastes vocaux et riffs syncopes lourds entrent en collision dans des pieges de resonance instables.'
    },
    hero: { id: 'serj_tankian', name: 'Serj Tankian', cat: 'hacker', color: '#b03a2e' },
    allies: [
      { id: 'daron_malakian', name: 'Daron Malakian', cat: 'slayer', color: '#1c2833' },
      { id: 'shavo_odadjian', name: 'Shavo Odadjian', cat: 'tactical', color: '#7d6608' }
    ],
    monsters: ['Toxicity Feedback Wave', 'Prison Song Riot Line', 'Chop Suey Tempo Break', 'Propaganda Screen Warden', 'War Broadcast Echo'],
    bosses: ['B.Y.O.B. War Machine', 'Aerials Signal Tower'],
    worldBoss: 'Toxicity Riot Core',
    gear: [
      ['soad_tempo_pick', 'Tempo Break Pick', 'Mediator rupture tempo', { spd: 2, atk: 7 }],
      ['soad_protest_banner', 'Anti-War Protest Banner', 'Banniere anti-guerre', { def: 5, hp: 60 }],
      ['soad_feedback_amp', 'Toxicity Feedback Amp', 'Ampli feedback Toxicity', { atk: 9 }]
    ],
    event: ['evt_soad_breakdown', 'Toxicity Tempo Breakdown', 'Cassure de tempo Toxicity', 'A sudden rhythm break desyncs hostile broadcasts, freezes the frontline, then lands a heavy protest-riff impact.', 'Une rupture de tempo desynchronise les diffusions hostiles, fige la premiere ligne puis frappe avec un impact de riff protestataire.'],
    decor: { sky: ['#251b18', '#060403'], floor: 'rgba(139, 71, 45, 0.18)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'concert', accent: '#f1c40f' }
  });
}
