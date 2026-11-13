// Noob — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Tabris',
      weapon: 'canonical_avatar_loadout',
      special: 'Guild Corruption Burst',
      phases: ['Uses the exact class abilities and equipment from the selected Noob season', 'Triggers the documented corrupted-avatar state without changing franchise'],
      lore: {
        fr: 'Tabris remplace le maitre de guilde corrompu generique.',
        en: 'Tabris replaces the generic corrupted guild master.'
      },
      referenceUrl: 'https://noob-tv.com/videos.php?id=1&sid=6',
      visualAnchor: 'Exact Tabris avatar appearance, armor, face, weapon and palette from the selected Noob episode; no generic MMO armor.'
    },
    {
      name: 'Spectre',
      weapon: 'canonical_class_weapon',
      special: 'Spectre Burst Rotation',
      phases: ['Uses the exact class rotation and defensive cooldowns shown in Noob', 'Attempts one documented high-damage burst after resetting position'],
      lore: {
        fr: 'Spectre remplace le faux boss d instance sans identite.',
        en: 'Spectre replaces the unidentified generic instance boss.'
      },
      referenceUrl: 'https://noob.fandom.com/fr/wiki/Spectre',
      visualAnchor: 'Exact Spectre avatar clothing, armor, class weapon and colors from the French series, with live-action-to-pixel fidelity.'
    }
  ]);
}
