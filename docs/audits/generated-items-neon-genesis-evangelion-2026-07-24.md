# Neon Genesis Evangelion - quatre objets OpenAI

Date : 2026-07-24

## Perimetre de continuite

La selection se limite a la serie televisee originale et a `The End of
Evangelion`. Aucun design propre aux films `Rebuild of Evangelion` n'est
utilise.

| Slot | Objet | Usage |
|---|---|---|
| Attaque / interaction | Progressive Knife | Arme rapprochee standard d'un Evangelion. |
| Defense / survie | NERV Access Card | Ouvrir un acces securise de terrain. |
| Tempo / soin | S-DAT Player | Stabiliser le rythme et l'etat du porteur. |
| Evenement | LCL-Filled Entry Plug | Declencher une mise en interface pilote / EVA. |

References consultees :

- [Evangelion - portail officiel](https://www.evangelion.jp/)
- [EvaGeeks - S-DAT](https://wiki.evageeks.org/SDAT)
- [EvaGeeks - LCL](https://wiki.evageeks.org/LCL)
- [EvaGeeks - Episode 05 et carte d'identification NERV](https://wiki.evageeks.org/Episode_05)
- [EvaGeeks - Entry Plug](https://wiki.evageeks.org/Entry_Plug)
- [Evangelion Wiki - armement et Progressive Knife](https://evangelion.fandom.com/wiki/Evangelion_Weapons)

L'objet terrain LCL est l'Entry Plug elle-meme, conteneur canonique rempli de
LCL, plutot qu'une fiole portable inventee. La carte conserve seulement une
silhouette et des bandes de securite evocatrices : aucun logo NERV, portrait
ou texte n'est reproduit. Le Progressive Knife suit le type Bowie de la serie
originale et non une variante Rebuild.

## Production et integration

Chaque icone provient d'un appel ImageGen OpenAI distinct, sur fond chroma
uniforme. Les sorties ont ete detourees avec `remove_chroma_key.py`, puis
normalisees en PNG RGBA `512x512`. Le RGB cache sous alpha nul a ete force a
zero. La carte a ensuite ete recentree pour porter sa marge minimale a 44 px.

Fichiers integres dans
`public/sprites/generated/items/neon-genesis-evangelion/` :

- `progressive-knife.png`
- `nerv-access-card.png`
- `s-dat-player.png`
- `lcl-filled-entry-plug.png`

Le pack est declare dans `loreItemOverrides.js`. Les anciens champs inline
`gear/event` ne participent plus a la construction de cet univers.

## Controle final

| Fichier | Format | Garde alpha G/H/D/B | Chroma visible | RGB cache | Composantes utiles |
|---|---|---:|---:|---:|---:|
| `progressive-knife.png` | `512x512 RGBA` | `35/62/34/69` | 0 | 0 | 1 |
| `nerv-access-card.png` | `512x512 RGBA` | `45/85/44/82` | 0 | 0 | 1 |
| `s-dat-player.png` | `512x512 RGBA` | `49/47/51/49` | 0 | 0 | 1 |
| `lcl-filled-entry-plug.png` | `512x512 RGBA` | `54/55/35/88` | 0 | 0 | 1 |

Inspection visuelle : quatre objets complets, centres et distincts, sans
personnage, pilote, main, doublon, decor, texte lisible, logo ni watermark.
Verdict : **PASS 4/4**.

`npm run items:audit` valide un registre de 488 objets, 228 PNG disponibles et
57 univers complets ; `Neon Genesis Evangelion` figure parmi les univers
complets.
