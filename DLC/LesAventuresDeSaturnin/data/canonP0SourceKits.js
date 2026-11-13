// Les Aventures de Saturnin — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee }) {
  return (lock({
    incarnation: 'Les Aventures de Saturnin (ORTF, 1965-1970) - real duckling in a miniature animal village',
    referenceUrls: [REF.saturnin],
    equipment: ['Yellow Duckling Anatomy', 'Miniature Animal Village Props'],
    visualAnchor: 'Saturnin is Jean Tourane s real yellow duckling in live-action miniature village sets: yellow down, orange bill and webbed feet, natural duck anatomy. No human arms, firearm, laser or human-sized uniform. Props and companions must match the selected episode.',
    weapon: 'body', weaponType: 'body', weaponColor: '#ffd83d',
    primaryColor: '#ffd83d', secondaryColor: '#e8942b',
    canonStatus: 'Real duckling source identity locked; bumps, distraction and escape are original comic game adaptations, not armed source combat.',
    simple: melee('Duckling Bump', COMIC_ADAPTATION),
    secondary: melee('Miniature Village Scramble', COMIC_ADAPTATION),
    defense: dodge('Duckling Sidestep'),
    special: melee('Village Escape Tumble', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Saturnin est le caneton reel de Jean Tourane, dans les decors miniatures des Aventures de Saturnin diffuses par l ORTF. Son caractere et ses aventures de village ne lui donnent ni fusil ni pouvoirs. Ses contacts, detours et evasions jouables sont une adaptation comique originale du projet ; son escorte est une mission de secours distincte.',
      en: 'Saturnin is Jean Tourane s real duckling in the miniature sets of Les Aventures de Saturnin, broadcast by ORTF. His personality and village adventures do not give him a gun or supernatural powers. Playable bumps, detours and escapes are an original comic game adaptation; his escort is a separate rescue mission.'
    }
  }));
}
