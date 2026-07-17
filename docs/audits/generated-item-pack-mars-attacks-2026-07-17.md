# Pack d'objets ramassables Mars Attacks

Date : 2026-07-17

## Perimetre

Ce lot genere avec OpenAI ImageGen les quatre objets declares pour `Mars Attacks`
dans `src/game/loreItemOverrides.js`.

Les images finales sont des icones pixel art isolees en `512x512 RGBA`, sur fond
transparent. Aucun fichier JavaScript, manifeste ou registre partage n'a ete
modifie pendant cette generation.

## Decisions de fidelite lore

### Martian Ray Gun

Le nom de gameplay reste `Martian Ray Gun`, mais l'image reprend le fusil blaster
reel du film plutot qu'un pistolet generique :

- corps et crosse bleu metallique ;
- reservoirs et bagues rouge-orange ;
- long canon central nervure ;
- double emetteur frontal, dont un relie par un tube courbe.

La reference principale est le prop de production decrit et photographie par
[iCollector / Profiles in History](https://www.icollector.com/Mars-Attacks-Martian-death-ray-prop-rifle_i35005013).
La documentation ILM confirme aussi la construction des rayguns et le choix de
rayons electriques pulses rouges ou verts :
[ILM - Mars Attacks](https://archive.aec.at/media/assets/dc4dc0222aab19ade8c43110cf83659e.pdf).

### Martian Bubble Helmet

Le casque reprend la cloche transparente du film, vide, posee sur un large col
gunmetal avec raccords respiratoires rouges. Aucun cerveau ou personnage n'est
inclus dans l'icone.

References :

- [IFC Center - Mars Attacks](https://www.ifccenter.com/films/mars-attacks/)
- [Propstore - Martian in Space Suit Maquette](https://propstoreauction.com/lot-details/index/catalog/359/lot/120019/Lot-1384-MARS-ATTACKS-1996-Martian-in-Space-Suit-Maquette)
- [ILM - Mars Attacks](https://archive.aec.at/media/assets/dc4dc0222aab19ade8c43110cf83659e.pdf)

### Translation Device

L'objet est represente comme la machine terrestre construite pour le premier
contact, et non comme un traducteur martien portatif. L'icone conserve le grand
boitier gris-bleu, le panneau de connexions, les nombreux cables et les capteurs
poses au-dessus visibles dans la scene du desert.

References :

- [Scene de traduction - image animee](https://makeagif.com/gif/lost-in-translation-mars-attacks-1996-MsB082)
- [Scenario Mars Attacks](https://screencraft.org/wp-content/uploads/2019/11/MarsAttacks.pdf)
- [SYFY - description de la machine de traduction](https://www.syfy.com/syfy-wire/wtf-moments-when-mars-attacks-slapped-a-tiny-dog-head-on-a-human-body)

### Slim Whitman Record

L'icone comprend un disque noir et une pochette country/western entierement
originale. La pochette utilise un paysage de mesa, une guitare et des ondes radio,
sans portrait, nom d'artiste, titre, logo ou reproduction de l'album reel.

Dans le film, `Indian Love Call`, interprete par Slim Whitman, devient la faiblesse
decisive des Martiens : sa diffusion provoque l'explosion de leurs cerveaux. Ce
role est confirme par la fiche officielle de la bande originale :
[Warner Music Japan - Mars Attacks OST](https://wmg.jp/ost/discography/11977/).
La reference physique du disque vient d'un pressage 78 tours documente par
[Achent Records](https://achentrecords.com/product/slim-whitman-indian-love-call-china-doll-country-shellac-78-rpm-1074/).

## Fichiers generes

| Objet | Chemin | Dimensions | Mode |
| --- | --- | --- | --- |
| Martian Ray Gun | `public/sprites/generated/items/mars-attacks/martian-ray-gun.png` | 512x512 | RGBA |
| Martian Bubble Helmet | `public/sprites/generated/items/mars-attacks/martian-bubble-helmet.png` | 512x512 | RGBA |
| Translation Device | `public/sprites/generated/items/mars-attacks/translation-device.png` | 512x512 | RGBA |
| Slim Whitman Record | `public/sprites/generated/items/mars-attacks/slim-whitman-record.png` | 512x512 | RGBA |

## Prompts finaux

### Martian Ray Gun

```text
Creer un unique fusil blaster martien de Mars Attacks (1996), fidele au prop :
longue silhouette retro annees 1950, corps bleu cobalt metallique, crosse
triangulaire, canon central nervure, reservoirs rouge-orange et double emetteur
frontal. Pixel art detaille 16/32-bit, vue laterale trois-quarts, arme entiere et
centree. Aucun personnage, main, tir, texte, logo ou element coupe. Fond chroma
uniforme #00ff00.
```

### Martian Bubble Helmet

```text
Creer un unique casque-bulle vide de Mars Attacks (1996), fidele aux images du
film : grande cloche de verre transparente, large col circulaire gunmetal, bord
argent et petits raccords respiratoires rouges. Aucun cerveau, crane, personnage
ou torse. Pixel art detaille 16/32-bit, casque entier et centre. Aucun texte,
logo ou element coupe. Fond chroma uniforme #ff00ff.
```

### Translation Device

```text
Creer l'unique machine de traduction terrestre de la scene du premier contact de
Mars Attacks (1996) : grand boitier scientifique gris-bleu, panneau arriere
encastre, module central ventile, nombreuses prises rouges et noires, faisceau de
cables pendants, petite antenne angulaire et capteurs au-dessus. Ne pas en faire
un gadget martien portatif. Pixel art detaille 16/32-bit, machine complete et
centree. Aucun personnage, table, decor, texte, logo ou element coupe. Fond
chroma uniforme #00ff00.
```

### Slim Whitman Record

```text
Creer un set d'objet unique compose d'une pochette country/western vintage et
d'un disque vinyle noir partiellement sorti. La pochette doit etre une creation
originale sans portrait ni texte : tons tan, rouille et bleu poussiere, mesa au
coucher du soleil, petite guitare et arcs d'ondes radio. Disque noir avec sillons
et etiquette centrale vierge. L'objet represente le disque dont le yodel sauve
l'humanite dans Mars Attacks. Pixel art detaille 16/32-bit, set complet et centre.
Aucun nom, titre, logo, personnage, decor ou element coupe. Fond chroma uniforme
#00ff00.
```

## Validation

| Fichier | Boite alpha | Marges G/H/D/B | Coins transparents | Pixels chroma residuels |
| --- | --- | --- | --- | --- |
| `martian-ray-gun.png` | `(6, 91, 506, 390)` | `6 / 91 / 6 / 122` | 4/4 | 0 |
| `martian-bubble-helmet.png` | `(82, 41, 426, 470)` | `82 / 41 / 86 / 42` | 4/4 | 0 |
| `translation-device.png` | `(118, 11, 389, 495)` | `118 / 11 / 123 / 17` | 4/4 | 0 |
| `slim-whitman-record.png` | `(41, 74, 489, 433)` | `41 / 74 / 23 / 79` | 4/4 | 0 |

Controles effectues :

- inspection visuelle individuelle des quatre PNG ;
- inspection du pack sur damier sombre ;
- casque teste sur fonds clair, sombre et bleu pour verifier le verre ;
- alpha reel de `0` a `255` pour chaque fichier ;
- aucun reliquat vert ou magenta visible avec alpha superieur a 32 ;
- aucune silhouette coupee ;
- aucun texte, logo, filigrane ou personnage ajoute ;
- les quatre chemins declares dans `loreItemOverrides.js` existent.
