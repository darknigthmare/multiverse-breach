# Multiverse Breach — Brèche multiverselle

Jeu de crossover indépendant et non officiel, jouable dans le navigateur. Le joueur incarne une **Ancre**, forme une escouade et traverse les univers depuis le Nexus. La progression relie missions, recrutement, portails, collection de cartes, équipements et campagne originale.

Le même catalogue de personnages alimente plusieurs moteurs : **RPG à jauge ATB**, **Tactics sur grille**, **Mêlée sur plateformes** et **Combat en duel**. L’interface utilise React ; les combats sont dessinés en Canvas 2D. Les univers, personnages et marques cités appartiennent à leurs ayants droit.

**État de référence : lot 14 validé le 25 octobre 2026.** Le développement continue par lots de 40 personnages. Les chiffres de cette page décrivent la dernière livraison clôturée ; un lot en cours ne compte pas comme une livraison validée.

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
| **Tactics / Tactique** | `Tactics` | Tours d’unités, déplacements sur grille en perspective 3/4, coûts de terrain, obstacles, couvertures, orientation et objectifs de mission ; onze terrains verticaux, dont huit secteurs d’univers avec reliefs naturels, gués, ravins, passerelles et décors physiques. Caméra avec déplacement et zoom. |
| **Mêlée / Smash** | `Smash` | Combat sur plateformes, déplacements physiques, sauts, garde, charge, prises de rebord et objectifs d’arène. Les personnages couverts possèdent un manifeste d’animation par état. |
| **Combat / Fighter** | `Fighter` | Moteur de duel distinct, avec sa préparation, ses séquences de présentation, ses actions et ses conditions de victoire. |

Les épreuves sans combat réutilisent certaines commandes d’arène pour des objectifs spécifiques. Une mission d’escorte ou de sauvetage conserve sa propre condition de réussite ; elle n’est pas automatiquement un combat d’élimination.

## Couverture réelle

Une entrée dans le catalogue, une capacité nommée, une recette de présentation et un dessin livré sont des mesures différentes. Les compteurs ci-dessous proviennent de l’[audit figé du lot 14](docs/combat-fidelity-wave14-2026-10-25/current.json) et de sa [couverture par personnage](docs/combat-fidelity-wave14-2026-10-25/coverage.csv).

| Périmètre au terme du lot 14 | Mesure vérifiée |
| --- | --- |
| Catalogue | **1 911 personnages**, **525 univers** |
| Capacités explicitement rédigées | 1 540 personnages, 4 517 actions simples, secondaires et défenses ; 1 468 kits couvrent ces trois emplacements |
| Planches de présentation complètes | **306 personnages** avec 32 poses ; 1 605 restent sans cette couverture complète |
| Planches de présentation partielles | 2 personnages, suivis séparément et exclus du total des planches complètes |
| Animation Mêlée complète | **15 personnages** avec 45 états et 4 poses par état ; 1 896 restent sans ce manifeste complet |
| Bases de combat corrigées | 254 personnages avec une planche de 16 poses |
| Recettes de présentation | 320 personnages du catalogue, 2 240 associations personnage/phase |
| Invocations et renforts animés | 49 planches de 16 poses |
| Terrains Tactics verticaux | 11 : huit secteurs d’univers et trois arènes Nexus |
| Décors animés | 415 mécanismes dans 204 univers ; 321 univers ont encore une ambiance sans mécanisme de scène spécifique |
| Ressources suivies par cet audit combat | 730 PNG dans 118 registres, dont les 638 PNG et 111 registres antérieurs préservés |

Ces 730 PNG ne représentent pas toutes les images du jeu : portraits, décors, objets, cartes et illustrations ont leurs propres catalogues.

Une planche de présentation de 32 poses réunit huit phases de quatre dessins : intro, sortie, victoire et défaite de manche, finale, victoire et défaite finales, super. Le manifeste Mêlée suit séparément les 45 états physiques du personnage, avec quatre poses par état.

Le **lot 14** traite 40 personnages dans le Seigneur des Anneaux, Dark Souls, Space Marine, Legacy of Kain, Final Fantasy XV, Horizon Zero Dawn, Tomb Raider, Halo, Mass Effect, Gears, Assassin’s Creed, No Man’s Sky, Deus Ex et Fallout. Il livre **40 planches de présentation**, **40 bases**, le manifeste Mêlée d’Aragorn (**45 états, 180 poses**) et **6 renforts RPG** : **2 196 poses distinctes dans 92 nouveaux PNG**. Les 40 kits comprennent 12 ajouts et 28 révisions ; leurs 160 actions, 40 recettes et 40 partenaires du même univers sont définis. Aucun dessin du lot ne reste manquant après les corrections retenues ; les refus et manquants des anciens lots restent conservés dans leurs rapports. Huit secteurs Tactics jouables ajoutent reliefs, matières et environnements propres à ce mode. Le [rapport du lot](docs/combat-fidelity-wave14-2026-10-25/README.md) détaille les versions, sources, contrôles et manquants cumulés.

### Fidélité des personnages et des univers

Chaque ajout doit préciser l’œuvre, la version et la période retenues : costume, équipement, capacités et partenaires doivent appartenir à cette continuité. Les pouvoirs d’une autre époque, les gestes incompatibles et les effets offensifs inventés pour un personnage de soutien sont exclus de cette intention.

Les dessins générés et les adaptations de mécaniques **ne constituent pas une reproduction 1:1 certifiée**. Les données conservent ce statut explicitement. Une animation manquante peut utiliser un repli existant déclaré ; un agrandissement, une inversion, une capture de contrôle ou une réutilisation ne crée pas une nouvelle pose native.

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

Les trois arènes originales du Nexus restent disponibles : pont et passage inférieur, terrasses des ruines, passerelles du réseau. Les onze terrains distinguent les surfaces à plusieurs hauteurs ; deux unités peuvent occuper un pont et son passage inférieur à la même coordonnée.

Cliquer une surface ou utiliser les flèches du plateau pour l’inspecter, puis confirmer avec **ALLER / CIBLER CETTE CASE** ou **Entrée**. La coupe de vue, la liste des surfaces et les touches `[` / `]` permettent de choisir un étage ; l’inspection ne dépense aucun point d’action. Les boutons de zoom et de recadrage complètent le glissement de caméra et la molette, y compris au tactile.

Les déplacements suivent un chemin et son coût réel ; occupation, hauteur libre, empreinte des grandes unités, ligne de vue, objectifs et ressources distinguent les étages. Les arbres et obstacles ont des volumes physiques. Une coupe n’autorise pas un tir à travers un plancher opaque. Dans les huit nouveaux secteurs, le contrôle de zone progresse une fois par tour réellement terminé. Les anciennes cartes plates conservent leur géométrie.

Les seize nouvelles matières complètent les matériaux Nexus et se dessinent sur le dessus, les flancs et le dessous des dalles. Chaque niveau Tactics utilise un environnement propre à ce mode, y compris les anciennes cartes. Les atlas de tuiles Tactics sont distincts de ceux des autres moteurs ; leurs images d’arène ne servent plus de fond Tactics.

Le **[guide Tactics jouable](docs/tactics-terrain-verticality.md)** décrit les commandes, les règles, les matériaux et l’ajout d’un secteur. La [galerie des huit secteurs](docs/tactics-universes-2026-10-25/index.html) montre les captures desktop/mobile et les contrôles réels. Les géométries sont des secteurs tactiques originaux adaptés à ces lieux et périodes ; elles ne reproduisent pas un plan officiel à l’identique. Les matières procédurales ne sont pas certifiées comme textures officielles. Le rendu conserve sa perspective 3/4 en Canvas 2D.

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

La clôture du lot 14 a exécuté le build complet avec un **code de sortie 0** et **1 681 tests réussis dans 18 groupes**. Sa preuve de production vérifie le décodage navigateur des 730 PNG et l’égalité des fichiers servis avec `public/` et `dist/`. Les résultats sont datés ; ils ne garantissent pas à eux seuls des modifications ultérieures.

[Validation du lot 14](docs/combat-fidelity-wave14-2026-10-25/validation.json) · [Preuves navigateur](docs/combat-fidelity-wave14-2026-10-25/browser-checks.json) · [Contrôle des ressources servies](docs/combat-fidelity-wave14-2026-10-25/browser/production-assets-http.json)

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
| [src/game/heroes.js](src/game/heroes.js) et [enemies.js](src/game/enemies.js) | Catalogue des personnages, ennemis et données de combat |
| [src/game/cards/](src/game/cards/) et [missions/](src/game/missions/) | Collection de cartes et règles de missions |
| [public/](public/) | Ressources statiques servies au navigateur |
| [scripts/](scripts/) | Génération de registres, tests et audits |
| [docs/](docs/) | Sources, provenances, spécifications et preuves de validation |

### Ajouter un lot de personnages

1. Fixer les identités et versions du lot de 40, puis relever la couverture avant modification.
2. Décrire les actions et leurs règles de cible, coût, portée, contact ou soutien ; enregistrer les partenaires du bon univers.
3. Produire les dessins réellement manquants et conserver les sources. Les planches de présentation, les bases, les partenaires RPG et les états physiques Mêlée ont des couvertures distinctes.
4. Brancher les registres dans les moteurs et vérifier les deux camps : origine des tirs, contact accepté, protections, cible vivante et effets de soutien.
5. Contrôler les ressources en jeu, les refus, les replis et l’absence de régression sur les anciens fichiers.
6. Clôturer par les tests, le build réel et un rapport donnant les livraisons et les manquants séparément.

Pour les capacités déjà présentes dans les [tests de complétion](scripts/combatCompletion.test.mjs), déclarer explicitement toute nouvelle version retenue : conserver les attentes historiques sur l’action et l’œuvre, puis vérifier séparément le nom, la version et les règles du profil résolu.

Les anciennes preuves sont des instantanés : ajouter un nouveau rapport plutôt que réécrire les résultats d’un lot antérieur. Les outils de vérification doivent lire les ressources réellement livrées ; l’existence d’un chemin ou d’une entrée JSON ne suffit pas.

## Documentation

- [Dernier lot combat clôturé — W14](docs/combat-fidelity-wave14-2026-10-25/README.md) : détails des 40 personnages et de la livraison.
- [Couverture par personnage — W14](docs/combat-fidelity-wave14-2026-10-25/coverage.csv) : tableau exploitable des couvertures complètes, partielles et manquantes.
- [Terrain Tactics et verticalité](docs/tactics-terrain-verticality.md) : guide des onze terrains jouables, des objectifs, des commandes et des matériaux par face et étage.
- [Production des illustrations CG](docs/cg/README.md) : familles d’images, registres, sources et contrôle de livraison.
- [Catalogue Rift](docs/rift-dossiers/catalog.json) : registre des dossiers et de leurs références.
- [Pipeline des boosters](scripts/PORTAL_BOOSTER_PIPELINE.md) : données de collection et outils associés.

Les autres rapports de lots restent disponibles sous `docs/combat-fidelity-wave*/`. Leurs chiffres décrivent leur propre date et leur propre périmètre.
