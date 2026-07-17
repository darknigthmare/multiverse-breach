# Pack d'objets Gremlins genere par OpenAI

Date : 2026-07-17

## Perimetre

Ce lot couvre les quatre `eventItem` Gremlins declares dans
`src/game/loreItemOverrides.js` :

| Entree jeu | Fichier final |
| --- | --- |
| Gizmo Gift Box | `public/sprites/generated/items/gremlins/gizmo-gift-box.png` |
| Glass of Water | `public/sprites/generated/items/gremlins/glass-of-water.png` |
| Alarm Clock | `public/sprites/generated/items/gremlins/alarm-clock.png` |
| Gizmo's Bow Tie | `public/sprites/generated/items/gremlins/gizmo-s-bow-tie.png` |

Aucun fichier JavaScript, manifeste ou autre fichier partage n'a ete modifie.

## References visuelles

- [Amblin - Gremlins](https://amblin.com/movie/gremlins/) : reference officielle
  pour le contexte du film, Gizmo, le cadeau et les trois regles.
- [Filmsite - Gremlins](https://www.filmsite.org/gremlins.html) : plans illustres
  de la chambre de Billy, du reveil indiquant 11 h 36 et de l'accident avec
  l'eau.
- [Gremlins Museum - Joe Dante slide collection](https://www.gremlns.com/joe-dante-slide-collection-gremlins/) :
  diapositive de production en haute definition utilisee pour la forme du verre,
  son niveau d'eau et ses reflets.
- [THX Trailer - Gremlins box replica](https://www.thx-trailer.com/replica/gremlins/gremlins3.htm) :
  reproduction grandeur nature utilisee pour les panneaux de bois, les inserts
  verts, la corde, le fermoir et les aerations de la boite.
- [TN - Warner/Amblin film still](https://tn.com.ar/show/cine-series/2021/12/31/la-otra-gremlins-la-pelicula-que-disney-jamas-hizo-nazis-traicion-y-monstruos-que-destrozan-aviones-de-guerra/) :
  plan du film utilise uniquement pour la teinte rouge et la construction fine
  de l'accessoire de cou de Gizmo.
- [NECA - Gizmo licensed plush](https://store.necaonline.fr/products/gremlins-plush-musical-dancing-gizmo) :
  controle secondaire de la palette et de la presentation sous licence du
  personnage. Aucun element du personnage n'a ete copie dans l'icone.

## Interpretation lore

La boite reprend sa silhouette orientale carree, son bois sombre, ses panneaux
verts, sa corde, son fermoir et ses trous d'aeration. Le verre reste un verre
d'eau ordinaire, sans pinceaux ni personnage. Le reveil suit le plan de la
chambre de Billy, mais sa coque a ete rendue rouge conformement a la definition
du jeu et son cadran ne contient ni chiffre ni texte.

Le film montre Gizmo avec un fin cordon rouge plutot qu'un noeud papillon
clairement visible. L'icone `gizmo-s-bow-tie.png` respecte donc volontairement
la definition explicite de `loreItemOverrides.js` : un petit noeud papillon en
tissu rouge, avec bande elastique et plis souples. La reference filmique sert
seulement a fixer la teinte et la finesse de la bande.

## Generation OpenAI ImageGen

Chaque objet a ete genere separement avec OpenAI ImageGen a partir de ses
references visuelles. Les contraintes communes etaient :

- un seul objet complet et centre ;
- pixel art detaille de type inventaire RPG 16/32-bit ;
- silhouette lisible a petite taille ;
- aucune personne, aucun personnage ou autre accessoire ;
- aucun texte, chiffre lisible, logo, filigrane ou cadre ;
- fond chromatique uni destine au detourage ;
- marges de securite et aucun recadrage.

Les adaptations specifiques ont ete :

- boite : panneaux sculptes, inserts vert jade, corde, fermoir en laiton et six
  aerations laterales ;
- verre : cylindre transparent rempli d'eau, reflets blanc/cyan et aucun
  pinceau ;
- reveil : boitier rouge rectangulaire, cadran analogique simplifie proche de
  minuit et panneau lateral ;
- noeud papillon : tissu rouge profond, noeud central, deux boucles pliees et
  bande elastique complete.

## Normalisation

Les sorties ImageGen ont ete detourees par suppression de chroma avec matte
souple et despill, puis redimensionnees en `512x512` avec conservation RGBA.

| Fichier | Format | Boite alpha utile | Marges L/H/R/B | Coins alpha | Chroma visible |
| --- | --- | --- | --- | --- | --- |
| `gizmo-gift-box.png` | 512x512 RGBA | 44,48 - 467,478 | 44/48/45/34 px | 0/0/0/0 | 0 px |
| `glass-of-water.png` | 512x512 RGBA | 116,49 - 396,465 | 116/49/116/47 px | 0/0/0/0 | 0 px |
| `alarm-clock.png` | 512x512 RGBA | 72,124 - 440,380 | 72/124/72/132 px | 0/0/0/0 | 0 px |
| `gizmo-s-bow-tie.png` | 512x512 RGBA | 60,144 - 460,359 | 60/144/52/153 px | 0/0/0/0 | 0 px |

`Boite alpha utile` utilise un seuil alpha superieur a 8. `Chroma visible`
controle les pixels verts ou magenta fortement satures restant avec un alpha
superieur a 16.

## Inspection finale

- Les quatre fichiers sont bien des PNG `RGBA` de `512x512`.
- Les quatre coins de chaque image sont totalement transparents.
- Chaque objet est unique, entier et isole.
- Aucun objet ne touche les bords.
- Aucun fond vert ou magenta visible ne subsiste.
- Le verre conserve des zones semi-transparentes pour rendre le materiau.
- Les noms et chemins correspondent exactement aux quatre entrees Gremlins.
- Aucun commit, push ou deploiement n'a ete effectue.
