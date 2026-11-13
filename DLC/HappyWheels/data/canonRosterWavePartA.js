// Happy Wheels — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#7d99ad", "#252b31", "#d84343"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, HAPPY_WHEELS, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "happy_wheels",
    universe: "Happy Wheels",
    mediaType: "game",
    faction: "comic",
    mode: "Race",
    difficulty: "Expert",
    referenceUrl: HAPPY_WHEELS,
    referenceUrls: [HAPPY_WHEELS, "https://apps.apple.com/us/app/happy-wheels/id648668184"],
    canonStatus: ADAPTED,
    visualAnchor: "Happy Wheels side-view physics course: clean Flash-era shapes, wheeled characters, ragdoll joints, spikes, mines, harpoons and finish flag; no invented lore faction.",
    lore: localizedLore("Happy Wheels ne possède ni armée ennemie ni hiérarchie de boss canonique: les menaces et boss ci-dessous sont uniquement des parcours d'obstacles crossover-adaptation.", "Happy Wheels has no canonical enemy army or boss hierarchy: every threat and boss below is only a crossover-adaptation obstacle course."),
    hero: hero("hw_wheelchair_guy", "Wheelchair Guy", "racer", HAPPY_WHEELS, "Elderly man with gray hair in a blue motorized wheelchair, green shirt and brown trousers, using the source side-view ragdoll proportions.", CANON, "Wheelchair Guy mise sur l'accélération motorisée et l'équilibre.", "Wheelchair Guy relies on powered acceleration and balance.", "Jet Boost"),
    allies: [
      hero("hw_business_guy", "Business Guy", "racer", HAPPY_WHEELS, "Office worker in gray business suit and helmet standing upright on a two-wheeled personal transporter, preserving the official mobile roster's side profile.", CANON, "Business Guy corrige son inclinaison pour franchir les plateformes.", "Business Guy corrects his lean to cross platforms.", "Precision Lean"),
      hero("hw_irresponsible_dad", "Irresponsible Dad", "racer", HAPPY_WHEELS, "Helmeted father in green shirt riding a bicycle with his helmeted son seated behind, both retained as one source character unit.", CANON, "Le vélo conserve le duo père-fils et sa physique de poids arrière.", "The bicycle preserves the father-son duo and its rear-weight physics.", "Bicycle Hop")
    ],
    monsters: [
      threat("hw_spike_strip", "Spike Strip", "hazard", HAPPY_WHEELS, "Row of tall gray triangular spikes embedded in a simple platform, with clear side-view collision silhouette.", ADAPTED, "Ce piège canonique devient une menace de parcours, pas une créature.", "This canonical trap becomes a course threat, not a creature.", "Ragdoll Puncture"),
      threat("hw_harpoon_turret", "Harpoon Turret", "hazard", HAPPY_WHEELS, "Compact gray wall launcher firing a tethered steel harpoon across a 2D lane.", ADAPTED, "Le lance-harpon déclenche sur la ligne de vue.", "The harpoon launcher triggers on line of sight.", "Tether Shot"),
      threat("hw_landmine", "Landmine Cluster", "hazard", HAPPY_WHEELS, "Small circular Happy Wheels mines spaced along a flat platform, readable warning geometry and Flash-era palette.", ADAPTED, "Les mines punissent la vitesse sans contrôle.", "Mines punish uncontrolled speed.", "Physics Blast")
    ],
    bosses: [
      threat("hw_wrecking_course", "Wrecking-Ball Course", "boss-hazard", HAPPY_WHEELS, "Multiple huge gray wrecking balls swinging on chains through one side-view obstacle lane.", ADAPTED, "Ce boss est un gauntlet d'objets physiques, sans personnalité inventée.", "This boss is a physical-object gauntlet with no invented personality.", "Pendulum Gauntlet"),
      threat("hw_harpoon_gauntlet", "Harpoon Gauntlet", "boss-hazard", HAPPY_WHEELS, "Stacked harpoon launchers covering alternating high and low lanes around breakable glass.", ADAPTED, "Le rythme des tirs remplace un duel de personnage.", "Shot timing replaces a character duel.", "Crossfire Course"),
      threat("hw_crusher_machine", "Crusher Machine", "boss-hazard", HAPPY_WHEELS, "Large piston crusher, rotating blades and moving platform combined as a source-style mechanical finish trial.", ADAPTED, "Le joueur bat la machine en atteignant le drapeau, pas en lui donnant une vie fictive.", "The player beats the machine by reaching the flag, not by assigning it fictional life.", "Finish-Line Crush")
    ],
    worldBoss: threat("hw_impossible_course", "The Impossible Course", "world-boss-course", HAPPY_WHEELS, "Long side-view finale combining cannons, spikes, mines, wrecking balls, harpoons and a distant checkered finish flag.", ADAPTED, "Le world boss est explicitement un niveau crossover-adaptation et non un antagoniste canonique.", "The world boss is explicitly a crossover-adaptation level, not a canonical antagonist.", "One-Life Finish"),
    stage: "Community Obstacle Course",
    stageMeta: metadata(HAPPY_WHEELS, "Neutral gray-blue user-level backdrop, platforms, boost pads, finish flag and physics props in the original browser game's side-view language.", ADAPTED, "Le stage rassemble des obstacles canoniques sans prétendre adapter un niveau officiel précis.", "The stage combines canonical hazards without claiming to reproduce one specific official level."),
    stageVariants: [
      stageVariant("Race", "Rooftop Harpoon Run", "Very Hard", "Harpoon Gauntlet", HAPPY_WHEELS, "Side-view city rooftops linked by glass bridges, harpoon launchers and boost arrows.", ADAPTED, "Une course crossover construite avec les outils de niveau connus.", "A crossover race built from familiar level tools."),
      stageVariant("Smash", "Industrial Crusher Finish", "Expert", "Crusher Machine", HAPPY_WHEELS, "Factory-like 2D corridor of pistons, spinning blades, mines and one finish flag; deliberately a user-level adaptation.", ADAPTED, "Le drapeau reste la condition de victoire.", "The flag remains the victory condition.")
    ],
    gear: [
      gear("hw_helmet", "Safety Helmet", "Casque de sécurité", { def: 6, hp: 35 }, HAPPY_WHEELS, "Simple rounded character helmet in source flat shading, chipped through ragdoll impacts.", ADAPTED, "Le casque amortit un choc de parcours.", "The helmet cushions one course impact."),
      gear("hw_boost_pad", "Boost Pad", "Accélérateur", { spd: 3, atk: 3 }, HAPPY_WHEELS, "Bright floor arrow boost pad matching user-level editor props.", ADAPTED, "L'accélérateur donne l'élan nécessaire à un saut.", "The boost supplies momentum for a jump."),
      gear("hw_checkpoint_flag", "Checkpoint Flag", "Drapeau de contrôle", { hp: 55, def: 3 }, HAPPY_WHEELS, "Small checkered side-view finish/checkpoint flag on a thin pole, no added logo.", ADAPTED, "Le drapeau sécurise la dernière section franchie.", "The flag secures the last cleared section.")
    ],
    event: event("evt_hw_ragdoll_replay", "Ragdoll Replay", "Replay ragdoll", "Time rewinds to the last checkpoint and preserves the failed run as a translucent physics ghost.", "Le temps revient au dernier contrôle et conserve l'échec sous forme de fantôme physique translucide.", HAPPY_WHEELS, "Flash-era slow-motion replay of a wheeled character and separated physics props, framed as game simulation rather than story canon.", ADAPTED)
  }));
}
