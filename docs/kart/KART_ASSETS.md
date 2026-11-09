# Karts individuels : modèles 3D, conducteurs et sprites 2D

## Ce qui est livré

Le catalogue contient **1 912 pilotes : les 1 911 entrées de `HEROES_DB` et
l’Ancre du joueur**, répartis entre **525 clés d’univers**. Chaque identité
possède un modèle GLB autonome et un atlas PNG de huit vues du même modèle.
Cela représente **1 912 modèles, 1 912 atlas et 15 296 vues**.

Les fichiers physiques des univers enregistrés sont rangés dans
`DLC/<Univers>/assets/kart/<univers-slug>/<personnage-slug>/`. Les univers de
base et les clés sans pack restent sous `public/kart/`. La publication DLC
conserve l’URL `/kart/<univers-slug>/<personnage-slug>/` ; elle n’ajoute pas
un deuxième propriétaire aux ressources. La sélection d’un pack continue de
déterminer les ressources présentes dans sa distribution.

| Ressource par personnage | Usage |
| --- | --- |
| `kart.glb` | Modèle glTF 2.0 binaire autonome ; châssis et pivots de roues distincts ; ancrage de conducteur explicite. |
| `kart-directions.png` | Atlas RGBA de 1 024 × 128 px, huit cellules de 128 × 128 px ; kart seul, avec alpha. |
| Sprite de héros existant | Conducteur séparé dans le moteur ; source et grille identiques au registre des personnages. |
| `kart-illustration-v1.png`, Mirelle seulement | Illustration artistique du garage, produite séparément ; ce n’est pas une vue issue de la projection du maillage. |

Le [manifeste des assets](kart-assets.json) fournit les chemins physiques et
publics, empreintes SHA-256, compte de triangles, limites du maillage, sources
des conducteurs, état de fidélité et limites alpha des huit vues de chaque kart.
Une empreinte du catalogue complet détecte aussi une modification des palettes
ou des sprites dans un module DLC, même si l’agrégateur `heroes.js` ne change pas.

## Modèles et langage visuel

Le [catalogue d’identités](VEHICLE_IDENTITIES.md) distingue les adaptations de
véhicules emblématiques, les inventions pour un univers existant et les
créations des univers originaux. Les silhouettes viennent de choix explicites
par univers et par personnage ; le rôle de combat et le hash ne choisissent
plus le châssis ou ses proportions.

Les palettes sont fixées par la référence du véhicule ou le brief de la
création. Les peintures de collection restent disponibles. Les statistiques
continuent de venir du moteur et du garage : un changement de carrosserie
ou de peinture n’accorde pas d’avantage.

Le [rapport de revue](kart-identity-review.json) donne les comptes exacts des
fiches personnelles, des familles partagées et des types de référence. Les
anciens prototypes fondés uniquement sur le rôle et la palette sont supprimés
pour toutes les entrées actuelles. Une nouvelle clé d’univers doit recevoir
une fiche explicite avant de pouvoir entrer dans le roster.

| Pilote | Trait de son châssis |
| --- | --- |
| Mirelle | Disque flottant noir et or conservé, cercles cyan, garde-corps et cartes holographiques. |
| Master Chief | Warthog : capot incliné, grandes roues, cage ouverte et benne. |
| Ripley 1979 | Narcissus : coque claire, vitrages sombres et deux propulseurs arrière arrondis. |
| Arbiter | Banshee : coque violette lobée et ailes courbes. |
| Luke / Vador / Han | X-wing / TIE Advanced / Faucon, avec géométries distinctes. |
| Shepard | Mako à six roues, coque blanche et bande rouge. |
| Chell | Création Aperture avec portails orange et bleu. |
| Serj / Miku | Scènes de course et accessoires musicaux propres à leur identité. |

Pour Mirelle, la référence locale réellement inspectée est
`arca-mirelle-complete/arca-mirelle-kart-directions.png`. Le disque remplace
le concept provisoire à roues pour retrouver sa silhouette préexistante.
Le modèle demeure une **interprétation 3D non validée en 1:1** : le matériau,
les proportions fines et les détails de la référence doivent encore être
comparés dans le jeu.

## Conducteurs : identité et cadrage

Le conducteur provient de `getHeroSpriteSheetSources(hero, 'rpg')`.
L’Ancre utilise son propre atlas de mouvement mêlée, puisqu’il possède déjà
une source dédiée. Aucun personnage indisponible ne reçoit le portrait de
Mirelle ou d’un autre héros à sa place.

Les **1 912 identités possèdent au moins une source conducteur suivie dans
l’arbre Git**. Le checkout de production peut être partiel ; une absence locale
n’est pas déclarée comme une absence dans le dépôt. Le manifeste distingue
fichier suivi, fichier matérialisé et empreinte effectivement lue.

Chaque candidat conserve sa grille, sa ligne idle, sa colonne et les marges
en pixels du registre `spriteAssets.js`. Un repli vers une autre source du même
héros conserve la grille de cette source. Le cadrage du buste isole la cellule, retire les marges transparentes selon
son alpha, puis conserve les 68 % supérieurs du personnage visible. L’échec de toutes les sources doit
laisser un siège vide avec l’identité annoncée, pas dessiner un faux conducteur.

**Les sprites dédiés à une conduite assise dans huit directions restent à
produire.** Cette livraison utilise les sprites idle existants en billboard.
Elle préserve l’identité, sans prétendre montrer le dos de tous les personnages
ni de nouvelles animations de mains sur le volant. Le kart et son conducteur
restent deux couches ; l’atlas PNG n’incorpore pas un deuxième conducteur.

## Contrat technique

- Axe haut : `+Y`. Avant : `-Z`. Droite : `+X`. Unité du modèle : mètre.
- Échelle dans la course : **12 unités de simulation pour un mètre**.
- `buildKartMesh(spec)` retourne positions, normales et couleurs RGBA non
  indexées, plages de parties, limites et point d’ancrage du conducteur.
- Les roues avant ont `steering: true`, chaque roue possède un pivot
  et un axe de roulement `x`. Le nombre de roues dépend du véhicule. Le disque de Mirelle ne possède pas de roues.
- Le GLB indexe les sommets et transforme chaque roue en nœud autonome.
  Les couleurs de vertex y sont converties en espace linéaire conformément
  au format glTF. Le point `DriverSpriteAnchor` reste un nœud sans personnage 3D.
- Les projections sont orthographiques, à échelle et cadrage communs. Ordre :
  **arrière, arrière droit, droite, avant droit, avant, avant gauche, gauche,
  arrière gauche**. Ancrage déclaré de l’atlas : `(0.5, 0.86)`.
- Les PNG sont des rendus techniques des triangles réellement utilisés par
  le moteur. Ils ne sont pas des concepts peints manuellement ou une
  déclaration de validation 1:1.

La collision de course conserve son contrat existant ; un accessoire visuel
n’étend pas sa boîte. Ces modèles ne fournissent pas un nouveau simulateur
physique, des LODs revus ou une validation de performances sur mobile.

## Reproduction et vérification

```bash
node scripts/kart/buildKartAssets.mjs --all
node scripts/kart/buildKartAssets.mjs --check
node --test scripts/kartModels.test.mjs
```

Un lot de travail peut être limité avec
`--heroes arca_mirelle,masterchief,ripley`. Cette option produit un manifeste
partiel ; **`--all` doit être relancé avant une livraison complète**.

Après génération, les nouveaux fichiers canoniques doivent être ajoutés à
l’index Git, puis les inventaires du dépôt recalculés avec
`node scripts/buildDlcAssetManifests.mjs --write`. Le script d’export de karts
n’altère ni l’index Git ni les fichiers de manifestes DLC communs.

Les régressions vérifient la couverture du catalogue, les identités et grilles
des conducteurs, l’Ancre personnalisée, la projection des DLC, la géométrie
volumique et finie, les normales, les plages des roues, le décodage binaire du
GLB et les huit vues PNG distinctes et non tronquées. Le contrôle global relit
les octets de chaque GLB/PNG, puis les limites alpha des **15 296 cellules**.
Ces contrôles techniques ne certifient ni le pilotage en navigateur ni la
fidélité des univers : leurs preuves appartiennent aux recettes du moteur.

## Provenance et limites

Les maillages sont définis par `src/game/kart/kartModel.js` et
`kartIdentityGeometry.js`, avec les décisions de silhouette dans les catalogues
`kartIdentityCatalogA.js` et `kartIdentityCatalogB.js`, puis leurs exceptions
Nexus dans `kartIdentityCatalog.js`. Le générateur et les empreintes figurent
dans le manifeste ; les sprites conducteurs héritent des sources et règles
du projet. Les références de franchise conservent leurs droits d’origine.
Cette création de fan game ne prétend pas accorder une licence sur ces droits.

La revue artistique individuelle, les modèles plus détaillés des familles
génériques, les conducteurs assis directionnels et les LODs restent ouverts.
Les noms de fichiers existants et les empreintes ne transforment pas ces points
en tâches terminées.
