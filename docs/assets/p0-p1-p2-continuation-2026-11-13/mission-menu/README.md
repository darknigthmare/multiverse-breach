# Missions : bibliothèque des actes annexes OC

Le parcours **Missions → Actes annexes → Bibliothèque** utilise maintenant un composant dédié, avec les vraies données de Thalassa Mnémique, Méridien Creux et Viridienne Ultime. L’extraction retire le bloc inline du Hub ; les autres parcours restent hors du périmètre de ce chantier. Les trois actes ne justifient pas une pagination.

Les descriptions passent de 10 pixels fixes à 15 pixels, puis à **22,5 pixels avec le réglage 150 %**. Les métadonnées des missions passent de 8 pixels à environ 12,30 / 18,46 pixels. Les noms de missions se répartissent sur plusieurs lignes au lieu d’être tronqués. Les deux défauts reproduits concernent la lecture des textes et des titres ; ils ne sont pas des clôtures du backlog artistique des acteurs.

Les actions **Mission suivante** et **Placer en réserve** précèdent le détail des missions et du contenu. Les détails natifs se déplient au clavier ; les raisons de verrouillage restent visibles. Recherche sans accents, filtre d’état, compteurs et réinitialisation ne modifient pas la progression. Après une sélection vide, le focus revient au champ de recherche et le recentre dans la zone visible sous la navigation du Hub.

Actif, en réserve et non inclus sont distincts. Les préférences conservées d’un acte absent ne le rendent pas inclus ; elles ne font pas apparaître de boutons de mission ou d’installation. La branche documentaire précédente distinguait déjà les packs absents : ce point est une garantie vérifiée de la refonte, pas la correction revendiquée d’un ancien défaut d’installation reproduit.

## Vérifications exécutées

| Contrôle | Résultat |
| --- | --- |
| Projection et filtres purs | **6/6 tests** : prérequis, briefing suivant/final, réserve, métadonnées des packs absents, recherche bilingue sans accents et absence de mutation. |
| Compilations du vrai Hub | **3/3** : complète, base et sélection du seul pack Thalassa. Le transformateur DLC de production est utilisé. |
| Navigateur | **18/18 cas** : trois éditions × français/anglais × desktop 1440×1000, mobile 390×844, mobile avec texte à 150 %. |
| Erreurs et largeur | Aucune erreur JavaScript, réponse HTTP en échec ou largeur de page excessive dans ces cas. Les missions dépliées sont également contrôlées. |
| Fidélité des captures aux sources | Les cinq sources propres au chantier gardent leurs empreintes entre le build et chaque matrice navigateur. Les modifications ultérieures du Hub ont leur validation séparée. |

Dans les éditions complète et Thalassa, les tests parcourent la recherche, le résultat vide, le retour de focus visible, le dépliage à la touche Entrée, le refus d’un briefing verrouillé et le placement en réserve suivi de sa réactivation. L’état parent retrouve exactement ses valeurs de départ. Le bouton de reprise ouvre le vrai briefing **47001**, sans lancer de combat ni ajouter de complétion.

Dans l’édition base, les trois actes sont absents. La fixture prépare avant montage la mission historique `47001` et les trois préférences de réserve ; l’écran conserve **1/3** dans le premier acte et ne propose aucune action d’installation ou de mission. Les filtres et la recherche conservent cet état. Ce scénario ne prétend pas exécuter une migration ou une sauvegarde sur disque.

[Matrice des compilations](validation/build-matrix.json) · [Matrice navigateur](validation/browser-matrix.json) · [Tests purs](validation/unit-tests.tap) · [Preuve d’extraction du Hub](validation/hub-extraction-proof.json)

## Captures et limites

- [Avant](BEFORE/report.json) : six captures, montrant notamment l’absence de changement des polices fixes au réglage 150 %.
- [Après, édition complète](AFTER/all/report.json), [base](AFTER/base/report.json), [Thalassa](AFTER/thalassa/report.json) : trente captures fonctionnelles, plus trois cadrages des couvertures dans [le relevé dédié](AFTER/cover-captures.json).
- La première matrice après extraction, avant l’ajout des sentinelles de progression absente et du recentrage de la recherche, reste archivée sous `validation/all-before-final-fixture/`.
- Le premier pilote utilisait `Locator.click()` sur un bouton `aria-disabled`. Playwright a refusé cette action ; le pilote final focalise le bouton puis utilise Entrée pour vérifier le garde réel du callback. Cet échec intermédiaire reste dans `validation/browser-attempt-01-driver.log`.

La fixture monte les vrais composants et catalogues. Elle prépare un état parent avant montage ; les réserves, filtres et briefings passent ensuite par les callbacks ordinaires du Hub. Les compilations n’exportent aucun média, ne lancent pas le prébuild global et ne constituent pas une distribution assemblée. Les captures ne certifient pas une campagne complète, des sauvegardes persistées, une qualité « AAA » ou une fidélité artistique 1:1.

## Reproduire

Avec Node 22 et les dépendances verrouillées du dépôt :

```sh
node --test scripts/ocDlcLibraryView.test.mjs
OC_DLC_LIBRARY_PROFILE=all node scripts/buildOcDlcLibraryFixture.mjs
OC_DLC_LIBRARY_PROFILE=base node scripts/buildOcDlcLibraryFixture.mjs
OC_DLC_LIBRARY_PROFILE=thalassa node scripts/buildOcDlcLibraryFixture.mjs
```

Servir chaque sortie avec `scripts/serveSourceSceneArtFixture.py`, puis utiliser `scripts/browserOcDlcLibrary.py --verify --edition all|base|thalassa --base-url URL --out DOSSIER`. Les commandes exactes et ports sont consignés dans les matrices. Les cadrages complémentaires des couvertures emploient les mêmes bundles figés ; ils ne créent pas trois cas fonctionnels supplémentaires.
