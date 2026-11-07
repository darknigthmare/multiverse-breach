// Trololo — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#68442b", "#17100b", "#d6a934"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, TROLOLO, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "trololo",
    universe: "Trololo",
    mediaType: "music-meme",
    faction: "music",
    mode: "Smash",
    difficulty: "Hard",
    referenceUrl: TROLOLO,
    canonStatus: ADAPTED,
    visualAnchor: "Respectful archival television performance inspired by Eduard Khil: warm studio light, brown suit and tie, curtain backdrop, vintage broadcast softness and wordless baritone vocalise; no violent caricature of the real singer.",
    safetyNote: "Eduard Khil is a real artist. He is a non-combat performer; all opposition is abstract broadcast or rhythm failure marked crossover-adaptation.",
    lore: localizedLore("Trololo vient de la vocalise interprétée par Eduard Khil et devenue mème. Il n'existe aucun ennemi ou boss canonique: le roster transforme uniquement les incidents de scène et de diffusion en défis musicaux.", "Trololo comes from Eduard Khil's wordless vocalise and its later meme life. It has no canonical enemies or bosses: the roster turns only stage and broadcast failures into musical challenges."),
    hero: hero("trololo_eduard_khil", "Eduard Khil — Archival Performer", "performer", TROLOLO, "Respectful adult baritone performer in source brown suit, white shirt and tie, smiling on a vintage TV stage with natural human proportions and no combat pose.", CANON, "L'interprète porte la scène par le souffle, le sourire et la vocalise sans paroles.", "The performer carries the stage through breath, smile and wordless vocalise.", "Baritone Vocalise"),
    allies: [
      hero("trololo_tv_orchestra", "Television Orchestra", "support", TROLOLO, "Abstract respectful vintage studio ensemble represented by music stands, strings and brass in warm archival lighting, never armed.", ADAPTED, "L'orchestre maintient tempo et harmonie autour de la voix.", "The orchestra holds tempo and harmony around the voice.", "Studio Accompaniment"),
      hero("trololo_audience_chorus", "Audience Chorus", "support", TROLOLO, "Diverse smiling audience silhouettes under soft 1970s television light, joining only through harmless humming and clapping.", ADAPTED, "Le public prolonge la mélodie comme phénomène participatif du mème.", "The audience extends the melody as the meme's participatory echo.", "Shared Refrain")
    ],
    monsters: [
      threat("trololo_dead_air", "Dead Air", "broadcast-hazard", TROLOLO, "Silent waveform flattening on a vintage broadcast monitor while the stage remains intact.", ADAPTED, "Le silence forcé brise la chaîne de notes mais n'incarne aucune personne ennemie.", "Forced silence breaks the note chain but represents no enemy person.", "Mute Measure"),
      threat("trololo_tape_dropout", "Tape Dropout", "broadcast-hazard", TROLOLO, "Archival film/tape frame with white dropout streaks, rolling picture and brief audio loss.", ADAPTED, "La perte de bande efface un segment qu'il faut reconstruire au rythme.", "Tape loss erases a segment that must be rebuilt in rhythm.", "Missing Bars"),
      threat("trololo_tempo_drift", "Tempo Drift", "rhythm-hazard", TROLOLO, "Metronome and waveform gradually separating over the same warm television stage.", ADAPTED, "La dérive décale les entrées sans créer de faux antagoniste.", "Drift offsets cues without creating a false antagonist.", "Offbeat Pull")
    ],
    bosses: [
      threat("trololo_broadcast_interference", "Broadcast Interference", "boss-hazard", TROLOLO, "Stacked analog static bands and doubled archival image obscuring the performer but never deforming his likeness grotesquely.", ADAPTED, "Le défi consiste à garder la vocalise audible dans le brouillage.", "The challenge is keeping the vocalise audible through interference.", "Signal Hold"),
      threat("trololo_endless_repeat", "Endless Repeat", "boss-hazard", TROLOLO, "Vintage editing deck looping one short reel segment, circular tape path and repeating waveform.", ADAPTED, "La boucle teste la variation rythmique plutôt qu'un combat.", "The loop tests rhythmic variation rather than combat.", "Loop Variation"),
      threat("trololo_silent_stage", "Silent Stage", "boss-hazard", TROLOLO, "Empty warm-lit curtain stage, disconnected microphone and orchestra lights awaiting a perfectly timed restart.", ADAPTED, "L'ensemble rétablit la scène par une entrée commune.", "The ensemble restores the stage with a shared entrance.", "Cued Return")
    ],
    worldBoss: threat("trololo_global_vocalise", "Global Vocalise Loop", "world-boss-event", TROLOLO, "World map of harmless broadcast screens joining the same smiling archival performance and colorful synchronized waveforms.", ADAPTED, "Le world boss est un marathon de rythme célébrant la diffusion mondiale du mème, jamais une menace attribuée à l'artiste.", "The world boss is a rhythm marathon celebrating the meme's worldwide reach, never a threat attributed to the artist.", "Worldwide Refrain"),
    stage: "Vintage Television Vocalise",
    stageMeta: metadata(TROLOLO, "Warm 1970s television set with curtain, floor microphone, brown-suited baritone and softly blurred analog image.", ADAPTED, "Le stage reproduit l'ambiance de performance, pas une biographie fictive.", "The stage reproduces the performance atmosphere, not a fictional biography."),
    stageVariants: [
      stageVariant("Tactics", "Archival Tape Restoration", "Very Hard", "Broadcast Interference", TROLOLO, "Broadcast restoration desk beside split-screen clean and damaged archival frames, with waveform and reel controls.", ADAPTED, "Le joueur recale image, souffle et mélodie.", "The player realigns picture, breath and melody."),
      stageVariant("Smash", "Worldwide Meme Chorus", "Expert", "Global Vocalise Loop", TROLOLO, "Respectful mosaic of audience screens humming the refrain around the original warm studio center.", ADAPTED, "La variante célèbre les reprises sans les faire passer pour du canon narratif.", "The variant celebrates remixes without presenting them as narrative canon.")
    ],
    gear: [
      gear("trololo_stage_microphone", "Vintage Stage Microphone", "Micro de scène vintage", { atk: 3, def: 6 }, TROLOLO, "Period silver broadcast microphone on a slim floor stand under warm studio light.", ADAPTED, "Le micro stabilise la chaîne vocale.", "The microphone stabilizes the vocal chain."),
      gear("trololo_brown_suit", "Archival Brown Suit", "Costume brun d'archive", { def: 5, hp: 40 }, TROLOLO, "Respectful source brown two-piece suit, white shirt and tie displayed as performance wardrobe, not armor.", CANON, "La tenue ancre la silhouette immédiatement reconnaissable de la prestation.", "The wardrobe anchors the performance's instantly recognizable silhouette."),
      gear("trololo_master_reel", "Restored Master Reel", "Bobine master restaurée", { spd: 2, def: 7 }, TROLOLO, "Labeled archival reel in a protective case with abstract waveform and no fabricated official logo.", ADAPTED, "La bobine restaure une mesure perdue.", "The reel restores one lost measure.")
    ],
    event: event("evt_trololo_crescendo", "Wordless Crescendo", "Crescendo sans paroles", "The performer, orchestra and audience sustain the famous vocalise together until the broadcast signal clears.", "L'interprète, l'orchestre et le public tiennent ensemble la célèbre vocalise jusqu'au retour du signal.", TROLOLO, "Smiling brown-suited archival performer centered in warm light as clean colorful waveforms expand through vintage screens.", ADAPTED)
  }));
}
