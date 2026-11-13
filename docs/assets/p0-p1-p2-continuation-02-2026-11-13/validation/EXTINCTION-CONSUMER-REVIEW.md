# Validation finale des consumers Extinction

**580/580 tests passent, zéro échec ou test ignoré**, en 149,035 s sur le commit `3b892a7ec9eb1dbebf24af040cd8283311178f85`.

Commande standard réellement exécutée : `npm run test:ui-immersion`, avec Node 22.23.5 dans le PATH, `NODE_OPTIONS=--max-old-space-size=2048`, CPU 0,1 et concurrence de tests 1. Le passage inclut les 24 nouveaux cas de régression des consumers. Les empreintes avant/après des **5 283 fichiers source, tests, fixtures, styles, package et lock** sont identiques ; aucun fichier ajouté ou retiré pendant l'exécution.

Preuves finales : `ui-immersion-final-v3.tap`, `ui-immersion-final-v3.json` et `ui-immersion-final-v3-source-inputs.json.gz`. Le reçu conserve la commande NPM complète, le commit, les versions, les SHA et le manifeste compressé. Les passages de 556 tests restent archivés comme étapes antérieures.

Le correctif restaure 107 actions : 106 gardes déclarées — dont 45 pertes nouvelles et 61 déjà présentes en Git9899 — et la zone de Liara. L'inventaire final retrouve **7 244 actions pour 1 811 combattants**, avec 101 identités hors combat. Chell conserve quatre soutiens à zéro dégât ; les 17 primaires non offensives ont un symbole abstrait de soutien lié au vrai propriétaire.

Les 16 liaisons d'armes sont fermées par identité, incarnation, équipement, révision et forme exacte de l'action/ciblage. Treize restaurent des pertes nouvelles de consommation des munitions, Chief répare un défaut plus ancien, Baird/Kait sont deux corrections intentionnelles vers leurs fusils source. Les tests exécutent réellement 24→23, les dégâts, cooldowns, gardes, changement de kit et nettoyage. Cutter, énergie, magie, plasma et roquettes restent distincts. Les héros DLC, statistiques, sauvegardes, possessions et pins CG sont inchangés par ces deux consumers.

La baseline indépendante conserve les vrais anciens 14 tests et le graphe Git9899 : **0/14** à cette baseline. Ces mêmes octets de test sur les implémentations finales donnent **11 comportements verts et trois anciennes attentes de métriques rouges**, sans neutralisation : `genericSourceReview` 1 633→1 576, types de primaire 9→11, styles 9→10 avec 17 soutiens. Voir `../audit/extinction-14-baseline9899.*` et `../audit/extinction-14-original-tests-current.*`.

L'amendement courant de ces trois métriques est borné à l'empreinte source `ba245d54b06096cead0ad2ba9fda4188a9071c46c4aa5659f493743e4ec84c4e` dans `scripts/fixtures/extinction-source-consumer-amendment-2026-11-13.json`. Les valeurs historiques et workbooks publiés restent conservés ; le total 7 244 n'a pas été abaissé. L'inventaire réel est `extinction-final-inventory-freeze3.json` ; `extinction-current-inventory.json` est l'étape intermédiaire avant le raccord de Liara.

SHA du consumer final : `4ffe9ec65bd4ceb0997fe954d58542c5a19b50532c16cdb9e09f593570dae6fc`. Aucun artwork, animation personnelle ou fidélité visuelle 1:1 n'est certifié par ces validations runtime. Aucun nouveau workbook n'a été généré.
