# Production visuelle objets P0 - Evil Dead

Date : 2026-07-17

## Perimetre

- Univers : `Evil Dead`
- Registre source : `src/game/loreItemOverrides.js`
- Pack complet : 4 objets sur 4
- Methode : une generation OpenAI built-in distincte par objet
- Rendu : pixel art original, detourage chroma local, PNG RGBA final en 512 x 512
- Fichiers JS et manifestes partages : non modifies

## Verification canonique et sources visuelles

### Necronomicon Ex-Mortis

- Existence dans l'oeuvre : le Necronomicon Ex-Mortis est le Livre des Morts et un objet central de `Evil Dead II`.
- Silhouette retenue : livre epais, couverture brun sombre organique, visage tourmente avec yeux enfonces et bouche ouverte.
- Source sous licence : [Trick or Treat Studios - Evil Dead 2 Book of the Dead Necronomicon Prop](https://trickortreatstudios.com/products/evil-dead-2-book-of-the-dead-necronomicon-prop-with-printed-pages)
- Reference visuelle : [vue frontale de la replique sous licence](https://trickortreatstudios.com/cdn/shop/products/RLSC102-Necronomicon_-_Front_1200x1200.jpg?v=1764183432)
- Sortie : `public/sprites/generated/items/evil-dead/necronomicon-ex-mortis.png`

### Chainsaw

- Existence dans l'oeuvre : la tronconneuse remplace la main droite d'Ash Williams et reste son arme signature.
- Silhouette retenue : long guide metallique, carter rouge et noir use, grille argentee, garde tubulaire et poignee superieure bois-metal.
- Source de production : [Propstore - Ash's Hero Chainsaw](https://propstore.com/product/ash-vs-evil-dead-tv-series-2015-2018/ashs-bruce-campbell-hero-chainsaw/)
- Reference visuelle : [accessoire de production photographie par Propstore](https://images.propstore.com/07334da96b63f69708808dad111b4405-1.jpg)
- Sortie : `public/sprites/generated/items/evil-dead/chainsaw.png`

### Boomstick

- Existence dans l'oeuvre : le Boomstick est le fusil de chasse a deux canons utilise par Ash contre les Deadites.
- Silhouette retenue : coach gun calibre 12, canons juxtaposes courts en acier sombre, crosse et garde-main en noyer use.
- Source de production : [Propstore - Ash Williams' Stunt Boomstick](https://propstore.com/product/ash-vs-evil-dead-tv-series-2015-2018/ash-williams-bruce-campbell-stunt-boomstick/)
- Reference visuelle : [accessoire de production photographie par Propstore](https://images.propstore.com/b30be210d7de911fac68307a8f2cb4a1-1.jpg)
- Sortie : `public/sprites/generated/items/evil-dead/boomstick.png`

### Kandarian Dagger

- Existence dans l'oeuvre : la dague kandarienne accompagne le Necronomicon et sert a combattre les forces demoniaques.
- Silhouette retenue : longue lame en forme de colonne vertebrale, os jaunis lateraux, garde en cage thoracique et pommeau en crane.
- Source de production : [Propstore - Tom Sullivan Collection Kandarian Dagger](https://propstore.com/product/evil-dead-ii-1987/lot-117-tom-sullivan-collection-kandarian-dagger/)
- Reference visuelle sous licence : [Trick or Treat Studios - Kandarian Dagger Prop](https://trickortreatstudios.com/products/evil-dead-2-kandarian-dagger-prop)
- Reference image : [vue complete de la replique sous licence](https://trickortreatstudios.com/cdn/shop/products/RLSC103_kandarian_dagger_front_1200x1200.jpg?v=1764183500)
- Sortie : `public/sprites/generated/items/evil-dead/kandarian-dagger.png`

## Contraintes de generation

Chaque prompt a impose :

- exactement un objet physique complet ;
- une vue trois-quarts legerement plongeante ;
- une silhouette et des materiaux conformes a la reference ;
- un pixel art original lisible en petite taille ;
- aucune main, aucun personnage, aucun texte, aucun logo et aucun filigrane ;
- aucun decor, aucune duplication et aucun effet flottant ;
- un fond chroma uniforme `#00ff00`, retire localement avant export.

## Validation technique

| Fichier | Taille | Mode | Alpha aux coins | Marges du sujet L/H/R/B |
| --- | --- | --- | --- | --- |
| `necronomicon-ex-mortis.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 49 / 52 / 52 / 69 |
| `chainsaw.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 14 / 120 / 15 / 160 |
| `boomstick.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 11 / 100 / 10 / 149 |
| `kandarian-dagger.png` | 512 x 512 | RGBA | 0 / 0 / 0 / 0 | 101 / 8 / 90 / 7 |

Controle visuel final :

- quatre objets distincts et complets ;
- aucune zone chroma visible ;
- aucune partie coupee ;
- aucune main, aucun personnage ou accessoire additionnel ;
- silhouettes coherentes avec les references retenues ;
- noms et chemins strictement conformes a `loreItemOverrides.js`.
