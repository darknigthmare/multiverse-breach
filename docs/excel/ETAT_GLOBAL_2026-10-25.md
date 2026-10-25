# État global du jeu — 25 octobre 2026

[Classeur global : Multiverse_Breach_Etat_Global.xlsx](./Multiverse_Breach_Etat_Global.xlsx)

## Objet et références

Inventaire transversal du jeu : fait dans le code, partiel, placeholder, manquant, non vérifié et bloqué. La présence d'une définition, d'un droit ou d'un PNG ne certifie pas sa fidélité 1:1 ni son fonctionnement complet.

- Production/master contrôlé : `5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6`.
- Première tête de PR examinée : `73a3088adcd87199aab35065754c3b95576d5ead` (R11).
- Tête finale examinée : `55b1e0545ac1971deeeb2f83c719160805e3c7bb` (R12 + Wave 6). Les deux commits arrivés pendant l'audit ont été pris en compte.
- PR nº 6 : `codex/audit-fidelite-excels-2026-10-24`.
- `https://multiverse-breach.vercel.app/build-info.json` a renvoyé le SHA de master et HTTP 200. Production READY, distincte des aperçus de PR.

## Contenu du classeur

7 onglets : Inventaire, Compteurs, Univers, Versions, Recette, Sources et Synthese.

144 points de suivi : **60 Fait-code, 61 Partiel, 9 Placeholder, 3 Manquant, 11 Non vérifié, 0 Bloqué** au périmètre et à la date du relevé. Les échecs historiques restent détaillés dans Recette. Zéro blocage confirmé sur cette nouvelle tête ne signifie pas que le build a réussi : sa validation est classée Non vérifié.

43 compteurs contextualisés ; index des 525 univers ; 14 lignes de recette. Le volume des lots étant très différent, **ces nombres ne constituent pas un pourcentage d'achèvement**. Les deux XLSX spécialisés R1 sont conservés. Le registre spécialisé R12 indique que son binaire n'est pas publié ; ce nouveau global ne se fait pas passer pour ce registre ou pour l'ancien catalog_lore_UPDATED non retrouvé.

## Mesures et périmètres

627 fichiers du snapshot de master vérifiés par empreinte Git, sans divergence. Recompte Node des modules de master : 4 936 entrées acteurs (1 912 héros avec l'Ancre, 1 518 monstres, 1 110 boss, 396 world bosses), 525 univers, 1 587 équipements, 2 628 objets de combat et 525 entrées événementielles. Ne pas additionner ces familles comme des objets uniques.

3 203 définitions de stages sur master ; 3 206 avec les trois scènes de PR. Ce ne sont pas 3 206 niveaux originaux parcourus manuellement. Les 3 199 dossiers illustratifs utilisent 41 arcs, contre leurs 45 phases à l'exécution : l'écart n'est pas quatre niveaux absents. Sont aussi distingués les 1 912 arcs personnels, 16 fusions, 4 trios, 12 missions OC, 4 fins, 20 profils Smash, 14 profils tactiques master et 6 circuits.

## Actualisation R12 et Wave 6

Les rapports et le diff des deux derniers commits ont été lus. R12 déclare 143 designs officiels, 149 associations sur 45 identités, 19 953 droits et 530 routes. Il ajoute 26 définitions et 29 associations mais **aucun PNG, costume nouvellement équipable ou approbation artistique**. Les 30 703 tâches ouvertes sont le backlog acteur/fidélité, pas la charge totale du jeu. Les 22 P0 visuels, 1 477 rasters absents et 9 planches 1×1 sont des constats historiques conservés sans nouvelle inspection pixel exhaustive.

Wave 6 ajoute Seifer, Laguna, Zell, Irvine, Midgar Zolom et Sweeper dans le périmètre des signatures RPG/Smash ; pas de nouvelle adaptation Fighter/Tactics revendiquée. Le rapport porte les profils source de 118 à 124 et les supers mêlée profilés de 148 à 154. Les totaux par univers de l'onglet Univers restent explicitement ceux du recomptage master ; les deltas de PR sont dans Compteurs et Inventaire.

## Tests et déploiements

38 tests ciblés de sauvegarde/calendrier et d'export exécutés dans cette passe : 38 réussis. Aucun build complet ou parcours intégral du jeu n'est revendiqué ici.

Le run historique `40145884484` a échoué avec 940 réussites et 1 échec dans une suite de 941 tests : l'assertion imposait encore `Sulaco.*separate and unimplemented`. **Le commit Wave 6 corrige cette assertion** en contrôlant la scène séparée, son préalable et Ripley Aliens ; le code corrigé a été lu. Ce blocage historique ne doit donc plus être décrit comme un défaut non corrigé de la tête R12.

Le statut Vercel de `55b1e054` était `pending` lors du dernier contrôle. L'ancien aperçu `dpl_5gxqkbKkdgUuMXC3W5XZm4z8XNjZ` était ERROR, sans rendre la production indisponible. Le succès d'un nouveau build et sa recette restent à confirmer. Les 1 116 tests locaux rapportés par R12 et les 1 027 tests signatures rapportés par Wave 6 ne sont ni additionnés ni présentés comme des tests rejoués ici.

## Priorités de finition

Confirmer la CI et l'aperçu après correction ; résoudre les défauts visuels et ressources provisoires ; terminer les différences réelles entre personnages et univers ; valider campagnes, mobile, longues sessions, comptes/cloud et conflits de sauvegarde. Les critères de fin et preuves sont consignés par ligne dans Inventaire.

Aucune fusion et aucune promotion de production ne sont réalisées par cette publication documentaire.
