# Audit de generation des stages Dragon Ball Z et Tokyo Ghoul

Date : 2026-07-24

## Perimetre

Deux packs complets de stages ont ete produits avec le generateur d'images OpenAI integre a Codex, a raison d'un appel distinct par ressource, soit 14 generations. Les images sont des compositions pixel art originales destinees au projet. Aucun asset officiel pret a l'emploi n'a ete copie ou telecharge dans le depot.

Le traitement apres generation a ete limite aux operations techniques necessaires au runtime :

- recadrage et redimensionnement aux dimensions contractuelles ;
- normalisation geometrique des deux plateaux Tactics afin d'obtenir exactement 8 colonnes et 6 lignes ;
- suppression du chroma magenta des kits transparents ;
- mise a zero du RGB cache sous les pixels totalement transparents ;
- encodage WebP dans le mode RGB ou RGBA attendu.

## References consultees

### Dragon Ball Z

| Sujet | Source | Elements visuels retenus |
| --- | --- | --- |
| Cell Games Arena | [Dragon Ball Official Site - Cell Games arena](https://es.dragon-ball-official.com/news/01_203.html) | Plateforme carree en dalles de pierre claire, desert rocheux et reliefs lointains. |
| Construction de l'arene | [Dragon Ball Official Site - Cell cuts the arena tiles](https://en.dragon-ball-official.com/news/01_1258.html) | Dalles regulieres taillees dans la roche et architecture volontairement depouillee. |
| Namek | [Dragon Ball Official Site - Namek location](https://en.dragon-ball-official.com/news/01_536.html) | Ciel vert, eau turquoise, iles et rochers arrondis, vegetation extraterrestre. |
| Ecologie de Namek | [Dragon Ball Official Site - Namekian ecology](https://en.dragon-ball-official.com/news/01_1917.html) | Trois soleils, arbres Ajisa, reliefs violets et ambiance lumineuse sans nuit. |
| Salle de l'Esprit et du Temps | [Dragon Ball Official Site - Room of Spirit and Time](https://dragon-ball-official.com/news/01_452.html) | Espace blanc sans horizon, entree du temple, horloges et immensite vide. |
| Conditions de la salle | [Dragon Ball Official Site - environment details](https://dragon-ball-official.com/news/01_1957.html) | Sol blanc continu, profondeur atmospherique minimale et architecture isolee. |

### Tokyo Ghoul

| Sujet | Source | Elements visuels retenus |
| --- | --- | --- |
| Anteiku, Ward 20 et Cochlea | [Marvelous - Tokyo Ghoul story](https://www.marv.jp/special/tokyoghoul/first/story.html) | Facade urbaine d'Anteiku, ville nocturne du Ward 20 et structure carcerale de Cochlea. |
| Anteiku et Ward 20, saison 1 | [Marvelous - Tokyo Ghoul season 1 story](https://www.marv.jp/special/tokyoghoul/first/story_1st.html) | Cafe discret integre au quartier, rues et toits urbains japonais. |
| Production officielle | [Marvelous - Tokyo Ghoul staff](https://www.marv.jp/special/tokyoghoul/first/staff_1st.html) | Verification de la serie et de son identite visuelle officielle. |
| Anteiku | [Tokyo Ghoul Wiki - Anteiku](https://tokyoghoul.fandom.com/wiki/Anteiku) | Organisation de la facade, fenetres, auvent, volumes interieurs et implantation dans le quartier. |
| Cochlea | [Tokyo Ghoul Wiki - Cochlea](https://tokyoghoul.fandom.com/wiki/Cochlea) | Puits central cylindrique, coursives concentriques, cellules metalliques et niveaux superposes. |

Les pages non officielles ont uniquement complete les informations de disposition spatiale qui n'etaient pas lisibles sur les pages editeur. Les choix de couleur, de composition et de pixel art restent originaux.

## Ressources finales

### Dragon Ball Z

| Fichier | Scene | Contrat gameplay |
| --- | --- | --- |
| `public/backgrounds/lore-stages/dragon-ball-z/combat.webp` | Cell Games Arena | Vue laterale stricte, sol de duel continu, silhouettes et effets absents. |
| `public/backgrounds/lore-stages/dragon-ball-z/melee.webp` | Namek | Apercu complet avec plateforme principale large et quatre plateformes secondaires atteignables. |
| `public/backgrounds/lore-stages/dragon-ball-z/melee-backdrop.webp` | Namek | Decor seul, sans plateforme jouable integree au premier plan. |
| `public/backgrounds/lore-stages/dragon-ball-z/melee-platforms.webp` | Namek | Kit RGBA de plateformes rocheuses et namekiennes isolees. |
| `public/backgrounds/lore-stages/dragon-ball-z/rpg.webp` | Salle de l'Esprit et du Temps | Vue laterale 2.5D, avant-plan marchable et deux lignes de combat lisibles. |
| `public/backgrounds/lore-stages/dragon-ball-z/tactics.webp` | Cell Games Arena | Plateau en perspective trois-quarts, exactement 8 x 6 cases, lignes basses au premier plan. |
| `public/backgrounds/lore-stages/dragon-ball-z/tactics-tiles.webp` | Cell Games Arena | Kit RGBA de dalles, couvertures et dangers assortis au plateau. |

### Tokyo Ghoul

| Fichier | Scene | Contrat gameplay |
| --- | --- | --- |
| `public/backgrounds/lore-stages/tokyo-ghoul/combat.webp` | Exterieur d'Anteiku, Ward 20 | Vue laterale stricte, rue de duel plane, pluie et ville sans personnage ni enseigne lisible. |
| `public/backgrounds/lore-stages/tokyo-ghoul/melee.webp` | Toits du Ward 20 | Apercu complet avec grand toit principal et quatre plateformes urbaines atteignables. |
| `public/backgrounds/lore-stages/tokyo-ghoul/melee-backdrop.webp` | Toits du Ward 20 | Skyline pluvieuse seule, sans plateformes jouables incrustees. |
| `public/backgrounds/lore-stages/tokyo-ghoul/melee-platforms.webp` | Ward 20 | Kit RGBA de toits, passerelles et structures metalliques isolees. |
| `public/backgrounds/lore-stages/tokyo-ghoul/rpg.webp` | Rue devant Anteiku | Vue laterale 2.5D, trottoir marchable et deux lignes de combat degagees. |
| `public/backgrounds/lore-stages/tokyo-ghoul/tactics.webp` | Cochlea | Plateau carceral en perspective trois-quarts, exactement 8 x 6 cases, profondeur lisible. |
| `public/backgrounds/lore-stages/tokyo-ghoul/tactics-tiles.webp` | Cochlea | Kit RGBA de dalles, couvertures et dangers metalliques assortis. |

## Prompt set final

Tous les prompts imposaient : pixel art detaille original, aucune interface, aucun texte, aucun logo, aucun personnage, aucune silhouette, aucune marque lisible, lisibilite gameplay prioritaire et composition adaptee au mode.

| Ressource | Resume du prompt final |
| --- | --- |
| DBZ `combat` | Cell Games Arena en side-view strict, longue dalle de duel continue, desert rocheux et horizon degage. |
| DBZ `melee` | Namek en vue de combat plateforme, grand sol principal, quatre plateformes atteignables, eau, arbres Ajisa et trois soleils. |
| DBZ `melee-backdrop` | Panorama Namek sans aucune plateforme de gameplay, ciel vert, eau et archipels violets. |
| DBZ `melee-platforms` | Six plateformes namekiennes isolees sur chroma magenta uniforme, silhouettes et epaisseurs variees mais jouables. |
| DBZ `rpg` | Salle de l'Esprit et du Temps en 2.5D lateral, deux couloirs de combat, sol blanc et entree lointaine. |
| DBZ `tactics` | Cell Games Arena convertie en plateau isometrique lisible de 8 x 6 cases, sans element superpose aux cellules. |
| DBZ `tactics-tiles` | Huit elements isoles assortis : dalles, murets, rochers et cases de danger sur chroma magenta. |
| Tokyo Ghoul `combat` | Rue pluvieuse devant un cafe discret inspire d'Anteiku, side-view strict et ligne de sol continue. |
| Tokyo Ghoul `melee` | Toits pluvieux du Ward 20, toiture principale large et quatre plateformes urbaines atteignables. |
| Tokyo Ghoul `melee-backdrop` | Skyline nocturne et pluvieuse du Ward 20, decor seul sans surface jouable. |
| Tokyo Ghoul `melee-platforms` | Six plateformes urbaines isolees, toits, passerelles et metal sur chroma magenta uniforme. |
| Tokyo Ghoul `rpg` | Exterieur d'Anteiku en 2.5D lateral, rue et trottoir formant deux lignes de combat claires. |
| Tokyo Ghoul `tactics` | Cochlea en arene carcerale trois-quarts, puits cylindrique et plateau exact de 8 x 6 cases. |
| Tokyo Ghoul `tactics-tiles` | Huit elements isoles de Cochlea : acier, grilles, couvertures, balises et dangers sur chroma magenta. |

## Validation technique

| Controle | Resultat |
| --- | --- |
| 14 fichiers attendus presents | PASS |
| `combat`, `melee`, `melee-backdrop`, `rpg` en 1672 x 941 RGB | PASS |
| `tactics` en 1448 x 1086 RGB | PASS |
| Kits en 1254 x 1254 RGBA | PASS |
| Transparence reelle avec pixels alpha 0 et 255 | PASS |
| RGB cache sous alpha 0 integralement nul | PASS |
| Chroma magenta visible residuel | 0 pixel |
| Grilles Tactics | 8 colonnes x 6 lignes |
| Personnages, UI, texte, logo ou marque lisible integres | Aucun |
| Inspection visuelle des 14 compositions | PASS |

La normalisation des grilles Tactics a utilise un remappage geometrique des cellules deja generees. Aucun dessin procedural ou asset externe n'a ete ajoute.

## Exclusions respectees

- Aucun fichier hors du perimetre attribue n'a ete modifie par cette intervention ; les changements concurrents deja presents dans le workspace ont ete laisses intacts.
- Aucun manifeste ou registre (`sprite-manifest.json`, `openai-sprite-prompts.jsonl`, `generatedStageAssets.json`) n'a ete regenere.
- Aucun commit, push ou deploiement Vercel n'a ete effectue.
