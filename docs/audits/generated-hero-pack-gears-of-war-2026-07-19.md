# Production visuelle heros Gears of War - 2026-07-19

## Perimetre

Ce lot est strictement limite aux cinq sprite sheets demandees :

| Heros | Sortie |
| --- | --- |
| Damon Baird | `public/sprites/generated/heroes/gears-of-war/baird.png` |
| Anya Stroud | `public/sprites/generated/heroes/gears-of-war/anya-stroud.png` |
| Colonel Victor Hoffman | `public/sprites/generated/heroes/gears-of-war/hoffman-cog.png` |
| Anthony Carmine | `public/sprites/generated/heroes/gears-of-war/carmine-cog.png` |
| Kait Diaz | `public/sprites/generated/heroes/gears-of-war/kait-diaz.png` |

Aucun manifeste, registre, prompt partage, fichier JavaScript, package ou
fichier Git n'a ete modifie par ce lot.

## References visuelles

### Damon Baird

- Page officielle de `Gears of War: Judgment` :
  https://www.gearsofwar.com/en-ca/games/gears-of-war-judgment/
- Concept art et galerie d'apparences :
  https://gearsofwar.fandom.com/wiki/Damon_S._Baird
- Profil de personnage `Gears of War 3` :
  https://gameinformer.com/b/features/archive/2010/05/22/character-profile%3A-baird%2C-damon-40583.aspx

Incarnation verrouillee : Baird de `Gears of War 3`, cheveux blond peroxide
courts, lunettes de soudure bleues sur le front, visage glabre, armure COG
bleu acier, outils techniques et Mark 2 Lancer. Aucun casque et aucune
apparence de Marcus.

### Anya Stroud

- Fiche et galerie d'apparences :
  https://gearsofwar.fandom.com/wiki/Anya_Stroud
- Galerie `Gears of War 3` :
  https://gearsofwar.fandom.com/wiki/Category:Images_of_Anya_Stroud
- Reference de l'armure COG de `Gears of War 3` :
  https://gameinformer.com/b/features/archive/2012/09/27/cosblog-80.aspx

Incarnation verrouillee : Anya combattante de `Gears of War 3`, cheveux
blonds attaches, silhouette athletique realiste, armure COG ajustee mais
fonctionnelle et Mark 2 Lancer. Aucun vetement civil et aucune
sexualisation.

### Colonel Victor Hoffman

- Fiche, galerie et equipement :
  https://gearsofwar.fandom.com/wiki/Victor_Hoffman

Incarnation verrouillee : Hoffman classique de la guerre Locuste, officier
age au visage severe, casquette COG sombre, armure lourde de commandement et
Mark 2 Lancer. Aucun bandana, aucune lunette et aucun melange avec Marcus.

### Anthony Carmine

- Fiche, galerie et equipement :
  https://gearsofwar.fandom.com/wiki/Anthony_Carmine
- Reference de l'armure COG complete :
  https://gearsofwar.fandom.com/wiki/COG_Armor

Le roster local declare seulement `Carmine`. Pour eviter une fusion entre
freres, la sortie est verrouillee sur Anthony, premier Carmine de la
franchise : armure COG complete, premier casque ferme a doubles optiques
bleues et Mark 2 Lancer. Aucun visage expose, tatouage de Clayton ou texte
`GRUB KILLER`.

### Kait Diaz

- Page officielle `Gears 5` :
  https://www.gearsofwar.com/en-us/games/gears-5/
- Guide de cosplay officiel Kait :
  https://gearsofwarcontent.blob.core.windows.net/community/CosplayGuides/GEARS4_COSPLAY_GUIDE_KAIT.pdf
- Fiche et galerie d'apparences :
  https://gearsofwar.fandom.com/wiki/Kait_Diaz

Incarnation verrouillee : Kait principale de `Gears 5`, visage et
corpulence feminins realistes, cheveux bruns avec tresse rouge, foulard
brun-rouge, armure COG bleu-gris, Lancer conserve et couteau Outsider
utilise pour l'attaque. Aucune armure arctique, transformation de Reine ou
apparence masculine.

## Generation OpenAI

- Outil : OpenAI ImageGen integre, une generation distincte par heros.
- Reference locale : `marcus.png` utilise uniquement pour la grille, la
  densite de pixel art et l'echelle des silhouettes.
- Source : fond chroma magenta uniforme, sans grille ni texte.
- Detourage : helper local `remove_chroma_key.py`, matte adouci et despill.
- Correction : contraction de bord de 1 px lorsque des pixels chroma
  semi-transparents subsistaient.
- Normalisation : `scripts/normalizeGeneratedSpriteSheet.py`.
- Sortie : PNG RGBA transparent, 1024 x 1024.

## Contrat des animations

Chaque planche contient exactement quatre colonnes et quatre lignes de
cellules 256 x 256 :

| Ligne | Animation | Frames |
| --- | --- | ---: |
| 1 | Idle, respiration et garde | 4 |
| 2 | Course vers la droite, phases de pas distinctes | 4 |
| 3 | Attaque canonique | 4 |
| 4 | Impact, recul, desequilibre et reprise | 4 |

Les attaques utilisent le Mark 2 Lancer pour Baird, Anya, Hoffman et
Anthony. Kait utilise son couteau Outsider tout en conservant son Lancer
avec elle.

## Validation technique

| Fichier | Format | Cellules | Marge min. | Cellules dupliquees | Chroma visible | Coins transparents |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `baird.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 px | 4/4 |
| `anya-stroud.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 px | 4/4 |
| `hoffman-cog.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 px | 4/4 |
| `carmine-cog.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 px | 4/4 |
| `kait-diaz.png` | 1024x1024 RGBA | 16/16 | 12 px | 0 | 0 px | 4/4 |

Controles visuels effectues :

- meme personnage, meme visage, meme armure et memes armes dans les seize
  frames de chaque planche ;
- personnages entiers, pieds, cheveux, casque, armes et effets inclus dans
  leur cellule ;
- aucun fragment de sprite voisin ou debordement entre cellules ;
- quatre courses, attaques et reactions reellement distinctes ;
- aucune frame strictement dupliquee ;
- aucune identite melangee, personne supplementaire, texte, logo, grille,
  fond ou filigrane ;
- transparence exploitable, aucun RGB cache sous alpha nul et aucun pixel
  chroma visible.

## Empreintes SHA-256

| Fichier | SHA-256 |
| --- | --- |
| `baird.png` | `65F87CEA44F7DD228EC28BAF0172F2A1F6C5803269584F8B372C0457C0669615` |
| `anya-stroud.png` | `EAD12CB799697DE27C4E254048405F99EB7CF777598EF5B356863962AB983E3C` |
| `hoffman-cog.png` | `C74B83CE4E2DD49D837E057710C76AF3B750C0463C2897C6E71F3DF15D32DF17` |
| `carmine-cog.png` | `F1B5CE9FA54F7C38B9EA82AEAC77790E068FF385DD8ED9C32C9BD370B9A0C604` |
| `kait-diaz.png` | `A81761ADC3967E3AB4F4B1DF9C76A8101A1BF1286C6E0EC0F1B7B035404CFBF9` |

Les images sont des interpretations pixel art originales guidees par les
references. Aucun fichier visuel officiel n'est distribue dans le projet.
