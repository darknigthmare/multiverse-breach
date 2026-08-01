// Canon-grounded crossover roster, wave A.
// Runtime tuples stay compatible with requestedUniverseWave.js while metadata keeps
// the source boundary explicit for art direction and lore review.

const CANON = "canon";
const INSPIRED = "canon-inspired";
const ADAPTED = "crossover-adaptation";

const localizedLore = (fr, en) => Object.freeze({ fr, en });

const metadata = (referenceUrl, visualAnchor, canonStatus, fr, en, extra = {}) => Object.freeze({
  referenceUrl,
  visualAnchor,
  canonStatus,
  lore: localizedLore(fr, en),
  ...extra
});

const heroStats = (role) => {
  const profiles = {
    guardian: { hp: 148, atk: 9, def: 12, spd: 4 },
    titan: { hp: 170, atk: 15, def: 12, spd: 4 },
    racer: { hp: 112, atk: 8, def: 6, spd: 12 },
    support: { hp: 116, atk: 8, def: 8, spd: 7 },
    medic: { hp: 118, atk: 7, def: 9, spd: 7 },
    operator: { hp: 124, atk: 8, def: 10, spd: 6 },
    technician: { hp: 120, atk: 9, def: 9, spd: 7 },
    investigator: { hp: 118, atk: 9, def: 7, spd: 8 },
    survivor: { hp: 132, atk: 9, def: 9, spd: 8 },
    performer: { hp: 120, atk: 8, def: 8, spd: 8 }
  };
  return Object.freeze(profiles[role] || { hp: 126, atk: 11, def: 8, spd: 7 });
};

const heroKit = (name, role, signature) => Object.freeze({
  weapon: signature,
  weaponType: signature,
  stats: heroStats(role),
  simple: Object.freeze({ name: signature, type: role === "racer" ? "dash" : "ability", dmg: 1.0 }),
  secondary: Object.freeze({ name: `${signature} Follow-up`, type: "buff", cd: 6, dmg: 1.35 }),
  defense: Object.freeze({ name: `${name} Guard`, type: "shield", dur: 2.0, reduce: 0.7 }),
  special: Object.freeze({ name: `${name} — ${signature}`, type: "nexus_aoe", dmg: 3.4 })
});

const hero = (id, name, role, referenceUrl, visualAnchor, canonStatus, fr, en, signature) => Object.freeze([
  id,
  name,
  role,
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en, {
    signature,
    ...heroKit(name, role, signature)
  })
]);

const threat = (id, name, role, referenceUrl, visualAnchor, canonStatus, fr, en, signature) => Object.freeze({
  id,
  name,
  role,
  signature,
  weapon: signature,
  special: signature,
  ...metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
});

const gear = (id, nameEn, nameFr, boost, referenceUrl, visualAnchor, canonStatus, fr, en) => Object.freeze([
  id,
  nameEn,
  nameFr,
  Object.freeze({ ...boost }),
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
]);

const event = (id, nameEn, nameFr, en, fr, referenceUrl, visualAnchor, canonStatus) => Object.freeze([
  id,
  nameEn,
  nameFr,
  en,
  fr,
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
]);

const stageVariant = (mode, name, difficulty, bossName, referenceUrl, visualAnchor, canonStatus, fr, en) => Object.freeze([
  mode,
  name,
  difficulty,
  bossName,
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
]);

const PACK_PALETTES = Object.freeze({
  poppy_playtime: Object.freeze(["#254f88", "#090d18", "#e63c42"]),
  plants_vs_zombies: Object.freeze(["#7fc83d", "#203814", "#ffd447"]),
  avatar_navi: Object.freeze(["#0b3651", "#031018", "#56e3dc"]),
  skyline: Object.freeze(["#172a44", "#04070d", "#4ea7ff"]),
  happy_wheels: Object.freeze(["#7d99ad", "#252b31", "#d84343"]),
  marble_hornets: Object.freeze(["#3a423b", "#050605", "#d8ddd8"]),
  horribly_slow_murderer: Object.freeze(["#5a534b", "#0c0907", "#d3c6a5"]),
  sartorius_stedim_biotech: Object.freeze(["#dceff4", "#62858f", "#f6fbfc"]),
  skibidi: Object.freeze(["#182330", "#05080b", "#70d7ff"]),
  trololo: Object.freeze(["#68442b", "#17100b", "#d6a934"])
});

const definePack = (pack) => {
  const heroes = [pack.hero, ...pack.allies];
  if (heroes.length !== 3 || pack.monsters.length !== 3 || pack.bosses.length !== 3) {
    throw new TypeError(`${pack.universe}: expected 3 heroes, 3 enemies and 3 bosses.`);
  }
  if (pack.stageVariants.length !== 2 || pack.gear.length !== 3 || !pack.worldBoss || !pack.event) {
    throw new TypeError(`${pack.universe}: incomplete world boss, stage variants, gear or event contract.`);
  }

  return Object.freeze({
    ...pack,
    title: pack.title || pack.universe,
    titleFr: pack.titleFr || pack.universe,
    theme: pack.theme || pack.visualAnchor,
    desc: pack.desc || pack.lore,
    colors: pack.colors || PACK_PALETTES[pack.key],
    motif: pack.motif || "facility",
    researchDate: pack.researchDate || "2026-08-01",
    referenceUrls: Object.freeze(pack.referenceUrls || [pack.referenceUrl]),
    continuity: pack.continuity || pack.visualAnchor,
    fidelityNotes: pack.fidelityNotes || pack.lore.en,
    lore: Object.freeze(pack.lore),
    hero: Object.freeze(pack.hero),
    allies: Object.freeze([...pack.allies]),
    monsters: Object.freeze([...pack.monsters]),
    bosses: Object.freeze([...pack.bosses]),
    stageMeta: Object.freeze(pack.stageMeta),
    stageVariants: Object.freeze([...pack.stageVariants]),
    gear: Object.freeze([...pack.gear]),
    event: Object.freeze(pack.event)
  });
};

const POPPY = "https://poppyplaytime.com/pages/characters";
const PVZ = "https://www.ea.com/games/plants-vs-zombies";
const AVATAR = "https://www.avatar.com/pandorapedia/";
const SKYLINE = "https://www.wired.com/2010/11/skyline/";
const HAPPY_WHEELS = "https://www.fancyforce.com/";
const MARBLE_HORNETS = "https://www.youtube.com/@MarbleHornets";
const GINOSAJI = "https://www.youtube.com/watch?v=9VDvgL58h_Y";
const SARTORIUS = "https://www.sartorius.com/en/company/newsroom/capacity-expansions/aubagne-france";
const SKIBIDI = "https://www.youtube.com/@DaFuqBoom";
const TROLOLO = "https://doodles.google/doodle/eduard-khils-83rd-birthday/";

export const CANON_ROSTER_WAVE_PART_A = Object.freeze([
  definePack({
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
  }),

  definePack({
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
  }),

  definePack({
    key: "avatar_navi",
    universe: "Avatar (Na'vi)",
    mediaType: "film",
    faction: "nature",
    mode: "RPG",
    difficulty: "Very Hard",
    referenceUrl: AVATAR,
    canonStatus: INSPIRED,
    visualAnchor: "James Cameron's Pandora only: tall blue striped Na'vi with four limbs, bioluminescent rainforest, woven clan gear and RDA industrial hardware; never Avatar: The Last Airbender.",
    lore: localizedLore("Jake, Neytiri et Kiri défendent Pandora contre la RDA; toute faune pandorienne reste alliée, monture ou présence environnementale, jamais une faction ennemie.", "Jake, Neytiri and Kiri defend Pandora from the RDA; all Pandoran fauna remains allied, mounted or environmental, never an enemy faction."),
    hero: hero("jake_sully_avatar", "Jake Sully", "slayer", AVATAR, "Adult Omatikaya-form Jake: tall blue striped Na'vi, long dark braids, yellow eyes, clan harness, bow and songcord; no human marine armor.", CANON, "Toruk Makto coordonne les clans et combat avec l'arc et les liens de monture.", "Toruk Makto coordinates the clans and fights with bow and mount bonds.", "Clan Rally"),
    allies: [
      hero("neytiri_avatar", "Neytiri", "ranger", AVATAR, "Athletic Omatikaya woman with blue tiger stripes, amber-yellow eyes, long braided hair, woven bead harness and long Na'vi bow.", CANON, "Neytiri protège sa famille et frappe à distance avec une précision de chasseuse.", "Neytiri protects her family and strikes at range with a hunter's precision.", "Omatikaya Arrow"),
      hero("kiri_avatar", "Kiri", "support", AVATAR, "Teen Na'vi girl with Grace-linked facial features, long dark braids, green-blue beadwork and close bioluminescent connection to Pandora's life.", CANON, "Kiri ressent le réseau d'Eywa et soutient l'équipe sans magie élémentaire inventée.", "Kiri senses Eywa's network and supports the team without invented elemental magic.", "Eywa Communion")
    ],
    monsters: [
      threat("avatar_rda_secops", "RDA SecOps Trooper", "infantry", "https://www.avatar.com/pandorapedia/category/rda", "Human RDA security soldier with exopack breathing mask, olive-tan tactical uniform, compact rifle and corporate industrial equipment.", CANON, "L'infanterie RDA dépend de ses exopacks dans l'atmosphère de Pandora.", "RDA infantry depends on exopacks in Pandora's atmosphere.", "Exopack Fireteam"),
      threat("avatar_amp_suit", "AMP Suit", "heavy", "https://www.avatar.com/pandorapedia/amp-suit", "Gray-green bipedal Amplified Mobility Platform with exposed cockpit, articulated human-scale controls and GAU-90 cannon; clearly a machine, not a creature.", CANON, "L'AMP fournit blindage et force lourde à un pilote humain.", "The AMP gives a human pilot armor and heavy strength.", "Hydraulic Advance"),
      threat("avatar_scorpion", "AT-99 Scorpion Gunship", "air", "https://www.avatar.com/pandorapedia/scorpion-gunship", "Compact RDA VTOL with twin ducted rotors, angular cockpit, short wings and rocket pods, in military gray-green.", CANON, "Le Scorpion verrouille les clairières depuis les airs.", "The Scorpion locks down clearings from the air.", "VTOL Rocket Pass")
    ],
    bosses: [
      threat("avatar_quaritch", "Recombinant Colonel Miles Quaritch", "boss", "https://www.avatar.com/pandorapedia/colonel-miles-quaritch", "Tall blue Recom Quaritch with cropped dark hair, skull tattoo on left arm, RDA tactical vest, rifle and ikran gear; not his human AMP-suit appearance.", CANON, "Le Recombinant conserve les souvenirs et l'obsession militaire de Quaritch.", "The Recombinant retains Quaritch's memories and military obsession.", "Recom Hunt"),
      threat("avatar_scoresby", "Captain Mick Scoresby", "boss", "https://www.avatar.com/pandorapedia/captain-mick-scoresby", "Human sea-hunter captain with weathered marine workwear, exopack and practical whaling-deck equipment aboard the SeaDragon.", ADAPTED, "Scoresby commande la chasse industrielle en mer; le duel de boss condense cette confrontation en adaptation de gameplay.", "Scoresby commands the industrial sea hunt; the boss duel condenses that confrontation as a gameplay adaptation.", "Tulkun Hunt Command"),
      threat("avatar_ardmore", "General Frances Ardmore", "boss", "https://www.avatar.com/pandorapedia/general-frances-ardmore", "RDA commanding general in restrained Bridgehead field uniform with exopack, command tablet and no fantasy armor.", ADAPTED, "Ardmore dirige l'occupation depuis Bridgehead; son affrontement direct est explicitement une adaptation crossover.", "Ardmore directs the occupation from Bridgehead; her direct encounter is explicitly a crossover adaptation.", "Bridgehead Lockdown")
    ],
    worldBoss: threat("avatar_seadragon", "SeaDragon", "world-boss", "https://www.avatar.com/pandorapedia/seadragon", "Enormous RDA ocean-going mothership with broad industrial hull, forward bridge, launch bays, SeaWasp craft and tulkun-hunting deck equipment; never a living sea monster.", CANON, "L'objectif est de neutraliser le navire-usine RDA et libérer les captifs, pas d'attaquer la faune.", "The objective is to disable the RDA factory vessel and free captives, not attack fauna.", "Factory Ship Disable"),
    stage: "Hallelujah Mountains RDA Assault",
    stageMeta: metadata(AVATAR, "Floating Hallelujah Mountains, mist, waterfalls, ikran flight paths and RDA Samson/Scorpion incursion below; Pandoran fauna visibly aids or avoids the defenders.", INSPIRED, "Les clans stoppent l'incursion RDA dans les montagnes flottantes.", "The clans stop the RDA incursion in the floating mountains."),
    stageVariants: [
      stageVariant("RPG", "Metkayina Reef Defense", "Very Hard", "Captain Mick Scoresby", AVATAR, "Shallow turquoise reef, woven Metkayina marui, ilu and skimwings as allies, with human SeaWasp craft and hunting boats as threats.", INSPIRED, "La défense protège le récif et les tulkun contre les chasseurs humains.", "The defense protects reef and tulkun from human hunters."),
      stageVariant("Tactics", "Bridgehead Command Breach", "Expert", "General Frances Ardmore", AVATAR, "Vast angular RDA Bridgehead City, landing pads, cranes, blast walls and toxic industrial light contrasting with Pandora beyond.", INSPIRED, "L'équipe sabote le commandement de l'occupation sans cibler Pandora.", "The team sabotages occupation command without targeting Pandora.")
    ],
    gear: [
      gear("avatar_navi_bow", "Omatikaya Longbow", "Arc long Omatikaya", { atk: 11, spd: 1 }, AVATAR, "Tall curved Na'vi longbow of dark Pandoran wood, fiber string, woven grip and long fletched arrows; scaled to a Na'vi body.", CANON, "L'arc Na'vi perce les points faibles du matériel RDA.", "The Na'vi bow pierces weak points in RDA equipment."),
      gear("avatar_songcord", "Songcord", "Corde chantée", { def: 6, hp: 45 }, AVATAR, "Personal woven songcord with beads, bones and colored knots recording life events; not a magic wand or necklace.", CANON, "La corde chantée renforce mémoire, identité et cohésion du clan.", "The songcord reinforces memory, identity and clan cohesion."),
      gear("avatar_ikran_harness", "Ikran Riding Harness", "Harnais d'ikran", { spd: 3, atk: 5 }, AVATAR, "Woven leather-and-fiber ikran saddle harness with queue-safe tsaheylu positioning; the ikran is shown as an allied mount only.", CANON, "Le harnais permet une frappe aérienne avec une monture alliée.", "The harness enables an aerial strike with an allied mount.")
    ],
    event: event("evt_avatar_eywa", "Eywa Answers", "Eywa répond", "Through Kiri's communion, nearby Pandoran life opens routes and disrupts RDA sensors without becoming an enemy wave.", "Par la communion de Kiri, la vie de Pandora ouvre des passages et perturbe les capteurs RDA sans devenir une vague ennemie.", AVATAR, "Bioluminescent neural pulses traveling through roots, woodsprites and reef life around the Na'vi defenders; fauna remains allied.", INSPIRED)
  }),

  definePack({
    key: "skyline",
    universe: "Skyline",
    mediaType: "film",
    faction: "sciFi",
    mode: "Smash",
    difficulty: "Very Hard",
    referenceUrl: SKYLINE,
    canonStatus: INSPIRED,
    visualAnchor: "Skyline film continuity: Los Angeles under hypnotic blue harvest light, biomechanical charcoal-black aliens, exposed electric-blue tissue and vast hovering harvest ships; not Cities: Skylines or a Nissan car.",
    lore: localizedLore("Jarrod, Elaine et Rose Corley relient l'invasion de Los Angeles à la résistance humaine et alien des suites; les noms de classes non officiels restent indiqués comme adaptations.", "Jarrod, Elaine and Rose Corley connect the Los Angeles harvest to the human-and-alien resistance of the sequels; unofficial class labels remain marked as adaptations."),
    hero: hero("jarrod_skyline", "Jarrod", "horror", SKYLINE, "Young civilian survivor whose brain later pilots a muscular biomechanical alien body with dark armored skin and electric-blue neural glow; preserve the human mind/alien body contrast.", CANON, "Jarrod résiste au contrôle mental et conserve son identité après la transplantation de son cerveau.", "Jarrod resists mental control and retains his identity after his brain is transplanted.", "Blue-Light Resistance"),
    allies: [
      hero("elaine_skyline", "Elaine", "support", SKYLINE, "Pregnant Los Angeles survivor in practical civilian clothing, shown as determined and protected rather than converted into an armored commando.", CANON, "Elaine survit à la récolte et reste le lien affectif qui ramène Jarrod à lui-même.", "Elaine survives the harvest and remains the emotional bond that restores Jarrod's agency.", "Human Anchor"),
      hero("rose_skyline", "Rose Corley", "marine", "https://en.wikipedia.org/wiki/Skylines", "Adult resistance commander from Skylines in practical dark combat clothing, cropped brown hair and restrained red alien-energy glow inherited from her hybrid birth; no superhero armour.", CANON, "Rose mène la résistance contre l'armada et utilise son lien alien sans effacer son identité humaine.", "Rose leads the resistance against the armada and uses her alien connection without losing her human identity.", "Armada Resistance")
    ],
    monsters: [
      threat("skyline_drone", "Skyline Drone", "interior-crawler", SKYLINE, "Small octopoid biomechanical unit used inside the harvest ship, with compact dark shell, electric-blue tissue and short grasping tendrils; not the large flying squid silhouette.", INSPIRED, "Le Drone se déplace dans les couloirs et verrouille une cible proche.", "The Drone moves through ship corridors and latches onto a nearby target.", "Tentacle Latch"),
      threat("skyline_tanker", "Skyline Tanker", "heavy", SKYLINE, "Massive ground alien with broad armored body, multiple load-bearing limbs and blue organic seams; use the production creature silhouette, not a military vehicle.", INSPIRED, "Le Tanker brise les barricades et absorbe les tirs légers.", "The Tanker breaks barricades and absorbs light fire.", "Barricade Crush"),
      threat("skyline_hydra", "Skyline Hydra", "air-hunter", SKYLINE, "Large flying squid-like biomechanical creature above the city, with charcoal shell, broad airborne body, long trailing tentacles and exposed electric-blue neural material.", INSPIRED, "L'Hydra survole la zone et saisit les survivants avec ses longs tentacules.", "The Hydra flies over the area and grabs survivors with its long tentacles.", "Aerial Grab")
    ],
    bosses: [
      threat("skyline_brain_collector", "Brain-Collector Chamber", "boss", SKYLINE, "Interior ship mechanism of wet biomechanical conduits, blue energy and harvested human brains; encounter is machinery, not a fabricated named alien.", ADAPTED, "La chambre tente d'extraire les cerveaux; il faut couper ses conduits sans sacrifier les captifs.", "The chamber attempts brain extraction; its conduits must be cut without sacrificing captives.", "Harvest Shutdown"),
      threat("skyline_armored_pilot", "Armored Alien Pilot", "boss", "https://en.wikipedia.org/wiki/Beyond_Skyline", "Large bipedal alien combat body with layered black organic armor, electric-blue facial core and scavenged ship weaponry.", ADAPTED, "Ce corps de combat protège le pont; le rôle de boss nommé reste une adaptation du combat des suites.", "This combat body protects the bridge; its named boss role remains an adaptation of sequel combat.", "Bridge Guard"),
      threat("skyline_harvest_core", "Harvest Ship Core", "boss", SKYLINE, "Pulsing blue biomechanical command organ integrated into black ribbed ship walls, with conduits visibly controlling drones and tractor light.", ADAPTED, "Le noyau coordonne les unités sans être présenté comme une nouvelle espèce canonique.", "The core coordinates units without being presented as a new canonical species.", "Drone Command")
    ],
    worldBoss: threat("skyline_mothership", "Harvest Mothership", "world-boss", SKYLINE, "Kilometer-wide dark organic ship hanging above Los Angeles, ventral blue harvest aperture, branching hull forms and swarms of smaller craft.", INSPIRED, "La victoire interrompt le rayon de récolte et ouvre une évacuation; elle n'efface pas l'armada entière.", "Victory interrupts the harvest beam and opens an evacuation; it does not erase the whole armada.", "Harvest Beam Break"),
    stage: "Marina del Rey Penthouse Harvest",
    stageMeta: metadata(SKYLINE, "Luxury penthouse roof and glass apartment overlooking Marina del Rey at dawn, with the exact hypnotic blue light and human silhouettes rising toward ships.", INSPIRED, "Les survivants doivent éviter de regarder la lumière bleue.", "Survivors must avoid looking into the blue light."),
    stageVariants: [
      stageVariant("Tactics", "Beyond Skyline Laos Resistance", "Very Hard", "Armored Alien Pilot", "https://en.wikipedia.org/wiki/Beyond_Skyline", "Jungle temple resistance perimeter with human fighters, alien debris and a harvest ship overhead; no unrelated cyberpunk city.", INSPIRED, "La résistance protège le temple et infiltre le vaisseau.", "The resistance protects the temple and infiltrates the ship."),
      stageVariant("Smash", "Skylines Armada Interior", "Expert", "Harvest Ship Core", "https://en.wikipedia.org/wiki/Skylines", "Biomechanical alien corridor with ribbed black walls, blue neural conduits and zero-gravity breach toward the armada.", INSPIRED, "La variante rejoint la guerre menée dans l'armada des suites.", "The variant reaches the war inside the sequel-era armada.")
    ],
    gear: [
      gear("skyline_blackout_goggles", "Blackout Goggles", "Lunettes occultantes", { def: 8, hp: 35 }, SKYLINE, "Improvised fully opaque eye protection with narrow camera-assisted slit, built specifically against the hypnotic blue light.", ADAPTED, "Les lunettes réduisent l'emprise visuelle du rayon.", "The goggles reduce the beam's visual control."),
      gear("skyline_alien_gauntlet", "Alien Control Gauntlet", "Gantelet de contrôle alien", { atk: 9, spd: 2 }, "https://en.wikipedia.org/wiki/Beyond_Skyline", "Scavenged black biomechanical forearm device with electric-blue veins and ship-interface tendrils.", INSPIRED, "Le gantelet détourne brièvement un mécanisme alien.", "The gauntlet briefly redirects alien machinery."),
      gear("skyline_emp_charge", "Resistance EMP Charge", "Charge IEM de la résistance", { atk: 8, def: 5 }, "https://en.wikipedia.org/wiki/Beyond_Skyline", "Compact human-built electromagnetic charge strapped to salvaged alien blue-energy components, no fantasy rune styling.", ADAPTED, "La charge coupe un conduit de récolte pendant quelques secondes.", "The charge shuts a harvest conduit down for a few seconds.")
    ],
    event: event("evt_skyline_blue_light", "Blue Light Blackout", "Extinction de la lumière bleue", "Jarrod turns the alien neural signal against the harvest network while Elaine guides civilians into cover.", "Jarrod retourne le signal neural alien contre le réseau de récolte pendant qu'Elaine guide les civils à couvert.", SKYLINE, "Citywide blackout beneath hovering ships; Jarrod's blue-lit alien form faces the beam while civilians keep their eyes shielded.", ADAPTED)
  }),

  definePack({
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
  }),

  definePack({
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
  }),

  definePack({
    key: "horribly_slow_murderer",
    universe: "The Horribly Slow Murderer",
    mediaType: "short-film",
    faction: "horror",
    mode: "RPG",
    difficulty: "Expert",
    referenceUrl: GINOSAJI,
    referenceUrls: [GINOSAJI, "https://www.ginosaji.com/the-cast", "https://www.ginosaji.com/the-filmmakers"],
    canonStatus: ADAPTED,
    visualAnchor: "Richard Gale's black-comedy short: Jack Cucchiaio in progressively ruined everyday clothes, the silent pale-faced Ginosaji in black hooded clothing, and one ordinary metal spoon; no giant utensil monster.",
    lore: localizedLore("Le canon repose sur une seule poursuite: Jack Cucchiaio contre le Ginosaji qui le frappe lentement avec une cuillère. Les neuf cases de ladder sont donc des phases et pressions de cette même malédiction, jamais de nouveaux démons.", "Canon is one pursuit: Jack Cucchiaio versus the Ginosaji slowly striking him with a spoon. The ladder slots are therefore phases and pressures of that same curse, never new demons."),
    hero: hero("ginosaji_jack", "Jack Cucchiaio", "survivor", GINOSAJI, "Exhausted man with stubble, ordinary shirt and jacket degrading over years of pursuit, improvised protection and the source's increasingly desperate expression.", CANON, "Jack traverse le monde pour échapper à un poursuivant invulnérable et absurdement lent.", "Jack crosses the world trying to escape an invulnerable, absurdly slow pursuer.", "Desperate Escape"),
    allies: [
      hero("ginosaji_mystic", "The Mystic", "support", GINOSAJI, "Grounded consultation-room mystic associated with identifying the Ginosaji curse; no combat costume or invented occult powers beyond the scene.", CANON, "La consultation donne un nom à la malédiction sans offrir de solution facile.", "The consultation names the curse without offering an easy solution.", "Curse Diagnosis"),
      hero("ginosaji_doctor", "The Doctor", "medic", GINOSAJI, "Ordinary medical professional in a plain examination room, charting Jack's unexplained spoon bruises with deadpan realism.", INSPIRED, "Le soutien médical maintient Jack debout mais ne peut arrêter le Ginosaji.", "Medical support keeps Jack standing but cannot stop the Ginosaji.", "Bruise Treatment")
    ],
    monsters: [
      threat("ginosaji_spoon_tap", "Relentless Spoon Tap", "curse-pressure", GINOSAJI, "One normal stainless-steel spoon repeatedly entering frame from the Ginosaji's hand; no floating sentient utensil.", ADAPTED, "La frappe inflige peu à la fois mais ne s'arrête jamais.", "Each strike does little at once but never stops.", "Tap Tap Tap"),
      threat("ginosaji_lost_sleep", "Sleepless Pursuit", "curse-pressure", GINOSAJI, "Montage of clocks, bruises and Jack failing to rest while the hooded figure approaches at walking pace.", ADAPTED, "La fatigue accumulée réduit les options de fuite.", "Accumulated exhaustion reduces escape options.", "No Rest"),
      threat("ginosaji_impossible_return", "Impossible Return", "curse-pressure", GINOSAJI, "The same silent hooded figure reappearing after distance, locked doors and catastrophic attempts to stop it.", ADAPTED, "Toute échappée gagne du temps mais ne détruit pas la malédiction.", "Every escape buys time but does not destroy the curse.", "Still Behind You")
    ],
    bosses: [
      threat("ginosaji_home_ambush", "Ginosaji: Home Ambush", "boss-phase", GINOSAJI, "Pale masklike face, black hooded robe and ordinary spoon appearing in Jack's home under mundane lighting.", ADAPTED, "La première phase apprend à esquiver sans pouvoir blesser le poursuivant.", "The first phase teaches evasion without allowing damage to the pursuer.", "Kitchen Pursuit"),
      threat("ginosaji_world_chase", "Ginosaji: World Pursuit", "boss-phase", GINOSAJI, "Unchanged hooded Ginosaji crossing desert, city and wilderness behind a visibly aging Jack.", ADAPTED, "La deuxième phase condense les années et les pays de la poursuite.", "The second phase condenses the pursuit across years and countries.", "Years of Tapping"),
      threat("ginosaji_tunnel_return", "Ginosaji: Tunnel Return", "boss-phase", GINOSAJI, "The same soot-stained hooded figure emerging from debris with spoon still in hand after Jack's largest failed counterattack.", ADAPTED, "Même détruit en apparence, le Ginosaji revient avec sa cuillère intacte.", "Even apparently destroyed, the Ginosaji returns with the spoon intact.", "Unbroken Spoon")
    ],
    worldBoss: threat("ginosaji_endless", "Ginosaji — Endless Pursuit", "world-boss-survival", GINOSAJI, "Single canonical Ginosaji kept human-sized, slow, silent and armed only with a normal spoon as the environment cycles around him.", ADAPTED, "Le but est de survivre jusqu'à l'extraction; aucune mort définitive du Ginosaji n'est inventée.", "The goal is to survive until extraction; no definitive death for the Ginosaji is invented.", "Outlast the Curse"),
    stage: "Jack's Apartment — First Tapping",
    stageMeta: metadata(GINOSAJI, "Ordinary apartment kitchen and hallway where a mundane spoon attack becomes absurdly inescapable.", ADAPTED, "Le contraste entre décor banal et poursuite impossible porte la scène.", "The contrast between mundane setting and impossible pursuit carries the scene."),
    stageVariants: [
      stageVariant("Race", "Across the World Montage", "Very Hard", "Ginosaji: World Pursuit", GINOSAJI, "Rapid succession of desert, city, snow and ocean travel while one unchanged hooded figure advances in the rear plane.", ADAPTED, "Une course de survie adapte le montage temporel du court métrage.", "A survival race adapts the short film's time montage."),
      stageVariant("RPG", "Collapsed Tunnel Last Stand", "Expert", "Ginosaji: Tunnel Return", GINOSAJI, "Dark damaged tunnel, improvised heavy weapons discarded, one metal spoon audible before the figure returns.", ADAPTED, "Les armes échouent; l'objectif redevient l'évasion.", "Weapons fail; the objective returns to escape.")
    ],
    gear: [
      gear("ginosaji_body_padding", "Improvised Body Padding", "Rembourrage improvisé", { def: 8, hp: 55 }, GINOSAJI, "Layers of battered everyday protective padding shaped around countless spoon impacts, comic but not superhero armor.", ADAPTED, "Le rembourrage ralentit l'accumulation des coups.", "Padding slows the accumulation of taps."),
      gear("ginosaji_escape_map", "Worldwide Escape Map", "Carte d'évasion mondiale", { spd: 3, def: 3 }, GINOSAJI, "Worn world map covered with routes, crossed-out shelters and clocks documenting years of flight.", ADAPTED, "La carte choisit la prochaine avance temporaire.", "The map chooses the next temporary head start."),
      gear("ginosaji_ordinary_spoon", "Ordinary Spoon", "Cuillère ordinaire", { atk: 3, def: 6 }, GINOSAJI, "One completely ordinary stainless-steel teaspoon, isolated without an invented evidence bag; its banality is the essential visual joke.", ADAPTED, "La cuillère n'a rien de spectaculaire; son emploi comme équipement est une adaptation.", "The spoon is completely unspectacular; using it as equipment is an adaptation.")
    ],
    event: event("evt_ginosaji_head_start", "One More Head Start", "Encore un peu d'avance", "Jack traps the Ginosaji long enough to sleep, heal and flee, but the spoon rhythm resumes before the timer ends.", "Jack piège le Ginosaji assez longtemps pour dormir, se soigner et fuir, mais le rythme de la cuillère reprend avant la fin du chrono.", GINOSAJI, "Exhausted Jack leaving frame while the human-sized hooded Ginosaji slowly frees one hand holding the same spoon.", ADAPTED)
  }),

  definePack({
    key: "sartorius_stedim_biotech",
    universe: "Sartorius Stedim Biotech",
    mediaType: "real-world-industry",
    faction: "science",
    mode: "Tactics",
    difficulty: "Very Hard",
    referenceUrl: SARTORIUS,
    canonStatus: ADAPTED,
    visualAnchor: "Aubagne bioprocess cleanroom: bright white modular walls, stainless process frames, single-use sterile bags, tubing and connectors, strict gowning and white Everest cleanroom suits; no sinister laboratory clichés.",
    safetyNote: "Sartorius is a real company. Employees are cooperative heroes; every enemy or boss is a non-human process deviation marked crossover-adaptation.",
    lore: localizedLore("À Aubagne, les opérateurs protègent une production bioprocédés à usage unique. Le crossover transforme uniquement particules, pertes d'intégrité et écarts de procédé en menaces abstraites; aucun salarié n'est ennemi.", "At Aubagne, operators protect single-use bioprocess production. The crossover turns only particles, integrity loss and process deviations into abstract threats; no employee is an enemy."),
    hero: hero("sartorius_aseptic_operator", "Aseptic Production Operator", "operator", SARTORIUS, "Anonymous production operator fully enclosed in a clean white Everest suit, hood, mask, goggles, overshoes and gloves, working with sterile tubing; no weapon and no identifiable employee likeness.", ADAPTED, "L'opérateur réalise les gestes aseptiques et protège le produit.", "The operator performs aseptic manipulations and protects the product.", "Aseptic Connection"),
    allies: [
      hero("sartorius_process_technician", "Bioprocess Technician", "technician", SARTORIUS, "Anonymous cleanroom technician in the same white Everest ensemble, checking a stainless process skid and single-use bag through a tablet interface.", ADAPTED, "Le technicien stabilise pression, débit et intégrité des équipements.", "The technician stabilizes pressure, flow and equipment integrity.", "Process Stabilization"),
      hero("sartorius_quality_controller", "Quality Controller", "support", SARTORIUS, "Anonymous quality specialist in compliant white cleanroom gowning, carrying a sealed sampler and traceability tablet, never depicted as police or combat staff.", ADAPTED, "Le contrôle qualité bloque les écarts avant libération du lot.", "Quality control blocks deviations before batch release.", "Traceability Review")
    ],
    monsters: [
      threat("sartorius_particle_excursion", "Airborne Particle Excursion", "process-hazard", SARTORIUS, "Subtle particle-counter alert and magnified nonliving motes above an otherwise immaculate white-room work zone.", ADAPTED, "Une hausse de particules ferme la zone jusqu'au nettoyage et au contrôle.", "A particle rise closes the zone until cleaning and verification.", "Particle Alert"),
      threat("sartorius_seal_loss", "Single-Use Seal Integrity Loss", "process-hazard", SARTORIUS, "Small visible leak or pressure decay at a sterile bag seal on a transparent single-use assembly, with no body-horror imagery.", ADAPTED, "La perte d'intégrité exige isolement et remplacement de l'assemblage.", "Integrity loss requires isolation and replacement of the assembly.", "Pressure Decay"),
      threat("sartorius_connector_misalignment", "Sterile Connector Misalignment", "process-hazard", SARTORIUS, "Two single-use sterile connector halves visibly out of alignment, capped tubing and amber process warning light.", ADAPTED, "Un mauvais alignement interrompt la connexion aseptique avant contact.", "Misalignment interrupts the aseptic connection before contact.", "Connection Interlock")
    ],
    bosses: [
      threat("sartorius_bioburden_excursion", "Bioburden Excursion", "boss-deviation", SARTORIUS, "Abstract red trend line above specification beside sealed samples and a quarantined production zone; no monster or blamed worker.", ADAPTED, "L'équipe identifie la source, met le lot en quarantaine et assainit la ligne.", "The team identifies the source, quarantines the batch and sanitizes the line.", "Quarantine Protocol"),
      threat("sartorius_pressure_cascade", "Cleanroom Pressure Cascade Failure", "boss-deviation", SARTORIUS, "White-room airlock diagram with reversed pressure arrows, closed interlocked doors and HVAC alarms.", ADAPTED, "Il faut restaurer la cascade de pression sans ouvrir les sas compromis.", "The pressure cascade must be restored without opening compromised airlocks.", "Airlock Recovery"),
      threat("sartorius_traceability_break", "Batch Traceability Break", "boss-deviation", SARTORIUS, "Disconnected digital batch record nodes, sealed component labels and a clear HOLD status with unreadable identifiers.", ADAPTED, "Le lot reste bloqué jusqu'à la reconstruction complète de sa traçabilité.", "The batch remains on hold until its traceability is completely reconstructed.", "Record Reconciliation")
    ],
    worldBoss: threat("sartorius_contamination_cascade", "Facility-Wide Contamination Cascade", "world-boss-incident", SARTORIUS, "Nonliving contamination-control crisis across connected cleanroom zones: alarm maps, isolated airlocks and quarantined single-use lines, with all staff cooperating in PPE.", ADAPTED, "Le world boss est un incident de maîtrise à contenir et documenter, jamais une attaque d'employés.", "The world boss is a control incident to contain and document, never an employee attack.", "Contain, Clean, Release"),
    stage: "Aubagne White Room Production Line",
    stageMeta: metadata(SARTORIUS, "Bright white classified room in the Aubagne expansion, operators in Everest suits around sterile bags, tubing, connectors and stainless mobile frames.", ADAPTED, "La scène valorise la production et les gestes propres réels.", "The scene foregrounds real production and clean practices."),
    stageVariants: [
      stageVariant("Tactics", "Single-Use Bag Assembly Line", "Very Hard", "Single-Use Seal Integrity Loss", SARTORIUS, "Organized white-room stations assembling clear sterile bags, tubing sets and connectors under controlled airflow.", ADAPTED, "Chaque assemblage suit contrôle, soudure et test d'intégrité.", "Each assembly follows inspection, sealing and integrity testing."),
      stageVariant("RPG", "Aubagne R&D Process Suite", "Expert", "Cleanroom Pressure Cascade Failure", SARTORIUS, "Clean pilot suite with small bioreactor systems, analytical instruments and segregated airlocks, based on the Aubagne R&D expansion.", ADAPTED, "La variante restaure les paramètres de la suite pilote.", "The variant restores the pilot suite's parameters.")
    ],
    gear: [
      gear("sartorius_everest_suit", "Everest Cleanroom Suit", "Tenue cleanroom Everest", { def: 10, hp: 50 }, "https://it.elis.com/it/servizi/elis-cleanroom/microelettronica/tuta-cleanroom-everest-soluzione-di-indumenti-con-cerniera", "White reusable Everest cleanroom coverall with integrated hood and front closure, completed by mask, goggles, gloves and overshoes for the production operator.", ADAPTED, "La tenue limite l'émission particulaire de l'opérateur.", "The suit limits particles emitted by the operator."),
      gear("sartorius_sterile_connector", "Sterile Connector Set", "Jeu de connecteurs stériles", { def: 7, spd: 2 }, SARTORIUS, "Capped single-use sterile connector pair attached to clear tubing, isolated on a sterile field with no readable trademarks.", ADAPTED, "Le connecteur crée un transfert fermé et contrôlé.", "The connector creates a closed controlled transfer."),
      gear("sartorius_integrity_tester", "Integrity Test Unit", "Unité de test d'intégrité", { def: 8, hp: 30 }, SARTORIUS, "Compact cleanroom-compatible pressure integrity tester linked to a clear single-use bag and tablet readout.", ADAPTED, "Le test confirme l'étanchéité avant utilisation.", "The test confirms leak tightness before use.")
    ],
    event: event("evt_sartorius_line_clearance", "Aseptic Line Clearance", "Libération aseptique de ligne", "Operators jointly isolate the deviation, clear every station and resume only after quality verification.", "Les opérateurs isolent ensemble l'écart, libèrent chaque poste et ne reprennent qu'après vérification qualité.", SARTORIUS, "Cooperative white-room reset: sealed waste exit, sanitized surfaces, checked connectors and green status across the production line.", ADAPTED)
  }),

  definePack({
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
  }),

  definePack({
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
  })
]);

if (CANON_ROSTER_WAVE_PART_A.length !== 10) {
  throw new TypeError("CANON_ROSTER_WAVE_PART_A must contain exactly 10 universes.");
}

const runtimeNames = CANON_ROSTER_WAVE_PART_A.map((pack) => pack.universe);
if (new Set(runtimeNames).size !== runtimeNames.length) {
  throw new TypeError("CANON_ROSTER_WAVE_PART_A contains duplicate runtime universe names.");
}
