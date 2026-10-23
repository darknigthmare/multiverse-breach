# Production CG — fidélité et variantes

Ce dossier conserve le pilote historique de *Multiverse Breach* — 48 illustrations CG01–CG08 et 35 variantes applicables CG09–CG15, soit 83 sources — et suit ses corrections ainsi que l’extension des CG au roster complet.

## Reprise du 23 octobre 2026 — vague 6 et consigne commune

La [consigne unique pour tout le roster](PROMPT_GLOBAL_ROSTER_1_1.txt) et son [manifeste complet](roster-global-batch-2026-10-23.json) couvrent **1 912 personnages, 525 univers et 28 680 emplacements CG**. Ils conservent les incarnations, les références, les thèmes imposés, les poses et décors distincts, les variantes et les états réels de production. Une consigne commune permet de poursuivre tous les sujets sans réécrire la demande ; elle ne produit pas les milliers d’images par un seul appel.

Cette vague livre **75 nouvelles CG : cinq séries complètes de quinze** pour Brann Crow, Lyra Hexwind, Mercy Ash, Dr Mara Ell et Orin Vale. **Cinq atlas, soit 80 poses**, ont été réellement redessinés d’après leurs portraits V2 sélectionnés et revus indépendamment. Les anciens atlas restent accessibles en variantes ; les **2 067 médias CG antérieurs** sont inchangés.

La galerie contient désormais **670 CG pour 51 personnages, dont 44 séries complètes applicables**, avec **764 versions et 2 292 médias enregistrés**. Le [classeur Excel courant](Multiverse_Breach_Fidelite_CG.xlsx), son [guide](EXCEL_FIDELITE.md) et son [audit indépendant](Multiverse_Breach_Fidelite_CG.validation.json) donnent accès aux références, aux comparaisons et à la consigne commune. **28 002 emplacements restent à produire** ; les huit N/A documentés restent inchangés. Les lacunes de référence, refus réels et créneaux non tentés sont distincts. Aucune case ne certifie automatiquement une fidélité parfaite 1:1.

Points d’entrée : [aperçu des cinq séries](screenshots/roster-wave6-overview-2026-10-23.webp), [bilan de la vague](FIDELITY_PROGRESS_WAVE6_2026-10-23.md), [index des CG et comparaisons d’atlas](reviews/wave6-2026-10-23/README.md), [audit des médias](fidelity-delivery-wave6-2026-10-23.json). Le [plan](roster-production-2026-10-18.md) et la [bible](ROSTER_FIDELITY_BIBLE_2026-10-18.md) gardent leurs noms stables avec les données courantes.

Les rapports historiques restent figés. Pour contrôler les données courantes : `node scripts/auditCgFidelityDelivery.mjs --write --date 2026-10-23 --output docs/cg/fidelity-delivery-wave6-2026-10-23.json`. `npm run cg:global:batch:check` contrôle le manifeste ; `npm run cg:global:prompt -- orin_vale CG01` affiche une fiche de travail, sans générer une image.

## Historique du 22 octobre 2026 — vague 5

Cette reprise ajoute **75 nouvelles CG : cinq séries complètes de quinze** pour Jax Rook, Seraphine Meridius, Mara Veylan, Dr Celeste Ray et Nefra de la Balance. Chaque CG conserve son thème, avec une pose ou composition et un décor distincts. Les portraits V2 sélectionnés servent de références internes pour ces personnages originaux ; les limites des détails hors champ restent documentées.

À l’issue de cette vague, la galerie comptait **595 CG pour 46 personnages, dont 39 séries complètes applicables**, avec 689 versions et 2 067 médias enregistrés. **Six nouveaux atlas, soit 96 poses revues**, corrigeaient Crash dans son incarnation Crash 4 (2020) et les cinq personnages ci-dessus. Les anciens atlas restent accessibles en variantes ; les 1 842 médias CG antérieurs étaient inchangés.

Points d’entrée : [aperçu des cinq séries](screenshots/roster-wave5-overview-2026-10-22.webp), [bilan de la vague](FIDELITY_PROGRESS_WAVE5_2026-10-22.md), [index des quinze CG par personnage et des six comparaisons d’atlas](reviews/wave5-2026-10-22/README.md), [audit des médias](fidelity-delivery-wave5-2026-10-22.json).

À cette étape, **28 077 emplacements restaient à produire** ; les huit N/A documentés étaient inchangés. Les 11 écarts majeurs de sprites encore ouverts, les refus réels du service et les créneaux non tentés restaient distincts. Le classeur, le plan et la bible portent maintenant les données de la vague 6 décrite plus haut.

Le bilan et l’audit de cette vague restent figés. Le contrôle courant utilise la commande explicite de la vague 6 indiquée plus haut.

## Historique du 20 octobre 2026 — vague 4

Cette reprise ajoute **135 nouvelles CG : neuf séries complètes** pour Crash Bandicoot, Spyro, Rayman, Chell, Elara Voss, Neris Vale, Kael Venn, Eira Solenne et Nyra Vale. Chaque série conserve ses quinze thèmes, avec une pose et un décor propres à chaque CG. Les références individuelles et incarnations ont été inspectées ; les essais remplacés restent conservés.

À l’issue de cette vague, la galerie comptait **520 CG pour 41 personnages, dont 34 séries complètes applicables**, avec 614 versions conservées et 1 842 fichiers CG vérifiés. Les deux atlas d’Elara et de Nyra ont aussi reçu de vrais nouveaux dessins référencés V2, 32 poses revues ; leurs anciens atlas restent accessibles en variantes. Les 385 sélections CG antérieures, 302 définitions hors pilote, 94 révisions et 1 437 médias de la vague précédente sont inchangés.

Points d’entrée historiques : [aperçu des neuf séries](screenshots/roster-wave4-overview-2026-10-20.webp), [bilan de la vague 4](FIDELITY_PROGRESS_WAVE4_2026-10-20.md), [index des quinze CG par personnage et revues](reviews/wave4-2026-10-20/README.md), [comparaison Elara](screenshots/elara-voss-sprite-comparison-wave4-2026-10-20.webp), [comparaison Nyra](screenshots/nyra-vale-sprite-comparison-wave4-2026-10-20.webp).

À cette étape, le classeur regroupait les 1 912 personnages, 525 univers et 28 680 emplacements, avec **28 152 emplacements restant à produire** et 12 écarts majeurs de sprites encore ouverts. Les huit N/A documentés et les refus historiques demeuraient distincts. Le [classeur](Multiverse_Breach_Fidelite_CG.xlsx), son [audit](Multiverse_Breach_Fidelite_CG.validation.json), son [guide](EXCEL_FIDELITE.md), le [plan](roster-production-2026-10-18.md) et la [bible](ROSTER_FIDELITY_BIBLE_2026-10-18.md) ont depuis été actualisés à la vague 6 décrite plus haut.

L’[audit CG de cette vague](fidelity-delivery-wave4-2026-10-20.json) contrôle 1 842 fichiers distincts, dont les 249 du pilote historique. Ce rapport historique reste figé ; pour contrôler les données courantes, utiliser la commande de la vague 6 indiquée plus haut avec son nom de sortie explicite.

## Historique du 20 octobre 2026 — vague 3

Cette reprise ajoute **116 nouvelles CG pour onze personnages**, dont sept séries complètes de quinze : Sable, Loom, Tessera, Quillon, Nadir, Elyra et Oryn. Raven, Stitch, Starfire et Jack ont des séries partielles explicitement suivies. La galerie compte désormais **385 CG pour 32 personnages, dont 25 séries complètes applicables**. Les poses, décors et thèmes spéciaux ont une revue visuelle ; les anciennes images restent conservées.

L’[aperçu de cette étape](screenshots/roster-wave3-overview-2026-10-20.webp), le [bilan de cette reprise](FIDELITY_PROGRESS_2026-10-20.md) et les [planches et revues de la vague](reviews/wave3-2026-10-20/README.md) montrent les images livrées et leurs limites. Le [contrôle global daté du 20](fidelity-delivery-2026-10-20.json) vérifie 1 437 fichiers, dont les 249 fichiers historiques intacts. Le registre hors pilote contient 302 CG, sans image ajoutée pour un créneau seulement planifié.

Les seize poses du sprite existant d’Elyra ont aussi un [cadrage corrigé](reviews/wave3-2026-10-20/elyra-frame-packing-before-after.webp), sans nouveau dessin. L’aperçu du Hub présente les versions courantes et anciennes des huit héros concernés. Le suivi distingue neuf nouveaux refus CG et quarante créneaux non tentés, sans exception N/A inventée. **28 287 emplacements restent à produire sur le roster entier ; aucune fidélité parfaite 1:1 n’est certifiée automatiquement.**

À l’issue de cette vague 3, le classeur comptait 385 CG, 479 versions et 2 600 images incorporées ; son audit avait vérifié les 1 912 sprites sélectionnés et 9 395 liens locaux. Les fichiers stables du [classeur](Multiverse_Breach_Fidelite_CG.xlsx), du [guide](EXCEL_FIDELITE.md), de la [bible](ROSTER_FIDELITY_BIBLE_2026-10-18.md) et du [plan complet](roster-production-2026-10-18.md) reflètent maintenant la vague 6 décrite plus haut. Le rapport historique à 385 CG reste figé ; les nouveaux audits utilisent un nom de sortie propre à leur vague.

## Historique du 18 octobre 2026

Le [classeur Excel de fidélité et de production](Multiverse_Breach_Fidelite_CG.xlsx) rassemble les **1 912 personnages, 525 univers et 28 680 emplacements CG**, avec vignettes incorporées, références, comparaisons, contrôles et variantes. Le [guide du classeur](EXCEL_FIDELITE.md) explique les filtres et les champs de revue conservés lors des reconstructions. La [bible de continuité](ROSTER_FIDELITY_BIBLE_2026-10-18.md) documente les incarnations retenues ou proposées et les critères visuels propres aux personnages.

Le [bilan de livraison et les planches de contrôle](FIDELITY_PROGRESS_2026-10-18.md) présentent les images réellement intégrées, les variantes conservées et le travail encore ouvert sur le reste du roster.

La demande actuelle couvre l’ensemble du roster, au-delà des six personnages du pilote. Chaque nouvelle CG doit préserver son incarnation et son thème, utiliser une pose réellement différente et un décor distinct. Les CG spéciales suivent les thèmes déjà définis dans le catalogue : une nouvelle pose ou un nouveau fond ne remplace pas le thème demandé.

Les anciennes sources, masters et miniatures du pilote restent disponibles comme variantes antérieures. Le registre [`cgRevisions.generated.json`](../../src/game/cg/cgRevisions.generated.json) sélectionne les corrections courantes sans changer les identifiants de collection, favoris ou déblocages. Le registre [`cgRosterArtwork.generated.json`](../../src/game/cg/cgRosterArtwork.generated.json) ajoute 186 CG réellement livrées hors pilote. La [nouvelle vague de 120 CG](reviews/wave2-2026-10-18/README.md) complète Doom Slayer Eternal, Sonic moderne, Aloy, Bastion Korr, Dante DMC5, Chris Redfield RE1 1996, Nova Vey et Marrow Kade. Avec le pilote, la galerie contient **269 CG pour 21 personnages, dont 18 séries complètes**; le reste du roster reste à produire. Elle propose la sélection d’une version et sa comparaison à la version antérieure ou à la CG01 du même personnage.

L’[aperçu des huit séries](screenshots/roster-wave2-overview-2026-10-18.webp) et la [comparaison des trois sprites corrigés](reviews/wave2-2026-10-18/sprite-before-after.webp) donnent accès aux visuels courants. Les anciens atlas de Dante, Doom Slayer et Chris sont conservés en variantes. Le classeur consigne les incarnations inspectées, la portée exacte de chaque référence et les écarts encore ouverts, sans attribuer automatiquement une fidélité parfaite 1:1.

Le [suivi complet du roster](roster-production-2026-10-18.md) recense 1 912 personnages et la matrice des 15 types. Il distingue les fichiers livrés, les emplacements non produits, les incarnations à préciser et les thèmes spéciaux encore à documenter. Un emplacement prévu n’est jamais installé comme image terminée.

Pour les données courantes, le contrôle de livraison se lance avec `node scripts/auditCgFidelityDelivery.mjs --write --date 2026-10-23 --output docs/cg/fidelity-delivery-wave6-2026-10-23.json`. Ce nom de sortie conserve les rapports historiques. Le contrôle compare notamment les 249 anciens fichiers à leur manifeste historique, vérifie les nouveaux fichiers et compte uniquement les versions réellement enregistrées. Les empreintes et dimensions ne prouvent pas à elles seules une pose distincte ou une fidélité 1:1 : les images doivent aussi être examinées visuellement.

Pour intégrer des séries supplémentaires, `node scripts/installCgRosterDeliveries.mjs <reçu.json> --write` valide les identités, les fichiers, les poses et les exceptions N/A avant d’ajouter les seules images livrées. Les preuves privées et chemins de génération restent hors du registre utilisé par le jeu. Régénérer ensuite le plan, la bible et le classeur avec `npm run cg:roster:plan`, `npm run cg:fidelity:bible` et `npm run cg:fidelity:excel`.

## Registres

- [`CG_PILOT_REFERENCE_AUDIT.md`](./CG_PILOT_REFERENCE_AUDIT.md) — périmètre, continuités, références officielles et gates de production;
- [`CG_PILOT_PROMPTS.md`](./CG_PILOT_PROMPTS.md) — prompts exacts des six références personnage CG 01;
- [`prompts/halo-chief-arbiter-cg02-05-openai-v1.md`](./prompts/halo-chief-arbiter-cg02-05-openai-v1.md) — prompts et QA Halo CG 02–05;
- [`prompts/resident-evil-wesker-jill-cg02-05-openai-v1.md`](./prompts/resident-evil-wesker-jill-cg02-05-openai-v1.md) — prompts et QA Wesker/Jill CG 02–05;
- [`prompts/leon-anchor-cg02-05-openai-v1.md`](./prompts/leon-anchor-cg02-05-openai-v1.md) — prompts et QA Leon/Ancre CG 02–05;
- [`prompts/halo-chief-arbiter-cg06-08-openai-v1.md`](./prompts/halo-chief-arbiter-cg06-08-openai-v1.md) — prompts et QA Halo CG 06–08;
- [`prompts/resident-evil-wesker-jill-cg06-08-openai-v1.md`](./prompts/resident-evil-wesker-jill-cg06-08-openai-v1.md) — prompts et QA Wesker/Jill CG 06–08;
- [`prompts/leon-anchor-cg06-08-openai-v1.md`](./prompts/leon-anchor-cg06-08-openai-v1.md) — prompts et QA Leon/Ancre CG 06–08;
- [`CG_VARIANT_WAVE_AUDIT.md`](./CG_VARIANT_WAVE_AUDIT.md) — matrice d’applicabilité, garde-fous et références officielles factuelles CG09–CG15;
- [`prompts/halo-chief-arbiter-cg09-15-openai-v1.md`](./prompts/halo-chief-arbiter-cg09-15-openai-v1.md) — prompts et QA Halo CG09–CG15;
- [`prompts/resident-evil-wesker-jill-cg09-15-openai-v1.md`](./prompts/resident-evil-wesker-jill-cg09-15-openai-v1.md) — prompts et QA Wesker/Jill CG09–CG15;
- [`prompts/leon-anchor-cg09-15-openai-v1.md`](./prompts/leon-anchor-cg09-15-openai-v1.md) — prompts et QA Leon/Ancre CG09–CG15;
- [`prompts/jill-goofy-alignment-style-corrections-openai-v1.md`](./prompts/jill-goofy-alignment-style-corrections-openai-v1.md) — corrections ImageGen ciblées et QA pixel-art de Jill CG11–CG12;
- [`prompts/jill-gender-zombie-style-corrections-openai-v1.md`](./prompts/jill-gender-zombie-style-corrections-openai-v1.md) — corrections ImageGen ciblées et QA pixel-art de Jill CG13–CG14;
- [`character-reference-approvals.json`](./character-reference-approvals.json) — gate `Continue` et empreintes SHA-256 des six CG 01 approuvées;
- [`wave-approvals.json`](./wave-approvals.json) — baseline CG 01–05 et gate `Continue` ouvrant strictement CG 06–08;
- [`variant-wave-approvals.json`](./variant-wave-approvals.json) — baseline CG01–CG08 et gate `Continue` ouvrant les 35 variantes applicables CG09–CG15;
- [`../../public/cg/cg-manifest.json`](../../public/cg/cg-manifest.json) — manifeste machine des 83 entrées et 249 fichiers de livraison;
- [`screenshots/cg-pilot-review-sheet.webp`](./screenshots/cg-pilot-review-sheet.webp) — planche finale 6 personnages × 5 types.
- [`screenshots/cg-pilot-cg01-08-review-sheet.webp`](./screenshots/cg-pilot-cg01-08-review-sheet.webp) — planche finale étendue 6 personnages × 8 types.
- [`screenshots/cg-pilot-cg09-15-review-sheet.webp`](./screenshots/cg-pilot-cg09-15-review-sheet.webp) — planche des 35 variantes et des 7 cellules `N/A` CG09–CG15.
- [`screenshots/cg-gallery-cg09-15-desktop.png`](./screenshots/cg-gallery-cg09-15-desktop.png) et [`screenshots/cg-gallery-cg09-15-mobile.png`](./screenshots/cg-gallery-cg09-15-mobile.png) — QA runtime fraîche de la famille `What If` avec 23 résultats;
- [`screenshots/cg-gallery-variant-compare-desktop.png`](./screenshots/cg-gallery-variant-compare-desktop.png) et [`screenshots/cg-gallery-variant-compare-mobile.png`](./screenshots/cg-gallery-variant-compare-mobile.png) — comparaison runtime CG01/variante, desktop et mobile sans débordement horizontal;
- [`screenshots/cg-gallery-cg01-08-desktop.png`](./screenshots/cg-gallery-cg01-08-desktop.png) et [`screenshots/cg-gallery-cg01-08-mobile.png`](./screenshots/cg-gallery-cg01-08-mobile.png) — QA runtime fraîche desktop/mobile;
- [`screenshots/cg-gallery-cg07-all-owned-desktop.png`](./screenshots/cg-gallery-cg07-all-owned-desktop.png) — les six poses de victoire chargées avec tous les héros possédés;
- [`screenshots/cg-gallery-arbiter-victory-corrected-desktop.png`](./screenshots/cg-gallery-arbiter-victory-corrected-desktop.png) — contrôle du master corrigé de l’Arbiter.

## Contrat de livraison

Chaque entrée conserve trois fichiers distincts : source OpenAI PNG au ratio exact 3:4, master WebP 1536×2048 et miniature WebP 384×512. Pour une CG verrouillée, la galerie n’insère aucun chemin média dans le DOM et ne déclenche donc aucune requête d’image. Les fichiers restant statiques sous `public/cg`, ce verrou est une règle de progression et d’affichage, pas un contrôle d’accès serveur.

Dans le pilote, les CG 01–04 et 06–08 appartiennent à la famille `Canon` (fan-art original fidèle à une continuité précise pour Halo/Resident Evil). Les CG 05 utilisent des capacités propres au jeu et sont donc classées `Nexus`, jamais présentées comme canon des franchises tierces. CG09–CG11 sont classées `Fan Art`; CG12–CG15 sont classées `What If`, même lorsque la version temporelle repose sur une époque officielle réelle. La lightbox permet de comparer une variante à la CG01 du même personnage lorsque celle-ci est livrée. Pour les séries supplémentaires, un accessoire imaginé est également classé What If, même au créneau CG02.

L’extension au roster inclut des animaux et de jeunes personnages. Les scènes familiales de loisir et de service peuvent donc conserver `unknown-family-safe-only`, avec un contenu familial et sans romance, sans inventer un âge adulte. Leurs proportions et leur anatomie restent celles de l’incarnation source. Les anciennes restrictions et décisions N/A du pilote restent documentées dans ses registres historiques.
