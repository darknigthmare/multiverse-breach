// Redneck Rampage — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRedneckRampage() {
  return (Object.freeze({ key: 'redneck_rampage', universe: 'Redneck Rampage', url: 'https://steamcdn-a.akamaihd.net/steam/apps/565550/manuals/Redneck_Rampage.pdf' }));
}

export function createRedneckRampage2({ REDNECK_RAMPAGE, definePack, stageVariant }) {
  return (definePack(REDNECK_RAMPAGE, {
  aliases: ['Hillbilly Rampage', 'Rendez-vous Rampage', 'rendez-vous rampage', 'Redneck Rampage Collection'],
  mediaType: 'video-game', faction: 'alien', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#684228', '#120b07', '#d9c452'], motif: 'hickston',
  theme: 'Leonard crossing alien-cloned Hickston to recover Bessie and find Bubba',
  continuity: 'Redneck Rampage (1997), with collection references kept separate from Rides Again',
  adaptationRule: '“Hillbilly Rampage” is normalized to Redneck Rampage, the Xatrix/Interplay game—not the unrelated arcade city-destruction series. Never import that series’ roster or lore. Leonard is the playable fighter; Bubba is a canonical level-exit/search Trial and Bessie a rescue Trial. Keep the adaptation non-graphic and omit sexualized Alien Vixen imagery.',
  visualAnchor: 'Rural Hickston farms, meat plant, trailer yards, alien machinery, Leonard’s suspenders and grotesque comic clones in a Build-engine palette.',
  canonStatus: '1997 game canon with adult humor softened for project-safe fan art',
  fr: 'Leonard traverse Hickston envahie par des extraterrestres qui ont cloné les habitants et enlevé la truie Bessie, tout en retrouvant Bubba à la sortie des niveaux.',
  en: 'Leonard crosses alien-invaded Hickston, whose residents were cloned and prize pig Bessie abducted, while finding Bubba at level exits.',
  referenceUrls: [REDNECK_RAMPAGE.url, 'https://www.gog.com/en/game/redneck_rampage_collection', 'https://store.steampowered.com/app/580940/Redneck_Rampage_Rides_Again/'],
  characters: [
    { id: 'leonard', name: 'Leonard', role: 'slayer', weapon: 'Scattergun', weaponType: 'gun', simple: 'Scattergun blast', secondary: 'Dynamite throw', defense: 'Hickston sidestep', special: 'Alien-homestead sweep', visualAnchor: 'Lean fictional Arkansas farmhand with red cap, yellow undershirt, blue denim overalls, boots and battered scattergun; original face.', fr: 'Le combattant jouable part récupérer Bessie.', en: 'The playable fighter sets out to recover Bessie.' },
    { id: 'bubba_route', name: 'Find Bubba — Level Exit', role: 'trial', nonCombat: true, objective: 'Locate Bubba after clearing the route and trigger the canonical comic level exit without an opponent bar.', objectiveFr: 'Retrouver Bubba après avoir dégagé la route et déclencher la sortie comique canonique sans barre d’adversaire.', victoryCondition: 'bubba-found-exit-triggered', visualAnchor: 'Large friendly farmhand Bubba waiting at a route exit beside a crowbar icon shown only as slapstick signal, no impact.', fr: 'Bubba sert de repère de sortie et de compagnon à retrouver, pas de faux combattant.', en: 'Bubba is a level-exit marker and companion to find, not a fake fighter.', canonStatus: 'canon non-combat level-exit Trial' },
    { id: 'bessie_rescue', name: 'Bessie Rescue', role: 'trial', nonCombat: true, objective: 'Trace the alien abduction route and return prize pig Bessie safely to Leonard and Bubba.', objectiveFr: 'Suivre la route d’enlèvement extraterrestre et ramener la truie Bessie saine et sauve à Leonard et Bubba.', victoryCondition: 'bessie-home-safe', visualAnchor: 'Friendly prize pig in an alien holding pen progressing through four safe rescue states.', fr: 'Bessie est le véritable objectif de sauvetage du jeu.', en: 'Bessie is the game’s true rescue objective.', canonStatus: 'canon non-combat rescue objective' }
  ],
  monsters: [
    { id: 'skinny_old_coot', name: 'Skinny Old Coot Clone', weapon: 'Shotgun', special: 'Hickston ambush', visualAnchor: 'Gaunt cloned local in patched rural clothes and floppy hat, exaggerated comic proportions and no gore.', fr: 'Un habitant cloné par les envahisseurs.', en: 'A local cloned by the invaders.', canonStatus: 'canon manual enemy' },
    { id: 'billy_ray', name: 'Billy Ray Jeter Clone', weapon: 'Heavy farm tool', special: 'Thick-skulled rush', visualAnchor: 'Huge cloned hillbilly in stained overalls and boots, original comic face and no gore.', fr: 'Le manuel décrit Billy Ray comme un clone particulièrement solide.', en: 'The manual describes Billy Ray as a particularly tough clone.', canonStatus: 'canon manual enemy' },
    { id: 'alien_hulk_guard', name: 'Alien Hulk Guard', weapon: 'Integrated alien guns', special: 'Backup-battery recharge', visualAnchor: 'Large half-creature half-machine alien guard with green armor, multiple built-in weapons and glowing battery pack.', fr: 'Le garde extraterrestre cybernétique se recharge s’il n’est pas arrêté.', en: 'The cybernetic alien guard recharges if not stopped.', canonStatus: 'canon manual enemy' }
  ],
  bosses: [
    { id: 'sheriff_hobbes', name: 'Sheriff Lester T. Hobbes', weapon: 'Sheriff’s shotgun', special: 'Extreme county ambush', visualAnchor: 'Broad fictional county sheriff in tan uniform, dark sunglasses and oversized hat, original face and no real police badge.', fr: 'Le shérif Hobbes applique sa propre justice extrême.', en: 'Sheriff Hobbes enforces his own extreme justice.', canonStatus: 'canon named manual enemy' },
    { id: 'assface', name: 'Assface', weapon: 'Alien heavy attack', special: 'Hickston boss rush', visualAnchor: 'Large grotesque but non-graphic alien-mutant boss with lopsided head, brown-green hide and mechanical harness.', fr: 'Le premier boss nommé du jeu original.', en: 'The original game’s first named boss.', canonStatus: 'canon game boss' },
    { id: 'flying_saucer', name: 'Alien Flying Saucer', weapon: 'Energy beam', special: 'Abduction tractor field', visualAnchor: 'Rusty silver-green flying saucer hovering above a Hickston barn with a yellow tractor beam.', fr: 'Le vaisseau relie les enlèvements à la base des envahisseurs.', en: 'The craft connects the abductions to the invaders’ base.', canonStatus: 'canon manual enemy vehicle' }
  ],
  worldBoss: { id: 'queen_vixen', name: 'Queen Vixen', weapon: 'Alien command energy', special: 'Mothership defense', visualAnchor: 'Regal non-sexualized alien invasion queen in full green-purple biomechanical armor with broad crownlike head crest and command console.', fr: 'La souveraine extraterrestre dirige l’invasion et constitue la finale du jeu.', en: 'The alien sovereign directs the invasion and is the game’s finale.', canonStatus: 'canon final boss', depictionRule: 'Full practical armor; no fetishwear or sexualized pose.' },
  stage: { name: 'Hickston — ferme clonée', visualAnchor: 'Dry Arkansas farm, red barn, pig pens, patched trailers and a hovering saucer behind cornfields.', fr: 'La piste de Bessie commence dans une ferme remplie de voisins clonés.', en: 'Bessie’s trail begins at a farm filled with cloned neighbors.' },
  stageVariants: [
    stageVariant('Trial', 'Hickston — retrouver Bubba', 'Hard', 'Find Bubba — Level Exit', { nonCombat: true, trialType: 'Trial', objective: 'Clear a safe path, locate Bubba and trigger the comic exit without fighting him.' }),
    stageVariant('RPG', 'Vaisseau-mère — enclos de Bessie', 'Expert', 'Queen Vixen', { objective: 'Open Bessie’s pen, disable the tractor field and stop Queen Vixen.' })
  ],
  gear: [
    { id: 'crowbar', enName: 'Crowbar', frName: 'Pied-de-biche', boost: { atk: 5, spd: 1 }, visualAnchor: 'Worn red-brown farm crowbar with chipped paint, no blood.', fr: 'Outil de mêlée et signal comique de sortie de niveau.', en: 'A melee tool and comic level-exit signal.' },
    { id: 'dynamite_crossbow', enName: 'Dynamite Crossbow', frName: 'Arbalète à dynamite', boost: { atk: 8 }, visualAnchor: 'Improvised wooden crossbow carrying one red dynamite bolt, no live animal projectile.', fr: 'Une arme bricolée de Rides Again intégrée comme objet de franchise.', en: 'A Rides Again improvised weapon included as franchise gear.', canonStatus: 'canon Rides Again gear' },
    { id: 'hip_waders', enName: 'Hip Waders', frName: 'Cuissardes', boost: { spd: 2, def: 5 }, visualAnchor: 'Pair of tall patched green waders with heavy farm boots.', fr: 'Les cuissardes accélèrent les déplacements dans les zones boueuses.', en: 'The waders speed movement through muddy areas.' }
  ],
  event: { id: 'bessie_trail', enName: 'Bessie Abduction Trail', frName: 'Piste de l’enlèvement de Bessie', en: 'Alien tractor traces, cloned neighbors and each Bubba exit marker connect Hickston to the mothership pen.', fr: 'Les traces de rayon tracteur, les voisins clonés et chaque repère de sortie Bubba relient Hickston à l’enclos du vaisseau-mère.', visualAnchor: 'Farm map progressing from pig pen through cloned town to a saucer holding bay.', canonStatus: 'canon rescue-chain adaptation', nonCombat: true }
}));
}
