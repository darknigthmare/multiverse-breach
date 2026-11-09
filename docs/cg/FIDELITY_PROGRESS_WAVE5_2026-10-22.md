# Fidélité visuelle et CG — vague 5 du 22 octobre 2026

Cette vague ajoute **75 nouvelles CG : cinq séries complètes de quinze** pour Jax Rook, Seraphine Meridius, Mara Veylan, Dr Celeste Ray et Nefra de la Balance. Chaque série suit le portrait individuel V2 actuellement sélectionné, avec quinze poses ou compositions et quinze décors distincts. Les thèmes spéciaux des exemples du pilote sont conservés : plage familiale, service, scène comique et variantes What If clairement identifiées. Les limites des sources et les détails hors champ restent consignés, sans certification automatique de fidélité parfaite 1:1.

**Six atlas ont été réellement redessinés** : Crash retrouve l’incarnation de Crash 4 (2020) ; les cinq personnages originaux retrouvent leurs portraits V2 actuels. Leurs 96 poses ont une revue visuelle indépendante documentée. Les anciens atlas et leurs empreintes restent intacts et accessibles en variantes dans le jeu. Les corrections comprennent des reprises ImageGen ciblées de mains, armes, étuis et balances ; aucun simple changement de couleur ou de format n’est présenté comme un redessin.

| Suivi | État vérifié |
| --- | ---: |
| CG courantes | 595 |
| Personnages avec des CG | 46 |
| Séries complètes applicables | 39 |
| Versions CG enregistrées | 689 |
| Médias CG enregistrés | 2 067 |
| Nouvelles CG / nouveaux médias dans cette vague | 75 / 225 |
| Anciens médias CG inchangés | 1 842 |
| Nouveaux atlas / poses revues | 6 / 96 |
| Emplacements du roster entier | 28 680 |
| N/A documentés, inchangés | 8 |
| Emplacements restant à produire | 28 077 |

L’[aperçu des cinq séries](screenshots/roster-wave5-overview-2026-10-22.webp) montre les nouvelles images intégrées. L’[index de la vague](reviews/wave5-2026-10-22/README.md) donne les sources individuelles, les quinze CG, les six comparaisons d’atlas et les revues. Les cinq portraits originaux constituent des autorités **internes** du projet ; une copie d’archive ou un usage d’équipement/décor du même portrait n’ajoute pas une source indépendante. Le décor Iron Tempest reste une référence d’univers uniquement. Les anciens atlas divergents sont conservés pour comparaison et ne qualifient pas l’identité actuelle.

Les nouvelles compositions ont reçu des corrections réelles lorsque la revue a constaté une pointe de lame ou un pan de manteau tronqués, une main ou un étui du mauvais côté, une arme doublée ou des silhouettes dans un décor prévu vide. Les essais remplacés restent conservés avec leurs prompts et leurs empreintes. Les aperçus et recadrages d’inspection sont des compositions techniques des images réelles ; ils ne remplacent aucune génération sémantique.

La production CG compte **96 sorties natives réussies**, dont **21 essais remplacés conservés** : les 75 images retenues sont toutes des générations réelles. Parmi les sources livrées, 73 conservent exactement les pixels RGB natifs ; Seraphine CG14 et Celeste CG08 ont seulement reçu un conditionnement nearest au ratio, sans recadrage. Les six atlas utilisent 20 sorties natives réussies, dont trois essais entièrement écartés conservés. Le nombre de sorties ne constitue pas un nombre d’illustrations livrées ; les atlas combinent des cellules entières et de vraies reprises générées, avec leur provenance.

Mistral a reçu une nouvelle tentative CG04, refusée en entrée par le service avec la catégorie communiquée dans le reçu. Aucune image n’a été produite pour ce créneau. Les refus historiques CG01/09/10 et les neuf autres emplacements non tentés restent distincts ; la CG01 ancienne encore éloignée n’est pas déclarée corrigée. Aucun refus n’est transformé en N/A et aucune scène d’un autre personnage ne remplace Mistral.

Le [classeur Excel courant](Multiverse_Breach_Fidelite_CG.xlsx) couvre **1 912 personnages, 525 univers et 28 680 emplacements**, avec **2 970 images incorporées et 11 694 liens locaux vérifiés**. Son [audit indépendant](Multiverse_Breach_Fidelite_CG.validation.json) retrouve les 595 images courantes, les 689 versions et les 1 912 sprites réellement sélectionnés. Les contrôles de fidélité demandent une décision manuelle ; un test privé vérifie la conservation de seize champs de revue sans ajouter ses données au fichier livré. Le [guide](EXCEL_FIDELITE.md) décrit les filtres et les colonnes.

La bible distingue **24 personnages avec des références d’identité externes inspectées** et **21 avec une autorité canon interne inspectée**. Elle suit **11 écarts majeurs de sprites encore ouverts, 13 corrections visuelles revues et une correction de placement des cellules**, ainsi que six refus historiques de correction d’atlas. Le portrait de Jax réutilisé pour l’équipement ou le décor reste une seule autorité ; le décor Iron Tempest de Mara reste limité à CG03. Le rapprochement des sept portraits V2 concernés et de leurs fichiers sources a aussi été vérifié par empreinte dans l’audit Excel.

Les **55 tests CG** et les **42 tests du pipeline PNG** passent. Les audits des atlas, les **5 520 chemins** du manifeste de disponibilité et la reproductibilité de la bible passent également. Le lint ciblé et la compilation Python passent. La construction Vite du code est réussie, avec l’avertissement existant sur la taille de certains bundles ; les médias publics ne sont pas recopiés dans cette construction de contrôle. Les vérifications runtime ont été exécutées par programme, sans nouvelle session de navigation interactive revendiquée.

L’[audit global CG](fidelity-delivery-wave5-2026-10-22.json), la [conservation historique](reviews/wave5-2026-10-22/historical-preservation-verification.json), les [sélections courantes des CG](reviews/wave5-2026-10-22/runtime-selection-independent-verification.json), les [sélections et variantes des atlas](reviews/wave5-2026-10-22/runtime-atlas-selection-independent-verification.json), la [revue sémantique du plan et de la bible](reviews/wave5-2026-10-22/fidelity-bible-plan-lookup-review.json) et les [contrôles finaux](reviews/wave5-2026-10-22/final-checks.json) sont disponibles. Les contrôles techniques vérifient les fichiers et les correspondances ; les décisions visuelles sont attribuées à leurs revues indépendantes.

Le roster complet reste en production : **28 077 emplacements** attendent encore leurs illustrations ou leurs références. Les nouveaux décors sont des compositions originales cohérentes avec chaque univers. Le [bilan](FIDELITY_PROGRESS_WAVE4_2026-10-20.md) et l’[audit](fidelity-delivery-wave4-2026-10-20.json) de la vague 4 restent figés ; le plan, la bible et le classeur gardent leurs noms stables avec les données courantes.
