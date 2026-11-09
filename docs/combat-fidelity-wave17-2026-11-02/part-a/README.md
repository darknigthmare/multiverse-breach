# Vague17 — lot A : aventures, plateforme et soutiens

Le lot contient **40 personnages**, **40 atlas de présentation native32** et **40 atlas de locomotion/action base16**, soit **80 PNG** et **1 920 poses retenues**. Chaque personnage possède48 images de pose distinctes après normalisation : huit séquences de présentation de quatre poses et quatre états ordinaires de quatre poses.

Les **31 nouveaux kits** rendent explicites **93 emplacements ordinaires manquants**. Les neuf kits déjà complets conservent leurs trois actions ordinaires. Les versions, rôles et révisions de leurs supers sont consignés dans le plan et les errata chronologiques.

La fidélité aux images, proportions, textures, minutages et règles exactes des jeux originaux reste **non certifiée** : `source1to1Verified:false`. Les nombres de couverture décrivent les fichiers effectivement produits et les poses retenues.

## Sources et corrections

Le [plan source initial](source-plan.json) et son [reçu SHA](source-plan-receipt.json) précèdent les premiers appels. Les corrections ultérieures gardent les premières intentions, les prompts réellement exécutés, les images retournées et les dessins exclus.

- **Jade,2003** : bandeau vert, pantalon bleu-vert et photographie informative ; la photo révèle une cible avec zéro dégât et zéro modification des statistiques. Daï-Jo et Gyrodisk restent ses attaques physiques propres.
- **Pey’j** : JetBoots et écrasement physique. La réparation du hovercraft conserve son rôle de mécanique.
- **Rayman Legends,2013** : poing chargé à courte portée, corps sans bras ni jambes. Les dessins réduits à un poing volant et les raccords ressemblant à des bras ont été exclus.
- **Rival Schools,1997** : Super Guts Bullet de Batsu, Super Cross Cutter de Kyosuke et Fire Senpuu-Kyaku de Hinata remplacent les premières séquences de combat ordinaires. Les noms sont attestés par les listes de mouvements ; les palettes et minutages adaptés restent non certifiés.
- **Tail Concerto,1998** : le manuel primaire est [archivé](research/tail-concerto-manual-0.pdf). Waffle utilise le vrai Police Robo crème et ses bras segmentés bruns ; sa bulle capture sans dégâts. Alicia conserve sa tenue rouge et or, son visage tan/orangé et ses gestes à mains vides. Cyan porte sa tenue rouge et or et garde son sabre cérémoniel au fourreau.
- **The Unknown,2022** : le [visuel officiel](research/metal-official-header.jpg) a servi à corriger le crâne rouge chauve, les trois yeux jaunes, le col sombre et Terminus. Les groupes où les lames se touchaient ou se dédoublaient sont exclus ; les séquences finales utilisent une vraie source à deux colonnes.
- **Paz** : crâne complet, cornes brisées, runes, yeux bleu-blanc au repos et feu lors de l’émission. Les versions au crâne absent à l’émission sont exclues. La description de sa forme est documentée par la référence de franchise indiquée ; une égalité visuelle officielle1:1 reste non vérifiée.
- **Jen, Enisi, Winston, Tabby, les guides et compagnons** : gestes de soutien compatibles avec leurs rôles. Les radios, tablettes ou autres accessoires non attestés apparus dans certains premiers dessins ont été retirés des groupes retenus.

## Importation et preuves

Les [62 appels réellement exécutés](generation-inventory.json) comprennent les40 demandes initiales et22 corrections. La dernière correction de teinte d’Alicia conserve les48 poses existantes et compte **zéro pose supplémentaire**. Les fichiers exclus demeurent disponibles dans `sources/` et dans les reçus associés.

L’importation conserve les pixels RGBA natifs dans les régions retenues, vérifie les frontières sans passage sur les pixels visibles, puis applique une mise à l’échelle uniforme par source, des marges transparentes et un assemblage par voisin le plus proche. Une séquence large associe deux rangées physiques de deux figures pour obtenir quatre poses complètes. Les silhouettes et équipements restent entiers.

Les fichiers de référence et le regroupement final sont décrits dans [generation-records.json](generation-records.json). Les deux provenances détaillées sont [native-provenance.json](native-provenance.json) et [base-provenance.json](base-provenance.json). La [revue des sources](visual-source-review-progress.json) distingue la lecture des vrais dessins et les corrections nécessaires.

Vérification reproductible :

```bash
node scripts/buildCombatCharacterAnimationsWave17PartA.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave17PartA.mjs --check
```

Le [bilan des contrôles](build-check-results.json) contient les résultats réellement exécutés et les SHA des journaux. Les ancres d’émission et de contact sont mesurées séparément sur les PNG publiés ; leur revue est conservée dans les fichiers d’ancrage du lot A.

Le module pur `src/game/combat/sourceBubbleCaptureWave17.js` et ses six tests définissent la capture non létale, son admissibilité explicite, sa pause, sa libération et ses nettoyages. Les preuves d’intégration des quatre moteurs sont produites par le chantier commun RPG de la vague17.
