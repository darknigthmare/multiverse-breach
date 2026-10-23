# Supers, appels RPG et séquences de combat

État du 18 octobre 2026. Ce lot ajoute les systèmes jouables et leur suivi de couverture. Il ne clôt pas la demande de fidélité intégrale 1:1 de tous les personnages et univers.

## Comportement livré

- **Mêlée** : la commande spéciale utilise une technique à 30 % de jauge et le super personnel à 100 %. Clavier, tactile, P2 et CPU partagent la même activation chronométrée. Le super conserve sa portée, son orientation, son type de projection et son effet ; soins, protection, buffs, purification et résurrection ne deviennent pas des dégâts adverses. Garde, boucliers, interruption et fin de combat passent par les règles existantes. Le panneau affiche le nom du super et sa jauge. Les intros et états de résultat couvrent tous les combattants.
- **RPG** : une commande distincte appelle une invocation, un renfort ou un déploiement du même univers. Choix et annulation des cibles sont gratuits. La confirmation coûte 100 ATB et 100 % de charge spéciale, une fois par combattant et par combat. L'arrivée, l'impact et le retour suivent les ticks de simulation. Pendant la scène, les autres commandes, objets et effets externes sont verrouillés. Pause, mort du lanceur, fin et destruction du moteur ne produisent aucun impact tardif ; une cible invalidée n'est pas remplacée automatiquement.
- **Combat/Fighter** : deux manches gagnantes par défaut. La première manche présente la victoire et la défaite sans terminer le match ni attribuer sa récompense. Les PV et la garde reviennent au maximum, la jauge personnelle à zéro, le super de terrain à 20 % et l'assist à 40 %. Le résultat du match attend la finale, la victoire/défaite et la sortie, puis déclenche un seul callback. Un résultat au temps ne joue pas de finale. Les présentations utilisent le personnage et sa capacité source, sans dégâts après la fin.
- **Décors** : animations discrètes derrière les combattants, reliées au lieu ou aux matériaux explicitement décrits. L'horloge vient de la simulation et respecte la pause et le mouvement réduit. Aucun dégât, collision ou déplacement de plateforme n'est ajouté par cette couche. Les télégraphes et événements de stage existants sont conservés.

### Commandes RPG

Le bouton d'invocation ou de renfort apparaît dans les actions du combattant. **U** appelle la commande du joueur 1 ; **PavNum 5** celle du joueur 2. **R1/RB** la déclenche sur la manette du camp concerné. Il faut ensuite confirmer ou annuler les cibles dans le panneau commun. Le spécial ordinaire reste une autre commande, qui partage la ressource de charge.

## Complément de couverture livré

Le [suivi détaillé](combat-identity-coverage.md) et son [JSON reproductible](../combat-completion-2026-10-18/coverage.json) recensent les **1 911 héros et 525 univers**. Les **1 089 capacités génériques** de la première mesure ont une définition explicite par ID. La revue élargie a trouvé **191 autres « decisive action »**, traitées dans deux lots supplémentaires. Chaque entrée distingue technique nommée, adaptation du rôle ou canon original du projet. Les rôles de soutien gardent leurs effets de soin, garde, amélioration, purification ou résurrection.

Les **82 profils autrefois sans asset d’entité** sont associés exactement à **28 planches PNG distinctes**, quatre poses chacune. Les fichiers proviennent de véritables générations natives OpenAI, puis d’une extraction des pixels, avec échelle commune et transparence. Les sources, prompts, empreintes, coordonnées d’extraction et corrections sont conservés dans la [provenance](../combat-completion-2026-10-18/entity-assets-provenance.json). Ifrit, Shiva et Bahamut ont chacun leur propre sprite ; les opérateurs ne prennent plus la place des drones ou tourelles. Un équipement reste un renfort, et un partenaire conserve son propre univers.

Les **255 ambiances manquantes** sont écrites explicitement : **525/525 univers configurés** sans nom de scène, avec **285 adaptations de lieu** et **240 adaptations physiques**. Le [rapport détaillé des atmosphères](stage-atmosphere-coverage-2026-10-18.md) décrit les références et effets. Un véritable lieu fourni par le stage garde priorité.

Cette couverture ne certifie pas une reproduction 1:1. Les références aux œuvres n’ont pas été vérifiées sur le réseau ; les sprites sont des adaptations générées et les séquences utilisent des poses adaptées. Les techniques à effets multiples restent simplifiées : par exemple Great Gospel soigne sans reproduire l’ensemble de son invulnérabilité d’origine. Les métadonnées conservent ces limites au lieu d’affirmer une validation canonique.

## Vérification

- `npm run test:combat-presentation` : **89 tests** de catalogue, runtime, intégration, couvertures indépendantes et fichiers PNG réels, puis contrôle de fraîcheur de l’audit. Cette suite est requise par le prébuild.
- Les tests contrôlent les deux camps, les soins/protections, les coûts après confirmation, les portées, l'interruption, l'impact unique, la pause, la destruction du moteur et la récompense après la vraie fin du match.
- Le contrôle visuel a aussi permis de corriger les héros utilisés comme adversaires dans Smash/RPG : leur ID source et leur univers sélectionnent le sprite du héros, en conservant les statistiques, l'état et l'orientation de combat. Les monstres gardent leur représentation existante. Le super Omnislash a été revérifié avec le clavier L, jauge 100 → 0, impact après `hitAt` et PV stables ensuite. Le seul échec réseau observé sur ce parcours est le chargement d'une police Google Fonts par le proxy ; aucune erreur JavaScript locale.
- Chromium/Playwright : montage des vrais composants `GameCanvas` et `FighterMode` dans un contexte isolé, avec jauges et PV préparés pour atteindre les nouveaux parcours. Invocation FFVII par bouton, annulation, raccourci U, confirmation, pause, impact, retour et interdiction d'un deuxième appel : réussis, sans erreur JavaScript. Intro Fighter, KO de première manche, résultat intermédiaire, deuxième manche, finale, victoire, sortie et callback unique : réussis, sans erreur JavaScript. Cela ne constitue pas une recette de chaque personnage ni de toute la progression de campagne.
- `npm run lint` et `git diff --check` : réussis.
- `npm run build` : réussi avec le prébuild complet, toutes ses suites et tous ses audits, puis compilation Vite. La validation du complément est consignée dans le [rapport de livraison](../combat-completion-2026-10-18/README.md). L'avertissement existant sur les chunks de plus de 1 Mo reste présent ; aucun découpage des bundles n'est revendiqué dans ce lot.

### Réparation locale des entrées de validation

Les premiers contrôles ont détecté des pointeurs Git LFS au lieu des masters PNG. Les **500 images originales**, déjà présentes dans le cache LFS local, ont été matérialisées uniquement sur les chemins explicitement référencés et après contrôle de leurs empreintes, tailles et dimensions. Aucun téléchargement, changement de configuration, nouveau visuel, registre ou fichier de provenance n'a été nécessaire. Git ne détecte aucune modification logique de ces assets.

Le contrat de progression qui cherchait littéralement `meterCost: 100` dans Fighter a été adapté au catalogue partagé : il contrôle désormais le branchement et la consommation de la jauge, ainsi que le coût de 100 de chaque super des 1 911 héros. Les exigences de garde et de combo restent vérifiées.

### Vérification du complément

Les 15 tests de couverture contrôlent les baselines exactes de 1 089 et 191 identifiants, leur union de 1 280, les 1 911 supers, les 82 appelants et 28 PNG réels (112 poses). Les empreintes des huit archives natives, dont une tentative rejetée, sont vérifiées. Les 10 tests RPG ajoutés contrôlent l'identité effective affichée et exécutée, les dégâts et soins des deux camps, les soutiens et l’approche mêlée. Les 25 tests de décor contrôlent notamment les 255 anciens manques et les 525 univers complets.

Dans Chromium, les 28 entités chargent et rendent chacune leurs quatre poses des deux côtés du combat : 56 scènes et 224 affichages, orientation et pause contrôlées, sans erreur JavaScript. Le parcours réel GameCanvas confirme l'affichage d'Ifrit depuis sa propre planche PNG ; le parcours Fighter conserve ses deux manches et son unique résultat final.
