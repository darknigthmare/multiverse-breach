// Tokyo Ghoul — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'tokyo_ghoul',
    universe: 'Tokyo Ghoul',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Tokyo Ghoul',
    stage: 'Ward 20 Anteiku Siege',
    boss: 'One-Eyed Owl',
    hero: ['ken_kaneki', 'Ken Kaneki', 'horror'],
    allies: [['touka_kirishima', 'Touka Kirishima', 'slayer'], ['koutarou_amon', 'Koutarou Amon', 'tactical']],
    monsters: ['Aogiri Ghoul', 'CCG Quinque Investigator', 'Kagune Predator'],
    bosses: ['Yamori Jason', 'Eto Owl'],
    gear: [['kaneki_mask', 'Kanekis Ghoul Mask', 'Masque de Kaneki', { atk: 8, def: 5 }], ['quinque_case', 'Quinque Case', 'Mallette Quinque', { atk: 10, def: 3 }], ['anteiku_coffee', 'Anteiku Coffee', 'Cafe de l Anteiku', { hp: 85 }]],
    event: ['evt_kakuja_break', 'Kakuja Break', 'Rupture Kakuja', 'Kaneki releases a controlled kagune burst at the cost of hunger and stability.', 'Kaneki libere une poussee controlee de kagune au prix de sa faim et de sa stabilite.'],
    theme: 'ghoul hunger, kagune biology, CCG investigations, and Kanekis fractured human identity',
    desc: { en: 'Ghouls cannot live on ordinary food, and every use of kagune reinforces the moral pressure between Anteiku and the CCG.', fr: 'Les goules ne peuvent pas vivre de nourriture ordinaire, et chaque kagune renforce la tension morale entre l Anteiku et le CCG.' },
    motif: 'arcanecity',
    colors: ['#16151a', '#030304', '#d92f45'],
    stageVariants: [['Tactics', 'Cochlea Ghoul Prison Break', 'Very Hard', 'Yamori Jason'], ['Smash', 'Tokyo Rooftop Owl Raid', 'Expert', 'One-Eyed Owl']]
  });
}
