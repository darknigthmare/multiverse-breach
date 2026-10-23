# Invocations et renfort — vague 7, 20 octobre 2026

Trois nouvelles entités disposent de **16 poses natives chacune**, soit **48 poses et 3 PNG** : quatre poses pour l’arrivée, la préparation, l’attaque et le retrait. Le catalogue contient sept atlas détaillés, soit 112 poses. Les quatre anciennes entrées natives, leurs fichiers et les 28 feuilles historiques à quatre poses restent identiques à la référence avant ajout.

| Appelant du roster | Entité et action | Version choisie | Type |
| --- | --- | --- | --- |
| Aerith (`aerith_ff7`) | Bahamut — Megaflare | Final Fantasy VII (1997), Bahamut original | Invocation |
| May (`may_gg`) | Yamada — Great Yamada Attack | Guilty Gear Xrd REV 2, baleine rose | Invocation |
| Parasoul (`skullgirls_parasoul`) | Black Egrets — Inferno Brigade | Skullgirls 2nd Encore, révision moderne de 2023, uniformes vert pâle sans brassards rouges | Renfort matériel |

Cloud conserve Ifrit. Bahamut est distinct de Neo Bahamut, Bahamut ZERO et des incarnations de Remake/Rebirth. Yamada est une baleine rose, distincte d’un dauphin bleu. Le groupe de Black Egrets reste un renfort humain armé ; aucune créature magique n’est substituée à l’escouade. La première sortie des soldats et le prompt de correction restent archivés, et le registre final sélectionne la sortie corrigée.

**La fidélité visuelle 1:1 reste non certifiée.** Les références de fonction et de version viennent du [registre de consultation](summon-sources/source-access.json) et des [faits retenus](summon-sources/source-facts.json), qui distinguent les extraits indexés des pages complètes non accessibles. La [provenance finale](summon-provenance.json), les [prompts et sources](summon-sources/), le [plan de génération](summon-generation-plan.json) et les [enregistrements](summon-generation-records.json) gardent la trace des productions et de leurs corrections. Aucune image des jeux sources n’est présentée comme une frame officielle importée. L’identité, les proportions, la chorégraphie et les timings restent des adaptations.

Les atlas RGBA font 1024 × 1024, avec cellules 256 × 256, marges transparentes de dix pixels et ligne de base 244. Une même échelle de corps s’applique aux quatre phases d’une entité. Les **48 cellules réellement décodées sont distinctes**, avec empreintes concordantes ; aucun changement d’échelle indépendant ne remplit artificiellement une cellule. La reconstruction par le builder reproduit les trois PNG et leur registre.

Les **8 tests W7 passent**. Ils contrôlent les trois ID et clés exacts univers/entité/action, leurs types invocation ou renfort, et le rejet des identités croisées. Les scènes des deux côtés dessinent les seize cellules sur la vraie horloge du moteur. L’index 10, colonne 2 de la rangée d’attaque, commence exactement sur `impactTick` ; les colonnes 0 et 1 précèdent l’impact. Le dessin préserve l’état du combat et les transformations du Canvas.

Les trois entités exigent 100 ATB et 100 de charge spéciale. Sélectionner puis annuler reste gratuit ; la confirmation dépense une seule fois et verrouille la commande pour le combat. La pause fige scène et file d’actions. Les tests vérifient l’impact unique, l’absence de remplacement d’une cible morte après confirmation et l’absence d’impact tardif après fin de scène, défaite, suppression ou mort de l’appelant, et `dispose`.

Les **40 tests historiques W5/W6** passent aussi avec les huit tests W7, soit 48 tests au total après correction de Bahamut. Le témoin de repli du test W5 utilise maintenant Master Chief→Pelican, puisque Bahamut possède son atlas natif. W6 compare les quatre anciennes métadonnées complètes avec `runtime-baseline.json` comme sous-ensemble strict du catalogue étendu. Les registres W5/W6, les quatre PNG natifs, leurs sources et références, la provenance W6 et les 28 feuilles historiques sont comparés à leurs empreintes, sans réduire les assertions de conservation.

Le [parcours Chromium final](browser/summon-wave7-result.json) monte le vrai GameCanvas pour Aerith, May et Parasoul : bouton → annulation gratuite → touche U → confirmation des cibles → pause → progression réelle → reprise → commande désactivée après utilisation. Le harness réutilise les URL Vite exactes de React et du moteur. Son contrôle de pause transmet le vrai paramètre `sessionPaused`. Pour ne manquer aucune cellule pendant les échanges du navigateur, il suspend le moteur à la confirmation, puis avance ses vraies mises à jour de façon déterministe ; il ne remplace ni coûts, ni dégâts, ni calcul d’impact.

Chromium a observé **48 cellules en J1, 48 en J2 et 48 comparaisons miroir RGBA exactes**, avec un seul changement de PV à l’impact pour chaque entité et **aucune erreur JavaScript de page**. Les captures finales ont été inspectées : [Bahamut](browser/summon-wave7-bahamut-impact.png), [Yamada](browser/summon-wave7-yamada-impact.png), [Black Egrets](browser/summon-wave7-black-egrets-impact.png). Le [harness reproductible](browser/summon-wave7-browser.mjs) et son JSON conservent les sélections de cellules, ticks et coûts observés.

L’inspection initiale avait trouvé une seconde surcouche Megaflare décalée au-dessus de la bouche, malgré des tests fonctionnels verts. Le [diagnostic](browser/summon-wave7-anchor-diagnostic.json) et la [capture initiale](browser/summon-wave7-bahamut-before-anchor-fix.png) sont conservés. Le renderer natif utilise désormais la charge et le rayon déjà présents dans les cellules ; les anneaux de contact sur la cible restent visibles. Une huitième régression vérifie l’absence de rayon doublonné dans les deux orientations et la conservation du rayon procédural de repli. Les anciennes chorégraphies et leurs échantillons ne sont pas modifiés. La preuve Chromium ci-dessus a été refaite après correction.

Lint ciblé passé. La compilation et la validation globale restent consignées par le bilan principal.

Commandes depuis la racine du dépôt :

```sh
node scripts/buildSummonAnimationsWave7.mjs --check
node --test scripts/summonAnimationWave7.test.mjs
node --test scripts/summonAnimationWave6.test.mjs scripts/nativeSuperRuntimeWave5.test.mjs
npx oxlint scripts/summonAnimationWave7.test.mjs docs/combat-fidelity-wave7-2026-10-20/browser/summon-wave7-browser.mjs
node docs/combat-fidelity-wave7-2026-10-20/browser/summon-wave7-browser.mjs
```

Le navigateur utilise le serveur local 5188 ; `SUMMON_ANIMATION_REVIEW_URL` peut choisir une autre URL.
