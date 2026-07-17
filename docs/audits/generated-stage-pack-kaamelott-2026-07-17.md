# Pack de stages Kaamelott - 17 juillet 2026

## Périmètre

Pack complet généré avec OpenAI ImageGen pour le profil `Kaamelott` de
`src/game/stageLoreProfiles.js`.

Lieu canonique retenu :

> Salle de la Table Ronde du château de Kaamelott, cour visible par les arches.

Le pack vise volontairement l'esthétique de la série classique : décor de château
fonctionnel, pierre brute, bois sombre, lumière froide, accessoires modestes et
échelle de plateau pratique. Il évite le château de fantasy spectaculaire et tout
vocabulaire visuel proche de Hogwarts.

## Références consultées

- [Profil officiel M6+ de Kaamelott](https://www.m6.fr/kaamelott-p_888) :
  cadre de la série, Bretagne du Ve siècle et centralité de la Table Ronde.
- [Galerie décor Kaamelott de l'ADC](https://www.adcine.com/shows/kaamelott) :
  pierre, arches, mobilier, construction et éclairage des décors.
- [Coulisses de la série rapportées par AlloCiné](https://www.allocine.fr/article/fichearticle_gen_carticle%3D1000183783.html) :
  salle de la Table Ronde, couloirs et logique de château construit en studio.
- [Table Ronde - Wiki Kaamelott](https://kaamelott.fandom.com/fr/wiki/Table_Ronde) :
  table en bois couverte de cuir, pupitre de Père Blaise, cheminée derrière le
  siège d'Arthur et grande salle située au deuxième étage.
- [Saison 3 sur CANAL+](https://www.canalplus.com/series/kaamelott-saison-2/h/10152630_40099/saison-3/saisons/) :
  références visuelles complémentaires de la cour et de l'armurerie.

Les images de référence ont servi uniquement à verrouiller les matériaux,
l'échelle et l'atmosphère. Les assets finaux sont des compositions originales.

## Fichiers produits

| Fichier | Dimensions | Canal | Usage |
|---|---:|---|---|
| `combat.webp` | 1536 x 864 | RGB | Combat latéral 16:9, sol continu et centre libre |
| `melee.webp` | 1536 x 864 | RGB | Fond principal Mêlée sans plateforme cuite |
| `melee-backdrop.webp` | 1536 x 864 | RGB | Fond de parallaxe Mêlée |
| `melee-platforms.webp` | 1024 x 1024 | RGBA | Atlas transparent de surfaces, rebords et supports |
| `rpg.webp` | 1536 x 864 | RGB | Vue latérale 2.5D avec voie centrale dégagée |
| `tactics.webp` | 1536 x 1024 | RGB | Vue surélevée trois-quarts, grille rectangulaire 8 x 6 |
| `tactics-tiles.webp` | 1024 x 1024 | RGBA | Atlas transparent de cases et couvertures |

Chemin :

`public/backgrounds/lore-stages/kaamelott/`

`melee.webp` et `melee-backdrop.webp` utilisent volontairement le même fond
propre. La géométrie jouable est fournie séparément par
`melee-platforms.webp`, ce qui évite tout conflit entre le décor et les
collisions dynamiques.

## Briefs ImageGen finaux

### Combat

- Salle de la Table Ronde en pixel art 32-bit détaillé.
- Pierre gris-brun, table ronde bois et cuir au fond, cheminée, pupitre,
  bancs simples et arches vers la cour.
- Caméra strictement latérale 16:9.
- Sol continu et plat ; 60 % du centre sans obstacle ni accessoire.
- Aucun personnage, texte, logo, UI, fosse, marche ou élément magique.

### Mêlée

- Fond latéral de la salle ouvrant sur la cour par trois arches basses.
- Large bande centrale et basse laissée vide pour les plateformes runtime.
- Aucun rebord, escalier, plateau ou collision peint dans le fond.
- Une correction ciblée a ajouté la Table Ronde loin derrière l'aire de jeu,
  sans modifier le cadrage ni la zone libre.

### Atlas Mêlée

- Pièces orthographiques séparées sur chroma vert uniforme.
- Plateformes de pierre longues, moyennes et courtes, sous-faces, coins,
  rebords et passerelle en chêne brut.
- Arêtes jouables droites et horizontales.
- Chroma supprimé localement, puis export WebP RGBA.

### RPG

- Caméra latérale 2.5D, plancher légèrement fuyant.
- Table Ronde, cheminée, pupitre et arches conservés en arrière-plan.
- Grande voie de combat centrale sans meuble ni occlusion au premier plan.

### Tactics

- Caméra oblique surélevée à environ 30-35 degrés.
- Grille rectangulaire de 8 colonnes par 6 rangées.
- Rangées du bas devant celles du haut, sans vue verticale ni grille en
  losanges.
- Couvertures limitées aux bords pour préserver les voies centrales.

### Atlas Tactics

- Cases de dalles cohérentes avec la perspective du terrain.
- Variantes normales, fissurées et surélevées.
- Couvertures en pierre, bancs, table à tréteaux, tonneaux, pupitre et
  bordures.
- Chroma supprimé localement, puis export WebP RGBA.

## Contrôles

- Sept fichiers présents.
- Aucun personnage, ennemi, texte, logo ou interface visible.
- `combat.webp`, `melee.webp`, `melee-backdrop.webp` et `rpg.webp` :
  ratio 16:9.
- `tactics.webp` : perspective surélevée trois-quarts et lecture avant/arrière
  cohérente.
- `melee-platforms.webp` :
  alpha `0..255`, 667 757 pixels totalement transparents, quatre coins
  transparents.
- `tactics-tiles.webp` :
  alpha `0..255`, 600 154 pixels totalement transparents, quatre coins
  transparents.
- Aucun résidu de chroma visible après détourage.
- Inspection finale effectuée sur une planche de contact des sept assets.

## Hors périmètre

Aucun fichier JavaScript, JSON, manifeste, commit, push ou déploiement n'a été
modifié pour ce pack.
