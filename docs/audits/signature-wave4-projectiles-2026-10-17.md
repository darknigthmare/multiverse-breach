# Vague 4 — Predator, Halo et disque à trajectoire réelle

Base : `f56caa9246fbff035ce593151d950c8beee58019`, PR #2. Pas de fusion ni modification de production. Ce rapport décrit le code ; le statut final et les preuves par commit sont conservés dans la PR et les artefacts des deux CI.

## Contenu

Seize identités explicites : six héros et dix entrées ennemies/boss. Les 96 profils source des vagues précédentes, les capacités personnalisées et les non-combattants restent préservés.

- City Hunter dans Predator et Predator 2, plus l'entrée ennemie City Hunter Predator : Smart Disc.
- Berserker jouable et deux entrées ennemies ; Falconer ; Fugitive jouable et ennemi : lames de poignet, avec deux contacts adaptés.
- Assassin/Upgrade : canon de poignet. Feral : frappe au bouclier de poignet, pas de plasma caster ajouté.
- Arbiter : épée à énergie. Linda-058 : tir Nornfang. Grunt, Elite Minor et Jackal Sniper : pistolet plasma, fusil plasma et beam rifle.

Les références `signatureSourceWave4.js` sont des pages officielles Halo et des représentations sous licence NECA/Prime 1. Elles étayent l'équipement, pas les noms descriptifs des combos ni nos timings. La page Halo Campaign Evolved sert uniquement aux familles d'armes partagées ; aucune propriété exclusive à cette nouvelle version n'est transférée aux incarnations plus anciennes. Aucune nouvelle planche animée ou certification 1:1.

## Smart Disc en Smash

La préparation réserve la jauge une seule fois. Au lancement, le monde reprend : le disque devient une entité de combat locale. Il avance vers la direction initialement visée, peut manquer une cible qui se déplace, puis revient vers son propriétaire sans dégât de retour. Le RPG conserve un contact abstrait ; aucune physique de disque n'y est simulée.

La collision est balayée entre deux positions, avec le mouvement relatif de la cible, pour éviter de la traverser entre deux ticks. Un contact appelle le répartiteur natif de dégâts : pas de soustraction directe de PV. Les segments de plateformes solides peuvent intercepter l'aller avant l'adversaire ; les plateformes traversables ne le font pas. Le retour est inoffensif et n'utilise pas ces collisions de terrain. Ce n'est pas une collision volumétrique avec tous les murs/décors.

Une seule cible confirmée peut être touchée, une seule fois. Mort, retrait ou changement de camp de la cible ne transfère pas le coup à un nouvel arrivant. Une seule entité par lanceur ; limite globale de 32 et durée maximale de 150 ticks. Le retour suit le lanceur mobile, avec expiration de secours s'il s'éloigne indéfiniment.

La mort/retrait/changement de camp, d'identité ou d'action du propriétaire supprime le vol. Pause, attente de ciblage et pré-match suspendent le temps ; fin de combat et démontage nettoient les entités. Les callbacks réentrants ne doublent pas l'impact. Le rendu ne modifie pas le jeu et ne fait pas clignoter le projectile.

Les trois associations de disque partagent ces règles. La vitesse, le rayon de collision, la portée, le retour automatique et le budget de dégâts sont des adaptations Nexus : ni trajectoire exacte du film ni pilotage à distance de Predator: Hunting Grounds. Pas de transfert de cette arme à tous les Yautja.

## Interface

Le compteur de préparation ne présente plus le lancement du disque comme un coup réussi. Les libellés FR/EN indiquent que les dégâts exigent la collision. Après le lancement Smash, le voile cinématique est retiré pour laisser voir la trajectoire réelle. Les autres séquences et leur compteur restent inchangés.

## Vérifications

Nouveaux fichiers : `signatureReturningDisc.test.mjs` (27 tests unitaires) et `signatureWave4.test.mjs` (22 tests d'intégration et de rendu). La matrice historique parcourt aussi les 16 nouveaux profils dans deux moteurs et des deux côtés. Le test des 88 profils antérieurs reste exactement borné à leurs vagues, sans exiger que le catalogue cesse de grandir. Les assertions de dégâts et de consommation ne sont pas supprimées : les disques attendent simplement leur court trajet dans le scénario de proximité.

Quatre recettes Chromium supplémentaires emploient les véritables commandes de GameCanvas sur des états synthétiques : les trois City Hunters, dont P2, et une esquive préparée. Elles vérifient délai sans dégât, pause du vol, collision unique ou absence de collision, retour et démontage. Les recettes historiques restent exécutées. Aucun compte réel, service externe ou nouvelle entrée de debug de production.

Local : 573 tests sélectionnés avant la correction de libellé, puis 18/18 tests de vague 4 comprenant les trois contrôles de rendu supplémentaires ; lint sans erreur/avertissement. La copie locale est partielle et inclut une dépendance de vague 2 reconstruite pour les essais : seule la CI sur la tête publiée vérifie l'arbre réel du dépôt. Aucun succès de navigation locale du jeu complet n'est revendiqué.

Inventaire local indicatif : 112 profils source, 142 supers profilés, 26 invocations natives, 31 associations d'artefacts, trois associations de disque, 101 non-combattants, 4 656 entrées sans signature dédiée. La CI régénère ces comptes depuis le catalogue complet ; catégories recoupées, aucune approbation artistique.

## Correctif de KO immédiat

Après la première CI réussie, deux tests supplémentaires ont reproduit un défaut : sans lecture ni tick intermédiaire, ressusciter le lanceur juste après `applyDamage` conservait son projectile. La suppression intervient désormais dans le retour du répartiteur de dégâts, avant qu’un appelant puisse ressusciter le même objet. Un patient ennemi KO force aussi le disque à revenir : sa résurrection immédiate ne lui réattribue pas le coup. Quatre tests couvrent lanceur/cible avant et après la fermeture de la scène. Les annulations de scénario et dommages bloqués gardent leur comportement.

## Restant

Physique spécifique des autres projectiles, invocation avec agents autonomes, sprites/animations dédiés, déplacements et transformations complets, codex statique, suite du Medic, boss à énigme, campagne/tutoriel, appareils physiques et prébuild intégral des images restent ouverts. Ce lot est une extension de capacités et une mécanique de projectile, pas un jeu finalisé.
