# Suite de la séparation DLC, des menus et de la Cité / FPS

Reprise du commit `da102bdc1dea30dce8b98f44931be8b35cf16c28` de la
[PR #27](https://github.com/darknigthmare/multiverse-breach/pull/27).
Le [lot précédent](DLC_DIFFERENTIAL_FIELD_VARIANTS_2026-11-07.md) reste la
référence pour les paquets différentiels, les onglets Système, les enquêtes
croisées et les relais contestés.

## Critères du lot

1. Réduire les dépendances communes d'une édition seulement lorsqu'une liste
   explicite et vérifiée de consommateurs permet de le faire. Tous les packs
   consommateurs d'un décor partagé doivent conserver son URL et ses octets.
2. Parcourir la préparation du combat personnalisé au clavier, chercher dans
   les deux équipes et le catalogue de menaces, puis lancer et reprendre la
   préparation avec les mêmes choix. Les textes agrandis doivent rester lisibles.
3. Lire les témoignages de la Cellule ZERO après rencontre dans la Cité et
   consulter les éléments déjà recueillis dans le dossier de reconnaissance.
4. Raccorder les quatre actions des cinq héros de campagne Nexus encore absents
   des adaptations FPS : Tessera, Quillon, Nadir, Elyra et Oryn. Leurs effets
   temporaires appartiennent à une seule partie et respectent la pause.
5. Parcourir les versions et comparaisons de la galerie, déplacer une image
   agrandie au clavier, entrer et sortir du plein écran et retrouver le focus.
   Un favori absent d'une édition réduite doit revenir avec son DLC.

## Changements livrés dans les sources

### Éditions DLC allégées

Les nouveaux profils `base-reviewed` et `halo-reviewed` utilisent le contrat
`reviewed-dependencies`. Les quatorze décors examinés restent des sources
communes, car chacun dessert plusieurs univers ; une édition peut les omettre
seulement si elle n'installe aucun de leurs consommateurs. Les éditions Base
et Halo allégées évitent ainsi **38 474 464 octets**, sans modifier les URL ni
les octets des médias conservés. La politique historique `preserve-all`
reste la valeur par défaut.

Le vérificateur relit les contributions du renderer, les références communes
et les résolveurs dynamiques avant d'autoriser une exclusion. Les exports,
reçus et paquets différentiels conservent cette preuve. Le workflow des
distributions construit et parcourt désormais les quatre profils Base/Halo,
historiques et allégés. Voir le [contrat détaillé et ses preuves](DLC_SHARED_ASSET_DEPENDENCIES_2026-11-07.md).

### Préparation du combat et galerie

La préparation du combat personnalisé possède quatre onglets nommés avec
navigation clavier, étapes précédente/suivante et restitution du focus après
le combat. Les deux équipes et les menaces sont recherchables et paginées.
L'ancien plafond de 250 menaces disparaît ; changer de filtre ne permet plus
d'ajouter une ancienne menace cachée. Les paramètres de combat et les choix
préparés sont conservés.

La galerie synchronise son bouton avec le plein écran réel, garde une fenêtre
utilisable si le navigateur refuse ce mode et rend le focus à sa fermeture.
Les raccourcis de zoom de l'image laissent les raccourcis du navigateur libres.
Les régions de zoom et de comparaison sont défilables au clavier, y compris
en vue simple mobile. La barre de commandes, les textes agrandis, la marge de
sécurité et le message de repli respectent l'espace disponible.

Les favoris ne sont plus filtrés selon le catalogue actuellement installé.
Modifier un favori visible conserve les IDs des DLC absents ; la réinstallation
retrouve leur état. Aucun changement de format de sauvegarde n'est nécessaire.

### Habitants et campagne FPS Nexus

Dix habitants de la Cellule ZERO proposent **39 sujets par langue**, repris des
paragraphes existants. Le dialogue s'ouvre lors d'une interaction à proximité
avec un habitant possédé. Le terminal présente les témoignages et les preuves
déjà collectés dans la sauvegarde de reconnaissance. La variante d'enquête
croisée affiche les deux reliques distinctes requises et son avancement.

Les cinq kits Tessera, Quillon, Nadir, Elyra et Oryn ajoutent **20 actions** ;
le registre FPS compte **12 kits et 48 actions**. Le reflet de Tessera reste
fixé au lieu de pose pendant cinq secondes actives. La sonde de Nadir permet
un seul rappel pendant six secondes actives, sans réinitialiser santé,
munitions ou recharge. Pause, abandon, fin et erreur conservent les règles
de durée et de nettoyage. Voir la [note gameplay](../extinction-city/nexus-campaign-gameplay-2026-11-07.md).

## Vérification de la reprise

Les 54 contrats locaux du lot précédent (différentiels, préférences,
reconnaissance et relais) passent sur l'arbre de départ. Le navigateur local
échoue avant ouverture de la scène : Chromium ne peut pas créer son socket
dans cet environnement. L'exécution hors bac à sable est interdite par sa
politique. Les recettes navigateur de ce lot sont donc exécutées dans GitHub
Actions et leur résultat doit être lu sur le commit livré.

Le workflow de fiabilité précédent
[42415960630](https://github.com/darknigthmare/multiverse-breach/actions/runs/42415960630)
a atteint son plafond de douze minutes pendant la dernière des dix suites
navigateur. Les contrôles précédents et les scénarios terminés avaient réussi.
Son budget passe à vingt minutes ; les suites et leurs assertions restent
inchangées.

### Contrôles locaux et recettes distantes

Les suites locales suivantes ont réussi pendant l'intégration :

| Commande | Résultat |
| --- | ---: |
| `npm run test:ui-immersion` | 197/197 |
| `npm run test:dlc:profiles` | 159/159 |
| `npm run test:custom` | 47/47 |

Les totaux des suites spécialisées présentés dans les notes DLC et gameplay
se recoupent avec ceux-ci. Les 44 commandes du `prebuild` de production restent
identiques et dans le même ordre. Le test de préparation des médias avant
`npm ci` inclut le nouveau module DLC et vérifie toujours que la politique
historique ne charge pas le parser.

Le workflow `dlc-field-continuation.yml` ajoute les recettes suivantes aux
parcours précédents :

- Six préparations de combat personnalisé FR/EN, de 390 × 844 à 1 365 × 900,
  avec recherche, pagination, lancement, retour et focus.
- Six parcours galerie sur les mêmes formats, avec zoom simple/comparé,
  versions exactes, plein écran natif/refusé, clavier et retour d'un favori DLC.
- Trois rendus DLC Base/Halo/consommateurs avec décodage des vrais médias du
  dépôt et vérification des appels effectifs au renderer.
- Onze parcours Nexus : conversations, enquête croisée avec reprise et carnet,
  cinq kits FPS et deux variantes mobiles.

Les fixtures de menus utilisent des illustrations de contrôle clairement
identifiées et des profils préparés. Les cas FPS préparent une cible résistante
sans dégâts ennemis et gagnent leur charge avec les commandes natives ; ils
n'injectent aucune victoire ni récompense. Les résultats navigateur et de
compilation complète doivent être lus sur le commit effectivement publié dans
[les contrôles de la PR #27](https://github.com/darknigthmare/multiverse-breach/pull/27/checks).

## État des catalogues historiques

Les deux classeurs `docs/excel/Multiverse_Breach_UI_Immersion.xlsx` et
`docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx` sont des
instantanés associés à la révision immuable du reçu
`docs/extinction-city/workbook-followup-2026-10-28.json`. Le workflow
`extinction-content.yml` vérifie leurs empreintes et cellules contre cette
révision, puis produit séparément le catalogue du commit courant. Le présent
lot complète leur état sans réécrire les preuves historiques.

## Portée restante

L'installation de code DLC pendant une partie, le tri complet du fonds commun,
la production des illustrations personnelles et de tous les quartiers, la
recette consolidée des autres écrans, les périphériques physiques et les
services cloud réels restent des chantiers distincts. Un kit FPS adapté et ses
effets procéduraux ne constituent pas une nouvelle planche de mains ou une
validation artistique.
