# Références CG et intégration W17 — 9 novembre 2026

Le [plan JSON](roster-production-2026-10-18.json) et son [rapport Markdown](roster-production-2026-10-18.md) conservent leurs octets historiques. L’intégration avec master `3036cd02` actualise des métadonnées de planification ; elle ne régénère aucune CG et ne change aucun reçu, prompt livré, fichier d’image ou verdict de fidélité.

Deux annexes datées décrivent les seuls écarts admis :

- [606 couples de candidats locaux](../../scripts/fixtures/cg-local-candidates-amendment-2026-11-09.json). Chaque ancien et nouveau PNG existe, possède une empreinte vérifiée et conserve son propriétaire, son univers et son dossier. Le nouveau chemin appartient à un registre natif vérifié : 605 bases de seize cellules et la famille existante de vingt-quatre cellules de Janine. Ces images restent des candidats de projet, sans autorité sur l’identité source des CG.
- [211 champs descriptifs courants](../../scripts/fixtures/cg-current-descriptors-amendment-2026-11-09.json). Trois champs concernent le nom de Pomni et sa planification non produite : même identifiant, même franchise, aucune image, galerie ou référence qualifiée ajoutée. Les 208 autres champs reprennent exactement les descripteurs de jeu des dossiers Rift : 207 catégories d’équipement et la correction de la technique d’Aria.

Trente descripteurs concernent des arrière-plans associés aux quinze CG d’Aloy et aux quinze CG de Dante. Les trente entrées complètes, leurs prompts, leurs quatre-vingt-dix fichiers d’images et leurs reçus restent identiques. Les références qualifiées d’Aloy établissaient déjà son arc de chasse, sans inventer de lance. Celles de Dante établissent Ebony/Ivory et la **garde de Rebellion seulement** : le descripteur courant « sword » ne prouve ni n’approuve une lame entière. Les nouveaux descripteurs ne deviennent pas rétroactivement des entrées de génération.

`npm run cg:roster:plan:check` et le test de production utilisent le même [validateur](../../scripts/cgRosterPlanSnapshot.mjs). Il vérifie les annexes, les propriétaires, les registres, les images, les références qualifiées et les limites de disponibilité privée déjà documentées, puis exige l’égalité complète du plan projeté et du rapport historique. Toute modification hors des chemins et valeurs explicitement épinglés échoue. Les tests négatifs couvrent notamment un autre propriétaire, un univers étranger, une empreinte changée, un prompt livré modifié, une fausse livraison de Pomni ou un champ descriptif non déclaré.

La génération du constructeur conserve son comportement ; ce lot utilise son mode `--check` pour préserver le cliché historique. Une évolution de production doit conserver son propre changement de provenance daté. Les annexes portent explicitement `identityAuthority: false`, `changesGenerationHistory: false` et `source1to1Verified: false`.

Validation ciblée : Node.js 22, **25 tests réussis**, aucun test ignoré ; contrôle CLI partagé terminé avec le code de sortie 0. Cette validation ne remplace pas une revue visuelle 1:1 des images.
