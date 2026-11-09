# Terrains Tactics W17

Quatre secteurs jouables portent le catalogue à **23 terrains verticaux**, dont **20 secteurs d’univers et trois arènes Nexus**. Les 19 définitions précédentes restent intactes. Chaque nouveau secteur possède sa géométrie, ses matières et son environnement propres à Tactics.

Le [plan antérieur au code](source-plan-before.json) fixe les œuvres et lieux retenus. Les références établissent le cadre ; la grille, les distances, les objectifs A.R.C.A. et les textures procédurales sont des adaptations de gameplay. Les cartes ne sont pas présentées comme des plans officiels certifiés à l’identique.

| Secteur | Source retenue | Situations jouables |
| --- | --- | --- |
| Île du phare | Beyond Good & Evil, 2003 | Escaliers de pierre vers deux terrasses, passerelle haute et débarcadère à Z−1. Deux repères occupent le même XY sur des supports différents ; la mer profonde reste impraticable. |
| Forêt des Ptizêtres | Rayman Legends, 2013, Teensies in Trouble | Grandes racines à Z3, détour supérieur en coude, ravin lent à Z−1,5 et rupture du raccourci haut. Tenir des postes à deux hauteurs nécessite les vraies pentes. |
| Galerie VDNH | Atomic Heart, 2023, jeu de base | Escalier large, balcon de pierre, fosse et trois surfaces au même XY : Z−1,5, Z0,75 et Z3. Les dalles basses imposent la hauteur libre réelle ; les piliers bloquent la vue. |
| Rainforest District | Zootopia, film de 2016 | Passerelle de canopée à Z3,5, chemin bas humide et bassin. Deux sorties proposent un trajet haut ou une voie basse praticable par une empreinte de deux cases sur deux. |

Ouvrir **Combat custom → TACTIQUE → TERRAIN TACTIQUE**. Le choix explicite affiche l’œuvre et l’objectif ; **Auto** sélectionne un secteur de l’univers disponible. Les autres moteurs conservent leurs propres niveaux. Le secteur de Rayman provient de *Legends* ; aucune Clairière des Fées de *Rayman 2* n’est substituée à cette version.

Cliquer une case ou utiliser les flèches permet de l’inspecter. Confirmer avec **Entrée** ou **ALLER / CIBLER CETTE CASE** lance le déplacement et dépense le coût réel. L’inspection, la coupe et le choix d’un étage ne dépensent aucun AP. Les rampes et escaliers coûtent deux AP ; le débarcadère de Hillys coûte 1,5 AP, et le ravin ou la boue ralentissent le passage. Après un déplacement, **ANNULER LA VISÉE / DÉPLACEMENT** revient au mouvement avec les AP restants.

Les surfaces superposées gardent des identifiants, volumes solides et hauteurs de coin distincts. Un pont n’autorise aucun passage vertical à travers son plancher. La coupe de vue et les touches `[` / `]` permettent d’inspecter les étages. La taille du personnage et son empreinte déterminent réellement l’accès sous une dalle ou dans un passage étroit.

## Matières adaptées au relief

Les dix nouveaux profils portent le total à **52 matières** et les quatre environnements à **20 biomes de rendu**. Herbe et pierre côtières, mousse et racines, pierre claire et caillebotis du VDNH, puis sol végétal et passerelles humides suivent chacun les lieux retenus.

Les détails sont projetés sur les vraies faces : dessus, flancs, marches et dessous des plateformes. La matière ne crée aucun accès supplémentaire. Le panneau affiche un libellé localisé, y compris pour les surfaces superposées, au lieu d’un identifiant de fichier. Les décors du phare, des racines, de la galerie et de la canopée sont dédiés à Tactics.

## Vérification disponible

Les [tests des cartes](../../scripts/tacticsUniverseWave17.test.mjs) couvrent accès aux objectifs, supports, eau, empreintes, hauteur libre et lignes de vue. Les [tests du vrai moteur](../../scripts/tacticsUniverseRuntimeWave17.test.mjs) parcourent aussi l’ascension depuis les quatre spawns, par tours normaux et budgets AP successifs, sans repositionner les unités. Les projections historiques vérifient l’union exacte avant les anciennes assertions et rejettent une carte inconnue, un ancien matériau modifié ou un biome manquant.

Le [parcours navigateur préliminaire](preliminary-20261102052122228/result.json) a lancé les quatre secteurs et deux contrôles historiques depuis Combat custom : **six lancements, 18 vérifications et dix captures réellement inspectées**. Il vérifie clic de case, confirmation clavier, AP, pause, coupe, zoom et commandes à 375px. La [revue des captures](preliminary-20261102052122228/visual-review.json) confirme notamment le phare visible et les libellés de matière localisés. Cette exécution reste préliminaire ; la validation finale de la vague requiert un nouveau passage après le gel global.

```bash
node --test --test-concurrency=1 scripts/tacticsUniverseWave17.test.mjs scripts/tacticsUniversePresentationWave17.test.mjs scripts/tacticsUniverseRoutingWave17.test.mjs scripts/tacticsUniverseRuntimeWave17.test.mjs
```

Les [preuves W16](../tactics-universes-2026-10-28/README.md), leurs cartes et leurs snapshots restent conservés. Les premiers essais W17 gardent leurs résultats et les corrections suivantes : accès de l’unité 2×2 sous la canopée, pont technique VDNH continu, phare dégagé du panneau d’initiative et propagation des libellés de matière.
