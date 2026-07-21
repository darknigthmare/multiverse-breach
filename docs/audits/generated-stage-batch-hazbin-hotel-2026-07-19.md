# Pack de stages Hazbin Hotel - 19 juillet 2026

## Perimetre

Ce lot ajoute un pack complet de sept vues de stage pour `Hazbin Hotel`.
Les images sont des compositions originales fan-made en pixel art 32-bit,
produites avec OpenAI ImageGen. Elles reprennent le langage architectural
gothique, cabaret et infernal de l'univers sans copier de photogramme, de
personnage, de logo ou d'asset officiel.

Chemin final :

`public/backgrounds/lore-stages/hazbin-hotel/`

## References visuelles et lore

- [A24 - Hazbin Hotel](https://a24films.com/television/hazbin-hotel) :
  page officielle de la serie et visuel de reference principal.
- [Prime Video - Hazbin Hotel saison 1](https://www.primevideo.com/detail/0HZWTBZYQQXYW48YBANMDM2MZE) :
  synopsis officiel, galerie et contexte de l'hotel ouvert par Charlie.

Ces references ont servi a verrouiller les signaux visuels essentiels :

- hotel infernal monumental et accueillant malgre sa palette rouge ;
- ville verticale et dense autour de l'hotel ;
- motifs Art deco, gothiques, cabaret et vitraux ;
- contraste rouge, noir, or et lumiere de scene ;
- aucun element d'un autre univers ou motif Nexus generique.

## Direction par mode

| Fichier | Usage | Direction |
| --- | --- | --- |
| `combat.webp` | Combat 1v1 | Hall d'hotel frontal, sol plat et lisible |
| `melee.webp` | Melee | Ville infernale laterale avec volumes de plateformes |
| `melee-backdrop.webp` | Fond Melee | Skyline de Pentagram City sans collision integree |
| `melee-platforms.webp` | Collisions Melee | Huit plateformes gothiques detourees et separees |
| `rpg.webp` | RPG | Grand hall avec profondeur laterale et zone de duel |
| `tactics.webp` | Tactics | Cour infernale en perspective trois-quarts avec grille |
| `tactics-tiles.webp` | Tuiles Tactics | Sols, barrieres, hazards et objectifs detoures |

## Controle technique

| Fichier | Dimensions | Mode | Resultat |
| --- | ---: | --- | --- |
| `combat.webp` | 1672 x 941 | RGB | valide |
| `melee.webp` | 1672 x 941 | RGB | valide |
| `melee-backdrop.webp` | 1672 x 941 | RGB | valide |
| `rpg.webp` | 1672 x 941 | RGB | valide |
| `tactics.webp` | 1448 x 1086 | RGB | valide |
| `melee-platforms.webp` | 1254 x 1254 | RGBA | valide |
| `tactics-tiles.webp` | 1254 x 1254 | RGBA | valide |

Les deux atlas RGBA ont :

- une plage alpha de `0..255` ;
- leurs quatre coins totalement transparents ;
- zero RGB non nul sous les pixels dont l'alpha vaut zero ;
- des elements separes, sans texte, personnage, UI ni bordure de planche.

## Controle visuel

La planche de contact a confirme :

- une composition differente et fonctionnelle pour chaque mode ;
- un sol continu pour le Combat ;
- un fond Melee sans plateforme de collision fusionnee ;
- une vraie lecture trois-quarts pour Tactics ;
- des tuiles et plateformes utilisables independamment par le moteur ;
- aucune superposition incoherente, aucun personnage parasite et aucun texte
  genere visible.
