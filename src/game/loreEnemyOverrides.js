export const LORE_ENEMY_FALLBACK_SLOTS = Object.freeze({
  RIFT_DRONE: "Rift Drone",
  BREACH_STALKER: "Breach Stalker",
  ANOMALY_PACK: "Anomaly Pack",
});

const {
  RIFT_DRONE,
  BREACH_STALKER,
  ANOMALY_PACK,
} = LORE_ENEMY_FALLBACK_SLOTS;

const SLOT_ORDER = Object.freeze([
  RIFT_DRONE,
  BREACH_STALKER,
  ANOMALY_PACK,
]);

const EMPTY_OVERRIDES = Object.freeze([]);

export const slugifyLoreEnemyAsset = (value) => {
  const slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unknown";
};

const candidate = (
  fallbackSlot,
  name,
  weapon,
  special,
  loreFr,
  loreEn,
  referenceUrl,
  visualAnchor,
) => [
  fallbackSlot,
  name,
  weapon,
  special,
  loreFr,
  loreEn,
  referenceUrl,
  visualAnchor,
];

const buildSpritePrompt = (name, special, visualAnchor) => (
  `Pixel art sprite sheet 4x4, 256 px cells, three-quarter RPG view facing right. ${name}. ` +
  `${visualAnchor} Row 1 idle; row 2 movement; row 3 ${special}; row 4 hit reaction. ` +
  "Keep the same anatomy, colors and equipment in all 16 frames. " +
  "Full body centered, flat #00ff00 background, no text, shadow or crop."
);

const defineUniverse = (universe, candidates) => {
  const seenSlots = new Set();
  const universeSlug = slugifyLoreEnemyAsset(universe);

  const entries = candidates.map((source) => {
    const [
      fallbackSlot,
      name,
      weapon,
      special,
      loreFr,
      loreEn,
      referenceUrl,
      visualAnchor,
    ] = source;

    if (!SLOT_ORDER.includes(fallbackSlot)) {
      throw new Error(`Unknown lore enemy fallback slot: ${fallbackSlot}`);
    }
    if (seenSlots.has(fallbackSlot)) {
      throw new Error(`Duplicate lore enemy fallback slot for ${universe}: ${fallbackSlot}`);
    }
    if (
      !name ||
      !weapon ||
      !special ||
      !loreFr ||
      !loreEn ||
      !referenceUrl?.startsWith("https://") ||
      !visualAnchor
    ) {
      throw new Error(`Incomplete lore enemy override for ${universe}: ${name || fallbackSlot}`);
    }

    seenSlots.add(fallbackSlot);

    return Object.freeze({
      fallbackSlot,
      name,
      weapon,
      special,
      lore: Object.freeze({
        fr: loreFr,
        en: loreEn,
      }),
      referenceUrl,
      visualAnchor,
      spritePrompt: buildSpritePrompt(name, special, visualAnchor),
      output: `/sprites/generated/bosses/${universeSlug}/${slugifyLoreEnemyAsset(name)}.png`,
    });
  });

  entries.sort(
    (left, right) =>
      SLOT_ORDER.indexOf(left.fallbackSlot) - SLOT_ORDER.indexOf(right.fallbackSlot),
  );

  return Object.freeze(entries);
};

export const LORE_ENEMY_OVERRIDES = Object.freeze({
  "Altered Beast": defineUniverse("Altered Beast", [
    candidate(
      RIFT_DRONE,
      "Zombie",
      "Fists and teeth",
      "punch and grab",
      "Mort-vivant gris qui ouvre les rangs ennemis d'Altered Beast avec ses coups et ses prises.",
      "A grey undead humanoid that forms Altered Beast's opening enemy line with punches and grabs.",
      "https://alteredbeast.fandom.com/wiki/Zombie",
      "Grey undead humanoid from Altered Beast, bare torso, torn ancient loincloth/armor scraps and stiff raised-arm pose.",
    ),
    candidate(
      BREACH_STALKER,
      "Chicken Stinger",
      "Hooked beak and talons",
      "dive attack",
      "Creature volante d'Altered Beast qui fond sur sa cible avec son bec et ses serres.",
      "An Altered Beast flying creature that dives onto targets with its hooked beak and talons.",
      "https://alteredbeast.fandom.com/wiki/Chicken_Stinger",
      "Small winged reptile/bird monster matching the original arcade sprite palette and hooked attack silhouette.",
    ),
    candidate(
      ANOMALY_PACK,
      "Two-Headed Wolf",
      "Twin jaws",
      "double bite",
      "Loup bicephale rapide d'Altered Beast dont les deux tetes mordent pendant la charge.",
      "A fast two-headed Altered Beast wolf whose twin heads bite during its charge.",
      "https://alteredbeast.fandom.com/wiki/Two-Headed_Wolf",
      "Four-legged wolf monster with two distinct heads, dark arcade palette and low running posture.",
    ),
  ]),

  "Chicken Run": defineUniverse("Chicken Run", [
    candidate(
      RIFT_DRONE,
      "Guard Dog",
      "Jaws",
      "charge and bite",
      "Chien de garde de la ferme Tweedy chargeant les poules et les intrus pour les saisir.",
      "A Tweedy farm guard dog that charges chickens and intruders before biting them.",
      "https://chickenrun.fandom.com/wiki/Guard_Dogs",
      "Large farm guard dog with collar, heavy muzzle and four-legged running silhouette; no armor or fantasy gear.",
    ),
  ]),

  Cloverfield: defineUniverse("Cloverfield", [
    candidate(
      RIFT_DRONE,
      "Cloverfield Parasite",
      "Long claws and inverted serrated jaws",
      "ceiling leap and venomous bite",
      "Petit parasite tombe du monstre de Cloverfield, assez vif pour bondir sur les survivants.",
      "A small parasite shed by the Cloverfield monster, fast enough to leap onto survivors.",
      "https://wikizilla.org/wiki/Human_Scale_Parasite",
      "Dog-sized pale ivory crustacean-like parasite with a low narrow carapace, many very long thin jointed legs, four pairs of tiny black eyes, and an enormous vertically opening serrated jaw with a blue-purple membrane; never a compact beetle or tick.",
    ),
  ]),

  Cthulhu: defineUniverse("Cthulhu", [
    candidate(
      RIFT_DRONE,
      "Deep One",
      "Webbed claws and teeth",
      "claw and bite",
      "Humanoide amphibie des profondeurs qui attaque au corps a corps avec ses griffes palmees.",
      "An amphibious deep-sea humanoid that fights at close range with webbed claws and teeth.",
      "https://lovecraft.fandom.com/wiki/Deep_One",
      "Fish/frog humanoid with wet scales, webbed clawed hands, wide mouth and hunched coastal gait.",
    ),
    candidate(
      ANOMALY_PACK,
      "Shoggoth",
      "Protoplasmic pseudopods",
      "pseudopod crush",
      "Masse protoplasmique changeante qui forme des yeux, des bouches et des pseudopodes pour broyer sa cible.",
      "A mutable protoplasmic mass that forms eyes, mouths and pseudopods to crush its target.",
      "https://lovecraft.fandom.com/wiki/Shoggoth",
      "Black iridescent protoplasmic mass forming temporary eyes and mouths; no fixed limbs or mechanical parts.",
    ),
  ]),

  Dandadan: defineUniverse("Dandadan", [
    candidate(
      RIFT_DRONE,
      "Serpo",
      "Psychokinesis",
      "psychokinetic shockwave",
      "Alien Serpo utilisant ses facultes psychokinetiques pour repousser et immobiliser ses adversaires.",
      "A Serpo alien that uses psychokinesis to repel and restrain opponents.",
      "https://dandadan.fandom.com/wiki/Serpo",
      "True Serpo form: angular slug-like head, broad geometric torso, black body markings, crystal headlight eyes and four-digit hands.",
    ),
    candidate(
      ANOMALY_PACK,
      "Kur Soldier",
      "Bioengineered exosuit weapon modules",
      "exosuit weapon attack",
      "Soldat Kur protege par un exosquelette biofabrique dont les modules assurent l'attaque a distance.",
      "A Kur soldier protected by a bioengineered exosuit whose modules provide ranged attacks.",
      "https://dandadan.fandom.com/wiki/Kur",
      "Soft-bodied Kur enclosed in a bioengineered combat exosuit; use one exact suit from the reference gallery, with its shown weapon modules.",
    ),
  ]),

  Defiance: defineUniverse("Defiance", [
    candidate(
      RIFT_DRONE,
      "Volge Trooper",
      "Oversized energy firearm",
      "heavy energy shot",
      "Fantassin Volge massif dont l'armure lourde absorbe les tirs pendant qu'il riposte avec une arme energetique.",
      "A massive Volge infantryman whose heavy armor absorbs fire while he answers with an energy weapon.",
      "https://expanded.defiancewiki.com/wiki/Volge",
      "Very tall alien in layered grey Volge combat armor, sealed angular helmet and oversized energy firearm.",
    ),
    candidate(
      BREACH_STALKER,
      "99er Raider",
      "Industrial firearm and mining tool",
      "rifle burst or mining-tool strike",
      "Mineur 99er cybernetiquement modifie qui alterne tirs industriels et coups d'outil minier.",
      "A cybernetically altered 99er miner who alternates industrial gunfire with mining-tool strikes.",
      "https://defiance.fandom.com/wiki/Enemies%28Game%29",
      "Cybernetically altered miner, work armor, welding or mining headgear, exposed metal implants and industrial firearm/tool.",
    ),
    candidate(
      ANOMALY_PACK,
      "Hellbug Skitterling",
      "Mandibles",
      "swarm bite",
      "Petit Hellbug qui submerge sa proie en groupe avant de la dechiqueter avec ses mandibules.",
      "A small Hellbug that overwhelms prey in a swarm before tearing into it with its mandibles.",
      "https://defiance.fandom.com/wiki/Hellbugs",
      "Small low-slung insectoid Hellbug with multiple legs, segmented chitin and oversized biting mouth.",
    ),
  ]),

  "Ecco the Dolphin": defineUniverse("Ecco the Dolphin", [
    candidate(
      RIFT_DRONE,
      "Vortex Drone",
      "Carapace claws and autonomous head",
      "grapple, bite and severed-head pursuit",
      "Drone biomecanique Vortex charge de recolter les formes de vie et de defendre la ruche, capable de poursuivre Ecco meme apres avoir perdu son corps.",
      "A biomechanical Vortex worker and hive defender that can continue pursuing Ecco after losing most of its body.",
      "https://eccothedolphin.fandom.com/wiki/Vortex_Drone",
      "Dark green biomechanical arthropod from the original game: tall oval domed head, purple facial cavity, segmented tapering body, two long clawed arms plus smaller limbs, and a narrow tail; no shark body, fish fins, dolphin silhouette, or added metal armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Jellyfish",
      "Stinging tentacles",
      "tentacle sting",
      "Meduse marine dont les tentacules venimeux bloquent le passage d'Ecco.",
      "A marine jellyfish whose stinging tentacles obstruct Ecco's path.",
      "https://eccothedolphin.fandom.com/wiki/Jellyfish",
      "Translucent jellyfish body, trailing tentacles and palette matching the selected Ecco game.",
    ),
  ]),

  "Evil Dead": defineUniverse("Evil Dead", [
    candidate(
      RIFT_DRONE,
      "Deadite",
      "Claws and teeth",
      "claw, bite and possessed lunge",
      "Cadavre humain possede par les forces kandariennes, agressif et capable de bonds soudains.",
      "A human corpse possessed by Kandarian forces, aggressive and prone to sudden lunges.",
      "https://evildead.fandom.com/wiki/Deadite",
      "Possessed human corpse with clouded white eyes, distorted face and torn clothing from the selected Evil Dead era; no unrelated demon armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Skeleton",
      "Sword and small shield",
      "sword slash",
      "Fantassin squelette de l'Armee des Tenebres combattant avec une lame et un petit bouclier.",
      "An Army of Darkness skeletal foot soldier that fights with a sword and small shield.",
      "https://evildead.fandom.com/wiki/Evil_Dead%3A_The_Game",
      "Army of Darkness skeletal foot soldier: exposed bone body, medieval scraps, sword and small shield where visible.",
    ),
  ]),

  Flashback: defineUniverse("Flashback", [
    candidate(
      RIFT_DRONE,
      "Morph Agent",
      "Compact futuristic pistol",
      "pistol shot",
      "Morph infiltre sous apparence humaine qui n'expose sa vraie forme qu'une fois touche.",
      "A Morph infiltrator in human guise whose true form is exposed only when struck.",
      "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Enemies",
      "Humanoid Morph disguise from Flashback, dark coat/uniform and compact futuristic pistol; reveal alien form only on hit/death frames.",
    ),
    candidate(
      BREACH_STALKER,
      "Mutant",
      "Clawed hands",
      "claw strike",
      "Humanoide mute de Flashback qui avance courbe et frappe avec ses griffes.",
      "A mutated Flashback humanoid that advances in a hunched stance and strikes with its claws.",
      "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Enemies",
      "Stocky mutated humanoid matching the original game sprite colors and hunched attack posture.",
    ),
    candidate(
      ANOMALY_PACK,
      "Cyborg Guard",
      "Service rifle",
      "rifle shot",
      "Garde cybernetique blinde qui patrouille avec son arme de service.",
      "An armored cybernetic guard that patrols with its service firearm.",
      "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Enemies",
      "Armored cybernetic guard with hard sci-fi plating, visor and service firearm from the original game.",
    ),
  ]),

  Gremlins: defineUniverse("Gremlins", [
    candidate(
      RIFT_DRONE,
      "Gremlin",
      "Claws and teeth",
      "claw and bite",
      "Gremlin reptilien rapide qui attaque en groupe avec ses griffes et ses dents.",
      "A fast reptilian Gremlin that attacks in groups with claws and teeth.",
      "https://gremlins.fandom.com/wiki/Gremlin",
      "Small reptilian humanoid, green-brown scales, long pointed ears, yellow eyes, clawed hands and hunched posture.",
    ),
    candidate(
      BREACH_STALKER,
      "Bat Gremlin",
      "Wing claws and teeth",
      "dive claw",
      "Mutation volante de Gremlin qui plonge depuis les airs pour lacerer sa cible.",
      "A flying Gremlin mutation that dives from above to rake its target.",
      "https://gremlins.fandom.com/wiki/Bat_Gremlin",
      "Gremlin/bat hybrid with broad membranous wings, reduced forearms, beady eyes and inward-curved ears.",
    ),
  ]),

  H2G2: defineUniverse("H2G2", [
    candidate(
      RIFT_DRONE,
      "Vogon Guard",
      "Standard energy weapon",
      "blaster shot",
      "Garde Vogon lourdement equipe charge de faire appliquer les ordres bureaucratiques par la force.",
      "A heavily equipped Vogon guard who enforces bureaucratic orders with an energy weapon.",
      "https://hitchhikers.fandom.com/wiki/Vogon",
      "Bulky Vogon in severe bureaucratic military uniform, heavy boots and standard energy weapon; use adaptation-specific skin and costume.",
    ),
    candidate(
      BREACH_STALKER,
      "Krikkit War Robot",
      "Cricket-themed war weapon",
      "robot weapon strike",
      "Machine de guerre de Krikkit utilisant un armement inspire du cricket pour combattre a courte et longue portee.",
      "A Krikkit war machine using cricket-themed weaponry at both close and ranged distance.",
      "https://hitchhikers.fandom.com/wiki/Krikkit_robot",
      "White Krikkit war machine with hard geometric armor and cricket-themed weapon silhouette from the referenced adaptation.",
    ),
    candidate(
      ANOMALY_PACK,
      "Ravenous Bugblatter Beast of Traal",
      "Jaws and claws",
      "maul and bite",
      "Predateur geant de Traal qui renverse puis devore tout voyageur a sa portee.",
      "A giant predator from Traal that mauls and devours any traveler within reach.",
      "https://hitchhikers.fandom.com/wiki/Ravenous_Bugblatter_Beast_of_Traal",
      "Huge predatory beast using the exact adaptation/reference anatomy; no invented armor, weapons or extra eyes.",
    ),
  ]),

  "Jet Set Radio": defineUniverse("Jet Set Radio", [
    candidate(
      RIFT_DRONE,
      "Rokkaku Police Officer",
      "Police baton",
      "baton strike",
      "Policier anti-emeute de Tokyo-to poursuivant les skateurs avec sa matraque.",
      "A Tokyo-to riot police officer who pursues skaters with a baton.",
      "https://jetsetradio.fandom.com/wiki/Rokkaku_Police",
      "Tokyo-to police riot uniform with helmet, body armor and baton/firearm matching the selected game sprite.",
    ),
    candidate(
      BREACH_STALKER,
      "Golden Rhino Assassin",
      "Firearm",
      "aimed gunfire",
      "Agent des Golden Rhinos qui traque les Rudies avec des tirs precis.",
      "A Golden Rhinos operative who hunts Rudies with precise gunfire.",
      "https://jetsetradio.fandom.com/wiki/Golden_Rhinos",
      "Golden Rhino operative in black formal combat clothing with gold facial mask/marking and firearm.",
    ),
    candidate(
      ANOMALY_PACK,
      "Noise Tank",
      "Armored skates and body",
      "skating body check",
      "Rival en armure electronique qui percute ses adversaires a pleine vitesse sur ses rollers.",
      "An electronically armored rival who body-checks opponents at full speed on inline skates.",
      "https://jetsetradio.fandom.com/wiki/Noise_Tanks",
      "Blue robotic-looking skater outfit, full helmet/visor, inline skates and bulky electronic armor.",
    ),
  ]),

  "Heavy Metal 2000": defineUniverse("Heavy Metal 2000", [
    candidate(
      RIFT_DRONE,
      "Tyler's Space Pirate",
      "Pirate blaster rifle",
      "blaster rifle burst",
      "Membre de l'equipage pirate de Tyler qui attaque Eden et poursuit Julie avec son armement de bord.",
      "A member of Tyler's pirate crew who attacks Eden and pursues Julie with shipboard weapons.",
      "https://www.sonypictures.com/movies/heavymetal2000",
      "Space pirate from the 2000 animated film, with the same rugged face, scavenged dark combat clothing and compact futuristic rifle visible in the selected film reference; no Nexus armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Uroboris Reptilian Gladiator",
      "Arena blade and claws",
      "gladiator pounce",
      "Guerrier reptilien d'Uroboris issu du peuple que Tyler soumet apres son combat dans l'arene.",
      "A reptilian warrior from Uroboris, part of the people Tyler subjugates after the arena fight.",
      "https://en.wikipedia.org/wiki/Heavy_Metal_2000",
      "Tall muscular reptilian gladiator matching the film's Uroboris species, with scaled skin, arena harness and a simple film-visible melee weapon; no cybernetic redesign.",
    ),
    candidate(
      ANOMALY_PACK,
      "Tyler's Citadel Assault Squad",
      "Pirate rifles and breaching charges",
      "coordinated citadel assault",
      "Escouade de pirates envoyee par Tyler contre la citadelle de la fontaine d'immortalite.",
      "A pirate squad sent by Tyler against the citadel of the fountain of immortality.",
      "https://en.wikipedia.org/wiki/Heavy_Metal_2000",
      "Compact squad of Tyler's film-accurate space pirates sharing the same rugged industrial uniforms and weapons as the selected battle reference; no alien monsters or Nexus insignia.",
    ),
  ]),

  Sharknado: defineUniverse("Sharknado", [
    candidate(
      RIFT_DRONE,
      "Flying Bull Shark",
      "Bite and falling body",
      "crosswind bite dive",
      "Requin-bouledogue projete par la tornade qui traverse l'arene avant de replonger dans l'entonnoir.",
      "A bull shark hurled by the tornado that crosses the arena before falling back into the funnel.",
      "https://en.wikipedia.org/wiki/Sharknado",
      "Anatomically recognizable bull shark suspended in rain and compact storm spray, entire body visible; no humanoid limbs, armor or hybrid features.",
    ),
    candidate(
      BREACH_STALKER,
      "Tornado Tiger Shark",
      "Bite and debris-assisted charge",
      "storm debris ambush",
      "Requin-tigre emporte avec les debris qui surgit d'un angle mort de la tornade.",
      "A tiger shark carried with the debris that bursts from a blind side of the tornado.",
      "https://en.wikipedia.org/wiki/Sharknado",
      "Anatomically recognizable tiger shark with visible dark flank stripes, wet skin and a small amount of airborne B-movie storm debris; no fantasy mutation.",
    ),
    candidate(
      ANOMALY_PACK,
      "Airborne Shark Swarm",
      "Coordinated falling bites",
      "shark rain wave",
      "Vague de requins de plusieurs especes ejectee de l'entonnoir selon la menace centrale des films.",
      "A wave of several shark species ejected from the funnel, matching the films' central threat.",
      "https://en.wikipedia.org/wiki/Sharknado",
      "Small readable group of natural sharks at staggered depths inside the same rain funnel, with no duplicated alpha boss and no humanoid anatomy.",
    ),
  ]),

  "Godzilla The Animated Series": defineUniverse("Godzilla The Animated Series", [
    candidate(
      RIFT_DRONE,
      "Cyber Fly",
      "Cybernetic mandibles and wings",
      "cyber fly dive",
      "Insecte cybernetique commande par les Tachyons lors de l'invasion de Monster Wars.",
      "A cybernetic insect controlled by the Tachyons during the Monster Wars invasion.",
      "https://en.wikipedia.org/wiki/Godzilla:_The_Series",
      "Exact Godzilla: The Series Cyber Fly silhouette, metallic insect body, angular translucent wings and red electronic details in the 1998 animated style.",
    ),
    candidate(
      BREACH_STALKER,
      "Giant Mutant Rat",
      "Teeth and claws",
      "sewer pounce",
      "Rat mutant geant affronte par H.E.A.T. et Godzilla dans la serie animee.",
      "A giant mutant rat fought by H.E.A.T. and Godzilla in the animated series.",
      "https://godzilla.fandom.com/wiki/List_of_Godzilla_monsters",
      "Godzilla: The Series giant mutant rat with hunched rodent anatomy, coarse brown-gray fur, oversized incisors and the series' angular creature proportions.",
    ),
    candidate(
      ANOMALY_PACK,
      "Giant Mutant Termite Swarm",
      "Mandibles and burrowing bodies",
      "termite colony rush",
      "Colonie de termites mutantes geantes qui attaque en groupe comme dans la serie.",
      "A colony of giant mutant termites that attacks as a group as depicted in the series.",
      "https://godzilla.fandom.com/wiki/List_of_Godzilla_monsters",
      "Compact cluster of the animated series' giant termites, with pale segmented bodies, dark heads and large mandibles; no unrelated kaiju anatomy.",
    ),
  ]),

  "Pee-wee": defineUniverse("Pee-wee", [
    candidate(
      RIFT_DRONE,
      "Satan's Helpers Biker",
      "Motorcycle chain and bar furniture",
      "biker bar charge",
      "Membre du gang de motards menace par la chute de ses motos avant la danse de Pee-wee.",
      "A member of the biker gang angered by the fallen motorcycles before Pee-wee's dance.",
      "https://catalog.afi.com/Film/67303-PEE-WEES-BIGADVENTURE",
      "1985 outlaw biker from Satan's Helpers in film-accurate black leather, denim and boots, using grounded bar props; no demonic powers or fantasy armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Warner Bros. Studio Guard",
      "Security baton",
      "soundstage pursuit",
      "Agent de securite du studio qui poursuit Pee-wee lorsqu'il recupere son velo sur le plateau.",
      "A studio security guard who pursues Pee-wee after he recovers his bicycle on the set.",
      "https://en.wikipedia.org/wiki/Pee-wee%27s_Big_Adventure",
      "Ordinary 1985 movie-studio security guard in period uniform with cap and baton, matching the chase sequence; no police tactical armor.",
    ),
    candidate(
      ANOMALY_PACK,
      "Movie-Set Godzilla Performer",
      "Rubber suit tail and body check",
      "soundstage monster stumble",
      "Cascadeur en costume de Godzilla traverse par Pee-wee pendant sa fuite a travers les plateaux du studio.",
      "A performer in a Godzilla suit crossed by Pee-wee during the chase through the studio sets.",
      "https://www.imdb.com/title/tt0089791/fullcredits/",
      "Clearly human-scale rubber movie-monster suit and visible practical-costume proportions from the 1985 soundstage gag; not a real kaiju and no atomic breath.",
    ),
  ]),

  "The Thing": defineUniverse("The Thing", [
    candidate(
      RIFT_DRONE,
      "Dog-Thing",
      "Assimilating tendrils and kennel limbs",
      "kennel assimilation lunge",
      "Imitation du husky qui se deploie dans le chenil en tentacules, pattes articulees et masse assimilatrice.",
      "The husky imitation that unfolds in the kennel into tendrils, jointed limbs and an assimilating mass.",
      "https://www.universalpicturesathome.com/movies/the-thing-1982",
      "The 1982 film's kennel Dog-Thing: recognizable sled-dog head and fur splitting into wet tendrils, flower-like jaws and practical-effect jointed limbs; no generic wolf monster or 2011 creature design.",
    ),
    candidate(
      BREACH_STALKER,
      "Bennings-Thing",
      "Elongated hands and assimilation grip",
      "snowfield escape howl",
      "Assimilation inachevee de Bennings, encore humanoide, avec des mains deformees lors de sa fuite dans la neige.",
      "Bennings' incomplete assimilation, still humanoid with deformed hands during its escape into the snow.",
      "https://www.imdb.com/title/tt0084787/plotsummary/",
      "Bennings-Thing from the 1982 snowfield scene: adult station worker silhouette, torn winter layers, raw elongated malformed hands and open-mouthed howl; no extra tentacle crown or unrelated alien armor.",
    ),
    candidate(
      ANOMALY_PACK,
      "Palmer-Thing",
      "Split-head jaws and spider limbs",
      "blood-test breakout",
      "Imitation de Palmer revelee par le test sanguin, dont la tete se fend en machoire avant l'attaque de Windows.",
      "Palmer's imitation exposed by the blood test, its head splitting into jaws before attacking Windows.",
      "https://www.imdb.com/title/tt0084787/plotsummary/",
      "Palmer-Thing from the 1982 recreation-room blood test: work-clothed human torso with the head split vertically into a huge practical-effect mouth, restrained spider-like limbs and wet tissue; no Blair-Thing mass and no multiple characters.",
    ),
  ]),

  "Killer Tomatoes from Outer Space": defineUniverse("Killer Tomatoes from Outer Space", [
    candidate(
      RIFT_DRONE,
      "Killer Tomato",
      "Rolling body",
      "rolling body slam",
      "Tomate tueuse qui roule, bondit et percute ses victimes sans membres humanoides.",
      "A killer tomato that rolls, lunges and slams into victims without humanoid limbs.",
      "https://killertomatoes.fandom.com/wiki/Killer_Tomato",
      "Real red tomato body with green calyx; no humanoid limbs; rolls and lunges as in the selected screen version.",
    ),
    candidate(
      BREACH_STALKER,
      "Piranha Killer Tomato",
      "Piranha jaws",
      "jaw bite",
      "Variante piranha de la tomate tueuse dont la gueule dentee constitue l'attaque principale.",
      "A piranha variant of the killer tomato whose toothed maw is its primary attack.",
      "https://killertomatoes.fandom.com/wiki/Killer_Tomato",
      "Red tomato fused with a piranha mouth; exposed triangular teeth; animated-series proportions only.",
    ),
  ]),

  "Lost Planet 2": defineUniverse("Lost Planet 2", [
    candidate(
      RIFT_DRONE,
      "Sepia Akrid",
      "Sharp legs and claws",
      "leap and claw",
      "Petit Akrid vif dont le sac de T-ENG reste visible lorsqu'il bondit pour griffer.",
      "A small agile Akrid whose T-ENG sac remains visible as it leaps and claws.",
      "https://lostplanet.fandom.com/wiki/Sepia",
      "Small orange/red insectoid Akrid with exposed glowing thermal energy sac and sharp legs.",
    ),
    candidate(
      BREACH_STALKER,
      "Dongo Akrid",
      "Armored shell",
      "armored roll",
      "Akrid cuirasse qui se replie et roule sur le champ de bataille pour ecraser sa cible.",
      "An armored Akrid that curls up and rolls across the battlefield to crush its target.",
      "https://lostplanet.fandom.com/wiki/Dongo",
      "Armored beetle-like Akrid with thick shell plates, glowing thermal core and curled rolling posture.",
    ),
    candidate(
      ANOMALY_PACK,
      "NEVEC Soldier",
      "Ballistic or energy rifle",
      "rifle burst",
      "Soldat NEVEC en armure climatique qui maintient la pression avec des rafales de fusil.",
      "A cold-weather NEVEC soldier who maintains pressure with rifle bursts.",
      "https://lostplanet.fandom.com/wiki/NEVEC",
      "Human NEVEC combatant in cold-weather sci-fi armor, sealed helmet and standard ballistic or energy rifle.",
    ),
  ]),

  "Mars Attacks": defineUniverse("Mars Attacks", [
    candidate(
      RIFT_DRONE,
      "Martian Soldier",
      "Ray gun",
      "ray-gun shot",
      "Fantassin martien au cerveau expose qui desintegre les humains avec son pistolet a rayons.",
      "An exposed-brain Martian infantryman who disintegrates humans with a ray gun.",
      "https://marsattacks.fandom.com/wiki/Martian_Soldier",
      "Small Martian with exposed oversized green brain, skull-like face, glass helmet, red cape/space uniform and ray gun.",
    ),
  ]),

  Moonwalker: defineUniverse("Moonwalker", [
    candidate(
      RIFT_DRONE,
      "Mr. Big Thug",
      "Fists or handgun",
      "punch or handgun shot",
      "Homme de main de Mr. Big qui se bat a coups de poing ou avec l'arme montree dans son niveau.",
      "One of Mr. Big's henchmen, fighting with punches or the handgun shown for his stage variant.",
      "https://gamefaqs.gamespot.com/genesis/586315-michael-jacksons-moonwalker/faqs/53524",
      "Human gangster from the Sega game; dark suit, fedora or stage-specific street outfit; fists or handgun only when shown by the referenced enemy set.",
    ),
    candidate(
      BREACH_STALKER,
      "Attack Dog",
      "Jaws",
      "running bite",
      "Chien de garde de Mr. Big qui traverse rapidement l'ecran pour mordre.",
      "One of Mr. Big's guard dogs, sprinting across the stage to bite its target.",
      "https://gamefaqs.gamespot.com/genesis/586315-michael-jacksons-moonwalker/faqs/53524",
      "Four-legged guard dog used by Mr. Big; dark coat, visible collar, low attack posture.",
    ),
    candidate(
      ANOMALY_PACK,
      "Zombie",
      "Claws and hands",
      "claw swipe and grab",
      "Cadavre du cimetiere de Moonwalker qui avance lentement avant de griffer et saisir.",
      "A Moonwalker graveyard corpse that shambles forward before clawing and grabbing.",
      "https://www.mobygames.com/game/7432/michael-jacksons-moonwalker/",
      "Moonwalker graveyard enemy: grey-green corpse, torn clothing, raised arms and slow shambling gait.",
    ),
  ]),

  "Overlord Anime": defineUniverse("Overlord Anime", [
    candidate(
      RIFT_DRONE,
      "Sunlight Scripture Soldier",
      "Scripture unit weapon shown in the reference",
      "formation weapon attack",
      "Soldat de la Sunlight Scripture combattant en formation avec l'arme attribuee a son unite.",
      "A Sunlight Scripture soldier who fights in formation with the weapon assigned to the unit.",
      "https://overlordmaruyama.fandom.com/wiki/Sunlight_Scripture",
      "Slane Theocracy scripture unit member in the exact white religious military uniform/armor and insignia shown in the anime; carry the shown weapon only.",
    ),
    candidate(
      BREACH_STALKER,
      "Archangel Flame",
      "Flaming sword",
      "flaming sword dive",
      "Invocation angelique blindee qui plonge sur l'ennemi avec son epee enflammee.",
      "An armored angelic summon that dives onto enemies with a flaming sword.",
      "https://overlordmaruyama.fandom.com/wiki/Archangel_Flame",
      "Armored angelic summon with white wings, bright plate armor and flaming sword as shown in the anime.",
    ),
  ]),

  "Planete Hurlante": defineUniverse("Planete Hurlante", [
    candidate(
      RIFT_DRONE,
      "Type 1 Screamer",
      "Rotary blades",
      "burrow leap and blade strike",
      "Machine tueuse de type 1 qui se cache sous le sol avant de jaillir avec ses lames rotatives.",
      "A Type 1 killing machine that burrows underground before erupting with rotary blades.",
      "https://www.imdb.com/title/tt0114367/plotsummary/",
      "Low metal killing machine, reptile/rat-like profile, articulated legs and tail, exposed rotary blades; no human silhouette.",
    ),
    candidate(
      BREACH_STALKER,
      "Type 2 Screamer",
      "Concealed mechanical blade",
      "infiltration then close-range blade attack",
      "Screamer infiltre sous l'apparence d'un soldat blesse qui revele sa lame a courte portee.",
      "A Screamer disguised as a wounded soldier that reveals its blade at close range.",
      "https://www.springfieldspringfield.co.uk/movie_script.php?movie=screamers",
      "Adult wounded-soldier disguise; dirty battlefield uniform over a mechanical endoskeleton; repeated distress behavior.",
    ),
    candidate(
      ANOMALY_PACK,
      "Type 3 Screamer - David",
      "Concealed mechanical blade",
      "swarm rush and concealed blade attack",
      "Copie de David utilisee comme leurre enfantin avant qu'un groupe revele ses mecanismes meurtriers.",
      "A David copy used as a childlike lure before a group reveals its killing mechanisms.",
      "https://www.imdb.com/title/tt0114367/plotsummary/",
      "Blond child disguise, winter coat and teddy bear; identical copies; mechanical interior only visible on hit.",
    ),
  ]),

  "Re-Animator": defineUniverse("Re-Animator", [
    candidate(
      RIFT_DRONE,
      "Reanimated Corpse",
      "Hands and improvised blunt force",
      "grab and bludgeon",
      "Cadavre de morgue ranime par le reagent, violent et incapable de controler ses mouvements.",
      "A morgue corpse revived by the reagent, violent and unable to control its movements.",
      "https://horror.fandom.com/wiki/Re-Animator_%281985%29",
      "Fresh morgue corpse with mottled post-mortem skin, hospital sheet or morgue clothing and violent uncontrolled movement.",
    ),
    candidate(
      BREACH_STALKER,
      "Reanimated Cat",
      "Claws and teeth",
      "leap and claw",
      "Chat mort ranime par le reagent qui bondit malgre ses blessures chirurgicales.",
      "A dead cat revived by the reagent that keeps leaping despite its surgical wounds.",
      "https://horror.fandom.com/wiki/Re-Animator_%281985%29",
      "Mutilated tabby cat corpse from the film, visible surgical damage and low four-legged attack silhouette.",
    ),
    candidate(
      ANOMALY_PACK,
      "Lobotomized Morgue Corpse",
      "Bare hands",
      "grab and strike",
      "Corps de morgue ranime puis lobotomise, dirige vers sa cible par des mouvements raides.",
      "A revived and lobotomized morgue body directed at its target with stiff movements.",
      "https://horror.fandom.com/wiki/Re-Animator_%281985%29",
      "Reanimated morgue body with visible head surgery, hospital/morgue clothing and stiff controlled movement.",
    ),
  ]),

  REC: defineUniverse("REC", [
    candidate(
      RIFT_DRONE,
      "Infected",
      "Hands and teeth",
      "rush, grab and bite",
      "Habitant infecte de l'immeuble place en quarantaine, pris de mouvements rapides et rabiques.",
      "An infected resident of the quarantined apartment building, driven by fast rabid movements.",
      "https://horror.fandom.com/wiki/REC_%282007%29",
      "Human victim with ordinary apartment clothing, pale skin, blood around eyes/mouth and violent rabid movement; no zombie decay not shown in REC.",
    ),
  ]),

  "Roger Rabbit": defineUniverse("Roger Rabbit", [
    candidate(
      RIFT_DRONE,
      "Smart Ass",
      "Revolver",
      "revolver shot",
      "Chef Toon des fouines de Doom, arme d'un revolver et reconnaissable a son costume violet.",
      "The Toon leader of Doom's weasels, armed with a revolver and marked by his purple suit.",
      "https://disney.fandom.com/wiki/Smart_Ass",
      "Tall Toon weasel in purple zoot suit and fedora, cigar and revolver; preserve exaggerated cartoon proportions.",
    ),
    candidate(
      BREACH_STALKER,
      "Greasy",
      "Switchblade",
      "knife slash",
      "Fouine Toon mince qui attaque avec son cran d'arret en profitant de ses membres extensibles.",
      "A thin Toon weasel that attacks with a switchblade and exaggerated flexible limbs.",
      "https://disney.fandom.com/wiki/Greasy",
      "Thin Toon weasel with green zoot suit, slick hair and switchblade; long flexible cartoon limbs.",
    ),
    candidate(
      ANOMALY_PACK,
      "Psycho",
      "Head and body",
      "leaping headbutt",
      "Fouine Toon en camisole qui se jette tete la premiere sur ses adversaires.",
      "A straitjacketed Toon weasel that hurls itself headfirst at opponents.",
      "https://disney.fandom.com/wiki/Psycho",
      "Toon weasel in straitjacket with wild red hair and unstable grin; attacks with body lunges.",
    ),
  ]),

  "SCP Foundation": defineUniverse("SCP Foundation", [
    candidate(
      RIFT_DRONE,
      "SCP-049-2 Instance",
      "Bare hands",
      "grab and blunt strike",
      "Cadavre humain transforme par SCP-049, anime de mouvements simples et violents.",
      "A human corpse altered by SCP-049 and animated with simple, violent movements.",
      "https://scp-wiki.wikidot.com/scp-049",
      "Human corpse altered by SCP-049: surgical incisions, stiff gait and damaged civilian or staff clothing; follow the exact SCP article image when present.",
    ),
    candidate(
      BREACH_STALKER,
      "SCP-939 Instance",
      "Jaws and claws",
      "voice lure then bite",
      "Predateur SCP-939 sans yeux qui imite des voix pour attirer une victime avant de mordre.",
      "An eyeless SCP-939 predator that mimics voices to lure a victim before biting.",
      "https://scp-wiki.wikidot.com/scp-939",
      "Large red quadrupedal predator with exposed-muscle texture, elongated limbs, no visible eyes and a toothed mouth.",
    ),
  ]),

  "Secret of Monkey Island": defineUniverse("Secret of Monkey Island", [
    candidate(
      RIFT_DRONE,
      "Ghost Pirate",
      "Cutlass",
      "cutlass slash",
      "Pirate spectral de l'equipage de LeChuck qui combat avec son sabre d'abordage.",
      "A spectral pirate from LeChuck's crew who fights with a cutlass.",
      "https://monkeyisland.fandom.com/wiki/Ghost_pirate",
      "Translucent green/blue pirate corpse with period coat, hat and cutlass; spectral glow follows the game palette.",
    ),
    candidate(
      BREACH_STALKER,
      "Skeleton Pirate",
      "Cutlass",
      "cutlass slash",
      "Squelette anime en tenue de pirate qui manie encore son sabre.",
      "An animated skeleton in pirate clothing that still wields its cutlass.",
      "https://monkeyisland.fandom.com/wiki/Skeleton",
      "Animated human skeleton wearing pirate hat/cloth scraps and holding a cutlass.",
    ),
    candidate(
      ANOMALY_PACK,
      "Piranha Poodle",
      "Sharp teeth",
      "pack bite",
      "Petit caniche aux dents de piranha qui attaque toujours avec sa meute.",
      "A small poodle with piranha teeth that attacks as part of a pack.",
      "https://monkeyisland.fandom.com/wiki/Piranha_Poodles",
      "Small white poodle with exaggerated sharp teeth and aggressive pack stance; no armor.",
    ),
  ]),

  "Shaun of the Dead": defineUniverse("Shaun of the Dead", [
    candidate(
      RIFT_DRONE,
      "Zombie",
      "Hands and teeth",
      "grab and bite",
      "Londonien recemment transforme qui avance lentement pour agripper et mordre les survivants.",
      "A recently turned Londoner who shambles forward to grab and bite survivors.",
      "https://shaunofthedead.fandom.com/wiki/Zombies",
      "Recently dead human in ordinary London clothing; pale skin, blood around mouth, unfocused eyes and stiff gait.",
    ),
  ]),

  Sinister: defineUniverse("Sinister", [
    candidate(
      RIFT_DRONE,
      "Ghost Child",
      "Bare hands",
      "silent flank and grab",
      "Enfant victime de Bughuul qui se deplace silencieusement dans les angles morts avant de saisir.",
      "One of Bughuul's child victims, moving silently through blind spots before grabbing.",
      "https://sinister.fandom.com/wiki/Ghost_Children",
      "One of Bughuul's dead children: desaturated skin, darkened eyes and exact period clothing from a home-movie murder sequence.",
    ),
  ]),

  Splatterhouse: defineUniverse("Splatterhouse", [
    candidate(
      RIFT_DRONE,
      "Deadman",
      "Claws and teeth",
      "claw and bite",
      "Mort-vivant putrefie de Splatterhouse qui avance pour griffer et mordre.",
      "A rotting Splatterhouse undead that shambles forward to claw and bite.",
      "https://splatterhouse.fandom.com/wiki/Deadman",
      "Rotting humanoid enemy from Splatterhouse, exposed wounds, torn clothing and shambling posture.",
    ),
    candidate(
      BREACH_STALKER,
      "Boreworm",
      "Biting mouth",
      "swarm bite",
      "Petit parasite segmente qui rampe en groupe et s'accroche avec son extremite dentee.",
      "A small segmented parasite that crawls in groups and latches on with its biting end.",
      "https://splatterhouse.fandom.com/wiki/Boreworm",
      "Short segmented flesh-colored parasite with ringed body and biting end; low crawling silhouette.",
    ),
    candidate(
      ANOMALY_PACK,
      "Hellhound",
      "Jaws and claws",
      "running bite",
      "Chien demoniaque emacie qui sprinte au ras du sol pour refermer ses machoires.",
      "A gaunt demonic hound that sprints low to the ground before closing its jaws.",
      "https://splatterhouse.fandom.com/wiki/Hellhound",
      "Gaunt demonic dog with exposed ribs/bone details, dark hide and low sprinting posture.",
    ),
  ]),

  "Squid Game": defineUniverse("Squid Game", [
    candidate(
      RIFT_DRONE,
      "Pink Soldier",
      "Compact rifle",
      "rifle burst",
      "Garde masque au triangle charge d'executer les ordres armes des jeux.",
      "A triangle-masked guard tasked with carrying out the games' armed orders.",
      "https://squid-game.fandom.com/wiki/Guard",
      "Pink/red hooded jumpsuit, black full-face mask marked with a white triangle and compact firearm.",
    ),
    candidate(
      BREACH_STALKER,
      "Pink Manager",
      "Sidearm and radio",
      "command and sidearm shot",
      "Gestionnaire masque au carre qui coordonne les gardes et utilise son arme de poing si necessaire.",
      "A square-masked manager who coordinates guards and uses a sidearm when required.",
      "https://squid-game.fandom.com/wiki/Guard",
      "Pink/red hooded jumpsuit, black full-face mask marked with a white square; radio/sidearm only when shown.",
    ),
  ]),

  "Starship Troopers": defineUniverse("Starship Troopers", [
    candidate(
      RIFT_DRONE,
      "Warrior Bug",
      "Twin scythe forelimbs",
      "dual scythe slash",
      "Caste guerriere arachnide qui charge l'infanterie et tranche avec ses deux membres en faux.",
      "An Arachnid warrior caste that charges infantry and slashes with twin scythe forelimbs.",
      "https://starshiptroopers.fandom.com/wiki/Warrior_Bug",
      "Black and orange arachnid chitin, four running legs and two large scythe forelimbs; low forward combat posture.",
    ),
    candidate(
      BREACH_STALKER,
      "Hopper Bug",
      "Grasping limbs and wings",
      "dive and impale",
      "Caste volante arachnide qui plonge sur les soldats pour les empaler.",
      "A flying Arachnid caste that dives onto soldiers to impale them.",
      "https://starshiptroopers.fandom.com/wiki/Hopper_Bug",
      "Winged arachnid caste with compact chitin body, long grasping limbs and translucent insect wings.",
    ),
    candidate(
      ANOMALY_PACK,
      "Plasma Bug",
      "Plasma abdomen",
      "plasma bombardment",
      "Caste d'artillerie arachnide qui projette du plasma depuis son abdomen lumineux.",
      "An Arachnid artillery caste that launches plasma from its luminous abdomen.",
      "https://starshiptroopers.fandom.com/wiki/Plasma_Bug",
      "Massive beetle-like arachnid with reinforced legs and a swollen luminous blue plasma abdomen.",
    ),
  ]),

  "Streets of Rage": defineUniverse("Streets of Rage", [
    candidate(
      RIFT_DRONE,
      "Galsia",
      "Fists or knife",
      "punch or knife charge",
      "Voyou commun du Syndicat qui frappe a mains nues ou charge avec un couteau selon sa variante.",
      "A common Syndicate thug who punches bare-handed or charges with a knife, depending on the variant.",
      "https://streetsofrage.fandom.com/wiki/Galsia",
      "Common Syndicate thug: denim vest and jeans, black shirt, boots; knife only for the armed variant.",
    ),
    candidate(
      BREACH_STALKER,
      "Signal",
      "Unarmed grappling",
      "slide kick and throw",
      "Punk mobile du Syndicat qui glisse sous les attaques avant d'enchainer une projection.",
      "A mobile Syndicate punk who slides under attacks before following with a throw.",
      "https://streetsofrage.fandom.com/wiki/Signal",
      "Mohawk punk in bright street clothing; low slide stance and judo throw animation.",
    ),
    candidate(
      ANOMALY_PACK,
      "Donovan",
      "Fists",
      "uppercut",
      "Voyou muscle specialise dans l'uppercut, dangereux contre les attaques aeriennes.",
      "A muscular thug whose signature uppercut punishes aerial attacks.",
      "https://streetsofrage.fandom.com/wiki/Donovan",
      "Bald muscular thug, sleeveless top and trousers; upright boxing posture with signature uppercut.",
    ),
  ]),

  "Team Fortress 2": defineUniverse("Team Fortress 2", [
    candidate(
      RIFT_DRONE,
      "Heavy",
      "Sasha minigun",
      "minigun burst",
      "Mercenaire lourd qui verrouille une zone avec les rafales de sa mitrailleuse Sasha.",
      "A heavy mercenary who locks down an area with bursts from his minigun, Sasha.",
      "https://wiki.teamfortress.com/wiki/Heavy",
      "Large broad RED or BLU mercenary, sleeveless team shirt, ammo belt, fingerless gloves and minigun Sasha.",
    ),
    candidate(
      BREACH_STALKER,
      "Soldier",
      "Rocket launcher",
      "rocket shot",
      "Mercenaire equipe d'un lance-roquettes qui avance sous ses propres explosions.",
      "A rocket-launcher mercenary who advances under the pressure of his own explosions.",
      "https://wiki.teamfortress.com/wiki/Soldier",
      "Team-colored military coat, steel helmet covering the eyes, grenades on chest and shoulder-fired rocket launcher.",
    ),
    candidate(
      ANOMALY_PACK,
      "Spy",
      "Butterfly knife and revolver",
      "backstab or revolver shot",
      "Assassin infiltre qui alterne tir au revolver, deguisement et coup de couteau dans le dos.",
      "An infiltrating assassin who alternates revolver fire, disguise and backstabs.",
      "https://wiki.teamfortress.com/wiki/Spy",
      "Slim team-colored suit, balaclava, leather gloves, revolver and butterfly knife; optional disguise mask only.",
    ),
  ]),

  "House of the Dead": defineUniverse("House of the Dead", [
    candidate(
      RIFT_DRONE,
      "Sam Type A-1",
      "Hands and teeth",
      "lumbering bite",
      "Creature humanoide commune du manoir Curien qui avance lentement puis mord a courte portee.",
      "The common Curien Mansion humanoid creature that advances slowly before biting at close range.",
      "https://thehouseofthedead.fandom.com/wiki/Sam",
      "Exact 1997 Sam Type A-1 game creature: bald decomposed humanoid, original torn clothing and exposed flesh colors, no modern remake redesign, armor or weapon.",
    ),
    candidate(
      BREACH_STALKER,
      "Name Type G-2",
      "Slime spit and teeth",
      "slime projectile swarm",
      "Creature G-2 rare en forme de limace cerebrale qui mord et projette des boules de mucus.",
      "The rare G-2 brain-slug creature that bites and spits slime balls in groups.",
      "https://thehouseofthedead.fandom.com/wiki/Name",
      "Exact original Name Type G-2: dark-pink brain-shaped slug body, sharp long teeth, small pink tentacles and antennae; no humanoid anatomy and no written name label.",
    ),
    candidate(
      ANOMALY_PACK,
      "Kenfis Type F-1",
      "Teeth and pounce",
      "zigzag canine leap",
      "Creature canine F-1 qui charge en zigzag avant de bondir et mordre.",
      "The F-1 canine creature that charges in a zigzag before pouncing and biting.",
      "https://thehouseofthedead.fandom.com/wiki/Kenfis",
      "Exact original Kenfis Type F-1: low eyeless gargoyle-like canine, exposed side ribs, rough gray-brown hide and small leathery wings; never a normal dog or flying dragon.",
    ),
  ]),

  "House of the Dead 2": defineUniverse("House of the Dead 2", [
    candidate(
      RIFT_DRONE,
      "David",
      "Hands and teeth",
      "grab and bite",
      "Creature humanoide lente et commune qui attaque par morsure ou coup de bras.",
      "A slow common humanoid creature that attacks with bites and arm swipes.",
      "https://thehouseofthedead.fandom.com/wiki/David",
      "Exact 1998 David model: shirtless decayed humanoid in tattered jeans, one bulging eye, missing facial and chest flesh; no House of the Dead 4 redesign.",
    ),
    candidate(
      BREACH_STALKER,
      "Ebitan",
      "Claws and aquatic lunge",
      "canal ambush",
      "Creature aquatique qui surgit des canaux et frappe a courte portee.",
      "An aquatic creature that emerges from canals and strikes at close range.",
      "https://thehouseofthedead.fandom.com/wiki/Ebitan",
      "Exact House of the Dead 2 Ebitan aquatic humanoid, wet green-brown body, hunched posture and long clawed arms; no generic fish monster redesign.",
    ),
    candidate(
      ANOMALY_PACK,
      "Devilon",
      "Wings and claws",
      "diving claw attack",
      "Creature volante qui fond sur les agents avec ses griffes depuis les hauteurs de la ville.",
      "A flying creature that dives at the agents with its claws from above the city route.",
      "https://thehouseofthedead.fandom.com/wiki/Devilon",
      "Exact House of the Dead 2 Devilon: small red-brown batlike humanoid creature, broad membrane wings, pointed ears and clawed limbs; no giant demon armor.",
    ),
  ]),

  "House of the Dead 3": defineUniverse("House of the Dead 3", [
    candidate(
      RIFT_DRONE,
      "Mark",
      "Hands and teeth",
      "facility rush",
      "Creature humanoide commune de l EFI qui accelere pour saisir et mordre les agents.",
      "A common EFI humanoid creature that accelerates to grab and bite the agents.",
      "https://thehouseofthedead.fandom.com/wiki/Mark",
      "Exact House of the Dead III Mark creature from the Sega guide art, preserving its ruined work clothing, decomposed head and facility-zombie proportions; no generic soldier armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Rogan Commando",
      "Dual combat knives and kicks",
      "failed-team knife rush",
      "Ancien membre de l unite Rogan reanime dans l installation EFI, qui conserve son agilite et attaque avec deux couteaux de combat et des coups de pied.",
      "A reanimated member of Rogan's unit inside the EFI facility who retains his agility and attacks with two combat knives and kicks.",
      "https://thehouseofthedead.fandom.com/wiki/Rogan_Commando",
      "Exact House of the Dead III Rogan Commando: black undershirt, white collared shirt and white trousers, black sleeveless vest, gloves, boots, knee pads and cap, one large combat knife in each hand; no firearm, helmet or generic modern armor.",
    ),
    candidate(
      ANOMALY_PACK,
      "Cain",
      "Vine-like arms",
      "plant-hybrid vine sweep",
      "Hybride humain-vegetal de l EFI qui fouette les agents avec ses longs bras en forme de lianes.",
      "An EFI human-plant hybrid that lashes the agents with its long vine-like arms.",
      "https://thehouseofthedead.fandom.com/wiki/List_of_creatures_in_The_House_of_the_Dead_III",
      "Exact House of the Dead III Cain from the Sega Perfect Guide: low creature-plant hybrid with a bark-and-vine body, long flexible vine arms and rooted organic limbs; no biblical costume, humanoid clothing, dragon anatomy or generic reptile armor.",
    ),
  ]),

  "Voyage de Chihiro": defineUniverse("Voyage de Chihiro", [
    candidate(
      RIFT_DRONE,
      "Paper Bird",
      "Folded paper edges",
      "swarm cut",
      "Shikigami de papier qui attaque en nuee en utilisant ses plis comme des ailes tranchantes.",
      "A paper shikigami that attacks in a flock, using its folds as cutting wings.",
      "https://ghibli.fandom.com/wiki/Paper_Bird",
      "Flat white paper shikigami folded into angular bird forms, black ink markings, no organic feathers or metal parts.",
    ),
  ]),

  "Zombies Ate My Neighbors": defineUniverse("Zombies Ate My Neighbors", [
    candidate(
      RIFT_DRONE,
      "Zombie",
      "Hands and teeth",
      "grab and bite",
      "Zombie suburbain du jeu SNES qui avance bras tendus pour saisir et mordre.",
      "A suburban SNES zombie that advances with outstretched arms to grab and bite.",
      "https://zombiesatemyneighbors.fandom.com/wiki/Zombie",
      "Green-grey suburban zombie in torn everyday clothing, arms forward, matching the SNES enemy sprite.",
    ),
    candidate(
      BREACH_STALKER,
      "Chainsaw Maniac",
      "Two-handed chainsaw",
      "chainsaw rush",
      "Maniaque masque qui poursuit les voisins en chargeant avec sa tronconneuse a deux mains.",
      "A masked maniac who chases the neighbors with a two-handed chainsaw rush.",
      "https://zombiesatemyneighbors.fandom.com/wiki/Chainsaw_Maniac",
      "Large masked human in work clothes holding a two-handed chainsaw; use the exact SNES palette and mask.",
    ),
    candidate(
      ANOMALY_PACK,
      "Evil Doll",
      "Canonical handheld toy weapon",
      "leaping toy strike",
      "Poupee miniature hostile qui bondit en brandissant l'arme montree par son sprite d'origine.",
      "A hostile miniature doll that leaps while wielding the weapon shown by its original sprite.",
      "https://zombiesatemyneighbors.fandom.com/wiki/Evil_Doll",
      "Tiny hostile doll with toy proportions, painted face and the exact handheld weapon shown in the game.",
    ),
  ]),
});

export const getLoreEnemyOverrides = (universe) => (
  LORE_ENEMY_OVERRIDES[universe] ?? EMPTY_OVERRIDES
);

export const getLoreEnemyOverride = (universe, fallbackSlot) => (
  getLoreEnemyOverrides(universe).find((entry) => entry.fallbackSlot === fallbackSlot) ?? null
);
