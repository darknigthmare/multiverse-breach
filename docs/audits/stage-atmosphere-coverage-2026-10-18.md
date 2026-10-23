# Couverture des animations de décor — 18 octobre 2026

Les **255 univers auparavant sans ambiance par défaut sont complétés**. La sonde exacte est `getStageAtmosphereProfile({ universe, mode: 'Combat' })`, sans nom, description ou identifiant de scène. Elle couvre les **525 univers distincts de HEROES_DB**, et non seulement les **268 profils univers de stageLoreProfiles**.

Les nouveaux défauts sont 255 choix explicites de lieu, œuvre, référence, motif, effet, couleur et placement. Leurs données se trouvent dans `src/game/melee/stageAtmosphereUniverseDefaults.js` et `stageAtmosphereUniverseDefaultsPartA.js`. Les anciennes résolutions par ancre lore ou matière de niveau restent identifiées séparément. Le mot « défaut » signifie un choix de scène lorsque le caller n’en a fourni aucune ; il ne désigne pas une mécanique générique choisie par faction, genre, index ou hash du nom.

**Une scène concrète prime toujours.** Son nom, sa description et son lieu empêchent l’héritage du défaut, y compris si la scène est inconnue. Cell Games ne prend pas l’eau de Namek, Cochlea ne prend pas la pluie d’un toit de Tokyo, et le mont Natagumo ne prend pas les panneaux du Château de l’Infini. Un univers extérieur au catalogue et sans lieu explicite reste non configuré. Les noms concrets des scènes peuvent donc changer le profil ou le désactiver lorsque leurs données ne permettent pas de motif justifié.

Les statuts indiquent une **adaptation procédurale**, jamais une animation extraite de l’œuvre ou une validation de fidélité 1:1. Chaque nouveau défaut expose `sourceWork`, `sourceReference`, `sourceAnchor`, `sourceMatchedMotif`, `sourceDefinitionFidelity`, `placement` et `sourceVisualValidation: 'not-validated-1:1'`. Les références viennent des packs et œuvres nommés ; les mondes OC pointent leur canon local. Les versions réinterprétées et les scènes originales du projet sont nommées comme telles. Aucune vérification de concordance image par image avec une source officielle n’est revendiquée.

Le rendu est uniquement décoratif, discret et placé derrière le combat : aucun dégât, collision, mouvement de caméra ou nouveau danger. Le mouvement réduit fige les animations. Les quatre effets ajoutés sont `desert-drift`, `starfield`, `aurora` et `spores`.

<!-- audit-data:start -->
| Statut | Avant | Après |
| --- | ---: | ---: |
| authored-location-adaptation | 30 | 285 |
| physical-motif-adaptation | 240 | 240 |
| unconfigured | 255 | 0 |
| Total univers HEROES_DB | 525 | 525 |

Les **255 nouveaux défauts** sont distingués par `selection: 'universe-default'`. Ils réutilisent **22 effets distincts**, avec des placements et couleurs écrits dans chaque entrée. Les **268 profils lore** restent un sous-ensemble du roster. Solar Opposites et Siren Head conservent leur adaptation de matériau `alloy` de recentUniverseLevels, ce qui ne constitue pas une validation de décor canonique.

La liste initiale des 255 absences est conservée dans `stage-atmosphere-missing-baseline-2026-10-18.json`. Le JSON compagnon du présent rapport donne les références, œuvres et placements des 525 lignes.

| # | Univers | Statut | Sélection | Profil | Motif retenu | sourceAnchor |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | 28 Days Later | authored-location-adaptation | universe-default | universe-default:28 Days Later | Poussière légère dans la rue londonienne vide. | Westminster — rue désertée |
| 2 | A Nightmare on Elm Street | physical-motif-adaptation | universe-lore | physical-embers | boiler | 1428 Elm Street, Westin Hills ward and Springwood boiler room |
| 3 | ASMRZ | physical-motif-adaptation | universe-lore | physical-dust | corridor | Good Night Ojou-sama mansion corridor and dance set |
| 4 | Absolver: Downfall | authored-location-adaptation | universe-default | universe-default:Absolver: Downfall | Poussière ocre et Gleam pâle près des pierres du pont de Guidance | Adal — Guidance Bridge |
| 5 | Ado | physical-motif-adaptation | universe-lore | physical-city-lights | city | Usseewa graphic office-city set |
| 6 | Adoprixtoxis | authored-location-adaptation | universe-default | universe-default:Adoprixtoxis | Poussière du terrain autour de l’épave de l’expédition. | Adoprixtoxis — zone d’atterrissage |
| 7 | Aegea: War of the Moirai | authored-location-adaptation | universe-default | universe-default:Aegea: War of the Moirai | Poussière claire devant les statues et corniches de pierre. | Falaise des Reflets |
| 8 | Aetherion: Seven Laws of Magic | authored-location-adaptation | universe-default | universe-default:Aetherion: Seven Laws of Magic | Poussière lumineuse adaptée aux rayonnages de la bibliothèque. | Bibliothèque des Sorts Vivants |
| 9 | Aevum Fracture | authored-location-adaptation | universe-default | universe-default:Aevum Fracture | Cadrans lointains des quatre minuits de la capitale fictive. | Capitale aux Quatre Minuits |
| 10 | Agony | authored-location-adaptation | universe-default | universe-default:Agony | Volutes rouge brun derrière les structures osseuses de la forêt flottante | Floating Forest — adaptation visuelle sans nudité ni gore |
| 11 | Alien | authored-location-adaptation | universe-default | universe-default:Alien | Fins dégagements de vapeur aux conduites du Nostromo. | Nostromo — coursive des conduits |
| 12 | Alien 3 | authored-location-adaptation | universe-lore | fiorina-furnace | Fiorina | Fiorina 161 leadworks furnace and mold catwalk |
| 13 | Alien Resurrection | authored-location-adaptation | universe-lore | alien-processor-vents | Auriga | USM Auriga cloning laboratory and flooded containment deck |
| 14 | Alien vs Predator | physical-motif-adaptation | universe-lore | physical-dust | pyramid | Bouvetoya shifting pyramid sacrificial chamber |
| 15 | Alien: Covenant | physical-motif-adaptation | universe-lore | physical-lab-monitors | laboratory | Engineer necropolis plaza and David's cathedral laboratory |
| 16 | Alien: Romulus | authored-location-adaptation | universe-lore | alien-processor-vents | Renaissance | Renaissance station zero-gravity cargo shaft and facehugger corridor |
| 17 | Aliens | authored-location-adaptation | universe-lore | alien-processor-vents | Processor | Hadley's Hope Operations and Atmosphere Processor access |
| 18 | Aliens vs Predator: Requiem | physical-motif-adaptation | universe-lore | physical-water-ripples | flood | Gunnison hospital rooftop and flooded town streets |
| 19 | Altered Beast | physical-motif-adaptation | universe-lore | physical-city-lights | road | Ancient Greece graveyard and temple road |
| 20 | American Dad | physical-motif-adaptation | universe-lore | physical-dust | house | Smith house operations basement and CIA Situation Room |
| 21 | Angels Fall First | authored-location-adaptation | universe-default | universe-default:Angels Fall First | Éclats de signaux bleu gris sur le transport et les structures d’approche | Ground Incursion — approche du transport de débarquement |
| 22 | Another | physical-motif-adaptation | universe-lore | physical-dust | School | Yomiyama North Middle School class 3-3 and stairwell |
| 23 | Ash vs Evil Dead | authored-location-adaptation | universe-default | universe-default:Ash vs Evil Dead | Lueurs des lampes de stationnement derrière la caravane. | Mobile home d’Ash — aire de stationnement |
| 24 | Assassin's Creed | authored-location-adaptation | universe-default | universe-default:Assassin's Creed | Poussière dorée devant les corniches de Florence. | Florence — terrasse au-dessus des cours |
| 25 | Asterix & Obelix | authored-location-adaptation | universe-default | universe-default:Asterix & Obelix | Feuilles de la forêt armoricaine derrière la palissade. | Village gaulois — bord de la palissade |
| 26 | Atarashii Gakko | physical-motif-adaptation | universe-lore | physical-concert-lights | performance | Seishun academy gym and rooftop performance set |
| 27 | Atomic Heart | authored-location-adaptation | universe-default | universe-default:Atomic Heart | Voyants crème-rouge des appareils de recherche de l’exposition rétrofuturiste | Complexe 3826 — exposition VDNH |
| 28 | Attack on Titan | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | Shiganshina outer gate and rooftop defense line |
| 29 | Aural Vampire | physical-motif-adaptation | universe-lore | physical-concert-lights | live club | Vampire Ecstasy industrial darkwave live club |
| 30 | Avatar (Na'vi) | authored-location-adaptation | universe-default | universe-default:Avatar (Na'vi) | Grains lumineux adaptés à la végétation du sous-bois de Pandora. | Pandora — sous-bois de l’Arbre-Maison |
| 31 | BIT.TRIP | authored-location-adaptation | universe-default | universe-default:BIT.TRIP | Traces rectangulaires jaune cyan de la grille rétro, mouvement sans influence sur les notes | BIT.TRIP BEAT — grille de rythme |
| 32 | BRINK | authored-location-adaptation | universe-default | universe-default:BRINK | Poussière salée portée entre les conteneurs superposés de l’Arche | The Ark — Container City |
| 33 | Baby Cart | physical-motif-adaptation | universe-lore | physical-water-ripples | river | Edo-period post road, river ford and Yagyu ambush ridge |
| 34 | Babymetal | physical-motif-adaptation | universe-lore | physical-concert-lights | Kami-band risers | Metal Galaxy arena with Fox Gate and Kami-band risers |
| 35 | Back to the Future | authored-location-adaptation | universe-default | universe-default:Back to the Future | Cadran de la tour de l’horloge dans le fond de la place, mouvement lent décoratif | Hill Valley 1955 — place de la tour de l’horloge |
| 36 | Band-Maid | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | BAND-MAID live serving stage with twin-riser layout |
| 37 | Banlieue 13 | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | B13 tower-block rooftops and casino approach |
| 38 | Battle Royale | physical-motif-adaptation | universe-lore | physical-dust | school | Okishima school briefing room and island sector junction |
| 39 | Beat Banger — Safe Rhythm Studio | authored-location-adaptation | universe-default | universe-default:Beat Banger — Safe Rhythm Studio | Lueurs violet-ambre des vumètres du studio et des microphones, sans contenu adulte | Cabine de percussion — studio professionnel sûr du projet |
| 40 | Bella Poarch | physical-motif-adaptation | universe-lore | physical-lab-monitors | assembly | Build a Bitch assembly factory |
| 41 | Ben 10 | authored-location-adaptation | universe-default | universe-default:Ben 10 | Feuillage des arbres du campement derrière le camping-car. | Rust Bucket — campement d’été |
| 42 | Bendy and the Ink Machine | authored-location-adaptation | universe-default | universe-default:Bendy and the Ink Machine | Lueurs sépia des vieux projecteurs dans l’atelier d’animation près des flaques d’encre | Joey Drew Studios — Old Workshop |
| 43 | Beyond Good & Evil | authored-location-adaptation | universe-default | universe-default:Beyond Good & Evil | Reflets turquoise des canaux sous les plateformes d’infiltration des abattoirs | Hillys — anciens abattoirs au bord des canaux |
| 44 | Bible Black | authored-location-adaptation | universe-default | universe-default:Bible Black | Lueur ambrée des lampes de poche sur les archives et les marques de craie, sans représentation de rituel | École — sous-sol fermé des archives occultes |
| 45 | Big Mouth | physical-motif-adaptation | universe-lore | physical-dust | Bridge | Bridgeton Middle School corridor and gym |
| 46 | Bigflo & Oli | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | Toulouse Zenith stage opening toward Capitole facades |
| 47 | Billie Eilish | physical-motif-adaptation | universe-lore | physical-dust | room | Bad Guy yellow room and white corridor sets |
| 48 | BioShock | physical-motif-adaptation | universe-lore | physical-water-ripples | bathysphere | Medical Pavilion atrium and bathysphere station |
| 49 | Black Eyed Peas | physical-motif-adaptation | universe-lore | physical-concert-lights | soundstage | Boom Boom Pow white digital soundstage |
| 50 | Blackpink | physical-motif-adaptation | universe-lore | physical-city-lights | street | Pink Venom geomungo temple and black-pink street set |
| 51 | Blade Runner | authored-location-adaptation | universe-default | universe-default:Blade Runner | Pluie oblique entre les enseignes de la rue. | Los Angeles 2019 — rue des enseignes |
| 52 | BlazBlue | authored-location-adaptation | universe-default | universe-default:BlazBlue | Brume basse dans le jardin de roses de Rachel. | Château des Alucard — jardin nocturne |
| 53 | Borderlands | physical-motif-adaptation | universe-lore | physical-dust | stone | Fyrestone approach and Destroyer Vault threshold |
| 54 | Borderlands 2 | authored-location-adaptation | universe-default | universe-default:Borderlands 2 | Neige légère derrière les abris et les falaises glacées de Southern Shelf | Southern Shelf — extérieur de Liar’s Berg |
| 55 | Boruto: Naruto Next Generations | physical-motif-adaptation | universe-lore | physical-lab-monitors | alloy | Modern Konoha Chunin arena, Kara chamber and Otsutsuki invasion |
| 56 | Boruto: Two Blue Vortex | physical-motif-adaptation | universe-lore | physical-dust | stone | Time-skip Konoha siege, Claw Grime sectors and Divine Tree dimension |
| 57 | Breaking Bad | physical-motif-adaptation | universe-lore | physical-embers | Lava | Lavanderia Brillante underground superlab |
| 58 | Bring Me the Horizon | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | POST HUMAN arena stage with cyber-medical screen architecture |
| 59 | Brütal Legend | authored-location-adaptation | universe-default | universe-default:Brütal Legend | Braises ambrées discrètes près du relief métallique de Bladehenge | Bladehenge — pierres en forme de lames |
| 60 | Buckethead | physical-motif-adaptation | universe-lore | physical-dust | theme-park | Bucketheadland haunted theme-park entrance and Giant Robot ride |
| 61 | Buckshot Roulette | authored-location-adaptation | universe-default | universe-default:Buckshot Roulette | Lueur verdâtre de l’éclairage industriel au-dessus de la table, sans simulation de décharge | Club — salle de la table du Dealer |
| 62 | Buffy the Vampire Slayer | physical-motif-adaptation | universe-lore | physical-dust | library | Sunnydale High library directly above the Hellmouth |
| 63 | Camera Cafe | authored-location-adaptation | universe-lore | camera-cafe-machine | Couloir | Couloir de bureau vu depuis la machine a cafe |
| 64 | Cells at Work! | physical-motif-adaptation | universe-lore | physical-testimony-ribbons | blood-vessel | Red Bone Marrow production hall opening into a blood-vessel infection front |
| 65 | Chainsaw Man | physical-motif-adaptation | universe-lore | physical-snow | snow | Tokyo Public Safety Devil Hunt, Eternity Devil hotel and Gun Devil snowfield |
| 66 | Chappie | physical-motif-adaptation | universe-lore | physical-lab-monitors | robotics | Tetravaal robotics floor and Johannesburg industrial yard |
| 67 | Charmed | physical-motif-adaptation | universe-lore | physical-dust | Hall | Halliwell Manor attic above the spiritual Nexus |
| 68 | Chicken Run | physical-motif-adaptation | universe-lore | physical-lab-monitors | conveyor | Tweedy Farm coop yard and pie-machine conveyor |
| 69 | Choo-Choo Charles | authored-location-adaptation | universe-default | universe-default:Choo-Choo Charles | Vapeur gris clair derrière la locomotive sur la ligne minière de l’île | Aranearum — voie ferrée de la boucle |
| 70 | Chucky | authored-location-adaptation | universe-default | universe-default:Chucky | Voyants de la chaîne de fabrication des poupées. | Usine Good Guys — chaîne de montage |
| 71 | Cloverfield | physical-motif-adaptation | universe-lore | physical-city-lights | street | Brooklyn Bridge evacuation route and collapsing Manhattan street |
| 72 | Commando | authored-location-adaptation | universe-default | universe-default:Commando | Palmes agitées derrière les murs du jardin. | Île d’Arius — jardin de la villa |
| 73 | Cool Spot | physical-motif-adaptation | universe-lore | physical-water-ripples | beach | Shell Shock beach with bottle platforms |
| 74 | Counter-Strike | physical-motif-adaptation | universe-lore | physical-dust | Dust | Dust II bombsite B and tunnel approach |
| 75 | Cowboy Bebop | physical-motif-adaptation | universe-lore | physical-lab-monitors | hangar | Mars Red Dragon district, Bebop hangar and cathedral |
| 76 | Crash Bandicoot | physical-motif-adaptation | universe-lore | physical-water-ripples | Beach | N. Sanity Beach route ending at Cortex Castle machinery |
| 77 | Croc | physical-motif-adaptation | universe-lore | physical-foliage | Forest | Forest Island village and Baron Dante castle approach |
| 78 | Croc: Legend of the Gobbos | authored-location-adaptation | universe-default | universe-default:Croc: Legend of the Gobbos | Petites feuilles vert clair dans la végétation de Forest Island | Forest Island — chemin de sauvetage des Gobbos |
| 79 | Crypt of the NecroDancer | authored-location-adaptation | universe-default | universe-default:Crypt of the NecroDancer | Lueurs bleu-or des pierres de la crypte suivant une cadence douce sans effet de gameplay | Zone 1 — chambres de la crypte |
| 80 | Crysis | authored-location-adaptation | universe-default | universe-default:Crysis | Feuilles de la jungle tropicale de Lingshan dans le plan éloigné | Lingshan — bord de jungle près de la baie |
| 81 | Cthulhu | physical-motif-adaptation | universe-lore | physical-city-lights | city | R'lyeh risen city from The Call of Cthulhu |
| 82 | Cuphead | authored-location-adaptation | universe-default | universe-default:Cuphead | Reflets bleu pastel du cours d’eau dessiné de l’île | Inkwell Isle — berge près du chemin du casino |
| 83 | Cyberpunk | authored-location-adaptation | universe-default | universe-default:Cyberpunk | Lueurs d’enseignes sur les façades du marché. | Night City — marché de Kabuki |
| 84 | Cyberpunk: Edgerunners | authored-location-adaptation | universe-lore | night-city-neon | Night City | Night City Arasaka Tower, Santo Domingo highway and cyberskeleton route |
| 85 | Daft Punk | authored-location-adaptation | universe-lore | alive-led-pyramid | Alive | Alive 2007 LED pyramid stage |
| 86 | Daikatana | authored-location-adaptation | universe-default | universe-default:Daikatana | Voyants verts de l’appareillage des laboratoires futuristes | Japon 2455 — laboratoires de Mishima |
| 87 | Dandadan | physical-motif-adaptation | universe-lore | physical-city-lights | City | Shono City tunnel and Ayase residence occult threshold |
| 88 | Dante's Inferno | authored-location-adaptation | universe-default | universe-default:Dante's Inferno | Fines braises ambrées dans les falaises et les chaînes de la descente | Portes de l’Enfer — descente de Charon |
| 89 | Dark Souls | authored-location-adaptation | universe-default | universe-default:Dark Souls | Braises orange pâle près des foyers dans les remparts du Bourg des Morts-vivants | Lordran — Undead Burg |
| 90 | Day of the Dead | authored-location-adaptation | universe-default | universe-default:Day of the Dead | Clignotement des indicateurs du complexe souterrain. | Complexe souterrain — couloir de recherche |
| 91 | Dead Rising | authored-location-adaptation | universe-default | universe-default:Dead Rising | Éclairage pâle des vitrines de la galerie du centre commercial | Willamette — galerie commerciale |
| 92 | Dead Space | authored-location-adaptation | universe-default | universe-default:Dead Space | Dégagements de vapeur aux conduites du pont technique. | USG Ishimura — pont d’ingénierie |
| 93 | Dead by Daylight | authored-location-adaptation | universe-default | universe-default:Dead by Daylight | Brume bleutée entre la tour à charbon et les fragments industriels du Realm | MacMillan Estate — Coal Tower |
| 94 | Deadman Wonderland | physical-motif-adaptation | universe-lore | physical-lab-monitors | industrial | G Ward, Dog Race arena and Mother Goose chamber |
| 95 | Deadmau5 | physical-motif-adaptation | universe-lore | physical-concert-lights | concert | Cube v3 concert stage |
| 96 | Death Note | physical-motif-adaptation | universe-lore | physical-dust | warehouse | Yellow Box warehouse confrontation floor |
| 97 | Defiance | physical-motif-adaptation | universe-lore | physical-city-lights | street | Defiance main street and NeedWant exterior during an Arkfall |
| 98 | Demon Slayer | authored-location-adaptation | universe-lore | infinity-castle-panels | Infinity Castle | Infinity Castle, Mount Natagumo and Entertainment District roofs |
| 99 | Deponia | authored-location-adaptation | universe-default | universe-default:Deponia | Vapeur brune claire des conduits derrière les amas de ferraille de KuVaq | KuVaq — butte de déchets |
| 100 | Despicer | physical-motif-adaptation | universe-lore | physical-embers | lava | Despiser (Philip J. Cook): purgatory highway and lava bridges leading to the Despiser's dark fortress |
| 101 | Deus Ex | authored-location-adaptation | universe-default | universe-default:Deus Ex | Reflets or des interfaces et enseignes du quartier de Sarif dans Human Revolution | Detroit — quartier de Sarif Industries |
| 102 | Devil May Cry | authored-location-adaptation | universe-default | universe-default:Devil May Cry | Lueurs rouges douces aux fenêtres du château gothique de Mallet Island | Mallet Island — cour du château |
| 103 | Devilman | physical-motif-adaptation | universe-lore | physical-city-lights | Tokyo | Tokyo demon apocalypse, Sabbath club and Armageddon ruins |
| 104 | Die Antwoord | physical-motif-adaptation | universe-lore | physical-concert-lights | led | Zef warehouse assembled from Fatty Boom Boom and Baby's on Fire practical sets |
| 105 | Digimon | authored-location-adaptation | universe-default | universe-default:Digimon | Feuilles légères dans la clairière de File Island. | File Island — clairière du premier voyage |
| 106 | Digimon Celestial Rift | physical-motif-adaptation | universe-lore | physical-network-traces | data lattice | Custom crossover battlefield at the Kernel boundary above the Dark Area |
| 107 | Digital Circus | authored-location-adaptation | universe-default | universe-default:Digital Circus | Éclairage coloré des gradins et du chapiteau. | Cirque numérique — chapiteau central |
| 108 | Dino Crisis | authored-location-adaptation | universe-default | universe-default:Dino Crisis | Clignotement des tableaux de contrôle de l’installation. | Ibis Island — salle de contrôle |
| 109 | Discipline: The Record of a Crusade | authored-location-adaptation | universe-default | universe-default:Discipline: The Record of a Crusade | Poussière claire dans les rayons des registres administratifs fermés, sans personnages | Saint Arcadia — archives administratives |
| 110 | Discworld | physical-motif-adaptation | universe-lore | physical-water-ripples | River | Ankh-Morpork, Unseen University courtyard opening toward the River Ankh and the Shades |
| 111 | Disenchantment | physical-motif-adaptation | universe-lore | physical-dust | throne | Dreamland throne room and castle cliff balcony |
| 112 | Doom | authored-location-adaptation | universe-default | universe-default:Doom | Poussière martienne devant le sas UAC. | UAC Mars — sas extérieur |
| 113 | Doom Sweeper — Safe Apocalypse | authored-location-adaptation | universe-default | universe-default:Doom Sweeper — Safe Apocalypse | Poussière ocre légère autour du véhicule militaire usé sur la route du parcours | Route en ruine — secteur de balayage, adaptation sûre du projet |
| 114 | Dragon Ball Z | authored-location-adaptation | universe-lore | namek-water | Namek | Cell Games arena, Namek battlefield and Hyperbolic Time Chamber |
| 115 | Duke Nukem | authored-location-adaptation | universe-default | universe-default:Duke Nukem | Petits reflets EDF rouges dans les enseignes du quartier de cinéma en ruine | Los Angeles — Hollywood Holocaust |
| 116 | Dungeon Meshi | physical-motif-adaptation | universe-lore | physical-dust | dungeon | Golden Kingdom dungeon Red Dragon chamber and improvised camp kitchen |
| 117 | Dynamite Duke | physical-motif-adaptation | universe-lore | physical-lab-monitors | laboratory | Bio-army laboratory corridor and final command bunker |
| 118 | E.Y.E: Divine Cybermancy | authored-location-adaptation | universe-default | universe-default:E.Y.E: Divine Cybermancy | Lueur verte des interfaces cybernétiques dans le quartier général du temple | Secreta Secretorum — Temple HQ |
| 119 | Early Edition | physical-motif-adaptation | universe-lore | physical-city-lights | street | McGinty's bar and Chicago street delivery route |
| 120 | Earthworm Jim | physical-motif-adaptation | universe-lore | physical-lab-monitors | conveyor | New Junk City conveyor and tire-yard route |
| 121 | Ecco the Dolphin | physical-motif-adaptation | universe-lore | physical-water-ripples | Tide | Home Bay opening toward Atlantis in The Tides of Time |
| 122 | Elfen Lied | physical-motif-adaptation | universe-lore | physical-lab-monitors | research | Kamakura coastal Kaede house and Diclonius research island |
| 123 | Elvira | physical-motif-adaptation | universe-lore | physical-concert-lights | theater | Falwell movie theater and Elvira's inherited mansion parlor |
| 124 | Eminem | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | The Shelter basement stage in Detroit |
| 125 | Evil Dead | physical-motif-adaptation | universe-lore | physical-foliage | forest | Knowby cabin living room, cellar trapdoor and forest porch |
| 126 | Evil Dead (2013) | authored-location-adaptation | universe-default | universe-default:Evil Dead (2013) | Pluie fine dans la lisière derrière le chalet. | Chalet familial — lisière humide |
| 127 | Evolution | physical-motif-adaptation | universe-lore | physical-dust | cave | Arizona meteor cave and desert command site after the napalm strike, with the selenium fire engine facing the fused final organism |
| 128 | Evolution: The Animated Series | physical-motif-adaptation | universe-lore | physical-lab-monitors | laboratory | Genus command laboratory and alien containment yard |
| 129 | Evolve | authored-location-adaptation | universe-default | universe-default:Evolve | Vapeur grise près des conduits de la distillerie de Shear | Shear — Distillery |
| 130 | Exit 8 | physical-motif-adaptation | universe-lore | physical-dust | passage | Exit 8 underground passage with repeatable anomaly modules |
| 131 | Extreme Ghostbusters | authored-location-adaptation | universe-default | universe-default:Extreme Ghostbusters | Lignes vertes des instruments de confinement reconstruits dans la caserne | Firehouse 23 — unité de confinement |
| 132 | F.E.A.R. | authored-location-adaptation | universe-default | universe-default:F.E.A.R. | Voyants orange des équipements Armacham dans le béton froid des couloirs | Armacham Technology Corporation — couloir de service |
| 133 | Fallout | authored-location-adaptation | universe-default | universe-default:Fallout | Poussière claire dans les rues détruites du centre-ville. | Capital Wasteland — ruines de Washington |
| 134 | Famille Pirate | authored-location-adaptation | universe-default | universe-default:Famille Pirate | Reflets turquoise de la mer sous les maisons du quai. | Île de la Tortue — quai Mac Bernik |
| 135 | Family Guy | physical-motif-adaptation | universe-lore | physical-city-lights | Street | Griffin house living room and Spooner Street frontage |
| 136 | Fantomas | authored-location-adaptation | universe-default | universe-default:Fantomas | Lueurs urbaines distantes sous les cheminées parisiennes. | Paris — toits au-dessus des boulevards |
| 137 | Final Fantasy VII | authored-location-adaptation | universe-lore | mako-reactor-1 | Mako | Mako Reactor 1 catwalk and core chamber |
| 138 | Final Fantasy VIII | physical-motif-adaptation | universe-lore | physical-foliage | Garden | Balamb Garden central hall before the Battle of the Gardens |
| 139 | Final Fantasy XIII | physical-motif-adaptation | universe-lore | physical-lab-monitors | railway | Hanging Edge purge railway and fal'Cie structure |
| 140 | Final Fantasy XV | physical-motif-adaptation | universe-lore | physical-city-lights | plaza | Insomnia Citadel plaza during the fall of Lucis |
| 141 | Finding Frankie | authored-location-adaptation | universe-default | universe-default:Finding Frankie | Projecteurs bleu-rouge doux de l’arène de jeu télévisé abandonnée | Frankie’s Parkour Palace — zone des modules rembourrés |
| 142 | Flashback | physical-motif-adaptation | universe-lore | physical-foliage | jungle | Titan jungle opening and New Washington memory terminal |
| 143 | Freddi Fish | authored-location-adaptation | universe-default | universe-default:Freddi Fish | Courants bleus et bulles stylisées entre les coraux de la crique sous-marine | Crique de Grandma Grouper — chemin des graines de varech |
| 144 | Friday the 13th | authored-location-adaptation | universe-default | universe-default:Friday the 13th | Reflets bleu argent du lac derrière les cabanes en bois | Camp Crystal Lake — cabanes au bord du lac |
| 145 | Frieren: Beyond Journeys End | physical-motif-adaptation | universe-lore | physical-city-lights | road | Northern Plateau road, first-class exam ruins and El Dorado |
| 146 | From | physical-motif-adaptation | universe-lore | physical-city-lights | town | Colony House grounds and looping town road |
| 147 | Fullmetal Alchemist | physical-motif-adaptation | universe-lore | physical-snow | snow | Central Command, Laboratory Five and Briggs Fortress as distinct packs |
| 148 | Futurama | physical-motif-adaptation | universe-lore | physical-lab-monitors | hangar | Planet Express hangar and New New York delivery bay |
| 149 | GTFO | authored-location-adaptation | universe-default | universe-default:GTFO | Lumières jaunes des équipements de scan dans le sas de recherche souterrain | The Complex — sas du secteur de Security Scan |
| 150 | Gantz | physical-motif-adaptation | universe-lore | physical-water-ripples | river | Tokyo Gantz apartment, Osaka river district and Rome statue plaza |
| 151 | Gears of War | authored-location-adaptation | universe-default | universe-default:Gears of War | Poussière de maçonnerie derrière les arcades de Jacinto. | Jacinto — rue des façades éventrées |
| 152 | Gex | authored-location-adaptation | universe-default | universe-default:Gex | Lueur verte des téléviseurs à tube et balayage discret des connexions du hub | Media Dimension — hub des téléviseurs cathodiques |
| 153 | Ghost | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | Ministry cathedral stage with stained-glass risers |
| 154 | Ghost in the Shell | authored-location-adaptation | universe-default | universe-default:Ghost in the Shell | Traces lumineuses des terminaux de liaison de la Section 9. | New Port City — poste de liaison |
| 155 | Ghostbusters | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | 55 Central Park West rooftop temple |
| 156 | Ghosts of Mars | authored-location-adaptation | universe-default | universe-default:Ghosts of Mars | Poussière rouge entre les bâtiments de la colonie. | Shining Canyon — rue de la mine |
| 157 | Goat Simulator | authored-location-adaptation | universe-default | universe-default:Goat Simulator | Feuilles sèches qui traversent la cour ensoleillée de la tour des chèvres | San Angora — quartier de la Goat Tower |
| 158 | Godzilla | authored-location-adaptation | universe-lore | shin-tokyo-evacuation | Tokyo | Era-specific Tokyo destruction, Shin evacuation grid and Lake Ashinoko Biollante bloom |
| 159 | Godzilla The Animated Series | authored-location-adaptation | universe-lore | heat-waterfront | H.E.A.T | H.E.A.T. headquarters at Jamaica Bay and Manhattan waterfront |
| 160 | Goemon's Great Adventure | authored-location-adaptation | universe-default | universe-default:Goemon's Great Adventure | Lueurs dorées lentes des lanternes de la route d’Edo | Route d’Edo — quartier des lanternes au crépuscule |
| 161 | Gorillaz | physical-motif-adaptation | universe-lore | physical-water-ripples | Beach | Plastic Beach island studio and shoreline |
| 162 | Gremlins | physical-motif-adaptation | universe-lore | physical-concert-lights | theater | Kingston Falls movie theater and department-store street |
| 163 | Guilty Gear | authored-location-adaptation | universe-default | universe-default:Guilty Gear | Feuillage des jardins devant les bâtiments d’Illyria. | L’oro Di Illyria — jardins |
| 164 | Guitar Hero | physical-motif-adaptation | universe-lore | physical-concert-lights | concert | Guitar Hero III Lou's Inferno concert stage |
| 165 | Gunnm | physical-motif-adaptation | universe-lore | physical-lab-monitors | circuit | Motorball circuit beneath Zalem with Scrapyard maintenance pits |
| 166 | Guns N Roses | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | Use Your Illusion stadium stage and Paradise City industrial yard |
| 167 | Gushing over Magical Girls — Safe Adult Reinterpretation | authored-location-adaptation | universe-default | universe-default:Gushing over Magical Girls — Safe Adult Reinterpretation | Lueurs de mana rose pâle sur les constructions abstraites de la salle sûre, sans sexualisation | Tres Magia — salle d’entraînement de la réinterprétation adulte du projet |
| 168 | H2G2 | physical-motif-adaptation | universe-lore | physical-dust | bridge | Heart of Gold bridge during an improbability event |
| 169 | HAWKEN | authored-location-adaptation | universe-default | universe-default:HAWKEN | Poussière beige entre les ruines des tours industrielles du Bazaar | Illal — Bazaar |
| 170 | HITMAN — World of Assassination | authored-location-adaptation | universe-default | universe-default:HITMAN — World of Assassination | Projecteurs blancs ambrés derrière la passerelle du défilé parisien | Paris — défilé du palais de la mode |
| 171 | Half-Life | authored-location-adaptation | universe-default | universe-default:Half-Life | Vapeur de refroidissement dans les conduits accidentés. | Black Mesa — couloir des laboratoires |
| 172 | Halloween | authored-location-adaptation | universe-default | universe-default:Halloween | Feuilles orange fanées entre les maisons de Haddonfield, sans slasher ajouté au décor | Haddonfield — rue automnale de la continuité 2018 |
| 173 | Halo | authored-location-adaptation | universe-default | universe-default:Halo | Étoiles lentes au-dessus du relief nocturne de l’anneau. | Installation 04 — canyon de nuit |
| 174 | Happy Wheels | authored-location-adaptation | universe-default | universe-default:Happy Wheels | Poussière de la piste autour de la ligne de départ adaptée. | Course communautaire — ligne de départ |
| 175 | Harry Potter | authored-location-adaptation | universe-default | universe-default:Harry Potter | Lueurs des bougies suspendues de la Grande Salle. | Poudlard — Grande Salle |
| 176 | Haydee — Safe Adaptation | authored-location-adaptation | universe-default | universe-default:Haydee — Safe Adaptation | Éclairage vert pâle des grilles d’accès et des murs blancs de la Green Zone | Green Zone — accès industriel, adaptation entièrement vêtue du projet |
| 177 | Hazbin Hotel | physical-motif-adaptation | universe-lore | physical-city-lights | City | Hazbin Hotel lobby opening onto Pentagram City |
| 178 | Heart Eyes | authored-location-adaptation | universe-default | universe-default:Heart Eyes | Balayage doux du projecteur du drive-in et lumières de l’écran. | Seattle — drive-in nocturne |
| 179 | Heart of Darkness | authored-location-adaptation | universe-default | universe-default:Heart of Darkness | Spores bleutées dans la jungle extraterrestre sous le ciel d’éclipse | Darklands — village des Amigos pendant l’éclipse |
| 180 | Heavy Metal 2000 | physical-motif-adaptation | universe-lore | physical-lab-monitors | industrial | Eden industrial wasteland and Odin's mining fortress approach |
| 181 | Helios 56 | authored-location-adaptation | universe-default | universe-default:Helios 56 | Pulsation des instruments de contrôle du cœur HELIO-1. | Cœur de HELIO-1 |
| 182 | Hell House LLC | physical-motif-adaptation | universe-lore | physical-dust | basement | Abaddon Hotel basement corridor and dining-room route |
| 183 | Hellblade: Senua’s Sacrifice | authored-location-adaptation | universe-default | universe-default:Hellblade: Senua’s Sacrifice | Brume bleu gris derrière les épaves du rivage nordique | Rivage des épaves avant Helheim |
| 184 | Hello Neighbor | authored-location-adaptation | universe-default | universe-default:Hello Neighbor | Voyants jaune rouge des appareils de surveillance dans la maison inclinée | Maison de Peterson — couloir de surveillance |
| 185 | Hellraiser | authored-location-adaptation | universe-default | universe-default:Hellraiser | Poussière suspendue derrière les poutres du grenier. | Maison Cotton — grenier |
| 186 | Helluva Boss | authored-location-adaptation | universe-default | universe-default:Helluva Boss | Néons rouge rose derrière les murs sombres du bureau de l’I.M.P. | I.M.P. — bureau |
| 187 | Hexen | authored-location-adaptation | universe-default | universe-default:Hexen | Lueur verte douce entre les pierres moussues et les mécanismes des Seven Portals | Cronos — hub des Seven Portals |
| 188 | Home Alone | authored-location-adaptation | universe-default | universe-default:Home Alone | Neige légère devant les fenêtres de la maison. | Maison McCallister — jardin de Noël |
| 189 | Horizon Zero Dawn | authored-location-adaptation | universe-default | universe-default:Horizon Zero Dawn | Pollen ocre des plantes du relief autour de Meridian et de la Flèche | Meridian — pied de la Flèche |
| 190 | Hoshi | physical-motif-adaptation | universe-lore | physical-rain | pluie | Paris rain street and intimate Coeur Parapluie theater |
| 191 | Hotline Miami | authored-location-adaptation | universe-default | universe-default:Hotline Miami | Lumière cyan des enseignes qui traverse les fenêtres de l’immeuble | Miami 1989 — immeuble aux tapis néon |
| 192 | House of 1000 Corpses | physical-motif-adaptation | universe-lore | physical-dust | Museum | Captain Spaulding's Museum of Monsters and Madmen and Firefly house |
| 193 | House of the Dead | authored-location-adaptation | universe-lore | curien-laboratory | Curien | Curien Mansion entrance hall and laboratory route |
| 194 | House of the Dead 2 | physical-motif-adaptation | universe-lore | physical-water-ripples | canal | Venetian canal plaza on the Goldman rescue route |
| 195 | House of the Dead 3 | authored-location-adaptation | universe-lore | curien-laboratory | EFI | EFI Research Facility lobby and Wheel of Fate chamber |
| 196 | How to Make a Monster | physical-motif-adaptation | universe-lore | physical-concert-lights | studio | Clayton Software motion-capture game studio |
| 197 | Ice Age | authored-location-adaptation | universe-default | universe-default:Ice Age | Neige fine devant les congères du trajet. | Plaine de la migration glaciaire |
| 198 | Ilyr Concordat | authored-location-adaptation | universe-default | universe-default:Ilyr Concordat | Étoiles au-delà des baies de l’assemblée en orbite. | Assemblée orbitale d’Ilyr |
| 199 | Imperium Aeternum | authored-location-adaptation | universe-default | universe-default:Imperium Aeternum | Braises du foyer fictif dans l’enceinte du siège. | Siège du Feu Vestal |
| 200 | Indila | physical-motif-adaptation | universe-lore | physical-city-lights | boulevard | Paris storm boulevard inspired by Derniere Danse |
| 201 | Infernum: Nine Pits | authored-location-adaptation | universe-default | universe-default:Infernum: Nine Pits | Braises discrètes des étals de contrats brûlants. | Marché des Contrats Brûlants |
| 202 | Inside Out | authored-location-adaptation | universe-default | universe-default:Inside Out | Lumières de la console et des étagères de souvenirs. | Quartier Général — console des émotions |
| 203 | Insidious | authored-location-adaptation | universe-default | universe-default:Insidious | Brume basse au seuil de la maison dans le Further. | Further — seuil de la maison Lambert |
| 204 | Interstellar Marines | authored-location-adaptation | universe-default | universe-default:Interstellar Marines | Voyants bleu acier du terrain d’évaluation The Vault | The Vault — parcours de cibles |
| 205 | Inuyashiki | physical-motif-adaptation | universe-lore | physical-city-lights | Tokyo | Shinjuku aerial battle over Tokyo streets |
| 206 | Invincible | authored-location-adaptation | universe-default | universe-default:Invincible | Lueurs jaune bleu des fenêtres du panorama urbain animé | Chicago — panorama des toits |
| 207 | Iron Sky | physical-motif-adaptation | universe-lore | physical-lab-monitors | hangar | Schwarze Sonne moonbase hangar and Gotterdammerung launch rail |
| 208 | Iron Tempest | authored-location-adaptation | universe-default | universe-default:Iron Tempest | Poussière de cendre dans les tranchées, derrière les abris. | Tranchées de la Ligne-Cendre |
| 209 | Italian Brainrot | authored-location-adaptation | universe-default | universe-default:Italian Brainrot | Poussière claire au pied des accessoires hybrides de la place de remix, adaptation originale déclarée | Piazza del Remix — scène originale de remix du projet |
| 210 | Jersey Devil | authored-location-adaptation | universe-default | universe-default:Jersey Devil | Lueur orange de la décoration de citrouilles dans les salles du musée | Jersey City — musée nocturne |
| 211 | Jet Set Radio | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | Shibuya-cho bus terminal and rooftops |
| 212 | JoJo's Bizarre Adventure | physical-motif-adaptation | universe-lore | physical-dust | stone | DIO mansion Cairo, Battle Tendency volcano and Rome Colosseum Requiem as separate packs |
| 213 | John Wick | authored-location-adaptation | universe-default | universe-default:John Wick | Reflets bleus du bassin du Red Circle. | Red Circle — galerie du bassin |
| 214 | Joker New 52 | physical-motif-adaptation | universe-lore | physical-city-lights | street | Jokerized Gotham streets around the parade route and ruined GCPD barricades |
| 215 | Kaamelott | authored-location-adaptation | universe-lore | kaamelott-arches | Table Ronde | Salle de la Table Ronde du chateau de Kaamelott, cour visible par les arches |
| 216 | Karune Cal | physical-motif-adaptation | universe-lore | physical-lab-monitors | industrial | Calne Ca Bacterial Contamination industrial void |
| 217 | Kazaam | physical-motif-adaptation | universe-lore | physical-concert-lights | theater | Abandoned city theater and rooftop hideout |
| 218 | Kemet: The Devoured Sun | authored-location-adaptation | universe-default | universe-default:Kemet: The Devoured Sun | Lueurs des lampes de la salle du jugement fictif. | Salle des Deux Vérités |
| 219 | Kill Bill | authored-location-adaptation | universe-default | universe-default:Kill Bill | Neige douce au-dessus du jardin japonais. | House of Blue Leaves — jardin de neige |
| 220 | Killer Instinct | authored-location-adaptation | universe-default | universe-default:Killer Instinct | Lueur ambrée des braseros dans le sanctuaire du Tiger Lair | Tiger Lair — sanctuaire de Jago, continuité 2013 |
| 221 | Killer Tomatoes from Outer Space | physical-motif-adaptation | universe-lore | physical-lab-monitors | laboratory | San Diego government laboratory and tomato siege street |
| 222 | Killing Floor 2 | authored-location-adaptation | universe-default | universe-default:Killing Floor 2 | Braises atténuées des foyers lointains de Burning Paris | Burning Paris — rue hors de la zone de combat |
| 223 | Killzone | physical-motif-adaptation | universe-lore | physical-city-lights | City | Pyrrhus City boulevard and ISA landing sector |
| 224 | Korn | physical-motif-adaptation | universe-lore | physical-dust | playground | Follow the Leader playground and arena pit |
| 225 | Kung Pow | physical-motif-adaptation | universe-lore | physical-water-ripples | Water | Waterfall training field and Evil Council temple yard |
| 226 | Kyary Pamyu Pamyu | physical-motif-adaptation | universe-lore | physical-dust | room | PONPONPON pastel room and surreal corridor |
| 227 | La Casa de Papel | physical-motif-adaptation | universe-lore | physical-dust | hall | Royal Mint printing hall and vault corridor |
| 228 | La Cite de la Peur | physical-motif-adaptation | universe-lore | physical-dust | hall | Palais des Festivals projection hall and Croisette steps |
| 229 | La Petite Histoire de France | authored-location-adaptation | universe-default | universe-default:La Petite Histoire de France | Lueurs des chandelles derrière les registres et les tables de la taverne | Taverne de 1430 — salle des commandes |
| 230 | Lady Gaga | physical-motif-adaptation | universe-lore | physical-city-lights | plaza | Chromatica desert citadel and Rain on Me plaza |
| 231 | Ladybaby | physical-motif-adaptation | universe-lore | physical-concert-lights | performance | Nippon Manju market-street performance set |
| 232 | Land of the Dead | authored-location-adaptation | universe-default | universe-default:Land of the Dead | Lumières lointaines des étages de Fiddler’s Green. | Pittsburgh — pied de Fiddler’s Green |
| 233 | Last Action Hero | authored-location-adaptation | universe-default | universe-default:Last Action Hero | Poussière dans le faisceau mécanique du projecteur. | Cinéma de Nick — cabine de projection |
| 234 | Le Cinquième Element | authored-location-adaptation | universe-default | universe-default:Le Cinquième Element | Étoiles derrière les baies du paquebot spatial. | Fhloston Paradise — salon panoramique |
| 235 | Le Donjon de Naheulbeuk | authored-location-adaptation | universe-default | universe-default:Le Donjon de Naheulbeuk | Lueurs des torches dans les couloirs du donjon. | Donjon de Zangdar — couloirs piégés |
| 236 | Left 4 Dead | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | No Mercy hospital rooftop finale |
| 237 | Legacy of Kain | physical-motif-adaptation | universe-lore | physical-dust | Pillar | Pillars of Nosgoth sanctuary in the corrupted future |
| 238 | Les Aventures de Saturnin | physical-motif-adaptation | universe-lore | physical-snow | alpine | Saturnin miniature village, Professor Popof workshop and alpine ski set |
| 239 | Les Aventuriers du Survivaure | authored-location-adaptation | universe-default | universe-default:Les Aventuriers du Survivaure | Voyants bleus des consoles du pont principal. | NHL2987 Survivaure — pont principal |
| 240 | Les Chevaliers du Fiel | physical-motif-adaptation | universe-lore | physical-dust | Bureau | Bureau municipal et cour de depot des Municipaux |
| 241 | Les Inconnus | physical-motif-adaptation | universe-lore | physical-concert-lights | studio | La Tele des Inconnus multi-set television studio |
| 242 | Les Kassos | authored-location-adaptation | universe-default | universe-default:Les Kassos | Poussière claire dans la lumière des archives et des chaises en plastique du bureau | Salle d’attente — bureau de médiation |
| 243 | Les Tuche | physical-motif-adaptation | universe-lore | physical-city-lights | street | Maison des Tuche a Bouzolles and football-yard street |
| 244 | Les Visiteurs | physical-motif-adaptation | universe-lore | physical-foliage | forest | Chateau de Montmirail great hall and forest witch hut threshold |
| 245 | Les Visiteurs du Futur | physical-motif-adaptation | universe-lore | physical-dust | headquarters | Brigade Temporelle headquarters and devastated future-Paris portal |
| 246 | Les Zinzins de l’espace | authored-location-adaptation | universe-default | universe-default:Les Zinzins de l’espace | Lueurs lilas des pièces du vaisseau cachées dans le grenier de la maison | Maison des Zinzins — grenier du vaisseau |
| 247 | Like a Dragon | authored-location-adaptation | universe-default | universe-default:Like a Dragon | Néons rouges de la vie nocturne de Kamurocho au loin sous le toit | Kamurocho — toit de la Millennium Tower |
| 248 | Lil Nas X | physical-motif-adaptation | universe-lore | physical-dust | court | Montero celestial court and underworld throne approach |
| 249 | Lilo & Stitch | authored-location-adaptation | universe-default | universe-default:Lilo & Stitch | Reflets des vagues sur la plage de Kauai. | Kauai — plage près de la maison |
| 250 | Linkin Park | physical-motif-adaptation | universe-lore | physical-concert-lights | performance | In the End desert monument and Meteora industrial performance room |
| 251 | Little Big | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | Skibidi house set and UNO neon game-show stage |
| 252 | LittleBigPlanet | physical-motif-adaptation | universe-lore | physical-foliage | Garden | The Gardens cardboard theater and pod route |
| 253 | Lost Planet 2 | physical-motif-adaptation | universe-lore | physical-foliage | jungle | Episode 1 jungle railway and mining facility |
| 254 | M3GAN | physical-motif-adaptation | universe-lore | physical-lab-monitors | research | Funki research demonstration room and Gemma's workshop |
| 255 | MDK | authored-location-adaptation | universe-default | universe-default:MDK | Glissements lumineux bleu argent à l’extérieur de la station Jim Dandy | Jim Dandy — fenêtre sur les mégastructures extraterrestres |
| 256 | Mad Max | authored-location-adaptation | universe-default | universe-default:Mad Max | Vent de poussière autour des clôtures de la raffinerie. | Raffinerie — piste extérieure |
| 257 | Mad Max: Fury Road | authored-location-adaptation | universe-default | universe-default:Mad Max: Fury Road | Traînées de sable derrière la piste du War Rig. | War Rig — plaine de la poursuite |
| 258 | MagiC JacK | physical-motif-adaptation | universe-lore | physical-concert-lights | studio | Minute Sapiens tribunal, social-mirror studio and Max Rage concert indictment |
| 259 | Magicka | authored-location-adaptation | universe-default | universe-default:Magicka | Flammes douces des éclairages de la cour d’Aldrheim, aucune incantation ajoutée | Château d’Aldrheim — cour des magiciens |
| 260 | Malcolm in the Middle | physical-motif-adaptation | universe-lore | physical-dust | house | Wilkerson family house, living room and backyard |
| 261 | Man with a Mission | physical-motif-adaptation | universe-lore | physical-concert-lights | video wall | MAN WITH A MISSION live arena with mission-control video wall |
| 262 | Mandate of Nine Heavens | authored-location-adaptation | universe-default | universe-default:Mandate of Nine Heavens | Variation douce des lanternes déjà décrites par la cité fictive. | Cité des Lanternes sans Ombre |
| 263 | Marathon | authored-location-adaptation | universe-default | universe-default:Marathon | Balayage vert lent des terminaux UESC dans les coursives du vaisseau | UESC Marathon — coursives aux terminaux |
| 264 | Marble Hornets | authored-location-adaptation | universe-default | universe-default:Marble Hornets | Feuillage faible dans le sous-bois de Rosswood. | Rosswood Park — sentier d’enquête |
| 265 | Marilyn Manson | physical-motif-adaptation | universe-lore | physical-concert-lights | studio | Mechanical Animals sterile glam television studio |
| 266 | Mars Attacks | physical-motif-adaptation | universe-lore | physical-dust | lawn | United States Capitol lawn and Las Vegas hotel collapse |
| 267 | Marvel Zombies — MCU Animation | authored-location-adaptation | universe-default | universe-default:Marvel Zombies — MCU Animation | Lueurs vert gris lointaines de la ville animée en ruine, sans corps ajouté au fond | Manhattan — route d’évacuation animée |
| 268 | Mashle | physical-motif-adaptation | universe-lore | physical-dust | stone | Easton Magic Academy and Divine Visionary arena |
| 269 | Mass Effect | authored-location-adaptation | universe-default | universe-default:Mass Effect | Petits reflets dans les bassins du Presidium. | Citadelle — bassins du Presidium |
| 270 | Max Payne 2 | authored-location-adaptation | universe-default | universe-default:Max Payne 2 | Pluie gris bleu derrière les fenêtres de l’hôpital de The Fall of Max Payne | New York — fenêtres de l’hôpital noir |
| 271 | MediEvil | authored-location-adaptation | universe-default | universe-default:MediEvil | Brume verte sous la lune entre les pierres gothiques inclinées du cimetière | Gallowmere — cimetière |
| 272 | Meet the Feebles | physical-motif-adaptation | universe-lore | physical-concert-lights | Theatre | Feebles Variety Theatre backstage and stage wings |
| 273 | Men in Black | authored-location-adaptation | universe-default | universe-default:Men in Black | Voyants et écrans des postes de contrôle du MIB. | MIB — salle de contrôle |
| 274 | Meridian Clockwork | authored-location-adaptation | universe-default | universe-default:Meridian Clockwork | Rotation lente des cadrans dominant la place. | Place aux Mille Cadrans |
| 275 | Metal Gear | authored-location-adaptation | universe-default | universe-default:Metal Gear | Neige froide devant les installations de l’héliport. | Shadow Moses — héliport |
| 276 | Metal Gear Rising | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | World Marshal headquarters rooftop in Denver |
| 277 | Metal Slug | authored-location-adaptation | universe-default | universe-default:Metal Slug | Sable beige au ras des reliefs du front désertique SNK, sans danger additionnel | Front rebelle désertique — route des véhicules |
| 278 | Metal: Hellsinger | authored-location-adaptation | universe-default | universe-default:Metal: Hellsinger | Braises rouges le long des reliefs de basalte derrière l’arène de Sheol | Sheol — arène du Red Judge |
| 279 | Michael Jackson | physical-motif-adaptation | universe-lore | physical-concert-lights | Theater | Thriller Palace Theater street and graveyard set |
| 280 | Minecraft | authored-location-adaptation | universe-default | universe-default:Minecraft | Feuilles carrées adaptées à la lisière de chênes. | Plaine — lisière de chênes |
| 281 | Minions | authored-location-adaptation | universe-default | universe-default:Minions | Voyants de l’atelier de gadgets de Herb. | Repaire de Scarlet — atelier de gadgets |
| 282 | Mirror's Edge | authored-location-adaptation | universe-default | universe-default:Mirror's Edge | Lueurs rouges discrètes de signalisation au fond des surfaces blanches des toits | Ville de 2008 — parcours des toits vers The Shard |
| 283 | Moonwalker | physical-motif-adaptation | universe-lore | physical-concert-lights | Club 30 | Club 30 speakeasy from Smooth Criminal |
| 284 | Mr. Bean | authored-location-adaptation | universe-default | universe-default:Mr. Bean | Poussière ténue dans les rayons des fenêtres de la salle. | Salle d’examen de Mr. Bean |
| 285 | Murder Drones | authored-location-adaptation | universe-default | universe-default:Murder Drones | Neige bleu gris légère devant les tours noires de Copper 9 | Copper 9 — colonie des Worker Drones |
| 286 | Mythos Primordia | authored-location-adaptation | universe-default | universe-default:Mythos Primordia | Reflets calmes sur la mer du monde primordial original. | Mer Sans Rivage |
| 287 | Méridien Creux | authored-location-adaptation | universe-lore | meridien-clockwork | Cadran | Grand Cadran district surrounding the Chronobank and its seized-hour foundry |
| 288 | Naruto | physical-motif-adaptation | universe-lore | physical-water-ripples | river | Chunin Exams Forest of Death, Konoha rooftops and Valley of the End |
| 289 | Naruto Shippuden | physical-motif-adaptation | universe-lore | physical-dust | earth | Fourth Shinobi World War front, Amegakure and Kamui dimension |
| 290 | Natural Selection 2 | authored-location-adaptation | universe-default | universe-default:Natural Selection 2 | Voyants bleus des équipements marines dans le secteur industriel Tram | Tram — départ des Marines |
| 291 | Necronomicon | physical-motif-adaptation | universe-lore | physical-dust | library | Miskatonic library archive framing the 1993 anthology portals |
| 292 | Negima | authored-location-adaptation | universe-default | universe-default:Negima | Feuilles tombant du feuillage de l’Arbre-Monde. | Mahora — pied de l’Arbre-Monde |
| 293 | Nemesis — Awaken Realms | authored-location-adaptation | universe-default | universe-default:Nemesis — Awaken Realms | Vapeur froide des unités d’hibernation dans les coursives du vaisseau défaillant | Nemesis — Hibernatorium |
| 294 | Neon Genesis Evangelion | physical-motif-adaptation | universe-lore | physical-lab-monitors | armor | Tokyo-3, Geofront and Terminal Dogma defense sectors |
| 295 | Neon Requiem | authored-location-adaptation | universe-lore | neon-requiem-rainline | Nadir | Nadir-9 vertical megacity, from the Rainline Bazaar to the Helix Memory Vault and OMNIA Cathedral |
| 296 | Nexus de Convergence | physical-motif-adaptation | universe-lore | physical-city-lights | City | Mosaic City Central Atrium and A.R.C.A. anchor infrastructure |
| 297 | Nicolas et Pimprenelle | authored-location-adaptation | universe-default | universe-default:Nicolas et Pimprenelle | Étoiles douces dans le ciel nocturne au-dessus du balcon. | Balcon de Nicolas et Pimprenelle |
| 298 | NieR | authored-location-adaptation | universe-default | universe-default:NieR | Pollen pâle de la végétation ayant recouvert le béton du camp | Ruines de la ville — camp de la Résistance |
| 299 | Night of the Living Dead | authored-location-adaptation | universe-default | universe-default:Night of the Living Dead | Poussière du bois et des rideaux dans le salon barricadé. | Ferme barricadée — salon |
| 300 | Nightwish | physical-motif-adaptation | universe-lore | physical-snow | winter | Imaginaerum winter circus and memory carousel |
| 301 | Nine Realms: Last Twilight | authored-location-adaptation | universe-default | universe-default:Nine Realms: Last Twilight | Lueurs colorées adaptées aux fragments du pont arc-en-ciel. | Ruines du Bifröst |
| 302 | No Man's Sky | authored-location-adaptation | universe-default | universe-default:No Man's Sky | Aurore turquoise discrète au-dessus du panorama de relevé de la planète | Planète paradisiaque — parcours de relevé du Voyageur |
| 303 | Noelle Perna | physical-motif-adaptation | universe-lore | physical-concert-lights | scene | Bar des Oiseaux and petite scene nicoise de Mado |
| 304 | Noob | physical-motif-adaptation | universe-lore | physical-city-lights | plaza | Centralis imperial plaza and Guild Noob meeting route |
| 305 | Nyan Cat | authored-location-adaptation | universe-default | universe-default:Nyan Cat | Étoiles carrées du ciel bleu de l’animation. | Nyan Cat — ciel pixelisé |
| 306 | Oddworld | physical-motif-adaptation | universe-lore | physical-dust | pens | RuptureFarms meat-processing line and employee pens |
| 307 | Oggy et les Cafards | authored-location-adaptation | universe-default | universe-default:Oggy et les Cafards | Vapeur blanche légère près de la cuisine et des accessoires cartoon, sans personnage ajouté | Maison d’Oggy — cuisine |
| 308 | Oliver Tree | physical-motif-adaptation | universe-lore | physical-dust | ramp | Hurt demolition lot and giant kick-scooter test ramp |
| 309 | One Punch Man | physical-motif-adaptation | universe-lore | physical-lab-monitors | alloy | City A Hero Association and Monster Association underground |
| 310 | Onechanbara | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | Zombie-infested Shinjuku rooftop and subway entrance |
| 311 | Overgrowth | authored-location-adaptation | universe-default | universe-default:Overgrowth | Feuilles brunes claires près du sentier du village White Flags | White Flags Village — sentier entre les îles rocheuses |
| 312 | Overlord Anime | authored-location-adaptation | universe-lore | nazarick-throne | Throne | Throne Room of Nazarick and Lemegeton approach |
| 313 | PSY | physical-motif-adaptation | universe-lore | physical-dust | floor | Gangnam Style stable, parking garage and blue dance floor |
| 314 | PUBG | authored-location-adaptation | universe-default | universe-default:PUBG | Feuilles olive au fond de la piste d’entraînement et des cibles inertes | Erangel — terrain d’entraînement, parcours non combattant du projet |
| 315 | Palworld | authored-location-adaptation | universe-default | universe-default:Palworld | Pollen vert doré dans les herbes des Windswept Hills | Windswept Hills — prairie du départ |
| 316 | Parasite Eve | physical-motif-adaptation | universe-lore | physical-embers | combustion | Carnegie Hall stage after the opera combustion |
| 317 | Parasyte | physical-motif-adaptation | universe-lore | physical-embers | scorched | East Fukuyama school, city hall and Gotou forest pursuit |
| 318 | Payday | authored-location-adaptation | universe-default | universe-default:Payday | Reflets urbains derrière les vitrines de la banque. | First World Bank — façade sur rue |
| 319 | Pee-wee | physical-motif-adaptation | universe-lore | physical-dust | house | Pee-wee's Playhouse interior with bicycle workshop exit |
| 320 | Peepoodo — Safe Educational Adaptation | authored-location-adaptation | universe-default | universe-default:Peepoodo — Safe Educational Adaptation | Points de lumière pastel au bord des cartes d’expression et du tableau de classe | Classe des émotions — adaptation éducative sûre du projet |
| 321 | Phantasmagoria | authored-location-adaptation | universe-default | universe-default:Phantasmagoria | Poussière ambrée dans les rayons de lumière du manoir, sans représentation d’acteur ou de violence | Manoir Carnovasch — couloir de recherche |
| 322 | Pingu | authored-location-adaptation | universe-lore | pingu-snow | igloo | Pingu's igloo village and fishing-hole route |
| 323 | Pirates of the Caribbean | authored-location-adaptation | universe-default | universe-default:Pirates of the Caribbean | Reflets d’eau sous les quais de Port Royal. | Port Royal — quais sur la baie |
| 324 | Planete Hurlante | physical-motif-adaptation | universe-lore | physical-dust | bunker | New Alamo bunker perimeter and radioactive battlefield |
| 325 | Plants vs. Zombies | authored-location-adaptation | universe-default | universe-default:Plants vs. Zombies | Feuilles du jardin derrière les rangées de plantes. | Maison — pelouse de jour |
| 326 | Police Squad | physical-motif-adaptation | universe-lore | physical-dust | room | Police Squad precinct bullpen and evidence room |
| 327 | Poppy Playtime | authored-location-adaptation | universe-default | universe-default:Poppy Playtime | Voyants des postes de fabrication Make-a-Friend. | Playtime Co. — Make-a-Friend |
| 328 | Portal | authored-location-adaptation | universe-default | universe-default:Portal | Voyants de circuits et de baie d’observation Aperture. | Aperture Science — chambre d’essai |
| 329 | Postal | authored-location-adaptation | universe-default | universe-default:Postal | Poussière beige sur les abords de la route de Paradise, adaptation cartoon du projet | Paradise — parcours des courses quotidiennes |
| 330 | Predator | authored-location-adaptation | universe-default | universe-default:Predator | Feuilles soulevées dans le sous-bois de la patrouille. | Jungle de la mission de Dutch |
| 331 | Predator 2 | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | Los Angeles slaughterhouse freezer and rooftop skyline |
| 332 | Predator: Badlands | physical-motif-adaptation | universe-lore | physical-dust | wreck | Genna hostile biome and Weyland-Yutani wreck route |
| 333 | Predator: Killer of Killers | physical-motif-adaptation | universe-lore | physical-lab-monitors | hangar | Yautja mothership trophy arena linking Viking coast, Sengoku castle and WWII hangar |
| 334 | Predators | physical-motif-adaptation | universe-lore | physical-foliage | jungle | Game Preserve Planet jungle, totem camp and distant alien sky |
| 335 | Prey | physical-motif-adaptation | universe-lore | physical-foliage | forest | Great Plains burned forest and mud-bog trap in 1719 |
| 336 | Prey (2006) | authored-location-adaptation | universe-default | universe-default:Prey (2006) | Tracés bleus des rails de gravité sur les parois biomécaniques de la Sphere | The Sphere — chambre des passerelles gravitationnelles |
| 337 | Prometheus | physical-motif-adaptation | universe-lore | physical-dust | Pyramid | LV-223 Pyramid Dome, Ampule Room and giant head chamber |
| 338 | Psycho-Pass | physical-motif-adaptation | universe-lore | physical-lab-monitors | factory | Public Safety Bureau, Hyper-Oats factory and SEAUn urban grid |
| 339 | Puppet Master | physical-motif-adaptation | universe-lore | physical-dust | corridor | Bodega Bay Inn corridor and Toulon's hidden workshop |
| 340 | Putt-Putt | authored-location-adaptation | universe-default | universe-default:Putt-Putt | Feuilles vert tendre au bord de la route illustrée de Cartown | Cartown — carrefour vers le zoo |
| 341 | Quake | authored-location-adaptation | universe-default | universe-default:Quake | Petites braises orange au-dessus de la lave derrière les dalles brunes du complexe | Slipgate Complex — couloir des bassins de lave |
| 342 | Queen Bee | physical-motif-adaptation | universe-lore | physical-concert-lights | theater | Mephisto theater stage and backstage mirror corridor |
| 343 | R.E.P.O. | authored-location-adaptation | universe-default | universe-default:R.E.P.O. | Petits voyants vert gris autour des accessoires fragiles et des équipements d’extraction | Service Station — zone de récupération |
| 344 | REC | physical-motif-adaptation | universe-lore | physical-dust | apartment | Rambla de Catalunya apartment stairwell and attic |
| 345 | RRRrrrr!!! | physical-motif-adaptation | universe-lore | physical-dust | Village | Village des Cheveux Propres and first-crime clearing |
| 346 | Rambo | authored-location-adaptation | universe-default | universe-default:Rambo | Feuilles et aiguilles soulevées dans le sous-bois de Hope. | Forêt de Hope — versant boisé |
| 347 | Rammstein | authored-location-adaptation | universe-lore | rammstein-feuerzone | stadium | Rammstein stadium tower stage and Feuerzone |
| 348 | Rayman | physical-motif-adaptation | universe-lore | physical-foliage | Forest | Dream Forest Pink Plant Woods and Moskito route |
| 349 | Re-Animator | physical-motif-adaptation | universe-lore | physical-lab-monitors | laboratory | Miskatonic Medical School morgue laboratory |
| 350 | Red Faction | authored-location-adaptation | universe-default | universe-default:Red Faction | Poussière rouge claire dans le plan éloigné des galeries d’Ultor | Mars — mine Ultor |
| 351 | Redneck Rampage | authored-location-adaptation | universe-default | universe-default:Redneck Rampage | Poussière ocre près de la grange et des clôtures de la ferme de Hickston | Hickston — cour de la ferme |
| 352 | Reflets d’Acide | authored-location-adaptation | universe-default | universe-default:Reflets d’Acide | Petites braises venant des profondeurs, derrière les ponts du gouffre. | Gouffre de Mortepierre |
| 353 | Remember Me | authored-location-adaptation | universe-default | universe-default:Remember Me | Tracés bleu pâle des interfaces Sensen au loin sur les bâtiments usés | Neo-Paris 2084 — toits autour des installations Memorize |
| 354 | Repo! The Genetic Opera | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | Genetic Opera stage inside GeneCo tower |
| 355 | Resident Evil | authored-location-adaptation | universe-default | universe-default:Resident Evil | Scintillement discret des lumières du grand hall. | Manoir Spencer — hall central |
| 356 | Richard au pays des livres magiques | physical-motif-adaptation | universe-lore | physical-dust | Library | Library rotunda where Adventure, Fantasy and Horror wings converge |
| 357 | Rick & Morty | authored-location-adaptation | universe-default | universe-default:Rick & Morty | Voyants des appareils de laboratoire sur l’établi. | Maison Smith — garage de Rick |
| 358 | Rick Astley | authored-location-adaptation | universe-default | universe-default:Rick Astley | Lumière chaude des fenêtres et du plateau du clip de 1987. | Never Gonna Give You Up — salle de danse |
| 359 | Ristar | physical-motif-adaptation | universe-lore | physical-foliage | forest | Planet Flora's Neer forest and star-handle route |
| 360 | Rival Schools | authored-location-adaptation | universe-default | universe-default:Rival Schools | Feuilles jaunes légères sur le côté de la cour de Taiyo High | Taiyo High — cour du tournoi |
| 361 | Rob Zombie | physical-motif-adaptation | universe-lore | physical-lab-monitors | industrial | Dragula tunnel, industrial horror carnival and Munster-style hot-rod route |
| 362 | RoboCop | authored-location-adaptation | universe-default | universe-default:RoboCop | Poussière métallique dans la nef de l’aciérie. | Old Detroit — aciérie abandonnée |
| 363 | Rock of Ages | authored-location-adaptation | universe-default | universe-default:Rock of Ages | Poussière beige derrière les décors peints du parcours grec | Parcours grec de rocher — paysage en collage du projet |
| 364 | Rocky | authored-location-adaptation | universe-default | universe-default:Rocky | Projecteurs du ring et lueurs de la salle du Spectrum. | Philadelphia Spectrum — ring de championnat |
| 365 | Rocky Horror Picture Show | physical-motif-adaptation | universe-lore | physical-concert-lights | floor-show | Frankenstein Place laboratory and floor-show theater |
| 366 | Roger Rabbit | physical-motif-adaptation | universe-lore | physical-city-lights | town | Acme warehouse threshold opening into Toontown |
| 367 | Rosario + Vampire | authored-location-adaptation | universe-default | universe-default:Rosario + Vampire | Brume légère entre le chemin et les bâtiments du campus. | Académie Yōkai — chemin du campus |
| 368 | Rubber | physical-motif-adaptation | universe-lore | physical-city-lights | road | Mojave motel parking lot and desert road |
| 369 | Rugrats | physical-motif-adaptation | universe-lore | physical-dust | yard | Pickles backyard transformed by baby-scale imagination |
| 370 | Rurouni Kenshin | physical-motif-adaptation | universe-lore | physical-embers | charred | Meiji Kyoto, Kamiya dojo and Shishio ironclad |
| 371 | SCP Foundation | physical-motif-adaptation | universe-lore | physical-lab-monitors | containment | Original modular containment wing compatible with Site-19 facility conventions; no single canonical visual layout is asserted |
| 372 | SUPERHOT | authored-location-adaptation | universe-default | universe-default:SUPERHOT | Lueurs grises claires et tracés rouges discrets dans l’espace blanc facetté | Séquence de cibles — couloir blanc abstrait |
| 373 | Sam & Max | authored-location-adaptation | universe-default | universe-default:Sam & Max | Lumières bleu beige de la rue derrière le bureau de Sam et Max | Bureau de la Freelance Police — fenêtre de rue |
| 374 | Samantha Oups! | physical-motif-adaptation | universe-lore | physical-dust | salon | Appartement de Samantha, salon et entree |
| 375 | Sanctum | authored-location-adaptation | universe-default | universe-default:Sanctum | Circulation turquoise dans le Core à oxygène derrière les murs de défense | The Facility — approche de The Gate |
| 376 | Sartorius Stedim Biotech | authored-location-adaptation | universe-default | universe-default:Sartorius Stedim Biotech | Voyants des instruments de procédé, sans poussière ajoutée dans la salle propre. | Aubagne — ligne de production en salle propre |
| 377 | Sausage Party | physical-motif-adaptation | universe-lore | physical-dust | aisle | Shopwell's central aisle and loading dock |
| 378 | Saw | authored-location-adaptation | universe-default | universe-default:Saw | Scintillement des néons pratiques au-dessus du carrelage. | Salle de bains industrielle — premier test |
| 379 | Scary Movie | authored-location-adaptation | universe-default | universe-default:Scary Movie | Scintillement discret des lampes de la fête. | Maison de Cindy — salon de la fête |
| 380 | Seaman | physical-motif-adaptation | universe-lore | physical-dust | room | Seaman aquarium on the caretaker's living-room table |
| 381 | Secret of Monkey Island | physical-motif-adaptation | universe-lore | physical-city-lights | street | Melee Island Scumm Bar and dock street |
| 382 | Serious Sam | authored-location-adaptation | universe-default | universe-default:Serious Sam | Sable doré des reliefs de Karnak dans le plan éloigné du temple | Karnak — approche de la grande cour |
| 383 | Shadow Man | authored-location-adaptation | universe-default | universe-default:Shadow Man | Brume violette derrière les arches de fer et les portes d’os du Deadside | Deadside — cathédrale de l’Asile |
| 384 | Shaka Ponk | physical-motif-adaptation | universe-lore | physical-foliage | jungle | Goz-projection live arena and mechanical jungle screens |
| 385 | Shakira | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | She Wolf white cage room and lunar rooftop |
| 386 | Sharknado | physical-motif-adaptation | universe-lore | physical-water-ripples | flood | Santa Monica pier and flooded Los Angeles freeway |
| 387 | Shaun of the Dead | physical-motif-adaptation | universe-lore | physical-dust | pub | The Winchester pub interior during the siege |
| 388 | Silent Hill | authored-location-adaptation | universe-default | universe-default:Silent Hill | Nappes de brouillard derrière les façades de Toluca. | Silent Hill — rue vers le lac Toluca |
| 389 | Silent Hill f | authored-location-adaptation | universe-default | universe-default:Silent Hill f | Particules de pollen adaptées aux fleurs envahissant la ruelle. | Ebisugaoka — ruelle aux fleurs rouges |
| 390 | Sinister | physical-motif-adaptation | universe-lore | physical-concert-lights | projector | Oswalt house attic with projector and film boxes |
| 391 | Siren Head | physical-motif-adaptation | level-material | physical-lab-monitors | alloy | — |
| 392 | Skibidi | physical-motif-adaptation | universe-lore | physical-city-lights | City | Camera City boulevard during the Alliance defense |
| 393 | Skrillex | physical-motif-adaptation | universe-lore | physical-concert-lights | performance | Bangarang scrapyard performance set |
| 394 | Skullgirls | authored-location-adaptation | universe-default | universe-default:Skullgirls | Lueurs violettes et crème des vitrines de New Meridian | New Meridian — rue art déco |
| 395 | Skyline | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | Marina del Rey penthouse rooftop under the blue harvest light |
| 396 | Slender Man | physical-motif-adaptation | universe-lore | physical-foliage | forest | Eight Pages forest trail and abandoned bathhouse clearing |
| 397 | Small Soldiers | authored-location-adaptation | universe-default | universe-default:Small Soldiers | Lueurs domestiques et reflets dans la vitrine de jouets. | Boutique Abernathy — vitrine |
| 398 | Solar Opposites | physical-motif-adaptation | level-material | physical-lab-monitors | alloy | — |
| 399 | Soldier of Fortune | authored-location-adaptation | universe-default | universe-default:Soldier of Fortune | Voyants orange peu intenses dans les équipements du tunnel de transit | New York — tunnels du métro |
| 400 | Solo Leveling | authored-location-adaptation | universe-lore | cartenon-blue-flames | Cartenon | Cartenon Double Dungeon, Jeju nest and Seoul invasion |
| 401 | Sonic | authored-location-adaptation | universe-default | universe-default:Sonic | Petits reflets du plan d’eau sous les palmiers. | Green Hill Zone — bord du lagon |
| 402 | Soul Calibur | physical-motif-adaptation | universe-lore | physical-dust | Castle | Ostrheinsburg Castle throne approach |
| 403 | Spawn | physical-motif-adaptation | universe-lore | physical-city-lights | City | Rat City alley beneath the abandoned church |
| 404 | Spermageddon | physical-motif-adaptation | universe-lore | physical-testimony-ribbons | Reproductive-tract | Reproductive-tract current junction and fertilization chamber |
| 405 | Spider: The Video Game | physical-motif-adaptation | universe-lore | physical-lab-monitors | Circuit | Circuit Boards route through the Evil Labs sector |
| 406 | Splatterhouse | physical-motif-adaptation | universe-lore | physical-dust | hall | West Mansion entrance hall and underground altar |
| 407 | Splice | physical-motif-adaptation | universe-lore | physical-lab-monitors | Research | Nucleic Exchange Research Initiative embryo laboratory |
| 408 | Spoof Movie | physical-motif-adaptation | universe-lore | physical-city-lights | block party | South Central block party and Loc Dog drive-by route from Don't Be a Menace (1996) |
| 409 | Spy Fox | authored-location-adaptation | universe-default | universe-default:Spy Fox | Lumières jaune pâle des appareils et caisses du parcours de la laiterie | Dry Cereal — réserve de la laiterie |
| 410 | Spy Kids | authored-location-adaptation | universe-default | universe-default:Spy Kids | Voyants colorés des consoles de l’atelier de Floop. | Château de Floop — atelier |
| 411 | Spy x Family | physical-motif-adaptation | universe-lore | physical-dust | court | Eden Academy courtyard during the dodgeball/mission route |
| 412 | Spyro | physical-motif-adaptation | universe-lore | physical-foliage | meadow | Artisans homeworld central meadow and Stone Hill portal court |
| 413 | Squid Game | physical-motif-adaptation | universe-lore | physical-dust | field | Red Light, Green Light field and dormitory staircase access |
| 414 | Squirrel with a Gun | authored-location-adaptation | universe-default | universe-default:Squirrel with a Gun | Petites feuilles de chêne au bord du parcours des jardins de la banlieue | Banlieue — parcours de glands du jardin |
| 415 | Stan Helsing | authored-location-adaptation | universe-default | universe-default:Stan Helsing | Lueurs orange des décorations et des porches. | Lotissement — rue d’Halloween |
| 416 | Star Wars | authored-location-adaptation | universe-default | universe-default:Star Wars | Champ d’étoiles au-delà de l’ouverture du hangar. | Étoile de la Mort — ouverture du hangar |
| 417 | Stargate | authored-location-adaptation | universe-default | universe-default:Stargate | Ondulations de l’horizon des événements de la Porte. | SGC — salle d’embarquement |
| 418 | Stargate Atlantis | authored-location-adaptation | universe-lore | stargate-event-horizon | Atlantis | Atlantis Gate Room during a city-shield siege |
| 419 | Stargate Infinity | authored-location-adaptation | universe-lore | stargate-event-horizon | SGC | SGC evacuation gate room in the animated continuity |
| 420 | Stargate Universe | authored-location-adaptation | universe-lore | stargate-event-horizon | Destiny | Destiny Gate Room and observation-deck corridor |
| 421 | Starship Troopers | physical-motif-adaptation | universe-lore | physical-dust | Outpost | Klendathu landing zone and Whiskey Outpost wall |
| 422 | Steins;Gate | physical-motif-adaptation | universe-lore | physical-lab-monitors | circuit | Future Gadget Lab, apartment raid and Radio Kaikan roof as distinct locations |
| 423 | Stellar Dream — Safe Colony Mission | authored-location-adaptation | universe-default | universe-default:Stellar Dream — Safe Colony Mission | Étoiles bleues pâles au-delà des baies du vaisseau de colonisation Hope-1 | Hope-1 — route scientifique de relevé, adaptation sûre du projet |
| 424 | Stranger Things | authored-location-adaptation | universe-default | universe-default:Stranger Things | Voyants orange doux du laboratoire de Hawkins, sans spores de l’Upside Down ajoutées à cette scène | Hawkins National Laboratory — couloir de recherche |
| 425 | Streets of Rage | physical-motif-adaptation | universe-lore | physical-water-ripples | water | Streets of Rage 2 downtown waterfront and bar strip |
| 426 | Sub Urban | physical-motif-adaptation | universe-lore | physical-city-lights | urban | Cradles distorted suburban dollhouse |
| 427 | Subverse — Safe Galactic Rebellion | authored-location-adaptation | universe-default | universe-default:Subverse — Safe Galactic Rebellion | Étoiles lointaines derrière les baies du Mary Celeste, aucune scène de la version adulte | Mary Celeste — pont d’embarquement, adaptation spatiale sûre du projet |
| 428 | Super Meat Boy | authored-location-adaptation | universe-default | universe-default:Super Meat Boy | Feuilles dessinées vert sombre derrière les blocs de la forêt, sans obstacle ajouté | The Forest — parois de plateforme |
| 429 | Superhero Movie | authored-location-adaptation | universe-default | universe-default:Superhero Movie | Lumières distantes des immeubles d’Empire City. | Empire City — terrasse urbaine |
| 430 | Sword Art Online | physical-motif-adaptation | universe-lore | physical-city-lights | plaza | Aincrad Floor 74 labyrinth and boss chamber |
| 431 | Sword Art Online: Gun Gale Online | physical-motif-adaptation | universe-lore | physical-lab-monitors | steel | Gun Gale Online Bullet of Bullets and Squad Jam desert |
| 432 | System of a Down | physical-motif-adaptation | universe-lore | physical-city-lights | urban | B.Y.O.B. militarized banquet march through an urban protest set |
| 433 | Tail Concerto | authored-location-adaptation | universe-default | universe-default:Tail Concerto | Pollen doré au-dessus de la végétation des îles suspendues de Resaca | Prairie — îles flottantes de Resaca |
| 434 | Tanya the Evil | physical-motif-adaptation | universe-lore | physical-dust | trench | Rhine front trench network with aerial-mage launch posts |
| 435 | Tawantinsuyu: The Split Sun | authored-location-adaptation | universe-default | universe-default:Tawantinsuyu: The Split Sun | Poussière du chemin de falaises, sans iconographie rituelle ajoutée. | Qhapaq Ñan des Falaises |
| 436 | Team Fortress 2 | physical-motif-adaptation | universe-lore | physical-dust | bridge | 2Fort bridge and intelligence courtyards |
| 437 | Teen Titans | physical-motif-adaptation | universe-lore | physical-lab-monitors | alloy | Titans Tower operations room, HIVE Academy and Azarath |
| 438 | Tekken | physical-motif-adaptation | universe-lore | physical-dust | dojo | Hon-Maru Mishima dojo courtyard |
| 439 | Tenacious D | physical-motif-adaptation | universe-lore | physical-concert-lights | stage | Open-mic stage transitioning into the Rock-Off with the Devil |
| 440 | Terminator | authored-location-adaptation | universe-default | universe-default:Terminator | Petites braises dans les décombres de la Guerre du Futur. | Los Angeles 2029 — ruines de la Résistance |
| 441 | Terrifier | physical-motif-adaptation | universe-lore | physical-dust | house | Miles County carnival funhouse and laundromat alley |
| 442 | Thalassa Mnémique | authored-location-adaptation | universe-lore | thalassa-testimony | Récif | Récif des Registres beneath the Salt Archive and its mnemonic tide engines |
| 443 | The Aether Crown | authored-location-adaptation | universe-default | universe-default:The Aether Crown | Petites braises des fours derrière les passerelles de la fonderie. | Fonderie de la Couronne |
| 444 | The Amazing Patate Show | authored-location-adaptation | universe-default | universe-default:The Amazing Patate Show | Lueurs jaune bleu des accessoires colorés du plateau musical minimaliste | Plateau blanc — répétition de Petite Patate |
| 445 | The Backrooms — Kane Pixels | authored-location-adaptation | universe-default | universe-default:The Backrooms — Kane Pixels | Éclairage fluorescent jaune pâle dans les halls vides du Complexe | Complexe — Yellow Halls |
| 446 | The Ball | authored-location-adaptation | universe-default | universe-default:The Ball | Poussière ocre des ruines mésoaméricaines derrière le parcours de la boule | Pehua — cavernes du parcours de la sphère |
| 447 | The Batman Who Laughs | physical-motif-adaptation | universe-lore | physical-city-lights | city | Dark Multiverse Gotham beneath the infected Batcave and chained city spires |
| 448 | The Big Bang Theory | authored-location-adaptation | universe-default | universe-default:The Big Bang Theory | Lueur discrète des lampes domestiques du salon. | Appartement 4A — salon |
| 449 | The Binding of Isaac: Rebirth | authored-location-adaptation | universe-default | universe-default:The Binding of Isaac: Rebirth | Poussière gris beige près des murs quadrillés du sous-sol, sans anatomie ni ennemi ajouté | Basement — salle de départ |
| 450 | The Brave Little Toaster | physical-motif-adaptation | universe-lore | physical-lab-monitors | crusher | Ernie's Disposal junkyard crusher line |
| 451 | The Collector | physical-motif-adaptation | universe-lore | physical-dust | residence | Chase residence foyer and basement trap network |
| 452 | The Conjuring | authored-location-adaptation | universe-default | universe-default:The Conjuring | Poussière dans la lumière descendant vers la cave. | Ferme Perron — escalier du sous-sol |
| 453 | The Creator | authored-location-adaptation | universe-default | universe-default:The Creator | Reflets calmes dans les parcelles irriguées du village. | New Asia — bord des rizières |
| 454 | The Crownless Sea | authored-location-adaptation | universe-default | universe-default:The Crownless Sea | Reflets d’eau sous les quais du port sans pavillon. | Port Sans Pavillon |
| 455 | The Da Vinci Code | authored-location-adaptation | universe-default | universe-default:The Da Vinci Code | Poussière très fine dans la lumière des vitrages de galerie. | Louvre — Grande Galerie de nuit |
| 456 | The Dark Knight | authored-location-adaptation | universe-default | universe-default:The Dark Knight | Lueurs distantes des tours du centre de Gotham. | Gotham — terrasse dominant le centre-ville |
| 457 | The Darkness | authored-location-adaptation | universe-default | universe-default:The Darkness | Éclairages jaunes du quai de métro dans la nuit new-yorkaise | New York — station du métro nocturne |
| 458 | The Drowned Testament | authored-location-adaptation | universe-default | universe-default:The Drowned Testament | Reflets sombres dans les chenaux sous les quais de Greywake. | Port de Greywake à marée basse |
| 459 | The Expendables | authored-location-adaptation | universe-default | universe-default:The Expendables | Poussière sèche dans la cour des bâtiments militaires. | Vilena — cour des installations |
| 460 | The Forest | authored-location-adaptation | universe-default | universe-default:The Forest | Feuilles et pollen vert pâle dans la canopée derrière les abris artisanaux | Péninsule — lisière du camp de survie |
| 461 | The Grudge | physical-motif-adaptation | universe-lore | physical-concert-lights | led | Saeki house care route, investigation chain and staircase-attic threshold |
| 462 | The Horribly Slow Murderer | authored-location-adaptation | universe-default | universe-default:The Horribly Slow Murderer | Poussière domestique dans la lumière de la cuisine. | Appartement de Jack — cuisine |
| 463 | The Last of Us | physical-motif-adaptation | universe-lore | physical-city-lights | town | Boston quarantine-zone checkpoint and collapsed downtown |
| 464 | The Lord of the Rings | authored-location-adaptation | universe-default | universe-default:The Lord of the Rings | Reflets de la rivière sous les terrasses de Fondcombe. | Fondcombe — terrasse sur la rivière |
| 465 | The Matrix | authored-location-adaptation | universe-default | universe-default:The Matrix | Flux de code vert limité à la zone des terminaux. | Nebuchadnezzar — poste opérateur |
| 466 | The Mummy | authored-location-adaptation | universe-default | universe-default:The Mummy | Sable léger devant les portes excavées de Hamunaptra. | Hamunaptra — parvis excavé |
| 467 | The Predator | physical-motif-adaptation | universe-lore | physical-lab-monitors | laboratory | Project Stargazer laboratory and captured Yautja ship bay |
| 468 | The Purge | authored-location-adaptation | universe-default | universe-default:The Purge | Voyants du système domestique de surveillance. | Maison Sandin — poste de surveillance |
| 469 | The Ring | physical-motif-adaptation | universe-lore | physical-dust | Cabin | Shelter Mountain Cabin 12, Morgan Ranch and the stone well television threshold |
| 470 | The Silence of the Lambs | authored-location-adaptation | universe-default | universe-default:The Silence of the Lambs | Lueur intermittente de l’éclairage du couloir de pierre. | Baltimore — couloir de détention |
| 471 | The Simpsons | physical-motif-adaptation | universe-lore | physical-lab-monitors | reactor | Springfield Nuclear Power Plant sector 7-G and reactor hall |
| 472 | The Smurfs | authored-location-adaptation | universe-default | universe-default:The Smurfs | Petites feuilles au-dessus des maisons-champignons. | Village schtroumpf — clairière des maisons |
| 473 | The Surge | authored-location-adaptation | universe-default | universe-default:The Surge | Vapeur grise des machines industrielles de la zone de production abandonnée | CREO — Abandoned Production |
| 474 | The Texas Chain Saw Massacre | authored-location-adaptation | universe-default | universe-default:The Texas Chain Saw Massacre | Poussière délavée du bas-côté au loin devant les clôtures et la ferme, sans violence ajoutée | Texas — route rurale près de la ferme familiale |
| 475 | The Thing | authored-location-adaptation | universe-lore | outpost31-cold | Outpost | Outpost 31 recreation room during the blood test |
| 476 | The Truman Show | authored-location-adaptation | universe-default | universe-default:The Truman Show | Reflets pastel de l’océan artificiel au fond du panorama du studio de Seahaven | Seahaven — boucle matinale près du front de mer |
| 477 | The Walking Dead — Telltale | authored-location-adaptation | universe-default | universe-default:The Walking Dead — Telltale | Feuilles fanées le long des rues vides de Savannah rendues dans une palette Graphic Black | Savannah — rues abandonnées |
| 478 | The Weeknd | physical-motif-adaptation | universe-lore | physical-city-lights | street | After Hours Las Vegas casino street |
| 479 | The Wild Thornberrys | authored-location-adaptation | universe-default | universe-default:The Wild Thornberrys | Poussière claire derrière les roues et l’herbe du campement. | Savane — campement du CommVee |
| 480 | Them! | authored-location-adaptation | universe-default | universe-default:Them! | Poussière sèche près des traces du désert. | Nouveau-Mexique — approche du nid |
| 481 | Tintin | authored-location-adaptation | universe-default | universe-default:Tintin | Feuilles du parc derrière la cour de Moulinsart. | Moulinsart — cour du château |
| 482 | Titanfall 2 | authored-location-adaptation | universe-default | universe-default:Titanfall 2 | Voyants des bras et des postes d’assemblage IMC. | Usine IMC — baie d’assemblage |
| 483 | Tokyo Ghoul | authored-location-adaptation | universe-lore | tokyo-ghoul-rain | rooftop | Ward 20 Anteiku, Cochlea and Tokyo rooftops |
| 484 | Tom Clancy’s Splinter Cell | authored-location-adaptation | universe-default | universe-default:Tom Clancy’s Splinter Cell | Lumières de sécurité bleu vert le long des équipements du ministère | Tbilissi — ministère géorgien de la Défense |
| 485 | Tomb Raider | physical-motif-adaptation | universe-lore | physical-water-ripples | water | Lost Valley ruins and waterfall from Tomb Raider 1996 |
| 486 | Tomba | physical-motif-adaptation | universe-lore | physical-foliage | Forest | Mushroom Forest, Phoenix Mountain and Seven Evil Pig Bag sanctuary |
| 487 | Tommy Heavenly6 | physical-motif-adaptation | universe-lore | physical-dust | yard | Pray gothic churchyard and candy-punk bedroom set |
| 488 | Torbahead | authored-location-adaptation | universe-default | universe-default:Torbahead | Barres de lumière et cadres verticaux des salutations et des boucles audio, aucune personne ou localisation réelle déduite | Plateau abstrait Daily Greeting Reel — adaptation du format public |
| 489 | Toxic Avenger | physical-motif-adaptation | universe-lore | physical-city-lights | ville | Tromaville Health Club alley beside the toxic-waste dump |
| 490 | Toy Soldiers | physical-motif-adaptation | universe-lore | physical-dust | trench | WWI trench diorama across a child's bedroom table |
| 491 | Tremors | physical-motif-adaptation | universe-lore | physical-city-lights | rooftop | Perfection general store rooftops and exposed road |
| 492 | Trololo | authored-location-adaptation | universe-default | universe-default:Trololo | Variation douce des éclairages publics de la captation, sans pouvoir attribué au chanteur. | Plateau télévisé de la vocalise |
| 493 | Turok | authored-location-adaptation | universe-default | universe-default:Turok | Feuilles vert bronze dans la jungle du Lost Land derrière les ruines | Lost Land — jungle près des portails de pierre |
| 494 | Twisted Metal | physical-motif-adaptation | universe-lore | physical-city-lights | freeway | Los Angeles freeway interchange and Calypso tournament arena |
| 495 | Téléchat | authored-location-adaptation | universe-default | universe-default:Téléchat | Voyants des moniteurs et lampes du plateau de marionnettes. | Studio du journal Téléchat |
| 496 | Ultra Vomit | physical-motif-adaptation | universe-lore | physical-foliage | forest | Kammthaar forest parody set and live-stage portal |
| 497 | Universal Soldier | authored-location-adaptation | universe-default | universe-default:Universal Soldier | Vapeur froide du système de refroidissement UniSol. | Transport UniSol — compartiment réfrigéré |
| 498 | Unreal | physical-motif-adaptation | universe-lore | physical-lab-monitors | industrial | DM-Deck16 industrial arena adapted to a Liandri tactics grid |
| 499 | Unreal Tournament | authored-location-adaptation | universe-default | universe-default:Unreal Tournament | Reflets bleu-rouge des voyants sur les passerelles industrielles de Deck16][ | Deck16][ — passerelles et cuves Liandri |
| 500 | Unreal Tournament 2004 | authored-location-adaptation | universe-default | universe-default:Unreal Tournament 2004 | Voyants bleus des machines de Rankin, distincts de Deck16][ du tournoi 1999 | DM-Rankin — atelier du tournoi 2004 |
| 501 | Uzumaki | physical-motif-adaptation | universe-lore | physical-water-ripples | Pond | Kurozu-cho lighthouse and Dragonfly Pond spiral district |
| 502 | Valedor: The Shattered Crown | authored-location-adaptation | universe-default | universe-default:Valedor: The Shattered Crown | Poussière claire sur le carrefour pavé de la cité. | Carrefour de la Cité Libre |
| 503 | VelociPastor | physical-motif-adaptation | universe-lore | physical-city-lights | town | Church parish hall opening onto the Chinatown showdown alley |
| 504 | Viridienne Ultime | authored-location-adaptation | universe-lore | viridienne-orbits | Orbit | Canopy of Orbits above the Star-Seed Nursery and the Root-Sun heart |
| 505 | Virus | physical-motif-adaptation | universe-lore | physical-lab-monitors | machine shop | Akademik Vladislav Volkov storm deck and machine shop |
| 506 | Vocaloid | authored-location-adaptation | universe-lore | magical-mirai-lights | Mirai | Magical Mirai concert floor and Shibuya projection stage |
| 507 | Voyage de Chihiro | authored-location-adaptation | universe-lore | aburaya-boiler | Aburaya | Aburaya bathhouse bridge and boiler-room access |
| 508 | Wakfu | authored-location-adaptation | universe-default | universe-default:Wakfu | Pollen turquoise pâle dans les herbes et les ruines chaleureuses d’Emelka | Emelka — village |
| 509 | Wallace & Gromit | authored-location-adaptation | universe-default | universe-default:Wallace & Gromit | Vapeur douce des tuyaux de cuivre des inventions à l’arrière de l’atelier | 62 West Wallaby Street — atelier de Wallace |
| 510 | War of the Worlds | physical-motif-adaptation | universe-lore | physical-city-lights | street | Bayonne street and ferry approach under Tripod attack |
| 511 | Warhammer 40,000: Space Marine | authored-location-adaptation | universe-default | universe-default:Warhammer 40,000: Space Marine | Étincelles de chaleur derrière les grandes machines de forge du manufactorum | Graia — Manufactorum Ajakis |
| 512 | Within Temptation | physical-motif-adaptation | universe-lore | physical-foliage | forest | Mother Earth forest-ruin concert and Resist screen architecture |
| 513 | Wolfenstein | authored-location-adaptation | universe-default | universe-default:Wolfenstein | Lueurs ambrées derrière les équipements dieselpunk et les murs de pierre | Château Wolfenstein — couloir de fuite de l’anthologie MachineGames |
| 514 | Woodruff | physical-motif-adaptation | universe-lore | physical-lab-monitors | factory | Vlurxtrznbnaxl lower city, Administration factory gate and Bigwig apartment |
| 515 | Worms | authored-location-adaptation | universe-default | universe-default:Worms | Reflets bleus de la mer au loin sous les îlots de terre, sans modifier leur collision | Îlot destructible — décor original de terrain Worms |
| 516 | Wrong Turn | physical-motif-adaptation | universe-lore | physical-dust | cabin | West Virginia fire lookout and cannibal cabin route |
| 517 | Yakuza | physical-motif-adaptation | universe-lore | physical-concert-lights | Theater | Theater Square and Millennium Tower frontage |
| 518 | Yomi no Kage | authored-location-adaptation | universe-default | universe-default:Yomi no Kage | Feuilles lentes dans la forêt du décor original. | Forêt des Torii inversés |
| 519 | Yu-Gi-Oh | authored-location-adaptation | universe-default | universe-default:Yu-Gi-Oh | Lumières lointaines de la ville sous la plateforme de duel. | Dirigeable Battle City — plateforme nocturne |
| 520 | Zak et Crysta | physical-motif-adaptation | universe-lore | physical-foliage | rainforest | FernGully rainforest at the Leveler clearing |
| 521 | Zero Escape: The Nonary Games | physical-motif-adaptation | universe-lore | physical-water-ripples | ocean | Gigantic Nonary Game ship and Decision Game bunker |
| 522 | Zombi | authored-location-adaptation | universe-default | universe-default:Zombi | Feuillage léger du sentier tropical de Matul. | Matul — sentier près de la mission |
| 523 | Zombies Ate My Neighbors | physical-motif-adaptation | universe-lore | physical-water-ripples | pools | Level 1 Zombie Panic suburban block and backyard pools |
| 524 | Zootopia | authored-location-adaptation | universe-default | universe-default:Zootopia | Lueurs des façades et de la signalétique de Savanna Central. | Savanna Central — place de la gare |
| 525 | Zorro | authored-location-adaptation | universe-default | universe-default:Zorro | Lueurs chaudes des lanternes de l’hacienda. | Hacienda de Don Rafael — cour à arcades |
<!-- audit-data:end -->

## Reproduction et vérification

Depuis la racine du dépôt, cette commande recalcule les 525 lignes à partir du code, vérifie le JSON compagnon puis réimprime les comptes et le tableau. Elle échoue si les comptes, le roster, les profils, motifs ou sources changent. Elle ne modifie aucun fichier. Les tests de `scripts/stageAtmosphere.test.mjs` vérifient aussi les 255 clés de la baseline, les champs de provenance, les bornes de placement, le rendu déterministe et la priorité des scènes concrètes.

```sh
node --input-type=module <<'NODE'
import fs from 'node:fs';
import { HEROES_DB } from './src/game/heroes.js';
import { STAGE_LORE_PROFILES } from './src/game/stageLoreProfiles.js';
import { getStageAtmosphereProfile } from './src/game/melee/stageAtmosphere.js';
import { STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS } from './src/game/melee/stageAtmosphereUniverseDefaults.js';
const rows = [...new Set(HEROES_DB.map(h => h.universe))].sort().map(universe => {
  const p = getStageAtmosphereProfile({ universe, mode: 'Combat' });
  return { universe, status: p.fidelity, selection: p.selection, profile: p.id,
    motif: p.sourceMatchedMotif, sourceAnchor: p.sourceAnchor, enabled: p.enabled,
    sourceReference: p.sourceReference || p.referenceUrls[0] || p.sourceFields[0] || null };
});
const counts = Object.fromEntries(['authored-location-adaptation', 'physical-motif-adaptation', 'unconfigured']
  .map(status => [status, rows.filter(row => row.status === status).length]));
const saved = JSON.parse(fs.readFileSync('docs/audits/stage-atmosphere-coverage-2026-10-18.json', 'utf8'));
if (JSON.stringify(counts) !== JSON.stringify(saved.counts)) throw new Error('Counts changed');
if (rows.length !== saved.heroUniverseCount) throw new Error('Roster changed');
if (Object.keys(STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS).length !== saved.explicitUniverseDefaultCount) throw new Error('Default count changed');
rows.forEach((row, index) => {
  for (const key of Object.keys(row)) {
    if (row[key] !== saved.rows[index][key]) throw new Error(row.universe + ': changed ' + key);
  }
});
console.log(JSON.stringify({ heroUniverseCount: rows.length,
  loreUniverseProfileCount: Object.keys(STAGE_LORE_PROFILES).length,
  explicitUniverseDefaultCount: Object.keys(STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS).length, counts }, null, 2));
const cell = value => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', ' ');
console.log('| # | Univers | Statut | Sélection | Profil | Motif retenu | sourceAnchor |');
console.log('| ---: | --- | --- | --- | --- | --- | --- |');
rows.forEach((r, i) => console.log('| ' + [i + 1, r.universe, r.status, r.selection, r.profile, r.motif, r.sourceAnchor].map(cell).join(' | ') + ' |'));
NODE
```
