# Suite du 26 octobre : journal, services et quatre variantes Extinction

## Modifications

Le journal de la Cité devient une transmission ouvrable. Le texte complet reste dans le terminal, avec focus au journal puis retour au bouton après fermeture. À HUD 140 %, le mobile garde le bouton court plutôt qu’un texte coupé. Les neuf sorties de services testées prennent explicitement un instantané de position avant la navigation et relâchent les commandes.

Les cinq familles d’objectifs Course sont localisées FR/EN sans changer leurs identifiants ou compteurs. Six types ennemis d’Extinction et les armes ramassées ont des libellés localisés. Le briefing Infestation annonce désormais les 60 secondes réellement requises par la règle existante.

## Vérification

81 tests ciblés, 68 tests UI (recoupements), lint de sept fichiers sans erreur/avertissement et compilation du snapshot source réussis. Le nouveau scénario parcourt neuf accès Cité à quatre tailles (36 transitions), à partir de positions préparées. Le parent de test capture la navigation puis remonte la scène à sa dernière position ; il ne monte pas les écrans de destination réels.

Les quatre variantes Extinction arrivent à leur victoire via les tirs, déplacements, recharges, compétences et ramassages normaux. Le bot lit l’état sans le modifier ; le temps est virtuel. Extraction collecte trois balises ; Infestation atteint 3 600 frames. Aucun verdict, dommage, kill ou soin n’est injecté. Cela ne mesure ni l’équilibrage humain ni les performances sur appareil.

Les résultats locaux et empreintes figurent dans `scene-completion-2026-10-26.json`. Les tests locaux utilisent le composant compilé et les octets exacts des médias dans un replay hors ligne ; les workflows Cité/Extinction et Course exécutent les fixtures via HTTP avec les images du dépôt. Consulter le reçu CI pour la preuve distante, distincte du résultat local.

Le classeur conserve 40 écrans, 39 lots et l’historique ; il passe à 144 vérifications. Les écrans restent partiellement validés. La ligne SUITE-CI est l’état à la préparation, complété ensuite par le reçu distant.

## Non couverts

Exploration de tous les quartiers, destination réelle de chaque menu, tous les héros/armes, compte cloud, périphériques physiques et recette consolidée des 40 écrans. Silhouettes ennemies génériques inchangées ; certains textes de catalogue et l’avertissement de taille de bundle restent ouverts. Pas de fusion ni de promotion production.
