# Installation et continuité des sauvegardes DLC

Les distributions base, sélectionnées et complètes doivent conserver les possessions, les préférences de réserve et la progression des contenus absents. Seule la projection jouable dépend de l’installation. La campagne de base reste disponible.

## Correction vérifiée

`mergeDlcCampaignProgress` écrasait les identifiants de mission inconnus à l’intérieur d’un pack connu. Exemple : un ancien catalogue `[10, 11]` réécrivait un état sauvegardé `[10, 99]` en `[10]`. La normalisation et la sérialisation de `App.jsx` passent toutes deux par ce helper. Les packs entièrement inconnus étaient déjà conservés.

La correction recalcule les missions connues depuis `completedStages`, dans l’ordre du catalogue, puis conserve les identifiants absents du catalogue dans leur ordre sauvegardé. Les sous-champs du pack et les packs inconnus restent inchangés ; les entrées fournies ne sont pas modifiées. Un identifiant conservé n’ajoute aucune mission au catalogue jouable et ne rétablit pas une complétion connue absente de `completedStages`.

Si l’identifiant futur figurait aussi dans `completedStages`, sa complétion globale était déjà conservée. La perte corrigée concerne le contenu opaque de `campaignProgress[packId].missionIds`.

## Preuves

- `campaign-progress-before.tap` : les quatre régressions échouent avant la correction ; cette preuve historique est conservée intentionnellement.
- `campaign-progress-after.tap` et `.json` : quatre tests Node purs réussissent après correction, avec commande et empreintes source.
- Les tests couvrent les missions historiques et futures, le rafraîchissement des missions connues, l’ordre, les sous-champs, l’immuabilité, l’idempotence et un aller-retour JSON suivi de la restauration du catalogue.
- Une régression complémentaire dans `dlcPlayerState.test.mjs` traverse la vraie normalisation et sérialisation d’App avec catalogues complets ou absents ; elle vérifie aussi que la mission opaque ne rejoint pas `completedStages`. Son exécution SSR est distincte du reçu Node pur ci-dessus.
- `installation-state-standard.tap` et `.json` : 21/21 tests standard passent en 7,262 s avec Node 22, heap 8 Go et concurrence 1. Les sources restent identiques pendant le passage. Les suites couvrent aussi les profils d’installation, les sauvegardes historiques, les possessions avec doublons, les équipements et préférences dormantes, les missions multi-univers et les identités de phases.

## Revue des contrats existants

`dlcInstallation.js` lit le profil de distribution, séparé des préférences de sauvegarde. Le registre complet permet de reconnaître un pack absent ; ses univers ne sont pas déclarés installés. `projectPlayableTeam` filtre les héros réellement présents, possédés, installés et disponibles sans réécrire l’équipe sauvegardée. Les commandes collectives de visibilité ignorent les contenus absents et préservent leurs préférences. L’union des univers masqués pour l’exécution n’entre pas dans la sauvegarde.

Les identités stables sont indépendantes de la position dans un catalogue réduit. La conservation des fichiers partagés et la fermeture des imports des profils sont vérifiées séparément par les suites de distribution/profils ; ce correctif ne modifie ni leurs manifestes ni leur publication.

Ces preuves ne constituent pas une compilation, un export avec ses médias ni un parcours navigateur des profils base/Halo/mixte/complet. Les tests SSR standard utilisent le fixture App habituel, sans loader modifié ; les tests de transformation et d’export de profils sont validés séparément.
