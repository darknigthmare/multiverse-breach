# Lot OpenAI multi-univers - 19 juillet 2026

## Perimetre livre

Ce lot continue la couverture visuelle et sonore du catalogue sans presenter
le catalogue complet comme termine. Les images sont des compositions originales
en pixel art produites avec OpenAI ImageGen a partir de references visuelles
documentees dans les rapports de chaque univers.

Le lot ajoute au manifeste :

| Type | Avant | Apres | Ajout |
| --- | ---: | ---: | ---: |
| Heros | 347 | 365 | +18 |
| Ennemis | 100 | 121 | +21 |
| Boss et world boss | 93 | 105 | +12 |
| Objets | 154 | 186 | +32 |
| Finales | 0 | 0 | 0 |
| Vues de stages | 92 | 124 | +32 |
| Total | 786 | 901 | +115 |

Les huit packs de stages complets contiennent chacun sept fichiers :

- Combat ;
- Melee ;
- backdrop Melee ;
- atlas de plateformes Melee ;
- RPG ;
- Tactics en perspective trois-quarts ;
- atlas de tuiles Tactics.

Univers couverts par ces packs : `The Predator`, `Predator: Killer of Killers`,
`Predator: Badlands`, `Daft Punk`, `Splatterhouse`, `Streets of Rage`,
`Toy Soldiers` et `Zombies Ate My Neighbors`.

## Musique dynamique

Le moteur musical utilise uniquement des compositions procedurales originales.
Les nouveaux profils dedies couvrent notamment `Splatterhouse`,
`Streets of Rage`, `Toy Soldiers`, `Stargate` et
`Zombies Ate My Neighbors`.

L'audit couvre :

- 293 profils de stages ;
- 1 172 variantes mode/stage ;
- 1 172 cles runtime uniques ;
- le fallback Nexus obligatoire lorsqu'un DLC est masque ;
- les stages fusionnes et leurs sources multiples.

## Verification des images

Un audit technique a inspecte les 145 nouveaux fichiers :

- 57 plaquettes de sprites en `1024 x 1024`, RGBA et grille `4 x 4` ;
- 32 icones d'objets en `512 x 512`, RGBA ;
- 56 fichiers de stages aux dimensions attendues par leur mode.

Resultat final : zero erreur de dimension, zero frame vide, zero debordement
de frame et zero couleur residuelle sous les pixels totalement transparents.

Les plaquettes Alien et Matrix ont ete renormalisees apres inspection visuelle
afin de rattacher les petites parties de silhouette que la generation avait
placees dans une frame voisine.

## Validation moteur

- `npm run lint` : valide ;
- `npm run build` : valide ;
- `npm run check:progression` : valide ;
- `npm run items:audit` : 96 objets disponibles et 24 univers complets ;
- `npm run music:audit` : valide ;
- syntaxe de `normalizeGeneratedSpriteSheet.py` : valide ;
- `git diff --check` : valide.

Le parcours navigateur a aussi ete execute sur une trace locale neuve :

- intro, creation d'Ancre, prologue et Hub accessibles ;
- aucune erreur JavaScript, requete echouee ou image cassee ;
- aucun overlay Vite ;
- rendu bureau `1440 x 1000` sans superposition incoherente ;
- rendu mobile `390 x 844` sans debordement horizontal ni controle hors ecran.

Le build conserve un avertissement non bloquant sur la taille du chunk
`HubScreen`. Ce point releve d'un futur decoupage de bundle et pas d'une
regression introduite par ce lot.

## Manques assumes

Le manifeste global recense encore 4 199 sorties sans fichier final, dont les
55 finales. Ce lot augmente la couverture verifiee mais ne pretend donc pas
achever les 5 100 demandes du catalogue.
