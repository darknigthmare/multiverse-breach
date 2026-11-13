// Bendy and the Ink Machine — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'bendy_ink_machine', universe: 'Bendy and the Ink Machine', aliases: ['Bendy', 'BATIM'],
    continuity: 'Joey Drew Studios’ Bendy and the Ink Machine five-chapter Cycle starring Henry Stein.',
    adaptationRule: 'Retain sepia rubber-hose cartoon shapes and ink horror with no copied key art, logos, actor likeness or graphic gore.',
    visualAnchor: 'Sepia animation-studio corridors, black ink pools, hand-painted props and warped 1930s cartoon machinery.',
    referenceUrl: 'https://www.joeydrewstudios.com/batim', referenceUrls: ['https://www.joeydrewstudios.com/batim', 'https://www.joeydrewstudios.com/joeydrewstudios'],
    heroes: [hero('henry', 'Henry Stein', 'Adult former animator in simple 1960s shirt, vest and trousers, carrying an axe; original face.', 'Axe', 'Animator’s Resolve', { role: 'horror', prohibitedConcepts: ['actor likeness'] }), hero('boris', 'Boris the Wolf', 'Tall black-and-white rubber-hose cartoon wolf in overalls with long ears and rounded gloves.', 'Gent Pipe', 'Safehouse Support', { role: 'tactical' }), hero('allison', 'Allison Angel', 'Adult ink heroine in fully opaque black-white adventure clothes with halo-like hair shape and sword.', 'Sword', 'Angel Guard', { role: 'slayer' })],
    enemies: [threat('searcher', 'Searcher', 'Low humanoid ink blob with glossy black body and simple white face marks.', 'Ink Swipe', 'Pool Emerge'), threat('piper', 'The Piper', 'Distorted cartoon figure with projector-like pipe weapon and white mask face.', 'Pipe Swing', 'Butcher Rush'), threat('projectionist', 'The Projectionist', 'Tall ink-covered humanoid with film projector for a head and bright lens.', 'Projector Strike', 'Light Pursuit')],
    bosses: [threat('sammy', 'Sammy Lawrence', 'Adult masked cultist fully clothed in ink-black overalls, suspenders and Bendy mask.', 'Axe', 'Ink Searcher Call'), threat('bertrum', 'Bertrum Piedmont', 'Huge rotating carnival ride face made of sepia machinery and mechanical arms.', 'Ride Arm Sweep', 'Carousel Spin'), threat('brute_boris', 'Brute Boris', 'Oversized distorted Boris form with broad shoulders and ink-dark overalls, no gore.', 'Brute Slam', 'Arena Charge')],
    worldBoss: threat('beast_bendy', 'Beast Bendy', 'Gigantic horned ink demon with elongated rubber-hose limbs and glossy black silhouette.', 'Ink Claw', 'Cycle Rampage'),
    gear: [gear('gent_pipe', 'Gent Pipe', 'Short dark metal pipe with wrapped grip.', { atk: 3, def: 2, spd: 1 }), gear('audio_log', 'Studio Audio Log', 'Sepia reel-to-reel recorder without readable labels.', { atk: 0, def: 2, spd: 4 }), gear('the_end_reel', 'The End Film Reel', 'Small black film reel in a sepia metal can, no text visible.', { atk: 3, def: 3, spd: 1 })],
    stages: [stage('Old Workshop', 'Sepia drawing desks, wooden corridors and the inactive Ink Machine.'), stage('Heavenly Toys', 'Toy-production floor with conveyor belts, cutouts and ink pipes.'), stage('The Ink Machine', 'Vast black machinery chamber crossed by film reels and rising ink.')],
    event: event('cycle_restart', 'The Cycle Restarts', 'A film reel rewinds while the sepia studio rebuilds its corridors around Henry.')
  });
}
