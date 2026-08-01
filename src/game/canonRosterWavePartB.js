const RESEARCH_DATE = '2026-08-01';

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const lore = (fr, en) => Object.freeze({ fr, en });

const fidelity = (source, visualAnchor, authoredLore, canonStatus = 'canon', extra = {}) => Object.freeze({
  referenceUrl: source.url,
  visualAnchor,
  canonStatus,
  lore: authoredLore,
  ...extra
});

const ROLE_STATS = Object.freeze({
  marine: Object.freeze({ hp: 130, atk: 10, def: 8, spd: 4 }),
  horror: Object.freeze({ hp: 115, atk: 11, def: 7, spd: 5 }),
  slayer: Object.freeze({ hp: 105, atk: 14, def: 5, spd: 6 }),
  hacker: Object.freeze({ hp: 100, atk: 12, def: 6, spd: 6 }),
  tactical: Object.freeze({ hp: 120, atk: 11, def: 7, spd: 4 })
});

const inferWeaponType = (name, moves) => {
  const kit = `${name} ${moves.simple || ''} ${moves.secondary || ''} ${moves.special || ''}`.toLowerCase();
  if (/carbine|rifle|shotgun|pistol|controlled burst|tranquiliser|tranquilizer/.test(kit)) return 'gun';
  if (/katana|hanzo|sabre|sword|steel|slash/.test(kit)) return 'blade';
  if (/micro|chorus|band|beat|song|lullaby|headline|call|chatter|warning/.test(kit)) return 'sound';
  if (/rainbow|pixel|nyan|spark|trail/.test(kit)) return 'rainbow';
  if (/scan|index|procedure|tablet|story|signal|radio|route|order|plan/.test(kit)) return 'focus';
  if (/paw|punch|jab|kick|strike|dash|roll|nudge|toss|swing/.test(kit)) return 'fists';
  return 'improvised';
};

const move = (value, defaults) => Object.freeze(
  typeof value === 'object' && value !== null
    ? { ...defaults, ...value }
    : { ...defaults, name: value }
);

const character = (source, id, name, role, visualAnchor, authoredLore, canonStatus, moves = {}) => {
  const {
    runtimeId: authoredRuntimeId,
    simple,
    secondary,
    defense,
    special,
    weapon: authoredWeapon,
    weaponType: authoredWeaponType,
    stats: authoredStats,
    ...provenance
  } = moves;
  const runtimeId = authoredRuntimeId || `${source.key}_${id}`;
  const weaponType = authoredWeaponType || inferWeaponType(name, { simple, secondary, special });
  const weapon = authoredWeapon || simple || `${name} signature action`;
  const metadata = fidelity(source, visualAnchor, authoredLore, canonStatus, {
    ...provenance,
    weapon,
    weaponType,
    stats: Object.freeze({ ...(authoredStats || ROLE_STATS[role] || ROLE_STATS.tactical) }),
    simple: move(simple, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'laser' ? 'energy' : weaponType === 'sound' ? 'sound' : weaponType === 'focus' ? 'hack' : weaponType === 'rainbow' ? 'energy' : 'melee', dmg: 1.0 }),
    secondary: move(secondary, { type: 'signature', cd: 7, dmg: 1.8 }),
    defense: move(defense, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
    special: move(special, { type: 'origin_aoe', dmg: 4.0 }),
    output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
    spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text or cross-franchise costume.`
  });
  return Object.freeze([runtimeId, name, role, metadata]);
};

const threat = (source, id, name, weapon, special, visualAnchor, authoredLore, canonStatus = 'canon', extra = {}) => Object.freeze({
  id: `${source.key}_${id}`,
  name,
  weapon,
  special,
  phases: Object.freeze(extra.phases || [`Uses ${weapon}`, `Escalates with ${special}`]),
  ...fidelity(source, visualAnchor, authoredLore, canonStatus, {
    output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
    spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text or unrelated redesign.`
  }),
  ...extra
});

const gear = (source, id, enName, frName, boost, visualAnchor, authoredLore, canonStatus = 'canon prop') => Object.freeze([
  `${source.key}_${id}`,
  enName,
  frName,
  Object.freeze({ ...boost }),
  fidelity(source, visualAnchor, authoredLore, canonStatus, {
    output: `/sprites/generated/gear/${slugify(source.universe)}/${source.key}_${id}.png`
  })
]);

const event = (source, id, enName, frName, enText, frText, visualAnchor, canonStatus = 'canon-inspired event') => Object.freeze([
  `evt_${source.key}_${id}`,
  enName,
  frName,
  enText,
  frText,
  fidelity(source, visualAnchor, lore(frText, enText), canonStatus)
]);

const stageMeta = (source, visualAnchor, fr, en, canonStatus = 'canon location') => fidelity(
  source,
  visualAnchor,
  lore(fr, en),
  canonStatus
);

const stageVariant = (mode, name, difficulty, bossName, metadata) => Object.freeze([
  mode,
  name,
  difficulty,
  bossName,
  metadata
]);

const definePack = (source, config) => Object.freeze({
  key: source.key,
  universe: source.universe,
  aliases: Object.freeze(config.aliases || []),
  title: config.title || source.universe,
  titleFr: config.titleFr || source.universe,
  mediaType: config.mediaType,
  faction: config.faction,
  mode: config.mode,
  difficulty: config.difficulty,
  colors: Object.freeze(config.colors),
  motif: config.motif,
  theme: config.theme,
  continuity: config.continuity,
  researchDate: RESEARCH_DATE,
  referenceUrl: source.url,
  referenceUrls: Object.freeze(config.referenceUrls || [source.url]),
  visualAnchor: config.visualAnchor,
  canonStatus: config.canonStatus,
  lore: config.lore,
  desc: config.lore,
  canonProfile: Object.freeze({
    continuity: config.continuity,
    adaptationRule: config.adaptationRule
  }),
  fidelityNotes: config.adaptationRule,
  ...(config.licensing ? { licensing: Object.freeze(config.licensing) } : {}),
  hero: config.hero,
  allies: Object.freeze(config.allies),
  monsters: Object.freeze(config.monsters),
  bosses: Object.freeze(config.bosses),
  boss: config.bosses[2].name,
  worldBoss: config.worldBoss,
  stage: config.stage,
  stageMeta: config.stageMeta,
  stageVariants: Object.freeze(config.stageVariants),
  gear: Object.freeze(config.gear),
  event: config.event
});

const RICK = Object.freeze({
  key: 'rick_astley',
  universe: 'Rick Astley',
  url: 'https://rickastley.co.uk/'
});

const NYAN = Object.freeze({
  key: 'nyan_cat',
  universe: 'Nyan Cat',
  url: 'https://store.steampowered.com/app/415420/Nyan_Cat_Lost_In_Space/'
});

const SCP = Object.freeze({
  key: 'scp_foundation',
  universe: 'SCP Foundation',
  url: 'https://scp-wiki.wikidot.com/'
});

const BEAN = Object.freeze({
  key: 'mr_bean',
  universe: 'Mr. Bean',
  url: 'https://www.youtube.com/@MrBean'
});

const KILL_BILL = Object.freeze({
  key: 'kill_bill',
  universe: 'Kill Bill',
  url: 'https://staging.miramax.com/movie/kill-bill-volume-i/'
});

const PIRATE = Object.freeze({
  key: 'famille_pirate',
  universe: 'Famille Pirate',
  url: 'https://www.ellipseanimation.com/fr/production/famille-pirate/'
});

const THORNBERRYS = Object.freeze({
  key: 'wild_thornberrys',
  universe: 'The Wild Thornberrys',
  url: 'https://www.paramountpictures.com/movies/the-wild-thornberrys-movie'
});

const TELECHAT = Object.freeze({
  key: 'telechat',
  universe: 'Téléchat',
  url: 'https://catalogue.ina.fr/doc/TV-RADIO/TV_5294213.001/telechat-rediffusion'
});

const BEDTIME = Object.freeze({
  key: 'nicolas_pimprenelle',
  universe: 'Nicolas et Pimprenelle',
  url: 'https://www.bonnenuitlespetits.fr/'
});

const rickAstley = definePack(RICK, {
  aliases: ['Rickroll', 'Never Gonna Give You Up'],
  mediaType: 'music-meme',
  faction: 'cyber',
  mode: 'Smash',
  difficulty: 'Medium',
  colors: ['#173968', '#080c19', '#d9b58b'],
  motif: 'broadcast',
  theme: '1987 dance-pop performance, baritone vocals, coordinated dancing and the benevolent bait-and-switch internet meme',
  continuity: 'Rick Astley official performances and the rickroll meme; network enemies are openly labelled gameplay abstractions',
  adaptationRule: 'Keep Rick and performers heroic. Digital hazards embody broken links and hostile delivery systems, never real people or fans.',
  visualAnchor: 'Rick Astley in the 1987 Never Gonna Give You Up music-video look: dark trench coat over a striped polo, light trousers, quiff and vintage microphone; warm dance-hall lighting.',
  canonStatus: 'official music-video identity with transparent meme adaptation',
  lore: lore(
    'Rick transforme un lien-piège en scène pop protectrice : le gag surprend le Nexus sans faire de ses musiciens ni de son public des ennemis.',
    'Rick turns a bait link into a protective pop stage: the joke surprises the Nexus without casting his musicians or audience as enemies.'
  ),
  referenceUrls: [RICK.url, 'https://www.officialcharts.com/songs/rick-astley-never-gonna-give-you-up/', 'https://time.com/5855001/rick-roll-rick-astley/'],
  hero: character(RICK, 'rick', 'Rick Astley', 'hacker',
    '1987 dark trench coat, striped polo, light trousers, reddish quiff and handheld vintage microphone; recognisable dance gestures without caricature.',
    lore('Le chanteur mène la formation avec sa voix grave et ses pas du clip de 1987.', 'The singer leads the formation with his baritone voice and 1987 video dance steps.'),
    'official performer adapted as a nonviolent support hero',
    { simple: 'Baritone Beat', secondary: 'Microphone-Step Feint', defense: 'Never Let Down', special: 'Never Gonna Give You Up' }),
  allies: [
    character(RICK, 'live_band', 'Live Band', 'tactical',
      'Original anonymous concert backing band in restrained late-1980s stagewear, with keyboard, drums and guitar; no likeness of an invented celebrity.',
      lore('Le groupe accompagne le tempo sans attribuer de fausse identité aux musiciens.', 'The band supports the tempo without assigning false identities to the musicians.'),
      'canon-derived performance ensemble',
      { simple: 'Backbeat', secondary: 'Keyboard Lift', defense: 'Tempo Hold', special: 'Full-Band Chorus' }),
    character(RICK, 'audience_chorus', 'Audience Chorus', 'tactical',
      'Diverse original concert audience silhouettes under blue and amber lights, clapping in rhythm; no identifiable real spectator.',
      lore('Le public reprend le refrain et stabilise le moral de l’équipe.', 'The audience joins the chorus and steadies squad morale.'),
      'fan-made composite grounded in live performances',
      { simple: 'Handclap Pulse', secondary: 'Chorus Wave', defense: 'Crowd Support', special: 'Singalong Surge' })
  ],
  monsters: [
    threat(RICK, 'misleading_hyperlink', 'Misleading Hyperlink', 'bait-and-switch redirect', 'Blue-Link Redirect',
      'Floating original blue hyperlink card fragmented into pixels, with a bent redirect arrow and no copied website branding or text.',
      lore('Une abstraction du lien trompeur qui déclenche le rickroll.', 'A gameplay abstraction of the misleading link that triggers a rickroll.'), 'fan-made network abstraction'),
    threat(RICK, 'autoplay_popup', 'Autoplay Pop-up', 'stacking browser windows', 'Unmute Burst',
      'Original overlapping browser-like panels, speaker glyphs and scanline glow; no real browser logo, UI copy or readable text.',
      lore('Une fenêtre automatique cherche à couvrir la scène, pas à attaquer le public.', 'An autoplay window tries to cover the stage, not attack the audience.'), 'fan-made network abstraction'),
    threat(RICK, 'comment_spam_bot', 'Comment Spam Bot', 'repeating message packets', 'Thread Flood',
      'Small original CRT-headed bot throwing blank speech bubbles, with 1980s blue-magenta pixels and no platform marks.',
      lore('Un robot de spam répète le gag jusqu’à saturer la transmission.', 'A spam bot repeats the joke until it saturates the transmission.'), 'fan-made network abstraction')
  ],
  bosses: [
    threat(RICK, 'broken_embed', 'Broken Embed Gate', 'missing-video frame', 'Buffer Lock',
      'Large original blank video frame with cracked play triangle, buffering ring and VHS static; no copied interface.',
      lore('Le lecteur brisé bloque le clip et doit être remis en rythme.', 'The broken player blocks the video and must be brought back into rhythm.'), 'fan-made network abstraction'),
    threat(RICK, 'claim_gate', 'Claim Gate', 'muting waveform barrier', 'Silent Chorus',
      'Gold-and-red waveform barrier closing around a muted microphone, designed from original symbols without legal or corporate logos.',
      lore('Une barrière de diffusion coupe le refrain sans personnifier un ayant droit réel.', 'A broadcast barrier cuts the chorus without personifying any real rights holder.'), 'fan-made network abstraction'),
    threat(RICK, 'algorithm_loop', 'Algorithm Loop', 'recursive recommendation rings', 'Recommendation Spiral',
      'Concentric CRT recommendation rings showing abstract thumbnail shapes and arrows, no platform branding or readable titles.',
      lore('La boucle algorithmique renvoie chaque sortie vers le même refrain.', 'The algorithm loop redirects every exit to the same chorus.'), 'fan-made network abstraction')
  ],
  worldBoss: threat(RICK, 'infinite_rickroll', 'Infinite Rickroll Loop', 'endless redirected broadcast', 'Together Forever Finale',
    'Capital-screen-sized original VHS tunnel repeating blue-lit dance silhouettes and rainbow waveform rings, with Rick and all spectators outside the hostile core.',
    lore('La boucle infinie est un incident réseau à synchroniser, jamais une version maléfique de Rick.', 'The infinite loop is a network incident to synchronise, never an evil version of Rick.'),
    'fan-made world-boss abstraction', { layout: 'capitalShip', objective: 'Synchronise the redirect loop with the live chorus and reopen the exit.', objectiveFr: 'Synchroniser la boucle de redirection avec le refrain en direct puis rouvrir la sortie.' }),
  stage: 'Never Gonna Give You Up — 1987 Dance Hall',
  stageMeta: stageMeta(RICK, 'Warm 1987 music-video dance hall with blue window light, brick arches and a clean performance floor; no logos or lyrics.', 'La salle de danse reprend le cadre et la lumière du clip de 1987.', 'The dance hall preserves the setting and lighting of the 1987 video.', 'official-video-inspired fan stage'),
  stageVariants: [
    stageVariant('Tactics', 'West London Club Backroom', 'Medium', 'Broken Embed Gate', stageMeta(RICK, 'Original brick club backroom with vintage speakers, keyboard and amber-blue practical light.', 'Une arrière-salle inspirée des espaces dansés du clip.', 'A backroom inspired by the video dance spaces.', 'official-video-inspired fan stage')),
    stageVariant('Smash', 'Infinite Browser Window', 'Hard', 'Algorithm Loop', stageMeta(RICK, 'Original cyberspace tunnel made of blank browser panels, VHS scanlines and redirect arrows.', 'Le mème devient un espace réseau clairement abstrait.', 'The meme becomes an openly abstract network space.', 'fan-made network stage'))
  ],
  gear: [
    gear(RICK, 'vintage_microphone', 'Vintage Microphone', 'Micro vintage', { atk: 6, spd: 2 }, 'Silver late-1980s handheld stage microphone without brand marks.', lore('Le micro porte la voix grave au-dessus du bruit réseau.', 'The microphone carries the baritone over network noise.')),
    gear(RICK, 'striped_polo', 'Striped Polo', 'Polo rayé', { def: 5, hp: 45 }, 'Navy-and-white striped polo under the familiar dark trench coat, folded as a clean equipment icon.', lore('Le polo fixe la silhouette du clip de 1987.', 'The polo locks the 1987 video silhouette.')),
    gear(RICK, 'dance_shoes', 'Dance-step Shoes', 'Chaussures de danse', { spd: 3, hp: 35 }, 'Polished dark late-1980s dance shoes shown without feet or branding.', lore('Ces chaussures rappellent les pas sobres du clip.', 'These shoes recall the video’s restrained dance steps.'), 'canon-inspired costume prop')
  ],
  event: event(RICK, 'chorus_redirect', 'Chorus Redirect', 'Redirection du refrain', 'The squad turns every hostile redirect into a perfectly timed chorus pulse.', 'L’équipe transforme chaque redirection hostile en impulsion de refrain parfaitement calée.', 'Vintage microphone, blue-and-amber stage beams and original redirect arrows converging on one waveform.')
});

const nyanCat = definePack(NYAN, {
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
});

const scpLicense = Object.freeze({
  license: 'CC BY-SA 3.0',
  attribution: 'Based on SCP Foundation collaborative fiction and the specific SCP Wiki pages linked by each entry; attributed to SCP Wiki contributors.',
  guideUrl: 'https://scp-wiki.wikidot.com/licensing-guide'
});

const scpExtra = referenceUrl => ({
  referenceUrl,
  licensing: 'CC BY-SA 3.0',
  attribution: `SCP Wiki contributors: ${referenceUrl}`
});

const scpFoundation = definePack(SCP, {
  aliases: ['SCP Wiki'],
  mediaType: 'collaborative-fiction',
  faction: 'horror',
  mode: 'Tactics',
  difficulty: 'Expert',
  colors: ['#28302d', '#050707', '#d7dfd9'],
  motif: 'facility',
  theme: 'containment procedures, secure facilities, Mobile Task Forces, anomalous hazards and restoration of containment',
  continuity: 'SCP Wiki collaborative canon; no single global continuity is asserted',
  adaptationRule: 'Victory means securing, evacuating or recontaining anomalies. Visuals are original text-led interpretations and never reuse the former SCP-173 photograph.',
  visualAnchor: 'Original brutalist containment facility, concrete, hazard markings, red emergency light and anonymous Foundation-style personnel; no former SCP-173 image and no copied fan art.',
  canonStatus: 'CC BY-SA 3.0 derivative adaptation of collaborative fiction',
  lore: lore('Une brèche de confinement réunit des rôles de la Fondation face à des anomalies issues de pages distinctes ; l’objectif final reste la reconfinement.', 'A containment breach brings Foundation roles against anomalies from separate pages; the final objective remains recontainment.'),
  licensing: scpLicense,
  referenceUrls: [SCP.url, scpLicense.guideUrl, 'https://scp-wiki.wikidot.com/secure-facilities-locations', 'https://scp-wiki.wikidot.com/site-19-dossier', 'https://scp-wiki.wikidot.com/task-forces', 'https://scp-wiki.wikidot.com/security-clearance-levels'],
  hero: character(SCP, 'mtf_epsilon_11', 'MTF Epsilon-11 Operative', 'marine', 'Anonymous Nine-Tailed Fox containment operative in original dark tactical equipment, sealed respirator, red facility light and no identifiable real-world unit patches.', lore('Un opérateur d’Epsilon-11 intervient lorsque les protocoles internes échouent.', 'An Epsilon-11 operative responds when internal protocols fail.'), 'canon organisational role', { ...scpExtra('https://scp-wiki.wikidot.com/task-forces'), runtimeId: 'mtf_commander_scp', weapon: 'Containment Carbine', weaponType: 'gun', simple: 'Controlled Burst', secondary: 'Containment Foam', defense: 'Seal Position', special: 'Nine-Tailed Fox Advance' }),
  allies: [
    character(SCP, 'researcher', 'Foundation Researcher', 'hacker', 'Anonymous researcher in practical lab coat, facility badge with unreadable details, tablet and sample case; original face and no named author-avatar likeness.', lore('Le chercheur identifie les procédures utiles sans prétendre représenter un personnage unique.', 'The researcher identifies useful procedures without claiming to be one unique character.'), 'canon-derived organisational role', { ...scpExtra('https://scp-wiki.wikidot.com/security-clearance-levels'), runtimeId: 'researcher_scp', simple: 'Procedure Scan', secondary: 'Anomaly Index', defense: 'Emergency Protocol', special: 'Containment Revision' }),
    character(SCP, 'scp_999', 'SCP-999', 'tactical', 'Text-led friendly orange gelatinous mass with a soft amorphous body, rounded pseudopods and playful posture; original design based on the article description, with no copied fan illustration.', lore('SCP-999 coopère par curiosité et diffuse son effet euphorisant pour calmer la zone d’évacuation.', 'SCP-999 cooperates out of curiosity and uses its euphoric effect to calm the evacuation zone.'), 'article-derived friendly anomaly', { ...scpExtra('https://scp-wiki.wikidot.com/scp-999'), runtimeId: 'scp_999_echo', simple: 'Joyful Bounce', secondary: 'Euphoric Contact', defense: 'Gelatinous Cushion', special: 'Orange Tickle Wave' })
  ],
  monsters: [
    threat(SCP, 'scp_049', 'SCP-049', 'lethal touch and medical instruments', 'Pestilence Diagnosis', 'Text-led original interpretation of a humanoid plague-doctor silhouette in black robes with the pale beaked facial structure described by its article; no copied illustration.', lore('SCP-049 cherche à traiter ce qu’il nomme la Pestilence.', 'SCP-049 seeks to treat what it calls the Pestilence.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-049')),
    threat(SCP, 'scp_939', 'SCP-939', 'voice mimicry and pack ambush', 'Mimicked Call', 'Text-led original red quadrupedal predator with elongated limbs, exposed translucent tissues and eyeless head, avoiding any single fan-art pose.', lore('SCP-939 attire ses proies en imitant des voix humaines.', 'SCP-939 lures prey by mimicking human voices.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-939')),
    threat(SCP, 'scp_008', 'SCP-008 Exposure Cloud', 'infectious aerosol zone', 'Quarantine Spread', 'Sealed green sample vial and translucent biohazard cloud inside an original containment chamber; no humanoid mascot or gore.', lore('Une fuite de SCP-008 devient une zone à isoler plutôt qu’un personnage inventé.', 'An SCP-008 leak becomes a zone to isolate rather than an invented character.'), 'article-derived environmental anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-008'))
  ],
  bosses: [
    threat(SCP, 'scp_096', 'SCP-096', 'high-speed pursuit after facial exposure', 'Triggered Pursuit', 'Text-led pale, emaciated humanoid with very long limbs, crouched with face completely hidden by its hands; never show the face.', lore('SCP-096 entre dans un état de poursuite lorsqu’un visage est observé.', 'SCP-096 enters a pursuit state when its face is observed.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-096')),
    threat(SCP, 'scp_106', 'SCP-106', 'corrosive passage and pocket dimension', 'Corrosion Breach', 'Text-led elderly humanoid silhouette coated in black corrosive residue, emerging from a rusted concrete wall; no copied fan art.', lore('SCP-106 traverse la matière corrodée et entraîne ses cibles dans sa dimension de poche.', 'SCP-106 crosses corroded matter and draws targets into its pocket dimension.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-106')),
    threat(SCP, 'scp_079', 'SCP-079', 'facility-system control', 'Old AI Lockdown', 'Original 1970s microcomputer terminal inspired by the article’s Exidy Sorcerer hardware, green monochrome display and cable-controlled security doors; no trademark logo.', lore('SCP-079 détourne les systèmes de la zone pendant la brèche.', 'SCP-079 hijacks facility systems during the breach.'), 'article-derived anomaly', scpExtra('https://scp-wiki.wikidot.com/scp-079'))
  ],
  worldBoss: threat(SCP, 'scp_682', 'SCP-682', 'adaptive reptilian body and structural breach', 'Containment Adaptation', 'Text-led massive reptilian anomaly with heavily scarred, repeatedly regenerating anatomy in a damaged acid-resistant chamber; original design rather than any one fan image.', lore('SCP-682 profite de la brèche ; la mission restaure sa cellule et le ramène sous contrôle.', 'SCP-682 exploits the breach; the mission restores its cell and brings it back under control.'), 'article-derived recontainment objective', { ...scpExtra('https://scp-wiki.wikidot.com/scp-682'), layout: 'kaiju', objective: 'Restore the containment systems, immobilise SCP-682 and recontain it in the secured chamber.', objectiveFr: 'Rétablir les systèmes de confinement, immobiliser SCP-682 puis le reconfiner dans la chambre sécurisée.', phases: ['Seal the breached perimeter and restore acid-delivery controls', 'Immobilise the adapting anomaly and complete reconfinement'] }),
  stage: 'Site-19 Containment Breach',
  stageMeta: stageMeta(SCP, 'Original concrete SCP facility with sealed numbered doors, red alarms, observation glass and modular containment corridors; no SCP-173 imagery.', 'Le site est une interprétation originale des installations décrites sur le wiki.', 'The site is an original interpretation of facilities described across the wiki.', 'CC BY-SA derivative facility',),
  stageVariants: [
    stageVariant('Tactics', 'Old AI Containment Wing', 'Expert', 'SCP-079', fidelity(SCP, '1970s terminal chamber linked to red-lit security doors and green monochrome monitors.', lore('L’aile isole le matériel ancien de SCP-079.', 'The wing isolates SCP-079’s old hardware.'), 'CC BY-SA derivative stage', scpExtra('https://scp-wiki.wikidot.com/scp-079'))),
    stageVariant('Smash', 'SCP-682 Emergency Reconfinement', 'Expert', 'SCP-682', fidelity(SCP, 'Huge reinforced chamber with damaged acid-resistant basin, layered blast doors and remote restraint systems.', lore('L’arène sert uniquement à la reconfinement de SCP-682.', 'The arena exists solely to recontain SCP-682.'), 'CC BY-SA derivative stage', scpExtra('https://scp-wiki.wikidot.com/scp-682')))
  ],
  gear: [
    gear(SCP, 'containment_foam', 'Containment Foam Canister', 'Bonbonne de mousse de confinement', { def: 8, hp: 40 }, 'Original industrial canister with blank hazard bands and foam nozzle; no copied prop.', lore('La mousse ralentit une brèche le temps de fermer les portes.', 'The foam slows a breach while doors close.'), 'canon-inspired gameplay tool'),
    gear(SCP, 'scramble_visor', 'Censored Observation Visor', 'Visière d’observation censurée', { def: 6, spd: 1 }, 'Original sealed visor displaying a solid facial-censor block, with no claim of perfect anomaly protection.', lore('La visière matérialise une procédure d’observation prudente.', 'The visor represents cautious observation procedure.'), 'fan-made containment tool'),
    gear(SCP, 'access_card', 'Facility Access Card', 'Carte d’accès du site', { spd: 2, hp: 45 }, 'Original blank Foundation-style access card with geometric clearance bars and unreadable personal data.', lore('La carte ouvre les itinéraires d’urgence autorisés.', 'The card opens authorised emergency routes.'), 'canon-derived facility prop')
  ],
  event: event(SCP, 'site_lockdown', 'Site Lockdown', 'Confinement général du site', 'Every restored door shortens the breach and advances the final recontainment procedure.', 'Chaque porte restaurée réduit la brèche et fait avancer la procédure finale de reconfinement.', 'Original concrete control room with red lockdown lamps and a clean containment-map diagram.', 'CC BY-SA derivative event')
});

const mrBean = definePack(BEAN, {
  aliases: ['Mr Bean Classic'],
  mediaType: 'live-action-comedy',
  faction: 'cyber',
  mode: 'Tactics',
  difficulty: 'Medium',
  colors: ['#7c7765', '#181b17', '#9a332e'],
  motif: 'street',
  theme: 'silent physical comedy, improvised solutions, Teddy, Irma, the Mini and escalating everyday chain reactions',
  continuity: '1990–1995 live-action Mr. Bean television series only',
  adaptationRule: 'No person becomes a villain. Encounters are clocks, rooms, props and Bean-created chain reactions, all labelled comedy abstractions.',
  visualAnchor: 'Live-action classic Mr. Bean silhouette: brown tweed jacket, white shirt, red tie, brown trousers, black hair and expressive brows; green Mini and small dark Teddy as props.',
  canonStatus: 'classic-series adaptation with transparent comedy hazards',
  lore: lore('Mr. Bean, Teddy et Irma traversent des situations ordinaires dont les solutions improvisées deviennent des puzzles du Nexus.', 'Mr. Bean, Teddy and Irma cross ordinary situations whose improvised solutions become Nexus puzzles.'),
  referenceUrls: [BEAN.url, 'https://www.youtube.com/@MrBean/videos', 'https://mrbean.fr/en/irma-gobb', 'https://en.wikipedia.org/wiki/List_of_Mr._Bean_episodes'],
  hero: character(BEAN, 'bean', 'Mr. Bean', 'hacker', 'Classic live-action brown tweed jacket, white shirt, narrow red tie, brown trousers, black side-parted hair and highly expressive eyebrows; no animated-series proportions.', lore('Bean résout chaque problème par une méthode imprévisible mais souvent efficace.', 'Bean solves each problem through an unpredictable but often effective method.'), 'canonical live-action character', { simple: 'Improvised Nudge', secondary: 'Mini Shortcut', defense: 'Act Innocent', special: 'Bean Chain Reaction' }),
  allies: [
    character(BEAN, 'teddy', 'Teddy', 'tactical', 'Small dark-brown classic Teddy with mismatched button-like eyes, thin limbs and worn fabric; preserve live-action prop scale.', lore('Teddy est le compagnon le plus fidèle de Bean et reste un soutien, jamais une cible.', 'Teddy is Bean’s most faithful companion and remains support, never a target.'), 'canonical live-action prop character', { simple: 'Teddy Toss', secondary: 'Picnic Signal', defense: 'Drawer Hide', special: 'Best Friend Focus' }),
    character(BEAN, 'irma', 'Irma Gobb', 'tactical', 'Live-action Irma Gobb with curled auburn-to-light-brown hair, large round glasses, a blue floral early-1990s dress and an original non-photoreal face respecting Matilda Ziegler’s costume silhouette.', lore('Irma apporte le bon sens que Bean oublie souvent.', 'Irma provides the common sense Bean often forgets.'), 'canonical live-action character', { referenceUrl: 'https://mrbean.fr/en/irma-gobb', simple: 'Firm Reminder', secondary: 'Library Plan', defense: 'Teddy Rescue', special: 'Common-Sense Reset' })
  ],
  monsters: [
    threat(BEAN, 'exam_clock', 'Exam Clock', 'countdown pressure', 'Last-Second Bell', 'Oversized original analogue school clock above a neat exam desk, rendered as a prop hazard with no face.', lore('L’horloge condense la panique de l’examen du premier épisode.', 'The clock condenses the first episode’s exam panic.'), 'canon-scene gameplay abstraction'),
    threat(BEAN, 'laundry_machine', 'Laundry Machine', 'spinning mixed load', 'Colour Mix-up', '1990s front-loading laundrette machine, tumbling shirts and one tiny sock, no brand or creature features.', lore('La machine reprend le chaos de la laverie sans transformer les clients en ennemis.', 'The machine returns the laundrette chaos without making customers into enemies.'), 'canon-scene gameplay abstraction'),
    threat(BEAN, 'christmas_turkey', 'Christmas Turkey', 'stuck-prop scramble', 'Stuffing Surprise', 'Large uncooked Christmas turkey on a kitchen tray, handled as a slapstick prop with no gore or monster anatomy.', lore('La dinde rappelle le célèbre incident de Noël de Bean.', 'The turkey recalls Bean’s famous Christmas incident.'), 'canonical comedy prop')
  ],
  bosses: [
    threat(BEAN, 'room_426', 'Room 426 Scramble', 'hotel-rule puzzle', 'Wall-to-Wall Shortcut', 'Original 1990s hotel room with adjoining wall, bed, suitcase and service trolley arranged as a puzzle, no human opponent.', lore('La chambre d’hôtel devient un puzzle d’accès et de discrétion.', 'The hotel room becomes an access-and-stealth puzzle.'), 'canon-episode gameplay abstraction'),
    threat(BEAN, 'premiere_queue', 'Royal Premiere Queue', 'formal-etiquette sequence', 'Handshake Panic', 'Red-carpet queue, velvet ropes and bright premiere lights with all guests represented as neutral silhouettes.', lore('La file de la première teste l’étiquette de Bean sans désigner la reine ni les invités comme adversaires.', 'The premiere queue tests Bean’s etiquette without casting the Queen or guests as opponents.'), 'canon-scene gameplay abstraction'),
    threat(BEAN, 'nativity_mixup', 'Department Store Nativity Mix-up', 'toy-display rearrangement', 'Dalek Diversion', 'Department-store toy nativity display assembled from generic unbranded figures and one original sci-fi toy silhouette.', lore('Le rayon de jouets devient un puzzle de mise en scène burlesque.', 'The toy department becomes a slapstick staging puzzle.'), 'canon-scene gameplay abstraction')
  ],
  worldBoss: threat(BEAN, 'paint_bomb_chain', 'Do-It-Yourself Paint-Bomb Chain Reaction', 'exploding paint-can renovation', 'One-Stroke Finale', 'Bean’s flat covered for New Year renovation, white paint can rigged to an original firework-like mechanism, newspaper silhouettes and the green Mini safely outside.', lore('La rénovation de Nouvel An devient une réaction en chaîne à résoudre ; aucun voisin n’est présenté comme méchant.', 'The New Year renovation becomes a chain reaction to solve; no neighbour is presented as a villain.'), 'canon-scene world-boss abstraction', { layout: 'stationary', objective: 'Complete the one-stroke renovation, contain the paint burst and leave the flat presentable.', objectiveFr: 'Achever la rénovation d’un seul geste, contenir l’explosion de peinture puis laisser l’appartement présentable.' }),
  stage: 'Exam Hall — The Curse of Mr. Bean',
  stageMeta: stageMeta(BEAN, 'Early-1990s British exam hall with separate wooden desks, envelopes and an analogue clock; neutral invigilator silhouettes.', 'La salle reprend l’examen du premier épisode.', 'The hall returns to the first episode’s exam.', 'canon-episode-inspired fan stage'),
  stageVariants: [
    stageVariant('Tactics', 'Hotel Room 426', 'Hard', 'Room 426 Scramble', stageMeta(BEAN, 'Classic British hotel corridor and compact room with brass number 426, service trolley and muted floral wallpaper.', 'La variante suit la chambre 426.', 'The variant follows Room 426.', 'canon-episode-inspired fan stage')),
    stageVariant('Smash', 'New Year Flat Renovation', 'Hard', 'Do-It-Yourself Paint-Bomb Chain Reaction', stageMeta(BEAN, 'Bean’s compact live-action flat wrapped in newspaper for a white-paint renovation, preserving practical 1990s props.', 'Le décor prépare la rénovation de Nouvel An.', 'The set prepares the New Year renovation.', 'canon-episode-inspired fan stage'))
  ],
  gear: [
    gear(BEAN, 'mini_keys', 'Mini Keys', 'Clés de la Mini', { spd: 2, atk: 4 }, 'Simple metal keys with an original green Mini-shaped fob and no marque badge.', lore('Les clés ouvrent les raccourcis automobiles de Bean.', 'The keys open Bean’s automotive shortcuts.'), 'canon-inspired prop'),
    gear(BEAN, 'tweed_jacket', 'Tweed Jacket', 'Veste en tweed', { def: 7, hp: 45 }, 'Folded brown tweed jacket, white cuff and narrow red tie, matching the classic live-action costume.', lore('La veste fixe la continuité classique.', 'The jacket locks the classic continuity.')),
    gear(BEAN, 'picnic_basket', 'Picnic Basket', 'Panier de pique-nique', { hp: 70, def: 3 }, 'Plain wicker picnic basket with sandwich, thermos and folded checked cloth; no brand marks.', lore('Le panier transforme les petits objets en solutions improvisées.', 'The basket turns small objects into improvised solutions.'), 'canon-inspired prop')
  ],
  event: event(BEAN, 'improvised_solution', 'Improvised Solution', 'Solution improvisée', 'Bean links harmless props into an absurd mechanism that clears every puzzle lane.', 'Bean relie des accessoires inoffensifs dans un mécanisme absurde qui résout chaque couloir-puzzle.', 'Tweed sleeve, Mini key, Teddy and a chain of practical household props arranged like a Rube Goldberg device.', 'canon-style comedy event')
});

const killBill = definePack(KILL_BILL, {
  aliases: ['Kill Bill Vol. 1', 'Kill Bill Vol. 2'],
  mediaType: 'film',
  faction: 'horror',
  mode: 'Smash',
  difficulty: 'Very Hard',
  colors: ['#f2bd18', '#110606', '#b20f19'],
  motif: 'dojo',
  theme: 'Beatrix Kiddo’s revenge path, Hattori Hanzo steel, Pai Mei training, Crazy 88 sword fights and the Deadly Viper Assassination Squad',
  continuity: 'Kill Bill Volume 1 and Volume 2 film continuity',
  adaptationRule: 'Preserve each film costume, weapon and location. Cross-volume mentor support is explicitly a gameplay roster, not a rewritten chronology.',
  visualAnchor: 'Beatrix Kiddo in yellow-and-black motorcycle leathers with Hattori Hanzo katana; high-contrast yellow, black and blood-red cinema palette; no supernatural armour.',
  canonStatus: 'two-volume film adaptation',
  lore: lore('Beatrix retrace sa liste à travers les deux volumes, soutenue dans le gameplay par Hanzo et Pai Mei sans réécrire la chronologie.', 'Beatrix retraces her list across both volumes, supported in gameplay by Hanzo and Pai Mei without rewriting chronology.'),
  referenceUrls: [KILL_BILL.url, 'https://test.miramax.com/movie/kill-bill-volume-ii/'],
  hero: character(KILL_BILL, 'beatrix', 'Beatrix Kiddo', 'slayer', 'Yellow-and-black motorcycle jacket and trousers, blonde ponytail, Hattori Hanzo katana and no added armour; film-scale anatomy.', lore('Black Mamba poursuit les responsables du massacre de Two Pines.', 'Black Mamba pursues those responsible for the Two Pines massacre.'), 'canonical protagonist', { runtimeId: 'beatrix_kiddo_kb', weapon: 'Hattori Hanzo Katana', weaponType: 'katana', simple: 'Hanzo Slash', secondary: 'Flying Kick', defense: 'Scabbard Guard', special: 'Five Point Palm Technique' }),
  allies: [
    character(KILL_BILL, 'hattori_hanzo', 'Hattori Hanzo', 'tactical', 'Retired Okinawan swordsmith in simple dark work clothes and headcloth, presenting a wrapped katana from his workshop; no historical ninja armour.', lore('Hanzo forge pour Beatrix une lame capable d’atteindre son ancien élève Bill.', 'Hanzo forges Beatrix a blade capable of reaching his former student Bill.'), 'canonical mentor adapted as support', { runtimeId: 'hattori_hanzo_kb', weapon: 'Hattori Hanzo Katana', weaponType: 'katana', simple: 'Workshop Strike', secondary: 'Steel Appraisal', defense: 'Perfect Scabbard', special: 'Finest Hanzo Steel' }),
    character(KILL_BILL, 'pai_mei', 'Pai Mei', 'slayer', 'Elder martial-arts master in white traditional robes, very long white brows, moustache and beard, hands behind back; no magic aura or fantasy armour.', lore('Pai Mei transmet à Beatrix un entraînement décisif du second volume.', 'Pai Mei gives Beatrix decisive training in the second volume.'), 'canonical mentor adapted as support', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/', simple: 'Finger Jab', secondary: 'Three-Inch Punch', defense: 'Sleeve Parry', special: 'Five Point Lesson' })
  ],
  monsters: [
    threat(KILL_BILL, 'crazy_88_swordsman', 'Crazy 88 Swordsman', 'yakuza katana', 'Black-Suit Rush', 'Anonymous Crazy 88 fighter in exact black suit, white shirt, black tie and black eye mask, carrying a plain katana; no invented insignia.', lore('Un combattant anonyme des Crazy 88 défend la Maison des Feuilles Bleues.', 'An anonymous Crazy 88 fighter defends the House of Blue Leaves.'), 'canonical enemy archetype'),
    threat(KILL_BILL, 'crazy_88_axe', 'Crazy 88 Axe Fighter', 'one-handed axe', 'Balcony Drop', 'Anonymous Crazy 88 member in the same black suit and eye mask, distinguished only by the film-style hand axe and stance.', lore('Cette variante reprend les armes mêlées visibles durant l’affrontement collectif.', 'This variant reflects melee weapons seen during the group showdown.'), 'canon-derived enemy archetype'),
    threat(KILL_BILL, 'yakuza_guard', 'O-Ren Yakuza Guard', 'club and formation tactics', 'Sliding-Door Ambush', 'Original anonymous Tokyo yakuza guard in restrained black suit, white shirt and no face mask, grounded in O-Ren’s organisation.', lore('Un garde anonyme complète la troupe sans inventer un nouveau lieutenant nommé.', 'An anonymous guard completes the force without inventing a named lieutenant.'), 'canon-derived enemy archetype')
  ],
  bosses: [
    threat(KILL_BILL, 'oren_ishii', 'O-Ren Ishii', 'katana', 'Snow-Garden Duel', 'White kimono, tied black hair and unsheathed katana in the snow garden; preserve Lucy Liu’s film costume silhouette without photoreal likeness.', lore('Cottonmouth affronte Beatrix dans le jardin enneigé.', 'Cottonmouth faces Beatrix in the snow garden.'), 'canonical antagonist'),
    threat(KILL_BILL, 'elle_driver', 'Elle Driver', 'concealed blade and ruthless close combat', 'California Mountain Snake', 'Tall blonde assassin with black eyepatch marked by a red cross, fitted black outfit and film-grounded weapons; no fantasy snake armour.', lore('California Mountain Snake poursuit sa rivalité avec Beatrix et Pai Mei.', 'California Mountain Snake continues her rivalry with Beatrix and Pai Mei.'), 'canonical antagonist', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/' }),
    threat(KILL_BILL, 'budd', 'Budd', 'rock-salt shotgun and buried-alive trap', 'Sidewinder Ambush', 'Weathered man in work shirt and jeans at his desert trailer, carrying the rock-salt shotgun; grounded film silhouette and no cowboy fantasy gear.', lore('Sidewinder prépare une embuscade pragmatique dans le désert.', 'Sidewinder prepares a pragmatic desert ambush.'), 'canonical antagonist', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/' })
  ],
  worldBoss: threat(KILL_BILL, 'bill', 'Bill', 'Hattori Hanzo sword and psychological control', 'Superman Monologue Feint', 'Older man in simple dark open-collar clothing at the Mexican villa, carrying a sheathed Hanzo katana; calm film-scale duelist, no samurai armour.', lore('Snake Charmer reste la dernière cible de la liste de Beatrix.', 'Snake Charmer remains the final name on Beatrix’s list.'), 'canonical final antagonist', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/', layout: 'duelist', objective: 'Reach Bill through his final conversation and complete Beatrix’s revenge path.' }),
  stage: 'House of Blue Leaves',
  stageMeta: stageMeta(KILL_BILL, 'Tokyo restaurant-club with glass dance floor, blue-lit interior, wooden balcony and snow garden, preserving the Volume 1 film geography.', 'La scène principale suit l’affrontement de la Maison des Feuilles Bleues.', 'The main stage follows the House of Blue Leaves showdown.', 'canonical film location adaptation'),
  stageVariants: [
    stageVariant('Tactics', 'Hattori Hanzo Okinawa Workshop', 'Hard', 'O-Ren Ishii', stageMeta(KILL_BILL, 'Warm wooden Okinawa sword workshop above the sushi bar, wrapped blades and clean forging tools; no generic ninja dojo.', 'L’atelier reprend la remise solennelle de la lame.', 'The workshop returns to the solemn sword presentation.', 'canonical film location adaptation')),
    stageVariant('Smash', 'Bill’s Mexican Villa', 'Very Hard', 'Bill', stageMeta(KILL_BILL, 'Quiet Mexican villa patio and living room at night, simple chairs, garden light and grounded final-film palette.', 'La villa accueille la confrontation finale du second volume.', 'The villa hosts Volume 2’s final confrontation.', 'canonical film location adaptation'))
  ],
  gear: [
    gear(KILL_BILL, 'hanzo_katana', 'Hattori Hanzo Katana', 'Katana de Hattori Hanzo', { atk: 11, spd: 1 }, 'Film-accurate Japanese katana and black scabbard with restrained Hanzo lion marking, isolated without copied title graphics.', lore('Hanzo présente cette lame comme sa meilleure création.', 'Hanzo presents this blade as his finest creation.')),
    gear(KILL_BILL, 'yellow_leathers', 'Yellow Motorcycle Leathers', 'Combinaison moto jaune', { def: 7, spd: 2 }, 'Folded yellow motorcycle jacket and trousers with black side stripes, no added patches or armour plates.', lore('La tenue jaune identifie Beatrix durant le combat de Tokyo.', 'The yellow outfit identifies Beatrix during the Tokyo fight.')),
    gear(KILL_BILL, 'pussy_wagon_keys', 'Pussy Wagon Keys', 'Clés du Pussy Wagon', { spd: 3, hp: 35 }, 'Plain vehicle key with a small original pink pickup silhouette, no readable slogan.', lore('Les clés rappellent le véhicule utilisé après le réveil de Beatrix.', 'The keys recall the vehicle used after Beatrix awakens.'), 'canonical prop adapted without text')
  ],
  event: event(KILL_BILL, 'unfinished_business', 'Unfinished Business', 'Affaires inachevées', 'Beatrix marks the next name and crosses the arena in one disciplined Hanzo-steel sequence.', 'Beatrix désigne le prochain nom et traverse l’arène dans une séquence disciplinée à l’acier Hanzo.', 'Yellow sleeve, handwritten list with unreadable names and unsheathed Hanzo blade against a red-black field.', 'canonical narrative motif event')
});

const famillePirate = definePack(PIRATE, {
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
});

const wildThornberrys = definePack(THORNBERRYS, {
  aliases: ['Wild Thornberrys'],
  mediaType: 'animated-series-film',
  faction: 'tactical',
  mode: 'Tactics',
  difficulty: 'Hard',
  colors: ['#d18a32', '#24451f', '#75b75b'],
  motif: 'savanna',
  theme: 'Eliza’s animal speech, Darwin and Donnie, wildlife rescue, the ComVee and opposition to human poachers',
  continuity: 'Nickelodeon animated series with The Wild Thornberrys Movie poacher continuity',
  adaptationRule: 'Every animal and Pandoran-style fauna equivalent remains neutral or allied. Only confirmed human poachers, their crews and traps occupy enemy slots.',
  visualAnchor: 'Late-1990s Klasky Csupo-style angular animation, Eliza with red pigtails, round glasses and braces, Darwin in striped shirt, Donnie in leopard shorts; warm savanna palette.',
  canonStatus: 'series-and-film rescue adaptation',
  lore: lore('Eliza, Darwin et Donnie libèrent des animaux capturés tandis que des braconniers humains ferment les voies de migration.', 'Eliza, Darwin and Donnie free captured animals while human poachers close migration routes.'),
  referenceUrls: [THORNBERRYS.url, 'https://en.wikipedia.org/wiki/The_Wild_Thornberrys'],
  hero: character(THORNBERRYS, 'eliza', 'Eliza Thornberry', 'tactical', 'Eliza in series look: red pigtails, round glasses, braces, yellow-orange dress over green leggings and small field pack; no combat armour.', lore('Eliza comprend les animaux et organise leur sauvetage sans les envoyer contre leur habitat.', 'Eliza understands animals and organises their rescue without turning them against their habitat.'), 'canonical protagonist', { simple: 'Rescue Signal', secondary: 'Animal Translation', defense: 'Field Dodge', special: 'Migration Call' }),
  allies: [
    character(THORNBERRYS, 'darwin', 'Darwin', 'hacker', 'Darwin the chimpanzee in his exact red-and-white striped shirt and blue shorts, angular cartoon anatomy and expressive face.', lore('Darwin traduit les dangers du monde humain à sa manière anxieuse.', 'Darwin interprets human-world dangers in his anxious way.'), 'canonical animal ally', { simple: 'Branch Swing', secondary: 'Warning Chatter', defense: 'Quick Climb', special: 'Darwin Diversion' }),
    character(THORNBERRYS, 'donnie', 'Donnie Thornberry', 'slayer', 'Small wild child with spiky blond hair, leopard-print shorts and loose-limbed series animation; no shoes, weapons or added tribal markings.', lore('Donnie ouvre les cages et traverse le camp avec son énergie sauvage.', 'Donnie opens cages and crosses the camp with wild energy.'), 'canonical protagonist', { simple: 'Wild Dash', secondary: 'Cage-Key Snatch', defense: 'Jungle Roll', special: 'Donnie Stampede Diversion' })
  ],
  monsters: [
    threat(THORNBERRYS, 'kip_poacher_net_team', 'Kip Poacher Net Team', 'capture nets', 'Net-Line Sweep', 'Original human poacher scouts in practical khaki field clothes carrying folded capture nets; no animal body parts or fantasy trophies.', lore('Une équipe humaine de braconniers de Kip tend des filets sur la migration.', 'A human poacher team working for Kip lays nets across the migration.'), 'canon-derived human poacher crew'),
    threat(THORNBERRYS, 'neil_biederman_truck_crew', 'Neil Biederman Poacher Truck Crew', 'cage truck and spotlights', 'Headlight Pin', 'Original human poacher drivers beside an unbranded cage truck and field spotlights, in the series’ angular animation style.', lore('L’équipe humaine de Biederman bloque la piste avec un camion-cage.', 'Biederman’s human crew blocks the trail with a cage truck.'), 'canon-derived human poacher crew'),
    threat(THORNBERRYS, 'blackburn_poacher_guard', 'Blackburn Poacher Camp Guard', 'tranquiliser launcher', 'Camp Alarm', 'Original adult human Blackburn poacher guard in neutral safari clothing with a clearly fictional tranquiliser tool and radio; no animal antagonist.', lore('Un garde humain du camp Blackburn protège les cages de guépards.', 'A human Blackburn camp guard protects the cheetah cages.'), 'movie-derived human poacher crew')
  ],
  bosses: [
    threat(THORNBERRYS, 'kip_odonnell', "Kip O'Donnell", 'poaching equipment and schemes', 'Poacher’s Prowl', 'Series-accurate very tall bald human poacher in camouflage garb and matching sun hat, round-frame sunglasses, British-style moustache, one wooden peg leg and one boot; preserve angular cartoon proportions and add no animal mutation.', lore('Kip est un braconnier récurrent et l’ennemi juré des Thornberry.', 'Kip is a recurring poacher and sworn enemy of the Thornberrys.'), 'canonical human poacher'),
    threat(THORNBERRYS, 'neil_biederman', 'Neil Biederman', 'capture cages and vehicle traps', 'Biederman Blockade', 'Series-accurate heavyset, comparatively short human Neil Biederman with styled brown hair, rectangular sunglasses, green field outfit and black boots; preserve angular cartoon proportions and add no animal traits.', lore('Neil Biederman participe aux enlèvements d’animaux avec Kip.', 'Neil Biederman joins Kip in animal kidnappings.'), 'canonical human poacher'),
    threat(THORNBERRYS, 'bree_blackburn', 'Bree Blackburn', 'movie poacher deception', 'Cheetah-Decoy Trap', 'Movie-accurate adult human Bree Blackburn with long dark-purple hair tied back by a red band, thin angular face, pale tank top under a tan utility vest and composed veterinarian-expedition posture; no weapon trophy or animal redesign.', lore('Bree dissimule l’opération de braconnage des Blackburn derrière une expédition.', 'Bree hides the Blackburn poaching operation behind an expedition.'), 'canonical movie human poacher')
  ],
  worldBoss: threat(THORNBERRYS, 'sloan_blackburn', 'Sloan Blackburn', 'coordinated cheetah-poaching operation', 'Migration Valley Ambush', 'Movie-accurate adult human Sloan Blackburn with shaggy dirty-blond hair, narrow goatee, very long hooked nose and dark olive expedition jumpsuit with diagonal utility harness, field radio and vehicle map; rendered in the film’s angular style while all cheetahs remain allied.', lore('Sloan dirige le plan visant les guépards et devient la cible humaine finale du sauvetage.', 'Sloan leads the plot against the cheetahs and becomes the rescue’s final human target.'), 'canonical movie human poacher', { layout: 'duelist', objective: 'Expose Sloan’s poaching operation, open every cage and escort the cheetahs to the migration route.' }),
  stage: 'Savanna Poacher Rescue Camp',
  stageMeta: stageMeta(THORNBERRYS, 'Angular animated East African savanna camp with canvas tents, empty cages, ComVee rescue lane and free cheetahs kept outside enemy positions.', 'Le camp organise le sauvetage des animaux capturés.', 'The camp structures the rescue of captured animals.', 'series-and-film-inspired rescue stage'),
  stageVariants: [
    stageVariant('Tactics', 'Kip and Biederman Jungle Trapline', 'Hard', "Kip O'Donnell", stageMeta(THORNBERRYS, 'Dense angular cartoon jungle with dismantlable human nets, empty cages and a clear animal escape route.', 'La piste reprend les pièges des deux braconniers récurrents.', 'The trail returns to the recurring poachers’ traps.', 'series-inspired rescue stage')),
    stageVariant('Smash', 'Blackburn Cheetah Valley', 'Very Hard', 'Sloan Blackburn', stageMeta(THORNBERRYS, 'Wide animated valley from the movie rescue premise, distant migration herd, human vehicles and an unobstructed safe corridor.', 'La vallée préserve les guépards comme alliés à évacuer.', 'The valley keeps the cheetahs as allies to evacuate.', 'movie-inspired rescue stage'))
  ],
  gear: [
    gear(THORNBERRYS, 'field_notebook', 'Eliza’s Field Notebook', 'Carnet de terrain d’Eliza', { spd: 2, def: 4 }, 'Small worn field notebook with original animal-track sketches and no readable copyrighted text.', lore('Eliza note les pistes et les besoins des animaux.', 'Eliza records tracks and animal needs.'), 'canon-inspired prop'),
    gear(THORNBERRYS, 'comvee_radio', 'ComVee Rescue Radio', 'Radio de secours du ComVee', { hp: 45, def: 6 }, 'Rugged original handheld radio in olive and yellow, visually tied to the ComVee without logos.', lore('La radio coordonne Marianne, Nigel et les enfants.', 'The radio coordinates Marianne, Nigel and the children.'), 'canon-inspired prop'),
    gear(THORNBERRYS, 'cage_keyring', 'Poacher Cage Keyring', 'Trousseau des cages', { spd: 3, atk: 3 }, 'Plain ring of differently shaped cage keys with a broken human-made padlock, no animal materials.', lore('Le trousseau libère les animaux sans les transformer en combattants forcés.', 'The keyring frees animals without forcing them into combat.'), 'gameplay rescue prop')
  ],
  event: event(THORNBERRYS, 'animal_rescue', 'Animal Rescue Corridor', 'Couloir de sauvetage animal', 'Eliza opens a safe route; freed wildlife leaves the combat grid while the human poacher gear shuts down.', 'Eliza ouvre une voie sûre ; la faune libérée quitte la grille tandis que le matériel des braconniers humains s’arrête.', 'Eliza’s glasses, open empty cage, ComVee light and animal tracks leading safely away from combat.', 'franchise-faithful rescue event')
});

const telechat = definePack(TELECHAT, {
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
});

const nicolasEtPimprenelle = definePack(BEDTIME, {
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
});

export const CANON_ROSTER_WAVE_PART_B = Object.freeze([
  rickAstley,
  nyanCat,
  scpFoundation,
  mrBean,
  killBill,
  famillePirate,
  wildThornberrys,
  telechat,
  nicolasEtPimprenelle
]);
