# Multiverse Breach — Brèche multiverselle

Jeu de crossover indépendant et non officiel, jouable dans le navigateur. Le joueur incarne une **Ancre**, forme une escouade et traverse les univers depuis le Nexus. La progression relie missions, recrutement, portails, collection de cartes, équipements et campagne originale.

Le même catalogue de personnages alimente plusieurs moteurs : **RPG à jauge ATB**, **Tactics sur grille**, **Mêlée sur plateformes** et **Combat en duel**. L’interface utilise React ; les combats sont dessinés en Canvas 2D. Les univers, personnages et marques cités appartiennent à leurs ayants droit.

**Reprise du 20 novembre 2026.** Le Nexus gagne le Col des Hautes-Herbes en Tactics, un briefing Extinction accessible au clavier et quatre scènes d’invocation raccordées aux effets réellement appliqués. Quatre combattants des univers originaux reçoivent leurs présentations de duel. Le Pachakuti du Soleil Noir a son atlas d’anomalie environnementale. L’export DLC produit maintenant des dossiers de médias transportables par lots. [Rapport et vérifications](docs/assets/p0-p1-p2-continuation-03-2026-11-20/README.md).

Les corrections suivantes rendent les légendes de combat lisibles sur mobile, déclenchent le ramassage Tactics à l’arrivée et rétablissent les ambiances des arènes personnalisées ainsi que les spéciales de J2 du Nexus. Deux lots de médias ont aussi été réunis dans un dossier avec reprise vérifiée. [Corrections et essais](docs/development/corrections-2026-11-20/README.md).

La passe précédente retire **81 P1**. Elle ajoute un atlas animé pour l’essaim de The Aether Crown et 28 séquences de duel sur les planches existantes. Les invocations de fin de combat et l’extraction Tactics attendent leur animation de retour ou d’arrivée. Le contrôle DLC identifie les lots jamais reçus. [Reprise, inventaire et preuves](docs/assets/p0-p1-p2-continuation-04-2026-11-20/README.md).

Une autre passe couvre **deux lots de 40 acteurs** et retire **80 P1** supplémentaires. Le duel gagne 28 séquences sur les atlas existants. Le RPG synchronise le tir du Slig et conserve le faisceau confirmé de l’ÜberCharge. Les soins en hauteur respectent l’irradiation et le Codex affiche le rang réel des menaces. [Résultats et preuves](docs/assets/p0-p1-p2-continuation-05-2026-11-20/README.md).

La passe suivante retire **142 P1** avec 70 contrats d’acteurs et les atlas animés du Phare et du Kraken. Dix-huit héros disposent de **126 séquences de duel**. L’Observatoire et le Carrefour rejoignent les terrains Tactics jouables. Le HUD RPG J2 et la pause A.R.C.A. sont corrigés. L’assemblage Doom atteint **124 lots sur 317**. [Bilan, captures et reçus](docs/assets/p0-p1-p2-continuation-06-2026-11-20/README.md).

La passe suivante donne un secondaire propre à **40 adversaires RPG** et ajoute le Qhapaq Ñan des Falaises et le Gouffre des Auditeurs au Tactics. La Bibliothèque des actes annexes retrouve son état et le bon élément au retour d’un briefing. Doom atteint alors **152 lots sur 317**. [Parcours, captures et reçus](docs/assets/p0-p1-p2-continuation-07-2026-11-20/README.md).

La passe suivante porte à **80** le nombre d’adversaires RPG dont le secondaire a été revu. Le témoin du khipu reçoit une planche dédiée de seize poses. Les tirs Tactics tiennent compte de toute l’empreinte des grandes unités. Trois boss retrouvent leurs animations en Mêlée personnalisée et la pagination des packs DLC ramène le focus sur la première fiche visible. Doom atteint alors **172 lots sur 317**. [Bilan et vérifications](docs/assets/p0-p1-p2-continuation-08-2026-11-20/README.md).

La passe suivante réexamine les **22 défauts visuels P0 historiques**. Les corrections de Han Solo et Luke Skywalker sont vérifiées en jeu. Seize autres planches incompatibles sont écartées. Lilo, Jack Sparrow et Roger Rabbit réutilisent les cellules examinées de leurs planches. Doom atteint alors **192 lots sur 317**. [État des P0 et preuves](docs/assets/p0-p1-p2-continuation-09-2026-11-20/README.md).

La passe suivante porte à **120** le nombre de secondaires RPG spécifiques des ennemis originaux. Jack, Lilo et Roger retrouvent leurs commandes en Duel. Les effets de Vader suivent l’impact réel en RPG. Raven et Starfire retrouvent leurs portraits dans quatre écrans et les aigrettes de l’Amas des Huit Orochi s’animent en Mêlée. Doom atteint alors **209 lots sur 317**. [Corrections et vérifications](docs/assets/p0-p1-p2-continuation-10-2026-11-20/README.md).

La dernière passe livre **40 supers de Mêlée** pour les héros originaux et une nouvelle carte Tactics dans Iron Tempest. Vader conserve son kit de Bespin à plusieurs étages, Starfire retrouve son geste de tir en Duel et le cuirassé Oblique déploie ses écrans en RPG. Les contrôles Rift acceptent une copie des médias assemblés par lots. Doom atteint **213 lots sur 317**. [Bilan et preuves](docs/assets/p0-p1-p2-continuation-11-2026-11-20/README.md).

Les travaux sur Gears/Dead Space, Portal/Left 4 Dead, Revan, Imp et Mancubus sont détaillés dans la [reprise du 13 novembre](docs/assets/p0-p1-p2-continuation-02-2026-11-13/README.md). La [première passe](docs/assets/p0-p1-p2-continuation-2026-11-13/README.md) et les [sept espaces du Hub](docs/assets/p0-p1-menu-continuation-2026-11-13/README.md) conservent leurs résultats datés.

[Installation](#installation) · [Jouer](#jouer) · [Modes](#modes-de-jeu) · [Couverture réelle](#couverture-réelle) · [Tactics et verticalité](#tactics--textures-par-case-et-verticalité) · [Vérification](#vérification) · [Architecture](#architecture) · [Documentation](#documentation)

## Installation

Prérequis : **Node.js 22.x (22.12 minimum)**, npm et Git LFS. Le dépôt contient les ressources graphiques ; son téléchargement et l’installation occupent plusieurs gigaoctets.

Depuis la racine du projet :

```bash
git lfs install --local
git lfs pull
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

Les données et médias propres aux univers sont rangés dans `DLC/<Univers>/`. La préparation des assets publie leurs URL de jeu dans `public/`. Le lancement et le build normaux exigent leurs sources complètes et les fichiers Git LFS réels ; un checkout sparse incomplet peut échouer à `assets:prepare` sans prouver une absence en production.

Le jeu peut démarrer avec une **Trace locale**, sans compte cloud. La synchronisation de compte dépend d’un service configuré sur le déploiement ; elle ne fait pas partie des prérequis pour explorer le jeu localement.

### Éditions DLC et espace disque limité

**Système → Packs DLC** indique l’édition définie par le profil de distribution, les packs inclus ou absents et leurs contenus déclarés. Recherche, filtres et pagination permettent de parcourir le catalogue. Les préférences de visibilité restent distinctes de l’installation ; ce panneau ne télécharge pas de contenu et ne contrôle pas les médias sur disque.

Les profils d’édition se trouvent dans [config/dlc-profiles/](config/dlc-profiles/). Un export avec `npm run dlc:export:runtime -- --profile config/dlc-profiles/halo.json --out /volume/multiverse-halo` conserve les dépendances de production sans recopier les JSON de recherche. Les médias de cette édition restent requis pour la construire et la jouer.

Sur un disque contraint, `npm run dlc:assets:batches` permet de lire, contrôler puis libérer uniquement les copies temporaires : jusqu’à 40 ressources par lot, avec plafonds de taille, vérification SHA-256 et décodage des rasters. Le plan fige les sources et le vérificateur ; la reprise conserve les résultats déjà acquis. La passe du 13 novembre valide **19 582 fichiers en 490 lots**, dont 17 087 rasters décodés, sans indisponibilité restante. Voir [les commandes, reçus et résultats](docs/assets/dlc-completion-2026-11-13/README.md). Cette validation ne produit pas à elle seule une distribution contenant tous les médias.

Pour conserver et transférer les médias d’un lot, utiliser `node scripts/exportDlcAssetBatch.mjs --plan PLAN.json --batch ID --out NOUVEAU_DOSSIER`. Le dossier contient les fichiers aux chemins source et un reçu SHA-256 vérifiable après transfert. Deux lots réels totalisant 60 médias ont été exportés. [Reproduction et reçus](docs/assets/dlc-batch-export-2026-11-20/README.md).

`node scripts/applyDlcAssetBatch.mjs` réunit les lots du même plan dans un dossier de destination. La reprise vérifie les fichiers présents et copie ceux qui manquent. [Commandes et preuve sur deux lots](docs/assets/dlc-batch-export-2026-11-20/ASSEMBLY.md).

Un assemblage complet peut alimenter directement `dlc:export:runtime` avec `--media-assembly`, `--media-plan` et `--media-plan-sha256`. Le checkout fournit le code et le dossier assemblé fournit les médias vérifiés. La destination doit avoir la place pour l’édition exportée. [Commande complète et validation](docs/development/corrections-2026-11-20/dlc-distribution-from-assembly/README.md).

L’assemblage temporaire Doom contient désormais **5 871 médias vérifiés sur 7 693**, répartis en **213 lots sur 317**. La dernière reprise a ajouté quatre lots et contrôlé les empreintes de l’ensemble. Il reste 104 lots et 3,43 Go à assembler selon la révision gelée du plan. [État du plan Doom](docs/assets/p0-p1-p2-continuation-11-2026-11-20/dlc/README.md).

Les contrôles Rift peuvent lire les images d’une copie isolée. Indiquer le dossier qui contient `images/` à la racine. Les vrais fichiers locaux gardent la priorité. Les contrôles d’empreinte et d’unicité s’appliquent aux images de la copie.

```bash
RIFT_DOSSIER_MEDIA_ROOT=/volume/medias-rift/public npm run rift:audit
RIFT_DOSSIER_MEDIA_ROOT=/volume/medias-rift/public npm run test:rift
```

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
| **Tactics / Tactique** | `Tactics` | Tours d’unités, déplacements sur grille en perspective 3/4, coûts de terrain, obstacles, couvertures, orientation et objectifs de mission. Vingt-neuf terrains verticaux couvrent des reliefs naturels, des gués, des ravins et des structures à plusieurs étages. Caméra avec déplacement et zoom. |
| **Mêlée / Smash** | `Smash` | Combat sur plateformes, déplacements physiques, sauts, garde, charge, prises de rebord et objectifs d’arène. Les personnages couverts possèdent un manifeste d’animation par état. |
| **Combat / Fighter** | `Fighter` | Moteur de duel distinct, avec sa préparation, ses séquences de présentation, ses actions et ses conditions de victoire. |

Les épreuves sans combat réutilisent certaines commandes d’arène pour des objectifs spécifiques. Une mission d’escorte ou de sauvetage conserve sa propre condition de réussite ; elle n’est pas automatiquement un combat d’élimination.

Les espaces Équipement, Boutique, Résonance, Équipe, Dossier de l’Ancre, Archives et Régulation partagent désormais une hiérarchie A.R.C.A. plus lisible. Les filtres se replient, les réservistes se déploient au clavier, les achats montrent le prix et le solde manquant, et les grands catalogues du Codex se recherchent par pages. Le panneau Packs DLC reprend cette organisation avec recherche sans accents, contenus par famille et pages de douze packs. Les commandes conservent les IDs, les coûts et les règles de sauvegarde existants. Voir [les parcours vérifiés et leurs limites](docs/assets/p0-p1-menu-continuation-2026-11-13/README.md) et [les quatre éditions DLC testées](docs/assets/dlc-completion-2026-11-13/ui/AFTER/VALIDATION.md).

## Couverture réelle

Une entrée dans le catalogue, une capacité nommée, une recette de présentation et un dessin livré sont des mesures différentes. Les lignes de combat ci-dessous proviennent de l’[inventaire daté W17 + master](docs/combat-fidelity-wave17-2026-11-02/current.json), régénéré le 13 novembre 2026 avant la seconde reprise. La ligne Tactics inclut le Col des Hautes-Herbes. Les atlas et clips livrés depuis cet inventaire figurent dans les reprises datées.

| Périmètre mesuré après intégration | Résultat |
| --- | --- |
| Catalogue | **1 911 personnages**, **525 univers** |
| Capacités de base explicitement rédigées | 1 662 personnages, 4 911 actions simples, secondaires et défenses ; 1 618 kits complets et 44 partiels |
| Emplacements de base sans enregistrement explicite | 822 sur 5 733 ; les profils résolus peuvent utiliser un repli |
| Supers résolus | 1 911, dont 1 588 portent des métadonnées d’override ; aucun placeholder générique restant |
| Présentations complètes32 livrées, inventaire incluant les archives | **666 personnages** ; 1 245 sans atlas complet |
| Présentations partielles | 2, suivies séparément |
| Animation Mêlée complète45 | **18 personnages** ; 1 893 manquantes |
| Bases de combat16 corrigées | 614 personnages |
| Recettes de présentation | 680 personnages, 4 760 associations personnage/phase |
| Invocations et renforts natifs16 | 68 planches |
| Actions supplémentaires16 | 2 planches, 32 poses |
| Familier de protection autonome16 | 1 planche, distincte des invocations RPG |
| Terrains Tactics verticaux | 30 terrains dont vingt-six secteurs d’univers et quatre arènes Nexus, pour 78 matières |
| Décors animés | 445 mécanismes dans 220 univers ; 305 univers sans mécanisme localisé |
| Ressources de cet audit combat | 1 491 PNG dans 149 registres ; les 1 237 PNG et 138 registres W16 restent préservés |

Les métadonnées d’override et l’absence de placeholder générique ne certifient pas une identité de source ni une animation vérifiée. Les 822 emplacements sans enregistrement explicite restent un manque de couverture rédigée, même lorsque le moteur résout une action.

Cet inventaire combat ne comprend pas toutes les images du jeu : portraits, décors, objets, cartes et illustrations possèdent leurs propres catalogues. Les 525 univers ont une ambiance par défaut ; les mécanismes liés à des scènes précises constituent une couverture supplémentaire. [Audit courant des supers, invocations et ambiances](docs/combat-completion-2026-10-18/current.md)

Le **lot W17** conserve **120 personnages avec de nouveaux dessins**, en trois groupes de 40 : 120 présentations32 et 120 bases16. Les **125 identités revues** comprennent 80 nouvelles définitions de capacités et 45 révisions ; les cinq identités suspendues ne deviennent pas cinq livraisons artistiques supplémentaires. Jade ajoute un manifeste Mêlée45 ; six renforts RPG16, un NPC de capture16 et une action gyrodisk16 ont des registres distincts. L’inventaire ajoute 254 PNG aux fichiers W16. Le [plan et ses annexes](docs/combat-fidelity-wave17-2026-11-02/batch-plan-before.json) et le [protocole de clôture](docs/combat-fidelity-wave17-2026-11-02/CLOSURE.md) conservent leurs périmètres historiques.

La [reprise P0/P1 du 13 novembre](docs/assets/p0-p1-continuation-2026-11-13/README.md) ajoute trois fonds tactiques distincts (Predator 1987, Predator 2 et Prey), les portraits de Naru/Sarii et une icône extérieure du masque osseux. Le masque porté, transporté et monté ne se duplique pas ; les scènes source n’annoncent plus d’anomalie crossover. Le Feral courant possède un kit physique borné à ses lames et à son bouclier.

L’[inventaire de la seconde reprise](docs/assets/p0-p1-p2-continuation-02-2026-11-13/audit/checkpoint-82a1f003/summary.json) conserve **4 937 acteurs**, dont 1 912 héros avec l’Ancre : **16 734 P1**, **13 582 P2**, **1 471 acteurs avec raster absent** et 1 309 fiches avec noms bruts génériques. Le [delta exact](docs/assets/p0-p1-p2-continuation-02-2026-11-13/audit/checkpoint-82a1f003/actor-task-delta.json) retire 248 P1 sur 77 acteurs, ajoute un P1 après blocage du faux sprite Batman et 76 revues de scène P2. La [continuité finale](docs/assets/p0-p1-p2-continuation-02-2026-11-13/audit/checkpoint-82a1f003/final-continuity-3b892a7.json) distingue explicitement le dernier correctif FPS des sources du classement. Les 22 P0 étaient encore ouverts à cette révision. L’ancienne file de 124 lots garde son ordre ; les [quatre lots de 40 de cette passe](docs/assets/p0-p1-p2-continuation-02-2026-11-13/audit/checkpoint-82a1f003/work-batches-40.json) ne sont pas 160 dossiers entièrement clos. La [passe antérieure](docs/assets/p0-p1-p2-continuation-2026-11-13/README.md) conserve séparément ses 277 P1 et 39 P2 retirés. Recherche, données, art et catalogue ne se confondent pas avec les supers effectivement résolus.

Après la reprise du 20 novembre, le même inventaire compte **16 653 P1**, **13 582 P2** et **1 470 acteurs avec raster absent**. Il retire 80 constats de données pour 40 acteurs du Nexus et un constat de raster pour Pachakuti. Les revues d’animation et de fidélité 1:1 se poursuivent. [Comparaison du nouvel inventaire](docs/assets/p0-p1-p2-continuation-03-2026-11-20/actor-task-delta.json).

Une présentation32 réunit huit phases de quatre dessins : intro, sortie, victoire et défaite de manche, finale, victoire et défaite finales, super. Une base16 couvre quatre états ; elle ne remplace pas les 45 états physiques du manifeste Mêlée.

Abe canalise puis contrôle un vrai Slig admissible ; ses commandes utilisent le corps, le fusil et la ressource du Slig. Akane utilise un Paralyzer explicitement autorisé, sans dégâts ni élévation. Les renforts d’Abe appelés par Munch ou l’Étranger et ceux d’Akane appelés par Shinya ou Ginoza respectent les mêmes cibles admissibles ; le contrôle persiste après la cinématique et reste lié à son véritable invocateur. Mugman possède une invulnérabilité de 4,85 secondes simulées ; le Shield Pal de Chalice absorbe un coup positif et persiste jusque-là. Yukikaze de Hakumen prépare une riposte dont le contact doit être réellement atteint. Kirito, Aya et BT déclenchent16, 7 et 14 événements temporisés, avec pause, interruption et dépense unique de la jauge. Maya et Val conservent leur contrôle et leur soin de proximité précédemment validés.

Le Medi Gun W17 maintient un vrai lien allié : 24 HP par seconde simulée, charge complète en 40 secondes sous le seuil d’overheal ou 80 secondes au-dessus, puis huit secondes d’ÜberCharge. Son activation ne devient pas un soin instantané ; le Syringe Gun reste une autre action offensive. Waffle capture uniquement un NPC explicitement admissible, sans dégâts, élévation ou changement de camp, pendant 1,25 seconde ou un tour de la cible. Melody touche les voisins cardinaux de son déplacement accepté ; Okarun partage son plafond de deux utilisations avec son renfort chez Momo. La photo de Jade reste informative et les trois poissons de Joe gardent leur émetteur natif.

Les [priorités de source](src/game/combat/sourceKitPriority.js) empêchent une préparation générique plus ancienne de remplacer ces profils ou de doubler leur dispatch. Liquid utilise par défaut son duel final à mains nues sur REX ; l’ancien atlas W13 avec manteau reste une édition archivée et comptée dans l’inventaire, sans être activé pour cette incarnation. Ripley utilise l’équipement du Nostromo et du Narcissus de 1979 ; son atlas W13 au M41A de 1986 est également conservé en archive. Les actions de Maul et son arme à double lame gardent sa période Clone Wars explicitement sélectionnée. Les actions P0 actuelles de Raven et Starfire restent le choix par défaut ; leurs versions W16 demeurent des éditions historiques distinctes. True Ogre garde la frappe de griffe gauche W15 et son unique bras-vipère droit.

John Wick, Robin, Raven et Starfire restent sans nouveaux native32/base16, avec les refus et périmètres exacts archivés. Tank, MEIKO, KAITO et l’Oracle sont quatre ajouts distincts aux lots effectifs. Le Starfire RPG16, produit avant son refus native48 séparé, garde sa propre provenance et son rôle RPG.

### Fidélité des personnages et des univers

Chaque ajout doit préciser l’œuvre, la version et la période retenues : costume, équipement, capacités et partenaires doivent appartenir à cette continuité. Les pouvoirs d’une autre époque, les gestes incompatibles et les effets offensifs inventés pour un personnage de soutien sont exclus de cette intention.

Les dessins générés et les adaptations de mécaniques **ne constituent pas une reproduction 1:1 certifiée**. Pour les séquences natives couvertes, les supers suivent leurs poses de relâchement et leurs points mesurés ; la synchronisation de toutes les attaques ordinaires des bases16 avec leurs frames source reste non certifiée. Les données conservent ce statut explicitement. Une animation manquante peut utiliser un repli existant déclaré ; un agrandissement, une inversion, une capture de contrôle ou une réutilisation ne crée pas une nouvelle pose native.

Les provenances gardent les sources, prompts, empreintes, corrections et refus. Une génération refusée reste un manque identifié. Les dossiers Rift distinguent l’approbation d’une référence de la disponibilité de son illustration ; un dossier `pending` reste en attente de sa propre image. Le registre d’autorisations [Survivaure](docs/licensing/SURVIVAURE_AUTHORIZATION.md) concerne ce pack et ce projet ; il ne décrit pas les droits des autres univers.

## Tactics — textures par case et verticalité

La verticalité est intégrée au moteur Tactics. Ouvrir **Combat custom**, choisir **TACTIQUE**, puis **ARÈNE → TERRAIN TACTIQUE**. Après le choix du terrain, passer à **RÈGLES** pour lancer le combat. Le choix **Auto** prend un secteur de l’univers sélectionné lorsqu’un secteur dédié existe ; le choix explicite affiche son lieu, son œuvre et son objectif avant le lancement.

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
| Île du phare | Beyond Good & Evil, 2003 | Terrasses, escalier, passerelle haute et débarcadère |
| Forêt des Ptizêtres | Rayman Legends, 2013 | Racines, détour supérieur et ravin |
| Galerie VDNH | Atomic Heart, 2023 | Balcon, fosse, piliers et surfaces superposées |
| Rainforest District | Zootopia, film de 2016 | Canopée, chemin bas humide et bassin |
| Chambre et puits de maintenance | Portal 2, 2011 | Galerie haute, escaliers, passerelle métallique et niveau de service inférieur |
| Observatoire des Angles Impossibles | The Drowned Testament, campagne originale | Crypte, galerie de cuivre, passages d’angle et cartes à récupérer sur plusieurs étages |
| Carrefour de la Cité Libre | Valedor: The Shattered Crown, campagne originale | Quatre places à tenir, herbe du jardin, grès des forges, basalte et planches du marché |
| Qhapaq Ñan des Falaises | Tawantinsuyu: The Split Sun, campagne originale | Escorter le témoin du khipu par trois lacets, entre terre ocre, terrasses en pierre et col herbeux |
| Gouffre des Auditeurs | Infernum: Nine Pits, campagne originale | Registres à détruire avant la clôture, entre métal, roche noire et rigole chaude |
| Ligne-Cendre — Crête des trois radios | Iron Tempest, campagne originale | Radios à tenir entre boyau boueux, crête herbeuse et chemin de ravitaillement en gravier |

Les quatre arènes originales du Nexus comprennent un pont avec passage inférieur, les terrasses des ruines, les passerelles du réseau et le Col des Hautes-Herbes. Deux unités peuvent occuper des supports distincts à la même coordonnée. Au col, le gué passe sous la crête et le relais se gagne en tenant le sommet trois tours. [Terrain et parcours](docs/assets/p0-p1-p2-continuation-03-2026-11-20/tactics-highgrass/README.md).

Cliquer une surface ou utiliser les flèches du plateau pour l’inspecter, puis confirmer avec **ALLER / CIBLER CETTE CASE** ou **Entrée**. La coupe de vue, la liste des surfaces et les touches `[` / `]` permettent de choisir un étage ; l’inspection ne dépense aucun point d’action. Les boutons de zoom et de recadrage complètent le glissement de caméra et la molette, y compris au tactile.

Les déplacements suivent un chemin et son coût réel ; occupation, hauteur libre, empreinte des grandes unités, ligne de vue, objectifs et ressources distinguent les étages. Les arbres et obstacles ont des volumes physiques. Une coupe n’autorise pas un tir à travers un plancher opaque. Dans les secteurs d’univers avec objectif de contrôle, le score progresse une fois par tour réellement terminé. Les anciennes cartes plates conservent leur géométrie.

Les **78 matières configurées** couvrent les secteurs d’univers et les arènes Nexus. Chaque surface possède son identifiant, son matériau et la hauteur de ses quatre coins. Les quatre hauteurs donnent sa pente à la case et permettent de distinguer un pont de son passage inférieur à la même position horizontale. Le rendu projette des motifs différents sur le dessus, les flancs et les dessous des plateformes. Les raccords suivent les arêtes à la bonne altitude. Les volumes déterminent le placement et le masquage des personnages. [Rendu du terrain](src/game/tacticsTerrainRenderer.js) · [Matières W17](src/game/tacticsUniversePresentationWave17.js)

Dans l’Observatoire, deux cartes partagent une coordonnée horizontale et se ramassent depuis leurs étages respectifs. Des passages d’angle relient la crypte à la galerie pour deux points d’action. Au Carrefour, des rampes et escaliers joignent les quatre quartiers. Chaque place de l’objectif porte son matériau et sa hauteur. Ces plateaux utilisent une géométrie propre au Tactics et sont accessibles depuis la campagne originale ou le combat custom. [Parcours des deux secteurs](docs/assets/p0-p1-p2-continuation-06-2026-11-20/tactics/README.md)

Au Qhapaq Ñan, le témoin suit les terrasses jusqu’au support d’extraction. Sa planche d’animation couvre l’attente, le déplacement, le coup reçu et le départ. Dans le Gouffre, les registres occupent trois hauteurs et la clôture compte les fins de tour alliées. Les tirs qui s’arrêtent au contact tiennent compte de chaque case occupée par un boss 2×2, y compris au bord du plateau. [Secteurs et matières](docs/assets/p0-p1-p2-continuation-07-2026-11-20/tactics/README.md) · [Escorte et animations](docs/assets/p0-p1-p2-continuation-08-2026-11-20/witness/README.md) · [Ligne de vue](docs/assets/p0-p1-p2-continuation-08-2026-11-20/tactics/README.md)

La Ligne-Cendre relie trois radios sur la crête, dans le boyau et au ravitaillement. Le pont crée un raccourci au-dessus de la tranchée, avec un passage inférieur soumis à la hauteur des unités. La boue coûte deux points de déplacement et le gravier un. La carte se joue dans la campagne Iron Tempest et en combat custom. [Parcours de la Ligne-Cendre](docs/assets/p0-p1-p2-continuation-11-2026-11-20/tactics/README.md)

Chaque niveau Tactics utilise un environnement propre à ce mode, y compris les anciennes cartes. Les atlas de tuiles Tactics sont distincts de ceux des autres moteurs ; leurs images d’arène ne servent plus de fond Tactics.

Le **[guide Tactics W17](docs/tactics-universes-2026-11-02/README.md)** décrit les commandes, les règles, les matériaux et l’ajout d’un secteur. La [galerie des huit secteurs W14](docs/tactics-universes-2026-10-25/index.html) et celle des [quatre secteurs W15](docs/tactics-universes-2026-10-26/index.html) conservent leurs captures historiques. La [galerie W16](docs/tactics-universes-2026-10-28/index.html) montre les nouveaux secteurs desktop/mobile et les contrôles réels. Les géométries sont des secteurs tactiques originaux adaptés à ces lieux et périodes ; elles ne reproduisent pas un plan officiel à l’identique. Les matières procédurales ne sont pas certifiées comme textures officielles. Le rendu conserve sa perspective 3/4 en Canvas 2D.

La [nouvelle extension Portal 2](docs/assets/p0-p1-p2-continuation-02-2026-11-13/tactics-aperture/README.md) ajoute un puits de maintenance et deux repères superposés. Le panneau de terrain s’ancre au-dessus des HP/commandes et adapte sa hauteur à l’espace laissé par l’en-tête sur petit écran. Le secteur est une adaptation originale de l’architecture de 2011 ; il ne simule pas les portails et n’est pas choisi automatiquement pour une archive explicitement marquée Portal (2007).

L’[ancienne maquette HTML](docs/tactics-terrain-demo.html) reste une illustration historique autonome. L’accès à la fonctionnalité intégrée passe par Combat custom.

## Vérification

Le dépôt n’a pas de script global `npm test`. Les groupes sont déclarés dans [package.json](package.json).

| Commande | Contrôle |
| --- | --- |
| `npm run lint` | Analyse du code avec Oxlint |
| `npm run test:p0-visuals` | Sélection des planches, découpes, repères et commandes des dossiers P0 historiques |
| `npm run test:source-contracts` | Identités et versions des personnages, kits propres aux moteurs et niveaux d’origine |
| `npm run test:combat-fidelity` | Capacités, présentations, ajouts successifs et contrôles des registres combat |
| `npm run test:combat-presentation` | Identités, invocations, supers et intégration des présentations entre modes |
| `npm run test:tactics-verticality` | Géométrie des étages, rendu, commandes, déplacements, effets et intégration des terrains verticaux |
| `npm run test:ui-immersion` | Menus, navigation, journal, cycle des écrans de combat et fonctions de la Cité-Mosaïque |
| `npm run test:conversation` | Parcours applicatifs, ciblage, orientation, escorte, sauvegardes et progression |
| `npm run test:melee` | Entrées, états, manifestes et résolution du combat Mêlée |
| `npm run test:stages` | Topologies, événements et mécanismes de décor |
| `npm run test:dlc` | Manifestes, identités, éditions, distribution et sauvegardes DLC |
| `npm run test:dlc:batches` | Sources Git/LFS, limites des temporaires, reçus et reprise des lots |
| `npm run dlc:bundle:check -- --profile config/dlc-profiles/base.json` | Compilation de l’application pour ce profil, sans copie des médias ni prébuild global |
| `npm run rift:audit` | Cohérence du catalogue Rift et de ses ressources enregistrées |
| `npm run test:rift` | Registre des dossiers, récompenses et parcours jouables de Rift |
| `npm run check:progression` | Contrats de progression |
| `npm run build` | Cycle complet `prebuild`, puis compilation Vite |

À titre historique, la clôture du lot 16 a exécuté le véritable build complet avec un **code de sortie 0** et **2 076 tests réussis dans 18 groupes**. Sa preuve de production vérifie les 1 237 PNG dans public, dist et les réponses HTTP, avec décodage libvips et Chromium. Les preuves navigateur couvrent les présentations, les bases, les quatre moteurs, les commandes particulières, les invocations, Senua, les terrains et les scènes. Les résultats sont datés et liés aux entrées figées ; les cinq étapes Rift précèdent le gel de production.

[Validation du lot 16](docs/combat-fidelity-wave16-2026-10-28/validation.json) · [Preuves navigateur](docs/combat-fidelity-wave16-2026-10-28/browser-checks.json) · [Ressources servies](docs/combat-fidelity-wave16-2026-10-28/browser/production-assets-http.json)

Ces résultats W16 et les essais W17 antérieurs ne valident pas le code intégré le 9 novembre. La revue comprend un parcours Tactics de six lancements, 18 vérifications et dix captures inspectées, puis quatre cas Fighter pour Raven et Starfire avec huit captures inspectées, sans erreur de page. Chaque preuve conserve son propre instantané : treize fichiers source diffèrent depuis le parcours Tactics et six depuis le parcours Fighter, selon la comparaison des empreintes d’origine avec les fichiers du 9 novembre. Aucun ne constitue un gel de production final.

Le 9 novembre, `npm run build -- --config scripts/viteCodeOnly.config.js` a réellement terminé avec le **code de sortie 0**, après les 45 étapes normales du prébuild. Les 30 sorties TAP rapportent **4 975 exécutions réussies**, sans échec ni assertion ignorée ; les groupes se recoupent et ces exécutions ne sont pas un nombre de tests uniques. Le profil de compilation utilisé conserve tout le prébuild, puis produit un bundle de code sans recopier les médias de `public/` ; ce dist seul ne constitue pas une livraison statique complète. Les tests, reçus et limites sont consignés dans l’[amendement d’intégration](docs/audits/w17-master-integration-2026-11-09.md).

Les captures et parcours navigateur sont des vérifications supplémentaires : les tests Node seuls ne prouvent ni le chargement d’un PNG dans une page ni la justesse visuelle d’un geste. Certains outils de capture archivés utilisent les chemins Playwright et Chromium de leur environnement d’exécution ; ils ne font pas partie de l’installation npm standard.

Lors de la première reprise du 13 novembre, 31 tests du kit Feral et 29 tests d’assets/liaisons passaient, et le parcours final Prey desktop/mobile ne montrait aucune erreur HTTP/page ni anomalie crossover après plus de 1 560 mises à jour. La compilation directe de code passait ; le build normal était bloqué par 9 007 sources DLC non matérialisées dans ce workspace partiel. Le contrôle CG de cette étape était limité aux métadonnées et préservait 1 436 déclarations de livraison. Voir les [preuves datées](docs/assets/p0-p1-continuation-2026-11-13/README.md#vérifications-et-limites).

La reprise DLC suivante exécute la suite standard avec succès (groupes 113/113 et 234/234), les 31 tests des lots v2, cinq compilations de profils réels et huit cas navigateur du panneau. Les vrais médias sont vérifiés séparément par lots, avec décodage raster et comparaison aux sources Git/LFS figées ; les copies temporaires sont libérées après contrôle. Les [résultats et limites de cette reprise](docs/assets/dlc-completion-2026-11-13/validation/README.md) distinguent ces vérifications d’un export de production assemblé et d’une validation visuelle de chaque personnage.

La reprise P0/P1/P2 suivante fait passer la suite DLC (**113/113 puis 245/245**) et **110 tests ciblés** de source, signatures, sprites et éditions historiques. Cinq profils de la vraie application compilent : complète, base, Halo, les quatre packs Final Fantasy et les quatre packs Unreal/Quake. La bibliothèque des missions passe 18 cas navigateur sur trois éditions. Le nouvel atlas et les raccords de sprites sont inspectés séparément ; ces résultats n’assemblent pas tous les médias en un build complet. Voir [les preuves courantes](docs/assets/p0-p1-p2-continuation-2026-11-13/README.md).

Le [contrôle CG courant](docs/assets/p0-p1-p2-continuation-2026-11-13/cg-runtime-correction/README.md) vérifie séparément les métadonnées avec `npm run cg:roster:plan:check:metadata` et leurs contrats avec `npm run test:cg:metadata`, sous Node 22. Le plan historique et ses 1 436 déclarations restent inchangés ; les 58 portraits absents ne sont pas déclarés vus. Le contrôle strict des médias reste obligatoire pour une livraison complète.

La seconde reprise ajoute les vérifications finales suivantes : **153/153 contrats**, **96/96 tests PNG**, **291/291 Tactics**, **580/580 UI**, **158/158 métadonnées CG** et **7/7 quarantaine/Bible**. Cinq profils de l’application compilent après le dernier raccord FPS. La suite standard DLC passe en 113/113 puis 245/245 au checkpoint précédent, avec les inventaires et transformateurs inchangés ; les derniers consommateurs FPS passent leurs régressions et compilations propres. Les groupes se recoupent et ne sont pas additionnés comme des tests uniques. Les limites média et les trois anciennes attentes statistiques de la contre-épreuve restent dans les [reçus courants](docs/assets/p0-p1-p2-continuation-02-2026-11-13/validation/README.md).

La reprise du 20 novembre passe **295 tests Tactics, 159 contrats, 108 régressions RPG et 99 tests PNG**. L’édition complète, le jeu de base et les trois packs originaux concernés compilent sans copier les médias. [Vérifications et parcours](docs/assets/p0-p1-p2-continuation-03-2026-11-20/README.md).

La dernière passe passe **349 contrats de source, 93 tests Rift et 42 tests P0 visuels**. Les profils `base` et `all` compilent selon leurs sélections, soit 0 et 505 packs. Les vérifications en jeu et les contrôles des fichiers Doom ont leurs propres reçus. [Relevé des vérifications](docs/assets/p0-p1-p2-continuation-11-2026-11-20/validation/checks.json)

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

Le [plan du lot W17](docs/combat-fidelity-wave17-2026-11-02/batch-plan-before.json), complété par ses quatre annexes préalables aux générations correspondantes, conserve cette répartition antérieure aux éditions. Chaque agent garde ses références, dessins retenus, corrections et mesures dans son répertoire ; les [définitions des personnages W17](src/game/combat/combatSourceDefinitionsWave17.js) précisent les apparences, armes et actions choisies. L’intégration rassemble les livraisons avant les contrôles communs des moteurs et la revue visuelle finale.

Pour les capacités déjà présentes dans les [tests de complétion](scripts/combatCompletion.test.mjs), déclarer explicitement toute nouvelle version retenue : conserver les attentes historiques sur l’action et l’œuvre, puis vérifier séparément le nom, la version et les règles du profil résolu.

Les anciennes preuves sont des instantanés : ajouter un nouveau rapport plutôt que réécrire les résultats d’un lot antérieur. Les outils de vérification doivent lire les ressources réellement livrées ; l’existence d’un chemin ou d’une entrée JSON ne suffit pas.

## Guides de développement et intégration

Les consignes de [AGENTS.md](AGENTS.md), le [guide du projet](docs/development/GAMEDEV_GUIDE.md) et les guides embarqués dans `vendor/gamedev-skills/` décrivent les contrats des moteurs, des commandes, des sauvegardes et des assets. Les outils IA facultatifs sont documentés dans [.ai-tools/README.md](.ai-tools/README.md).

```bash
npm run check:gamedev-guides
npm run test:gamedev
```

Les médias CG et certains exports utilisent Git LFS. Un pointeur LFS dans un checkout incomplet ne constitue pas une image utilisable. Les audits d'assets exigent les vrais fichiers. Sur un disque contraint, le profil déjà fourni évite seulement la recopie de `public/` et conserve tout le cycle `prebuild` :

```bash
npm run build -- --config scripts/viteCodeOnly.config.js
```

Ce profil produit le code exécutable sans recopier les médias de `public/` dans `dist/` ; une livraison statique complète comprend aussi ces médias. Le résultat du prébuild intégré reste suivi séparément dans le rapport d’intégration. Les fixtures de commandes, de stockage et d'affichage sont décrites dans le guide du projet ; elles ne remplacent pas les parcours de combat.

## Documentation

- [Reprise P0/P1/P2 — 13 novembre](docs/assets/p0-p1-p2-continuation-2026-11-13/README.md) : cinq cohortes de 40, nouvel atlas Pinky, Revan rétabli, catalogue cohérent, missions et audit global Git.
- [DLC, sauvegardes et médias par lots — 13 novembre](docs/assets/dlc-completion-2026-11-13/README.md) : panneau de packs, éditions réduites, export runtime, contrôles bornés et preuves de compilation.
- [Lot de 40 acteurs supplémentaire](docs/assets/p0-p1-menu-continuation-2026-11-13/raster-lot-003/README.md) : atlas Roman Legionary arcade 1992 candidat, revue des poses et distinction de la continuité BD active.
- [Reprise P0/P1 — 13 novembre](docs/assets/p0-p1-continuation-2026-11-13/README.md) : six PNG réels, raccords de sprites, sources exactes, file par 40 et vérifications courantes.
- [Reprise menus et P0/P1 — 13 novembre](docs/assets/p0-p1-menu-continuation-2026-11-13/README.md) : sept espaces du Hub, médaillon raccordé, lot de 40 et continuités structurées.
- [Intégration W17 + master — 9 novembre](docs/audits/w17-master-integration-2026-11-09.md) : livraisons, mesures courantes, tests et limites de validation.
- [Mesures courantes W17](docs/combat-fidelity-wave17-2026-11-02/current.md) et [protocole de clôture](docs/combat-fidelity-wave17-2026-11-02/CLOSURE.md) : inventaire actuel et barrières historiques distinctes.
- [Dernier lot combat clôturé historiquement — W16](docs/combat-fidelity-wave16-2026-10-28/README.md) : détails des trois groupes de 40 personnages et de la livraison.
- [Couverture cumulative par personnage — W16](docs/combat-fidelity-wave16-2026-10-28/coverage-all.csv) : couvertures complètes, partielles et manquantes pour les 1 911 personnages.
- [Terrain Tactics et verticalité — W17](docs/tactics-universes-2026-11-02/README.md) : 23 cartes, commandes, objectifs et 52 matières par face et étage. Le [guide W15](docs/tactics-terrain-verticality.md) conserve son état historique.
- [Production des illustrations CG](docs/cg/README.md) : familles d’images, registres, sources et contrôle de livraison.
- [Catalogue Rift](docs/rift-dossiers/catalog.json) : registre des dossiers et de leurs références.
- [Pipeline des boosters](scripts/PORTAL_BOOSTER_PIPELINE.md) : données de collection et outils associés.

Les autres rapports de lots restent disponibles sous `docs/combat-fidelity-wave*/`. Leurs chiffres décrivent leur propre date et leur propre périmètre.
