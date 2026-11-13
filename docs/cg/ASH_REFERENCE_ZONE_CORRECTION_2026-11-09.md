# Ash — correction des zones de référence, 9 novembre 2026

Les deux rectangles attribués à Ash dans le [dossier wave11](ash-alien-reference-evidence-wave11-2026-10-26.json) montrent **Kane, joué par John Hurt**. La nouvelle inspection des images intégrales replace **Ash, joué par Ian Holm**, aux emplacements ci-dessous. Le dossier historique reste intact.

**Statut conservé : `needs-reference`.** Cet erratum et ses deux références portent `usedForIdentity: false` et `excludedFromGeneration: true`. Ils n'ajoutent ni référence d'identité qualifiée, ni verrou visuel, ni approbation artistique, ni autorisation de génération.

Les coordonnées sont celles des pixels de l'image source, origine en haut à gauche, au format `[gauche, haut, droite, bas)` ; droite et bas sont exclus. Les nouveaux rectangles sont des repères de localisation sur l'image intégrale, pas des segmentations exactes du corps ou des crops de conditionnement. Ils peuvent inclure du fond ou le bord d'un autre sujet.

| Image intégrale réellement ouverte | Ancienne zone invalide pour Ash | Sujet présent dans l'ancienne zone | Repère correct d'Ash |
| --- | --- | --- | --- |
| [Poste informatique — 1300 × 730](references/wave13-2026-11-09/ash/ac-0406_22df78d6.jpeg) | `[1017,163,1268,379)`, « Ash upper-right » | Kane / John Hurt, en haut à droite, tenue claire/crème | `[25,275,482,730)` : premier plan gauche, penché vers le poste informatique |
| [Repas — 1800 × 968](references/wave13-2026-11-09/ash/image_73d5b777.jpeg) | `[900,437,1141,725)`, « Ash seated centre » | Kane / John Hurt, premier plan central, chemise claire/crème à manches courtes | `[645,414,915,684)` : arrière-plan centre-gauche, derrière Parker, main près de la bouche |

Sur la première photo, Ash présente des cheveux courts sombres, le visage d'Ian Holm et un haut d'uniforme bleu/gris sous l'éclairage de scène. Sur la seconde, sa tête et une partie du haut bleu clair sont visibles derrière Parker ; la main près de son visage masque une partie de la bouche. **La tenue crème relevée dans l'ancienne annotation appartient à Kane et ne doit pas être transférée à Ash.** Les autres membres de l'équipage sont exclus de toute attribution au personnage.

Les deux copies ci-dessous conservent exactement les octets et les empreintes des images historiques wave11. Elles permettent de relire l'erratum depuis le dépôt malgré l'absence des anciens fichiers privés dans ce checkout. **Deux copies documentaires, zéro nouvelle source indépendante**, aucun recadrage, agrandissement, tracé ou changement de pixels.

| Copie documentaire | Octets | SHA256 intégral |
| --- | ---: | --- |
| `references/wave13-2026-11-09/ash/ac-0406_22df78d6.jpeg` | 118064 | `c2587e2cbd8afc206afc39b075951224a748a404af1cd719eca3dbf22f39ff64` |
| `references/wave13-2026-11-09/ash/image_73d5b777.jpeg` | 97182 | `c37c0f1940bff8d8e3b1daf9e340b66a77a3feb7f55615b7dda8acba6b7cad78` |

Source des deux photos : [page officielle Alien (1979), 20th Century Studios](https://www.20thcenturystudios.com/movies/alien). Fichiers d'origine : [poste informatique](https://lumiere-a.akamaihd.net/v1/images/ac-0406_22df78d6.jpeg) et [repas](https://lumiere-a.akamaihd.net/v1/images/image_73d5b777.jpeg). Photogrammes/photos du film *Alien* (1979), source du distributeur 20th Century Studios / Fox ; droits des titulaires conservés. Cette notice n'accorde aucune licence nouvelle.

Les deux images restent partielles : aucune ne montre les chaussures ni un corps complet dégagé d'Ash. Elles ne détaillent pas non plus un équipement personnel à reproduire. La photo du repas comporte des occultations supplémentaires. Une référence complète de la tenue choisie, du corps, des chaussures et de tout équipement destiné aux CG reste nécessaire. Aucun artwork n'a été généré pour cet erratum ; aucun ancien artwork, variante, reçu ou gel n'a été modifié.

Les coordonnées, exclusions et limites sont également consignées dans le [reçu documentaire wave13](ash-reference-zone-correction-wave13-2026-11-09.json). L'empreinte du dossier historique préservé est `891939824b57496f465011d4ca19502cc1213ceaaab4772c5d56d68c7dbca7ac`.
