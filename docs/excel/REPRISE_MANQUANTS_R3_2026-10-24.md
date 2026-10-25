# Reprise des manquants — R3, 24 octobre 2026

## Périmètre et livraison

Source du jeu : `5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6`, arbre `69e7bfd3635d022942ad01277d0b1088a73472c2`. La branche master est inchangée. Cette passe complète l'audit et ses contrôles, sans nouveau sprite, nouveau moveset, changement de gameplay, fusion ou publication de production.

**Les classeurs R3 sont livrés dans la conversation, pas poussés comme binaires dans cette PR.** Les deux XLSX actifs de `docs/excel` restent à la première révision publiée ; ils n'incluent ni les ajouts R2 ni les ajouts R3. Le présent rapport, les outils reproductibles et `evidence/summary-R3.json` sont les compléments textuels de cette passe. Aucun workflow de transfert n'est ajouté.

## Manquants documentaires corrigés

- 414 stages sont rapprochés exactement de leur pack par univers et nom, sans recherche approximative.
- 323 cellules de référence auparavant vides sont complétées dans l'Excel R3 ; 91 références antérieures sont préservées.
- Le lien retrouvé reste une **référence déclarée de pack**, pas une validation précise de l'architecture de la scène. Les priorités de ces stages ne baissent pas automatiquement.
- Les noms localisés FR/EN ne sont pas fusionnés au jugé. Les 3 203 ID de stages et 4 936 clés d'acteurs concordent avec l'inventaire précédent.

## Chemins de sprites : manque matériel distinct de la fidélité

18 325 résolutions utilisent les fonctions actuelles de `spriteAssets.js`, sur 4 951 chemins distincts. Pour les héros : contextes par défaut, tactique, collection, HUD, états mêlée idle/run/attack/hit et planches déclarées. Pour les adversaires : résolveur de planche ennemi.

| Famille | Acteurs dont un raster résolu est absent du Git |
|---|---:|
| Héros / alliés, contextes testés | 0 |
| Ennemis | 785 |
| Boss | 492 |
| World bosses | 200 |
| Total | 1 477 |

Une absence sur ce chemin ne prouve pas un plantage : un rendu de secours peut exister. Une présence ne prouve ni un personnage fidèle ni une animation fluide.

Dix acteurs ont un fichier déclaré 1×1 ; l'avatar HUD statique de Mirelle est légitime et exclu du manque d'animation de jeu. Les neuf autres à examiner sont Aether Mite Swarm, Lord Pneuma, The Twelve Bell Judges, Amas des Huit Orochi, Kraken Sans Couronne, Cuirassé Nul « Oblique », Le Phare qui Regarde, Reine des Ronces et Vaelgor, Premier Wyrm. Ils sont signalés, pas déclarés réparés.

## Pré-revue visuelle des 25 planches historiques

La première cellule de chaque planche a été examinée contre **le contrat visuel déclaré dans le code courant**. Ce n'est pas une comparaison exhaustive aux œuvres officielles ni une revue de toutes les animations en jeu. Les 25 PNG historiques récupérés correspondent aux empreintes de la collecte conservée ; aucune nouvelle requête HTTP de tous ces PNG n'est revendiquée.

Les contrôles de cellules trouvent 16 cellules occupées et distinctes par planche, soit 400 cellules techniques. Cela ne certifie pas la continuité d'une animation.

| Groupe | Action ciblée |
|---|---|
| Batman TDK, Batman New 52 | Remplacer les têtes à lunettes/blousons par les cagoules, capes et tenues prévues par les contrats. |
| Bob, Kevin, Stuart | Reprendre corps jaunes, yeux/lunettes et salopettes ; différencier les trois silhouettes plutôt que conserver les robots actuels. |
| Luke, Vader | Luke : tenue noire et lame verte de la cible ROTJ déclarée. Vader : masque/dôme/plastron et sabre, sans bâton ni liserés fantaisie. |
| Harry, Harley New 52, Joker New 52 | Reprendre les vêtements, cheveux, visages et équipements indiqués par leurs incarnations déclarées. |
| Stitch, Starfire | Stitch : séparer forme terrestre à deux bras et forme alien. Starfire : reprendre la tenue animée déclarée plutôt qu'une armure fantaisie. |
| Han Solo, Hermione, Jack Sparrow, Lilo, Roger Rabbit, Raven | Bases partiellement reconnaissables : corrections ciblées et comparaison de référence, pas refonte intégrale automatique. |
| Cyber Spider Electro-Beam, Flamethrower, Kelly | Retrouver les captures du modèle 1997 et l'emplacement exact des équipements ; une lumière colorée ne prouve pas l'arme. |
| Grim Knight | Vérifier la cagoule, les oreilles, les supports et les armes contre les cases de référence déclarées. |
| Saturnin | Conserver provisoirement la silhouette de caneton ; contrôler l'épisode et les animations. Pas d'approbation 1:1. |

Les 25 fiches complètes du classeur indiquent observation, éléments à conserver, action, critère de réception, incarnation, ancrage, source, chemin PNG et SHA-256. Aucune note artistique chiffrée n'a été inventée.

### Deux créations originales ne sont plus des P0 externes

`mj_performer` est explicitement une persona originale de tribute et `rhythm_guard_mj` un compagnon original dans les données actuelles. Les comparer obligatoirement à un personnage officiel inexistant serait une erreur d'audit. Ils passent **de P0 à P1**, pour revue de leur design interne, sans validation artistique.

Priorités actives acteurs + stages : **22 P0 / 3 561 P1 / 4 072 P2 / 484 P3**, total 8 139. Les anciennes feuilles de 24 candidats sont conservées comme historique, avec les deux priorités corrigées. Un P0 restant ne signifie pas nécessairement une refonte complète.

## Excel R3 et contrôles

- Audit fidélité : 19 onglets, avec références de stages, actions visuelles, résolution des assets par mode et preuves R3.
- Suivi combats RECONSTITUÉ : 7 onglets, avec rapprochement des 4 936 entrées techniques et des lacunes visuelles. Les 41 adaptateurs de R2 restent des intégrations existantes, pas de nouvelles capacités.
- Aucune valeur ni formule antérieure modifiée en dehors des cellules explicitement ciblées. Zéro erreur de cellule/formule détectée après export.
- 627 fichiers du snapshot revérifiés sans écart ; le nouvel outil vérifie les 221 fichiers source qu'il importe contre les blobs de l'arbre.
- 38 tests Node réussis, zéro échec, zéro ignoré. Cela valide les outils d'audit, pas le gameplay ni une nouvelle certification artistique.

Le fichier historique `multiverse_breach_catalog_lore_UPDATED.xlsx` reste non récupéré. Le suivi demeure explicitement RECONSTITUÉ.

## Reproduction locale, sans accès réseau ni secret

Depuis une copie de confiance du dépôt, utiliser un checkout du commit source et exécuter les outils depuis la branche d'audit :

```sh
node --test docs/excel/tools/fidelityEvidence.test.mjs
node --no-warnings --experimental-loader ./docs/excel/tools/json-loader.mjs \
  docs/excel/tools/refreshFidelityEvidence.mjs \
  --source-root /chemin/checkout-source \
  --commit 5f44cf344d1a9fbb0dbd7c899510b7dd16cf25d6 \
  --baseline ./docs/excel/evidence/sprite-production-checks.json \
  --out /chemin/sortie-audit
```

Le résolveur peut lire un arbre JSON complet avec `--tree /chemin/tree.json` pour une copie de sources sans dossier `.git`. Cette copie et cet arbre doivent provenir du commit indiqué. Les modules de source sont importés localement : n'exécuter que des sources de confiance. Aucun téléchargement, accès au compte, modification de sauvegarde ou déploiement n'est réalisé par ces outils.

Exports : `fidelity-evidence-r3.json`, `stage-references-r3.csv`, `actor-assets-r3.csv`. Le CSV protège les valeurs pouvant être interprétées comme des formules. Les références sont limitées à HTTPS sans identifiant, les chemins traversants sont refusés, les conflits restent visibles et aucune simple présence de fichier ne devient une approbation artistique.

Les preuves Vercel restent celles du run historique 40091057307. Aucun nouveau parcours complet ni nouveau succès CI de la tête à publier n'est annoncé.
