# Tactics : verticalité jouable, surfaces et matériaux

La verticalité est intégrée au moteur Tactics depuis le 24 octobre 2026. L’extension W14 du **25 octobre 2026** porte le catalogue à **onze terrains verticaux jouables : huit secteurs d’univers et trois arènes Nexus**. Elle ajoute des montagnes enneigées, prairies, ravins, marais, sous-bois, ruines et reliefs volcaniques, avec leurs objectifs et chemins réels.

Le même moteur gère surfaces superposées, déplacements, attaques, objets et affichage. Les huit secteurs possèdent une géométrie propre à Tactics et des environnements dédiés ; leurs plans et fonds ne sont pas ceux des niveaux RPG, Combat ou Mêlée. Les grilles, distances et marqueurs de mission sont des adaptations originales des lieux et versions indiqués. **Leur reproduction officielle 1:1 n’est pas certifiée.**

[Galerie W14 en jeu](tactics-universes-2026-10-25/index.html) · [Résultat navigateur final](tactics-universes-2026-10-25/result.json) · [Revue des 18 captures](tactics-universes-2026-10-25/visual-review-final.json).

## 1. Choisir et lancer un terrain

1. Ouvrir **Combat custom**, sélectionner **TACTIQUE**, puis composer l’escouade et le camp adverse.
2. Dans **TERRAIN TACTIQUE**, choisir explicitement l’un des onze terrains verticaux. Ils portent la mention **plusieurs hauteurs**. Les anciennes cartes plates restent également proposées.
3. Pour une sélection automatique, choisir un stage archivé dans **STAGE**, puis **Automatique selon le stage**. Si son univers possède un secteur W14, le moteur recherche d’abord le lieu nommé, puis le secteur par défaut de cet univers. Pour *The Lord of the Rings*, le défaut est Ithilien ; un stage nommé Caradhras sélectionne Caradhras. Sans univers compatible, les règles historiques de sélection restent actives ; l’arène Nexus par défaut reste une carte plate.
4. Lancer la simulation. Le panneau **TERRAIN · HAUTEURS** apparaît au-dessus du plateau vertical. Il indique le lieu, l’univers, l’œuvre et l’objectif choisis, puis la case inspectée, son altitude, sa matière et son coût.
5. Cliquer une surface pour l’inspecter, ou donner le focus au plateau et déplacer le curseur avec les flèches. Confirmer avec **ALLER / CIBLER CETTE CASE** ou **Entrée**. L’inspection seule ne déplace aucune unité et ne dépense aucun point d’action.

Un choix explicite de secteur fixe son lieu et son univers de terrain, même si un autre stage était sélectionné auparavant. Tactics utilise son propre environnement ; l’image du stage archivé n’est pas réutilisée derrière le plateau. Les autres moteurs conservent leurs choix de stage. Le preset sauvegarde aussi le choix explicite ou automatique dans la Trace.

### Huit secteurs d’univers W14 — 25 octobre 2026

| Secteur et identifiant | Œuvre et période retenues | Dimensions | Reliefs, itinéraires et objectif livré |
| --- | --- | --- | --- |
| **FFVII — crêtes du mont Nibel** (`ff7_mt_nibel_tactics`) | *Final Fantasy VII* (1997), extérieurs sous le réacteur de Nibel | 14 × 11 | Deux accès à la crête par sentier rocheux ou maintenance ; passerelle et passage inférieur séparés. Contrôler le poste à Z 3, jusqu’à 3 points. |
| **FFXIII — steppe d’Archylte, ravin et plateaux** (`ff13_archylte_steppe_tactics`) | *Final Fantasy XIII* (2009), Gran Pulse | 16 × 11 | Prairie, ravin à Z −1, deux gués et promontoires à Z 1 et Z 2. Accumuler 4 points sur les deux postes. |
| **FFXV — marais du Vesper, gué et pontons** (`ff15_vesperpool_tactics`) | *Final Fantasy XV* (2016), Lucis avant l’ellipse de dix ans | 14 × 12 | Pontons étroits surélevés ou gué boueux plus coûteux ; l’eau profonde est impraticable. Gagner la berge d’extraction. |
| **LOTR — Caradhras, col et corniche neigeuse** (`lotr_caradhras_tactics`) | *La Communauté de l’Anneau* (2001, Peter Jackson), approche du col avant la Moria | 12 × 12 | Col enneigé de deux cases de large, corniche haute et parois opaques. Atteindre la zone d’extraction par un accès praticable pour le gabarit de l’unité. |
| **LOTR — Ithilien, sous-bois et ravin** (`lotr_ithilien_tactics`) | *Les Deux Tours* (2002, Peter Jackson), sous-bois des Rôdeurs du Gondor | 15 × 11 | Deux berges, fond de ravin à Z −1, passage en pierre, arbres de couvert et muret gondorien. Accumuler 4 points sur les postes des berges. |
| **Dark Souls — Noiresouche, cour encaissée** (`darksouls_darkroot_tactics`) | *Dark Souls* (2011), jardin de Noiresouche dans la continuité originale de Lordran | 13 × 12 | Descendre dans la cour puis remonter vers son enceinte à Z 2. Récupérer deux repères A.R.C.A. situés sur des surfaces différentes ; ces marqueurs sont propres au crossover. |
| **Mass Effect — Therum, faille et chantier** (`masseffect_therum_tactics`) | *Mass Effect* (2007), approche de l’excavation en 2183 | 16 × 10 | Franchissement naturel par îlot basaltique ou passerelle de chantier ; lave impraticable et rebords dangereux. Neutraliser les deux relais de mission destructibles. |
| **Halo 3 — Valhalla, rive et crête latérale** (`halo_valhalla_tactics`) | *Halo 3* (2007), direction visuelle de Valhalla | 16 × 12 | Rivière peu profonde plus coûteuse, pentes naturelles et crête forerunner. Accumuler 4 points entre le poste de rive à Z 0 et celui de crête à Z 2,5. Le secteur adapte ce lieu sans reproduire son plan multijoueur. |

Les deux cartes d’extraction prévoient une cible nominale de deux héros ; le moteur l’adapte au nombre de héros engagés lorsqu’une escouade plus petite est choisie. Les itinéraires utilisent les coûts, pentes, volumes, obstacles et hauteurs libres du terrain. Une pente visible n’est pas un raccourci gratuit, et choisir une surface haute ne crée pas de téléportation.

Dans les huit secteurs W14, le contrôle est évalué une fois à la fin d’un véritable tour d’unité : chaque poste occupé par un héros vivant et non contesté apporte un point. Rafraîchir l’affichage ou infliger des dégâts ne produit pas de points supplémentaires. Extraction, collecte et destruction vérifient leurs propres surfaces ou cibles, indépendamment de la seule image du décor.

Les [définitions W14](../src/game/tacticsUniverseBattlefields.js) conservent l’œuvre, la période, le lieu et les références documentaires de chaque secteur. Elles déclarent aussi leurs limites : grille adaptée, plan canonique non vérifié, textures procédurales et absence de certification 1:1. Les objectifs de reconnaissance, d’ancrage et de relais sont des missions originales A.R.C.A., pas des quêtes officielles de ces œuvres.

### Trois arènes Nexus conservées — ajout W13 du 24 octobre 2026

| Terrain | Dimensions | Organisation et objectif |
| --- | --- | --- |
| **Nexus — pont et passage inférieur** (`nexus_skybridge`) | 9 × 7 | Sol à Z 0, escalier puis tablier à Z 3. Contrôle du point situé sur le pont ; le passage inférieur reste une surface distincte. |
| **Nexus — terrasses des ruines** (`ruined_terraces`) | 9 × 7 | Herbe, terre et pierre, terrasse à Z 2, rampe et accès par escalier. Contrôle du point sur la terrasse. Certaines cases sont absentes du contour. |
| **Nexus — passerelles du réseau** (`cyber_catwalks`) | 10 × 7 | Sol technique, escaliers et passerelles métalliques à Z 3. Extraction vers les surfaces désignées en hauteur et danger au sol. |

Les [définitions Nexus](../src/game/tacticsVerticalBattlefields.js) conservent leurs géométries, apparitions, objectifs et ressources. Ces arènes d’entraînement restent des créations originales du Nexus ; leur direction cyber ou ruines ne revendique aucune architecture canonique d’un autre univers. W14 leur donne également un environnement Tactics indépendant.

### Commandes de vue et de sélection

| Commande | Effet réel |
| --- | --- |
| Clic sur le plateau vertical | Inspecte la surface visible sous le pointeur ; ne confirme pas une action. |
| Flèches, après avoir donné le focus au plateau | Déplace le curseur d’inspection d’une coordonnée ; privilégie la surface visible la plus proche de l’altitude courante. |
| Liste **Surfaces à cette coordonnée** ou touches `[` / `]` | Inspecte un autre étage visible au même XY, sans coût. La liste apparaît lorsqu’au moins deux surfaces sont visibles. |
| **Coupe du terrain** | Affiche tous les niveaux ou masque les surfaces entièrement situées au-dessus du niveau choisi. Les rampes et escaliers qui commencent sous cette limite restent visibles ; le sol sous un tablier masqué devient sélectionnable. |
| Boutons de coupe ou Page précédente / Page suivante | Parcourt les coupes disponibles. Cette commande change la vue, jamais l’altitude d’une unité. |
| **ALLER / CIBLER CETTE CASE** ou Entrée | Confirme le déplacement ou l’action sur la surface inspectée, selon la phase du tour. |
| Glisser sur le plateau | Déplace la caméra. Le geste ne confirme pas la case située à son arrivée. |
| Molette ou boutons **− Zoom** / **+ Zoom** | Règle le zoom ; les boutons sont également utilisables au tactile. |
| **Recadrer** | Rétablit le cadrage et le zoom du plateau, sans déplacer les unités. |
| Pause de session | Suspend la simulation et désactive les commandes de terrain. |

Les raccourcis du terrain s’appliquent lorsque le canvas possède le focus ; ils n’interceptent pas la saisie d’un champ ou d’une liste. Le panneau est utilisable au clavier et ses boutons ont une hauteur minimale de 40 pixels.

### Passer sous le pont

Sur la carte Nexus, **E4 à Z 0** et **E4 à Z 3** désignent deux destinations différentes. Choisir une coupe basse pour voir et inspecter le sol ; remettre **Tous les niveaux** pour inspecter le tablier ou choisir son étage dans la liste.

L’accès au tablier suit le véritable escalier **A4 → B4 → C4 → D4 → E4**, avec les coûts de ses passages. Il peut demander plusieurs tours. Choisir le tablier dans le panneau ne permet pas d’y téléporter une unité : la confirmation vérifie toujours le chemin, le budget, l’occupation et la hauteur libre.

## 2. Ce qui est branché au moteur

| Fonction | Implémentation |
| --- | --- |
| Catalogue et choix de carte | [tacticsBattlefields.js](../src/game/tacticsBattlefields.js), [customBattle.js](../src/game/customBattle.js), [CustomBattleMode.jsx](../src/components/CustomBattleMode.jsx) |
| Surfaces, voisinage, chemins et volumes | [tacticsTerrain.js](../src/game/tacticsTerrain.js) |
| Intégration aux tours, déplacements, attaques, objectifs et IA | [EngineTactics](../src/game/engineTactics.js) et [TacticsVerticalRuntime](../src/game/tacticsVerticalRuntime.js) |
| Faces, matières, profondeur et sélection visuelle | [tacticsTerrainRenderer.js](../src/game/tacticsTerrainRenderer.js) |
| Environnements Tactics, ambiances et silhouettes des décors physiques | [tacticsEnvironmentRenderer.js](../src/game/tacticsEnvironmentRenderer.js) |
| Huit secteurs d’univers, versions et scénarios W14 | [tacticsUniverseBattlefields.js](../src/game/tacticsUniverseBattlefields.js) |
| Contrôles et aperçu de case | [GameCanvas.jsx](../src/components/GameCanvas.jsx), [TacticsTerrainPanel.jsx](../src/components/TacticsTerrainPanel.jsx), [tacticsTerrainControls.js](../src/game/tacticsTerrainControls.js) |
| Ressources liées à un étage | [tacticsPickupSurface.js](../src/game/tacticsPickupSurface.js) et positions du catalogue |
| Conservation du terrain choisi dans la Trace | Normaliseurs du preset dans [customBattle.js](../src/game/customBattle.js) et [App.jsx](../src/App.jsx) |

Le plateau garde sa projection rectangulaire de trois quarts. Il n’a pas besoin de devenir une grille isométrique en losange pour posséder une altitude. Les anciennes cartes continuent leur chemin de compatibilité plat ; les cartes avec une liste de surfaces utilisent le runtime vertical.

## 3. Une case devient une surface adressable

Une surface possède un identifiant stable, des coordonnées XY, une altitude, quatre hauteurs de coin et une matière. Le repère des coins est **nord-ouest, nord-est, sud-est, sud-ouest**. Un même XY peut contenir plusieurs identités.

Extrait simplifié du format utilisé pour le pont Nexus :

```js
const battlefield = {
  id: 'nexus_skybridge', formatVersion: 2, cols: 9, rows: 7,
  surfaces: [
    {
      id: 'ground:4:3', x: 4, y: 3, z: 0,
      cornerZ: [0, 0, 0, 0], materialId: 'nexus-floor',
      shape: 'flat', solidBottom: -1, walkable: true
    },
    {
      id: 'bridge:4:3', x: 4, y: 3, z: 3,
      cornerZ: [3, 3, 3, 3], materialId: 'nexus-metal',
      shape: 'slab', layerId: 'bridge',
      solidBottom: 2.72, thickness: 0.28, walkable: true,
      coverEdges: { north: { height: 0.7, reduction: 0.2 } }
    }
  ]
};
```

Le tablier est une dalle mince dont le volume commence à Z 2,72, et non une colonne remplie depuis le sol. Le personnage du passage inférieur occupe l’espace libre sous cette dalle. `layerId` sert à décrire un groupe de surfaces ; il ne remplace ni leur altitude ni leur identité.

`normalizeTacticsTerrain` construit les index `byId`, `byCell` et le graphe de passages. Le moteur conserve `gridX/gridY` pour les règles de grille existantes et ajoute `surfaceId` et `gridZ` aux acteurs. Une demande XY ambiguë sans surface explicite ne choisit pas silencieusement l’étage supérieur.

Les apparitions, obstacles, zones d’extraction et ressources des nouvelles cartes référencent leur surface. Le choix du terrain est sauvegardé dans le preset custom ; cela n’ajoute pas une sauvegarde de combat en cours ou un éditeur de cartes.

## 4. Texturer chaque face en fonction de sa matière

Le rendu vertical ne découpe pas le dessin d’ambiance en rectangles pour en déduire des falaises. Il construit les faces à partir des hauteurs réelles, puis dessine leur matériau dans le repère du monde.

| Partie | Comportement livré |
| --- | --- |
| Dessus | Motif de dalles, pierre, terre, herbe, métal, bois ou eau selon `materialId` ; les repères du motif suivent la géométrie de la surface. |
| Flanc | Face limitée à la portion de paroi exposée, avec des détails verticaux propres à la famille de matériau. Une haute paroi ne reçoit pas un dessus simplement étiré. |
| Rampe | Coins de hauteur différents ; dessus et arêtes suivent l’inclinaison. |
| Escalier | Marches et contremarches orientées selon l’accès ; le niveau des pieds évolue le long du chemin. |
| Pont ou passerelle | Dessus, tranche, dessous et garde-corps sont des éléments distincts. Le volume vide sous la dalle reste vide. |
| Raccord | Les voisinages et les bords se déduisent des contacts de géométrie et de matière, plutôt que d’un simple XY partagé entre étages. |
| Surcouche de jeu | Cases atteignables, chemin, cible, danger et objectif sont ajoutés après le matériau ; la texture ne décide pas des dégâts ou de l’occupation. |

Le catalogue comporte **27 matières : 11 références antérieures et 16 nouvelles références W14**. Ces seize matières ont leurs palettes et s’appuient sur des familles de rendu adaptées : roche fracturée, terre stratifiée, herbe, neige, vase, eau, lave, pierre ou panneaux architecturaux. Elles ne représentent pas seize algorithmes de texture entièrement différents.

| Groupe W14 | Matières réellement disponibles | Adaptation aux faces |
| --- | --- | --- |
| Mont Nibel | `nibel-rock`, `mako-metal` | Facettes et fractures de roche ; panneaux et teintes de métal du réacteur. |
| Prairies et sous-bois | `steppe-grass`, `meadow-grass`, `pine-earth` | Dessus herbeux ou forestier, terre et strates sur les flancs exposés. |
| Marais et gués | `swamp-mud`, `shallow-water` | Vase et berges ; motifs d’eau sur les surfaces qui déclarent leurs propres coûts et permissions. |
| Montagne enneigée | `snow`, `alpine-rock` | Croûte et bord de neige ; roche naturelle sous les pentes et parois. |
| Noiresouche | `darkroot-moss`, `darkroot-stone` | Couvert végétal et pierre envahie ; fissures distinctes d’une maçonnerie régulière. |
| Therum | `basalt`, `lava`, `prothean-concrete` | Roche sombre, veines de lave et surfaces du chantier. |
| Valhalla | `halo-grass`, `forerunner-alloy` | Sol herbeux stratifié et panneaux d’architecture forerunner. |

Bois et pierre ancienne restent disponibles pour les pontons et passages adaptés. Les arbres, rochers, murs ruinés, conduites, générateurs et pylônes sont dessinés à l’emplacement et à la hauteur des véritables obstacles. Leurs volumes participent à l’occupation et à la ligne de vue ; les silhouettes lointaines du fond restent décoratives.

### Environnements indépendants des autres moteurs

Chaque secteur W14 dessine son ciel, son horizon, ses reliefs lointains et son ambiance à partir d’un profil Tactics dédié : crêtes de Nibel, steppe, marais, pics enneigés, sous-bois d’Ithilien, forêt ancienne, paysage volcanique ou vallée forerunner. Les effets de fond respectent la pause et la préférence de mouvement réduit. Ils entourent la géométrie jouable, sans définir une collision supplémentaire.

Les trois Nexus et toutes les anciennes cartes plates utilisent aussi un environnement procédural Tactics. Ce repli reprend la famille de matière et la palette du contexte, sans inventer un lieu officiel. Les cartes plates gardent leur géométrie antérieure ; un complément de tuiles propre à Tactics peut texturer leurs cases lorsqu’il existe. Le moteur n’étire plus une scène peinte sur la grille et n’utilise pas le fond partagé des autres modes. Lorsqu’une arène de base est forcée ou qu’un contenu est désactivé, le fond revient au Nexus sans conserver les motifs de la source supprimée.

Ces textures sont **procédurales**, sans atlas de textures officielles ni certification 1:1. Un futur kit graphique par univers pourra remplacer un matériau en conservant les mêmes surfaces, à condition de fournir des dessus, flancs, bords et dessous compatibles. Il devra préciser œuvre, période, lieu et provenance ; utiliser une même collision ne justifie pas de reprendre le dessin d’un autre univers.

## 5. Déplacement, points d’action et unités larges

La navigation est un graphe de surfaces. Les voisins ordinaires restent orthogonaux ; leurs bords doivent être compatibles avec la hauteur de marche autorisée. Les escaliers et rampes possèdent des passages explicites. Deux surfaces superposées ne reçoivent pas une liaison verticale du seul fait de partager XY.

La recherche de déplacement utilise Dijkstra, un meilleur coût par `surfaceId`, et conserve la route complète ainsi que les types de transition. Le budget et le coût confirmé utilisent ce même calcul. Le chemin exécuté suit les surfaces intermédiaires et leur hauteur ; il ne trace pas une diagonale à travers le vide.

Lorsqu’un déplacement est confirmé, ses points d’action sont dépensés et la phase passe au déplacement animé. Les commandes d’action attendent la fin de ce trajet. Annuler une visée non confirmée permet de reprendre le déplacement avec les points restants ; cela ne rembourse pas les déplacements déjà acceptés.

La traversée tient compte de l’occupation, de la hauteur libre et de l’empreinte définie par `tacticsFootprint`. Une grande unité doit disposer d’un support compatible sur toutes les cases de son empreinte. Un passage libre pour une unité de taille normale peut être trop bas ou trop étroit pour un boss. Les conditions viennent de la géométrie et du profil de l’unité, jamais du motif peint.

Les onze terrains livrés utilisent la marche, les pentes, les rampes et les escaliers déclarés par leur géométrie. Les rivières, gués et détours introduisent aussi des choix de coût et d’accès. Les contrats prévoient d’autres capacités de traversée, mais cette extension n’accorde pas automatiquement vol, saut, chute avec dégâts, ascenseur ou escalade à tous les personnages.

## 6. Combat, couverture et objectifs entre étages

Les cibles, cellules d’impact et menaces portent une identité de surface. Les attaques prennent en compte la différence d’altitude ; le contact possède une contrainte verticale et les actions à distance utilisent leur profil de portée. Un ennemi situé directement au-dessus ne devient pas un adversaire au contact par égalité XY.

La ligne de vue intersecte les volumes du terrain et des obstacles. Un tir peut passer sous un pont si le rayon passe dans l’espace libre ; traverser son plancher opaque demande une capacité qui le déclare explicitement. Désactiver la vue ordinaire d’un profil ne suffit pas à lui accorder implicitement `pierceTerrain`.

Les zones d’effet vérifient également la hauteur et l’obstruction depuis leur centre. Une explosion sur le pont n’inflige donc pas automatiquement ses dégâts à l’unité située sous la dalle. Les bonus de hauteur se calculent depuis Z ; les garde-corps et types de couvert renseignent la protection du bord concerné, selon le profil d’action.

Les noms et règles des actions des terrains verticaux passent par les définitions de combat résolues. Un soutien conserve ses cibles alliées et ses effets de protection, soin ou amélioration ; une nouvelle hauteur ne le transforme pas en projectile offensif.

Les points de contrôle, zones d’extraction, objets et occupants sont comparés sur leur surface exacte. Le sol sous un objectif placé sur le tablier ne valide pas sa capture. Une ressource sur le sol ne se déclenche pas depuis le pont au même XY. Les chemins d’IA et les indications de menace utilisent ces mêmes identités et règles.

## 7. Caméra, profondeur et sélection

La projection part du service existant `getPerspectivePoint(x, y)` et ajoute le décalage d’altitude :

```text
écranX = projectionXY.x
écranY = projectionXY.y − z × baseCellH × 0,74 × zoom
```

Surfaces, pieds des acteurs, ressources, impacts et contours de ciblage partagent ce repère. Le tri de scène assemble les faces et les acteurs avec leurs relations de profondeur, notamment l’unité qui se trouve sous un tablier et celle qui se tient dessus.

La sélection teste la surface visible dans l’ordre du rendu et retourne son `surfaceId`, en plus des coordonnées de grille. La coupe de vue masque les surfaces supérieures sans retirer les volumes du calcul de combat : masquer le pont ne permet pas de tirer à travers.

Le rendu reste en Canvas 2D, avec une caméra de trois quarts, déplacement et zoom. Il n’utilise pas de tampon de profondeur WebGL et n’ajoute pas de rotation libre de caméra. Les géométries arbitraires qui s’intersectent demanderaient des contraintes ou un autre mode de rendu.

## 8. Compatibilité et extension du contenu

Les cartes historiques restent plates. Leur adaptation crée une surface `legacy:x:y` à Z 0 et conserve les types, coûts et bonus historiques. Leurs anciennes cases `high` ne deviennent pas automatiquement des falaises : leurs apparitions et objectifs n’ont pas été conçus pour ces nouveaux accès.

Pour ajouter un terrain vertical :

1. Déclarer une carte de format 2 et ses surfaces, altitudes, coins, matériaux et volumes solides.
2. Relier explicitement les changements de niveau et vérifier le chemin pour les unités et empreintes prévues.
3. Attacher chaque apparition, obstacle, objectif et ressource à sa surface ; vérifier les hauteurs libres et les positions sous les ponts.
4. Choisir ou produire les matériaux cohérents avec le lieu, sans confondre motifs de démonstration et textures de source vérifiées.
5. Vérifier la sélection, la route, la portée, la couverture, les objectifs et les deux camps avec la caméra déplacée et zoomée.
6. Documenter la provenance et les limites, puis inclure le terrain dans les tests et la compilation complète.

La livraison comprend les trois arènes Nexus et les huit secteurs d’univers décrits en ouverture, soit onze cartes verticales. Les autres univers conservent leurs terrains compatibles et un environnement Tactics dédié ; ils ne reçoivent pas chacun une nouvelle topologie verticale ou un plan canonique vérifié.

## 9. Vérifications reproductibles et preuves datées

Depuis la racine du dépôt :

```bash
npm run test:tactics-verticality
npm run lint
```

La commande de terrain comprend les suites géométriques et de rendu W13 ainsi que les données, la présentation, la sélection automatique et le véritable runtime W14. Lors de la validation W14, **121 tests** passent. Les tests de [données et chemins W14](../scripts/tacticsUniverseBattlefields.test.mjs), de [rendu dédié](../scripts/tacticsUniversePresentation.test.mjs), de [sélection des niveaux](../scripts/tacticsUniverseRouting.test.mjs) et de [runtime et objectifs](../scripts/tacticsUniverseRuntime.test.mjs) restent distincts du contrôle navigateur.

### W14 — preuve finale du 25 octobre 2026

Le [harnais W14](../scripts/tacticsUniverseUi.browser.mjs) lance le vrai parcours **CustomBattleMode → GameCanvas → EngineTactics**. Son [résultat final](tactics-universes-2026-10-25/result.json) conserve les empreintes avant/après, le harness utilisé, ses artefacts et la fermeture du navigateur. Il constate :

- **10 lancements réels** : les huit secteurs d’univers, le pont Nexus et la grille plate d’instruction ;
- **27 contrôles** : huit inspections avec coupes, zoom et recentrage, un déplacement confirmé au mont Nibel avec son coût PA exact, dix lancements avec environnement dédié et huit contrôles à 375 pixels de large ;
- **18 captures inspectées** : dix vues desktop et huit vues mobiles, regroupées dans la [galerie](tactics-universes-2026-10-25/index.html) et liées à la [revue visuelle finale](tactics-universes-2026-10-25/visual-review-final.json) ;
- aucune erreur JavaScript de page, des sources et un harness stables pendant l’exécution, puis fermeture effective du navigateur après le parcours.

Sur mobile, le plateau s’ouvre à l’échelle d’ensemble ; les commandes de zoom et de recentrage permettent d’en examiner les cases. Ce parcours UI vérifie les lancements, les commandes et un mouvement réel. La résolution des objectifs des huit cartes et les cas adverses appartiennent aux tests du moteur ; la revue d’images ne remplace pas ces tests ni une certification de source 1:1.

Pour un nouveau contrôle pendant le développement, avec Vite et Playwright/Chromium disponibles :

```bash
node scripts/tacticsUniverseUi.browser.mjs --preliminary
```

Les chemins se règlent par `TACTICS_UI_URL`, `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH` et `TACTICS_UNIVERSE_PROOF_DIR`. Le mode `--after-integration-freeze` exige un gel réel et refuse toute modification des sources ou du harness durant le parcours. Chaque nouvelle exécution doit utiliser un répertoire de preuve distinct pour préserver les résultats antérieurs.

### Historique W13 — dossier du 24 octobre 2026

Le [harnais UI W13](../scripts/tacticsVerticalityUi.browser.mjs) et son [résultat final daté](tactics-verticality-2026-10-24/ui/final/result.json) restent conservés. Ils documentent les trois terrains Nexus, seize contrôles UI, les coupes, le curseur et ses étages, la pause, la caméra et un trajet réel par l’escalier du pont avec vérification des pieds du sprite. La [revue visuelle W13](tactics-verticality-2026-10-24/ui/final/visual-review.json) accompagne ces preuves historiques. W14 ajoute sa propre preuve ci-dessus, sans réécrire ces résultats.

L’[ancienne maquette HTML](tactics-terrain-demo.html) reste une illustration autonome antérieure à l’intégration. Son terrain et ses règles locales n’exécutent pas le moteur du jeu. Le parcours jouable actuel est **Combat custom → TACTIQUE → TERRAIN TACTIQUE**.

[Retour au README](../README.md) · [Moteur Tactics](../src/game/engineTactics.js) · [Secteurs d’univers W14](../src/game/tacticsUniverseBattlefields.js) · [Arènes Nexus W13](../src/game/tacticsVerticalBattlefields.js)
