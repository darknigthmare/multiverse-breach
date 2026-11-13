// Téléchat — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createTelechat() {
  return (Object.freeze({
  key: 'telechat',
  universe: 'Téléchat',
  url: 'https://catalogue.ina.fr/doc/TV-RADIO/TV_5294213.001/telechat-rediffusion'
}));
}

export function createTelechat2({ TELECHAT, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(TELECHAT, {
  aliases: ['Léguman'],
  mediaType: 'puppet-series',
  faction: 'arcane',
  mode: 'Smash',
  difficulty: 'Hard',
  colors: ['#486d6c', '#171b19', '#d9954c'],
  motif: 'broadcast',
  theme: 'surreal object television, Groucha and Lola’s news desk, Gluons, deliberately disastrous adverts and Léguman’s low-budget object battles',
  continuity: '1983–1986 Téléchat puppet series and its embedded Léguman segments',
  adaptationRule: 'Preserve puppet-scale newsroom satire and Léguman’s deliberately crude Super-8 fights. Threats are the exact mad objects and concepts he confronts.',
  visualAnchor: 'Téléchat practical-puppet newsroom: Groucha the suited cat with arm in plaster, Lola the ostrich at a desk, worn analogue studio materials; Léguman keeps a pumpkin head, carrot arms and pea-pod legs.',
  canonStatus: 'series and embedded-segment adaptation',
  lore: lore('Le journal de Groucha et Lola est envahi par les objets fous du feuilleton Léguman, jusqu’à ce que l’antenne elle-même se révolte.', 'Groucha and Lola’s bulletin is invaded by mad objects from the Léguman serial until the broadcast itself revolts.'),
  referenceUrls: [TELECHAT.url, 'https://commons.wikimedia.org/wiki/File%3AT%C3%A9l%C3%A9chat_-_Topor_%C3%A0_la_BNF.jpg', 'https://fr.wikipedia.org/wiki/T%C3%A9l%C3%A9chat', 'https://fr.wikipedia.org/wiki/L%C3%A9guman'],
  hero: character(TELECHAT, 'groucha', 'Groucha', 'hacker', 'Practical black-and-white cat puppet in dark suit and tie, one arm permanently in plaster with its small opening, holding cylindrical silver Mic-Mac with its small wrinkled human face and one large pivoting left ear.', lore('Groucha coprésente Téléchat et commente Léguman avec ironie.', 'Groucha co-presents Téléchat and comments on Léguman with irony.'), 'canonical protagonist', { referenceImages: ['https://commons.wikimedia.org/wiki/File%3AT%C3%A9l%C3%A9chat_-_Topor_%C3%A0_la_BNF.jpg'], simple: 'Mic-Mac Interview', secondary: 'Plaster Pocket', defense: 'Desk Duck', special: 'Object of the Day' }),
  allies: [
    character(TELECHAT, 'lola', 'Lola', 'tactical', 'Practical ostrich puppet in newsroom costume behind the desk, long neck and head aligned with the desk’s hiding hole.', lore('Lola coprésente le journal et cache sa tête dans son bureau lorsqu’elle a peur ou honte.', 'Lola co-presents the news and hides her head in her desk when frightened or embarrassed.'), 'canonical protagonist', { simple: 'Headline Call', secondary: 'Desk-Hole Feint', defense: 'Head Hide', special: 'Breaking Object News' }),
    character(TELECHAT, 'leguman', 'Léguman', 'slayer', 'Deliberately low-budget live-action vegetable hero: pumpkin head, carrot arms, pea-pod legs, blue torso with radish emblem; child-performer scale and muted Super-8 colours.', lore('Léguman combat les objets devenus fous dans le feuilleton intégré à Téléchat.', 'Léguman fights objects gone mad in the serial embedded within Téléchat.'), 'canonical embedded-series hero', { simple: 'Carrot Punch', secondary: 'Pea-Pod Kick', defense: 'Pumpkin Brace', special: 'Les Carottes ne sont pas Cuites' })
  ],
  monsters: [
    threat(TELECHAT, 'mad_vacuum', 'L’Aspirateur fou', 'suction hose', 'Aspiration ménagère', 'Deliberately crude practical vacuum-cleaner costume from a Léguman-like Super-8 street set, grey hose and wobbling body.', lore('L’aspirateur est l’un des premiers objets fous affrontés par Léguman.', 'The vacuum is one of the first mad objects fought by Léguman.'), 'canonical Léguman opponent'),
    threat(TELECHAT, 'mad_blender', 'Le Mixeur fou', 'spinning jug', 'Tourbillon du mixeur', 'Low-budget practical blender monster with translucent jug helmet, blunt foam blades and muted 1980s colours.', lore('Le mixeur reprend un adversaire explicitement montré dans Léguman.', 'The blender returns as an explicitly shown Léguman opponent.'), 'canonical Léguman opponent'),
    threat(TELECHAT, 'mad_trousers', 'Le Pantalon fou', 'walking trouser legs', 'Coup de jambe vide', 'Empty oversized practical trousers walking on their own, worn cloth and child-scale Super-8 street photography.', lore('Le pantalon devenu fou appartient aux adversaires de la troisième saison.', 'The trousers gone mad belong to the third season opponents.'), 'canonical Léguman opponent')
  ],
  bosses: [
    threat(TELECHAT, 'mad_wall', 'Le Mur fou', 'blocking brick facade', 'Impasse totale', 'Deliberately fake practical brick wall on a mundane Belgian street, foam cracks and wobbling panels, no monster face added.', lore('Léguman affronte même un mur dans la deuxième saison.', 'Léguman even faces a wall in the second season.'), 'canonical Léguman opponent'),
    threat(TELECHAT, 'madame_insecte', 'Madame Insecte', 'oversized insect limbs', 'Bourdonnement casqué', 'Child-scale low-budget insect costume from the Léguman segment, dull shell, visible practical seams and no realistic animal gore.', lore('Madame Insecte figure parmi les adversaires nommés du feuilleton.', 'Madame Insecte is among the serial’s named opponents.'), 'canonical Léguman opponent'),
    threat(TELECHAT, 'hypnotikman', 'Hypnotikman', 'hypnotic broadcast spiral', 'Regard hypnotique', 'Deliberately crude practical villain costume with bold spiral disc, muted Super-8 palette and ordinary street backdrop.', lore('Hypnotikman détourne le regard et le rythme du feuilleton.', 'Hypnotikman diverts the serial’s gaze and rhythm.'), 'canonical Léguman opponent')
  ],
  worldBoss: threat(TELECHAT, 'tele_bete_revolt', 'Télé-Bête — Révolte de l’antenne', 'runaway television signal', 'Prime-Time Rampage', 'Practical analogue television-beast inspired by the canonical Télé-Bête opponent, expanded into an original newsroom control stack with antennae, scanlines and visible puppet mechanisms.', lore('La Télé-Bête fournit le noyau canonique ; sa révolte dans le studio est une adaptation de world boss fidèle à la satire des médias.', 'The canonical Télé-Bête provides the core; its newsroom revolt is a world-boss adaptation faithful to the media satire.'), 'canonical opponent in fan-made newsroom setpiece', { layout: 'large', objective: 'Return the Télé-Bête signal to its set, restore the object bulletin and hand the desk back to Groucha and Lola.', objectiveFr: 'Ramener le signal de la Télé-Bête sur son plateau, rétablir le journal des objets puis rendre le bureau à Groucha et Lola.' }),
  stage: 'Studio du journal Téléchat',
  stageMeta: stageMeta(TELECHAT, 'Worn practical 1980s newsroom desk with Lola’s hiding hole, Groucha’s position, analogue cameras, object-sized interview platform and muted studio light.', 'Le studio reste une télévision d’objets réalisée en marionnettes.', 'The studio remains an object television realised with practical puppets.', 'canonical newsroom adaptation'),
  stageVariants: [
    stageVariant('Smash', 'Frigo Palace — Plateau Léguman', 'Hard', 'Hypnotikman', stageMeta(TELECHAT, 'Refrigerator interior opening onto a deliberately crude Super-8 Belgian street set, vegetable spectators behind the door.', 'Le Frigo Palace mène au feuilleton Léguman.', 'Frigo Palace leads into the Léguman serial.', 'canonical embedded-show adaptation')),
    stageVariant('Tactics', 'Tour de diffusion des objets', 'Very Hard', 'Télé-Bête — Révolte de l’antenne', stageMeta(TELECHAT, 'Original analogue broadcast tower assembled from anthropomorphic cables, blank monitors, practical antennae and Gluon-sized access tunnels.', 'La tour prolonge la satire de la télévision des objets sans inventer un nouveau présentateur.', 'The tower extends object-TV satire without inventing a new presenter.', 'fan-made franchise-faithful stage'))
  ],
  gear: [
    gear(TELECHAT, 'mic_mac', 'Mic-Mac Microphone', 'Micro Mic-Mac', { atk: 5, spd: 2 }, 'Canonical cylindrical silver handheld microphone puppet with a small wrinkled human face and one large pivoting left ear; no canine shape or redesign as a modern device.', lore('Mic-Mac écoute les paroles pendant les interviews de Groucha.', 'Mic-Mac listens to speech during Groucha’s interviews.')),
    gear(TELECHAT, 'groucha_plaster', 'Groucha’s Plaster Pocket', 'Plâtre-poche de Groucha', { def: 7, hp: 45 }, 'White practical arm plaster with the canonical small opening used to produce objects, shown without a detached limb.', lore('Le plâtre de Groucha contient toujours l’objet inattendu du reportage.', 'Groucha’s plaster always contains the report’s unexpected object.')),
    gear(TELECHAT, 'radish_emblem', 'Léguman Radish Emblem', 'Écusson radis de Léguman', { atk: 8, hp: 25 }, 'Handmade radish chest emblem on a small blue fabric square, intentionally low-budget and child-scale.', lore('L’écusson fixe l’uniforme végétal du justicier.', 'The emblem locks the vegetable hero uniform.'))
  ],
  event: event(TELECHAT, 'object_of_day', 'Object of the Day', 'Objet fêté du jour', 'Groucha interviews the object, Lola delivers the headline and Léguman removes the mad studio prop.', 'Groucha interviewe l’objet, Lola donne le titre et Léguman neutralise l’accessoire devenu fou.', 'News desk, Mic-Mac ear, small interview pedestal and Léguman silhouette under analogue studio lamps.', 'canonical-format event')
}));
}
