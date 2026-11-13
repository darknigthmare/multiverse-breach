// The Batman Who Laughs — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ REF, guard, lock, ranged }) {
  return (lock({
    incarnation: 'The Batman Who Laughs: The Grim Knight #1 (2019) - armed Dark Multiverse Bruce Wayne',
    referenceUrls: [REF.grim],
    equipment: ['Firearms Arsenal', 'Tactical Bat Armor'],
    visualAnchor: 'The Grim Knight is the firearm-using Dark Multiverse Bruce Wayne: dark tactical bat armor, cowl and cape, multiple weapon mounts and ammunition. Exact 2019 issue panels must determine weapon models and armor details before visual approval. Not Nolan Batman, ordinary New 52 Batman, or Batman Who Laughs with a spiked visor.',
    weapon: 'gun', weaponType: 'gun', weaponColor: '#353a3d',
    primaryColor: '#383d42', secondaryColor: '#666e73',
    simple: ranged('Grim Knight Firearm Burst', 'bullet', '#dfb879'),
    secondary: ranged('Tactical Covering Fire', 'projectile', '#dfb879'),
    defense: guard('Tactical Armor Guard'),
    special: ranged('Grim Knight Arsenal Volley', 'bullet', '#dfb879'),
    loreLocalized: {
      fr: 'Le Grim Knight est une version du Multivers Noir de Bruce Wayne qui utilise des armes a feu et impose a Gotham un regime militaire. Contrairement aux deux Batman ordinaires du roster, son arsenal est un trait de la source. Ce kit vise son one-shot de 2019 ; les modeles d armes, l armure et la choregraphie exigent encore une revue des pages originales.',
      en: 'The Grim Knight is a Dark Multiverse version of Bruce Wayne who uses firearms and imposes military rule on Gotham. Unlike the roster s two ordinary Batmen, his arsenal is a source trait. This kit targets his 2019 one-shot; weapon models, armor and choreography still require review of the original pages.'
    }
  }));
}
