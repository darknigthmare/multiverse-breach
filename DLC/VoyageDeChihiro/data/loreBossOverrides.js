// Voyage de Chihiro — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Yubaba',
      weapon: 'witchcraft_and_hairpins',
      special: 'Bathhouse Contract Magic',
      phases: ['Uses paper birds, binding magic and command gestures', 'Transforms into her documented bird form for aerial passes'],
      lore: {
        fr: 'Yubaba dirige les bains et lie ses employes par contrat.',
        en: 'Yubaba runs the bathhouse and binds her workers through contracts.'
      },
      referenceUrl: 'https://www.ghibli.jp/works/chihiro/',
      visualAnchor: 'Exact Studio Ghibli Yubaba design, enormous head, ornate dark dress, jeweled hair and documented bird transformation.'
    },
    {
      name: 'Kashira Trio',
      weapon: 'headbutts_and_rolls',
      special: 'Three-Head Stack',
      phases: ['The three heads hop and roll as one inseparable unit', 'They stack, split and converge for a synchronized headbutt'],
      lore: {
        fr: 'Les trois Kashira sont representes ensemble sans leur inventer de corps.',
        en: 'The three Kashira are represented together without invented bodies.'
      },
      referenceUrl: 'https://www.ghibli.jp/works/chihiro/',
      visualAnchor: 'Exactly three identical green bearded Kashira heads from Spirited Away, all visible in every frame, with no bodies.'
    }
  ]);
}
