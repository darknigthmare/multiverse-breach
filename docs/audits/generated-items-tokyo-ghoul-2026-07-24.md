# Tokyo Ghoul - quatre objets OpenAI

Date : 2026-07-24

## Selection canonique

Le pack couvre a la fois le terrain CCG, l'identite de Kaneki et la fonction
sociale de l'Anteiku :

| Slot | Objet | Usage |
|---|---|---|
| Attaque / interaction | Quinque Case | Transporter puis deployer un quinque CCG. |
| Defense / survie | Kaneki's Ghoul Mask | Dissimuler l'identite de Kaneki lors d'une operation. |
| Tempo / soin | Rc Suppressant Injector | Freiner temporairement l'activite Rc. |
| Evenement | Anteiku Coffee Cup | Declencher une halte ou une rencontre a l'Anteiku. |

References consultees :

- [Young Jump - donnees et terminologie officielles Tokyo Ghoul](https://youngjump.jp/tokyoghoul/tg/data/)
- [Marvelous - glossaire officiel de l'anime](https://www.marv.jp/special/tokyoghoul/first/glossary.html)
- [Marvelous - histoire officielle et Anteiku](https://www.marv.jp/special/tokyoghoul/first/story.html)
- [Tokyo Ghoul Wiki - masque](https://tokyoghoul.fandom.com/wiki/Mask)
- [Tokyo Ghoul Wiki - suppresseurs Rc](https://tokyoghoul.fandom.com/wiki/Rc_suppressants)
- [Tokyo Ghoul Wiki - Anteiku](https://tokyoghoul.fandom.com/wiki/Anteiku)
- [Tokyo Ghoul Wiki - quinque transporte en mallette](https://tokyoghoul.fandom.com/wiki/Higher_Mind)

La mallette reste fermee pour former un objet d'inventaire unique. Le masque
est vide, sans visage, cheveux ni porteur. La tasse ne reprend aucun logo.

## Production et integration

Chaque icone provient d'un appel ImageGen OpenAI distinct, sur fond chroma
uniforme. Les sorties ont ete detourees avec `remove_chroma_key.py`, puis
normalisees en PNG RGBA `512x512`. Chaque pixel totalement transparent possede
un RGB cache nul.

Fichiers integres dans
`public/sprites/generated/items/tokyo-ghoul/` :

- `quinque-case.png`
- `kaneki-s-ghoul-mask.png`
- `rc-suppressant-injector.png`
- `anteiku-coffee-cup.png`

Le pack est declare dans `loreItemOverrides.js` et remplace le trio inline
historique ainsi que l'ancien evenement de transformation.

## Controle final

| Fichier | Format | Garde alpha G/H/D/B | Chroma visible | RGB cache | Composantes utiles |
|---|---|---:|---:|---:|---:|
| `quinque-case.png` | `512x512 RGBA` | `55/71/53/67` | 0 | 0 | 1 |
| `kaneki-s-ghoul-mask.png` | `512x512 RGBA` | `39/38/44/44` | 0 | 0 | 1 |
| `rc-suppressant-injector.png` | `512x512 RGBA` | `46/55/39/60` | 0 | 0 | 1 |
| `anteiku-coffee-cup.png` | `512x512 RGBA` | `123/117/77/133` | 0 | 0 | 1 |

Inspection visuelle : objets entiers, centres et distincts, sans personnage,
main, doublon, decor, texte lisible, logo ni watermark. Verdict :
**PASS 4/4**.

`npm run items:audit` valide un registre de 488 objets, 228 PNG disponibles et
57 univers complets ; `Tokyo Ghoul` figure parmi les univers complets.
