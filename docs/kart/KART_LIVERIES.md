# Livrées de collection sur les châssis personnels

Les anciennes options cosmétiques de kart deviennent des **livrées de peinture** appliquées au kart du personnage choisi. Elles ne remplacent ni le pilote, ni sa silhouette de kart, ni ses équipements, ni ses règles physiques. Le champ historique `style` est conservé comme métadonnée de collection ; cette version applique la couleur principale uniquement.

## API

```js
import {
  applyKartLivery,
  recolorKartAtlas,
  getKartRelativeDirection
} from '../../game/kart/kartLivery.js';

const personalKart = getKartForHero('masterchief');
const paintedKart = applyKartLivery(personalKart, collectionCosmetic);
const mesh = buildKartMesh(paintedKart);
const paintedAtlas = recolorKartAtlas(loadedAtlasImage, paintedKart);
const direction = getKartRelativeDirection(opponent.angle, player.angle);
```

`applyKartLivery(spec, cosmetic)` conserve les références `driverSprite`, `sprite2D`, `dimensions`, ainsi que les identités, le motif, le châssis et les couleurs d’accent. Il remplace `color` et ajoute `livery` : `id`, `name`, `sourceColor`, `color`, `style`, `treatment`, `spriteTreatment`. Appliquer une deuxième livrée conserve la couleur d’origine. Passer `null` retire la livrée et restaure cette couleur. Un objet sans couleur hexadécimale valide n’est pas appliqué.

`recolorKartAtlas(imageOrCanvas, spec, {canvasFactory} = {})` retourne un nouveau canvas pour une livrée active. Sans livrée, il retourne la source. Le canvas source n’est jamais modifié. Le helper n’a aucun cache global ; le moteur conserve le résultat par URL d’atlas, couleur d’origine et couleur appliquée. `KartSpritePreview` conserve son dernier résultat dans une référence de composant et ne recalcule pas la peinture lors d’un simple nouveau rendu React avec la même livrée. Les erreurs de création ou de lecture du canvas remontent au composant appelant.

Le helper pur `recolorKartPixels(rgba, spec, {width, height} = {})` permet la validation hors navigateur. Il retourne une copie `Uint8ClampedArray` et attend huit cellules carrées sur une ligne. Les dimensions peuvent être déduites de la taille du tampon. Il n’est pas destiné aux sprites de personnages ou aux illustrations artistiques.

## Cohérence entre 3D et 2D

En 3D, `buildKartMesh(paintedKart)` construit exactement la même géométrie avec la nouvelle peinture. Les matériaux dérivés de la couleur principale — faces claires, sombres et mélanges propres au châssis — suivent cette couleur. Les pneus, les éléments métalliques, les accents, les hologrammes et le sprite conducteur restent inchangés.

En 2D, un masque de profondeur retrouve les faces visibles du même modèle, avec la projection et l’éclairage utilisés pour l’export technique. Chaque pixel opaque n’est repeint que si sa couleur correspond à la face source visible. Cette vérification évite d’altérer une image qui aurait été remplacée par une illustration ou un export incompatible. Elle distingue aussi la carrosserie des ornements lorsque les deux partagent exactement la même couleur. L’alpha et l’ombre portée sont conservés.

L’illustration séparée de Mirelle n’est pas traitée par ce masque : un aperçu avec livrée utilise l’atlas issu du modèle. Les GLB et PNG livrés sur disque restent les versions originales du personnage ; la livrée est une présentation appliquée à l’exécution, sans modifier les fichiers ni leur manifeste.

## Direction des adversaires

`getKartRelativeDirection(kartAngle, cameraAngle)` utilise les angles du moteur, positifs dans le sens horaire sur le plan X/Y. L’ordre de l’atlas reste : arrière, arrière droit, droite, avant droit, avant, avant gauche, gauche, arrière gauche. Un adversaire roulant dans la même direction apparaît de dos ; un adversaire roulant en sens opposé apparaît de face. Les sprites conducteurs existants restent des images indépendantes, sans animation de conduite directionnelle dédiée.

## Vérification

```sh
node --test scripts/kart/kartLivery.test.mjs
```

Les tests comparent les huit vues repeintes à un nouvel export du mesh réellement repeint pour Mirelle, Master Chief, Ripley, Nova, Arthur et l’Ancre. Ils vérifient une égalité exacte des pixels, la conservation des octets source et de l’alpha, l’intégrité des couleurs de roues, l’identité du pilote, la géométrie inchangée, le retrait/remplacement de livrée et les huit directions relatives. Une image volontairement incompatible reste intacte.
