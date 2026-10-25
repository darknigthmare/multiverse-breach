# Lot 13 — 40 personnages et terrains tactiques verticaux

Le lot reprend Alien et Aliens, Alien: Isolation, Portal 2 et Lab Rat, les œuvres sélectionnées du Disque-monde, Metal Gear Solid 1/3, les versions précisées de Star Wars, The Last of Us 1/2 et DOOM 2016. Les périodes, costumes, équipements et gestes sont consignés avant les dessins dans la [sélection préédition](batch-plan-before.json) et les [définitions de source](../../src/game/combat/combatSourceDefinitionsWave13.js).

- A : Ellen Ripley, Corporal Hicks, Bishop, Captain Dallas, Parker, Lambert, Ash, Amanda Ripley, Chell, Atlas, P-Body, GLaDOS, Wheatley, Doug Rattmann, Rincewind, Sam Vimes, Granny Weatherwax, Twoflower, Death, Nanny Ogg.
- B : Meryl Silverburgh, Liquid Snake, The Boss, Revolver Ocelot, Gray Fox, Big Boss, Luke Skywalker, Darth Vader, Ahsoka Tano (Adult), Aayla Secura, Darth Revan, Obi-Wan Kenobi, Yoda, Darth Maul, Joel, Tess, Tommy Miller, Dina, Abby Anderson, Samuel Hayden.

Livraison mesurée : **35 planches complètes de 32 poses**, **35 bases de 16 poses**, **1 manifeste Mêlée de 45 états** et **6 partenaires RPG de 16 poses**. Les nouvelles planches partielles sont suivies séparément : 0. L'ensemble représente **1956 poses natives dans 82 nouveaux PNG**. Les cellules inutilisées des planches Mêlée, captures de contrôle, miroirs P1/P2, changements d'échelle et dessins historiques réutilisés sont exclus de ce total.

Les 40 personnages ont un kit documenté : 18 nouvelles identités dans le catalogue de capacités et 22 révisions de versions déjà rédigées. Leurs supers comprennent 24 actions offensives (14 au contact, 10 projectiles) et 16 soutiens. Les consignes, soins et protections gardent leur comportement sans dégât ; une silhouette munie d'une arme ne transforme pas une recette de soutien en attaque. Les 40 recettes possèdent sept phases de présentation. Une base16 reste composée de quatre états de quatre dessins, sans garantir un dessin distinct pour chacune des capacités.

**Cinq personnages restent sans nouvelle planche32 ni base16 : Darth Vader, Obi-Wan Kenobi, Yoda, Darth Maul et Ahsoka Tano.** Les quatre premières demandes ont reçu des refus explicites du fournisseur. Ahsoka a reçu des images, puis ses corrections de séparation et de cohérence des deux sabres n'ont pas permis une livraison visuelle retenue ; les refus correctifs et images écartées restent distincts d'un refus initial. Aucun de ces fichiers n'est compté comme livré. Leurs kits restent documentés et leurs replis utilisent les PNG antérieurs. Luke reçoit ses nouveaux dessins W13 et sort des anciennes exclusions. Les refus historiques des autres personnages restent conservés. [Provenance et incidents B](part-b/README.md) · [Demandes réelles](part-b/sources).

Ellen Ripley reçoit dans ce lot la couverture Mêlée complète de 45 états, soit 180 poses par manifeste. Les cellules sont reliées à des états physiques distincts, en conservant les collisions et positions du moteur. Les nouveaux corps de renfort RPG sont ceux de Ellen Ripley, Corporal Hicks, Atlas, Sam Vimes, Meryl Silverburgh, Joel. Chaque renfort utilise un personnage du même univers que son appelant ; ce relais de gameplay ne certifie pas une alliance narrative ni une invocation officielle. Les soutiens restent sans dégât et aucun nouveau corps natif n'est déclaré pour Obi-Wan. [Sources et chronologie des renforts](summon-provenance.json) · [Mêlée Ripley](ripley-sources/README.md).

| Couverture cumulative | Mesure |
| --- | --- |
| Catalogue | 1911 personnages, 525 univers |
| Capacités rédigées | 1528 personnages, 4480 actions simples/secondaires/défenses |
| Présentations complètes32 | 266 ; 1645 personnages sans cette couverture |
| Présentations partielles | 2, exclues des complètes |
| Mêlée complète45 | 14 ; 1897 personnages sans cette couverture |
| Bases corrigées16 | 214 |
| Recettes de présentation | 280 personnages, 1960 associations personnage/phase |
| Invocations et renforts natifs16 | 43 |
| Décors | 415 mécanismes dans 204 univers |
| Univers avec ambiance seule | 321 |
| Inventaire combat suivi | 638 PNG, 111 registres |

**Aucune nouvelle animation de stage n'est livrée par W13.** Les 415 mécanismes déjà présents sont conservés. Les trois terrains tactiques ci-dessous sont des arènes originales Nexus jouables, distinctes de cet inventaire d'animations de scènes précises.

## Verticalité Tactics intégrée au jeu

Dans **Combat personnalisé → Tactics → Terrain tactique**, choisir **Nexus — pont et passage inférieur**, **Nexus — terrasses des ruines** ou **Nexus — passerelles du réseau**. Les trois cartes démarrent une bataille réelle sur des surfaces identifiées en XYZ. Les escaliers et rampes relient les étages ; un pont et son passage inférieur gardent des occupations, obstacles, objets et trajectoires séparés. Le chemin consomme ses PA lors de la confirmation. La portée, la ligne de vue, les volumes du terrain, le gabarit du combattant et l'espace disponible participent aux décisions de déplacement et de ciblage.

Le panneau intégré permet de choisir une coupe, inspecter les surfaces superposées et confirmer la destination. Cliquer inspecte ; **Entrée** ou le bouton **ALLER / CIBLER CETTE CASE** confirme. Les flèches déplacent le curseur, **Page précédente / Page suivante** changent la coupe et **[ / ]** parcourent les surfaces empilées. Les coordonnées, altitude, matériau, coût et motifs d'interdiction apparaissent dans l'interface. Zoom, recentrage et commandes tactiles utilisent la caméra réelle. Une coupe masque les niveaux supérieurs pour rendre les passages inférieurs sélectionnables.

Les dessus, flancs et dessous possèdent des matériaux procéduraux cohérents avec les surfaces. Les anciennes cartes restent plates et gardent leurs contrôles. Cette livraison Canvas ne convertit pas tous les univers en cartes canoniques, ne fournit pas de textures officielles ni de rendu WebGL. Le [guide technique et jouable](../tactics-terrain-verticality.md) décrit les règles, le format des terrains, les commandes et les limites. Les [preuves Tactics](../tactics-verticality-2026-10-24/) concernent le parcours dans le jeu ; l'ancien [HTML d'illustration](../tactics-terrain-demo.html) reste seulement un support historique.

Build complet réussi (code 0), 1569 tests dans 18 groupes, aucun échec. [Journal du build](build.log) · [Validation](validation.json) · [Preuves navigateur](browser-checks.json).

La vérification conserve les 104 registres et 556 PNG du lot W12 et compare les géométries historiques de rendu avec ses traces navigateur. Les contrôles Chromium chargent les images locales et parcourent les quatre cellules de chaque phase, des deux camps ; les captures et tentatives préliminaires sont conservées avec leurs empreintes. Les exclusions restent des replis explicites et ne deviennent pas des poses nouvelles.

**Fidélité source 1:1 certifiée : false.** Les versions, équipements, costumes et actions sont documentés et revus ; les dessins générés et adaptations de gameplay ne sont pas des frames officielles. Les provenances [A](part-a/README.md) et [B](part-b/README.md) conservent les sources, corrections et exclusions.

[Couverture des 1911 personnages](coverage.csv) · [Audit](current.json) · [Livraisons mesurées](deliverables.json) · [Contrôles navigateur](browser-checks.json) · [Revues visuelles des planches](browser/visual-review-final.json) · [Audit W12 conservé](baseline.json).
