# Production ennemis P0 - lot du 2026-07-17

## Perimetre

- Source runtime lue: `src/game/loreEnemyOverrides.js`.
- Etat de disponibilite lu: `public/sprites/generated/sprite-manifest.json`.
- Production limitee a quatre ennemis P0 absents, dans quatre univers distincts.
- Assets Cloverfield, Ecco the Dolphin et Mars Attacks volontairement exclus.
- Generation: outil OpenAI Image Generation integre, une generation distincte par ennemi.
- Post-traitement: detourage chroma local puis normalisation avec `scripts/normalizeGeneratedSpriteSheet.py`.
- Aucun fichier JS ni manifeste partage modifie par ce lot.
- Aucun commit, push ou deploiement effectue.

## Sorties

| Univers | Ennemi | Chemin exact de l override |
|---|---|---|
| Dandadan | Serpo | `public/sprites/generated/bosses/dandadan/serpo.png` |
| Starship Troopers | Warrior Bug | `public/sprites/generated/bosses/starship-troopers/warrior-bug.png` |
| Squid Game | Pink Soldier | `public/sprites/generated/bosses/squid-game/pink-soldier.png` |
| Team Fortress 2 | Heavy | `public/sprites/generated/bosses/team-fortress-2/heavy.png` |

## References et verrous visuels

### Dandadan - Serpo

- Page de reference: https://dandadan.fandom.com/wiki/Serpo
- Reference visuelle anime utilisee:
  https://static.wikia.nocookie.net/dandadan/images/8/8f/The_Serpo_%28True_Form%29_%28Anime%29.png/revision/latest?cb=20241129230738
- Incarnation verrouillee: vraie forme anime, pas le deguisement humain.
- Silhouette verrouillee: tete et torse jaunes rectangulaires, motifs noirs labyrinthiques, large bouche dentee, deux organes circulaires, longs bras et quatre doigts.
- Equipement verrouille: aucun vetement et aucune arme.
- Attaque: pose en T puis emission psychokinetique.

### Starship Troopers - Warrior Bug

- Page de reference: https://starshiptroopers.fandom.com/wiki/Warrior_Bug
- Reference visuelle utilisee:
  https://static.wikia.nocookie.net/starshiptroopers/images/6/6e/STGame_2024-06-30_07-59-29-319.jpg/revision/latest?cb=20240630150229
- Incarnation verrouillee: Warrior Bug de l univers du film de 1997.
- Silhouette verrouillee: carapace noire et orange, corps allonge bas, quatre longues pattes de course, deux grands membres anterieurs en faux et mandibules.
- Equipement verrouille: aucune armure, aucune arme portee, aucune aile et aucun corps humanoide.
- Attaque: double taille des faux puis morsure des mandibules.

### Squid Game - Pink Soldier

- Reference costume officielle:
  https://www.netflix.shop/en-th/products/squid-game-triangle-guard-jumpsuit
- Photogramme de reference utilise:
  https://www.europafm.com/noticias/tv-cine/juego-calamar-significado-circulo-triangulo-cuadrado_20211011616423662daedf000177036e.html
- Incarnation verrouillee: garde soldat de la saison 1 avec masque triangle.
- Silhouette verrouillee: combinaison rose a capuche, masque noir a triangle blanc, gants et bottes noirs, ceinture, harnais et camera de poitrine.
- Equipement verrouille: arme compacte noire avec sangle telle que montree dans le photogramme; aucune arme fantastique.
- Attaque: montee en joue, visee, courte rafale et recul.

### Team Fortress 2 - RED Heavy

- Page officielle de reference: https://wiki.teamfortress.com/wiki/Heavy
- Modele officiel utilise:
  https://wiki.teamfortress.com/w/images/0/08/Heavy.png
- Incarnation verrouillee: apparence par defaut de RED Heavy.
- Silhouette verrouillee: mercenaire chauve massif, chemise rouge, gilet noir, cartouchiere diagonale, pantalon brun et bottes noires.
- Equipement verrouille: Minigun de base Sasha, avec six canons, poignees et tambour clair; aucun cosmetique ni arme alternative.
- Attaque: mise en rotation, rafale, recul et arret des canons.

## Structure des animations

Chaque planche suit le meme contrat:

| Ligne | Animation | Frames |
|---|---|---:|
| 1 | Idle coherent avec l anatomie et l equipement | 4 |
| 2 | Deplacement vers la droite en vue RPG 3/4 | 4 |
| 3 | Attaque canonique de l ennemi | 4 |
| 4 | Reactions aux degats et retour en garde | 4 |

## Validation technique

| Fichier | Format | Cellules | Marge min. | Coins transparents | Fuite bord externe |
|---|---|---:|---:|---|---:|
| `serpo.png` | 1024x1024 RGBA | 16/16 | 12 px | oui | 0 |
| `warrior-bug.png` | 1024x1024 RGBA | 16/16 | 12 px | oui | 0 |
| `pink-soldier.png` | 1024x1024 RGBA | 16/16 | 12 px | oui | 0 |
| `heavy.png` | 1024x1024 RGBA | 16/16 | 12 px | oui | 0 |

Controles visuels effectues:

- aucune identite melangee entre univers;
- aucun sprite voisin visible dans une cellule;
- personnages et creature complets dans les 16 frames;
- armes et accessoires stables entre les lignes;
- attaques differentes des idles et des mouvements;
- fonds detoures et transparence exploitable par le moteur;
- lecture correcte en vue RPG trois-quarts orientee vers la droite.

## Limites assumees

- Les sprites sont des interpretations pixel art originales guidees par les references; aucun asset officiel n est copie dans le jeu.
- Le Serpo utilise surtout la pose corporelle pour rendre l onde psychokinetique, car les effets proches du vert ont ete retires avec le chroma.
- Le Pink Soldier utilise une arme compacte conforme au photogramme, sans tenter de transformer le sprite en catalogue d armement.
