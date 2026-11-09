// Michael Jackson — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ COMIC_ADAPTATION, REF, dodge, lock, melee }) {
  return (lock({
    incarnation: 'Multiverse Breach original tribute persona - King of Pop Avatar',
    referenceUrls: [REF.project],
    sourceIdentityType: 'project-original-adaptation',
    isOfficialCharacter: false,
    equipment: ['Original Stage Costume', 'Dance Shoes'],
    visualAnchor: 'Keep the project s original fully clothed adult stage avatar distinct from a documentary likeness or any specific Michael Jackson film/game costume. Final visual review is pending. Do not silently label this substitute as Thriller, Moonwalker or historical Michael Jackson.',
    weapon: 'dance', weaponType: 'dance', weaponColor: '#e0c46a',
    canonStatus: 'Original tribute persona from the project, not historical Michael Jackson or an official Moonwalker character. Musical combat is an original game adaptation.',
    simple: melee('Original Dance-Step Contact', COMIC_ADAPTATION),
    secondary: melee('Original Stage-Step Feint', COMIC_ADAPTATION),
    defense: dodge('Original Performer Sidestep'),
    special: melee('Original Dance-Floor Finale', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'King of Pop Avatar est un personnage original d hommage du projet Multiverse Breach. Il n est pas une representation validee de Michael Jackson, du court metrage Thriller ni d une incarnation Moonwalker. Son costume et sa danse forment sa propre adaptation jouable ; une version source 1:1 exigerait une incarnation distincte, des references correspondantes et une revue visuelle.',
      en: 'King of Pop Avatar is an original tribute character created for Multiverse Breach. It is not an approved representation of Michael Jackson, the Thriller short film or a Moonwalker incarnation. Costume and dance define its own playable adaptation; a source-faithful version would require a distinct incarnation, matching references and visual review.'
    }
  }));
}

export function createCanonP0SourceKits2({ COMIC_ADAPTATION, REF, dodge, lock, melee, ranged }) {
  return (lock({
    incarnation: 'Multiverse Breach original companion - Rhythm Guard',
    referenceUrls: [REF.project],
    sourceIdentityType: 'project-original-adaptation',
    isOfficialCharacter: false,
    equipment: ['Original Stage Costume', 'Microphone'],
    visualAnchor: 'The project s original fully clothed adult Rhythm Guard companion, with stage clothing and microphone. Not a claimed historical Michael Jackson associate or official Moonwalker cast member. No firearm derived only from the tactical class; existing substitute artwork remains pending review.',
    weapon: 'microphone', weaponType: 'microphone', weaponColor: '#b4b3b7',
    canonStatus: 'Original project companion, not a character confirmed by an external musical source. Musical gestures converted to damage are an original game adaptation.',
    simple: melee('Microphone Contact', COMIC_ADAPTATION),
    secondary: ranged('Original Rhythm Cue', 'sound', '#e0c46a', COMIC_ADAPTATION),
    defense: dodge('Stage-Position Sidestep'),
    special: ranged('Original Rhythm Finale', 'sound', '#e0c46a', COMIC_ADAPTATION),
    loreLocalized: {
      fr: 'Rhythm Guard est un compagnon original du projet et ne correspond pas a une personne officielle identifiee dans une oeuvre de Michael Jackson. Son microphone et ses indications de rythme remplacent le fusil generique de classe. La conversion de ces gestes en degats est une adaptation musicale originale, pas un pouvoir historique ou canonique.',
      en: 'Rhythm Guard is an original project companion and does not correspond to an identified official person in a Michael Jackson work. A microphone and rhythm cues replace the generic class gun. Converting these gestures into damage is an original musical adaptation, not a historical or canonical power.'
    }
  }));
}
