# Lot d'items OpenAI - Heavy Metal 2000, Killer Tomatoes et Planete Hurlante

Date: 2026-07-22

## Perimetre

- 12 icones generees avec le mode integre OpenAI ImageGen.
- Un appel ImageGen distinct par objet.
- Sources brutes produites sur un fond chroma plat, puis detourage local avec le helper officiel `remove_chroma_key.py`.
- Normalisation finale: PNG 512 x 512, RGBA, objet isole et centre, marge genereuse, aucun texte lisible, logo, HUD, watermark, ombre portee ou decor.
- Aucun manifeste, stage, profil musical ou fichier de code partage n'a ete modifie dans ce lot.

## Fichiers livres

### Heavy Metal 2000

| Objet | Fichier | Verrouillage lore |
|---|---|---|
| Julie's Sword | `public/sprites/generated/items/heavy-metal-2000/julie-s-sword.png` | Lame futuriste sombre, fuller central, garde agressive alimentee par cristal et poignee rouge-brun. |
| Fountain Key Crystal | `public/sprites/generated/items/heavy-metal-2000/fountain-key-crystal.png` | Cristal alien bleu-blanc facette, coeur bleu froid et petite monture metallique sombre, conforme au `visualAnchor` du registre. |
| FAKK2 Talisman | `public/sprites/generated/items/heavy-metal-2000/fakk2-talisman.png` | Objet du canon projet, derive de la technologie d'Eden et des gardiens de la Fontaine: metal angulaire, gemme rouge, circuits cyan, aucun sigle invente. |
| Odin's Weapon | `public/sprites/generated/items/heavy-metal-2000/odin-s-weapon.png` | Objet du canon projet defini comme un lourd pistolet energetique arakacien: corps noir nervure, montures bronze et chambre bleue. |

### Killer Tomatoes from Outer Space

| Objet | Fichier | Verrouillage lore |
|---|---|---|
| Finletter's Parachute | `public/sprites/generated/items/killer-tomatoes-from-outer-space/finletter-s-parachute.png` | Sac parachute militaire fin 1970, toile olive, sangles et morceau de voilure claire; reference au gag recurrent de Finletter. |
| Puberty Love Sheet Music | `public/sprites/generated/items/killer-tomatoes-from-outer-space/puberty-love-sheet-music.png` | Feuille de partition montree au final pour neutraliser la tomate protegee par ses cache-oreilles; aucune parole ni titre lisible. |
| Vinyl Record | `public/sprites/generated/items/killer-tomatoes-from-outer-space/vinyl-record.png` | Disque 7 pouces noir a etiquette rouge vierge, associe au morceau qui fait retrecir les tomates. |
| Ketchup Bottle | `public/sprites/generated/items/killer-tomatoes-from-outer-space/ketchup-bottle.png` | Bouteille souple rouge volontairement banale et sans marque, reference au gag `pass the ketchup` sans copier une etiquette commerciale. |

### Planete Hurlante / Screamers

| Objet | Fichier | Verrouillage lore |
|---|---|---|
| Alliance Rifle | `public/sprites/generated/items/planete-hurlante/alliance-rifle.png` | Base AK / Norinco Type 84S, equipement improvise de lance-roquettes et lance-flammes, usure de Sirius 6B. |
| Alliance ID Tag | `public/sprites/generated/items/planete-hurlante/alliance-id-tag.png` | Objet du canon projet: plaque militaire angulaire rayee, chaine courte et panneau d'identite vide, sans donnees inventees. |
| Type 3 Teddy Bear | `public/sprites/generated/items/planete-hurlante/type-3-teddy-bear.png` | Ours poussiereux porte par David, oeil endommage et couture mecanique tres discrete; l'objet reste d'abord un leurre innocent. |
| Screamer Blade | `public/sprites/generated/items/planete-hurlante/screamer-blade.png` | Lame autonome recuperee sur un Type 1: croissant d'acier dente, moteur compact, biellettes et prise de cable. |

## References consultees

### Heavy Metal 2000 / F.A.K.K. 2

- Sony Pictures, page officielle du film: <https://www.sonypictures.com/movies/heavymetal2000>
- Manuel du jeu Heavy Metal: F.A.K.K. 2, notamment la Starstrider, les cristaux de garde et les variantes d'epee: <https://manualmachine.com/gamespc/heavymetalfakk2/1119510-user-manual/>
- Galerie du distributeur Application Systems Heidelberg: <https://www.application-systems.de/fakk2/screenshots.php>
- Galerie promotionnelle et captures du jeu: <https://www.mobygames.com/game/2187/heavy-metal-fakk-2/screenshots/windows/>

### Attack of the Killer Tomatoes

- AFI Catalog, synopsis verifie du parachute, du disque et de la partition finale: <https://catalog.afi.com/Film/56192-ATTACK-OFTHEKILLERTOMATOES?cp=1&cxt=Filmography1&pos=1&sid=51558907-02aa-4f93-86a4-7021ddf1e46d&sr=0.09320808>
- Site officiel de la franchise, historique de production et gag du parachute: <https://killertomatoes.com/press-articles/attack-of-the-killer-tomatoes-is-the-most-absurd-franchise-in-movie-history>
- Guide de scenes et photogrammes du final: <https://www.filmsite.org/attackofkillertomatoes.html>

### Screamers / Planete Hurlante

- Archive visuelle du film: <https://www.imdb.com/title/tt0114367/mediaindex/>
- Identification et captures du fusil de l'Alliance: <https://www.imfdb.org/wiki/Screamers>
- Photogramme de David avec l'ours: <https://www.offscreen.be/en/offscreen-film-festival-2023/machines-us-robots-science-fiction-cinema/screamers>
- Synopsis du Type 3 et de l'ours final: <https://en.wikipedia.org/wiki/Screamers_%281995_film%29>

## Jeu de prompts final

Chaque appel reprenait le socle suivant:

> Icone d'inventaire 512 x 512, pixel art 32-bit detaille, objet unique entier, vue trois-quarts, centre avec au moins 12 a 18 pour cent de marge, fond chroma parfaitement plat, aucune ombre portee, personnage, decor, texte, logo, HUD, bordure ou watermark.

Descripteurs propres a chaque appel:

1. `Julie's Sword`: longue lame gunmetal avec fuller, bas use et legerement dente, garde circulaire a pointes, details de cristal, poignee rouge-brun.
2. `Fountain Key Crystal`: cristal alien bleu-blanc asymetrique a coeur bleu froid dans une petite monture gunmetal a trois griffes; jamais vert ni une cle conventionnelle.
3. `FAKK2 Talisman`: talisman alien symetrique en gunmetal et bronze, gemme rouge centrale et conduits cyan, sans symbole textuel.
4. `Odin's Weapon`: pistolet energetique arakacien lourd, noir nervure, ferrures bronze et chambre de canon bleu glace.
5. `Finletter's Parachute`: sac militaire olive fin 1970, harnais, boucles et petit pli de voilure claire; parachute non deploye.
6. `Puberty Love Sheet Music`: une feuille creme usee avec portees et notes abstraites, annotations rouges, aucun titre ni paroles lisibles.
7. `Vinyl Record`: un 7 pouces noir avec sillons et etiquette rouge vierge, sans pochette.
8. `Ketchup Bottle`: bouteille souple rouge generique, bouchon blanc et etiquette creme vide, sans marque.
9. `Alliance Rifle`: fusil AK industriel avec cache-canon nervure, chargeur droit, lance-flammes et lance-roquettes improvises.
10. `Alliance ID Tag`: plaque metallique a coins coupes, chaine courte, panneau vide et bande bleu-gris.
11. `Type 3 Teddy Bear`: ours brun use et poussiereux, oeil-bouton endommage et couture mecanique subtile.
12. `Screamer Blade`: croissant d'acier dente avec moteur bas, biellettes, boulons et prise de cable.

## QA

- Inspection visuelle individuelle via trois planches de controle 2 x 2.
- 12/12 fichiers: dimensions exactes `512 x 512`.
- 12/12 fichiers: mode `RGBA`.
- 12/12 fichiers: quatre coins avec alpha nul.
- Marge minimale mesuree autour du sujet: 56 pixels.
- Pixels chroma visibles apres nettoyage: 0.
- Pixels totalement transparents avec RGB cache non nul: 0.
- Sujet vide, coupe ou hors cadre: 0.
- Contamination visuelle par personnage, texte lisible, logo, HUD, watermark, decor ou ombre portee: 0.

### Correction visuelle ciblee - Fountain Key Crystal

- La premiere generation verte a ete refusee pendant la QA visuelle principale car elle contredisait le `visualAnchor` bleu-blanc du registre.
- `fountain-key-crystal.png` a ete regenere seul avec un nouvel appel OpenAI ImageGen; les 11 autres icones n'ont pas ete regenerees ni retouchees.
- Nouvelle direction validee: cristal facette bleu glacier et blanc, coeur bleu froid, petite monture metallique sombre.
- QA apres remplacement: `512 x 512`, `RGBA`, marges `(183, 56, 183, 56)`, quatre coins transparents, 0 pixel chroma, 0 frange verte et 0 pixel RGB cache sous alpha nul.
