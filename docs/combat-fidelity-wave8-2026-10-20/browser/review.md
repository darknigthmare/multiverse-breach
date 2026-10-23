Les deux parcours navigateur W8 sont validés et figés. Le contrôle appelle réellement `drawPixelSprite` et intercepte les appels Canvas2D `drawImage` du renderer chargé par Vite ; il ne simule pas les rectangles avec une copie du renderer.

- Présentations :96 planches complètes et1 partielle,770 phases exposées,6 160 appels natifs P1/P2. Beast Boy représente8 poses natives de T-Rex, soit16 affichages des deux côtés. Les24 poses humaines écartées ne sont pas exposées ; leurs48 cas utilisent la véritable base gorille. Robin, Raven et Starfire restent absents du catalogue natif.
- Bases :44 héros et1 408 affichages RPG, dont17 nouvelles bases/544 affichages et27 anciennes/864 affichages.
- Historique :80 anciens objets du catalogue et leurs SHA sont identiques au runtime-baseline ; les5 120 anciens affichages ont exactement les mêmes rectangles et transformations. Les SHA des27 anciennes bases et les864 géométries correspondantes sont inchangés. Les quatre rapports/traces W7 ont seulement été lus, jamais réécrits ; leurs SHA et dates sont dans `evidence.json`.
- Géométrie :cellules source256² intégrales, miroir P2, sourceHeroId et univers stricts, facteurs par rangée autour de baseline244. Les sept bases antérieures à W6 conservent leur géométrie historique et leur baseline232. Les1 408 acteurs,44 layouts de bases et les objets de registre/roster restent inchangés après rendu. La progression autoritaire des6 160 poses natives reste figée malgré le changement du temps cosmétique ;194 identités croisées sont rejetées.

La revue des captures et montages confirme les corps complets de Cyborg, du gorille et du T-Rex ; les cinq silhouettes Yakuza, le quadrupède Blade Wolf et les identités cybernétiques MGR ; et les proportions distinctes des humains, de l'elfe, du nain et du half-foot de Dungeon Meshi. Les captures individuelles sont intégrales P1/P2. Les montages `*-both-sides.png` montrent deux phases représentatives sans découper les corps ; les contacts P1 recadrés peuvent laisser voir une partie du voisin P2 au bord et ne servent pas de preuve des limites de l'asset source.

Aucune erreur JavaScript ou de chargement de sprite n'est relevée. La seule requête externe échouée concerne Google Fonts (`ERR_TUNNEL_CONNECTION_FAILED`). Les poses sont des adaptations générées ; cette validation technique ne certifie pas une reproduction officielle1:1. Les timings de dégâts et les règles des moteurs relèvent des autres suites de cette vague.

Les deux défauts initiaux du harness étaient son préchargement incomplet de la base gorille et une comparaison de zéros signés dans les matrices historiques. Ils sont résolus dans le harness ; aucun correctif de production n'en découle. Le premier diagnostic de comparaison reste archivé comme historique du harness.

Reproduction depuis le projet avec Vite sur le port5188 :

```sh
node docs/combat-fidelity-wave8-2026-10-20/browser/native-presentations.mjs
node docs/combat-fidelity-wave8-2026-10-20/browser/base-corrections.mjs
```

Les traces,34 captures individuelles, montages et empreintes des deux harnesses se trouvent dans ce dossier. `evidence.json` conserve les compteurs séparés full32/partiel, la preuve du repli gorille et les SHA des quatre fichiers artistiques Part A, restés figés pendant le contrôle.
