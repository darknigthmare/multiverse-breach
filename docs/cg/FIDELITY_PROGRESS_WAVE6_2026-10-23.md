# Fidélité visuelle et CG — vague 6 du 23 octobre 2026

La [consigne commune](PROMPT_GLOBAL_ROSTER_1_1.txt) couvre tout le roster de Multiverse Breach : **1 912 personnages, 525 univers et 28 680 emplacements**. Son [manifeste complet](roster-global-batch-2026-10-23.json) relie chaque personnage à ses quinze créneaux, références, limites, thèmes, poses, décors et états réels. Elle permet de continuer tous les sujets sans redemander un prompt par personnage. Les appels d’image restent individuels ; le manifeste ne génère, n’installe ni ne certifie aucune illustration à lui seul.

Cette vague livre **75 nouvelles CG : cinq séries complètes de quinze** pour Brann Crow, Lyra Hexwind, Mercy Ash, Dr Mara Ell et Orin Vale. Chaque série suit le portrait V2 individuel actuellement sélectionné. Les poses ou compositions et les décors varient pour chaque CG ; l’équipement seul et le décor vide ont leur composition propre. Les thèmes imposés sont conservés, dont plage familiale, service, comédie, alignement alternatif, transformation, corruption et époque alternative. Les familles Fan Art, Nexus et What If restent explicites.

**Cinq atlas ont été réellement redessinés, soit 80 poses revues indépendamment.** Ils rétablissent notamment la barbe et la hache gauche de Brann, le focus gauche et les trois fioles droites de Lyra, la faucille à chaîne de Mercy, les lunettes cyan, la lampe gauche et le cristal de Mara, ainsi que le gantelet droit, le manteau et les accessoires d’Orin. Les corrections de mains, latéralité, armes et cadrages proviennent de vraies reprises ImageGen. L’extraction et le placement des cellules restent des traitements techniques distincts, sans peinture sémantique.

| Suivi | État vérifié |
| --- | ---: |
| CG courantes | 670 |
| Personnages avec des CG | 51 |
| Séries complètes applicables | 44 |
| Versions CG enregistrées | 764 |
| Médias CG enregistrés | 2 292 |
| Nouvelles CG / nouveaux médias dans cette vague | 75 / 225 |
| Anciens médias CG inchangés | 2 067 |
| Nouveaux atlas / poses revues | 5 / 80 |
| Emplacements du roster entier | 28 680 |
| N/A documentés, inchangés | 8 |
| Emplacements restant à produire | 28 002 |

L’[aperçu des cinq séries](screenshots/roster-wave6-overview-2026-10-23.webp) et l’[index de la vague](reviews/wave6-2026-10-23/README.md) donnent accès aux images, sources individuelles, comparaisons d’atlas et revues. Les cinq portraits sont des autorités **internes** pour des personnages originaux du projet. Les détails cachés par une vue unique restent interprétés et signalés ; une copie du portrait ou son usage comme appui d’équipement ne constitue pas une source indépendante supplémentaire. Aucune fidélité parfaite 1:1 n’est certifiée automatiquement.

Le [recomptage indépendant des générations](reviews/wave6-2026-10-23/generation-counts-independent-verification.json) retrouve **108 sorties CG natives réussies : 75 sélections et 33 essais remplacés conservés**. Les 225 médias ont leurs empreintes vérifiées. Parmi les 75 PNG sources livrés, **74 conservent exactement les pixels RGB natifs** ; seule Lyra CG01 reçoit un conditionnement plein cadre au ratio par nearest, reproduit exactement, sans recadrage. Les cinq atlas utilisent **21 sorties natives**, dont 12 contribuent aux 80 poses et neuf sont entièrement écartées et conservées. Une sortie native n’est pas un nombre de CG livrées.

La tentative de correction du sprite de Batman New52 a été réellement refusée en sortie, catégorie communiquée `other`, sans fichier produit. Le [reçu](batman-new52-sprite-wave6-2026-10-23.json) conserve cette tentative séparément des refus CG. Son ancien atlas reste inchangé ; aucun rendu substitutif n’est présenté comme une correction. La couverture du corps encore insuffisante de Batman New52, Harry et Jack reste explicite, même lorsque leurs traits visibles qualifient une référence d’identité.

La [bible courante](ROSTER_FIDELITY_BIBLE_2026-10-18.md) distingue **24 sujets avec références d’identité externes inspectées** et **26 avec autorité interne inspectée**. Elle suit **18 corrections visuelles revues, une correction technique de placement, 11 écarts majeurs encore ouverts et sept corrections d’atlas bloquées**. Le manifeste commun distingue les 20 créneaux CG refusés ou dont une correction a été refusée, les sept sujets bloqués pour l’atlas, les non-tentatives, les références manquantes et les huit N/A. Aucun refus n’est converti en N/A.

La [conservation historique](reviews/wave6-2026-10-23/historical-preservation-verification.json) vérifie les **2 067 anciens médias, 512 définitions hors pilote, 94 révisions et six rapports historiques** inchangés. Les [sélections CG](reviews/wave6-2026-10-23/runtime-selection-independent-verification.json) concordent avec les 75 nouveaux reçus. Les [sélections et variantes d’atlas](reviews/wave6-2026-10-23/runtime-atlas-selection-independent-verification.json) vérifient **21 corrections dans cinq contextes, soit 105 contrôles**, les cinq anciens atlas désormais accessibles en variantes et les **1 907 autres sélections inchangées**. Ces contrôles sont exécutés par programme ; aucune nouvelle session de navigation interactive n’est revendiquée.

Les **68 tests CG** et les **42 tests du pipeline PNG** passent, ainsi que les audits des atlas, les **5 520 chemins** de disponibilité et la reproductibilité de la bible. Le lint ciblé, la compilation Python et la construction Vite du code passent ; l’avertissement existant de taille des bundles est conservé et les médias publics ne sont pas recopiés dans cette construction de contrôle. L’[audit global des médias](fidelity-delivery-wave6-2026-10-23.json) porte un nom de sortie propre à cette vague pour conserver les rapports précédents.

Le [classeur Excel](Multiverse_Breach_Fidelite_CG.xlsx), son [guide](EXCEL_FIDELITE.md) et son [audit indépendant](Multiverse_Breach_Fidelite_CG.validation.json) suivent les données courantes avec la consigne commune et le manifeste complet. Le classeur contient **3 070 images incorporées et 12 499 liens locaux vérifiés**. L’audit retrouve les 670 CG, 764 versions, 1 912 sprites sélectionnés et douze portraits V2 exacts ; les deux liens d’entrée vers la consigne et le manifeste sont vérifiés. Les **4 718 fichiers d’entrée et 325 JSON documentaires ont été capturés avant la reconstruction**, puis contrôlés inchangés après celle-ci. Les champs de revue manuelle existants sont conservés ; le test privé des seize champs passe sans données synthétiques dans le classeur livré. La [preuve de conservation Excel](Multiverse_Breach_Fidelite_CG.preservation-validation.json) et les [contrôles finaux](reviews/wave6-2026-10-23/final-checks.json) consignent les résultats. Une vérification technique ne vaut pas une décision de ressemblance visuelle.

Le roster entier reste en production : **28 002 emplacements** attendent leurs illustrations ou leurs références. Le [bilan](FIDELITY_PROGRESS_WAVE5_2026-10-22.md) et l’[audit](fidelity-delivery-wave5-2026-10-22.json) de la vague 5 restent figés ; les noms stables du plan, de la bible et de l’Excel portent désormais les données courantes.
