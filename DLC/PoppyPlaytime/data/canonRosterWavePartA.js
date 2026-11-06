// Poppy Playtime — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#254f88", "#090d18", "#e63c42"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, POPPY, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "poppy_playtime",
    universe: "Poppy Playtime",
    mediaType: "game",
    faction: "horror",
    mode: "RPG",
    difficulty: "Very Hard",
    referenceUrl: POPPY,
    canonStatus: INSPIRED,
    visualAnchor: "Playtime Co. toy factory: cheerful primary-color toy branding over rusted industrial corridors, VHS terminals and GrabPack puzzles; never a generic circus or dollhouse.",
    referenceUrls: [POPPY, "https://store.steampowered.com/app/4100940/Poppy_Playtime__Chapter_5/"],
    lore: localizedLore(
      "L'ancien employé revient dans l'usine abandonnée de Playtime Co.; Poppy et Kissy Missy l'aident à survivre aux expériences vivantes et à remonter jusqu'au Prototype.",
      "The former employee returns to abandoned Playtime Co.; Poppy and Kissy Missy help the player survive living experiments and trace the disaster back to the Prototype."
    ),
    hero: hero("poppy_player", "The Player", "hacker", POPPY, "Faceless former Playtime Co. employee seen in first person. For the required full-body game sheet, use an explicitly original Nexus proxy: featureless shadowed face, non-branded orange industrial coveralls, red-and-blue GrabPack hands and VHS-era equipment; only the GrabPack and first-person role are canonical.", ADAPTED, "Le corps n'étant pas défini à l'écran, cette silhouette originale sert uniquement de proxy de gameplay; aucune identité ni apparence canonique n'est inventée.", "Because the on-screen body is undefined, this original silhouette is only a gameplay proxy; no canonical identity or appearance is asserted.", "GrabPack Circuit"),
    allies: [
      hero("poppy_doll", "Poppy", "tactical", POPPY, "Small porcelain doll, pale face, freckles, red curled pigtails, blue dress with puff sleeves, black shoes and source-accurate doll proportions.", CANON, "Poppy connaît l'usine et guide le joueur, mais garde ses propres objectifs.", "Poppy knows the factory and guides the player while retaining her own agenda.", "Factory Guidance"),
      hero("kissy_missy", "Kissy Missy", "guardian", POPPY, "Very tall pink plush toy with long limbs, yellow mitten hands and feet, large black eyes and the same wide-lipped toy silhouette as Huggy Wuggy.", CANON, "Kissy Missy intervient comme alliée compatissante sans devenir une combattante générique.", "Kissy Missy acts as a compassionate ally rather than a generic fighter.", "Rescue Reach")
    ],
    monsters: [
      threat("mini_huggies", "Mini Huggies", "swarm", POPPY, "Small red, blue, green and yellow long-limbed plush Huggies emerging from the Whack-a-Wuggy tunnels.", CANON, "Les Mini Huggies attaquent en essaim depuis les tunnels du Game Station.", "Mini Huggies swarm from the Game Station tunnels.", "Tunnel Swarm"),
      threat("bunzo_bunny", "Bunzo Bunny", "ambusher", POPPY, "Yellow rabbit toy with green party overalls, cymbals and long ears, descending on a cable during Musical Memory.", CANON, "Bunzo descend lorsque la séquence musicale échoue.", "Bunzo descends when the Musical Memory sequence fails.", "Cymbal Drop"),
      threat("smiling_critters", "Mini Smiling Critters", "pack", POPPY, "Small plush-scale brightly colored Smiling Critters with fixed mascot smiles, kept toy-sized and grouped as the hostile Playcare swarm rather than enlarged into invented nightmare beasts.", CANON, "Les Mini Smiling Critters attaquent en essaim dans Playcare sans changer d'échelle canonique.", "The Mini Smiling Critters swarm through Playcare without an invented scale change.", "Playcare Pack")
    ],
    bosses: [
      threat("huggy_wuggy", "Huggy Wuggy", "boss", POPPY, "Towering blue plush experiment with triangular head, glossy black eyes, yellow hands and feet, and multiple rows of needle teeth behind red lips.", CANON, "Huggy traque le joueur dans les conduits avant la chute de la passerelle.", "Huggy hunts the player through vents before the catwalk fall.", "Vent Pursuit"),
      threat("mommy_long_legs", "Mommy Long Legs", "boss", POPPY, "Pink rubbery spider-toy experiment with coiled pink hair, green eyes and extremely elastic limbs; damaged form exposes stretched plastic, not gore-heavy redesign.", CANON, "Mommy impose les jeux du Game Station puis poursuit le joueur à travers les machines.", "Mommy imposes the Game Station games and then pursues the player through its machinery.", "Elastic Hunt"),
      threat("catnap", "CatNap", "boss", POPPY, "Large skeletal purple cat toy, crescent-moon pendant, black mouth and long tail; red smoke forms the source nightmare silhouette.", CANON, "CatNap contrôle Playcare par la peur, le gaz rouge et son culte du Prototype.", "CatNap controls Playcare through fear, red smoke and devotion to the Prototype.", "Red Smoke")
    ],
    worldBoss: threat("the_prototype", "The Prototype / Experiment 1006", "world-boss", POPPY, "Show only the canonical mechanical claw and a concealed assemblage of salvaged toy parts associated with Experiment 1006. Keep undefined areas in smoke and factory shadow instead of asserting a definitive complete body.", ADAPTED, "Le Prototype orchestre la catastrophe; cette rencontre crossover montre seulement ses éléments publics et garde le reste volontairement dissimulé.", "The Prototype orchestrates the disaster; this crossover encounter shows only its public visual elements and deliberately conceals the rest.", "Hour of Joy Mastermind"),
    stage: "Playtime Co. Make-a-Friend Factory",
    stageMeta: metadata(POPPY, "Chapter 1 production floor with toy conveyors, Make-a-Friend machines, colored power sockets, catwalks and sealed vents.", INSPIRED, "Le parcours principal relie puzzles électriques et poursuite industrielle.", "The main route links electrical puzzles to an industrial pursuit."),
    stageVariants: [
      stageVariant("Tactics", "Game Station Triple Game", "Very Hard", "Mommy Long Legs", POPPY, "Game Station hub branching to Musical Memory, Wack-a-Wuggy and Statues, with giant train décor and source primary colors.", INSPIRED, "Trois épreuves canoniques structurent la variante.", "Three canonical games structure the variant."),
      stageVariant("Smash", "Playcare Home Sweet Home", "Expert", "CatNap", POPPY, "Playcare orphanage corridors, Home Sweet Home rooms, moon imagery, batteries and red-smoke emergency lighting.", INSPIRED, "La visibilité baisse avec le gaz rouge de CatNap.", "Visibility falls as CatNap's red smoke spreads.")
    ],
    gear: [
      gear("grabpack_20", "GrabPack 2.0", "GrabPack 2.0", { atk: 7, spd: 2 }, POPPY, "Blue and green extendable GrabPack hands on a yellow chest harness with coiled cables and source connection sockets.", CANON, "Le GrabPack alimente, saisit et détourne les machines.", "The GrabPack powers, grabs and redirects machinery."),
      gear("poppy_gas_mask", "Playcare Gas Mask", "Masque à gaz de Playcare", { def: 8, hp: 45 }, POPPY, "Industrial full-face respirator used against Playcare red smoke, with clear visor and filter; no military skull styling.", CANON, "Le masque limite l'exposition au gaz rouge.", "The mask limits exposure to red smoke."),
      gear("orange_grabpack_hand", "Orange GrabPack Hand", "Main orange du GrabPack", { atk: 6, def: 4 }, POPPY, "Orange GrabPack hand attachment mounted on the extendable cable and harness system, projecting its built-in flare light; never render it as a standalone firearm.", CANON, "La main orange éclaire les zones sombres tout en restant un module du GrabPack.", "The orange hand lights dark areas while remaining a GrabPack attachment.")
    ],
    event: event("evt_hour_of_joy", "Hour of Joy Archive", "Archive de l'Heure de Joie", "Recovered tapes replay the factory massacre while Poppy identifies a safe route through the lockdown.", "Les cassettes retrouvées rejouent le massacre de l'usine tandis que Poppy repère une route sûre dans le confinement.", POPPY, "VHS security montage of the Playtime Co. factory during the Hour of Joy; ominous silhouettes and emergency shutters, no invented culprit.", INSPIRED)
  }));
}
