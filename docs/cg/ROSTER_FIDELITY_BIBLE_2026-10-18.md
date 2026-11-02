# Référentiel de fidélité visuelle — mise à jour du 20 octobre 2026

Le [référentiel JSON](roster-fidelity-bible-2026-10-18.json) couvre les **1 912 sujets de 525 univers** et leurs **28 680 emplacements CG**. Il permet de préparer, comparer et suivre les images sans confondre une cible documentée, une proposition artistique et une image réellement fidèle.

Le builder est `node scripts/buildCgRosterFidelityBible.mjs`. Ajouter `--check` contrôle que le fichier généré correspond aux données courantes; `--summary` calcule la couverture sans modifier le JSON et `--inspect <characterId>` expose un sujet. Le référentiel est documentaire et n’est pas importé par le jeu. Le plan et la Bible utilisent le même lecteur de preuves, [`cgSourceEvidence.mjs`](../../scripts/cgSourceEvidence.mjs), sans dépendance circulaire.

La consolidation de la quatrième vague du 20 octobre reprend le plan courant : **520 CG produites, 8 emplacements N/A justifiés et 28 152 emplacements restant à produire**. Les 520 images comprennent les 83 CG publiées du pilote et 437 images du registre complémentaire. Le catalogue compte 41 personnages représentés, dont 34 séries complètes (les N/A documentés sont exclus du travail attendu). Les 25 sujets P0 historiques sont conservés. Une case documentée ou une proposition de pose n’est pas comptée comme une image livrée. Les noms de fichiers suffixés `2026-10-18` restent stables pour les liens, mais leurs données incluent cette consolidation du 20 octobre.

Les 38 briefs personnalisés déjà écrits mais non livrés sont repris avec pose, thème, décor et fichier d’origine : 13 pour Batman TDK, 12 pour Mistral et 13 pour Vador. Les résultats de génération bloqués ou non tentés restent distincts du statut de livraison; aucun de ces briefs n’ajoute une image au décompte.

## Origine des détails

- 337 héros disposent d’une description visuelle spécifique dans les données source du projet. Les 213 autres anciennes « ancres » qui ne répétaient que le nom et une consigne générique sont exclues de ce compte.
- 185 cibles individuelles ont été rédigées avec incarnation et critères concrets dans [les verrous rédigés](roster-fidelity-authored-locks-2026-10-18.json). Ces propositions historiques cèdent la priorité aux reçus qualifiés de sources; le choix Sonic moderne remplace explicitement l’ancienne proposition Classic1991.
- 196 périmètres d’univers précisent l’œuvre, la période et les mélanges à éviter. Ils ajoutent 703 propositions de périmètre de continuité sans prétendre résoudre la ressemblance des personnages.
- Les neuf personnages des trois univers OC supplémentaires utilisent leurs vrais `spritePrompt` rédigés dans le projet; ils ne sont pas réduits à leur classe ou leur couleur de gameplay.
- Les 1 912 personnages ont au moins un vrai visuel local du projet. Ces images servent de comparaison; elles ne sont pas des références officielles indépendantes.
- Vingt-quatre personnages ont une référence d’identité indépendante locale conservée et inspectée : Liquid Snake, Mistral, Kevin, Stuart, Bob, Kelly, Batman TDK, Vador, Doom Slayer, Sonic, Aloy, Dante, Chris Redfield, Luke, Harry, Batman New52, Stitch animé2002, Jack Sparrow2003, Raven2003, Starfire2003, Crash4, Spyro Reignited, Rayman Legends et Chell Portal2. La qualité varie; les vues de Kelly restent trop partielles pour certifier ses détails. Les sources sont officielles, sous licence ou des miroirs tiers explicitement identifiés; elles ne sont pas toutes des modèles complets.
- Les packs courants de Mirelle, Bastion, Nova, Marrow, Sable, Loom, Tessera, Quillon, Nadir, Elyra, Oryn, Neris, Kael et Eira, ainsi que les portraits V2 individuels d’Elara et Nyra, sont seize autorités internes du canon original. Les rôles `canonical-original-project-sprite-pack` et `canonical-original-project-portrait` les distinguent des sources externes et des anciennes images générées simplement comparatives. Les anciens designs Nova masculin et Marrow masqué ne remplacent pas leurs packs sélectionnés. Les crops techniques dérivés ne constituent aucune source indépendante supplémentaire.
- Le lecteur découvre 53 fichiers de preuve de source dans le dossier CG et ses sous-dossiers, couvrant 36 sujets. Les autres références historiques qualifiées restent traçables par leur propre provenance. Chaque référence conserve son rôle, sa portée et son éventuel emplacement CG.
- La référence Donald Duck concerne uniquement la tenue croisée de Saturnin CG13. Elle n’est pas comptée comme une référence d’identité ou d’anatomie de Saturnin; le caneton filmé ORTF reste sa cible.
- Sonic Riders CG13 et le costume Doom1993 CG13 sont également des références de tenue seulement. La figurine Luke EpisodeVI sous licence sert de support corps/tenue, sans devenir une tenue croisée CG13 ni remplacer les deux images film comme références du visage. Les captures DMC5 montrant Nero ou V restent des références de décor; les pistolets des références d’équipement.

## Incarnations

| Statut | Sujets |
| --- | ---: |
| Consignée dans les données source du projet | 604 |
| Canon original du projet | 84 |
| Identité Saturnin documentée par INA | 1 |
| Cible individuelle précise proposée | 173 |
| Périmètre d’univers proposé, incarnation à confirmer | 703 |
| Cible des CG pilotes publiées | 5 |
| Version précise encore ambiguë | 342 |

Les catégories sont exclusives. Les **342 incarnations encore ambiguës** restent signalées. Les **1 308 sujets** marqués `identity-or-visual-locks-incomplete` n’ont pas encore une description visuelle individuelle suffisamment détaillée; ils peuvent néanmoins avoir une œuvre ou une période proposée. Le référentiel ne certifie **aucune** fidélité parfaite 1:1.

## Corrections de cohérence intégrées

- L’Ancre possède un corps humanoïde, un visage masqué, une visière jaune et le gantelet cyan au **bras anatomique gauche**. Son CG02 porte sur ce vrai équipement.
- Chief reste en GEN3 de *Halo Infinite* avec MA40. Le vieux manifeste Halo3/MA5C reste un document historique, pas une cible actuelle.
- Mistral conserve la jambe anatomique droite rouge, la gauche noire, les plaques asymétriques et L’Étranger à deux lames fines. Le rendu promotionnel miroir effectivement consulté est distingué des captures Steam et du sprite généré. Ses lieux sont Sukhumi/Abkhazie; ni World Marshal Denver ni Mexique ne lui sont attribués.
- Liquid reste humain et torse nu dans le duel final MGS1998. Ceinture et bottes peuvent être isolées; ses poings ne sont pas une arme détachable, aucun FAMAS non attesté n’est attribué.
- True Ogre est la forme finale Tekken3, avec un seul grand bras-serpent au côté anatomique droit et une seule main griffue à gauche. Ce bras fait partie de son anatomie; CG02 est N/A. Hon-Maru du dossier partagé n’est pas le lieu de référence de cette incarnation.
- Saturnin est un **vrai caneton filmé**, pas une marionnette. Accessoires imaginés, scènes nouvelles et faits attestés sont distingués.
- Luke ROTJ, Vador ESB et Han ANH ont leurs périodes et lieux propres. Le décor Yavin du dossier partagé Star Wars n’est pas transféré à tous.
- Les cibles qualifiées de la seconde passe sont Doom Eternal2020, Sonic moderne SEGA, Aloy HZD2017 Nora Brave, Dante DMC5 humain2019 et Chris RE1original1996. Doom2016, SonicClassic1991, Aloy ForbiddenWest et Chris RE5/RE8 ne remplacent pas ces choix.
- Doomblade et FlameBelch restent à gauche anatomique; Focus Aloy à droite; fourreau et patch Chris à gauche. Dante conserve chemise bleu-gris et bottes à plusieurs larges bandes croisées réellement visibles dans le rendu source.
- Les avatars musicaux originaux du projet conservent leur identité propre. Une entrée dans l’univers musical Michael Jackson ne les convertit pas en portrait historique de l’artiste.

## Contrôle visuel

Le classeur doit comparer source et production sur silhouette/proportions, anatomie et côté des membres, tête/visage, tenue/matières/palette, équipement et marques discriminantes. Une pose ou un décor nouveau ne dispense pas de cette comparaison. Les scènes de plage, de service et comiques sont du fan art; les inversions d’alignement, transformations et futurs hypothétiques portent une étiquette What If. Les anciennes images restent des variantes.

La [revue indépendante des séries](reviews/complete-2026-10-18/independent-series-review.json) examine 44 CG courantes de True Ogre, Saturnin et Liquid Snake. Neuf nouvelles révisions ont résolu dix constats historiques, dont les inversions des bras de True Ogre et les tenues iconiques de Jin et Donald. Aucun défaut majeur ne reste ouvert dans ce périmètre. Les bitmaps source historiques True Ogre Tekken3 et Saturnin ORTF n’ont pas pu être inspectés : cette revue ne certifie donc pas leur fidélité originale parfaite.

Les variantes de sprites sont conservées dans `localVisuals` avec leur sélection réelle. Les dix héros du registre de variantes (Mistral, True Ogre, Dante, Doom Slayer, Chris, Elyra, Liquid Snake, Saturnin, Elara et Nyra) exposent aussi leurs anciens atlas dans le sélecteur du Hub, avec le courant en premier. Liquid et Saturnin n’ont pas reçu de nouveau bitmap dans cette passe. Le [contrôle du sprite True Ogre](../audits/true-ogre-reference-sprite-fidelity-2026-10-18.json) documente seize nouvelles frames distinctes, les bons côtés anatomiques et une garde visible d’au moins 23 pixels par cellule. Les textures et l’animation restent des créations du projet, sans certification du modèle Namco original.


## Seconde passe et limites restantes

Les huit séries de Doom Slayer, Sonic, Bastion, Aloy, Dante, Chris, Nova et Marrow ajoutent **120 CG réelles**. La [revue d’intégrité](reviews/wave2-2026-10-18/delivery-integrity-review.json) contrôle leurs 360 fichiers : 107 sources ont les pixels natifs directs et 13 utilisent le conditionnement exact 3:4 autorisé. Les natifs sont conservés; aucune ressemblance parfaite ne résulte de ce contrôle technique. Nova distingue notamment huit réencodages sans resize et sept ajustements de format, tous comparés au résultat déclaré.

Les [revues Aloy](reviews/wave2-2026-10-18/aloy-independent-review.json), [Chris](reviews/wave2-2026-10-18/chris-redfield-independent-review.json) et [Nova](reviews/wave2-2026-10-18/nova-vey-independent-review.json) contiennent les constats par CG, les reprises acceptées, les limites de source et la vérification des 45 exports de chaque série. Les huit séries ont leurs revues indépendantes propres. Les poses et les décors effectivement obtenus priment sur les intentions initiales.

Les cinq corrections visuelles suivies à l’issue de la seconde passe sont liées à leurs audits réels : Mistral, True Ogre, Dante, Doom Slayer et Chris, soit 80 cases examinées. La quatrième passe ajoute Elara et Nyra, portant le total courant à sept atlas corrigés visuellement et audités. La Bible n’attribue cette correction qu’au fichier courant dont le chemin et le SHA correspondent à l’audit. Les anciennes versions restent dans `localVisuals` avec leur sélection effective. Le modèle original Tekken3 reste visuellement inaccessible : la correction de latéralité True Ogre n’est pas une preuve d’équivalence au modèle Namco.

La [planche avant/après](reviews/wave2-2026-10-18/sprite-before-after.webp) compare trois vraies sources, trois anciennes frame0 et trois frame0 courantes. Sa [contre-vérification](reviews/wave2-2026-10-18/sprite-before-after-independent-review.json) confirme les dix empreintes et les six extractions exactes; elle ne remplace pas les contrôles de seize cases.

L’[audit ciblé initial des sprites sélectionnés](reviews/wave2-2026-10-18/selected-roster-visual-priorities.json) porte sur 25 premières cases P0 et l’atlas Sonic. La [troisième vague](reviews/wave3-2026-10-20/selected-roster-visual-priorities.json) ajoute les comparaisons sources de Stitch, Raven et Starfire. La [quatrième vague](reviews/wave4-2026-10-20/selected-roster-visual-priorities.json) conserve ces onze écarts et ajoute la divergence d’incarnation Crash4. Les anciens écarts Elara/Nyra y sont explicitement historisés, avec leurs remplacements sélectionnés. Le bilan courant porte sur **douze sprites présentant un écart majeur encore ouvert** :

| Sprite sélectionné | Écart établi | État de correction |
| --- | --- | --- |
| Kevin, Stuart, Bob | Robots et fenêtres cyan à la place de Minions organiques jaunes | Trois demandes refusées en sortie, aucun nouvel atlas |
| Vador ESB | Casque rectangulaire à visière cyan et bâton-cristal | Une demande refusée en sortie, ancien conservé |
| Batman TDK | Cheveux/lunettes/parka au lieu du cowl et de l’armure2008 | Une demande refusée en sortie, ancien conservé |
| Luke ROTJ | Aventurier beige à lame bleue au lieu de la cible noire à lame verte | Une demande refusée en sortie après qualification du support de costume |
| Harry OotP | Manteau bleu-or orné et compas inventés | Non tenté : chaussures, jambes complètes et baguette encore insuffisamment référencées |
| Batman New52 | Humain à cheveux/lunettes/parka et outil orange | Non tenté : couverture Endgame#35 partielle, abdomen/ceinture/bas masqués |
| Stitch terrestre animé2002 | Quatre bras, antenne et gilet spatial au lieu de la forme terrestre à deux bras ciblée | Atlas non tenté; trois CG de corps refusées, deux CG objet/décor livrées |
| Raven Teen Titans2003 | Tenue de mage ornée violet/or et proportions différentes des feuilles WB | Atlas non tenté; refus de CG de corps distincts, cinq CG livrées |
| Starfire Teen Titans2003 | Long manteau/pantalon de mage ornés au lieu du haut/jupe/bottes violets de la série | Atlas non tenté; refus de CG de corps distincts, deux CG objet/décor livrées |
| Crash4 tenue de base2020 | Touffe/proportions plus compactes et cuffs/baskets différents des sources Activision de l’incarnation retenue | Atlas non tenté dans cette vague; quinze CG qualifiées séparément, aucun refus d’atlas inventé |

Les six refus d’atlas du service ne constituent ni des livraisons ni des N/A. Les fichiers historiques sont intacts. Harry et Batman New52 attendent une couverture de source suffisante; aucun atlas Stitch, Raven ou Starfire n’a été demandé dans cette passe. Leurs refus de CG de personnage sont consignés séparément. Aucune image actuelle trop éloignée n’est reclassée comme proche au seul motif qu’une véritable référence a été retrouvée.


## Troisième passe du 20 octobre

Les sept séries originales de Sable, Loom, Tessera, Quillon, Nadir, Elyra et Oryn ajoutent **105 CG**. Stitch, Jack Sparrow, Raven et Starfire apportent **11 CG partielles** (2, 2, 5 et 2), soit **116 nouvelles CG et 348 fichiers** pour cette passe. La [revue d’intégrité](reviews/wave3-2026-10-20/delivery-integrity-review.json) confirme 97 correspondances de pixels natifs directs et 19 conditionnements géométriques exacts autorisés. Neuf créneaux de ces quatre séries partielles ont été refusés et quarante restent non tentés; ils ne sont ni livrés ni N/A.

Les [revues Stitch](reviews/wave3-2026-10-20/stitch-independent-review.json), [Jack](reviews/wave3-2026-10-20/jack-sparrow-independent-review.json), [Loom](reviews/wave3-2026-10-20/loom-ivara-independent-review.json), [Nadir](reviews/wave3-2026-10-20/nadir-kest-independent-review.json), [Sable](reviews/wave3-2026-10-20/sable-orison-independent-review.json) et [Oryn](reviews/wave3-2026-10-20/oryn-xile-independent-review.json) documentent les natifs réellement inspectés, les reprises de cadrage/anatomie/thème, les poses obtenues, les limites et les exports. Les cinq autres sujets ont leurs revues indépendantes propres référencées dans le rapport d’intégrité. Une composition de travail rapprochée peut masquer une partie de l’équipement si cette occultation est explicitement décrite; elle ne devient pas une preuve de sa géométrie complète.

La forme terrestre de Stitch reste à deux bras, sans antennes ni gilet spatial. Le ukulélé s’appuie sur un concept Disney2002 et reste une étude Fan Art, sans affirmer qu’il reproduit un modèle final du film. Le compas de Jack provient des archives D23, mais sa photo n’établit pas avec précision le modèle du seul film2003 : il reste une étude d’équipement de franchise non certifiée. Les détails anatomiques de Raven et Starfire proviennent des feuilles WB2003, pas de leurs anciens sprites fantaisie.

Pour les personnages originaux, l’atlas sélectionné et le lore propre constituent l’autorité interne; les zooms dérivés du même atlas ne deviennent pas des sources indépendantes. Sable ne porte pas un monocle permanent : le cercle observé devant son visage appartient à la longue-vue tenue. Nadir conserve sa sonde sphérique câblée, Loom son drone médical vertical à deux pales et Oryn sa lame plate sombre bordée de corail, distincte de la lame cristalline de Marrow. Les variantes de genre, inversions morales, corruptions non sanglantes et futurs restent des compositions What If explicitement étiquetées; aucun âge inconnu n’est inventé.

L’atlas Elyra courant bénéficie d’une **correction de cadrage uniquement**. Le [reçu technique](../audits/elyra-frame-packing-2026-10-20.json), la [revue indépendante des seize cases](reviews/wave3-2026-10-20/elyra-frame-packing-independent-review.json) et le [reçu de promotion runtime](../audits/elyra-frame-packing-runtime-2026-10-20.json) séparent préparation, validation et sélection. Les mêmes dessins ont été redistribués et réduits uniformément en nearest (facteur0,7227414330218068), avec une garde de15 pixels, sans génération, dessin ou recoloration supplémentaire. L’ancien atlas reste une variante. Cette opération technique demeure distincte des corrections visuelles suivies; elle ne prouve aucune nouvelle ressemblance canonique.

La [recherche complémentaire de vues intégrales](reviews/wave3-2026-10-20/additional-fullbody-source-research.json) n’ajoute aucun bitmap qualifié pour Harry OotP ou Batman New52. Les liens découverts et les accès refusés sont consignés; leurs lacunes de source demeurent visibles.

## Quatrième passe du 20 octobre

Les neuf séries de Crash, Spyro, Rayman, Chell, Elara, Neris, Kael, Eira et Nyra ajoutent **135 CG et 405 médias**. L’[index des preuves](reviews/wave4-2026-10-20/README.md) relie leurs sources, quinze poses/décors/thèmes, natifs, reprises et contrôles. Les 135 sélections proviennent de 170 sorties natives réelles; les 35 essais hors sélection restent conservés. Aucun refus de génération n’est enregistré pour ces neuf séries.

La [revue technique globale](reviews/wave4-2026-10-20/global-cg-technical-review.json) distingue **122 correspondances de pixels natifs directs et 13 conditionnements nearest minimaux reproduits exactement**. Ce contrôle des fichiers ne certifie pas la fidélité visuelle. Les [revues Chell](reviews/wave4-2026-10-20/chell-independent-review.json), [Elara](reviews/wave4-2026-10-20/elara-voss-independent-review.json), [Neris](reviews/wave4-2026-10-20/neris-vale-independent-review.json) et [Nyra](reviews/wave4-2026-10-20/nyra-vale-independent-review.json) séparent les images réellement vues, les échecs rapportés par le producteur et les vérifications d’exports.

Crash cible le modèle de base *It’s About Time*2020, Spyro *Reignited Trilogy*2018, Rayman *Legends*2013 et Chell *Portal2*2011. Les quatre doigts de Crash/Rayman et l’anatomie quadrupède de Spyro ne sont pas remplacés par une règle humaine générique. Chell conserve son bandage au poignet anatomique droit; son CG02 porte sur les Long Fall Boots documentées. Les fausses références Portal Device du poisson d’avril2026 sont exclues. Rayman CG02 reste une vitrine de répliques vides explicitement What If, et non des parties corporelles canoniquement détachables.

Elara et Nyra utilisent leurs **vrais portraits V2 individuels actuellement référencés par le projet**. Elara conserve manteau bordeaux/or, rapière cyan à droite et pistolet laiton/cyan à gauche; la pointe hors cadrage du portrait reste une extrapolation déclarée. Nyra conserve cheveux turquoise longs à droite, tempe gauche rasée/implantée, long manteau noir/magenta/cyan et cyberdeck informatique, sans canon inventé. Neris, Kael et Eira utilisent leur propre atlas et lore individuel; aucun portrait V2 absent n’a été inventé.

Deux corrections visuelles d’atlas V2 sont installées : [Elara](../audits/elara-voss-v2-reference-sprite-fidelity-wave4-2026-10-20.json) et [Nyra](../audits/nyra-vale-v2-reference-sprite-fidelity-wave4-2026-10-20.json), chacune avec seize cadres revus et son ancien atlas accessible en variante. Les vraies corrections individuelles Elara09/13 et Nyra10 sont distinguées de l’assemblage et du dernier packing nearest commun. La [contrelecture canon de Nyra](reviews/wave4-2026-10-20/nyra-vale-sprite-canon-counterreview.json) couvre seulement la planche et cinq cellules ciblées; elle ne prétend pas être une seconde revue individuelle complète des seize cadres. Les audits et le choix runtime doivent correspondre au même chemin et au même SHA.

Le [contrôle de lookup des plans](reviews/wave4-2026-10-20/fidelity-bible-plan-lookup-review.json) vérifie les 135 cellules des neuf plans réels, avec leurs numéros et identifiants CG normalisés. Les poses et décors réellement livrés, dont le mécanisme essuyé de Neris15 et les trois vannes enchaînées d’Elara12, restent ceux des reçus courants. La couverture globale reste **342 incarnations ambiguës, 1 308 descriptions visuelles insuffisantes et zéro fidélité parfaite certifiée**.
