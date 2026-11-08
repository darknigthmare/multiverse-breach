# Dossiers d’univers : lecture, recherche et pagination

## Point ouvert traité

Le document `PORTAL_DENSE_CATALOGS_2026-11-08.md` réservait les catalogues du Hub à un lot distinct. Le dossier Univers, accessible depuis le Codex et la collection, conservait un en-tête non rétractable réunissant titre, long contexte, six commandes et quatre listes denses. Ses cartes employaient des textes fixes de 9–11 px et ses commandes un minimum de 40 px. Le contenu pouvait perdre son espace de lecture en paysage avec le texte agrandi.

Ce lot termine ce parcours précis. Il ne déclare pas terminés tous les autres écrans du Hub ni la recette générale des quarante écrans.

## Critères d’acceptation définis avant modification

- FR et EN ; 390 × 844, 844 × 390 et 1365 × 900.
- Texte à 150 %, réglage HUD à 140 %, zone sûre à 32 px ; commandes d’au moins 44 px, fermeture toujours accessible, aucun débordement horizontal et au moins 120 px pour lire dans le format paysage.
- Toutes les entrées de la source accessibles ; recherche avant pagination ; 12, 24 ou 48 entrées par page ; états vides explicites.
- Navigation clavier par Tab/Maj+Tab, Flèches gauche/droite, Début/Fin, Échap ; focus initial sur Fermer, retour au déclencheur, focus du catalogue après pagination sans rappel différé.
- Conservation intégrale des descriptions, origines, adaptation Breach, statistiques, équipement documenté, vestiaire ennemi en consultation, monde vivant, missions, arcs et collections.
- Aucun changement d’identifiant, droit DLC, recrutement, niveau, monnaie, récompense, inventaire ou progression.

## Comportement livré

`UniverseArchiveReader.jsx` rassemble la présentation extraite du Hub. `UniverseArchiveDialog.jsx` conserve l’isolation modale commune et accepte désormais une référence de focus initial. L’en-tête permanent ne porte que le type de dossier et Fermer. Le titre complet, les compteurs, le contexte repliable, la navigation et les chapitres partagent un seul défilement. Une longue introduction ne supprime donc plus la surface de lecture.

Les quatre chapitres utilisent une sélection clavier avec un seul onglet dans l’ordre de tabulation. Passer à l’univers voisin conserve le chapitre lorsqu’il existe. Un univers sans monde vivant revient au chapitre Personnages et menaces. Les recherches, tailles de page et numéros de page restent propres à chaque couple univers/catalogue pendant l’ouverture du lecteur.

Huit catalogues ont une recherche et une pagination indépendantes : personnages, menaces, reliques, artefacts mêlée/tactique, objets locaux, missions, arcs narratifs et collections. L’objet événementiel reste présenté avec les reliques. La recherche porte sur la source complète, ses textes localisés et les descriptions dérivées qui sont effectivement affichées ; elle peut retrouver une entrée située après la première page. Les compteurs expriment le total réel et les résultats filtrés. Aucune liste n’est tronquée silencieusement.

La page suivante place le focus sur le titre du catalogue dans le même commit React que l’affichage ; aucun `requestAnimationFrame` tardif ne peut reprendre le focus après fermeture. Le titre reste dans l’ordre de tabulation du modal : Tab continue vers la recherche. Effacer rend le focus à la recherche. Changer de taille de page remet la page à 1 en conservant le focus sur le sélecteur.

Les cartes originales et les huit rubriques du monde vivant sont conservées. Le vestiaire ennemi reste en lecture seule. Ses détails adoptent également la taille de texte du lecteur. Le Hub continue de construire le dossier avec les mêmes règles de visibilité, de missions accessibles et de progression.

## Vérification

Les tests locaux ont validé 42 cas : 13 nouveaux tests de rendu et de catalogue, 10 tests existants d’archive et de chronique OC, 8 de pagination, 6 de présentation de la coque et 5 de focus. Les tests SSR contrôlent des données synthétiques denses (61 entrées par famille, 62 arcs), les textes FR/EN, les champs du monde vivant, l’accès à toutes les entrées pour les trois tailles, les descriptions d’une entrée située hors première page, les états vides et la non-mutation des sources/progression. Ils ne constituent pas une preuve visuelle.

Le lint ciblé, dont `HubScreen.jsx`, passe sans avertissement. La fixture Vite de production compile. Il s’agit d’une compilation ciblée ; le build complet et son prébuild restent les portes de validation du dépôt.

Le lancement Chromium dans l’environnement local courant échoue sur `process_singleton_posix` avec `socket() Operation not permitted`. Aucun contournement n’a été tenté. Le workflow `Universe archive reader` exécute donc la recette réelle dans Chromium :

```sh
node --test --test-concurrency=1 scripts/universeArchiveReader.test.mjs scripts/universeArchiveView.test.mjs scripts/catalogPagination.test.mjs scripts/shellImmersionPresentation.test.mjs scripts/dialogFocus.test.mjs
node scripts/buildUniverseArchiveFixture.mjs
node scripts/browserUniverseArchive.mjs
```

La recette produit six résultats FR/EN × trois formats, les mesures de géométrie et de texte, et les captures d’ensemble, des personnages, des objets locaux, des missions, du vestiaire et du monde vivant. Elle vérifie les huit catalogues, les interfaces FR/EN, les tailles 12/24/48, la recherche et son effacement, les états vides, le retour entre univers, le chapitre manquant, le focus, l’isolation et l’absence de mutation de progression. Elle utilise les composants réels avec données, médias et sauvegarde parent synthétiques explicitement désignés comme tels. Elle ne prétend pas valider les illustrations de production, leur complétude, ni une session de lecteur d’écran.

**État à la préparation du lot : recette navigateur et captures en attente de CI.** Seuls les artefacts du commit effectivement testé peuvent lever cette réserve. Les captures doivent être inspectées en plus des assertions numériques.
