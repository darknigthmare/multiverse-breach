// Nyan Cat — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createNyan() {
  return (Object.freeze({
  key: 'nyan_cat',
  universe: 'Nyan Cat',
  url: 'https://store.steampowered.com/app/415420/Nyan_Cat_Lost_In_Space/'
}));
}

export function createNyanCat({ NYAN, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(NYAN, {
  aliases: ['Nyan Cat: Lost in Space'],
  mediaType: 'internet-game',
  faction: 'cyber',
  mode: 'Smash',
  difficulty: 'Hard',
  colors: ['#162559', '#06071d', '#ff71c8'],
  motif: 'space',
  theme: 'pixel cat flight, Pop-Tart body, rainbow trail, sweets, space obstacles and Tac Nayn’s parallel-universe rivalry',
  continuity: 'original Nyan Cat animation and Nyan Cat: Lost in Space game continuity',
  adaptationRule: 'Use only the simple pixel anatomy and game-confirmed forms. New obstacle bosses remain labelled gameplay abstractions.',
  visualAnchor: 'Classic grey pixel cat with pink frosted pastry body, four short legs, smiling face and six-band rainbow trail against dark blue pixel space.',
  canonStatus: 'official game adaptation of the original internet animation',
  lore: lore('Nyan Cat traverse une brèche gourmande de l’espace perdu, suivi de ses formes jouables et poursuivi par Tac Nayn.', 'Nyan Cat crosses a candy-coloured Lost in Space breach, joined by playable forms and pursued by Tac Nayn.'),
  referenceUrls: [NYAN.url, 'https://www.nyan.cat/'],
  hero: character(NYAN, 'classic', 'Nyan Cat', 'slayer', 'Exact low-resolution grey cat head and legs, pink-frosted pastry torso with sprinkles and straight six-colour rainbow trail.', lore('Le chat-pâtisserie original vole en laissant son arc-en-ciel pixelisé.', 'The original pastry cat flies while leaving its pixel rainbow.'), 'canonical Nyan Cat avatar', { simple: 'Rainbow Dash', secondary: 'Candy Scoop', defense: 'Pixel Roll', special: 'Nyan Through Space' }),
  allies: [
    character(NYAN, 'supernyan', 'Supernyan', 'slayer', 'Lost in Space selectable superhero Nyan form, preserving the square grey cat-and-pastry proportions, compact blue hero mask and cape at the original pixel scale.', lore('Supernyan reprend une forme jouable confirmée de Lost in Space.', 'Supernyan uses a confirmed playable Lost in Space form.'), 'official-game selectable form', { simple: 'Hero Rainbow', secondary: 'Cape Boost', defense: 'Pixel Guard', special: 'Supernyan Flight' }),
    character(NYAN, 'zombienyan', 'Zombienyan', 'horror', 'Lost in Space selectable zombie-themed Nyan form with muted green-grey pixel cat head, pastry torso and darker rainbow trail, kept cute and non-gory.', lore("Zombienyan reprend une forme jouable confirmée sans ajouter d'anatomie réaliste ni de gore.", 'Zombienyan uses a confirmed playable form without realistic anatomy or gore.'), 'official-game selectable form', { simple: 'Glitch Bite', secondary: 'Dark Trail', defense: 'Pixel Re-form', special: 'Zombienyan Rush' })
  ],
  monsters: [
    threat(NYAN, 'space_dog', 'Space Dog', 'sideways chase', 'Bark Boost', 'Chunky Lost in Space-style pixel dog obstacle in a tiny space harness, matching the game’s bright low-resolution scale.', lore('Le chien spatial reprend un obstacle du jeu.', 'The space dog returns as a game obstacle.'), 'official-game obstacle'),
    threat(NYAN, 'ufo', 'Lost in Space UFO', 'tractor beam', 'Candy Abduction', 'Small lime-and-violet pixel saucer with domed cockpit and blocky tractor beam, no realistic metal rendering.', lore('L’OVNI dévie la trajectoire des friandises.', 'The UFO bends the candy flight path.'), 'official-game-derived obstacle'),
    threat(NYAN, 'meteor', 'Pixel Meteor', 'falling rock lane', 'Meteor Shower', 'Brown-orange blocky meteor with four-frame flame tail and the same pixel density as Nyan Cat.', lore('La météorite transforme l’orbite en parcours d’adresse.', 'The meteor turns the orbit into a skill course.'), 'fan-made gameplay obstacle in official-game style')
  ],
  bosses: [
    threat(NYAN, 'giant_ufo', 'Giant Candy UFO', 'wide tractor beam', 'Sweet Vacuum', 'Large original extension of the game UFO, built from chunky violet pixels and filled with floating sweets.', lore('Un OVNI agrandi rassemble les obstacles connus sans devenir un nouveau personnage canonique.', 'An enlarged UFO gathers known obstacles without becoming a new canonical character.'), 'fan-made gameplay abstraction'),
    threat(NYAN, 'meteor_swarm', 'Meteor Swarm Core', 'orbiting meteor ring', 'Rainbow Break', 'Original ring of Lost in Space-style block meteors around a dark pixel core, sized as a stage hazard rather than a creature.', lore('Le cœur de l’essaim coordonne une pluie de météores.', 'The swarm core coordinates a meteor shower.'), 'fan-made gameplay abstraction'),
    threat(NYAN, 'candy_vacuum', 'Candy Vacuum', 'sweet-collecting vortex', 'Sugar Spiral', 'Original pink-cyan pixel vortex pulling cookies and candy, with no face, logo or borrowed character design.', lore('Le vide gourmand détourne les bonus de la route.', 'The candy vacuum pulls bonuses away from the route.'), 'fan-made gameplay abstraction')
  ],
  worldBoss: threat(NYAN, 'tac_nayn', 'Tac Nayn', 'reverse rainbow flight', 'Parallel-Universe Pursuit', 'Tac Nayn as shown in Lost in Space: dark inverted counterpart silhouette, pastry-cat proportions and reversed dark rainbow trail; no realistic cat anatomy.', lore('Tac Nayn est l’adversaire confirmé du jeu et poursuit Nyan Cat dans les univers parallèles.', 'Tac Nayn is the game-confirmed foe and pursues Nyan Cat through parallel universes.'), 'official-game antagonist', { layout: 'large', objective: 'Outfly Tac Nayn through the parallel-universe gate and restore the rainbow route.', objectiveFr: 'Distancer Tac Nayn à travers le portail de l’univers parallèle puis rétablir la route arc-en-ciel.' }),
  stage: 'Lost in Space Rainbow Orbit',
  stageMeta: stageMeta(NYAN, 'Dark navy pixel-space lane filled with cookies, milk, candy and a straight rainbow route, matching Lost in Space scale.', 'L’orbite reprend les friandises et la lecture horizontale du jeu.', 'The orbit preserves the game’s sweets and horizontal readability.', 'official-game-inspired fan stage'),
  stageVariants: [
    stageVariant('Smash', 'Tac Nayn Parallel Universe', 'Very Hard', 'Tac Nayn', stageMeta(NYAN, 'Inverted dark pixel space with a reversed charcoal rainbow and simple block planets.', 'L’univers parallèle reprend le mode de Tac Nayn.', 'The parallel universe follows Tac Nayn’s mode.', 'official-game-inspired fan stage')),
    stageVariant('Tactics', 'Candy Nebula Run', 'Hard', 'Candy Vacuum', stageMeta(NYAN, 'Original pink candy nebula assembled from the game’s cookie, milk and sweet pickups.', 'La nébuleuse organise les bonus du jeu en parcours.', 'The nebula arranges game pickups into a course.', 'fan-made game stage'))
  ],
  gear: [
    gear(NYAN, 'rainbow_booster', 'Rainbow Booster', 'Propulseur arc-en-ciel', { spd: 3, atk: 4 }, 'Compact six-band pixel rainbow folded into a booster icon.', lore('Le propulseur condense la traînée emblématique.', 'The booster condenses the signature trail.'), 'canonical visual motif'),
    gear(NYAN, 'milk_glass', 'Milk Pickup', 'Bonus lait', { hp: 65, def: 3 }, 'Chunky white-and-blue pixel milk pickup matching Lost in Space collectible scale.', lore('Le lait est traité comme un bonus gourmand.', 'Milk is treated as a candy-route pickup.'), 'official-game-derived pickup'),
    gear(NYAN, 'cookie_cluster', 'Cookie Cluster', 'Grappe de biscuits', { atk: 6, hp: 35 }, 'Three simple golden pixel cookies with dark square chips.', lore('Les biscuits jalonnent la route de Nyan Cat.', 'Cookies line Nyan Cat’s route.'), 'official-game-derived pickup')
  ],
  event: event(NYAN, 'rainbow_fever', 'Rainbow Fever', 'Fièvre arc-en-ciel', 'Every collected sweet extends the rainbow and accelerates all three Nyan forms.', 'Chaque friandise collectée prolonge l’arc-en-ciel et accélère les trois formes Nyan.', 'Classic rainbow trail weaving through cookies, milk and chunky pixel stars.', 'official-game-inspired event')
}));
}
