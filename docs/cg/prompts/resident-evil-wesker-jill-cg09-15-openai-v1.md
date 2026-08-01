# Resident Evil — Wesker et Jill — CG09 à CG15 OpenAI v1

Date de production : 2026-08-01
Générateur : OpenAI ImageGen intégré, via le skill `imagegen`
Format source accepté : PNG RGB opaque, portrait exact 1086 × 1448 (3:4)

## Périmètre et références

Ce lot contient quatorze illustrations originales, non officielles et fan-made pour Multiverse Breach. Les CG01 locales ont servi uniquement d'ancres d'identité, de silhouette, de palette et de rendu :

- Wesker : `public/cg/resident-evil/wesker/character-solo-openai-v1.png`;
- Jill : `public/cg/resident-evil/jill/character-solo-openai-v1.png`.

Aucun bitmap officiel, screenshot, poster, key art, scan d'acteur ou modèle réel n'a été fourni au générateur. Les pages Capcom citées par le catalogue verrouillent uniquement les faits de lore et les périodes.

## Contrat commun de génération

Chaque appel demande une nouvelle composition verticale 3:4, un personnage adulte unique, entier ou en plan trois-quarts lisible, dans le style illustré/pixel-art du projet. Les contraintes communes interdisent texte, pseudo-texte, logo, emblème, UI, watermark, signature, copie d'une composition officielle, likeness d'acteur ou de scan model, sexualisation, romance, humiliation et violence graphique.

Les variantes `alignmentSwap`, `genderSwap` et `zombieVersion` sont explicitement des branches **What If** non canoniques. Les variantes temporelles utilisent un adulte et ne prétendent pas créer un événement canon inédit. Les corruptions restent précoces et non graphiques.

## Registre Wesker

| Type | Contrat de scène | Destination |
|---|---|---|
| `beachFamily` | Wesker surveille une plage publique en tenue estivale noire couvrante, sans arme ni romance. | `public/cg/resident-evil/wesker/beach-family-openai-v1.png` |
| `maidService` | Maître d'hôtel tactique professionnel transportant du linge propre avec une précision glaciale. | `public/cg/resident-evil/wesker/maid-service-openai-v1.png` |
| `goofy` | Analyse excessivement sérieuse d'herbes ordinaires; gag visuel digne, sans texte. | `public/cg/resident-evil/wesker/goofy-openai-v1.png` |
| `alignmentSwap` | What If : Wesker aide une fouille de secours, manteau tactique clair et lanterne, sans victime. | `public/cg/resident-evil/wesker/alignment-swap-openai-v1.png` |
| `genderSwap` | What If adulte féminin, même autorité froide, cheveux blonds, lunettes et manteau tactique. | `public/cg/resident-evil/wesker/gender-swap-openai-v1.png` |
| `zombieVersion` | Contamination Uroboros précoce par filaments noirs contenus, sans plaie ni déformation graphique. | `public/cg/resident-evil/wesker/zombie-version-openai-v1.png` |
| `firstStep` | Wesker adulte capitaine S.T.A.R.S. en 1998, uniforme tactique d'époque, sans likeness réel. | `public/cg/resident-evil/wesker/first-step-openai-v1.png` |

## Registre Jill

| Type | Contrat de scène | Destination |
|---|---|---|
| `beachFamily` | Jill sur une plage publique en tenue sportive bleu-gris couvrante, naturelle et non sexualisée. | `public/cg/resident-evil/jill/beach-family-openai-v1.png` |
| `maidService` | Gestionnaire de refuge professionnelle rangeant méthodiquement les fournitures, sans soumission. | `public/cg/resident-evil/jill/maid-service-openai-v1.png` |
| `goofy` | Trop d'herbes de soin pour une minuscule sacoche; calme professionnel et gag sans texte. | `public/cg/resident-evil/jill/goofy-openai-v1.png` |
| `alignmentSwap` | What If : opératrice biotech rivale en uniforme rouge sombre sans logo, sans victime. | `public/cg/resident-evil/jill/alignment-swap-openai-v1.png` |
| `genderSwap` | What If adulte masculin, même langage d'uniforme bleu-gris, béret, équipement et compétence. | `public/cg/resident-evil/jill/gender-swap-openai-v1.png` |
| `zombieVersion` | Infection virale précoce par pâleur et veines discrètes, sans morsure, plaie ni gore. | `public/cg/resident-evil/jill/zombie-version-openai-v1.png` |
| `futureExperienced` | Jill adulte expérimentée en équipement maritime, à bord d'un navire original, sans likeness réel. | `public/cg/resident-evil/jill/future-experienced-openai-v1.png` |

## QA et livraison

- 14/14 sources présentes, distinctes, RGB opaques et au ratio exact 3:4;
- masters WebP : 1536 × 2048;
- miniatures WebP : 384 × 512;
- filtres famille/âge/consentement et statut canon portés par `cgCatalog.js`;
- déverrouillage strictement lié à la possession du héros;
- aucune variante romantique, furry, nouveau personnage ou nouvel univers ajoutée.

Deux sorties Wesker produites hors ratio par une tâche concurrente ont été normalisées mécaniquement à 1086 × 1448 avant dérivation. Cette opération n'ajoute ni contenu ni élément graphique. Les empreintes finales sont enregistrées dans `public/cg/cg-manifest.json`.

## Sources factuelles officielles Capcom

Les pages suivantes ont été consultées uniquement pour verrouiller des faits de continuité. Aucun visuel, screenshot, affiche, scan, key art ou bitmap Capcom n'a été téléchargé, copié ou fourni à ImageGen.

- [Resident Evil — History](https://game.capcom.com/residentevil/uk/re-history.html) : les événements de *Resident Evil 0* et du premier *Resident Evil* se déroulent les 23 et 24 juillet 1998; Wesker dirige alors l'Alpha Team S.T.A.R.S. et Jill en fait partie.
- [Albert Wesker — Extra File](https://game.capcom.com/residentevil/uk/exfile-2-9.html) : Wesker est le capitaine ingénieux des S.T.A.R.S. tout en étant un espion d'Umbrella; cheveux blonds peignés, lunettes opaques et vêtements sombres sont ses marqueurs constants.
- [Wesker-Uroboros — Extra File](https://game.capcom.com/residentevil/fr/exfile-1-43.html?site=pc) : Wesker s'infecte volontairement avec Uroboros et des tentacules caractéristiques enveloppent ses bras. CG14 en propose uniquement une lecture précoce, intacte et non graphique.
- [Jill Valentine: Famed Operator, Storied Survivor](https://game.capcom.com/residentevil/de/umbrella-20240607180000.html) : Jill est spécialiste EOD / sécurité arrière des S.T.A.R.S., aide des civils à Raccoon City, devient l'un des onze membres fondateurs du BSAA, survit au contrôle de Wesker puis suit une réhabilitation.
- [Dressed to Kill](https://game.capcom.com/residentevil/fr/umbrella-20210312110000.html) : l'uniforme S.T.A.R.S. du premier jeu est distinct de ses tenues plus mobiles de *Revelations* et *Resident Evil 5*.
- [Resident Evil: Death Island — profil Jill](https://game.capcom.com/residentevil/en/news-3122.html) : après observation et réhabilitation, Jill retourne en service; les effets du virus ont ralenti sa détérioration physique. `futureExperienced` la présente donc comme une opératrice ultérieure expérimentée sans vieillissement artificiellement accentué.

Toutes les compositions finales sont des fan-arts originaux non officiels; les pages ci-dessus ont servi aux faits seulement.

## Provenance détaillée des quatorze PNG finaux

Sauf les deux normalisations géométriques explicitement détaillées après le tableau, chaque destination est une copie octet pour octet de la source built-in OpenAI ImageGen indiquée.

| Personnage / CG | Source OpenAI ImageGen acceptée | Destination projet | Octets | SHA-256 final |
|---|---|---|---:|---|
| Wesker CG09 Beach | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-8b04c534-a2b8-4244-9007-e48ab27f6080.png` | `public/cg/resident-evil/wesker/beach-family-openai-v1.png` | 2 255 837 | `226c46ede3c704a7c067185230667965b22dd93c8aae8ad5bfaa1a67edca247e` |
| Wesker CG10 Service | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-28d6e4f3-8f4c-4740-91f9-fa8daeed7b71.png` | `public/cg/resident-evil/wesker/maid-service-openai-v1.png` | 1 939 703 | `e893122bdde28c3a7b2d1b5c6778c5d83eeaf7b39087f7ce9452bf86232dfa11` |
| Wesker CG11 Goofy | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-720b4cdd-437a-4dcc-84d2-81717b51b831.png`, puis normalisation NN de format | `public/cg/resident-evil/wesker/goofy-openai-v1.png` | 3 000 127 | `61eef9c7583001a24d6b8f1d1da3e61a33ec95bb6fbc2499689915baf8201896` |
| Wesker CG12 Alignment | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-cceeef8a-b886-4357-b5c3-fdbe1a3c8a41.png`, puis normalisation NN de format | `public/cg/resident-evil/wesker/alignment-swap-openai-v1.png` | 3 532 071 | `7eb9ba115f2b1acc43cfb3f69e31c4b1495040983e36e21a86f608d262796a3c` |
| Wesker CG13 Gender | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-bec9ed7a-e854-4d56-9b91-85613dca8bb5.png` | `public/cg/resident-evil/wesker/gender-swap-openai-v1.png` | 1 999 366 | `3d2e52e03de4ff6ecf9da25d351e555f39c850411f827243d8e32c5f79bd04a7` |
| Wesker CG14 Zombie/Uroboros | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-72984459-87c0-400f-8f48-578e7082a19c.png` | `public/cg/resident-evil/wesker/zombie-version-openai-v1.png` | 2 199 242 | `2275265160d7f770994acb422fe2c5dc6095c4074f4952f4b58b8624c19aa8ec` |
| Wesker CG15 First Step | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-c48a6c42-2adb-47ed-a747-ca614817a94b.png` | `public/cg/resident-evil/wesker/first-step-openai-v1.png` | 2 016 553 | `3e66aefb6a49a381b35936a91c36fd63ec851f7dbd65e4f9217e13065dc66a9e` |
| Jill CG09 Beach | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-7475251b-5150-42a9-ba9a-3eebaa1d092f.png` | `public/cg/resident-evil/jill/beach-family-openai-v1.png` | 2 102 901 | `275bb0f5de7063373692625f0ccbd51935924f1c5222093ad251aed1fe8088f9` |
| Jill CG10 Service | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-7e05d515-7612-4afc-bcd7-605c8a85a238.png` | `public/cg/resident-evil/jill/maid-service-openai-v1.png` | 1 849 121 | `acf6bd9c0c6a1fe40d48e37924f8ccda1e9235d395aa811e7509d9ab01d85920` |
| Jill CG11 Goofy | `C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-0787c7b6-e33b-4938-bcac-793e99d466e9.png` | `public/cg/resident-evil/jill/goofy-openai-v1.png` | 2 259 102 | `ad7775b2394073c1a1977d99a95920e9a84697e89f3ee2bd5411ade9313d285a` |
| Jill CG12 Alignment | `C:\Users\chuck\.codex\generated_images\019fbcaa-571b-7071-a290-577322f40a7e\exec-c855f50d-0d62-4965-bb16-ff29a3266526.png` | `public/cg/resident-evil/jill/alignment-swap-openai-v1.png` | 2 205 826 | `6ba64b9c74670c7330bedfe42ac43345d5c09d0fd52bd8d161727e9c2e18eb62` |
| Jill CG13 Gender | `C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-35b718fb-af16-45b3-b117-c600940102c9.png` | `public/cg/resident-evil/jill/gender-swap-openai-v1.png` | 1 957 411 | `d761a21ae3fb020907fc378f26d0a596e224149ed9ab90d6fa787501aaa446d9` |
| Jill CG14 Zombie | `C:\Users\chuck\.codex\generated_images\019fbcaa-3023-7343-9b69-8486f2f0478c\exec-fe9bb80a-4f59-49da-9277-5600b01ad0bf.png` | `public/cg/resident-evil/jill/zombie-version-openai-v1.png` | 1 952 766 | `c5c464be5ee5b83eb2d0dc26b2b967415a5a595537163280a7189aaf809d12e9` |
| Jill CG15 Future | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-f2a67ae0-85ef-4bf5-9f1d-2354991a73e0.png` | `public/cg/resident-evil/jill/future-experienced-openai-v1.png` | 1 927 377 | `7e2213df0d703a0177e10a3552a9032371780b699518ec98019fbb9f4c655303` |

Les douze sorties non normalisées ont un SHA-256 source ImageGen = destination. Les quatorze finales sont des PNG sRGB RGB opaques de 1086 × 1448, et leurs quatorze SHA-256 sont distincts.

### Normalisations de format autorisées

- Wesker CG11 brut : 1085×1450, 2 097 326 octets, SHA-256 `519eafd69b2b96f04233de6107fce1dc521b2e41ca58562d651a3932dd8e6f03`.
- Wesker CG12 brut : 1086×1449, 2 311 659 octets, SHA-256 `b1443c9086706871164de766ee2ce799ead6d07ce420d86aeb0b270315335720`.

Une normalisation géométrique déterministe de 1–2 pixels par plus proche voisin a produit exactement 1086×1448 sans retouche de contenu, interpolation lissante, ajout ni suppression d'objet. Les deux sources normalisées transitoires ont été inspectées en résolution originale; leur hash a été vérifié identique à celui de la destination avant suppression des transitoires.

## États Jill rejetés et remplacés

Tous les états ci-dessous avaient un concept sûr mais un medium trop lisse, pictural ou semi-réaliste par rapport au pixel art natif de Jill CG01. Aucun de ces hashes ne se trouve dans les chemins de production finaux.

| Asset / état | Emplacement ou statut | Dimensions | Octets | SHA-256 | Décision |
|---|---|---:|---:|---|---|
| CG09 Beach initial | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-55e40df4-7854-4ca5-90e0-0fbe1a41ce9a.png` | 1086×1448 RGB | 2 195 459 | `e57d5ce2d111d3707282c4f98e24324d2f23cd5180d7b2629d2dcbff97bc5796` | Surfaces et peau lissées; correction ciblée de medium. |
| CG10 Service initial | Ancien fichier production, remplacé après contrôle | 1086×1448 RGB | 2 188 202 | `1a4a73e26ae792fa043acd16d111adce86a526c3100fe4e9a50e5a2e436a206a` | Concept professionnel valide, finition trop lisse. |
| CG11 Goofy initial | Ancien fichier production, remplacé; détails dans le doc lié | 1086×1448 RGB | 2 099 427 | `47620add7034ea0e109fff2299efe92c16544be9f3a4e73d5f987307fdafabdc` | Herbes/composition valides, contours anti-aliasés et painterly. |
| CG12 Alignment initial | Ancien fichier production, remplacé; détails dans le doc lié | 1086×1448 RGB | 1 860 449 | `b7177a2e20d75288b6bd490ae9949a99b80eba1a7deeb8fc8da7d157408e8ae9` | Concept rouge/noir valide, sans clusters pixel visibles. |
| CG13 Gender initial production | Ancien fichier production, remplacé; détails dans le doc lié | 1086×1448 RGB | 2 001 620 | `ffa451f09a019fbc0e8b7046c78be6acf8b8fb954e69a005e995cb4304806af0` | Variante masculine valide, rendu peau/tissu/décor pictural. |
| CG13 Gender exploration parallèle | Source ImageGen jamais copiée en production | 1086×1448 RGB | 1 808 592 | `eb2c4b4f1fea040c627992f628e64d504e236f9a9d62f0212c35cc5fe8a9269f` | Même rejet de medium; jamais retenue. |
| CG14 Zombie initial production | Ancien fichier production, remplacé; détails dans le doc lié | 1086×1448 RGB | 2 030 636 | `61bce5db55048fdb99984c4af479ad395bd2d18365709edda2b26d8166e0e3d8` | Infection sûre/lisible, rendu pictural ou photoréaliste. |
| CG14 Zombie exploration parallèle | Source ImageGen jamais copiée en production | 1086×1448 RGB | 1 976 467 | `d5fc6706de3aa78015342d6d1e3ca71e6a0b31fa3f48d05b5ac6f4d901f32507` | Concept valide, medium trop lisse; jamais retenue. |
| CG15 Future initial | `C:\Users\chuck\.codex\generated_images\019fbcaa-41a9-7143-8508-6657d3e9edb6\exec-306e7643-289c-4b53-81cc-dbd567ed4f4a.png` | 1086×1449 RGB | 1 865 944 | `ec363d4e7d7ebd2d37539418bc465597bfd8996032d30dcf267f945cbfa9c380` | Continuité/composition valides, medium trop lisse et hauteur +1 px. |

## Corrections Jill documentées

Les corrections ont chacune utilisé un appel built-in ImageGen distinct, avec l'état lisse comme cible d'édition et Jill CG01 comme référence stricte de medium pixel-art. Les prompts exacts, rôles des entrées, hashes avant/après et contrôles en résolution originale sont conservés ici :

- [Jill — corrections de style `goofy` et `alignmentSwap`](./jill-goofy-alignment-style-corrections-openai-v1.md).
- [Jill — corrections CG13 `genderSwap` et CG14 `zombieVersion`](./jill-gender-zombie-style-corrections-openai-v1.md).

Les corrections CG09 Beach, CG10 Service et CG15 Future ont suivi le même contrat : préserver identité, sujet, vêtements, accessoires, décor, caméra et composition, et remplacer exclusivement le medium lisse par des grappes carrées visibles, contours en escalier, aplats hard-edge et ombrages limités conformes à CG01. Chaque finale a été inspectée en résolution originale avant remplacement.
