// Plants vs. Zombies — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#7fc83d", "#203814", "#ffd447"]));
}

export function createCanonRosterWavePartA({ CANON, INSPIRED, PVZ, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "plants_vs_zombies",
    universe: "Plants vs. Zombies",
    mediaType: "game",
    faction: "nature",
    mode: "Tactics",
    difficulty: "Hard",
    referenceUrl: PVZ,
    canonStatus: INSPIRED,
    visualAnchor: "Original lawn-defense language: suburban grid, bright stylized plants, goofy gray-green zombies, tombstones, pool lanes and roof pots; no realistic military gore.",
    lore: localizedLore("Les plantes de Crazy Dave défendent maison, piscine et toit contre les vagues commandées par le Dr Zomboss.", "Crazy Dave's plants defend the house, pool and roof from waves directed by Dr. Zomboss."),
    hero: hero("pvz_peashooter", "Peashooter", "marine", PVZ, "Bright green plant with one large pea-cannon snout, two leaf arms, three base leaves and a round head on a short stem.", CANON, "Peashooter maintient une ligne de tir simple et fiable.", "Peashooter provides a simple reliable firing lane.", "Pea Volley"),
    allies: [
      hero("pvz_sunflower", "Sunflower", "support", PVZ, "Smiling brown circular face surrounded by yellow petals, green stem and two leaves; warm sun motes, never humanoid armor.", CANON, "Sunflower produit le soleil et soigne la formation.", "Sunflower produces sun and sustains the formation.", "Sun Production"),
      hero("pvz_wallnut", "Wall-nut", "guardian", PVZ, "Large oval brown walnut with simple dot eyes, small mouth and progressive shell cracks as damage states.", CANON, "Wall-nut absorbe les morsures et bloque une case.", "Wall-nut absorbs bites and blocks one tile.", "Shell Block")
    ],
    monsters: [
      threat("pvz_basic_zombie", "Basic Zombie", "walker", PVZ, "Gray-green suburban zombie in brown jacket, red striped tie, torn trousers and one lost shoe, using the original game's comic proportions.", CANON, "Le zombie de base avance et mange la première plante rencontrée.", "The basic zombie advances and eats the first plant it reaches.", "Lawn Shuffle"),
      threat("pvz_conehead", "Conehead Zombie", "armored", PVZ, "Basic Zombie wearing one bright orange road cone as improvised head armor.", CANON, "Le cône absorbe plusieurs impacts avant de tomber.", "The cone absorbs several hits before falling.", "Cone Armor"),
      threat("pvz_buckethead", "Buckethead Zombie", "heavy", PVZ, "Basic Zombie with dented galvanized bucket worn squarely over the head, retaining the brown suit and red tie.", CANON, "Le seau offre une protection lourde sur une seule voie.", "The bucket provides heavy protection in one lane.", "Bucket Armor")
    ],
    bosses: [
      threat("pvz_zomboni", "Zomboni", "boss", PVZ, "Red ice-resurfacing machine driven by a zombie, leaving a glossy ice trail and supporting bobsled teams.", CANON, "Le Zomboni gèle une voie et écrase les plantes sur son passage.", "The Zomboni freezes a lane and crushes plants in its path.", "Ice Lane"),
      threat("pvz_gargantuar", "Gargantuar", "boss", PVZ, "Huge gray zombie in ragged dark clothing carrying a wooden utility pole and a small Imp on its back.", CANON, "Gargantuar encaisse la ligne puis lance son Imp lorsqu'il est blessé.", "Gargantuar soaks the lane and throws its Imp when hurt.", "Imp Throw"),
      threat("pvz_giga_gargantuar", "Giga-Gargantuar", "boss", PVZ, "Red-eyed reinforced Gargantuar with darker body and the same pole-and-Imp silhouette, clearly a tougher original-game variant.", CANON, "La variante Giga exige des dégâts concentrés et conserve le lancer d'Imp.", "The Giga variant demands concentrated damage and retains the Imp throw.", "Giga Slam")
    ],
    worldBoss: threat("pvz_dr_zomboss", "Dr. Zomboss in Zombot", "world-boss", PVZ, "Original lawn-defense finale: Dr. Edgar Zomboss, tiny pale zombie scientist with enlarged exposed brain, piloting the towering gray-metal red-eyed Zombot over sloped roof lanes; never substitute a Garden Warfare frozen costume.", CANON, "Zomboss alterne boules de feu, boules de glace, lancer de véhicules et invocation de vagues.", "Zomboss alternates fireballs, iceballs, thrown vehicles and summoned waves.", "Zombot Roof Assault"),
    stage: "Front Yard Lawn Defense",
    stageMeta: metadata(PVZ, "Five daytime lawn lanes in front of the suburban house, seed bank and lawn mowers visible, with no Garden Warfare battlefield clutter.", INSPIRED, "La défense principale respecte la grille et l'économie de soleil.", "The main defense preserves the grid and sun economy."),
    stageVariants: [
      stageVariant("Tactics", "Backyard Pool Night", "Very Hard", "Gargantuar", PVZ, "Night backyard with six lanes, two pool lanes, lily pads, fog edge, tombstones and pool cleaners.", INSPIRED, "Les voies aquatiques et le brouillard modifient le placement.", "Water lanes and fog change placement."),
      stageVariant("RPG", "Roof Zombot Siege", "Expert", "Dr. Zomboss in Zombot", PVZ, "Sloped red-tile roof, plant pots, chimneys and looming Zombot, with lobbed projectiles required by the roof angle.", INSPIRED, "Le toit impose les pots et prépare le duel contre Zomboss.", "The roof requires pots and sets up the Zomboss duel.")
    ],
    gear: [
      gear("pvz_seed_packet", "Seed Packet", "Paquet de graines", { atk: 7, spd: 1 }, PVZ, "Single source-style seed packet with plant portrait panel, recharge clock motif and no readable brand text.", CANON, "Le paquet déploie une plante sur une case libre.", "The packet deploys a plant on an open tile."),
      gear("pvz_shovel", "Garden Shovel", "Pelle de jardin", { def: 5, spd: 2 }, PVZ, "Crazy Dave's simple garden shovel with wooden handle and small metal blade, isolated as a UI tool.", CANON, "La pelle retire une plante pour corriger la formation.", "The shovel removes a plant to correct the formation."),
      gear("pvz_lawn_mower", "Lawn Mower", "Tondeuse", { atk: 12 }, PVZ, "Compact red lawn mower parked at the left end of a lane, matching the original emergency defense prop.", CANON, "La tondeuse nettoie une voie franchie par un zombie.", "The mower clears a breached lane.")
    ],
    event: event("evt_pvz_final_wave", "Final Wave", "Vague finale", "The warning siren announces one dense wave while Crazy Dave refreshes the seed bank.", "La sirène annonce une vague dense pendant que Crazy Dave renouvelle la banque de graines.", PVZ, "Large red FINAL WAVE cadence translated into icon-free warning lights, marching zombie silhouettes and the original suburban lawn.", INSPIRED)
  }));
}
