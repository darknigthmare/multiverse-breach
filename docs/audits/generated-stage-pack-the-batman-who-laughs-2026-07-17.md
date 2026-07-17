# Pack de stages OpenAI - The Batman Who Laughs

Date : 2026-07-17

## Perimetre

Pack complet genere avec OpenAI ImageGen pour le profil
`The Batman Who Laughs` de `src/game/stageLoreProfiles.js`.

Ancrage lore utilise :

- Dark Multiverse Gotham sous une Batcave infectee ;
- tours gothiques emprisonnees par de gigantesques chaines ;
- roche noire, acier noirci, machines mortes et fissures rouges ;
- aucun personnage, ennemi, texte, logo ou element d'interface.

Reference officielle consultee :

- [DC - The Batman Who Laughs](https://www.dc.com/graphic-novels/the-batman-who-laughs-2018/the-batman-who-laughs)

La page DC a servi a verifier la continuite Dark Multiverse et le ton
visuel. Aucun panneau, decor ou asset officiel n'a ete copie. Tous les
rendus sont des compositions originales.

## Fichiers produits

| Fichier | Usage | Dimensions | Alpha |
|---|---|---:|---|
| `combat.webp` | Combat lateral, sol continu et centre libre | 1536 x 864 | Non |
| `melee.webp` | Fond principal Melee sans plateformes centrales cuites | 1536 x 864 | Non |
| `melee-backdrop.webp` | Couche de profondeur Melee sans geometrie jouable | 1536 x 864 | Non |
| `melee-platforms.webp` | Atlas de 8 modules de plateformes | 1536 x 864 | Oui |
| `rpg.webp` | Scene RPG laterale 2.5D avec large voie de combat | 1536 x 864 | Non |
| `tactics.webp` | Champ Tactics sureleve en trois-quarts, grille 8 x 6 | 1536 x 864 | Non |
| `tactics-tiles.webp` | Atlas de 12 tiles et couvertures Tactics | 1536 x 1024 | Oui |

Chemin commun :

`public/backgrounds/lore-stages/the-batman-who-laughs/`

## Direction des prompts

Tous les prompts imposent un pixel art 32-bit detaille, des silhouettes
nettes, une palette charbon / acier / bleu froid et des accents rouges
limites. Ils interdisent explicitement les personnages, creatures,
emblemes, logos, textes, filigranes et UI.

### Combat

Vue strictement laterale 16:9. Un seul sol plat continu occupe le quart
inferieur. La voie centrale de duel reste vide et les machines, chaines
et debris sont limites aux bords ou a l'arriere-plan.

### Melee

Vue laterale de caverne ouverte sur Gotham. Les deux fonds interdisent
toute plateforme, corniche, pont, rampe ou surface de collision dans le
champ central. Les surfaces jouables sont isolees dans un atlas 4 x 2
transparent : longue plateforme, variantes moyennes et courtes,
dessous roche / metal et deux extremites.

### RPG

Vue laterale 2.5D, jamais zenithale. Le sol en perspective est large,
bas et degage pour les positions d'equipe a gauche et d'ennemis a
droite. Les consoles et le relief restent contre les murs.

### Tactics

Camera avant surelevee d'environ 30 degres avec horizon visible. La
grille reste rectangulaire, jamais en losanges : 8 colonnes, 6 rangees,
et les rangees basses sont visuellement devant les rangees hautes.
Quatre couvertures basses occupent uniquement des cases de bord.

L'atlas Tactics contient 12 modules separes en 4 x 3 : sols, variante
fissuree, danger infecte, dalle renforcee, chaine brisee, deux
couvertures basses, console et socle d'objectif.

## Post-traitement et controles

- Conversion WebP effectuee apres generation.
- Extraction chroma des deux atlas avec le helper OpenAI
  `remove_chroma_key.py`.
- Contraction de bord d'un pixel et despill appliques aux atlas.
- `melee-platforms.webp` : 1 084 914 pixels totalement transparents.
- `tactics-tiles.webp` : 835 791 pixels totalement transparents.
- Aucun pixel vert chroma brillant detecte dans les zones visibles.
- Chaque rendu a ete inspecte en taille reelle.
- Aucun fichier JS, JSON ou manifeste n'a ete modifie pour ce pack.

## Resultat de l'inspection

- Combat : valide, sol continu, centre libre.
- Melee principal : valide, espace central libre.
- Melee backdrop : valide, aucune geometrie jouable cuite.
- Melee atlas : valide, 8 modules isoles et horizontaux.
- RPG : valide, perspective 2.5D et positions de combat degagees.
- Tactics : valide, vue avant surelevee, grille rectangulaire 8 x 6.
- Tactics atlas : valide, 12 modules isoles, non isometriques en losange.
