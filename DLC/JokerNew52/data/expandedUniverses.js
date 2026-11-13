// Joker New 52 — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Joker New 52',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Gotham Endgame Funhouse',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Endgame Joker',
    title: { en: 'Joker New 52', fr: 'Joker New 52' },
    desc: {
      en: 'A cruel Gotham nightmare shaped by the New 52 era: surgical horror, toxin traps, and smiling chaos.',
      fr: 'Un cauchemar de Gotham version New 52 : horreur chirurgicale, toxines et chaos souriant.'
    },
    hero: { id: 'joker_n52', name: 'Joker New 52', cat: 'horror', color: '#7d3c98' },
    allies: [
      { id: 'harley_n52', name: 'Harley Quinn New 52', cat: 'slayer', color: '#e74c3c' },
      { id: 'batman_n52', name: 'Batman New 52', cat: 'tactical', color: '#1b2631' }
    ],
    monsters: ['Jokerized Thug', 'Laughing Gas Drone', 'Carnival Knife Guard'],
    bosses: ['Dollmaker Surgeon', 'Endgame Toxin Host'],
    worldBoss: 'Endgame Joker',
    gear: [
      ['joker_face_mask', 'Joker Reattached Face - Death of the Family', 'Visage rattaché du Joker - Death of the Family', { atk: 10, def: 3 }, {
        canonicalItemId: 'joker_reattached_face_death_of_the_family',
        canonicalName: 'Joker reattached face (Death of the Family)',
        incarnation: 'Batman: Death of the Family (The New 52, Batman #13-17, 2012-2013)',
        sourceOwner: 'The Joker',
        referenceUrl: 'https://en.wikipedia.org/wiki/Batman:_Death_of_the_Family',
        referenceUrls: ['https://www.dc.com/graphic-novels/batman-2011/batman-vol-3-death-of-the-family', 'https://en.wikipedia.org/wiki/Batman:_Death_of_the_Family'],
        defaultKitPolicy: 'not-part-of-endgame-joker',
        gameplayPolicy: { runtimeEffect: 'stat-boost-only', crossArcEquipment: 'Multiverse Breach adaptation' },
        canonStatus: 'Death of the Family accessory; optional cross-arc relic, not part of the Endgame Joker default kit.',
        visualReviewStatus: 'pending',
        desc: {
          fr: 'Le visage détaché puis rattaché du Joker appartient à Death of the Family, Batman #13-17 des New 52. Il ne constitue pas le visage ni l’équipement par défaut du Joker d’Endgame. Cet objet historique reste une relique optionnelle entre arcs ; ses bonus sont une adaptation de Multiverse Breach.',
          en: 'The Joker’s detached and reattached face belongs to New 52 Death of the Family, Batman #13-17. It is not the face or default equipment of the Endgame Joker. This historical item remains an optional cross-arc relic; its stat boosts are a Multiverse Breach adaptation.'
        }
      }],
      ['joker_toxin_vial', 'Joker Toxin Vial', 'Fiole de toxine Joker', { spd: 2, atk: 6 }],
      ['joker_carnival_card', 'Carnival Death Card', 'Carte de carnaval mortel', { hp: 45, atk: 7 }]
    ],
    event: ['evt_joker_toxin', 'Endgame Laugh Cloud', 'Nuage de rire Endgame', 'A toxin cloud stuns enemies and cuts their defense.', 'Un nuage de toxine etourdit les ennemis et brise leur defense.'],
    decor: { sky: ['#27142f', '#07020a'], floor: 'rgba(143, 43, 94, 0.18)', grid: 'rgba(76, 220, 94, 0.26)', motif: 'hauntedset', accent: '#4cdc5e' }
  });
}
