# Pack d'objets ramassables Dynamite Duke

Date : 2026-07-17

## Perimetre

Ce lot genere avec OpenAI ImageGen les quatre objets declares pour
`Dynamite Duke` dans `src/game/loreItemOverrides.js` :

- `Cybernetic Arm Plate`
- `Machine Gun`
- `Flash Bomb`
- `Red Ammo Crate`

Les images finales sont des icones pixel art isolees en `512x512 RGBA`, sur
fond transparent. Aucun fichier JavaScript, manifeste ou registre partage n'a
ete modifie pendant cette generation.

## References visuelles et lore

La direction visuelle repose en priorite sur les documents et captures du jeu :

- [flyer japonais Seibu Kaihatsu de 1989, recto et verso](https://flyers.arcade-museum.com/videogames/show/6045) ;
- [captures arcade Dynamite Duke](https://www.mobygames.com/game/16651/dynamite-duke/screenshots/) ;
- [description detaillee des armes et pickups](https://gamefaqs.gamespot.com/sms/575448-dynamite-duke/faqs/73830) ;
- [analyse illustree du gameplay et du Dynamite Punch](https://extralives.wordpress.com/2015/02/26/cyber-armed-commandos-from-arcades-past-dynamite-duke/).

Le flyer sert de reference principale pour le bras cybernetique blanc/argent,
les articulations sombres et la palette rouge-acier. Les captures du jeu
servent de reference pour les proportions massives, le rendu arcade et la
forme compacte de l'arme. Le guide documente explicitement la caisse rouge avec
des balles a l'interieur ainsi que le Flash Bomb represente en jeu par un `D`
dans un carre rouge.

## Decisions de fidelite lore

### Cybernetic Arm Plate

Cet objet de projet derive de l'equipement iconique de Duke plutot que d'un
pickup nomme dans le jeu original. L'icone reprend donc une plaque de
protection de son avant-bras droit :

- plaques blanches et argent segmentees ;
- interstices mecaniques noirs ;
- gros rivets et charnieres ;
- petit voyant rouge coherent avec la description du registre ;
- aucune main ou partie biologique.

### Machine Gun

L'arme conserve une construction militaire de la fin des annees 1980 :

- boitier rectangulaire gunmetal ;
- capot superieur gris clair ;
- canon court nervure ;
- chargeur droit compact ;
- crosse metallique repliee ;
- aucun rail, viseur ou accessoire moderne.

### Flash Bomb

Le jeu ne montre pas de modele physique detaille : l'inventaire et le pickup
utilisent surtout la lettre `D`. Comme l'icone finale ne doit contenir aucun
texte, la bombe est interpretee comme un unique dispositif militaire compact
en acier avec levier, anneau de securite et large bande rouge non marquee.
Cette forme preserve sa fonction de bombe de nettoyage d'ecran sans inventer
une technologie moderne ou un logo.

### Red Ammo Crate

Le guide de jeu decrit explicitement un pickup sous la forme d'une boite rouge
avec des balles a l'interieur. L'icone reprend donc :

- une seule caisse metallique rouge ;
- un couvercle entrouvert ;
- une rangee ordonnee de cartouches en laiton ;
- des coins renforces gunmetal et un verrou frontal ;
- aucun marquage imprime.

## Fichiers generes

| Objet | Chemin | Dimensions | Mode |
| --- | --- | --- | --- |
| Cybernetic Arm Plate | `public/sprites/generated/items/dynamite-duke/cybernetic-arm-plate.png` | 512x512 | RGBA |
| Machine Gun | `public/sprites/generated/items/dynamite-duke/machine-gun.png` | 512x512 | RGBA |
| Flash Bomb | `public/sprites/generated/items/dynamite-duke/flash-bomb.png` | 512x512 | RGBA |
| Red Ammo Crate | `public/sprites/generated/items/dynamite-duke/red-ammo-crate.png` | 512x512 | RGBA |

## Prompts finaux

### Cybernetic Arm Plate

```text
Creer une unique plaque d'avant-bras cybernetique amovible derivee du bras
droit canonique de Duke : blindage blanc-argent segmente, interstices de
charniere noirs, boulons exposes, petit voyant circulaire rouge et usure
legere. L'objet doit etre une piece d'armure et non un bras biologique.
Pixel art 16/32-bit detaille, vue catalogue trois-quarts, objet entier centre
avec marge. Aucun personnage, main, arme, texte, logo, decor, ombre ou element
coupe. Fond chroma uniforme #00ff00.
```

### Machine Gun

```text
Creer une unique mitrailleuse compacte fidele a l'esthetique Dynamite Duke
1989 : boitier rectangulaire gunmetal, capot gris argent, canon court nervure,
chargeur droit compact, crosse metallique repliee et petit detail rouge.
Aucun rail ou viseur moderne. Pixel art 16/32-bit detaille, vue laterale
trois-quarts, arme complete et centree. Aucun personnage, main, tir, texte,
logo, decor, ombre ou element coupe. Fond chroma uniforme #00ff00.
```

### Flash Bomb

```text
Creer une unique Flash Bomb de Dynamite Duke sous la forme d'un dispositif
militaire compact de la fin des annees 1980 : corps rond en acier brosse,
bouchon nervure, levier et anneau de securite, large bande rouge vierge et
petite lentille blanche. Pixel art 16/32-bit detaille, vue trois-quarts,
objet entier centre avec marge. Aucune explosion, fumee, lettre D, texte,
logo, personnage, decor, ombre ou element coupe. Fond chroma uniforme
#00ff00.
```

### Red Ammo Crate

```text
Creer une unique petite caisse de munitions metallique rouge, fidele au pickup
decrit dans Dynamite Duke : coins gunmetal renforces, verrou frontal, couvercle
entrouvert et une rangee ordonnee de grosses cartouches de mitrailleuse en
laiton. Pixel art 16/32-bit detaille, vue catalogue trois-quarts, caisse
entiere centree avec marge. Aucun personnage, arme, balle eparpillee, texte,
logo, decor, ombre ou element coupe. Fond chroma uniforme #00ff00.
```

## Validation

| Fichier | Boite alpha | Marges G/H/D/B | Coins transparents | Pixels chroma residuels |
| --- | --- | --- | --- | --- |
| `cybernetic-arm-plate.png` | `(85, 42, 429, 475)` | `85 / 42 / 83 / 37` | 4/4 | 0 |
| `machine-gun.png` | `(27, 147, 492, 362)` | `27 / 147 / 20 / 150` | 4/4 | 0 |
| `flash-bomb.png` | `(145, 112, 360, 406)` | `145 / 112 / 152 / 106` | 4/4 | 0 |
| `red-ammo-crate.png` | `(82, 103, 458, 430)` | `82 / 103 / 54 / 82` | 4/4 | 0 |

Controles effectues :

- inspection visuelle individuelle des quatre PNG ;
- dimensions exactes `512x512` ;
- mode `RGBA` et alpha reel de `0` a `255` ;
- quatre coins totalement transparents pour chaque fichier ;
- aucun reliquat chroma vert avec alpha superieur a 32 ;
- aucune silhouette coupee ;
- un seul objet par image ;
- aucun personnage, texte, logo ou filigrane ajoute ;
- les quatre chemins declares dans `loreItemOverrides.js` existent.
