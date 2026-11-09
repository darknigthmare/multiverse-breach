// Rick Astley — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRick() {
  return (Object.freeze({
  key: 'rick_astley',
  universe: 'Rick Astley',
  url: 'https://rickastley.co.uk/'
}));
}

export function createRickAstley({ RICK, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(RICK, {
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
}));
}
