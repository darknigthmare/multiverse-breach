# PR 6 — trente signatures de tir et de faisceau dans Fighter

Base inspectée : `0f49f2e6281ca7e939c1a6aee63d5e67a168f29b`.
Les costumes R12, les six signatures FFVII/VIII et les scènes restent conservés.

## Intégration, pas nouveau déblocage

Trente profils source existants, jusqu'ici génériques dans Fighter, utilisent
maintenant leurs portées et leurs nombres de contacts : 16 héros et 14 entrées
d'ennemis/boss dans dix univers. Aucun personnage supplémentaire ni nouveau
profil source n'est ajouté ; le registre source reste à 124 définitions.

- FFVII : Catastrophe (Barret), All Creation (Yuffie), W Machine Gun (Sweeper).
- FFVIII : Laser Eye (Quistis), No Mercy (Seifer), Desperado (Laguna), Quick Shot (Irvine).
- DBZ : Kamehameha (Goku et Perfect Cell), Final Flash (Vegeta), Special Beam Cannon (Piccolo).
- Half-Life : les deux profils Vortigaunt, Overwatch Rifle Burst, Gunship Pulse Cannon Burst et Strider Warp Cannon.
- Quake : Thunderbolt (Ranger) et railgun du Gladiator, avec sa portée minimale.
- Doom : les deux associations de chaingun Spider Mastermind.
- TF2 : Scout, Robot Scout et Robot Heavy.
- Star Wars : éclairs de Dooku et de Palpatine.
- Halo : Nornfang de Linda et beam rifle du Jackal Sniper.
- Aliens : fusil de Hicks, rafale de Hudson et smartgun de Vasquez.

La liste autorisée est explicite. Les données, descriptions, références et
limites sont celles des profils source existants : pas de nouvelle recherche
canonique revendiquée. Les ennemis sont exercés dans le moteur, pas ajoutés au
sélecteur de héros ni débloqués dans une sauvegarde.

## Règles jouées

Un seul adversaire actif confirmé ; les réservistes ne sont jamais victimes.
Coût de 100 engagé une fois, préparation native et récupération conservées.
Chaque impact revalide portée, hauteur, direction engagée, vie, identité, camp
et appartenance au roster. Les contacts perdus ne sont ni reportés ni redistribués.
Un passage derrière le lanceur ou hors de portée peut éviter des contacts.
Le railgun conserve aussi sa zone minimale de non-tir, au lancement et à l'impact.

La puissance native Fighter est répartie APRÈS ses défenses et son minimum de
dégâts : dix tirs ne multiplient pas ce minimum par dix. La pression de garde
est répartie ; seule la fin projette, pour ne pas expulser la cible au premier tir.
Les défenses et les PV restent dynamiques. Pause, gel d'impact, KO/résurrection,
remplacement aller-retour, changement de compétence, interruption, fin et
fermeture invalident ou suspendent les effets selon leurs règles existantes.

Ce sont des contacts de tir/faisceau directs ADAPTÉS, pas des projectiles à
trajectoire physique. Roquettes, grenades, plasma en vol, disques, invocations,
soins et protection Medic restent hors de cette liste. Pas de nouvelle pénétration
de garde, munition, transformation, dégâts de zone ou système élémentaire.

## Structure et interface

Le planificateur déjà installé par EngineFighter porte la nouvelle liste : aucun
second cycle de vie dupliqué, et aucune modification d'EngineFighter lui-même.
`getFighterContactDefinition` est le nouveau nom explicite ; l'ancien nom importé
par le moteur reste un alias de compatibilité. Le jeton conserve sa livraison
`melee` ou `ranged`. Les 39 anciennes signatures de contact sont préservées.

Le clavier, les boutons et l'IA passent par les conditions natives communes.
Le codex FR/EN décrit les contacts à distance, leurs portées en unités du jeu,
leurs limites et l'absence de certification visuelle. Le test historique qui
excluait Goku de toute mention Fighter vérifie désormais sa description à distance,
sans le présenter comme une technique rapprochée.

## Validation locale

- Six reproductions sur la base exacte des modules : six échecs, puis six succès.
- 112 tests nouveaux : les 30 identités sur les deux camps, budgets, portées,
  pause, vies, remplacements, interruptions, effets non admissibles et codex.
- Tous les groupes locaux `reauditFighter*.test.mjs` : 412/412, aucun ignoré/annulé.
- Lint ciblé : zéro erreur, zéro avertissement. Compilation Vite des sources
  réussie, avec les avertissements de taille de blocs préexistants.
- Six recettes Chromium ajoutées à la CI permanente : vrais FighterMode,
  clavier/boutons, FR/EN, 390/1280 pixels, les deux camps, refus hors portée,
  contacts ordonnés, pause, retraite native avant l'impact et stockage inchangé.

Les groupes se recouvrent. Le navigateur local refuse la navigation loopback
avec ERR_BLOCKED_BY_ADMINISTRATOR : aucun succès navigateur local revendiqué.
Le checkout local est partiel ; le moteur Fighter, les modules modifiés, les
profils source et les fichiers de base édités ont leurs blobs Git vérifiés,
mais tous les fichiers des autres moteurs/assets récents ne sont pas présents.
La validation complète appartient donc aux CI de la tête publiée, pas à ce rapport.

## Livraison et limites

Le CSV recense les trente adaptations par clé exacte, avec référence existante,
contact, portée et état. Les anciens classeurs restent conservés ; aucune
restauration du classeur perdu n'est revendiquée.

Cette passe ne certifie ni chorégraphie, ni nouvelles images, ni campagne complète,
ni appareil physique. Les invocations/projectiles physiques et les autres
adaptations restent à compléter. Le blocage historique du catalogue de dossiers
rift doit être contrôlé séparément ; aucun contrôle de build n'est supprimé ou
contourné par ce lot. Aucun merge, promotion, compte réel ou réglage administratif.
