# Production CG — pilote OpenAI

Ce dossier documente la tranche approuvée CG 01–15 de *Multiverse Breach* : 48 illustrations CG01–CG08 et 35 variantes applicables CG09–CG15, soit 83 sources et leurs variantes de production.

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

Les CG 01–04 et 06–08 appartiennent à la famille `Canon` (fan-art original fidèle à une continuité précise pour Halo/Resident Evil). Les CG 05 utilisent des capacités propres au jeu et sont donc classées `Nexus`, jamais présentées comme canon des franchises tierces. CG09–CG11 sont classées `Fan Art`; CG12–CG15 sont classées `What If`, même lorsque la version temporelle repose sur une époque officielle réelle. La lightbox permet de comparer toute variante à la CG01 du même personnage.
