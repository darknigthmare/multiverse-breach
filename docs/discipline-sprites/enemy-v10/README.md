# Machines de Discipline — v10

Ajout à la **PR #12** de trois visuels mécaniques statiques : le boss de chantier jaune, le robot pilote en pied et le robot dans son chasseur. Cette révision part du commit `0890b60c507543803cd11fa56fc2d4b5152e05aa`, qui contient les 369 sprites et les deux ennemis masqués v8/v9.

## Visuels livrés et références

| Visuel | PNG natif | Preuves disponibles | Parties interprétées |
| --- | --- | --- | --- |
| Boss mécanique jaune | [Version transparente](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/yellow-construction-mech--construction-reference-v10.png), 1254 × 1254 | [Vue frontale](references/construction-mech-front.png) et [vue en plongée](references/construction-mech-overhead.png) | Quatrième jambe, surfaces arrière, dessous et transposition en trois quarts |
| Robot pilote en pied | [Version en pied](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/yellow-pilot-robot--full-body-reference-v10.png), 1024 × 1536 | [Capture du cockpit](references/robot-cockpit-user-frame.png) pour la tête, le cou, le plastron et les épaules | Mains, bassin, jambes et pieds |
| Pilote avec chasseur | [Version avec avion](../../../public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/yellow-pilot-robot--fighter-cockpit-adaptation-v10.png), 1536 × 1024 | La même capture pour le pilote, son siège, l’arceau et le rebord du cockpit | Toute la silhouette extérieure : nez, ailes, dérive, entrées d’air et proportions |

Le boss conserve son dessin accepté, ses quatre bras de grue à pinces, sa plateforme ouverte, son portique, sa cabine, ses pieds stabilisateurs et ses inscriptions japonaises. Le détourage a été demandé au générateur à partir du [rendu accepté sur fond blanc](previous-renders/construction-mech-white-background.png), lui-même réalisé à partir des deux captures. Le résultat est une nouvelle sortie générée ; il ne constitue pas une extraction identique pixel pour pixel.

Les deux variantes du robot ont fait l’objet d’une nouvelle passe à partir de la capture du cockpit et de leurs premiers rendus. Les instructions portent sur les détails visibles du pilote, la lisibilité des contours et la transparence. Les parties hors champ conservent leur première interprétation. Les [premier robot](previous-renders/robot-full-body-provisional.png) et [premier chasseur](previous-renders/robot-fighter-provisional.png) sont archivés séparément et exclus du total des sprites du catalogue.

## Épisode et fidélité

**L’utilisateur identifie la source comme _Discipline: The Hentai Academy_, épisode 4. Le fichier vidéo n’a pas été obtenu ni visionné. Aucune nouvelle screencap n’a été extraite ou retrouvée pendant cette révision.** Les trois captures fournies restent les seules références visuelles originales des machines.

Le robot en pied et le boss sont classés comme rendus fondés sur références partielles. Le chasseur est classé **adaptation**, avec le badge **Reconstitution provisoire** : seul son cockpit est documenté. Aucun nom canonique individuel, timecode ni modèle mécanique n’est inventé. Aucune des trois images n’est certifiée intégralement **1:1**.

Le [bilan de recherche](source-research.md) décrit les sources consultées et les plans manquants. Pour corriger réellement les silhouettes, il faut une vue du robot debout ainsi que des vues de profil et de dessus de l’avion complet. Les surfaces arrière et inférieures du boss restent également à confirmer.

## Intégration

La galerie `/reviews/discipline/index.html` propose le filtre **Machines · v10**. Les fiches donnent accès aux captures et aux limites de chaque reconstruction. Les trois images sont enregistrées comme des frames complètes **1 colonne × 1 ligne**, sans découpage en animation. Les proportions natives sont conservées, y compris le robot vertical et le chasseur horizontal.

Le catalogue et le manifeste passent à **372 sprites pour 40 identités graphiques**, dont **80 rendus fondés sur références et 292 adaptations**. Le boss représente une nouvelle identité ; les deux présentations du robot partagent la même identité. Les machines sont exclues de la couverture des six familles de tenues, qui conserve **38 identités et 212/228 cases**. Les ennemis humains v8/v9 restent inclus dans cette couverture.

Cette révision livre des assets et leurs fiches dans le catalogue graphique. Elle n’ajoute pas de combat de boss, de statistiques, d’IA, de hitbox, d’animation ou de personnage jouable. Les 369 entrées et PNG précédents sont conservés ; les rapports historiques restent des états de leurs révisions.

## Traçabilité et contrôles

- [Générations et références exactes](generation.json), [inventaire des sources et premières versions](source-files.json).
- Prompts : [détourage du boss](prompts/boss-alpha.txt), [robot](prompts/robot-refinement.txt), [chasseur](prompts/aircraft-refinement.txt).
- [Revue visuelle](visual-review.json), [validation technique et conservation](validation.json), [contrôle navigateur](browser-qa.json).
- Les PNG livrés sont les sorties natives du générateur intégré OpenAI, copiées sans retouche de pixels, recompression, redimensionnement ni modification de leur canal alpha. Les dimensions, empreintes SHA-256 et propriétés alpha sont consignées dans le manifeste.

Les résultats techniques sont ceux des rapports liés ; aucune exécution complète de la chaîne `prebuild` n’est revendiquée par le simple build Vite.
