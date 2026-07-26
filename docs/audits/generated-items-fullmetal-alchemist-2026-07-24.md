# Fullmetal Alchemist - quatre objets OpenAI

Date : 2026-07-24

## Selection canonique

Le pack relie l'alchimie de terrain, le statut d'Alchimiste d'Etat, l'automail
et l'enjeu central de la Pierre Philosophale :

| Slot | Objet | Usage |
|---|---|---|
| Attaque / interaction | Transmutation Chalk | Tracer un cercle de transmutation sur le terrain. |
| Defense / survie | State Alchemist Pocket Watch | Justifier l'acces et les moyens lies au statut d'Etat. |
| Tempo / soin | Automail Maintenance Kit | Entretenir ou remettre en service un automail. |
| Evenement | Philosopher's Stone | Alimenter un evenement d'alchimie a cout narratif eleve. |

References consultees :

- [Fullmetal Alchemist USA - introduction officielle](https://fullmetalalchemistusa.com/introduction/)
- [Fullmetal Alchemist USA - personnages officiels](https://fullmetalalchemistusa.com/character/)
- [VIZ / Simon and Schuster - volume 1 du manga](https://www.simonandschuster.com/books/Fullmetal-Alchemist-Vol-1/Hiromu-Arakawa/Fullmetal-Alchemist/9781591169208)
- [Fullmetal Alchemist Wiki - Alchimistes d'Etat et montre](https://fma.fandom.com/wiki/Alchemist)
- [Fullmetal Alchemist Wiki - Pierre Philosophale](https://fma.fandom.com/wiki/Philosopher%27s_Stone)
- [Fullmetal Alchemist Wiki - principes et cercles d'alchimie](https://fma.fandom.com/wiki/Alchemy)

La craie et le kit ferme sont des abstractions d'inventaire sobres pour deux
pratiques canoniques : tracer les arrays et maintenir l'automail. Ils ne sont
pas presentes comme des reliques nommees. La montre n'affiche ni crest copie,
ni inscription, ni chiffres.

## Production et integration

Chaque icone provient d'un appel ImageGen OpenAI distinct, sur fond chroma
uniforme. Les sorties ont ete detourees avec `remove_chroma_key.py`, puis
normalisees en PNG RGBA `512x512`. Le RGB cache sous alpha nul a ete nettoye.

Fichiers integres dans
`public/sprites/generated/items/fullmetal-alchemist/` :

- `transmutation-chalk.png`
- `state-alchemist-pocket-watch.png`
- `automail-maintenance-kit.png`
- `philosopher-s-stone.png`

Le pack est declare dans `loreItemOverrides.js` et remplace les anciens champs
inline `gear/event` lors de la construction runtime.

## Controle final

| Fichier | Format | Garde alpha G/H/D/B | Chroma visible | RGB cache | Composantes utiles |
|---|---|---:|---:|---:|---:|
| `transmutation-chalk.png` | `512x512 RGBA` | `84/69/65/75` | 0 | 0 | 1 |
| `state-alchemist-pocket-watch.png` | `512x512 RGBA` | `74/44/53/42` | 0 | 0 | 1 |
| `automail-maintenance-kit.png` | `512x512 RGBA` | `50/97/48/91` | 0 | 0 | 1 |
| `philosopher-s-stone.png` | `512x512 RGBA` | `107/94/106/112` | 0 | 0 | 1 |

Inspection visuelle : quatre objets uniques, entiers et centres, sans
personnage, main, visage parasite, doublon, decor, texte lisible, logo ni
watermark. Verdict : **PASS 4/4**.

`npm run items:audit` valide un registre de 488 objets, 228 PNG disponibles et
57 univers complets ; `Fullmetal Alchemist` figure parmi les univers complets.
