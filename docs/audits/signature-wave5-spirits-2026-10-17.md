# Vague 5 — spectres autonomes et six profils Resident Evil

Base exacte : `8778d8f545bec28b59bea0fea7201ee238c063a0`, PR #2, sans fusion.

## Invocations Wraithverge

Les deux porteurs existants, Parias et Traductus, libèrent quatre entités indépendantes dans RPG et Smash. Leur attribution reste explicite : aucun autre personnage ne reçoit ce pouvoir. Les spectres sortent du lanceur puis corrigent progressivement leur direction vers les cibles confirmées. Les dégâts passent par `applyDamage` uniquement à la collision, avec un quart du budget par spectre et un seul contact par entité.

Le monde reprend après la manifestation. Un unique marqueur de libération remplace les quatre appels de présentation : une réaction au coup reçue après le lancement ne peut pas être effacée par un marqueur ultérieur. Le panneau n'annonce plus quatre impacts réussis lors du déploiement. L'aperçu RPG garde la puissance conditionnelle et indique un minimum de zéro, car la collision peut ne jamais arriver.

Le mouvement relatif de la cible est intégré au balayage de collision. La rotation, la vitesse et la durée sont bornées ; un spectre expire au plus tard après 240 ticks actifs. Pause, attente de ciblage et pré-match suspendent les entités. Elles traversent les plateformes solides : elles ne réutilisent pas la collision matérielle du disque Predator.

Une cible perdue ne transfère pas ses contacts à un autre adversaire. Son KO observé dans le répartiteur est enregistré avant une éventuelle résurrection immédiate. Même principe pour le lanceur. Retrait, changement de camp, identité/action incompatible, fin de combat et démontage nettoient les groupes. Une interruption non mortelle après libération ne retire pas des entités déjà autonomes.

Un groupe par propriétaire ; plafond de seize groupes et quatre spectres par groupe. Les positions, cibles, doublons et budgets invalides sont refusés. Les entités ne sont ajoutées ni au roster des combattants ni aux sauvegardes ; elles ne donnent aucun ennemi vaincu supplémentaire. Les lectures et dessins n'avancent pas la simulation. Les traces visuelles sont désactivées lorsque les mouvements réduits sont demandés.

## Six nouveaux profils offensifs

| Entrée du catalogue | Capacité |
| --- | --- |
| T-Virus Zombie | Zombie Bite |
| Zombie Dog (Cerberus) | Cerberus Bite |
| Ceiling-Clinging Licker | Licker Tongue Lash |
| Hunter Beta | Hunter Claw Strike |
| Nemesis T-Type | Nemesis Tentacle Sweep |
| Mr. X T-00 Tyrant | Tyrant Hook Punch |

Identité, univers et ancienne action sont contrôlés. Pas de contamination, exécution instantanée, grappin, téléportation, transformation ou invulnérabilité ajoutée. Le libellé mixte Zombie Dog/Cerberus existant est conservé, sans assimiler toutes les origines canoniques. Les profils personnalisés et non-combattants ne sont pas écrasés.

## Sources et adaptations

Hexen : implémentation Raven conservée dans [p_pspr.c](https://github.com/chocolate-doom/chocolate-doom/blob/master/src/hexen/p_pspr.c), fonctions `A_CHolyAttack2`, `CHolySeekerMissile` et suivi des queues. Quatre spectres et poursuite sont documentés. Cibles fixes, contact unique, durée, vitesses, nettoyage au KO et absence de coût en mana sont des adaptations Nexus : pas un port exact des dégâts répétés, acquisition de nouvelles proies et règles de classe du jeu original.

Resident Evil : références Capcom de l'encyclopédie des créatures dans `signatureSourceWave5.js`, interview Capcom sur [Nemesis](https://blog.playstation.com/2020/05/14/nemesis-invades-resident-evil-resistance-in-new-update-live-now/) et manuel officiel [Tyrant](https://game.capcom.com/manual/resistance/en/ps4/page/3/7). Les références documentent la famille d'action ; elles ne transfèrent ni les systèmes du contrôleur Resistance ni l'ensemble des différences entre incarnations. Le profil Hunter reste la famille de griffes déjà indiquée dans le catalogue, pas une conversion de Beta vers Alpha.

**Aucune planche animée source, nouvelle créature avec modèle final ou chorégraphie certifiée 1:1 n'est fournie.** Les spectres sont dessinés procéduralement. Les sprites des combattants restent ceux du projet. Les règles de résistance et les boss à énigme restent autoritaires. Les écritures directes de PV tuant et ressuscitant une unité sans passage observable par le répartiteur restent hors du contrat KO immédiat.

## Validation et livraison

`node --test scripts/signatureSpiritSwarm.test.mjs` : 50 tests unitaires passent localement. Les tests Vite des vrais moteurs, la matrice des capacités et les huit nouvelles recettes Chromium sont intégrés à la CI permanente en lecture seule, sans retirer les suites précédentes. Les résultats à citer sont ceux du commit final dans les artefacts GitHub, pas une extrapolation du local.

Les recettes emploient la vraie page QA GameCanvas : Parias et Traductus dans les deux modes, Nemesis et Hunter RPG, Licker et Tyrant Smash, FR/EN, 390/1280 pixels. Elles vérifient coût, absence de dégâts à la libération, pause, contacts, nettoyage et commandes réelles. États initiaux synthétiques ; ni campagne entière ni téléphone physique.

L'inventaire v6 ajoute `sourceSummonAgent` et `autonomousSummonBindings`. Deux contrats améliorés ne sont pas recomptés comme deux nouveaux personnages. Le registre complet est recalculé par la CI. La copie locale est partielle ; aucune compilation complète ni navigation locale du jeu n'est revendiquée. Aucun compte réel, paramètre cloud, secret, quota ou production modifié.

La première CI a détecté deux échecs de matrice Wraithverge (trois contacts au lieu de quatre). Deux nouveaux tests unitaires ont reproduit une orbite stable à courte distance après déplacement de la cible. La vitesse décroît maintenant à proximité, sans augmenter la rotation maximale, supprimer la durée limite ou remplacer une cible. Les 50 tests unitaires passent après correction ; les assertions de quatre contacts sont conservées.
