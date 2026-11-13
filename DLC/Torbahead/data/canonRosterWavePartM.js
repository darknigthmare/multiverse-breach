// Torbahead — definitions consumed by src/game/canonRosterWavePartM.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r }) {
  return (r('torbahead', 'Torbahead', 'https://linktr.ee/torbahead',
    ['Torbahead Reel Persona', 'Daily Greeting Caption', 'Community Remix Curator'], ['Missed Beat Marker', 'Caption Timing Drift', 'Loop Transition Error'], ['Wednesday Reel Sequence', 'Pa-Parla Americano Sync', 'Good Day Loop'],
    { id: 'reel_marathon', name: 'Torbahead Reel Marathon', nonCombat: true, objective: 'Synchronize greetings, audio cues and loop transitions without identifying or depicting the account owner.', visualAnchor: 'Abstract vertical-video frames, waveform bars and greeting cards; no face, body or private information.' },
    ['Greeting Card', 'Audio Sync Meter', 'Loop Marker'], ['Daily Greeting Reel', 'Music Sync Timeline', 'Community Loop Showcase'],
    { aliases: ['Torbahead Instagram'], continuity: 'Public Torbahead social-media persona and published reel format only', allNonCombat: true, mediaType: 'social-media', faction: 'absurd', difficulty: 'Normal', rule: 'Use only the public persona, recurring greeting, audio timing, captions and reel accessories. Do not research, infer or depict identity, face, body, location, private life or personal data.', anchor: 'Abstract vertical reels, simple greeting cards, music waveforms and loop controls; no supposed likeness.' }));
}
