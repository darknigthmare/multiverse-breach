# Production ennemis et boss Stargate SG-1 - 2026-07-19

## Perimetre livre

Ce lot complete six feuilles absentes sans remplacer les assets Stargate deja
presents :

| Role | Entite | Fichier final |
|---|---|---|
| Ennemi | Ash'rak Assassin | `public/sprites/generated/bosses/stargate/ashrak-assassin.png` |
| Ennemi | Horus Guard Phalanx | `public/sprites/generated/bosses/stargate/horus-guard-phalanx.png` |
| Ennemi | Unas Host Warrior | `public/sprites/generated/bosses/stargate/unas-host-warrior.png` |
| Boss | Replicator Queen Node | `public/sprites/generated/bosses/stargate/replicator-queen-node.png` |
| Boss | Replicator Carter Echo | `public/sprites/generated/bosses/stargate/replicator-carter-echo.png` |
| Boss | Adria Ori Vessel | `public/sprites/generated/bosses/stargate/adria-ori-vessel.png` |

Aucun fichier de code, manifeste, prompt global, `package.json` ou etat Git
n'a ete modifie pour produire ce lot.

## References canoniques inspectees

Les PNG livres sont des interpretations pixel art originales generees avec
OpenAI ImageGen. Les images de production ci-dessous ont uniquement servi de
references de silhouette, costume, materiau et equipement.

### Ash'rak Assassin

- [Stargate-Project - Ashrak, Allegiance](https://www.stargate-project.de/ashrak-allegiance)
- [GateWorld - Allegiance](https://www.gateworld.net/sg1/s6/allegiance/)

Version retenue : l'Ash'rak de `Allegiance`, avec casque sombre a visiere,
armure cuir/metal anthracite, couteau et dispositif de camouflage. Aucun
Ma'Tok, fusil moderne ou effet magique n'a ete ajoute.

### Horus Guard Phalanx

- [GateWorld Omnipedia - Horus Guard](https://www.gateworld.net/wiki/Horus_guard)
- [Stargate-Project - Horus Guard prop reference](https://www.stargate-project.de/neue-prop-repliken-aus-stargate-sg-1-von-hollywood-collectibles)
- [Stargate-Project - Horus Guard licensed replica preview](https://www.stargate-project.de/apophis-horus-guards-neue-stargate-modelle-angeteast)

Version retenue : une seule Horus Guard par cellule, dans l'armure elite de Ra,
avec grand casque faucon articule, panneaux egyptiens bronze et baton Ma'Tok.
La silhouette ne reprend ni le casque serpent, ni le casque chacal d'Anubis.

### Unas Host Warrior

- [Stargate-Project - Unas, Demons](https://www.stargate-project.de/unas)
- [Apple TV - Enemy Mine](https://tv.apple.com/us/episode/enemy-mine/umc.cmc.a1mb6vd3y2tq4uqcra3p5lbq?showId=umc.cmc.10dkkj9ftj6k72vr4i76ogknm)
- [Stargate-Project - Unas species notes](https://www.stargate-project.de/lexikon-sg-1)

Version retenue : Unas reptilien massif et primitif, avec arcades et cornes
craniennes, machoire dentee, peau olive-grise, griffes, chaines et vetements
de cuir rudimentaires. Aucun dragon, armure technologique ou visage humain.

### Replicator Queen Node

- [GateWorld Omnipedia - Replicators](https://www.gateworld.net/wiki/Replicators)
- [GateWorld Omnipedia - Replicator blocks](https://www.gateworld.net/wiki/Replicator_blocks)
- [GateWorld - Unnatural Selection](https://www.gateworld.net/sg1/s6/unnatural-selection/)

`Replicator Queen Node` reste l'ID gameplay du projet. Son visuel n'invente
pas de femme reine : il s'agit d'un gros noeud mobile insectoide entierement
compose de blocs Replicateurs argent-gris. Les attaques montrent uniquement
assemblage, extension de blocs, essaim compact et reconstitution.

### Replicator Carter Echo

- [GateWorld - Gemini](https://www.gateworld.net/sg1/s8/gemini/)
- [GateWorld - Reckoning, Part 1](https://www.gateworld.net/sg1/s8/reckoning-part-1/)
- [Stargate-Project - Replicarter](https://www.stargate-project.de/replicarter)

Version retenue : RepliCarter avec le visage et la coupe blonde courte
d'Amanda Tapping, tailleur noir de `Gemini`, attitude froide et transformations
locales en nanites. La lame, les tentacules et la dispersion restent formes
par les cellules Replicateurs ; aucune armure robotique ou aura magique.

### Adria Ori Vessel

- [Stargate-Project - Adria](https://www.stargate-project.de/adria)
- [Prop Store - screen-worn Adria costume, The Ark of Truth](https://uk.propstoreauction.com/view-auctions/catalog/id/44/lot/9815/index.html)
- [The Companion - Who Are the Ori?](https://www.thecompanion.app/stargate-ori-stargate/)

Version retenue : Adria adulte avec les traits de Morena Baccarin, longue robe
orange brodee, manteau rouge a manches evasees, doublure doree, grand col et
collier de perles du costume ecran. Ses pouvoirs sont limites a l'energie
blanc-or des Ori, sans baton, armure, couronne ou tenue de sorciere generique.

## Contrat d'animation

Chaque fichier est un PNG `RGBA` transparent de `1024x1024`, compose de seize
cellules exactes de `256x256` :

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | `idle` | 4 |
| 2 | `run` / deplacement | 4 |
| 3 | `attack` lore | 4 |
| 4 | `hit` / reconstitution | 4 |

Les sprites utilisent une vue RPG trois-quarts orientee vers la droite. Une
seule entite complete apparait par cellule.

## Post-traitement

- generation separee par entite avec OpenAI ImageGen ;
- chroma vert temporaire uniforme ;
- suppression du chroma avec matte douce, contraction de bord et despill ;
- reconstruction cellule par cellule avec
  `scripts/normalizeGeneratedSpriteSheet.py` ;
- marge interne minimale de 12 pixels dans les seize cellules ;
- nettoyage du RGB cache sous les pixels totalement transparents ;
- suppression des derniers pixels de frange chroma semi-transparents.

## Validation technique

| Fichier | Format | Cellules | Marge min. | Chroma visible | RGB sous alpha 0 | SHA-256 |
|---|---|---:|---:|---:|---:|---|
| `ashrak-assassin.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 | `f9a2bf622fc55f131a083a2dab521425a9df8b782a3e62befcac7470192408d6` |
| `horus-guard-phalanx.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 | `6c800a24cb6e792486e519a699babf6fcb5641252624ad92c992a807eedb7593` |
| `unas-host-warrior.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 | `04cac0b2e59524aab58412327a645aa926223b7579680060f6c2f9e1106f2cb8` |
| `replicator-queen-node.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 | `46a505376b5b61fb2f6bb4285837f37ef80da136619fdf575d22585dbf693569` |
| `replicator-carter-echo.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 | `01a28e9e0fd148bf7b280804bc2874bddda6570c53664a54e8e617954fc32054` |
| `adria-ori-vessel.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 | `d7a7eb641ad53e51b6435937861e3d772eff07040e4224ce0d91de430cc8e264` |

## Controle visuel final

- aucune frame voisine visible dans une cellule ;
- aucune partie importante coupee par une limite de cellule ;
- identite, anatomie, tenue et equipement constants sur les quatre lignes ;
- quatre phases lisibles pour chaque animation ;
- aucune confusion avec les Jackal Guards, Serpent Guards ou Replicator insect
  deja presents ;
- aucune forme feminine inventee pour le noeud Replicateur ;
- aucune grille, texte, decor, sol, ombre portee, logo ou watermark ;
- transparence controlee sur damier, sans frange verte visible.
