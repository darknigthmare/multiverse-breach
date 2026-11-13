// Jet Set Radio — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Captain Onishima',
      weapon: 'service_pistol_and_police_command',
      special: 'Shibuya Crackdown',
      phases: ['Uses police formations and aimed pistol shots', 'Pursues directly with exaggerated series movement after the formation breaks'],
      lore: {
        fr: 'Onishima dirige la repression policiere contre les GG.',
        en: 'Onishima leads the police crackdown against the GG.'
      },
      referenceUrl: 'https://jetsetradio.fandom.com/wiki/Captain_Onishima',
      visualAnchor: 'Exact stylized police captain design from Jet Set Radio, cap, moustache, uniform, pistol and cel-shaded proportions.'
    },
    {
      name: 'Goji Rokkaku',
      weapon: 'golden_rhino_control',
      special: 'Rokkaku Tower Command',
      phases: ['Uses tower machinery and Golden Rhino guards', 'Appears in his exact final confrontation form after the defenses fail'],
      lore: {
        fr: 'Goji Rokkaku cherche a controler Tokyo-to et le Devil s Contract.',
        en: 'Goji Rokkaku seeks to control Tokyo-to and the Devil s Contract.'
      },
      referenceUrl: 'https://jetsetradio.fandom.com/wiki/Goji_Rokkaku',
      visualAnchor: 'Exact elderly Goji Rokkaku design from the selected game, formal dark suit, white hair and cel-shaded face.'
    }
  ]);
}
