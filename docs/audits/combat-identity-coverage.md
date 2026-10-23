# Couverture des identités de combat

Audit reproductible du 18 octobre 2026 : `node scripts/combatCompletionAudit.mjs --check`.

1911 héros, 525 univers, 1911 supers résolus. 1418 identités ont une définition explicite par ID ; les autres conservent leur capacité nommée du catalogue.

Les **1 089 capacités génériques initiales** et **191 autres « decisive action »** sont couvertes par des tables explicites. Génériques restants : **0**. Les baselines antérieures aux corrections sont conservées séparément dans `docs/combat-completion-2026-10-18/`. Le catalogue source reste intact ; le moteur résout les capacités effectives partagées.

Les **82 profils** autrefois sans artwork d’entité utilisent **28 planches PNG distinctes**, chacune avec quatre poses natives générées puis extraites et normalisées. Profils sans asset d’entité : **0**. Les entités FFVII ne sont pas représentées par un membre de l’équipe ; tourelles et drones montrent leur équipement propre. Les autres renforts emploient un vrai personnage du même univers.

Les **255 ambiances manquantes** sont rédigées par univers : **525/525** univers configurés sans nom de scène. Un lieu concret garde priorité. Voir le rapport détaillé `stage-atmosphere-coverage-2026-10-18.md`.

Ces contrôles certifient la couverture et les contrats du moteur, pas la fidélité 1:1 aux œuvres. Les capacités distinguent technique nommée, adaptation du rôle et canon original du projet. Les références ne sont pas vérifiées sur le réseau. Les PNG sont des adaptations générées ; les intros, sorties et finales restent des séquences adaptées. Les coûts, portées, dégâts, soins et timings sont équilibrés pour ce moteur. La provenance conserve ces limites.

Les lignes comptent les personnages appelants, pas les entités uniques.

| Univers | Héros | Supers | Identités écrites | Génériques | Invocations | Renforts | Profils avec PNG d’entité | Assets absents |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 28 Days Later | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| A Nightmare on Elm Street | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Absolver: Downfall | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Ado | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Adoprixtoxis | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Aegea: War of the Moirai | 3 | 3 | 0 | 0 | 0 | 3 | 3 | 0 |
| Aetherion: Seven Laws of Magic | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Aevum Fracture | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Agony | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Alien | 9 | 9 | 5 | 0 | 0 | 9 | 0 | 0 |
| Alien 3 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Alien Resurrection | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Alien vs Predator | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Alien: Covenant | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Alien: Romulus | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Aliens | 7 | 7 | 7 | 0 | 0 | 7 | 0 | 0 |
| Aliens vs Predator: Requiem | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Altered Beast | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| American Dad | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Angels Fall First | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Another | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ash vs Evil Dead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| ASMRZ | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Assassin's Creed | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Asterix & Obelix | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Atarashii Gakko | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Atomic Heart | 3 | 3 | 1 | 0 | 0 | 3 | 0 | 0 |
| Attack on Titan | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Aural Vampire | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Avatar (Na'vi) | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Baby Cart | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Babymetal | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Back to the Future | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Band-Maid | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Banlieue 13 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Battle Royale | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Beat Banger — Safe Rhythm Studio | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Bella Poarch | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ben 10 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Bendy and the Ink Machine | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Beyond Good & Evil | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Bible Black | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Big Mouth | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Bigflo & Oli | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Billie Eilish | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| BioShock | 3 | 3 | 1 | 0 | 0 | 3 | 0 | 0 |
| BIT.TRIP | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Black Eyed Peas | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Blackpink | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Blade Runner | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| BlazBlue | 10 | 10 | 8 | 0 | 0 | 10 | 0 | 0 |
| Borderlands | 7 | 7 | 5 | 0 | 0 | 7 | 0 | 0 |
| Borderlands 2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Boruto: Naruto Next Generations | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Boruto: Two Blue Vortex | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Breaking Bad | 4 | 4 | 4 | 0 | 0 | 4 | 0 | 0 |
| Bring Me the Horizon | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| BRINK | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Brütal Legend | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Buckethead | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Buckshot Roulette | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Buffy the Vampire Slayer | 7 | 7 | 6 | 0 | 0 | 7 | 0 | 0 |
| Camera Cafe | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Cells at Work! | 9 | 9 | 9 | 0 | 0 | 9 | 0 | 0 |
| Chainsaw Man | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Chappie | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Charmed | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Chicken Run | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Choo-Choo Charles | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Chucky | 25 | 25 | 3 | 0 | 0 | 25 | 0 | 0 |
| Cloverfield | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Commando | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Cool Spot | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Counter-Strike | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Cowboy Bebop | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Crash Bandicoot | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Croc | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Croc: Legend of the Gobbos | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Crypt of the NecroDancer | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Crysis | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Cthulhu | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Cuphead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Cyberpunk | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Cyberpunk: Edgerunners | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Daft Punk | 4 | 4 | 3 | 0 | 0 | 4 | 0 | 0 |
| Daikatana | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Dandadan | 6 | 6 | 0 | 0 | 0 | 6 | 0 | 0 |
| Dante's Inferno | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Dark Souls | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Day of the Dead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Dead by Daylight | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Dead Rising | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Dead Space | 7 | 7 | 3 | 0 | 0 | 7 | 0 | 0 |
| Deadman Wonderland | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Deadmau5 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Death Note | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Defiance | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Demon Slayer | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Deponia | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Despicer | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Deus Ex | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Devil May Cry | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Devilman | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Die Antwoord | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Digimon | 8 | 8 | 5 | 0 | 0 | 8 | 0 | 0 |
| Digimon Celestial Rift | 4 | 4 | 4 | 0 | 0 | 4 | 0 | 0 |
| Digital Circus | 7 | 7 | 4 | 0 | 0 | 7 | 0 | 0 |
| Dino Crisis | 8 | 8 | 4 | 0 | 0 | 8 | 0 | 0 |
| Discipline: The Record of a Crusade | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Discworld | 7 | 7 | 7 | 0 | 0 | 7 | 0 | 0 |
| Disenchantment | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Doom | 8 | 8 | 4 | 0 | 0 | 8 | 1 | 0 |
| Doom Sweeper — Safe Apocalypse | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Dragon Ball Z | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Duke Nukem | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Dungeon Meshi | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Dynamite Duke | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| E.Y.E: Divine Cybermancy | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Early Edition | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Earthworm Jim | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ecco the Dolphin | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Elfen Lied | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Elvira | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Eminem | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Evil Dead | 6 | 6 | 3 | 0 | 0 | 6 | 0 | 0 |
| Evil Dead (2013) | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Evolution | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Evolution: The Animated Series | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Evolve | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Exit 8 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Extreme Ghostbusters | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| F.E.A.R. | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Fallout | 9 | 9 | 6 | 0 | 0 | 9 | 0 | 0 |
| Famille Pirate | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Family Guy | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Fantomas | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Final Fantasy VII | 7 | 7 | 7 | 0 | 7 | 0 | 7 | 0 |
| Final Fantasy VIII | 8 | 8 | 8 | 0 | 0 | 8 | 0 | 0 |
| Final Fantasy XIII | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Final Fantasy XV | 7 | 7 | 5 | 0 | 0 | 7 | 0 | 0 |
| Finding Frankie | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Flashback | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Freddi Fish | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Friday the 13th | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Frieren: Beyond Journeys End | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| From | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Fullmetal Alchemist | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Futurama | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Gantz | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Gears of War | 8 | 8 | 8 | 0 | 0 | 8 | 0 | 0 |
| Gex | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Ghost | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ghost in the Shell | 8 | 8 | 7 | 0 | 0 | 8 | 0 | 0 |
| Ghostbusters | 7 | 7 | 5 | 0 | 0 | 7 | 0 | 0 |
| Ghosts of Mars | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Goat Simulator | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Godzilla | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Godzilla The Animated Series | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Goemon's Great Adventure | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Gorillaz | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Gremlins | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| GTFO | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Guilty Gear | 9 | 9 | 9 | 0 | 1 | 8 | 1 | 0 |
| Guitar Hero | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Gunnm | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Guns N Roses | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Gushing over Magical Girls — Safe Adult Reinterpretation | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| H2G2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Half-Life | 8 | 8 | 7 | 0 | 0 | 8 | 3 | 0 |
| Halloween | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Halo | 10 | 10 | 8 | 0 | 0 | 10 | 1 | 0 |
| Happy Wheels | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Harry Potter | 11 | 11 | 7 | 0 | 0 | 11 | 0 | 0 |
| HAWKEN | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Haydee — Safe Adaptation | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Hazbin Hotel | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Heart Eyes | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Heart of Darkness | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Heavy Metal 2000 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Helios 56 | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Hell House LLC | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Hellblade: Senua’s Sacrifice | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Hello Neighbor | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Hellraiser | 9 | 9 | 0 | 0 | 0 | 9 | 0 | 0 |
| Helluva Boss | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Hexen | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| HITMAN — World of Assassination | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Home Alone | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Horizon Zero Dawn | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Hoshi | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Hotline Miami | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| House of 1000 Corpses | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| House of the Dead | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| House of the Dead 2 | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| House of the Dead 3 | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| How to Make a Monster | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ice Age | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ilyr Concordat | 3 | 3 | 0 | 0 | 0 | 3 | 3 | 0 |
| Imperium Aeternum | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Indila | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Infernum: Nine Pits | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Inside Out | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Insidious | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Interstellar Marines | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Inuyashiki | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Invincible | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Iron Sky | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Iron Tempest | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Italian Brainrot | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Jersey Devil | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Jet Set Radio | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| John Wick | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| JoJo's Bizarre Adventure | 3 | 3 | 3 | 0 | 3 | 0 | 3 | 0 |
| Joker New 52 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Kaamelott | 8 | 8 | 8 | 0 | 0 | 8 | 0 | 0 |
| Karune Cal | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Kazaam | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Kemet: The Devoured Sun | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Kill Bill | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Killer Instinct | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Killer Tomatoes from Outer Space | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Killing Floor 2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Killzone | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Korn | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Kung Pow | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Kyary Pamyu Pamyu | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| La Casa de Papel | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| La Cite de la Peur | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| La Petite Histoire de France | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Lady Gaga | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ladybaby | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Land of the Dead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Last Action Hero | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Le Cinquième Element | 9 | 9 | 6 | 0 | 0 | 9 | 0 | 0 |
| Le Donjon de Naheulbeuk | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Left 4 Dead | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Legacy of Kain | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Les Aventures de Saturnin | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Les Aventuriers du Survivaure | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Les Chevaliers du Fiel | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Les Inconnus | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Les Kassos | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Les Tuche | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Les Visiteurs | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Les Visiteurs du Futur | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Les Zinzins de l’espace | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Like a Dragon | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Lil Nas X | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Lilo & Stitch | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Linkin Park | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Little Big | 4 | 4 | 4 | 0 | 0 | 4 | 0 | 0 |
| LittleBigPlanet | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Lost Planet 2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| M3GAN | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mad Max | 9 | 9 | 6 | 0 | 0 | 9 | 0 | 0 |
| Mad Max: Fury Road | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| MagiC JacK | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Magicka | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Malcolm in the Middle | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Man with a Mission | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mandate of Nine Heavens | 3 | 3 | 0 | 0 | 3 | 0 | 3 | 0 |
| Marathon | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Marble Hornets | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Marilyn Manson | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mars Attacks | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Marvel Zombies — MCU Animation | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mashle | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mass Effect | 7 | 7 | 7 | 0 | 0 | 7 | 0 | 0 |
| Max Payne 2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| MDK | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| MediEvil | 3 | 3 | 1 | 0 | 0 | 3 | 0 | 0 |
| Meet the Feebles | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Men in Black | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Meridian Clockwork | 3 | 3 | 0 | 0 | 0 | 3 | 3 | 0 |
| Méridien Creux | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Metal Gear | 9 | 9 | 7 | 0 | 0 | 9 | 0 | 0 |
| Metal Gear Rising | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Metal Slug | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Metal: Hellsinger | 3 | 3 | 1 | 0 | 0 | 3 | 0 | 0 |
| Michael Jackson | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Minecraft | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Minions | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mirror's Edge | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Moonwalker | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mr. Bean | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Murder Drones | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Mythos Primordia | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Naruto | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Naruto Shippuden | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Natural Selection 2 | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Necronomicon | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Negima | 9 | 9 | 3 | 0 | 0 | 9 | 0 | 0 |
| Nemesis — Awaken Realms | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Neon Genesis Evangelion | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Neon Requiem | 3 | 3 | 0 | 0 | 0 | 3 | 3 | 0 |
| Nexus de Convergence | 11 | 11 | 0 | 0 | 1 | 10 | 11 | 0 |
| Nicolas et Pimprenelle | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| NieR | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Night of the Living Dead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Nightwish | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Nine Realms: Last Twilight | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| No Man's Sky | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Noelle Perna | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Noob | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Nyan Cat | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Oddworld | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Oggy et les Cafards | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Oliver Tree | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| One Punch Man | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Onechanbara | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Overgrowth | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Overlord Anime | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Palworld | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Parasite Eve | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Parasyte | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Payday | 7 | 7 | 7 | 0 | 0 | 7 | 2 | 0 |
| Pee-wee | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Peepoodo — Safe Educational Adaptation | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Phantasmagoria | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Pingu | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Pirates of the Caribbean | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Planete Hurlante | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Plants vs. Zombies | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Police Squad | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Poppy Playtime | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Portal | 10 | 10 | 4 | 0 | 0 | 10 | 10 | 0 |
| Postal | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Predator | 11 | 11 | 5 | 0 | 0 | 11 | 0 | 0 |
| Predator 2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Predator: Badlands | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Predator: Killer of Killers | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Predators | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Prey | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Prey (2006) | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Prometheus | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| PSY | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Psycho-Pass | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| PUBG | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Puppet Master | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Putt-Putt | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Quake | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Queen Bee | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| R.E.P.O. | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rambo | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rammstein | 6 | 6 | 3 | 0 | 0 | 6 | 0 | 0 |
| Rayman | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Re-Animator | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| REC | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Red Faction | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Redneck Rampage | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Reflets d’Acide | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Remember Me | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Repo! The Genetic Opera | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Resident Evil | 9 | 9 | 8 | 0 | 0 | 9 | 0 | 0 |
| Richard au pays des livres magiques | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rick & Morty | 8 | 8 | 3 | 0 | 0 | 8 | 0 | 0 |
| Rick Astley | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Ristar | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rival Schools | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Rob Zombie | 4 | 4 | 3 | 0 | 0 | 4 | 0 | 0 |
| RoboCop | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Rock of Ages | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rocky | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rocky Horror Picture Show | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Roger Rabbit | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rosario + Vampire | 9 | 9 | 4 | 0 | 0 | 9 | 0 | 0 |
| RRRrrrr!!! | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Rubber | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rugrats | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Rurouni Kenshin | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sam & Max | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Samantha Oups! | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sanctum | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Sartorius Stedim Biotech | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Sausage Party | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Saw | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Scary Movie | 6 | 6 | 3 | 0 | 0 | 6 | 0 | 0 |
| SCP Foundation | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Seaman | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Secret of Monkey Island | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Serious Sam | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Shadow Man | 3 | 3 | 2 | 0 | 0 | 3 | 0 | 0 |
| Shaka Ponk | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Shakira | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sharknado | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Shaun of the Dead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Silent Hill | 8 | 8 | 5 | 0 | 0 | 8 | 0 | 0 |
| Silent Hill f | 4 | 4 | 4 | 0 | 0 | 4 | 0 | 0 |
| Sinister | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Siren Head | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Skibidi | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Skrillex | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Skullgirls | 3 | 3 | 3 | 0 | 0 | 3 | 1 | 0 |
| Skyline | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Slender Man | 7 | 7 | 3 | 0 | 0 | 7 | 7 | 0 |
| Small Soldiers | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Solar Opposites | 4 | 4 | 0 | 0 | 0 | 4 | 0 | 0 |
| Soldier of Fortune | 3 | 3 | 1 | 0 | 0 | 3 | 0 | 0 |
| Solo Leveling | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sonic | 3 | 3 | 3 | 0 | 0 | 3 | 1 | 0 |
| Soul Calibur | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spawn | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spermageddon | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spider: The Video Game | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Splatterhouse | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Splice | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spoof Movie | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spy Fox | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spy Kids | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Spy x Family | 6 | 6 | 6 | 0 | 0 | 6 | 0 | 0 |
| Spyro | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Squid Game | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Squirrel with a Gun | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Stan Helsing | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Star Wars | 15 | 15 | 6 | 0 | 0 | 15 | 0 | 0 |
| Stargate | 10 | 10 | 7 | 0 | 0 | 10 | 0 | 0 |
| Stargate Atlantis | 6 | 6 | 5 | 0 | 0 | 6 | 0 | 0 |
| Stargate Infinity | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Stargate Universe | 6 | 6 | 5 | 0 | 0 | 6 | 0 | 0 |
| Starship Troopers | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Steins;Gate | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Stellar Dream — Safe Colony Mission | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Stranger Things | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Streets of Rage | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sub Urban | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Subverse — Safe Galactic Rebellion | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Super Meat Boy | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Superhero Movie | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| SUPERHOT | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sword Art Online | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Sword Art Online: Gun Gale Online | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| System of a Down | 4 | 4 | 3 | 0 | 0 | 4 | 0 | 0 |
| Tail Concerto | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Tanya the Evil | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tawantinsuyu: The Split Sun | 3 | 3 | 0 | 0 | 0 | 3 | 3 | 0 |
| Team Fortress 2 | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Teen Titans | 5 | 5 | 5 | 0 | 0 | 5 | 0 | 0 |
| Tekken | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Téléchat | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Tenacious D | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Terminator | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Terrifier | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Thalassa Mnémique | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Aether Crown | 3 | 3 | 0 | 0 | 0 | 3 | 3 | 0 |
| The Amazing Patate Show | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Backrooms — Kane Pixels | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Ball | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Batman Who Laughs | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Big Bang Theory | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Binding of Isaac: Rebirth | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Brave Little Toaster | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Collector | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Conjuring | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Creator | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Crownless Sea | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Da Vinci Code | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Dark Knight | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Darkness | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Drowned Testament | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Expendables | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Forest | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Grudge | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Horribly Slow Murderer | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Last of Us | 6 | 6 | 3 | 0 | 0 | 6 | 0 | 0 |
| The Lord of the Rings | 4 | 4 | 4 | 0 | 0 | 4 | 0 | 0 |
| The Matrix | 10 | 10 | 8 | 0 | 0 | 10 | 0 | 0 |
| The Mummy | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Predator | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Purge | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Ring | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Silence of the Lambs | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Simpsons | 7 | 7 | 7 | 0 | 0 | 7 | 0 | 0 |
| The Smurfs | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Surge | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Texas Chain Saw Massacre | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Thing | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Truman Show | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Walking Dead — Telltale | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| The Weeknd | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| The Wild Thornberrys | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Them! | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tintin | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Titanfall 2 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tokyo Ghoul | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tom Clancy’s Splinter Cell | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tomb Raider | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tomba | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Tommy Heavenly6 | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Torbahead | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Toxic Avenger | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Toy Soldiers | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Tremors | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Trololo | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Turok | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Twisted Metal | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Ultra Vomit | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Universal Soldier | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Unreal | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Unreal Tournament | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Unreal Tournament 2004 | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Uzumaki | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Valedor: The Shattered Crown | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| VelociPastor | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Viridienne Ultime | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Virus | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Vocaloid | 7 | 7 | 4 | 0 | 0 | 7 | 0 | 0 |
| Voyage de Chihiro | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Wakfu | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Wallace & Gromit | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| War of the Worlds | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Warhammer 40,000: Space Marine | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Within Temptation | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Wolfenstein | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Woodruff | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Worms | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Wrong Turn | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Yakuza | 5 | 5 | 5 | 0 | 0 | 5 | 0 | 0 |
| Yomi no Kage | 3 | 3 | 0 | 0 | 3 | 0 | 3 | 0 |
| Yu-Gi-Oh | 10 | 10 | 3 | 0 | 0 | 10 | 0 | 0 |
| Zak et Crysta | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Zero Escape: The Nonary Games | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Zombi | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Zombies Ate My Neighbors | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
| Zootopia | 3 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| Zorro | 3 | 3 | 3 | 0 | 0 | 3 | 0 | 0 |
