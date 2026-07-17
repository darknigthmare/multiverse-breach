# Production visuelle objets - Team Fortress 2

Date : 2026-07-17

## Perimetre

- Univers : `Team Fortress 2`
- Registre source : `src/game/loreItemOverrides.js`
- Objets produits : pack complet de 4 objets sur 4, eventItem inclus
- Methode : une generation OpenAI ImageGen built-in distincte par objet
- Rendu : pixel art original, detourage chroma local, PNG RGBA final en 512 x 512
- Fichiers JS et manifestes partages : non modifies
- Commit, push et deploiement : non effectues pour ce lot

## References canoniques

### Sandvich

- Definition projet : sandwich triangulaire, pain blanc, olive sur cure-dent, laitue, tomate et couches de viande.
- Reference principale : [Official TF2 Wiki - Sandvich](https://wiki.teamfortress.com/wiki/Sandvich)
- Reference visuelle : [rendu du Sandvich pose sur son assiette](https://wiki.teamfortress.com/w/images/d/df/Sandvichplate.png)
- Fidelite retenue : deux tranches triangulaires epaisses, laitue verte, tomate rouge, fromage jaune, jambon et bologne roses, olive verte au piment rouge fixee par un cure-dent.
- L'assiette grise du pickup lance en jeu est conservee pour rendre la silhouette immediatement reconnaissable.
- Sortie : `public/sprites/generated/items/team-fortress-2/sandvich.png`

### Mann Co. Supply Crate Key

- Definition projet : cle industrielle massive en laiton, dents rectangulaires, sans logo copie.
- Reference principale : [Official TF2 Wiki - Mann Co. Supply Crate Key](https://wiki.teamfortress.com/wiki/Mann_Co._Supply_Crate_Key)
- Reference visuelle : [icone de sac a dos officielle de la cle](https://wiki.teamfortress.com/w/images/8/83/Backpack_Mann_Co._Supply_Crate_Key.png)
- Fidelite retenue : cle squelette ancienne en laiton, anneau circulaire, col epais, tige cylindrique et panneton large a double fourche rectangulaire.
- Sortie : `public/sprites/generated/items/team-fortress-2/mann-co-crate-key.png`

### Australium Bar

- Definition projet : lingot de metal dore rayonnant, angles biseautes, aucun texte grave.
- Reference principale : [Official TF2 Wiki - Australium](https://wiki.teamfortress.com/wiki/Australium)
- Reference visuelle : [modele de lingot d'Australium present dans les fichiers du jeu](https://wiki.teamfortress.com/w/images/5/56/Australium_Bar_Model.png)
- Fidelite retenue : lingot rectangulaire epais, perspective trois-quarts, angles fortement biseautes, metal or chaud et reflets lumineux.
- Le relief canonique n'est pas reproduit afin de respecter la contrainte projet explicite : aucun logo, embleme, texte ou marquage copie.
- Sortie : `public/sprites/generated/items/team-fortress-2/australium-bar.png`

### Medkit

- Definition projet : petite caisse medicale blanche avec bloc rouge, sans symbole ni texte copie.
- Reference principale : [Official TF2 Wiki - Health](https://wiki.teamfortress.com/wiki/Health)
- References visuelles : [pickup de soin moyen](https://wiki.teamfortress.com/w/images/7/7c/Mediumhealth.png) pour la silhouette de caisse et [petit pickup de soin](https://wiki.teamfortress.com/w/images/b/b3/Smallhealth.png) pour la hierarchie blanc et rouge.
- Fidelite retenue : petite caisse rigide rectangulaire, angles arrondis et biseautes, couvercle epais, charnieres grises et poignee courte.
- Le corps turquoise et la croix des references ne sont pas reproduits : l'override impose une caisse blanche avec un simple bloc rouge rectangulaire, sans croix, pictogramme, texte ou logo.
- Role : `eventItem`, ID `evt_team_fortress_2_breach`.
- Sortie : `public/sprites/generated/items/team-fortress-2/medkit.png`

## Contraintes de generation

Chaque prompt a impose :

- exactement un objet complet et clairement separe ;
- l'identite, la silhouette, les proportions et les materiaux de la reference fournie ;
- une vue trois-quarts lisible comme icone de pickup ;
- un pixel art detaille avec amas de pixels nets ;
- aucun personnage, aucune main, aucune duplication et aucun decor ;
- aucun texte ajoute, aucun logo, aucun filigrane et aucun recadrage de l'objet ;
- un fond chroma uniforme adapte a la palette (`#ff00ff` ou `#00ff00`), retire localement avant export ;
- une normalisation finale de toute la toile en `512 x 512`, sans recadrage.

## Validation technique

| Fichier | Taille | Mode | Alpha aux coins | Marges du sujet L/H/R/B | Pixels chroma visibles |
| --- | --- | --- | --- | --- | --- |
| `sandvich.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 19 / 86 / 20 / 82 | 0 |
| `mann-co-crate-key.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 27 / 81 / 27 / 93 | 0 |
| `australium-bar.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 12 / 72 / 7 / 72 | 0 |
| `medkit.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 38 / 53 / 31 / 66 | 0 |

## Controle visuel final

- les quatre objets sont distincts, complets et non coupes ;
- le Sandvich conserve ses couches et son olive caracteristiques ;
- la cle conserve le dessin exact du panneton et de l'anneau rond ;
- le lingot conserve la forme biseautee et la radiance de l'Australium ;
- le Medkit conserve la silhouette industrielle du pickup TF2 tout en respectant le bloc rouge non symbolique de l'override ;
- aucun fond chroma visible, texte, logo, personnage ou accessoire parasite ;
- les noms et chemins correspondent strictement aux sorties construites par `loreItemOverrides.js`.
