// Avatar (Na'vi) — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#0b3651", "#031018", "#56e3dc"]));
}

export function createCanonRosterWavePartA({ ADAPTED, AVATAR, CANON, INSPIRED, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
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
  }));
}
