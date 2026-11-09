# Lyra Hexwind — livraison wave6 du 23 octobre 2026

Les 15 CG sont exportées et leur reçu est gelé. Les 16 poses du nouvel atlas sont installées après revue indépendante ; la sélection du nouvel atlas et l’accès à l’ancien comme variante sont confiés à l’intégration centrale.

La référence effectivement vue est le portrait V2 sélectionné par `HEROES_DB` et `production.audiovisual`, SHA `ed446cb1fe7ca4694985c06a19866f78e522b3257f8f6c512d04665deb636940`. Il constitue l’autorité interne du personnage original et de l’univers Aetherion. L’ancien atlas divergent demeure intact. La fidélité est examinée sur les caractéristiques visibles de cette source ; une seule vue ne certifie ni les détails cachés ni une équivalence pixel à pixel.

## CG

- [Reçu des 15 CG](../../lyra-hexwind-wave6-2026-10-23.json), SHA `25d4154d1513aaa9b043ff7eb472ebea2609132d47b172461a4bb55673df1803` : 15 illustrations, 45 fichiers publics.
- [Revue indépendante des 15 natifs](lyra-hexwind-independent-review.json), SHA `8d938a874fd549ad239801bbfe8f5429162a043325999e964b2a06cdac1baaf9` : vues individuelles par `/root/cg_brann_wave6`, avec limites de source documentées.
- [Planche des 15 CG](../../screenshots/lyra-hexwind-wave6-2026-10-23.webp) et [provenance](../../screenshots/lyra-hexwind-wave6-2026-10-23.json), vues par le producteur.

Les décors et les compositions varient pour chaque scène ; CG02 représente le focus seul et CG03 un décor vide. Les familles Nexus, plage familiale, service, comique, alignement alternatif, genre alternatif, zombie non gore et premiers pas au même âge apparent sont identifiées dans le plan et le reçu. L’arme reste un focus arcanique issu de la source, porté à gauche, avec trois flacons à droite ; les corrections de latéralité, de nombre de flacons et de cadrage proviennent de nouvelles sorties ImageGen.

Les 27 sorties CG réussies comprennent 15 sélections et 12 essais remplacés conservés ; aucun refus. Les pixels RGB de 14 PNG exportés correspondent exactement à ceux des natifs. CG01, seule sortie de 1087 × 1447, subit uniquement une normalisation plein cadre au plus proche vers 1086 × 1448, sans recadrage. Les 45 empreintes et cette reproduction ont été contrôlées. Des éléments peuvent être naturellement masqués par un meuble ou les vêtements ; la revue ne prétend pas observer ces parties cachées.

## Atlas de 16 poses

- [Companion d’installation](../../lyra-hexwind-sprite-wave6-2026-10-23.json).
- [Audit public de l’installateur](../../../audits/lyra-hexwind-v2-reference-sprite-fidelity-wave6-2026-10-23.json).
- [Revue indépendante des 16 poses](lyra-hexwind-sprite-independent-review.json), SHA `f73094c5c4b4d62f29c9cad86becacf90c60d1c459750b063e8924dcb3f3e8e7`.
- [Comparaison source / ancien / nouveau](../../screenshots/lyra-hexwind-sprite-comparison-wave6-2026-10-23.webp) et [provenance](../../screenshots/lyra-hexwind-sprite-comparison-wave6-2026-10-23.json), vues par le producteur.

L’atlas public de 1024 × 1024 a l’empreinte `d70a36f9ffb390a0fece6c24a2399a692335688c0444a0101259bed50c23e944`. Il assemble 13 poses entières du second natif, deux poses entières de la vraie reprise 09/12 et une vraie reprise frontale de la pose 02. Les quatre sorties atlas réussies comprennent ces trois contributeurs et un premier atlas entièrement non retenu. Les prompts, natifs et étapes rejetées sont conservés. La pose 02 précédente a été rejetée lors de la revue indépendante pour ambiguïté du bras portant le focus ; sa nouvelle version a été réellement vue et acceptée.

Le conditionnement est limité à l’extraction de poses entières, au redimensionnement au plus proche et au placement transparent. Aucune peinture sémantique, recoloration, duplication de pose ou inversion miroir n’a été appliquée. L’entrée `sourceImage` de l’audit désigne le composite technique, et non un natif unique. Les 16 cellules finales ont été vues par le producteur et le réviseur indépendant ; la normalisation a été reproduite exactement. Garde minimale : 16 pixels ; ligne basse visible : 239 dans les 16 cellules.

La validation porte sur une interprétation référencée avec limites explicites de source ; `canonicalFidelityApproved` et `visualFidelityApproved` restent faux. Les changements de sélection et de variante dans les registres sont effectués uniquement par l’intégration centrale.
