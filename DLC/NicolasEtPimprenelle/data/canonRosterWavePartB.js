// Nicolas et Pimprenelle — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBedtime() {
  return (Object.freeze({
  key: 'nicolas_pimprenelle',
  universe: 'Nicolas et Pimprenelle',
  url: 'https://www.bonnenuitlespetits.fr/'
}));
}

export function createNicolasEtPimprenelle({ BEDTIME, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(BEDTIME, {
  aliases: ['Bonne nuit les petits', 'Gros Nounours'],
  mediaType: 'puppet-series',
  faction: 'arcane',
  mode: 'Tactics',
  difficulty: 'Medium',
  colors: ['#263d75', '#090d24', '#d9c16d'],
  motif: 'dream',
  theme: 'Nicolas and Pimprenelle’s bedtime ritual, Gros Nounours, the Sandman’s cloud, lullabies and gentle dream obstacles',
  continuity: 'classic colour Bonne nuit les petits continuity, with Gros Vilain identified as a later official stage-musical character',
  adaptationRule: 'The Sandman is always benevolent support and never an enemy. Most threats are explicitly harmless bedtime obstacles; Gros Vilain is used only with his official musical status disclosed.',
  visualAnchor: 'Soft practical French television puppets: Nicolas and Pimprenelle at their flower-box balcony, large brown Gros Nounours, deep blue night, golden stars and the Sandman’s small cloud.',
  canonStatus: 'classic-series bedtime adaptation with disclosed musical element',
  lore: lore('Nicolas, Pimprenelle et Gros Nounours réparent un rituel du coucher dérangé ; le Marchand de sable guide toujours le retour au sommeil.', 'Nicolas, Pimprenelle and Gros Nounours repair a disturbed bedtime ritual; the Sandman always guides the return to sleep.'),
  referenceUrls: [BEDTIME.url, 'https://www.bonnenuitlespetits.fr/histoire/', 'https://www.bonnenuitlespetits.fr/portfolio/gros-nounours-et-le-sac-aux-tresors-la-comedie-musicale/', 'https://www.ina.fr/ina-eclaire-actu/nounours-pimprenelle-emission-television-michel-manini-claude-laydu'],
  hero: character(BEDTIME, 'nicolas', 'Nicolas', 'tactical', 'Classic colour-series child puppet Nicolas with tousled brown yarn hair, rounded felt face, blue-and-white striped pyjamas with solid blue collar and pocket, and blue slippers under gentle practical lighting; no weapon or adult proportions.', lore('Nicolas attend la visite du soir et aide à remettre chaque objet à sa place.', 'Nicolas awaits the evening visit and helps return each object to its place.'), 'canonical protagonist', { simple: 'Toy Tidy', secondary: 'Balcony Call', defense: 'Blanket Fort', special: 'Bonsoir Nounours' }),
  allies: [
    character(BEDTIME, 'pimprenelle', 'Pimprenelle', 'hacker', 'Classic colour-series child puppet Pimprenelle with pale-blonde yarn hair and red ribbon, soft felt face, pink gingham nightdress with white lace collar and pink slippers under flower-box balcony light; no fantasy princess costume.', lore('Pimprenelle retrouve les éléments oubliés de l’histoire du soir.', 'Pimprenelle finds the missing pieces of the bedtime story.'), 'canonical protagonist', { simple: 'Story Clue', secondary: 'Lullaby Hum', defense: 'Pillow Guard', special: 'Dream-Story Finish' }),
    character(BEDTIME, 'gros_nounours', 'Gros Nounours', 'tactical', 'Large canonical bear puppet with uniform brown practical fur across face and muzzle, rounded snout, heavy friendly body and soft blue-gold studio light; no cream muzzle patch, claws, armour or feral posture.', lore('Gros Nounours descend du nuage pour jouer, chanter puis souhaiter bonne nuit aux enfants.', 'Gros Nounours comes down from the cloud to play, sing and wish the children good night.'), 'canonical protagonist', { simple: 'Gentle Paw', secondary: 'Pom-Pom Arrival', defense: 'Bear Hug', special: 'Bonne Nuit les Petits' })
  ],
  monsters: [
    threat(BEDTIME, 'restless_pillow', 'Oreiller récalcitrant', 'pillow bounce', 'Plume légère', 'Small soft practical white pillow hopping gently across a toy-scale bedroom, no face, teeth or sinister markings.', lore('Un obstacle de jeu inoffensif empêche simplement de border le lit.', 'A harmless gameplay obstacle simply prevents the bed from being tucked in.'), 'fan-made benign bedtime obstacle'),
    threat(BEDTIME, 'lost_cloud', 'Nuage égaré', 'drifting platform', 'Dérive étoilée', 'Small pale practical cloud drifting away from the usual route, golden paper stars and no storm face.', lore('Un nuage perdu doit retrouver la voie du rituel du soir.', 'A lost cloud must return to the bedtime route.'), 'fan-made benign bedtime obstacle'),
    threat(BEDTIME, 'early_alarm', 'Réveil trop matinal', 'premature bell', 'Driing avant l’heure', 'Round toy-scale alarm clock ringing under the moon, simple brass bells and no monster anatomy.', lore('Le réveil sonne trop tôt et brouille l’heure du coucher.', 'The alarm rings too early and confuses bedtime.'), 'fan-made benign bedtime obstacle')
  ],
  bosses: [
    threat(BEDTIME, 'gros_vilain', 'Gros Vilain', 'treasure-sack trickery', 'Sac aux trésors', 'Original darker-fur theatrical bear silhouette differentiated from Gros Nounours; this under-documented visual is a disclosed fan-made interpretation of the official later stage-musical antagonist, not a classic-TV character design.', lore('Gros Vilain vient de la comédie musicale officielle Gros Nounours et le Sac aux trésors, pas des épisodes télévisés classiques.', 'Gros Vilain comes from the official Gros Nounours et le Sac aux trésors stage musical, not the classic TV episodes.'), 'official later musical role with disclosed visual adaptation'),
    threat(BEDTIME, 'lost_treasure_sack', 'Sac aux trésors égaré', 'rolling toy sack', 'Jouets dispersés', 'Soft theatrical treasure sack spilling wooden toys and paper stars, no creature face and no dangerous contents.', lore('Le sac du spectacle devient un puzzle d’objets à ranger.', 'The stage-show sack becomes a toy-sorting puzzle.'), 'official-prop-inspired benign adaptation'),
    threat(BEDTIME, 'faceless_nightmare', 'Cauchemar sans visage', 'mixed-up dream scenery', 'Décor renversé', 'Abstract practical shadow made only of misplaced cardboard moon, curtain and toy silhouettes, with no human or named character shape.', lore('Ce cauchemar abstrait représente un décor de rêve mal rangé et ne prétend pas être un personnage canonique.', 'This abstract nightmare represents disordered dream scenery and does not claim to be a canonical character.'), 'fan-made benign dream abstraction')
  ],
  worldBoss: threat(BEDTIME, 'sleepless_night', 'La Nuit sans sommeil', 'endless unfinished bedtime', 'Aube qui n’arrive pas', 'Large practical dream set of stalled moon, tangled golden stars, unmade beds and a cloud route looping in the sky; no evil person or creature at its centre.', lore('La nuit sans sommeil est un problème de rituel à apaiser, jamais une version maléfique d’un ami des enfants.', 'The sleepless night is a ritual problem to soothe, never an evil version of the children’s friend.'), 'fan-made world-boss bedtime abstraction', { layout: 'cosmic', objective: 'Finish the story, align the cloud route and restore a calm good-night ritual for Nicolas and Pimprenelle.', objectiveFr: 'Terminer l’histoire, aligner la route du nuage puis rétablir un rituel du coucher apaisé pour Nicolas et Pimprenelle.' }),
  stage: 'Balcon de Nicolas et Pimprenelle',
  stageMeta: stageMeta(BEDTIME, 'Toy-scale practical balcony with flower boxes, two bedroom windows, deep blue cyclorama, paper stars and soft 1960s-style studio light.', 'Le balcon accueille la visite immuable de Gros Nounours.', 'The balcony hosts Gros Nounours’s familiar visit.', 'canonical setting adaptation'),
  stageVariants: [
    stageVariant('Tactics', 'Nuage de Gros Nounours', 'Medium', 'Sac aux trésors égaré', stageMeta(BEDTIME, 'Small soft cloud over a deep-blue practical sky, simple control rail hidden by golden paper stars and warm moonlight.', 'Le nuage reste le moyen de transport rassurant de Nounours et de son ami.', 'The cloud remains the reassuring transport of Nounours and his friend.', 'canonical setting adaptation')),
    stageVariant('Tactics', 'Pays des rêves sans sommeil', 'Hard', 'La Nuit sans sommeil', stageMeta(BEDTIME, 'Original gentle dreamland assembled from toy beds, cardboard moon, looping cloud path and soft curtains, with no horror imagery.', 'Le pays des rêves transforme l’insomnie en puzzle apaisant.', 'Dreamland turns sleeplessness into a soothing puzzle.', 'fan-made franchise-faithful stage'))
  ],
  gear: [
    gear(BEDTIME, 'nounours_cloud', 'Nounours Cloud Charm', 'Charme du nuage de Nounours', { spd: 2, hp: 50 }, 'Small soft white cloud charm with one golden paper star, no character face.', lore('Le charme rappelle le voyage du soir sur le nuage.', 'The charm recalls the evening cloud journey.'), 'canon-inspired prop'),
    gear(BEDTIME, 'story_book', 'Bedtime Storybook', 'Livre d’histoire du soir', { def: 5, hp: 55 }, 'Plain clothbound picture book with moon-and-star cover and no readable title or copied illustration.', lore('Le livre permet de terminer l’histoire avant le coucher.', 'The book lets the bedtime story reach its ending.'), 'canon-inspired prop'),
    gear(BEDTIME, 'golden_sand_pouch', 'Sandman’s Golden Sand Pouch', 'Bourse de sable doré', { def: 7, spd: 1 }, 'Small benevolent golden sand pouch resting beside a cloud flute, presented as supportive equipment and never a threat.', lore('Le Marchand de sable confie cette bourse pour guider doucement le sommeil.', 'The Sandman lends this pouch to guide sleep gently.'), 'canonical-support-inspired prop')
  ],
  event: event(BEDTIME, 'sandman_lullaby', 'Sandman Lullaby', 'Berceuse du Marchand de sable', 'The Sandman guides the cloud while Gros Nounours sings and every restless prop settles into place.', 'Le Marchand de sable guide le nuage pendant que Gros Nounours chante et que chaque accessoire agité retrouve sa place.', 'Benevolent Sandman silhouette steering a small cloud above Nounours and the children’s balcony under golden stars.', 'canonical benevolent bedtime event')
}));
}
