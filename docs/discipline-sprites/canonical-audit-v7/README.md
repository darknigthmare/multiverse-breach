# Audit des costumes et de la fidélité — Discipline

**Résultat : la collection actuelle n’est pas démontrée exhaustive et aucun rendu n’est certifié comme reproduction intégrale 1:1. Des costumes documentés sont encore absents et des écarts d’apparence sont visibles sur des costumes présents.**

Audit du **28 octobre 2026**, sur les **367 sprites / 36 identités graphiques** publiés au commit `86cc83d87be39642c0b918cd61948fd584273ba8`. Cette révision ajoute les résultats de vérification ; elle ne corrige pas les pixels et n’ajoute aucun costume. L’intégralité des images, identifiants, objets du catalogue et du manifeste reste conservée. Le mot « fidélité » dans un ancien intitulé désigne une tentative de correction, pas une validation 1:1.

## Ce qui a réellement été vérifié

| Contrôle | Résultat | Portée |
| --- | ---: | --- |
| Entrées du catalogue classées | **367 / 367** | Provenance, personnage, tenue, versions, sources et limites enregistrées |
| PNG présents, empreinte conforme | **367 / 367** | Intégrité technique des fichiers, pas fidélité artistique |
| Rendus classés `reference` | **76** | Relation avec une référence ; ne signifie pas costume officiel complet |
| Rendus classés `adapted` | **291** | Créations et transpositions pour le projet |
| Comparaisons visuelles directes des références | **75 / 76** | Sources effectivement vues et comparées aux sprites |
| Ancienne source exacte non retrouvée | **1** | `yuuji:light-uniform`, fichier historique `yuuji_external.jpg` |
| Ensembles de versions de référence | **43** | Révisions regroupées ; nombre de costumes canoniques distincts non établi |
| Corrections supplémentaires d’un même costume | **53 PNG**, dans **47 groupes / 100 PNG** | Leur multiplication ne prouve pas de nouvelles tenues |
| Doublons binaires | **0** | Des versions visuellement proches peuvent néanmoins représenter le même costume |
| Certification du costume et du corps complets 1:1 | **0 / 367** | Aucune validation positive attribuée |
| Notices de médias et éditions documentées | **48**, avec **44 sources** | Jeux, OAV, livres et BD ; pas 48 histoires autonomes |

Les calculs figurent dans [summary.json](summary.json), [assets.json](assets.json), [revision-groups.json](revision-groups.json) et [input-ledger.json](input-ledger.json). La [matrice des 36 identités](characters.md) permet de vérifier les totaux personnage par personnage. Les [76 références](reference-inventory.md) et les [291 adaptations](adaptation-inventory.md) sont toutes listées.

La classification documentaire des 76 références donne **73 sources partielles ou limitées par la pose**, **une reconstruction mêlant VN et OVA** et **deux études issues de dessins monochromes en pied**. La source initiale manquante de Yuuji appartient à la première classe d’après les métadonnées historiques ; elle n’est pas comptée comme revue visuellement. Une illustration complète mais monochrome ne valide pas sa palette, et une pose d’action ne fournit pas les proportions d’un corps debout neutre.

Les **291 adaptations ne sont pas une preuve de couverture canonique**. Leur classement a été vérifié ; ce tour ne revendique pas 291 nouvelles comparaisons avec des costumes originaux. Les taux de couverture des familles « maid », « soins », « bataille » ou « latex » décrivent l’offre du projet. Ils ne mesurent pas la proportion des costumes réellement portés dans les œuvres.

## Périmètre des œuvres à couvrir

La [bibliographie détaillée](media.md) et son [registre structuré](media.json) identifient les œuvres, éditions, rééditions, apports de contenu et limites d’accès. Les références `Sxx` ci-dessous renvoient à cette bibliographie.

| Ensemble | Ce qui est établi | Conséquence pour les costumes |
| --- | --- | --- |
| **Jeu original, 2002** | Jeu Windows d’Active ; patch bonus 1.10 et démo distincte documentés. [S01] | Les portraits conservés ne remplacent pas l’examen des routes, scènes et galeries du jeu. |
| **EXCELLENT, 2006** | Édition enrichie : continuation absente de l’original et de ses mises à jour, annoncée par le développeur et sa boutique. [S02–S03] | Les ajouts doivent être recensés séparément avant de considérer le jeu comme couvert. |
| **LS, 2009** | Préquel PC avec Leona comme protagoniste ; titre et crédits propres. [S04–S05] | Ne pas fusionner automatiquement ses dessins avec ceux du jeu initial ou de Zero. |
| **Six OAV principales** | Six épisodes identifiés ; les DVD-PG 1–3 reprennent respectivement les paires d’épisodes 1–2, 3–4 et 5–6. [S18, S42–S44] | Les captures isolées disponibles ne constituent pas un relevé de garde-robe par épisode. |
| **Deux OAV Zero / 零, 2010** | Deux parties, codes éditeur WBR-040 et WBR-041. [S12–S13] | Ensemble distinct à inventorier ; le casting secondaire peut contenir d’autres identités. |
| **BD numériques en couleur** | Éditions commerciales créditées à Kururi Active chez TME Plus / e-Color Comic : familles DISCIPLINE et DISCIPLINE零. [S21–S23] | Publications attestées, mais aucun intérieur de volume examiné. Les compilations ne sont pas additionnées comme des costumes nouveaux. |
| **Fanbook officiel et roman** | Fanbook Mediax, ISBN 9784896139174 ; roman France Shoin, ISBN 9784829635018. [S10–S11] | Les illustrations intérieures et éventuels dessins exclusifs restent à examiner. |
| **DVD-PG, mobile, jeux dérivés et rééditions** | Plusieurs produits documentés, dont les familles Mahjong DX/DX2 ; niveau de preuve variable selon l’édition. [S06–S09, S24–S34, S37–S44] | Vérifier les éventuels ajouts et la réutilisation d’images avant de compter de nouvelles apparences. |

Aucune série télévisée autonome supplémentaire n’a été identifiée dans les sources examinées. « Série » peut désigner ici l’ensemble des OAV ; ce résultat de recherche ne prouve pas l’absence universelle d’une édition locale. Le registre évite aussi de compter les intégrales et rééditions comme de nouveaux épisodes.

**La branche BD existe.** Le catalogue Cmoa montre des découpages en 12 volumes, 6 volumes Complete et une intégrale en deux volumes (haut/bas) pour la branche principale, puis 4 volumes Zero ; une autre plateforme expose Zero Complete en deux parties. Ces éditions sont regroupées en deux familles documentaires, sans affirmer qu’elles sont identiques page à page. La qualification *film comic* est probable mais n’a pas été revérifiée sur une fiche individuelle stable. Un manga original séparément dessiné n’a pas été établi par une référence bibliographique distincte. [S21–S23]

Le rapport bibliographique a consulté des **métadonnées de publication**, pas les jeux complets, les huit épisodes, les volumes numériques ni les livres intérieurs. Les images du présent audit sont les références locales effectivement retrouvées, les captures fournies et des dessins publics partiels. Ces deux niveaux d’accès sont maintenus séparés.

## Costumes absents, références incomplètes et pistes à vérifier

Le registre [gaps.json](gaps.json) rassemble les manques historiques, les éléments oubliés du suivi central et les pistes nouvelles. Les statuts ci-dessous ne doivent pas être convertis en un nombre prétendument définitif de costumes manquants.

| Personnage / tenue | Preuve disponible | État réel du catalogue |
| --- | --- | --- |
| **Reina — robe de soirée asymétrique OVA** | Feuille nommée et capture couleur consignées dans les recherches v4/v5. | Aucun PNG livré pour cette tenue. Les deux tentatives refusées restent documentées ; aucun nouvel essai dans cet audit. |
| **Leona — robe de soirée OVA** | Feuille nommée monochrome avec silhouette. | Non rendue ; palette à confirmer. Sa robe noire et or `alternate` ne clôt pas cette entrée. |
| **Saori — tenue civile OVA avec jupe** | Dessin monochrome en pied documenté. | Non rendue ; distincte du short VN déjà présent. Couleur et référence isolée à compléter. |
| **Linda — ensemble western OVA** | Portrait avec visage, chapeau et partie du haut. | Costume complet non établi ; l’adaptation couvrante livrée ne valide ni sa coupe ni ses chaussures originales. |
| **Momone — infirmière originale OVA** | Design nommé enregistré dans l’inventaire des dessins de production. | Costume précis non reproduit. `nurse-v6` est une adaptation différente. |
| **Saki — tenue de bain du dessin nommé** | Aperçu 8 du registre settei v4, avec nom. | Design documenté, non livré ; absent de l’ancien suivi central des costumes en attente. |
| **Club de natation — membres non identifiés** | Aperçu 6 du registre settei v4. | Designs documentés puis exclus de la génération ; identités et nombre exact de costumes distincts non établis. |
| **Leona — costume noir VN / rouge OVA recherché** | Photo de figurine partiellement masquée et comparaison de couleurs issue d’une source secondaire. | Aucune reproduction complète acceptée. Les maillots brillants, combinaisons intégrales et robe `alternate` sont des entrées différentes. |
| **Madoka — déguisement de service / maid OVA** | Mention textuelle sur une fiche secondaire. | Piste à confirmer par un plan ou dessin original attribué. Les adaptations maid existantes ne prouvent pas ce déguisement précis. |
| **Linda, Momoe, Nanase et Yuuji — baseball** | Mentions de participation à ce sport. | Pistes textuelles seulement ; ni quatre costumes individuels ni leurs couleurs ne sont ainsi démontrés. |
| **Takurou — uniforme du VN** | Portrait ou mention ne montrant pas le costume complet. | La tenue orange OVA et l’uniforme adapté ne valident pas l’uniforme original du VN. |

Les preuves historiques se trouvent dans [reference-v4-research.json](../reference-v4-research.json), [reference-v5-research.json](../reference-v5-research.json) et la [recherche Leona](../leona-swimwear-style-research.md). La piste Madoka demeure explicitement secondaire : [fiche de personnages Tropedia](https://tropedia.fandom.com/wiki/Discipline:_The_Record_Of_A_Crusade/Characters).

**Miyuki Umezaki** reste absent du catalogue faute de référence habillée complète exploitable. **Aoyama et Akasaka** sont des noms présents dans la [distribution de Zero](https://www.animeka.com/animes/staff/id_8408.html), sans correspondance nominale établie dans les 36 identités. Ils ne sont pas attribués aux deux officières anonymes par simple ressemblance. **Masao**, protagoniste distinct de la démo d’après Active, reste une piste séparée à qualifier. [S01]

Les six rôles anonymes existants restent descriptifs. L’invitée à robe jaune n’est pas attribuée à Leona ou Kaori ; le garde n’est pas assimilé à Sudou. Akane, Kawahara, Linda, Maya et Saki n’ont actuellement **aucune tenue classée `reference`**, même si certaines adaptations utilisent une référence de visage. Voir les [problèmes d’attribution](attribution-issues.json).

## Écarts d’apparence constatés

La [revue visuelle complète](visual-review.md) présente une fiche pour chacune des 76 références. Chaque fiche sépare correspondances, différences visibles et parties impossibles à vérifier. Les [sources visuelles](visual-sources.json) sont identifiées par nom, empreinte et URL lorsqu’elle est disponible ; les originaux ne sont pas republiés.

| Exemple | Observation | Effet sur la demande 1:1 |
| --- | --- | --- |
| **Leona `alternate`** | Yeux bleus de la référence devenus violets ; rubans et boucles amplifiés ; bordures et panneaux dorés redessinés. | Écart direct de palette et d’apparence, même avant d’examiner les jambes hors cadre. |
| **Leona uniforme v4** | Palette et base du VN mêlées à la géométrie et aux chaussures d’un dessin OVA monochrome. | Assemblage de deux incarnations, sans correspondance à une source unique. |
| **Saori, Maiko et Yuuki — baseball** | Inscription sombre du maillot source absente des sprites comparés. | Détail vestimentaire visible omis. Le bas de plusieurs tenues reste aussi non établi. |
| **Maiko — uniforme** | Première version avec cheveux déployés en grand éventail ; v4 les rapproche du dos, mais visage et yeux restent redessinés. | Correction réelle de coiffure, sans garantie du corps ou du costume entier. |
| **Madoka — uniforme et tenue tactique** | Visage/chignons plus compacts ; panneaux et poches du gilet redessinés ; chaussures hors cadre dans les sources. | Différences observables et détails reconstruits à distinguer. |
| **Maiko — tenue tactique OVA** | Référence accroupie convertie en silhouette debout ; pantalon, longueur des jambes et chaussures reconstitués. | La source ne permet pas d’authentifier les proportions debout. |
| **Ruri — tenue tactique OVA** | Une coudière sombre est ajoutée à un bras dont le coude est nu dans la capture source. | Accessoire supplémentaire visible, distinct de la tenue montrée dans ce plan. |
| **Kumi — tenue sportive, deux versions** | Un petit GIF complémentaire montre un panneau de jupe diagonal à bord rouge, différent de la jupe à plis réguliers des sprites. | Écart du bas de tenue documenté ; la faible résolution ne permet pas pour autant de reconstruire tous les détails. |
| **Takurou — tenue orange OVA** | Source de 225 × 169 pixels limitée au haut du corps, malgré trois versions du sprite. | Les trois fichiers ne prouvent pas trois costumes ni une stature complète. |
| **Études monochromes v5** | Dessins en pied disponibles, mais contours, visage, plis et certaines proportions réinterprétés. | Meilleure étendue de référence, sans palette certifiée ni identité graphique exacte. |
| **Yuuji — uniforme clair initial** | Fichier source exact introuvable ; aucun hash ni URL historique dans cette entrée. | Comparaison initiale laissée non vérifiée. La référence v4 ne recrée pas sa provenance passée. |

Une différence de pose ne suffit pas à prouver une erreur anatomique. Elle empêche en revanche une superposition directe ; aucune longueur de membre, largeur d’épaule ou proportion tête/corps invisible n’a été inventée dans cet audit. Les estimations numériques présentes dans d’anciens rapports restent des estimations historiques, pas de nouvelles mesures validées ici.

## Pourquoi une couverture exhaustive ne peut pas être validée

Le registre historique décrit **12 photographies d’aperçu** d’un ensemble commercial annoncé comme contenant environ **84 feuilles de production**. L’archive complète n’a pas été inspectée. Une photo peut montrer plusieurs feuilles ; on ne soustrait donc pas 12 de 84 pour annoncer un nombre de dessins ou de costumes manquants. Les scans de vente renseignent des designs, sans établir une chaîne de provenance studio certifiée. [Registre v4](../reference-v4-research.json)

Il manque aussi un relevé par **édition, route ou galerie du jeu**, par **épisode et plan OVA**, et par **volume et page** pour les BD et livres. Les 38 premières entrées de référence ne contiennent pas d’empreinte de leur source dans le manifeste historique ; 31 prompts initiaux n’ont pas été conservés. Des sources ont été retrouvées pour la comparaison actuelle, mais leur récupération ne réécrit pas les entrées anciennes ni la preuve du premier appel. [Inventaire technique](assets.json)

Les 29 intitulés comprenant « fidélité » doivent être lus avec leurs limites. Vingt adaptations contiennent `reference` dans leur identifiant de correction : ce mot ne change pas leur provenance. Le comparateur existant présente surtout deux versions générées ; il ne constitue pas une preuve de superposition avec le dessin original. [Audit des formulations](labels-and-claims.json)

## Conditions de clôture pour chaque tenue

Une tenue ne devrait être marquée vérifiée qu’après rattachement à une **identité, un support, une édition et un emplacement précis**. La référence doit établir les traits du visage, la coiffure, la palette, la coupe, les accessoires et toutes les parties effectivement rendues. Les proportions ne peuvent être confirmées que sur des vues comparables, avec les zones masquées signalées. Un détail absent de la source reste une reconstruction, même lorsqu’il paraît plausible.

Pour clôturer l’ensemble de la demande, il faut également avoir terminé le recensement de chaque corpus identifié, regrouper les simples rééditions et révisions, puis revoir les écarts encore ouverts. **Ni une adaptation générique, ni une référence recadrée, ni un échec de génération ne doit fermer une ligne de costume original manquant.** Aucun pourcentage de « fidélité » n’est attribué sans méthode et sans dénominateur établis.

## Documents et validation

- [Inventaire des 367 sprites](assets.json), [matrice des personnages](characters.md) et [données d’identités](identities.json).
- [76 références](reference-inventory.md), [291 adaptations](adaptation-inventory.md) et [chaînes de révisions](revision-groups.json).
- [Comparaisons visuelles détaillées](visual-review.md), [résultats structurés](visual-review.json) et [sources](visual-sources.json).
- [Médias, éditions et sources bibliographiques](media.md), avec [48 notices structurées](media.json).
- [Manques, pistes et palettes à confirmer](gaps.json), [attributions](attribution-issues.json) et [formulations à interpréter](labels-and-claims.json).
- [Compteurs](summary.json), [empreintes des entrées](input-ledger.json) et [validation de publication](validation.json).

La validation de cette révision porte sur la cohérence des données, les liens internes, la couverture des identifiants, les empreintes et la conservation des fichiers publiés. Les tests et vérifications de jeu du lot v6 restent documentés dans leur propre rapport ; ils ne prouvent pas la fidélité canonique des dessins. La PR demeure ouverte, avec les écarts ci-dessus explicitement non résolus.
