# Pack de stages War of the Worlds 2005 - OpenAI ImageGen QA final

Date : 2026-07-22

## Perimetre

Ce lot contient exactement sept decors originaux fan-made en pixel art 32-bit :

- `public/backgrounds/lore-stages/war-of-the-worlds/combat.webp`
- `public/backgrounds/lore-stages/war-of-the-worlds/melee.webp`
- `public/backgrounds/lore-stages/war-of-the-worlds/melee-backdrop.webp`
- `public/backgrounds/lore-stages/war-of-the-worlds/melee-platforms.webp`
- `public/backgrounds/lore-stages/war-of-the-worlds/rpg.webp`
- `public/backgrounds/lore-stages/war-of-the-worlds/tactics.webp`
- `public/backgrounds/lore-stages/war-of-the-worlds/tactics-tiles.webp`

Les sept images ont ete produites avec le mode integre OpenAI ImageGen. Les
references officielles ont uniquement servi a verrouiller les lieux, la
palette et le langage de production du film de Steven Spielberg de 2005. Aucun
photogramme, personnage, vehicule identifie ou asset officiel n'a ete copie.

Aucun manifeste, registre, fichier de code, package ou metadata Git n'a ete
modifie pour ce lot. Aucun commit, push ou deploiement n'a ete effectue.

## References principales

- [Paramount Pictures - War of the Worlds (2005)](https://www.paramountpictures.com/movies/war-of-the-worlds-2005)
- [Amblin - War of the Worlds](https://amblin.com/movie/war-of-the-worlds/)
- [Industrial Light & Magic - War of the Worlds](https://www.ilm.com/vfx/war-of-the-worlds/)

Les lieux retenus sont le carrefour de Bayonne, les rues d'evacuation du New
Jersey, l'approche du ferry, son terminal, le front d'eau industriel et les
zones contaminees par l'herbe rouge.

## Direction visuelle originale

- epoque : New Jersey contemporain du film de 2005 ;
- architecture : briques urbaines, maisons modestes, terminal de ferry,
  entrepots, quais, poteaux et reseaux electriques ;
- materiaux : asphalte fissure, beton, acier de rampe, brique, cendre et
  vehicules civils sans marque ;
- palette : bleu acier, gris cendre, charbon, brique sourde, rouille et rouge
  sombre limite a l'herbe extraterrestre ;
- ambiance : ciel d'orage, lumiere froide, evacuation terminee et silence
  post-catastrophe ;
- interdits globaux : Tripod, machine extraterrestre, alien, personnage,
  cadavre, silhouette, texte, logo, UI, HUD et watermark.

## Verrous ImageGen par mode

| Fichier | Verrou final |
| --- | --- |
| `combat.webp` | Carrefour de Bayonne en camera laterale, sol d'asphalte continu sur toute la largeur, centre 1v1 libre et cratere en arriere-plan. |
| `melee.webp` | Approche du ferry en vue laterale large, eau et terminal en profondeur, 42 % inferieurs calmes, aucune plateforme de collision integree. |
| `melee-backdrop.webp` | Panorama parallax distinct du terminal, de la riviere et de la skyline industrielle, sans sol ni rebord de premier plan. |
| `melee-platforms.webp` | Huit plateformes laterales isolees en quatre rangees de deux : autoroute, rampe de ferry, auvents, catwalk et toit de vehicule. |
| `rpg.webp` | Route d'evacuation en camera 2.5D peu plongeante, grande aire d'asphalte et cinq zones de placement non obstruees. |
| `tactics.webp` | Vraie camera frontale trois-quarts a environ 32 degres, plateau rectangulaire exact de 8 colonnes par 6 rangees. |
| `tactics-tiles.webp` | Seize modules tactiques isoles en grille 4x4, dans le meme angle que le plateau. |

## Traitement des sorties

1. generations independantes avec OpenAI ImageGen integre ;
2. inspection visuelle de chaque sortie avant integration ;
3. regeneration des sources RPG et Tactics dont la premiere sauvegarde locale
   ImageGen n'avait pas ete persistee ;
4. generation des deux atlas sur chroma magenta uniforme ;
5. detourage avec le helper OpenAI ImageGen `remove_chroma_key.py`, echantillon
   de bord, matte adouci, seuil transparent 12, seuil opaque 220 et despill ;
6. export WebP lossless en RGB ou RGBA selon le contrat ;
7. remise a zero du RGB sous tous les pixels dont l'alpha vaut zero, puis
   reexport avec preservation RGBA exacte ;
8. reouverture de chaque WebP final depuis son chemin projet.

Couleurs chroma detectees par le helper :

- `melee-platforms.webp` : `#F503F5` ;
- `tactics-tiles.webp` : `#FB02FA`.

Aucune source ImageGen, image de reference, grille-guide, matte intermediaire
ou planche contact n'est conservee dans le depot.

## Fichiers finaux

| Fichier | Dimensions | Mode | Octets | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `combat.webp` | 1672x941 | RGB | 1 955 350 | `21f46f433ea9cdcf9f9b8d19625d7be34ddafc427e7e286abeebdff73e83aee0` |
| `melee.webp` | 1672x941 | RGB | 1 522 180 | `a1c15671386aa345eec638df99c1e9990e8a8744d338f0ad2e6cc85f4b663cc7` |
| `melee-backdrop.webp` | 1672x941 | RGB | 1 374 276 | `c37c633343ab66e2d4e38b4bb2a6f05327a1c5a602fab2f8bab65cc3348391c2` |
| `melee-platforms.webp` | 1254x1254 | RGBA | 728 742 | `79ceae61748e685c78b92ad300e0030b34398360e49980e789febf52cb0bc990` |
| `rpg.webp` | 1672x941 | RGB | 1 878 110 | `6ded93d249b9ec09d4a56ea612bde0e1a776534f3d41d23227e81fd501b73246` |
| `tactics.webp` | 1448x1086 | RGB | 2 025 856 | `622cf59ae345f6b5f0b890b70449006646f2cf5f587e2e22e8d2299a006c8433` |
| `tactics-tiles.webp` | 1254x1254 | RGBA | 775 610 | `701d0ea9186435565359ecae89512b952cef6ec138542906e0c14b5217b7bf0a` |

## Validation alpha et cellules

| Fichier | Alpha 0 | Alpha partiel | Alpha 255 | RGB sous alpha 0 | Coins opaques | Cellules non vides |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `melee-platforms.webp` | 1 099 083 | 35 060 | 438 373 | 0 | 0 / 4 | 8 / 8 |
| `tactics-tiles.webp` | 1 077 368 | 28 410 | 466 738 | 0 | 0 / 4 | 16 / 16 |

Occupation alpha par cellule :

- Melee : `79034, 72900, 63993, 57770, 52852, 52915, 42218, 51751` ;
- Tactics : `29322, 30128, 29831, 30386, 31063, 30032, 30032, 32134, 28716, 33139, 30652, 38310, 26569, 28634, 28163, 38037`.

Les deux atlas possedent un alpha compris entre 0 et 255, quatre coins
totalement transparents, aucun cache RGB sous alpha nul et aucune cellule vide.

## Inspection visuelle finale

- `combat.webp` conserve une surface de duel continue et libre ;
- `melee.webp` laisse l'espace gameplay ouvert sans plateforme dessinee ;
- `melee-backdrop.webp` est une couche distante distincte, sans collision
  visuelle au premier plan ;
- les huit plateformes sont entieres, separees et possedent des dessus
  horizontaux lisibles ;
- `rpg.webp` preserve une grande aire centrale et les cinq profondeurs de
  placement ;
- `tactics.webp` montre bien 48 cases, en 8 colonnes par 6 rangees, avec les
  rangees proches plus grandes et placees devant les rangees eloignees ;
- les seize modules tactiques sont complets, separes et coherents avec la
  camera du plateau ;
- aucune sortie ne contient de Tripod, alien, humain, cadavre, texte, logo,
  interface, watermark ou bordure parasite ;
- aucun atlas ne presente de frange magenta visible apres detourage.

Resultat : `WAR_OF_THE_WORLDS_2005_STAGE_BATCH_QA_VALID`

## Limites du depot

Seuls les chemins demandes ont ete ecrits par cette implementation :

- `public/backgrounds/lore-stages/war-of-the-worlds/`
- `docs/audits/generated-stage-batch-war-of-the-worlds-2026-07-22.md`

Les modifications concurrentes deja presentes dans le worktree ont ete
laissees intactes.
