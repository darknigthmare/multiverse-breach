# Combat et animations — vague 6, 20 octobre 2026

**Lot intégré : 804 nouvelles poses utilisées dans 30 PNG, et 24 mécanismes de décor supplémentaires.** Les compteurs ci-dessous sont calculés après l’import du lot C depuis les catalogues et manifestes actifs, avec contrôle des fichiers liés. La compilation complète et ses 1 109 tests sont validés ; les preuves et les manques restants sont détaillés ci-dessous.

| Ajout de cette vague | Poses utilisées | PNG |
| --- | ---: | ---: |
| Présentations et supers de 15 personnages : huit phases de quatre poses | 480 | 15 |
| Manifeste Mêlée de Sonic : 45 états de quatre poses | 180 | 6 |
| Bases corrigées de Tails, Nero, Lady, Parasoul, Joseph et Beowulf : quatre états de quatre poses | 96 | 6 |
| Shiva, Star Platinum et Tornado : quatre phases de quatre poses | 48 | 3 |
| **Total du lot** | **804** | **30** |

Les quinze personnages de présentation sont Sonic, Tails, Knuckles, Jotaro, Giorno, Dante, Nero, Lady, Parasoul, Big Band, Solid Snake, Raiden, Otacon, Joseph Joestar et Beowulf. Les huit phases illustrées comprennent introduction, sortie, résultat de chaque manche, finale, victoire, défaite et super. Les finales restent des présentations adaptées, sans exécution graphique ajoutée.

| Couverture cumulée sur 1 911 personnages et 525 univers | Livré | Manque restant |
| --- | ---: | ---: |
| Atlas dédiés aux huit phases de présentation et de super | 65 personnages, 2 080 poses | 1 846 personnages |
| Manifeste Mêlée illustré complet de 45 états | 5 personnages : Cloud, Tifa, Goku, Vegeta, Sonic | 1 906 personnages |
| Bases corrigées | 13 personnages, 208 poses | Mesure distincte des présentations et manifestes complets |
| Entités avec quatre phases illustrées de quatre poses | 4 identités, 64 poses | 24 autres identités conservent leurs atlas à quatre poses ; les 28 anciens atlas restent disponibles |
| Présentations scriptées | 66 recettes, dont 65 personnages du roster et 455 paires personnage/phase | Les recettes ne prouvent pas 45 états illustrés |
| Capacités documentées | 1 441 personnages, 4 219 slots ; 1 368 kits complets et 73 correctifs partiels | 0 libellé générique strict effectif |
| Mécanismes ciblés de décor | 137 mécanismes pour 72 univers | 453 univers ont seulement l’ambiance de base |
| Ambiances de base configurées | 525 univers | 0 univers |

Les 455 paires scriptées utilisent sept phases par personnage ; elles ne se confondent pas avec les huit rangées des atlas illustrés. La recette supplémentaire concerne l’ancre joueur hors roster. Le compteur de capacités mesure des identités et effets documentés, sans certifier leur animation. Les décorations couvrent 68 univers dans les quatre modes, avec 71 univers en Combat, 72 en Mêlée, 68 en RPG et 69 en Tactique. Un nom précis de scène peut sélectionner un autre mécanisme ou aucun.

Le [CSV des 1 911 personnages](coverage.csv) conserve les identités et l’ordre de la vague 5. Ses 65 atlas, 5 manifestes complets et 13 bases corrigées proviennent des fichiers réellement sélectionnés par le runtime, avec vérification SHA, dimensions, transparence et rangées liées. Les 15 lignes actualisées conservent les anciennes couvertures ; les manques calculés sont bien de 1 846 atlas et 1 906 manifestes. Les 1 911 valeurs `source1to1Verified` restent fausses.

Sonic conserve sa version Adventure : corps bleu, yeux verts, chaussures rouges à bande blanche et boucle dorée. Ses mouvements repliés restent réellement compacts ; la normalisation ne gonfle pas chaque boule à la hauteur d’une pose debout. Le manifeste distingue Spin Attack, Homing Attack, défense, déplacements et vingt poses de rebord, avec paumes et poignets mesurés. Le Light Speed Attack reste une présentation spécifique à 100 % de charge.

Les trois kits Metal Gear ont aussi leurs propres effets et timings. Snake conserve SOCOM, Nikita et sa boîte de MGS1 ; le super est son combo de coups. Raiden emploie sa lame haute fréquence de Metal Gear Rising. Otacon fournit des bonus alliés et ne blesse pas une cible avec son terminal. La garde copiée pour J2 conserve désormais son identité et son absorption ; le CPU d’Otacon en combat personnalisé suit lui aussi son action de soutien temporisée. Les sons des coups de Knuckles, Giorno et Joseph suivent leur arme de contact résolue.

Les versions choisies sont explicites : Tails pilote le Cyclone d’Adventure 2 pour Power Laser, tandis que le renfort de Sonic utilise le Tornado rouge de Sonic Adventure ; ces deux machines ne sont pas interchangeables. Jotaro et Joseph relèvent de la partie 3, Giorno de la partie 5 avec Gold Experience ordinaire. Dante et Nero utilisent leurs états tardifs de DMC5, Lady son Kalina Ann de DMC3. Solid Snake reprend MGS 1998, Raiden Metal Gear Rising, et Otacon reste un soutien adapté de son rôle scientifique. Les tenues, équipements et règles sources ont encore des limites documentées ; une source indexée ou un titre de version ne constitue pas une vérification des frames ou du timing.

**La fidélité visuelle 1:1 n’est pas certifiée.** Les PNG sont des illustrations natives générées, puis extraites et normalisées ; les chorégraphies, échelles et timings sont adaptés au jeu. Les mécanismes de décor sont des géométries animées créées pour le projet. Aucune frame officielle n’est revendiquée. Les identifiants de modèle, génération ou tâche non fournis restent à `null`, et `source1to1Verified` reste faux. Les anciennes sources, recettes et images sont conservées ; les nouvelles corrections disposent de fichiers et de traces séparés.

Les impacts visuels des quinze supers de ce lot en Combat et en Mêlée attendent une collision acceptée et conservent son point après déplacement ou mort de la cible. Une parade parfaite ou un coup raté ne fabrique plus de contact offensif ; les effets de parade restent gérés par le moteur. En RPG, la direction visuelle est prise après le placement effectif du combattant.

Les [preuves des invocations](README-invocations.md) confirment les vrais appelants Tifa→Shiva, Jotaro→Star Platinum et Sonic→Tornado ; Cloud conserve Ifrit. Les coûts de 100 ATB et 100 de charge, la confirmation, l’annulation gratuite, la pause, les identités strictes, le renfort matériel et l’impact unique restent distincts des seize poses visuelles. Les [preuves des décors](stage-coverage.md) conservent les 113 anciennes définitions et leurs 226 empreintes de commandes de dessin. Elles ne prétendent pas comparer des bitmaps officiels.

Les contrôles ciblés comprennent 15 tests de décors et d’ambiance, 7 tests du nouveau lot d’entités, leur reconstruction exacte et le lint ciblé. Chromium couvre les 24 mécanismes, 96 rendus explicites dans les quatre modes, 72 formats supplémentaires et les trois parcours GameCanvas d’invocation. Il observe 48 cellules d’entité par côté, 48 miroirs RGBA exacts et un seul impact par entité, sans erreur JavaScript de page. La validation complète ajoute 1 109 tests réussis dans 17 groupes  avec `npm run build` terminé au code 0  lint et contrôle du diff sans erreur.

- [Sources et provenance des présentations A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) ; [faits et limites A](part-a-source-facts.json), [accès aux sources B](part-b-source-access.json), [accès aux sources C](part-c-source-access/access-results.json).
- [Bases A](base-part-a-provenance.json), [B](base-part-b-provenance.json), [C](base-part-c-provenance.json) ; [mesures de stature A](part-a-stature-review.json) et [C](part-c-stature-review.json).
- [Sonic : mouvements](sonic-sources/provenance-motion.json), [combat et rebords](sonic-sources/provenance-combat.json), [proportions compactes](sonic-sources/compact-body-proportions.json), [archives](sonic-sources/source-archive-manifest.json), [preuve navigateur](browser/sonic-evidence.json).
- [Invocations : provenance](summon-provenance.json), [parcours navigateur](browser/summon-result.json) ; [scènes et sources des décors](stage-source-checks.json), [couverture des 525 univers](stage-coverage.json), [preuve Chromium](stage-browser.json).
- [Contacts : revue des correctifs](contact-review.md), [référence initiale](contact-source-baseline.json), [mesures avant](contact-results-before.json) et [après correction](contact-results-after.json) ; [projectiles Lady et Parasoul dans FighterMode](browser/fighter-projectiles-result.json).
- [État global avant cette vague](baseline.json), [référence des runtimes](runtime-baseline.json) ; les rapports historiques des vagues précédentes restent conservés.
- [Audit courant](current.md) et [mesures détaillées](current.json), à interpréter avec la validation finale et les résultats de compilation du bilan principal.

Le rapport courant de couverture antérieur a été régénéré pour les trois supers Metal Gear. Son [état avant actualisation](completion-coverage-before.json) et la [comparaison limitée aux trois personnages](completion-audit-diff.json) sont conservés ; les baselines initiales restent intactes.

Validation finale : [résultats et empreintes](validation.json), [journal de compilation](build.log), [preuves navigateur](browser-checks.json). Les 141 PNG suivis dans 36 registres sont identiques dans `public` et `dist`, avec empreintes et dimensions vérifiées ; les 111 PNG de la vague 5 sont préservés à l’identique. Le serveur de production sert ces 141 fichiers aux dimensions attendues, sans erreur JavaScript de page. Les 1 912 références locales de dossiers passent le contrôle automatisé de présence et de qualité ; cela ne certifie pas leur fidélité canonique. Les contrôles de contact comptent 15 tests et 75 observations, et ceux du soutien CPU comptent 5 tests.

Les [présentations et bases dans Chromium](browser/presentation-and-base-evidence.json) donnent 4 160 dessins de présentation et 416 dessins de bases vérifiés. La [revue indépendante](independent-review.md) décrit les corrections Otacon et audio ; les [contacts Mêlée](contact-smash-results-after.json) détaillent les parades et ratés corrigés.
