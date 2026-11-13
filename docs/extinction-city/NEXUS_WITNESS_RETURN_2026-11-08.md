# Retour des témoins — liaison jouable Cité / Extinction

## Parcours joueur

Le dossier de reconnaissance achevé du quartier **Nexus de Convergence** ouvre
une intervention facultative dans le terminal de la Cité. Son briefing conserve
le témoin et les identifiants exacts des reliques du rapport. Les anciens dossiers
à une relique restent valides ; les enquêtes croisées conservent leurs deux preuves.

Le bouton conduit à la préparation de **Solo Extraction**, avec « Retour des
témoins » sélectionné. Il exige un combattant possédé et force les trois relais
à être réellement synchronisés. Le joueur peut décocher l’intervention ou choisir
un autre mode. Une navigation ordinaire ultérieure vers le FPS ne réutilise pas
la demande de lancement de la Cité.

Après les trois relais et la neutralisation du Champion, l’intervention ouvre
une phase de retour. Le joueur doit rejoindre physiquement le sas, puis utiliser
**E / LOOT** à portée. Le sas est visible dans la scène et un **losange vert dans
le radar existant** indique sa direction, même derrière le joueur ou au-delà du
rayon du radar. La distance apparaît dans l’objectif. La Marge et les anomalies
continuent de fonctionner ; la mort du Champion n’est pas encore une victoire.

Le sas ne masque pas les caches et les armes tombées à proximité : les
interactions de loot ordinaires gardent leur priorité. La pause fige l’opération
et efface les entrées ; ses objectifs et objets restent disponibles à la reprise.
La sortie, la fin ou la remise en état nettoient les objets temporaires de
l’intervention.

## Fin, récompenses et sauvegarde

La transmission au sas produit le rapport de victoire habituel d’Extraction.
Ses récompenses et son reçu de run suivent le callback existant du Hub. Aucun
bonus économique, nouveau déblocage ou monnaie supplémentaire n’est ajouté.
Le bilan indique que le relevé a été transmis ; le terminal de la Cité conserve
la confirmation de la première intervention accomplie.

La preuve se trouve dans `report.fieldOperation`, puis dans
`activityProgress.extinctionCareer.fieldReturns['nexus-witness-return-v1']`.
Elle contient les identifiants du quartier, du témoin, des preuves, du héros et
du run, ainsi que les états des relais, du Champion et du retour. La première
preuve valide est conservée ; les livraisons répétées d’un même rapport ne
rapportent rien de plus. Une nouvelle run peut toujours recevoir ses récompenses
ordinaires sans remplacer la première preuve archivée.

Un abandon ne produit ni récompense ni reçu de retour et laisse le dossier de la
Cité disponible. Une défaite conserve le fonctionnement historique du mode, mais
ne ferme pas l’intervention. Les autres modes et les runs d’Extraction sans cette
option gardent leur condition de fin. Les champs inconnus, anciens identifiants
et entrées de DLC absents sont conservés par la progression et son aller-retour
dans la validation des sauvegardes.

## Vérification ciblée

`scripts/nexusFieldOperation.test.mjs` comporte **14 tests**. Ils couvrent les
interactions ordonnées du dossier, la compatibilité du dossier standard, l’accès
avec un roster réellement possédé, les vrais 180 ticks de chaque relais, les
dégâts au Champion protégé par son drone, le refus d’un retour distant ou en pause,
la propriété du marqueur, la priorité du loot, les reçus et récompenses uniques,
la conservation des données et le nettoyage. Le test radar vérifie la direction
relative au joueur, le placement au bord à grande distance et les appels de
dessin, y compris une cible derrière le joueur.

Le dernier test monte **le vrai Hub en SSR** pour les états verrouillés et la
préparation normale sans sélection résiduelle. Le serveur SSR immuable évite
d’ajouter des watchers aux tests. La commande ciblée ci-dessous a passé **60/60**
tests, y compris les régressions de temps, de pause et de mouvement existantes :

```sh
node --test scripts/nexusFieldOperation.test.mjs scripts/extinctionTiming.test.mjs scripts/extinctionPauseTiming.test.mjs scripts/mosaicCityRuntime.test.mjs
```

Le lint des sources modifiées, la syntaxe des trois scripts Python et
`git diff --check` sont également passés localement. Le build global et les
tests communs sont suivis par l’intégration ; ces contrôles ciblés ne les remplacent
pas.

## Recette navigateur et provenance des états

```sh
python scripts/browserNexusFieldReturn.py --require-art --evidence /tmp/nexus-field-return
```

Cette recette charge `scripts/fixtures/nexus-field-return.html`, qui monte le
**vrai Hub** et son callback de progression. Par défaut, elle ouvre deux contextes
frais en français à 1280 × 900, avec texte à 150 %, HUD à 140 % et zone de sécurité
de 32 px. Les deux contextes gagnent leur dossier par marche et interactions :
témoin, première relique, seconde relique, puis archivage à l’ancre. Aucun dossier
achevé n’est injecté.

La préparation se limite à la possession d’Ancre, Mirelle, Bastion et Nova, à
l’entrée initiale du quartier, aux préférences locales et à l’horloge/graine de
replay. Le test de roster absent retire puis restitue cette possession avant le
combat. Il vérifie aussi décocher → quitter → navigation FPS ordinaire, puis un
abandon réel et une nouvelle tentative depuis la Cité.

La reprise de checkpoint **démonte et remonte le vrai Hub en conservant l’état
de son parent**. Elle vérifie la position et le dossier restaurés. Elle ne prétend
pas recharger un compte, un disque ou une sauvegarde distante ; la sérialisation
de sauvegarde est couverte séparément par le test contractuel.

Le combat réutilise la recette historique de relais, sa graine sémantique fixe
`fnv1a32:multiverse-city-fps-operations-v1:relay-under-pressure` et ses assertions
existantes. Des hooks optionnels permettent de piloter la pause du vrai Hub et
de prolonger le parcours par un retour au sas effectué avec les entrées natives.
Les appels historiques sans hooks gardent leur comportement et leurs assertions.

La recette doit observer zéro récompense à la mort du Champion, une simulation
figée pendant la pause du retour, le déplacement jusqu’au sas, puis un seul reçu
et l’attribution exacte des récompenses normales dans les soldes du vrai Hub.
Elle compare les traces des deux runs : seuls les UUID du marqueur sont remplacés
par leur vérification de propriétaire dans cette projection de lecture. Le jeu
et ses identifiants ne sont pas modifiés par cette projection.

Les captures, preuves de marche, reprise de checkpoint, phases de retour,
replays et `report.json` sont conservés dans le dossier d’évidence, y compris lors
d’un échec. `--require-art` exige le décodage des images Canvas demandées. Le
checkout CI contient le décor d’Atrium, les sprites du Nexus et son décor RPG ;
la liste des médias réellement observés est jointe au rapport.

**Limite locale :** Chromium ne peut pas créer ses sockets dans cet environnement
et l’escalade a été refusée. Aucune nouvelle tentative de contournement n’a été
faite. La preuve navigateur se lit dans le workflow du commit publié, avec son
rapport et ses artefacts. Le présent document ne revendique ni victoire navigateur
locale, ni validation artistique, ni couverture mobile pour cette intervention.
