# Fidélité visuelle et CG — vague 4 du 20 octobre 2026

Cette reprise livre **135 nouvelles CG pour neuf personnages** : Crash Bandicoot, Spyro, Rayman, Chell, Elara Voss, Neris Vale, Kael Venn, Eira Solenne et Nyra Vale. Chaque série possède quinze images acceptées après comparaison aux références individuelles, avec ses poses, ses décors et ses thèmes spéciaux. Les 135 CG sont intégrées au catalogue et possèdent 405 fichiers source/master/vignette vérifiés.

Deux atlas ont aussi été réellement redessinés d’après les portraits V2 actuellement sélectionnés : **Elara** retrouve manteau bordeaux/or, coiffure relevée, rapière droite et pistolet gauche ; **Nyra** retrouve cheveux turquoise asymétriques, tempe gauche implantée, long manteau noir/magenta et cyberdeck gauche. Leurs 32 poses ont été revues. Les anciens atlas restent intacts et accessibles en variantes. Les corrections comprennent de nouveaux dessins référencés et des reprises de poses par ImageGen.

| Suivi | État vérifié |
| --- | ---: |
| CG courantes | 520 |
| Personnages avec des CG | 41 |
| Séries complètes applicables | 34 |
| Versions enregistrées et conservées | 614 |
| Médias CG enregistrés à empreintes distinctes | 1 842 |
| Nouvelles CG dans cette vague | 135 |
| Anciens médias CG inchangés depuis la vague précédente | 1 437 |
| Emplacements du roster entier | 28 680 |
| Emplacements N/A documentés, inchangés | 8 |
| Emplacements restant à produire | 28 152 |

L’[aperçu global](screenshots/roster-wave4-overview-2026-10-20.webp) montre dix-huit miniatures réellement intégrées. L’[index des neuf séries](reviews/wave4-2026-10-20/README.md) donne les références, les quinze images de chaque personnage, les reçus, les avis indépendants et leurs limites. Comparaisons d’atlas : [Elara](screenshots/elara-voss-sprite-comparison-wave4-2026-10-20.webp) · [Nyra](screenshots/nyra-vale-sprite-comparison-wave4-2026-10-20.webp).

Les personnages des franchises suivent des incarnations précises : Crash 4 (2020), Spyro Reignited (2018), Rayman Legends (2013) et Chell Portal 2 (2011). Pour les personnages originaux, la référence individuelle du projet fait autorité : portrait V2 actuel pour Elara/Nyra, atlas sélectionné et dossier propre pour Neris/Kael/Eira. Aucune V2 inexistante n’a été inventée. Les recadrages d’inspection n’ajoutent pas de nouvelles sources indépendantes. Les variantes Fan Art et What If, y compris les adaptations d’équipement sans arme personnelle, sont explicitement classées.

Les 170 sorties natives CG comprennent 135 sélections et 35 essais conservés. Sur les sources livrées, 122 gardent exactement les pixels RGB natifs ; 13 conditionnements nearest minimes rétablissent le ratio 3:4 sans cadrage supprimé ni peinture manuelle. Les formats trop éloignés ont reçu une vraie reprise ImageGen. Les deux atlas comptent huit sorties ImageGen distinctes et trois essais non retenus, séparés des comptes CG. Aucun nouveau refus fournisseur dans cette vague ; les refus et créneaux non tentés antérieurs restent documentés.

L’[audit global des CG](fidelity-delivery-wave4-2026-10-20.json), la [conservation des anciennes images](reviews/wave4-2026-10-20/historical-preservation-verification.json) et le [contrôle indépendant des sélections dans le jeu](reviews/wave4-2026-10-20/runtime-selection-independent-verification.json) passent. Les 302 anciennes définitions hors pilote, les 94 révisions et les 1 437 médias antérieurs sont inchangés. Les 385 sélections antérieures sont conservées ; les 135 nouvelles correspondent exactement à leurs reçus. Les deux atlas corrigés sont sélectionnés dans les cinq contextes contrôlés et leurs prédécesseurs sont accessibles.

Les vérifications finales passent : 53 tests CG, 42 tests du pipeline PNG, audits des atlas et variantes, 5 520 chemins du manifeste de disponibilité, lint ciblé et compilation Vite sans recopie du dossier public. La compilation signale les avertissements connus de taille des paquets. La vérification des sélections est programmatique ; aucune nouvelle séance interactive du navigateur n’est revendiquée.

Le [classeur Excel courant](Multiverse_Breach_Fidelite_CG.xlsx) couvre les 1 912 personnages, 525 univers et 28 680 emplacements. Son [audit indépendant](Multiverse_Breach_Fidelite_CG.validation.json) confirme 520 CG, 614 versions, les 1 912 sprites sélectionnés, **2 859 images incorporées et 10 891 liens locaux valides**. Les 149 lignes de comparaison distinguent 24 personnages avec références externes d’identité et 16 autorités internes pour les créations originales. Les usages CG02/CG03 du portrait de Nyra sont des réutilisations du même bitmap, sans nouvelle identité ni source indépendante. Les copies et atlas historiques divergents ne qualifient pas l’identité courante.

La [preuve de conservation des saisies](Multiverse_Breach_Fidelite_CG.preservation-validation.json) confirme le test privé des seize champs et l’absence de valeurs de test dans le classeur livré. Aucune saisie manuelle préexistante n’était renseignée ; les empreintes avant/après restent identiques. Le [guide](EXCEL_FIDELITE.md), le [plan](roster-production-2026-10-18.md) et la [bible](ROSTER_FIDELITY_BIBLE_2026-10-18.md) sont actualisés. Douze écarts majeurs de sprites restent ouverts ; les dix-neuf créneaux CG historiquement refusés et six refus d’atlas restent documentés, sans nouvelle exception N/A.

Le roster complet reste en production : 28 152 emplacements attendent encore leurs images ou leurs références. Les petits détails cachés ou hors champ des sources restent interprétés, et les nouveaux décors sont des compositions cohérentes avec les univers, pas des captures officielles. Ni les empreintes ni les cases de suivi ne certifient automatiquement une fidélité parfaite 1:1.

Le [bilan de la vague 3](FIDELITY_PROGRESS_2026-10-20.md), son [audit à 385 CG](fidelity-delivery-2026-10-20.json) et le [rapport historique du 18 octobre](fidelity-delivery-2026-10-18.json) restent figés. Le plan, la bible et le classeur gardent leurs noms stables et reflètent désormais l’état courant.
