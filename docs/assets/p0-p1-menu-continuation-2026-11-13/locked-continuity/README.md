# Continuités structurées des acteurs — 13 novembre 2026

Le lecteur de backlog ignorait le champ `continuity` lorsqu’il était un objet
`{ id, label, status: "locked", source }`. Les sources et les fiches actives
portaient déjà cette déclaration. Aucun personnage, aucune incarnation et aucun
asset n’ont été ajoutés par cette correction.

Critère d’acceptation : conserver la déclaration de source d’un acteur exact,
afficher sa provenance dans son dossier, laisser la précision du modèle et de la
tenue ouverte et préserver tous les contrôles de raster, animation et ressemblance.
Un verrou de métadonnées ne constitue jamais une validation graphique 1:1.

## Périmètre vérifié

- Base de travail : `fc8a57f795b7d1e68c7f1f7ff82593c7cef8916b`.
- 91 déclarations candidates du registre ont été comparées aux acteurs réellement
  présents dans `ENEMIES_DB`, après les overrides et les packs.
- 62 contrats correspondent exactement à des boss mondiaux actifs ; 29 déclarations
  ne sont pas appliquées à ces acteurs ou sont remplacées par une autre source.
  Ces 29 ne bénéficient pas de la récupération.
- 40 acteurs composent le lot relu ci-dessous. Les 20 correspondances actives
  supplémentaires bénéficient du même correctif de lecture, avec des tests propres.
- Deux contrats mentionnent explicitement manga et anime : le Titan Originel
  d’Eren et Gotou. Ils conservent une tâche P1 `ACTOR_CONTINUITY_AMBIGUOUS` et une
  incarnation vide. Un pack ne choisit pas silencieusement leur support.
- Les 60 autres déclarations récupérées remplacent uniquement
  `INCARNATION_UNSPECIFIED` par `ACTOR_CONTINUITY_PRECISION` P2 : modèle, tenue,
  forme, scène et comparaison visuelle restent à préciser. Les 1 440 récupérations
  historiques par pack gardent leur compteur distinct.

Les `actorId` de ces boss sont vides dans le runtime actuel. Leurs identités sont
les clés exactes `[univers, "name:nom"]` ; les `legacyWorldBossId` restent des
champs de provenance et ne sont pas inventés comme nouveaux IDs de sauvegarde.
Les labels des 40 acteurs ont été relus avec leur URL et leur `visualAnchor`.
L’absence de la combinaison littérale manga/anime n’est pas une preuve de
précision parfaite : les références de franchise, phases et adaptations restent
soumises à la tâche P2 et à la revue de source.

## Règle de récupération

`inspectActorLockedContinuity()` accepte uniquement un rôle `worldBoss` effectif,
le contrat structuré complet du registre courant, et la même identité, le même
univers, nom, ID historique, audit, URL HTTPS et contrat visuel. Un objet libre
avec `label`, une URL seulement plausible ou un statut différent ne suffit pas.
Les déclarations textuelles/localisées existantes gardent leur priorité.

Les champs exportés portent `ACTOR_LOCKED_CONTINUITY`, la provenance
`continuity.label`, l’ID et l’audit du contrat, `requiresModelReview: true`,
`source1to1Verified: false` et `artApproved: false`. Les tâches demeurent ouvertes.
Les conflits de packs restent visibles même si la déclaration acteur est ambiguë.

L’exporteur ajoute `structuredContinuitiesRecovered` et
`actorContinuityAmbiguities`. `continuitiesRecovered` conserve exactement son
sens historique de récupération par `EXACT_PACK_BINDING`. Les historiques de
backlog et les sources des acteurs ne sont pas réécrits.

## Lot de 40 identités

Les URL, contrats visuels et empreintes de source exacts figurent dans la
[fixture vérifiée](../../../../scripts/fixtures/actorLockedContinuity20261113.json)
et dans [la preuve runtime avant correction](runtime-source-before.json).

| Nº | Clé acteur exacte | Continuité déclarée | Source relue |
| --- | --- | --- | --- |
| 1 | `["Alien 3","name:Runner / Dragon"]` | Alien 3 (1992) - Fury 161 | [DLC/Alien3/data/loreWorldBossOverrides.js:5](../../../../DLC/Alien3/data/loreWorldBossOverrides.js) |
| 2 | `["Alien Resurrection","name:The Newborn"]` | Alien Resurrection (1997) - USM Auriga | [DLC/AlienResurrection/data/loreWorldBossOverrides.js:5](../../../../DLC/AlienResurrection/data/loreWorldBossOverrides.js) |
| 3 | `["Alien vs Predator","name:Antarctic Xenomorph Queen"]` | Alien vs. Predator (2004) - Bouvet Island pyramid | [DLC/AlienVsPredator/data/loreWorldBossOverrides.js:5](../../../../DLC/AlienVsPredator/data/loreWorldBossOverrides.js) |
| 4 | `["Alien: Covenant","name:Praetomorph"]` | Alien: Covenant (2017) - Covenant cargo-bay finale | [DLC/AlienCovenant/data/loreWorldBossOverrides.js:5](../../../../DLC/AlienCovenant/data/loreWorldBossOverrides.js) |
| 5 | `["Alien: Romulus","name:The Offspring"]` | Alien: Romulus (2024) - Corbelan finale | [DLC/AlienRomulus/data/loreWorldBossOverrides.js:5](../../../../DLC/AlienRomulus/data/loreWorldBossOverrides.js) |
| 6 | `["Aliens","name:Alien Queen"]` | Aliens (1986) - LV-426 Queen | [DLC/Aliens/data/loreWorldBossOverrides.js:5](../../../../DLC/Aliens/data/loreWorldBossOverrides.js) |
| 7 | `["Aliens vs Predator: Requiem","name:Predalien"]` | Aliens vs. Predator: Requiem (2007) - Gunnison | [DLC/AliensVsPredatorRequiem/data/loreWorldBossOverrides.js:5](../../../../DLC/AliensVsPredatorRequiem/data/loreWorldBossOverrides.js) |
| 8 | `["Borderlands","name:The Destroyer"]` | Borderlands (2009) - Vault finale | [DLC/Borderlands/data/loreWorldBossOverrides.js:5](../../../../DLC/Borderlands/data/loreWorldBossOverrides.js) |
| 9 | `["Breaking Bad","name:Jack Welker"]` | Breaking Bad - Felina compound finale | [DLC/BreakingBad/data/loreWorldBossOverrides.js:5](../../../../DLC/BreakingBad/data/loreWorldBossOverrides.js) |
| 10 | `["Cells at Work!","name:Cancer Cell"]` | Cells at Work! anime - Cancer Cell arc | [DLC/CellsAtWork/data/loreWorldBossOverrides.js:5](../../../../DLC/CellsAtWork/data/loreWorldBossOverrides.js) |
| 11 | `["Chainsaw Man","name:Gun Devil - 20 Percent Manifestation"]` | Chainsaw Man manga - Gun Devil incident | [DLC/ChainsawMan/data/loreWorldBossOverrides.js:5](../../../../DLC/ChainsawMan/data/loreWorldBossOverrides.js) |
| 12 | `["Chicken Run","name:Mrs Tweedy and the Pie Machine"]` | Chicken Run (2000) - Tweedy farm escape | [DLC/ChickenRun/data/loreWorldBossOverrides.js:5](../../../../DLC/ChickenRun/data/loreWorldBossOverrides.js) |
| 13 | `["Cowboy Bebop","name:Vicious"]` | Cowboy Bebop anime - The Real Folk Blues | [DLC/CowboyBebop/data/loreWorldBossOverrides.js:5](../../../../DLC/CowboyBebop/data/loreWorldBossOverrides.js) |
| 14 | `["Cyberpunk: Edgerunners","name:Adam Smasher Full Borg"]` | Cyberpunk: Edgerunners - Arasaka Tower finale | [DLC/CyberpunkEdgerunners/data/loreWorldBossOverrides.js:5](../../../../DLC/CyberpunkEdgerunners/data/loreWorldBossOverrides.js) |
| 15 | `["Demon Slayer","name:Muzan Kibutsuji"]` | Demon Slayer manga - Sunrise Countdown arc | [DLC/DemonSlayer/data/loreWorldBossOverrides.js:5](../../../../DLC/DemonSlayer/data/loreWorldBossOverrides.js) |
| 16 | `["Discworld","name:Bel-Shamharoth"]` | Discworld - The Colour of Magic temple encounter | [DLC/Discworld/data/loreWorldBossOverrides.js:5](../../../../DLC/Discworld/data/loreWorldBossOverrides.js) |
| 17 | `["Dragon Ball Z","name:Kid Buu"]` | Dragon Ball Z - Kid Buu saga | [DLC/DragonBallZ/data/loreWorldBossOverrides.js:5](../../../../DLC/DragonBallZ/data/loreWorldBossOverrides.js) |
| 18 | `["Dungeon Meshi","name:The Winged Lion"]` | Delicious in Dungeon manga - demon finale | [DLC/DungeonMeshi/data/loreWorldBossOverrides.js:5](../../../../DLC/DungeonMeshi/data/loreWorldBossOverrides.js) |
| 19 | `["Earthworm Jim","name:Queen Slug-for-a-Butt"]` | Earthworm Jim - Buttville finale | [DLC/EarthwormJim/data/loreWorldBossOverrides.js:5](../../../../DLC/EarthwormJim/data/loreWorldBossOverrides.js) |
| 20 | `["Ecco the Dolphin","name:Vortex Queen"]` | Ecco the Dolphin (1992) - Welcome to the Machine finale | [DLC/EccoTheDolphin/data/loreWorldBossOverrides.js:5](../../../../DLC/EccoTheDolphin/data/loreWorldBossOverrides.js) |
| 21 | `["Elvira","name:Vincent Talbot"]` | Elvira: Mistress of the Dark (1988) | [DLC/Elvira/data/loreWorldBossOverrides.js:5](../../../../DLC/Elvira/data/loreWorldBossOverrides.js) |
| 22 | `["Final Fantasy VII","name:Safer Sephiroth"]` | Final Fantasy VII (1997) - Northern Crater | [DLC/FinalFantasyVII/data/loreWorldBossOverrides.js:5](../../../../DLC/FinalFantasyVII/data/loreWorldBossOverrides.js) |
| 23 | `["Final Fantasy VIII","name:Ultimecia"]` | Final Fantasy VIII - Ultimecia Castle finale | [DLC/FinalFantasyVIII/data/loreWorldBossOverrides.js:5](../../../../DLC/FinalFantasyVIII/data/loreWorldBossOverrides.js) |
| 24 | `["Final Fantasy XIII","name:Orphan"]` | Final Fantasy XIII - Orphan's Cradle | [DLC/FinalFantasyXIII/data/loreWorldBossOverrides.js:5](../../../../DLC/FinalFantasyXIII/data/loreWorldBossOverrides.js) |
| 25 | `["Flashback","name:Master Brain"]` | Flashback (1992) - Morph planet finale | [DLC/Flashback/data/loreWorldBossOverrides.js:5](../../../../DLC/Flashback/data/loreWorldBossOverrides.js) |
| 26 | `["Fullmetal Alchemist","name:Father"]` | Fullmetal Alchemist: Brotherhood - Promised Day | [DLC/FullmetalAlchemist/data/loreWorldBossOverrides.js:5](../../../../DLC/FullmetalAlchemist/data/loreWorldBossOverrides.js) |
| 27 | `["Gantz","name:Nurarihyon"]` | Gantz manga - Osaka arc | [DLC/Gantz/data/loreWorldBossOverrides.js:5](../../../../DLC/Gantz/data/loreWorldBossOverrides.js) |
| 28 | `["Ghostbusters","name:Stay Puft Marshmallow Man"]` | Ghostbusters (1984) - Gozer rooftop finale | [DLC/Ghostbusters/data/loreWorldBossOverrides.js:5](../../../../DLC/Ghostbusters/data/loreWorldBossOverrides.js) |
| 29 | `["Godzilla","name:Destoroyah"]` | Godzilla vs. Destoroyah (1995) - Heisei continuity | [DLC/Godzilla/data/loreWorldBossOverrides.js:5](../../../../DLC/Godzilla/data/loreWorldBossOverrides.js) |
| 30 | `["Gremlins","name:Stripe"]` | Gremlins (1984) - department store finale | [DLC/Gremlins/data/loreWorldBossOverrides.js:5](../../../../DLC/Gremlins/data/loreWorldBossOverrides.js) |
| 31 | `["House of the Dead","name:Magician Type-0"]` | The House of the Dead (1997) - Curien Mansion incident | [DLC/HouseOfTheDead/data/loreWorldBossOverrides.js:5](../../../../DLC/HouseOfTheDead/data/loreWorldBossOverrides.js) |
| 32 | `["House of the Dead 2","name:Emperor Type Alpha"]` | The House of the Dead 2 (1998) - Goldman incident | [DLC/HouseOfTheDead2/data/loreWorldBossOverrides.js:5](../../../../DLC/HouseOfTheDead2/data/loreWorldBossOverrides.js) |
| 33 | `["House of the Dead 3","name:Wheel of Fate"]` | The House of the Dead III (2002) - EFI Research Facility | [DLC/HouseOfTheDead3/data/loreWorldBossOverrides.js:5](../../../../DLC/HouseOfTheDead3/data/loreWorldBossOverrides.js) |
| 34 | `["Kaamelott","name:Lancelot du Lac"]` | Kaamelott - Premier Volet (2021) | [DLC/Kaamelott/data/loreWorldBossOverrides.js:5](../../../../DLC/Kaamelott/data/loreWorldBossOverrides.js) |
| 35 | `["Left 4 Dead","name:Tank"]` | Left 4 Dead - evacuation finale ruleset | [DLC/Left4Dead/data/loreWorldBossOverrides.js:5](../../../../DLC/Left4Dead/data/loreWorldBossOverrides.js) |
| 36 | `["LittleBigPlanet","name:The Negativitron"]` | LittleBigPlanet 2 - Cosmos finale | [DLC/LittleBigPlanet/data/loreWorldBossOverrides.js:5](../../../../DLC/LittleBigPlanet/data/loreWorldBossOverrides.js) |
| 37 | `["M3GAN","name:M3GAN"]` | M3GAN (2022) - Funki prototype continuity | [DLC/M3GAN/data/loreWorldBossOverrides.js:5](../../../../DLC/M3GAN/data/loreWorldBossOverrides.js) |
| 38 | `["Metal Gear Rising","name:Senator Steven Armstrong"]` | Metal Gear Rising: Revengeance - Excelsus finale | [DLC/MetalGearRising/data/loreWorldBossOverrides.js:5](../../../../DLC/MetalGearRising/data/loreWorldBossOverrides.js) |
| 39 | `["One Punch Man","name:Boros"]` | One-Punch Man season 1 - Dark Matter Thieves finale | [DLC/OnePunchMan/data/loreWorldBossOverrides.js:5](../../../../DLC/OnePunchMan/data/loreWorldBossOverrides.js) |
| 40 | `["Predator 2","name:City Hunter"]` | Predator 2 (1990) - Los Angeles 1997 | [DLC/Predator2/data/loreWorldBossOverrides.js:5](../../../../DLC/Predator2/data/loreWorldBossOverrides.js) |

## Vérification et limites

La première preuve runtime a terminé avec un code de sortie 0 : 62 contrats
actifs, 60 déclarations non composites, deux ambiguës et un lot de 40.
L’empreinte JSON complète de `ENEMIES_DB` reste identique avant/après inspection
(`04837866c0f42ce5252ba0f64ff32a7e13d115ad1339465bf6f768117ffcd580`).
Le [reçu du processus](runtime-source-before-exit.json) conserve sa commande et
ses heures. Le script archivé utilise les chemins temporaires de cette session ;
le test dédié ci-dessous est le point d’entrée reproductible.

Résultat final : **99 tests sur 99 passent**, code de sortie 0 (51 tests dédiés
et les 48 tests historiques R9). Les empreintes des cinq fichiers modifiés sont
identiques avant et après ce passage.

Les tests dédiés couvrent le runtime des 40 acteurs, les 20 autres contrats, les
deux cas ambigus, les rejets d’identité/label/statut/audit/URL, la priorité des
champs existants, la conservation des tâches de raster et l’absence de mutation.
Un test lance réellement l’exporteur avec un arbre synthétique vide pour vérifier
ses compteurs ; cet arbre n’est pas une preuve de présence ou d’absence d’assets.
Aucune génération graphique ou validation visuelle n’est attribuée à ce chantier.
Les références distantes sont celles du code courant ; leur contenu n’a pas été
recertifié par une consultation réseau pendant ce correctif.

Commande de validation (Node 22, heap maximal de 1 Go, un CPU, sans Vite) :

```sh
taskset --cpu-list 0 /tmp/p0-p1-npm-cache/_npx/52027bd8fc0022aa/node_modules/node/bin/node --max-old-space-size=1024 --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 scripts/actorLockedContinuity20261113.test.mjs scripts/actorFidelityR9.test.mjs
```

Le premier passage dédié a relevé une fixture incomplète pour les IDs des deux
cas manga/anime ; ces IDs ont été relus depuis le runtime réel, puis les suites
ont été rejouées. Les reçus de processus conservent également cet échec initial.
La suite R9 avait deux attentes historiques périmées : 4 936 acteurs au lieu de
4 937 et 20 153 droits de costumes au lieu de 20 157. Le même échec apparaît avec
le helper de HEAD via un loader temporaire ([reçu](r9-head-baseline-exit.json),
[journal](r9-head-baseline.log)). Les attentes ont été remplacées par les
invariants des registres : 4 937 identités uniques, quatre collections originales
par acteur et 60 concepts personnels liés, soit 19 808 droits originaux, auxquels
s’ajoutent les 349 droits officiels déjà attendus. Les contrôles de rétention des
anciens IDs, collisions, acteurs exacts et absence de mutation restent présents.
Le [détail des compteurs](wardrobe-count-proof.json) conserve cette dérivation.

Le résultat final est enregistré dans [validation-exit.json](validation-exit.json)
et [validation.log](validation.log).
L’audit global utilisant l’arbre d’assets réel relève de la publication du lot
complet ; il doit conserver une empreinte du source courant effectivement utilisé.
