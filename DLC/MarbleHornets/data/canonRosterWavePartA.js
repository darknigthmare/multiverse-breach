// Marble Hornets — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#3a423b", "#050605", "#d8ddd8"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, MARBLE_HORNETS, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "marble_hornets",
    universe: "Marble Hornets",
    mediaType: "webseries",
    faction: "horror",
    mode: "RPG",
    difficulty: "Expert",
    referenceUrl: MARBLE_HORNETS,
    referenceUrls: [MARBLE_HORNETS, "https://marblehornets.wikidot.com/the-entries", "https://en.wikipedia.org/wiki/Marble_Hornets"],
    canonStatus: ADAPTED,
    visualAnchor: "Found-footage Alabama locations, consumer camcorder framing, washed daylight, timestamped MiniDV/VHS noise, blank-faced black-suited Operator and the exact simple masks used in the series; never generic tactical creepypasta.",
    lore: localizedLore("Jay enquête sur les bandes de Marble Hornets avec Tim et Jessica. La série n'a pas de bestiaire ni de ladder de boss: les phénomènes audiovisuels deviennent ici des objectifs de survie clairement adaptés.", "Jay investigates the Marble Hornets tapes with Tim and Jessica. The series has no creature roster or boss ladder: audiovisual phenomena become clearly adapted survival objectives here."),
    hero: hero("mh_jay_merrick", "Jay Merrick", "investigator", MARBLE_HORNETS, "Young documentarian in ordinary layered street clothes carrying a consumer camcorder and tape bag; framed through imperfect handheld footage, not action armor.", CANON, "Jay rassemble les Entries pour comprendre la disparition du tournage d'Alex.", "Jay assembles the Entries to understand what happened to Alex's production.", "Entry Reconstruction"),
    allies: [
      hero("mh_tim_wright", "Tim Wright", "survivor", MARBLE_HORNETS, "Tim in practical dark hoodie or jacket, carrying medication and flashlight; his plain pale mask is only shown in source-context episodes, never as a separate invented character.", CANON, "Tim lutte contre les effets de l'Operator et possède une mémoire fragmentée des événements.", "Tim struggles against the Operator's effects and has fragmented memory of events.", "Symptom Resistance"),
      hero("mh_jessica_locke", "Jessica Locke", "support", MARBLE_HORNETS, "Jessica in ordinary contemporary civilian clothes, filmed with the same natural found-footage lighting and no supernatural redesign.", CANON, "Jessica survit aux événements et aide à préserver les preuves.", "Jessica survives the events and helps preserve evidence.", "Evidence Safeguard")
    ],
    monsters: [
      threat("mh_signal_distortion", "Operator Signal Distortion", "phenomenon", "https://www.hca.westernsydney.edu.au/gmjau/?p=2310", "Horizontal digital tearing, audio dropout, missing frames and overexposed silhouette intruding into raw camcorder footage.", ADAPTED, "La distorsion signale une proximité et désoriente sans devenir un monstre physique.", "Distortion signals proximity and disorients without becoming a physical monster.", "Frame Loss"),
      threat("mh_lost_time", "Lost-Time Episode", "phenomenon", MARBLE_HORNETS, "A familiar room jumps between incompatible timestamps while props and camera position shift between cuts.", ADAPTED, "Le temps perdu fragmente l'objectif et la mémoire de l'équipe.", "Lost time fragments the objective and the team's memory.", "Continuity Break"),
      threat("mh_hostile_archive", "Compromised Tape Archive", "phenomenon", MARBLE_HORNETS, "Stack of labeled tapes, corrupted upload screen and anonymous response footage, kept as media evidence rather than a living entity.", ADAPTED, "Les bandes compromises effacent ou déplacent des indices.", "Compromised tapes erase or relocate clues.", "Evidence Corruption")
    ],
    bosses: [
      threat("mh_alex_kralie", "Alex Kralie", "boss", MARBLE_HORNETS, "Student filmmaker in ordinary jacket and jeans, increasingly exhausted and armed late in the story; retain grounded found-footage presentation.", CANON, "Alex détruit les preuves et s'en prend à ceux qu'il croit liés à l'Operator.", "Alex destroys evidence and attacks people he believes are connected to the Operator.", "Archive Destruction"),
      threat("mh_hooded_figure", "Hooded Figure / Brian", "boss-rival", MARBLE_HORNETS, "Lean figure in a beige hoodie, black ski mask, blue jeans and black gloves, seen at a distance or in abrupt camera movement; never substitute the common fan-art black hoodie.", ADAPTED, "Brian agit comme adversaire circonstanciel de l'enquête; le duel condense ses actions sans le réduire à un sbire.", "Brian becomes an encounter rival to the investigation; the duel condenses his actions without reducing him to a minion.", "Counter-Surveillance"),
      threat("mh_benedict_loop", "Benedict Hall Tape Loop", "boss-phenomenon", MARBLE_HORNETS, "Decayed institutional corridors repeating through hard cuts, identical doorways and changing tape timestamps.", ADAPTED, "Ce boss de puzzle adapte le montage discontinu, sans inventer une nouvelle entité.", "This puzzle boss adapts discontinuous editing without inventing a new entity.", "Impossible Cut")
    ],
    worldBoss: threat("mh_operator", "The Operator", "world-boss-survival", "https://www.hca.westernsydney.edu.au/gmjau/?p=2310", "Extremely tall blank white head above a black business suit, elongated arms, no facial details and no tentacles unless source framing supports only distortion.", CANON, "L'objectif est de filmer, fuir et conserver la preuve; l'Operator n'est pas traité comme un ennemi que l'on tue.", "The objective is to film, escape and preserve evidence; the Operator is not treated as something the player kills.", "Recorded Escape"),
    stage: "Rosswood Park Investigation",
    stageMeta: metadata(MARBLE_HORNETS, "Sparse Alabama woodland, service paths and abandoned structures captured by a consumer camcorder under flat daylight and sudden signal artifacts.", ADAPTED, "La progression dépend des bandes et repères retrouvés.", "Progress depends on recovered tapes and landmarks."),
    stageVariants: [
      stageVariant("RPG", "Benedict Hall Search", "Very Hard", "Benedict Hall Tape Loop", MARBLE_HORNETS, "Empty institutional hallways, stairwells and utility rooms lit only by camcorder exposure and flashlight.", ADAPTED, "Le bâtiment se lit par raccords de bandes plutôt que par une carte stable.", "The building is read through tape continuity rather than a stable map."),
      stageVariant("Smash", "Abandoned Hospital Escape", "Expert", "The Operator", MARBLE_HORNETS, "Derelict hospital rooms and exterior lot in harsh handheld night footage, with signal loss preceding each appearance.", ADAPTED, "La victoire exige une évacuation filmée, pas un combat létal.", "Victory requires a recorded evacuation, not lethal combat.")
    ],
    gear: [
      gear("mh_camcorder", "MiniDV Camcorder", "Caméscope MiniDV", { def: 5, spd: 1 }, MARBLE_HORNETS, "Early-2000s consumer camcorder with flip-out screen, tape bay, timestamp overlay and low-light sensor noise.", CANON, "Le caméscope révèle les raccords et constitue la preuve.", "The camcorder reveals cuts and constitutes evidence."),
      gear("mh_tape_case", "Entry Tape Case", "Boîte de bandes Entry", { hp: 45, def: 5 }, MARBLE_HORNETS, "Worn plastic MiniDV case holding hand-labeled tapes, with labels kept unreadable in generated art.", INSPIRED, "La boîte protège les fragments d'archive récupérés.", "The case protects recovered archive fragments."),
      gear("mh_flashlight", "Pocket Flashlight", "Lampe torche", { spd: 2, def: 4 }, MARBLE_HORNETS, "Small practical flashlight throwing a narrow overexposed beam into found-footage darkness.", CANON, "La lampe éclaire brièvement une sortie sans dissiper les phénomènes.", "The light briefly reveals an exit without dispelling phenomena.")
    ],
    event: event("evt_mh_entry_upload", "Entry Upload", "Mise en ligne de l'Entry", "Jay publishes a recovered segment before interference can erase it, locking one clue into the archive.", "Jay publie un segment récupéré avant que l'interférence ne l'efface, verrouillant un indice dans l'archive.", MARBLE_HORNETS, "Raw upload progress, fragmented timestamp and camcorder frame containing one distant impossible silhouette.", ADAPTED)
  }));
}
