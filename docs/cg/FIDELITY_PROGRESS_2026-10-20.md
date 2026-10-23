# Fidélité et CG — reprise du 20 octobre 2026

Cette reprise ajoute **116 CG réellement produites et intégrées**, avec **348 fichiers** PNG, masters et miniatures. La galerie contient maintenant **385 CG pour 32 personnages, dont 25 séries complètes selon les emplacements applicables**. Le [classeur Excel](Multiverse_Breach_Fidelite_CG.xlsx) et le [référentiel](ROSTER_FIDELITY_BIBLE_2026-10-18.md) couvrent les **1 912 personnages, 525 univers et 28 680 emplacements** demandés. **28 287 emplacements restent non produits**, après huit N/A documentés : le roster entier n’est pas terminé.

L’[aperçu de cette reprise](screenshots/roster-wave3-overview-2026-10-20.webp) rassemble dix-huit vignettes courantes, vérifiées contre les identifiants et empreintes du registre dans une [revue séparée](reviews/wave3-2026-10-20/overview-review.json). Les cartes d’équipement sont identifiées comme telles ; elles ne remplacent pas une illustration du personnage.

## Séries produites

**Sable Orison, Loom Ivara, Tessera Vale, Quillon Rusk, Nadir Kest, Elyra Null et Oryn Xile ont chacun quinze CG**, soit 105 nouvelles illustrations. Leurs sources sont les dessins et dossiers individuels du canon original Nexus du projet. Les [planches, reçus et revues visuelles indépendantes](reviews/wave3-2026-10-20/README.md) détaillent les quinze compositions de chaque série.

Les poses et décors ont été différenciés dans les images : personnage, équipement, environnement, scène cohérente, action, entrée, victoire, défaite, plage familiale, service, gag, alignement inversé, genre ou costume, corruption et temporalité. Les choix CG13 et CG15 restent alternatifs. Les scènes inventées et transformations conservent leurs familles Canon du projet, Nexus, Fan Art ou What If ; elles ne deviennent pas des scènes attestées d’une franchise externe.

Les corrections de revue comprennent notamment les faux monocles de Sable, son décor répété, les marges des manteaux, la lisibilité de l’inversion d’alignement d’Oryn et ses marques d’âge futures. Les essais écartés sont conservés. Les objets et environnements seuls ont une composition propre, sans leur attribuer une pose humaine.

| Série partielle | Livrées | Refus effectifs | Non tentées |
| --- | ---: | ---: | ---: |
| Raven, animation Teen Titans 2003 | 5 | 3 | 7 |
| Stitch, animation Disney 2002 | 2 | 3 | 10 |
| Starfire, animation Teen Titans 2003 | 2 | 2 | 11 |
| Jack Sparrow, cible film 2003 | 2 | 1 | 12 |

Ces quatre séries totalisent onze vraies images, neuf refus et quarante créneaux non tentés. Les 49 absences gardent leurs briefs personnalisés, sans image fictive ni N/A ajoutée. Stitch et Starfire ont ici leur équipement et leur décor ; Jack a son compas Fan Art et un décor original compatible. Le concept d’ukulélé de Stitch reste limité à l’équipement Fan Art ; le compas ne certifie pas un accessoire exact du film de 2003. Les sources de production, costumes et lieux gardent leur portée documentée.

## Conservation et sprites

Les **249 fichiers du pilote sont intacts**, les **186 anciennes définitions hors pilote sont inchangées** et les 94 révisions antérieures restent enregistrées. Le registre hors pilote contient désormais 302 CG. Au total, **479 versions et 1 437 fichiers d’empreinte distincte** sont conservés, sans compter les essais non enregistrés. Le [contrôle global du 20 octobre](fidelity-delivery-2026-10-20.json) est séparé du [rapport historique du 18 octobre](fidelity-delivery-2026-10-18.json).

Le [contrôle technique de cette vague](reviews/wave3-2026-10-20/delivery-integrity-review.json) vérifie les 348 médias : 97 PNG ont les pixels de leurs natifs acceptés ; 19 reproduisent exactement le conditionnement nearest documenté, avec une dérive de ratio native inférieure à 0,5 %. Les natifs restent conservés. L’absence de doublon informatique complète la revue visuelle sans certifier à elle seule une ressemblance ou une pose.

L’atlas existant d’Elyra a une **correction technique de cadrage**, distincte des quinze nouvelles CG : les seize dessins et leurs effets sont regroupés dans leurs cases, avec une réduction nearest commune de 0,722741433. Aucun nouveau dessin, nouvelle pose ou nouvelle génération ImageGen n’est revendiqué. L’original est inchangé et conservé en variante. La [comparaison avant/après](reviews/wave3-2026-10-20/elyra-frame-packing-before-after.webp), la [QA indépendante](reviews/wave3-2026-10-20/elyra-frame-packing-independent-review.json) et le [reçu de sélection runtime](../audits/elyra-frame-packing-runtime-2026-10-20.json) documentent les limites de résolution et le dérivé exact.

L’aperçu des sprites du Hub reçoit maintenant la version courante et les anciennes variantes des huit héros concernés : Elyra, Chris, Dante, Doom Slayer, Liquid, Mistral, Saturnin et True Ogre. Les anciennes planches restent visibles sans modifier la sélection courante en jeu.

## Écarts et vérifications

Onze sprites sélectionnés gardent un écart majeur confirmé : Bob, Kevin, Stuart, Vador, Batman TDK, Luke ROTJ, Harry OotP, Batman New 52, Stitch, Raven et Starfire. Les trois nouveaux constats figurent dans les [priorités visuelles de cette reprise](reviews/wave3-2026-10-20/selected-roster-visual-priorities.json). Aucun atlas n’a été demandé pour Stitch, Raven ou Starfire durant cette vague ; leurs refus de CG ne deviennent pas des refus d’atlas. Les six refus d’atlas historiques restent distincts des **19 créneaux CG refusés au total** entre les reprises.

Le référentiel conserve **342 incarnations encore ambiguës et 1 308 personnages aux critères individuels insuffisants**. Aucune fidélité parfaite 1:1 n’est certifiée automatiquement. Les huit axes manuels de l’Excel restent des champs de comparaison, même lorsqu’une composition est acceptée avec les limites de sa source. Les fichiers du plan et de la bible gardent leur suffixe initial du 18 octobre, avec un contenu actualisé pour cette reprise du 20.

- `npm run test:cg` : **51 tests réussis**, dont le suivi des refus et des créneaux non tentés des quatre séries partielles.
- `npm run test:character-png` : **42 tests réussis**.
- `npm run cg:manifest:check`, `npm run cg:roster:plan:check` et `node scripts/buildCgRosterFidelityBible.mjs --check` : cohérence des données et fichiers générés.
- `node scripts/auditCgFidelityDelivery.mjs --write --date 2026-10-20 --output docs/cg/fidelity-delivery-2026-10-20.json` : **385 CG courantes, 1 437 fichiers vérifiés, 249 fichiers historiques intacts**.
- `node scripts/auditTechnicalSpritePacking.mjs docs/audits/elyra-frame-packing-runtime-2026-10-20.json` : dérivé exact, seize poses, source inchangée et anciennes variantes accessibles au Hub.
- `python scripts/auditCgFidelityWorkbook.py --write` : **385 CG, 479 versions, 1 912 sprites sélectionnés concordants, 2 600 images incorporées et 9 395 liens locaux valides**. Les neuf nouveaux refus et quarante non-tentatives correspondent aux reçus ; leurs poses personnalisées restent présentes. Les usages limités des sources Dante et Sonic restent vérifiés ; [rapport indépendant](Multiverse_Breach_Fidelite_CG.validation.json).
- [Préservation des champs de revue](Multiverse_Breach_Fidelite_CG.preservation-validation.json) : quatorze champs Contrôles et deux champs Matrice testés sur un classeur privé ; aucune fixture injectée dans le vrai classeur. Les saisies réelles avant/après sont identiques. Le classeur final de 58 661 961 octets porte le SHA-256 `ed084a579ad2034922868d6bfbf5b39eef235a2f9291bf660367e32b4de52443`, concordant avec son [résumé](Multiverse_Breach_Fidelite_CG.summary.json) et l’audit.
- Chaîne `npm run sprites:characters:audit`, disponibilité des sprites, compilation Vite du code sans recopie du répertoire public, lint ciblé et `git diff --check` : réussis.

La navigation interactive dans un navigateur n’est pas vérifiée dans cette reprise ; les contrôles de galerie couvrent la logique et le rendu SSR.
