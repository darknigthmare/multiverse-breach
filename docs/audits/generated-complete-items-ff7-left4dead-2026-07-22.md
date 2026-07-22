# Audit OpenAI ImageGen - objets Final Fantasy VII et Left 4 Dead

Date : 2026-07-22

## Perimetre

Ce lot ajoute exactement deux packs lore actifs et huit icones originales
fan-made :

- Final Fantasy VII : Buster Sword, Ribbon, Restore Materia et Bombing Mission
  Detonator ;
- Left 4 Dead : Auto Shotgun, First Aid Kit, Pain Pills et Rescue Radio.

Les stems historiques sont respectivement `final_fantasy_vii` et
`left_4_dead`. L'ordre des objets conserve le contrat du registre : attaque,
defense, soin/tempo, puis evenement. En dehors des huit entrees et des trois
assertions de cardinalite, aucun autre univers, JS, JSON ou manifeste n'a ete
modifie pour ce lot.

Cardinalites finales du registre :

- 115 univers actifs ;
- 117 policies, dont les deux policies desactivees existantes ;
- 460 IDs et 460 chemins d'icones uniques.

## Fichiers produits

### Final Fantasy VII

- `public/sprites/generated/items/final-fantasy-vii/buster-sword.png`
- `public/sprites/generated/items/final-fantasy-vii/ribbon.png`
- `public/sprites/generated/items/final-fantasy-vii/restore-materia.png`
- `public/sprites/generated/items/final-fantasy-vii/bombing-mission-detonator.png`

### Left 4 Dead

- `public/sprites/generated/items/left-4-dead/auto-shotgun.png`
- `public/sprites/generated/items/left-4-dead/first-aid-kit.png`
- `public/sprites/generated/items/left-4-dead/pain-pills.png`
- `public/sprites/generated/items/left-4-dead/rescue-radio.png`

## References

### Final Fantasy VII

Sources officielles Square Enix :

- [FINAL FANTASY VII - portail officiel](https://na.finalfantasy.com/titles/finalfantasy7)
  identifie le jeu original, Cloud, son enorme Buster Sword et la materia comme
  elements centraux ;
- [Cloud au fil des annees](https://na.finalfantasy.com/topics/575) distingue
  explicitement le design de 1997 et son Buster Sword ;
- [FFVII Special Part 6 - Materia](https://na.finalfantasy.com/topics/167)
  explique que la materia est une concentration de mako cristallisee en orbe.

Recoupements canoniques du jeu original :

- [Ribbon (Final Fantasy VII)](https://finalfantasy.fandom.com/wiki/Ribbon_%28Final_Fantasy_VII%29)
  confirme l'accessoire rare de protection contre les alterations d'etat ;
- [Magic Materia - Restore](https://strategywiki.org/wiki/Final_Fantasy_VII/Magic_Materia)
  confirme que Restore appartient a la materia magique verte ;
- [No. 1 Reactor](https://finalfantasy.fandom.com/wiki/No._1_Reactor_%28Final_Fantasy_VII_field%29)
  confirme le lieu ou la charge de la mission d'ouverture est posee et armee.

Choix de fidelite :

- le Buster Sword reprend la grande lame rectangulaire usee, la pointe coupee,
  les deux logements de materia et la longue poignee bordeaux du design 1997 ;
- Ribbon reste un ruban rouge physique unique, sans le confondre avec un
  personnage, un bijou ou un accessoire d'une autre continuite ;
- Restore Materia reste une seule sphere verte de Magic Materia, sans socle ni
  seconde orbe ;
- le detonateur isole le boitier industriel qui arme la charge du reacteur no 1,
  avec ecran vierge et sans ajouter de bombe ou technologie holographique.

### Left 4 Dead

Sources Valve :

- [Left 4 Dead - page Steam officielle](https://store.steampowered.com/app/500/Left_4_Dead/)
  fixe le jeu original de 2008 et son contexte cooperatif ;
- [Valve Developer Community - Left 4 Dead Weapons](https://developer.valvesoftware.com/wiki/Category:Left_4_Dead_Weapons)
  recense explicitement Auto Shotgun, First Aid Kit et Pain Pills ;
- [Left 4 Dead Blog - finale radio](https://www.l4d.com/blog/post.php?id=5150)
  confirme que le casque radio sert a declencher une finale de sauvetage.

Recoupements des modeles et interactions en jeu :

- [Auto Shotgun](https://left4dead.fandom.com/wiki/Auto_Shotgun) documente le
  modele de type M4/M1014, sa crosse et sa lampe ;
- [Healing items](https://left4dead.fandom.com/wiki/Healing_items) documente la
  trousse rouge, son ecusson medical et le flacon de Pain Pills ;
- [Rooftop Finale](https://left4dead.fandom.com/wiki/Rooftop_Finale) confirme
  la radio du toit de Mercy Hospital et l'appel de l'helicoptere.

Choix de fidelite :

- l'Auto Shotgun conserve le recepteur semi-automatique, le magasin tubulaire,
  la crosse ajouree et la lampe, sans munition ou arme supplementaire ;
- le First Aid Kit reste une pochette textile rouge a double fermeture et
  ecusson blanc/rouge, sans mot lisible ;
- Pain Pills reste un unique flacon blanc ferme, bouchon rouge et aplats
  d'etiquette rouge/blanc/bleu sans marque ;
- Rescue Radio reste un transceiver analogique olive, avec grille, antenne,
  voyant, deux boutons et combine relie par son cordon.

## Methode

1. Verification des references officielles et des recoupements canoniques.
2. Ajout des deux packs actifs dans `src/game/loreItemOverrides.js`.
3. Un appel built-in OpenAI ImageGen distinct par objet, sans planche groupee.
4. Generation sur fond chroma parfaitement plat : `#00FF00` pour les objets
   sans vert et `#FF00FF` pour Restore Materia, le detonateur et la radio.
5. Suppression locale du chroma avec le helper installe :

```text
remove_chroma_key.py --auto-key border --soft-matte \
  --transparent-threshold 12 --opaque-threshold 220 \
  --edge-contract 1 --despill --force
```

6. Redimensionnement final en `512 x 512` RGBA avec remise a zero du RGB sous
   alpha nul.
7. Mesure des quatre marges sur la boite alpha ; l'Auto Shotgun a ete recentre
   et reduit a 90,72 % apres detourage pour garantir au moins 32 px.
8. Inspection individuelle des huit PNG, puis controle commun sur fond clair
   et sombre.

## Prompts finaux

Socle applique a chaque appel :

```text
Create exactly one complete physical inventory object as polished detailed
32-bit-era hand-pixeled art. Preserve the cited canonical silhouette,
materials and palette without copying official artwork. Center the complete
object with at least 15 percent padding on every side. Use one perfectly flat
solid chroma-key background with no shadow, floor, reflection, gradient or
texture. No person, hand, duplicate object, loose accessory, environment,
readable text, letters, numbers, logo, UI, frame, border or watermark.
```

Specifications propres a chaque objet :

| Fichier | Chroma | Specification visuelle |
| --- | --- | --- |
| `buster-sword.png` | `#00FF00` | Lame d'acier rectangulaire usee, pointe coupee, deux logements de materia, garde rivee et poignee bordeaux. |
| `ribbon.png` | `#00FF00` | Ruban de soie cramoisi, noeud compact et exactement deux longues pointes fourchues. |
| `restore-materia.png` | `#FF00FF` | Sphere Magic Materia emeraude, coeur mako clair et reflets internes contenus dans l'orbe. |
| `bombing-mission-detonator.png` | `#FF00FF` | Boitier AVALANCHE olive-noir, interrupteur rouge protege, ecran ambre vierge, deux boutons et fils solidaires. |
| `auto-shotgun.png` | `#00FF00` | Fusil semi-automatique type M4/M1014, magasin tubulaire, crosse ajouree, visee et lampe sous le garde-main. |
| `first-aid-kit.png` | `#00FF00` | Pochette nylon rouge, double fermeture noire, poignee et ecusson medical sans texte. |
| `pain-pills.png` | `#00FF00` | Flacon pharmacie blanc ferme, bouchon rouge et etiquette abstraite rouge/blanc/bleu. |
| `rescue-radio.png` | `#FF00FF` | Radio de finale olive, grille noire, antenne, deux boutons creme, voyant rouge et combine relie. |

## Validation technique

| Fichier | Marges G/H/D/B | Min. | RGB sous alpha 0 | Chroma visible | SHA-256 |
| --- | --- | ---: | ---: | ---: | --- |
| `buster-sword.png` | 49/37/34/37 | 34 | 0 | 0 | `eac7ede2debda459d7ccecb5f7c466cd6256b5f364d217e5663290ac79415381` |
| `ribbon.png` | 94/71/97/71 | 71 | 0 | 0 | `a0ee1d2a0ce7b5792d4823e6f8d3052bc26286fba7358160105f7b77b96a63b5` |
| `restore-materia.png` | 98/88/92/93 | 88 | 0 | 0 | `59604d4aa8d7a80fc2a7d976c97f9027c4875a86ccb941a986684590f78fa320` |
| `bombing-mission-detonator.png` | 48/86/35/86 | 35 | 0 | 0 | `152371aa7278d865bf38aeeb3af80d578856d05cebfc1ae0eb646170b775e81c` |
| `auto-shotgun.png` | 36/115/36/116 | 36 | 0 | 0 | `9b4880e5ac464d20b5543d0caeecc44389c9e76836d60305b62e9aa2e3697f1e` |
| `first-aid-kit.png` | 56/65/56/73 | 56 | 0 | 0 | `631d4ffe8788989d63d6d0adc9d7934189d2b32f5d7f4830b586f0d4ee2556d7` |
| `pain-pills.png` | 147/42/147/57 | 42 | 0 | 0 | `7c715072b973f3f77bc47b78711882b24a06fc53f4fc70560c1a19b495e917b6` |
| `rescue-radio.png` | 57/47/68/71 | 47 | 0 | 0 | `b5403484b35c3fc0b5131124dd503802458568ef2420bb31070891fd396fbab7` |

Resultat agrege :

```json
{
  "files": 8,
  "dimensionsValid": 8,
  "rgbaValid": 8,
  "transparentCornersValid": 8,
  "minimumMarginValid": 8,
  "hiddenRgbViolations": 0,
  "visibleChromaPixels": 0,
  "visualReviewPassed": 8
}
```

Le controle du registre a ensuite ete execute avec la commande demandee :

```text
cmd /c npm run items:audit
```

Resultat : sortie `0`, 460 objets recenses, 200 icones disponibles et 50
univers complets. `Final Fantasy VII` et `Left 4 Dead` figurent tous les deux
dans `completeUniverseNames`. Les 260 chemins encore absents appartiennent aux
autres packs historiques et restent hors de ce perimetre.

## Inspection visuelle

Les huit silhouettes sont completes, distinctes et lisibles a l'echelle d'un
pickup. Chaque PNG contient un seul objet physique ; les cordons du detonateur
et de la radio restent relies a leur boitier. Aucun texte, chiffre, logo, UI,
personnage, main, doublon ou accessoire parasite n'est visible. Les contours
restent propres sur fonds clair et sombre et aucun objet n'est coupe.

Resultat : **PASS - 8 / 8 icones**.
