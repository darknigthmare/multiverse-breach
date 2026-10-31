# Mission 50106 — Prey (2022), Naru contre le Feral Predator (1719)

## Contenu livré

Cette mission **Tactics source-locked** est une sixième scène distincte. Elle
prolonge les missions 50101–50105 sans remplacer les 39 missions statiques,
les modes classiques, les données de héros ou les inventaires historiques.
La Naru déjà enregistrée dans l'univers dédié `Prey` (ID `naru_prey`) est requise ; Sarii reste son **compagnon de scène protégé**, aide à détourner l'attention du chasseur au marécage, sans devenir une unité combattante. Taabe est déjà mort dans le récit et aucun autre personnage
ne devient un équipier artificiel. Le boss n'est pas le Jungle Hunter de 1987
ni le City Hunter de 1990 : il s'agit du **Feral Predator de Prey (2022)**.

## Séquence native de jeu

1. Prendre la plante médicinale abaissant la température du corps.
2. Préparer le leurre avec le trappeur français survivant.
3. Tirer avec le pistolet à silex enseigné/donné par Raphaël et attirer
   le chasseur.
4. Lui dérober son masque de visée osseux.
5. Placer ce masque **face au marécage**, pointant les projectiles guidés.
6. Attirer le Feral Predator dans la vase où Naru a précédemment failli se noyer.
7. Faire retourner le projectile du **lance-projectiles** du chasseur dans
   sa propre tête par l'orientation du masque, pas par un canon à plasma.
8. Récupérer la preuve de la victoire.
9. Rejoindre le village de Naru et Sarii en sécurité.

**Règles contrôlées :** 9 commandes situées sur une grille 9×7 ;
48 tours maximum ; itinéraire contrôlé par le vrai moteur Tactics et les PA ;
pas de victoire par baisse de PV ni par absence d'ennemis génériques.
Les commandes exigent prérequis et cellule correspondante, le token du tour,
la présence de la même Naru vivante et la bonne édition du scénario.

La plante **diminue la signature thermique** : jusqu'au coup de feu,
les cases de pression liées au repérage thermique sont neutralisées.
Le coup de feu révèle une activité par le son, mais **ne dissipe pas
magiquement l'effet thermique de la plante**. La pression revient pour
représenter l'approche et la vision non thermique du Feral Predator.
Après son propre projectile retourné, la menace cesse définitivement.

Le masque doit réellement être placé **au-dessus et dans la même colonne
que le marécage** (cellule 6,2 vers cellule 6,4, coordonnées moteur 0-based).
L'état `maskAimTarget` est vérifié lors de l'action finale de redirection.
Modifier le masque ou viser une autre case empêche de terminer le duel.
Le masque ne tire pas de projectile : c'est l'arme du chasseur qui tire,
puis suit les pointeurs de son masque positionné au bord de la mare.

Le trophée `Feral Predator head` est une **preuve narrative** du dénouement :
il est affichable au cours de la scène, mais ne devient partie du rapport
de victoire qu'une fois la mission terminée au village. Il n'ajoute aucun
objet d'inventaire automatique et n'invente pas de statistique de combat.
Aucune migration de sauvegarde ni économie ne change.

## Sources et limites de fidélité

- [20th Century Studios — Prey (2022)](https://www.20thcenturystudios.com/movies/prey)
  : film, personnages, Comanches, époque et région générale, intervenants.
- [What to Watch — explication du dénouement](https://www.whattowatch.com/features/prey-ending-explained)
  : plante médicinale, chaleur, masque volé, piège et projectile retourné.
- [Prey (film 2022) — synopsis détaillé](https://en.wikipedia.org/wiki/Prey_%282022_film%29)
  : ordre des événements, trappeurs, Taabe, Sarii, Raphaël et retour au village.
  Source secondaire de continuité, à comparer au film avant approbation visuelle.

L'époque de l'histoire est **1719**. Ne pas lui attribuer les pistolets
modernes, Smart Disc du City Hunter, casque métallique du Jungle Hunter,
canon à plasma d'un film différent, équipements ultérieurs du Feral ou
guerre Yautja–Xenomorph crossover.

La grille, le découpage en 9 commandes, la disposition des plantes et
des arbres, les chiffres de dégâts et les tours ne sont **pas des captures
du montage du film**. Ce sont des adaptations de gameplay. Le fond Canvas
est un **schéma original**. La silhouette ennemie réutilise
`/sprites/generated/bosses/predator/feral-predator.png` : le jeu possède
ce PNG dans les assets de `Predator`, pas dans le dossier de boss `Prey`.
La mission fait le raccord **uniquement pour ce Feral**, en rendu **une
pose entière 1×1** plutôt qu'un recadrage erroné en 4×4. Le portrait,
les proportions, la version sans masque et les animations restent **à
valider** sur des captures du film. Ce raccord ne valide ni ne remplace
l'apparence officielle de 2022.


## Correctif du 31 octobre — continuité visuelle des objets (après QA)

Le moteur ne doit pas afficher **simultanément** le masque sur le sol,
celui placé au-dessus du marécage et le trophée final. La présentation
utilise maintenant `isSourceScenePropVisible` sur l'état effectif du
contrôleur, sans modifier les coordonnées ou les commandes de mission.

- La plante disparaît du sol une fois consommée.
- La présence du trappeur cesse après le coup de feu et le pistolet n'est
  présenté comme repère d'action qu'entre la préparation du leurre et le tir.
- Le masque osseux tombe après le tir, reste au sol jusqu'au ramassage,
  puis n'apparaît sur le dispositif de visée qu'après sa pose effective.
- La preuve de victoire n'apparaît qu'après l'impact du projectile
  retourné, puis disparaît de la grille dès sa récupération.
- Le marécage reste visible. **Sarii est présent dans la forêt**, puis son repère se rapproche du marécage lors de sa diversion scénarisée. La dernière case signale le **chemin vers le village**, pas un village placé dans le marais.

Le Feral utilise encore sa **pose bitmap existante à masque** : ce lot
**ne produit pas** une version sans masque certifiée 1:1. Le jeu affiche
explicitement `MASK OFF · VARIANT PENDING` durant cette phase et le
texte d'étape est contextualisé en français/anglais, afin de ne pas
faire passer l'ancien PNG pour une animation canonique nouvelle.
La fabrication de la version sans masque reste ouverte sous la tâche
`prey-2022-04` du backlog graphique.

Deux tests de bout en bout de `EngineTactics` valident désormais
l'apparition et la disparition de chaque repère à travers le trajet
manuel de Naru, l'absence de récompense avant le retour au village,
le respect des objets des cinq autres missions et l'absence de mutation
permanente des définitions.

## Le pistolet Raphael Adolini 1715 : ne pas inventer de passation

Le film *Prey* situe Naru dans une période qui **précède** *Predator 2*
(1990), où l'Ancien donne un pistolet gravé `Raphael Adolini 1715`
à Mike Harrigan. Les épisodes peuvent être liés visuellement et
narrativement par cette pièce. **Ils n'expliquent pas intégralement
dans ces deux missions le trajet du pistolet entre 1719 et 1990** :
ne pas créer un épisode fictif de récupération par le clan, ni transférer
un item par sauvegarde entre Naru et Harrigan. Il reste un objet
narratif de provenance partiellement ouverte à investiguer.

## État graphique / fidélité 1:1 non certifiée

Le [registre des créations Prey](../assets/PREY_2022_SOURCE_SCENE_ART_BACKLOG_2026-10-31.json)
distingue explicitement des tâches ouvertes pour :
Naru / proportions & vêtements / hache reliée, Feral / masque osseux /
masque retiré / armement, plante, pistolet, marécage, village Comanche,
Sarii et animations du tir guidé. Aucune nouvelle pose, texture ni
capture PNG de l'adaptation n'est à considérer comme approuvée 1:1.

Les tests s'exécutent sur le vrai moteur au sein de
`scripts/reauditSourceScenes.test.mjs` et du prébuild CI :
mode manuel / auto, contrôle d'identité et de sauvegarde, reconnaissance
sonore après tir, masque mal aligné, invalidation de tour, histoire,
résumé, récompense unique, refus de victoire prématurée et refus de
superposition avec les précédentes scènes.

Le contrôle de production GitHub doit être **vert avant fusion**.

## Correctif de fidélité — Sarii et le véritable chemin du village

Une comparaison complémentaire aux descriptions du film a confirmé que Sarii
**aide Naru lors du duel final**, au lieu de rester au village. La carte
regroupe donc un chien compagnon noncombattant, une diversion scénarisée
au moment du leurre dans le marécage et une sortie de forêt orientée vers
le village. Les déplacements de Sarii sont des repères tactiques adaptés,
**pas** des positions film 1:1. Le `companionAid` de l'état et du rapport
final constitue une preuve de progression, sans modifier la base des héros
ou créer d'attaque magique et de récompense non canon.

Sources comparées :
[Radio Times — finale avec Sarii](https://c01.purpledshub.com/radiotimes/rss_feed/prey-ending-explained/),
[Ready Steady Cut — Sarii aide Naru](https://readysteadycut.com/2022/08/06/prey-2022-ending-explained-hulu-film/).

La version 1:1 du corps, des proportions, de la robe, des animations et des
gestes du chien (tâche `prey-2022-09`) reste **ouverte**. Le repère Canvas
est volontairement schématique et ne remplace pas une illustration approuvée.

