# W13 — Partie A, 20 personnages

Cette partie couvre huit personnages d’Alien, six de Portal et six du Disque-monde. Les identités et versions ont été fixées dans la [sélection du lot](../batch-plan-before.json) avant génération. Les vingt personnages possèdent chacun une planche de **32 poses de présentation** et une base de **16 poses**, soit **640 + 320 = 960 dessins natifs retenus dans 40 PNG**. Une capture, une inversion ou un agrandissement n’est pas compté comme un nouveau dessin.

| Univers | Personnages et continuité retenue |
| --- | --- |
| Alien | Ripley, Hicks et Bishop : *Aliens* (1986), versions intactes ; Dallas, Parker, Lambert et Ash : *Alien* (1979) ; Amanda adulte : *Alien: Isolation* (2014). |
| Portal | Chell adulte, ATLAS, P-Body, GLaDOS dans son châssis suspendu et Wheatley comme noyau portable : *Portal 2* (2011) ; Doug Rattmann : *Lab Rat* (2011). |
| Disque-monde | Rincevent et Deuxfleurs : *The Colour of Magic* ; Vimaire : *Guards! Guards!* ; Mémé Ciredutemps et Nounou Ogg : *Wyrd Sisters* ; la Mort : *Mort*. |

Les huit phases sont intro, sortie, victoire et défaite de manche, présentation finale, victoire et défaite finales, super. Chaque phase contient quatre dessins. Les bases suivent séparément idle, course ou transit mécanique, action simple et réaction légère. Les quinze soutiens restent sans dégâts : un pistolet à portails ne devient pas un laser, Bishop ne reçoit pas de couteau offensif, et la psychologie des sorcières n’invente pas de projectiles. Les deux M41A et les trois outils ou armes de contact restent liés à leurs versions sélectionnées.

## Sources et import

Les [24 appels de génération](generation-attempts.json) conservent leurs prompts exacts, références, fichiers originaux et SHA. Vingt sources initiales ont été complétées par 24 dessins supplémentaires de Ripley et huit de Parker ; les cellules de bord remplacées sont exclues de la livraison. Deux essais de retrait de voile de fond restent archivés comme candidats non retenus. Les [enregistrements](generation-records.json) désignent les cellules réellement utilisées.

Le [détecteur de régions](source-regions.mjs) route des frontières entre les corps dans les espaces dont alpha est inférieur ou égal à 24. Ce seuil sert à mesurer les régions, **il ne remplace aucune valeur alpha d’un dessin**. Chaque RGBA conservé dans la région correspond au pixel source exact ; la comparaison est effectuée avant le redimensionnement au plus proche voisin. Les chemins de frontière et leurs empreintes sont dans les fichiers `sources/*-region-review.json`. Une rangée générée contenant neuf dessins peut livrer quatre poses de chaque séquence ; les dessins supplémentaires sont identifiés et exclus, sans fusionner deux corps dans une cellule.

Le [builder](builder.mjs) applique une ancre de pied mesurée, une échelle uniforme par source et des marges transparentes de dix pixels autour de chaque cellule de 256 pixels. Il partage la calibration de stature entre toutes les sources d’un même personnage. Lorsque l’étendue d’une arme impose une réduction du pack, `renderScale` restaure la stature déclarée dans le moteur. La Mort est mesurée du sommet de la capuche au pied, en excluant la partie supérieure de la faux. GLaDOS et Wheatley conservent un châssis ou un noyau mécanique ; aucun membre humain n’est ajouté pour leur course.

Les [seize ancres M41A](native-muzzle-review.json) ont été mesurées sur les planches effectivement livrées : quatre points par super et présentation finale pour Ripley et Hicks. Les points désignent le canon, pas la pointe lumineuse du flash ni un décalage générique du torse.

## Contrôle et limites

Les contacts de revue sont dans `review/`. Les vingt présentations et bases ont été inspectées pour les silhouettes, les équipements, les poses complètes, les séparations, les sorties de canon et le caractère non offensif des soutiens. Les [empreintes du premier sous-lot](first-seven-images-before-completion.json) suivent les quatorze premiers PNG pendant l’ajout des treize personnages restants. La [vérification finale](verification.json) contrôle les 960 cellules distinctes, les marges, les sources, les seize ancres et la préservation des 556 PNG et 104 registres historiques.

Pour reproduire les images et contrôler leur identité :

```bash
node scripts/buildCombatCharacterAnimationsWave13PartA.mjs --check
node scripts/buildCombatCharacterSpriteCorrectionsWave13PartA.mjs --check
node docs/combat-fidelity-wave13-2026-10-24/part-a/verify-artwork.mjs --check
```

Les dessins sont des adaptations générées, pas des frames officielles. Le choix de continuité et d’équipement est documenté ; la ressemblance stylisée, les petits lettrages des chapeaux et la chorégraphie adaptée ne constituent pas une reproduction officielle 1:1 certifiée. Les refus et limites éventuels restent distincts des ressources réellement publiées.
