// The Horribly Slow Murderer — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#5a534b", "#0c0907", "#d3c6a5"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, GINOSAJI, INSPIRED, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
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
  }));
}
