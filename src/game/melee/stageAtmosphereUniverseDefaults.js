import { STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS_PART_A } from './stageAtmosphereUniverseDefaultsPartA.js';

// Explicit editorial choices for the 255 formerly unconfigured roster universes.
// Each default names one reference scene. It is consulted only when the caller
// provides no concrete scene, and remains an adaptation rather than a claim of
// source-shot or animation fidelity. No faction/name hash selects these values.
const STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS_PART_B = [
  {
    "universe": "Unreal Tournament",
    "sourceWork": "Unreal Tournament (1999) PC ladder; Damien, Rampage and Dominator are explicitly sourced from the PS2/Dreamcast Final Challenge only",
    "sourceReference": "https://unrealarchive.org/wikis/the-liandri-archives/UT_Single_Player.html",
    "location": "Deck16][ — passerelles et cuves Liandri",
    "motif": "Reflets bleu-rouge des voyants sur les passerelles industrielles de Deck16][",
    "effect": "lab-monitors",
    "color": "#55b8e8",
    "placement": {
      "x": 0.53,
      "y": 0.31,
      "spread": 0.78
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Sanctum",
    "sourceWork": "Sanctum 2 base campaign, with Road to Elysion explicitly labelled for Fiskeplaske",
    "sourceReference": "https://coffeestain.com/game/sanctum-2/",
    "location": "The Facility — approche de The Gate",
    "motif": "Circulation turquoise dans le Core à oxygène derrière les murs de défense",
    "effect": "network-traces",
    "color": "#59dfdf",
    "placement": {
      "x": 0.73,
      "y": 0.28,
      "spread": 0.56
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Goat Simulator",
    "sourceWork": "Goat Simulator franchise anthology, with every GoatZ, MMO, Waste of Space and Goat Simulator 3 element labelled by source",
    "sourceReference": "https://coffeestain.com/game/goat-simulator/",
    "location": "San Angora — quartier de la Goat Tower",
    "motif": "Feuilles sèches qui traversent la cour ensoleillée de la tour des chèvres",
    "effect": "foliage",
    "color": "#a9bf61",
    "placement": {
      "x": 0.34,
      "y": 0.35,
      "spread": 0.72
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Quake",
    "sourceWork": "labelled franchise anthology: Quake (1996), Quake II (1997) and Quake 4 (2005); no claim that all three campaigns share one uninterrupted plot",
    "sourceReference": "https://bethesda.net/game/quake",
    "location": "Slipgate Complex — couloir des bassins de lave",
    "motif": "Petites braises orange au-dessus de la lave derrière les dalles brunes du complexe",
    "effect": "embers",
    "color": "#dc8449",
    "placement": {
      "x": 0.69,
      "y": 0.37,
      "spread": 0.54
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Like a Dragon",
    "sourceWork": "mainline Yakuza / Like a Dragon franchise anthology from Kazuma Kiryu’s saga through Ichiban Kasuga’s saga; each antagonist retains the game in which their rivalry matters",
    "sourceReference": "https://rggstudio.sega.com/games/",
    "location": "Kamurocho — toit de la Millennium Tower",
    "motif": "Néons rouges de la vie nocturne de Kamurocho au loin sous le toit",
    "effect": "city-lights",
    "color": "#ed597c",
    "placement": {
      "x": 0.52,
      "y": 0.28,
      "spread": 0.86
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Italian Brainrot",
    "sourceWork": "decentralized 2025 internet meme trend; no official owner, fixed plot, alignment chart or authoritative power hierarchy",
    "sourceReference": "https://apnews.com/article/7600d1faea12be53609f3c2092e02eb7",
    "location": "Piazza del Remix — scène originale de remix du projet",
    "motif": "Poussière claire au pied des accessoires hybrides de la place de remix, adaptation originale déclarée",
    "effect": "dust",
    "color": "#ddc796",
    "placement": {
      "x": 0.36,
      "y": 0.34,
      "spread": 0.67
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Prey (2006)",
    "sourceWork": "Human Head Studios and 3D Realms Prey released in 2006 only; Arkane’s 2017 game is explicitly excluded",
    "sourceReference": "https://nxeassets.xbox.com/shaxam/0201/21/3a/213a78dd-eeef-42f8-979a-c8a2158160da.PDF?v=1",
    "location": "The Sphere — chambre des passerelles gravitationnelles",
    "motif": "Tracés bleus des rails de gravité sur les parois biomécaniques de la Sphere",
    "effect": "network-traces",
    "color": "#73bde7",
    "placement": {
      "x": 0.76,
      "y": 0.26,
      "spread": 0.57
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Beyond Good & Evil",
    "sourceWork": "Beyond Good & Evil (2003) story as preserved by the 20th Anniversary Edition; Beyond Good & Evil 2 prequel material is excluded from the core roster",
    "sourceReference": "https://www.ubisoft.com/en-us/game/beyond-good-and-evil/20th-anniversary-edition",
    "location": "Hillys — anciens abattoirs au bord des canaux",
    "motif": "Reflets turquoise des canaux sous les plateformes d’infiltration des abattoirs",
    "effect": "water-ripples",
    "color": "#63b8bd",
    "placement": {
      "x": 0.44,
      "y": 0.42,
      "spread": 0.82
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Metal: Hellsinger",
    "sourceWork": "Metal: Hellsinger base-game story; Dream of the Beast weapons may be references but do not create additional lore protagonists",
    "sourceReference": "https://www.metalhellsinger.com/",
    "location": "Sheol — arène du Red Judge",
    "motif": "Braises rouges le long des reliefs de basalte derrière l’arène de Sheol",
    "effect": "embers",
    "color": "#e57849",
    "placement": {
      "x": 0.62,
      "y": 0.39,
      "spread": 0.68
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Dead by Daylight",
    "sourceWork": "Dead by Daylight original Behaviour Interactive roster only; licensed crossover Survivors, Killers and maps are excluded",
    "sourceReference": "https://deadbydaylight.com/news/dbd-celebrates-10-years-in-the-fog/",
    "location": "MacMillan Estate — Coal Tower",
    "motif": "Brume bleutée entre la tour à charbon et les fragments industriels du Realm",
    "effect": "cold-haze",
    "color": "#96aabd",
    "placement": {
      "x": 0.51,
      "y": 0.37,
      "spread": 0.88
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Dante's Inferno",
    "sourceWork": "Dante’s Inferno (2010) video game and its published manual, not the poem treated as a separate continuity",
    "sourceReference": "https://news.ea.com/press-releases/press-releases-details/2010/EA-Welcomes-Players-to-Hell-with-the-Release-of-Dantes-Inferno/default.aspx",
    "location": "Portes de l’Enfer — descente de Charon",
    "motif": "Fines braises ambrées dans les falaises et les chaînes de la descente",
    "effect": "embers",
    "color": "#d99453",
    "placement": {
      "x": 0.28,
      "y": 0.38,
      "spread": 0.62
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Shadow Man",
    "sourceWork": "Shadow Man (1999) as restored by Nightdive’s Remastered edition; 2econd Coming is excluded from the core story pack",
    "sourceReference": "https://store.steampowered.com/app/1413870/Shadow_Man_Remastered/",
    "location": "Deadside — cathédrale de l’Asile",
    "motif": "Brume violette derrière les arches de fer et les portes d’os du Deadside",
    "effect": "cold-haze",
    "color": "#8d729f",
    "placement": {
      "x": 0.71,
      "y": 0.35,
      "spread": 0.64
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Croc: Legend of the Gobbos",
    "sourceWork": "Croc: Legend of the Gobbos (1997) as preserved by Argonaut Games’ remaster; Croc 2 material is excluded from the core roster",
    "sourceReference": "https://store.steampowered.com/app/3043940/Croc_Legend_of_the_Gobbos/",
    "location": "Forest Island — chemin de sauvetage des Gobbos",
    "motif": "Petites feuilles vert clair dans la végétation de Forest Island",
    "effect": "foliage",
    "color": "#a4cb72",
    "placement": {
      "x": 0.43,
      "y": 0.3,
      "spread": 0.76
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Gex",
    "sourceWork": "Crystal Dynamics Gex trilogy as preserved in the official Gex Trilogy collection",
    "sourceReference": "https://gextrilogy.com/",
    "location": "Media Dimension — hub des téléviseurs cathodiques",
    "motif": "Lueur verte des téléviseurs à tube et balayage discret des connexions du hub",
    "effect": "network-traces",
    "color": "#a5d56a",
    "placement": {
      "x": 0.68,
      "y": 0.25,
      "spread": 0.59
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "NieR",
    "sourceWork": "NieR:Automata game continuity, with no anime-only substitutions; franchise title retained as the requested portal name",
    "sourceReference": "https://www.jp.square-enix.com/nierautomata/",
    "location": "Ruines de la ville — camp de la Résistance",
    "motif": "Pollen pâle de la végétation ayant recouvert le béton du camp",
    "effect": "spores",
    "color": "#c0bea5",
    "placement": {
      "x": 0.35,
      "y": 0.34,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Discipline: The Record of a Crusade",
    "sourceWork": "2002 Active Software game, reduced to public metadata, named cast and Saint Arcadia institutional setting",
    "sourceReference": "https://www.mobygames.com/game/106070/discipline-the-record-of-a-crusade/",
    "location": "Saint Arcadia — archives administratives",
    "motif": "Poussière claire dans les rayons des registres administratifs fermés, sans personnages",
    "effect": "dust",
    "color": "#c2b39a",
    "placement": {
      "x": 0.23,
      "y": 0.29,
      "spread": 0.51
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Bible Black",
    "sourceWork": "2000 Active Software game’s school, black-magic book, twelve-year mystery and named cast only",
    "sourceReference": "https://www.mobygames.com/game/27648/bible-black-the-game/",
    "location": "École — sous-sol fermé des archives occultes",
    "motif": "Lueur ambrée des lampes de poche sur les archives et les marques de craie, sans représentation de rituel",
    "effect": "candlelight",
    "color": "#baa05d",
    "placement": {
      "x": 0.75,
      "y": 0.32,
      "spread": 0.44
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Hotline Miami",
    "sourceWork": "Hotline Miami and Hotline Miami 2: Wrong Number game continuity",
    "sourceReference": "https://www.hotlinemiami.com/",
    "location": "Miami 1989 — immeuble aux tapis néon",
    "motif": "Lumière cyan des enseignes qui traverse les fenêtres de l’immeuble",
    "effect": "neon-signals",
    "color": "#55d8d2",
    "placement": {
      "x": 0.58,
      "y": 0.28,
      "spread": 0.8
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Warhammer 40,000: Space Marine",
    "sourceWork": "Warhammer 40,000: Space Marine (2011) game and Games Workshop’s official Graia recap",
    "sourceReference": "https://www.warhammer-community.com/en-gb/articles/wr3d2srg/who-is-lieutenant-titus-the-long-and-glorious-history-of-the-space-marine-2-hero/",
    "location": "Graia — Manufactorum Ajakis",
    "motif": "Étincelles de chaleur derrière les grandes machines de forge du manufactorum",
    "effect": "embers",
    "color": "#c6a05e",
    "placement": {
      "x": 0.79,
      "y": 0.35,
      "spread": 0.53
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Back to the Future",
    "sourceWork": "Robert Zemeckis and Bob Gale film trilogy",
    "sourceReference": "https://www.backtothefuture.com/movies/backtothefuture1",
    "location": "Hill Valley 1955 — place de la tour de l’horloge",
    "motif": "Cadran de la tour de l’horloge dans le fond de la place, mouvement lent décoratif",
    "effect": "clock-dials",
    "color": "#d5b174",
    "placement": {
      "x": 0.72,
      "y": 0.23,
      "spread": 0.43
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Walking Dead — Telltale",
    "sourceWork": "The Walking Dead: The Telltale Definitive Series, with each character and antagonist labelled by season",
    "sourceReference": "https://help.skybound.com/support/solutions/folders/30000056389",
    "location": "Savannah — rues abandonnées",
    "motif": "Feuilles fanées le long des rues vides de Savannah rendues dans une palette Graphic Black",
    "effect": "foliage",
    "color": "#a29a73",
    "placement": {
      "x": 0.42,
      "y": 0.35,
      "spread": 0.74
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Horizon Zero Dawn",
    "sourceWork": "Guerrilla’s Horizon Zero Dawn main game finale, with no Forbidden West plot substitutions",
    "sourceReference": "https://www.playstation.com/en-us/editorial/horizon-zero-dawn-the-story-so-far/",
    "location": "Meridian — pied de la Flèche",
    "motif": "Pollen ocre des plantes du relief autour de Meridian et de la Flèche",
    "effect": "spores",
    "color": "#c7ab70",
    "placement": {
      "x": 0.39,
      "y": 0.33,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Soldier of Fortune",
    "sourceWork": "Soldier of Fortune (2000) / Platinum Edition only",
    "sourceReference": "https://www.gog.com/en/game/soldier_of_fortune_platinum_edition",
    "location": "New York — tunnels du métro",
    "motif": "Voyants orange peu intenses dans les équipements du tunnel de transit",
    "effect": "lab-monitors",
    "color": "#b59a62",
    "placement": {
      "x": 0.82,
      "y": 0.31,
      "spread": 0.39
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Extreme Ghostbusters",
    "sourceWork": "Extreme Ghostbusters 1997 animated series",
    "sourceReference": "https://www.sonypictures.com/tv/extremeghostbustersthecompleteseries",
    "location": "Firehouse 23 — unité de confinement",
    "motif": "Lignes vertes des instruments de confinement reconstruits dans la caserne",
    "effect": "network-traces",
    "color": "#8ec76b",
    "placement": {
      "x": 0.25,
      "y": 0.27,
      "spread": 0.52
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Heart of Darkness",
    "sourceWork": "Amazing Studio / Interplay Heart of Darkness (1998)",
    "sourceReference": "https://www.thealmightyguru.com/Wiki/images/6/63/Heart_of_Darkness_-_PS1_-_USA_-_Manual.pdf",
    "location": "Darklands — village des Amigos pendant l’éclipse",
    "motif": "Spores bleutées dans la jungle extraterrestre sous le ciel d’éclipse",
    "effect": "spores",
    "color": "#8798cc",
    "placement": {
      "x": 0.64,
      "y": 0.3,
      "spread": 0.72
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Rival Schools",
    "sourceWork": "Rival Schools: United by Fate and Project Justice game continuity",
    "sourceReference": "https://game.capcom.com/cfn/sfv/column-130231?lang=en",
    "location": "Taiyo High — cour du tournoi",
    "motif": "Feuilles jaunes légères sur le côté de la cour de Taiyo High",
    "effect": "foliage",
    "color": "#d2b75e",
    "placement": {
      "x": 0.27,
      "y": 0.35,
      "spread": 0.61
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "MediEvil",
    "sourceWork": "MediEvil (1998/2019 remake) with Kiya tagged from MediEvil 2 and Al-Zalam from Resurrection",
    "sourceReference": "https://www.playstation.com/en-gb/games/medievil/",
    "location": "Gallowmere — cimetière",
    "motif": "Brume verte sous la lune entre les pierres gothiques inclinées du cimetière",
    "effect": "cold-haze",
    "color": "#8eac8d",
    "placement": {
      "x": 0.5,
      "y": 0.36,
      "spread": 0.84
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Jersey Devil",
    "sourceWork": "Behaviour Interactive / Megatoon Jersey Devil (PlayStation and PC)",
    "sourceReference": "https://www.videogamemanual.com/ps1/Jersey%20Devil%20%28USA%29.pdf",
    "location": "Jersey City — musée nocturne",
    "motif": "Lueur orange de la décoration de citrouilles dans les salles du musée",
    "effect": "candlelight",
    "color": "#d58f45",
    "placement": {
      "x": 0.21,
      "y": 0.32,
      "spread": 0.48
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Goemon's Great Adventure",
    "sourceWork": "Goemon's Great Adventure / Ganbare Goemon: Dero Dero Dōchū (Nintendo 64)",
    "sourceReference": "https://world-of-nintendo.com/manuals/nintendo_64/goemon_great_adventure.shtml",
    "location": "Route d’Edo — quartier des lanternes au crépuscule",
    "motif": "Lueurs dorées lentes des lanternes de la route d’Edo",
    "effect": "candlelight",
    "color": "#d5b463",
    "placement": {
      "x": 0.68,
      "y": 0.28,
      "spread": 0.63
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "MDK",
    "sourceWork": "MDK 2, continuing directly after MDK; first-game facts tagged as prologue",
    "sourceReference": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/38460/manuals/Manual%20-%20English.pdf",
    "location": "Jim Dandy — fenêtre sur les mégastructures extraterrestres",
    "motif": "Glissements lumineux bleu argent à l’extérieur de la station Jim Dandy",
    "effect": "starfield",
    "color": "#9cbfd3",
    "placement": {
      "x": 0.43,
      "y": 0.2,
      "spread": 0.81
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Tail Concerto",
    "sourceWork": "Tail Concerto (PlayStation) only",
    "sourceReference": "https://www.mobygames.com/game/8483/tail-concerto/",
    "location": "Prairie — îles flottantes de Resaca",
    "motif": "Pollen doré au-dessus de la végétation des îles suspendues de Resaca",
    "effect": "spores",
    "color": "#d6cc87",
    "placement": {
      "x": 0.55,
      "y": 0.29,
      "spread": 0.78
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Redneck Rampage",
    "sourceWork": "Redneck Rampage (1997), with collection references kept separate from Rides Again",
    "sourceReference": "https://steamcdn-a.akamaihd.net/steam/apps/565550/manuals/Redneck_Rampage.pdf",
    "location": "Hickston — cour de la ferme",
    "motif": "Poussière ocre près de la grange et des clôtures de la ferme de Hickston",
    "effect": "desert-drift",
    "color": "#bca273",
    "placement": {
      "x": 0.28,
      "y": 0.39,
      "spread": 0.67
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Hexen",
    "sourceWork": "Hexen: Beyond Heretic (1995) game and official manual",
    "sourceReference": "https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/manual/Formated/Hexen-_Beyond_Heretic_-_1997_-_GT_Interactive_Software.pdf",
    "location": "Cronos — hub des Seven Portals",
    "motif": "Lueur verte douce entre les pierres moussues et les mécanismes des Seven Portals",
    "effect": "candlelight",
    "color": "#8cb278",
    "placement": {
      "x": 0.76,
      "y": 0.29,
      "spread": 0.52
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Duke Nukem",
    "sourceWork": "Duke Nukem 3D: Atomic Edition core threats; Captain Dylan and EDF ally explicitly tagged from Duke Nukem Forever",
    "sourceReference": "https://www.gamesdatabase.org/Media/SYSTEM/Microsoft_DOS/manual/Formated/Duke_Nukem_3D.pdf",
    "location": "Los Angeles — Hollywood Holocaust",
    "motif": "Petits reflets EDF rouges dans les enseignes du quartier de cinéma en ruine",
    "effect": "city-lights",
    "color": "#d87566",
    "placement": {
      "x": 0.55,
      "y": 0.28,
      "spread": 0.85
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Marathon",
    "sourceWork": "Bungie’s classic Marathon trilogy (Marathon, Marathon 2: Durandal, Marathon Infinity), not the 2026 extraction game",
    "sourceReference": "https://marathon.bungie.org/story/_files/Marathon_Manual.pdf",
    "location": "UESC Marathon — coursives aux terminaux",
    "motif": "Balayage vert lent des terminaux UESC dans les coursives du vaisseau",
    "effect": "matrix-code",
    "color": "#71c3a0",
    "placement": {
      "x": 0.72,
      "y": 0.24,
      "spread": 0.57
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Crypt of the NecroDancer",
    "sourceWork": "Crypt of the NecroDancer base campaign and AMPLIFIED family storyline.",
    "sourceReference": "https://braceyourselfgames.com/crypt-of-the-necrodancer/",
    "location": "Zone 1 — chambres de la crypte",
    "motif": "Lueurs bleu-or des pierres de la crypte suivant une cadence douce sans effet de gameplay",
    "effect": "concert-lights",
    "color": "#9db5dd",
    "placement": {
      "x": 0.48,
      "y": 0.28,
      "spread": 0.74
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Subverse — Safe Galactic Rebellion",
    "sourceWork": "Subverse Prodigium rebellion, recast as a nonsexual adult science-fiction resistance campaign.",
    "sourceReference": "https://store.steampowered.com/app/1034140/Subverse/",
    "location": "Mary Celeste — pont d’embarquement, adaptation spatiale sûre du projet",
    "motif": "Étoiles lointaines derrière les baies du Mary Celeste, aucune scène de la version adulte",
    "effect": "starfield",
    "color": "#9caed3",
    "placement": {
      "x": 0.68,
      "y": 0.21,
      "spread": 0.59
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "No Man's Sky",
    "sourceWork": "Atlas, Artemis and Sentinel storylines across the current No Man’s Sky universe.",
    "sourceReference": "https://www.nomanssky.com/atlas-rises-update/",
    "location": "Planète paradisiaque — parcours de relevé du Voyageur",
    "motif": "Aurore turquoise discrète au-dessus du panorama de relevé de la planète",
    "effect": "aurora",
    "color": "#84cabb",
    "placement": {
      "x": 0.49,
      "y": 0.21,
      "spread": 0.88
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Natural Selection 2",
    "sourceWork": "Unknown Worlds’ Frontiersmen versus Kharaa strategic multiplayer conflict.",
    "sourceReference": "https://www.krafton.com/en/games/natural-selection-2/",
    "location": "Tram — départ des Marines",
    "motif": "Voyants bleus des équipements marines dans le secteur industriel Tram",
    "effect": "lab-monitors",
    "color": "#74a7d0",
    "placement": {
      "x": 0.81,
      "y": 0.29,
      "spread": 0.42
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Nemesis — Awaken Realms",
    "sourceWork": "Awaken Realms Nemesis base game aboard the infested ship, with only official core-box roles and Intruder ecology.",
    "sourceReference": "https://awakenrealms.com/games/awaken-realms/nemesis",
    "location": "Nemesis — Hibernatorium",
    "motif": "Vapeur froide des unités d’hibernation dans les coursives du vaisseau défaillant",
    "effect": "vent-steam",
    "color": "#a4afb9",
    "placement": {
      "x": 0.21,
      "y": 0.37,
      "spread": 0.49
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Unreal Tournament 2004",
    "sourceWork": "Epic Games Unreal Tournament 2004 Liandri Grand Tournament, distinct from Unreal Tournament 1999.",
    "sourceReference": "https://www.epicgames.com/unrealtournament/?lang=en-US",
    "location": "DM-Rankin — atelier du tournoi 2004",
    "motif": "Voyants bleus des machines de Rankin, distincts de Deck16][ du tournoi 1999",
    "effect": "lab-monitors",
    "color": "#8db3d0",
    "placement": {
      "x": 0.66,
      "y": 0.32,
      "spread": 0.61
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Angels Fall First",
    "sourceWork": "Strangely Interactive’s ULA-versus-AIA combined-arms war in Angels Fall First.",
    "sourceReference": "https://store.steampowered.com/app/367270/Angels_Fall_First/",
    "location": "Ground Incursion — approche du transport de débarquement",
    "motif": "Éclats de signaux bleu gris sur le transport et les structures d’approche",
    "effect": "network-traces",
    "color": "#93adbf",
    "placement": {
      "x": 0.74,
      "y": 0.26,
      "spread": 0.55
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Beat Banger — Safe Rhythm Studio",
    "sourceWork": "Beat Banger’s rhythm-studio cast reinterpreted exclusively as a safe professional music production workplace.",
    "sourceReference": "https://store.steampowered.com/app/1813430/Beat_Banger/",
    "location": "Cabine de percussion — studio professionnel sûr du projet",
    "motif": "Lueurs violet-ambre des vumètres du studio et des microphones, sans contenu adulte",
    "effect": "concert-lights",
    "color": "#c09bc9",
    "placement": {
      "x": 0.39,
      "y": 0.28,
      "spread": 0.65
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Doom Sweeper — Safe Apocalypse",
    "sourceWork": "Paper Dog’s Doom Sweeper zombie-survival journey, stripped of all sexual material.",
    "sourceReference": "https://store.steampowered.com/app/2162680/Doom_Sweeper/",
    "location": "Route en ruine — secteur de balayage, adaptation sûre du projet",
    "motif": "Poussière ocre légère autour du véhicule militaire usé sur la route du parcours",
    "effect": "desert-drift",
    "color": "#c9a97a",
    "placement": {
      "x": 0.32,
      "y": 0.4,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Stellar Dream — Safe Colony Mission",
    "sourceWork": "Stellar Dream Part 1 colony-ship, missing-scout and first-contact premise, adapted as a safe diplomatic science mission.",
    "sourceReference": "https://steamcommunity.com/app/3087180",
    "location": "Hope-1 — route scientifique de relevé, adaptation sûre du projet",
    "motif": "Étoiles bleues pâles au-delà des baies du vaisseau de colonisation Hope-1",
    "effect": "starfield",
    "color": "#a4cedb",
    "placement": {
      "x": 0.61,
      "y": 0.2,
      "spread": 0.67
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Absolver: Downfall",
    "sourceWork": "Sloclap’s Absolver base journey and free Downfall expansion in the Mines of Adal.",
    "sourceReference": "https://absolvergame.com/news/absolver-downfall",
    "location": "Adal — Guidance Bridge",
    "motif": "Poussière ocre et Gleam pâle près des pierres du pont de Guidance",
    "effect": "dust",
    "color": "#c0b995",
    "placement": {
      "x": 0.28,
      "y": 0.33,
      "spread": 0.59
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Agony",
    "sourceWork": "Madmind Studio’s 2018 infernal survival-horror continuity, represented through its censored horror and escape premise.",
    "sourceReference": "https://store.steampowered.com/app/487720/Agony/",
    "location": "Floating Forest — adaptation visuelle sans nudité ni gore",
    "motif": "Volutes rouge brun derrière les structures osseuses de la forêt flottante",
    "effect": "cold-haze",
    "color": "#a96d65",
    "placement": {
      "x": 0.61,
      "y": 0.37,
      "spread": 0.72
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Atomic Heart",
    "sourceWork": "Atomic Heart base-game Facility 3826 uprising and its Soviet retrofuturist robot ecology.",
    "sourceReference": "https://press.kochmedia.com/nl/Files/Download?Enc=0F6ABF6ED5D7EA961742E3B05B11299D&File=%2Fblob%2FPlaionGames%2F2023%2F03%2F031202-4bfd590f%2FEN-Factsheet.pdf&FileGuid=ceb5e118-6898-48fb-9e37-ba9e30f68a31&direct=False",
    "location": "Complexe 3826 — exposition VDNH",
    "motif": "Voyants crème-rouge des appareils de recherche de l’exposition rétrofuturiste",
    "effect": "lab-monitors",
    "color": "#d9bfa6",
    "placement": {
      "x": 0.73,
      "y": 0.27,
      "spread": 0.55
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Bendy and the Ink Machine",
    "sourceWork": "Joey Drew Studios’ Bendy and the Ink Machine five-chapter Cycle starring Henry Stein.",
    "sourceReference": "https://www.joeydrewstudios.com/batim",
    "location": "Joey Drew Studios — Old Workshop",
    "motif": "Lueurs sépia des vieux projecteurs dans l’atelier d’animation près des flaques d’encre",
    "effect": "concert-lights",
    "color": "#cdb17a",
    "placement": {
      "x": 0.23,
      "y": 0.27,
      "spread": 0.49
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Putt-Putt",
    "sourceWork": "Putt-Putt primary continuity",
    "sourceReference": "https://store.steampowered.com/app/294700/PuttPutt_Saves_the_Zoo/",
    "location": "Cartown — carrefour vers le zoo",
    "motif": "Feuilles vert tendre au bord de la route illustrée de Cartown",
    "effect": "foliage",
    "color": "#a7ce8c",
    "placement": {
      "x": 0.43,
      "y": 0.33,
      "spread": 0.77
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Borderlands 2",
    "sourceWork": "Borderlands 2 primary continuity",
    "sourceReference": "https://borderlands.2k.com/borderlands-2/",
    "location": "Southern Shelf — extérieur de Liar’s Berg",
    "motif": "Neige légère derrière les abris et les falaises glacées de Southern Shelf",
    "effect": "snow",
    "color": "#c4d4db",
    "placement": {
      "x": 0.5,
      "y": 0.29,
      "spread": 0.89
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "BRINK",
    "sourceWork": "BRINK primary continuity",
    "sourceReference": "https://bethesda.net/en/game/brink",
    "location": "The Ark — Container City",
    "motif": "Poussière salée portée entre les conteneurs superposés de l’Arche",
    "effect": "desert-drift",
    "color": "#b9ada0",
    "placement": {
      "x": 0.29,
      "y": 0.38,
      "spread": 0.68
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Brütal Legend",
    "sourceWork": "Brütal Legend primary continuity",
    "sourceReference": "https://www.doublefine.com/games/brutal-legend",
    "location": "Bladehenge — pierres en forme de lames",
    "motif": "Braises ambrées discrètes près du relief métallique de Bladehenge",
    "effect": "embers",
    "color": "#c99562",
    "placement": {
      "x": 0.76,
      "y": 0.39,
      "spread": 0.53
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Buckshot Roulette",
    "sourceWork": "Buckshot Roulette primary continuity",
    "sourceReference": "https://www.criticalreflex.com/buckshot_roulette",
    "location": "Club — salle de la table du Dealer",
    "motif": "Lueur verdâtre de l’éclairage industriel au-dessus de la table, sans simulation de décharge",
    "effect": "lab-monitors",
    "color": "#8ea397",
    "placement": {
      "x": 0.7,
      "y": 0.23,
      "spread": 0.47
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Choo-Choo Charles",
    "sourceWork": "Choo-Choo Charles primary continuity",
    "sourceReference": "https://www.twostargames.com/",
    "location": "Aranearum — voie ferrée de la boucle",
    "motif": "Vapeur gris clair derrière la locomotive sur la ligne minière de l’île",
    "effect": "vent-steam",
    "color": "#b0aaa0",
    "placement": {
      "x": 0.18,
      "y": 0.39,
      "spread": 0.46
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Crysis",
    "sourceWork": "Crysis primary continuity",
    "sourceReference": "https://www.crytek.com/games/crysis",
    "location": "Lingshan — bord de jungle près de la baie",
    "motif": "Feuilles de la jungle tropicale de Lingshan dans le plan éloigné",
    "effect": "foliage",
    "color": "#a9c791",
    "placement": {
      "x": 0.42,
      "y": 0.32,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Cuphead",
    "sourceWork": "Cuphead primary continuity",
    "sourceReference": "https://studiomdhr.com/what-kind-of-game-is-cuphead/",
    "location": "Inkwell Isle — berge près du chemin du casino",
    "motif": "Reflets bleu pastel du cours d’eau dessiné de l’île",
    "effect": "water-ripples",
    "color": "#9fc5c3",
    "placement": {
      "x": 0.56,
      "y": 0.43,
      "spread": 0.71
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Daikatana",
    "sourceWork": "Daikatana primary continuity",
    "sourceReference": "https://www.gog.com/en/game/daikatana",
    "location": "Japon 2455 — laboratoires de Mishima",
    "motif": "Voyants verts de l’appareillage des laboratoires futuristes",
    "effect": "lab-monitors",
    "color": "#95bd91",
    "placement": {
      "x": 0.79,
      "y": 0.29,
      "spread": 0.41
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Dark Souls",
    "sourceWork": "Dark Souls primary continuity",
    "sourceReference": "https://en.bandainamcoent.eu/dark-souls/dark-souls",
    "location": "Lordran — Undead Burg",
    "motif": "Braises orange pâle près des foyers dans les remparts du Bourg des Morts-vivants",
    "effect": "embers",
    "color": "#c29b70",
    "placement": {
      "x": 0.27,
      "y": 0.37,
      "spread": 0.57
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Dead Rising",
    "sourceWork": "Dead Rising primary continuity",
    "sourceReference": "https://www.capcom.co.jp/ir/english/news/pdf/e101028d.pdf",
    "location": "Willamette — galerie commerciale",
    "motif": "Éclairage pâle des vitrines de la galerie du centre commercial",
    "effect": "city-lights",
    "color": "#bfc4b2",
    "placement": {
      "x": 0.53,
      "y": 0.27,
      "spread": 0.82
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Deponia",
    "sourceWork": "Deponia primary continuity",
    "sourceReference": "https://www.daedalic.com/deponia",
    "location": "KuVaq — butte de déchets",
    "motif": "Vapeur brune claire des conduits derrière les amas de ferraille de KuVaq",
    "effect": "vent-steam",
    "color": "#b49b77",
    "placement": {
      "x": 0.78,
      "y": 0.38,
      "spread": 0.48
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Deus Ex",
    "sourceWork": "Deus Ex primary continuity",
    "sourceReference": "https://blog.jp.square-enix.com/deusex/2017/03/23/character.html",
    "location": "Detroit — quartier de Sarif Industries",
    "motif": "Reflets or des interfaces et enseignes du quartier de Sarif dans Human Revolution",
    "effect": "network-traces",
    "color": "#bfad73",
    "placement": {
      "x": 0.67,
      "y": 0.25,
      "spread": 0.62
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Devil May Cry",
    "sourceWork": "Devil May Cry primary continuity",
    "sourceReference": "https://www.capcom.co.jp/ir/english/data/oar/2018/develop/dmc.html",
    "location": "Mallet Island — cour du château",
    "motif": "Lueurs rouges douces aux fenêtres du château gothique de Mallet Island",
    "effect": "candlelight",
    "color": "#b78a86",
    "placement": {
      "x": 0.24,
      "y": 0.29,
      "spread": 0.5
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Backrooms — Kane Pixels",
    "sourceWork": "The Backrooms — Kane Pixels primary continuity",
    "sourceReference": "https://www.youtube.com/watch?v=H4dGpz6cnHo",
    "location": "Complexe — Yellow Halls",
    "motif": "Éclairage fluorescent jaune pâle dans les halls vides du Complexe",
    "effect": "lab-monitors",
    "color": "#c3bf87",
    "placement": {
      "x": 0.49,
      "y": 0.23,
      "spread": 0.86
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Evolve",
    "sourceWork": "Evolve primary continuity",
    "sourceReference": "https://www.2k.com/games/evolve/",
    "location": "Shear — Distillery",
    "motif": "Vapeur grise près des conduits de la distillerie de Shear",
    "effect": "vent-steam",
    "color": "#b1b9aa",
    "placement": {
      "x": 0.75,
      "y": 0.37,
      "spread": 0.52
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "E.Y.E: Divine Cybermancy",
    "sourceWork": "E.Y.E: Divine Cybermancy primary continuity",
    "sourceReference": "https://eye.streumon-studio.com/press/press_kit.pdf",
    "location": "Secreta Secretorum — Temple HQ",
    "motif": "Lueur verte des interfaces cybernétiques dans le quartier général du temple",
    "effect": "network-traces",
    "color": "#9dae8c",
    "placement": {
      "x": 0.25,
      "y": 0.26,
      "spread": 0.54
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "F.E.A.R.",
    "sourceWork": "F.E.A.R. (2005), the original Monolith continuity",
    "sourceReference": "https://store.steampowered.com/app/21090/FEAR/",
    "location": "Armacham Technology Corporation — couloir de service",
    "motif": "Voyants orange des équipements Armacham dans le béton froid des couloirs",
    "effect": "lab-monitors",
    "color": "#c2a07c",
    "placement": {
      "x": 0.8,
      "y": 0.29,
      "spread": 0.39
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Finding Frankie",
    "sourceWork": "Finding Frankie (2024) parkour-horror game",
    "sourceReference": "https://store.steampowered.com/app/2597970/Finding_Frankie/",
    "location": "Frankie’s Parkour Palace — zone des modules rembourrés",
    "motif": "Projecteurs bleu-rouge doux de l’arène de jeu télévisé abandonnée",
    "effect": "concert-lights",
    "color": "#a7a1cd",
    "placement": {
      "x": 0.51,
      "y": 0.24,
      "spread": 0.76
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Freddi Fish",
    "sourceWork": "Humongous Entertainment Freddi Fish adventure series",
    "sourceReference": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/283940/manuals/freddifish1-manual.pdf?t=1578016205",
    "location": "Crique de Grandma Grouper — chemin des graines de varech",
    "motif": "Courants bleus et bulles stylisées entre les coraux de la crique sous-marine",
    "effect": "spores",
    "color": "#b7d6cf",
    "placement": {
      "x": 0.43,
      "y": 0.32,
      "spread": 0.83
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "GTFO",
    "sourceWork": "GTFO Rundown continuity and the Complex",
    "sourceReference": "https://gtfothegame.com/prisoners",
    "location": "The Complex — sas du secteur de Security Scan",
    "motif": "Lumières jaunes des équipements de scan dans le sas de recherche souterrain",
    "effect": "lab-monitors",
    "color": "#b6ab7d",
    "placement": {
      "x": 0.78,
      "y": 0.28,
      "spread": 0.43
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "HAWKEN",
    "sourceWork": "Original HAWKEN multiplayer game on Illal, not later unrelated projects",
    "sourceReference": "https://www.playhawken.com/game-guide",
    "location": "Illal — Bazaar",
    "motif": "Poussière beige entre les ruines des tours industrielles du Bazaar",
    "effect": "desert-drift",
    "color": "#bfa885",
    "placement": {
      "x": 0.3,
      "y": 0.38,
      "spread": 0.73
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Haydee — Safe Adaptation",
    "sourceWork": "Haydee (2016) artificial complex",
    "sourceReference": "https://store.steampowered.com/app/530890/Haydee/",
    "location": "Green Zone — accès industriel, adaptation entièrement vêtue du projet",
    "motif": "Éclairage vert pâle des grilles d’accès et des murs blancs de la Green Zone",
    "effect": "lab-monitors",
    "color": "#a2c1ae",
    "placement": {
      "x": 0.68,
      "y": 0.28,
      "spread": 0.58
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Hellblade: Senua’s Sacrifice",
    "sourceWork": "Hellblade: Senua’s Sacrifice (2017)",
    "sourceReference": "https://ninjatheory.com/games/",
    "location": "Rivage des épaves avant Helheim",
    "motif": "Brume bleu gris derrière les épaves du rivage nordique",
    "effect": "cold-haze",
    "color": "#a0b8c3",
    "placement": {
      "x": 0.48,
      "y": 0.37,
      "spread": 0.88
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Hello Neighbor",
    "sourceWork": "Hello Neighbor stealth-game continuity centered on Nicky Roth and the Peterson house",
    "sourceReference": "https://www.helloneighborgame.com/home-en",
    "location": "Maison de Peterson — couloir de surveillance",
    "motif": "Voyants jaune rouge des appareils de surveillance dans la maison inclinée",
    "effect": "lab-monitors",
    "color": "#cdb17c",
    "placement": {
      "x": 0.73,
      "y": 0.3,
      "spread": 0.48
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "HITMAN — World of Assassination",
    "sourceWork": "IO Interactive World of Assassination trilogy",
    "sourceReference": "https://ioi.dk/hitman-codename-47",
    "location": "Paris — défilé du palais de la mode",
    "motif": "Projecteurs blancs ambrés derrière la passerelle du défilé parisien",
    "effect": "concert-lights",
    "color": "#d7ccbb",
    "placement": {
      "x": 0.5,
      "y": 0.23,
      "spread": 0.83
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Tom Clancy’s Splinter Cell",
    "sourceWork": "Main Splinter Cell game continuity through Blacklist",
    "sourceReference": "https://www.ubisoft.com/en-us/company/about-us/our-brands/tom-clancy-s-splinter-cell",
    "location": "Tbilissi — ministère géorgien de la Défense",
    "motif": "Lumières de sécurité bleu vert le long des équipements du ministère",
    "effect": "network-traces",
    "color": "#83ad9c",
    "placement": {
      "x": 0.22,
      "y": 0.27,
      "spread": 0.46
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Super Meat Boy",
    "sourceWork": "Super Meat Boy (2010)",
    "sourceReference": "https://www.team-meat.com/",
    "location": "The Forest — parois de plateforme",
    "motif": "Feuilles dessinées vert sombre derrière les blocs de la forêt, sans obstacle ajouté",
    "effect": "foliage",
    "color": "#8fa773",
    "placement": {
      "x": 0.4,
      "y": 0.34,
      "spread": 0.74
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "BIT.TRIP",
    "sourceWork": "CommanderVideo BIT.TRIP series continuity",
    "sourceReference": "https://www.rerunner.game/presskit",
    "location": "BIT.TRIP BEAT — grille de rythme",
    "motif": "Traces rectangulaires jaune cyan de la grille rétro, mouvement sans influence sur les notes",
    "effect": "network-traces",
    "color": "#d1c972",
    "placement": {
      "x": 0.52,
      "y": 0.27,
      "spread": 0.86
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Interstellar Marines",
    "sourceWork": "Early Access publiee dans The Vault ; concepts non sortis exclus.",
    "sourceReference": "https://store.steampowered.com/app/236370/Interstellar_Marines/",
    "location": "The Vault — parcours de cibles",
    "motif": "Voyants bleu acier du terrain d’évaluation The Vault",
    "effect": "lab-monitors",
    "color": "#97b3c5",
    "placement": {
      "x": 0.76,
      "y": 0.28,
      "spread": 0.47
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Killer Instinct",
    "sourceWork": "Reboot Xbox 2013.",
    "sourceReference": "https://www.xbox.com/en-US/games/store/killer-instinct/BP4S3XLJG78M/0001",
    "location": "Tiger Lair — sanctuaire de Jago, continuité 2013",
    "motif": "Lueur ambrée des braseros dans le sanctuaire du Tiger Lair",
    "effect": "candlelight",
    "color": "#c5a476",
    "placement": {
      "x": 0.24,
      "y": 0.31,
      "spread": 0.49
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Killing Floor 2",
    "sourceWork": "Killing Floor 2 uniquement.",
    "sourceReference": "https://store.steampowered.com/app/232090/Killing_Floor_2/",
    "location": "Burning Paris — rue hors de la zone de combat",
    "motif": "Braises atténuées des foyers lointains de Burning Paris",
    "effect": "embers",
    "color": "#c08a73",
    "placement": {
      "x": 0.7,
      "y": 0.38,
      "spread": 0.61
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Magicka",
    "sourceWork": "Premier Magicka.",
    "sourceReference": "https://www.paradoxinteractive.com/games/magicka/about",
    "location": "Château d’Aldrheim — cour des magiciens",
    "motif": "Flammes douces des éclairages de la cour d’Aldrheim, aucune incantation ajoutée",
    "effect": "candlelight",
    "color": "#bda58d",
    "placement": {
      "x": 0.28,
      "y": 0.3,
      "spread": 0.55
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Max Payne 2",
    "sourceWork": "Jeu original uniquement.",
    "sourceReference": "https://www.rockstargames.com/games/maxpayne2",
    "location": "New York — fenêtres de l’hôpital noir",
    "motif": "Pluie gris bleu derrière les fenêtres de l’hôpital de The Fall of Max Payne",
    "effect": "rain",
    "color": "#a2b3c5",
    "placement": {
      "x": 0.63,
      "y": 0.29,
      "spread": 0.71
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Metal Slug",
    "sourceWork": "Anthologie arcade SNK explicite.",
    "sourceReference": "https://www.snk-corp.co.jp/official/akeakaneogeo/metalslug/",
    "location": "Front rebelle désertique — route des véhicules",
    "motif": "Sable beige au ras des reliefs du front désertique SNK, sans danger additionnel",
    "effect": "desert-drift",
    "color": "#c9ad7a",
    "placement": {
      "x": 0.37,
      "y": 0.41,
      "spread": 0.8
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Mirror's Edge",
    "sourceWork": "Jeu original de 2008.",
    "sourceReference": "https://www.ea.com/en/games/mirrors-edge/mirrors-edge",
    "location": "Ville de 2008 — parcours des toits vers The Shard",
    "motif": "Lueurs rouges discrètes de signalisation au fond des surfaces blanches des toits",
    "effect": "city-lights",
    "color": "#cf9991",
    "placement": {
      "x": 0.54,
      "y": 0.26,
      "spread": 0.84
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Overgrowth",
    "sourceWork": "Campagnes Overgrowth et Lugaru, melange explicite.",
    "sourceReference": "https://www.wolfire.com/games/",
    "location": "White Flags Village — sentier entre les îles rocheuses",
    "motif": "Feuilles brunes claires près du sentier du village White Flags",
    "effect": "foliage",
    "color": "#b5b18c",
    "placement": {
      "x": 0.33,
      "y": 0.35,
      "spread": 0.7
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Palworld",
    "sourceWork": "Jeu de base et chefs de tours du lancement.",
    "sourceReference": "https://www.palworldgame.com/",
    "location": "Windswept Hills — prairie du départ",
    "motif": "Pollen vert doré dans les herbes des Windswept Hills",
    "effect": "spores",
    "color": "#b5c995",
    "placement": {
      "x": 0.45,
      "y": 0.31,
      "spread": 0.81
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Phantasmagoria",
    "sourceWork": "Premier jeu uniquement.",
    "sourceReference": "https://www.gog.com/en/game/phantasmagoria",
    "location": "Manoir Carnovasch — couloir de recherche",
    "motif": "Poussière ambrée dans les rayons de lumière du manoir, sans représentation d’acteur ou de violence",
    "effect": "dust",
    "color": "#b9a58c",
    "placement": {
      "x": 0.22,
      "y": 0.29,
      "spread": 0.48
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Sam & Max",
    "sourceWork": "Anthologie classique et Telltale explicite.",
    "sourceReference": "https://skunkapegames.com/samandmax/faq/",
    "location": "Bureau de la Freelance Police — fenêtre de rue",
    "motif": "Lumières bleu beige de la rue derrière le bureau de Sam et Max",
    "effect": "city-lights",
    "color": "#b2b8aa",
    "placement": {
      "x": 0.73,
      "y": 0.28,
      "spread": 0.53
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Postal",
    "sourceWork": "Anthologie ; variantes du meme Postal Dude.",
    "sourceReference": "https://gopostal.com/",
    "location": "Paradise — parcours des courses quotidiennes",
    "motif": "Poussière beige sur les abords de la route de Paradise, adaptation cartoon du projet",
    "effect": "desert-drift",
    "color": "#b7a487",
    "placement": {
      "x": 0.34,
      "y": 0.39,
      "spread": 0.75
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "PUBG",
    "sourceWork": "PUBG contemporain ; aucun personnage narratif invente.",
    "sourceReference": "https://pubg.com/en",
    "location": "Erangel — terrain d’entraînement, parcours non combattant du projet",
    "motif": "Feuilles olive au fond de la piste d’entraînement et des cibles inertes",
    "effect": "foliage",
    "color": "#aab68e",
    "placement": {
      "x": 0.42,
      "y": 0.34,
      "spread": 0.78
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "La Petite Histoire de France",
    "sourceWork": "Serie W9/M6, entree dedupliquee.",
    "sourceReference": "https://pro.m6.fr/w9/programme/2026-1/la-petite-histoire-de-france-70068585835889856",
    "location": "Taverne de 1430 — salle des commandes",
    "motif": "Lueurs des chandelles derrière les registres et les tables de la taverne",
    "effect": "candlelight",
    "color": "#c8ab7e",
    "placement": {
      "x": 0.27,
      "y": 0.29,
      "spread": 0.52
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Halloween",
    "sourceWork": "Trilogie 2018, Kills et Ends uniquement.",
    "sourceReference": "https://www.universalpictures.com/movies/halloween",
    "location": "Haddonfield — rue automnale de la continuité 2018",
    "motif": "Feuilles orange fanées entre les maisons de Haddonfield, sans slasher ajouté au décor",
    "effect": "foliage",
    "color": "#b7946a",
    "placement": {
      "x": 0.4,
      "y": 0.35,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Red Faction",
    "sourceWork": "Anthologie explicite de la franchise.",
    "sourceReference": "https://manuals.thqnordic.com/RedFactionComplete/RedFactionComplete_PS3_Manual_US.pdf",
    "location": "Mars — mine Ultor",
    "motif": "Poussière rouge claire dans le plan éloigné des galeries d’Ultor",
    "effect": "desert-drift",
    "color": "#bc8e72",
    "placement": {
      "x": 0.31,
      "y": 0.39,
      "spread": 0.7
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Remember Me",
    "sourceWork": "Jeu Capcom de 2013 uniquement.",
    "sourceReference": "https://store.steampowered.com/app/228300/Remember_Me/",
    "location": "Neo-Paris 2084 — toits autour des installations Memorize",
    "motif": "Tracés bleu pâle des interfaces Sensen au loin sur les bâtiments usés",
    "effect": "network-traces",
    "color": "#98c4cf",
    "placement": {
      "x": 0.69,
      "y": 0.25,
      "spread": 0.61
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "R.E.P.O.",
    "sourceWork": "Jeu Semiwork ; trois couleurs du meme Semibot, aucune classe inventee.",
    "sourceReference": "https://store.steampowered.com/app/3241660/R_E_P_O/",
    "location": "Service Station — zone de récupération",
    "motif": "Petits voyants vert gris autour des accessoires fragiles et des équipements d’extraction",
    "effect": "lab-monitors",
    "color": "#9ba99a",
    "placement": {
      "x": 0.77,
      "y": 0.3,
      "spread": 0.45
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Wolfenstein",
    "sourceWork": "Continuite MachineGames uniquement.",
    "sourceReference": "https://bethesda.net/en/game/wolfenstein",
    "location": "Château Wolfenstein — couloir de fuite de l’anthologie MachineGames",
    "motif": "Lueurs ambrées derrière les équipements dieselpunk et les murs de pierre",
    "effect": "candlelight",
    "color": "#b3a181",
    "placement": {
      "x": 0.24,
      "y": 0.3,
      "spread": 0.5
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Rock of Ages",
    "sourceWork": "Anthologie explicite de la franchise ACE Team.",
    "sourceReference": "https://store.steampowered.com/app/22230/Rock_of_Ages/",
    "location": "Parcours grec de rocher — paysage en collage du projet",
    "motif": "Poussière beige derrière les décors peints du parcours grec",
    "effect": "dust",
    "color": "#c9b795",
    "placement": {
      "x": 0.4,
      "y": 0.36,
      "spread": 0.76
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Serious Sam",
    "sourceWork": "Anthologie explicite de la franchise Croteam.",
    "sourceReference": "https://www.croteam.com/about2/",
    "location": "Karnak — approche de la grande cour",
    "motif": "Sable doré des reliefs de Karnak dans le plan éloigné du temple",
    "effect": "desert-drift",
    "color": "#ceb889",
    "placement": {
      "x": 0.47,
      "y": 0.41,
      "spread": 0.86
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Skullgirls",
    "sourceWork": "Continuite du jeu Skullgirls.",
    "sourceReference": "https://skullgirls.com/world/",
    "location": "New Meridian — rue art déco",
    "motif": "Lueurs violettes et crème des vitrines de New Meridian",
    "effect": "city-lights",
    "color": "#b7a0c7",
    "placement": {
      "x": 0.57,
      "y": 0.27,
      "spread": 0.82
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Forest",
    "sourceWork": "Premier The Forest uniquement ; deux heros sont avatars co-op anonymes.",
    "sourceReference": "https://store.steampowered.com/app/242760/The_Forest/",
    "location": "Péninsule — lisière du camp de survie",
    "motif": "Feuilles et pollen vert pâle dans la canopée derrière les abris artisanaux",
    "effect": "foliage",
    "color": "#9cb591",
    "placement": {
      "x": 0.42,
      "y": 0.33,
      "spread": 0.82
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Spy Fox",
    "sourceWork": "Anthologie explicite des aventures Humongous.",
    "sourceReference": "https://www.humongous.com/games/spy-fox-in-dry-cereal/",
    "location": "Dry Cereal — réserve de la laiterie",
    "motif": "Lumières jaune pâle des appareils et caisses du parcours de la laiterie",
    "effect": "lab-monitors",
    "color": "#c8c394",
    "placement": {
      "x": 0.71,
      "y": 0.3,
      "spread": 0.52
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Squirrel with a Gun",
    "sourceWork": "Jeu de Dee Dee Creations ; trois builds du meme ecureuil.",
    "sourceReference": "https://squirrelwithagun.com/",
    "location": "Banlieue — parcours de glands du jardin",
    "motif": "Petites feuilles de chêne au bord du parcours des jardins de la banlieue",
    "effect": "foliage",
    "color": "#b7bf84",
    "placement": {
      "x": 0.33,
      "y": 0.34,
      "spread": 0.7
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "SUPERHOT",
    "sourceWork": "Anthologie explicite SUPERHOT et MIND CONTROL DELETE.",
    "sourceReference": "https://superhotgame.com/documents/SUPERHOT-Brand-Guidelines.pdf",
    "location": "Séquence de cibles — couloir blanc abstrait",
    "motif": "Lueurs grises claires et tracés rouges discrets dans l’espace blanc facetté",
    "effect": "network-traces",
    "color": "#bd9b99",
    "placement": {
      "x": 0.5,
      "y": 0.27,
      "spread": 0.85
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Ball",
    "sourceWork": "Jeu The Ball de Teotl Studios uniquement.",
    "sourceReference": "https://store.steampowered.com/app/35460/The_Ball/",
    "location": "Pehua — cavernes du parcours de la sphère",
    "motif": "Poussière ocre des ruines mésoaméricaines derrière le parcours de la boule",
    "effect": "dust",
    "color": "#b7a782",
    "placement": {
      "x": 0.29,
      "y": 0.34,
      "spread": 0.61
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Binding of Isaac: Rebirth",
    "sourceWork": "Rebirth et contenu disponible dans sa famille, finale Mega Satan.",
    "sourceReference": "https://store.steampowered.com/app/250900/The_Binding_of_Isaac_Rebirth/",
    "location": "Basement — salle de départ",
    "motif": "Poussière gris beige près des murs quadrillés du sous-sol, sans anatomie ni ennemi ajouté",
    "effect": "dust",
    "color": "#b3a196",
    "placement": {
      "x": 0.22,
      "y": 0.34,
      "spread": 0.51
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Darkness",
    "sourceWork": "Anthologie explicite des deux jeux The Darkness.",
    "sourceReference": "https://www.xbox.com/en-US/games/store/the-darkness/c035l0ns3sqn",
    "location": "New York — station du métro nocturne",
    "motif": "Éclairages jaunes du quai de métro dans la nuit new-yorkaise",
    "effect": "city-lights",
    "color": "#bbaa7f",
    "placement": {
      "x": 0.62,
      "y": 0.29,
      "spread": 0.67
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Surge",
    "sourceWork": "Premier The Surge uniquement.",
    "sourceReference": "https://www.deck13.com/games/the-surge",
    "location": "CREO — Abandoned Production",
    "motif": "Vapeur grise des machines industrielles de la zone de production abandonnée",
    "effect": "vent-steam",
    "color": "#b3af94",
    "placement": {
      "x": 0.78,
      "y": 0.38,
      "spread": 0.45
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Turok",
    "sourceWork": "Classic Acclaim Turok game continuity",
    "sourceReference": "https://www.nightdivestudios.com/turok",
    "location": "Lost Land — jungle près des portails de pierre",
    "motif": "Feuilles vert bronze dans la jungle du Lost Land derrière les ruines",
    "effect": "foliage",
    "color": "#a6b591",
    "placement": {
      "x": 0.38,
      "y": 0.33,
      "spread": 0.78
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Wallace & Gromit",
    "sourceWork": "Aardman stop-motion film and game continuity",
    "sourceReference": "https://www.wallaceandgromit.com/",
    "location": "62 West Wallaby Street — atelier de Wallace",
    "motif": "Vapeur douce des tuyaux de cuivre des inventions à l’arrière de l’atelier",
    "effect": "vent-steam",
    "color": "#c0b39a",
    "placement": {
      "x": 0.2,
      "y": 0.37,
      "spread": 0.44
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Worms",
    "sourceWork": "Team17 turn-based artillery continuity",
    "sourceReference": "https://www.team17.com/franchises/worms",
    "location": "Îlot destructible — décor original de terrain Worms",
    "motif": "Reflets bleus de la mer au loin sous les îlots de terre, sans modifier leur collision",
    "effect": "water-ripples",
    "color": "#99bbc7",
    "placement": {
      "x": 0.51,
      "y": 0.44,
      "spread": 0.88
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Amazing Patate Show",
    "sourceWork": "The Amazing Patate Show web-animation and musical universe",
    "sourceReference": "https://lapatate.fr/univers.html",
    "location": "Plateau blanc — répétition de Petite Patate",
    "motif": "Lueurs jaune bleu des accessoires colorés du plateau musical minimaliste",
    "effect": "concert-lights",
    "color": "#d4c8a0",
    "placement": {
      "x": 0.47,
      "y": 0.25,
      "spread": 0.77
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Helluva Boss",
    "sourceWork": "Helluva Boss animated-series continuity",
    "sourceReference": "https://www.helluvaboss.com/",
    "location": "I.M.P. — bureau",
    "motif": "Néons rouge rose derrière les murs sombres du bureau de l’I.M.P.",
    "effect": "neon-signals",
    "color": "#c78a9f",
    "placement": {
      "x": 0.69,
      "y": 0.28,
      "spread": 0.58
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Murder Drones",
    "sourceWork": "GLITCH animated-series continuity",
    "sourceReference": "https://www.glitchprod.com/murder-drones",
    "location": "Copper 9 — colonie des Worker Drones",
    "motif": "Neige bleu gris légère devant les tours noires de Copper 9",
    "effect": "snow",
    "color": "#b9c5db",
    "placement": {
      "x": 0.5,
      "y": 0.29,
      "spread": 0.89
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Gushing over Magical Girls — Safe Adult Reinterpretation",
    "sourceWork": "Adult 20+ alternate reinterpretation of the magical-team premise only",
    "sourceReference": "https://mahoako-anime.com/",
    "location": "Tres Magia — salle d’entraînement de la réinterprétation adulte du projet",
    "motif": "Lueurs de mana rose pâle sur les constructions abstraites de la salle sûre, sans sexualisation",
    "effect": "candlelight",
    "color": "#d0a8c5",
    "placement": {
      "x": 0.73,
      "y": 0.29,
      "spread": 0.5
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Peepoodo — Safe Educational Adaptation",
    "sourceWork": "Sanitized educational spin-off using only colorful mascot friendship",
    "sourceReference": "https://peepoodo.bobbypills.com/about/",
    "location": "Classe des émotions — adaptation éducative sûre du projet",
    "motif": "Points de lumière pastel au bord des cartes d’expression et du tableau de classe",
    "effect": "lab-monitors",
    "color": "#b5c9bc",
    "placement": {
      "x": 0.26,
      "y": 0.28,
      "spread": 0.54
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Les Kassos",
    "sourceWork": "CANAL+ social-services short-form premise",
    "sourceReference": "https://www.canalplus.com/jeunesse/les-kassos/h/12456299_50001/resume-casting/",
    "location": "Salle d’attente — bureau de médiation",
    "motif": "Poussière claire dans la lumière des archives et des chaises en plastique du bureau",
    "effect": "dust",
    "color": "#bbb29c",
    "placement": {
      "x": 0.24,
      "y": 0.3,
      "spread": 0.52
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Marvel Zombies — MCU Animation",
    "sourceWork": "Marvel Studios Animation zombie continuity",
    "sourceReference": "https://www.marvel.com/tv-shows/animation/marvel-zombies/1",
    "location": "Manhattan — route d’évacuation animée",
    "motif": "Lueurs vert gris lointaines de la ville animée en ruine, sans corps ajouté au fond",
    "effect": "city-lights",
    "color": "#9bad8d",
    "placement": {
      "x": 0.55,
      "y": 0.27,
      "spread": 0.83
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Stranger Things",
    "sourceWork": "Television continuity through the Hawkins and Vecna crisis",
    "sourceReference": "https://www.netflix.com/tudum/stranger-things",
    "location": "Hawkins National Laboratory — couloir de recherche",
    "motif": "Voyants orange doux du laboratoire de Hawkins, sans spores de l’Upside Down ajoutées à cette scène",
    "effect": "lab-monitors",
    "color": "#c6a67f",
    "placement": {
      "x": 0.76,
      "y": 0.28,
      "spread": 0.47
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Invincible",
    "sourceWork": "Invincible animated-series continuity",
    "sourceReference": "https://www.skybound.com/invincible",
    "location": "Chicago — panorama des toits",
    "motif": "Lueurs jaune bleu des fenêtres du panorama urbain animé",
    "effect": "city-lights",
    "color": "#b5be9c",
    "placement": {
      "x": 0.51,
      "y": 0.25,
      "spread": 0.87
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Wakfu",
    "sourceWork": "Ankama animated-series continuity",
    "sourceReference": "https://www.ankama.com/en/games/wakfu",
    "location": "Emelka — village",
    "motif": "Pollen turquoise pâle dans les herbes et les ruines chaleureuses d’Emelka",
    "effect": "spores",
    "color": "#a3c9b8",
    "placement": {
      "x": 0.42,
      "y": 0.33,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Oggy et les Cafards",
    "sourceWork": "Xilam cartoon continuity",
    "sourceReference": "https://xilam.com/en/media/oggy-the-cockroaches/",
    "location": "Maison d’Oggy — cuisine",
    "motif": "Vapeur blanche légère près de la cuisine et des accessoires cartoon, sans personnage ajouté",
    "effect": "coffee-steam",
    "color": "#c6d1c0",
    "placement": {
      "x": 0.19,
      "y": 0.36,
      "spread": 0.43
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Les Zinzins de l’espace",
    "sourceWork": "Xilam cartoon continuity",
    "sourceReference": "https://xilam.com/en/media/space-goofs/",
    "location": "Maison des Zinzins — grenier du vaisseau",
    "motif": "Lueurs lilas des pièces du vaisseau cachées dans le grenier de la maison",
    "effect": "lab-monitors",
    "color": "#bfa7cc",
    "placement": {
      "x": 0.76,
      "y": 0.27,
      "spread": 0.48
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Texas Chain Saw Massacre",
    "sourceWork": "The Texas Chain Saw Massacre (1974) film continuity",
    "sourceReference": "https://www.thetexaschainsawmassacre.com/",
    "location": "Texas — route rurale près de la ferme familiale",
    "motif": "Poussière délavée du bas-côté au loin devant les clôtures et la ferme, sans violence ajoutée",
    "effect": "desert-drift",
    "color": "#c5b08c",
    "placement": {
      "x": 0.36,
      "y": 0.41,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Friday the 13th",
    "sourceWork": "Friday the 13th film-series continuity",
    "sourceReference": "https://www.paramountpictures.com/movies/friday-the-13th",
    "location": "Camp Crystal Lake — cabanes au bord du lac",
    "motif": "Reflets bleu argent du lac derrière les cabanes en bois",
    "effect": "water-ripples",
    "color": "#9bb8c7",
    "placement": {
      "x": 0.58,
      "y": 0.43,
      "spread": 0.74
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "The Truman Show",
    "sourceWork": "The Truman Show (1998) film continuity",
    "sourceReference": "https://www.paramountpictures.com/movies/the-truman-show",
    "location": "Seahaven — boucle matinale près du front de mer",
    "motif": "Reflets pastel de l’océan artificiel au fond du panorama du studio de Seahaven",
    "effect": "water-ripples",
    "color": "#a8cbd1",
    "placement": {
      "x": 0.5,
      "y": 0.42,
      "spread": 0.86
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  },
  {
    "universe": "Torbahead",
    "sourceWork": "Public Torbahead social-media persona and published reel format only",
    "sourceReference": "https://linktr.ee/torbahead",
    "location": "Plateau abstrait Daily Greeting Reel — adaptation du format public",
    "motif": "Barres de lumière et cadres verticaux des salutations et des boucles audio, aucune personne ou localisation réelle déduite",
    "effect": "network-traces",
    "color": "#c6b3d1",
    "placement": {
      "x": 0.49,
      "y": 0.26,
      "spread": 0.79
    },
    "fidelity": "authored-universe-adaptation",
    "visualValidation": "not-validated-1:1"
  }
];

const entries = [...STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS_PART_A, ...STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS_PART_B];
const defaults = Object.create(null);
for (const entry of entries) {
  if (!entry.universe || defaults[entry.universe]) throw new Error('Duplicate or missing atmosphere universe: ' + entry.universe);
  defaults[entry.universe] = Object.freeze({
    ...entry,
    placement: Object.freeze({ ...entry.placement })
  });
}

export const STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS = Object.freeze(defaults);
export const getUniverseStageAtmosphereDefault = universe => STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS[universe] || null;
