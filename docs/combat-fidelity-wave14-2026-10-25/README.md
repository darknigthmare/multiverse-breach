# Lot 14 — 40 personnages et huit secteurs Tactics

Ce lot traite les quarante identités fixées avant édition dans la [sélection](batch-plan-before.json), en deux groupes de vingt exécutés en parallèle. Il comprend douze nouvelles identités dans le catalogue de capacités et vingt-huit révisions de versions déjà rédigées. Les vingt-six anciennes fiches de complétion sont conservées sans réécriture. La clôture est validée : build complet avec code de sortie 0, 1681 tests réussis dans 18 groupes et vérification HTTP des 730 PNG suivis.

Les [sources](../../src/game/combat/combatSourceDefinitionsWave14.js) précisent œuvre, période, costume, arme et geste. Aragorn est le rôdeur de *La Communauté de l’Anneau* (2001), avec son épée de rôdeur ; Buck reste celui d’*ODST* (2009) ; Titus conserve son équipement de *Space Marine* (2011). Le Voyageur de *No Man’s Sky* et le Courrier de *Fallout: New Vegas* utilisent des apparences choisies et déclarées, puisque leurs visages ne sont pas canoniquement fixes.

Les 160 emplacements de capacité sont nommés par personnage. Les supers comprennent trente-trois actions offensives (quinze au contact, dix-sept projectiles et le Typhoon radial de Jensen) et sept soutiens. La garde du bâton de Gandalf, le bouclier de Solaire et les communications de Jonah, Nada, Polo, Malik et Vega restent des soutiens sans dégâts. Les renforts RPG utilisent un personnage du même univers ; cette adaptation de gameplay ne certifie pas une alliance narrative ou une invocation officielle.

## Livraison vérifiée

**40 planches de 32 poses, 40 bases de 16 poses, Aragorn avec 45 états Mêlée (180 poses), et six partenaires RPG de 16 poses : 2 196 poses distinctes dans 92 nouveaux PNG.** Aucune planche du lot ne reste manquante. Chaque base16 comprend quatre états de quatre dessins ; le suivi des animations par capacité reste distinct du suivi des capacités nommées. Les corrections et exclusions restent archivées ; aucun dessin rejeté, miroir, remplissage ou réemploi historique n’est compté comme nouvelle pose.

| Couverture cumulative | Mesure |
| --- | --- |
| Catalogue | 1 911 personnages, 525 univers |
| Capacités rédigées | 1 540 personnages, 4 517 actions simples/secondaires/défenses |
| Présentations complètes32 | 306 ; 1 605 personnages sans cette couverture |
| Présentations partielles | 2, hors total des complètes |
| Mêlée complète45 | 15 ; 1 896 personnages sans ce manifeste complet |
| Bases16 corrigées | 254 |
| Invocations et renforts natifs16 | 49 : 42 partenaires du roster et 7 entités ou équipements |
| Recettes de présentation du roster | 320 |
| Inventaire suivi | 730 PNG, 118 registres ; les 638 PNG et 111 registres antérieurs restent inchangés |

Les [livraisons mesurées](deliverables.json) et la [couverture par personnage](coverage.csv) donnent le détail. Sources et exclusions : [groupe A](part-a/README.md), [groupe B](part-b/README.md), [Aragorn](aragorn-sources/browser/aragorn-evidence.json), [renforts RPG](summon-provenance.json). Les supers comprennent 33 actions offensives et sept soutiens ; le Typhoon de Jensen reste radial et centré sur lui, avec portée limitée.

## Des niveaux propres à Tactics

Huit secteurs jouables s’ajoutent aux trois terrains verticaux Nexus. Ce sont des géométries tactiques originales adaptées aux lieux et aux périodes indiqués, pas des copies certifiées des plans officiels. Le [catalogue des secteurs](../../src/game/tacticsUniverseBattlefields.js) conserve cette distinction dans chaque provenance.

| Secteur | Référence retenue | Situation jouable |
| --- | --- | --- |
| Mont Nibel | *Final Fantasy VII*, 1997 | Relief rocheux, énergie Mako, ravins et passages en hauteur |
| Steppe d’Archylte | *Final Fantasy XIII*, 2009 | Herbes, plateau, gué et ruptures de pente |
| Vesperpool | *Final Fantasy XV*, 2016 | Zone humide, berges et passerelles |
| Caradhras | *La Communauté de l’Anneau*, film de 2001 | Col enneigé et chemins de montagne |
| Ithilien | *Les Deux Tours*, film de 2002 | Sous-bois, ravin et passages superposés |
| Jardin de Noiresouche | *Dark Souls*, 2011 | Forêt, ruines et couverts physiques |
| Therum | *Mass Effect*, 2007 | Basalte, lave et architecture prothéenne |
| Valhalla | *Halo 3*, 2007 | Prairie, ruisseau et structures Forerunner |

Les surfaces portent leur hauteur, leurs coins inclinés, leur matériau et leur aptitude à recevoir une unité. Leurs faces supérieures, flancs et dessous de dalle sont dessinés selon la matière. Les arbres et obstacles possèdent des volumes réels : ils affectent le passage et la ligne de vue. Les objectifs proposent contrôle, extraction, collecte ou destruction ; leurs accès sont vérifiés depuis les trois départs de héros. Le contrôle de secteur ne progresse qu’une fois par tour réellement terminé.

Un combat custom Tactics choisit le secteur de l’univers sélectionné, ou un secteur explicite ; le panneau affiche le lieu, l’œuvre et l’objectif avant le lancement. Les anciennes priorités d’objectifs de mission restent conservées. Le filtrage DLC revient à une scène Nexus complète. Chaque niveau Tactics utilise son environnement dédié ; les images d’arène des autres moteurs ne servent plus de fond Tactics. Les anciens terrains plats conservent seulement leurs atlas de tuiles Tactics distincts.

## Fidélité et preuves

Les dessins générés et les adaptations de mécaniques ne sont pas certifiés 1:1. Les drapeaux de provenance restent faux pour cette certification. Une image refusée ou rejetée ne devient pas une nouvelle pose ; recadrage, miroir, redimensionnement et capture de contrôle ne créent pas de dessins supplémentaires. Les 638 PNG et les 111 registres de la livraison précédente doivent rester identiques octet par octet.

La clôture a observé 1681 tests réussis dans 18 groupes, un build complet avec code de sortie 0 et le décodage des 730 PNG avec égalité des octets public/dist/HTTP. Les 3 583 empreintes de l’audit sont inchangées après le build.

- [Validation finale](validation.json) · [Journal du build](build.log) · [Audit figé](current.json) · [Essais de clôture](build-notes.md).
- [Sept domaines de preuves](browser-checks.json) : présentations et bases des deux camps, 240 cas de combat, 80 Tactics, 34 vols physiques, 12 parcours RPG SSR et 12 GameCanvas, quatre parcours Aragorn, dix lancements Tactics.
- [Ressources servies](browser/production-assets-http.json) · [Revue des présentations](browser/visual-review-final.json) · [Revue des supers](browser/native-super-runtime-visual-qa.json).
- [Galerie Tactics](../tactics-universes-2026-10-25/index.html) · [Parcours physiques Aragorn](aragorn-sources/browser/aragorn-evidence.json).

Les refus et manquants historiques restent dans leurs rapports. Les capacités et dessins livrés ne certifient pas une fidélité officielle 1:1.
