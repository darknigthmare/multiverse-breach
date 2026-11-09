// Skyline — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#172a44", "#04070d", "#4ea7ff"]));
}

export function createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, SKYLINE, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
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
  }));
}
