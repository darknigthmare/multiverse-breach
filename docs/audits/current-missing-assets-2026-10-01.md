# Inventaire matériel des assets — 1 octobre 2026

Cet inventaire est un instantané du dépôt local après les corrections de sources et de catalogue du 1 octobre 2026, sur la base du lot `e887319`. Les chemins sont résolus depuis les registres et les fonctions réellement utilisées par le jeu, puis vérifiés dans `public/`. Le [JSON détaillé](current-missing-assets-2026-10-01.json) contient les empreintes SHA-256 des sources, les chemins absents, leurs propriétaires et les preuves comparées. Son `baselineSnapshot` conserve les compteurs avant cette reprise. Il ne repose pas sur le classeur de 3 853 lignes, inaccessible depuis le partage ChatGPT.

## Catalogue publié et fichiers présents

| Famille du catalogue | Déclarés | Présents | Absents |
| --- | ---: | ---: | ---: |
| Héros | 1 912 | 1 912 | 0 |
| Ennemis | 1 518 | 608 | 910 |
| Boss | 1 507 | 712 | 795 |
| Objectifs non combat | 334 | 334 | 0 |
| Icônes d'objets cataloguées | 1 597 | 1 597 | 0 |
| Kits de finale | 55 | 55 | 0 |
| Décors principaux | 1 192 | 304 | 888 |
| **Entrées** | **8 115** | **5 522** | **2 593** |

Le premier inventaire avait trouvé **670 héros présents encore marqués « manquants »** dans le manifeste du 25 août. La réconciliation de cette reprise a corrigé ces états à partir des fichiers et des preuves, sans produire de nouvelles images. Il n'y a désormais aucune divergence de présence dans ce manifeste. Deux alias explicites partagent une même image, d'où 8 113 chemins uniques pour 8 115 entrées. Les 1 911 héros du runtime ont également été vérifiés avec leurs contextes et packs complets : 1 938 chemins résolus, aucun absent. Le personnage joueur `player_anchor` explique l'entrée supplémentaire dans le catalogue.

Les décors ont aussi **894 textures compagnons déclarées**, dont 228 présentes et **666 absentes**. Le registre de rendu ne sert actuellement que 76 profils, 304 décors principaux et 228 compagnons ; tous ses chemins servis sont présents. Les 888 décors et 666 compagnons absents restent des productions à réaliser, pas des fichiers déclarés disponibles qui auraient disparu.

## Dossiers de mission

Sur **3 199 dossiers**, le registre compte **1 021 disponibles** et **2 178 en attente**. Aucune sortie déclarée disponible n'est absente.

- **2 161** dossiers en attente n'ont pas de fichier à leur chemin dédié.
- **17** ont déjà une image, mais leur preuve de production ne correspond pas au prompt actuel. Il faut conserver leur état en attente et examiner ou régénérer l'image ; changer seulement le statut ne valide pas la fidélité.

Les 17 cas sont détaillés dans le JSON. Ils comprennent Freeman, Ripley et Predator corrigés, puis 14 autres arcs historiques. Les anciennes images des stages 1, 2, 3 et 10 ont été conservées ; leurs nouveaux chemins et prompts spécifiques ne disposent pas encore d'une génération. Ces quatre scènes, puis Isla de Muerta/Barbossa au stage 269, expliquent le passage de 1 026 à 1 021 disponibles et de 2 156 à 2 161 chemins absents. Les anciennes images restent conservées ; le nouveau chemin Pirates demeure en attente. Les missions REX et Lanius restent également en attente à leur chemin corrigé.

## Icônes utilisées par le runtime mais hors du catalogue publié

Le générateur historique n'inclut un objet absent que s'il possède une référence, une ancre visuelle ou un prompt explicitement préparé. Le « zéro objet manquant » du catalogue ne couvre donc pas toutes les icônes demandées par le jeu.

Les équipements, événements, objets de lore et pickups totalisent **5 244 déclarations**, soit **2 803 chemins uniques** après partage des images entre usages. **1 622** chemins existent et **1 181** sont absents ; ces 1 181 chemins sont tous hors du catalogue publié.

| Origine du runtime | Déclarations / chemins propres | Présents | Absents |
| --- | ---: | ---: | ---: |
| Équipements | 1 587 | 955 | 632 |
| Événements | 525 | 497 | 28 |
| Objets de lore | 504 | 504 | 0 |
| Pickups / invocations / ultimes | 2 628 | 1 475 | 1 153 |

Ces lignes se recouvrent : **ne pas additionner leurs absences**. La déduplication globale donne 1 181, et non 1 813. Aucun de ces objets absents ne dispose actuellement d'une référence ou ancre visuelle dans sa déclaration. Certains représentent des accessoires canoniques ; d'autres sont des conversions de gameplay ou des invocations abstraites. Leur identité doit être vérifiée avant de produire une icône dite 1:1. Exemples : équipement CGU, holster Snub, matériel Yautja, pickups de `28 Days Later`, marqueurs de soutien de multiples univers.

## Provenance et fidélité

Les **2 015 enregistrements** du ledger sprite correspondent tous au SHA-256 de leur image matérialisée et au hash de leur prompt catalogué. **2 008** conservent le prompt réellement envoyé verbatim ; **7** ne conservent que le prompt de catalogue. Aucun fichier vérifié ici n'est un pointeur Git LFS.

Le premier manifeste ne déclarait que 1 181 preuves vérifiées ; la réconciliation le porte à **2 015**, en conservant les faits de génération et les différences entre prompts réellement enregistrés et prompts de catalogue. Une preuve de génération et un hash correct prouvent la traçabilité, **pas la conformité visuelle 1:1**. Les **25 substitutions Wave4 P0** du [registre séparé](fidelity-p0-wave4-2026-10-01.json) restent à revoir. Les incarnations récemment corrigées conservent leur examen visuel en attente. Les refus Bob et Vader ne sont pas comptés comme des générations réussies.

## Verrous de source propagés aux dossiers

Le premier [rapport de remédiation](../rift-dossiers/canon-remediation-2026-10-01.json) documente **16 impacts**, dont 15 entrées modifiées depuis le lot précédent. Le [rapport P0 complémentaire](../rift-dossiers/canon-p0-source-remediation-2026-10-01.json) ajoute 19 héros ; le [rapport scène et objets](adjacent-canon-scene-items-2026-10-01.md) ajoute le stage Pirates 269. Le suivi consolidé compte donc **36 dossiers** : 29 arcs de personnage et sept scènes. Le stage REX était déjà aligné et demeure dans le suivi. Les dix héros transmettent leur incarnation, équipement, ancre visuelle et références propres ; leurs anciens sprites pendants restent des candidats audités et ne sont plus fournis comme identité approuvée. Les six stages transmettent aussi les limites explicites de leur adaptation de gameplay. Aucun prompt ou hash de génération historique n'est réécrit.

| Dossier | Sujet et incarnation retenus | Source de référence |
| --- | --- | --- |
| 1 | RAAM, train Lightmass, *Gears of War* 2006 | Wikipédia du jeu |
| 2 | Scarab Protos, Metropolis/New Mombasa, *Halo 2* 2004 | Halopedia Metropolis |
| 3 | Queen, atmosphère de Hadley's Hope/LV-426, *Aliens* 1986 | Wikipédia du film |
| 10 | Nihilanth, chambre de Xen, *Half-Life* 1998 | Combine OverWiki Nihilanth |
| 12 | REX, hangar Shadow Moses, *Metal Gear Solid* 1998 | Histoire officielle Konami |
| 22 | Lanius, camp du Légat/Hoover Dam, *New Vegas* 2010 | Fallout Wiki Lanius |
| 9202 | Freeman, HEV Mark V/Gravity Gun, *Half-Life 2* 2004 | Site officiel Half-Life 2 |
| 9204 | Ripley, Nostromo/Narcissus, *Alien* 1979 | 20th Century Studios Alien |
| 9205 | Jungle Hunter, *Predator* 1987 | 20th Century Studios Predator |
| 9325 | Luke, tenue noire et sabre vert, *Return of the Jedi* 1983 | Databank officiel Star Wars |
| 9530 | Vader, armure fermée et sabre rouge, Bespin 1980 | Databank officiel Star Wars |
| 9531 | Han, DL-44 et tenue de contrebandier, *A New Hope* 1977 | Databank officiel Star Wars |
| 9648 | Ripley, M41A/M240 et P-5000, *Aliens* 1986 | 20th Century Studios Aliens |
| 10483 | Kevin, grand corps à deux yeux, *Minions* 2015 | Film et images officiels Illumination |
| 10484 | Stuart, un œil et guitare rouge, *Minions* 2015 | Film et images officiels Illumination |
| 10485 | Bob, petit corps chauve et Tim, *Minions* 2015 | Film et images officiels Illumination |

Les URLs exactes, équipements et empreintes des prompts et preuves figurent dans les rapports publics. Les prompts détaillés et identifiants des essais locaux sont conservés hors de la branche publique. Le recours à une wiki est distingué d'une page officielle. Les scènes originales d'arc et leurs adversaires de projet ne deviennent pas des événements canoniques du film ou du jeu cité. Les audits `rift:audit`, les tests ciblés et le lint contrôlent cette propagation ; aucune nouvelle génération de dossier n'est annoncée.

## Prochaines cibles

Le JSON fournit 15 boss réellement absents, leurs chemins stables et les références déjà consignées : Ambassador et General de *Mars Attacks*, Crustaceous Rex, les incarnations distinctes Queen LV-426 / Runner / Newborn / Praetomorph / Offspring, quatre incarnations Predator et Queen Antarctica / Predalien, ainsi que Bel-Shamharoth. Une référence enregistrée doit encore être comparée à une preuve visuelle précise avant génération.

**Les données de Crustaceous Rex sont également corrigées dans le runtime** : la recherche de cette reprise a trouvé un modèle Sony Pictures publié par [SciFi Japan](https://www.scifijapan.com/anime-animation/godzilla-the-series). Le monstre possède de longs membres antérieurs à doigts griffés, de minuscules membres postérieurs, une bouche rouge en forme de fleur et de nombreux tentacules autour d'une carapace olive épineuse. L'ancre historique « crabe rouge-brun avec énormes pinces » du catalogue sprite reste conservée comme trace de production, sans être une preuve fidèle. `loreBossOverrides.js` utilise maintenant le modèle Sony, une référence explicite et un statut visuel en attente ; ses actions restent qualifiées d'adaptation. Les essais visuels n'ont pas fourni d'asset accepté pour le jeu. Une prochaine production doit suivre cette ancre sans réécrire les preuves historiques.

L'union des sources explicites auditées couvre **13 447 chemins publics uniques**, dont **6 601 absents** : 2 593 sorties du catalogue, 666 compagnons de décor, 2 161 dossiers et 1 181 icônes runtime supplémentaires. Le premier instantané comptait 6 596 : la hausse de cinq correspond aux chemins des quatre scènes statiques et du stage Pirates désormais correctement nommés, tandis que leurs images historiques restent conservées. Ce total décrit le périmètre audité ; il ne prétend ni couvrir tout contenu possible du projet ni quantifier toutes les corrections de fidélité.

## Méthode reproductible

Lire `sprite-manifest.json` et `openai-sprite-prompts.jsonl`, dédupliquer leurs sorties et les `companionOutputs`, puis contrôler chaque fichier régulier non vide et son en-tête LFS. Comparer ensuite les hashes image/prompt de `openai-asset-ledger.jsonl`. Lire le registre et le catalogue des dossiers, en séparant présence physique et état de preuve. Importer enfin `heroes.js`, `battleItems.js`, `loreItemOverrides.js` et `spriteAssets.js` pour auditer les chemins effectivement retournés par les résolveurs de sprites et d'objets. Les imports relatifs sans extension sont résolus vers leur module `.js`, sans modifier les sources. L'inventaire lit les générateurs, registres et manifestes corrigés par les autres travaux de cette reprise ; aucun ledger ni bitmap historique n'a été réécrit.

La [suite Black Pearl/REX](rex-black-pearl-followup-2026-10-01.md) étend le suivi à 31 héros et sept scènes, avec les actions source, réserves de munition et phases de combat. Aucun asset n’a été installé dans ce lot ; les compteurs de présence restent ceux de cet inventaire. Les hashes du JSON sont recalculés à partir des fichiers actuels.
