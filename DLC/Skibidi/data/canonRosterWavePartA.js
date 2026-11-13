// Skibidi — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#182330", "#05080b", "#70d7ff"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, SKIBIDI, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "skibidi",
    universe: "Skibidi",
    mediaType: "webseries",
    faction: "cyber",
    mode: "Smash",
    difficulty: "Expert",
    referenceUrl: SKIBIDI,
    canonStatus: INSPIRED,
    visualAnchor: "DaFuq!?Boom! original series only: ruined concrete cities, black-suited hardware-headed Alliance agents, oversized Titans, porcelain Skibidi bodies and late-series dark metallic Astro units; exclude DOM Studio and other fan multiverses.",
    lore: localizedLore("Les Titans de l'Alliance affrontent d'abord les Skibidi Toilets puis l'invasion Astro. Cette sélection suit l'arc Astro: G-Toilet n'est donc pas placé comme boss actuel lorsqu'il combat les Astros.", "The Alliance Titans first fight the Skibidi Toilets and later the Astro invasion. This selection follows the Astro arc, so G-Toilet is not placed as a current boss while fighting the Astros."),
    hero: hero("cameraman_skibidi", "Cameraman", "operator", SKIBIDI, "Standard Alliance agent in a black suit, white shirt and tie, with a CCTV camera head and blue lens; human-sized and distinct from Titan Cameraman.", CANON, "Le Cameraman documente le front et combat comme unité standard de l'Alliance.", "The Cameraman records the front and fights as a standard Alliance unit.", "Lens Flash"),
    allies: [
      hero("speakerman_skibidi", "Speakerman", "operator", SKIBIDI, "Human-sized Alliance agent in a fitted black suit with a black loudspeaker head and red speaker cone, using directed sound rather than Titan-scale weapons.", CANON, "Le Speakerman repousse les Toilets par des impulsions sonores coordonnées.", "The Speakerman pushes Toilets back with coordinated sound pulses.", "Bass Pulse"),
      hero("tvman_skibidi", "TV Man", "operator", SKIBIDI, "Human-sized black-suited Alliance agent with rectangular CRT television head, dark screen and restrained purple glow; distinct from Titan TV Man's bulky multi-screen form.", CANON, "Le TV Man utilise son écran et la téléportation de fumée violette sans emprunter de pouvoirs extérieurs.", "The TV Man uses his screen and purple-smoke teleportation without importing outside powers.", "Purple Screen")
    ],
    monsters: [
      threat("skibidi_basic_toilet", "Skibidi Toilet", "swarm", SKIBIDI, "Human male head emerging from a white ceramic toilet, exaggerated singing face and no unrelated monster anatomy.", CANON, "L'unité de base attaque en nombre au rythme du chant Skibidi.", "The basic unit attacks in numbers to the Skibidi chant.", "Singing Rush"),
      threat("skibidi_mutant", "Mutant Skibidi Toilet", "heavy", SKIBIDI, "Large Skibidi head and torso integrated into an armored mechanical toilet body with humanoid limbs and mounted equipment, matching late original-series designs.", CANON, "Le Mutant apporte blindage et combat rapproché.", "The Mutant brings armor and close combat.", "Armored Charge"),
      threat("skibidi_astro_trooper", "Astro Trooper", "air", SKIBIDI, "Dark-metal floating toilet craft with human head, red-orange ocular glow, armored shell and circular gravity-propulsion hardware.", CANON, "Le soldat Astro frappe à très haute vitesse depuis les airs.", "The Astro trooper strikes at extreme speed from the air.", "Gravity Dash")
    ],
    bosses: [
      threat("skibidi_scientist_mech", "Scientist Toilet Mech", "boss", SKIBIDI, "Enormous multi-legged mechanical body piloted by Scientist Toilet, packed with screens, claws, lasers and decoy systems from the laboratory battle.", CANON, "Le Mech combine leurres, contrôle parasite et systèmes lourds du laboratoire.", "The Mech combines decoys, parasite control and heavy laboratory systems.", "Laboratory Arsenal"),
      threat("skibidi_detainer_astro", "Detainer Astro Toilet", "boss", SKIBIDI, "Armored floating Astro with three long articulated mechanical detainer claws, dark shell and red-orange gravity glow.", CANON, "Detainer saisit les projectiles et les retourne contre leur source.", "Detainer catches projectiles and sends them back.", "Detainer Claws"),
      threat("skibidi_juggernaut_astro", "Juggernaut Astro Toilet", "boss", SKIBIDI, "Massive heavily armored Astro with broad dark helmet, red-lit face and oversized kinetic energy cannon/gauntlet.", CANON, "Juggernaut résiste aux Titans et répond par des impacts cinétiques lourds.", "Juggernaut withstands Titans and answers with heavy kinetic impacts.", "Kinetic Cannon")
    ],
    worldBoss: threat("skibidi_mothership_astro", "Mothership Astro Toilet", "world-boss", SKIBIDI, "Colossal disk-like Astro mothership filling the skyline, concentric dark-metal gravity rings, red-orange lights and deployment bays; no fan-series redesign.", CANON, "L'Alliance doit interrompre les vagues de déploiement et survivre au champ gravitationnel du Mothership.", "The Alliance must interrupt deployment waves and survive the Mothership's gravity field.", "Astro Deployment"),
    stage: "Camera City Alliance Defense",
    stageMeta: metadata(SKIBIDI, "Ruined boulevard lined with concrete towers, Alliance agents in black suits, camera emplacements and giant footprints, rendered in the original Source-filmmaker language.", INSPIRED, "La défense rassemble l'Alliance avant l'arrivée des unités Astro.", "The defense rallies the Alliance before Astro units arrive."),
    stageVariants: [
      stageVariant("Tactics", "Scientist Toilet Laboratory", "Very Hard", "Scientist Toilet Mech", SKIBIDI, "Underground industrial laboratory with parasite tanks, screens, concrete tunnels and the Scientist's huge multi-legged mech.", INSPIRED, "Le raid coupe les parasites et expose les leurres du Scientist.", "The raid cuts parasite production and exposes the Scientist's decoys."),
      stageVariant("Smash", "Astro Invasion Megacity", "Expert", "Mothership Astro Toilet", SKIBIDI, "Night megacity under red-orange gravity trails, dark Astro formations and a colossal mothership above the Alliance line.", INSPIRED, "L'arc tardif oppose Alliance et survivants Skibidi aux Astros.", "The late arc pits the Alliance and Skibidi survivors against the Astros.")
    ],
    gear: [
      gear("skibidi_camera_lens_shield", "Camera Lens Shield", "Bouclier de lentille Camera", { def: 8, hp: 35 }, SKIBIDI, "Blue-tinted reinforced protective lens mounted over a Cameraman head, with mechanical shutter and no human face.", CANON, "La lentille réduit les attaques visuelles dirigées contre les Cameras.", "The lens reduces visual attacks directed at Cameras."),
      gear("skibidi_speaker_array", "Speaker Array", "Batterie de haut-parleurs", { atk: 9, spd: 1 }, SKIBIDI, "Stacked black loudspeaker modules with red cones mounted as Alliance sonic hardware.", CANON, "La batterie libère une onde sonique concentrée.", "The array releases a concentrated sonic wave."),
      gear("skibidi_tv_energy_blade", "TV Energy Blade", "Lame d'énergie TV", { atk: 11, def: 3 }, SKIBIDI, "Retractable mechanical forearm blade edged in purple TV energy, matching upgraded Titan TV Man equipment.", CANON, "La lame violette coupe le blindage Astro à courte portée.", "The purple blade cuts Astro armor at close range.")
    ],
    event: event("evt_skibidi_alliance_signal", "Alliance Signal", "Signal de l'Alliance", "Camera, Speaker and TV forces synchronize their channels for one coordinated Titan counterattack.", "Les forces Camera, Speaker et TV synchronisent leurs canaux pour une contre-attaque coordonnée des Titans.", SKIBIDI, "Blue camera beams, red speaker waves and purple TV light converging above the ruined city without adding outside factions.", ADAPTED)
  }));
}
