# Vérification de l’intégration CG à master — 2 novembre 2026

Cette intégration réunit la bibliothèque CG et les évolutions du jeu dans la [PR 21](https://github.com/darknigthmare/multiverse-breach/pull/21). Le dépôt utilise **master** comme branche principale.

Le hub et la galerie conservent l’aperçu, le portail modal, le focus et le plein écran de master, ainsi que les corrections, anciennes versions et comparaisons CG. Le catalogue comprend **1 406 CG, 1 500 versions et 60 corrections de sprites** ; les anciens atlas restent accessibles. Les identifiants distincts de Ripley/Bishop dans Alien et Aliens sont préservés.

Les références actuelles de **58 dossiers Rift** suivent les sprites corrigés. Les 1 038 images contrôlées, les prompts historiques et les traces de production restent inchangés. L’audit de qualité des références mesure leur lisibilité technique ; il n’accorde pas de fidélité canonique.

Le [classeur synchronisé](Multiverse_Breach_Fidelite_CG.xlsx) conserve ses quatorze onglets, ses 4 145 images, les seize champs manuels et les 47 lots de 40. L’audit vérifie 20 616 liens locaux, les nouvelles références de dossiers et la vignette ICC de Greyback. Aucune certification 1:1 automatique n’est attribuée.

Les 84 tests CG passent avec les archives locales, puis dans une simulation de checkout sans ces archives. Les qualifications des sources absentes sont déclassées avec des contrats explicites ; les autres données du plan restent comparées exactement. Les références publiques et leurs empreintes restent obligatoires.

Chromium charge les 60 nouveaux masters et vérifie variantes, comparaison, zoom, navigation, focus et verrouillage sur ordinateur et mobile. Le vrai renderer affiche les quatre personnages dans douze canvases. Ces contrôles montent les vrais composants dans une fixture ; ils ne constituent pas un parcours complet de l’App ou des combats.

Le générateur de cosmétiques couvre les 525 univers. Les citations déjà présentes dans le roster restent à examiner lorsqu’elles servent de recours ; sept références de personnage ou d’équipement inadéquates sont exclues du conditionnement. Les 50 packs cosmétiques publiés sont préservés, et aucun nouvel artwork n’est généré par cette intégration.

Les 42 étapes de prébuild ont été exercées localement, avec les échecs initiaux et leurs reprises ciblées documentés. La compilation Vite locale évite la copie des fichiers statiques pour respecter le volume disponible. Le workflow `production-build` de la PR exécute le cycle complet avec les fichiers LFS et la copie statique.

Le [rapport détaillé](master-integration-verification-2026-11-02.json) donne les empreintes, les contrôles réellement exécutés et leurs limites. L’état de fusion et les résultats CI se consultent dans la PR.
