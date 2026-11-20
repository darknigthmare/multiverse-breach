# Soixante-dix personnages des campagnes originales

Le lot couvre les 70 acteurs originaux de l’inventaire qui avaient encore une incarnation et un repère visuel à renseigner et qui ne figuraient dans aucune des 480 clés réservées. Il comprend 9 héros, 33 menaces de terrain, 22 boss et 6 boss mondiaux répartis sur huit univers. On retire **140 P1** liés à ces deux champs. Les 70 poses de repos ont été décodées et examinées. Les identifiants de blobs correspondent aux octets locaux pour les 70 fichiers. Le Cuirassé Nul Oblique conserve sa planche statique 1×1 et sa revue d’animation. [Lot réservé](reserved-actors.json) · [Fichiers, empreintes et limites des cellules](reference-review.json) · [Contrats](../../../../src/game/originalCampaignActorDesigns.js)

Le RPG affiche 28 noms de spéciales. Pour 25, le profil d’impact conserve ses paramètres. Trois reprennent une partie concrète de la description de campagne.

| Technique | Ciblage et effet vérifiés |
| --- | --- |
| Sable d’Isfet | Les deux héros à moins de 200 unités de la Tempête Rouge reçoivent le coup. L’aperçu indique que la zone est centrée sur le lanceur. |
| Frappe orbitale du Silo | La zone se déplace avec la cible choisie et atteint les héros à moins de 100 unités du point confirmé. |
| Écrans obliques | Le Cuirassé et ses alliés vivants à moins de 190 unités reçoivent une garde de 40 % pendant trois secondes. |

Les phases complètes des boss, les planches de variantes et la revue de fidélité de tous les états restent à traiter. Les neuf héros conservent leurs supers RPG et Mêlée ainsi que leurs invocations. [Régressions moteur](../../../../scripts/originalCampaignActors.test.mjs)

## HUD pour le joueur 2

Quand le joueur 2 prenait un boss original dont la spéciale est un objet localisé, le bouton secondaire transmettait cet objet à React et faisait disparaître l’interface. Le dock utilise désormais des noms de texte, avec un libellé de secours lorsque l’action reste sans nom. Le panneau annonce « Zone autour du lanceur » pour une attaque radiale et « Zone autour de la cible » pour une attaque ciblée de zone. [Vérifications FR/EN](../../../../scripts/rpgSourcePresentationWave16.test.mjs)

Dans Chromium, les trois essais chargent les sprites des boss, ouvrent le ciblage, confirment les ordres et vérifient leurs impacts. Les deux cas de bureau utilisent la touche de spéciale J2. Le cas mobile utilise des gestes tactiles sur la spéciale, les cibles et la confirmation. Le serveur de test signale des médias auxiliaires indisponibles dans le checkout. [Résultats](browser-results.json) · [Aperçu mobile](orbital-preview.jpg)

Pour rejouer la vérification avec Node 22, Chromium et le paquet Python Playwright, compiler le harnais GameCanvas dans une sortie temporaire neuve.

```sh
fixture=$(mktemp -d /tmp/mvb-campaign-070-XXXXXX)
node docs/assets/p0-p1-p2-continuation-06-2026-11-20/roster/browser/build.mjs "$fixture"
python docs/assets/p0-p1-p2-continuation-06-2026-11-20/roster/browser/review.py "$fixture"
```

[Reçu des tests](verification.json)
