# Pack d'items Altered Beast - 2026-07-17

## Perimetre

Pack complet des quatre icones declarees dans
`src/game/loreItemOverrides.js` pour `Altered Beast`.

| Objet | Fichier |
| --- | --- |
| Spirit Ball | `public/sprites/generated/items/altered-beast/spirit-ball.png` |
| Centurion Bracer | `public/sprites/generated/items/altered-beast/centurion-bracer.png` |
| Beast Transformation Stone | `public/sprites/generated/items/altered-beast/beast-transformation-stone.png` |
| Zeus Lightning Urn | `public/sprites/generated/items/altered-beast/zeus-lightning-urn.png` |

## Statut canonique

Le `Spirit Ball` est le pickup canonique documente par le manuel et visible
dans le jeu. Il est libere par les loups et trois orbes permettent au
Centurion de se transformer.

Le `Centurion Bracer`, la `Beast Transformation Stone` et la
`Zeus Lightning Urn` ne sont pas des pickups du jeu original. Ce sont des
extensions OC deja declarees dans le registre du projet. Leur direction
visuelle a donc ete construite a partir d'elements canoniques :

- armure, anatomie et palette du Centurion ;
- ecrans de transformation et silhouettes des formes bestiales ;
- apparence de Zeus, palette des cinematiques et motif de la foudre ;
- architecture et ornements greco-romains d'Altered Beast.

Cette distinction evite de presenter les trois extensions comme des objets
officiels tout en les gardant coherentes avec le lore et la direction
artistique du jeu.

## References visuelles et lore

### Sources principales

- Manuel officiel SEGA Mega Drive Classics :
  https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/34281/manuals/AB_PC_MG_EFIGS_US.pdf?t=1733765074
- Page officielle SEGA 3D Classics - Altered Beast :
  https://games.sega.com/3dclassics/juouki.html
- Sprite sheet Genesis des ennemis et du Spirit Ball :
  https://www.spriters-resource.com/sega_genesis/alterbeast/asset/47766/
- Sprite sheet arcade des cinematiques et de Zeus :
  https://www.spriters-resource.com/arcade/alteredbeast/asset/111648/
- Artwork arcade du Centurion :
  https://sega.fandom.com/wiki/File:Centurion_Altered_Beast_arcade_art.jpg
- Guide de verification du systeme de Spirit Balls :
  https://gamefaqs.gamespot.com/genesis/586022-altered-beast/faqs/72238/getting-started

### Spirit Ball

Points conserves :

- pickup unique sous forme d'orbe flottante ;
- noyau lumineux dense et petite couronne d'energie arcade ;
- silhouette simple et immediatement lisible ;
- discret rappel rouge-orange du sprite Genesis.

La couleur principale bleu-blanc suit explicitement la definition du registre
local. Le sprite Genesis de reference utilise un coeur pale et une couronne
rouge ; la sortie combine donc l'identite du sprite et la palette demandee par
le projet.

### Centurion Bracer

Points conserves :

- vocabulaire visuel du Centurion ressuscite ;
- bronze chaud, reliefs marteles et sangles de cuir ;
- bandes geometriques greco-romaines sans texte lisible ;
- objet vide et autonome, sans bras ni personnage.

### Beast Transformation Stone

Points conserves :

- silhouette bestiale inspiree des transformations loup et ours ;
- pierre sombre et usee, coherente avec les ruines des stages ;
- energie ambree concentree dans la gravure et les fissures ;
- un seul motif animal generique pour ne pas imposer une transformation
  differente de celle du round.

### Zeus Lightning Urn

Points conserves :

- palette noire, bronze, blanche et bleue issue de Zeus et des cinematiques ;
- amphore grecque compacte a deux anses ;
- foudre bleu-blanc contenue dans l'ouverture et une fissure centrale ;
- frises geometriques sans inscription, symbole ou logo copie.

## Generation OpenAI

Mode utilise : OpenAI ImageGen integre, avec une generation distincte par
objet. Les images de reference ont verrouille les silhouettes, les palettes et
les materiaux sans reprendre leur decor, leur interface ou leurs logos.

### Prompt final - Spirit Ball

> Icone de pickup pixel art 16-bit detaillee. Un seul Spirit Ball d'Altered
> Beast : petite orbe flottante, coeur bleu-blanc tres lumineux, halo cyan
> serre et discret scintillement rouge-orange rappelant le sprite Genesis.
> Sphere simple, centree et entierement visible, sans loup, personnage,
> conteneur, texte, logo, decor, ombre ou recadrage, sur fond chroma magenta
> parfaitement uniforme.

### Prompt final - Centurion Bracer

> Icone de pickup pixel art 16-bit detaillee. Un seul brassard de Centurion
> vide : vambrace romain lourd en bronze vieilli, plaques martelees, reliefs
> anguleux, bandes geometriques grecques sans lettres, deux sangles de cuir
> brun et boucles bronze. Objet entierement visible, sans bras, main,
> personnage, arme, texte, decor, ombre ou recadrage, sur fond chroma magenta
> uniforme.

### Prompt final - Beast Transformation Stone

> Icone de pickup pixel art 16-bit detaillee. Une seule pierre antique
> asymetrique en roche gris-charbon, ebrechee et usee, avec une unique
> silhouette de tete bestiale gravee et une energie ambree concentree dans la
> gravure et quelques fissures. Sans personnage, animal complet, texte, logo,
> fragments libres, decor, ombre ou recadrage, sur fond chroma magenta
> uniforme.

### Prompt final - Zeus Lightning Urn

> Icone de pickup pixel art 16-bit detaillee. Une seule amphore grecque sombre
> et complete, deux anses, cerclages en bronze vieilli et frises geometriques
> sans lettres. Un eclair bleu-blanc unique est contenu dans l'ouverture et
> traverse une fissure centrale. Sans Zeus, personnage, visage, texte, logo,
> autre vase, decor, fumee, ombre ou recadrage, sur fond chroma magenta
> uniforme.

## Normalisation

- Generation source en `1536x1536`.
- Extraction locale du fond avec
  `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`.
- Detection automatique de la couleur de bord.
- Matte adouci, despill et contraction de bord de 1 px.
- Redimensionnement final en `512x512` avec echantillonnage nearest-neighbor.
- Conservation de la toile complete : aucun recadrage du sujet.

## Validation technique

| Fichier | Format | Boite alpha | Marges G/H/D/B | Alpha partiel | Chroma residuel |
| --- | --- | --- | --- | ---: | ---: |
| `spirit-ball.png` | 512x512 RGBA | 94,70 - 412,432 | 94 / 70 / 100 / 80 | 998 px | 0 px |
| `centurion-bracer.png` | 512x512 RGBA | 61,39 - 454,474 | 61 / 39 / 58 / 38 | 894 px | 0 px |
| `beast-transformation-stone.png` | 512x512 RGBA | 59,35 - 448,476 | 59 / 35 / 64 / 36 | 958 px | 0 px |
| `zeus-lightning-urn.png` | 512x512 RGBA | 83,44 - 433,467 | 83 / 44 / 79 / 45 | 928 px | 0 px |

Les quatre coins de chaque image ont un alpha nul.

## Controle visuel final

- exactement un objet distinct par image ;
- aucun objet coupe et aucune marge dangereuse ;
- transparence reelle et aucune frange magenta visible ;
- aucun personnage, main, texte, logo, filigrane, cadre ou decor ;
- silhouettes lisibles en taille d'icone ;
- correspondance exacte entre les noms de fichiers et le registre local.

## Fichiers exclus

Aucun fichier JS, manifeste, registre, commit, push ou deploiement n'a ete
modifie ou execute pour ce lot.
