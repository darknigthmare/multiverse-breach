# Lot 12 — 40 personnages

Ce lot reprend Silent Hill 1/2/3 originaux, Dino Crisis 1/2, Predator et ses films sélectionnés, Evil Dead, Dead Space, Futurama et Rick & Morty. Les œuvres, périodes, équipements et actions sont consignés dans les quatre définitions de source et la [sélection préédition](batch-plan-before.json).

- A : Pyramid Head, James Sunderland, Heather Mason, Harry Mason, Alessa Gillespie, Maria, Cybil Bennett, Claudia Wolf, Regina, Dylan Morton.
- B : Yautja Hunter, City Hunter, Dutch Schaefer, Anna Gonsalves, Billy Sole, Mac Eliot, Mike Harrigan, Greyback Elder, Naru, Royce.
- C : Ash Williams, Annie Knowby, Henry the Red, Pablo Bolivar, Kelly Maxwell, Ruby Knowby, Isaac Clarke, John Carver, Ellie Langford, Nicole Brennan.
- D : Philip J. Fry, Leela, Bender, Amy Wong, Hermes Conrad, Zoidberg, Rick Sanchez, Morty Smith, Summer Smith, Birdperson.

Livraison enregistrée : **39 planches complètes de 32 poses**, **39 bases de 16 poses**, **1 manifeste Mêlée de 45 états** et **7 partenaires RPG de 16 poses**. Les nouvelles planches partielles sont suivies séparément : 0. Ces ressources représentent **2164 poses natives dans 91 nouveaux PNG** ; les captures, variantes de rendu et poses historiques réutilisées en sont exclues.

Les 40 personnages ont un kit documenté : 19 nouvelles identités dans le catalogue de capacités et 21 révisions de version. Leurs supers comprennent 24 actions offensives (10 au contact, 14 projectiles) et 16 soutiens. Les instructions, soins et protections n'inventent pas de pouvoirs offensifs. Les 40 recettes possèdent chacune sept phases de présentation ; les planches complètes possèdent aussi quatre poses de super. Une base16 ne représente pas un dessin unique pour chaque capacité.

**Morty reste sans nouveau dessin.** Sa demande a reçu un refus explicite, conservé dans [les incidents D](part-d-request-failures.json). Aucune nouvelle planche32 ou base16 n'est comptée pour lui. Son soutien et ses présentations réutilisent une cellule calme existante, avec calibration déclarée dans [la preuve de repli](part-d-blocked-support-reuse.json). Les refus historiques restent distincts et leurs fichiers sont préservés.

Isaac reçoit 45 états physiques et 180 poses, en tenue d'ingénieur de Dead Space 2008. Les armes, coups, gestes de rebord et mouvements ont leurs sources natives ; le dessin ne déplace pas les collisions. Les sept nouveaux partenaires sont Cybil, Regina, Dutch, Ash, Isaac, Leela et Birdperson. Les partenaires sont du même univers que leur appelant ; cette adaptation de gameplay ne certifie aucune alliance narrative. Birdperson effectue un soutien défensif, sans dégât. [Sources RPG](summon-provenance.json) · [Preuves Mêlée Isaac](isaac-sources/browser/isaac-evidence.json).

| Couverture cumulative | Mesure |
| --- | --- |
| Catalogue | 1911 personnages, 525 univers |
| Capacités rédigées | 1510 personnages, 4426 actions simples/secondaires/défenses |
| Présentations complètes32 | 231 ; 1680 personnages sans cette couverture |
| Présentations partielles | 2, exclues des complètes |
| Mêlée complète45 | 13 ; 1898 personnages sans cette couverture |
| Bases corrigées16 | 179 |
| Recettes de présentation | 243 personnages, 1701 associations personnage/phase |
| Invocations et renforts natifs16 | 37 |
| Décors | 415 mécanismes dans 204 univers |
| Univers avec ambiance seule | 321 |
| Inventaire combat suivi | 556 PNG, 104 registres |

Les 14 nouveaux mécanismes concernent des scènes précises de sept univers déjà couverts. Leurs anciens réglages par défaut restent identiques. Ce sont des études de structures et de cycles naturels, sans frame officielle ni modification des collisions, du terrain ou des PV.

Le [guide Tactics](../tactics-terrain-verticality.md) décrit comment passer du plateau XY actuel à des surfaces identifiées en XYZ : dessus, flancs, dessous, raccords de matériaux, escaliers, ponts et passages inférieurs. Le [démonstrateur interactif](../tactics-terrain-demo.html) permet d'explorer les niveaux, matériaux, chemins et sélections. **Cette proposition et ce prototype documentaire n'intègrent pas encore la verticalité au moteur Tactics.**

Build complet réussi (code 0), 1460 tests dans 17 groupes, aucun échec. [Journal du build](build.log) · [Validation](validation.json) · [Preuves navigateur](browser-checks.json).

Les costumes, versions et équipements sont revus, mais les dessins générés et mécaniques adaptées ne constituent pas une fidélité source 1:1 certifiée. Les provenances [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et [D](part-d-provenance.json) conservent les sources, corrections et exclusions.

[Couverture des 1 911 personnages](coverage.csv) · [Audit](current.json) · [Livraisons](deliverables.json) · [Contrôles navigateur](browser-checks.json) · [Revue indépendante](independent-review.json) · [État précédent conservé](baseline.json).
