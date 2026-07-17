const MODE_SPECS = Object.freeze({
  Combat: {
    assetFile: 'combat.webp',
    camera: 'strict-side-view-16-9',
    composition: 'One continuous flat duel floor, a clear central 1v1 lane, shallow parallax, and tag entry zones outside the center.',
    promptTail: 'strict side-view 16:9 Combat camera, one continuous flat duel floor, clear central 1v1 lane, shallow parallax, props kept outside the fighters, no characters, logos, readable text or baked UI'
  },
  Melee: {
    assetFile: 'melee.webp',
    camera: 'strict-side-view-platform-arena',
    composition: 'Backdrop without baked platforms plus separately textureable platform tops, edges, walls, and readable collision silhouettes.',
    promptTail: 'strict side-view Melee camera, backdrop without baked platforms, separate platform tops and edges, readable collision silhouettes, traversal gaps, no characters, logos, readable text or baked UI'
  },
  RPG: {
    assetFile: 'rpg.webp',
    camera: 'side-view-2.5d',
    composition: 'A broad perspective battle floor, open central lane, low foreground, layered depth, and unobstructed party and enemy positions.',
    promptTail: 'side-view 2.5D RPG camera, broad perspective battle floor, open central lane, low foreground, layered depth, no characters, logos, readable text or baked UI'
  },
  Tactics: {
    assetFile: 'tactics.webp',
    camera: 'elevated-three-quarter-rectangular-grid',
    composition: 'An elevated three-quarter 8x6 rectangular grid with readable cover, traversable lanes, and lower rows visually in front of higher rows.',
    promptTail: 'elevated three-quarter Tactics camera, 8x6 rectangular grid, readable cover and traversable lanes, lower rows visually in front of higher rows, never top-down or diamond-isometric, no characters, logos, readable text or baked UI'
  }
});

const MODE_ALIASES = Object.freeze({
  Combat: 'Combat',
  Fighter: 'Combat',
  Melee: 'Melee',
  Smash: 'Melee',
  RPG: 'RPG',
  Tactics: 'Tactics'
});

const BLOCKED_CANONICAL_PATTERN = /^A definir\b/i;

const slugify = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizeText = (value) => String(value).replace(/\s+/g, ' ').trim();

const buildModePrompt = ({ universeLabel, canonicalName, visualAnchor, blocked }, mode) => {
  if (blocked) {
    return `DO NOT GENERATE. ${canonicalName}. Resolve the exact source and canonical location for ${universeLabel} before producing the ${mode} asset.`;
  }
  return `Original high-detail 32-bit pixel-art environment for ${universeLabel}. Canonical location: ${canonicalName}. Visual anchor: ${visualAnchor}. ${MODE_SPECS[mode].promptTail}.`;
};

const buildModes = ({ universeLabel, slug, canonicalName, visualAnchor, blocked }) => {
  const basePath = `/backgrounds/lore-stages/${slug}`;
  const modes = {};

  for (const [mode, spec] of Object.entries(MODE_SPECS)) {
    modes[mode] = {
      assetPath: `${basePath}/${spec.assetFile}`,
      camera: spec.camera,
      composition: spec.composition,
      prompt: buildModePrompt({ universeLabel, canonicalName, visualAnchor, blocked }, mode)
    };
  }

  modes.Melee.backdropPath = `${basePath}/melee-backdrop.webp`;
  modes.Melee.platformTexturePath = `${basePath}/melee-platforms.webp`;
  modes.Tactics.tileTexturePath = `${basePath}/tactics-tiles.webp`;
  return Object.freeze(modes);
};

const buildProfile = ({
  key,
  slug,
  universeLabel,
  canonicalName,
  referenceUrls,
  visualAnchor = canonicalName,
  priority,
  auditStatus,
  stageId = null,
  universes = null
}) => {
  const normalizedCanonicalName = normalizeText(canonicalName);
  const normalizedVisualAnchor = normalizeText(visualAnchor);
  const generationBlocked = BLOCKED_CANONICAL_PATTERN.test(normalizedCanonicalName);

  return Object.freeze({
    key,
    slug,
    canonicalName: normalizedCanonicalName,
    referenceUrls: Object.freeze([...referenceUrls]),
    visualAnchor: normalizedVisualAnchor,
    priority,
    auditStatus,
    generationBlocked,
    ...(stageId === null ? {} : { stageId }),
    ...(universes ? { universes: Object.freeze([...universes]) } : {}),
    modes: buildModes({
      universeLabel,
      slug,
      canonicalName: normalizedCanonicalName,
      visualAnchor: normalizedVisualAnchor,
      blocked: generationBlocked
    })
  });
};

const UNIVERSE_PROFILE_DEFINITIONS = [
  ["Discworld", "P0", "FALLBACK", "Ankh-Morpork, Unseen University courtyard opening toward the River Ankh and the Shades", ["https://www.discworldemporium.com/product/the-compleat-ankh-morpork/"]],
  ["Joker New 52", "P0", "FALLBACK", "Jokerized Gotham streets around the parade route and ruined GCPD barricades", ["https://www.dc.com/graphic-novels/endgame-2015/the-joker-endgame"]],
  ["The Batman Who Laughs", "P0", "FALLBACK", "Dark Multiverse Gotham beneath the infected Batcave and chained city spires", ["https://www.dc.com/graphic-novels/the-batman-who-laughs-2018/the-batman-who-laughs"]],
  ["Kaamelott", "P0", "FALLBACK", "Salle de la Table Ronde du chateau de Kaamelott, cour visible par les arches", ["https://www.m6.fr/kaamelott-p_888"]],
  ["Prometheus", "P0", "FALLBACK", "LV-223 Pyramid Dome, Ampule Room and giant head chamber", ["https://d23.com/prometheus-10th-anniversary-celebration/"]],
  ["Aliens", "P1", "FALLBACK", "Hadley's Hope Operations and Atmosphere Processor access", ["https://www.20thcenturystudios.com/movies/aliens"]],
  ["Alien 3", "P1", "FALLBACK", "Fiorina 161 leadworks furnace and mold catwalk", ["https://www.20thcenturystudios.com/horror"]],
  ["Alien Resurrection", "P0", "FALLBACK", "USM Auriga cloning laboratory and flooded containment deck", ["https://www.20thcenturystudios.com/movies/alien-resurrection"]],
  ["Alien: Covenant", "P1", "FALLBACK", "Engineer necropolis plaza and David's cathedral laboratory", ["https://www.20thcenturystudios.com/movies/alien-covenant"]],
  ["Alien: Romulus", "P1", "FALLBACK", "Renaissance station zero-gravity cargo shaft and facehugger corridor", ["https://www.20thcenturystudios.com/movies/alien-romulus"]],
  ["Predator 2", "P0", "FALLBACK", "Los Angeles slaughterhouse freezer and rooftop skyline", ["https://www.20thcenturystudios.com/movies/predator-2"]],
  ["Predators", "P0", "FALLBACK", "Game Preserve Planet jungle, totem camp and distant alien sky", ["https://www.20thcenturystudios.com/movies/predators"]],
  ["The Predator", "P1", "FALLBACK", "Project Stargazer laboratory and captured Yautja ship bay", ["https://www.20thcenturystudios.com/movies/the-predator"]],
  ["Prey", "P0", "FALLBACK", "Great Plains burned forest and mud-bog trap in 1719", ["https://www.20thcenturystudios.com/movies/prey"]],
  ["Predator: Killer of Killers", "P0", "FALLBACK", "Yautja mothership trophy arena linking Viking coast, Sengoku castle and WWII hangar", ["https://www.20thcenturystudios.com/movies/predator-killer-of-killers"]],
  ["Predator: Badlands", "P1", "FALLBACK", "Genna hostile biome and Weyland-Yutani wreck route", ["https://www.20thcenturystudios.com/movies/predator-badlands"]],
  ["Alien vs Predator", "P0", "FALLBACK", "Bouvetoya shifting pyramid sacrificial chamber", ["https://www.20thcenturystudios.com/movies/alien-vs-predator"]],
  ["Aliens vs Predator: Requiem", "P1", "FALLBACK", "Gunnison hospital rooftop and flooded town streets", ["https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem"]],
  ["Dungeon Meshi", "P0", "FALLBACK", "Golden Kingdom dungeon Red Dragon chamber and improvised camp kitchen", ["https://delicious-in-dungeon.com/"]],
  ["Noob", "P0", "FALLBACK", "Centralis imperial plaza and Guild Noob meeting route", ["https://wiki.olydri.com/index.php?title=Empire"]],
  ["Rammstein", "P0", "FALLBACK", "Rammstein stadium tower stage and Feuerzone", ["https://presse.rammstein.de/en"]],
  ["System of a Down", "P0", "FALLBACK", "B.Y.O.B. militarized banquet march through an urban protest set", ["https://www.systemofadown.com/music"]],
  ["Rob Zombie", "P0", "FALLBACK", "Dragula tunnel, industrial horror carnival and Munster-style hot-rod route", ["https://www.robzombie.com/music"]],
  ["Daft Punk", "P0", "FALLBACK", "Alive 2007 LED pyramid stage", ["https://www.daftpunktour.com/"]],
  ["Oliver Tree", "P0", "FALLBACK", "Hurt demolition lot and giant kick-scooter test ramp", ["https://www.atlanticrecords.com/artists/oliver-tree"]],
  ["Hazbin Hotel", "P0", "FALLBACK", "Hazbin Hotel lobby opening onto Pentagram City", ["https://www.aboutamazon.com/news/entertainment/hazbin-hotel-prime-video"]],
  ["Vocaloid", "P1", "FALLBACK", "Magical Mirai concert floor and Shibuya projection stage", ["https://magicalmirai.com/"]],
  ["Slender Man", "P1", "FALLBACK", "Eight Pages forest trail and abandoned bathhouse clearing", ["https://www.mobygames.com/game/54694/slender-the-eight-pages/"]],
  ["Unreal", "P1", "FALLBACK", "DM-Deck16 industrial arena adapted to a Liandri tactics grid", ["https://www.epicgames.com/unrealtournament/"]],
  ["Breaking Bad", "P1", "ABSENT-VISUEL", "Lavanderia Brillante underground superlab", ["https://www.amc.com/shows/breaking-bad--1002078"]],
  ["Stargate Atlantis", "P1", "ABSENT-VISUEL", "Atlantis Gate Room during a city-shield siege", ["https://www.gateworld.net/atlantis/"]],
  ["Stargate Universe", "P1", "ABSENT-VISUEL", "Destiny Gate Room and observation-deck corridor", ["https://www.gateworld.net/universe/"]],
  ["Charmed", "P1", "ABSENT-VISUEL", "Halliwell Manor attic above the spiritual Nexus", ["https://en.wikipedia.org/wiki/Charmed"]],
  ["Buffy the Vampire Slayer", "P1", "ABSENT-VISUEL", "Sunnydale High library directly above the Hellmouth", ["https://en.wikipedia.org/wiki/Buffy_the_Vampire_Slayer"]],
  ["Attack on Titan", "P1", "ABSENT-VISUEL", "Shiganshina outer gate and rooftop defense line", ["https://shingeki.tv/final/"]],
  ["Death Note", "P1", "ABSENT-VISUEL", "Yellow Box warehouse confrontation floor", ["https://www.viz.com/death-note"]],
  ["Cells at Work!", "P1", "ABSENT-VISUEL", "Red Bone Marrow production hall opening into a blood-vessel infection front", ["https://hataraku-saibou.com/"]],
  ["Inuyashiki", "P1", "ABSENT-VISUEL", "Shinjuku aerial battle over Tokyo streets", ["https://www.inuyashiki-project.com/"]],
  ["Borderlands", "P1", "ABSENT-VISUEL", "Fyrestone approach and Destroyer Vault threshold", ["https://borderlands.2k.com/"]],
  ["From", "P1", "ABSENT-VISUEL", "Colony House grounds and looping town road", ["https://www.mgmplus.com/series/from"]],
  ["Uzumaki", "P1", "ABSENT-VISUEL", "Kurozu-cho lighthouse and Dragonfly Pond spiral district", ["https://www.adultswim.com/videos/uzumaki"]],
  ["Toxic Avenger", "P1", "ABSENT-VISUEL", "Tromaville Health Club alley beside the toxic-waste dump", ["https://www.troma.com/films/the-toxic-avenger/"]],
  ["Exit 8", "P1", "ABSENT-VISUEL", "Exit 8 underground passage with repeatable anomaly modules", ["https://store.steampowered.com/app/2653790/The_Exit_8/"]],
  ["Hell House LLC", "P1", "ABSENT-VISUEL", "Abaddon Hotel basement corridor and dining-room route", ["https://www.hellhousellc.com/"]],
  ["Sausage Party", "P1", "ABSENT-VISUEL", "Shopwell's central aisle and loading dock", ["https://www.sonypictures.com/movies/sausageparty"]],
  ["Spy x Family", "P1", "ABSENT-VISUEL", "Eden Academy courtyard during the dodgeball/mission route", ["https://spy-family.net/"]],
  ["Terrifier", "P1", "ABSENT-VISUEL", "Miles County carnival funhouse and laundromat alley", ["https://en.wikipedia.org/wiki/Terrifier"]],
  ["Tenacious D", "P1", "ABSENT-VISUEL", "Open-mic stage transitioning into the Rock-Off with the Devil", ["https://en.wikipedia.org/wiki/Tenacious_D_in_The_Pick_of_Destiny"]],
  ["M3GAN", "P1", "ABSENT-VISUEL", "Funki research demonstration room and Gemma's workshop", ["https://www.universalpictures.com/movies/m3gan"]],
  ["War of the Worlds", "P1", "ABSENT-VISUEL", "Bayonne street and ferry approach under Tripod attack", ["https://www.paramountpictures.com/movies/war-of-the-worlds"]],
  ["Ghostbusters", "P1", "ABSENT-VISUEL", "55 Central Park West rooftop temple", ["https://www.sonypictures.com/movies/ghostbusters"]],
  ["Onechanbara", "P1", "ABSENT-VISUEL", "Zombie-infested Shinjuku rooftop and subway entrance", ["https://store.steampowered.com/app/1232460/Onee_Chanbara_ORIGIN/"]],
  ["Despicer", "P0", "ABSENT-VISUEL", "A definir apres identification de l'oeuvre exacte", ["https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/expandedUniverses.js"]],
  ["Repo! The Genetic Opera", "P1", "ABSENT-VISUEL", "Genetic Opera stage inside GeneCo tower", ["https://en.wikipedia.org/wiki/Repo!_The_Genetic_Opera"]],
  ["Tremors", "P1", "ABSENT-VISUEL", "Perfection general store rooftops and exposed road", ["https://www.universalpictures.com/movies/tremors"]],
  ["Skyline", "P1", "ABSENT-VISUEL", "Marina del Rey penthouse rooftop under the blue harvest light", ["https://en.wikipedia.org/wiki/Skyline_(2010_film)"]],
  ["Planete Hurlante", "P1", "ABSENT-VISUEL", "New Alamo bunker perimeter and radioactive battlefield", ["https://www.imdb.com/title/tt0114367/"]],
  ["Sharknado", "P1", "ABSENT-VISUEL", "Santa Monica pier and flooded Los Angeles freeway", ["https://www.syfy.com/movies/sharknado"]],
  ["Godzilla The Animated Series", "P1", "ABSENT-VISUEL", "H.E.A.T. headquarters at Jamaica Bay and Manhattan waterfront", ["https://www.sonypictures.com/tv/godzillatheseries"]],
  ["Malcolm in the Middle", "P1", "ABSENT-VISUEL", "Wilkerson family house, living room and backyard", ["https://www.hulu.com/series/malcolm-in-the-middle"]],
  ["Tanya the Evil", "P1", "ABSENT-VISUEL", "Rhine front trench network with aerial-mage launch posts", ["https://youjo-senki.jp/"]],
  ["Virus", "P1", "ABSENT-VISUEL", "Akademik Vladislav Volkov storm deck and machine shop", ["https://www.imdb.com/title/tt0120458/"]],
  ["House of the Dead", "P1", "ABSENT-VISUEL", "Curien Mansion entrance hall and laboratory route", ["https://www.sega.com/games/the-house-of-the-dead-remake"]],
  ["House of the Dead 2", "P1", "ABSENT-VISUEL", "Venetian canal plaza on the Goldman rescue route", ["https://www.mobygames.com/game/3220/the-house-of-the-dead-2/"]],
  ["House of the Dead 3", "P1", "ABSENT-VISUEL", "EFI Research Facility lobby and Wheel of Fate chamber", ["https://www.mobygames.com/game/11040/the-house-of-the-dead-iii/"]],
  ["Toy Soldiers", "P1", "ABSENT-VISUEL", "WWI trench diorama across a child's bedroom table", ["https://store.steampowered.com/app/98300/Toy_Soldiers/"]],
  ["Shaun of the Dead", "P1", "ABSENT-VISUEL", "The Winchester pub interior during the siege", ["https://www.focusfeatures.com/shaun_of_the_dead"]],
  ["Puppet Master", "P1", "ABSENT-VISUEL", "Bodega Bay Inn corridor and Toulon's hidden workshop", ["https://www.fullmoondirect.com/Puppet-Master_c_34.html"]],
  ["Chicken Run", "P1", "ABSENT-VISUEL", "Tweedy Farm coop yard and pie-machine conveyor", ["https://www.aardman.com/film-tv-games/chicken-run/"]],
  ["Another", "P1", "ABSENT-VISUEL", "Yomiyama North Middle School class 3-3 and stairwell", ["https://www.crunchyroll.com/series/GR09X52WR/another"]],
  ["Gunnm", "P1", "ABSENT-VISUEL", "Motorball circuit beneath Zalem with Scrapyard maintenance pits", ["https://kodansha.us/series/battle-angel-alita/"]],
  ["Battle Royale", "P1", "ABSENT-VISUEL", "Okishima school briefing room and island sector junction", ["https://www.criterion.com/films/28834-battle-royale"]],
  ["Spawn", "P1", "ABSENT-VISUEL", "Rat City alley beneath the abandoned church", ["https://imagecomics.com/comics/series/spawn"]],
  ["Linkin Park", "P1", "ABSENT-VISUEL", "In the End desert monument and Meteora industrial performance room", ["https://www.linkinpark.com/music"]],
  ["Moonwalker", "P1", "ABSENT-VISUEL", "Club 30 speakeasy from Smooth Criminal", ["https://www.michaeljackson.com/film/michael-jackson-moonwalker/"]],
  ["Michael Jackson", "P1", "ABSENT-VISUEL", "Thriller Palace Theater street and graveyard set", ["https://www.michaeljackson.com/the-artist/short-films/"]],
  ["The Thing", "P1", "ABSENT-VISUEL", "Outpost 31 recreation room during the blood test", ["https://www.universalpictures.com/movies/the-thing"]],
  ["Evil Dead", "P1", "ABSENT-VISUEL", "Knowby cabin living room, cellar trapdoor and forest porch", ["https://www.sonypictures.com/movies/theevildead"]],
  ["Chappie", "P1", "ABSENT-VISUEL", "Tetravaal robotics floor and Johannesburg industrial yard", ["https://www.sonypictures.com/movies/chappie"]],
  ["Gremlins", "P1", "ABSENT-VISUEL", "Kingston Falls movie theater and department-store street", ["https://www.warnerbros.com/movies/gremlins"]],
  ["Rocky Horror Picture Show", "P1", "ABSENT-VISUEL", "Frankenstein Place laboratory and floor-show theater", ["https://www.20thcenturystudios.com/movies/the-rocky-horror-picture-show"]],
  ["La Cite de la Peur", "P1", "ABSENT-VISUEL", "Palais des Festivals projection hall and Croisette steps", ["https://www.studiocanal.com/title/la-cite-de-la-peur-1994/"]],
  ["Defiance", "P1", "ABSENT-VISUEL", "Defiance main street and NeedWant exterior during an Arkfall", ["https://www.syfy.com/defiance"]],
  ["Mars Attacks", "P1", "ABSENT-VISUEL", "United States Capitol lawn and Las Vegas hotel collapse", ["https://www.warnerbros.com/movies/mars-attacks"]],
  ["Dandadan", "P1", "ABSENT-VISUEL", "Shono City tunnel and Ayase residence occult threshold", ["https://anime-dandadan.com/"]],
  ["Cloverfield", "P1", "ABSENT-VISUEL", "Brooklyn Bridge evacuation route and collapsing Manhattan street", ["https://www.paramountpictures.com/movies/cloverfield"]],
  ["The Collector", "P1", "ABSENT-VISUEL", "Chase residence foyer and basement trap network", ["https://www.imdb.com/title/tt0844479/"]],
  ["H2G2", "P1", "ABSENT-VISUEL", "Heart of Gold bridge during an improbability event", ["https://www.disneyplus.com/movies/the-hitchhikers-guide-to-the-galaxy/3UTb2DixWfQZ"]],
  ["Iron Sky", "P1", "ABSENT-VISUEL", "Schwarze Sonne moonbase hangar and Gotterdammerung launch rail", ["https://ironsky.net/"]],
  ["REC", "P1", "ABSENT-VISUEL", "Rambla de Catalunya apartment stairwell and attic", ["https://www.filmax.com/en/movie/rec"]],
  ["Sinister", "P1", "ABSENT-VISUEL", "Oswalt house attic with projector and film boxes", ["https://www.blumhouse.com/movies/sinister"]],
  ["Les Visiteurs", "P1", "ABSENT-VISUEL", "Chateau de Montmirail great hall and forest witch hut threshold", ["https://www.gaumont.fr/fr/film/les-visiteurs"]],
  ["Voyage de Chihiro", "P1", "ABSENT-VISUEL", "Aburaya bathhouse bridge and boiler-room access", ["https://www.ghibli.jp/works/chihiro/"]],
  ["Meet the Feebles", "P1", "ABSENT-VISUEL", "Feebles Variety Theatre backstage and stage wings", ["https://www.nzonscreen.com/title/meet-the-feebles-1989"]],
  ["Roger Rabbit", "P1", "ABSENT-VISUEL", "Acme warehouse threshold opening into Toontown", ["https://movies.disney.com/who-framed-roger-rabbit"]],
  ["Starship Troopers", "P1", "ABSENT-VISUEL", "Klendathu landing zone and Whiskey Outpost wall", ["https://www.sonypictures.com/movies/starshiptroopers"]],
  ["Banlieue 13", "P1", "ABSENT-VISUEL", "B13 tower-block rooftops and casino approach", ["https://www.imdb.com/title/tt0414852/"]],
  ["House of 1000 Corpses", "P1", "ABSENT-VISUEL", "Captain Spaulding's Museum of Monsters and Madmen and Firefly house", ["https://www.lionsgate.com/movies/house-of-1000-corpses"]],
  ["Overlord Anime", "P1", "ABSENT-VISUEL", "Throne Room of Nazarick and Lemegeton approach", ["https://overlord-anime.com/"]],
  ["SCP Foundation", "P1", "ABSENT-VISUEL", "Modular Site-19 containment wing based on SCP facility conventions", ["https://scp-wiki.wikidot.com/secure-facilities-locations"]],
  ["Spoof Movie", "P0", "ABSENT-VISUEL", "A definir apres choix du film ou de la franchise parodique exacte", ["https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/expandedUniverses.js"]],
  ["Metal Gear Rising", "P1", "ABSENT-VISUEL", "World Marshal headquarters rooftop in Denver", ["https://store.steampowered.com/app/235460/METAL_GEAR_RISING_REVENGEANCE/"]],
  ["BioShock", "P1", "ABSENT-VISUEL", "Medical Pavilion atrium and bathysphere station", ["https://bioshock.2k.com/"]],
  ["Twisted Metal", "P1", "ABSENT-VISUEL", "Los Angeles freeway interchange and Calypso tournament arena", ["https://www.playstation.com/en-us/games/twisted-metal/"]],
  ["Spider-Man PS1", "P1", "ABSENT-VISUEL", "Daily Bugle rooftop route above the toxic fog", ["https://www.mobygames.com/game/3347/spider-man/"]],
  ["Final Fantasy VII", "P1", "ABSENT-VISUEL", "Mako Reactor 1 catwalk and core chamber", ["https://na.finalfantasy.com/titles/finalfantasy7"]],
  ["Final Fantasy VIII", "P1", "ABSENT-VISUEL", "Balamb Garden central hall before the Battle of the Gardens", ["https://na.finalfantasy.com/titles/finalfantasy8"]],
  ["Final Fantasy XIII", "P1", "ABSENT-VISUEL", "Hanging Edge purge railway and fal'Cie structure", ["https://na.finalfantasy.com/titles/finalfantasy13"]],
  ["Final Fantasy XV", "P1", "ABSENT-VISUEL", "Insomnia Citadel plaza during the fall of Lucis", ["https://na.finalfantasy.com/titles/finalfantasy15"]],
  ["Crash Bandicoot", "P1", "ABSENT-VISUEL", "N. Sanity Beach route ending at Cortex Castle machinery", ["https://www.crashbandicoot.com/"]],
  ["Tomb Raider", "P1", "ABSENT-VISUEL", "Lost Valley ruins and waterfall from Tomb Raider 1996", ["https://www.tombraider.com/"]],
  ["Tekken", "P1", "ABSENT-VISUEL", "Hon-Maru Mishima dojo courtyard", ["https://tekken.com/"]],
  ["Spyro", "P1", "ABSENT-VISUEL", "Artisans homeworld central meadow and Stone Hill portal court", ["https://www.spyrothedragon.com/"]],
  ["Rayman", "P1", "ABSENT-VISUEL", "Dream Forest Pink Plant Woods and Moskito route", ["https://www.ubisoft.com/en-us/game/rayman"]],
  ["Parasite Eve", "P1", "ABSENT-VISUEL", "Carnegie Hall stage after the opera combustion", ["https://www.mobygames.com/game/2255/parasite-eve/"]],
  ["Oddworld", "P1", "ABSENT-VISUEL", "RuptureFarms meat-processing line and employee pens", ["https://www.oddworld.com/oddworldgames/abes-oddysee/"]],
  ["Legacy of Kain", "P1", "ABSENT-VISUEL", "Pillars of Nosgoth sanctuary in the corrupted future", ["https://www.crystald.com/projects/legacy-of-kain-soul-reaver-1-2-remastered/"]],
  ["Guitar Hero", "P1", "ABSENT-VISUEL", "Guitar Hero III Lou's Inferno concert stage", ["https://www.guitarhero.com/"]],
  ["Disenchantment", "P1", "ABSENT-VISUEL", "Dreamland throne room and castle cliff balcony", ["https://www.netflix.com/title/80095697"]],
  ["The Simpsons", "P1", "ABSENT-VISUEL", "Springfield Nuclear Power Plant sector 7-G and reactor hall", ["https://www.disneyplus.com/series/the-simpsons/3ZoBZ52QHb4x"]],
  ["Futurama", "P1", "ABSENT-VISUEL", "Planet Express hangar and New New York delivery bay", ["https://www.hulu.com/series/futurama"]],
  ["Killzone", "P1", "ABSENT-VISUEL", "Pyrrhus City boulevard and ISA landing sector", ["https://www.playstation.com/en-us/killzone/"]],
  ["Yakuza", "P1", "ABSENT-VISUEL", "Theater Square and Millennium Tower frontage", ["https://games.sega.com/likeadragon/"]],
  ["Soul Calibur", "P1", "ABSENT-VISUEL", "Ostrheinsburg Castle throne approach", ["https://en.bandainamcoent.eu/soulcalibur/soulcalibur-vi"]],
  ["The Last of Us", "P1", "ABSENT-VISUEL", "Boston quarantine-zone checkpoint and collapsed downtown", ["https://www.playstation.com/en-us/games/the-last-of-us-part-i/"]],
  ["LittleBigPlanet", "P1", "ABSENT-VISUEL", "The Gardens cardboard theater and pod route", ["https://www.playstation.com/en-us/games/littlebigplanet-3/"]],
  ["Counter-Strike", "P1", "ABSENT-VISUEL", "Dust II bombsite B and tunnel approach", ["https://www.counter-strike.net/cs2"]],
  ["Left 4 Dead", "P1", "ABSENT-VISUEL", "No Mercy hospital rooftop finale", ["https://store.steampowered.com/app/500/Left_4_Dead/"]],
  ["Team Fortress 2", "P1", "ABSENT-VISUEL", "2Fort bridge and intelligence courtyards", ["https://www.teamfortress.com/"]],
  ["Jet Set Radio", "P1", "ABSENT-VISUEL", "Shibuya-cho bus terminal and rooftops", ["https://store.steampowered.com/app/205950/Jet_Set_Radio/"]],
  ["Altered Beast", "P1", "ABSENT-VISUEL", "Ancient Greece graveyard and temple road", ["https://www.sega.com/games/altered-beast"]],
  ["Streets of Rage", "P1", "ABSENT-VISUEL", "Streets of Rage 2 downtown waterfront and bar strip", ["https://www.sega.com/games/streets-of-rage-4"]],
  ["Earthworm Jim", "P1", "ABSENT-VISUEL", "New Junk City conveyor and tire-yard route", ["https://www.gog.com/en/game/earthworm_jim_1_2"]],
  ["Ecco the Dolphin", "P1", "ABSENT-VISUEL", "Home Bay opening toward Atlantis in The Tides of Time", ["https://www.sega.com/games/ecco-the-dolphin"]],
  ["Flashback", "P1", "ABSENT-VISUEL", "Titan jungle opening and New Washington memory terminal", ["https://www.microids.com/game-flashback/"]],
  ["Splatterhouse", "P1", "ABSENT-VISUEL", "West Mansion entrance hall and underground altar", ["https://www.bandainamcoent.com/games/splatterhouse"]],
  ["Skibidi", "P1", "ABSENT-VISUEL", "Camera City boulevard during the Alliance defense", ["https://www.youtube.com/@DaFuqBoom"]],
  ["Squid Game", "P1", "ABSENT-VISUEL", "Red Light, Green Light field and dormitory staircase access", ["https://www.netflix.com/title/81040344"]],
  ["La Casa de Papel", "P1", "ABSENT-VISUEL", "Royal Mint printing hall and vault corridor", ["https://www.netflix.com/title/80192098"]],
  ["Gorillaz", "P1", "ABSENT-VISUEL", "Plastic Beach island studio and shoreline", ["https://www.gorillaz.com/"]],
  ["Secret of Monkey Island", "P1", "ABSENT-VISUEL", "Melee Island Scumm Bar and dock street", ["https://www.lucasfilm.com/what-we-do/games/return-to-monkey-island/"]],
  ["Zombies Ate My Neighbors", "P1", "ABSENT-VISUEL", "Level 1 Zombie Panic suburban block and backyard pools", ["https://www.nintendo.com/us/store/products/zombies-ate-my-neighbors-and-ghoul-patrol-switch/"]],
  ["Wrong Turn", "P1", "ABSENT-VISUEL", "West Virginia fire lookout and cannibal cabin route", ["https://www.20thcenturystudios.com/movies/wrong-turn"]],
  ["Karune Cal", "P1", "ABSENT-VISUEL", "Calne Ca Bacterial Contamination industrial void", ["http://www.deino.sakura.ne.jp/Ca/ca.htm"]],
  ["Billie Eilish", "P1", "ABSENT-VISUEL", "Bad Guy yellow room and white corridor sets", ["https://www.billieeilish.com/"]],
  ["Guns N Roses", "P1", "ABSENT-VISUEL", "Use Your Illusion stadium stage and Paradise City industrial yard", ["https://www.gunsnroses.com/"]],
  ["Blackpink", "P1", "ABSENT-VISUEL", "Pink Venom geomungo temple and black-pink street set", ["https://www.blackpinkofficial.com/"]],
  ["Lil Nas X", "P1", "ABSENT-VISUEL", "Montero celestial court and underworld throne approach", ["https://www.lilnasx.com/"]],
  ["Eminem", "P1", "ABSENT-VISUEL", "The Shelter basement stage in Detroit", ["https://www.eminem.com/"]],
  ["Ghost", "P1", "ABSENT-VISUEL", "Ministry cathedral stage with stained-glass risers", ["https://ghost-official.com/"]],
  ["Babymetal", "P1", "ABSENT-VISUEL", "Metal Galaxy arena with Fox Gate and Kami-band risers", ["https://babymetal.com/"]],
  ["Little Big", "P1", "ABSENT-VISUEL", "Skibidi house set and UNO neon game-show stage", ["https://littlebig.band/"]],
  ["The Weeknd", "P1", "ABSENT-VISUEL", "After Hours Las Vegas casino street", ["https://www.theweeknd.com/"]],
  ["Ado", "P1", "ABSENT-VISUEL", "Usseewa graphic office-city set", ["https://www.universal-music.co.jp/ado/"]],
  ["ASMRZ", "P1", "ABSENT-VISUEL", "Good Night Ojou-sama mansion corridor and dance set", ["https://music.apple.com/us/artist/asmrz/1732950037"]],
  ["Lady Gaga", "P1", "ABSENT-VISUEL", "Chromatica desert citadel and Rain on Me plaza", ["https://www.ladygaga.com/"]],
  ["Nightwish", "P1", "ABSENT-VISUEL", "Imaginaerum winter circus and memory carousel", ["https://www.nightwish.com/"]],
  ["PSY", "P1", "ABSENT-VISUEL", "Gangnam Style stable, parking garage and blue dance floor", ["https://www.youtube.com/@officialpsy"]],
  ["Shakira", "P1", "ABSENT-VISUEL", "She Wolf white cage room and lunar rooftop", ["https://www.shakira.com/"]],
  ["Cthulhu", "P1", "ABSENT-VISUEL", "R'lyeh risen city from The Call of Cthulhu", ["https://en.wikisource.org/wiki/The_Call_of_Cthulhu"]],
  ["Necronomicon", "P1", "ABSENT-VISUEL", "Miskatonic library archive framing the 1993 anthology portals", ["https://www.imdb.com/title/tt0107664/"]],
  ["Re-Animator", "P1", "ABSENT-VISUEL", "Miskatonic Medical School morgue laboratory", ["https://www.arrowfilms.com/re-animator-blu-ray/11204546.html"]],
  ["Digimon Celestial Rift", "P0", "ABSENT-VISUEL", "A definir: choisir une serie Digimon et un lieu canonique avant generation", ["https://digimon.net/"]],
  ["Aural Vampire", "P1", "ABSENT-VISUEL", "Vampire Ecstasy industrial darkwave live club", ["https://www.auralvampire.com/"]],
  ["Buckethead", "P1", "ABSENT-VISUEL", "Bucketheadland haunted theme-park entrance and Giant Robot ride", ["https://www.bucketheadpikes.com/"]],
  ["Korn", "P1", "ABSENT-VISUEL", "Follow the Leader playground and arena pit", ["https://www.kornofficial.com/"]],
  ["Marilyn Manson", "P1", "ABSENT-VISUEL", "Mechanical Animals sterile glam television studio", ["https://www.marilynmanson.com/"]],
  ["Nexus de Convergence", "P1", "ABSENT-VISUEL", "Mosaic City Central Atrium and A.R.C.A. anchor infrastructure", ["https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js"]]
];

const FULL_COVERAGE_PROFILE_DEFINITIONS = [
  ["Splice", "P2", "ABSENT-VISUEL", "Nucleic Exchange Research Initiative embryo laboratory", ["https://en.wikipedia.org/wiki/Splice_(film)"]],
  ["Police Squad", "P2", "ABSENT-VISUEL", "Police Squad precinct bullpen and evidence room", ["https://www.paramountplus.com/shows/police-squad/"]],
  ["Stargate Infinity", "P2", "ABSENT-VISUEL", "SGC evacuation gate room in the animated continuity", ["https://en.wikipedia.org/wiki/Stargate_Infinity"]],
  ["The Brave Little Toaster", "P2", "ABSENT-VISUEL", "Ernie's Disposal junkyard crusher line", ["https://movies.disney.com/the-brave-little-toaster"]],
  ["Evolution", "P2", "ABSENT-VISUEL", "Glen Canyon mall service corridors during the selenium finale", ["https://en.wikipedia.org/wiki/Evolution_(2001_film)"]],
  ["Evolution: The Animated Series", "P2", "ABSENT-VISUEL", "Genus command laboratory and alien containment yard", ["https://en.wikipedia.org/wiki/Alienators:_Evolution_Continues"]],
  ["Early Edition", "P2", "ABSENT-VISUEL", "McGinty's bar and Chicago street delivery route", ["https://en.wikipedia.org/wiki/Early_Edition"]],
  ["VelociPastor", "P2", "ABSENT-VISUEL", "Church parish hall opening onto the Chinatown showdown alley", ["https://www.thevelocipastor.com/"]],
  ["Rubber", "P2", "ABSENT-VISUEL", "Mojave motel parking lot and desert road", ["https://en.wikipedia.org/wiki/Rubber_(2010_film)"]],
  ["Spermageddon", "P2", "ABSENT-VISUEL", "Reproductive-tract current junction and fertilization chamber", ["https://en.wikipedia.org/wiki/Spermageddon"]],
  ["Zak et Crysta", "P2", "ABSENT-VISUEL", "FernGully rainforest at the Leveler clearing", ["https://en.wikipedia.org/wiki/FernGully:_The_Last_Rainforest"]],
  ["Richard au pays des livres magiques", "P2", "ABSENT-VISUEL", "Library rotunda where Adventure, Fantasy and Horror wings converge", ["https://www.20thcenturystudios.com/movies/the-pagemaster"]],
  ["Les Visiteurs du Futur", "P2", "ABSENT-VISUEL", "Brigade Temporelle headquarters and devastated future-Paris portal", ["https://www.levisiteurdufutur.com/"]],
  ["Camera Cafe", "P2", "ABSENT-VISUEL", "Couloir de bureau vu depuis la machine a cafe", ["https://www.m6.fr/camera-cafe-p_845"]],
  ["Samantha Oups!", "P2", "ABSENT-VISUEL", "Appartement de Samantha, salon et entree", ["https://fr.wikipedia.org/wiki/Samantha_oups_!"]],
  ["Les Chevaliers du Fiel", "P2", "ABSENT-VISUEL", "Bureau municipal et cour de depot des Municipaux", ["https://www.chevaliersdufiel.com/"]],
  ["Noelle Perna", "P2", "ABSENT-VISUEL", "Bar des Oiseaux and petite scene nicoise de Mado", ["https://www.noelleperna.fr/"]],
  ["Kung Pow", "P2", "ABSENT-VISUEL", "Waterfall training field and Evil Council temple yard", ["https://en.wikipedia.org/wiki/Kung_Pow!_Enter_the_Fist"]],
  ["How to Make a Monster", "P2", "ABSENT-VISUEL", "Clayton Software motion-capture game studio", ["https://en.wikipedia.org/wiki/How_to_Make_a_Monster_(2001_film)"]],
  ["Elvira", "P2", "ABSENT-VISUEL", "Falwell movie theater and Elvira's inherited mansion parlor", ["https://www.elvira.com/"]],
  ["Heavy Metal 2000", "P2", "ABSENT-VISUEL", "Eden industrial wasteland and Odin's mining fortress approach", ["https://www.imdb.com/title/tt0119273/"]],
  ["Killer Tomatoes from Outer Space", "P2", "ABSENT-VISUEL", "San Diego government laboratory and tomato siege street", ["https://www.imdb.com/title/tt0080391/"]],
  ["Pee-wee", "P2", "ABSENT-VISUEL", "Pee-wee's Playhouse interior with bicycle workshop exit", ["https://peewee.com/"]],
  ["Pingu", "P2", "ABSENT-VISUEL", "Pingu's igloo village and fishing-hole route", ["https://www.pingu.jp/"]],
  ["Die Antwoord", "P2", "ABSENT-VISUEL", "Zef warehouse assembled from Fatty Boom Boom and Baby's on Fire practical sets", ["https://www.dieantwoord.com/"]],
  ["Les Inconnus", "P2", "ABSENT-VISUEL", "La Tele des Inconnus multi-set television studio", ["https://lesinconnus.fr/"]],
  ["RRRrrrr!!!", "P2", "ABSENT-VISUEL", "Village des Cheveux Propres and first-crime clearing", ["https://www.gaumont.fr/fr/film/rrrrrrr"]],
  ["Baby Cart", "P2", "ABSENT-VISUEL", "Edo-period post road, river ford and Yagyu ambush ridge", ["https://www.criterion.com/boxsets/1217-lone-wolf-and-cub"]],
  ["Les Tuche", "P2", "ABSENT-VISUEL", "Maison des Tuche a Bouzolles and football-yard street", ["https://www.pathefilms.com/film/lestuche"]],
  ["Kazaam", "P2", "ABSENT-VISUEL", "Abandoned city theater and rooftop hideout", ["https://www.imdb.com/title/tt0116756/"]],
  ["Croc", "P2", "ABSENT-VISUEL", "Forest Island village and Baron Dante castle approach", ["https://www.gog.com/en/game/croc_legend_of_the_gobbos"]],
  ["Rugrats", "P2", "ABSENT-VISUEL", "Pickles backyard transformed by baby-scale imagination", ["https://www.nick.com/shows/rugrats"]],
  ["Big Mouth", "P2", "ABSENT-VISUEL", "Bridgeton Middle School corridor and gym", ["https://www.netflix.com/title/80117038"]],
  ["Family Guy", "P2", "ABSENT-VISUEL", "Griffin house living room and Spooner Street frontage", ["https://www.fox.com/family-guy/"]],
  ["American Dad", "P2", "ABSENT-VISUEL", "Smith house operations basement and CIA Situation Room", ["https://www.tbs.com/shows/american-dad"]],
  ["Lost Planet 2", "P2", "ABSENT-VISUEL", "Episode 1 jungle railway and mining facility", ["https://www.capcom-games.com/product/en-us/lostplanet2/"]],
  ["Seaman", "P2", "ABSENT-VISUEL", "Seaman aquarium on the caretaker's living-room table", ["https://www.mobygames.com/game/2910/seaman/"]],
  ["Dynamite Duke", "P2", "ABSENT-VISUEL", "Bio-army laboratory corridor and final command bunker", ["https://www.mobygames.com/game/10074/dynamite-duke/"]],
  ["Cool Spot", "P2", "ABSENT-VISUEL", "Shell Shock beach with bottle platforms", ["https://www.mobygames.com/game/5803/cool-spot/"]],
  ["Ristar", "P2", "ABSENT-VISUEL", "Planet Flora's Neer forest and star-handle route", ["https://www.sega.com/games/ristar"]],
  ["Skrillex", "P2", "ABSENT-VISUEL", "Bangarang scrapyard performance set", ["https://www.skrillex.com/"]],
  ["Indila", "P2", "ABSENT-VISUEL", "Paris storm boulevard inspired by Derniere Danse", ["https://www.youtube.com/@IndilaOfficiel"]],
  ["Kyary Pamyu Pamyu", "P2", "ABSENT-VISUEL", "PONPONPON pastel room and surreal corridor", ["https://kyary.asobisystem.com/"]],
  ["Sub Urban", "P2", "ABSENT-VISUEL", "Cradles distorted suburban dollhouse", ["https://www.thatsuburban.com/"]],
  ["Bella Poarch", "P2", "ABSENT-VISUEL", "Build a Bitch assembly factory", ["https://www.bellapoarch.com/"]],
  ["Man with a Mission", "P2", "ABSENT-VISUEL", "MAN WITH A MISSION live arena with mission-control video wall", ["https://www.mwamjapan.info/"]],
  ["Band-Maid", "P2", "ABSENT-VISUEL", "BAND-MAID live serving stage with twin-riser layout", ["https://bandmaid.tokyo/"]],
  ["Bring Me the Horizon", "P2", "ABSENT-VISUEL", "POST HUMAN arena stage with cyber-medical screen architecture", ["https://www.bmthofficial.com/"]],
  ["Atarashii Gakko", "P2", "ABSENT-VISUEL", "Seishun academy gym and rooftop performance set", ["https://leaders.asobisystem.com/"]],
  ["Queen Bee", "P2", "ABSENT-VISUEL", "Mephisto theater stage and backstage mirror corridor", ["https://www.ziyoou-vachi.com/"]],
  ["Ladybaby", "P2", "ABSENT-VISUEL", "Nippon Manju market-street performance set", ["https://www.ladybaby-fc.com/"]],
  ["Bigflo & Oli", "P2", "ABSENT-VISUEL", "Toulouse Zenith stage opening toward Capitole facades", ["https://bigfloetoli.com/"]],
  ["Hoshi", "P2", "ABSENT-VISUEL", "Paris rain street and intimate Coeur Parapluie theater", ["https://hoshi-officiel.com/"]],
  ["Within Temptation", "P2", "ABSENT-VISUEL", "Mother Earth forest-ruin concert and Resist screen architecture", ["https://www.within-temptation.com/"]],
  ["Ultra Vomit", "P2", "ABSENT-VISUEL", "Kammthaar forest parody set and live-stage portal", ["https://ultravomit.fr/"]],
  ["Tommy Heavenly6", "P2", "ABSENT-VISUEL", "Pray gothic churchyard and candy-punk bedroom set", ["https://www.sonymusic.co.jp/artist/Tommyheavenly6/"]],
  ["Black Eyed Peas", "P2", "ABSENT-VISUEL", "Boom Boom Pow white digital soundstage", ["https://www.blackeyedpeas.com/"]],
  ["Shaka Ponk", "P2", "ABSENT-VISUEL", "Goz-projection live arena and mechanical jungle screens", ["https://www.shakaponk.com/"]],
  ["Deadmau5", "P2", "ABSENT-VISUEL", "Cube v3 concert stage", ["https://deadmau5.com/"]],
  ["Tomba", "P3", "DEJA-FAIT", "Mushroom Forest, Phoenix Mountain and Seven Evil Pig Bag sanctuary", ["https://www.nintendo.com/us/store/products/tomba-special-edition-switch/"], "Late-1990s PlayStation fantasy island, giant mushrooms, branching wooden routes, Phoenix Mountain cliffs and seven color-coded curse sanctuaries"],
  ["The Ring", "P3", "DEJA-FAIT", "Shelter Mountain Cabin 12, Morgan Ranch and the stone well television threshold", ["https://www.paramountpictures.com/movies/the-ring"], "Cold Pacific Northwest cabin floorboards, wet stone well, Morgan Ranch evidence spaces, CRT static and desaturated green-gray light"],
  ["The Grudge", "P3", "DEJA-FAIT", "Saeki house care route, investigation chain and staircase-attic threshold", ["https://www.sonypictures.com/movies/thegrudge2004"], "Ordinary Tokyo domestic interiors, Saeki staircase, sealed closet, attic hatch, fluorescent gray light and oppressive black negative space"],
  ["A Nightmare on Elm Street", "P3", "DEJA-FAIT", "1428 Elm Street, Westin Hills ward and Springwood boiler room", ["https://www.wescraven.com/film/a-nightmare-on-elm-street/"], "1980s suburban dream architecture, dirty boiler metal, red-green accents, practical household traps and theatrical nightmare transitions"],
  ["Woodruff", "P1", "A-VERIFIER", "Vlurxtrznbnaxl lower city, Administration factory gate and Bigwig apartment", ["https://archive.org/details/woodruff-and-the-schnibble-of-azimuth"], "Hand-painted vertical dystopian city, Boozook lower levels, dense pipes, Transportozon booths, absurd bureaucracy and angular 1990s French adventure-game machinery"],
  ["Steins;Gate", "P1", "A-VERIFIER", "Future Gadget Lab, apartment raid and Radio Kaikan roof as distinct locations", ["https://steinsgate.jp/"], "Future Gadget Lab worn floor, Akihabara electronics, Radio Kaikan rooftop concrete, amber cathode glow and divergence-meter circuitry"],
  ["JoJo's Bizarre Adventure", "P2", "A-VERIFIER", "DIO mansion Cairo, Battle Tendency volcano and Rome Colosseum Requiem as separate packs", ["https://jojo-portal.com/"], "DIO mansion terracotta and Fatimid Cairo stone, Battle Tendency volcanic rock, Rome Colosseum marble under supernatural color shifts"],
  ["Elfen Lied", "P2", "A-VERIFIER", "Kamakura coastal Kaede house and Diclonius research island", ["https://yenpress.com/series/elfen-lied"], "Kamakura coastal concrete, sterile Diclonius containment facility, Kaede house wood and research-island steel"],
  ["Fullmetal Alchemist", "P2", "A-VERIFIER", "Central Command, Laboratory Five and Briggs Fortress as distinct packs", ["https://fullmetalalchemistusa.com/"], "Central Command stone and military tile, Laboratory Five alchemy floor, Briggs fortress steel and snow"],
  ["Gantz", "P2", "A-VERIFIER", "Tokyo Gantz apartment, Osaka river district and Rome statue plaza", ["https://www.darkhorse.com/Books/3002-925/Gantz-Omnibus-Volume-1-TPB"], "Tokyo apartment black-sphere room, Osaka night streets slick with rain, Rome marble statues and alien black technology"],
  ["Psycho-Pass", "P2", "A-VERIFIER", "Public Safety Bureau, Hyper-Oats factory and SEAUn urban grid", ["https://psycho-pass.com/"], "Public Safety Bureau glass and alloy, holographic Tokyo streets, Hyper-Oats industrial farm and SEAUn institutional concrete"],
  ["Frieren: Beyond Journeys End", "P1", "A-VERIFIER", "Northern Plateau road, first-class exam ruins and El Dorado", ["https://frieren-anime.jp/"], "Northern Plateau grass and old stone, mage-exam ruins, El Dorado gold-transmuted masonry and quiet medieval roads"],
  ["Naruto", "P1", "A-VERIFIER", "Chunin Exams Forest of Death, Konoha rooftops and Valley of the End", ["https://naruto-official.com/en/anime/naruto1"], "Forest of Death roots and moss, Konoha rooftop tile, Valley of the End wet stone and river-worn combat ground"],
  ["Naruto Shippuden", "P1", "A-VERIFIER", "Fourth Shinobi World War front, Amegakure and Kamui dimension", ["https://naruto-official.com/en/anime/naruto2"], "Fourth Shinobi War blasted earth, Amegakure rain-soaked metal, Kamui dimension gray blocks and red-black chakra damage"],
  ["Boruto: Naruto Next Generations", "P1", "A-VERIFIER", "Modern Konoha Chunin arena, Kara chamber and Otsutsuki invasion", ["https://naruto-official.com/en/anime/boruto"], "Modern Konoha Chunin arena, clean village concrete and rail technology, Kara chamber black alloy and Isshiki invasion fractures"],
  ["Boruto: Two Blue Vortex", "P1", "A-VERIFIER", "Time-skip Konoha siege, Claw Grime sectors and Divine Tree dimension", ["https://naruto-official.com/en/special/tbv"], "Damaged modern Konoha, Claw Grime black-red marks, Ten-Tails pocket dimension pale stone and Divine Tree root networks"],
  ["Les Aventures de Saturnin", "P1", "A-VERIFIER", "Saturnin miniature village, Professor Popof workshop and alpine ski set", ["https://catalogue.ina.fr/doc/TV-RADIO/DA_CPB94001362/les-matins-de-saturnin-emission-du-13-fevrier-1994"], "1960s live-animal miniature village, painted Professor Popof workshop, tiny roads, alpine ski-set snow and handcrafted props"],
  ["MagiC JacK", "P1", "A-VERIFIER", "Minute Sapiens tribunal, social-mirror studio and Max Rage concert indictment", ["https://www.magicjackofficial.com/"], "Minute Sapiens tribunal set, stark social-mirror studio, rough Max Rage concert stage and handmade satirical props"],
  ["Teen Titans", "P0", "A-VERIFIER", "Titans Tower operations room, HIVE Academy and Azarath", ["https://www.dc.com/tv/teen-titans-2003-2005"], "2003 animated Titans Tower alloy and glass, HIVE Academy training floor and Azarath stone under a violet eclipse"],
  ["Godzilla", "P1", "A-VERIFIER", "Era-specific Tokyo destruction, Shin evacuation grid and Lake Ashinoko Biollante bloom", ["https://godzilla.com/blogs/movies"], "Tokyo asphalt crushed at kaiju scale, Shin Godzilla evacuation-grid roads, Lake Ashinoko biological roots and burned reinforced concrete"],
  ["Chainsaw Man", "P3", "DEJA-FAIT", "Tokyo Public Safety Devil Hunt, Eternity Devil hotel and Gun Devil snowfield", ["https://chainsawman.dog/tvseries/introduction/"], "Public Safety Tokyo concrete, fluorescent hotel corridors folded by the Eternity Devil, dirty snow and distant urban devastation"],
  ["Cyberpunk: Edgerunners", "P3", "DEJA-FAIT", "Night City Arasaka Tower, Santo Domingo highway and cyberskeleton route", ["https://www.cyberpunk.net/en/edgerunners"], "Night City asphalt, Arasaka corporate alloy, Santo Domingo highway paint, holographic cyan and acidic yellow reflections"],
  ["Demon Slayer", "P3", "DEJA-FAIT", "Infinity Castle, Mount Natagumo and Entertainment District roofs", ["https://kimetsu.com/anime/mugenjyohen_movie/"], "Infinity Castle lacquered wood and impossible tatami geometry, Mount Natagumo moss and silk, Entertainment District roof tiles"],
  ["Parasyte", "P3", "DEJA-FAIT", "East Fukuyama school, city hall and Gotou forest pursuit", ["https://www.vap.co.jp/kiseiju/intro/"], "Ordinary Japanese school and city-hall surfaces invaded by wet alien tissue, forest soil scorched during the Gotou pursuit"],
  ["Zero Escape: The Nonary Games", "P3", "DEJA-FAIT", "Gigantic Nonary Game ship and Decision Game bunker", ["https://www.spike-chunsoft.com/games/zero-escape-nonary-games/"], "Gigantic ocean-liner steel decks, numbered-door mechanisms without readable numerals, AB lunar facility alloy and Decision Game bunker concrete"],
  ["Rurouni Kenshin", "P3", "DEJA-FAIT", "Meiji Kyoto, Kamiya dojo and Shishio ironclad", ["https://rurouni-kenshin.com/"], "Meiji Kyoto timber streets, Kamiya dojo floorboards and tatami, Shishio ironclad deck charred by heat and oil"],
  ["Tokyo Ghoul", "P3", "DEJA-FAIT", "Ward 20 Anteiku, Cochlea and Tokyo rooftops", ["https://tokyoghoul-anime10th.jp/"], "Anteiku cafe wood and tile, Cochlea prison concrete, rain-dark Tokyo rooftop surfaces with restrained kagune-red reflections"],
  ["Cowboy Bebop", "P3", "DEJA-FAIT", "Mars Red Dragon district, Bebop hangar and cathedral", ["https://www.cowboy-bebop.net/"], "Mars syndicate streets, Bebop hangar steel, cathedral stone and stained-glass color, worn retro-future machinery"],
  ["Dragon Ball Z", "P3", "DEJA-FAIT", "Cell Games arena, Namek battlefield and Hyperbolic Time Chamber", ["https://en.dragon-ball-official.com/news/01_1258.html"], "Cell Games square stone tiles in a barren plain, fractured Namek ground and water, Hyperbolic Time Chamber white ceramic floor"],
  ["Mashle", "P3", "DEJA-FAIT", "Easton Magic Academy and Divine Visionary arena", ["https://mashle.pw/"], "Easton Magic Academy stone halls, Magia Lupus maze masonry and Divine Visionary arena tiles with subtle magic-line damage"],
  ["Solo Leveling", "P3", "DEJA-FAIT", "Cartenon Double Dungeon, Jeju nest and Seoul invasion", ["https://sololeveling-anime.net/"], "Cartenon double-dungeon stone and blue flame, Jeju ant-nest basalt, Seoul invasion asphalt under violet shadow energy"],
  ["Deadman Wonderland", "P3", "DEJA-FAIT", "G Ward, Dog Race arena and Mother Goose chamber", ["https://www.viz.com/deadman-wonderland"], "G Ward industrial prison, Dog Race carnival arena, Mother Goose chamber alloy and blood-weapon scoring"],
  ["Devilman", "P3", "DEJA-FAIT", "Tokyo demon apocalypse, Sabbath club and Armageddon ruins", ["https://devilman-crybaby.com/"], "Tokyo apocalypse asphalt, Sabbath nightclub floor and Armageddon rubble with demonic silhouettes excluded from the texture itself"],
  ["Neon Genesis Evangelion", "P3", "DEJA-FAIT", "Tokyo-3, Geofront and Terminal Dogma defense sectors", ["https://www.evangelion.jp/"], "Tokyo-3 armored streets, Geofront hexagonal alloy, Ramiel operation road plating and Terminal Dogma white-red industrial floor"],
  ["One Punch Man", "P3", "DEJA-FAIT", "City A Hero Association and Monster Association underground", ["https://onepunchman-anime.net/"], "City A association plaza, Monster Association subterranean concrete and Boros ship alien alloy over a devastated metropolis"],
  ["Sword Art Online: Gun Gale Online", "P3", "DEJA-FAIT", "Gun Gale Online Bullet of Bullets and Squad Jam desert", ["https://gungale-onlineusa.com/1st/story/"], "Bullet of Bullets desert ruins, Squad Jam abandoned city concrete, game-world steel cover and vivid pink scan accents"],
  ["Sword Art Online", "P3", "DEJA-FAIT", "Aincrad Floor 74 labyrinth and boss chamber", ["https://www.swordart-online.net/aincrad/story/"], "Aincrad Floor 1 medieval plaza stone, Floor 74 labyrinth masonry and Floor 75 boss-chamber obsidian tile"]
];

const STAGE_ARC_PROFILE_DEFINITIONS = [
  {
    key: 'stargate_x_halo',
    stageId: 9001,
    priority: 'P0',
    auditStatus: 'FALLBACK',
    canonicalName: 'Installation 04 control room traversed by an active Stargate and SGC field equipment',
    referenceUrls: ['https://www.halowaypoint.com/halo-the-series', 'https://www.mgm.com/television/stargate-sg-1'],
    universes: ['Halo', 'Stargate']
  },
  {
    key: 'matrix_portal_ghost',
    stageId: 9002,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Construct white room broken by Aperture test chambers and New Port cyberbrain infrastructure',
    referenceUrls: ['https://www.warnerbros.com/movies/matrix', 'https://store.steampowered.com/app/620/Portal_2/', 'https://theghostintheshell.jp/'],
    universes: ['The Matrix', 'Portal', 'Ghost in the Shell']
  },
  {
    key: 'silent_resident_saw',
    stageId: 9003,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Brookhaven or Alchemilla ward fused with RPD medical storage and Saw trap rails',
    referenceUrls: ['https://www.konami.com/games/silenthill/', 'https://game.capcom.com/residentevil/', 'https://www.lionsgate.com/franchises/saw'],
    universes: ['Silent Hill', 'Resident Evil', 'Saw']
  },
  {
    key: 'buffycharmed_hellraiser',
    stageId: 9004,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Sunnydale High library Hellmouth crossed with Halliwell Manor attic and Leviathan corridor',
    referenceUrls: ['https://en.wikipedia.org/wiki/Buffy_the_Vampire_Slayer', 'https://www.cwtv.com/shows/charmed/', 'https://press.hulu.com/shows/hellraiser/'],
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser']
  },
  {
    key: 'breakingbad_splice_evolution',
    stageId: 9005,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Lavanderia superlab contaminated by Nucleic Exchange tanks and Glen Canyon alien growth',
    referenceUrls: ['https://www.amc.com/shows/breaking-bad--1002078', 'https://en.wikipedia.org/wiki/Splice_(film)', 'https://www.dreamworks.com/movies/evolution'],
    universes: ['Breaking Bad', 'Splice', 'Evolution']
  },
  {
    key: 'aot_deathnote_inuyashiki',
    stageId: 9006,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Shiganshina rooftop above a Death Note investigation command post invaded by Inuyashiki machinery',
    referenceUrls: ['https://shingeki.tv/final/', 'https://www.viz.com/death-note', 'https://www.inuyashiki-project.com/'],
    universes: ['Attack on Titan', 'Death Note', 'Inuyashiki']
  },
  {
    key: 'resident_evil_raccoon_lockdown',
    stageId: 40008,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'RPD main hall opening onto quarantined Raccoon streets',
    referenceUrls: ['https://game.capcom.com/residentevil/'],
    universes: ['Resident Evil']
  },
  {
    key: 'half_life_resonance_cascade',
    stageId: 40009,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Black Mesa test chamber aftermath',
    referenceUrls: ['https://store.steampowered.com/app/70/HalfLife/'],
    universes: ['Half-Life']
  },
  {
    key: 'stargate_sgc_first_contact',
    stageId: 40010,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'SGC embarkation room and Abydos gate platform',
    referenceUrls: ['https://www.mgm.com/television/stargate-sg-1'],
    universes: ['Stargate']
  },
  {
    key: 'silent_hill_otherworld_trial',
    stageId: 40011,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Otherworld hospital and industrial corridor',
    referenceUrls: ['https://www.konami.com/games/silenthill/'],
    universes: ['Silent Hill']
  },
  {
    key: 'dino_crisis_third_energy_incident',
    stageId: 40012,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Ibis Island Third Energy reactor room',
    referenceUrls: ['https://www.capcom-games.com/product/en-us/dinocrisis/'],
    universes: ['Dino Crisis']
  },
  {
    key: 'buckethead_bucketheadland_labyrinth',
    stageId: 40014,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Bucketheadland surreal theme-park guitar labyrinth',
    referenceUrls: ['https://www.bucketheadpikes.com/'],
    universes: ['Buckethead']
  },
  {
    key: 'soad_toxicity_protest_stage',
    stageId: 40015,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Toxicity aerial-city performance room',
    referenceUrls: ['https://www.systemofadown.com/music'],
    universes: ['System of a Down']
  },
  {
    key: 'kaamelott_grail_council',
    stageId: 40016,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Cour de Kaamelott et postes du conseil',
    referenceUrls: ['https://www.m6.fr/kaamelott-p_888'],
    universes: ['Kaamelott']
  },
  {
    key: 'stargate_chain',
    stageId: 40017,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Four-gate network junction with SGC, Atlantis, Destiny and animated Infinity sectors',
    referenceUrls: ['https://www.mgm.com/television/stargate-sg-1', 'https://www.gateworld.net/atlantis/', 'https://www.gateworld.net/universe/'],
    universes: ['Stargate', 'Stargate Atlantis', 'Stargate Universe', 'Stargate Infinity']
  },
  {
    key: 'lab_disasters',
    stageId: 40018,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Black Mesa, Aperture, Umbrella, Ibis and Ishimura rupture laboratory',
    referenceUrls: ['https://store.steampowered.com/app/70/HalfLife/', 'https://store.steampowered.com/app/620/Portal_2/', 'https://game.capcom.com/residentevil/'],
    universes: ['Half-Life', 'Portal', 'Resident Evil', 'Dino Crisis', 'Dead Space']
  },
  {
    key: 'watcher_hellmouth',
    stageId: 40019,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Sunnydale Hellmouth tactical seal linked to Halliwell Manor, Leviathan and Pentagram City',
    referenceUrls: ['https://en.wikipedia.org/wiki/Buffy_the_Vampire_Slayer', 'https://www.cwtv.com/shows/charmed/', 'https://press.hulu.com/shows/hellraiser/', 'https://www.aboutamazon.com/news/entertainment/hazbin-hotel-prime-video'],
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser', 'Hazbin Hotel']
  },
  {
    key: 'anime_judgment_cell',
    stageId: 40020,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Shiganshina command infirmary visualized as a living-body defense map with an investigation desk',
    referenceUrls: ['https://shingeki.tv/final/', 'https://www.viz.com/death-note', 'https://hataraku-saibou.com/', 'https://www.inuyashiki-project.com/'],
    universes: ['Attack on Titan', 'Death Note', 'Cells at Work!', 'Inuyashiki']
  },
  {
    key: 'atrium_first_cell',
    stageId: 41001,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'A.R.C.A. Atrium training grid stabilized by Black Mesa and UNSC modules',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence', 'Half-Life', 'Halo']
  },
  {
    key: 'survivors_last_door',
    stageId: 41002,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Nostromo emergency door between an RPD safe room and Aperture exit chamber',
    referenceUrls: ['https://www.20thcenturystudios.com/movies/alien', 'https://game.capcom.com/residentevil/', 'https://store.steampowered.com/app/620/Portal_2/'],
    universes: ['Alien', 'Resident Evil', 'Portal']
  },
  {
    key: 'occult_wrong_prophecy',
    stageId: 41003,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Yautja trophy court swallowed by Silent Hill Otherworld and Leviathan chains',
    referenceUrls: ['https://www.20thcenturystudios.com/movies/predator', 'https://www.konami.com/games/silenthill/', 'https://press.hulu.com/shows/hellraiser/'],
    universes: ['Predator', 'Silent Hill', 'Hellraiser']
  },
  {
    key: 'control_formula_matrix',
    stageId: 41004,
    priority: 'P0',
    auditStatus: 'FALLBACK',
    canonicalName: 'Matrix Source control room intersected by an SGC embarkation ramp and Shadow Moses command deck',
    referenceUrls: ['https://www.warnerbros.com/movies/matrix', 'https://www.mgm.com/television/stargate-sg-1', 'https://www.konami.com/mg/'],
    universes: ['The Matrix', 'Stargate', 'Metal Gear']
  },
  {
    key: 'stage:90000',
    stageId: 90000,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Central Atrium first anchor-calibration floor',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8801',
    stageId: 8801,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Central Atrium name-beacon lock',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8802',
    stageId: 8802,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Static Archives inner ring and contradiction nodes',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8803',
    stageId: 8803,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Origin Shard Foundry and divergent-life matrices',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8804',
    stageId: 8804,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Restricted Black Ledger accounting core',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8805',
    stageId: 8805,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Broken Portal Yard with one causal gate',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  },
  {
    key: 'stage:8806',
    stageId: 8806,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'White Threshold beyond Mosaic City',
    referenceUrls: ['https://github.com/darknigthmare/multiverse-breach/blob/master/src/game/ocCampaign.js'],
    universes: ['Nexus de Convergence']
  }
];

const makeUniverseProfiles = () => {
  const profiles = {};
  const usedSlugs = new Set();

  const definitions = [...UNIVERSE_PROFILE_DEFINITIONS, ...FULL_COVERAGE_PROFILE_DEFINITIONS];
  for (const [universe, priority, auditStatus, canonicalName, referenceUrls, visualAnchor = canonicalName] of definitions) {
    const slug = slugify(universe);
    if (!slug || profiles[universe] || usedSlugs.has(slug)) {
      throw new Error(`Duplicate or invalid stage lore universe profile: ${universe}`);
    }
    usedSlugs.add(slug);
    profiles[universe] = buildProfile({
      key: universe,
      slug,
      universeLabel: universe,
      canonicalName,
      referenceUrls,
      visualAnchor,
      priority,
      auditStatus
    });
  }

  return Object.freeze(profiles);
};

const makeArcProfiles = () => {
  const profiles = {};
  const usedSlugs = new Set();

  for (const definition of STAGE_ARC_PROFILE_DEFINITIONS) {
    const slug = `arc-${slugify(definition.key)}`;
    if (!slug || profiles[definition.key] || usedSlugs.has(slug)) {
      throw new Error(`Duplicate or invalid stage lore arc profile: ${definition.key}`);
    }
    usedSlugs.add(slug);
    profiles[definition.key] = buildProfile({
      ...definition,
      slug,
      universeLabel: definition.universes.join(' x ')
    });
  }

  return Object.freeze(profiles);
};

export const STAGE_LORE_PROFILES = makeUniverseProfiles();
export const STAGE_ARC_LORE_PROFILES = makeArcProfiles();

const STAGE_ARC_PROFILE_BY_ID = Object.freeze(Object.fromEntries(
  Object.values(STAGE_ARC_LORE_PROFILES).map(profile => [String(profile.stageId), profile])
));

export function getStageLoreProfile(stageOrKey) {
  if (typeof stageOrKey === 'number') {
    return STAGE_ARC_PROFILE_BY_ID[String(stageOrKey)] || null;
  }

  if (typeof stageOrKey === 'string') {
    return STAGE_ARC_LORE_PROFILES[stageOrKey]
      || STAGE_LORE_PROFILES[stageOrKey]
      || STAGE_ARC_PROFILE_BY_ID[stageOrKey]
      || null;
  }

  if (!stageOrKey || typeof stageOrKey !== 'object') return null;

  const stableKey = stageOrKey.arcId || stageOrKey.stableKey || stageOrKey.key;
  if (stableKey && STAGE_ARC_LORE_PROFILES[stableKey]) {
    return STAGE_ARC_LORE_PROFILES[stableKey];
  }

  const stageId = stageOrKey.stageId ?? stageOrKey.id;
  if (stageId !== undefined && STAGE_ARC_PROFILE_BY_ID[String(stageId)]) {
    return STAGE_ARC_PROFILE_BY_ID[String(stageId)];
  }

  return STAGE_LORE_PROFILES[stageOrKey.universe] || null;
}

export function getStageLoreAssetPlan(stageOrKey, mode) {
  const profile = getStageLoreProfile(stageOrKey);
  const requestedMode = mode || (stageOrKey && typeof stageOrKey === 'object' ? stageOrKey.mode : null);
  const normalizedMode = MODE_ALIASES[requestedMode];
  if (!profile || !normalizedMode) return null;

  return Object.freeze({
    profileKey: profile.key,
    canonicalName: profile.canonicalName,
    referenceUrls: profile.referenceUrls,
    visualAnchor: profile.visualAnchor,
    priority: profile.priority,
    auditStatus: profile.auditStatus,
    generationBlocked: profile.generationBlocked,
    mode: normalizedMode,
    ...profile.modes[normalizedMode]
  });
}
