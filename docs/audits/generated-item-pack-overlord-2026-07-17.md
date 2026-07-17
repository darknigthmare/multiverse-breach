# Pack d'items Overlord Anime - 2026-07-17

## Perimetre

Pack complet des quatre icones declarees dans `src/game/loreItemOverrides.js`
pour `Overlord Anime`.

| Objet | Fichier |
| --- | --- |
| Staff of Ainz Ooal Gown | `public/sprites/generated/items/overlord-anime/staff-of-ainz-ooal-gown.png` |
| Ring of Nazarick | `public/sprites/generated/items/overlord-anime/ring-of-nazarick.png` |
| Red Healing Potion | `public/sprites/generated/items/overlord-anime/red-healing-potion.png` |
| Momonga's Red Orb | `public/sprites/generated/items/overlord-anime/momonga-s-red-orb.png` |

## References visuelles et lore

### Staff of Ainz Ooal Gown

- KADOKAWA / KDcolle, replique officielle du staff :
  https://prtimes.jp/main/html/rd/p/000011230.000007006.html
- Overlord Wiki, apparence et image du databook :
  https://overlordmaruyama.fandom.com/wiki/Staff_of_Ainz_Ooal_Gown

Points conserves : silhouette longue et torsadee, sept serpents, sept gemmes de
couleurs distinctes, construction or-noir et partie cristalline bleutee.

### Ring of Nazarick

- Collaboration joailliere officielle Overlord x KARATZ :
  https://store.karatz.jp/en/collections/overlord
- Overlord Wiki, vue anime et description :
  https://overlordmaruyama.fandom.com/wiki/Ring_of_Ainz_Ooal_Gown

Points conserves : face octogonale, amethyste centrale, embleme noir et bordure
gravee. La couleur or suit explicitement le registre local, meme si certaines
descriptions canon indiquent une monture argentee.

### Red Healing Potion

- Overlord Wiki, vue anime et description du Minor Healing Potion :
  https://overlordmaruyama.fandom.com/wiki/Minor_Healing_Potion
- Image de l'episode 5 montrant le flacon :
  https://karatakewarityoppu.hatenablog.com/entry/2015/08/05/%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AD%E3%83%BC%E3%83%89_%E7%AC%AC5%E8%A9%B1%E3%80%8C%E4%BA%8C%E4%BA%BA%E3%81%AE%E5%86%92%E9%99%BA%E8%80%85%E3%80%8D_%E3%81%82%E3%82%89%E3%81%99

Points conserves : liquide YGGDRASIL rouge, flacon facette, longue encolure,
cerclages dores et bouchon en forme de gemme rouge.

### Momonga's Red Orb

- FURYU HOBBY MALL / F:NEX, figurine officielle avec gros plan de la gemme
  abdominale et eclairage LED :
  https://furyu-hm.com/products/fnx-gyfi8bvg
- Overlord Wiki, classification World Item et description de l'orbe rouge
  lumineuse :
  https://overlordmaruyama.fandom.com/wiki/Momonga%27s_Red_Orb

Points conserves : grande sphere rouge polie, noyau lumineux interne intense,
aspect cramoisi sombre et sertissage metallique noir secondaire. Le sertissage
detache permet de transformer proprement l'objet abdominal en pickup autonome,
conformement a la description du registre local.

## Generation OpenAI

Mode utilise : OpenAI ImageGen integre, une generation distincte par objet.
Les images de reference ont servi a verrouiller la silhouette et les details,
sans copier leur decor ou leur presentation.

### Prompt final - Staff

> Icone de ramassage pixel art detaillee du Staff of Ainz Ooal Gown. Un seul
> staff complet, long, or-noir, couronne de sept serpents tenant exactement sept
> gemmes de couleurs differentes, grip cristallin bleute, entierement visible,
> sans personnage, texte, logo, cadre, ombre ou recadrage, sur fond chroma vert
> uniforme.

### Prompt final - Ring

> Icone de ramassage pixel art detaillee du Ring of Nazarick. Un seul anneau
> sigillaire lourd en or antique, face octogonale, grande amethyste violette,
> embleme noir dans la pierre et bordure gravee, anneau entierement visible,
> sans main, texte, cadre, ombre ou recadrage, sur fond chroma vert uniforme.

### Prompt final - Potion

> Icone de ramassage pixel art detaillee de la potion de soin rouge YGGDRASIL.
> Un seul flacon complet, verre facette, liquide rouge vif, encolure fine,
> cerclages dores et bouchon-gemme rouge, sans personnage, etiquette, texte,
> cadre, ombre ou recadrage, sur fond chroma vert uniforme.

### Prompt final - Momonga's Red Orb

> Icone event-item pixel art detaillee de Momonga's Red Orb. Une seule grande
> sphere cramoisie parfaitement polie, noyau rouge-blanc profond, reflets rubis
> sombres et sertissage compact en metal noir a quatre griffes. Objet complet,
> sans personnage, squelette, os, texte, cadre, aura externe, ombre ou
> recadrage, sur fond chroma vert uniforme.

## Normalisation

- Extraction du fond avec
  `C:/Users/chuck/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`.
- Cle detectee automatiquement sur le bord.
- Matte adouci, despill et contraction de bord de 1 px.
- Redimensionnement final en `512x512` avec echantillonnage nearest-neighbor
  pour conserver les pixels nets.
- Staff recentre avec 20 px de marge verticale apres controle initial.

## Validation

| Fichier | Format | Boite alpha | Marges G/H/D/B | Alpha partiel | Chroma residuel |
| --- | --- | --- | --- | ---: | ---: |
| `staff-of-ainz-ooal-gown.png` | 512x512 RGBA | 181,20 - 330,492 | 181 / 20 / 182 / 20 | 875 px | 0 px |
| `ring-of-nazarick.png` | 512x512 RGBA | 42,18 - 469,465 | 42 / 18 / 43 / 47 | 968 px | 0 px |
| `red-healing-potion.png` | 512x512 RGBA | 190,27 - 321,493 | 190 / 27 / 191 / 19 | 498 px | 0 px |
| `momonga-s-red-orb.png` | 512x512 RGBA | 48,40 - 464,476 | 48 / 40 / 48 / 36 | 953 px | 0 px |

Controle visuel final :

- un seul objet par image ;
- aucun element coupe ;
- transparence reelle sur les quatre coins ;
- aucune frange verte visible ;
- aucun personnage, texte ajoute, logo externe ou cadre ;
- silhouette lisible en taille d'icone.

## Fichiers exclus

Aucun fichier JS, manifeste, registre, commit, push ou deploiement n'a ete
modifie ou execute pour ce lot.
