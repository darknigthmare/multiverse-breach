# Crustaceous Rex — pose de référence et intégration

## Manque vérifié dans le dépôt

Le fichier `public/sprites/generated/bosses/godzilla-the-animated-series/crustaceous-rex.png`
était absent du dépôt à `eac87718f0e3f951f19197370d5f5ba9d31bbd89`, puis à
`9384f99f004d95488d4393936d56f28e64340330`. Le répertoire distant contenait
seulement `cyber-godzilla.png`. Ce constat provient du dépôt distant complet,
et non de l'absence de médias dans le checkout local partiel.

Le boss était déjà déclaré dans `loreBossOverrides.js`, avec une référence
anatomique corrigée. Son entrée dans le manifeste des sprites conservait pourtant
un ancien prompt parlant de grandes pinces et d'une transformation de carapace.
Le lot remplace cette description par le contrat réellement utilisé et rend
disponible une première pose complète du personnage.

## Références et choix visuels

La [présentation de production publiée par SciFi Japan](https://www.scifijapan.com/anime-animation/godzilla-the-series)
crédite Sony Pictures Family Entertainment et Toho/Adelaide Productions.
Les deux références ont été consultées visuellement :

- [Modèle frontal et latéral](https://www.scifijapan.com/images/Ep/02crex1.jpg).
- [Capture couleur du combat](https://www.scifijapan.com/images/GTSmain/zzz.jpg).

L'atlas existant de Cyber-Godzilla a servi de point de comparaison pour le rendu
dans le jeu. Les images de référence ne sont pas distribuées dans ce lot.

La première génération a été écartée après comparaison : tentacules trop fins
et trop nombreux, membres postérieurs trop articulés et main proche trop massive.
Une édition ciblée a corrigé ces trois écarts. La seconde version a été relue
indépendamment, à pleine taille et à l'échelle de 126 pixels.

La pose retenue conserve la carapace olive intacte, l'abdomen ocre segmenté,
les très longs bras marcheurs, les mains griffues, les petits membres arrière
et la tête à bouche rouge en fleur. Son traitement est plus détaillé que le
dessin télévisé. L'acceptation concerne une **pose statique comparée aux
références**, sans certification d'identité graphique intégrale.

## Contrat du fichier installé

| Propriété | Valeur |
| --- | --- |
| Asset | `godzilla-the-animated-series-crustaceous-rex` |
| Fichier | `public/sprites/generated/bosses/godzilla-the-animated-series/crustaceous-rex.png` |
| Dimensions réelles | 1254 × 1254 pixels |
| Format | PNG RGBA, alpha transparent |
| Taille | 1 084 360 octets |
| SHA-256 | `5d758f8884a14065eb835e300dda13085baf68a296458d4326d0486917a9d2bc` |
| Pixels significatifs, alpha > 1 | Rectangle `[46, 107, 1236, 1161]`, bornes hautes exclusives |
| Découpage | 1 colonne × 1 ligne |
| Ajustement de cadrage | `trim.bottom = 69`, uniquement dans le layout |
| Animations distinctes | À produire ; une pose commune ne constitue pas un pack animé |

Le PNG sélectionné est copié sans retouche de ses pixels. L'ajustement de
layout retire seulement une partie de la marge basse, dont l'alpha vaut 0 ou 1,
pour laisser les 24 pixels de marge attendus par l'ancrage du renderer.
La silhouette significative reste entière. La taille native mesurée prime
sur la taille demandée dans le prompt initial : aucune fausse feuille 4 × 4
de 1024 pixels n'est déclarée.

Le [dossier de provenance](../assets/CRUSTACEOUS_REX_STATIC_2026-10-29.json)
conserve les prompts réellement envoyés, les références, le fichier retenu et
les limites de la revue. Le manifeste général et sa projection de disponibilité
sont mis à jour depuis leurs versions complètes, en conservant les autres
entrées du catalogue.

## Vérification et limites

Les cinq contrôles ciblés ont réussi : PNG réel et empreinte, transparence et
marge, résolution du boss et disponibilité, pose unique pour les huit états,
exécution du vrai dessin de sprite aux tailles de 96, 126 et 240 pixels dans
les deux orientations. Les trois tests existants de projection de disponibilité
ont également réussi. La commande complète `npm run test:character-png` réussit
également, y compris ses deux suites historiques d'installation.

Le contrôle natif dans **Chromium 153.0.8010.0** appelle le vrai `drawBoss`,
avec l'entrée canonique et le PNG installé. Les quatre rendus, aux hauteurs
de 126 et 240 pixels dans les deux orientations, chargent l'image entière
et utilisent le rectangle source `[0, 0, 1254, 1185]`. Leur silhouette n'est
pas coupée et atteint exactement l'ancre de sol à `y = 288` ; l'écart mesuré
est de 0 pixel dans les quatre cas. Les trois ressources répondent 200,
sans erreur JavaScript ni requête échouée.

La [capture native](evidence/crustaceous-rex-static-native.png) et les
[mesures du renderer et journaux navigateur](evidence/crustaceous-rex-static-native.json)
sont conservées avec ce rapport. Ce contrôle porte sur un rendu isolé du
moteur, sans session de combat complète ni animation. Les résultats des
workflows du commit publié sont documentés dans la
[PR nº 15](https://github.com/darknigthmare/multiverse-breach/pull/15).

La comparaison des deux manifestes complets confirme que seul l'enregistrement
C-Rex, à l'index 2907, a changé parmi les 8115 entrées. Les compteurs de
disponibilité et de manque sont recalculés ; les autres entrées et les compteurs
de provenance historique vérifiée sont conservés. La projection dédupliquée
ajoute un seul chemin, sans retrait.

### Ce que le manifeste indique encore comme manquant

Après cet ajout, le manifeste déclare 5523 entrées disponibles sur 8115 et
2592 entrées indisponibles. Il s'agit du comptage de ses statuts déclarés,
pas d'une nouvelle inspection visuelle de chaque personnage ou costume.

| Type | Entrées encore déclarées indisponibles |
| --- | ---: |
| Ennemis | 910 |
| Boss | 794 |
| Décors de niveaux | 888 |
| Total | 2592 |

La disponibilité d'une image ne certifie pas sa fidélité graphique. Les autres
variantes et animations, notamment celles qui ne sont pas représentées par une
entrée distincte du manifeste, nécessitent leur propre comparaison aux sources.

La revue statique ne valide ni une animation de marche, ni une séquence
d'attaque, ni les autres personnages et costumes du catalogue. Les anciens
rapports de backlog sont des inventaires datés ; leurs totaux ne doivent pas
être présentés comme un nouvel audit exhaustif de fidélité. Ce lot clôt le
fichier manquant identifié pour cette pose et conserve explicitement les
animations en attente.

## Environnement des contrôles navigateur

Le commit d'entrées `9384f99f` a validé 202 tests gamedev, les six fixtures et
le build complet de production. Six autres workflows ont échoué lors de
l'installation de Chromium : `ubuntu-latest` avait basculé vers Ubuntu 26.04,
non pris en charge par leur Playwright Python 1.57.0.

Ces six workflows sont désormais épinglés sur Ubuntu 24.04, l'image du dernier
passage réussi. Les versions de Playwright, les assertions, les graines et les
horloges de replay sont conservées. Le nouvel environnement doit être confirmé
par les exécutions du commit final ; une installation réussie ne remplace pas
les assertions des scénarios.
