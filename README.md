# Multiverse Breach — Brèche multiverselle

Jeu de crossover indépendant et non officiel, jouable dans le navigateur. Le joueur incarne une **Ancre**, forme une escouade et traverse les univers depuis le Nexus. La progression relie missions, recrutement, portails, collection de cartes, équipements et campagne originale.

Le même catalogue de personnages alimente plusieurs moteurs : **RPG à jauge ATB**, **Tactics sur grille**, **Mêlée sur plateformes** et **Combat en duel**. L’interface utilise React ; les combats sont dessinés en Canvas 2D. Les univers, personnages et marques cités appartiennent à leurs ayants droit.

**État de référence : lot 16 validé le 1 novembre 2026.** Le développement continue en parallèle, par groupes disjoints de 40 personnages par agent. Les chiffres de cette page décrivent la dernière livraison clôturée ; un lot en cours ne compte pas comme une livraison validée.

[Installation](#installation) · [Jouer](#jouer) · [Modes](#modes-de-jeu) · [Couverture réelle](#couverture-réelle) · [Tactics et verticalité](#tactics--textures-par-case-et-verticalité) · [Vérification](#vérification) · [Architecture](#architecture) · [Documentation](#documentation)

## Installation

Prérequis : **Node.js 22.12 ou version ultérieure** et npm. Le dépôt contient les ressources graphiques ; son téléchargement et l’installation occupent plusieurs gigaoctets.

Depuis la racine du projet :

```bash
npm ci
npm run dev
```

Ouvrir l’adresse affichée par Vite : **http://localhost:5188** par défaut. Si ce port est occupé, Vite peut en choisir un autre. Les réglages sont dans [vite.config.js](vite.config.js).

Pour vérifier et produire la version statique :

```bash
npm run build
npm run preview
```

La prévisualisation utilise **http://localhost:4173** par défaut. `npm run build` lance d’abord le cycle `prebuild` complet : tests, audits des données, registres d’assets et progression. Cette commande peut prendre plusieurs minutes. Les fichiers produits se trouvent dans `dist/`.

Le jeu peut démarrer avec une **Trace locale**, sans compte cloud. La synchronisation de compte dépend d’un service configuré sur le déploiement ; elle ne fait pas partie des prérequis pour explorer le jeu localement.

## Jouer

1. Depuis l’écran titre, créer ou reprendre une Trace, puis suivre le prologue de l’Ancre.
2. Dans le Nexus, préparer l’escouade, consulter les missions et choisir un mode. Les personnages et contenus accessibles suivent la progression de la Trace.
3. Lire le briefing : une mission peut demander une élimination, une extraction, une escorte, un contrôle de zone ou une épreuve sans combat.
4. Utiliser **Combat custom** pour composer un affrontement dans les quatre moteurs principaux, contre le CPU ou un second joueur local.

Le Nexus regroupe aussi les portails et cartes, les archives des univers, les équipements, les campagnes et les courses de kart. La Cité-Mosaïque sert d’espace d’exploration RPG.

La progression est conservée dans le stockage local du navigateur. Les outils du compte permettent d’exporter et d’importer une Trace ; exporter avant de changer de navigateur ou d’effacer ses données. Les commandes de lecture et d’écriture cloud sont distinctes, avec gestion des conflits. **Le second joueur des combats custom est local** : ces options ne désignent pas un multijoueur en ligne.

### Commandes essentielles

Les panneaux affichés dans chaque mode restent la référence pour les actions disponibles, leur coût et leur cible.

| Mode | Interaction principale |
| --- | --- |
| RPG | Sélectionner un héros, choisir une action, sélectionner les cibles valides et confirmer. Le panneau de ciblage permet d’annuler et de choisir si l’ATB attend pendant cette sélection. |
| Tactics | Sur terrain vertical, inspecter la surface et son étage, puis confirmer avec Entrée ou le bouton du panneau. Sur terrain plat, cliquer la case ou la cible. Glisser sur le plateau déplace la caméra ; la molette règle le zoom. |
| Mêlée | Commandes clavier reconfigurables, commandes tactiles et lecture des manettes. Par défaut J1 : positions physiques `KeyQ`/`KeyD`, `Espace` pour sauter, `J` attaque légère, `K` charge, `L` spéciale, `I` ou `Maj` garde. Le panneau affiche les libellés adaptés et les affectations J2. |
| Combat | Utiliser le panneau propre au duel et ses commandes tactiles. Ses actions et affectations sont distinctes de celles de la Mêlée. |

## Modes de jeu

Les noms internes et les noms utilisés dans les rapports ne sont pas toujours identiques. Cette correspondance évite de confondre les deux moteurs de combat en temps réel.

| Nom utilisé | Identifiant du mode | Fonctionnement actuel |
| --- | --- | --- |
| **RPG** | `RPG` | Jauges ATB, ciblage manuel, actions simples, secondaires, défense, super et invocation ou renfort selon le profil du personnage. Les protections et soutiens agissent sur les alliés sans créer de dégâts offensifs. |
| **Tactics / Tactique** | `Tactics` | Tours d’unités, déplacements sur grille en perspective 3/4, coûts de terrain, obstacles, couvertures, orientation et objectifs de mission ; dix-neuf terrains verticaux, dont seize secteurs d’univers avec reliefs naturels, gués, ravins, passerelles et décors physiques. Caméra avec déplacement et zoom. |
| **Mêlée / Smash** | `Smash` | Combat sur plateformes, déplacements physiques, sauts, garde, charge, prises de rebord et objectifs d’arène. Les personnages couverts possèdent un manifeste d’animation par état. |
| **Combat / Fighter** | `Fighter` | Moteur de duel distinct, avec sa préparation, ses séquences de présentation, ses actions et ses conditions de victoire. |

Les épreuves sans combat réutilisent certaines commandes d’arène pour des objectifs spécifiques. Une mission d’escorte ou de sauvetage conserve sa propre condition de réussite ; elle n’est pas automatiquement un combat d’élimination.

## Couverture réelle

Une entrée dans le catalogue, une capacité nommée, une recette de présentation et un dessin livré sont des mesures différentes. Les compteurs proviennent de l’[audit figé du lot 16](docs/combat-fidelity-wave16-2026-10-28/current.json). La [couverture cumulative](docs/combat-fidelity-wave16-2026-10-28/coverage-all.csv) comprend chaque personnage ; le [tableau du lot](docs/combat-fidelity-wave16-2026-10-28/coverage.csv) conserve les versions revues et les quatre identités suspendues.

| Périmètre au terme du lot 16 | Mesure vérifiée |
| --- | --- |
| Catalogue | **1 911 personnages**, **525 univers** |
| Capacités explicitement rédigées | 1 582 personnages, 4 650 actions simples, secondaires et défenses ; 1 517 kits complets et 65 partiels |
| Présentations complètes32 | **546 personnages** ; 1 365 manquantes |
| Présentations partielles | 2, suivies séparément |
| Animation Mêlée complète45 | **17 personnages** ; 1 894 manquantes |
| Bases de combat16 corrigées | 494 personnages |
| Recettes de présentation | 560 personnages, 3 920 associations personnage/phase |
| Invocations et renforts natifs16 | 62 planches |
| Actions supplémentaires16 | 1 planche, 16 poses |
| Familier de protection autonome16 | 1 planche, distincte des invocations RPG |
| Terrains Tactics verticaux | 19 : seize secteurs d’univers et trois Nexus |
| Décors animés | 435 mécanismes dans 216 univers ; 309 univers sans mécanisme localisé |
| Ressources de cet audit combat | 1 237 PNG dans 138 registres ; 982 PNG et 127 registres antérieurs préservés |

Cet inventaire combat ne comprend pas toutes les images du jeu : portraits, décors, objets, cartes et illustrations possèdent leurs propres catalogues. Les 525 univers ont une ambiance par défaut ; les mécanismes liés à des scènes précises constituent une couverture supplémentaire.

Le **lot 16** livre **120 personnages en trois groupes parallèles de 40** : 120 présentations32 et 120 bases16, Senua avec 45 états/180 poses, six renforts RPG16, le Fox Devil16,16 dessins supplémentaires pour Starburst Stream de Kirito et un Shield Pal autonome16. Cela représente **6 084 poses distinctes dans 255 nouveaux PNG**. Les 124 identités revues possédaient déjà leurs trois actions de base ; ces révisions n’augmentent pas le nombre de kits rédigés. Les [sources et exclusions](docs/combat-fidelity-wave16-2026-10-28/README.md) distinguent les dessins retenus, les corrections et les manquants cumulés.

Une présentation32 réunit huit phases de quatre dessins : intro, sortie, victoire et défaite de manche, finale, victoire et défaite finales, super. Une base16 couvre quatre états ; elle ne remplace pas les 45 états physiques du manifeste Mêlée.

Abe canalise puis contrôle un vrai Slig admissible ; ses commandes utilisent le corps, le fusil et la ressource du Slig. Akane utilise un Paralyzer explicitement autorisé, sans dégâts ni élévation. Les renforts d’Abe appelés par Munch ou l’Étranger et ceux d’Akane appelés par Shinya ou Ginoza respectent les mêmes cibles admissibles ; le contrôle persiste après la cinématique et reste lié à son véritable invocateur. Mugman possède une invulnérabilité de 4,85 secondes simulées ; le Shield Pal de Chalice absorbe un coup positif et persiste jusque-là. Yukikaze de Hakumen prépare une riposte dont le contact doit être réellement atteint. Kirito, Aya et BT déclenchent16, 7 et 14 événements temporisés, avec pause, interruption et dépense unique de la jauge. Maya et Val conservent leur contrôle et leur soin de proximité précédemment validés.

John Wick, Robin, Raven et Starfire restent sans nouveaux native32/base16, avec les refus et périmètres exacts archivés. Tank, MEIKO, KAITO et l’Oracle sont quatre ajouts distincts aux lots effectifs. Le Starfire RPG16, produit avant son refus native48 séparé, garde sa propre provenance et son rôle RPG.

### Fidélité des personnages et des univers

Chaque ajout doit préciser l’œuvre, la version et la période retenues : costume, équipement, capacités et partenaires doivent appartenir à cette continuité. Les pouvoirs d’une autre époque, les gestes incompatibles et les effets offensifs inventés pour un personnage de soutien sont exclus de cette intention.

Les dessins générés et les adaptations de mécaniques **ne constituent pas une reproduction 1:1 certifiée**. Les supers suivent leurs poses de relâchement et leurs points mesurés ; la synchronisation de toutes les attaques ordinaires des bases16 avec leurs frames source reste non certifiée. Les données conservent ce statut explicitement. Une animation manquante peut utiliser un repli existant déclaré ; un agrandissement, une inversion, une capture de contrôle ou une réutilisation ne crée pas une nouvelle pose native.

Les provenances gardent les sources, prompts, empreintes, corrections et refus. Une génération refusée reste un manque identifié. Les dossiers Rift distinguent l’approbation d’une référence de la disponibilité de son illustration ; un dossier `pending` reste en attente de sa propre image. Le registre d’autorisations [Survivaure](docs/licensing/SURVIVAURE_AUTHORIZATION.md) concerne ce pack et ce projet ; il ne décrit pas les droits des autres univers.

## Tactics — textures par case et verticalité

La verticalité est intégrée au moteur Tactics. Ouvrir **Combat custom → TACTIQUE → TERRAIN TACTIQUE**. Le choix **Auto** prend un secteur de l’univers sélectionné lorsqu’un secteur dédié existe ; le choix explicite affiche son lieu, son œuvre et son objectif avant le lancement.

| Secteur dédié | Version retenue | Terrain jouable |
| --- | --- | --- |
| Mont Nibel | Final Fantasy VII, 1997 | Crêtes rocheuses, sentiers, ravins et installations Mako |
| Steppe d’Archylte | Final Fantasy XIII, 2009 | Prairie, plateaux, gué et ruptures de pente |
| Vesperpool | Final Fantasy XV, 2016 | Berges humides et passerelles |
| Caradhras | La Communauté de l’Anneau, film de 2001 | Col enneigé et chemins de montagne |
| Ithilien | Les Deux Tours, film de 2002 | Forêt, ravin et passages superposés |
| Jardin de Noiresouche | Dark Souls, 2011 | Sous-bois, ruines et couverts physiques |
| Therum | Mass Effect, 2007 | Basalte, lave et architecture prothéenne |
| Valhalla | Halo 3, 2007 | Prairie, ruisseau et structures Forerunner |
| Dollet | Final Fantasy VIII, 1999 | Rues en pente, escaliers et passages superposés |
| Cour du manoir Spencer | Resident Evil, 1996 | Jardin, fontaine, murs et dénivelés |
| Red Rock Canyon | Fallout: New Vegas, 2010 | Grès, corniches et chemins de canyon |
| White Forest | Half-Life 2: Episode Two, 2007 | Forêt, reliefs et ouvrages du complexe |
| Inkwell Isle One | Cuphead, 2017 | Prairie de dessin animé, chemins et ponts en bois |
| Chaîne de fabrication IMC | Titanfall2, 2016, Into the Abyss | Plateformes de production, coursives et passages superposés |
| Central City | Fullmetal Alchemist: Brotherhood, 2009 | Place, voies ferrées, escaliers et maçonnerie |
| Royaume Sadida | Wakfu, saison1 | Racines, sous-bois, canopée et passages naturels |

Les trois arènes originales du Nexus restent disponibles : pont et passage inférieur, terrasses des ruines, passerelles du réseau. Les dix-neuf terrains distinguent les surfaces à plusieurs hauteurs ; deux unités peuvent occuper un pont et son passage inférieur à la même coordonnée.

Cliquer une surface ou utiliser les flèches du plateau pour l’inspecter, puis confirmer avec **ALLER / CIBLER CETTE CASE** ou **Entrée**. La coupe de vue, la liste des surfaces et les touches `[` / `]` permettent de choisir un étage ; l’inspection ne dépense aucun point d’action. Les boutons de zoom et de recadrage complètent le glissement de caméra et la molette, y compris au tactile.

Les déplacements suivent un chemin et son coût réel ; occupation, hauteur libre, empreinte des grandes unités, ligne de vue, objectifs et ressources distinguent les étages. Les arbres et obstacles ont des volumes physiques. Une coupe n’autorise pas un tir à travers un plancher opaque. Dans les seize secteurs d’univers, le contrôle de zone progresse une fois par tour réellement terminé. Les anciennes cartes plates conservent leur géométrie.

Les **42 matières configurées** couvrent les secteurs d’univers et les arènes Nexus. Chaque surface possède son identifiant, son matériau et la hauteur de ses quatre coins : une pente, un pont et son passage inférieur restent distincts, même à la même position horizontale. Le [rendu du terrain](src/game/tacticsTerrainRenderer.js) projette les motifs sur leurs faces : herbe ou pavés sur le dessus, terre ou strates rocheuses sur les flancs, dessous des plateformes et contremarches des escaliers. Les raccords suivent les arêtes à la bonne altitude ; la surface occupée et les volumes déterminent le placement et le masquage des personnages. Les [matériaux W16](src/game/tacticsUniversePresentationWave16.js) et les [quatre secteurs supplémentaires](src/game/tacticsUniverseBattlefieldsWave16.js) associent reliefs et matières au lieu retenu.

Chaque niveau Tactics utilise un environnement propre à ce mode, y compris les anciennes cartes. Les atlas de tuiles Tactics sont distincts de ceux des autres moteurs ; leurs images d’arène ne servent plus de fond Tactics.

Le **[guide Tactics W16 jouable](docs/tactics-universes-2026-10-28/README.md)** décrit les commandes, les règles, les matériaux et l’ajout d’un secteur. La [galerie des huit secteurs W14](docs/tactics-universes-2026-10-25/index.html) et celle des [quatre secteurs W15](docs/tactics-universes-2026-10-26/index.html) conservent leurs captures historiques. La [galerie W16](docs/tactics-universes-2026-10-28/index.html) montre les nouveaux secteurs desktop/mobile et les contrôles réels. Les géométries sont des secteurs tactiques originaux adaptés à ces lieux et périodes ; elles ne reproduisent pas un plan officiel à l’identique. Les matières procédurales ne sont pas certifiées comme textures officielles. Le rendu conserve sa perspective 3/4 en Canvas 2D.

L’[ancienne maquette HTML](docs/tactics-terrain-demo.html) reste une illustration historique autonome. L’accès à la fonctionnalité intégrée passe par Combat custom.

## Vérification

Le dépôt n’a pas de script global `npm test`. Les groupes sont déclarés dans [package.json](package.json).

| Commande | Contrôle |
| --- | --- |
| `npm run lint` | Analyse du code avec Oxlint |
| `npm run test:combat-fidelity` | Capacités, présentations, ajouts successifs et contrôles des registres combat |
| `npm run test:combat-presentation` | Identités, invocations, supers et intégration des présentations entre modes |
| `npm run test:tactics-verticality` | Géométrie des étages, rendu, commandes, déplacements, effets et intégration des terrains verticaux |
| `npm run test:conversation` | Parcours applicatifs, ciblage, orientation, escorte, sauvegardes et progression |
| `npm run test:melee` | Entrées, états, manifestes et résolution du combat Mêlée |
| `npm run test:stages` | Topologies, événements et mécanismes de décor |
| `npm run rift:audit` | Cohérence du catalogue Rift et de ses ressources enregistrées |
| `npm run check:progression` | Contrats de progression |
| `npm run build` | Cycle complet `prebuild`, puis compilation Vite |

La clôture du lot 16 a exécuté le véritable build complet avec un **code de sortie 0** et **2 076 tests réussis dans 18 groupes**. Sa preuve de production vérifie les 1 237 PNG dans public, dist et les réponses HTTP, avec décodage libvips et Chromium. Les preuves navigateur couvrent les présentations, les bases, les quatre moteurs, les commandes particulières, les invocations, Senua, les terrains et les scènes. Les résultats sont datés et liés aux entrées figées ; les cinq étapes Rift précèdent le gel de production.

[Validation du lot 16](docs/combat-fidelity-wave16-2026-10-28/validation.json) · [Preuves navigateur](docs/combat-fidelity-wave16-2026-10-28/browser-checks.json) · [Ressources servies](docs/combat-fidelity-wave16-2026-10-28/browser/production-assets-http.json)

Les captures et parcours navigateur sont des vérifications supplémentaires : les tests Node seuls ne prouvent ni le chargement d’un PNG dans une page ni la justesse visuelle d’un geste. Certains outils de capture archivés utilisent les chemins Playwright et Chromium de leur environnement d’exécution ; ils ne font pas partie de l’installation npm standard.

## Architecture

| Emplacement | Rôle |
| --- | --- |
| [src/App.jsx](src/App.jsx) | Écran titre, Trace, progression, navigation et synchronisation |
| [src/components/](src/components/) | Nexus, préparation, portails, écrans et panneaux de contrôle |
| [src/components/GameCanvas.jsx](src/components/GameCanvas.jsx) | Boucle Canvas, simulation et commandes RPG, Tactics et Mêlée |
| [src/components/FighterMode.jsx](src/components/FighterMode.jsx) | Écran et commandes du mode Combat |
| [src/game/engineRpg.js](src/game/engineRpg.js), [engineTactics.js](src/game/engineTactics.js), [engineSmash.js](src/game/engineSmash.js), [engineFighter.js](src/game/engineFighter.js) | Moteurs et règles propres aux quatre modes |
| [src/game/combat/](src/game/combat/) et [combatIdentity.js](src/game/combatIdentity.js) | Capacités, identités, présentations, partenaires et registres d’animations |
| [src/game/melee/](src/game/melee/) | États Mêlée, commandes, manifestes, topologies et animations de décor |
| [tacticsBattlefields.js](src/game/tacticsBattlefields.js), [tacticsUniverseBattlefields.js](src/game/tacticsUniverseBattlefields.js), [tacticsEnvironmentRenderer.js](src/game/tacticsEnvironmentRenderer.js), [tacticsTerrain.js](src/game/tacticsTerrain.js), [tacticsVerticalRuntime.js](src/game/tacticsVerticalRuntime.js), [tacticsTerrainRenderer.js](src/game/tacticsTerrainRenderer.js) | Plateaux plats et verticaux, surfaces, chemins, volumes, objectifs et matériaux |
| [tacticsUniverseBattlefieldsWave15.js](src/game/tacticsUniverseBattlefieldsWave15.js) et [tacticsUniversePresentationWave15.js](src/game/tacticsUniversePresentationWave15.js) | Quatre secteurs supplémentaires, leurs matériaux et leurs environnements dédiés |
| [src/game/heroes.js](src/game/heroes.js) et [enemies.js](src/game/enemies.js) | Catalogue des personnages, ennemis et données de combat |
| [src/game/cards/](src/game/cards/) et [missions/](src/game/missions/) | Collection de cartes et règles de missions |
| [public/](public/) | Ressources statiques servies au navigateur |
| [scripts/](scripts/) | Génération de registres, tests et audits |
| [docs/](docs/) | Sources, provenances, spécifications et preuves de validation |

### Ajouter un lot de personnages

1. Fixer une sélection commune, puis répartir des groupes disjoints de 40 personnages par agent ; relever les identités, versions et couvertures avant modification.
2. Décrire les actions et leurs règles de cible, coût, portée, contact ou soutien ; enregistrer les partenaires du bon univers.
3. Produire les dessins réellement manquants et conserver les sources. Les planches de présentation, les bases, les partenaires RPG et les états physiques Mêlée ont des couvertures distinctes.
4. Brancher les registres dans les moteurs et vérifier les deux camps : origine des tirs, contact accepté, protections, cible vivante et effets de soutien.
5. Contrôler les ressources en jeu, les refus, les replis et l’absence de régression sur les anciens fichiers.
6. Clôturer par les tests, le build réel et un rapport donnant les livraisons et les manquants séparément.

Le [plan du lot 16](docs/combat-fidelity-wave16-2026-10-28/batch-plan-before.json), complété par ses deux annexes préalables aux générations correspondantes, conserve cette répartition antérieure aux éditions. Chaque agent garde ses références, dessins retenus, corrections et mesures dans son répertoire ; les [définitions des personnages](src/game/combat/combatSourceDefinitionsWave16.js) précisent les apparences, armes et actions choisies. L’intégration rassemble les livraisons avant les contrôles communs des moteurs et la revue visuelle finale.

Pour les capacités déjà présentes dans les [tests de complétion](scripts/combatCompletion.test.mjs), déclarer explicitement toute nouvelle version retenue : conserver les attentes historiques sur l’action et l’œuvre, puis vérifier séparément le nom, la version et les règles du profil résolu.

Les anciennes preuves sont des instantanés : ajouter un nouveau rapport plutôt que réécrire les résultats d’un lot antérieur. Les outils de vérification doivent lire les ressources réellement livrées ; l’existence d’un chemin ou d’une entrée JSON ne suffit pas.

## Documentation

- [Dernier lot combat clôturé — W16](docs/combat-fidelity-wave16-2026-10-28/README.md) : détails des trois groupes de 40 personnages et de la livraison.
- [Couverture cumulative par personnage — W16](docs/combat-fidelity-wave16-2026-10-28/coverage-all.csv) : couvertures complètes, partielles et manquantes pour les 1 911 personnages.
- [Terrain Tactics et verticalité — W16](docs/tactics-universes-2026-10-28/README.md) : nouveaux secteurs, commandes, objectifs et 42 matériaux par face et étage. Le [guide W15](docs/tactics-terrain-verticality.md) conserve son état historique.
- [Production des illustrations CG](docs/cg/README.md) : familles d’images, registres, sources et contrôle de livraison.
- [Catalogue Rift](docs/rift-dossiers/catalog.json) : registre des dossiers et de leurs références.
- [Pipeline des boosters](scripts/PORTAL_BOOSTER_PIPELINE.md) : données de collection et outils associés.

Les autres rapports de lots restent disponibles sous `docs/combat-fidelity-wave*/`. Leurs chiffres décrivent leur propre date et leur propre périmètre.
