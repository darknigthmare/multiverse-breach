# Registre des packs dans Système

Le panneau présente l’édition réellement livrée : complète, de base ou sélectionnée, avec le total inclus issu de `getDlcInstallationSummary()`. Les packs absents restent identifiables dans le registre sans commande de téléchargement ou d’installation fictive.

La recherche utilise la normalisation existante du catalogue, notamment pour retrouver « Méridien Creux » sans accent. Les filtres proposent tous les packs, ceux inclus, ceux absents et les illustrations seules. Les pages restent limitées à douze entrées. La plage et la page sont annoncées ensemble. La remise à zéro rétablit les résultats et rend le focus au champ de recherche.

Chaque dossier utilise un `<details>` natif. Son résumé expose le nom, l’inclusion et le type de dossier ; le contenu distingue les illustrations seules des familles de contenu réellement déclarées par les modules connus. Aucune quantité de héros, taille de téléchargement ou illustration optionnelle n’est inventée. L’inspection n’écrit aucune préférence ni sauvegarde.

Le filtre des packs absents explique le cas d’une édition complète. L’édition de base explique son absence de packs inclus et rappelle la disponibilité de la campagne. Les autres recherches vides proposent une remise à zéro explicite. Les possessions, la progression et les préférences des contenus absents restent conservées par les systèmes existants.

Après inspection des premières captures, le rappel détaillé sur l’inclusion et la conservation est placé dans une rubrique dépliable. Le nom de l’édition et ses totaux restent visibles. Cela évite de repousser la recherche hors du premier écran mobile avec le texte à 150 %. Les options d’inclusion utilisent des libellés courts pour rester lisibles dans le sélecteur natif.

`GameSystemSections.jsx` conserve son export public et délègue seulement le panneau DLC. La section Terrain et la gestion des onglets restent identiques à leur version précédente. Le nom accessible du déclencheur Système mentionne désormais les DLC. Le CSS du nouveau panneau utilise les unités REM, avec la mise à l’échelle du document existante, des commandes d’au moins 44 px et un focus visible.

Les reçus `catalog-unit.json` et `.tap` enregistrent six tests Node purs réussis : profils complets/de base/sélectionnés, recherche sans accents, pagination, limites, immuabilité et familles déclarées du vrai manifeste Halo. Ils ne prouvent pas la disposition dans Chromium ni le contenu d’un export. Les captures et tests navigateur des quatre profils sont conservés séparément dans ce dossier.

La matrice finale Chromium passe huit cas sur quatre éditions et conserve 48 captures dans `AFTER/`. Les captures mobile/desktop, l’état vide expliqué et les dossiers Halo inclus/absents ont été inspectés visuellement après l’ajustement. La recherche mobile à 150 % est entièrement visible dès l’ouverture (haut 597,66 px ; bas 655,66 px), les libellés d’inclusion restent lisibles, et aucun autre ajustement produit n’a été nécessaire. Le reçu unitaire précède ce dernier ajustement de présentation ; les empreintes finales JSX/CSS et les limites de la vérification sont celles de `AFTER/source-sha256.json` et `AFTER/VALIDATION.md`.
