# Parcours DLC et menus hors des sept espaces Hub

Relevé en lecture seule du 13 novembre 2026. Aucun composant produit n’a été modifié par ce relevé.

## Ce que le joueur peut réellement faire

Le panneau **Système → Packs DLC** décrit le contenu livré avec l’édition. Il permet de rechercher un univers, filtrer les packs inclus ou absents et parcourir le registre par pages de douze. Il ne télécharge aucun code. L’installation est définie par `DLC/distribution.json` : édition complète (`all`), socle (`base`) ou sélection (`selected`).

La **Régulation A.R.C.A.** du Hub conserve une autre fonction : mettre des univers en réserve sans supprimer les possessions. Le déblocage par progression constitue un troisième état. Ces trois décisions ne doivent pas devenir un seul interrupteur « installer ».

Sources : `src/components/GameSystemSections.jsx:7`, `src/game/dlcInstallation.js:4`, `src/game/dlcPlayerState.js`, `docs/development/DLC_INSTALLATION_PROFILES_2026-11-07.md`.

## Captures avant modification

Le build complet de code déjà présent dans `/tmp/multiverse-continuation-code-build` a été servi avec `serveSourceSceneArtFixture.py` sur le port 4180. Son identité affichée est `fc8a57f7`. Les fichiers Système concernés n’ont pas changé dans le commit courant `632d8bb9f`. Aucun nouveau build ni export de distribution n’a été lancé pour ce relevé.

Deux configurations sont conservées : desktop 1440×1000 en français, mobile 390×844 en anglais avec texte 150 %. Chaque configuration couvre le titre, Système, le registre complet, Halo recherché et le filtre des packs absents : **dix captures** dans [before](before/), avec le [rapport brut](before-report.json).

- [Titre desktop](before/desktop-fr-title.png)
- [Packs inclus desktop](before/desktop-fr-packs-all.png)
- [Système mobile150 %](before/mobile-en-150-system.png)
- [Packs mobile150 %](before/mobile-en-150-packs-all.png)
- [Aucun pack absent mobile](before/mobile-en-150-packs-missing.png)

Les dix états n’ont montré aucune erreur JavaScript ni débordement horizontal du document. Le clavier a ouvert l’onglet DLC ; Escape a fermé le tiroir et restauré le focus sur son déclencheur. Les réponses 404 enregistrées concernent uniquement `/favicon.png`, que ce serveur de contrôle ne distribue pas ; ce constat ne prouve pas une absence en production. Les fontes Google ont été bloquées pour une capture reproductible. Aucun compte distant ni sauvegarde existante n’a été utilisé.

## Lacunes observées dans le parcours DLC

| Constat | Preuve | Amélioration concrète |
| --- | --- | --- |
| Le nom accessible du bouton Système énumère audio, affichage, compte et sauvegardes, sans mentionner les DLC. | `GameSystemMenu.jsx:10` | Nommer les DLC pour que ce parcours soit découvrable au lecteur d’écran. |
| Le filtre « Non inclus » de l’édition complète affiche seulement 0 résultat, une liste vide et une pagination 1/1. | Capture `mobile-en-150-packs-missing.png` | Expliquer que tous les packs sont inclus et proposer de réinitialiser les filtres. Distinguer ce cas d’une recherche sans correspondance. |
| L’édition `all/base/selected` est disponible dans les données, mais son sens n’apparaît pas dans le panneau. | `getDlcInstallationSummary()` et captures du registre | Donner un nom d’édition compréhensible, son total inclus et un rappel bref de la conservation des possessions absentes. |
| Un pack affiche essentiellement son nom et « inclus/non inclus ». Aucun dossier ne précise le statut runtime ou illustrations seules, hors la petite mention actuelle artwork-only. | Liste des douze premiers packs ; `GameSystemSections.jsx:33` | Fournir une inspection accessible à partir des informations réellement déclarées par son manifeste. Ne pas inventer de quantité de héros, poids de téléchargement ou disponibilité jouable. |
| La recherche d’un nom composé sans accent n’est pas robuste. | [Sonde réelle](search-probe-before.json) : « Méridien Creux » retourne le pack ; « meridien creux » retourne une liste vide. « telechat » fonctionne grâce à son ID, ce qui rend le comportement incohérent. | Normaliser les accents et séparateurs du nom et de l’ID, avec une recherche française/anglaise cohérente. |
| Le résultat total est annoncé par `role=status`, mais le changement de page ne change pas ce total. | `GameSystemSections.jsx:32–40` | Annoncer la plage et la page courantes avec le résultat, en conservant le focus sur le contrôle de pagination. |

La structure modale, les onglets clavier, la recherche étiquetée et les états natifs désactivés existent déjà. Aucun défaut critique d’isolation ou de restitution du focus n’a été reproduit dans les deux configurations observées.

## Périmètre proposé pour l’agent menus_command

Refondre **l’inspection des packs d’une édition dans Système**, avec une présentation A.R.C.A. lisible et des états explicites. C’est un parcours indépendant des sept espaces Hub récemment repris.

Fichiers à posséder :

- `src/components/GameSystemSections.jsx` : conserver les exports publics et extraire le catalogue si utile.
- `src/components/GameSystemSections.css` : modifications limitées au panneau DLC ; garder les contrats des onglets et de Terrain.
- `src/components/GameSystemMenu.jsx` : libellé accessible du déclencheur.
- Un composant/CSS dédié nouveau pour le dossier de pack, si l’implémentation l’exige.

Les données d’installation restent en lecture seule. La recherche, les filtres, la sélection et la pagination sont des états locaux de présentation. Aucune fonction d’économie, sauvegarde, réserve ou progression n’est nécessaire à cette refonte.

Critères observables :

1. Les éditions `all`, `base` et `Halo` montrent respectivement les inclusions attendues, sans présenter un pack absent comme installé ni un artwork-only comme jouable.
2. Une recherche sans accent sur « Méridien Creux » retrouve le même dossier ; la remise à zéro restaure la liste et sa pagination.
3. Une liste vide explique sa cause et propose une action pertinente ; les contrôles réellement désactivés restent perceptibles.
4. Tout dossier est consultable au clavier, avec état ouvert/sélectionné exposé ; sa fermeture retrouve un focus utile.
5. À 390px, texte 150 %, marges 32px, aucune action ni information d’inclusion n’est coupée. Le tiroir conserve Escape, la tabulation contenue et la restitution du focus.
6. Inspecter ou filtrer un pack ne modifie aucune possession, équipe sauvegardée, préférence de réserve ou règle de terrain.
7. Aucun média propre à un pack absent ne devient une dépendance commune implicite. Toute illustration ajoutée doit respecter le contrat de distribution existant.

Fixture existante à réutiliser : `scripts/fixtures/systemSectionsHarness.jsx`, construite par `scripts/buildSystemSectionsFixture.mjs` avec `SYSTEM_PROFILE=all|base|halo`. Le navigateur `scripts/browserSystemSections.mjs` couvre déjà onglets/flèches/Home/End, focus, inert, préférence de terrain et refus de stockage. Les sorties actuelles du builder sont sous `.tmp` ; convenir d’un dossier `/tmp` avec le parent avant toute nouvelle compilation.

## Carte des autres menus

| Parcours | Entrée et fichiers | État constaté dans le code ; priorité |
| --- | --- | --- |
| Chargement et incident de démarrage | `AppBootstrap.jsx` | Fallback de chargement réduit à un paragraphe ; incident avec Recharger. Petit périmètre visuel futur, sans effet DLC. |
| Titre, identité et prologue | `IntroSequence.jsx`, `IntroImmersion.css` | Déjà mis en scène ; Options, crédits et confirmation de nouvelle Trace utilisent des dialogues avec gestion du focus. Titre réellement capturé ici. |
| Compte et récupération | `AuthPanel.jsx`, `AuthCallbackScreen.jsx`, `AuthImmersion.css` | Parcours spécialisés existants ; aucun envoi ni test de compte effectué pendant ce relevé. |
| Préparation Custom Battle | `CustomBattleMode.jsx/.css`, fixture `customBattleLobbyHarness.jsx` | Déjà structuré en étapes accessibles avec catalogues paginés. Aucun nouveau contrôle navigateur effectué ici. |
| Préparation Fighter | `FighterMode.jsx:918`, styles d’immersion | Lobby immersif existant ; sélection d’équipe et arène. Aucun nouveau lancement effectué ici. |
| Grille, garage et carrière Kart | `RaceMode.jsx:641`, `RaceKart3D.css`, `browserRaceImmersion.py` | Préparation dédiée, recherche de pilotes/circuits, pagination et tiroir garage. Déjà largement travaillés ; ne pas les qualifier d’intacts. |
| Briefing, résultats et pause campagne | `App.jsx:862`, `CombatResultDialog.jsx`, `CampaignPauseMenu.jsx`, `game-system.css` | Contrats spécifiques déjà présents : résultat modal, pause, actions narratives. Préserver les règles moteur et de récompense. |

## Ce qui relève des outils de distribution

| Workflow | Outils réels | Destination |
| --- | --- | --- |
| Construire une édition source | `exportDlcDistribution.mjs --profile FILE --out NEW_DIRECTORY [--source-revision FULL_GIT_SHA]` | Nouveau répertoire extérieur à la source ; profils all/base/selected, reçu et médias attestés. |
| Vérifier cette édition | `auditDlcDistribution.mjs --root EXPORT` | Audit en lecture seule du reçu et de l’arborescence. |
| Compiler sa livraison | `buildDlcDistribution.mjs --root EXPORT` / `build:distribution` | Build de l’export et vérification des modules/médias inclus. |
| Préparer une différence d’édition | `dlcDistributionDelta.mjs create --base DIR --target DIR --out NEW_DIR` | Deux exports audités de la même révision complète. |
| Inspecter cette différence | `dlcDistributionDelta.mjs inspect --base DIR --delta DIR --sha256 TRUSTED_HASH` | Vérification sans reconstruction ni build. |
| Appliquer cette différence | `dlcDistributionDelta.mjs apply --base DIR --delta DIR --out NEW_DIR --sha256 TRUSTED_HASH` | Reconstruction et audit d’un nouvel export ; la base et les sauvegardes restent conservées. |

Ces commandes sont des outils de préparation/distribution, pas des commandes accessibles au joueur dans son navigateur. Aucun export, delta, audit lourd ou build de profil n’a été exécuté pour ce scout. Les scripts et guides actuels exposent leurs limites explicitement ; le relevé ne prétend pas revalider leurs contrats de fichiers, les 505 packs ou leurs médias.

Le builder QA complémentaire `scripts/buildDlcEditionFixture.mjs` est préparé pour `SYSTEM_PROFILE=all|base|halo|pirates`, avec sorties distinctes sous `/tmp/dlc-edition-fixture-matrix`. Sa syntaxe a été vérifiée. Il réutilise le vrai transformateur de profils et le harness Système, sans changer le profil du dépôt. Aucune compilation de cette matrice n’a encore été exécutée au moment de ce scout.
