# Isaac Clarke — 45 états Mêlée, vague 12

Ce dossier archive la création de **180 poses natives distinctes**, soit les **45 états du moteur × 4 poses**, pour Isaac Clarke dans son apparence d’ingénieur de **Dead Space (2008)**. Les six atlas publics sont enregistrés dans le manifeste Isaac. Ils complètent les animations de présentation et de super de la partie C, qui restent des ressources séparées.

Les dessins sont des adaptations originales générées pour le jeu. **`source1to1Verified: false`** : ce dossier ne certifie ni une extraction officielle, ni une fidélité anatomique et chorégraphique officielle 1:1. Les états de garde, charge, aérien et rebord adaptent le personnage aux règles communes du moteur.

## Identité et matériel suivis

La référence native réellement montrée à l’outil est [isaac-reference-native-wave12.png](isaac-reference-native-wave12.png), copie exacte de [la référence partie C](../part-c-sources/isaac-48.png). Le prompt, la copie, les sources et les reçus sont liés par SHA-256 dans [actual-tool-calls.json](actual-tool-calls.json).

La direction visuelle utilise le RIG d’ingénierie bronze/brun nervuré, un casque fermé à trois bandes cyan horizontales, des proportions d’ingénieur adulte, des gants et bottes de travail. La bande de santé dorsale est réservée aux vues où le dos est visible. Le Plasma Cutter reste un outil industriel court, avec tête de coupe compacte, sans canon de fusil ni chargeur conventionnel. Les poses de déplacement et de rebord le gardent à la hanche ; les mains qui prennent appui sont libres.

Les frappes de contact utilisent les gestes physiques du corps et de l’outil. La garde est une protection par les avant-bras ; les états communs `charge*` représentent une préparation physique. Aucun pouvoir de charge de plasma n’est présenté comme canonique. L’état `special` contient un éclat compact au niveau réel de la tête du cutter, puis une récupération sans éclat. Les poses `dead` et `defeat` restent sans blessure graphique.

Le moteur applique un miroir horizontal pour l’orientation opposée, qui inverse aussi les asymétries de tenue et d’équipement. Les repères « paume en prise » décrivent un gant visible et son contact, sans certifier la main anatomique cachée sous une vue de trois quarts.

## Sources réellement obtenues et exclusions

Les six premières demandes n’ont pas produit 192 poses utilisables : deux planches avaient une rangée manquante et une troisième une dernière rangée irrégulière. Les sorties originales sont conservées. Quatre nouvelles générations ont apporté des dessins correctifs réels, sans fabriquer de poses par transformation.

| Source native | Poses observées | Poses retenues | Décision |
| --- | ---: | ---: | --- |
| `isaac-motion-a.native.png` | 32 | 32 | Huit rangées complètes |
| `isaac-motion-b.native.png` | 28 | 28 | `crouchIdle` absent, complété séparément |
| `isaac-defense.native.png` | 32 | 32 | Huit rangées complètes |
| `isaac-combat-a.native.png` | 28 | 28 | `chargeLoop` absent, complété séparément |
| `isaac-combat-b.native.png` | 29 | 0 | Source entièrement rejetée pour rangées irrégulières/manquantes |
| `isaac-ledge.native.png` | 32 | 16 | Ancienne montée remplacée ; trois rangées d’étude exclues |
| `isaac-corrective-readiness.native.png` | 16 | 8 | `chargeLoop` et `crouchIdle` ; deux rangées de calibration exclues |
| `isaac-combat-b-corrective-a.native.png` | 16 | 16 | Récupération, spécial, deux aériens |
| `isaac-combat-b-corrective-b.native.png` | 16 | 16 | Aérien bas, intro, victoire, attaque de rebord |
| `isaac-corrective-climb.native.png` | 8 | 4 | Montée réellement ascendante ; rangée debout réservée à la calibration |
| **Total** | **237** | **180** | **57 poses exclues et conservées dans les archives** |

Les dix appels réels sont décrits dans [actual-tool-calls.json](actual-tool-calls.json), avec prompts exacts, références effectivement envoyées, dates de début/fin, chemins originaux et SHA. Les champs de modèle, job et génération sont `null` lorsque l’outil ne les a pas retournés. Le UUID du nom de PNG n’est pas présenté comme un identifiant de génération confirmé. Il n’y a pas eu de refus de génération ; le rejet de `combat-b` est une décision de qualité, conservée explicitement.

La sélection rangée par rangée se trouve dans [packing-plan.json](packing-plan.json), et la revue des états dans [source-row-review.json](source-row-review.json). Le fichier `ledge-native-upper-three-rows-review.png` montre une revue intermédiaire de l’ancienne source de rebord ; sa montée a ensuite été remplacée dans l’atlas livré.

## Six atlas livrés

Chaque atlas mesure **1024 × 2048**, avec **4 colonnes × 8 rangées** de cellules **256 × 256**, marge de sécurité minimale de 10 pixels et ligne de base 244. Les trois dernières rangées de l’atlas de rebord restent transparentes et ne comptent pas comme états.

| Atlas | États | Poses |
| --- | ---: | ---: |
| `isaac-motion-a` | 8 | 32 |
| `isaac-motion-b` | 8 | 32 |
| `isaac-defense` | 8 | 32 |
| `isaac-combat-a` | 8 | 32 |
| `isaac-combat-b` | 8 | 32 |
| `isaac-ledge` | 5 | 20 |

Le pipeline découpe les pixels réellement générés, supprime les résidus alpha sous le seuil déclaré, applique **une échelle uniforme par source**, puis place les dessins dans les cellules. Il ne redessine pas le casque, les membres, les mains ou le cutter ; il ne déforme pas l’anatomie et ne crée pas d’intermédiaires, de miroir ou de rotation pour augmenter le compte de poses. Les 180 empreintes RGBA natives sélectionnées sont distinctes.

Neuf sources utilisées ont une calibration debout couronne–semelles. La cible corporelle effective est 190 pixels ; les grandes amplitudes restent contenues dans 234 pixels avec compensation déclarée de `renderScale`. Les bras levés de la prise ne servent pas de mesure corporelle. Les positions accroupies, suspendues et couchées gardent leur vraie hauteur projetée, sans agrandissement individuel pour remplir la cellule.

## Reproduire et contrôler

Depuis la racine du dépôt, ces commandes vérifient les sorties existantes sans réécrire les archives :

```sh
node docs/combat-fidelity-wave12-2026-10-23/isaac-sources/normalize-isaac-atlases.mjs --check
node docs/combat-fidelity-wave12-2026-10-23/isaac-sources/measure-isaac-native-hands.mjs --check
node docs/combat-fidelity-wave12-2026-10-23/isaac-sources/verify-isaac-atlases.mjs --check
```

Sans `--check`, le premier reconstruit les six PNG et les deux registres à partir des seules archives ; le second reconstruit les mesures des mains. [verify-all-result.json](verify-all-result.json) atteste le contrôle effectivement passé : 45 états, 180 poses et empreintes distinctes, neuf calibrations, douze paumes, douze poignets, onze contacts et préservation des douze manifestes précédents.

Les points de main ont été relevés visuellement sur les dessins sources, puis projetés par la transformation technique exacte dans [hand-measurements.json](hand-measurements.json). Chaque voisinage de 9 × 9 pixels autour des douze paumes et douze poignets contient 81 pixels visibles sur la source et sur l’atlas. La première pose de `ledgeCatch` est une approche et ne revendique pas encore de contact : onze poses sur les douze de prise/maintien/montée sont attachées au rebord.

## Vérification dans Chromium et le vrai moteur

Les harnais de [browser/](browser/) utilisent le serveur Vite local à `http://127.0.0.1:5188/`, le Chromium installé et le vrai code du jeu. Deux parcours montent réellement `GameCanvas` et envoient des touches ; deux séquences contrôlées exercent le renderer et le moteur réels.

| Harnais | Ce qui est effectivement contrôlé |
| --- | --- |
| `isaac-core-browser.mjs` | Les 45 états × 4 poses × 2 orientations donnent 360 appels au renderer, 180 rectangles natifs et huit prises de rebord ; le rendu conserve la physique |
| `isaac-movement-browser.mjs` | Touches D + Espace, D jusqu’au sol puis Q ; les quatre poses de `jumpRise`, `fall`, `land` et `turn` sont observées ; `sessionPaused` garde la même instance de moteur et stabilise la simulation |
| `isaac-super-browser.mjs` | Démarrage à froid, touche L, atlas natif partie C rangée 7 colonnes 0–3, charge 100→0, aucun dégât avant `hitAt`, impact unique et refus d’un second super sans charge |
| `isaac-physical-ledge-browser.mjs` | Vraie prise par `EngineSmash.applyPhysics`, transitions du runtime pour maintien/montée/lâcher/saut/attaque : deux camps × deux côtés × cinq actions, soit vingt cas, avec trente-deux contacts visibles de gant |

La capture physique ajoute de courts traits cyan de contrôle à l’endroit exact du bord : ils appartiennent au harnais et ne sont pas des accessoires dessinés sur les personnages. Le rendu n’a pas autorité sur les coordonnées physiques. Le parcours physique de rebord appelle directement les commandes du runtime : il ne prétend pas simuler ces vingt cas au clavier dans `GameCanvas`. La physique actuelle peut remplacer rapidement `ledgeDrop` et `ledgeJump` par `fall` et `jumpRise` ; la disponibilité des quatre dessins ne garantit pas leur durée naturelle complète dans chaque transition.

Le runner relance les quatre harnais, exige leurs vrais codes de sortie et compare les SHA des ressources Isaac et du moteur avant/après :

```sh
node docs/combat-fidelity-wave12-2026-10-23/isaac-sources/browser/run-isaac-browser-checks.mjs
node docs/combat-fidelity-wave12-2026-10-23/isaac-sources/browser/collect-isaac-evidence.mjs --check
```

[browser/isaac-evidence.json](browser/isaac-evidence.json) lie harnais, résultats, traces, captures et ressources par SHA. Les catalogues globaux modifiés par les lots parallèles ne sont pas inclus dans le gel des fichiers Isaac ; les six PNG Mêlée et les deux PNG de présentation partie C d’Isaac le sont. Les erreurs Google Fonts provoquées par le réseau sont comptabilisées explicitement dans les rapports, et aucune erreur de page n’est admise.

Le premier passage super avait un filtre de capture de source erroné : il cherchait le chemin sans `-part-c`. Ses assertions de jeu étaient passées ; les fichiers `browser/isaac-super-initial-filter-failure*` conservent cet échec du harnais. Le filtre corrigé exige le vrai chemin du catalogue, sans assouplir les contrôles de charge, dégâts, rangée et colonnes.
