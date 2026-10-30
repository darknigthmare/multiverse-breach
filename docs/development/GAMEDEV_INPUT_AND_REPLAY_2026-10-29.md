# Commandes de mêlée et replays Extinction — 29 octobre 2026

## Origine et critères

Cette continuation de la PR #15 part du commit
`41558264b0cda55f802a1fc30113b726b56cb3ea`. Elle applique le guide
`input-systems` à la révision amont
`19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9`, ainsi que la méthode embarquée
pour les moteurs personnalisés. Le snapshot des guides reste inchangé.

Les critères retenus avant modification étaient les suivants :

- Une touche maintenue avant l'ouverture d'une réaffectation ne doit pas être
  choisie par sa répétition automatique. Une nouvelle pression doit fonctionner.
- Une affectation ne doit pas rendre les deux directions d'un axe identiques
  pour le même joueur. Un refus explique le conflit et permet de réessayer.
- Un refus de l'API manette ne doit pas interrompre le clavier, le tactile ni
  la lecture des commandes de l'autre joueur.
- Deux parcours Extinction d'un même mode doivent utiliser la même graine et
  la même horloge avant START, conserver les assertions de victoire et produire
  la même empreinte des états observés et décisions dans des contextes frais.

## Réaffecter une commande sans perdre une direction

Le vrai panneau acceptait un événement `keydown` avec `repeat: true`. Ouvrir une
affectation avec Entrée, ou cliquer alors qu'une autre touche était maintenue,
pouvait donc choisir involontairement cette touche.

`MeleeControlsPanel` consomme désormais ces répétitions sans terminer la capture.
Il attend une nouvelle pression. Échap, le départ du focus et la remise à zéro
conservent leur rôle d'annulation. Les touches Entrée et Entrée du pavé numérique
sont vérifiées séparément dans le navigateur.

Le second défaut concernait les axes. Affecter `KeyD` à gauche alors que cette
touche était déjà affectée à droite produisait deux valeurs opposées : la
commande horizontale devenait nulle. `findMeleeAxisConflict` détecte maintenant
ce conflit dans le mapping du joueur concerné. Le panneau annonce le problème
en français ou en anglais, conserve la capture et ne déclenche aucune écriture.
`replaceMeleeBinding` applique la même règle pour les autres appelants.

Cette règle vise seulement les directions opposées d'un même axe. Les alias
contextuels, notamment descente/accroupissement/traversée ou attaque/attaque de
rebord, restent valides. L'autre joueur peut garder la même touche. Le nom
historique `opponent` est toujours accepté. Les profils existants ne sont pas
migrés et le format persistant ne change pas.

## Garder les commandes si le navigateur refuse les manettes

`GameCanvas` appelait directement `navigator.getGamepads()`. Un navigateur qui
refuse cet accès par Permissions Policy lève un `SecurityError` ; l'exception
sortait du lecteur de commandes et atteignait l'arrêt de la boucle de combat.

Le nouveau helper `readBrowserGamepads` protège l'accès à `navigator`, le getter
et l'appel de la méthode. En cas d'absence ou de refus, il renvoie une liste vide
et le lecteur poursuit la fusion des sources clavier et tactiles.

L'appel conserve son receiver natif. Un tableau valide est retourné tel quel :
aucun filtrage ne déplace une manette de l'indice 1 vers le joueur 1. L'accès est
retenté à chaque lecture ; une erreur transitoire ne désactive pas définitivement
les manettes.

La sixième fixture navigateur compile le vrai lecteur extrait de `GameCanvas`
avec ses helpers de mapping et son registre de scène. Un contexte HTTPS reçoit
`Permissions-Policy: gamepad=()` ; une sonde indépendante vérifie que le refus
natif est bien un `SecurityError`. Les deux joueurs conservent leurs commandes
et les relâchent correctement pendant plusieurs lectures.

Les événements clavier sont natifs. Les appuis tactiles sont préparés dans le
vrai registre, et l'absence complète de l'API est simulée dans un cas distinct.
Le retour à une politique autorisée après navigation concerne un nouveau
document. La récupération dans une même instance est vérifiée par un test
unitaire. Cette fixture ne revendique ni manette physique ni combat complet.

## Rendre les parcours Extinction comparables

Sur le commit de départ, le workflow City/Extinction avait échoué une fois en
Infestation, puis réussi lors d'une unique relance inchangée. Le bot utilisait
`Math.random` sans graine et installait son horloge après START. Ces résultats
ne permettaient donc pas de comparer précisément les deux parcours.

La fixture fournit désormais un générateur `mulberry32-v1`, installé uniquement
dans le document de test avant START. La graine est dérivée par FNV-1a 32 bits de
la chaîne UTF-8 `multiverse-extinction-ci-v1:<mode>`. Cette règle a été fixée avant
les parcours ; aucune graine n'a été sélectionnée en fonction d'une victoire.

| Mode | Graine |
| --- | ---: |
| Extraction | 4129683705 |
| Last Signal | 3378683129 |
| Infestation | 2204421054 |
| Hunt | 457186949 |

Une première version à graine fixe a révélé un autre problème du test : deux
traces identiques au départ divergeaient au troisième échantillon, à 41 contre
42 étapes de simulation, avec le même nombre de tirages aléatoires. La date
figée ne suffisait pas à fixer la phase de `requestAnimationFrame`.

La préparation charge maintenant la scène en phase `ready`, installe l'horloge
avant START, termine le RAF natif déjà programmé, puis aligne la phase sur la
grille de 16 ms de Playwright 1.57. La date est ensuite normalisée et le test
vérifie que le compteur de simulation vaut encore zéro avant sa première avance.
L'attente du RAF natif est bornée et produit une erreur explicite si elle échoue.

Pour chacun des quatre modes, le workflow lance deux contextes navigateur frais.
Il enregistre les états observés, les décisions du bot, la graine, l'état et le
compteur du générateur. Leur JSON canonique produit une empreinte SHA-256 ; une
différence entre les deux parcours fait échouer le contrôle. Chaque parcours
doit aussi satisfaire les assertions de victoire et d'objectif existantes.

Les traces détaillées restent disponibles en cas d'échec : progression, PV,
armure, positions, armes, munitions, ennemis, butin, zones dangereuses, actions et
erreurs de page. La stratégie du bot, les statistiques du héros, les dégâts et
les règles de victoire ne sont pas modifiés. Le code produit ne reçoit ni graine
forcée ni changement d'horloge.

L'empreinte porte sur un ensemble substantiel de champs observés, sans inclure
chaque champ interne du moteur. Elle établit la répétabilité des parcours testés
dans un environnement donné. Un contexte offline et un contexte localhost
n'ont pas forcément les mêmes services natifs, notamment `crypto.randomUUID` ;
leurs empreintes ne sont pas assimilées. Le workflow utilise les vrais assets
du dépôt avec `--require-art`.

## Vérifications et commandes

Les tests ajoutés couvrent 22 cas de réaffectation et 8 cas d'accès aux manettes.
Avant correction, les nouvelles suites reproduisaient respectivement 16 et
4 échecs ; après correction, les 30 cas passent. La relecture indépendante a
également exécuté les 8 cas manettes avec les 12 régressions tactiles existantes,
soit 20 tests réussis.

La fixture de commandes passe de 18 à 24 scénarios. La suite enrichie exécutée
contre le composant d'origine échoue sur le premier nouveau scénario, celui de
la répétition d'Entrée ; les 24 passent avec la correction. La nouvelle fixture manette
vérifie quatre scénarios ; deux reproduisent un échec avec l'ancien lecteur et
les quatre passent avec le helper. Les exécutions locales utilisent Chromium
153.0.8010.0 et ne remontent aucune erreur de page pour ces deux fixtures.

Les six fixtures intégrées ont ensuite réussi : affichage, stockage, commandes,
audio, sauvegarde et manettes. Le premier passage audio avait dépassé le délai
pendant l'envoi d'un clic, avant une assertion du moteur. Une unique relance
diagnostique inchangée a passé ses sept cas ; la cause précise du retard initial
n'est pas établie. Les trois scénarios de sauvegarde passent également, sans
erreur de page. Les journaux de la première tentative et de la relance restent
distincts.

Les deux parcours HTTP locaux d'Extraction ont la même empreinte : victoire à
1163 étapes, 137 PV, 34 éliminations et 61 décisions. Le chargement du premier
parcours Last Signal a ensuite dépassé son délai avant START, sans erreur de
page ; l'exécution locale a été arrêtée. Cela ne constitue pas une divergence
de simulation ni une preuve pour les trois autres modes. Leur validation reste
exigée par les huit parcours du workflow après publication.

La suite intégrée locale `npm run test:gamedev` a aussi rencontré des délais
de transport Vite de 60 secondes lors du chargement des moteurs des tests
existants. Elle n'est pas comptée comme réussie ; les tests ciblés ci-dessus sont
des exécutions distinctes. Le workflow GitHub doit valider l'ensemble de la suite.

La compilation locale de l'application réussit avec 315 modules transformés.
La compilation des six fixtures réussit avec 53 modules. La compilation Vite
seule ne comprend pas les contrôles d'assets de `npm run build` ; le workflow de
production exécute ce contrôle complet depuis le checkout GitHub.

```sh
npm run test:gamedev
npm run build:gamedev:fixture
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:input-browser
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:gamepad-browser
python scripts/browserSceneServices.py --require-art --replays 2 --evidence /tmp/scene-ui-evidence/completion
node scripts/checkGamedevGuidance.mjs
```

Le navigateur FPS nécessite le serveur Vite et Playwright décrits dans
`.github/workflows/city-extinction-ui.yml`. Le workflow `Gamedev display browser`
conserve les six fixtures et leurs journaux dans son artefact. Les liens des
exécutions, le commit réellement testé et les éventuelles limites de déploiement
sont consignés dans la PR #15 après la publication.

Ces contrôles n'établissent aucun gain de FPS, aucune validation du mixage audible
ni une couverture de toutes les graines possibles. Ils ne lisent aucune partie
personnelle et ne modifient aucun format de sauvegarde.
