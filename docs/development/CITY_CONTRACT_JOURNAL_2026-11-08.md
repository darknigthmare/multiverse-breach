# Journal des contrats de Cité

## Critères joueur

- Retrouver un dossier par personnage, titre ou sujet, même après la première page.
- Distinguer les contrats à commencer, suivis ou en pause, transmis, à débloquer et les dossiers conservés incompatibles.
- Consulter un autre dossier sans changer le contrat suivi ; retrouver son objectif en une commande.
- Lire la condition d’une suite, revenir à son premier dossier et conserver la décision d’origine dans le chapitre suivant.
- Retrouver les preuves déjà recueillies et les textes de la branche effectivement jouée.
- Utiliser les mêmes commandes au clavier et au tactile, avec texte agrandi et marges choisies, dans le terminal qui suspend déjà la scène.

## Comportement livré

`MosaicCharacterMissions` présente un répertoire et un lecteur. La recherche normalise les accents et parcourt toute la source avant sa pagination à douze dossiers. Les filtres comptent les contrats réellement fournis par le quartier ; ils ne débloquent aucun personnage ou pack. Les dossiers incompatibles restent distincts des suites encore verrouillées.

La sélection consultée est indépendante des filtres et de la mission suivie. Une recherche sans résultat laisse donc le lecteur ouvert. Le sélecteur natif d’accès direct conserve toutes les entrées, y compris les états verrouillés. Seules les commandes existantes d’acceptation, reprise, approche et conclusion appellent les callbacks de jeu.

La carte « Dossier suivi » ramène au contrat actif du quartier. Un suivi appartenant à un autre quartier ou à un contenu absent conserve son message et ses données. Les totaux du quartier et le nombre historique de dossiers transmis restent distingués.

Pour les chapitres suivants, le lecteur emploie le statut et la condition du moteur. Un dossier verrouillé propose la lecture de son préalable lorsqu’il est présent dans le catalogue. Le texte du choix précédent et les étapes obtenues par `getMosaicCharacterMissionStep` présentent la branche effective, sans déduire un autre choix à partir du titre. La conclusion et la prochaine action restent au-dessus des étapes et preuves repliables.

Le terminal peut utiliser jusqu’à 1 120 px de large. À partir de 960 px, le répertoire et le lecteur occupent deux colonnes ; sur petit écran, le répertoire commence replié et se referme après la sélection d’un résultat. Le terminal garde une seule zone de défilement. La fermeture du terminal retrouve le contrat suivi à sa réouverture ; les recherches restent un état local de consultation, sans nouveau champ de sauvegarde.

Le focus rejoint le lecteur après une sélection, le répertoire après une page et l’objectif après une acceptation, une reprise ou une conclusion. Le callback de la scène renvoie le résultat réel d’acceptation ; le focus ne bouge que si la progression change. Ces déplacements se font à la validation React du contenu, sans callback de frame différé pouvant reprendre le focus à un autre écran. La modale et la pause restent sous le contrôle existant d’`ImmersiveDrawer` et de la scène.

## Vérifications

Les **11 tests** de `scripts/mosaicContractJournal.test.mjs` passent sous Node **22.23.4** : vues pures, parcours des 63 entrées de fixture, recherche bilingue et accentuée hors première page, conservation des données, rendu SSR réel du composant, conditions de chapitre et preuve de branche en français et en anglais. Les données de densité sont synthétiques ; les deux contrats d’Ancre et leurs règles proviennent de la source courante.

La fixture `scripts/buildMosaicContractJournalFixture.mjs` compile avec Vite. Le lint ciblé et la syntaxe du script navigateur passent. Le nouveau test est ajouté à `test:ui-immersion`, sans changer les 44 étapes de `prebuild`.

La recette `scripts/browserMosaicContractJournal.mjs` est intégrée au workflow `character-city-fps.yml`. Elle vérifie six combinaisons FR/EN × 390×844, 844×390 et 1365×900, les tailles de texte 100 % puis 150 %, la marge de 32 px, l’isolation modale, la pagination, les conditions, les choix refusés/acceptés, la lecture des preuves, les checkpoints et la rotation. Ses résultats et captures doivent être rattachés au commit effectivement exécuté en CI.

La tentative locale Playwright avec `/usr/bin/chromium` s’arrête avant le chargement de la page : `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted`. Aucune capture locale ni réussite navigateur n’est revendiquée à partir de la compilation. Les parcours réels de déplacement en Cité continuent d’être couverts séparément par `browserMosaicCharacterMissions.py`.
