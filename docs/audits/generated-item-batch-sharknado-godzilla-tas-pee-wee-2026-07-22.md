# Audit OpenAI ImageGen - objets Sharknado, Godzilla TAS et Pee-wee

Date : 2026-07-22

## Perimetre livre

Ce lot contient exactement douze icones d'objets originales fan-made :

- Sharknado : 4 icones ;
- Godzilla: The Series (1998) : 4 icones ;
- Pee-wee's Big Adventure (1985) : 4 icones.

Chaque objet a fait l'objet d'un appel OpenAI ImageGen integre distinct, lance
apres sa propre recherche de reference. Le lot totalise donc exactement douze
appels, sans appel correctif, variante ou planche multi-objets.

Aucun manifest, registre d'assets, fichier JavaScript, musique, fichier d'un
autre agent, commit ou deploiement n'a ete modifie pour ce lot.

## Fichiers produits

### Sharknado

- `public/sprites/generated/items/sharknado/chainsaw.png`
- `public/sprites/generated/items/sharknado/surfboard.png`
- `public/sprites/generated/items/sharknado/explosive-cylinder.png`
- `public/sprites/generated/items/sharknado/shark-tooth.png`

### Godzilla: The Series

- `public/sprites/generated/items/godzilla-the-animated-series/h-e-a-t-communicator.png`
- `public/sprites/generated/items/godzilla-the-animated-series/sonic-signaler.png`
- `public/sprites/generated/items/godzilla-the-animated-series/dna-sample-vial.png`
- `public/sprites/generated/items/godzilla-the-animated-series/tracking-beacon.png`

### Pee-wee

- `public/sprites/generated/items/pee-wee/red-bicycle.png`
- `public/sprites/generated/items/pee-wee/red-bow-tie.png`
- `public/sprites/generated/items/pee-wee/bicycle-lock.png`
- `public/sprites/generated/items/pee-wee/fortune-card.png`

## Methode de generation et normalisation

1. Recherche d'une reference officielle ou primaire avant chaque appel ; a
   defaut, recoupement avec une source de film/episode fiable et signalement
   explicite de toute extrapolation.
2. Un appel OpenAI ImageGen integre independant par objet, en pixel art 32-bit
   detaille et sans reutilisation d'une planche commune.
3. Generation sur fond chroma parfaitement uni : `#00FF00` pour sept objets et
   `#FF00FF` pour la dent et les quatre objets Godzilla TAS.
4. Suppression locale du chroma avec le pipeline installe
   `remove_chroma_key.py --auto-key border --soft-matte --despill
   --edge-contract 1`.
5. Recadrage sur alpha utile, redimensionnement premultiplie, recentrage dans
   une boite maximale de `448 x 448`, puis export sur canevas `512 x 512`.
6. Normalisation de chaque pixel totalement transparent vers `(0, 0, 0, 0)`.
7. Inspection individuelle a la resolution native, puis inspection groupee a
   `224 px` et `64 px` sur damiers clair et sombre.
8. Suppression des sources chroma, versions alpha, scripts et planches de
   controle temporaires apres validation.

## References et decisions de fidelite

### Sharknado

References communes :

- [SYFY - Ian Ziering owns Fin Shepard's Sharknado 2 chainsaw](https://www.syfy.com/syfy-wire/ian-ziering-fin-shepard-sharknado-chainsaw)
- [The New Yorker - tournage de Sharknado 2](https://www.newyorker.com/culture/culture-desk/present-creation-sharknado-2)
- [SYFY - guide officiel de la franchise](https://www.syfy.com/syfy-wire/sharknado-tenth-anniversary-ultimate-guide-to-syfy-film-franchise)
- [IMDb - synopsis detaille de Sharknado](https://www.imdb.com/title/tt2724064/plotsummary/)
- [Rotten Tomatoes - affiche et fiche Sharknado](https://www.rottentomatoes.com/m/sharknado)

| Objet | Reference visuelle retenue et decision |
| --- | --- |
| Tronconneuse | La source SYFY identifie l'arme emblematique de Fin et le reportage de plateau decrit une grosse tronconneuse orange. L'icone conserve carter orange, long guide acier, chaine sombre et poignees noires. Le marquage de plateau est volontairement omis. |
| Planche de surf | Le guide SYFY etablit Fin comme ancien surfeur et le synopsis documente l'utilisation de sa planche contre un requin. Aucun accessoire de production exploitable n'a ete trouve : palette ivoire/bleu/corail et morsure de rail sont une extrapolation originale lisible, sans marque. |
| Bouteille explosive | Le synopsis documente les bombes au propane improvisees et larguees dans les tornades. Le cylindre rouge, ses bandes noires et son allumeur sans chiffres traduisent cette fonction sans pretendre reproduire un prop precis. |
| Dent de requin | L'affiche montre des requins de type grand blanc aux dents triangulaires. La dent isolee est un trophee original, pas un accessoire visible a l'ecran. |

### Godzilla: The Series (1998)

References communes :

- [SciFi Japan - The Ultimate Guide to Godzilla: The Series](https://www.scifijapan.com/anime-animation/godzilla-the-series)
- [Wikizilla - H.E.A.T.](https://wikizilla.org/wiki/H.E.A.T.)
- [Wikizilla - DNA Mimic](https://wikizilla.org/wiki/DNA_Mimic)
- [Wikizilla - Godzilla: The Series](https://wikizilla.org/wiki/Godzilla%3A_The_Series)

Le guide SciFi Japan contient des visuels fournis par Sony Pictures Family
Entertainment et decrit les episodes, l'esthetique de production, l'expertise
de Craven et le Sonic Signaler. Il constitue la reference principale du lot.

| Objet | Reference visuelle retenue et decision |
| --- | --- |
| Communicateur H.E.A.T. | Aucun modele canonique autonome suffisamment documente n'a ete trouve. L'icone est une extrapolation explicite du materiel de terrain anguleux de la serie : coque grise, antenne noire, ecran vert abstrait, grille et voyant rouge, sans acronyme copie. |
| Sonic Signaler | Le guide SciFi Japan confirme que Craven presente cet appareil dans `Web Site` afin de convertir le langage de Godzilla en ultrasons. La forme compacte sur trepied, le grand transducteur circulaire et le voyant rouge restent une interpretation originale conforme a sa fonction. |
| Fiole d'ADN | H.E.A.T. analyse regulierement des mutations et `Trust No One` place l'ADN au coeur de l'intrigue. Aucun flacon nomme n'est documente : verre epais, liquide ambre et fragment reptilien vert forment une extrapolation de laboratoire clairement assumee. |
| Balise de suivi | Le guide decrit Craven comme expert des dispositifs mecaniques sophistiques et du suivi. Aucun prop distinct n'est documente : la balise ovale magnetique, blindee et munie d'une diode verte est une extrapolation de terrain coherente. |

### Pee-wee's Big Adventure (1985)

References communes :

- [The Alamo - Artifact Spotlight: Pee Wee's Red Bicycle](https://www.thealamo.org/support/preservation/updates/artifact-spotlight-pee-wees-red-bicycle)
- [The Alamo - acquisition du velo utilise a l'ecran](https://www.thealamo.org/alamo-trust/pressroom/the-alamo-acquires-screen-used-bicycle-from-pee-wees-big-adventure)
- [Propstore - velo de production et composants documentes](https://propstoreauction.com/lot-details/index/catalog/449/lot/157113/259-Pee-Wee-Herman-s-Paul-Reubens-Production-Made-Bicycle-with-Replica-Dressing-Components-PEE-WEE-S-BIG-ADVENTURE-1985)
- [Criterion Collection - Pee-wee's Big Adventure](https://www.criterion.com/films/34870-pee-wee-s-big-adventure)
- [AFI Catalog - synopsis du film](https://catalog.afi.com/Film/67303-PEE-WEES-BIGADVENTURE)
- [BFI - notes de programme Pee-wee's Big Adventure](https://bfidatadigipres.github.io/scala%3Cbr%3Esex%2C%20drugs%20and%20rock%20and%20roll%20cinema/2024/01/12/peewees-big-adventure/)

| Objet | Reference visuelle retenue et decision |
| --- | --- |
| Velo rouge | L'Alamo documente le velo cascade restaure et Propstore detaille les composants. L'icone reprend le cruiser rouge et blanc entier, pneus a flanc blanc, disques spirales, sacoches, retros, fanions, phare a ailettes/helice et sirene-tigre. Aucun nom, plaque ou marque n'est recopie. Vue de profil trois-quarts, sans pilote ni support. |
| Noeud papillon rouge | Les sources BFI et Criterion confirment le petit noeud rouge de la tenue signature. Il est isole en tissu rouge vif, compact, symetrique et sans chemise ni personnage. |
| Antivol | Le photogramme Criterion et le synopsis AFI confirment la chaine demesuree fixee au clown. L'icone privilegie ce gag canonique plutot qu'un cable generique : longue chaine acier enroulee et cadenas rouge integre, sans clown ni velo. |
| Carte de voyance | La scene canonique de Madame Ruby utilise une boule de cristal et ne montre pas de carte signature. Cette icone demandee est donc volontairement une extrapolation originale : oeil, croissant, roue rouge et arche impossible, sans texte et sans reprendre un tarot existant. |

## Prompts finaux

Le socle commun applique a chacun des douze appels etait :

```text
Create exactly one complete, centered inventory item in polished detailed
32-bit pixel art. Original fan-made artwork informed by the researched source,
never a copied frame, poster, prop photograph or game asset. Keep the complete
object visible in a catalogue three-quarter view with generous padding and a
strong small-icon silhouette. Use one perfectly flat chroma-key background
with no floor, shadow, reflection, gradient or texture. No person, character,
hand, readable text, letters, numbers, logo, UI, border or watermark.
```

Specifications distinctes passees dans les douze appels :

| Fichier | Specification propre a l'appel |
| --- | --- |
| `chainsaw.png` | Grosse tronconneuse orange, long guide acier, chaine sombre, poignees noires, usure humide. |
| `surfboard.png` | Planche retro ivoire/bleu, bandes corail et or, trois derives, rail mordu, vue diagonale. |
| `explosive-cylinder.png` | Cylindre rouge a cage de valve, rubans noirs, allumeur fixe, fils courts et interrupteur rouge. |
| `shark-tooth.png` | Une dent triangulaire ivoire a deux bords denteles et racine bilobee intacte. |
| `h-e-a-t-communicator.png` | Radio grise anguleuse, antenne, ecran vert abstrait, grille, voyant rouge et deux boutons. |
| `sonic-signaler.png` | Balise noire sur trepied integre, transducteur concentrique, diode rouge et antenne telescopique. |
| `dna-sample-vial.png` | Fiole blindee sans etiquette, liquide ambre et un fragment tissulaire reptilien vert. |
| `tracking-beacon.png` | Balise ovale magnetique gris-olive, bumper noir, diode verte et antenne repliee. |
| `red-bicycle.png` | Cruiser rouge/blanc complet de profil trois-quarts, accessoires iconiques, sans pilote ni support. |
| `red-bow-tie.png` | Petit noeud papillon rouge cerise, ailes compactes, noeud central net et sangle rentree. |
| `bicycle-lock.png` | Tres longue chaine acier enroulee, raccords rouges et un cadenas rouge fixe. |
| `fortune-card.png` | Carte creme/bordeaux/or, oeil dans un croissant, roue rouge et arche, aucun symbole linguistique. |

## Validation technique

| Fichier | Dimensions | Mode | Marges G/H/D/B | RGB sous alpha 0 | Chroma visible |
| --- | --- | --- | --- | ---: | ---: |
| `chainsaw.png` | 512x512 | RGBA | 32/96/32/97 | 0 | 0 |
| `surfboard.png` | 512x512 | RGBA | 71/32/71/32 | 0 | 0 |
| `explosive-cylinder.png` | 512x512 | RGBA | 126/32/126/32 | 0 | 0 |
| `shark-tooth.png` | 512x512 | RGBA | 81/32/82/32 | 0 | 0 |
| `h-e-a-t-communicator.png` | 512x512 | RGBA | 134/32/135/32 | 0 | 0 |
| `sonic-signaler.png` | 512x512 | RGBA | 133/32/133/32 | 0 | 0 |
| `dna-sample-vial.png` | 512x512 | RGBA | 165/32/165/32 | 0 | 0 |
| `tracking-beacon.png` | 512x512 | RGBA | 32/74/32/75 | 0 | 0 |
| `red-bicycle.png` | 512x512 | RGBA | 32/58/32/58 | 0 | 0 |
| `red-bow-tie.png` | 512x512 | RGBA | 32/156/32/156 | 0 | 0 |
| `bicycle-lock.png` | 512x512 | RGBA | 32/86/32/86 | 0 | 0 |
| `fortune-card.png` | 512x512 | RGBA | 105/32/106/32 | 0 | 0 |

Resultat global :

```json
{
  "files": 12,
  "imageGenCalls": 12,
  "callsPerObject": 1,
  "dimensionsValid": 12,
  "rgbaValid": 12,
  "transparentCornersValid": 12,
  "minimumMarginValid": 12,
  "hiddenRgbViolations": 0,
  "visibleChromaPixels": 0,
  "visualReviewPassed": 12
}
```

## Inspection visuelle finale

Les douze PNG finaux ont ete inspectes individuellement a `512 px`, puis en
lot a `224 px` et `64 px` sur fonds clair et sombre. Tous restent entiers,
centres et reconnaissables. Le velo est complet et conserve une vraie lecture
de profil trois-quarts sans pilote. Les appareils H.E.A.T. restent distincts
par leur silhouette et leur fonction. La dent, le noeud, la chaine et la carte
gardent une masse visuelle suffisante a `64 px`.

Aucun objet ne contient de personnage, main, accessoire parasite, texte
lisible, logo ou watermark. Les bords alpha sont propres sur les deux types de
fond. Le controle final porte sur les douze PNG effectivement ecrits dans le
depot, pas sur les sources ImageGen temporaires.
