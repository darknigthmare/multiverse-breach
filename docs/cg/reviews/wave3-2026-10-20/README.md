# Livraison CG — vague 3 du 20 octobre 2026

**116 CG effectivement livrées, soit 348 fichiers**, réparties entre sept séries originales complètes et quatre séries de franchises partielles. Les scènes, poses et thèmes spéciaux ont été examinés dans les revues visuelles liées ci-dessous. Aucune fidélité parfaite 1:1 n’est certifiée automatiquement.

| Personnage | CG livrées | Reçu | Visuels | Revue séparée |
| --- | ---: | --- | --- | --- |
| Stitch | 2 / 15 | [Reçu](../../stitch-wave3-2026-10-20.json) | [Planche](../../screenshots/stitch-wave3-2026-10-20.webp) | [QA visuelle](stitch-independent-review.json) |
| Raven | 5 / 15 | [Reçu](../../raven-wave3-2026-10-20.json) | [Planche](../../screenshots/raven-wave3-2026-10-20.webp) | [QA visuelle](raven-independent-review.json) |
| Starfire | 2 / 15 | [Reçu](../../starfire-wave3-2026-10-20.json) | [Planche](starfire-delivered.webp) | [QA visuelle](starfire-independent-review.json) |
| Jack Sparrow | 2 / 15 | [Reçu](../../jack-sparrow-wave3-2026-10-20.json) | [Planche](jack-sparrow-delivered.webp) | [QA visuelle](jack-sparrow-independent-review.json) |
| Sable Orison | 15 / 15 | [Reçu](../../sable-orison-wave3-2026-10-20.json) | [Planche](../../screenshots/sable-orison-wave3-2026-10-20.webp) | [QA visuelle](sable-orison-independent-review.json) |
| Loom Ivara | 15 / 15 | [Reçu](../../loom-ivara-wave3-2026-10-20.json) | [Planche](../../screenshots/loom-ivara-wave3-2026-10-20.webp) | [QA visuelle](loom-ivara-independent-review.json) |
| Tessera Vale | 15 / 15 | [Reçu](../../tessera-vale-wave3-2026-10-20.json) | [Planche](tessera-vale-delivered.webp) | [QA visuelle](tessera-vale-independent-review.json) |
| Quillon Rusk | 15 / 15 | [Reçu](../../quillon-rusk-wave3-2026-10-20.json) | [Planche](../../screenshots/quillon-rusk-wave3-2026-10-20.webp) | [QA visuelle](quillon-rusk-independent-review.json) |
| Nadir Kest | 15 / 15 | [Reçu](../../nadir-kest-wave3-2026-10-20.json) | [Planche](nadir-kest-delivered.webp) | [QA visuelle](nadir-kest-independent-review.json) |
| Elyra Null | 15 / 15 | [Reçu](../../elyra-null-wave3-2026-10-20.json) | [Planche](elyra-null-delivered.webp) | [QA visuelle](elyra-null-independent-review.json) |
| Oryn Xile | 15 / 15 | [Reçu](../../oryn-xile-wave3-2026-10-20.json) | [Planche](oryn-xile-delivered.webp) | [QA visuelle](oryn-xile-independent-review.json) |

Le [contrôle technique final](delivery-integrity-review.json) vérifie les empreintes, dimensions, formats RGB opaques et le ratio 3:4 exact des PNG, masters WebP 1536×2048 et miniatures 384×512. **97 PNG** ont les mêmes pixels que leurs natifs acceptés après décodage ; **19 autres** reproduisent exactement un conditionnement nearest en plein cadre, avec une dérive de ratio native inférieure ou égale à 0,5 %. Les natifs d’origine restent conservés. Les fichiers WebP sont des dérivés avec compression, sans prétention d’égalité pixel à pixel avec les PNG.

Aucun doublon d’identifiant de pose/décor, de description de pose, de chemin, d’empreinte de fichier ou de pixels source n’a été détecté. L’unicité informatique complète la revue des images ; elle ne prouve pas à elle seule qu’une pose ou un visage est fidèle. 28 références explicites d’anciens natifs/essais ont aussi été vérifiées présentes, sans les compter comme CG supplémentaires.

Les quatre séries de franchises comptent **9 créneaux refusés par le générateur** et **40 créneaux non tentés**. Ces deux états restent séparés, sans N/A inventée. Stitch et Starfire n’ont ici que leur équipement et leur décor ; Jack a sa boussole et son décor. Leurs corps ne deviennent donc pas des corrections livrées. Raven possède cinq vraies CG, dont les corps acceptés sont documentés par sa revue. Le vieux sprite Stitch à quatre bras, antenne et harnais rouge reste un écart majeur contre la forme terrestre 2002 : aucune correction de cet atlas n’est déclarée livrée.

Stitch conserve une étude d’ukulélé tirée d’un **concept de production**, classée Fan Art et limitée à l’équipement ; l’image du remake 2025 est exclue. Les sources de tenues, objets et environnements des autres séries gardent également leur portée propre. Les sept nouveaux personnages Nexus suivent l’autorité canon interne du projet, distincte d’une référence externe de franchise.

Une opération séparée corrige le découpage de l’atlas Elyra existant : [reçu technique](../../../audits/elyra-frame-packing-2026-10-20.json), [QA indépendante de ses 16 frames](elyra-frame-packing-independent-review.json), [avant/après](elyra-frame-packing-before-after.webp) et [installation runtime](../../../audits/elyra-frame-packing-runtime-2026-10-20.json). Elle réorganise les pixels d’origine avec une réduction nearest commune, conserve l’ancien atlas en variante et n’utilise aucune nouvelle génération ImageGen. Elle ne crée donc aucune CG supplémentaire parmi les 116 nouvelles images. Le contrôle technique a reproduit le dérivé exact et vérifié sa sélection effective ; l’examen visuel des frames est attribué à Excel. Les limites de détail dues à la réduction et celles du dessin d’origine restent documentées.

Le contrôleur technique a produit les images Stitch et Loom. Leur **QA visuelle indépendante est celle de referentiel_canon**, citée dans les reçus : ce rapport technique n’est pas une seconde QA visuelle indépendante de sa propre création. Les registres du jeu et les anciens médias ne sont pas modifiés par ce contrôle. Les comptes globaux de la galerie et la conservation du pilote font l’objet du contrôle de livraison général du projet.
