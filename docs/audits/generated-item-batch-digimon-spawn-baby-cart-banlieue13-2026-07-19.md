# Audit OpenAI ImageGen - objets Digimon, Spawn, Baby Cart et Banlieue 13

Date : 2026-07-19

## Périmètre

Ce lot contient exactement 16 icônes d'objets, réparties entre quatre univers :

- Digimon Celestial Rift : 4
- Spawn : 4
- Baby Cart : 4
- Banlieue 13 : 4

Aucun fichier de code, manifeste, registre d'assets, configuration, musique, stage
ou autre univers n'a été modifié par ce lot.

## Résultat

- 16/16 PNG présents.
- 16/16 en `512 x 512`.
- 16/16 en `RGBA`.
- 16/16 possèdent une transparence réelle, avec alpha de `0` à `255`.
- 16/16 ont leurs quatre coins totalement transparents.
- 16/16 ont `0` pixel RGB non nul sous un alpha nul.
- 16/16 ont `0` résidu proche de la clé chroma `#FF00FF`.
- 16/16 conservent au moins 46 px de marge autour de l'objet principal.
- Aucun objet, canon, manche, lame, roue, chaîne ou sangle n'est tronqué.
- Les contrôles visuels ont été réalisés sur un fond gris neutre.

La marge alpha complète descend à 17 px sur deux icônes Digimon uniquement à
cause de la diffusion de leur ombre alpha. Leur objet principal garde
respectivement 48/59 px et 47/59 px de marge verticale ; il n'est donc pas
tronqué.

## Méthode et contrainte disque

1. Une seule planche source 2x2 a été générée par univers.
2. Les quatre quadrants ont été extraits séparément.
3. La clé magenta a été convertie en transparence.
4. Chaque objet a été redimensionné avec un filtre nearest-neighbor, centré dans
   512 x 512 puis posé sur une ombre alpha neutre.
5. Les canaux RGB ont été remis à zéro pour chaque pixel dont l'alpha vaut zéro.
6. Chaque planche source a été supprimée immédiatement après l'export de ses
   quatre PNG.
7. Chaque contact sheet QA temporaire a été supprimée immédiatement après son
   inspection.
8. Aucun fichier de réservation n'a été créé.

## Références visuelles et lore

### Digimon Celestial Rift

- [Bandai Toys - Digivice Ver. Revival](https://toy.bandai.co.jp/en/article/detail/?cate=item&path=01_20773) :
  forme générale, boîtier, écran et commandes du Digivice classique.
- [Bandai Toys - manuel Digivice 25th](https://toy.bandai.co.jp/manuals/files/2694795.pdf?ver=sh80wm) :
  silhouette du tag et usage des crests.
- [Digimon Encyclopedia - Gatomon/Tailmon](https://digimon.net/reference_en/detail.php?directory_name=tailmon) :
  Holy Ring porté à la queue et statut d'anneau sacré.
- [Digimon Encyclopedia - Beelzemon](https://digimon.net/reference_en/detail.php?directory_name=beelzebumon) :
  les deux fusils favoris de Beelzemon sont officiellement nommés `Berejena`.

Le nom de fichier `berenjena-gun.png` est conservé exactement comme demandé.
L'orthographe canon anglaise `Berejena` est utilisée pour la recherche et la
direction visuelle.

### Spawn

- [Bandai Namco - Spawn, personnages et armes](https://www.bandainamcoent.co.jp/cs/list/spawn/characters/characters_2.html) :
  références officielles de la chaîne, de la cape vivante et de l'arme Agony.
- [McFarlane - catalogue officiel Spawn](https://mcfarlane.com/toys/brands/spawn/) :
  matières, palette rouge/noir/vert et éléments de costume.
- [McFarlane - Spawn classique](https://mcfarlane.com/toys/spawn/) :
  cape, chaînes, métal sombre et accessoires classiques.
- [McFarlane - Commando Spawn](https://mcfarlane.com/toys/commando-spawn-4/) :
  lecture militaire d'Al Simmons utilisée pour les dog tags.

### Baby Cart

- [Criterion - Kazuo Koike on Lone Wolf and Cub](https://www.criterion.com/current/posts/4282-manga-legend-kazuo-koike-on-lone-wolf-and-cub) :
  Daigoro et la poussette armée emblématique.
- [Criterion - coffret Lone Wolf and Cub](https://www.criterion.com/boxsets/1217-lone-wolf-and-cub) :
  références films, costumes et accessoires.
- [Criterion - Baby Cart in Peril](https://www.criterion.com/films/28725-lone-wolf-and-cub-baby-cart-in-peril) :
  construction visuelle du panier et de son équipement.
- [Criterion - Samurai and Son](https://www.criterion.com/current/posts/4287-samurai-and-son-the-lone-wolf-and-cub-saga) :
  mécanismes et armement dissimulés dans la poussette.
- [Lone Wolf and Cub - synthèse secondaire](https://en.wikipedia.org/wiki/Lone_Wolf_and_Cub) :
  vérification du dōtanuki d'Ogami Ittō.

### Banlieue 13

- [TF1 Pro - Banlieue 13](https://tf1pro.com/programmes/produit/banlieue-13) :
  contexte officiel, Damien, Leito et arme de destruction massive.
- [Cineuropa - Banlieue 13](https://cineuropa.org/fr/film/90425/) :
  production EuropaCorp et contexte du film.
- [IMDb - District B13](https://www.imdb.com/title/tt0414852/) :
  synopsis et photographies de référence du film.
- [IMFDB - District B13](https://www.imfdb.org/wiki/District_B13) :
  vérification secondaire des armes de poing visibles, notamment celles de Taha.

Le badge, la chaussure et le détonateur ne sont pas reproduits depuis un prop
officiel isolé. Ce sont des interprétations originales cohérentes avec les
images et le matériel du film, sans marque, texte, numéro ou logo copié.

## Prompts de génération

### Contraintes communes

```text
Create one square 2x2 sprite-source sheet containing exactly four separate
collectible item icons, one centered in each quadrant. Original fan-made game
art informed by reliable visual references, not a copied official asset.
Highly detailed 32-bit pixel art, crisp deliberate pixel clusters, strong
readable silhouettes, three-quarter product view, consistent lighting.
Perfectly flat chroma magenta #FF00FF background. No source shadow, glow,
particles, smoke, floor, text, letters, numbers, logos, UI, borders, people or
hands. Keep every object wholly inside its quadrant with generous padding and
a wide empty cross-shaped center gutter. Nothing may cross a gutter or touch
an edge.
```

### Digimon Celestial Rift

```text
Top left: one classic Digimon Adventure Digivice, white oval casing, blue
screen bezel and blue controls, small green secondary button, blank pixel LCD.
Top right: one Crest of Light tag and pendant, silver angular holder, short
chain and gold sun/light crest, no text.
Bottom left: one complete polished gold Holy Ring, thick sacred band with
engraved geometric Digimon-style symbols but no readable writing.
Bottom right: one complete Berejena handgun associated with Beelzemon,
long heavy black and gunmetal demonic firearm, squared muzzle, purple organic
grip details, entire weapon visible diagonally. Exactly one item per quadrant.
```

### Spawn

```text
Top left: one compact coiled Spawn-style necroplasm chain, heavy dark gunmetal
and silver links, one restrained spiked hook, subtle green necroplasm grooves.
Top right: one compact living cape clasp, red-and-black organic collar material,
small skull-like metal clasp and restrained green accents, no torso or full
cape.
Bottom left: one pair of worn brushed-steel military dog tags on one short ball
chain, no readable data.
Bottom right: one complete double-headed Agony battle axe, black/dark-silver
heads, bone-white mask-like inlay, two green eye-like marks and red-black
wrapped shaft. Exactly one item per quadrant.
```

### Baby Cart

```text
Top left: one complete empty Edo-period Daigoro baby cart in three-quarter view,
dark weathered wood, two iron-rimmed wheels, woven wicker hood and concealed
panel seams.
Top right: one practical dōtanuki battle sword with robust blade, simple iron
tsuba, black wrapped hilt and dark lacquer scabbard as one matched set.
Bottom left: one folded-out hidden cart weapon module, compact multi-barrel
matchlock/Gatling-like mechanism, dark iron barrels, brass fittings and
weathered wood housing, not a modern rifle.
Bottom right: one small Daigoro hand drum, dark wood shell, tan hide heads,
simple lacing and one short strap. No people or child.
```

### Banlieue 13

```text
Top left: one rugged neutron-bomb detonator/control unit, compact dark
olive/black reinforced housing, blank display, unmarked keypad controls,
guarded red toggle and protected connector, no timer or radiation logo.
Top right: one open worn black police credential holder for Damien, generic
aged silver badge, restrained blue-white-red accent and blank identity panel,
no copied seal, portrait, letters or numbers.
Bottom left: one single Leito low-profile parkour trainer, charcoal technical
fabric, reinforced flexible grip sole, compact toe protection and restrained
deep-red accent, no brand.
Bottom right: one compact Taha dark semi-automatic pistol, worn blackened-steel
squared slide and practical dark grip, no suppressor, ammunition, engraving or
brand mark.
```

## Contrôles et SHA256

`Marge objet` correspond au rectangle des pixels dont l'alpha est supérieur ou
égal à 64. Cette mesure ignore la diffusion légère de l'ombre. L'ordre est
gauche/haut/droite/bas.

| Fichier | Marge objet | RGB sous alpha 0 | Proche #FF00FF | SHA256 |
|---|---:|---:|---:|---|
| `digimon-celestial-rift/digivice.png` | 119/48/118/59 | 0 | 0 | `e302db8b101bc059262f27e73141bfe3397db38a585973c310974f4ce6fc1178` |
| `digimon-celestial-rift/crest-of-light.png` | 139/47/139/59 | 0 | 0 | `276545cf2364387cf2acd484448d22471a4df3a0f5c5dce488d4cde8b6e3143e` |
| `digimon-celestial-rift/holy-ring.png` | 47/51/47/62 | 0 | 0 | `b1c9d467f8762931575aace7eb51189e7d1270c84e457d091b967922968c55c2` |
| `digimon-celestial-rift/berenjena-gun.png` | 47/72/47/85 | 0 | 0 | `bbacaac6a0ef28b1bfca9f62e2599ec622c0f051279711d04383fd9e5ee507d7` |
| `spawn/necroplasm-chain.png` | 59/49/59/74 | 0 | 0 | `df2ecdbfe1b305134faf9d2ca1dafaab93537ef28afa46e66498f07c599f2839` |
| `spawn/living-cape-clasp.png` | 47/109/47/135 | 0 | 0 | `57bb83906f68c75a0e69ae9b0d89d765ee7258a190c1b178137f4b23c6db9711` |
| `spawn/military-dog-tags.png` | 71/50/71/73 | 0 | 0 | `00ba26edfc86b3a53c71bc70eea32dc3ec6b118d08d2f434c7118c3fe1888d32` |
| `spawn/agony-axe.png` | 73/49/73/74 | 0 | 0 | `477ae1cb86610a8f7ed9a642cea69800f4fb38a1f650259bb72930a5b15a5fc9` |
| `baby-cart/daigoro-s-cart.png` | 65/49/65/73 | 0 | 0 | `38630ac52c5d02fda2d7a159e84a7c74488cba055e7665643640a0a8c621047f` |
| `baby-cart/dotanuki-sword.png` | 66/49/67/73 | 0 | 0 | `00999bc8e645dc8d60aed17a997d27d501d305115414833a996dfa8053b2d883` |
| `baby-cart/hidden-cart-machine-gun.png` | 46/72/46/97 | 0 | 0 | `4a098706fb036cb026b5417d4f9c818c560c45ba04922c3d36dcaecd57a8c3e2` |
| `baby-cart/daigoro-s-drum.png` | 46/78/46/102 | 0 | 0 | `500c10df3ff4df309196db8feb403a4f1a7d244e076c2ed1acb6e859f7781d61` |
| `banlieue-13/neutron-bomb-detonator.png` | 46/57/46/81 | 0 | 0 | `65e20448a37ef6f23644e9d0a153d16471242efecfbdca4777874241e9f4b307` |
| `banlieue-13/damien-s-badge.png` | 46/75/46/99 | 0 | 0 | `17bddcdcd315a061bb80b3051bc07d6d75ca637328d02360ca060666512ad5fe` |
| `banlieue-13/leito-s-parkour-shoe.png` | 46/89/46/113 | 0 | 0 | `d4e1bbb3085b3cbc8f5a69255e012970c6e2aa8a65c363396a24854d6027c054` |
| `banlieue-13/taha-s-pistol.png` | 46/59/46/83 | 0 | 0 | `605ded7e9818a4644a41f5aeb0e7ac1b309731141249e611f678ceee2109e48d` |

Le contrôle `Proche #FF00FF` compte les pixels visibles situés à une distance
euclidienne RGB inférieure ou égale à 50 de la clé source. Les détails violets
opaques du Berejena sont volontairement conservés : ils ne correspondent pas à
la clé chroma et ont été validés visuellement.

## Fichiers du lot

- `public/sprites/generated/items/digimon-celestial-rift/digivice.png`
- `public/sprites/generated/items/digimon-celestial-rift/crest-of-light.png`
- `public/sprites/generated/items/digimon-celestial-rift/holy-ring.png`
- `public/sprites/generated/items/digimon-celestial-rift/berenjena-gun.png`
- `public/sprites/generated/items/spawn/necroplasm-chain.png`
- `public/sprites/generated/items/spawn/living-cape-clasp.png`
- `public/sprites/generated/items/spawn/military-dog-tags.png`
- `public/sprites/generated/items/spawn/agony-axe.png`
- `public/sprites/generated/items/baby-cart/daigoro-s-cart.png`
- `public/sprites/generated/items/baby-cart/dotanuki-sword.png`
- `public/sprites/generated/items/baby-cart/hidden-cart-machine-gun.png`
- `public/sprites/generated/items/baby-cart/daigoro-s-drum.png`
- `public/sprites/generated/items/banlieue-13/neutron-bomb-detonator.png`
- `public/sprites/generated/items/banlieue-13/damien-s-badge.png`
- `public/sprites/generated/items/banlieue-13/leito-s-parkour-shoe.png`
- `public/sprites/generated/items/banlieue-13/taha-s-pistol.png`
- `docs/audits/generated-item-batch-digimon-spawn-baby-cart-banlieue13-2026-07-19.md`
