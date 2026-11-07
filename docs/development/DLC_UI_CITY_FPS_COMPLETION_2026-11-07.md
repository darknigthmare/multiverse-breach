# Séparation DLC, menus et contenu Ville/FPS — 7 novembre 2026

Suite de la PR 25, base `308e41b3e504cbb611b4a6461d0d23c6fcfed90f`.
Cette livraison réunit les trois chantiers demandés. Les preuves navigateur et
de build complet sont produites par les workflows de la PR, distinctement des
tests locaux et de la compilation sans copie des médias.

## Dépendances DLC communes

La création du profil utilisait `/backgrounds/stargate-rpg-openai.png`, alors que
son fichier appartenait exclusivement à Stargate. Le fichier devient commun,
sous `public/backgrounds/`, sans réencodage ni changement d’URL. Ses
2 580 039 octets conservent le SHA-256
`8e72287b0064be6ebe878f48c23673750903ae8d55f9d15b5f4910e44ea37f8f`.

Le collecteur `scripts/dlcCommonUiAssets.mjs` relève les références publiques
statiques dans App, les composants et leurs CSS. La génération des inventaires
les classe comme dépendances communes ; un export refuse une référence UI connue
dont le fichier serait omis ou absent de l’inventaire. Les chemins construits
dynamiquement ne sont pas assimilés à des références prouvées.

La garde reconnaît aussi les extensions encodées dans les URL, les noms cités
contenant des espaces et les listes `srcSet`. Les régressions vérifient le refus
effectif d’un export incomplet, pas seulement la présence d’un chemin dans le
collecteur. Les documents des premières phases renvoient désormais aux profils
de distribution qui résolvent leur ancienne limite d’installation facultative.

L’inventaire courant compte 8 186 médias propres aux DLC et 5 977 médias communs,
soit toujours 14 163 fichiers. Les profils base et Halo retiennent respectivement
5 977 et 6 178 médias. Le fonds commun représente 7 167 320 919 octets.

Le rapport `dlc-shared-asset-coverage-2026-11-07.json` distingue consommateurs
statiques, usages communs et résolutions indirectes. Il repère 14 décors dont les
seuls littéraux observés appartiennent à des DLC, soit 38 474 464 octets. Les
registres et replis dynamiques empêchent d’en déduire une suppression sûre. La
politique `preserve-all` reste explicite, sans déclaration de purge complète.

Reproduction du rapport :

```sh
node scripts/dlcSharedAssetCoverage.mjs --out docs/development/dlc-shared-asset-coverage-2026-11-07.json
node scripts/dlcSharedAssetCoverage.mjs --check docs/development/dlc-shared-asset-coverage-2026-11-07.json
```

Le navigateur des exports conserve les scénarios de sauvegarde existante et
ajoute une première installation à 1 365 et 390 pixels : création réelle du
profil, cinq écrans de prologue, accès au Hub et rechargement. Le décor de profil
et celui de l’introduction doivent être réellement décodés dans chaque export.
Les reçus de migration précédents restent historiques et inchangés.

## Menus et HUD

La prévisualisation Régulation et le Laboratoire des portails utilisent
`useModalDialog`, comme les autres fenêtres du jeu. Le fond devient inerte,
Tab reste dans la couche supérieure, Échap ferme cette couche et le focus revient
au déclencheur. La fermeture simultanée des couches rend le défilement au jeu.

Ces deux fenêtres appliquent désormais la taille du texte et la marge de sécurité
choisies dans les réglages. Les noms longs passent à la ligne, l’explication du
laboratoire reste présente sur mobile et les zones de lecture défilantes sont
accessibles au clavier. La recette compare les polices réellement calculées à
100 % puis 150 %, vérifie les marges et atteint la dernière des neuf planches
de contrôle au clavier.

`MosaicGuidePanel` permet de développer ou réduire le guide sans modifier sa
progression. Sur les petites fenêtres, il commence replié ; les instructions
complètes restent accessibles dans le terminal avec un transfert de focus
explicite. La carte est bornée au-dessus des commandes et sur le côté en paysage.
Lire le guide au clavier n’envoie pas de commandes de déplacement à la Ville.

Sous 560 pixels de hauteur, la carte ouvre directement le guide du terminal :
elle ne propose plus une zone dépliée trop basse pour lire ses instructions.
Le terminal conserve Pause/Reprendre et rend le focus à son bouton permanent,
y compris lorsque la pause retire la carte du guide de la scène.

Les planches de mains d’Arthur et Serj présentent des séparateurs irréguliers.
Les trois rangées utilisées disposent maintenant de bornes source explicites,
liées à leur propriétaire. Les pixels des PNG, leurs autres usages, le fallback
de recharge et le contrat Mirelle sont conservés. Le runner vérifie les vrais
appels `drawImage`, le cadrage, les proportions et les rangées utilisées ; ce
correctif ne produit pas de nouvelles animations personnelles.

La fixture des menus monte les composants réels, en FR/EN, à 390 × 844,
844 × 390 et 1 365 × 900, avec HUD 140 % et texte 150 %. L’image d’aperçu de contrôle est
explicitement synthétique ; le fallback du portail est le fichier réel du dépôt.
Cette fixture ne remplace pas les parcours complets de la Ville.

## Ville : rapport de reconnaissance

Un quartier comportant un habitant possédé, une vitrine et une ancre propose un
dossier dans le terminal. Le joueur doit successivement :

1. Rencontrer physiquement un habitant de cet univers.
2. Examiner une relique dans une vitrine du même quartier.
3. Transmettre son rapport à l’ancre locale.

Le bouton d’objectif utilise les groupes de résidents, la pagination des vitrines
et le déplacement existants. Il ne téléporte pas le joueur. La lecture d’une
fiche à distance ne valide rien. Chaque étape repose sur le résultat réel de
`resolveMosaicInteraction`, avec identité, univers et portée vérifiés.

Les dossiers sont enregistrés sous `activityProgress.mosaicReconnaissance`, par
identifiant stable de quartier. Un changement de dossier conserve le précédent ;
un DLC absent ne supprime pas son historique. Les migrations et la sérialisation
réelles d’App couvrent les versions 6, 8 et 9. Une reconnaissance ne donne ni
objet ni monnaie ; elle relie les habitants, vitrines et ancres déjà accessibles.

## FPS : Relais sous pression

Une option de préparation d’Extraction ajoute une opération de terrain. E/LOOT
active une balise, puis 180 ticks actifs dans le rayon de collecte la synchronisent.
Le joueur doit confirmer avec E/LOOT pour la stabiliser. Les ennemis et la
simulation continuent pendant la synchronisation.

Sortir du périmètre suspend l’avancement et affiche une instruction de retour.
Pause, consultation de la directive et perte de visibilité n’accumulent aucun
temps ; le premier frame de reprise réinitialise l’horloge. L’état appartient à
la partie active et est nettoyé à la fin, à l’abandon ou après une erreur de rendu.
Le bilan conserve le nombre de balises synchronisées.

En paysage bas, le bandeau de l’opération place la directive et l’objectif sur
une rangée, puis le relais sur la suivante. Sa largeur réserve le radar et sa
hauteur laisse le réticule et les commandes libres. Les préférences de taille
restent appliquées ; le contrôle navigateur mesure les zones réellement rendues.

L’option inactive suit les quatre modes historiques. Leurs identifiants, graines,
victoires et récompenses ne changent pas. Le nouveau module ne consomme aucun
tirage aléatoire ni horloge native. Les rapports et crédits passent toujours par
le chemin de récompense unique existant.

## Validation et suivi

Les nouvelles suites sont incluses dans `test:ui-immersion`, sans retirer ni
réordonner les 44 commandes du prébuild. Les tests exécutent les vraies étapes
de simulation et les effets de pause, ainsi que les transitions de sauvegarde.
La compilation `viteCodeOnly.config.js` vérifie le bundle sans copie du corpus ;
`production-build.yml` reste la preuve du build complet.

La première recette navigateur a détecté le chevauchement du bandeau en paysage
et une observation trop précoce du checkpoint de Ville. Le test prend maintenant
la position avant démontage, attend le callback de sauvegarde et son rendu parent,
puis compare la restauration au checkpoint confirmé. La tolérance reste 0,02 et
les coordonnées ainsi que les compteurs sont enregistrés dans les preuves.
Le contrat historique de santé FPS extrait aussi le callback réel par l’AST,
au lieu de dépendre du texte de sa liste de dépendances React. Ses assertions
de PV, de maximum et de dimensions sont conservées.

Les workflows permanents couvrent :

- `dlc-profiles.yml` : exports base/Halo, nouveaux profils et sauvegardes existantes.
- `gamedev-display.yml` : menus imbriqués, réglages et guide responsive.
- `ec-protocols.yml` : missions Ville et relais FPS par entrées réelles ; les
  replays utilisent des contextes frais et une graine propre à ce nouveau scénario.
- `residents-viewmodels.yml` : habitants et cadrage des trois propriétaires FPS.
- `city-extinction-ui.yml` : services et quatre modes historiques complets.

Les classeurs datés restent des catalogues et historiques de leurs recettes.
Ce document ajoute l’état de ces corrections sans effacer les annotations
précédentes ni transformer les propositions de décors en contenu livré. Les
autres kits FPS, bestiaires et illustrations propres aux univers, la recette
consolidée des 40 écrans, les périphériques physiques et les services cloud réels
restent des travaux distincts. Le téléchargement ou l’installation à chaud des
DLC n’est pas introduit par cette livraison.
