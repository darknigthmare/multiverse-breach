# Portail — lecture des catalogues denses, 8 novembre 2026

## Périmètre et critères joueur

Cette continuation concerne le choix des boosters et leurs dossiers complets.
L’Album, le menu Système, la galerie et la préparation du combat personnalisé
gardent leur implémentation précédente. Aucun moteur de tirage, prix, remboursement,
garantie, identifiant de récompense ou format de sauvegarde n’est modifié.

Les critères retenus avant l’implémentation sont :

- consulter chaque booster et chaque carte, y compris hors rotation, avant toute
  sélection ou dépense ; conserver les probabilités calculées sur le pool complet ;
- chercher dans tout le catalogue puis naviguer dans des pages bornées ; retrouver
  la recherche, le groupe et la page après fermeture d’un dossier ;
- lire les titres, descriptions et statuts en FR/EN à texte 150 %, avec une marge
  de sécurité de 32 pixels et des commandes d’au moins 44 pixels ;
- conserver la séparation entre consultation, sélection et ouverture payante,
  ainsi que la confirmation et la clé de reprise du renouvellement de rotation ;
- rendre le focus au point utile après une page, un dossier, une confirmation,
  une annulation ou un échec de sauvegarde.

## Avant et après

Le catalogue utilisait encore des textes fixes de 7 à 13 pixels pour plusieurs
titres, descriptions et badges. Les offres hors rotation restaient ouvrables en
aperçu mais leur carte était désaturée et affichée à 52 % d’opacité. Le choix
de l’ensemble des offres se trouvait en bas de liste, et le catalogue des boosters
n’avait pas de pagination.

Le catalogue propose maintenant son périmètre en tête de lecture. Une recherche
porte explicitement sur toutes les offres ; son périmètre temporairement imposé
est annoncé et le sélecteur conserve le choix préalable pour l’effacement de la
recherche. Chaque groupe possède sa page, avec 12, 24 ou 48 boosters par page.
La pagination réutilise `paginateCatalog`, déjà testé par le projet. Les offres
hors rotation gardent un statut écrit et une bordure distincte, avec une action
« Consulter le dossier » lisible. Un changement de page focalise le titre du
groupe ; un dossier fermé retrouve sa carte source.

Le dossier utilisait un titre complet et une barre d’actions fixes autour d’un
corps parfois très réduit en paysage. Les commandes de pages n’apparaissaient
qu’après la longue liste de cartes. Il conserve maintenant un en-tête compact,
une seule zone de lecture accessible au clavier et des accès directs aux
garanties ou au catalogue de cartes. Le nom complet reste dans le contenu et
nomme la description accessible du dialogue. Les actions de sélection sont
présentées à la suite des garanties. Les pages de cartes se commandent avant
et après la liste ; le focus revient au titre des cartes, même à la dernière
page. Le contenu des signatures et leurs liens de référence restent présents.

Les styles des deux parcours utilisent des unités relatives pour le texte, les
marges de sécurité communes et des grilles qui se replient sans retirer les
descriptions. Aucun gain de cadence d’images n’est affirmé pour cette modification.

## Vérifications locales réalisées

Exécution sous Node **22.23.4** : **48 tests réussis, aucun échec**.

```sh
node --test \
  scripts/portalDenseCatalogs.test.mjs \
  scripts/portalCatalogView.test.mjs \
  scripts/catalogPagination.test.mjs \
  scripts/portalBoosterEconomy.test.mjs \
  scripts/portalRotationReroll.test.mjs \
  scripts/dialogFocus.test.mjs \
  scripts/shellImmersion.test.mjs
```

Les cinq tests du nouveau fichier vérifient le rendu SSR des garanties et des
compteurs dans les deux langues, le maintien des taux du pool complet malgré
les douze cartes montées, le dossier hors rotation, les destinations bornées
des commandes de page et la transmission des tailles numériques. Ce sont des
tests de rendu et de contrats d’événements, pas des essais de navigateur.

Oxlint ne signale aucune erreur ni aucun avertissement dans les fichiers du lot.
`git diff --check` ne signale pas d’erreur d’espacement. La fixture ci-dessous
compile avec Vite ; elle contient le vrai `PortalScreen` et ses données de
production. Son bundle principal reste supérieur à 500 kB et Vite émet son
avertissement de taille habituel. Cette compilation isolée n’exécute pas le
`prebuild` de production et ne vaut pas un `npm run build` complet.

## Recette navigateur en CI

Le workflow [`character-city-fps.yml`](../../.github/workflows/character-city-fps.yml)
exécute cette recette et conserve ses résultats avec ceux de la Cité et des
directives FPS. Le résultat de la révision publiée reste à lire dans les
vérifications de la PR.

```sh
node scripts/buildPortalDenseCatalogsFixture.mjs
PLAYWRIGHT_FIXTURE_DIR=.tmp/portal-dense-catalogs \
PLAYWRIGHT_EVIDENCE_DIR=.tmp/portal-dense-catalogs-evidence \
node scripts/browserPortalDenseCatalogs.mjs
```

La matrice prévoit **12 parcours** : portail réel et dossier synthétique de
53 cartes, chacun en FR/EN et en 390 × 844, 844 × 390 et 1 365 × 900.
Les préférences utilisent HUD 140 %, marge 32, contraste élevé et mouvement
réduit. Chaque parcours compare les tailles de police à 100 % puis à 150 % via
le vrai menu Système. Les rectangles, le défilement, les commandes de 44 pixels,
le focus imbriqué, les titres longs et l’accès aux dernières pages sont vérifiés.

Le portail réel vérifie aussi qu’une consultation ou sélection ne change pas
l’état initial, que la rotation attend une confirmation, que la sauvegarde
différée bloque une seconde soumission, et qu’un échec conserve la même clé
pour la reprise. Le dossier de contrôle parcourt ses 53 cartes sans doublon,
recherche sa dernière entrée, combine les filtres et éprouve les trois tailles
de page. Les résultats et captures sont déposés dans le répertoire de preuves,
avec un reçu `results.json` écrit aussi en cas d’échec.

Le navigateur n’a **pas été exécuté dans cet environnement local** : son blocage
est déjà établi et n’a pas été contourné. Lire le résultat du workflow de la
révision finale avant d’annoncer ces douze parcours comme réussis.

Les images de la recette sont explicitement synthétiques. Le portail utilise
les données et composants réels, avec un état parent de contrôle ; la sauvegarde
de rotation est volontairement différée ou refusée. La recette ne valide donc
ni les illustrations de production, ni la remise de récompenses après achat,
ni un compte cloud, ni un lecteur d’écran ou périphérique physique.

## Fichiers

- `src/components/PortalScreen.jsx`
- `src/components/PortalBoosterDossier.jsx`
- `src/components/PortalCatalogPager.jsx`
- `src/components/PortalImmersion.css`
- `scripts/portalDenseCatalogs.test.mjs`
- `scripts/buildPortalDenseCatalogsFixture.mjs`
- `scripts/browserPortalDenseCatalogs.mjs`
- `scripts/fixtures/portal-dense-catalogs.html`
- `scripts/fixtures/portalDenseCatalogsHarness.jsx`
- `scripts/fixtures/portalDenseCatalogData.mjs`

La présente continuation ne modifie aucun classeur historique. Les autres
catalogues du Hub et les essais visuels de l’ensemble du jeu restent des lots
distincts.
