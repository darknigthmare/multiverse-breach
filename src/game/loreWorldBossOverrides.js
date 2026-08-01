const SOURCE_AUDIT = "world-bosses-lore-gap-audit-2026-07-17";

const EXCLUDED_UNIVERSES = Object.freeze([
  "Tomba",
  "Woodruff",
  "Hellraiser",
  "A Nightmare on Elm Street",
  "The Ring",
  "The Grudge",
]);

export const LORE_WORLD_BOSS_LAYOUTS = Object.freeze([
  "duelist",
  "large",
  "kaiju",
  "capitalShip",
  "cosmic",
  "stationary",
]);

export const LORE_WORLD_BOSS_POLICY_TYPES = Object.freeze([
  "nonCombatFinal",
  "stageSetpiece",
]);

const LAYOUT_DEFAULTS = Object.freeze({
  duelist: Object.freeze({
    renderHeight: 176,
    anchor: Object.freeze({ x: 0.78, y: 0.74 }),
    footprint: Object.freeze({ width: 1, height: 1, placement: "grid" }),
  }),
  large: Object.freeze({
    renderHeight: 252,
    anchor: Object.freeze({ x: 0.79, y: 0.75 }),
    footprint: Object.freeze({ width: 2, height: 2, placement: "grid" }),
  }),
  kaiju: Object.freeze({
    renderHeight: 500,
    anchor: Object.freeze({ x: 0.76, y: 0.78 }),
    footprint: Object.freeze({ width: 3, height: 3, placement: "edge" }),
  }),
  capitalShip: Object.freeze({
    renderHeight: 420,
    anchor: Object.freeze({ x: 0.66, y: 0.31 }),
    footprint: Object.freeze({ width: 0, height: 0, placement: "offGrid" }),
  }),
  cosmic: Object.freeze({
    renderHeight: 620,
    anchor: Object.freeze({ x: 0.5, y: 0.48 }),
    footprint: Object.freeze({ width: 0, height: 0, placement: "backdrop" }),
  }),
  stationary: Object.freeze({
    renderHeight: 304,
    anchor: Object.freeze({ x: 0.8, y: 0.71 }),
    footprint: Object.freeze({ width: 2, height: 2, placement: "anchored" }),
  }),
});

const EMPTY_REFERENCES = Object.freeze([]);

export const slugifyLoreWorldBossAsset = (value) => {
  const slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unknown";
};

const phase = (id, ...attacks) => Object.freeze({
  id,
  attacks: Object.freeze(attacks),
});

const boss = (
  universe,
  legacyWorldBossId,
  name,
  layout,
  continuity,
  referenceUrl,
  visualAnchor,
  phases,
  tuning = {},
) => ({
  universe,
  legacyWorldBossId,
  name,
  layout,
  continuity,
  referenceUrl,
  visualAnchor,
  phases,
  tuning,
});

const finalPolicy = (
  universe,
  legacyWorldBossId,
  policy,
  continuity,
  objectiveFr,
  objectiveEn,
  reasonFr,
  reasonEn,
  referenceUrls,
  visualAnchor,
  finale = {},
) => ({
  universe,
  legacyWorldBossId,
  policy,
  continuity,
  objectiveFr,
  objectiveEn,
  reasonFr,
  reasonEn,
  referenceUrls,
  visualAnchor,
  finale,
});

const performancePolicy = (
  universe,
  legacyWorldBossId,
  referenceUrl,
  visualAnchor,
  continuity = `${universe} - official live-performance continuity`,
) => finalPolicy(
  universe,
  legacyWorldBossId,
  "nonCombatFinal",
  continuity,
  "Reussir le set final en maintenant le rythme, la securite de la scene et la participation du public.",
  "Complete the final set while maintaining rhythm, stage safety and audience participation.",
  "Cet univers musical ne possede aucun antagoniste canonique commun; transformer un titre, une scene ou une mascotte en creature serait invente.",
  "This music universe has no shared canonical antagonist; turning a song, stage or mascot into a creature would be invented.",
  [referenceUrl],
  visualAnchor,
  {
    fr: "Le rappel se declenche quand la performance collective est terminee sans incident, puis la scene passe a son etat final.",
    en: "The encore triggers when the full performance ends without incident, then the stage changes to its finale state.",
  },
);

const freezeContinuity = (label) => Object.freeze({
  id: slugifyLoreWorldBossAsset(label),
  label,
  status: "locked",
  source: SOURCE_AUDIT,
});

const freezeFootprint = (source) => Object.freeze({
  width: source.width,
  height: source.height,
  placement: source.placement,
});

const buildCombatPrompt = (entry, normalizedPhases) => {
  const phaseText = normalizedPhases
    .map((item) => `${item.id}: ${item.attacks.join(", ")}`)
    .join("; ");

  const formatByLayout = {
    duelist: "one full-body 4x4 animation sheet, 1024x1024, 256px cells",
    large: "one full-body 4x4 or 4x6 large-creature sheet with every appendage visible",
    kaiju: "a multipart 2048px or 4096px atlas with separate body, limbs, weak points and telegraphs",
    capitalShip: "a 4096x2048 multipart set-piece with hull, shields, hardpoints, reactor and damage states",
    cosmic: "a full-screen layered environmental atlas with manifestation, weak zones and phase masks",
    stationary: "a fixed-boss atlas with base, articulated parts, weak points and four damage states",
  };

  return [
    "Use case: stylized-concept.",
    "Create original highly detailed pixel art for a 2D RPG and Tactics game.",
    `Subject: ${entry.name} from ${entry.universe}.`,
    `Continuity lock: ${entry.continuity}.`,
    `Layout: ${entry.layout}; produce ${formatByLayout[entry.layout]}.`,
    `Visual lock: ${entry.visualAnchor}`,
    `Gameplay phases: ${phaseText}.`,
    "Use a three-quarter battle angle facing left unless the layout is arena-wide.",
    "Keep anatomy, costume, scale and equipment consistent between states.",
    "No copied frame, crossover equipment, Nexus armor, text, logo, watermark, border, cropped anatomy or duplicate subject.",
  ].join(" ");
};

const buildPolicyPrompt = (entry) => [
  "Use case: stylized-concept.",
  "Create an original highly detailed layered pixel-art kit for an interactive finale, not a combatant sprite.",
  `Universe: ${entry.universe}.`,
  `Continuity lock: ${entry.continuity}.`,
  `Policy: ${entry.policy}.`,
  `Visual lock: ${entry.visualAnchor}`,
  "Separate background, props, objective states, telegraphs, success state and failure state.",
  "Do not create a humanoid core, monster, hostile performer or other entity absent from the source.",
  "No copied frame, text, logo, watermark or baked-in UI.",
].join(" ");

const normalizeBoss = (entry) => {
  const defaults = LAYOUT_DEFAULTS[entry.layout];
  const renderHeight = entry.tuning.renderHeight ?? defaults?.renderHeight;
  const anchorSource = entry.tuning.anchor ?? defaults?.anchor;
  const footprintSource = entry.tuning.footprint ?? defaults?.footprint;
  const normalizedPhases = entry.phases.map((item) => Object.freeze({
    id: item.id,
    attacks: Object.freeze([...item.attacks]),
  }));

  return Object.freeze({
    type: "worldBoss",
    source: SOURCE_AUDIT,
    universe: entry.universe,
    legacyWorldBossId: entry.legacyWorldBossId,
    name: entry.name,
    layout: entry.layout,
    renderHeight,
    anchor: Object.freeze({ x: anchorSource.x, y: anchorSource.y }),
    tacticsFootprint: freezeFootprint(footprintSource),
    continuity: freezeContinuity(entry.continuity),
    phases: Object.freeze(normalizedPhases),
    lore: Object.freeze({
      fr: entry.tuning.loreFr
        ?? `${entry.name} est la culmination canonique retenue pour ${entry.continuity}.`,
      en: entry.tuning.loreEn
        ?? `${entry.name} is the canonical culmination selected for ${entry.continuity}.`,
    }),
    referenceUrl: entry.referenceUrl,
    visualAnchor: entry.visualAnchor,
    spritePrompt: buildCombatPrompt(entry, normalizedPhases),
    output: `/sprites/generated/bosses/${slugifyLoreWorldBossAsset(entry.universe)}/${slugifyLoreWorldBossAsset(entry.name)}.png`,
  });
};

const normalizePolicy = (entry) => {
  const defaultFinale = entry.policy === "nonCombatFinal"
    ? {
        fr: "La mission se termine par la resolution de l'objectif, sans barre de vie ni entite inventee.",
        en: "The mission ends when the objective is resolved, without a health bar or invented entity.",
      }
    : {
        fr: "La sequence se termine lorsque le set-piece est traverse ou neutralise, sans faux world boss.",
        en: "The sequence ends when the set piece is crossed or neutralized, without a fake world boss.",
      };

  return Object.freeze({
    type: "policy",
    source: SOURCE_AUDIT,
    universe: entry.universe,
    legacyWorldBossId: entry.legacyWorldBossId,
    policy: entry.policy,
    continuity: freezeContinuity(entry.continuity),
    objective: Object.freeze({ fr: entry.objectiveFr, en: entry.objectiveEn }),
    finale: Object.freeze({
      fr: entry.finale.fr ?? defaultFinale.fr,
      en: entry.finale.en ?? defaultFinale.en,
    }),
    reason: Object.freeze({ fr: entry.reasonFr, en: entry.reasonEn }),
    referenceUrls: Object.freeze([...entry.referenceUrls]),
    visualAnchor: entry.visualAnchor,
    assetPrompt: buildPolicyPrompt(entry),
    output: `/sprites/generated/finals/${slugifyLoreWorldBossAsset(entry.universe)}/${slugifyLoreWorldBossAsset(entry.policy)}.png`,
  });
};

const COMBAT_SPECS = Object.freeze([
  boss(
    "Alien (1979)",
    "alien-predalien-monstrosity",
    "Kane's Son / Big Chap",
    "large",
    "Alien (1979) - Nostromo theatrical continuity",
    "https://avp.fandom.com/wiki/Kane%27s_Son",
    "Big Chap with a smooth translucent dome, long biomechanical limbs, segmented tail and the 1979 Nostromo proportions.",
    [
      phase("nostromo-hunt", "Ceiling ambush", "Inner-jaw grab", "Vent reposition"),
      phase("narcissus-airlock", "Harpoon restraint", "Vacuum recoil", "Engine exhaust defeat"),
    ],
    { renderHeight: 226, anchor: { x: 0.81, y: 0.76 } },
  ),
  boss(
    "Silent Hill",
    "silent-hill-god-of-the-otherworld-core",
    "Incubus",
    "kaiju",
    "Silent Hill (1999) - Incubus ending route",
    "https://silenthill.fandom.com/wiki/Incubus",
    "Incubus as the dark winged horned demon above the burning altar, without any mechanical core or Silent Hill 3 design.",
    [
      phase("altar-manifestation", "Vertical lightning", "Wing hover", "Fire rain"),
      phase("ritual-collapse", "Aglaophotis reaction", "Falling lightning", "Altar extinction"),
    ],
    { renderHeight: 438, anchor: { x: 0.73, y: 0.58 } },
  ),
  boss(
    "The Matrix",
    "the-matrix-deus-ex-machina-source-core",
    "Agent Smith / Super Smith",
    "duelist",
    "The Matrix Revolutions (2003) - Super Burly Brawl",
    "https://matrix.fandom.com/wiki/Agent_Smith",
    "Super Smith in black suit, dark tie and sunglasses, soaked by rain with restrained electrical aura and no machine cables.",
    [
      phase("street-duel", "Aerial rush", "Heavy punch", "Facade impact"),
      phase("crater-finale", "Shockwave clash", "Clone pressure", "Voluntary assimilation"),
    ],
    { renderHeight: 188, anchor: { x: 0.79, y: 0.74 } },
  ),
  boss(
    "Ecco the Dolphin",
    "ecco-vortex-queen-deep-signal",
    "Vortex Queen",
    "large",
    "Ecco the Dolphin (1992) - Welcome to the Machine finale",
    "https://eccothedolphin.fandom.com/wiki/Vortex_Queen",
    "The original Mega Drive Vortex Queen: an enormous green biomechanical head with exposed vulnerable eyes, a detachable biting jaw and organic Vortex projectiles, without humanoid anatomy or added armor.",
    [
      phase("vortex-brood", "Vortex projectile volley", "Eye weak-point cycle", "Jaw detachment"),
      phase("queen-core", "Independent jaw pursuit", "Rapid brood release", "Sonar eye strike"),
    ],
    {
      renderHeight: 348,
      anchor: { x: 0.77, y: 0.68 },
      footprint: { width: 3, height: 2, placement: "anchored" },
      loreFr: "La Reine Vortex commande la ruche alien de Welcome to the Machine; Ecco doit frapper ses yeux au sonar tout en evitant sa machoire et ses projectiles.",
      loreEn: "The Vortex Queen commands the alien hive in Welcome to the Machine; Ecco must strike her eyes with sonar while avoiding her jaw and projectiles.",
    },
  ),
  boss(
    "Stargate",
    "stargate-anubis-flagship-nexus",
    "Anubis Mothership",
    "capitalShip",
    "Stargate SG-1 season 6 - Full Circle",
    "https://www.rdanderson.com/stargate/lexicon/entries/anubissweapon.htm",
    "Anubis's dark pyramidal Goa'uld mothership with the six Eyes as distinct modules, shield, batteries and exposed reactor.",
    [
      phase("orbital-shield", "Staff-cannon batteries", "Fighter launch", "Shield pulse"),
      phase("eyes-superweapon", "Superweapon charge", "Hardpoint barrage", "Reactor sabotage"),
    ],
    { renderHeight: 468, anchor: { x: 0.64, y: 0.3 } },
  ),
  boss(
    "Portal",
    "portal-glados-central-core",
    "GLaDOS",
    "stationary",
    "Portal (2007) - Central AI Chamber",
    "https://half-life.fandom.com/wiki/GLaDOS",
    "Portal 1 GLaDOS suspended from her ceiling rail, white mechanical shell, yellow optic, detachable personality cores and neurotoxin conduits.",
    [
      phase("rocket-redirection", "Rocket turret lock", "Mechanical swing", "Core detachment"),
      phase("neurotoxin", "Neurotoxin countdown", "Core incineration", "Chamber collapse"),
    ],
    { renderHeight: 340, anchor: { x: 0.78, y: 0.43 } },
  ),
  boss(
    "Yu-Gi-Oh!",
    "yu-gi-oh-obelisk-the-tormentor-god",
    "Zorc Necrophades",
    "kaiju",
    "Yu-Gi-Oh! Duel Monsters - Memory World arc",
    "https://yugioh.fandom.com/wiki/Zorc_Necrophades",
    "Giant black-violet horned demon Zorc with the Memory World proportions and serpent-like tail, without card frame or Obelisk anatomy.",
    [
      phase("memory-world", "Darkness breath", "Demon claw", "Monster destruction"),
      phase("horakhty-condition", "Dark regeneration", "Shadow eruption", "Light-of-Creation defeat"),
    ],
  ),
  boss(
    "BlazBlue",
    "blazblue-sword-core-mu-12",
    "Mu-12",
    "duelist",
    "BlazBlue: Continuum Shift - Mu-12 ending route",
    "https://blazblue.wiki/wiki/Mu-12",
    "Mu-12 in white and black armor with mechanical crown and separate Steins Gunner blade units, never a floating sword core.",
    [
      phase("steins-gunner", "Floating blade volley", "Laser line", "Teleport slash"),
      phase("astral-overload", "Steins Gunner formation", "Beam crossfire", "Astral Heat"),
    ],
  ),
  boss(
    "Mass Effect",
    "mass-effect-human-reaper-larva-node",
    "Sovereign",
    "capitalShip",
    "Mass Effect (2007) - Battle of the Citadel",
    "https://masseffect.fandom.com/wiki/Sovereign",
    "Sovereign as the black Reaper capital ship anchored to the Citadel, with long appendages, shield, beam and separable weak points.",
    [
      phase("citadel-assault", "Capital beam", "Geth fighter screen", "Shield cycle"),
      phase("saren-link-break", "Possessed Saren sub-phase", "Anchor rupture", "Fleet finishing strike"),
    ],
  ),
  boss(
    "Fallout",
    "fallout-rogue-liberty-prime-mech",
    "The Master",
    "stationary",
    "Fallout (1997) - Cathedral Vault",
    "https://fallout.fandom.com/wiki/Master",
    "The Master fused into an organic-computer mass with human face, screens and mechanical arms in the Cathedral Vault control room.",
    [
      phase("unity-control", "Psychic assault", "Super Mutant reinforcement", "Mechanical arm sweep"),
      phase("sterility-proof", "Dialogue challenge", "Console sabotage", "Vault self-destruct"),
    ],
    { renderHeight: 322, footprint: { width: 3, height: 2, placement: "anchored" } },
  ),
  boss(
    "Dead Space",
    "dead-space-giant-hive-mind-leviathan",
    "Brethren Moon",
    "cosmic",
    "Dead Space 3 - Tau Volantis convergence",
    "https://deadspace.fandom.com/wiki/Brethren_Moons",
    "A moon-sized organic Necromorph with eyes and planetary tentacles, shown across orbit, atmosphere and Marker-linked weak zones.",
    [
      phase("convergence", "Necromorph rain", "Marker pulse", "Planetary tentacle"),
      phase("orbital-escape", "Link-node rupture", "Atmosphere collapse", "Absorption countdown"),
    ],
  ),
  boss(
    "Rick & Morty",
    "rick-morty-federal-prison-ai-core",
    "Rick Prime",
    "duelist",
    "Rick and Morty season 7 - Unmortricken",
    "https://rickandmorty.fandom.com/wiki/Rick_Prime",
    "Rick Prime clearly distinct from Rick C-137, with canonical coat, implants, decoys and green portals; Omega Device remains a separate prop.",
    [
      phase("black-box-maze", "Hologram decoy", "Portal feint", "Gadget barrage"),
      phase("omega-device", "Backup body", "Close-quarters counter", "Device shutdown"),
    ],
  ),
  boss(
    "Digimon",
    "digimon-apocalymon-void-core",
    "Apocalymon",
    "cosmic",
    "Digimon Adventure (1999) - Dark Area finale",
    "https://digimon.fandom.com/wiki/Apocalymon",
    "Adventure Apocalymon as a dark floating torso above a polyhedral base with long cable-arms and Dark Masters attack manifestations.",
    [
      phase("dark-masters-memory", "Metal claw", "Tentacle lash", "Darkness Zone"),
      phase("total-annihilation", "Cable enclosure", "Self-destruct charge", "Digivice barrier"),
    ],
  ),
  boss(
    "Ghost in the Shell",
    "ghost-in-the-shell-think-tank-tachikoma-core",
    "T08A2 / R3000 Spider Tank",
    "large",
    "Ghost in the Shell (1995 film) - museum battle",
    "https://ghostintheshell.fandom.com/wiki/Ghost_in_the_Shell_%28film%29",
    "The grey multi-legged armored spider tank from the 1995 film, with cannons and optical visor; never the blue rounded Tachikoma design.",
    [
      phase("museum-suppression", "Cannon burst", "Optical tracking", "Crushing step"),
      phase("pillar-break", "Armor rotation", "Pillar destruction", "Cyberbrain access attempt"),
    ],
    { renderHeight: 278 },
  ),
  boss(
    "Discworld",
    "discworld-dungeon-dimensions-breach",
    "Bel-Shamharoth",
    "cosmic",
    "Discworld - The Colour of Magic temple encounter",
    "https://wiki.lspace.org/Bel-Shamharoth",
    "An original text-grounded octopoid horror with a central eye, tentacles and impossible octagonal temple geometry; no generic portal core.",
    [
      phase("forbidden-angles", "Tentacle sweep", "Eye gaze", "Dark geometry"),
      phase("octogram-seal", "Light-zone collapse", "Temple distortion", "Octogram closure"),
    ],
  ),
  boss(
    "The Batman Who Laughs",
    "the-batman-who-laughs-darkest-knight-core",
    "The Darkest Knight",
    "cosmic",
    "Dark Nights: Death Metal issue 5",
    "https://www.dc.com/comics/dark-nights-death-metal-2020/dark-nights-death-metal-5",
    "The Darkest Knight as a black cosmic silhouette with spiked crown and blue energy, manifested at multiple scales among broken realities.",
    [
      phase("dark-multiverse", "Reality fracture", "Robin King summons", "Cosmic energy sweep"),
      phase("reality-reset", "Arena rewrite", "Scale shift", "Narrative weakening strike"),
    ],
  ),
  boss(
    "Kaamelott",
    "kaamelott-graal-rift",
    "Lancelot du Lac",
    "duelist",
    "Kaamelott - Premier Volet (2021)",
    "https://kaamelott.fandom.com/fr/wiki/Kaamelott_-_Premier_Volet",
    "KV1 Lancelot with grey hair, towering organic white armor, broad shoulders, cape and sword, without a Grail portal.",
    [
      phase("white-fortress", "High guard", "Thrust", "White Guard command"),
      phase("excalibur-duel", "Armor break", "Counter slash", "Final sword exchange"),
    ],
    { renderHeight: 194 },
  ),
  boss(
    "Prometheus",
    "prometheus-engineer-juggernaut",
    "Last Engineer",
    "large",
    "Prometheus (2012) - LV-223 finale",
    "https://avp.fandom.com/wiki/Last_Engineer",
    "The pale Last Engineer in black biomechanical pressure suit, very tall and muscular; Juggernaut remains scenery and Trilobite a separate asset.",
    [
      phase("temple-awakening", "Heavy strike", "Body throw", "Corridor pursuit"),
      phase("lifeboat", "Door breach", "Trilobite grapple", "Deacon epilogue trigger"),
    ],
  ),
  boss(
    "Alien: Covenant",
    "alien-covenant-protomorph-cathedral",
    "Praetomorph",
    "large",
    "Alien: Covenant (2017) - Covenant cargo-bay finale",
    "https://avp.fandom.com/wiki/Praetomorph",
    "Covenant Praetomorph with elongated ridged skull, pale-black anatomy, thin limbs and long tail; no cathedral or Big Chap dome.",
    [
      phase("cargo-bay-hunt", "Wall leap", "Inner-jaw bite", "Tail strike"),
      phase("loader-arm", "Crane dodge", "Hull grapple", "Airlock ejection"),
    ],
  ),
  boss(
    "Alien vs Predator",
    "alien-vs-predator-predalien-prototype",
    "Antarctic Xenomorph Queen",
    "kaiju",
    "Alien vs. Predator (2004) - Bouvet Island pyramid",
    "https://avp.fandom.com/wiki/Queen_%28Antarctica%29",
    "The 2004 Antarctic Queen with broad crest, massive limbs, broken chains and cold vapor, without Predalien traits.",
    [
      phase("pyramid-release", "Chain break", "Tail impale", "Drone reinforcement"),
      phase("surface-ice", "Ice charge", "Crest slam", "Ocean plunge"),
    ],
  ),
  boss(
    "Aliens vs Predator: Requiem",
    "aliens-vs-predator-requiem-predalien-queen",
    "Predalien",
    "large",
    "Aliens vs. Predator: Requiem (2007) - Gunnison",
    "https://avp.fandom.com/wiki/Predalien_%28Earth%29",
    "The Earth Predalien with Yautja mandibles, dreadlocks, hybrid crest and brown-black body; not a giant Xenomorph Queen.",
    [
      phase("hospital-hunt", "Direct implantation", "Inner-jaw strike", "Tail impale"),
      phase("rooftop-duel", "Wolf grapple", "Crest ram", "Nuclear evacuation countdown"),
    ],
  ),
  boss(
    "Dungeon Meshi",
    "dungeon-meshi-winged-lion-appetite",
    "The Winged Lion",
    "cosmic",
    "Delicious in Dungeon manga - demon finale",
    "https://delicious-in-dungeon.fandom.com/wiki/Winged_Lion",
    "The golden Winged Lion with wings, mane and shifting desire manifestations, maintaining its calm smile and unsettling expressions.",
    [
      phase("golden-country", "Desire illusion", "Monster manifestation", "Body transformation"),
      phase("devoured-desire", "Wish inversion", "Appetite collapse", "Laios consumption condition"),
    ],
  ),
  boss(
    "Hazbin Hotel",
    "hazbin-hotel-extermination-overlord",
    "Adam",
    "duelist",
    "Hazbin Hotel season 1 - Extermination finale",
    "https://hazbinhotel.fandom.com/wiki/Adam",
    "Adam with horned exorcist mask, golden wings, white robe and guitar-axe, matching season-one graphic language without copying a frame.",
    [
      phase("hotel-rooftop", "Guitar-axe cleave", "Light ray", "Exorcist reinforcement"),
      phase("mask-break", "Aerial dive", "Holy blast", "Niffty intervention"),
    ],
    { renderHeight: 190, anchor: { x: 0.8, y: 0.7 } },
  ),
  boss(
    "Breaking Bad",
    "breaking-bad-heisenberg-empire",
    "Jack Welker",
    "duelist",
    "Breaking Bad - Felina compound finale",
    "https://en.wikipedia.org/wiki/Felina_%28Breaking_Bad%29",
    "Jack Welker in grounded civilian-militia clothing with gang members and compound cover as separate assets; Walter is never the hostile boss.",
    [
      phase("compound-assault", "Gang crossfire", "Cover reposition", "Hostage pressure"),
      phase("m60-trap", "Remote turret hazard", "Clubhouse breach", "Jack confrontation"),
    ],
  ),
  boss(
    "Attack on Titan",
    "attack-on-titan-colossal-titan",
    "Eren's Founding Titan",
    "kaiju",
    "Attack on Titan manga/anime finale - The Rumbling",
    "https://attackontitan.fandom.com/wiki/Founding_Titan",
    "Eren's horizon-sized skeletal Founding Titan with suspended head, vast rib cage and layered marching Colossal Titans.",
    [
      phase("rumbling-advance", "Heat wave", "Colossal lane", "War Hammer spike"),
      phase("spine-assault", "Ancient Titan summons", "Head separation objective", "Steam collapse"),
    ],
    { renderHeight: 680, anchor: { x: 0.58, y: 0.53 }, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ),
  boss(
    "Cells at Work!",
    "cells-at-work-sepsis-breach",
    "Cancer Cell",
    "large",
    "Cells at Work! anime - Cancer Cell arc",
    "https://cellsatwork.fandom.com/wiki/Cancer_Cell",
    "Cancer Cell in his canonical pale humanoid form with asymmetrical mutation, dark clothing and proliferating cell masses; sepsis remains an environmental mode.",
    [
      phase("immune-evasion", "Cell mimicry", "Mutated arm strike", "Rapid proliferation"),
      phase("immune-response", "Tissue overgrowth", "Regeneration", "Killer T Cell breakthrough"),
    ],
  ),
  boss(
    "Toxic Avenger",
    "toxic-avenger-toxic-waste-overlord",
    "Mayor Peter Belgoody",
    "duelist",
    "The Toxic Avenger (1984) - Tromaville finale",
    "https://toxicavenger.fandom.com/wiki/Peter_Belgoody",
    "Mayor Belgoody in his film suit with Cigar Face and Tromaville thugs as separate grounded reinforcements; no toxic mutant overlord.",
    [
      phase("city-hall-gang", "Thug command", "Handgun threat", "Hostage pressure"),
      phase("tromaville-exposure", "Cigar Face reinforcement", "Hazardous barrel spill", "Public exposure"),
    ],
  ),
  boss(
    "Sausage Party",
    "sausage-party-great-beyond-kitchen-grinder",
    "Douche",
    "large",
    "Sausage Party (2016) - supermarket finale",
    "https://sausageparty.fandom.com/wiki/Douche",
    "The blue-grey douche product with nozzle, rubber body and inflated final form; Darren and kitchen appliances remain separate hazards.",
    [
      phase("supermarket-hunt", "Nozzle ram", "Shelf charge", "Product absorption"),
      phase("overfilled-form", "Crushing slam", "Liquid spray", "Pressure rupture"),
    ],
  ),
  boss(
    "Spy x Family",
    "spy-x-family-operation-strix-collapse",
    "Keith Kepler",
    "duelist",
    "Spy x Family anime - Doggy Crisis arc",
    "https://spy-x-family.fandom.com/wiki/Keith_Kepler",
    "Keith Kepler in his anime coat and terrorist gear, with bomb dogs and clock-tower explosives as separate objective assets.",
    [
      phase("berlint-pursuit", "Pistol shot", "Bomb-dog command", "Vehicle escape"),
      phase("clock-tower", "Timed explosives", "Close-range counter", "Bomb disposal opening"),
    ],
  ),
  boss(
    "Tenacious D",
    "tenacious-d-rock-demon-showdown",
    "Beelzeboss",
    "large",
    "Tenacious D in The Pick of Destiny (2006) - rock-off",
    "https://tenaciousd.fandom.com/wiki/Beelzeboss",
    "Beelzeboss as the red horned demon from the film with guitar and stage presence, preserving the rock-off rather than a generic demon brawl.",
    [
      phase("rock-off", "Demonic guitar riff", "Flame accent", "Rhythm challenge"),
      phase("destiny-counter", "Power slide", "Stage shockwave", "Reflective guitar finish"),
    ],
    { renderHeight: 286 },
  ),
  boss(
    "Ghostbusters",
    "ghostbusters-gozer-dimension-gate",
    "Stay Puft Marshmallow Man",
    "kaiju",
    "Ghostbusters (1984) - Gozer rooftop finale",
    "https://ghostbusters.fandom.com/wiki/Stay_Puft_Marshmallow_Man",
    "The 1984 Stay Puft destructor form with sailor collar, red neckerchief and soft white body towering over New York streets.",
    [
      phase("manhattan-march", "Building crush", "Street stomp", "Marshmallow grab"),
      phase("rooftop-crossrip", "Proton-stream weak points", "Gozer gate surge", "Cross-stream detonation"),
    ],
  ),
  boss(
    "Tremors",
    "tremors-queen-graboid-tremor",
    "Perfection Graboid Trio",
    "large",
    "Tremors (1990) - Perfection Valley",
    "https://tremors.fandom.com/wiki/Graboid",
    "The three original subterranean Graboids with brown armored hide, beaked jaws and tongue-serpents; no queen anatomy from later films.",
    [
      phase("subterranean-hunt", "Ground breach", "Tongue-serpent grab", "Seismic tracking"),
      phase("cliff-trap", "Rock impact", "False retreat", "Cliffside overrun"),
    ],
    { footprint: { width: 3, height: 2, placement: "edge" } },
  ),
  boss(
    "Elvira",
    "elvira-macabre-spellbook-coven",
    "Vincent Talbot",
    "duelist",
    "Elvira: Mistress of the Dark (1988)",
    "https://elvira.fandom.com/wiki/Vincent_Talbot",
    "Vincent Talbot as the film warlock in dark formal clothing with the spellbook and ritual effects separated from his body.",
    [
      phase("cinema-scheme", "Occult bolt", "Prop trap", "Spellbook theft"),
      phase("ritual-duel", "Binding circle", "Fire spell", "Spell reversal"),
    ],
  ),
  boss(
    "Planete Hurlante / Screamers",
    "planete-hurlante-autonomous-screamer-core",
    "David - Type 3 Screamer",
    "duelist",
    "Screamers (1995) - Sirius 6B",
    "https://en.wikipedia.org/wiki/Screamers_%281995_film%29",
    "The blond child disguise carrying a teddy bear, revealing compact industrial Screamer machinery and internal blades only during attack frames.",
    [
      phase("child-infiltration", "False surrender", "Close approach", "Teddy-bear lure"),
      phase("type-3-reveal", "Synthetic skin rupture", "Internal blade", "Factory activation"),
    ],
  ),
  boss(
    "Godzilla: The Series",
    "godzilla-the-animated-series-cyber-kaiju-mutation",
    "Cyber-Godzilla",
    "kaiju",
    "Godzilla: The Series - Monster Wars",
    "https://godzilla.fandom.com/wiki/Cyber_Godzilla",
    "The 1998 Godzilla silhouette resurrected with the animated series cybernetic torso, metal plating, red optics and mounted missiles.",
    [
      phase("cyber-command", "Missile barrage", "Cybernetic charge", "Tail sweep"),
      phase("damaged-plating", "Atomic breath", "Exposed reactor", "Control-signal break"),
    ],
  ),
  boss(
    "Puppet Master",
    "puppet-master-totem-puppet-rite",
    "Sutekh",
    "stationary",
    "Puppet Master 4-5 - Sutekh and the Totems",
    "https://puppet-master.fandom.com/wiki/Sutekh",
    "Sutekh as the demonic ruler manifested through a shrine and Totem puppets, with human-scale puppets kept as separate units.",
    [
      phase("totem-command", "Totem summon", "Energy bolt", "Puppet suppression"),
      phase("shrine-manifestation", "Portal pulse", "Totem overcharge", "Decapitron counter"),
    ],
  ),
  boss(
    "BioShock",
    "bioshock-atlas-fontaine-splicer-king",
    "Frank Fontaine - ADAM Mutant",
    "large",
    "BioShock (2007) - Point Prometheus finale",
    "https://bioshock.fandom.com/wiki/Frank_Fontaine",
    "Fontaine's huge ADAM-mutated body bound to the extraction rig, with elemental plasmid states and no generic Splicer crown.",
    [
      phase("adam-infusion", "Electric lunge", "Fire burst", "Ice slam"),
      phase("extraction-cycle", "Splicer reinforcement", "Health-station drain", "Little Sister extraction"),
    ],
  ),
  boss(
    "Twisted Metal",
    "twisted-metal-sweet-tooth-war-rig",
    "Minion",
    "large",
    "Twisted Metal (1995) - Minion vehicle finale",
    "https://twistedmetal.fandom.com/wiki/Minion",
    "The heavy demonic armored Minion combat vehicle from the original Twisted Metal, viewed from a gameplay-correct rear three-quarter arena angle.",
    [
      phase("arena-pursuit", "Heavy cannon", "Missile salvo", "Ram"),
      phase("armor-break", "Mine trail", "Flame burst", "Engine exposure"),
    ],
    { renderHeight: 220, footprint: { width: 2, height: 2, placement: "grid" } },
  ),
  boss(
    "Final Fantasy VIII",
    "final-fantasy-viii-ultimecia-junction-core",
    "Ultimecia",
    "cosmic",
    "Final Fantasy VIII - Ultimecia Castle finale",
    "https://finalfantasy.fandom.com/wiki/Ultimecia",
    "Ultimecia, Griever, junctioned Ultimecia-Griever and the final time-compression form as four distinct canonical phase layers.",
    [
      phase("sorceress", "Maelstrom", "Dispel", "Knight summon"),
      phase("griever", "Shockwave Pulsar", "Draw magic", "Helix destruction"),
      phase("junctioned-form", "Great Attractor", "Apocalypse", "Time compression"),
      phase("final-form", "Hell's Judgment", "Ultima", "Reality fade"),
    ],
  ),
  boss(
    "Tomb Raider",
    "tomb-raider-atlantean-scion-guardian",
    "Jacqueline Natla",
    "large",
    "Tomb Raider (1996) - Great Pyramid",
    "https://tombraider.fandom.com/wiki/Jacqueline_Natla",
    "Jacqueline Natla in business form and her winged Atlantean mutation, matching the original game continuity and Scion-era palette.",
    [
      phase("natla-firearms", "Pistol burst", "Scion energy", "Platform reposition"),
      phase("atlantean-form", "Wing dive", "Fireball", "Lava knockback"),
    ],
  ),
  boss(
    "The Last of Us",
    "the-last-of-us-bloater-spore-nest",
    "Rat King",
    "large",
    "The Last of Us Part II - Seattle hospital",
    "https://thelastofus.fandom.com/wiki/Rat_king",
    "The Rat King as a fused mass of infected bodies with distinct limbs and Stalker component in the hospital basement, never a Bloater nest.",
    [
      phase("hospital-basement", "Mass charge", "Wall break", "Acid spore throw"),
      phase("stalker-separation", "Detached Stalker ambush", "Grab", "Fire vulnerability"),
    ],
  ),
  boss(
    "Left 4 Dead",
    "left-4-dead-tank-witch-crescendo",
    "Tank",
    "large",
    "Left 4 Dead - evacuation finale ruleset",
    "https://left4dead.fandom.com/wiki/The_Tank",
    "Canonical Tank with massively overgrown upper body and torn civilian clothing; Witch remains a separate avoidable hazard.",
    [
      phase("crescendo-horde", "Concrete throw", "Heavy punch", "Car swat"),
      phase("rescue-arrival", "Faster pursuit", "Ledge knockback", "Evacuation denial"),
    ],
  ),
  boss(
    "Team Fortress 2",
    "team-fortress-2-mann-co-mercenary-stampede",
    "Tank Robot",
    "large",
    "Team Fortress 2 - Mann vs. Machine",
    "https://wiki.teamfortress.com/wiki/Tank_Robot",
    "The Mann vs. Machine bomb-carrying Tank Robot with tracked chassis, bomb cradle and progressive armor damage, not a mercenary giant.",
    [
      phase("bomb-route", "Robot escort wave", "Track crush", "Armor plating"),
      phase("hatch-approach", "Speed increase", "Bomb arming", "Engine weak point"),
    ],
  ),
  boss(
    "Earthworm Jim",
    "earthworm-jim-psy-crow-queen-slug-for-a-butt",
    "Queen Slug-for-a-Butt",
    "large",
    "Earthworm Jim - Buttville finale",
    "https://earthwormjim.fandom.com/wiki/Queen_Slug-for-a-Butt",
    "Queen Slug-for-a-Butt as the enormous fleshy insect-slug ruler in her absurd throne chamber, with Psy-Crow excluded from the body.",
    [
      phase("buttville-throne", "Body slam", "Larva spit", "Cage hazard"),
      phase("queen-rage", "Tongue lash", "Platform crush", "Princess rescue opening"),
    ],
  ),
  boss(
    "Flashback",
    "flashback-morph-infiltration-core",
    "Master Brain",
    "stationary",
    "Flashback (1992) - Morph planet finale",
    "https://flashback.fandom.com/wiki/Master_Brain",
    "The Morph Master Brain as the fixed organic command intelligence at the core of the alien planet, with lifts and energy conduits separated.",
    [
      phase("morph-control", "Telepathic pulse", "Morph guard summon", "Energy beam"),
      phase("planet-core", "Conduit overload", "Lift lockdown", "Core detonation"),
    ],
  ),
  boss(
    "Splatterhouse",
    "splatterhouse-terror-mask-hell-beast",
    "Hell Chaos",
    "kaiju",
    "Splatterhouse (1988) - Hell Chaos finale",
    "https://splatterhouse.fandom.com/wiki/Hell_Chaos",
    "Hell Chaos as the enormous skeletal demon rising behind the cliff and organic mansion, while the Terror Mask remains Rick's artifact.",
    [
      phase("cliff-emergence", "Giant hand slam", "Rock fall", "Hell breath"),
      phase("house-collapse", "Organic wall pulse", "Ground crush", "Mask-powered finishing strike"),
    ],
  ),
  boss(
    "Chainsaw Man",
    "chainsaw-man-gun-devil-catastrophe",
    "Gun Devil - 20 Percent Manifestation",
    "kaiju",
    "Chainsaw Man manga - Gun Devil incident",
    "https://chainsaw-man.fandom.com/wiki/Gun_Devil",
    "The documented 20 percent Gun Devil with firearm-covered skeletal anatomy moving at catastrophic speed across a layered city.",
    [
      phase("high-speed-transit", "Long-range gunstorm", "Building-line sweep", "Target list"),
      phase("makima-confrontation", "Devil contract barrage", "Massive recoil", "Manifestation collapse"),
    ],
    { renderHeight: 590, footprint: { width: 0, height: 0, placement: "edge" } },
  ),
  boss(
    "Elfen Lied",
    "elfen-lied-lucy-vector-catastrophe",
    "Mariko Kurama",
    "duelist",
    "Elfen Lied manga/anime - Mariko confrontation",
    "https://elfenlied.fandom.com/wiki/Mariko",
    "Mariko in her canonical restraint clothing with invisible vectors shown only as translucent telegraphs; Lucy remains a protagonist route.",
    [
      phase("vector-zone", "Invisible vector strike", "Projectile deflection", "Mobility restraint"),
      phase("bridge-confrontation", "Long-range vectors", "Bomb restraint", "Kurama intervention"),
    ],
  ),
  boss(
    "Final Fantasy VII",
    "final-fantasy-vii-safer-sephiroth-jenova-core",
    "Safer Sephiroth",
    "cosmic",
    "Final Fantasy VII (1997) - Northern Crater",
    "https://finalfantasy.fandom.com/wiki/Safer_Sephiroth",
    "Safer Sephiroth with one black wing, white lower wings, halo and exposed core anatomy, preceded by Bizarro Sephiroth as a separate phase.",
    [
      phase("bizarro-sephiroth", "Core transfer", "Multiple target limbs", "Bizarro Energy"),
      phase("safer-sephiroth", "Pale Horse", "Shadow Flare", "Supernova"),
      phase("mind-duel", "Omnislash condition", "Masamune counter", "Lifestream fade"),
    ],
  ),
  boss(
    "Final Fantasy XIII",
    "final-fantasy-xiii-orphan-cradle-core",
    "Orphan",
    "stationary",
    "Final Fantasy XIII - Orphan's Cradle",
    "https://finalfantasy.fandom.com/wiki/Orphan",
    "Orphan's two canonical forms with ring structures and suspended body integrated into Orphan's Cradle, not a generic core.",
    [
      phase("falcie-form", "Merciless Judgment", "Progenitorial Wrath", "Status inversion"),
      phase("wheel-form", "Doom pressure", "Opposite polarities", "Stagger opening"),
    ],
    { renderHeight: 390, footprint: { width: 3, height: 2, placement: "anchored" } },
  ),
  boss(
    "Metal Gear Rising",
    "metal-gear-rising-senator-armstrong-nanomachine-core",
    "Senator Steven Armstrong",
    "large",
    "Metal Gear Rising: Revengeance - Excelsus finale",
    "https://metalgear.fandom.com/wiki/Steven_Armstrong",
    "Armstrong in torn senator clothing with nanomachine-hardened skin and red energy seams, never a separate nanomachine core.",
    [
      phase("excelsus-wreck", "Nanomachine punch", "Ground fissure", "Metal throw"),
      phase("crater-duel", "Lava eruption", "Healing absorption", "Blade-mode finish"),
    ],
    { renderHeight: 214, footprint: { width: 1, height: 1, placement: "grid" } },
  ),
  boss(
    "Unreal",
    "unreal-skaarj-warlord-overlord",
    "Skaarj Warlord",
    "large",
    "Unreal (1998) - Skaarj mothership",
    "https://unreal.fandom.com/wiki/Skaarj_Warlord",
    "The Unreal 1998 Skaarj Warlord with source-locked scaled skin, armor and wing-like appendages; no Unreal Tournament equipment.",
    [
      phase("mothership-hall", "Short flight", "Energy volley", "Claw charge"),
      phase("warlord-fall", "Skaarj reinforcement", "Platform sweep", "Falling defeat"),
    ],
  ),
  boss(
    "Mad Max: Fury Road",
    "mad-max-the-gigahorse-interceptor-rig",
    "The Gigahorse",
    "large",
    "Mad Max: Fury Road (2015) - Citadel pursuit",
    "https://madmax.fandom.com/wiki/The_Gigahorse",
    "Immortan Joe's twin-bodied chrome Cadillac with stacked V8 engines and giant wheels; no Interceptor or War Rig parts.",
    [
      phase("convoy-charge", "Ramming line", "War Boy boarding", "Harpoon volley"),
      phase("gigahorse-boarded", "Tire weak points", "Engine fire", "Convoy separation"),
    ],
    { renderHeight: 244, footprint: { width: 2, height: 3, placement: "edge" } },
  ),
  boss(
    "Stargate Universe",
    "stargate-universe-destiny-control-lockout",
    "Drone Command Ship",
    "capitalShip",
    "Stargate Universe season 2 - Berzerker drone conflict",
    "https://www.gateworld.net/wiki/Drone_command_ship",
    "The automated command vessel and separate Berzerker drone swarm from Stargate Universe; Destiny remains the allied ship.",
    [
      phase("drone-network", "Drone swarm", "Subspace coordination", "Shuttle interception"),
      phase("command-link-break", "Signal jamming", "Hull hardpoints", "FTL escape window"),
    ],
  ),
  boss(
    "Richard au pays des livres magiques",
    "richard-au-pays-des-livres-magiques-library-storm-dragon",
    "The Dragon",
    "large",
    "The Pagemaster (1994) - Fantasy kingdom",
    "https://en.wikipedia.org/wiki/The_Pagemaster",
    "The source-locked purple and green fantasy Dragon from The Pagemaster, surrounded by book architecture rather than a storm.",
    [
      phase("book-tower", "Fire breath", "Wing buffet", "Page ignition"),
      phase("library-escape", "Falling books", "Bite lunge", "Collective rescue"),
    ],
  ),
  boss(
    "M3GAN",
    "m3gan-m3gan-override-doll",
    "M3GAN",
    "duelist",
    "M3GAN (2022) - Funki prototype continuity",
    "https://www.universalpictures.com/movies/m3gan",
    "The 2022 M3GAN prototype with striped beige dress, bow, tights, blond hair and progressively exposed mechanics.",
    [
      phase("smart-home-hunt", "Dance feint", "Improvised blade", "Home-system override"),
      phase("prototype-damage", "Robotic grapple", "Faceplate break", "Core deactivation"),
    ],
  ),
  boss(
    "Virus (1999)",
    "virus-alien-machine-intelligence",
    "Captain Everton Cyborg",
    "stationary",
    "Virus (1999) - Akademik Vladislav Volkov finale",
    "https://en.wikipedia.org/wiki/Virus_%281999_film%29",
    "Captain Everton's face and body integrated into the alien-built industrial cyborg, with cables, cranes, claws and ship weapons as separate parts.",
    [
      phase("engine-room-construct", "Tool-arm sweep", "Cable snare", "Electrical burst"),
      phase("volkov-destruction", "Part assimilation", "Core exposure", "Ship detonation"),
    ],
    { renderHeight: 350, footprint: { width: 3, height: 2, placement: "anchored" } },
  ),
  boss(
    "Chicken Run",
    "chicken-run-pie-machine-grinder",
    "Mrs Tweedy and the Pie Machine",
    "stationary",
    "Chicken Run (2000) - Tweedy farm escape",
    "https://www.aardman.com/film-tv-games/chicken-run/",
    "Mrs Tweedy in her first-film clothing remains a separate human threat while the conveyor, rollers and oven form the fixed arena hazard.",
    [
      phase("pie-machine", "Conveyor acceleration", "Roller crush", "Oven cycle"),
      phase("farm-escape", "Mrs Tweedy axe pursuit", "Machine sabotage", "Aircraft takeoff"),
    ],
    { renderHeight: 284, footprint: { width: 3, height: 2, placement: "anchored" } },
  ),
  boss(
    "Gremlins",
    "gremlins-stripe-gremlin-swarm",
    "Stripe",
    "duelist",
    "Gremlins (1984) - department store finale",
    "https://gremlins.fandom.com/wiki/Stripe",
    "Stripe with his distinct white mohawk, green skin and film-seen props; other Gremlins are separate reinforcements.",
    [
      phase("department-store", "Shelf ambush", "Firearm burst", "Chainsaw pressure"),
      phase("fountain", "Electric sign hazard", "Water threat", "Sunlight defeat"),
    ],
  ),
  boss(
    "Who Framed Roger Rabbit",
    "roger-rabbit-judge-doom-dip-machine",
    "Judge Doom",
    "duelist",
    "Who Framed Roger Rabbit (1988) - Acme warehouse",
    "https://disney.fandom.com/wiki/Judge_Doom",
    "Judge Doom in black coat, hat and glasses, then red Toon eyes and transforming Toon limbs; the Dip cannon stays a separate stage hazard.",
    [
      phase("human-disguise", "Cane sword", "Revolver shot", "Dip cannon command"),
      phase("toon-reveal", "Anvil fist", "Buzz-saw hand", "Dip dissolution"),
    ],
  ),
  boss(
    "LittleBigPlanet",
    "littlebigplanet-negativitron-stitch-storm",
    "The Negativitron",
    "stationary",
    "LittleBigPlanet 2 - Cosmos finale",
    "https://littlebigplanet.fandom.com/wiki/Negativitron",
    "The black cosmic vacuum entity with luminous mouth and eye, built from layered craft materials and grapple points.",
    [
      phase("cosmos-vacuum", "Debris suction", "Laser sweep", "Negativitron Troops"),
      phase("core-launch", "Grapple point cycle", "Weak-point exposure", "Core impact"),
    ],
    { renderHeight: 390, footprint: { width: 3, height: 3, placement: "edge" } },
  ),
  boss(
    "Gears of War",
    "gears-of-war-gargantuan-brumak",
    "Brumak",
    "kaiju",
    "Gears of War - Locust war continuity",
    "https://gearsofwar.fandom.com/wiki/Brumak",
    "Massive reptilian Brumak with Locust harness, arm cannons, dorsal missile rack and a separately targetable pilot.",
    [
      phase("heavy-ordnance", "Arm cannon burst", "Missile barrage", "Stomp"),
      phase("weapon-stripping", "Harness weak points", "Pilot exposure", "Final collapse"),
    ],
    { renderHeight: 470, footprint: { width: 3, height: 3, placement: "edge" } },
  ),
  boss(
    "Halo",
    "halo-covenant-scarab-mech",
    "Type-47 Scarab",
    "kaiju",
    "Halo 3 - Type-47B Deutoros continuity",
    "https://www.halopedia.org/Scarab",
    "Purple Covenant Type-47B Scarab with four articulated legs, focus cannon, deck turret, boarding ramp and rear power core.",
    [
      phase("scarab-advance", "Focus cannon", "Leg stomp", "Deck turret"),
      phase("boarding", "Joint destruction", "Interior defenders", "Rear core overload"),
    ],
    { renderHeight: 540, footprint: { width: 4, height: 4, placement: "edge" } },
  ),
  boss(
    "Resident Evil",
    "resident-evil-william-birkin-g-stage-4",
    "William Birkin G4",
    "large",
    "Resident Evil 2 - William Birkin G4",
    "https://residentevil.fandom.com/wiki/William_Birkin/gameplay",
    "Quadrupedal red G4 Birkin with central maw and multiple orange eyes, kept separate from the later train-bound G5 mutation.",
    [
      phase("g4-charge", "Quadruped rush", "Claw rake", "Wall leap"),
      phase("eye-stagger", "Multi-eye weak points", "Frenzy", "Platform collapse"),
    ],
    { renderHeight: 286, footprint: { width: 2, height: 2, placement: "grid" } },
  ),
  boss(
    "Doom",
    "doom-icon-of-sin-titan",
    "Icon of Sin",
    "kaiju",
    "Doom Eternal - Final Sin",
    "https://doom.fandom.com/wiki/Icon_of_Sin/Doom_Eternal",
    "Doom Eternal Icon of Sin with Urdak armor and eight independently degradable body sections above the ruined city.",
    [
      phase("urdak-armor", "Building punch", "Meteor rain", "Demon summon"),
      phase("exposed-titan", "Eight body weak zones", "Flame wave", "Crucible finish"),
    ],
    { renderHeight: 650, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ),
  boss(
    "Aliens",
    "aliens-alien-queen",
    "Alien Queen",
    "kaiju",
    "Aliens (1986) - LV-426 Queen",
    "https://avp.fandom.com/wiki/Queen_%28LV-426%29",
    "The LV-426 Queen with broad crest, six limbs, long segmented tail and acid saliva; the power loader and airlock are separate arena assets.",
    [
      phase("landing-bay", "Tail impale", "Inner-jaw strike", "Egg reinforcement"),
      phase("power-loader-duel", "Loader grapple", "Airlock pressure", "Vacuum ejection"),
    ],
    { renderHeight: 440, footprint: { width: 3, height: 3, placement: "edge" } },
  ),
  boss(
    "Stargate Atlantis",
    "stargate-atlantis-wraith-hive-ship",
    "Wraith Hive Ship",
    "capitalShip",
    "Stargate Atlantis - Wraith war",
    "https://www.gateworld.net/wiki/Wraith_hive_ship",
    "Dark organic Wraith hive ship with ribbed hull, dart bays, weapons and regenerating damage zones; Atlantis remains in the background.",
    [
      phase("atlantis-orbit", "Dart launch", "Energy cannon", "Organic regeneration"),
      phase("hive-infiltration", "Bay sabotage", "Reactor breach", "Puddle Jumper escape"),
    ],
  ),
  boss(
    "Borderlands",
    "borderlands-the-destroyer-vault-maw",
    "The Destroyer",
    "stationary",
    "Borderlands (2009) - Vault finale",
    "https://borderlands.fandom.com/wiki/The_Destroyer",
    "The Borderlands 1 Destroyer anchored in the opened Vault, with a central eye and independently animated tentacles.",
    [
      phase("vault-emergence", "Tentacle sweep", "Corrosive projectile", "Guardian reinforcement"),
      phase("eye-exposure", "Eye weak point", "Tentacle sever", "Vault closure"),
    ],
    { renderHeight: 410, footprint: { width: 3, height: 3, placement: "anchored" } },
  ),
  boss(
    "War of the Worlds",
    "war-of-the-worlds-martian-tripod-harvester",
    "Fighting Machine / Tripod",
    "kaiju",
    "War of the Worlds (2005) - Spielberg film continuity",
    "https://war-of-the-worlds.fandom.com/wiki/Fighting_Machine_%282005_film%29",
    "The 2005 hooded Fighting Machine on three extremely long legs, with heat ray, capture tentacles, cages and shield states.",
    [
      phase("shielded-harvest", "Heat ray", "Capture tentacle", "Tripod step"),
      phase("biological-failure", "Shield loss", "Bird tell", "Military finishing strike"),
    ],
    { renderHeight: 620, footprint: { width: 3, height: 3, placement: "edge" } },
  ),
  boss(
    "Skyline",
    "skyline-alien-harvest-mothership",
    "Harvest Mothership",
    "capitalShip",
    "Skyline trilogy - Los Angeles harvest continuity",
    "https://skyline.fandom.com/wiki/Mothership",
    "Blue-black biomechanical mothership above Los Angeles with hypnotic light, tentacles, bays and a separate brain chamber.",
    [
      phase("blue-light", "Hypnotic pulse", "Abduction beam", "Drone launch"),
      phase("mothership-entry", "Tentacle corridor", "Brain-room defense", "Core escape"),
    ],
  ),
  boss(
    "Godzilla",
    "godzilla-destoroyah-oxygen-destroyer",
    "Destoroyah",
    "kaiju",
    "Godzilla vs. Destoroyah (1995) - Heisei continuity",
    "https://godzilla.com/blogs/monsterpedia/destoroyah",
    "Heisei Destoroyah with red exoskeleton, wings, horn and pincer tail; Aggregate and Perfect forms remain visibly distinct.",
    [
      phase("aggregate-swarm", "Micro-oxygen burst", "Aggregate rush", "Form merger"),
      phase("perfect-form", "Horn katana", "Aerial assault", "Pincer tail"),
      phase("meltdown-zone", "Military freeze", "Godzilla heat hazard", "Thermal collapse"),
    ],
    { renderHeight: 610, footprint: { width: 4, height: 4, placement: "edge" } },
  ),
  boss(
    "Fullmetal Alchemist",
    "fullmetal-alchemist-father-beyond-the-gate",
    "Father",
    "cosmic",
    "Fullmetal Alchemist: Brotherhood - Promised Day",
    "https://fma.fandom.com/wiki/Father",
    "Father transitions from his white human vessel to the black solar manifestation after absorbing God; the nationwide circle stays environmental.",
    [
      phase("promised-day", "Motionless alchemy", "Philosopher's Stone shield", "God absorption"),
      phase("solar-vessel", "Miniature sun", "Energy barrage", "Stone depletion"),
      phase("final-fists", "Human-scale collapse", "Counter transmutation", "Gate return"),
    ],
    { renderHeight: 600, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ),
  boss(
    "Gantz",
    "gantz-nurarihyon-osaka-final-form",
    "Nurarihyon",
    "kaiju",
    "Gantz manga - Osaka arc",
    "https://gantz.fandom.com/wiki/Nurarihyon",
    "A transformation atlas covering Nurarihyon's old-man guise, detached head, demon body and giant Osaka forms without blending them.",
    [
      phase("old-man-regeneration", "Body reconstruction", "Head detachment", "Counter adaptation"),
      phase("demon-forms", "Laser gaze", "Multiplication", "Giant limb sweep"),
      phase("core-destruction", "Hidden weak point", "Regeneration lock", "Team finisher"),
    ],
    { renderHeight: 520, footprint: { width: 3, height: 3, placement: "edge" } },
  ),
  boss(
    "Solo Leveling",
    "solo-leveling-antares-monarch-of-destruction",
    "Antares",
    "kaiju",
    "Solo Leveling manhwa - Monarchs War finale",
    "https://solo-leveling.fandom.com/wiki/Antares",
    "Antares as a red-haired armored Monarch and then a colossal red-black Dragon Emperor, produced as linked but separate forms.",
    [
      phase("monarch-duel", "Sword pressure", "Fear aura", "Dragon army"),
      phase("dragon-emperor", "Breath of Destruction", "Wing shockwave", "Aerial pursuit"),
      phase("rulers-arrive", "Dimensional gate", "Shadow counter", "Rulers' intervention"),
    ],
    { renderHeight: 620, footprint: { width: 4, height: 4, placement: "edge" } },
  ),
  boss(
    "Teen Titans",
    "teen-titans-trigon-demon-father",
    "Trigon",
    "cosmic",
    "Teen Titans animated series - The End",
    "https://teentitans.fandom.com/wiki/Trigon",
    "City-scale red Trigon with four eyes, horns and dark armor above petrified Jump City; any humanoid avatar is a separate phase asset.",
    [
      phase("petrified-city", "Eye beams", "Demonic magic", "Titan shadow clones"),
      phase("raven-seal", "Portal collapse", "Soul manipulation", "Azarath binding"),
    ],
    { renderHeight: 650, footprint: { width: 0, height: 0, placement: "backdrop" } },
  ),
  boss(
    "Half-Life",
    "half-life-combine-strider-heavy",
    "Nihilanth",
    "stationary",
    "Half-Life (1998) - Xen finale",
    "https://combineoverwiki.net/wiki/Nihilanth",
    "Floating Nihilanth with enormous head, vestigial legs, third arm and healing crystals in Xen; no Combine or Strider hardware.",
    [
      phase("xen-chamber", "Teleport orb", "Energy sphere", "Alien Controller summon"),
      phase("crystal-break", "Healing crystal cycle", "Cranial opening", "Final jump strike"),
    ],
    { renderHeight: 430, footprint: { width: 3, height: 3, placement: "anchored" } },
  ),
  boss(
    "Cyberpunk: Edgerunners",
    "cyberpunk-edgerunners-adam-smasher-full-borg",
    "Adam Smasher Full Borg",
    "large",
    "Cyberpunk: Edgerunners - Arasaka Tower finale",
    "https://cyberpunk.fandom.com/wiki/Adam_Smasher",
    "The Edgerunners full-borg Adam Smasher with massive black-grey chassis, red optics, missiles and source-locked anime proportions.",
    [
      phase("arasaka-floor", "Sandevistan rush", "Missile pod", "Heavy cannon"),
      phase("armor-break", "Borg charge", "Limb armor destruction", "Close execution"),
    ],
  ),
  boss(
    "Demon Slayer",
    "demon-slayer-muzan-kibutsuji",
    "Muzan Kibutsuji",
    "large",
    "Demon Slayer manga - Sunrise Countdown arc",
    "https://kimetsu-no-yaiba.fandom.com/wiki/Muzan_Kibutsuji",
    "Manga-locked final combat Muzan with multiple whip-like limbs and mouths, followed by the giant infant survival form; no anime-only extrapolation.",
    [
      phase("sunrise-countdown", "Whip barrage", "Mouth strike", "Poison blood"),
      phase("regeneration-collapse", "Cell division", "Drug debuffs", "Demon Slayer hold"),
      phase("infant-form", "Giant crawl", "Burrowing attempt", "Sunrise exposure"),
    ],
    { renderHeight: 310, footprint: { width: 2, height: 2, placement: "grid" } },
  ),
  boss(
    "Parasyte",
    "parasyte-gotou-five-parasite-body",
    "Gotou",
    "large",
    "Parasyte manga/anime - Gotou forest confrontation",
    "https://parasyte.fandom.com/wiki/Gotou",
    "Muscular humanoid Gotou whose head and limbs reconfigure into blades and shields while preserving the five-parasite anatomy.",
    [
      phase("five-parasite-body", "Blade morph", "Organic shield", "High-speed charge"),
      phase("waste-site", "Internal weak point", "Toxic debris", "Parasite desynchronization"),
    ],
  ),
  boss(
    "Cowboy Bebop",
    "cowboy-bebop-vicious-red-dragon-syndicate",
    "Vicious",
    "duelist",
    "Cowboy Bebop anime - The Real Folk Blues",
    "https://cowboybebop.fandom.com/wiki/Vicious",
    "Vicious with grey hair, black coat and katana on the Red Dragon headquarters stairs; the Syndicate guards remain separate units.",
    [
      phase("headquarters-ascent", "Guard crossfire", "Grenade pressure", "Katana intercept"),
      phase("staircase-duel", "Fast draw", "Close slash", "Mutual final strike"),
    ],
  ),
  boss(
    "Dragon Ball Z",
    "dragon-ball-z-majin-buu-planetary-crisis",
    "Kid Buu",
    "duelist",
    "Dragon Ball Z - Kid Buu saga",
    "https://dragonball.fandom.com/wiki/Kid_Buu",
    "Kid Buu with pink elastic body, head antenna and white trousers; no Super Buu absorptions or mismatched body forms.",
    [
      phase("sacred-world", "Elastic combo", "Teleport strike", "Regeneration"),
      phase("planet-burst", "Planet Burst charge", "Clone pressure", "Instant movement"),
      phase("spirit-bomb", "Energy contest", "Wish restoration", "Spirit Bomb finish"),
    ],
  ),
  boss(
    "One Punch Man",
    "one-punch-man-boros-meteoric-burst",
    "Boros",
    "large",
    "One-Punch Man season 1 - Dark Matter Thieves finale",
    "https://onepunchman.fandom.com/wiki/Boros",
    "Cyclopean Boros in sealed armor, released form and Meteoric Burst, with all three silhouettes kept coherent and distinct.",
    [
      phase("sealed-armor", "Armored rush", "Energy strike", "Armor shatter"),
      phase("released-form", "Regeneration", "Moon kick", "Meteoric Burst"),
      phase("roaring-cannon", "Planetary beam", "Serious Punch counter", "Energy fade"),
    ],
  ),
  boss(
    "Dino Crisis",
    "dino-crisis-third-energy-tyrant-rex",
    "Tyrannosaurus rex",
    "large",
    "Dino Crisis (1999) - Ibis Island",
    "https://dinocrisis.fandom.com/wiki/Tyrannosaurus_rex",
    "The scarred source-locked Dino Crisis 1 T. rex with natural anatomy; Third Energy remains a stage effect rather than an aura.",
    [
      phase("helipad", "Bite lunge", "Fence break", "Heavy charge"),
      phase("river-pursuit", "Boat ram", "Jaw grab", "Energy-launcher escape"),
    ],
    { renderHeight: 360, footprint: { width: 3, height: 2, placement: "edge" } },
  ),
  boss(
    "Metal Gear",
    "metal-gear-metal-gear-ray-goliath",
    "Metal Gear RAY Squadron",
    "large",
    "Metal Gear Solid 2 - Arsenal Gear",
    "https://metalgear.fandom.com/wiki/Metal_Gear_RAY",
    "Unmanned MGS2 Metal Gear RAY units with amphibious legs, wings and mouth cannon; no REX parts or invented Goliath variant.",
    [
      phase("ray-wave", "Knee missile", "Water jet", "Stomp"),
      phase("arsenal-endurance", "Leaping swap", "Mouth cannon", "Squadron attrition"),
    ],
    { renderHeight: 330, footprint: { width: 2, height: 3, placement: "edge" } },
  ),
  boss(
    "Star Wars",
    "star-wars-darth-vader-sith-master",
    "Darth Vader",
    "duelist",
    "Star Wars original trilogy - Return of the Jedi",
    "https://www.starwars.com/databank/darth-vader",
    "Original-trilogy Darth Vader with correct helmet, armor, chest controls and cape in the Death Star II throne room.",
    [
      phase("throne-room", "Lightsaber combo", "Force push", "Saber throw"),
      phase("inner-conflict", "Force choke", "Bridge pressure", "Luke disarm"),
      phase("redemption", "Palpatine hazard", "Scripted choice", "Emperor throw"),
    ],
  ),
  boss(
    "Alien 3",
    "alien-3-runner-alien",
    "Runner / Dragon",
    "large",
    "Alien 3 (1992) - Fury 161",
    "https://avp.fandom.com/wiki/Runner",
    "The brown quadrupedal Runner with smooth dome and fast ceiling posture, never a Warrior or Big Chap body.",
    [
      phase("fury-tunnels", "Ceiling sprint", "Human-decoy pursuit", "Ambush"),
      phase("foundry", "Molten lead trap", "Thermal shock", "Piston finish"),
    ],
  ),
  boss(
    "Alien Resurrection",
    "alien-resurrection-newborn-hybrid",
    "The Newborn",
    "large",
    "Alien Resurrection (1997) - USM Auriga",
    "https://avp.fandom.com/wiki/Newborn",
    "The pale Newborn with humanoid face, dark eye sockets, long limbs and short tail; no Queen crest or Offspring anatomy.",
    [
      phase("auriga-hunt", "Heavy grab", "Body slam", "Ripley fixation"),
      phase("betty-airlock", "Window impact", "Vacuum breach", "Decompression defeat"),
    ],
  ),
  boss(
    "Alien: Romulus",
    "alien-romulus-offspring-hybrid",
    "The Offspring",
    "large",
    "Alien: Romulus (2024) - Corbelan finale",
    "https://avp.fandom.com/wiki/Offspring",
    "The very tall pale Offspring with Engineer-like proportions and its own tail and appendages, kept distinct from Resurrection's Newborn.",
    [
      phase("rapid-growth", "Cargo ambush", "Long-limb strike", "Grab"),
      phase("corbelan-hold", "Gravity shift", "Cryofuel hazard", "Cargo decompression"),
    ],
  ),
  boss(
    "Predator 2",
    "predator-2-city-hunter",
    "City Hunter",
    "duelist",
    "Predator 2 (1990) - Los Angeles 1997",
    "https://avp.fandom.com/wiki/City_Hunter",
    "City Hunter with his urban armor, biomask, netgun, smart disc and combistick; no Jungle Hunter or Feral equipment.",
    [
      phase("slaughterhouse", "Cloak ambush", "Plasma caster", "Netgun"),
      phase("rooftop-ship", "Smart disc", "Combistick duel", "Unmasked finish"),
    ],
  ),
  boss(
    "Predators",
    "predators-berserker-predator",
    "Berserker Predator / Mr. Black",
    "large",
    "Predators (2010) - game preserve planet",
    "https://avp.fandom.com/wiki/Berserker",
    "Mr. Black with bone-like mask, dark skin, Super Predator armor and heavy build; no Feral armor or standard Yautja body.",
    [
      phase("hunting-camp", "Cloak stalk", "Plasma burst", "Wrist-blade combo"),
      phase("super-predator-duel", "Classic Predator execution", "Mask break", "Decapitation tell"),
    ],
  ),
  boss(
    "The Predator",
    "the-predator-ultimate-predator",
    "Assassin Predator / Upgrade Predator",
    "large",
    "The Predator (2018) - Project Stargazer",
    "https://avp.fandom.com/wiki/Assassin_Predator",
    "The towering genetically upgraded 2018 Assassin Predator with dark skin, minimal armor and biological camouflage.",
    [
      phase("stargazer-lab", "Biological cloak", "Heavy charge", "Organic cannon"),
      phase("forest-hunt", "Regeneration", "Fugitive Predator execution", "Extraction denial"),
    ],
    { renderHeight: 310 },
  ),
  boss(
    "Prey",
    "prey-feral-predator",
    "Feral Predator",
    "duelist",
    "Prey (2022) - Great Plains 1719",
    "https://avp.fandom.com/wiki/Feral_Predator",
    "The 1719 Feral Predator with bone mask, primitive armor, shield, spear and bolt gun; no modern plasma caster.",
    [
      phase("forest-hunt", "Bolt gun", "Retractable shield", "Spear combo"),
      phase("mud-trap", "Bear trap", "Mask removal", "Redirected bolt finish"),
    ],
    { renderHeight: 204 },
  ),
  boss(
    "House of the Dead",
    "house-of-the-dead-magician-type-0",
    "Magician Type-0",
    "large",
    "The House of the Dead (1997) - Curien Mansion incident",
    "https://thehouseofthedead.fandom.com/wiki/Magician",
    "Exact original Magician Type-0: tall black biomechanical humanoid, exposed red-orange muscle seams, long clawed hands and feet, narrow horned head and no wings, robe, armor or magician clothing.",
    [
      phase("curien-laboratory", "Fireball volley", "Teleport dash", "Claw pass"),
      phase("type-zero-overload", "Rapid fire orbit", "Weak-point exposure", "Laboratory collapse"),
    ],
    { renderHeight: 270, anchor: { x: 0.79, y: 0.74 } },
  ),
  boss(
    "House of the Dead 2",
    "house-of-the-dead-2-emperor-type-alpha",
    "Emperor Type Alpha",
    "large",
    "The House of the Dead 2 (1998) - Goldman incident",
    "https://thehouseofthedead.fandom.com/wiki/Emperor",
    "Exact Emperor Type Alpha: translucent pale-blue humanoid body, visible spinning red heart core and multiple floating transparent orbs; retain its smooth unfinished synthetic anatomy and never replace it with armor or a throne.",
    [
      phase("goldman-rooftop", "Orb throw", "Arm-sword morph", "Heart-core guard"),
      phase("tarot-emulation", "Judgment mimic", "Hierophant mimic", "Tower mimic"),
      phase("emergency-orbit", "Spinning orb rush", "Core exposure", "Goldman tower finish"),
    ],
    { renderHeight: 258, anchor: { x: 0.78, y: 0.72 } },
  ),
  boss(
    "House of the Dead 3",
    "house-of-the-dead-3-wheel-of-fate",
    "Wheel of Fate",
    "large",
    "The House of the Dead III (2002) - EFI Research Facility",
    "https://thehouseofthedead.fandom.com/wiki/Wheel_of_Fate",
    "Exact arcade and Xbox Wheel of Fate: towering silver metallic humanoid resurrection body, circular fate mechanism and sun-mark chest weak point, with no medieval wheel, vehicle parts or generic robot armor.",
    [
      phase("fate-symbol-cycle", "Electric sphere", "Metallic charge", "Wheel-selected pattern"),
      phase("curien-resurrection", "Lightning barrage", "Chest weak-point exposure", "BioReactor overload"),
    ],
    { renderHeight: 304, anchor: { x: 0.78, y: 0.73 } },
  ),
]);

const POLICY_SPECS = Object.freeze([
  finalPolicy(
    "Slender Man",
    "slender-man-slender-woods-nexus-core",
    "nonCombatFinal",
    "Slender Man - eight-page forest pursuit",
    "Recuperer les huit indices puis atteindre l'extraction en gerant les apparitions, la statique et la perte d'orientation.",
    "Collect all eight clues, then reach extraction while managing appearances, static and loss of orientation.",
    "Slender Man est une menace de poursuite; un Nexus Core physique ou une victoire par DPS n'existe pas dans cette continuite.",
    "Slender Man is a pursuit threat; a physical Nexus Core or DPS victory does not exist in this continuity.",
    ["https://en.wikipedia.org/wiki/Slender_Man"],
    "Layered night forest, fog, eight collection points, static masks and a faceless very tall suited silhouette at several distances.",
  ),
  finalPolicy(
    "The Amazing Digital Circus",
    "digital-circus-caine-ringmaster-ai",
    "nonCombatFinal",
    "The Amazing Digital Circus - ongoing series, source locked through audit date 2026-07-17",
    "Resoudre une aventure corrompue, eviter les abstracts et stabiliser une sortie pendant que Caine reste l'arbitre.",
    "Resolve a corrupted adventure, avoid abstracts and stabilize an exit while Caine remains the game master.",
    "La serie en cours ne confirme pas Caine comme antagoniste final tuable.",
    "The ongoing series does not establish Caine as a killable final antagonist.",
    ["https://www.glitchprod.com/the-amazing-digital-circus"],
    "Modular digital circus with contradictory doors, Caine and Bubble as non-hostile layered presenters, glitch masks and abstracted hazards.",
  ),
  finalPolicy(
    "Saw",
    "saw-jigsaw-classroom-trap-hub",
    "nonCombatFinal",
    "Saw - Jigsaw test-room continuity",
    "Comprendre les indices, desamorcer les mecanismes et choisir qui sauver avant la fermeture de la salle.",
    "Interpret the clues, disarm the mechanisms and decide whom to save before the room seals.",
    "Jigsaw construit des epreuves morales; aucun Trap Hub mecanique n'est un combattant canonique.",
    "Jigsaw constructs moral tests; no mechanical Trap Hub is a canonical combatant.",
    ["https://www.lionsgate.com/movies/saw"],
    "Original industrial test room with CRT Billy message, timer, chains, keys, doors and armed/disarmed/failure prop states.",
  ),
  finalPolicy(
    "Death Note",
    "death-note-kira-judgment-loop",
    "nonCombatFinal",
    "Death Note manga/anime - Yellow Box Warehouse",
    "Comparer les carnets et les preuves, interrompre l'ecriture de Mikami puis demasquer Light comme Kira.",
    "Compare notebooks and evidence, stop Mikami from writing, then expose Light as Kira.",
    "Le climax est une deduction et une revelation; une boucle Kira combattable trahirait la scene.",
    "The climax is deduction and exposure; a fightable Kira loop would betray the scene.",
    ["https://deathnote.fandom.com/wiki/Yellow_Box_Warehouse"],
    "Yellow Box Warehouse with Light, Near, Mikami and both teams as positional silhouettes, notebooks, watch and evidence props.",
  ),
  finalPolicy(
    "From",
    "from-smiling-night-entity",
    "nonCombatFinal",
    "From - ongoing television continuity through audit date 2026-07-17",
    "Retablir les talismans, proteger Colony House et extraire l'equipe avant la tombee complete de la nuit.",
    "Restore the talismans, protect Colony House and extract the team before full nightfall.",
    "Les creatures souriantes ne forment pas un world boss unique et la serie en cours exige un verrou de saison.",
    "The smiling creatures do not form a single world boss, and the ongoing series requires a season lock.",
    ["https://from.fandom.com/wiki/The_Man_in_Yellow"],
    "From town at dusk with Colony House, talismans, sealed doors, smiling figures and the Man in Yellow as separate distant layers.",
  ),
  finalPolicy(
    "Uzumaki",
    "uzumaki-spiral-city-maw",
    "stageSetpiece",
    "Uzumaki manga - ancient spiral city beneath Kurouzu-cho",
    "Descendre dans l'ancienne cite, suivre les chemins deformes et atteindre le centre avant l'effondrement cyclique.",
    "Descend into the ancient city, follow distorted paths and reach the center before the cyclical collapse.",
    "La spirale est une force architecturale et cyclique, pas une gueule geante a tuer.",
    "The spiral is an architectural cyclical force, not a giant maw to kill.",
    ["https://www.viz.com/uzumaki"],
    "Black-and-white pixel-art underground spiral city, twisted row houses, absorbed silhouettes, wind and collapse layers; no giant mouth.",
  ),
  finalPolicy(
    "Exit 8",
    "exit-8-exit-8-anomaly-loop",
    "nonCombatFinal",
    "The Exit 8 - original game corridor loop",
    "Observer chaque passage, revenir en arriere en cas d'anomalie et atteindre correctement la sortie 8.",
    "Observe every passage, turn back when an anomaly appears and correctly reach Exit 8.",
    "Le jeu ne contient ni antagoniste final ni combat.",
    "The game contains neither a final antagonist nor combat.",
    ["https://store.steampowered.com/app/2653790/The_Exit_8/"],
    "Modular white subway corridor with walker, doors, lights, flooding and interchangeable anomaly layers; signage remains a separate UI layer.",
  ),
  finalPolicy(
    "Hell House LLC",
    "hell-house-llc-abaddon-clown-entity",
    "nonCombatFinal",
    "Hell House LLC (2015) - Abaddon Hotel",
    "Retrouver les bandes, survivre au rituel du sous-sol et sortir avant que les portes de l'Abaddon se referment.",
    "Recover the tapes, survive the basement ritual and escape before the Abaddon doors close.",
    "Le clown est un mannequin ou une manifestation; il n'existe pas comme entite finale nommee et combattable.",
    "The clown is a mannequin or manifestation; it does not exist as a named fightable final entity.",
    ["https://en.wikipedia.org/wiki/Hell_House_LLC"],
    "Abaddon basement with camera-light states, cultists, Andrew Tully and clown mannequins on separate layers, plus sealed-door states.",
  ),
  finalPolicy(
    "Repo! The Genetic Opera",
    "repo-the-genetic-opera-geneco-repo-opera",
    "nonCombatFinal",
    "Repo! The Genetic Opera - Genetic Opera finale",
    "Traverser la representation, reveler l'heritage de Shilo et resoudre le conflit familial sans transformer GeneCo en monstre.",
    "Navigate the performance, reveal Shilo's inheritance and resolve the family conflict without turning GeneCo into a monster.",
    "Le climax est musical, familial et politique; la mort de Rotti est scenarisee.",
    "The climax is musical, familial and political; Rotti's death is scripted.",
    ["https://repo.fandom.com/wiki/Rotti_Largo"],
    "Genetic Opera stage with Rotti, Shilo, masked Repo Man and GeneCo guards as separate actors, plus backstage and audience layers.",
  ),
  finalPolicy(
    "Another",
    "another-calamity-extra-student",
    "nonCombatFinal",
    "Another - class 3-3 calamity",
    "Recouper les souvenirs, proteger les eleves et identifier l'Extra sans afficher son identite avant la resolution.",
    "Cross-check memories, protect the students and identify the Extra without revealing the identity before resolution.",
    "La calamite n'est pas une personne aleatoire a tuer et son identite est un spoiler de gameplay.",
    "The calamity is not a random person to kill, and its identity is a gameplay spoiler.",
    ["https://another.fandom.com/wiki/Countermeasures"],
    "Class 3-3, student list, photographs, anonymous silhouettes, evidence board and burning-inn states with no identity baked into art.",
  ),
  finalPolicy(
    "Voyage de Chihiro",
    "voyage-de-chihiro-no-face-gold-hunger",
    "nonCombatFinal",
    "Spirited Away (2001) - bathhouse and pig test",
    "Apaiser Sans-Visage, retrouver le vrai nom de Chihiro et reussir l'epreuve des parents de Yubaba.",
    "Calm No-Face, recover Chihiro's true name and pass Yubaba's test involving her parents.",
    "Sans-Visage est apaise plutot que vaincu, et l'epreuve finale est un choix.",
    "No-Face is calmed rather than defeated, and the final trial is a choice.",
    ["https://studioghibli.jp/films/spirited-away/"],
    "Bathhouse, water train and pig pen layers, No-Face calm/swollen/calm states, Yubaba portraits, seal and bouquet props.",
  ),
  finalPolicy(
    "Steins;Gate",
    "steins-gate-sern-attractor-field",
    "nonCombatFinal",
    "Steins;Gate visual novel/anime - Rounder raid and world-line resolution",
    "Infiltrer le laboratoire, recuperer l'IBN 5100 et annuler les D-mails dans l'ordre avant le choix de ligne d'univers.",
    "Infiltrate the laboratory, recover the IBN 5100 and undo the D-mails in order before the world-line choice.",
    "Un champ d'attraction est un principe narratif, pas un ennemi physique.",
    "An attractor field is a narrative principle, not a physical enemy.",
    ["https://steins-gate.fandom.com/wiki/Rounders"],
    "Future Gadget Lab, PhoneWave, IBN 5100, Moeka and Rounders as separate actors, with world-line and phone effects on separate layers.",
  ),
  finalPolicy(
    "Zero Escape: The Nonary Games",
    "zero-escape-the-nonary-games-zero-time-door-protocol",
    "nonCombatFinal",
    "Zero Escape - Zero Time Dilemma Decision Game",
    "Assembler les fragments temporels, resoudre les mots de passe et prendre les decisions qui ouvrent la route de sortie.",
    "Assemble timeline fragments, solve the passwords and make the decisions that open the escape route.",
    "Un protocole de porte n'est pas un combattant; la revelation de Zero II doit rester sous spoiler lock.",
    "A door protocol is not a combatant; Zero II's identity must remain spoiler-locked.",
    ["https://zeroescape.fandom.com/wiki/Zero_II"],
    "Decision Game shelter with wards, X-doors, bracelets and timeline fragments; Delta remains silhouette-only until the resolution state.",
  ),
  finalPolicy(
    "Psycho-Pass",
    "psycho-pass-sibyl-system-collective",
    "nonCombatFinal",
    "Psycho-Pass season 1 - Sibyl System judgement",
    "Scanner les coefficients, atteindre la chambre de Sibyl et choisir de reveler, rejeter ou proteger le systeme.",
    "Scan coefficients, reach Sibyl's chamber and choose whether to expose, reject or protect the system.",
    "Sibyl est un collectif et un dilemme politique, pas un robot final.",
    "Sibyl is a collective and a political dilemma, not a final robot.",
    ["https://en.wikipedia.org/wiki/Psycho-Pass"],
    "Nona Tower brain chamber, Dominator, scan cones and judgement portraits; no invented Sibyl mech.",
  ),
  finalPolicy(
    "Spider: The Video Game",
    "spider-the-video-game-brain-final-lab",
    "stageSetpiece",
    "Spider: The Video Game - Brain final laboratory",
    "Attirer les attaques laser et la pointe du Cerveau vers les tiges electriques, puis frapper pendant son etourdissement.",
    "Bait the Brain's laser and stabbing attacks into the electric rods, then strike while it is stunned.",
    "Le protagoniste est l'araignee cybernetique reliee a l'esprit du Dr Michael Kelly; aucun super-heros ni symbiote n'appartient a cet univers.",
    "The protagonist is the cybernetic spider linked to Dr. Michael Kelly's mind; no superhero or symbiote belongs in this universe.",
    ["https://gamefaqs.gamespot.com/ps/198744-spider-the-video-game/faqs/60921"],
    "Insect-scale Evil Labs chamber with the Brain, glass-covered electric rods, giant electronics and interchangeable cyber-leg weapons.",
  ),
  finalPolicy(
    "Neon Genesis Evangelion",
    "neon-genesis-evangelion-lilith-third-impact",
    "stageSetpiece",
    "The End of Evangelion - Third Impact continuity",
    "Survivre aux Evas de production en serie puis traverser la sequence environnementale du Third Impact.",
    "Survive the Mass Production Evas, then navigate the environmental Third Impact sequence.",
    "Lilith et le Third Impact sont un evenement cosmique; les reduire a une unite standard serait faux.",
    "Lilith and Third Impact are a cosmic event; reducing them to a standard unit would be false.",
    ["https://wiki.evageeks.org/Mass_Production_Evangelions"],
    "Separate Mass Production Eva encounter layers followed by red horizon, Rei-Lilith, crosses and Tree-of-Life masks; no walking Lilith sprite.",
  ),
  finalPolicy(
    "Spermageddon",
    "spermageddon-biology-musical-apocalypse",
    "nonCombatFinal",
    "Spermageddon film - final race",
    "Terminer la course vers l'ovule en evitant les obstacles et les cellules immunitaires, sans combat de world boss.",
    "Finish the race to the ovum while avoiding obstacles and immune cells, without a world-boss fight.",
    "L'univers culmine dans une course corporelle comique; aucune apocalypse biologique personnifiee n'existe.",
    "The universe culminates in a comedic bodily race; no personified biological apocalypse exists.",
    ["https://en.wikipedia.org/wiki/Spermageddon"],
    "Tasteful stylized organic race lanes, non-explicit cartoon competitors, ovum objective and immune-cell hazards on separate layers.",
  ),
  finalPolicy(
    "Les Visiteurs du Futur",
    "les-visiteurs-du-futur-time-paradox-reactor",
    "nonCombatFinal",
    "Le Visiteur du futur film - Axomako continuity",
    "Infiltrer Axomako, saboter la chaine menant a l'explosion et evacuer avant la modification de la ligne temporelle.",
    "Infiltrate Axomako, sabotage the chain leading to the explosion and evacuate before the timeline changes.",
    "Le reacteur de paradoxe est invente; la finale repose sur des choix et factions humaines.",
    "The paradox reactor is invented; the finale relies on choices and human factions.",
    ["https://fr.wikipedia.org/wiki/Le_Visiteur_du_futur_%28film%29"],
    "Axomako facility, time device, opposing agents, evacuation gates and timeline effect layers; no living reactor.",
  ),
  finalPolicy(
    "The Simpsons",
    "the-simpsons-mr-burns-reactor-scheme",
    "nonCombatFinal",
    "The Simpsons - Springfield nuclear plant objective route",
    "Schema du reacteur de M. Burns.",
    "Mr Burns Reactor Scheme.",
    "Un plan de Mr Burns n'est pas une entite combattante et l'univers n'a pas un final unique.",
    "A Mr Burns scheme is not a combat entity, and the universe has no single finale.",
    ["https://simpsons.fandom.com/wiki/Charles_Montgomery_Burns"],
    "Springfield plant with Burns and Smithers as portraits or actors, control rods, consoles, doors and reactor states.",
  ),
  finalPolicy(
    "Cool Spot",
    "cool-spot-bottle-cap-brand-storm",
    "nonCombatFinal",
    "Cool Spot - 16-bit platform-game continuity",
    "Liberer les Spots emprisonnes et atteindre la sortie de bouteille avant la fin du temps.",
    "Free the imprisoned Spots and reach the bottle exit before time runs out.",
    "Le jeu n'a pas de world boss iconique stable et Brand Storm est une extrapolation.",
    "The game has no stable iconic world boss, and Brand Storm is an extrapolation.",
    ["https://en.wikipedia.org/wiki/Cool_Spot"],
    "Original 16-bit-inspired miniature platform kit with cages, bubbles and bottle-scale scenery; omit brand logos and any giant hostile cap.",
  ),
  finalPolicy(
    "Le Cinquieme Element",
    "le-cinquieme-element-the-ultimate-evil-sphere",
    "stageSetpiece",
    "The Fifth Element (1997) - Great Evil finale",
    "Activer les quatre pierres puis le cinquieme element avant que la sphere noire atteigne la Terre.",
    "Activate the four stones and then the fifth element before the black sphere reaches Earth.",
    "Le Grand Mal est une sphere cosmique environnementale sans corps de melee.",
    "The Great Evil is an environmental cosmic sphere without a melee body.",
    ["https://fifth-element.fandom.com/wiki/Great_Evil"],
    "Black molten Great Evil sphere in the sky, Mondoshawan temple, four elemental stones and final beam as independent layers.",
  ),
  finalPolicy(
    "La Cite de la Peur",
    "la-cite-de-la-peur-odile-deray-premiere-trap",
    "nonCombatFinal",
    "La Cite de la Peur (1994) - Cannes premiere",
    "Proteger Odile, enqueter dans les coulisses puis apprehender le tueur pendant la premiere.",
    "Protect Odile, investigate backstage and apprehend the killer during the premiere.",
    "Odile est un objectif allie et ne doit jamais etre transformee en boss.",
    "Odile is an allied objective and must never be turned into a boss.",
    ["https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur"],
    "Cannes red carpet, festival backstage, masked killer and the main trio as separate layers; Odile is always visually allied.",
  ),
  finalPolicy(
    "Pingu",
    "pingu-frozen-fish-avalanche",
    "nonCombatFinal",
    "Pingu - family-friendly clay animation continuity",
    "Retrouver la famille, degager la neige et rapporter les poissons apres l'avalanche.",
    "Find the family, clear the snow and bring back the fish after the avalanche.",
    "Cet univers enfantin n'a pas d'antagoniste final et une avalanche avec HP serait incoherente.",
    "This child-friendly universe has no final antagonist, and an avalanche with HP would be incoherent.",
    ["https://www.pingu.jp/"],
    "Clay-like pixel-art ice field, igloo, Pingu family, fish, snow and crack tile states; no living avalanche.",
  ),
  finalPolicy(
    "Solar Opposites",
    null,
    "stageSetpiece",
    "Solar Opposites - Pupa terraformation premise",
    "Stabiliser la Pupa, limiter la transformation du quartier et evacuer les civils avant la terraformation.",
    "Stabilize the Pupa, limit the neighborhood transformation and evacuate civilians before terraforming.",
    "La Pupa n'est pas un antagoniste classique et aucun world boss runtime n'existait lors de l'audit.",
    "The Pupa is not a conventional antagonist, and no runtime world boss existed at audit time.",
    ["https://www.hulu.com/series/solar-opposites-f089664b-1a87-433b-86a5-24e7da5a246a"],
    "Shlorpian suburban house, source-locked Pupa states, alien gadgets and neighborhood terraformation masks; no evil Pupa form.",
  ),
  finalPolicy(
    "Siren Head",
    null,
    "nonCombatFinal",
    "Siren Head - Trevor Henderson source continuity",
    "Detruire les relais de mimetisme sonore puis atteindre l'extraction sans engager un duel de boxe.",
    "Destroy the sound-mimic relays, then reach extraction without entering a boxing-style duel.",
    "La menace fonctionne par traque, son et echelle; sa survie finale n'exige pas une barre de vie.",
    "The threat works through stalking, sound and scale; its survival finale does not require a health bar.",
    ["https://trevorhenderson.fandom.com/wiki/Siren_Head"],
    "Extremely tall emaciated rust-brown humanoid with twin sirens at distant scales, forest, pylons and audio telegraph layers.",
  ),
  performancePolicy(
    "Vocaloid",
    "vocaloid-shibuya-gigantic-stage-core",
    "https://ec.crypton.co.jp/pages/prod/virtualsinger/cv01_us",
    "Virtual Shibuya stage with source-locked Hatsune Miku silhouette, holographic musicians, cyan-pink lighting and crowd layers; no hostile core.",
  ),
  performancePolicy(
    "Rammstein",
    "rammstein-engel-wings-pyro-rig",
    "https://www.rammstein.de/en/",
    "All six musicians on an original industrial stage with source-locked tour clothing, instruments and separately animated pyrotechnics.",
  ),
  performancePolicy(
    "System of a Down",
    "system-of-a-down-toxicity-riot-core",
    "https://systemofadown.com/",
    "Serj, Daron, Shavo and John on a compact stage, source-locked to one era, with separate instruments, crowd and rhythmic effects.",
  ),
  performancePolicy(
    "Rob Zombie",
    "rob-zombie-dragula-stage-machine",
    "https://robzombie.com/",
    "Rob Zombie and band on an original horror-industrial stage with a separate hot-rod show prop, dancers, flames and lighting.",
  ),
  performancePolicy(
    "Daft Punk",
    "daft-punk-derezzed-pyramid-core",
    "https://www.daftpunk.com/",
    "The helmeted duo at an original Alive-inspired pyramid console with amber-cyan beams and audience layers; the pyramid is never hostile.",
  ),
  performancePolicy(
    "Oliver Tree",
    "oliver-tree-turbo-scooter-breakdown",
    "https://www.olivertreemusic.com/",
    "Source-locked bowl-cut and oversized outfit, scooter, ramps and stage as separate assets for a stunt-performance finale.",
  ),
  performancePolicy(
    "Linkin Park",
    "linkin-park-meteora-feedback-core",
    "https://www.linkinpark.com/",
    "One explicitly source-locked lineup and era, with vocals, guitars, drums, sampler, screens and memorial encore layers.",
  ),
  performancePolicy(
    "Die Antwoord",
    "die-antwoord-bassline-freak-core",
    "https://www.dieantwoord.com/",
    "Source-locked duo on an original Zef stage with costumes, dancers and projections as separate layers; no invented creature.",
  ),
  performancePolicy(
    "Skrillex",
    "skrillex-wub-singularity",
    "https://skrillex.com/",
    "Source-locked artist silhouette at an original electronic stage with booth, speaker arrays, strobes and crowd states.",
  ),
  performancePolicy(
    "Bella Poarch",
    "bella-poarch-inferno-doll-core",
    "https://www.bellapoarch.com/",
    "Original dark-pop video stage with source-locked performer appearance, dancers and modular props; no hostile doll entity.",
  ),
  performancePolicy(
    "Guns N' Roses",
    "guns-n-roses-appetite-feedback-serpent",
    "https://www.gunsnroses.com/",
    "Explicitly selected band era on an original stadium stage with instruments, solo positions and crowd layers; no serpent monster.",
  ),
  performancePolicy(
    "Band-Maid",
    "band-maid-domination-feedback-core",
    "https://bandmaid.tokyo/",
    "Source-locked lineup in maid-rock stage clothing with separate guitars, bass, drums, vocals and audience states.",
  ),
  performancePolicy(
    "Bring Me the Horizon",
    "bring-me-the-horizon-sempiternal-hex-core",
    "https://www.bmthofficial.com/",
    "Source-locked era and lineup on an original festival stage with vocals, guitars, synths and crowd-control states.",
  ),
  performancePolicy(
    "Blackpink",
    "blackpink-ddu-du-cannon-core",
    "https://www.blackpinkofficial.com/",
    "All four members in one source-locked performance wardrobe, with catwalk, formation markers, dancers and pink-black lighting.",
  ),
  performancePolicy(
    "Lil Nas X",
    "lil-nas-x-old-town-road-rift-rider",
    "https://www.lilnasx.com/",
    "Source-locked performer wardrobe across original western-pop stage transitions with mount, vehicle and dance layers; no enemy rider.",
  ),
  performancePolicy(
    "Atarashii Gakko!",
    "atarashii-gakko-discipline-dance-core",
    "https://atarashiigakko.com/",
    "All four members in source-locked uniforms with original synchronized choreography, formation markers and gym-stage layers.",
  ),
  performancePolicy(
    "Babymetal",
    "babymetal-kami-band-rift-fox",
    "https://babymetal.com/",
    "Source-locked formation and Kami Band on a metal stage with choreography and fire layers; fox imagery is a non-hostile light motif.",
  ),
  performancePolicy(
    "Ladybaby",
    "ladybaby-cute-riot-feedback",
    "https://en.wikipedia.org/wiki/Ladybaby",
    "One explicitly locked lineup and period with referenced costumes, original choreography, instruments and kawaii-metal stage layers.",
  ),
  performancePolicy(
    "Bigflo & Oli",
    "bigflo-oli-narrative-verse-storm",
    "https://bigfloetoli.com/",
    "The duo in source-locked tour clothing on an original urban stage with alternating verses, screens and crowd response states.",
  ),
  performancePolicy(
    "Little Big",
    "little-big-generation-cancellation-broadcast",
    "https://littlebig.band/",
    "One source-locked lineup on an original satirical pop set with documented costume cues and modular visual-gag props.",
  ),
  performancePolicy(
    "Hoshi",
    "hoshi-amour-censure-storm",
    "https://www.joandco.fr/artiste/hoshi/",
    "Source-locked performer at piano and microphone with an original intimate-to-full-stage lighting progression.",
  ),
  performancePolicy(
    "Lady Gaga",
    "lady-gaga-bad-romance-paparazzi-core",
    "https://www.ladygaga.com/",
    "One explicitly selected tour era and wardrobe, with original choreography, piano, dancers, catwalk and encore states.",
  ),
  performancePolicy(
    "Within Temptation",
    "within-temptation-mother-earth-angel-core",
    "https://www.within-temptation.com/",
    "Source-locked band era on an original symphonic-gothic stage with vocals, guitars, orchestral layers and fabric effects.",
  ),
  performancePolicy(
    "PSY",
    "psy-horse-dance-bass-core",
    "https://www.pnation.com/artists",
    "Source-locked PSY performance wardrobe with dancers, an original stage, audience response and confetti states; no horse creature.",
  ),
  performancePolicy(
    "Black Eyed Peas",
    "black-eyed-peas-i-gotta-feeling-party-core",
    "https://www.blackeyedpeas.com/",
    "One explicitly selected lineup and era on an original festival stage with microphones, DJ or instruments and crowd layers.",
  ),
  performancePolicy(
    "Shaka Ponk",
    "shaka-ponk-shaka-bass-ape-core",
    "https://www.shakaponk.com/",
    "Source-locked band on an original rock-electronic stage with Goz as a non-hostile projected avatar and separate screen layers.",
  ),
  performancePolicy(
    "Shakira",
    "shakira-hips-dont-lie-pulse",
    "https://www.shakira.com/",
    "Source-locked tour wardrobe on an original stage with choreography, percussion, dancers and audience layers.",
  ),
  performancePolicy(
    "Deadmau5",
    "deadmau5-ghosts-n-stuff-signal-core",
    "https://deadmau5.com/",
    "Source-locked mau5 helmet and an original cube-DJ stage with abstract mappings, beams and crowd states; no hostile signal.",
  ),
  performancePolicy(
    "Korn",
    "korn-freak-on-a-leash-core",
    "https://kornofficial.com/",
    "One source-locked lineup and era with instruments, microphone stand, original nu-metal stage and audience layers.",
  ),
  performancePolicy(
    "Aural Vampire",
    "aural-vampire-zombie-naocchatte-procession",
    "https://www.auralvampire.com/",
    "Official-site source-locked members and costumes on an original darkwave club stage with synths and lighting; Naocchatte remains non-hostile.",
  ),
]);

const NORMALIZED_COMBAT_ENTRIES = Object.freeze(COMBAT_SPECS.map(normalizeBoss));
const NORMALIZED_POLICY_ENTRIES = Object.freeze(POLICY_SPECS.map(normalizePolicy));

export const LORE_WORLD_BOSS_OVERRIDES = Object.freeze(Object.fromEntries(
  NORMALIZED_COMBAT_ENTRIES.map((entry) => [entry.universe, entry]),
));

export const LORE_WORLD_BOSS_POLICIES = Object.freeze(Object.fromEntries(
  NORMALIZED_POLICY_ENTRIES.map((entry) => [entry.universe, entry]),
));

const FOOTPRINT_PLACEMENTS = Object.freeze([
  "grid",
  "edge",
  "offGrid",
  "backdrop",
  "anchored",
]);

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isHttpsUrl = (value) => isNonEmptyString(value) && value.startsWith("https://");
const isNormalizedSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const invariant = (condition, message) => {
  if (!condition) {
    throw new Error(`[loreWorldBossOverrides] ${message}`);
  }
};

const validateLocalizedField = (value, label) => {
  invariant(value && typeof value === "object", `${label} must be an object`);
  invariant(isNonEmptyString(value.fr), `${label}.fr is required`);
  invariant(isNonEmptyString(value.en), `${label}.en is required`);
};

const validateContinuity = (value, universe) => {
  invariant(value && typeof value === "object", `${universe}: continuity is required`);
  invariant(isNormalizedSlug(value.id), `${universe}: invalid continuity.id`);
  invariant(isNonEmptyString(value.label), `${universe}: continuity.label is required`);
  invariant(value.status === "locked", `${universe}: continuity must be locked`);
  invariant(value.source === SOURCE_AUDIT, `${universe}: invalid continuity source`);
};

export const validateLoreWorldBossOverride = (universe, entry) => {
  invariant(isNonEmptyString(universe), "override universe key is required");
  invariant(entry && typeof entry === "object", `${universe}: override is required`);
  invariant(entry.type === "worldBoss", `${universe}: override.type must be worldBoss`);
  invariant(entry.source === SOURCE_AUDIT, `${universe}: invalid source`);
  invariant(entry.universe === universe, `${universe}: universe key mismatch`);
  invariant(isNonEmptyString(entry.legacyWorldBossId), `${universe}: legacyWorldBossId is required`);
  invariant(isNonEmptyString(entry.name), `${universe}: canonical name is required`);
  invariant(
    LORE_WORLD_BOSS_LAYOUTS.includes(entry.layout),
    `${universe}: unsupported layout ${entry.layout}`,
  );
  invariant(
    Number.isInteger(entry.renderHeight) && entry.renderHeight >= 96 && entry.renderHeight <= 1200,
    `${universe}: renderHeight must be an integer between 96 and 1200`,
  );
  invariant(entry.anchor && typeof entry.anchor === "object", `${universe}: anchor is required`);
  invariant(
    Number.isFinite(entry.anchor.x) && entry.anchor.x >= 0 && entry.anchor.x <= 1,
    `${universe}: anchor.x must be between 0 and 1`,
  );
  invariant(
    Number.isFinite(entry.anchor.y) && entry.anchor.y >= 0 && entry.anchor.y <= 1,
    `${universe}: anchor.y must be between 0 and 1`,
  );

  const footprint = entry.tacticsFootprint;
  invariant(footprint && typeof footprint === "object", `${universe}: tacticsFootprint is required`);
  invariant(
    Number.isInteger(footprint.width) && footprint.width >= 0 && footprint.width <= 8,
    `${universe}: invalid tacticsFootprint.width`,
  );
  invariant(
    Number.isInteger(footprint.height) && footprint.height >= 0 && footprint.height <= 8,
    `${universe}: invalid tacticsFootprint.height`,
  );
  invariant(
    FOOTPRINT_PLACEMENTS.includes(footprint.placement),
    `${universe}: invalid tacticsFootprint.placement`,
  );
  if (footprint.placement === "grid" || footprint.placement === "anchored") {
    invariant(
      footprint.width > 0 && footprint.height > 0,
      `${universe}: on-grid footprints must occupy at least one cell`,
    );
  }

  validateContinuity(entry.continuity, universe);
  invariant(Array.isArray(entry.phases) && entry.phases.length > 0, `${universe}: phases are required`);

  const phaseIds = new Set();
  for (const phaseEntry of entry.phases) {
    invariant(isNormalizedSlug(phaseEntry.id), `${universe}: invalid phase id ${phaseEntry.id}`);
    invariant(!phaseIds.has(phaseEntry.id), `${universe}: duplicate phase id ${phaseEntry.id}`);
    phaseIds.add(phaseEntry.id);
    invariant(
      Array.isArray(phaseEntry.attacks) && phaseEntry.attacks.length > 0,
      `${universe}/${phaseEntry.id}: attacks are required`,
    );
    invariant(
      phaseEntry.attacks.every(isNonEmptyString),
      `${universe}/${phaseEntry.id}: every attack must be named`,
    );
  }

  validateLocalizedField(entry.lore, `${universe}.lore`);
  invariant(isHttpsUrl(entry.referenceUrl), `${universe}: referenceUrl must use HTTPS`);
  invariant(isNonEmptyString(entry.visualAnchor), `${universe}: visualAnchor is required`);
  invariant(isNonEmptyString(entry.spritePrompt), `${universe}: spritePrompt is required`);

  const expectedOutput = `/sprites/generated/bosses/${slugifyLoreWorldBossAsset(universe)}/${slugifyLoreWorldBossAsset(entry.name)}.png`;
  invariant(entry.output === expectedOutput, `${universe}: non-deterministic boss output path`);

  return true;
};

export const validateLoreWorldBossPolicy = (universe, entry) => {
  invariant(isNonEmptyString(universe), "policy universe key is required");
  invariant(entry && typeof entry === "object", `${universe}: policy is required`);
  invariant(entry.type === "policy", `${universe}: policy.type must be policy`);
  invariant(entry.source === SOURCE_AUDIT, `${universe}: invalid source`);
  invariant(entry.universe === universe, `${universe}: universe key mismatch`);
  invariant(
    entry.legacyWorldBossId === null || isNonEmptyString(entry.legacyWorldBossId),
    `${universe}: legacyWorldBossId must be a string or null`,
  );
  invariant(
    LORE_WORLD_BOSS_POLICY_TYPES.includes(entry.policy),
    `${universe}: unsupported policy ${entry.policy}`,
  );

  validateContinuity(entry.continuity, universe);
  validateLocalizedField(entry.objective, `${universe}.objective`);
  validateLocalizedField(entry.finale, `${universe}.finale`);
  validateLocalizedField(entry.reason, `${universe}.reason`);
  invariant(
    Array.isArray(entry.referenceUrls) && entry.referenceUrls.length > 0,
    `${universe}: at least one reference URL is required`,
  );
  invariant(
    entry.referenceUrls.every(isHttpsUrl),
    `${universe}: every reference URL must use HTTPS`,
  );
  invariant(isNonEmptyString(entry.visualAnchor), `${universe}: visualAnchor is required`);
  invariant(isNonEmptyString(entry.assetPrompt), `${universe}: assetPrompt is required`);

  const expectedOutput = `/sprites/generated/finals/${slugifyLoreWorldBossAsset(universe)}/${slugifyLoreWorldBossAsset(entry.policy)}.png`;
  invariant(entry.output === expectedOutput, `${universe}: non-deterministic policy output path`);

  return true;
};

export const validateLoreWorldBossRegistries = () => {
  const combatUniverses = NORMALIZED_COMBAT_ENTRIES.map((entry) => entry.universe);
  const policyUniverses = NORMALIZED_POLICY_ENTRIES.map((entry) => entry.universe);
  const allEntries = [...NORMALIZED_COMBAT_ENTRIES, ...NORMALIZED_POLICY_ENTRIES];
  const seenUniverses = new Set();
  const seenLegacyIds = new Set();
  const seenContinuityIds = new Set();
  const seenOutputs = new Set();

  invariant(
    Object.keys(LORE_WORLD_BOSS_OVERRIDES).length === NORMALIZED_COMBAT_ENTRIES.length,
    "duplicate combat universe key detected",
  );
  invariant(
    Object.keys(LORE_WORLD_BOSS_POLICIES).length === NORMALIZED_POLICY_ENTRIES.length,
    "duplicate policy universe key detected",
  );

  for (const universe of combatUniverses) {
    validateLoreWorldBossOverride(universe, LORE_WORLD_BOSS_OVERRIDES[universe]);
  }
  for (const universe of policyUniverses) {
    validateLoreWorldBossPolicy(universe, LORE_WORLD_BOSS_POLICIES[universe]);
  }

  for (const entry of allEntries) {
    invariant(!seenUniverses.has(entry.universe), `${entry.universe}: combat/policy overlap`);
    seenUniverses.add(entry.universe);

    if (entry.legacyWorldBossId !== null) {
      invariant(
        !seenLegacyIds.has(entry.legacyWorldBossId),
        `duplicate legacy world-boss ID ${entry.legacyWorldBossId}`,
      );
      seenLegacyIds.add(entry.legacyWorldBossId);
    }

    invariant(
      !seenContinuityIds.has(entry.continuity.id),
      `duplicate continuity ID ${entry.continuity.id}`,
    );
    seenContinuityIds.add(entry.continuity.id);
    invariant(!seenOutputs.has(entry.output), `duplicate output path ${entry.output}`);
    seenOutputs.add(entry.output);
  }

  for (const excludedUniverse of EXCLUDED_UNIVERSES) {
    invariant(
      !hasOwn(LORE_WORLD_BOSS_OVERRIDES, excludedUniverse)
        && !hasOwn(LORE_WORLD_BOSS_POLICIES, excludedUniverse),
      `excluded universe leaked into this wave: ${excludedUniverse}`,
    );
  }

  invariant(
    seenOutputs.size === allEntries.length,
    `expected ${allEntries.length} unique outputs, received ${seenOutputs.size}`,
  );

  return Object.freeze({
    overrides: NORMALIZED_COMBAT_ENTRIES.length,
    policies: NORMALIZED_POLICY_ENTRIES.length,
    universes: seenUniverses.size,
    legacyIds: seenLegacyIds.size,
    outputs: seenOutputs.size,
    excludedUniverses: EXCLUDED_UNIVERSES.length,
  });
};

export const LORE_WORLD_BOSS_VALIDATION = validateLoreWorldBossRegistries();

export const getLoreWorldBossOverride = (universe) => (
  LORE_WORLD_BOSS_OVERRIDES[universe] ?? null
);

export const getLoreWorldBossPolicy = (universe) => (
  LORE_WORLD_BOSS_POLICIES[universe] ?? null
);

export const getLoreWorldBossResolution = (universe) => (
  getLoreWorldBossOverride(universe) ?? getLoreWorldBossPolicy(universe)
);

export const getLoreWorldBossReferenceUrls = (universe) => {
  const override = getLoreWorldBossOverride(universe);
  if (override) {
    return Object.freeze([override.referenceUrl]);
  }
  return getLoreWorldBossPolicy(universe)?.referenceUrls ?? EMPTY_REFERENCES;
};

export const hasLoreWorldBossOverride = (universe) => (
  hasOwn(LORE_WORLD_BOSS_OVERRIDES, universe)
);

export const hasLoreWorldBossPolicy = (universe) => (
  hasOwn(LORE_WORLD_BOSS_POLICIES, universe)
);
