// Roger Rabbit — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee }) {
  return (lock({
    incarnation: 'Who Framed Roger Rabbit (1988) - Roger, Maroon Cartoon Studio toon',
    referenceUrls: [REF.roger],
    equipment: ['Toon Body', 'Red Overalls', 'Blue Polka-Dot Bow Tie'],
    visualAnchor: 'Roger Rabbit in the 1988 film: white cartoon rabbit with tall ears, orange hair tuft, pink nose, red overalls with yellow buttons, blue bow tie with yellow polka dots and yellow gloves. Cartoon elastic anatomy, not a humanoid armored rabbit or laser-wielding substitute. Dip is a lethal threat to toons.',
    weapon: 'toon_body', weaponType: 'toon_body', weaponColor: '#eee9de',
    primaryColor: '#eee9de', secondaryColor: '#d64233',
    canonStatus: '1988 toon identity locked; comic slaps, stretches and tumbles are original game combat adaptations. Dip remains a source vulnerability, not a protective ability.',
    simple: melee('Toon Comic Slap', COMIC_ADAPTATION),
    secondary: melee('Elastic Toon Feint', COMIC_ADAPTATION),
    defense: dodge('Squash-and-Stretch Sidestep'),
    special: melee('Toon Comedy Tumble', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Roger est le toon de Maroon Cartoon Studio accuse du meurtre de Marvin Acme dans Who Framed Roger Rabbit de 1988. Eddie Valiant enquete tandis que Judge Doom menace Toontown avec la Trempette. Roger reste un personnage comique elastique et vulnerable a ce solvant ; ses gestes convertis en degats sont une adaptation du jeu, pas des attaques laser du film.',
      en: 'Roger is the Maroon Cartoon Studio toon accused of Marvin Acme s murder in 1988 s Who Framed Roger Rabbit. Eddie Valiant investigates while Judge Doom threatens Toontown with Dip. Roger remains an elastic comic character vulnerable to that solvent; gestures converted into damage are a game adaptation, not laser attacks from the film.'
    }
  }));
}
