// Vocaloid — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('len', 'Kagamine Len', 'tactical', '#f7d13d', 'microphone', 'Mirror Voice Note', 'Road Roller Cue', 'Twin Sync Guard', 'Kagamine Resonance'),
    hero('meiko', 'MEIKO', 'slayer', '#c0392b', 'microphone', 'Red Stage Strike', 'Sake Bottle Swing', 'Veteran Vocal Guard', 'Crimson Chorus'),
    hero('kaito', 'KAITO', 'hacker', '#3498db', 'microphone', 'Blue Voice Pulse', 'Ice Cream Loop', 'Cool Tone Barrier', 'Classic Voicebank Wave')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('microphone', 'Meltdown Note', 'Electric Angel Twin Sync', 'Mirror Voice Guard', 'Road Roller Resonance', '#f1c40f'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('microphone', 'Luka Luka Night Note', 'Tuna Swing Beat', 'Bilingual Harmony Guard', 'Megurine Ocean Chorus', '#ff7675'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Pitch Desync Sprite', 60, 10, 8, '#39c5bb', 'sound'),
      monster('Broken Voicebank Echo', 85, 12, 6, '#f1c40f', 'wave'),
      monster('Hologram Stage Rig', 100, 13, 4, '#e0007a', 'spotlight')
    ],
    bosses: [
      boss('Corrupted Diva Persona', 500, 18, 8, '#39c5bb', 'chorus', 'World Is Mine Glitch'),
      boss('Silence Compressor', 540, 20, 5, '#101010', 'white_noise', 'Mute The Stage')
    ]
  });
}
