# Discipline — études monochromes OVA, v5

**Deux ajouts : l’uniforme OVA de Leona avec le brassard 風紀 et un membre anonyme du club de diffusion 放送部員.** Le catalogue compte 197 PNG pour 36 identités graphiques. Les 195 objets et PNG précédents sont conservés.

## Source et palette

Ces études suivent des scans vendus comme feuilles monochromes de l’OVA ; leur chaîne de provenance studio n’est pas vérifiée. Le gris est le traitement du dessin source : il ne prétend pas établir les couleurs des personnages ou de leurs tenues. `paletteStatus` vaut `source-monochrome` et `sourceColorPaletteConfirmed` reste `false`. Aucun sprite du catalogue antérieur n’a servi d’entrée de génération ; aucun `styleSourceId` ou `variantOf` n’est donc ajouté. Les retouches de cette passe utilisent uniquement ses propres brouillons.

L’entrée de Leona constitue une étude OVA indépendante et une variation d’accessoire. Elle n’est pas déclarée correction du costume VN. Le membre du club de diffusion garde un identifiant descriptif : aucune identité nominative n’est supposée.

## Ajouts et limites

| Figure | Image native | Observations |
| --- | --- | --- |
| Leona Morimoto | `ova-uniform-armband-monochrome-v5` — 1254 × 1254 | Étude monochrome indépendante de la planche OVA : uniforme en pied et brassard 風紀 sur le bras gauche. Coiffure, mains, jambes et mocassins comparés aux feuilles. Estimation visuelle : environ 7,4–7,6 hauteurs de tête contre 7,8–8 sur la source ; tête encore légèrement plus grande, expression plus sévère et semelles plus épaisses. La palette couleur reste inconnue. Aucun lien de correction avec la tenue VN, aucune certification intégrale 1:1. |
| Membre OVA — club de diffusion | `ova-uniform-monochrome-v5` — 1133 × 1388 | Membre anonyme du club de diffusion, identifié par 放送部員. Étude monochrome de la petite figure en pied : environ 7,8–7,9 hauteurs de tête contre 7,8–8 sur la source ; largeur cheveux/épaules 159/345 ≈ 0,461 contre 86/187 ≈ 0,460. Cou, torse, genoux et bras croisé rapprochés du dessin. Visage, plis, contours et position de l’ourlet restent interprétés. PNG natif 1133 × 1388 conservé ; marges haut/bas de 15/14 px. La palette couleur et une identité nominative ne sont pas établies ; aucune certification intégrale 1:1. |

Les proportions sont comparées visuellement aux silhouettes en pied. Le changement de pose, la transposition graphique et les différences observées ne permettent pas de certifier une reproduction mathématique 1:1. Les observations détaillées de chaque sélection figurent dans `proportionReview`.

## Conservation et format

Base conservée : `0c4f9a165a1e00f1b897246b142c1a59878f5ac0`. Les 195 objets du catalogue et les 195 objets du manifeste sont comparés en totalité, et les SHA-256 des 195 PNG sont vérifiés avant et après l’intégration. Les deux nouvelles images sont copiées sans redimensionnement ni retouche.

Chaque PNG est un cadre statique entier de 1 colonne × 1 ligne. Les dimensions natives peuvent différer ; ce format ne demande pas un canevas carré. Tous les personnages déjà présents gardent leurs identifiants et leurs choix par défaut. Aucun héros jouable ou changement de statistiques n’est créé.

## Travaux encore ouverts

Miyuki reste sans référence de tenue complète habillée. Les silhouettes en pied de la tenue civile à jupe de Saori et de la robe de soirée de Leona sont documentées en monochrome, mais leurs couleurs ne sont pas établies. La tenue western de Linda reste partiellement visible. La recherche v5 détaille ces limites sans déclarer ces tenues achevées. La nouvelle tentative de robe de soirée de Reina a été refusée à la sortie du générateur ; aucun PNG n’est installé pour cette tenue. Les autres états v4 non résolus restent conservés.

## Preuves

- [Manifeste et prompts exacts](manifest.json)
- [Recherche v5](reference-v5-research.json)
- [Conservation des 195 objets et images](reference-v5-preservation.json)
- [Revue v4](reference-v4-review.md)

## Validation de cette passe

`npm run test:discipline` réussit les deux fichiers de tests et `npx vite build` compile 313 modules. Le contrôle Chromium charge les 197 images à leurs dimensions natives, vérifie les deux cartes v5 sur fonds sombre, clair et damier, puis le format mobile de 390 px sans débordement. Les liens de source, les notes et la comparaison v4 restent accessibles ; aucune erreur JavaScript n’est observée.

- [Validation technique v5](reference-v5-validation.json)
- [Validation navigateur v5](reference-v5-browser-qa-report.json)

Les huit workflows de la base `0c4f9a1` sont réussis, y compris le cycle complet de production. Cette information concerne cette base ; la nouvelle publication reçoit ses propres contrôles GitHub.
