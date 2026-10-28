# Cloud Meadow — quatre modèles d’après la référence

Cette PR ajoute les quatre modèles distincts de la capture fournie le 28 octobre 2026 : **Eve, Evan, Dragon femelle et Dragon mâle**. Les deux fermiers sont répétés dans la source ; ils ne constituent pas quatre identités humaines différentes.

## Résultat et limite de fidélité

| Personnage | Fichier PNG | Statut visuel |
|---|---|---|
| Eve | `public/sprites/generated/heroes/cloud-meadow/eve-reference.png` | Recréation guidée par la référence |
| Evan | `public/sprites/generated/heroes/cloud-meadow/evan-reference.png` | Recréation guidée par la référence |
| Dragon femelle | `public/sprites/generated/heroes/cloud-meadow/dragon-female-adapted.png` | **Adaptation : plastron d’écailles opaque ajouté** |
| Dragon mâle | `public/sprites/generated/heroes/cloud-meadow/dragon-male-reference.png` | Recréation guidée par la référence |

Chaque fichier mesure **1 254 × 1 254 pixels**, possède une transparence alpha réelle et contient **une seule pose entière**. Les PNG produits ont été copiés sans retouche de pixels ni recompression. Les cornes, bottes, griffes et extrémités tubulaires des queues restent dans le canevas.

**La fidélité 1:1 demandée est un objectif, pas un résultat certifié.** Il s’agit de nouvelles images produites d’après une capture de 889 × 1 204 pixels. Les visages, coutures, contours, ombrages et proportions fines peuvent différer. Aucune image n’est un export du jeu original ni une copie garantie pixel par pixel.

La première génération du dragon femelle a été refusée par l’outil de génération d’images. Une alternative plus couverte a été produite : un plastron d’écailles anthracite continu recouvre la poitrine, avec une couverture opaque au bassin. Ce changement est indiqué dans son nom de fichier, son statut `adapted-coverage`, la galerie du jeu et la page de comparaison. Il ne constitue pas un costume officiel attesté par la capture.

## Accès et intégration

- **Dans le jeu : Hub → Collection → Références Cloud Meadow.** Les quatre boutons permettent de consulter chaque image, sa description, sa provenance et la capture d’origine.
- **Revue détaillée : `/reviews/cloud-meadow/index.html`.** Comparaison source / résultat, fonds sombre, clair ou damier, liens vers les PNG et vue à échelle relative.
- **Registre : `src/game/cloudMeadowCharacters.js`.** Identifiants exacts, descriptions FR/EN, signatures visuelles, chemins des assets, statuts et réserves de fidélité.
- **Résolution des sprites :** les quatre identifiants, associés à l’univers `Cloud Meadow`, sont reconnus par `getHeroSpriteSheetSrc`.
- **Rendu :** disposition explicite **1 × 1**, état d’animation toujours ramené à la pose unique. Les portraits utilisent l’image entière avec conservation du rapport largeur/hauteur ; les longues queues ne sont pas coupées par le recadrage habituel des bustes.

Il s’agit d’un **catalogue de modèles visuels consultables**. Aucune entrée de combat n’est ajoutée à `HEROES_DB` : les quatre modèles n’ont pas de nouvelles statistiques, techniques, récompenses ou conditions de déblocage inventées. La PR ne crée pas de campagne Cloud Meadow et ne déclare pas d’animations de déplacement ou de combat.

## Référence et identification

La capture utilisateur est conservée sans modification dans `public/reviews/cloud-meadow/reference.png`.

- Dimensions : **889 × 1 204 pixels**.
- SHA-256 : `0bc345c8c5499e59b14adb965184d9211e264feaba24f15288be7182210ca595`.
- [Présentation officielle de Team Nimbus](https://www.patreon.com/CloudMeadow/about), consultée le 28 octobre 2026 : confirme les noms **Evan et Eve**.
- Les dragons sont désignés par le sexe du modèle de l’espèce visible. Aucun nom propre individuel n’est supposé.

Les rapports de hauteur présentés dans la revue proviennent de mesures approximatives de la capture : Eve 1, Evan 1,04, dragon femelle 1,8 et dragon mâle 1,9. Ces valeurs ne sont pas des tailles officielles. La vue comparative retire uniquement les marges transparentes lors de l’affichage et conserve les proportions des images.

## Provenance et maintenance

`prompts.json` conserve les consignes exactes des quatre productions, leur provenance et l’écart volontaire du dragon femelle. `manifest.json` et `public/reviews/cloud-meadow/catalog.json` enregistrent les dimensions, empreintes SHA-256, bornes des silhouettes et statuts issus du registre.

```sh
npm run cloud-meadow:review  # Reconstruit les deux manifestes depuis le registre et les PNG
npm run cloud-meadow:check   # Vérifie les empreintes, la transparence, les bords et la synchronisation
npm run test:cloud-meadow   # Tests de rendu, d’identité, de galerie et vérification des manifestes
```

Le contrôle des silhouettes utilise le seuil alpha > 16 pour ignorer les pixels presque transparents isolés produits par le générateur. Aucun pixel visible ne doit toucher le bord du canevas ; cette vérification ne certifie pas à elle seule la ressemblance artistique. La référence et le résultat restent visibles côte à côte pour la revue humaine.

La commande `test:cloud-meadow` est incluse au début du `prebuild` existant. Aucun contrôle global du projet n’est retiré ou affaibli.
