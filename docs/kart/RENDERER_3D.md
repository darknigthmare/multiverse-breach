# Rendu 3D du kart

## Critères visibles

- Le circuit est un volume vu avec une caméra en perspective ; les karts sont des maillages, avec test de profondeur, éclairage et brouillard.
- Le châssis appartient au pilote sélectionné. Les roues des modèles terrestres tournent et braquent ; le disque de Mirelle conserve sa silhouette flottante.
- Le conducteur est le sprite existant de ce personnage, découpé dans son atlas et placé au siège. Les autres personnages ne servent jamais de remplacement en cas de fichier absent.
- Les deux caméras, poursuite et vue aérienne 3D, observent la même course. Les commandes, adversaires, objets, tours et récompenses restent ceux du moteur de course.
- Une erreur de WebGL est explicite. La vue 2D se sélectionne dans l’interface ; elle ne se fait pas passer pour un rendu 3D.

## Contrat d’intégration

| Élément | Contrat vérifié dans les sources |
| --- | --- |
| Entrée | `new KartRenderer3D(canvas, { cameraMode, maxPixelRatio, onError, onContextLost, onContextRestored })` ; le canvas est réservé à WebGL. |
| Rendu | `draw(engine, dt)` lit `engine.track`, `player`, `opponents`, objets et particules. Il ne modifie pas la simulation. |
| Pilotes | Chaque racer fournit `kartSpec`. `buildKartMesh` produit les triangles utilisés aussi par les exports de karts. |
| Axes | Les coordonnées moteur `x/y` deviennent `X/Z`. Haut : `+Y`. Avant du modèle : `-Z`. La rotation est `-angle - π/2`. |
| Échelle | Une unité de modèle correspond à 12 unités du circuit. L’échelle des personnages respecte le rapport largeur/hauteur du découpage. |
| Caméra | `setCameraMode('chase' | 'overview')` ; poursuite du pilote ou cadre fixe de toute la chaussée, adapté au ratio. Réinitialisation de l’interpolation après portail ou réancrage éloigné. |
| Dimensions | `resize()` lit le rectangle CSS. DPR plafonné à 1,5 par défaut ; buffer limité à 1 920 × 1 440. Ces limites ne changent pas les coordonnées de course. |
| HUD | Un second canvas 2D transparent reçoit la minimap et le turbo, à taille constante en pixels CSS. Leurs positions respectent les panneaux et commandes réellement affichés. Aucun appel 2D n’est fait sur le canvas WebGL. |
| Nettoyage | `dispose()` retire les écouteurs, annule les callbacks d’images et libère textures, programmes et buffers. Il peut être appelé deux fois. |
| React StrictMode | Le nettoyage ne provoque pas de perte forcée du contexte. Le même canvas peut recevoir une nouvelle instance. |

Le programme emploie WebGL 1 et GLSL ES 1.00, sans dépendance de rendu ajoutée ni script distant. Les comportements de contexte, de mélange alpha et d’allocation suivent la [spécification WebGL de Khronos](https://registry.khronos.org/webgl/specs/latest/1.0/).

## Circuit, décor et objets

La chaussée suit **les segments réels de `track.waypoints`**. Le ruban se rejoint aux sommets, sans spline qui déplacerait les virages par rapport à la conduite. Accotements, bordures, flèches de boost et ligne de départ sont des triangles en coordonnées monde.

La vue aérienne cadre les bords réels de ce ruban et la grille de départ avec
une marge minimale de 8 % sur chaque bord. Son centre reste fixe pendant la
course ; le recul est recalculé selon le ratio et le champ de vision, y compris
au redimensionnement. Les grands décors lointains, comme l’anneau Halo, ne
réduisent pas le circuit à un point pour entrer entièrement dans ce cadre.

`getKartTrackEnvironment(track)` constitue la source commune des palettes et des repères ; il fournit aussi les décors des six circuits Nexus historiques. Le rendu comprend notamment anneau, accès Forerunner, cloison nervurée, pylônes abydoniens, hangar, roche, palmier, falaise à damier, arbre cubique, tour à cadran et réacteur. Il ne remplace pas un type inconnu par un bâtiment arbitraire : les types non reconnus sont exposés dans la télémétrie.

Les meshes de repères sont normalisés à leurs dimensions déclarées : `X` dans `±width/2`, `Z` dans `±depth/2`, `Y` entre zéro et `height`. Les normales sont corrigées après cette normalisation. Cela permet au placement des circuits de vérifier une empreinte réelle, y compris pour les palmes, toitures et socles.

Les repères restent du décor sans collision. Les dangers, ralentissements, sauts, portails et contacts entre concurrents proviennent des objets réels d’`EngineRace`. Les boîtes, fragments, dangers, marqueurs d’objectif, projectiles, turbo, protection et particules ont leur représentation 3D ; leurs positions et états ne sont pas rejoués par le renderer.

## Conducteurs

Le registre fournit une liste de candidats **du même personnage**, chacun avec son propre nombre de colonnes et de lignes, la cellule et ses marges en pixels. Le renderer :

1. charge le candidat et découpe la cellule déclarée ;
2. retire la bordure transparente réellement observée ;
3. conserve la partie haute du sprite selon `upperBodyRatio` (0,68 par défaut) ;
4. place ce buste sur un plan vertical orienté vers la caméra, à l’ancrage du siège ;
5. laisse le châssis masquer naturellement la partie inférieure grâce au test de profondeur.

La texture conserve sa transparence. Le shader rejette les pixels presque transparents ; les autres pixels utilisent le mélange alpha et la profondeur de la scène. Le rapport d’image est préservé lorsque le buste est limité en taille.

Si tous les candidats échouent, le siège reste vide et `getTelemetry().drivers` indique `status: 'missing'`, l’identité et les chemins essayés. L’interface peut alors signaler le manque. Une image chargée après démontage ne réalloue aucune ressource.

**Limite artistique :** ce sont des cellules existantes recadrées, orientées vers la caméra. Ce travail ne crée pas encore les poses assises et les huit directions de conduite propres à chaque personnage.

## Perte du contexte et erreurs

La perte du contexte est reconnue ; le rendu suivant échoue explicitement, afin que le propriétaire de la course puisse ouvrir sa récupération. Si l’instance est conservée par l’appelant et que le navigateur restaure le contexte, ses programmes, géométries et textures chargées sont reconstruits. Aucun checkpoint ou état de carrière n’est réinitialisé par le renderer.

Les erreurs de compilation ou de lien des shaders libèrent les ressources déjà allouées. La première image d’une scène contrôle aussi `gl.getError()` : un appel WebGL invalide ne doit pas laisser une course invisible avancer en arrière-plan.

## Vérification réalisée

Commande : `node --test scripts/kart/kartRenderer3D.test.mjs`.

Les 15 tests couvrent les axes des karts, le cadrage mathématique des 525 circuits dans quatre ratios, la stabilité de la caméra aérienne, le ruban suivant la trajectoire exacte, les bornes et normales des 34 types de repères, la couverture des types utilisés par les circuits, cinq environnements représentatifs, le découpage des atlas, le budget de pixels, l’absence de mutation de la course, les candidats du même personnage, les callbacks tardifs, StrictMode, la perte/restauration du contexte et l’échec d’initialisation.

Les tests de cycle de vie exécutent la vraie classe avec un enregistreur d’appels GL. **Ils ne compilent pas les shaders sur un GPU** et ne prouvent pas l’apparence finale. Le parcours navigateur et ses captures doivent être attribués à la révision effectivement exécutée. Le lint ciblé des quatre fichiers a été exécuté sans alerte.

`getTelemetry()` expose les triangles et appels soumis lors de la dernière image, le nombre de modèles, les repères, les pilotes chargés/manquants, les dimensions du buffer et le temps CPU d’envoi. Ce temps n’est ni un temps GPU ni une garantie de FPS.

## Limites suivies

Le rendu est en 3D ; la simulation conserve son plan de conduite X/Z et les durées de saut d’`EngineRace`. Dévers, suspension physique, adhérence sur une surface inclinée, superposition de ponts et volumes de collision 3D restent à développer. Les décors sont des adaptations géométriques avec leur statut de fidélité conservé dans le catalogue ; aucune validation 1:1 n’est déduite du fait que le modèle se charge ou que le test passe.
