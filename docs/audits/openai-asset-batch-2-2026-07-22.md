# Passe assets OpenAI et integration runtime - 22 juillet 2026

## Perimetre livre

Cette tranche poursuit la couverture visuelle et musicale des univers sans
presenter le catalogue comme termine. Elle ajoute 82 fichiers image originaux
fan-made generes avec OpenAI ImageGen :

- 21 fichiers de stages, soit trois packs complets de sept vues pour
  `Hazbin Hotel`, `Oliver Tree` et `Vocaloid` ;
- 29 plaquettes de sprites pour les menaces Predator, les boss de
  Resident Evil / Silent Hill et huit world boss d'anime ;
- 32 icones d'objets ramassables pour huit univers.

Trois profils musicaux proceduraux dedies ont aussi ete ajoutes :

- `mus-hazbin-hotel` ;
- `mus-oliver-tree` ;
- `mus-vocaloid`.

Les rapports specialises de `docs/audits/` consignent les choix de lore, les
references et la direction de chaque pack.

## Integration des manifests

La regeneration `npm run sprites:prompts` a fait evoluer le registre de 901 a
974 sorties disponibles :

| Categorie | Avant | Apres | Delta |
| --- | ---: | ---: | ---: |
| Heroes | 365 | 365 | 0 |
| Enemies | 121 | 130 | +9 |
| Bosses | 105 | 125 | +20 |
| Items | 186 | 218 | +32 |
| Finales | 0 | 0 | 0 |
| Stages | 124 | 136 | +12 |
| **Total** | **901** | **974** | **+73** |

Les neuf fichiers de stage restants sont les atlas compagnons de plateformes
et de tuiles. Ils sont references par les profils de stage mais ne constituent
pas des entrees de stage autonomes dans le compteur principal.

Etat du registre des stages apres regeneration :

- 34 profils ;
- 136 backdrops ;
- 102 fichiers compagnons.

## Corrections visuelles

Trois sorties ont ete regenerees apres inspection des planches de contact :

- `Memory of Alessa` ne porte plus d'armes a feu et reprend une projection
  blanche, psychique et surnaturelle coherente avec Silent Hill ;
- `Father` est maintenant clairement un homme adulte blond et barbu en robe
  blanche, sans silhouette feminine parasite ;
- les vues Melee d'Oliver Tree occupent toute la hauteur avec un chantier
  dense, sans grande zone de brouillard vide ni plateformes de collision
  fusionnees au fond.

Le controle automatise des 82 images valide les dimensions, les modes RGB ou
RGBA, les marges, les cellules de sprites non vides, la transparence des atlas
et l'absence de couleur cachee sous les pixels transparents.

## Verification application

Les controles suivants passent :

- `npm run lint` ;
- `npm run build` ;
- `npm run check:progression` ;
- `npm run items:audit` ;
- `npm run music:audit` ;
- `git diff --check` ;
- analyse syntaxique AST de `scripts/normalizeGeneratedSpriteSheet.py`.

Le build conserve l'avertissement preexistant sur la taille du chunk
`HubScreen` (environ 2,32 MB). Il ne bloque pas le build, mais reste un axe de
decoupage futur.

Une verification Chrome neuve a couvert l'introduction, l'identification
locale, le prologue et le Hub en `1440 x 1000`, puis le Hub en `390 x 844` :

- aucune exception runtime ou erreur console ;
- aucun chargement reseau echoue ;
- aucune image HTML cassee ;
- aucun overlay Vite ;
- aucun debordement horizontal ;
- aucune superposition incoherente observee sur les captures.

## Limites connues

Le registre de prompts comporte 5 100 sorties cibles. Avec 974 sorties
disponibles, 4 126 restent a produire, dont 55 finales. Cette tranche ameliore
donc nettement la couverture sans terminer le catalogue.

Le lot de huit heros Predator prevu dans la meme passe n'a pas ete genere :
ImageGen a atteint sa limite d'usage avant leur lancement. Aucune entree vide
ou fausse disponibilite n'a ete ajoutee pour ces huit personnages ; le compteur
Heroes reste volontairement a 365.
