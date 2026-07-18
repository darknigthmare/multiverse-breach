# Pack de stages System of a Down - 18 juillet 2026

## Périmètre

Pack OpenAI principal du profil `System of a Down`.

Le profil narratif `arc-soad-toxicity` n'a pas été utilisé et aucun de ses
assets n'a été modifié.

Lieu retenu :

> Une marche urbaine militarisée qui débouche sur un banquet de propagande,
> interprétée comme un décor audiovisuel original inspiré de B.Y.O.B.

Le décor combine la rigueur graphique de la marche, le banquet abandonné,
les structures métalliques d'un plateau de tournage et une rue industrielle
transformée en espace de protestation. Les écrans ont volontairement été
laissés vierges pour conserver la référence visuelle sans introduire de texte
lisible.

## Références primaires consultées

- [Discographie officielle de System of a Down](https://www.systemofadown.com/music) :
  `Mezmerize`, album de B.Y.O.B., est daté du 17 mai 2005.
- [System Of A Down - B.Y.O.B. (Official HD Video)](https://www.youtube.com/watch?v=zUzd9KyIDrM) :
  source visuelle principale publiée par la chaîne officielle du groupe.
- [B.Y.O.B. sur Apple Music](https://music.apple.com/us/music-video/b-y-o-b/327361488) :
  page officielle de la vidéo, classée Rock et datée de 2005.
- [B.Y.O.B. - Single sur Apple Music](https://music.apple.com/us/album/b-y-o-b-single/201268274) :
  métadonnées officielles du single, publié le 29 mars 2005 par Sony Music
  Entertainment et American Recordings.

Les plans du clip officiel ont servi à verrouiller :

- le contraste noir et blanc de la marche ;
- les accents rouges très contrôlés ;
- la lumière jaune-vert sale du banquet et de la fête ;
- les structures métalliques, la fumée et l'architecture urbaine ;
- les écrans anonymes et la logique de plateau audiovisuel.

Les assets finaux sont des compositions originales. Aucun photogramme n'a été
copié directement.

## Fichiers produits

| Fichier | Dimensions | Canal | Usage |
|---|---:|---|---|
| `combat.webp` | 1536 x 864 | RGB | Arène latérale 16:9, sol continu et centre libre |
| `melee.webp` | 1536 x 864 | RGB | Fond Mêlée sans plateforme intégrée |
| `melee-backdrop.webp` | 1536 x 864 | RGB | Copie binaire du fond Mêlée pour la parallaxe |
| `melee-platforms.webp` | 1024 x 1024 | RGBA | Atlas transparent de plateformes |
| `rpg.webp` | 1536 x 864 | RGB | Vue RPG latérale 2.5D, voie centrale dégagée |
| `tactics.webp` | 1536 x 1024 | RGB | Vue 3/4 élevée, grille rectangulaire 8 x 6 |
| `tactics-tiles.webp` | 1024 x 1024 | RGBA | Atlas transparent de cases et couvertures |

Chemin :

`public/backgrounds/lore-stages/system-of-a-down/`

Le dossier contient exactement ces sept fichiers.

## Méthode de génération

Les six compositions sources ont été produites avec le mode intégré OpenAI
ImageGen :

1. un fond Combat servant d'ancre de palette et de matériaux ;
2. un fond Mêlée utilisé à l'identique pour `melee.webp` et
   `melee-backdrop.webp` ;
3. un fond RPG ;
4. un terrain Tactics ;
5. un atlas de plateformes Mêlée sur chroma magenta uniforme ;
6. un atlas de cases et couvertures Tactics sur chroma magenta uniforme.

Les deux atlas ont ensuite été détourés localement avec le helper officiel du
skill ImageGen, puis exportés en WebP RGBA. Aucun modèle CLI ou fallback
`gpt-image-1.5` n'a été utilisé.

## Prompts finaux

### Combat

- Rue industrielle de nuit transformée en plateau audiovisuel anti-guerre.
- Marche militarisée vide, banquet abandonné au fond, écrans CRT vierges,
  structures métalliques, fumée blanche et éclairages rouges/jaune-vert.
- Pixel art 32-bit détaillé, caméra strictement latérale 16:9.
- Sol asphalté continu et 60 % du centre dégagé.
- Aucun personnage, soldat, musicien, logo, texte, symbole, UI ou plateforme.

### Mêlée et backdrop

- Même identité visuelle que Combat, avec davantage de profondeur de parallaxe.
- Bannières de tissu vierges, banquet et écrans maintenus loin derrière.
- Partie basse et centre libres pour les plateformes dynamiques du moteur.
- Aucun rebord, escalier, plateau ou élément de collision peint dans le fond.

### Atlas Mêlée

- Pièces orthographiques latérales séparées sur chroma `#FF00FF`.
- Plateformes longues, moyennes et courtes en asphalte et acier.
- Passerelles de truss, blocs de contrôle en béton, table de banquet renforcée,
  extrémités et supports.
- Toutes les arêtes jouables sont droites et horizontales.
- Aucun élément n'est transformé en créature.

### RPG

- Rue/plateau en vue latérale 2.5D avec sol légèrement fuyant.
- Banquet, écrans vierges, barricades et structures confinés au fond ou aux
  extrémités.
- Large voie de combat horizontale sans occlusion.
- Palette noire, rouge et jaune-vert cohérente avec le reste du pack.

### Tactics

- Caméra élevée trois-quarts à environ 30-35 degrés.
- Grille rectangulaire exacte de 8 colonnes par 6 rangées, soit 48 cases.
- Neuf limites verticales et sept limites horizontales continues.
- Rangées avant visuellement placées devant les rangées arrière.
- Aucun angle top-down, aucune grille en losange ou hexagonale.
- Couvertures et accessoires repoussés sur les bords.

### Atlas Tactics

- Cases d'asphalte cohérentes avec la caméra élevée trois-quarts.
- Variantes normales, fissurées, mouillées et endommagées.
- Barrières en béton, barrières mobiles, caisses techniques, écrans CRT
  vierges, table de banquet, câble, support de truss et balise rouge.
- Pièces séparées sur chroma `#FF00FF`, sans ombre portée ni fond de scène.

## Inspection visuelle

- Cohérence de palette, d'éclairage et de matériaux sur les sept fichiers.
- Aucun membre du groupe, personnage, soldat, foule, visage ou silhouette.
- Aucun logo, drapeau, emblème, mot lisible, nombre, UI ou watermark.
- Les écrans sont vierges et ne portent aucun message.
- Les tables, écrans, câbles, barrières et structures restent des objets
  ordinaires ; aucun prop ne ressemble à une créature.
- Combat : sol continu, centre dégagé, accessoires repoussés au fond et aux
  extrémités.
- Mêlée : aucun élément de plateforme n'est cuit dans le backdrop.
- RPG : lecture latérale 2.5D et voie centrale exploitable.
- Tactics : angle élevé trois-quarts, grille complète 8 x 6 et lecture
  avant/arrière cohérente.
- Atlas : silhouettes entières, pièces séparées, aucun élément recadré.
- Inspection finale effectuée sur une planche de contact des sept assets et sur
  les fichiers Combat, RPG, Tactics et plateformes en résolution complète.

## Audit Pillow

| Fichier | Taille fichier | Mode | Contrôle |
|---|---:|---|---|
| `combat.webp` | 272 024 octets | RGB | 1536 x 864 |
| `melee.webp` | 311 802 octets | RGB | 1536 x 864 |
| `melee-backdrop.webp` | 311 802 octets | RGB | Identique bit à bit à `melee.webp` |
| `melee-platforms.webp` | 563 236 octets | RGBA | Alpha 0..255, coins transparents |
| `rpg.webp` | 392 118 octets | RGB | 1536 x 864 |
| `tactics.webp` | 503 770 octets | RGB | 1536 x 1024 |
| `tactics-tiles.webp` | 719 186 octets | RGBA | Alpha 0..255, coins transparents |

Mesures alpha :

- `melee-platforms.webp` :
  655 521 pixels transparents, 61 439 partiellement transparents et
  331 616 opaques ;
- `tactics-tiles.webp` :
  656 428 pixels transparents, 48 627 partiellement transparents et
  343 521 opaques ;
- quatre coins à alpha 0 sur les deux atlas ;
- aucun pixel magenta résiduel détecté parmi les pixels visibles ;
- six hashes uniques pour sept fichiers, le seul doublon étant la paire
  Mêlée/backdrop volontaire.

## Hors périmètre

Aucun fichier JavaScript, JSON ou manifeste n'a été modifié.

Aucun commit, push GitHub ou déploiement Vercel n'a été effectué.
