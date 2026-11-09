// Famille Pirate — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPirate() {
  return (Object.freeze({
  key: 'famille_pirate',
  universe: 'Famille Pirate',
  url: 'https://www.ellipseanimation.com/fr/production/famille-pirate/'
}));
}

export function createFamillePirate({ PIRATE, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(PIRATE, {
  aliases: ['La Famille Pirate', 'Mac Bernik'],
  mediaType: 'animated-series',
  faction: 'arcane',
  mode: 'Tactics',
  difficulty: 'Medium',
  colors: ['#1c7391', '#102c3a', '#e7b44a'],
  motif: 'pirateship',
  theme: 'Mac Bernik family comedy, average pirate life, the Os-à-Moelle crew, Tortuga school and rivalry with wealthy Irvin Lerequin',
  continuity: '1999 and 2004 animated television series',
  adaptationRule: 'Rivals remain comic neighbours, not lethal villains. Encounters use canonical crew roles, ships and slapstick challenges in Fabrice Parme’s graphic style.',
  visualAnchor: 'Flat-colour angular Famille Pirate animation style: Victor is a broad red-bearded father in striped shirt and oversized black pirate hat, Lucile wears her red-and-white striped top, and Scampi keeps red hair and a purple headscarf; patched wooden ships and turquoise Tortuga sea; no realistic pirate redesign.',
  canonStatus: 'animated-series adaptation',
  lore: lore('Les Mac Bernik défendent leur vie de pirates moyens lorsque la rivalité avec les Lerequin déforme l’île de la Tortue.', 'The Mac Bernik family defend their average-pirate life when the Lerequin rivalry distorts Tortuga.'),
  referenceUrls: [PIRATE.url, 'https://mediatoon-distribution.com/programme/famille-pirate/', 'https://www.allocine.fr/series/ficheserie-4459/casting/saison-8573/', 'https://www.mediatoon-foreignrights.com/fr/serie/famille-pirate/?pdf=22125'],
  hero: character(PIRATE, 'victor', 'Victor Mac Bernik', 'tactical', 'Series-accurate broad Victor Mac Bernik with thick red beard, oversized black pirate hat, blue-and-white striped shirt, green kilt-like lower garment, patched boots and a crooked cartoon sabre; preserve his clumsy family-captain silhouette.', lore('Victor commande l’Os-à-Moelle avec plus de vantardise que de réussite.', 'Victor commands the Os-à-Moelle with more boasting than success.'), 'canonical protagonist', { simple: 'Crooked Sabre', secondary: 'Captain’s Bluff', defense: 'Duck and Cover', special: 'Os-à-Moelle Broadside' }),
  allies: [
    character(PIRATE, 'lucile', 'Lucile Mac Bernik', 'tactical', 'Series-accurate blonde Lucile Mac Bernik in a red-and-white striped top, black trousers, hoop earrings and practical cutlass at the hip, with strong upright angular posture; no generic pirate-queen armour.', lore('Lucile maintient la famille soudée et voit souvent plus clair que Victor.', 'Lucile keeps the family together and often sees more clearly than Victor.'), 'canonical protagonist', { simple: 'Rolling-Pin Warning', secondary: 'Family Order', defense: 'Household Guard', special: 'Mac Bernik Rally' }),
    character(PIRATE, 'scampi', 'Scampi Mac Bernik', 'slayer', 'Teenage Scampi Mac Bernik in the series’ angular flat-colour design, with bright red hair, purple headscarf and pirate-school clothing, preserving her slender silhouette.', lore('Scampi refuse les prétentions d’Hercule et agit avec davantage d’assurance que son père.', 'Scampi rejects Hercule’s advances and acts with more confidence than her father.'), 'canonical protagonist', { simple: 'School Sabre', secondary: 'Quick Retort', defense: 'Rigging Swing', special: 'Scampi Boarding Run' })
  ],
  monsters: [
    threat(PIRATE, 'lerequin_crew_0', 'Lerequin Crewman No. 0', 'comic boarding hook', 'Numbered Formation', 'Smallest of the four canonical Lerequin crewmen, numbered 0 on simple shirt and arm, flat angular series proportions.', lore('Le numéro 0 ouvre une formation d’abordage comique de l’Écumoir.', 'Number 0 opens a comic boarding formation from the Écumoir.'), 'canonical rival crew archetype'),
    threat(PIRATE, 'lerequin_crew_1', 'Lerequin Crewman No. 1', 'wooden oar', 'Deck Sweep', 'Tall muscular Lerequin crewman with Roman numeral I on shirt and arm, matching the flat cartoon palette.', lore('Le numéro 1 repousse les tonneaux sur le pont.', 'Number 1 sweeps barrels across the deck.'), 'canonical rival crew archetype'),
    threat(PIRATE, 'lerequin_crew_2', 'Lerequin Crewman No. 2', 'cargo net', 'Guindé Net', 'Tall muscular Lerequin crewman with Roman numeral II on shirt and arm, angular jaw and no invented armour.', lore('Le numéro 2 utilise le filet de cargaison de l’équipage rival.', 'Number 2 uses the rival crew’s cargo net.'), 'canonical rival crew archetype')
  ],
  bosses: [
    threat(PIRATE, 'bolaf', 'Bolaf le Hideux', 'heavy fists', 'Tavern Security Toss', 'Huge flat-colour animated colossus in work clothes, broad shoulders and the exaggerated angular face described for the town strongman.', lore('Bolaf sert parfois d’agent de sécurité et transforme la bagarre en épreuve de force.', 'Bolaf sometimes works security and turns the brawl into a strength challenge.'), 'canonical recurring character adapted as encounter'),
    threat(PIRATE, 'hercule', 'Hercule Lerequin', 'boastful school challenge', 'Cucule Charge', 'Awkward teenage Hercule in wealthy Lerequin pirate-school clothes, acne and angular series proportions; no heroic bodybuilding redesign.', lore('Hercule cherche encore à impressionner Scampi dans une confrontation burlesque.', 'Hercule again tries to impress Scampi in a slapstick confrontation.'), 'canonical comic rival adapted as encounter'),
    threat(PIRATE, 'irvin', 'Irvin Lerequin', 'wealthy-rival trickery', 'Guindé Broadside', 'Thin aristocratic-looking pirate in immaculate Lerequin captain clothes, long angular face and refined hat, preserving the series’ flat design.', lore('Irvin exhibe sa réussite et échange surtout insultes et mauvais tours avec Victor.', 'Irvin flaunts his success and mainly trades insults and tricks with Victor.'), 'canonical comic rival')
  ],
  worldBoss: threat(PIRATE, 'ecumoir', 'L’Écumoir', 'superior rival broadside', 'Guindé Flagship Manoeuvre', 'Irvin Lerequin’s pristine elegant wooden ship with tall narrow hull, clean sails and flat-colour Famille Pirate angles, contrasting the patched Os-à-Moelle.', lore('Le navire guindé d’Irvin devient une épreuve d’abordage sans transformer les deux familles en ennemis mortels.', 'Irvin’s refined ship becomes a boarding challenge without turning either family into mortal enemies.'), 'canonical ship adapted as comic world boss', { layout: 'capitalShip', objective: 'Outmanoeuvre the Écumoir, recover the disputed cargo and end the neighbours’ latest prank.', objectiveFr: 'Manœuvrer mieux que l’Écumoir, récupérer la cargaison disputée puis mettre fin à la dernière farce des voisins.' }),
  stage: 'Île de la Tortue — Quartier Mac Bernik',
  stageMeta: stageMeta(PIRATE, 'Flat-colour Tortuga neighbourhood with crooked Mac Bernik house, turquoise sea, patched fences and angular tropical shapes.', 'Le quartier oppose la modestie des Mac Bernik au luxe des Lerequin.', 'The neighbourhood contrasts Mac Bernik modesty with Lerequin wealth.', 'canonical setting adaptation'),
  stageVariants: [
    stageVariant('Smash', 'Pont de L’Os-à-Moelle', 'Hard', 'Irvin Lerequin', stageMeta(PIRATE, 'Patched Os-à-Moelle deck, crooked mast, loose barrels and the show’s flat angular woodwork.', 'Le pont du bateau de Victor devient un parcours de tonneaux.', 'Victor’s ship deck becomes a barrel course.', 'canonical ship adaptation')),
    stageVariant('Tactics', 'Abordage de L’Écumoir', 'Hard', 'L’Écumoir', stageMeta(PIRATE, 'Clean refined rival deck with numbered crew stations, neat ropes and high narrow sails in the series palette.', 'L’Écumoir conserve son contraste guindé avec l’Os-à-Moelle.', 'The Écumoir keeps its refined contrast with the Os-à-Moelle.', 'canonical ship adaptation'))
  ],
  gear: [
    gear(PIRATE, 'victor_sabre', 'Victor’s Crooked Sabre', 'Sabre tordu de Victor', { atk: 7, spd: 1 }, 'Short crooked cartoon sabre with patched grip, flat colours and no realistic blade detail.', lore('Le sabre souligne le statut de pirate moyen de Victor.', 'The sabre underlines Victor’s average-pirate status.')),
    gear(PIRATE, 'powder_keg', 'Mamie la Poudre Keg', 'Tonnelet de Mamie la Poudre', { atk: 8, hp: 30 }, 'Small cartoon powder keg with simple fuse and Mamie-inspired violet cloth knot, no readable label.', lore('Le tonnelet rappelle le tempérament explosif de Mamie la Poudre.', 'The keg recalls Mamie la Poudre’s explosive temperament.'), 'canon-inspired prop'),
    gear(PIRATE, 'os_a_moelle_map', 'Os-à-Moelle Map', 'Carte de l’Os-à-Moelle', { spd: 2, def: 4 }, 'Crinkled flat-colour chart showing an abstract bone-shaped route, compass and turquoise sea without text.', lore('La carte aide l’équipage à retrouver sa route malgré les plans de Victor.', 'The map helps the crew find its route despite Victor’s plans.'), 'canon-inspired ship prop')
  ],
  event: event(PIRATE, 'bateau_abordage_dodo', 'Ship-Board-Sleep', 'Bateau-abordage-dodo', 'The Mac Bernik family turn an ordinary family routine into a perfectly messy boarding counterattack.', 'Les Mac Bernik transforment leur routine familiale en contre-abordage parfaitement désordonné.', 'Os-à-Moelle deck, family silhouettes, crooked sabres and loose barrels in flat angular animation.', 'series-premise-inspired event')
}));
}
